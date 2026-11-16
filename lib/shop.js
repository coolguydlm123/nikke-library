// Shop & Gacha: recruit banners (rates, pity, step rewards), season passes and the free
// newbie pass, paid / login / popup packages and login (attendance) events.
// Prices of paid products are store ids (midas_product_id) only: the data has no money amounts.
const fs = require('fs');
const path = require('path');

function readRecords(file) {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(json) ? json : json.records || [];
}

// Dates are .NET ticks stored as { s, e, c: [high, low] } (value = high * 1e14 + low).
const TICKS_AT_EPOCH = 621355968000000000;
const tickDate = (d) => {
  if (!d?.c) return null;
  const ms = (d.c[0] * 1e14 + (d.c[1] || 0) - TICKS_AT_EPOCH) / 1e4;
  return Number.isFinite(ms) && ms > 0 ? new Date(ms).toISOString().slice(0, 10) : null;
};

const GACHA_TYPES = {
  GachaPremium: 'Standard', GachaFriend: 'Social', GachaTutorial: 'Tutorial', GachaCharge: 'Charge',
  GachaPickup: 'Pick-up', GachaSelectup: 'Select-up', GachaStepup: 'Step-up', GachaGuaranteed: 'Guaranteed',
};

// Wishlist rows in GachaListProbTable have gacha_id 0: the slot is filled from the player's wishlist.
const WISHLIST = { WishlistNormal: 'Wishlist Nikke', WishlistOverspec: 'Wishlist Nikke (Overspec)' };

class ShopLibrary {
  constructor(dataDir, locale, { stages, characters }) {
    this.dataDir = dataDir;
    this.locale = locale;
    this.stages = stages; // item names, icons, box contents
    this.characters = characters;
  }

  table(name) {
    const file = path.join(this.dataDir, `${name}.json`);
    return fs.existsSync(file) ? readRecords(file) : [];
  }

  // Locale text without the game's rich-text tags (<color=#009AFF>…</color>).
  text(key, fallback = null) {
    const t = key && this.locale.get(key);
    return t ? t.replace(/<\/?(color|b|i|size)[^>]*>/g, '') : fallback;
  }

  groupBy(rows, key) {
    const map = new Map();
    for (const r of rows) {
      if (!map.has(r[key])) map.set(r[key], []);
      map.get(r[key]).push(r);
    }
    return map;
  }

  // One product or reward line: { type, id, name, icon, amount, box }.
  item(type, id, amount) {
    if (type === 'Character') {
      const c = this.charInfo(id);
      return { type, id, name: c?.name || `Character ${id}`, code: c?.code, amount };
    }
    return {
      type, id, amount,
      name: this.stages.rewardName(type, id),
      icon: this.stages.rewardIcon(type, id),
      box: (type === 'ItemRandomBox' || type === 'Item') ? this.stages.boxOf.get(id) : undefined,
    };
  }

  reward(rewardId) {
    return this.stages.rewardInfo(rewardId)?.items || [];
  }

  // CharacterTable id (one per grade) -> the Nikke's code, name and icon from the Characters section.
  charInfo(id) {
    const code = this.charCode.get(id);
    const c = code != null ? this.charByCode.get(code) : null;
    return c ? { code: c.code, name: c.name, rarity: c.rarity, icon: c.icon } : null;
  }

  build() {
    this.charCode = new Map(this.table('Character/CharacterTable').map((c) => [c.id, c.name_code]));
    this.charByCode = new Map(this.characters.list.map((c) => [c.code, c]));
    this.events = new Map(this.table('EventManagerTable').map((e) => [e.id, e]));
    this.packageGroups = this.groupBy(this.table('PackageGroupTable'), 'package_group_id');
    this.buildGacha();
    this.buildPasses();
    this.buildPackages();
    this.buildLogin();
    console.log(`Indexed shop: ${this.gacha.length} banners, ${this.passes.seasons.length} passes, ${this.packages.length} package shops, ${this.login.length} login events`);
  }

  contents(packageGroupId) {
    return (this.packageGroups.get(packageGroupId) || []).map((r) => this.item(r.product_type, r.product_id, r.product_value));
  }

