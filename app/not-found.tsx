import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없어요",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex-1 px-5 pb-12 pt-20">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-4 text-8xl">🔮</div>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            페이지를 찾을 수 없어요
          </span>
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          주소가 잘못되었거나, 이미 사라진 페이지일 수 있어요.
        </p>

        <div className="mt-10 space-y-3">
          <Link
            href="/"
            className="block w-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 py-4 font-bold text-white shadow-lg shadow-pink-200/60 transition active:scale-95"
          >
            🏠 홈으로
          </Link>
          <Link
            href="/tests"
            className="block w-full rounded-full border-2 border-gray-200 bg-white py-4 font-medium text-gray-700 transition hover:border-gray-300 active:scale-95"
          >
            🎮 테스트 둘러보기
          </Link>
        </div>

        <p className="mt-10 text-xs text-gray-400">
          찾고 있던 게 무엇이었나요?{" "}
          <Link
            href="/faq"
            className="text-pink-500 underline-offset-2 hover:underline"
          >
            FAQ
          </Link>
          에서 비슷한 안내를 찾을 수 있어요.
        </p>
      </div>
    </main>
  );
}
