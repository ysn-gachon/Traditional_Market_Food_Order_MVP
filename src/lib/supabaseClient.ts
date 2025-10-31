import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // 개발 중에 환경변수가 없으면 콘솔 경고 (운영 중에는 환경변수를 반드시 설정하세요)
  // Vite는 import.meta.env를 사용하므로 .env 파일에 VITE_ 접두사로 설정해야 합니다.
  // 예: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
  // 이 경고는 빌드 시 제거됩니다.
  // eslint-disable-next-line no-console
  console.warn('VITE_SUPABASE_URL 또는 VITE_SUPABASE_ANON_KEY가 설정되어 있지 않습니다. .env 파일을 확인하세요.');
}

export const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_ANON_KEY ?? '');
