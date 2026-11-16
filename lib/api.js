// The JSON API: api(pathname, searchParams) -> { status, body }, or null for a non-API path.
const { helpImage } = require('./eventgames');
function createApi({ locale, stories, stages, bgm, raids, characters, minigames, eventGames, progression, monsters, maps, memorials, misc, messenger, shop }) {
  const ok = (body) => ({ status: 200, body });
  const account = require('./account')({ characters }); // My Nikkes: extra routes
  const found = (body, what) => (body ? ok(body) : { status: 404, body: { error: `${what} not found` } });
  const fixed = {
    '/api/stories': () => ({ localeLoaded: locale.size > 0, categories: stories.catalogue }),
    '/api/stages': () => stages.catalogue,
    '/api/storyline': () => misc.storyLine,
    '/api/tts': () => minigames.tts,
    '/api/tts/missions': () => minigames.missions,
    '/api/tts/skins': () => minigames.skins,
    '/api/progression/outpost': () => progression.outpost,
    '/api/progression/simulation': () => progression.simulation,
    '/api/progression/levels': () => progression.levels,
    // Which minigames exist, for the tabs.
    '/api/minigames': () => ({
      tts: { name: minigames.tts.name, count: minigames.tts.songs.length, img: helpImage(minigames.tts.help) },
      dicetrack: minigames.diceTrack?.length ? { name: minigames.diceTrack[0].name, count: minigames.diceTrack[0].slots.length } : null,
      textadv: minigames.textAdventure?.length ? { name: minigames.textAdventure[0].name, count: minigames.textAdventure[0].routes.length, img: helpImage(minigames.textAdventure[0].help) } : null,
      // The other event minigames, one tab each (count = tables); text and img are for the hub.
      ...Object.fromEntries(eventGames.list.map((g) => [g.id, { name: g.name, count: g.tables, text: g.text, img: g.img }])),
    }),
    '/api/dicetrack': () => minigames.diceTrack?.[0] || null,
    '/api/textadv': () => minigames.textAdventure?.[0] || null,
    '/api/whitememory-play': () => minigames.whiteMemory || null,
    '/api/eventgames': () => eventGames.list,
    '/api/characters': () => characters.list,
    '/api/cp-data': () => characters.cpData,
    '/api/overload': () => characters.overload,
    '/api/raids': () => raids.catalogue,
    '/api/jukebox': () => bgm.albums,
    '/api/monsters': () => monsters.catalogue(),
    '/api/maps': () => maps.catalogue(),
    '/api/shop/gacha': () => shop.gacha,
    '/api/shop/passes': () => shop.passes,
    '/api/shop/packages': () => ({ shops: shop.packages, login: shop.loginPackages, popups: shop.popups }),
    '/api/shop/login': () => shop.login,
  };

  return function api(pathname, q) {
    if (fixed[pathname]) return ok(fixed[pathname]());
    if (account.routes[pathname]) return ok(account.routes[pathname]());
    if (pathname === '/api/scene') return found(stories.scene(q.get('id') || '') || memorials.scene(q.get('id') || '') || messenger.scene(q.get('id') || ''), 'Scene');
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
    if (pathname === '/api/tts/chart') return found(minigames.chart(Number(q.get('song'))), 'Chart');
    if (pathname === '/api/map') return found(maps.detail(q.get('id') || ''), 'Map');
    if (pathname === '/api/shop/banner') return found(shop.banner(Number(q.get('id'))), 'Banner');
    if (pathname === '/api/shop/login-event') return found(shop.loginEvent(Number(q.get('id'))), 'Login event');
    if (pathname === '/api/shop/package') return found(shop.package(Number(q.get('id'))), 'Package shop');
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
