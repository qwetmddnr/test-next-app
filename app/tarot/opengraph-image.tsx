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
export const alt = "오늘의 타로 — 검은 고양이 점쟁이가 뽑아주는 한 장";

const CAT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 580">
  <defs>
    <radialGradient id="orb-grad" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
      <stop offset="30%" stop-color="#c4b5fd" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#6d28d9" stop-opacity="0.95"/>
    </radialGradient>
  </defs>

  <circle cx="555" cy="100" r="38" fill="#fef3c7" opacity="0.92"/>
  <circle cx="572" cy="92" r="36" fill="#1a0d36"/>

  <circle cx="80" cy="80" r="1.6" fill="#f5f3ff"/>
  <circle cx="160" cy="50" r="1.2" fill="#fef3c7"/>
  <circle cx="240" cy="100" r="1.8" fill="#f5f3ff"/>
  <circle cx="450" cy="60" r="1.3" fill="#fef3c7"/>
  <circle cx="600" cy="180" r="1.6" fill="#f5f3ff"/>
  <circle cx="120" cy="180" r="1.2" fill="#fef3c7"/>
  <circle cx="40" cy="240" r="1.4" fill="#f5f3ff"/>
  <circle cx="640" cy="80" r="1.5" fill="#fef3c7"/>

  <path d="M 100 130 L 102 136 L 108 138 L 102 140 L 100 146 L 98 140 L 92 138 L 98 136 Z" fill="#fef3c7" opacity="0.8"/>
  <path d="M 580 280 L 582 286 L 588 288 L 582 290 L 580 296 L 578 290 L 572 288 L 578 286 Z" fill="#c4b5fd" opacity="0.85"/>

  <path d="M 250 470 Q 200 500 195 540 Q 210 555 235 545 Q 220 525 240 510" fill="#0a0613" stroke="#1a0d36" stroke-width="1.5"/>

  <ellipse cx="340" cy="430" rx="95" ry="85" fill="#0a0613"/>
  <ellipse cx="340" cy="455" rx="60" ry="20" fill="#1a0d36" opacity="0.5"/>

  <ellipse cx="298" cy="500" rx="22" ry="14" fill="#0a0613"/>
  <ellipse cx="382" cy="500" rx="22" ry="14" fill="#0a0613"/>
  <circle cx="290" cy="498" r="2" fill="#6d28d9" opacity="0.7"/>
  <circle cx="298" cy="496" r="2" fill="#6d28d9" opacity="0.7"/>
  <circle cx="306" cy="498" r="2" fill="#6d28d9" opacity="0.7"/>
  <circle cx="374" cy="498" r="2" fill="#6d28d9" opacity="0.7"/>
  <circle cx="382" cy="496" r="2" fill="#6d28d9" opacity="0.7"/>
  <circle cx="390" cy="498" r="2" fill="#6d28d9" opacity="0.7"/>

  <ellipse cx="340" cy="345" rx="68" ry="58" fill="#0a0613"/>

  <path d="M 286 320 L 270 250 L 320 295 Z" fill="#0a0613"/>
  <path d="M 394 320 L 410 250 L 360 295 Z" fill="#0a0613"/>
  <path d="M 286 318 L 285 280 L 308 300 Z" fill="#6d28d9" opacity="0.7"/>
  <path d="M 394 318 L 395 280 L 372 300 Z" fill="#6d28d9" opacity="0.7"/>

  <ellipse cx="340" cy="260" rx="80" ry="11" fill="#1f1140"/>
  <path d="M 286 256 Q 310 170 340 110 Q 352 100 358 115 Q 360 150 380 200 Q 392 230 394 256 Z" fill="#1f1140"/>
  <path d="M 286 246 L 394 246 L 388 256 L 294 256 Z" fill="#6d28d9"/>
  <circle cx="370" cy="170" r="4" fill="#fef3c7"/>
  <circle cx="356" cy="190" r="3" fill="#fbbf24" opacity="0.8"/>

  <ellipse cx="320" cy="335" rx="11" ry="14" fill="#fef3c7"/>
  <ellipse cx="360" cy="335" rx="11" ry="14" fill="#fef3c7"/>
  <ellipse cx="320" cy="338" rx="3" ry="9" fill="#1a0d36"/>
  <ellipse cx="360" cy="338" rx="3" ry="9" fill="#1a0d36"/>

  <path d="M 334 360 L 346 360 L 340 368 Z" fill="#f472b6"/>

  <path d="M 340 368 L 340 374" stroke="#1a0d36" stroke-width="1.5"/>
  <path d="M 340 374 Q 332 380 326 376" stroke="#1f1140" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M 340 374 Q 348 380 354 376" stroke="#1f1140" stroke-width="2" fill="none" stroke-linecap="round"/>

  <line x1="280" y1="362" x2="305" y2="365" stroke="#3d2766" stroke-width="1.5"/>
  <line x1="280" y1="370" x2="305" y2="370" stroke="#3d2766" stroke-width="1.5"/>
  <line x1="400" y1="362" x2="375" y2="365" stroke="#3d2766" stroke-width="1.5"/>
  <line x1="400" y1="370" x2="375" y2="370" stroke="#3d2766" stroke-width="1.5"/>

  <circle cx="340" cy="490" r="115" fill="#a855f7" opacity="0.35"/>
  <circle cx="340" cy="490" r="80" fill="#c084fc" opacity="0.45"/>

  <path d="M 300 540 L 380 540 L 368 568 L 312 568 Z" fill="#2d1b4e"/>
  <path d="M 300 540 L 380 540 L 374 548 L 306 548 Z" fill="#4a2882"/>

  <circle cx="340" cy="490" r="60" fill="url(#orb-grad)"/>
  <ellipse cx="322" cy="472" rx="14" ry="9" fill="#ffffff" opacity="0.45" transform="rotate(-30 322 472)"/>
  <ellipse cx="318" cy="470" rx="5" ry="3" fill="#ffffff" opacity="0.9"/>

  <circle cx="300" cy="460" r="2.5" fill="#fef3c7"/>
  <circle cx="345" cy="450" r="2" fill="#c084fc"/>
  <circle cx="378" cy="465" r="2.5" fill="#f472b6"/>
