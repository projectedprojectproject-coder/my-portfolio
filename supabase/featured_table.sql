-- 소개 아래에 들어가는 "추천" 썸네일 카드 그리드.
-- 카드 하나 = 썸네일 사진 + 썸네일 글 + 하이퍼링크(클릭하면 이동).
-- Supabase 대시보드 → SQL Editor 에서 한 번 실행하세요.
-- 비어 있으면 이 섹션은 그냥 화면에 안 나타납니다(깨지지 않음).

create table if not exists public.featured (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  photo_url text,
  text text,     -- 첫 줄 = 큰 제목, 나머지 줄 = 작은 캡션
  link text,      -- "#research" 같은 섹션 이동이나 외부 URL 모두 가능
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.featured enable row level security;

create policy "featured_select_public"
  on public.featured for select
  to anon, authenticated
  using (true);

create policy "featured_insert_authenticated"
  on public.featured for insert
  to authenticated
  with check (true);

create policy "featured_update_authenticated"
  on public.featured for update
  to authenticated
  using (true)
  with check (true);

create policy "featured_delete_authenticated"
  on public.featured for delete
  to authenticated
  using (true);
