import { useEffect, useState } from "react";
import { supabase, FEATURED_TABLE } from "./supabaseClient";

// null = 로딩중, [] = 비어있음/조회 실패 → 섹션 자체를 숨긴다.
export function useFeaturedList() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let alive = true;
    supabase
      .from(FEATURED_TABLE)
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
