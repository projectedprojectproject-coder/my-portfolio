import { publication } from "../data";
import { useEntries } from "../lib/useEntries";
import { useSectionTitles } from "../lib/useSectionTitles";
import BlockContent from "../components/BlockContent";

// 연구 섹션과 같은 카드 방식 — 항목을 여러 개 추가/삭제/순서변경할 수 있고
// 표지 사진·외부 링크는 없다.
export default function Publications() {
  const entries = useEntries("publications");
  const titles = useSectionTitles();
  const useFallback = !entries || entries.length === 0;
  const items = useFallback
    ? [
        {
          tag: publication.tag,
          title: publication.title,
          subtitle: publication.author,
          blocks: publication.paragraphs.map((text) => ({ type: "text", text })),
        },
      ]
    : entries;

  return (
    <section id="publications" className="section">
      <div className="section-inner">
        <div className="section-mark">
          <span className="glyph">§</span>PUBLICATIONS
        </div>
        <div>
          <h2>{titles.publications || "저서"}</h2>
          <div className="card-row">
            {items.map((item) => (
              <article className="idx-card" key={item.id ?? item.title}>
                {item.tag && <span className="idx-tag">{item.tag}</span>}
                {item.title && <h3>{item.title}</h3>}
                {item.subtitle && <p className="idx-role">{item.subtitle}</p>}
                <BlockContent blocks={item.blocks} />
                {item.note && <p className="note">{item.note}</p>}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
