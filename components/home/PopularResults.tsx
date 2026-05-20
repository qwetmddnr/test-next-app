import Link from "next/link";
import type { PopularResultEntry } from "@/lib/stats/popular";

interface PopularResultsProps {
  entries: PopularResultEntry[];
}

const RANK_BADGES = ["🥇", "🥈", "🥉", "4", "5", "6", "7", "8", "9", "10"];

export function PopularResults({ entries }: PopularResultsProps) {
  if (entries.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-gray-800">🔥 지금 인기 있는 결과</h2>
        <span className="text-xs text-gray-400">실시간 조회수 기준</span>
      </div>
      <ol className="space-y-2">
        {entries.map((entry, index) => {
          const badge = RANK_BADGES[index] ?? `${index + 1}`;
          const isTopThree = index < 3;
          return (
            <li key={`${entry.test.slug}-${entry.result.id}`}>
              <Link
                href={`/result/${entry.test.slug}/${entry.result.id}`}
                className="block rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-pink-100 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-base font-bold ${
                      isTopThree
                        ? "bg-gradient-to-br from-pink-100 to-violet-100 text-xl"
                        : "bg-gray-100 text-sm text-gray-500"
                    }`}
                  >
                    {badge}
                  </span>
                  <span className="text-3xl">{entry.result.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-semibold text-gray-900">
                      {entry.result.title}
                    </div>
                    <div className="truncate text-xs text-gray-500">
                      {entry.test.title} · {entry.viewCount.toLocaleString()}회 조회
                    </div>
                  </div>
                  <span className="text-gray-300">›</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
