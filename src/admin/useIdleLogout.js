import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

const IDLE_MS = 10 * 60 * 1000; // 10분
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"];

// 브라우저 자체 음원(Web Audio API)으로 경보음을 만든다 — 파일 업로드 없이
// 확실하게 "사이트 자체에서 소리"가 나게 하기 위함. 일부 브라우저는 사용자
// 조작 없이 시작된 오디오를 막을 수 있어 실패해도 조용히 넘어간다.
function playAlarm() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    [0, 0.35, 0.7].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.4, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.32);
    });
    setTimeout(() => ctx.close(), 1200);
  } catch {
    // 재생 불가한 환경이면 그냥 넘어간다 — 로그아웃 자체는 진행됨.
  }
}

// active(로그인 상태)일 때만 동작. 10분간 마우스/키보드/스크롤 등 아무
// 조작이 없으면 자동 로그아웃 + 경보음을 울리고 onTimeout 을 호출한다.
export function useIdleLogout(active, onTimeout) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;

    function reset() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        playAlarm();
        await supabase.auth.signOut();
        onTimeout?.();
      }, IDLE_MS);
    }

    ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, reset, { passive: true }));
    reset();

    return () => {
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, reset));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, onTimeout]);
}
