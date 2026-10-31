// Nikke Library — story reader front end.
const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// API calls. The GitHub Pages build has no server: index.html sets STATIC_API and every
// response is a pre-built file (see build-static.js; mirrors staticApiPath in lib/api.js).
function staticApiPath(url) {
  const u = new URL(url, 'http://x');
  const enc = (v) => v.replace(/[^A-Za-z0-9_.-]/g, (c) => `~${c.codePointAt(0).toString(16)}`);
  const keys = [...u.searchParams.keys()].sort();
  const base = u.pathname.replace(/^\/+/, '');
  return keys.length ? `${base}/${keys.map((k) => `${k}.${enc(u.searchParams.get(k))}`).join('__')}.json` : `${base}.json`;
}
const apiFetch = (url) => fetch(window.STATIC_API ? staticApiPath(url) : url);

const store = {
  get(k, d) { try { const v = localStorage.getItem('nl.' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('nl.' + k, JSON.stringify(v)); } catch {} },
};

const state = {
  catalogue: [],
  cat: store.get('cat', 'main'),
  filter: '',
  scene: null,
  mode: store.get('mode', 'flow'),          // 'flow' follows choices/jumps, 'all' shows raw order
  showKeys: store.get('showKeys', false),
  showDirections: store.get('showDirections', false),
  choices: {},                              // choice block id -> selected option index
};

// Stable per-speaker colour.
function speakerColor(id) {
  let h = 0;
  for (const c of id || '') h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return `hsl(${h % 360} 65% 70%)`;
}

async function init() {
  const res = await apiFetch('/api/stories');
  const data = await res.json();
  state.catalogue = data.categories;
  const pill = $('#locale-status');
  pill.textContent = data.localeLoaded ? 'Locale loaded' : 'No locale — showing keys';
  pill.classList.toggle('ok', data.localeLoaded);
  if (!state.catalogue.some((c) => c.id === state.cat)) state.cat = 'main';

  $('#filter').addEventListener('input', (e) => {
    state.filter = e.target.value.trim().toLowerCase();
    if (section === 'stages') Stages.renderTree();
    else if (section === 'raids') Raids.renderTree();
    else if (section === 'characters') Characters.renderTree();
    else if (section === 'minigames') { Minigames.renderTree(); Minigames.rerender(); }
    else if (section === 'progression') Progression.renderTree();
    else if (section === 'jukebox') { Jukebox.renderTree(); Jukebox.rerender(); }
    else renderTree();
  });
  window.addEventListener('hashchange', dispatch);
  dispatch();
}

// Top-level sections share the sidebar (#cat-tabs, #filter, #tree) and #reader.
let section = null;

function enterSection(name) {
  if (section === name) return false;
  section = name;
  document.querySelectorAll('.nav-item[data-section]').forEach((a) => a.classList.toggle('active', a.dataset.section === name));
  state.filter = '';
  $('#filter').value = '';
  $('#filter').placeholder = {
    stages: 'Filter chapters, stages or floors…',
    jukebox: 'Filter albums, tracks or artists…',
    raids: 'Filter seasons or bosses…',
    characters: 'Filter name, class, weapon, element…',
    minigames: 'Filter songs, artists or albums…',
  }[name] || 'Filter groups or scenes…';
  return true;
}

async function dispatch() {
  if (/^#\/stage/.test(location.hash)) {
    if (enterSection('stages')) await Stages.enter();
    return Stages.route();
  }
  if (/^#\/progression/.test(location.hash)) {
    if (enterSection('progression')) await Progression.enter();
    return Progression.route();
  }
  if (/^#\/minigame/.test(location.hash)) {
    if (enterSection('minigames')) await Minigames.enter();
    return Minigames.route();
  }
  if (/^#\/character/.test(location.hash)) {
    if (enterSection('characters')) await Characters.enter();
    return Characters.route();
  }
  if (/^#\/raid/.test(location.hash)) {
    if (enterSection('raids')) await Raids.enter();
    return Raids.route();
  }
  if (/^#\/jukebox/.test(location.hash)) {
    if (enterSection('jukebox')) await Jukebox.enter();
    return Jukebox.route();
  }
  if (enterSection('stories')) {
    renderTabs();
    if (!/^#\/scene\//.test(location.hash)) {
      state.scene = null;
      $('#reader').innerHTML = `<div class="empty"><h1>Story Reader</h1><p>Pick a chapter, event or episode from the left to start reading.</p></div>`;
    }
  }
  return route();
}

function renderTabs() {
  $('#cat-tabs').innerHTML = state.catalogue.map((c) => {
    const n = c.groups.reduce((s, g) => s + g.scenes.length, 0);
    return `<button class="cat-tab ${c.id === state.cat ? 'active' : ''}" data-cat="${c.id}">${esc(c.label)}<span class="n">${n}</span></button>`;
  }).join('');
  $('#cat-tabs').querySelectorAll('.cat-tab').forEach((b) => b.onclick = () => {
    state.cat = b.dataset.cat; store.set('cat', state.cat); renderTabs(); renderTree();
  });
}

function renderTree() {
  const cat = state.catalogue.find((c) => c.id === state.cat);
  const f = state.filter;
  const activeId = state.scene?.id;
  const html = cat.groups.map((g) => {
    const groupHit = !f || g.label.toLowerCase().includes(f) || g.id.toLowerCase().includes(f);
    const scenes = groupHit ? g.scenes : g.scenes.filter((s) => s.label.toLowerCase().includes(f) || s.id.toLowerCase().includes(f));
    if (!scenes.length) return '';
    const open = (f && !groupHit) || scenes.some((s) => s.id === activeId);
    return `<details class="group" ${open ? 'open' : ''}>
      <summary>${esc(g.label)}<span class="count">${scenes.length}</span></summary>
      ${scenes.map((s) => `<a class="scene-link ${s.id === activeId ? 'active' : ''}" href="#/scene/${encodeURIComponent(s.id)}" title="${esc(s.id)}">
        <span>${esc(s.label)}</span><span class="lines">${s.lines}</span></a>`).join('')}
    </details>`;
  }).join('');
  $('#tree').innerHTML = html || '<p class="key" style="padding:12px">No matches.</p>';
  $('#tree .scene-link.active')?.scrollIntoView({ block: 'nearest' });
}

async function route() {
  const m = location.hash.match(/^#\/scene\/(.+)$/);
  if (!m) { renderTree(); return; }
  const id = decodeURIComponent(m[1]);
  const res = await apiFetch('/api/scene?id=' + encodeURIComponent(id));
  if (!res.ok) { $('#reader').innerHTML = `<div class="error">Scene "${esc(id)}" not found.</div>`; return; }
  state.scene = await res.json();
  state.choices = {};
  if (state.scene.cat !== state.cat) { state.cat = state.scene.cat; store.set('cat', state.cat); renderTabs(); }
  renderTree();
  renderScene();
  $('#reader').scrollTop = 0;
}

// Walk the scene the way the game plays it: consecutive Choice rows form one
// block, the chosen option's jump_target decides where to continue, and any
// other row with a jump_target jumps after it is shown.
function flowItems(lines) {
  const index = new Map(lines.map((l, i) => [l.id, i]));
  const items = [];
  let i = 0, guard = 0;
  while (i < lines.length && guard++ < lines.length * 4) {
    const line = lines[i];
    if (line.type === 'Choice') {
      const block = [];
      while (i + block.length < lines.length && lines[i + block.length].type === 'Choice') block.push(lines[i + block.length]);
      const sel = state.choices[block[0].id] ?? 0;
      items.push({ choice: block, blockId: block[0].id, sel });
      const target = block[sel].jump;
      i = target && index.has(target) ? index.get(target) : i + block.length;
      continue;
    }
    items.push({ line });
    if (line.exit) break;
    i = line.jump && index.has(line.jump) ? index.get(line.jump) : i + 1;
  }
  return items;
}

function rawItems(lines) {
  const items = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].type === 'Choice') {
      const block = [];
      while (i < lines.length && lines[i].type === 'Choice') block.push(lines[i++]);
      i--;
      items.push({ choice: block, blockId: block[0].id, sel: -1 });
    } else items.push({ line: lines[i], raw: true });
  }
  return items;
}

