"use client";

import { motion } from "framer-motion";
import {
  type Element,
  type Pillar,
  type SajuResult,
  elementKorean,
} from "@/lib/saju/calculate";

interface SajuPillarBlockProps {
  saju: SajuResult;
  showInputMeta?: boolean;
}

export function SajuPillarBlock({ saju, showInputMeta = true }: SajuPillarBlockProps) {
  const { pillars, elements, input, dayMasterElement } = saju;
  const calendarLabel = input.calendar === "solar" ? "양력" : "음력";
  const birthLabel = `${input.year}년 ${input.month}월 ${input.day}일`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-6 rounded-2xl bg-white/80 p-5 ring-1 ring-violet-100 backdrop-blur"
    >
      <header className="mb-3 flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-gray-800">☯️ 나의 사주팔자</h3>
        {showInputMeta && (
          <span className="text-xs text-gray-400">
            {calendarLabel} · {birthLabel}
          </span>
        )}
      </header>

      <PillarTable pillars={pillars} dayMasterElement={dayMasterElement} />

      <div className="mt-5">
        <h4 className="mb-2 text-xs font-bold text-gray-600">오행 분포</h4>
        <ElementBars elements={elements} />
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-gray-400">
        ※ 일간(日干)은 본인의 핵심 성격을 결정하는 기둥이에요. 4기둥의 오행 균형으로 전반적인 기운의 흐름을 짐작할 수 있어요.
      </p>
    </motion.section>
  );
}

const ELEMENT_COLOR: Record<Element, { bg: string; text: string; bar: string }> = {
  wood: { bg: "bg-emerald-100", text: "text-emerald-700", bar: "bg-emerald-400" },
  fire: { bg: "bg-rose-100", text: "text-rose-700", bar: "bg-rose-400" },
  earth: { bg: "bg-amber-100", text: "text-amber-700", bar: "bg-amber-400" },
  metal: { bg: "bg-slate-100", text: "text-slate-700", bar: "bg-slate-400" },
  water: { bg: "bg-sky-100", text: "text-sky-700", bar: "bg-sky-400" },
};

function PillarTable({
  pillars,
  dayMasterElement,
}: {
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
  };
  dayMasterElement: Element;
}) {
  const cols: { label: string; key: "year" | "month" | "day" | "hour"; pillar: Pillar | null; isDay: boolean }[] = [
    { label: "년주", key: "year", pillar: pillars.year, isDay: false },
    { label: "월주", key: "month", pillar: pillars.month, isDay: false },
    { label: "일주", key: "day", pillar: pillars.day, isDay: true },
    { label: "시주", key: "hour", pillar: pillars.hour, isDay: false },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {cols.map(({ label, key, pillar, isDay }) => (
        <div key={key} className="flex flex-col items-center">
          <div className={`mb-1.5 text-[10px] font-medium ${isDay ? "text-violet-600" : "text-gray-400"}`}>
            {label}{isDay ? " ★" : ""}
          </div>
          {pillar ? (
            <div
              className={`flex w-full flex-col items-center overflow-hidden rounded-xl ring-1 ${
                isDay ? "ring-violet-300" : "ring-gray-200"
              }`}
            >
              <GanZhiCell hanja={pillar.ganHanja} korean={pillar.ganKorean} element={pillar.ganElement} highlight={isDay && pillar.ganElement === dayMasterElement} />
              <GanZhiCell hanja={pillar.zhiHanja} korean={pillar.zhiKorean} element={pillar.zhiElement} highlight={false} />
            </div>
          ) : (
            <div className="flex h-[88px] w-full items-center justify-center rounded-xl bg-gray-50 text-[10px] text-gray-400 ring-1 ring-gray-200">
              시 모름
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function GanZhiCell({
  hanja,
  korean,
  element,
  highlight,
}: {
  hanja: string;
  korean: string;
  element: Element;
  highlight: boolean;
}) {
  const color = ELEMENT_COLOR[element];
  return (
    <div className={`flex w-full flex-col items-center py-2 ${color.bg} ${highlight ? "ring-2 ring-violet-400 ring-inset" : ""}`}>
      <div className={`text-xl font-bold ${color.text}`}>{hanja}</div>
      <div className={`text-[10px] ${color.text}`}>{korean}{elementKorean(element)}</div>
    </div>
  );
}

function ElementBars({ elements }: { elements: Record<Element, number> }) {
  const order: Element[] = ["wood", "fire", "earth", "metal", "water"];
  const max = Math.max(...Object.values(elements), 1);
  return (
    <div className="space-y-1.5">
      {order.map((el) => {
        const count = elements[el];
        const color = ELEMENT_COLOR[el];
        const widthPct = (count / max) * 100;
        return (
          <div key={el} className="flex items-center gap-2">
            <div className={`flex h-5 w-5 items-center justify-center rounded-full ${color.bg} text-[10px] font-bold ${color.text}`}>
              {elementKorean(el)}
            </div>
            <div className="relative flex-1 overflow-hidden rounded-full bg-gray-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`h-2 rounded-full ${color.bar}`}
              />
            </div>
            <div className="w-6 text-right text-xs text-gray-500">{count}</div>
          </div>
        );
      })}
    </div>
  );
}
