// Merch Bag / Itabag (EventItabag*): collect T.T. STAR merch from a scratch-ticket lottery
// and arrange it in a bag (an "itabag"). The lottery is a fixed box ("kuji"): it holds a set
// number of copies of every piece of merch, and each ticket opens a pack of merch from it.
// New bags and ribbons unlock as you play the lottery more; collecting more distinct merch
// pays collection rewards. Tickets come from a daily gift and from items found in the field.

const num = (v) => Number(v).toLocaleString('en-US');
const RANK_TONE = { SSR: 'accent', SR: 'good' };
const BAG_TYPE = { DuffelBag: 'Duffel bag', HandBag: 'Handbag' };
// output_virtual_sheet_setting: which layer of the bag a merch type sits on.
const LAYER = { Inner: 'inside the clear cover', Outer: 'on top of the cover', Both: 'inside or on top' };

function build(ctx) {
  const m = ctx.table('EventItabagManagerTable')[0];
  const mine = (t) => ctx.table(t).filter((x) => x.manager_id === m.id);
  const bags = mine('EventItabagBagTable').sort((a, b) => a.itabag_resource_order - b.itabag_resource_order);
  const ribbons = mine('EventItabagRibbonTable').sort((a, b) => a.itabag_ribbon_resource_order - b.itabag_ribbon_resource_order);
  const goods = mine('EventItabagGoodsTable').sort((a, b) => a.itabag_goods_order - b.itabag_goods_order);
  const types = mine('EventItabagGoodsTypeTable');
  const kuji = new Map(mine('EventItabagKujiBoxListTable').map((k) => [k.drop_goods_id, k]));
  const collection = mine('EventItabagCollectionRewardTable').sort((a, b) => a.reward_order - b.reward_order);

  const ticket = ctx.rewardName('Item', m.kuji_ticket_currency_id);
  const boxTotal = [...kuji.values()].reduce((n, k) => n + k.drop_goods_box_value, 0);
  const typeName = (t) => ctx.plain(types.find((x) => x.itabag_goods_type === t)?.itabag_goods_type_name, t);
  const goodsCell = (g) => ({ img: ctx.img(g.itabag_goods_resource), caption: ctx.plain(g.itabag_goods_name), size: 'small' });
  const unlock = (x) => (x.is_default_itabag || x.is_default_itabag_ribbon ? 'From the start' : x.is_locked ? `Play the lottery ${x.open_condition_open_kuji} times` : 'Unlocked');
  const upgrade = ctx.date(m.kuji_ticket_daily_gift_upgrade_time);

  // One page per merch type: picture, rarity, size in the bag grid, how many are in the box.
  const typePages = types.map((t) => {
    const list = goods.filter((g) => g.itabag_goods_type === t.itabag_goods_type);
    const copies = list.reduce((n, g) => n + (kuji.get(g.id)?.drop_goods_box_value || 0), 0);
    return {
      id: `goods-${t.itabag_goods_type.toLowerCase()}`,
      title: ctx.plain(t.itabag_goods_type_name, t.itabag_goods_type),
      group: 'Merch',
      count: list.length,
      summary: `${list.length} designs, ${num(copies)} copies in the lottery box; placed ${LAYER[t.output_virtual_sheet_setting] || t.output_virtual_sheet_setting}.`,
      sections: [{
        type: 'table',
        note: 'Size is in bag-grid cells (width × height). "In box" is how many copies the lottery box holds. The share assumes every copy is equally likely; the box list also gives each design a weight (rarer merch has a higher one) whose role is unclear.',
        columns: ['Merch', 'Rarity', 'Size', { label: 'In box', num: true }, { label: 'Share of box', num: true }, { label: 'Max owned', num: true }, 'Description'],
        rows: list.map((g) => {
          const k = kuji.get(g.id);
          return [
            goodsCell(g),
            { tag: g.itabag_goods_rank, tone: RANK_TONE[g.itabag_goods_rank] },
            `${g.itabag_goods_horizontal_grid_count} × ${g.itabag_goods_vertical_grid_count}`,
            k ? k.drop_goods_box_value : '',
            k ? `${+(100 * k.drop_goods_box_value / boxTotal).toFixed(2)}%` : '',
            g.itabag_goods_stack_limit,
            ctx.plain(g.itabag_goods_description),
          ];
        }),
      }],
    };
  });

  // Rarity summary of the whole box.
  const byRank = new Map();
  for (const g of goods) {
    const k = kuji.get(g.id);
    const r = byRank.get(g.itabag_goods_rank) || { designs: 0, copies: 0 };
    r.designs += 1;
    r.copies += k ? k.drop_goods_box_value : 0;
    byRank.set(g.itabag_goods_rank, r);
  }

  return {
    summary: 'Scratch lottery tickets to collect T.T. STAR merch, then decorate a merch bag with it. Collecting more designs pays rewards; playing the lottery more unlocks new bags and ribbons.',
    overview: [
      { type: 'gallery', title: 'Event notice', items: ['img_event_field_notice_popup_staranis_01', 'img_event_field_notice_popup_staranis_02'].filter((n) => ctx.img(n)).map((n) => ({ img: n, caption: '' })) },
      {
        type: 'list',
        title: 'What is a merch bag?',
        items: [1, 2].map((i) => ctx.plain(`Locale_Event:event_field_notice_popup_common_sub_description_0${i}`)).filter(Boolean)
          .flatMap((t) => t.split('\n').map((s) => s.replace(/^■\s*/, '').trim()).filter(Boolean)),
      },
      {
        type: 'facts',
        title: 'The lottery',
        items: [
          ['Ticket', `${m.kuji_ticket_consume} ${ticket} per play`],
          ['Each play', `Opens a pack of merch (pack size ${m.kuji_drop_value}; meaning not fully confirmed)`],
          ['Box', `${num(boxTotal)} pieces of merch in ${kuji.size} designs; what you draw leaves the box`],
          ['Daily gift', `${m.kuji_ticket_daily_gift_value} tickets a day for opening the merch bag page${upgrade ? `, ${m.kuji_ticket_daily_gift_upgrade_value} from ${upgrade}` : ''}`],
          ['Other tickets', 'Found as lost relics in the event field'],
          ['Unlocks', `Opens after clearing an event field stage (${m.open_condition_event_stage_clear})`],
        ],
      },
      {
        type: 'table',
        title: 'What is in the box',
        note: 'Share = copies ÷ all copies, assuming every copy is equally likely (the per-design weights in the box list are not explained in-game).',
        columns: ['Rarity', { label: 'Designs', num: true }, { label: 'Copies', num: true }, { label: 'Share', num: true }],
        rows: ['SSR', 'SR', 'R'].filter((r) => byRank.has(r)).map((r) => [
          { tag: r, tone: RANK_TONE[r] }, byRank.get(r).designs, byRank.get(r).copies, `${+(100 * byRank.get(r).copies / boxTotal).toFixed(2)}%`,
        ]),
      },
      {
        type: 'facts',
        title: 'The bag',
        items: [
          ['Grid', `${m.horizontal_count_verification_data} × ${m.vertical_count_verification_data} cells (from the layout check data)`],
          ['Merch types', types.map((t) => `${typeName(t.itabag_goods_type)}: ${LAYER[t.output_virtual_sheet_setting] || t.output_virtual_sheet_setting}`).join('; ')],
        ],
      },
    ],
    pages: [
      ...typePages,
      {
        id: 'bags',
        title: 'Bags and ribbons',
        group: 'Decoration',
        count: bags.length + ribbons.length,
        sections: [
          {
            type: 'table',
            title: 'Bags',
            columns: ['Bag', 'Clear cover', 'Type', 'Unlock', 'Description'],
            rows: bags.map((b) => [
              { img: ctx.img(b.itabag_bag_resource), caption: ctx.plain(b.itabag_name) },
              { img: ctx.img(b.itabag_plastic_cover_resource), size: 'small' },
              BAG_TYPE[b.itabag_type] || b.itabag_type,
              unlock(b),
              ctx.plain(b.itabag_description),
            ]),
          },
          {
            type: 'table',
            title: 'Ribbons',
            note: 'Not every bag can take a ribbon.',
            columns: ['Ribbon', 'Unlock', 'Description'],
            rows: ribbons.map((r) => [
              { img: ctx.img(r.itabag_ribbon_resource), caption: ctx.plain(r.itabag_ribbon_name), size: 'small' },
              unlock(r),
              ctx.plain(r.itabag_ribbon_description),
            ]),
          },
        ],
      },
      {
        id: 'collection',
        title: 'Collection rewards',
        group: 'Rewards',
        count: collection.length,
        summary: `Rewards for the number of different merch designs you own (out of ${goods.length}).`,
        sections: [{
          type: 'table',
          note: '"Rerun" marks the steps that are kept when the event returns in the Archives.',
          columns: [{ label: 'Level', num: true }, { label: 'Designs', num: true }, 'Reward', ''],
          rows: collection.map((c) => [c.reward_order, c.reward_goal_value, { reward: ctx.reward(c.reward_id) }, c.is_use_in_archive ? { tag: 'Rerun', tone: 'good' } : '']),
        }],
      },
    ],
  };
}

module.exports = { build };
