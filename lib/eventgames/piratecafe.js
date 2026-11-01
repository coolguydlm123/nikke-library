// Pirate Cafe (EventPirateCafe*): a serving game. Customers sit down and order one to three
// dishes; you send a maid (Mast, Anchor, Sin) to carry each dish to the right table before
// the customer's patience runs out, then clear the table after they eat. Correct orders fill
// the Fever gauge; in Fever the maids serve on their own while customers stream in.
// It runs on the same engine as the CE003 serving game and reuses its texts (Satisfaction,
// Proficiency, missions). Times are in 1/100 s (time_limit 9000 = 90 s); speeds have no
// unit, so they are only compared with each other.

const sec = (cs) => `${+(cs / 100).toFixed(2)} s`;
const n = (v) => Number(v).toLocaleString('en-US');
const pct = (v) => `${+v.toFixed(1)}%`;

// What a Proficiency skill does: skill_value is a percentage of the normal value.
const SKILL = {
  ChangePercentMaidMoveSpeed: (v) => `Maid speed ${v}%`,
  ChangePercentServingFailTime: (v) => `Wrong-dish freeze ${v}% as long`,
  ChangePercentMaidCleanTime: (v) => `Cleaning takes ${v}% as long`,
  ChangePercentWaitTimeServing: (v) => `Customers wait ${v}% as long`,
  ChangePercentNpcMoveSpeed: (v) => `Customer speed ${v}%`,
  ChangePercentWaitTimeEating: (v) => `Customers eat in ${v}% of the time`,
};

