"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import type { TestDefinition, TestResult } from "@/lib/types/test";
import { fadeUp, resultEmoji } from "@/lib/motion/variants";
import { AdSlot } from "@/components/ads/AdSlot";
import { createClient } from "@/lib/supabase/client";
import { CreateGroupModal } from "@/components/group/CreateGroupModal";
import {
  clearPendingGroup,
  getPendingGroup,
  type PendingGroup,
} from "@/lib/group/pending";
import { isGroupEligibleTestSlug } from "@/lib/group/types";
import { AIInsightSection } from "./AIInsightSection";
import { ShareButton } from "./ShareButton";

interface ResultViewProps {
  test: TestDefinition;
  result: TestResult;
  otherTests?: TestDefinition[];
  aiInsight?: string | null;
  dailyLabel?: string | null;
  triggerConfetti?: boolean;
}

export function ResultView({
  test,
  result,
  otherTests = [],
  aiInsight,
  dailyLabel,
  triggerConfetti = true,
}: ResultViewProps) {
  const router = useRouter();
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [pendingGroup, setPendingGroupState] = useState<PendingGroup | null>(
    null
  );
  const [pendingJoining, setPendingJoining] = useState(false);
  const [pendingError, setPendingError] = useState<string | null>(null);

  const groupEligible =
    isGroupEligibleTestSlug(test.slug) &&
    (result.matches.length > 0 || result.avoid.length > 0);

  useEffect(() => {
    const p = getPendingGroup();
    if (p && p.test_type === test.slug) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPendingGroupState(p);
    }
  }, [test.slug]);

  async function handlePendingJoin() {
    if (!pendingGroup || pendingJoining) return;
    setPendingJoining(true);
    setPendingError(null);
    try {
      const password = sessionStorage.getItem(
        `group_pw_${pendingGroup.group_id}`
      );
      if (!password) {
        throw new Error(
          "모임 비밀번호 정보가 만료됐어요. 모임 페이지에서 다시 시도해 주세요"
        );
      }
      const res = await fetch(`/api/group/${pendingGroup.group_id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          nickname: pendingGroup.nickname,
          result_id: result.id,
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "참여에 실패했어요");
      }
      sessionStorage.setItem(
        `group_my_nickname_${pendingGroup.group_id}`,
        pendingGroup.nickname
      );
      clearPendingGroup();
      router.push(`/g/${pendingGroup.group_id}`);
    } catch (e) {
      setPendingError(e instanceof Error ? e.message : "오류");
      setPendingJoining(false);
    }
  }

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
  const shareTitle = `${result.title} | 오나 OHNA`;
  const shareText = `나는 ${result.emoji} ${result.title}! ${result.shortDesc}`;

  const entryPath = (t: TestDefinition) =>
    t.entryPath ?? `/tests/${t.slug}`;

  const titleMatch = result.title.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  const koreanTitle = titleMatch ? titleMatch[1].trim() : result.title;
  const englishTitle = titleMatch ? titleMatch[2].trim() : null;

  const isTarot = test.slug === "tarot";

  return (
    <main className="relative flex-1 px-5 pb-12 pt-8">
      {isTarot && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-gradient-to-b from-violet-300 via-violet-200/50 to-transparent"
        />
      )}
      <div className="mx-auto max-w-md">
        {result.image ? (
          <motion.div
            variants={resultEmoji}
            initial="hidden"
            animate="show"
            className="mx-auto mb-2 flex justify-center"
          >
            <div className="relative w-48 overflow-hidden rounded-2xl shadow-2xl shadow-violet-300/40 ring-1 ring-violet-200">
              <Image
                src={result.image}
                alt={result.title}
                width={400}
                height={690}
                priority
                sizes="(max-width: 480px) 50vw, 192px"
                className="h-auto w-full"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={resultEmoji}
            initial="hidden"
            animate="show"
            className="mb-2 text-center text-8xl"
          >
            {result.emoji}
          </motion.div>
        )}

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.4}
          className="text-center text-3xl font-bold tracking-tight"
        >
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            당신은 {koreanTitle}!
          </span>
        </motion.h1>

        {englishTitle && (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.5}
            className="mt-1 text-center text-xs font-medium tracking-[0.2em] text-gray-400"
          >
            {englishTitle}
          </motion.p>
        )}

        {result.displayCode && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.5}
            className="mt-3 flex justify-center"
          >
            <span className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-4 py-1 text-sm font-bold tracking-[0.25em] text-white shadow-md shadow-violet-200/60">
              {result.displayCode}
            </span>
          </motion.div>
        )}

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.6}
          className="mt-3 text-center text-gray-600"
        >
          {result.shortDesc}
        </motion.p>

        {dailyLabel && (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.7}
            className="mt-3 text-center text-xs font-medium text-violet-500"
          >
            📅 {dailyLabel} 오늘의 운세
          </motion.p>
        )}

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

        {pendingGroup && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.75}
            className="mt-5 rounded-2xl bg-gradient-to-br from-pink-100 via-fuchsia-100 to-violet-100 p-4 ring-2 ring-pink-300"
          >
            <p className="mb-1 text-xs font-medium text-gray-600">
              📥 모임 참여 진행 중
            </p>
            <p className="mb-3 truncate text-base font-bold text-gray-900">
              {pendingGroup.group_name}
            </p>
            <button
              type="button"
              onClick={handlePendingJoin}
              disabled={pendingJoining}
              className="w-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 py-3 font-bold text-white shadow-md shadow-pink-200/60 transition disabled:opacity-40 disabled:shadow-none"
            >
              {pendingJoining
                ? "참여 중…"
                : `✨ 이 결과로 ${pendingGroup.group_name}에 참여`}
            </button>
            {pendingError && (
              <p className="mt-2 text-xs text-red-600">{pendingError}</p>
            )}
          </motion.div>
        )}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.8}
          className="ad-wrap mt-4"
        >
          <AdSlot slot="result-top" compact />
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

        {aiInsight && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1.0}
          >
            <AIInsightSection
              insight={aiInsight}
              testSlug={test.slug}
              resultId={result.id}
            />
          </motion.div>
        )}

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
          className="ad-wrap mt-4"
        >
          <AdSlot slot="result-bottom" compact />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.6}
          className="mt-6 space-y-3"
        >
          <ShareButton url={shareUrl} title={shareTitle} text={shareText} />
          {groupEligible && (
            <button
              type="button"
              onClick={() => setGroupModalOpen(true)}
              className="block w-full rounded-full border-2 border-pink-200 bg-gradient-to-r from-pink-50 to-violet-50 py-4 text-center font-medium text-pink-700 transition hover:border-pink-300 active:scale-95"
            >
              👥 이 결과로 모임 만들기
            </button>
          )}
          <Link
            href={entryPath(test)}
            replace
            className="block rounded-full border-2 border-gray-200 bg-white py-4 text-center font-medium text-gray-700 transition hover:border-gray-300 active:scale-95"
          >
            🔄 다시 해보기
          </Link>
        </motion.div>

        {groupEligible && (
          <CreateGroupModal
            open={groupModalOpen}
            onClose={() => setGroupModalOpen(false)}
            testSlug={test.slug}
            resultId={result.id}
            resultTitle={koreanTitle}
          />
        )}

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
                  href={entryPath(t)}
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
