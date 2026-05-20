import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getTest } from "@/lib/test/loader";
import type { TestDefinition } from "@/lib/types/test";

export interface PopularTestEntry {
  test: TestDefinition;
  totalViews: number;
}

export async function getPopularTests(
  limit: number = 10
): Promise<PopularTestEntry[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  try {
    const supabase = createSupabaseClient(url, key);
    const { data, error } = await supabase
      .from("result_stats")
      .select("test_type, view_count");

    if (error || !data) return [];

    // Group by test_type, sum view_count
    const totals: Record<string, number> = {};
    for (const row of data) {
      const slug = row.test_type as string;
      const count = Number(row.view_count) || 0;
      totals[slug] = (totals[slug] ?? 0) + count;
    }

    const entries: PopularTestEntry[] = [];
    for (const [slug, total] of Object.entries(totals)) {
      const test = getTest(slug);
      if (!test) continue;
      entries.push({ test, totalViews: total });
    }

    entries.sort((a, b) => b.totalViews - a.totalViews);
    return entries.slice(0, limit);
  } catch {
    return [];
  }
}
