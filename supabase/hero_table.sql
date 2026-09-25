-- 홈 화면 맨 위 히어로(헤더) 영역 — 아이브로/헤드라인/서브타이틀/본문/썸네일 사진.
-- 항목이 1개뿐인 "싱글턴" 테이블이라 id 를 1로 고정한다.
-- Supabase 대시보드 → SQL Editor 에서 한 번 실행하세요.
-- 실행 전에도 사이트는 안 깨집니다 — 이 테이블이 비어 있으면 원래 고정
-- 문구를 그대로 보여줍니다.

create table if not exists public.hero (
  id int primary key default 1,
  eyebrow text,
  headline text,     -- 줄바꿈(\n)으로 여러 줄
  subtitle text,      -- 모노 소문자/대문자 라벨
  body text,
  photo_url text,      -- 썸네일 사진 (Storage 'media' 버킷 공개 URL)
  updated_at timestamptz not null default now(),
  constraint hero_singleton check (id = 1)
);

alter table public.hero enable row level security;

create policy "hero_select_public"
  on public.hero for select
  to anon, authenticated
  using (true);

create policy "hero_insert_authenticated"
  on public.hero for insert
  to authenticated
  with check (true);

create policy "hero_update_authenticated"
  on public.hero for update
  to authenticated
  using (true)
  with check (true);

-- 시드 — 지금 사이트에 있는 문구를 그대로 옮겨서 편집 시작점으로 삼음.
insert into public.hero (id, eyebrow, headline, subtitle, body) values (
  1,
  $t$SUNGKYUNKWAN UNIVERSITY · GRADUATE SCHOOL OF FILM, TELEVISION AND MULTIMEDIA$t$,
  $t$이윤호$t$,
  $t$Yoon Ho, Rhee$t$,
  $t$AI 슬롭(AI Slop)과 유사과학 콘텐츠의 담론 구조, 그리고 유튜브 추천 알고리즘에 의한 노출·확산 메커니즘을 비판적 담론분석(Critical Discourse Analysis)으로 연구하는 석사과정을 수행하는 대학원생입니다.$t$
) on conflict (id) do nothing;
