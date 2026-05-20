import Link from "next/link";
import type { PopularTestEntry } from "@/lib/stats/popular";
import { getEntryPath } from "@/lib/test/loader";

interface PopularTestsProps {
  entries: PopularTestEntry[];
  topN?: number;
}

const RANK_BADGES = ["🥇", "🥈", "🥉", "4", "5", "6", "7", "8", "9", "10"];

export function PopularTests({ entries, topN = 5 }: PopularTestsProps) {
  if (entries.length === 0) return null;

  const visible = entries.slice(0, topN);

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-gray-800">
          🔥 지금 인기있는 테스트
        </h2>
        <span className="text-xs text-gray-400">조회수 기준</span>
      </div>

      <ol className="space-y-2">
        {visible.map((entry, index) => {
          const badge = RANK_BADGES[index] ?? `${index + 1}`;
          const isTopThree = index < 3;
          return (
            <li key={entry.test.slug}>
              <Link
                href={getEntryPath(entry.test)}
                className="block rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-pink-100 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-bold ${
                      isTopThree
                        ? "bg-gradient-to-br from-pink-100 to-violet-100 text-xl"
                        : "bg-gray-100 text-sm text-gray-500"
                    }`}
                  >
                    {badge}
                  </span>
                  <span className="text-3xl">{entry.test.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-gray-900">
                      {entry.test.title}
                    </div>
                    <div className="truncate text-xs text-gray-500">
                      {entry.test.description}
                    </div>
                    <div className="mt-0.5 text-xs font-medium text-pink-500">
                      {entry.totalViews.toLocaleString()}회 조회
                    </div>
                  </div>
                  <span className="text-gray-300">›</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      <Link
        href="/tests"
        className="mt-3 flex w-full items-center justify-center rounded-full border-2 border-pink-100 bg-white/60 py-2.5 text-sm font-medium text-pink-600 transition hover:bg-white/90 active:scale-[0.98]"
      >
        전체 테스트 보기 →
      </Link>
    </section>
  );
}
