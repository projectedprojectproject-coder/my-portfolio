import { useEffect, useState } from "react";
import { supabase, AWARDS_TABLE } from "./supabaseClient";

// null = 로딩중, [] = 비어있음/조회 실패 → 호출하는 쪽에서 고정 문구로 대체.
export function useAwardsList() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let alive = true;
    supabase
      .from(AWARDS_TABLE)
      .select("*")
      .order("position", { ascending: true })
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
