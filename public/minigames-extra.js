// Nikke Library — VOLT TRIP (Dice Track), Fading Affection (Text Adventure Plus)
// and the other event minigames, shown as extra tabs of the Minigames section.
const MinigameExtras = (() => {
  const fmt = (n) => Number(n).toLocaleString('en-US');
  const day = (iso) => (iso ? String(iso).slice(0, 10) : null);
  const x = { dice: null, adv: null, advs: {}, play: null, events: null, eg: {}, egt: {} };
  const rewardList = (reward) => !reward ? '<span class="key">—</span>'
    : [...(reward.userExp ? [{ name: 'Commander EXP', amount: reward.userExp }] : []), ...reward.items]
      .map((i) => `<div>${esc(i.name)} <span class="reward-amt">×${fmt(i.amount)}</span>${i.chance < 100 ? ` <span class="chance">${fmtPct(i.chance, 2)}</span>` : ''}${boxToggle(i)}</div>`).join('');
  const head = (crumb, title, desc, extra = '') => `<div class="scene-head">
      <div class="crumb">${crumb.map(esc).join(' · ')}</div><div class="scene-title">${title}</div>
      ${desc ? `<p class="album-desc">${esc(desc)}</p>` : ''}${extra}</div>`;
  const link = (hash, label, meta, active) =>
    `<a class="scene-link ${active ? 'active' : ''}" href="${hash}"><span>${label}</span><span class="lines">${meta ?? ''}</span></a>`;

  async function load(kind) {
    if (kind === 'dicetrack' && !x.dice) x.dice = await (await apiFetch('/api/dicetrack')).json();
    if (kind === 'textadv' && !x.advs.textadv) x.advs.textadv = await (await apiFetch('/api/textadv')).json();
    if (!x.events) x.events = await (await apiFetch('/api/eventgames')).json();
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
          ${s.pool.map((p) => `<tr><td class="num">${fmtPct(p.chance, 2)}</td><td class="obtain">${rewardList(p.reward)}</td></tr>`).join('')}
          </tbody></table></div></section>`).join('')}
      </div>`;
  }

  // ---------- Fading Affection ----------
  // Endings seen and Saved Memories (loot items) carry over between runs, like in
  // the game: dying earns a memory that unlocks a safer choice next time.
  // Fading Affection and White Memory share this player; `cur` is the game on screen, and each keeps
  // its own endings, memories and picked choices (the Fading Affection keys are unchanged).
  const GAMES = {
    textadv: { id: 'textadv', key: 'textadv', base: '#/minigame/textadv', fam: 'scenariobackground', ext: 'jpg' },
    whitememory: { id: 'whitememory', key: 'whitememory', base: '#/minigame/whitememory/play', fam: 'icons-event', ext: 'webp' },
  };
  let cur = GAMES.textadv;
  const setGame = (id) => {
    if (cur.id !== id) reachMemo.clear();
    cur = GAMES[id];
    x.adv = x.advs[id];
  };
  const K = { get seen() { return `${cur.key}Endings`; }, get items() { return `${cur.key}Items`; }, get picked() { return `${cur.key}Picked`; }, get ignore() { return `${cur.key}IgnoreReq`; } };
  const seen = () => new Set(store.get(K.seen, []));
  const markSeen = (page) => { const s = seen(); s.add(page); store.set(K.seen, [...s]); };
  const owned = () => store.get(K.items, []);
  const addItem = (id) => { const s = new Set(owned()); s.add(id); store.set(K.items, [...s]); };
  const setItem = (id, on) => { const s = new Set(owned()); if (on) s.add(id); else s.delete(id); store.set(K.items, [...s]); };
  const setSeen = (page, on) => { const s = seen(); if (on) s.add(page); else s.delete(page); store.set(K.seen, [...s]); };
  // Choices picked so far: option ids, and "f<id>" for a route's starting area.
  const picked = () => new Set(store.get(K.picked, []));
  const markPicked = (id) => { const s = picked(); s.add(id); store.set(K.picked, [...s]); };
  const ENDING_LABEL = { DEATH: 'Death', EROSION: 'Corruption', TRUEENDING: 'True ending', HIDDEN: 'Hidden', NORMAL: 'Normal ending', BAD: 'Bad ending' };

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
      ${link(`${cur.base}/endings`, 'Endings', `${a.routes.reduce((n, r) => n + r.endings.filter((e) => s.has(e.page)).length, 0)}/${a.routes.reduce((n, r) => n + r.endings.length, 0)}`, page === 'endings')}
      ${link(`${cur.base}/items`, 'Loot items', a.items.length, page === 'items')}
      ${a.help?.length ? link(`${cur.base}/help`, 'How to play', a.help.length, page === 'help') : ''}</details>
      <details class="group" open><summary>Play a route</summary>
      ${a.routes.map((r) => link(`${cur.base}/route/${r.id}`, esc(r.name), r.unlock ? `from ${day(r.unlock.value)}` : '', page === 'route' && routeId === r.id)).join('')}
      </details>`;
  }

  // A fresh run of a route.
  function newRun(route) {
    const st = x.adv.stats;
    return { game: cur.id, route: route.id, page: null, hp: st ? st.hp.start : 0, food: st ? st.food.start : 0, erosion: route.startCorruption || 0, items: owned(), log: [], notice: null, image: null };
  }

  const ignoreReq = () => store.get(K.ignore, false);
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
    if (p.image) run.image = p.image; // a scene picture stays up until the next one
    if (p.loot && !run.items.includes(p.loot)) { run.items.push(p.loot); addItem(p.loot); run.notice = `Obtained ${itemName(p.loot)} (kept for future runs)`; }
    if (p.ending) markSeen(p.id);
  }

  function choose(run, opt) {
    const st = x.adv.stats;
    const route = x.adv.routes.find((r) => r.id === run.route);
    run.log.push({ page: run.page, choice: opt.text });
    markPicked(opt.id);
    if (st) {
      run.hp = Math.max(0, Math.min(st.hp.max, run.hp + (opt.hp || 0)));
      run.food = Math.max(0, run.food + (opt.food || 0));
    }
    if (st && route.corruption) run.erosion = Math.max(0, Math.min(st.erosion.max, run.erosion + (opt.erosion || 0)));
    let next = opt.page;
    if (st && run.hp <= 0 && opt.deathPage) next = opt.deathPage;
    else if (st && route.corruption && run.erosion >= st.erosion.max && opt.erosionPage) next = opt.erosionPage;
    arrive(run, next);
  }

  // Web copies made by tools/web-images.py; hidden when an image hasn't been extracted.
  const sceneImg = (name, cls = 'adv-scene') => gameImg(cur.fam, name, cls);
  const iconImg = (name) => gameImg('icons-event', name, 'adv-icon');

  const delta = (n, label) => (n ? `<span class="delta ${n > 0 ? 'up' : 'down'}">${label} ${n > 0 ? '+' : ''}${n}</span>` : '');

  function routePage(routeId) {
    const a = x.adv;
    const route = a.routes.find((r) => r.id === routeId);
    if (!route) return '<div class="error">Route not found.</div>';
    if (!x.play || x.play.game !== cur.id || x.play.route !== routeId) x.play = newRun(route);
    const run = x.play;
    const st = a.stats;
    const ign = ignoreReq();
    const statsBar = `<div class="adv-stats">
      ${st ? `<span>${esc(st.hp.name)} <b>${run.hp}/${st.hp.max}</b></span><span>${esc(st.food.name)} <b>${run.food}</b></span>
      ${route.corruption ? `<span>${esc(st.erosion.name)} <b>${run.erosion}/${st.erosion.max}</b></span>` : ''}` : ''}
      <span>Memories <b>${run.items.length}</b></span>
      <label class="toggle"><input type="checkbox" id="adv-ign" ${ign ? 'checked' : ''}> Ignore requirements</label>
      <button class="nav-btn" id="adv-restart">Restart route</button>
      <button class="nav-btn" id="adv-reset" title="Forget all endings and memories">Reset progress</button></div>`;

    const log = run.log.map((l) => `<div class="adv-past">${a.pages[l.page]?.image ? sceneImg(a.pages[l.page].image, 'adv-scene past') : ''}<div class="adv-text">${esc(a.pages[l.page]?.text || '')}</div>
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
          ${run.image ? sceneImg(run.image) : ''}
          <div class="adv-text">${esc(p.text)}</div>
          <div class="adv-options">
          ${p.type === 'SelectPage' ? opts.map((o, i) => {
            const req = requirement(o.condition, run);
            const locked = !ign && !req.ok;
            return `<button class="option adv-opt" data-opt="${p.options.indexOf(o)}" ${locked ? 'disabled' : ''}>
              ${esc(o.text)}${o.hidden ? ' <span class="tag">HIDDEN</span>' : ''}
              ${choiceStatus(o.id, [o.page, o.deathPage, o.erosionPage])}
              <span class="deltas">${st ? `${delta(o.hp, st.hp.name)}${delta(o.food, st.food.name)}${route.corruption ? delta(o.erosion, st.erosion.name) : ''}` : ''}</span>
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
    $('#adv-ign').onchange = (e) => { store.set(K.ignore, e.target.checked); rerender(); };
    $('#adv-restart').onclick = () => { x.play = newRun(a.routes.find((r) => r.id === routeId)); rerender(); };
    $('#adv-reset').onclick = () => {
      if (!confirm('Forget every ending cleared, memory found and choice picked?')) return;
      store.set(K.seen, []); store.set(K.items, []); store.set(K.picked, []);
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
        if (p.toFirstSelect || !p.next) { run.page = null; run.notice = null; run.image = null; } else arrive(run, p.next);
      } else if (b.dataset.restart) x.play = newRun(route);
      rerender();
      const pages = $('#reader').querySelectorAll('.adv-page');
      pages[pages.length - 1]?.scrollIntoView({ block: 'start' });
    });
  }

  // The ending page's picture as a thumbnail that opens the full image.
  const endingThumb = (name) => (name
    ? `<a class="ending-thumb" href="img/${cur.fam}/${esc(name.toLowerCase())}.${cur.ext}" target="_blank" rel="noopener">${sceneImg(name, 'ending-img')}</a>` : '');

  function endingsPage() {
    const a = x.adv;
    const s = seen();
    return head([a.name], 'Endings', 'Tick the endings you have cleared, in the game or here. Endings reached while playing are ticked automatically. Kept in this browser.') + `<div class="stage-body">
      ${a.routes.map((r) => `<section class="card"><h3>${esc(r.name)} <span class="sub">${r.endings.filter((e) => s.has(e.page)).length}/${r.endings.length} cleared</span>
          <span class="h3-actions"><button class="nav-btn" data-route-all="${r.id}">Mark all</button><button class="nav-btn" data-route-none="${r.id}">Clear all</button></span></h3>
        <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th class="num">Cleared</th><th>Ending</th><th>Hint</th></tr></thead><tbody>
        ${r.endings.map((e) => `<tr class="${s.has(e.page) ? '' : 'unseen'}">
          <td class="num"><input type="checkbox" class="ending-toggle" data-page="${e.page}" ${s.has(e.page) ? 'checked' : ''} aria-label="Cleared"></td>
          <td><div class="roster-name">${endingThumb(a.pages[e.page]?.image)}<div><span class="tag ending-tag ending-${e.type.toLowerCase()}">${esc(ENDING_LABEL[e.type] || e.type)} ${e.num}</span> ${esc(e.title)}</div></div></td>
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
          <td><div class="item-cell">${iconImg(i.icon)}<div><div class="track-name">${esc(i.name)}</div><div class="key">${esc(i.description)}</div></div></div></td>
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

  // Event minigames: every Event<Game>* table family, one tab each, shown table by table.
  const egBase = '#/minigame';
  const ROW_LIMIT = 300;

  function eventsTree(game, page) {
    const g = game;
    // Viewer pages in their groups (in order of first appearance), then the raw tables.
    const groups = new Map();
    for (const p of g.view?.pages || []) {
      const k = p.group || g.name;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(p);
    }
    const pageLink = (p) => link(`${egBase}/${g.id}/p/${encodeURIComponent(p.id)}`, esc(p.title), p.count, page === `p/${p.id}`);
    const onTable = g.tables.some((t) => t.name === page);
    return `<details class="group" open><summary>${esc(g.name)}</summary>
      ${link(`${egBase}/${g.id}`, 'Overview', '', !page)}
      ${g.help.length ? link(`${egBase}/${g.id}/help`, 'How to play', g.help.length, page === 'help') : ''}
      ${(groups.get(g.name) || []).map(pageLink).join('')}</details>
      ${[...groups].filter(([k]) => k !== g.name).map(([k, ps]) => `<details class="group" open><summary>${esc(k)}</summary>
        ${ps.map(pageLink).join('')}</details>`).join('')}
      <details class="group" ${onTable || !g.view ? 'open' : ''}><summary>Data tables</summary>
      ${g.tables.map((t) => link(`${egBase}/${g.id}/${encodeURIComponent(t.name)}`, esc(t.name), t.rows, page === t.name)).join('')}
      </details>`;
  }

  // A cell is text or a number, or { img }, { reward }, { scene, label }.
  function egCell(v, col) {
    if (v == null || v === '') return '';
    if (typeof v === 'number') return /(^|_)(id|group)(_|$)/i.test(col.key) ? String(v) : fmtShort(v);
    if (typeof v !== 'object') {
      const text = String(v).replace(/<\/?(color|b|i|size)\b[^>]*>/g, ''); // Unity rich-text tags
      return `<span class="${text.length > 60 ? 'eg-long' : ''}">${esc(text).replace(/\n/g, '<br>')}</span>`;
    }
    if (v.img) return `<span class="eg-icon">${gameImg('icons-event', v.img, 'eg-img')}<span class="key">${esc(v.img)}</span></span>`;
    if (v.reward) return rewardList(v.reward);
    if (v.scene) return `<a href="#/scene/${encodeURIComponent(v.scene)}">${esc(v.label)}</a>`;
    return esc(JSON.stringify(v));
  }

  // ---- Viewer pages (lib/eventgames/<id>.js): sections of text, facts, tables, galleries ----
  // A value is text, a number, an array (one per line), or { img, caption, size }, { reward },
  // { scene, label }, { page, label }, { b }, { key }, { text, sub }, { tag, tone }.
  function vCell(v, g, short) {
    if (v == null || v === '' || v === false) return '';
    if (v === true) return '✓';
    if (typeof v === 'number') return short ? fmtShort(v) : fmtNum(v);
    if (typeof v !== 'object') {
      const t = esc(String(v)).replace(/\n/g, '<br>');
      return String(v).length > 60 ? `<span class="eg-long">${t}</span>` : t; // long text keeps a readable width in tables
    }
    if (Array.isArray(v)) {
      // Pictures side by side, anything else one per line.
      if (v.length && v.every((c) => c && c.img !== undefined)) return `<div class="v-row">${v.map((c) => vCell(c, g)).join('')}</div>`;
      return v.map((c) => vCell(c, g)).filter(Boolean).join('<br>');
    }
    if (v.img !== undefined) {
      return v.img ? `<figure class="v-fig">${gameImg('icons-event', v.img, `v-img ${v.size || ''}`)}${v.caption ? `<figcaption>${esc(v.caption)}</figcaption>` : ''}</figure>`
        : (v.caption ? `<span class="v-cap">${esc(v.caption)}</span>` : ''); // picture not extracted
    }
    if (v.reward !== undefined) return rewardList(v.reward);
    if (v.scene) return `<a href="#/scene/${encodeURIComponent(v.scene)}">${esc(v.label || v.scene)}</a>`;
    if (v.page) return `<a href="${egBase}/${g.id}/p/${encodeURIComponent(v.page)}">${esc(v.label || v.page)}</a>`;
    if (v.b != null) return `<b>${vCell(v.b, g, short)}</b>`;
    if (v.key != null) return `<span class="key">${esc(String(v.key))}</span>`;
    if (v.tag != null) return `<span class="v-tag ${v.tone || ''}">${esc(String(v.tag))}</span>`;
    if (v.text != null) return `${vCell(v.text, g)}${v.sub ? `<div class="key">${vCell(v.sub, g)}</div>` : ''}`;
    return esc(JSON.stringify(v));
  }

  function vSection(s, g) {
    const h = s.title ? `<h3>${esc(s.title)}${s.sub ? ` <span class="sub">${esc(s.sub)}</span>` : ''}</h3>` : '';
    const note = s.note ? `<p class="album-desc">${esc(s.note)}</p>` : '';
    if (s.type === 'text') return `<section class="card">${h}${note}<div class="v-text">${vCell(s.text, g)}</div></section>`;
    if (s.type === 'list') return `<section class="card">${h}${note}<ul class="v-list">${s.items.map((i) => `<li>${vCell(i, g)}</li>`).join('')}</ul></section>`;
    if (s.type === 'help') return helpHtml(s.help || []);
    if (s.type === 'facts') {
      return `<section class="card">${h}${note}<dl class="facts">${s.items.filter((i) => i && i[1] !== '' && i[1] != null)
        .map(([k, v]) => `<dt>${esc(k)}</dt><dd>${vCell(v, g)}</dd>`).join('')}</dl></section>`;
    }
    if (s.type === 'gallery') {
      return `<section class="card">${h}${note}<div class="v-gallery">${s.items.map((i) => `<figure class="v-fig">
        ${gameImg('icons-event', i.img, 'v-img')}<figcaption>${vCell(i.caption, g)}</figcaption></figure>`).join('')}</div></section>`;
    }
    if (s.type === 'table') {
      // Page patterns: compact rows, sticky name column on wide tables, the explanation under the table.
      const cols = s.columns.map((c) => (typeof c === 'string' ? { label: c } : c));
      const cls = (c) => (c?.num ? ' class="num"' : '');
      return `<section class="card eg-card">${h}<div class="table-scroll"><table class="roster keep-cols eg-table v-table${cols.length > 4 ? ' sticky-first' : ''}">
        <thead><tr>${cols.map((c) => `<th${cls(c)}>${esc(c.label)}</th>`).join('')}</tr></thead>
        <tbody>${s.rows.map((r) => `<tr>${r.map((v, j) => `<td${cls(cols[j])}>${vCell(v, g, cols[j]?.num)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table></div>${s.note ? `<p class="key note">${esc(s.note)}</p>` : ''}</section>`;
    }
    return '';
  }

  const vSections = (sections, g) => (sections || []).map((s) => vSection(s, g)).join('');

  function egOverview(g) {
    return head(['Minigames'], esc(g.name), g.view?.summary || null) + `<div class="stage-body">
      ${vSections(g.view?.overview, g)}
      ${!g.intro && !g.folder && !g.help.length ? '' : `<section class="card"><h3>Details</h3><dl class="facts">
        ${g.intro ? `<dt>Intro story</dt><dd><a href="#/scene/${encodeURIComponent(g.intro.id)}">${esc(g.intro.label)}</a></dd>` : ''}
        ${g.folder ? `<dt>Images</dt><dd class="key">icons-event/${esc(g.folder)}</dd>` : ''}
        ${g.help.length ? `<dt>Guide</dt><dd><a href="${egBase}/${g.id}/help">How to play</a> (${g.help.length} sections)</dd>` : ''}
      </dl></section>`}
      <section class="card eg-card"><h3>Data tables</h3><div class="table-scroll"><table class="roster keep-cols"><thead><tr><th>Table</th><th class="num">Rows</th></tr></thead><tbody>
        ${g.tables.map((t) => `<tr><td><a href="${egBase}/${g.id}/${encodeURIComponent(t.name)}">${esc(t.name)}</a></td><td class="num">${fmt(t.rows)}</td></tr>`).join('')}
      </tbody></table></div></section></div>`;
  }

  // Small tables (a game's settings) read better as one fact list per row.
  function egTable(g, t, all) {
    const title = head(['Minigames', g.name], esc(t.name), `Event${t.table.slice(5)} · ${fmt(t.rows.length)} row(s)`);
    if (t.rows.length <= 3) {
      return title + `<div class="stage-body">${t.rows.map((r, i) => `<section class="card"><h3>${t.rows.length > 1 ? `Row ${i + 1}` : 'Values'}</h3><dl class="facts">
        ${t.columns.map((c, j) => (r[j] === '' ? '' : `<dt>${esc(c.label)}</dt><dd>${egCell(r[j], c)}</dd>`)).join('')}</dl></section>`).join('')}</div>`;
    }
    const rows = all ? t.rows : t.rows.slice(0, ROW_LIMIT);
    // A column is a number column when every filled cell in it is a number.
    const numCol = t.columns.map((c, j) => rows.some((r) => typeof r[j] === 'number') && rows.every((r) => r[j] === '' || r[j] == null || typeof r[j] === 'number'));
    const cls = (j) => (numCol[j] ? ' class="num"' : '');
    return title + `<div class="stage-body"><section class="card eg-card"><div class="table-scroll"><table class="roster keep-cols eg-table${t.columns.length > 4 ? ' sticky-first' : ''}">
      <thead><tr>${t.columns.map((c, j) => `<th${cls(j)}>${esc(c.label)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((r) => `<tr>${r.map((v, j) => `<td${cls(j)}>${egCell(v, t.columns[j])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      ${rows.length < t.rows.length ? `<button class="nav-btn" id="eg-all">Show all ${fmt(t.rows.length)} rows</button>` : ''}</section></div>`;
  }

  async function eventsRoute(rest, rerender) {
    const id = rest[0] || x.events[0]?.id;
    if (!x.eg[id]) {
      const res = await apiFetch(`/api/eventgame?id=${encodeURIComponent(id)}`);
      if (!res.ok) return null;
      x.eg[id] = await res.json();
    }
    const g = x.eg[id];
    const page = rest[1] ? decodeURIComponent(rest[1]) : null;
    if (!page) return { tree: eventsTree(g, null), html: egOverview(g) };
    if (page === 'help') return { tree: eventsTree(g, 'help'), html: head([g.name], 'How to play', 'The in-game guide.') + helpHtml(g.help) };
    if (page === 'p' && rest[2]) {
      const pid = decodeURIComponent(rest[2]);
      const key = `${id}/p/${pid}`;
      if (!x.egt[key]) {
        const res = await apiFetch(`/api/eventgame/page?id=${encodeURIComponent(id)}&page=${encodeURIComponent(pid)}`);
        if (!res.ok) return null;
        x.egt[key] = await res.json();
      }
      const pg = x.egt[key];
      return {
        tree: eventsTree(g, `p/${pid}`),
        html: head(['Minigames', g.name, ...(pg.group ? [pg.group] : [])], esc(pg.title), pg.summary || null) + `<div class="stage-body">${vSections(pg.sections, g)}</div>`,
      };
    }
    const key = `${id}/${page}`;
    if (!x.egt[key]) {
      const res = await apiFetch(`/api/eventgame/table?id=${encodeURIComponent(id)}&table=${encodeURIComponent(page)}`);
      if (!res.ok) return null;
      x.egt[key] = await res.json();
    }
    const t = x.egt[key];
    return {
      tree: eventsTree(g, page),
      html: egTable(g, t, x.egAll === key),
      bind: () => { const b = $('#eg-all'); if (b) b.onclick = () => { x.egAll = key; rerender(); }; },
    };
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
      if (rest[0] === 'help') return { tree: advTree('help'), html: head([x.adv.name], 'How to play', 'The in-game guide.') + helpHtml(x.adv.help || []) };
      const page = rest[0] === 'items' ? 'items' : 'endings';
      return { tree: advTree(page), html: page === 'items' ? itemsPage() : endingsPage(), bind: page === 'items' ? () => bindItems(rerender) : () => bindEndings(rerender) };
    }
    if (x.events.some((g) => g.id === game)) return eventsRoute([game, ...rest], rerender);
    return null;
  }

  return { route };
})();
