// "제목\n캡션" 형식의 한 필드를 큰 제목 + 작은 캡션으로 나눈다.
// Featured 카드와 콘텐츠 블록의 "추천 썸네일" 타입이 공용으로 쓴다.
export function splitTitleCaption(text) {
  const lines = (text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return { title: lines[0] || "", caption: lines.slice(1).join(" · ") };
}
