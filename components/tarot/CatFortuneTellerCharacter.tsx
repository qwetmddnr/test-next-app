"use client";

interface CatFortuneTellerCharacterProps {
  width?: number | string;
  className?: string;
}

export default function CatFortuneTellerCharacter({
  width = "100%",
  className = "",
}: CatFortuneTellerCharacterProps) {
  return (
    <svg
      width={width}
      viewBox="0 0 680 580"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="검은 고양이 점쟁이와 수정구슬"
    >
      <style>{`
        @keyframes k-glow { 0%,100% { opacity: 0.3; } 50% { opacity: 0.7; } }
        @keyframes k-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes k-tail { 0%,100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
        @keyframes k-tw { 0%,100% { opacity: 0.25; } 50% { opacity: 1; } }
        @keyframes k-eyes { 0%,100% { transform: scaleY(1); } 47% { transform: scaleY(1); } 50% { transform: scaleY(0.2); } 53% { transform: scaleY(1); } }
        @keyframes k-orb-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
        @keyframes k-orb-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes k-particle {
          0% { opacity: 0; transform: translateY(0); }
          25% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-65px); }
        }
        .k-glow-a { animation: k-glow 4s ease-in-out infinite; }
        .k-glow-b { animation: k-glow 4s ease-in-out infinite -1.8s; }
        .k-cat { animation: k-float 4.5s ease-in-out infinite; transform-origin: center; }
        .k-tail { animation: k-tail 3s ease-in-out infinite; transform-origin: 250px 470px; }
        .k-tw-a { animation: k-tw 3s ease-in-out infinite; }
        .k-tw-b { animation: k-tw 3.6s ease-in-out infinite -1.2s; }
        .k-tw-c { animation: k-tw 2.6s ease-in-out infinite -0.6s; }
        .k-eyes { animation: k-eyes 5s ease-in-out infinite; transform-origin: 340px 330px; }
        .k-orb-pulse { animation: k-orb-pulse 2.4s ease-in-out infinite; transform-origin: 340px 470px; }
        .k-orb-inner { animation: k-orb-spin 18s linear infinite; transform-origin: 0 0; }
        .k-p1 { animation: k-particle 3.5s ease-out infinite; }
        .k-p2 { animation: k-particle 3.5s ease-out infinite -1.2s; }
        .k-p3 { animation: k-particle 3.5s ease-out infinite -2.4s; }
      `}</style>

      <defs>
        <radialGradient id="k-bg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#2d1b4e" />
          <stop offset="60%" stopColor="#1a0d36" />
          <stop offset="100%" stopColor="#0f0a1f" />
        </radialGradient>
        <radialGradient id="k-orb-grad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="30%" stopColor="#c4b5fd" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.95" />
        </radialGradient>
      </defs>

      {/* Dark mystic background */}
      <rect width="680" height="580" fill="url(#k-bg)" />

      {/* Moon */}
      <circle cx="555" cy="100" r="38" fill="#fef3c7" opacity="0.92" />
      <circle cx="572" cy="92" r="36" fill="#1a0d36" />

      {/* Stars */}
      <circle className="k-tw-a" cx="80" cy="80" r="1.6" fill="#f5f3ff" />
      <circle className="k-tw-b" cx="160" cy="50" r="1.2" fill="#fef3c7" />
      <circle className="k-tw-c" cx="240" cy="100" r="1.8" fill="#f5f3ff" />
      <circle className="k-tw-a" cx="450" cy="60" r="1.3" fill="#fef3c7" />
      <circle className="k-tw-b" cx="600" cy="180" r="1.6" fill="#f5f3ff" />
      <circle className="k-tw-c" cx="120" cy="180" r="1.2" fill="#fef3c7" />
      <circle className="k-tw-a" cx="40" cy="240" r="1.4" fill="#f5f3ff" />
      <circle className="k-tw-b" cx="640" cy="80" r="1.5" fill="#fef3c7" />

      {/* Bigger sparkles */}
      <g className="k-tw-a">
        <path d="M 100 130 L 102 136 L 108 138 L 102 140 L 100 146 L 98 140 L 92 138 L 98 136 Z" fill="#fef3c7" opacity="0.8" />
      </g>
      <g className="k-tw-b">
        <path d="M 580 280 L 582 286 L 588 288 L 582 290 L 580 296 L 578 290 L 572 288 L 578 286 Z" fill="#c4b5fd" opacity="0.85" />
      </g>

      {/* Cat figure (floats) */}
      <g className="k-cat">
        {/* Tail (curling around the orb base, waves) */}
        <g className="k-tail">
          <path
            d="M 250 470 Q 200 500 195 540 Q 210 555 235 545 Q 220 525 240 510"
            fill="#0a0613"
            stroke="#1a0d36"
            strokeWidth="1.5"
          />
        </g>

        {/* Body (seated cat) */}
        <ellipse cx="340" cy="430" rx="95" ry="85" fill="#0a0613" />
        <ellipse cx="340" cy="455" rx="60" ry="20" fill="#1a0d36" opacity="0.5" />

        {/* Front paws (resting toward orb) */}
        <ellipse cx="298" cy="500" rx="22" ry="14" fill="#0a0613" />
        <ellipse cx="382" cy="500" rx="22" ry="14" fill="#0a0613" />
        <circle cx="290" cy="498" r="2" fill="#6d28d9" opacity="0.7" />
        <circle cx="298" cy="496" r="2" fill="#6d28d9" opacity="0.7" />
        <circle cx="306" cy="498" r="2" fill="#6d28d9" opacity="0.7" />
        <circle cx="374" cy="498" r="2" fill="#6d28d9" opacity="0.7" />
        <circle cx="382" cy="496" r="2" fill="#6d28d9" opacity="0.7" />
        <circle cx="390" cy="498" r="2" fill="#6d28d9" opacity="0.7" />

        {/* Head */}
        <ellipse cx="340" cy="345" rx="68" ry="58" fill="#0a0613" />

        {/* Ears */}
        <path d="M 286 320 L 270 250 L 320 295 Z" fill="#0a0613" />
        <path d="M 394 320 L 410 250 L 360 295 Z" fill="#0a0613" />
        <path d="M 286 318 L 285 280 L 308 300 Z" fill="#6d28d9" opacity="0.7" />
        <path d="M 394 318 L 395 280 L 372 300 Z" fill="#6d28d9" opacity="0.7" />

        {/* Pointy witch hat on top */}
        <ellipse cx="340" cy="260" rx="80" ry="11" fill="#1f1140" />
        <path d="M 286 256 Q 310 170 340 110 Q 352 100 358 115 Q 360 150 380 200 Q 392 230 394 256 Z" fill="#1f1140" />
        <path d="M 286 246 L 394 246 L 388 256 L 294 256 Z" fill="#6d28d9" />
        <circle cx="370" cy="170" r="4" fill="#fef3c7" />
        <circle cx="356" cy="190" r="3" fill="#fbbf24" opacity="0.8" />

        {/* Glowing crescent eyes */}
        <g className="k-eyes">
          <ellipse cx="320" cy="335" rx="11" ry="14" fill="#fef3c7" />
          <ellipse cx="360" cy="335" rx="11" ry="14" fill="#fef3c7" />
          <ellipse cx="320" cy="338" rx="3" ry="9" fill="#1a0d36" />
          <ellipse cx="360" cy="338" rx="3" ry="9" fill="#1a0d36" />
        </g>

        {/* Tiny pink nose */}
        <path d="M 334 360 L 346 360 L 340 368 Z" fill="#f472b6" />

        {/* Mouth (mystic smirk) */}
        <path d="M 340 368 L 340 374" stroke="#1a0d36" strokeWidth="1.5" />
        <path d="M 340 374 Q 332 380 326 376" stroke="#1f1140" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 340 374 Q 348 380 354 376" stroke="#1f1140" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Whiskers */}
        <line x1="280" y1="362" x2="305" y2="365" stroke="#3d2766" strokeWidth="1.5" />
        <line x1="280" y1="370" x2="305" y2="370" stroke="#3d2766" strokeWidth="1.5" />
        <line x1="400" y1="362" x2="375" y2="365" stroke="#3d2766" strokeWidth="1.5" />
        <line x1="400" y1="370" x2="375" y2="370" stroke="#3d2766" strokeWidth="1.5" />
      </g>

      {/* Crystal ball glow */}
      <circle className="k-glow-a" cx="340" cy="490" r="115" fill="#a855f7" />
      <circle className="k-glow-b" cx="340" cy="490" r="80" fill="#c084fc" />

      {/* Crystal ball stand */}
      <path d="M 300 540 L 380 540 L 368 568 L 312 568 Z" fill="#2d1b4e" />
      <path d="M 300 540 L 380 540 L 374 548 L 306 548 Z" fill="#4a2882" />

      {/* Crystal ball */}
      <g className="k-orb-pulse">
        <circle cx="340" cy="490" r="60" fill="url(#k-orb-grad)" />
        <g transform="translate(340 490)">
          <g className="k-orb-inner" opacity="0.5">
            <ellipse cx="0" cy="-8" rx="34" ry="11" fill="#ffffff" opacity="0.55" />
            <ellipse cx="-6" cy="14" rx="26" ry="8" fill="#c4b5fd" opacity="0.65" />
          </g>
        </g>
        <ellipse cx="322" cy="472" rx="14" ry="9" fill="#ffffff" opacity="0.45" transform="rotate(-30 322 472)" />
        <ellipse cx="318" cy="470" rx="5" ry="3" fill="#ffffff" opacity="0.9" />
      </g>

      {/* Particles */}
      <circle className="k-p1" cx="300" cy="460" r="2.5" fill="#fef3c7" />
      <circle className="k-p2" cx="345" cy="450" r="2" fill="#c084fc" />
      <circle className="k-p3" cx="378" cy="465" r="2.5" fill="#f472b6" />
    </svg>
  );
}
