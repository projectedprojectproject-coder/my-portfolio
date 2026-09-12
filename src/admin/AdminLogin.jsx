import { useState } from "react";
import { useAuth } from "../lib/useAuth";

export default function AdminLogin() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = await signIn(email.trim(), password);
    setBusy(false);
    if (error) setError(error.message);
  }

  return (
    <form className="admin-card admin-login" onSubmit={onSubmit}>
      <h1 className="admin-title">관리자 로그인</h1>
      <p className="admin-muted">
        Supabase 에 등록된 관리자 계정으로만 로그인할 수 있습니다.
      </p>

      <label className="admin-field">
        <span>이메일</span>
        <input
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="admin-field">
        <span>비밀번호</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      {error && <p className="admin-error">{error}</p>}

      <button className="admin-btn" disabled={busy} type="submit">
        {busy ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
