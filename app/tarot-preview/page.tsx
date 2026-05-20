import type { Metadata } from "next";
import Link from "next/link";
import WitchCharacter from "@/components/tarot/WitchCharacter";
import CuteWitchCharacter from "@/components/tarot/CuteWitchCharacter";
import CatFortuneTellerCharacter from "@/components/tarot/CatFortuneTellerCharacter";

export const metadata: Metadata = {
  title: "타로 인트로 시안 비교",
  description: "타로 인트로 캐릭터 SVG 시안 비교 미리보기 (참고용)",
  robots: { index: false, follow: false },
};

const VARIANTS = [
  {
    id: "A",
    label: "시안 A · 다크 고딕 마녀",
    description: "정교한 일러스트 · 다크 보라 · 별과 달 · 흔들리는 마녀",
    Character: WitchCharacter,
    tone: "다크/정통",
  },
  {
    id: "B",
    label: "시안 B · 큐트팝 마녀",
    description: "사이트 톤 일치 · 핑크/보라 · 둥글둥글 · kawaii 눈",
    Character: CuteWitchCharacter,
    tone: "큐트/사이트 톤",
  },
  {
    id: "C",
    label: "시안 C · 검은 고양이 점쟁이",
    description: "캐릭터 변형 · 다크 보라 · 황금 눈 · 꼬리 흔들림",
    Character: CatFortuneTellerCharacter,
    tone: "다크/캐릭터 변형",
  },
];

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
            메인 /tarot은 변경 없음. 선택한 시안 알려주시면 적용 진행합니다.
          </p>
        </header>

        <header className="mt-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
              타로 인트로 시안 비교
            </span>
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            3가지 시안 · 같은 텍스트 / 다른 캐릭터
          </p>
        </header>

        <div className="mt-8 space-y-10">
          {VARIANTS.map(({ id, label, description, Character, tone }) => (
            <section key={id}>
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-violet-500 text-xs font-bold text-white">
                    {id}
                  </span>
                  <h2 className="text-sm font-bold text-gray-800">{label}</h2>
                </div>
                <p className="mt-1 text-xs text-gray-500">{description}</p>
                <p className="mt-0.5 text-[10px] font-medium text-violet-500">
                  {tone}
                </p>
              </div>

              <div className="overflow-hidden rounded-3xl shadow-xl shadow-violet-200/40 ring-1 ring-violet-100">
                <Character />
              </div>

              <div className="mt-3 text-center">
                <p className="text-sm font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                    오늘의 운세를 뽑아보세요
                  </span>
                </p>
                <p className="mt-1 text-[11px] text-gray-400">
                  마음을 가라앉히고 잠시만 기다려주세요
                </p>
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-2xl bg-white/70 p-4 ring-1 ring-violet-100">
          <h3 className="mb-3 text-xs font-bold text-gray-700">
            ⚙️ 시안별 특징 비교
          </h3>
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-gray-500">
                <th className="pb-2 text-left">항목</th>
                <th className="pb-2 text-left">A (다크)</th>
                <th className="pb-2 text-left">B (큐트)</th>
                <th className="pb-2 text-left">C (고양이)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-t">
                <td className="py-1.5">사이트 톤 일치</td>
                <td>약함</td>
                <td>강함</td>
                <td>약함</td>
              </tr>
              <tr className="border-t">
                <td className="py-1.5">신비로움</td>
                <td>강함</td>
                <td>중간</td>
                <td>강함</td>
              </tr>
              <tr className="border-t">
                <td className="py-1.5">친근함</td>
                <td>중간</td>
                <td>강함</td>
                <td>중간</td>
              </tr>
              <tr className="border-t">
                <td className="py-1.5">디테일</td>
                <td>높음</td>
                <td>중간</td>
                <td>중간</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="mt-8 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
          <p className="text-xs text-gray-500">
            이 시안 이후 22장 카드 펼침 애니메이션이 이어집니다
          </p>
        </section>
      </div>
    </main>
  );
}
