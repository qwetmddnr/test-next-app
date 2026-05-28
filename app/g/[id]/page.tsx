"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { TestDefinition } from "@/lib/types/test";
import { getTest } from "@/lib/test/loader";
import { allPairs } from "@/lib/group/match";
import { setPendingGroup } from "@/lib/group/pending";
import type { GroupMemberRecord } from "@/lib/group/types";
import { ShareButton } from "@/components/result/ShareButton";

interface GroupData {
  group: { id: string; name: string; test_type: string; created_at: string };
  members: GroupMemberRecord[];
}

type Phase = "loading" | "password" | "ready";

export default function GroupPage() {
  const params = useParams<{ id: string }>();
  const groupId = params.id;

  const [phase, setPhase] = useState<Phase>("loading");
  const [data, setData] = useState<GroupData | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  async function loadGroup(pw: string) {
    setError(null);
    try {
      const res = await fetch(`/api/group/${groupId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "모임을 불러올 수 없어요");
      }
      const d = (await res.json()) as GroupData;
      sessionStorage.setItem(`group_pw_${groupId}`, pw);
      setPassword(pw);
      setData(d);
      setPhase("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류");
      setPhase("password");
    }
  }

  useEffect(() => {
    if (!groupId) return;
    let cancelled = false;
    const stored = sessionStorage.getItem(`group_pw_${groupId}`);
    if (!stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("password");
      return;
    }
    void (async () => {
      if (cancelled) return;
      await loadGroup(stored);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  async function handleJoin(nickname: string, resultId: string) {
    setError(null);
    setJoining(true);
    try {
      const res = await fetch(`/api/group/${groupId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, nickname, result_id: resultId }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "참여에 실패했어요");
      }
      sessionStorage.setItem(`group_my_nickname_${groupId}`, nickname);
      await loadGroup(password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류");
    } finally {
      setJoining(false);
    }
  }

  if (phase === "loading") {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-sm text-gray-400">불러오는 중…</p>
      </main>
    );
  }

  if (phase === "password" || !data) {
    return <PasswordPromptView onSubmit={loadGroup} error={error} />;
  }

  return (
    <GroupReadyView
      data={data}
      onJoin={handleJoin}
      joining={joining}
      error={error}
    />
  );
}

function PasswordPromptView({
  onSubmit,
  error,
}: {
  onSubmit: (pw: string) => void;
  error: string | null;
}) {
  const [pw, setPw] = useState("");

  return (
    <main className="flex-1 px-5 pb-12 pt-10">
      <div className="mx-auto max-w-md">
        <header className="mb-8 text-center">
          <div className="mb-3 text-5xl">🔒</div>
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              비밀번호를 입력해 주세요
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            모임을 만든 사람이 알려준 비밀번호예요
          </p>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pw.length >= 4) onSubmit(pw);
          }}
          className="space-y-3"
        >
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value.slice(0, 30))}
            placeholder="비밀번호"
            className="w-full rounded-2xl border-2 border-pink-100 bg-white/70 px-4 py-3 text-base focus:border-pink-400 focus:outline-none"
            autoFocus
          />
          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={pw.length < 4}
            className="w-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 py-4 font-bold text-white shadow-lg shadow-pink-200/60 transition disabled:opacity-40 disabled:shadow-none"
          >
            입장하기
          </button>
        </form>
      </div>
    </main>
  );
}

