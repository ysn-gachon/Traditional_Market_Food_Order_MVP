-- Migration: create_order RPC to insert an order and its items atomically
BEGIN;

CREATE OR REPLACE FUNCTION public.create_order(
  p_user_id uuid,
  p_store_id integer,
  p_cust_phone text,
  p_cust_address text,
  p_items json
)
RETURNS json AS $$
DECLARE
  v_order_id integer;
  v_total integer;
  v_items json;
BEGIN
  -- calculate total from JSON items
  SELECT COALESCE(SUM((x->> 'unit_price')::integer * (x->> 'quantity')::integer), 0) INTO v_total
  FROM json_array_elements(p_items) AS x;

  IF v_total < 13000 THEN
    RAISE EXCEPTION 'MIN_ORDER';
  END IF;

  INSERT INTO orders(user_id, store_id, cust_phone, cust_address, total_amount, order_status)
  VALUES (p_user_id, p_store_id, p_cust_phone, p_cust_address, v_total, '입금대기')
  RETURNING order_id INTO v_order_id;

  INSERT INTO order_items(order_id, menu_id, quantity, unit_price)
  SELECT v_order_id, (x->> 'menu_id')::integer, (x->> 'quantity')::integer, (x->> 'unit_price')::integer
  FROM json_array_elements(p_items) AS x;

  SELECT json_agg(json_build_object('order_item_id', order_item_id, 'menu_id', menu_id, 'quantity', quantity, 'unit_price', unit_price))
  INTO v_items
  FROM order_items WHERE order_id = v_order_id;

  RETURN json_build_object('order_id', v_order_id, 'total_amount', v_total, 'items', COALESCE(v_items, '[]'::json));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
