// Progression: Outpost Defense passive income (with Tactics Academy boosts and
// resource cases), Simulation Room rewards, and character / Synchro Device level costs.
const fs = require('fs');
const path = require('path');

function readRecords(file) {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(json) ? json : json.records || [];
}

// CurrencyType enum values used by academy lessons and resource cases.
const RESOURCE_BY_CURRENCY = { 2000: 'credit', 1000: 'battleData', 3000: 'coreDust' };
// CurrencyTimeReward use_id on resource cases.
const RESOURCE_BY_CASE = { 1: 'credit', 2: 'battleData', 4: 'coreDust' };

// The newest main Overclock season (its reward list is the one every main season uses).
const seasonsNewestMain = (seasons) => [...seasons].sort((a, b) => b.id - a.id).find((s) => s.main_season) || seasons[0];

class ProgressionLibrary {
  constructor(dataDir, locale, stages) {
    this.dataDir = dataDir;
    this.locale = locale;
    this.stages = stages; // reward names
  }

  table(name) {
    const file = path.join(this.dataDir, `${name}.json`);
    return fs.existsSync(file) ? readRecords(file) : [];
  }

  text(key, fallback = null) {
    return (key && this.locale.get(key)) || fallback;
  }

  build() {
    this.buildOutpost();
    this.buildSimulation();
    this.buildLevels();
    console.log(`Indexed outpost (${this.outpost.levels.length} levels), simulation room, ${this.levels.length} level costs`);
  }

  rewardText(rewardId) {
    const info = this.stages.rewardInfo(rewardId);
    return info ? info.items.map((i) => `${i.name} ×${i.amount}`).join(', ') : null;
  }

  // Each OutpostBattleTable resource is an amount ×10000 earned every `time` seconds
  // (e.g. credit / time_credit), so per hour = amount * 3600 / (10000 * time).
  // Checked against the in-game Lv 712 screen (1221/M credits, 12545/M Battle Data,
  // 3328/M commander EXP, 118/H Core Dust with maxed Tactics Academy). Rates are
  // fractional, which is why the game rounds down and a case pays floor(rate * hours).
  buildOutpost() {
    const rows = this.table('OutpostBattleTable').sort((a, b) => a.battle_box_level - b.battle_box_level);
    const rate = (v, t) => (t ? (v * 3600) / (10000 * t) : 0);
    this.outpost = {
      levels: rows.map((r) => ({
        level: r.battle_box_level,
        clears: r.main_stage_clear_count, // campaign stage clears needed to reach this level
        reward: r.reward_id ? this.rewardText(r.reward_id) : null, // paid on reaching this level
        credit: rate(r.credit, r.time_credit),
        battleData: rate(r.character_exp1, r.time_charexp1),
        commanderExp: rate(r.user_exp, r.time_user_exp),
        coreDust: rate(r.character_exp2, r.time_charexp2),
        items: r.outpost_reward_list.filter((i) => i.item_type !== 'None' && i.time_sec).map((i) => ({
          name: this.stages.rewardName('Item', i.view_item_id || i.item_id),
          amount: i.item_value,
          everySec: i.time_sec,
        })),
      })),
      lessons: this.table('TacticAcademyFunctionTable').filter((f) => f.lesson_type === 'OutpostBattle').sort((a, b) => a.id - b.id).map((f) => {
        const r = f.lesson_reward[0];
        const cls = this.table('TacticAcademyClassTable').find((c) => c.id === f.group_id);
        return {
          id: f.id,
          className: this.text(cls?.name_localkey, `Class ${f.group_id}`),
          resource: RESOURCE_BY_CURRENCY[r.lesson_reward_id] || null,
          percent: r.lesson_reward_value / 100,
          text: this.text(f.function_localkey, '').replace('{0}', r.lesson_reward_value / 100),
        };
      }).filter((l) => l.resource),
      cases: this.table('ItemConsumeTable').filter((i) => i.use_type === 'CurrencyTimeReward' && RESOURCE_BY_CASE[i.use_id] && this.text(i.name_localkey))
        .sort((a, b) => a.use_id - b.use_id || a.use_value - b.use_value)
        .map((i) => ({ id: i.id, name: this.text(i.name_localkey), resource: RESOURCE_BY_CASE[i.use_id], hours: i.use_value / 3600, rarity: i.item_rare })),
      storageHours: 24,
    };
  }

