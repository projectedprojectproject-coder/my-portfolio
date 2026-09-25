import { useCallback, useEffect, useState } from "react";
import { supabase, ENTRIES_TABLE } from "../lib/supabaseClient";
import EntryEditor from "./EntryEditor";

// "소개"는 사이트에서 entries[0] 하나만 쓰기 때문에, 여기서 2개 이상
// 만들면 화면엔 안 보이는 "유령 항목"이 생겨서 편집이 안 먹히는 것처럼
// 보인다. 그 섹션만 1개로 막는다.
const SINGLE_ENTRY_SECTIONS = new Set(["about"]);

function previewLabel(item) {
  if (item.title) return item.title;
  const firstText = (item.blocks || []).find((b) => b.type === "text" && b.text)?.text;
  if (firstText) {
    const oneLine = firstText.replace(/\s+/g, " ").trim();
    return oneLine.length > 40 ? `${oneLine.slice(0, 40)}…` : oneLine;
  }
  return "(빈 항목)";
}

export default function SectionEntries({ section, label }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // null | 'new' | entry id

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from(ENTRIES_TABLE)
      .select("*")
      .eq("section", section)
      .order("position", { ascending: true });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setError(null);
    setItems(data ?? []);
  }, [section]);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    refresh();
  }, [refresh]);

  async function move(item, dir) {
    const idx = items.findIndex((i) => i.id === item.id);
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const other = items[j];
    await supabase.from(ENTRIES_TABLE).update({ position: other.position }).eq("id", item.id);
    await supabase.from(ENTRIES_TABLE).update({ position: item.position }).eq("id", other.id);
    refresh();
  }

  async function remove(item) {
    if (!window.confirm(`"${previewLabel(item)}" 항목을 삭제할까요?`)) return;
    const { error } = await supabase.from(ENTRIES_TABLE).delete().eq("id", item.id);
    if (error) {
      setError(error.message);
      return;
    }
    refresh();
  }

  function closeEditor() {
    setEditingId(null);
    refresh();
  }

  const canAdd = !SINGLE_ENTRY_SECTIONS.has(section) || items.length === 0;

  if (editingId === "new") {
    const nextPosition =
      items.length > 0 ? Math.max(...items.map((i) => i.position ?? 0)) + 1 : 0;
    return (
      <EntryEditor
        section={section}
        entry={{ position: nextPosition }}
        onSaved={closeEditor}
        onCancel={() => setEditingId(null)}
      />
    );
  }
  const editingItem = items.find((i) => i.id === editingId);
  if (editingItem) {
    return (
      <EntryEditor
        section={section}
        entry={editingItem}
        onSaved={closeEditor}
        onCancel={() => setEditingId(null)}
      />
    );
  }

  return (
    <div className="admin-section-entries">
      <div className="admin-listhead">
        <span>
          {label} ({items.length})
        </span>
        {canAdd && (
          <button className="admin-btn ghost" onClick={() => setEditingId("new")}>
            + 새 항목
          </button>
        )}
      </div>

      {SINGLE_ENTRY_SECTIONS.has(section) && items.length > 1 && (
        <p className="admin-error">
          이 섹션은 1개만 화면에 쓰이는데 지금 {items.length}개가 있습니다.
          맨 위(순서 1번) 것만 실제로 보이니, 나머지는 삭제해 주세요.
        </p>
      )}

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p className="admin-muted">불러오는 중…</p>
      ) : items.length === 0 ? (
        <p className="admin-muted">
          아직 편집한 항목이 없습니다 — 지금은 홈 화면에 원래 고정 문구가
          그대로 보입니다. "+ 새 항목"으로 추가하면 그때부터 이 목록이
          화면에 표시됩니다.
        </p>
      ) : (
        <ul className="admin-filelist">
          {items.map((item, i) => (
            <li className="admin-media-row" key={item.id}>
              <div className="admin-media-toprow">
                <div className="admin-fileinfo">
                  <span className="admin-filename">{previewLabel(item)}</span>
                  {item.tag && <span className="admin-muted">{item.tag}</span>}
                  {i === 0 && SINGLE_ENTRY_SECTIONS.has(section) && (
                    <span className="admin-muted">← 화면에 보이는 항목</span>
                  )}
                </div>
                <div className="admin-fileactions">
                  <button
                    className="admin-btn ghost"
                    onClick={() => move(item, -1)}
                    disabled={i === 0}
                  >
                    ↑
                  </button>
                  <button
                    className="admin-btn ghost"
                    onClick={() => move(item, 1)}
                    disabled={i === items.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    className="admin-btn ghost"
                    onClick={() => setEditingId(item.id)}
                  >
                    편집
                  </button>
                  <button className="admin-btn danger" onClick={() => remove(item)}>
                    삭제
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
