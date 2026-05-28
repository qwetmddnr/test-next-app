import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { verifyGroupPassword } from "@/lib/group/password";
import { getTest } from "@/lib/test/loader";

export const runtime = "nodejs";

interface RequestBody {
  password?: string;
  nickname?: string;
  result_id?: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const password = body.password ?? "";
  const nickname = (body.nickname ?? "").trim();
  const resultId = (body.result_id ?? "").trim();

  if (!nickname || nickname.length > 20) {
    return NextResponse.json(
      { error: "닉네임을 1~20자로 입력해 주세요" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("id, test_type, password_hash")
    .eq("id", id)
    .maybeSingle();

  if (groupError || !group) {
    return NextResponse.json(
      { error: "모임을 찾을 수 없어요" },
      { status: 404 }
    );
  }

  if (!verifyGroupPassword(password, id, group.password_hash)) {
    return NextResponse.json(
      { error: "비밀번호가 틀려요" },
      { status: 401 }
    );
  }

  const test = getTest(group.test_type);
  if (!test) {
    return NextResponse.json(
      { error: "테스트를 찾을 수 없어요" },
      { status: 500 }
    );
  }
  if (!test.results.some((r) => r.id === resultId)) {
    return NextResponse.json(
      { error: "결과를 찾을 수 없어요" },
      { status: 400 }
    );
  }

  const { error: insertError } = await supabase
    .from("group_members")
    .insert({ group_id: id, nickname, result_id: resultId });

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "이미 같은 닉네임의 멤버가 있어요" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
