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
export const alt = "오늘의 타로 — 한 장 뽑기";

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
            alignItems: "center",
            gap: 60,
            marginTop: 10,
          }}
        >
          {/* 카드 뒷면 디자인 */}
          <div
            style={{
              display: "flex",
              width: 280,
              height: 460,
              borderRadius: 24,
              background:
                "linear-gradient(135deg, #A78BFA 0%, #E66BD6 50%, #FF6B9D 100%)",
              boxShadow: "0 24px 60px rgba(167,139,250,0.45)",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 16,
                border: "2px solid rgba(255,255,255,0.4)",
                borderRadius: 18,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 100, display: "flex", color: "#fff" }}>
                ✦
              </span>
              <span
                style={{
                  display: "flex",
                  fontSize: 22,
                  color: "rgba(255,255,255,0.7)",
                  letterSpacing: "0.4em",
                  fontWeight: 700,
                }}
              >
                TAROT
              </span>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 18,
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
              오늘의 타로
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                color: "#4b5563",
                lineHeight: 1.4,
                maxWidth: 540,
              }}
            >
              마음에 끌리는 카드 한 장으로 보는
              오늘의 메시지
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 8,
                padding: "10px 20px",
                background: "rgba(255, 107, 157, 0.12)",
                color: "#db2777",
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 700,
                alignSelf: "flex-start",
              }}
            >
              메이저 아르카나 22장
            </div>
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
