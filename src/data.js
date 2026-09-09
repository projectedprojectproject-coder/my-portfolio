// =========================================================
// 포트폴리오 내용 데이터
// 여기 값만 고치면 화면 내용이 바뀝니다. (JSX 를 건드릴 필요 없음)
// =========================================================

export const profile = {
  nameKo: "이윤호",
  nameEn: "Yoon Ho, Rhee",
  wordmark: "이윤호 RHEE YOON HO",
  eyebrow:
    "Sungkyunkwan University · Graduate School of Film, Television and Multimedia",
  heroDesc:
    "AI 슬롭(AI Slop)과 유사과학 콘텐츠의 담론 구조, 그리고 유튜브 추천 알고리즘에 의한 노출·확산 메커니즘을 비판적 담론분석(Critical Discourse Analysis)으로 연구하는 석사과정을 수행하는 대학원생입니다.",
  filmrulerLabel: "CRITICAL DISCOURSE ANALYSIS — FAIRCLOUGH 1992 / 1995",
  email: "projectedprojectproject@gmail.com",
  footerLeft: "© 2026 Yoon ho Rhee (이윤호)",
  footerRight: "Sungkyunkwan University · Graduate School",
};

export const nav = [
  { id: "about", label: "소개" },
  { id: "research", label: "연구" },
  { id: "projects", label: "프로젝트" },
  { id: "publications", label: "저서" },
  { id: "awards", label: "수상 · 자격증" },
  { id: "contact", label: "연락처" },
];

export const about = {
  paragraphs: [
    "성균관대학교 일반대학원 영상학과(Film, Television and Multimedia) 석사과정에 재학 중이며, 2028년 졸업을 목표로 하고 있습니다.",
    "AI를 활용한 영상 제작 실무서 「AI와 할리우드 공식으로 만드는 방구석 시네마틱」을 집필·출간한 바 있으며, 연구와 창작을 함께 병행하고 있습니다.",
  ],
  slate: [
    {
      term: "Program",
      // <br> 위치를 배열로 표현
      lines: ["성균관대학교 일반대학원", "영상학과 (Film, TV & Multimedia)"],
    },
    { term: "Status", lines: ["석사과정 · 2028년 졸업 예정"] },
    {
      term: "Focus",
      lines: ["비판적 담론분석 · AI 슬롭 콘텐츠 · 유튜브 추천 알고리즘"],
    },
  ],
};

export const research = [
  {
    tag: "석사학위논문 · 진행중",
    title:
      "AI 슬롭·유사과학 채널의 담론 구조와 유튜브 추천 기반 노출 확산에 관한 비판적 담론분석",
    paragraphs: [
      "Fairclough(1992, 1995)의 3차원 모형(텍스트 · 담화적 실천 · 사회적 실천)을 분석틀로 삼아, AI로 생성된 유사과학 콘텐츠(AI Slop) 채널의 담론이 어떻게 구성되고, 유튜브 추천 알고리즘을 통해 어떤 방식으로 노출·확산되는지를 비판적으로 분석합니다.",
    ],
    note: "TEXT — DISCURSIVE PRACTICE — SOCIAL PRACTICE",
  },
  {
    tag: "연구 주제",
    title: '데드풀(Deadpool) 시리즈의 제4의 벽 파괴와 "역설적 몰입"',
    paragraphs: [
      '데드풀 시리즈에서 반복적으로 사용되는 제4의 벽(Fourth Wall) 파괴 기법이 관객에게 오히려 몰입을 강화하는 "역설적 몰입(Paradoxical Immersion)" 효과를 유도하는 메커니즘을 탐구하는 연구 주제입니다.',
    ],
  },
];

export const projects = [
  {
    tag: "SF 창작 프로젝트",
    title: "UNCANNY VALLEY",
    role: null,
    paragraphs: ["오리지널 SF 창작 프로젝트입니다."],
  },
  {
    tag: "코미디 드라마 단편",
    title: "코딱지",
    role: "역할 · 조연출",
    paragraphs: [
      "어느 날 누군가 계속 대문 앞에 코딱지를 붙인다, 그 자는 누구일까? 그리고 왜 우리 집 대문에 코딱지를 붙인 것일까? 범인은 이 안에 있다. 범인을 잡기 위하여 주인공 '승수'의 코미디 추리극! 그러나 그는 조사 도중 가족들의 비밀을 다 알아 버리는데…. 가족들의 비밀을 알아버린 승수의 가족 생활, 과연 무사할까?",
    ],
  },
  {
    tag: "시사교양",
    title: "트립 어게인 시즌 2",
    role: "역할 · 편집 국장",
    paragraphs: [
      "지나간 여행 사진들만 뒤적거리며 팬데믹을 겪은 MZ세대, 다시 여행을 할 시간이 왔다! 그러나 역병의 시대 이전의 정보만 남겨졌는데, 수많은 여행 정보로 인하여 미궁에 빠진 여행 계획을 위하여 특별한 3명의 탐정들이 나타났다. 여행의 DNA를 깨우자! 특별한 여행 방법을 찾기 위하여, 오늘도 우리들의 탐정들은 조사에 임한다.",
    ],
  },
  {
    tag: "광고 제작",
    title: "경기 지역 장애인 지원 광고",
    role: null,
    paragraphs: ["경기 지역 장애인 지원을 위한 광고를 다수 제작했습니다."],
  },
];

