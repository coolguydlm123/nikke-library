// Nikke Library — Misc: pages that fit no other section. First the Story Line (the game's
// story timeline): #/misc/storyline/history or /release, #/misc/storyline/e/<id> for one entry.
const Misc = (() => {
  const m = { line: null, tag: null, type: null };
  const base = '#/misc/storyline';
  const TABS = { history: { label: 'History', key: 'historyOrder' }, release: { label: 'Release', key: 'updateOrder' } };
  const TYPE_TONE = { Main: 'accent', Event: 'good', Sub: '' };
  const tagName = (id) => m.line.tags.find((t) => t.id === id)?.name || id;
  const part = (e) => (e.part && e.part.of > 1 ? `Part ${e.part.order}/${e.part.of}` : '');
  const thumb = (e, cls) => (e.thumb ? gameImg(...e.thumb.split('/'), cls) : ''); // "<family>/<name>", only downloaded sprites

  async function enter() {
    if (!m.line) m.line = await (await apiFetch('/api/storyline')).json();
    $('#cat-tabs').innerHTML = `<a class="cat-tab" href="${base}/history">Story Line<span class="n">${m.line.entries.length}</span></a>`;
  }

  const hit = (e) => {
    const f = state.filter;
    return (!m.type || e.type === m.type) && (!m.tag || e.tags.includes(m.tag))
      && (!f || e.name.toLowerCase().includes(f) || e.tags.some((t) => tagName(t).toLowerCase().includes(f)));
  };

  function renderTree(tab, current) {
    const link = (hash, label, meta, active) =>
      `<a class="scene-link ${active ? 'active' : ''}" href="${hash}"><span>${label}</span><span class="lines">${meta ?? ''}</span></a>`;
    const list = sorted(tab || 'history').filter(hit);
    $('#tree').innerHTML = `<details class="group" open><summary>Story Line</summary>
      ${Object.entries(TABS).map(([id, t]) => link(`${base}/${id}`, t.label, '', tab === id && !current)).join('')}</details>
      <details class="group" open><summary>${esc(TABS[tab || 'history'].label)} order</summary>
      ${list.map((e) => link(`${base}/e/${e.id}`, esc(e.name) + (part(e) ? ` <span class="key">${part(e)}</span>` : ''), e.scenes.length, current === e.id)).join('')}</details>`;
    $('#tree .scene-link.active')?.scrollIntoView({ block: 'nearest' });
  }

  const sorted = (tab) => [...m.line.entries].sort((a, b) => a[TABS[tab].key] - b[TABS[tab].key]);
  const sceneCount = (e) => {
    const n = e.scenes.filter((s) => s.readable).length;
    return n === e.scenes.length ? fmtNum(n) : `${fmtNum(n)}/${fmtNum(e.scenes.length)}`;
  };

  function hub() {
    $('#reader').innerHTML = hubHtml({
      title: 'Misc',
      text: 'Pages that fit no other section.',
      groups: [{ cards: [{ href: `${base}/history`, title: 'Story Line', n: `${m.line.entries.length} stories`, text: 'The game\'s story timeline: main chapters, events and sub stories, in story or release order.' }] }],
    });
  }

  function listPage(tab) {
    const chip = (label, active, data) => `<button class="cat-tab ${active ? 'active' : ''}" ${data}>${label}</button>`;
    const list = sorted(tab).filter(hit);
    $('#reader').innerHTML = `<div class="scene-head"><div class="crumb">Misc · Story Line</div>
      <div class="scene-title">Story Line</div>
      <div class="toolbar"><div class="seg">${Object.entries(TABS).map(([id, t]) =>
        `<a class="nav-btn ${tab === id ? 'active' : ''}" href="${base}/${id}">${t.label}</a>`).join('')}</div>
        <span class="key">${tab === 'history' ? 'In-story order' : 'Release order'} · ${fmtNum(list.length)} of ${fmtNum(m.line.entries.length)}</span></div></div>
      <div class="stage-body">
      <section class="card"><div class="cat-tabs sl-chips">
        ${chip('All types', !m.type, 'data-type=""')}${['Main', 'Event', 'Sub'].map((t) => chip(t, m.type === t, `data-type="${t}"`)).join('')}
      </div><details class="sl-tagbox" ${m.tag ? 'open' : ''}><summary>Tags${m.tag ? `: <b>${esc(tagName(m.tag))}</b>` : ''}</summary><div class="cat-tabs sl-chips">
        ${chip('All tags', !m.tag, 'data-tag=""')}${m.line.tags.map((t) => chip(`${esc(t.name)}<span class="n">${t.count}</span>`, m.tag === t.id, `data-tag="${t.id}"`)).join('')}
      </div></details></section>
      <section class="card"><div class="table-scroll"><table class="roster keep-cols sticky-first sl-table">
        <thead><tr><th>Story</th><th class="num">#</th><th>Type</th><th>Visible from</th><th class="num">Scenes</th><th>Tags</th></tr></thead>
        <tbody>${list.map((e) => `<tr>
          <td><a class="sl-name" href="${base}/e/${e.id}">${thumb(e, 'sl-thumb')}<span>${esc(e.name)}${part(e) ? ` <span class="key">${part(e)}</span>` : ''}</span></a></td>
          <td class="num">${fmtNum(e[TABS[tab].key])}</td>
          <td><span class="v-tag ${TYPE_TONE[e.type] || ''}">${esc(e.type)}</span></td>
          <td>${e.date || '—'}</td>
          <td class="num">${sceneCount(e)}</td>
          <td class="sl-tags">${e.tags.map((t) => esc(tagName(t))).join(', ') || '—'}</td></tr>`).join('') || '<tr><td colspan="6" class="key">No stories match.</td></tr>'}</tbody>
      </table></div><p class="note key">#: the table's ${tab === 'history' ? 'history_order' : 'update_order'}. Scenes: the story's album scenes; "a/b" when only a of them are in the Stories reader.</p></section></div>`;
    $('#reader').querySelectorAll('[data-type]').forEach((b) => b.onclick = () => { m.type = b.dataset.type || null; rerender(); });
    $('#reader').querySelectorAll('[data-tag]').forEach((b) => b.onclick = () => { m.tag = Number(b.dataset.tag) || null; rerender(); });
  }

  function entryPage(e) {
    $('#reader').innerHTML = `<div class="scene-head"><div class="crumb">Misc · Story Line · ${esc(e.type)}</div>
      <div class="scene-title">${esc(e.name)}${part(e) ? ` <span class="key">${part(e)}</span>` : ''}</div></div>
      <div class="stage-body">
      <section class="card sl-entry">${thumb(e, 'sl-cover')}<dl class="facts">
        <dt>Type</dt><dd>${esc(e.type)}</dd>
        <dt>Visible from</dt><dd>${e.date || '—'}</dd>
        <dt>Story order</dt><dd>${fmtNum(e.historyOrder)}</dd>
        <dt>Release order</dt><dd>${fmtNum(e.updateOrder)}</dd>
        <dt>Tags</dt><dd>${e.tags.map((t) => `<a class="v-tag" href="${base}/history" data-tag="${t}">${esc(tagName(t))}</a>`).join(' ') || '—'}</dd>
      </dl></section>
      <section class="card"><h3>Scenes <span class="sub">${sceneCount(e)}</span></h3><div class="table-scroll"><table class="roster keep-cols">
        <thead><tr><th class="num">#</th><th>Scene</th></tr></thead>
        <tbody>${e.scenes.map((s, i) => `<tr><td class="num">${i + 1}</td>
          <td>${s.readable ? `<a href="#/scene/${encodeURIComponent(s.id)}">${esc(s.label)}</a>` : `${esc(s.label)} <span class="key">(not in the reader)</span>`}</td></tr>`).join('')}</tbody>
      </table></div></section></div>`;
    // A tag on the entry page opens the list filtered to it.
    $('#reader').querySelectorAll('[data-tag]').forEach((a) => a.onclick = () => { m.tag = Number(a.dataset.tag); m.type = null; });
  }

  function route() {
    const h = location.hash;
    const entry = h.match(/^#\/misc\/storyline\/e\/(\d+)/);
    const tab = h.match(/^#\/misc\/storyline\/(history|release)/)?.[1] || (/^#\/misc\/storyline/.test(h) ? 'history' : null);
    if (entry) {
      const e = m.line.entries.find((x) => x.id === Number(entry[1]));
      renderTree(m.tab || 'history', e?.id);
      if (e) entryPage(e); else $('#reader').innerHTML = '<div class="error">Story not found.</div>';
    } else if (tab) {
      m.tab = tab;
      renderTree(tab);
      listPage(tab);
    } else {
      renderTree(null);
      hub();
    }
    $('#reader').scrollTop = 0;
  }

  // Filter box / chips: redraw without leaving the page.
  function rerender() {
    const y = $('#reader').scrollTop;
    route();
    $('#reader').scrollTop = y;
  }

  return { enter, route, rerender };
})();
