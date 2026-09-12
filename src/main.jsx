import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";
import App from "./App.jsx";

// /admin 은 여기서 지연 로드한다. Supabase 관련 코드가 홈 화면 번들에
// 섞여 들어가면, 환경변수 문제 등으로 그쪽이 죽었을 때 포트폴리오
// 본문까지 함께 하얗게 죽는다 — 실제로 겪었던 문제라 분리해 둔다.
const AdminRoute = lazy(() => import("./admin/AdminRoute.jsx"));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={null}>
              <AdminRoute />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
