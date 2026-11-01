// For The King (EventTowerDefense*), the Last Kingdom event's tower defense. Raptures walk a
// path toward the kingdom in waves; you spend gold on towers along the path, upgrade and evolve
// them, and deploy Nikkes as hero towers whose Burst Skill you drag onto the map. A Rapture that
// gets through costs Defense Points; lose them all and the stage fails. Broken Cores from first
// clears buy permanent upgrades. Manager 1001 is the main event, 1002 the April Fools stage
// (Mecha Shifty). Times are in 1/100 s; rates (penetration, slow, chance) are per 10,000.

const sec = (cs) => `${+(cs / 100).toFixed(2)} s`;
const pct = (v) => `${+(v / 100).toFixed(2)}%`;
const num = (n) => Number(n).toLocaleString('en-US');

const MOVE = { Ground: 'Ground', Fly: 'Air' };
const TARGETS = { All: 'Ground and air', Ground: 'Ground only' };
const PRIORITY = { Standard: 'Front-most enemy', BossFirst: 'Bosses first', FlyFirst: 'Air units first' };
const ATTACK = {
  Projectile: 'Bullet',
  Instant: 'Instant hit',
  CannonProjectile: 'Shell (splash)',
  MissileProjectile: 'Missiles (splash)',
  SelfRadius: 'Pulse around the tower',
};
const SKILL_KIND = { Active: { tag: 'Active', tone: 'accent' }, Passive: { tag: 'Passive' }, BurstSkill: { tag: 'Burst', tone: 'good' } };
const MISSION = {
  DailyPointReward: 'Collect daily mission points',
  GainGoldCount: 'Earn gold',
  BuildTower: 'Build towers',
  MonsterKill: 'Defeat Raptures',
  BurstSkillUseCount: 'Use Burst Skills',
  BuildHeroTower: 'Deploy Nikkes',
  StartWave: 'Survive waves',
  WaveQuickStartCount: 'Quick-start waves',
  ReinforceTowerCount: 'Upgrade towers',
  ClearStage: 'Clear stages',
  HaveGold: 'Hold gold at once',
  SkillLevelMax: 'Max out a Nikke’s skills',
  PlayTimeCount: 'Play time',
};

