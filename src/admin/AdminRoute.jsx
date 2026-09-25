import { useState } from "react";
import { Link } from "react-router-dom";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import { useAuth } from "../lib/useAuth";
import AdminLogin from "./AdminLogin";
import AdminHero from "./AdminHero";
import AdminFeatured from "./AdminFeatured";
import AdminUpload from "./AdminUpload";
import AdminGallery from "./AdminGallery";
import ContentEditor from "./ContentEditor";
import "./admin.css";

const TABS = [
  { key: "hero", label: "헤더", Component: AdminHero },
  { key: "featured", label: "추천", Component: AdminFeatured },
  { key: "media", label: "미디어 업로드", Component: AdminUpload },
  { key: "gallery", label: "미디어 보기", Component: AdminGallery },
  { key: "content", label: "콘텐츠", Component: ContentEditor },
];

// /admin — 로그인 안 됐으면 로그인 폼, 됐으면 헤더/추천/미디어 업로드/미디어 보기/콘텐츠 탭.
export default function AdminRoute() {
  const { session, loading, user, signOut } = useAuth();
  const [tab, setTab] = useState(TABS[0].key);

  const Active = TABS.find((t) => t.key === tab)?.Component;

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

      {!isSupabaseConfigured && (
        <p className="admin-error admin-pad">
          Supabase 환경변수(VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)가
          설정되지 않았습니다. 로컬이면 .env.local, 배포 환경이면 Vercel의
          Environment Variables를 확인하고 다시 빌드/배포하세요.
        </p>
      )}

      {loading ? (
        <p className="admin-muted admin-pad">세션 확인 중…</p>
      ) : !session ? (
        <AdminLogin />
      ) : (
        <>
          <div className="admin-maintabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`admin-btn${tab === t.key ? "" : " ghost"}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          {Active && <Active />}
        </>
      )}
    </div>
  );
}