const shortId = (id) => '#' + id.slice(id.lastIndexOf('_') + 1);

function textHtml(line) {
  if (line.text != null) return esc(line.text);
  return `<span class="key">${esc(line.key || '(no text)')}</span>`;
}

function directionsHtml(line) {
  if (!state.showDirections) return '';
  const d = [];
  if (line.bg) d.push(['BG', line.bg]);
  if (line.image) d.push(['IMG', line.image]);
  if (line.movie) d.push(['MOVIE', line.movie]);
  if (line.bgm) d.push(['BGM', line.bgm]);
  if (line.shown) d.push(['SHOW', line.shown.join(', ')]);
  if (!d.length) return '';
  return `<div class="directions">${d.map(([k, v]) => `<span class="dir"><b>${k}</b> ${esc(v)}</span>`).join('')}</div>`;
}

function lineHtml(line, raw) {
  const { speakers } = state.scene;
  const type = (line.type || 'Speech').toLowerCase();
  const name = line.speaker ? speakers[line.speaker] ?? line.speaker : '';
  const color = type === 'speech' || type === 'monologue' ? `style="color:${speakerColor(line.speaker)}"` : '';
  const meta = state.showKeys
    ? `<div class="key"><span class="lid">${shortId(line.id)}</span>${esc(line.key || '')}${line.speaker ? ` · ${esc(line.speaker)}` : ''}</div>` : '';
  let out = directionsHtml(line);
  out += `<div class="line ${type}">
    <div class="who" ${color}>${esc(name)}</div>
    <div class="body"><div class="say">${textHtml(line)}</div>${meta}</div>
  </div>`;
  if (raw && line.jump) out += `<div class="jump-note">↳ jumps to ${shortId(line.jump)}</div>`;
  if (line.enter) out += `<div class="jump-note">↳ enters scenario <a href="#/scene/${encodeURIComponent(line.enter)}">${esc(line.enter)}</a></div>`;
  return out;
}

