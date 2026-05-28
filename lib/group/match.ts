import type { TestDefinition, TestResult } from "@/lib/types/test";
import type { GroupMemberRecord, MatchScore, MemberPair } from "./types";

function resultById(test: TestDefinition, id: string): TestResult | null {
  return test.results.find((r) => r.id === id) ?? null;
}

// A 입장에서 본 B의 매칭 점수 (단방향).
function directionalScore(
  test: TestDefinition,
  fromId: string,
  toId: string
): MatchScore {
  const from = resultById(test, fromId);
  if (!from) return "neutral";
  if (from.matches.includes(toId)) return "match";
  if (from.avoid.includes(toId)) return "avoid";
  return "neutral";
}

// 두 멤버 사이 종합 점수.
// - 양쪽 모두 match → match(mutual)
// - 양쪽 모두 avoid → avoid(mutual)
// - 한쪽이 match + 다른쪽 neutral → match
// - 한쪽이 avoid + 다른쪽 neutral → avoid
// - 한쪽 match + 다른쪽 avoid → neutral (의견 충돌 → 중간)
// - 양쪽 neutral → neutral
export function pairScore(
  test: TestDefinition,
  a: GroupMemberRecord,
  b: GroupMemberRecord
): { score: MatchScore; mutual: boolean } {
  const aToB = directionalScore(test, a.result_id, b.result_id);
  const bToA = directionalScore(test, b.result_id, a.result_id);

  if (aToB === "match" && bToA === "match") {
    return { score: "match", mutual: true };
  }
  if (aToB === "avoid" && bToA === "avoid") {
    return { score: "avoid", mutual: true };
  }
  if (
    (aToB === "match" && bToA === "avoid") ||
    (aToB === "avoid" && bToA === "match")
  ) {
    return { score: "neutral", mutual: false };
  }
  if (aToB === "match" || bToA === "match") {
    return { score: "match", mutual: false };
  }
  if (aToB === "avoid" || bToA === "avoid") {
    return { score: "avoid", mutual: false };
  }
  return { score: "neutral", mutual: false };
}

export function allPairs(
  test: TestDefinition,
  members: GroupMemberRecord[]
): MemberPair[] {
  const pairs: MemberPair[] = [];
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const { score, mutual } = pairScore(test, members[i], members[j]);
      pairs.push({ a: members[i], b: members[j], score, mutual });
    }
  }
  return pairs;
}
