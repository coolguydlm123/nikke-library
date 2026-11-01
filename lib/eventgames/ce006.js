// CE006 (Stellar Blade collab) has two parts:
//  - Naytiba Raid / Boss Challenge (EventSB*): one-on-one action fights as EVE against five
//    Naytiba bosses at three difficulties. You earn Gold, SP, Body Cores and Beta Cores, spend
//    them on EVE's upgrades, skill tree and equipment (exospines and gears), and post scores to
//    a Union ranking. Manager 1 is the event version ("Normal"), manager 2 the later "Arcade".
//  - Can Shelf (EventCanCollect*): drink cans hidden around the event field; collecting them
//    pays out progress rewards.
// Stage time limits are in seconds. Option values in the item table are per 10,000 when the
// text shows a percentage (2000 = 20%).

const num = (v) => Number(v).toLocaleString('en-US');
const fill = (s, ...args) => args.reduce((t, a, i) => t.replace(`{${i}}`, a), s);
const DIFF = { Normal: 'Normal', Hard: 'Hard', Challenge: 'Challenge' };
const SIGNAL = { Yellow: { tag: 'Yellow', tone: 'accent' }, Blue: { tag: 'Blue', tone: 'good' }, Purple: { tag: 'Purple', tone: 'bad' } };
const SKILL_TREE = [
  ['Attack', 'Attack skills', 'Combo attacks and attack bonuses. Combo attacks can be swapped freely.'],
  ['Survive', 'Survival skills', 'Perfect Parry, Perfect Dodge, and the Blink / Repulse counters to special attacks.'],
  ['Burst', 'Burst skills', 'Fuelled by the Burst gauge, which fills on Perfect Dodges.'],
  ['Beta', 'Beta skills', 'Fuelled by the Beta gauge (Perfect Parries and combo finishers); good at breaking shields and balance.'],
];
const ENHANCE = {
  HP: ['Max HP', (e) => num(e.enhance_value_01)],
  BetaGauge: ['Max Beta Energy', (e) => num(e.enhance_value_01)],
  Atk: ['Attack Power', (e) => num(e.enhance_value_01)],
  Potion: ['Tumblers (healing)', (e) => `${e.enhance_value_01} uses, ${num(e.enhance_value_02)} HP each`],
};

// In-game guide pages for a help-tip group.
function helpPages(ctx, group) {
  return ctx.table('MinigameHelpTipDescTable').filter((d) => d.group_id === group).sort((a, b) => a.order - b.order)
    .map((d) => ({ title: ctx.plain(d.helptip_title), image: ctx.img(d.helptip_image), text: ctx.plain(d.helptip_description) }));
}

// "fx_ce006_gigas_SmashCombo_phase02" -> ["Smash Combo", true]
function moveName(res, boss) {
  const r = res.replace(/^fx_ce006_/, '').replace(new RegExp(`^${boss}_`, 'i'), '');
  const phase2 = /_phase0?2$/i.test(r);
  const base = r.replace(/_phase0?2$/i, '').replace(/_/g, ' ').replace(/([a-zA-Z])(\d+)$/, '$1 $2')
    .replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());
  return [base, phase2];
}

