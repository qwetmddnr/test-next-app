import { ImageResponse } from "next/og";
import {
  loadPretendard,
  OG_BG,
  OG_CONTENT_TYPE,
  OG_FONT_FAMILY,
  OG_FONT_NAME,
  OG_SIZE,
} from "@/lib/og/font";
import { getTest } from "@/lib/test/loader";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "OHNA — 오늘의 나 · 테스트";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const test = getTest(slug);
  const fontData = await loadPretendard();

  // 테스트가 없거나 빈 questions(엔트리 페이지로 redirect되는 케이스)면 fallback
  if (!test || test.questions.length === 0) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: OG_BG,
            fontFamily: OG_FONT_FAMILY,
            fontSize: 64,
            color: "#9ca3af",
          }}
        >
          OHNA · 오늘의 나
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

  const questionCount = test.questions.length;
  const resultCount = test.results.length;

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
            gap: 20,
          }}
        >
          <div style={{ fontSize: 180, display: "flex" }}>{test.emoji}</div>

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
            {test.title}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#4b5563",
              textAlign: "center",
              maxWidth: 900,
            }}
          >
            {test.description}
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "10px 22px",
                background: "rgba(255, 107, 157, 0.12)",
                color: "#db2777",
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {questionCount}문항
            </div>
            <div
              style={{
                display: "flex",
                padding: "10px 22px",
                background: "rgba(167, 139, 250, 0.15)",
                color: "#7c3aed",
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              결과 {resultCount}종
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
