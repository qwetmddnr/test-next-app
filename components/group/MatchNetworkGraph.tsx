"use client";

// 멤버 N명을 원 둘레에 균등 배치하고, 모든 쌍 사이를 선으로 연결한 관계망 그래프.
// 선의 색상은 매칭 점수(match/neutral/avoid), 굵기는 mutual(양방향) 여부에 따라.
// 노드 클릭 시 그 멤버와 연관된 엣지/노드만 강조, 나머지는 흐려짐 (다시 클릭 또는 빈 공간 탭으로 해제).

import { useState } from "react";
import type { TestDefinition } from "@/lib/types/test";
import type { GroupMemberRecord, MemberPair } from "@/lib/group/types";

interface MatchNetworkGraphProps {
  test: TestDefinition;
  members: GroupMemberRecord[];
  pairs: MemberPair[];
  myNickname: string | null;
}

const VIEW = 360;
const CENTER = VIEW / 2;
const NODE_RADIUS = 26;
const RING_RADIUS = VIEW / 2 - NODE_RADIUS - 40;

const DIM_OPACITY = 0.12;

type EdgeMode = "default" | "focused" | "dimmed";

// 엣지 시각 — focused 모드의 connected edge는 색과 굵기 모두 boost.
// 특히 neutral은 기본 색이 약하므로(#e5e7eb) focused 시 진한 회색으로 올림.
function edgeVisual(
  p: MemberPair,
  mode: EdgeMode
): { stroke: string; strokeWidth: number; opacity: number } {
  if (p.score === "match") {
    return {
      stroke: p.mutual ? "#10b981" : "#34d399",
      strokeWidth:
        mode === "focused" ? (p.mutual ? 4.5 : 3) : p.mutual ? 3 : 1.8,
      opacity: mode === "dimmed" ? DIM_OPACITY : mode === "focused" ? 1 : 0.85,
    };
  }
  if (p.score === "avoid") {
    return {
      stroke: p.mutual ? "#ef4444" : "#f87171",
      strokeWidth:
        mode === "focused" ? (p.mutual ? 4.5 : 3) : p.mutual ? 3 : 1.8,
      opacity: mode === "dimmed" ? DIM_OPACITY : mode === "focused" ? 1 : 0.85,
    };
  }
  // neutral — focused 시 회색을 한 단계 진하게(#9ca3af) + 두께 boost
  return {
    stroke: mode === "focused" ? "#9ca3af" : "#e5e7eb",
    strokeWidth: mode === "focused" ? 2.5 : 1,
    opacity: mode === "dimmed" ? DIM_OPACITY : mode === "focused" ? 1 : 0.6,
  };
}

// 표정 이모지 — 3단계: 🥰 잘맞음 / 😐 보통 / 😖 안맞음.
// mutual(양방향) 여부는 라인 두께 + ring 색 진하기로 별도 시각화.
function edgeLabel(p: MemberPair): {
  text: string;
  bg: string;
  ring: string;
} {
  if (p.score === "match") {
    return {
      text: "🥰",
      bg: "#d1fae5",
      ring: p.mutual ? "#10b981" : "#a7f3d0",
    };
  }
  if (p.score === "avoid") {
    return {
      text: "😖",
      bg: "#fee2e2",
      ring: p.mutual ? "#ef4444" : "#fca5a5",
    };
  }
  return { text: "😐", bg: "#f3f4f6", ring: "#d1d5db" };
}

