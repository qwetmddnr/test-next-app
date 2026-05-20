"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { zodiacFromYear } from "@/data/tests/new-year";

interface BirthYearPickerProps {
  thisYear: number;
}

export function BirthYearPicker({ thisYear }: BirthYearPickerProps) {
  const router = useRouter();
  const [year, setYear] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const y = parseInt(year, 10);
    if (!Number.isFinite(y)) return;
    if (y < 1920 || y > thisYear) return;
    if (submitting) return;

    setSubmitting(true);
    const zodiac = zodiacFromYear(y);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(20);
    }
    setTimeout(() => {
      router.replace(`/result/new-year/${zodiac}`);
    }, 400);
  }

  const y = parseInt(year, 10);
  const valid = Number.isFinite(y) && y >= 1920 && y <= thisYear;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-pink-100 backdrop-blur">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">출생년도</span>
          <div className="mt-3 flex items-baseline gap-2">
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={1920}
              max={thisYear}
              placeholder="1995"
              value={year}
              onChange={(e) => setYear(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
              className="w-full border-b-2 border-pink-200 bg-transparent text-4xl font-bold tracking-wider text-gray-900 focus:border-pink-500 focus:outline-none"
              autoFocus
            />
            <span className="text-lg text-gray-400">년</span>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            양력 기준 · 1920년 ~ {thisYear}년
          </p>
        </label>
      </div>

      <motion.button
        type="submit"
        disabled={!valid || submitting}
        whileTap={valid ? { scale: 0.95 } : undefined}
        animate={
          valid && !submitting
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(255, 107, 157, 0.45)",
                  "0 0 0 12px rgba(255, 107, 157, 0)",
                ],
              }
            : {}
        }
        transition={{
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeOut" },
        }}
        className="mt-6 w-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 py-4 font-bold text-white shadow-lg shadow-pink-200/60 transition disabled:opacity-40 disabled:shadow-none"
      >
        {submitting ? "운세 확인 중..." : "✨ 올해 운세 보기"}
      </motion.button>
    </form>
  );
}
