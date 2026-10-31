// Nikke Library — VOLT TRIP (Dice Track), Fading Affection (Text Adventure Plus)
// and SD Lobby, shown as extra tabs of the Minigames section.
const MinigameExtras = (() => {
  const fmt = (n) => Number(n).toLocaleString('en-US');
  const day = (iso) => (iso ? String(iso).slice(0, 10) : null);
  const x = { dice: null, adv: null, lobby: null, play: null };
  const rewardList = (reward) => !reward ? '<span class="key">—</span>'
    : [...(reward.userExp ? [{ name: 'Commander EXP', amount: reward.userExp }] : []), ...reward.items]
      .map((i) => `${esc(i.name)} <span class="reward-amt">×${fmt(i.amount)}</span>${i.chance < 100 ? ` <span class="chance">${+i.chance.toFixed(2)}%</span>` : ''}`).join('<br>');
  const head = (crumb, title, desc, extra = '') => `<div class="scene-head">
      <div class="crumb">${crumb.map(esc).join(' · ')}</div><div class="scene-title">${title}</div>
      ${desc ? `<p class="album-desc">${esc(desc)}</p>` : ''}${extra}</div>`;
  const link = (hash, label, meta, active) =>
    `<a class="scene-link ${active ? 'active' : ''}" href="${hash}"><span>${label}</span><span class="lines">${meta ?? ''}</span></a>`;

  async function load(kind) {
    if (kind === 'dicetrack' && !x.dice) x.dice = await (await apiFetch('/api/dicetrack')).json();
    if (kind === 'textadv' && !x.adv) x.adv = await (await apiFetch('/api/textadv')).json();
    if (kind === 'sdlobby' && !x.lobby) x.lobby = await (await apiFetch('/api/sdlobby')).json();
  }

  // ---------- VOLT TRIP ----------
  const SLOT_CLASS = { Start: 'start', Fever: 'fever', GoTo: 'goto', Item: 'item', Random: 'random' };

  function diceTree(page) {
    const d = x.dice;
    return `<details class="group" open><summary>${esc(d.name)}</summary>
      ${link('#/minigame/dicetrack', 'Board', `${d.slots.length} squares`, page === 'board')}
      ${link('#/minigame/dicetrack/missions', 'Lap rewards & missions', d.missions.length, page === 'missions')}</details>`;
  }

  function dicePage(page) {
    const d = x.dice;
    if (page === 'missions') {
      return head([d.name], 'Lap rewards & missions', null) + `<div class="stage-body">
        <section class="card"><h3>Lap rewards <span class="sub">${d.lapRewards.length}</span></h3>
          <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th class="num">Laps</th><th>Rewards</th></tr></thead><tbody>
          ${d.lapRewards.map((l) => `<tr><td class="num">${l.laps}${l.repeat ? '+ <span class="key">(repeats)</span>' : ''}</td><td class="obtain">${rewardList(l.reward)}</td></tr>`).join('')}
          </tbody></table></div></section>
        <section class="card"><h3>Missions <span class="sub">${d.missions.length}</span></h3>
          <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th>Mission</th><th>Rewards</th></tr></thead><tbody>
          ${d.missions.map((ms) => `<tr><td>${esc(ms.description)}</td><td class="obtain">${rewardList(ms.reward)}</td></tr>`).join('')}
          </tbody></table></div></section></div>`;
    }
    const pools = d.slots.filter((s) => s.pool);
    const poolKinds = [...new Map(pools.map((s) => [s.name, s])).values()];
    return head(['Minigames'], esc(d.name), d.intro, `<div class="toolbar">
        <span class="badge">${esc(d.dice)}</span>${d.specialDice ? `<span class="badge">${esc(d.specialDice)}</span>` : ''}
        <span class="badge">${d.dailyDice} dice / day</span></div>`) + `
      <div class="stage-body">
        <section class="card"><h3>Board <span class="sub">${d.slots.length} squares, in play order from Start</span></h3>
          <div class="dice-board">${d.slots.map((s) => `
            <div class="dice-slot slot-${SLOT_CLASS[s.type] || 'item'}" title="${esc(s.effect)}">
              <span class="slot-n">${s.step + 1}</span>
              <span class="slot-name">${esc(s.type === 'Item' ? 'Reward' : s.name.replace(/ Square$/, ''))}${s.value ? ` <b>${s.type === 'Fever' ? '×' : '+'}${s.value}</b>` : ''}</span>
              ${s.reward ? `<span class="slot-reward">${s.reward.items.map((i) => `${esc(i.name)} ×${fmt(i.amount)}`).join('<br>')}</span>` : ''}
            </div>`).join('')}</div>
          <p class="key note">The board loops: passing or landing on Start completes a lap. Hover a square for its effect.</p></section>
        <section class="card"><h3>Squares</h3><dl class="facts">
          ${[...new Map(d.slots.filter((s) => s.effect).map((s) => [s.name, s])).values()].map((s) => `<dt>${esc(s.name)}</dt><dd>${esc(s.effect)}</dd>`).join('')}
        </dl></section>
        ${poolKinds.map((s) => `<section class="card"><h3>${esc(s.name)} odds</h3>
          <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th class="num">Chance</th><th>Reward</th></tr></thead><tbody>
          ${s.pool.map((p) => `<tr><td class="num">${+p.chance.toFixed(2)}%</td><td class="obtain">${rewardList(p.reward)}</td></tr>`).join('')}
          </tbody></table></div></section>`).join('')}
      </div>`;
  }

  // ---------- Fading Affection ----------
  // Endings seen and Saved Memories (loot items) carry over between runs, like in
  // the game: dying earns a memory that unlocks a safer choice next time.
  const seenKey = 'textadvEndings';
  const seen = () => new Set(store.get(seenKey, []));
  const markSeen = (page) => { const s = seen(); s.add(page); store.set(seenKey, [...s]); };
  const itemsKey = 'textadvItems';
  const owned = () => store.get(itemsKey, []);
  const addItem = (id) => { const s = new Set(owned()); s.add(id); store.set(itemsKey, [...s]); };
  const setItem = (id, on) => { const s = new Set(owned()); if (on) s.add(id); else s.delete(id); store.set(itemsKey, [...s]); };
  const setSeen = (page, on) => { const s = seen(); if (on) s.add(page); else s.delete(page); store.set(seenKey, [...s]); };
  // Choices picked so far: option ids, and "f<id>" for a route's starting area.
  const pickedKey = 'textadvPicked';
  const picked = () => new Set(store.get(pickedKey, []));
  const markPicked = (id) => { const s = picked(); s.add(id); store.set(pickedKey, [...s]); };
  const ENDING_LABEL = { DEATH: 'Death', EROSION: 'Corruption', TRUEENDING: 'True ending', HIDDEN: 'Hidden' };

  // Endings reachable from a page, following every choice and continue link
  // (a page that returns to the area map ends the branch). Memoised per page.
  const reachMemo = new Map();
  function reachableEndings(pageId, stack = new Set()) {
    if (!pageId) return new Set();
    if (reachMemo.has(pageId)) return reachMemo.get(pageId);
    if (stack.has(pageId)) return new Set(); // loop: its endings are counted where it started
    const p = x.adv.pages[pageId];
    const out = new Set();
    if (p) {
      stack.add(pageId);
      if (p.ending) out.add(p.id);
      const next = [p.toFirstSelect ? null : p.next, ...p.options.flatMap((o) => [o.page, o.deathPage, o.erosionPage])];
      for (const n of next) for (const e of reachableEndings(n, stack)) out.add(e);
      stack.delete(pageId);
    }
    reachMemo.set(pageId, out);
    return out;
  }

  // Not checked: never picked. Checked: picked, endings after it still uncleared.
  // Completed: every ending reachable through it is cleared (played here or ticked).
  function choiceStatus(key, targets) {
    const endings = new Set(targets.flatMap((t) => [...reachableEndings(t)]));
    const s = seen();
    const cleared = [...endings].filter((e) => s.has(e)).length;
    const wasPicked = picked().has(key);
    let status = 'none';
    if (endings.size ? cleared === endings.size : wasPicked) status = 'done';
    else if (wasPicked) status = 'checked';
    const label = { none: 'Not checked', checked: 'Checked', done: 'Completed' }[status];
    const detail = endings.size ? `${cleared}/${endings.size} endings after this choice cleared` : 'Leads back to the area map';
    return `<span class="cstat cstat-${status}" title="${esc(detail)}">${label}${endings.size ? ` · ${cleared}/${endings.size}` : ''}</span>`;
  }

  function advTree(page, routeId) {
    const a = x.adv;
    const s = seen();
    return `<details class="group" open><summary>${esc(a.name)}</summary>
      ${link('#/minigame/textadv/endings', 'Endings', `${a.routes.reduce((n, r) => n + r.endings.filter((e) => s.has(e.page)).length, 0)}/${a.routes.reduce((n, r) => n + r.endings.length, 0)}`, page === 'endings')}
      ${link('#/minigame/textadv/items', 'Loot items', a.items.length, page === 'items')}</details>
      <details class="group" open><summary>Play a route</summary>
      ${a.routes.map((r) => link(`#/minigame/textadv/route/${r.id}`, esc(r.name), r.unlock ? `from ${day(r.unlock.value)}` : '', page === 'route' && routeId === r.id)).join('')}
      </details>`;
  }

  // A fresh run of a route.
  function newRun(route) {
    const st = x.adv.stats;
    return { route: route.id, page: null, hp: st.hp.start, food: st.food.start, erosion: route.startCorruption || 0, items: owned(), log: [], notice: null };
  }

  const ignoreReq = () => store.get('textadvIgnoreReq', false);
  const itemName = (id) => x.adv.items.find((i) => i.id === id)?.name || `item ${id}`;
  const endingTitle = (pageId) => { const p = x.adv.pages[pageId]; return p?.ending ? `${ENDING_LABEL[p.ending.type] || p.ending.type} ${p.ending.num}: ${p.ending.title}` : `ending page ${pageId}`; };

  function requirement(cond, run) {
    if (!cond) return { ok: true };
    if (cond.type === 'LootItem') return { ok: run.items.includes(cond.value), text: `Needs ${itemName(cond.value)}` };
    if (cond.type === 'Food') return { ok: run.food >= cond.value, text: `Needs ${cond.value} ${x.adv.stats.food.name}` };
    if (cond.type === 'Ending') return { ok: seen().has(cond.value), text: `Needs ${endingTitle(cond.value)}` };
    return { ok: true, text: cond.type };
  }

  function arrive(run, pageId) {
    const p = x.adv.pages[pageId];
    run.page = pageId;
    run.notice = null;
    if (!p) return;
    if (p.loot && !run.items.includes(p.loot)) { run.items.push(p.loot); addItem(p.loot); run.notice = `Obtained ${itemName(p.loot)} (kept for future runs)`; }
    if (p.ending) markSeen(p.id);
  }

  function choose(run, opt) {
    const st = x.adv.stats;
    const route = x.adv.routes.find((r) => r.id === run.route);
    run.log.push({ page: run.page, choice: opt.text });
    markPicked(opt.id);
    run.hp = Math.max(0, Math.min(st.hp.max, run.hp + (opt.hp || 0)));
    run.food = Math.max(0, run.food + (opt.food || 0));
    if (route.corruption) run.erosion = Math.max(0, Math.min(st.erosion.max, run.erosion + (opt.erosion || 0)));
    let next = opt.page;
    if (run.hp <= 0 && opt.deathPage) next = opt.deathPage;
    else if (route.corruption && run.erosion >= st.erosion.max && opt.erosionPage) next = opt.erosionPage;
    arrive(run, next);
  }

  const delta = (n, label) => (n ? `<span class="delta ${n > 0 ? 'up' : 'down'}">${label} ${n > 0 ? '+' : ''}${n}</span>` : '');

  function routePage(routeId) {
    const a = x.adv;
    const route = a.routes.find((r) => r.id === routeId);
    if (!route) return '<div class="error">Route not found.</div>';
    if (!x.play || x.play.route !== routeId) x.play = newRun(route);
    const run = x.play;
    const st = a.stats;
    const ign = ignoreReq();
    const statsBar = `<div class="adv-stats">
      <span>${esc(st.hp.name)} <b>${run.hp}/${st.hp.max}</b></span><span>${esc(st.food.name)} <b>${run.food}</b></span>
      ${route.corruption ? `<span>${esc(st.erosion.name)} <b>${run.erosion}/${st.erosion.max}</b></span>` : ''}
      <span>Memories <b>${run.items.length}</b></span>
      <label class="toggle"><input type="checkbox" id="adv-ign" ${ign ? 'checked' : ''}> Ignore requirements</label>
      <button class="nav-btn" id="adv-restart">Restart route</button>
      <button class="nav-btn" id="adv-reset" title="Forget all endings and memories">Reset progress</button></div>`;

    const log = run.log.map((l) => `<div class="adv-past"><div class="adv-text">${esc(a.pages[l.page]?.text || '')}</div>
      <div class="adv-picked">→ ${esc(l.choice)}</div></div>`).join('');

    let body;
    if (!run.page) {
      body = `<div class="adv-page"><div class="adv-text">${esc(route.description)}</div>
        <div class="adv-options">${route.firstSelects.map((f, i) => {
          const needs = [f.needsItem && { ok: run.items.includes(f.needsItem), text: `Needs ${itemName(f.needsItem)}` },
            f.needsEnding && { ok: seen().has(f.needsEnding), text: `Needs ${endingTitle(f.needsEnding)}` }].filter(Boolean);
          const locked = !ign && needs.some((n) => !n.ok);
          return `<button class="option adv-opt" data-first="${i}" ${locked ? 'disabled' : ''}>
            <b>${esc(f.text)}</b>${choiceStatus(`f${f.id}`, [f.page])}${f.description && f.description !== f.text ? `<div class="key">${esc(f.description)}</div>` : ''}
            ${needs.map((n) => `<span class="req ${n.ok ? 'ok' : ''}">${esc(n.text)}</span>`).join('')}</button>`;
        }).join('')}</div></div>`;
    } else {
      const p = a.pages[run.page];
      if (!p) body = `<div class="error">Page ${run.page} is missing.</div>`;
      else {
        const opts = p.options.filter((o) => ign || !o.hidden || requirement(o.condition, run).ok);
        body = `<div class="adv-page">${run.notice ? `<div class="adv-notice">${esc(run.notice)}</div>` : ''}
          ${p.ending ? `<div class="adv-ending ending-${p.ending.type.toLowerCase()}"><span class="tag">${esc(ENDING_LABEL[p.ending.type] || p.ending.type)} ${p.ending.num}</span>
            <b>${esc(p.ending.title)}</b>${p.ending.hint ? `<div class="key">${esc(p.ending.hint)}</div>` : ''}</div>` : ''}
          <div class="adv-text">${esc(p.text)}</div>
          <div class="adv-options">
          ${p.type === 'SelectPage' ? opts.map((o, i) => {
            const req = requirement(o.condition, run);
            const locked = !ign && !req.ok;
            return `<button class="option adv-opt" data-opt="${p.options.indexOf(o)}" ${locked ? 'disabled' : ''}>
              ${esc(o.text)}${o.hidden ? ' <span class="tag">HIDDEN</span>' : ''}
              ${choiceStatus(o.id, [o.page, o.deathPage, o.erosionPage])}
              <span class="deltas">${delta(o.hp, st.hp.name)}${delta(o.food, st.food.name)}${route.corruption ? delta(o.erosion, st.erosion.name) : ''}</span>
              ${o.condition ? `<span class="req ${req.ok ? 'ok' : ''}">${esc(req.text || '')}${o.condition.hint && locked ? ` · ${esc(o.condition.hint)}` : ''}</span>` : ''}</button>`;
          }).join('') : ''}
          ${p.type === 'ResultPage' ? `<button class="option adv-opt" data-continue="1">Continue →</button>` : ''}
          ${p.type === 'EndingPage' ? `<button class="option adv-opt" data-restart="1">Start the route again</button>` : ''}
          </div></div>`;
      }
    }
    return head([a.name, 'Play'], esc(route.name), null, statsBar) + `<div class="stage-body adv-body">${log}${body}
      ${route.progressRewards.length ? `<section class="card"><h3>Route progress rewards</h3>
        <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th class="num">Progress</th><th>Rewards</th></tr></thead><tbody>
        ${route.progressRewards.map((r) => `<tr><td class="num">${r.goal}%</td><td class="obtain">${rewardList(r.reward)}</td></tr>`).join('')}
        </tbody></table></div></section>` : ''}</div>`;
  }

  function bindRoute(routeId, rerender) {
    const run = x.play;
    const a = x.adv;
    $('#adv-ign').onchange = (e) => { store.set('textadvIgnoreReq', e.target.checked); rerender(); };
    $('#adv-restart').onclick = () => { x.play = newRun(a.routes.find((r) => r.id === routeId)); rerender(); };
    $('#adv-reset').onclick = () => {
      if (!confirm('Forget every ending cleared, memory found and choice picked?')) return;
      store.set(seenKey, []); store.set(itemsKey, []); store.set(pickedKey, []);
      x.play = newRun(a.routes.find((r) => r.id === routeId)); rerender();
    };
    $('#reader').querySelectorAll('.adv-opt').forEach((b) => b.onclick = () => {
      const route = a.routes.find((r) => r.id === routeId);
      if (b.dataset.first != null) {
        const f = route.firstSelects[Number(b.dataset.first)];
        run.log.push({ page: null, choice: f.text });
        markPicked(`f${f.id}`);
        arrive(run, f.page);
      }
      else if (b.dataset.opt != null) choose(run, a.pages[run.page].options[Number(b.dataset.opt)]);
      else if (b.dataset.continue) {
        const p = a.pages[run.page];
        run.log.push({ page: run.page, choice: 'Continue' });
        if (p.toFirstSelect || !p.next) { run.page = null; run.notice = null; } else arrive(run, p.next);
      } else if (b.dataset.restart) x.play = newRun(route);
      rerender();
      const pages = $('#reader').querySelectorAll('.adv-page');
      pages[pages.length - 1]?.scrollIntoView({ block: 'start' });
    });
  }

  function endingsPage() {
    const a = x.adv;
    const s = seen();
    return head([a.name], 'Endings', 'Tick the endings you have cleared, in the game or here. Endings reached while playing are ticked automatically. Kept in this browser.') + `<div class="stage-body">
      ${a.routes.map((r) => `<section class="card"><h3>${esc(r.name)} <span class="sub">${r.endings.filter((e) => s.has(e.page)).length}/${r.endings.length} cleared</span>
          <span class="h3-actions"><button class="nav-btn" data-route-all="${r.id}">Mark all</button><button class="nav-btn" data-route-none="${r.id}">Clear all</button></span></h3>
        <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th class="num">Cleared</th><th>Ending</th><th>Hint</th></tr></thead><tbody>
        ${r.endings.map((e) => `<tr class="${s.has(e.page) ? '' : 'unseen'}">
          <td class="num"><input type="checkbox" class="ending-toggle" data-page="${e.page}" ${s.has(e.page) ? 'checked' : ''} aria-label="Cleared"></td>
          <td><span class="tag ending-tag ending-${e.type.toLowerCase()}">${esc(ENDING_LABEL[e.type] || e.type)} ${e.num}</span> ${esc(e.title)}</td>
          <td class="key">${esc(e.hint || '')}</td></tr>`).join('')}
        </tbody></table></div></section>`).join('')}</div>`;
  }

  function bindEndings(rerender) {
    $('#reader').querySelectorAll('.ending-toggle').forEach((c) => c.onchange = () => { setSeen(Number(c.dataset.page), c.checked); rerender(); });
    const setRoute = (routeId, on) => { for (const e of x.adv.routes.find((r) => r.id === routeId).endings) setSeen(e.page, on); rerender(); };
    $('#reader').querySelectorAll('[data-route-all]').forEach((b) => b.onclick = () => setRoute(Number(b.dataset.routeAll), true));
    $('#reader').querySelectorAll('[data-route-none]').forEach((b) => b.onclick = () => setRoute(Number(b.dataset.routeNone), false));
  }

  function itemsPage() {
    const a = x.adv;
    const grantedBy = new Map();
    const usedBy = new Map();
    for (const p of Object.values(a.pages)) {
      if (p.loot) grantedBy.set(p.loot, (grantedBy.get(p.loot) || 0) + 1);
      for (const o of p.options) if (o.condition?.type === 'LootItem') usedBy.set(o.condition.value, (usedBy.get(o.condition.value) || 0) + 1);
    }
    for (const r of a.routes) for (const f of r.firstSelects) if (f.needsItem) usedBy.set(f.needsItem, (usedBy.get(f.needsItem) || 0) + 1);
    const have = new Set(owned());
    // One card per main route (plus any memory no route grants).
    const groups = [...a.routes.map((r) => ({ id: r.id, name: r.name, items: a.items.filter((i) => i.route === r.id) })),
      { id: 'other', name: 'Other', items: a.items.filter((i) => !a.routes.some((r) => r.id === i.route)) }].filter((g) => g.items.length);
    return head([a.name], 'Loot items', `${a.items.length} items. Saved Memories are earned on bad endings and unlock safer choices or new areas on later runs. Tick the ones you already have in the game. You have ${have.size}.`) + `<div class="stage-body">
      ${groups.map((g) => `<section class="card"><h3>${esc(g.name)} <span class="sub">${g.items.filter((i) => have.has(i.id)).length}/${g.items.length} saved</span>
          <span class="h3-actions"><button class="nav-btn" data-items-all="${g.id}">Fill all</button><button class="nav-btn" data-items-none="${g.id}">Clear all</button></span></h3>
        <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th class="num">Saved</th><th>Item</th><th class="num">Found on</th><th class="num">Unlocks</th></tr></thead><tbody>
        ${g.items.map((i) => `<tr class="${have.has(i.id) ? '' : 'unseen'}">
          <td class="num"><input type="checkbox" class="item-toggle" data-item="${i.id}" ${have.has(i.id) ? 'checked' : ''} aria-label="Saved"></td>
          <td><div class="track-name">${esc(i.name)}</div><div class="key">${esc(i.description)}</div></td>
          <td class="num">${grantedBy.get(i.id) ? `${grantedBy.get(i.id)} page${grantedBy.get(i.id) > 1 ? 's' : ''}` : '—'}</td>
          <td class="num">${usedBy.get(i.id) ? `${usedBy.get(i.id)} choice${usedBy.get(i.id) > 1 ? 's' : ''}` : '—'}</td></tr>`).join('')}
        </tbody></table></div></section>`).join('')}</div>`;
  }

  function bindItems(rerender) {
    const a = x.adv;
    const inGroup = (id) => a.items.filter((i) => (id === 'other' ? !a.routes.some((r) => r.id === i.route) : i.route === Number(id)));
    const setGroup = (id, on) => { for (const i of inGroup(id)) setItem(i.id, on); refreshRun(); rerender(); };
    $('#reader').querySelectorAll('.item-toggle').forEach((c) => c.onchange = () => { setItem(Number(c.dataset.item), c.checked); refreshRun(); rerender(); });
    $('#reader').querySelectorAll('[data-items-all]').forEach((b) => b.onclick = () => setGroup(b.dataset.itemsAll, true));
    $('#reader').querySelectorAll('[data-items-none]').forEach((b) => b.onclick = () => setGroup(b.dataset.itemsNone, false));
  }

  // A run in progress picks up memories ticked here (and drops cleared ones) when it is
  // still on the area map; mid-route it keeps what it had.
  function refreshRun() {
    if (x.play && x.play.page == null) x.play.items = owned();
  }

  // ---------- SD Lobby ----------
  function lobbyTree(page) {
    return `<details class="group" open><summary>SD Lobby</summary>
      ${x.lobby.map((l) => link(`#/minigame/sdlobby/${l.id}`, esc(l.name), l.secret ? 'secret' : '', page === l.id)).join('')}</details>`;
  }

  function lobbyPage(id) {
    const l = x.lobby.find((v) => v.id === id) || x.lobby[0];
    const bgm = Object.entries(l.bgm).filter(([, v]) => v);
    return head(['Minigames', 'SD Lobby'], esc(l.name), l.description) + `<div class="stage-body">
      <section class="card"><h3>Details</h3><dl class="facts">
        ${l.shop ? `<dt>Shop text</dt><dd>${esc(l.shop)}</dd>` : ''}
        <dt>Art map</dt><dd class="key">${esc(l.resource)}</dd>
        ${bgm.map(([k, v]) => `<dt>${{ ambient: 'Ambient', idle: 'BGM', touch: 'Touch BGM' }[k]}</dt><dd class="key">${esc(v)}</dd>`).join('')}
      </dl></section>
      ${l.cinematics.map((c) => `<section class="card"><h3>Cinematic</h3><dl class="facts">
        <dt>Timeline</dt><dd class="key">${esc(c.asset)}</dd>
        ${c.steps.map((s, i) => `<dt>Step ${i + 1}</dt><dd>${esc(s.trigger)}${s.loop ? ' · loops' : ''}${s.touch ? ' · touch input' : ''}</dd>`).join('')}
      </dl></section>`).join('')}
    </div>`;
  }

  // Routing for the three games; hash is "#/minigame/<game>/...".
  async function route(game, rest, rerender) {
    await load(game);
    if (game === 'dicetrack') {
      const page = rest[0] === 'missions' ? 'missions' : 'board';
      return { tree: diceTree(page), html: dicePage(page) };
    }
    if (game === 'textadv') {
      if (rest[0] === 'route') {
        const id = Number(rest[1]);
        return { tree: advTree('route', id), html: routePage(id), bind: () => bindRoute(id, rerender) };
      }
      const page = rest[0] === 'items' ? 'items' : 'endings';
      return { tree: advTree(page), html: page === 'items' ? itemsPage() : endingsPage(), bind: page === 'items' ? () => bindItems(rerender) : () => bindEndings(rerender) };
    }
    if (game === 'sdlobby') {
      const id = Number(rest[0]) || x.lobby[0]?.id;
      return { tree: lobbyTree(id), html: lobbyPage(id) };
    }
    return null;
  }

  return { route };
})();
