"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isKakaoConfigured, shareToKakaoScrap } from "@/lib/kakao";

interface ShareButtonProps {
  url: string;
  title: string;
  text: string;
}

export function ShareButton({ url }: ShareButtonProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [kakaoReady, setKakaoReady] = useState(false);

  // Defer the env check to client-side to avoid any SSR/CSR mismatch concerns
  // when the env var is missing on the server but present on the client
  // (Next inlines NEXT_PUBLIC_* at build, but this keeps things tidy).
  useEffect(() => {
    setKakaoReady(isKakaoConfigured());
  }, []);

  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  function getAbsoluteUrl(): string {
    if (typeof window !== "undefined" && url.startsWith("/")) {
      return `${window.location.origin}${url}`;
    }
    return url;
  }

  async function handleCopy() {
    const absoluteUrl = getAbsoluteUrl();
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setSheetOpen(false);
    } catch {
      window.prompt("아래 링크를 복사하세요", absoluteUrl);
      setSheetOpen(false);
    }
  }

  async function handleKakao() {
    const absoluteUrl = getAbsoluteUrl();
    try {
      await shareToKakaoScrap(absoluteUrl);
      setSheetOpen(false);
    } catch {
      // SDK 로드/초기화 실패 시 URL 복사로 폴백
      await handleCopy();
    }
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setSheetOpen(true)}
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
        {sheetOpen && (
          <>
            <motion.div
              key="share-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSheetOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              aria-hidden
            />
            <motion.div
              key="share-sheet"
              role="dialog"
              aria-modal="true"
              aria-label="공유하기"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-3xl bg-white px-5 pb-7 pt-4 shadow-2xl"
            >
              <div className="mb-3 flex justify-center">
                <div className="h-1.5 w-12 rounded-full bg-gray-200" />
              </div>
              <h3 className="mb-4 text-center text-base font-bold text-gray-800">
                공유하기
              </h3>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex w-full items-center gap-4 rounded-2xl bg-gray-50 p-4 transition active:scale-[0.98] hover:bg-gray-100"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-violet-400 text-xl">
                    📋
                  </span>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-bold text-gray-900">
                      URL 복사
                    </div>
                    <div className="text-xs text-gray-500">
                      링크를 복사해서 어디든 보내요
                    </div>
                  </div>
                </button>

                {kakaoReady && (
                  <button
                    type="button"
                    onClick={handleKakao}
                    className="flex w-full items-center gap-4 rounded-2xl bg-[#FEE500]/15 p-4 transition active:scale-[0.98] hover:bg-[#FEE500]/25"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FEE500] text-xl">
                      💬
                    </span>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-bold text-gray-900">
                        카카오로 공유
                      </div>
                      <div className="text-xs text-gray-500">
                        카카오톡으로 친구에게 보내기
                      </div>
                    </div>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="mt-5 w-full rounded-full border border-gray-200 bg-white py-3 text-sm font-medium text-gray-600 transition hover:border-gray-300 active:scale-95"
              >
                닫기
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
    </>
  );
}
