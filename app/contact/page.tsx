import type { Metadata } from "next";
import Link from "next/link";

// 문의처 안내 — AdSense는 운영 주체와 연락 수단이 명시된 페이지를 요구한다.
// 이메일은 실제 수신 가능한 주소로 유지하세요. (도메인 메일로 바꾸려면 아래 CONTACT_EMAIL만 수정)
const CONTACT_EMAIL = "lahani0918@gmail.com";

export const metadata: Metadata = {
  title: "문의하기 — OHNA",
  description:
    "오나(OHNA) 운영팀에 문의하는 방법. 콘텐츠 오류 제보, 제휴·광고 문의, 개인정보 관련 요청을 이메일로 받습니다.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "문의하기 | 오나 OHNA",
    description:
      "오나(OHNA) 운영팀 문의 안내 — 콘텐츠 제보·제휴·개인정보 요청.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function ContactPage() {
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
          <div className="mb-3 text-5xl">✉️</div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              문의하기
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            오나에 궁금한 점이나 알려줄 내용이 있으신가요?
          </p>
        </header>

        <section className="mt-10 rounded-2xl bg-white/70 p-5 ring-1 ring-pink-100 backdrop-blur">
          <h2 className="mb-2 text-sm font-bold text-gray-800">
            📮 이메일로 문의해 주세요
          </h2>
          <p className="text-xs leading-relaxed text-gray-700">
            오나(OHNA)는 별도의 고객센터 전화 없이 이메일로 문의를 받고 있어요.
            아래 주소로 보내주시면 확인 후 순차적으로 답변드립니다.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-pink-200/60 transition active:scale-95"
          >
            ✉️ {CONTACT_EMAIL}
          </a>
        </section>

        <section className="mt-6 rounded-2xl bg-white/70 p-5 ring-1 ring-pink-100 backdrop-blur">
          <h2 className="mb-2 text-sm font-bold text-gray-800">
            🗂️ 이런 문의를 받아요
          </h2>
          <ul className="space-y-2 text-xs leading-relaxed text-gray-700">
            <li>
              <strong className="font-bold text-pink-600">콘텐츠 제보</strong>{" "}
              — 결과나 글에서 잘못된 정보, 오타, 어색한 표현을 발견하셨다면
              알려주세요. 품질 개선에 큰 도움이 됩니다.
            </li>
            <li>
              <strong className="font-bold text-pink-600">오류·버그</strong>{" "}
              — 테스트가 동작하지 않거나 결과 생성이 실패하면, 어떤 테스트에서
              어떤 상황이었는지 함께 적어주시면 빠르게 확인할 수 있어요.
            </li>
            <li>
              <strong className="font-bold text-pink-600">제휴·광고</strong>{" "}
              — 협업이나 광고 관련 제안도 이메일로 환영합니다.
            </li>
            <li>
              <strong className="font-bold text-pink-600">개인정보</strong>{" "}
              — 입력하신 정보의 삭제·열람 요청은{" "}
              <Link
                href="/privacy"
                className="text-pink-600 underline-offset-2 hover:underline"
              >
                개인정보처리방침
              </Link>
              에 안내된 절차에 따라 처리해 드려요.
            </li>
          </ul>
        </section>

        <section className="mt-6 rounded-2xl bg-white/70 p-5 ring-1 ring-violet-100 backdrop-blur">
          <p className="text-xs leading-relaxed text-gray-700">
            먼저{" "}
            <Link
              href="/faq"
              className="text-violet-600 underline-offset-2 hover:underline"
            >
              자주 묻는 질문(FAQ)
            </Link>
            을 확인하시면 대부분의 궁금증은 바로 해결될 수 있어요. 오나에 대한
            자세한 소개는{" "}
            <Link
              href="/about"
              className="text-violet-600 underline-offset-2 hover:underline"
            >
              오나 소개
            </Link>{" "}
            페이지에서 확인하실 수 있습니다.
          </p>
        </section>
      </div>
    </main>
  );
}
