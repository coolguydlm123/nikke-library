// Bubble March (EventBubbleMarch*): a side-scrolling lane battle. Your tower stands on the
// left, a Rapture tower (or boss) on the right. Spend Summon Bubbles, which refill over
// time and drop from defeated Raptures, to send out minions and heroes that march right;
// destroy the Rapture tower or boss of every wave to clear the stage. Outside battle,
// Research Bubbles unlock new units and Trait Bubbles buy permanent traits.
//
// Units: times, distances, scales and most rates are stored ×10,000 (a skill cool_time of
// 10000 = 1 s, a hero's 1800000 = 180 s; a trait value of 500 = 5%). Stage time_limit is in
// whole seconds. Unit and Rapture stats grow with level: stat = base × (1 + increase / 10,000).

const ms = (v) => +(v / 10000).toFixed(2); // ×10,000 field as a plain number
const sec = (v) => `${ms(v)} s`;
const pct = (v) => `${+(v / 100).toFixed(1)}%`; // per-10,000 rate
const n = (v) => Number(v).toLocaleString('en-US');

const DIFFICULTY = { Easy: 'Easy', Normal: 'Normal', Hard: 'Hard', Challenge: 'Challenge' };
const MAP = { green: 'Grassland', snow: 'Snowfield', wilderness: 'Wilderness' };
const GRADE_TONE = { SSR: 'accent', SR: 'good', R: undefined };

// Levels come in ranges (level_min..level_max; -1 = no upper end).
const atLevel = (rows, lv) => rows.find((r) => r.level_min <= lv && (r.level_max === -1 || lv <= r.level_max)) || rows[rows.length - 1];

