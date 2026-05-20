import type { TestDefinition, TestOption } from "@/lib/types/test";

const ALL_MBTI = [
  "ISTJ", "ISFJ", "INFJ", "INTJ",
  "ISTP", "ISFP", "INFP", "INTP",
  "ESTP", "ESFP", "ENFP", "ENTP",
  "ESTJ", "ESFJ", "ENFJ", "ENTJ",
] as const;

type MbtiCode = (typeof ALL_MBTI)[number];
type Direction = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

function score(direction: Direction, weight: number): Record<string, number> {
  return Object.fromEntries(
    ALL_MBTI.filter((t) => t.includes(direction)).map((t) => [t, weight])
  );
}

function option(
  id: string,
  text: string,
  direction: Direction,
  weight: number = 2
): TestOption {
  return { id, text, scores: score(direction, weight) };
}

type ResultDef = {
  id: MbtiCode;
  title: string;
  emoji: string;
  shortDesc: string;
  description: string;
  traits: string[];
  matches: MbtiCode[];
  avoid: MbtiCode[];
};

const RESULTS: ResultDef[] = [
  {
    id: "ISTJ", title: "신중한 관리자", emoji: "📋",
    shortDesc: "원칙과 책임으로 세상을 떠받치는 사람",
    description: "당신은 약속을 가볍게 여기지 않는 신뢰의 화신이에요. 체계와 규칙 속에서 안정감을 느끼고, 한 번 맡은 일은 끝까지 완수하는 책임감이 어디서나 빛납니다. 화려하진 않아도 곁에 두면 가장 든든한 사람이에요.",
    traits: ["책임감", "신중함", "체계적", "성실함"],
    matches: ["ESFP", "ESTP", "ISFJ"], avoid: ["ENFP"],
  },
  {
    id: "ISFJ", title: "헌신적인 수호자", emoji: "🤲",
    shortDesc: "조용히 사람을 챙기는 따뜻한 마음",
    description: "당신은 말없이 주변을 살피고 챙기는 따뜻한 수호자예요. 작은 변화도 놓치지 않는 세심함과 끈기 있는 다정함으로 사람들에게 안정감을 줍니다. 본인 마음은 잘 표현 안 해도, 곁에 있는 사람은 늘 보호받고 있다고 느껴요.",
    traits: ["따뜻함", "세심함", "끈기", "헌신"],
    matches: ["ESTP", "ESFP", "ISTJ"], avoid: ["ENTP"],
  },
  {
    id: "INFJ", title: "이상주의 통찰가", emoji: "🌙",
    shortDesc: "남이 못 보는 것을 보는 깊은 사색가",
    description: "당신은 사람과 세상의 결을 누구보다 깊이 읽어내는 통찰가예요. 조용한 분위기 뒤에 신념과 비전을 품고 있고, 한 번 의미를 부여한 일에는 흔들림 없이 집중합니다. 가까이 다가갈수록 깊이가 드러나는 매력의 소유자.",
    traits: ["통찰력", "신념", "이상주의", "공감력"],
    matches: ["ENTP", "ENFP", "INFP"], avoid: ["ESTP"],
  },
  {
    id: "INTJ", title: "전략적 설계자", emoji: "♟️",
    shortDesc: "큰 그림을 먼저 그리는 차가운 두뇌",
    description: "당신은 한 발 앞을 내다보고 판을 설계하는 전략가예요. 감정보다 논리, 즉흥보다 계획을 선호하고, 비효율을 견디지 못하는 완벽주의가 가장 큰 무기. 표정은 차가워도 안에는 분명한 비전이 끓고 있는 사람이에요.",
    traits: ["전략적", "논리적", "독립적", "완벽주의"],
    matches: ["ENFP", "ENTP", "INFJ"], avoid: ["ESFP"],
  },
  {
    id: "ISTP", title: "냉정한 실용주의자", emoji: "🛠️",
    shortDesc: "말없이 손으로 문제를 푸는 사람",
    description: "당신은 말은 적어도 손은 가장 빠른 실용주의자예요. 위기 상황에서 흔들리지 않는 침착함과 직접 만지고 분석하는 감각으로 어떤 문제든 풀어냅니다. 자유를 중시해서 얽매이기 싫어하는 자기만의 룰을 가진 타입.",
    traits: ["실용적", "침착함", "독립적", "분석력"],
    matches: ["ESFJ", "ESTJ", "ISFP"], avoid: ["ENFJ"],
  },
  {
    id: "ISFP", title: "감성 예술가", emoji: "🎨",
    shortDesc: "마음과 감각으로 세상을 받아들이는 사람",
    description: "당신은 섬세한 감각과 풍부한 감성을 가진 예술가예요. 말보다 분위기와 표정으로 표현하고, 자기만의 세계를 조용히 가꾸는 타입. 평범한 풍경에서도 남들이 못 보는 아름다움을 발견하는 감각이 큰 매력입니다.",
    traits: ["감성", "온화함", "심미안", "자유로움"],
    matches: ["ESTJ", "ESFJ", "ISTP"], avoid: ["ENTJ"],
  },
  {
    id: "INFP", title: "꿈꾸는 이상주의자", emoji: "🌸",
    shortDesc: "가치와 의미를 품고 사는 부드러운 마음",
    description: "당신은 진심과 의미를 가장 중요하게 여기는 이상주의자예요. 조용해 보여도 내면에는 뜨거운 신념이 흐르고, 옳다고 믿는 일에는 누구보다 진심을 다합니다. 사람의 마음을 읽고 위로하는 능력이 자연스럽게 발휘되는 따뜻한 영혼.",
    traits: ["이상주의", "공감력", "감수성", "진심"],
    matches: ["ENTJ", "ENFJ", "INFJ"], avoid: ["ESTJ"],
  },
  {
    id: "INTP", title: "지적 탐구자", emoji: "🔬",
    shortDesc: "끊임없이 질문하고 분석하는 사람",
    description: "당신은 호기심 앞에서는 시간 가는 줄 모르는 탐구자예요. 익숙한 답을 거부하고 “왜?”를 끝까지 파고드는 성격, 그리고 복잡한 문제를 단순한 원리로 풀어내는 두뇌가 큰 매력. 사람보다는 아이디어와 더 친한 타입이에요.",
    traits: ["탐구심", "논리적", "독창적", "분석력"],
    matches: ["ENTJ", "ESTJ", "ENFJ"], avoid: ["ESFJ"],
  },
  {
    id: "ESTP", title: "거침없는 행동파", emoji: "🔥",
    shortDesc: "생각보다 발이 먼저 움직이는 사람",
    description: "당신은 망설이는 시간이 아까운 행동파예요. 위기 앞에서도 본능적으로 답을 찾아내고, 새로운 경험을 향해 거침없이 뛰어드는 에너지가 매력. 함께 있으면 지루할 틈이 없는 흥미진진한 타입입니다.",
    traits: ["행동력", "순발력", "에너지", "현실감각"],
    matches: ["ISFJ", "ISTJ", "INFJ"], avoid: ["INFP"],
  },
  {
    id: "ESFP", title: "에너지 넘치는 엔터테이너", emoji: "🎤",
    shortDesc: "한 자리만 가도 분위기가 바뀌는 사람",
    description: "당신은 모임의 흥을 책임지는 타고난 엔터테이너예요. 사람들의 표정과 분위기를 빠르게 읽고, 그 자리를 가장 즐겁게 만드는 재능이 있습니다. 어디서나 빛나는 사교성과 솔직한 매력이 큰 무기.",
    traits: ["사교성", "활기", "감각", "솔직함"],
    matches: ["ISTJ", "ISFJ", "INFP"], avoid: ["INTJ"],
  },
  {
    id: "ENFP", title: "재기 발랄한 활력가", emoji: "✨",
    shortDesc: "사람과 가능성을 사랑하는 자유로운 영혼",
    description: "당신은 새로운 사람, 새로운 아이디어 앞에서 가장 자기다워지는 활력가예요. 호기심과 공감이 동시에 강해서 짧은 만남에서도 깊이 통하고, 가능성을 발견하는 직관이 탁월합니다. 영감을 주는 존재 자체.",
    traits: ["활력", "공감력", "호기심", "창의성"],
    matches: ["INTJ", "INFJ", "INFP"], avoid: ["ISTJ"],
  },
  {
    id: "ENTP", title: "끝없는 도전자", emoji: "⚡",
    shortDesc: "정해진 답을 의심하는 자유로운 두뇌",
    description: "당신은 익숙한 길에 만족 못 하는 끝없는 도전자예요. 토론과 새로운 시도가 가장 활기를 불어넣고, 굳어진 룰을 흔드는 데서 즐거움을 찾습니다. 빠른 두뇌와 유연한 사고로 어디서든 판을 흔드는 타입.",
    traits: ["도전정신", "기지", "유연성", "독창성"],
    matches: ["INFJ", "INTJ", "ISFJ"], avoid: ["ISFJ"],
  },
  {
    id: "ESTJ", title: "현실적인 관리자", emoji: "🏛️",
    shortDesc: "원칙과 효율로 일을 끝내는 사람",
    description: "당신은 흐트러진 상황을 정리하고 결과를 만들어내는 현실주의자예요. 명확한 기준과 실행력으로 어떤 조직이든 빠르게 안정시키고, 약속과 책임에 대한 무게감이 남다릅니다. 일을 맡기면 마음 놓이는 든든한 타입.",
    traits: ["실행력", "리더십", "책임감", "효율성"],
    matches: ["ISFP", "INFP", "ISTP"], avoid: ["INFP"],
  },
  {
    id: "ESFJ", title: "친절한 사교가", emoji: "🤝",
    shortDesc: "사람을 챙기는 일이 곧 자기 즐거움인 사람",
    description: "당신은 사람과 사람 사이의 온도를 따뜻하게 유지하는 사교가예요. 분위기를 읽고 자연스럽게 챙기는 능력 덕분에 어딜 가나 환영받고, 모두를 자기 사람처럼 대하는 다정함이 매력입니다.",
    traits: ["사교성", "다정함", "배려", "협동"],
    matches: ["ISFP", "ISTP", "INTP"], avoid: ["INTP"],
  },
  {
    id: "ENFJ", title: "선도적인 리더", emoji: "🕊️",
    shortDesc: "사람을 움직이게 만드는 따뜻한 카리스마",
    description: "당신은 사람들의 잠재력을 보고 끌어올리는 타고난 리더예요. 진심 어린 말 한마디로 분위기를 바꾸고, 모두가 같은 방향을 보게 만드는 힘이 있습니다. 카리스마와 따뜻함을 동시에 갖춘 드문 조합.",
    traits: ["리더십", "공감력", "통찰", "표현력"],
    matches: ["INFP", "ISFP", "INTP"], avoid: ["ISTP"],
  },
  {
    id: "ENTJ", title: "대담한 지도자", emoji: "👑",
    shortDesc: "비전을 현실로 끌어내는 결단의 화신",
    description: "당신은 큰 그림을 보고 망설임 없이 추진하는 지도자예요. 도전 앞에서 가장 활력을 되찾고, 사람들을 이끌어 비전을 결과로 바꾸는 능력이 압도적. 강해 보이는 외양 속에 깊은 야망과 책임감이 자리합니다.",
    traits: ["리더십", "결단력", "야망", "전략"],
    matches: ["INFP", "INTP", "INFJ"], avoid: ["ISFP"],
  },
];

