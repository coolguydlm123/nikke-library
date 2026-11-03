// Playable characters: profile, weapon, skills (all levels), costumes and
// links to their bond/counseling stories.
const fs = require('fs');
const path = require('path');
const { art } = require('./art');

// icons-char art: si_c082_00_s (small icon), c082_00 (portrait), c082_01.. (costumes).
const charRes = (c, i = 0) => `c${String(c.resource_id).padStart(3, '0')}_${String(i).padStart(2, '0')}`;

function readRecords(file) {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(json) ? json : json.records || [];
}

const BURST = { Step1: 'I', Step2: 'II', Step3: 'III', AllStep: 'A' };
const titleCase = (s) => String(s).toLowerCase().replace(/(^|[\s_])(\w)/g, (m, a, b) => (a ? ' ' : '') + b.toUpperCase());

class CharacterLibrary {
  constructor(dataDir, locale, stories) {
    this.dataDir = dataDir;
    this.locale = locale;
    this.stories = stories;
  }

  table(name) {
    const file = path.join(this.dataDir, `${name}.json`);
    return fs.existsSync(file) ? readRecords(file) : [];
  }

  text(key, fallback = null) {
    return (key && this.locale.get(key)) || fallback;
  }

  sys(key, fallback) {
    return this.text(`Locale_System:${key}`, fallback);
  }

  build() {
    // One entry per name_code; the base row is the visible row with the lowest grade.
    const byCode = new Map();
    for (const c of this.table('Character/CharacterTable')) {
      if (!c.is_visible) continue;
      const prev = byCode.get(c.name_code);
      if (!prev || c.grade_core_id < prev.grade_core_id) byCode.set(c.name_code, c);
    }
    this.rows = byCode;
    this.elements = new Map(this.table('ElementTable').map((e) => [e.id, this.text(e.element_name_localekey, e.element)]));
    this.shots = new Map(this.table('Character/CharacterShotTable').map((s) => [s.id, s]));
    // Weapon type descriptions and the in-game ammo / reload / fire rate / range ratings.
    this.weaponInfo = new Map(this.table('Character/CharacterShotTutorialTable').map((w) => [w.weapon_type, {
      description: this.text(w.weapon_info_localkey, ''),
      ammo: this.text(w.max_load_info_localkey, ''),
      reload: this.text(w.reload_time_info_localkey, ''),
      fireRate: this.text(w.shot_speed_info_localkey, ''),
      range: this.text(w.effective_range_info_localkey, ''),
      control: this.text(w.operation_type_info_localkey, ''),
    }]));
    this.skills = new Map(this.table('SkillInfoTable').map((s) => [s.id, s]));
    this.skillData = new Map(this.table('Character/CharacterSkillTable').map((s) => [s.id, s]));
    this.costumes = this.table('Character/CharacterCostumeTable');
    // Voice lines: CharacterVoiceTable gives each look (resource_id + costume_index) a speech group,
    // CharacterVoiceGroupTable holds that group's lines, CharacterVoiceCategoryTable names the tabs.
    this.voiceCategories = new Map(this.table('Character/CharacterVoiceCategoryTable').map((v) => [v.id, { order: v.order, name: this.text(v.category_description, `Category ${v.id}`) }]));
    this.voiceByLook = new Map(this.table('Character/CharacterVoiceTable').map((v) => [`${v.resource_id}:${v.costume_index}`, v.id]));
    this.voiceLines = new Map();
    for (const g of this.table('Character/CharacterVoiceGroupTable')) {
      if (!this.voiceLines.has(g.speech_group_id)) this.voiceLines.set(g.speech_group_id, []);
      this.voiceLines.get(g.speech_group_id).push(g);
    }
    // Favorite items (SSR "treasures") replace a Nikke's skills with upgraded versions.
    this.favorites = new Map(this.table('FavoriteItemTable').filter((f) => f.favorite_type === 'Favorite' && f.name_code).map((f) => [f.name_code, f]));
    this.buildBattlePower();
    this.list = [...byCode.values()].map((c) => this.summary(c)).sort((a, b) => a.name.localeCompare(b.name));
    console.log(`Indexed ${this.list.length} characters`);
  }

