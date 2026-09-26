-- 수상·자격증 목록(awards)과 Contact 문구/이메일(contact) 편집용 테이블 2개.
-- Supabase 대시보드 → SQL Editor 에서 "한 번만" 실행하세요.
-- (두 번 실행하면 "policy already exists" 에러가 납니다 — 이미 적용된 것이니 무시해도 됩니다.)
-- 실행 전에도 사이트는 안 깨집니다: 테이블이 없거나 비어 있으면 원래 고정 문구를 보여줍니다.

-- =========================================================
-- 수상 · 자격증 (항목 여러 개)
-- =========================================================
create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  kind text,     -- Award / Certificate / Language 처럼 왼쪽에 뜨는 작은 분류 라벨
  title text,
  meta text,     -- 오른쪽 작은 글씨 (연도, 점수 등)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.awards enable row level security;

create policy "awards_select_public"
  on public.awards for select
  to anon, authenticated
  using (true);

create policy "awards_insert_authenticated"
  on public.awards for insert
  to authenticated
  with check (true);

create policy "awards_update_authenticated"
  on public.awards for update
  to authenticated
  using (true)
  with check (true);

create policy "awards_delete_authenticated"
  on public.awards for delete
  to authenticated
  using (true);

-- 시드 — 지금 사이트에 있는 항목 그대로.
insert into public.awards (position, kind, title, meta) values
  (0, 'Award', $t$한국영상학회(KOSMA) 2026년 봄 심포지엄 · Next Generation 부문 우수논문상$t$, '2026'),
  (1, 'Certificate', $t$ACA(Adobe Certified Associate) — Premiere Pro$t$, null),
  (2, 'Certificate', $t$ACA(Adobe Certified Associate) — After Effects$t$, null),
  (3, 'Certificate', $t$ACA(Adobe Certified Associate) — Photoshop$t$, null),
  (4, 'Language', 'TOEIC', '975'),
  (5, 'Language', 'OPIc', 'Advanced Low');

-- =========================================================
-- Contact (안내 문구 + 이메일, 1개짜리 싱글턴)
-- =========================================================
create table if not exists public.contact (
  id int primary key default 1,
  copy text,     -- 이메일 왼쪽 안내 문구
  email text,
  updated_at timestamptz not null default now(),
  constraint contact_singleton check (id = 1)
);

alter table public.contact enable row level security;

create policy "contact_select_public"
  on public.contact for select
  to anon, authenticated
  using (true);

create policy "contact_insert_authenticated"
  on public.contact for insert
  to authenticated
  with check (true);

create policy "contact_update_authenticated"
  on public.contact for update
  to authenticated
  using (true)
  with check (true);

insert into public.contact (id, copy, email) values (
  1,
  $t$연구 협업, 강연, 원고 청탁 등 문의는 아래 이메일로 연락해 주세요.$t$,
  'projectedprojectproject@gmail.com'
) on conflict (id) do nothing;
