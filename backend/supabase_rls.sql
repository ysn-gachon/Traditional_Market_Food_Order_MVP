-- Supabase RLS / Policy templates for Traditional Market Food Order MVP
-- 실행 순서: 이 파일을 Supabase Studio > SQL Editor에 붙여넣고 순서대로 실행하세요.
-- 주의: service_role 키는 절대 클라이언트에 노출하지 마세요.

-- 1) 권장: admins 테이블에 Supabase Auth UID 연결 (선택)
ALTER TABLE admins
  ADD COLUMN IF NOT EXISTS auth_uid uuid UNIQUE;

-- 2) (선택) orders 테이블에 user_id 컬럼 추가하여 주문 소유자 추적
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3) 관리자 판별 함수 (Auth 기반)
-- auth.uid()는 현재 요청한 사용자의 uid를 반환합니다.
CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean
LANGUAGE sql STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE auth_uid = auth.uid());
$$;

-- 4) RLS 활성화 및 기본 정책
-- markets/stores/menus: 공개 읽기 허용
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_select_markets" ON markets FOR SELECT USING (true);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_select_stores" ON stores FOR SELECT USING (true);

ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_select_menus" ON menus FOR SELECT USING (true);

-- site_visits: insert는 익명으로 허용(옵션) / 조회는 관리자 전용
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert_site_visits" ON site_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_select_site_visits" ON site_visits FOR SELECT USING (is_admin());

-- 5) orders 테이블 정책 예시
-- 옵션 A (권장): 인증된 사용자만 주문 생성 가능, 자신의 주문만 조회/수정 가능. 관리자(예: is_admin())는 모든 주문에 접근 가능.
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- INSERT: 인증된 사용자만, 그리고 NEW.user_id는 auth.uid()와 같아야 함
CREATE POLICY "auth_insert_orders" ON orders FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
  AND (user_id IS NOT DISTINCT FROM auth.uid())
);

-- SELECT: 주문 소유자 또는 관리자만
CREATE POLICY "owner_or_admin_select_orders" ON orders FOR SELECT USING (
  (user_id IS NOT NULL AND user_id = auth.uid())
  OR is_admin()
);

-- UPDATE: 소유자(주문 상태 변경 제한 가능) 또는 관리자
CREATE POLICY "owner_or_admin_update_orders" ON orders FOR UPDATE USING (
  (user_id IS NOT NULL AND user_id = auth.uid())
  OR is_admin()
) WITH CHECK (
  (user_id IS NOT NULL AND user_id = auth.uid())
  OR is_admin()
);

-- DELETE: 관리자만
CREATE POLICY "admin_delete_orders" ON orders FOR DELETE USING (is_admin());

-- 6) admins 테이블 접근 제어
-- admins 테이블 자체는 매우 민감하므로 기본적으로는 RLS로 보호하고,
-- 관리자 본인(자기 계정) 또는 service_role(백엔드)만 접근 가능하도록 설정합니다.
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- SELECT: 본인(자신의 auth_uid) 또는 is_admin() (관리자가 자신을 조회할 때 허용)
CREATE POLICY "self_or_admin_select_admins" ON admins FOR SELECT USING (
  (auth_uid IS NOT NULL AND auth_uid = auth.uid())
  OR is_admin()
);

-- INSERT: 일반적으로는 service_role이나 서버측에서만 수행(익명/인증 사용자에 허용하지 않음)
CREATE POLICY "service_insert_admins" ON admins FOR INSERT WITH CHECK (false);

-- UPDATE/DELETE: 관리자 자신 또는 서버
CREATE POLICY "self_or_admin_update_admins" ON admins FOR UPDATE USING (
  (auth_uid IS NOT NULL AND auth_uid = auth.uid())
  OR is_admin()
);
CREATE POLICY "self_or_admin_delete_admins" ON admins FOR DELETE USING (
  (auth_uid IS NOT NULL AND auth_uid = auth.uid())
  OR is_admin()
);

-- 7) 유틸리티: RLS 적용 확인 쿼리(Studio에서 확인 가능)
-- SELECT * FROM pg_policy WHERE polrelid = 'orders'::regclass;

-- 8) 주의 및 팁
-- - 위 정책은 시작점 템플릿입니다. 실제 운영 전 테스트(특히 익명 주문/주문 수정 동작)를 꼭 하세요.
-- - 익명 주문을 허용하려면 `auth.uid()` 조건을 제거하거나, anon 사용자를 위한 별도 정책을 만드세요. 하지만 봇/악용 방지(예: CAPTCHA)가 필요합니다.
-- - 관리자 계정 관리는 Supabase Auth를 사용해 `admins.auth_uid`를 채우는 방식(권장)을 권합니다.
-- - service_role 키는 관리자용 백엔드에서만 사용하세요. service_role 사용 시 RLS를 우회하여 모든 작업 가능.

-- 파일 끝
