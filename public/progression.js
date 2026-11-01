// Nikke Library — progression: Outpost Defense income, Simulation Room rewards,
// character / Synchro Device level-up costs.
const Progression = (() => {
  const p = {
    outpost: null, simulation: null, levels: null, page: null,
    level: store.get('progOutpostLevel', 800),
    lessons: new Set(store.get('progLessons', [])),
    simSeason: null, // Overclock season shown (null = the rewards view)
    boosts: new Set(store.get('progBoosts', [])), // BoostManager ids toggled on
    from: store.get('progFrom', 1), to: store.get('progTo', 200),
  };
  const fmt = (n, d = 0) => Number(n).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d });
  const RES = {
    credit: 'Credits', battleData: 'Battle Data', commanderExp: 'Commander EXP', coreDust: 'Core Dust',
  };
  const TABS = [['outpost', 'Outpost'], ['simulation', 'Simulation Room'], ['levels', 'Level-up cost']];
  const head = (crumb, title, desc, extra = '') => `<div class="scene-head">
      <div class="crumb">${crumb.map(esc).join(' · ')}</div><div class="scene-title">${title}</div>
      ${desc ? `<p class="album-desc">${desc}</p>` : ''}${extra}</div>`;

  async function enter() {
    if (!p.outpost) p.outpost = await (await apiFetch('/api/progression/outpost')).json();
    renderTabs();
  }

  function renderTabs() {
    $('#cat-tabs').innerHTML = TABS.map(([id, label]) =>
      `<a class="cat-tab ${p.page === id ? 'active' : ''}" href="#/progression/${id}">${label}</a>`).join('');
  }

  function renderTree() {
    const link = (hash, label, meta, active) =>
      `<a class="scene-link ${active ? 'active' : ''}" href="${hash}"><span>${label}</span><span class="lines">${meta ?? ''}</span></a>`;
    let html = `<details class="group" open><summary>Progression</summary>
      ${TABS.map(([id, label]) => link(`#/progression/${id}`, label, '', p.page === id)).join('')}</details>`;
    if (p.page === 'simulation' && p.simulation) {
      html += `<details class="group" open><summary>Simulation Room</summary>
        ${link('#/progression/simulation', 'Rewards', '', p.simSeason == null)}</details>
        <details class="group" open><summary>Overclock seasons</summary>
        ${p.simulation.overclock.map((s) => link(`#/progression/simulation/season/${s.id}`, esc(s.name), `${s.penalties.length} penalties`, p.simSeason === s.id)).join('')}</details>`;
    }
    $('#tree').innerHTML = html;
  }

  async function route() {
    const m = location.hash.match(/^#\/progression\/(\w+)/);
    p.page = m && TABS.some(([id]) => id === m[1]) ? m[1] : 'outpost';
    const season = location.hash.match(/^#\/progression\/simulation\/season\/(\d+)/);
    p.simSeason = season ? Number(season[1]) : null;
    if (p.page === 'simulation' && !p.simulation) p.simulation = await (await apiFetch('/api/progression/simulation')).json();
    if (p.page === 'levels' && !p.levels) p.levels = await (await apiFetch('/api/progression/levels')).json();
    renderTabs();
    renderTree();
    ({ outpost: outpostPage, simulation: simulationPage, levels: levelsPage })[p.page]();
  }

  // ---------- Outpost ----------
  const clampLevel = (n) => Math.max(1, Math.min(p.outpost.levels.length, Math.round(Number(n) || 1)));
  const boostOf = (resource) => p.outpost.lessons.filter((l) => l.resource === resource && p.lessons.has(l.id)).reduce((s, l) => s + l.percent, 0);
  const rateAt = (level, resource, boosted) => {
    const base = p.outpost.levels[clampLevel(level) - 1][resource] || 0;
    return boosted ? base * (1 + boostOf(resource) / 100) : base;
  };
  // A resource case pays the hourly rate for its hours, rounded down.
  const caseValue = (c, boosted) => Math.floor(rateAt(p.level, c.resource, boosted) * c.hours);

  // One row per resource, one column per case length; each cell is the case's value with
  // the selected Tactics Academy boosts (unboosted value on hover).
  function casesCard(o) {
    const hours = [...new Set(o.cases.map((c) => c.hours))].sort((a, b) => a - b);
    const rows = [...new Set(o.cases.map((c) => c.resource))];
    const label = (r) => o.cases.find((c) => c.resource === r).name;
    return `<section class="card"><h3>Resource cases at level ${clampLevel(p.level)}</h3>
      <div class="table-scroll"><table class="roster keep-cols case-grid"><thead><tr><th>Resource</th>
        ${hours.map((h) => `<th class="num">${h}h</th>`).join('')}</tr></thead><tbody>
      ${rows.map((r) => `<tr><td>${esc(label(r))}${boostOf(r) ? ` <span class="key">+${fmt(boostOf(r))}%</span>` : ''}</td>
        ${hours.map((h) => {
          const c = o.cases.find((k) => k.resource === r && k.hours === h);
          return c ? `<td class="num" title="Without boosts: ${fmt(caseValue(c, false))}"><b>${fmt(caseValue(c, true))}</b><div class="key">${esc(c.rarity)}</div></td>`
            : '<td class="num key">—</td>';
        }).join('')}</tr>`).join('')}
      </tbody></table></div>
      <p class="key note">Case value = hourly rate × hours, rounded down, with the Tactics Academy lessons selected above. Hover a value to see it without boosts.</p></section>`;
  }

  function outpostPage() {
    const o = p.outpost;
    const row = o.levels[clampLevel(p.level) - 1];
    const resources = ['credit', 'battleData', 'commanderExp', 'coreDust'];
    const byRes = (r) => o.lessons.filter((l) => l.resource === r);
    $('#reader').innerHTML = head(['Progression'], 'Outpost Defense', 'Passive income per Outpost Defense level. The "In game" column is what the Outpost Defense screen shows (rounded down, per minute or per hour for Core Dust); storage holds 24 hours.',
      `<div class="toolbar"><label class="level-pick prog-level">Outpost level
        <input type="range" id="op-lv-range" min="1" max="${o.levels.length}" value="${clampLevel(p.level)}">
        <input type="number" id="op-lv" min="1" max="${o.levels.length}" value="${clampLevel(p.level)}"></label>
        <span class="key">≈ ${fmt((clampLevel(p.level) - 1) * 5)} stage clears (1 level per 5 clears)</span></div>`) + `
      <div class="stage-body">
        <section class="card"><h3>Tactics Academy boosts</h3>
          <div class="lesson-grid">${['credit', 'battleData', 'coreDust'].map((r) => `<div class="lesson-col"><div class="subhead">${RES[r]} <span class="key">+${fmt(boostOf(r))}%</span></div>
            ${byRes(r).map((l) => `<label class="toggle"><input type="checkbox" class="lesson" data-id="${l.id}" ${p.lessons.has(l.id) ? 'checked' : ''}> ${esc(l.className)}: +${l.percent}%</label>`).join('')}
            <button class="nav-btn lesson-all" data-res="${r}">All</button></div>`).join('')}</div></section>
        <section class="card"><h3>Income at level ${clampLevel(p.level)}</h3>
          <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th>Resource</th><th class="num">Per hour</th><th class="num">Boost</th><th class="num">Per hour (boosted)</th><th class="num">In game</th><th class="num">Full storage (24h)</th></tr></thead><tbody>
          ${resources.map((r) => {
            const boosted = rateAt(p.level, r, true);
            // The game shows Core Dust per hour and everything else per minute, rounded down.
            const inGame = r === 'coreDust' ? `${fmt(Math.floor(boosted))}/H` : `${fmt(Math.floor(boosted / 60))}/M`;
            return `<tr><td>${RES[r]}</td><td class="num">${fmt(rateAt(p.level, r, false), 2)}</td>
            <td class="num">${r === 'commanderExp' ? '—' : `+${fmt(boostOf(r))}%`}</td><td class="num">${fmt(boosted, 2)}</td>
            <td class="num"><b>${inGame}</b></td><td class="num">${fmt(Math.floor(boosted * o.storageHours))}</td></tr>`;
          }).join('')}
          </tbody></table></div>
          ${row.items.length ? `<div class="subhead">Item drops</div><div class="table-scroll"><table class="roster keep-cols"><thead><tr><th>Item</th><th class="num">Every</th><th class="num">Per 24h</th></tr></thead><tbody>
            ${row.items.map((i) => `<tr><td>${esc(i.name)} ×${i.amount}</td><td class="num">${i.everySec % 3600 ? `${fmt(i.everySec / 60)} min` : `${i.everySec / 3600} h`}</td>
              <td class="num">${fmt(Math.floor(86400 / i.everySec) * i.amount)}</td></tr>`).join('')}</tbody></table></div>` : ''}
        </section>
        ${casesCard(o)}
      </div>`;
    const setLevel = (v) => { p.level = clampLevel(v); store.set('progOutpostLevel', p.level); outpostPage(); };
    $('#op-lv-range').oninput = (e) => setLevel(e.target.value);
    $('#op-lv').onchange = (e) => setLevel(e.target.value);
    const saveLessons = () => { store.set('progLessons', [...p.lessons]); outpostPage(); };
    $('#reader').querySelectorAll('.lesson').forEach((c) => c.onchange = () => {
      if (c.checked) p.lessons.add(Number(c.dataset.id)); else p.lessons.delete(Number(c.dataset.id));
      saveLessons();
    });
    $('#reader').querySelectorAll('.lesson-all').forEach((b) => b.onclick = () => {
      const ids = byRes(b.dataset.res).map((l) => l.id);
      const allOn = ids.every((id) => p.lessons.has(id));
      for (const id of ids) if (allOn) p.lessons.delete(id); else p.lessons.add(id);
      saveLessons();
    });
  }

  // ---------- Simulation Room ----------
  // Reward tables get one column per item. Each row is { cells: [...leading cells], parts: [{ reward, bonus }] }:
  // amounts from every part are summed per item, and bonus parts (boosts) are marked "+n".
  function rewardColumns(rows) {
    const cols = [];
    for (const r of rows) for (const part of r.parts) for (const i of part.reward?.items || []) if (!cols.includes(i.name)) cols.push(i.name);
    const cellFor = (r, name) => {
      let base = 0, extra = 0, chance = null, caseId = null;
      for (const part of r.parts) for (const i of part.reward?.items || []) {
        if (i.name !== name) continue;
        if (part.bonus) extra += i.amount; else base += i.amount;
        if (i.chance < 100) chance = i.chance;
        caseId = i.id;
      }
      if (!base && !extra) return '<td class="num key">—</td>';
      // Resource cases also show what they're worth at the chosen outpost level.
      const c = p.outpost.cases.find((k) => k.id === caseId);
      const worth = c ? `<span class="cell-sub">≈ ${fmt(caseValue(c, false) * (base + extra))} ${RES[c.resource]}</span>` : '';
      return `<td class="num"><b>${fmt(base + extra)}</b>${extra ? `<span class="cell-bonus">+${fmt(extra)}</span>` : ''}${chance != null ? `<span class="cell-sub">${+chance.toFixed(2)}%</span>` : ''}${worth}</td>`;
    };
    return { cols, cellFor };
  }

  function rewardTable(headCells, rows) {
    const { cols, cellFor } = rewardColumns(rows);
    return `<div class="table-scroll"><table class="roster keep-cols reward-cols"><thead><tr>${headCells.join('')}
      ${cols.map((c) => `<th class="num item-col">${esc(c)}</th>`).join('')}</tr></thead><tbody>
      ${rows.map((r) => `<tr>${r.cells.join('')}${cols.map((c) => cellFor(r, c)).join('')}</tr>`).join('')}
      </tbody></table></div>`;
  }

  function simulationPage() {
    if (p.simSeason != null) return seasonPage();
    const s = p.simulation;
    const ocBoosts = s.boosts.filter((b) => b.overclock);
    const clearRows = s.difficulties.flatMap((d) => d.chapters.map((c, i) => ({
      cells: [`<td>${i === 0 ? `<b>${esc(d.name)}</b>` : ''}</td>`, `<td class="num">${c.chapter}</td>`],
      parts: [{ reward: c.reward }],
    })));
    const ocRows = s.overclockRewards.map((l) => ({
      cells: [`<td class="num"><b>${l.level}</b></td>`],
      parts: [{ reward: l.reward }, ...ocBoosts.filter((b) => p.boosts.has(b.id)).map((b) => ({ reward: l.boosted[b.id], bonus: true }))],
    }));
    $('#reader').innerHTML = head(['Progression'], 'Simulation Room · Rewards',
      `Clear rewards and Overclock rewards, one column per item. Resource cases are valued at Outpost level ${clampLevel(p.level)} (set on the Outpost tab).`) + `
      <div class="stage-body">
        <section class="card"><h3>Synchro Device boosts</h3>
          <div class="boost-list">${s.boosts.map((b) => `<label class="toggle boost-item">
            ${b.overclock ? `<input type="checkbox" class="boost" data-id="${b.id}" ${p.boosts.has(b.id) ? 'checked' : ''}>` : '<span class="boost-dot"></span>'}
            <span><b>${esc(b.name)}</b> <span class="key">Synchro Lv ${b.synchroLevel}</span><br><span class="key">${esc(b.description)}</span></span></label>`).join('')}</div>
          <p class="key note">Overclock boosts add extra rewards on top (shown as +n in the Overclock table). Interception boosts add battle attempts, not rewards.</p></section>
        <section class="card"><h3>Clear rewards</h3>${rewardTable(['<th>Difficulty</th>', '<th class="num">Chapter</th>'], clearRows)}</section>
        <section class="card"><h3>Overclock rewards <span class="sub">${ocRows.length} levels</span></h3>
          ${rewardTable(['<th class="num">OC level</th>'], ocRows)}
          <p class="key note">Every Overclock season stores the same rewards, so they are shown once.</p></section>
      </div>`;
    $('#reader').querySelectorAll('.boost').forEach((c) => c.onchange = () => {
      const id = Number(c.dataset.id);
      if (c.checked) p.boosts.add(id); else p.boosts.delete(id);
      store.set('progBoosts', [...p.boosts]);
      const y = $('#reader').scrollTop; simulationPage(); $('#reader').scrollTop = y;
    });
  }

  // An Overclock season: its penalty groups, each with its tiers (I/II/III).
  function seasonPage() {
    const season = p.simulation.overclock.find((s) => s.id === p.simSeason);
    if (!season) { $('#reader').innerHTML = '<div class="error">Season not found.</div>'; return; }
    $('#reader').innerHTML = head(['Progression', 'Simulation Room'], esc(season.name),
      `${season.penalties.length} penalty groups${season.main ? '' : ' · beta season'}. Each tier adds Overclock levels.`) + `
      <div class="stage-body"><section class="card">
        <div class="table-scroll"><table class="roster keep-cols penalty-table"><thead><tr><th class="num">#</th><th>Penalty</th><th class="num">OC levels</th><th>Effect</th></tr></thead><tbody>
        ${season.penalties.flatMap((g) => g.tiers.map((t, i) => `<tr class="${i === 0 ? 'group-start' : ''}">
          <td class="num key">${i === 0 ? g.order : ''}</td>
          <td><b>${esc(t.name)}</b>${t.fixed ? ' <span class="tag">FIXED</span>' : ''}${g.infinite ? ' <span class="tag">REPEATABLE</span>' : ''}</td>
          <td class="num">+${t.level}</td><td class="key">${esc(t.description)}</td></tr>`)).join('')}
        </tbody></table></div></section></div>`;
  }

  // ---------- Level-up cost ----------
  // Row L is the cost to go from level L to L+1. 1-200: character levels; 201+: Synchro Device enhancement.
  function levelsPage() {
    const L = p.levels;
    const max = L[L.length - 1].level + 1;
    const from = Math.max(1, Math.min(max - 1, p.from));
    const to = Math.max(from + 1, Math.min(max, p.to));
    const span = L.filter((r) => r.level >= from && r.level < to);
    const sum = (k) => span.reduce((s, r) => s + r[k], 0);
    const needSynchro = Math.max(0, ...span.filter((r) => !r.synchro).map((r) => r.needSynchro));
    const milestones = L.filter((r) => !r.synchro && r.coreDust > 0 && (r.level % 10 === 0 || r.level === 200));
    // Synchro Device levels share costs over long runs: one row per run of equal cost.
    const runs = [];
    for (const r of L.filter((x) => x.synchro)) {
      const last = runs[runs.length - 1];
      if (last && last.to === r.level - 1 && last.credit === r.credit && last.battleData === r.battleData && last.coreDust === r.coreDust) last.to = r.level;
      else runs.push({ from: r.level, to: r.level, credit: r.credit, battleData: r.battleData, coreDust: r.coreDust });
    }
    const runCell = (run, k) => `<td class="num">${fmt(run[k])}<div class="key">${fmt(run[k] * (run.to - run.from + 1))} total</div></td>`;
    $('#reader').innerHTML = head(['Progression'], 'Level-up cost',
      'Levels 1–200 are character levels (each needs a minimum synchro level). Levels 201+ are Synchro Device enhancement levels.') + `
      <div class="stage-body">
        <section class="card"><h3>Calculator</h3>
          <div class="cp-grid"><label>From level <input type="number" id="lv-from" min="1" max="${max - 1}" value="${from}"></label>
            <label>To level <input type="number" id="lv-to" min="2" max="${max}" value="${to}"></label></div>
          <div class="stat-grid"><div><span class="key">Credits</span><b>${fmt(sum('credit'))}</b></div>
            <div><span class="key">Battle Data</span><b>${fmt(sum('battleData'))}</b></div><div><span class="key">Core Dust</span><b>${fmt(sum('coreDust'))}</b></div></div>
          <p class="key note">${span.length} level-ups from Lv ${from} to Lv ${to}${needSynchro ? ` · needs Synchro Device level ${needSynchro}+ for the character levels` : ''}${to > 201 ? ' · includes Synchro Device enhancement levels' : ''}.</p>
        </section>
        <section class="card"><h3>Synchro Device upgrade cost <span class="sub">${runs.length} cost tiers</span></h3>
          <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th class="num">Levels</th><th class="num">Level-ups</th><th class="num">Credits / level</th><th class="num">Battle Data / level</th><th class="num">Core Dust / level</th></tr></thead><tbody>
          ${runs.map((run) => `<tr><td class="num">${run.from} → ${run.to + 1}</td><td class="num">${run.to - run.from + 1}</td>
            ${runCell(run, 'credit')}${runCell(run, 'battleData')}${runCell(run, 'coreDust')}</tr>`).join('')}
          </tbody></table></div><p class="key note">Every level in a row costs the same; "total" is the whole row.</p></section>
        <section class="card"><h3>Character Core Dust levels <span class="sub">${milestones.length}</span></h3>
          <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th class="num">Level</th><th class="num">Needs synchro</th><th class="num">Credits</th><th class="num">Battle Data</th><th class="num">Core Dust</th></tr></thead><tbody>
          ${milestones.map((r) => `<tr><td class="num">${r.level} → ${r.level + 1}</td>
            <td class="num">${r.needSynchro}</td><td class="num">${fmt(r.credit)}</td><td class="num">${fmt(r.battleData)}</td><td class="num">${fmt(r.coreDust)}</td></tr>`).join('')}
          </tbody></table></div><p class="key note">Character levels where Core Dust is needed, every 10 levels.</p></section>
      </div>`;
    const save = () => { store.set('progFrom', p.from); store.set('progTo', p.to); levelsPage(); };
    $('#lv-from').onchange = (e) => { p.from = Number(e.target.value) || 1; save(); };
    $('#lv-to').onchange = (e) => { p.to = Number(e.target.value) || 2; save(); };
  }

  return { enter, route, renderTree };
})();
