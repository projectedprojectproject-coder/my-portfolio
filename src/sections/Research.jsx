import { research } from "../data";
import { useEntries } from "../lib/useEntries";
import BlockContent from "../components/BlockContent";

export default function Research() {
  const entries = useEntries("research");
  const useFallback = !entries || entries.length === 0;
  const items = useFallback
    ? research.map((item) => ({
        ...item,
        blocks: item.paragraphs.map((text) => ({ type: "text", text })),
      }))
    : entries;

  return (
    <section id="research" className="section">
      <div className="section-inner">
        <div className="section-mark">
          <span className="glyph">§</span>RESEARCH
        </div>
        <div>
          <h2>연구</h2>
          <div className="card-row">
            {items.map((item) => (
              <article className="idx-card" key={item.id ?? item.title}>
                {item.tag && <span className="idx-tag">{item.tag}</span>}
                {item.title && <h3>{item.title}</h3>}
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
