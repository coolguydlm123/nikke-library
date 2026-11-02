// Raids: Union Raid and Solo Raid seasons, Interception and the Solo Raid Museum.
//
// Union/Solo presets list each boss once per tier (Union: wave_change_step, Solo:
// wave_order stage) and per difficulty. The catalogue folds those rows into one
// entry per boss per season, so a boss page shows every difficulty and tier.
const fs = require('fs');
const path = require('path');

function readRecords(file) {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(json) ? json : json.records || [];
}

const KINDS = {
  union: { manager: 'UnionRaidManagerTable', preset: 'UnionRaidPresetTable', label: 'Union Raid' },
  solo: { manager: 'SoloRaidManagerTable', preset: 'SoloRaidPresetTable', label: 'Solo Raid' },
};
const DIFF_ORDER = { Normal: 0, Hard: 1, Trial: 2 };
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

class RaidLibrary {
  constructor(dataDir, locale, stages) {
    this.dataDir = dataDir;
    this.locale = locale;
    this.stages = stages; // StageLibrary: waves, monster stats, rewards
  }

  table(name) {
    const file = path.join(this.dataDir, `${name}.json`);
    return fs.existsSync(file) ? readRecords(file) : [];
  }

  text(key, fallback = null) {
    return (key && this.locale.get(key)) || fallback;
  }

  build() {
    this.lvChange = new Map();
    for (const r of this.table('MonsterStageLvChangeTable')) {
      if (!this.lvChange.has(r.group)) this.lvChange.set(r.group, []);
      this.lvChange.get(r.group).push(r);
    }
    for (const list of this.lvChange.values()) list.sort((a, b) => a.step - b.step);
    this.catalogue = {};
    this.bossIndex = new Map(); // "<kind>:<season>:<boss key>" -> { kind, season, boss }
    this.presetIndex = new Map(); // "<kind>:<preset id>" -> boss index key (old links)
    this.presetRows = {};
    for (const [kind, def] of Object.entries(KINDS)) {
      const rows = this.table(def.preset);
      this.presetRows[kind] = new Map(rows.map((r) => [r.id, r]));
      const byGroup = new Map();
      for (const r of rows) {
        if (!byGroup.has(r.preset_group_id)) byGroup.set(r.preset_group_id, []);
        byGroup.get(r.preset_group_id).push(r);
      }
      const seasons = this.table(def.manager).map((m, i) => {
        const season = { id: m.id, number: i + 1, title: `Season ${i + 1}`, bosses: this.bosses(kind, byGroup.get(m.monster_preset) || []) };
        for (const b of season.bosses) {
          const key = `${kind}:${season.id}:${b.key}`;
          this.bossIndex.set(key, { kind, season, boss: b });
          for (const d of b.difficulties) for (const t of d.tiers) this.presetIndex.set(`${kind}:${t.id}`, key);
        }
        return season;
      }).filter((s) => s.bosses.length);
      this.catalogue[kind] = { label: def.label, seasons: seasons.reverse() }; // newest first
    }
    this.buildInterception();
    this.buildMuseum();
    console.log(`Indexed ${this.catalogue.union.seasons.length} Union Raid and ${this.catalogue.solo.seasons.length} Solo Raid seasons, ` +
      `${this.intercept.length} Interception and ${this.museum.length} Museum bosses`);
  }

  // Full art of a wave's target, for the landing page cards.
  bossArt(spotId) {
    const id = this.stages.wavesFor(spotId)?.targets[0];
    return id ? this.stages.monster(id).artFull || null : null;
  }

