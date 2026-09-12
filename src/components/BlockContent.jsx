// 관리자 블록 에디터로 만든 [{type:'text'|'image', ...}] 배열을 렌더링.
// About / Research / Projects / Publications 가 공용으로 사용한다.
export default function BlockContent({ blocks, textClassName, paragraphKey }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="blocks-wrap">
      {blocks.map((b, i) => {
        const key = paragraphKey ? `${paragraphKey}-${i}` : i;
        if (b.type === "image" && b.url) {
          return (
            <figure
              className={`block-image align-${b.align || "center"}`}
              key={key}
            >
              <img src={b.url} alt={b.caption || ""} loading="lazy" />
              {b.caption && <figcaption>{b.caption}</figcaption>}
            </figure>
          );
        }
        if (b.type === "text" && b.text) {
          return (
            <p className={textClassName} key={key}>
              {b.text}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}
