import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";
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

async function loadImageAsDataUrl(
  publicPath: string
): Promise<string | null> {
  try {
    const relative = publicPath.replace(/^\//, "");
    const absolute = path.join(process.cwd(), "public", relative);
    const buf = await fs.readFile(absolute);
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

function splitTitle(title: string) {
  const m = title.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (m) return { korean: m[1].trim(), english: m[2].trim() };
  return { korean: title, english: null };
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
  const cardImage = result.image
    ? await loadImageAsDataUrl(result.image)
    : null;
  const { korean, english } = splitTitle(result.title);
  const isTarot = type === "tarot";

  const baseBg = {
    width: "100%",
    height: "100%",
    display: "flex" as const,
    background: isTarot
      ? "linear-gradient(135deg, #ddd6fe 0%, #f5f3ff 40%, #faf5ff 70%, #fff7ed 100%)"
      : "linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #fff7ed 100%)",
    fontFamily: "Pretendard, system-ui, sans-serif",
  };

  // 카드 이미지가 있으면 좌측 카드 + 우측 텍스트 레이아웃
  if (cardImage) {
    return new ImageResponse(
      (
        <div
          style={{ ...baseBg, flexDirection: "column", padding: "50px 60px" }}
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
              alignItems: "center",
              gap: 60,
              marginTop: 10,
            }}
          >
            {/* 카드 이미지 */}
            <div
              style={{
                display: "flex",
                width: 290,
                height: 500,
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(167,139,250,0.4)",
              }}
            >
              <img
                src={cardImage}
                alt=""
                width={290}
                height={500}
                style={{ width: 290, height: 500, objectFit: "cover" }}
              />
            </div>

            {/* 우측 텍스트 */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 68,
                  fontWeight: 700,
                  background: "linear-gradient(90deg, #FF6B9D, #A78BFA)",
                  backgroundClip: "text",
                  color: "transparent",
                  lineHeight: 1.1,
                }}
              >
                당신은 {korean}!
              </div>
              {english && (
                <div
                  style={{
                    display: "flex",
                    fontSize: 24,
                    color: "#9ca3af",
                    letterSpacing: "0.18em",
                    fontWeight: 700,
                  }}
                >
                  {english.toUpperCase()}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  fontSize: 26,
                  color: "#4b5563",
                  marginTop: 12,
                  maxWidth: 540,
                  lineHeight: 1.4,
                }}
              >
                {result.shortDesc}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 16,
                  flexWrap: "wrap",
                }}
              >
                {result.traits.slice(0, 3).map((trait) => (
                  <div
                    key={trait}
                    style={{
                      display: "flex",
                      padding: "6px 14px",
                      background: "rgba(255, 107, 157, 0.12)",
                      color: "#db2777",
                      borderRadius: 999,
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                  >
                    #{trait}
                  </div>
                ))}
              </div>
            </div>
          </div>

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

  // 카드 이미지가 없으면 기존 레이아웃 (emoji + 텍스트)
  return new ImageResponse(
    (
      <div
        style={{ ...baseBg, flexDirection: "column", padding: "60px 70px" }}
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
            gap: 12,
          }}
        >
          <div style={{ fontSize: 180, display: "flex", lineHeight: 1 }}>
            {result.emoji}
          </div>

          {result.displayCode && (
            <div
              style={{
                display: "flex",
                padding: "8px 24px",
                background: "linear-gradient(90deg, #FF6B9D, #A78BFA)",
                color: "#fff",
                borderRadius: 999,
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "0.25em",
                marginTop: 8,
              }}
            >
              {result.displayCode}
            </div>
          )}

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
            당신은 {korean}!
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
            OHNA · ohna.today
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
