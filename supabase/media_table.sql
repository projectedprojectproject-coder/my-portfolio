-- 미디어 파일별 제목/설명 메타데이터 테이블
-- Supabase 대시보드 → SQL Editor 에서 한 번 실행하세요.

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,        -- storage.objects 의 'media' 버킷 내 파일 경로
  title text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.media enable row level security;

-- 읽기: 누구나 (나중에 포트폴리오 화면에 표시할 수 있도록)
create policy "media_meta_select_public"
  on public.media for select
  to anon, authenticated
  using (true);

-- 쓰기/수정/삭제: 로그인한 관리자만
create policy "media_meta_insert_authenticated"
  on public.media for insert
  to authenticated
  with check (true);

create policy "media_meta_update_authenticated"
  on public.media for update
  to authenticated
  using (true)
  with check (true);

create policy "media_meta_delete_authenticated"
  on public.media for delete
  to authenticated
  using (true);
