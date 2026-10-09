-- 이미 들어가 있는 "코스모 커피 배달" 카드를 Week 6 · Structured System Prompt 로 고친다.
-- Supabase 대시보드 → SQL Editor 에서 실행하세요. 몇 번을 실행해도 결과가 같습니다.
-- (SQL 대신 관리자 화면의 "과제" 탭 → 해당 카드 편집에서 같은 값을 직접 고쳐도 됩니다.)

update public.assignments
set
  tag = $t$수업 과제 · Week 6$t$,
  subtitle = $t$Structured System Prompt$t$,
  description = $t$커피 배달 게임을 우주 정거장 테마로 다시 만든 버전입니다. 곰돌이가 우주 정거장 카페에서 커피 여섯 잔을 받아 여섯 이웃에게 배달하고, 카페로 돌아와 평가를 받는 작은 3D 게임입니다. 생명은 하트 3개이고, 3초 뒤 폭발하는 외계 고양이와 표시된 자리에 별을 떨어뜨리는 UFO를 피해야 합니다.$t$,
  updated_at = now()
where src = '/games/coffee-bootleg/index.html';
