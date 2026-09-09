import { research } from "../data";

export default function Research() {
  return (
    <section id="research" className="section">
      <div className="section-inner">
        <div className="section-mark">
          <span className="glyph">§</span>RESEARCH
        </div>
        <div>
          <h2>연구</h2>
          <div className="card-row">
            {research.map((item) => (
              <article className="idx-card" key={item.title}>
                <span className="idx-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                {item.paragraphs.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
                {item.note && <p className="note">{item.note}</p>}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
