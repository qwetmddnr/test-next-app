import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto px-5 py-8 text-center text-xs text-gray-400">
      <div className="flex items-center justify-center gap-3">
        <Link href="/terms" className="transition hover:text-gray-600">
          이용약관
        </Link>
        <span className="text-gray-300">·</span>
        <Link href="/privacy" className="transition hover:text-gray-600">
          개인정보처리방침
        </Link>
      </div>
      <p className="mt-2">
        ✨ 오늘의 나 · 운세와 재미 테스트는 즐거움을 위한 콘텐츠예요
      </p>
    </footer>
  );
}
