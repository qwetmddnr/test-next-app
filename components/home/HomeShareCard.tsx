"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isKakaoConfigured, shareToKakaoFeed, shareToKakaoScrap } from "@/lib/kakao";

const SHARE_TITLE = "오나 OHNA — 오나테 · 오늘의 나";
const SHARE_DESCRIPTION =
  "오나테(오나 테스트)에서 만나는 무료 운세·성향 테스트 모음. 사주·타로·MBTI·동물상·전생·연애·띠운세.";

function getOgImageUrl(): string | null {
  if (typeof document === "undefined") return null;
  const meta = document.querySelector<HTMLMetaElement>(
    'meta[property="og:image"]'
  );
  const content = meta?.content?.trim();
  if (!content) return null;
  if (content.startsWith("http")) return content;
  if (content.startsWith("/") && typeof window !== "undefined") {
    return `${window.location.origin}${content}`;
  }
  return null;
}

export function HomeShareCard() {
  const [copied, setCopied] = useState(false);
  const kakaoReady = isKakaoConfigured();

  function getHomeUrl(): string {
    if (typeof window === "undefined") return "https://ohna.today";
    return window.location.origin || "https://ohna.today";
  }

  async function handleCopy() {
    const url = getHomeUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("아래 링크를 복사하세요", url);
    }
  }

  async function handleKakao() {
    const url = getHomeUrl();
    const imageUrl = getOgImageUrl();
    try {
      if (imageUrl) {
        await shareToKakaoFeed({
          url,
          title: SHARE_TITLE,
          description: SHARE_DESCRIPTION,
          imageUrl,
          buttonLabel: "오나 둘러보기",
        });
      } else {
        await shareToKakaoScrap(url);
      }
    } catch {
      await handleCopy();
    }
  }

  return (
    <section className="mb-8">
      <div className="rounded-2xl bg-white/80 p-5 ring-1 ring-pink-100 backdrop-blur">
        <h2 className="mb-1 flex items-center gap-1.5 text-sm font-bold text-gray-800">
          📣 오나, 친구에게도 알려주세요
        </h2>
        <p className="text-xs text-gray-500">
          링크 한 줄이면 친구도 바로 오늘의 나를 만나러 올 수 있어요
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <motion.button
            type="button"
            onClick={handleCopy}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 rounded-full bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
          >
            📋 URL 복사
          </motion.button>

          {kakaoReady ? (
            <motion.button
              type="button"
              onClick={handleKakao}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 rounded-full bg-[#FEE500] px-4 py-3 text-sm font-bold text-gray-900 transition hover:brightness-95"
            >
              💬 카카오로 공유
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={handleCopy}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-400 to-violet-400 px-4 py-3 text-sm font-bold text-white"
            >
              🔗 링크 공유
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-8 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-gray-900/90 px-5 py-3 text-sm text-white shadow-lg backdrop-blur"
          >
            📋 링크가 복사됐어요!
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
