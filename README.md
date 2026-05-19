# 오늘의 나 — 운세 & 재미 테스트 플랫폼

운세(타로/사주/MBTI)와 재미 테스트(동물상/전생/연애 유형)를 한 곳에서 즐길 수 있는 AI 기반 한국어 플랫폼.

- **현재 단계**: Phase 1 — 광고(AdSense + 쿠팡파트너스) 단독 운영
- **추후 단계**: Phase 2 — 사업자등록 + 결제 모듈 도입 후 심화 콘텐츠 유료화

---

## 기술 스택

| 영역 | 선택 |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| 스타일링 | Tailwind CSS v4 + Framer Motion |
| 데이터베이스 | Supabase (PostgreSQL + Auth) — Phase 2부터 사용 |
| AI | Claude API (Sonnet 4.6) — 운세 텍스트 생성 + ai_cache 캐싱 |
| 폰트 | Pretendard (CDN) |
| 광고 | Google AdSense + 쿠팡 파트너스 |
| 분석 | GA4 + Microsoft Clarity |
| OG 이미지 | next/og (Pretendard 임베드, 1200×630) |
| 배포 | Vercel |

## 콘텐츠 현황

- 🐶 **동물상 테스트** — 12문항 / 결과 16종
- ⏳ **전생 직업 테스트** — 10문항 / 결과 14종
- 💕 **연애 유형 테스트** — 15문항 / 결과 8종
- 🃏 타로 / ☯️ 사주 / 🧬 MBTI 심화 — 예정

총 38개 결과 페이지가 SSG로 미리 렌더링되며, 각각 동적 OG 이미지가 자동 생성됩니다.

## 로컬 실행

```bash
npm install
cp .env.local.example .env.local   # 환경변수 채우기
npm run dev                         # http://localhost:3000
```

## 환경변수

`.env.local.example` 참고. 주요 항목:

| 키 | 용도 | 비워두면 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | sitemap/OG 절대 URL | localhost로 처리 |
| `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` | Supabase (Phase 2) | DB 기능 비활성 |
| `ANTHROPIC_API_KEY` | Claude API (서버 전용) | 운세 텍스트 생성 비활성 |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense | 광고 자리에 placeholder 표시 |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 | 분석 비활성 |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity | 히트맵 비활성 |

> ⚠️ `ANTHROPIC_API_KEY`는 `NEXT_PUBLIC_` 접두사 **금지** — 서버 전용 비밀키.

## 새 테스트 추가하기

`data/tests/<slug>.json` 작성 후 `lib/test/loader.ts`에 import 한 줄만 추가하면 됩니다.

```ts
import myTest from "@/data/tests/my-test.json";

const TESTS: Record<string, TestDefinition> = {
  // ...기존
  "my-test": myTest as unknown as TestDefinition,
};
```

추가 즉시 활성화되는 것들:
- `/tests/my-test` 진행 페이지
- `/result/my-test/[resultId]` 결과 페이지 (SSG)
- `/result/my-test/[resultId]/opengraph-image` 동적 OG
- `sitemap.xml`에 자동 포함
- 다른 테스트 결과 페이지 하단 **"이 테스트도 해볼래?"** 카드에 자동 표시

JSON 스키마는 `lib/types/test.ts` 참고.

## Vercel 배포

1. **GitHub repo 생성** (private 권장)
2. 로컬에서 push:
   ```bash
   git remote add origin https://github.com/USER/REPO.git
   git branch -M main
   git push -u origin main
   ```
3. **Vercel** → New Project → GitHub repo import
4. **Environment Variables** 섹션에 `.env.local.example`의 키들 추가
5. Deploy

배포 후 발급되는 URL을 `NEXT_PUBLIC_SITE_URL`로 다시 설정 → Redeploy.

## 광고/분석 활성화

- **AdSense 신청 전 체크리스트**: 콘텐츠 충분(✅ 38결과), 약관/개인정보(✅), sitemap(✅), 메타데이터(✅) 갖춰져 있음
- 승인 후 발급된 `ca-pub-XXXXX`를 `NEXT_PUBLIC_ADSENSE_CLIENT`에 입력
- AdSense 광고 단위별 slot ID는 `components/ads/AdSlot.tsx` 호출부의 `slot` prop 변경

## 폴더 구조

```
fortune-app/
├── app/
│   ├── result/[type]/[id]/   # 결과 페이지 + OG 이미지
│   ├── tests/[slug]/         # 테스트 진행 페이지 (동적 슬러그)
│   ├── privacy/              # 개인정보처리방침
│   ├── terms/                # 이용약관
│   ├── sitemap.ts            # 자동 sitemap.xml
│   └── robots.ts             # robots.txt
├── components/
│   ├── ads/AdSlot.tsx        # AdSense 슬롯 (env 없으면 placeholder)
│   ├── analytics/Analytics.tsx  # GA4 + Clarity + AdSense 로더
│   ├── result/               # ResultView, ShareButton
│   ├── test/TestRunner.tsx   # 공통 테스트 진행 컴포넌트
│   └── layout/Footer.tsx     # 법적 링크 푸터
├── data/tests/               # 테스트 JSON 콘텐츠
└── lib/
    ├── ai/claude.ts          # Claude API + ai_cache
    ├── motion/variants.ts    # Framer Motion 프리셋
    ├── supabase/             # client.ts, server.ts
    ├── test/                 # calculate.ts, loader.ts
    └── types/test.ts
```

## 라이선스

비공개 프로젝트.
