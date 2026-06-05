import type { Metadata } from "next";
import Link from "next/link";
import { BirthYearPicker } from "@/components/new-year/BirthYearPicker";
import { getTest } from "@/lib/test/loader";

export const metadata: Metadata = {
  title: "오늘의 띠 운세 — 출생년도로 보는 오늘의 운세",
  description:
    "출생년도로 알아보는 12띠별 오늘의 운세. 일·재물운, 애정운, 건강운까지 AI가 분석해드려요.",
  openGraph: {
    title: "오늘의 띠 운세",
    description: "출생년도로 알아보는 12띠별 오늘의 운세",
    type: "website",
    locale: "ko_KR",
  },
};

export default function NewYearPage() {
  const now = new Date();
  const thisYear = now.getFullYear();
  const test = getTest("new-year");
  const results = test?.results ?? [];

  return (
    <main className="flex-1 px-5 pb-12 pt-6">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="text-sm text-gray-500 transition hover:text-gray-700"
        >
          ← 홈으로
        </Link>

        <header className="mt-6 text-center">
          <div className="mb-3 text-5xl">🎍</div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              오늘의 띠 운세
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            출생년도를 알려주면 띠별 오늘의 운세를 봐드려요
          </p>
        </header>

        <div className="mt-10">
          <BirthYearPicker thisYear={thisYear} />
        </div>

        <section className="mt-12 rounded-2xl bg-white/70 p-5 ring-1 ring-violet-100 backdrop-blur">
          <h2 className="mb-2 text-sm font-bold text-gray-800">
            ✨ 봐드리는 내용
          </h2>
          <ul className="space-y-1.5 text-xs text-gray-600">
            <li>· 💼 일·재물운: 오늘 일과 돈의 흐름</li>
            <li>· 💕 애정·인간관계운: 오늘의 인연과 관계</li>
            <li>· 🌿 건강·생활운: 몸과 마음을 위한 조언</li>
            <li>· AI가 분석하는 띠별 맞춤 메시지</li>
          </ul>
        </section>

        {results.length > 0 && (
          <section className="mt-6 rounded-2xl bg-white/70 p-5 ring-1 ring-violet-100 backdrop-blur">
            <h2 className="mb-2 text-sm font-bold text-gray-800">
              🎍 12띠 운세 둘러보기
            </h2>
            <p className="mb-4 text-xs leading-relaxed text-gray-600">
              내 띠를 알고 있다면 출생년도 입력 없이 바로 결과 페이지를 확인할 수
              있어요.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {results.map((r) => (
                <Link
                  key={r.id}
                  href={`/result/new-year/${r.id}`}
                  className="flex flex-col items-center rounded-xl bg-white/80 p-2.5 ring-1 ring-pink-100 transition hover:-translate-y-0.5"
                >
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="mt-1 text-center text-[11px] font-medium text-gray-700">
                    {r.title.replace(/\s*\([^)]+\)\s*$/, "")}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
