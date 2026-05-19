"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonProps {
  url: string;
  title: string;
  text: string;
}

export function ShareButton({ url, title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const absoluteUrl =
      typeof window !== "undefined" && url.startsWith("/")
        ? `${window.location.origin}${url}`
        : url;

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ url: absoluteUrl, title, text });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("아래 링크를 복사하세요", absoluteUrl);
    }
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={handleShare}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(255, 107, 157, 0.5)",
            "0 0 0 14px rgba(255, 107, 157, 0)",
          ],
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeOut" },
        }}
        className="w-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 py-4 font-bold text-white shadow-lg shadow-pink-200/60"
      >
        ⤴ 친구에게 공유하기
      </motion.button>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900/90 px-5 py-3 text-sm text-white shadow-lg backdrop-blur"
          >
            📋 링크가 복사됐어요!
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
