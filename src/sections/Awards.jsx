import { awards } from "../data";
import { useAwardsList } from "../lib/useAwardsList";
import { useSectionTitles } from "../lib/useSectionTitles";

export default function Awards() {
  const list = useAwardsList();
  const titles = useSectionTitles();
  // 관리자가 아직 편집 안 했으면(비어있음) 기존 고정 목록을 보여준다.
  const items = list && list.length > 0 ? list : awards;

  return (
    <section id="awards" className="section">
      <div className="section-inner">
        <div className="section-mark">
          <span className="glyph">§</span>AWARDS
        </div>
        <div>
          <h2>{titles.awards || "수상 · 자격증"}</h2>
          <div className="credential-list">
            {items.map((item) => (
              <div className="credential-item" key={item.id ?? item.title}>
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
