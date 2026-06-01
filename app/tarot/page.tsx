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
    <>
      {/* 타로 페이지 전용 다크 보라 배경 (다른 페이지 영향 없음) */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-gradient-to-b from-violet-200 via-violet-400 to-indigo-700"
      />

      <main className="flex-1 px-5 pb-12 pt-6 text-violet-50">
        <div className="mx-auto max-w-md">
          <Link
            href="/"
            className="text-sm text-violet-200/80 transition hover:text-white"
          >
            ← 홈으로
          </Link>

          <header className="mt-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-pink-200 via-fuchsia-200 to-violet-100 bg-clip-text text-transparent">
                오늘의 타로
              </span>
            </h1>
            <p className="mt-2 text-sm text-violet-100/80">
              🃏 메이저 아르카나 22장 중 한 장이 당신을 기다려요
            </p>
          </header>

          <div className="mt-12">
            <CardPicker deck={deck} />
          </div>

          <section className="mt-16 rounded-2xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur-md">
            <h2 className="mb-2 text-sm font-bold text-white">
              ✨ 타로 카드 뽑기 전에
            </h2>
            <ul className="space-y-1 text-xs text-violet-100/85">
              <li>· 잠시 숨을 고르고 마음을 가라앉혀 보세요</li>
              <li>· 떠오르는 질문이나 고민을 한 가지 떠올려도 좋아요</li>
              <li>· 결과는 정해진 답이 아닌, 오늘의 힌트로 받아들여 주세요</li>
            </ul>
          </section>

          <section className="mt-6 rounded-2xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur-md">
            <h2 className="mb-2 text-sm font-bold text-white">
              🃏 타로 카드는 어떤 도구인가요?
            </h2>
            <p className="text-xs leading-relaxed text-violet-100/85">
              타로(Tarot)는 15세기 무렵 유럽에서 카드 게임으로 시작되어, 18세기
              이후 점차 자기 성찰과 상징 해석의 도구로 자리 잡았어요. 78장의 카드
              중에서 인생의 큰 흐름과 보편적 주제를 담은 22장을 메이저 아르카나라
              부르고, 오나의 오늘의 타로는 이 메이저 아르카나만 사용해 매일 한 장의
              카드를 보여드려요.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-violet-100/85">
              각 카드는 길흉을 단정하기보다, 지금 당신의 상황을 다른 각도에서
              비춰주는 거울에 가깝습니다. 같은 &quot;바보(The Fool)&quot; 카드가 어떤
              날에는 새로운 도전을 권하는 메시지로, 또 어떤 날에는 신중함을 일깨우는
              메시지로 읽힐 수 있어요. 그래서 카드 자체보다, 그 카드를 본 순간
              당신의 마음에서 가장 먼저 떠오른 감정과 생각이 가장 좋은 해석이에요.
            </p>
          </section>

          <section className="mt-6 rounded-2xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur-md">
            <h2 className="mb-2 text-sm font-bold text-white">
              💫 오늘 카드를 활용하는 법
            </h2>
            <p className="text-xs leading-relaxed text-violet-100/85">
              카드를 뽑고 결과 페이지를 봤다면, 잠시 그 카드의 이미지와 핵심
              키워드를 머릿속에 담아두세요. 오늘 하루 동안 비슷한 상황이나 감정이
              떠오를 때, 카드가 보낸 메시지를 자연스럽게 다시 떠올려 보면 그날의
              결정에 작은 힌트가 될 수 있어요. 일기에 한 줄로 기록해두면 한 달 후
              돌아봤을 때 자신의 마음 흐름을 더 잘 이해하게 됩니다.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-violet-100/85">
              ⚠️ 타로 카드는 미래를 결정짓는 점술이 아니라 오늘의 자신을 돌아보는
              도구예요. 중요한 결정(건강·재정·인간관계)은 카드의 메시지만으로
              판단하지 말고, 가까운 사람이나 전문가의 의견과 함께 참고해 주세요.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
