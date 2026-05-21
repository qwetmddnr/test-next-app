import type { TestDefinition, TestResult } from "@/lib/types/test";

type ZodiacInput = {
  id: string;
  title: string;
  emoji: string;
  shortDesc: string;
  description: string;
  traits: string[];
};

const ZODIACS: ZodiacInput[] = [
  {
    id: "rat",
    title: "쥐띠",
    emoji: "🐭",
    shortDesc: "영리한 직관이 빛나는 스타일",
    description: "민감한 감각과 빠른 판단력이 당신의 무기예요. 작은 신호도 놓치지 않는 직관이 큰 기회로 이어지는 타입. 새로운 흐름이 시작될 때 가장 빠르게 자리 잡는 적응력으로, 부지런한 손과 영민한 머리가 함께 움직이면 의외의 성과가 따라옵니다.",
    traits: ["영리함", "직관", "적응력", "근면"],
  },
  {
    id: "ox",
    title: "소띠",
    emoji: "🐂",
    shortDesc: "꾸준함이 결실로 이어지는 스타일",
    description: "묵묵히 쌓아온 노력이 단단한 자산이 되는 타입이에요. 화려한 변화보다 안정된 흐름 속에서 진가가 드러납니다. 인내심으로 한 발씩 나아가는 당신을 누군가는 꼭 알아봐줘요. 서두르지 않는 그 페이스가 큰 차이를 만들어요.",
    traits: ["성실함", "인내", "책임감", "묵직함"],
  },
  {
    id: "tiger",
    title: "호랑이띠",
    emoji: "🐯",
    shortDesc: "용기와 카리스마가 통하는 스타일",
    description: "강한 추진력과 당당한 태도가 사람들을 끌어당기는 타입이에요. 망설였던 일에 본격적으로 도전해보면 의외의 결과가 보입니다. 다만 너무 앞만 보고 달리지는 말 것, 곁의 사람들과 박자를 맞추면 더 큰 길이 열려요.",
    traits: ["카리스마", "용기", "추진력", "리더십"],
  },
  {
    id: "rabbit",
    title: "토끼띠",
    emoji: "🐰",
    shortDesc: "섬세함이 행복을 부르는 스타일",
    description: "온화한 마음과 세심한 감각이 좋은 인연을 만드는 타입이에요. 작은 배려가 큰 신뢰로 돌아오고, 따뜻한 분위기 속에서 가장 자기다워집니다. 다만 너무 양보만 하지는 말 것, 본인 마음도 챙기는 균형이 행복을 길게 가져가는 비결이에요.",
    traits: ["온화함", "섬세함", "친화력", "감수성"],
  },
  {
    id: "dragon",
    title: "용띠",
    emoji: "🐲",
    shortDesc: "야망과 비전이 빛을 발하는 스타일",
    description: "큰 그림을 그리는 당신의 비전이 현실로 옮겨지는 타입이에요. 망설였던 도전 앞에 자신감이 회복되고, 사람들의 시선이 자연스럽게 따라옵니다. 한 번 결정하면 끝까지 가는 추진력이 큰 무기. 다만 외로움이 따라올 수 있으니 곁의 사람을 잊지 마세요.",
    traits: ["야망", "카리스마", "비전", "결단력"],
  },
  {
    id: "snake",
    title: "뱀띠",
    emoji: "🐍",
    shortDesc: "지혜와 통찰이 깊은 스타일",
    description: "조용히 관찰하는 눈이 가장 정확한 답을 찾는 타입이에요. 직관이 잘 맞는 편이고, 깊이 있는 판단이 사람들의 신뢰를 얻습니다. 큰 결정 앞에서 서두르지 말고 충분히 생각할 시간을 가지면, 결과가 만족스럽게 따라와요.",
    traits: ["지혜", "통찰", "신비로움", "직관"],
  },
  {
    id: "horse",
    title: "말띠",
    emoji: "🐴",
    shortDesc: "자유롭게 달리는 스타일",
    description: "에너지가 넘치고 활기찬 타입이에요. 새로운 환경, 새로운 사람을 만나면 가장 자기답게 빛납니다. 한 자리에 머무르기보다 움직일 때 기회가 따라오는 성격. 다만 너무 많이 벌리지는 말고, 끝맺는 힘도 같이 키워가면 더 큰 성과로 이어져요.",
    traits: ["자유", "활력", "열정", "도전"],
  },
  {
    id: "sheep",
    title: "양띠",
    emoji: "🐑",
    shortDesc: "평화 속에 창의가 피어나는 스타일",
    description: "감성과 창의성이 풍부한 타입이에요. 마음이 편안할 때 가장 좋은 아이디어가 떠오르고, 부드러운 분위기 속에서 사람들이 모입니다. 무리하지 않아도 좋은 흐름이 따라오는 성격. 본인의 페이스를 지키며 천천히 가도 충분해요.",
    traits: ["평화", "창의", "감성", "온유함"],
  },
  {
    id: "monkey",
    title: "원숭이띠",
    emoji: "🐵",
    shortDesc: "재치와 응용력이 통하는 스타일",
    description: "빠른 두뇌와 유연한 사고가 큰 무기가 되는 타입이에요. 익숙한 방식이 안 통하면 새로운 방식을 만들어내는 재치가 빛납니다. 사람들과의 관계에서도 분위기를 빠르게 읽어내는 감각이 호감을 부르는 성격. 너무 가볍지 않게, 진심을 곁들이면 완벽해요.",
    traits: ["재치", "유연성", "기지", "응용력"],
  },
  {
    id: "rooster",
    title: "닭띠",
    emoji: "🐓",
    shortDesc: "정직함이 신뢰를 쌓는 스타일",
    description: "맡은 일을 끝까지 책임지는 성실함이 큰 평가를 받는 타입이에요. 흐트러지지 않는 원칙과 정확한 일처리로 주변의 신뢰가 쌓입니다. 다만 너무 완벽을 추구하다 본인이 지칠 수 있으니, 가끔은 흐름에 맡기는 여유도 가져가 보세요.",
    traits: ["성실함", "책임감", "정직", "꼼꼼함"],
  },
  {
    id: "dog",
    title: "개띠",
    emoji: "🐶",
    shortDesc: "충직한 마음이 좋은 인연을 만드는 스타일",
    description: "한 번 마음 준 사람을 끝까지 챙기는 진심이 큰 매력이 되는 타입이에요. 주변에서 도움을 청하는 일이 많아지고, 그만큼 신뢰가 깊어집니다. 의리와 정의감이 빛나는 성격이지만, 본인 마음도 누군가에게 기댈 줄 아는 균형이 필요해요.",
    traits: ["충직", "정의감", "다정함", "신뢰"],
  },
  {
    id: "pig",
    title: "돼지띠",
    emoji: "🐷",
    shortDesc: "정성과 풍요가 따라오는 스타일",
    description: "따뜻한 마음과 정성스러운 태도가 풍요를 부르는 타입이에요. 사람들에게 베푸는 것이 결국 본인에게 돌아오는 흐름. 작은 일에도 진심을 다하는 모습이 좋은 인연과 좋은 운을 함께 데려옵니다. 욕심내지 않아도 충분히 채워지는 성격이에요.",
    traits: ["정성", "풍요", "따뜻함", "낙천적"],
  },
];

const results: TestResult[] = ZODIACS.map((z) => ({
  id: z.id,
  title: z.title,
  emoji: z.emoji,
  shortDesc: z.shortDesc,
  description: z.description,
  traits: z.traits,
  matches: [],
  avoid: [],
}));

const newYear: TestDefinition = {
  slug: "new-year",
  title: "오늘의 띠 운세",
  description: "출생년도로 알아보는 12띠별 오늘의 운세",
  emoji: "🎍",
  estimatedMinutes: 1,
  results,
  questions: [],
  category: "fortune",
  entryPath: "/new-year",
};

export default newYear;

const ZODIAC_ORDER = [
  "rat", "ox", "tiger", "rabbit", "dragon", "snake",
  "horse", "sheep", "monkey", "rooster", "dog", "pig",
] as const;

export function zodiacFromYear(year: number): string {
  // 1900 = rat. Korean zodiac cycle of 12.
  const idx = ((year - 1900) % 12 + 12) % 12;
  return ZODIAC_ORDER[idx];
}

export { ZODIAC_ORDER };
