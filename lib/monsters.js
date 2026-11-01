// Monsters: one entry per monster model (MonsterModelTable, the rig and its art), holding
// every MonsterTable variant built on it (element codes, raid and event versions), their
// skills, parts and where each variant spawns (no stats: left out on purpose).
//
// "Where it spawns" needs every wave file read once (~110 MB), so the index is built on
// the first request rather than at startup.
const fs = require('fs');
const path = require('path');
const { monsterArt } = require('./art');

function readRecords(file) {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(json) ? json : json.records || [];
}

const GRADE_ORDER = ['Boss', 'Centurion', 'Elite', 'Minion', 'Thrash'];
const TOWER_GAP = 25;
const UI_GRADE_ORDER =['Queen', 'Heretic', 'Tyrant', 'Lord', 'Master', 'Servant', 'Selfless'];
// Prefab suffixes that are element codes.
const CODES = { hsta: 'H.S.T.A.', psid: 'P.S.I.D.', anmi: 'A.N.M.I.', zeus: 'Z.E.U.S.', dmtr: 'D.M.T.R.' };
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

class MonsterLibrary {
  constructor(dataDir, locale, { stages, raids }) {
    this.dataDir = dataDir;
    this.locale = locale;
    this.stages = stages; // monsters, models, elements, campaign/tower catalogue
    this.raids = raids;   // raid presets, Interception and Museum rows
  }

  table(name) {
    const file = path.join(this.dataDir, `${name}.json`);
    return fs.existsSync(file) ? readRecords(file) : [];
  }

  text(key, fallback = null) {
    return (key && this.locale.get(key)) || fallback;
  }

  build() {
    const { monsters, monsterModels } = this.stages;
    this.elementRows = new Map(this.table('ElementTable').map((e) => [e.id, e]));
    this.skills = new Map(this.table('MonsterSkillTable').map((s) => [s.id, s]));
    this.parts = new Map();
    for (const p of this.table('MonsterPartsTable')) {
      if (!this.parts.has(p.monster_model_id)) this.parts.set(p.monster_model_id, []);
      this.parts.get(p.monster_model_id).push(p);
    }

    const byModel = new Map();
    for (const m of monsters.values()) {
      if (!byModel.has(m.monster_model_id)) byModel.set(m.monster_model_id, []);
      byModel.get(m.monster_model_id).push(m);
    }
    this.models = new Map();
    for (const [modelId, rows] of byModel) {
      const model = monsterModels.get(modelId) || { id: modelId, mon_prefab: null };
      rows.sort((a, b) => a.id - b.id);
      const names = new Map();
      for (const r of rows) {
        const n = this.text(r.appearance_localkey) || this.text(r.name_localkey);
        if (n && !/^\d+$/.test(n)) names.set(n, (names.get(n) || 0) + 1);
      }
      const name = [...names].sort((a, b) => b[1] - a[1])[0]?.[0] || model.mon_prefab || String(modelId);
      const codes = [...new Set(rows.map((r) => this.code(r)).filter(Boolean))];
      const uiGrades = [...new Set(rows.map((r) => r.ui_grade))].sort((a, b) => UI_GRADE_ORDER.indexOf(a) - UI_GRADE_ORDER.indexOf(b));
      this.models.set(modelId, {
        id: modelId,
        name,
        prefab: model.mon_prefab,
        grade: model.grade || 'Unknown',
        generation: model.monster_generation === 'DarkMatter' ? 'Dark Matter' : 'Rapture',
        attribute: model.attribute,
        size: model.size,
        move: model.move_type,
        role: model.class,
        icon: monsterArt(model.mon_prefab, 'si') || monsterArt(model.mon_prefab, 'full'),
        art: monsterArt(model.mon_prefab, 'full') || monsterArt(model.mon_prefab, 'si'),
        uiGrades,
        codes,
        elements: [...new Set(rows.flatMap((r) => this.elementNames(r.element_id)))],
        rows,
      });
    }
    // Models that share a name (bbg004_dmtr, bbg004_golden ...) are told apart by their prefab suffix.
    const byName = new Map();
    for (const m of this.models.values()) {
      if (!byName.has(m.name)) byName.set(m.name, []);
      byName.get(m.name).push(m);
    }
    for (const list of byName.values()) {
      if (list.length < 2) continue;
      for (const m of list) {
        const suffix = (m.prefab || '').replace(/^[a-z]+\d+_?/, '');
        m.variant = suffix ? suffix.split('_').map((w) => CODES[w] || cap(w)).join(' ') : null;
      }
    }
    this.list = [...this.models.values()]
      .sort((a, b) => GRADE_ORDER.indexOf(a.grade) - GRADE_ORDER.indexOf(b.grade) || a.name.localeCompare(b.name) || a.id - b.id)
      .map(({ rows, art: _art, ...m }) => ({ ...m, variants: rows.length }));
    this.appearances = null;
    console.log(`Indexed ${this.models.size} monster models (${monsters.size} monsters)`);
  }

