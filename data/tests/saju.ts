import type { TestDefinition } from "@/lib/types/test";

// 사주는 100% personalized — 고정 결과 페이지가 없음.
// 홈/카탈로그 카드 표시용 minimal definition만 유지.
// 결과 페이지는 /saju/result/<token> 별도 동적 라우트에서 처리.
const saju: TestDefinition = {
  slug: "saju",
  title: "나의 사주",
  description: "이름·생년월일·시간으로 보는 나만의 사주 분석",
  emoji: "☯️",
  estimatedMinutes: 1,
  results: [],
  questions: [],
  category: "fortune",
  entryPath: "/saju",
};

export default saju;
