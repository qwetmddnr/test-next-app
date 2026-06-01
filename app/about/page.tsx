import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "오나 소개 — OHNA",
  description:
    "오나(OHNA)는 한국의 운세 전통과 AI 분석을 가볍게 결합해 매일의 나를 들여다보는 무료 콘텐츠 모음입니다.",
  openGraph: {
    title: "오나 소개",
    description:
      "오나(OHNA)는 한국의 운세 전통과 AI 분석을 가볍게 결합해 매일의 나를 들여다보는 무료 콘텐츠 모음입니다.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function AboutPage() {
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
              오나 OHNA
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            오늘의 나를 가볍게 들여다보는 자리
          </p>
        </header>

        <section className="mt-10 rounded-2xl bg-white/70 p-5 ring-1 ring-pink-100 backdrop-blur">
          <h2 className="mb-2 text-sm font-bold text-gray-800">
            🌸 어떤 사이트인가요?
          </h2>
          <p className="text-xs leading-relaxed text-gray-700">
            오나(OHNA, 오늘의 나)는 한국에서 오래 전해 내려온 운세·점법과 현대의 AI
            언어 모델을 가볍게 결합해, 매일의 자신을 짧게 들여다볼 수 있는 무료
            콘텐츠 모음이에요. 사주·타로·별자리·띠 운세 같은 일일 운세부터, MBTI·
            동물상·전생 직업·연애 유형 같은 성향 테스트, 꿈 해몽까지 한 사이트에서
            가볍게 경험할 수 있도록 정리했습니다.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-gray-700">
            모든 콘텐츠는 회원 가입 없이 무료로 사용할 수 있어요. 결과 페이지에는
            결과별 고유 설명과 함께, 오늘의 흐름에 맞춰 AI가 따뜻한 톤으로 작성한
            짧은 메시지가 붙습니다.
          </p>
        </section>

        <section className="mt-6 rounded-2xl bg-white/70 p-5 ring-1 ring-pink-100 backdrop-blur">
          <h2 className="mb-2 text-sm font-bold text-gray-800">
            🪞 어떤 톤으로 만들어요?
          </h2>
          <p className="text-xs leading-relaxed text-gray-700">
            점술이 무겁게 느껴지지 않도록, &quot;흉몽&quot;이나 &quot;불길한
            기운&quot; 같은 단어보다 &quot;오늘 잠깐 챙겨두면 좋은 부분&quot; 같은
            결로 풀어요. 단정하는 예언보다 한 발 떨어져 자신을 돌아볼 수 있는 거울에
            가까운 콘텐츠를 지향합니다.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-gray-700">
            AI 메시지는 Anthropic의 Claude 모델을 사용해 생성하고, 결과별·날짜별로
            한 번 생성된 메시지는 캐시에 저장돼 같은 결과를 본 다른 사용자에게도
            동일하게 제공됩니다. 즉, 같은 카드/별자리를 뽑은 사람은 같은 날 같은
            메시지를 받게 돼요.
          </p>
        </section>

        <section className="mt-6 rounded-2xl bg-white/70 p-5 ring-1 ring-pink-100 backdrop-blur">
          <h2 className="mb-2 text-sm font-bold text-gray-800">
            ⚖️ 한계와 안내
          </h2>
          <p className="text-xs leading-relaxed text-gray-700">
            오나의 모든 결과는 즐겁게 즐기기 위한 콘텐츠예요. 건강·재정·관계·진로
            등 중요한 선택은 운세 결과만으로 판단하지 마시고, 가까운 사람과 전문가의
            의견과 함께 참고해 주세요. 사주·꿈 해몽처럼 개인이 입력한 정보가 들어가는
            기능의 경우, 입력 내용은 결과 캐싱 목적 외에는 사용되지 않으며 별도
            마케팅에 활용되지 않습니다.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-gray-700">
            자세한 데이터 처리 방침은{" "}
            <Link
              href="/privacy"
              className="text-pink-600 underline-offset-2 hover:underline"
            >
              개인정보처리방침
            </Link>
            과{" "}
            <Link
              href="/terms"
              className="text-pink-600 underline-offset-2 hover:underline"
            >
              이용약관
            </Link>
            을 참고해 주세요. 자주 묻는 질문은{" "}
            <Link
              href="/faq"
              className="text-pink-600 underline-offset-2 hover:underline"
            >
              FAQ
            </Link>
            에서 확인하실 수 있어요.
          </p>
        </section>
      </div>
    </main>
  );
}
