// "과제" 섹션의 데스크톱 펫 카드 — 이 포트폴리오를 내 목소리로 안내하는 앱(Portfolio PET)의 설치 파일 내려받기.
// 설치 파일은 GitHub Releases 에 올려 두고 여기서는 링크만 건다. 새 버전을 내면 APP.version 만 바꾸면 된다.
const REPO = "https://github.com/projectedprojectproject-coder/appforwebsite";
const APP = {
  version: "0.1.0",
  size: "111MB",
  icon: "/docs/pet/icon.png",
};
const FILE = `PortfolioPET-Setup-${APP.version}.exe`;
const DOWNLOAD = `${REPO}/releases/download/v${APP.version}/${FILE}`;
const RELEASE = `${REPO}/releases/tag/v${APP.version}`;
const GUIDE = `${REPO}/blob/main/${encodeURIComponent("사용가이드.md")}`;

export default function PetAppCard() {
  return (
    <article className="idx-card assign-card petapp-card">
      <span className="idx-tag">AI 응용 · 데스크톱 앱</span>
      <div className="petapp-head">
        <img className="petapp-icon" src={APP.icon} alt="" width="96" height="96" loading="lazy" />
        <div>
          <h3>Portfolio PET — 내 목소리로 안내하는 고양이</h3>
          <p className="assign-desc">
            이 포트폴리오를 제 복제 목소리로 한 바퀴 소개하고, 발표가 끝나면 마이크로 질문을 받아 AI가 사이트 내용을 바탕으로 제 목소리로 대답하는 데스크톱 펫입니다.
            대답하는 동안 이야기하는 작품 카드로 화면을 넘기며 가리킵니다.
          </p>
        </div>
      </div>

      <div className="promptdoc-actions">
        <a className="promptdoc-btn petapp-download" href={DOWNLOAD}>
          설치 파일 내려받기 ↓
        </a>
        <a className="text-link" href={RELEASE} target="_blank" rel="noopener noreferrer">
          릴리스 안내 <span className="arrow">→</span>
        </a>
        <a className="text-link" href={GUIDE} target="_blank" rel="noopener noreferrer">
          사용 가이드 <span className="arrow">→</span>
        </a>
        <a className="text-link" href={REPO} target="_blank" rel="noopener noreferrer">
          소스 코드 <span className="arrow">→</span>
        </a>
      </div>

      <p className="assign-controls petapp-meta">
        Windows 10·11 (64비트) · v{APP.version} · {APP.size}
      </p>
      <p className="assign-controls">
        서명되지 않은 설치 파일이라 "Windows의 PC 보호" 창이 뜨면 '추가 정보 → 실행'을 누르세요. 안내는 바로 쓸 수 있고, 질문에 대답하는 기능은 따로 API 키가 필요합니다.
      </p>
    </article>
  );
}
