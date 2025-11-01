import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// prefer .env.local (Vite uses .env.local); fall back to default .env
dotenv.config({ path: '.env.local' });

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false }
});

async function ensureMarket(name) {
  const { data: existing, error: selectErr } = await supabase
    .from('markets')
    .select('market_id')
    .eq('market_name', name)
    .limit(1);
  if (selectErr) {
    console.error('Select error for', name, selectErr.message || selectErr);
    return;
  }
  if (existing && existing.length > 0) {
    console.log(`${name} already exists (market_id=${existing[0].market_id}). Skipping insert.`);
    return;
  }
  const { data, error } = await supabase
    .from('markets')
    .insert([{ market_name: name }]);
  if (error) {
    console.error('Insert error for', name, error.message || error);
    return;
  }
  console.log('Inserted market', name, data);
}

(async () => {
  await ensureMarket('성남중앙공설시장');
  await ensureMarket('현대시장');
  process.exit(0);
})();
