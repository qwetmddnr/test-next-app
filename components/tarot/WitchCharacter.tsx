"use client";

interface WitchCharacterProps {
  width?: number | string;
  className?: string;
}

export default function WitchCharacter({
  width = "100%",
  className = "",
}: WitchCharacterProps) {
  return (
    <svg
      width={width}
      viewBox="0 0 680 580"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="신비로운 마녀와 수정구슬"
    >
      <style>{`
        @keyframes w-glow { 0%,100% { opacity: 0.25; } 50% { opacity: 0.6; } }
        @keyframes w-glow-b { 0%,100% { opacity: 0.35; } 50% { opacity: 0.75; } }
        @keyframes w-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes w-spin1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes w-spin2 { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes w-tw1 { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
        @keyframes w-tw2 { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes w-eyes { 0%,100% { opacity: 0.7; } 50% { opacity: 1; } }
        @keyframes w-particle {
          0% { opacity: 0; transform: translateY(0); }
          25% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-70px); }
        }
        .w-ga { animation: w-glow 4s ease-in-out infinite; }
        .w-gb { animation: w-glow 4s ease-in-out infinite -2s; }
        .w-gc { animation: w-glow-b 3s ease-in-out infinite; }
        .w-figure { animation: w-float 5s ease-in-out infinite; transform-origin: center; }
        .w-m1 { animation: w-spin1 20s linear infinite; transform-origin: 0 0; }
        .w-m2 { animation: w-spin2 28s linear infinite; transform-origin: 0 0; }
        .w-t1 { animation: w-tw1 3s ease-in-out infinite; }
        .w-t2 { animation: w-tw2 4s ease-in-out infinite; }
        .w-t3 { animation: w-tw1 2.5s ease-in-out infinite -1s; }
        .w-ey { animation: w-eyes 2.5s ease-in-out infinite; }
        .w-p1 { animation: w-particle 4s ease-out infinite; }
        .w-p2 { animation: w-particle 4s ease-out infinite -1.3s; }
        .w-p3 { animation: w-particle 4s ease-out infinite -2.6s; }
      `}</style>

      {/* Background */}
      <rect width="680" height="580" fill="#0f0a1f" />
      <ellipse cx="340" cy="450" rx="350" ry="220" fill="#2d1b4e" opacity="0.35" />
      <ellipse cx="340" cy="450" rx="220" ry="140" fill="#4a2882" opacity="0.3" />

      {/* Stars */}
      <circle className="w-t1" cx="80" cy="60" r="1.5" fill="#f5f3ff" />
      <circle className="w-t2" cx="140" cy="100" r="1" fill="#f5f3ff" />
      <circle className="w-t3" cx="600" cy="80" r="1.8" fill="#fef3c7" />
      <circle className="w-t1" cx="540" cy="160" r="1" fill="#f5f3ff" />
      <circle className="w-t2" cx="50" cy="190" r="1.3" fill="#f5f3ff" />
      <circle className="w-t3" cx="640" cy="220" r="1.5" fill="#fef3c7" />
      <circle className="w-t1" cx="200" cy="40" r="1" fill="#f5f3ff" />
      <circle className="w-t2" cx="450" cy="60" r="1.2" fill="#fef3c7" />
      <circle className="w-t3" cx="100" cy="270" r="1" fill="#f5f3ff" />
      <circle className="w-t1" cx="615" cy="290" r="1.2" fill="#f5f3ff" />
      <circle className="w-t2" cx="40" cy="340" r="1" fill="#fef3c7" />
      <circle className="w-t3" cx="160" cy="160" r="0.8" fill="#f5f3ff" />
      <circle className="w-t1" cx="510" cy="240" r="0.8" fill="#fef3c7" />

      {/* Moon */}
      <circle cx="555" cy="95" r="30" fill="#fef3c7" opacity="0.9" />
      <circle cx="568" cy="88" r="28" fill="#0f0a1f" />

      {/* Witch (floats) */}
      <g className="w-figure">
        {/* Long flowing hair */}
        <path d="M 282 268 Q 240 350 235 440 Q 235 510 252 565 L 298 558 Q 290 490 295 420 Q 300 340 308 280 Z" fill="#1a0d36" />
        <path d="M 398 268 Q 440 350 445 440 Q 445 510 428 565 L 382 558 Q 390 490 385 420 Q 380 340 372 280 Z" fill="#1a0d36" />

        {/* Robe */}
        <path d="M 160 580 L 245 320 L 340 305 L 435 320 L 520 580 Z" fill="#2d1b4e" />
        <path d="M 290 580 L 305 340 L 340 330 L 375 340 L 390 580 Z" fill="#1a0d36" opacity="0.55" />
        <line x1="228" y1="580" x2="270" y2="345" stroke="#1a0d36" strokeWidth="2.5" opacity="0.5" />
        <line x1="452" y1="580" x2="410" y2="345" stroke="#1a0d36" strokeWidth="2.5" opacity="0.5" />

        {/* Belt with gem */}
        <path d="M 270 370 Q 340 380 410 370 L 412 390 Q 340 400 268 390 Z" fill="#1a0d36" />
        <circle cx="340" cy="382" r="6" fill="#fbbf24" />
        <circle cx="340" cy="382" r="3" fill="#fef3c7" />

        {/* Cape collar */}
        <path d="M 235 348 Q 270 305 340 295 Q 410 305 445 348 L 428 370 Q 380 340 340 340 Q 300 340 252 370 Z" fill="#1f1140" />

        {/* Hood drapes */}
        <path d="M 252 230 Q 235 290 245 350 L 265 355 Q 280 310 295 290 Q 290 250 285 235 Z" fill="#1f1140" />
        <path d="M 428 230 Q 445 290 435 350 L 415 355 Q 400 310 385 290 Q 390 250 395 235 Z" fill="#1f1140" />

        {/* Pale face */}
        <ellipse cx="340" cy="275" rx="40" ry="48" fill="#d4c5e8" />

        {/* Hat shadow on face */}
        <path d="M 300 232 Q 340 222 380 232 L 380 268 Q 340 260 300 268 Z" fill="#08041a" opacity="0.88" />

        {/* Glowing eyes */}
        <g className="w-ey">
          <ellipse cx="325" cy="256" rx="5" ry="4.5" fill="#c084fc" />
          <ellipse cx="355" cy="256" rx="5" ry="4.5" fill="#c084fc" />
          <ellipse cx="325" cy="256" rx="2" ry="1.8" fill="#f5f3ff" />
          <ellipse cx="355" cy="256" rx="2" ry="1.8" fill="#f5f3ff" />
        </g>

        {/* Nose */}
        <path d="M 340 278 Q 335 295 339 304 L 342 304 Q 346 295 340 278 Z" fill="#b8a3d0" opacity="0.55" />

        {/* Lips */}
        <path d="M 328 314 Q 340 317 352 314 Q 348 320 340 320 Q 332 320 328 314 Z" fill="#9b6da5" />

        {/* Hair strands framing cheeks */}
        <path d="M 302 270 Q 296 305 304 340" stroke="#1a0d36" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M 378 270 Q 384 305 376 340" stroke="#1a0d36" strokeWidth="5" fill="none" strokeLinecap="round" />

        {/* Hat */}
        <ellipse cx="340" cy="226" rx="84" ry="14" fill="#0f0824" />
        <path d="M 286 220 Q 305 130 340 62 Q 355 50 358 70 Q 355 95 365 130 Q 380 175 402 220 Z" fill="#0f0824" />
        <path d="M 348 58 Q 366 58 362 78 Q 352 82 348 67 Z" fill="#1a0d36" />
        <path d="M 288 213 L 392 213 L 388 226 L 294 226 Z" fill="#6d28d9" />
        <rect x="332" y="210" width="16" height="18" fill="#fbbf24" />
        <rect x="335" y="213" width="10" height="12" fill="#0f0824" />
        <path d="M 360 175 L 363 183 L 371 183 L 365 188 L 367 196 L 360 191 L 353 196 L 355 188 L 349 183 L 357 183 Z" fill="#fbbf24" opacity="0.65" />

        {/* Sleeves */}
        <path d="M 250 360 Q 232 415 252 462 L 290 455 Q 295 410 287 365 Z" fill="#2d1b4e" />
        <path d="M 248 378 Q 238 420 252 458" stroke="#1a0d36" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M 430 360 Q 448 415 428 462 L 390 455 Q 385 410 393 365 Z" fill="#2d1b4e" />
        <path d="M 432 378 Q 442 420 428 458" stroke="#1a0d36" strokeWidth="1.5" fill="none" opacity="0.5" />

        {/* Left hand */}
        <ellipse cx="272" cy="462" rx="15" ry="18" fill="#d4c5e8" />
        <path d="M 258 450 Q 258 438 264 438 L 267 454" fill="#d4c5e8" />
        <path d="M 265 444 Q 265 432 271 432 L 274 448" fill="#d4c5e8" />
        <path d="M 274 442 Q 275 432 280 434 L 282 448" fill="#d4c5e8" />
        <line x1="264" y1="448" x2="267" y2="464" stroke="#b8a3d0" strokeWidth="1" opacity="0.5" />
        <line x1="272" y1="447" x2="274" y2="464" stroke="#b8a3d0" strokeWidth="1" opacity="0.5" />

        {/* Right hand */}
        <ellipse cx="408" cy="462" rx="15" ry="18" fill="#d4c5e8" />
        <path d="M 422 450 Q 422 438 416 438 L 413 454" fill="#d4c5e8" />
        <path d="M 415 444 Q 415 432 409 432 L 406 448" fill="#d4c5e8" />
        <path d="M 406 442 Q 405 432 400 434 L 398 448" fill="#d4c5e8" />
        <line x1="416" y1="448" x2="413" y2="464" stroke="#b8a3d0" strokeWidth="1" opacity="0.5" />
        <line x1="408" y1="447" x2="406" y2="464" stroke="#b8a3d0" strokeWidth="1" opacity="0.5" />
      </g>

      {/* Crystal ball glow */}
      <circle className="w-ga" cx="340" cy="470" r="115" fill="#a855f7" />
      <circle className="w-gb" cx="340" cy="470" r="82" fill="#c084fc" />

      {/* Stand */}
      <path d="M 300 530 L 380 530 L 368 560 L 312 560 Z" fill="#2d1b4e" />
      <path d="M 300 530 L 380 530 L 374 540 L 306 540 Z" fill="#4a2882" />
      <ellipse cx="340" cy="530" rx="40" ry="5" fill="#3d2766" />

      {/* Ball */}
      <circle cx="340" cy="470" r="62" fill="#1a0d36" />
      <g transform="translate(340 470)">
        <g className="w-m1" opacity="0.55">
          <ellipse cx="0" cy="-12" rx="38" ry="14" fill="#c084fc" />
          <ellipse cx="-8" cy="18" rx="30" ry="10" fill="#e9d5ff" />
        </g>
        <g className="w-m2" opacity="0.4">
          <ellipse cx="6" cy="0" rx="40" ry="16" fill="#a855f7" />
        </g>
      </g>
      <circle className="w-gc" cx="340" cy="470" r="44" fill="#c084fc" />
      <ellipse cx="320" cy="448" rx="14" ry="9" fill="#ffffff" opacity="0.4" transform="rotate(-30 320 448)" />
      <ellipse cx="316" cy="445" rx="5" ry="3" fill="#ffffff" opacity="0.85" />

      {/* Particles */}
      <circle className="w-p1" cx="298" cy="440" r="2" fill="#e9d5ff" />
      <circle className="w-p2" cx="348" cy="430" r="1.8" fill="#fbbf24" />
      <circle className="w-p3" cx="382" cy="445" r="2" fill="#c084fc" />
    </svg>
  );
}
