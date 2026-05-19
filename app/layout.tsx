import type { Metadata } from "next";
import { Analytics } from "@/components/analytics/Analytics";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "오늘의 나 - 운세 & 재미 테스트",
    template: "%s | 오늘의 나",
  },
  description:
    "동물상, 전생, 연애 유형부터 타로, 사주, MBTI까지. AI가 분석하는 나만의 오늘.",
  keywords: [
    "운세",
    "타로",
    "사주",
    "MBTI",
    "동물상",
    "심리테스트",
    "재미테스트",
    "연애 유형",
    "전생 직업",
  ],
  openGraph: {
    title: "오늘의 나 - 운세 & 재미 테스트",
    description: "동물상, 전생, 연애 유형부터 타로, 사주, MBTI까지",
    type: "website",
    locale: "ko_KR",
    siteName: "오늘의 나",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "xFE5aKS8LDSMQIc3uW-hu5kZ-fRG_rCZyX5wbp_GAfs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
