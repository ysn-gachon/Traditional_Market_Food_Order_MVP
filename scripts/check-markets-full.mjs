import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('VITE_SUPABASE_URL 또는 VITE_SUPABASE_ANON_KEY가 .env.local에 설정되어 있는지 확인하세요.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Markets with nested stores and menus:');
const { data, error } = await supabase
  .from('markets')
  .select('market_id, market_name, stores(store_id, store_name, menus(menu_id, menu_name, price, image_url, description))');

if (error) {
  console.error('쿼리 에러:', error);
  process.exit(1);
}

console.log(JSON.stringify(data, null, 2));
