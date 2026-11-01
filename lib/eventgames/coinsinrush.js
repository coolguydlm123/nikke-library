// MADE IN RUSH / Rope Running (EventRopeRunning*): Ade runs forward on her own; you jump over
// obstacles and pits and swing from chandeliers with a rope. HP drains every second and on
// every hit; the run ends at 0 HP or after a fall. Score = distance + coins. Coins also earn SP
// to raise Ade's stats, and four blueprint fragments open the bonus "Rush" route.
// Times in the manager are in 1/1000 s (the Oxygen Bag's 1500 is "1.5 sec" in its text).

const ms = (v) => `${+(v / 1000).toFixed(2)} s`;
const num = (n) => n.toLocaleString('en-US');

const OBJECT = {
  GoldCoin: 'Gold coin', SilverCoin: 'Silver coin', RushItem: 'Blueprint fragment', MagnetItem: 'Magnet',
  RecoveryItem: 'Chocolate', ShieldItem: 'Shield', Chandelier: 'Chandelier',
};

function helpGroup(ctx, group, title) {
  const pages = ctx.table('MinigameHelpTipDescTable').filter((d) => d.group_id === group).sort((a, b) => a.order - b.order)
    .map((d) => ({ title: ctx.text(d.helptip_title, ''), image: d.helptip_image || null, text: ctx.text(d.helptip_description, '') }));
  return pages.length ? [{ title, pages }] : [];
}