  // ---------- Gacha ----------
  buildGacha() {
    const grades = this.groupBy(this.table('GachaGradeProbTable'), 'group_id');
    this.gachaLists = this.groupBy(this.table('GachaListProbTable'), 'group_id');
    this.gachaGrades = grades;
    const selectups = this.groupBy(this.table('GachaSelectupListTable'), 'gacha_type_id');
    const paybacks = this.groupBy(this.table('GachaPaybackTable'), 'gacha_id');
    const paySteps = this.groupBy(this.table('GachaPaybackStepTable'), 'payback_id');
    const pities = this.groupBy(this.table('GachaPityTable'), 'gacha_type_id');
    const pityChars = this.groupBy(this.table('GachaPityCharacterTable'), 'group_id');
    this.gachaRows = new Map(this.table('GachaTypeTable').map((g) => [g.id, g]));
    this.gachaDetail = new Map();
    this.gacha = [...this.gachaRows.values()].sort((a, b) => a.id - b.id).map((g) => {
      // Featured = SSR rows whose list holds one character (the pick-up), or the select-up choices.
      const ssr = (grades.get(g.grade_prob_id) || []).filter((r) => r.rare === 'SSR');
      let featured = ssr.map((r) => this.gachaLists.get(r.gacha_list_id) || []).filter((l) => l.length === 1 && l[0].gacha_type === 'Character').map((l) => l[0].gacha_id);
      const choices = (selectups.get(g.id) || []).sort((a, b) => a.order - b.order).map((s) => this.charInfo(s.character_id)).filter(Boolean);
      featured = [...new Set(featured)].map((id) => this.charInfo(id)).filter(Boolean);
      const prices = g.gacha_price_group.filter((p) => p.gacha_price_type).map((p) => ({
        currency: this.stages.rewardName('Currency', p.gacha_price_type),
        one: p.gacha_price_value_count_1, ten: g.gacha_provide_count_type === 'OneOnly' ? null : p.gacha_price_value_count_10,
        dailyOne: g.use_daily_discount_one ? p.daily_gacha_discount_price_value_1 || null : null,
      }));
      const ssrRate = ssr.reduce((s, r) => s + r.prob, 0) / 100;
      const payback = (paybacks.get(g.id) || []).flatMap((p) => (paySteps.get(p.id) || []).sort((a, b) => a.step - b.step)
        .map((s) => ({ step: s.step, pulls: s.gacha_count, reward: this.reward(s.reward_id) })));
      const pity = (pities.get(g.id) || []).map((p) => ({
        name: this.text(p.name_localkey, 'Pity'), pulls: p.need_gacha_count, amount: p.pity_amount, reward: p.reward_amount,
        start: tickDate(p.start_date), end: tickDate(p.end_date),
        characters: (pityChars.get(p.pity_character_group) || []).sort((a, b) => a.order - b.order).map((c) => this.charInfo(c.character_id)).filter(Boolean),
      }));
      const summary = {
        id: g.id, type: GACHA_TYPES[g.type] || g.type, order: g.order_id, eventId: g.event_id || null,
        featured: featured.length ? featured : choices.slice(0, 3), choices: choices.length, ssrRate, prices,
        pullLimit: g.gacha_play_max_count || (g.is_max_count ? g.max_ceiling_count : 0) || null,
        steps: payback.length, previous: g.previous_gacha_id || null,
      };
      this.gachaDetail.set(g.id, { ...summary, choicesList: choices, payback, pity,
        perPull: g.gacha_reward_id ? this.reward(g.gacha_reward_id) : [],
        limitReward: g.gacha_play_max_count_reward_id ? this.reward(g.gacha_play_max_count_reward_id) : [] });
      return summary;
    });
  }

