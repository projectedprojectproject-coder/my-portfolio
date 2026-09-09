import { profile } from "../data";

export default function Hero() {
  return (
    <section className="hero">
      <p className="eyebrow">{profile.eyebrow}</p>
      <h1>
        {profile.nameKo}
        <span className="en-name">{profile.nameEn}</span>
      </h1>
      <p className="hero-desc">{profile.heroDesc}</p>

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
