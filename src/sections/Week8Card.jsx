import { lazy, Suspense, useState } from "react";

// "과제" 섹션의 Week 8 카드 — 영상 생성(인물 중심 숏폼): 워크플로우 PDF, 숏폼 영상, 사용한 프롬프트.
// 파일은 public/docs/week8/ 에 있다.
const PdfReader = lazy(() => import("../components/PdfReader"));

const DIR = "/docs/week8/";
const PDF = { title: "AI Video Production Workflow", file: DIR + "workflow.pdf", pages: 4 };
const VIDEO = DIR + "short-form.mp4";

// 사용한 프롬프트 — 받은 그대로 둔다 (오탈자 포함, 고치지 않음).
const PROMPT = `Create a video without background music, No background music, fixed camera,Use @image1 as a reference for the man's face and overall appearance and clothing,use the uploaded images exactly as provided, Make a video with one take camera, 0:00 ~ 0:05 The video begins with the man in @image1 holding a film camera, aiming directly at the screen, zoom into the camera lens, create lens flare transition. somebody says in a masculine voice "카메라 롤, 레디 액션" faintly in the background 0:06 ~ 0:11 shows a computer screen editing the video instance made in 0:00~0:05, and the person in @image1 editing it. 0:12~15, transition to fade to black`;

export default function Week8Card() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* 복사 권한이 없으면 아래 프롬프트를 직접 선택해 복사하면 된다 */
    }
  }

  return (
    <article className="idx-card assign-card week8-card">
      <span className="idx-tag">수업 과제 · Week 8</span>
      <h3>영상 생성</h3>
      <p className="assign-desc">영상 생성 AI 툴을 활용하여 인물중심의 숏폼제작</p>

      {/* 1. 워크플로우 PDF */}
      <div className="week8-block">
        <p className="week7-file-label">1 · 워크플로우</p>
        <p className="week7-file-title">{PDF.title}</p>
        <div className="week7-file-actions">
          <button
            type="button"
            className="promptdoc-btn"
            aria-expanded={open}
            aria-controls="week8-reader"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "PDF 접기" : `PDF 읽기 (${PDF.pages}쪽)`}
          </button>
          <a className="text-link" href={PDF.file} target="_blank" rel="noopener noreferrer">
            PDF 새 탭 <span className="arrow">→</span>
          </a>
        </div>
        {open && (
          <div className="md-body week7-reader" id="week8-reader">
            <Suspense fallback={<p className="md-p">PDF를 불러오는 중…</p>}>
              <PdfReader src={PDF.file} title={PDF.title} />
            </Suspense>
          </div>
        )}
      </div>

      {/* 2. 숏폼 영상 */}
      <div className="week8-block">
        <p className="week7-file-label">2 · 숏폼 영상</p>
        <video
          className="week8-video"
          controls
          playsInline
          preload="metadata"
          src={VIDEO}
          aria-label="인물 중심 숏폼 영상"
        >
          이 브라우저는 영상 재생을 지원하지 않습니다.
        </video>
        <a className="text-link" href={VIDEO} download>
          영상 내려받기 <span className="arrow">↓</span>
        </a>
      </div>

      {/* 3. 사용한 프롬프트 */}
      <div className="week8-block">
        <p className="week7-file-label">3 · 사용한 프롬프트</p>
        <pre className="week8-prompt">{PROMPT}</pre>
        <button type="button" className="promptdoc-btn" onClick={copyPrompt}>
          {copied ? "복사됨 ✓" : "프롬프트 복사"}
        </button>
      </div>
    </article>
  );
}
