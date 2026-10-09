// Independent API-backed subject search.
const SUBJECTS = ["物理", "化学", "生物", "政治", "历史", "地理", "技术"];
const state = { selected: new Set() };
const optionsEl = document.getElementById("subject-options");
const previewEl = document.getElementById("preview-bar");
const listEl = document.getElementById("result-list");
const selectionEl = document.getElementById("selection-status");
const retryEl = document.getElementById("retry-query");
let latestQuery = 0;

function renderOptions() {
  optionsEl.querySelectorAll("button").forEach(btn => {
    const selected = state.selected.has(btn.dataset.subject);
    btn.classList.toggle("active", selected);
    btn.setAttribute("aria-pressed", String(selected));
    btn.setAttribute("aria-disabled", String(!selected && state.selected.size === 3));
    btn.textContent = (selected ? "✓ " : "") + btn.dataset.subject;
  });
  selectionEl.textContent = `已选 ${state.selected.size}/3。` + (state.selected.size === 3
    ? "已达上限，请先取消一门，再选择其他科目。" : "最多选择 3 门科目。");
}

SUBJECTS.forEach(s => {
  const btn = document.createElement("button");
  btn.className = "subject-toggle";
  btn.dataset.subject = s;
  btn.onclick = () => {
    if (state.selected.has(s)) state.selected.delete(s);
    else if (state.selected.size < 3) state.selected.add(s);
    else { renderOptions(); return; }
    renderOptions();
    query();
  };
  optionsEl.appendChild(btn);
});

async function query() {
  const queryId = ++latestQuery;
  const subjects = [...state.selected];
  listEl.innerHTML = "";
  retryEl.hidden = true;
  listEl.setAttribute("aria-busy", String(subjects.length > 0));
  if (!subjects.length) {
    previewEl.textContent = "请至少选择 1 门科目";
    return;
  }
  previewEl.textContent = `正在查询：${subjects.join("、")}…`;
  try {
    const res = await fetch(`/api/majors?subjects=${encodeURIComponent(subjects.join(","))}`, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error("查询失败");
    const data = await res.json();
    if (queryId !== latestQuery) return;
    previewEl.textContent = `参考匹配 ${data.length} 个专业（已选 ${subjects.length}/3；仅依据已录入院校样本）`;
    if (!data.length) {
      listEl.innerHTML = '<div class="empty-state"><p>当前样本未匹配到专业，不表示没有可报专业。请调整科目，或返回探索职业。</p><a href="/#explore">返回探索职业 →</a></div>';
      return;
    }
    const esc = window.siteUI.escape;
    listEl.innerHTML = data.map(r => `<article class="result-item">
      ${window.siteUI.majorContent(r.major)}
      <div class="result-actions">${r.careers.length ? r.careers.map(c => `<a class="secondary" href="/#explore/${encodeURIComponent(c.id)}">了解${esc(c.name)} →</a>`).join("") : "<p>暂无关联职业</p>"}</div>
    </article>`).join("");
  } catch {
    if (queryId !== latestQuery) return;
    listEl.innerHTML = "";
    previewEl.textContent = "查询失败或超时，请检查连接后重试。";
    retryEl.hidden = false;
  } finally {
    if (queryId === latestQuery) listEl.setAttribute("aria-busy", "false");
  }
}

retryEl.onclick = query;
renderOptions();
