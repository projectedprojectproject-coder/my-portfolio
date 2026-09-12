import { Link } from "react-router-dom";
import { useAuth } from "../lib/useAuth";
import AdminLogin from "./AdminLogin";
import AdminUpload from "./AdminUpload";
import "./admin.css";

// /admin — 로그인 안 됐으면 로그인 폼, 됐으면 업로더.
export default function AdminRoute() {
  const { session, loading, user, signOut } = useAuth();

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <Link to="/" className="admin-brand">
          ← 포트폴리오
        </Link>
        <span className="admin-brand-mark">MEDIA ADMIN</span>
        {session && (
          <span className="admin-topbar-right">
            <span className="admin-muted">{user?.email}</span>
            <button className="admin-btn ghost" onClick={signOut}>
              로그아웃
            </button>
          </span>
        )}
      </header>

      {loading ? (
        <p className="admin-muted admin-pad">세션 확인 중…</p>
      ) : session ? (
        <AdminUpload />
      ) : (
        <AdminLogin />
      )}
    </div>
  );
}
