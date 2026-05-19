import { ImageResponse } from "next/og";
import { getResult } from "@/lib/test/loader";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "운세 & 재미 테스트 결과";

const PRETENDARD_OTF_URL =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.otf";

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(PRETENDARD_OTF_URL);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  const found = getResult(type, id);
  if (!found) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
          }}
        >
          <div style={{ fontSize: 64, display: "flex" }}>Not Found</div>
        </div>
      ),
      size
    );
  }

  const { result } = found;
  const fontData = await loadFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "60px 70px",
          background:
            "linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #fff7ed 100%)",
          fontFamily: "Pretendard, system-ui, sans-serif",
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
            gap: 12,
          }}
        >
          <div style={{ fontSize: 180, display: "flex", lineHeight: 1 }}>
            {result.emoji}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 700,
              background: "linear-gradient(90deg, #FF6B9D, #A78BFA)",
              backgroundClip: "text",
              color: "transparent",
              marginTop: 16,
            }}
          >
            당신은 {result.title}!
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#4b5563",
              maxWidth: 900,
              textAlign: "center",
              marginTop: 4,
            }}
          >
            {result.shortDesc}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            {result.traits.slice(0, 3).map((trait) => (
              <div
                key={trait}
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  background: "rgba(255, 107, 157, 0.12)",
                  color: "#db2777",
                  borderRadius: 999,
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                #{trait}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#9ca3af",
              fontWeight: 700,
            }}
          >
            오늘의나
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: "Pretendard",
              data: fontData,
              style: "normal",
              weight: 700,
            },
          ]
        : undefined,
    }
  );
}
