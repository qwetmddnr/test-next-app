"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 운영 단계에 별도 에러 트래킹 도입 시 여기서 capture
    console.error("[app/error]", error);
  }, [error]);

  return (
    <main className="flex-1 px-5 pb-12 pt-20">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-4 text-8xl">😵‍💫</div>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            일시적인 오류가 발생했어요
          </span>
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          잠시 후 다시 시도하면 대부분 정상으로 돌아와요.
        </p>

        <div className="mt-10 space-y-3">
          <button
            type="button"
            onClick={reset}
            className="block w-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 py-4 font-bold text-white shadow-lg shadow-pink-200/60 transition active:scale-95"
          >
            🔄 다시 시도
          </button>
          <Link
            href="/"
            className="block w-full rounded-full border-2 border-gray-200 bg-white py-4 font-medium text-gray-700 transition hover:border-gray-300 active:scale-95"
          >
            🏠 홈으로
          </Link>
        </div>

        {error.digest && (
          <p className="mt-10 text-[11px] text-gray-300">
            오류 코드: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
