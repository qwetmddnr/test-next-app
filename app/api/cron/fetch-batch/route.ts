import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { collectBatchResults, retrieveBatch } from "@/lib/ai/batch";
import { makeCacheKey } from "@/lib/ai/insight";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

  // 가장 최근 pending batch_job 가져옴
  const { data: jobs, error: queryErr } = await supabase
    .from("batch_jobs")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1);

  if (queryErr) {
    return NextResponse.json({ error: queryErr.message }, { status: 500 });
  }
  if (!jobs || jobs.length === 0) {
    return NextResponse.json({ message: "No pending batch" });
  }

  const job = jobs[0];

  // batch 상태 확인
  const batch = await retrieveBatch(job.batch_id);
  if (batch.processing_status !== "ended") {
    return NextResponse.json({
      batch_id: job.batch_id,
      status: batch.processing_status,
      message: "Batch not finished yet — will retry later",
    });
  }

  // 결과 수집
  const results = await collectBatchResults(job.batch_id);

  // ai_cache INSERT
  let inserted = 0;
  let failed = 0;
  for (const item of results) {
    if (!item.ok || !item.output) {
      failed++;
      continue;
    }
    const [testSlug, resultId] = item.customId.split(":");
    const cacheKey = makeCacheKey(testSlug, resultId, job.target_date);
    const { error } = await supabase.from("ai_cache").insert({
      input_hash: cacheKey,
      test_type: testSlug,
      output: item.output,
    });
    if (!error) inserted++;
    else failed++;
  }

  // batch_job 상태 업데이트
  await supabase
    .from("batch_jobs")
    .update({
      status: "completed",
      fetched_at: new Date().toISOString(),
      inserted_count: inserted,
    })
    .eq("id", job.id);

  return NextResponse.json({
    batch_id: job.batch_id,
    target_date: job.target_date,
    total: results.length,
    inserted,
    failed,
  });
}
