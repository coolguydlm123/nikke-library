// White Memory (EventTextAdventure*): a branching text adventure. Snow White picks an area
// to search (FirstSelect), reads pages and makes choices until she reaches one of 21 endings.
// Pages are SelectPage (has choices), ResultPage (one page leading to next_page_id) or
// EndingPage. Some pages hand out a loot item; some choices need an item or an ending seen
// before. The table holds two copies of the game: the original event and the archive rerun
// (is_archive_event), which differ only in how the areas unlock.

const ENDING = {
  NORMAL: { key: 'Locale_Event:event_text_adventure_ending_normal', fallback: 'NORMAL ENDING', tone: '' },
  BAD: { key: 'Locale_Event:event_text_adventure_ending_bad', fallback: 'BAD ENDING', tone: 'bad' },
  TRUEENDING: { key: 'Locale_Event:event_text_adventure_ending_true', fallback: 'TRUE ENDING', tone: 'good' },
  HIDDEN: { key: 'Locale_Event:event_text_adventure_ending_hidden', fallback: 'HIDDEN ENDING', tone: 'accent' },
};

// The in-game help popup (HelpTipTable -> HelpTipDescriptionTable): a Title row starts a
// topic, the Description rows after it are its lines.
function helpTip(ctx, id) {
  const tip = ctx.table('HelpTipTable').find((h) => h.id === id);
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
  const managers = ctx.table('EventTextAdventureManagerTable');
  const m = managers.find((x) => !x.is_archive_event) || managers[0];
  const rerun = managers.find((x) => x.is_archive_event);
  const allSelects = ctx.table('EventTextAdventureFirstSelectTable');
  const areas = allSelects.filter((f) => f.first_select_group_id === m.first_select_group_id).sort((a, b) => a.id - b.id);
  const pages = ctx.table('EventTextAdventureEventPageTable').filter((p) => p.manager_id === m.id);
  const pageById = new Map(pages.map((p) => [p.id, p]));
  const options = ctx.table('EventTextAdventureSelectOptionTable').filter((o) => o.manager_id === m.id);
  const items = ctx.table('EventTextAdventureLootItemTable').filter((i) => i.manager_id === m.id).sort((a, b) => a.id - b.id);
  const itemById = new Map(items.map((i) => [i.id, i]));
  const charge = (id) => ctx.table('AutoChargeTable').find((c) => c.id === id);

  const areaIndex = new Map(areas.map((a, i) => [a.id, i + 1]));
  const areaName = (a) => ctx.plain(a.first_select_localkey, `Area ${areaIndex.get(a.id)}`);
  const areaPage = (id) => `area-${areaIndex.get(id)}`;
  const optionsOf = (p) => (p.select_option_group_id ? options.filter((o) => o.group_id === p.select_option_group_id).sort((a, b) => a.id - b.id) : []);
  const endings = pages.filter((p) => p.page_type === 'EndingPage').sort((a, b) => a.ending_num - b.ending_num);

  // Pages are numbered "area-step" from their ids (1001104 = area 1, page 04).
  const pageNo = (p) => `${areaIndex.get(p.first_select_id) || '?'}-${String(p.id % 100).padStart(2, '0')}`;
  const endingTitle = (p) => ctx.plain(p.ending_sub_title_localkey, `Ending ${p.ending_num}`);
  const endingTag = (p) => {
    const e = ENDING[p.ending_type] || { fallback: p.ending_type };
    return { tag: `${ctx.plain(e.key, e.fallback)} ${p.ending_num}`, tone: e.tone };
  };
  const itemName = (id) => ctx.plain(itemById.get(id)?.item_name_localkey, `Item ${id}`);
  const itemCell = (id, size = 'small') => {
    const it = itemById.get(id);
    return it ? { img: ctx.img(it.icon_resource), caption: itemName(id), size } : `Item ${id}`;
  };
  // Where a choice or a page leads: another page of the area, an ending, or back to the map.
  const target = (id) => {
    const p = pageById.get(id);
    if (!p) return `page ${id}`;
    if (p.page_type === 'EndingPage') return `${ctx.plain(ENDING[p.ending_type]?.key, p.ending_type)} ${p.ending_num}: ${endingTitle(p)}`;
    return `page ${pageNo(p)}`;
  };
  const condition = (o) => {
    if (o.open_condition_type === 'LootItem') return `Needs the item ${itemName(o.open_condition_value)}`;
    if (o.open_condition_type === 'Ending') {
      const e = pageById.get(o.open_condition_value);
      return `Needs ending ${e ? `${e.ending_num} (${endingTitle(e)})` : o.open_condition_value} seen before`;
    }
    return '';
  };

  // One section per story page: picture, text, item found, then the choices or where it goes.
  const pageSection = (p) => {
    const choices = optionsOf(p).map((o) => {
      const cond = [condition(o), o.is_hidden ? 'hidden until unlocked' : ''].filter(Boolean).join('; ');
      return { text: `“${ctx.plain(o.selection_localkey)}” → ${target(o.page_id)}`, sub: cond || undefined };
    });
    const next = p.is_go_to_first_select_page ? 'Back to the area map (choose another area)' : p.next_page_id ? `→ ${target(p.next_page_id)}` : '';
    return {
      type: 'facts',
      title: p.page_type === 'EndingPage' ? `${endingTag(p).tag}: ${endingTitle(p)}` : `Page ${pageNo(p)}`,
      items: [
        ['', p.resource_name ? { img: ctx.img(p.resource_name), size: 'large' } : null],
        ['', ctx.plain(p.scenario_localkey)],
        ['Item found', p.get_loot_item_id ? itemCell(p.get_loot_item_id) : null],
        ['Hint', p.ending_hint_localkey ? ctx.plain(p.ending_hint_localkey) : null],
        ['Choices', choices.length ? choices : null],
        ['Next', next],
      ],
    };
  };

  // What an item or ending unlocks: the choices that name it.
  const unlocks = (type, value) => options.filter((o) => o.open_condition_type === type && o.open_condition_value === value)
    .map((o) => {
      const from = pages.find((p) => p.select_option_group_id === o.group_id);
      return from ? { page: areaPage(from.first_select_id), label: `“${ctx.plain(o.selection_localkey)}” (page ${pageNo(from)})` } : ctx.plain(o.selection_localkey);
    });

  const areaPages = areas.map((a) => {
    const story = pages.filter((p) => p.first_select_id === a.id && p.page_type !== 'EndingPage').sort((x, y) => x.id - y.id);
    const ends = endings.filter((p) => p.first_select_id === a.id);
    return {
      id: areaPage(a.id),
      title: areaName(a),
      group: 'Areas',
      count: story.length,
      summary: ctx.plain(a.first_select_description_localkey),
      sections: [
        {
          type: 'facts',
          items: [
            ['', { img: ctx.img(a.first_select_resource), size: 'large' }],
            ['Opens', a.is_use_time_condition ? ctx.date(a.time_condition) : 'From the start'],
            ['Endings here', ends.map((e) => `${endingTag(e).tag}: ${endingTitle(e)}`)],
          ],
        },
        ...story.map(pageSection),
        ...ends.map(pageSection),
      ],
    };
  });

  const quickEnd = pageById.get(m.quick_end_event_page_id);
  const sharedEndings = endings.filter((e) => !areaIndex.has(e.first_select_id));
  const endingCharge = charge(m.ticket_auto_charge_id);
  const rewardCharge = charge(m.reward_ticket_auto_charge_id);

  return {
    summary: 'A branching text adventure: as Snow White, pick an area to search, make choices page by page and collect all 21 endings. Items found on one run open new choices on later runs.',
    overview: [
      {
        type: 'facts',
        title: 'How it plays',
        items: [
          ['Intro story', ctx.scene(m.first_enter_scenario_group_id)],
          ['A run', 'Choose one of the areas, then read and pick choices until you reach an ending. Some pages give an item; some choices need an item or an ending you have already seen.'],
          ['New endings', endingCharge ? `${endingCharge.auto_charge_plus} attempt per day (max ${endingCharge.auto_charge_max}): reaching an ending you haven't recorded yet uses it` : null],
          ['Rewards', rewardCharge ? [`${rewardCharge.auto_charge_plus} reward attempt per day (max ${rewardCharge.auto_charge_max}); reaching any ending with an attempt left gives:`, { reward: ctx.reward(m.reward_id) }] : { reward: ctx.reward(m.reward_id) }],
          [ctx.plain('Locale_Event:whitememory_quick_end_title_localkey', 'Stand Guard'), quickEnd ? `Skip the search and go straight to ${endingTag(quickEnd).tag} (“${endingTitle(quickEnd)}”) to collect the day’s reward. Opens after ${m.quick_end_open_condition_value} new ending(s).` : null],
          ['Endless mode', `From ${ctx.date(m.infinity_mod_active_date) || 'the last event day'}: endings no longer use attempts (rewards still once a day)`],
          ['Rerun', rerun ? 'In the archive rerun every area after the first opens by reaching an ending instead of on a date (see the areas table).' : null],
        ],
      },
      {
        type: 'table',
        title: 'Areas',
        columns: ['', 'Area', 'Opens', 'Opens (rerun)', { label: 'Endings', num: true }],
        rows: areas.map((a) => {
          const re = rerun && allSelects.find((f) => f.first_select_group_id === rerun.first_select_group_id && f.first_select_resource === a.first_select_resource);
          const reEnd = re?.is_use_ending_condition && ctx.table('EventTextAdventureEventPageTable').find((p) => p.id === re.ending_condition);
          return [
            { img: ctx.img(a.first_select_resource), size: 'small' },
            { page: areaPage(a.id), label: areaName(a) },
            a.is_use_time_condition ? ctx.date(a.time_condition) : 'From the start',
            reEnd ? `After ending ${reEnd.ending_num} (${endingTitle(reEnd)})` : re ? 'From the start' : '',
            endings.filter((e) => e.first_select_id === a.id).length,
          ];
        }),
      },
      { type: 'help', help: helpTip(ctx, m.help_tip_id) },
    ],
    pages: [
      ...areaPages,
      {
        id: 'endings',
        title: 'Endings',
        count: endings.length,
        summary: 'Every ending, where it is found and what it gives or unlocks. Bad endings come with a hint toward a better route.',
        sections: [
          {
            type: 'table',
            columns: [{ label: '#', num: true }, 'Type', 'Ending', 'Area', 'Hint', 'Gives item', 'Unlocks'],
            rows: endings.map((e) => [
              e.ending_num,
              endingTag(e),
              endingTitle(e),
              areaIndex.has(e.first_select_id) ? { page: areaPage(e.first_select_id), label: areaName(areas[areaIndex.get(e.first_select_id) - 1]) } : 'Stand Guard',
              ctx.plain(e.ending_hint_localkey),
              e.get_loot_item_id ? itemCell(e.get_loot_item_id) : '',
              unlocks('Ending', e.id),
            ]),
          },
          ...sharedEndings.map(pageSection),
        ],
      },
      {
        id: 'items',
        title: 'Items',
        count: items.length,
        summary: ctx.plain('Locale_Event:event_text_adventure_loot_item_description', 'Items found during searches; they open new choices.'),
        sections: [{
          type: 'table',
          note: 'Once found, an item stays for every later run.',
          columns: ['Item', 'Description', 'Found on', 'Opens the choice'],
          rows: items.map((it) => {
            const src = pages.find((p) => p.get_loot_item_id === it.id);
            return [
              itemCell(it.id, 'large'),
              ctx.plain(it.item_description_localkey),
              src ? { page: areaPage(src.first_select_id), label: src.page_type === 'EndingPage' ? `${endingTag(src).tag}: ${endingTitle(src)}` : `page ${pageNo(src)}` } : '',
              unlocks('LootItem', it.id),
            ];
          }),
        }],
      },
    ],
  };
}

module.exports = { build };