  summary(c) {
    const shot = this.shots.get(c.shot_id);
    return {
      code: c.name_code,
      name: this.text(c.name_localkey, String(c.name_code)),
      rarity: c.original_rare,
      class: this.sys(`CLASS_TYPE_${c.class.toUpperCase()}_NAME`, c.class),
      corporation: titleCase(c.corporation),
      overspec: c.corporation_sub_type === 'OVERSPEC',
      element: (c.element_id || []).map((e) => this.elements.get(e)).filter(Boolean),
      weapon: shot?.weapon_type || null,
      weaponName: shot ? this.sys(`WEAPON_TYPE_${shot.weapon_type}_NAME`, shot.weapon_type) : null,
      burst: BURST[c.use_burst_skill] || c.use_burst_skill,
      hasFavorite: this.favorites.has(c.name_code),
      icon: art('icons-char', `si_${charRes(c)}_s`),
    };
  }

  // Battle power of item effects for the CP calculator, read from
  // FunctionTable.function_battlepower (summed over a state effect's functions):
  // overload lines by level, harmony cubes by cube level, collection items by level.
  buildBattlePower() {
    const functions = this.table('FunctionTable');
    const fnBp = new Map(functions.map((f) => [f.id, f.function_battlepower || 0]));
    const fnType = new Map(functions.map((f) => [f.id, f.function_type]));
    const effects = new Map(this.table('StateEffectTable').map((s) => [s.id, s]));
    const bpOfEffect = (id) => (effects.get(id)?.functions || []).reduce((sum, f) => sum + (fnBp.get(f.function) || 0), 0);
    const skillByGroup = new Map();
    for (const s of this.skills.values()) skillByGroup.set(`${s.group_id}:${s.skill_level}`, s.id);
    const bpOfSkill = (groupId, level) => (level > 0 ? bpOfEffect(skillByGroup.get(`${groupId}:${level}`)) : 0);

    // Overload: each effect type's tiers chained into levels 1..15 (tiers worth 0 BP skipped).
    const byType = new Map();
    for (const o of this.table('EquipmentOptionTable').sort((a, b) => a.id - b.id)) {
      for (const l of o.state_effect_list.filter((e) => e.state_effect_id)) {
        const type = fnType.get(effects.get(l.state_effect_id)?.functions?.[0]?.function);
        if (!byType.has(type)) byType.set(type, []);
        byType.get(type).push(bpOfEffect(l.state_effect_id));
      }
    }
    // Elemental damage (IncElementDmg) has its own scale; every other line shares one.
    const levelsOf = (type) => (byType.get(type) || []).filter((x) => x > 0);
    const elemental = levelsOf('IncElementDmg');
    const other = levelsOf('StatAtk');

    const cubes = this.table('ItemHarmonyCubeTable').sort((a, b) => a.order - b.order);
    const cubeLevels = this.table('ItemHarmonyCubeLevelTable');
    this.cpData = {
      overload: { elemental, other },
      cubes: cubes.map((c) => {
        const groups = c.harmonycube_skill_group.map((g) => g.skill_group_id);
        const levels = cubeLevels.filter((l) => l.level_enhance_id === c.level_enhance_id).sort((a, b) => a.level - b.level);
        return {
          id: c.id,
          name: this.text(c.name_localkey, String(c.id)),
          levels: levels.map((l) => l.skill_levels.reduce((sum, s, i) => sum + (groups[i] ? bpOfSkill(groups[i], s.skill_level) : 0), 0)),
        };
      }),
    };

    // Collection items (one R and one SR per weapon type) and favorite items: BP by item level.
    const itemLevels = this.table('FavoriteItemLevelTable');
    const itemBp = (f) => {
      const groups = f.collection_skill_group_data.map((g) => g.collection_skill_id);
      return itemLevels.filter((l) => l.level_enhance_id === f.level_enhance_id).sort((a, b) => a.level - b.level)
        .map((l) => ({
          level: l.level,
          phase: l.grade,
          bp: l.collection_skill_level_data.reduce((sum, s, i) => sum + (groups[i] ? bpOfSkill(groups[i], s.collection_skill_level) : 0), 0),
        }));
    };
    this.dollsByWeapon = new Map();
    this.favoriteBp = new Map();
    for (const f of this.table('FavoriteItemTable')) {
      const entry = { id: f.id, name: this.text(f.name_localkey, String(f.id)), rarity: f.favorite_rare, type: f.favorite_type, levels: itemBp(f) };
      if (f.favorite_type === 'Collection') {
        if (!this.dollsByWeapon.has(f.weapon_type)) this.dollsByWeapon.set(f.weapon_type, []);
        this.dollsByWeapon.get(f.weapon_type).push(entry);
      } else if (f.name_code) this.favoriteBp.set(f.name_code, entry);
    }
    this.overload = this.buildOverload(new Map(functions.map((f) => [f.id, f])), effects);
  }

