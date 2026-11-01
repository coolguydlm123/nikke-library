// Let's Play, Soda! (EventPlaySoda* plus CatchCoin*, Climbing*, Running*, Smash*, StackUp*):
// an arcade hub from the Golden Coin Rush event with five short sub-games starring Soda.
// Story mode: each sub-game is an "EX" stage on the event's story map, cleared by reaching a
// target (survive N seconds, reach a floor, or score N points). Challenge mode: after the EX
// stage is cleared, the sub-game can be replayed for a high score, and the scores add up
// towards per-game point rewards.
//
// Units differ per sub-game: Climbing/Running/StackUp store decimals as raw float32 bits;
// CatchCoin and Smash store times and rates as integers that read as 1/10,000 (a 19191 spawn
// tick = 1.92 s; this is our reading, the tables don't say).

const num = (n) => n.toLocaleString('en-US');
const s4 = (v) => `${+(v / 10000).toFixed(2)} s`;
const pct = (n, d) => (d ? `${+(100 * n / d).toFixed(1)}%` : '0%');
// float32 stored as its raw int32 bit pattern (1086324736 = 6.0).
const f32 = (v) => {
  if (typeof v !== 'number' || Math.abs(v) < 1e6) return v;
  const b = Buffer.alloc(4);
  b.writeInt32LE(v | 0);
  return +b.readFloatLE(0).toFixed(4);
};

// Sub-games in hub order; `title` is the locale key the hub uses for the name.
const GAMES = [
  { type: 'Running', tutorial: 'ele_letsplaysoda_tutorial_01', enter: 'goldcoinrush_enter_running' },
  { type: 'Smash', tutorial: 'ele_letsplaysoda_tutorial_02', enter: 'goldcoinrush_enter_smash' },
  { type: 'CatchCoin', tutorial: 'ele_letsplaysoda_tutorial_03', enter: 'goldcoinrush_enter_catchcoin' },
  { type: 'StackUp', tutorial: 'ele_letsplaysoda_tutorial_04', enter: 'goldcoinrush_enter_stackup' },
  { type: 'Climbing', tutorial: 'ele_letsplaysoda_tutorial_05', enter: 'goldcoinrush_enter_climbing' },
];
const HURDLE = { hurdle_1x1: 'Hurdle 1×1', hurdle_2x1: 'Hurdle 2×1', hurdle_3x1: 'Hurdle 3×1', hurdle_1x2: 'Hurdle 1×2' };
const COIN = { egg: 'Egg', mojocoin_bronze: 'Bronze coin', mojocoin_silver: 'Silver coin', mojocoin_gold: 'Gold coin' };

// In-game help pages straight from MinigameHelpTipDescTable (this hub isn't in the hub table).
function helpGroup(ctx, group, title) {
  const pages = ctx.table('MinigameHelpTipDescTable').filter((d) => d.group_id === group).sort((a, b) => a.order - b.order)
    .map((d) => ({ title: ctx.text(d.helptip_title, ''), image: d.helptip_image || null, text: ctx.text(d.helptip_description, '') }));
  return pages.length ? [{ title, pages }] : [];
}

