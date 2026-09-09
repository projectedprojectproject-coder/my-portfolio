import { projects } from "../data";

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="section-inner">
        <div className="section-mark">
          <span className="glyph">§</span>PROJECTS
        </div>
        <div>
          <h2>프로젝트 &amp; 창작</h2>
          <div className="card-row">
            {projects.map((item) => (
              <article className="idx-card" key={item.title}>
                <span className="idx-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                {item.role && <p className="idx-role">{item.role}</p>}
                {item.paragraphs.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
