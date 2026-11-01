// 5x5 Supplies (EventGachaBoard*): a 5×5 board of face-down tiles. Each ticket flips one
// tile for the reward under it; the 25 tiles hold a fixed set of rewards (Type A to D
// supplies, each with a set number of tiles), so every flip is a draw without replacement.
// Once you find the Type A tile, or have flipped 18 tiles, you may "resupply": take that
// cycle's resupply reward and start a fresh board (the next cycle). Flipping tiles fills a
// Fever counter; at set counts the flips pay double. Tickets come from a daily login gift
// and from missions about the event's featured Nikkes.

const RANK = { 1: 'Type A', 2: 'Type B', 3: 'Type C', 4: 'Type D' };
const TONE = { 1: 'accent', 2: 'good' };

const MISSION = {
  ObtainCharacter: () => 'Obtain her',
  CharacterSkill1Level: (v) => `Skill 1 to Lv. ${v}`,
  CharacterSkill2Level: (v) => `Skill 2 to Lv. ${v}`,
  CharacterskillBurstLevel: (v) => `Burst Skill to Lv. ${v}`,
  CharacterAttractiveLevel: (v) => `Bond Lv. ${v}`,
  CharacterEquipCollection: () => 'Equip an SR Collection Item',
  CharacterCollectionItemLevel: (v) => `SR Collection Item to Lv. ${v}`,
  CharacterEquipItemOverload: () => 'Overload (modify) a T9 gear',
};

