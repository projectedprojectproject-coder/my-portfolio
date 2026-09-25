import { useEffect, useState } from "react";
import { supabase, HERO_TABLE } from "./supabaseClient";

// null = 로딩중, false = 행 없음/조회 실패(고정 문구로 대체), 객체 = 실제 값.
export function useHero() {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    let alive = true;
    supabase
      .from(HERO_TABLE)
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!alive) return;
        setHero(error || !data ? false : data);
      })
      .catch(() => {
        if (alive) setHero(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return hero;
}
