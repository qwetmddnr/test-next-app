import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { TestDefinition, TestResult } from "@/lib/types/test";

const COMMON_RULES = `
공통 규칙:
- 친근한 ~요체 (반말과 존댓말 사이의 부드러운 톤)
- 3개 짧은 단락, 각 2~3문장
- 280~320자 내외, 이모지 1~2개만 자연스럽게
- 마크다운 금지: 헤더(#, ##, ###), 굵은글(**), 목록(-, *), 코드(\`) 모두 사용 금지. 평문만.
- 제목/헤더 줄 없이 바로 본문부터 시작
- 영어 단어 최소화, 한국어 위주`;

const TEST_PROMPTS: Record<string, (result: TestResult) => string> = {
  mbti: (r) => `당신은 한국어 운세/심리 콘텐츠 작가입니다. 아래 MBTI 유형을 가진 사람을 위한 "오늘의 인사이트"를 작성하세요.

유형: ${r.id} (${r.title})
한 줄 요약: ${r.shortDesc}
주요 특성: ${r.traits.join(", ")}

내용 구성:
- 첫 단락: 이 유형의 강점을 오늘 어떻게 활용할지
- 둘째 단락: 이 유형이 빠지기 쉬운 함정 한 가지 + 가벼운 조언
- 셋째 단락: 오늘 한 가지 실천 팁 (구체적이고 부담 없는 것)
- "${r.id}", "MBTI", 영어 알파벳 코드를 본문에 또 쓰지 말 것
${COMMON_RULES}`,

  "animal-face": (r) => `당신은 한국어 재미 콘텐츠 작가입니다. 아래 동물상 결과를 가진 사람에게 "오늘의 매력 포인트"를 작성하세요.

유형: ${r.emoji} ${r.title}
한 줄 요약: ${r.shortDesc}
주요 특성: ${r.traits.join(", ")}

내용 구성:
- 첫 단락: 이 동물상의 외모·분위기 매력이 오늘 가장 돋보이는 순간/장면
- 둘째 단락: 이 동물상이 자주 듣는 오해 한 가지 + 살짝 풀어가는 팁
- 셋째 단락: 오늘 한 가지 실천 팁 (표정·말투·옷차림 중 하나, 구체적이고 부담 없는 것)
- "${r.title}", "동물상", "${r.emoji}" 자체를 본문에 또 쓰지 말 것
${COMMON_RULES}`,

  "past-life-job": (r) => `당신은 한국어 운세 콘텐츠 작가입니다. 아래 전생 직업 결과를 가진 사람에게 "전생의 기억이 오늘의 나에게 주는 메시지"를 작성하세요.

유형: ${r.emoji} ${r.title}
한 줄 요약: ${r.shortDesc}
주요 특성: ${r.traits.join(", ")}

내용 구성:
- 첫 단락: 전생의 그 기질이 지금 나에게 어떤 모습으로 남아 있는지 (구체적 행동 예시)
- 둘째 단락: 그 기질이 만들어내는 약점 한 가지 + 가벼운 조언
- 셋째 단락: 오늘 한 가지 실천 팁 (전생 컨셉과 자연스럽게 연결된 구체적 행동)
- 톤은 살짝 신비롭지만 너무 거창하지 않게
- "${r.title}", "전생" 단어를 본문에 또 쓰지 말 것
${COMMON_RULES}`,

  "love-style": (r) => `당신은 한국어 연애 콘텐츠 작가입니다. 아래 연애 유형을 가진 사람에게 "오늘의 연애 가이드"를 작성하세요.

유형: ${r.emoji} ${r.title}
한 줄 요약: ${r.shortDesc}
주요 특성: ${r.traits.join(", ")}

내용 구성:
- 첫 단락: 이 연애 스타일의 강점이 오늘 가장 빛날 만한 상황
- 둘째 단락: 이 스타일이 자주 빠지는 함정 한 가지 + 따뜻한 조언
- 셋째 단락: 오늘 한 가지 실천 팁 (연인이 있든 없든 부담 없이 할 수 있는 작은 행동)
- 톤은 공감 위주, 잔소리처럼 들리지 않게
- "${r.title}", "연애 유형" 단어를 본문에 또 쓰지 말 것
${COMMON_RULES}`,

  tarot: (r) => `당신은 한국어 타로 리더입니다. 아래 카드가 오늘 뽑힌 사람에게 "지금 이 순간을 위한 메시지"를 작성하세요.

카드: ${r.emoji} ${r.title}
한 줄 요약: ${r.shortDesc}
키워드: ${r.traits.join(", ")}

내용 구성:
- 첫 단락: 이 카드가 오늘 당신에게 보내는 핵심 메시지
- 둘째 단락: 이 카드를 잘 받아들이려면 무엇을 조심하거나 놓아주어야 하는지
- 셋째 단락: 오늘 한 가지 작은 실천 (이 카드의 에너지를 일상에 녹이는 구체적인 행동)
- 톤은 부드럽고 따뜻하게, 점쟁이 같은 무거운 톤은 피하기
- 카드 이름이나 "타로", "카드"라는 단어를 본문에 또 반복하지 말 것
${COMMON_RULES}`,
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
  const tag = `[AI insight ${test.slug}/${result.id}]`;
  const promptFn = TEST_PROMPTS[test.slug];
  if (!promptFn) {
    console.log(`${tag} skip: no prompt registered for slug`);
    return null;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log(
    `${tag} env: hasApiKey=${!!apiKey} hasSupabase=${!!supabaseUrl && !!supabaseAnonKey}`
  );

  if (!apiKey) {
    console.log(`${tag} skip: ANTHROPIC_API_KEY missing`);
    return null;
  }

  const inputHash = makeCacheKey(test.slug, result.id);
  const supabase =
    supabaseUrl && supabaseAnonKey
      ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
      : null;

  if (supabase) {
    const { data, error } = await supabase
      .from("ai_cache")
      .select("output")
      .eq("input_hash", inputHash)
      .maybeSingle();
    if (error) {
      console.log(`${tag} cache read error:`, error.message);
    }
    if (data?.output) {
      console.log(`${tag} cache HIT (${(data.output as string).length} chars)`);
      return data.output as string;
    }
  }

  console.log(`${tag} cache miss → calling Claude API`);
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

    console.log(`${tag} Claude returned ${output.length} chars`);

    if (!output) return null;

    if (supabase) {
      const { error: insertError } = await supabase
        .from("ai_cache")
        .insert({
          input_hash: inputHash,
          test_type: test.slug,
          output,
        });
      if (insertError) {
        console.log(`${tag} cache write error:`, insertError.message);
      } else {
        console.log(`${tag} cache stored`);
      }
    }

    return output;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`${tag} Claude call failed:`, msg);
    return null;
  }
}
