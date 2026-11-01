// Dragon Dungeon Run (EventDragonDungeonRun*): a lane-hopping runner through a dungeon seven
// tiles wide. Each run you pick one of four heroes, step forward row by row past traps, rivers
// and Raptures, and grab gold. Score = distance + gold. The course is a chain of "waves"; each
// wave draws random 10-row blocks ("presets") from its pool, and later waves use harsher blocks.
// Times are in 1/100 s (Guillotine's 700 cooldown is "7 sec" in her skill text).

const sec = (cs) => `${+(cs / 100).toFixed(2)} s`;
const num = (n) => n.toLocaleString('en-US');
const pct = (per10k) => `${+(per10k / 100).toFixed(2)}%`;

// Object types -> plain names, for hazards that have no locale name.
const HAZARD = {
  Obstacle: 'Wall (box, stone, statue, brazier)',
  Fireball: 'Fireball',
  Rock: 'Boulder trap',
  Needle: 'Spike trap',
  GiantAX: 'Giant saw blade',
  StepStone: 'Stepping stone',
  MoveStepStone: 'Floating stone',
  Rapture: 'Patrolling Rapture',
  TrackingRapture: 'Chasing Rapture',
  Mimic: 'Mimic (disguised as a chest)',
  TrackingMimic: 'Mimic (chasing)',
  Dragon: 'White Ice Dragon’s breath',
  Gold: 'Gold',
};
// Spawner group families (group_id / 100) and what they send across the screen.
const SPAWNER = { 1: 'Floating stones', 2: 'Fireballs', 3: 'Boulders', 4: 'Giant saw blades', 5: 'Patrolling Raptures' };

function helpGroup(ctx, group, title) {
  const pages = ctx.table('MinigameHelpTipDescTable').filter((d) => d.group_id === group).sort((a, b) => a.order - b.order)
    .map((d) => ({ title: ctx.text(d.helptip_title, ''), image: d.helptip_image || null, text: ctx.text(d.helptip_description, '') }));
  return pages.length ? [{ title, pages }] : [];
}

