import type { TestAboutContent } from "@/data/landing/test-about";

// /tests/[slug] 랜딩 하단에 붙는 설명 본문 (서버 렌더, 크롤러가 읽는 본문).
// TestRunner 아래에 같은 max-w-md 폭으로 정렬된다.
export function TestAbout({
  about,
  testTitle,
}: {
  about: TestAboutContent;
  testTitle: string;
}) {
  return (
    <section className="mx-auto mt-12 max-w-md px-5 pb-4">
      <div className="rounded-2xl bg-white/70 p-5 ring-1 ring-violet-100 backdrop-blur">
        <h2 className="mb-2 text-base font-bold text-gray-800">
          {testTitle} 알아보기
        </h2>
        <p className="text-sm leading-relaxed text-gray-700">{about.intro}</p>
      </div>

      <div className="mt-4 space-y-4">
        {about.sections.map((s, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white/70 p-5 ring-1 ring-violet-100 backdrop-blur"
          >
            <h3 className="mb-2 text-sm font-bold text-gray-800">
              {s.heading}
            </h3>
            {s.body.map((p, j) => (
              <p
                key={j}
                className={`text-sm leading-relaxed text-gray-700 ${
                  j > 0 ? "mt-2.5" : ""
                }`}
              >
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>

      {about.faq && about.faq.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-bold text-gray-800">
            💬 자주 묻는 질문
          </h3>
          <div className="space-y-3">
            {about.faq.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/70 p-4 ring-1 ring-pink-100 backdrop-blur"
              >
                <p className="mb-1.5 text-sm font-bold text-gray-800">
                  Q. {f.q}
                </p>
                <p className="text-sm leading-relaxed text-gray-600">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-[11px] leading-relaxed text-gray-400">
        이 테스트는 즐거움과 자기 이해를 위한 콘텐츠예요. 결과로 자신이나 타인을
        규정하지 말고 가볍게 즐겨주세요.
      </p>
    </section>
  );
}
