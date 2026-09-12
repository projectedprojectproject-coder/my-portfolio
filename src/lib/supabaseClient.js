import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  // 값이 없으면 로그인/업로드가 동작하지 않습니다. .env.local (로컬) 또는
  // Vercel 프로젝트의 Environment Variables (배포) 를 확인하세요.
  // 자리표시자 URL로 폴백하는 이유: createClient 가 빈 문자열이면 즉시
  // 예외를 던져서 이 모듈을 import 하는 화면 전체가 깨진다 — /admin 이
  // 아니라 포트폴리오 홈까지 하얗게 죽는 사고가 실제로 있었다.
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 가 비어 있습니다. 관리자 로그인/업로드가 동작하지 않습니다."
  );
}

// 이 클라이언트는 anon(public) 키만 사용합니다. 보안은 Supabase 의
// RLS / Storage 정책과 '가입 비활성화' 설정에 의존합니다.
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);

export const MEDIA_BUCKET = "media";
// 파일별 제목/설명을 저장하는 테이블 (Storage 오브젝트엔 이런 필드가 없어서 별도 관리)
export const MEDIA_TABLE = "media";
