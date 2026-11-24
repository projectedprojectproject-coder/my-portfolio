// "과제" 섹션의 Week 13 카드 — SNS 대댓글 자동화 멀티에이전트 (IamAIcommenter).
// 내용은 저장소 README 에 적힌 것만 옮겼다.
const REPO = "https://github.com/projectedprojectproject-coder/IamAIcommenter";

const FLOW = [
  { n: "①", name: "읽기", note: "분류 · 답글 여부 판단" },
  { n: "②", name: "작성", note: "말투 가이드·FAQ로 초안" },
  { n: "③", name: "검수", note: "독립 호출, 체크리스트 7개" },
  { n: "사람", name: "승인", note: "approve / edit / reject" },
  { n: "", name: "게시", note: "간격을 두고 올림" },
];

const AGENTS = [
  ["① 읽기", "댓글을 읽고 질문·칭찬·불만·건의·잡담·스팸·위험으로 분류하고, 답글을 달지와 사람이 봐야 하는지를 판단합니다."],
  ["② 작성", "말투 가이드와 FAQ를 근거로 답글 초안을 씁니다. FAQ에 없는 사실은 단정하지 않습니다."],
  ["③ 검수", "작성 에이전트의 맥락을 공유하지 않고 독립적으로 점검합니다. 반려하면 최대 2회까지 다시 쓰게 합니다."],
];

const SAFETY = [
  "스팸은 답글을 달지 않고, 위험·조작 시도는 사람 확인으로 넘깁니다.",
  "댓글 속 지시(\"이전 지시 무시하고…\")는 데이터로만 취급합니다.",
  "할인·환불 같은 약속, FAQ에 없는 사실, 개인정보 요구, 링크는 금지합니다.",
  "같은 댓글에 두 번 답하지 않도록 처리 기록(SQLite)을 남깁니다.",
  "기본은 사람이 승인해야 게시되고, 자동 게시는 칭찬 같은 분류에만 선택적으로 켭니다.",
];

const PLATFORMS = ["YouTube", "Instagram", "Threads", "Facebook 페이지", "X"];

export default function Week13Card() {
  return (
    <article className="idx-card assign-card week13-card">
      <span className="idx-tag">수업 과제 · Week 13</span>
      <h3>SNS 대댓글 자동화 — 멀티에이전트</h3>
      <p className="idx-role">읽기 → 작성 ⇄ 검수 → 사람 승인 → 게시</p>
      <p className="assign-desc">
        {"내 채널과 계정에 달린 댓글에 대댓글을 다는 3-에이전트 파이프라인입니다. 읽기·작성·검수를 서로 다른 에이전트가 맡고, 반려되면 다시 쓰며, 마지막 게시는 사람이 승인한 답글만 올라갑니다."}
      </p>

      {/* 파이프라인 도식 */}
      <ol className="w13-flow" aria-label="파이프라인 단계">
        {FLOW.map((s, i) => (
          <li key={s.name}>
            <span className="w13-node">
              {s.n && <b>{s.n} </b>}{s.name}
            </span>
            <span className="w13-note">{s.note}</span>
            {i === 2 && <span className="w13-loop">반려 시 재작성 ↺ (최대 2회)</span>}
          </li>
        ))}
      </ol>

      <div className="w13-block">
        <p className="week7-file-label">에이전트 역할</p>
        <dl className="w13-agents">
          {AGENTS.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="w13-block">
        <p className="week7-file-label">안전 장치</p>
        <ul className="w13-list">
          {SAFETY.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="w13-block">
        <p className="week7-file-label">지원 플랫폼 · 시험</p>
        <ul className="w13-chips">
          {PLATFORMS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p className="w13-small">
          mock(시험용) 모드에서 샘플 댓글 6개를 처리해 승인 대기 4개, 답글 안 함 1개(광고), 사람 확인 1개(조작 시도)로 분류한 결과가 README에 기록되어 있습니다.
        </p>
      </div>

      <a className="text-link" href={REPO} target="_blank" rel="noopener noreferrer">
        소스 · 사용 가이드 보기 (GitHub) <span className="arrow">→</span>
      </a>
    </article>
  );
}
