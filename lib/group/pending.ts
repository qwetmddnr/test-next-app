// "모임 참여 도중 테스트하러 이탈"용 sessionStorage 헬퍼.
// JoinFormSection 에서 닉네임 입력 후 "테스트 진행"을 누르면 이 정보를 저장하고
// 테스트 entry 페이지로 이동한다. 결과 페이지(ResultView)는 mount 시 이 값을 읽어
// 본인 결과로 자동 참여 CTA를 표시한다.

const KEY = "pending_group";

export interface PendingGroup {
  group_id: string;
  group_name: string;
  test_type: string;
  nickname: string;
}

function isPendingGroup(v: unknown): v is PendingGroup {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.group_id === "string" &&
    o.group_id.length > 0 &&
    typeof o.group_name === "string" &&
    typeof o.test_type === "string" &&
    o.test_type.length > 0 &&
    typeof o.nickname === "string" &&
    o.nickname.length > 0
  );
}

export function setPendingGroup(p: PendingGroup): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(p));
}

export function getPendingGroup(): PendingGroup | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return isPendingGroup(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearPendingGroup(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
