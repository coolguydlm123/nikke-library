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
    $('#tree').innerHTML = corps.map((corp) => {
      const members = list.filter((x) => x.corporation === corp);
      return `<details class="group" open><summary>${esc(corp)}<span class="count">${members.length}</span></summary>
        ${members.map((x) => `<a class="scene-link char-link ${c.current?.code === x.code ? 'active' : ''}" href="${href(x.code)}">
          ${x.element[0] ? `<span class="elem elem-${esc(x.element[0].toLowerCase())}" title="${esc(x.element.join(', '))}"></span>` : ''}
          <span>${esc(x.name)}${x.hasFavorite ? ' <span class="fav-mark" title="Has a favorite item">★</span>' : ''}</span><span class="lines">${esc(x.weapon || '')} · ${esc(x.burst)}</span></a>`).join('')}
      </details>`;
    }).join('') || '<p class="key" style="padding:12px">No matches.</p>';
    $('#tree .scene-link.active')?.scrollIntoView({ block: 'nearest' });
  }

  async function route() {
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
      <p>Pick a Nikke from the left for skills, weapon and stories.</p></div>`;
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
      <div class="subhead">Overload lines</div>
      <div class="cp-ol">${v.ol.map((l, i) => `<div class="cp-ol-line"><span class="key">${['Head', 'Body', 'Arm', 'Leg'][Math.floor(i / 3)]} ${i % 3 + 1}</span>
        <select class="cp-ol-type" data-i="${i}"><option value="none" ${l.type === 'none' ? 'selected' : ''}>—</option>
          <option value="other" ${l.type === 'other' ? 'selected' : ''}>Stat line</option><option value="elemental" ${l.type === 'elemental' ? 'selected' : ''}>Elemental dmg</option></select>
        <input type="number" class="cp-ol-lv" data-i="${i}" value="${l.lv}" min="1" max="15" ${l.type === 'none' ? 'disabled' : ''}></div>`).join('')}</div>
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
        <section class="card"><h3>Profile</h3>
          ${x.description ? `<p class="prose">${esc(x.description)}</p>` : ''}
          <dl class="facts">
            ${x.squad ? `<dt>Squad</dt><dd>${esc(x.squad.name)}${x.squad.info ? `<div class="key">${esc(x.squad.info)}</div>` : ''}</dd>` : ''}
            <dt>Manufacturer</dt><dd>${esc(x.corporation)}${x.overspec ? ' · Overspec' : ''}</dd>
            <dt>Critical</dt><dd>${x.critical.rate}% rate · ${x.critical.damage}% damage</dd>
          </dl>
        </section>
        ${w ? `<section class="card"><h3>Weapon</h3>
          <div class="skill-name">${esc(w.name)} <span class="key">${esc(w.typeName)} (${esc(w.type)}) · ${esc(w.attackType)}</span></div>
          <div class="stat-grid weapon-grid">
            <div><span class="key">Weapon type</span><b>${esc(w.type)}</b></div>
            <div><span class="key">Control</span><b>${esc(w.control)}</b></div>
            <div><span class="key">Damage</span><b>${w.damage}%</b></div>
            ${w.pellets > 1 ? `<div><span class="key">Pellets</span><b>${w.pellets}</b></div>` : ''}
            <div><span class="key">Ammo</span><b>${w.ammo}</b></div>
            <div><span class="key">Reload</span><b>${w.reload}s</b></div>
            <div><span class="key">Burst / shot</span><b>${+w.burstPerShot.toFixed(4)}%</b></div>
            <div><span class="key">Burst / shot on target</span><b>${+w.burstPerShotTarget.toFixed(4)}%</b></div>
            ${w.charge ? `<div><span class="key">Charge time</span><b>${w.charge.time}s</b></div>
              <div><span class="key">Full charge damage</span><b>${w.charge.fullDamage}%</b></div>
              <div><span class="key">Full charge burst</span><b>${w.charge.fullBurst}%</b></div>` : ''}
            <div><span class="key">Core damage</span><b>${w.coreDamage}%</b></div>
          </div>
          <div class="skill-desc">${richText(w.description)}</div>
          ${w.typeInfo ? `<div class="weapon-type-info"><b>${esc(w.typeName)}</b> · ${esc(w.typeInfo.description)}
            <div class="key">${[['Ammo', w.typeInfo.ammo], ['Reload', w.typeInfo.reload], ['Fire rate', w.typeInfo.fireRate], ['Range', w.typeInfo.range]]
              .filter(([, v]) => v).map(([k, v]) => `${k}: ${esc(v)}`).join(' · ')}</div></div>` : ''}
          <p class="key note">Burst gauge per shot as stored ÷ 10,000; "on target" is the value when the shot hits the target.</p></section>` : ''}
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
          <div class="rewards">${x.costumes.map((k) => `<div class="reward costume"><span class="reward-name">${esc(k.name)}</span>
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
