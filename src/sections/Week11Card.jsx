// "과제" 섹션의 Week 11 카드 — 자동 영상 제작 멀티에이전트 (AutoGenerationOpenArtCompatible).
// 내용은 저장소의 에이전트 정의(.claude/agents/*.md)와 커밋 설명에 적힌 것만 옮겼다.
const REPO = "https://github.com/projectedprojectproject-coder/AutoGenerationOpenArtCompatible";
const BASE = "https://github.com/digitalsamba/claude-code-video-toolkit";

// 파이프라인 순서 (에이전트 이름 · 하는 일)
const STEPS = [
  ["scalper", "주제를 조사하고 숏츠용 대본·스토리보드(research.json)를 씁니다."],
  ["script-qa-looper", "대본이 주제에 맞는지, 사실이 과장되지 않았는지 검수합니다. 비용이 들기 전 단계에서 거르며 최대 3회 반복합니다."],
  ["title-picker ⇄ title-qa-looper", "영상 위쪽에 넣을 짧은 타이틀을 정하고, 낚시성·길이·자연스러운 한국어인지 검수합니다."],
  ["spawner", "씬별 프롬프트를 OpenArt AI 또는 Higgsfield API로 보내 이미지·영상 에셋을 만들어 받아옵니다."],
  ["tts-spawner ⇄ qa-tts-looper", "내레이션을 ElevenLabs로 음성 합성하고, 로봇 같지 않고 자연스러운지 검수합니다(최대 3회)."],
  ["qa-looper", "대본·에셋·음성이 다음 단계로 넘어가도 되는지 확인하고, 필요하면 씬을 다시 생성시킵니다(최대 5회)."],
  ["editor", "9:16 숏츠로 편집하고 승인된 타이틀을 입힙니다(ffmpeg 기반, 자막은 제외)."],
  ["subtitles ⇄ subtitles-qa-looper", "내레이션 기준으로 자막을 입히고 타이밍·원문 일치를 검수합니다(최대 5회)."],
  ["publisher", "완성본을 품질·포맷 기준으로 검증하고 미달이면 editor나 subtitles로 되돌립니다(최대 7회)."],
];

const GUARDS = [
  "검수 에이전트는 만든 에이전트와 분리되어 있어, 자기 결과를 스스로 통과시키지 못합니다.",
  "검수 반복 횟수에 상한(3~7회)이 있어 무한 반복과 비용 폭주를 막습니다.",
  "유튜브 업로드는 자동으로 하지 않고, 채널 이름·ID를 보여 준 뒤 사람이 명시적으로 승인해야 진행합니다.",
  "주제는 요약·순화 없이 그대로 전달합니다(전달 과정에서 주제가 사라진 사고를 겪은 뒤 주제 선정을 에이전트 호출에서 뺐습니다).",
];

const TECH = ["Claude Code 서브에이전트", "OpenArt AI / Higgsfield", "ElevenLabs", "ffmpeg", "9:16 YouTube Shorts"];

export default function Week11Card() {
  return (
    <article className="idx-card assign-card week11-card">
      <span className="idx-tag">수업 과제 · Week 11</span>
      <h3>자동 영상 제작 — 멀티에이전트 (Shorts Maker)</h3>
      <p className="idx-role">주제 → 대본 → 에셋·음성 → 편집 → 자막 → 검증</p>
      <p className="assign-desc">
        {"주제 하나를 주면 대본 작성부터 영상·음성 생성, 편집, 자막, 최종 검증까지 12개 에이전트가 단계를 나눠 맡아 유튜브 숏츠를 만드는 파이프라인입니다. 단계마다 검수 에이전트가 반려하면 해당 단계만 다시 만들고, 업로드는 사람이 승인한 뒤에만 진행합니다."}
      </p>

      <div className="w13-block">
        <p className="week7-file-label">파이프라인</p>
        <ol className="w11-steps">
          {STEPS.map(([name, text], i) => (
            <li key={name}>
              <span className="w11-n">{i + 1}</span>
              <div>
                <code className="w11-name">{name}</code>
                <p className="w11-text">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="w13-block">
        <p className="week7-file-label">안전 장치와 설계 원칙</p>
        <ul className="w13-list">
          {GUARDS.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </div>

      <div className="w13-block">
        <p className="week7-file-label">사용한 도구</p>
        <ul className="w13-chips">
          {TECH.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="w13-small">
          오픈소스{" "}
          <a className="text-link" href={BASE} target="_blank" rel="noopener noreferrer">
            claude-code-video-toolkit
          </a>{" "}
          (MIT 라이선스)를 바탕으로, 그 위에 Shorts Maker 에이전트 파이프라인을 얹었습니다.
        </p>
      </div>

      <a className="text-link" href={REPO} target="_blank" rel="noopener noreferrer">
        소스 보기 (GitHub) <span className="arrow">→</span>
      </a>
    </article>
  );
}
