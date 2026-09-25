const TYPE_LABEL = {
  text: "텍스트",
  note: "노트",
  image: "이미지",
  thumb: "추천 썸네일",
};

// 글/노트/이미지/추천 썸네일 블록을 추가·삭제·순서변경하는 에디터.
// 이미지·썸네일 사진은 URL을 직접 입력한다 — "미디어 업로드" 탭에서
// 파일 올리고 "URL 복사"한 값을 여기 붙여넣으면 된다.
export default function BlockEditor({ blocks, onChange }) {
  function update(i, patch) {
    onChange(blocks.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  }
  function remove(i) {
    onChange(blocks.filter((_, idx) => idx !== i));
  }
  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = blocks.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  function addText() {
    onChange([...blocks, { type: "text", text: "" }]);
  }
  function addNote() {
    onChange([...blocks, { type: "note", text: "" }]);
  }
  function addImage() {
    onChange([
      ...blocks,
      { type: "image", url: "", align: "center", caption: "", link: "" },
    ]);
  }
  function addThumb() {
    onChange([
      ...blocks,
      { type: "thumb", url: "", align: "center", text: "", link: "" },
    ]);
  }

  return (
    <div className="block-editor">
      {blocks.map((b, i) => (
        <div className="block-editor-item" key={i}>
          <div className="block-editor-head">
            <span className="admin-muted">
              {TYPE_LABEL[b.type] || b.type} #{i + 1}
            </span>
            <div className="block-editor-actions">
              <button
                type="button"
                className="admin-btn ghost"
                onClick={() => move(i, -1)}
                disabled={i === 0}
              >
                ↑
              </button>
              <button
                type="button"
                className="admin-btn ghost"
                onClick={() => move(i, 1)}
                disabled={i === blocks.length - 1}
              >
                ↓
              </button>
              <button
                type="button"
                className="admin-btn danger"
                onClick={() => remove(i)}
              >
                삭제
              </button>
            </div>
          </div>

          {b.type === "text" && (
            <textarea
              className="block-editor-body"
              rows={10}
              value={b.text}
              onChange={(e) => update(i, { text: e.target.value })}
              placeholder="원문을 그대로 옮겨 쓰거나 붙여넣으세요. 문단을 나누려면 빈 줄을 한 줄 띄우면 됩니다."
            />
          )}

          {b.type === "note" && (
            <textarea
              rows={4}
              value={b.text}
              onChange={(e) => update(i, { text: e.target.value })}
              placeholder="강조해서 보여줄 짧은 메모(인용, 참고 등). 본문과 다르게 박스로 표시됩니다."
            />
          )}

          {b.type === "image" && (
            <div className="block-editor-image">
              <input
                type="text"
                value={b.url}
                onChange={(e) => update(i, { url: e.target.value })}
                placeholder="이미지 URL (미디어 업로드 탭에서 복사)"
              />
              <input
                type="text"
                value={b.link || ""}
                onChange={(e) => update(i, { link: e.target.value })}
                placeholder="클릭 시 이동할 링크 (선택, 예: https://...)"
              />
              <div className="block-editor-row">
                <label>
                  정렬
                  <select
                    value={b.align || "center"}
                    onChange={(e) => update(i, { align: e.target.value })}
                  >
                    <option value="left">왼쪽</option>
                    <option value="center">가운데</option>
                    <option value="right">오른쪽</option>
                  </select>
                </label>
                <input
                  type="text"
                  value={b.caption || ""}
                  onChange={(e) => update(i, { caption: e.target.value })}
                  placeholder="캡션 (선택)"
                />
              </div>
              {b.url && (
                <img src={b.url} alt="" className="block-editor-preview" />
              )}
            </div>
          )}

          {b.type === "thumb" && (
            <div className="block-editor-image">
              <input
                type="text"
                value={b.url}
                onChange={(e) => update(i, { url: e.target.value })}
                placeholder="썸네일 사진 URL (미디어 업로드 탭에서 복사)"
              />
              <textarea
                rows={3}
                value={b.text}
                onChange={(e) => update(i, { text: e.target.value })}
                placeholder="첫 줄 = 큰 제목, 다음 줄부터 = 작은 캡션"
              />
              <input
                type="text"
                value={b.link || ""}
                onChange={(e) => update(i, { link: e.target.value })}
                placeholder="클릭 시 이동할 링크 (예: #research, https://...)"
              />
              <div className="block-editor-row">
                <label>
                  정렬
                  <select
                    value={b.align || "center"}
                    onChange={(e) => update(i, { align: e.target.value })}
                  >
                    <option value="left">왼쪽</option>
                    <option value="center">가운데</option>
                    <option value="right">오른쪽</option>
                  </select>
                </label>
              </div>
              {b.url && (
                <img src={b.url} alt="" className="block-editor-preview" />
              )}
            </div>
          )}
        </div>
      ))}

      <div className="block-editor-add">
        <button type="button" className="admin-btn ghost" onClick={addText}>
          + 텍스트 블록
        </button>
        <button type="button" className="admin-btn ghost" onClick={addNote}>
          + 노트 블록
        </button>
        <button type="button" className="admin-btn ghost" onClick={addImage}>
          + 이미지 블록
        </button>
        <button type="button" className="admin-btn ghost" onClick={addThumb}>
          + 추천 썸네일 블록
        </button>
      </div>
    </div>
  );
}
