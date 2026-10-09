import { Fragment } from "react";

// 영화 클래퍼보드 모양의 소개 카드. 이미지 파일을 쓰지 않고 SVG + HTML/CSS 로 그린다.
//  - 위쪽 막대(열린 클랩스틱 + 고정 막대 + 경첩 + 나사)는 SVG 라서 폭에 따라 줄무늬가 같은 비율로 커진다.
//  - 아래 검은 판은 HTML 이라 글자가 실제 텍스트로 남는다(복사·검색·읽어주기 가능).
// 글은 호출하는 쪽(about 데이터)에서 받는다. 여기서는 모양만 책임진다.

// 줄무늬: 검정 / 크림이 번갈아 나오고, 이미지처럼 "/" 방향으로 기울어 있다.
const STRIPE_PERIOD = 295;
const STRIPE_CREAM = 160;

function Stripes({ id }) {
  return (
    <pattern
      id={id}
      width={STRIPE_PERIOD}
      height="140"
      patternUnits="userSpaceOnUse"
      patternTransform="skewX(-30)"
    >
      <rect width={STRIPE_PERIOD} height="140" fill="#121212" />
      <rect x="25" width={STRIPE_CREAM} height="140" fill="#e8d5b6" />
      {/* 크림 줄무늬의 잔 균열 느낌 */}
      <rect x="25" width={STRIPE_CREAM} height="140" fill="url(#clap-crackle)" opacity="0.55" />
    </pattern>
  );
}

function Screw({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="19" fill="url(#clap-metal)" stroke="#0a0a0a" strokeWidth="3" />
      <path
        d={`M${cx - 10} ${cy}H${cx + 10}M${cx} ${cy - 10}V${cy + 10}`}
        stroke="#3a3a3a"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  );
}

function Top() {
  return (
    <svg
      className="clapper-top"
      viewBox="90 -45 1570 380"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <Stripes id="clap-stripes-a" />
        <Stripes id="clap-stripes-b" />
        <radialGradient id="clap-metal" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#f2f2f2" />
          <stop offset="0.55" stopColor="#a9a9a9" />
          <stop offset="1" stopColor="#666" />
        </radialGradient>
        <linearGradient id="clap-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        {/* 거친 가장자리 */}
        <filter id="clap-rough" x="-2%" y="-5%" width="104%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="7" />
        </filter>
        {/* 크림 줄무늬 위 잔 균열 */}
        <filter id="clap-crackle-f" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09 0.05" numOctaves="2" seed="4" />
          <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.27  0 0 0 0 0.18  0 0 0 2.4 -0.9" />
        </filter>
        <pattern id="clap-crackle" width="260" height="140" patternUnits="userSpaceOnUse">
          <rect width="260" height="140" filter="url(#clap-crackle-f)" />
        </pattern>
        {/* 오른쪽 끝의 벗겨진 페인트 */}
        <filter id="clap-splat-f" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="3" seed="11" />
          <feColorMatrix values="0 0 0 0 0.04  0 0 0 0 0.04  0 0 0 0 0.04  0 0 0 13 -6.6" />
        </filter>
        <linearGradient id="clap-splat-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="clap-splat-mask-arm" maskUnits="userSpaceOnUse" x="1280" y="-60" width="320" height="170">
          <rect x="1280" y="-60" width="320" height="170" fill="url(#clap-splat-fade)" />
        </mask>
        <mask id="clap-splat-mask-bar" maskUnits="userSpaceOnUse" x="1400" y="210" width="260" height="120">
          <rect x="1400" y="210" width="260" height="120" fill="url(#clap-splat-fade)" />
        </mask>
        <clipPath id="clap-clip-bar">
          <rect x="120" y="222" width="1530" height="100" rx="8" />
        </clipPath>
        <clipPath id="clap-clip-arm">
          <rect x="200" y="140" width="1370" height="92" rx="9" />
        </clipPath>
      </defs>

      {/* 아래 고정 막대 */}
      <g filter="url(#clap-rough)">
        <rect x="120" y="222" width="1530" height="100" rx="8" fill="url(#clap-stripes-b)" stroke="#070707" strokeWidth="6" />
        <rect x="120" y="222" width="1530" height="100" rx="8" fill="url(#clap-sheen)" />
      </g>
      <g clipPath="url(#clap-clip-bar)" mask="url(#clap-splat-mask-bar)">
        <rect x="1400" y="210" width="260" height="120" filter="url(#clap-splat-f)" />
      </g>

      {/* 위로 열린 클랩스틱 (경첩 쪽을 축으로 살짝 들림) */}
      <g transform="rotate(-5.7 200 232)">
        <g filter="url(#clap-rough)">
          <rect x="200" y="140" width="1370" height="92" rx="9" fill="url(#clap-stripes-a)" stroke="#070707" strokeWidth="6" />
          <rect x="200" y="140" width="1370" height="92" rx="9" fill="url(#clap-sheen)" />
        </g>
        <g clipPath="url(#clap-clip-arm)" mask="url(#clap-splat-mask-arm)" transform="translate(0 0)">
          <rect x="1280" y="120" width="320" height="130" filter="url(#clap-splat-f)" />
        </g>
      </g>

      {/* 경첩 블록 + 나사 */}
      <path
        d="M110 168Q110 155 124 155L205 155L302 233L302 308Q302 320 290 320L124 320Q110 320 110 308Z"
        fill="#161616"
        stroke="#050505"
        strokeWidth="6"
        filter="url(#clap-rough)"
      />
      <path
        d="M205 155L302 233"
        stroke="#4a4a4a"
        strokeWidth="2.5"
        fill="none"
        opacity="0.9"
      />
      <Screw cx={137} cy={186} />
      <Screw cx={135} cy={273} />
      <Screw cx={268} cy={272} />
    </svg>
  );
}

// "첫 줄 / 다음 줄 …" 을 이미지의 줄바꿈 위치대로 넣는다.
// 좁은 화면에서는 <br> 를 숨겨(CSS) 자연스럽게 줄이 접히게 한다.
function Lines({ lines }) {
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && (
        <>
          {" "}
          <br className="clapper-lb" />
        </>
      )}
      {line}
    </Fragment>
  ));
}

export default function Clapperboard({ data }) {
  return (
    <div className="clapper">
      <Top />
      <div className="clapper-body">
        <div className="clapper-main">
          {data.main.map((lines, i) => (
            <Fragment key={i}>
              {i > 0 && <hr className="clapper-rule" />}
              <p>
                <Lines lines={lines} />
              </p>
            </Fragment>
          ))}
        </div>

        <aside className="clapper-side">
          <section>
            <h3 className="clapper-label">PROGRAM</h3>
            <p className="clapper-program-ko">{data.program.ko}</p>
            {data.program.en.map((line) => (
              <p className="clapper-program-en" key={line}>
                {line}
              </p>
            ))}
          </section>

          <hr className="clapper-rule" />

          <section>
            <h3 className="clapper-label">FOCUS</h3>
            <ul className="clapper-focus">
              {data.focus.map((item) =>
                typeof item === "string" ? (
                  <li key={item}>{item}</li>
                ) : (
                  <li className="clapper-focus-work" key={item.name}>
                    <span className="clapper-focus-name">{item.name}</span>
                    <span className="clapper-focus-title">{item.work}</span>
                  </li>
                )
              )}
            </ul>
          </section>

          <hr className="clapper-rule" />

          <section>
            <h3 className="clapper-label">STATUS</h3>
            <p className="clapper-status">{data.status}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
