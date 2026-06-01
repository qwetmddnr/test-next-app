import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto px-5 py-8 text-center text-xs text-gray-400">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
        <Link href="/about" className="transition hover:text-gray-600">
          소개
        </Link>
        <span className="text-gray-300">·</span>
        <Link href="/faq" className="transition hover:text-gray-600">
          FAQ
        </Link>
        <span className="text-gray-300">·</span>
        <Link href="/terms" className="transition hover:text-gray-600">
          이용약관
        </Link>
        <span className="text-gray-300">·</span>
        <Link href="/privacy" className="transition hover:text-gray-600">
          개인정보처리방침
        </Link>
      </div>
      <p className="mt-2">
        ✨ 운세와 재미 테스트는 즐거움을 위한 콘텐츠예요
      </p>
      <p className="mt-1 text-[11px] text-gray-300">
        © 2026 ohna.today | 오늘의 나
      </p>
    </footer>
  );
}
