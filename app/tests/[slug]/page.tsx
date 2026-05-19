import { notFound } from "next/navigation";
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
  return <TestRunner test={test} />;
}
