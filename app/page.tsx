import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { PopularResults } from "@/components/home/PopularResults";
import { getPopularResults } from "@/lib/stats/popular";

export const revalidate = 60;

export default async function Home() {
  const popular = await getPopularResults(5);

  return (
    <main className="flex-1 px-5 pb-8 pt-10">
      <div className="mx-auto max-w-md">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
              오늘의 나
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            운세부터 재미 테스트까지 ✨
          </p>
        </header>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-gray-800">🔮 오늘의 운세</h2>
          <div className="grid grid-cols-2 gap-3">
            <FortuneCard href="/tarot" emoji="🃏" label="타로" />
            <FortuneCard href="/new-year" emoji="🎍" label="띠 운세" />
            <FortuneCard href="/saju" emoji="☯️" label="사주" />
            <FortuneCard href="/tests/mbti" emoji="🧬" label="MBTI" />
          </div>
        </section>

        <PopularResults entries={popular} />

        <AdSlot slot="home-middle" />

        <section>
          <h2 className="mb-4 text-lg font-bold text-gray-800">🎮 재미로 보는 테스트</h2>
          <div className="space-y-3">
            <TestCard
              href="/tests/animal-face"
              emoji="🐶"
              title="동물상 테스트"
              subtitle="당신은 어떤 동물상?"
              meta="12문항 · 결과 16종"
            />
            <TestCard
              href="/tests/past-life-job"
              emoji="⏳"
              title="전생 직업 테스트"
              subtitle="전생의 나는 어떤 사람?"
              meta="10문항 · 결과 14종"
            />
            <TestCard
              href="/tests/love-style"
              emoji="💕"
              title="나의 연애 유형"
              subtitle="당신의 사랑 방식은?"
              meta="15문항 · 결과 8종"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function FortuneCard({
  href,
  emoji,
  label,
}: {
  href: string;
  emoji: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-violet-100 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md active:scale-95"
    >
      <span className="mb-2 text-3xl">{emoji}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </Link>
  );
}

function TestCard({
  href,
  emoji,
  title,
  subtitle,
  meta,
}: {
  href: string;
  emoji: string;
  title: string;
  subtitle: string;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-pink-100 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <span className="text-4xl">{emoji}</span>
        <div className="flex-1">
          <div className="font-semibold text-gray-900">{title}</div>
          <div className="text-sm text-gray-500">{subtitle}</div>
          <div className="mt-1 text-xs text-gray-400">{meta}</div>
        </div>
        <span className="text-gray-300">›</span>
      </div>
    </Link>
  );
}
