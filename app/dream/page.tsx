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

          <section className="mt-6 rounded-2xl bg-white/70 p-5 ring-1 ring-indigo-100 backdrop-blur">
            <h2 className="mb-2 text-sm font-bold text-gray-800">
              🌙 꿈 해몽은 어떤 관점으로 풀이하나요?
            </h2>
            <p className="text-xs leading-relaxed text-gray-700">
              한국의 전통 해몽서는 용·돼지·물·이·치아 같은 자주 등장하는 상징을
              중심으로 길몽과 흉몽의 흐름을 정리해 왔어요. 같은 상징도 시대와
              맥락에 따라 의미가 달라지지만, 큰 줄기는 비교적 일관되게 전해집니다.
              여기에 현대 심리학은 꿈을 무의식이 내보내는 신호로 보고, 꿈에 등장한
              인물·장소·감정이 지금 내 마음의 상태를 비추는 거울이라고 설명해요.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-gray-700">
              오나의 꿈 해몽은 두 관점을 가볍게 섞어요. 전통 해몽에서 그 상징이
              어떤 의미였는지 짧게 짚고, 그 의미를 오늘의 내 마음 상태에 어떻게
              연결해 받아들이면 좋을지 따뜻하게 풀어드립니다. 무거운 흉몽도 일방적인
              불길함이 아니라 &quot;지금 잠깐 챙겨야 할 부분&quot;으로 옮겨 읽는 게
              우리의 톤이에요.
            </p>
          </section>

          <section className="mt-6 rounded-2xl bg-white/70 p-5 ring-1 ring-indigo-100 backdrop-blur">
            <h2 className="mb-2 text-sm font-bold text-gray-800">
              ✍️ 꿈을 적을 때 도움이 되는 팁
            </h2>
            <p className="text-xs leading-relaxed text-gray-700">
              가장 먼저 떠오른 장면·인물·사물 한두 가지를 짧은 문장으로 적어주세요.
              완벽한 줄거리보다 &quot;어두운 강에서 큰 물고기를 잡았어요&quot;처럼
              핵심 이미지가 살아 있는 표현이 해석에 가장 도움이 됩니다. 색깔이나
              느낌(따뜻함·두려움·반가움)도 함께 적어두면 메시지가 더 구체적으로
              나와요.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-gray-700">
              ⚠️ 꿈 해몽은 미래를 예언하는 도구가 아니라, 오늘 내 마음을 점검하는
              참고예요. 반복되는 악몽이나 일상에 영향을 주는 수면 문제가 있다면
              해몽보다 수면 전문의나 심리 상담사의 도움을 먼저 받아 주세요.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