  elementNames(ids) {
    return (ids || []).map((e) => this.stages.elements.get(e)).filter(Boolean);
  }

  // "Code: H.S.T.A." from the monster's description (base monsters have none).
  code(r) {
    const d = this.text(r.description_localkey, '');
    const m = d.match(/Code:\s*([^\n]+)/);
    return m ? m[1].trim() : null;
  }

  // ---- where each monster spawns -------------------------------------------------------

  // spot (wave) id -> [source]: every place the game starts a battle from a spot id.
  spotSources() {
    const spots = new Map();
    const add = (spot, src) => {
      if (!spot) return;
      if (!spots.has(spot)) spots.set(spot, []);
      spots.get(spot).push(src);
    };
    // Campaign stages and tower floors (labels from the Stages catalogue).
    const stageLabel = new Map();
    for (const c of this.stages.catalogue.chapters) {
      for (const [mode, list] of Object.entries(c.modes)) {
        for (const s of list) stageLabel.set(s.id, { chapter: c.chapter, mode, label: s.label, category: s.category });
      }
    }
    for (const s of this.stages.stages.values()) {
      const l = stageLabel.get(s.id);
      if (l) add(s.spot_id, { kind: 'campaign', group: `Chapter ${l.chapter} · ${l.mode}`, label: l.label, href: `#/stage/campaign/${s.id}`, lv: s.monster_stage_lv, boss: l.category === 'Boss' });
    }
    for (const t of this.stages.catalogue.towers) {
      for (const f of t.floors) add(this.stages.floors.get(f.id).spot_id, { kind: 'tower', group: t.name, floor: f.floor, href: `#/stage/tower/${f.id}`, lv: f.lv });
    }
    // Union / Solo Raid presets, Interception, Museum.
    for (const kind of ['union', 'solo']) {
      const label = kind === 'union' ? 'Union Raid' : 'Solo Raid';
      for (const r of this.raids.presetRows[kind].values()) {
        const key = this.raids.presetIndex.get(`${kind}:${r.id}`);
        const entry = key && this.raids.bossIndex.get(key);
        if (!entry) continue;
        add(r.wave, { kind: 'raid', group: label, label: `Season ${entry.season.number} · ${entry.boss.name}`,
          href: `#/raid/${kind}/${entry.season.id}/${entry.boss.key}`, lv: r.monster_stage_lv });
      }
    }
    for (const b of this.raids.intercept) {
      add(b.row.spot_id, { kind: 'raid', group: 'Interception', label: `${b.tier.replace(/ Interception$/, '')} · ${b.name}`, href: `#/raid/intercept/${b.key}`, lv: b.row.monster_stage_lv });
    }
    for (const m of this.raids.museumModes) {
      const b = this.raids.museum.find((x) => x.row.id === m.stage_id);
      if (b) add(m.wave, { kind: 'raid', group: 'Solo Raid Museum', label: `${b.name} · ${m.mode_type === 'NoLimit' ? 'No Limit' : m.mode_type}`, href: `#/raid/museum/${b.key}`, lv: m.monster_stage_lv });
    }
    // Modes the library has no pages for yet: listed by name only.
    const lostSectors = new Map(this.table('LostSectorTable').map((s) => [s.sector, this.text(s.name_localkey, `Sector ${s.sector}`)]));
    for (const s of this.table('LostSectorStageTable')) {
      add(s.spot_id, { kind: 'other', group: 'Lost Sector', label: `${lostSectors.get(s.sector) || `Sector ${s.sector}`} · ${this.text(s.name_localkey, s.id)}`, lv: s.monster_stage_lv });
    }
    const eventNames = this.eventDungeonNames();
    const eventSpots = new Set();
    for (const table of ['EventDungeonSpotBattleTable', 'ArchiveEventDungeonSpotBattleTable']) {
      for (const s of this.table(table)) {
        if (eventSpots.has(s.spot_id)) continue; // archives replay the same stages
        eventSpots.add(s.spot_id);
        const ev = eventNames.get(s.id);
        add(s.spot_id, { kind: 'event', group: ev?.event || 'Event stages', label: `${ev?.difficulty ? `${ev.difficulty} ` : ''}${this.text(s.short_name, String(s.id))}`, lv: s.monster_stage_lv });
      }
    }
    for (const s of this.table('EventQuestStageTable')) add(s.spot_id, { kind: 'event', group: 'Event quests', label: this.text(s.name_localkey, String(s.id)), lv: s.monster_stage_lv });
    for (const s of this.table('FavoriteItemQuestStageTable')) add(s.spot_id, { kind: 'other', group: 'Favorite item quests', label: this.text(s.name_localkey, String(s.id)), lv: s.monster_stage_lv });
    for (const s of this.table('SimulationRoomBattleEventTable')) add(s.spot_id, { kind: 'other', group: 'Simulation Room', label: `Difficulty ${s.difficulty_condition_value} · Sector ${s.chapter_condition_value}`, lv: s.monster_stage_lv });
    for (const s of this.table('MultiRaidTable')) {
      for (const spot of [s.spot_id, s.spot_id_easy]) add(spot, { kind: 'raid', group: 'Co-op raids', label: this.text(s.name, `Co-op ${s.id}`), lv: s.monster_stage_lv });
    }
    for (const s of this.table('ShootingRangeTable')) add(s.spot_id, { kind: 'other', group: 'Shooting range', label: this.text(s.name_localkey, s.shooting_range_type), lv: s.monster_stage_lv });
    return spots;
  }

