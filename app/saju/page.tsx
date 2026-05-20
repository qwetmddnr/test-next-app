import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "사주 - 준비중",
  description:
    "AI 사주 분석을 준비 중이에요. 만세력 기반 정확한 분석으로 곧 만나요.",
  openGraph: {
    title: "사주 - 준비중",
    description: "AI 사주 분석을 준비 중이에요",
    type: "website",
    locale: "ko_KR",
  },
};

export default function SajuPage() {
  return (
    <ComingSoon
      emoji="☯️"
      title="오늘의 사주"
      description={
        "만세력 기반의 AI 사주 분석을 정성껏 준비하고 있어요.\n조금만 기다려 주세요 ✨"
      }
    />
  );
}
