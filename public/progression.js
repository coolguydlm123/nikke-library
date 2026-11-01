// Nikke Library — progression: Outpost Defense income, Simulation Room rewards,
// character / Synchro Device level-up costs.
const Progression = (() => {
  const p = {
    outpost: null, simulation: null, levels: null, page: null,
    level: store.get('progOutpostLevel', 800),
    lessons: new Set(store.get('progLessons', [])),
    caseHours: store.get('progCaseHours', 24), allStep: store.get('progAllStep', 1), // all-levels table
    simSeason: null, // Overclock season shown (null = the rewards view)
    boosts: new Set(store.get('progBoosts', [])), // BoostManager ids toggled on
    from: store.get('progFrom', 1), to: store.get('progTo', 200),
  };
  // Cached formatters: toLocaleString builds a new one per call, too slow for the 800-level table.
  const formats = {};
  const fmt = (n, d = 0) => (formats[d] ||= new Intl.NumberFormat('en-US', { maximumFractionDigits: d, minimumFractionDigits: d })).format(Number(n));
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
      <div class="table-scroll"><table class="roster keep-cols sticky-first"><thead><tr><th>Case</th><th class="num">Boost</th>
        ${hours.map((h) => `<th class="num">${h}h</th>`).join('')}</tr></thead><tbody>
      ${rows.map((r) => `<tr><td>${esc(label(r))}</td><td class="num">${fmtPct(boostOf(r), 0)}</td>
        ${hours.map((h) => {
          const c = o.cases.find((k) => k.resource === r && k.hours === h);
          return c ? `<td class="num" title="Without boosts: ${fmtNum(caseValue(c, false))}">${fmtNum(caseValue(c, true))}</td>` : '<td class="num">—</td>';
        }).join('')}</tr>`).join('')}
      </tbody></table></div>
      <p class="key note">Case value = hourly rate × hours, rounded down, with the boosts selected above. Hover a value to see it without boosts.</p></section>`;
  }

  // Item drop columns for the all-levels table: one per item family ("Equipment Reward Lv. 27"
  // and "Lv. 28" are one family), with a level column for families that have levels.
  const dropFamily = (name) => name.replace(/^Outpost Defense\s+/, '').replace(/\s*Lv\.\s*\d+$/, '');
  const dropLevel = (name) => name.match(/Lv\.\s*(\d+)$/)?.[1];
  const perDay = (i) => Math.floor(86400 / i.everySec) * i.amount;

  // Every outpost level: hourly rates and case values (with the selected boosts), the stage
  // clears needed, and how many of each item drop a day.
  function allLevelsCard(o) {
    const hours = [...new Set(o.cases.map((c) => c.hours))].sort((a, b) => a - b);
    if (!hours.includes(p.caseHours)) p.caseHours = hours[hours.length - 1];
    const caseRes = [...new Set(o.cases.map((c) => c.resource))];
    const rateRes = ['credit', 'battleData', 'commanderExp', 'coreDust'];
    const levels = p.allStep === 10 ? o.levels.filter((l) => l.level === 1 || l.level % 10 === 0) : o.levels;
    const families = [];
    for (const l of o.levels) for (const i of l.items) {
      const f = families.find((x) => x.name === dropFamily(i.name));
      if (f) f.leveled ||= !!dropLevel(i.name); else families.push({ name: dropFamily(i.name), leveled: !!dropLevel(i.name) });
    }
    // The level-up reward is a column only if it varies.
    const rewards = [...new Set(o.levels.map((l) => l.reward).filter(Boolean))];
    let clears = 0;
    const totalClears = o.levels.map((l) => (clears += l.clears));
    const caseFor = Object.fromEntries(caseRes.map((r) => [r, o.cases.find((k) => k.resource === r && k.hours === p.caseHours)]));
    const dropCells = (l) => families.map((f) => {
      const i = l.items.find((x) => dropFamily(x.name) === f.name);
      return `${f.leveled ? `<td class="num">${i ? dropLevel(i.name) ?? '—' : '—'}</td>` : ''}<td class="num">${i ? fmtNum(perDay(i)) : '—'}</td>`;
    }).join('');
    return `<section class="card"><h3>All outpost levels <span class="sub">${o.levels.length}</span></h3>
      <div class="toolbar">
        <span class="key">Case</span><div class="seg" id="op-case-hours">${hours.map((h) => `<button data-h="${h}" class="${h === p.caseHours ? 'active' : ''}">${h}h</button>`).join('')}</div>
        <div class="seg" id="op-all-step"><button data-s="1" class="${p.allStep === 10 ? '' : 'active'}">All</button><button data-s="10" class="${p.allStep === 10 ? 'active' : ''}">Every 10</button></div>
        <button class="nav-btn" id="op-jump">Go to Lv ${clampLevel(p.level)}</button></div>
      <div class="table-scroll outpost-all"><table class="roster keep-cols sticky-first"><thead><tr><th class="num">Lv</th><th class="num">Clears</th>
        ${rateRes.map((r) => `<th class="num">${RES[r]} / h</th>`).join('')}
        ${caseRes.map((r) => `<th class="num">${RES[r]} ${p.caseHours}h</th>`).join('')}
        ${families.map((f) => `${f.leveled ? `<th class="num">${esc(f.name)} Lv</th>` : ''}<th class="num">${esc(f.name)} / day</th>`).join('')}
        ${rewards.length > 1 ? '<th>Level-up reward</th>' : ''}</tr></thead><tbody>
      ${levels.map((l) => `<tr data-lv="${l.level}" class="${l.level === clampLevel(p.level) ? 'is-target' : ''}"><td class="num"><b>${l.level}</b></td>
        <td class="num">${fmtNum(totalClears[l.level - 1])}</td>
        ${rateRes.map((r) => `<td class="num">${fmtShort(Math.floor(rateAt(l.level, r, true)))}</td>`).join('')}
        ${caseRes.map((r) => `<td class="num">${caseFor[r] ? fmtShort(Math.floor(rateAt(l.level, r, true) * caseFor[r].hours)) : '—'}</td>`).join('')}
        ${dropCells(l)}${rewards.length > 1 ? `<td>${esc(l.reward || '—')}</td>` : ''}</tr>`).join('')}
      </tbody></table></div>
      <p class="key note">Rates (rounded down) and case values include the boosts selected above; hover a short value for the exact one. Clears = total campaign stage clears to reach the level. Click a row to select that level.${rewards.length === 1 ? ` Every level-up pays ${esc(rewards[0])}.` : ''}</p></section>`;
  }

  function incomeCard(o) {
    const row = o.levels[clampLevel(p.level) - 1];
    const resources = ['credit', 'battleData', 'commanderExp', 'coreDust'];
    return `<section class="card"><h3>Income at level ${clampLevel(p.level)}</h3>
      <div class="table-scroll"><table class="roster keep-cols sticky-first"><thead><tr><th>Resource</th><th class="num">Base / h</th><th class="num">Boost</th><th class="num">Per hour</th><th class="num">In game</th><th class="num">24h storage</th></tr></thead><tbody>
      ${resources.map((r) => {
        const boosted = rateAt(p.level, r, true);
        // The game shows Core Dust per hour and everything else per minute, rounded down.
        const inGame = r === 'coreDust' ? `${fmtNum(Math.floor(boosted))}/H` : `${fmtNum(Math.floor(boosted / 60))}/M`;
        return `<tr><td>${RES[r]}</td><td class="num">${fmt(rateAt(p.level, r, false), 2)}</td>
          <td class="num">${r === 'commanderExp' ? '—' : fmtPct(boostOf(r), 0)}</td><td class="num">${fmt(boosted, 2)}</td>
          <td class="num"><b>${inGame}</b></td><td class="num">${fmtShort(Math.floor(boosted * o.storageHours))}</td></tr>`;
      }).join('')}
      </tbody></table></div>
      ${row.items.length ? `<div class="table-scroll"><table class="roster keep-cols"><thead><tr><th>Item drop</th><th class="num">Every</th><th class="num">Per day</th></tr></thead><tbody>
        ${row.items.map((i) => `<tr><td>${esc(i.name)} ×${i.amount}</td><td class="num">${fmtDur(i.everySec)}</td><td class="num">${fmtNum(perDay(i))}</td></tr>`).join('')}
      </tbody></table></div>` : ''}
      <p class="key note">"In game" is what the Outpost Defense screen shows: rounded down, per minute (per hour for Core Dust). Storage holds 24 hours.</p></section>`;
  }

  function outpostPage() {
    const o = p.outpost;
    const byRes = (r) => o.lessons.filter((l) => l.resource === r);
    $('#reader').innerHTML = head(['Progression'], 'Outpost Defense', 'Passive income per Outpost Defense level, with your Tactics Academy boosts.',
      `<div class="toolbar"><label class="level-pick prog-level">Outpost level
        <input type="range" id="op-lv-range" min="1" max="${o.levels.length}" value="${clampLevel(p.level)}">
        <input type="number" id="op-lv" min="1" max="${o.levels.length}" value="${clampLevel(p.level)}"></label>
        <span class="key" id="op-clears">≈ ${fmt((clampLevel(p.level) - 1) * 5)} stage clears (1 level per 5 clears)</span></div>`) + `
      <div class="stage-body">
        <section class="card"><h3>Tactics Academy boosts</h3>
          <div class="lesson-grid">${['credit', 'battleData', 'coreDust'].map((r) => `<div class="lesson-col"><div class="subhead">${RES[r]} <span class="key">+${fmt(boostOf(r))}%</span></div>
            ${byRes(r).map((l) => `<label class="toggle"><input type="checkbox" class="lesson" data-id="${l.id}" ${p.lessons.has(l.id) ? 'checked' : ''}> ${esc(l.className)}: +${l.percent}%</label>`).join('')}
            <button class="nav-btn lesson-all" data-res="${r}">All</button></div>`).join('')}</div></section>
        <div id="op-level-cards">${incomeCard(o)}${casesCard(o)}</div>
        ${allLevelsCard(o)}
      </div>`;
    // Re-render keeping the page and the all-levels table scrolled where they were.
    const rerender = () => {
      const y = $('#reader').scrollTop, box = $('#reader .outpost-all');
      const [top, left] = [box.scrollTop, box.scrollLeft];
      outpostPage();
      $('#reader').scrollTop = y;
      Object.assign($('#reader .outpost-all'), { scrollTop: top, scrollLeft: left });
    };
    // A level change only redraws the level cards and moves the highlight: laying out
    // the 800-row table again takes about a second, too slow while dragging the slider.
    const setLevel = (v) => {
      p.level = clampLevel(v);
      store.set('progOutpostLevel', p.level);
      $('#op-lv-range').value = $('#op-lv').value = p.level;
      $('#op-clears').textContent = `≈ ${fmt((p.level - 1) * 5)} stage clears (1 level per 5 clears)`;
      $('#op-level-cards').innerHTML = incomeCard(o) + casesCard(o);
      $('#op-jump').textContent = `Go to Lv ${p.level}`;
      $('#reader .outpost-all tr.is-target')?.classList.remove('is-target');
      $(`#reader .outpost-all tr[data-lv="${p.level}"]`)?.classList.add('is-target');
    };
    $('#op-case-hours').querySelectorAll('button').forEach((b) => b.onclick = () => { p.caseHours = Number(b.dataset.h); store.set('progCaseHours', p.caseHours); rerender(); });
    $('#op-all-step').querySelectorAll('button').forEach((b) => b.onclick = () => { p.allStep = Number(b.dataset.s); store.set('progAllStep', p.allStep); rerender(); });
    $('#reader .outpost-all tbody').onclick = (e) => { const tr = e.target.closest('tr[data-lv]'); if (tr) setLevel(tr.dataset.lv); };
    $('#op-jump').onclick = () => {
      const box = $('#reader .outpost-all'), tr = box.querySelector('tr.is-target');
      if (tr) box.scrollTop = tr.offsetTop - box.clientHeight / 2;
    };
    $('#op-lv-range').oninput = (e) => setLevel(e.target.value);
    $('#op-lv').onchange = (e) => setLevel(e.target.value);
    const saveLessons = () => { store.set('progLessons', [...p.lessons]); rerender(); };
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
      if (!base && !extra) return '<td class="num">—</td>';
      // One value per cell; the boost share, drop chance and what a resource case is worth
      // at the chosen outpost level go in the hover text.
      const c = p.outpost.cases.find((k) => k.id === caseId);
      const notes = [extra && `incl. +${fmtNum(extra)} from boosts`, chance != null && `${fmtPct(chance, 2)} chance`,
        c && `≈ ${fmtNum(caseValue(c, false) * (base + extra))} ${RES[c.resource]}`].filter(Boolean);
      return `<td class="num${extra ? ' prog-bonus' : ''}"${notes.length ? ` title="${esc(notes.join(' · '))}"` : ''}>${fmtNum(base + extra)}</td>`;
    };
    return { cols, cellFor };
  }

  function rewardTable(headCells, rows) {
    const { cols, cellFor } = rewardColumns(rows);
    return `<div class="table-scroll"><table class="roster keep-cols sticky-first reward-cols"><thead><tr>${headCells.join('')}
      ${cols.map((c) => `<th class="num item-col">${esc(c)}</th>`).join('')}</tr></thead><tbody>
      ${rows.map((r) => `<tr>${r.cells.join('')}${cols.map((c) => cellFor(r, c)).join('')}</tr>`).join('')}
      </tbody></table></div>`;
  }

  function simulationPage() {
    if (p.simSeason != null) return seasonPage();
    const s = p.simulation;
    const ocBoosts = s.boosts.filter((b) => b.overclock);
    const clearRows = s.difficulties.flatMap((d) => d.chapters.map((c) => ({
      cells: [`<td class="num">${d.id}-${c.chapter}</td>`],
      parts: [{ reward: c.reward }],
    })));
    const hasCase = (rows) => rows.some((r) => r.parts.some((part) => part.reward?.items.some((i) => p.outpost.cases.some((c) => c.id === i.id))));
    const ocRows = s.overclockRewards.map((l) => ({
      cells: [`<td class="num"><b>${l.level}</b></td>`],
      parts: [{ reward: l.reward }, ...ocBoosts.filter((b) => p.boosts.has(b.id)).map((b) => ({ reward: l.boosted[b.id], bonus: true }))],
    }));
    $('#reader').innerHTML = head(['Progression'], 'Simulation Room · Rewards', 'Clear and Overclock rewards, one column per item.') + `
      <div class="stage-body">
        <section class="card"><h3>Synchro Device boosts</h3>
          <div class="table-scroll"><table class="roster keep-cols prog-nowrap"><thead><tr><th>Boost</th><th class="num">Synchro Lv</th><th>Effect</th></tr></thead><tbody>
          ${s.boosts.map((b) => `<tr><td>${b.overclock ? `<label class="toggle"><input type="checkbox" class="boost" data-id="${b.id}" ${p.boosts.has(b.id) ? 'checked' : ''}> ${esc(b.name)}</label>` : esc(b.name)}</td>
            <td class="num">${b.synchroLevel}</td><td>${esc(b.description)}</td></tr>`).join('')}
          </tbody></table></div>
          <p class="key note">Tick an Overclock boost to add its extra rewards to the Overclock table (green values). Interception boosts add battle attempts, not rewards.</p></section>
        <section class="card"><h3>Clear rewards</h3>${rewardTable(['<th class="num">Diff-Ch</th>'], clearRows)}
          ${hasCase(clearRows) ? `<p class="key note">Hover a resource case for what it's worth at Outpost level ${clampLevel(p.level)} (set on the Outpost tab).</p>` : ''}</section>
        <section class="card"><h3>Overclock rewards <span class="sub">${ocRows.length} levels</span></h3>
          ${rewardTable(['<th class="num">OC level</th>'], ocRows)}
          <p class="key note">Every Overclock season stores the same rewards, so they are shown once. Hover a green value for the boost share.</p></section>
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
        <div class="table-scroll"><table class="roster keep-cols sticky-first penalty-table"><thead><tr><th>Penalty</th><th class="num">OC levels</th><th>Effect</th></tr></thead><tbody>
        ${season.penalties.flatMap((g) => g.tiers.map((t, i) => `<tr class="${i === 0 ? 'group-start' : ''}">
          <td>${esc(t.name)}${t.fixed ? ' <span class="tag">FIXED</span>' : ''}${g.infinite ? ' <span class="tag">REPEATABLE</span>' : ''}</td>
          <td class="num">+${t.level}</td><td>${esc(t.description)}</td></tr>`)).join('')}
        </tbody></table></div>
        <p class="key note">Penalties are grouped by type (line between groups), tiers in order. FIXED penalties are always on; REPEATABLE ones can be taken again.</p></section></div>`;
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
    const costs = ['credit', 'battleData', 'coreDust'];
    $('#reader').innerHTML = head(['Progression'], 'Level-up cost', 'Levels 1–200 are character levels; 201+ are Synchro Device enhancement levels.') + `
      <div class="stage-body">
        <section class="card"><h3>Calculator</h3>
          <div class="cp-grid"><label>From level <input type="number" id="lv-from" min="1" max="${max - 1}" value="${from}"></label>
            <label>To level <input type="number" id="lv-to" min="2" max="${max}" value="${to}"></label></div>
          <div class="stat-grid">${costs.map((k) => `<div><span class="key">${RES[k]}</span><b>${fmtNum(sum(k))}</b></div>`).join('')}</div>
          <p class="key note">${span.length} level-ups from Lv ${from} to Lv ${to}${needSynchro ? ` · needs Synchro Device level ${needSynchro}+ for the character levels` : ''}${to > 201 ? ' · includes Synchro Device enhancement levels' : ''}.</p>
        </section>
        <section class="card"><h3>Synchro Device upgrade cost <span class="sub">${runs.length} cost tiers</span></h3>
          <div class="table-scroll"><table class="roster keep-cols sticky-first"><thead><tr><th class="num">Levels</th><th class="num">Ups</th>
            ${costs.map((k) => `<th class="num">${RES[k]} / lv</th>`).join('')}${costs.map((k) => `<th class="num">${RES[k]} total</th>`).join('')}</tr></thead><tbody>
          ${runs.map((run) => `<tr><td class="num">${run.from}–${run.to + 1}</td><td class="num">${run.to - run.from + 1}</td>
            ${costs.map((k) => `<td class="num">${fmtShort(run[k])}</td>`).join('')}${costs.map((k) => `<td class="num">${fmtShort(run[k] * (run.to - run.from + 1))}</td>`).join('')}</tr>`).join('')}
          </tbody></table></div><p class="key note">Every level in a row costs the same; "total" is the whole row.</p></section>
        <section class="card"><h3>Character Core Dust levels <span class="sub">${milestones.length}</span></h3>
          <div class="table-scroll"><table class="roster keep-cols sticky-first"><thead><tr><th class="num">Level</th><th class="num">Synchro</th>${costs.map((k) => `<th class="num">${RES[k]}</th>`).join('')}</tr></thead><tbody>
          ${milestones.map((r) => `<tr><td class="num">${r.level}–${r.level + 1}</td><td class="num">${r.needSynchro}</td>
            ${costs.map((k) => `<td class="num">${fmtShort(r[k])}</td>`).join('')}</tr>`).join('')}
          </tbody></table></div><p class="key note">Character levels where Core Dust is needed, every 10 levels. Synchro = minimum Synchro Device level needed.</p></section>
      </div>`;
    const save = () => { store.set('progFrom', p.from); store.set('progTo', p.to); levelsPage(); };
    $('#lv-from').onchange = (e) => { p.from = Number(e.target.value) || 1; save(); };
    $('#lv-to').onchange = (e) => { p.to = Number(e.target.value) || 2; save(); };
  }

  return { enter, route, renderTree };
})();
