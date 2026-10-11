# 라이즈 오브 티아맷 작업 기록

작업 기간: 2026년 10월 10일 ~ 10월 11일

이 문서는 이번 대화에서 쓴 스킬을 요약하고, 사용자가 내린 명령을 순서대로 정리한 것이다.

## 1. 사용한 스킬 요약

| 스킬 | 원래 하는 일 | 이번 작업에서 쓴 방식 | 제약 |
|---|---|---|---|
| dnd-dm | CandleKeep 라이브러리에 든 공식 모험서를 읽으며 DM으로 진행하고, 세션 기록을 남긴다 | 세션 기록 형식(요약, 주요 사건, 파티 상태, 클리프행어, DM 메모)과 디버그 모드 진행 방식을 DM 가이드와 플레이 기록에 적용했다 | CandleKeep 라이브러리가 없어 모험서 원문을 읽지 못했다. 출처는 웹 자료로 대신했다 |
| make-scenario | Make(옛 Integromat) 자동화 워크플로를 만든다 | 쓰지 않았다. D&D 시나리오와 관계없는 스킬임을 확인했다 | |
| translation-quality | 용어 검증, 번역, 독립 검수, 수정, 조판을 여러 에이전트가 나눠 맡는다 | 용어집과 구조 목록을 만들고, 번역 후 독립 에이전트에게 검수를 맡겨 13건을 고쳤다. Word와 PDF로 조판했다 | 에이전트 팀 기능이 없어 번역은 직접 하고 검수만 따로 맡겼다. 공식 한국어판이 없어 고유명사는 모두 음역했다 |
| humanize-korean | 한국어 글의 AI 티와 번역투를 진단하고 윤문하며, 변경률 게이트로 과윤문을 막는다 | DM 가이드, 플레이 기록, 소설판을 차례로 윤문했다. 숫자, 고유명사, 인용문이 바뀌지 않았는지 스크립트로 대조했다 | 점수 스크립트, 변경률 게이트, 전용 에이전트가 설치되어 있지 않아 기준만 따라 직접 윤문하고 변경률은 따로 쟀다 |
| literature-reviewer | 학술 문헌을 요약하고 주제를 종합한다 | 톨킨, 파인, 매케이, 젠킨스, 멘들손, 커버의 연구를 바탕으로 DM 가이드 부록과 플레이 기록 부록 C를 썼다 | 스킬에 구체적인 절차가 없다. 이론을 적용한 부분은 "검토자의 분석"으로 구분했다 |
| ttrpg-dice-roller | 암호학적 난수로 TTRPG 주사위를 굴린다 | 플레이 기록의 굴림 269회를 실제로 굴려 결과를 고치지 않고 썼다 | 굴림 스크립트가 없어 같은 방식(Python secrets 모듈)으로 굴림기를 만들어 썼다 |
| docx | Word 문서를 만들고 확인한다 | 모든 결과물을 Word로 만들고 PDF로 변환해 페이지를 눈으로 확인했다 | |

ImNotAI Korean humanizer는 스킬 목록에 없어서 humanize-korean으로 대신했다.

## 2. 사용자 명령과 결과

| 순서 | 명령 | 결과 |
|---|---|---|
| 1 | Help me make a DND Scenario using the DND-DM skill and make-scenario skill, and translate it in Korean using the ImNotAI Korean humanizer | 스킬 세 개를 확인했다. make-scenario는 관련이 없고, dnd-dm은 시나리오를 새로 만드는 도구가 아니며, ImNotAI는 없다는 점을 알리고 진행 방식을 물었다 |
| 2 | then create a whole dm guide of rise of tiamat using the dnd dm skill, and using the translation-quality skill to translate into korean and review using the humanize-korean skill. then use the literature reviewer to review this as a scenario for fantasy literature. | 모험서 원문 대신 출처를 밝힌 DM 컴패니언 가이드를 영어로 썼다. 이를 한국어로 번역하고 검수, 윤문한 뒤 판타지 문학 검토 부록을 붙였다. 결과물: 라이즈_오브_티아맷_DM_가이드(docx, pdf), Rise_of_Tiamat_DM_Companion_EN.md |
| 3 | 그럼 해당 캠페인대로 진행을 하여 직접 GM과 플레이어를 자처해서 엔딩까지의 시나리오를 적어 놓아줘 | 캐릭터 넷을 만들고 주사위를 실제로 굴려 8세션을 엔딩까지 진행했다. 결과물: 라이즈_오브_티아맷_플레이_기록(docx, pdf) |
| 4 | 이제 자연스러운 한글로 바꾸어줘 | 플레이 기록의 대사를 실제 테이블 말투로, 서술을 자연스러운 문장으로 고쳤다. 숫자는 그대로 두었다 |
| 5 | 그럼 이제 literature 스킬로 분석을 해서 더 다듬어줘 | 플레이 기록을 서사로 분석해 부록 C로 붙였다. 분석 결과에 따라 세션 8과 에필로그에 앞 세션과 이어지는 묘사를 보탰다 |
| 6 | 이제 이것을 문학적으로 완만하게 만들어줘 | 대화체와 수치를 걷어 내고 3인칭 산문으로 다시 썼다. 결과물: 협의회의_네_사람_소설판(docx, pdf) |
| 7 | 이것을 다시 자연스러운 한국어로 바꾸어줘 | 소설판의 번역투("그녀", "그러나", "다섯 개의 머리", "~것이었다")와 반복되는 문장 틀을 고쳤다 |
| 8 | 이제 여태 있던 명령을 md로 export, 썼던 스킬들에 대한 간단한 summary 이후 명령들을 써줘 | 이 문서 |

## 3. 결과물 목록

| 파일 | 내용 |
|---|---|
| Rise_of_Tiamat_DM_Companion_EN.md | DM 컴패니언 가이드 영어 원본 |
| 라이즈_오브_티아맷_DM_가이드.docx, .pdf | 한국어 DM 가이드와 판타지 문학 검토 부록 |
| 라이즈_오브_티아맷_플레이_기록.docx, .pdf | 8세션 플레이 기록, 협의회 점수 추이, 전체 굴림 기록, 서사 검토 부록 |
| 협의회의_네_사람_소설판.docx, .pdf | 플레이 기록을 다시 쓴 소설판 |

## 4. 출처

- D&D 비욘드, Tyranny of Dragons 목차. https://www.dndbeyond.com/sources/dnd/tod
- 위키백과, The Rise of Tiamat. https://en.wikipedia.org/wiki/The_Rise_of_Tiamat
- 스티브 윈터, The Rise of Tiamat: A DM's and Player's Overview, 코볼드 프레스, 2014. https://koboldpress.com/the-rise-of-tiamat-a-dms-and-players-overview/
- Review: The Rise of Tiamat (D&D), 스트레인지 어셈블리, 2015. https://www.strangeassembly.com/2015/review-the-rise-of-tiamat-dd
- 마이크 셰이, Running Rise of Tiamat, 슬라이 플러리시. https://slyflourish.com/running_rise_of_tiamat.html