function build(ctx) {
  const managers = ctx.table('EventDragonDungeonRunManagerTable');
  const m = managers.find((x) => x.minigame_type === 'Normal') || managers[0];
  const arcade = managers.find((x) => x.minigame_type === 'Arcade');
  const objects = ctx.table('EventDragonDungeonRunObjectTable');
  const objById = new Map(objects.map((o) => [o.id, o]));
  const chars = ctx.table('EventDragonDungeonRunCharacterTable').filter((c) => c.group_id === m.use_character_group_id);
  const charById = new Map(ctx.table('EventDragonDungeonRunCharacterTable').map((c) => [c.id, c]));

  // Preset blocks: 10 rows each, 7 tiles a row. Summarise what each block holds.
  const presets = new Map();
  for (const p of ctx.table('EventDragonDungeonRunPresetTable')) {
    if (!presets.has(p.group_id)) presets.set(p.group_id, []);
    presets.get(p.group_id).push(p);
  }
  const blockInfo = new Map();
  for (const [id, rows] of presets) {
    const s = { rows: rows.length, water: 0, gold: 0, types: new Set() };
    for (const r of rows) {
      if (r.tile_resource.some((t) => /water/.test(t))) s.water++;
      for (let i = 1; i <= 7; i++) {
        const o = objById.get(r[`tile_0${i}_use_object_id`]);
        if (!o) continue;
        if (o.object_type === 'Gold') s.gold += o.give_gold_amount * o.appearance_percent / 10000;
        else if (o.object_type !== 'Obstacle' && o.object_type !== 'StepStone') s.types.add(HAZARD[o.object_type] || o.object_type);
      }
      for (const sp of [r.tile_o1_use_spawner_group_id, r.tile_o2_use_spawner_group_id]) {
        if (sp && SPAWNER[Math.floor(sp / 100)]) s.types.add(SPAWNER[Math.floor(sp / 100)]);
      }
    }
    blockInfo.set(id, s);
  }

  const waves = ctx.table('EventDragonDungeonRunWaveTable').filter((w) => w.group_id === m.use_wave_group_id).sort((a, b) => a.id - b.id);
  const waveRow = (w, i) => {
    const pool = w.presetgroupdata.filter((p) => p.preset_group_id && p.preset_group_ratio);
    const total = pool.reduce((n, p) => n + p.preset_group_ratio, 0) || 1;
    const types = new Set();
    let water = 0, gold = 0, rows = 0;
    for (const p of pool) {
      const b = blockInfo.get(p.preset_group_id);
      if (!b) continue;
      const share = p.preset_group_ratio / total;
      water += share * b.water; gold += share * b.gold; rows += share * b.rows;
      b.types.forEach((t) => types.add(t));
    }
    const blocks = w.is_infinity ? 'Endless' : w.is_repeat ? w.repeat_count : 1;
    return [
      i + 1,
      w.level_up_locale ? { text: 'Difficulty up', sub: ctx.plain(w.level_up_locale) } : '',
      blocks,
      pool.length,
      rows ? `${Math.round(100 * water / rows)}%` : '',
      +gold.toFixed(1),
      [...types].sort().join(', '),
    ];
  };

  // Moving hazards: spawner rows grouped by family.
  const spawners = ctx.table('EventDragonDungeonRunSpawnerTable');
  const spawnerRows = Object.entries(SPAWNER).map(([fam, name]) => {
    const list = spawners.filter((s) => Math.floor(s.group_id / 100) === +fam);
    if (!list.length) return null;
    const speeds = list.map((s) => s.object_speed_tile_per_second);
    const lo = Math.min(...list.map((s) => s.object_repeat_interval_min)), hi = Math.max(...list.map((s) => s.object_repeat_interval_max));
    const warn = list.find((s) => s.use_warning_sign);
    return [name, `${Math.min(...speeds)}–${Math.max(...speeds)}`, `${sec(lo)}–${sec(hi)}`, warn ? `Warning sign ${sec(warn.warning_sign_time)} ahead` : ''];
  }).filter(Boolean);

  // One row per distinct hazard kind (the first object of each type carries the numbers).
  const firstOf = (type) => objects.find((o) => o.object_type === type);
  const needle = firstOf('Needle');
  const dragon = firstOf('Dragon');
  const mimic = firstOf('TrackingMimic');
  const rapture = objects.filter((o) => o.object_type === 'Rapture');
  const chances = (type) => [...new Set(objects.filter((o) => o.object_type === type).map((o) => o.appearance_percent))].sort((a, b) => b - a).map(pct).join(' / ');
  const hazardRows = [
    [HAZARD.Obstacle, 'Blocks the way. Some can be broken by Guillotine’s and Vesti’s skills.', ''],
    [HAZARD.Needle, needle ? `Spikes stay up ${sec(needle.needle_up_time)}, down ${sec(needle.needle_down_time)} (${sec(needle.needle_up_to_down_time)} to switch).` : '', needle?.object_damage],
    [HAZARD.Fireball, 'Flies across a row.', firstOf('Fireball')?.object_damage],
    [HAZARD.Rock, 'Rolls across a row.', firstOf('Rock')?.object_damage],
    [HAZARD.GiantAX, 'Sweeps slowly across a row, announced by a warning sign.', firstOf('GiantAX')?.object_damage],
    [HAZARD.Rapture, `Walks back and forth. Bump into one or step into its alert zone (${[...new Set(rapture.map((r) => r.guard_range / 100))].join(' or ')} tiles) and it starts chasing you.`, rapture[0]?.object_damage],
    [HAZARD.Mimic, `Looks like a gold chest (appears ${chances('Mimic')} of the time where placed). Touch it and it chases you after ${mimic ? sec(mimic.chase_delay_time) : '?'}.`, mimic?.object_damage],
    [HAZARD.Dragon, dragon ? `Breathes ice along a row: ${sec(dragon.preaction_time)} wind-up, then ${sec(dragon.dragon_fire_time)} of breath. Knocks you back.` : '', dragon?.object_damage],
    ['Water', 'Instant death, whatever your HP. Cross rivers on stepping stones and floating stones (1–3 tiles long).', '∞'],
  ];
  const golds = objects.filter((o) => o.object_type === 'Gold');
  const goldRows = [...new Map(golds.map((g) => [g.object_resource, g])).values()].map((g) => [
    { coin_single: 'Coin', coin_bag: 'Coin bag', coin_chest: 'Gold chest' }[g.object_resource.replace('dragondungeonrun_ingame_', '')] || g.object_resource,
    g.give_gold_amount,
    [...new Set(golds.filter((x) => x.object_resource === g.object_resource).map((x) => x.appearance_percent))].sort((a, b) => b - a).map(pct).join(' / '),
  ]);

  const charRows = chars.map((c) => [
    { img: ctx.img(c.character_icon), caption: ctx.plain(c.name_locale), size: 'small' },
    [{ img: ctx.img(c.skill_icon), size: 'small' }, { b: ctx.plain(c.skill_name_locale) }],
    // The text repeats uses and cooldown at the end; those have their own columns.
    ctx.plain(c.skill_description_locale).split('\n').filter((l) => !/^(Uses|Cooldown):/.test(l)).join('\n'),
    c.skill_use_count || '∞',
    sec(c.skill_cooltime),
    c.skill_duration ? sec(c.skill_fade_in_time + c.skill_duration + c.skill_fade_out_time) : '',
    c.open_condition === 'None' ? 'From the start' : { text: ctx.plain(c.open_condition_locale, c.open_condition), sub: c.open_date ? `Playable from day ${c.open_date} of the event` : '' },
  ]);

  const skipRows = [1, 2].map((i) => {
    const k = `skip_early_phase_0${i}_`;
    return m[`${k}start_wave`] ? [
      `${num(m[`${k}adjust_distance`])} m`,
      `Wave ${m[`${k}start_wave`]}`,
      `Day ${m[`${k}open_date`]}`,
      `Reach ${num(m[`${k}open_distance`])} m in a run from the start`,
      `+${num(m[`${k}adjust_distance`])} m, +${num(m[`${k}adjust_gold`])} gold`,
    ] : null;
  }).filter(Boolean);

  const cutscenes = ctx.table('EventDragonDungeonRunCutSceneTable').filter((c) => c.group_id === m.cutscene_group_id);
  const deaths = cutscenes.filter((c) => c.cutscene_print_timing === 'Dead');
  const endings = cutscenes.filter((c) => c.cutscene_print_timing !== 'Dead');
  const DEATH = { Fall: 'fall', Mimic: 'mimic', GiantAX: 'giantax', Fireball: 'fireball', Rock: 'rock', Rapture: 'rapture', Needle: 'niddle', Dragon: 'dragon' };
  const story = ctx.table('EventDragonDungeonRunScenarioTable').filter((s) => s.group_id === m.scenario_group_id)
    .sort((a, b) => a.scenario_unlock_day - b.scenario_unlock_day);
  const ranks = ['s', 'a', 'b', 'c', 'd'].map((r) => [r.toUpperCase(), m[`${r}_rank_target_point`]]);

  const missionPage = (mgr, id, title, summary) => {
    const list = ctx.table('EventDragonDungeonRunMissionTable').filter((x) => x.group_id === mgr.mission_group_id).sort((a, b) => a.id - b.id);
    return list.length ? {
      id, title, group: 'Missions', count: list.length, summary,
      sections: [{
        type: 'table',
        columns: ['Mission', 'Reward'],
        rows: list.map((x) => {
          const who = x.mission_type === 'PlayCharacterCount' ? charById.get(x.mission_target_id) : null;
          return [
            who ? { img: ctx.img(who.character_icon), caption: ctx.plain(x.mission_localkey, x.mission_type), size: 'small' } : ctx.plain(x.mission_localkey, x.mission_type),
            { reward: ctx.reward(x.reward_id) },
          ];
        }),
      }],
    } : null;
  };

  return {
    summary: 'Guide a hero up a dungeon seven tiles wide, dodging traps, rivers, Raptures and the White Ice Dragon’s breath. Score is the distance you cover plus the gold you pick up.',
    overview: [
      {
        type: 'facts',
        title: 'A run',
        items: [
          ['Intro story', ctx.intro ? { scene: ctx.intro.id, label: ctx.intro.label } : null],
          ['Controls', 'Tap to step forward, swipe to step in that direction (arrow keys on PC); the skill button (Space) casts your hero’s skill'],
          ['HP', `Every hero starts with ${chars[0]?.start_hp} HP; a trap or monster takes ${dragon?.object_damage ?? 100}, so ${Math.ceil((chars[0]?.start_hp || 200) / (dragon?.object_damage || 100))} hits end the run`],
          ['After a hit', `${sec(m.invincible_time)} of invincibility`],
          ['Instant death', 'Falling into water'],
          ['Score', 'Distance travelled plus gold collected'],
          ['Daily reward', [`Score ${num(m.daily_reward_point)} in one run:`, { reward: ctx.reward(m.daily_reward_id) }]],
        ],
      },
      {
        type: 'table',
        title: 'Gold',
        note: 'Chance is how often a placed coin / bag / chest actually appears. Some chests are Mimics.',
        columns: ['Pickup', { label: 'Gold', num: true }, 'Chance'],
        rows: goldRows,
      },
      {
        type: 'table',
        title: 'Starting further in',
        note: 'Once unlocked, a run can start part-way up the dungeon with the skipped distance and some gold already counted. Skipped runs don’t count towards missions.',
        columns: ['Start at', 'From', 'Available', 'Unlock', 'Credited'],
        rows: skipRows,
      },
      { type: 'table', title: 'Ranks', columns: ['Rank', { label: 'Score', num: true }], rows: ranks.map(([r, p]) => [{ b: r }, p]) },
      { type: 'help', help: helpGroup(ctx, m.tutorial_id, 'How to play') },
    ],
    pages: [
      {
        id: 'heroes',
        title: 'Heroes',
        count: chars.length,
        summary: 'Pick one hero per run. They share the same HP; only the skill differs.',
        sections: [{
          type: 'table',
          note: arcade ? 'The Arcade replay uses the same four heroes and skills.' : undefined,
          columns: ['Hero', 'Skill', 'Effect', { label: 'Uses', num: true }, 'Cooldown', 'Lasts', 'Unlock'],
          rows: charRows,
        }],
      },
      {
        id: 'hazards',
        title: 'Traps and monsters',
        count: hazardRows.length,
        summary: 'What stands in your way. Damage is out of the hero’s HP.',
        sections: [
          { type: 'table', columns: ['Hazard', 'How it works', { label: 'Damage', num: true }], rows: hazardRows },
          {
            type: 'table',
            title: 'Moving hazards',
            note: 'Launchers at the side of a row send these across again and again. Speed is in the table’s own units (higher is faster); the interval is the time between two launches.',
            columns: ['Hazard', 'Speed', 'Interval', 'Note'],
            rows: spawnerRows,
          },
        ],
      },
      {
        id: 'course',
        title: 'The course',
        count: waves.length,
        summary: 'The dungeon is built wave by wave from random 10-row blocks; each wave draws its blocks from its own pool.',
        sections: [{
          type: 'table',
          note: 'Blocks = how many blocks the wave lays down. Water and Gold are averages over the wave’s pool, weighted by how often each block is picked (Gold counts only gold that is sure to appear, scaled by its chance). The last wave repeats until the run ends.',
          columns: [{ label: 'Wave', num: true }, 'Message', 'Blocks', { label: 'Pool', num: true }, { label: 'Water rows', num: true }, { label: 'Gold / block', num: true }, 'Hazards'],
          rows: waves.map(waveRow),
        }],
      },
      {
        id: 'story',
        title: 'Story and photos',
        count: story.length + cutscenes.length,
        sections: [
          {
            type: 'table',
            title: 'Story',
            note: 'A new chapter opens every two days of the event.',
            columns: [{ label: 'Day', num: true }, 'Scene'],
            rows: story.map((s) => [s.scenario_unlock_day, ctx.scene(s.scenario_dialog_group_id) || { key: s.scenario_dialog_group_id }]),
          },
          {
            type: 'table',
            title: 'Death photos',
            note: 'Shown when a run ends to this cause.',
            columns: ['Photo', 'Title', 'Cause'],
            rows: deaths.map((c) => [
              { img: ctx.img(c.cutscene_resource), size: 'large' },
              { text: ctx.plain(c.cutscene_name), sub: ctx.plain(c.cutscene_description) },
              ctx.plain(`Locale_Event:event_dungeon_run_dead_${DEATH[c.cutscene_print_type] || ''}`, c.cutscene_print_type),
            ]),
          },
          {
            type: 'table',
            title: 'Ending photos',
            note: 'Shown on the result screen for the rank you finish with.',
            columns: ['Photo', 'Title', 'Rank'],
            rows: endings.map((c) => [
              { img: ctx.img(c.cutscene_resource), size: 'large' },
              { text: ctx.plain(c.cutscene_name), sub: ctx.plain(c.cutscene_description) },
              ['s', 'a', 'b', 'c', 'd', 'f'].filter((r) => c[`is_appear_in_${r}_rank`]).map((r) => r.toUpperCase()).join(', '),
            ]),
          },
        ],
      },
      missionPage(m, 'missions', 'Event missions', 'Challenges count over all your runs.'),
      arcade && arcade.mission_group_id !== m.mission_group_id && missionPage(arcade, 'missions-arcade', 'Arcade missions', 'The challenges when the game is replayed in Arcade mode.'),
    ].filter(Boolean),
  };
}

module.exports = { build };
