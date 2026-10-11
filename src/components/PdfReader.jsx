import { useEffect, useRef, useState } from "react";

// 사이트 안에서 PDF 를 쪽별 캔버스로 그려 보여준다.
// <iframe>/<embed> 로 띄우면 휴대폰 브라우저가 첫 쪽만 보여 주거나 아예 내려받게 해서 읽을 수 없다.
// pdf.js 는 열 때만 불러오므로(동적 import) 이 카드를 안 펼치면 사이트 로딩에 영향이 없다.

function Page({ doc, pageNumber, ratio }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // 화면 근처에 왔을 때만 그린다 (44쪽을 한꺼번에 그리지 않게).
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "700px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    let cancelled = false;
    let task = null;
    (async () => {
      try {
        const page = await doc.getPage(pageNumber);
        const cssWidth = wrapRef.current?.clientWidth || 600;
        const base = page.getViewport({ scale: 1 });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: (cssWidth / base.width) * dpr });
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        task = page.render({ canvas, viewport });
        await task.promise;
      } catch {
        /* 닫거나 취소된 경우 — 무시 */
      }
    })();
    return () => {
      cancelled = true;
      task?.cancel?.();
    };
  }, [visible, doc, pageNumber]);

  return (
    <div className="pdf-page" ref={wrapRef} style={{ aspectRatio: String(ratio) }}>
      <canvas ref={canvasRef} aria-label={`${pageNumber}쪽`} />
    </div>
  );
}

export default function PdfReader({ src, title }) {
  const [state, setState] = useState({ status: "loading", doc: null, pages: 0, ratio: 0.707 });

  useEffect(() => {
    let cancelled = false;
    let loaded = null;
    (async () => {
      try {
        const [pdfjs, worker] = await Promise.all([
          import("pdfjs-dist"),
          import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
        ]);
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
        loaded = pdfjs.getDocument({ url: src });
        const doc = await loaded.promise;
        const first = await doc.getPage(1);
        const v = first.getViewport({ scale: 1 });
        if (cancelled) return;
        setState({ status: "ready", doc, pages: doc.numPages, ratio: v.width / v.height });
      } catch {
        if (!cancelled) setState({ status: "error", doc: null, pages: 0, ratio: 0.707 });
      }
    })();
    return () => {
      cancelled = true;
      loaded?.destroy?.();
    };
  }, [src]);

  if (state.status === "loading") return <p className="md-p">PDF를 불러오는 중…</p>;
  if (state.status === "error") {
    return (
      <p className="md-p">
        PDF를 화면에 그리지 못했습니다.{" "}
        <a className="text-link" href={src} target="_blank" rel="noopener noreferrer">
          새 탭에서 열기 <span className="arrow">→</span>
        </a>
      </p>
    );
  }

  return (
    <div className="pdf-reader" role="document" aria-label={title} tabIndex={0}>
      {Array.from({ length: state.pages }, (_, i) => (
        <Page key={i} doc={state.doc} pageNumber={i + 1} ratio={state.ratio} />
      ))}
    </div>
  );
}
