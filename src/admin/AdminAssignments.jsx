import { useCallback, useEffect, useState } from "react";
import { supabase, ASSIGNMENTS_TABLE } from "../lib/supabaseClient";
import { safeUrl } from "../lib/safeUrl";

function AssignmentEditor({ item, onSaved, onCancel }) {
  const [tag, setTag] = useState(item?.tag || "");
  const [title, setTitle] = useState(item?.title || "");
  const [subtitle, setSubtitle] = useState(item?.subtitle || "");
  const [description, setDescription] = useState(item?.description || "");
  const [controls, setControls] = useState(item?.controls || "");
  const [src, setSrc] = useState(item?.src || "");
  const [source, setSource] = useState(item?.source || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function save() {
    if (!title.trim()) {
      setError("제목을 입력해 주세요.");
      return;
    }
    // 방문자 화면에 그대로 쓰이는 주소라, 안전한 형태만 저장한다.
    if (src.trim() && !safeUrl(src, { httpsOnly: true })) {
      setError(
        "게임 주소는 https:// 로 시작하는 주소이거나, /games/… 처럼 이 사이트 안의 경로여야 합니다."
      );
      return;
    }
    if (source.trim() && !safeUrl(source)) {
      setError("소스 링크는 http(s):// 로 시작하는 주소여야 합니다.");
      return;
    }

    setSaving(true);
    setError(null);
    const payload = {
      tag: tag.trim() || null,
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      description: description.trim() || null,
      controls: controls.trim() || null,
      src: src.trim() || null,
      source: source.trim() || null,
      updated_at: new Date().toISOString(),
    };
    const { error } = item?.id
      ? await supabase.from(ASSIGNMENTS_TABLE).update(payload).eq("id", item.id)
      : await supabase
          .from(ASSIGNMENTS_TABLE)
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
        <span>작은 라벨 (선택, 예: 수업 과제 · Week 4)</span>
        <input value={tag} onChange={(e) => setTag(e.target.value)} />
      </label>

      <label className="admin-field">
        <span>제목</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>

      <label className="admin-field">
        <span>부제 (선택)</span>
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
      </label>

      <label className="admin-field">
        <span>설명 (줄바꿈이 그대로 표시됩니다)</span>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label className="admin-field">
        <span>게임 주소 (선택)</span>
        <input
          value={src}
          onChange={(e) => setSrc(e.target.value)}
          placeholder="https://… 또는 /games/폴더/index.html"
        />
      </label>
      <p className="admin-muted">
        비워두면 게임 없이 글만 있는 카드가 됩니다. 외부 주소는 다른 사이트가 화면
        삽입을 허용해야 보입니다. 새 게임 파일을 이 사이트 안에 넣으려면 코드에
        추가해야 하니 Claude에게 요청해 주세요.
      </p>

      <label className="admin-field">
        <span>조작 안내 (게임이 있을 때만 표시)</span>
        <input value={controls} onChange={(e) => setControls(e.target.value)} />
      </label>

      <label className="admin-field">
        <span>"소스 보기" 링크 (선택)</span>
        <input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="https://github.com/…"
        />
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

export default function AdminAssignments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // null | 'new' | id

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from(ASSIGNMENTS_TABLE)
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
    await supabase.from(ASSIGNMENTS_TABLE).update({ position: other.position }).eq("id", item.id);
    await supabase.from(ASSIGNMENTS_TABLE).update({ position: item.position }).eq("id", other.id);
    refresh();
  }

  async function remove(item) {
    if (!window.confirm(`"${item.title}" 과제를 삭제할까요?`)) return;
    const { error } = await supabase.from(ASSIGNMENTS_TABLE).delete().eq("id", item.id);
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
        <h1 className="admin-title">새 과제</h1>
        <AssignmentEditor
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
        <h1 className="admin-title">과제 편집</h1>
        <AssignmentEditor
          item={editingItem}
          onSaved={closeEditor}
          onCancel={() => setEditingId(null)}
        />
      </div>
    );
  }

  return (
    <div className="admin-card">
      <h1 className="admin-title">과제</h1>
      <p className="admin-muted">
        홈 화면 "과제" 섹션의 카드입니다. 모두 지우면 원래 기본 과제(커피 배달
        게임)가 다시 나타납니다.
      </p>

      <div className="admin-listhead">
        <span>과제 ({items.length})</span>
        <button className="admin-btn ghost" onClick={() => setEditingId("new")}>
          + 새 과제
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p className="admin-muted">불러오는 중…</p>
      ) : items.length === 0 ? (
        <p className="admin-muted">
          아직 편집한 과제가 없습니다 — 지금은 홈 화면에 기본 과제가 보입니다.
          (supabase/assignments_table.sql 을 실행하셨다면 기본 과제가 여기에 들어 있어야 합니다.)
        </p>
      ) : (
        <ul className="admin-filelist">
          {items.map((item, i) => (
            <li className="admin-media-row" key={item.id}>
              <div className="admin-media-toprow">
                <div className="admin-fileinfo">
                  <span className="admin-filename">{item.title}</span>
                  <span className="admin-muted">
                    {[item.tag, item.src ? "게임 있음" : "글만"].filter(Boolean).join(" · ")}
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