// Counseling choices carry affection points ("_120" / "_100"); the highest-scoring
// option in a block is the correct answer.
const choicePoints = (opt) => Number(String(opt.affinity ?? '').replace(/^_/, '')) || 0;

function choiceHtml(item) {
  const points = item.choice.map(choicePoints);
  const best = Math.max(...points);
  const scored = best > 0 && new Set(points).size > 1;
  return `<div class="choice"><div class="choice-label">Choice</div>${item.choice.map((opt, i) => `
    <button class="option ${i === item.sel ? 'selected' : ''} ${scored && points[i] === best ? 'correct' : ''}" data-block="${esc(item.blockId)}" data-i="${i}">
      ${opt.jump ? `<span class="jump">→ ${shortId(opt.jump)}</span>` : ''}
      ${points[i] ? `<span class="points">${scored && points[i] === best ? '✓ Correct · ' : ''}+${points[i]} pts</span>` : ''}${textHtml(opt)}
      ${state.showKeys ? `<div class="key"><span class="lid">${shortId(opt.id)}</span>${esc(opt.key || '')}</div>` : ''}
    </button>`).join('')}</div>`;
}

function renderScene() {
  const s = state.scene;
  const items = state.mode === 'flow' ? flowItems(s.lines) : rawItems(s.lines);
  const navBtn = (id, label) => `<a class="nav-btn" href="${id ? '#/scene/' + encodeURIComponent(id) : '#'}" aria-disabled="${!id}">${label}</a>`;
  const shown = items.reduce((n, it) => n + (it.choice ? 1 : 1), 0);

  $('#reader').innerHTML = `
    <div class="scene-head">
      <div class="crumb">${esc(state.catalogue.find((c) => c.id === s.cat).label)} · ${esc(s.group.label)}${s.stage ? ` · ${esc(s.stage)}` : ''}</div>
      <div class="scene-title">${esc(s.label)}</div>
      <div class="toolbar">
        <div class="seg" id="mode">
          <button data-mode="flow" class="${state.mode === 'flow' ? 'active' : ''}" title="Follow choices and jumps like the game">Play flow</button>
          <button data-mode="all" class="${state.mode === 'all' ? 'active' : ''}" title="Every line in file order, all branches">All lines</button>
        </div>
        <label class="toggle"><input type="checkbox" id="t-keys" ${state.showKeys ? 'checked' : ''}> Keys</label>
        <label class="toggle"><input type="checkbox" id="t-dir" ${state.showDirections ? 'checked' : ''}> Stage directions</label>
        <span class="key">${esc(s.id)} · ${shown}/${s.lines.length} lines</span>
        <span class="spacer"></span>
        ${navBtn(s.prev, '← Prev')}${navBtn(s.next, 'Next →')}
      </div>
    </div>
    <div class="script">
      ${items.map((it) => (it.choice ? choiceHtml(it) : lineHtml(it.line, it.raw))).join('')}
      <div class="end-mark">— END —</div>
      <div class="end-nav">${navBtn(s.prev, '← Previous scene')}${navBtn(s.next, 'Next scene →')}</div>
    </div>`;

  $('#mode').querySelectorAll('button').forEach((b) => b.onclick = () => { state.mode = b.dataset.mode; store.set('mode', state.mode); renderScene(); });
  $('#t-keys').onchange = (e) => { state.showKeys = e.target.checked; store.set('showKeys', state.showKeys); renderScene(); };
  $('#t-dir').onchange = (e) => { state.showDirections = e.target.checked; store.set('showDirections', state.showDirections); renderScene(); };
  $('#reader').querySelectorAll('.option').forEach((b) => b.onclick = () => {
    if (state.mode !== 'flow') return;
    state.choices[b.dataset.block] = Number(b.dataset.i);
    const y = $('#reader').scrollTop;
    renderScene();
    $('#reader').scrollTop = y;
  });
}

document.addEventListener('keydown', (e) => {
  if (section !== 'stories' || !state.scene || e.target.matches('input')) return;
  if (e.key === 'ArrowRight' && state.scene.next) location.hash = '#/scene/' + encodeURIComponent(state.scene.next);
  if (e.key === 'ArrowLeft' && state.scene.prev) location.hash = '#/scene/' + encodeURIComponent(state.scene.prev);
});

document.addEventListener('DOMContentLoaded', init);
