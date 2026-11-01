// Old Tales: "In The Mirror" (EventMVG*), a side-scrolling action-adventure (metroidvania) in
// which Cinderella explores a mirror world of 8 chapters plus a hidden area. Raptures drop Gold
// and Cores, which buy stat upgrades (Upgrade Shop) and Modules / Memories (General Shop).
// Abilities unlock along a chain of main missions; after the ending, NEW GAME+ restarts the
// missions at a higher difficulty while keeping upgrades, modules and collection items.
//
// EventQuestMVG* is a second, much smaller build of the same engine: the April Fools stage of
// the "Fool Metal Panic" event quest, where Mecha Shifty fights two Shifty bosses.
//
// Units, worked out from the data and the help text:
// - Times are in 1/100 s (monster attack cooldown 300 = 3 s, dropped items vanish after 18000 = 3 min).
// - Character stats are stored ×100 (module energy 10 is raised by the upgrade "Set 1100" = 11).
// - "Mul" effects are percentages (95 = ×0.95). Chances are per 10,000.
// - Speeds in MonsterLevel are 32-bit floats stored as their raw bits (1065353216 = 1.0).

const n = (v) => Number(v).toLocaleString('en-US');
const sec = (cs) => `${+(cs / 100).toFixed(2)} s`;
const f32 = (bits) => { const b = Buffer.alloc(4); b.writeInt32LE(bits | 0); return +b.readFloatLE(0).toFixed(2); };
const GRADE = { Thrash: 'Minion', Normal: 'Normal', Elite: 'Elite', Special: 'Special', Centurion: 'Centurion', Boss: 'Boss' };
const GRADE_TONE = { Boss: 'bad', Elite: 'accent', Special: 'good' };
const ATTACK = {
  ProjectileLinear: 'Straight shot', ProjectileHoming: 'Homing shot', ProjectileLaser: 'Laser',
  ProjectileParabolic: 'Lobbed shot', Explosion: 'Explosion', Timelineskill: 'Special move',
};
// Drop list ids are <chapter><kind>: which kind of monster each last digit is for.
const DROP_KIND = { 1: 'Minions', 5: 'Normal', 2: 'Elite', 3: 'Treasure (golden)', 4: 'Boss' };
const UPGRADE_ICON = {
  StatAtk: 'mvg_upgrade_icon_attack', StatHp: 'mvg_upgrade_icon_hp', MaxModule: 'mvg_upgrade_icon_energy',
  HpRespawnTime: 'mvg_upgrade_icon_regen', StatMoveSpeed: 'mvg_upgrade_icon_speed', AMuzzleProjAmount: 'mvg_upgrade_icon_glass',
};
// Readable names for the variables that upgrades and modules change.
const VARS = {
  Stat_atk: 'ATK', Stat_hp: 'Max HP', MaxModuleSlot: 'Module energy', HealthRecoveryTime: 'HP recovery time',
  HealthRecoveryAmount: 'HP recovery amount', MvSpd: 'Move speed', DashLength: 'Dash length', DashInvincible: 'Invincible while dashing',
  JmpCount: 'Jumps', JmpMaxHeight: 'Jump height', AbsorbRecoveryTime: 'Absorb gauge recovery time', AbsorbRecoveryAmount: 'Absorb gauge recovery',
  Absorb_perfectTime: 'Perfect-absorb window', MaxAbsorbGauge: 'Max absorb gauge', KnockInvincibleTime: 'Invincibility after a hit',
  Currency: 'Gold gained', CoolDownTime: 'Cooldown', Proj_atk: 'Projectile ATK', Proj_spd: 'Projectile speed', Proj_pierce: 'Pierce',
  Proj_dmgCount: 'Hit count', Proj_duration: 'Duration', Proj_amount: 'Projectiles', Proj_size: 'Size', Attack_keep: 'Keep attacking while firing',
  Hold_move: 'Aim while holding', GlassC_toggle: 'Can be switched off', Proj_afterCollide: 'Effect on impact',
};