  // Overload (modified T10) gear: the effects a line can roll, their values and BP per level,
  // the roll chances, and the Custom Module / Custom Lock costs.
  // EquipmentOptionTable: option_group_ratio weights the effect type within its option group,
  // option_ratio (of 10000) picks the tier, each tier holding 5 levels (tier 1 = Lv 1-5 ...).
  buildOverload(fnById, effects) {
    const gear = this.table('ItemEquipTable').find((e) => e.option_slot?.some((s) => s.option_slot));
    if (!gear) return null;
    const group = gear.option_slot.find((s) => s.option_slot).option_slot;
    const options = this.table('EquipmentOptionTable').filter((o) => o.equipment_option_group_id === group).sort((a, b) => a.id - b.id);
    const weights = new Map(options.map((o) => [o.state_effect_group_id, o.option_group_ratio]));
    const totalWeight = [...weights.values()].reduce((a, b) => a + b, 0);
    const types = new Map();
    for (const o of options) {
      const fns = o.state_effect_list.filter((l) => l.state_effect_id).map((l) => fnById.get(effects.get(l.state_effect_id)?.functions?.[0]?.function));
      if (!types.has(o.state_effect_group_id)) {
        types.set(o.state_effect_group_id, {
          name: this.text(o.description_localkey, fns[0]?.function_type || String(o.id)),
          functionType: fns[0]?.function_type || null,
          chance: (o.option_group_ratio / totalWeight) * 100,
          tiers: [],
        });
      }
      const type = types.get(o.state_effect_group_id);
      const first = type.tiers.length * fns.length + 1;
      // Values are stored x100; hit rate (accuracy circle) and charge time are negative = better.
      type.tiers.push({
        chance: o.option_ratio / 100,
        levels: fns.map((fn, i) => ({ level: first + i, value: fn ? Math.abs(fn.function_value) / 100 : null, bp: fn?.function_battlepower || 0 })),
      });
    }

    // Costs by cost level; a level can also be paid with one-time Custom Locks (disposable_fix).
    const costRows = new Map(this.table('CostTable').map((c) => [c.id, c]));
    const materials = new Map(this.table('ItemMaterialTable').map((m) => [m.id, m]));
    const cost = (id) => (costRows.get(id)?.costs || []).filter((c) => c.item_id).map((c) => ({
      item: this.text(materials.get(c.item_id)?.name_localkey, String(c.item_id)), count: c.item_value,
    }));
    const optionCosts = this.table('EquipmentOptionCostTable');
    const costGroup = (groupId) => {
      const levels = new Map();
      for (const r of optionCosts.filter((c) => c.cost_group_id === groupId).sort((a, b) => a.cost_level - b.cost_level || a.disposable_fix_cost_level - b.disposable_fix_cost_level)) {
        if (!levels.has(r.cost_level)) levels.set(r.cost_level, { level: r.cost_level, cost: cost(r.cost_id), lock: [] });
        if (r.disposable_fix_cost_id) levels.get(r.cost_level).lock.push({ level: r.disposable_fix_cost_level, cost: cost(r.disposable_fix_cost_id) });
      }
      return [...levels.values()];
    };
    return {
      gearRarity: gear.item_rare,
      slots: gear.option_slot.map((s) => s.option_slot_success_ratio / 100),
      types: [...types.values()],
      costs: { modify: costGroup(gear.option_cost), change: costGroup(gear.option_change_cost), lock: costGroup(gear.option_lock_cost) },
    };
  }

