-- "과제" 섹션 항목(카드) 편집용 테이블.
-- Supabase 대시보드 → SQL Editor 에서 "한 번만" 실행하세요.
-- (두 번 실행하면 "policy already exists" 에러가 납니다 — 이미 적용된 것이니 무시해도 됩니다.)
-- 실행 전에도 사이트는 안 깨집니다: 테이블이 없거나 비어 있으면 코드(data.js)에 있는
-- 기본 과제(커피 배달 게임)를 그대로 보여줍니다.

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  tag text,          -- 작은 라벨 (예: 수업 과제 · Week 3)
  title text not null,
  subtitle text,
  description text,
  controls text,     -- 조작 안내 한 줄
  src text,          -- 게임(HTML) 주소. 비워두면 게임 없이 글 카드만 나옴
  source text,       -- "소스 보기" 링크 (선택)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.assignments enable row level security;

create policy "assignments_select_public"
  on public.assignments for select
  to anon, authenticated
  using (true);

create policy "assignments_insert_authenticated"
  on public.assignments for insert
  to authenticated
  with check (true);

create policy "assignments_update_authenticated"
  on public.assignments for update
  to authenticated
  using (true)
  with check (true);

create policy "assignments_delete_authenticated"
  on public.assignments for delete
  to authenticated
  using (true);

-- 시드 — 지금 사이트에 있는 커피 배달 게임 그대로.
insert into public.assignments (position, tag, title, subtitle, description, controls, src, source) values (
  0,
  $t$수업 과제 · Week 3$t$,
  $t$커피 배달 게임$t$,
  $t$프롬프트 구조화 실습$t$,
  $t$카페에서 커피 네 잔을 받아 이웃 네 곳에 배달하는 작은 3D 마을 게임입니다. 이미 만들어진 게임을 출발점으로, AI에게 원하는 변경을 정확하게 요청하는 연습에 쓰였습니다.$t$,
  $t$이동 방향키 · WASD  /  커피 받기·전하기 E · Space  /  시작 Enter$t$,
  '/games/coffee-delivery/index.html',
  'https://github.com/projectedprojectproject-coder/coffee-delivery-game-week3'
);
