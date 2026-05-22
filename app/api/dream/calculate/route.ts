import { NextRequest, NextResponse } from "next/server";
import { generateDreamResult } from "@/lib/ai/dream";
import {
  DREAM_TEXT_MAX,
  DREAM_TEXT_MIN,
  normalizeDreamText,
} from "@/lib/dream/normalize";

export const runtime = "nodejs";
// Claude 호출이 ~5s 정도 걸릴 수 있어 maxDuration 상향
export const maxDuration = 30;

interface RequestBody {
  text?: string;
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawText = typeof body.text === "string" ? body.text : "";
  const normalized = normalizeDreamText(rawText);

  if (normalized.length < DREAM_TEXT_MIN) {
    return NextResponse.json(
      { error: `꿈 내용을 ${DREAM_TEXT_MIN}자 이상 적어주세요` },
      { status: 400 }
    );
  }
  if (normalized.length > DREAM_TEXT_MAX) {
    return NextResponse.json(
      { error: `꿈 내용은 ${DREAM_TEXT_MAX}자 이내로 적어주세요` },
      { status: 400 }
    );
  }

  try {
    const result = await generateDreamResult({ text: rawText });
    return NextResponse.json({ token: result.token, cached: result.cached });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[api/dream/calculate]", msg);
    if (msg === "AI_OVERLOADED") {
      return NextResponse.json(
        {
          error:
            "AI 서버가 잠시 붐비고 있어요. 잠깐 후 다시 시도해 주세요 🙏",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "꿈 해몽에 실패했어요. 잠시 후 다시 시도해 주세요" },
      { status: 500 }
    );
  }
}
