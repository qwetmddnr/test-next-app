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

  const items: BatchRequestItem[] = [];
  for (const slug of DAILY_TESTS) {
    const test = getTest(slug);
    if (!test) continue;
    for (const result of test.results) {
      const prompt = buildPrompt(test, result, todayLabelStr);
      if (!prompt) continue;
      // Anthropic Batch API: custom_id는 ^[a-zA-Z0-9_-]{1,64}$ 만 허용. 콜론 X.
      items.push({
        customId: `${slug}__${result.id}`,
        prompt,
      });
    }
  }

  if (items.length === 0) {
    return NextResponse.json({ error: "No items" }, { status: 400 });
  }

  const batch = await createInsightBatch(items);

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { error: insertErr } = await supabase.from("batch_jobs").insert({
    target_date: targetDate,
    batch_id: batch.id,
    status: "pending",
    request_count: items.length,
  });

  return NextResponse.json({
    batch_id: batch.id,
    target_date: targetDate,
    request_count: items.length,
    save_error: insertErr?.message ?? null,
  });
}
