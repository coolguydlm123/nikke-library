// Static export for GitHub Pages: copies public/ to dist/ and writes every API response
// the pages can ask for as a JSON file (path from staticApiPath in lib/api.js).
//   node build-static.js [outDir]
const fs = require('fs');
const path = require('path');
const { loadAll } = require('./lib/load');
const { createApi, staticApiPath } = require('./lib/api');

const OUT = path.resolve(process.argv[2] || path.join(__dirname, 'dist'));
const t0 = Date.now();
const libs = loadAll(__dirname);
const api = createApi(libs);
const { stories, stages, bgm, raids, characters, eventGames, monsters, maps, memorials } = libs;

// Every request the front end makes.
function* requests() {
  yield* ['/api/stories', '/api/storyline', '/api/stages', '/api/raids', '/api/jukebox', '/api/characters', '/api/cp-data', '/api/overload',
    '/api/minigames', '/api/tts', '/api/tts/missions', '/api/tts/skins', '/api/dicetrack', '/api/textadv', '/api/eventgames',
    '/api/progression/outpost', '/api/progression/simulation', '/api/progression/levels', '/api/monsters', '/api/maps'];
  for (const m of maps.list) yield `/api/map?id=${encodeURIComponent(m.id)}`;
  for (const id of stories.scenes.keys()) yield `/api/scene?id=${encodeURIComponent(id)}`;
  for (const id of memorials.pages.keys()) yield `/api/scene?id=${id}`;
  for (const c of stages.catalogue.chapters) for (const list of Object.values(c.modes)) for (const s of list) yield `/api/stage?kind=campaign&id=${s.id}`;
  for (const t of stages.catalogue.towers) for (const f of t.floors) yield `/api/stage?kind=tower&id=${f.id}`;
  for (const g of stages.boxGroups.keys()) yield `/api/box?id=${g}`;
  for (const [kind, cat] of Object.entries(raids.catalogue)) {
    for (const season of cat.seasons) {
      for (const b of season.bosses) {
        yield kind === 'union' || kind === 'solo'
          ? `/api/raid?kind=${kind}&season=${season.id}&boss=${encodeURIComponent(b.key)}`
          : `/api/raid?kind=${kind}&boss=${encodeURIComponent(b.key)}`;
      }
    }
  }
  for (const g of eventGames.list) {
    yield `/api/eventgame?id=${g.id}`;
    for (const p of eventGames.game(g.id).view?.pages || []) yield `/api/eventgame/page?id=${g.id}&page=${encodeURIComponent(p.id)}`;
    for (const t of eventGames.game(g.id).tables) yield `/api/eventgame/table?id=${g.id}&table=${t.name}`;
  }
  for (const c of characters.list) yield `/api/character?code=${c.code}`;
  for (const m of monsters.catalogue()) yield `/api/monster?id=${m.id}`;
  for (const a of bgm.albums) for (const t of a.tracks || []) if (t.sceneCount) yield `/api/jukebox/scenes?bgm=${encodeURIComponent(t.bgm)}`;
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(path.join(__dirname, 'public'), OUT, { recursive: true });
const index = path.join(OUT, 'index.html');
fs.writeFileSync(index, fs.readFileSync(index, 'utf8').replace('<script src="app.js">', '<script>window.STATIC_API = true;</script>\n  <script src="app.js">'));
fs.writeFileSync(path.join(OUT, '.nojekyll'), ''); // serve files as-is (no Jekyll pass)

let files = 0;
let bytes = 0;
const missing = [];
const seen = new Set();
for (const req of requests()) {
  const url = new URL(req, 'http://x');
  const rel = staticApiPath(url.pathname, url.searchParams);
  if (seen.has(rel)) continue;
  seen.add(rel);
  const out = api(url.pathname, url.searchParams);
  if (!out || out.status !== 200) { missing.push(req); continue; }
  const text = JSON.stringify(out.body);
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
  files += 1;
  bytes += text.length;
  if (files % 2000 === 0) console.log(`  ${files} files…`);
}
console.log(`Wrote ${files} API files (${(bytes / 1048576).toFixed(1)} MB) to ${OUT} in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
if (missing.length) console.log(`${missing.length} request(s) had no data, e.g. ${missing.slice(0, 5).join(', ')}`);
