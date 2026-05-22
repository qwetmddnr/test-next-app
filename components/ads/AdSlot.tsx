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
    return (
      <div
        className={`${spacing} flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 ${
          compact ? "py-2 text-[10px]" : "py-8 text-xs"
        } text-gray-400 ${className}`}
      >
        📺 광고 자리 (slot: {slot})
      </div>
    );
  }

  const effectiveFormat = compact ? "horizontal" : format;

  return (
    <ins
      className={`adsbygoogle ${spacing} block ${className}`}
      style={
        compact
          ? { display: "block", minHeight: 60 }
          : { display: "block" }
      }
      data-ad-client={adsenseClient}
      data-ad-slot={slot}
      data-ad-format={effectiveFormat}
      data-full-width-responsive="true"
    />
  );
}
