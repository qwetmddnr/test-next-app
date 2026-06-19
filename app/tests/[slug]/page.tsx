import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { TestRunner } from "@/components/test/TestRunner";
import { TestAbout } from "@/components/test/TestAbout";
import { getTest } from "@/lib/test/loader";
import { getTestAbout } from "@/data/landing/test-about";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://ohna.today";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const test = getTest(slug);
  if (!test) return {};
  return {
    title: test.title,
    description: test.description,
    alternates: { canonical: `/tests/${slug}` },
    openGraph: {
      title: `${test.title} | 오나 OHNA`,
      description: test.description,
      type: "website",
      locale: "ko_KR",
      url: `${SITE_URL}/tests/${slug}`,
    },
  };
}

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

  const about = getTestAbout(slug);
  const faqJsonLd =
    about?.faq && about.faq.length > 0
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: about.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        })
      : null;

  return (
    <>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqJsonLd }}
        />
      )}
      <TestRunner test={test} />
      {about && <TestAbout about={about} testTitle={test.title} />}
    </>
  );
}
