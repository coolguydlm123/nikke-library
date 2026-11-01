// Shared viewer for the "merge weapons, hold the barricade" survivor shooter that ran twice:
// Salvation Breakers (CE007, Event BH*) and FIGHT! ARK RANGER (Event FAR*). Both games use the
// same table layout; only the prefix (BH / FAR) and the locale key stem (event_bh_ / event_far_)
// differ, plus a few columns ARK RANGER added (summon weapons, trait refreshes, burst scaling).
//
// How a run plays: monsters walk down at a barricade for 99 (BH) or 100 (FAR) waves. Your
// character fires every weapon placed in a grid inventory automatically; you only trigger the
// Burst Skill. Between waves a shop offers random weapons: drag them into the grid (each weapon
// has a Tetris-like shape), stack two equal weapons of the same rarity to merge them one rarity up
// (Lv 1-4). Kills give EXP (level-ups offer a choice of traits), gold (shop refreshes, and the
// permanent upgrades outside runs) and points (the score).
//
// Units: times are in 1/100 s (reload 600 = 6 s, Burst cooldown 2000 = 20 s); ranges and speeds
// are in the game's own distance units; ratios (wave HP / ATK / DEF, point and gold ratio) are %.

const sec = (cs) => `${+(cs / 100).toFixed(2)} s`;
const num = (n) => Number(n).toLocaleString('en-US');
const ROMAN = { 1: 'I', 2: 'II', 3: 'III' };
const MONSTER_TYPE = { Minion: { tag: 'Minion' }, Elite: { tag: 'Elite', tone: 'accent' }, Boss: { tag: 'Boss', tone: 'bad' } };
// weapon_atk_type: how the weapon fires (names read from the enum; the summon ones are robots).
const ATTACK = {
  Projectile: 'Bullets',
  ProjectileMultiShot: 'Spread shot',
  ProjectileBomb: 'Explosive shell',
  Range: 'Cone attack',
  GuidedProjectileBomb: 'Missile barrage (robot)',
  ProjectileReturn: 'Boomerang (robot)',
  ProjectileSlowDown: 'Slowing shot',
  ProjectileBounce: 'Bouncing blades (robot)',
  ProjectileDoublePistol: 'Twin pistols (robot)',
};
const SKILL_TYPE = { CarpetBombing: 'Bombing', Support: 'Repair + faster reload', Knockback: 'Knockback', LaserBeam: 'Laser beam', GravityBomb: 'Gravity bomb' };

// "Text {0} and {1}" with the values filled in.
const fill = (text, values) => text.replace(/\{(\d+)\}/g, (m, i) => (values[+i] != null ? num(values[+i]) : m));
// Trailing zeros dropped: [5, 25, 300, 0, 0] -> "5 / 25 / 300".
const valueList = (values) => {
  const v = [...values];
  while (v.length && !v[v.length - 1]) v.pop();
  return v.join(' / ');
};
// A grid of 0/1/2 slots as monospace lines.
const grid = (rows, glyph) => rows.map((r) => ({ key: r.map(glyph).join('') }));

