import { useEffect, useState } from "react";
import { supabase, SECTION_TITLES_TABLE } from "../lib/supabaseClient";

const SECTIONS = [
  { key: "about", label: "소개", fallback: "소개" },
  { key: "featured", label: "추천", fallback: "추천" },
  { key: "research", label: "연구", fallback: "연구" },
  { key: "projects", label: "프로젝트", fallback: "프로젝트 & 창작" },
  { key: "publications", label: "저서", fallback: "저서" },
  { key: "media", label: "미디어", fallback: "미디어" },
  { key: "awards", label: "수상·자격증", fallback: "수상 · 자격증" },
];

export default function AdminTitles() {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    supabase
      .from(SECTION_TITLES_TABLE)
      .select("section,title")
      .then(({ data, error }) => {
        setLoading(false);
        if (error || !data) return;
        const map = {};
        for (const row of data) map[row.section] = row.title;
        setValues(map);
      });
  }, []);

  function setValue(section, value) {
    setValues((v) => ({ ...v, [section]: value }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    setNotice(null);
    const rows = SECTIONS.map((s) => ({
      section: s.key,
      title: (values[s.key] ?? s.fallback).trim() || s.fallback,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase
      .from(SECTION_TITLES_TABLE)
      .upsert(rows, { onConflict: "section" });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setNotice("저장됨 — 홈 화면에 반영됩니다");
  }

  if (loading) {
    return (
      <div className="admin-card">
        <p className="admin-muted">불러오는 중…</p>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <h1 className="admin-title">섹션 제목 편집</h1>
      <p className="admin-muted">
        각 패널 상단의 제목(h2)을 수정합니다. 비워두면 원래 이름으로 돌아갑니다.
      </p>

      {SECTIONS.map((s) => (
        <label className="admin-field" key={s.key}>
          <span>{s.label}</span>
          <input
            value={values[s.key] ?? s.fallback}
            onChange={(e) => setValue(s.key, e.target.value)}
          />
        </label>
      ))}

      {error && <p className="admin-error">{error}</p>}
      {notice && <p className="admin-ok">{notice}</p>}

      <button className="admin-btn" disabled={saving} onClick={save}>
        {saving ? "저장 중…" : "저장"}
      </button>
    </div>
  );
}
