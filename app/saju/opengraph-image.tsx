import { ImageResponse } from "next/og";
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
export const alt = "사주 — 준비중";

export default async function Image() {
  const fontData = await loadPretendard();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "60px 70px",
          background: OG_BG,
          fontFamily: OG_FONT_FAMILY,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            background: "linear-gradient(90deg, #FF6B9D, #A78BFA)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          ✨ 오늘의 나
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
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
              lineHeight: 1.1,
            }}
          >
            오늘의 사주
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#4b5563",
              textAlign: "center",
              maxWidth: 800,
            }}
          >
            만세력 기반 AI 사주 분석을 준비하고 있어요
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 14,
              padding: "12px 24px",
              background: "rgba(167, 139, 250, 0.15)",
              color: "#7c3aed",
              borderRadius: 999,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            <span
              style={{
                display: "flex",
                width: 12,
                height: 12,
                borderRadius: 999,
                background: "#a78bfa",
              }}
            />
            준비중이에요
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            fontSize: 22,
            color: "#9ca3af",
            fontWeight: 700,
          }}
        >
          오늘의나
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
