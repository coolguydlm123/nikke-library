// Gift Factory (EventSortOut*): boxes ride a conveyor belt and you tap to send each one left
// or right: real gifts to the Box District, Rapture boxes to the Rapture District. Correct
// sorts score points and fill the Full Burst gauge; a wrong sort locks you out briefly.
// A run lasts `time` seconds; the difficulty (wave) goes up at set scores, adding box types
// and paying more per box. Rank at the end of a run decides the reward.

const num = (v) => Number(v).toLocaleString('en-US');
const RANKS = ['s', 'a', 'b', 'c', 'd'];
const SLOTS = [1, 2, 3, 4, 5, 6];

// Box groups: 1 = gifts, 2 = Rapture boxes, 3 = the Full Burst gift.
const GROUP = {
  1: ['Gift', 'Box District'],
  2: ['Rapture box', 'Rapture District'],
  3: ['Burst Gift', 'either side'],
};

// The in-game help (HELP_SORTOUT_EVENT_xx) isn't linked from a hub table, so read it directly.
function helpText(ctx) {
  const out = [];
  for (let i = 1; i <= 20; i++) {
    const n = String(i).padStart(2, '0');
    const title = ctx.plain(`Locale_System:HELP_SORTOUT_EVENT_${n}`);
    if (!title) break;
    const lines = [];
    for (let j = 1; j <= 20; j++) {
      const t = ctx.plain(`Locale_System:HELP_SORTOUT_EVENT_${n}_${String(j).padStart(2, '0')}`);
      if (!t) break;
      lines.push(t);
    }
    out.push({ type: 'list', title, items: lines });
  }
  return out;
}