</svg>`;

export default async function Image() {
  const fontData = await loadPretendard();
  const catSrc = `data:image/svg+xml;base64,${Buffer.from(CAT_SVG).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(135deg, #1a0d36 0%, #2d1b4e 45%, #0f0a1f 100%)",
          fontFamily: OG_FONT_FAMILY,
          position: "relative",
          padding: "60px 70px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 830,
            width: 6,
            height: 6,
            borderRadius: 9999,
            background: "#fcd34d",
            opacity: 0.75,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 215,
            left: 1085,
            width: 4,
            height: 4,
            borderRadius: 9999,
            background: "#fef3c7",
            opacity: 0.5,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 478,
            left: 945,
            width: 5,
            height: 5,
            borderRadius: 9999,
            background: "#fcd34d",
            opacity: 0.6,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 548,
            left: 725,
            width: 3,
            height: 3,
            borderRadius: 9999,
            background: "#fef3c7",
            opacity: 0.45,
            display: "flex",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 50,
            left: 70,
            display: "flex",
            fontSize: 26,
            fontWeight: 700,
            color: "#fbbf24",
            letterSpacing: 1,
          }}
        >
          ✨ OHNA
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 30,
            marginTop: 30,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={catSrc}
            width={520}
            height={444}
            alt=""
            style={{ flexShrink: 0 }}
          />

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
                fontSize: 76,
                fontWeight: 700,
                background:
                  "linear-gradient(90deg, #fde68a 0%, #fbbf24 50%, #f5d0a8 100%)",
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
                flexDirection: "column",
                fontSize: 26,
                color: "#e9d5ff",
                lineHeight: 1.4,
              }}
            >
              <div style={{ display: "flex" }}>마음에 끌리는 카드 한 장으로</div>
              <div style={{ display: "flex" }}>보는 오늘의 메시지</div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 8,
                padding: "10px 22px",
                background: "rgba(251, 191, 36, 0.14)",
                border: "1.5px solid rgba(251, 191, 36, 0.4)",
                color: "#fcd34d",
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 700,
                alignSelf: "flex-start",
              }}
            >
              🃏 메이저 아르카나 22장
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 50,
            right: 70,
            display: "flex",
            fontSize: 22,
            color: "rgba(252, 211, 77, 0.6)",
            fontWeight: 700,
            letterSpacing: 1,
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
