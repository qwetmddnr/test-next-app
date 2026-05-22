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
export const alt = "나의 사주 — 생년월일시로 보는 사주팔자";

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
          ✨ OHNA
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
            나의 사주
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
            이름·생년월일·시간으로 보는 나만의 사주팔자
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
