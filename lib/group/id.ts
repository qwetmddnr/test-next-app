import crypto from "crypto";

// URL-safe 8자 short id. 헷갈리는 글자(i/l/o/0/1) 제외한 30자 알파벳.
// 8자 * 30^8 ≈ 6.5e11 — 충돌 가능성 충분히 낮음. 충돌 시 한 번 재시도.
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

export function generateGroupId(length = 8): string {
  const bytes = crypto.randomBytes(length);
  let id = "";
  for (let i = 0; i < length; i++) {
    id += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return id;
}
