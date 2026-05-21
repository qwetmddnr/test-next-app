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
export const alt = "오늘의 띠 운세 — 출생년도로 보는 오늘의 운세";

export default async function Image() {
  const fontData = await loadPretendard();
  const zodiacs = ["🐭", "🐂", "🐯", "🐰", "🐲", "🐍", "🐴", "🐑", "🐵", "🐓", "🐶", "🐷"];

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
            gap: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: "20px 32px",
              background: "rgba(255, 255, 255, 0.75)",
              borderRadius: 999,
              boxShadow: "0 12px 32px rgba(167,139,250,0.18)",
            }}
          >
            {zodiacs.map((z, i) => (
              <span key={i} style={{ fontSize: 56, display: "flex" }}>
                {z}
              </span>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 700,
              background: "linear-gradient(90deg, #FF6B9D, #A78BFA)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1.1,
              marginTop: 8,
            }}
          >
            오늘의 띠 운세
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
            출생년도로 알아보는 12띠별 오늘의 운세
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 6,
              fontSize: 22,
              color: "#db2777",
              fontWeight: 700,
            }}
          >
            일·재물운 · 애정운 · 건강운
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