function build(ctx) {
  const managers = ctx.table('EventBubbleMarchManagerTable');
  const m = managers.find((x) => x.minigame_type === 'Normal') || managers[0];
  const arcade = managers.find((x) => x.minigame_type === 'Arcade');

  const currencies = new Map(ctx.table('EventBubbleMarchCurrencyTable').map((c) => [c.id, c]));
  const currencyName = (id) => ctx.plain(currencies.get(id)?.name_localkey, `Currency ${id}`);
  const currencyCell = (id, amount) => (currencies.get(id)
    ? { img: ctx.img(currencies.get(id).resource_id), caption: `${currencyName(id)}${amount != null ? ` ×${n(amount)}` : ''}`, size: 'small' }
    : null);

  // ---- Units (towers, minions, heroes) ----
  const chars = ctx.table('EventBubbleMarchCharacterTable').filter((c) => c.character_group === m.character_group);
  const charById = new Map(chars.map((c) => [c.id, c]));
  const charLevels = ctx.table('EventBubbleMarchCharacterLevelTable');
  const levelsOf = (table, group) => table.filter((r) => r.level_group === group).sort((a, b) => a.level_min - b.level_min);
  const charSkills = ctx.table('EventBubbleMarchCharacterSkillTable');
  const charName = (c) => ctx.plain(c.name_localkey, c.resource_id);
  const charCell = (id, size = 'small') => {
    const c = charById.get(id);
    return c ? { img: ctx.img(c.resource_id), caption: charName(c), size } : null;
  };
  const unlocks = ctx.table('EventBubbleMarchCharacterUnlockTable');
  const unlockOf = new Map(unlocks.map((u) => [u.unlock_character_id, u]));
  const className = (id) => {
    const u = unlockOf.get(id);
    return u ? ctx.plain(u.category_localkey, '') : '';
  };

  // ---- Raptures ----
  const monsters = ctx.table('EventBubbleMarchMonsterTable');
  const monById = new Map(monsters.map((x) => [x.id, x]));
  const monLevels = ctx.table('EventBubbleMarchMonsterLevelTable');
  const monSkills = ctx.table('EventBubbleMarchMonsterSkillTable');
  const monName = (x) => ctx.plain(x.name_localkey, x.resource_id);
  const monCell = (id, size = 'small', extra = '') => {
    const x = monById.get(id);
    return x ? { img: ctx.img(x.resource_id), caption: `${monName(x)}${extra}`, size } : { key: String(id) };
  };
  const SIZE = { Tower: 'Tower', Small: 'Small', Midium: 'Medium', Big: 'Large', Huge: 'Boss' };
  const monKind = (x) => [
    SIZE[x.monster_type] || x.monster_type,
    x.monster_position === 'Air' ? 'air' : 'ground',
    x.monster_attack_type === 'Melee' ? 'close-range' : 'long-range',
  ].join(', ');

  // Advantage: a unit's advantage group deals bonus damage to the listed Rapture groups.
  const adv = ctx.table('EventBubbleMarchAdvantageDamageTable').filter((a) => a.advantage_damage_value > 0);
  const advValues = [...new Set(adv.map((a) => a.advantage_damage_value))];
  const strongAgainst = (c) => {
    const groups = new Set(adv.filter((a) => a.advantage_character_group === c.advantage_group).map((a) => a.advantage_monster_group));
    return monsters.filter((x) => groups.has(x.advantage_group));
  };
  const weakTo = (x) => {
    const groups = new Set(adv.filter((a) => a.advantage_monster_group === x.advantage_group).map((a) => a.advantage_character_group));
    return chars.filter((c) => c.character_type !== 'Tower' && groups.has(c.advantage_group));
  };

  // One line per skill, built from its type, target and timings.
  const targetText = (s) => {
    if (s.target_position === 'All') return s.target === 'Friendly' ? 'all allies' : 'every enemy on screen';
    const who = s.target === 'Friendly' ? 'allies' : s.target === 'Self' ? 'itself' : 'enemies';
    if (s.target === 'Self') return 'itself';
    if (s.target_position === 'Circle') return `${who} in a circle (size ${s.target_position_value_1})`;
    if (s.target_position === 'Quadrilateral') return `${who} in a ${s.target_position_value_1}×${s.target_position_value_2} area`;
    return s.target === 'Friendly' ? 'one ally' : 'one enemy';
  };
  const skillText = (s) => {
    const hits = s.skill_hit_count > 1 ? `, ${s.skill_hit_count} hits` : '';
    const every = s.cool_time ? ` every ${sec(s.cool_time)}` : '';
    const area = s.area_type === 'Area' || s.area_skill_type === 'Attack'
      ? `; leaves a damaging zone for ${sec(s.area_remain_time)} (ticks every ${sec(s.area_action_time)})` : '';
    switch (s.skill_type) {
      case 'Attack': return `Melee attack on ${targetText(s)}${hits}${every}${area}`;
      case 'Instant': return `Strike on ${targetText(s)}${hits}${every}`;
      case 'Projectile': return `Shoots ${targetText(s)}${hits}${every}${area}`;
      case 'ProjectileParabola': return `Lobs a shell at ${targetText(s)}${hits}${every}${area}`;
      case 'BeamShot': return `Fires a beam at ${targetText(s)}${hits}${every}${area}`;
      case 'HpBarrier': return `Barrier worth ${pct(s.skill_value)} of max HP for ${sec(s.remain_time)}${every}`;
      case 'Teleport': return `Jumps behind its target (range ${ms(s.battle_radius)})${every}`;
      case 'DecreaseCooltime': return `Attacks ${pct(s.skill_value)} faster for ${sec(s.remain_time)}${every}`;
      case 'DeathBoom': return `Explodes on death, hitting ${targetText(s)} for ${pct(s.skill_value)} of ATK`;
      case 'Heal': return `Heals ${targetText(s)}${every}`;
      case 'IncreaseAttackDamage': return `Raises ATK of ${targetText(s)} by ${pct(s.skill_value)} for ${sec(s.remain_time)}${every}`;
      case 'HeroSpecialSkillAttack': return `Special skill (needs a trait): hits every enemy on screen`;
      case 'HeroSpecialSkillHeal': return `Special skill (needs a trait): heals every ally on screen by ${pct(s.skill_value)}`;
      default: return `${s.skill_type}${every}`;
    }
  };
  const skillsOf = (table, group) => table.filter((s) => s.skill_group === group).map(skillText);

  // ---- Stages and waves ----
  const stageManagers = ctx.table('EventBubbleMarchStageManagerTable');
  const stages = ctx.table('EventBubbleMarchStageTable');
  const stageById = new Map(stages.map((s) => [s.id, s]));
  const stageName = (id) => (stageById.get(id) ? ctx.plain(stageById.get(id).name_localkey, `Stage ${id}`) : `Stage ${id}`);
  const waves = ctx.table('EventBubbleMarchStageWaveTable');
  const summonTimes = ctx.table('EventBubbleMarchStageSummonTimeTable');
  const seeds = ctx.table('EventBubbleMarchStageSummonSeedTable');
  const seedMonsters = (seedGroup) => seeds.filter((s) => s.seed_group === seedGroup)
    .flatMap((s) => (s.ebm_summon_group_data || []).map((d) => d.summon_monster)).filter(Boolean);

  // Spawn schedule of a wave: "Next" rows fire once after their delay, in order; the final
  // "Repeat" row keeps firing at its interval. Each firing sends one group of Raptures from
  // its seed list (in order, or a random pick).
  const schedule = (timeGroup) => {
    const rows = summonTimes.filter((t) => t.summon_time_group === timeGroup).sort((a, b) => a.id - b.id);
    const once = rows.filter((r) => r.repeat_type !== 'Repeat').map((r) => ms(r.time_condition));
    const rep = rows.find((r) => r.repeat_type === 'Repeat');
    const parts = [];
    if (once.length) parts.push(`${once.length} group${once.length > 1 ? 's' : ''}, ${once.join(' / ')} s apart`);
    if (rep) parts.push(`then one every ${sec(rep.time_condition)}`);
    const random = rows.some((r) => r.summon_seed_type === 'Random');
    return { text: parts.join(', ') || '—', random, monsters: [...new Set(rows.flatMap((r) => seedMonsters(r.seed_group)))] };
  };
  const monStats = (id, lv) => {
    const x = monById.get(id);
    if (!x) return null;
    const l = atLevel(levelsOf(monLevels, x.level_group), lv);
    return { atk: Math.round(x.attack * (1 + l.increase_attack / 10000)), hp: Math.round(x.hp * (1 + l.increase_hp / 10000)) };
  };
  const tower = charById.get(chars.find((c) => c.character_type === 'Tower')?.id);
  const towerStats = (lv) => {
    if (!tower) return null;
    const l = atLevel(levelsOf(charLevels, tower.level_group), lv);
    return { atk: Math.round(tower.attack * (1 + l.increase_attack / 10000)), hp: Math.round(tower.hp * (1 + l.increase_hp / 10000)) };
  };

  // Wave rows for a stage. Level additions stack from wave to wave (checked against the
  // stages' level caps: Hard 7 = base 30 + 0+1+1+1+1 = 34 = its cap).
  const waveRows = (stage) => {
    let monLv = stage.monster_level_base;
    let targetLv = stage.monster_level_base;
    let towerLv = stage.friendly_tower_level;
    return waves.filter((w) => w.wave_group === stage.wave_group).sort((a, b) => a.wave_order - b.wave_order).map((w) => {
      monLv += w.monster_level_add;
      targetLv += w.enemy_target_level_add;
      towerLv += w.friendly_tower_level_add;
      const sch = schedule(w.summon_time_group);
      const targetId = w.enemy_target_type === 'Tower' ? 1 : w.enemy_target_id;
      const ts = monStats(targetId, targetLv);
      const fs = towerStats(towerLv);
      const map = MAP[(w.wave_resource_prefab || '').replace('bm_wave_resource_', '')] || '';
      return {
        w, monLv, targetLv, towerLv,
        row: [
          w.wave_order,
          { img: ctx.img(w.wave_resource_prefab), caption: map, size: 'small' },
          [monCell(targetId, 'small'), w.enemy_target_type === 'Monster' ? { tag: 'Boss', tone: 'bad' } : '', ts ? `Lv ${targetLv} · HP ${n(ts.hp)} · ATK ${n(ts.atk)}` : ''].filter(Boolean),
          sch.monsters.map((id) => monCell(id)),
          { text: `Lv ${monLv}`, sub: sch.random ? 'random groups' : 'fixed order' },
          sch.text,
          fs ? { text: `Lv ${towerLv}`, sub: `HP ${n(fs.hp)}` } : `Lv ${towerLv}`,
          w.wave_skip_condition_stage ? { text: `after ${stageName(w.wave_skip_condition_stage)}`, sub: `+${n(w.wave_skip_give_currency)} Summon Bubbles` } : '',
        ],
      };
    });
  };
  const WAVE_COLUMNS = [{ label: 'Wave', num: true }, 'Map', 'Goal', 'Raptures that appear', 'Rapture level', 'Spawns', 'Your tower', 'Skipped'];

  const stagePage = (diff, sm) => {
    const list = stages.filter((s) => s.difficulty_group_id === sm.difficulty_group_id).sort((a, b) => a.stage_order - b.stage_order);
    if (!list.length) return null;
    const challenge = sm.difficulty_type === 'Challenge';
    const sections = list.flatMap((s) => {
      const rows = waveRows(s);
      const facts = {
        type: 'facts',
        title: `${ctx.plain(s.name_localkey, `Stage ${s.id}`)} · ${ctx.plain(s.description_localkey, '')}`,
        items: [
          ['Time limit', `${Math.floor(s.time_limit / 60)}:${String(s.time_limit % 60).padStart(2, '0')}`],
          ['Waves', challenge ? `${rows.length} listed; afterwards waves ${m.challenge_repeat_wave_order}–${m.challenge_last_wave_order} repeat, up to wave ${m.challenge_wave_max}` : rows.length],
          ['Unit and Summon Bubble level cap', s.character_max_level === s.summon_currency_max_level ? `Lv ${s.character_max_level}` : `units Lv ${s.character_max_level}, bubbles Lv ${s.summon_currency_max_level}`],
          ['Unlock', [s.open_condition_stage ? `Clear ${stageName(s.open_condition_stage)}` : '', s.open_condition_day ? `event day ${s.open_condition_day}` : ''].filter(Boolean).join(' and ') || 'From the start'],
          ['First clear', s.first_reward_currency_id ? currencyCell(s.first_reward_currency_id, s.first_reward_currency_value) : ''],
          ['Repeat clear', s.repeat_reward_currency_id ? currencyCell(s.repeat_reward_currency_id, s.repeat_reward_currency_value) : ''],
        ],
      };
      return [facts, { type: 'table', columns: WAVE_COLUMNS.filter((c, i) => challenge || i !== 7), rows: rows.map((r) => (challenge ? r.row : r.row.slice(0, 7))) }];
    });
    const skipBubbles = waves.find((w) => w.wave_group === list[0].wave_group && w.wave_skip_give_currency)?.wave_skip_give_currency || 0;
    const notes = challenge ? [{
      type: 'text',
      title: 'How Challenge works',
      text: `Waves never stop: clear as many as you can before your tower falls or time (30 min) runs out. After wave ${m.challenge_last_wave_order} the game loops back to waves ${m.challenge_repeat_wave_order}–${m.challenge_last_wave_order}`
        + ` (up to wave ${m.challenge_wave_max}), and the Raptures keep levelling (their stats stop growing past Lv 51, the last row of the level table). Clearing the last Easy, Normal or Hard stage lets you skip the matching early waves; each skipped wave gives ${n(skipBubbles)} Summon Bubbles.`,
    }] : [];
    return {
      id: `stages-${diff.toLowerCase()}`,
      title: `${DIFFICULTY[sm.difficulty_type] || sm.difficulty_type}`,
      group: 'Stages',
      count: list.length,
      summary: challenge ? 'Endless waves: how far can you get?' : 'Destroy the Rapture tower (or boss) of every wave to clear a stage. Rapture levels climb wave by wave.',
      sections: [...notes, ...sections],
    };
  };
  const normalStageManagers = stageManagers.filter((s) => s.stage_manager_group === m.stage_manager_group);

  // ---- Units page ----
  const playable = chars.filter((c) => c.character_type !== 'Tower').sort((a, b) => {
    const ua = unlockOf.get(a.id); const ub = unlockOf.get(b.id);
    return (ua?.category_group_id || 0) - (ub?.category_group_id || 0) || (ua?.slot_order || 0) - (ub?.slot_order || 0);
  });
  const regular = monsters.filter((x) => x.monster_type !== 'Tower' && x.monster_type !== 'Huge');
  const unitRow = (c) => {
    const lv = levelsOf(charLevels, c.level_group);
    const l1 = lv[0] || {};
    const counts = [...new Set(lv.map((r) => r.bubble_count))];
    const countText = counts.length > 1
      ? counts.map((k) => `${k} (Lv ${lv.find((r) => r.bubble_count === k).level_min}+)`).join(', ')
      : String(counts[0] ?? 1);
    const strong = strongAgainst(c);
    return [
      { img: ctx.img(c.resource_id), size: 'small' },
      { text: charName(c), sub: [className(c.id), c.grade].filter(Boolean).join(' · ') },
      ctx.plain(c.description_localkey, ''),
      { text: `${n(l1.summon_cost || 0)}`, sub: `level-up ${n(l1.need_cost || 0)} each` },
      sec(c.summon_cooltime),
      countText,
      { text: `ATK ${c.attack}`, sub: `HP ${c.hp}` },
      skillsOf(charSkills, c.skill_group),
      regular.every((x) => strong.includes(x)) ? 'Every regular Rapture (not bosses)' : strong.map((x) => monName(x)).join(', ') || '—',
    ];
  };

  // Stat growth: every minion shares one curve; heroes have their own.
  const growthGroups = [...new Set(playable.map((c) => c.level_group))];
  const curves = [];
  for (const g of growthGroups) {
    const rows = levelsOf(charLevels, g);
    const key = rows.map((r) => `${r.increase_attack}/${r.increase_hp}/${r.bubble_count}`).join(',');
    const who = playable.filter((c) => c.level_group === g);
    const same = curves.find((cv) => cv.key === key);
    if (same) same.who.push(...who); else curves.push({ key, rows, who });
  }
  const shownLevels = [1, 2, 3, 5, 10, 11, 15, 20, 21, 25, 30, 31, 35, 40, 45, 50];
  const growthSection = {
    type: 'table',
    title: 'Stat growth by level',
    note: 'Multiplier on base ATK / HP (×1 at Lv 1). Levels are bought in battle with Summon Bubbles and reset after each battle; the stage sets the cap. Some hero values jump at Lv 11 and 21 and drop back after: that is how the table has them.',
    columns: [{ label: 'Level', num: true }, ...curves.map((cv) => (cv.who.length > 3 ? 'Minions' : cv.who.map(charName).join(' / ')))],
    rows: shownLevels.map((L) => [L, ...curves.map((cv) => {
      const r = atLevel(cv.rows, L);
      const a = +(1 + r.increase_attack / 10000).toFixed(2);
      const h = +(1 + r.increase_hp / 10000).toFixed(2);
      return a === h ? `×${a}` : `ATK ×${a} · HP ×${h}`;
    })]),
  };

  const towerSection = tower ? {
    type: 'facts',
    title: 'Your tower',
    items: [
      ['', { img: ctx.img(tower.resource_id), size: 'large' }],
      ['Base stats', `ATK ${tower.attack}, HP ${tower.hp}; level set by the stage`],
      ['Attack', skillsOf(charSkills, tower.skill_group).join('; ')],
      ['Defeat', 'The battle is lost when it falls.'],
    ],
  } : null;

  // ---- Research ----
  const researchRows = unlocks.slice().sort((a, b) => a.category_group_id - b.category_group_id || a.slot_order - b.slot_order).map((u) => [
    ctx.plain(u.category_localkey, ''),
    charCell(u.unlock_character_id),
    u.use_unlock_condition ? currencyCell(u.unlock_currency_id, u.unlock_currency_value) : { tag: 'Owned from the start', tone: 'good' },
    [u.unlock_condition_character ? `Research ${charName(charById.get(u.unlock_condition_character) || {})}` : '', u.unlock_condition_day ? `event day ${u.unlock_condition_day}` : ''].filter(Boolean).join(' and ') || '—',
  ]);

  // ---- Traits ----
  const buffs = ctx.table('EventBubbleMarchBuffTable');
  const buffTypes = [...new Set(buffs.map((b) => b.buff_type))].map((t) => buffs.filter((b) => b.buff_type === t).sort((a, b) => a.buff_level - b.buff_level))
    .sort((a, b) => a[0].slot_order - b[0].slot_order);
  const buffValue = (b) => {
    const t = b.buff_type;
    if (/Hero.*Use/.test(t)) return b.buff_value ? 'On' : 'Off';
    if (/Level/.test(t)) return `+${b.buff_value} Lv`;
    return `${t.startsWith('Dicrease') ? '−' : '+'}${pct(b.buff_value)}`;
  };
  const traitRows = buffTypes.map((rows) => {
    const top = rows[rows.length - 1];
    const cost = rows.reduce((s, r) => s + (r.upgrade_cost_currency_value || 0), 0);
    const costIds = [...new Set(rows.map((r) => r.upgrade_cost_currency_id).filter(Boolean))];
    const per = [...new Set(rows.filter((r) => r.upgrade_cost_currency_value).map((r) => r.upgrade_cost_currency_value))];
    return [
      { img: ctx.img(top.resource_id), size: 'small' },
      { text: ctx.plain(top.name_localkey, top.buff_type), sub: ctx.plain(top.description_localkey, '') },
      top.buff_level,
      top.buff_level <= 1 ? buffValue(top) : `${buffValue(rows[1])} per level, up to ${buffValue(top)}`,
      costIds.length ? { text: `${per.join(' / ')} per level`, sub: `${n(cost)} ${currencyName(costIds[0])}s in total` } : '—',
    ];
  });

  // ---- Raptures page ----
  const rapturesRows = monsters.map((x) => {
    const lv = levelsOf(monLevels, x.level_group);
    const counts = [...new Set(lv.map((r) => r.bubble_count))];
    const drop = lv[0]?.summon_currency_reward || 0;
    return [
      { img: ctx.img(x.resource_id), size: 'small' },
      { text: monName(x), sub: monKind(x) },
      ctx.plain(x.description_localkey, ''),
      { text: `ATK ${x.attack}`, sub: `HP ${x.hp}` },
      counts.length > 1 ? counts.map((k) => `${k} (Lv ${lv.find((r) => r.bubble_count === k).level_min}+)`).join(', ') : String(counts[0] ?? 1),
      drop ? `${drop}` : '—',
      skillsOf(monSkills, x.skill_group),
      weakTo(x).length ? weakTo(x).map((c) => ({ img: ctx.img(c.resource_id), caption: charName(c), size: 'small' })) : '—',
    ];
  });

  // ---- Missions ----
  const fill = (s, args) => s.replace(/\{(\d)\}/g, (_, i) => (args[i] != null ? args[i] : ''));
  const missionName = (x) => {
    const raw = ctx.plain(x.name_localkey, x.condition_type);
    const v = n(x.condition_value);
    switch (x.condition_type) {
      case 'UseCurrency': return fill(raw, [currencyName(x.condition_id), v]);
      case 'HeroSummon': case 'MinionSummon': case 'KillEnemy':
        return x.condition_id ? fill(raw, [charById.get(x.condition_id) ? charName(charById.get(x.condition_id)) : monById.get(x.condition_id) ? monName(monById.get(x.condition_id)) : x.condition_id, v]) : fill(raw, [v]);
      case 'StageClear': return fill(raw, [stageName(x.condition_id)]);
      default: return fill(raw, [v]);
    }
  };
  const missions = ctx.table('EventBubbleMarchMissionTable');
  const missionPage = (group, id, title, summary) => {
    const list = missions.filter((x) => x.mission_group === group);
    if (!list.length) return null;
    const daily = list.filter((x) => x.mission_type === 'Daily').sort((a, b) => a.order - b.order);
    const points = list.filter((x) => x.mission_type === 'DailyPoint').sort((a, b) => a.order - b.order);
    const ach = list.filter((x) => x.mission_type === 'Achievement').sort((a, b) => a.order - b.order);
    return {
      id, title, group: 'Missions', count: list.length, summary,
      sections: [
        daily.length && { type: 'table', title: 'Daily missions', note: 'Reset every day. Each gives daily points.', columns: ['Mission', { label: 'Points', num: true }], rows: daily.map((x) => [missionName(x), x.point_value]) },
        points.length && { type: 'table', title: 'Daily point rewards', columns: [{ label: 'Points', num: true }, 'Reward'], rows: points.map((x) => [x.condition_value, { reward: ctx.reward(x.reward_id) }]) },
        ach.length && { type: 'table', title: 'Challenges', note: 'One-time missions for the whole event.', columns: ['Mission', 'Reward'], rows: ach.map((x) => [missionName(x), { reward: ctx.reward(x.reward_id) }]) },
      ].filter(Boolean),
    };
  };

  const curLevels = ctx.table('EventBubbleMarchCurrencyLevelTable').filter((r) => r.level_group === m.summon_currency_level_group).sort((a, b) => a.level_min - b.level_min);
  const curUp = curLevels.find((r) => r.increase_currency_count);
  const stage1 = stages.find((s) => s.difficulty_group_id === normalStageManagers[0]?.difficulty_group_id);
  const help = ctx.help(m.helptip_hub_group);

  return {
    summary: 'A lane battle: summon bubble minions and fairy-tale heroes with Summon Bubbles, march them at the Raptures and destroy the Rapture tower or boss of each wave while keeping your own tower standing.',
    overview: [
      {
        type: 'facts',
        title: 'A battle',
        items: [
          ['Intro story', ctx.intro ? { scene: ctx.intro.id, label: ctx.intro.label } : null],
          ['Win', 'Destroy the Rapture tower (or defeat the boss) in every wave of the stage before time runs out.'],
          ['Lose', 'Your tower is destroyed.'],
          ['Summoning', `Tap a unit to summon it for Summon Bubbles; it appears in front of your tower and marches on its own. Minions come out several at a time and can be summoned again after a cooldown; each hero can be on the field only once.`],
          ['Summon Bubbles', `Refill on their own during battle (charge value ${stage1?.summon_currency_get_second ?? '?'}; the in-game text gives no unit) and drop from defeated Raptures (10 to 20 each). Start cap ${n(m.summon_currency_count)}; each Summon Bubble level costs ${n(curUp?.need_cost || 0)} and raises the cap by ${n(curUp?.increase_currency_count || 0)}.`],
          ['Levelling', 'Summon Bubbles also level up each unit type for the rest of the battle: more ATK and HP, and more minions per summon (4, then 5 from Lv 11, 6 from Lv 21). Levels reset after the battle; the stage sets the level cap.'],
          ['Type advantage', advValues.length ? `Units deal ${advValues.map((v) => `+${pct(v)}`).join(' / ')} damage to the Rapture types they counter (see the unit and Rapture pages).` : null],
          ['Waves', 'Heroes and minions that survive carry over to the next wave. Rapture levels go up each wave.'],
          ['Rerun', arcade ? 'The rerun (Arcade) has the same stages with no day locks and its own set of challenge missions.' : null],
        ],
      },
      {
        type: 'table',
        title: 'Currencies',
        columns: ['', 'Currency', 'Use'],
        rows: [...currencies.values()].map((c) => [{ img: ctx.img(c.resource_id), size: 'small' }, ctx.plain(c.name_localkey, ''), ctx.plain(c.description_localkey, '')]),
      },
      { type: 'gallery', title: 'Heroes and minions', items: playable.map((c) => ({ img: ctx.img(c.resource_id), caption: charName(c) })) },
      help.length ? { type: 'help', help } : null,
    ].filter(Boolean),
    pages: [
      {
        id: 'units',
        title: 'Heroes and minions',
        group: 'Units',
        count: playable.length,
        summary: 'Five minion classes with three minions each, plus three heroes. The first of each class is owned from the start; the rest are researched.',
        sections: [
          {
            type: 'table',
            title: 'Units',
            note: 'Cost is in Summon Bubbles at Lv 1. Stats are Lv 1 base values. Attack timings are at normal speed.',
            columns: ['', 'Unit', 'Description', { label: 'Summon cost', num: true }, 'Cooldown', 'Per summon', 'Base stats', 'Skills', 'Bonus damage vs'],
            rows: playable.map(unitRow),
          },
          growthSection,
          towerSection,
        ].filter(Boolean),
      },
      {
        id: 'raptures',
        title: 'Raptures',
        group: 'Units',
        count: monsters.length,
        summary: 'Rapture stats grow with level the same way your units do. Bosses and towers are wave goals.',
        sections: [{
          type: 'table',
          note: '“Per spawn” follows the same field that sets how many minions a summon gives, so it is most likely how many of this Rapture come out together at that level. “Drops” is Summon Bubbles gained per kill.',
          columns: ['', 'Rapture', 'Description', 'Base stats', 'Per spawn', { label: 'Drops', num: true }, 'Attack', 'Countered by'],
          rows: rapturesRows,
        }],
      },
      {
        id: 'research',
        title: 'Research',
        group: 'Upgrades',
        count: researchRows.length,
        summary: 'Unlock new heroes and minions with Research Bubbles (from first clears). Research can be reset to get the bubbles back.',
        sections: [{ type: 'table', columns: ['Class', 'Unit', 'Cost', 'Needs'], rows: researchRows }],
      },
      {
        id: 'traits',
        title: 'Traits',
        group: 'Upgrades',
        count: traitRows.length,
        summary: 'Permanent bonuses bought with Trait Bubbles. Traits can be reset for a refund.',
        sections: [{ type: 'table', columns: ['', 'Trait', { label: 'Max level', num: true }, 'Effect', 'Cost'], rows: traitRows }],
      },
      ...normalStageManagers.map((sm) => stagePage(sm.difficulty_type, sm)),
      missionPage(m.mission_group, 'missions', 'Missions', 'Daily missions and one-time challenges.'),
      arcade && missionPage(arcade.mission_group, 'missions-rerun', 'Missions (rerun)', 'Challenges of the rerun (Arcade) version.'),
    ].filter(Boolean),
  };
}

module.exports = { build };
