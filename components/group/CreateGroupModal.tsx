"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  testSlug: string;
  resultId: string;
  resultTitle: string;
}

export function CreateGroupModal({
  open,
  onClose,
  testSlug,
  resultId,
  resultTitle,
}: CreateGroupModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const valid =
    name.trim().length > 0 &&
    password.length >= 4 &&
    nickname.trim().length > 0;

  async function handleSubmit() {
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/group/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          password,
          test_type: testSlug,
          nickname: nickname.trim(),
          result_id: resultId,
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "모임 생성에 실패했어요");
      }
      const { id } = (await res.json()) as { id: string };
      sessionStorage.setItem(`group_pw_${id}`, password);
      sessionStorage.setItem(`group_my_nickname_${id}`, nickname.trim());
      router.push(`/g/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류");
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            key="sh"
            role="dialog"
            aria-modal="true"
            aria-label="모임 만들기"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-3xl bg-white px-5 pb-7 pt-4 shadow-2xl"
          >
            <div className="mb-3 flex justify-center">
              <div className="h-1.5 w-12 rounded-full bg-gray-200" />
            </div>
            <h3 className="mb-1 text-center text-base font-bold text-gray-800">
              모임 만들기
            </h3>
            <p className="mb-4 text-center text-xs text-gray-500">
              내 결과(<span className="font-medium text-gray-700">{resultTitle}</span>)를
              첫 멤버로 등록해요
            </p>

            <div className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 30))}
                placeholder="모임 이름 (예: 우리 동아리)"
                className="w-full rounded-2xl border-2 border-pink-100 bg-white px-4 py-2 text-base focus:border-pink-400 focus:outline-none"
                autoFocus
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value.slice(0, 30))}
                placeholder="비밀번호 (4~30자)"
                className="w-full rounded-2xl border-2 border-pink-100 bg-white px-4 py-2 text-base focus:border-pink-400 focus:outline-none"
              />
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value.slice(0, 20))}
                placeholder="내 닉네임"
                className="w-full rounded-2xl border-2 border-pink-100 bg-white px-4 py-2 text-base focus:border-pink-400 focus:outline-none"
              />
            </div>

            {error && (
              <p className="mt-3 rounded-2xl bg-red-50 px-4 py-2 text-xs text-red-600">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!valid || submitting}
              className="mt-4 w-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 py-3 font-bold text-white shadow-lg shadow-pink-200/60 transition disabled:opacity-40 disabled:shadow-none"
            >
              {submitting ? "만드는 중…" : "모임 만들고 공유하기"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full rounded-full border border-gray-200 bg-white py-2 text-sm text-gray-600"
            >
              취소
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
