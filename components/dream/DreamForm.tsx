"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DREAM_TEXT_MAX, DREAM_TEXT_MIN } from "@/lib/dream/normalize";

export function DreamForm() {
  const router = useRouter();
  const [text, setText] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedLength = text.trim().replace(/\s+/g, " ").length;
  const valid =
    trimmedLength >= DREAM_TEXT_MIN && trimmedLength <= DREAM_TEXT_MAX;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(20);
    }

    try {
      const res = await fetch("/api/dream/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "꿈 해몽에 실패했어요");
      }
      const { token } = (await res.json()) as { token: string };
      router.replace(`/dream/result/${token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "다시 시도해 주세요");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="rounded-3xl bg-white/85 p-6 shadow-sm ring-1 ring-indigo-100 backdrop-blur">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            꿈 내용 <span className="text-indigo-500">*</span>
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, DREAM_TEXT_MAX))}
            placeholder="예: 바다 위를 날아다니다가 큰 물고기를 손에 잡았어요"
            rows={6}
            className="mt-3 w-full resize-none rounded-2xl border-2 border-indigo-100 bg-white/70 px-4 py-3 text-base leading-relaxed text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none"
            autoFocus
          />
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-gray-400">
              {DREAM_TEXT_MIN}자 이상 적어주세요
            </span>
            <span
              className={
                trimmedLength > DREAM_TEXT_MAX
                  ? "font-semibold text-rose-500"
                  : "text-gray-400"
              }
            >
              {trimmedLength} / {DREAM_TEXT_MAX}
            </span>
          </div>
        </label>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </p>
      )}

      <motion.button
        type="submit"
        disabled={!valid || submitting}
        whileTap={valid ? { scale: 0.95 } : undefined}
        animate={
          valid && !submitting
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(99, 102, 241, 0.45)",
                  "0 0 0 12px rgba(99, 102, 241, 0)",
                ],
              }
            : {}
        }
        transition={{
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeOut" },
        }}
        className="mt-6 w-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 py-4 font-bold text-white shadow-lg shadow-indigo-200/60 transition disabled:opacity-40 disabled:shadow-none"
      >
        {submitting ? "꿈을 풀어보는 중..." : "🌙 꿈 해몽 보기"}
      </motion.button>
    </form>
  );
}
