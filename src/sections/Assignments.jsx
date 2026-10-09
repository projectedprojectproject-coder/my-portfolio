import { useEffect, useRef, useState } from "react";
import { assignments } from "../data";
import { safeUrl } from "../lib/safeUrl";
import { useAssignmentsList } from "../lib/useAssignmentsList";
import { useSectionTitles } from "../lib/useSectionTitles";

// 게임은 iframe 으로 띄우되 sandbox="allow-scripts" 만 준다.
// → 게임 코드는 이 사이트와 다른 출처로 취급되어 관리자 로그인 정보 등
//   사이트의 저장소에 접근할 수 없다. (게임의 최고 기록 저장만 안 된다 —
//   게임이 localStorage 오류를 try/catch 로 처리해 두어서 동작에는 지장 없음)
function GameCard({ item }) {
  const [started, setStarted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const frameRef = useRef(null);

  // 확대 중에는 뒤쪽 페이지 스크롤을 잠그고, 포커스가 게임 밖에 있으면 ESC 로 축소한다.
  // (포커스가 게임 안에 있으면 키 입력이 게임으로만 가서 ESC 가 여기 안 닿는다 — 그땐 "축소" 버튼)
  useEffect(() => {
    if (!expanded) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [expanded]);

  // 시작하거나 확대/축소한 직후 키보드 입력이 바로 게임으로 가도록 포커스를 넘긴다.
  useEffect(() => {
    if (!started) return undefined;
    const id = requestAnimationFrame(() => frameRef.current?.contentWindow?.focus());
    return () => cancelAnimationFrame(id);
  }, [started, expanded]);

  function start(expand) {
    setStarted(true);
    setExpanded(expand);
  }

  // 관리자가 입력한 주소라 그대로 쓰지 않고 한 번 거른다 (javascript:, data: 등 차단).
  // 게임(iframe)은 https 또는 사이트 안 경로만, 링크는 http(s) 도 허용.
  const gameSrc = safeUrl(item.src, { httpsOnly: true });
  const sourceHref = safeUrl(item.source);

  return (
    <article className="idx-card assign-card">
      {item.tag && <span className="idx-tag">{item.tag}</span>}
      <h3>{item.title}</h3>
      {item.subtitle && <p className="idx-role">{item.subtitle}</p>}
      {item.description && <p className="assign-desc">{item.description}</p>}

      {/* game-stage 는 자리만 잡는다. 확대해도 iframe 은 그대로라 게임이 다시 시작되지 않는다. */}
      {gameSrc && (
      <div className="game-stage">
        <div
          className={`game-frame${expanded ? " is-expanded" : ""}`}
          role={expanded ? "dialog" : undefined}
          aria-modal={expanded ? "true" : undefined}
          aria-label={expanded ? `${item.title} 확대 화면` : undefined}
        >
          {started ? (
            <>
              <iframe
                ref={frameRef}
                className="game-iframe"
                src={gameSrc}
                title={item.title}
                sandbox="allow-scripts"
              />
              <button
                type="button"
                className="game-toggle"
                aria-pressed={expanded}
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? "축소 ×" : "확대"}
              </button>
            </>
          ) : (
            <div className="game-start-wrap">
              <button type="button" className="game-btn" onClick={() => start(false)}>
                ▶ 게임 시작
              </button>
              <button type="button" className="game-btn ghost" onClick={() => start(true)}>
                확대해서 시작
              </button>
            </div>
          )}
        </div>
      </div>
      )}

      {gameSrc && item.controls && <p className="assign-controls">{item.controls}</p>}
      {sourceHref && (
        <a
          className="text-link"
          href={sourceHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          소스 보기 <span className="arrow">→</span>
        </a>
      )}
    </article>
  );
}

export default function Assignments() {
  const titles = useSectionTitles();
  const list = useAssignmentsList();
  // 로딩 중엔 비워 둔다 — 기본 과제를 먼저 보여주면 관리자가 고친 내용으로 바뀔 때 깜빡인다.
  // 불러온 뒤 항목이 없으면(또는 조회 실패) 기본 과제를 보여준다.
  const items = list === null ? [] : list.length > 0 ? list : assignments;

  return (
    <section id="assignments" className="section">
      <div className="section-inner">
        <div className="section-mark">
          <span className="glyph">§</span>ASSIGNMENTS
        </div>
        <div>
          <h2>{titles.assignments || "과제"}</h2>
          <div className="assign-list">
            {items.map((item) => (
              <GameCard item={item} key={item.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
