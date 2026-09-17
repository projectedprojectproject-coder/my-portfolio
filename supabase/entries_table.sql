-- 소개/연구/프로젝트/저서 패널을 블록(글+이미지) 단위로 관리하는 테이블.
-- Supabase 대시보드 → SQL Editor 에서 한 번 실행하세요.
-- 실행 전에도 사이트는 안 깨집니다 — 이 테이블이 비어 있으면 화면은
-- 원래 고정 문구를 그대로 보여줍니다. 아래 seed 를 넣으면 그 순간부터
-- "콘텐츠" 탭에서 지금 사이트에 있는 문구를 그대로 이어서 편집할 수 있습니다.

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('about', 'research', 'projects', 'publications')),
  position integer not null default 0,
  tag text,
  title text,
  subtitle text,   -- 역할 / 저자 등, 제목 아래 작은 글씨
  note text,       -- 하단 모노 폰트 메모 (연구 섹션 첫 항목처럼)
  blocks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.entries enable row level security;

create policy "entries_select_public"
  on public.entries for select
  to anon, authenticated
  using (true);

create policy "entries_insert_authenticated"
  on public.entries for insert
  to authenticated
  with check (true);

create policy "entries_update_authenticated"
  on public.entries for update
  to authenticated
  using (true)
  with check (true);

create policy "entries_delete_authenticated"
  on public.entries for delete
  to authenticated
  using (true);

-- =========================================================
-- 시드 — 현재 사이트에 있는 문구를 그대로 옮겨서 편집 시작점으로 삼음.
-- 이미 콘텐츠 탭에서 내용을 만들어 두셨다면 이 아래는 실행하지 마세요
-- (중복으로 들어갑니다). 처음 한 번만 실행하는 용도입니다.
-- =========================================================

-- 소개
insert into public.entries (section, position, blocks) values
('about', 0, $j$[
  {"type":"text","text":"성균관대학교 일반대학원 영상학과(Film, Television and Multimedia) 석사과정에 재학 중이며, 2028년 졸업을 목표로 하고 있습니다."},
  {"type":"text","text":"AI를 활용한 영상 제작 실무서 「AI와 할리우드 공식으로 만드는 방구석 시네마틱」을 집필·출간한 바 있으며, 연구와 창작을 함께 병행하고 있습니다."}
]$j$::jsonb);

-- 연구
insert into public.entries (section, position, tag, title, note, blocks) values
('research', 0, $t$석사학위논문 · 진행중$t$,
  $t$AI 슬롭·유사과학 채널의 담론 구조와 유튜브 추천 기반 노출 확산에 관한 비판적 담론분석$t$,
  $t$TEXT — DISCURSIVE PRACTICE — SOCIAL PRACTICE$t$,
  $j$[{"type":"text","text":"Fairclough(1992, 1995)의 3차원 모형(텍스트 · 담화적 실천 · 사회적 실천)을 분석틀로 삼아, AI로 생성된 유사과학 콘텐츠(AI Slop) 채널의 담론이 어떻게 구성되고, 유튜브 추천 알고리즘을 통해 어떤 방식으로 노출·확산되는지를 비판적으로 분석합니다."}]$j$::jsonb);

insert into public.entries (section, position, tag, title, blocks) values
('research', 1, $t$연구 주제$t$,
  $t$데드풀(Deadpool) 시리즈의 제4의 벽 파괴와 "역설적 몰입"$t$,
  $j$[{"type":"text","text":"데드풀 시리즈에서 반복적으로 사용되는 제4의 벽(Fourth Wall) 파괴 기법이 관객에게 오히려 몰입을 강화하는 \"역설적 몰입(Paradoxical Immersion)\" 효과를 유도하는 메커니즘을 탐구하는 연구 주제입니다."}]$j$::jsonb);

-- 프로젝트
insert into public.entries (section, position, tag, title, blocks) values
('projects', 0, $t$SF 창작 프로젝트$t$, $t$UNCANNY VALLEY$t$,
  $j$[{"type":"text","text":"오리지널 SF 창작 프로젝트입니다."}]$j$::jsonb);

insert into public.entries (section, position, tag, title, subtitle, blocks) values
('projects', 1, $t$코미디 드라마 단편$t$, $t$코딱지$t$, $t$역할 · 조연출$t$,
  $j$[{"type":"text","text":"어느 날 누군가 계속 대문 앞에 코딱지를 붙인다, 그 자는 누구일까? 그리고 왜 우리 집 대문에 코딱지를 붙인 것일까? 범인은 이 안에 있다. 범인을 잡기 위하여 주인공 '승수'의 코미디 추리극! 그러나 그는 조사 도중 가족들의 비밀을 다 알아 버리는데…. 가족들의 비밀을 알아버린 승수의 가족 생활, 과연 무사할까?"}]$j$::jsonb);

