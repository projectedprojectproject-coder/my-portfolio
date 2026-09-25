-- 각 패널의 h2 제목(소개/연구/프로젝트/저서/미디어/수상·자격증)을
-- 관리자에서 수정할 수 있게 하는 테이블.
-- Supabase 대시보드 → SQL Editor 에서 한 번 실행하세요.

create table if not exists public.section_titles (
  section text primary key,
  title text not null,
  updated_at timestamptz not null default now()
);

alter table public.section_titles enable row level security;

create policy "section_titles_select_public"
  on public.section_titles for select
  to anon, authenticated
  using (true);

create policy "section_titles_insert_authenticated"
  on public.section_titles for insert
  to authenticated
  with check (true);

create policy "section_titles_update_authenticated"
  on public.section_titles for update
  to authenticated
  using (true)
  with check (true);

-- 시드 — 지금 사이트에 있는 제목 그대로.
insert into public.section_titles (section, title) values
  ('about', '소개'),
  ('research', '연구'),
  ('projects', '프로젝트 & 창작'),
  ('publications', '저서'),
  ('media', '미디어'),
  ('awards', '수상 · 자격증')
on conflict (section) do nothing;
