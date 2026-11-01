// Nikke Library — playable characters.
const Characters = (() => {
  const c = {
    list: null,
    rarity: store.get('charRarity', 'All'),
    weapon: store.get('charWeapon', 'All'),
    current: null,
    skillLevel: store.get('charSkillLevel', 10),
    favorite: store.get('charFavorite', false), // show favorite item skills where a Nikke has one
  };
  const fmt = (n) => Number(n).toLocaleString('en-US');
  const href = (code) => `#/character/${code}`;
  const CORP_ORDER = ['Elysion', 'Missilis', 'Tetra', 'Pilgrim', 'Abnormal'];

  // Game rich text: <color=#RRGGBB>…</color> becomes a span, <word_group=…> is dropped.
  function richText(s) {
    let open = 0;
    const html = esc(s)
      .replace(/&lt;color=#([0-9a-f]{6})&gt;/gi, (m, hex) => { open++; return `<span style="color:#${hex}">`; })
      .replace(/&lt;\/color&gt;/gi, () => (open > 0 ? (open--, '</span>') : ''))
      .replace(/&lt;\/?word_group[^&]*&gt;/gi, '');
    return html + '</span>'.repeat(open);
  }

  async function enter() {
    if (!c.list) c.list = await (await apiFetch('/api/characters')).json();
    if (!c.cpData) c.cpData = await (await apiFetch('/api/cp-data')).json();
    renderTabs();
    renderTree();
  }

  // Rarity tabs, then a weapon type row; counts follow the other filter.
  const WEAPONS = ['AR', 'SMG', 'SG', 'SR', 'RL', 'MG'];
  const byRarity = (x) => c.rarity === 'All' || x.rarity === c.rarity;
  const byWeapon = (x) => c.weapon === 'All' || x.weapon === c.weapon;

  function renderTabs() {
    const tabs = ['All', 'SSR', 'SR', 'R'];
    const weaponName = (w) => c.list.find((x) => x.weapon === w)?.weaponName || w;
    $('#cat-tabs').innerHTML = tabs.map((t) => {
      const n = c.list.filter((x) => (t === 'All' || x.rarity === t) && byWeapon(x)).length;
      return `<button class="cat-tab ${c.rarity === t ? 'active' : ''}" data-rarity="${t}">${t}<span class="n">${n}</span></button>`;
    }).join('') + `<div class="mode-row wrap">${['All', ...WEAPONS].map((w) => {
      const n = c.list.filter((x) => byRarity(x) && (w === 'All' || x.weapon === w)).length;
      return `<button class="mode-chip ${c.weapon === w ? 'active' : ''}" data-weapon="${w}" title="${esc(w === 'All' ? 'All weapons' : weaponName(w))}">${w === 'All' ? 'All weapons' : w} <span class="key">${n}</span></button>`;
    }).join('')}</div>`;
    $('#cat-tabs').querySelectorAll('[data-rarity]').forEach((b) => b.onclick = () => {
      c.rarity = b.dataset.rarity; store.set('charRarity', c.rarity); renderTabs(); renderTree();
    });
    $('#cat-tabs').querySelectorAll('[data-weapon]').forEach((b) => b.onclick = () => {
      c.weapon = b.dataset.weapon; store.set('charWeapon', c.weapon); renderTabs(); renderTree();
    });
  }

  // Grouped by manufacturer; the filter matches name, class, weapon, element or burst.
  function renderTree() {
    const f = state.filter;
    const match = (x) => !f || [x.name, x.class, x.weapon, x.burst && `burst ${x.burst}`, ...x.element]
      .some((v) => v && String(v).toLowerCase().includes(f));
    const list = c.list.filter((x) => byRarity(x) && byWeapon(x) && match(x));
    const corps = [...new Set(list.map((x) => x.corporation))]
      .sort((a, b) => (CORP_ORDER.indexOf(a) + 1 || 99) - (CORP_ORDER.indexOf(b) + 1 || 99));
    const onOverload = location.hash.startsWith('#/character/overload');
    $('#tree').innerHTML = `<details class="group" open><summary>Gear</summary>
        <a class="scene-link ${onOverload ? 'active' : ''}" href="#/character/overload"><span>Overload gear</span><span class="lines">effects, chances, costs</span></a>
      </details>` + (corps.map((corp) => {
      const members = list.filter((x) => x.corporation === corp);
      return `<details class="group" open><summary>${esc(corp)}<span class="count">${members.length}</span></summary>
        ${members.map((x) => `<a class="scene-link char-link ${c.current?.code === x.code ? 'active' : ''}" href="${href(x.code)}">
          ${gameImg('icons-char', x.icon, 'char-icon')}
          ${x.element[0] ? `<span class="elem elem-${esc(x.element[0].toLowerCase())}" title="${esc(x.element.join(', '))}"></span>` : ''}
          <span>${esc(x.name)}${x.hasFavorite ? ' <span class="fav-mark" title="Has a favorite item">★</span>' : ''}</span><span class="lines">${esc(x.weapon || '')} · ${esc(x.burst)}</span></a>`).join('')}
      </details>`;
    }).join('') || '<p class="key" style="padding:12px">No matches.</p>');
    $('#tree .scene-link.active')?.scrollIntoView({ block: 'nearest' });
  }

  async function route() {
    if (location.hash.startsWith('#/character/overload')) { c.current = null; renderTree(); return overloadPage(); }
    const m = location.hash.match(/^#\/character\/(\d+)/);
    if (!m) { c.current = null; renderTree(); return overview(); }
    const res = await apiFetch('/api/character?code=' + m[1]);
    if (!res.ok) { $('#reader').innerHTML = '<div class="error">Character not found.</div>'; return; }
    c.current = await res.json();
    renderTree();
    renderCharacter();
    $('#reader').scrollTop = 0;
  }

  function overview() {
    const count = (r) => c.list.filter((x) => x.rarity === r).length;
    $('#reader').innerHTML = `<div class="empty"><h1>Characters</h1>
      <p>${c.list.length} Nikkes: ${count('SSR')} SSR, ${count('SR')} SR, ${count('R')} R.</p>
      <p>Pick a Nikke for skills, weapon and stories.</p>
      <p><a href="#/character/overload">Overload gear →</a> what modified gear lines can roll, the chances and the costs.</p></div>
      <div class="char-gallery">${c.list.filter((x) => x.icon).map((x) => `<a href="${href(x.code)}" title="${esc(x.name)}">
        ${gameImg('icons-char', x.icon)}<span>${esc(x.name)}</span></a>`).join('')}</div>`;
  }

  // ---------- Overload gear ----------
  // What a modified (overload) gear line can roll: /api/overload from EquipmentOptionTable,
  // EquipmentOptionCostTable and ItemEquipTable's option slots.
  async function overloadPage() {
    if (!c.overload) c.overload = await (await apiFetch('/api/overload')).json();
    const o = c.overload;
    if (!o) { $('#reader').innerHTML = '<div class="error">No overload gear data.</div>'; return; }
    const tiers = o.types[0].tiers;
    const showBp = !!c.overloadBp;
    const range = (t) => `Lv ${t.levels[0].level}–${t.levels[t.levels.length - 1].level}`;
    // Costs: one item per cell (×N); Custom Lock is the one-time alternative, by lock level.
    const count = (list, item) => { const k = list.find((x) => x.item === item); return k ? `×${fmtNum(k.count)}` : '—'; };
    const moduleName = o.costs.modify[0]?.cost[0]?.item || 'Custom Module';
    const lockName = o.costs.lock.flatMap((r) => r.lock)[0]?.cost[0]?.item || 'Custom Lock';
    const lockLevels = [...new Set(o.costs.lock.flatMap((r) => r.lock.map((l) => l.level)))];
    const costRows = [['Modify gear', o.costs.modify], ['Change Effects', o.costs.change], ['Lock Effect', o.costs.lock]]
      .flatMap(([name, rows]) => rows.map((r, i) => `<tr><td style="white-space:nowrap">${i ? '' : esc(name)}</td><td class="num">${r.level}</td><td class="num">${count(r.cost, moduleName)}</td>
        ${lockLevels.map((lv) => { const l = r.lock.find((x) => x.level === lv); return `<td class="num">${l ? count(l.cost, lockName) : '—'}</td>`; }).join('')}</tr>`)).join('');

    $('#reader').innerHTML = `
      <div class="scene-head">
        <div class="crumb">Characters · Gear</div>
        <div class="scene-title">Overload gear</div>
        <div class="toolbar"><span class="badge">${esc(o.gearRarity)} gear</span><span class="badge">${o.types.length} effects</span><span class="badge">Lv 1–${tiers.reduce((n, t) => n + t.levels.length, 0)}</span></div>
      </div>
      <div class="stage-body">
        <section class="card"><h3>How lines roll</h3>
          <dl class="facts">
            ${o.slots.map((ch, i) => `<dt>Line ${i + 1}</dt><dd>${fmtPct(ch)} chance of an effect</dd>`).join('')}
            <dt>Tier</dt><dd>${tiers.map((t, i) => `${i + 1} (${range(t)}) ${fmtPct(t.chance)}`).join(' · ')}</dd>
          </dl>
          <p class="key note">Modifying ${esc(o.gearRarity)} gear swaps its manufacturer effect for up to ${o.slots.length} random lines. Each line picks an effect (Roll % below), then a tier. The data has no chance per level inside a tier; hover a value for its chance per line if those levels are equally likely.</p>
        </section>
        <section class="card"><h3>Effects by level</h3>
          <label class="toggle"><input type="checkbox" id="ol-bp" ${showBp ? 'checked' : ''}> Battle power instead of values</label>
          <div class="table-scroll"><table class="roster sticky-first keep-cols">
            <thead><tr><th rowspan="2">Effect</th><th class="num" rowspan="2">Roll %</th>
              ${tiers.map((t, i) => `<th class="num" colspan="${t.levels.length}">Tier ${i + 1} · ${fmtPct(t.chance)}</th>`).join('')}</tr>
              <tr>${tiers.flatMap((t) => t.levels.map((l) => `<th class="num">${l.level}</th>`)).join('')}</tr></thead>
            <tbody>${o.types.map((t) => `<tr><td style="white-space:nowrap">${esc(t.name.replace(/^Increased /, ''))}</td><td class="num">${fmtPct(t.chance)}</td>
              ${t.tiers.flatMap((tier) => tier.levels.map((l) => `<td class="num" title="Lv ${l.level}: ${l.value}% · ${fmtNum(l.bp)} BP · ${fmtPct((t.chance * tier.chance) / 100 / tier.levels.length, 2)} per line">${showBp ? fmtNum(l.bp) : l.value}</td>`)).join('')}</tr>`).join('')}
            </tbody></table></div>
          <p class="key note">${showBp ? 'Battle power per level, what the CP calculator on each Nikke\'s page adds up.' : 'Values in % by level.'} Hit Rate and Charge Speed are stored negative (tighter spread, shorter charge).</p>
        </section>
        <section class="card"><h3>Costs</h3>
          <div class="table-scroll"><table class="roster keep-cols">
            <thead><tr><th rowspan="2">Action</th><th class="num" rowspan="2">Level</th><th class="num" rowspan="2">${esc(moduleName)}</th>
              ${lockLevels.length ? `<th class="num" colspan="${lockLevels.length}">or ${esc(lockName)}, by lock level</th>` : ''}</tr>
              <tr>${lockLevels.map((lv) => `<th class="num">${lv}</th>`).join('')}</tr></thead>
            <tbody>${costRows}</tbody></table></div>
          <p class="key note">EquipmentOptionCostTable numbers each cost level but doesn't say what raises it (most likely how many effects are already locked). ${esc(lockName)} locks an effect once.</p>
        </section>
      </div>`;
    $('#ol-bp').onchange = (e) => { c.overloadBp = e.target.checked; overloadPage(); };
  }

  // With the favorite item toggle on, slots it replaces (1 = Skill 1, 2 = Skill 2, 3 = Burst) use its skills.
  function skillCards(x) {
    const lv = Math.min(c.skillLevel, 10);
    const useFavorite = x.favorite && c.favorite;
    return x.skills.map((base, i) => {
      const swap = useFavorite ? x.favorite.skills.find((f) => f.slot === i + 1) : null;
      const s = swap ? { ...base, levels: swap.levels } : base;
      const level = s.levels[Math.min(lv, s.levels.length) - 1] || s.levels[0];
      if (!level) return '';
      return `<section class="card skill ${swap ? 'favorite-skill' : ''}"><h3>${esc(s.slot)}${swap ? ' <span class="tag fav-tag">FAVORITE ITEM</span>' : ''}${s.cooldown ? ` <span class="sub">${s.cooldown}s cooldown</span>` : ''}</h3>
        <div class="skill-name">${esc(level.name)} <span class="key">Lv ${level.level}</span></div>
        <div class="skill-desc">${richText(level.description)}</div></section>`;
    }).join('');
  }

  // ---------- CP calculator ----------
  // statPower  = ATK*1.075*18 + (HP + DEF*100)*0.7   (1.075 = crit factor, same for every unit)
  // multiplier = 1.3 + (skill1+skill2)*0.01 + burst*0.02 + itemEffectBP*0.0001
  // CP         = round(statPower * multiplier * 0.01), itemEffectBP = overload + cube + doll
  // Item BP comes from FunctionTable.function_battlepower via /api/cp-data and the Nikke's cpItems.
  const OL_SLOTS = 12; // 4 gear pieces x 3 overload lines
  const cpDefaults = () => ({ atk: 0, hp: 0, def: 0, s1: 10, s2: 10, burst: 10,
    ol: Array.from({ length: OL_SLOTS }, () => ({ type: 'none', lv: 15 })), cube: '', cubeLv: 15, doll: '', dollLv: 15 });
  const cpLoad = (code) => ({ ...cpDefaults(), ...store.get(`cp-${code}`, {}) });

  function cpCompute(x, v) {
    const d = c.cpData;
    const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, Number(n) || 0));
    const ol = v.ol.reduce((sum, l) => sum + (l.type === 'none' ? 0 : (d.overload[l.type][clamp(l.lv, 1, 15) - 1] || 0)), 0);
    const cube = d.cubes.find((k) => String(k.id) === String(v.cube));
    const cubeBp = cube ? cube.levels[clamp(v.cubeLv, 1, cube.levels.length) - 1] : 0;
    const doll = x.cpItems.find((k) => String(k.id) === String(v.doll));
    const dollBp = doll ? (doll.levels.find((l) => l.level === Number(v.dollLv)) || doll.levels[doll.levels.length - 1]).bp : 0;
    const itemBp = ol + cubeBp + dollBp;
    const statPower = v.atk * 1.075 * 18 + (Number(v.hp) + v.def * 100) * 0.7;
    const multiplier = 1.3 + (clamp(v.s1, 1, 10) + clamp(v.s2, 1, 10)) * 0.01 + clamp(v.burst, 1, 10) * 0.02 + itemBp * 0.0001;
    return { ol, cubeBp, dollBp, itemBp, statPower, multiplier, cp: Math.round(statPower * multiplier * 0.01) };
  }

  function cpCard(x) {
    const v = cpLoad(x.code);
    const d = c.cpData;
    const num = (id, val, min, max, step = 1) => `<input type="number" class="cp-in" data-k="${id}" value="${val}" min="${min}" ${max != null ? `max="${max}"` : ''} step="${step}">`;
    const doll = x.cpItems.find((k) => String(k.id) === String(v.doll));
    const dollLevels = doll ? doll.levels : [];
    return `<section class="card cp-card"><h3>CP calculator</h3>
      <div class="cp-grid">
        <label>ATK ${num('atk', v.atk, 0)}</label><label>HP ${num('hp', v.hp, 0)}</label><label>DEF ${num('def', v.def, 0)}</label>
        <label>Skill 1 ${num('s1', v.s1, 1, 10)}</label><label>Skill 2 ${num('s2', v.s2, 1, 10)}</label><label>Burst ${num('burst', v.burst, 1, 10)}</label>
      </div>
      <div class="subhead">Overload lines <a class="key" href="#/character/overload">effects and values →</a></div>
      <div class="table-scroll"><table class="roster keep-cols cp-ol">
        <thead><tr><th>Gear</th>${[1, 2, 3].map((n) => `<th>Line ${n}</th><th class="num">Lv</th>`).join('')}</tr></thead>
        <tbody>${['Head', 'Body', 'Arm', 'Leg'].map((gear, g) => `<tr><td>${gear}</td>${v.ol.slice(g * 3, g * 3 + 3).map((l, k) => { const i = g * 3 + k; return `
          <td><select class="cp-ol-type" data-i="${i}"><option value="none" ${l.type === 'none' ? 'selected' : ''}>—</option>
            <option value="other" ${l.type === 'other' ? 'selected' : ''}>Stat</option><option value="elemental" ${l.type === 'elemental' ? 'selected' : ''}>Elemental</option></select></td>
          <td class="num"><input type="number" class="cp-ol-lv" data-i="${i}" value="${l.lv}" min="1" max="15" ${l.type === 'none' ? 'disabled' : ''}></td>`; }).join('')}</tr>`).join('')}
        </tbody></table></div>
      <p class="key note">Stat = any line but elemental damage (they share one BP scale).</p>
      <div class="cp-grid">
        <label>Harmony Cube <select class="cp-in" data-k="cube"><option value="">None</option>
          ${d.cubes.map((k) => `<option value="${k.id}" ${String(v.cube) === String(k.id) ? 'selected' : ''}>${esc(k.name)}</option>`).join('')}</select></label>
        <label>Cube level ${num('cubeLv', v.cubeLv, 1, 15)}</label>
        <label>Collection item <select class="cp-in" data-k="doll"><option value="">None</option>
          ${x.cpItems.map((k) => `<option value="${k.id}" ${String(v.doll) === String(k.id) ? 'selected' : ''}>${esc(k.rarity)} · ${esc(k.name)}</option>`).join('')}</select></label>
        <label>Item level <select class="cp-in" data-k="dollLv" ${doll ? '' : 'disabled'}>
          ${dollLevels.map((l) => `<option value="${l.level}" ${Number(v.dollLv) === l.level ? 'selected' : ''}>Lv ${l.level} (phase ${l.phase})</option>`).join('')}</select></label>
      </div>
      <div id="cp-result"></div>
      <div class="cp-actions"><button class="nav-btn" id="cp-reset">Reset</button></div>
    </section>`;
  }

  function cpResult(x) {
    const v = cpLoad(x.code);
    const r = cpCompute(x, v);
    const n = (k, d = 0) => Number(k).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d });
    return `<div class="cp-total"><span class="key">CP</span><b>${n(r.cp)}</b></div>
      <dl class="facts cp-break">
        <dt>Stat power</dt><dd>${n(v.atk)} × 1.075 × 18 + (${n(v.hp)} + ${n(v.def)} × 100) × 0.7 = <b>${n(r.statPower, 2)}</b></dd>
        <dt>Item effect BP</dt><dd>Overload ${n(r.ol)} + Cube ${n(r.cubeBp)} + Collection ${n(r.dollBp)} = <b>${n(r.itemBp)}</b></dd>
        <dt>Multiplier</dt><dd>1.3 + (${v.s1} + ${v.s2}) × 0.01 + ${v.burst} × 0.02 + ${n(r.itemBp)} × 0.0001 = <b>${r.multiplier.toFixed(4)}</b></dd>
        <dt>CP</dt><dd>round(${n(r.statPower, 2)} × ${r.multiplier.toFixed(4)} × 0.01) = <b>${n(r.cp)}</b></dd>
      </dl>`;
  }

  function bindCp(x) {
    const card = $('#reader .cp-card');
    if (!card) return;
    const save = (mut) => { const v = cpLoad(x.code); mut(v); store.set(`cp-${x.code}`, v); };
    const refresh = () => { $('#cp-result').innerHTML = cpResult(x); };
    card.querySelectorAll('.cp-in').forEach((el) => el.oninput = el.onchange = () => {
      save((v) => { v[el.dataset.k] = el.tagName === 'SELECT' && el.dataset.k !== 'dollLv' ? el.value : Number(el.value); });
      if (el.dataset.k === 'doll') { // item levels differ per item: rebuild the card
        card.outerHTML = cpCard(x); bindCp(x); return;
      }
      refresh();
    });
    card.querySelectorAll('.cp-ol-type').forEach((el) => el.onchange = () => {
      save((v) => { v.ol[el.dataset.i].type = el.value; });
      card.querySelector(`.cp-ol-lv[data-i="${el.dataset.i}"]`).disabled = el.value === 'none';
      refresh();
    });
    card.querySelectorAll('.cp-ol-lv').forEach((el) => el.oninput = () => { save((v) => { v.ol[el.dataset.i].lv = Number(el.value); }); refresh(); });
    $('#cp-reset').onclick = () => { store.set(`cp-${x.code}`, cpDefaults()); card.outerHTML = cpCard(x); bindCp(x); };
    refresh();
  }

  // Weapon stats as [label, value] rows; the in-game ammo / reload / fire rate / range ratings follow.
  function weaponStats(w) {
    const t = w.typeInfo || {};
    return [
      ['Type', `${esc(w.typeName)} (${esc(w.type)})`], ['Attack', esc(w.attackType)], ['Control', esc(w.control)],
      ['Damage', fmtPct(w.damage, 2)], ...(w.pellets > 1 ? [['Pellets', fmtNum(w.pellets)]] : []),
      ['Ammo', fmtNum(w.ammo)], ['Reload', `${w.reload}s`], ['Core damage', fmtPct(w.coreDamage, 2)],
      ...(w.charge ? [['Charge time', `${w.charge.time}s`], ['Full charge damage', fmtPct(w.charge.fullDamage, 2)], ['Full charge burst', fmtPct(w.charge.fullBurst, 2)]] : []),
      ['Burst / shot', fmtPct(w.burstPerShot, 4)], ['Burst / shot on target', fmtPct(w.burstPerShotTarget, 4)],
      ...[['Ammo rating', t.ammo], ['Reload rating', t.reload], ['Fire rate rating', t.fireRate], ['Range rating', t.range]].filter(([, v]) => v).map(([k, v]) => [k, esc(v)]),
    ];
  }

  function renderCharacter() {
    const x = c.current;
    const badge = (text, cls = '') => `<span class="badge ${cls}">${text}</span>`;
    const w = x.weapon;
    const story = (label, link) => link
      ? `<a class="scen" href="#/scene/${encodeURIComponent(link.first)}"><span class="scen-phase">${link.count} scenes</span><span>${label}</span></a>` : '';
    const stories = [story('Bond episodes', x.stories.bond), story('Counseling', x.stories.counsel)].join('');

    $('#reader').innerHTML = `
      <div class="scene-head">
        <div class="crumb">Characters · ${esc(x.corporation)}${x.squad ? ` · ${esc(x.squad.name)}` : ''}</div>
        <div class="scene-title">${esc(x.name)}</div>
        <div class="toolbar">
          ${badge(esc(x.rarity), `rar-${x.rarity.toLowerCase()}`)}${badge(esc(x.class))}
          ${x.element.map((e) => badge(`<span class="elem elem-${esc(e.toLowerCase())}"></span> ${esc(e)}`, 'with-dot')).join('')}
          ${w ? badge(esc(w.typeName)) : ''}${badge(`Burst ${esc(x.burst)}`)}${x.overspec ? badge('Overspec') : ''}
        </div>
      </div>
      <div class="stage-body">
        <section class="card"><h3>Profile</h3><div class="profile">
          ${gameImg('icons-char', x.portrait, 'char-portrait')}<div>
          ${x.description ? `<p class="prose">${esc(x.description)}</p>` : ''}
          <dl class="facts">
            ${x.squad ? `<dt>Squad</dt><dd>${esc(x.squad.name)}${x.squad.info ? `<div class="key">${esc(x.squad.info)}</div>` : ''}</dd>` : ''}
            <dt>Manufacturer</dt><dd>${esc(x.corporation)}${x.overspec ? ' · Overspec' : ''}</dd>
            <dt>Crit rate</dt><dd>${fmtPct(x.critical.rate)}</dd>
            <dt>Crit damage</dt><dd>${fmtPct(x.critical.damage)}</dd>
          </dl></div></div>
        </section>
        ${w ? `<section class="card"><h3>Weapon</h3>
          <div class="skill-name">${esc(w.name)}</div>
          <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th>Stat</th><th class="num">Value</th></tr></thead><tbody>
            ${weaponStats(w).map(([k, v]) => `<tr><td>${k}</td><td class="num">${v}</td></tr>`).join('')}
          </tbody></table></div>
          <div class="skill-desc">${richText(w.description)}</div>
          <p class="key note">${w.typeInfo ? `${esc(w.typeName)}: ${esc(w.typeInfo.description)} ` : ''}Burst gauge per shot as stored ÷ 10,000; "on target" is when the shot hits the target.</p></section>` : ''}
        <section class="card"><h3>Skills</h3>
          <label class="level-pick">Skill level <input type="range" id="skill-lv" min="1" max="10" value="${Math.min(c.skillLevel, 10)}">
            <b id="skill-lv-n">${Math.min(c.skillLevel, 10)}</b></label>
          ${x.favorite ? `<label class="toggle fav-toggle"><input type="checkbox" id="fav-toggle" ${c.favorite ? 'checked' : ''}>
            Use favorite item skills: <b>${esc(x.favorite.name)}</b></label>
            <p class="key note">${esc(x.favorite.description)}</p>` : ''}</section>
        <div id="skills" class="skill-stack">${skillCards(x)}</div>
        ${c.cpData ? cpCard(x) : ''}
        ${stories ? `<section class="card"><h3>Stories</h3><div class="scen-list">${stories}</div></section>` : ''}
        ${x.costumes.length ? `<section class="card"><h3>Costumes <span class="sub">${x.costumes.length}</span></h3>
          <div class="rewards">${x.costumes.map((k) => `<div class="reward costume">${gameImg('icons-char', k.portrait, 'costume-img')}<span class="reward-name">${esc(k.name)}</span>
            <span class="key">${esc(k.description.split('\n').slice(1).join(' ') || k.grade)}</span></div>`).join('')}</div></section>` : ''}
      </div>`;

    $('#skill-lv').oninput = (e) => {
      c.skillLevel = Number(e.target.value); store.set('charSkillLevel', c.skillLevel);
      $('#skill-lv-n').textContent = c.skillLevel;
      $('#skills').innerHTML = skillCards(x);
    };
    bindCp(x);
    if (x.favorite) $('#fav-toggle').onchange = (e) => {
      c.favorite = e.target.checked; store.set('charFavorite', c.favorite);
      $('#skills').innerHTML = skillCards(x);
    };
  }

  return { enter, route, renderTree };
})();