insert into public.entries (section, position, tag, title, subtitle, blocks) values
('projects', 2, $t$시사교양$t$, $t$트립 어게인 시즌 2$t$, $t$역할 · 편집 국장$t$,
  $j$[{"type":"text","text":"지나간 여행 사진들만 뒤적거리며 팬데믹을 겪은 MZ세대, 다시 여행을 할 시간이 왔다! 그러나 역병의 시대 이전의 정보만 남겨졌는데, 수많은 여행 정보로 인하여 미궁에 빠진 여행 계획을 위하여 특별한 3명의 탐정들이 나타났다. 여행의 DNA를 깨우자! 특별한 여행 방법을 찾기 위하여, 오늘도 우리들의 탐정들은 조사에 임한다."}]$j$::jsonb);

insert into public.entries (section, position, tag, title, blocks) values
('projects', 3, $t$광고 제작$t$, $t$경기 지역 장애인 지원 광고$t$,
  $j$[{"type":"text","text":"경기 지역 장애인 지원을 위한 광고를 다수 제작했습니다."}]$j$::jsonb);

-- 저서 (표지 이미지·링크는 코드에 그대로 남아있고, 아래는 태그/제목/저자/본문만)
insert into public.entries (section, position, tag, title, subtitle, blocks) values
('publications', 0, $t$출간$t$, $t$AI와 할리우드 공식으로 만드는 방구석 시네마틱$t$, $t$이윤호 지음$t$,
  $j$[
  {"type":"text","text":"카메라도, 배우도, 촬영 장비도 없이 한 편의 영화 같은 영상을 만들 수 있을까. 몇 년 전까지 이 질문의 답은 분명히 아니오였다. 영상 제작은 장비를 갖추고 촬영과 편집 기술을 익힌 사람들의 영역이었다. 그러나 생성형 인공지능의 등장은 이 질서를 근본적으로 바꾸고 있다. 텍스트 몇 줄로 이미지가 만들어지고, 정지 이미지는 움직이는 영상이 되며, 글로 쓴 대본은 자연스러운 음성으로 변환된다. 수십 명의 제작진이 하던 일을 이제 한 사람의 창작자와 인공지능의 협업으로 해낼 수 있는 시대다.\n\n그런데 여기서 중요한 질문이 하나 남는다. 같은 AI와 같은 툴을 썼는데 왜 어떤 영상은 수백만 명을 사로잡고 어떤 영상은 아무 반응도 얻지 못하는가. 이 책의 답은 단순하다. 사람을 움직이는 것은 기술이 아니라 이야기이기 때문이다. 할리우드는 100년이 넘는 시간 동안 수많은 성공과 실패를 반복하며 관객의 감정을 움직이는 서사 구조를 검증해 왔다. 이 책은 바로 그 지점에서 시작한다. AI 툴 사용법을 나열하는 매뉴얼이 아니라, 할리우드가 검증한 스토리 공식과 AI 제작 기술을 하나의 작업 흐름으로 연결하는 책이다.\n\n전반부에서는 인간이 이야기에 몰입하는 이유에서 출발해, 세이브 더 캣의 핵심 원리, 주인공의 Want와 Need, 3막 구조와 15비트 시트까지 할리우드 스토리 설계법을 단계별로 다룬다. 후반부에서는 그 설계를 실제 영상으로 옮기는 과정을 따라간다. AI와 함께 기획하고 대본을 쓰는 법, 스토리보드 설계, 이미지 생성, 비디오 생성, AI 편집과 후반 제작, 그리고 숏폼 콘텐츠 실전 제작까지 기획에서 배포에 이르는 전 과정을 순서대로 안내한다.\n\n이 책의 가장 큰 특징은 하나의 작품이 책 전체를 관통한다는 점이다. 인류가 떠난 지구에 홀로 남겨진 소녀 줄리아와, 감정을 이해하지 못하는 거대 전투 로봇 RTLX0329의 여정을 그린 SF 단편 UNCANNY VALLEY다. 이 작품이 로그라인에서 15비트 구조, 캐릭터 디자인, 콘셉트 아트, 스토리보드, 영상 생성까지 각 장의 이론이 실제로 어떻게 적용되는지를 보여 주는 실습 사례로 이어진다. 독자는 이론을 배우는 동시에 한 편의 작품이 완성되어 가는 과정을 처음부터 끝까지 지켜보게 된다.\n\n부록도 실전 중심으로 구성했다. 기획부터 편집까지 바로 쓸 수 있는 AI 프롬프트 100선, 자신의 이야기를 직접 설계해 보는 제작 워크북, AI 창작 생태계의 여섯 단계 지형도, UNCANNY VALLEY 스토리 피치 전문, 그리고 단계별 실전 툴 가이드를 담았다. 유튜브 쇼츠 하나를 만들고 싶은 사람부터 단편영화를 꿈꾸는 사람까지, 머릿속에만 있던 이야기를 세상 밖으로 꺼내고 싶은 모든 창작자를 위한 책이다. 기술은 계속 바뀌지만 좋은 이야기의 원리는 변하지 않는다. 아이디어가 막힐 때, AI가 최고의 공동 작가가 되어 줄 것이다."}
]$j$::jsonb);
