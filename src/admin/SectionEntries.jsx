import { useCallback, useEffect, useState } from "react";
import { supabase, ENTRIES_TABLE } from "../lib/supabaseClient";
import EntryEditor from "./EntryEditor";

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
    if (!window.confirm(`"${item.title || "제목 없음"}" 항목을 삭제할까요?`)) return;
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
        <button className="admin-btn ghost" onClick={() => setEditingId("new")}>
          + 새 항목
        </button>
      </div>

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
                  <span className="admin-filename">
                    {item.title || "(제목 없음)"}
                  </span>
                  {item.tag && <span className="admin-muted">{item.tag}</span>}
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
