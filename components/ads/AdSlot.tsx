"use client";

import { useEffect } from "react";

interface AdSlotProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: object[];
  }
}

export function AdSlot({ slot, format = "auto", className = "" }: AdSlotProps) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!adsenseClient) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense 스크립트 로드 전이면 무시
    }
  }, [adsenseClient]);

  if (!adsenseClient) {
    return (
      <div
        className={`my-6 flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-8 text-xs text-gray-400 ${className}`}
      >
        📺 광고 자리 (slot: {slot})
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle my-6 block ${className}`}
      style={{ display: "block" }}
      data-ad-client={adsenseClient}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
