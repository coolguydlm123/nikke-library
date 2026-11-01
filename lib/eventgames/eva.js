// EVANGELION: RedSea Scout (EventEvaMiniGame*), the Evangelion collab minigame: a vertical
// bullet-hell shooter. You drag an Evangelion around the screen; it fires on its own, only hits
// on the cockpit hurt, and dealing damage charges the A.T. Field. Each stage scores points
// (kills plus score items the enemies drop); 1 star for clearing, 2 and 3 stars at set scores.
// Clears give Mighty Tools / Mighty Equipment Boxes, spent on the part-upgrade tree; first
// clears also unlock the other Evangelions and the extra weapons (wingman drones).
//
// Text lives in Locale_EvaSystem; many columns hold the bare key (no "Locale_EvaSystem:").
// The character table's name keys don't match its models (4009 is the EVA9 model but names
// "New Unit Two α"); the item table pairs them correctly, so names come from there.
// There are no sprites for this game in icons-event.

const num = (n) => Number(n).toLocaleString('en-US');
const TAB = { Common: 'YX002_LEVEL_TAB_01', Hard: 'YX002_LEVEL_TAB_02', Ranking: 'YX002_LEVEL_TAB_03' };
const MISSION_GROUP = {
  Star: ['Stage missions', 'Rewards for the total number of stars (stage missions) earned.'],
  DailyMission: ['Daily missions', 'Reset every day; each one gives daily points.'],
  DailyPoint: ['Daily point rewards', 'Rewards for the daily points collected (counted over the event).'],
  Achievement: ['Achievements', 'One-time goals.'],
};

