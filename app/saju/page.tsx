import type { Metadata } from "next";
import Link from "next/link";
import { SajuForm } from "@/components/saju/SajuForm";

export const metadata: Metadata = {
  title: "나의 사주 — 생년월일시로 보는 사주팔자",
  description:
    "만세력 기반으로 계산한 사주팔자와 일간 분석. 양력/음력 모두 지원하고, AI가 당신의 본질을 풀어드려요.",
  openGraph: {
    title: "나의 사주",
    description: "생년월일시로 보는 사주팔자 · 일간 분석",
    type: "website",
    locale: "ko_KR",
  },
};

export default function SajuPage() {
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
          <div className="mb-3 text-5xl">☯️</div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              나의 사주
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            생년월일과 시간을 알려주면 사주팔자와 일간을 풀어드려요
          </p>
        </header>

        <div className="mt-8">
          <SajuForm />
        </div>

        <section className="mt-12 rounded-2xl bg-white/70 p-5 ring-1 ring-violet-100 backdrop-blur">
          <h2 className="mb-2 text-sm font-bold text-gray-800">
            ✨ 봐드리는 내용
          </h2>
          <ul className="space-y-1.5 text-xs text-gray-600">
            <li>· 년주 · 월주 · 일주 · 시주 (사주팔자)</li>
            <li>· 오행 (목·화·토·금·수) 분포 균형</li>
            <li>· 일간(日干) 기반 본질 성격 분석</li>
            <li>· AI가 풀어주는 일간별 맞춤 메시지</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
