// Server part of My Nikkes: the lookups that turn the ids of an imported Shiftypad export into names
// and art, and the export script's text. lib/api.js adds these routes; build-static.js saves them as
// static files like every other API response. Nothing here knows any account's data.
const fs = require('fs');
const path = require('path');
const { art } = require('../art');

module.exports = function account({ characters }) {
  const names = (table, key = 'name_localkey') => Object.fromEntries(characters.table(table).map((r) => [r.id, characters.text(r[key], '')]));

  // Names for resolving an imported account: gear pieces, overload line effects, harmony cubes,
  // favorite items and costumes, keyed by the ids the export uses.
  const accountLookup = () => ({
    equip: Object.fromEntries(characters.table('ItemEquipTable').map((e) => [e.id, { name: characters.text(e.name_localkey, ''), cls: e.class, rare: e.item_rare }])),
    options: Object.fromEntries(characters.overloadEffects || []),
    // Cube art is icons-equip/ie_<resource_id>; item art is the row's icon_resource_id in icons-favoriteitem.
    cubes: Object.fromEntries(characters.table('ItemHarmonyCubeTable').map((r) => [r.id, { name: characters.text(r.name_localkey, ''), icon: art('icons-equip', `ie_${r.resource_id}`) }])),
    favorites: Object.fromEntries(characters.table('FavoriteItemTable').map((r) => [r.id, { name: characters.text(r.name_localkey, ''), icon: art('icons-favoriteitem', r.icon_resource_id) }])),
    costumes: Object.fromEntries(characters.costumes.map((x) => [x.id, {
      name: characters.text(x.costume_name_locale, `Costume ${x.costume_index}`),
      icon: art('icons-char', `si_c${String(x.resource_id).padStart(3, '0')}_${String(x.costume_index).padStart(2, '0')}_s`),
    }])),
  });

  // The console script's text, for the "Copy script" button (read when asked, so edits show at once).
  const exportScript = () => {
    const file = path.join(__dirname, '..', '..', 'tools', 'account', 'shiftypad-export.js');
    return { script: fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '' };
  };

  return {
    routes: { '/api/account-lookup': accountLookup, '/api/shiftypad-script': exportScript },
  };
};
