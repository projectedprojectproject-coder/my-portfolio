import { Fragment } from "react";
import { splitTitleCaption } from "../lib/splitTitleCaption";

// 관리자 블록 에디터로 만든 블록 배열을 렌더링.
// 블록 타입 3가지: text(원문 그대로 여러 문단), note(강조 메모 박스),
// thumb(추천 썸네일 카드 — 사진+글+링크, Featured 카드와 같은 모양).
// About / Research / Projects / Publications 가 공용으로 사용한다.
export default function BlockContent({ blocks, textClassName }) {
  if (!blocks || blocks.length === 0) return null;

  const nodes = [];

  function paragraphs(text, key, className) {
    text
      .split(/\n{2,}/)
      .map((para) => para.trim())
      .filter(Boolean)
      .forEach((para, pi) => {
        nodes.push(
          <p className={className} key={`${key}-${pi}`}>
            {para.split("\n").map((line, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        );
      });
  }

  blocks.forEach((b, i) => {
    if (b.type === "image" && b.url) {
      const img = <img src={b.url} alt={b.caption || ""} loading="lazy" />;
      nodes.push(
        <figure className={`block-image align-${b.align || "center"}`} key={`img-${i}`}>
          {b.link ? (
            <a href={b.link} target="_blank" rel="noopener noreferrer">
              {img}
            </a>
          ) : (
            img
          )}
          {b.caption && <figcaption>{b.caption}</figcaption>}
        </figure>
      );
      return;
    }

    if (b.type === "thumb" && (b.url || b.text)) {
      const { title, caption } = splitTitleCaption(b.text);
      nodes.push(
        <a
          className={`block-thumb align-${b.align || "center"}`}
          href={b.link || "#top"}
          key={`thumb-${i}`}
          style={b.url ? { backgroundImage: `url(${b.url})` } : undefined}
        >
          <span className="block-thumb-text">
            {title && <span className="block-thumb-title">{title}</span>}
            {caption && <span className="block-thumb-caption">{caption}</span>}
          </span>
        </a>
      );
      return;
    }

    if (b.type === "note" && b.text) {
      const before = nodes.length;
      paragraphs(b.text, `note-p-${i}`, undefined);
      const noteParagraphs = nodes.splice(before);
      nodes.push(
        <aside className="block-note" key={`note-${i}`}>
          {noteParagraphs}
        </aside>
      );
      return;
    }

    if (b.type === "text" && b.text) {
      paragraphs(b.text, `txt-${i}`, textClassName);
    }
  });

  if (nodes.length === 0) return null;
  return <div className="blocks-wrap">{nodes}</div>;
}
