import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "자주 묻는 질문 (FAQ) — OHNA",
  description:
    "오나(OHNA) 운세·테스트에 대해 자주 묻는 질문 모음. AI 분석, 결과 신뢰도, 개인정보, 공유 방식 등.",
  openGraph: {
    title: "자주 묻는 질문 (FAQ)",
    description:
      "오나 운세·테스트에 대해 자주 묻는 질문 모음 — AI, 결과, 개인정보, 공유.",
    type: "website",
    locale: "ko_KR",
  },
};

interface QA {
  q: string;
  a: string[];
}

const QUESTIONS: QA[] = [
  {
    q: "결과는 어떻게 만들어지나요?",
    a: [
      "각 테스트는 한국 전통 운세 자료와 일반 심리학 자료를 바탕으로 작성한 결과별 고유 설명이 기본이에요.",
      "여기에 더해 결과 페이지마다 AI(Anthropic Claude)가 그날의 톤과 결과 특성에 맞춰 짧은 메시지를 생성합니다. 한번 생성된 AI 메시지는 캐시에 저장돼서 같은 결과를 본 사람들에게는 같은 메시지가 안정적으로 보여요.",
    ],
  },
  {
    q: "운세 결과는 매일 바뀌나요?",
    a: [
      "타로·띠 운세·별자리 운세는 매일 새 메시지가 생성됩니다. 한국 시간 자정 직후가 기준이에요.",
      "MBTI·동물상·연애 유형·전생 직업 같은 성향 테스트는 결과 자체가 본질을 나타내므로 동일한 결과에 대해 동일한 메시지가 유지됩니다.",
      "사주·꿈 해몽은 입력하는 정보가 매번 다르기 때문에 입력별로 결과가 새로 생성됩니다.",
    ],
  },
  {
    q: "결과를 어디까지 믿으면 될까요?",
    a: [
      "오나의 모든 결과는 즐겁게 자신을 돌아보는 가이드예요. 정해진 미래를 알려주는 예언이 아닙니다.",
      "건강·재정·인간관계·진로 같은 중요한 결정은 운세 결과만 보고 판단하지 마시고, 가까운 사람의 조언과 전문가의 도움을 함께 받아 주세요.",
    ],
  },
  {
    q: "사주나 꿈에 입력한 정보는 어떻게 처리되나요?",
    a: [
      "사주 입력(이름·생년월일시)과 꿈 입력(꿈 내용 텍스트)은 결과를 계산하고 같은 입력을 다시 했을 때 빠르게 보여주기 위한 캐시 용도로만 저장됩니다.",
      "마케팅 메시지 발송이나 제3자 제공에는 사용되지 않아요. 자세한 내용은 ",
      "개인정보처리방침 페이지에서 확인하실 수 있습니다.",
    ],
  },
  {
    q: "결과를 친구에게 공유할 수 있나요?",
    a: [
      "네, 결과 페이지 하단의 \"친구에게 공유하기\" 버튼에서 URL 복사 또는 카카오톡으로 바로 공유할 수 있어요.",
      "공유된 링크를 받은 친구도 회원 가입 없이 결과를 바로 확인할 수 있고, 같은 페이지에서 \"나도 해볼래\" 흐름으로 새 테스트를 시작할 수 있습니다.",
    ],
  },
  {
    q: "광고는 왜 표시되나요?",
    a: [
      "오나는 회원 가입 없이 모든 기능을 무료로 제공하기 위해 일부 페이지에 Google 애드센스 광고를 게재해요. 광고 수익은 서버·AI 호출 비용을 충당하는 데 사용됩니다.",
      "잠금 해제형 광고는 사용자가 명시적으로 보기를 선택한 경우에만 표시되며, 결과 본문에 영향을 주지 않습니다.",
    ],
  },
  {
    q: "테스트가 동작하지 않거나 오류가 나요",
    a: [
      "일시적인 AI 서버 과부하나 네트워크 문제로 결과 생성이 실패할 수 있어요. 잠시 후 같은 입력으로 다시 시도하면 대부분 정상 처리됩니다.",
      "반복되는 오류나 잘못된 결과를 발견하시면 사이트 푸터의 안내를 참고해 알려주세요. 콘텐츠 품질 개선에 큰 도움이 됩니다.",
    ],
  },
];

export default function FaqPage() {
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUESTIONS.map((qa) => ({
      "@type": "Question",
      name: qa.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.a.join(" "),
      },
    })),
  });

  return (
    <main className="flex-1 px-5 pb-12 pt-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="text-sm text-gray-500 transition hover:text-gray-700"
        >
          ← 홈으로
        </Link>

        <header className="mt-6 text-center">
          <div className="mb-3 text-5xl">💬</div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              자주 묻는 질문
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            오나를 이용하기 전에 궁금한 점들
          </p>
        </header>

        <section className="mt-10 space-y-4">
          {QUESTIONS.map((qa) => (
            <div
              key={qa.q}
              className="rounded-2xl bg-white/70 p-5 ring-1 ring-pink-100 backdrop-blur"
            >
              <h2 className="mb-2 text-sm font-bold text-gray-800">
                Q. {qa.q}
              </h2>
              {qa.a.map((para, i) => (
                <p
                  key={i}
                  className={`text-xs leading-relaxed text-gray-700 ${
                    i > 0 ? "mt-2" : ""
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-2xl bg-white/70 p-5 ring-1 ring-pink-100 backdrop-blur">
          <p className="text-xs leading-relaxed text-gray-700">
            더 자세한 안내는{" "}
            <Link
              href="/about"
              className="text-pink-600 underline-offset-2 hover:underline"
            >
              오나 소개
            </Link>{" "}
            ·{" "}
            <Link
              href="/privacy"
              className="text-pink-600 underline-offset-2 hover:underline"
            >
              개인정보처리방침
            </Link>{" "}
            ·{" "}
            <Link
              href="/terms"
              className="text-pink-600 underline-offset-2 hover:underline"
            >
              이용약관
            </Link>{" "}
            페이지를 참고해 주세요.
          </p>
        </section>
      </div>
    </main>
  );
}
