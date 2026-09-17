import { useEffect, useState } from "react";
import { supabase, MEDIA_TABLE } from "./supabaseClient";

// 방문자용 미디어 탭이 쓰는 목록. public.media 테이블은 익명 읽기가
// 허용돼 있어서(media_meta_select_public 정책) 이걸로 조회한다 —
// Storage 의 list() 는 익명에게 허용 안 해뒀기 때문.
// null = 로딩중, [] = 비어있음/조회 실패(Supabase 문제여도 화면은 안 죽음).
export function useMediaList() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let alive = true;
    supabase
      .from(MEDIA_TABLE)
      .select("path,title,description,created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!alive) return;
        setItems(error || !data ? [] : data);
      })
      .catch(() => {
        if (alive) setItems([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  return items;
}
