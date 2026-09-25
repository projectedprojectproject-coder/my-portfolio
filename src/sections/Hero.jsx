import { Fragment } from "react";
import { profile } from "../data";
import { useHero } from "../lib/useHero";

export default function Hero() {
  const hero = useHero();
  const useFallback = !hero; // 로딩중이거나(null) 행이 없으면(false) 고정 문구

  const eyebrow = useFallback ? profile.eyebrow : hero.eyebrow || profile.eyebrow;
  const headlineText = useFallback ? profile.nameKo : hero.headline || profile.nameKo;
  const headlineLines = headlineText.split("\n").filter((l) => l.trim());
  const subtitle = useFallback ? profile.nameEn : hero.subtitle || profile.nameEn;
  const body = useFallback ? profile.heroDesc : hero.body || profile.heroDesc;
  const photoUrl = useFallback ? null : hero.photo_url;

  return (
    <section className="hero">
      <div className={`hero-layout${photoUrl ? "" : " no-photo"}`}>
        <div className="hero-text">
          <p className="eyebrow">{eyebrow}</p>
          <h1>
            {headlineLines.map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h1>
          <p className="hero-subtitle">{subtitle}</p>
          <p className="hero-desc">{body}</p>
        </div>

        {photoUrl && (
          <div className="hero-photo-wrap">
            <img className="hero-photo" src={photoUrl} alt={profile.nameKo} />
            <div className="hero-filmstrip" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="filmruler">
        <span className="rec">
          <span className="tally" />
          REC
        </span>
        <span className="ticks" aria-hidden="true" />
        <span className="label">{profile.filmrulerLabel}</span>
      </div>

      <div className="hero-actions">
        <a href="#research" className="text-link">
          연구 살펴보기 <span className="arrow">→</span>
        </a>
        <a href="#contact" className="text-link">
          연락하기 <span className="arrow">→</span>
        </a>
      </div>
    </section>
  );
}
