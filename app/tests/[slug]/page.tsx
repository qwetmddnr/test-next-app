import { notFound, redirect } from "next/navigation";
import { TestRunner } from "@/components/test/TestRunner";
import { getTest } from "@/lib/test/loader";

// 별도 entry 페이지를 가진 테스트는 그쪽으로 리다이렉트
const ENTRY_REDIRECTS: Record<string, string> = {
  tarot: "/tarot",
  "new-year": "/new-year",
};

export default async function TestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (ENTRY_REDIRECTS[slug]) {
    redirect(ENTRY_REDIRECTS[slug]);
  }
  const test = getTest(slug);
  if (!test) notFound();
  if (test.questions.length === 0) notFound();
  return <TestRunner test={test} />;
}