  // Event dungeon battle id -> { event, difficulty }: battle -> stage group -> difficulty ->
  // dungeon -> story event (EventStoryTable dungeon_id_1/2) -> EventManagerTable name.
  eventDungeonNames() {
    const events = new Map(this.table('EventManagerTable').map((e) => [e.id, this.text(e.name_localkey)]));
    const dungeonEvent = new Map();
    for (const s of this.table('EventStoryTable')) {
      [s.dungeon_id_1, s.dungeon_id_2].forEach((d, i) => {
        if (d && events.get(s.event_id)) dungeonEvent.set(d, `${events.get(s.event_id)}${s.dungeon_id_2 ? ` · Part ${i + 1}` : ''}`);
      });
    }
    const groupEvent = new Map(this.table('EventDungeonTable').map((d) => [d.difficult_group, dungeonEvent.get(d.id)]));
    const stageGroup = new Map();
    for (const d of this.table('EventDungeonDifficultTable')) {
      stageGroup.set(d.stage_group, { event: groupEvent.get(d.group), difficulty: this.text(d.name, '') });
    }
    const out = new Map();
    for (const s of this.table('EventDungeonStageTable')) {
      const g = stageGroup.get(s.group);
      if (g?.event) out.set(s.stage_id, g);
    }
    return out;
  }

  // monster id -> Set(spot id), from every wave file's targets and slots.
  buildAppearances() {
    const t0 = Date.now();
    const sources = this.spotSources();
    const dir = path.join(this.dataDir, 'WaveDataTable');
    this.appearances = new Map();
    for (const name of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
      for (const w of readRecords(path.join(dir, name))) {
        const srcs = sources.get(w.stage_id);
        if (!srcs) continue;
        const ids = new Set((w.target_list || []).filter(Boolean));
        for (const d of w.wave_data || []) for (const m of d.wave_monster_list || []) if (m.wave_monster_id) ids.add(m.wave_monster_id);
        for (const id of ids) {
          if (!this.appearances.has(id)) this.appearances.set(id, []);
          this.appearances.get(id).push(...srcs);
        }
      }
    }
    // Spawn counts per model for the list.
    for (const m of this.list) {
      const kinds = {};
      for (const r of this.models.get(m.id).rows) {
        for (const a of this.appearances.get(r.id) || []) kinds[a.kind] = (kinds[a.kind] || 0) + 1;
      }
      m.appears = kinds;
    }
    console.log(`Indexed monster spawns in ${Date.now() - t0} ms`);
  }

  catalogue() {
    if (!this.appearances) this.buildAppearances();
    return this.list;
  }

