// Nikke Library — field maps: the 3D field (three.js, loaded only here) with its stages,
// relics, switches, gates and teleports as labels, and the same things as tables.
const Maps = (() => {
  const m = {
    list: null,
    current: null,
    layers: store.get('mapLayers', { stage: true, relic: true, switch: true, teleport: true, start: true }),
    view: null, // the live viewer (one WebGL context at a time)
    selected: null,
    state: 0, // timeline state of the open event map (index into its timeline.states)
    viewMode: store.get('mapView', 'flat'), // 'flat' (walkable-area map) | '3d'
    mode: store.get('mapMode', 'Normal'), // campaign difficulty shown in the list: Normal | Hard | Story
  };
  const MODES = ['Normal', 'Hard', 'Story'];
  const href = (id, pid) => `#/map/${encodeURIComponent(id)}${pid ? `/${pid}` : ''}`;
  const KIND_LABEL = { campaign: 'Campaign', event: 'Events', lostsector: 'Lost Sectors', other: 'Other' };
  // gates share the switches' toggle: a gate means nothing without the switch that opens it
  const LAYERS = [['stage', 'Stages'], ['relic', 'Relics'], ['switch', 'Switches & gates'], ['teleport', 'Teleports'], ['start', 'Start'], ['npc', 'NPCs'], ['target', 'Event spots'], ['side', 'Side quests'], ['backdrop', 'Backdrop']];
  const layerOf = (x) => (x.layer === 'gate' ? 'switch' : x.layer);
  // Every layer starts shown except side quests (event / favourite-item stages placed on the field)
  // and the backdrop (far-off scenery around the field, see maps.py).
  const OFF_BY_DEFAULT = ['side', 'backdrop'];
  const isOn = (k) => (OFF_BY_DEFAULT.includes(k) ? m.layers[k] === true : m.layers[k] !== false);
  // A marker is shown when its layer is on and the timeline state is one where it exists: marker.vis is a
  // string with one '0'/'1' per state, present only for markers that change over the event.
  const shown = (x) => isOn(layerOf(x)) && (!x.vis || x.vis[m.state] !== '0');
  const elemDot = (e) => `<span class="elem elem-${esc(e.toLowerCase())}" title="${esc(e)}"></span>`;
  const elems = (list) => (list?.length ? list.map((e) => `${elemDot(e)} ${esc(e)}`).join(', ') : '—');
  const rewardText = (x) => (x.scene
    ? x.rewards.map((r) => `<a href="#/scene/${x.scene}">${esc(r.name)}</a>`).join(', ')
    : x.rewards.map((r) => `${esc(r.name)}${r.amount > 1 ? ` ×${fmtNum(r.amount)}` : ''}`).join(', ')) || '—';
  const stageNo = (label) => String(label).replace(/^\d+-/, ''); // "50-15" -> "15" on the map

  async function enter() {
    if (!m.list) m.list = await (await apiFetch('/api/maps')).json();
    m.current = null; // another section replaced the page: render it again
    renderTabs();
    renderTree();
  }

  // Campaign maps come in three difficulties on the same art; the tabs pick which one the list shows.
  function renderTabs() {
    $('#cat-tabs').innerHTML = MODES.map((mode) => {
      const n = m.list.filter((x) => x.kind === 'campaign' && x.mode === mode).length;
      return n ? `<button class="cat-tab ${m.mode === mode ? 'active' : ''}" data-mode="${mode}">${mode}<span class="n">${n}</span></button>` : '';
    }).join('');
    $('#cat-tabs').querySelectorAll('[data-mode]').forEach((b) => b.onclick = () => setMode(b.dataset.mode, true));
  }

  // Switching modes on a map page opens the same chapter in that mode.
  function setMode(mode, follow) {
    if (m.mode === mode) return;
    m.mode = mode;
    store.set('mapMode', mode);
    renderTabs();
    renderTree();
    const v = follow && m.current?.versions.find((x) => x.mode === mode && x.available);
    if (v) location.hash = href(v.id);
    else if (!m.current) overview();
  }

  const filtered = () => {
    const f = state.filter;
    return m.list.filter((x) => (x.kind !== 'campaign' || x.mode === m.mode)
      && (!f || [x.title, x.id, x.group].some((v) => v && String(v).toLowerCase().includes(f))));
  };

  function renderTree() {
    const list = filtered();
    const groups = [...new Set(list.map((x) => KIND_LABEL[x.kind] || x.kind))];
    $('#tree').innerHTML = groups.map((g) => {
      const members = list.filter((x) => (KIND_LABEL[x.kind] || x.kind) === g);
      return `<details class="group" open><summary>${esc(g)}<span class="count">${members.length}</span></summary>
        ${members.map((x) => `<a class="scene-link ${m.current?.id === x.id ? 'active' : ''}" href="${href(x.id)}" title="${esc(x.id)}">
          <span>${esc(x.title)}</span><span class="lines">${x.kind === 'event' ? x.npcs : x.stages}</span></a>`).join('')}</details>`;
    }).join('') || '<p class="key" style="padding:12px">No matches.</p>';
  }

  async function route() {
    const r = location.hash.match(/^#\/map\/([^/]+)(?:\/([\w-]+))?/);
    if (!r) { dispose(); m.current = null; renderTree(); return overview(); }
    const id = decodeURIComponent(r[1]);
    if (m.current?.id !== id) {
      const res = await apiFetch('/api/map?id=' + encodeURIComponent(id));
      if (!res.ok) { $('#reader').innerHTML = '<div class="error">Map not found.</div>'; return; }
      m.current = await res.json();
      if (m.current.mode && m.current.mode !== m.mode) setMode(m.current.mode, false);
      renderTree();
      renderMap();
    }
    // "/s6050015" (from a stage page) picks that stage's marker; anything else is a positionid
    const sid = r[2]?.match(/^s(\d+)$/)?.[1];
    const pick = sid ? m.current.markers.find((x) => x.layer === 'stage' && x.id === Number(sid))?.pid : r[2];
    select(pick || null, !!pick);
  }

  // Landing page (README "Page patterns": section hub): one card per chapter in the chosen mode,
  // with its top-down thumbnail, so Maps works on a phone without opening the sidebar.
  function overview() {
    const list = filtered();
    const camp = list.filter((x) => x.kind === 'campaign');
    const groups = [];
    for (const x of camp) {
      const from = Math.floor(x.chapter / 10) * 10;
      const title = `Chapters ${from}–${from + 9}`;
      if (groups.at(-1)?.title !== title) groups.push({ title, cards: [] });
      groups.at(-1).cards.push({ href: href(x.id), title: `Chapter ${x.chapter}`, text: x.title.replace(/^Chapter \d+ · /, ''),
        n: `${x.stages} stages`, img: x.thumb });
    }
    const other = list.filter((x) => x.kind !== 'campaign');
    for (const kind of [...new Set(other.map((x) => x.kind))]) {
      groups.push({ title: KIND_LABEL[kind] || 'Other', cards: other.filter((x) => x.kind === kind).map((x) => ({
        href: href(x.id), title: x.title,
        n: x.kind === 'event' ? `${x.npcs} NPCs · ${x.relics} items` : `${x.stages} stages`, img: x.img || x.thumb })) });
    }
    const modes = `<div class="seg map-hub-modes">${MODES.map((mode) => `<button class="${m.mode === mode ? 'active' : ''}" data-mode="${mode}">${mode}</button>`).join('')}</div>`;
    $('#reader').innerHTML = hubHtml({
      title: 'Maps',
      text: 'Campaign and event fields: the walkable area or the 3D model with every stage, NPC, item, switch and teleport, and for events a timeline of how the field changes.',
      groups: groups.length ? groups : [{ cards: [] }],
    }).replace('</h1>', `</h1>${modes}`);
    $('#reader').querySelectorAll('.map-hub-modes [data-mode]').forEach((b) => b.onclick = () => setMode(b.dataset.mode, false));
  }

  // --- page ---------------------------------------------------------------------------

  function renderMap() {
    dispose();
    const c = m.current;
    const by = (layer) => c.markers.filter((x) => x.layer === layer);
    const stages = by('stage').sort((a, b) => a.id - b.id);
    const relics = by('relic');
    const npcs = by('npc');
    const layers = LAYERS.filter(([k]) => k === 'backdrop' || c.markers.some((x) => layerOf(x) === k)); // only what this map has
    const tl = c.timeline;
    const noteRows = (tl?.states || []).flatMap((st, i) => (st.notes || []).map((n) => ({ i, st, n })));
    const versions = c.versions.length > 1 ? `<div class="seg">${c.versions.map((v) => v.available
      ? `<a class="seg-link ${v.id === c.id ? 'active' : ''}" href="${href(v.id)}">${esc(v.mode)}</a>`
      : `<span class="seg-link off" title="Not exported yet">${esc(v.mode)}</span>`).join('')}</div>` : '';
    const row = (x, cells) => `<tr class="map-row" data-pid="${x.pid}">${cells}</tr>`;

    $('#reader').innerHTML = `
      <div class="scene-head">
        <div class="crumb">${[...new Set(['Maps', KIND_LABEL[c.kind], c.group].filter(Boolean))].map(esc).join(' · ')}</div>
        <div class="scene-title">${esc(c.title)}</div>
        <div class="toolbar">${versions}
          <span class="map-layers">${layers.map(([k, label]) => `<label class="toggle"><input type="checkbox" data-layer="${k}" ${isOn(k) ? 'checked' : ''}>
            <i class="mk-dot mk-${k}"></i>${k === 'relic' && c.kind === 'event' ? 'Items' : label}</label>`).join('')}</span></div>
        ${tl ? `<div class="timeline-bar"><label class="toggle">Timeline
            <select id="tl-state">${tl.states.map((st, i) => `<option value="${i}">${esc(st.label)}</option>`).join('')}</select></label>
          <span class="tl-req" id="tl-req"></span></div>
        <div class="tl-notes" id="tl-notes"></div>` : ''}
      </div>
      <div class="stage-body map-body">
        <section class="card map-card">
          <div class="map-view" id="map-view"><canvas></canvas><div class="map-labels"></div>
            <div class="map-tools">
              ${c.walkable ? `<span class="seg"><button data-view="flat">Map</button><button data-view="3d">3D</button></span>` : ''}
              <span class="rot-btns"><button class="nav-btn" data-rot="ccw" title="Rotate left">⟲</button><button class="nav-btn" data-rot="cw" title="Rotate right">⟳</button><button class="nav-btn" data-rot="tilt" title="Tilt the map">Tilt</button><button class="nav-btn" data-rot="reset" title="Reset the view">Reset</button></span>
              <span class="cam-btns"><button class="nav-btn" data-cam="top">Top</button><button class="nav-btn" data-cam="angle">Angled</button></span></div>
            <div class="map-status">Loading map…</div></div>
          <div class="map-info" id="map-info"></div>
        </section>
        ${stages.length ? `<section class="card"><h3>Stages <span class="sub">${stages.length}</span></h3>
          <div class="table-scroll"><table class="roster keep-cols sticky-first"><thead><tr><th>Stage</th><th class="num">Lv</th><th class="num">CP</th><th>Enemy elements</th><th></th></tr></thead>
          <tbody>${stages.map((x) => row(x, `<td>${esc(x.label)}</td><td class="num">${fmtNum(x.lv)}</td><td class="num">${fmtShort(x.cp)}</td>
            <td>${elems(x.elements)}</td><td><a href="#/stage/campaign/${x.id}">Stage →</a></td>`)).join('')}</tbody></table></div></section>` : ''}
        ${tl ? `<section class="card"><h3>Timeline <span class="sub">${tl.states.length} states</span></h3>
          <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th class="num">#</th><th>State</th><th>Needs</th><th class="num" title="items new in this state (items on the field)">Items</th><th>Art</th><th>Notes</th></tr></thead>
          <tbody>${tl.states.map((st, i) => `<tr class="tl-row" data-state="${i}"><td class="num">${i}</td><td>${esc(st.label)}</td><td>${esc(st.requires)}</td>
            <td class="num">${st.items ? `${st.items.added ? `+${st.items.added}` : '·'} (${st.items.shown})` : '—'}</td><td>${st.art ? esc(st.art) : '—'}</td>
            <td title="${esc((st.notes || []).map((n) => n.text).join(' / '))}">${st.notes ? esc([...new Set(st.notes.map((n) => n.kind))].join(', ')) : '—'}</td></tr>`).join('')}</tbody></table></div>
          <p class="note">Each state is a point on the event's schedule: a date (UTC), often with an event stage that has to be cleared. Pick one to see which NPCs and items exist then. Read from the game's event schedule table (inferred: date and stage are both needed). "Art" is the field art that replaces the base one; only the base art is on the site.</p></section>` : ''}
        ${tl && (noteRows.length || tl.hints?.length) ? `<section class="card"><h3>Field change notes <span class="sub">${noteRows.length + (tl.hints?.length || 0)}</span></h3>
          <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th>State</th><th>About</th><th>Note</th></tr></thead>
          <tbody>${noteRows.map(({ i, st, n }) => `<tr class="tl-row" data-state="${i}"><td>${esc(st.label)}</td><td>${esc(n.kind)}</td><td>${esc(n.text)}</td></tr>`).join('')}
          ${(tl.hints || []).map((h) => `<tr><td>—</td><td>${esc(h.kind)}</td><td>${esc(h.text)}</td></tr>`).join('')}</tbody></table></div>
          <p class="note">The game's own notices: what changes on the map and among the NPCs when an event stage is cleared, and the popups about items and passcodes. A row's state is the first point of the schedule where that stage is cleared.</p></section>` : ''}
        ${npcs.length ? `<section class="card"><h3>NPCs <span class="sub">${npcs.length}</span></h3>
          <div class="table-scroll"><table class="roster keep-cols sticky-first"><thead><tr><th>NPC</th><th>Kind</th><th>Opens</th><th class="num">Lines</th></tr></thead>
          <tbody>${npcs.map((x) => row(x, `<td>${x.icon ? gameImg(x.icon.split('/')[0], x.icon.split('/')[1], 'char-icon') : ''}${esc(x.label)}</td><td>${esc(x.npcType || '—')}</td>
            <td>${x.does?.length ? esc(x.does.join(', ')) : '—'}</td><td class="num">${(x.say?.length || 0) + (x.talk?.length || 0) || '—'}</td>`)).join('')}</tbody></table></div>
          <p class="note">Select an NPC (label or row) to read what it says: the speech bubbles over its head and, for a few, the conversation when you talk to it.</p></section>` : ''}
        ${relics.length ? `<section class="card"><h3>${c.kind === 'event' ? 'Items' : 'Relics'} <span class="sub">${relics.length}</span></h3>
          <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th class="num">#</th><th>Type</th><th>Reward</th>${tl ? '<th>Appears</th>' : ''}</tr></thead>
          <tbody>${relics.map((x) => row(x, `<td class="num">${x.no}</td><td>${esc(x.label)}</td>
            <td>${rewardText(x)}</td>${tl ? `<td>${esc(appearsText(x) || '')}</td>` : ''}`)).join('')}</tbody></table></div>
          ${tl ? '<p class="note">Items are released on a schedule (a date, for a few also an event stage that has to be cleared); all of them leave when the event ends (not shown). "After item" means another item has to be collected first, which the timeline cannot order.</p>' : ''}</section>` : ''}
        ${by('side').length ? `<section class="card"><h3>Side quests <span class="sub">${by('side').length}</span></h3>
          <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th>Quest</th><th>Kind</th></tr></thead>
          <tbody>${by('side').map((x) => row(x, `<td>${esc(x.label)}</td><td>${esc(x.kind)}</td>`)).join('')}</tbody></table></div>
          <p class="note">Event stages and favourite-item quests placed on this field. Their layer starts hidden.</p></section>` : ''}
        ${by('switch').length || by('teleport').length ? `<section class="card"><h3>Switches &amp; teleports</h3>
          <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th>Object</th><th>Does</th></tr></thead><tbody>
          ${by('switch').map((x) => row(x, `<td>${esc(x.name)}</td><td>Opens ${x.opens.map((n) => `gate ${n}`).join(', ') || '—'}${x.repeatable ? ' (repeatable)' : ''}</td>`)).join('')}
          ${by('gate').map((x) => row(x, `<td>Gate ${x.no}</td><td>Opened by ${x.openedBy.map((p) => esc(c.markers.find((s) => s.pid === p)?.name || 'a switch')).join(', ') || '—'}</td>`)).join('')}
          ${by('teleport').map((x) => row(x, `<td>${esc(x.name)}</td><td>${esc(x.label)}</td>`)).join('')}
          </tbody></table></div><p class="note">One-way teleports only go from the entry to the landing spot (the arrow).</p></section>` : ''}
      </div>`;

    $('#reader').querySelectorAll('[data-layer]').forEach((b) => b.onchange = () => {
      m.layers[b.dataset.layer] = b.checked; store.set('mapLayers', m.layers); m.view?.refresh();
    });
    $('#reader').querySelectorAll('.map-row').forEach((tr) => tr.onclick = (e) => {
      if (e.target.closest('a')) return;
      history.replaceState(null, '', href(c.id, tr.dataset.pid));
      select(tr.dataset.pid, true);
      $('#map-view').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
    $('#reader').querySelectorAll('[data-cam]').forEach((b) => b.onclick = () => m.view?.camera(b.dataset.cam));
    m.state = 0;
    $('#tl-state')?.addEventListener('change', (e) => setState(Number(e.target.value)));
    $('#reader').querySelectorAll('.tl-row').forEach((tr) => tr.onclick = () => { setState(Number(tr.dataset.state)); $('#tl-state').value = tr.dataset.state; });
    setState(0);
    $('#reader').querySelectorAll('[data-view]').forEach((b) => b.onclick = () => setView(b.dataset.view));
    $('#reader').querySelectorAll('[data-rot]').forEach((b) => b.onclick = () => m.view?.rot?.(b.dataset.rot));
    startView(c);
  }

  // The flat walkable-area map (like the in-game one) or the 3D field; both show the same labels.
  function startView(c) {
    const flat = m.viewMode === 'flat' && !!c.walkable;
    $('#map-view').classList.toggle('is-flat', flat);
    $('#reader').querySelectorAll('[data-view]').forEach((b) => b.classList.toggle('active', (b.dataset.view === 'flat') === flat));
    $('#reader .cam-btns').hidden = flat;
    $('#reader .rot-btns').hidden = !flat;
    const backdrop = $('[data-layer=backdrop]')?.closest('label');
    if (backdrop) backdrop.hidden = flat; // only the 3D model has a backdrop
    (flat ? createFlat(c) : createViewer(c)).catch((err) => {
      const st = $('.map-status');
      if (st) st.textContent = `Could not load the map (${err.message}).`;
    });
  }

  function setView(mode) {
    if (m.viewMode === mode || !m.current) return;
    m.viewMode = mode;
    store.set('mapView', mode);
    dispose();
    const box = $('#map-view'); // a canvas keeps its first context type, so it is replaced
    box.querySelector('canvas').replaceWith(document.createElement('canvas'));
    box.querySelector('.map-labels').innerHTML = '';
    box.querySelectorAll('.map-tip, .map-count, .map-status').forEach((e) => e.remove());
    box.insertAdjacentHTML('beforeend', '<div class="map-status">Loading map…</div>');
    startView(m.current);
  }

  // Timeline state: which markers exist then, what the state needs, and whether the art changes.
  function setState(i) {
    const tl = m.current?.timeline;
    m.state = tl ? Math.min(i, tl.states.length - 1) : 0;
    if (tl) {
      const st = tl.states[m.state];
      const req = $('#tl-req');
      const art = st.art ? (st.model ? `field art: ${st.art}` : `field art becomes ${st.art} (not on the site: showing the base art)`) : '';
      const items = st.items ? ` · ${st.items.shown} items on the field${st.items.added ? `, ${st.items.added} new` : ''}` : '';
      if (req) req.textContent = `${st.requires}${items}${art ? ` · ${art}` : ''}`;
      const box = $('#tl-notes');
      if (box) box.innerHTML = (st.notes || []).map((n) => `<div class="tl-note"><b>${esc(n.kind)}</b>${esc(n.text)}</div>`).join('');
      m.view?.setArt?.({ model: st.model || m.current.model, walkable: st.walkable || m.current.walkable });
      $('#reader').querySelectorAll('.tl-row').forEach((tr) => tr.classList.toggle('active', Number(tr.dataset.state) === m.state));
    }
    $('#reader').querySelectorAll('.map-row').forEach((tr) => {
      const x = m.current?.markers.find((y) => y.pid === tr.dataset.pid);
      tr.classList.toggle('off', !!x?.vis && x.vis[m.state] === '0');
    });
    m.view?.refresh();
  }

  // The art the timeline state at hand shows (a variant's files, else the field's own).
  const stateArt = (c) => { const st = c.timeline?.states[m.state]; return { model: st?.model || c.model, walkable: st?.walkable || c.walkable }; };

  function infoHtml(x) {
    const c = m.current;
    if (!x) return `<p class="key">Tap a label on the map or a row below.</p>`;
    if (x.layer === 'stage') {
      return `<b>${esc(x.label)}</b> <span class="tag">${esc(x.category || '')}</span>
        <dl class="facts"><dt>Level</dt><dd>${fmtNum(x.lv)}</dd><dt>Recommended CP</dt><dd>${fmtNum(x.cp)}</dd>
        <dt>Enemy elements</dt><dd>${elems(x.elements)}</dd></dl><a href="#/stage/campaign/${x.id}">Stage details →</a>`;
    }
    if (x.layer === 'relic') {
      return `<b>${esc(x.label)} ${x.no}</b><dl class="facts"><dt>${x.scene ? 'Memorial' : 'Reward'}</dt><dd>${rewardText(x)}</dd>
        ${appearsText(x) ? `<dt>Appears</dt><dd>${esc(appearsText(x))}</dd>` : ''}</dl>`;
    }
    if (x.layer === 'switch') return `<b>${esc(x.name)}</b><dl class="facts"><dt>Opens</dt><dd>${x.opens.map((n) => `Gate ${n}`).join(', ') || '—'}</dd></dl>`;
    if (x.layer === 'gate') {
      return `<b>Gate ${x.no}</b><dl class="facts"><dt>Opened by</dt><dd>${x.openedBy.map((p) => esc(c.markers.find((s) => s.pid === p)?.name || '?')).join(', ') || '—'}</dd></dl>`;
    }
    if (x.layer === 'side') return `<b>${esc(x.label)}</b><dl class="facts"><dt>Kind</dt><dd>${esc(x.kind)}</dd></dl>`;
    if (x.layer === 'npc') {
      return `<b>${x.icon ? gameImg(x.icon.split('/')[0], x.icon.split('/')[1], 'char-icon') : ''}${esc(x.label)}</b>
        <dl class="facts"><dt>Kind</dt><dd>${esc(x.npcType || '—')}</dd><dt>Opens</dt><dd>${x.does?.length ? esc(x.does.join(', ')) : '—'}</dd>
        ${x.vis ? `<dt>Shown</dt><dd>${x.vis[m.state] === '0' ? 'not in this state' : 'in this state'}</dd>` : ''}</dl>${dialogHtml(x)}`;
    }
    return `<b>${esc(x.label)}</b>${x.layer === 'teleport' ? `<dl class="facts"><dt>Direction</dt><dd>${x.oneWay ? 'Entry → landing only' : 'Both ways'}</dd></dl>` : ''}`;
  }

  function select(pid, focus) {
    m.selected = pid;
    const x = m.current?.markers.find((y) => y.pid === pid) || null;
    const info = $('#map-info');
    if (info) info.innerHTML = infoHtml(x);
    $('#reader').querySelectorAll('.map-row').forEach((tr) => tr.classList.toggle('active', tr.dataset.pid === pid));
    if (x && !isOn(layerOf(x))) { m.layers[layerOf(x)] = true; const cb = $(`[data-layer="${layerOf(x)}"]`); if (cb) cb.checked = true; }
    m.view?.refresh();
    if (x && focus) m.view?.focus(x.pos);
  }

  // When an item shows up on the timeline: the first state it is in (marker.vis has a '0'/'1' per state),
  // and the item it needs first, if any. null on maps without a timeline.
  const appearsText = (x) => {
    const tl = m.current?.timeline;
    if (!tl || x.layer !== 'relic') return null;
    const first = x.vis ? x.vis.indexOf('1') : 0;
    const when = first < 0 ? 'never' : first === 0 ? 'from the start' : tl.states[first].label;
    return `${when}${x.needs ? ` · after item #${x.needs}` : x.needsItem ? ' · after another item' : ''}`;
  };

  // The first thing an NPC says, for the hover card.
  const saidFirst = (x) => {
    const l = x.talk?.[0] || x.say?.[0];
    return l ? `<span class="said">“${esc(l[1].length > 110 ? `${l[1].slice(0, 107)}…` : l[1])}”</span>` : '';
  };
  // An NPC's dialog for the info panel: its speech bubbles and the conversation when you talk to it.
  const dialogHtml = (x) => {
    const block = (title, lines, note) => `<div class="dialog"><h4>${title}${note ? ` <span class="sub">${note}</span>` : ''}</h4>
      ${lines.map(([who, text]) => `<div class="dl"><b>${esc(who)}</b> ${esc(text)}</div>`).join('')}</div>`;
    return (x.talk ? block('Conversation', x.talk, 'when you talk to it') : '')
      + (x.say ? block('Speech bubbles', x.say, x.sayRandom ? 'random order' : 'in order') : '');
  };

  // Hover card (the minimum to check a spot without clicking: stage Lv, CP, enemy elements) and
  // the labels: HTML buttons over the canvas that each view moves to the marker's screen position.
  function overlay(c, box, labels) {
    const tip = document.createElement('div');
    tip.className = 'map-tip';
    tip.hidden = true;
    box.appendChild(tip);
    function showTip(x, el) {
      tip.innerHTML = x.layer === 'stage'
        ? `<b>${esc(x.label)}</b><span>Lv ${fmtNum(x.lv)} · CP ${fmtNum(x.cp)}</span><span>${elems(x.elements)}</span>`
        : x.layer === 'relic' ? `<b>${esc(x.label)} ${x.no}</b><span>${x.rewards.map((r) => esc(r.name)).join(', ') || '—'}</span>${appearsText(x) ? `<span>Appears: ${esc(appearsText(x))}</span>` : ''}`
          : x.layer === 'switch' ? `<b>${esc(x.name)}</b><span>Opens ${x.opens.map((n) => `gate ${n}`).join(', ') || '—'}</span>`
            : x.layer === 'gate' ? `<b>${x.password ? 'Password door' : 'Gate'} ${x.no}</b>` : x.layer === 'side' ? `<b>${esc(x.label)}</b><span>${esc(x.kind)}</span>`
              : x.layer === 'npc' ? `<b>${esc(x.label)}</b><span>${esc(x.npcType || '')}${x.does?.length ? ` · ${esc(x.does.join(', '))}` : ''}</span>${saidFirst(x)}` : `<b>${esc(x.label)}</b>`;
      tip.hidden = false;
      const b = box.getBoundingClientRect(), r = el.getBoundingClientRect();
      const left = Math.min(r.left - b.left, b.width - tip.offsetWidth - 4);
      const top = r.top - b.top - tip.offsetHeight - 6;
      tip.style.left = `${Math.max(4, left)}px`;
      tip.style.top = `${top < 4 ? r.bottom - b.top + 6 : top}px`;
    }
    const items = c.markers.map((x) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = `mk mk-${x.layer}`;
      el.style.display = 'none'; // the view shows it once it has placed it
      if (x.layer === 'npc' && x.icon) el.innerHTML = gameImg(x.icon.split('/')[0], x.icon.split('/')[1]);
      else el.textContent = x.layer === 'stage' ? stageNo(x.label) : x.layer === 'relic' ? (x.itemType === 'BGM' ? '♪' : x.itemType === 'Memory' ? 'M' : 'R')
        : x.layer === 'gate' ? `G${x.no}` : x.layer === 'switch' ? `S${x.opens.length ? `→${x.opens.join(',')}` : ''}` : x.layer === 'teleport' ? 'T' : x.layer === 'side' ? 'Q' : x.layer === 'npc' ? 'N' : x.layer === 'target' ? '◎' : '★';
      el.onclick = () => { history.replaceState(null, '', href(c.id, x.pid)); select(x.pid, false); };
      el.onmouseenter = () => showTip(x, el);
      el.onmouseleave = () => { tip.hidden = true; };
      labels.appendChild(el);
      return { x, el };
    });
    return { items, tip };
  }

  // The flat walkable-area map: the navmesh polygons (what the squad can walk on) as a glowing blue
  // area on a grid, like the in-game map, with the labels and the switch/teleport lines over it.
  // Drag pans, wheel / pinch zooms; two fingers twist, or right-drag / Shift-drag, to rotate (up and
  // down in that drag tilts); ⟲ ⟳ Tilt Reset on screen. Unrotated: x to the right, z down (the 3D "Top" view).
  async function createFlat(c) {
    const box = $('#map-view');
    if (!box || m.current !== c) return;
    const canvas = box.querySelector('canvas'), labels = box.querySelector('.map-labels');
    let walkUrl = stateArt(c).walkable;
    let walk = await (await fetch(walkUrl)).json();
    if (m.current !== c || !box.isConnected || m.viewMode !== 'flat') return;
    const ctx = canvas.getContext('2d');
    const { items, tip } = overlay(c, box, labels);
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (const p of walk.polys) {
      for (let i = 0; i < p.length; i += 2) {
        x0 = Math.min(x0, p[i]); x1 = Math.max(x1, p[i]);
        z0 = Math.min(z0, p[i + 1]); z1 = Math.max(z1, p[i + 1]);
      }
    }
    // view: centre (metres), pixels per metre, rotation (rad) and tilt (1 = straight down; less squashes
    // the map vertically, like looking at it at an angle)
    const v = { cx: (x0 + x1) / 2, cz: (z0 + z1) / 2, s: 1, a: 0, ty: 1 };
    let fit = 1, raf = 0, W = 1, H = 1;
    const buildArea = (polys) => { // the walkable polygons, in metres
      const a = new Path2D();
      for (const p of polys) {
        a.moveTo(p[0], p[1]);
        for (let i = 2; i < p.length; i += 2) a.lineTo(p[i], p[i + 1]);
        a.closePath();
      }
      return a;
    };
    let area = buildArea(walk.polys);
    const proj = (x, z) => { // metres -> pixels
      const dx = x - v.cx, dz = z - v.cz, ca = Math.cos(v.a), sa = Math.sin(v.a);
      return [W / 2 + v.s * (dx * ca - dz * sa), H / 2 + v.s * v.ty * (dx * sa + dz * ca)];
    };
    const toWorld = (mx, my, s) => { // pixel offset from the centre -> offset in metres
      const rx = mx / s, rz = my / (s * v.ty), ca = Math.cos(v.a), sa = Math.sin(v.a);
      return [rx * ca + rz * sa, -rx * sa + rz * ca];
    };
    const gates = new Map(c.markers.filter((x) => x.layer === 'gate').map((g) => [g.no, g]));

    function draw() {
      raf = 0;
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      const dpr = canvas.width / W;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#0a1426';
      ctx.fillRect(0, 0, W, H);
      // world space (metres): grid and walkable area
      ctx.translate(W / 2, H / 2);
      ctx.scale(1, v.ty);
      ctx.rotate(v.a);
      ctx.scale(v.s, v.s);
      ctx.translate(-v.cx, -v.cz);
      const px = 1 / v.s;
      let step = 1; // grid cells at least ~28 px wide, every fourth line brighter
      while (step * v.s < 28) step *= 2;
      const R = Math.hypot(W, H) / (2 * v.s * Math.min(v.ty, 1)) + step;
      ctx.lineWidth = px;
      for (let g = Math.floor((v.cx - R) / step) * step; g < v.cx + R; g += step) {
        ctx.strokeStyle = g % (step * 4) === 0 ? 'rgba(80,150,255,.28)' : 'rgba(80,150,255,.12)';
        ctx.beginPath(); ctx.moveTo(g, v.cz - R); ctx.lineTo(g, v.cz + R); ctx.stroke();
      }
      for (let g = Math.floor((v.cz - R) / step) * step; g < v.cz + R; g += step) {
        ctx.strokeStyle = g % (step * 4) === 0 ? 'rgba(80,150,255,.28)' : 'rgba(80,150,255,.12)';
        ctx.beginPath(); ctx.moveTo(v.cx - R, g); ctx.lineTo(v.cx + R, g); ctx.stroke();
      }
      // a light outline under the fill, so only the outer edge shows, with a glow
      ctx.save();
      ctx.shadowColor = 'rgba(110,190,255,.85)';
      ctx.shadowBlur = 14;
      ctx.lineJoin = 'round';
      ctx.lineWidth = 3 * px;
      ctx.strokeStyle = '#8fd0ff';
      ctx.stroke(area);
      ctx.restore();
      ctx.fillStyle = '#2b86ee';
      ctx.fill(area);
      // screen space: switch -> gate lines, teleport arrows, labels
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      for (const x of c.markers) {
        if (x.layer === 'switch' && isOn('switch')) {
          ctx.strokeStyle = '#bfe3ff';
          for (const n of x.opens) {
            const g = gates.get(n);
            if (!g) continue;
            const [ax, az] = proj(x.pos[0], x.pos[2]), [bx, bz] = proj(g.pos[0], g.pos[2]);
            ctx.beginPath(); ctx.moveTo(ax, az); ctx.lineTo(bx, bz); ctx.stroke();
          }
        } else if (x.layer === 'teleport' && isOn('teleport')) {
          const [ax, az] = proj(x.from[0], x.from[2]), [bx, bz] = proj(x.to[0], x.to[2]);
          ctx.strokeStyle = '#d9a8ff';
          ctx.beginPath(); ctx.moveTo(ax, az); ctx.lineTo(bx, bz); ctx.stroke();
          if (x.oneWay) {
            const a = Math.atan2(bz - az, bx - ax);
            ctx.setLineDash([]);
            ctx.fillStyle = '#d9a8ff';
            ctx.beginPath();
            ctx.moveTo(bx, bz);
            ctx.lineTo(bx - 11 * Math.cos(a - 0.4), bz - 11 * Math.sin(a - 0.4));
            ctx.lineTo(bx - 11 * Math.cos(a + 0.4), bz - 11 * Math.sin(a + 0.4));
            ctx.fill();
            ctx.setLineDash([6, 4]);
          }
        }
      }
      ctx.setLineDash([]);
      for (const it of items) {
        const [lx, lz] = proj(it.x.pos[0], it.x.pos[2]);
        const vis = shown(it.x) && lx > -20 && lx < W + 20 && lz > -20 && lz < H + 20;
        it.el.style.display = vis ? '' : 'none';
        if (!vis) continue;
        it.el.style.transform = `translate(${lx}px, ${lz}px) translate(-50%, -50%)`;
        it.el.classList.toggle('sel', it.x.pid === m.selected);
      }
    }
    const refresh = () => { if (!raf) raf = requestAnimationFrame(draw); };

    const clampScale = (k) => Math.min(fit * 14, Math.max(fit * 0.6, k));
    function zoomAt(cx, cy, k) { // zoom about a screen point, keeping the spot under it in place
      const r = canvas.getBoundingClientRect();
      const mx = cx - r.left - r.width / 2, my = cy - r.top - r.height / 2;
      const [wx, wz] = toWorld(mx, my, v.s);
      const px = v.cx + wx, pz = v.cz + wz;
      v.s = clampScale(v.s * k);
      const [nx, nz] = toWorld(mx, my, v.s);
      v.cx = px - nx;
      v.cz = pz - nz;
    }
    const clampTilt = (t) => Math.min(1, Math.max(0.4, t));
    const ptrs = new Map(); // active pointers: one pans (or rotates with right button / Shift), two pinch and twist
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    canvas.addEventListener('pointerdown', (e) => {
      canvas.setPointerCapture(e.pointerId);
      ptrs.set(e.pointerId, { p: [e.clientX, e.clientY], rot: e.button === 2 || e.shiftKey });
      tip.hidden = true;
    });
    canvas.addEventListener('pointermove', (e) => {
      const st = ptrs.get(e.pointerId);
      if (!st) return;
      const prev = st.p, cur = [e.clientX, e.clientY];
      if (ptrs.size === 1 && st.rot) {
        v.a += (cur[0] - prev[0]) * 0.008;
        v.ty = clampTilt(v.ty - (cur[1] - prev[1]) * 0.004);
      } else if (ptrs.size === 1) {
        const [wx, wz] = toWorld(cur[0] - prev[0], cur[1] - prev[1], v.s);
        v.cx -= wx;
        v.cz -= wz;
      } else if (ptrs.size === 2) {
        const other = [...ptrs].find(([id]) => id !== e.pointerId)[1].p;
        const d0 = Math.hypot(prev[0] - other[0], prev[1] - other[1]), d1 = Math.hypot(cur[0] - other[0], cur[1] - other[1]);
        v.a += Math.atan2(cur[1] - other[1], cur[0] - other[0]) - Math.atan2(prev[1] - other[1], prev[0] - other[0]);
        if (d0 > 0) zoomAt((cur[0] + other[0]) / 2, (cur[1] + other[1]) / 2, d1 / d0);
      }
      st.p = cur;
      refresh();
    });
    for (const t of ['pointerup', 'pointercancel']) canvas.addEventListener(t, (e) => ptrs.delete(e.pointerId));
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.0015));
      refresh();
    }, { passive: false });

    let first = true;
    const resize = () => {
      const W = box.clientWidth, H = box.clientHeight, dpr = Math.min(devicePixelRatio, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      fit = Math.min(W / Math.max(x1 - x0, 1), H / Math.max(z1 - z0, 1)) * 0.92;
      if (first) { v.s = fit; first = false; } else v.s = clampScale(v.s);
      refresh();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(box);
    resize();

    const relics = c.markers.filter((x) => x.layer === 'relic').length;
    if (relics) box.insertAdjacentHTML('beforeend', `<div class="map-count">◆ ${relics} ${c.kind === 'event' ? 'items' : 'relics'}</div>`);
    box.querySelector('.map-status')?.remove();
    m.view = {
      refresh,
      camera() { v.cx = (x0 + x1) / 2; v.cz = (z0 + z1) / 2; v.s = fit; v.a = 0; v.ty = 1; refresh(); },
      rot(kind) {
        if (kind === 'ccw') v.a -= Math.PI / 12;
        else if (kind === 'cw') v.a += Math.PI / 12;
        else if (kind === 'tilt') v.ty = v.ty > 0.85 ? 0.7 : v.ty > 0.6 ? 0.5 : 1;
        else return this.camera();
        refresh();
      },
      focus(p) { v.cx = p[0]; v.cz = p[2]; v.s = clampScale(Math.max(v.s, fit * 3)); refresh(); },
      async setArt({ walkable }) { // another art variant of the field: its walkable area
        if (!walkable || walkable === walkUrl) return;
        walkUrl = walkable;
        const w = await (await fetch(walkable)).json();
        if (walkUrl !== walkable || !box.isConnected) return;
        walk = w;
        area = buildArea(w.polys);
        refresh();
      },
      dispose() { ro.disconnect(); cancelAnimationFrame(raf); },
    };
    if (m.selected) select(m.selected, true);
  }

  // --- 3D viewer ------------------------------------------------------------------------

  let threeP = null;
  const loadThree = () => threeP || (threeP = Promise.all([
    import('three'), import('three/addons/loaders/GLTFLoader.js'), import('three/addons/controls/OrbitControls.js'),
    import('three/addons/libs/meshopt_decoder.module.js'), // the web copies are meshopt-compressed (tools/web-maps.py)
  ]));

  function dispose() {
    if (!m.view) return;
    m.view.dispose();
    m.view = null;
  }

  async function createViewer(c) {
    const [THREE, { GLTFLoader }, { OrbitControls }, { MeshoptDecoder }] = await loadThree();
    const box = $('#map-view');
    if (!box || m.current !== c) return;
    const canvas = box.querySelector('canvas'), labels = box.querySelector('.map-labels');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1e27);
    scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x3a3428, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(30, 60, 20);
    scene.add(sun);
    const cam = new THREE.PerspectiveCamera(45, 1, 0.5, 4000);
    const controls = new OrbitControls(cam, canvas);
    controls.screenSpacePanning = false;
    // Phones: one finger pans like a map, two fingers zoom and turn (the mouse keeps drag = rotate).
    controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE };
    controls.maxPolarAngle = Math.PI * 0.48;

    // Frame the markers (the art also holds a far-off skyline).
    const pts = c.markers.map((x) => new THREE.Vector3(...x.pos));
    const bounds = new THREE.Box3().setFromPoints(pts.length ? pts : [new THREE.Vector3()]);
    const center = bounds.getCenter(new THREE.Vector3()), size = bounds.getSize(new THREE.Vector3());
    const span = Math.max(size.x, size.z, 20);
    controls.minDistance = 5;
    controls.maxDistance = span * 3;

    let raf = 0;
    const render = () => { raf = 0; placeLabels(); renderer.render(scene, cam); }; // labels and layer visibility first, so a toggle shows in the same frame
    const refresh = () => { if (!raf) raf = requestAnimationFrame(render); };
    controls.addEventListener('change', refresh);

    function camera(kind) {
      controls.target.copy(center);
      if (kind === 'top') cam.position.set(center.x, center.y + span * 1.15, center.z + 0.01);
      else cam.position.set(center.x, center.y + span * 0.75, center.z + span * 0.75);
      controls.update();
      refresh();
    }
    function focus(p) {
      const v = new THREE.Vector3(...p), d = cam.position.clone().sub(controls.target);
      if (d.length() > span * 0.6) d.setLength(span * 0.6);
      controls.target.copy(v);
      cam.position.copy(v).add(d);
      controls.update();
      refresh();
    }

    const { items: marks, tip } = overlay(c, box, labels);
    controls.addEventListener('start', () => { tip.hidden = true; });
    const items = marks.map((it) => ({ ...it, v: new THREE.Vector3(...it.x.pos) }));
    const tmp = new THREE.Vector3();
    const backdrop = []; // model nodes tagged extras.backdrop
    let ready = false; // labels and lines wait for the model, so they never float over an empty field
    function placeLabels() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      for (const it of items) {
        const on = ready && shown(it.x);
        tmp.copy(it.v).project(cam);
        const vis = on && tmp.z < 1 && Math.abs(tmp.x) < 1.05 && Math.abs(tmp.y) < 1.05;
        it.el.style.display = vis ? '' : 'none';
        if (!vis) continue;
        it.el.style.transform = `translate(${((tmp.x + 1) / 2) * w}px, ${((1 - tmp.y) / 2) * h}px) translate(-50%, -50%)`;
        it.el.classList.toggle('sel', it.x.pid === m.selected);
      }
      for (const [layer, obj] of links) obj.visible = ready && m.layers[layer] !== false;
      for (const o of backdrop) o.visible = isOn('backdrop');
    }

    // Lines: switch -> gate, teleport entry -> landing (arrow when one-way).
    const links = [];
    const lineMat = (color) => new THREE.LineBasicMaterial({ color, depthTest: false, transparent: true, opacity: 0.9 });
    const lift = (p) => new THREE.Vector3(p[0], p[1] + 1.5, p[2]);
    for (const x of c.markers) {
      if (x.layer === 'switch') {
        for (const n of x.opens) {
          const g = c.markers.find((y) => y.layer === 'gate' && y.no === n);
          if (!g) continue;
          const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([lift(x.pos), lift(g.pos)]), lineMat(0x4aa8ff));
          line.renderOrder = 10;
          scene.add(line);
          links.push(['switch', line]);
        }
      } else if (x.layer === 'teleport') {
        const a = lift(x.from), b = lift(x.to), dir = b.clone().sub(a);
        const len = dir.length();
        const arrow = new THREE.ArrowHelper(dir.normalize(), a, len, 0xc77dff, x.oneWay ? Math.min(3, len * 0.25) : 0.001, x.oneWay ? 1.6 : 0.001);
        arrow.traverse((o) => { if (o.material) { o.material.depthTest = false; o.renderOrder = 10; } });
        scene.add(arrow);
        links.push(['teleport', arrow]);
      }
    }

    const resize = () => {
      const w = box.clientWidth, h = box.clientHeight;
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      refresh();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(box);
    camera('angle');
    resize();

    let disposed = false;
    let model = null, shownUrl = null, token = 0; // the model in the scene, its url, and a counter so a late load of an old choice is dropped
    const freeModel = (root) => root.traverse((o) => {
      o.geometry?.dispose();
      [].concat(o.material || []).forEach((mt) => { mt.map?.dispose(); mt.lightMap?.dispose(); mt.dispose(); });
    });
    m.view = {
      refresh, camera, focus,
      setArt({ model: url }) { if (url) loadModel(url).catch(() => {}); }, // another art variant of the field
      dispose() {
        disposed = true;
        ro.disconnect();
        controls.dispose();
        freeModel(scene);
        renderer.dispose();
        renderer.forceContextLoss();
      },
    };
    if (m.selected) select(m.selected, true);

    // The model: baked lightmaps go on as MeshBasicMaterial (colour × lightmap, like the game's
    // baked look); node extras carry each renderer's lightmap index and scale/offset.
    async function loadModel(url) {
      if (url === shownUrl) return;
      const before = shownUrl;
      shownUrl = url;
      const mine = ++token;
      if (model) box.insertAdjacentHTML('beforeend', '<div class="map-status">Loading art…</div>');
      let gltf;
      try {
        gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(url, (e) => {
          const st = box.querySelector('.map-status');
          if (st && e.total) st.textContent = `Loading ${model ? 'art' : 'map'}… ${Math.round((e.loaded / e.total) * 100)}%`;
        });
      } catch (err) {
        if (mine === token) { shownUrl = before; ready = true; refresh(); if (model) box.querySelector('.map-status')?.remove(); }
        throw err; // first load: no model, still show the markers
      }
      if (disposed || mine !== token) { freeModel(gltf.scene); return; }
      const lmIdx = gltf.scene.userData.lightmaps || [];
      const lightmaps = await Promise.all(lmIdx.map((i) => gltf.parser.getDependency('texture', i)));
      if (disposed || mine !== token) { freeModel(gltf.scene); return; }
      backdrop.length = 0;
      gltf.scene.traverse((o) => { if (o.userData?.backdrop) backdrop.push(o); });
      gltf.scene.traverse((o) => {
        const lm = o.userData?.lm;
        if (lm == null || !lightmaps[lm]) return;
        const [sx, sy, ox, oy] = o.userData.lmST;
        const lmTex = (channel) => {
          const tex = lightmaps[lm].clone();
          tex.channel = channel;
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.repeat.set(sx, sy);
          tex.offset.set(ox, oy);
          tex.needsUpdate = true;
          return tex;
        };
        o.traverse((mesh) => {
          if (!mesh.isMesh) return;
          const old = mesh.material;
          // Unity falls back to the first UV set when a mesh has no lightmap UVs
          const tex = lmTex(mesh.geometry.attributes.uv1 ? 1 : 0);
          mesh.material = new THREE.MeshBasicMaterial({ map: old.map, color: old.color, transparent: old.transparent, opacity: old.opacity,
            alphaTest: old.alphaTest, depthWrite: old.depthWrite, side: old.side, lightMap: tex, lightMapIntensity: 2.2 });
          old.dispose();
        });
      });
      if (model) { scene.remove(model); freeModel(model); }
      scene.add(gltf.scene);
      model = gltf.scene;
      box.querySelector('.map-status')?.remove();
      ready = true;
      refresh();
    }
    await loadModel(stateArt(c).model);
  }

  window.addEventListener('hashchange', () => { if (!/^#\/maps?\b/.test(location.hash)) dispose(); });

  return { enter, route, renderTree };
})();
