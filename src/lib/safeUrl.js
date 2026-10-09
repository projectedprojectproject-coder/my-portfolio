// 관리자가 입력한 주소를 방문자 화면(iframe src, 링크 href)에 쓰기 전에 거르는 함수.
// javascript:, data: 같은 위험한 주소는 null 로 막는다.
//  - 사이트 안 경로: "/games/x/index.html" (// 로 시작하는 외부 주소 형태는 제외)
//  - 외부 주소: https:// (frame 용). 링크(href)에는 http:// 도 허용.
export function safeUrl(value, { httpsOnly = false } = {}) {
  const v = (value || "").trim();
  if (!v) return null;
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  try {
    const u = new URL(v);
    if (u.protocol === "https:") return u.href;
    if (u.protocol === "http:" && !httpsOnly) return u.href;
    return null;
  } catch {
    return null;
  }
}
