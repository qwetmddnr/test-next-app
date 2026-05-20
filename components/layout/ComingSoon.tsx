import Link from "next/link";

interface ComingSoonProps {
  emoji: string;
  title: string;
  description: string;
}

export function ComingSoon({ emoji, title, description }: ComingSoonProps) {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8 text-7xl">{emoji}</div>

        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>

        <p className="mt-3 text-sm text-gray-500">{description}</p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-xs font-medium text-violet-600 shadow-sm ring-1 ring-violet-100 backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
          </span>
          준비중이에요
        </div>

        <div className="mt-10 space-y-3">
          <Link
            href="/"
            className="block rounded-full bg-gradient-to-r from-pink-500 to-violet-500 py-3 font-bold text-white shadow-lg shadow-pink-200/60 transition active:scale-95"
          >
            ← 홈에서 다른 테스트 해보기
          </Link>
        </div>
      </div>
    </main>
  );
}
