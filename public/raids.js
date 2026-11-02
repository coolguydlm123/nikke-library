// Nikke Library — raids: Union Raid, Solo Raid, Interception and the Solo Raid Museum.
// A Union/Solo boss page shows every difficulty and tier of that boss in its season.
const Raids = (() => {
  const r = {
    catalogue: null,
    kind: store.get('raidKind', 'union'), // 'union' | 'solo' | 'intercept' | 'museum'
    current: null,
  };
  const KINDS = ['union', 'solo', 'intercept', 'museum'];
  const seasonal = (kind) => kind === 'union' || kind === 'solo';
  const href = (kind, boss, season) => (seasonal(kind) ? `#/raid/${kind}/${season}/${boss}` : `#/raid/${kind}/${boss}`);
  const levelRange = (b) => (b.lvMin === b.lvMax ? `Lv ${b.lvMin}` : `Lv ${b.lvMin}–${b.lvMax}`);
  const diffTag = (d) => (d === 'Normal' ? '' : `<span class="tag diff-${d.toLowerCase()}">${d.toUpperCase()}</span>`);
  const gradeClass = (g) => `grade-${String(g || '').toLowerCase()}`;

  async function enter() {
    if (!r.catalogue) r.catalogue = await (await apiFetch('/api/raids')).json();
    renderTabs();
    renderTree();
  }

  function renderTabs() {
    $('#cat-tabs').innerHTML = KINDS.filter((k) => r.catalogue[k]).map((kind) => {
      const c = r.catalogue[kind];
      const n = seasonal(kind) ? c.seasons.length : c.seasons.reduce((s, g) => s + g.bosses.length, 0);
      return `<button class="cat-tab ${r.kind === kind ? 'active' : ''}" data-kind="${kind}">${esc(c.label)}<span class="n">${n}</span></button>`;
    }).join('');
    $('#cat-tabs').querySelectorAll('[data-kind]').forEach((b) => b.onclick = () => {
      r.kind = b.dataset.kind; store.set('raidKind', r.kind); renderTabs(); renderTree();
    });
  }

  // Groups are seasons (Union/Solo, newest first), interception tiers or museum halls.
  function renderTree() {
    const f = state.filter;
    const groups = r.catalogue[r.kind].seasons;
    const html = groups.map((g, i) => {
      const hit = !f || g.title.toLowerCase().includes(f);
      const bosses = hit ? g.bosses : g.bosses.filter((b) => b.name.toLowerCase().includes(f));
      if (!bosses.length) return '';
      const isCurrent = r.current && r.current.kind === r.kind && (seasonal(r.kind) ? r.current.season.id === g.id : g.bosses.some((b) => b.key === r.current.boss.key));
      const open = isCurrent || (f && !hit) || !seasonal(r.kind) || (!r.current && i === 0);
      return `<details class="group" ${open ? 'open' : ''}>
        <summary>${esc(g.title)}<span class="count">${bosses.length}</span></summary>
        ${bosses.map((b) => {
          const active = r.current && r.current.kind === r.kind && r.current.boss.key === b.key && (!seasonal(r.kind) || r.current.season.id === g.id);
          const tags = b.difficulties ? b.difficulties.map((d) => diffTag(d.difficulty)).join('') : '';
          return `<a class="scene-link ${active ? 'active' : ''}" href="${href(r.kind, b.key, g.id)}">
            <span>${b.slot ? `${b.slot} · ` : ''}${esc(b.short || b.name)}${tags}</span><span class="lines">${levelRange(b)}</span></a>`;
        }).join('')}
      </details>`;
    }).join('');
    $('#tree').innerHTML = html || '<p class="key" style="padding:12px">No matches.</p>';
    $('#tree .scene-link.active')?.scrollIntoView({ block: 'nearest' });
  }

  async function route() {
    const h = location.hash;
    let m;
    if ((m = h.match(/^#\/raid\/(union|solo)\/(\d+)$/))) {
      // Old per-tier link: find its boss page.
      const res = await apiFetch(`/api/raid?kind=${m[1]}&id=${m[2]}`);
      if (res.ok) { const b = await res.json(); location.replace(href(m[1], b.boss, b.season)); return; }
    }
    let url = null;
    if ((m = h.match(/^#\/raid\/(union|solo)\/(\d+)\/([\w-]+)/))) url = `/api/raid?kind=${m[1]}&season=${m[2]}&boss=${m[3]}`;
    else if ((m = h.match(/^#\/raid\/(intercept|museum)\/([\w-]+)/))) url = `/api/raid?kind=${m[1]}&boss=${m[2]}`;
    if (!url) {
      r.current = null;
      m = h.match(/^#\/raids\/(union|solo)(?:\/(\d+))?/);
      if (m && m[1] !== r.kind) { r.kind = m[1]; store.set('raidKind', r.kind); renderTabs(); }
      renderTree();
      $('#reader').scrollTop = 0;
      return m ? (m[2] ? seasonHub(m[1], Number(m[2])) : seasonsHub(m[1])) : overview();
    }
    const res = await apiFetch(url);
    if (!res.ok) { $('#reader').innerHTML = '<div class="error">Raid not found.</div>'; return; }
    r.current = await res.json();
    if (r.current.kind !== r.kind) { r.kind = r.current.kind; store.set('raidKind', r.kind); renderTabs(); }
    renderTree();
    ({ union: bossPage, solo: bossPage, intercept: interceptPage, museum: museumPage })[r.current.kind]();
    $('#reader').scrollTop = 0;
  }

  // Landing hubs: the section, all seasons of a kind, one season's bosses.
  const artSrc = (b) => (b.art ? `img/icons-monster/${b.art.toLowerCase()}.webp` : null);
  const diffText = (b) => (b.difficulties || []).map((d) => d.difficulty).filter((d) => d !== 'Normal').join(', ');
  const bossCard = (kind, b, season, text) => ({
    href: href(kind, b.key, season), title: b.short || b.name, img: artSrc(b),
    text: [text, levelRange(b), diffText(b)].filter(Boolean).join(' · '),
  });
  const SOLO_LATEST = 8;

  function overview() {
    const c = r.catalogue;
    const [union, solo] = [c.union.seasons[0], c.solo.seasons];
    const count = (k) => c[k]?.seasons.reduce((s, g) => s + g.bosses.length, 0) || 0;
    $('#reader').innerHTML = hubHtml({
      title: 'Raids',
      text: `${c.union.seasons.length} Union Raid seasons, ${solo.length} Solo Raid seasons, ${count('intercept')} Interception and ${count('museum')} Museum bosses.`,
      groups: [
        { title: `Union Raid · latest (${union.title})`, cards: union.bosses.map((b) => bossCard('union', b, union.id, b.slot ? `Boss ${b.slot}` : null)) },
        { title: 'Solo Raid · latest seasons', cards: solo.slice(0, SOLO_LATEST).flatMap((s) => s.bosses.map((b) => bossCard('solo', b, s.id, s.title))) },
        { title: 'All seasons', cards: ['union', 'solo'].map((k) => ({
          href: `#/raids/${k}`, title: c[k].label, n: `${c[k].seasons.length} seasons`, img: artSrc(c[k].seasons[0].bosses[0]),
          text: `Every ${c[k].label} season, newest first.` })) },
        ...['intercept', 'museum'].flatMap((k) => c[k].seasons.map((g) => ({
          title: k === 'museum' ? `${c.museum.label} · ${g.title}` : g.title,
          cards: g.bosses.map((b) => bossCard(k, b, null, k === 'museum' && b.soloSeason ? `Solo S${b.soloSeason}` : null)),
        }))),
      ],
    });
  }

  function seasonsHub(kind) {
    const c = r.catalogue[kind];
    $('#reader').innerHTML = hubHtml({
      title: c.label,
      text: `${c.seasons.length} seasons, newest first.`,
      groups: [{ cards: c.seasons.map((s) => ({
        // A one-boss season (Solo Raid) goes straight to the boss.
        href: s.bosses.length === 1 ? href(kind, s.bosses[0].key, s.id) : `#/raids/${kind}/${s.id}`, title: s.title, img: artSrc(s.bosses[0]),
        n: `${s.bosses.length} boss${s.bosses.length > 1 ? 'es' : ''}`, text: s.bosses.map((b) => b.name).join(', '),
      })) }],
    });
  }

  function seasonHub(kind, seasonId) {
    const c = r.catalogue[kind];
    const s = c.seasons.find((x) => x.id === seasonId);
    if (!s) { $('#reader').innerHTML = '<div class="error">Season not found.</div>'; return; }
    $('#reader').innerHTML = hubHtml({
      title: `${c.label} · ${s.title}`,
      groups: [{ cards: s.bosses.map((b) => bossCard(kind, b, s.id, b.slot ? `Boss ${b.slot}` : null)) },
        { cards: [{ href: `#/raids/${kind}`, title: `All ${c.label} seasons`, n: c.seasons.length }] }],
    });
  }

  const head = (crumb, title, desc, badges = '') => `<div class="scene-head">
      <div class="crumb">${crumb.filter(Boolean).map(esc).join(' · ')}</div>
      <div class="scene-title">${title}</div>
      ${desc ? `<p class="album-desc">${esc(desc)}</p>` : ''}
      ${badges ? `<div class="toolbar">${badges}</div>` : ''}</div>`;
  const badge = (t) => `<span class="badge">${t}</span>`;

  const rewardList = (reward) => !reward ? '<span class="key">—</span>'
    : [...(reward.userExp ? [{ name: 'Commander EXP', amount: reward.userExp }] : []), ...reward.items]
      .map((i) => `<div>${esc(i.name)} <span class="reward-amt">×${fmtNum(i.amount)}</span>${i.chance < 100 ? ` <span class="chance">${fmtPct(i.chance, 2)}</span>` : ''}${boxToggle(i)}</div>`).join('');

  // Enemy roster. When the wave is used at several tiers, stats show at the lowest
  // and highest of them, each in its own column.
  function rosterRange(b) {
    const targets = new Set(b.targets.map((t) => t.id));
    const two = b.lvHi !== b.lvLo;
    const statHead = (lv) => ['HP', 'ATK', 'DEF'].map((s) => `<th class="num">${s}${two ? ` <span class="key">Lv ${lv}</span>` : ''}</th>`).join('');
    const statCells = (st) => `<td class="num">${fmtShort(st.hp)}</td><td class="num">${fmtShort(st.atk)}</td><td class="num">${fmtShort(st.def)}</td>`;
    return `<div class="table-scroll"><table class="roster keep-cols sticky-first"><thead><tr><th>Enemy</th><th>Grade</th><th>Element</th>
      ${statHead(b.lvLo)}${two ? statHead(b.lvHi) : ''}</tr></thead><tbody>
      ${[...b.enemies].sort((x, y) => (y.statsHi?.hp ?? 0) - (x.statsHi?.hp ?? 0)).map((e) => `<tr class="${targets.has(e.id) ? 'is-target' : ''}">
        <td><div class="roster-name">${gameImg('icons-monster', e.art, 'roster-art')}<span>${esc(e.name)}${targets.has(e.id) ? ' <span class="tag target">TARGET</span>' : ''}</span></div></td>
        <td><span class="grade ${gradeClass(e.grade)}">${esc(e.grade || '—')}</span></td><td>${esc((e.element || []).join(', ') || '—')}</td>
        ${e.stats ? statCells(e.stats) + (two ? statCells(e.statsHi) : '')
          : `<td class="num key" colspan="${two ? 6 : 3}">no stat data</td>`}</tr>`).join('')}
      </tbody></table></div>`;
  }

  // HP stages: each step's HP is its damage window; the boss's level (and stats)
  // can rise as steps pass. Steps where the level goes up are marked.
  function hpStagesTable(stages, { rewards = false } = {}) {
    const bonusCols = rewards ? Math.max(0, ...stages.map((s) => (s.bonus || []).length)) : 0;
    return `<div class="table-scroll"><table class="roster keep-cols sticky-first hp-stages"><thead><tr>
      <th class="num">Stage</th><th class="num">From dmg</th><th class="num">Stage HP</th><th class="num">Lv</th><th class="num">ATK</th><th class="num">DEF</th>
      ${rewards ? `<th>Rewards</th>${Array.from({ length: bonusCols }, (_, i) => `<th>Bonus${bonusCols > 1 ? ` ${i + 1}` : ''}</th>`).join('')}` : ''}</tr></thead><tbody>
      ${stages.map((s, i) => {
        const up = i > 0 && s.lv > stages[i - 1].lv;
        return `<tr><td class="num">${s.step}</td>
          <td class="num">${fmtShort(s.from)}</td>
          <td class="num">${s.hp != null ? fmtShort(s.hp) : '∞'}</td>
          <td class="num">${s.lv}${up ? ' <span class="lv-up" title="Boss level rises at this stage">▲</span>' : ''}</td>
          <td class="num">${fmtShort(s.atk)}</td><td class="num">${fmtShort(s.def)}</td>
          ${rewards ? `<td class="obtain">${rewardList(s.reward)}</td>${Array.from({ length: bonusCols }, (_, j) =>
            `<td class="obtain">${rewardList(s.bonus?.[j])}</td>`).join('')}` : ''}</tr>`;
      }).join('')}
      </tbody></table></div>`;
  }
  const hpNote = (rewards) => `<p class="key note">From dmg is the total damage at which the stage starts; Stage HP is the damage needed to clear it (∞ = last stage, no limit).
    ATK and DEF are the target's stats at the stage's level; ▲ marks a level rise.${rewards ? ' Bonus rewards are extra drops for reaching the same stage; percentages are drop chances.' : ''}</p>`;

  const wavesHtml = (b) => b.waves.map((w, i) => `<div class="wave"><span class="wave-n">${i + 1}</span><div class="enemies">${w.map((e) => `
    <span class="enemy ${gradeClass(e.grade)}">${e.element?.length ? `<span class="elem elem-${esc(e.element[0].toLowerCase())}"></span>` : ''}
    <span class="enemy-name">${esc(e.name)}</span>${e.count > 1 ? `<span class="x">×${e.count}</span>` : ''}${window.spawnTime ? window.spawnTime(e) : ''}</span>`).join('')}</div></div>`).join('');

  function bossPage() {
    const x = r.current;
    const tl = x.tierLabel;
    const badges = x.difficulties.map((d) => badge(`${d.difficulty} · ${d.tiers.length} ${tl.toLowerCase()}${d.tiers.length > 1 ? 's' : ''}`)).join('');
    const sections = x.difficulties.map((d) => {
      const hasRewards = d.tiers.some((t) => t.rewards.length);
      const rewardLabels = [...new Set(d.tiers.flatMap((t) => t.rewards.map((w) => w.label)))];
      const tierTable = `<div class="table-scroll"><table class="roster keep-cols sticky-first tier-table"><thead><tr>
          <th class="num">${tl}</th><th class="num">Lv</th><th class="num">Target HP</th><th class="num">ATK</th><th class="num">DEF</th>
          ${hasRewards ? rewardLabels.map((l) => `<th>${l === 'Clear' ? 'Rewards' : `${esc(l)} rewards`}</th>`).join('') : ''}</tr></thead><tbody>
        ${d.tiers.map((t) => `<tr><td class="num">${t.tier}</td><td class="num">${t.lv}</td>
          ${t.target?.stats ? `<td class="num">${fmtShort(t.target.stats.hp)}</td><td class="num">${fmtShort(t.target.stats.atk)}</td><td class="num">${fmtShort(t.target.stats.def)}</td>` : '<td class="num key" colspan="3">—</td>'}
          ${hasRewards ? rewardLabels.map((l) => `<td class="obtain">${rewardList(t.rewards.find((w) => w.label === l)?.reward)}</td>`).join('') : ''}</tr>`).join('')}
        </tbody></table></div>`;
      const battles = d.battles.filter((w) => w.battle).map((w) => {
        const b = w.battle;
        const label = d.battles.length > 1 ? ` <span class="sub">${tl}s ${w.tiers.join(', ')}</span>` : '';
        return `<div class="subhead">Enemies${label} <span class="key">· ${esc(b.theme)} · ${fmtDur(b.battleTime)} limit</span></div>
          ${rosterRange(b)}
          <details class="waves-toggle"><summary>Waves (${b.waves.length})</summary>${wavesHtml(b)}</details>`;
      }).join('');
      const hpStages = d.hpStages.map((set) => `<div class="subhead">HP stages <span class="key">· ${tl} ${set.tiers.join(', ')} · ${set.stages.length} stages</span></div>
        ${hpStagesTable(set.stages)}${hpNote(false)}`).join('');
      return `<section class="card diff-section"><h3>${diffTag(d.difficulty) || '<span class="tag diff-normal">NORMAL</span>'}
          <span class="sub">${d.tiers.length} ${tl.toLowerCase()}${d.tiers.length > 1 ? 's' : ''}</span></h3>
        ${tierTable}${hpStages}${battles}</section>`;
    }).join('');
    $('#reader').innerHTML = head([x.kindLabel, x.season.title, x.boss.slot ? `Boss ${x.boss.slot}` : null], esc(x.boss.name), x.description, badges) +
      `<div class="stage-body">${sections}</div>`;
  }

  function damageTable(rows, title) {
    if (!rows.length) return '';
    return `<section class="card"><h3>${esc(title)} <span class="sub">${rows.length}</span></h3>
      <div class="table-scroll"><table class="roster keep-cols sticky-first"><thead><tr><th class="num">From dmg</th><th class="num">To dmg</th><th>Rewards</th></tr></thead><tbody>
      ${rows.map((x) => `<tr><td class="num">${fmtShort(x.min)}</td><td class="num">${x.max ? fmtShort(x.max) : '∞'}</td><td class="obtain">${rewardList(x.reward)}</td></tr>`).join('')}
      </tbody></table></div></section>`;
  }

  function interceptPage() {
    const x = r.current;
    const badges = [badge(`Lv ${x.lv}`), x.characterLv ? badge(`Nikke Lv ${x.characterLv}`) : '', x.tickets ? badge(`${x.tickets} ticket${x.tickets > 1 ? 's' : ''}`) : ''].join('');
    $('#reader').innerHTML = head([x.kindLabel, x.group], esc(x.boss.name), x.description, badges) + `
      <div class="stage-body">
        ${Stages.fieldCard(x.battle)}
        ${x.hpStages ? `<section class="card"><h3>HP stages <span class="sub">${x.hpStages.length}</span></h3>
          ${hpStagesTable(x.hpStages, { rewards: x.hpStages.some((s) => s.reward || s.bonus?.some(Boolean)) })}
          ${hpNote(x.hpStages.some((s) => s.bonus?.some(Boolean)))}</section>` : ''}
        ${Stages.battleCards(x.battle, x.lv)}
        ${damageTable(x.damageRewards, 'Damage rewards')}
        ${x.extraRewards.map((rows, i) => damageTable(rows, x.extraRewards.length > 1 ? `Bonus rewards ${i + 1}` : 'Bonus rewards')).join('')}
      </div>`;
  }

  function museumPage() {
    const x = r.current;
    const sr = x.soloRaid;
    const desc = sr ? null : '';
    const modes = x.modes.map((m) => `
      <section class="card diff-section"><h3>${esc(m.mode)} <span class="sub">Lv ${m.lv}${m.characterLv ? ` · Nikke Lv ${m.characterLv}` : ''}</span></h3>
        ${m.hpStages ? `<div class="subhead">HP stages <span class="key">· ${m.hpStages.length} stages</span></div>${hpStagesTable(m.hpStages)}${hpNote(false)}` : ''}
        ${m.battle ? `<div class="subhead">Enemies</div>${rosterRange({ ...m.battle, lvLo: m.lv, lvHi: m.lv, enemies: m.battle.enemies.map((e) => ({ ...e, statsHi: e.stats })) })}
          <details class="waves-toggle"><summary>Waves (${m.battle.waves.length})</summary>${wavesHtml(m.battle)}</details>` : ''}
        ${m.missions.length ? `<div class="subhead">Missions</div><div class="table-scroll"><table class="roster keep-cols"><thead><tr><th>Mission</th><th class="num">Ranking pts</th><th>Rewards</th></tr></thead><tbody>
          ${m.missions.map((ms) => `<tr><td>${esc(ms.description)}</td><td class="num">${ms.rankingPoints ? fmtNum(ms.rankingPoints) : '—'}</td><td class="obtain">${rewardList(ms.reward)}</td></tr>`).join('')}
          </tbody></table></div>` : ''}
      </section>`).join('');
    $('#reader').innerHTML = head([x.kindLabel, x.group], esc(x.boss.name), desc,
      sr ? `<a class="badge link-badge" href="${href('solo', sr.boss, sr.season)}">From Solo Raid Season ${sr.number} →</a>` : '') +
      `<div class="stage-body">${modes}</div>`;
  }

  return { enter, route, renderTree };
})();
