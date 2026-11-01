// Hacking Game (EventCE002MiniGame*): a small top-down shooter played from the CE002 event
// field. You accept a "hacking data" order, find its target on the field from a location hint,
// then fight a stage: drag to move, your unit fires automatically, and the target is shielded
// until every other enemy is gone. Three hits or running out of time ends the attempt.
// Each cleared entry unlocks an archive text. Manager 1 is the original event, manager 2 its rerun.
// Stage time limits are in 1/100 s (3000 = 30 s); HP and damage are plain numbers.

const sec = (cs) => `${+(cs / 100).toFixed(2)} s`;
const num = (v) => Number(v).toLocaleString('en-US');

const TYPE = {
  Boss: { name: 'Target', tone: 'accent', what: 'The hacking target. Killing it clears the stage; it is shielded while other enemies remain.' },
  Stop: { name: 'Fixed', tone: 'bad', what: 'A turret that stays in place and shoots.' },
  Move: { name: 'Mobile', tone: 'bad', what: 'Moves around and chases you; some shoot.' },
  Soft: { name: 'Breakable wall', tone: null, what: 'A block that can be shot apart.' },
  Hard: { name: 'Wall', tone: null, what: 'An indestructible obstacle (comes in many shapes).' },
};
const BULLET = {
  None: 'none',
  Destroyable: 'can be shot down',
  Indestroyable: 'cannot be shot down',
  Random: 'mixed',
};
const TIMING = { Concurrence: 'all guns at once', Sequence: 'guns in turn' };

