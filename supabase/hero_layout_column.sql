-- 헤더 사진 배치 방식 컬럼 추가. 'side' = 기존처럼 오른쪽 작은 썸네일,
-- 'full' = 사진이 헤더 전체 배경이 되고 글이 그 위에 얹힘.
-- 이미 있는 hero 테이블에 컬럼만 추가하는 거라 여러 번 실행해도 안전합니다.

alter table public.hero
  add column if not exists layout text not null default 'side';