  buildSimulation() {
    const difficulties = this.table('SimulationRoomDifficultyTable').filter((d) => d.id < 99999).sort((a, b) => a.id - b.id);
    const chapters = this.table('SimulationRoomChapterTable').filter((c) => c.difficulty_id < 99999);
    const ocLevels = this.table('SimulationRoomOcLevelTable');
    this.simulation = {
      difficulties: difficulties.map((d) => ({
        id: d.id,
        name: this.text(d.name_localkey, `Difficulty ${d.id}`).replace('{0}', d.id),
        chapters: chapters.filter((c) => c.difficulty_id === d.id).sort((a, b) => a.chapter - b.chapter).map((c) => ({
          chapter: c.chapter,
          recommendedPower: c.recommended_battle_power,
          stages: c.stage_value,
          overclock: c.overclock_active,
          reward: c.reward_id ? this.stages.rewardInfo(c.reward_id) : null,
        })),
      })),
      overclock: this.table('SimulationRoomOcSeasonTable').sort((a, b) => b.id - a.id).map((s) => ({
        id: s.id,
        name: this.text(s.season_name_localkey, `Season ${s.id}`),
        main: s.main_season,
        levels: ocLevels.filter((l) => l.group_id === s.overclock_level_group).length,
        penalties: this.ocPenalties(s.option_group_id),
      })),
    };
    this.buildOverclockRewards(seasonsNewestMain(this.table('SimulationRoomOcSeasonTable')), ocLevels);
  }

  // Penalty options for a season: groups in order, each with its tiers (I/II/III).
  ocPenalties(optionGroupId) {
    if (!this.ocOptions) this.ocOptions = this.table('SimulationRoomOcOptionTable');
    if (!this.ocOptionGroups) this.ocOptionGroups = this.table('SimulationRoomOcOptionGroupTable');
    return this.ocOptionGroups.filter((g) => g.season_group === optionGroupId).sort((a, b) => a.group_order - b.group_order).map((g) => ({
      order: g.group_order,
      infinite: g.infinite_option,
      tiers: this.ocOptions.filter((o) => o.group_id === g.id).sort((a, b) => a.option_overclock_level - b.option_overclock_level).map((o) => ({
        name: this.text(o.option_name_localkey, o.option_icon),
        description: this.text(o.option_desc_localkey, ''),
        level: o.option_overclock_level,
        fixed: o.fix_option,
      })),
    })).filter((g) => g.tiers.length);
  }

  // Overclock rewards are stored per season but identical across them, so they are
  // shown once (from the newest main season). Synchro Device boosts (BoostManagerTable)
  // give an extra reward per OC level (BoostBuffTable, condition_id = OC level), about half
  // the base reward; the page adds it on top.
  buildOverclockRewards(season, ocLevels) {
    const boostRows = this.table('BoostBuffTable');
    this.simulation.boosts = this.table('BoostManagerTable').sort((a, b) => a.order - b.order).map((b) => ({
      id: b.id,
      name: this.text(b.name_locale_key, `Boost ${b.id}`),
      description: this.text(b.description_locale_key, ''),
      synchroLevel: b.required_level,
      overclock: b.reward_popup_type === 'SimulationRoomOcReward',
      group: b.buff_group_id,
    }));
    const levels = season ? ocLevels.filter((l) => l.group_id === season.overclock_level_group && l.reward_id).sort((a, b) => a.overclock_level - b.overclock_level) : [];
    this.simulation.overclockRewards = levels.map((l) => ({
      level: l.overclock_level,
      reward: this.stages.rewardInfo(l.reward_id),
      // Boosted rewards keyed by BoostManager id.
      boosted: Object.fromEntries(this.simulation.boosts.filter((b) => b.overclock).map((b) => {
        const row = boostRows.find((r) => r.group_id === b.group && r.condition_type === 'SimulationRoomOcReward' && r.condition_id === l.overclock_level);
        return [b.id, row ? this.stages.rewardInfo(row.condition_value) : null];
      })),
    }));
  }

  // CharacterLevelTable: levels 1-200 are character levels (each needs a minimum
  // synchro level); 201-1400 are Synchro Device enhancement levels. Each row is the
  // cost to go from that level to the next.
  buildLevels() {
    this.levels = this.table('Character/CharacterLevelTable').sort((a, b) => a.level - b.level).map((r) => ({
      level: r.level,
      synchro: r.type === 'SynchroLevel',
      needSynchro: r.need_synchro_lv_min || 0,
      credit: r.gold,
      battleData: r.character_exp,
      coreDust: r.character_exp_2,
    }));
  }
}

module.exports = { ProgressionLibrary };
