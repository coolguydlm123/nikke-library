// Nikke Library — playable characters.
const Characters = (() => {
  const c = {
    list: null,
    sel: store.get('charFilters', {}), // { rarity: ['SSR'], weapon: [], element: [], burst: [] }
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
    renderTree();
  }

  // Filter chips: several values within a group match any of them (OR), groups combine (AND),
  // together with the sidebar's text filter. Shown in the sidebar and, on phones, on the landing page.
  const FILTERS = [
    { key: 'rarity', label: 'Rarity', values: () => ['SSR', 'SR', 'R'], of: (x) => [x.rarity] },
    { key: 'weapon', label: 'Weapon', values: () => ['AR', 'SMG', 'SG', 'SR', 'RL', 'MG'], of: (x) => [x.weapon] },
    { key: 'element', label: 'Element', values: () => ['Fire', 'Water', 'Wind', 'Electric', 'Iron'], of: (x) => x.element },
    { key: 'burst', label: 'Burst', values: () => ['I', 'II', 'III', 'A'], names: { A: 'Any' }, of: (x) => [x.burst] },
    { key: 'effect', label: 'Skill effect', values: () => effectValues(), of: (x) => x.effects, fold: true },
  ];
  // Skill effect: every tag any of the Nikke's skills has (lib/characters.js EFFECT_LABELS), most common first.
  const effectValues = () => {
    const n = new Map();
    c.list.forEach((x) => x.effects.forEach((e) => n.set(e, (n.get(e) || 0) + 1)));
    return [...n].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([e]) => e);
  };
  const picked = (key) => c.sel[key] || [];
  const textMatch = (x) => {
    const f = state.filter;
    return !f || [x.name, x.class, x.weapon, x.burst && `burst ${x.burst}`, ...x.element].some((v) => v && String(v).toLowerCase().includes(f));
  };
  // `skip` leaves one group out, for that group's chip counts.
  const passes = (x, skip) => textMatch(x) && FILTERS.every((g) => g.key === skip || !picked(g.key).length || g.of(x).some((v) => picked(g.key).includes(v)));
  const matches = () => c.list.filter((x) => passes(x));
  const anyPicked = () => FILTERS.some((g) => picked(g.key).length);

  function filtersHtml() {
    const chips = (g, base) => g.values().map((v) => {
      const on = picked(g.key).includes(v);
      const n = base.filter((x) => g.of(x).includes(v)).length;
      return `<button class="cat-tab ${on ? 'active' : ''}" data-g="${g.key}" data-v="${esc(v)}" aria-pressed="${on}">${esc(g.names?.[v] || v)}<span class="n">${n}</span></button>`;
    }).join('');
    return `<div class="char-filters">${FILTERS.map((g) => {
      const base = c.list.filter((x) => passes(x, g.key));
      if (!g.fold) return `<div class="chip-row"><span class="chip-label">${g.label}</span>${chips(g, base)}</div>`;
      // A long group folds away (open while something in it is picked).
      const k = picked(g.key).length;
      return `<details class="chip-fold" data-fold="${g.key}" ${k || c.open?.[g.key] ? 'open' : ''}><summary>${g.label}${k ? ` <span class="n">${k} picked</span>` : ''}</summary>
        <div class="chip-row chip-wrap">${chips(g, base)}</div></details>`;
    }).join('')}
      <div class="chip-sum key"><b>${matches().length}</b> of ${c.list.length} match${anyPicked() || state.filter ? ' <button class="link-btn" data-clear>Clear all</button>' : ''}</div></div>`;
  }

  function bindFilters(root) {
    root.querySelectorAll('[data-fold]').forEach((d) => d.addEventListener('toggle', () => { c.open = { ...c.open, [d.dataset.fold]: d.open }; }));
    root.querySelectorAll('[data-g]').forEach((b) => b.onclick = () => {
      const list = picked(b.dataset.g);
      c.sel = { ...c.sel, [b.dataset.g]: list.includes(b.dataset.v) ? list.filter((v) => v !== b.dataset.v) : [...list, b.dataset.v] };
      store.set('charFilters', c.sel);
      refresh();
    });
    root.querySelector('[data-clear]')?.addEventListener('click', () => {
      c.sel = {}; store.set('charFilters', c.sel);
      if (state.filter) { state.filter = ''; $('#filter').value = ''; }
      refresh();
    });
  }

  const refresh = () => renderTree();

  // The chips live on the landing page. The sidebar only shows a summary while a filter is active,
  // so the list never looks filtered without a way to see why or clear it.
  function renderTabs() {
    const box = $('#cat-tabs');
    const active = anyPicked() || !!state.filter;
    box.hidden = !active;
    box.innerHTML = active
      ? `<div class="chip-sum key"><b>${matches().length}</b> of ${c.list.length} match <button class="link-btn" data-clear>Clear all</button> · <a href="#/characters">Edit filters</a></div>` : '';
    bindFilters(box);
  }

  // Grouped by manufacturer; also redraws the chips (their counts follow the text filter)
  // and the landing gallery when it is showing.
  function renderTree() {
    renderTabs();
    const list = matches();
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
    if ($('#char-hub-gallery')) renderGallery();
  }

  async function route() {
    if (location.hash.startsWith('#/character/overload')) { c.current = null; renderTree(); return overloadPage(); }
    const m = location.hash.match(/^#\/character\/(\d+)/);
    if (!m) { c.current = null; renderTree(); return overview(); }
    const res = await apiFetch('/api/character?code=' + m[1]);
    if (!res.ok) { $('#reader').innerHTML = '<div class="error">Character not found.</div>'; return; }
    if (c.current?.code !== Number(m[1])) c.voiceLook = 0;
    c.current = await res.json();
    store.set('charLast', c.current.code);
    renderTree();
    renderCharacter();
    $('#reader').scrollTop = 0;
    // #/character/<code>/cp opens the page at its CP calculator (the hub's CP card).
    if (/\/cp$/.test(location.hash)) $('#reader .cp-card')?.scrollIntoView({ block: 'start' });
  }

  // Landing page: tools first, then every Nikke's icon grouped by manufacturer like the sidebar.
  function overview() {
    const count = (r) => c.list.filter((x) => x.rarity === r).length;
    const last = c.list.find((x) => x.code === store.get('charLast', null)) || c.list[0];
    $('#reader').innerHTML = hubHtml({
      title: 'Characters',
      text: `${c.list.length} Nikkes: ${count('SSR')} SSR, ${count('SR')} SR, ${count('R')} R. Pick one for skills, weapon, CP and stories.`,
      groups: [{ title: 'Tools', cards: [
        { href: `${href(last.code)}/cp`, title: 'CP calculator', text: `On every Nikke's page; opens ${last.name}.` },
        { href: '#/character/overload', title: 'Overload gear', text: 'What modified gear lines roll, the chances and the costs.' },
      ] }],
    });
    $('#reader .home').insertAdjacentHTML('beforeend', '<div id="char-hub-filters"></div><div id="char-hub-gallery"></div>');
    renderGallery();
  }

  // The landing gallery: filter chips (phones; the sidebar has them on wider screens), then the
  // matching Nikkes grouped by manufacturer.
  function renderGallery() {
    $('#char-hub-filters').innerHTML = filtersHtml();
    bindFilters($('#char-hub-filters'));
    const list = matches().filter((x) => x.icon);
    const corps = [...new Set(list.map((x) => x.corporation))]
      .sort((a, b) => (CORP_ORDER.indexOf(a) + 1 || 99) - (CORP_ORDER.indexOf(b) + 1 || 99));
    $('#char-hub-gallery').innerHTML = corps.map((corp) => {
      const members = list.filter((x) => x.corporation === corp);
      return `<h2 class="hub-head">${esc(corp)} <span class="n">${members.length}</span></h2>
        <div class="char-gallery">${members.map((x) => `<a href="${href(x.code)}" title="${esc(x.name)}">
          ${gameImg('icons-char', x.icon)}<span>${esc(x.name)}</span></a>`).join('')}</div>`;
    }).join('') || '<p class="key">No Nikke matches these filters.</p>';
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
        <section class="card ol-sim" id="ol-sim"></section>
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
    renderSim(o);
  }

  // ---------- Overload roll simulator ----------
  // From the data: each line's chance of getting an effect (option_slot_success_ratio), the effect
  // weights (option_group_ratio), the tier weights (option_ratio) and the costs. Game rules from the
  // user: an effect never repeats on one piece, the first roll after a reset (Modify gear) gives
  // line 1 an effect at exactly Lv 11, every roll costs 1 Custom Module, and locking a line is paid
  // once, by how many lines are already locked (0/1/2): Change Effects levels 0-2 in Custom Modules
  // (1/2/3) or the Lock Effect rows in Custom Locks (20/30/40). Module locks stay; a Custom Lock is a
  // temporary one-time lock, released after the next roll.
  // Assumed: the levels inside a tier are equally likely.
  // Short effect names for the simulator's narrow tables (full names are in the effects table).
  const SIM_SHORT = { IncElementDmg: 'Elem Dmg', StatAccuracyCircle: 'Hit Rate', StatAmmoLoad: 'Max Ammo', StatAtk: 'ATK', StatChargeDamage: 'Charge Dmg',
    StatChargeTime: 'Charge Spd', StatCritical: 'Crit Rate', StatCriticalDamage: 'Crit Dmg', StatDef: 'DEF' };
  const SIM_CAP = 500000; // most rolls one "roll until" will try (about 0.3 s)
  const SIM_SAMPLES = 40000;
  const newSim = (o) => ({
    lines: o.slots.map(() => null), locked: o.slots.map(() => false), rolls: 0, modules: 0, customs: 0, history: [], estimate: null, untilMsg: null,
    target: ['IncElementDmg', 'StatAtk'].map((f) => ({ t: o.types.findIndex((t) => t.functionType === f), lv: 11 })).filter((x) => x.t >= 0),
  });

  const pickWeighted = (weights) => {
    let r = Math.random() * weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < weights.length; i++) if ((r -= weights[i]) < 0) return i;
    return weights.length - 1;
  };

  // One roll of the unlocked lines (mutates `lines`); no effect twice on one piece. `first` = the
  // Modify gear roll after a reset, whose line 1 is always exactly Lv 11 (the top tier's first level).
  function rollLines(o, lines, locked, first = false) {
    for (let i = 0; i < lines.length; i++) if (!locked[i]) lines[i] = null;
    for (let i = 0; i < lines.length; i++) {
      if (locked[i]) continue;
      if (!(first && i === 0) && Math.random() * 100 >= o.slots[i]) continue;
      const taken = new Set(lines.filter(Boolean).map((l) => l.t));
      const t = pickWeighted(o.types.map((x, k) => (taken.has(k) ? 0 : x.chance)));
      const tiers = o.types[t].tiers;
      if (first && i === 0) { lines[i] = { t, lv: tiers[tiers.length - 1].levels[0].level }; continue; }
      const tier = tiers[pickWeighted(tiers.map((x) => x.chance))];
      lines[i] = { t, lv: tier.levels[Math.floor(Math.random() * tier.levels.length)].level };
    }
    return lines;
  }

  // Every target condition met by a different line.
  function meets(lines, target) {
    const used = new Set();
    return target.length > 0 && target.every((g) => {
      const i = lines.findIndex((l, k) => l && !used.has(k) && l.t === g.t && l.lv >= g.lv);
      if (i < 0) return false;
      used.add(i);
      return true;
    });
  }

  const changeCost = (o, n) => (o.costs.change.find((r) => r.level === n) || o.costs.change[o.costs.change.length - 1])?.cost[0]?.count || 0;
  const customLockCost = (o, n) => {
    const row = o.costs.lock.find((r) => r.level === n) || o.costs.lock[o.costs.lock.length - 1];
    return (row?.lock.find((l) => l.level === 0) || row?.lock[0])?.cost[0]?.count || 0;
  };
  // What locking one more line costs now, by how many lines are already locked.
  const lockCost = (o, sim, kind) => {
    const n = sim.locked.filter(Boolean).length;
    return kind === 'custom' ? { modules: 0, customs: customLockCost(o, n) } : { modules: changeCost(o, n), customs: 0 };
  };
  const rollCost = (o, sim) => ({ modules: sim.rolls ? changeCost(o, 0) : o.costs.modify[0]?.cost[0]?.count || 0, customs: 0 });
  const pay = (sim, k) => { sim.modules += k.modules; sim.customs += k.customs; };

  function lockLine(o, sim, i, kind) {
    pay(sim, lockCost(o, sim, kind));
    sim.locked[i] = kind;
  }

  // One roll; Custom Locks are released afterwards.
  function doRoll(o, sim) {
    pay(sim, rollCost(o, sim));
    rollLines(o, sim.lines, sim.locked, !sim.rolls);
    sim.locked = sim.locked.map((x) => (x === 'custom' ? false : x));
    sim.rolls++;
    sim.history.unshift({ n: sim.rolls, lines: sim.lines.map((l) => l && { ...l }) });
    sim.history.length = Math.min(sim.history.length, 10);
  }

  // Chance one roll meets the target with the current locks, by sampling.
  function estimate(o, sim) {
    if (!sim.target.length) return null;
    let hit = 0;
    for (let k = 0; k < SIM_SAMPLES; k++) if (meets(rollLines(o, sim.lines.map((l) => l && { ...l }), sim.locked), sim.target)) hit++;
    return { p: hit / SIM_SAMPLES, cost: rollCost(o, { rolls: 1 }) };
  }

  function renderSim(o) {
    const box = $('#ol-sim');
    if (!box) return;
    const sim = c.sim || (c.sim = newSim(o));
    if (!sim.estimate && sim.target.length) sim.estimate = estimate(o, sim);
    const name = (t) => esc(SIM_SHORT[o.types[t].functionType] || o.types[t].name.replace(/^Increased /, ''));
    const value = (l) => o.types[l.t].tiers.flatMap((x) => x.levels).find((x) => x.level === l.lv)?.value;
    const moduleName = o.costs.modify[0]?.cost[0]?.item || 'Custom Module';
    const lockName = o.costs.lock.flatMap((r) => r.lock)[0]?.cost[0]?.item || 'Custom Lock';
    const next = rollCost(o, sim);
    const costText = (k) => [k.modules || !k.customs ? `×${fmtNum(k.modules)} ${esc(moduleName)}` : '', k.customs ? `×${fmtNum(k.customs)} ${esc(lockName)}` : ''].filter(Boolean).join(' + ');
    const lockM = lockCost(o, sim, 'module'), lockC = lockCost(o, sim, 'custom');
    const lockCell = (l, i) => {
      if (sim.locked[i]) return `<button class="nav-btn sim-lock active lock-${sim.locked[i]}" data-unlock="${i}" title="Unlock">${sim.locked[i] === 'custom' ? esc(lockName) : 'Locked'} ✕</button>`;
      if (!l) return '';
      return `<button class="nav-btn sim-lock" data-lock="${i}" data-kind="module" title="Lock with ${esc(moduleName)}s">Lock ×${lockM.modules}</button>
        <button class="nav-btn sim-lock lock-custom" data-lock="${i}" data-kind="custom" title="One-time ${esc(lockName)}, released after the next roll">${esc(lockName)} ×${lockC.customs}</button>`;
    };
    const maxLv = o.types[0].tiers.reduce((n, t) => n + t.levels.length, 0);
    const est = sim.estimate;
    const met = meets(sim.lines, sim.target);
    box.innerHTML = `<h3>Roll simulator</h3>
      <div class="table-scroll"><table class="roster keep-cols">
        <thead><tr><th>Effect</th><th class="num">Lv</th><th class="num">%</th><th>Lock</th></tr></thead>
        <tbody>${sim.lines.map((l, i) => `<tr><td style="white-space:nowrap">${l ? name(l.t) : '—'}</td>
          <td class="num">${l ? l.lv : '—'}</td><td class="num">${l ? value(l) : '—'}</td>
          <td><div class="sim-locks">${lockCell(l, i)}</div></td></tr>`).join('')}
        </tbody></table></div>
      <div class="sim-actions">
        <button class="nav-btn" data-roll="1">Roll</button><button class="nav-btn" data-roll="10">×10</button><button class="nav-btn" data-roll="100">×100</button>
        <button class="nav-btn" id="sim-until" ${sim.target.length ? '' : 'disabled'}>Roll until target</button>
        <button class="nav-btn" id="sim-reset">Reset</button>
      </div>
      <dl class="facts">
        <dt>Rolls</dt><dd>${fmtNum(sim.rolls)}</dd>
        <dt>Spent</dt><dd>${costText({ modules: sim.modules, customs: sim.customs })}</dd>
        <dt>Next roll</dt><dd>${costText(next)}${sim.locked.includes('custom') ? ` <span class="key">· ${esc(lockName)} released after it</span>` : ''}</dd>
        ${sim.untilMsg ? `<dt>Last run</dt><dd>${esc(sim.untilMsg)}</dd>` : ''}
      </dl>
      <div class="subhead">Target${met ? ' <span class="ok-tag">met</span>' : ''}</div>
      <div class="sim-target">${sim.target.map((g, i) => `<div class="sim-cond">
          <select data-tt="${i}">${o.types.map((t, k) => `<option value="${k}" ${k === g.t ? 'selected' : ''}>${name(k)}</option>`).join('')}</select>
          <label class="key">Lv ≥ <input type="number" data-tl="${i}" value="${g.lv}" min="1" max="${maxLv}"></label>
          <button class="link-btn" data-tx="${i}">remove</button></div>`).join('')}
        ${sim.target.length < o.slots.length ? '<button class="link-btn" id="sim-add">+ add condition</button>' : ''}
      </div>
      ${est ? `<p class="key">Next roll with these locks: ${est.p ? `≈ ${fmtPct(est.p * 100, 3)}, about 1 in ${fmtNum(Math.round(1 / est.p))} rolls (≈ ${fmtShort(Math.round(est.cost.modules / est.p))} ${esc(moduleName)}s${est.cost.customs ? `, ${fmtShort(Math.round(est.cost.customs / est.p))} ${esc(lockName)}s` : ''})` : `not reached in ${fmtNum(SIM_SAMPLES)} sampled rolls`}.</p>` : ''}
      ${sim.history.length ? `<div class="subhead">Last rolls</div><div class="table-scroll"><table class="roster keep-cols">
        <thead><tr><th class="num">#</th>${o.slots.map((_, i) => `<th>Line ${i + 1}</th>`).join('')}</tr></thead>
        <tbody>${sim.history.map((h) => `<tr><td class="num">${fmtNum(h.n)}</td>${h.lines.map((l) => `<td style="white-space:nowrap">${l ? `${name(l.t)} ${l.lv}` : '—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}
      <p class="key note">From the data: line chances ${o.slots.map((x) => fmtPct(x)).join(' / ')}, the effect and tier weights in the tables below, and the costs. Game rules (not in the data): an effect never appears twice on one piece, and the first roll after Reset (Modify gear) gives line 1 an effect at exactly Lv ${o.types[0].tiers[o.types[0].tiers.length - 1].levels[0].level}. Assumed: the levels inside a tier are equally likely. Each roll costs ×${changeCost(o, 0)} ${esc(moduleName)}. Locking a line is paid once, by how many lines are already locked (${o.costs.lock.map((r) => r.level).join(' / ')}): ${o.costs.lock.map((r) => `×${changeCost(o, r.level)}`).join(' / ')} ${esc(moduleName)}s, or ${o.costs.lock.map((r) => `×${customLockCost(o, r.level)}`).join(' / ')} ${esc(lockName)}s. ${esc(moduleName)} locks stay; a ${esc(lockName)} is a temporary one-time lock, released after the next roll (×10, ×100 and Roll until keep it for their first roll only). The estimate samples ${fmtNum(SIM_SAMPLES)} rolls.</p>`;

    const update = () => { sim.estimate = null; renderSim(o); };
    box.querySelectorAll('[data-roll]').forEach((b) => b.onclick = () => {
      for (let k = 0; k < Number(b.dataset.roll); k++) doRoll(o, sim);
      sim.untilMsg = null;
      renderSim(o);
    });
    box.querySelectorAll('[data-lock]').forEach((b) => b.onclick = () => { lockLine(o, sim, Number(b.dataset.lock), b.dataset.kind); update(); });
    box.querySelectorAll('[data-unlock]').forEach((b) => b.onclick = () => { sim.locked[b.dataset.unlock] = false; update(); });
    $('#sim-until').onclick = () => {
      if (meets(sim.lines, sim.target)) { sim.untilMsg = 'Target already met.'; return renderSim(o); }
      const start = sim.rolls, spent = { modules: sim.modules, customs: sim.customs };
      while (sim.rolls - start < SIM_CAP) { doRoll(o, sim); if (meets(sim.lines, sim.target)) break; }
      const n = sim.rolls - start;
      sim.untilMsg = meets(sim.lines, sim.target)
        ? `Target met after ${fmtNum(n)} roll${n === 1 ? '' : 's'} (${fmtNum(sim.modules - spent.modules)} ${moduleName}s${sim.customs - spent.customs ? `, ${fmtNum(sim.customs - spent.customs)} ${lockName}s` : ''}).`
        : `Stopped after ${fmtNum(n)} rolls without meeting the target.`;
      renderSim(o);
    };
    $('#sim-reset').onclick = () => { c.sim = { ...newSim(o), target: sim.target }; renderSim(o); };
    box.querySelectorAll('[data-tt]').forEach((el) => el.onchange = () => { sim.target[el.dataset.tt].t = Number(el.value); update(); });
    box.querySelectorAll('[data-tl]').forEach((el) => el.onchange = () => { sim.target[el.dataset.tl].lv = Math.max(1, Math.min(maxLv, Number(el.value) || 1)); update(); });
    box.querySelectorAll('[data-tx]').forEach((el) => el.onclick = () => { sim.target.splice(Number(el.dataset.tx), 1); update(); });
    $('#sim-add')?.addEventListener('click', () => { sim.target.push({ t: 0, lv: 11 }); update(); });
  }

  // With the favorite item toggle on, slots it replaces (1 = Skill 1, 2 = Skill 2, 3 = Burst) use its skills.
  function skillCards(x) {
    const lv = Math.min(c.skillLevel, 10);
    const useFavorite = x.favorite && c.favorite;
    return x.skills.map((base, i) => {
      const swap = useFavorite ? x.favorite.skills.find((f) => f.slot === i + 1) : null;
      const s = swap ? { ...base, levels: swap.levels, tags: swap.tags } : base;
      const level = s.levels[Math.min(lv, s.levels.length) - 1] || s.levels[0];
      if (!level) return '';
      return `<section class="card skill ${swap ? 'favorite-skill' : ''}"><h3>${esc(s.slot)}${swap ? ' <span class="tag fav-tag">FAVORITE ITEM</span>' : ''}${s.cooldown ? ` <span class="sub">${s.cooldown}s cooldown</span>` : ''}</h3>
        <div class="skill-name">${esc(level.name)} <span class="key">Lv ${level.level}</span></div>
        ${s.tags?.length ? `<div class="skill-tags">${s.tags.map((t) => `<span class="badge">${esc(t)}</span>`).join('')}</div>` : ''}
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

  // Voice actresses and the voice lines of the picked costume, grouped by the game's categories.
  // A costume without its own voice group in the data shows the default lines, and says so.
  function renderVoice(x) {
    const box = $('#voice-card');
    if (!box) return;
    const v = x.voices;
    const look = v.looks.find((k) => k.index === c.voiceLook) || v.looks[0];
    const own = !!look.lines;
    const lines = look.lines || v.looks[0].lines || [];
    const cats = [...new Set(lines.map((l) => l.category))];
    box.innerHTML = `<h3>Voice <span class="sub">${lines.length} lines</span></h3>
      ${v.cv.length ? `<dl class="facts">${v.cv.map((k) => `<dt>${esc(k.language)}</dt><dd>${esc(k.name)}</dd>`).join('')}</dl>` : ''}
      ${v.looks.length > 1 ? `<label class="level-pick">Costume <select id="voice-look">${v.looks.map((k) => `<option value="${k.index}" ${k === look ? 'selected' : ''}>${esc(k.name)}${k.lines ? '' : ' (default voice)'}</option>`).join('')}</select></label>` : ''}
      ${own ? '' : `<p class="key note">No voice lines of its own for ${esc(look.name)} in the data; showing the default lines.</p>`}
      ${cats.map((cat) => `<div class="subhead">${esc(cat)}</div>
        <div class="table-scroll"><table class="roster keep-cols voice-table"><thead><tr><th>When</th><th>Line</th></tr></thead><tbody>
        ${lines.filter((l) => l.category === cat).map((l) => `<tr><td>${esc(l.situation)}</td><td>${l.text ? esc(l.text) : '<span class="key">—</span>'}</td></tr>`).join('')}
        </tbody></table></div>`).join('')}
      <p class="key note">Text only; the voice audio isn't extracted. "Bond Lv. 10" lines unlock at that bond level.</p>`;
    $('#voice-look')?.addEventListener('change', (e) => { c.voiceLook = Number(e.target.value); renderVoice(x); });
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
        ${x.voices?.looks.length ? '<section class="card voice-card" id="voice-card"></section>' : ''}
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
    renderVoice(x);
    if (x.favorite) $('#fav-toggle').onchange = (e) => {
      c.favorite = e.target.checked; store.set('charFavorite', c.favorite);
      $('#skills').innerHTML = skillCards(x);
    };
  }

  return { enter, route, renderTree };
})();
