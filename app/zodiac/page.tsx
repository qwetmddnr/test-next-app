import type { Metadata } from "next";
import Link from "next/link";
import { BirthDatePicker } from "@/components/zodiac/BirthDatePicker";

export const metadata: Metadata = {
  title: "오늘의 별자리 운세 — 생일로 보는 12 별자리",
  description:
    "양력 생일로 알아보는 12 별자리별 오늘의 운세. 일·관계·건강 흐름을 AI가 따뜻하게 풀어드려요.",
  openGraph: {
    title: "오늘의 별자리 운세",
    description: "생일로 알아보는 12 별자리별 오늘의 운세",
    type: "website",
    locale: "ko_KR",
  },
};

export default function ZodiacPage() {
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
          <div className="mb-3 text-5xl">✨</div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              오늘의 별자리 운세
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            양력 생일을 알려주면 별자리별 오늘의 운세를 봐드려요
          </p>
        </header>

        <div className="mt-10">
          <BirthDatePicker />
        </div>

        <section className="mt-12 rounded-2xl bg-white/70 p-5 ring-1 ring-violet-100 backdrop-blur">
          <h2 className="mb-2 text-sm font-bold text-gray-800">
            ✨ 봐드리는 내용
          </h2>
          <ul className="space-y-1.5 text-xs text-gray-600">
            <li>· 💼 일·재물운: 오늘 일과 돈의 흐름</li>
            <li>· 💕 애정·인간관계운: 오늘의 인연과 관계</li>
            <li>· 🌿 건강·생활운: 몸과 마음을 위한 조언</li>
            <li>· AI가 분석하는 별자리별 맞춤 메시지</li>
          </ul>
        </section>

        <section className="mt-6 rounded-2xl bg-white/70 p-5 ring-1 ring-violet-100 backdrop-blur">
          <h2 className="mb-2 text-sm font-bold text-gray-800">
            ✨ 12 별자리는 어떻게 정해지나요?
          </h2>
          <p className="text-xs leading-relaxed text-gray-700">
            서양 점성술의 12 별자리는 태양이 1년 동안 지나가는 황도(黃道)를 12개
            구간으로 나눠 만든 좌표예요. 양력 생일이 어떤 구간에 들어가느냐에 따라
            태양 별자리가 결정되고, 이 별자리는 그 사람의 의식적인 자아와 사회적
            얼굴을 표현하는 기본 색조로 읽힙니다. 양자리(3/21~)부터 물고기자리
            (~3/20)까지가 한 사이클을 이루고, 양력 생일만 있으면 어렵지 않게 자신의
            별자리를 알 수 있어요.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-gray-700">
            12 별자리는 불(양·사자·사수)·흙(황소·처녀·염소)·공기(쌍둥이·천칭·물병)·
            물(게·전갈·물고기)이라는 네 원소로도 묶을 수 있어요. 같은 원소끼리는
            행동 패턴과 가치관에서 통하는 결이 많고, 다른 원소와는 보완 관계나
            긴장 관계를 만들기도 합니다. 오나의 별자리 운세는 이 별자리별 기질을
            바탕으로 오늘의 일·관계·건강 흐름을 짧고 따뜻하게 풀어드려요.
          </p>
        </section>

        <section className="mt-6 rounded-2xl bg-white/70 p-5 ring-1 ring-violet-100 backdrop-blur">
          <h2 className="mb-2 text-sm font-bold text-gray-800">
            🔮 띠 운세 · 사주와는 어떻게 달라요?
          </h2>
          <p className="text-xs leading-relaxed text-gray-700">
            띠 운세는 태어난 해의 12지(쥐·소·호랑이…)를, 사주는 태어난 연·월·일·시
            여덟 글자(팔자) 전부를, 별자리 운세는 양력 생일이 속한 황도 구간을
            기준으로 분석해요. 셋은 서로 다른 지도를 가지고 같은 사람을 비춰주는
            셈이라, 결과가 어느 정도 다르게 보이는 게 자연스럽습니다.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-gray-700">
            ⚠️ 별자리 운세는 오늘 하루의 분위기를 가볍게 살펴보는 가이드예요.
            건강·재정·관계의 중요한 결정은 별자리 결과만으로 판단하지 마시고,
            오늘의 자신과 주변 상황을 함께 고려해 주세요.
          </p>
        </section>
      </div>
    </main>
  );
}
