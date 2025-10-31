-- Supabase / Postgres migration SQL generated from backend/dbspec.md
-- Run this in Supabase SQL editor (Studio > SQL Editor) or via psql/supabase CLI

-- Table: admins
CREATE TABLE IF NOT EXISTS admins (
  admin_id serial PRIMARY KEY,
  username varchar(255) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  contact varchar(20) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table: markets
CREATE TABLE IF NOT EXISTS markets (
  market_id serial PRIMARY KEY,
  market_name varchar(255) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table: stores
CREATE TABLE IF NOT EXISTS stores (
  store_id serial PRIMARY KEY,
  market_id integer REFERENCES markets(market_id) ON DELETE CASCADE,
  store_name varchar(255) NOT NULL,
  min_order_amount integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table: menus
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

-- Table: orders
CREATE TABLE IF NOT EXISTS orders (
  order_id serial PRIMARY KEY,
  menu_id integer REFERENCES menus(menu_id) ON DELETE SET NULL,
  cust_phone varchar(20) NOT NULL,
  cust_address varchar(255) NOT NULL,
  order_status varchar(20) NOT NULL DEFAULT '입금대기',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table: site_visits
CREATE TABLE IF NOT EXISTS site_visits (
  visit_id serial PRIMARY KEY,
  visit_timestamp timestamptz NOT NULL DEFAULT now(),
  ip_address varchar(50)
);

-- Indexes (optional)
CREATE INDEX IF NOT EXISTS idx_stores_market_id ON stores(market_id);
CREATE INDEX IF NOT EXISTS idx_menus_store_id ON menus(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_menu_id ON orders(menu_id);

-- Example RLS setup (BE CAREFUL: policies below open access; adapt for production)
-- Enable RLS on tables you want to control via policies
-- ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
--
-- Example: allow anyone (anon) to SELECT markets/stores/menus
-- CREATE POLICY "Public read" ON markets FOR SELECT USING (true);
-- CREATE POLICY "Public read" ON stores FOR SELECT USING (true);
-- CREATE POLICY "Public read" ON menus FOR SELECT USING (true);
--
-- Example: allow anonymous users to INSERT orders (if you choose to have open ordering)
-- CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
--
-- Recommended: Use Supabase Auth and restrict write/update operations to authenticated users
-- For admin-only operations, require a specific claim or use service_role from a trusted backend.

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON admins
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_stores
BEFORE UPDATE ON stores
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_menus
BEFORE UPDATE ON menus
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_markets
BEFORE UPDATE ON markets
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_orders
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_site_visits
BEFORE UPDATE ON site_visits
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
