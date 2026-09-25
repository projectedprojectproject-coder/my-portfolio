import { useFeaturedList } from "../lib/useFeaturedList";

function splitText(text) {
  const lines = (text || "").split("\n").map((l) => l.trim()).filter(Boolean);
  return { title: lines[0] || "", caption: lines.slice(1).join(" · ") };
}

export default function Featured() {
  const items = useFeaturedList();

  // 로딩중이거나 관리자가 아직 카드를 안 만들었으면 섹션 자체를 숨긴다.
  if (!items || items.length === 0) return null;

  return (
    <section id="featured" className="section">
      <div className="section-inner">
        <div className="section-mark">
          <span className="glyph">§</span>FEATURED
        </div>
        <div>
          <h2>추천</h2>
          <div className="feature-grid">
            {items.map((item, i) => {
              const { title, caption } = splitText(item.text);
              return (
                <a
                  className="feature-card"
                  href={item.link || "#top"}
                  key={item.id}
                  style={
                    item.photo_url
                      ? { backgroundImage: `url(${item.photo_url})` }
                      : undefined
                  }
                >
                  <span className="feature-card-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="feature-card-text">
                    {title && <span className="feature-card-title">{title}</span>}
                    {caption && (
                      <span className="feature-card-caption">{caption}</span>
                    )}
                  </span>
                  <span className="feature-card-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