  // One entry per boss name; its difficulties (Normal/Hard/Trial) each hold their tiers.
  bosses(kind, rows) {
    const map = new Map();
    for (const r of rows) {
      const trial = kind === 'union' ? r.is_trial : r.difficulty_type === 'Trial';
      const difficulty = trial ? 'Trial' : kind === 'union' ? r.difficulty_type : 'Normal';
      const name = this.text(r.wave_name, r.wave_name);
      const key = slug(name);
      if (!map.has(key)) map.set(key, { key, name, slot: kind === 'union' ? r.wave_order : null, art: this.bossArt(r.wave), difficulties: new Map() });
      const boss = map.get(key);
      if (!boss.difficulties.has(difficulty)) boss.difficulties.set(difficulty, { difficulty, slot: kind === 'union' ? r.wave_order : null, tiers: [] });
      boss.difficulties.get(difficulty).tiers.push({ id: r.id, tier: kind === 'union' ? r.wave_change_step : r.wave_order, lv: r.monster_stage_lv });
    }
    return [...map.values()].map((b) => {
      const difficulties = [...b.difficulties.values()].sort((x, y) => DIFF_ORDER[x.difficulty] - DIFF_ORDER[y.difficulty]);
      for (const d of difficulties) d.tiers.sort((x, y) => x.tier - y.tier);
      const lvs = difficulties.flatMap((d) => d.tiers.map((t) => t.lv));
      return { ...b, difficulties, lvMin: Math.min(...lvs), lvMax: Math.max(...lvs) };
    }).sort((x, y) => (x.slot ?? 0) - (y.slot ?? 0));
  }

  // Battle details for a wave at two levels: enemies carry stats at the lowest and
  // highest tier so the page can show how they scale.
  battleRange(spotId, lvLo, lvHi) {
    const lo = this.stages.enemyInfo(spotId, lvLo);
    if (!lo) return null;
    const hi = lvHi !== lvLo ? this.stages.enemyInfo(spotId, lvHi) : lo;
    const hiById = new Map(hi.enemies.map((e) => [e.id, e.stats]));
    return { ...lo, lvLo, lvHi, enemies: lo.enemies.map((e) => ({ ...e, statsHi: hiById.get(e.id) || e.stats })) };
  }

  bossDetail(kind, seasonId, bossKey) {
    const entry = this.bossIndex.get(`${kind}:${seasonId}:${bossKey}`);
    if (!entry) return null;
    const { season, boss } = entry;
    const rows = this.presetRows[kind];
    let description = '';
    const difficulties = boss.difficulties.map((d) => {
      const tiers = d.tiers.map((t) => {
        const r = rows.get(t.id);
        if (!description) description = this.text(r.wave_description, '');
        const info = this.stages.enemyInfo(r.wave, r.monster_stage_lv);
        const targetId = info?.targets[0]?.id;
        const rewards = (kind === 'solo'
          ? [['First clear', r.first_clear_reward_id], ['Clear', r.reward_id]]
          : [['Clear', r.reward_id]])
          .map(([label, id]) => ({ label, reward: id ? this.stages.rewardInfo(id) : null }))
          .filter((x) => x.reward);
        return {
          tier: t.tier,
          lv: r.monster_stage_lv,
          wave: r.wave,
          target: targetId ? this.stages.monster(targetId, r.monster_stage_lv) : null,
          targetId,
          hpGroup: r.monster_stage_lv_change_group || null,
          rewards,
        };
      });
      // Tiers with HP stages (e.g. trial bosses), grouped by their stage table.
      const hpStageSets = [];
      for (const t of tiers.filter((x) => x.hpGroup)) {
        let set = hpStageSets.find((x) => x.group === t.hpGroup);
        if (!set) hpStageSets.push(set = { group: t.hpGroup, tiers: [], stages: this.hpStages(t.hpGroup, t.targetId) });
        set.tiers.push(t.tier);
      }
      // Tiers almost always share one wave; group them in case they don't.
      const waves = [];
      for (const t of tiers) {
        let w = waves.find((x) => x.wave === t.wave);
        if (!w) waves.push(w = { wave: t.wave, tiers: [] });
        w.tiers.push(t);
      }
      return {
        difficulty: d.difficulty,
        slot: d.slot,
        tiers: tiers.map(({ targetId, hpGroup, ...t }) => ({ ...t, hasHpStages: !!hpGroup })),
        hpStages: hpStageSets.filter((x) => x.stages),
        battles: waves.map((w) => ({
          tiers: w.tiers.map((t) => t.tier),
          battle: this.battleRange(w.wave, w.tiers[0].lv, w.tiers[w.tiers.length - 1].lv),
        })),
      };
    });
    return {
      kind,
      kindLabel: KINDS[kind].label,
      tierLabel: kind === 'solo' ? 'Stage' : 'Tier',
      season: { id: season.id, number: season.number, title: season.title },
      boss: { key: boss.key, name: boss.name, slot: boss.slot },
      description,
      difficulties,
    };
  }

