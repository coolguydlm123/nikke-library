// Rebuild Eden (EventRebuildEden*, the 3rd-anniversary event): a city builder. Construct
// facilities on the floors of Eden: power plants feed power to neighbouring tiles,
// collectors produce Construction / Upgrade / Special Materials, dorms and offices let you
// hire units and form squads, and squads go on dispatch missions for more materials. A
// chain of 23 Main Missions unlocks new facilities, units and dispatches.
//
// Units: times are in 1/100 s (daily_timer 18000 = the 3-minute in-game day the help text
// describes). Percent effects are per 10,000 (500 = 5%); power and material effects are
// plain amounts. Reward ids in quests and dispatches point into EventRebuildEdenRewardTable
// (an item with a min–max amount; max 0 = exactly min).

const n = (v) => Number(v).toLocaleString('en-US');
const pct = (v) => `${+(v / 100).toFixed(2)}%`;
const sec = (cs) => {
  const s = cs / 100;
  return s >= 60 ? `${+(s / 60).toFixed(1)} min` : `${+s.toFixed(1)} s`;
};
const fill = (s, args) => String(s).replace(/\{(\d)\}/g, (_, i) => (args[i] != null ? args[i] : ''));

// Effects whose value is a plain amount; every other effect is a per-10,000 percentage.
const FLAT = new Set(['AddBasicElectronicsAmount', 'DecreaseSideElectronicsRequirementAmount', 'DecreaseElectronicsRequirementAmount',
  'DecreaseRequirementAmount', 'IncreaseProductionAmount', 'IncreaseBuildElectronics', 'IncreaseRequirementAmount']);
// Power plant range by its range value, from the "Power Plant Range" help page.
const POWER_RANGE = { 1: '2 tiles left and right', 2: '3 tiles left and right', 3: 'a fan-shaped area', 4: 'all directions' };
const CATEGORY = { Electrics: 'Power', Production: 'Production', Force: 'Squad', Etc: 'Special' };
const DISPATCH_CAT = { Materials_Build: 'Construction', Materials_Enhancement: 'Upgrade', Materials_Special: 'Special' };

