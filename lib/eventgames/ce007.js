// Salvation Breakers (CE007, Event BH*): Jill, Claire and Ada hold a barricade against 99 waves
// of monsters with auto-firing weapons merged in a grid inventory. The tables are shared with
// FIGHT! ARK RANGER, so the whole viewer lives in _survivor.js.
const { buildSurvivor } = require('./_survivor');

function build(ctx) {
  return buildSurvivor(ctx, 'BH', {
    summary: 'Merge weapons in a grid inventory and hold the barricade against 99 waves of monsters. Weapons fire on their own; you pick traits, shop between waves and fire the Burst Skill.',
  });
}

module.exports = { build };
