import { Fragment } from "react";
import { about } from "../data";
import { useEntries } from "../lib/useEntries";
import BlockContent from "../components/BlockContent";

export default function About() {
  const entries = useEntries("about");
  // 관리자가 아직 편집 안 했으면(entries 비어있음) 기존 고정 문구를 보여준다.
  const useFallback = !entries || entries.length === 0;
  const blocks = useFallback
    ? about.paragraphs.map((text) => ({ type: "text", text }))
    : entries[0].blocks ?? [];

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
              <BlockContent blocks={blocks} />
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
