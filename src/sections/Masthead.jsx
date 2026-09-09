import { nav, profile } from "../data";
import { useScrollSpy } from "../useScrollSpy";

export default function Masthead() {
  const activeId = useScrollSpy(nav.map((item) => item.id));

  return (
    <div className="masthead">
      <div className="shell masthead-row">
        <a href="#top" className="wordmark">
          <span className="tally" />
          {profile.wordmark}
        </a>
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
