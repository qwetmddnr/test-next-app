import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { generateGroupId } from "@/lib/group/id";
import { hashGroupPassword } from "@/lib/group/password";
import { isGroupEligibleTestSlug } from "@/lib/group/types";
import { getTest } from "@/lib/test/loader";

export const runtime = "nodejs";

interface RequestBody {
  name?: string;
  password?: string;
  test_type?: string;
  nickname?: string;
  result_id?: string;
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const password = body.password ?? "";
  const testType = body.test_type ?? "";
  const nickname = (body.nickname ?? "").trim();
  const resultId = (body.result_id ?? "").trim();

  if (!name || name.length > 30) {
    return NextResponse.json(
      { error: "모임 이름을 1~30자로 입력해 주세요" },
      { status: 400 }
    );
  }
  if (password.length < 4 || password.length > 30) {
    return NextResponse.json(
      { error: "비밀번호는 4~30자로 입력해 주세요" },
      { status: 400 }
    );
  }
  if (!isGroupEligibleTestSlug(testType)) {
    return NextResponse.json(
      { error: "지원하지 않는 테스트입니다" },
      { status: 400 }
    );
  }
  if (!nickname || nickname.length > 20) {
    return NextResponse.json(
      { error: "닉네임을 1~20자로 입력해 주세요" },
      { status: 400 }
    );
  }

  const test = getTest(testType);
  if (!test) {
    return NextResponse.json(
      { error: "테스트를 찾을 수 없어요" },
      { status: 400 }
    );
  }
  if (!test.results.some((r) => r.id === resultId)) {
    return NextResponse.json(
      { error: "결과를 찾을 수 없어요" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // PK 충돌 시 한 번 retry (실제론 30^8 ≈ 6.5e11 공간이라 거의 발생 X).
  let groupId = generateGroupId();
  let groupInsert = await supabase.from("groups").insert({
    id: groupId,
    name,
    test_type: testType,
    password_hash: hashGroupPassword(password, groupId),
  });
  if (groupInsert.error?.code === "23505") {
    groupId = generateGroupId();
    groupInsert = await supabase.from("groups").insert({
      id: groupId,
      name,
      test_type: testType,
      password_hash: hashGroupPassword(password, groupId),
    });
  }
  if (groupInsert.error) {
    return NextResponse.json(
      { error: groupInsert.error.message },
      { status: 500 }
    );
  }

  const memberInsert = await supabase.from("group_members").insert({
    group_id: groupId,
    nickname,
    result_id: resultId,
  });
  if (memberInsert.error) {
    // 멤버 insert 실패 시 group orphan을 막기 위해 group 삭제.
    await supabase.from("groups").delete().eq("id", groupId);
    return NextResponse.json(
      { error: memberInsert.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    id: groupId,
    name,
    test_type: testType,
  });
}
