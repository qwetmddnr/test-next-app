import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용약관",
  description: "오늘의 나(OHNA) 서비스 이용약관",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="flex-1 px-5 pb-12 pt-8">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="text-sm text-gray-500 transition hover:text-gray-700"
        >
          ← 홈으로
        </Link>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">이용약관</h1>
        <p className="mt-2 text-xs text-gray-400">시행일: 2026-05-19</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
          <Section title="제1조 (목적)">
            본 약관은 “오늘의 나(OHNA)”(이하 “서비스”)가 제공하는 운세 및 재미 테스트
            콘텐츠 이용과 관련하여 서비스와 이용자의 권리·의무 및 책임사항을
            규정함을 목적으로 합니다.
          </Section>

          <Section title="제2조 (서비스의 성격)">
            본 서비스에서 제공되는 모든 운세, 사주, 타로, 심리·재미 테스트
            결과는 <strong>오락 및 재미를 위한 콘텐츠</strong>이며, 의학적,
            법률적, 재정적 자문이나 객관적 사실을 보증하지 않습니다.
          </Section>

          <Section title="제3조 (이용자의 의무)">
            이용자는 서비스를 다음 각 호의 목적으로 이용해서는 안 됩니다.
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>타인의 권리나 명예를 침해하는 행위</li>
              <li>서비스의 운영을 방해하는 행위</li>
              <li>법령 또는 공공질서에 반하는 행위</li>
            </ul>
          </Section>

          <Section title="제4조 (저작권)">
            서비스 내 모든 콘텐츠(텍스트, 이미지, UI 등)의 저작권은 서비스
            제공자 또는 정당한 권리자에게 있으며, 이용자는 사전 동의 없이 이를
            복제·배포·전송할 수 없습니다.
          </Section>

          <Section title="제5조 (책임의 제한)">
            서비스는 운세·테스트 결과를 신뢰함으로써 발생한 직간접적인 손해에
            대하여 책임을 지지 않습니다. 결과는 어디까지나 참고용입니다.
          </Section>

          <Section title="제6조 (광고 및 제휴)">
            서비스에는 Google AdSense, 쿠팡 파트너스 등 제3자 광고 또는 제휴
            링크가 포함될 수 있으며, 해당 광고/링크를 통한 거래의 책임은 광고주
            또는 제휴사에 있습니다.
          </Section>

          <Section title="제7조 (약관의 변경)">
            본 약관은 사전 공지 후 변경될 수 있으며, 변경 사항은 서비스 내 공지
            게시일로부터 효력이 발생합니다.
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 font-bold text-gray-900">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
