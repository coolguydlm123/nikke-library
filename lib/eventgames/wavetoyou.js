// Island Breaker (EventIslandBreaker*): a ball-bouncing block breaker. Each wave a new row
// of debris blocks drops in from the top; aim and launch all your balls, which bounce off
// walls and blocks and damage them. The run ends when blocks reach the bottom row. Breaking
// blocks pays Seashells, spent mid-run on more (and rarer) balls; your Nikke's skill charges
// on every hit. After the run, Conch Shells buy permanent traits.
//
// Units: rates and multipliers are per 10,000 (ball_skill_ratio 5000 = 50%), times are
// ×10,000 s (launch_time_default 80000 = 8 s). Block HP is plain HP.

const n = (v) => Number(v).toLocaleString('en-US');
const pct = (v) => `${+(v / 100).toFixed(1)}%`;
const sec = (v) => `${+(v / 10000).toFixed(2)} s`;
const fill = (s, args) => String(s).replace(/\{(\d)\}/g, (_, i) => (args[i] != null ? args[i] : ''));

// Character portraits are named after the Nikke, not the prefab id.
const PORTRAIT = { ib_chr_101: 'islandbreaker_chr_cinderella', ib_chr_102: 'islandbreaker_chr_littlemermaid', ib_chr_103: 'islandbreaker_chr_marchana' };
const GRADE_TONE = { R: undefined, SR: 'good', SSR: 'accent' };

