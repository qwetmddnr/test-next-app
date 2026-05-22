// One-shot admin endpoint to populate ai_cache for a given test slug TODAY (KST).
// Used when a new DAILY test slug is added mid-day and the next create-batch
// hasn't run yet (e.g. zodiac added 2026-05-22 but next batch cron is at KST 18:00).
//
// Auth: Authorization: Bearer <CRON_SECRET>
// GET /api/admin/insight-fill?test=<slug>
//   -> iterates test.results, calls getAIInsight for each (which handles cache
//      lookup + sync Claude call + insert), returns per-result summary.
//
// Safe to re-run: getAIInsight short-circuits on cache hit, so already-filled
// rows aren't re-charged to the API.

import { NextRequest, NextResponse } from "next/server";
import { getAIInsight } from "@/lib/ai/insight";
import { getTest } from "@/lib/test/loader";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (process.env.CRON_SECRET) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const testSlug = req.nextUrl.searchParams.get("test");
  if (!testSlug) {
    return NextResponse.json(
      { error: "Missing ?test=<slug>" },
      { status: 400 }
    );
  }

  const test = getTest(testSlug);
  if (!test) {
    return NextResponse.json({ error: "Unknown test slug" }, { status: 404 });
  }
  if (test.results.length === 0) {
    return NextResponse.json(
      {
        error:
          "Test has no fixed results (personalized tests like saju/dream are not supported here)",
      },
      { status: 400 }
    );
  }

  const summaries: { id: string; ok: boolean }[] = [];
  for (const result of test.results) {
    try {
      const insight = await getAIInsight({ test, result });
      summaries.push({ id: result.id, ok: Boolean(insight) });
    } catch (err) {
      console.error(
        `[insight-fill] ${testSlug}/${result.id} failed:`,
        err instanceof Error ? err.message : err
      );
      summaries.push({ id: result.id, ok: false });
    }
  }

  return NextResponse.json({
    test: testSlug,
    total: test.results.length,
    ok: summaries.filter((s) => s.ok).length,
    summaries,
  });
}