function build(ctx) {
  const managers = ctx.table('EventTowerDefenseManagerTable');
  const main = managers.find((m) => m.event_type === 'Minigame') || managers[0];
  const fools = managers.find((m) => m !== main);
  const name = (key, fb = '') => ctx.plain(key, fb).replace(/\r/g, '').trim();
  const bullets = (key) => name(key).replace(/■\s*/g, '').replace(/\n\s+/g, ' ');

  // ---- buffs / debuffs in plain words ----
  const buffs = new Map(ctx.table('EventTowerDefenseBuffTable').map((b) => [b.id, b]));
  const debuffs = new Map(ctx.table('EventTowerDefenseDebuffTable').map((d) => [d.id, d]));
  const buffText = (id) => {
    const b = buffs.get(id);
    if (!b) return `buff ${id}`;
    const v = b.buff_effect_value;
    return {
      RpmUp: `attack speed +${pct(v)}`,
      TargetCountUp: `+${v} targets`,
      EffectRangeUp: `splash area +${v}`,
      RangeUp: `range +${v}`,
      PenetrateUp: `DEF penetration +${pct(v)}`,
      Synchronize: 'shares its boosts with linked towers',
      StealthDetection: 'sees through optical camouflage',
      IncreaseNormalAttackDebuffChance: `normal-attack effect chance +${pct(v)}`,
      Stealth: 'optical camouflage (cannot be targeted)',
      DebuffReduction: `debuff effects reduced by ${pct(v)}`,
      DebuffPowerUp: `debuffs +${pct(v)}`,
    }[b.buff_effect_type] || b.buff_effect_type;
  };
  const debuffText = (id) => {
    const d = debuffs.get(id);
    if (!d) return `debuff ${id}`;
    const v = d.debuff_effect_value;
    return {
      Slow: `slows by ${pct(v)}`,
      DotDamage: `damage over time (${v} per tick)`,
      ReceivedDamageUp: `takes ${pct(v)} more damage`,
      Sturn: 'frozen in place (stun)',
      NullStealth: 'camouflage removed',
      InstantDamage: `extra hit (power ${num(v)})`,
    }[d.debuff_effect_type] || d.debuff_effect_type;
  };

  // ---- towers ----
  const towers = ctx.table('EventTowerDefenseTowerTable');
  const towerById = new Map(towers.map((t) => [t.id, t]));
  const towerName = (t) => name(t.tower_name, String(t.id));
  const towerImg = (t) => ctx.img(String(t.tower_resource).split('/').pop()) || ctx.img(t.tower_icon);
  const towerCell = (t, size = 'small') => ({ img: towerImg(t), caption: towerName(t), size });

  const skills = ctx.table('EventTowerDefenseTowerSkillTable');
  const skillById = new Map(skills.map((s) => [s.id, s]));
  const skillGroup = (g) => skills.filter((s) => s.skill_group_id === g).sort((a, b) => a.skill_level - b.skill_level);
  const skillImg = (s) => ctx.img(s.skill_icon_background) || ctx.img(s.skill_icon);
  const trigger = (s) => ({
    AttackCountAuto: `After every ${s.skill_use_attack_count} attacks, the next one`,
    CoolTimeAuto: `Every ${sec(s.skill_cool_time)}`,
    BurstUseAuto: 'When the Burst Skill is used',
    Manual: `Drag onto the map; cooldown ${sec(s.skill_cool_time)}`,
    None: 'Always on',
  }[s.skill_use_type] || s.skill_use_type);
  // The skill's buffs / debuffs, which say more than the shared descriptions do.
  const skillEffects = (s) => (s.skill_effect_list || []).filter((e) => e.skill_effect_type !== 'None').map((e) => {
    const time = e.skill_effect_hold_time ? ` for ${sec(e.skill_effect_hold_time)}` : '';
    switch (e.skill_effect_type) {
      case 'SetBuff':
      case 'ImmediatelySelfSetBuff':
        return `${e.skill_effect_target === 'Ally' ? `Nearby towers${e.skill_effect_target_count ? ` (${e.skill_effect_target_count})` : ''}` : 'Self'}: ${buffText(e.skill_effect_value)}${time}`;
      case 'SetDebuff':
        return `Enemies hit${e.skill_effect_target_count ? ` (up to ${e.skill_effect_target_count})` : ''}: ${debuffText(e.skill_effect_value)}${time}`;
      case 'Damage':
      case 'PenetrateDamage':
        return `${e.skill_effect_type === 'PenetrateDamage' ? 'Armor-piercing damage' : 'Damage'}, power ${num(e.skill_effect_value)}${e.skill_effect_apply_chance ? ` (${pct(e.skill_effect_apply_chance)} chance)` : ''}`;
      case 'RpmIncrease': return `Attack speed +${pct(e.skill_effect_value)}`;
      case 'RangeIncrease': return `Range +${e.skill_effect_value}`;
      case 'AtkIncrease': return `ATK +${e.skill_effect_value}`;
      case 'DebuffPowerUp': return `Debuffs +${pct(e.skill_effect_value)}`;
      case 'BurstCoolTimeDecrease': return `Burst cooldown −${sec(e.skill_effect_value)}`;
      default: return e.skill_effect_type;
    }
  });
  const skillRows = (list) => list.map((s) => [
    { img: skillImg(s), caption: name(s.skill_name, String(s.id)), size: 'small' },
    SKILL_KIND[s.skill_system_type] || s.skill_system_type,
    // Burst Skills share a placeholder long description; their short one is right.
    (s.skill_system_type === 'BurstSkill' && name(s.skill_description_short)) || name(s.skill_description) || name(s.skill_description_short),
    trigger(s),
    skillEffects(s),
    s.skill_cost ? s.skill_cost : '—',
  ]);
  const skillColumns = ['Skill', 'Type', 'Description', 'Trigger', 'Effects', { label: 'Gold', num: true }];

  const towerStats = (t) => [
    towerCell(t),
    t.tower_level === 4 ? 'Evolved' : `Lv. ${t.tower_level}`,
    t.tower_cost || '—',
    t.tower_stat_atk,
    t.tower_stat_def_penetration ? pct(t.tower_stat_def_penetration) : '—',
    { text: name(t.tower_rpm_text, String(t.tower_stat_rpm)), sub: `${t.tower_stat_rpm} RPM` },
    t.attack_range,
    [ATTACK[t.attack_type] || t.attack_type, t.attack_target_count > 1 ? `${t.attack_target_count} targets` : '', t.attack_effect_range ? `splash ${t.attack_effect_range}` : ''].filter(Boolean).join(', '),
    TARGETS[t.attack_movement_type] || t.attack_movement_type,
    [
      t.apply_debuff ? `${t.apply_chance >= 10000 ? '' : `${pct(t.apply_chance)} chance: `}${debuffText(t.apply_debuff)}${t.apply_debuff_hold_time ? ` for ${sec(t.apply_debuff_hold_time)}` : ''}` : '',
      t.tower_default_buff ? buffText(t.tower_default_buff) : '',
      PRIORITY[t.attack_priority_01] && t.attack_priority_01 !== 'Standard' ? PRIORITY[t.attack_priority_01] : '',
    ].filter(Boolean).join('; '),
  ];
  const towerColumns = ['Tower', 'Level', { label: 'Gold', num: true }, { label: 'ATK', num: true }, { label: 'DEF pen.', num: true },
    'Attack speed', { label: 'Range', num: true }, 'Attack', 'Hits', 'Special'];

  // The upgrade chain of a tower line: Lv1 -> Lv2 -> Lv3 -> evolution(s).
  const line = (group) => towers.filter((t) => t.tower_group_id === group).sort((a, b) => a.tower_level - b.tower_level || a.id - b.id);
  const stageOrderName = (mgr) => {
    const m = new Map(ctx.table('EventTowerDefenseStageTable').filter((s) => s.manager_id === mgr).map((s) => [s.stage_order, s]));
    return (order) => (m.get(order) ? name(m.get(order).stage_short_name_localkey, `stage ${order}`) : `stage ${order}`);
  };

  const towerLineSections = (mgr, type) => {
    const sName = stageOrderName(mgr);
    const groups = [...new Set(towers.filter((t) => t.manager_id === mgr && t.tower_type === type && !t.is_for_cinematic).map((t) => t.tower_group_id))];
    return groups.map((g) => {
      const list = line(g);
      const first = list[0];
      const gated = list.filter((t) => t.tower_open_condition_stage_order);
      const unlocks = gated.length === list.length && new Set(gated.map((t) => t.tower_open_condition_stage_order)).size === 1
        ? [`available from ${sName(gated[0].tower_open_condition_stage_order)}${gated[0].tower_open_condition_stage_clear ? ' (after clearing it)' : ''}`]
        : gated.map((t) => `${t.tower_level === 4 ? towerName(t) : `Lv. ${t.tower_level}`} from ${sName(t.tower_open_condition_stage_order)}${t.tower_open_condition_stage_clear ? ' (after clearing it)' : ''}`);
      const burst = list.filter((t) => t.tower_burst_skill).map((t) => skillById.get(t.tower_burst_skill)).filter(Boolean);
      const skillGroups = [...new Set(list.flatMap((t) => (t.tower_skill_list || []).map((s) => s.tower_skill_group)).filter(Boolean))];
      const out = [{
        type: 'table',
        title: towerName(first).replace(/\s+I$/, ''),
        sub: name(first.tower_description).replace(/\n+/g, ' '),
        note: unlocks.length ? `Unlocks: ${unlocks.join('; ')}.` : undefined,
        columns: towerColumns,
        rows: list.map(towerStats),
      }];
      if (burst.length) {
        out.push({ type: 'table', title: `${towerName(first).replace(/\s+I$/, '')}: Burst Skill`, note: 'The Burst Skill levels up with the tower. Power is the game’s damage value (meaning of the scale unclear).', columns: skillColumns.slice(0, 5), rows: skillRows(burst).map((r) => r.slice(0, 5)) });
      }
      if (skillGroups.length) {
        out.push({
          type: 'table',
          title: `${towerName(first).replace(/\s+I$/, '')}: evolved tower skills`,
          note: 'Learned with gold on an evolved tower, then upgraded up to Lv. 3.',
          columns: skillColumns,
          rows: skillRows(skillGroups.flatMap(skillGroup)),
        });
      }
      return out;
    }).flat();
  };

  // ---- monsters ----
  const monsters = ctx.table('EventTowerDefenseMonsterTable');
  const monsterById = new Map(monsters.map((m) => [m.id, m]));
  const monsterSkills = new Map(ctx.table('EventTowerDefenseMonsterSkillTable').map((s) => [s.id, s]));
  const monsterName = (m) => name(m.monster_name, String(m.id));
  const monsterImg = (m) => ctx.img(m.monster_icon) || ctx.img(String(m.monster_resource).split('/').pop());
  const monsterSkillText = (id) => {
    const s = monsterSkills.get(id);
    if (!s) return null;
    const v = (s.monster_skill_type_value_list || []).map((x) => x.monster_skill_type_value);
    const when = { CoolTime: `Every ${sec(s.monster_skill_active_value)}`, Spawn: 'On appearing', HPCheck: `At ${pct(s.monster_skill_active_value)} HP` }[s.monster_skill_active_type] || s.monster_skill_active_type;
    let what;
    switch (s.monster_skill_type) {
      case 'SetBuff': what = `${buffText(v[0])} for ${sec(v[1])}`; break;
      case 'DefArea': what = `DEF +${v[1]} to Raptures within ${v[0]}`; break;
      case 'Jump': what = `jumps ahead (distance ${v[0]})`; break;
      case 'SummonMonster': {
        const m = monsterById.get(v[1]);
        what = `summons ${v[2]} × ${m ? monsterName(m) : v[1]}`;
        break;
      }
      case 'HPRecover': what = `recovers HP (${pct(v[0])}, up to ${v[1]} times)`; break;
      default: what = s.monster_skill_type;
    }
    return `${when}: ${what}`;
  };

  const monsterTypes = (mgr) => {
    const types = new Map();
    for (const m of monsters.filter((x) => x.manager_id === mgr)) {
      // Grouped by look and name: a stray id (1001100101) is just another Exceed Hard Hat tier.
      const k = `${m.monster_name}|${m.monster_icon}`;
      if (!types.has(k)) types.set(k, []);
      types.get(k).push(m);
    }
    return types;
  };
  const range = (list, f) => {
    const vals = list.map(f);
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    return lo === hi ? num(lo) : `${num(lo)}–${num(hi)}`;
  };
  const monsterRows = (mgr) => [...monsterTypes(mgr).values()].map((list) => {
    const m = list[0];
    const skillIds = [...new Set(list.flatMap((x) => (x.monster_skill_list || []).map((s) => s.monster_skill)).filter(Boolean))];
    // Bulwark's DEF aura grows with the tier: one line with the range.
    const aura = skillIds.map((id) => monsterSkills.get(id)).filter((sk) => sk?.monster_skill_type === 'DefArea');
    const auraVals = aura.map((sk) => sk.monster_skill_type_value_list[1].monster_skill_type_value);
    const uniqueSkills = [...new Set(skillIds.filter((id) => !aura.some((sk) => sk.id === id)).map(monsterSkillText).filter(Boolean))];
    if (aura.length) uniqueSkills.unshift(`On appearing: DEF +${range(auraVals, (v) => v)} (by tier) to Raptures within ${aura[0].monster_skill_type_value_list[0].monster_skill_type_value}`);
    const next = list.find((x) => x.is_use_next_phase && x.next_phase_monster_id);
    if (next) {
      const n = monsterById.get(next.next_phase_monster_id);
      uniqueSkills.push(next.next_phase_monster_spawn_count > 1
        ? `On defeat: splits into ${next.next_phase_monster_spawn_count} × ${n ? monsterName(n) : next.next_phase_monster_id}`
        : `On defeat: transforms into ${n ? monsterName(n) : next.next_phase_monster_id}`);
    }
    return [
      { img: monsterImg(m), caption: monsterName(m), size: 'small' },
      m.monster_grade === 'Boss' ? { tag: 'Boss', tone: 'bad' } : '',
      MOVE[m.move_type] || m.move_type,
      bullets(m.monster_description),
      range(list, (x) => x.monster_hp),
      range(list, (x) => x.monster_def),
      range(list, (x) => x.monster_speed),
      m.defense_point_decrease >= 999 ? 'All' : m.defense_point_decrease,
      range(list, (x) => x.gold_reward),
      uniqueSkills,
    ];
  });
  const monsterColumns = ['Rapture', '', 'Moves', 'Notes', { label: 'HP', num: true }, { label: 'DEF', num: true }, { label: 'Speed', num: true },
    { label: 'Defense lost', num: true }, { label: 'Gold', num: true }, 'Abilities'];

  // ---- stages and waves ----
  const stages = ctx.table('EventTowerDefenseStageTable').sort((a, b) => a.manager_id - b.manager_id || a.stage_order - b.stage_order);
  const stageById = new Map(stages.map((s) => [s.id, s]));
  const waves = ctx.table('EventTowerDefenseWaveDataTable');
  const paths = new Map();
  for (const p of ctx.table('EventTowerDefenseWavePathTable')) {
    if (!paths.has(p.wave_path_group_id)) paths.set(p.wave_path_group_id, []);
    paths.get(p.wave_path_group_id).push(p);
  }
  const randoms = new Map();
  for (const r of ctx.table('EventTowerDefenseWavePathRandomTable')) {
    if (!randoms.has(r.random_group_id)) randoms.set(r.random_group_id, []);
    randoms.get(r.random_group_id).push(r);
  }
  // A wave path as "monster × count" totals (in order of first appearance).
  const composition = (pathGroup) => {
    const tally = new Map();
    for (const p of paths.get(pathGroup) || []) tally.set(p.spawn_monster_id, (tally.get(p.spawn_monster_id) || 0) + p.spawn_count);
    return [...tally];
  };
  const compCells = (comp) => comp.map(([id, n]) => {
    const m = monsterById.get(id);
    return m ? { img: monsterImg(m), caption: `${monsterName(m)} ×${n} (HP ${num(m.monster_hp)})`, size: 'small' } : `${id} ×${n}`;
  });
  const compKey = (comp) => comp.map(([id, n]) => `${id}x${n}`).join(',');
  const lastSpawn = (pathGroup) => Math.max(0, ...(paths.get(pathGroup) || []).map((p) => p.spawn_start_time + p.spawn_delay * (p.spawn_count - 1)));

  const stageName = (s) => name(s.stage_name_localkey, String(s.id));
  const stageTitle = (s) => {
    const short = name(s.stage_short_name_localkey);
    const full = stageName(s);
    return short && short !== full && !/STAGE|CHALLENGE/.test(short) ? `${short} ${full}` : full;
  };
  const stageLink = (id) => {
    const s = stageById.get(id);
    return s ? { page: `stage-${s.id}`, label: stageTitle(s) } : String(id);
  };
  const dialogs = ctx.table('EventTowerDefenseScenarioGroupTable');
  const lines = ctx.table('EventTowerDefenseScenarioListTable');
  const speakers = new Map(ctx.table('EventTowerDefenseSpeakerTable').map((s) => [s.id, s]));
  const speakerCell = (id) => {
    const sp = speakers.get(id);
    // A few portrait names are spelt differently from the files (…_02_tower vs …_tower_02).
    const img = sp && (ctx.img(sp.speaker_portrait) || ctx.img(String(sp.speaker_portrait).replace(/_(\d+)_tower$/, '_tower_$1')));
    return sp ? { img, caption: name(sp.speaker_name, id), size: 'small' } : id;
  };

  const stagePage = (s) => {
    const list = waves.filter((w) => w.wave_data_group_id === s.wave_data_group_id).sort((a, b) => a.wave_order - b.wave_order);
    const challenge = s.stage_type === 'Challenge';
    const mgr = managers.find((m) => m.id === s.manager_id) || main;
    let rows;
    if (!challenge) {
      rows = list.map((w) => {
        const comp = composition(w.wave_path_group_id);
        const boss = comp.some(([id]) => monsterById.get(id)?.monster_grade === 'Boss');
        return [
          boss ? { text: String(w.wave_order), sub: 'boss' } : w.wave_order,
          w.wave_start_waiting_time ? sec(w.wave_start_waiting_time) : '—',
          w.wave_fast_start_reward_gold || '—',
          sec(lastSpawn(w.wave_path_group_id)),
          comp.reduce((n, [, c]) => n + c, 0),
          compCells(comp),
        ];
      });
    } else {
      // Each challenge wave draws one of several layouts; layouts with the same Raptures are merged.
      rows = list.map((w) => {
        const opts = randoms.get(w.wave_path_group_id) || [];
        const total = opts.reduce((n, o) => n + o.random_chance, 0) || 1;
        const kinds = new Map();
        for (const o of opts) {
          const comp = composition(o.wave_path_group_id);
          const k = compKey(comp);
          if (!kinds.has(k)) kinds.set(k, { comp, chance: 0 });
          kinds.get(k).chance += o.random_chance;
        }
        const variants = [...kinds.values()];
        return [
          w.wave_order,
          w.wave_start_waiting_time ? sec(w.wave_start_waiting_time) : '—',
          w.wave_fast_start_reward_gold || '—',
          w.challenge_score,
          variants.length === 1
            ? compCells(variants[0].comp)
            : variants.flatMap((v) => [{ b: `${pct(10000 * v.chance / total)}:` }, ...compCells(v.comp)]),
        ];
      });
    }
    const myDialogs = dialogs.filter((d) => d.stage_id === s.id);
    const when = (d) => ({
      StageStart: 'Stage start',
      WaveStart: `Wave ${waves.find((w) => w.id === d.output_condition_value)?.wave_order ?? '?'} starts`,
      AfterCinematic: 'After a cutscene',
      Victory: 'Victory',
    }[d.output_condition_type] || d.output_condition_type);
    return {
      id: `stage-${s.id}`,
      title: stageTitle(s),
      group: s.manager_id === main.id ? (challenge ? 'Challenge' : 'Stages') : 'April Fools',
      count: list.length,
      summary: name(s.stage_description_localkey).replace(/\n+/g, ' '),
      sections: [
        {
          type: 'facts',
          items: [
            ['', ctx.img(s.stage_info_image) ? { img: ctx.img(s.stage_info_image), size: 'large' } : null],
            ['Stage type', { Scenario: 'Story stage', Normal: 'Stage', Challenge: 'Challenge (endless score attack)' }[s.stage_type] || s.stage_type],
            ['Unlock', [
              s.open_condition_td_stage ? { ...stageLink(s.open_condition_td_stage), label: `Clear ${stageLink(s.open_condition_td_stage).label}` } : null,
              s.open_condition_event_story_stage_locale ? name(s.open_condition_event_story_stage_locale) : null,
            ].filter(Boolean)],
            ['Opens', /^20[0-1]\d/.test(ctx.date(s.open_condition_time) || '2000') ? null : ctx.date(s.open_condition_time)],
            ['Defense Points', `${s.defense_point} (a Rapture that gets through takes some away; at 0 the stage is lost)`],
            ['Starting gold', s.start_gold],
            ['Nikke slots', `${s.max_hero_slot} (${s.hero_slot_open_count} open at the start; more cost ${mgr.hero_slot_open_cost} gold, +${mgr.hero_slot_open_cost_increase} for each further slot)`],
            ['Clear condition', { BossKill: 'Defeat the boss of the last wave', AllEnemyKill: 'Defeat every wave (99 in all); the score counts however far you get' }[s.stage_clear_condition_type] || s.stage_clear_condition_type],
            ['First clear', s.stage_first_clear_reward ? { reward: ctx.reward(s.stage_first_clear_reward) } : null],
            ['Broken Cores', s.stage_first_clear_upgrade_currency_reward ? `${s.stage_first_clear_upgrade_currency_reward} on first clear` : null],
            ['Story before', ctx.scene(s.enter_scenario)],
            ['Story after', ctx.scene(s.exit_scenario)],
          ],
        },
        challenge ? {
          type: 'table',
          title: 'Waves',
          note: 'Wait: time before the wave starts by itself; starting it early with Quick Start gives the bonus gold (and challenge score). Each wave picks one of several spawn layouts at random; when the layouts differ in Raptures, the chance of each is shown. HP grows with the wave number.',
          columns: [{ label: 'Wave', num: true }, { label: 'Wait', num: true }, { label: 'Early gold', num: true }, { label: 'Wave score', num: true }, 'Raptures'],
          rows,
        } : {
          type: 'table',
          title: 'Waves',
          note: 'Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.',
          columns: [{ label: 'Wave', num: true }, { label: 'Wait', num: true }, { label: 'Early gold', num: true }, { label: 'Spawning', num: true }, { label: 'Raptures', num: true }, 'Enemies'],
          rows,
        },
        myDialogs.length ? {
          type: 'table',
          title: 'In-battle dialogue',
          columns: ['When', 'Speaker', 'Line'],
          rows: myDialogs.flatMap((d) => lines.filter((l) => l.dialog_list_group_id === d.dialog_list_group_id)
            .map((l, i) => [i ? '' : when(d), speakerCell(l.speaker), name(l.scenario_localkey)])),
        } : null,
      ].filter(Boolean),
    };
  };

  // ---- upgrades ----
  const upgradeGroups = ctx.table('EventTowerDefenseUpgradeGroupTable').filter((g) => g.manager_id === main.id)
    .sort((a, b) => a.upgrade_group_order - b.upgrade_group_order);
  const upgradeList = ctx.table('EventTowerDefenseUpgradeListTable');
  const UPGRADE = {
    RpmIncrease: (v) => `attack speed +${pct(v)}`,
    RangeIncrease: (v) => `range +${v}`,
    AtkIncrease: (v) => `ATK +${pct(v)}`,
    DiscountSkillCost: (v) => `skill cost −${pct(v)}`,
    PenetrateIncrease: (v) => `DEF penetration +${pct(v)}`,
    EffectRangeIncrease: (v) => `splash area +${v}`,
    DiscountCost: (v) => `build cost −${pct(v)}`,
    DebuffPowerUp: (v) => `debuff power +${pct(v)}`,
    SetDebuffTimeIncrease: (v) => `debuff duration +${sec(v)}`,
    BurstCoolTimeDecrease: (v) => `Burst cooldown −${sec(v)}`,
    RefundPenaltyDecrease: (v) => `sell refund +${v}%`,
    DefensePointIncrease: (v) => `Defense Points +${v}`,
    GoldIncrease: (v) => `gold from Raptures +${pct(v)}`,
  };
  const groupTitle = (g) => {
    if (g.upgrade_target_type === 'HeroTower') return 'Nikkes';
    if (g.upgrade_target_type === 'Global') return 'Global';
    const t = line(g.upgrade_target_tower_group_id)[0];
    return t ? towerName(t).replace(/\s+I$/, '') : String(g.id);
  };

  // ---- missions ----
  const missions = ctx.table('EventTowerDefenseMissionTable');
  const missionRow = (m) => [
    name(m.mission_localkey, MISSION[m.mission_type] || m.mission_type).replace(/^(Daily|Challenge) - /, ''),
    m.reward_type === 'DailyPoint' ? `${m.reward_value} mission points` : { reward: ctx.reward(m.reward_value) },
  ];
  const arcade = ctx.table('EventTowerDefenseArcadeManagerTable')[0];

  // ---- tutorials ----
  const tutorials = ctx.table('EventTowerDefenseTutorialTable');
  const tutList = ctx.table('EventTowerDefenseTutorialListTable');
  const tutPages = ctx.table('EventTowerDefenseTutorialPageTable');
  const tutorialSections = (tut) => tutList.filter((l) => l.group_id === tut.tutorial_list_group_id).flatMap((l) =>
    tutPages.filter((p) => p.group_id === l.tutorial_page_group_id).sort((a, b) => a.page_order - b.page_order).map((p) => ({
      type: 'facts',
      title: name(p.page_title_localkey) || name(l.tutorial_title_localkey),
      items: [['', { img: ctx.img(p.image_resource), size: 'large' }], ['', bullets(p.tutorial_localkey).replace(/ (?=[A-Z])/g, ' ')]],
    })));

  const burstLines = ctx.table('EventTowerDefenseBurstDialogTable');
  const mainStages = stages.filter((s) => s.manager_id === main.id);
  const foolsStages = fools ? stages.filter((s) => s.manager_id === fools.id) : [];
  const challengeStage = mainStages.find((s) => s.stage_type === 'Challenge');

  const tutPage = (id, title, tut) => tut && {
    id, title, group: 'Guide', count: tutList.filter((l) => l.group_id === tut.tutorial_list_group_id).length, sections: tutorialSections(tut),
  };

  return {
    summary: 'A tower defense game: build and upgrade towers along the Raptures’ path, deploy Nikkes and aim their Burst Skills, and stop every wave before your Defense Points run out.',
    overview: [
      {
        type: 'facts',
        title: 'How it plays',
        items: [
          ['Goal', 'Raptures enter in waves and follow the road to the kingdom. Each one that gets through costs Defense Points (a boss costs all of them). Story stages are won by defeating the boss of the last wave.'],
          ['Gold', 'You start a stage with some gold and earn more for every Rapture defeated and for starting a wave early (Quick Start). Gold builds towers, upgrades them, learns tower skills and opens Nikke slots.'],
          ['Towers', `Four tower lines (Gun, Pulse Gun, Cannon, Ice Cannon) go from Lv. 1 to Lv. 3, then evolve into one of two specialist towers that can learn two skills. Building takes ${sec(main.tower_build_time)}, selling ${sec(main.tower_demolish_time)}; a sold tower refunds ${main.tower_refund_percentage}% of the gold spent.`],
          ['Nikkes', `Hero towers placed in Nikke slots (first one free, then ${main.hero_slot_open_cost} gold, +${main.hero_slot_open_cost_increase} for each further slot). Each Nikke can be deployed once per stage; drag her slot onto the map to fire her Burst Skill, which then has a cooldown that keeps running even if she is removed.`],
          ['Air units', 'Flying Raptures can only be hit by towers that attack air (cannons, the EMP and ice cannons hit only the ground).'],
          ['Camouflage', 'Some Raptures turn invisible from time to time; only towers that see through optical camouflage (Sniper Tower, Crown) or skills that remove it can hit them then.'],
          ['Broken Cores', `${name(main.upgrade_currency_description)} Earned from first clears of the stages and spent on permanent upgrades.`],
          ['Challenge', challengeStage ? ['An endless stage of up to 99 random waves, scored for Raptures defeated and waves survived; your best score counts for the Union ranking.', { page: `stage-${challengeStage.id}`, label: 'See the waves' }] : null],
          ['Intro story', ctx.intro ? { scene: ctx.intro.id, label: ctx.intro.label } : null],
        ],
      },
      {
        type: 'table',
        title: 'Stages',
        columns: ['Stage', 'Type', { label: 'Waves', num: true }, { label: 'Start gold', num: true }, { label: 'Nikkes', num: true }, 'First clear'],
        rows: [...mainStages, ...foolsStages].map((s) => [
          { page: `stage-${s.id}`, label: stageTitle(s) },
          { Scenario: 'Story', Normal: 'Stage', Challenge: 'Challenge' }[s.stage_type] || s.stage_type,
          waves.filter((w) => w.wave_data_group_id === s.wave_data_group_id).length,
          s.start_gold,
          s.max_hero_slot,
          s.stage_first_clear_reward ? { reward: ctx.reward(s.stage_first_clear_reward) } : '',
        ]),
      },
      {
        type: 'gallery',
        title: 'Nikkes',
        items: [...new Set(towers.filter((t) => t.manager_id === main.id && t.tower_type === 'Hero').map((t) => t.tower_group_id))]
          .map((g) => line(g)[0]).map((t) => ({ img: towerImg(t), caption: towerName(t).replace(/\s+I$/, '') })),
      },
    ],
    pages: [
      tutPage('guide', 'How to play', tutorials.find((t) => t.minigame_manager_id === main.id && /playguide/.test(t.tutorial_title_localkey))),
      tutPage('guide-challenge', 'Challenge stage', tutorials.find((t) => t.minigame_manager_id === main.id && /challenge/.test(t.tutorial_title_localkey))),
      {
        id: 'towers',
        title: 'Towers',
        group: 'Units',
        count: new Set(towers.filter((t) => t.manager_id === main.id && t.tower_type === 'Tower').map((t) => t.tower_group_id)).size,
        summary: 'Each line is built at Lv. 1 and upgraded with gold; Lv. 3 evolves into one of two towers. Higher levels unlock as you progress through the stages.',
        sections: [
          { type: 'text', text: 'Gold is the cost of that step (building Lv. 1, upgrading to the next level or evolving). DEF pen.: the share of the target’s DEF the tower ignores. Range and splash are in map units. RPM is the attack-rate stat behind the speed label.' },
          ...towerLineSections(main.id, 'Tower'),
        ],
      },
      {
        id: 'nikkes',
        title: 'Nikkes',
        group: 'Units',
        count: new Set(towers.filter((t) => t.manager_id === main.id && t.tower_type === 'Hero').map((t) => t.tower_group_id)).size,
        summary: 'Hero towers: deployed free into a Nikke slot, upgraded and evolved with gold like towers, each with a Burst Skill you aim yourself.',
        sections: [
          ...towerLineSections(main.id, 'Hero'),
          {
            type: 'table',
            title: 'Burst lines',
            columns: ['Nikke', 'Line'],
            rows: burstLines.filter((b) => line(b.hero_group_id)[0]?.manager_id === main.id).map((b) => [speakerCell(b.speaker), name(b.scenario_localkey)]),
          },
        ],
      },
      {
        id: 'raptures',
        title: 'Raptures',
        group: 'Units',
        count: monsterTypes(main.id).size,
        summary: 'Every Rapture comes in many strength tiers (variants with more HP and DEF for later stages and challenge waves); the table shows the range.',
        sections: [
          { type: 'text', text: 'Defense lost: Defense Points taken if it reaches the kingdom. Gold: earned for defeating it. Speed is in map units.' },
          { type: 'table', columns: monsterColumns, rows: monsterRows(main.id) },
          {
            type: 'gallery',
            title: 'Field guide',
            items: tutList.filter((l) => l.button_type === 'Monster' && monsterById.get(+l.button_value)?.manager_id === main.id).flatMap((l) =>
              tutPages.filter((p) => p.group_id === l.tutorial_page_group_id).map((p) => ({ img: ctx.img(p.image_resource), caption: name(l.tutorial_title_localkey) }))),
          },
        ],
      },
      ...mainStages.map(stagePage),
      {
        id: 'upgrades',
        title: 'Upgrades',
        group: 'Progress',
        count: upgradeGroups.length,
        summary: `Permanent upgrades bought with ${name(main.upgrade_currency_name, 'Broken Cores')}, which come from first-clearing stages.`,
        sections: upgradeGroups.map((g) => ({
          type: 'table',
          title: groupTitle(g),
          columns: ['Upgrade', 'Description', 'Effect', { label: 'Cores', num: true }],
          rows: upgradeList.filter((u) => u.group_id === g.upgrade_list_group_id).sort((a, b) => a.upgrade_list_order - b.upgrade_list_order).map((u) => [
            { img: ctx.img(u.upgrade_icon), caption: name(u.upgrade_name, String(u.id)), size: 'small' },
            name(u.upgrade_description),
            (UPGRADE[u.upgrade_effect_type] || ((v) => `${u.upgrade_effect_type} ${v}`))(u.upgrade_effect_value),
            u.upgrade_cost,
          ]),
        })),
      },
      {
        id: 'missions',
        title: 'Missions',
        group: 'Progress',
        count: missions.length,
        sections: [
          {
            type: 'table',
            title: 'Daily missions',
            note: 'Each daily mission gives mission points; the point milestones below give the rewards.',
            columns: ['Mission', 'Reward'],
            rows: missions.filter((m) => m.mission_category === 'DailyMission').map(missionRow),
          },
          { type: 'table', title: 'Daily point rewards', columns: ['Points', 'Reward'], rows: missions.filter((m) => m.mission_category === 'DailyPoint').map(missionRow) },
          { type: 'table', title: 'Challenges', columns: ['Mission', 'Reward'], rows: missions.filter((m) => m.mission_category === 'Achievement' && !m.arcade_mission_group_id).map(missionRow) },
          arcade ? {
            type: 'table',
            title: 'Challenges (rerun)',
            note: 'Used when the minigame returns in the event archive.',
            columns: ['Mission', 'Reward'],
            rows: missions.filter((m) => m.arcade_mission_group_id === arcade.arcade_mission_group_id).map(missionRow),
          } : null,
        ].filter(Boolean),
      },
      fools && {
        id: 'aprilfools',
        title: 'Mecha Shifty stage',
        group: 'April Fools',
        summary: 'A one-stage April Fools version: Shifty and her Mecha Shiftys against raging Mecha Shiftys.',
        sections: [
          ...tutorials.filter((t) => t.minigame_manager_id === fools.id).flatMap(tutorialSections),
          ...towerLineSections(fools.id, 'Hero'),
          { type: 'table', title: 'Burst lines', columns: ['Nikke', 'Line'], rows: burstLines.filter((b) => line(b.hero_group_id)[0]?.manager_id === fools.id).map((b) => [speakerCell(b.speaker), name(b.scenario_localkey)]) },
          { type: 'table', title: 'Towers', note: 'The same Gun and Pulse Gun lines as the main game, with lower ATK.', columns: towerColumns, rows: [...new Set(towers.filter((t) => t.manager_id === fools.id && t.tower_type === 'Tower').map((t) => t.tower_group_id))].flatMap(line).map(towerStats) },
          { type: 'table', title: 'Raptures', columns: monsterColumns, rows: monsterRows(fools.id) },
        ],
      },
      ...foolsStages.map(stagePage),
    ].filter(Boolean),
  };
}

module.exports = { build };
