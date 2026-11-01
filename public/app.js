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

// Extracted game art (web copies from tools/web-images.py, names lowercased). An image
// that wasn't extracted removes itself instead of showing as broken.
const gameImg = (family, name, cls = '') => (name
  ? `<img class="${cls}" src="img/${family}/${esc(String(name).toLowerCase())}.${family === 'scenariobackground' ? 'jpg' : 'webp'}" alt="" loading="lazy" onerror="this.remove()">`
  : '');

// Compact values for tables (README "Page patterns"): every section formats numbers the same way.
const fmtNum = (n) => (n == null || n === '' ? '—' : Number(n).toLocaleString('en-US'));
// 1,234,567 -> "1.23M" with the exact value on hover; below 10,000 stays exact.
const fmtShort = (n) => {
  if (n == null || n === '') return '—';
  const v = Number(n), a = Math.abs(v);
  const [d, u] = a >= 1e9 ? [1e9, 'B'] : a >= 1e6 ? [1e6, 'M'] : a >= 1e4 ? [1e3, 'K'] : [1, ''];
  return u ? `<span title="${fmtNum(v)}">${+(v / d).toFixed(v / d >= 100 ? 0 : 2)}${u}</span>` : fmtNum(v);
};
const fmtPct = (v, digits = 1) => (v == null ? '—' : `${+Number(v).toFixed(digits)}%`);
// Seconds -> "45s", "12m 30s", "3h 05m", "2d 4h".
const fmtDur = (s) => {
  if (s == null) return '—';
  const d = Math.floor(s / 86400), h = Math.floor(s / 3600) % 24, m = Math.floor(s / 60) % 60, sec = Math.round(s % 60);
  return d ? `${d}d ${h}h` : h ? `${h}h ${String(m).padStart(2, '0')}m` : m ? `${m}m${sec ? ` ${sec}s` : ''}` : `${sec}s`;
};

// A minigame's in-game "how to play" pages.
function helpHtml(help) {
  return `<div class="stage-body">${help.map((h) => `<section class="card"><h3>${esc(h.title)}</h3>
    ${h.pages.map((p) => `<div class="help-page">${gameImg('icons-event', p.image, 'help-img')}
      <div>${p.title && p.title !== h.title ? `<div class="track-name">${esc(p.title)}</div>` : ''}<div class="adv-text">${esc(p.text)}</div></div></div>`).join('')}
  </section>`).join('')}</div>`;
}

