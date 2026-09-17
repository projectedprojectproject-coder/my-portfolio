import { Link } from "react-router-dom";
import { nav, profile } from "../data";
import { useScrollSpy } from "../useScrollSpy";

export default function Masthead() {
  const activeId = useScrollSpy(nav.map((item) => item.id));

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
        <ul className="masthead-nav" id="site-nav">
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
