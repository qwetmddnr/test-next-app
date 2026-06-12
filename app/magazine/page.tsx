import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/blog/loader";
import type { Article } from "@/lib/blog/types";

export const metadata: Metadata = {
  title: "오나 매거진 — 운세·심리·테스트 이야기",
  description:
    "정신연령·번아웃·MBTI·동물상까지, 오나(OHNA)가 가볍게 풀어내는 운세와 심리 이야기. 테스트 전에 읽으면 더 재미있는 읽을거리 모음이에요.",
  alternates: { canonical: "/magazine" },
  openGraph: {
    title: "오나 매거진 | 오나 OHNA",
    description: "운세와 심리, 성격 테스트를 가볍게 풀어내는 읽을거리 모음",
    type: "website",
    locale: "ko_KR",
  },
};

export default function MagazinePage() {
  const articles = getAllArticles();

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
              오나 매거진
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            ✨ 운세와 마음, 테스트를 가볍게 풀어낸 읽을거리
          </p>
        </header>

        <div className="space-y-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </main>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/magazine/${article.slug}`}
      className="block rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-pink-100 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        <span className="text-4xl">{article.emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-600 ring-1 ring-violet-100">
              {article.category}
            </span>
            <span className="text-[11px] text-gray-400">
              {article.readMinutes}분 읽기
            </span>
          </div>
          <div className="font-semibold leading-snug text-gray-900">
            {article.title}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {article.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
