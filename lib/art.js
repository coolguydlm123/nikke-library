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

module.exports = { art };
