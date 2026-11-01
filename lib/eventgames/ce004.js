// Battle Simulator (EventCE004MiniGame*), the Evangelion collab minigame. A Rapture shows hints
// of what it is about to do (expose its core or a side part, fire missiles, charge a beam); you
// answer each hint with the matching button: attacks on exposed spots deal damage, defences
// block incoming attacks. Right answers fill the Burst Gauge and build a charge bonus; wrong
// ones cost HP or the attack. Stages run Easy -> Normal -> Hard, plus an endless Challenge.
// Manager 101 is the event, 102 the rerun (archive) version. Rates are per 10,000.

const pct = (v) => `${+(v / 100).toFixed(2)}%`;
const DIFF = ['Easy', 'Normal', 'Hard', 'Challenge'];
const KIND = { Attack: { tag: 'Attack', tone: 'good' }, Defence: { tag: 'Defense', tone: 'bad' } };
const CATEGORY = { Attack: 'Attack', Defence: 'Defense', Util: 'Utility' };

function build(ctx) {
  const managers = ctx.table('EventCE004MiniGameManagerTable');
  const main = managers.find((m) => !m.is_archive) || managers[0];
  const rerun = managers.find((m) => m.is_archive && m !== main);
  const name = (key, fb = '') => ctx.plain(key, fb).replace(/\r/g, '').trim();
  const bullets = (key) => name(key).replace(/■\s*/g, '').replace(/\n\s+/g, '\n');

  // The six answer buttons: three attacks (left part, core, right part), three defences.
  const types = ctx.table('EventCE004MiniGameSkillTypeTable');
  const typeBy = new Map(types.map((t) => [t.skill_type, t]));
  const typeCell = (type, size = 'small') => {
    const t = typeBy.get(type);
    return t ? { img: ctx.img(t.resource_id), caption: name(t.name_localkey, type), size } : type;
  };

  const characters = ctx.table('EventCE004MiniGameCharacterTable');
  const chaSkills = ctx.table('EventCE004MiniGameChaSkillTable');
  const monsters = new Map(ctx.table('EventCE004MiniGameMonsterTable').map((m) => [m.id, m]));
  const monSkills = ctx.table('EventCE004MiniGameMonSkillTable');
  const stages = ctx.table('EventCE004MiniGameStageTable');
  const stageById = new Map(stages.map((s) => [s.id, s]));
  const seeds = ctx.table('EventCE004MiniGameStageSeedTable');
  const times = ctx.table('EventCE004MiniGameStageTimeTable');
  const positions = ctx.table('EventCE004MiniGameSkillPositionTable');
  const buffs = ctx.table('EventCE004MiniGameBuffTable');
  const missions = ctx.table('EventCE004MiniGameMissionTable');
  const helpList = ctx.table('EventCE004MiniGameHelpTipListTable');
  const currency = name(main.upgrade_currency_name, 'Trait Point');

  const stageLabel = (s) => `${name(`Locale_Event:ce004_mini_game_stage_difficulty_${s.stage_difficulty.toLowerCase()}`, s.stage_difficulty).replace('Chall.', 'Challenge')} ${s.stage_level}`;
  // The Rapture's own name: challenge stages all carry the generic "Challenge" stage name.
  const stageCell = (s) => ({ img: ctx.img(String(monsters.get(s.spawn_monster_id)?.monster_prefab).replace('ce004_', 'ce004_monster_')) || ctx.img(s.resource_id), caption: name(monsters.get(s.spawn_monster_id)?.name_localkey) || name(s.name_localkey, stageLabel(s)), size: 'small' });

  // What a Rapture can do: its skill group lists the hints it may show.
  const actions = (group) => monSkills.filter((m) => m.skill_group === group).map((m) => typeCell(m.skill_type));
  // The battle script: a fixed list of turns ("Order") or turns drawn at random from the group.
  const script = (s) => {
    const list = seeds.filter((x) => x.group === s.seed_group);
    const most = Math.max(0, ...list.map((x) => x.hint_count));
    return `${s.seed_type === 'Order' ? 'Fixed order' : 'Random'}, ${list.length} turn patterns, up to ${most} action${most > 1 ? 's' : ''} per turn`;
  };
  const unlock = (s) => (s.ce004_open_condition_type_group_data || []).filter((c) => c.open_condition_type !== 'None').map((c) => {
    if (c.open_condition_type === 'EventCE004MiniGameDataClear') {
      const p = stageById.get(c.open_condition_value);
      return p ? `Clear ${stageLabel(p)}` : `Clear stage ${c.open_condition_value}`;
    }
    if (c.open_condition_type === 'EventDay') return `Event day ${c.open_condition_value}`;
    return `${c.open_condition_type} ${c.open_condition_value}`;
  }).join(', ') || 'Open from the start';
  const timeGroup = (g) => times.filter((t) => t.group === g);

  const stageRows = (list) => list.map((s) => {
    const m = monsters.get(s.spawn_monster_id);
    const tg = timeGroup(s.time_group);
    return [
      { b: stageLabel(s) },
      stageCell(s),
      m ? m.hp : '',
      m ? m.attack : '',
      m ? actions(m.skill_group) : [],
      [script(s), tg.length ? `Hint time shrinks in ${tg.length - 1} steps, every ${[...new Set(tg.map((t) => t.battle_count_condition))].join(' / ')} battles` : ''].filter(Boolean),
      s.clear_reward_count || '—',
      unlock(s),
    ];
  });
  const stageColumns = ['Stage', 'Rapture', { label: 'HP', num: true }, { label: 'ATK', num: true }, 'Possible actions', 'Pattern', { label: currency, num: true }, 'Unlock'];

  const stagesPage = (mgr, id, title, summary) => {
    const list = stages.filter((s) => s.manager_id === mgr.id);
    return {
      id,
      title,
      group: 'Stages',
      count: list.length,
      summary,
      sections: DIFF.map((d) => {
        const ds = list.filter((s) => s.stage_difficulty === d).sort((a, b) => a.stage_level - b.stage_level);
        if (!ds.length) return null;
        const first = ds[0];
        return {
          type: 'table',
          title: d,
          note: d === 'Challenge'
            ? `${name('Locale_Event:ce004_stage_challenge_desc')} Levels follow one after another; each Rapture has only ${monsters.get(first.spawn_monster_id)?.hp ?? '?'} HP, but after level ${mgr.challenge_last_stage_level} the run repeats from level ${mgr.challenge_repeat_stage_level} with stronger Raptures (ATK +${pct(mgr.challenge_increase_monster_attack)}, HP +${pct(mgr.challenge_increase_monster_hp)} each time, as read from the settings). In later levels the answer buttons are spun around.`
            : name(first.description_localkey).replace(/\n/g, ' '),
          columns: stageColumns,
          rows: stageRows(ds),
        };
      }).filter(Boolean),
    };
  };

  // Traits: three trees of three, five levels each; a trait opens once the one before is maxed.
  const traitTree = (mgr) => ['Attack', 'Defence', 'Util'].map((cat) => {
    const list = buffs.filter((b) => b.manager_id === mgr.id && b.category === cat);
    const groups = [...new Set(list.map((b) => b.buff_group))];
    return {
      type: 'table',
      title: name(`Locale_Event:ce004_mini_game_buff_category_${cat.toLowerCase()}`, CATEGORY[cat]),
      columns: ['Trait', 'Effect per level', { label: 'Cost', num: true }, 'Requires'],
      rows: groups.map((g) => {
        const lv = list.filter((b) => b.buff_group === g).sort((a, b) => a.buff_level - b.buff_level);
        const b = lv[0];
        const req = buffs.find((x) => x.id === b.condition_skill_id);
        const traitName = (x) => name(x.name_localkey).replace('{0}', x.buff_level);
        return [
          { img: ctx.img(b.resource_id), caption: name(b.name_localkey).replace(/\s*Lv\. \{0\}/, ''), size: 'small' },
          lv.map((x) => `Lv. ${x.buff_level}: ${name(x.description_localkey).replace('{0}', +(x.buff_value / 100).toFixed(2))}`),
          `${b.need_upgrade_currency} per level`,
          req ? traitName(req) : '—',
        ];
      }),
    };
  });

  const missionText = (m) => name(m.mission_localkey, m.mission_type).replace('{0}', m.mission_count.toLocaleString('en-US'));
  const missionRows = (cat) => missions.filter((m) => m.mission_category === cat).map((m) => [
    missionText(m),
    m.reward_type === 'DailyPoint' ? `${m.reward_value} mission points` : { reward: ctx.reward(m.reward_value) },
  ]);

  const mainChars = characters.filter((c) => c.manager_id === main.id);
  // The help lists name help-tip groups directly (MinigameHelpTipDescTable), not a hub group,
  // so ctx.help can't be used; the pages are built here in the same shape.
  const tipPages = ctx.table('MinigameHelpTipDescTable');
  const helpGroup = (g) => {
    const pages = tipPages.filter((d) => d.group_id === g).sort((a, b) => a.order - b.order)
      .map((d) => ({ title: name(d.helptip_title), image: ctx.img(d.helptip_image) || d.helptip_image || null, text: name(d.helptip_description) }));
    return pages.length ? { title: pages[0].title, pages } : null;
  };
  const helpSection = (groups) => {
    const help = [...new Set(groups)].map(helpGroup).filter(Boolean);
    return help.length ? { type: 'help', help } : null;
  };
  const helpSections = [
    helpSection(helpList.filter((h) => h.manager_id === main.id).map((h) => h.help_tip_group_id)),
    // Stage tips (one set per difficulty), shown on the stage info screen.
    helpSection(stages.filter((s) => s.manager_id === main.id).map((s) => s.help_tip_id)),
  ].filter(Boolean);

  return {
    summary: 'Read the Rapture’s hints and answer each with the right attack or defence button; correct answers deal damage, block attacks and charge a Burst Skill.',
    overview: [
      {
        type: 'facts',
        title: 'How it plays',
        items: [
          ['Turns', 'Each turn the Rapture shows one to three hints. Pick the matching buttons before time runs out. Attack hints (core or a side part exposed) let you hit it; defence hints (missiles, beams) must be blocked or you take damage.'],
          ['Buttons', types.map((t) => [typeCell(t.skill_type), KIND[t.category]]).flat()],
          ['Difficulty', 'Easy Raptures only expose their core or fire missiles; Normal adds the left and right parts; Hard adds left and right beams and up to three actions per turn.'],
          ['Burst', `Every right answer fills the Burst Gauge (${main.burst_charge_min.toLocaleString('en-US')}, or ${main.burst_charge_max.toLocaleString('en-US')} for a PERFECT, out of ${main.burst_max.toLocaleString('en-US')}). When it is full, the character’s Burst Skill deals heavy damage.`],
          ['Charge bonus', `Each successful defence adds a charge that boosts your next attack (+${pct(main.charging_increase_attack)} per charge); a wrong answer resets it.`],
          ['Winning', 'Bring the Rapture’s HP to 0 before yours runs out. Clearing an Easy, Normal or Hard stage gives Trait Points.'],
          ['Daily reward', main.daily_reward_id ? [`Deal ${main.daily_reward_point.toLocaleString('en-US')} damage in a day:`, { reward: ctx.reward(main.daily_reward_id) }] : null],
          ['Challenge', 'An endless run against ever stronger Raptures; your highest damage counts for the Union ranking.'],
          ['Intro story', ctx.intro ? { scene: ctx.intro.id, label: ctx.intro.label } : null],
        ],
      },
      { type: 'gallery', title: 'Pilots', items: mainChars.map((c) => ({ img: ctx.img(c.resource_id), caption: name(c.name_localkey) })) },
    ],
    pages: [
      helpSections.length && { id: 'guide', title: 'How to play', sections: helpSections },
      {
        id: 'pilots',
        title: 'Pilots',
        group: 'Characters',
        count: mainChars.length,
        summary: 'Pick one pilot per run. Rei and Mari join on later event days.',
        sections: mainChars.map((c) => {
          const sk = chaSkills.filter((s) => s.skill_group === c.skill_group);
          const burst = sk.find((s) => s.skill_type === 'BurstSkill');
          return {
            type: 'facts',
            title: name(c.name_localkey),
            items: [
              ['', { img: ctx.img(c.resource_id), size: 'large' }],
              ['', name(c.description_localkey)],
              ['ATK', c.attack],
              ['HP', c.hp],
              ['Hits per answer', sk.filter((s) => s.skill_type !== 'BurstSkill').map((s) => `${typeBy.has(s.skill_type) ? name(typeBy.get(s.skill_type).name_localkey) : s.skill_type}: ${s.hit_count} hit${s.hit_count > 1 ? 's' : ''}`)],
              ['Burst Skill', burst ? `Power ${burst.skill_damage.toLocaleString('en-US')}, ${burst.hit_count} hit${burst.hit_count > 1 ? 's' : ''}, aimed at the core` : null],
              ['Available', c.event_day ? `From event day ${c.event_day}` : 'From the start'],
              ['When they lose', ctx.img(c.fail_speech_bubble) ? { img: ctx.img(c.fail_speech_bubble), size: 'small' } : null],
            ],
          };
        }),
      },
      stagesPage(main, 'stages', 'Stages', 'Each stage has one Rapture. HP and ATK are its stats; the pattern says how its turns are chosen.'),
      {
        id: 'traits',
        title: 'Traits',
        group: 'Progress',
        count: new Set(buffs.filter((b) => b.manager_id === main.id).map((b) => b.buff_group)).size,
        summary: `${name(main.upgrade_currency_description)}: permanent upgrades bought with ${currency}s from stage clears. Traits can be reset.`,
        sections: traitTree(main),
      },
      {
        id: 'missions',
        title: 'Missions',
        group: 'Progress',
        count: missions.length,
        sections: [
          { type: 'table', title: 'Daily missions', note: 'Each gives mission points; the point milestones below give the rewards.', columns: ['Mission', 'Reward'], rows: missionRows('DailyMission') },
          { type: 'table', title: 'Daily point rewards', columns: ['Points', 'Reward'], rows: missionRows('DailyPoint') },
          { type: 'table', title: 'Achievements', columns: ['Mission', 'Reward'], rows: missionRows('Achievement') },
        ],
      },
      rerun && stagesPage(rerun, 'stages-rerun', 'Stages (rerun)', 'The shorter archive version: three Easy stages, and Rei and Mari unlocked by clearing Easy 3 and Normal 7 instead of by event day.'),
    ].filter(Boolean),
  };
}

module.exports = { build };
