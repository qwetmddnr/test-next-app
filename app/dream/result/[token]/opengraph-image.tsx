import { ImageResponse } from "next/og";
import { lookupDreamByToken } from "@/lib/ai/dream";
import {
  loadPretendard,
  OG_CONTENT_TYPE,
  OG_FONT_FAMILY,
  OG_FONT_NAME,
  OG_SIZE,
} from "@/lib/og/font";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "내 꿈 해몽";

// 꿈 페이지 톤(인디고/바이올렛)에 맞춘 OG 전용 배경
const DREAM_BG =
  "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 45%, #faf5ff 100%)";

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}

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
          background: DREAM_BG,
          fontFamily: OG_FONT_FAMILY,
          gap: 20,
        }}
      >
        <div style={{ fontSize: 180, display: "flex" }}>🌙</div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            background:
              "linear-gradient(90deg, #818cf8, #a78bfa, #c084fc)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          꿈 해몽
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

  const result = await lookupDreamByToken(token);
  if (!result) return buildFallback(fontData);

  const dreamText = truncate(result.text, 110);

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
            alignItems: "center",
            gap: 14,
          }}
        >
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
          {/* 좌측: 달 배지 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 290,
              height: 380,
              borderRadius: 28,
              background:
                "linear-gradient(135deg, #6366f1 0%, #a78bfa 60%, #c084fc 100%)",
              color: "#fff",
              gap: 14,
              boxShadow: "0 20px 60px rgba(99,102,241,0.30)",
            }}
          >
            <div style={{ display: "flex", fontSize: 200, lineHeight: 1 }}>
              🌙
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              꿈 해몽
            </div>
          </div>

          {/* 우측: 인용된 꿈 텍스트 */}
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
                fontSize: 24,
                color: "#818cf8",
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              ✨ 꾼 꿈
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 40,
                fontWeight: 700,
                color: "#312e81",
                lineHeight: 1.35,
                maxWidth: 700,
              }}
            >
              “{dreamText}”
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 26,
                color: "#6b7280",
                marginTop: 16,
                lineHeight: 1.4,
                maxWidth: 700,
              }}
            >
              AI가 풀어주는 오늘 이 꿈의 의미를 확인해 보세요.
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
