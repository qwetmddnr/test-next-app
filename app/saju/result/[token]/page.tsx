import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SajuResultView } from "@/components/saju/SajuResultView";
import { lookupSajuByToken } from "@/lib/ai/saju";
import { elementKorean } from "@/lib/saju/calculate";
import { getOtherTests } from "@/lib/test/loader";
import {
  articleJsonLd,
  kstTodayIso,
  SITE_LAUNCH_DATE,
} from "@/lib/seo/structured-data";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://ohna.today";

type Params = Promise<{ token: string }>;

// 결과는 ai_cache에서 즉시 조회 — 동적이지만 캐시 hit은 ms 단위.
export const dynamic = "force-dynamic";

function isValidToken(token: string): boolean {
  return /^[a-f0-9]{32,64}$/i.test(token);
}

// 토큰 기반 개인 결과 페이지 — 검색 색인 대상 아님. OG/SNS 공유는 robots와 별개로 동작.
const NOINDEX: Metadata["robots"] = { index: false, follow: true };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { token } = await params;
  if (!isValidToken(token))
    return { title: "사주 결과를 찾을 수 없어요", robots: NOINDEX };

  const result = await lookupSajuByToken(token);
  if (!result) return { title: "사주 결과를 찾을 수 없어요", robots: NOINDEX };

  const { saju, input } = result;
  const dayMaster = `${saju.pillars.day.ganHanja}${saju.pillars.day.zhiHanja}`;
  const title = `${input.name}님의 사주 — 일간 ${saju.dayMasterKorean}${elementKorean(saju.dayMasterElement)}`;
  const description = `${dayMaster} 일주 · ${input.calendar === "solar" ? "양력" : "음력"} ${input.year}년 ${input.month}월 ${input.day}일 생. AI가 풀어내는 ${input.name}님의 사주 분석.`;

  return {
    title,
    description,
    robots: NOINDEX,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SajuResultPage({ params }: { params: Params }) {
  const { token } = await params;
  if (!isValidToken(token)) notFound();

  const result = await lookupSajuByToken(token);
  if (!result) notFound();

  const otherTests = getOtherTests("saju").filter((t) => t.results.length > 0);

  const dayMaster = `${result.saju.pillars.day.ganHanja}${result.saju.pillars.day.zhiHanja}`;
  const pageUrl = `${SITE_URL}/saju/result/${token}`;
  const jsonLd = articleJsonLd({
    url: pageUrl,
    headline: `${result.input.name}님의 사주 — 일간 ${result.saju.dayMasterKorean}${elementKorean(result.saju.dayMasterElement)}`,
    description: `${dayMaster} 일주, AI가 풀어내는 사주 분석.`,
    image: `${pageUrl}/opengraph-image`,
    datePublished: SITE_LAUNCH_DATE,
    dateModified: kstTodayIso(),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <SajuResultView
        token={token}
        saju={result.saju}
        name={result.input.name}
        aiText={result.aiText}
        otherTests={otherTests}
      />
    </>
  );
}
