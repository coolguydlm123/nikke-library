// The JSON API: api(pathname, searchParams) -> { status, body }, or null for a non-API path.
function createApi({ locale, stories, stages, bgm, raids, characters, minigames, eventGames, progression, monsters, maps, memorials }) {
  const ok = (body) => ({ status: 200, body });
  const found = (body, what) => (body ? ok(body) : { status: 404, body: { error: `${what} not found` } });
  const fixed = {
    '/api/stories': () => ({ localeLoaded: locale.size > 0, categories: stories.catalogue }),
    '/api/stages': () => stages.catalogue,
    '/api/tts': () => minigames.tts,
    '/api/tts/missions': () => minigames.missions,
    '/api/tts/skins': () => minigames.skins,
    '/api/progression/outpost': () => progression.outpost,
    '/api/progression/simulation': () => progression.simulation,
    '/api/progression/levels': () => progression.levels,
    // Which minigames exist, for the tabs.
    '/api/minigames': () => ({
      tts: { name: minigames.tts.name, count: minigames.tts.songs.length },
      dicetrack: minigames.diceTrack?.length ? { name: minigames.diceTrack[0].name, count: minigames.diceTrack[0].slots.length } : null,
      textadv: minigames.textAdventure?.length ? { name: minigames.textAdventure[0].name, count: minigames.textAdventure[0].routes.length } : null,
      // The other event minigames, one tab each (count = tables).
      ...Object.fromEntries(eventGames.list.map((g) => [g.id, { name: g.name, count: g.tables }])),
    }),
    '/api/dicetrack': () => minigames.diceTrack?.[0] || null,
    '/api/textadv': () => minigames.textAdventure?.[0] || null,
    '/api/eventgames': () => eventGames.list,
    '/api/characters': () => characters.list,
    '/api/cp-data': () => characters.cpData,
    '/api/overload': () => characters.overload,
    '/api/raids': () => raids.catalogue,
    '/api/jukebox': () => bgm.albums,
    '/api/monsters': () => monsters.catalogue(),
    '/api/maps': () => maps.catalogue(),
  };

  return function api(pathname, q) {
    if (fixed[pathname]) return ok(fixed[pathname]());
    if (pathname === '/api/scene') return found(stories.scene(q.get('id') || '') || memorials.scene(q.get('id') || ''), 'Scene');
    if (pathname === '/api/eventgame/page') return found(eventGames.page(q.get('id') || '', q.get('page') || ''), 'Page');
    if (pathname === '/api/eventgame/table') return found(eventGames.table(q.get('id') || '', q.get('table') || ''), 'Table');
    if (pathname === '/api/eventgame') return found(eventGames.game(q.get('id') || ''), 'Minigame');
    if (pathname === '/api/character') return found(characters.detail(Number(q.get('code'))), 'Character');
    if (pathname === '/api/monster') return found(monsters.detail(Number(q.get('id'))), 'Monster');
    if (pathname === '/api/jukebox/scenes') return ok(bgm.scenesFor(q.get('bgm') || ''));
    if (pathname === '/api/raid') {
      const kind = q.get('kind');
      let raid = null;
      if (kind === 'intercept') raid = raids.interceptDetail(q.get('boss'));
      else if (kind === 'museum') raid = raids.museumDetail(q.get('boss'));
      else if (q.has('id')) raid = raids.bossForPreset(kind, Number(q.get('id'))); // old per-tier links
      else raid = raids.bossDetail(kind, Number(q.get('season')), q.get('boss'));
      return found(raid, 'Raid');
    }
    if (pathname === '/api/map') return found(maps.detail(q.get('id') || ''), 'Map');
    if (pathname === '/api/box') return found(stages.boxContents(Number(q.get('id'))), 'Box');
    if (pathname === '/api/stage') {
      const id = Number(q.get('id'));
      if (q.get('kind') === 'tower') return found(stages.towerFloor(id), 'Stage');
      const st = stages.campaignStage(id);
      return found(st && { ...st, map: maps.forStage(id) }, 'Stage'); // the field map it stands on
    }
    return null;
  };
}

// Where the static export keeps an API response: "/api/stage?kind=tower&id=5" ->
// "api/stage/id.5__kind.tower.json". Mirrored by staticApiPath() in public/app.js.
function staticApiPath(pathname, q) {
  const enc = (v) => v.replace(/[^A-Za-z0-9_.-]/g, (c) => `~${c.codePointAt(0).toString(16)}`);
  const keys = [...q.keys()].sort();
  const base = pathname.replace(/^\/+/, '');
  return keys.length ? `${base}/${keys.map((k) => `${k}.${enc(q.get(k))}`).join('__')}.json` : `${base}.json`;
}

module.exports = { createApi, staticApiPath };
