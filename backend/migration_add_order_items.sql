-- Migration: Add order_items table and adapt orders for cart-style orders
-- Creates order_items to store per-order line items (menu + quantity + unit_price)
-- Adds total_amount and store_id to orders and a trigger to keep total_amount in sync.

BEGIN;

-- 1) Add store_id and total_amount to orders (if not present)
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS store_id integer REFERENCES stores(store_id) ON DELETE SET NULL;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS total_amount integer NOT NULL DEFAULT 0;

-- 2) Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  order_item_id serial PRIMARY KEY,
  order_id integer REFERENCES orders(order_id) ON DELETE CASCADE,
  menu_id integer REFERENCES menus(menu_id) ON DELETE SET NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_id ON order_items(menu_id);

-- 3) Trigger function to recalculate orders.total_amount
CREATE OR REPLACE FUNCTION recalc_order_total()
RETURNS TRIGGER AS $$
BEGIN
  -- Determine affected order id (NEW for insert/update, OLD for delete)
  UPDATE orders
  SET total_amount = COALESCE((
    SELECT SUM(unit_price * quantity) FROM order_items WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
  ), 0)
  WHERE order_id = COALESCE(NEW.order_id, OLD.order_id);

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Attach triggers to keep totals in sync
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'order_items_recalc_total') THEN
    EXECUTE 'CREATE TRIGGER order_items_recalc_total AFTER INSERT OR UPDATE OR DELETE ON order_items FOR EACH ROW EXECUTE PROCEDURE recalc_order_total();';
  END IF;
END$$;

-- 4) Row-level security for order_items: allow authenticated inserts; selection/update/delete limited to owner or admin
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS auth_insert_order_items ON order_items;
CREATE POLICY auth_insert_order_items ON order_items FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);

DROP POLICY IF EXISTS owner_or_admin_select_order_items ON order_items;
CREATE POLICY owner_or_admin_select_order_items ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders o WHERE o.order_id = order_items.order_id AND (
      (o.user_id IS NOT NULL AND o.user_id = auth.uid()) OR is_admin()
    )
  )
);

DROP POLICY IF EXISTS owner_or_admin_update_order_items ON order_items;
CREATE POLICY owner_or_admin_update_order_items ON order_items FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM orders o WHERE o.order_id = order_items.order_id AND (
      (o.user_id IS NOT NULL AND o.user_id = auth.uid()) OR is_admin()
    )
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders o WHERE o.order_id = order_items.order_id AND (
      (o.user_id IS NOT NULL AND o.user_id = auth.uid()) OR is_admin()
    )
  )
);

DROP POLICY IF EXISTS owner_or_admin_delete_order_items ON order_items;
CREATE POLICY owner_or_admin_delete_order_items ON order_items FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM orders o WHERE o.order_id = order_items.order_id AND (
      (o.user_id IS NOT NULL AND o.user_id = auth.uid()) OR is_admin()
    )
  )
);

COMMIT;

-- Notes:
-- 1) This migration keeps existing orders.menu_id column for backward compatibility but adds order_items
--    so multi-item orders are supported.
-- 2) When creating orders from the frontend, create the order row (with user_id/store_id if available)
--    and then insert multiple order_items rows linked to that order_id. The trigger will update total_amount.
-- 3) For server-side operations (e.g., inserting orders + items atomically), prefer using a serverless
--    function with the SUPABASE_SERVICE_ROLE_KEY to bypass RLS if necessary.