  // HP stages from MonsterStageLvChangeTable: each step covers a window of damage
  // dealt to the target, so the step's real HP is the window's size; the boss
  // switches to the step's level (and stats) when it starts. The last step is open.
  hpStages(groupId, targetId, rewardBands = [], bonusBandLists = []) {
    const rows = (this.lvChange.get(groupId) || []);
    if (!rows.length) return null;
    return rows.map((s) => {
      const open = !s.condition_value_max;
      const stats = targetId ? this.stages.monster(targetId, s.monster_stage_lv).stats : null;
      const band = rewardBands.find((b) => b.min === s.condition_value_min);
      return {
        step: s.step,
        from: s.condition_value_min,
        to: open ? null : s.condition_value_max,
        hp: open ? null : s.condition_value_max - s.condition_value_min + (s.condition_value_min === 0 ? 0 : 1),
        lv: s.monster_stage_lv,
        atk: stats?.atk ?? null,
        def: stats?.def ?? null,
        passive: s.target_passive_skill_id || null,
        reward: band ? band.reward : null,
        // Bonus (chance-based) reward groups use the same thresholds.
        bonus: bonusBandLists.map((list) => list.find((b) => b.min === s.condition_value_min)?.reward || null),
      };
    });
  }

  // Old links pointed at a single preset row; map them to their boss page.
  bossForPreset(kind, presetId) {
    const key = this.presetIndex.get(`${kind}:${presetId}`);
    if (!key) return null;
    const { season, boss } = this.bossIndex.get(key);
    return { season: season.id, boss: boss.key };
  }

  // Damage-band rewards (ConditionRewardTable groups).
  conditionRewards(groupId) {
    if (!groupId) return [];
    return (this.conditionGroups.get(groupId) || []).map((c) => ({
      min: c.value_min,
      max: c.value_max || null,
      type: c.type,
      reward: this.stages.rewardInfo(c.reward_id),
    }));
  }

  buildInterception() {
    this.conditionGroups = new Map();
    for (const c of this.table('ConditionRewardTable')) {
      if (!this.conditionGroups.has(c.group)) this.conditionGroups.set(c.group, []);
      this.conditionGroups.get(c.group).push(c);
    }
    for (const list of this.conditionGroups.values()) list.sort((a, b) => a.priority - b.priority || a.value_min - b.value_min);

    // Group 1 rows are the regular battles; other groups reuse the bosses as minigame events.
    const tiers = [
      ['normal', 'Normal Interception', 'InterceptNormalTable'],
      ['special', 'Special Interception', 'InterceptSpecialTable'],
      ['anomalous', 'Anomalous Interception', 'InterceptAnomalousTable'],
    ];
    this.intercept = [];
    const groups = [];
    for (const [id, title, table] of tiers) {
      const rows = this.table(table).filter((r) => r.spot_type === 'WaveData').sort((a, b) => a.order - b.order);
      const bosses = rows.map((r) => {
        const boss = {
          key: `${id}-${r.id}`,
          name: this.text(r.name, String(r.id)),
          short: this.text(r.short_name, null),
          art: this.bossArt(r.spot_id),
          lvMin: r.monster_stage_lv,
          lvMax: r.monster_stage_lv,
          row: r,
          tier: title,
        };
        this.intercept.push(boss);
        return boss;
      });
      if (bosses.length) groups.push({ id, title, bosses: bosses.map(({ row, ...b }) => b) });
    }
    this.catalogue.intercept = { label: 'Interception', seasons: groups };
  }