function buildSurvivor(ctx, prefix, opts = {}) {
  const t = (name) => ctx.table(`Event${prefix}${name}Table`);
  const stem = `Locale_Event:event_${prefix.toLowerCase()}_`;
  const L = (key, fallback = '') => ctx.plain(`${stem}${key}`, fallback);
  const m = t('Manager')[0];

  // ---- Weapons: one row per (weapon group, rarity level) ----
  const weapons = t('Weapon');
  const groups = [...new Set(weapons.map((w) => w.group_id))].sort((a, b) => a - b);
  const levelsOf = (g) => weapons.filter((w) => w.group_id === g).sort((a, b) => a.weapon_level - b.weapon_level);
  const first = (g) => levelsOf(g)[0];
  const weaponName = (g) => ctx.plain(first(g)?.name_locale, `Weapon ${g}`);
  // Sub-weapons have no icon; their big picture (weapon_resource) is the only art.
  const weaponPic = (w) => ctx.img(w.weapon_icon) || ctx.img(w.weapon_resource);
  const weaponCell = (g, size = 'small') => {
    const w = first(g);
    return w ? { img: weaponPic(w), caption: weaponName(g), size } : `Weapon ${g}`;
  };
  const isMain = (g) => first(g).weapon_type !== 'Subweapon';
  const mainGroups = groups.filter(isMain);
  const subGroups = groups.filter((g) => !isMain(g));
  const tag = (w) => L(`weapon_tag_${w.weapon_tag.toLowerCase()}`, w.weapon_tag);
  const unlockDay = (d) => (d ? `Day ${d + 1} of the event` : '');

  // Weapon shapes: WeaponShapeTable group = weapon_size; trimmed to the used columns.
  const shapes = t('WeaponShape');
  const shape = (id) => {
    const rows = shapes.filter((s) => s.group_id === id).sort((a, b) => a.row_number - b.row_number).map((s) => s.slot.map((x) => x.slot));
    const width = Math.max(0, ...rows.map((r) => r.lastIndexOf(1) + 1));
    return grid(rows.map((r) => r.slice(0, width)), (x) => (x ? '■' : '·'));
  };
  const cells = (id) => shapes.filter((s) => s.group_id === id).reduce((n, s) => n + s.slot.filter((x) => x.slot).length, 0);

  // A weapon's skills: skill_data_01, _02, ... each [{ skill_type_NN, skillvalue_NN, skill_description_locale_NN }].
  const skillsOf = (w) => Object.keys(w).filter((k) => /^skill_data_\d+$/.test(k)).flatMap((k) => {
    const n = k.slice(-2);
    return (w[k] || []).filter((s) => s[`skill_type_${n}`] && s[`skill_type_${n}`] !== 'None').map((s) => ({
      type: s[`skill_type_${n}`],
      values: (s[`skillvalue_${n}`] || []).map((v) => v[`skill_value_${n}`]),
      text: ctx.plain(s[`skill_description_locale_${n}`], ''),
    }));
  });
  const skillText = (s) => {
    let v = s.values;
    // The tool set's text is "restores {1} HP every {0} sec" but its values are [HP, time in 1/100 s].
    if (s.type === 'BarricadeHpRecovery') v = [v[1] / 100, v[0]];
    if (/\{\d\}/.test(s.text)) return fill(s.text, v);
    const raw = valueList(s.values);
    return raw ? { text: s.text || s.type, sub: `values: ${raw}` } : (s.text || s.type);
  };
  const shots = (w) => {
    if (w.total_proj_amount > w.one_shot_proj_amount) {
      return `${w.total_proj_amount} (${w.one_shot_proj_amount} at a time, ${sec(w.proj_atk_term)} apart)`;
    }
    return w.weapon_atk_type === 'Range' ? `${sec(w.range_atk_duration)} cone (${w.range_atk_angle}°), hits every ${sec(w.range_atk_term)}` : `${w.one_shot_proj_amount}`;
  };
  const extras = (w) => [
    w.proj_pierce && 'pierces',
    w.contact_explosion && `explodes (radius ${w.explosion_range})`,
    w.proj_knockback_value && `knockback ${w.proj_knockback_value}`,
  ].filter(Boolean).join(', ');

  const mainWeaponSection = (g) => {
    const lv = levelsOf(g);
    const w = lv[0];
    return {
      type: 'table',
      title: weaponName(g),
      note: [ctx.plain(w.description_locale), `${tag(w)} · ${ATTACK[w.weapon_atk_type] || w.weapon_atk_type} · targets ${L(`focus_target_${w.focus_target_type.toLowerCase()}`, w.focus_target_type)} · range ${w.atk_start_range}`,
        w.weapon_open_date ? `Unlocks on ${unlockDay(w.weapon_open_date).toLowerCase()}.` : ''].filter(Boolean).join('\n'),
      columns: ['Rarity', { label: 'ATK', num: true }, { label: 'Reload', num: true }, 'Shots per reload', 'Skills'],
      rows: lv.map((x) => [
        { b: `Lv ${x.weapon_level}` },
        x.weapon_atk,
        sec(x.weapon_reload_time),
        [shots(x), extras(x)].filter(Boolean).join('\n'),
        skillsOf(x).map(skillText),
      ]),
    };
  };

  // ---- Characters ----
  const chars = t('Character').filter((c) => c.group_id === m.character_group_id);
  const charName = (c) => ctx.plain(c.name_locale, `Character ${c.id}`);
  const inventory = t('Inventory');
  const invRows = (g) => inventory.filter((r) => r.group_id === g).sort((a, b) => a.row_number - b.row_number).map((r) => r.slot.map((s) => s.slot))
    .filter((r) => r.some(Boolean));
  const levels = t('CharacterLevel');
  const inGame = new Map(t('InGamePassive').map((r) => [r.id, r]));
  const SLOTS = ['first', 'second', 'third', 'fourth'];

  // ---- Traits (Passive table): OutGame = permanent upgrades, InGame = level-up choices ----
  const passives = t('Passive');
  const outGame = passives.filter((p) => p.passive_type === 'OutGame');
  const inGameTraits = passives.filter((p) => p.passive_type === 'InGame');
  const firstVal = (p) => p.passive_skill_value.map((v) => v.skill_value);
  const linked = (p) => p.link_weapon_group_id.filter(Boolean).map((g) => weaponName(g)).join(', ');

  // The pools a character draws traits from: CharacterLevel -> InGamePassive slots -> passive groups.
  const poolsOf = (expGroup) => [...new Set(levels.filter((l) => l.group_id === expGroup).flatMap((l) => {
    const r = inGame.get(l.level_up_select_passive_id);
    return r ? SLOTS.flatMap((s) => r[`${s}_slot_use_passive_group_id`]) : [];
  }))].sort((a, b) => a - b);
  // Pools come in sets of three phases (101-103, 201-203 ...); one set per trait list.
  const series = [...new Set(inGameTraits.map((p) => Math.floor(p.group_id / 100)))].sort((a, b) => a - b);
  const seriesUsers = (s) => chars.filter((c) => poolsOf(c.character_exp_group).some((g) => Math.floor(g / 100) === s));

  // Out-game upgrade effects in plain words; descriptions in the locale carry no numbers.
  const upgradeEffect = (p) => {
    const v = firstVal(p);
    switch (p.skill_type) {
      case 'GainExpUp': return `+${v[0]}% EXP`;
      case 'GainGoldUp': return `+${v.filter(Boolean).join(' / ')} (probably minion / elite / boss gold; unit not stated)`;
      case 'AllWeaponAtkUp': return `+${v[0]}% weapon ATK`;
      case 'AddHighLevelWeaponAppearanceValue': return `Shop weight +${v[0]} for Lv 2${v[1] ? `, +${v[1]} for Lv 3` : ''}`;
      case 'MonsterEnhance': return `${v[0]}% chance of enhanced monsters (bonus values ${v.slice(1).join(' / ')})`;
      case 'AddBanCount': return `+${v[0]} weapon removal(s)`;
      case 'AddRerollCount': return `+${v[0]} free shop refreshes`;
      case 'AddPassiveRerollCount': return `+${v[0]} trait refreshes`;
      case 'HPUp': return `+${num(v[0])} barricade HP`;
      case 'AddInventoryUpgrade': return `+${v[0]} inventory expansion points at the start`;
      case 'AddSelectPassive': return `${v[0] / 100}% chance of a 4th trait option`;
      default: return valueList(v);
    }
  };
  const upgradeGroups = t('OutGamePassive').filter((o) => o.group_id === m.enhance_group_id).map((o) => o.use_passive_group_id);

  // ---- Waves ----
  const waves = t('Wave').filter((w) => w.group_id === m.use_wave_group_id).sort((a, b) => a.wave_order - b.wave_order);
  const presets = t('WavePreset');
  const monsters = new Map(t('Monster').map((x) => [x.id, x]));
  // Monsters have no names: label them by their model number; the small ones a splitter
  // breaks into are marked "(split)".
  const splitChildren = new Set([...monsters.values()].filter((x) => x.monster_skill_type === 'Split').map((x) => x.monster_skill_value[0].monster_skill_value));
  const monsterLabel = (id) => {
    const x = monsters.get(id);
    if (!x) return `Monster ${id}`;
    const n = (x.monster_resource.match(/(\d+)$/) || [])[1];
    return `${x.monster_type} ${n ? `#${+n}` : id}${splitChildren.has(id) ? ' (split)' : ''}`;
  };
  const range = (list, k) => {
    const v = list.map((r) => r[k]);
    const lo = Math.min(...v); const hi = Math.max(...v);
    return lo === hi ? `${num(lo)}%` : `${num(lo)}–${num(hi)}%`;
  };
  const backgrounds = t('BackGround').filter((b) => b.group_id === m.background_group_id);
  const waveById = new Map(waves.map((w) => [w.id, w]));
  const bgChange = new Map(backgrounds.map((b, i) => [waveById.get(b.change_background_wave_id)?.wave_order, i + 2]));
  const hasBurstRatio = waves.some((w) => w.burst_skill_damage_ratio != null);
  const lastWave = waves.filter((w) => !w.is_setting_step).length;

  const waveRows = waves.filter((w) => !w.is_setting_step).map((w) => {
    const spawns = presets.filter((p) => p.group_id === w.wave_preset_group_id);
    const counts = new Map();
    for (const s of spawns) counts.set(s.spawn_monster_id, (counts.get(s.spawn_monster_id) || 0) + 1);
    const big = [...counts].filter(([id]) => monsters.get(id)?.monster_type !== 'Minion');
    return [
      { b: w.wave_order },
      spawns.length,
      big.map(([id, n]) => ({ tag: `${monsterLabel(id)}${n > 1 ? ` ×${n}` : ''}`, tone: monsters.get(id)?.monster_type === 'Boss' ? 'bad' : 'accent' })),
      spawns.length ? sec(Math.max(...spawns.map((s) => s.monster_spawn_time))) : '',
      spawns.length ? range(spawns, 'monster_hp_ratio') : '',
      spawns.length ? range(spawns, 'monster_atk_ratio') : '',
      spawns.length ? range(spawns, 'monster_def_ratio') : '',
      spawns.length ? range(spawns, 'monster_move_speed_ratio') : '',
      `${w.point_and_gold_ratio}%`,
      ...(hasBurstRatio ? [`${w.burst_skill_damage_ratio}%`] : []),
      w.shop_group_id,
      [w.inventory_upgrade_point ? `+${w.inventory_upgrade_point} inventory points` : '', bgChange.has(w.wave_order) ? `new area (${bgChange.get(w.wave_order)})` : '', w.is_final_wave ? 'final wave' : ''].filter(Boolean).join('\n'),
    ];
  });

  // ---- Shop: weapon weights × rarity weights, per shop tier ----
  const shop = t('Shop');
  const tiers = [...new Set(shop.map((s) => s.group_id))].sort((a, b) => a - b);
  const tierWaves = (g) => {
    const list = waves.filter((w) => w.shop_group_id === g && !w.is_setting_step).map((w) => w.wave_order);
    return list.length ? `${Math.min(...list)}–${Math.max(...list)}` : (waves.some((w) => w.shop_group_id === g) ? 'start' : '');
  };
  const pct = (a, total) => (total ? `${+(100 * a / total).toFixed(1)}%` : '');
  const rarityRows = tiers.map((g) => {
    const s = shop.find((x) => x.group_id === g);
    const total = [1, 2, 3, 4].reduce((n, i) => n + s[`level_${i}_appearance_value`], 0);
    return [{ b: g }, tierWaves(g), ...[1, 2, 3, 4].map((i) => pct(s[`level_${i}_appearance_value`], total))];
  });
  const weaponOddsRows = groups.map((g) => [weaponCell(g), ...tiers.map((tier) => {
    const list = shop.filter((s) => s.group_id === tier);
    const total = list.reduce((n, s) => n + s.weapon_appearance_value, 0);
    const s = list.find((x) => x.use_weapon_id === g);
    return s ? pct(s.weapon_appearance_value, total) : '';
  })]);

  // ---- Missions ----
  const missions = t('Mission').filter((x) => x.manager_id === m.id).sort((a, b) => a.order - b.order);

  // ---- Help (MinigameHelpTipDescTable groups named by the tutorial table) ----
  const helpPages = ctx.table('MinigameHelpTipDescTable');
  const help = t('Tutorial').filter((x) => x.manager_id === m.id).sort((a, b) => a.id - b.id).map((x) => ({
    title: ctx.plain(x.tutorial_title_localkey),
    pages: helpPages.filter((d) => d.group_id === x.tutorial_page_id).sort((a, b) => a.order - b.order)
      .map((d) => ({ title: ctx.plain(d.helptip_title, ''), image: ctx.img(d.helptip_image), text: ctx.plain(d.helptip_description, '') })),
  })).filter((h) => h.pages.length);
  const WHEN = { FirstEnterBattle: 'first battle', FirstOpenInGamePassive: 'first trait choice', FirstOpenInventoryUpgrade: 'first inventory expansion', FirstEnterEnhance: 'first visit to Upgrade' };

  const collection = t('Collection').filter((c) => c.group_id === m.collection_group_id).sort((a, b) => a.order - b.order);
  const weaponById = new Map(weapons.map((w) => [w.id, w]));

  // ---- Pages ----
  const pages = [
    help.length && {
      id: 'how-to-play',
      title: 'How to play',
      count: help.reduce((n, h) => n + h.pages.length, 0),
      summary: `The in-game guide; each part opens the first time you reach it (${t('Tutorial').map((x) => WHEN[x.tutorial_output_type] || x.tutorial_output_type).join(', ')}).`,
      sections: [{ type: 'help', help }],
    },
    {
      id: 'characters',
      title: 'Characters',
      group: 'Characters',
      count: chars.length,
      summary: 'Each character starts with one weapon, has its own inventory shape and a Burst Skill you trigger by hand.',
      sections: chars.map((c) => {
        const inv = invRows(c.inventory_group_id);
        const start = inv.flat().filter((x) => x === 2).length;
        const extra = inv.flat().filter((x) => x === 1).length;
        return {
          type: 'facts',
          title: charName(c),
          items: [
            ['Burst Skill', [{ img: ctx.img(c.skill_icon), caption: ctx.plain(c.skill_name_locale), size: 'small' }, ctx.plain(c.skill_description_locale)]],
            ['Cooldown', `${sec(c.skill_cooltime)}${c.skill_infinity ? ', unlimited uses' : `, ${c.skill_use_count} uses`}`],
            ['Skill type', `${SKILL_TYPE[c.skill_type] || c.skill_type} (values ${valueList(c.skill_value.map((v) => v.skill_value))}; meaning not documented)`],
            ['Starting weapon', weaponById.get(c.default_weapon) ? weaponCell(weaponById.get(c.default_weapon).group_id) : ''],
            ['Barricade HP', num(c.start_hp)],
            ['Available', c.open_date ? unlockDay(c.open_date) : 'From the start'],
            ['Inventory', [...grid(inv, (x) => (x === 2 ? '■' : x === 1 ? '□' : '·')), `${start} slots at the start (■), ${extra} more can be opened with expansion points (□)`]],
          ],
        };
      }),
    },
    {
      id: 'levels',
      title: 'Levels and trait phases',
      group: 'Characters',
      count: levels.filter((l) => l.group_id === chars[0]?.character_exp_group).length,
      summary: `Killing monsters gives EXP. Each level-up offers ${m.ingame_passive_select_row} traits to pick from (a 4th with the upgrade); which phases (I, II, III) can appear in each option changes with your level.`,
      sections: [...new Set(chars.map((c) => c.character_exp_group))].map((eg) => ({
        type: 'table',
        title: chars.length > 1 && new Set(chars.map((c) => c.character_exp_group)).size > 1 ? chars.filter((c) => c.character_exp_group === eg).map(charName).join(', ') : 'All characters',
        note: 'EXP is what the level needs to level up. The option columns list the trait phases each of the (up to four) choices is drawn from.',
        columns: [{ label: 'Level', num: true }, { label: 'EXP', num: true }, 'Option 1', 'Option 2', 'Option 3', 'Option 4'],
        rows: levels.filter((l) => l.group_id === eg).sort((a, b) => a.lv - b.lv).map((l) => {
          const r = inGame.get(l.level_up_select_passive_id);
          return [l.lv, l.max_lv ? 'max' : l.exp, ...SLOTS.map((s) => (r ? r[`${s}_slot_use_passive_group_id`].map((g) => ROMAN[g % 100] || g).join(' / ') : ''))];
        }),
      })),
    },
    {
      id: 'weapons',
      title: 'Main weapons',
      group: 'Weapons',
      count: mainGroups.length,
      summary: 'Weapons fire on their own. Merging two equal weapons of the same rarity gives the next rarity (Lv 1 to Lv 4).',
      sections: [
        {
          type: 'table',
          title: 'At a glance',
          note: 'Shape is the space the weapon takes in the inventory (■). The tag decides which traits boost it. Range is where it starts shooting.',
          columns: ['Weapon', 'Tag', 'Attack', 'Shape', { label: 'Range', num: true }, 'Available'],
          rows: mainGroups.map((g) => {
            const w = first(g);
            return [weaponCell(g), tag(w), ATTACK[w.weapon_atk_type] || w.weapon_atk_type, shape(w.weapon_size), w.atk_start_range, w.weapon_open_date ? unlockDay(w.weapon_open_date) : 'From the start'];
          }),
        },
        ...mainGroups.map(mainWeaponSection),
      ],
    },
    {
      id: 'subweapons',
      title: 'Sub-weapons',
      group: 'Weapons',
      count: subGroups.length,
      summary: 'Sub-weapons do not attack; they give a bonus while they sit in the inventory.',
      sections: [{
        type: 'table',
        columns: ['Sub-weapon', 'Shape', 'Lv 1', 'Lv 2', 'Lv 3', 'Lv 4'],
        rows: subGroups.map((g) => [
          [weaponCell(g), { text: '', sub: ctx.plain(first(g).description_locale) }],
          shape(first(g).weapon_size),
          ...levelsOf(g).map((w) => skillsOf(w).map(skillText)),
        ]),
      }],
    },
    {
      id: 'shop',
      title: 'Shop odds',
      group: 'Weapons',
      count: tiers.length,
      summary: `After every wave the shop offers ${m.default_shop_item_count} weapons. The shop tier (which grows with the wave) sets the odds.`,
      sections: [
        {
          type: 'facts',
          title: 'Shop rules',
          items: [
            ['Weapons offered', `${m.default_shop_item_count} per visit; unused ones vanish when the next wave starts`],
            ['Free refreshes', `${m.default_reroll_count} per run, then ${num(m.gold_reroll_use_gold)} gold each`],
            ['Weapon removals', `${m.default_ban_weapon_count} per run (a removed weapon no longer appears)`],
            ['Trait refreshes', m.passive_reroll_default_count != null ? `${m.passive_reroll_default_count} per run` : ''],
            ['Storage', `Up to ${m.maximum_keep_weapon_count} weapons kept outside the inventory`],
          ],
        },
        {
          type: 'table',
          title: 'Rarity of offered weapons',
          note: 'The chance that an offered weapon comes at each rarity, from the tier’s weights (before the “higher-rarity weapons” upgrade).',
          columns: [{ label: 'Tier', num: true }, 'Waves', { label: 'Lv 1', num: true }, { label: 'Lv 2', num: true }, { label: 'Lv 3', num: true }, { label: 'Lv 4', num: true }],
          rows: rarityRows,
        },
        {
          type: 'table',
          title: 'Which weapon is offered',
          note: 'Each weapon’s weight against all the others in the tier. Removed weapons and weapons not yet available drop out, so the real odds of the rest are a little higher. (The table also has a second weight per weapon whose use is unclear.)',
          columns: ['Weapon', ...tiers.map((g) => ({ label: `Tier ${g}`, num: true }))],
          rows: weaponOddsRows,
        },
      ],
    },
    {
      id: 'traits',
      title: 'Traits',
      group: 'Upgrades',
      count: new Set(inGameTraits.map((p) => p.name_locale)).size,
      summary: 'Pick one at each level-up. Ordinary traits can be taken again; unique ones once per run. Higher phases are stronger but rarer.',
      sections: series.map((s) => ({
        type: 'table',
        title: series.length > 1 ? `Trait list: ${seriesUsers(s).map(charName).join(', ') || `set ${s}`}` : 'Trait list',
        note: 'Weight is how likely the trait is against the others of its phase. "From Lv" is the character level it can first appear at.',
        columns: ['Trait', 'Phase', 'Effect', 'Applies to', 'Type', { label: 'From Lv', num: true }, { label: 'Weight', num: true }],
        rows: inGameTraits.filter((p) => Math.floor(p.group_id / 100) === s).map((p) => [
          { img: ctx.img(p.passive_icon), caption: ctx.plain(p.name_locale), size: 'small' },
          ROMAN[p.passive_level] || p.passive_level,
          fill(ctx.plain(p.skill_locale), firstVal(p)).replace(/\n.*$/s, ''),
          linked(p),
          p.repeated_acquisition ? 'Ordinary' : { tag: 'Unique', tone: 'accent' },
          p.appearance_able_character_level,
          p.appearance_value,
        ]),
      })),
    },
    {
      id: 'upgrades',
      title: 'Permanent upgrades',
      group: 'Upgrades',
      count: upgradeGroups.length,
      summary: 'Bought with gold outside a run; they apply to every run. Reset refunds all the gold spent.',
      sections: [{
        type: 'table',
        columns: ['Upgrade', 'Level', 'Effect', { label: 'Cost (gold)', num: true }],
        rows: upgradeGroups.flatMap((g) => {
          const list = outGame.filter((p) => p.group_id === g).sort((a, b) => a.passive_level - b.passive_level);
          return list.map((p, i) => [
            i ? '' : [{ img: ctx.img(p.passive_icon), caption: ctx.plain(p.name_locale), size: 'small' }, { text: '', sub: ctx.plain(p.skill_locale) }],
            p.max_level ? `${p.passive_level} (max)` : p.passive_level,
            upgradeEffect(p),
            p.level_up_cost,
          ]);
        }),
      }, {
        type: 'facts',
        title: 'Total to max everything',
        items: [['Gold', num(outGame.filter((p) => upgradeGroups.includes(p.group_id)).reduce((n, p) => n + p.level_up_cost, 0))]],
      }],
    },
    {
      id: 'monsters',
      title: 'Monsters',
      group: 'Battle',
      count: monsters.size,
      summary: 'Base stats; every wave multiplies HP, ATK, DEF and speed by its own ratios (see Waves).',
      sections: [{
        type: 'table',
        note: 'Attack interval in seconds; range and speed in game units. Splitting monsters burst into the listed number of small ones when killed.',
        columns: ['Monster', 'Type', 'Attack', 'Skill', { label: 'HP', num: true }, { label: 'ATK', num: true }, { label: 'DEF', num: true }, { label: 'Speed', num: true }, { label: 'Attack every', num: true }, { label: 'Range', num: true }],
        rows: [...monsters.values()].map((x) => {
          const v = x.monster_skill_value.map((s) => s.monster_skill_value);
          const skill = x.monster_skill_type === 'Split' ? `Splits into ${v[1]} × ${monsterLabel(v[0])}`
            : x.monster_skill_type === 'DefUp' ? `Raises its DEF (values ${valueList(v)})`
              : x.monster_skill_type === 'None' ? '' : `${x.monster_skill_type} (${valueList(v)})`;
          return [
            { text: monsterLabel(x.id), sub: `${x.id}${x.monster_size !== 200 ? ` · size ${x.monster_size}` : ''}` },
            MONSTER_TYPE[x.monster_type] || x.monster_type,
            x.monster_atk_type === 'Projectile' ? 'Ranged' : 'Melee',
            skill,
            x.monster_hp, x.monster_atk, x.monster_def, x.monster_move_speed,
            sec(x.monster_atk_cooltime), x.monster_atk_range,
          ];
        }),
      }],
    },
    {
      id: 'waves',
      title: 'Waves',
      group: 'Battle',
      count: lastWave,
      summary: `Survive all ${lastWave} waves. Elites and bosses come on fixed waves; the shop opens after each one.`,
      sections: [{
        type: 'table',
        note: 'Spawns: monsters in the wave. Last spawn: when the last one appears. HP / ATK / DEF / Speed: the wave’s multiplier on the monsters’ base stats. Points & gold: multiplier on what kills give.'
          + (hasBurstRatio ? ' Burst: multiplier on Burst Skill damage.' : '') + ' Tier: the shop tier used after the wave.',
        columns: [{ label: 'Wave', num: true }, { label: 'Spawns', num: true }, 'Elites / bosses', { label: 'Last spawn', num: true }, { label: 'HP', num: true }, { label: 'ATK', num: true }, { label: 'DEF', num: true }, { label: 'Speed', num: true },
          { label: 'Points & gold', num: true }, ...(hasBurstRatio ? [{ label: 'Burst', num: true }] : []), { label: 'Tier', num: true }, 'Also'],
        rows: waveRows,
      }],
    },
    {
      id: 'missions',
      title: 'Challenges',
      group: 'Rewards',
      count: missions.length,
      summary: 'One-time challenges; progress adds up over all your runs unless the text says “in a run”.',
      sections: [
        {
          type: 'facts',
          title: 'Daily reward',
          items: [[`Score ${num(m.daily_mission_point)} in a run`, { reward: ctx.reward(m.daily_mission_reward) }]],
        },
        {
          type: 'table',
          columns: ['Challenge', 'Reward'],
          rows: missions.map((x) => [ctx.plain(x.name_localkey, `${x.condition_type} ${x.condition_value}`), { reward: ctx.reward(x.reward_id) }]),
        },
      ],
    },
    collection.length && {
      id: 'collection',
      title: 'Collection',
      group: 'Rewards',
      count: collection.length,
      summary: 'Weapons are added to the collection once you obtain them.',
      sections: [{
        type: 'gallery',
        items: collection.map((c) => weaponById.get(c.weapon_id)).filter(Boolean).map((w) => ({ img: weaponPic(w), caption: weaponName(w.group_id) })),
      }],
    },
  ].filter(Boolean);

  const kill = (k) => [m[`${k}_exp`], m[`${k}_point`], m[`${k}_drop_gold`]];
  const overview = [
    {
      type: 'facts',
      title: 'A run',
      items: [
        ['Intro story', ctx.intro ? { scene: ctx.intro.id, label: ctx.intro.label } : null],
        ['Goal', `Hold the barricade through ${lastWave} waves; the run ends if its HP runs out`],
        ['Characters', chars.map(charName).join(', ')],
        ['Fighting', 'Automatic: every weapon in the inventory fires on its own; you trigger the Burst Skill'],
        ['Between waves', `Shop (${m.default_shop_item_count} weapons), inventory expansion on some waves`],
        ['Critical hits', `${m.critical_probability}% chance, ${m.critical_damage_ratio}% damage`],
        ['Reload floor', `Reload time can’t drop below ${sec(m.min_reload_cooltime)}`],
        ['Score cap', `${num(m.score_limit_per_game)} points per run`],
        ['Daily reward', [`Score ${num(m.daily_mission_point)} in a run:`, { reward: ctx.reward(m.daily_mission_reward) }]],
      ],
    },
    {
      type: 'table',
      title: 'What a kill gives',
      note: 'Before bonuses. Each wave multiplies points and gold by its own ratio (100% at the start, more later).',
      columns: ['Monster', { label: 'EXP', num: true }, { label: 'Points', num: true }, { label: 'Gold', num: true }],
      rows: [['Minion', ...kill('minion')], ['Elite', ...kill('elite')], ['Boss', ...kill('boss')]],
    },
    { type: 'gallery', title: 'Weapons', items: groups.map((g) => ({ img: weaponPic(first(g)), caption: weaponName(g) })) },
  ];

  return {
    summary: opts.summary || `Merge and upgrade weapons to hold a barricade against ${lastWave} waves of monsters.`,
    overview,
    pages,
  };
}

module.exports = { buildSurvivor };
