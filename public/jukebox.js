// Nikke Library — jukebox albums and tracks.
const Jukebox = (() => {
  const j = { albums: null, current: null, open: new Set() };
  const href = (id) => `#/jukebox/${id}`;
  const duration = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  const trackHit = (t, f) => !f || t.name.toLowerCase().includes(f) || t.artist.toLowerCase().includes(f);

  async function enter() {
    if (!j.albums) j.albums = await (await apiFetch('/api/jukebox')).json();
    const n = j.albums.reduce((s, a) => s + a.tracks.length, 0);
    $('#cat-tabs').innerHTML = `<span class="cat-tab active">Albums<span class="n">${j.albums.length}</span></span>
      <span class="cat-tab">Tracks<span class="n">${n}</span></span>`;
    renderTree();
  }

  // Filter matches album names, track titles and artists.
  function renderTree() {
    const f = state.filter;
    const html = j.albums.map((a) => {
      const albumHit = !f || a.name.toLowerCase().includes(f);
      const hits = albumHit ? a.tracks.length : a.tracks.filter((t) => trackHit(t, f)).length;
      if (!hits) return '';
      return `<a class="scene-link album-link ${j.current?.id === a.id ? 'active' : ''}" href="${href(a.id)}">
        <span class="swatch" style="background:${esc(a.color)}"></span><span>${esc(a.name)}</span><span class="lines">${hits}</span></a>`;
    }).join('');
    $('#tree').innerHTML = html || '<p class="key" style="padding:12px">No matches.</p>';
    $('#tree .scene-link.active')?.scrollIntoView({ block: 'nearest' });
  }

  function route() {
    const m = location.hash.match(/^#\/jukebox\/(\d+)/);
    j.current = m ? j.albums.find((a) => a.id === Number(m[1])) : null;
    j.open.clear();
    renderTree();
    if (!j.current) return overview();
    renderAlbum();
    $('#reader').scrollTop = 0;
  }

  function overview() {
    const tracks = j.albums.flatMap((a) => a.tracks);
    $('#reader').innerHTML = `<div class="empty"><h1>Jukebox</h1>
      <p>${tracks.length} tracks across ${j.albums.length} albums. ${tracks.filter((t) => t.sceneCount).length} of them play in story scenes.</p>
      <p>Pick an album from the left.</p></div>`;
  }

  function renderAlbum() {
    const a = j.current;
    const f = state.filter;
    const total = a.tracks.reduce((s, t) => s + t.length, 0);
    const idx = j.albums.indexOf(a);
    const nav = (al, label) => `<a class="nav-btn" href="${al ? href(al.id) : '#'}" aria-disabled="${!al}">${label}</a>`;
    $('#reader').innerHTML = `
      <div class="scene-head album-head" style="--album:${esc(a.color)}">
        <div class="crumb">Jukebox</div>
        <div class="scene-title">${esc(a.name)}</div>
        ${a.description ? `<p class="album-desc">${esc(a.description)}</p>` : ''}
        <div class="toolbar">
          <span class="badge">${a.tracks.length} tracks</span><span class="badge">${duration(total)}</span>
          <span class="spacer"></span>${nav(j.albums[idx - 1], '← Prev')}${nav(j.albums[idx + 1], 'Next →')}
        </div>
      </div>
      <div class="stage-body"><section class="card"><div class="table-scroll"><table class="roster tracks keep-cols">
        <thead><tr><th class="num">#</th><th>Title</th><th>Obtain</th><th class="num">Length</th><th class="num">Story</th></tr></thead>
        <tbody>${a.tracks.map((t, i) => `
          <tr class="${f && trackHit(t, f) ? 'is-target' : ''}">
            <td class="num key">${i + 1}</td>
            <td><div class="track-name">${esc(t.name)}${t.loop ? ' <span class="tag">LOOP</span>' : ''}</div>
              <div class="key">${esc(t.artist)} · ${esc(t.bgm)}</div></td>
            <td class="obtain">${esc(t.obtain)}</td>
            <td class="num">${duration(t.length)}</td>
            <td class="num">${t.sceneCount ? `<button class="scene-toggle" data-bgm="${esc(t.bgm)}">${t.sceneCount} scene${t.sceneCount > 1 ? 's' : ''}</button>` : '<span class="key">—</span>'}</td>
          </tr>
          <tr class="scene-row" data-for="${esc(t.bgm)}" hidden><td></td><td colspan="4"><div class="scene-chips"></div></td></tr>`).join('')}
        </tbody></table></div></section></div>`;

    $('#reader').querySelectorAll('.scene-toggle').forEach((b) => b.onclick = () => toggleScenes(b.dataset.bgm));
  }

  // Story scenes that play a track load on demand.
  async function toggleScenes(bgm) {
    const row = [...$('#reader').querySelectorAll('.scene-row')].find((r) => r.dataset.for === bgm);
    row.hidden = !row.hidden;
    const box = row.querySelector('.scene-chips');
    if (row.hidden || box.childElementCount) return;
    const scenes = await (await apiFetch('/api/jukebox/scenes?bgm=' + encodeURIComponent(bgm))).json();
    box.innerHTML = scenes.map((s) => `<a class="scene-chip" href="#/scene/${encodeURIComponent(s.id)}" title="${esc(s.id)}">${esc(s.label)}</a>`).join('');
  }

  return { enter, route, renderTree, rerender: () => j.current && renderAlbum() };
})();
