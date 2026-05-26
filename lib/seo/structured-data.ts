// 결과 페이지용 schema.org JSON-LD 헬퍼.
// GSC "Crawled - currently not indexed" 분류 비율을 낮추기 위해 콘텐츠 유형을
// 명시 (Article + Organization publisher).

const ORG_NAME = "OHNA";
const ORG_URL = "https://ohna.today";

interface ArticleSchemaParams {
  url: string;
  headline: string;
  description: string;
  image: string;
  datePublished: string; // ISO 8601 (YYYY-MM-DD 도 가능)
  dateModified?: string;
}

export function articleJsonLd(params: ArticleSchemaParams): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.headline,
    description: params.description,
    image: [params.image],
    datePublished: params.datePublished,
    dateModified: params.dateModified ?? params.datePublished,
    inLanguage: "ko-KR",
    author: {
      "@type": "Organization",
      name: ORG_NAME,
      url: ORG_URL,
    },
    publisher: {
      "@type": "Organization",
      name: ORG_NAME,
      url: ORG_URL,
      logo: {
        "@type": "ImageObject",
        url: `${ORG_URL}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": params.url,
    },
  };
  return JSON.stringify(data);
}

// KST 기준 오늘을 YYYY-MM-DD 형식으로
export function kstTodayIso(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

// 사이트 출시 기준일 — daily가 아닌 정적 결과 페이지의 datePublished로 사용
export const SITE_LAUNCH_DATE = "2026-01-01";
