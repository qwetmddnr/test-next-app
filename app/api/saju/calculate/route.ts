import { NextRequest, NextResponse } from "next/server";
import { generateSajuResult, type SajuFormInput } from "@/lib/ai/saju";

// lunar-javascript + Anthropic SDK 사용 (서버 전용)
export const runtime = "nodejs";
// Claude 호출이 ~5s 정도 걸릴 수 있어 cron이 아닌 일반 라우트도 maxDuration 상향
export const maxDuration = 30;

interface RequestBody {
  name?: string;
  year?: number;
  month?: number;
  day?: number;
  hour?: number | null;
  calendar?: "solar" | "lunar";
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const year = Number(body.year);
  const month = Number(body.month);
  const day = Number(body.day);
  const calendar = body.calendar === "lunar" ? "lunar" : "solar";
  const hour =
    body.hour === null || body.hour === undefined ? null : Number(body.hour);

  if (!name || name.length > 30 || !/^[가-힣]+$/.test(name)) {
    return NextResponse.json(
      { error: "이름은 한글로 입력해 주세요" },
      { status: 400 }
    );
  }
  if (
    !Number.isInteger(year) || year < 1900 || year > 2100 ||
    !Number.isInteger(month) || month < 1 || month > 12 ||
    !Number.isInteger(day) || day < 1 || day > 31
  ) {
    return NextResponse.json({ error: "생년월일을 확인해 주세요" }, { status: 400 });
  }
  if (hour !== null && (!Number.isInteger(hour) || hour < 0 || hour > 23)) {
    return NextResponse.json({ error: "시간이 잘못되었어요" }, { status: 400 });
  }

  const input: SajuFormInput = { name, year, month, day, hour, calendar };

  try {
    const result = await generateSajuResult(input);
    return NextResponse.json({ token: result.token, cached: result.cached });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[api/saju/calculate]", msg);
    return NextResponse.json({ error: "사주 분석에 실패했어요" }, { status: 500 });
  }
}
