"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { TestAnswers, TestDefinition } from "@/lib/types/test";
import { calculateResult } from "@/lib/test/calculate";

interface TestRunnerProps {
  test: TestDefinition;
}

export function TestRunner({ test }: TestRunnerProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<TestAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const currentQuestion = test.questions[currentIndex];
  const isLast = currentIndex === test.questions.length - 1;
  const progressPercent = ((currentIndex + 1) / test.questions.length) * 100;

  function handleSelect(optionId: string) {
    if (selectedOptionId) return;
    setSelectedOptionId(optionId);

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(20);
    }

    setTimeout(() => {
      const newAnswers: TestAnswers = {
        ...answers,
        [currentQuestion.id]: optionId,
      };

      if (isLast) {
        const result = calculateResult(test, newAnswers);
        router.replace(`/result/${test.slug}/${result.id}`);
      } else {
        setAnswers(newAnswers);
        setCurrentIndex((i) => i + 1);
        setSelectedOptionId(null);
      }
    }, 600);
  }

  return (
    <main className="flex-1 px-5 pb-8 pt-6">
      <div className="mx-auto max-w-md">
        <header className="mb-8">
          <Link
            href="/"
            className="text-sm text-gray-500 transition hover:text-gray-700"
          >
            ← 홈으로
          </Link>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-sm font-medium text-gray-700">
              질문 {currentIndex + 1}
              <span className="text-gray-400"> / {test.questions.length}</span>
            </span>
            <span className="text-xs font-semibold text-pink-500">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-pink-100/70 ring-1 ring-pink-200/50">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-violet-400 shadow-sm shadow-pink-300/50"
              animate={{ width: `${progressPercent}%` }}
              initial={{ width: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <h2 className="mb-8 text-2xl font-bold leading-snug text-gray-900">
              {currentQuestion.text}
            </h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const isDisabled =
                  selectedOptionId !== null && !isSelected;
                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option.id)}
                    disabled={selectedOptionId !== null}
                    whileTap={{ scale: 0.97 }}
                    animate={{ opacity: isDisabled ? 0.4 : 1 }}
                    className={`relative w-full overflow-hidden rounded-2xl border-2 bg-white/90 p-4 text-left shadow-sm backdrop-blur transition-colors disabled:cursor-default ${
                      isSelected
                        ? "border-pink-400 shadow-pink-200/50"
                        : "border-pink-100 hover:border-pink-200"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-200/70 via-pink-100/70 to-pink-200/70"
                      />
                    )}
                    <div className="relative flex items-center justify-between gap-3">
                      <span className="font-medium text-gray-800">
                        {option.text}
                      </span>
                      <span
                        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                          isSelected
                            ? "bg-pink-500 text-white"
                            : "border-2 border-gray-300 bg-white text-transparent"
                        }`}
                      >
                        {isSelected ? (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.3, 1] }}
                            transition={{ duration: 0.4, delay: 0.15 }}
                          >
                            ✓
                          </motion.span>
                        ) : null}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