function build(ctx) {
  const managers = ctx.table('EventRebuildEdenManagerTable');
  const m = managers.find((x) => x.minigame_type === 'Normal') || managers[0];
  const arcade = managers.find((x) => x.minigame_type === 'Arcade');
  const group = m.event_group;

  // ---- Items ----
  const items = ctx.table('EventRebuildEdenItemTable');
  const itemById = new Map(items.map((i) => [i.id, i]));
  const itemName = (id) => ctx.plain(itemById.get(id)?.locale_name, `Item ${id}`);
  const itemCell = (id, amount) => (itemById.get(id)
    ? { img: ctx.img(itemById.get(id).resource_id), caption: `${itemName(id)}${amount != null ? ` ×${amount}` : ''}`, size: 'small' }
    : { text: `Item ${id}${amount != null ? ` ×${amount}` : ''}` });
  const costCells = (list, idKey, amtKey) => (list || []).filter((c) => c[idKey] && c[amtKey]).map((c) => itemCell(c[idKey], n(c[amtKey])));

  // ---- Effects ----
  const effects = new Map(ctx.table('EventRebuildEdenEffectTable').map((e) => [e.effecttype.toLowerCase(), e]));
  const effectText = (type, value) => {
    if (!type || type === 'None') return null;
    const e = effects.get(type.toLowerCase());
    const shown = FLAT.has(type) ? n(value) : +(value / 100).toFixed(2);
    return e ? fill(ctx.plain(e.desc_locale, type), [shown]) : `${type} ${shown}`;
  };
  const effectCell = (type, value) => {
    const text = effectText(type, value);
    if (!text) return null;
    const e = effects.get(type.toLowerCase());
    return { img: e ? ctx.img(e.icon_resource) : null, caption: text, size: 'small' };
  };

  // ---- Quests (Main Missions) ----
  const quests = ctx.table('EventRebuildEdenQuestTable').filter((q) => q.event_group === group);
  const mains = quests.filter((q) => q.type === 'Main').sort((a, b) => a.groupid - b.groupid);
  const mainByGroup = new Map(mains.map((q) => [q.groupid, q]));
  const mainName = (g) => {
    const q = mainByGroup.get(g);
    return q ? `${g}. ${ctx.plain(q.name_locale, '')}` : `Main Mission ${g}`;
  };
  // Unlock values point at a main mission as 10000 + its id (10801 = mission 8, id 801).
  const unlockedBy = (v) => (v ? mainName(Math.floor((v - 10000) / 100)) : '');

  // ---- Rewards ----
  const rewards = new Map(ctx.table('EventRebuildEdenRewardTable').map((r) => [r.id, r]));
  const units = ctx.table('EventRebuildEdenUnitTable');
  const unitById = new Map(units.map((u) => [u.id, u]));
  const unitName = (u) => ctx.plain(u.name_locale, `Unit ${u.id}`);
  const amountText = (r) => (r.max && r.max !== r.min ? `${n(r.min)}–${n(r.max)}` : n(r.min));
  const rewardCell = (id) => {
    const r = rewards.get(id);
    if (!r) return { key: String(id) };
    if (r.rewardtype === 'EdenUnits') {
      const u = unitById.get(r.item_id);
      return u ? { img: ctx.img(u.icon_id), caption: `${unitName(u)} ×${amountText(r)}`, size: 'small' } : { text: `Unit ×${amountText(r)}`, sub: `unit id ${r.item_id} (not in the unit table)` };
    }
    return itemCell(r.item_id, amountText(r));
  };

  // ---- Facilities ----
  const builds = ctx.table('EventRebuildEdenBuildSetupTable');
  const buildById = new Map(builds.map((b) => [b.id, b]));
  const buildName = (id) => ctx.plain(buildById.get(id)?.locale_name, `Facility ${id}`);
  const buildCell = (id) => (buildById.get(id) ? { img: ctx.img(buildById.get(id).img_resource_id), caption: buildName(id), size: 'small' } : { key: String(id) });
  const synergies = ctx.table('EventRebuildEdenSynergyEffectTable');
  const synById = new Map(synergies.map((s) => [s.id, s]));
  const specific = (b) => {
    const [v1, v2] = (b.build_specific_value || []).map((x) => x.build_specific_value);
    switch (b.build_specific_type) {
      case 'PowerPlant': return `Supplies ${v1} power to ${POWER_RANGE[v2] || `range ${v2}`}`;
      case 'MaterialGenerator': return `Produces ${itemName(v1)} (${v2} per batch)`;
      case 'DailySupply': return 'Hands out the daily supply (see Daily supply)';
      case 'Barracks': return `Dorm ${v1}: rest place for units; opens squad slots`;
      case 'Elevator': return 'Carries power and units between floors';
      case 'EquipmentFactory': return 'Produces equipment for dispatch squads';
      case 'Armory': return 'Lets squads equip equipment';
      case 'RecruitmentCenter': return 'Hire units';
      case 'RecruitSupport': return 'Hiring support (cheaper hiring through its traits)';
      case 'DispatchSupport': return 'Dispatch support (better dispatches through its traits)';
      case 'WeatherStation': return 'Turns on environmental events';
      default: return 'Special facility built on a fixed tile';
    }
  };
  const buildRow = (b) => {
    const syn = (b.synergy_effect_id || []).map((s) => synById.get(s.synergy_effect_id)).filter(Boolean);
    return [
      { img: ctx.img(b.img_resource_id), size: 'small' },
      { text: ctx.plain(b.locale_name, b.resource_id), sub: ctx.plain(b.locale_desc, '') },
      costCells(b.cost_material_setting, 'cost_material', 'cost_material_amount'),
      b.requirement_electric ? `${b.requirement_electric}` : '—',
      specific(b),
      [b.build_limit_count ? `Max ${b.build_limit_count}` : 'No limit', b.max_level ? `Upgrades to Lv ${b.max_level}` : '', b.can_destruct ? '' : 'Cannot be demolished'].filter(Boolean).join('\n'),
      b.unlock_condition === 'MainQuest' ? unlockedBy(b.unlock_value) : 'From the start',
      syn.map((s) => ({ page: 'synergies', label: ctx.plain(s.synergy_name_locale, '') })),
    ];
  };
  const BUILD_COLS = ['', 'Facility', 'Cost', { label: 'Power needed', num: true }, 'Does', 'Limits', 'Unlocked by', 'Synergy'];
  const buildSections = Object.keys(CATEGORY).map((cat) => {
    const list = builds.filter((b) => b.build_category === cat);
    return list.length ? { type: 'table', title: ctx.plain(`Locale_Event:rebe_construction_type_${cat === 'Electrics' ? 'electrics' : cat === 'Production' ? 'production' : cat === 'Force' ? 'force' : 'etc'}`, CATEGORY[cat]), columns: BUILD_COLS, rows: list.map(buildRow) } : null;
  }).filter(Boolean);

  // ---- Facility upgrades and traits ----
  const enhance = ctx.table('EventRebuildEdenBuildEnhanceTable').sort((a, b) => a.buildlevel - b.buildlevel);
  const perks = ctx.table('EventRebuildEdenBuildPerkTable');
  const perkGroups = [...new Set(perks.map((p) => p.groupid))].sort((a, b) => a - b);
  const perkSections = perkGroups.map((g) => {
    const list = perks.filter((p) => p.groupid === g);
    const steps = [...new Set(list.map((p) => p.step))].sort((a, b) => a - b);
    const who = builds.filter((b) => b.build_perks === g);
    return {
      type: 'table',
      title: who.map((b) => ctx.plain(b.locale_name, '')).join(', ') || `Trait group ${g}`,
      columns: [{ label: 'Trait point', num: true }, 'Option 1', 'Option 2'],
      rows: steps.map((s) => {
        const opts = list.filter((p) => p.step === s).sort((a, b) => a.order - b.order);
        return [s, effectCell(opts[0]?.effect_type, opts[0]?.effect_value) || '—', opts[1] ? effectCell(opts[1].effect_type, opts[1].effect_value) : '—'];
      }),
    };
  });

  // ---- Units ----
  const unitRow = (u, weightTotal) => {
    const w = u.list_override_prob || u.list_prob;
    return [
      { img: ctx.img(u.icon_id), size: 'small' },
      { text: unitName(u), sub: `Tier ${u.tier}${u.can_fire ? '' : ' · cannot be dismissed'}` },
      (u.effect_settings || []).map((e) => effectCell(e.effect_type_id, e.effect_value)).filter(Boolean),
      u.mvspd,
      u.max_stamina,
      costCells(u.hire_require_items, 'hire_require_item_id', 'hire_require_item_value'),
      w && weightTotal ? pct(10000 * w / weightTotal) : '—',
      u.list_condition === 'Quest' ? unlockedBy(u.list_condition_value) : '',
    ];
  };
  const UNIT_COLS = ['', 'Unit', 'Effect when assigned', { label: 'Speed', num: true }, { label: 'Stamina', num: true }, 'Hire cost', { label: 'Share of list', num: true }, 'Appears after'];
  const unitGroups = [...new Set(units.map((u) => u.group_id))].sort((a, b) => a - b);
  const unitSections = [];
  const starters = units.filter((u) => !u.list_prob && !u.list_override_prob);
  if (starters.length) {
    unitSections.push({ type: 'table', title: 'Not in the hire list', note: 'Never offered for hire; some are handed out by Main Missions.', columns: UNIT_COLS.slice(0, 6), rows: starters.map((u) => unitRow(u, 0).slice(0, 6)) });
  }
  for (const g of unitGroups) {
    const list = units.filter((u) => u.group_id === g && (u.list_prob || u.list_override_prob));
    if (!list.length) continue;
    const total = list.reduce((s, u) => s + (u.list_override_prob || u.list_prob), 0);
    const tiers = [...new Set(list.map((u) => u.tier))];
    const unique = list.some((u) => u.list_highpriority);
    unitSections.push({
      type: 'table',
      title: unique ? (list.length === 1 ? unitName(list[0]) : 'Special units') : `Hire pool ${g} (tier ${Math.max(...tiers)})`,
      note: list.length === 1 && list[0].list_override_prob >= 100000 ? 'Always offered once its mission is done.' : '“Share of list” is the unit’s weight within this pool.',
      columns: UNIT_COLS,
      rows: list.map((u) => unitRow(u, total)),
    });
  }

  // ---- Dispatch ----
  const dispatches = ctx.table('EventRebuildEdenDispatchTable');
  const dispatchRow = (d) => [
    { img: ctx.img(d.icon_resource), size: 'small' },
    [{ text: ctx.plain(d.name_locale, `Dispatch ${d.id}`), sub: DISPATCH_CAT[d.category] || d.category },
      d.is_rare ? { tag: 'Rare', tone: 'accent' } : '', d.is_once ? { tag: 'Once', tone: 'good' } : ''].filter(Boolean),
    pct(d.ratio_normalsuccess),
    pct(d.ratio_specialsuccess),
    (d.reward_id || []).map(rewardCell),
    sec(d.after_waittime),
    d.list_condition === 'Quest' ? unlockedBy(d.condition_value) : d.list_condition === 'Build' ? `Building ${buildName(d.condition_value)}` : 'From the start',
  ];
  const DISPATCH_COLS = ['', 'Dispatch', { label: 'Success', num: true }, { label: 'Super success', num: true }, 'Rewards', 'Squad rest', 'Appears after'];
  const specialMult = [...new Set(dispatches.map((d) => d.rewardspecialweight))];
  const dispatchSections = [...new Set(dispatches.map((d) => d.tier))].sort((a, b) => a - b).map((t) => ({
    type: 'table', title: `Tier ${t}`, columns: DISPATCH_COLS, rows: dispatches.filter((d) => d.tier === t).map(dispatchRow),
  }));

  // ---- Weather ----
  const envEvents = ctx.table('EventRebuildEdenEnvEventTable');
  const WEATHER = { Rain: 'Rain', Storm: 'Storm', Heat: 'Heatwave', Snow: 'Snow' };
  const envGroups = [...new Set(envEvents.map((e) => e.group_id))].sort((a, b) => a - b);
  const envGroupTotal = envGroups.reduce((s, g) => s + (envEvents.find((e) => e.group_id === g)?.group_prob || 0), 0);
  const weatherRows = envGroups.map((g) => {
    const list = envEvents.filter((e) => e.group_id === g);
    const tot = list.reduce((s, e) => s + e.prob, 0);
    return [
      { img: ctx.img(list[0].icon_resource), caption: WEATHER[list[0].screenfx_resource_id] || list[0].screenfx_resource_id, size: 'small' },
      envGroupTotal ? pct(10000 * list[0].group_prob / envGroupTotal) : '',
      list.map((e) => `${pct(10000 * e.prob / tot)}: ${(e.effectsettings || []).map((s) => effectText(s.effect_type, s.effect_value)).filter(Boolean).join('; ')}`),
    ];
  });

  // ---- Missions (event challenges) ----
  const missionsOf = (g) => ctx.table('EventRebuildEdenMissionTable').filter((x) => x.event_group === g).sort((a, b) => (a.type === b.type ? a.id - b.id : a.type === 'Daily' ? -1 : 1));
  const missionPage = (g, id, title) => {
    const list = missionsOf(g);
    return list.length ? {
      id, title, group: 'Missions', count: list.length, summary: 'Event challenges with rewards for your account.',
      sections: [{ type: 'table', columns: ['Mission', 'Type', 'Reward'], rows: list.map((x) => [ctx.plain(x.name_locale, x.mission_type), x.type === 'Daily' ? { tag: 'Daily', tone: 'good' } : 'One-time', { reward: ctx.reward(x.reward_id) }]) }],
    } : null;
  };

  // ---- Story ----
  const dialogs = ctx.table('EventRebuildEdenDialogTable');
  const storyRows = dialogs.filter((d) => d.scenariodialog_groupid && ctx.scene(d.scenariodialog_groupid))
    .filter((d, i, a) => a.findIndex((x) => x.scenariodialog_groupid === d.scenariodialog_groupid) === i)
    .map((d) => {
      const v = (d.play_condition_value || [])[0];
      const when = d.play_condition === 'ClearMainQuest' ? `Clear ${mainName(v)}` : d.play_condition === 'CompleteBuild' ? `Build ${buildName(v)}` : d.play_condition === 'HireUnit' && unitById.get(v) ? `Hire ${unitName(unitById.get(v))}` : d.play_condition;
      return { v: d.play_condition === 'ClearMainQuest' ? v : 0, row: [ctx.scene(d.scenariodialog_groupid), when] };
    }).sort((a, b) => a.v - b.v).map((x) => x.row);

  // ---- Main Missions page ----
  const scenesByMain = new Map();
  for (const d of dialogs) {
    if (d.play_condition === 'ClearMainQuest' && d.scenariodialog_groupid && ctx.scene(d.scenariodialog_groupid)) {
      const v = d.play_condition_value[0];
      if (!scenesByMain.has(v)) scenesByMain.set(v, ctx.scene(d.scenariodialog_groupid));
    }
  }
  const firstDate = mains.length ? ctx.date(mains[0].mission_unlock_time) : null;
  const stageLock = ctx.plain('Locale_Event:rebe_mission_notyfication_lock_byStage', 'Needs a main story stage cleared').replace(/^■\s*/, '');
  const mainRows = mains.map((q) => {
    const tasks = quests.filter((t) => t.type === 'Task' && t.groupid === q.groupid).sort((a, b) => a.id - b.id);
    const v = 10000 + q.id;
    const opens = [
      ...units.filter((u) => u.list_condition === 'Quest' && u.list_condition_value === v && u.list_highpriority).map((u) => `Unit: ${unitName(u)}`),
      ...[...new Set(units.filter((u) => u.list_condition === 'Quest' && u.list_condition_value === v && !u.list_highpriority).map((u) => u.tier))].map((t) => `Tier ${t} units for hire`),
      ...[...new Set(dispatches.filter((d) => d.list_condition === 'Quest' && d.condition_value === v).map((d) => d.tier))].map((t) => `Tier ${t} dispatches`),
      ...items.filter((i) => i.unlock_condition === 'MainQuest' && i.unlock_value === v).map((i) => `Equipment: ${itemName(i.id)}`),
    ];
    const date = ctx.date(q.mission_unlock_time);
    return [
      q.groupid,
      { text: ctx.plain(q.name_locale, ''), sub: [date && date !== firstDate ? `Opens ${date}` : '', q.mission_unlock_clearstage ? stageLock : ''].filter(Boolean).join('\n') },
      tasks.map((t) => ctx.plain(t.name_locale, t.mission_type)),
      (q.reward_id || []).map(rewardCell),
      (q.unlock_build || []).length || opens.length ? [...(q.unlock_build || []).map(buildCell), ...opens] : '—',
      scenesByMain.get(q.groupid) || '',
    ];
  });
  const subs = quests.filter((q) => q.type === 'Sub').sort((a, b) => a.id - b.id);

  // ---- Daily supply ----
  const daily = ctx.table('EventRebuildEdenDailyProductionTable').sort((a, b) => a.set_day - b.set_day);

  const help = ctx.help(m.helptip);
  const tierMats = items.filter((i) => i.category === 'Material');

  return {
    summary: 'A city builder: rebuild Eden floor by floor. Power your facilities, collect materials, hire units into squads and send them on dispatch missions while following 23 Main Missions to the Command Center.',
    overview: [
      {
        type: 'facts',
        title: 'How it plays',
        items: [
          ['Intro story', ctx.intro ? { scene: ctx.intro.id, label: ctx.intro.label } : null],
          ['Goal', `Complete the ${mains.length} Main Missions; each one unlocks new facilities, units, dispatches or equipment. After the last one Eden is yours to rearrange freely.`],
          ['Building', `Pick a tile and a facility; construction takes ${sec(builds[0]?.build_construct_time || 0)}. Demolishing refunds ${m.demolition_refund_value}% of the cost. Some special facilities only fit on fixed tiles.`],
          ['Power', 'Most facilities need power from a nearby Power Plant. Above the first floor they also need the Elevator.'],
          ['Time', `An in-game day passes every ${sec(m.daily_timer)}; a weekly summary follows every 7 days. With the Weather Forecast Station built, a random weather event can occur each day.`],
          ['Hiring', `The hire list offers ${m.hire_counts} units; rerolling it costs ${n(m.hirelist_reroll_value)} ${itemName(m.hirelist_reroll_itemid)}. Dismissing refunds ${pct(m.fire_refund_value)} of the hiring cost.`],
          ['Dispatch', `Send a squad for materials. Success is not guaranteed; a super success gives ${specialMult.map((v) => `×${v / 10000}`).join('/')} rewards. ${m.dispatch_bonus_count} Daily Dispatch Bonuses a day add extra rewards. Equipment used on a dispatch is consumed.`],
          ['Rerun', arcade ? 'The rerun (Arcade) uses the same missions and has its own set of challenges.' : null],
        ],
      },
      {
        type: 'table',
        title: 'Materials',
        columns: ['', 'Material', 'Where from'],
        rows: tierMats.map((i) => [{ img: ctx.img(i.resource_id), size: 'small' }, itemName(i.id), ctx.plain(i.locale_desc, '')]),
      },
      { type: 'gallery', title: 'Facilities', items: builds.filter((b, i, a) => a.findIndex((x) => x.img_resource_id === b.img_resource_id) === i).map((b) => ({ img: b.img_resource_id, caption: ctx.plain(b.locale_name, '') })) },
      help.length ? { type: 'help', help } : null,
    ].filter(Boolean),
    pages: [
      {
        id: 'facilities', title: 'Facilities', group: 'Eden', count: builds.length,
        summary: 'Everything you can build. “Power needed” must be covered by Power Plants in range.',
        sections: buildSections,
      },
      {
        id: 'upgrades', title: 'Facility upgrades', group: 'Eden', count: enhance.length,
        summary: 'Upgrading a facility gives 1 trait point per level; spend each point on one of the options.',
        sections: [
          { type: 'table', title: 'Upgrade cost', columns: [{ label: 'To level', num: true }, 'Cost', { label: 'Trait points', num: true }], rows: enhance.filter((e) => e.buildlevel > 1).map((e) => [e.buildlevel, costCells(e.requirementmaterialsettingdata, 'requirement_material_id', 'requirement_material_amount'), e.perkpoints]) },
          ...perkSections,
        ],
      },
      {
        id: 'synergies', title: 'Synergies', group: 'Eden', count: synergies.filter((s) => builds.some((b) => (b.synergy_effect_id || []).some((x) => x.synergy_effect_id === s.id))).length,
        summary: 'Bonuses for placing certain facilities next to each other.',
        sections: [{
          type: 'table',
          columns: ['', 'Synergy', 'How', 'Effect', 'Facility'],
          rows: synergies.filter((s) => builds.some((b) => (b.synergy_effect_id || []).some((x) => x.synergy_effect_id === s.id))).map((s) => [
            { img: ctx.img(s.synergy_icon), size: 'small' },
            ctx.plain(s.synergy_name_locale, ''),
            ctx.plain(s.synergy_desc_locale, ''),
            ctx.plain(`Locale_Event:${s.synergy_desc_activated}`, effectText(s.effect_type, s.effect_value)),
            builds.filter((b) => (b.synergy_effect_id || []).some((x) => x.synergy_effect_id === s.id)).map((b) => buildCell(b.id)),
          ]),
        }],
      },
      {
        id: 'equipment', title: 'Equipment', group: 'Eden', count: items.filter((i) => i.category === 'Equipment').length,
        summary: 'Made in the Equipment Production Facility and given to dispatch squads. α raises success rate, β raises the materials brought back.',
        sections: [{
          type: 'table',
          columns: ['', 'Equipment', { label: 'Tier', num: true }, 'Effect', 'Cost', 'Time each', 'Unlocked by'],
          rows: items.filter((i) => i.category === 'Equipment').map((i) => [
            { img: ctx.img(i.resource_id), size: 'small' },
            { text: itemName(i.id), sub: ctx.plain(i.locale_desc, '') },
            i.tier,
            effectText(i.effect_type, i.effect_value) || '—',
            costCells(i.requirement_setting, 'requirement_item_id', 'requirement_item_amount'),
            sec(i.create_time),
            i.unlock_condition === 'MainQuest' ? unlockedBy(i.unlock_value) : 'From the start',
          ]),
        }],
      },
      daily.length ? {
        id: 'daily', title: 'Daily supply', group: 'Eden', count: daily.length,
        summary: 'What the Daily Supply Station hands out, by day.',
        sections: [{ type: 'table', columns: [{ label: 'Day', num: true }, 'Supply'], rows: daily.map((d) => [d.set_day, costCells(d.requirement_setting, 'material_id', 'material_amount')]) }],
      } : null,
      {
        id: 'weather', title: 'Weather', group: 'Eden', count: weatherRows.length,
        summary: 'Environmental events (needs the Weather Forecast Station). One weather type is picked, then one of its effects.',
        sections: [{ type: 'table', columns: ['Weather', { label: 'Chance', num: true }, 'Possible effect'], rows: weatherRows }],
      },
      {
        id: 'units', title: 'Units', group: 'Squads', count: units.length,
        summary: 'Hired units move around Eden, can be assigned to one facility each for its effect, and fill dispatch squads.',
        sections: unitSections,
      },
      {
        id: 'dispatch', title: 'Dispatch missions', group: 'Squads', count: dispatches.length,
        summary: `Send a squad to bring back materials. Super success multiplies the rewards (×${specialMult.map((v) => v / 10000).join('/')}). After a dispatch the squad rests before it can go again.`,
        sections: dispatchSections,
      },
      {
        id: 'main', title: 'Main Missions', group: 'Missions', count: mainRows.length,
        summary: 'Do every task of a Main Mission to clear it and unlock the next. The last one needs a main story stage cleared.',
        sections: [{ type: 'table', columns: [{ label: '#', num: true }, 'Mission', 'Tasks', 'Rewards', 'Unlocks', 'Story'], rows: mainRows }],
      },
      {
        id: 'side', title: 'Side Missions', group: 'Missions', count: subs.length,
        summary: 'Running goals that pay materials.',
        sections: [{ type: 'table', columns: ['Mission', 'Reward'], rows: subs.map((q) => [ctx.plain(q.name_locale, q.mission_type), (q.reward_id || []).map(rewardCell)]) }],
      },
      missionPage(group, 'challenges', 'Challenges'),
      arcade && missionPage(arcade.event_group, 'challenges-rerun', 'Challenges (rerun)'),
      storyRows.length ? {
        id: 'story', title: 'Story', count: storyRows.length,
        sections: [{ type: 'table', columns: ['Scene', 'Unlocks when'], rows: storyRows }],
      } : null,
    ].filter(Boolean),
  };
}

module.exports = { build };