function build(ctx) {
  const managers = ctx.table('EventGachaBoardManagerTable').sort((a, b) => a.id - b.id);
  const boards = ctx.table('EventGachaBoardBoardTable');
  const fevers = ctx.table('EventGachaBoardFeverTable');
  const slots = ctx.table('EventGachaBoardRewardTable');
  const missions = ctx.table('EventGachaBoardMissionTable');
  const charName = new Map();
  for (const c of ctx.table('Character/CharacterTable')) if (!charName.has(c.name_code)) charName.set(c.name_code, ctx.plain(c.name_localkey, `Nikke ${c.name_code}`));
  const who = (code) => charName.get(code) || `Nikke ${code}`;

  const featured = (m) => [...new Set(missions.filter((x) => x.group === m.mission_group_id).map((x) => x.mission_condition_target))];
  const title = (m) => featured(m).map(who).join(' & ') || `Board ${m.id}`;

  const eventPage = (m) => {
    const cycles = boards.filter((b) => b.group === m.board_group_id).sort((a, b) => a.number - b.number);
    const first = cycles[0];
    const fever = fevers.filter((f) => f.group === m.fever_group_id).sort((a, b) => a.number - b.number);
    const ms = missions.filter((x) => x.group === m.mission_group_id).sort((a, b) => a.order - b.order);
    // The board's prize set can change between cycles (slot_reward_group_id), so list each set used.
    const sets = [...new Set(cycles.map((c) => c.slot_reward_group_id))];
    const setSection = (g) => {
      const list = slots.filter((s) => s.group === g).sort((a, b) => a.order - b.order);
      const tiles = list.reduce((n, s) => n + s.slot_count, 0);
      const used = cycles.filter((c) => c.slot_reward_group_id === g).map((c) => c.number);
      return {
        type: 'table',
        title: sets.length > 1 ? `Board prizes (cycle ${used.join(', ')}${used.includes(cycles[cycles.length - 1]?.number) ? '+' : ''})` : 'Board prizes',
        note: `${tiles} tiles. Each tile is equally likely, so a prize's chance on the next flip is its tiles ÷ the tiles still face down. The first-flip chance is shown.`,
        columns: ['Supply', { label: 'Tiles', num: true }, { label: 'First flip', num: true }, 'Reward'],
        rows: list.map((s) => [
          { tag: RANK[s.rank] || `Rank ${s.rank}`, tone: TONE[s.rank] },
          s.slot_count,
          `${+(100 * s.slot_count / tiles).toFixed(1)}%`,
          { reward: ctx.reward(s.reward_id) },
        ]),
      };
    };
    return {
      id: `board-${m.id}`,
      title: title(m),
      group: 'Events',
      summary: `Ticket: ${ctx.rewardName('Item', m.ticket_item_id)} · daily gift: ${ctx.plain(m.reward_popup_locale)}`,
      sections: [
        {
          type: 'facts',
          items: [
            ['Ticket', `${m.ticket_item_count} ${ctx.rewardName('Item', m.ticket_item_id)} per tile`],
            ['Board', first ? `${first.horizontal_slot_value} × ${first.vertical_slot_value} tiles` : null],
            ['Daily gift', `${ctx.plain(m.reward_popup_locale)}: ${m.daily_reward_value} tickets a day for logging in`],
            ['Resupply', `After finding the Type A tile, or after flipping ${m.board_change_count} tiles`],
            ['Bulk Claim', `Flips up to ${m.multi_receive_count} tiles at once (fewer if you lack tickets or tiles); stops early if it hits Type A`],
            ['Fever', fever.length ? `When the Fever count reaches ${fever.map((f) => f.slot_open_value).join(', ')} (1 per tile flipped, reset on resupply), that flip's reward is ×${fever[0].bonus_value}` : null],
          ],
        },
        ...sets.map(setSection),
        {
          type: 'table',
          title: 'Resupply rewards',
          note: 'Taken when you resupply (end a cycle). The last one repeats for every later cycle.',
          columns: ['Cycle', 'Reward'],
          rows: cycles.map((c) => [c.is_repeat ? `${c.number}+` : c.number, { reward: ctx.reward(c.reward_id) }]),
        },
        {
          type: 'table',
          title: 'Supply missions',
          note: 'Each pays tickets (and sometimes more) toward flipping tiles.',
          columns: ['Nikke', 'Goal', 'Reward'],
          rows: ms.map((x) => [
            who(x.mission_condition_target),
            (MISSION[x.mission_condition] || ((v) => `${x.mission_condition} ${v}`))(x.mission_condition_value),
            { reward: ctx.reward(x.reward_id) },
          ]),
        },
      ],
    };
  };

  const helpTitles = [];
  for (let i = 1; i <= 20; i++) {
    const n = String(i).padStart(2, '0');
    const t = ctx.plain(`Locale_System:HELP_GACHABOARD_${n}`);
    if (!t) break;
    const items = [];
    for (let j = 1; j <= 20; j++) {
      const line = ctx.plain(`Locale_System:HELP_GACHABOARD_${n}_${String(j).padStart(2, '0')}`);
      if (!line) break;
      items.push(line);
    }
    helpTitles.push({ type: 'list', title: t, items });
  }

  const m0 = managers[0] || {};
  const f0 = fevers.filter((f) => f.group === m0.fever_group_id).sort((a, b) => a.number - b.number);

  return {
    summary: `Flip tiles on a 5×5 supply board with tickets. Each board holds a fixed set of prizes; find the Type A prize (or flip ${m0.board_change_count} tiles) to take a resupply reward and start a new board.`,
    overview: [
      {
        type: 'list',
        title: 'How it works',
        items: [
          'Each ticket flips one tile of the 5×5 board and gives the reward under it.',
          'A board holds a fixed set of 25 rewards (1 Type A, a few Type B, more Type C and D), so what you have flipped is gone until the next board.',
          `Find the Type A tile, or flip ${m0.board_change_count} tiles, to request a resupply: you get the cycle's resupply reward and a fresh board.`,
          `Every tile flipped adds 1 to the Fever count; when it reaches ${f0.map((f) => f.slot_open_value).join(', ')}, that flip pays ×${f0[0]?.bonus_value}. Resupplying resets it.`,
          'Tickets: a daily login gift plus missions for the featured Nikkes.',
        ],
      },
      {
        type: 'table',
        title: 'Events',
        columns: ['Featured Nikkes', 'Ticket', 'Daily gift'],
        rows: managers.map((m) => [{ page: `board-${m.id}`, label: title(m) }, ctx.rewardName('Item', m.ticket_item_id), ctx.plain(m.reward_popup_locale)]),
      },
    ],
    pages: [
      ...managers.map(eventPage),
      { id: 'help', title: 'In-game help', sections: helpTitles },
    ],
  };
}

module.exports = { build };
