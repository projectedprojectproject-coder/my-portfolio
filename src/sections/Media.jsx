import { useMediaList } from "../lib/useMediaList";
import { useSectionTitles } from "../lib/useSectionTitles";
import { mediaPublicUrl, guessMediaKind, looksLikeFileName } from "../lib/media";

export default function Media() {
  const items = useMediaList();
  const titles = useSectionTitles();
  const loading = items === null;
  const list = items ?? [];

  return (
    <section id="media" className="section">
      <div className="section-inner">
        <div className="section-mark">
          <span className="glyph">§</span>MEDIA
        </div>
        <div>
          <h2>{titles.media || "미디어"}</h2>

          {loading ? null : list.length === 0 ? (
            <p className="media-empty">아직 등록된 미디어가 없습니다.</p>
          ) : (
            <div className="media-grid">
              {list.map((m) => {
                const url = mediaPublicUrl(m.path);
                const kind = guessMediaKind(m.path);
                // 파일명처럼 보이는 제목(업로드 시 자동 입력값)은 숨긴다.
                const title =
                  m.title && !looksLikeFileName(m.title) ? m.title : null;
                const alt = title || m.description || "미디어";
                return (
                  <figure className="media-item" key={m.path}>
                    <div className="media-preview">
                      {kind === "image" && (
                        <img src={url} alt={alt} loading="lazy" />
                      )}
                      {kind === "video" && (
                        <video src={url} controls preload="metadata" />
                      )}
                      {kind === "audio" && <audio src={url} controls />}
                      {kind === "file" && (
                        <a href={url} target="_blank" rel="noreferrer">
                          파일 열기
                        </a>
                      )}
                    </div>
                    {(title || m.description) && (
                      <figcaption>
                        {title && <span className="media-item-title">{title}</span>}
                        {m.description && (
                          <span className="media-item-desc">{m.description}</span>
                        )}
                      </figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
