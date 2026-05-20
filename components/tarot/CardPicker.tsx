"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { TestDefinition, TestResult } from "@/lib/types/test";

interface CardPickerProps {
  deck: TestDefinition;
}

const CIRCLE_RADIUS = 130;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Stage = "intro" | "spread";

export function CardPicker({ deck }: CardPickerProps) {
  const router = useRouter();
  const [order, setOrder] = useState<TestResult[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [stage, setStage] = useState<Stage>("intro");

  // Shuffle on client mount (during intro) to avoid SSR hydration mismatch
  useEffect(() => {
    setOrder(shuffle(deck.results));
  }, [deck.results]);

  // Intro plays for ~3s, then cards spread
  useEffect(() => {
    if (stage !== "intro") return;
    const t = setTimeout(() => setStage("spread"), 3000);
    return () => clearTimeout(t);
  }, [stage]);

  const total = order.length;

  // Idle highlight: random card lifts every 1.6s after fan reveal completes
  useEffect(() => {
    if (stage !== "spread" || selectedId !== null || total === 0) return;
    let interval: ReturnType<typeof setInterval> | null = null;
    const startTimer = setTimeout(() => {
      setHighlightIndex(Math.floor(Math.random() * total));
      interval = setInterval(() => {
        setHighlightIndex((prev) => {
          let next = Math.floor(Math.random() * total);
          if (next === prev && total > 1) {
            next = (next + 1) % total;
          }
          return next;
        });
      }, 1600);
    }, 1400);

    return () => {
      clearTimeout(startTimer);
      if (interval) clearInterval(interval);
    };
  }, [stage, selectedId, total]);

  function handleSelect(card: TestResult) {
    if (selectedId !== null || total === 0) return;
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(25);
    }
    setSelectedId(card.id);
    // 0.6s 중앙 이동 → 0.7s flip → 0.4s 앞면 머무름 → replace
    setTimeout(() => {
      router.replace(`/result/${deck.slug}/${card.id}`);
    }, 1800);
  }

  const positions = useMemo(() => {
    if (total === 0) return [];
    return order.map((card, i) => {
      const angle = (i / total) * 360 - 90;
      const rad = (angle * Math.PI) / 180;
      return {
        card,
        index: i,
        angle,
        x: CIRCLE_RADIUS * Math.cos(rad),
        y: CIRCLE_RADIUS * Math.sin(rad),
      };
    });
  }, [order, total]);

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence>
        {stage === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24, scale: 0.92 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="absolute flex flex-col items-center"
            style={{ height: 340 }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative h-44 w-56"
            >
              {/* 보라 글로우 (수정구슬 뒤) */}
              <motion.div
                className="absolute right-2 bottom-2 h-24 w-24 rounded-full bg-violet-300/50 blur-2xl"
                animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* 점쟁이 — 좌상단에서 살짝 흔들림 */}
              <motion.span
                className="absolute left-2 top-1 text-[100px] leading-none"
                style={{ transformOrigin: "70% 80%" }}
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              >
                🧙‍♀️
              </motion.span>

              {/* 수정구슬 — 점쟁이 손끝 쪽에 위치, 살짝 맥동 */}
              <motion.span
                className="absolute right-2 bottom-2 text-[78px] leading-none"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                🔮
              </motion.span>

              {/* 수정구슬 주위 스파클 */}
              <motion.span
                className="absolute right-0 top-10 text-2xl"
                animate={{
                  scale: [1, 1.35, 1],
                  opacity: [0.4, 1, 0.4],
                  rotate: [0, 15, 0],
                }}
                transition={{ duration: 1.6, repeat: Infinity }}
              >
                ✨
              </motion.span>
              <motion.span
                className="absolute right-16 -bottom-1 text-lg text-violet-400"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: 0.5,
                }}
              >
                ✦
              </motion.span>
              <motion.span
                className="absolute right-20 top-3 text-base"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: 1,
                }}
              >
                ✨
              </motion.span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.45 }}
              className="mt-4 flex flex-col items-center"
            >
              <p className="text-lg font-bold tracking-tight">
                <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                  오늘의 운세를 뽑아보세요
                </span>
              </p>
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-2 text-xs text-gray-400"
              >
                마음을 가라앉히고 잠시만 기다려주세요
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`relative h-[340px] w-[340px] transition-opacity duration-500 ${
          stage === "intro" ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        {positions.map(({ card, index, angle, x, y }) => {
          const isSelected = selectedId === card.id;
          const isOther = selectedId !== null && !isSelected;
          const cardRotation = angle + 90; // top of card points outward from center
          const isHighlighted = highlightIndex === index && selectedId === null;

          // Push the highlighted card 14px outward along its own axis
          const rad = (angle * Math.PI) / 180;
          const liftX = isHighlighted ? x + 14 * Math.cos(rad) : x;
          const liftY = isHighlighted ? y + 14 * Math.sin(rad) : y;

          return (
            <motion.button
              key={card.id}
              type="button"
              onClick={() => handleSelect(card)}
              aria-label={`타로 카드 ${index + 1} 선택`}
              disabled={selectedId !== null && !isSelected}
              className="absolute left-1/2 top-1/2 h-20 w-14 cursor-pointer"
              style={{
                marginLeft: "-1.75rem",
                marginTop: "-2.5rem",
                perspective: "800px",
                transformStyle: "preserve-3d",
              }}
              initial={{
                x: 0,
                y: 0,
                rotate: 0,
                opacity: 0,
                scale: 0.6,
              }}
              animate={
                isSelected
                  ? {
                      x: 0,
                      y: 0,
                      rotate: 0,
                      opacity: 1,
                      scale: 2.4,
                      zIndex: 50,
                    }
                  : isOther
                  ? {
                      x,
                      y,
                      rotate: cardRotation,
                      opacity: 0.2,
                      scale: 0.9,
                    }
                  : {
                      x: liftX,
                      y: liftY,
                      rotate: cardRotation,
                      opacity: 1,
                      scale: isHighlighted ? 1.08 : 1,
                      zIndex: isHighlighted ? 20 : 10,
                    }
              }
              transition={
                selectedId === null
                  ? isHighlighted
                    ? { duration: 0.5, ease: "easeOut" }
                    : index === highlightIndex
                    ? { duration: 0.4, ease: "easeIn" }
                    : {
                        duration: 0.7,
                        delay: index * 0.035,
                        ease: [0.22, 1, 0.36, 1],
                      }
                  : { duration: 0.6, ease: "easeOut" }
              }
              whileHover={
                selectedId === null
                  ? {
                      scale: 1.15,
                      zIndex: 30,
                      transition: { duration: 0.15 },
                    }
                  : undefined
              }
              whileTap={
                selectedId === null ? { scale: 0.95 } : undefined
              }
            >
              <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={
                  isSelected ? { rotateY: 180 } : { rotateY: 0 }
                }
                transition={{
                  duration: 0.7,
                  delay: isSelected ? 0.6 : 0,
                  ease: "easeInOut",
                }}
              >
                {/* 뒷면 */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 shadow-lg shadow-violet-400/30" />
                  <div className="absolute inset-0.5 rounded-md border border-white/40" />
                  <div className="absolute inset-0 flex items-center justify-center text-white/90">
                    <span className="text-xl">✦</span>
                  </div>
                </div>

                {/* 앞면 — 선택된 카드만 마운트 */}
                {isSelected && card.image && (
                  <div
                    className="absolute inset-0 overflow-hidden rounded-lg bg-white shadow-lg shadow-violet-400/30 ring-1 ring-violet-200"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="160px"
                      className="object-cover"
                      priority
                    />
                  </div>
                )}
              </motion.div>
            </motion.button>
          );
        })}

        {/* 중앙 안내 점 (선택 전) */}
        {selectedId === null && total > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-300"
          />
        )}
      </div>

      <div
        className={`mt-4 h-12 text-center transition-opacity duration-500 ${
          stage === "intro" ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <AnimatePresence mode="wait">
          {total === 0 ? (
            <motion.p
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-400"
            >
              카드를 섞고 있어요...
            </motion.p>
          ) : selectedId === null ? (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-sm font-medium text-gray-700">
                마음에 끌리는 카드 한 장을 선택하세요
              </p>
              <p className="mt-1 text-xs text-gray-400">
                22장 메이저 아르카나가 무작위 순서로 펼쳐졌어요
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="selected"
              initial={{ opacity: 0, y: 6 }}
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