  // Item options for one Nikke's CP calculator: dolls for its weapon type, plus its favorite item.
  cpItems(c) {
    const weapon = this.shots.get(c.shot_id)?.weapon_type;
    return [...(this.dollsByWeapon.get(weapon) || []), ...(this.favoriteBp.has(c.name_code) ? [this.favoriteBp.get(c.name_code)] : [])];
  }

  // The favorite item and the skills it swaps in; skill_change_slot 1/2/3 = Skill 1 / Skill 2 / Burst.
  favoriteItem(c) {
    const f = this.favorites.get(c.name_code);
    if (!f) return null;
    return {
      name: this.text(f.name_localkey, `Favorite item ${f.id}`),
      description: this.text(f.description_localkey, ''),
      skills: f.favoriteitem_skill_group_data.filter((s) => s.favorite_skill_id)
        .sort((a, b) => a.skill_change_slot - b.skill_change_slot)
        .map((s) => ({ slot: s.skill_change_slot, levels: this.skillLevels(s.favorite_skill_id) })),
    };
  }

  // Skill descriptions carry {description_value_NN} placeholders filled per level.
  skillLevels(id) {
    const levels = [];
    for (let s = this.skills.get(id); s && levels.length < 20; s = this.skills.get(s.next_level_id)) {
      const values = s.description_value_list.map((v) => v.description_value);
      const desc = this.text(s.description_localkey, '')
        .replace(/\{description_value_(\d+)\}/g, (m, n) => values[Number(n) - 1] ?? m);
      levels.push({ level: s.skill_level, name: this.text(s.name_localkey, String(id)), description: desc });
    }
    return levels;
  }

  // Voice actresses (Locale_Character:<resource>_cv_<lang>, "CV: Name") and every look's voice lines.
  voices(c, costumes) {
    const cv = [['ko', 'Korean'], ['ja', 'Japanese'], ['en', 'English']]
      .map(([k, language]) => ({ language, name: this.text(`Locale_Character:${c.resource_id}_cv_${k}`, '').replace(/^CV\s*:\s*/i, '') }))
      .filter((x) => x.name);
    const linesOf = (index) => {
      const group = this.voiceByLook.get(`${c.resource_id}:${index}`);
      return group == null ? null : (this.voiceLines.get(group) || []).slice()
        .sort((a, b) => (this.voiceCategories.get(a.category_group)?.order ?? 99) - (this.voiceCategories.get(b.category_group)?.order ?? 99) || a.order - b.order)
        .map((g) => ({
          category: this.voiceCategories.get(g.category_group)?.name || `Category ${g.category_group}`,
          situation: this.text(g.voice_description, g.speech_id),
          text: this.text(g.speech_localkey, ''),
          bond: g.condition_attractive_level > 1 ? g.condition_attractive_level : null, // bond level needed to unlock
        }));
    };
    const looks = [{ index: 0, name: 'Default' }, ...costumes.map((k) => ({ index: k.index, name: k.name }))]
      .map((k) => ({ ...k, lines: linesOf(k.index) }));
    return { cv, looks }; // lines: null = the data has no voice group for that costume
  }

