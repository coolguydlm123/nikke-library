// Nikke Library — minigames. Tracing the Stars: songs, albums, missions, skins.
const Minigames = (() => {
  const m = { tts: null, missions: null, skins: null, page: null };
  const fmt = (n) => Number(n).toLocaleString('en-US');
  const day = (iso) => (iso ? iso.slice(0, 10) : null);
  const base = '#/minigame/tts';
  const DIFF_CLASS = { Casual: 'casual', Normal: 'normal', Hard: 'hard', Expert: 'expert' };

  async function enter() {
    if (!m.tts) m.tts = await (await apiFetch('/api/tts')).json();
    if (!m.games) m.games = await (await apiFetch('/api/minigames')).json();
    renderTabs();
    renderTree();
  }

  // One tab per minigame; tabs are links so each game has its own address.
  function renderTabs() {
    const game = gameOf(location.hash);
    $('#cat-tabs').innerHTML = Object.entries(m.games).filter(([, g]) => g).map(([id, g]) =>
      `<a class="cat-tab ${game === id ? 'active' : ''}" href="#/minigame/${id}">${esc(g.name)}<span class="n">${g.count}</span></a>`).join('');
    $('#cat-tabs .cat-tab.active')?.scrollIntoView({ block: 'nearest' }); // the tab list scrolls (one tab per game)
  }
  const gameOf = (hash) => hash.match(/^#\/minigame\/(\w+)/)?.[1] || 'tts';

  // Song filter: matches title, artist or album name.
  const songHit = (s, f) => !f || [s.name, s.artist, albumName(s.album)].some((v) => v.toLowerCase().includes(f));
  const albumName = (id) => m.tts.albums.find((a) => a.id === id)?.name || '';

  // Overview / Missions / Skins, then Songs: "All songs" and one entry per album.
  function renderTree() {
    if (m.extraTree != null && gameOf(location.hash) !== 'tts') { $('#tree').innerHTML = m.extraTree; return; }
    const f = state.filter;
    const t = m.tts;
    const link = (hash, label, meta, active) =>
      `<a class="scene-link ${active ? 'active' : ''}" href="${hash}"><span>${label}</span><span class="lines">${meta}</span></a>`;
    const onSongs = (album) => m.page?.kind === 'songs' && m.page.album === album;
    const count = (songs) => songs.filter((s) => songHit(s, f)).length;
    $('#tree').innerHTML = `<details class="group" open><summary>${esc(t.name)}</summary>
      ${link(base, 'Overview', '', m.page?.kind === 'overview')}
      ${link(`${base}/missions`, 'Missions', t.missionCount, m.page?.kind === 'missions')}
      ${link(`${base}/skins`, 'Skins', t.skinCount, m.page?.kind === 'skins')}
      ${t.help?.length ? link(`${base}/help`, 'How to play', t.help.length, m.page?.kind === 'help') : ''}</details>
      <details class="group" open><summary>Songs</summary>
      ${link(`${base}/songs`, 'All songs', count(t.songs), onSongs(null))}
      ${t.albums.map((a) => link(`${base}/songs/${a.id}`, esc(a.name), count(t.songs.filter((s) => s.album === a.id)) || '—', onSongs(a.id))).join('')}
      </details>`;
    $('#tree .scene-link.active')?.scrollIntoView({ block: 'nearest' });
  }

  // VOLT TRIP, Fading Affection and the event minigames live in minigames-extra.js.
  async function renderExtra(game, rest, keepScroll) {
    const y = $('#reader').scrollTop;
    const page = await MinigameExtras.route(game, rest, () => renderExtra(game, rest, true));
    if (!page) { $('#reader').innerHTML = '<div class="error">Minigame not found.</div>'; return; }
    m.extraTree = page.tree;
    renderTree();
    $('#reader').innerHTML = page.html;
    page.bind?.();
    $('#reader').scrollTop = keepScroll ? y : 0;
    $('#tree .scene-link.active')?.scrollIntoView({ block: 'nearest' });
  }

  async function route() {
    const h = location.hash;
    renderTabs();
    const game = gameOf(h);
    if (game !== 'tts') {
      m.page = { kind: 'extra' };
      return renderExtra(game, h.replace(/^#\/minigame\/\w+\/?/, '').split('/').filter(Boolean), false);
    }
    m.extraTree = null;
    const album = h.match(/^#\/minigame\/tts\/songs\/(\d+)/);
    const song = h.match(/^#\/minigame\/tts\/song\/(\d+)/);
    if (album) m.page = { kind: 'songs', album: Number(album[1]) };
    else if (/\/songs$/.test(h)) m.page = { kind: 'songs', album: null };
    else if (song) {
      // Old per-song links open the song's album with its row highlighted.
      const s = m.tts.songs.find((x) => x.id === Number(song[1]));
      m.page = { kind: 'songs', album: s ? s.album : null, highlight: s?.id };
    } else if (/\/missions$/.test(h)) m.page = { kind: 'missions' };
    else if (/\/skins$/.test(h)) m.page = { kind: 'skins' };
    else if (/\/help$/.test(h)) m.page = { kind: 'help' };
    else m.page = { kind: 'overview' };
    if (m.page.kind === 'missions' && !m.missions) m.missions = await (await apiFetch('/api/tts/missions')).json();
    if (m.page.kind === 'skins' && !m.skins) m.skins = await (await apiFetch('/api/tts/skins')).json();
    renderTree();
    ({ overview, songs: songsPage, missions: missionsPage, skins: skinsPage, help: helpPage })[m.page.kind]();
    $('#reader').scrollTop = 0;
    $('#reader .is-target')?.scrollIntoView({ block: 'center' });
  }

  // Re-render the current page when the sidebar filter changes (song tables filter live).
  function rerender() {
    if (m.page?.kind === 'songs') songsPage();
  }

  const head = (crumb, title, extra = '') => `<div class="scene-head">
      <div class="crumb">${crumb.map(esc).join(' · ')}</div>
      <div class="scene-title">${title}</div>${extra}</div>`;

  function overview() {
    const t = m.tts;
    $('#reader').innerHTML = head(['Minigames'], esc(t.name), `<p class="album-desc">A rhythm game. ${t.songs.length} songs across ${t.albums.length} albums, four difficulties each.</p>`) + `
      <div class="stage-body">
        <section class="card"><h3>Game</h3><dl class="facts">
          ${t.intro ? `<dt>Intro story</dt><dd><a href="#/scene/${encodeURIComponent(t.intro.id)}">${esc(t.intro.label)}</a></dd>` : ''}
          <dt>Lane speeds</dt><dd>${t.laneSpeeds.join(' / ')}</dd>
          <dt>Missions</dt><dd><a href="${base}/missions">${t.missionCount} missions</a></dd>
          <dt>Skins</dt><dd><a href="${base}/skins">${t.skinCount} skins</a></dd>
        </dl></section>
        <section class="card"><h3>Albums <span class="sub">${t.albums.length}</span></h3>
          <div class="table-scroll"><table class="roster keep-cols"><thead><tr><th>Album</th><th class="num">Songs</th><th>Release</th><th>Access</th></tr></thead><tbody>
          ${t.albums.map((a) => `<tr><td><a href="${base}/songs/${a.id}">${esc(a.name)}</a></td><td class="num">${a.songs.length || '<span class="key">not in data yet</span>'}</td>
            <td>${day(a.release) || '<span class="key">launch</span>'}</td><td>${a.shop ? 'Paid pack' : 'Included'}</td></tr>`).join('')}
          </tbody></table></div></section>
        ${t.tips.length ? `<section class="card"><h3>Loading tips</h3><ul class="tips">${t.tips.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section>` : ''}
      </div>`;
  }

  // One table for an album (or every song when album is null); the album column
  // only appears in the All songs view.
  function songsPage() {
    const t = m.tts;
    const album = t.albums.find((a) => a.id === m.page.album) || null;
    const all = !album;
    const songs = t.songs.filter((s) => (all || s.album === album.id) && songHit(s, state.filter));
    const unlockText = (s) => [
      s.unlock.date && `From ${day(s.unlock.date)}`,
      s.unlock.playCount && `After ${s.unlock.playCount} play${s.unlock.playCount > 1 ? 's' : ''}`,
    ].filter(Boolean).join(' · ') || '<span class="key">Start</span>';
    // Hover: for each grade, the score it starts at and the rating there (level + the grade's base bonus).
    const ratingTip = (l) => {
      const base = l.ratio != null ? l.ratio / 10 : l.level;
      const rows = (t.rankBands || []).map((b) => `<tr><td><b>${esc(b.grade)}</b></td><td class="num">${fmt(b.min)}</td>
        <td class="num">${(base + b.a).toFixed(3)}</td><td class="num">${(base + b.b).toFixed(3)}</td></tr>`).join('');
      return `<div class="rating-tip"><div class="rating-tip-head">${l.difficulty} · Lv ${l.level} rating by grade</div>
        <table><thead><tr><th>Grade</th><th class="num">From score</th><th class="num">Min rating</th><th class="num">Max rating</th></tr></thead>
        <tbody>${rows}</tbody></table><div class="key">S+ max is at the song's max score${l.maxScore != null ? ` (${fmt(l.maxScore)})` : ''}.</div></div>`;
    };
    const levelCell = (l) => `<td class="lv-cell has-tip" tabindex="0">${ratingTip(l)}<span class="lv lv-${DIFF_CLASS[l.difficulty]}">${l.level}</span>
      ${l.ratio != null ? `<span class="ratio">Ratio ${l.ratio}</span>` : ''}
      <span class="key">${l.maxScore != null ? fmt(l.maxScore) : '—'}</span></td>`;

    const desc = all
      ? `${t.songs.length} songs across ${t.albums.length} albums.`
      : [album.release ? `Released ${day(album.release)}` : 'Available from launch', album.shop ? 'Paid pack' : 'Included'].join(' · ');
    $('#reader').innerHTML = head([t.name, 'Songs'], esc(all ? 'All songs' : album.name),
      `<p class="album-desc">${desc}${state.filter ? ` · ${songs.length} matching “${esc(state.filter)}”` : ''}</p>`) + `
      <div class="stage-body"><section class="card">
        ${songs.length ? `<div class="table-scroll"><table class="roster keep-cols song-table"><thead><tr>
          <th class="num">#</th><th>Song</th>${all ? '<th>Album</th>' : ''}
          <th class="lv-head lv-casual">Casual</th><th class="lv-head lv-normal">Normal</th>
          <th class="lv-head lv-hard">Hard</th><th class="lv-head lv-expert">Expert</th>
          <th>Unlock</th><th>Jukebox</th></tr></thead><tbody>
          ${songs.map((s, i) => `<tr class="${m.page.highlight === s.id ? 'is-target' : ''}">
            <td class="num key">${i + 1}</td>
            <td><div class="track-name">${esc(s.name)}</div><div class="key">${esc(s.artist)}</div></td>
            ${all ? `<td><a href="${base}/songs/${s.album}">${esc(albumName(s.album))}</a></td>` : ''}
            ${s.levels.map(levelCell).join('')}
            <td class="obtain">${unlockText(s)}</td>
            <td>${s.jukebox ? `<a href="#/jukebox/${s.jukebox.album}">${esc(s.jukebox.albumName)}</a>` : '<span class="key">—</span>'}</td>
          </tr>`).join('')}
          </tbody></table></div>
          <p class="key note">Each difficulty shows its level, its ratio (normal_ratio / hard_ratio / … in the song table) and the max score.</p>`
        : `<p class="key">${album && !album.songs.length ? 'This album is listed but its songs are not in the data yet.' : 'No songs match the filter.'}</p>`}
      </section></div>`;
  }

  function rewardText(r) {
    if (!r) return '<span class="key">—</span>';
    return r.items.map((i) => `${esc(i.name)} <span class="reward-amt">×${fmt(i.amount)}</span>`).join('<br>');
  }

  function missionsPage() {
    const groups = [['Permanent', m.missions.filter((x) => !x.limited)], ['Limited-time', m.missions.filter((x) => x.limited)]];
    $('#reader').innerHTML = head([m.tts.name], 'Missions', `<p class="album-desc">${m.missions.length} missions.</p>`) + `
      <div class="stage-body">${groups.filter(([, list]) => list.length).map(([label, list]) => `
        <section class="card"><h3>${label} <span class="sub">${list.length}</span></h3>
          <div class="table-scroll"><table class="roster"><thead><tr><th>Mission</th><th>Reward</th></tr></thead><tbody>
          ${list.map((x) => `<tr><td><div class="track-name">${esc(x.name)}</div><div class="key">${esc(x.description)}</div>
              ${x.start || x.end ? `<div class="key">${day(x.start) || '…'} → ${day(x.end) || '…'}</div>` : ''}</td>
            <td class="obtain">${rewardText(x.reward)}</td></tr>`).join('')}
          </tbody></table></div></section>`).join('')}</div>`;
  }

  function skinsPage() {
    const types = [...new Set(m.skins.map((k) => k.type))];
    $('#reader').innerHTML = head([m.tts.name], 'Skins', `<p class="album-desc">${m.skins.length} cosmetic skins for the stage, characters and notes.</p>`) + `
      <div class="stage-body">${types.map((type) => {
        const list = m.skins.filter((k) => k.type === type);
        return `<section class="card"><h3>${esc(type)} <span class="sub">${list.length}</span></h3><div class="rewards">
          ${list.map((k) => `<div class="reward costume">${gameImg('icons-event', k.icon, 'skin-icon')}<span class="reward-name">${esc(k.name)}</span>
            <span class="reward-amt">${k.free ? 'Free' : `${esc(k.cost.name)} ×${fmt(k.cost.amount)}`}</span>
            ${k.description ? `<span class="key">${esc(k.description)}</span>` : ''}
            ${k.release ? `<span class="key">Released ${day(k.release)}</span>` : ''}</div>`).join('')}
        </div></section>`;
      }).join('')}</div>`;
  }

  function helpPage() {
    $('#reader').innerHTML = head([m.tts.name], 'How to play', '<p class="album-desc">The in-game guide.</p>') + helpHtml(m.tts.help);
  }

  return { enter, route, renderTree, rerender };
})();
