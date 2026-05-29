"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type Calendar = "solar" | "lunar";

interface HourOption {
  value: number | "unknown";
  label: string;
  range: string;
}

const HOUR_OPTIONS: HourOption[] = [
  { value: "unknown", label: "시 모름", range: "" },
  { value: 0, label: "자시 (子)", range: "23:00 ~ 01:00" },
  { value: 2, label: "축시 (丑)", range: "01:00 ~ 03:00" },
  { value: 4, label: "인시 (寅)", range: "03:00 ~ 05:00" },
  { value: 6, label: "묘시 (卯)", range: "05:00 ~ 07:00" },
  { value: 8, label: "진시 (辰)", range: "07:00 ~ 09:00" },
  { value: 10, label: "사시 (巳)", range: "09:00 ~ 11:00" },
  { value: 12, label: "오시 (午)", range: "11:00 ~ 13:00" },
  { value: 14, label: "미시 (未)", range: "13:00 ~ 15:00" },
  { value: 16, label: "신시 (申)", range: "15:00 ~ 17:00" },
  { value: 18, label: "유시 (酉)", range: "17:00 ~ 19:00" },
  { value: 20, label: "술시 (戌)", range: "19:00 ~ 21:00" },
  { value: 22, label: "해시 (亥)", range: "21:00 ~ 23:00" },
];

export function SajuForm() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [calendar, setCalendar] = useState<Calendar>("solar");
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [hour, setHour] = useState<number | "unknown">("unknown");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const thisYear = useMemo(() => new Date().getFullYear(), []);

  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);
  // valid 체크와 서버 전송용 이름은 완성된 한글 음절만 (IME 중간 자모 제외)
  const syllableName = name.trim().replace(/[^가-힣]/g, "");
  const valid =
    syllableName.length > 0 && syllableName.length <= 30 &&
    Number.isFinite(y) && y >= 1920 && y <= thisYear &&
    Number.isFinite(m) && m >= 1 && m <= 12 &&
    Number.isFinite(d) && d >= 1 && d <= 31;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(20);
    }

    try {
      const res = await fetch("/api/saju/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: syllableName,
          year: y,
          month: m,
          day: d,
          hour: hour === "unknown" ? null : hour,
          calendar,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "사주 분석에 실패했어요");
      }
      const { token } = (await res.json()) as { token: string };
      router.replace(`/saju/result/${token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "다시 시도해 주세요");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-pink-100 backdrop-blur">
        {/* 이름 */}
        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            이름 <span className="text-pink-500">*</span>
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) =>
              // 입력 중: IME 자모(ㄱ-ㅎ, ㅏ-ㅣ)도 통과시켜야 한글 조합이 깨지지 않음.
              // 영어/숫자/특수문자만 즉시 제거.
              setName(
                e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ]/g, "").slice(0, 30)
              )
            }
            onBlur={(e) =>
              // 포커스 아웃: 미완성 자모만 남아있으면 제거하고 완성 음절만 유지
              setName(
                e.currentTarget.value.replace(/[^가-힣]/g, "").slice(0, 30)
              )
            }
            placeholder="예: 민지 (한글만)"
            autoComplete="off"
            inputMode="text"
            className="mt-3 w-full border-b-2 border-pink-200 bg-transparent py-1 text-2xl font-bold tracking-wide text-gray-900 focus:border-pink-500 focus:outline-none"
            autoFocus
          />
        </label>

        {/* 양/음력 토글 */}
        <div className="mt-6 flex rounded-full bg-pink-50 p-1">
          {(["solar", "lunar"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCalendar(c)}
              className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
                calendar === c
                  ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow"
                  : "text-gray-500"
              }`}
            >
              {c === "solar" ? "양력" : "음력"}
            </button>
          ))}
        </div>

        {/* 생년월일 */}
        <label className="mt-5 block">
          <span className="text-sm font-medium text-gray-700">
            생년월일 <span className="text-pink-500">*</span>
          </span>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <NumberInput
              value={year}
              onChange={setYear}
              placeholder="1995"
              maxLength={4}
              suffix="년"
            />
            <NumberInput
              value={month}
              onChange={setMonth}
              placeholder="11"
              maxLength={2}
              suffix="월"
            />
            <NumberInput
              value={day}
              onChange={setDay}
              placeholder="18"
              maxLength={2}
              suffix="일"
            />
          </div>
        </label>

        {/* 출생 시간 */}
        <label className="mt-6 block">
          <span className="text-sm font-medium text-gray-700">출생 시간</span>
          <select
            value={hour}
            onChange={(e) =>
              setHour(
                e.target.value === "unknown"
                  ? "unknown"
                  : (parseInt(e.target.value, 10) as number)
              )
            }
            className="mt-3 w-full rounded-2xl border-2 border-pink-100 bg-white/70 px-4 py-3 text-base font-medium text-gray-800 focus:border-pink-400 focus:outline-none"
          >
            {HOUR_OPTIONS.map((opt) => (
              <option key={String(opt.value)} value={opt.value}>
                {opt.label}
                {opt.range ? ` · ${opt.range}` : ""}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-gray-400">
            정확한 시간을 모르면 &quot;시 모름&quot;을 선택하세요.
          </p>
        </label>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </p>
      )}

      <motion.button
        type="submit"
        disabled={!valid || submitting}
        whileTap={valid ? { scale: 0.95 } : undefined}
        animate={
          valid && !submitting
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(255, 107, 157, 0.45)",
                  "0 0 0 12px rgba(255, 107, 157, 0)",
                ],
              }
            : {}
        }
        transition={{
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeOut" },
        }}
        className="mt-6 w-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 py-4 font-bold text-white shadow-lg shadow-pink-200/60 transition disabled:opacity-40 disabled:shadow-none"
      >
        {submitting ? "사주 분석 중..." : "✨ 내 사주 보기"}
      </motion.button>
    </form>
  );
}

function NumberInput({
  value,
  onChange,
  placeholder,
  maxLength,
  suffix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  maxLength: number;
  suffix: string;
}) {
  return (
    <div className="flex items-baseline gap-1 border-b-2 border-pink-200 focus-within:border-pink-500">
      <input
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(e) =>
          onChange(e.target.value.replace(/[^0-9]/g, "").slice(0, maxLength))
        }
        placeholder={placeholder}
        className="w-full bg-transparent text-2xl font-bold tracking-wider text-gray-900 focus:outline-none"
      />
      <span className="text-sm text-gray-400">{suffix}</span>
    </div>
  );
}
