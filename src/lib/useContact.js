import { useEffect, useState } from "react";
import { supabase, CONTACT_TABLE } from "./supabaseClient";

// null = 로딩중, false = 행 없음/조회 실패(고정 문구로 대체), 객체 = 실제 값.
export function useContact() {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    let alive = true;
    supabase
      .from(CONTACT_TABLE)
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!alive) return;
        setContact(error || !data ? false : data);
      })
      .catch(() => {
        if (alive) setContact(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return contact;
}
