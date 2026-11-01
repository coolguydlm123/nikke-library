// Hero Road (EventDice*): a dice board. Each roll spends event tokens and moves the character
// along a looping board of 30 cells; the cell landed on gives an item and/or fills a gauge
// (Hero Power for Laplace on Hero Road, Search Degree for Volt on Volt Road, which uses the
// same tables). A full gauge (100) triggers the big event (Decimate / Search Success), which
// pays a step reward and empties the gauge. Passing the Start cell ("Go the Distance") adds a
// bulk amount. EventDiceTable has one row per board: the two originals and their archive
// reruns (is_archive), which reuse the layout without cell or step rewards.
// (Not VOLT TRIP: that is EventDiceTrack*, shown on its own page.)

const BOARD_NAME = { 1001: 'Hero Road', 1002: 'Volt Road', 1003: 'Hero Road', 1004: 'Volt Road' };

// The in-game help popup (HelpTipTable -> HelpTipDescriptionTable): a Title row starts a
// topic, the Description rows after it are its lines.
function helpTip(ctx, tip) {
  if (!tip) return [];
  const rows = ctx.table('HelpTipDescriptionTable').filter((d) => d.group === tip.description_group).sort((a, b) => a.order - b.order);
  const pages = [];
  for (const r of rows) {
    const text = ctx.plain(`Locale_System:${r.value}`);
    if (r.type === 'Title') pages.push({ title: text, image: null, text: '' });
    else if (pages.length) pages[pages.length - 1].text += (pages[pages.length - 1].text ? '\n' : '') + text;
  }
  return [{ title: ctx.plain(tip.title, 'How to play'), pages }];
}