function build(ctx) {
  const managers = ctx.table('EventPlaySodaManagerTable');
  const m = managers.find((x) => x.minigame_type === 'Normal') || managers[0];
  const arcade = managers.find((x) => x.minigame_type === 'Arcade');
  const story = ctx.table('EventPlaySodaStoryModeTable').filter((s) => s.group_id === m.story_group_id).sort((a, b) => a.order - b.order);
  const challenge = ctx.table('EventPlaySodaChallengeModeTable').filter((s) => s.group_id === m.challenge_group_id).sort((a, b) => a.order - b.order);
  const points = ctx.table('EventPlaySodaPointRewardTable');
  const dungeon = new Map(ctx.table('EventDungeonStageTable').map((s) => [s.id, s]));

  const titleOf = (type) => {
    const row = story.find((s) => s.game_type === type) || challenge.find((s) => s.game_type === type);
    return row ? ctx.plain(row.game_title, type) : type;
  };
  // "Stage 1-5 (part 1)": the event story-map stage that has to be cleared first.
  const stageName = (id) => {
    const s = dungeon.get(id);
    if (!s) return { key: String(id) };
    const part = String(s.group).slice(0, 4) === String(story[0]?.id || '').slice(0, 4) ? 1 : 2;
    return `${ctx.plain(s.stage_name, String(id))} (event part ${part})`;
  };
  const sceneCell = (id) => ctx.scene(id) || (id ? { key: id } : '');

  const rewardTable = (type, group, title) => {
    const list = points.filter((p) => p.group_id === group && p.game_type === type).sort((a, b) => a.step - b.step);
    return list.length ? {
      type: 'table',
      title,
      columns: [{ label: 'Step', num: true }, { label: 'Total score', num: true }, 'Reward'],
      rows: list.map((p) => [p.step, p.point_value, { reward: ctx.reward(p.reward_id) }]),
    } : null;
  };

  // ---- one builder per sub-game: [facts about a run, difficulty sections] ----

  const running = () => {
    const st = ctx.table('EventRunningStoryStageTable')[0] || {};
    const ch = ctx.table('EventRunningChallengeStageTable')[0] || st;
    const objects = new Map(ctx.table('EventRunningObjectTable').map((o) => [o.id, o]));
    const spawn = ctx.table('EventRunningSpawnGroupTable');
    const steps = ctx.table('EventRunningTimeDifficultTable').filter((d) => d.group_id === ch.time_difficult_group).sort((a, b) => a.difficulty_step - b.difficulty_step);
    const mix = (g) => {
      const list = spawn.filter((s) => s.group_id === g && s.spawn_object_id);
      const total = list.reduce((n, s) => n + s.spawn_ratio, 0);
      return list.map((s) => `${HURDLE[objects.get(s.spawn_object_id)?.object_resource_id] || s.spawn_object_id} ${pct(s.spawn_ratio, total)}`).join(', ');
    };
    const last = steps[steps.length - 1];
    return {
      facts: [
        ['Goal (story)', ctx.plain(st.clear_condition_desc).replace('{0}', st.clear_time_second)],
        ['Goal (challenge)', 'Score as high as you can'],
        ['Controls', 'Tap (or Space) to jump over hurdles'],
        ['Lives', `${ch.life} — bumping a hurdle costs one, then ${ch.hit_immune_time_ms / 1000} s of safety`],
        ['Base points', `${ch.default_obtain_point} (the table doesn’t say what earns them)`],
        ['Speed', `Hurdles move at ${f32(ch.default_object_speed)} × the step’s speed multiplier`],
      ],
      sections: [{
        type: 'table',
        title: 'Difficulty over time',
        note: `The step rises every ${ch.auto_increase_difficulty_second} s.${last && f32(last.auto_increase_play_speed) ? ` After the last step the speed keeps rising by ${f32(last.auto_increase_play_speed)} every ${ch.auto_increase_difficulty_second} s.` : ''} Gap is the distance between hurdles, in the game’s units.`,
        columns: [{ label: 'Step', num: true }, 'From', { label: 'Speed', num: true }, 'Gap', 'Hurdles'],
        rows: steps.map((d) => [d.difficulty_step, `${d.play_time_min} s`, `×${f32(d.difficulty_play_speed)}`, `${d.spawn_distance_min}–${d.spawn_distance_max}`, mix(d.spawn_group_id)]),
      }],
    };
  };

  const climbing = () => {
    const st = ctx.table('EventClimbingStoryStageTable')[0] || {};
    const ch = ctx.table('EventClimbingChallengeStageTable')[0] || st;
    const steps = ctx.table('EventClimbingTimeDifficultTable').filter((d) => d.group_id === ch.time_difficult_group).sort((a, b) => a.difficulty_step - b.difficulty_step);
    const last = steps[steps.length - 1];
    const lines = (d) => [0, 1, 2].map((i) => [i, d[`spawn_line_${i}_ratio`]]).filter(([, w]) => w);
    return {
      facts: [
        ['Goal (story)', ctx.plain(st.clear_condition_desc).replace('{0}', st.clear_time_second)],
        ['Goal (challenge)', 'Score as high as you can'],
        ['Controls', 'Tap the left or right side (A / D) to jump to that rope'],
        ['Lives', `${ch.life} — an obstacle costs one, then ${ch.hit_immune_time_ms / 1000} s of safety`],
        ['Jump', `${ch.jump_motion_length_ms / 1000} s from rope to rope`],
        ['Base points', `${ch.default_obtain_point} (the table doesn’t say what earns them)`],
        ['Speed', `Obstacles move at ${f32(ch.default_object_speed)} × the step’s speed multiplier; the first one comes ${ch.first_object_generate_distance} units in`],
      ],
      sections: [{
        type: 'table',
        title: 'Difficulty over time',
        note: `The step rises every ${ch.auto_increase_difficulty_second} s.${last && f32(last.auto_increase_play_speed) ? ` After the last step the speed keeps rising by ${f32(last.auto_increase_play_speed)} every ${ch.auto_increase_difficulty_second} s.` : ''} Gap is the distance between obstacles. Pattern shows the weights of the table’s “line 1” and “line 2” spawn patterns (likely one rope blocked or both; meaning unclear).`,
        columns: [{ label: 'Step', num: true }, 'From', { label: 'Speed', num: true }, 'Gap', 'Pattern'],
        rows: steps.map((d) => {
          const l = lines(d);
          const t = l.reduce((n, [, w]) => n + w, 0);
          return [d.difficulty_step, `${d.play_time_min} s`, `×${f32(d.difficulty_play_speed)}`, `${d.spawn_distance_min}–${d.spawn_distance_max}`, l.map(([i, w]) => `line ${i}: ${pct(w, t)}`).join(', ')];
        }),
      }],
    };
  };

  const stackUp = () => {
    const st = ctx.table('EventStackUpStoryStageTable')[0] || {};
    const ch = ctx.table('EventStackUpChallengeStageTable')[0] || st;
    const d = ctx.table('EventStackUpTimeDifficultTable').find((x) => x.group_id === ch.time_difficult_group);
    return {
      facts: [
        ['Goal (story)', `Reach floor ${st.clear_number_floors}`],
        ['Goal (challenge)', 'Score as high as you can'],
        ['Controls', 'Soda carries a gold bar back and forth; tap (or Space) to drop it on the stack'],
        ['Game over', 'The bar you carry touches the far wall, or the bar you drop misses the stack'],
        ['Points', `${num(ch.default_obtain_point)} per bar stacked; a near-perfect drop (within ${f32(ch.perfect_action_length)} units) pays ×${f32(ch.perfect_action_point_rate)}`],
        ['Bars', `Start ${f32(ch.object_default_length)} units long`],
        ['Speed', d ? `Soda moves at ${f32(ch.character_default_speed)} × ${f32(d.difficulty_play_speed)}, and ${f32(d.auto_increase_play_speed)} faster every ${ch.auto_increase_difficulty_floor} floors` : null],
      ],
      sections: [],
    };
  };

  const catchCoin = () => {
    const st = ctx.table('EventCatchCoinStoryStageTable')[0] || {};
    const ch = ctx.table('EventCatchCoinChallengeStageTable')[0] || st;
    const chara = ctx.table('EventCatchCoinCharacterTable').find((c) => c.id === ch.character_id);
    const objects = new Map(ctx.table('EventCatchCoinObjectTable').map((o) => [o.id, o]));
    const groups = ctx.table('EventCatchCoinObjectGroupTable');
    const steps = ctx.table('EventCatchCoinTimeDifficultTable').filter((d) => d.group === ch.time_difficult_group).sort((a, b) => a.lv - b.lv);
    // Share of eggs vs coins in a spawn group.
    const eggShare = (g) => {
      let egg = 0, all = 0;
      for (const r of groups) {
        if (r.group !== g) continue;
        all += r.spawn_rate;
        if (objects.get(r.object_id)?.type === 'CharacterHit') egg += r.spawn_rate;
      }
      return pct(egg, all);
    };
    const kinds = [...new Map([...objects.values()].map((o) => [o.resource, o])).values()];
    const story101 = steps.length && ctx.table('EventCatchCoinTimeDifficultTable').some((d) => d.group === st.time_difficult_group && d.group !== ch.time_difficult_group);
    return {
      facts: [
        ['Goal (story)', ctx.plain(st.clear_condition_desc).replace('{0}', num(st.clear_point || 0))],
        ['Goal (challenge)', `Score as high as you can (capped at ${num(ch.point_limit || 0)})`],
        ['Controls', 'Tap the left or right side (A / D) to walk; tap the same side twice to dash'],
        ['Lives', `${ch.life} — each egg that hits Soda costs one`],
        ['Soda', chara ? `Walks at ${chara.move_speed / 10000}, dashes ${chara.dash_range / 10000} units at ${chara.dash_speed / 10000} (the game’s units)` : null],
        ['Difficulty', story101 ? 'Story and challenge use their own (identical) difficulty tables' : null],
      ],
      sections: [
        {
          type: 'table',
          title: 'What falls',
          columns: ['Object', 'Effect'],
          rows: kinds.map((o) => [
            { img: ctx.img(o.resource), caption: COIN[o.resource] || o.resource, size: 'small' },
            o.type === 'AddPoint' ? `+${num(o.type_value)} points` : `−${o.type_value} life`,
          ]),
        },
        {
          type: 'table',
          title: 'Difficulty over time',
          note: 'A new level every 5 s. Every spawn drops a handful of objects; the egg share grows and everything falls faster. Times are read as 1/10,000 s; fall speed is the table’s multiplier (per 10,000).',
          columns: [{ label: 'Level', num: true }, 'From', 'Spawn every', 'Objects per spawn', { label: 'Eggs', num: true }, { label: 'Fall speed', num: true }],
          rows: steps.map((d) => [d.lv, `${d.play_time_min} s`, s4(d.spawn_tick), `${d.spawn_count_min}–${d.spawn_count_max}`, eggShare(d.spawn_group), `×${+(d.object_fall_speed_rate / 10000).toFixed(2)}`]),
        },
      ],
    };
  };

  const smash = () => {
    const st = ctx.table('EventSmashStoryStageTable')[0] || {};
    const ch = ctx.table('EventSmashChallengeStageTable')[0] || st;
    const chars = new Map(ctx.table('EventSmashCharacterTable').map((c) => [c.id, c]));
    const cgroups = ctx.table('EventSmashCharacterGroupTable');
    const steps = ctx.table('EventSmashTimeDifficultTable').filter((d) => d.group === ch.time_difficult_group).sort((a, b) => a.lv - b.lv);
    const name = (c) => {
      const n = c.resource.replace(/^smashsoda_/, '');
      return n.charAt(0).toUpperCase() + n.slice(1);
    };
    const mustangShare = (g) => {
      let bad = 0, all = 0;
      for (const r of cgroups) {
        if (r.group !== g) continue;
        all += r.spawn_rate;
        if (chars.get(r.character_id)?.type === 'NoneTarget') bad += r.spawn_rate;
      }
      return pct(bad, all);
    };
    return {
      facts: [
        ['Goal (story)', ctx.plain(st.clear_condition_desc).replace('{0}', num(st.clear_point || 0))],
        ['Goal (challenge)', `Score as high as you can (capped at ${num(ch.point_limit || 0)})`],
        ['Board', `${ch.spawn_slot_count} holes; tap a Nikke that pops up to hit her with the hammer`],
        ['Lives', `${ch.life} — hitting Mustang costs one`],
        ['Points', `${num(ch.appear_hit_point)} per hit (the same whether she is popping up, waiting or ducking back down); ${num(ch.none_target_pass_point)} for leaving Mustang alone`],
      ],
      sections: [
        {
          type: 'table',
          title: 'Who pops up',
          columns: ['Character', 'Hit her?'],
          rows: [...chars.values()].map((c) => [
            { img: ctx.img(c.resource), caption: name(c), size: 'small' },
            c.type === 'Target' ? { tag: 'Hit', tone: 'good' } : { tag: 'Leave alone', tone: 'bad' },
          ]),
        },
        {
          type: 'table',
          title: 'Difficulty over time',
          note: 'A new level every 5 s. Times are read as 1/10,000 s: “Next after” is the pause before another character pops up, “Stays” how long one waits before ducking down.',
          columns: [{ label: 'Level', num: true }, 'From', { label: 'Max up at once', num: true }, 'Next after', 'Stays', { label: 'Mustang', num: true }],
          rows: steps.map((d) => [d.lv, `${d.play_time_min} s`, d.spawn_count_max, s4(d.spawn_delay_time), s4(d.character_wait_time), mustangShare(d.spawn_group)]),
        },
      ],
    };
  };

  const BUILDERS = { Running: running, Smash: smash, CatchCoin: catchCoin, StackUp: stackUp, Climbing: climbing };

  // Pages: for every sub-game, "How to play" (rules, difficulty) and "Score rewards".
  const gamePages = GAMES.flatMap((g) => {
    const title = titleOf(g.type);
    const b = BUILDERS[g.type]();
    const st = story.find((s) => s.game_type === g.type);
    const chl = challenge.find((s) => s.game_type === g.type);
    const help = [
      ...(st ? helpGroup(ctx, st.stage_helptip_id, 'Story mode') : []),
      ...(chl ? helpGroup(ctx, chl.stage_helptip_id, 'Challenge mode') : []),
    ];
    const id = g.type.toLowerCase();
    const rewards = [
      rewardTable(g.type, m.total_point_reward_group_id, 'During the event'),
      arcade && arcade.total_point_reward_group_id && rewardTable(g.type, arcade.total_point_reward_group_id, 'Arcade replay'),
    ].filter(Boolean);
    return [
      {
        id,
        title: 'How to play',
        group: title,
        summary: st ? `Story stage ${ctx.plain(st.short_name)}; challenge mode opens once it is cleared.` : undefined,
        sections: [
          { type: 'facts', title: 'Rules', items: [['', { img: ctx.img(g.enter), size: 'large' }], ...b.facts] },
          ...b.sections,
          help.length ? { type: 'help', help } : null,
        ].filter(Boolean),
      },
      rewards.length ? {
        id: `${id}-rewards`,
        title: 'Score rewards',
        group: title,
        count: rewards.reduce((n, r) => n + r.rows.length, 0),
        summary: 'Rewards for the total challenge-mode score in this game, added up over all runs.',
        sections: rewards,
      } : null,
    ].filter(Boolean);
  });

  return {
    summary: 'An arcade of five quick sub-games with Soda: run, smash, catch coins, stack gold bars and climb. Each is a story stage to clear, then a challenge mode for high scores and point rewards.',
    overview: [
      {
        type: 'gallery',
        title: 'The games',
        items: GAMES.map((g) => ({ img: g.enter, caption: titleOf(g.type) })),
      },
      {
        type: 'facts',
        title: 'How the hub works',
        items: [
          ['Story mode', 'Each game is an EX stage on the Golden Coin Rush story map. Clear its goal to move on; a story scene plays before and after.'],
          ['Challenge mode', 'Once the EX stage is cleared, the game can be replayed for score. Each game’s scores add up towards its own reward track.'],
          ['Lives', 'Every game gives Soda 2 lives'],
          ['Pausing', m.ingame_pause_second ? `A ${m.ingame_pause_second} s countdown before play resumes` : null],
          ['Daily reward', m.daily_reward_id ? { reward: ctx.reward(m.daily_reward_id) } : null],
          ['Arcade replay', arcade ? 'Challenge mode only, with its own reward tracks' : null],
        ],
      },
      {
        type: 'table',
        title: 'Story mode',
        columns: ['Stage', 'Game', 'Unlock', 'Clear reward', 'Story'],
        rows: story.map((s) => [
          { b: ctx.plain(s.short_name, String(s.id)) },
          { page: s.game_type.toLowerCase(), label: ctx.plain(s.game_title, s.game_type) },
          `Clear ${stageName(s.open_condition_value)}`,
          { reward: ctx.reward(s.clear_reward_id) },
          [sceneCell(s.enter_scenario), sceneCell(s.exit_scenario)].filter(Boolean),
        ]),
      },
      {
        type: 'table',
        title: 'Challenge mode',
        columns: ['Game', 'Unlock'],
        rows: challenge.map((c) => {
          const st = story.find((s) => s.id === c.open_condition_value);
          return [{ page: c.game_type.toLowerCase(), label: ctx.plain(c.game_title, c.game_type) }, st ? `Clear story stage ${ctx.plain(st.short_name)}` : `Clear ${stageName(c.open_condition_value)}`];
        }),
      },
    ],
    pages: gamePages,
  };
}

module.exports = { build };
