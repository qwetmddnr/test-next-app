"use client";

import { useEffect } from "react";

interface AdSlotProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal";
  className?: string;
  compact?: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: object[];
  }
}

export function AdSlot({
  slot,
  format = "auto",
  className = "",
  compact = false,
}: AdSlotProps) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!adsenseClient) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense 스크립트 로드 전이면 무시
    }
  }, [adsenseClient]);

  const spacing = compact ? "my-3" : "my-6";

  if (!adsenseClient) {
    // AdSense 미승인 상태: compact 슬롯은 자리를 잡지 않음 (결과 페이지 길이 단축)
    if (compact) return null;
    return (
      <div
        className={`${spacing} flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-8 text-xs text-gray-400 ${className}`}
      >
        📺 광고 자리 (slot: {slot})
      </div>
    );
  }

  // compact: 모바일 배너 크기로 고정 (320x50). full-width-responsive=false로
  // AdSense가 화면 폭 기준으로 큰 영역을 reserve하지 않도록 막음. 광고 미채움
  // 시에는 globals.css의 [data-ad-status="unfilled"] 규칙으로 자동 collapse.
  if (compact) {
    return (
      <ins
        className={`adsbygoogle ${spacing} mx-auto block ${className}`}
        style={{ display: "block", width: 320, height: 50 }}
        data-ad-client={adsenseClient}
        data-ad-slot={slot}
      />
    );
  }

  return (
    <ins
      className={`adsbygoogle ${spacing} block ${className}`}
      style={{ display: "block" }}
      data-ad-client={adsenseClient}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
