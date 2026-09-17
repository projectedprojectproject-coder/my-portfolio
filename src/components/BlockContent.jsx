import { Fragment } from "react";

// 관리자 블록 에디터로 만든 [{type:'text'|'image', ...}] 배열을 렌더링.
// About / Research / Projects / Publications 가 공용으로 사용한다.
//
// 텍스트 블록은 원문처럼 여러 문단을 한 상자에 그대로 쓸 수 있게, 빈 줄을
// 문단 구분으로 보고 <p> 여러 개로 쪼갠다(줄바꿈 한 번은 <br/>로 유지).
// 이미지 블록은 link 가 있으면 클릭 시 그 주소로 이동하는 하이퍼링크가 된다.
export default function BlockContent({ blocks, textClassName }) {
  if (!blocks || blocks.length === 0) return null;

  const nodes = [];

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

    if (b.type === "text" && b.text) {
      b.text
        .split(/\n{2,}/)
        .map((para) => para.trim())
        .filter(Boolean)
        .forEach((para, pi) => {
          nodes.push(
            <p className={textClassName} key={`txt-${i}-${pi}`}>
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
  });

  if (nodes.length === 0) return null;
  return <div className="blocks-wrap">{nodes}</div>;
}
