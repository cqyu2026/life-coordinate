// Independent API-backed career requirements.
const params = new URLSearchParams(window.location.search);
const careerId = params.get("career_id");
const titleEl = document.getElementById("career-name");
const listEl = document.getElementById("major-list");
const retryEl = document.getElementById("retry-load");
let latestLoad = 0;

async function load() {
  const loadId = ++latestLoad;
  retryEl.hidden = true;
  listEl.innerHTML = "";
  if (!careerId) {
    titleEl.textContent = "未指定职业";
    listEl.innerHTML = '<div class="empty-state"><p>请返回首页选择职业后查看。</p><a href="/#explore">探索职业 →</a></div>';
    return;
  }
  titleEl.textContent = "加载中…";
  listEl.setAttribute("aria-busy", "true");
  try {
    const signal = AbortSignal.timeout(10000);
    const [careerResponse, subjectResponse] = await Promise.all([
      fetch(`/api/careers/${encodeURIComponent(careerId)}`, { signal }),
      fetch(`/api/careers/${encodeURIComponent(careerId)}/subject`, { signal }),
    ]);
    if (loadId !== latestLoad) return;
    if (careerResponse.status === 404 || subjectResponse.status === 404) {
      titleEl.textContent = "职业不存在";
      listEl.innerHTML = '<div class="empty-state"><p>请返回首页重新选择职业。</p><a href="/#explore">探索职业 →</a></div>';
      return;
    }
    if (!careerResponse.ok || !subjectResponse.ok) throw new Error("服务暂不可用");
    const [c, s] = await Promise.all([careerResponse.json(), subjectResponse.json()]);
    if (loadId !== latestLoad) return;
    titleEl.textContent = `${c.name} · 关联专业与选科`;
    document.title = `${c.name} · life-coordinate`;
    const ordered = [...s.majors.filter(m => m.category === "普通"), ...s.majors.filter(m => m.category !== "普通")];
    listEl.innerHTML = ordered.length
      ? ordered.map(m => `<article class="major-card">${window.siteUI.majorContent(m)}</article>`).join("")
      : '<div class="empty-state"><p>该职业尚未录入关联专业，暂不提供选科推断。</p><a href="/#explore">探索其他职业 →</a></div>';
  } catch {
    if (loadId !== latestLoad) return;
    titleEl.textContent = "暂时无法加载选科要求";
    listEl.innerHTML = '<div class="empty-state">请求失败、超时或数据无法解析，请重试。</div>';
    retryEl.hidden = false;
  } finally {
    if (loadId === latestLoad) listEl.setAttribute("aria-busy", "false");
  }
}

retryEl.onclick = load;
document.getElementById("btn-back-home").onclick = () => (window.location.href = "/");
document.getElementById("btn-reverse").onclick = () => (window.location.href = "/subject");
load();
