"use client";

interface CuteWitchCharacterProps {
  width?: number | string;
  className?: string;
}

export default function CuteWitchCharacter({
  width = "100%",
  className = "",
}: CuteWitchCharacterProps) {
  return (
    <svg
      width={width}
      viewBox="0 0 680 580"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="큐트 마녀와 수정구슬"
    >
      <style>{`
        @keyframes c-glow { 0%,100% { opacity: 0.35; } 50% { opacity: 0.75; } }
        @keyframes c-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes c-twinkle { 0%,100% { opacity: 0.3; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1.1); } }
        @keyframes c-bob { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
        @keyframes c-orb-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes c-particle {
          0% { opacity: 0; transform: translateY(0); }
          25% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-60px); }
        }
        .c-glow-a { animation: c-glow 3.5s ease-in-out infinite; }
        .c-glow-b { animation: c-glow 3.5s ease-in-out infinite -1.5s; }
        .c-figure { animation: c-float 4.5s ease-in-out infinite; transform-origin: center; }
        .c-witch-bob { animation: c-bob 4s ease-in-out infinite; transform-origin: 340px 460px; }
        .c-tw-a { animation: c-twinkle 2.4s ease-in-out infinite; transform-origin: center; }
        .c-tw-b { animation: c-twinkle 2.8s ease-in-out infinite -0.7s; transform-origin: center; }
        .c-tw-c { animation: c-twinkle 2.2s ease-in-out infinite -1.4s; transform-origin: center; }
        .c-orb-inner { animation: c-orb-spin 18s linear infinite; transform-origin: 0 0; }
        .c-p1 { animation: c-particle 3.2s ease-out infinite; }
        .c-p2 { animation: c-particle 3.2s ease-out infinite -1.1s; }
        .c-p3 { animation: c-particle 3.2s ease-out infinite -2.1s; }
      `}</style>

      {/* Soft cutepop background */}
      <defs>
        <radialGradient id="c-bg" cx="50%" cy="60%" r="70%">
          <stop offset="0%" stopColor="#fdf2f8" />
          <stop offset="60%" stopColor="#fae8ff" />
          <stop offset="100%" stopColor="#ede9fe" />
        </radialGradient>
        <radialGradient id="c-orb-grad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#fbcfe8" stopOpacity="0.9" />
          <stop offset="65%" stopColor="#c4b5fd" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.9" />
        </radialGradient>
      </defs>

      <rect width="680" height="580" fill="url(#c-bg)" />

      {/* Drifting sparkles */}
      <g className="c-tw-a">
        <circle cx="120" cy="120" r="3" fill="#f472b6" />
      </g>
      <g className="c-tw-b">
        <circle cx="560" cy="100" r="3.5" fill="#a78bfa" />
      </g>
      <g className="c-tw-c">
        <circle cx="80" cy="280" r="2.5" fill="#fbbf24" />
      </g>
      <g className="c-tw-b">
        <circle cx="610" cy="260" r="3" fill="#f472b6" />
      </g>
      <g className="c-tw-a">
        <circle cx="200" cy="80" r="2" fill="#a78bfa" />
      </g>
      <g className="c-tw-c">
        <circle cx="500" cy="180" r="2.5" fill="#fbbf24" />
      </g>

      {/* Big sparkle stars */}
      <g className="c-tw-a">
        <path d="M 170 200 L 173 210 L 183 213 L 173 216 L 170 226 L 167 216 L 157 213 L 167 210 Z" fill="#fbbf24" opacity="0.8" />
      </g>
      <g className="c-tw-b">
        <path d="M 510 320 L 513 328 L 521 330 L 513 332 L 510 340 L 507 332 L 499 330 L 507 328 Z" fill="#f472b6" opacity="0.8" />
      </g>

      {/* Witch figure (floats) */}
      <g className="c-figure">
        <g className="c-witch-bob">
          {/* Soft glow under witch */}
          <ellipse cx="340" cy="530" rx="160" ry="20" fill="#c4b5fd" opacity="0.35" />

          {/* Robe (cute pink) */}
          <path d="M 230 555 Q 240 420 280 360 Q 300 350 340 348 Q 380 350 400 360 Q 440 420 450 555 Z" fill="#f9a8d4" />
          <path d="M 270 555 Q 280 460 300 410 L 340 405 L 380 410 Q 400 460 410 555 Z" fill="#fbcfe8" opacity="0.7" />

          {/* Collar bow */}
          <path d="M 310 350 Q 340 343 370 350 L 365 365 Q 340 360 315 365 Z" fill="#7c3aed" />
          <circle cx="340" cy="356" r="6" fill="#fbbf24" />

          {/* Round face */}
          <circle cx="340" cy="305" r="56" fill="#fde8ee" />

          {/* Cheeks */}
          <circle cx="308" cy="320" r="9" fill="#fbb6ce" opacity="0.7" />
          <circle cx="372" cy="320" r="9" fill="#fbb6ce" opacity="0.7" />

          {/* Eyes (large kawaii) */}
          <ellipse cx="320" cy="300" rx="7" ry="10" fill="#1f1140" />
          <ellipse cx="360" cy="300" rx="7" ry="10" fill="#1f1140" />
          <circle cx="322" cy="296" r="2.5" fill="#ffffff" />
          <circle cx="362" cy="296" r="2.5" fill="#ffffff" />

          {/* Smile */}
          <path d="M 326 330 Q 340 340 354 330" stroke="#1f1140" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Pointy witch hat */}
          <path d="M 264 268 Q 280 270 340 270 Q 400 270 416 268 L 408 254 Q 380 252 340 252 Q 300 252 272 254 Z" fill="#7c3aed" />
          <path d="M 290 254 Q 320 170 340 110 Q 348 100 354 112 Q 360 150 380 200 Q 392 230 392 254 Z" fill="#7c3aed" />
          <path d="M 290 244 L 392 244 L 388 254 L 294 254 Z" fill="#fbbf24" />
          <circle cx="365" cy="180" r="6" fill="#fbbf24" />
          <circle cx="365" cy="180" r="3" fill="#ffffff" opacity="0.8" />
          <path d="M 348 108 Q 352 100 358 110" stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Sleeves + arms reaching toward the orb */}
          <path d="M 250 380 Q 230 430 260 470 L 295 460 Q 285 420 280 380 Z" fill="#f9a8d4" />
          <path d="M 430 380 Q 450 430 420 470 L 385 460 Q 395 420 400 380 Z" fill="#f9a8d4" />

          {/* Hands */}
          <circle cx="270" cy="475" r="14" fill="#fde8ee" />
          <circle cx="410" cy="475" r="14" fill="#fde8ee" />
        </g>
      </g>

      {/* Crystal ball glow */}
      <circle className="c-glow-a" cx="340" cy="490" r="110" fill="#c4b5fd" />
      <circle className="c-glow-b" cx="340" cy="490" r="80" fill="#f9a8d4" />

      {/* Crystal ball stand */}
      <path d="M 305 535 L 375 535 L 365 565 L 315 565 Z" fill="#7c3aed" />
      <path d="M 305 535 L 375 535 L 370 543 L 310 543 Z" fill="#a78bfa" />

      {/* Crystal ball */}
      <circle cx="340" cy="495" r="58" fill="url(#c-orb-grad)" />
      <g transform="translate(340 495)">
        <g className="c-orb-inner" opacity="0.45">
          <ellipse cx="0" cy="-8" rx="32" ry="11" fill="#ffffff" opacity="0.6" />
          <ellipse cx="-6" cy="14" rx="26" ry="8" fill="#fbcfe8" opacity="0.6" />
        </g>
      </g>
      <ellipse cx="322" cy="478" rx="14" ry="9" fill="#ffffff" opacity="0.5" transform="rotate(-25 322 478)" />
      <ellipse cx="318" cy="475" rx="5" ry="3" fill="#ffffff" opacity="0.95" />

      {/* Particles rising from orb */}
      <circle className="c-p1" cx="300" cy="460" r="3" fill="#fbbf24" />
      <circle className="c-p2" cx="345" cy="450" r="2.5" fill="#f472b6" />
      <circle className="c-p3" cx="380" cy="465" r="2.5" fill="#a78bfa" />
    </svg>
  );
}
