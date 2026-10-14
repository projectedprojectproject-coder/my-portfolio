import { lazy, Suspense, useState } from "react";

// "과제" 섹션의 Week 6 카드(파일·변수 이름은 week7 그대로) — 한 카드 안에 PDF 2개와 사용한 마크다운(.md) 링크를 함께 둔다.
// 파일은 public/docs/week7/ 에 있다.
const PdfReader = lazy(() => import("../components/PdfReader"));

const DIR = "/docs/week7/";

const VERSIONS = [
  {
    id: "without",
    label: "A · 스킬 없이",
    pdf: { title: "티아마트의 부활 캠페인 기록 (스킬 없이)", file: DIR + "campaign-without-skill.pdf", pages: 44 },
    md: { title: "명령 기록 (스킬 없이)", file: DIR + "commands-without-skill.md" },
  },
  {
    id: "with",
    label: "B · 스킬 사용",
    pdf: { title: "라이즈 오브 티아맷 (스킬 사용)", file: DIR + "campaign-with-skill.pdf", pages: 8 },
    md: { title: "작업 기록 · 명령과 스킬 (스킬 사용)", file: DIR + "commands-with-skill.md" },
  },
];

export default function Week7Card() {
  const [openId, setOpenId] = useState(null);
  const open = VERSIONS.find((v) => v.id === openId);

  return (
    <article className="idx-card assign-card week7-card">
      <span className="idx-tag">수업 과제 · Week 6</span>
      <h3>라이즈 오브 티아맷 — D&amp;D 캠페인 기록</h3>
      <p className="idx-role">Claude가 DM과 플레이어를 맡아 진행한 캠페인</p>
      <p className="assign-desc">
        {"D&D 5e 〈티아마트의 부활〉을 가이드로 정리하고, Claude가 DM과 플레이어 역할을 모두 맡아 주사위를 굴리며 캠페인을 진행했습니다.\n그 결과를 한국어로 옮겨 문학 형식의 기록으로 만들었습니다. 스킬 없이 만든 것(A)과 스킬을 쓴 것(B)을 PDF와, 작업에 쓴 명령을 담은 마크다운으로 함께 올렸습니다."}
      </p>

      {/* PDF 2개와 .md 링크 2개를 한 블록에 */}
      <div className="week7-files" role="group" aria-label="Week 6 자료">
        {VERSIONS.map((v) => (
          <div className="week7-file" key={v.id}>
            <p className="week7-file-label">{v.label}</p>
            <p className="week7-file-title">{v.pdf.title}</p>
            <div className="week7-file-actions">
              <button
                type="button"
                className="promptdoc-btn"
                aria-expanded={openId === v.id}
                aria-controls="week7-reader"
                onClick={() => setOpenId(openId === v.id ? null : v.id)}
              >
                {openId === v.id ? "PDF 접기" : `PDF 읽기 (${v.pdf.pages}쪽)`}
              </button>
              <a className="text-link" href={v.pdf.file} target="_blank" rel="noopener noreferrer">
                PDF 새 탭 <span className="arrow">→</span>
              </a>
            </div>
            <p className="week7-md">
              사용한 마크다운:{" "}
              <a className="text-link" href={v.md.file} target="_blank" rel="noopener noreferrer">
                {v.md.title}.md <span className="arrow">→</span>
              </a>
            </p>
          </div>
        ))}
      </div>

      {open && (
        <div className="md-body week7-reader" id="week7-reader">
          <p className="week7-reader-title">{open.pdf.title}</p>
          <Suspense fallback={<p className="md-p">PDF를 불러오는 중…</p>}>
            <PdfReader key={open.id} src={open.pdf.file} title={open.pdf.title} />
          </Suspense>
        </div>
      )}
    </article>
  );
}
