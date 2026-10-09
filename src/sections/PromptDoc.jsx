import { useState } from "react";
import { renderMarkdown } from "../lib/miniMarkdown";
import { useSectionTitles } from "../lib/useSectionTitles";

// public/docs/ 아래의 .md 파일을 그대로 내려받게 하고, 펼치면 화면에서도 읽을 수 있게 한다.
const DOC = {
  tag: "AI 지시문 · Markdown",
  title: "이 웹사이트를 만든 시스템 프롬프트",
  description:
    "사이트를 만들면서 AI에게 한 요청과 정한 규칙을, 수업에서 배운 프롬프트 구조(현재 상황 · 목표 · 구체적인 변경 · 유지할 것 · 완료 기준 · 결과물)로 정리한 문서입니다.",
  file: "/docs/website-system-prompt.md",
  downloadName: "website-system-prompt.md",
};

export default function PromptDoc() {
  const titles = useSectionTitles();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(null); // null = 아직 안 불러옴, string = 성공, false = 실패

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (!next || text !== null) return;
    try {
      const res = await fetch(DOC.file);
      // 파일이 없으면 사이트가 index.html 을 대신 내주는 경우가 있어 형식도 확인한다.
      const type = res.headers.get("content-type") || "";
      if (!res.ok || /text\/html/i.test(type)) throw new Error("not a markdown file");
      setText(await res.text());
    } catch {
      setText(false);
    }
  }

  return (
    <section id="prompt" className="section">
      <div className="section-inner">
        <div className="section-mark">
          <span className="glyph">§</span>PROMPT
        </div>
        <div>
          <h2>{titles.prompt || "시스템 프롬프트"}</h2>

          <article className="idx-card promptdoc-card">
            <span className="idx-tag">{DOC.tag}</span>
            <h3>{DOC.title}</h3>
            <p>{DOC.description}</p>

            <div className="promptdoc-actions">
              <button
                type="button"
                className="promptdoc-btn"
                aria-expanded={open}
                aria-controls="promptdoc-body"
                onClick={toggle}
              >
                {open ? "접기" : "화면에서 읽기"}
              </button>
              <a
                className="text-link"
                href={DOC.file}
                download={DOC.downloadName}
              >
                .md 파일 내려받기 <span className="arrow">↓</span>
              </a>
            </div>

            {open && (
              <div className="md-body" id="promptdoc-body">
                {text === null && <p className="md-p">불러오는 중…</p>}
                {text === false && (
                  <p className="md-p">
                    문서를 불러오지 못했습니다. 위의 .md 파일 내려받기로 열어 보세요.
                  </p>
                )}
                {typeof text === "string" && renderMarkdown(text)}
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
