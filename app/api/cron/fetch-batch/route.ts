import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { collectBatchResults, retrieveBatch } from "@/lib/ai/batch";
import { DAILY_TESTS, makeCacheKey } from "@/lib/ai/insight";
import { nowKstIso } from "@/lib/time";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type BatchJob = {
  id: string;
  target_date: string;
  batch_id: string;
  status: string;
  request_count: number;
  created_at: string;
  // 'tarot' | 'new-year' | 'zodiac' | 'mixed' (legacy: 한 batch에 모든 daily가 묶여있던 옛 row).
  test_type: string;
};

export async function GET(req: NextRequest) {
  if (process.env.CRON_SECRET) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 모든 pending batch_jobs를 가져옴 (오래된 것 우선 — 옛 batch가 ended된 채로 영구 skip되는 일 방지)
  const { data: jobs, error: queryErr } = await supabase
    .from("batch_jobs")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .returns<BatchJob[]>();

  if (queryErr) {
    return NextResponse.json({ error: queryErr.message }, { status: 500 });
  }
  if (!jobs || jobs.length === 0) {
    return NextResponse.json({ message: "No pending batches" });
  }

  // 각 batch 상태 확인, ended된 것만 처리. in_progress는 다음 cron에서 재시도하도록 그대로 둠.
  const endedJobs: BatchJob[] = [];
  const stillPending: { batch_id: string; test_type: string; status: string }[] = [];
  for (const job of jobs) {
    const batch = await retrieveBatch(job.batch_id);
    if (batch.processing_status === "ended") {
      endedJobs.push(job);
    } else {
      stillPending.push({
        batch_id: job.batch_id,
        test_type: job.test_type,
        status: batch.processing_status,
      });
    }
  }

  if (endedJobs.length === 0) {
    return NextResponse.json({
      message: "No ended batches yet — will retry next cron",
      pending: stillPending,
    });
  }

  // 각 ended job별로 처리 — cleanup도 그 batch의 test_type 단위.
  // 한 테스트의 인근 일자 cache가 누적되는 걸 막으면서, 다른 테스트의 cache는 보존됨.
  const summaries: {
    batch_id: string;
    target_date: string;
    test_type: string;
    inserted: number;
    failed: number;
  }[] = [];

  for (const job of endedJobs) {
    // 1) batch 결과 먼저 수집 (cleanup 계산에 results의 customId가 필요).
    const results = await collectBatchResults(job.batch_id);

    // 2) cleanup 대상 결정
    // - 표준 slug (test_type in DAILY_TESTS): 그 slug만 비움.
    // - 'mixed' (legacy: 옛 한 batch에 모든 daily 묶임): results 안에 실제 등장한 slug만 비움.
    //   → 새로 추가된 daily slug(예: zodiac)는 옛 mixed batch에 없으므로 cache가 보존됨.
    const slugsInResults = new Set<string>();
    for (const item of results) {
      const sep = item.customId.indexOf("__");
      if (sep > 0) slugsInResults.add(item.customId.slice(0, sep));
    }
    const slugsToCleanup: string[] =
      job.test_type === "mixed"
        ? [...slugsInResults].filter((s) => DAILY_TESTS.has(s))
        : DAILY_TESTS.has(job.test_type)
          ? [job.test_type]
          : [];

    if (slugsToCleanup.length > 0) {
      const { error: cleanupErr } = await supabase
        .from("ai_cache")
        .delete()
        .in("test_type", slugsToCleanup);
      if (cleanupErr) {
        console.log(
          `[fetch-batch] cleanup error for ${job.test_type}:`,
          cleanupErr.message
        );
      }
    }

    // 3) results insert
    let inserted = 0;
    let failed = 0;

    for (const item of results) {
      if (!item.ok || !item.output) {
        failed++;
        continue;
      }
      const sep = item.customId.indexOf("__");
      if (sep < 0) {
        failed++;
        continue;
      }
      const testSlug = item.customId.slice(0, sep);
      const resultId = item.customId.slice(sep + 2);
      const cacheKey = makeCacheKey(testSlug, resultId, job.target_date);
      const { error } = await supabase.from("ai_cache").insert({
        input_hash: cacheKey,
        test_type: testSlug,
        output: item.output,
      });
      if (!error) inserted++;
      else failed++;
    }

    // 3) batch_job 상태 갱신
    await supabase
      .from("batch_jobs")
      .update({
        status: "completed",
        fetched_at: nowKstIso(),
        inserted_count: inserted,
      })
      .eq("id", job.id);

    summaries.push({
      batch_id: job.batch_id,
      target_date: job.target_date,
      test_type: job.test_type,
      inserted,
      failed,
    });
  }

  return NextResponse.json({
    processed: summaries.length,
    summaries,
    still_pending: stillPending,
  });
}
