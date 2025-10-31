-- supabase_full_setup_no_auth_fk.sql
-- auth.users에 대한 FK 참조를 제거한 보수적 버전
-- 스테이징에서 권장: auth.users FK로 인한 권한/스키마 이슈를 회피하기 위함

-- 1) 테이블 생성
CREATE TABLE IF NOT EXISTS admins (
  admin_id serial PRIMARY KEY,
  username varchar(255) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  contact varchar(20) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS markets (
  market_id serial PRIMARY KEY,
  market_name varchar(255) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stores (
  store_id serial PRIMARY KEY,
  market_id integer REFERENCES markets(market_id) ON DELETE CASCADE,
  store_name varchar(255) NOT NULL,
  min_order_amount integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS menus (
  menu_id serial PRIMARY KEY,
  store_id integer REFERENCES stores(store_id) ON DELETE CASCADE,
  menu_name varchar(255) NOT NULL,
  price integer NOT NULL,
  image_url varchar(255),
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  order_id serial PRIMARY KEY,
  menu_id integer REFERENCES menus(menu_id) ON DELETE SET NULL,
  cust_phone varchar(20) NOT NULL,
  cust_address varchar(255) NOT NULL,
  order_status varchar(20) NOT NULL DEFAULT '입금대기',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_visits (
  visit_id serial PRIMARY KEY,
  visit_timestamp timestamptz NOT NULL DEFAULT now(),
  ip_address varchar(50)
);

CREATE INDEX IF NOT EXISTS idx_stores_market_id ON stores(market_id);
CREATE INDEX IF NOT EXISTS idx_menus_store_id ON menus(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_menu_id ON orders(menu_id);

-- 2) timestamp trigger 함수 및 트리거
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성 (존재하지 않으면 생성)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp') THEN
    EXECUTE 'CREATE TRIGGER set_timestamp BEFORE UPDATE ON admins FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_stores') THEN
    EXECUTE 'CREATE TRIGGER set_timestamp_stores BEFORE UPDATE ON stores FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_menus') THEN
    EXECUTE 'CREATE TRIGGER set_timestamp_menus BEFORE UPDATE ON menus FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_markets') THEN
    EXECUTE 'CREATE TRIGGER set_timestamp_markets BEFORE UPDATE ON markets FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_orders') THEN
    EXECUTE 'CREATE TRIGGER set_timestamp_orders BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_site_visits') THEN
    EXECUTE 'CREATE TRIGGER set_timestamp_site_visits BEFORE UPDATE ON site_visits FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();';
  END IF;
END$$;

-- 3) 컬럼 추가: auth 연동 컬럼은 FK 없이 생성
ALTER TABLE admins
  ADD COLUMN IF NOT EXISTS auth_uid uuid UNIQUE;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS user_id uuid;

-- 4) 관리자 판별 함수
CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean
LANGUAGE sql STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE auth_uid = auth.uid());
$$;

-- 5) RLS 활성화 및 정책
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_select_markets ON markets;
CREATE POLICY public_select_markets ON markets FOR SELECT USING (true);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_select_stores ON stores;
CREATE POLICY public_select_stores ON stores FOR SELECT USING (true);

ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_select_menus ON menus;
CREATE POLICY public_select_menus ON menus FOR SELECT USING (true);

ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_insert_site_visits ON site_visits;
CREATE POLICY public_insert_site_visits ON site_visits FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS admin_select_site_visits ON site_visits;
CREATE POLICY admin_select_site_visits ON site_visits FOR SELECT USING (is_admin());

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS auth_insert_orders ON orders;
CREATE POLICY auth_insert_orders ON orders FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
  AND (user_id IS NOT DISTINCT FROM auth.uid())
);

DROP POLICY IF EXISTS owner_or_admin_select_orders ON orders;
CREATE POLICY owner_or_admin_select_orders ON orders FOR SELECT USING (
  (user_id IS NOT NULL AND user_id = auth.uid())
  OR is_admin()
);

DROP POLICY IF EXISTS owner_or_admin_update_orders ON orders;
CREATE POLICY owner_or_admin_update_orders ON orders FOR UPDATE USING (
  (user_id IS NOT NULL AND user_id = auth.uid())
  OR is_admin()
) WITH CHECK (
  (user_id IS NOT NULL AND user_id = auth.uid())
  OR is_admin()
);

DROP POLICY IF EXISTS admin_delete_orders ON orders;
CREATE POLICY admin_delete_orders ON orders FOR DELETE USING (is_admin());

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS self_or_admin_select_admins ON admins;
CREATE POLICY self_or_admin_select_admins ON admins FOR SELECT USING (
  (auth_uid IS NOT NULL AND auth_uid = auth.uid())
  OR is_admin()
);

DROP POLICY IF EXISTS service_insert_admins ON admins;
CREATE POLICY service_insert_admins ON admins FOR INSERT WITH CHECK (false);

DROP POLICY IF EXISTS self_or_admin_update_admins ON admins;
CREATE POLICY self_or_admin_update_admins ON admins FOR UPDATE USING (
  (auth_uid IS NOT NULL AND auth_uid = auth.uid())
  OR is_admin()
);
DROP POLICY IF EXISTS self_or_admin_delete_admins ON admins;
CREATE POLICY self_or_admin_delete_admins ON admins FOR DELETE USING (
  (auth_uid IS NOT NULL AND auth_uid = auth.uid())
  OR is_admin()
);

-- 검증용 쿼리
-- SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public';
-- SELECT * FROM pg_policy WHERE polrelid = 'orders'::regclass;
