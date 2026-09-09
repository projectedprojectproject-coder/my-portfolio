import { useEffect, useState } from "react";

// 스크롤 위치에 따라 현재 보고 있는 섹션의 id 를 돌려주는 훅.
// 원본 HTML 의 IntersectionObserver 스크립트를 React 방식으로 옮긴 것.
export function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
