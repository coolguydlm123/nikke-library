// Re:ADY TO ORDER (EventCE003MiniGame*, the Re:Zero collab): a maid-cafe serving game.
// Customers order a dish, the kitchen cooks it in a limited number of cooking slots, and a
// maid (Emilia, Rem, Ram) carries it to the table. Serving and cleaning cost the maid HP; at
// 0 HP she is out for a while. Event customers order a special dish that starts a ketchup
// timing game, which pays extra Satisfaction and heals the maids.
// Units: times in 1/100 s (time_limit 9000 = 90 s), except the customer arrival gaps
// (visit_cool_time, whole seconds); chances and skill values per 10,000.

const sec = (cs) => `${+(cs / 100).toFixed(2)} s`;
const n = (v) => Number(v).toLocaleString('en-US');
const per10k = (v) => `${+(v / 100).toFixed(1)}%`;
const signed = (v) => `${v > 0 ? '+' : '−'}${per10k(Math.abs(v))}`;

const SKILL = {
  CookSpeedUp: (v) => `Cooking time ${signed(v)}`,
  CleaningSpeedUp: (v) => `Cleaning time ${signed(v)}`,
  AddCookSlot: (v) => `Extra cooking slots: ${v}`,
  HpReduceDown: (v) => `Maid HP loss ${signed(v)}`,
  GetPointMore: (v) => `Satisfaction ${signed(v)}`,
  MaidMoveSpeedUp: (v) => `Maid speed ${signed(v)}`,
  EventCustomerAppearUp: () => 'Switches to the busier event-customer schedule (see Customers)',
};

