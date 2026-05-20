import { notFound, redirect } from "next/navigation";
import { TestRunner } from "@/components/test/TestRunner";
import { getTest } from "@/lib/test/loader";

export default async function TestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const test = getTest(slug);
  if (!test) notFound();
  if (test.entryPath && test.entryPath !== `/tests/${slug}`) {
    redirect(test.entryPath);
  }
  if (test.comingSoon) {
    redirect(test.entryPath ?? "/");
  }
  if (test.questions.length === 0) notFound();
  return <TestRunner test={test} />;
}
