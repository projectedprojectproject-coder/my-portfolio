import { publication } from "../data";
import bookCover from "../assets/book-cover.png";

export default function Publications() {
  return (
    <section id="publications" className="section">
      <div className="section-inner">
        <div className="section-mark">
          <span className="glyph">§</span>PUBLICATIONS
        </div>
        <div>
          <h2>저서</h2>
          <div className="pub-feature">
            <div className="pub-cover">
              <img src={bookCover} alt={`${publication.title} 표지`} />
            </div>
            <div className="pub-body">
              <span className="idx-tag">{publication.tag}</span>
              <h3>{publication.title}</h3>
              <p className="pub-author">{publication.author}</p>
              {publication.paragraphs.map((text, i) => (
                <p className="pub-desc" key={i}>
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
