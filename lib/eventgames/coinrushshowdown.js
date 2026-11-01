// Three Company Rumble (EventPunch*): an endless side-on brawler. Your bunny girl walks and
// punches on her own; you only turn her around (and fire an Ultimate). Enemy bunny girls come
// from both sides, coins and power-ups drop, and hazards (thunder, lasers, oil) appear as the
// levels go up. Each level lasts 10 s; after the last level the game keeps looping near the end.
// Times in these tables are in milliseconds; spawn rates are weights out of the group total.

const sec = (ms) => `${+(ms / 1000).toFixed(2)} s`;
const num = (v) => Number(v).toLocaleString('en-US');
const pct = (part, total) => `${+(100 * part / total).toFixed(1)}%`;
const fill = (s, ...args) => args.reduce((t, a, i) => t.replace(`{${i}}`, a), s);
const title = (s) => s.replace(/(^|_)([a-z])/g, (_, sp, c) => (sp ? ' ' : '') + c.toUpperCase());

function helpGroup(ctx, group) {
  return ctx.table('MinigameHelpTipDescTable').filter((d) => d.group_id === group).sort((a, b) => a.order - b.order)
    .map((d) => ({ title: ctx.plain(d.helptip_title), pages: [{ title: ctx.plain(d.helptip_title), image: ctx.img(d.helptip_image), text: ctx.plain(d.helptip_description) }] }));
}

// Enemy behaviour, worked out from each type's timing fields.
function behaviour(x) {
  switch (x.type) {
    case 'Normal': return 'Walks straight at you.';
    case 'Counterattack': return `Stops in front of you and winds up (${sec(x.counter_casting_time)}) before striking back.`;
    case 'Jump': return `Leaps ${x.jump_move_distance_x} units forward over ${sec(x.jump_move_time)}, so it can land behind you.`;
    case 'Zigzag': return `Advances for ${sec(x.zigzag_forward_time)}, backs off for ${sec(x.zigzag_reverse_time)}, and repeats.`;
    case 'Knockback': return `Fast; its hit knocks you back ${x.knockback_distance_x} units over ${sec(x.knockback_time)}.`;
    case 'Drop': return `Drops onto the field from above (${sec(x.drop_time)}).`;
    case 'Sniper': return `Stays back about ${x.sniper_move_distance} units and fires after a ${sec(x.sniper_charge_time)} charge.`;
    case 'CouplePole': return 'Arrives as a pair (Blanc and Noir) holding a pole between them.';
    default: return '';
  }
}

const ITEM_TEXT = {
  GetScore: (i) => `${num(i.score_value)} points`,
  Web: (i) => `Slows enemies by ${i.function_rate}% for ${sec(i.duration_time)}`,
  GoldClover: (i) => `${num(i.score_value)} points, then +${i.function_rate}% to all points for ${sec(i.duration_time)}`,
  EnergyDrink: (i) => `+1 Ultimate stack (max 2); ${num(i.score_value)} points instead when already full`,
};
const ITEM_NAME = { Web: 'Net', GoldClover: 'Golden four-leaf clover', EnergyDrink: 'Energy drink' };
const HAZARD = {
  Thunder: { img: 'tcr_panelty_thunder', name: 'Thunder', what: (v) => `${v} lightning strike(s)` },
  Laser: { img: 'tcr_panelty_laser', name: 'Laser', what: (v) => `strength ${num(v)} (unit unclear)` },
  Oil: { img: 'tcr_panelty_oil', name: 'Oil slick', what: (v) => `strength ${num(v)} (unit unclear)` },
};

