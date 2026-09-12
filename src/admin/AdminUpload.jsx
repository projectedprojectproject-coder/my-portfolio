import { useCallback, useEffect, useRef, useState } from "react";
import { supabase, MEDIA_BUCKET, MEDIA_TABLE } from "../lib/supabaseClient";

function publicUrl(path) {
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

function fmtSize(bytes) {
  if (bytes == null) return "";
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i > 0 && n < 10 ? 1 : 0)} ${units[i]}`;
}

const HIDDEN = new Set([".emptyFolderPlaceholder"]);

// 파일 한 줄 + "편집" 토글로 열리는 제목/설명 폼.
// key(=file.name)가 리프레시 동안 유지되므로 편집 중 입력값이 날아가지 않는다.
function MediaRow({ file, meta, onDelete, onCopyUrl, onSaved }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(meta?.title ?? "");
  const [description, setDescription] = useState(meta?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  async function save() {
    setSaving(true);
    setErr(null);
    const { error } = await supabase.from(MEDIA_TABLE).upsert(
      {
        path: file.name,
        title: title.trim() || null,
        description: description.trim() || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "path" }
    );
    setSaving(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setOpen(false);
    onSaved?.();
  }

  return (
    <li className="admin-media-row">
      <div className="admin-media-toprow">
        <div className="admin-fileinfo">
          <a
            href={publicUrl(file.name)}
            target="_blank"
            rel="noreferrer"
            className="admin-filename"
          >
            {title || file.name}
          </a>
          <span className="admin-muted">
            {file.name} · {fmtSize(file.metadata?.size)}
          </span>
        </div>
        <div className="admin-fileactions">
          <button className="admin-btn ghost" onClick={() => setOpen((v) => !v)}>
            {open ? "닫기" : "편집"}
          </button>
          <button className="admin-btn ghost" onClick={() => onCopyUrl(file.name)}>
            URL 복사
          </button>
          <button className="admin-btn danger" onClick={() => onDelete(file.name)}>
            삭제
          </button>
        </div>
      </div>

      {open && (
        <div className="admin-media-edit">
          <label className="admin-field">
            <span>제목</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={file.name}
            />
          </label>
          <label className="admin-field">
            <span>설명</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </label>
          {err && <p className="admin-error">{err}</p>}
          <button className="admin-btn" disabled={saving} onClick={save}>
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      )}
    </li>
  );
}

export default function AdminUpload() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setError(null);
    const files = (data ?? []).filter((f) => f.name && !HIDDEN.has(f.name));
    setItems(files);

    if (files.length === 0) {
      setMeta({});
      return;
    }
    const { data: metaRows, error: metaErr } = await supabase
      .from(MEDIA_TABLE)
      .select("path,title,description")
      .in(
        "path",
        files.map((f) => f.name)
      );
    if (metaErr) {
      // media 테이블(제목/설명)이 아직 없으면 여기로 옴 — 업로드/삭제엔 지장 없음.
      console.warn("[media meta] 조회 실패 (supabase/media_table.sql 실행했는지 확인):", metaErr.message);
      return;
    }
    const map = {};
    for (const row of metaRows ?? []) map[row.path] = row;
    setMeta(map);
  }, []);

  useEffect(() => {
    // 마운트 시 1회 목록 로드. refresh 는 외부 시스템(Storage) 동기화라 effect 안에서 호출한다.
    // oxlint-disable-next-line react/set-state-in-effect
    refresh();
  }, [refresh]);

  async function onFiles(fileList) {
    const files = Array.from(fileList ?? []);
    if (files.length === 0) return;
    setBusy(true);
    setError(null);
    setNotice(null);

    const results = [];
    for (const file of files) {
      const safeName = file.name.replace(/[^\w.-]+/g, "_");
      const path = `${Date.now()}-${safeName}`;
      const { error } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (!error) {
        // 기본 제목 = 원본 파일명. 실패해도(테이블 없음 등) 업로드 자체는 유효.
        await supabase
          .from(MEDIA_TABLE)
          .upsert({ path, title: file.name }, { onConflict: "path" });
      }
      results.push({ name: file.name, ok: !error, msg: error?.message });
    }

    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";

    const failed = results.filter((r) => !r.ok);
    const okCount = results.length - failed.length;
    if (okCount) setNotice(`${okCount}개 업로드 완료`);
    if (failed.length) {
      setError(failed.map((f) => `${f.name}: ${f.msg}`).join(" / "));
    }
    refresh();
  }

  async function onDelete(name) {
    if (!window.confirm(`"${name}" 을(를) 삭제할까요?`)) return;
    setError(null);
    const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([name]);
    if (error) {
      setError(error.message);
      return;
    }
    await supabase.from(MEDIA_TABLE).delete().eq("path", name);
    setNotice("삭제됨");
    refresh();
  }

  async function copyUrl(name) {
    const url = publicUrl(name);
    try {
      await navigator.clipboard.writeText(url);
      setNotice("URL 복사됨");
    } catch {
      setNotice(url);
    }
  }

  return (
    <div className="admin-card">
      <h1 className="admin-title">미디어 업로드</h1>

      <div
        className="admin-drop"
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFiles(e.dataTransfer.files);
        }}
      >
        <p>파일을 끌어다 놓거나 클릭해서 선택</p>
        <p className="admin-muted">비디오 · 오디오 · 이미지 (여러 개 가능)</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept="video/*,audio/*,image/*"
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>

      {busy && <p className="admin-muted">업로드 중…</p>}
      {notice && <p className="admin-ok">{notice}</p>}
      {error && <p className="admin-error">{error}</p>}

      <div className="admin-listhead">
        <span>파일 ({items.length})</span>
        <button className="admin-btn ghost" onClick={refresh} disabled={loading}>
          새로고침
        </button>
      </div>

      {loading ? (
        <p className="admin-muted">불러오는 중…</p>
      ) : items.length === 0 ? (
        <p className="admin-muted">아직 파일이 없습니다.</p>
      ) : (
        <ul className="admin-filelist">
          {items.map((f) => (
            <MediaRow
              key={f.name}
              file={f}
              meta={meta[f.name]}
              onDelete={onDelete}
              onCopyUrl={copyUrl}
              onSaved={refresh}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
