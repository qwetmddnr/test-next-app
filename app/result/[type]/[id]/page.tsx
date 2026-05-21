import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResultView } from "@/components/result/ResultView";
import { getAIInsight } from "@/lib/ai/insight";
import { getAllResultParams, getOtherTests, getResult } from "@/lib/test/loader";

type Params = Promise<{ type: string; id: string }>;

// 일일 운세(타로/띠운세) 결과를 매일 갱신하기 위해 ISR로 24시간 revalidate.
// 다른 테스트 결과도 같은 주기로 재생성되지만 ai_cache 키가 영구라 캐시 히트 → API 호출 없음.
export const revalidate = 86400;

const DAILY_TESTS = new Set(["tarot", "new-year"]);

function todayLabelKR(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(kst.getUTCDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

export async function generateStaticParams() {
  return getAllResultParams();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { type, id } = await params;
  const found = getResult(type, id);
  if (!found) return { title: "결과를 찾을 수 없어요" };

  const { test, result } = found;
  const title = `${result.emoji} ${result.title} - ${test.title}`;
  const description = `${result.shortDesc} — 나는 어떤 ${test.title.replace(" 테스트", "")}일까? 지금 테스트 해보세요.`;

  return {
    title,
    description,
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

export default async function ResultPage({ params }: { params: Params }) {
  const { type, id } = await params;
  const found = getResult(type, id);
  if (!found) notFound();
  const otherTests = getOtherTests(type);
  const aiInsight = await getAIInsight({
    test: found.test,
    result: found.result,
  });
  const dailyLabel = DAILY_TESTS.has(type) ? todayLabelKR() : null;
  return (
    <ResultView
      test={found.test}
      result={found.result}
      otherTests={otherTests}
      aiInsight={aiInsight}
      dailyLabel={dailyLabel}
    />
  );
}
