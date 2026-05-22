import type { TestDefinition } from "@/lib/types/test";

// 꿈해몽은 100% personalized — 고정 결과 페이지가 없음.
// 홈/카탈로그 카드 표시용 minimal definition만 유지.
// 결과 페이지는 /dream/result/<token> 별도 동적 라우트에서 처리.
const dream: TestDefinition = {
  slug: "dream",
  title: "꿈 해몽",
  description: "어젯밤 꾼 꿈을 적으면 AI가 풀어드려요",
  emoji: "🌙",
  estimatedMinutes: 1,
  results: [],
  questions: [],
  category: "fortune",
  entryPath: "/dream",
};

export default dream;
