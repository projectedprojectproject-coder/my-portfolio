import { PET } from "./petConfig";

// 펫 모습. 지금은 임시(placeholder) 캐릭터이고, petConfig.js 의 image 에 그림 경로를 적으면 그 그림으로 바뀐다.
// speaking 이 true 이면 말하는 동안 움직인다 (임시 펫은 입, 그림 파일은 살짝 통통 튐).
export default function PetAvatar({ speaking }) {
  if (PET.image) {
    return (
      <img
        className={`pet-avatar pet-img${speaking ? " is-speaking" : ""}`}
        src={PET.image}
        alt=""
        draggable="false"
      />
    );
  }
  return (
    <svg
      className={`pet-avatar pet-placeholder${speaking ? " is-speaking" : ""}`}
      viewBox="0 0 80 80"
      aria-hidden="true"
      focusable="false"
    >
      {/* 임시 펫: 둥근 몸 + 눈 + 입 + 점선 테두리 (나중에 실제 캐릭터로 교체) */}
      <circle cx="40" cy="42" r="30" fill="#cdb488" stroke="#7c2c16" strokeWidth="2" strokeDasharray="5 4" />
      <circle cx="30" cy="38" r="3.6" fill="#2a1e10" />
      <circle cx="50" cy="38" r="3.6" fill="#2a1e10" />
      <ellipse className="pet-mouth" cx="40" cy="53" rx="5" ry="2.6" fill="#7c2c16" />
      <text x="40" y="76" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#7c2c16">
        PET
      </text>
    </svg>
  );
}
