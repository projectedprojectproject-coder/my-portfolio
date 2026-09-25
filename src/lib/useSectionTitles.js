import { useEffect, useState } from "react";
import { supabase, SECTION_TITLES_TABLE } from "./supabaseClient";

// 전체 제목 맵을 한 번에 가져온다. 각 섹션 컴포넌트가 이 훅을 독립적으로
// 부르고, 자기 section 키만 꺼내 쓰면서 없으면 고정 문구로 대체한다.
export function useSectionTitles() {
  const [titles, setTitles] = useState({});

  useEffect(() => {
    let alive = true;
    supabase
      .from(SECTION_TITLES_TABLE)
      .select("section,title")
      .then(({ data, error }) => {
        if (!alive || error || !data) return;
        const map = {};
        for (const row of data) map[row.section] = row.title;
        setTitles(map);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return titles;
}
