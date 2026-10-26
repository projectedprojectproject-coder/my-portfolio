// "과제" 섹션의 데스크톱 펫 카드 — 이 포트폴리오를 내 목소리로 안내하는 앱(Portfolio PET)의 설치 파일 내려받기.
// 설치 파일은 GitHub Releases 에 올려 두고, 여기서는 "최신 릴리스" 페이지로 연결한다.
// → 새 버전을 릴리스에 올리기만 하면 사이트를 다시 배포하지 않아도 자동으로 최신 설치 파일로 이어진다.
const REPO = "https://github.com/projectedprojectproject-coder/appforwebsite";
const APP = {
  size: "약 111MB",
  icon: "/docs/pet/icon.png",
};
const LATEST = `${REPO}/releases/latest`;
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
        <a className="promptdoc-btn petapp-download" href={LATEST} target="_blank" rel="noopener noreferrer">
          설치 파일 내려받기 →
        </a>
        <a className="text-link" href={GUIDE} target="_blank" rel="noopener noreferrer">
          사용 가이드 <span className="arrow">→</span>
        </a>
        <a className="text-link" href={REPO} target="_blank" rel="noopener noreferrer">
          소스 코드 <span className="arrow">→</span>
        </a>
      </div>

      <p className="assign-controls petapp-meta">
        Windows 10·11 (64비트) · 최신 버전 · {APP.size}
      </p>
      <p className="assign-controls">
        버튼을 누르면 최신 릴리스 페이지가 열립니다. 맨 아래 Assets 의 PortfolioPET-Setup-…exe 를 받아 실행하세요. 서명되지 않은 설치 파일이라 "Windows의 PC 보호" 창이 뜨면 '추가 정보 → 실행'을 누르면 됩니다.
      </p>
    </article>
  );
}
