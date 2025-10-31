// Node ESM script to test Supabase connection
// Usage from project root:
// npm install dotenv
// node scripts/test-supabase.mjs

import dotenv from 'dotenv';
import path from 'path';

// Load .env.local from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('VITE_SUPABASE_URL 또는 VITE_SUPABASE_ANON_KEY가 .env.local에 설정되어 있는지 확인하세요.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

try {
  console.log('Supabase에 연결 시도 중...');
  const { data, error } = await supabase.from('markets').select('*').limit(5);
  if (error) {
    console.error('쿼리 중 에러:', error);
    process.exit(1);
  }
  console.log('테이블 `markets`에서 받은 데이터 (최대 5개):');
  console.log(JSON.stringify(data, null, 2));
  console.log('연결 및 쿼리 성공.');
} catch (err) {
  console.error('예외 발생:', err);
  process.exit(1);
}