  storyLink(cat, code) {
    const group = this.stories.catalogue.find((c) => c.id === cat)?.groups.find((g) => g.id === `char${code}`);
    return group ? { first: group.scenes[0].id, count: group.scenes.length } : null;
  }

  detail(code) {
    const c = this.rows.get(code);
    if (!c) return null;
    const shot = this.shots.get(c.shot_id);
    const ulti = this.skillData.get(c.ulti_skill_id);
    const squadKey = String(c.squad || '').replace(/^_/, '').toLowerCase();
    return {
      ...this.summary(c),
      description: this.text(c.description_localkey, ''),
      portrait: art('icons-char', charRes(c)),
      squad: c.squad ? { name: this.sys(`${squadKey}_name`, c.squad.replace(/^_/, '')), info: this.sys(`squad_${squadKey}_info`, '') } : null,
      critical: { rate: c.critical_ratio / 100, damage: c.critical_damage / 100 },
      weapon: shot && {
        type: shot.weapon_type,
        typeName: this.sys(`WEAPON_TYPE_${shot.weapon_type}_NAME`, shot.weapon_type),
        name: this.text(shot.name_localkey, shot.weapon_type),
        // {damage}, {charge_time}, {full_charge_damage}, {core_damage_rate} are stored ×100.
        description: this.text(shot.description_localkey, '')
          .replace(/\{(\w+)\}/g, (m, k) => (typeof shot[k] === 'number' ? +(shot[k] / 100).toFixed(2) : m)),
        ammo: shot.max_ammo,
        reload: shot.reload_time / 100,
        damage: shot.damage / 100,
        attackType: shot.attack_type,
        // Charge weapons are the ones with a charge time (SR/RL: input UP, a few special ones DOWN_Charge).
        control: this.sys(shot.charge_time > 0 ? 'WEAPON_CONTROL_TYPE_CHARGE' : 'WEAPON_CONTROL_TYPE_NORMAL', shot.input_type),
        charge: shot.charge_time > 0 ? {
          time: shot.charge_time / 100,
          fullDamage: shot.full_charge_damage / 100,
          fullBurst: shot.full_charge_burst_energy / 100,
        } : null,
        // Burst gauge per shot, stored ×10000 (target_ = when the shot hits the target).
        burstPerShot: shot.burst_energy_pershot / 10000,
        burstPerShotTarget: shot.target_burst_energy_pershot / 10000,
        pellets: shot.shot_count,
        coreDamage: shot.core_damage_rate / 100,
        rateOfFire: shot.rate_of_fire,
        typeInfo: this.weaponInfo.get(shot.weapon_type) || null,
      },
      skills: [
        { slot: 'Skill 1', levels: this.skillLevels(c.skill1_id) },
        { slot: 'Skill 2', levels: this.skillLevels(c.skill2_id) },
        { slot: `Burst ${BURST[c.use_burst_skill] || ''}`.trim(), cooldown: ulti ? ulti.skill_cooltime / 100 : null, levels: this.skillLevels(c.ulti_skill_id) },
      ],
      costumes: this.costumes.filter((x) => x.resource_id === c.resource_id && !x.is_hidden).map((x) => ({
        index: x.costume_index,
        name: this.text(x.costume_name_locale, `Costume ${x.costume_index}`),
        description: this.text(x.costume_description_locale, ''),
        grade: x.costume_grade_id,
        portrait: art('icons-char', charRes(c, x.costume_index)),
      })),
      stories: { bond: this.storyLink('bond', code), counsel: this.storyLink('counsel', code) },
      voices: this.voices(c, this.costumes.filter((x) => x.resource_id === c.resource_id && !x.is_hidden)
        .map((x) => ({ index: x.costume_index, name: this.text(x.costume_name_locale, `Costume ${x.costume_index}`) }))),
      favorite: this.favoriteItem(c),
      cpItems: this.cpItems(c),
    };
  }
}

module.exports = { CharacterLibrary };
