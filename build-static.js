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
const { stories, stages, bgm, raids, characters, eventGames, monsters, maps, memorials, messenger } = libs;

// Every request the front end makes.
function* requests() {
  yield* ['/api/stories', '/api/storyline', '/api/stages', '/api/raids', '/api/jukebox', '/api/characters', '/api/cp-data', '/api/overload', '/api/account-lookup', '/api/shiftypad-script',
    '/api/minigames', '/api/tts', '/api/tts/missions', '/api/tts/skins', '/api/dicetrack', '/api/textadv', '/api/whitememory-play', '/api/eventgames',
    '/api/progression/outpost', '/api/progression/simulation', '/api/progression/levels', '/api/monsters', '/api/maps',
    '/api/shop/gacha', '/api/shop/passes', '/api/shop/packages', '/api/shop/login'];
  for (const g of libs.shop.gacha) yield `/api/shop/banner?id=${g.id}`;
  for (const p of libs.shop.packages) yield `/api/shop/package?id=${p.id}`;
  for (const l of libs.shop.login) yield `/api/shop/login-event?id=${l.id}`;
  for (const s of libs.minigames.songs) if (s.levels.some((l) => l.hasChart)) yield `/api/tts/chart?song=${s.id}`;
  for (const m of maps.list) yield `/api/map?id=${encodeURIComponent(m.id)}`;
  for (const id of stories.scenes.keys()) yield `/api/scene?id=${encodeURIComponent(id)}`;
  for (const id of memorials.pages.keys()) yield `/api/scene?id=${id}`;
  for (const id of messenger.convs.keys()) yield `/api/scene?id=${id}`;
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
// Every release gets its own ?v= on scripts, styles and data requests, so browsers drop
// the copies GitHub Pages lets them keep for 10 minutes.
const BUILD = Date.now().toString(36);
fs.writeFileSync(index, fs.readFileSync(index, 'utf8')
  .replace(/(src|href)="([\w./-]+\.(?:js|css))"/g, `$1="$2?v=${BUILD}"`)
  .replace('<script src="app.js', `<script>window.STATIC_API = true; window.BUILD = '${BUILD}';</script>\n  <script src="app.js`));
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

// Guard: real account identifiers must never ship. local/markers.txt (gitignored, one string per
// line; # starts a comment) lists them; the build FAILS if any appears in dist/, docs/ or any
// tracked file. Only file names are reported, never the strings themselves.
const markersFile = path.join(__dirname, 'local', 'markers.txt');
if (!fs.existsSync(markersFile)) {
  console.error('BUILD FAILED: local/markers.txt is missing. It lists the real account identifiers (one per line) the leak guard looks for.');
  process.exit(1);
}
const markers = fs.readFileSync(markersFile, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => l.toLowerCase());
if (!markers.length) {
  console.error('BUILD FAILED: local/markers.txt has no identifiers, so the leak guard would check nothing.');
  process.exit(1);
}
const BINARY = new Set(['.webp', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.mp3', '.ogg', '.wav', '.mp4', '.glb', '.woff', '.woff2', '.zip']);
const leaks = new Set();
const check = (file) => {
  if (BINARY.has(path.extname(file).toLowerCase())) return;
  const text = fs.readFileSync(file, 'utf8').toLowerCase();
  if (markers.some((m) => text.includes(m))) leaks.add(path.relative(__dirname, file));
};
const walk = (dir) => {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p); else check(p);
  }
};
walk(OUT);
walk(path.join(__dirname, 'docs'));
for (const f of require('child_process').execFileSync('git', ['ls-files', '-z'], { cwd: __dirname, maxBuffer: 1 << 26 }).toString('utf8').split('\0').filter(Boolean)) {
  const p = path.join(__dirname, f);
  if (fs.existsSync(p)) check(p);
}
if (leaks.size) {
  console.error(`BUILD FAILED: real account identifiers (from local/markers.txt) found in ${leaks.size} file(s):\n  ${[...leaks].slice(0, 20).join('\n  ')}`);
  process.exit(1);
}
console.log(`Guard passed: none of the ${markers.length} identifiers in local/markers.txt appear in the build, docs or tracked files.`);
