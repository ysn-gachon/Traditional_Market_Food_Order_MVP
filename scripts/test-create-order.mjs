import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load .env.local automatically for convenience (if present).
dotenv.config({ path: '.env.local' });

async function main() {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_URL (or SUPABASE_URL) in env.');
    console.error('Set them and re-run:');
    console.error("$env:SUPABASE_SERVICE_ROLE_KEY='...'; $env:VITE_SUPABASE_URL='https://...'; node .\\scripts\\test-create-order.mjs");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // Default payload (total = 2 * 7000 = 14,000)
  const payload = {
    user_id: null,
    store_id: 1,
    cust_phone: '010-0000-0000',
    cust_address: '테스트 주소',
    items: [
      { menu_id: 1, quantity: 2, unit_price: 7000 }
    ]
  };

  try {
    const safeItems = payload.items.map(it => ({
      menu_id: Number(it.menu_id),
      quantity: Number(it.quantity),
      unit_price: Number(it.unit_price),
    }));

    const total_amount = safeItems.reduce((s, it) => s + it.unit_price * it.quantity, 0);
    const MIN_ORDER = 13000;
    if (total_amount < MIN_ORDER) {
      console.error(`Total ${total_amount} is below MIN_ORDER ${MIN_ORDER}`);
      process.exit(2);
    }

    const orderPayload = {
      user_id: payload.user_id || null,
      store_id: payload.store_id || null,
      cust_phone: payload.cust_phone,
      cust_address: payload.cust_address,
      total_amount,
      order_status: '입금대기',
    };

    console.log('Inserting order...', orderPayload);
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([orderPayload])
      .select('order_id')
      .single();

    if (orderError || !orderData) {
      console.error('Failed to create order', orderError);
      process.exit(3);
    }

    const order_id = orderData.order_id;
    const itemsPayload = safeItems.map(it => ({
      order_id,
      menu_id: it.menu_id,
      quantity: it.quantity,
      unit_price: it.unit_price,
    }));

    console.log('Inserting order_items...', itemsPayload);
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsPayload)
      .select('order_item_id,menu_id,quantity,unit_price');

    if (itemsError) {
      console.error('Failed to insert order items', itemsError);
      // attempt rollback
      await supabase.from('orders').delete().eq('order_id', order_id);
      process.exit(4);
    }

    console.log('Success! Order created:', { order_id, total_amount, items: itemsData });
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error', err);
    process.exit(10);
  }
}

main();
