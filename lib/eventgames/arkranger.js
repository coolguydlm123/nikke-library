// FIGHT! ARK RANGER (Event FAR*): the Salvation Breakers engine again, with Ark Machines instead
// of Jill / Claire / Ada, 100 waves, summon (robot) weapons, trait refreshes and Burst damage
// that grows with the wave. The viewer is shared with CE007 in _survivor.js.
const { buildSurvivor } = require('./_survivor');

function build(ctx) {
  return buildSurvivor(ctx, 'FAR', {
    summary: 'Pilot an Ark Machine: merge weapons and robot supporters in a grid inventory and hold the barricade against 100 waves. Weapons fire on their own; you pick traits, shop between waves and fire the Burst Skill.',
  });
}

module.exports = { build };
