import { useState } from "react";
import { changelog } from "../changelog";
import { useSectionTitles } from "../lib/useSectionTitles";

// 처음엔 최근 항목만 보여주고, 나머지는 "더 보기"로 펼친다.
const INITIAL_COUNT = 6;

export default function Changelog() {
  const titles = useSectionTitles();
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? changelog : changelog.slice(0, INITIAL_COUNT);
  const hiddenCount = changelog.length - INITIAL_COUNT;

  return (
    <section id="changelog" className="section">
      <div className="section-inner">
        <div className="section-mark">
          <span className="glyph">§</span>CHANGELOG
        </div>
        <div>
          <h2>{titles.changelog || "변경 이력"}</h2>

          <ol className="changelog-list">
            {visible.map((entry) => (
              <li className="changelog-item" key={`${entry.date}-${entry.title}`}>
                <time className="changelog-date" dateTime={entry.date}>
                  {entry.date}
                </time>
                <div className="changelog-body">
                  <h3 className="changelog-title">{entry.title}</h3>
                  {entry.items?.length > 0 && (
                    <ul>
                      {entry.items.map((text) => (
                        <li key={text}>{text}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {hiddenCount > 0 && (
            <button
              type="button"
              className="changelog-more"
              aria-expanded={showAll}
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? "접기" : `이전 기록 ${hiddenCount}개 더 보기`}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