const store = {
  get(k, d) { try { const v = localStorage.getItem('nl.' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('nl.' + k, JSON.stringify(v)); } catch {} },
};

// Random box contents, for any page that lists rewards. boxToggle(reward) is an expandable
// "Contents" block for a reward with a `box` (ItemRandomTable group, from rewardInfo in
// lib/stages.js); it loads /api/box when opened. Equipment is grouped by tier and slot,
// merged or split by manufacturer (one toggle for every box).
const boxView = { cache: new Map(), split: store.get('boxSplit', false) };
const boxToggle = (r) => (r?.box ? `<details class="box" data-box="${r.box}"><summary>Contents</summary></details>` : '');
const fmtChance = (c) => `${c >= 10 ? +c.toFixed(1) : +c.toPrecision(2)}%`;

function boxHtml(b) {
  const amt = (e) => `×${e.min === e.max ? fmtNum(e.min) : `${fmtNum(e.min)}–${fmtNum(e.max)}`}`;
  const table = (head, rows) => `<div class="table-scroll"><table class="roster keep-cols box-table"><thead><tr>${head}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
  const gear = new Map();
  const corps = new Set();
  for (const e of b.entries) {
    if (!e.equip) continue;
    for (const [corp, share] of Object.entries(e.equip.corps)) {
      corps.add(corp);
      const key = `${e.equip.tier}|${e.equip.slot}|${boxView.split ? corp : ''}`;
      const g = gear.get(key) || { ...e.equip, corp, min: e.min, max: e.max, chance: 0, classes: new Set() };
      g.chance += e.chance * share;
      g.classes.add(e.equip.cls);
      gear.set(key, g);
    }
  }
  const SLOTS = ['Head', 'Body', 'Arm', 'Leg'];
  const CORPS = ['ELYSION', 'MISSILIS', 'TETRA', 'PILGRIM', 'ABNORMAL', 'NONE'];
  const corpName = (c) => b.corpNames[c] || c;
  const corpOrder = (c) => (CORPS.includes(c) ? CORPS.indexOf(c) : CORPS.length);
  // Split: one block per manufacturer (heading row with its total), gear by tier and slot inside.
  const gearList = [...gear.values()]
    .sort((x, y) => (boxView.split ? corpOrder(x.corp) - corpOrder(y.corp) : 0)
      || parseInt(y.tier.slice(1)) - parseInt(x.tier.slice(1)) || SLOTS.indexOf(x.slot) - SLOTS.indexOf(y.slot));
  const gearAmt = gearList.some((g) => g.min !== 1 || g.max !== 1);
  const cols = 2 + (gearAmt ? 1 : 0);
  const corpTotal = (c) => gearList.reduce((n, g) => n + (g.corp === c ? g.chance : 0), 0);
  const gearRows = gearList.map((g, i) => (boxView.split && g.corp !== gearList[i - 1]?.corp
    ? `<tr class="box-group"><td colspan="${cols}">${esc(corpName(g.corp))}</td><td class="num">${fmtChance(corpTotal(g.corp))}</td></tr>` : '')
    + `<tr><td>${esc(g.tier)} ${esc(g.slot)}</td><td>${g.classes.has('All') || g.classes.size === 3 ? 'Any' : esc([...g.classes].join(' / '))}</td>
        ${gearAmt ? `<td class="num">${amt(g)}</td>` : ''}<td class="num">${fmtChance(g.chance)}</td></tr>`);
  const items = b.entries.filter((e) => !e.equip);
  return `<div class="box-list">
    ${items.length ? table('<th>Item</th><th class="num">Amount</th><th class="num">Chance</th>', items.map((e) =>
      `<tr><td>${esc(e.name)}${boxToggle(e)}</td><td class="num">${amt(e)}</td><td class="num">${fmtChance(e.chance)}</td></tr>`)) : ''}
    ${gearList.length ? `<div class="box-sub">Equipment <span class="box-note">${[...corps].map(corpName).map(esc).join(', ')}</span>
      ${corps.size > 1 ? `<button class="box-split ${boxView.split ? 'active' : ''}">By manufacturer</button>` : ''}</div>
      ${table(`<th>Gear</th><th>Class</th>${gearAmt ? '<th class="num">Amount</th>' : ''}<th class="num">Chance</th>`, gearRows)}` : ''}
  </div>`;
}

document.addEventListener('toggle', async (e) => {
  const d = e.target;
  if (!d.matches?.('details.box') || !d.open || d.dataset.loaded) return;
  d.dataset.loaded = '1';
  const id = Number(d.dataset.box);
  if (!boxView.cache.has(id)) {
    const res = await apiFetch(`/api/box?id=${id}`);
    boxView.cache.set(id, res.ok ? await res.json() : null);
  }
  const b = boxView.cache.get(id);
  d.insertAdjacentHTML('beforeend', `<div class="box-body">${b ? boxHtml(b) : '<p class="key">Contents unavailable.</p>'}</div>`);
}, true);

document.addEventListener('click', (e) => {
  if (!e.target.closest('.box-split')) return;
  boxView.split = !boxView.split;
  store.set('boxSplit', boxView.split);
  document.querySelectorAll('details.box[data-loaded] > .box-body').forEach((body) => {
    const b = boxView.cache.get(Number(body.parentElement.dataset.box));
    if (b) body.innerHTML = boxHtml(b);
  });
});

const state = {
  catalogue: [],
  cat: store.get('cat', 'main'),
  filter: '',
  scene: null,
  mode: store.get('mode', 'flow'),          // 'flow' follows choices/jumps, 'all' shows raw order
  showKeys: store.get('showKeys', false),
  showDirections: store.get('showDirections', false),
  showBackgrounds: store.get('showBackgrounds', true),
  showIcons: store.get('showIcons', true),
  gameView: store.get('gameView', false), // one line at a time over the background, like the game
  step: 0,
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
    else if (section === 'monsters') { Monsters.renderTree(); Monsters.route(); }
    else if (section === 'jukebox') { Jukebox.renderTree(); Jukebox.rerender(); }
    else renderTree();
  });
  // Phones: the sidebar folds into a "Browse" bar; picking something folds it again.
  $('#browse-toggle').onclick = () => setBrowse(!$('.sidebar').classList.contains('open'));
  $('#tree').addEventListener('click', (e) => { if (e.target.closest('a')) setBrowse(false); });
  window.addEventListener('hashchange', dispatch);
  dispatch();
}

// Top-level sections share the sidebar (#cat-tabs, #filter, #tree) and #reader.
let section = null;

function setBrowse(open) {
  $('.sidebar').classList.toggle('open', open);
  $('#browse-toggle').setAttribute('aria-expanded', String(open));
}

function enterSection(name) {
  if (section === name) return false;
  section = name;
  document.querySelectorAll('.nav-item[data-section]').forEach((a) => a.classList.toggle('active', a.dataset.section === name));
  $('#browse-toggle').firstChild.textContent = `Browse ${SECTIONS.find((s) => s.id === name)?.title || ''} `;
  state.filter = '';
  $('#filter').value = '';
  $('#filter').placeholder = {
    stages: 'Filter chapters, stages or floors…',
    jukebox: 'Filter albums, tracks or artists…',
    raids: 'Filter seasons or bosses…',
    characters: 'Filter name, class, weapon, element…',
    minigames: 'Filter songs, artists or albums…',
    monsters: 'Filter name, code, element, grade…',
  }[name] || 'Filter groups or scenes…';
  return true;
}

// The home page: one card per section (the only way to switch sections on a phone besides
// the scrolling top menu).
const SECTIONS = [
  { id: 'stories', href: '#/stories', title: 'Stories', text: 'Main story, events, side stories, bond episodes and counseling, with a game-style view.' },
  { id: 'stages', href: '#/stages', title: 'Stages', text: 'Campaign chapters and towers: enemies, waves, rewards.' },
  { id: 'raids', href: '#/raids', title: 'Raids', text: 'Union Raid, Solo Raid, Interception and Museum bosses.' },
  { id: 'monsters', href: '#/monsters', title: 'Monsters', text: 'Every Rapture: art, element, grade and where it appears.' },
  { id: 'characters', href: '#/characters', title: 'Characters', text: 'Nikke profiles, costumes and the CP calculator.' },
  { id: 'minigames', href: '#/minigame/tts', title: 'Minigames', text: 'Tracing the Stars, VOLT TRIP, Fading Affection and every event minigame.' },
  { id: 'progression', href: '#/progression/outpost', title: 'Progression', text: 'Outpost, simulation room and level costs.' },
  { id: 'jukebox', href: '#/jukebox', title: 'Jukebox', text: 'Albums and tracks, and the story scenes that play them.' },
];

function renderHome() {
  const stories = state.catalogue.reduce((n, c) => n + c.groups.reduce((s, g) => s + g.scenes.length, 0), 0);
  $('#reader').innerHTML = `<div class="home">
    <h1>Nikke Library</h1>
    <p class="home-sub">A datamine library of NIKKE: pick a section.</p>
    <div class="home-grid">${SECTIONS.map((s) => `<a class="home-card" href="${s.href}">
      <b>${esc(s.title)}</b>${s.id === 'stories' ? ` <span class="n">${stories.toLocaleString('en-US')} scenes</span>` : ''}
      <span>${esc(s.text)}</span></a>`).join('')}</div>
  </div>`;
}

async function dispatch() {
  document.body.classList.toggle('at-home', !location.hash || location.hash === '#/' || location.hash === '#');
  setBrowse(false);
  if (document.body.classList.contains('at-home')) {
    enterSection('home');
    return renderHome();
  }
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
  if (/^#\/monster/.test(location.hash)) {
    if (enterSection('monsters')) await Monsters.enter();
    return Monsters.route();
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
  state.step = 0;
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
  const { speakers, icons = {} } = state.scene;
  const type = (line.type || 'Speech').toLowerCase();
  const name = line.speaker ? speakers[line.speaker] ?? line.speaker : '';
  const color = type === 'speech' || type === 'monologue' ? `style="color:${speakerColor(line.speaker)}"` : '';
  const meta = state.showKeys
    ? `<div class="key"><span class="lid">${shortId(line.id)}</span>${esc(line.key || '')}${line.speaker ? ` · ${esc(line.speaker)}` : ''}</div>` : '';
  let out = directionsHtml(line);
  // Shown when the background changes (scripts often set the same one again).
  if (state.showBackgrounds && line.bgArt && line.bgArt !== state.lastBg) out += `<figure class="scene-bg">${gameImg('scenariobackground', line.bgArt, 'scene-bg-img')}<figcaption class="key">${esc(line.bg)}</figcaption></figure>`;
  if (line.bgArt) state.lastBg = line.bgArt;
  out += `<div class="line ${type}">
    <div class="who" ${color}>${state.showIcons && icons[line.speaker] ? gameImg('icons-char', icons[line.speaker], 'who-icon') : ''}${esc(name)}</div>
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
  const items = state.mode === 'flow' || state.gameView ? flowItems(s.lines) : rawItems(s.lines);
  const navBtn = (id, label) => `<a class="nav-btn" href="${id ? '#/scene/' + encodeURIComponent(id) : '#'}" aria-disabled="${!id}">${label}</a>`;
  const shown = items.reduce((n, it) => n + (it.choice ? 1 : 1), 0);
  state.lastBg = null;

  $('#reader').innerHTML = `
    <div class="scene-head">
      <div class="crumb">${esc(state.catalogue.find((c) => c.id === s.cat).label)} · ${esc(s.group.label)}${s.stage ? ` · ${esc(s.stage)}` : ''}</div>
      <div class="scene-title">${esc(s.label)}</div>
      <div class="toolbar">
        <label class="toggle"><input type="checkbox" id="t-game" ${state.gameView ? 'checked' : ''}> Game view</label>
        <div class="seg" id="mode" ${state.gameView ? 'hidden' : ''}>
          <button data-mode="flow" class="${state.mode === 'flow' ? 'active' : ''}" title="Follow choices and jumps like the game">Play flow</button>
          <button data-mode="all" class="${state.mode === 'all' ? 'active' : ''}" title="Every line in file order, all branches">All lines</button>
        </div>
        <label class="toggle"><input type="checkbox" id="t-keys" ${state.showKeys ? 'checked' : ''}> Keys</label>
        <label class="toggle"><input type="checkbox" id="t-dir" ${state.showDirections ? 'checked' : ''}> Stage directions</label>
        <label class="toggle"><input type="checkbox" id="t-bg" ${state.showBackgrounds ? 'checked' : ''}> Backgrounds</label>
        <label class="toggle"><input type="checkbox" id="t-icons" ${state.showIcons ? 'checked' : ''}> Icons</label>
        <span class="key">${esc(s.id)} · ${shown}/${s.lines.length} lines</span>
        <span class="spacer"></span>
        ${navBtn(s.prev, '← Prev')}${navBtn(s.next, 'Next →')}
      </div>
    </div>
    ${state.gameView ? '<div id="game"></div>' : `<div class="script">
      ${items.map((it) => (it.choice ? choiceHtml(it) : lineHtml(it.line, it.raw))).join('')}
      <div class="end-mark">— END —</div>
      <div class="end-nav">${navBtn(s.prev, '← Previous scene')}${navBtn(s.next, 'Next scene →')}</div>
    </div>`}`;
  if (state.gameView) renderGame(items);

  $('#mode').querySelectorAll('button').forEach((b) => b.onclick = () => { state.mode = b.dataset.mode; store.set('mode', state.mode); renderScene(); });
  $('#t-keys').onchange = (e) => { state.showKeys = e.target.checked; store.set('showKeys', state.showKeys); renderScene(); };
  $('#t-dir').onchange = (e) => { state.showDirections = e.target.checked; store.set('showDirections', state.showDirections); renderScene(); };
  $('#t-bg').onchange = (e) => { state.showBackgrounds = e.target.checked; store.set('showBackgrounds', state.showBackgrounds); renderScene(); };
  $('#t-icons').onchange = (e) => { state.showIcons = e.target.checked; store.set('showIcons', state.showIcons); renderScene(); };
  $('#t-game').onchange = (e) => { state.gameView = e.target.checked; store.set('gameView', state.gameView); renderScene(); };
  $('#reader').querySelectorAll('.script .option').forEach((b) => b.onclick = () => {
    if (state.mode !== 'flow') return;
    state.choices[b.dataset.block] = Number(b.dataset.i);
    const y = $('#reader').scrollTop;
    renderScene();
    $('#reader').scrollTop = y;
  });
}

// Game view: the play flow one line at a time, in a dialogue box over the scene's
// current background (the last one set up to this line), with the speaker's icon.
function renderGame(items = flowItems(state.scene.lines)) {
  const s = state.scene;
  state.step = Math.max(0, Math.min(state.step, items.length));
  const end = state.step >= items.length;
  const item = items[state.step];
  let bg = null;
  for (let i = 0; i <= Math.min(state.step, items.length - 1); i++) if (items[i].line?.bgArt) bg = items[i].line.bgArt;
  let box = '';
  if (end) {
    box = `<div class="game-box game-end"><div class="game-text">— END —</div>
      <div class="game-end-nav">${s.next ? `<a class="nav-btn" href="#/scene/${encodeURIComponent(s.next)}">Next scene →</a>` : ''}</div></div>`;
  } else if (item.choice) {
    box = `<div class="game-choices">${item.choice.map((opt, i) => `<button class="option game-opt" data-i="${i}">${textHtml(opt)}</button>`).join('')}</div>`;
  } else {
    const line = item.line;
    const type = (line.type || 'Speech').toLowerCase();
    const name = line.speaker ? s.speakers[line.speaker] ?? line.speaker : '';
    const icon = state.showIcons && (s.icons || {})[line.speaker];
    const narration = type === 'narration' || !name;
    box = `<div class="game-box ${type}">
      ${narration ? '' : `<div class="game-name" style="color:${speakerColor(line.speaker)}">${icon ? gameImg('icons-char', icon, 'game-icon') : ''}<span>${esc(name)}${type === 'monologue' ? ' <i>(thought)</i>' : ''}</span></div>`}
      <div class="game-text">${textHtml(line)}</div>
      ${state.showKeys ? `<div class="key">${esc(line.key || '')}</div>` : ''}
      ${line.enter ? `<div class="jump-note">↳ enters scenario <a href="#/scene/${encodeURIComponent(line.enter)}">${esc(line.enter)}</a></div>` : ''}
    </div>`;
  }
  $('#game').innerHTML = `<div class="game-stage ${state.showBackgrounds && bg ? '' : 'no-bg'}">
      ${state.showBackgrounds && bg ? gameImg('scenariobackground', bg, 'game-bg-fill') + gameImg('scenariobackground', bg, 'game-bg') : ''}
      ${box}
    </div>
    <div class="game-controls">
      <button class="nav-btn" id="g-back" ${state.step ? '' : 'disabled'}>← Back</button>
      <span class="key">${Math.min(state.step + 1, items.length)} / ${items.length}</span>
      <button class="nav-btn" id="g-next" ${end ? 'disabled' : ''}>Next →</button>
    </div>
    <p class="key game-hint">Click the scene or press Space / Enter for the next line, Backspace to go back.</p>`;
  $('#g-back').onclick = () => gameStep(-1);
  $('#g-next').onclick = () => gameStep(1);
  $('#game .game-stage').onclick = (e) => { if (!e.target.closest('a, button')) gameStep(1); };
  $('#game').querySelectorAll('.game-opt').forEach((b) => b.onclick = () => {
    state.choices[item.blockId] = Number(b.dataset.i);
    state.step += 1;
    renderGame();
  });
}

function gameStep(d) {
  const items = flowItems(state.scene.lines);
  if (d > 0 && items[state.step]?.choice) return; // pick an option to go on
  state.step = Math.max(0, Math.min(items.length, state.step + d));
  renderGame(items);
}

document.addEventListener('keydown', (e) => {
  if (section !== 'stories' || !state.scene || e.target.matches('input')) return;
  if (state.gameView && $('#game')) {
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown') { e.preventDefault(); gameStep(1); return; }
    if (e.key === 'Backspace' || e.key === 'ArrowUp') { e.preventDefault(); gameStep(-1); return; }
  }
  if (e.key === 'ArrowRight' && state.scene.next) location.hash = '#/scene/' + encodeURIComponent(state.scene.next);
  if (e.key === 'ArrowLeft' && state.scene.prev) location.hash = '#/scene/' + encodeURIComponent(state.scene.prev);
});

document.addEventListener('DOMContentLoaded', init);
