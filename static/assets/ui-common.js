// Shared presentation for the local homepage and API-backed pages.
window.siteUI = {
  escape(value) {
    return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  },
  subjectText(req) {
    if (!req) return '待按院校当年招生计划核对';
    const parts = req.must.map(s => `必选 ${s}`);
    if (req.limit.length) parts.push(`${req.any ? '任选其一' : '全部限选'} ${req.limit.join('、')}`);
    return parts.join('；') || '不限选科';
  },
  majorContent(m) {
    const esc = this.escape;
    return `<div class="major-head"><h3>${esc(m.name)}</h3><span class="tag">${esc(m.category)}</span></div>
      <p class="verification ${m.subject_required ? 'verified' : 'pending'}">${m.subject_required ? '院校参考样本 · 已核对选科要求' : '选科要求待核对 · 不参与反查'}</p>
      <p class="requirement">${esc(this.subjectText(m.subject_required))}</p>
      <p class="major-source">来源：${m.source_url ? `<a href="${esc(m.source_url)}" target="_blank" rel="noopener noreferrer">${esc(m.source)}</a>` : esc(m.source)} · ${esc(m.published)}</p>
      <details class="major-more"><summary>查看专业说明</summary><p>专业代码：${esc(m.code)}</p>${m.note ? `<p>${esc(m.note)}</p>` : ''}<p>专业关联是探索方向，不代表录取或获得执业资格；实际报考以院校当年招生计划和章程为准。</p></details>`;
  },
};
