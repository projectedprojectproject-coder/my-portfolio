import { publication } from "../data";
import bookCover from "../assets/book-cover.png";
import { useEntries } from "../lib/useEntries";
import BlockContent from "../components/BlockContent";

export default function Publications() {
  const entries = useEntries("publications");
  const useFallback = !entries || entries.length === 0;
  const entry = useFallback
    ? {
        tag: publication.tag,
        title: publication.title,
        subtitle: publication.author,
        blocks: publication.paragraphs.map((text) => ({ type: "text", text })),
      }
    : entries[0];

  return (
    <section id="publications" className="section">
      <div className="section-inner">
        <div className="section-mark">
          <span className="glyph">§</span>PUBLICATIONS
        </div>
        <div>
          <h2>저서</h2>
          <div className="pub-feature">
            <a
              className="pub-cover"
              href={publication.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={bookCover} alt={`${entry.title ?? publication.title} 표지`} />
            </a>
            <div className="pub-body">
              {entry.tag && <span className="idx-tag">{entry.tag}</span>}
              {entry.title && <h3>{entry.title}</h3>}
              {entry.subtitle && <p className="pub-author">{entry.subtitle}</p>}
              <BlockContent blocks={entry.blocks} textClassName="pub-desc" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
