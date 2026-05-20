"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { TestDefinition } from "@/lib/types/test";

interface CardPickerProps {
  deck: TestDefinition;
}

type Stage = "idle" | "shuffling" | "revealing";

export function CardPicker({ deck }: CardPickerProps) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("idle");

  function handleDraw() {
    if (stage !== "idle") return;
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(20);
    }
    setStage("shuffling");

    setTimeout(() => {
      setStage("revealing");
      setTimeout(() => {
        const card =
          deck.results[Math.floor(Math.random() * deck.results.length)];
        router.push(`/result/${deck.slug}/${card.id}`);
      }, 700);
    }, 1500);
  }

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="relative flex h-72 w-48 cursor-pointer items-center justify-center"
        onClick={handleDraw}
        animate={
          stage === "shuffling"
            ? { rotate: [0, 6, -6, 6, -6, 0], y: [0, -8, 0, -8, 0, 0] }
            : stage === "revealing"
            ? { rotate: [0, 360], scale: [1, 1.15, 1] }
            : {}
        }
        transition={
          stage === "shuffling"
            ? { duration: 1.4, ease: "easeInOut" }
            : stage === "revealing"
            ? { duration: 0.7, ease: "easeOut" }
            : { duration: 0.3 }
        }
        whileHover={stage === "idle" ? { scale: 1.04 } : undefined}
        whileTap={stage === "idle" ? { scale: 0.95 } : undefined}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 shadow-2xl shadow-violet-300/60" />
        <div className="absolute inset-2 rounded-xl border-2 border-white/40" />
        <div className="absolute inset-0 flex items-center justify-center text-7xl">
          <AnimatePresence mode="wait">
            {stage === "idle" && (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                ✦
              </motion.span>
            )}
            {stage === "shuffling" && (
              <motion.span
                key="shuffling"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, scale: [0.8, 1.2, 0.8] }}
                exit={{ opacity: 0 }}
                transition={{
                  scale: { duration: 0.6, repeat: Infinity },
                }}
              >
                🌀
              </motion.span>
            )}
            {stage === "revealing" && (
              <motion.span
                key="revealing"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                ✨
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="mt-8 h-12 text-center">
        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div
              key="hint"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-sm font-medium text-gray-700">
                마음에 끌리는 순간 카드를 탭하세요
              </p>
              <p className="mt-1 text-xs text-gray-400">
                22장 메이저 아르카나 · 한 장 뽑기
              </p>
            </motion.div>
          )}
          {stage === "shuffling" && (
            <motion.p
              key="shuffling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-medium text-violet-600"
            >
              카드를 섞고 있어요...
            </motion.p>
          )}
          {stage === "revealing" && (
            <motion.p
              key="revealing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-medium text-pink-600"
            >
              ✨ 카드가 선택됐어요
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {stage === "idle" && (
        <motion.button
          type="button"
          onClick={handleDraw}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(167, 139, 250, 0.4)",
              "0 0 0 14px rgba(167, 139, 250, 0)",
            ],
          }}
          transition={{
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeOut" },
          }}
          className="mt-6 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200/60"
        >
          🃏 카드 한 장 뽑기
        </motion.button>
      )}
    </div>
  );
}
