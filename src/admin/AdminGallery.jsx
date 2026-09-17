import { useCallback, useEffect, useState } from "react";
import { supabase, MEDIA_BUCKET, MEDIA_TABLE } from "../lib/supabaseClient";

function publicUrl(path) {
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

function kindOf(mime) {
  if (!mime) return "file";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return "file";
}

const HIDDEN = new Set([".emptyFolderPlaceholder"]);

// "미디어 업로드" 탭과 분리된, 실제로 재생/미리보기가 되는 갤러리 화면.
export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

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
    const { data: metaRows } = await supabase
      .from(MEDIA_TABLE)
      .select("path,title,description")
      .in(
        "path",
        files.map((f) => f.name)
      );
    const map = {};
    for (const row of metaRows ?? []) map[row.path] = row;
    setMeta(map);
  }, []);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    refresh();
  }, [refresh]);

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
      <h1 className="admin-title">미디어 보기</h1>
      <p className="admin-muted">
        업로드된 파일을 실제로 재생/미리보기할 수 있는 갤러리입니다. 업로드·삭제·제목 편집은 "미디어 업로드" 탭에서 합니다.
      </p>

      {notice && <p className="admin-ok">{notice}</p>}
      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p className="admin-muted">불러오는 중…</p>
      ) : items.length === 0 ? (
        <p className="admin-muted">아직 파일이 없습니다.</p>
      ) : (
        <div className="admin-gallery">
          {items.map((f) => {
            const url = publicUrl(f.name);
            const kind = kindOf(f.metadata?.mimetype);
            const title = meta[f.name]?.title || f.name;
            const description = meta[f.name]?.description;
            return (
              <figure className="admin-gallery-item" key={f.name}>
                <div className="admin-gallery-preview">
                  {kind === "image" && <img src={url} alt={title} loading="lazy" />}
                  {kind === "video" && (
                    <video src={url} controls preload="metadata" />
                  )}
                  {kind === "audio" && <audio src={url} controls />}
                  {kind === "file" && (
                    <a href={url} target="_blank" rel="noreferrer" className="admin-gallery-file">
                      파일 열기
                    </a>
                  )}
                </div>
                <figcaption>
                  <span className="admin-filename">{title}</span>
                  {description && <span className="admin-muted">{description}</span>}
                  <button className="admin-btn ghost" onClick={() => copyUrl(f.name)}>
                    URL 복사
                  </button>
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}
    </div>
  );
}