function build(ctx) {
  const m = ctx.table('EventPunchManagerTable')[0];
  const chars = ctx.table('EventPunchCharacterTable').filter((c) => c.group_id === m.character_group_id).sort((a, b) => a.order - b.order);
  const charName = (c) => ctx.plain(c?.name_localkey, c?.resource_id || '?');
  const skills = ctx.table('EventPunchSkillTable').filter((s) => s.group_id === m.skill_group_id).sort((a, b) => a.order - b.order);
  const combos = ctx.table('EventPunchComboTable').filter((c) => c.group_id === m.combo_group_id).sort((a, b) => a.step - b.step);
  const items = ctx.table('EventPunchItemTable').filter((i) => i.group_id === m.item_group_id);
  const itemById = new Map(items.map((i) => [i.id, i]));
  const coinNo = (i) => items.filter((x) => x.item_type === 'GetScore').indexOf(i) + 1;
  const itemName = (i) => (i.item_type === 'GetScore' ? `Coin ${coinNo(i)}` : ITEM_NAME[i.item_type] || i.item_type);
  const itemCell = (i) => ({ img: ctx.img(i.resource_id), caption: itemName(i), size: 'small' });
  const itemSpawns = ctx.table('EventPunchItemSpawnTable');
  const monsters = ctx.table('EventPunchMonsterTable').filter((x) => x.group_id === m.monster_group_id);
  const monById = new Map(monsters.map((x) => [x.id, x]));
  // No names in the tables: "tcr_monster_folkwang" -> "Folkwang", "tcr_monster_normal_3" -> "Bunny girl 3".
  const monName = (x) => {
    const r = x.resource_id.replace(/^tcr_monster_/, '');
    return /^normal_\d+$/.test(r) ? `Bunny girl ${r.split('_')[1]}` : title(r);
  };
  const monSpawns = ctx.table('EventPunchMonsterSpawnTable');
  const penalties = ctx.table('EventPunchPenaltyActiveTable');
  const levels = ctx.table('EventPunchLevelTable').filter((l) => l.group_id === m.level_group_id).sort((a, b) => a.level - b.level);
  const missions = ctx.table('EventPunchMissionTable').filter((x) => x.group_id === m.mission_group_id);
  const cutscenes = ctx.table('EventPunchCutSceneTable').filter((c) => c.group_id === m.cutscene_group_id);

  const ranks = ['s', 'a', 'b', 'c', 'd'].map((r) => [r.toUpperCase(), m[`${r}_rank_target_score`]]).concat([['F', 0]]);
  const levelTime = levels[0]?.play_time || 10000;
  const unlockDay = (d) => (d ? `${d} days after the event opens` : 'From the start');

  // Levels grouped into phases that share enemy count, enemy pool and coin mix.
  const phases = [];
  for (const l of levels) {
    const key = `${l.monster_spawn_count}/${l.monster_spawn_group}/${l.ground_item_spawn_group}`;
    const last = phases[phases.length - 1];
    if (last && last.key === key) last.levels.push(l);
    else phases.push({ key, levels: [l] });
  }
  const range = (ls) => (ls.length > 1 ? `${ls[0].level}–${ls[ls.length - 1].level}` : `${ls[0].level}`);

  // A spawn group as a list of "name — chance" rows.
  const poolTable = (titleText, rows, group, total, cell) => ({
    type: 'table',
    title: titleText,
    columns: ['', { label: 'Chance', num: true }],
    rows: rows.filter((r) => r.group_id === group).map((r) => [cell(r), pct(r.rate, total(group))]),
  });
  const groupTotal = (rows) => (g) => rows.filter((r) => r.group_id === g).reduce((n, r) => n + r.rate, 0);
  const monGroups = [...new Set(monSpawns.map((s) => s.group_id))];
  const itemGroups = [...new Set(itemSpawns.map((s) => s.group_id))].filter((g) => g !== 99);
  const penGroups = [...new Set(penalties.map((s) => s.group_id))];

  const missionText = (x) => fill(ctx.plain(x.mission_localkey, x.mission_type), num(x.mission_value));

  return {
    summary: 'Turn your bunny girl left and right to punch away the rival bunny girls closing in from both sides, grab coins and survive as long as you can.',
    overview: [
      {
        type: 'facts',
        title: 'A run',
        items: [
          ['Controls', 'Your Nikke walks and punches on her own. Tap (Space on PC) to turn around; the Ultimate button (Enter) fires her Ultimate Skill.'],
          ['Health', `${chars[0]?.max_hp} HP; after being hit you are invincible for ${sec(m.invincible_time)}. The run ends at 0 HP.`],
          ['Turning', `Briefly defenceless for ${sec(chars[0]?.delay_time_after_turn || 0)} after each turn.`],
          ['Levels', `A new level every ${sec(levelTime)} with more enemies and, later, hazards. After level ${levels.length} play continues from level ${m.endpoint_loop_level}.`],
          ['Daily reward', [`Score ${num(m.daily_reward_score)} in one run:`, { reward: ctx.reward(m.daily_reward_id) }]],
          ['Intro story', ctx.intro ? { scene: ctx.intro.id, label: ctx.intro.label } : null],
        ],
      },
      {
        type: 'facts',
        title: 'Scoring',
        items: [
          ['Enemy knocked out', `${num(m.enemy_kill_score)} points`],
          ['SPIN!', `Knock out an enemy, turn and knock out one on the other side: +${m.spin_attack_bonus_ratio}% bonus`],
          ['Combo', `Each knock-out within ${sec(m.combo_time)} of the last keeps the combo going; higher combos add a bonus (see Combos)`],
          ['Coins and items', 'Coins dropped on the ground give points (see Items)'],
        ],
      },
      {
        type: 'table',
        title: 'Ranks',
        columns: ['Rank', { label: 'Score', num: true }],
        rows: ranks.map(([r, s]) => [{ b: r }, s]),
      },
      { type: 'gallery', title: 'Ultimate Skills', items: chars.map((c) => ({ img: ctx.img(c.ultimate_skill_resource_id), caption: charName(c) })) },
    ],
    pages: [
      { id: 'guide', title: 'How to play', sections: [{ type: 'help', help: helpGroup(ctx, m.tutorial_id) }] },
      {
        id: 'characters',
        title: 'Characters',
        count: chars.length,
        sections: [{
          type: 'table',
          note: 'Speed and Range are the 1–3 star ratings shown in the selection screen; the in-game values are in brackets.',
          columns: ['Nikke', { label: 'HP', num: true }, 'Speed', 'Range', 'Ultimate Skill', 'Available'],
          rows: chars.map((c) => [
            { b: charName(c) },
            c.max_hp,
            `${'★'.repeat(c.move_speed_info)} (${c.move_speed_ingame})`,
            `${'★'.repeat(c.attack_collider_info)} (${c.attack_collider_x_ingame})`,
            [{ img: ctx.img(c.ultimate_skill_resource_id), size: 'small' }, ctx.plain(c.ultimate_skill_desc_localkey),
              c.ultimate_skill_time ? { text: `Lasts ${sec(c.ultimate_skill_time)}, +${c.ultimate_skill_value}% speed`, sub: `Up to ${c.max_ultimate_skill} stacks` } : { text: `Up to ${c.max_ultimate_skill} stacks`, sub: '' }],
            unlockDay(c.unlock_time),
          ]),
        }],
      },
      {
        id: 'special-skills',
        title: 'Special Skills',
        count: skills.length,
        summary: 'Passive bonuses. Every unlocked Special Skill applies at once.',
        sections: [{
          type: 'table',
          columns: ['Skill', 'Effect', 'Unlock'],
          rows: skills.map((s) => [
            { img: ctx.img(s.resource_id), caption: ctx.plain(s.name_localkey), size: 'small' },
            s.skill_type === 'ComboTimerPlus' ? `${ctx.plain(s.description_localkey)} (+${sec(s.skill_value)}, to ${sec(m.combo_time + s.skill_value)})` : ctx.plain(s.description_localkey),
            `${unlockDay(s.unlock_time)}, then collect ${s.unlock_getscore_item_count} coins of any kind`,
          ]),
        }],
      },
      {
        id: 'combos',
        title: 'Combos',
        count: combos.length,
        sections: [{
          type: 'table',
          note: `The combo grows with each knock-out made within ${sec(m.combo_time)} of the previous one. The bonus is added to points earned while the combo lasts (most likely a percentage).`,
          columns: ['Step', { label: 'Combo', num: true }, { label: 'Bonus', num: true }],
          rows: combos.map((c) => [c.step, `${c.need_combo}+`, c.combo_score_bonus ? `+${c.combo_score_bonus}` : '—']),
        }],
      },
      {
        id: 'items',
        title: 'Items',
        count: items.length,
        sections: [
          {
            type: 'table',
            note: `An item appears on the ground every ${sec(m.ground_item_spawn_interval)}; it stays for ${sec(m.item_retention_time)} and flashes for the last ${sec(m.before_vanish_item_flashing_time)}. Energy drinks fall from the sky on some levels (see Levels).`,
            columns: ['Item', 'Effect'],
            rows: items.map((i) => [itemCell(i), (ITEM_TEXT[i.item_type] || (() => ''))(i)]),
          },
          ...itemGroups.map((g) => poolTable(`Ground item mix ${g}`, itemSpawns, g, groupTotal(itemSpawns), (r) => itemCell(itemById.get(r.item_id)))),
        ],
      },
      {
        id: 'enemies',
        title: 'Enemies',
        count: monsters.length,
        sections: [
          {
            type: 'table',
            note: 'Behaviour is read from each enemy type’s timing values. Speed is in game units per second.',
            columns: ['Enemy', 'Type', { label: 'Speed', num: true }, 'Behaviour'],
            rows: monsters.map((x) => [{ b: monName(x) }, x.type, x.monster_speed, behaviour(x)]),
          },
          ...monGroups.map((g) => poolTable(`Enemy mix ${g}`, monSpawns, g, groupTotal(monSpawns), (r) => monName(monById.get(r.monster_id) || { resource_id: '?' }))),
        ],
      },
      {
        id: 'hazards',
        title: 'Hazards',
        sections: [
          {
            type: 'facts',
            note: 'Each hazard flashes a warning before it hits.',
            items: [
              ['Thunder', [{ img: ctx.img(HAZARD.Thunder.img), size: 'small' }, `Warning ${sec(m.thunder_attack_casting_time)}, then strikes; ${sec(m.thunder_attack_interval)} between strikes`]],
              ['Laser', [{ img: ctx.img(HAZARD.Laser.img), size: 'small' }, `Warning ${sec(m.laser_attack_casting_time)}, then fires for ${sec(m.laser_attack_up_time)}`]],
              ['Oil slick', [{ img: ctx.img(HAZARD.Oil.img), size: 'small' }, `Makes you slide ${m.oil_slide_distance} units (${sec(m.oil_slide_time)})`]],
            ],
          },
          ...penGroups.map((g) => poolTable(`Hazard mix ${g}`, penalties, g, groupTotal(penalties), (r) => `${HAZARD[r.penalty_type]?.name || r.penalty_type}: ${(HAZARD[r.penalty_type]?.what || String)(r.penalty_value)}`)),
        ],
      },
      {
        id: 'levels',
        title: 'Levels',
        count: levels.length,
        summary: `Each level lasts ${sec(levelTime)}; level n starts at ${sec(levelTime)} × (n − 1).`,
        sections: [{
          type: 'table',
          note: 'Enemy, item and hazard mixes are listed on the Enemies, Items and Hazards pages.',
          columns: ['Levels', 'Starts at', { label: 'Enemies per level', num: true }, 'Enemy mix', 'Item mix', 'Hazards', 'Energy drink drops'],
          rows: phases.map((p) => {
            const haz = p.levels.filter((l) => l.penalty_group);
            const drink = p.levels.filter((l) => l.air_item_spawn_group);
            return [
              { b: range(p.levels) },
              `${Math.round((p.levels[0].level - 1) * levelTime / 1000)} s`,
              p.levels[0].monster_spawn_count,
              { page: 'enemies', label: `Mix ${p.levels[0].monster_spawn_group}` },
              { page: 'items', label: `Mix ${p.levels[0].ground_item_spawn_group}` },
              haz.map((l) => `Level ${l.level}: ${l.penalty_count} from mix ${l.penalty_group}`),
              drink.map((l) => `Level ${l.level}`),
            ];
          }),
        }],
      },
      {
        id: 'missions',
        title: 'Missions',
        count: missions.length,
        sections: [{ type: 'table', columns: ['Mission', 'Reward'], rows: missions.map((x) => [missionText(x), { reward: ctx.reward(x.reward_id) }]) }],
      },
      {
        id: 'album',
        title: 'Album',
        count: cutscenes.length,
        summary: 'End-of-run cartoons, collected by finishing a run with the given Nikke and rank.',
        sections: [{
          type: 'table',
          columns: ['Cartoon', 'Caption', 'Nikke', 'Rank'],
          rows: cutscenes.map((c) => [
            { img: ctx.img(c.cutscene_resource), size: 'large' },
            ctx.plain(c.cutscene_description),
            charName(chars.find((x) => x.id === c.condition_character)),
            c.condition_rank,
          ]),
        }],
      },
    ],
  };
}

module.exports = { build };
