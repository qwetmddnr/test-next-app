import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { getArticle, getAllArticleSlugs, getOtherArticles } from "@/lib/blog/loader";
import { getTest, getEntryPath } from "@/lib/test/loader";
import { articleJsonLd } from "@/lib/seo/structured-data";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://ohna.today";

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const url = `${SITE_URL}/magazine/${slug}`;
  return {
    title: article.title,
    description: article.description,
    keywords: article.tags,
    alternates: { canonical: `/magazine/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      locale: "ko_KR",
      url,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const url = `${SITE_URL}/magazine/${slug}`;
  const jsonLd = articleJsonLd({
    url,
    headline: article.title,
    description: article.description,
    image: `${url}/opengraph-image`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
  });

  const faqJsonLd = article.faq?.length
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      })
    : null;

  const relatedTests = (article.relatedTests ?? [])
    .map((s) => getTest(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t) && !t!.comingSoon);

  const otherArticles = getOtherArticles(slug, 3);

  return (
    <main className="flex-1 px-5 pb-12 pt-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqJsonLd }}
        />
      )}

      <article className="mx-auto max-w-md">
        <Link
          href="/magazine"
          className="text-sm text-gray-500 transition hover:text-gray-700"
        >
          ← 매거진
        </Link>

        <header className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-bold text-violet-600 ring-1 ring-violet-100">
              {article.category}
            </span>
            <span className="text-[11px] text-gray-400">
              {article.publishedAt} · {article.readMinutes}분 읽기
            </span>
          </div>
          <div className="mb-3 text-5xl">{article.emoji}</div>
          <h1 className="text-2xl font-bold leading-snug tracking-tight text-gray-900">
            {article.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {article.lead}
          </p>
        </header>

        <div className="mt-8 space-y-8">
          {article.sections.map((section, i) => (
            <section key={i}>
              <h2 className="mb-3 text-lg font-bold text-gray-800">
                {section.heading}
              </h2>
              {section.body.map((p, j) => (
                <p
                  key={j}
                  className="mb-3 text-[15px] leading-relaxed text-gray-700"
                >
                  {p}
                </p>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-3 space-y-2.5">
                  {section.bullets.map((b, k) => (
                    <li
                      key={k}
                      className="rounded-xl bg-white/70 p-3 text-[15px] leading-relaxed text-gray-700 ring-1 ring-pink-50"
                    >
                      {b.term && (
                        <strong className="font-bold text-pink-600">
                          {b.term}
                        </strong>
                      )}
                      {b.term ? " — " : ""}
                      {b.desc}
                    </li>
                  ))}
                </ul>
              )}
              {/* 첫 섹션 뒤에 인-아티클 광고 1회 */}
              {i === 0 && <AdSlot slot="magazine-article" />}
            </section>
          ))}
        </div>

        {article.faq && article.faq.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              💬 자주 묻는 질문
            </h2>
            <div className="space-y-3">
              {article.faq.map((f, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/70 p-4 ring-1 ring-violet-100"
                >
                  <p className="mb-1.5 text-sm font-bold text-gray-800">
                    Q. {f.q}
                  </p>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {relatedTests.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              🎯 이 글과 함께 보면 좋은 테스트
            </h2>
            <div className="space-y-3">
              {relatedTests.map((t) => (
                <Link
                  key={t.slug}
                  href={getEntryPath(t)}
                  className="flex items-center gap-4 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-pink-100 backdrop-blur transition hover:shadow-md active:scale-[0.99]"
                >
                  <span className="text-3xl">{t.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-gray-900">
                      {t.title}
                    </div>
                    <div className="truncate text-sm text-gray-500">
                      {t.description}
                    </div>
                  </div>
                  <span className="text-gray-300">›</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {otherArticles.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              📖 다른 매거진 글
            </h2>
            <div className="space-y-2">
              {otherArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/magazine/${a.slug}`}
                  className="flex items-center gap-3 rounded-xl bg-white/60 px-3 py-2.5 text-sm transition hover:bg-white/90"
                >
                  <span className="text-xl">{a.emoji}</span>
                  <span className="min-w-0 flex-1 truncate font-medium text-gray-700">
                    {a.title}
                  </span>
                  <span className="text-gray-300">›</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="mt-12 text-center text-[11px] leading-relaxed text-gray-400">
          오나 매거진의 콘텐츠는 즐거움과 자기 이해를 위한 읽을거리예요. 건강·재정·
          진로 등 중요한 결정은 전문가와 상의해 주세요.
        </p>

        <AdSlot slot="magazine-bottom" />
      </article>
    </main>
  );
}