function build(ctx) {
  const m = ctx.table('EventCE003MiniGameManagerTable')[0];
  const stages = ctx.table('EventCE003MiniGameStageTable').sort((a, b) => a.stage_level - b.stage_level);
  const chars = ctx.table('EventCE003MiniGameCharacterTable');
  const npcs = ctx.table('EventCE003MiniGameNpcTable');
  const spawns = ctx.table('EventCE003MiniGameNpcSpawnGroupTable');
  const menus = ctx.table('EventCE003MiniGameMenuTable');
  const menuGroups = ctx.table('EventCE003MiniGameMenuGroupTable');
  const games = ctx.table('EventCE003MiniGameEventGameTable');
  const notes = ctx.table('EventCE003MiniGameEventGameNoteTable');
  const skills = ctx.table('EventCE003MiniGameSkillTable').sort((a, b) => a.skill_rank - b.skill_rank);
  const missions = ctx.table('EventCE003MiniGameMissionTable').sort((a, b) => a.order - b.order);

  const stageName = (s) => ctx.plain(s.stage_level_name, `Level ${s.stage_level}`);
  const maidName = (c) => ctx.plain(`Locale_Character:${c.resource_id.replace(/^c/, '')}_name`, c.resource_id);
  const maidsOf = (s) => chars.filter((c) => c.group_id === s.use_maid_group);
  // A stage's customers: the schedule names a regular and an event customer group.
  const groupOf = (sched) => spawns.filter((x) => x.group_id === sched).sort((a, b) => a.cool_time_set_start_time - b.cool_time_set_start_time);
  const npcOf = (group) => npcs.find((x) => x.group_id === group);
  const normalNpc = (s) => npcOf(groupOf(s.npc_visit_set_group_id)[0]?.call_npc_group_id);
  const help = [{
    title: ctx.plain('Locale_Event:CE003_MINI_GAME_TUTORIAL_POPUP_FUNCTION', 'How to play'),
    pages: ctx.table('EventCE003MiniGameHelpTipTable').filter((h) => h.group_id === m.help_tip_group_id).sort((a, b) => a.page_number - b.page_number)
      .map((h) => ({ title: ctx.plain(h.help_tip_title), image: ctx.img(h.help_tip_image), text: ctx.plain(h.help_tip_description) })),
  }];

  const regularDishes = menuGroups.filter((g) => !g.is_event_game_active);
  const eventDish = menuGroups.find((g) => g.is_event_game_active);
  const cookTime = menus[0]?.cook_time;

  const row = (label, f) => [{ b: label }, ...stages.map(f)];
  const difficulty = {
    type: 'table',
    title: 'Difficulties',
    note: 'Unlock needs the Satisfaction added up over all runs (shown in game as a Proficiency level).',
    columns: ['', ...stages.map(stageName)],
    rows: [
      row('Unlock', (s) => (s.enter_condition_value ? `${n(s.enter_condition_value)} Satisfaction` : 'From the start')),
      row('In-game text', (s) => ctx.plain(s.stage_level_desc)),
      row('Maids', (s) => maidsOf(s).map(maidName).join(', ')),
      row('Maid HP', (s) => `${maidsOf(s)[0]?.hp}`),
      row('Customer patience', (s) => sec(normalNpc(s)?.wait_time_serving || 0)),
      row('HP per dish served', (s) => `${Math.abs(normalNpc(s)?.serving_reduce_hp_value || 0)}`),
      row('Table needs cleaning', (s) => `${per10k(s.clean_ratio)} of the time; takes ${sec(s.clean_time)} and ${Math.abs(s.clean_reduce_hp_value)} HP, pays ${n(s.clean_get_point)} pts`),
    ],
  };

  // Customers: points per reaction, and the arrival schedule (normal and upgraded).
  const schedule = (sched) => groupOf(sched).map((x) => [
    `${sec(x.cool_time_set_start_time)} – ${sec(x.cool_time_set_end_time)}`,
    x.visit_cool_time_min === x.visit_cool_time_max ? `${x.visit_cool_time_min} s` : `${x.visit_cool_time_min}–${x.visit_cool_time_max} s`,
    x.event_npc_active_prob ? per10k(x.event_npc_active_prob) : '—',
    x.event_npc_force_visit_limit_time ? `after ${sec(x.event_npc_force_visit_limit_time)} without one` : '—',
  ]);
  const customerPage = {
    id: 'customers',
    title: 'Customers',
    summary: 'Who comes in, how long they wait and what they pay.',
    sections: [
      {
        type: 'table',
        title: 'Satisfaction per customer',
        note: 'From the help: the ordered dish scores most, a different dish still scores, and a customer who leaves unserved takes points away. “Upgraded” customers are the ones of the busier schedule used once the event-guest Proficiency bonus is on; they also pay more.',
        columns: ['Difficulty', 'Customer', { label: 'Great', num: true }, { label: 'Good', num: true }, { label: 'Bad', num: true }, 'Waits', 'Eats'],
        rows: stages.flatMap((s) => [s.npc_visit_set_group_id, s.event_npc_visit_upgrade_set_group_id].flatMap((sched, k) => {
          const g = groupOf(sched)[0];
          return [g?.call_npc_group_id, g?.call_event_npc_group_id].map(npcOf).filter(Boolean).map((c, i) => [
            i ? '' : `${stageName(s)}${k ? ' (upgraded)' : ''}`,
            c.npc_type === 'Event' ? { tag: 'Event', tone: 'accent' } : 'Regular',
            c.serving_great_reaction_get_point, c.serving_good_reaction_get_point, c.serving_bad_reaction_get_point,
            sec(c.wait_time_serving), sec(c.wait_time_eating),
          ]);
        })),
      },
      ...stages.flatMap((s) => [[s.npc_visit_set_group_id, ''], [s.event_npc_visit_upgrade_set_group_id, ' (with the event-guest bonus)']].map(([sched, tag]) => ({
        type: 'table',
        title: `${stageName(s)} arrivals${tag}`,
        note: tag ? '' : 'Each phase of the shift sets how often a customer arrives and the chance that it is an event customer; an event customer is forced in if none has come for a while.',
        columns: ['Time in shift', 'New customer every', 'Event customer chance', 'Forced event customer'],
        rows: schedule(sched),
      }))),
    ],
  };

  // Ketchup game: each pattern is up to three bar passes (note sets) with one or more taps.
  const gamePage = {
    id: 'ketchup',
    title: 'Ketchup game',
    summary: ctx.plain('Locale_Event:CE003_MINI_GAME_EVENT_GAME_DESC'),
    sections: [
      {
        type: 'facts',
        items: [
          ['When', 'Serving an event customer their special dish starts it'],
          ['Taps', `Each tap is graded by where the marker is: Perfect ${m.event_game_perfect_point}, Great ${m.event_game_great_point}, Good ${m.event_game_good_point} pts`],
          ['Result', 'The pattern’s total decides its grade (Perfect / Great / Good) using the thresholds below; every grade pays the listed Satisfaction and heals the maids'],
        ],
      },
      ...stages.map((s) => {
        const list = games.filter((g) => g.group_id === s.event_game_group_id);
        const total = list.reduce((a, g) => a + g.ratio, 0);
        return {
          type: 'table',
          title: stageName(s),
          columns: [{ label: 'Pattern', num: true }, { label: 'Chance', num: true }, 'Taps per pass', 'Bar time', 'Perfect window', 'Perfect / Great at', 'Pays'],
          rows: list.map((g, i) => {
            const sets = [1, 2, 3].map((k) => g[`note_set_${k}`]).filter(Boolean).map((id) => notes.filter((x) => x.group_id === id));
            const widths = sets.flat().map((x) => x.perfect_note_end - x.perfect_note_start);
            return [
              i + 1,
              `${+(100 * g.ratio / total).toFixed(1)}%`,
              sets.map((x) => x.length).join(' + '),
              sec(g.timing_bar_move_time),
              widths.length ? `${Math.min(...widths) / 100}–${Math.max(...widths) / 100}% of the bar`.replace(/^(\S+)–\1%/, '$1%') : '',
              `${g.perfect_condition_point} / ${g.great_condition_point}`,
              `+${g.perfect_get_point} pts, +${g.perfect_get_hp} HP`,
            ];
          }),
        };
      }),
    ],
  };

  return {
    summary: 'Run the Re:Zero maid cafe for 90 seconds: cook what customers order, have Emilia, Rem or Ram carry it to the right table before they give up, and clean up after them while watching the maids’ HP. Event customers start a ketchup timing game.',
    overview: [
      {
        type: 'facts',
        title: 'A shift',
        items: [
          ['Intro story', ctx.scene(m.first_enter_scenario_group_id)],
          ['Time limit', `${sec(stages[0].time_limit)} (warning ${sec(m.game_end_alert_start_time)} before the end)`],
          ['Kitchen', `${regularDishes.length} regular dishes, each ordered equally often; each takes ${sec(cookTime)} to cook. ${m.default_cook_slot_count} cooking slot at first; extra orders wait in the production queue.`],
          ['Event dish', eventDish ? 'Only event customers order it; serving it starts the ketchup game' : null],
          ['Serving', 'A maid carries the dish to the table; a dish whose customer has left can be thrown away'],
          ['Unserved', 'A customer who waits too long leaves and Satisfaction is deducted'],
          ['Cleaning', 'After eating, a table may need cleaning, which costs HP but earns Satisfaction'],
          ['Daily reward', [`${n(m.daily_reward_condition_value)} Satisfaction in a day:`, { reward: ctx.reward(m.daily_reward_id) }]],
        ],
      },
      difficulty,
      { type: 'help', help },
    ],
    pages: [
      {
        id: 'maids',
        title: 'Maids',
        summary: 'Serving and cleaning cost HP; a maid at 0 HP is out for a while. Waiting at the starting position or a ketchup game restores HP.',
        sections: [{
          type: 'table',
          columns: ['Difficulty', 'Maid', { label: 'HP', num: true }, 'Recovery', 'At 0 HP', 'Return to start'],
          rows: stages.flatMap((s) => maidsOf(s).map((c, i) => [
            i ? '' : stageName(s),
            { img: ctx.img(c.si_resource_id), caption: maidName(c), size: 'small' },
            c.hp,
            `+${c.hp_auto_recover_value} HP every ${sec(c.hp_auto_recover_condition_time)}`,
            `Out for ${sec(c.hp_zero_stun_time)}, then +${c.hp_zero_stun_recover_value} HP every ${sec(c.hp_zero_stun_recover_condition_time)}`,
            sec(c.character_return_time),
          ])),
        }],
      },
      customerPage,
      gamePage,
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
          ['TotalGet', 'CE003_MINI_GAME_MISSION_STACK_MISSION'],
          ['Achievement', 'CE003_MINI_GAME_MISSION_STACK_ACHIVEMENT'],
        ].map(([type, key]) => ({
          type: 'table',
          title: ctx.plain(`Locale_Event:${key}_FUNCTION`, type),
          note: ctx.plain(`Locale_Event:${key}_DESC`),
          columns: ['Goal', 'Reward'],
          rows: missions.filter((x) => x.mission_type === type).map((x) => [ctx.plain(x.name_localkey, x.condition_type).replace('{0}', n(x.condition_value)), { reward: ctx.reward(x.reward_id) }]),
        })),
      },
    ],
  };
}

module.exports = { build };
