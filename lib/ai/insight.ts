import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { TestDefinition, TestResult } from "@/lib/types/test";

const TEST_PROMPTS: Record<string, (result: TestResult) => string> = {
  mbti: (r) => `당신은 한국어 운세/심리 콘텐츠 작가입니다. 아래 MBTI 유형을 가진 사람을 위한 "오늘의 인사이트"를 작성하세요.

유형: ${r.id} (${r.title})
한 줄 요약: ${r.shortDesc}
주요 특성: ${r.traits.join(", ")}

요구사항:
- 친근한 반말체와 존댓말 사이의 부드러운 톤 (~요체)
- 3개 짧은 단락, 각 2~3문장
- 첫 단락: 이 유형의 강점을 오늘 어떻게 활용할지
- 둘째 단락: 이 유형이 빠지기 쉬운 함정 한 가지 + 가벼운 조언
- 셋째 단락: 오늘 한 가지 실천 팁 (구체적이고 부담 없는 것)
- "${r.id}", "MBTI", 영어 알파벳 코드를 본문에 또 쓰지 말 것
- 전체 300자 내외, 이모지 1~2개만 자연스럽게`,
};

interface GenerateInsightInput {
  test: TestDefinition;
  result: TestResult;
}

function makeCacheKey(testSlug: string, resultId: string): string {
  return crypto
    .createHash("sha256")
    .update(`insight:${testSlug}:${resultId}`)
    .digest("hex");
}

export async function getAIInsight({
  test,
  result,
}: GenerateInsightInput): Promise<string | null> {
  const promptFn = TEST_PROMPTS[test.slug];
  if (!promptFn) return null;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!apiKey) return null;

  const inputHash = makeCacheKey(test.slug, result.id);
  const supabase =
    supabaseUrl && supabaseAnonKey
      ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
      : null;

  if (supabase) {
    const { data } = await supabase
      .from("ai_cache")
      .select("output")
      .eq("input_hash", inputHash)
      .maybeSingle();
    if (data?.output) return data.output as string;
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      messages: [{ role: "user", content: promptFn(result) }],
    });

    const output = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n")
      .trim();

    if (!output) return null;

    if (supabase) {
      await supabase.from("ai_cache").insert({
        input_hash: inputHash,
        test_type: test.slug,
        output,
      });
    }

    return output;
  } catch (err) {
    console.error("[AI insight] generation failed:", err);
    return null;
  }
}
