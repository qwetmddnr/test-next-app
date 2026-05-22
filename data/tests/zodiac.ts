import type { TestDefinition, TestResult } from "@/lib/types/test";

type ZodiacSignInput = {
  id: string;
  title: string;
  emoji: string;
  shortDesc: string;
  description: string;
  traits: string[];
  // [month, day] inclusive start of this sign's range
  startMonth: number;
  startDay: number;
};

// 12 서양 별자리. ranges는 일반적인 trophical zodiac 기준.
// 염소자리만 연도 경계를 넘어가므로 (12/22 ~ 1/19) startMonth가 12.
const SIGNS: ZodiacSignInput[] = [
  {
    id: "capricorn",
    title: "염소자리",
    emoji: "🐐",
    shortDesc: "묵묵한 노력이 산을 옮기는 스타일",
    description: "한 걸음씩 단단히 쌓아가는 끈기가 가장 큰 무기예요. 화려한 시작보다 흔들리지 않는 마무리에서 진가가 드러나는 타입. 책임감이 깊고 신뢰가 두터워, 시간을 들일수록 자기 자리를 확실히 만들어 갑니다. 다만 너무 자신을 몰아세우지 말 것, 쉬어가는 여유가 더 멀리 가는 길을 만들어요.",
    traits: ["성실함", "인내", "현실감", "책임감"],
    startMonth: 12,
    startDay: 22,
  },
  {
    id: "aquarius",
    title: "물병자리",
    emoji: "🏺",
    shortDesc: "독창적인 시선이 길을 여는 스타일",
    description: "남들과 다른 각도로 세상을 보는 감각이 매력이에요. 자유로움을 사랑하면서도 함께하는 가치를 잊지 않는 따뜻한 이상주의자 타입. 새로운 아이디어를 자연스럽게 떠올리고, 익숙한 것을 새롭게 바꾸는 힘이 있어요. 다만 너무 거리감을 두진 말 것, 진심을 조금 더 보여주면 인연이 더 깊어집니다.",
    traits: ["독창성", "자유", "이상", "지적호기심"],
    startMonth: 1,
    startDay: 20,
  },
  {
    id: "pisces",
    title: "물고기자리",
    emoji: "🐟",
    shortDesc: "감성과 직관이 흐르는 스타일",
    description: "마음의 결을 가장 섬세하게 읽는 감수성이 큰 자산이에요. 부드럽고 공감 능력이 깊어 사람들의 마음에 자연스럽게 스며드는 타입. 상상력과 직관이 풍부해 예술·창작·치유의 영역에서 빛납니다. 다만 너무 모든 감정을 떠안지는 말 것, 자기만의 안식처를 챙겨가야 오래갈 수 있어요.",
    traits: ["감성", "공감", "직관", "낭만"],
    startMonth: 2,
    startDay: 19,
  },
  {
    id: "aries",
    title: "양자리",
    emoji: "🐏",
    shortDesc: "용기와 추진력이 길을 여는 스타일",
    description: "망설임 없이 첫 발을 내딛는 용기가 매력이에요. 새로움 앞에서 가장 빛나는 개척자 타입. 솔직하고 직진형이라 사람들이 따라오게 만드는 힘이 있어요. 다만 너무 서두르지는 말 것, 한 호흡 고르고 가면 끝까지 가는 힘이 더 단단해집니다.",
    traits: ["용기", "추진력", "솔직함", "에너지"],
    startMonth: 3,
    startDay: 21,
  },
  {
    id: "taurus",
    title: "황소자리",
    emoji: "🐮",
    shortDesc: "단단함과 풍요가 함께하는 스타일",
    description: "차분하게 자기 자리를 지키며 좋은 것을 천천히 누리는 여유가 매력이에요. 안정감 있고 미적 감각이 뛰어나, 일상을 풍요롭게 채우는 데 능숙한 타입. 한번 믿은 사람과 일에는 깊이 헌신합니다. 다만 너무 변화를 피하지는 말 것, 작은 새로움이 더 큰 즐거움을 데려와요.",
    traits: ["안정감", "미적감각", "근면", "신뢰"],
    startMonth: 4,
    startDay: 20,
  },
  {
    id: "gemini",
    title: "쌍둥이자리",
    emoji: "👯",
    shortDesc: "재치와 소통이 빛나는 스타일",
    description: "빠른 두뇌와 다재다능함이 매력이에요. 새로운 정보를 흡수하고 사람들과 연결하는 데 천부적인 감각을 가진 타입. 호기심이 끝없어 늘 새로운 이야기를 풀어내고, 분위기를 살리는 능력이 있어요. 다만 너무 많은 일을 동시에 벌이지는 말 것, 한 번에 하나씩 깊이 들어가면 진짜 결실이 따라옵니다.",
    traits: ["재치", "호기심", "소통", "다재다능"],
    startMonth: 5,
    startDay: 21,
  },
  {
    id: "cancer",
    title: "게자리",
    emoji: "🦀",
    shortDesc: "따뜻한 보호본능이 매력인 스타일",
    description: "곁의 사람을 챙기는 다정함이 가장 큰 무기예요. 감정의 결이 깊고 가족·친구에 대한 애정이 진한 타입. 가까운 사람의 작은 변화도 놓치지 않는 섬세함이 신뢰를 만들어요. 다만 너무 안에만 두지는 말 것, 마음을 표현하는 작은 한마디가 관계를 더 단단하게 합니다.",
    traits: ["다정함", "보호본능", "감수성", "헌신"],
    startMonth: 6,
    startDay: 22,
  },
  {
    id: "leo",
    title: "사자자리",
    emoji: "🦁",
    shortDesc: "당당한 빛이 사람을 끌어모으는 스타일",
    description: "타고난 자신감과 따뜻한 카리스마가 매력이에요. 사람들의 시선을 즐기면서도 곁의 사람을 너그럽게 챙기는 리더 타입. 한 번 결심하면 끝까지 가는 의지가 큰 무기. 다만 인정받고 싶은 마음을 너무 앞세우지 말 것, 묵묵히 빛나는 순간이 더 큰 신뢰를 만들어요.",
    traits: ["카리스마", "자신감", "관대함", "리더십"],
    startMonth: 7,
    startDay: 23,
  },
  {
    id: "virgo",
    title: "처녀자리",
    emoji: "🌾",
    shortDesc: "꼼꼼함과 정성이 결실을 만드는 스타일",
    description: "디테일을 놓치지 않는 눈과 정직한 노력이 큰 자산이에요. 작은 약속도 가볍게 여기지 않고, 자기 일을 완성도 있게 다듬는 타입. 분석력과 실용 감각이 뛰어나 어디서든 신뢰받습니다. 다만 너무 완벽을 추구하다 자신을 다그치지 말 것, 80%의 완성도 충분히 멋질 때가 많아요.",
    traits: ["꼼꼼함", "분석력", "성실함", "실용성"],
    startMonth: 8,
    startDay: 23,
  },
  {
    id: "libra",
    title: "천칭자리",
    emoji: "⚖️",
    shortDesc: "균형과 조화가 매력인 스타일",
    description: "사람과 상황의 결을 잘 읽고 관계의 균형을 만드는 감각이 매력이에요. 미적 감각과 사회성이 모두 뛰어나 분위기를 부드럽게 만드는 타입. 공정함을 중요시하고 사려 깊은 판단을 내려요. 다만 너무 모두를 만족시키려 하지 말 것, 자기 의견을 분명히 할 때 더 빛납니다.",
    traits: ["조화", "사회성", "미적감각", "공정함"],
    startMonth: 9,
    startDay: 23,
  },
  {
    id: "scorpio",
    title: "전갈자리",
    emoji: "🦂",
    shortDesc: "깊은 집중과 통찰이 빛나는 스타일",
    description: "한 번 빠지면 끝까지 파고드는 몰입력이 큰 무기예요. 표면 너머의 본질을 읽어내는 통찰력이 뛰어난 타입. 진심을 준 사람에게는 누구보다 깊이 헌신합니다. 다만 모든 걸 너무 깊게 담아두지는 말 것, 가끔은 가볍게 흘려보내는 여유가 마음을 자유롭게 해요.",
    traits: ["몰입력", "통찰", "열정", "헌신"],
    startMonth: 10,
    startDay: 23,
  },
  {
    id: "sagittarius",
    title: "사수자리",
    emoji: "🏹",
    shortDesc: "자유와 모험이 길을 여는 스타일",
    description: "새로운 세계를 향한 호기심과 낙천적 에너지가 매력이에요. 여행·배움·확장을 사랑하며 큰 그림을 그리는 타입. 솔직하고 유쾌해 어디서든 분위기를 밝게 만들어요. 다만 너무 즉흥적으로 움직이지는 말 것, 조금만 더 챙겨도 더 멀리 갈 수 있습니다.",
    traits: ["자유", "낙천성", "모험심", "확장"],
    startMonth: 11,
    startDay: 22,
  },
];

