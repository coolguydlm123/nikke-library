// Which extracted images have web copies (tools/web-images.py writes public/img/<family>/
// with lowercased names), so the API only points at art that exists.
const fs = require('fs');
const path = require('path');

const IMG = path.join(__dirname, '..', 'public', 'img');
const sets = new Map();

function names(family) {
  if (!sets.has(family)) {
    const dir = path.join(IMG, family);
    sets.set(family, new Set(fs.existsSync(dir) ? fs.readdirSync(dir).map((f) => f.replace(/\.[^.]+$/, '')) : []));
  }
  return sets.get(family);
}

// The lowercased name if `family` has an image called `name`, else null.
function art(family, name) {
  if (!name) return null;
  const key = String(name).toLowerCase();
  return names(family).has(key) ? key : null;
}

// Monster art by model prefab (MonsterModelTable.mon_prefab): kind 'si' is the small icon,
// 'full' the large art. A variant without its own falls back to its base rig
// (bbg004_hologram_hsta -> bbg004_hologram -> bbg004).
function monsterArt(prefab, kind = 'si') {
  let p = prefab;
  while (p) {
    const hit = art('icons-monster', `${kind}_${p}`);
    if (hit) return hit;
    const shorter = p.replace(/_[^_]*$/, '');
    if (shorter === p) break;
    p = shorter;
  }
  return null;
}

module.exports = { art, monsterArt };
