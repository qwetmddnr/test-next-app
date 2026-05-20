"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdSlot } from "@/components/ads/AdSlot";

interface AIInsightSectionProps {
  insight: string;
  testSlug: string;
  resultId: string;
}

const COUNTDOWN_SECONDS = 5;

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+.*$/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/(?<!\*)\*(?!\s)(.+?)(?<!\s)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^[\s]*[-*]\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function AIInsightSection({
  insight,
  testSlug,
  resultId,
}: AIInsightSectionProps) {
  const cleanInsight = stripMarkdown(insight);
  const previewLines = cleanInsight.split("\n").slice(0, 2).join(" ");

  const [unlocked, setUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  const storageKey = `ai_unlocked:${testSlug}:${resultId}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(storageKey)) setUnlocked(true);
  }, [storageKey]);

  useEffect(() => {
    if (!showModal) return;
    setSecondsLeft(COUNTDOWN_SECONDS);
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          handleUnlockComplete();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  function handleUnlockClick() {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(20);
    }
    setShowModal(true);
  }

  function handleUnlockComplete() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(storageKey, "1");
    }
    setUnlocked(true);
    setTimeout(() => setShowModal(false), 400);
  }

  if (unlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mt-4 rounded-2xl bg-gradient-to-br from-violet-50 to-pink-50 p-5 ring-1 ring-violet-200 backdrop-blur"
      >
        <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-violet-700">
          <span>✨</span> AI가 본 당신
        </h3>
        <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
          {cleanInsight}
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 to-pink-50 p-5 ring-1 ring-violet-200 backdrop-blur">
        <h3 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-violet-700">
          <span>✨</span> AI가 본 당신
          <span className="ml-1 text-xs font-medium text-violet-400">
            🔒 잠김
          </span>
        </h3>

        <p
          className="select-none text-sm leading-relaxed text-gray-500"
          style={{ filter: "blur(4px)" }}
          aria-hidden
        >
          {previewLines}
        </p>

        <p className="mt-3 text-xs text-violet-500">
          ✨ AI가 분석한 당신만의 오늘 메시지를 확인해보세요
        </p>

        <motion.button
          type="button"
          onClick={handleUnlockClick}
          whileTap={{ scale: 0.96 }}
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(167, 139, 250, 0.45)",
              "0 0 0 12px rgba(167, 139, 250, 0)",
            ],
          }}
          transition={{
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeOut" },
          }}
          className="mt-4 w-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200/60"
        >
          🎁 광고 보고 잠금 해제하기
        </motion.button>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-4 text-center">
                <h3 className="text-base font-bold text-gray-900">
                  잠시만 광고를 봐주세요
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  AI 분석 콘텐츠가 곧 잠금 해제돼요
                </p>
              </div>

              <AdSlot slot="reward-unlock" />

              <div className="mt-4">
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-xs text-gray-500">잠금 해제까지</span>
                  <span className="text-2xl font-bold text-violet-600">
                    {secondsLeft}
                    <span className="text-sm font-medium text-gray-400">초</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-violet-100">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-violet-400 to-pink-400"
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${
                        ((COUNTDOWN_SECONDS - secondsLeft) /
                          COUNTDOWN_SECONDS) *
                        100
                      }%`,
                    }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
