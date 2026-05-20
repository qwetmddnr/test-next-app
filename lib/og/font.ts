const PRETENDARD_OTF_URL =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.otf";

export const OG_FONT_NAME = "Pretendard";

export async function loadPretendard(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(PRETENDARD_OTF_URL);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export const OG_BG =
  "linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #fff7ed 100%)";

export const OG_FONT_FAMILY = "Pretendard, system-ui, sans-serif";