export function MatchNetworkGraph({
  test,
  members,
  pairs,
  myNickname,
}: MatchNetworkGraphProps) {
  const [focusedId, setFocusedId] = useState<number | null>(null);

  const n = members.length;
  if (n === 0) return null;

  const positions = members.map((m, i) => {
    if (n === 1) {
      return { member: m, x: CENTER, y: CENTER, angle: -Math.PI / 2 };
    }
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return {
      member: m,
      x: CENTER + RING_RADIUS * Math.cos(angle),
      y: CENTER + RING_RADIUS * Math.sin(angle),
      angle,
    };
  });

  const positionById = new Map(positions.map((p) => [p.member.id, p]));

  const focusedMode = focusedId !== null;
  const isEdgeRelated = (p: MemberPair) =>
    focusedMode && (p.a.id === focusedId || p.b.id === focusedId);
  const isNodeRelated = (memberId: number) => {
    if (!focusedMode) return true;
    if (memberId === focusedId) return true;
    return pairs.some(
      (p) =>
        (p.a.id === focusedId && p.b.id === memberId) ||
        (p.b.id === focusedId && p.a.id === memberId)
    );
  };

  function toggleFocus(memberId: number) {
    setFocusedId((cur) => (cur === memberId ? null : memberId));
  }

  return (
    <div className="rounded-3xl bg-white/85 p-3 ring-1 ring-pink-100">
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        width="100%"
        height="auto"
        className="block select-none"
        role="img"
        aria-label="모임 멤버 관계망"
      >
        <defs>
          <radialGradient id="me-grad" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#FFE9F2" />
            <stop offset="100%" stopColor="#FFC4DA" />
          </radialGradient>
        </defs>

        {/* 빈 공간 탭으로 focus 해제 */}
        <rect
          x={0}
          y={0}
          width={VIEW}
          height={VIEW}
          fill="transparent"
          onClick={() => setFocusedId(null)}
          style={{ cursor: focusedMode ? "pointer" : "default" }}
        />

        {/* edges */}
        {pairs.map((p) => {
          const a = positionById.get(p.a.id);
          const b = positionById.get(p.b.id);
          if (!a || !b) return null;
          const mode: EdgeMode = !focusedMode
            ? "default"
            : isEdgeRelated(p)
              ? "focused"
              : "dimmed";
          const s = edgeVisual(p, mode);
          return (
            <line
              key={`${p.a.id}-${p.b.id}-line`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={s.stroke}
              strokeWidth={s.strokeWidth}
              opacity={s.opacity}
              strokeLinecap="round"
              style={{
                transition: "opacity 0.2s, stroke 0.2s, stroke-width 0.2s",
              }}
            />
          );
        })}

        {/* edge mid-labels — 둥근 chip + emoji */}
        {pairs.map((p) => {
          const a = positionById.get(p.a.id);
          const b = positionById.get(p.b.id);
          if (!a || !b) return null;
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          const label = edgeLabel(p);
          const focused = focusedMode && isEdgeRelated(p);
          const dim = focusedMode && !isEdgeRelated(p);
          const r = focused ? 17 : 15;
          return (
            <g
              key={`${p.a.id}-${p.b.id}-label`}
              opacity={dim ? DIM_OPACITY : 1}
              style={{ transition: "opacity 0.2s" }}
            >
              <circle
                cx={midX}
                cy={midY}
                r={r}
                fill={label.bg}
                stroke={label.ring}
                strokeWidth={focused ? 2.5 : 1.5}
                style={{ transition: "r 0.2s, stroke-width 0.2s" }}
              />
              <text
                x={midX}
                y={midY + 0.5}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={focused ? "20" : "17"}
                style={{ transition: "font-size 0.2s" }}
              >
                {label.text}
              </text>
            </g>
          );
        })}

        {/* nodes + labels */}
        {positions.map(({ member, x, y, angle }) => {
          const r = test.results.find((x2) => x2.id === member.result_id);
          const isMe = member.nickname === myNickname;
          const isFocused = focusedId === member.id;
          const dim = focusedMode && !isNodeRelated(member.id);
          const labelDistance = NODE_RADIUS + 16;
          const labelX =
            n === 1
              ? CENTER
              : CENTER + (RING_RADIUS + labelDistance) * Math.cos(angle);
          const labelY =
            n === 1
              ? CENTER + NODE_RADIUS + labelDistance
              : CENTER + (RING_RADIUS + labelDistance) * Math.sin(angle);

          return (
            <g
              key={member.id}
              onClick={(e) => {
                e.stopPropagation();
                toggleFocus(member.id);
              }}
              style={{
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              opacity={dim ? 0.35 : 1}
            >
              <circle
                cx={x}
                cy={y}
                r={isFocused ? NODE_RADIUS + 3 : NODE_RADIUS}
                fill={isMe ? "url(#me-grad)" : "#ffffff"}
                stroke={
                  isFocused ? "#FF6B9D" : isMe ? "#FF6B9D" : "#e5e7eb"
                }
                strokeWidth={isFocused ? 4 : isMe ? 3 : 1.5}
                style={{ transition: "r 0.15s, stroke-width 0.15s" }}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="26"
                pointerEvents="none"
              >
                {r?.emoji ?? "❓"}
              </text>
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="12"
                fontWeight={isFocused || isMe ? 700 : 600}
                fill={isFocused ? "#db2777" : isMe ? "#db2777" : "#374151"}
                pointerEvents="none"
              >
                {member.nickname}
                {isMe && " (나)"}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1 px-2 text-[11px] text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-[3px] w-5 rounded bg-emerald-500" />
          잘 맞음
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-[1.5px] w-5 rounded bg-gray-300" />
          보통
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-[3px] w-5 rounded bg-rose-500" />
          안 맞음
        </span>
        <span className="text-gray-400">진한 선 = 양쪽 모두</span>
      </div>

      <p className="mt-2 text-center text-[11px] text-gray-400">
        {focusedMode
          ? "다시 탭하거나 빈 공간을 누르면 모두 보여요"
          : "노드를 탭하면 그 친구의 관계만 강조돼요"}
      </p>
    </div>
  );
}
