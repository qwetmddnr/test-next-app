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
    default: "오나 OHNA — 오늘의 나",
    template: "%s | 오나 OHNA",
  },
  description:
    "오늘의 나(오나)에서 만나는 7가지 무료 운세·성향 테스트. 사주·타로·MBTI·동물상·전생·연애·띠운세.",
  keywords: [
    "오나",
    "OHNA",
    "오늘의 나",
    "운세",
    "타로",
    "사주",
    "MBTI",
    "동물상",
    "심리테스트",
    "재미테스트",
    "연애 유형",
    "전생 직업",
    "띠운세",
  ],
  openGraph: {
    title: "오나 OHNA — 오늘의 나",
    description:
      "오늘의 나(오나)에서 만나는 7가지 무료 운세·성향 테스트. 사주·타로·MBTI·동물상·전생·연애·띠운세.",
    type: "website",
    locale: "ko_KR",
    siteName: "오나 OHNA",
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
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        {/* AdSense loader는 SSR HTML의 <head>에 직접 박아야 AdSense bot이 site verification 단계에서 발견함.
            next/script의 afterInteractive는 hydration 후 inject돼서 bot이 못 봄. */}
        {adsenseClient && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
