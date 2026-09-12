import { useState } from "react";
import { supabase, ENTRIES_TABLE } from "../lib/supabaseClient";
import BlockEditor from "./BlockEditor";

// entry 가 없으면(신규) insert, 있으면 update.
export default function EntryEditor({ section, entry, onSaved, onCancel }) {
  const [tag, setTag] = useState(entry?.tag ?? "");
  const [title, setTitle] = useState(entry?.title ?? "");
  const [subtitle, setSubtitle] = useState(entry?.subtitle ?? "");
  const [note, setNote] = useState(entry?.note ?? "");
  const [blocks, setBlocks] = useState(entry?.blocks ?? []);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  async function save() {
    setSaving(true);
    setErr(null);

    const payload = {
      section,
      tag: tag.trim() || null,
      title: title.trim() || null,
      subtitle: subtitle.trim() || null,
      note: note.trim() || null,
      blocks,
      updated_at: new Date().toISOString(),
    };

    const { error } = entry?.id
      ? await supabase.from(ENTRIES_TABLE).update(payload).eq("id", entry.id)
      : await supabase
          .from(ENTRIES_TABLE)
          .insert({ ...payload, position: entry?.position ?? 0 });

    setSaving(false);
    if (error) {
      setErr(error.message);
      return;
    }
    onSaved?.();
  }

  return (
    <div className="admin-entry-editor">
      <label className="admin-field">
        <span>태그</span>
        <input value={tag} onChange={(e) => setTag(e.target.value)} />
      </label>
      <label className="admin-field">
        <span>제목</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label className="admin-field">
        <span>부제 (역할 · 저자 등)</span>
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
      </label>
      <label className="admin-field">
        <span>메모 (하단 작은 글씨, 선택)</span>
        <input value={note} onChange={(e) => setNote(e.target.value)} />
      </label>

      <label className="admin-field">
        <span>본문 블록</span>
        <BlockEditor blocks={blocks} onChange={setBlocks} />
      </label>

      {err && <p className="admin-error">{err}</p>}

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
