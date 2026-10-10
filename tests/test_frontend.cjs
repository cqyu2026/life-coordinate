// Regression tests with DOM/network test doubles; not browser or layout tests.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function environment() {
  const nodes = new Map();
  const document = { activeElement: null, title: '', addEventListener() {} };
  function element() {
    const attributes = {}, classes = new Set();
    return {
      dataset: {}, style: {}, children: [], hidden: false, textContent: '', value: '',
      classList: { toggle(k, v) { v ? classes.add(k) : classes.delete(k); }, add(k) { classes.add(k); }, remove(k) { classes.delete(k); }, contains(k) { return classes.has(k); } },
      setAttribute(k, v) { attributes[k] = v; }, getAttribute(k) { return attributes[k]; },
      focus() { document.activeElement = this; }, addEventListener() {}, scrollTo() {},
      appendChild(child) { this.children.push(child); },
      querySelectorAll() { return this.children; },
      set innerHTML(value) {
        this.html = value; this.children = [];
        for (const match of value.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
          const child = element(); child.textContent = match[2].replace(/<[^>]+>/g, '');
          for (const attr of match[1].matchAll(/([\w-]+)="([^"]*)"/g)) {
            child.setAttribute(attr[1], attr[2]);
            if (attr[1].startsWith('data-')) child.dataset[attr[1].slice(5)] = attr[2];
          }
          this.children.push(child);
        }
      },
      get innerHTML() { return this.html || ''; },
    };
  }
  const node = selector => {
    if (!nodes.has(selector)) nodes.set(selector, element());
    return nodes.get(selector);
  };
  document.body = element();
  document.getElementById = id => node('#' + id);
  document.createElement = element;
  document.querySelector = node;
  document.querySelectorAll = selector => {
    if (selector === '.dock .career') return node('#career-track').children;
    if (selector.startsWith('#career-cards ')) return node('#career-cards').children;
    if (selector.startsWith('#subject-picker ')) return node('#subject-picker').children;
    if (selector === '.explore-sidebar button') return node('.explore-sidebar').children;
    return [];
  };
  const context = vm.createContext({ document, console, URLSearchParams, AbortSignal,
    location: { hash: '#entry', search: '?career_id=doctor' },
    setTimeout: () => 1, clearTimeout() {}, requestAnimationFrame() {},
    fetch: async () => { throw Error('offline'); },
  });
  context.window = context;
  context.addEventListener = () => {};
  context.scrollTo = () => {};
  vm.runInContext(read('static/assets/ui-common.js'), context);
  const run = source => vm.runInContext(source, context);
  return { context, node, run };
}
function homepage() {
  const env = environment();
  env.node('#career-overlay').hidden = true;
  env.node('.explore-sidebar').innerHTML = ['全部','医','工','理','文','艺','商','教','法'].map(c => `<button data-category="${c}">${c}</button>`).join('');
  vm.runInContext(read('static/assets/site-data.js'), env.context);
  vm.runInContext(read('static/index.html').split('<script>')[1].split('</script>')[0], env.context);
  return env;
}
const flush = () => new Promise(resolve => setImmediate(resolve));
const ok = data => ({ ok: true, status: 200, json: async () => data });
const major = { id: 'law', name: '法学', code: '030101K', category: '普通', subject_required: { must: [], limit: [], any: false }, source: '参考院校', source_url: 'https://example.org', published: '2024', note: '仅供参考' };

test('full career name and alias search; empty state resets both filters', () => {
  const e = homepage();
  for (const [query, expected] of [['动画设计师','animator'],['程序员','software-engineer']]) {
    e.node('#career-search').oninput({ target: { value: query } });
    const visible = e.node('#career-cards').children.filter(b => !b.hidden);
    assert.deepEqual(visible.map(b => b.dataset.id), [expected]);
  }
  e.run("filterState.category='医'");
  e.node('#career-search').oninput({ target: { value: '不存在的职业' } });
  assert.equal(e.node('#career-empty').hidden, false);
  assert.equal(e.node('#career-cards').hidden, true);
  e.node('#reset-career-filters').onclick();
  assert.equal(e.node('#career-cards').children.filter(b => !b.hidden).length, 31);
  assert.equal(e.node('#career-empty').hidden, true);
});

test('reverse law result exposes both careers and source/details', () => {
  const e = homepage();
  e.run("chosen.add('历史'); reverse()");
  const html = e.node('#reverse-results').innerHTML;
  assert.match(html, /data-career="lawyer"/);
  assert.match(html, /data-career="legal-counsel"/);
  assert.match(html, /查看专业说明/);
  assert.match(html, /来源：教育部《普通高等学校本科专业目录（2026年）》 · 2026-04/);
  assert.doesNotMatch(html, /undefined/);
});