  interceptDetail(key) {
    const boss = this.intercept.find((b) => b.key === key);
    if (!boss) return null;
    const r = boss.row;
    const extraGroups = [r.percent_condition_reward_group, ...(r.percent_condition_reward_groups || []).map((g) => g.percent_condition_reward_group)].filter(Boolean);
    const battle = this.stages.enemyInfo(r.spot_id, r.monster_stage_lv);
    const damageRewards = this.conditionRewards(r.condition_reward_group);
    const bonusRewards = extraGroups.map((g) => this.conditionRewards(g)).filter((l) => l.length);
    // HP stages share their thresholds with the damage and bonus reward bands, so each step carries both.
    const hpStages = this.hpStages(r.monster_stage_lv_change_group, battle?.targets[0]?.id, damageRewards, bonusRewards);
    const covered = (bands) => hpStages && bands.every((b) => hpStages.some((s) => s.from === b.min));
    return {
      kind: 'intercept',
      kindLabel: 'Interception',
      group: boss.tier,
      boss: { key: boss.key, name: boss.name },
      description: this.text(r.description, ''),
      lv: r.monster_stage_lv,
      characterLv: r.character_lv || r.limit_character_lv || null,
      tickets: r.ticket_count,
      battle,
      hpStages,
      // Bands not matched to a stage still show in their own tables.
      damageRewards: covered(damageRewards) ? [] : damageRewards,
      extraRewards: bonusRewards.filter((l) => !covered(l)),
    };
  }

  buildMuseum() {
    const halls = new Map(this.table('MuseumGroupTable').map((g) => [g.id, this.text(g.group_name, `Hall ${g.id}`)]));
    const soloSeason = new Map(this.table(KINDS.solo.manager).map((m, i) => [m.id, i + 1]));
    this.museumModes = this.table('MuseumStageModeTable');
    this.museumMissions = this.table('MuseumMissionTable');
    this.museum = this.table('MuseumStageTable').sort((a, b) => a.id - b.id).map((s) => {
      const modes = this.museumModes.filter((m) => m.stage_id === s.id);
      const lvs = modes.map((m) => m.monster_stage_lv);
      return {
        art: modes[0] ? this.bossArt(modes[0].wave) : null,
        key: `museum-${s.id}`,
        name: this.text(s.stage_name, String(s.id)),
        hall: halls.get(s.group_id) || `Hall ${s.group_id}`,
        soloSeason: soloSeason.get(s.solo_raid_manager_id) || null,
        lvMin: Math.min(...lvs),
        lvMax: Math.max(...lvs),
        row: s,
      };
    });
    const groups = [...new Set(this.museum.map((b) => b.hall))].map((hall) => ({
      id: slug(hall), title: hall, bosses: this.museum.filter((b) => b.hall === hall).map(({ row, ...b }) => b),
    }));
    this.catalogue.museum = { label: 'Solo Raid Museum', seasons: groups };
  }

  museumDetail(key) {
    const boss = this.museum.find((b) => b.key === key);
    if (!boss) return null;
    const s = boss.row;
    const soloMgr = s.solo_raid_manager_id;
    const soloSeasonId = soloMgr && this.catalogue.solo.seasons.find((x) => x.id === soloMgr) ? soloMgr : null;
    const soloBoss = soloSeasonId && this.catalogue.solo.seasons.find((x) => x.id === soloMgr).bosses[0];
    const modes = this.museumModes.filter((m) => m.stage_id === s.id).map((m) => {
      const battle = this.stages.enemyInfo(m.wave, m.monster_stage_lv);
      return {
      mode: m.mode_type === 'NoLimit' ? 'No Limit' : m.mode_type,
      lv: m.monster_stage_lv,
      characterLv: m.character_lv || null,
      battle,
      hpStages: this.hpStages(m.monster_stage_lv_change_group, battle?.targets[0]?.id),
      missions: this.museumMissions.filter((x) => x.stage_id === s.id && x.mode_type === m.mode_type).sort((a, b) => a.order - b.order).map((x) => ({
        description: this.text(x.mission_desc, x.condition_type).replace('{0}', Number(x.condition_value).toLocaleString('en-US')),
        rankingPoints: x.ranking_point_amount,
        reward: this.stages.rewardInfo(x.reward_id),
      })),
      };
    });
    return {
      kind: 'museum',
      kindLabel: 'Solo Raid Museum',
      group: boss.hall,
      boss: { key: boss.key, name: boss.name },
      soloRaid: soloBoss ? { season: soloSeasonId, number: boss.soloSeason, boss: soloBoss.key } : null,
      modes,
    };
  }
}

module.exports = { RaidLibrary };