  // Rates for one banner: per grade row, each list entry's share of that row
  // (row prob / 10000 × entry prob / list total). Computed on request (17k list rows).
  banner(id) {
    const d = this.gachaDetail.get(id);
    if (!d) return null;
    const g = this.gachaRows.get(id);
    const rows = (this.gachaGrades.get(g.grade_prob_id) || []).map((r) => {
      const list = this.gachaLists.get(r.gacha_list_id) || [];
      const total = list.reduce((s, x) => s + x.prob, 0);
      return {
        rare: r.rare, rate: r.prob / 100, guaranteedAt: r.prob_max_count || null,
        entries: list.map((x) => {
          const c = x.gacha_type === 'Character' ? this.charInfo(x.gacha_id) : null;
          return { kind: x.gacha_type, sub: x.gacha_sub_type, name: c?.name || WISHLIST[x.gacha_type] || `${x.gacha_type} ${x.gacha_id}`, code: c?.code, icon: c?.icon,
            rate: total ? (r.prob / 100) * (x.prob / total) : 0 };
        }).sort((a, b) => b.rate - a.rate),
      };
    });
    return { ...d, grades: rows };
  }

  // ---------- Passes ----------
  buildPasses() {
    const missions = this.groupBy(this.table('PassMissionTable'), 'pass_point_id');
    const missionList = (pointId) => (missions.get(pointId) || []).sort((a, b) => a.id - b.id).map((m) => ({
      text: this.text(m.name_localkey, m.condition_type).replace('{0}', m.condition_value),
      type: m.condition_type, value: m.condition_value,
      points: this.reward(m.reward_id).filter((x) => x.type === 'PassPoint').reduce((s, x) => s + x.amount, 0),
    }));
    const costumes = this.table('PassCostumeShopTable').map((c) => ({
      id: c.id, costume: this.stages.rewardName('CharacterCostume', c.costume_id), costumeId: c.costume_id,
      start: tickDate(c.start_date), end: tickDate(c.end_date), limit: c.buy_limit_count,
    })).sort((a, b) => (a.start || '').localeCompare(b.start || ''));
    const seasons = this.table('PassManagerTable').sort((a, b) => a.id - b.id).map((p) => {
      const start = tickDate(p.season_start_date), end = tickDate(p.season_end_date);
      return {
        id: p.id, start, end, pointId: p.pass_point_id,
        premium: this.text(p.pass_premium_name_localkey, null),
        costumes: costumes.filter((c) => c.start && start && c.start >= start && c.start < end).map((c) => c.costume),
        missions: (missions.get(p.pass_point_id) || []).length,
      };
    });
    const missionGroups = Object.fromEntries([...missions.keys()].map((k) => [k, missionList(k)]));
    // The free "newbie" passes: ranks with point thresholds and rewards, and their missions.
    const freeRanks = this.groupBy(this.table('FreeRewardPassTable'), 'pass_id');
    const freeMissions = this.groupBy(this.table('FreeRewardPassMissionTable'), 'mission_group_id');
    const free = this.table('FreeRewardPassManagerTable').map((f) => ({
      id: f.id, name: this.text(f.name_localkey, `Free pass ${f.id}`), description: this.text(f.description_localkey, ''),
      skip: { currency: this.stages.rewardName('Currency', f.rank_skip_currency_id), amount: f.rank_skip_currency_value },
      ranks: (freeRanks.get(f.id) || []).sort((a, b) => a.pass_rank - b.pass_rank)
        .map((r) => ({ rank: r.pass_rank, points: r.total_required_point, highlight: r.is_highlight, reward: this.reward(r.reward_id) })),
      missions: (freeMissions.get(f.mission_group_id) || []).sort((a, b) => a.order - b.order).map((m) => ({
        text: this.text(m.name_localkey, m.trigger_condition_type).replace('{0}', m.trigger_condition_value),
        renew: m.renew_type, points: m.point_value,
      })),
    }));
    this.passes = { seasons, missionGroups, costumes, free };
  }

