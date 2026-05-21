"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { AdSlot } from "@/components/ads/AdSlot";
import { AIInsightSection } from "@/components/result/AIInsightSection";
import { ShareButton } from "@/components/result/ShareButton";
import { fadeUp, resultEmoji } from "@/lib/motion/variants";
import {
  elementKorean,
  type Element,
  type SajuResult,
} from "@/lib/saju/calculate";
import type { TestDefinition } from "@/lib/types/test";
import { SajuPillarBlock } from "./SajuPillarBlock";

interface SajuResultViewProps {
  token: string;
  saju: SajuResult;
  name: string;
  aiText: string | null;
  otherTests: TestDefinition[];
}

const ELEMENT_GRADIENT: Record<Element, string> = {
  wood: "from-emerald-500 to-emerald-700",
  fire: "from-rose-500 to-rose-700",
  earth: "from-amber-500 to-amber-700",
  metal: "from-slate-500 to-slate-700",
  water: "from-sky-500 to-sky-700",
};

export function SajuResultView({
  token,
  saju,
  name,
  aiText,
  otherTests,
}: SajuResultViewProps) {
  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.4 },
      colors: ["#FF6B9D", "#A78BFA", "#FBBF24", "#FFB3CD"],
    });
  }, []);

  const dayMaster = saju.pillars.day;
  const dayMasterTitle = `${dayMaster.ganHanja} ${saju.dayMasterKorean}${elementKorean(saju.dayMasterElement)}`;
  const gradient = ELEMENT_GRADIENT[saju.dayMasterElement];

  const shareUrl = `/saju/result/${token}`;
  const shareTitle = `${name}님의 사주 — 일간 ${dayMasterTitle}`;
  const shareText = `${name}님의 사주는 ${dayMasterTitle} 일간이에요. 나의 사주도 보러 가기 →`;

  return (
    <main className="flex-1 px-5 pb-12 pt-8">
      <div className="mx-auto max-w-md">
        <motion.div
          variants={resultEmoji}
          initial="hidden"
          animate="show"
          className="mb-2 text-center text-7xl"
        >
          ☯️
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.4}
          className="text-center text-3xl font-bold tracking-tight"
        >
          <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {name}님의 사주
          </span>
        </motion.h1>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.5}
          className="mt-3 flex justify-center"
        >
          <span className={`rounded-full bg-gradient-to-r ${gradient} px-4 py-1 text-sm font-bold tracking-wide text-white shadow-md`}>
            일간 {dayMasterTitle}
          </span>
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.6}
          className="mt-3 text-center text-sm text-gray-500"
        >
          {saju.input.calendar === "solar" ? "양력" : "음력"} {saju.input.year}년 {saju.input.month}월 {saju.input.day}일
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.7}
          className="mt-8"
        >
          <AdSlot slot="result-top" />
        </motion.div>

        <SajuPillarBlock saju={saju} showInputMeta={false} />

        {aiText ? (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.9}
          >
            <AIInsightSection
              insight={aiText}
              testSlug="saju"
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
              AI 분석을 준비 중이에요. 잠시 후 다시 새로고침 해주세요.
            </p>
          </motion.div>
        )}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.0}
          className="mt-8"
        >
          <AdSlot slot="result-bottom" />
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
            href="/saju"
            replace
            className="block rounded-full border-2 border-gray-200 bg-white py-4 text-center font-medium text-gray-700 transition hover:border-gray-300 active:scale-95"
          >
            🔄 다른 사주 보기
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
                      <div className="font-semibold text-gray-900">{t.title}</div>
                      <div className="text-sm text-gray-500">{t.description}</div>
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

