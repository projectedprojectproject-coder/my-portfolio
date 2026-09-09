import { Fragment } from "react";
import { about } from "../data";

export default function About() {
  return (
    <section id="about" className="section">
      <div className="section-inner">
        <div className="section-mark">
          <span className="glyph">§</span>ABOUT
        </div>
        <div>
          <h2>소개</h2>
          <div className="about-layout">
            <div className="about-copy">
              {about.paragraphs.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>

            <div className="slate">
              <dl>
                {about.slate.map((field) => (
                  <div className="field" key={field.term}>
                    <dt>{field.term}</dt>
                    <dd>
                      {field.lines.map((line, i) => (
                        <Fragment key={i}>
                          {i > 0 && <br />}
                          {line}
                        </Fragment>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
