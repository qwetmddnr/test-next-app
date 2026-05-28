// 모임(그룹) 도메인 타입.
// 한 모임 = 한 테스트(matches/avoid가 정의된 fixed-result 테스트).
// 멤버는 닉네임 + 본인 결과 id로 식별.

export interface GroupRecord {
  id: string;
  name: string;
  test_type: string;
  password_hash: string;
  created_at: string;
}

export interface GroupMemberRecord {
  id: number;
  group_id: string;
  nickname: string;
  result_id: string;
  joined_at: string;
}

// 응답에 password_hash는 노출하지 않음.
export type GroupPublic = Omit<GroupRecord, "password_hash">;

export type MatchScore = "match" | "neutral" | "avoid";

export interface MemberPair {
  a: GroupMemberRecord;
  b: GroupMemberRecord;
  score: MatchScore;
  mutual: boolean; // A↔B 양쪽 모두 match/avoid면 true
}

// 모임 대상이 되는 테스트 — matches/avoid 데이터가 있는 fixed-result 테스트만.
// daily 운세(tarot/new-year/zodiac)와 personalized(saju/dream)는 멤버 간 궁합 개념이 없어 제외.
export const GROUP_ELIGIBLE_TEST_SLUGS = [
  "mbti",
  "animal-face",
  "past-life-job",
  "love-style",
] as const;

export type GroupEligibleSlug = (typeof GROUP_ELIGIBLE_TEST_SLUGS)[number];

export function isGroupEligibleTestSlug(
  slug: string
): slug is GroupEligibleSlug {
  return (GROUP_ELIGIBLE_TEST_SLUGS as readonly string[]).includes(slug);
}
