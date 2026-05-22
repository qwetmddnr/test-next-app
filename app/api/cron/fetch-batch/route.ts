import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { collectBatchResults, retrieveBatch } from "@/lib/ai/batch";
import { DAILY_TESTS, makeCacheKey } from "@/lib/ai/insight";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type BatchJob = {
  id: string;
  target_date: string;
  batch_id: string;
  status: string;
  request_count: number;
  created_at: string;
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
  const stillPending: { batch_id: string; status: string }[] = [];
  for (const job of jobs) {
    const batch = await retrieveBatch(job.batch_id);
    if (batch.processing_status === "ended") {
      endedJobs.push(job);
    } else {
      stillPending.push({
        batch_id: job.batch_id,
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

  // 옛 daily 캐시를 한 번만 비움 (같은 test_type의 어제·그저께 row 누적 방지)
  const dailySlugs = [...DAILY_TESTS];
  const { error: cleanupErr } = await supabase
    .from("ai_cache")
    .delete()
    .in("test_type", dailySlugs);
  if (cleanupErr) {
    console.log("[fetch-batch] cleanup error:", cleanupErr.message);
  }

  // 모든 ended batches 결과 수집 + insert
  const summaries: {
    batch_id: string;
    target_date: string;
    inserted: number;
    failed: number;
  }[] = [];

  for (const job of endedJobs) {
    const results = await collectBatchResults(job.batch_id);
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

    await supabase
      .from("batch_jobs")
      .update({
        status: "completed",
        fetched_at: new Date().toISOString(),
        inserted_count: inserted,
      })
      .eq("id", job.id);

    summaries.push({
      batch_id: job.batch_id,
      target_date: job.target_date,
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