function build(ctx) {
  const m = ctx.table('EventRopeRunningManagerTable')[0];
  const objects = new Map(ctx.table('EventRopeRunningObjectTable').map((o) => [o.id, o]));
  const groups = new Map(ctx.table('EventRopeRunningObjectGroupTable').map((g) => [g.id, g]));
  const diffs = ctx.table('EventRopeRunningDifficultyTable').filter((d) => d.group_id === m.difficulty_group_id)
    .sort((a, b) => a.difficulty - b.difficulty);
  const normal = diffs.filter((d) => !d.is_rush_mode);
  const rush = diffs.find((d) => d.is_rush_mode);

  // Presets are the level's building blocks: each row is one column of the course (a chandelier
  // slot on the ceiling, up to 10 item cells, an obstacle and a floor tile). A difficulty picks
  // its blocks at random from its preset groups. There are thousands of rows, so we only count.
  const presets = new Map();
  for (const p of ctx.table('EventRopeRunningPresetTable')) {
    if (!presets.has(p.preset_group_id)) presets.set(p.preset_group_id, []);
    presets.get(p.preset_group_id).push(p);
  }
  for (const list of presets.values()) list.sort((a, b) => a.order - b.order);
  const typeOf = (id) => objects.get(id)?.object_type || '';
  const blockStats = (ids) => {
    const s = { blocks: 0, cols: 0, chand: 0, obst: 0, pits: 0, cells: 0, items: 0 };
    for (const id of ids) {
      const list = presets.get(id);
      if (!list) continue;
      s.blocks++;
      s.cols += list.length;
      let inPit = false;
      for (const c of list) {
        if (c.ceiling) s.chand++;
        if (['ObstacleTable', 'ObstaclePillar', 'ObstacleHurdleStart'].includes(typeOf(c.obstacle))) s.obst++;
        if (!c.land && !inPit) s.pits++;
        inPit = !c.land;
        for (let i = 1; i <= 10; i++) {
          const g = groups.get(c[`object_${i}`]);
          if (!g) continue;
          s.cells++;
          // Cells that can roll an item rather than a coin.
          if (g.group_ratio.some((r) => r.object_id && !/Coin/.test(typeOf(r.object_id)) && typeOf(r.object_id) !== 'GuideTap' && typeOf(r.object_id) !== 'GuideHold')) s.items++;
        }
      }
    }
    return s;
  };
  const per = (n, d) => (d ? +(n / d).toFixed(1) : 0);

  // Running total of distance needed to reach each difficulty.
  let at = 0;
  const reachAt = new Map();
  for (const d of normal) { reachAt.set(d.difficulty, at); at += d.need_meter_to_next_difficulty; }

  // The random coin/item cells: chance per 10,000 of what each cell turns into.
  const itemGroups = [...groups.values()].filter((g) => g.group_ratio.filter((r) => r.object_id).length > 1);
  const itemOdds = (objType) => {
    const xs = itemGroups.map((g) => g.group_ratio.find((r) => typeOf(r.object_id) === objType)?.ratio || 0);
    const lo = Math.min(...xs), hi = Math.max(...xs);
    return lo === hi ? `${lo / 100}%` : lo ? `${lo / 100}–${hi / 100}%` : `up to ${hi / 100}%`;
  };

  // Coin spots with the same contents are merged; "hidden" ones only show with the Metal Detector.
  const spotUse = new Map();
  for (const list of presets.values()) for (const c of list) for (let i = 1; i <= 10; i++) {
    const g = c[`object_${i}`];
    if (g) spotUse.set(g, (spotUse.get(g) || 0) + 1);
  }
  const spotKinds = new Map();
  for (const g of groups.values()) {
    const parts = g.group_ratio.filter((r) => r.object_id && /Coin|Item/.test(typeOf(r.object_id)));
    if (!parts.length) continue;
    const contents = parts.map((r) => `${OBJECT[typeOf(r.object_id)] || typeOf(r.object_id)} ${+(r.ratio / 100).toFixed(2)}%`).join(', ');
    const name = parts.length > 1 ? 'Gold coin or item' : `${g.is_visible ? '' : 'Hidden '}${OBJECT[typeOf(parts[0].object_id)] || typeOf(parts[0].object_id)}`.replace(/^Hidden G/, 'Hidden g');
    const key = `${name}|${contents}`;
    const k = spotKinds.get(key) || { name, contents, n: 0 };
    k.n += spotUse.get(g.id) || 0;
    spotKinds.set(key, k);
  }
  const spotRows = [...spotKinds.values()].map((k) => [k.name, k.contents, k.n]);

  const statuses = ctx.table('EventRopeRunningStatusTable').filter((s) => s.group_id === m.status_group_id).sort((a, b) => a.level - b.level);
  const sp = ctx.table('EventRopeRunningStatusPointTable').filter((s) => s.group_id === m.status_point_group_id).sort((a, b) => a.sp_count - b.sp_count);
  const spy = ctx.table('EventRopeRunningSpyItemTable').filter((s) => s.group_id === m.spy_item_group_id).sort((a, b) => a.id - b.id);
  const missions = ctx.table('EventRopeRunningMissionTable').filter((x) => x.group_id === m.mission_group_id).sort((a, b) => a.id - b.id);
  const cutscenes = ctx.table('EventRopeRunningCutSceneTable').filter((c) => c.group_id === m.cut_scene_group_id).sort((a, b) => a.id - b.id);
  const story = ctx.table('EventRopeRunningScenarioTable').filter((s) => s.group_id === m.scenario_group_id)
    .sort((a, b) => a.scenario_unlock_day - b.scenario_unlock_day);
  const ranks = ['s', 'a', 'b', 'c', 'd'].map((r) => [r.toUpperCase(), m[`${r}_rank_target_score`]]);
  const spText = (s) => ctx.plain(s.unlock_condition_locale_key).replace(/\s*\(\{0\}\s*\/\s*\{1\}\)/, '').replace('{1}', num(s.unlock_condition_value));

  return {
    summary: 'An endless runner: Ade dashes forward on her own while you jump obstacles and pits and swing from chandeliers on a rope. Collect coins for score and stat upgrades; go as far as you can before HP runs out.',
    overview: [
      {
        type: 'facts',
        title: 'A run',
        items: [
          ['Intro story', ctx.intro ? { scene: ctx.intro.id, label: ctx.intro.label } : null],
          ['Controls', 'Tap (or Space) to jump. While in the air, hold to shoot a rope; once it hooks a chandelier, the swing flings Ade upward — hold longer to go higher.'],
          ['Game over', 'HP reaches 0, or Ade falls into a pit'],
          ['HP', `Drains every second (${normal[0]?.hp_decrease_per_sec}–${normal[normal.length - 1]?.hp_decrease_per_sec} HP a second, rising with difficulty) and drops further when Ade hits an obstacle`],
          ['After a hit', `Ade slows to ${m.speed_ratio_after_hit}% speed for ${ms(m.speed_ratio_after_hit_time)} and can’t be hurt for ${ms(m.invincible_time)}`],
          ['Rope', `Can be fired again ${ms(m.rope_cooltime)} after the last one`],
          ['Daily reward', [`Run ${num(m.daily_reward_distance)} m in one go:`, { reward: ctx.reward(m.daily_reward_id) }]],
        ],
      },
      {
        type: 'facts',
        title: 'Score and coins',
        items: [
          ['Total score', `Distance score plus coin score (distance score ratio ${m.distance_score_ratio})`],
          ['Gold coin', `${m.get_score_gold_coin_value} points and ${m.get_sp_gold_coin_value} coin points`],
          ['Silver coin', `${m.get_score_silver_coin_value} points and ${m.get_sp_silver_coin_value} coin point${m.get_sp_silver_coin_value === 1 ? '' : 's'}`],
          ['Coin points', 'Add up over all runs and earn SP to spend on Ade’s stats (see Stats)'],
        ],
      },
      {
        type: 'facts',
        title: 'Items on the course',
        note: `Coin spots on the course sometimes hold an item instead (chance per spot shown).`,
        items: [
          ['Chocolate', `Restores HP (the Recovery stat sets how much) — ${itemOdds('RecoveryItem')}`],
          ['Magnet', `Pulls in every item on screen — ${itemOdds('MagnetItem')}`],
          ['Shield', `Blocks one hit from an obstacle (lasts up to ${ms(m.shield_time)}) — ${itemOdds('ShieldItem')}`],
          ['Blueprint fragment', `Collect ${m.rush_count_value} to enter Rush mode — ${itemOdds('RushItem')}`],
        ],
      },
      {
        type: 'facts',
        title: 'Rush mode',
        items: [
          ['How', `Collecting ${m.rush_count_value} blueprint fragments sends Ade onto the hidden Coin Rush route`],
          ['Lasts', ms(m.rush_time)],
          ['On the route', rush ? `Speed ${rush.scroll_speed}, no HP drain, a course packed with coins` : null],
        ],
      },
      { type: 'table', title: 'Ranks', columns: ['Rank', { label: 'Score', num: true }], rows: ranks.map(([r, p]) => [{ b: r }, p]) },
      { type: 'help', help: helpGroup(ctx, m.tutorial_id, 'How to play') },
    ],
    pages: [
      {
        id: 'course',
        title: 'Difficulty and course',
        count: normal.length,
        summary: 'The course speeds up and HP drains faster the further Ade runs. Each difficulty builds its course from random blocks.',
        sections: [
          {
            type: 'table',
            title: 'Difficulty',
            note: 'Speed is the scroll speed in course units a second (the same units as the metres counted for distance, as far as the table shows). Block numbers are averages per block.',
            columns: [
              { label: 'Level', num: true }, { label: 'From', num: true }, { label: 'Speed', num: true }, { label: 'HP drain /s', num: true },
              { label: 'Blocks', num: true }, { label: 'Block length', num: true }, { label: 'Chandeliers', num: true }, { label: 'Obstacles', num: true }, { label: 'Pits', num: true },
            ],
            rows: normal.map((d) => {
              const s = blockStats(d.preset_group_id);
              return [
                d.difficulty, `${num(reachAt.get(d.difficulty))} m`, d.scroll_speed, d.hp_decrease_per_sec,
                s.blocks, per(s.cols, s.blocks), per(s.chand, s.blocks), per(s.obst, s.blocks), per(s.pits, s.blocks),
              ];
            }),
          },
          rush && (() => {
            const s = blockStats(rush.preset_group_id);
            return {
              type: 'facts',
              title: 'Rush route',
              items: [['Blocks', `${s.blocks} (about ${per(s.cols, s.blocks)} columns, ${num(s.cells)} coin spots)`], ['Speed', rush.scroll_speed], ['HP drain', rush.hp_decrease_per_sec ? `${rush.hp_decrease_per_sec} /s` : 'None']],
            };
          })(),
          {
            type: 'table',
            title: 'What a coin spot can hold',
            note: 'Each spot in a block rolls its contents when the block appears (chances per 10,000, shown as %). Spots are counted over every block of every difficulty.',
            columns: ['Spot', 'Contents', { label: 'Spots', num: true }],
            rows: spotRows,
          },
        ].filter(Boolean),
      },
      {
        id: 'stats',
        title: 'Stats',
        count: statuses.length,
        summary: 'Coin points from every run add up to SP; spend SP to raise Ade’s HP, Defense and Recovery.',
        sections: [
          {
            type: 'table',
            title: 'Stat levels',
            note: 'Defense is the damage Ade takes from one obstacle hit (lower is better). Recovery is the HP one chocolate restores. Each level up costs 1 SP.',
            columns: [{ label: 'Level', num: true }, { label: 'Max HP', num: true }, { label: 'Damage per hit', num: true }, { label: 'HP per chocolate', num: true }],
            rows: statuses.map((s) => [s.level, s.hp, s.defence, s.recovery]),
          },
          {
            type: 'text',
            title: 'Earning SP',
            text: sp.length
              ? `You earn 1 SP for every ${num(sp[0].get_coin_point)} coin points collected in total, up to ${sp.length} SP (${num(sp[sp.length - 1].get_coin_point)} coin points) — enough to raise all three stats from level 1 to ${statuses.length ? statuses[statuses.length - 1].level : 'max'}.`
              : '',
          },
        ],
      },
      {
        id: 'spy-tools',
        title: 'Spy tools',
        count: spy.length,
        summary: 'Permanent gadgets unlocked by meeting a goal; all unlocked tools work at once.',
        sections: [{
          type: 'table',
          columns: ['Tool', 'Effect', 'Unlock', 'Available'],
          rows: spy.map((s) => [
            { img: ctx.img(s.resource_id), caption: ctx.plain(s.name_locale_key), size: 'small' },
            ctx.plain(s.desc_locale_key),
            spText(s),
            s.unlock_time ? `${s.unlock_time} days after the event starts` : 'From the start',
          ]),
        }],
      },
      {
        id: 'missions',
        title: 'Missions',
        count: missions.length,
        sections: [{
          type: 'table',
          columns: ['Mission', 'Reward'],
          rows: missions.map((x) => [ctx.plain(x.mission_locale_key, x.mission_type).replace('{0}', num(x.mission_value)), { reward: ctx.reward(x.reward_id) }]),
        }],
      },
      {
        id: 'story',
        title: 'Story and photos',
        count: story.length + cutscenes.length,
        sections: [
          {
            type: 'table',
            title: 'Training reports',
            note: 'One new report opens every two days of the event.',
            columns: [{ label: 'Days after start', num: true }, 'Scene'],
            rows: story.map((s) => [s.scenario_unlock_day, ctx.scene(s.scenario_dialog_group_id) || { key: s.scenario_dialog_group_id }]),
          },
          {
            type: 'table',
            title: 'Photos',
            note: 'Photos are collected at the end of a run. The last two need an S rank after a number of plays.',
            columns: ['Photo', 'Caption', 'Condition'],
            rows: cutscenes.map((c) => [
              { img: ctx.img(c.cutscene_resource), size: 'large' },
              ctx.plain(c.cutscene_description),
              c.special_appear_count ? `S rank after ${c.special_appear_count} plays` : '',
            ]),
          },
        ],
      },
    ],
  };
}

module.exports = { build };
