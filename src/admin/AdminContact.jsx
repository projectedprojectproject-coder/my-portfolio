import { useEffect, useState } from "react";
import { supabase, CONTACT_TABLE } from "../lib/supabaseClient";

export default function AdminContact() {
  const [loading, setLoading] = useState(true);
  const [copy, setCopy] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    supabase
      .from(CONTACT_TABLE)
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error }) => {
        setLoading(false);
        if (error || !data) return;
        setCopy(data.copy || "");
        setEmail(data.email || "");
      });
  }, []);

  async function save() {
    setSaving(true);
    setError(null);
    setNotice(null);
    const { error } = await supabase.from(CONTACT_TABLE).upsert({
      id: 1,
      copy: copy.trim() || null,
      email: email.trim() || null,
      updated_at: new Date().toISOString(),
    });
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
      <h1 className="admin-title">Contact 편집</h1>
      <p className="admin-muted">
        홈 화면 맨 아래 연락처 영역입니다. 비워두면 원래 기본 문구/이메일로 돌아갑니다.
      </p>

      <label className="admin-field">
        <span>안내 문구</span>
        <textarea rows={3} value={copy} onChange={(e) => setCopy(e.target.value)} />
      </label>

      <label className="admin-field">
        <span>이메일 (클릭하면 메일 작성 창이 열립니다)</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      {error && <p className="admin-error">{error}</p>}
      {notice && <p className="admin-ok">{notice}</p>}

      <button className="admin-btn" disabled={saving} onClick={save}>
        {saving ? "저장 중…" : "저장"}
      </button>
    </div>
  );
}
