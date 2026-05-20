import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardPicker } from "@/components/tarot/CardPicker";
import { getTest } from "@/lib/test/loader";

export const metadata: Metadata = {
  title: "오늘의 타로 — 한 장 뽑기",
  description:
    "메이저 아르카나 22장 중 오늘 당신에게 필요한 한 장의 카드. AI가 해석하는 오늘의 메시지.",
  openGraph: {
    title: "오늘의 타로 — 한 장 뽑기",
    description: "메이저 아르카나 22장 중 오늘 당신에게 필요한 한 장의 카드",
    type: "website",
    locale: "ko_KR",
  },
};

export default function TarotPage() {
  const deck = getTest("tarot");
  if (!deck) notFound();

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
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
              오늘의 타로
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            🃏 메이저 아르카나 22장 중 한 장이 당신을 기다려요
          </p>
        </header>

        <div className="mt-12">
          <CardPicker deck={deck} />
        </div>

        <section className="mt-16 rounded-2xl bg-white/70 p-5 ring-1 ring-violet-100 backdrop-blur">
          <h2 className="mb-2 text-sm font-bold text-gray-800">
            ✨ 타로 카드 뽑기 전에
          </h2>
          <ul className="space-y-1 text-xs text-gray-600">
            <li>· 잠시 숨을 고르고 마음을 가라앉혀 보세요</li>
            <li>· 떠오르는 질문이나 고민을 한 가지 떠올려도 좋아요</li>
            <li>· 결과는 정해진 답이 아닌, 오늘의 힌트로 받아들여 주세요</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
