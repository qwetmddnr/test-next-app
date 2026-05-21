-- Fortune App — Phase 1 데이터베이스 스키마
-- Phase 2(결제 도입) 진입 시 payments 테이블 별도 추가 예정.
--
-- 실행 방법: Supabase 대시보드 → SQL Editor → New query → 이 파일 전체 붙여넣기 → Run

-- ============================================================
-- 1. profiles — 회원 부가 정보 (auth.users와 1:1)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  nickname TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. test_results — 사용자 테스트 결과 저장
-- ============================================================
CREATE TABLE IF NOT EXISTS test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- 비로그인 허용
  test_type TEXT NOT NULL,                                     -- 'animal-face' 등
  result_id TEXT NOT NULL,                                     -- 'fox' 등
  result_data JSONB,                                           -- 응답 스냅샷 (옵션)
  share_token TEXT UNIQUE NOT NULL,                            -- 공유 URL용 토큰
  view_count INTEGER DEFAULT 0,                                -- 조회수
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_test_results_user ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_share ON test_results(share_token);
CREATE INDEX IF NOT EXISTS idx_test_results_type ON test_results(test_type);
CREATE INDEX IF NOT EXISTS idx_test_results_type_result ON test_results(test_type, result_id);

-- ============================================================
-- 3. result_stats — (test_type, result_id) 조합별 조회수 집계
-- ============================================================
-- 개별 결과 페이지(/result/[type]/[id])의 인기 추적용. 사용자별 결과(test_results)와는 별개.
CREATE TABLE IF NOT EXISTS result_stats (
  test_type TEXT NOT NULL,
  result_id TEXT NOT NULL,
  view_count BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (test_type, result_id)
);

-- 조회수 1 증가 RPC. 동시성 안전. SECURITY DEFINER로 RLS 우회 (익명 사용자도 호출 가능).
CREATE OR REPLACE FUNCTION increment_result_view(p_test_type TEXT, p_result_id TEXT)
RETURNS BIGINT
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count BIGINT;
BEGIN
  INSERT INTO result_stats (test_type, result_id, view_count, updated_at)
  VALUES (p_test_type, p_result_id, 1, NOW())
  ON CONFLICT (test_type, result_id) DO UPDATE
    SET view_count = result_stats.view_count + 1,
        updated_at = NOW()
  RETURNING view_count INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 4. test_definitions — 테스트 정의 (현재 코드에선 JSON 파일이 source of truth)
-- ============================================================
-- 추후 비개발자가 콘텐츠 추가할 수 있게 마이그레이션 가능하도록 미리 정의.
-- Phase 1에서는 빈 테이블로 유지 또는 미사용.
CREATE TABLE IF NOT EXISTS test_definitions (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  emoji TEXT,
  questions JSONB NOT NULL,
  results JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. ai_cache — Claude API 응답 캐시 (비용 절감)
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_cache (
  input_hash TEXT PRIMARY KEY,
  test_type TEXT NOT NULL,
  output TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_cache_type ON ai_cache(test_type);

-- ============================================================
-- 6. Row Level Security (RLS) 정책
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE result_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;

-- profiles: 본인만 조회/수정
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- test_results: 누구나 조회 가능 (공유 URL용), 본인 또는 비로그인이 INSERT 가능
CREATE POLICY "Anyone can view results"
  ON test_results FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own results"
  ON test_results FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- result_stats: 누구나 조회 (인기 결과 표시용), 쓰기는 RPC를 통해서만
CREATE POLICY "Anyone can view stats"
  ON result_stats FOR SELECT
  USING (true);

-- ai_cache: AI 응답은 결과 페이지에 표시되는 콘텐츠라 anon SELECT 허용. INSERT/UPDATE도 anon에 허용 (Phase 1).
-- 캐시 오염 위험 대비 input_hash가 PK라 같은 입력은 멱등. Phase 2에 service_role 분리 검토.
CREATE POLICY "Anyone can read ai_cache"
  ON ai_cache FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert ai_cache"
  ON ai_cache FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- 7. batch_jobs — 일일 운세 Anthropic Batch API 추적
-- ============================================================
CREATE TABLE IF NOT EXISTS batch_jobs (
  id BIGSERIAL PRIMARY KEY,
  target_date TEXT NOT NULL,
  batch_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  request_count INTEGER DEFAULT 0,
  inserted_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  fetched_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_batch_jobs_status ON batch_jobs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_batch_jobs_date ON batch_jobs(target_date);

ALTER TABLE batch_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read batch_jobs"
  ON batch_jobs FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert batch_jobs"
  ON batch_jobs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update batch_jobs"
  ON batch_jobs FOR UPDATE
  USING (true);

-- ============================================================
-- DONE. Table Editor에서 5개 테이블 생성 확인:
--   profiles, test_results, result_stats, test_definitions, ai_cache
-- ============================================================
