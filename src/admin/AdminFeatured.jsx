import { useCallback, useEffect, useRef, useState } from "react";
import { supabase, MEDIA_BUCKET, FEATURED_TABLE } from "../lib/supabaseClient";

function FeaturedEditor({ item, onSaved, onCancel }) {
  const [photoUrl, setPhotoUrl] = useState(item?.photo_url || "");
  const [text, setText] = useState(item?.text || "");
  const [link, setLink] = useState(item?.link || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  async function onPhotoFile(file) {
    if (!file) return;
    setUploading(true);
    setError(null);
    const safeName = file.name.replace(/[^\w.-]+/g, "_");
    const path = `featured-${Date.now()}-${safeName}`;
    const { error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (error) {
      setError(error.message);
      return;
    }
    setPhotoUrl(supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl);
  }

  async function save() {
    setSaving(true);
    setError(null);
    const payload = {
      photo_url: photoUrl.trim() || null,
      text: text.trim() || null,
      link: link.trim() || null,
      updated_at: new Date().toISOString(),
    };
    const { error } = item?.id
      ? await supabase.from(FEATURED_TABLE).update(payload).eq("id", item.id)
      : await supabase
          .from(FEATURED_TABLE)
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
      <div className="admin-field">
        <span>썸네일 사진</span>
        <div className="admin-thumb-editor">
          {photoUrl ? (
            <img src={photoUrl} alt="" className="admin-thumb-preview admin-thumb-preview-wide" />
          ) : (
            <div className="admin-thumb-empty admin-thumb-empty-wide">사진 없음</div>
          )}
          <div className="admin-thumb-actions">
            <label className="admin-btn ghost">
              {uploading ? "업로드 중…" : "사진 올리기"}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => onPhotoFile(e.target.files?.[0])}
              />
            </label>
            {photoUrl && (
              <button
                type="button"
                className="admin-btn danger"
                onClick={() => setPhotoUrl("")}
              >
                사진 제거
              </button>
            )}
          </div>
        </div>
      </div>

      <label className="admin-field">
        <span>썸네일 글 (첫 줄 = 큰 제목, 다음 줄부터 = 작은 캡션)</span>
        <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
      </label>

      <label className="admin-field">
        <span>하이퍼링크 (예: #research, #projects, #publications 또는 https://...)</span>
        <input value={link} onChange={(e) => setLink(e.target.value)} />
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

export default function AdminFeatured() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // null | 'new' | id

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from(FEATURED_TABLE)
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
    await supabase.from(FEATURED_TABLE).update({ position: other.position }).eq("id", item.id);
    await supabase.from(FEATURED_TABLE).update({ position: item.position }).eq("id", other.id);
    refresh();
  }

  async function remove(item) {
    if (!window.confirm("이 카드를 삭제할까요?")) return;
    const { error } = await supabase.from(FEATURED_TABLE).delete().eq("id", item.id);
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
        <h1 className="admin-title">새 추천 카드</h1>
        <FeaturedEditor
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
        <h1 className="admin-title">추천 카드 편집</h1>
        <FeaturedEditor
          item={editingItem}
          onSaved={closeEditor}
          onCancel={() => setEditingId(null)}
        />
      </div>
    );
  }

  return (
    <div className="admin-card">
      <h1 className="admin-title">추천</h1>
      <p className="admin-muted">
        소개 아래에 나오는 썸네일 카드입니다. 클릭하면 링크로 이동합니다.
        비어 있으면 홈 화면에 이 섹션이 아예 나타나지 않습니다.
      </p>

      <div className="admin-listhead">
        <span>카드 ({items.length})</span>
        <button className="admin-btn ghost" onClick={() => setEditingId("new")}>
          + 새 카드
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p className="admin-muted">불러오는 중…</p>
      ) : items.length === 0 ? (
        <p className="admin-muted">아직 카드가 없습니다.</p>
      ) : (
        <ul className="admin-filelist">
          {items.map((item, i) => (
            <li className="admin-media-row" key={item.id}>
              <div className="admin-media-toprow">
                <div className="admin-fileinfo">
                  {item.photo_url && (
                    <img src={item.photo_url} alt="" className="admin-thumb-mini" />
                  )}
                  <span className="admin-filename">
                    {(item.text || "").split("\n")[0] || "(빈 카드)"}
                  </span>
                  {item.link && <span className="admin-muted">{item.link}</span>}
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
