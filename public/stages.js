// Nikke Library — campaign stages and tower floors.
const Stages = (() => {
  const s = {
    catalogue: null,
    tab: store.get('stageTab', 'campaign'), // 'campaign' | 'tower'
    mode: store.get('stageMode', 'Normal'),  // campaign difficulty
    tower: store.get('stageTower', 'ALL'),   // tower sub-tab (TowerInfoTable id)
    current: null,
  };
  const FLOOR_BUCKET = 100;
  const fmt = (n) => Number(n).toLocaleString('en-US');
  const href = (kind, id) => `#/stage/${kind}/${id}`;

  async function enter() {
    if (!s.catalogue) s.catalogue = await (await apiFetch('/api/stages')).json();
    renderTabs();
    renderTree();
  }

  function renderTabs() {
    const modes = ['Normal', 'Hard', 'Story'];
    $('#cat-tabs').innerHTML = `
      <button class="cat-tab ${s.tab === 'campaign' ? 'active' : ''}" data-tab="campaign">Campaign<span class="n">${s.catalogue.chapters.length}</span></button>
      <button class="cat-tab ${s.tab === 'tower' ? 'active' : ''}" data-tab="tower">Towers<span class="n">${s.catalogue.towers.length}</span></button>
      ${s.tab === 'campaign' ? `<div class="mode-row">${modes.map((m) =>
        `<button class="mode-chip ${s.mode === m ? 'active' : ''}" data-mode="${m}">${m}</button>`).join('')}</div>`
        : `<div class="mode-row wrap">${s.catalogue.towers.map((t) =>
        `<button class="mode-chip ${s.tower === t.id ? 'active' : ''}" data-tower="${esc(t.id)}">${esc(towerShort(t.name))}</button>`).join('')}</div>`}`;
    $('#cat-tabs').querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => {
      s.tab = b.dataset.tab; store.set('stageTab', s.tab); renderTabs(); renderTree();
    });
    $('#cat-tabs').querySelectorAll('[data-mode]').forEach((b) => b.onclick = () => {
      s.mode = b.dataset.mode; store.set('stageMode', s.mode); renderTabs(); renderTree();
    });
    $('#cat-tabs').querySelectorAll('[data-tower]').forEach((b) => b.onclick = () => {
      s.tower = b.dataset.tower; store.set('stageTower', s.tower); renderTabs(); renderTree();
    });
  }

  const towerShort = (name) => name.replace(/\s+Tower$/i, '');

  function link(kind, item, label, meta) {
    const active = s.current && s.current.kind === kind && s.current.id === item.id;
    return `<a class="scene-link ${active ? 'active' : ''}" href="${href(kind, item.id)}">
      <span>${label}</span><span class="lines">${meta}</span></a>`;
  }

  function renderTree() {
    const f = state.filter;
    let html = '';
    if (s.tab === 'campaign') {
      for (const c of s.catalogue.chapters) {
        const list = c.modes[s.mode];
        if (!list) continue;
        const title = `Chapter ${c.chapter}${c.name ? ` · ${c.name}` : ''}`;
        const hit = !f || title.toLowerCase().includes(f);
        const stages = hit ? list : list.filter((x) => x.label.toLowerCase().includes(f));
        if (!stages.length) continue;
        const open = (f && !hit) || stages.some((x) => s.current?.id === x.id);
        html += `<details class="group" ${open ? 'open' : ''}><summary>${esc(title)}<span class="count">${stages.length}</span></summary>
          ${stages.map((x) => link('campaign', x, `${esc(x.label)}${x.category === 'Boss' ? ' <span class="tag boss">BOSS</span>' : ''}`, `Lv ${x.lv}`)).join('')}
        </details>`;
      }
    } else {
      // Floors are bucketed so 1,500-floor towers stay navigable; a number filters by floor.
      const floorQuery = /^\d+$/.test(f) ? Number(f) : null;
      for (const t of s.catalogue.towers.filter((x) => x.id === s.tower)) {
        const floors = floorQuery != null ? t.floors.filter((x) => String(x.floor).startsWith(f)) : t.floors;
        if (!floors.length) continue;
        const days = t.days.length === 7 ? 'Daily' : t.days.map((d) => 'SMTWTFS'[d]).join('');
        html += `<div class="tower-head">${esc(t.name)}<span>${days}${t.dailyLimit ? ` · ${t.dailyLimit}/day` : ''}</span></div>`;
        for (let i = 0; i < floors.length; i += FLOOR_BUCKET) {
          const chunk = floors.slice(i, i + FLOOR_BUCKET);
          const open = floorQuery != null || chunk.some((x) => s.current?.id === x.id);
          html += `<details class="group" data-tower="${esc(t.id)}" data-from="${chunk[0].floor}" data-to="${chunk[chunk.length - 1].floor}" ${open ? 'open' : ''}><summary>Floors ${chunk[0].floor}–${chunk[chunk.length - 1].floor}<span class="count">${chunk.length}</span></summary>
            ${open ? chunk.map((x) => link('tower', x, `Floor ${x.floor}`, `Lv ${x.lv}`)).join('') : ''}
          </details>`;
        }
      }
      // Floor links render only when a bucket is opened.
      setTimeout(() => $('#tree').querySelectorAll('details.group').forEach((d) => d.addEventListener('toggle', () => {
        if (d.open && !d.querySelector('a')) renderBucket(d);
      })));
    }
    $('#tree').innerHTML = html || '<p class="key" style="padding:12px">No matches.</p>';
    $('#tree .scene-link.active')?.scrollIntoView({ block: 'nearest' });
  }

  function renderBucket(details) {
    const from = Number(details.dataset.from), to = Number(details.dataset.to);
    const tower = s.catalogue.towers.find((t) => t.id === details.dataset.tower);
    details.insertAdjacentHTML('beforeend', tower.floors.filter((x) => x.floor >= from && x.floor <= to)
      .map((x) => link('tower', x, `Floor ${x.floor}`, `Lv ${x.lv}`)).join(''));
  }

  async function route() {
    const m = location.hash.match(/^#\/stage\/(campaign|tower)\/(\d+)/);
    if (!m) { s.current = null; renderTree(); return overview(); }
    const res = await apiFetch(`/api/stage?kind=${m[1]}&id=${m[2]}`);
    if (!res.ok) { $('#reader').innerHTML = `<div class="error">Stage not found.</div>`; return; }
    s.current = await res.json();
    const tab = s.current.kind;
    const mode = s.current.crumb[2];
    if (tab !== s.tab || (tab === 'campaign' && mode !== s.mode) || (tab === 'tower' && s.current.tower !== s.tower)) {
      s.tab = tab;
      if (tab === 'campaign') s.mode = mode; else s.tower = s.current.tower;
      renderTabs();
    }
    renderTree();
    renderStage();
    $('#reader').scrollTop = 0;
  }

  function overview() {
    const c = s.catalogue;
    const stageCount = c.chapters.reduce((n, ch) => n + Object.values(ch.modes).reduce((a, l) => a + l.length, 0), 0);
    $('#reader').innerHTML = `<div class="empty"><h1>Stages</h1>
      <p>${fmt(stageCount)} campaign stages across ${c.chapters.length} chapters, and ${c.towers.map((t) => `${esc(t.name)} (${fmt(t.floors.length)} floors)`).join(', ')}.</p>
      <p>Pick a stage or floor from the left to see its enemies, waves and rewards.</p></div>`;
  }

  const gradeClass = (g) => `grade-${String(g || '').toLowerCase()}`;

  function enemyChip(e) {
    return `<span class="enemy ${gradeClass(e.grade)}">
      ${e.element?.length ? `<span class="elem elem-${esc(e.element[0].toLowerCase())}" title="${esc(e.element.join(', '))}"></span>` : ''}
      ${gameImg('icons-monster', e.art, 'enemy-art')}<span class="enemy-name">${esc(e.name)}</span>${e.count > 1 ? `<span class="x">×${e.count}</span>` : ''}${spawnTime(e)}</span>`;
  }

  // First–last spawn time of an enemy within its wave (from the wave's spawn list).
  function spawnTime(e) {
    if (e.from == null) return '';
    const t = (v) => `${+v.toFixed(1)}s`;
    return `<span class="spawn-t" title="Spawn time">${e.from === e.to ? t(e.from) : `${t(e.from)}–${t(e.to)}`}</span>`;
  }
  window.spawnTime = spawnTime;

  // Cards shared by stage, floor and raid pages.
  function fieldCard(b) {
    if (!b) return '';
    const time = `${Math.floor(b.battleTime / 60)}:${String(b.battleTime % 60).padStart(2, '0')}`;
    return `<section class="card"><h3>Field</h3><dl class="facts">
      <dt>Mode</dt><dd>${esc(b.mode)}</dd>
      <dt>Time limit</dt><dd>${time}</dd>
      <dt>Theme</dt><dd>${esc(b.theme)} · ${esc(b.themeTime)}</dd>
      <dt>Background</dt><dd class="key">${esc(b.background)}</dd>
    </dl></section>`;
  }

  // Enemy roster (target tagged, stats at `lv`) followed by the waves.
  function battleCards(b, lv) {
    if (!b) return `<section class="card"><h3>Waves</h3><p class="key">No wave data for this stage.</p></section>`;
    const targetIds = new Set(b.targets.map((t) => t.id));
    return `<section class="card"><h3>Enemy roster <span class="sub">${b.enemies.length}</span></h3>
        <div class="table-scroll"><table class="roster"><thead><tr><th>Enemy</th><th>Grade</th><th>Element</th>
          <th class="num">HP</th><th class="num">ATK</th><th class="num">DEF</th></tr></thead><tbody>
        ${[...b.enemies].sort((x, y) => (y.stats?.hp ?? 0) - (x.stats?.hp ?? 0)).map((e) => `<tr class="${targetIds.has(e.id) ? 'is-target' : ''}">
          <td><div class="roster-name">${gameImg('icons-monster', e.art, `roster-art${targetIds.has(e.id) ? ' big' : ''}`)}<span>${esc(e.name)}${targetIds.has(e.id) ? ' <span class="tag target">TARGET</span>' : ''}</span></div></td><td><span class="grade ${gradeClass(e.grade)}">${esc(e.grade || '—')}</span></td>
          <td>${esc((e.element || []).join(', ') || '—')}</td>
          ${e.stats ? `<td class="num">${fmt(e.stats.hp)}</td><td class="num">${fmt(e.stats.atk)}</td><td class="num">${fmt(e.stats.def)}</td>`
            : '<td class="num key" colspan="3">no stat data</td>'}</tr>`).join('')}
        </tbody></table></div>
        <p class="key note">Stats at stage level ${lv}: stat group value × monster ratio ÷ 10000.</p></section>
      <section class="card"><h3>Waves <span class="sub">${b.waves.length}</span>${b.repeat ? ' <span class="tag">REPEATS</span>' : ''}</h3>
        ${b.waves.map((w, i) => `<div class="wave"><span class="wave-n">${i + 1}</span><div class="enemies">${w.map(enemyChip).join('')}</div>
          <span class="wave-total">${w.reduce((n, e) => n + e.count, 0)}</span></div>`).join('') || '<p class="key">No wave data.</p>'}
        <p class="key note">${b.spawnData ? 'Counts and spawn times from each wave’s spawn list (core wavedata bundles).'
          : 'No spawn list for some waves: counts there are enemy slots, not spawns.'}</p>
      </section>`;
  }

  function rewardCard(r, title = 'Rewards') {
    if (!r) return '';
    const items = [...(r.userExp ? [{ name: 'Commander EXP', amount: r.userExp, chance: 100 }] : []), ...r.items];
    return `<section class="card"><h3>${esc(title)}</h3><div class="rewards">${items.map((x) => `
      <div class="reward"><span class="reward-name">${esc(x.name)}</span><span class="reward-amt">×${fmt(x.amount)}</span>
      ${x.chance < 100 ? `<span class="chance">${+x.chance.toFixed(2)}%</span>` : ''}</div>`).join('')}</div></section>`;
  }

  function renderStage() {
    const st = s.current;
    const b = st.battle;
    const nav = (id, label) => `<a class="nav-btn" href="${id ? href(st.kind, id) : '#'}" aria-disabled="${!id}">${label}</a>`;
    const badge = (text, cls = '') => `<span class="badge ${cls}">${text}</span>`;

    const sections = [fieldCard(b)];
    if (st.scenarios.length) {
      sections.push(`<section class="card"><h3>Story</h3><div class="scen-list">${st.scenarios.map((x) => `
        <a class="scen" ${x.readable ? `href="#/scene/${encodeURIComponent(x.id)}"` : ''}>
          <span class="scen-phase">${esc(x.phase)}</span><span>${esc(x.label)}</span></a>`).join('')}</div></section>`);
    }
    sections.push(battleCards(b, st.lv), rewardCard(st.reward));

    // Same stage in other campaign modes, or the same floor number in other towers.
    const versions = st.versions?.length > 1 ? `<div class="seg">${st.versions.map((v) =>
      `<a class="seg-link ${v.id === st.id ? 'active' : ''}" href="${href(st.kind, v.id)}">${esc(v.mode)}</a>`).join('')}</div>` : '';

    $('#reader').innerHTML = `
      <div class="scene-head">
        <div class="crumb">${st.crumb.map(esc).join(' · ')}</div>
        <div class="scene-title">${esc(st.label)}</div>
        <div class="toolbar">
          ${versions}
          ${st.category !== 'Tower' ? badge(esc(st.category), `cat-${st.category.toLowerCase()}`) : ''}
          ${badge(`Lv ${st.lv}`)}${badge(`CP ${fmt(st.cp)}`)}
          ${st.quickBattle ? badge('Quick battle') : ''}
          <span class="spacer"></span>${nav(st.prev, '← Prev')}${nav(st.next, 'Next →')}
        </div>
      </div>
      <div class="stage-body">${sections.join('')}</div>`;
  }

  document.addEventListener('keydown', (e) => {
    if (section !== 'stages' || !s.current || e.target.matches('input')) return;
    if (e.key === 'ArrowRight' && s.current.next) location.hash = href(s.current.kind, s.current.next);
    if (e.key === 'ArrowLeft' && s.current.prev) location.hash = href(s.current.kind, s.current.prev);
  });

  return { enter, route, renderTree, fieldCard, battleCards, rewardCard };
})();
