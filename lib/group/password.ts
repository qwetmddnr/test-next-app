import crypto from "crypto";

// 모임 비밀번호는 보안 critical X (URL 자체가 secret이고, 모임 데이터는 닉네임/결과만이라 민감 X).
// 평문 노출만 막는 sha256 + group_id salt.
export function hashGroupPassword(password: string, groupId: string): string {
  return crypto
    .createHash("sha256")
    .update(`${groupId}:${password}`)
    .digest("hex");
}

export function verifyGroupPassword(
  password: string,
  groupId: string,
  storedHash: string
): boolean {
  if (typeof storedHash !== "string" || storedHash.length !== 64) return false;
  const computed = hashGroupPassword(password, groupId);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(computed, "hex"),
      Buffer.from(storedHash, "hex")
    );
  } catch {
    return false;
  }
}
