import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DreamResultView } from "@/components/dream/DreamResultView";
import { lookupDreamByToken } from "@/lib/ai/dream";
import { getOtherTests } from "@/lib/test/loader";

type Params = Promise<{ token: string }>;

// 결과는 ai_cache에서 즉시 조회 — 동적이지만 캐시 hit은 ms 단위.
export const dynamic = "force-dynamic";

function isValidToken(token: string): boolean {
  return /^[a-f0-9]{32,64}$/i.test(token);
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { token } = await params;
  if (!isValidToken(token)) return { title: "꿈 해몽 결과를 찾을 수 없어요" };

  const result = await lookupDreamByToken(token);
  if (!result) return { title: "꿈 해몽 결과를 찾을 수 없어요" };

  const preview =
    result.text.length > 50 ? result.text.slice(0, 50) + "…" : result.text;
  const title = "내 꿈 해몽 — OHNA";
  const description = `"${preview}" — AI가 풀어주는 꿈의 의미.`;

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

export default async function DreamResultPage({
  params,
}: {
  params: Params;
}) {
  const { token } = await params;
  if (!isValidToken(token)) notFound();

  const result = await lookupDreamByToken(token);
  if (!result) notFound();

  const otherTests = getOtherTests("dream").filter(
    (t) => t.results.length > 0
  );

  return (
    <DreamResultView
      token={token}
      text={result.text}
      aiText={result.aiText}
      otherTests={otherTests}
    />
  );
}