function build(ctx) {
  const m = ctx.table('EventIslandBreakerManagerTable')[0];

  const currencies = new Map(ctx.table('EventIslandBreakerCurrencyTable').map((c) => [c.id, c]));
  const curName = (id) => ctx.plain(currencies.get(id)?.name_localkey, `Currency ${id}`);
  const curCell = (id, amount) => ({ img: ctx.img(currencies.get(id)?.resource_id), caption: `${curName(id)}${amount != null ? ` ×${n(amount)}` : ''}`, size: 'small' });
  const shell = curName(m.summon_currency_id);
  const conch = curName(m.buff_currency_id);
  const conchCur = currencies.get(m.buff_currency_id);
  const conchCaps = conchCur ? [1, 2, 3].map((i) => [conchCur[`limit_${i}_day`], conchCur[`limit_${i}_max`]]).filter(([, max]) => max) : [];

  // ---- Balls and buying them ----
  const balls = ctx.table('EventIslandBreakerBallTable').filter((b) => b.summon_group === m.summon_group).sort((a, b) => a.order - b.order);
  const summons = ctx.table('EventIslandBreakerSummonTable').filter((s) => s.summon_group === m.summon_group).sort((a, b) => a.order - b.order);
  const rates = summons[0] ? { R: summons[0].ratio_r, SR: summons[0].ratio_sr, SSR: summons[0].ratio_ssr } : {};
  const perGrade = (g) => balls.filter((b) => b.grade === g).length;
  const ballName = (b) => ctx.plain(b.name_localkey, b.resource_id);
  const ballRows = balls.map((b) => [
    { img: ctx.img(b.resource_id), size: 'small' },
    { text: ballName(b), sub: fill(ctx.plain(b.description_localkey, ''), [b.ball_skill_value]) },
    { tag: b.grade, tone: GRADE_TONE[b.grade] },
    b.attack,
    b.charge_point,
    b.ball_skill_type !== 'None' ? { text: `${pct(b.ball_skill_ratio)} per hit`, sub: `extra ATK ${b.ball_skill_value}` } : '—',
    rates[b.grade] ? pct(rates[b.grade] / perGrade(b.grade)) : '',
  ]);

  // ---- Nikkes and skills ----
  const chars = ctx.table('EventIslandBreakerCharacterTable').filter((c) => c.character_group === m.character_group);
  const charName = (c) => ctx.plain(c.name_localkey, c.character_prefabs);
  const skillLevels = ctx.table('EventIslandBreakerSkillLevelTable').sort((a, b) => a.skill_level - b.skill_level);
  const images = ctx.table('EventIslandBreakerImageTable').filter((i) => i.image_group === m.image_group).sort((a, b) => a.order - b.order);

  // ---- Blocks and waves ----
  const blocks = ctx.table('EventIslandBreakerBlockTable').filter((b) => b.block_group === m.block_group);
  const normal = blocks.find((b) => b.block_type === 'NORMAL');
  const elite = blocks.find((b) => b.block_type === 'ELITE');
  const colours = ctx.table('EventIslandBreakerBlockColorTable').filter((c) => c.block_group === m.block_group).sort((a, b) => a.hp_min - b.hp_min);
  const firstCycle = [];
  for (const c of colours) { if (firstCycle.some((f) => f.block_color === c.block_color)) break; firstCycle.push(c); }
  const cycle = colours.find((c, i) => i > 0 && c.block_color === colours[0].block_color);
  const waves = ctx.table('EventIslandBreakerWaveTable').filter((w) => w.wave_group === m.wave_group).sort((a, b) => a.wave - b.wave);
  const skillAt = (wave) => skillLevels.find((s) => s.wave_min <= wave && (s.wave_max === 0 || wave <= s.wave_max)) || skillLevels[skillLevels.length - 1];
  const colourAt = (hp) => colours.find((c) => c.hp_min <= hp && hp <= c.hp_max) || null;
  const waveRow = (w) => {
    const s = skillAt(w.wave);
    const col = colourAt(w.block_hp);
    return [
      w.wave,
      w.total_block_count,
      w.elite_block_count || '',
      w.bonus_count || '',
      col ? { img: ctx.img(col.block_color), caption: n(w.block_hp), size: 'small' } : n(w.block_hp),
      { text: `Lv ${s.skill_level}`, sub: `ATK ${n(s.attack)} · charge ${n(s.need_charge_point)}` },
    ];
  };
  const WAVE_COLS = [{ label: 'Wave', num: true }, { label: 'New blocks', num: true }, { label: 'Elite', num: true }, { label: 'Bonus', num: true }, 'Block HP', 'Nikke skill'];
  const wavePage = (from, to, id, title) => {
    const list = waves.filter((w) => w.wave >= from && w.wave <= to);
    return list.length ? {
      id, title, group: 'Waves', count: list.length,
      summary: `Waves ${from}–${list[list.length - 1].wave}. Each wave adds a row with this many blocks; elite and bonus counts are part of that row.`,
      sections: [{ type: 'table', columns: WAVE_COLS, rows: list.map(waveRow) }],
    } : null;
  };
  const lastWave = waves[waves.length - 1];
  const repeatWave = waves.find((w) => w.wave === m.repeat_wave);

  // ---- Traits ----
  const buffs = ctx.table('EventIslandBreakerBuffTable').filter((b) => b.buff_group === m.buff_group);
  const buffTypes = [...new Set(buffs.map((b) => b.order))].sort((a, b) => a - b).map((o) => buffs.filter((b) => b.order === o).sort((a, b) => a.buff_level - b.buff_level));
  const buffValue = (b) => {
    switch (b.buff_type) {
      case 'IncreaseGetSummonCurrency': case 'IncreaseCharacterSkillDamage': return `+${pct(b.buff_value_01)}`;
      case 'StartSummonCurrencyCount': return `+${n(b.buff_value_01)} ${shell}s`;
      case 'IncreaseSummonRatio': return `SR +${pct(b.buff_value_01)}, SSR +${pct(b.buff_value_02)}`;
      case 'CharacterRebirth': return `${b.buff_value_01} extra chance${b.buff_value_01 > 1 ? 's' : ''}`;
      default: return `${b.buff_value_01}`;
    }
  };
  let traitTotal = 0;
  const traitSections = buffTypes.map((rows) => {
    const top = rows[rows.length - 1];
    const lv = rows.filter((r) => r.buff_level > 0);
    traitTotal += lv.reduce((s, r) => s + r.buff_currency_count, 0);
    return {
      type: 'table',
      title: ctx.plain(top.name_localkey, top.buff_type),
      sub: ctx.plain(rows[0].description_localkey, ''),
      columns: [{ label: 'Level', num: true }, 'Effect', { label: `Cost (${conch}s)`, num: true }, 'Available from'],
      rows: lv.map((r) => [r.buff_level, buffValue(r), r.buff_currency_count, r.open_condition_day ? `event day ${r.open_condition_day}` : 'start']),
    };
  });

  // ---- Missions ----
  const missions = ctx.table('EventIslandBreakerMissionTable').filter((x) => x.mission_group === m.mission_group).sort((a, b) => a.order - b.order);
  const missionRows = missions.map((x) => [fill(ctx.plain(x.name_localkey, x.condition_type), [n(x.condition_value)]), { reward: ctx.reward(x.reward_id) }]);

  const daily = m.daily_reward_id ? ctx.reward(m.daily_reward_id) : null;
  const help = ctx.help(m.helptip_hub_group);
  const speedUp = m.acceleration_value && m.acceleration_max
    ? `By the manager settings, while balls are in play the game speeds up by ×${m.acceleration_value / 10000} every ${sec(m.acceleration_sec)}, up to ×${m.acceleration_max / 10000} (normal speed ×${m.default_game_speed / 10000}).` : null;

  return {
    summary: 'A block breaker: launch your balls to break the debris rows that drop one row per wave, buy more balls with the Seashells you break loose, and survive as many waves as you can.',
    overview: [
      {
        type: 'facts',
        title: 'A run',
        items: [
          ['Intro story', ctx.intro ? { scene: ctx.intro.id, label: ctx.intro.label } : null],
          ['Goal', 'Score as many points as possible: damaging blocks scores points, and long bounce chains build combos.'],
          ['Waves', 'Each wave a new row of blocks drops in and every block moves down one row. The run ends when a block reaches the bottom row.'],
          ['Your turn', `Drag to aim, release to fire all your balls. They come back on their own (or with Retrieve Now) and the next wave starts. You start with ${m.default_ball_count} ball and ${n(m.summon_currency_count)} ${shell}s.`],
          ['Speed-up', speedUp],
          ['Skip Wave', 'You can skip a wave without launching; blocks still drop and get tougher. Not allowed when blocks are one row from the bottom.'],
          ['Daily reward', daily ? ['Play once a day:', { reward: daily }] : null],
          ['Endless', repeatWave ? `The wave table runs to wave ${n(lastWave.wave)}; past that wave ${n(repeatWave.wave)} repeats (block HP ${n(repeatWave.block_hp)}).` : null],
          ['Score cap', n(m.max_score)],
        ],
      },
      {
        type: 'facts',
        title: 'Currencies',
        items: [
          [shell, [curCell(m.summon_currency_id), `${ctx.plain(currencies.get(m.summon_currency_id)?.description_localkey, '')} ${normal ? `${n(normal.reward_currency_count)} per block destroyed, ${n(normal.bonus_currency_count)} per bonus block.` : ''} Unspent ones are lost when the run ends.`]],
          [conch, [curCell(m.buff_currency_id), `${ctx.plain(conchCur?.description_localkey, '')} Earned at the end of each run, more for reaching later waves (up to 50 a run). Total earning cap: ${conchCaps.map(([d, max]) => `${n(max)}${d ? ` from day ${d}` : ''}`).join(', ')}. All traits together cost ${n(traitTotal)}.`]],
        ],
      },
      { type: 'gallery', title: 'Nikkes', items: chars.map((c) => ({ img: PORTRAIT[c.character_prefabs] || null, caption: charName(c) })) },
      help.length ? { type: 'help', help } : null,
    ].filter(Boolean),
    pages: [
      {
        id: 'balls',
        title: 'Balls',
        group: 'Gear',
        count: balls.length,
        summary: `Buy balls mid-run with ${shell}s (not while balls are bouncing). Each purchase rolls a rarity, then a ball of that rarity.`,
        sections: [
          {
            type: 'table',
            title: 'Buying',
            columns: ['Option', { label: 'Balls', num: true }, `Cost`, 'R', 'SR', 'SSR'],
            rows: summons.map((s) => [ctx.plain(s.name_localkey, `Buy ${s.summon_count}`), s.summon_count, curCell(m.summon_currency_id, s.need_summon_currency_count), pct(s.ratio_r), pct(s.ratio_sr), pct(s.ratio_ssr)]),
          },
          {
            type: 'table',
            title: 'Balls',
            note: 'ATK is damage per hit. Charge is how much each hit adds to your Nikke’s skill gauge. Chance assumes balls of the same rarity are equally likely (the table only gives rarity odds).',
            columns: ['', 'Ball', 'Rarity', { label: 'ATK', num: true }, { label: 'Charge', num: true }, 'Special', { label: 'Chance', num: true }],
            rows: ballRows,
          },
        ],
      },
      {
        id: 'nikkes',
        title: 'Nikkes and skills',
        group: 'Gear',
        count: chars.length,
        summary: 'Pick one Nikke per run. Her skill fills as balls hit blocks; at 100% it fires at the start of the next wave (twice at 200%).',
        sections: [
          {
            type: 'table',
            columns: ['', 'Nikke', 'Skill', 'Available from'],
            rows: chars.map((c) => [
              { img: PORTRAIT[c.character_prefabs] || null, size: 'small' },
              charName(c),
              [{ img: ctx.img(c.skill_resource_id), caption: ctx.plain(c.skill_name_localkey, ''), size: 'small' }, ctx.plain(c.skill_desc_localkey, '')],
              c.open_condition_day ? `event day ${c.open_condition_day}` : 'start',
            ]),
          },
          {
            type: 'table',
            title: 'Skill level by wave',
            note: 'All three skills share this table. Reaching each new block of waves raises the skill’s ATK and the charge it needs.',
            columns: ['Waves', { label: 'Skill level', num: true }, { label: 'ATK', num: true }, { label: 'Charge needed', num: true }],
            rows: skillLevels.filter((s, i) => i < 20 || s.skill_level % 10 === 0 || i === skillLevels.length - 1)
              .map((s) => [s.wave_max ? `${s.wave_min}–${s.wave_max}` : `${s.wave_min}+`, s.skill_level, s.attack, s.need_charge_point]),
          },
        ],
      },
      {
        id: 'blocks',
        title: 'Blocks',
        group: 'Waves',
        count: blocks.length,
        summary: 'Normal, elite and bonus blocks. A block’s colour shows how much HP it has left.',
        sections: [
          {
            type: 'table',
            columns: ['Kind', 'Looks', 'Notes'],
            rows: [
              normal && ['Normal', blocks.filter((b) => b.block_type === 'NORMAL').map((b) => ({ img: ctx.img(b.resource_id), size: 'small' })), `${n(normal.reward_currency_count)} ${shell}s when destroyed`],
              elite && ['Elite', blocks.filter((b) => b.block_type === 'ELITE').map((b) => ({ img: ctx.img(b.resource_id), size: 'small' })), `More HP than normal blocks (value ×${elite.block_value / 10000}, most likely an HP multiplier); ${n(elite.reward_currency_count)} ${shell}s`],
              normal && ['Bonus', blocks.map((b) => ({ img: ctx.img(b.bonus_resource_id), size: 'small' })), `A normal or elite block with a bonus mark: ${n(normal.bonus_currency_count)} ${shell}s when destroyed`],
            ].filter(Boolean),
          },
          {
            type: 'table',
            title: 'Colour by HP',
            note: cycle ? `From ${n(cycle.hp_min)} HP the colours start over in the same order, ${n(cycle.hp_max - cycle.hp_min + 1)} HP per colour (the table runs to ${n(colours[colours.length - 1].hp_max)} HP).` : '',
            columns: ['Colour', 'HP'],
            rows: firstCycle.map((c) => [{ img: ctx.img(c.block_color), size: 'small' }, `${n(c.hp_min)}–${n(c.hp_max)}`]),
          },
        ],
      },
      wavePage(1, 100, 'waves-1', 'Waves 1–100'),
      {
        id: 'waves-later',
        title: 'Later waves',
        group: 'Waves',
        count: waves.filter((w) => w.wave > 100 && (w.wave % 10 === 0 || w.wave === lastWave.wave)).length,
        summary: 'Every 10th wave from 110 on.',
        sections: [{ type: 'table', columns: WAVE_COLS, rows: waves.filter((w) => w.wave > 100 && (w.wave % 10 === 0 || w.wave === lastWave.wave)).map(waveRow) }],
      },
      {
        id: 'traits',
        title: 'Traits',
        group: 'Upgrades',
        count: traitSections.length,
        summary: `Permanent bonuses bought with ${conch}s. Some levels open later in the event. Traits can be reset (the spent shells are not lost).`,
        sections: traitSections,
      },
      {
        id: 'missions',
        title: 'Missions',
        count: missions.length,
        sections: [{ type: 'table', columns: ['Mission', 'Reward'], rows: missionRows }],
      },
      {
        id: 'album',
        title: 'Album',
        count: images.length,
        summary: 'Illustrations unlocked by reaching a wave with a given Nikke.',
        sections: [{
          type: 'table',
          columns: ['Picture', 'Scene', 'Unlock'],
          rows: images.map((i) => {
            const c = chars.find((x) => x.id === i.condition_character);
            return [
              { img: ctx.img(i.resource_id), size: 'large' },
              { text: ctx.plain(i.name_localkey, ''), sub: ctx.plain(i.description_localkey, '') },
              `Reach wave ${i.condition_wave} with ${c ? charName(c) : i.condition_character}`,
            ];
          }),
        }],
      },
    ].filter(Boolean),
  };
}

module.exports = { build };
