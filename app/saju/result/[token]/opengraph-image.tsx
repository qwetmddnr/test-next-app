import { ImageResponse } from "next/og";
import { lookupSajuByToken } from "@/lib/ai/saju";
import {
  type Element,
  type Pillar,
  elementKorean,
} from "@/lib/saju/calculate";
import {
  loadPretendard,
  OG_BG,
  OG_CONTENT_TYPE,
  OG_FONT_FAMILY,
  OG_FONT_NAME,
  OG_SIZE,
} from "@/lib/og/font";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "나의 사주";

const ELEMENT_GRADIENT: Record<Element, string> = {
  wood: "linear-gradient(135deg, #10b981, #047857)",
  fire: "linear-gradient(135deg, #f43f5e, #be123c)",
  earth: "linear-gradient(135deg, #f59e0b, #b45309)",
  metal: "linear-gradient(135deg, #64748b, #334155)",
  water: "linear-gradient(135deg, #0ea5e9, #0369a1)",
};

const ELEMENT_CELL: Record<Element, { bg: string; text: string }> = {
  wood: { bg: "#d1fae5", text: "#047857" },
  fire: { bg: "#ffe4e6", text: "#be123c" },
  earth: { bg: "#fef3c7", text: "#b45309" },
  metal: { bg: "#e2e8f0", text: "#334155" },
  water: { bg: "#e0f2fe", text: "#0369a1" },
};

function buildFallback(fontData: ArrayBuffer | null) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: OG_BG,
          fontFamily: OG_FONT_FAMILY,
          gap: 20,
        }}
      >
        <div style={{ fontSize: 160, display: "flex" }}>☯️</div>
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 700,
            background: "linear-gradient(90deg, #FF6B9D, #A78BFA)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          나의 사주
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: OG_FONT_NAME, data: fontData, style: "normal", weight: 700 }]
        : undefined,
    }
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const fontData = await loadPretendard();

  const result = await lookupSajuByToken(token);
  if (!result) return buildFallback(fontData);

  const { saju, input } = result;
  const name = input.name;
  const dayMaster = saju.pillars.day;
  const gradient = ELEMENT_GRADIENT[saju.dayMasterElement];

  const pillarCols: { label: string; pillar: Pillar | null }[] = [
    { label: "년주", pillar: saju.pillars.year },
    { label: "월주", pillar: saju.pillars.month },
    { label: "일주", pillar: saju.pillars.day },
    { label: "시주", pillar: saju.pillars.hour },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "50px 70px",
          background: OG_BG,
          fontFamily: OG_FONT_FAMILY,
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 700,
            background: "linear-gradient(90deg, #FF6B9D, #A78BFA)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          ☯️ OHNA · 사주
        </div>

        {/* 본문 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 50,
            marginTop: 8,
          }}
        >
          {/* 좌측: 일간 배지 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 290,
              height: 380,
              borderRadius: 28,
              background: gradient,
              color: "#fff",
              gap: 8,
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            }}
          >
            <div style={{ display: "flex", fontSize: 28, opacity: 0.9 }}>일간</div>
            <div style={{ display: "flex", fontSize: 200, fontWeight: 700, lineHeight: 1 }}>
              {dayMaster.ganHanja}
            </div>
            <div style={{ display: "flex", fontSize: 36, fontWeight: 700 }}>
              {saju.dayMasterKorean}
              {elementKorean(saju.dayMasterElement)}
            </div>
          </div>

          {/* 우측: 이름 + 4기둥 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 72,
                fontWeight: 700,
                background: "linear-gradient(90deg, #FF6B9D, #A78BFA)",
                backgroundClip: "text",
                color: "transparent",
                lineHeight: 1.1,
              }}
            >
              {name}님의 사주
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 24,
                color: "#6b7280",
                marginBottom: 10,
              }}
            >
              {input.calendar === "solar" ? "양력" : "음력"} {input.year}년 {input.month}월 {input.day}일
            </div>

            {/* 4기둥 미니 */}
            <div style={{ display: "flex", gap: 10 }}>
              {pillarCols.map(({ label, pillar }, idx) => {
                const isDay = idx === 2;
                if (!pillar) {
                  return (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: 95,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          fontSize: 18,
                          color: "#9ca3af",
                          marginBottom: 6,
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 90,
                          height: 130,
                          background: "#f3f4f6",
                          borderRadius: 14,
                          fontSize: 18,
                          color: "#9ca3af",
                        }}
                      >
                        시 모름
                      </div>
                    </div>
                  );
                }
                const ganColor = ELEMENT_CELL[pillar.ganElement];
                const zhiColor = ELEMENT_CELL[pillar.zhiElement];
                return (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: 95,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        fontSize: 18,
                        color: isDay ? "#a78bfa" : "#9ca3af",
                        fontWeight: 700,
                        marginBottom: 6,
                      }}
                    >
                      {label}
                      {isDay ? " ★" : ""}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: 90,
                        borderRadius: 14,
                        overflow: "hidden",
                        boxShadow: isDay
                          ? "0 0 0 3px #a78bfa"
                          : "0 0 0 1px #e5e7eb",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 65,
                          background: ganColor.bg,
                          color: ganColor.text,
                          fontSize: 44,
                          fontWeight: 700,
                        }}
                      >
                        {pillar.ganHanja}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 65,
                          background: zhiColor.bg,
                          color: zhiColor.text,
                          fontSize: 44,
                          fontWeight: 700,
                        }}
                      >
                        {pillar.zhiHanja}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            fontSize: 20,
            color: "#9ca3af",
            fontWeight: 700,
          }}
        >
          OHNA · ohna.today
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: OG_FONT_NAME, data: fontData, style: "normal", weight: 700 }]
        : undefined,
    }
  );
}