export const publication = {
  tag: "출간",
  title: "AI와 할리우드 공식으로 만드는 방구석 시네마틱",
  author: "이윤호 지음",
  paragraphs: [
    "카메라도, 배우도, 촬영 장비도 없이 한 편의 영화 같은 영상을 만들 수 있을까. 몇 년 전까지 이 질문의 답은 분명히 아니오였다. 영상 제작은 장비를 갖추고 촬영과 편집 기술을 익힌 사람들의 영역이었다. 그러나 생성형 인공지능의 등장은 이 질서를 근본적으로 바꾸고 있다. 텍스트 몇 줄로 이미지가 만들어지고, 정지 이미지는 움직이는 영상이 되며, 글로 쓴 대본은 자연스러운 음성으로 변환된다. 수십 명의 제작진이 하던 일을 이제 한 사람의 창작자와 인공지능의 협업으로 해낼 수 있는 시대다.",
    "그런데 여기서 중요한 질문이 하나 남는다. 같은 AI와 같은 툴을 썼는데 왜 어떤 영상은 수백만 명을 사로잡고 어떤 영상은 아무 반응도 얻지 못하는가. 이 책의 답은 단순하다. 사람을 움직이는 것은 기술이 아니라 이야기이기 때문이다. 할리우드는 100년이 넘는 시간 동안 수많은 성공과 실패를 반복하며 관객의 감정을 움직이는 서사 구조를 검증해 왔다. 이 책은 바로 그 지점에서 시작한다. AI 툴 사용법을 나열하는 매뉴얼이 아니라, 할리우드가 검증한 스토리 공식과 AI 제작 기술을 하나의 작업 흐름으로 연결하는 책이다.",
    "전반부에서는 인간이 이야기에 몰입하는 이유에서 출발해, 세이브 더 캣의 핵심 원리, 주인공의 Want와 Need, 3막 구조와 15비트 시트까지 할리우드 스토리 설계법을 단계별로 다룬다. 후반부에서는 그 설계를 실제 영상으로 옮기는 과정을 따라간다. AI와 함께 기획하고 대본을 쓰는 법, 스토리보드 설계, 이미지 생성, 비디오 생성, AI 편집과 후반 제작, 그리고 숏폼 콘텐츠 실전 제작까지 기획에서 배포에 이르는 전 과정을 순서대로 안내한다.",
    "이 책의 가장 큰 특징은 하나의 작품이 책 전체를 관통한다는 점이다. 인류가 떠난 지구에 홀로 남겨진 소녀 줄리아와, 감정을 이해하지 못하는 거대 전투 로봇 RTLX0329의 여정을 그린 SF 단편 UNCANNY VALLEY다. 이 작품이 로그라인에서 15비트 구조, 캐릭터 디자인, 콘셉트 아트, 스토리보드, 영상 생성까지 각 장의 이론이 실제로 어떻게 적용되는지를 보여 주는 실습 사례로 이어진다. 독자는 이론을 배우는 동시에 한 편의 작품이 완성되어 가는 과정을 처음부터 끝까지 지켜보게 된다.",
    "부록도 실전 중심으로 구성했다. 기획부터 편집까지 바로 쓸 수 있는 AI 프롬프트 100선, 자신의 이야기를 직접 설계해 보는 제작 워크북, AI 창작 생태계의 여섯 단계 지형도, UNCANNY VALLEY 스토리 피치 전문, 그리고 단계별 실전 툴 가이드를 담았다. 유튜브 쇼츠 하나를 만들고 싶은 사람부터 단편영화를 꿈꾸는 사람까지, 머릿속에만 있던 이야기를 세상 밖으로 꺼내고 싶은 모든 창작자를 위한 책이다. 기술은 계속 바뀌지만 좋은 이야기의 원리는 변하지 않는다. 아이디어가 막힐 때, AI가 최고의 공동 작가가 되어 줄 것이다.",
  ],
};

export const awards = [
  {
    kind: "Award",
    title:
      "한국영상학회(KOSMA) 2026년 봄 심포지엄 · Next Generation 부문 우수논문상",
    meta: "2026",
  },
  {
    kind: "Certificate",
    title: "ACA(Adobe Certified Associate) — Premiere Pro",
    meta: null,
  },
  {
    kind: "Certificate",
    title: "ACA(Adobe Certified Associate) — After Effects",
    meta: null,
  },
  {
    kind: "Certificate",
    title: "ACA(Adobe Certified Associate) — Photoshop",
    meta: null,
  },
  { kind: "Language", title: "TOEIC", meta: "975" },
  { kind: "Language", title: "OPIc", meta: "Advanced Low" },
];

export const contact = {
  copy: "연구 협업, 강연, 원고 청탁 등 문의는 아래 이메일로 연락해 주세요.",
};
