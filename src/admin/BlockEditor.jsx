// 텍스트/이미지 블록을 추가·삭제·순서변경하는 에디터.
// 이미지는 URL을 직접 입력한다 — "미디어 업로드" 탭에서 파일 올리고
// "URL 복사"한 값을 여기 붙여넣으면 된다.
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
  function addImage() {
    onChange([...blocks, { type: "image", url: "", align: "center", caption: "" }]);
  }

  return (
    <div className="block-editor">
      {blocks.map((b, i) => (
        <div className="block-editor-item" key={i}>
          <div className="block-editor-head">
            <span className="admin-muted">
              {b.type === "text" ? "텍스트" : "이미지"} #{i + 1}
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

          {b.type === "text" ? (
            <textarea
              rows={4}
              value={b.text}
              onChange={(e) => update(i, { text: e.target.value })}
              placeholder="문단 내용"
            />
          ) : (
            <div className="block-editor-image">
              <input
                type="text"
                value={b.url}
                onChange={(e) => update(i, { url: e.target.value })}
                placeholder="이미지 URL (미디어 업로드 탭에서 복사)"
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
        </div>
      ))}

      <div className="block-editor-add">
        <button type="button" className="admin-btn ghost" onClick={addText}>
          + 텍스트 블록
        </button>
        <button type="button" className="admin-btn ghost" onClick={addImage}>
          + 이미지 블록
        </button>
      </div>
    </div>
  );
}
