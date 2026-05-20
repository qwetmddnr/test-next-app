"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { TestDefinition, TestResult } from "@/lib/types/test";

interface CardPickerProps {
  deck: TestDefinition;
}

const CARDS_SHOWN = 5;
const FAN_SPREAD_DEG = 18;

function shuffleAndPick(results: TestResult[], n: number): TestResult[] {
  const arr = [...results];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, n);
}

export function CardPicker({ deck }: CardPickerProps) {
  const router = useRouter();
  const [cards, setCards] = useState<TestResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Client-only randomize to avoid SSR hydration mismatch
  useEffect(() => {
    setCards(shuffleAndPick(deck.results, CARDS_SHOWN));
  }, [deck.results]);

  function handleSelect(index: number) {
    if (selectedIndex !== null || cards.length === 0) return;
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(25);
    }
    setSelectedIndex(index);
    setTimeout(() => {
      router.push(`/result/${deck.slug}/${cards[index].id}`);
    }, 1100);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[320px] w-full">
        {cards.map((card, i) => {
          const angle = (i - (CARDS_SHOWN - 1) / 2) * FAN_SPREAD_DEG;
          const isSelected = selectedIndex === i;
          const isOther = selectedIndex !== null && !isSelected;

          return (
            <motion.button
              key={`${card.id}-${i}`}
              type="button"
              onClick={() => handleSelect(i)}
              aria-label={`카드 ${i + 1} 선택`}
              className="absolute left-1/2 bottom-2 h-44 w-28 cursor-pointer"
              style={{
                transformOrigin: "50% 130%",
                marginLeft: "-3.5rem",
                zIndex: 10 - Math.abs(i - 2),
              }}
              initial={{ rotate: 0, y: 280, opacity: 0 }}
              animate={
                isSelected
                  ? {
                      rotate: [angle, 0],
                      y: [0, -140],
                      scale: [1, 1.15],
                      opacity: 1,
                    }
                  : isOther
                  ? { rotate: angle, y: 0, opacity: 0.3, scale: 0.95 }
                  : { rotate: angle, y: 0, opacity: 1, scale: 1 }
              }
              transition={
                selectedIndex === null
                  ? { duration: 0.6, delay: i * 0.08, ease: "easeOut" }
                  : { duration: 0.6, ease: "easeOut" }
              }
              whileHover={
                selectedIndex === null
                  ? { y: -18, transition: { duration: 0.2 } }
                  : undefined
              }
              whileTap={
                selectedIndex === null ? { scale: 0.95 } : undefined
              }
              disabled={selectedIndex !== null && !isSelected}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 shadow-xl shadow-violet-400/40" />
              <div className="absolute inset-1.5 rounded-xl border-2 border-white/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/90">
                <span className="text-3xl">✦</span>
                <span className="mt-1 text-[10px] tracking-widest text-white/60">
                  TAROT
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-2 h-12 text-center">
        <AnimatePresence mode="wait">
          {cards.length === 0 ? (
            <motion.p
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-400"
            >
              카드를 섞고 있어요...
            </motion.p>
          ) : selectedIndex === null ? (
            <motion.div
              key="hint"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm font-medium text-gray-700">
                마음에 끌리는 카드 한 장을 선택하세요
              </p>
              <p className="mt-1 text-xs text-gray-400">
                22장 중 무작위로 5장이 펼쳐졌어요
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="selected"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium text-pink-600"
            >
              ✨ 카드가 선택됐어요
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
