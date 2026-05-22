"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { AdSlot } from "@/components/ads/AdSlot";
import { AIInsightSection } from "@/components/result/AIInsightSection";
import { ShareButton } from "@/components/result/ShareButton";
import { fadeUp, resultEmoji } from "@/lib/motion/variants";
import type { TestDefinition } from "@/lib/types/test";

interface DreamResultViewProps {
  token: string;
  text: string;
  aiText: string | null;
  otherTests: TestDefinition[];
}

export function DreamResultView({
  token,
  text,
  aiText,
  otherTests,
}: DreamResultViewProps) {
  useEffect(() => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.4 },
      colors: ["#A78BFA", "#818CF8", "#C4B5FD", "#FBBF24"],
    });
  }, []);

  const shareUrl = `/dream/result/${token}`;
  const shareTitle = "내가 꾼 꿈의 의미 — OHNA";
  const shareText = "AI가 풀어준 내 꿈의 메시지를 봐보세요";

  return (
    <main className="flex-1 px-5 pb-12 pt-8">
      <div className="mx-auto max-w-md">
        <motion.div
          variants={resultEmoji}
          initial="hidden"
          animate="show"
          className="mb-2 text-center text-7xl"
        >
          🌙
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.4}
          className="text-center text-3xl font-bold tracking-tight"
        >
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            꿈 해몽
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.5}
          className="mt-2 text-center text-sm text-gray-500"
        >
          오늘 꾼 꿈, 이런 의미일 수 있어요
        </motion.p>

        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.6}
          className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 via-violet-50 to-white p-5 ring-1 ring-indigo-100"
        >
          <h2 className="mb-2 text-xs font-semibold tracking-wide text-indigo-500">
            ✨ 꾼 꿈
          </h2>
          <p className="text-sm leading-relaxed text-gray-800">{text}</p>
        </motion.section>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.7}
          className="mt-4"
        >
          <AdSlot slot="result-top" compact />
        </motion.div>

        {aiText ? (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.9}
          >
            <AIInsightSection
              insight={aiText}
              testSlug="dream"
              resultId={token}
            />
          </motion.div>
        ) : (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.9}
            className="mt-6 rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-100"
          >
            <p className="text-sm text-amber-800">
              AI 해몽을 준비 중이에요. 잠시 후 다시 새로고침 해주세요.
            </p>
          </motion.div>
        )}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.0}
          className="mt-4"
        >
          <AdSlot slot="result-bottom" compact />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.1}
          className="mt-6 space-y-3"
        >
          <ShareButton url={shareUrl} title={shareTitle} text={shareText} />
          <Link
            href="/dream"
            replace
            className="block rounded-full border-2 border-gray-200 bg-white py-4 text-center font-medium text-gray-700 transition hover:border-gray-300 active:scale-95"
          >
            🔄 다른 꿈 해몽
          </Link>
        </motion.div>

        {otherTests.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1.3}
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
                  href={t.entryPath ?? `/tests/${t.slug}`}
                  replace
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
