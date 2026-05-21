// 사주 전용 personalized AI 인사이트 파이프라인.
// 이름 + 생년월일 + 시간 + 양/음력 → 4기둥 + 일간 + 오행 + Claude 본문.
// 캐시 키 = sha256(normalized input). ai_cache 테이블 재사용 (output에 JSON 저장).

import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  calculateSaju,
  elementKorean,
  type Element,
  type SajuResult,
} from "@/lib/saju/calculate";
import { COMMON_RULES, INSIGHT_MODEL } from "./insight";

export interface SajuFormInput {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number | null;
  calendar: "solar" | "lunar";
}

interface SajuCacheEntry {
  v: 1;
  aiText: string;
  input: SajuFormInput;
}

export interface SajuFullResult {
  token: string;
  input: SajuFormInput;
  saju: SajuResult;
  aiText: string | null;
  cached: boolean;
}

function makeCacheKey(input: SajuFormInput): string {
  const normalizedName = input.name.trim().normalize("NFC").toLowerCase();
  const hourStr = input.hour === null ? "x" : String(input.hour);
  return crypto
    .createHash("sha256")
    .update(
      `saju:${normalizedName}:${input.year}-${input.month}-${input.day}:${hourStr}:${input.calendar}`
    )
    .digest("hex");
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? createSupabaseClient(url, key) : null;
}

function hourLabel(hour: number | null): string {
  if (hour === null) return "시 모름";
  const hourLabels: Record<number, string> = {
    0: "자시 (23:00~01:00)",
    2: "축시 (01:00~03:00)",
    4: "인시 (03:00~05:00)",
    6: "묘시 (05:00~07:00)",
    8: "진시 (07:00~09:00)",
    10: "사시 (09:00~11:00)",
    12: "오시 (11:00~13:00)",
    14: "미시 (13:00~15:00)",
    16: "신시 (15:00~17:00)",
    18: "유시 (17:00~19:00)",
    20: "술시 (19:00~21:00)",
    22: "해시 (21:00~23:00)",
  };
  return hourLabels[hour] ?? `${hour}시`;
}

function buildSajuPrompt(input: SajuFormInput, saju: SajuResult): string {
  const name = input.name.trim();
  const calLabel = input.calendar === "solar" ? "양력" : "음력";
  const elementOrder: Element[] = ["wood", "fire", "earth", "metal", "water"];
  const elementSummary = elementOrder
    .map((el) => `${elementKorean(el)} ${saju.elements[el]}`)
    .join(", ");
  const fmtPillar = (label: string, p: SajuResult["pillars"]["year"] | null) => {
    if (!p) return `${label}: 시 모름`;
    return `${label}: ${p.ganHanja}${p.zhiHanja} (${p.ganKorean}${elementKorean(p.ganElement)}·${p.zhiKorean}${elementKorean(p.zhiElement)})`;
  };

  return `당신은 한국어 명리(사주) 콘텐츠 작가입니다. 아래 사주를 가진 ${name}님의 본질을 따뜻하게 풀어주세요.

이름: ${name}
${calLabel} 생일: ${input.year}년 ${input.month}월 ${input.day}일
출생 시간: ${hourLabel(input.hour)}

사주팔자:
  ${fmtPillar("년주", saju.pillars.year)}
  ${fmtPillar("월주", saju.pillars.month)}
  ${fmtPillar("일주", saju.pillars.day)} ← 일간(본인)
  ${fmtPillar("시주", saju.pillars.hour)}

일간: ${saju.pillars.day.ganHanja} (${saju.dayMasterKorean}${elementKorean(saju.dayMasterElement)})
오행 분포: ${elementSummary}

내용 구성:
- 첫 단락: 일간이 보여주는 본질적인 성격, ${name}님이 일상에서 자연스럽게 드러내는 모습 (구체적 행동/태도)
- 둘째 단락: 4기둥의 흐름과 오행 분포에서 보이는 강점/약점, 균형을 잡으려면 챙기면 좋은 점
- 셋째 단락: ${name}님이 자기 본질을 살리기 위해 오늘부터 부담 없이 할 수 있는 한 가지 실천
- 호칭은 "${name}님" 자연스럽게 1~2회 사용 (남발 X)
- 톤은 따뜻하고 차분, 점쟁이 같은 무거운 톤이나 거창한 표현 피하기
- 한자 그대로의 명칭(예: 甲木, 癸水)을 본문에 반복하지 말 것
- "사주", "팔자", "운명" 같은 단어는 피하기
${COMMON_RULES}`;
}

export async function lookupSajuByToken(
  token: string
): Promise<SajuFullResult | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("ai_cache")
    .select("output")
    .eq("input_hash", token)
    .eq("test_type", "saju")
    .maybeSingle();

  if (error || !data?.output) return null;

  try {
    const parsed = JSON.parse(data.output) as SajuCacheEntry;
    if (parsed.v !== 1 || !parsed.input || !parsed.aiText) return null;
    const saju = calculateSaju({
      year: parsed.input.year,
      month: parsed.input.month,
      day: parsed.input.day,
      hour: parsed.input.hour,
      calendar: parsed.input.calendar,
    });
    return {
      token,
      input: parsed.input,
      saju,
      aiText: parsed.aiText,
      cached: true,
    };
  } catch {
    return null;
  }
}

export async function generateSajuResult(
  input: SajuFormInput
): Promise<SajuFullResult> {
  const saju = calculateSaju({
    year: input.year,
    month: input.month,
    day: input.day,
    hour: input.hour,
    calendar: input.calendar,
  });
  const token = makeCacheKey(input);
  const supabase = getSupabase();

  // 1) 캐시 확인
  if (supabase) {
    const { data } = await supabase
      .from("ai_cache")
      .select("output")
      .eq("input_hash", token)
      .eq("test_type", "saju")
      .maybeSingle();
    if (data?.output) {
      try {
        const parsed = JSON.parse(data.output) as SajuCacheEntry;
        if (parsed.v === 1 && parsed.aiText) {
          return { token, input, saju, aiText: parsed.aiText, cached: true };
        }
      } catch {
        // corrupted — regenerate
      }
    }
  }

  // 2) Claude 호출
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { token, input, saju, aiText: null, cached: false };
  }

  let aiText: string | null = null;
  try {
    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: INSIGHT_MODEL,
      max_tokens: 800,
      messages: [
        { role: "user", content: buildSajuPrompt(input, saju) },
      ],
    });
    aiText = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n")
      .trim();
  } catch (err) {
    console.error("[saju] Claude call failed:", err instanceof Error ? err.message : err);
    return { token, input, saju, aiText: null, cached: false };
  }

  if (!aiText) {
    return { token, input, saju, aiText: null, cached: false };
  }

  // 3) 캐시 저장
  if (supabase) {
    const entry: SajuCacheEntry = { v: 1, aiText, input };
    const { error: insertError } = await supabase.from("ai_cache").insert({
      input_hash: token,
      test_type: "saju",
      output: JSON.stringify(entry),
    });
    if (insertError) {
      console.log("[saju] cache write error:", insertError.message);
    }
  }

  return { token, input, saju, aiText, cached: false };
}
