// BBQ Master (EventBBQTycoon*): customers walk up with a skewer order; you stack the
// ingredients, grill them with the fire gauge and serve before their patience runs out.
// Times in the tables are in 1/100 s.

const sec = (cs) => `${+(cs / 100).toFixed(2)} s`;
const pct = (v) => `${v}%`;
const DIFFICULTY = { 1: 'Easy', 2: 'Normal', 3: 'Hard' };
const BONUS = { FeverX2: { tag: 'Fever ×2', tone: 'accent' }, PointX2: { tag: 'Points ×2', tone: 'good' } };

function build(ctx) {
  const m = ctx.table('EventBBQTycoonManagerTable')[0];
  const stuff = ctx.table('EventBBQTycoonSkewerStuffTable').filter((s) => s.group_id === m.skewer_stuff_group_id)
    .sort((a, b) => a.ui_index - b.ui_index);
  const stuffById = new Map(stuff.map((s) => [s.id, s]));
  const stuffCell = (id) => {
    const s = stuffById.get(id);
    return s ? { img: ctx.img(s.ui_portrait_image), caption: ctx.plain(s.stuff_name_localkey), size: 'small' } : null;
  };

  const ranks = ['s', 'a', 'b', 'c', 'd'].map((r) => [r.toUpperCase(), m[`${r}_rank_target_point`]]);
  const customers = ctx.table('EventBBQTycoonCustomerTable').filter((c) => c.group_id === m.customer_group_id);
  const customerName = (c) => ctx.plain(c.customer_name_localkey, c.customer_resource_prefab);

  // One page per difficulty: who can turn up, how likely, and what they order.
  const difficultyPages = [1, 2, 3].map((d) => {
    const list = customers.filter((c) => c.customer_difficulty === d);
    const total = list.filter((c) => !c.condition_stage_event_id).reduce((n, c) => n + c.customer_appearance_rate, 0);
    return {
      id: `orders-${d}`,
      title: `${DIFFICULTY[d]} orders`,
      group: 'Customers',
      count: list.length,
      summary: d === 1 ? `From the start of a run.` : `Once your score reaches ${m[`difficulty_${d}_start_point`].toLocaleString('en-US')}.`,
      sections: [{
        type: 'table',
        title: 'Possible orders',
        note: 'Chance is the customer’s weight against the others of this difficulty. Customers marked “later” only appear after a story stage of the event is cleared.',
        columns: ['Customer', 'Order', 'Bonus', { label: 'Chance', num: true }, { label: 'Patience', num: true }],
        rows: list.map((c) => [
          c.condition_stage_event_id ? { text: customerName(c), sub: 'later' } : customerName(c),
          [1, 2, 3, 4, 5].map((i) => stuffCell(c[`skewer_stuff_id_${i}`])).filter(Boolean),
          BONUS[c.bonus_type] || '',
          c.condition_stage_event_id ? `${c.customer_appearance_rate}` : pct(+(100 * c.customer_appearance_rate / total).toFixed(1)),
          sec(c.customer_limit_time),
        ]),
      }],
    };
  });

  const steps = ctx.table('EventBBQTycoonStepUpRewardTable');
  const stepPage = (group, title) => {
    const list = steps.filter((s) => s.group_id === group).sort((a, b) => a.step - b.step);
    return list.length ? {
      id: `rewards-${group}`,
      title,
      group: 'Rewards',
      count: list.length,
      summary: 'Rewards for the total score added up over all your runs.',
      sections: [{ type: 'table', columns: [{ label: 'Step', num: true }, { label: 'Total score', num: true }, 'Reward'], rows: list.map((s) => [s.step, s.target_point, { reward: ctx.reward(s.reward_id) }]) }],
    } : null;
  };
  const arcade = ctx.table('EventBBQTycoonArcadeManagerTable')[0];

  const cutscenes = ctx.table('EventBBQTycoonCartoonCutSceneTable').filter((c) => c.group_id === m.cartoon_cutscene_group_id);
  const story = ctx.table('EventBBQTycoonScenarioTable').filter((s) => s.group_id === m.scenario_group_id)
    .sort((a, b) => a.scenario_output_condition - b.scenario_output_condition);

  return {
    summary: 'Grill skewers to order before each customer runs out of patience. Better grilling scores more and fills the Fever gauge.',
    overview: [
      {
        type: 'facts',
        title: 'A run',
        items: [
          ['Time limit', sec(m.time_limit)],
          ['Intro story', ctx.intro ? { scene: ctx.intro.id, label: ctx.intro.label } : null],
          ['Customer patience', `${sec(customers[0]?.customer_limit_time || 0)} (warning ${sec(m.customer_limit_expire_alert_time)} before they leave)`],
          ['New customer every', `${sec(m.customer_visit_rate)} on Easy, ×${m.customer_visit_rate_difficulty_2_ratio / 100} as often on Normal, ×${m.customer_visit_rate_difficulty_3_ratio / 100} on Hard`],
          ['Difficulty', `Normal from ${m.difficulty_2_start_point.toLocaleString('en-US')} points, Hard from ${m.difficulty_3_start_point.toLocaleString('en-US')}`],
          ['Daily reward', [`Score ${m.daily_reward_target_point.toLocaleString('en-US')} in one run:`, { reward: ctx.reward(m.daily_reward_id) }]],
        ],
      },
      {
        type: 'facts',
        title: 'Scoring',
        items: [
          ['Points per skewer', `${m.point_standard} × grade: Great ${pct(m.point_grade_ratio_great)}, Good ${pct(m.point_grade_ratio_good)}, Bad ${pct(m.point_grade_ratio_bad)}`],
          ['Fever gauge', `Fills by ${m.fever_standard_increase} × grade (same ratios) per skewer; Fever at ${m.fever_target_gauge}`],
          ['Fever', `Lasts ${sec(m.fever_time)}; skewers roast ${sec(m.fever_skewer_roast_delay)} apart`],
          ['Bonus customers', 'Some customers double the points (Points ×2) or the Fever gain (Fever ×2) of their order'],
        ],
      },
      {
        type: 'facts',
        title: 'The grill',
        items: [
          ['Fire', `Each tap adds ${m.firepower_increase_per_touch} heat (max ${m.max_firepower}); it drops ${m.firepower_decrease_per_second} a second`],
          ['At full heat', `Skewers roast ${m.max_firepower_roast_speed_ratio / 100}× as fast`],
          ['Burning', `A skewer left on the grill burns after ${sec(m.time_to_burn_skewer)}`],
          ['Overheating', `The grill overheats if kept at full heat for ${sec(m.grill_max_overheating_time)}`],
        ],
      },
      {
        type: 'table',
        title: 'Ranks',
        columns: ['Rank', { label: 'Score', num: true }],
        rows: ranks.map(([r, p]) => [{ b: r }, p]),
      },
      { type: 'gallery', title: 'Ingredients', items: stuff.map((s) => ({ img: s.ui_portrait_image, caption: ctx.plain(s.stuff_name_localkey) })) },
    ],
    pages: [
      {
        id: 'tutorial',
        title: 'Tutorial',
        count: 4,
        sections: ctx.table('EventBBQTycoonTutorialTable').filter((t) => t.group_id === m.tutorial_group_id).map((t, i) => ({
          type: 'facts', title: `Step ${i + 1}`, items: [['', { img: ctx.img(t.tutorial_resource), size: 'large' }], ['', ctx.plain(t.tutorial_description_localkey)]],
        })),
      },
      ...difficultyPages,
      stepPage(m.step_up_reward_group_id, 'Score rewards'),
      arcade && stepPage(arcade.step_up_reward_group_id, 'Score rewards (rerun)'),
      {
        id: 'story',
        title: 'Story and cartoons',
        count: story.length + cutscenes.length,
        sections: [
          {
            type: 'table',
            title: 'Story',
            note: 'Unlocked by playing: each scene opens after the given number of runs.',
            columns: [{ label: 'Runs', num: true }, 'Scene'],
            rows: story.map((s) => [s.scenario_output_condition, ctx.scene(s.scenario_dialog_group_id) || { key: s.scenario_dialog_group_id }]),
          },
          {
            type: 'table',
            title: 'End-of-run cartoons',
            note: 'Which cartoon can play depends on the rank you finish with.',
            columns: ['Cartoon', 'Caption', 'Ranks'],
            rows: cutscenes.map((c) => [
              { img: ctx.img(c.cartoon_cutscene), size: 'large' },
              ctx.plain(c.cartoon_cutscene_description),
              ['s', 'a', 'b', 'c', 'd', 'f'].filter((r) => c[`is_appear_in_${r}_rank`]).map((r) => r.toUpperCase()).join(', '),
            ]),
          },
        ],
      },
    ].filter(Boolean),
  };
}

module.exports = { build };
