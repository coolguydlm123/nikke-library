// Nikke Library — My Nikkes: import your own account (a Blablalink Shiftypad export, made by
// tools/shiftypad-export.js on your own page) and manage it. The data stays in this browser
// (localStorage key nl.account); nothing is sent anywhere and nothing is logged.
const MyNikkes = (() => {
  const KEY = 'account';
  const CORPS = { 1: 'Elysion', 2: 'Missilis', 3: 'Tetra', 4: 'Pilgrim', 7: 'Abnormal' }; // corporation_type; matches the exported per-manufacturer counts
  const SLOTS = [['head', 'Head'], ['torso', 'Body'], ['arm', 'Arm'], ['leg', 'Leg']];
  const MAX = { skill: 10, core: 7, grade: 3, bond: 40 }; // highest values seen; core and bond maxima are inferred
  const SHORT = { IncElementDmg: 'Elem Dmg', StatAccuracyCircle: 'Hit Rate', StatAmmoLoad: 'Max Ammo', StatAtk: 'ATK', StatChargeDamage: 'Charge Dmg',
    StatChargeTime: 'Charge Spd', StatCritical: 'Crit Rate', StatCriticalDamage: 'Crit Dmg', StatDef: 'DEF' };
  const TODO = ['Skill below 10', 'Core below 7', 'Limit break not max', 'Gear without overload', 'Bond not max'];
  // The overload effect types (functionType -> short label); the first 8 are the "main" ones.
  const FX = [['StatAtk', 'ATK'], ['IncElementDmg', 'Elem Dmg'], ['StatAmmoLoad', 'Max Ammo'], ['StatChargeTime', 'Charge Spd'],
    ['StatCritical', 'Crit Rate'], ['StatCriticalDamage', 'Crit Dmg'], ['StatAccuracyCircle', 'Hit Rate'], ['StatDef', 'DEF'], ['StatChargeDamage', 'Charge Dmg']];
  const m = {
    acct: store.get(KEY, null), lookup: null, text: '', msg: null, showImport: false, script: null,
    st: { sel: store.get('mineFilters', {}), open: {}, key: 'mineFilters' },
    sort: store.get('mineSort', 'id'),
    pins: new Set(store.get('minePins', [])), // name_codes pinned to the top; a separate key, so they survive Update and Clear data
    openEffect: null,
    fx: new Set(store.get('mineFx', FX.map(([t]) => t))), // overload stats shown everywhere
    fxOnly: store.get('mineFxOnly', false), // only Nikkes with a line of the picked stats
    tab: store.get('mineTab', 'list'), // list | overview | totals
    ov: store.get('mineOv', { key: 'id', dir: 1 }), // overview sort
  };
  const savePins = () => store.set('minePins', [...m.pins]);
  const togglePin = (code) => { if (m.pins.has(code)) m.pins.delete(code); else m.pins.add(code); savePins(); };
  // Exports made before the script fix have every level at 1 (the detail record's lv overwrote the real one).
  const oldExport = (a) => {
    const hi = (a?.characters || []).filter((o) => o.combat > 50000);
    return hi.length >= 3 && hi.filter((o) => o.lv === 1).length > hi.length / 2;
  };
  const kit = () => Characters.kit;
  const byCode = () => new Map((m.acct?.characters || []).map((o) => [o.name_code, o]));
  const has = (code) => !!m.acct?.characters?.some((o) => o.name_code === code);

  async function ensure() {
    if (!m.lookup) m.lookup = await (await apiFetch('/api/account-lookup')).json();
  }

  // ---------- reading the export ----------
  function parse(text) {
    let j;
    try { j = JSON.parse(text.trim()); } catch { return { error: "That isn't valid JSON. Paste the whole text the script copied." }; }
    if (!j || j.v !== 1) return { error: 'Unsupported export (expected version 1). Copy the current script and run it again.' };
    if (!Array.isArray(j.characters) || !j.characters.length) return { error: 'The file has no Nikkes in it.' };
    if (!j.characters.every((o) => o && Number.isFinite(o.name_code))) return { error: 'Some Nikke rows have no name_code; the file looks damaged.' };
    return { acct: j };
  }

  function save(acct) {
    try { localStorage.setItem(`nl.${KEY}`, JSON.stringify(acct)); } catch { return false; }
    m.acct = acct;
    return true;
  }

  // The overload lines of one gear piece, resolved to { name, level, value }.
  const linesOf = (o, slot) => [1, 2, 3].map((n) => o[`${slot}_equip_option${n}_id`]).filter(Boolean)
    .map((id) => m.lookup.options[id] || { unknown: id });
  const lineText = (l) => (l.unknown ? `#${l.unknown}` : `${SHORT[l.type] || l.name.replace(/^Increased /, '')} ${l.level} (${l.value}%)`);

  const fxAll = () => FX.every(([t]) => m.fx.has(t));
  const fxOn = (l) => (l.unknown ? fxAll() : m.fx.has(l.type)); // an unresolved line counts only while everything is picked
  const pickedOf = (o) => {
    let sum = 0, n = 0;
    for (const [s] of SLOTS) for (const l of linesOf(o, s)) if (fxOn(l)) { sum += l.value || 0; n++; }
    return { sum, n };
  };
  const saveFx = () => store.set('mineFx', [...m.fx]);

  function todoOf(o) {
    if (!o) return [];
    const t = [];
    if ([o.skill1_lv, o.skill2_lv, o.ulti_skill_lv].some((v) => v < MAX.skill)) t.push(TODO[0]);
    if (o.core < MAX.core) t.push(TODO[1]);
    if (o.grade < MAX.grade) t.push(TODO[2]);
    if (SLOTS.some(([s]) => o[`${s}_equip_tier`] >= 10 && !linesOf(o, s).length)) t.push(TODO[3]);
    if (o.attractive_lv < MAX.bond) t.push(TODO[4]);
    return t;
  }

  function rows() {
    const mine = byCode();
    return kit().list.map((x, idx) => { const o = mine.get(x.code) || null; return { ...x, idx, owned: o, todo: todoOf(o) }; });
  }

  function groups() {
    return [...kit().FILTERS,
      { key: 'own', label: 'Account', values: () => ['Owned', 'Not owned'], of: (x) => [x.owned ? 'Owned' : 'Not owned'] },
      { key: 'todo', label: 'To do', values: () => TODO, of: (x) => x.todo }];
  }

  // ---------- import card ----------
  function importCard() {
    return `<section class="card import-card"><h3>Import your account</h3>
      <p class="key">Recommended: a Tampermonkey userscript adds an export button to your Shiftypad page (no DevTools needed).</p>
      <ol class="steps">
        <li>Install <a href="https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo" target="_blank" rel="noopener">Tampermonkey</a> (a browser extension; skip if you have it).</li>
        <li>Open the <a href="account/shiftypad-export.user.js">userscript install link</a>; Tampermonkey shows an install page, click Install.</li>
        <li>Open <b>your own</b> Shiftypad page on blablalink.com while logged in (the address contains <code>?uid=…</code>) and click <b>Export to Nikke Library</b>.</li>
        <li>Wait about 20 seconds (it reads your Nikkes slowly on purpose; Shiftypad limits fast requests). The result is copied and saved as <code>nikke-account.json</code>.</li>
        <li>Paste it here, or drop the file.</li>
      </ol>
      <details class="mn-fallback"><summary>No Tampermonkey? Use the console script instead</summary>
        <ol class="steps">
          <li>Open your own Shiftypad page while logged in.</li>
          <li>Press F12, open the Console tab, paste the script, press Enter. <button class="nav-btn" id="mn-copy">Copy script</button> <span class="key" id="mn-copied"></span></li>
          <li>Wait about 20 seconds, then paste the result here or drop the saved file.</li>
        </ol>
        <p class="key note">Shiftypad may detect DevTools and reload the page when execution pauses; if that happens, use the userscript.</p>
      </details>
      <textarea id="mn-text" class="mn-text" rows="4" placeholder="Paste the exported JSON here" spellcheck="false">${esc(m.text)}</textarea>
      <div class="mn-drop" id="mn-drop">…or drop nikke-account.json here, or <label class="link-btn">choose a file<input type="file" id="mn-file" accept=".json,application/json" hidden></label></div>
      <div class="sim-actions"><button class="nav-btn" id="mn-import">Import</button>${m.acct ? '<button class="nav-btn" id="mn-cancel">Cancel</button>' : ''}</div>
      ${m.msg ? `<p class="${m.msg.ok ? 'key' : 'error'} mn-msg">${esc(m.msg.text)}</p>` : ''}
      <div class="mn-privacy"><b>Privacy</b><ul>
        <li>Everything runs in <b>your own browser</b> with <b>your own Blablalink login</b>. The export script is plain text you can read first (the Copy script button below shows what it does).</li>
        <li>The data is stored <b>only in this browser</b> (localStorage). Nothing is sent to this site or anyone else, and nothing is logged. <b>Clear data</b> erases it.</li>
        <li>The export holds game progress only: no name, UID or login.</li>
        <li>The script reads through the <b>same calls the Shiftypad page makes</b> (read-only, slowly), so it may stop working if Blablalink changes them.</li>
      </ul></div>
    </section>`;
  }

  function bindImport() {
    const text = $('#mn-text');
    if (!text) return;
    text.oninput = () => { m.text = text.value; };
    const run = (t) => {
      const r = parse(t);
      if (r.error) { m.msg = { ok: false, text: r.error }; return render(); }
      if (!save(r.acct)) { m.msg = { ok: false, text: 'Your browser refused to store the data (about 200 KB). Free some site data and try again.' }; return render(); }
      m.text = ''; m.showImport = false;
      m.msg = { ok: true, text: `Imported ${r.acct.characters.length} Nikkes.${oldExport(r.acct) ? ' This file came from an older export script: levels are wrong. Update the userscript and export again.' : ''}` };
      render();
    };
    $('#mn-import').onclick = () => run(text.value);
    $('#mn-cancel')?.addEventListener('click', () => { m.showImport = false; m.msg = null; render(); });
    const read = (file) => { const fr = new FileReader(); fr.onload = () => run(String(fr.result)); fr.onerror = () => { m.msg = { ok: false, text: 'Could not read that file.' }; render(); }; fr.readAsText(file); };
    $('#mn-file').onchange = (e) => e.target.files[0] && read(e.target.files[0]);
    const drop = $('#mn-drop');
    drop.ondragover = (e) => { e.preventDefault(); drop.classList.add('over'); };
    drop.ondragleave = () => drop.classList.remove('over');
    drop.ondrop = (e) => { e.preventDefault(); drop.classList.remove('over'); if (e.dataTransfer.files[0]) read(e.dataTransfer.files[0]); };
    $('#mn-copy').onclick = async () => {
      const out = $('#mn-copied');
      try {
        if (!m.script) m.script = (await (await apiFetch('/api/shiftypad-script')).json()).script;
        await navigator.clipboard.writeText(m.script);
        out.textContent = 'Copied.';
      } catch { out.textContent = 'Could not copy; open it from the repository (tools/account/shiftypad-export.js).'; }
    };
  }

  // ---------- the page ----------
  const fmtDate = (sec) => (sec ? new Date(Number(sec) * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
  const costumeName = (o) => (o.costume_tid ? m.lookup.costumes[o.costume_tid]?.name || `#${o.costume_tid}` : 'Default');
  // Cube and item with their icon and level (the icon is skipped when the art isn't there).
  const withIcon = (family, entry, id, lv, fallback = '') => {
    const e = typeof entry === 'string' ? { name: entry } : entry;
    return id ? `<span class="mn-ico-wrap">${e?.icon ? gameImg(family, e.icon, 'mn-ico') : ''}<span>${esc(`${(e?.name || `#${id}`).replace(fallback, '')} ${lv}`)}</span></span>` : '—';
  };
  const cubeCell = (o) => withIcon('icons-equip', m.lookup.cubes[o.harmony_cube_tid], o.harmony_cube_tid, o.harmony_cube_lv, / Cube$/);
  const itemCell = (o) => withIcon('icons-favoriteitem', m.lookup.favorites[o.favorite_item_tid], o.favorite_item_tid, o.favorite_item_lv);
  const pinBtn = (code) => `<button class="mn-pin ${m.pins.has(code) ? 'on' : ''}" data-pin="${code}" aria-pressed="${m.pins.has(code)}" title="${m.pins.has(code) ? 'Unpin' : 'Pin to the top'}">${m.pins.has(code) ? '★' : '☆'}</button>`;

  function gearSummary(o) {
    const parts = SLOTS.map(([s]) => ({ tier: o[`${s}_equip_tier`], lv: o[`${s}_equip_lv`], lines: linesOf(o, s) }));
    const tiers = [...new Set(parts.map((p) => p.tier))].sort();
    const lvs = parts.map((p) => p.lv);
    const n = parts.reduce((sum, p) => sum + p.lines.length, 0);
    return `T${tiers.join('/')} +${Math.min(...lvs)}${Math.max(...lvs) !== Math.min(...lvs) ? `–${Math.max(...lvs)}` : ''} · ${n} line${n === 1 ? '' : 's'}`;
  }

  function gearDetail(o) {
    return SLOTS.map(([s, label]) => {
      const l = linesOf(o, s);
      return `<div><b>${label}</b> T${o[`${s}_equip_tier`]} +${o[`${s}_equip_lv`]} <span class="key">${esc(CORPS[o[`${s}_equip_corporation_type`]] || '')}</span>${l.length ? `: ${l.map((x) => (fxOn(x) ? esc(lineText(x)) : `<span class="mn-off">${esc(lineText(x))}</span>`)).join(', ')}` : ' <span class="key">no overload lines</span>'}</div>`;
    }).join('');
  }

  const SORTS = { id: ['Character id (c-number)', null], lv: ['Level', (a, b) => b.owned.lv - a.owned.lv], cp: ['CP', (a, b) => b.owned.combat - a.owned.combat] };

  function summaryCards(all) {
    const p = m.acct.profile || {};
    const mine = all.filter((x) => x.owned);
    const corps = kit().CORP_ORDER.map((c) => ({ c, have: mine.filter((x) => x.corporation === c).length, of: all.filter((x) => x.corporation === c).length }));
    const costumes = p.character_costume_count;
    return `<div class="mn-summary">
      <section class="card"><h3>Account</h3><dl class="facts">
        <dt>Level</dt><dd>${fmtNum(p.lv)}</dd>
        <dt>Nikkes</dt><dd>${mine.length} of ${all.length} <span class="key">${p.character_count != null ? `(account says ${p.character_count})` : ''}</span></dd>
        <dt>Costumes</dt><dd>${fmtNum(costumes)}</dd>
        <dt>Synchro device</dt><dd>level ${fmtNum(p.synchro_level)}, ${fmtNum(p.synchro_nonempty_slot_count)} slots filled</dd>
        <dt>Outpost battle</dt><dd>level ${fmtNum(p.outpost_battle_level)}</dd>
        <dt>Infrastructure core</dt><dd>level ${fmtNum(p.infra_core_level)}</dd>
        <dt>Team power</dt><dd>${fmtNum(p.team_combat)}</dd>
        <dt>Created</dt><dd>${fmtDate(p.created_at)}</dd>
      </dl></section>
      <section class="card"><h3>Progress</h3><dl class="facts">
        ${[['Normal campaign', 'progress_normal_campaign'], ['Hard campaign', 'progress_hard_campaign'], ['Easy campaign', 'progress_easy_campaign']].map(([k, f]) => `<dt>${k}</dt><dd>${p[f] != null ? `stage id ${p[f]}` : '—'}</dd>`).join('')}
        ${[['Tribe tower', 'progress_tribe_tower'], ['Elysion tower', 'progress_elysion_tower'], ['Missilis tower', 'progress_missilis_tower'], ['Tetra tower', 'progress_tetra_tower'], ['Pilgrim tower', 'progress_pilgrim_tower']].map(([k, f]) => `<dt>${k}</dt><dd>${fmtNum(p[f])}</dd>`).join('')}
      </dl></section>
      <section class="card"><h3>By manufacturer</h3><div class="table-scroll"><table class="roster keep-cols"><thead><tr><th>Manufacturer</th><th class="num">Owned</th><th class="num">Total</th></tr></thead>
        <tbody>${corps.map((r) => `<tr><td>${esc(r.c)}</td><td class="num">${r.have}</td><td class="num">${r.of}</td></tr>`).join('')}</tbody></table></div></section>
    </div>`;
  }

  function row(x) {
    const o = x.owned;
    const name = `<span class="mn-first">${pinBtn(x.code)}<a class="mn-name" href="${kit().href(x.code)}">${gameImg('icons-char', x.icon, 'char-icon')}<span>${esc(x.name)}</span></a></span>`;
    if (!o) return `<tr class="mn-missing"><td>${name}</td><td colspan="10" class="key">not owned</td></tr>`;
    return `<tr><td>${name}${x.todo.length ? `<div class="mn-todo">${x.todo.map((t) => `<span class="badge">${esc(t)}</span>`).join('')}</div>` : ''}</td>
      <td class="num">${fmtNum(o.lv)}</td><td class="num">${o.core}/${MAX.core}</td><td class="num">${'★'.repeat(o.grade) || '—'}</td>
      <td class="num">${o.skill1_lv}/${o.skill2_lv}/${o.ulti_skill_lv}</td><td class="num">${o.attractive_lv}</td>
      <td>${esc(costumeName(o))}</td>
      <td><details class="mn-gear"><summary>${esc(gearSummary(o))}</summary>${gearDetail(o)}</details></td>
      <td>${cubeCell(o)}</td><td>${itemCell(o)}</td><td class="num">${fmtNum(o.combat)}</td></tr>`;
  }

  function table(list) {
    const pinned = list.filter((x) => m.pins.has(x.code));
    const rest = pinned.length ? list.filter((x) => !m.pins.has(x.code)) : list;
    const sep = (label) => `<tr class="mn-sep"><td colspan="11">${label}</td></tr>`;
    const body = (pinned.length ? sep(`Pinned (${pinned.length})`) + pinned.map(row).join('') + (rest.length ? sep('Others') : '') : '') + rest.map(row).join('');
    return `<div class="table-scroll"><table class="roster sticky-first keep-cols mn-table"><thead><tr><th>Nikke</th><th class="num">Lv</th><th class="num">Core</th><th class="num">LB</th>
      <th class="num" title="Skill 1 / Skill 2 / Burst">Skills</th><th class="num">Bond</th><th>Costume</th><th>Gear</th><th>Cube</th><th>Item</th><th class="num">CP</th></tr></thead><tbody>${body}</tbody></table></div>`;
  }

  // ---------- overview ----------
  // One compact row per owned Nikke: skills, cube, item and its 12 overload lines summed by effect.
  const MAIN = new Set(FX.map(([t]) => t));
  function sumsOf(o) {
    const by = {}, other = { sum: 0, n: 0, names: [] };
    let lines = 0;
    for (const [slot] of SLOTS) {
      for (const l of linesOf(o, slot)) {
        lines++;
        const cell = !l.unknown && MAIN.has(l.type) ? (by[l.type] ||= { sum: 0, n: 0, names: [] }) : other;
        cell.sum += l.value || 0; cell.n++; cell.names.push(lineText(l));
      }
    }
    return { by, other, lines };
  }
  const OV_COLS = () => [
    { key: 'id', label: 'Nikke', get: (x) => x.idx, asc: true },
    { key: 'skills', label: 'Skills', title: 'Skill 1 / Skill 2 / Burst (sorted by their total)', get: (x) => x.owned.skill1_lv + x.owned.skill2_lv + x.owned.ulti_skill_lv },
    { key: 'cube', label: 'Cube', title: 'Harmony cube (sorted by level)', get: (x) => x.owned.harmony_cube_lv },
    { key: 'item', label: 'Item', title: 'Favorite / collection item (sorted by level)', get: (x) => x.owned.favorite_item_lv },
    ...FX.filter(([t]) => m.fx.has(t)).map(([t, label]) => ({ key: t, label, eff: true, get: (x) => x.sums.by[t]?.sum || 0 })),
    ...(fxAll()
      ? [{ key: 'other', label: 'More', title: 'Any effect not listed', eff: true, get: (x) => x.sums.other.sum }]
      : [{ key: 'picked', label: 'Picked', title: 'Sum of the picked stats (sort by it)', get: (x) => x.picked.sum }]),
    { key: 'lines', label: 'Lines', title: 'Overload lines filled, of 12', get: (x) => x.sums.lines },
  ];

  function overview(list) {
    const cols = OV_COLS();
    const mine = list.filter((x) => x.owned).map((x) => ({ ...x, sums: sumsOf(x.owned), picked: pickedOf(x.owned) }));
    const col = cols.find((c) => c.key === m.ov.key) || cols[0];
    const dir = m.ov.dir;
    const sorted = mine.slice().sort((a, b) => dir * (col.get(a) - col.get(b)) || a.idx - b.idx);
    const pinned = sorted.filter((x) => m.pins.has(x.code));
    const rest = pinned.length ? sorted.filter((x) => !m.pins.has(x.code)) : sorted;
    // The best value in each numeric column among the rows shown.
    const best = {};
    cols.slice(1).forEach((c) => { const top = Math.max(0, ...mine.map(c.get)); if (top > 0) best[c.key] = top; });
    const is = (c, x) => (best[c.key] != null && c.get(x) === best[c.key] ? ' best' : '');
    const cell = (c, x) => {
      const o = x.owned;
      if (c.key === 'id') return `<td><span class="mn-first">${pinBtn(x.code)}<a class="mn-name" href="${kit().href(x.code)}">${gameImg('icons-char', x.icon, 'char-icon')}<span>${esc(x.name)}</span></a></span></td>`;
      if (c.key === 'skills') return `<td class="num${is(c, x)}">${o.skill1_lv}/${o.skill2_lv}/${o.ulti_skill_lv}</td>`;
      if (c.key === 'cube') return `<td class="${is(c, x).trim()}">${cubeCell(o)}</td>`;
      if (c.key === 'item') {
        const f = m.lookup.favorites[o.favorite_item_tid];
        return `<td class="${is(c, x).trim()}" title="${esc(f?.name || '')}">${o.favorite_item_tid ? `<span class="mn-ico-wrap">${f?.icon ? gameImg('icons-favoriteitem', f.icon, 'mn-ico') : ''}<span>Lv ${o.favorite_item_lv}</span></span>` : '—'}</td>`;
      }
      if (c.key === 'picked') return x.picked.n ? `<td class="num${is(c, x)}">${+x.picked.sum.toFixed(1)}% <small>(${x.picked.n})</small></td>` : '<td class="num dim">·</td>';
      if (c.key === 'lines') return `<td class="num${is(c, x)}">${x.sums.lines}/12</td>`;
      const e = c.key === 'other' ? x.sums.other : x.sums.by[c.key];
      return e?.n ? `<td class="num${is(c, x)}" title="${esc(e.names.join(', '))}">${+e.sum.toFixed(1)}% <small>(${e.n})</small></td>` : '<td class="num dim">·</td>';
    };
    const sep = (label) => `<tr class="mn-sep"><td colspan="${cols.length}">${label}</td></tr>`;
    const body = (pinned.length ? sep(`Pinned (${pinned.length})`) + pinned.map((x) => `<tr>${cols.map((c) => cell(c, x)).join('')}</tr>`).join('') + (rest.length ? sep('Others') : '') : '')
      + rest.map((x) => `<tr>${cols.map((c) => cell(c, x)).join('')}</tr>`).join('');
    const head = cols.map((c) => `<th class="mn-sort${c.key === col.key ? ' on' : ''}${c.key === 'id' || c.key === 'cube' || c.key === 'item' ? '' : ' num'}" data-ov="${c.key}" ${c.title ? `title="${esc(c.title)}"` : ''}>${esc(c.label)}${c.key === col.key ? (dir > 0 ? ' ▲' : ' ▼') : ''}</th>`).join('');
    return `<div class="table-scroll"><table class="roster sticky-first keep-cols mn-ov"><thead><tr>${head}</tr></thead><tbody>${body || `<tr><td colspan="${cols.length}" class="key">No owned Nikke matches these filters.</td></tr>`}</tbody></table></div>
      <p class="key note">Each effect cell is the sum of that effect's overload lines over the Nikke's 12 lines (head, body, arm, leg × 3), as a percent, with the line count in brackets; hover for the lines. The best value in each column is highlighted. Click a header to sort; pinned Nikkes stay on top. "More" holds Charge Dmg and anything else rarer.</p>`;
  }

  // ---------- overload gear totals ----------
  // Every overload line on every owned gear piece, by effect (type), slot and manufacturer.
  function totals(all) {
    const eff = new Map();
    let pieces = 0, lines = 0;
    for (const x of all) {
      const o = x.owned;
      if (!o) continue;
      for (const [slot] of SLOTS) {
        pieces++;
        for (const l of linesOf(o, slot)) {
          if (!fxOn(l)) continue;
          const key = l.unknown ? 'unknown' : l.type;
          if (!eff.has(key)) eff.set(key, { key, name: l.unknown ? 'Unknown effect' : (SHORT[l.type] || l.name.replace(/^Increased /, '')), n: 0, sum: 0, lv: 0, best: 0, dist: Array(16).fill(0), who: [], slots: {}, corps: {} });
          const e = eff.get(key);
          lines++; e.n++; e.sum += l.value || 0; e.lv += l.level || 0; e.best = Math.max(e.best, l.level || 0);
          if (l.level) e.dist[l.level]++;
          e.who.push({ x, lv: l.level || 0, slot });
          e.slots[slot] = (e.slots[slot] || 0) + 1;
          e.corps[x.corporation] = (e.corps[x.corporation] || 0) + 1;
        }
      }
    }
    const list = [...eff.values()].sort((a, b) => b.n - a.n);
    if (!list.length) return '<section class="card"><h3>Overload gear totals</h3><p class="key">No overload lines of the picked stats.</p></section>';
    const nikkes = (e) => new Set(e.who.map((w) => w.x.code)).size;
    const lvCols = Array.from({ length: 15 }, (_, i) => i + 1);
    const open = list.find((e) => e.key === m.openEffect);
    const rowsA = list.map((e) => `<tr class="mn-eff ${e.key === m.openEffect ? 'open' : ''}" data-eff="${esc(e.key)}"><td><b>${esc(e.name)}</b></td><td class="num">${e.n}</td><td class="num">${nikkes(e)}</td>
      <td class="num">${(e.lv / e.n).toFixed(1)}</td><td class="num">${e.best || '—'}</td><td class="num">${fmtNum(+e.sum.toFixed(1))}</td>${lvCols.map((l) => `<td class="num ${e.dist[l] ? '' : 'dim'}">${e.dist[l] || '·'}</td>`).join('')}</tr>
      ${e.key === m.openEffect ? `<tr class="mn-who"><td colspan="${6 + lvCols.length}">${e.who.slice().sort((a, b) => b.lv - a.lv).map((w) => `<a href="${kit().href(w.x.code)}">${esc(w.x.name)}</a> Lv ${w.lv} <span class="key">${esc(SLOTS.find(([s]) => s === w.slot)[1])}</span>`).join(' · ')}</td></tr>` : ''}`).join('');
    const colsB = SLOTS.map(([, label]) => `<th class="num">${label}</th>`).join('');
    const corps = kit().CORP_ORDER;
    return `<section class="card"><h3>Overload gear totals <span class="sub">${lines} lines on ${pieces} gear pieces</span></h3>
      <div class="subhead">By effect</div>
      <div class="table-scroll"><table class="roster sticky-first keep-cols mn-totals"><thead><tr><th>Effect</th><th class="num">Lines</th><th class="num">Nikkes</th><th class="num">Avg Lv</th><th class="num">Best</th><th class="num" title="Sum of the line values, in %">Total %</th>${lvCols.map((l) => `<th class="num">${l}</th>`).join('')}</tr></thead><tbody>${rowsA}</tbody></table></div>
      <p class="key note">Sorted by line count. The numbers 1–15 are how many lines sit at each level. Click an effect to list the Nikkes that have it${open ? '' : ''}.</p>
      <div class="mn-two">
        <div><div class="subhead">By gear slot</div><div class="table-scroll"><table class="roster keep-cols"><thead><tr><th>Effect</th>${colsB}<th class="num">All</th></tr></thead>
          <tbody>${list.map((e) => `<tr><td>${esc(e.name)}</td>${SLOTS.map(([s]) => `<td class="num">${e.slots[s] || '·'}</td>`).join('')}<td class="num">${e.n}</td></tr>`).join('')}</tbody></table></div></div>
        <div><div class="subhead">By the Nikke's manufacturer</div><div class="table-scroll"><table class="roster keep-cols"><thead><tr><th>Effect</th>${corps.map((c) => `<th class="num">${esc(c.slice(0, 4))}</th>`).join('')}</tr></thead>
          <tbody>${list.map((e) => `<tr><td>${esc(e.name)}</td>${corps.map((c) => `<td class="num">${e.corps[c] || '·'}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>
      </div></section>`;
  }

  // Which overload stats to show (Overview columns, List gear details, Gear totals).
  function fxBar() {
    return `<section class="card mn-fx"><h3>Overload stats shown <span class="sub">${m.fx.size} of ${FX.length}</span></h3>
      <div class="chip-row">${FX.map(([t, label]) => `<button class="cat-tab ${m.fx.has(t) ? 'active' : ''}" data-fx="${t}" aria-pressed="${m.fx.has(t)}">${esc(label)}</button>`).join('')}</div>
      <div class="mn-fx-actions"><button class="link-btn" data-fxset="all">All</button> · <button class="link-btn" data-fxset="main">Only the main ones</button> · <button class="link-btn" data-fxset="none">None</button>
        <label class="toggle"><input type="checkbox" id="mn-fx-only" ${m.fxOnly ? 'checked' : ''}> Only Nikkes with a line of the picked stats</label></div>
      <p class="key note">Controls the Overview columns, the lines in the List's gear details (other lines are dimmed) and the Gear totals tables. With some stats picked, the Overview gets a Picked column to sort by.</p></section>`;
  }

  async function render() {
    const box = $('#reader');
    const top = box.scrollTop;
    await ensure();
    if (!m.acct || m.showImport) {
      box.innerHTML = `<div class="scene-head"><div class="crumb">Characters</div><div class="scene-title">My Nikkes</div>
        <div class="toolbar"><span class="key">Import your own account to manage your Nikkes here.</span></div></div>
        <div class="stage-body">${importCard()}</div>`;
      return bindImport();
    }
    const all = rows();
    m.st.groups = groups(); m.st.list = all;
    let shown = Characters.kit.matches(m.st);
    if (m.fxOnly) shown = shown.filter((x) => x.owned && pickedOf(x.owned).n > 0);
    if (m.sort !== 'id') shown.sort((a, b) => (a.owned && b.owned ? SORTS[m.sort][1](a, b) : a.owned ? -1 : b.owned ? 1 : 0));
    const owned = all.filter((x) => x.owned).length;
    box.innerHTML = `<div class="scene-head"><div class="crumb">Characters</div><div class="scene-title">My Nikkes</div>
      <div class="toolbar"><span class="badge">${owned} of ${all.length} owned</span>
        <span class="key">imported ${esc(fmtDate(Date.parse(m.acct.exportedAt) / 1000))}</span>
        <button class="nav-btn" id="mn-update">Update</button><button class="nav-btn" id="mn-clear">Clear data</button>
        ${m.pins.size ? `<button class="nav-btn" id="mn-unpin">Unpin all (${m.pins.size})</button>` : ''}</div></div>
      <div class="stage-body mn-wide">
        ${oldExport(m.acct) ? '<p class="error">This file came from an older export script: every level is wrong (shown as 1). Update the userscript (version 1.0.1 or newer), export again and import the new file.</p>' : ''}
        ${m.msg?.ok ? `<p class="key">${esc(m.msg.text)}</p>` : ''}
        <p class="key">Your data lives only in this browser; nothing is sent to us. Clear data erases it.</p>
        ${summaryCards(all)}
        <div class="mn-tabs">${[['list', 'List'], ['overview', 'Overview'], ['totals', 'Gear totals']].map(([k, label]) => `<button class="cat-tab ${m.tab === k ? 'active' : ''}" data-tab="${k}">${label}</button>`).join('')}</div>
        ${fxBar()}
        ${m.tab === 'totals' ? totals(all) : `<section class="card"><h3>${m.tab === 'list' ? 'Your Nikkes' : 'Overview'} <span class="sub">${m.tab === 'list' ? shown.length : shown.filter((x) => x.owned).length} shown</span></h3>
          <div id="mn-filters">${Characters.kit.filtersHtml(m.st)}</div>
          ${m.tab === 'list' ? `<label class="level-pick">Sort <select id="mn-sort">${Object.entries(SORTS).map(([k, [label]]) => `<option value="${k}" ${k === m.sort ? 'selected' : ''}>${label}</option>`).join('')}</select></label>
          ${table(shown)}
          <p class="key note">Pin a Nikke with the star: pinned ones stay at the top in the current sort order, and stay pinned after Update and Clear data. To do flags: any skill below ${MAX.skill}, core below ${MAX.core}, limit break below ${MAX.grade} stars, a T10 gear piece with no overload line, bond below ${MAX.bond}. Click a Nikke for its page with your values and a button to fill the CP calculator. The text box in the sidebar filters this list too.</p>` : overview(shown)}
        </section>`}
      </div>`;
    if ($('#mn-filters')) Characters.kit.bindFilters($('#mn-filters'), m.st, render);
    box.querySelectorAll('[data-fx]').forEach((b) => b.onclick = () => { m.fx.has(b.dataset.fx) ? m.fx.delete(b.dataset.fx) : m.fx.add(b.dataset.fx); saveFx(); render(); });
    box.querySelectorAll('[data-fxset]').forEach((b) => b.onclick = () => {
      m.fx = new Set(b.dataset.fxset === 'all' ? FX.map(([t]) => t) : b.dataset.fxset === 'main' ? FX.slice(0, 8).map(([t]) => t) : []);
      saveFx(); render();
    });
    $('#mn-fx-only')?.addEventListener('change', (e) => { m.fxOnly = e.target.checked; store.set('mineFxOnly', m.fxOnly); render(); });
    box.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { m.tab = b.dataset.tab; store.set('mineTab', m.tab); render(); });
    box.querySelectorAll('[data-ov]').forEach((th) => th.onclick = () => {
      const k = th.dataset.ov;
      m.ov = m.ov.key === k ? { key: k, dir: -m.ov.dir } : { key: k, dir: k === 'id' ? 1 : -1 };
      store.set('mineOv', m.ov); render();
    });
    box.querySelectorAll('[data-pin]').forEach((b) => b.onclick = () => { togglePin(Number(b.dataset.pin)); render(); });
    $('#mn-unpin')?.addEventListener('click', () => { m.pins.clear(); savePins(); render(); });
    box.querySelectorAll('[data-eff]').forEach((tr) => tr.onclick = () => { m.openEffect = m.openEffect === tr.dataset.eff ? null : tr.dataset.eff; render(); });
    box.scrollTop = top;
    if ($('#mn-sort')) $('#mn-sort').onchange = (e) => { m.sort = e.target.value; store.set('mineSort', m.sort); render(); };
    $('#mn-update').onclick = () => { m.showImport = true; m.msg = null; render(); };
    $('#mn-clear').onclick = () => {
      if (!confirm('Erase your imported account from this browser?')) return;
      try { localStorage.removeItem(`nl.${KEY}`); } catch {}
      m.acct = null; m.msg = { ok: true, text: 'Your data was erased from this browser.' };
      render();
    };
  }

  // ---------- a Nikke's own page ----------
  // The "Your Nikke" card on a character page, with the CP calculator prefill.
  async function fillCard(x, box) {
    const o = byCode().get(x.code);
    if (!box || !o) return;
    await ensure();
    box.innerHTML = `<h3>Your ${esc(x.name)}</h3>
      <dl class="facts">
        <dt>Level</dt><dd>${fmtNum(o.lv)}</dd><dt>Core</dt><dd>${o.core}/${MAX.core}</dd><dt>Limit break</dt><dd>${o.grade}/${MAX.grade}</dd>
        <dt>Skills</dt><dd>${o.skill1_lv} / ${o.skill2_lv} / burst ${o.ulti_skill_lv}</dd><dt>Bond</dt><dd>${o.attractive_lv}</dd>
        <dt>Costume</dt><dd>${esc(costumeName(o))}</dd><dt>CP</dt><dd>${fmtNum(o.combat)}</dd>
        <dt>Cube</dt><dd>${cubeCell(o)}</dd><dt>Item</dt><dd>${itemCell(o)}</dd>
      </dl>
      <div class="mn-gear-list">${gearDetail(o)}</div>
      <div class="sim-actions"><button class="nav-btn" id="mn-fill">Fill CP calculator from my gear</button><button class="nav-btn" id="mn-pin">${m.pins.has(x.code) ? '★ Pinned' : '☆ Pin'}</button><span class="key" id="mn-filled"></span></div>
      <p class="key note">Fills skill levels, the 12 overload lines, cube and item. ATK, HP and DEF are not in the export: type them into the calculator.</p>`;
    $('#mn-pin').onclick = (e) => { togglePin(x.code); e.target.textContent = m.pins.has(x.code) ? '★ Pinned' : '☆ Pin'; };
    $('#mn-fill').onclick = () => {
      const k = kit();
      const ol = SLOTS.flatMap(([s]) => [1, 2, 3].map((n) => {
        const l = m.lookup.options[o[`${s}_equip_option${n}_id`]];
        return l ? { type: l.type === 'IncElementDmg' ? 'elemental' : 'other', lv: l.level } : { type: 'none', lv: 15 };
      }));
      const v = { s1: Math.min(o.skill1_lv, 10), s2: Math.min(o.skill2_lv, 10), burst: Math.min(o.ulti_skill_lv, 10), ol };
      if (k.cpData.cubes.some((q) => q.id === o.harmony_cube_tid)) { v.cube = String(o.harmony_cube_tid); v.cubeLv = Math.max(1, o.harmony_cube_lv); }
      const doll = x.cpItems.find((q) => q.id === o.favorite_item_tid);
      if (doll) { v.doll = String(doll.id); v.dollLv = o.favorite_item_lv; }
      k.applyCp(x, v);
      $('#mn-filled').textContent = 'Filled. See the CP calculator below.';
    };
  }

  const page = () => render();
  return { page, has, fillCard };
})();

// Register with the Characters page's extension points.
NL_EXT.hubCards.push({ href: '#/character/mine', title: 'My Nikkes', text: 'Import your own account (Shiftypad) and see what is left to upgrade.' });
NL_EXT.sidebarItems.push({ href: '#/character/mine', title: 'My Nikkes', note: 'import your account' });
NL_EXT.routes.push({ test: (hash) => hash.startsWith('#/character/mine'), page: () => MyNikkes.page() });
NL_EXT.characterCards.push({ has: (x) => MyNikkes.has(x.code), fill: (x, el) => MyNikkes.fillCard(x, el) });
