// Dessert Rush (EventDessertRush*): plates roll along a rail and you sort each one: serve
// dessert plates (left button), throw away bomb plates (right button), press both for a double
// plate. Correct sorts build a Combo and the Fever gauge; the plate mix gets harder as the Combo
// count grows. Times are in 1/100 s; plate chances are per 10,000.

const sec = (cs) => `${+(cs / 100).toFixed(2)} s`;
const num = (n) => n.toLocaleString('en-US');
const pct = (per10k) => `${+(per10k / 100).toFixed(2)}%`;

// Object groups: 1 = dessert plate, 2 = bomb plate, 3 = double plate (a dessert and a bomb).
const KIND = {
  1: { name: 'Dessert plate', how: 'Serve (left)' },
  2: { name: 'Bomb plate', how: 'Discard (right)' },
  3: { name: 'Double plate', how: 'Both buttons together' },
};

function build(ctx) {
  const all = ctx.table('EventDessertRushManagerTable');
  const m = all.find((x) => !x.is_archive_event) || all[0];
  const rerun = all.find((x) => x.is_archive_event);
  const objects = ctx.table('EventDessertRushObjectTable');
  const objById = new Map(objects.map((o) => [o.id, o]));

  // Plates of one kind are numbered 1, 2, 3 by id (101/201/301 are the first of each kind).
  const objName = (o) => (o.id === m.spawn_special_id ? 'Special plate' : `${KIND[o.group]?.name || 'Plate'} ${o.id % 100}`);
  const objCell = (id) => {
    const o = objById.get(id);
    if (!o) return null;
    const pics = [o.resource_id_01, o.resource_id_02].filter(Boolean).map((r) => ({ img: ctx.img(r), size: 'small' }));
    return { text: objName(o), sub: o.id === m.spawn_special_id ? 'Sort it correctly to turn the rail into one type' : KIND[o.group]?.how, pics };
  };

  // Levels switch the plate mix (a "wave") once the Combo count passes a threshold.
  const waves = new Map(ctx.table('EventDessertRushWaveTable').map((w) => [w.id, w]));
  const levels = [1, 2, 3, 4, 5].map((i) => {
    const k = String(i).padStart(2, '0');
    return { level: i, combo: m[`level_${k}_start_combo_count`], wave: waves.get(m[`level_${k}_wave_id`]) };
  }).filter((l) => l.wave);
  const waveRows = (w) => Array.from({ length: 9 }, (_, i) => {
    const k = String(i + 1).padStart(2, '0');
    return [w[`object_${k}_id`], w[`object_${k}_appearance_probability`]];
  }).filter(([id, p]) => id && p);

  const steps = ctx.table('EventDessertRushStepUpRewardTable');
  const stepPage = (group, title, summary) => {
    const list = steps.filter((s) => s.group_id === group).sort((a, b) => a.step - b.step);
    return list.length ? {
      id: `rewards-${group}`,
      title,
      group: 'Rewards',
      count: list.length,
      summary,
      sections: [{ type: 'table', columns: [{ label: 'Step', num: true }, { label: 'Total score', num: true }, 'Reward'], rows: list.map((s) => [s.step, s.target_point, { reward: ctx.reward(s.reward_id) }]) }],
    } : null;
  };

  const tutorial = ctx.table('EventDessertRushTutorialTable').filter((t) => t.group_id === m.tutorial_group_id).sort((a, b) => a.id - b.id);
  const fever = [1, 2, 3, 4].map((i) => `Lv ${i}: ×${m[`fever_lv${i}_ratio`] / 100}`).join(', ');
  const ranks = ['s', 'a', 'b', 'c', 'd'].map((r) => [r.toUpperCase(), m[`${r}_rank_target_point`]]);
  const plateGallery = objects.filter((o) => o.group !== 3).map((o) => ({ img: o.resource_id_01, caption: objName(o) }));

  return {
    summary: 'Sort plates on a conveyor rail: serve the desserts, discard the bomb plates and hit both buttons for double plates. Correct streaks build a Combo and Fever for big scores.',
    overview: [
      {
        type: 'facts',
        title: 'A run',
        items: [
          ['Intro story', ctx.intro ? { scene: ctx.intro.id, label: ctx.intro.label } : null],
          ['Time limit', `${sec(m.time_limit)} (a warning shows in the last ${sec(m.end_imminent_alert_start_time)})`],
          ['Controls', 'Left button (A / ←) serves a dessert, right button (D / →) discards a bomb, both at once sort a double plate'],
          ['Mistakes', `A wrong sort resets the Combo and locks the rail for ${sec(m.penalty_time)}`],
          ['Special plate', `Every ${m.special_spawn_count} plates a special plate comes along; sorting it correctly turns the next ${m.special_change_dessert_count} plates into the same type as the one at the front`],
          ['Daily reward', [`Score ${num(m.daily_reward_point)} in one run:`, { reward: ctx.reward(m.daily_reward_id) }]],
        ],
      },
      {
        type: 'facts',
        title: 'Scoring',
        items: [
          ['Points per plate', `${m.gain_point}, plus a Combo bonus (+${m.gain_point_x2_combo} / +${m.gain_point_x3_combo} / +${m.gain_point_x4_combo} / +${m.gain_point_x5_combo} at the ×2 to ×5 Combo tiers)`],
          ['Fever gauge', `+${num(m.gain_fever_gauge)} per correct sort, full at ${num(m.max_fever_gauge)} (${Math.ceil(m.max_fever_gauge / m.gain_fever_gauge)} correct sorts); Fever Time starts when it is full`],
          ['Fever Time', `Each correct sort adds more than one to the Combo: ${fever}. A mistake lowers the Fever level.`],
          ['Fever drain', `${num(m.decrease_fever_gauge)} gauge points at a time; a count of ${m.next_fever_need_count} is needed before the next Fever (meaning unclear)`],
        ],
      },
      { type: 'table', title: 'Ranks', columns: ['Rank', { label: 'Score', num: true }], rows: ranks.map(([r, p]) => [{ b: r }, p]) },
      { type: 'gallery', title: 'Plates', items: plateGallery },
    ],
    pages: [
      {
        id: 'tutorial',
        title: 'Tutorial',
        count: tutorial.length,
        sections: tutorial.map((t, i) => ({
          type: 'facts', title: `Step ${i + 1}`, items: [['', { img: ctx.img(t.tutorial_resource), size: 'large' }], ['', ctx.plain(t.tutorial_description_localkey)]],
        })),
      },
      {
        id: 'plates',
        title: 'Plates by level',
        count: levels.length,
        summary: 'The plate mix changes as your Combo count grows: more plate types, and double plates, show up later.',
        sections: levels.map((l) => {
          const rows = waveRows(l.wave);
          const total = rows.reduce((n, [, p]) => n + p, 0);
          return {
            type: 'table',
            title: `Level ${l.level}`,
            sub: l.combo ? `From Combo ${num(l.combo)}` : 'From the start',
            note: total !== 10000 ? `Chances add up to ${pct(total)}.` : undefined,
            columns: ['Plate', 'Picture', { label: 'Chance', num: true }],
            rows: rows.map(([id, p]) => {
              const c = objCell(id);
              return [c ? { text: c.text, sub: c.sub } : { key: String(id) }, c ? c.pics : '', pct(p)];
            }),
          };
        }),
      },
      stepPage(m.step_up_reward_group_id, 'Score rewards', 'Rewards for the total score added up over all your runs.'),
      rerun && rerun.step_up_reward_group_id !== m.step_up_reward_group_id
        && stepPage(rerun.step_up_reward_group_id, 'Score rewards (archive)', 'The same, when the game is replayed from the Archive.'),
    ].filter(Boolean),
  };
}

module.exports = { build };
