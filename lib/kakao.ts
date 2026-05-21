// Kakao JavaScript SDK lazy loader + share helper.
// SDK is fetched only when the user opens a share sheet.
// Requires NEXT_PUBLIC_KAKAO_JS_KEY; without it, isKakaoConfigured() returns false
// and the UI should hide the Kakao option.

const SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";
const SDK_INTEGRITY =
  "sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka";

type KakaoGlobal = {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Share?: {
    sendScrap: (opts: { requestUrl: string; templateId?: number }) => void;
  };
};

declare global {
  interface Window {
    Kakao?: KakaoGlobal;
  }
}

let loadingPromise: Promise<void> | null = null;

export function isKakaoConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
}

export function loadKakaoSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!isKakaoConfigured()) return Promise.reject(new Error("KAKAO_KEY_MISSING"));
  if (window.Kakao && window.Kakao.isInitialized()) return Promise.resolve();
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-sdk="1"]'
    );
    const onReady = () => {
      try {
        const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY!;
        if (window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init(key);
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    };

    if (existing) {
      if (window.Kakao) {
        onReady();
      } else {
        existing.addEventListener("load", onReady, { once: true });
        existing.addEventListener(
          "error",
          () => reject(new Error("KAKAO_SDK_LOAD_FAILED")),
          { once: true }
        );
      }
      return;
    }

    const script = document.createElement("script");
    script.src = SDK_URL;
    script.integrity = SDK_INTEGRITY;
    script.crossOrigin = "anonymous";
    script.async = true;
    script.dataset.kakaoSdk = "1";
    script.onload = onReady;
    script.onerror = () => {
      loadingPromise = null;
      reject(new Error("KAKAO_SDK_LOAD_FAILED"));
    };
    document.body.appendChild(script);
  });

  return loadingPromise;
}

export async function shareToKakaoScrap(absoluteUrl: string): Promise<void> {
  await loadKakaoSdk();
  if (typeof window === "undefined" || !window.Kakao?.Share) {
    throw new Error("KAKAO_SHARE_UNAVAILABLE");
  }
  window.Kakao.Share.sendScrap({ requestUrl: absoluteUrl });
}
