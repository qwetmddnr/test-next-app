import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "오늘의 나(OHNA) 개인정보 수집·이용 안내",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="flex-1 px-5 pb-12 pt-8">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="text-sm text-gray-500 transition hover:text-gray-700"
        >
          ← 홈으로
        </Link>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          개인정보처리방침
        </h1>
        <p className="mt-2 text-xs text-gray-400">시행일: 2026-05-19</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
          <Section title="1. 수집하는 개인정보 항목">
            서비스는 회원가입 없이도 이용 가능하며, 다음 정보를 수집할 수
            있습니다.
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>테스트 응답 데이터</strong>: 비식별 형태로 결과 산출에만
                사용됩니다.
              </li>
              <li>
                <strong>사주 입력 정보</strong> (Phase 2 도입 예정): 생년월일,
                태어난 시간. 결과 산출 후 결제 미발생 시 보관하지 않습니다.
              </li>
              <li>
                <strong>접속 정보</strong>: IP, 쿠키, User-Agent. 분석 및 광고
                서비스 운영을 위해 수집됩니다.
              </li>
            </ul>
          </Section>

          <Section title="2. 개인정보의 이용 목적">
            <ul className="list-disc space-y-1 pl-5">
              <li>운세 및 테스트 결과 제공</li>
              <li>서비스 품질 개선 및 통계 분석</li>
              <li>맞춤형 광고 노출 (제3자 광고 서비스)</li>
            </ul>
          </Section>

          <Section title="3. 보유 및 이용 기간">
            수집된 정보는 목적 달성 후 지체 없이 파기됩니다. 단, 관련 법령에
            따라 보존이 필요한 경우 해당 기간 동안 보관합니다.
          </Section>

          <Section title="4. 제3자 제공">
            서비스는 다음의 제3자 서비스를 이용하며, 이용자의 정보 일부가 해당
            서비스로 전송될 수 있습니다.
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Google Analytics 4</strong> — 방문 통계 분석
              </li>
              <li>
                <strong>Google AdSense</strong> — 맞춤형 광고 노출
              </li>
              <li>
                <strong>Microsoft Clarity</strong> — UX 개선 분석 (히트맵)
              </li>
              <li>
                <strong>쿠팡 파트너스</strong> — 제휴 상품 추천
              </li>
            </ul>
            각 서비스의 개인정보 처리 방침은 해당 제공자의 약관을 따릅니다.
          </Section>

          <Section title="5. 쿠키의 사용">
            서비스는 사용자 경험 향상 및 광고 노출을 위해 쿠키를 사용합니다.
            브라우저 설정을 통해 쿠키 사용을 거부할 수 있으며, 거부 시 일부
            기능이 제한될 수 있습니다.
          </Section>

          <Section title="6. 이용자의 권리">
            이용자는 언제든지 본인의 개인정보 열람, 정정, 삭제, 처리 정지를
            요청할 수 있습니다. 문의는 서비스 운영자에게 전달해 주세요.
          </Section>

          <Section title="7. 개인정보 보호책임자">
            <p>책임자: 서비스 운영자</p>
            <p className="mt-1 text-xs text-gray-500">
              구체적인 연락처는 추후 사업자 등록 완료 시 공개됩니다.
            </p>
          </Section>

          <Section title="8. 정책의 변경">
            본 방침은 법령·서비스 정책 변경에 따라 수정될 수 있으며, 변경 시
            서비스 내 공지를 통해 안내합니다.
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
