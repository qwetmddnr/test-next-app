import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getResult } from "@/lib/test/loader";
import type { TestDefinition, TestResult } from "@/lib/types/test";

export interface PopularResultEntry {
  test: TestDefinition;
  result: TestResult;
  viewCount: number;
}

export async function getPopularResults(
  limit: number = 5
): Promise<PopularResultEntry[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  try {
    const supabase = createSupabaseClient(url, key);
    const { data, error } = await supabase
      .from("result_stats")
      .select("test_type, result_id, view_count")
      .order("view_count", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    const entries: PopularResultEntry[] = [];
    for (const row of data) {
      const found = getResult(
        row.test_type as string,
        row.result_id as string
      );
      if (!found) continue;
      entries.push({
        test: found.test,
        result: found.result,
        viewCount: Number(row.view_count) || 0,
      });
    }
    return entries;
  } catch {
    return [];
  }
}