function build(ctx) {
  const managers = ctx.table('EventCE002MiniGameManagerTable').sort((a, b) => a.id - b.id);
  const m = managers[0];
  const monsters = ctx.table('EventCE002MiniGameMonsterTable');
  const monById = new Map(monsters.map((x) => [x.id, x]));
  const waves = ctx.table('EventCE002MiniGameWaveDataTable');
  const stages = new Map(ctx.table('EventCE002MiniGameStageTable').map((s) => [s.id, s]));
  const data = ctx.table('EventCE002MiniGameDataTable');
  const archives = new Map(ctx.table('EventCE002MiniGameArchiveTable').map((a) => [a.id, a]));
  const shots = (hp) => Math.ceil(hp / m.player_projectile_damage);
  const hits = Math.ceil(m.player_hp / 100);

  // What a stage's wave holds: the target, enemies by type, and how many arrive as reinforcements.
  const waveInfo = (waveId) => {
    const rows = waves.filter((w) => w.wave_id === waveId);
    const count = {};
    for (const w of rows) {
      const t = monById.get(w.monster_id)?.ce002minigame_monster_type || '?';
      count[t] = (count[t] || 0) + 1;
    }
    const target = monById.get(rows.find((w) => w.target_monster)?.monster_id);
    const later = rows.filter((w) => !w.target_monster && w.spawn_monster_group_dead).length;
    return { count, target, later };
  };
  const targetCell = (t) => (t ? {
    text: `${num(t.monster_hp)} HP (${shots(t.monster_hp)} shots)`,
    sub: t.projectile_type === 'None' ? 'does not shoot' : `shoots ${TIMING[t.shot_timing] || ''}; bullets ${BULLET[t.projectile_type]}${t.angle_rotational_per_sec ? ', spins' : ''}`,
  } : '');
  const countCell = ({ count, later }) => [
    ...['Stop', 'Move', 'Soft', 'Hard'].filter((t) => count[t]).map((t) => `${count[t]} × ${TYPE[t].name}`),
    later ? { text: `${later} arrive as reinforcements`, sub: '' } : null,
  ].filter(Boolean);

  // Unlock text: the previous entry plus an event day.
  const unlock = (d) => {
    const day = d.open_condition_list.find((c) => c.open_condition_type === 'EventDay');
    const prev = d.open_condition_list.find((c) => c.open_condition_type === 'EventCE002MiniGameDataClear');
    return [prev ? 'After the previous entry' : 'From the start', day ? `event day ${day.open_condition_value}` : null].filter(Boolean).join(', ');
  };

  const dataPage = (mgr, id, titleText) => {
    const list = data.filter((d) => d.group_id === mgr.ce002minigame_data_group).sort((a, b) => a.id - b.id);
    return {
      id,
      title: titleText,
      group: 'Hacking data',
      count: list.length,
      summary: 'Orders unlock one after another; each needs the previous one cleared and a later event day.',
      sections: [{
        type: 'table',
        note: `Target HP is also given as shots of ${m.player_projectile_damage} damage.`,
        columns: ['Data', 'Where to find the target', 'Unlock', { label: 'Time', num: true }, 'Target', 'Other enemies', 'Clear reward'],
        rows: list.map((d) => {
          const s = stages.get(d.stage_id) || {};
          const w = waveInfo(s.wave_data_id);
          return [
            { b: ctx.plain(d.ce002minigame_data_name, `#${d.id}`) },
            { img: ctx.img(d.field_npc_hint_resource), caption: ctx.plain(d.field_npc_location_name), size: 'small' },
            unlock(d),
            s.time_limit ? sec(s.time_limit) : '',
            targetCell(w.target),
            countCell(w),
            { reward: ctx.reward(s.clear_reward_id) },
          ];
        }),
      }],
    };
  };

  const firstData = data.filter((d) => d.group_id === m.ce002minigame_data_group).sort((a, b) => a.id - b.id);
  const tutorial = ctx.table('EventCE002MiniGameTutorialTable').filter((t) => t.group_id === m.tutorial_group_id).sort((a, b) => a.id - b.id);
  // Enemy kinds, walls collapsed into one row per type.
  const kinds = monsters.filter((x, i) => x.ce002minigame_monster_type !== 'Hard' || monsters.findIndex((y) => y.ce002minigame_monster_type === 'Hard') === i);

  return {
    summary: 'Find each hacking target on the event field, then win a short top-down shooter stage by destroying the target once its guards are gone.',
    overview: [
      {
        type: 'facts',
        title: 'How it works',
        items: [
          ['Orders', 'Accept one hacking data order at a time; orders unlock in sequence over the event.'],
          ['Finding the target', 'The order gives a location hint; walk there on the event field and press Hacking.'],
          ['Controls', 'Touch and drag to move. Your unit fires on its own, at nearby enemies or in the direction it moves.'],
          ['Winning', 'Destroy the target. While any other enemy is alive, the target has a shield.'],
          ['Losing', `Getting hit ${hits} times (${m.player_hp} HP, ${m.player_projectile_damage} damage per enemy bullet) or running out of time.`],
          ['After clearing', 'The stage can be replayed, and its archive entry can be read from the menu.'],
          ['Intro story', ctx.intro ? { scene: ctx.intro.id, label: ctx.intro.label } : null],
        ],
      },
      {
        type: 'table',
        title: 'Enemy types',
        columns: ['Type', 'What it does'],
        rows: ['Boss', 'Stop', 'Move', 'Soft', 'Hard'].map((t) => [{ tag: TYPE[t].name, tone: TYPE[t].tone || undefined }, TYPE[t].what]),
      },
      { type: 'gallery', title: 'Target locations', items: firstData.map((d) => ({ img: ctx.img(d.field_npc_hint_resource), caption: ctx.plain(d.ce002minigame_data_name) })) },
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
        id: 'enemies',
        title: 'Enemies',
        count: kinds.length,
        sections: [{
          type: 'table',
          note: `HP is also shown as shots of ${m.player_projectile_damage} damage. Bullets that “can be shot down” have ${num(monsters.find((x) => x.projectile_hp)?.projectile_hp || 0)} HP (one shot).`,
          columns: ['Enemy', 'Type', { label: 'HP', num: true }, 'Moves', 'Shoots'],
          rows: kinds.map((x) => [
            { key: x.ce002minigame_monster_type === 'Hard' ? 'ce002_minigame_monster_hard / _01 … _22' : `${x.monster_resource} (${x.id})` },
            { tag: TYPE[x.ce002minigame_monster_type]?.name || x.ce002minigame_monster_type, tone: TYPE[x.ce002minigame_monster_type]?.tone || undefined },
            x.ce002minigame_monster_type === 'Hard' ? 'indestructible' : `${num(x.monster_hp)} (${shots(x.monster_hp)} shots)`,
            [x.move_speed ? 'moves' : 'stays put', x.angle_rotational_per_sec ? 'spins' : null].filter(Boolean).join(', '),
            x.projectile_type === 'None' ? '—' : `${TIMING[x.shot_timing] || ''}; bullets ${BULLET[x.projectile_type]}`,
          ]),
        }],
      },
      dataPage(m, 'data', 'Hacking data'),
      managers[1] && dataPage(managers[1], 'data-rerun', 'Hacking data (rerun)'),
      {
        id: 'archive',
        title: 'Archive',
        count: firstData.length,
        summary: 'Texts unlocked by clearing each hacking data entry.',
        sections: firstData.map((d) => {
          const a = archives.get(d.end_archive);
          return a ? {
            type: 'facts',
            title: ctx.plain(a.archive_name),
            items: [['', { img: ctx.img(a.archive_image_resource), size: 'small' }], ['Unlocked by', ctx.plain(d.ce002minigame_data_name)], ['', ctx.plain(a.archive_description)]],
          } : null;
        }).filter(Boolean),
      },
    ].filter(Boolean),
  };
}

module.exports = { build };
