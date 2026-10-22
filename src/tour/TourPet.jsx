import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { tourSteps } from "./tourScript";
import PetAvatar from "./PetAvatar";
import { PET } from "./petConfig";

// AI 펫 투어: 펫이 사이트를 스크롤하고 섹션을 강조하며, 내 목소리 음성(mp3)과 자막으로 소개한다.
//  - 음성 파일이 아직 없으면 자막만 보여 주고, 글 길이에 맞춰 자동으로 넘어간다.
//  - 방문자가 직접 스크롤하거나 터치하면 일시정지, ESC 로 종료. 소리는 "소개 듣기"를 눌렀을 때만 난다.
//  - AI 키·서버가 필요 없다 (음성은 미리 만들어 둔 파일).
const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function TourPet() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [noVoice, setNoVoice] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const spotRef = useRef(null);

  // 화면에 실제로 있는 섹션만 (비어 있어서 숨겨진 섹션은 건너뜀)
  const steps = useMemo(() => {
    if (!open) return [];
    return tourSteps.filter((s) => document.querySelector(s.target));
  }, [open]);
  const step = steps[idx];

  const clearSpot = () => {
    if (spotRef.current) {
      spotRef.current.classList.remove("tour-spot");
      spotRef.current = null;
    }
  };

  const stop = useCallback(() => {
    clearTimeout(timerRef.current);
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.removeAttribute("src");
      a.load();
    }
    clearSpot();
    setSpeaking(false);
    setOpen(false);
    setPaused(false);
    setIdx(0);
  }, []);

  const goNext = useCallback(() => {
    setIdx((i) => {
      if (i + 1 >= steps.length) {
        setTimeout(stop, 0);
        return i;
      }
      return i + 1;
    });
  }, [steps.length, stop]);

  function start() {
    // 클릭 안에서 오디오 요소를 만들어 두면 모바일에서도 이후 단계 자동 재생이 막히지 않는다.
    if (!audioRef.current) audioRef.current = new Audio();
    setIdx(0);
    setPaused(false);
    setNoVoice(false);
    setOpen(true);
  }

  // 단계가 바뀔 때: 스크롤 + 강조 + 음성/타이머
  useEffect(() => {
    if (!open || !step) return undefined;
    const el = document.querySelector(step.target);
    if (!el) return undefined;
    clearSpot();
    el.classList.add("tour-spot");
    spotRef.current = el;
    el.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });

    const a = audioRef.current;
    let cancelled = false;
    const fallback = () => {
      // 음성 파일이 없거나 재생이 막혔을 때: 글 길이만큼 기다렸다가 다음으로
      setNoVoice(true);
      setSpeaking(false);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (!cancelled) goNext();
      }, Math.max(4500, step.text.length * 110));
    };
    if (a && step.audio) {
      a.onended = () => {
        setSpeaking(false);
        timerRef.current = setTimeout(() => !cancelled && goNext(), 700);
      };
      a.onerror = fallback;
      a.src = step.audio;
      setNoVoice(false);
      a.play()
        .then(() => !cancelled && setSpeaking(true))
        .catch(fallback);
    } else {
      fallback();
    }
    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
      if (a) {
        a.onended = null;
        a.onerror = null;
      }
    };
  }, [open, step, goNext]);

  // 일시정지 / 재개
  useEffect(() => {
    const a = audioRef.current;
    if (!open || !a) return;
    if (paused) {
      a.pause();
      setSpeaking(false);
      clearTimeout(timerRef.current);
    } else if (a.src && a.paused && !a.ended && !noVoice) {
      a.play()
        .then(() => setSpeaking(true))
        .catch(() => {});
    }
  }, [paused, open, noVoice]);

  // 방문자가 직접 스크롤/터치하면 일시정지, ESC 로 종료
  useEffect(() => {
    if (!open) return undefined;
    const pause = () => setPaused(true);
    const onKey = (e) => {
      if (e.key === "Escape") stop();
    };
    window.addEventListener("wheel", pause, { passive: true });
    window.addEventListener("touchmove", pause, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", pause);
      window.removeEventListener("touchmove", pause);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, stop]);

  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
      clearSpot();
    },
    []
  );

  if (!open) {
    return (
      <button type="button" className="pet-launch" onClick={start} aria-label={`${PET.name} 투어로 사이트 소개 듣기`}>
        <PetAvatar speaking={false} />
        <span>소개 듣기</span>
      </button>
    );
  }

  return (
    <aside className="pet-tour" role="dialog" aria-label="사이트 소개 투어" aria-live="polite">
      <PetAvatar speaking={speaking} />
      <div className="pet-bubble">
        <p className="pet-step">{step ? `${idx + 1} / ${steps.length} · ${step.title}` : ""}</p>
        <p className="pet-text">{step ? step.text : ""}</p>
        {noVoice && <p className="pet-note">음성 파일 준비 전이라 자막만 보여요.</p>}
        <div className="pet-controls">
          <button type="button" onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}>
            이전
          </button>
          <button type="button" onClick={() => setPaused((p) => !p)}>
            {paused ? "재생" : "일시정지"}
          </button>
          <button type="button" onClick={goNext}>
            다음
          </button>
          <button type="button" className="pet-close" onClick={stop}>
            끝내기
          </button>
        </div>
      </div>
    </aside>
  );
}
