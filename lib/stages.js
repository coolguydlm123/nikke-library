// Campaign chapters/stages and tower floors, with enemy waves and rewards.
const fs = require('fs');
const path = require('path');

const MODES = ['Normal', 'Hard', 'Story'];

// Reward types whose ids resolve through these tables' name_localkey.
const REWARD_TABLES = {
  Item: ['ItemConsumeTable', 'ItemMaterialTable', 'ItemPieceTable', 'ItemHarmonyCubeTable', 'ItemEquipTable'],
  ItemRandomBox: ['ItemConsumeTable'],
  Equipment: ['ItemEquipTable'],
  Character: ['Character/CharacterTable'],
  FavoriteItem: ['FavoriteItemTable'],
  CharacterCostume: ['Character/CharacterCostumeTable'],
  UserTitle: ['UserTitleTable'],
  ProfileCardObject: ['ProfileCardObjectTable'],
};

function readRecords(file) {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(json) ? json : json.records || [];
}

class StageLibrary {
  constructor({ dataDir, typesFile, mpksDir, waveSpawnDir }, locale, stories) {
    this.dataDir = dataDir;
    this.waveSpawnDir = waveSpawnDir;
    this.typesFile = typesFile;
    this.mpksDir = mpksDir;
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

  build() {
    const t0 = Date.now();
    this.chapters = this.table('CampaignChapterTable');
    this.stages = new Map(this.table('CampaignStageTable').map((s) => [s.id, s]));
    this.towerInfo = this.table('TowerInfoTable').sort((a, b) => a.order - b.order);
    this.floors = new Map(this.table('TowerTable').map((t) => [t.id, t]));
    this.rewards = new Map(this.table('RewardTable').map((r) => [r.id, r]));
    this.monsters = new Map(this.table('MonsterTable').map((m) => [m.id, m]));
    this.monsterStats = new Map(this.table('MonsterStatEnhanceTable').map((s) => [`${s.group_id}:${s.lv}`, s]));
    this.elements = new Map(this.table('ElementTable').map((e) => [e.id, this.text(e.element_name_localekey, e.element)]));
    this.loadRewardNames();
    this.loadWaves();
    this.loadSpawnIndex();
    this.catalogue = this.buildCatalogue();
    console.log(`Indexed ${this.stages.size} campaign stages, ${this.floors.size} tower floors, ${this.spawnFiles.size} spawn lists in ${Date.now() - t0} ms`);
  }

  // The dump's WaveData.GroupDict.csv lists which wave file holds each stage, so
  // wave files are only read when a stage is opened.
  loadWaves() {
    this.waveGroup = new Map();
    this.waveFiles = new Map(); // group_id -> Map(stage_id -> slim waves), small cache
    const csv = path.join(this.mpksDir || '', 'WaveData.GroupDict.csv');
    if (this.mpksDir && fs.existsSync(csv)) {
      for (const line of fs.readFileSync(csv, 'utf8').split(/\r?\n/).slice(1)) {
        const [stage, group] = line.split(',').map((s) => s.trim());
        if (stage && group) this.waveGroup.set(Number(stage), group);
      }
    } else {
      // No index available: scan the wave files once.
      const dir = path.join(this.dataDir, 'WaveDataTable');
      for (const name of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
        const group = name.replace(/^WaveDataTable\./, '').replace(/\.json$/, '');
        for (const w of readRecords(path.join(dir, name))) this.waveGroup.set(w.stage_id, group);
      }
    }
  }

  wavesFor(stageId) {
    const group = this.waveGroup.get(stageId);
    if (!group) return null;
    if (!this.waveFiles.has(group)) {
      const file = path.join(this.dataDir, 'WaveDataTable', `WaveDataTable.${group}.json`);
      const byStage = new Map();
      if (fs.existsSync(file)) {
        for (const w of readRecords(file)) {
          byStage.set(w.stage_id, {
            mode: w.spot_mod,
            battleTime: w.battle_time,
            background: w.background_name,
            theme: w.theme,
            themeTime: w.theme_time,
            targets: (w.target_list || []).filter(Boolean),
            repeat: w.wave_repeat,
            // Slots stay in place: a spawn's MonsIndex is the 1-based slot number.
            waves: (w.wave_data || [])
              .map((d) => ({ path: d.wave_path, slots: d.wave_monster_list.map((m) => m.wave_monster_id) }))
              .filter((d) => d.slots.some(Boolean)),
          });
        }
      }
      this.waveFiles.set(group, byStage);
      if (this.waveFiles.size > 20) this.waveFiles.delete(this.waveFiles.keys().next().value);
    }
    return this.waveFiles.get(group).get(stageId) || null;
  }

  // Spawn lists exported from the core wavedata bundles by nikke-downloader's wavedata.py:
  // one JSON file per wave_path, named by the TextAsset (case and spaces differ from the path).
  loadSpawnIndex() {
    this.spawnFiles = new Map();
    this.spawnCache = new Map();
    const dir = this.waveSpawnDir;
    if (!dir || !fs.existsSync(dir)) return;
    for (const name of fs.readdirSync(dir)) {
      if (name.endsWith('.txt')) this.spawnFiles.set(name.slice(0, -4).toLowerCase().replace(/\s+/g, ''), path.join(dir, name));
    }
  }

  spawnsFor(wavePath) {
    const key = (wavePath || '').toLowerCase().replace(/\s+/g, '');
    if (!this.spawnFiles.has(key)) return null;
    if (!this.spawnCache.has(key)) {
      let list = null;
      try {
        const json = JSON.parse(fs.readFileSync(this.spawnFiles.get(key), 'utf8'));
        if (Array.isArray(json)) list = json.map((x) => ({ slot: x.MonsIndex, time: x.SpawnTime }));
      } catch { /* not a spawn list */ }
      this.spawnCache.set(key, list);
    }
    return this.spawnCache.get(key);
  }

  loadRewardNames() {
    // RewardTable stores currencies as CurrencyType enum numbers; the enum lives
    // in the parser's customTypes.txt and maps to CurrencyTable's string ids.
    const currencyNames = new Map(this.table('CurrencyTable').map((c) => [c.id, c.name_localkey]));
    this.currencyNames = new Map();
    try {
      const types = JSON.parse(fs.readFileSync(this.typesFile, 'utf8'));
      for (const [num, id] of Object.entries(types['NK.StaticData.CurrencyType']?.content || {})) {
        if (currencyNames.has(id)) this.currencyNames.set(Number(num), currencyNames.get(id));
      }
    } catch (e) {
      console.warn(`Currency names unavailable: ${e.message}`);
    }
    this.rewardNames = {};
    for (const [type, tables] of Object.entries(REWARD_TABLES)) {
      const map = new Map();
      for (const t of tables) {
        for (const r of this.table(t)) {
          const key = r.name_localkey || r.name_locale_key; // UserTitleTable spells it name_locale_key
          if (key && !map.has(r.id)) map.set(r.id, key);
        }
      }
      this.rewardNames[type] = map;
    }
    // Bgm rewards are jukebox tracks, whose titles are plain strings rather than locale keys.
    this.bgmNames = new Map(this.table('JukeboxListTable').map((t) => [t.id, t.name]));
  }

  rewardName(type, id) {
    if (type === 'Currency') return this.text(this.currencyNames.get(id), `Currency ${id}`);
    if (type === 'Bgm' && this.bgmNames.has(id)) return `${this.bgmNames.get(id)} (BGM)`;
    const map = this.rewardNames[type.startsWith('Equipment_') ? 'Equipment' : type];
    return this.text(map?.get(id), `${type.replace(/_/g, ' ')} ${id}`);
  }

  buildCatalogue() {
    const stagesByChapter = new Map();
    for (const s of this.stages.values()) {
      const key = `${s.chapter_id}:${s.chapter_mod}`;
      if (!stagesByChapter.has(key)) stagesByChapter.set(key, []);
      stagesByChapter.get(key).push(s);
    }
    const chapters = this.chapters.map((c) => {
      const modes = {};
      for (const mode of MODES) {
        let ex = 0;
        const list = (stagesByChapter.get(`${c.id}:${mode}`) || []).sort((a, b) => a.id - b.id);
        if (list.length) modes[mode] = list.map((s) => this.stageSummary(s, s.stage_category === 'Extra' ? ++ex : 0));
      }
      return { id: c.id, chapter: c.chapter, name: this.text(c.name_localkey, ''), modes };
    });

    // The same stage across Normal/Hard/Story: Hard labels only add "HARD"
    // ("35-6 HARD", "35-36 HARD BOSS"), so the label without it is the key.
    this.versions = new Map(); // "<chapter id>:<base label>" -> [{ mode, id }]
    this.versionKey = new Map(); // stage id -> that key
    for (const c of chapters) {
      for (const [mode, list] of Object.entries(c.modes)) {
        for (const st of list) {
          const key = `${c.id}:${st.label.replace(/\s+HARD\b/i, '')}`;
          if (!this.versions.has(key)) this.versions.set(key, []);
          this.versions.get(key).push({ mode, id: st.id });
          this.versionKey.set(st.id, key);
        }
      }
    }

    const floorsByType = new Map();
    for (const f of this.floors.values()) {
      if (!floorsByType.has(f.type)) floorsByType.set(f.type, []);
      floorsByType.get(f.type).push(f);
    }
    const towers = this.towerInfo.map((t) => ({
      id: t.id,
      name: this.text(t.name, t.id),
      days: t.day_of_week,
      dailyLimit: t.clear_limit,
      floors: (floorsByType.get(t.id) || []).sort((a, b) => a.floor - b.floor)
        .map((f) => ({ id: f.id, floor: f.floor, lv: f.monster_stage_lv, cp: f.standard_battle_power })),
    }));
    return { chapters, towers };
  }

  stageSummary(s, exIndex) {
    const name = this.text(s.name_localkey, String(s.id));
    return {
      id: s.id,
      label: exIndex ? `EX ${exIndex}` : name.replace(/\s+STAGE$/i, ''),
      category: s.stage_category,
      lv: s.monster_stage_lv,
      cp: s.standard_battle_power,
    };
  }

  // Stat = level value from the monster's stat group at the stage's monster level,
  // scaled by the monster's own ratio: level_hp * hp_ratio / 10000 (same for ATK, DEF).
  monsterStatsAt(m, lv) {
    const row = this.monsterStats.get(`${m.statenhance_id}:${lv}`);
    if (!row) return null;
    const scale = (value, ratio) => Number((BigInt(value) * BigInt(ratio)) / 10000n);
    return {
      hp: scale(row.level_hp, m.hp_ratio),
      atk: scale(row.level_attack, m.attack_ratio),
      def: scale(row.level_defence, m.defence_ratio),
    };
  }

  monster(id, lv) {
    const m = this.monsters.get(id);
    if (!m) return { id, name: `Unknown ${id}` };
    return {
      id,
      name: this.text(m.name_localkey, String(id)),
      grade: m.ui_grade,
      element: (m.element_id || []).map((e) => this.elements.get(e)).filter(Boolean),
      stats: lv != null ? this.monsterStatsAt(m, lv) : undefined,
    };
  }

  // Each wave lists its enemies once per slot. With the wave's spawn list, `count` is how
  // many actually spawn and `from`/`to` the first and last spawn time (s); without it,
  // `count` falls back to the number of slots holding that enemy.
  enemyInfo(spotId, lv) {
    const w = this.wavesFor(spotId);
    if (!w) return null;
    const ids = new Set(w.targets);
    let spawnData = w.waves.length > 0;
    const waves = w.waves.map(({ path: wavePath, slots }) => {
      const spawns = this.spawnsFor(wavePath);
      const perWave = new Map();
      const add = (id, time) => {
        if (!id) return;
        ids.add(id);
        const e = perWave.get(id) || { count: 0, from: null, to: null };
        e.count += 1;
        if (time != null) {
          e.from = e.from == null ? time : Math.min(e.from, time);
          e.to = e.to == null ? time : Math.max(e.to, time);
        }
        perWave.set(id, e);
      };
      if (spawns) for (const sp of spawns) add(slots[sp.slot - 1], sp.time);
      if (!spawns || !perWave.size) {
        spawnData = false;
        for (const id of slots) add(id, null);
      }
      return [...perWave].map(([id, e]) => ({ ...this.monster(id), ...e }));
    });
    return {
      mode: w.mode,
      battleTime: w.battleTime,
      background: w.background,
      theme: w.theme,
      themeTime: w.themeTime,
      repeat: w.repeat,
      spawnData,
      targets: w.targets.map((id) => this.monster(id)),
      waves,
      enemies: [...ids].map((id) => this.monster(id, lv)),
    };
  }

  rewardInfo(rewardId) {
    const r = this.rewards.get(rewardId);
    if (!r) return null;
    return {
      userExp: r.user_exp,
      characterExp: r.character_exp,
      items: r.rewards.filter((x) => x.reward_type && x.reward_type !== 'None').map((x) => ({
        type: x.reward_type,
        id: x.reward_id,
        name: this.rewardName(x.reward_type, x.reward_id),
        amount: x.reward_value,
        chance: x.reward_percent / 10000,
      })),
    };
  }

  scenarioLink(id, phase) {
    if (!id) return null;
    const scene = this.stories.scenes.get(id);
    const label = scene ? this.stories.sceneLabel(scene).label : id;
    return { id, phase, label, readable: !!scene };
  }

  campaignStage(id) {
    const s = this.stages.get(id);
    if (!s) return null;
    const chapter = this.chapters.find((c) => c.id === s.chapter_id);
    const summary = this.catalogue.chapters.find((c) => c.id === s.chapter_id).modes[s.chapter_mod];
    const idx = summary.findIndex((x) => x.id === id);
    return {
      kind: 'campaign',
      id,
      label: summary[idx].label,
      crumb: ['Campaign', `Chapter ${chapter.chapter}${this.text(chapter.name_localkey) ? ` · ${this.text(chapter.name_localkey)}` : ''}`, s.chapter_mod],
      category: s.stage_category,
      lv: s.monster_stage_lv,
      cp: s.standard_battle_power,
      quickBattle: s.is_use_quick_battle,
      mode: s.chapter_mod,
      versions: this.versions.get(this.versionKey.get(id)) || [],
      prev: summary[idx - 1]?.id ?? null,
      next: summary[idx + 1]?.id ?? null,
      scenarios: [
        s.enter_scenario_type === 'Dialog' && this.scenarioLink(s.enter_scenario, 'Before battle'),
        s.exit_scenario_type === 'Dialog' && this.scenarioLink(s.exit_scenario, 'After battle'),
      ].filter(Boolean),
      battle: this.enemyInfo(s.spot_id, s.monster_stage_lv),
      reward: this.rewardInfo(s.reward_id),
    };
  }

  towerFloor(id) {
    const f = this.floors.get(id);
    if (!f) return null;
    const tower = this.catalogue.towers.find((t) => t.id === f.type);
    const idx = tower.floors.findIndex((x) => x.id === id);
    // Towers match each other by floor number.
    const versions = this.catalogue.towers.map((t) => {
      const same = t.floors.find((x) => x.floor === f.floor);
      return same && { mode: t.name.replace(/\s+Tower$/i, ''), tower: t.id, id: same.id };
    }).filter(Boolean);
    return {
      kind: 'tower',
      id,
      label: `Floor ${f.floor}`,
      crumb: ['Towers', tower.name],
      category: 'Tower',
      lv: f.monster_stage_lv,
      cp: f.standard_battle_power,
      quickBattle: f.is_use_quick_battle,
      tower: f.type,
      versions,
      prev: tower.floors[idx - 1]?.id ?? null,
      next: tower.floors[idx + 1]?.id ?? null,
      scenarios: [],
      battle: this.enemyInfo(f.spot_id, f.monster_stage_lv),
      reward: this.rewardInfo(f.reward_id),
    };
  }
}

module.exports = { StageLibrary };
