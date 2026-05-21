// 사주팔자 계산 모듈 — 서버 사이드 전용
// lunar-javascript 의존: 양력/음력 → 8자 (4기둥) + 일간 + 오행 분포
//
// 일간(日干) = 본인의 명리적 핵심 성격 키. 10천간 중 하나.
// 결과 페이지의 result ID로 사용 → AI 인사이트 영구 캐시 키 (MBTI 패턴).

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Solar, Lunar } = require("lunar-javascript") as {
  Solar: {
    fromYmdHms: (
      y: number,
      m: number,
      d: number,
      hour: number,
      minute: number,
      second: number
    ) => SolarInstance;
  };
  Lunar: {
    fromYmdHms: (
      y: number,
      m: number,
      d: number,
      hour: number,
      minute: number,
      second: number
    ) => LunarInstance;
  };
};

interface LunarInstance {
  getEightChar: () => EightChar;
}

interface SolarInstance {
  getLunar: () => LunarInstance;
}

interface EightChar {
  getYearGan: () => string;
  getYearZhi: () => string;
  getMonthGan: () => string;
  getMonthZhi: () => string;
  getDayGan: () => string;
  getDayZhi: () => string;
  getTimeGan: () => string;
  getTimeZhi: () => string;
}

// 10 천간 (Chinese → Korean)
const GAN_HANJA = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
const GAN_KOREAN = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"] as const;
const GAN_ID = ["jia", "yi", "bing", "ding", "wu", "ji", "geng", "xin", "ren", "gui"] as const;

// 12 지지 (Chinese → Korean)
const ZHI_HANJA = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;
const ZHI_KOREAN = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"] as const;

// 5 오행
export type Element = "wood" | "fire" | "earth" | "metal" | "water";
const ELEMENT_KOREAN: Record<Element, string> = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
};

// 천간 → 오행
const GAN_TO_ELEMENT: Record<string, Element> = {
  甲: "wood", 乙: "wood",
  丙: "fire", 丁: "fire",
  戊: "earth", 己: "earth",
  庚: "metal", 辛: "metal",
  壬: "water", 癸: "water",
};

// 지지 → 오행 (지장간의 본기 기준)
const ZHI_TO_ELEMENT: Record<string, Element> = {
  寅: "wood", 卯: "wood",
  巳: "fire", 午: "fire",
  辰: "earth", 戌: "earth", 丑: "earth", 未: "earth",
  申: "metal", 酉: "metal",
  亥: "water", 子: "water",
};

export type DayMasterId = (typeof GAN_ID)[number];

export interface Pillar {
  ganHanja: string;
  ganKorean: string;
  zhiHanja: string;
  zhiKorean: string;
  ganElement: Element;
  zhiElement: Element;
}

export interface SajuInput {
  year: number;
  month: number;
  day: number;
  hour: number | null; // 0~23, null = 시 모름
  calendar: "solar" | "lunar";
}

export interface SajuResult {
  input: SajuInput;
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
  };
  dayMasterId: DayMasterId; // 일간 (10천간 중 하나)
  dayMasterKorean: string;
  dayMasterElement: Element;
  elements: Record<Element, number>; // 천간/지지 8글자의 오행 누계
}

function ganHanjaToKorean(hanja: string): string {
  const idx = GAN_HANJA.indexOf(hanja as (typeof GAN_HANJA)[number]);
  return idx >= 0 ? GAN_KOREAN[idx] : hanja;
}

function ganHanjaToId(hanja: string): DayMasterId {
  const idx = GAN_HANJA.indexOf(hanja as (typeof GAN_HANJA)[number]);
  if (idx < 0) throw new Error(`Unknown gan: ${hanja}`);
  return GAN_ID[idx];
}

function zhiHanjaToKorean(hanja: string): string {
  const idx = ZHI_HANJA.indexOf(hanja as (typeof ZHI_HANJA)[number]);
  return idx >= 0 ? ZHI_KOREAN[idx] : hanja;
}

function pillarFromGanZhi(ganHanja: string, zhiHanja: string): Pillar {
  return {
    ganHanja,
    ganKorean: ganHanjaToKorean(ganHanja),
    zhiHanja,
    zhiKorean: zhiHanjaToKorean(zhiHanja),
    ganElement: GAN_TO_ELEMENT[ganHanja] ?? "earth",
    zhiElement: ZHI_TO_ELEMENT[zhiHanja] ?? "earth",
  };
}

function emptyElements(): Record<Element, number> {
  return { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
}

export function elementKorean(el: Element): string {
  return ELEMENT_KOREAN[el];
}

export function calculateSaju(input: SajuInput): SajuResult {
  const { year, month, day, hour, calendar } = input;

  // 시 모름이면 lunar-javascript에 0시를 넣고 결과에서 時柱를 제외.
  const hourForLib = hour ?? 0;

  let eightChar: EightChar;
  if (calendar === "solar") {
    const solar = Solar.fromYmdHms(year, month, day, hourForLib, 0, 0);
    eightChar = solar.getLunar().getEightChar();
  } else {
    const lunar = Lunar.fromYmdHms(year, month, day, hourForLib, 0, 0);
    eightChar = lunar.getEightChar();
  }

  const yearPillar = pillarFromGanZhi(eightChar.getYearGan(), eightChar.getYearZhi());
  const monthPillar = pillarFromGanZhi(eightChar.getMonthGan(), eightChar.getMonthZhi());
  const dayPillar = pillarFromGanZhi(eightChar.getDayGan(), eightChar.getDayZhi());
  const hourPillar =
    hour === null
      ? null
      : pillarFromGanZhi(eightChar.getTimeGan(), eightChar.getTimeZhi());

  const dayMasterId = ganHanjaToId(eightChar.getDayGan());
  const dayMasterIndex = GAN_HANJA.indexOf(
    eightChar.getDayGan() as (typeof GAN_HANJA)[number]
  );

  const elements = emptyElements();
  const accumulate = (p: Pillar | null) => {
    if (!p) return;
    elements[p.ganElement] += 1;
    elements[p.zhiElement] += 1;
  };
  accumulate(yearPillar);
  accumulate(monthPillar);
  accumulate(dayPillar);
  accumulate(hourPillar);

  return {
    input,
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
    },
    dayMasterId,
    dayMasterKorean: GAN_KOREAN[dayMasterIndex],
    dayMasterElement: GAN_TO_ELEMENT[eightChar.getDayGan()],
    elements,
  };
}

export { GAN_KOREAN, GAN_ID, GAN_HANJA, ZHI_KOREAN, ZHI_HANJA };
