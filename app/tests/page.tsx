import type { Metadata } from "next";
import Link from "next/link";
import { getEntryPath, getTestsByCategory } from "@/lib/test/loader";
import type { TestDefinition } from "@/lib/types/test";

export const metadata: Metadata = {
  title: "전체 테스트",
  description: "오나(OHNA), 오늘의 나에서 즐길 수 있는 모든 운세와 재미 테스트 모음",
  openGraph: {
    title: "전체 테스트 | 오나 OHNA",
    description: "운세와 재미 테스트 모음",
    type: "website",
    locale: "ko_KR",
  },
};

export default function TestsCatalogPage() {
  const { fortune, fun } = getTestsByCategory();

  return (
    <main className="flex-1 px-5 pb-12 pt-6">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="text-sm text-gray-500 transition hover:text-gray-700"
        >
          ← 홈으로
        </Link>

        <header className="mt-6 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              전체 테스트
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            ✨ 마음에 끌리는 테스트를 골라보세요
          </p>
        </header>

        {fortune.length > 0 && (
          <CategorySection title="🔮 오늘의 운세" tests={fortune} />
        )}

        {fun.length > 0 && (
          <CategorySection
            title="🎮 재미로 보는 테스트"
            tests={fun}
            className="mt-10"
          />
        )}
      </div>
    </main>
  );
}

function CategorySection({
  title,
  tests,
  className = "",
}: {
  title: string;
  tests: TestDefinition[];
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="mb-4 text-lg font-bold text-gray-800">{title}</h2>
      <div className="space-y-3">
        {tests.map((t) => (
          <TestCatalogCard key={t.slug} test={t} />
        ))}
      </div>
    </section>
  );
}

// fixed-result 테스트만 결과 미리보기 chip을 노출 (daily/personalized 카테고리는
// 이미 자체 입력 페이지에서 결과 그리드를 노출하거나 token 기반이라 제외)
const PREVIEW_ELIGIBLE_SLUGS = new Set([
  "mbti",
  "animal-face",
  "love-style",
  "past-life-job",
]);

function TestCatalogCard({ test }: { test: TestDefinition }) {
  const href = getEntryPath(test);
  const meta = test.comingSoon
    ? null
    : test.questions.length > 0
    ? `${test.questions.length}문항 · 결과 ${test.results.length}종`
    : `결과 ${test.results.length}종`;
  const showResultChips =
    !test.comingSoon &&
    PREVIEW_ELIGIBLE_SLUGS.has(test.slug) &&
    test.results.length > 0;

  return (
    <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-pink-100 backdrop-blur transition hover:shadow-md">
      <Link
        href={href}
        className="flex items-center gap-4 transition active:scale-[0.99]"
      >
        <span className="text-4xl">{test.emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate font-semibold text-gray-900">
              {test.title}
            </div>
            {test.comingSoon && (
              <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-600">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                준비중
              </span>
            )}
          </div>
          <div className="truncate text-sm text-gray-500">
            {test.description}
          </div>
          {meta && (
            <div className="mt-1 text-xs text-gray-400">{meta}</div>
          )}
        </div>
        <span className="text-gray-300">›</span>
      </Link>

      {showResultChips && (
        <div className="mt-3 border-t border-pink-50 pt-3">
          <p className="mb-2 text-[11px] font-medium text-gray-400">
            결과 미리보기
          </p>
          <div className="flex flex-wrap gap-1.5">
            {test.results.slice(0, 8).map((r) => (
              <Link
                key={r.id}
                href={`/result/${test.slug}/${r.id}`}
                className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2.5 py-1 text-[11px] font-medium text-pink-700 ring-1 ring-pink-100 transition hover:bg-pink-100"
              >
                <span>{r.emoji}</span>
                <span>{r.title.replace(/\s*\([^)]+\)\s*$/, "")}</span>
              </Link>
            ))}
            {test.results.length > 8 && (
              <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 text-[11px] text-gray-500 ring-1 ring-gray-100">
                +{test.results.length - 8}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
