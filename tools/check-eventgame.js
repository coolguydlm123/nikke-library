// Builds the event minigame viewers and prints what each one produced.
//   node tools/check-eventgame.js [id ...]      (no id: every game that has a viewer)
//   node tools/check-eventgame.js bbqmaster --dump   (also print the pages as JSON)
const path = require('path');
const { loadAll } = require(path.join(__dirname, '..', 'lib', 'load'));

const args = process.argv.slice(2);
const dump = args.includes('--dump');
const ids = args.filter((a) => !a.startsWith('--'));
const { eventGames } = loadAll(path.join(__dirname, '..'));

for (const g of eventGames.games.values()) {
  if (ids.length ? !ids.includes(g.id) : !g.view) continue;
  if (!g.view) { console.log(`${g.id}: no viewer`); continue; }
  const pages = g.view.pages || [];
  const kb = (o) => `${(JSON.stringify(o).length / 1024).toFixed(0)} KB`;
  console.log(`${g.id}: ${pages.length} page(s), overview ${(g.view.overview || []).length} section(s), ${kb(g.view)}`);
  for (const p of pages) console.log(`  ${p.group ? `${p.group} / ` : ''}${p.title} [${p.id}] ${(p.sections || []).length} section(s), ${kb(p)}`);
  if (dump) console.log(JSON.stringify(g.view, null, 1));
}