function build(ctx) {
  const T = (name) => ctx.table(`EventMVG${name}Table`);
  const Q = (name) => ctx.table(`EventQuestMVG${name}Table`);
  const ev = (key) => (key && !key.startsWith('Locale_') ? `Locale_Event:${key}` : key);
  const txt = (key, fb = '') => ctx.plain(ev(key), fb);
  const isTest = (key) => !key || /TestLocale/.test(key);
  const icon = (name, caption, size = 'small') => ({ img: ctx.img(name), caption, size });

  const settings = T('CommonSettings');
  const common = settings[0] || {};
  const hero = T('CharacterSetting')[0] || {};
  const currencies = T('Currency');
  const currencyIcon = new Map(currencies.map((c) => [c.category, c.iconresource]));
  const money = (type, v) => (v ? icon(currencyIcon.get(type), `${n(v)} ${type === 'Gold' ? 'Gold' : v === 1 ? 'Core' : 'Cores'}`) : null);

  // Chapters (1-8 plus the hidden "???" area 9; chapter 0 is the title/prologue duplicate).
  const chapters = T('ChapterInfo').filter((c) => c.chapter_id > 0).sort((a, b) => a.chapter_id - b.chapter_id);
  const chapterName = (id) => { const c = chapters.find((x) => x.chapter_id === id); return c ? txt(c.chapter_name, `Chapter ${id}`) : `Chapter ${id}`; };
  const roomChapter = (room) => +(/^C(\d+)_/.exec(room || '') || [])[1];

  // Collection items.
  const collectables = T('Collectable');
  const collById = new Map(collectables.map((c) => [c.id, c]));
  const collName = (id) => { const c = collById.get(id); return c ? txt(c.collectable_name, `#${id}`) : `#${id}`; };
  const memoryChapter = (c) => +(/chapter_(\d+)/.exec(c.iconresource) || [])[1];

  // Monsters: id digits are <chapter><kind><air 1 / ground 2><index>; only bosses have names.
  const monsters = T('MonsterSetting');
  const monById = new Map(monsters.map((m) => [m.id, m]));
  const modelLabel = (model) => {
    const s = String(model).replace(/^mvg_/, '').replace(/_prefab$/, '').split('_')
      .filter((w, i) => !(i === 0 && /^(th|no|el|sp|bo|ce)$/.test(w)) && !/^(gro|sky|\dch)$/.test(w)).join(' ');
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const monName = (m) => (m && m.name_localkey !== 'dummy' ? txt(m.name_localkey, modelLabel(m.monster_model_id)) : m ? modelLabel(m.monster_model_id) : '?');
  const monCell = (id) => {
    const m = monById.get(id);
    if (!m) return { key: String(id) };
    return m.name_localkey !== 'dummy' ? { b: monName(m) } : { text: monName(m), sub: `${m.type === 'Air' ? 'flying' : 'ground'} ${GRADE[m.grade].toLowerCase()}` };
  };
  const skills = new Map(T('MonsterSkill').map((s) => [s.id, s]));
  const tiers = new Map(T('MonsterAttackTier').map((t) => [t.id, t]));
  const attackList = (m, skillMap = skills) => {
    const out = [];
    for (let i = 1; i <= 15; i++) {
      const s = skillMap.get(m[`skill_id_${String(i).padStart(2, '0')}`]);
      if (!s) continue;
      const bits = [ATTACK[s.skill_type] || s.skill_type];
      if (s.projectile_explosive) bits.push('explodes');
      if (s.absorbable) bits.push('absorbable');
      if (s.attack_tier_id) bits.push(`damage tier ${tiers.get(s.attack_tier_id)?.attack_point ?? s.attack_tier_id}`);
      out.push(bits.join(', '));
    }
    return out.length ? out : ['Contact only'];
  };

  // Drops: monster.reward names a drop list id; each list has one row per difficulty step.
  const dropItems = new Map(T('MonsterDropItem').map((d) => [d.id, d]));
  const dropLists = T('MonsterDropList');
  const dropRow = (id, step) => dropLists.find((d) => d.id === id && d.challenge_step === step);
  const dropText = (row) => {
    if (!row) return '';
    const parts = row.dropsetting.filter((d) => d.droplistid && d.droplistrate).map((d) => {
      const it = dropItems.get(d.droplistid);
      if (!it) return null;
      const what = it.currencytype === 'MVGCore' ? 'Core' : 'Gold';
      const chance = d.droplistrate < 10000 ? ` (${+(d.droplistrate / 100).toFixed(2)}%)` : '';
      return `${n(it.currencyvalue * d.dropcount)} ${what}${chance}`;
    }).filter(Boolean);
    return parts.join(' + ');
  };
  const steps = T('ChallengeLevelSetting').sort((a, b) => a.challenge_step - b.challenge_step);
  const stepLabel = (s) => (s === 1 ? 'First game' : `NG+ ${s - 1}`);

  // Quests (main missions).
  const quests = T('Quest');
  const questById = new Map(quests.map((q) => [q.id, q]));
  const questName = (id) => { const q = questById.get(id); return q ? txt(q.name_localkey, `#${id}`).replace(/^- /, '') : `#${id}`; };
  const unlocks = T('Unlock');

  // In-game help pages (also the hidden ones that pop up when an ability unlocks).
  const hub = new Map(ctx.table('MinigameHubTable').map((h) => [h.id, h]));
  const helpDesc = ctx.table('MinigameHelpTipDescTable');
  const helpFor = (hubId) => {
    const h = hub.get(hubId);
    return h ? helpDesc.filter((d) => d.group_id === h.helptip_group).sort((a, b) => a.order - b.order) : [];
  };

  // Dialogue of a director timeline: its balloon lines in order.
  const dialogue = (directorTable, balloonTable, group) => {
    const balloons = new Map(balloonTable.map((b) => [b.id, b]));
    return directorTable.filter((d) => d.group_id === group && d.timelineaction === 'BalloonDisplay')
      .sort((a, b) => a.order - b.order)
      .map((d) => balloons.get(+d.timelinevalue[0]?.timelinevalue))
      .filter((b) => b && !isTest(b.locale_key))
      .map((b) => `${txt(b.locale_name, '')}: ${txt(b.locale_key)}`.replace(/^: /, ''));
  };
  const director = T('Director');
  const balloon = T('Balloon');

  // Character customisation rows (upgrade / module effects) by group id.
  const custom = T('CharacterCustom');
  const customByGroup = new Map();
  for (const c of custom) customByGroup.set(c.group_id, (customByGroup.get(c.group_id) || []).concat(c));
  const actions = T('CharacterCustomAction');
  const shotsIn = (group) => actions.filter((a) => a.group_id === group && a.proj_type !== 'None').length;
  const effectText = (groupId) => (customByGroup.get(groupId) || []).flatMap((c) => c.customvariablesdata)
    .filter((v) => v.customvariables !== 'None' && v.customcalctype !== 'None')
    .map((v) => {
      const what = VARS[v.customvariables] || v.customvariables;
      if (v.customvariables === 'ActionGroupID') return shotsIn(v.customvalue) ? `${shotsIn(v.customvalue)} shots per attack` : 'Changes the attack pattern';
      if (v.customcalctype === 'Mul') return `${what} ×${+(v.customvalue / 100).toFixed(2)}`;
      if (v.customcalctype === 'Add') return `${what} +${v.customvalue}`;
      if (v.customcalctype === 'Sub') return `${what} −${v.customvalue}`;
      return `${what}: ${v.customvalue}`;
    });
  const cooldown = (groupId) => (customByGroup.get(groupId) || [])[0]?.cooldowntime;

  // ---------------------------------------------------------------- Chapters
  const markers = T('MinimapMarker');
  const teleports = T('Teleport');
  const chapterSections = chapters.map((c) => {
    const id = c.chapter_id;
    const count = (type) => markers.filter((m) => m.markertype === type && roomChapter(m.roomaddressablename) === id).length;
    const bosses = monsters.filter((m) => m.grade === 'Boss' && Math.floor(m.id / 10000) === id && m.name_localkey !== 'dummy');
    const tps = teleports.filter((t) => roomChapter(t.roomaddressablename) === id);
    const mems = collectables.filter((x) => x.category === 'Memory' && memoryChapter(x) === id);
    return {
      type: 'facts',
      title: `${id === 9 ? 'Hidden area' : `Chapter ${id}`}: ${chapterName(id)}`,
      items: [
        ['', { img: ctx.img(id === 9 ? 'img_mvg_chapter_9' : c.chapter_img) || ctx.img(c.chapter_img), size: 'large' }],
        ['Boss', bosses.map((m) => m.name_localkey !== 'dummy' ? monName(m) : null).filter(Boolean).join(', ')],
        ['Transporters', tps.map((t) => ({ img: ctx.img(t.resourceimage || 'img_mvg_teleport_unknown'), caption: txt(t.localename), size: 'small' }))],
        ['Map points', [count('SavePoint') && `${count('SavePoint')} save points`, count('Shop') && `${count('Shop')} shops`].filter(Boolean).join(', ')],
        ['Memories', mems.map((x) => txt(x.collectable_name)).join(', ')],
      ],
    };
  });

  // ---------------------------------------------------------------- Main missions
  const unlockCell = (questId) => unlocks.filter((u) => u.unlock_condition_id === questId)
    .map((u) => icon(u.unlock_resource_id, txt(u.unlock_name_localkey).replace(/^Feature unlocked: /, '')));
  const goal = (q) => {
    const v = q.condition_value_1 || 1;
    switch (q.condition_type) {
      case 'KillMonster': return `Defeat ${monName(monById.get(q.condition_id))}${v > 1 ? ` ×${v}` : ''}`;
      case 'GetCollectable': return `Find ${collName(q.condition_id)}`;
      case 'MissionTargetPoint': return 'Reach the marked spot';
      case 'EndMission': return 'The end';
      case 'ClearMultiCondition': return quests.filter((c) => c.parents_quest_id === q.id).map((c) => `• ${questName(c.id)}`);
      default: return q.condition_type;
    }
  };
  const missionRows = (type) => quests.filter((q) => q.quest_target_type === type && q.quest_type !== 'ChildMission' && !isTest(q.name_localkey))
    .map((q, i) => [
      i + 1,
      { text: questName(q.id), sub: /DescEmpty/.test(q.description_localkey) ? '' : txt(q.description_localkey) },
      goal(q),
      q.time_line_group_id ? dialogue(director, balloon, q.time_line_group_id) : '',
      unlockCell(q.id),
      q.reward_id ? { reward: ctx.reward(q.reward_id) } : '',
    ]);
  const childRewards = quests.filter((q) => q.quest_type === 'ChildMission' && q.quest_target_type === 'First' && q.reward_id);

  // ---------------------------------------------------------------- Abilities
  const abilityRows = [
    [icon('icn_mvg_skill_a', 'Glass Slippers A'), 'Basic attack: shoots straight ahead. The Upgrade Shop adds more shots per attack.', 'From the start', sec(cooldown(hero.skill_a_idset) || 0)],
    ...unlocks.map((u) => {
      const help = helpFor(u.display_helptip_group_id)[0];
      const groupBy = { Skill_B: hero.skill_b_idset, Skill_C: hero.skill_c_idset, Skill_D: hero.skill_d_idset, Burst: hero.skill_burst_a_idset };
      const cd = groupBy[u.target_function_type] && cooldown(groupBy[u.target_function_type]);
      return [
        icon(u.unlock_resource_id, txt(u.unlock_name_localkey).replace(/^Feature unlocked: /, '')),
        help ? txt(help.helptip_description) : txt(u.unlock_description_localkey),
        { text: `After “${questName(u.unlock_condition_id)}”`, sub: 'main mission' },
        cd ? sec(cd) : '',
      ];
    }),
  ];

  // ---------------------------------------------------------------- Upgrade Shop
  const upgrades = T('UpgradeShop');
  const upgradeTypes = [...new Set(upgrades.map((u) => u.upgrade_type))];
  const upgradeSections = upgradeTypes.map((type) => {
    const list = upgrades.filter((u) => u.upgrade_type === type).sort((a, b) => a.upgrade_count - b.upgrade_count);
    const base = list.find((u) => u.upgrade_count === 0) || list[0];
    const levels = list.filter((u) => u.upgrade_count > 0);
    const effect = (u) => {
      const v = (customByGroup.get(u.upgrade_target_group_id) || [])[0]?.customvariablesdata.find((x) => x.customvariables !== 'None');
      if (!v) return '';
      if (type === 'AMuzzleProjAmount') return `${shotsIn(v.customvalue)} shots per basic attack`;
      if (v.customcalctype === 'Mul') return `${VARS[v.customvariables] || v.customvariables} ×${+(v.customvalue / 100).toFixed(2)}`;
      if (v.customcalctype === 'Set') return `${VARS[v.customvariables] || v.customvariables} ${+(v.customvalue / 100).toFixed(2)}`;
      return `${VARS[v.customvariables] || v.customvariables} +${+(v.customvalue / 100).toFixed(2)}`;
    };
    return {
      type: 'table',
      title: txt(base.name_localkey, type),
      sub: txt(levels[0]?.description_localkey, ''),
      columns: [{ label: 'Level', num: true }, 'Upgrade', 'Effect', 'Gold', 'Cores'],
      rows: levels.map((u) => [
        u.upgrade_count,
        u.upgrade_count === 1 ? icon(UPGRADE_ICON[type], txt(u.name_localkey)) : txt(u.name_localkey),
        u.is_max_level ? [effect(u), { tag: 'Max', tone: 'accent' }] : effect(u),
        money('Gold', u.condition_currency_value_1) || '',
        money('Core', u.condition_currency_value_2) || '',
      ]),
    };
  });
  const upgradeTotals = upgradeTypes.map((type) => {
    const l = upgrades.filter((u) => u.upgrade_type === type);
    return [txt((l.find((u) => !u.upgrade_count) || l[0]).name_localkey, type), `${n(l.reduce((s, u) => s + u.condition_currency_value_1, 0))} Gold + ${n(l.reduce((s, u) => s + u.condition_currency_value_2, 0))} Cores over ${l.filter((u) => u.upgrade_count).length} levels`];
  });

  // ---------------------------------------------------------------- Modules and the General Shop
  const modules = T('Module').sort((a, b) => a.order - b.order);
  const shop = T('Shop').sort((a, b) => a.order - b.order);
  const shopPrice = (type, id) => {
    const s = shop.find((x) => x.itemtype === type && x.itemid === id);
    if (!s) return null;
    return s.requirecurrency.filter((r) => r.requirecurrencytype !== 'None').map((r) => money(r.requirecurrencytype, r.requirecurrencyamount));
  };
  const CATEGORY = { Stat: 'Cinderella', SkillA: 'Glass Slippers A', SkillB: 'Glass Slippers B', SkillC: 'Glass Slippers C', SkillD: 'Glass Slippers D', Burst: 'Burst' };
  const moduleRows = modules.map((m) => [
    icon(m.iconresource, txt(m.module_name)),
    CATEGORY[m.category] || m.category,
    txt(m.module_desc),
    effectText(m.skill_id),
    m.module_use_value,
    shopPrice('Module', m.id) || 'Found in the world',
  ]);
  const shopRows = shop.map((s) => {
    const item = s.itemtype === 'Module' ? modules.find((m) => m.id === s.itemid) : collById.get(s.itemid);
    const name = item ? txt(s.itemtype === 'Module' ? item.module_name : item.collectable_name) : `#${s.itemid}`;
    const img = item ? item.iconresource : null;
    const desc = item ? txt(s.itemtype === 'Module' ? item.module_desc_short : item.collectable_desc_short) : '';
    return [s.itemslot, icon(img, name), s.itemtype === 'Module' ? 'Module' : 'Memory', desc, shopPrice(s.itemtype, s.itemid)];
  });

  // ---------------------------------------------------------------- Collection items
  const memoryPages = chapters.filter((c) => collectables.some((x) => x.category === 'Memory' && memoryChapter(x) === c.chapter_id));
  const memorySection = (c) => ({
    type: 'table',
    title: `Chapter ${c.chapter_id}: ${chapterName(c.chapter_id)}`,
    columns: ['Memory', 'Where', 'Text'],
    rows: collectables.filter((x) => x.category === 'Memory' && memoryChapter(x) === c.chapter_id).sort((a, b) => a.order - b.order)
      .map((x) => [icon(x.iconresource, txt(x.collectable_name)), txt(x.additionalgetinfo), txt(x.collectable_desc)]),
  });
  const keys = collectables.filter((x) => x.category === 'Key').sort((a, b) => a.order - b.order || a.id - b.id);

  // ---------------------------------------------------------------- Monsters
  const levels = new Map(T('MonsterLevel').map((l) => [l.id, l]));
  const firstLevel = levels.get(steps[0]?.level_id) || {};
  const gradeKey = (g) => g.toLowerCase().replace('thrash', 'thrash');
  const monsterRow = (m) => [
    m.name_localkey !== 'dummy' ? { b: monName(m) } : { text: monName(m), sub: 'no in-game name; label from its model' },
    [{ tag: GRADE[m.grade], tone: GRADE_TONE[m.grade] }, m.type === 'Air' ? 'Flying' : 'Ground'],
    `×${+(m.hp_ratio / 1000).toFixed(2)}`,
    firstLevel[gradeKey(m.grade)] != null ? Math.round(firstLevel[gradeKey(m.grade)] * m.hp_ratio / 1000) : '',
    attackList(m),
    dropText(dropRow(+m.reward, 1)),
    sec(m.respawn_time),
  ];
  const monsterColumns = ['Monster', 'Kind', { label: 'HP ×', num: true }, { label: 'HP (first game)', num: true }, 'Attacks', 'Drops (first game)', { label: 'Respawn', num: true }];
  const monsterPages = chapters.map((c) => {
    const list = monsters.filter((m) => Math.floor(m.id / 10000) === c.chapter_id)
      .sort((a, b) => (a.grade === 'Boss') - (b.grade === 'Boss') || a.id % 10000 - b.id % 10000);
    return {
      id: `monsters-${c.chapter_id}`,
      title: c.chapter_id === 9 ? 'Hidden area' : `Chapter ${c.chapter_id}`,
      group: 'In The Mirror: Monsters',
      count: list.length,
      summary: chapterName(c.chapter_id),
      sections: [{
        type: 'table',
        note: 'HP is the difficulty step’s base HP for the monster’s grade times its HP multiplier (an inference from the tables). Attack “tier” is a damage tier; “absorbable” attacks can be soaked up in Absorb Mode to charge Burst.',
        columns: monsterColumns,
        rows: list.map(monsterRow),
      }],
    };
  });

  const bosses = monsters.filter((m) => m.grade === 'Boss' && m.name_localkey !== 'dummy');
  const difficultyRows = steps.map((s) => {
    const l = levels.get(s.level_id) || {};
    return [stepLabel(s.challenge_step), l.thrash, l.normal, l.elite, l.special, l.boss, `×${f32(l.attack_speed)}`, `×${f32(l.chase_speed)}`, tiers.get(l.stendard_attack_tier_id)?.attack_point ?? ''];
  });
  const dropKinds = [...new Set(dropLists.filter((d) => d.id >= 10 && d.id < 100).map((d) => d.id))]
    .sort((a, b) => Math.floor(a / 10) - Math.floor(b / 10) || [1, 5, 2, 3, 4].indexOf(a % 10) - [1, 5, 2, 3, 4].indexOf(b % 10));
  const dropSteps = [...new Set(dropLists.filter((d) => d.id >= 10 && d.id < 100).map((d) => d.challenge_step))].sort((a, b) => a - b);

  // ---------------------------------------------------------------- Missions (daily + challenges)
  const missions = T('Mission');
  const missionPage = (mvgId, title, summary) => {
    const list = missions.filter((m) => m.mvg_id === mvgId);
    if (!list.length) return null;
    const daily = list.filter((m) => m.mission_type === 'Daily');
    const dailyTasks = daily.filter((m) => m.point_value).sort((a, b) => a.order - b.order);
    const dailyRewards = daily.filter((m) => m.condition_type === 'ClearAchievement').sort((a, b) => a.condition_value - b.condition_value);
    const SUB = { ChapterClear: 'Chapter clears', MonsterKill: 'Monster hunting', Explorer: 'Exploration', GetItem: 'Collecting' };
    const subs = [...new Set(list.filter((m) => m.mission_type === 'Achievement').map((m) => m.mission_sub_type))];
    return {
      id: `missions-${mvgId}`,
      title,
      group: 'In The Mirror',
      count: list.length,
      summary,
      sections: [
        dailyTasks.length && {
          type: 'table',
          title: 'Daily missions',
          note: 'Each daily task gives points; the point totals below unlock the daily rewards.',
          columns: ['Task', { label: 'Goal', num: true }, { label: 'Points', num: true }],
          rows: dailyTasks.map((m) => [txt(m.name_localkey), m.condition_value, m.point_value]),
        },
        dailyRewards.length && {
          type: 'table',
          title: 'Daily point rewards',
          columns: [{ label: 'Points', num: true }, 'Reward'],
          rows: dailyRewards.map((m) => [m.condition_value, { reward: ctx.reward(m.reward_id) }]),
        },
        ...subs.map((sub) => ({
          type: 'table',
          title: `Challenges: ${SUB[sub] || sub}`,
          note: 'Each challenge pays out once. The last row is for completing the others in this tab.',
          columns: ['Challenge', 'Reward'],
          rows: list.filter((m) => m.mission_type === 'Achievement' && m.mission_sub_type === sub)
            .sort((a, b) => a.display_type - b.display_type || a.order - b.order)
            .map((m) => [m.display_type ? { b: txt(m.name_localkey) } : txt(m.name_localkey), { reward: ctx.reward(m.reward_id) }]),
        })),
      ].filter(Boolean),
    };
  };
  const archive = settings.find((s) => s.is_archive);

  // ---------------------------------------------------------------- April Fools (EventQuestMVG)
  const qHero = Q('CharacterSetting')[0];
  const qCustom = Q('CharacterCustom');
  const qActs = Q('CharacterCustomAct');
  const qSkills = new Map(Q('MonsterSkill').map((s) => [s.id, s]));
  const qMonsters = Q('MonsterSetting');
  const qLevel = Q('MonsterLevel')[0] || {};
  const qStage = ctx.table('EventQuestStageTable').find((s) => s.minigame_type === 'EventQuestMVG');
  const qAttack = (groupId) => {
    const c = qCustom.find((x) => x.group_id === groupId);
    if (!c) return null;
    const hits = qActs.filter((a) => a.group_id === c.actiongroupid && a.proj_atk);
    return { c, hits };
  };
  const qAttackRow = (label, groupId, what) => {
    const a = qAttack(groupId);
    if (!a) return null;
    const dmg = a.hits.length ? a.hits.map((h) => n(h.proj_atk)).join(' + ') : 'base';
    return [label, what, dmg, sec(a.c.cooldowntime)];
  };
  const qDirector = Q('Director');
  const qBalloon = Q('Balloon');
  const qScenes = [1, 2, 3, 4, 5].map((g) => dialogue(qDirector, qBalloon, g)).filter((l) => l.length);
  const aprilPage = qHero && {
    id: 'aprilfools',
    title: 'Mecha Shifty stage',
    group: 'April Fools (Quest MVG)',
    count: qMonsters.length,
    summary: 'A one-stage April Fools version of the In The Mirror engine, played inside the Fool Metal Panic event quest.',
    sections: [
      {
        type: 'text',
        text: 'Play as Mecha Shifty and fight through one stage of “upgraded” Mecha Shiftys to two bosses, Mega Mecha Shifty and Mega Mekami Shifty. There are no shops, upgrades, modules or collection items here: just movement, a basic attack, a special attack and a Burst. Stages can be skipped, but a skipped stage cannot be replayed.',
      },
      {
        type: 'facts',
        title: 'Where to play',
        items: [
          ['Event quest stage', qStage ? { key: String(qStage.id) } : null],
          ['Story before the stage', qStage ? ctx.scene(qStage.enter_scenario) || { key: qStage.enter_scenario } : null],
          ['Stage reward', qStage && qStage.reward_id ? { reward: ctx.reward(qStage.reward_id) } : null],
        ],
      },
      {
        type: 'facts',
        title: 'Mecha Shifty',
        items: [
          ['HP', qHero.stat_hp],
          ['ATK', qHero.stat_atk],
          ['Burst gauge', `${n(qHero.burstgauge_charge)}, filled by defeating enemies (see below)`],
        ],
      },
      {
        type: 'table',
        title: 'Attacks',
        note: 'Hit power is the projectile ATK value stored for each hit (probably a percentage of ATK; “base” = none stored). Cooldowns assume the tables’ usual 1/100 s.',
        columns: ['Attack', 'What it does', 'Hit power', { label: 'Cooldown', num: true }],
        rows: [
          qAttackRow('Attack', qHero.skill_a_idset, 'Straight shot'),
          qAttackRow('Special attack', qHero.skill_b_idset, 'Raises a hand and fires an exploding shot'),
          qAttackRow('Burst', qHero.skill_burst_a_idset, 'Five blasts that hit every enemy on screen; invincible while it plays'),
        ].filter(Boolean),
      },
      {
        type: 'table',
        title: 'Enemies',
        note: `HP is ${qLevel.thrash ?? '?'} (minion) or ${qLevel.boss ?? '?'} (boss) base HP times the multiplier (an inference).`,
        columns: ['Enemy', 'Kind', { label: 'HP ×', num: true }, { label: 'HP', num: true }, 'Attacks', { label: 'Burst gauge on kill', num: true }],
        rows: qMonsters.map((m) => [
          { b: txt(m.name_localkey, modelLabel(m.monster_model_id)) },
          [{ tag: GRADE[m.grade], tone: GRADE_TONE[m.grade] }, m.type === 'Air' ? 'Flying' : 'Ground'],
          `×${+(m.hp_ratio / 1000).toFixed(2)}`,
          qLevel[gradeKey(m.grade)] != null ? Math.round(qLevel[gradeKey(m.grade)] * m.hp_ratio / 1000) : '',
          attackList(m, qSkills),
          m.death_charge_burstgauge,
        ]),
      },
      { type: 'list', title: 'Dialogue', note: 'The cut-in conversations of the stage, in order.', items: qScenes.map((l) => l.join('\n')) },
      { type: 'list', title: 'Loading tips', items: Q('Loading').sort((a, b) => a.order - b.order).map((l) => txt(l.loading_tip_localkey)) },
      { type: 'help', help: ctx.help(Q('CommonSettings')[0]?.tutorialhubgroupid || 1004) },
    ],
  };

  // ---------------------------------------------------------------- Assemble
  const memCount = collectables.filter((x) => x.category === 'Memory').length;
  return {
    summary: 'In The Mirror: explore a side-scrolling mirror world as Cinderella, defeat Raptures for Gold and Cores, unlock new Glass Slippers abilities through main missions, and replay it on NEW GAME+. Also includes the April Fools Mecha Shifty stage built on the same engine.',
    overview: [
      {
        type: 'text',
        title: 'How it plays',
        text: [
          `Cinderella explores ${chapters.filter((c) => c.chapter_id <= 8).length} connected chapters (plus a hidden “???” danger zone) by running, jumping and shooting with her Glass Slippers. Main missions lead from area to area; each one points you to a spot, a boss or an item, and many of them unlock a new ability (Dash, Double Jump, Absorb Mode, Glass Slippers B/C/D, Burst).`,
          'Defeated Raptures drop Gold (and, from bosses on NEW GAME+, Cores). Spend them in the Upgrade Shop on six permanent upgrades, and in the General Shop on Modules and Memories. Modules are equipment that tweak a skill; each costs module energy and you can only equip as much as your energy allows.',
          `Hidden around the map are ${memCount} Memories (lore texts) and ${collectables.length - memCount} Keys, which open locked doors. Touching a save point (a petal-shaped glass fragment) saves everything; there is only one save file.`,
          'After the ending you can start NEW GAME+: the difficulty rises, exploration, upgrades, modules and items are kept, and the main missions start over (with a repeatable boss-hunt mission and bigger drops).',
        ].join('\n\n'),
      },
      {
        type: 'facts',
        title: 'Cinderella at the start',
        items: [
          ['HP', hero.stat_hp],
          ['ATK', hero.stat_atk],
          ['Absorb gauge', hero.maxabsorbgauge],
          ['Module energy', hero.maxmoduleslot],
          ['Burst', 'Charged by absorbing enemy shots and by defeating Raptures; makes her invincible while it fires'],
        ],
      },
      {
        type: 'table',
        title: 'Currencies',
        columns: ['Currency', 'What it is'],
        rows: currencies.map((c) => [
          icon(c.iconresource, c.category === 'Gold' ? 'Gold' : 'Core'),
          ctx.plain(`Locale_Item:EventMVG_CurrencyDesc_MVG${c.category}`, ''),
        ]),
      },
      {
        type: 'facts',
        title: 'Rules of the world',
        items: [
          ['Dropped items', `Disappear after ${sec(common.dropitemdeletetime)} if not picked up`],
          ['Changing rooms', `${sec(common.roomchangeinvincibletime)} of invincibility on entering a room`],
          ['Hazards and objects', 'Electric and fire traps, moving platforms, floor switches, locked doors and item boxes (some need a key)'],
          ['Easy Mode', 'An option for story viewing: Cinderella’s HP does not go down'],
          ['NEW GAME+', `${steps.length - 1} difficulty steps after the first game`],
        ],
      },
      { type: 'gallery', title: 'Chapters', items: chapters.filter((c) => ctx.img(c.chapter_img)).map((c) => ({ img: ctx.img(c.chapter_img), caption: chapterName(c.chapter_id) })) },
      { type: 'list', title: 'Loading tips', items: T('Loading').sort((a, b) => a.order - b.order).map((l) => txt(l.loading_tip_localkey)) },
      { type: 'help', help: ctx.help(1001) },
    ],
    pages: [
      {
        id: 'chapters',
        title: 'Chapters',
        group: 'In The Mirror',
        count: chapters.length,
        summary: 'The areas of the mirror world, their bosses, transporters (fast travel), save points and shops.',
        sections: chapterSections,
      },
      {
        id: 'main-missions',
        title: 'Main missions',
        group: 'In The Mirror',
        count: missionRows('First').length,
        summary: 'The story chain. Each mission starts when the previous one is done; some unlock abilities.',
        sections: [
          {
            type: 'table',
            title: 'First playthrough',
            note: 'Missions with several goals list their sub-goals; each sub-goal has its own small reward (below).',
            columns: [{ label: '#', num: true }, 'Mission', 'Goal', 'Dialogue', 'Unlocks', 'Reward'],
            rows: missionRows('First'),
          },
          {
            type: 'table',
            title: 'Sub-goal rewards',
            columns: ['Part of', 'Sub-goal', 'Reward'],
            rows: childRewards.map((q) => [questName(q.parents_quest_id), questName(q.id), { reward: ctx.reward(q.reward_id) }]),
          },
          {
            type: 'table',
            title: 'NEW GAME+ (repeatable)',
            note: 'On NEW GAME+ the main mission is to defeat every region’s boss again.',
            columns: [{ label: '#', num: true }, 'Mission', 'Goal', 'Dialogue', 'Unlocks', 'Reward'],
            rows: missionRows('Loop'),
          },
          {
            type: 'table',
            title: 'NEW GAME+ boss rewards',
            columns: ['Boss', 'Reward'],
            rows: quests.filter((q) => q.quest_target_type === 'Loop' && q.quest_type === 'ChildMission').map((q) => [monCell(q.condition_id), { reward: ctx.reward(q.reward_id) }]),
          },
        ],
      },
      {
        id: 'abilities',
        title: 'Cinderella’s abilities',
        group: 'In The Mirror',
        count: abilityRows.length,
        summary: 'What each ability does and which main mission unlocks it.',
        sections: [{
          type: 'table',
          note: 'Cooldowns are the base values (1/100 s in the tables); modules can shorten them.',
          columns: ['Ability', 'What it does', 'Unlocked', { label: 'Cooldown', num: true }],
          rows: abilityRows,
        }],
      },
      {
        id: 'upgrades',
        title: 'Upgrade Shop',
        group: 'In The Mirror',
        count: upgrades.filter((u) => u.upgrade_count > 0).length,
        summary: 'Permanent upgrades bought with Gold and Cores. They carry over to NEW GAME+.',
        sections: [
          {
            type: 'facts',
            title: 'Full cost of each upgrade line',
            note: 'Effects are shown as stored for each level (stats ×1/100, multipliers as ×); whether a level adds to the previous one or replaces it is not clear from the data.',
            items: upgradeTotals,
          },
          ...upgradeSections,
        ],
      },
      {
        id: 'shop',
        title: 'General Shop',
        group: 'In The Mirror',
        count: shop.length,
        summary: ctx.plain(shop.find((s) => s.shoptxt)?.shoptxt, 'Modules and Memories for Gold.'),
        sections: [{
          type: 'table',
          note: 'Each item can be bought once.',
          columns: [{ label: 'Slot', num: true }, 'Item', 'Type', 'Description', 'Price'],
          rows: shopRows,
        }],
      },
      {
        id: 'modules',
        title: 'Modules',
        group: 'In The Mirror',
        count: modules.length,
        summary: 'Equipment that changes a skill. Equipping costs module energy (raised in the Upgrade Shop).',
        sections: [{
          type: 'table',
          note: '“Effect (data)” is read from the module’s customisation rows: × values are multipliers, + values are as stored.',
          columns: ['Module', 'For', 'Description', 'Effect (data)', { label: 'Energy', num: true }, 'Shop price'],
          rows: moduleRows,
        }],
      },
      {
        id: 'memories',
        title: 'Memories',
        group: 'In The Mirror: Collection',
        count: memCount,
        summary: 'Lore texts hidden around each chapter; the last two of every chapter are sold in the General Shop.',
        sections: memoryPages.map(memorySection),
      },
      {
        id: 'keys',
        title: 'Keys',
        group: 'In The Mirror: Collection',
        count: keys.length,
        summary: 'Items that open locked doors and boxes, or that main missions ask you to find.',
        sections: [{
          type: 'table',
          columns: ['Key', 'Description', 'Where'],
          rows: keys.map((x) => [icon(x.iconresource, txt(x.collectable_name)), txt(x.collectable_desc), txt(x.additionalgetinfo)]),
        }],
      },
      {
        id: 'bosses',
        title: 'Bosses',
        group: 'In The Mirror: Monsters',
        count: bosses.length,
        summary: 'Each region’s named boss.',
        sections: [{
          type: 'table',
          note: 'HP is the first game’s base boss HP times the boss’s multiplier (an inference). Drops are for the first game; see “Difficulty and drops” for NEW GAME+.',
          columns: ['Boss', 'Area', { label: 'HP ×', num: true }, { label: 'HP (first game)', num: true }, 'Attacks', 'Drops (first game)'],
          rows: bosses.map((m) => [
            { b: monName(m) },
            chapterName(Math.floor(m.id / 10000)),
            `×${+(m.hp_ratio / 1000).toFixed(2)}`,
            Math.round((firstLevel.boss || 0) * m.hp_ratio / 1000),
            attackList(m),
            dropText(dropRow(+m.reward, 1)),
          ]),
        }],
      },
      ...monsterPages,
      {
        id: 'difficulty',
        title: 'Difficulty and drops',
        group: 'In The Mirror: Monsters',
        count: steps.length,
        summary: 'How monsters get stronger and richer with each NEW GAME+ step.',
        sections: [
          {
            type: 'table',
            title: 'Monster strength per step',
            note: 'Base HP per grade; a monster’s HP is this times its own multiplier. Speeds are multipliers. “Attack tier” is the standard damage tier used by attacks without a fixed tier (meaning partly unclear).',
            columns: ['Step', { label: 'Minion HP', num: true }, { label: 'Normal HP', num: true }, { label: 'Elite HP', num: true }, { label: 'Special HP', num: true }, { label: 'Boss HP', num: true }, 'Attack speed', 'Chase speed', { label: 'Attack tier', num: true }],
            rows: difficultyRows,
          },
          {
            type: 'table',
            title: 'Drops per step',
            note: 'Total Gold / Cores dropped by one kill (value × number of pickups). Treasure monsters are the golden ones that run away; they respawn after 10 minutes.',
            columns: ['Area', 'Monsters', ...dropSteps.map(stepLabel)],
            rows: dropKinds.map((id) => [
              chapterName(Math.floor(id / 10)),
              DROP_KIND[id % 10] || `#${id}`,
              ...dropSteps.map((s) => dropText(dropRow(id, s))),
            ]),
          },
        ],
      },
      missionPage(1, 'Missions and challenges', 'Daily missions and one-time challenges of the event.'),
      missionPage(2, 'Challenges (archive)', archive ? 'A second challenge list, probably the one used when the game is replayed from the Archive (the settings table has an archive entry).' : 'A second challenge list.'),
      aprilPage,
    ].filter(Boolean),
  };
}

module.exports = { build };
