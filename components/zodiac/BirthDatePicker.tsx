"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { zodiacFromDate } from "@/data/tests/zodiac";

const DAYS_IN_MONTH: Record<number, number> = {
  1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30,
  7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31,
};

export function BirthDatePicker() {
  const router = useRouter();
  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const m = parseInt(month, 10);
  const d = parseInt(day, 10);
  const maxDay = useMemo(
    () => (Number.isFinite(m) && m >= 1 && m <= 12 ? DAYS_IN_MONTH[m] : 31),
    [m]
  );
  const valid =
    Number.isFinite(m) && m >= 1 && m <= 12 &&
    Number.isFinite(d) && d >= 1 && d <= maxDay;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(20);
    }
    const sign = zodiacFromDate(m, d);
    setTimeout(() => {
      router.replace(`/result/zodiac/${sign}`);
    }, 400);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-pink-100 backdrop-blur">
        <span className="block text-sm font-medium text-gray-700">
          생일 (양력)
        </span>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="flex items-baseline gap-1 border-b-2 border-pink-200 focus-within:border-pink-500">
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={1}
              max={12}
              placeholder="3"
              value={month}
              onChange={(e) =>
                setMonth(e.target.value.replace(/[^0-9]/g, "").slice(0, 2))
              }
              className="w-full bg-transparent text-3xl font-bold tracking-wider text-gray-900 focus:outline-none"
              autoFocus
            />
            <span className="text-sm text-gray-400">월</span>
          </div>
          <div className="flex items-baseline gap-1 border-b-2 border-pink-200 focus-within:border-pink-500">
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={1}
              max={maxDay}
              placeholder="14"
              value={day}
              onChange={(e) =>
                setDay(e.target.value.replace(/[^0-9]/g, "").slice(0, 2))
              }
              className="w-full bg-transparent text-3xl font-bold tracking-wider text-gray-900 focus:outline-none"
            />
            <span className="text-sm text-gray-400">일</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          양력 생일이에요. 해는 입력하지 않아요.
        </p>
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
        {submitting ? "별자리 확인 중..." : "✨ 오늘 별자리 운세 보기"}
      </motion.button>
    </form>
  );
}
