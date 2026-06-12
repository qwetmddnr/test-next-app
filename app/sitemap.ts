import type { MetadataRoute } from "next";
import { getAllResultParams, getAllTests, getEntryPath } from "@/lib/test/loader";
import { getAllArticles } from "@/lib/blog/loader";

// 매일 새 AI 인사이트가 생성되는 운세 테스트 — sitemap의 changeFrequency/priority를 daily로 높임.
const DAILY_TESTS = new Set(["tarot", "new-year", "zodiac"]);

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
  const now = new Date();

  // 각 테스트의 entryPath를 사용해 redirect 없이 final URL을 노출.
  // (fortune 카테고리는 /tarot, /saju 등 별도 라우트로 살아있음)
  const tests = getAllTests()
    .filter((t) => !t.comingSoon)
    .map((t) => {
      const isDaily = DAILY_TESTS.has(t.slug);
      return {
        url: `${baseUrl}${getEntryPath(t)}`,
        lastModified: now,
        changeFrequency: (isDaily ? "daily" : "weekly") as
          | "daily"
          | "weekly",
        priority: isDaily ? 0.9 : 0.8,
      };
    });

  const articles = getAllArticles().map((a) => ({
    url: `${baseUrl}/magazine/${a.slug}`,
    lastModified: a.updatedAt ?? a.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const results = getAllResultParams().map((r) => {
    const isDaily = DAILY_TESTS.has(r.type);
    return {
      url: `${baseUrl}/result/${r.type}/${r.id}`,
      lastModified: now,
      changeFrequency: (isDaily ? "daily" : "monthly") as
        | "daily"
        | "monthly",
      priority: isDaily ? 0.8 : 0.6,
    };
  });

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tests`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/magazine`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...articles,
    ...tests,
    ...results,
  ];
}