const results: TestResult[] = SIGNS.map((s) => ({
  id: s.id,
  title: s.title,
  emoji: s.emoji,
  shortDesc: s.shortDesc,
  description: s.description,
  traits: s.traits,
  matches: [],
  avoid: [],
}));

const zodiac: TestDefinition = {
  slug: "zodiac",
  title: "오늘의 별자리 운세",
  description: "생일로 알아보는 12 별자리별 오늘의 운세",
  emoji: "✨",
  estimatedMinutes: 1,
  results,
  questions: [],
  category: "fortune",
  entryPath: "/zodiac",
};

export default zodiac;

// 별자리 매칭: month + day -> sign id.
// 각 별자리의 시작일은 SIGNS의 startMonth/startDay. 다음 별자리 시작일 직전까지가 해당 별자리.
// 염소자리만 연말~연초로 걸쳐 있어 month >= 12 또는 month == 1 + day <= 19 일 때.
export function zodiacFromDate(month: number, day: number): string {
  if (!Number.isFinite(month) || !Number.isFinite(day)) return "aries";
  // 염소자리 special case (12/22 ~ 1/19)
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return "capricorn";
  }
  // 나머지: 시작일과 다음 시작일 사이
  const ordered = SIGNS.filter((s) => s.id !== "capricorn").sort(
    (a, b) => a.startMonth * 100 + a.startDay - (b.startMonth * 100 + b.startDay)
  );
  for (let i = 0; i < ordered.length; i++) {
    const s = ordered[i];
    const next = ordered[i + 1];
    const afterStart =
      month > s.startMonth ||
      (month === s.startMonth && day >= s.startDay);
    const beforeNext = next
      ? month < next.startMonth ||
        (month === next.startMonth && day < next.startDay)
      : true; // last = sagittarius, 다음은 capricorn(별도 처리)
    if (afterStart && beforeNext) return s.id;
  }
  return "aries"; // fallback
}

// 12 별자리 id (정렬 순서: 염소자리부터 = 양력 1월 기준)
export const ZODIAC_SIGN_ORDER = [
  "capricorn",
  "aquarius",
  "pisces",
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
] as const;
