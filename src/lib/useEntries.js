import { useEffect, useState } from "react";
import { supabase, ENTRIES_TABLE } from "./supabaseClient";

// section(about/research/projects/publications)의 항목을 Supabase 에서
// 읽어온다. null = 아직 로딩중, [] = 비어있거나(관리자가 편집 안 함) 조회
// 실패(Supabase 문제) — 두 경우 다 호출하는 쪽에서 기존 정적 데이터로
// 대체(fallback)하도록 설계했다. 홈 화면이 Supabase 상태에 의존해
// 깨지는 일이 없게 하기 위함.
export function useEntries(section) {
  const [entries, setEntries] = useState(null);

  useEffect(() => {
    let alive = true;
    supabase
      .from(ENTRIES_TABLE)
      .select("*")
      .eq("section", section)
      .order("position", { ascending: true })
      .then(({ data, error }) => {
        if (!alive) return;
        if (error || !data) {
          setEntries([]);
          return;
        }
        setEntries(data);
      })
      .catch(() => {
        if (alive) setEntries([]);
      });
    return () => {
      alive = false;
    };
  }, [section]);

  return entries;
}