function build(ctx) {
  const boards = ctx.table('EventDiceTable');
  const cells = ctx.table('EventDiceBoardTable');
  const resources = ctx.table('EventDiceResourceTable');
  const tileText = ctx.table('EventDiceTileLocaleTable');
  const helpTips = ctx.table('HelpTipTable').filter((h) => h.view_id === 40001);

  // One page per original board; the rerun copy only changes the token (and drops rewards).
  const pages = boards.filter((b) => !b.is_archive).map((b) => {
    const name = BOARD_NAME[b.board_id] || `Board ${b.board_id}`;
    const rerun = boards.find((x) => x.is_archive && x.ui_prefab !== 'whitememory' && BOARD_NAME[x.board_id] === name);
    const help = helpTip(ctx, helpTips.find((h) => h.view_sub_id === b.help_tip_view_sub_id));
    const topic = (i, fallback) => help[0]?.pages[i]?.title || fallback;
    const gauge = topic(3, 'Gauge'); // "Hero Power" / "Search Degree"
    const fullEvent = topic(4, 'Gauge event'); // "Decimate" / "Search Success"
    const list = cells.filter((c) => c.group_id === b.board_id).sort((x, y) => x.slot_id - y.slot_id);
    const res = resources.filter((r) => r.group_id === b.resource_id);
    const resImg = (r) => (r ? ctx.img(r.image_resource) || ctx.img(r.ani_resource) : null);
    const resOf = (type) => res.find((r) => r.slot_type === type);
    const tile = (type) => tileText.find((t) => t.group_id === b.board_id && t.slot_type === type);
    const tileName = (type) => ctx.plain(tile(type)?.name_localkey, type);

    // Gauge change of a cell in words. Training gives more for a 2nd/3rd training in a row;
    // Contract (Combat / Search) rolls one of three amounts by the *_rate chances.
    const effect = (c) => {
      const p = [1, 2, 3].map((i) => c[`get_heropower_${i}`]);
      const r = [1, 2, 3].map((i) => c[`get_heropower_${i}_rate`]);
      switch (c.event_type) {
        case 'Start': return `Move ${c.go_to} cells on when landed on; passing it gives +${b.board_finish_gauge} ${gauge}`;
        case 'GoTo': return `Move ${Math.abs(c.go_to)} cells ${c.go_to < 0 ? 'back' : 'on'}`;
        case 'Leisure': return `+${p[0]} ${gauge}`;
        case 'Training': return `+${p[0]} ${gauge} (+${p[1]} for a 2nd training in a row, +${p[2]} for a 3rd)`;
        case 'Contract': return `+${p[0]} (${r[0]}%), +${p[1]} (${r[1]}%) or +${p[2]} (${r[2]}%) ${gauge}`;
        case 'PoorCondition': return `−${p[0]} ${gauge}`;
        case 'Item': return 'Item reward only';
        default: return '';
      }
    };

    const types = [...new Set(list.map((c) => c.event_type))];
    const typeImg = { Leisure: 'Leisure', Training: 'Training_first', Contract: 'Contract_first', PoorCondition: 'PoorCondition', Start: 'finish' };
    const steps = b.dice_clear_reward_list.map((s, i) => [i + 1, s.clear_reward_id]).filter(([, id]) => id);
    // Story per step: only real scenes of this event (the Hero Road row lists placeholder ids
    // copied from other events, so a scene must carry the board's own prefab name).
    const stepScene = (i) => {
      const id = b.dice_clear_scenario_group_list[i]?.clear_scenario_group_id;
      return id && id.includes(b.ui_prefab) && b.ui_prefab !== 'whitememory' ? ctx.scene(id) : null;
    };
    const intro = b.first_enter_scenario_group_id.includes(b.ui_prefab) && b.ui_prefab !== 'whitememory' ? ctx.scene(b.first_enter_scenario_group_id) : null;
    const token = ctx.rewardName('Item', b.event_item_id);

    return {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      title: name,
      group: 'Boards',
      count: list.length,
      summary: help[0]?.pages[0]?.text || '',
      sections: [
        {
          type: 'facts',
          items: [
            ['Intro story', intro],
            ['Roll', `${b.dice_consume} × ${token} per roll${rerun && rerun.event_item_id !== b.event_item_id ? ` (rerun: ${ctx.rewardName('Item', rerun.event_item_id)})` : ''}; move as many cells as the dice shows`],
            [gauge, `Fills to ${b.max_gauge}; at ${b.max_gauge} the ${fullEvent} event plays, gives the next step reward and resets the gauge to 0`],
            ['Go the Distance', `Passing the Start cell gives +${b.board_finish_gauge} ${gauge}`],
            ['Step rewards', steps.length ? `${steps.length} special rewards for the 1st to ${steps.length}th ${fullEvent}, then a repeat reward each time` : null],
            ['Rerun', rerun ? 'The archive rerun uses the same board without cell or step rewards.' : null],
          ],
        },
        {
          type: 'table',
          title: 'Cell types',
          columns: ['', 'Cell', 'Effect', { label: 'On board', num: true }],
          rows: types.map((t) => {
            const first = list.find((c) => c.event_type === t);
            return [
              { img: resImg(resOf(typeImg[t])), size: 'small' },
              { text: tileName(t), sub: ctx.plain(tile(t)?.description_localkey).replace('{0}', t === 'GoTo' ? 'N' : t === 'Start' ? first.go_to : first.get_heropower_1) },
              t === 'GoTo' ? 'Move a set number of cells (see the cells list)' : effect(first),
              list.filter((c) => c.event_type === t).length,
            ];
          }),
        },
        {
          type: 'table',
          title: 'Cells',
          note: 'Listed by the cell’s position number on the board (slot); the route itself follows the arrows on the board.',
          columns: [{ label: 'Slot', num: true }, 'Cell', 'Effect', 'Reward'],
          rows: list.map((c) => [c.slot_id, tileName(c.event_type), effect(c), c.reward_id ? { reward: ctx.reward(c.reward_id) } : '']),
        },
        steps.length && {
          type: 'table',
          title: `${fullEvent} rewards`,
          note: `One step per full ${gauge} gauge. After the last step the repeat reward is given every time.`,
          columns: [{ label: 'Step', num: true }, 'Reward', 'Story'],
          rows: [
            ...steps.map(([n, id]) => [n, { reward: ctx.reward(id) }, stepScene(n - 1)]),
            b.clear_reward_id_repeat ? ['Repeat', { reward: ctx.reward(b.clear_reward_id_repeat) }, ''] : null,
          ].filter(Boolean),
        },
        {
          type: 'table',
          title: 'Cell events',
          note: 'The cut-in shown for each event.',
          columns: ['', 'Event', 'Line'],
          rows: res.map((r) => [{ img: resImg(r), size: 'large' }, ctx.plain(r.name_localkey).replace('{0}', 'N'), ctx.plain(r.description_localkey)]),
        },
        { type: 'help', help },
      ].filter(Boolean),
    };
  });

  return {
    summary: 'A dice board: spend tokens to roll, move around a looping board and land on cells that give items or fill a gauge. Each full gauge pays a step reward. Covers Hero Road (Laplace) and Volt Road (Volt).',
    overview: [
      {
        type: 'list',
        title: 'How it plays',
        items: [
          'Each roll costs event tokens; the character moves as many cells as the dice shows.',
          'Rest, Training and Combat/Search cells fill the gauge; Poor Condition/Accident cells drain it; Item cells give an item; Move cells push you forward or back.',
          'Training in a row gives more each time (1st, 2nd, 3rd); Combat/Search rolls a small, medium or large amount.',
          'Passing the Start cell (Go the Distance) adds a big chunk of gauge.',
          'A full gauge (100) triggers the gauge event: you get the next step reward and the gauge empties. After the last step a repeat reward is given.',
        ],
      },
      {
        type: 'table',
        title: 'Boards',
        columns: ['Board', 'Token', { label: 'Tokens per roll', num: true }, { label: 'Cells', num: true }, { label: 'Step rewards', num: true }],
        rows: boards.filter((b) => !b.is_archive).map((b, i) => [
          { page: pages[i].id, label: pages[i].title },
          ctx.rewardName('Item', b.event_item_id),
          b.dice_consume,
          cells.filter((c) => c.group_id === b.board_id).length,
          b.dice_clear_reward_list.filter((s) => s.clear_reward_id).length,
        ]),
      },
    ],
    pages,
  };
}

module.exports = { build };
