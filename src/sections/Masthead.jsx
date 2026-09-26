import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { nav, profile } from "../data";
import { useScrollSpy } from "../useScrollSpy";

export default function Masthead() {
  const activeId = useScrollSpy(nav.map((item) => item.id));
  const navRef = useRef(null);

  // 모바일에서는 메뉴가 옆으로 밀어 보는 한 줄이라, 현재 섹션 메뉴가
  // 화면 밖에 있으면 가운데로 끌어온다 (세로 스크롤은 건드리지 않음).
  useEffect(() => {
    const list = navRef.current;
    const active = list?.querySelector("a.is-active");
    if (!list || !active || list.scrollWidth <= list.clientWidth) return;
    const left =
      active.getBoundingClientRect().left -
      list.getBoundingClientRect().left +
      list.scrollLeft -
      (list.clientWidth - active.offsetWidth) / 2;
    list.scrollTo({ left, behavior: "smooth" });
  }, [activeId]);

  return (
    <div className="masthead">
      <div className="shell masthead-row">
        <div className="wordmark-group">
          <a href="#top" className="wordmark">
            {profile.wordmark}
          </a>
          {/* 이름 옆 빨간 점 — 관리자 로그인으로 이동하는 버튼 */}
          <Link to="/admin" className="admin-dot" title="관리자 로그인" aria-label="관리자 로그인">
            <span className="tally" />
          </Link>
        </div>
        <ul className="masthead-nav" id="site-nav" ref={navRef}>
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={activeId === item.id ? "is-active" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