test('three-subject cap has accessible feedback and permits deselect/reselect', () => {
  const e = homepage();
  const click = value => e.node('#subject-picker').onclick({ target: { closest: () => ({ dataset: { subject: value } }) } });
  ['物理','化学','生物','历史'].forEach(click);
  assert.equal(e.run('chosen.size'), 3);
  assert.equal(e.run("chosen.has('历史')"), false);
  assert.match(e.node('#subject-status').textContent, /先取消/);
  assert.equal(e.node('#subject-picker').children.find(b => b.dataset.subject === '历史').getAttribute('aria-disabled'), 'true');
  click('物理'); click('历史');
  assert.equal(e.run("chosen.has('历史')"), true);
  assert.equal(e.node('#subject-picker').children.find(b => b.dataset.subject === '历史').getAttribute('aria-pressed'), 'true');
});

test('homepage selection and modal restore focus/background', () => {
  const e = homepage();
  e.node('#entry-open').focus();
  e.run("openCareer('doctor')");
  assert.equal(e.node('#career-overlay').hidden, false);
  assert.equal(e.node('main').inert, true);
  e.run('closeCareer()');
  assert.equal(e.node('main').inert, false);
  assert.equal(e.context.document.activeElement, e.node('#entry-open'));
  e.node('#entry-open').onclick();
  assert.equal(e.context.location.hash, 'explore/doctor');
});

test('unverified major has explicit status; dynamic text is escaped', () => {
  const e = environment();
  const html = e.context.siteUI.majorContent({ ...major, name: '<script>bad</script>', subject_required: null });
  assert.doesNotMatch(html, /project|verification|已核对选科要求|项目尚未核对院校选科要求|不参与反查/i);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.doesNotMatch(html, /专业关联是探索方向/);
  assert.match(html, /暂无2026年普通类招生计划统计/);
  assert.match(html, /major-source/);
  assert.match(html, /<details[\s\S]*major-source/);
});

function reversePage() {
  const e = environment();
  vm.runInContext(read('static/js/page-subject.js'), e.context);
  return e;
}
test('API search clears stale results, surfaces failure, and retries', async () => {
  const e = reversePage();
  e.run("state.selected.add('历史')");
  e.node('#result-list').innerHTML = 'old combination';
  let fail;
  e.context.fetch = () => new Promise((resolve, reject) => { fail = reject; });
  const pending = e.run('query()');
  assert.equal(e.node('#result-list').innerHTML, '');
  assert.equal(e.node('#result-list').getAttribute('aria-busy'), 'true');
  fail(Error('offline')); await pending;
  assert.match(e.node('#preview-bar').textContent, /失败或超时/);
  assert.equal(e.node('#retry-query').hidden, false);
  e.context.fetch = async () => ok([{ major, careers: [{ id: 'lawyer', name: '律师' }, { id: 'legal-counsel', name: '法务专员' }] }]);
  await e.node('#retry-query').onclick();
  assert.match(e.node('#result-list').innerHTML, /法务专员/);
  assert.equal(e.node('#retry-query').hidden, true);
  assert.equal(e.node('#result-list').getAttribute('aria-busy'), 'false');
});

test('older responses/errors cannot overwrite a newer selection or empty state', async () => {
  const e = reversePage(), pending = [];
  e.context.fetch = () => new Promise((resolve, reject) => pending.push({ resolve, reject }));
  e.run("state.selected.add('物理')"); const first = e.run('query()');
  e.run("state.selected.add('化学')"); const second = e.run('query()');
  pending[1].resolve(ok([{ major, careers: [] }])); await second;
  pending[0].reject(Error('old request failed')); await first;
  assert.match(e.node('#result-list').innerHTML, /法学/);
  assert.equal(e.node('#retry-query').hidden, true);
  const third = e.run('query()');
  e.run('state.selected.clear()'); await e.run('query()');
  pending[2].resolve(ok([{ major, careers: [] }])); await third;
  assert.equal(e.node('#result-list').innerHTML, '');
  assert.match(e.node('#preview-bar').textContent, /至少选择/);
});

for (const failure of ['network','timeout','500','json','404']) {
  test(`career detail handles ${failure} without permanent loading`, async () => {
    const e = environment();
    e.context.fetch = async () => {
      if (failure === 'network' || failure === 'timeout') throw Error(failure);
      if (failure === 'json') return { ok: true, status: 200, json: async () => { throw Error('invalid JSON'); } };
      return { ok: false, status: Number(failure) };
    };
    vm.runInContext(read('static/js/page-result.js'), e.context);
    await flush();
    assert.equal(e.node('#career-name').textContent, failure === '404' ? '职业不存在' : '暂时无法加载选科要求');
    assert.equal(e.node('#retry-load').hidden, failure === '404');
    assert.equal(e.node('#major-list').getAttribute('aria-busy'), 'false');
    e.context.fetch = async url => ok(url.endsWith('/subject') ? { majors: [major] } : { name: '临床医生' });
    await e.run('load()');
    assert.match(e.node('#career-name').textContent, /临床医生/);
    assert.match(e.node('#major-list').innerHTML, /法学/);
    assert.equal(e.node('#retry-load').hidden, true);
  });
}
