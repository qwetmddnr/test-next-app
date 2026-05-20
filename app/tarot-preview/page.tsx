import type { Metadata } from "next";
import Link from "next/link";
import WitchCharacter from "@/components/tarot/WitchCharacter";

export const metadata: Metadata = {
  title: "타로 인트로 미리보기",
  description: "WitchCharacter SVG 인트로 디자인 미리보기 (참고용)",
  robots: { index: false, follow: false },
};

export default function TarotPreviewPage() {
  return (
    <main className="flex-1 px-5 pb-12 pt-6">
      <div className="mx-auto max-w-md">
        <Link
          href="/tarot"
          className="text-sm text-gray-500 transition hover:text-gray-700"
        >
          ← 현재 타로 페이지로
        </Link>

        <header className="mt-4 rounded-2xl bg-amber-50 p-3 ring-1 ring-amber-200">
          <p className="text-xs font-bold text-amber-700">
            🧪 미리보기 페이지
          </p>
          <p className="mt-1 text-xs text-amber-700/80">
            메인 /tarot 페이지는 변경 없음. 이 디자인이 마음에 들면 적용 진행.
          </p>
        </header>

        <header className="mt-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
              오늘의 운세
            </span>
          </h1>
          <p className="mt-1 text-xs text-gray-500">새 인트로 디자인 시안</p>
        </header>

        <div className="mt-6 overflow-hidden rounded-3xl shadow-xl shadow-violet-300/30 ring-1 ring-violet-200">
          <WitchCharacter />
        </div>

        <div className="mt-6 text-center">
          <p className="text-lg font-bold tracking-tight">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              오늘의 운세를 뽑아보세요
            </span>
          </p>
          <p className="mt-2 text-xs text-gray-400">
            마음을 가라앉히고 잠시만 기다려주세요
          </p>
        </div>

        <section className="mt-12 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
          <p className="text-xs font-bold text-gray-500">
            🃏 여기서 22장 카드 펼침이 시작됩니다
          </p>
          <p className="mt-2 text-[11px] text-gray-400">
            실제 동작은 메인 /tarot 페이지에서 확인 가능
          </p>
        </section>

        <section className="mt-8 rounded-2xl bg-white/70 p-4 ring-1 ring-violet-100">
          <h2 className="mb-2 text-xs font-bold text-gray-700">
            ⚙️ 현재 인트로 vs 새 인트로
          </h2>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500">
                <th className="pb-1 text-left">항목</th>
                <th className="pb-1 text-left">현재</th>
                <th className="pb-1 text-left">새 시안</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-t">
                <td className="py-1.5">캐릭터</td>
                <td>🧙‍♀️ emoji</td>
                <td>SVG 일러스트</td>
              </tr>
              <tr className="border-t">
                <td className="py-1.5">배경</td>
                <td>밝은 그라데이션</td>
                <td>다크 보라 (별/달)</td>
              </tr>
              <tr className="border-t">
                <td className="py-1.5">디테일</td>
                <td>이모지 의존</td>
                <td>꼬깔모자/로브/별 가득</td>
              </tr>
              <tr className="border-t">
                <td className="py-1.5">애니메이션</td>
                <td>흔들림 + 부유</td>
                <td>부유 + 빛/별 + 회전</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
