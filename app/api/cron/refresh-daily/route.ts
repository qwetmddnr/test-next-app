import { NextRequest, NextResponse } from "next/server";
import { getAIInsight } from "@/lib/ai/insight";
import { getTest } from "@/lib/test/loader";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Hobby 플랜 한도

const DAILY_TEST_SLUGS = ["tarot", "new-year"];

interface CallResult {
  slug: string;
  id: string;
  ok: boolean;
  chars?: number;
  error?: string;
}

export async function GET(req: NextRequest) {
  // 인증: Vercel Cron이 자동 첨부하는 Authorization 헤더 검증
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${expected}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const startedAt = new Date().toISOString();
  const promises: Promise<CallResult>[] = [];

  for (const slug of DAILY_TEST_SLUGS) {
    const test = getTest(slug);
    if (!test) continue;

    for (const result of test.results) {
      promises.push(
        getAIInsight({ test, result })
          .then((insight) => ({
            slug,
            id: result.id,
            ok: Boolean(insight),
            chars: insight?.length,
          }))
          .catch((err) => ({
            slug,
            id: result.id,
            ok: false,
            error: err instanceof Error ? err.message : String(err),
          }))
      );
    }
  }

  const results = await Promise.all(promises);
  const okCount = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);

  return NextResponse.json({
    startedAt,
    finishedAt: new Date().toISOString(),
    total: results.length,
    ok: okCount,
    failed: failed.length,
    failures: failed.slice(0, 10),
  });
}
