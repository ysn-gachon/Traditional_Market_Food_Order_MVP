import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// API: POST /api/create-order
// Body (JSON):
// {
//   user_id?: string,           -- optional auth user id
//   store_id?: number,          -- optional store id (recommended)
//   cust_phone: string,
//   cust_address: string,
//   items: [ { menu_id: number, quantity: number, unit_price: number } ]
// }

// Note: This endpoint MUST be deployed with environment variables:
//   SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (service role) set in Vercel.
// Do NOT expose SUPABASE_SERVICE_ROLE_KEY to the client. The frontend should call this API.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    res.status(500).json({ error: 'Supabase configuration missing on server.' });
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });

  try {
    const body = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    const { user_id, store_id, cust_phone, cust_address, items } = body;

    if (!cust_phone || !cust_address || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Invalid payload. Require cust_phone, cust_address and non-empty items array.' });
      return;
    }

    // Validate items
    const safeItems = items.map((it: any) => ({
      menu_id: Number(it.menu_id),
      quantity: Number(it.quantity),
      unit_price: Number(it.unit_price)
    }));

    for (const it of safeItems) {
      if (!it.menu_id || !it.quantity || it.quantity <= 0 || !Number.isFinite(it.unit_price)) {
        res.status(400).json({ error: 'Invalid item structure: menu_id, quantity (>0), unit_price required.' });
        return;
      }
    }

    const total_amount = safeItems.reduce((s: number, it: any) => s + it.unit_price * it.quantity, 0);

    // Enforce minimum order amount on the server-side to prevent client-side bypass
    const MIN_ORDER = 13000;
    if (total_amount < MIN_ORDER) {
      res.status(400).json({ error: `최소 주문금액은 ${MIN_ORDER.toLocaleString()}원 입니다. 현재 총액: ${total_amount.toLocaleString()}원` });
      return;
    }

    // Try using a DB RPC function (create_order) to perform an atomic insert.
    // If the RPC doesn't exist or fails, fall back to the previous insert+rollback behavior.
    try {
      // supabase.rpc expects named parameters matching the function signature
      const { data: rpcData, error: rpcError } = await supabase.rpc('create_order', {
        p_user_id: user_id || null,
        p_store_id: store_id || null,
        p_cust_phone: cust_phone,
        p_cust_address: cust_address,
        p_items: JSON.stringify(safeItems)
      });

      if (rpcError) {
        // If function missing or other error, fall back
        // Postgres user-defined exception for MIN_ORDER will come through here
        if (String(rpcError.message || rpcError).includes('MIN_ORDER')) {
          res.status(400).json({ error: `최소 주문금액은 ${MIN_ORDER.toLocaleString()}원 입니다. 현재 총액: ${total_amount.toLocaleString()}원` });
          return;
        }
        // otherwise, continue to fallback
        // (we intentionally don't return here)
        console.warn('RPC create_order failed, falling back to client-side inserts', rpcError);
      } else if (rpcData) {
        // rpcData is expected to be JSON object { order_id, total_amount, items }
        res.status(201).json(rpcData as any);
        return;
      }
    } catch (rpcEx: any) {
      // ignore and fall back
      console.warn('create_order RPC call error, falling back:', String(rpcEx?.message || rpcEx));
    }

    // Fallback: previous behavior (insert order, then insert items, rollback on failure)
    const orderPayload: any = {
      user_id: user_id || null,
      store_id: store_id || null,
      cust_phone,
      cust_address,
      total_amount,
      order_status: '입금대기'
    };

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([orderPayload])
      .select('order_id')
      .single();

    if (orderError || !orderData) {
      res.status(500).json({ error: 'Failed to create order', details: orderError });
      return;
    }

    const order_id = orderData.order_id;

    // Prepare order_items payload
    const itemsPayload = safeItems.map((it: any) => ({
      order_id,
      menu_id: it.menu_id,
      quantity: it.quantity,
      unit_price: it.unit_price
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsPayload)
      .select('order_item_id,menu_id,quantity,unit_price');

    if (itemsError) {
      // Attempt to rollback by deleting the order we created
      await supabase.from('orders').delete().eq('order_id', order_id);
      res.status(500).json({ error: 'Failed to insert order items', details: itemsError });
      return;
    }

    // Success
    res.status(201).json({ order_id, total_amount, items: itemsData });
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', details: String(err.message || err) });
  }
}
