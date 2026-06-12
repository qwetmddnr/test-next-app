// 매거진(블로그) 아티클 데이터 모델.
// 결과/테스트와 분리된 읽을거리 콘텐츠 — SEO/AdSense용 본문 중심 페이지.

export interface ArticleBullet {
  // term이 있으면 "용어 — 설명" 형태로 강조 렌더
  term?: string;
  desc: string;
}

export interface ArticleSection {
  heading: string; // h2로 렌더
  body: string[]; // 문단 배열
  bullets?: ArticleBullet[];
}

export interface ArticleFaq {
  q: string;
  a: string;
}

export type ArticleCategory = "심리" | "운세" | "테스트" | "라이프";

export interface Article {
  slug: string;
  title: string;
  // meta description 겸 카드 부제 (155자 이내 권장)
  description: string;
  emoji: string;
  category: ArticleCategory;
  publishedAt: string; // YYYY-MM-DD (KST 기준)
  updatedAt?: string; // YYYY-MM-DD
  readMinutes: number;
  // 본문 진입 리드 문단 (1~2문장)
  lead: string;
  sections: ArticleSection[];
  faq?: ArticleFaq[];
  // 내부 링크할 테스트 slug 목록 (lib/test/loader의 slug와 일치)
  relatedTests?: string[];
  tags?: string[];
}
