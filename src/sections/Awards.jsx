import { awards } from "../data";

export default function Awards() {
  return (
    <section id="awards" className="section">
      <div className="section-inner">
        <div className="section-mark">
          <span className="glyph">§</span>AWARDS
        </div>
        <div>
          <h2>수상 · 자격증</h2>
          <div className="credential-list">
            {awards.map((item) => (
              <div className="credential-item" key={item.title}>
                <span className="credential-tag">{item.kind}</span>
                <span className="credential-title">{item.title}</span>
                {item.meta && (
                  <span className="credential-meta">{item.meta}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
