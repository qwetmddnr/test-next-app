import { ImageResponse } from "next/og";
import {
  loadPretendard,
  OG_CONTENT_TYPE,
  OG_FONT_FAMILY,
  OG_FONT_NAME,
  OG_SIZE,
} from "@/lib/og/font";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "꿈 해몽 — AI가 풀어주는 어젯밤 꿈의 의미";

const DREAM_BG =
  "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 45%, #faf5ff 100%)";

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
          padding: "50px 70px",
          background: DREAM_BG,
          fontFamily: OG_FONT_FAMILY,
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 700,
            background: "linear-gradient(90deg, #6366f1, #a78bfa)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          🌙 OHNA · 꿈 해몽
        </div>

        {/* 본문 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
          }}
        >
          <div style={{ fontSize: 200, display: "flex", lineHeight: 1 }}>
            🌙
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 700,
              background:
                "linear-gradient(90deg, #6366f1, #a78bfa, #c084fc)",
              backgroundClip: "text",
              color: "transparent",
              marginTop: 12,
              letterSpacing: "-0.01em",
            }}
          >
            꿈 해몽
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: "#4b5563",
              maxWidth: 900,
              textAlign: "center",
              marginTop: 4,
            }}
          >
            어젯밤 꾼 꿈, AI가 따뜻하게 풀어드려요
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 18,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {["#전통해몽", "#AI해석", "#오늘의메시지"].map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  background: "rgba(167, 139, 250, 0.18)",
                  color: "#6d28d9",
                  borderRadius: 999,
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                {tag}
              </div>
            ))}
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
