import { useCallback, useEffect, useState } from "react";
import { supabase, AWARDS_TABLE } from "../lib/supabaseClient";

const KIND_SUGGESTIONS = ["Award", "Certificate", "Language"];

function AwardEditor({ item, onSaved, onCancel }) {
  const [kind, setKind] = useState(item?.kind || "");
  const [title, setTitle] = useState(item?.title || "");
  const [meta, setMeta] = useState(item?.meta || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function save() {
    if (!title.trim()) {
      setError("내용(제목)을 입력해 주세요.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      kind: kind.trim() || null,
      title: title.trim(),
      meta: meta.trim() || null,
      updated_at: new Date().toISOString(),
    };
    const { error } = item?.id
      ? await supabase.from(AWARDS_TABLE).update(payload).eq("id", item.id)
      : await supabase
          .from(AWARDS_TABLE)
          .insert({ ...payload, position: item?.position ?? 0 });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    onSaved?.();
  }

  return (
    <div className="admin-entry-editor">
      <label className="admin-field">
        <span>분류 라벨 (왼쪽 작은 글씨)</span>
        <input
          list="award-kinds"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          placeholder="Award / Certificate / Language …"
        />
        <datalist id="award-kinds">
          {KIND_SUGGESTIONS.map((k) => (
            <option key={k} value={k} />
          ))}
        </datalist>
      </label>

      <label className="admin-field">
        <span>내용</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>

      <label className="admin-field">
        <span>오른쪽 작은 글씨 (연도·점수 등, 선택)</span>
        <input value={meta} onChange={(e) => setMeta(e.target.value)} />
      </label>

      {error && <p className="admin-error">{error}</p>}

      <div className="block-editor-add">
        <button className="admin-btn" disabled={saving} onClick={save}>
          {saving ? "저장 중…" : "저장"}
        </button>
        <button className="admin-btn ghost" onClick={onCancel}>
          취소
        </button>
      </div>
    </div>
  );
}

export default function AdminAwards() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // null | 'new' | id

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from(AWARDS_TABLE)
      .select("*")
      .order("position", { ascending: true });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setError(null);
    setItems(data ?? []);
  }, []);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    refresh();
  }, [refresh]);

  async function move(item, dir) {
    const idx = items.findIndex((i) => i.id === item.id);
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const other = items[j];
    await supabase.from(AWARDS_TABLE).update({ position: other.position }).eq("id", item.id);
    await supabase.from(AWARDS_TABLE).update({ position: item.position }).eq("id", other.id);
    refresh();
  }

  async function remove(item) {
    if (!window.confirm(`"${item.title}" 항목을 삭제할까요?`)) return;
    const { error } = await supabase.from(AWARDS_TABLE).delete().eq("id", item.id);
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
      <div className="admin-card">
        <h1 className="admin-title">새 항목</h1>
        <AwardEditor
          item={{ position: nextPosition }}
          onSaved={closeEditor}
          onCancel={() => setEditingId(null)}
        />
      </div>
    );
  }
  const editingItem = items.find((i) => i.id === editingId);
  if (editingItem) {
    return (
      <div className="admin-card">
        <h1 className="admin-title">항목 편집</h1>
        <AwardEditor
          item={editingItem}
          onSaved={closeEditor}
          onCancel={() => setEditingId(null)}
        />
      </div>
    );
  }

  return (
    <div className="admin-card">
      <h1 className="admin-title">수상 · 자격증</h1>
      <p className="admin-muted">
        홈 화면 "수상 · 자격증" 목록입니다. 항목을 모두 지우면 원래 기본 목록이
        다시 나타납니다.
      </p>

      <div className="admin-listhead">
        <span>항목 ({items.length})</span>
        <button className="admin-btn ghost" onClick={() => setEditingId("new")}>
          + 새 항목
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p className="admin-muted">불러오는 중…</p>
      ) : items.length === 0 ? (
        <p className="admin-muted">
          아직 편집한 항목이 없습니다 — 지금은 홈 화면에 원래 기본 목록이 보입니다.
          (supabase/awards_contact_tables.sql 을 실행하셨다면 기본 목록이 여기에 들어 있어야 합니다.)
        </p>
      ) : (
        <ul className="admin-filelist">
          {items.map((item, i) => (
            <li className="admin-media-row" key={item.id}>
              <div className="admin-media-toprow">
                <div className="admin-fileinfo">
                  <span className="admin-filename">{item.title}</span>
                  <span className="admin-muted">
                    {[item.kind, item.meta].filter(Boolean).join(" · ")}
                  </span>
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
