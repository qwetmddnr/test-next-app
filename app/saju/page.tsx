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

        <section className="mt-6 rounded-2xl bg-white/70 p-5 ring-1 ring-violet-100 backdrop-blur">
          <h2 className="mb-2 text-sm font-bold text-gray-800">
            ☯️ 사주팔자는 어떻게 풀이하나요?
          </h2>
          <p className="text-xs leading-relaxed text-gray-700">
            사주(四柱)는 태어난 연·월·일·시 네 시점을 각각 하나의 기둥(柱)으로
            보고, 그 기둥마다 천간(天干) 한 글자와 지지(地支) 한 글자를 배정해
            얻는 총 여덟 글자(八字)예요. 이 여덟 글자에 담긴 오행(목·화·토·금·수)의
            분포와 흐름이 그 사람의 타고난 기질·관계 패턴·체질을 비추는 좌표가
            된다고 보는 게 동양 명리학의 출발점입니다.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-gray-700">
            오나의 사주 분석은 한국에서 오래 쓰여 온 만세력을 기준으로 양력·음력
            생일을 정확히 환산해 사주팔자를 산출하고, 그 가운데서도 일간(日干) —
            태어난 날의 천간 — 을 본질적인 자기 자신으로 풀어드려요. 일간이
            예를 들어 갑목(甲木)인 사람이라면, 큰 나무처럼 곧고 우직한 기질을
            중심으로 그날의 상황과 사람을 어떻게 대하면 좋을지 살펴봅니다.
          </p>
        </section>

        <section className="mt-6 rounded-2xl bg-white/70 p-5 ring-1 ring-violet-100 backdrop-blur">
          <h2 className="mb-2 text-sm font-bold text-gray-800">
            🕰️ 시(時)를 모르면 어떻게 되나요?
          </h2>
          <p className="text-xs leading-relaxed text-gray-700">
            사주의 네 기둥 중 시주는 태어난 시각을 기준으로 결정돼요. 시간을
            모르면 시주는 빈 칸으로 두고, 나머지 년·월·일주만으로 일간을 중심으로
            한 본질 분석을 제공합니다. 사주의 큰 흐름과 일간의 성질은 시 없이도
            충분히 읽을 수 있어 입력 시 &quot;시 모름&quot;을 선택해도 무방해요.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-gray-700">
            ⚠️ 사주는 운명을 정해진 답으로 알려주는 도구가 아니라, 타고난 결을
            이해하고 오늘을 더 편하게 살아내기 위한 참고 자료예요. 인생의 큰
            결정은 사주 결과만으로 판단하지 마시고, 자신의 상황과 가까운 분들의
            조언을 함께 고려해 주세요.
          </p>
        </section>
      </div>
    </main>
  );
}
