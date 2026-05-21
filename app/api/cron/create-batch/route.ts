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

// 다음 날 KST 날짜 (cron이 KST 22:00 = UTC 13:00에 실행되므로 +1일)
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

  // Pre-validate against Anthropic's pattern so we can pinpoint bad IDs
  const CUSTOM_ID_RE = /^[a-zA-Z0-9_-]{1,64}$/;
  const invalid = items
    .map((i) => i.customId)
    .filter((id) => !CUSTOM_ID_RE.test(id));
  console.log(
    "[create-batch] items=", items.length,
    "first3=", items.slice(0, 3).map((i) => i.customId),
    "invalid=", invalid.slice(0, 5)
  );
  if (invalid.length > 0) {
    return NextResponse.json(
      {
        error: "Invalid custom_ids",
        invalid_sample: invalid.slice(0, 5),
        total_invalid: invalid.length,
        first_three: items.slice(0, 3).map((i) => i.customId),
      },
      { status: 400 }
    );
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
