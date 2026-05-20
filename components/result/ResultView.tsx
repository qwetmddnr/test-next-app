"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import confetti from "canvas-confetti";
import type { TestDefinition, TestResult } from "@/lib/types/test";
import { fadeUp, resultEmoji } from "@/lib/motion/variants";
import { AdSlot } from "@/components/ads/AdSlot";
import { createClient } from "@/lib/supabase/client";
import { ShareButton } from "./ShareButton";

interface ResultViewProps {
  test: TestDefinition;
  result: TestResult;
  otherTests?: TestDefinition[];
  triggerConfetti?: boolean;
}

export function ResultView({
  test,
  result,
  otherTests = [],
  triggerConfetti = true,
}: ResultViewProps) {
  const [viewCount, setViewCount] = useState<number | null>(null);

  useEffect(() => {
    if (!triggerConfetti) return;
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.4 },
      colors: ["#FF6B9D", "#A78BFA", "#FBBF24", "#FFB3CD"],
    });
  }, [triggerConfetti]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

    const supabase = createClient();
    const key = `viewed:${test.slug}:${result.id}`;
    const alreadyViewed =
      typeof window !== "undefined" && sessionStorage.getItem(key);

    const apply = (n: number | null) => {
      if (n !== null && !Number.isNaN(n)) setViewCount(n);
    };

    if (alreadyViewed) {
      supabase
        .from("result_stats")
        .select("view_count")
        .eq("test_type", test.slug)
        .eq("result_id", result.id)
        .maybeSingle()
        .then(({ data }) => apply(data ? Number(data.view_count) : null));
    } else {
      sessionStorage.setItem(key, "1");
      supabase
        .rpc("increment_result_view", {
          p_test_type: test.slug,
          p_result_id: result.id,
        })
        .then(({ data }) => apply(data !== null ? Number(data) : null));
    }
  }, [test.slug, result.id]);

  const matchResults = result.matches
    .map((id) => test.results.find((r) => r.id === id))
    .filter((r): r is TestResult => Boolean(r));

  const avoidResults = result.avoid
    .map((id) => test.results.find((r) => r.id === id))
    .filter((r): r is TestResult => Boolean(r));

  const shareUrl = `/result/${test.slug}/${result.id}`;
  const shareTitle = `${result.title} - 오늘의 나`;
  const shareText = `나는 ${result.emoji} ${result.title}! ${result.shortDesc}`;

  return (
    <main className="flex-1 px-5 pb-12 pt-8">
      <div className="mx-auto max-w-md">
        <motion.div
          variants={resultEmoji}
          initial="hidden"
          animate="show"
          className="mb-2 text-center text-8xl"
        >
          {result.emoji}
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.4}
          className="text-center text-3xl font-bold tracking-tight"
        >
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            당신은 {result.title}!
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.6}
          className="mt-3 text-center text-gray-600"
        >
          {result.shortDesc}
        </motion.p>

        {viewCount !== null && viewCount > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="mt-2 text-center text-xs text-gray-400"
          >
            ✨ {viewCount.toLocaleString()}회 조회됨
          </motion.p>
        )}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.8}
          className="mt-8"
        >
          <AdSlot slot="result-top" />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.9}
          className="mt-2 rounded-2xl bg-white/80 p-5 ring-1 ring-pink-100 backdrop-blur"
        >
          <p className="text-sm leading-relaxed text-gray-700">
            {result.description}
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.1}
          className="mt-6"
        >
          <h3 className="mb-3 text-sm font-bold text-gray-700">💫 성격 키워드</h3>
          <div className="flex flex-wrap gap-2">
            {result.traits.map((trait) => (
              <span
                key={trait}
                className="rounded-full bg-pink-100 px-3 py-1.5 text-xs font-medium text-pink-700"
              >
                #{trait}
              </span>
            ))}
          </div>
        </motion.div>

        {matchResults.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1.3}
            className="mt-8"
          >
            <h3 className="mb-3 text-sm font-bold text-gray-700">💞 잘 맞는 상</h3>
            <div className="grid grid-cols-3 gap-2">
              {matchResults.map((m) => (
                <Link
                  key={m.id}
                  href={`/result/${test.slug}/${m.id}`}
                  className="flex flex-col items-center rounded-2xl bg-white/80 p-3 ring-1 ring-pink-100 backdrop-blur transition hover:-translate-y-0.5"
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="mt-1 text-xs font-medium text-gray-700">
                    {m.title}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {avoidResults.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1.4}
            className="mt-6"
          >
            <h3 className="mb-3 text-sm font-bold text-gray-700">⚠️ 주의할 상</h3>
            <div className="flex gap-2">
              {avoidResults.map((m) => (
                <Link
                  key={m.id}
                  href={`/result/${test.slug}/${m.id}`}
                  className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 ring-1 ring-orange-100 backdrop-blur transition hover:-translate-y-0.5"
                >
                  <span className="text-xl">{m.emoji}</span>
                  <span className="text-xs font-medium text-gray-700">
                    {m.title}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.5}
          className="mt-8"
        >
          <AdSlot slot="result-bottom" />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.6}
          className="mt-6 space-y-3"
        >
          <ShareButton url={shareUrl} title={shareTitle} text={shareText} />
          <Link
            href={`/tests/${test.slug}`}
            className="block rounded-full border-2 border-gray-200 bg-white py-4 text-center font-medium text-gray-700 transition hover:border-gray-300 active:scale-95"
          >
            🔄 다시 해보기
          </Link>
        </motion.div>

        {otherTests.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1.8}
            className="mt-12"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-800">
                🎮 이 테스트도 해볼래?
              </h3>
              <Link
                href="/"
                className="text-xs text-gray-400 transition hover:text-gray-600"
              >
                전체보기 →
              </Link>
            </div>
            <div className="space-y-3">
              {otherTests.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tests/${t.slug}`}
                  className="block rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-pink-100 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{t.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {t.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t.description}
                      </div>
                    </div>
                    <span className="text-gray-300">›</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
