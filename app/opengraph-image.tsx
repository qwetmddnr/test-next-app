import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "오늘의 나 — 운세 & 재미 테스트";

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

export default async function Image() {
  const fontData = await loadFont();

  const contents = [
    { emoji: "🃏", label: "타로" },
    { emoji: "🎍", label: "띠 운세" },
    { emoji: "🧬", label: "MBTI" },
    { emoji: "🐶", label: "동물상" },
    { emoji: "⏳", label: "전생" },
    { emoji: "💕", label: "연애" },
  ];

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
            justifyContent: "center",
            alignItems: "center",
            gap: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              background:
                "linear-gradient(90deg, #FF6B9D 0%, #E66BD6 50%, #A78BFA 100%)",
              backgroundClip: "text",
              color: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            오늘의 나
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: "#4b5563",
            }}
          >
            운세부터 재미 테스트까지 ✨
          </div>

          <div
            style={{
              display: "flex",
              gap: 18,
              marginTop: 20,
            }}
          >
            {contents.map((c) => (
              <div
                key={c.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 110,
                  height: 110,
                  borderRadius: 22,
                  background: "rgba(255, 255, 255, 0.85)",
                  boxShadow: "0 8px 24px rgba(167,139,250,0.18)",
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 44, display: "flex" }}>{c.emoji}</span>
                <span
                  style={{
                    display: "flex",
                    fontSize: 16,
                    color: "#6b7280",
                    fontWeight: 700,
                  }}
                >
                  {c.label}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 16,
              fontSize: 22,
              color: "#db2777",
              fontWeight: 700,
            }}
          >
            AI가 분석하는 나만의 오늘
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