function build(ctx) {
  const managers = ctx.table('EventPirateCafeManagerTable');
  const m = managers.find((x) => x.minigame_type === 'Normal') || managers[0];
  const arcade = managers.find((x) => x.minigame_type === 'Arcade');
  const stages = ctx.table('EventPirateCafeStageTable').sort((a, b) => a.stage_level - b.stage_level);
  const maids = ctx.table('EventPirateCafeCharacterTable');
  const menus = ctx.table('EventPirateCafeMenuTable');
  const npcs = ctx.table('EventPirateCafeNpcTable');
  const missions = ctx.table('EventPirateCafeMissionTable');
  const skills = ctx.table('EventPirateCafeSkillTable').filter((s) => s.group_id === m.skill_group_id).sort((a, b) => a.skill_rank - b.skill_rank);
  const dialogs = ctx.table('EventPirateCafeDialogTable');
  const dialogGroups = ctx.table('EventPirateCafeDialogGroupTable');

  const stageName = (s) => ctx.plain(s.stage_level_name, `Level ${s.stage_level}`);
  // The maid's name is her character_type (Mast / Anchor / Sin); portraits are keyed by resource id.
  const maidName = (resource) => maids.find((c) => c.resource_id === resource)?.character_type || resource;
  const maidsOf = (s) => maids.filter((c) => c.group_id === s.use_maid_group_id);
  const help = (group) => [{
    title: 'How to play',
    pages: ctx.table('MinigameHelpTipDescTable').filter((d) => d.group_id === group).sort((a, b) => a.order - b.order)
      .map((d) => ({ title: ctx.plain(d.helptip_title), image: ctx.img(d.helptip_image), text: ctx.plain(d.helptip_description) })),
  }];

  // Order sizes: weights of 1-, 2- and 3-dish orders, with the points each one pays.
  const orders = (s) => {
    const w = [1, 2, 3].map((i) => s[`normal_order_${i}_weight`]);
    const total = w.reduce((a, b) => a + b, 0);
    return [1, 2, 3].filter((i) => w[i - 1]).map((i) => `${i} dish${i > 1 ? 'es' : ''}: ${pct(100 * w[i - 1] / total)} of orders, ${n(s[`normal_order_${i}_get_point`])} pts, waits ${sec(s[`normal_order_${i}_wait_time_serving`])}`);
  };
  const base = stages[0];

  // Difficulty comparison: one row per rule, one column per difficulty.
  const row = (label, f) => [{ b: label }, ...stages.map(f)];
  const difficulty = {
    type: 'table',
    title: 'Difficulties',
    note: 'Unlock needs the Satisfaction added up over all runs. Speeds are relative (the base maid speed is 70).',
    columns: ['', ...stages.map(stageName)],
    rows: [
      row('Unlock', (s) => (s.enter_condition_value ? `${n(s.enter_condition_value)} Satisfaction` : 'From the start')),
      row('In-game text', (s) => ctx.plain(s.stage_level_desc)),
      row('Maids', (s) => maidsOf(s).map((c) => c.character_type).join(', ')),
      row('Dishes on the menu', (s) => `${menus.filter((x) => x.group_id === s.normal_menu_group_id).length}`),
      row('Orders', orders),
      row('Eating time', (s) => sec(s.normal_wait_time_eating)),
      row('New customer every', (s) => sec(s.normal_npc_spawn_time)),
      row('Fever gauge per customer', (s) => `${s.normal_npc_get_fever_gauge} of ${s.fever_gauge_max}`),
      row('Event customers', (s) => (s.use_event_npc
        ? `Turn count ${s.event_npc_turn_count} (how often they come); order ${s.event_order_count} dishes for ${n(s.event_order_get_point)} pts, wait ${sec(s.event_wait_time_serving)}, +${s.event_npc_get_fever_gauge} Fever gauge`
        : 'None')),
      row('Cleaning a table', (s) => `${sec(s.clean_time)} for ${n(s.clean_get_point)} pts`),
      row('Fever', (s) => `${sec(s.fever_play_time)}; maids ×${+(s.fever_maid_move_speed / s.normal_maid_move_speed).toFixed(1)} speed; a customer every ${sec(s.fever_npc_spawn_time)}, ${s.fever_order_count} dish(es) each, ${n(s.fever_order_get_point)} pts per order, eats in ${sec(s.fever_wait_time_eating)}`),
    ],
  };

  const missionTable = (group, type, title, note) => {
    const list = missions.filter((x) => x.group_id === group && x.mission_type === type).sort((a, b) => a.order - b.order);
    return list.length ? {
      type: 'table',
      title,
      note,
      columns: [{ label: '#', num: true }, 'Goal', 'Reward'],
      rows: list.map((x) => [x.order, ctx.plain(x.name_localkey, x.condition_type).replace('{0}', n(x.condition_value)), { reward: ctx.reward(x.reward_id) }]),
    } : null;
  };

  // End-of-run lines: the score picks a band (below max point 1, below max point 2, above),
  // and each band holds lines for the maids of that difficulty.
  const linesPage = {
    id: 'lines',
    title: 'End-of-run lines',
    summary: 'What the maids say on the results screen, by score.',
    sections: stages.map((s) => {
      const bands = [
        [`Below ${n(s.dialog_group_1_max_point)}`, s.dialog_group_1],
        [`${n(s.dialog_group_1_max_point)} – ${n(s.dialog_group_2_max_point)}`, s.dialog_group_2],
        [`${n(s.dialog_group_2_max_point)} and up`, s.dialog_group_3],
      ];
      return {
        type: 'table',
        title: stageName(s),
        columns: ['Score', 'Maid', 'Line'],
        rows: bands.flatMap(([label, g]) => dialogGroups.filter((d) => d.dialog_group_id === g).map((d) => dialogs.find((x) => x.id === d.dialog_id)).filter(Boolean)
          .map((d, i) => [i ? '' : label, maidName(d.portrait_id.replace(/^.*_face_/, '')), ctx.plain(d.locale)])),
      };
    }),
  };

  return {
    summary: 'Run the pirate cafe for 90 seconds: send maids to carry the right dishes to each table before customers give up, clear the tables, and fill the Fever gauge for a rush of auto-served orders. Satisfaction (score) unlocks harder shifts and Proficiency bonuses.',
    overview: [
      {
        type: 'facts',
        title: 'A shift',
        items: [
          ['Intro story', ctx.scene(m.first_enter_scenario_group_id)],
          ['Time limit', `${sec(base.time_limit)} (warning ${sec(m.game_end_alert_start_time)} before the end)`],
          ['Serving', 'Maids take dishes from the food counter to the tables. Each maid holds up to 2 dishes; a dish nobody needs can go in the trash can.'],
          ['Wrong dish', `The maid is frozen for ${sec(base.normal_maid_serving_fail_time)}`],
          ['Missed order', 'A customer whose wait runs out leaves without paying any Satisfaction'],
          ['After eating', 'The table has to be cleaned before the next customer, which also earns Satisfaction'],
          ['Fever', `Correct orders fill the gauge (max ${base.fever_gauge_max}). In Fever, maids serve automatically while customers stream in and order the special dish.`],
          ['Event customers', 'From Normal on, a special customer sometimes comes in with a bigger, better-paying order and more Fever gauge'],
          ['Daily reward', [`${n(m.daily_reward_condition_value)} Satisfaction in a day:`, { reward: ctx.reward(m.daily_reward_id) }]],
          ['Arcade', arcade ? 'A rerun mode with its own missions (no daily reward).' : null],
        ],
      },
      difficulty,
      { type: 'help', help: help(m.help_tip_group_id) },
    ],
    pages: [
      {
        id: 'staff',
        title: 'Maids and customers',
        sections: [
          {
            type: 'table',
            title: 'Maids on duty',
            columns: ['Difficulty', 'Maids'],
            rows: stages.map((s) => [stageName(s), maidsOf(s).map((c) => ({ img: ctx.img(c.si_resource_id), caption: c.character_type, size: 'small' }))]),
          },
          {
            type: 'table',
            title: 'Customers',
            note: 'Regular customers come in six looks; the event customer is the special guest of Normal and Hard.',
            columns: ['Customer', 'Type'],
            rows: npcs.map((c) => [{ img: ctx.img(c.resource_id), caption: c.resource_id.replace(/^pirate_guest_/, '').replace(/_/g, ' ') }, c.npc_type === 'EVENT' ? { tag: 'Event', tone: 'accent' } : 'Regular']),
          },
        ],
      },
      {
        id: 'proficiency',
        title: 'Proficiency',
        count: skills.length,
        summary: ctx.plain('Locale_Event:CE003_MINI_GAME_SKILL_FUNCTION_POPUP_DESC'),
        sections: [{
          type: 'table',
          note: 'Levels go up with the Satisfaction added up over all runs; every unlocked bonus stays on.',
          columns: [{ label: 'Level', num: true }, { label: 'Total Satisfaction', num: true }, 'Bonus', 'Effect'],
          rows: skills.map((s) => [s.skill_rank, s.active_condition_value, { text: ctx.plain(s.name_localkey), sub: ctx.plain(s.description_localkey) }, (SKILL[s.skill_type] || ((v) => `${s.skill_type} ${v}`))(s.skill_value)]),
        }],
      },
      {
        id: 'missions',
        title: 'Missions',
        count: missions.length,
        sections: [
          missionTable(m.mission_group_id, 'TotalGet', ctx.plain('Locale_Event:CE003_MINI_GAME_MISSION_STACK_MISSION_FUNCTION', 'Accumulation missions'), ctx.plain('Locale_Event:CE003_MINI_GAME_MISSION_STACK_MISSION_DESC')),
          missionTable(m.mission_group_id, 'Achievement', ctx.plain('Locale_Event:CE003_MINI_GAME_MISSION_STACK_ACHIVEMENT_FUNCTION', 'Challenge'), ctx.plain('Locale_Event:CE003_MINI_GAME_MISSION_STACK_ACHIVEMENT_DESC')),
          arcade && missionTable(arcade.mission_group_id, 'TotalGet', 'Arcade: accumulation missions', 'The rerun (Arcade) mode’s list.'),
          arcade && missionTable(arcade.mission_group_id, 'Achievement', 'Arcade: challenge', null),
        ].filter(Boolean),
      },
      linesPage,
    ],
  };
}

module.exports = { build };
