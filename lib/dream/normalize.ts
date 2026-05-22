// 꿈 텍스트 정규화: 캐시 키 안정성을 위해 같은 의미의 입력이 같은 hash가 되도록.
// - 유니코드 NFC 정규화 (한글 조합 안정화)
// - 양옆 공백 제거
// - 연속 공백/줄바꿈을 단일 공백으로
// - lowercase는 적용하지 않음 (한글에서 무의미, 영문 고유명사 의미 보존)

export function normalizeDreamText(raw: string): string {
  return raw.normalize("NFC").trim().replace(/\s+/g, " ");
}

export const DREAM_TEXT_MIN = 10;
export const DREAM_TEXT_MAX = 500;