function GroupReadyView({
  data,
  onJoin,
  joining,
  error,
}: {
  data: GroupData;
  onJoin: (nickname: string, resultId: string) => Promise<void>;
  joining: boolean;
  error: string | null;
}) {
  const test = getTest(data.group.test_type);
  const myNickname =
    typeof window !== "undefined"
      ? sessionStorage.getItem(`group_my_nickname_${data.group.id}`)
      : null;
  const alreadyJoined =
    !!myNickname && data.members.some((m) => m.nickname === myNickname);

  const pairs = useMemo(
    () => (test ? allPairs(test, data.members) : []),
    [test, data.members]
  );

  if (!test) {
    return (
      <main className="flex-1 px-5 py-10 text-center">
        <p>테스트를 찾을 수 없어요</p>
      </main>
    );
  }

  const shareUrl = `/g/${data.group.id}`;
  const shareTitle = `${data.group.name} — 모임 궁합`;
  const shareText = `${data.group.name} 모임에 들어와서 같이 궁합 봐요!`;

  return (
    <main className="flex-1 px-5 pb-12 pt-8">
      <div className="mx-auto max-w-md">
        <header className="mb-6 text-center">
          <div className="mb-3 text-5xl">{test.emoji}</div>
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              {data.group.name}
            </span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {test.title} · 멤버 {data.members.length}명
          </p>
        </header>

        <section className="mb-8">
          <h2 className="mb-3 text-sm font-bold text-gray-700">멤버</h2>
          <div className="grid grid-cols-2 gap-2">
            {data.members.map((m) => {
              const r = test.results.find((x) => x.id === m.result_id);
              const isMe = m.nickname === myNickname;
              return (
                <div
                  key={m.id}
                  className={`flex items-center gap-2 rounded-2xl p-3 ring-1 ${
                    isMe
                      ? "bg-gradient-to-br from-pink-50 to-violet-50 ring-pink-300"
                      : "bg-white/80 ring-pink-100"
                  }`}
                >
                  <span className="text-2xl">{r?.emoji ?? "❓"}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-gray-900">
                      {m.nickname}
                      {isMe && " (나)"}
                    </div>
                    <div className="truncate text-xs text-gray-500">
                      {r?.title ?? m.result_id}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {pairs.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-bold text-gray-700">궁합</h2>
            <div className="space-y-2">
              {pairs.map((p, i) => {
                const color =
                  p.score === "match"
                    ? "bg-green-50 ring-green-200 text-green-700"
                    : p.score === "avoid"
                      ? "bg-rose-50 ring-rose-200 text-rose-700"
                      : "bg-gray-50 ring-gray-200 text-gray-600";
                const label =
                  p.score === "match"
                    ? p.mutual
                      ? "🟢 아주 잘 맞음"
                      : "🟢 잘 맞음"
                    : p.score === "avoid"
                      ? p.mutual
                        ? "🔴 서로 안 맞음"
                        : "🔴 조심"
                      : "⚪ 보통";
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded-2xl p-3 text-sm ring-1 ${color}`}
                  >
                    <span className="font-medium">
                      {p.a.nickname} ↔ {p.b.nickname}
                    </span>
                    <span className="font-bold">{label}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {!alreadyJoined && (
          <JoinFormSection
            test={test}
            groupId={data.group.id}
            groupName={data.group.name}
            onSubmit={onJoin}
            joining={joining}
            error={error}
          />
        )}

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-bold text-gray-700">모임 공유</h2>
          <ShareButton url={shareUrl} title={shareTitle} text={shareText} />
          <p className="mt-2 text-xs text-gray-400">
            URL과 비밀번호를 함께 알려줘야 친구가 들어올 수 있어요
          </p>
        </section>
      </div>
    </main>
  );
}

function JoinFormSection({
  test,
  groupId,
  groupName,
  onSubmit,
  joining,
  error,
}: {
  test: TestDefinition;
  groupId: string;
  groupName: string;
  onSubmit: (nickname: string, resultId: string) => Promise<void>;
  joining: boolean;
  error: string | null;
}) {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);

  const trimmed = nickname.trim();
  const valid = trimmed.length > 0 && selectedResultId !== null;
  const nicknameReady = trimmed.length > 0;

  function handleGoToTest() {
    if (!nicknameReady) return;
    setPendingGroup({
      group_id: groupId,
      group_name: groupName,
      test_type: test.slug,
      nickname: trimmed,
    });
    router.push(test.entryPath ?? `/tests/${test.slug}`);
  }

  return (
    <section className="mb-8 rounded-3xl bg-white/80 p-5 ring-1 ring-pink-100">
      <h2 className="mb-3 text-sm font-bold text-gray-700">나도 참여하기</h2>

      <label className="mb-4 block">
        <span className="text-xs text-gray-500">닉네임</span>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value.slice(0, 20))}
          placeholder="예: 민지"
          className="mt-1 w-full rounded-2xl border-2 border-pink-100 bg-white px-4 py-2 text-base focus:border-pink-400 focus:outline-none"
        />
      </label>

      <div className="mb-4">
        <p className="mb-2 text-xs text-gray-500">나의 결과 선택</p>
        <div className="grid grid-cols-3 gap-2">
          {test.results.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedResultId(r.id)}
              className={`flex flex-col items-center rounded-2xl p-2 text-center ring-1 transition ${
                selectedResultId === r.id
                  ? "bg-gradient-to-br from-pink-100 to-violet-100 ring-pink-400"
                  : "bg-white/70 ring-pink-100 hover:ring-pink-200"
              }`}
            >
              <span className="text-2xl">{r.emoji}</span>
              <span className="mt-1 line-clamp-1 text-xs font-medium text-gray-700">
                {r.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mb-3 rounded-2xl bg-red-50 px-4 py-2 text-xs text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => {
          if (valid && selectedResultId) onSubmit(trimmed, selectedResultId);
        }}
        disabled={!valid || joining}
        className="w-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 py-3 font-bold text-white disabled:opacity-40"
      >
        {joining ? "참여 중…" : "참여하기"}
      </button>

      <div className="mt-5 border-t border-gray-100 pt-4">
        <p className="mb-2 text-center text-xs text-gray-500">
          내 결과를 모르겠다면 ↓
        </p>
        <button
          type="button"
          onClick={handleGoToTest}
          disabled={!nicknameReady}
          className="w-full rounded-full border-2 border-pink-200 bg-white py-2.5 text-sm font-medium text-pink-700 transition disabled:opacity-40 hover:border-pink-300 active:scale-95"
        >
          🧪 테스트 진행하고 자동 참여
        </button>
        <p className="mt-2 text-center text-xs text-gray-400">
          닉네임 입력 후 — 테스트 끝나면 결과 페이지에서 자동 합류
        </p>
      </div>
    </section>
  );
}