function build(ctx) {
  const T = (name) => ctx.table(`EventEvaMiniGame${name}Table`);
  const S = (key, fallback = '') => (key ? ctx.plain(key.startsWith('Locale_') ? key : `Locale_EvaSystem:${key}`, fallback) : fallback);

  const config = T('ActivityConfig')[0] || {};
  const items = new Map(T('Item').map((i) => [i.item_id, i]));
  const itemName = (id) => S(items.get(id)?.item_name, `Item ${id}`);
  const stages = T('Stage').sort((a, b) => a.stage_id - b.stage_id);
  const stageById = new Map(stages.map((s) => [s.stage_id, s]));
  const stageName = (id) => S(stageById.get(id)?.name_localkey, `Stage ${id}`);
  const enemies = T('Enemy');
  const enemyByIcon = new Map(enemies.filter((e) => e.iconasset.endsWith('.png')).map((e) => [e.iconasset, e]));
  const reward = (pairs) => pairs.filter(([id, n]) => id && n).map(([id, n]) => `${itemName(id)} ×${n}`);
  const unlockedBy = (item) => (item?.unlock_stage ? `First clear of ${stageName(item.unlock_stage)}` : 'From the start');

  // ---- Talent tree ("Part Upgrade"): five parts, each a chain of levels ----
  const skills = T('Skill');
  const skillById = new Map(skills.map((s) => [s.skill_id, s]));
  const effects = new Map(T('SkillEffect').map((e) => [e.id, e]));
  const partName = (s) => S(s.ui_name);
  const EFFECT = {
    Mecha_attack: ['Evangelion ATK', true],
    Hp: ['Evangelion HP', true],
    Pick_range: ['Pickup range', true],
    Wingman_attack: ['Extra weapon ATK', true],
    Ultimate_skill: ['A.T. Field level', false],
    Danmaku: ['Weapon upgraded to its next form', false],
    Display: ['', false], // goes with Danmaku (the new weapon's look); not shown
  };
  const effectText = (s) => s.effect.map((id) => effects.get(id)).filter(Boolean).map((e) => {
    const [label, valued] = EFFECT[e.effect_type] || [e.effect_type, true];
    if (!label) return null;
    if (!valued) return e.effect_type === 'Ultimate_skill' ? `${label} ${s.lv}` : label;
    return s.lv === 1 ? `${label}: base ${e.strengthen_size}` : `${label} +${e.strengthen_size}`;
  }).filter(Boolean);
  const parts = [...new Set(skills.map((s) => s.skill_group))].sort((a, b) => a - b);
  // The Portable Weapon levels that switch the Evangelion's weapon set.
  const weaponForms = skills.filter((s) => s.effect.some((id) => effects.get(id)?.effect_type === 'Danmaku')).sort((a, b) => a.lv - b.lv);
  const atField = skills.filter((s) => s.effect.some((id) => effects.get(id)?.effect_type === 'Ultimate_skill')).sort((a, b) => a.lv - b.lv);

  // ---- Evangelions and extra weapons ----
  const mechas = T('Character');
  const teams = T('WingmanTeam');

  // ---- Enemies: same model + stats under several ids (one per stage set) are merged ----
  const kind = (e) => (e.boss ? 'Boss' : e.skills.length ? 'Elite' : 'Regular');
  const loot = (s) => (s || '').split('|').map((p) => p.split(',').map(Number)).filter(([c]) => c > 0).map(([c, n]) => `${c}% ×${n}`).join(', ');
  const bookEnemies = T('Book').filter((b) => b.book_type === 'Enemy');
  const inBook = new Set(bookEnemies.map((b) => b.detailinfo_id));
  const merged = new Map();
  for (const e of enemies) {
    const k = [e.name, e.description, e.characterasset, e.hp, e.score, e.scoreloot, e.buffloot].join('|');
    if (!merged.has(k)) merged.set(k, { ...e, ids: [] });
    merged.get(k).ids.push(e.id);
  }
  // Regular enemies all carry name key 01; their flavour key (NETA_0N) matches the elite of the
  // same family (NAME_0N), so that names them.
  const enemyName = (e) => S(kind(e) === 'Regular' && /NETA_0[1-3]$/.test(e.description) ? e.description.replace('NETA', 'NAME') : e.name);
  const enemyRows = (list) => list.map((e) => [
    { text: enemyName(e), sub: e.ids.join(', ') },
    { tag: kind(e), tone: e.boss ? 'bad' : kind(e) === 'Elite' ? 'accent' : '' },
    e.hp, e.score,
    loot(e.scoreloot),
    loot(e.buffloot),
    e.previewskillnames.map((k) => S(k)).join(', '),
  ]);
  const enemyColumns = ['Enemy', 'Type', { label: 'HP', num: true }, { label: 'Score', num: true }, 'Score item drops', 'Buff drop', 'Attack patterns'];
  const all = [...merged.values()];
  const booked = all.filter((e) => e.ids.some((id) => inBook.has(id)));

  // ---- Collection ("List"): five sets of four records plus a final record each ----
  const books = T('Book');
  const collection = new Map(T('Collection').map((c) => [c.id, c]));
  const bookGroups = [...new Set(books.filter((b) => b.book_group).map((b) => b.book_group))].sort((a, b) => a - b);
  const progress = T('BookProcess');

  // ---- Missions ----
  const missions = T('Mission');
  const missionText = (x) => {
    const raw = S(x.mission_localkey, x.mission_type);
    if (x.mission_type === 'UseMechaIdPass' || x.mission_type === 'UseWingmanIdPass') return raw.replace('{0}', itemName(x.mission_target_id)).replace('{1}', num(x.mission_count));
    if (x.mission_type === 'PassStageId') return raw.replace('{0}', stageName(x.mission_target_id));
    return raw.replace('{0}', num(x.mission_count));
  };
  const missionReward = (x) => (x.reward_type === 'DailyPoint' ? `${x.reward_value} daily points` : { reward: ctx.reward(x.reward_value) });

  const help = [{
    title: 'How to play',
    pages: T('Tutorial').sort((a, b) => a.id - b.id).map((x) => ({ title: S(x.title), image: null, text: S(x.description) })),
  }];
  const starts = stages.map((s) => ctx.date(s.start_date)).filter(Boolean).sort();
  const ends = stages.map((s) => ctx.date(s.end_date)).filter(Boolean).sort();
  const firstStage = stages[0];

  return {
    summary: 'A bullet-hell shooter: steer an Evangelion through enemy barrages, shoot down Raptures and giant “Mimicry” bosses, and raise A.T. Field with the damage you deal. Stars and materials from each stage upgrade your parts.',
    overview: [
      {
        type: 'facts',
        title: 'The game',
        items: [
          ['Title', S('YX002_MAIN_INTERFACE_LOGO').replace(/\s*\n\s*/g, ': ')],
          ['Story', firstStage && ctx.scene(firstStage.enter_scenario) ? [ctx.scene(firstStage.enter_scenario), ctx.scene(firstStage.exit_scenario)].filter(Boolean) : null],
          ['Event period', starts.length ? `${starts[0]} to ${ends[ends.length - 1]}; new stages opened day by day` : ''],
          ['Controls', 'Drag anywhere on the screen to move; the Evangelion and its extra weapon shoot on their own'],
          ['Getting hit', 'Only hits on the cockpit count'],
          ['A.T. Field', 'Dealing damage charges it; when full you can use it. Each Evangelion’s A.T. Field works differently'],
          ['Score', 'Base score for kills plus a collection score for the score items enemies drop'],
          ['Stars', '1 star for clearing a stage, 2 and 3 stars for reaching its score targets'],
          ['Starting setup', `${itemName(config.defaultmecha)} with ${itemName(config.defaultwingman)}`],
        ],
      },
      { type: 'help', help },
      {
        type: 'table',
        title: 'Materials',
        columns: ['Item', 'Use'],
        rows: [...items.values()].filter((i) => i.item_type === 'Common').map((i) => [{ b: S(i.item_name) }, S(i.item_description)]),
      },
    ],
    pages: [
      {
        id: 'stages',
        title: 'Stages',
        group: 'Stages',
        count: stages.length,
        summary: 'Each stage opens on its date once the previous one is cleared. Clear rewards come every time; first-clear rewards once.',
        sections: Object.keys(TAB).map((type) => {
          const list = stages.filter((s) => s.stage_type === type);
          return list.length ? {
            type: 'table',
            title: S(TAB[type], type),
            note: type === 'Ranking' ? 'The Challenge stage gives no clear rewards; it is played for score.' : '',
            columns: ['Stage', 'Opens', 'Needs', 'Boss / elite', { label: '2★', num: true }, { label: '3★', num: true }, 'Clear reward', 'First clear'],
            rows: list.map((s) => {
              const boss = enemyByIcon.get(s.boss_icon);
              return [
                { b: S(s.name_localkey) },
                ctx.date(s.start_date) || '',
                [s.need_stage_id ? `Clear ${stageName(s.need_stage_id)}` : '', s.open_condition_event_story_stage ? 'An event story stage (see the event)' : ''].filter(Boolean).join('\n'),
                boss ? S(boss.name) : '',
                s.two_star_score, s.three_star_score,
                reward(s.fix_reward_array.map((r) => [r.fix_reward_id, r.fix_reward_num])),
                [...reward(s.first_reward_array.map((r) => [r.first_reward_id, r.first_reward_num])),
                  ...[s.enter_scenario, s.exit_scenario].map((k) => ctx.scene(k)).filter(Boolean)],
              ];
            }),
          } : null;
        }).filter(Boolean),
      },
      {
        id: 'evangelions',
        title: 'Evangelions',
        group: 'Units',
        count: mechas.length,
        summary: 'Each Evangelion has its own gun, damage and A.T. Field.',
        sections: mechas.map((c) => {
          const item = items.get(c.id);
          const [lo, hi] = c.fluctuationcoefficient.map(ctx.double);
          return {
            type: 'facts',
            title: S(item?.item_name, S(c.name)),
            items: [
              ['', S(item?.item_description)],
              ['', S(item?.item_description_play)],
              ['Unlocked', unlockedBy(item)],
              ['Attack', (item?.previewskillnames || []).map((k) => S(k)).join(', ')],
              ['Damage', `×${ctx.double(c.damagecoefficient)} damage multiplier, each hit varies ×${lo}–×${hi}`],
              ['A.T. Field gauge', `${num(c.skillpower[0])} (filled by dealing damage)`],
              [`A.T. Field values (by ${atField[0] ? partName(atField[0]) : 'A.T. Field'} part level)`, c.skillparams.map((p, i) => `Lv ${i + 1}: ${p.split('#').join(' / ')}`).concat('(meaning not documented)').join('\n')],
              ['Weapon forms', `${c.weaponsets.length}, switched by ${weaponForms.map((s) => `${partName(s)} Lv ${s.lv}`).join(', ')}; ${c.weaponsets[0].split('#').length} levels each`],
            ],
          };
        }),
      },
      {
        id: 'extra-weapons',
        title: 'Extra weapons',
        group: 'Units',
        count: teams.length,
        summary: 'A pair of wingman drones that flies with the Evangelion and fires alongside it.',
        sections: [{
          type: 'table',
          columns: ['Extra weapon', 'About', 'Drones', 'Unlocked'],
          rows: teams.map((w) => {
            const item = items.get(w.id);
            return [
              { b: S(item?.item_name, `Extra weapon ${w.id}`) },
              [S(item?.item_description), { text: '', sub: S(item?.item_description_play) }],
              w.group.split('#').length,
              unlockedBy(item),
            ];
          }),
        }],
      },
      {
        id: 'parts',
        title: 'Part upgrades',
        group: 'Units',
        count: parts.length,
        summary: 'Spend materials on five upgrade chains; some levels need a level in another chain first. Values are as stored (units not stated).',
        sections: parts.map((g) => {
          const list = skills.filter((s) => s.skill_group === g).sort((a, b) => a.lv - b.lv);
          const costs = new Map();
          for (const s of list) if (s.cost_num) costs.set(s.cost_id, (costs.get(s.cost_id) || 0) + s.cost_num);
          return {
            type: 'table',
            title: partName(list[0]),
            sub: [...costs].map(([id, n]) => `${num(n)} ${itemName(id)} in all`).join(', '),
            columns: [{ label: 'Lv', num: true }, 'Effect', 'Cost', 'Also needs'],
            rows: list.map((s) => [
              s.lv,
              [S(s.ui_des), ...effectText(s).map((e) => ({ text: '', sub: e }))],
              s.cost_num ? `${itemName(s.cost_id)} ×${s.cost_num}` : 'Free',
              s.need_skill_array.map((n) => skillById.get(n.need_skill_id)).filter((n) => n && n.skill_group !== g).map((n) => `${partName(n)} Lv ${n.lv}`).join(', '),
            ]),
          };
        }),
      },
      {
        id: 'enemies',
        title: 'Enemies',
        group: 'Battle',
        count: booked.length,
        summary: 'Raptures and the giant “Mimicry” bosses. Elites and bosses fire named bullet patterns.',
        sections: [
          {
            type: 'table',
            title: 'Bosses and elites',
            note: 'Score item drops: each entry is a chance and an amount of score items (two kinds per enemy). Buff drop: chance of dropping a buff (Extra Ammo, Armor Repair, Battlefield Recycling or Output Supplement). Several ids share the same stats.',
            columns: enemyColumns,
            rows: enemyRows(booked.sort((a, b) => b.boss - a.boss || a.ids[0] - b.ids[0])),
          },
          {
            type: 'table',
            title: 'Regular enemies',
            note: 'Variants with 0 score appear in stages where kills give no points.',
            columns: enemyColumns.slice(0, 6),
            rows: enemyRows(all.filter((e) => kind(e) === 'Regular' && e.ids[0] > 10000)).map((r) => r.slice(0, 6)),
          },
          {
            type: 'table',
            title: 'Book unlocks',
            note: 'An enemy’s page in the List opens when it is met in this stage.',
            columns: ['Enemy', 'Stage'],
            rows: bookEnemies.map((b) => [S(enemies.find((e) => e.id === b.detailinfo_id)?.name, `${b.detailinfo_id}`), stageName(b.stage_id)]),
          },
        ],
      },
      {
        id: 'collection',
        title: 'Collection items',
        group: 'Collection',
        count: books.filter((b) => b.book_type !== 'Enemy').length,
        summary: 'Records found in stages. Each set of four unlocks a fifth record that wraps up the story.',
        sections: [
          ...bookGroups.map((g) => {
            const list = books.filter((b) => b.book_group === g).sort((a, b) => a.book_id - b.book_id);
            const final = collection.get(list.find((b) => b.book_type === 'Advanced')?.detailinfo_id);
            return {
              type: 'table',
              title: final ? S(final.name) : `Set ${g}`,
              columns: ['Record', 'Found in', 'Text'],
              rows: list.map((b) => {
                const c = collection.get(b.detailinfo_id) || {};
                return [
                  { text: S(c.name), sub: S(c.ui_lock_description) },
                  b.stage_id ? stageName(b.stage_id) : 'Collect the other four',
                  S(c.ui_description),
                ];
              }),
            };
          }),
          {
            type: 'table',
            title: 'Collection rewards',
            columns: ['Book', { label: 'Entries', num: true }, 'Reward'],
            rows: progress.sort((a, b) => a.book_type.localeCompare(b.book_type) || a.num - b.num)
              .map((p) => [p.book_type === 'Enemy' ? S('YX002_BOOK_TAB_02') : S('YX002_BOOK_TAB_01'), p.num, { reward: ctx.reward(p.reward_id) }]),
          },
        ],
      },
      {
        id: 'missions',
        title: 'Missions',
        group: 'Rewards',
        count: missions.length,
        sections: Object.entries(MISSION_GROUP).map(([cat, [title, note]]) => {
          const list = missions.filter((x) => x.mission_category === cat);
          return list.length ? { type: 'table', title, note, columns: ['Mission', 'Reward'], rows: list.map((x) => [missionText(x), missionReward(x)]) } : null;
        }).filter(Boolean),
      },
    ],
  };
}

module.exports = { build };
