import { lazy, Suspense, useState } from "react";

// "과제" 섹션의 Week 7 카드 — 소개 이미지(PDF), 명함 앞·뒷면(PNG), Figma 편집 링크를 한 블록에 둔다.
// 파일은 public/docs/figma/ 에 있다.
const PdfReader = lazy(() => import("../components/PdfReader"));

const DIR = "/docs/figma/";
const FIGMA_URL = "https://www.figma.com/design/ZM8xHQLQovyA6P5TLDI67G";
const PDF = { title: "포트폴리오 소개 이미지", file: DIR + "intro-image.pdf" };
const CARDS = [
  { label: "명함 · 앞면", file: DIR + "namecard-front.png", alt: "명함 앞면: 이윤호, 성균관대학교 대학원 영상학과" },
  { label: "명함 · 뒷면", file: DIR + "namecard-back.png", alt: "명함 뒷면: my portfolio" },
];

export default function FigmaCard() {
  const [open, setOpen] = useState(false);

  return (
    <article className="idx-card assign-card figma-card">
      <span className="idx-tag">수업 과제 · Week 7</span>
      <h3>Figma</h3>
      <p className="idx-role">포트폴리오 소개 이미지 · 명함 · 화면 비교 캔버스</p>
      <p className="assign-desc">
        {"내 정보를 바탕으로 포트폴리오 소개 이미지와 명함 앞면·뒷면을 만들고, 사이트 전체를 Desktop · iPad · Mobile 세 가지 화면으로 비교하는 Figma 캔버스를 구성했습니다. 텍스트·사진·추상 그래픽은 각각 따로 편집할 수 있는 레이어입니다."}
      </p>

      {/* 소개 파일 · 명함 · Figma 링크를 한 블록에 */}
      <div className="figma-files" role="group" aria-label="Week 7 Figma 자료">
        <div className="figma-cards">
          {CARDS.map((c) => (
            <figure key={c.file}>
              <img src={c.file} alt={c.alt} loading="lazy" />
              <figcaption>
                {c.label}{" "}
                <a className="text-link" href={c.file} download>
                  PNG 내려받기 <span className="arrow">↓</span>
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="figma-links">
          <p className="week7-file-label">소개 이미지</p>
          <p className="week7-file-title">{PDF.title}</p>
          <div className="week7-file-actions">
            <button
              type="button"
              className="promptdoc-btn"
              aria-expanded={open}
              aria-controls="figma-reader"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "PDF 접기" : "PDF 읽기 (1쪽)"}
            </button>
            <a className="text-link" href={PDF.file} target="_blank" rel="noopener noreferrer">
              PDF 새 탭 <span className="arrow">→</span>
            </a>
            <a className="text-link" href={FIGMA_URL} target="_blank" rel="noopener noreferrer">
              Figma에서 편집하기 <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>

      {open && (
        <div className="md-body week7-reader" id="figma-reader">
          <p className="week7-reader-title">{PDF.title}</p>
          <Suspense fallback={<p className="md-p">PDF를 불러오는 중…</p>}>
            <PdfReader src={PDF.file} title={PDF.title} />
          </Suspense>
        </div>
      )}
    </article>
  );
}
