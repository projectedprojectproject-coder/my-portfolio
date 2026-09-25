import { useEffect, useRef, useState } from "react";
import { supabase, MEDIA_BUCKET, HERO_TABLE } from "../lib/supabaseClient";

export default function AdminHero() {
  const [loading, setLoading] = useState(true);
  const [eyebrow, setEyebrow] = useState("");
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [body, setBody] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    supabase
      .from(HERO_TABLE)
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error }) => {
        setLoading(false);
        if (error || !data) return;
        setEyebrow(data.eyebrow || "");
        setHeadline(data.headline || "");
        setSubtitle(data.subtitle || "");
        setBody(data.body || "");
        setPhotoUrl(data.photo_url || "");
      });
  }, []);

  async function save() {
    setSaving(true);
    setError(null);
    setNotice(null);
    const { error } = await supabase.from(HERO_TABLE).upsert({
      id: 1,
      eyebrow: eyebrow.trim() || null,
      headline: headline.trim() || null,
      subtitle: subtitle.trim() || null,
      body: body.trim() || null,
      photo_url: photoUrl.trim() || null,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setNotice("저장됨 — 홈 화면에 반영됩니다");
  }

  async function onPhotoFile(file) {
    if (!file) return;
    setUploading(true);
    setError(null);
    const safeName = file.name.replace(/[^\w.-]+/g, "_");
    const path = `hero-${Date.now()}-${safeName}`;
    const { error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (error) {
      setError(error.message);
      return;
    }
    const url = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
    setPhotoUrl(url);
    setNotice("사진 업로드됨 — 아래 저장 버튼을 눌러야 홈 화면에 반영됩니다");
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
      <h1 className="admin-title">헤더 편집</h1>
      <p className="admin-muted">
        홈 화면 맨 위 히어로 영역의 문구와 썸네일 사진을 수정합니다.
      </p>

      <label className="admin-field">
        <span>아이브로 (작은 라벨)</span>
        <input value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} />
      </label>

      <label className="admin-field">
        <span>헤드라인 (줄바꿈하면 여러 줄로 나뉩니다)</span>
        <textarea
          rows={3}
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
        />
      </label>

      <label className="admin-field">
        <span>서브타이틀 (예: FILM · GENERATIVE AI · DIGITAL MEDIA RESEARCH)</span>
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
      </label>

      <label className="admin-field">
        <span>본문</span>
        <textarea
          className="block-editor-body"
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </label>

      <div className="admin-field">
        <span>썸네일 사진</span>
        <div className="admin-thumb-editor">
          {photoUrl ? (
            <img src={photoUrl} alt="" className="admin-thumb-preview" />
          ) : (
            <div className="admin-thumb-empty">사진 없음</div>
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
          <p className="admin-muted">
            사진을 제거하면 사진 없이 글만 있는 원래 레이아웃으로 돌아갑니다.
          </p>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {notice && <p className="admin-ok">{notice}</p>}

      <button className="admin-btn" disabled={saving} onClick={save}>
        {saving ? "저장 중…" : "저장"}
      </button>
    </div>
  );
}
