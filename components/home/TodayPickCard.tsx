import Link from "next/link";

// 요일별 한 가지 추천. KST 기준.
const PICKS: Record<
  number,
  {
    href: string;
    emoji: string;
    title: string;
    subline: string;
    gradient: string;
  }
> = {
  0: {
    href: "/zodiac",
    emoji: "✨",
    title: "오늘의 별자리 운세",
    subline: "여유로운 일요일, 별자리에 오늘을 물어볼까요?",
    gradient: "from-violet-400 via-fuchsia-400 to-pink-400",
  },
  1: {
    href: "/tarot",
    emoji: "🃏",
    title: "오늘의 타로",
    subline: "한 주의 시작, 메이저 아르카나 한 장으로 길을 잡아보기",
    gradient: "from-violet-500 via-indigo-500 to-purple-500",
  },
  2: {
    href: "/tests/mbti",
    emoji: "🧬",
    title: "MBTI 테스트",
    subline: "오늘의 나는 어떤 유형일까. 가볍게 다시 확인해볼까요?",
    gradient: "from-pink-400 via-fuchsia-400 to-violet-400",
  },
  3: {
    href: "/tests/animal-face",
    emoji: "🐱",
    title: "동물상 테스트",
    subline: "오늘 나에게 가장 잘 맞는 동물상은 어떤 모습일까요?",
    gradient: "from-amber-400 via-orange-400 to-pink-400",
  },
  4: {
    href: "/saju",
    emoji: "☯️",
    title: "나의 사주",
    subline: "본질을 한 번 더, 일간을 중심으로 짚어보는 시간",
    gradient: "from-pink-500 via-rose-400 to-violet-400",
  },
  5: {
    href: "/new-year",
    emoji: "🎍",
    title: "오늘의 띠 운세",
    subline: "한 주 마무리, 띠가 알려주는 오늘의 흐름",
    gradient: "from-emerald-400 via-teal-400 to-cyan-400",
  },
  6: {
    href: "/dream",
    emoji: "🌙",
    title: "꿈 해몽",
    subline: "주말 아침, 어젯밤 꾼 꿈의 의미를 풀어보기",
    gradient: "from-indigo-500 via-violet-500 to-purple-500",
  },
};

function kstWeekday(): number {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.getUTCDay();
}

export function TodayPickCard() {
  const pick = PICKS[kstWeekday()];
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-bold text-gray-800">🎯 오늘의 추천</h2>
      <Link
        href={pick.href}
        className={`block rounded-2xl bg-gradient-to-br ${pick.gradient} p-5 text-white shadow-lg shadow-pink-200/40 transition hover:-translate-y-0.5 active:scale-[0.98]`}
      >
        <div className="flex items-center gap-4">
          <span className="text-4xl">{pick.emoji}</span>
          <div className="flex-1">
            <div className="text-base font-bold">{pick.title}</div>
            <div className="mt-1 text-xs text-white/85">{pick.subline}</div>
          </div>
          <span className="text-white/80">›</span>
        </div>
      </Link>
    </section>
  );
}
