// MIDNIGHT PHANTOM RUNNER (EventCE009MiniGame*), the Persona collab minigame. An endless maze
// run: swipe to send your character down the corridors, grab coins and items, dodge Shadows,
// and stay ahead of the map collapsing behind you. HP drains all the time; the run ends at 0 HP
// or when the collapse catches you. Score comes from distance, coins, defeated enemies and combo
// bonuses. The maze is stitched from preset chunks (24 tiles wide) chosen by difficulty level.
// Times are in 1/100 s; item rates are per 10,000.

const sec = (cs) => `${+(cs / 100).toFixed(2)} s`;
const num = (n) => Number(n).toLocaleString('en-US');

function build(ctx) {
  const m = ctx.table('EventCE009MiniGameManagerTable')[0];
  const name = (key, fb = '') => ctx.plain(key, fb).replace(/\r/g, '').trim();
  const T = (t, g) => ctx.table(`EventCE009MiniGame${t}Table`).filter((r) => g == null || r.group_id === g);

  const characters = T('Character', m.character_group_id);
  const skills = new Map(T('Skill').map((s) => [s.id, s]));
  const items = T('Item', m.item_group_id);
  const itemById = new Map(items.map((i) => [i.id, i]));
  const enemies = T('Enemy', m.enemy_group_id);
  const enemyById = new Map(enemies.map((e) => [e.id, e]));
  const buffs = T('Buff', m.buff_group_id);
  const bonus = T('Bonus', m.bonus_group_id).sort((a, b) => a.bonus_level - b.bonus_level);
  const levels = T('Difficulty', m.difficulty_group_id);
  const missions = T('Mission', m.mission_group_id).sort((a, b) => a.order - b.order);
  const currency = T('Currency').find((c) => c.id === m.currency_id);
  const currencyName = currency ? name(currency.name_locale_key, 'Training Logs') : 'Training Logs';
  const placeables = new Map(T('Placeable').map((p) => [p.id, p]));

  const itemCell = (i) => ({ img: ctx.img(i.resource_id), caption: name(i.name_locale_key, i.condition_type), size: 'small' });
  // Only two enemy sprites were extracted: Delta's waiting pose and a generic Shadow.
  const enemyImg = (e) => ctx.img(e.resource_id) || (e.condition_type === 'Delta' && ctx.img(m.delta_waiting_resource)) || ctx.img('ce009_enemy_shadow');
  const enemyCell = (e) => ({ img: enemyImg(e), caption: e.condition_type, size: 'small' });
  const charName = (id) => {
    const c = characters.find((x) => x.id === id);
    return c ? name(c.name_locale_key) : String(id);
  };

  // What each item does, from the help text and its values.
  const ITEM = {
    Coin: (i) => `+${num(i.get_score)} points and +${i.condition_value} skill gauge (not while a skill is active)`,
    Coinbox: (i) => `+${i.condition_value} skill gauge, even while a skill is active`,
    Healkit: (i) => `Restores ${i.condition_value} HP`,
    Specialcard: (i) => `Points ×${i.condition_value} for ${sec(i.duration)} (another card adds ${sec(i.extend_duration)})`,
    Bomb: (i) => `After a short countdown, defeats all enemies in range; goes off at once if you run into an enemy, so you lose no HP (value ${i.condition_value}, meaning unclear)`,
  };
  const SKILL = {
    Barrier: (s) => `Lasts ${sec(s.duration)}`,
    Shockwave: (s) => `Instant (range value ${s.condition_value})`,
    Ride: (s) => `Lasts ${sec(s.duration)}`,
  };

  // The maze: per difficulty level, its preset chunks and what is placed on them.
  const presets = ctx.table('EventCE009MiniGamePresetTable').filter((p) => p.group_id === m.preset_group_id);
  const byGroup = new Map();
  for (const p of presets) {
    if (!byGroup.has(p.preset_group_id)) byGroup.set(p.preset_group_id, []);
    byGroup.get(p.preset_group_id).push(p);
  }
  const levelStats = (lv) => {
    const groups = lv.preset_group_id || [];
    const enemyCount = new Map();
    const itemCount = new Map();
    let rows = 0;
    for (const g of groups) {
      for (const row of byGroup.get(g) || []) {
        rows++;
        for (const t of row.tile_use_placeable_id || []) {
          const pl = placeables.get(t.tile_use_placeable_id);
          if (!pl) continue;
          if (pl.enemy_type) enemyCount.set(pl.enemy_type, (enemyCount.get(pl.enemy_type) || 0) + 1);
          // An item tile holds one of several items, by weight (per 10,000): count the expected share.
          for (const it of pl.itemgroupdata || []) {
            if (it.item_rate) itemCount.set(it.item_type, (itemCount.get(it.item_type) || 0) + it.item_rate / 10000);
          }
        }
      }
    }
    const per = (n) => (groups.length ? +(n / groups.length).toFixed(1) : 0);
    return {
      chunks: groups.length,
      rows: groups.length ? Math.round(rows / groups.length) : 0,
      enemies: [...enemyCount].sort((a, b) => a[0] - b[0]).map(([id, n]) => {
        const e = enemyById.get(id);
        return e ? { ...enemyCell(e), caption: `${e.condition_type} ×${per(n)}` } : `${id} ×${per(n)}`;
      }),
      items: [...itemCount].sort((a, b) => a[0] - b[0]).map(([id, n]) => {
        const i = itemById.get(id);
        return i ? { ...itemCell(i), caption: `${name(i.name_locale_key)} ×${per(n)}` } : `${id} ×${per(n)}`;
      }),
    };
  };

  // In-game help: the manager names a help-tip group directly, so it is built here
  // (ctx.help only takes a MinigameHub group).
  const tipPages = ctx.table('MinigameHelpTipDescTable').filter((d) => d.group_id === m.tutorial_id).sort((a, b) => a.order - b.order);
  const help = tipPages.length ? [{
    title: name(tipPages[0].helptip_title),
    pages: tipPages.map((d) => ({ title: name(d.helptip_title), image: ctx.img(d.helptip_image) || d.helptip_image || null, text: name(d.helptip_description) })),
  }] : [];

  const upgradeGroups = [...new Set(buffs.map((b) => b.order))].sort((a, b) => a - b);

  const missionText = (x) => {
    const key = `Locale_Event:${x.name_locale_key}`;
    if (x.condition_type === 'UseCharacterSkillAccount') return name(key).replace('{0}', charName(x.condition_id)).replace('{1}', num(x.condition_value));
    return name(key).replace('{0}', num(x.condition_value));
  };

  return {
    summary: 'An endless maze run: swipe through the corridors collecting coins and items, dodge Shadows and outrun the collapsing map while your HP drains.',
    overview: [
      {
        type: 'facts',
        title: 'How it plays',
        items: [
          ['Moving', 'Swipe (or WASD / arrow keys) to pick a direction; your character runs until she hits a wall, then waits for the next input.'],
          ['HP', `You start with ${m.player_hp} HP. It drains steadily (faster at higher difficulty), and each enemy you run into takes ${enemies[0]?.contact_damage ?? '?'} HP (the enemy is destroyed). After a hit you are invincible for ${sec(m.invincible_duration)}.`],
          ['Collapse', `After a while (start delay ${sec(m.collapse_start_delay)}) the map collapses from behind and follows you; touching it ends the run, as does reaching 0 HP.`],
          ['Score', `${num(m.distance_score)} points per metre, ${num(m.enemy_kill_score)} per enemy defeated with an item or skill, coin points and combo bonuses.`],
          ['Ranks', `B ${num(m.b_rank_target_score)}, A ${num(m.a_rank_target_score)}, S ${num(m.s_rank_target_score)} points`],
          ['Persona skills', 'Coins and treasure chests fill a skill gauge; when it is full the character’s Persona skill fires by itself.'],
          ['Daily reward', [`Score ${num(m.daily_reward_score)} in one run:`, { reward: ctx.reward(m.daily_reward_id) }]],
          ['Intro story', ctx.intro ? { scene: ctx.intro.id, label: ctx.intro.label } : null],
        ],
      },
      {
        type: 'table',
        title: 'Combo bonus',
        note: 'Pick up items one after another without the timer running out (or getting hit). Each milestone raises the combo level and pays a bonus; after the last one the combo starts over.',
        columns: ['Level', { label: 'Items', num: true }, { label: 'Bonus points', num: true }, { label: 'Time between pickups', num: true }],
        rows: bonus.map((b) => [b.bonus_level, b.bonus_count, b.bonus_score, sec(b.bonus_timer)]),
      },
    ],
    pages: [
      help.length && { id: 'guide', title: 'How to play', count: tipPages.length, sections: [{ type: 'help', help }] },
      {
        id: 'characters',
        title: 'Characters',
        count: characters.length,
        summary: 'Each character brings a Persona whose skill triggers when the gauge is full.',
        sections: [{
          type: 'table',
          columns: ['Character', 'Persona', 'Skill', 'Duration', 'Available'],
          rows: characters.map((c) => {
            const s = skills.get(c.skill_id);
            return [
              { img: ctx.img(c.resource_id), caption: name(c.name_locale_key), size: 'small' },
              s ? { img: ctx.img(s.icon_resource_id), caption: name(s.name_locale_key), size: 'small' } : '',
              s ? name(s.description_locale_key) : '',
              s ? (SKILL[s.condition_type] || (() => ''))(s) : '',
              c.open_date ? `From event day ${c.open_date}` : 'From the start',
            ];
          }),
        }],
      },
      {
        id: 'items',
        title: 'Items and enemies',
        count: items.length + enemies.length,
        sections: [
          {
            type: 'table',
            title: 'Items',
            columns: ['Item', 'Effect'],
            rows: items.map((i) => [itemCell(i), (ITEM[i.condition_type] || (() => ''))(i)]),
          },
          {
            type: 'table',
            title: 'Enemies',
            note: `Every enemy deals ${enemies[0]?.contact_damage ?? '?'} damage on contact and is destroyed by it. Your own speed is ${m.player_speed}. Each type moves in its own pattern (not described in the data).`,
            columns: ['Enemy', { label: 'Speed', num: true }],
            rows: enemies.map((e) => [enemyCell(e), e.move_speed]),
          },
        ],
      },
      {
        id: 'difficulty',
        title: 'Difficulty',
        count: levels.filter((l) => !l.is_start).length,
        summary: 'The further you get, the faster HP drains and the faster the map collapses; each level also draws its maze chunks from a harder set.',
        sections: [{
          type: 'table',
          note: 'Counts are averages per maze chunk (one chunk is 24 tiles wide and about the given number of rows long). Item tiles hold one of several items at random; their expected share is counted.',
          columns: ['Level', { label: 'From', num: true }, { label: 'HP drain', num: true }, { label: 'Collapse speed', num: true }, { label: 'Chunks', num: true }, { label: 'Rows', num: true }, 'Enemies', 'Items'],
          rows: levels.slice().sort((a, b) => (b.is_start - a.is_start) || a.level - b.level).map((l) => {
            const st = levelStats(l);
            return [
              l.is_start ? 'Start area' : l.level,
              l.is_start ? '—' : `${l.start_distance} m`,
              l.hp_decrease_amount,
              l.collapse_speed,
              st.chunks,
              st.rows,
              st.enemies,
              st.items,
            ];
          }),
        }],
      },
      {
        id: 'upgrades',
        title: 'Upgrades',
        group: 'Progress',
        count: upgradeGroups.length,
        summary: `Bought with ${currencyName} from missions. They can be reset at any time for a full refund.`,
        sections: upgradeGroups.map((o) => {
          const list = buffs.filter((b) => b.order === o).sort((a, b) => a.level - b.level);
          const b = list[0];
          return {
            type: 'table',
            title: name(b.name_locale_key, b.condition_type),
            columns: [{ label: 'Level', num: true }, 'Effect', { label: currencyName, num: true }, 'Available'],
            rows: list.map((x) => [
              x.level,
              x.condition_value ? name(b.description_locale_key).replace('{0}', x.condition_value) : 'No bonus (starting level)',
              x.currency_count || '—',
              x.open_date ? `From event day ${x.open_date}` : 'From the start',
            ]),
          };
        }),
      },
      {
        id: 'missions',
        title: 'Missions',
        group: 'Progress',
        count: missions.length,
        sections: [{
          type: 'table',
          note: 'Score and distance missions count the total over all runs.',
          columns: ['Mission', 'Reward'],
          rows: missions.map((x) => [
            missionText(x),
            x.reward_type === 'BuffCurrency' ? { img: ctx.img(currency?.resource_id), caption: `${currencyName} ×${x.reward}`, size: 'small' } : { reward: ctx.reward(x.reward) },
          ]),
        }],
      },
    ].filter(Boolean),
  };
}

module.exports = { build };