function build(ctx) {
  const all = ctx.table('EventSortOutTable');
  const m = all.find((x) => !x.is_archive_event) || all[0];
  const boxes = ctx.table('EventSortOutBoxTable').sort((a, b) => a.id - b.id);
  const waves = ctx.table('EventSortOutWaveTable').sort((a, b) => a.level - b.level);
  // Missions hang off the rerun (archive) row's id; there is only one set.
  const missions = ctx.table('EventSortOutMissionTable').sort((a, b) => a.id - b.id);
  const ticket = ctx.rewardName('Item', m.currency_ticket);
  const charge = ctx.table('AutoChargeTable').find((a) => a.id === m.auto_charge_id);
  const missionText = (x) => ctx.plain(x.mission_localkey, `${x.mission_type} ${x.mission_count}`).replace(/^Challenge - /, '');

  // Colours only appear in the mission texts ("Categorize 1,000 red gifts" targets box 101).
  const colour = new Map();
  for (const x of missions.filter((x) => x.mission_type === 'SortOutCount')) {
    const c = missionText(x).match(/\b(\w+) gifts?\b/i);
    if (c && !colour.has(x.mission_target_id)) colour.set(x.mission_target_id, c[1].toLowerCase());
  }
  const special = new Set(waves.map((w) => w.box_special_id));
  const nth = new Map();
  const boxName = new Map(boxes.map((b) => {
    const [kind] = GROUP[b.group_id] || [`Box group ${b.group_id}`];
    const k = (nth.get(b.group_id) || 0) + (special.has(b.id) ? 0 : 1);
    if (!special.has(b.id)) nth.set(b.group_id, k);
    let name = special.has(b.id) ? 'Special gift' : b.group_id === 3 ? kind : `${kind} ${k}`;
    if (colour.has(b.id)) name += ` (${colour.get(b.id)})`;
    return [b.id, name];
  }));
  const firstLevel = (id) => waves.find((w) => SLOTS.some((i) => w[`box${i}_id`] === id) || w.box_special_id === id || w.box_fever_id === id)?.level;
  const startPoint = (lvl) => (lvl === 1 ? 0 : m[`level${lvl}_start_point`]);

  const MTYPE = { GainPointCount: 'Total points (all runs)', OnceGainPointCount: 'Points in one run', SortOutCount: 'Boxes sorted' };

  return {
    summary: 'Sort boxes on a conveyor belt: gifts go to the Box District, Rapture boxes to the Rapture District. Correct sorts score points and charge Full Burst; mistakes stop you for a moment.',
    overview: [
      {
        type: 'facts',
        title: 'A run',
        items: [
          ['Intro story', ctx.scene(m.enter_scenario)],
          ['Time limit', `${m.time} s`],
          ['Cost', `1 ${ticket} per run (Practice Mode is free but gives no rewards)`],
          ['Tickets', charge ? `+${charge.auto_charge_plus} a day, up to ${charge.auto_charge_max}` : null],
          ['Wrong sort', `You can't sort for a short time (penalty value ${m.penalty_time}; likely 1/100 s, i.e. ${m.penalty_time / 100} s)`],
        ],
      },
      {
        type: 'facts',
        title: 'Full Burst',
        items: [
          ['Gauge per correct sort', `${num(m.gain_fever_gauge)} of ${num(m.max_fever_gauge)}, so ${m.max_fever_gauge / m.gain_fever_gauge} correct sorts fill it`],
          ['Drain', `${num(m.decrease_fever_gauge)} at a time once active (${m.max_fever_gauge / m.decrease_fever_gauge} steps to empty; likely ${m.max_fever_gauge / m.decrease_fever_gauge} s)`],
          ['During Full Burst', 'Burst Gifts appear; they can go to either side and do not fill the gauge'],
          ['"Correct count"', `${m.correct_count} (meaning unclear)`],
        ],
      },
      {
        type: 'table',
        title: 'Difficulty',
        note: 'Each level adds new box types and pays more per correct sort. The special gift and Burst Gift can show up at every level.',
        columns: ['Level', { label: 'From score', num: true }, { label: 'Points per box', num: true }, 'Boxes'],
        rows: waves.map((w) => [
          w.level,
          startPoint(w.level) ?? 0,
          w.gain_point,
          SLOTS.map((i) => w[`box${i}_id`]).filter(Boolean).map((id) => boxName.get(id)).join(', '),
        ]),
      },
      {
        type: 'table',
        title: 'Ranks and rewards',
        note: 'Your score at the end of a run decides your rank and its reward.',
        columns: ['Rank', 'Score', 'Reward'],
        rows: RANKS.map((r) => {
          const lo = m[`rank_${r}_min_point`];
          const hi = m[`rank_${r}_max_point`];
          return [{ b: r.toUpperCase() }, hi ? `${num(lo)} – ${num(hi)}` : `${num(lo)}+`, { reward: ctx.reward(m[`rank_${r}_reward`]) }];
        }),
      },
    ],
    pages: [
      {
        id: 'boxes',
        title: 'Boxes',
        count: boxes.length,
        summary: 'Which way each box goes, and from which difficulty level it appears.',
        sections: [{
          type: 'table',
          note: 'Colours come from the mission texts. Sprites for this game are not extracted, so boxes are listed by name and resource id.',
          columns: ['Box', 'Sort to', { label: 'From level', num: true }, 'Resource'],
          rows: boxes.map((b) => [
            { b: boxName.get(b.id) },
            special.has(b.id) ? 'Box District (sorting it sets off something special)' : (GROUP[b.group_id] || [])[1] || '',
            firstLevel(b.id) || '',
            { key: b.box_resource },
          ]),
        }],
      },
      {
        id: 'missions',
        title: 'Missions',
        group: 'Rewards',
        count: missions.length,
        sections: [{
          type: 'table',
          columns: ['Mission', 'Counts', { label: 'Target', num: true }, 'Reward'],
          rows: missions.map((x) => [missionText(x), MTYPE[x.mission_type] || x.mission_type, x.mission_count, { reward: ctx.reward(x.reward_id) }]),
        }],
      },
      { id: 'help', title: 'How to play', sections: helpText(ctx) },
    ],
  };
}

module.exports = { build };
