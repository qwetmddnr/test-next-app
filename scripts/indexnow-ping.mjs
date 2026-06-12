// IndexNow 자동 핑 — Vercel production 빌드 직후 실행 (package.json build 스크립트 체인).
// 새 매거진 글 + 주요 페이지 URL을 IndexNow(Bing/Yandex 등)에 통지해 빠른 재크롤을 유도한다.
//
// - 키는 비밀이 아님: public/<KEY>.txt 로 공개 호스팅되며 IndexNow가 이를 fetch해 소유권을 검증.
// - preview/로컬 빌드(VERCEL_ENV != production)에서는 skip — production URL을 잘못 통지하지 않도록.
// - 어떤 에러도 빌드를 깨지 않도록 항상 비치명적으로 처리 (exit 0).
//
// 참고: IndexNow는 핑 직후가 아니라 이후에 크롤하므로, 빌드 시점(배포 직전) 통지여도
// 실제 크롤 시점엔 URL이 라이브 상태가 된다. 단, 키 파일 자체가 처음 라이브되는 첫 배포에선
// 검증(키 파일 fetch)이 실패할 수 있어 최초 1회는 배포 후 수동 핑으로 보완한다.

import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const KEY = "c5013b60fc8e6b79b782781bb5f5437d"; // == public/<KEY>.txt
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function main() {
  if (process.env.VERCEL_ENV !== "production") {
    console.log("[indexnow] skip — VERCEL_ENV != production");
    return;
  }

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://ohna.today"
  ).replace(/\/$/, "");

  let host;
  try {
    host = new URL(siteUrl).host;
  } catch {
    host = "ohna.today";
  }

  // 매거진 글 slug는 data/articles/*.ts 파일명에서 그대로 도출 (파일 1개 = slug 1개).
  const here = dirname(fileURLToPath(import.meta.url));
  const articlesDir = join(here, "..", "data", "articles");

  let articleSlugs = [];
  try {
    articleSlugs = readdirSync(articlesDir)
      .filter((f) => f.endsWith(".ts"))
      .map((f) => f.replace(/\.ts$/, ""));
  } catch (err) {
    console.warn(
      `[indexnow] could not read articles dir (non-fatal): ${err?.message || err}`
    );
  }

  const staticPaths = ["/", "/tests", "/magazine", "/about", "/faq"];
  const urlList = [
    ...staticPaths.map((p) => `${siteUrl}${p}`),
    ...articleSlugs.map((s) => `${siteUrl}/magazine/${s}`),
  ];

  const body = {
    host,
    key: KEY,
    keyLocation: `${siteUrl}/${KEY}.txt`,
    urlList,
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    console.log(
      `[indexnow] submitted ${urlList.length} urls -> ${res.status} ${res.statusText}`
    );
  } catch (err) {
    console.warn(`[indexnow] ping failed (non-fatal): ${err?.message || err}`);
  }
}

main().catch((e) =>
  console.warn(`[indexnow] error (non-fatal): ${e?.message || e}`)
);