  // ---------- Packages ----------
  buildPackages() {
    const shopRows = new Map(this.table('PackageShopTable').map((s) => [s.id, s]));
    const byShop = this.groupBy(this.table('PackageListTable'), 'package_shop_id');
    this.packageDetail = new Map();
    this.packages = [...byShop.entries()].sort((a, b) => a[0] - b[0]).map(([shopId, rows]) => {
      const products = rows.sort((a, b) => a.package_order - b.package_order).map((r) => {
        const s = shopRows.get(r.product_id);
        return {
          id: r.id, name: this.text(r.name_localkey, `Product ${r.id}`), active: r.is_active,
          limit: r.is_limit ? { type: r.buy_limit_type, count: r.buy_limit_count } : null,
          grade: s?.product_grade ?? null, efficiency: s?.product_efficiency ?? null, free: !!s?.is_free,
          contents: s ? this.contents(s.package_group_id) : [],
        };
      });
      this.packageDetail.set(shopId, { id: shopId, products });
      return { id: shopId, name: products[0]?.name || `Shop ${shopId}`, products: products.length, active: products.filter((p) => p.active).length,
        free: products.filter((p) => p.free).length };
    });
    // Login packages: buy once, then claim one package a day.
    const loginDays = this.groupBy(this.table('LoginPackageListTable'), 'login_group_id');
    this.loginPackages = this.table('LoginPackageShopTable').map((s) => ({
      id: s.id, name: this.text(s.name_localkey, `Login package ${s.id}`), description: this.text(s.description_localkey, ''),
      extraDays: s.extra_period, limit: { type: s.buy_limit_type, count: s.buy_limit_count },
      days: (loginDays.get(s.login_group_id) || []).sort((a, b) => a.day - b.day).map((d) => ({ day: d.day, contents: this.contents(d.package_group_id) })),
    }));
    // Popup packages: offers that pop up on a trigger (user level, chapter clear ...) for a time.
    const popupShops = this.groupBy(this.table('PopupPackageShopTable'), 'popup_package_group_id');
    const popupLists = this.groupBy(this.table('PopupPackageListTable'), 'popup_package_group_id');
    this.popups = [...popupLists.entries()].sort((a, b) => a[0] - b[0]).map(([groupId, rows]) => {
      const r = rows[0];
      const values = [...new Set(rows.map((x) => x.condition_value))].sort((a, b) => a - b);
      const shop = (popupShops.get(groupId) || [])[0];
      return {
        id: groupId, name: this.text(r.name_localkey, `Popup ${groupId}`), triggers: [...new Set(rows.map((x) => x.trigger))],
        conditions: values.length, minValue: values[0], maxValue: values[values.length - 1],
        hours: r.time_limit / 3600, grade: shop?.product_grade ?? r.product_grade, efficiency: r.product_efficiency,
        contents: shop ? this.contents(shop.package_group_id) : [],
      };
    });
  }

  package(id) {
    const d = this.packageDetail.get(id);
    return d ? { ...d, name: this.packages.find((p) => p.id === id)?.name } : null;
  }

  // ---------- Login (attendance) events ----------
  buildLogin() {
    const days = this.groupBy(this.table('LoginEventTable'), 'event_id');
    const res = new Map(this.table('LoginEventResourceTable').map((r) => [r.event_id, r]));
    this.loginDetail = new Map();
    this.login = [...days.entries()].sort((a, b) => a[0] - b[0]).map(([eventId, rows]) => {
      const e = this.events.get(eventId);
      const r = res.get(eventId);
      const summary = {
        id: eventId, name: this.text(e?.name_localkey, `Login event ${eventId}`), system: e?.event_system_type || null,
        character: r?.character_id ? this.charInfo(r.character_id) : null, days: rows.length,
        goals: rows.filter((d) => d.login_event_reward_type === 'Goal').length,
        replenish: r?.is_replenish_active ? { currency: this.stages.rewardName('Currency', r.replenish_currency), amount: r.currency_value } : null,
      };
      this.loginDetail.set(eventId, { ...summary,
        dayList: rows.sort((a, b) => a.day - b.day).map((d) => ({ day: d.day, goal: d.login_event_reward_type === 'Goal', reward: this.reward(d.reward_id) })) });
      return summary;
    });
  }

  loginEvent(id) {
    return this.loginDetail.get(id) || null;
  }
}

module.exports = { ShopLibrary, tickDate };