  // Groups a variant's spawns: campaign stages per chapter, tower floors as level ranges
  // per tower, the rest per group with duplicates removed.
  appearanceGroups(id) {
    const groups = new Map();
    for (const a of this.appearances.get(id) || []) {
      const key = `${a.kind}:${a.group}`;
      if (!groups.has(key)) groups.set(key, { kind: a.kind, group: a.group, items: [] });
      groups.get(key).items.push(a);
    }
    return [...groups.values()].map((g) => {
      if (g.kind === 'tower') {
        const floors = [...new Map(g.items.map((a) => [a.floor, a])).values()].sort((a, b) => a.floor - b.floor);
        // Floors within TOWER_GAP of each other form one range, linked to its first floor.
        const ranges = [];
        for (const f of floors) {
          const last = ranges[ranges.length - 1];
          if (last && f.floor - last.to <= TOWER_GAP) { last.to = f.floor; last.lvTo = f.lv; last.n += 1; } else ranges.push({ from: f.floor, to: f.floor, lv: f.lv, lvTo: f.lv, n: 1, href: f.href });
        }
        return { kind: g.kind, group: g.group, count: floors.length, items: ranges.map((r) => ({
          label: r.from === r.to ? `Floor ${r.from}` : `Floors ${r.from}–${r.to}${r.n < r.to - r.from + 1 ? ` (${r.n})` : ''}`,
          href: r.href, lv: r.lv === r.lvTo ? r.lv : `${r.lv}–${r.lvTo}`,
        })) };
      }
      const seen = new Map();
      for (const a of g.items) {
        const k = `${a.label}|${a.href || ''}`;
        const prev = seen.get(k);
        if (!prev) seen.set(k, { label: a.label, href: a.href || null, lv: a.lv, lvTo: a.lv, boss: a.boss || undefined });
        else { prev.lv = Math.min(prev.lv, a.lv); prev.lvTo = Math.max(prev.lvTo, a.lv); }
      }
      const items = [...seen.values()].map(({ lvTo, ...x }) => ({ ...x, lv: x.lv === lvTo ? x.lv : `${x.lv}–${lvTo}` }));
      return { kind: g.kind, group: g.group, count: items.length, items };
    }).sort((a, b) => ['campaign', 'tower', 'raid', 'event', 'other'].indexOf(a.kind) - ['campaign', 'tower', 'raid', 'event', 'other'].indexOf(b.kind)
      || a.group.localeCompare(b.group, 'en', { numeric: true }));
  }

  // ---- monster page ---------------------------------------------------------------------

  skill(id) {
    const s = this.skills.get(id);
    if (!s) return null;
    return {
      id,
      name: this.text(s.name_localkey),
      description: this.text(s.description_localkey, ''),
      weapon: s.weapon_type,
      damage: s.attack_type,
      fire: s.fire_type,
      shots: s.shot_count,
      value: s.skill_value_type_01 === 'Percent' ? `${s.skill_value_01 / 100}%` : s.skill_value_01 || null,
      interceptable: s.is_destroyable_projectile || undefined,
    };
  }

  detail(modelId) {
    const model = this.models.get(modelId);
    if (!model) return null;
    if (!this.appearances) this.buildAppearances();
    const skills = {};
    const variants = model.rows.map((r) => {
      const ids = (r.skill_data || []).map((d) => d.skill_id).filter(Boolean);
      for (const id of ids) if (!(id in skills)) skills[id] = this.skill(id);
      const named = ids.filter((id) => skills[id]?.name);
      const elements = this.elementNames(r.element_id);
      const weak = (r.element_id || []).map((e) => this.elementRows.get(e)?.weak_element_id).map((e) => this.stages.elements.get(e)).filter(Boolean);
      return {
        id: r.id,
        name: this.text(r.name_localkey, String(r.id)),
        code: this.code(r),
        description: this.text(r.description_localkey, ''),
        uiGrade: r.ui_grade,
        elements,
        weakTo: weak,
        irregular: r.is_irregular || undefined,
        passive: r.passive_skill_id || null,
        skills: named,
        hiddenSkills: ids.length - named.length,
        appearances: this.appearanceGroups(r.id),
      };
    });
    for (const id of Object.keys(skills)) if (!skills[id]?.name) delete skills[id];
    const parts = (this.parts.get(modelId) || []).filter((p) => p.is_main_part || p.parts_name_localkey);
    const seenParts = new Set();
    return {
      id: model.id,
      name: model.name,
      variant: model.variant || null,
      prefab: model.prefab,
      grade: model.grade,
      generation: model.generation,
      attribute: model.attribute,
      size: model.size,
      move: model.move,
      role: model.role,
      art: model.art,
      icon: model.icon,
      uiGrades: model.uiGrades,
      codes: model.codes,
      elements: model.elements,
      variants,
      skills,
      parts: parts.map((p) => ({
        type: p.parts_type.replace(/_/g, ' '),
        name: this.text(p.parts_name_localkey, p.is_main_part ? 'Body' : p.parts_type.replace(/_/g, ' ')),
        main: p.is_main_part,
        hp: p.hp_ratio,
        damageHp: p.damage_hp_ratio,
        breakable: p.is_parts_damage_able,
        visibleHp: p.visible_hp,
      })).filter((p) => {
        const k = `${p.type}|${p.name}|${p.hp}|${p.damageHp}`;
        if (seenParts.has(k)) return false;
        seenParts.add(k);
        return true;
      }),
      // Same-name rigs (Alteisen, Alteisen Golden ...).
      related: this.list.filter((m) => m.name === model.name && m.id !== model.id).map((m) => ({ id: m.id, name: m.name, variant: m.variant, icon: m.icon })),
    };
  }

  // Monster id -> its model page, for links from other sections.
  modelOf(monsterId) {
    return this.stages.monsters.get(monsterId)?.monster_model_id ?? null;
  }
}

module.exports = { MonsterLibrary };
