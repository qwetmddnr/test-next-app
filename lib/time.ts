// 한국 시간 (KST, UTC+9) 유틸리티.
// DB의 timestamp 컬럼은 TIMESTAMP (without time zone)으로 운영하며 KST naive로 저장한다.
// 명시적으로 timestamp 값을 보낼 때 이 헬퍼를 사용해 KST 시각 ISO 문자열을 생성한다.

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

// 현재 KST 시각을 timezone-less ISO 문자열로 반환 (e.g. "2026-05-22T18:00:00.000").
// PostgreSQL TIMESTAMP 컬럼에 naive 시각으로 저장됨.
export function nowKstIso(): string {
  return new Date(Date.now() + KST_OFFSET_MS).toISOString().slice(0, -1);
}
