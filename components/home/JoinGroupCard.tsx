"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// 모임 ID는 hex(예: a1b2c3...) — 영문/숫자만 허용 (서버는 정규화된 id로 lookup).
function sanitizeId(input: string): string {
  return input.trim().replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
}

export function JoinGroupCard() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [going, setGoing] = useState(false);

  const valid = code.length >= 4;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = sanitizeId(code);
    if (!id || going) return;
    setGoing(true);
    router.push(`/g/${id}`);
  }

  return (
    <section className="mb-8">
      <div className="rounded-2xl bg-white/80 p-5 ring-1 ring-violet-100 backdrop-blur">
        <h2 className="mb-1 flex items-center gap-1.5 text-sm font-bold text-gray-800">
          👥 모임 참여하기
        </h2>
        <p className="text-xs text-gray-500">
          친구가 만든 모임 코드를 받았다면 여기로 들어와요
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-3 flex items-center gap-2"
        >
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(sanitizeId(e.target.value).slice(0, 40))}
            placeholder="모임 코드 입력"
            inputMode="text"
            autoComplete="off"
            className="flex-1 rounded-full border border-violet-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!valid || going}
            className="rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-200/60 transition active:scale-95 disabled:opacity-40 disabled:shadow-none"
          >
            {going ? "이동 중..." : "참여"}
          </button>
        </form>
      </div>
    </section>
  );
}
