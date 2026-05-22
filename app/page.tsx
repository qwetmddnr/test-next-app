import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { PopularTests } from "@/components/home/PopularTests";
import { getPopularTests } from "@/lib/stats/popular";

export const revalidate = 60;

const SITE_URL = "https://ohna.today";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "오나 OHNA",
  alternateName: "오늘의 나",
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  description:
    "오늘의 나(오나)에서 만나는 7가지 무료 운세·성향 테스트. 사주·타로·MBTI·동물상·전생·연애·띠운세.",
  inLanguage: "ko-KR",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "오나 OHNA",
  alternateName: "오늘의 나",
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
            운세부터 재미 테스트까지 ✨
          </p>
        </header>

        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-gray-800">🔮 오늘의 운세</h2>
          <div className="grid grid-cols-2 gap-3">
            <FortuneCard href="/tarot" emoji="🃏" label="타로" />
            <FortuneCard href="/new-year" emoji="🎍" label="띠 운세" />
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-gray-800">🪞 나의 성향</h2>
          <div className="grid grid-cols-2 gap-3">
            <FortuneCard href="/saju" emoji="☯️" label="사주" />
            <FortuneCard href="/tests/mbti" emoji="🧬" label="MBTI" />
          </div>
        </section>

        <PopularTests entries={popular} />

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
