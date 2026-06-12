import { ImageResponse } from "next/og";
import {
  loadPretendard,
  OG_BG,
  OG_CONTENT_TYPE,
  OG_FONT_FAMILY,
  OG_FONT_NAME,
  OG_SIZE,
} from "@/lib/og/font";
import { getArticle } from "@/lib/blog/loader";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "OHNA 매거진";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  const fontData = await loadPretendard();

  const fonts = fontData
    ? [{ name: OG_FONT_NAME, data: fontData, style: "normal" as const, weight: 700 as const }]
    : undefined;

  if (!article) {
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
          OHNA · 매거진
        </div>
      ),
      { ...size, fonts }
    );
  }

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
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              display: "flex",
              background: "linear-gradient(90deg, #FF6B9D, #A78BFA)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            ✨ OHNA 매거진
          </span>
          <span
            style={{
              display: "flex",
              padding: "6px 16px",
              background: "rgba(167, 139, 250, 0.15)",
              color: "#7c3aed",
              borderRadius: 999,
              fontSize: 22,
            }}
          >
            {article.category}
          </span>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <div style={{ fontSize: 120, display: "flex" }}>{article.emoji}</div>
          <div
            style={{
              display: "flex",
              fontSize: 58,
              fontWeight: 700,
              color: "#1f2937",
              lineHeight: 1.2,
              maxWidth: 1000,
            }}
          >
            {article.title}
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
    { ...size, fonts }
  );
}
