// Nikke Library — field maps: the 3D field (three.js, loaded only here) with its stages,
// relics, switches, gates and teleports as labels, and the same things as tables.
const Maps = (() => {
  const m = {
    list: null,
    current: null,
    layers: store.get('mapLayers', { stage: true, relic: true, switch: true, teleport: true, start: true }),
    view: null, // the live viewer (one WebGL context at a time)
    selected: null,
    mode: store.get('mapMode', 'Normal'), // campaign difficulty shown in the list: Normal | Hard | Story
  };
  const MODES = ['Normal', 'Hard', 'Story'];
  const href = (id, pid) => `#/map/${encodeURIComponent(id)}${pid ? `/${pid}` : ''}`;
  const KIND_LABEL = { campaign: 'Campaign', event: 'Events', lostsector: 'Lost Sectors', other: 'Other' };
  // gates share the switches' toggle: a gate means nothing without the switch that opens it
  const LAYERS = [['stage', 'Stages'], ['relic', 'Relics'], ['switch', 'Switches & gates'], ['teleport', 'Teleports'], ['start', 'Start'], ['backdrop', 'Backdrop']];
  const layerOf = (x) => (x.layer === 'gate' ? 'switch' : x.layer);
  // Every layer starts shown except the backdrop (far-off scenery around the field, see maps.py).
  const isOn = (k) => (k === 'backdrop' ? m.layers[k] === true : m.layers[k] !== false);
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
          <span>${esc(x.title)}</span><span class="lines">${x.stages}</span></a>`).join('')}</details>`;
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

  function overview() {
    const list = filtered();
    $('#reader').innerHTML = `
      <div class="scene-head"><div class="crumb">Maps</div><div class="scene-title">Field maps</div>
        <div class="key">The 3D fields of the campaign, with every stage, relic, switch and teleport on them.</div></div>
      <div class="stage-body"><section class="card"><h3>Maps <span class="sub">${list.length}</span></h3>
        <div class="table-scroll"><table class="roster keep-cols sticky-first"><thead><tr><th>Map</th><th>Mode</th><th class="num">Stages</th><th class="num">Relics</th></tr></thead>
        <tbody>${list.map((x) => `<tr><td><a href="${href(x.id)}">${esc(x.title)}</a></td><td>${esc(x.group || '—')}</td>
          <td class="num">${fmtNum(x.stages)}</td><td class="num">${fmtNum(x.relics)}</td></tr>`).join('')}</tbody></table></div>
        <p class="note">More maps are added as they are exported. Drag to rotate, scroll or pinch to zoom, right-drag or two-finger drag to pan.</p>
      </section></div>`;
  }

  // --- page ---------------------------------------------------------------------------

  function renderMap() {
    dispose();
    const c = m.current;
    const by = (layer) => c.markers.filter((x) => x.layer === layer);
    const stages = by('stage').sort((a, b) => a.id - b.id);
    const relics = by('relic');
    const versions = c.versions.length > 1 ? `<div class="seg">${c.versions.map((v) => v.available
      ? `<a class="seg-link ${v.id === c.id ? 'active' : ''}" href="${href(v.id)}">${esc(v.mode)}</a>`
      : `<span class="seg-link off" title="Not exported yet">${esc(v.mode)}</span>`).join('')}</div>` : '';
    const row = (x, cells) => `<tr class="map-row" data-pid="${x.pid}">${cells}</tr>`;

    $('#reader').innerHTML = `
      <div class="scene-head">
        <div class="crumb">${['Maps', KIND_LABEL[c.kind], c.group].filter(Boolean).map(esc).join(' · ')}</div>
        <div class="scene-title">${esc(c.title)}</div>
        <div class="toolbar">${versions}
          <span class="map-layers">${LAYERS.map(([k, label]) => `<label class="toggle"><input type="checkbox" data-layer="${k}" ${isOn(k) ? 'checked' : ''}>
            <i class="mk-dot mk-${k}"></i>${label}</label>`).join('')}</span></div>
      </div>
      <div class="stage-body map-body">
        <section class="card map-card">
          <div class="map-view" id="map-view"><canvas></canvas><div class="map-labels"></div>
            <div class="map-tools"><button class="nav-btn" data-cam="top">Top</button><button class="nav-btn" data-cam="angle">3D</button></div>
            <div class="map-status">Loading map…</div></div>
          <div class="map-info" id="map-info"></div>
        </section>
        <section class="card"><h3>Stages <span class="sub">${stages.length}</span></h3>
          <div class="table-scroll"><table class="roster keep-cols sticky-first"><thead><tr><th>Stage</th><th class="num">Lv</th><th class="num">CP</th><th>Enemy elements</th><th></th></tr></thead>
          <tbody>${stages.map((x) => row(x, `<td>${esc(x.label)}</td><td class="num">${fmtNum(x.lv)}</td><td class="num">${fmtShort(x.cp)}</td>
            <td>${elems(x.elements)}</td><td><a href="#/stage/campaign/${x.id}">Stage →</a></td>`)).join('')}</tbody></table></div></section>
        ${relics.length ? `<section class="card"><h3>Relics <span class="sub">${relics.length}</span></h3>
          <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th class="num">#</th><th>Type</th><th>Reward</th></tr></thead>
          <tbody>${relics.map((x) => row(x, `<td class="num">${x.no}</td><td>${esc(x.label)}</td>
            <td>${rewardText(x)}</td>`)).join('')}</tbody></table></div></section>` : ''}
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
    createViewer(c).catch((err) => {
      const s = $('.map-status');
      if (s) s.textContent = `Could not load the 3D map (${err.message}).`;
    });
  }

  function infoHtml(x) {
    const c = m.current;
    if (!x) return `<p class="key">Tap a label on the map or a row below.</p>`;
    if (x.layer === 'stage') {
      return `<b>${esc(x.label)}</b> <span class="tag">${esc(x.category || '')}</span>
        <dl class="facts"><dt>Level</dt><dd>${fmtNum(x.lv)}</dd><dt>Recommended CP</dt><dd>${fmtNum(x.cp)}</dd>
        <dt>Enemy elements</dt><dd>${elems(x.elements)}</dd></dl><a href="#/stage/campaign/${x.id}">Stage details →</a>`;
    }
    if (x.layer === 'relic') {
      return `<b>${esc(x.label)} ${x.no}</b><dl class="facts"><dt>${x.scene ? 'Memorial' : 'Reward'}</dt><dd>${rewardText(x)}</dd></dl>`;
    }
    if (x.layer === 'switch') return `<b>${esc(x.name)}</b><dl class="facts"><dt>Opens</dt><dd>${x.opens.map((n) => `Gate ${n}`).join(', ') || '—'}</dd></dl>`;
    if (x.layer === 'gate') {
      return `<b>Gate ${x.no}</b><dl class="facts"><dt>Opened by</dt><dd>${x.openedBy.map((p) => esc(c.markers.find((s) => s.pid === p)?.name || '?')).join(', ') || '—'}</dd></dl>`;
    }
    return `<b>${esc(x.label)}</b>${x.layer === 'teleport' ? `<dl class="facts"><dt>Direction</dt><dd>${x.oneWay ? 'Entry → landing only' : 'Both ways'}</dd></dl>` : ''}`;
  }

  function select(pid, focus) {
    m.selected = pid;
    const x = m.current?.markers.find((y) => y.pid === pid) || null;
    const info = $('#map-info');
    if (info) info.innerHTML = infoHtml(x);
    $('#reader').querySelectorAll('.map-row').forEach((tr) => tr.classList.toggle('active', tr.dataset.pid === pid));
    if (x && m.layers[layerOf(x)] === false) { m.layers[layerOf(x)] = true; const cb = $(`[data-layer="${layerOf(x)}"]`); if (cb) cb.checked = true; }
    m.view?.refresh();
    if (x && focus) m.view?.focus(x.pos);
  }

  // --- 3D viewer ------------------------------------------------------------------------

  let threeP = null;
  const loadThree = () => threeP || (threeP = Promise.all([
    import('three'), import('three/addons/loaders/GLTFLoader.js'), import('three/addons/controls/OrbitControls.js'),
  ]));

  function dispose() {
    if (!m.view) return;
    m.view.dispose();
    m.view = null;
  }

  async function createViewer(c) {
    const [THREE, { GLTFLoader }, { OrbitControls }] = await loadThree();
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
    controls.maxPolarAngle = Math.PI * 0.48;

    // Frame the markers (the art also holds a far-off skyline).
    const pts = c.markers.map((x) => new THREE.Vector3(...x.pos));
    const bounds = new THREE.Box3().setFromPoints(pts.length ? pts : [new THREE.Vector3()]);
    const center = bounds.getCenter(new THREE.Vector3()), size = bounds.getSize(new THREE.Vector3());
    const span = Math.max(size.x, size.z, 20);
    controls.minDistance = 5;
    controls.maxDistance = span * 3;

    let raf = 0;
    const render = () => { raf = 0; renderer.render(scene, cam); placeLabels(); };
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

    // Hover card: the minimum to check a spot without clicking (stage: Lv, CP, enemy elements).
    const tip = document.createElement('div');
    tip.className = 'map-tip';
    tip.hidden = true;
    box.appendChild(tip);
    function showTip(x, el) {
      tip.innerHTML = x.layer === 'stage'
        ? `<b>${esc(x.label)}</b><span>Lv ${fmtNum(x.lv)} · CP ${fmtNum(x.cp)}</span><span>${elems(x.elements)}</span>`
        : x.layer === 'relic' ? `<b>${esc(x.label)} ${x.no}</b><span>${x.rewards.map((r) => esc(r.name)).join(', ') || '—'}</span>`
          : x.layer === 'switch' ? `<b>${esc(x.name)}</b><span>Opens ${x.opens.map((n) => `gate ${n}`).join(', ') || '—'}</span>`
            : x.layer === 'gate' ? `<b>Gate ${x.no}</b>` : `<b>${esc(x.label)}</b>`;
      tip.hidden = false;
      const b = box.getBoundingClientRect(), r = el.getBoundingClientRect();
      const left = Math.min(r.left - b.left, b.width - tip.offsetWidth - 4);
      const top = r.top - b.top - tip.offsetHeight - 6;
      tip.style.left = `${Math.max(4, left)}px`;
      tip.style.top = `${top < 4 ? r.bottom - b.top + 6 : top}px`;
    }
    controls.addEventListener('start', () => { tip.hidden = true; });

    // Labels: HTML on top of the canvas, moved to their projected position each frame.
    const items = c.markers.map((x) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = `mk mk-${x.layer}`;
      el.style.display = 'none'; // placeLabels() shows it once the model is in
      el.textContent = x.layer === 'stage' ? stageNo(x.label) : x.layer === 'relic' ? (x.itemType === 'BGM' ? '♪' : x.itemType === 'Memory' ? 'M' : 'R')
        : x.layer === 'gate' ? `G${x.no}` : x.layer === 'switch' ? `S${x.opens.length ? `→${x.opens.join(',')}` : ''}` : x.layer === 'teleport' ? 'T' : '★';
      el.onclick = () => { history.replaceState(null, '', href(c.id, x.pid)); select(x.pid, false); };
      el.onmouseenter = () => showTip(x, el);
      el.onmouseleave = () => { tip.hidden = true; };
      labels.appendChild(el);
      return { x, el, v: new THREE.Vector3(...x.pos) };
    });
    const tmp = new THREE.Vector3();
    const backdrop = []; // model nodes tagged extras.backdrop
    let ready = false; // labels and lines wait for the model, so they never float over an empty field
    function placeLabels() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      for (const it of items) {
        const on = ready && m.layers[layerOf(it.x)] !== false;
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
    m.view = {
      refresh, camera, focus,
      dispose() {
        disposed = true;
        ro.disconnect();
        controls.dispose();
        scene.traverse((o) => { o.geometry?.dispose(); [].concat(o.material || []).forEach((mt) => { mt.map?.dispose(); mt.lightMap?.dispose(); mt.dispose(); }); });
        renderer.dispose();
        renderer.forceContextLoss();
      },
    };
    if (m.selected) select(m.selected, true);

    // The model: baked lightmaps go on as MeshBasicMaterial (colour × lightmap, like the game's
    // baked look); node extras carry each renderer's lightmap index and scale/offset.
    const gltf = await new GLTFLoader().loadAsync(c.model, (e) => {
      const s = box.querySelector('.map-status');
      if (s && e.total) s.textContent = `Loading map… ${Math.round((e.loaded / e.total) * 100)}%`;
    }).catch((err) => { ready = true; refresh(); throw err; }); // no model: still show the markers
    if (disposed) return;
    const lmIdx = gltf.scene.userData.lightmaps || [];
    const lightmaps = await Promise.all(lmIdx.map((i) => gltf.parser.getDependency('texture', i)));
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
          alphaTest: old.alphaTest, side: old.side, lightMap: tex, lightMapIntensity: 2.2 });
        old.dispose();
      });
    });
    scene.add(gltf.scene);
    box.querySelector('.map-status')?.remove();
    ready = true;
    refresh();
  }

  window.addEventListener('hashchange', () => { if (!/^#\/maps?\b/.test(location.hash)) dispose(); });

  return { enter, route, renderTree };
})();
