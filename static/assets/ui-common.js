// Shared presentation for the local homepage and API-backed pages.
window.siteUI = {
  escape(value) {
    return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  },
    subjectText(req) {
      if (!req) return '暂无2026年普通类招生计划统计';
    const parts = req.must.map(s => `必选 ${s}`);
    if (req.limit.length) parts.push(`${req.any ? '任选其一' : '全部限选'} ${req.limit.join('、')}`);
    return parts.join('；') || '不限选科';
  },
  majorContent(m) {
    const esc = this.escape;
      return `<div class="major-head"><h3>${esc(m.name)}</h3><span class="tag">${esc(m.category)}</span></div>
      <p class="requirement">${m.subject_summary_html || esc(this.subjectText(m.subject_required))}</p>
        <details class="major-more"><summary>查看专业说明</summary><p>专业代码：${esc(m.code)}</p><p class="major-source">来源：教育部《普通高等学校本科专业目录（2026年）》 · 2026-04</p></details>`;
  },
};
