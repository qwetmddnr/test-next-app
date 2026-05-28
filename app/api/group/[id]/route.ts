// 모임 정보 + 멤버 list 조회. 비밀번호 검증과 조회를 한 endpoint로 통합.
// POST로 password를 body에 받음 (GET 쿼리에 password 노출 회피).

import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { verifyGroupPassword } from "@/lib/group/password";

export const runtime = "nodejs";

interface RequestBody {
  password?: string;
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

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("id, name, test_type, password_hash, created_at")
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

  const { data: members } = await supabase
    .from("group_members")
    .select("id, group_id, nickname, result_id, joined_at")
    .eq("group_id", id)
    .order("joined_at", { ascending: true });

  return NextResponse.json({
    group: {
      id: group.id,
      name: group.name,
      test_type: group.test_type,
      created_at: group.created_at,
    },
    members: members ?? [],
  });
}
