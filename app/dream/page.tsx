import type { Metadata } from "next";
import Link from "next/link";
import { DreamForm } from "@/components/dream/DreamForm";

export const metadata: Metadata = {
  title: "꿈 해몽 — 어젯밤 꿈의 의미",
  description:
    "어젯밤 꾼 꿈을 적으면 AI가 한국 전통 해몽 + 현대적 관점으로 풀어드려요.",
  openGraph: {
    title: "꿈 해몽",
    description: "AI가 풀어주는 어젯밤 꿈의 의미",
    type: "website",
    locale: "ko_KR",
  },
};

export default function DreamPage() {
  return (
    <>
      {/* 꿈 페이지 전용 인디고/보라 배경 (다른 페이지 영향 없음) */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-gradient-to-b from-indigo-100 via-violet-100 to-white"
      />

      <main className="flex-1 px-5 pb-12 pt-6">
        <div className="mx-auto max-w-md">
          <Link
            href="/"
            className="text-sm text-gray-500 transition hover:text-gray-700"
          >
            ← 홈으로
          </Link>

          <header className="mt-6 text-center">
            <div className="mb-3 text-5xl">🌙</div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
                꿈 해몽
              </span>
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              어젯밤 꾼 꿈을 적어주세요. AI가 풀어드려요
            </p>
          </header>

          <div className="mt-8">
            <DreamForm />
          </div>

          <section className="mt-12 rounded-2xl bg-white/70 p-5 ring-1 ring-indigo-100 backdrop-blur">
            <h2 className="mb-2 text-sm font-bold text-gray-800">
              ✨ 풀어드리는 내용
            </h2>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li>· 꿈에 등장한 상징의 전통적인 의미</li>
              <li>· 길흉 방향과 마음 상태에 비추어 본 메시지</li>
              <li>· 오늘 부담 없이 챙길 수 있는 행동 한 가지</li>
              <li>· AI가 풀어주는 따뜻한 해석</li>
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
