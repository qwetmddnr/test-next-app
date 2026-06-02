import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { PopularTests } from "@/components/home/PopularTests";
import { TodayPickCard } from "@/components/home/TodayPickCard";
import { JoinGroupCard } from "@/components/home/JoinGroupCard";
import { HomeShareCard } from "@/components/home/HomeShareCard";
import { getPopularTests } from "@/lib/stats/popular";

export const revalidate = 60;

const SITE_URL = "https://ohna.today";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "오나 OHNA",
  alternateName: ["오늘의 나", "오나테", "오나 테스트"],
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  description:
    "오나테(오나 테스트) — 오늘의 나에서 만나는 무료 운세·성향 테스트 모음. 사주·타로·MBTI·동물상·전생·연애·띠운세.",
  inLanguage: "ko-KR",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "오나 OHNA",
  alternateName: ["오늘의 나", "오나테"],
  url: SITE_URL,
  logo: `${SITE_URL}/apple-icon`,
};

export default async function Home() {
  const popular = await getPopularTests(10);

  return (
    <main className="flex-1 px-5 pb-8 pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <div className="mx-auto max-w-md">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
              OHNA · 오늘의 나
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            ✨ 오나테로 만나는 오늘의 나 — 운세부터 재미 테스트까지
          </p>
        </header>

        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-gray-800">🔮 오늘의 운세</h2>
          <div className="grid grid-cols-2 gap-3">
            <FortuneCard href="/tarot" emoji="🃏" label="타로" />
            <FortuneCard href="/new-year" emoji="🎍" label="띠 운세" />
            <FortuneCard href="/zodiac" emoji="✨" label="별자리" />
            <FortuneCard href="/dream" emoji="🌙" label="꿈 해몽" />
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-gray-800">🪞 나의 성향</h2>
          <div className="grid grid-cols-2 gap-3">
            <FortuneCard href="/saju" emoji="☯️" label="사주" />
            <FortuneCard href="/tests/mbti" emoji="🧬" label="MBTI" />
          </div>
        </section>

        <TodayPickCard />

        <PopularTests entries={popular} />

        <HomeShareCard />

        <JoinGroupCard />

        <section className="mb-8">
          <div className="rounded-2xl bg-white/80 p-5 ring-1 ring-violet-100 backdrop-blur">
            <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-gray-800">
              🌸 오나는 어떤 곳인가요?
            </h2>
            <p className="text-xs leading-relaxed text-gray-700">
              오나(OHNA, 오늘의 나)는 한국에서 오래 전해 내려온 운세와 현대의 AI를
              가볍게 결합해, 매일의 자신을 짧게 들여다보는 무료 콘텐츠 모음이에요.
              사주·타로·별자리·띠 운세부터 MBTI·동물상·전생 직업·연애 유형까지,
              회원 가입 없이 바로 즐겨보세요.
            </p>
            <div className="mt-3 flex gap-3 text-xs">
              <Link
                href="/about"
                className="font-bold text-pink-600 underline-offset-2 hover:underline"
              >
                오나 자세히 보기 →
              </Link>
              <Link
                href="/faq"
                className="font-bold text-violet-600 underline-offset-2 hover:underline"
              >
                자주 묻는 질문 →
              </Link>
            </div>
          </div>
        </section>

        <AdSlot slot="home-middle" />
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
