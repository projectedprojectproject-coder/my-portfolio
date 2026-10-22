// "과제" 섹션의 Week 8 (bloopers) 카드 — 영상 생성 과정에서 나온 영상 5개.
// 파일은 public/docs/week8-bloopers/ 에 있다. 처음엔 영상을 받지 않고(preload="none"),
// 재생을 누를 때 불러와 데이터와 로딩 시간을 아낀다.
const DIR = "/docs/week8-bloopers/";
const CLIPS = [1, 2, 3, 4, 5].map((n) => ({ n, src: `${DIR}blooper-${n}.mp4` }));

export default function BloopersCard() {
  return (
    <article className="idx-card assign-card bloopers-card">
      <span className="idx-tag">수업 과제 · Week 8 (bloopers)</span>
      <h3>Bloopers</h3>
      <p className="assign-desc">영상 생성 과정에서 나온 영상들입니다.</p>
      <div className="bloopers-grid" role="group" aria-label="Week 8 bloopers 영상">
        {CLIPS.map((c) => (
          <figure key={c.n}>
            <video
              className="bloopers-video"
              controls
              playsInline
              preload="none"
              src={c.src}
              aria-label={`bloopers 영상 ${c.n}`}
            >
              이 브라우저는 영상 재생을 지원하지 않습니다.
            </video>
            <figcaption>
              CLIP {String(c.n).padStart(2, "0")}{" "}
              <a className="text-link" href={c.src} download>
                내려받기 <span className="arrow">↓</span>
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
    </article>
  );
}
