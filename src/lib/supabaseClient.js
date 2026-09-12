import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // 값이 없으면 로그인/업로드가 동작하지 않습니다. .env.local 을 확인하세요.
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 가 비어 있습니다. .env.local 을 확인하고 dev 서버를 재시작하세요."
  );
}

// 이 클라이언트는 anon(public) 키만 사용합니다. 보안은 Supabase 의
// RLS / Storage 정책과 '가입 비활성화' 설정에 의존합니다.
export const supabase = createClient(url ?? "", anonKey ?? "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export const MEDIA_BUCKET = "media";
// 파일별 제목/설명을 저장하는 테이블 (Storage 오브젝트엔 이런 필드가 없어서 별도 관리)
export const MEDIA_TABLE = "media";
