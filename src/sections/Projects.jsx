import { projects } from "../data";
import { useEntries } from "../lib/useEntries";
import { useSectionTitles } from "../lib/useSectionTitles";
import BlockContent from "../components/BlockContent";

export default function Projects() {
  const entries = useEntries("projects");
  const titles = useSectionTitles();
  const useFallback = !entries || entries.length === 0;
  const items = useFallback
    ? projects.map((item) => ({
        ...item,
        subtitle: item.role,
        blocks: item.paragraphs.map((text) => ({ type: "text", text })),
      }))
    : entries;

  return (
    <section id="projects" className="section">
      <div className="section-inner">
        <div className="section-mark">
          <span className="glyph">§</span>PROJECTS
        </div>
        <div>
          <h2>{titles.projects || "프로젝트 & 창작"}</h2>
          <div className="card-row">
            {items.map((item) => (
              <article className="idx-card" key={item.id ?? item.title}>
                {item.tag && <span className="idx-tag">{item.tag}</span>}
                {item.title && <h3>{item.title}</h3>}
                {item.subtitle && <p className="idx-role">{item.subtitle}</p>}
                <BlockContent blocks={item.blocks} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
