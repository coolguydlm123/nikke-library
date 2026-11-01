// Costume Gacha (EventBoxGacha*): a "box" gacha. Each banner holds 10 prizes; every draw
// takes one prize out of the box, so 10 draws empty it and win everything. Draw n costs the
// banner's ticket by the price table (the first draw is free). Each prize has a base weight
// per draw (rates are per 10,000 = 100%); prizes already won drop out and their share is
// spread over the rest, so the real chance is base ÷ (100% − base of the prizes already won).
// The top prize (and, on some banners, the 2nd) has weight 0 on the first draws.

const pct = (w) => `${+(w / 100).toFixed(2)}%`;

function build(ctx) {
  const banners = ctx.table('EventBoxGachaTable').sort((a, b) => a.id - b.id);
  const prices = ctx.table('EventBoxGachaPriceTable');
  const probs = ctx.table('EventBoxGachaProbTable');
  const prizes = ctx.table('EventBoxGachaRewardTable');
  const events = new Map(ctx.table('EventManagerTable').map((e) => [e.id, e]));

  const priceOf = (group) => prices.filter((p) => p.group === group).sort((a, b) => a.count - b.count);
  const prizeList = (group) => prizes.filter((p) => p.group === group).sort((a, b) => a.order - b.order);
  // weight[order][draw]
  const probTable = (group) => {
    const t = new Map();
    for (const p of probs.filter((x) => x.group === group)) {
      if (!t.has(p.order)) t.set(p.order, new Map());
      t.get(p.order).set(p.count, p.rate);
    }
    return t;
  };
  // ctx.rewardName doesn't resolve costumes (CharacterCostumeTable names its key
  // costume_name_locale), so look them up here: "<character>: <costume>".
  const costumeTable = new Map(ctx.table('Character/CharacterCostumeTable').map((c) => [c.id, c]));
  const charByResource = new Map();
  for (const c of ctx.table('Character/CharacterTable')) if (!charByResource.has(c.resource_id)) charByResource.set(c.resource_id, c);
  const costumeName = (id) => {
    const c = costumeTable.get(id);
    if (!c) return null;
    const who = charByResource.get(c.resource_id);
    const name = ctx.plain(c.costume_name_locale, `Costume ${id}`);
    return who ? `${ctx.plain(who.name_localkey, '')}: ${name}`.replace(/^: /, '') : name;
  };
  const prizeName = (p) => (p.item_type === 'CharacterCostume' && costumeName(p.item_id)) || ctx.rewardName(p.item_type, p.item_id);
  const prizeCell = (p) => (p.item_count > 1 ? `${prizeName(p)} ×${p.item_count.toLocaleString('en-US')}` : prizeName(p));
  const cost = (p) => (p.item_type === 'None' || !p.item_count ? 'Free' : p.item_count);
  const costumes = (b) => prizeList(b.gacha_reward_group).filter((p) => p.item_type === 'CharacterCostume');
  const ticketName = (b) => ctx.rewardName(b.event_item_type, b.event_item_id);
  // Names are generic ("Costume Gacha"), so the costume(s) name the banner.
  // A banner shown again later gets "(rerun)" so the sidebar entries can be told apart.
  const seen = new Set();
  const titles = new Map(banners.map((b) => {
    const t = costumes(b).map(prizeName).join(' / ') || ctx.plain(b.name, `Banner ${b.id}`);
    const out = seen.has(t) ? `${t} (rerun)` : t;
    seen.add(t);
    return [b.id, out];
  }));
  const title = (b) => titles.get(b.id);
  const resale = (b) => /RESALE/.test(b.description);

  const bannerPage = (b) => {
    const list = prizeList(b.gacha_reward_group);
    const pt = probTable(b.prob_group);
    const draws = priceOf(b.price_group);
    const counts = draws.map((d) => d.count);
    const firstDraw = (order) => counts.find((c) => (pt.get(order)?.get(c) || 0) > 0);
    const total = draws.reduce((n, d) => n + (d.item_type === 'None' ? 0 : d.item_count), 0);
    const info = b.on_info ? ctx.plain(b.info_description) : '';
    return {
      id: `banner-${b.id}`,
      title: title(b),
      group: 'Banners',
      count: list.length,
      summary: `${ticketName(b)}${resale(b) ? ' · rerun' : ''} · ${total} tickets to empty the box`,
      sections: [
        {
          type: 'facts',
          items: [
            ['Ticket', ticketName(b)],
            ['Free ticket', b.free_ticket_item_id ? ctx.rewardName(b.event_item_type, b.free_ticket_item_id) : null],
            ['Whole box', `${list.length} draws, ${total} tickets`],
            ['Rerun', resale(b) ? 'Costumes you already own are left out, and the draw count shrinks to match' : null],
            ['Note', info || null],
            ['Banner art', { key: b.ui_prefab }],
          ],
        },
        {
          type: 'table',
          title: 'Prizes and base rates',
          note: 'Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).',
          columns: ['Tier', 'Prize', 'From draw', ...counts.map((c) => ({ label: `#${c}`, num: true }))],
          rows: list.map((p) => [
            p.tier,
            p.tier === 1 ? { b: prizeCell(p) } : prizeCell(p),
            firstDraw(p.order) || '',
            ...counts.map((c) => pct(pt.get(p.order)?.get(c) || 0)),
          ]),
        },
        {
          type: 'table',
          title: 'Cost per draw',
          columns: [{ label: 'Draw', num: true }, { label: 'Tickets', num: true }, { label: 'Running total', num: true }],
          rows: draws.reduce((acc, d) => {
            const run = (acc.length ? acc[acc.length - 1][2] : 0) + (d.item_type === 'None' ? 0 : d.item_count);
            acc.push([d.count, cost(d), run]);
            return acc;
          }, []),
        },
      ],
    };
  };

  const first = banners[0];
  const rules = first ? ctx.plain(first.description).split('\n').map((s) => s.trim()) : [];

  return {
    summary: 'A costume box gacha: each banner holds 10 prizes, every draw removes one, and 10 draws win them all. Draws get pricier as the box empties; the costume can only come out from the 5th draw.',
    overview: [
      {
        type: 'facts',
        title: 'How it works',
        items: [
          ['Box', '10 prizes per banner; each draw gives one and it never comes back'],
          ['Price', first ? priceOf(first.price_group).map((d) => `#${d.count}: ${cost(d)}`).join(', ') + ' tickets' : null],
          ['Rates', 'Base rates are per draw, out of 10,000; the rates of prizes already won are shared out over the prizes left'],
          ['Top prize', 'Weight 0 on draws 1–4, so it can only come out from the 5th draw (on a two-costume banner, both costumes)'],
          ['Leftover tickets', 'Returned by mail as Free Gems when the event ends'],
        ],
      },
      {
        type: 'table',
        title: 'Banners',
        columns: [{ label: '#', num: true }, 'Costume', 'Ticket', 'Banner'],
        rows: banners.map((b) => [
          b.id,
          { page: `banner-${b.id}`, label: title(b) },
          ticketName(b),
          [resale(b) ? { tag: 'Rerun', tone: 'accent' } : '', { key: events.get(b.event_id)?.event_thumbnail_resource_id || b.ui_prefab }].filter(Boolean),
        ]),
      },
      { type: 'list', title: 'In-game rules (first banner)', items: rules.filter(Boolean) },
    ],
    pages: banners.map(bannerPage),
  };
}

module.exports = { build };
