// 꿈 해몽 personalized AI 인사이트 파이프라인.
// 꿈 내용 텍스트 → 정규화 → sha256 token → ai_cache (test_type=dream) → Claude 호출.

import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { normalizeDreamText } from "@/lib/dream/normalize";
import { COMMON_RULES, INSIGHT_MODEL } from "./insight";

export interface DreamInput {
  text: string; // 원본 (UI에 보여줄 용도)
}

interface DreamCacheEntry {
  v: 1;
  aiText: string;
  text: string; // 정규화된 텍스트 (재현용)
}

export interface DreamFullResult {
  token: string;
  text: string; // 정규화된 텍스트
  aiText: string | null;
  cached: boolean;
}

function makeDreamCacheKey(normalizedText: string): string {
  return crypto
    .createHash("sha256")
    .update(`dream:${normalizedText}`)
    .digest("hex");
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? createSupabaseClient(url, key) : null;
}

function buildDreamPrompt(normalizedText: string): string {
  return `당신은 한국어 꿈해몽 콘텐츠 작가입니다. 한국 전통 해몽과 현대 심리학적 관점을 가볍게 섞어, 꿈을 꾼 사람에게 따뜻하게 풀어주세요.

꾼 꿈:
${normalizedText}

내용 구성 (3개 단락):
- 첫 단락: 꿈에 등장한 핵심 상징 1~2개를 짚고, 전통적으로 어떤 의미였는지 자연스럽게 설명
- 둘째 단락: 길흉의 방향과 현재 마음 상태에 비추어 어떤 메시지로 받아들이면 좋을지 (단정적 예언 X)
- 셋째 단락: 오늘 부담 없이 챙길 수 있는 한 가지 행동 또는 마음가짐

추가 규칙:
- "꿈에 따르면", "당신의 꿈은" 같은 직역체 회피, 자연스러운 한국어
- "흉몽", "불길한" 같은 무거운 단어는 가급적 피하고, 쓰더라도 부드럽게 풀어 말하기
- 꿈 내용 원문을 그대로 인용하지 말 것 (이미 결과 페이지에 따로 표시됨)
${COMMON_RULES}`;
}

export async function lookupDreamByToken(
  token: string
): Promise<DreamFullResult | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("ai_cache")
    .select("output")
    .eq("input_hash", token)
    .eq("test_type", "dream")
    .maybeSingle();

  if (error || !data?.output) return null;

  try {
    const parsed = JSON.parse(data.output) as DreamCacheEntry;
    if (parsed.v !== 1 || !parsed.aiText || !parsed.text) return null;
    return {
      token,
      text: parsed.text,
      aiText: parsed.aiText,
      cached: true,
    };
  } catch {
    return null;
  }
}

export async function generateDreamResult(
  input: DreamInput
): Promise<DreamFullResult> {
  const normalizedText = normalizeDreamText(input.text);
  const token = makeDreamCacheKey(normalizedText);
  const supabase = getSupabase();

  // 1) 캐시 확인
  if (supabase) {
    const { data } = await supabase
      .from("ai_cache")
      .select("output")
      .eq("input_hash", token)
      .eq("test_type", "dream")
      .maybeSingle();
    if (data?.output) {
      try {
        const parsed = JSON.parse(data.output) as DreamCacheEntry;
        if (parsed.v === 1 && parsed.aiText) {
          return {
            token,
            text: parsed.text ?? normalizedText,
            aiText: parsed.aiText,
            cached: true,
          };
        }
      } catch {
        // corrupted — regenerate
      }
    }
  }

  // 2) Claude 호출
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { token, text: normalizedText, aiText: null, cached: false };
  }

  let aiText: string | null = null;
  try {
    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: INSIGHT_MODEL,
      max_tokens: 700,
      messages: [{ role: "user", content: buildDreamPrompt(normalizedText) }],
    });
    aiText = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n")
      .trim();
  } catch (err) {
    console.error(
      "[dream] Claude call failed:",
      err instanceof Error ? err.message : err
    );
    return { token, text: normalizedText, aiText: null, cached: false };
  }

  if (!aiText) {
    return { token, text: normalizedText, aiText: null, cached: false };
  }

  // 3) 캐시 저장
  if (supabase) {
    const entry: DreamCacheEntry = { v: 1, aiText, text: normalizedText };
    const { error: insertError } = await supabase.from("ai_cache").insert({
      input_hash: token,
      test_type: "dream",
      output: JSON.stringify(entry),
    });
    if (insertError) {
      console.log("[dream] cache write error:", insertError.message);
    }
  }

  return { token, text: normalizedText, aiText, cached: false };
}
