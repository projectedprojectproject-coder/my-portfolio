-- "과제" 섹션에 코스모 커피 배달 게임 카드를 추가한다.
-- Supabase 대시보드 → SQL Editor 에서 실행하세요. (assignments_table.sql 을 먼저 실행해 둔 상태여야 합니다.)
-- 같은 게임 주소의 카드가 이미 있으면 아무것도 넣지 않으므로, 두 번 실행해도 중복되지 않습니다.
-- (SQL 대신 관리자 화면의 "과제" 탭에서 같은 내용을 직접 입력해 추가해도 됩니다.)
-- 이미 예전 내용(Week 3 라벨)으로 들어가 있다면 이 파일이 아니라
-- assignment_cosmo_coffee_week6.sql 을 실행해 고치세요 (이 파일은 이미 있으면 건드리지 않습니다).

insert into public.assignments (position, tag, title, subtitle, description, controls, src, source)
select
  coalesce((select max(position) from public.assignments), -1) + 1,
  $t$수업 과제 · Week 6$t$,
  $t$코스모 커피 배달$t$,
  $t$Structured System Prompt$t$,
  $t$커피 배달 게임을 우주 정거장 테마로 다시 만든 버전입니다. 곰돌이가 우주 정거장 카페에서 커피 여섯 잔을 받아 여섯 이웃에게 배달하고, 카페로 돌아와 평가를 받는 작은 3D 게임입니다. 생명은 하트 3개이고, 3초 뒤 폭발하는 외계 고양이와 표시된 자리에 별을 떨어뜨리는 UFO, 그리고 지뢰를 조심해야 합니다.

지뢰는 밟아서 터지는 방식이 아닙니다. 희미한 점선 원으로 범위가 표시되고 가까이 갈수록 또렷해지며, 그 범위에 들어가면 붉은 카운트다운이 시작되어 2초 뒤에 폭발합니다. 폭발할 때 범위 안에 남아 있으면 하트가 하나 줄어들고, 그 전에 빠져나가면 피할 수 있습니다.$t$,
  $t$이동 방향키 · WASD  /  커피 받기·전하기 E · Space  /  고양이 · 별똥별 · 지뢰 피하기$t$,
  '/games/coffee-bootleg/index.html',
  'https://github.com/projectedprojectproject-coder/coffeegamebootleg'
where not exists (
  select 1 from public.assignments where src = '/games/coffee-bootleg/index.html'
);
