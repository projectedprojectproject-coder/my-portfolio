// 문서 보기용 아주 작은 마크다운 렌더러 (외부 라이브러리 없음).
//
// 지원: # ~ #### 제목, 문단, - 목록, 1. 목록, > 인용, ``` 코드 블록, ---,
//       `인라인 코드`, **굵게**
// 미지원(그대로 글자로 보임): 표, 링크, 이미지, 중첩 목록, 원시 HTML
//
// 결과를 전부 React 요소로 만들기 때문에 dangerouslySetInnerHTML 을 쓰지 않는다.
// → 문서에 <script> 같은 HTML 이 들어 있어도 실행되지 않고 글자로만 보인다.
function inline(text) {
  const nodes = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0;
  let k = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    nodes.push(
      tok.startsWith("`") ? (
        <code key={k++}>{tok.slice(1, -1)}</code>
      ) : (
        <strong key={k++}>{tok.slice(2, -2)}</strong>
      )
    );
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

const BLOCK_START = /^(#{1,4}\s|```|>\s?|[-*]\s|\d+\.\s|---+\s*$)/;

export function renderMarkdown(src) {
  const lines = String(src).replace(/\r\n?/g, "\n").split("\n");
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    // ``` 코드 블록 (닫는 ``` 가 없으면 끝까지)
    if (line.startsWith("```")) {
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) buf.push(lines[i++]);
      i++;
      out.push(
        <pre className="md-code" key={out.length}>
          <code>{buf.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // 제목 — 섹션 제목이 h2 이므로 # 는 h3 부터 시작
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const Tag = `h${h[1].length + 2}`;
      out.push(
        <Tag className={`md-h md-h${h[1].length}`} key={out.length}>
          {inline(h[2])}
        </Tag>
      );
      i++;
      continue;
    }

    if (/^---+\s*$/.test(line)) {
      out.push(<hr className="md-hr" key={out.length} />);
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i++].replace(/^>\s?/, ""));
      }
      out.push(
        <blockquote className="md-quote" key={out.length}>
          {inline(buf.join(" "))}
        </blockquote>
      );
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i++].replace(/^[-*]\s+/, ""));
      }
      out.push(
        <ul className="md-list" key={out.length}>
          {items.map((t, n) => (
            <li key={n}>{inline(t)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i++].replace(/^\d+\.\s+/, ""));
      }
      out.push(
        <ol className="md-list" key={out.length}>
          {items.map((t, n) => (
            <li key={n}>{inline(t)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // 문단 — 첫 줄은 무조건 먹어서 어떤 입력에도 무한 반복이 생기지 않게 한다.
    const buf = [line.trim()];
    i++;
    while (i < lines.length && lines[i].trim() && !BLOCK_START.test(lines[i])) {
      buf.push(lines[i++].trim());
    }
    out.push(
      <p className="md-p" key={out.length}>
        {inline(buf.join(" "))}
      </p>
    );
  }

  return out;
}
