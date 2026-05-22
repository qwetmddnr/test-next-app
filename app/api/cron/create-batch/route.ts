import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createInsightBatch, type BatchRequestItem } from "@/lib/ai/batch";
import {
  buildPrompt,
  DAILY_TESTS,
  labelFromDateKey,
} from "@/lib/ai/insight";
import { getTest } from "@/lib/test/loader";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// 다음 날 KST 날짜 (cron이 KST 18:00 = UTC 09:00에 실행되므로 +1일).
// fetch-batch는 KST 00:01에 돌면서 ~6h 사이에 Anthropic batch가 ended 되길 기다림.
// 미완료 시 다음 cron에서 재시도 (fetch-batch가 모든 pending을 loop 처리).
function nextDayKSTKey(): string {
  const now = new Date();
  const tomorrowKst = new Date(
    now.getTime() + 9 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000
  );
  return tomorrowKst.toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  if (process.env.CRON_SECRET) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const targetDate = nextDayKSTKey();
  const todayLabelStr = labelFromDateKey(targetDate);

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 각 DAILY_TESTS 슬러그를 별도 Anthropic batch로 생성하고 batch_jobs에 row 별도 insert.
  // 한 테스트의 batch가 늦거나 실패해도 다른 테스트에 영향이 없도록 격리.
  const summaries: {
    test: string;
    batch_id?: string;
    request_count: number;
    error?: string;
  }[] = [];

  for (const slug of DAILY_TESTS) {
    const test = getTest(slug);
    if (!test) {
      summaries.push({ test: slug, request_count: 0, error: "test not found" });
      continue;
    }

    const items: BatchRequestItem[] = [];
    for (const result of test.results) {
      const prompt = buildPrompt(test, result, todayLabelStr);
      if (!prompt) continue;
      // Anthropic Batch API: custom_id는 ^[a-zA-Z0-9_-]{1,64}$ 만 허용.
      items.push({
        customId: `${slug}__${result.id}`,
        prompt,
      });
    }

    if (items.length === 0) {
      summaries.push({ test: slug, request_count: 0, error: "no prompts" });
      continue;
    }

    try {
      const batch = await createInsightBatch(items);
      const { error: insertErr } = await supabase.from("batch_jobs").insert({
        target_date: targetDate,
        batch_id: batch.id,
        status: "pending",
        request_count: items.length,
        test_type: slug,
      });
      summaries.push({
        test: slug,
        batch_id: batch.id,
        request_count: items.length,
        error: insertErr?.message,
      });
    } catch (err) {
      summaries.push({
        test: slug,
        request_count: items.length,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return NextResponse.json({
    target_date: targetDate,
    batches: summaries,
  });
}