const QUESTIONS = [
  // E/I — 3문항
  {
    id: "q1", text: "주말, 가장 끌리는 모습은?", options: [
      option("a", "친구들과 시끌벅적 모이기", "E", 2),
      option("b", "친한 친구 한두 명과 가볍게 한 잔", "E", 1),
      option("c", "혼자 카페에서 조용히", "I", 1),
      option("d", "완전히 혼자 집에서 충전", "I", 2),
    ],
  },
  {
    id: "q2", text: "처음 보는 사람과의 자리는?", options: [
      option("a", "내가 먼저 말 걸고 분위기 만든다", "E", 2),
      option("b", "분위기 보면서 자연스럽게 끼어든다", "E", 1),
      option("c", "관찰하면서 적당히 호응한다", "I", 1),
      option("d", "최대한 말 안 하고 싶다", "I", 2),
    ],
  },
  {
    id: "q3", text: "에너지가 가장 충전되는 순간은?", options: [
      option("a", "사람들과 어울려 한참 떠들고 난 뒤", "E", 2),
      option("b", "친한 사람과 통화 한 시간", "E", 1),
      option("c", "조용한 산책 한 바퀴", "I", 1),
      option("d", "혼자 방에서 좋아하는 일에 몰입", "I", 2),
    ],
  },
  // S/N — 3문항
  {
    id: "q4", text: "새 정보를 받았을 때 먼저 보는 건?", options: [
      option("a", "구체적인 사실과 숫자", "S", 2),
      option("b", "지금 당장 쓸 수 있는 부분", "S", 1),
      option("c", "이게 어떤 의미일까 큰 그림", "N", 1),
      option("d", "여기서 어떤 가능성이 열릴까", "N", 2),
    ],
  },
  {
    id: "q5", text: "여행 가기 전 나는?", options: [
      option("a", "현지 정보와 일정을 꼼꼼히 짠다", "S", 2),
      option("b", "필수 장소 위주로 가볍게 정리", "S", 1),
      option("c", "분위기와 컨셉만 잡고 출발", "N", 1),
      option("d", "그냥 가서 느낌 따라 움직인다", "N", 2),
    ],
  },
  {
    id: "q6", text: "친구가 어떤 말을 하면 더 솔깃해?", options: [
      option("a", "실제 경험한 디테일한 사례", "S", 2),
      option("b", "지금 당장 적용 가능한 팁", "S", 1),
      option("c", "이상하지만 흥미로운 아이디어", "N", 1),
      option("d", "전혀 새로운 관점의 통찰", "N", 2),
    ],
  },
  // T/F — 3문항
  {
    id: "q7", text: "친구가 고민 상담을 해오면 나는?", options: [
      option("a", "원인을 짚고 해결책을 제시한다", "T", 2),
      option("b", "객관적인 의견을 차분히 말한다", "T", 1),
      option("c", "공감하면서 가볍게 조언한다", "F", 1),
      option("d", "감정에 충분히 공감해주는 게 먼저", "F", 2),
    ],
  },
  {
    id: "q8", text: "결정할 때 더 중요하게 보는 건?", options: [
      option("a", "논리적으로 맞는지", "T", 2),
      option("b", "데이터와 효율", "T", 1),
      option("c", "관련된 사람들의 감정", "F", 1),
      option("d", "내 가치관에 맞는지", "F", 2),
    ],
  },
  {
    id: "q9", text: "비판받았을 때 나는?", options: [
      option("a", "맞는 말이면 곧바로 받아들인다", "T", 2),
      option("b", "내용을 분석하고 정리한다", "T", 1),
      option("c", "말투에 좀 상처받지만 수용한다", "F", 1),
      option("d", "기분이 한참 가는 편이다", "F", 2),
    ],
  },
  // J/P — 3문항
  {
    id: "q10", text: "일을 시작할 때 나는?", options: [
      option("a", "계획부터 세우고 단계대로", "J", 2),
      option("b", "큰 흐름은 잡고 시작", "J", 1),
      option("c", "일단 시작하고 정리는 나중에", "P", 1),
      option("d", "흐름 따라 즉흥적으로", "P", 2),
    ],
  },
  {
    id: "q11", text: "약속이 갑자기 바뀌면?", options: [
      option("a", "당황스럽고 짜증난다", "J", 2),
      option("b", "조금 불편하지만 받아들인다", "J", 1),
      option("c", "새로운 흐름도 괜찮다", "P", 1),
      option("d", "오히려 더 재미있어진다", "P", 2),
    ],
  },
  {
    id: "q12", text: "내 책상/방의 평소 모습은?", options: [
      option("a", "항상 정돈된 상태", "J", 2),
      option("b", "필요한 건 다 자리 있음", "J", 1),
      option("c", "어수선해도 어디 있는지 알아", "P", 1),
      option("d", "완전한 카오스, 그게 편함", "P", 2),
    ],
  },
];

const mbti: TestDefinition = {
  slug: "mbti",
  title: "MBTI 심화 테스트",
  description: "12문항으로 알아보는 16가지 MBTI 유형",
  emoji: "🧬",
  estimatedMinutes: 3,
  results: RESULTS.map((r) => ({ ...r, displayCode: r.id })),
  questions: QUESTIONS,
};

export default mbti;