function build(ctx) {
  const managers = ctx.table('EventSBManagerTable').sort((a, b) => a.id - b.id);
  const m = managers.find((x) => x.minigame_type === 'Normal') || managers[0];
  const arcade = managers.find((x) => x.minigame_type === 'Arcade');
  const ch = ctx.table('EventSBCharacterTable').find((c) => c.id === m.character_id) || {};

  const currencies = new Map(ctx.table('EventSBCurrencyTable').map((c) => [c.id, c]));
  const curByType = new Map(ctx.table('EventSBCurrencyTable').map((c) => [c.currency_type, c]));
  const curCell = (c, amount) => (c ? { img: ctx.img(c.item_resource), caption: `${num(amount)} ${ctx.plain(c.item_name_locale)}`, size: 'small' } : `${num(amount)}`);
  const rewardRows = ctx.table('EventSBStageRewardTable');
  const rewardGroup = (g) => rewardRows.filter((r) => r.group_id === g).sort((a, b) => a.score_min - b.score_min);
  const flatReward = (g) => rewardGroup(g).map((r) => curCell(currencies.get(r.reward_id), r.reward_amount));

  const stagesAll = ctx.table('EventSBStageTable');
  const stages = stagesAll.filter((s) => s.group_id === m.stage_group_id);
  const arcadeStages = arcade ? stagesAll.filter((s) => s.group_id === arcade.stage_group_id) : [];
  const stageById = new Map(stagesAll.map((s) => [s.id, s]));
  const stageName = (s) => ctx.plain(s?.stage_name_locale, s ? `${s.boss_type} ${s.stage_type}` : '?');
  const monsters = new Map(ctx.table('EventSBMonsterTable').map((x) => [x.id, x]));
  const states = new Map(ctx.table('EventSBMonsterAttackStateTable').map((s) => [s.id, s]));
  const attacks = ctx.table('EventSBMonsterAttackTable');
  const bosses = [...new Set(stages.map((s) => s.boss_type))];

  // A boss's move list, merged over its difficulties: hits, damage, guardability, warning signal.
  const moveTable = (list) => {
    const moves = new Map();
    list.forEach((s, di) => {
      const mon = monsters.get(s.monster_id);
      for (const { skill_id: id } of mon?.useskilldata || []) {
        const st = states.get(id);
        if (!st) continue;
        const [name, phase2] = moveName(st.use_effect_resource, s.boss_type);
        const hits = attacks.filter((a) => a.group_id === st.use_attack_group_id);
        if (!hits.length || hits.every((h) => !h.damage)) continue;
        if (!moves.has(name)) moves.set(name, { name, phase1: false, phase2: false, hits, signals: list.map(() => new Set()) });
        const mv = moves.get(name);
        mv[phase2 ? 'phase2' : 'phase1'] = true;
        for (const h of hits) if (h.special_skill_type !== 'None') mv.signals[di].add(h.special_skill_type);
      }
    });
    return {
      type: 'table',
      title: 'Moves',
      note: 'Names come from the effect files. Damage is the per-hit value in the attack table (scaled by the boss’s ATK; exact formula unknown). Hits that cannot be guarded must be dodged; a coloured signal warns of a special attack (Blue: counter with Blink, Purple: with Repulse, once learned). “Counter” marks hits a Perfect Parry can interrupt.',
      columns: ['Move', 'Phase', 'Damage per hit', 'Guard', ...list.map((s) => `Signal (${DIFF[s.stage_type] || s.stage_type})`)],
      rows: [...moves.values()].map((mv) => [
        { b: mv.name },
        [mv.phase1 && '1', mv.phase2 && '2'].filter(Boolean).join(', '),
        mv.hits.map((h) => h.damage).join(' / '),
        mv.hits.every((h) => h.eve_guard_able) ? 'Yes' : mv.hits.some((h) => h.eve_guard_able) ? 'Partly' : { tag: 'Dodge', tone: 'bad' },
        ...mv.signals.map((set) => (set.size ? [...set].map((c) => SIGNAL[c] || c) : '—')),
      ]),
    };
  };

  const unlockText = (s) => [
    s.unlock_date > 1 ? `day ${s.unlock_date}` : null,
    s.unlock_condition_stage ? `after ${stageName(stageById.get(s.unlock_condition_stage))}` : null,
  ].filter(Boolean).join(', ') || 'From the start';

  const bossPages = bosses.map((boss) => {
    const list = stages.filter((s) => s.boss_type === boss).sort((a, b) => a.id - b.id);
    const mon = (s) => monsters.get(s.monster_id) || {};
    const s0 = list[0];
    const arc = arcadeStages.filter((s) => s.boss_type === boss).sort((a, b) => a.id - b.id);
    return {
      id: `boss-${boss.toLowerCase()}`,
      title: ctx.plain(s0.stage_name_locale_without_level, boss),
      group: 'Bosses',
      count: list.length,
      sections: [
        { type: 'facts', items: [['', { img: ctx.img(s0.monster_image), size: 'large' }]] },
        {
          type: 'table',
          title: 'Stages',
          note: 'Shield refills some time after it breaks; when the balance gauge empties the boss is groggy and open to a Retribution attack.',
          columns: ['Stage', 'Unlock', { label: 'Time', num: true }, { label: 'HP', num: true }, { label: 'ATK', num: true }, { label: 'Shield', num: true }, { label: 'Balance', num: true }, { label: 'Retribution dmg', num: true }],
          rows: list.map((s) => [{ b: stageName(s) }, unlockText(s), `${s.limit_time} s`, mon(s).monster_hp, mon(s).monster_atk, mon(s).monster_shield_gauge, mon(s).balance_gauge, mon(s).retribution_damage]),
        },
        {
          type: 'table',
          title: 'Rewards',
          note: 'Clearing pays a fixed amount of Gold; a run that does not beat the boss pays Gold by score (see below).' + (arc.length ? ' Arcade mode repeats these stages with its own first-clear rewards.' : ''),
          columns: ['Stage', 'First clear', 'Each clear', ...(arc.length ? ['First clear (Arcade)'] : [])],
          rows: list.map((s, i) => [
            stageName(s),
            s.stage_first_clear_reward.map((r) => r.stage_first_clear_reward).filter(Boolean).flatMap(flatReward),
            flatReward(s.stage_clear_reward),
            ...(arc.length ? [(arc[i]?.stage_first_clear_reward || []).map((r) => r.stage_first_clear_reward).filter(Boolean).flatMap(flatReward)] : []),
          ]),
        },
        ...list.map((s) => ({
          type: 'table',
          title: `${stageName(s)}: Gold by score`,
          columns: ['Score', 'Gold'],
          rows: rewardGroup(s.stage_failure_reward).map((r) => [
            r.score_max ? `${num(r.score_min)} – ${num(r.score_max)}` : `${num(r.score_min)}+`,
            curCell(currencies.get(r.reward_id), r.reward_amount),
          ]),
        })),
        moveTable(list),
      ],
    };
  });

  // Skill tree: one table per branch.
  const skills = ctx.table('EventSBCharacterSkillTable').filter((s) => s.group_id === m.character_skill_group_id);
  const skillById = new Map(skills.map((s) => [s.id, s]));
  const skillName = (s) => ctx.plain(s.skill_name_locale, `#${s.id}`);

  const enhance = ctx.table('EventSBCharacterEnhanceTable').filter((e) => e.group_id === m.enhance_group_id);
  const items = new Map(ctx.table('EventSBItemTable').map((i) => [i.id, i]));
  const optionText = (i) => i.sb_item_option.map((o, k) => {
    if (o.item_option_group === 'None') return null;
    const t = ctx.plain(i.sb_item_option_locale[k]?.item_option_locale, o.item_option_group);
    if (/\{0\}%/.test(t)) return fill(t, +(o.item_option_value / 100).toFixed(2));
    return fill(t, num(o.item_option_value));
  }).filter(Boolean);
  const shop = ctx.table('EventSBShopTable').filter((s) => s.group_id === m.shop_group_id);
  const gold = curByType.get('Gold');
  const shopUnlock = (s) => {
    const c = s.sbopenconditiondata.filter((x) => x.open_condition_type !== 'None');
    if (!c.length) return 'From the start';
    return c.map((x) => (x.open_condition_type === 'GainItem' ? `own ${ctx.plain(items.get(x.open_condition_value)?.item_name_locale)} Lv. ${items.get(x.open_condition_value)?.item_level}`
      : x.open_condition_type === 'StageClear' ? `clear ${stageName(stageById.get(x.open_condition_value))}` : x.open_condition_type)).join(', ');
  };
  const itemCell = (i) => ({ img: ctx.img(i.item_resource), caption: `${ctx.plain(i.item_name_locale)}${i.item_type === 'Gear' ? ` Lv. ${i.item_level}` : ''}`, size: 'small' });
  const shopRows = (type) => shop.filter((s) => s.item_group === type).sort((a, b) => a.item_order - b.item_order).map((s) => {
    const i = items.get(s.item_id) || {};
    return [itemCell(i), ctx.plain(i.item_description_locale), optionText(i), curCell(gold, s.item_price), shopUnlock(s)];
  });

  const missionsAll = ctx.table('EventSBMissionTable');
  const missionRows = (list) => list.map((x) => [
    ctx.plain(x.mission_localkey, x.mission_type),
    x.reward_type === 'DailyPoint' ? `${x.reward_value} mission points` : { reward: ctx.reward(x.reward_value) },
  ]);
  const missionPage = (mgr, id, titleText) => {
    const list = missionsAll.filter((x) => x.group_id === mgr.mission_group_id);
    const cat = (c) => list.filter((x) => x.mission_category === c);
    return {
      id,
      title: titleText,
      group: 'Naytiba Raid',
      count: list.length,
      sections: [
        cat('DailyMission').length && { type: 'table', title: 'Daily missions', note: 'Each pays mission points; points add up to the daily point rewards.', columns: ['Mission', 'Reward'], rows: missionRows(cat('DailyMission')) },
        cat('DailyPoint').length && { type: 'table', title: 'Daily point rewards', columns: ['Goal', 'Reward'], rows: missionRows(cat('DailyPoint')) },
        cat('Achievement').length && { type: 'table', title: 'Challenges', columns: ['Mission', 'Reward'], rows: missionRows(cat('Achievement')) },
      ].filter(Boolean),
    };
  };

  // Guide: the tutorial list (each popup is a help-tip group, shown on first visit to a menu).
  const tutorials = ctx.table('EventSBTutorialListTable').filter((t) => t.group_id === m.tutorial_list_group_id);
  const help = [...new Set(tutorials.map((t) => t.tutorial_page_id))].map((g) => {
    const t = tutorials.find((x) => x.tutorial_page_id === g);
    return { title: ctx.plain(t.tutorial_title_localkey), pages: helpPages(ctx, g) };
  }).filter((h) => h.pages.length);

  // Can Shelf.
  const cans = ctx.table('EventCanCollectListTable').sort((a, b) => a.order - b.order);
  const canRewards = ctx.table('EventCanCollectProgressRewardTable').sort((a, b) => a.order - b.order);

  return {
    summary: 'Naytiba Raid: fight five Naytiba bosses one-on-one as EVE, using parries, dodges and skills, and upgrade her between fights. Plus the Can Shelf: collect drink cans on the event field.',
    overview: [
      {
        type: 'facts',
        title: 'Naytiba Raid',
        items: [
          ['Goal', 'Bring the boss’s HP to 0 before the timer runs out; EVE then executes it. Your score comes from damage dealt and time left.'],
          ['Controls', 'Tap to attack (combo), swipe to dodge, Guard button to block, Tumbler button to heal. Burst and Beta skills use their gauges.'],
          ['Perfect Parry', `Guard at the right moment: no damage, the boss loses balance, and EVE gains ${ch.perfect_guard_gain_beta_gauge} Beta Energy.`],
          ['Perfect Dodge', `Dodge at the right moment: EVE gains ${ch.perfect_dodge_gain_burst_gauge} Burst Energy (gauge max ${ch.default_burst_gauge}).`],
          ['Special attacks', 'Signalled by a coloured flash and cannot be guarded: dodge them, or counter Blue with Blink and Purple with Repulse.'],
          ['Shields and balance', 'Both sides have a shield gauge; once it is empty, hits do more damage. Emptying a boss’s balance gauge makes it groggy, open to Retribution.'],
          ['Defeat', 'EVE dies at 0 HP or when time runs out.'],
          ['Union ranking', 'Your best score on each Challenge stage is added up for the Union ranking.'],
          ['Intro story', ctx.intro ? { scene: ctx.intro.id, label: ctx.intro.label } : null],
        ],
      },
      {
        type: 'table',
        title: 'Currencies',
        columns: ['Currency', 'Use'],
        rows: [...currencies.values()].map((c) => [{ img: ctx.img(c.item_resource), caption: ctx.plain(c.item_name_locale), size: 'small' }, ctx.plain(c.item_description_locale)]),
      },
      {
        type: 'gallery',
        title: 'Bosses',
        items: bosses.map((b) => { const s = stages.find((x) => x.boss_type === b); return { img: ctx.img(s.monster_icon), caption: ctx.plain(s.stage_name_locale_without_level, b) }; }),
      },
      {
        type: 'facts',
        title: 'Can Shelf',
        items: [['', `A separate collection: ${cans.length} drink cans are hidden on the event field. See the Can Shelf page.`]],
      },
    ],
    pages: [
      { id: 'guide', title: 'How to play', group: 'Naytiba Raid', count: help.length, sections: [{ type: 'help', help }] },
      missionPage(m, 'missions', 'Missions'),
      arcade && missionPage(arcade, 'missions-arcade', 'Missions (Arcade)'),
      ...bossPages,
      {
        id: 'eve',
        title: 'EVE’s upgrades',
        group: 'EVE',
        sections: [
          {
            type: 'facts',
            title: 'Base stats',
            items: [
              ['Shield gauge', `${ch.default_shield_gauge}; refills ${ch.recovery_shield_gauge_amount} at a time once broken`],
              ['Burst gauge', ch.default_burst_gauge],
              ['Crit rate', `${ch.default_critical_probability / 100}%`],
              ['Crit damage', `${ch.default_damage_ratio / 100}%`],
            ],
          },
          ...Object.keys(ENHANCE).map((type) => {
            const list = enhance.filter((e) => e.enhance_type === type).sort((a, b) => a.enhance_level - b.enhance_level);
            return {
              type: 'table',
              title: ENHANCE[type][0],
              note: 'Cost is what it takes to reach that level.',
              columns: [{ label: 'Level', num: true }, 'Value', 'Cost'],
              rows: list.map((e) => [e.enhance_level, ENHANCE[type][1](e), e.enhance_material_item_type === 'None' ? '—' : curCell(curByType.get(e.enhance_material_item_type), e.enhance_material_item_value)]),
            };
          }),
        ],
      },
      ...SKILL_TREE.map(([key, titleText, note]) => {
        const list = skills.filter((s) => s.skill_group === key).sort((a, b) => a.id - b.id);
        return {
          id: `skills-${key.toLowerCase()}`,
          title: titleText,
          group: 'EVE',
          count: list.length,
          summary: note,
          sections: [{
            type: 'table',
            note: 'SP comes from first clears. A skill can be learned once the skill it requires is learned.',
            columns: ['Skill', 'Effect', { label: 'SP', num: true }, 'Requires'],
            rows: list.map((s) => [
              { img: ctx.img(s.skill_icon), caption: skillName(s), size: 'small' },
              ctx.plain(s.skill_description_locale),
              s.is_default_learn ? { tag: 'Known', tone: 'good' } : s.need_learn_skillpoint,
              s.prior_skill ? skillName(skillById.get(s.prior_skill) || { id: s.prior_skill }) : '',
            ]),
          }],
        };
      }),
      {
        id: 'equipment',
        title: 'Equipment shop',
        group: 'EVE',
        count: shop.length,
        summary: 'Bought with Gold. EVE wears one exospine and up to two gears.',
        sections: [
          { type: 'table', title: 'Exospines', columns: ['Item', 'Description', 'Effects', 'Price', 'In shop'], rows: shopRows('ExoSpine') },
          { type: 'table', title: 'Gears', note: 'Each gear has three levels; a higher level appears in the shop once you own the one below.', columns: ['Item', 'Description', 'Effects', 'Price', 'In shop'], rows: shopRows('Gear') },
        ],
      },
      {
        id: 'cans',
        title: 'Can Shelf',
        group: 'Can Shelf',
        count: cans.length,
        summary: 'A side collection: find drink cans on the event field to fill the Can Shelf.',
        sections: [
          {
            type: 'table',
            title: 'Collection rewards',
            columns: [{ label: 'Cans', num: true }, 'Reward'],
            rows: canRewards.map((r) => [r.goal_value, { reward: ctx.reward(r.reward_id) }]),
          },
          {
            type: 'table',
            title: 'Cans',
            note: 'Rank is the can’s tier on the shelf (1–3).',
            columns: ['Can', 'Description', 'Where', { label: 'Rank', num: true }],
            rows: cans.map((c) => [
              { img: ctx.img(c.icon_resource), caption: ctx.plain(c.name_localkey), size: 'small' },
              ctx.plain(c.description_localkey),
              ctx.plain(c.collect_spawn_hint),
              c.collect_rank,
            ]),
          },
        ],
      },
    ].filter(Boolean),
  };
}

module.exports = { build };
