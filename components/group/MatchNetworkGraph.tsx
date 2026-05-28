// 멤버 N명을 원 둘레에 균등 배치하고, 모든 쌍 사이를 선으로 연결한 관계망 그래프.
// 선의 색상은 매칭 점수(match/neutral/avoid), 굵기는 mutual(양방향) 여부에 따라.

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
const RING_RADIUS = VIEW / 2 - NODE_RADIUS - 40; // 라벨 공간 확보

function edgeStyle(p: MemberPair): {
  stroke: string;
  strokeWidth: number;
  opacity: number;
} {
  if (p.score === "match") {
    return {
      stroke: p.mutual ? "#10b981" : "#6ee7b7",
      strokeWidth: p.mutual ? 3 : 1.6,
      opacity: 0.85,
    };
  }
  if (p.score === "avoid") {
    return {
      stroke: p.mutual ? "#ef4444" : "#fca5a5",
      strokeWidth: p.mutual ? 3 : 1.6,
      opacity: 0.85,
    };
  }
  return { stroke: "#e5e7eb", strokeWidth: 1, opacity: 0.6 };
}

// 선 가운데에 표시할 매칭 라벨.
// 색상은 stroke 색과 통일, mutual은 한 번 더 표시("XX")로 강조.
function edgeLabel(p: MemberPair): {
  text: string;
  fill: string;
  bg: string;
} {
  if (p.score === "match") {
    return {
      text: p.mutual ? "잘잘" : "잘",
      fill: "#047857",
      bg: "#d1fae5",
    };
  }
  if (p.score === "avoid") {
    return {
      text: p.mutual ? "안안" : "안",
      fill: "#b91c1c",
      bg: "#fee2e2",
    };
  }
  return { text: "보통", fill: "#6b7280", bg: "#f3f4f6" };
}

export function MatchNetworkGraph({
  test,
  members,
  pairs,
  myNickname,
}: MatchNetworkGraphProps) {
  const n = members.length;
  if (n === 0) return null;

  // 1명만 있을 땐 그래프 가운데에 노드 하나만.
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

  return (
    <div className="rounded-3xl bg-white/85 p-3 ring-1 ring-pink-100">
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        width="100%"
        height="auto"
        className="block"
        role="img"
        aria-label="모임 멤버 관계망"
      >
        <defs>
          <radialGradient id="me-grad" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#FFE9F2" />
            <stop offset="100%" stopColor="#FFC4DA" />
          </radialGradient>
        </defs>

        {/* edges */}
        {pairs.map((p) => {
          const a = positionById.get(p.a.id);
          const b = positionById.get(p.b.id);
          if (!a || !b) return null;
          const s = edgeStyle(p);
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
            />
          );
        })}

        {/* edge mid-labels — 노드 아래 layer로 깔리지 않도록 라인 다음에 그림 */}
        {pairs.map((p) => {
          const a = positionById.get(p.a.id);
          const b = positionById.get(p.b.id);
          if (!a || !b) return null;
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          const label = edgeLabel(p);
          // text width 추정: 글자 1자당 ~7px, padding 양쪽 5px씩
          const padX = 5;
          const charW = 8;
          const w = label.text.length * charW + padX * 2;
          const h = 16;
          return (
            <g key={`${p.a.id}-${p.b.id}-label`}>
              <rect
                x={midX - w / 2}
                y={midY - h / 2}
                width={w}
                height={h}
                rx={8}
                ry={8}
                fill={label.bg}
                stroke="#ffffff"
                strokeWidth={1.5}
              />
              <text
                x={midX}
                y={midY}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="11"
                fontWeight={700}
                fill={label.fill}
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
            <g key={member.id}>
              <circle
                cx={x}
                cy={y}
                r={NODE_RADIUS}
                fill={isMe ? "url(#me-grad)" : "#ffffff"}
                stroke={isMe ? "#FF6B9D" : "#e5e7eb"}
                strokeWidth={isMe ? 3 : 1.5}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="26"
              >
                {r?.emoji ?? "❓"}
              </text>
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="12"
                fontWeight={isMe ? 700 : 600}
                fill={isMe ? "#db2777" : "#374151"}
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
    </div>
  );
}
