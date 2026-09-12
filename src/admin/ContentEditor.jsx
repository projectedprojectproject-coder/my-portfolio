import { useState } from "react";
import SectionEntries from "./SectionEntries";

const SECTIONS = [
  { key: "about", label: "소개" },
  { key: "research", label: "연구" },
  { key: "projects", label: "프로젝트" },
  { key: "publications", label: "저서" },
];

export default function ContentEditor() {
  const [active, setActive] = useState(SECTIONS[0].key);

  return (
    <div className="admin-card">
      <h1 className="admin-title">콘텐츠 편집</h1>
      <p className="admin-muted">
        각 패널의 글·이미지를 블록 단위로 추가·삭제·순서변경할 수 있습니다.
      </p>

      <div className="admin-tabs">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            type="button"
            className={`admin-tab${active === s.key ? " is-active" : ""}`}
            onClick={() => setActive(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {SECTIONS.map((s) =>
        s.key === active ? (
          <SectionEntries key={s.key} section={s.key} label={s.label} />
        ) : null
      )}
    </div>
  );
}
