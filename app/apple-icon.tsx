import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const CAT_HEAD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FF6B9D"/>
      <stop offset="1" stop-color="#A78BFA"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="7" fill="url(#bg)"/>
  <path d="M 12 10 Q 15 4 16 3 Q 17 4 20 10 Z" fill="#1f1140"/>
  <ellipse cx="16" cy="10" rx="5" ry="0.9" fill="#1f1140"/>
  <rect x="11" y="9.2" width="10" height="1.1" fill="#6d28d9"/>
  <circle cx="18" cy="6" r="0.6" fill="#fef3c7"/>
  <path d="M 8 17 L 7 11 L 13 14 Z" fill="#0a0613"/>
  <path d="M 24 17 L 25 11 L 19 14 Z" fill="#0a0613"/>
  <ellipse cx="16" cy="20" rx="9" ry="7.5" fill="#0a0613"/>
  <ellipse cx="12.5" cy="19" rx="1.8" ry="2.3" fill="#fef3c7"/>
  <ellipse cx="19.5" cy="19" rx="1.8" ry="2.3" fill="#fef3c7"/>
  <ellipse cx="12.5" cy="19.5" rx="0.6" ry="1.3" fill="#1a0d36"/>
  <ellipse cx="19.5" cy="19.5" rx="0.6" ry="1.3" fill="#1a0d36"/>
  <path d="M 15 23 L 17 23 L 16 24.3 Z" fill="#f472b6"/>
</svg>`;

export default function AppleIcon() {
  const src = `data:image/svg+xml;base64,${Buffer.from(CAT_HEAD_SVG).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={180} height={180} alt="" />
      </div>
    ),
    { ...size }
  );
}
