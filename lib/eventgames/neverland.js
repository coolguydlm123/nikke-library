// Snowfall Oasis dating sim (EventDatingSim*): a 21-day holiday at Snowfield Hot Spring.
// Each in-game day has three time slots (daytime, evening, night). On the map you pick one of
// six locations; whoever is scheduled there at that time starts a Scenario Event, whose
// choices give Bond (+25 / +50 / +100) with that Nikke. Talking costs a Heart Clock, and
// spending Heart Clocks is what moves the clock forward. When a Nikke's Bond reaches the
// target of her current Connection level, her next Connection event appears (a heart on the
// map); clearing it raises her Connection level. The chain ends in an Ending and then a
// Hidden ending. Some Connection events first need a Lost Item found in the event field.
// Special (Global) events tell the shared story and unlock locations and album pictures.
// After day 21 the last day repeats forever ("Unlimited Mode"); later Heart Clocks become
// unlimited too.

const TIMES = [['DayTime', 'daytime', 'Daytime'], ['Evening', 'evening', 'Evening'], ['Night', 'night', 'Night']];
const TIME_NAME = Object.fromEntries(TIMES.map(([k, , n]) => [k, n]));
const RESULT = {
  Unlockheroine: { tag: 'Starts her story', tone: 'good' },
  Relationlvup: { tag: 'Connection Lv up', tone: 'good' },
  Ending: { tag: 'Ending', tone: 'accent' },
  Hiddenending: { tag: 'Hidden ending', tone: 'accent' },
};
const GRADE = { Low: 'small', Medium: 'medium', High: 'big' };

function build(ctx) {
  const m = ctx.table('EventDatingSimManagerTable')[0];
  const mine = (t) => ctx.table(`EventDatingSim${t}`).filter((x) => x.manager_id === m.id);

  const heroines = mine('HeroineTable').sort((a, b) => a.order - b.order);
  const groups = mine('HeroineGroupTable');
  const locations = mine('LocationTable').sort((a, b) => a.index - b.index);
  const levels = mine('HeroineLVTable').sort((a, b) => a.relation_level - b.relation_level);
  const dialogs = new Map(mine('DialogEventTable').map((d) => [d.id, d]));
  const relations = mine('RelationConditionTable');
  const talks = mine('HeroineConditionTable');
  const selections = mine('SelectionEventTable');
  const lostItems = new Map(mine('LostItemTable').map((l) => [l.id, l]));
  const heroineSchedule = mine('HeroineScheduleTable');
  const dialogSchedule = mine('DialogScheduleTable');
  const photos = mine('PhotoAlbumTable').sort((a, b) => a.order - b.order);
  const heroineAlbum = mine('HeroineAlbumTable').sort((a, b) => a.order - b.order);
  const dialogConds = new Map(mine('DialogConditionTable').map((d) => [d.id, d]));
  const charge = ctx.table('AutoChargeTable').find((a) => a.id === m.stamina_auto_charge_id);
  const clock = charge ? ctx.rewardName(charge.item_type, charge.item_id) : 'Heart Clock';

  const who = new Map([
    ...heroines.map((h) => [h.id, ctx.plain(h.heroine_name, h.id)]),
    ...groups.map((g) => [g.id, ctx.plain(g.heroine_group_name, g.id).replace('&', ' & ')]),
  ]);
  const name = (id) => who.get(id) || id;
  const place = new Map(locations.map((l) => [l.id, ctx.plain(l.location_name, l.id)]));
  const where = (id) => place.get(id) || id;
  const sub = (key) => ctx.plain(`Locale_SubScenario:${key}`);
  const title = (id) => ctx.plain(dialogs.get(id)?.scenario_title_localkey) || '';
  // A link to the scene, labelled with its title (or, for untitled ones, the opening line).
  const sceneCell = (id, label) => {
    const s = ctx.scene(id);
    const text = label || title(id) || sub(`${id}_1`) || id;
    return s ? { scene: id, label: text } : text;
  };
  const dayLabel = (d) => (d === 0 ? 'Unlimited' : `Day ${d}`);

  // Bond-giving choices of one scene: "choice text (+50)". The choice that spends a Heart
  // Clock ("Talk to …") is listed separately.
  const choicesOf = (dialogId, showWho) => selections.filter((s) => s.dialog_event_id === dialogId && s.selection_event_type === 'Relationpointup')
    .map((s) => {
      const gains = s.selection_event_value_list.filter((v) => v.event_target_heroine);
      const g = gains.map((v) => `${showWho || gains.length > 1 ? `${name(v.event_target_heroine)} ` : ''}+${v.event_value}`).join(', ');
      return { text: sub(s.selection_dialog_id) || s.selection_dialog_id, sub: `Bond ${g}` };
    });
  const costsClock = (dialogId) => selections.some((s) => s.dialog_event_id === dialogId && s.is_consume_stamina);

  // "Mica at Connection Lv 2 with 50 Bond", "after <special event>", "lost item".
  const relationNeeds = (r) => {
    const out = [];
    for (const c of r.relation_appear_heroine_condition_list.filter((c) => c.condition_target_heroine)) {
      out.push(`${name(c.condition_target_heroine)}: Connection Lv ${c.event_condition_relation_lv}${c.event_condition_relation_point ? ` and ${c.event_condition_relation_point} Bond` : ''}`);
    }
    for (const c of r.relation_appear_dialog_condition_list.filter((c) => c.event_condition_dialog_event)) {
      out.push({ text: 'After special event', sub: title(c.event_condition_dialog_event) || c.event_condition_dialog_event });
    }
    for (const c of r.relation_appear_selection_condition_list.filter((c) => c.event_condition_selection_event)) {
      out.push({ text: 'After choosing', sub: sub(c.event_condition_selection_event) || c.event_condition_selection_event });
    }
    if (r.is_use_lost_item) {
      const li = lostItems.get(r.lost_item_id);
      out.push({ img: ctx.img(li?.lost_item_resource), caption: `Find the ${ctx.plain(li?.lost_item_name, 'lost item')}`, size: 'small' });
    }
    return out.length ? out : 'Nothing (first meeting)';
  };

  // Which Nikke(s) a page covers: a solo heroine, or a group and its members.
  const heroinePage = (id, members) => {
    const ids = new Set([id, ...members]);
    const isGroup = members.length > 0;
    const rel = relations.filter((r) => ids.has(r.target_heroine_id))
      .sort((a, b) => (dialogs.get(a.dialog_event_id)?.order || 0) - (dialogs.get(b.dialog_event_id)?.order || 0));
    const tk = talks.filter((t) => ids.has(t.target_heroine_id))
      .sort((a, b) => (a.event_condition_day || 99) - (b.event_condition_day || 99) || TIMES.findIndex(([k]) => k === a.event_condition_time) - TIMES.findIndex(([k]) => k === b.event_condition_time));
    const hs = isGroup ? members.map((x) => heroines.find((h) => h.id === x)).filter(Boolean) : [heroines.find((h) => h.id === id)];
    const album = heroineAlbum.find((a) => a.target_heroine_id === id);
    const short = id.replace(/^snowfalloasis_/, '').replace('bunnysisters', 'noirblanc');
    const lvRow = (h) => [
      name(h.id),
      h.max_relation_lv,
      levels.filter((l) => l.relation_level <= h.max_relation_lv).map((l) => l.target_relation_point).join(' → '),
    ];
    const moods = (h) => [h.relation_subtitle_lv_0, ...h.relation_subtitle_lv_list.map((x) => x.relation_subtitle_lv), h.relation_subtitle_lv_max]
      .filter(Boolean).map((k) => ctx.plain(k)).filter(Boolean);

    return {
      id: `heroine-${short}`,
      title: name(id),
      group: 'Nikkes',
      count: rel.length,
      summary: isGroup ? `${hs.map((h) => name(h.id)).join(' and ')} share some Connection events; group events affect both.` : `${rel.length} Connection events and ${tk.length} Scenario Events.`,
      sections: [
        {
          type: 'facts',
          items: [
            ['Album reward', album ? [{ img: ctx.img(`icn_consume_randombox_snowfall_${short}`), size: 'small' }, { reward: ctx.reward(album.complete_reward) }] : null],
            ['Group', isGroup ? 'Choices in group scenes give Bond to both sisters' : null],
          ],
        },
        {
          type: 'table',
          title: 'Connection levels',
          note: 'Bond needed at each Connection level before the next Connection event appears.',
          columns: ['Nikke', { label: 'Max level', num: true }, 'Bond per level'],
          rows: hs.map(lvRow),
        },
        {
          type: 'table',
          title: 'Connection events',
          note: 'They appear (heart icon) once the requirements are met, at the given place and time from the given day on.',
          columns: ['Event', 'Needs', 'Where / when', 'Result'],
          rows: rel.map((r) => {
            const li = r.is_use_lost_item ? lostItems.get(r.lost_item_id) : null;
            return [
              // On the group page, events of one sister are tagged with her name.
              isGroup && r.target_heroine_id !== id ? [sceneCell(r.dialog_event_id), { tag: name(r.target_heroine_id) }] : sceneCell(r.dialog_event_id),
              relationNeeds(r),
              [`From day ${r.forced_appear_start_day}`, `${where(r.forced_appear_location)}, ${(TIME_NAME[r.forced_appear_time] || r.forced_appear_time).toLowerCase()}`,
                ...(li ? [{ text: 'Lost item story', sub: `${title(r.lost_item_occur_dialog_event_id) || r.lost_item_occur_dialog_event_id} → find it → ${title(r.lost_item_require_dialog_event_id) || 'hand it over'}` }] : [])],
              [RESULT[r.relation_result_event_type] || r.relation_result_event_type, ...(r.is_consume_stamina ? [{ text: `Costs a ${clock}` }] : [])],
            ];
          }),
        },
        {
          type: 'table',
          title: 'Scenario events',
          note: `Meet her at this place and time to start the scene; talking costs 1 ${clock}. Bond choices: +25 small, +50 medium, +100 big. Some days have different scenes depending on her Connection level. "Unlimited" scenes repeat after day ${m.total_day}.`,
          columns: ['Day', 'Where / when', ...(isGroup ? ['Who'] : []), { label: 'Lv', num: true }, 'Scene', 'Bond choices'],
          rows: tk.map((t) => [
            dayLabel(t.event_condition_day),
            `${where(t.event_condition_location)}, ${(TIME_NAME[t.event_condition_time] || t.event_condition_time).toLowerCase()}`,
            ...(isGroup ? [name(t.target_heroine_id)] : []),
            t.event_condition_relation_lv_min === t.event_condition_relation_lv_max ? `${t.event_condition_relation_lv_min}` : `${t.event_condition_relation_lv_min}–${t.event_condition_relation_lv_max}`,
            sceneCell(t.dialog_event_id, sub(`${t.dialog_event_id}_1`)),
            choicesOf(t.dialog_event_id, isGroup),
          ]),
        },
        ...hs.map((h) => ({
          type: 'list',
          title: `${name(h.id)}'s mood by level`,
          note: 'The diary line shown at each Connection level.',
          items: moods(h),
        })),
      ],
    };
  };

  // Day-by-day map: who (and which special event) is where, at each time.
  const globals = [...dialogs.values()].filter((d) => d.dialog_event_type === 'Global' || d.dialog_event_type === 'Epilogue').sort((a, b) => a.order - b.order);
  const globalIds = new Set(globals.map((g) => g.id));
  const days = [...new Set(heroineSchedule.map((s) => s.day))].sort((a, b) => (a || 99) - (b || 99));
  const scheduleSection = (day) => ({
    type: 'table',
    title: dayLabel(day),
    columns: ['Location', ...TIMES.map(([, , n]) => n)],
    rows: locations.map((l) => {
      const hs = heroineSchedule.find((s) => s.day === day && s.location === l.id);
      const ds = dialogSchedule.find((s) => s.day === day && s.location === l.id);
      return [where(l.id), ...TIMES.map(([, k]) => {
        const out = [];
        const h = hs?.[`heroine_appear_${k}`];
        if (h) out.push(name(h));
        const d = ds?.[`dialog_event_appear_${k}`];
        if (d && globalIds.has(d)) out.push({ tag: title(d) || d, tone: 'accent' });
        return out.length ? out : '';
      })];
    }),
  });
  // Where/when each special event is scheduled.
  const globalSlot = new Map();
  for (const s of dialogSchedule) {
    for (const [, k, n] of TIMES) {
      const d = s[`dialog_event_appear_${k}`];
      if (d && globalIds.has(d) && !globalSlot.has(d)) globalSlot.set(d, `Day ${s.day}, ${where(s.location)}, ${n.toLowerCase()}`);
    }
  }
  const unlocksLocation = new Map(locations.filter((l) => l.location_open_dialog_event).map((l) => [l.location_open_dialog_event, where(l.id)]));
  const photosBy = (id) => photos.filter((p) => p.unlock_condition_dialog_event === id);
  const globalNeeds = (id) => {
    const c = dialogConds.get(id);
    if (!c) return '';
    const sel = c.dialog_appear_selection_condition_list.map((x) => x.event_condition_selection_event).filter(Boolean);
    const dia = c.dialog_appear_dialog_condition_list.map((x) => x.event_condition_dialog_event).filter(Boolean);
    return [...sel.map((s) => `Chose “${sub(s) || s}”`), ...dia.map((d) => `After ${title(d) || d}`)];
  };
  // The choice in the date-invitation scene is only offered once that Nikke's hidden ending is seen.
  const dateChoices = selections.filter((s) => s.is_use_select_condition || s.select_dialog_condition_list.some((c) => c.select_condition_dialog_event));

  const tutorials = mine('TutorialTable').filter((t) => !t.archive_manager_id).sort((a, b) => a.id - b.id);
  const tutorialPages = mine('TutorialPageTable');

  const start = ctx.date(m.start_date_for_ui);
  const unlimited = ctx.date(m.infinity_mod_active_realtime);

  return {
    summary: `A ${m.total_day}-day dating sim at Snowfield Hot Spring: visit locations to meet Nikkes, pick choices to build Bond, and unlock Connection events up to each Nikke's ending and hidden ending.`,
    overview: [
      {
        type: 'facts',
        title: 'The game',
        items: [
          ['Prologue', ctx.scene(m.first_enter_scenario)],
          ['Length', `${m.total_day} in-game days, each with three time slots (daytime, evening, night)`],
          ['Map', `${locations.length} locations: ${locations.map((l) => where(l.id)).join(', ')}`],
          ['Moving on', `Talking to a Nikke costs a ${clock}; spending ${clock}s moves the clock forward`],
          [clock, charge ? `+${charge.auto_charge_plus} a day (the daily refresh), holding up to ${charge.auto_charge_max}` : null],
          ['Daily reward', [`Spend ${m.daily_reward_require_stamina} ${clock}s in a day:`, { reward: ctx.reward(m.daily_reward_id) }]],
          ['Unlimited Mode (time)', `After day ${m.total_day} the last day repeats; every Nikke is out and Bond is unlimited`],
          ['Unlimited Mode (Heart Clock)', unlimited ? `From ${unlimited}, ${clock}s are unlimited` : `Later, ${clock}s become unlimited`],
          ['Event start', start],
          ['Epilogue', ctx.scene(m.epilogue_dialog_event)],
        ],
      },
      {
        type: 'facts',
        title: 'Bond and Connection',
        items: [
          ['Bond', 'Earned from the choices in Scenario Events: +25 (small), +50 (medium) or +100 (big)'],
          ['Connection level', 'When Bond reaches the target for her current level, a Connection event appears; clearing it raises the level (and starts the count again)'],
          ['Endings', 'The last two Connection events of each Nikke are her Ending and Hidden ending'],
          ['Groups', 'Blanc and Noir sometimes appear together; group choices give Bond to both'],
          ['Lost Items', 'Some Connection events need an item found in the event field first'],
          ['Album', 'Finishing a Nikke\'s story pays an album reward; special scenes add pictures to the Photo album'],
        ],
      },
      {
        type: 'table',
        title: 'Bond needed per Connection level',
        columns: [{ label: 'Level', num: true }, { label: 'Bond', num: true }],
        rows: levels.filter((l) => l.relation_level <= Math.max(...heroines.map((h) => h.max_relation_lv))).map((l) => [l.relation_level, l.target_relation_point]),
      },
      {
        type: 'table',
        title: 'Nikkes',
        columns: ['Nikke', 'First meeting', { label: 'Max level', num: true }],
        rows: [
          ...heroines.filter((h) => !h.is_contain_in_group),
          ...groups,
        ].map((h) => {
          const firsts = relations.filter((r) => r.relation_result_event_type === 'Unlockheroine' && (r.target_heroine_id === h.id || (h.heroine_id_list || []).some((x) => x.heroine_id === r.target_heroine_id)));
          const short = h.id.replace(/^snowfalloasis_/, '').replace('bunnysisters', 'noirblanc');
          return [
            { page: `heroine-${short}`, label: name(h.id) },
            firsts.map((r) => `${firsts.length > 1 ? `${name(r.target_heroine_id)}: ` : ''}day ${r.forced_appear_start_day}, ${where(r.forced_appear_location)} (${(TIME_NAME[r.forced_appear_time] || '').toLowerCase()})`),
            h.max_relation_lv || Math.max(...(h.heroine_id_list || []).map((x) => heroines.find((y) => y.id === x.heroine_id)?.max_relation_lv || 0)),
          ];
        }),
      },
    ],
    pages: [
      {
        id: 'tutorial',
        title: 'Tutorial',
        count: tutorials.length,
        sections: tutorials.map((t) => ({
          type: 'facts',
          title: ctx.plain(t.tutorial_title_localkey),
          items: tutorialPages.filter((p) => p.group_id === t.tutorial_page_group_id).sort((a, b) => a.page_order - b.page_order).flatMap((p) => [
            [ctx.plain(p.page_title_localkey), { img: ctx.img(p.image_resource), size: 'large' }],
            ['', ctx.plain(p.tutorial_localkey).replace(/\n(?!■)/g, ' ')],
          ]),
        })),
      },
      ...heroines.filter((h) => !h.is_contain_in_group).map((h) => heroinePage(h.id, [])),
      ...groups.map((g) => heroinePage(g.id, g.heroine_id_list.map((x) => x.heroine_id).filter(Boolean))),
      {
        id: 'special',
        title: 'Special events',
        group: 'Story',
        count: globals.length,
        summary: 'The shared story. Each plays at a fixed place and time and blocks other events there.',
        sections: [
          {
            type: 'table',
            columns: [{ label: '#', num: true }, 'Event', 'When / where', 'Needs', 'Unlocks'],
            rows: globals.map((g) => [
              g.order,
              sceneCell(g.id),
              globalSlot.get(g.id) || (g.dialog_event_type === 'Epilogue' ? 'After the last day' : ''),
              globalNeeds(g.id),
              [
                ...(unlocksLocation.has(g.id) ? [{ tag: `Opens ${unlocksLocation.get(g.id)}`, tone: 'good' }] : []),
                ...photosBy(g.id).map((p) => ctx.plain(p.cutscene_title_localkey)),
              ],
            ]),
          },
          dateChoices.length ? {
            type: 'table',
            title: 'The date invitation',
            note: 'In this scene you pick whom to invite; a Nikke can only be picked once you have seen her Hidden ending. The pick decides which date scene follows.',
            columns: ['Choice', 'Available after'],
            rows: dateChoices.map((s) => [
              sub(s.selection_dialog_id) || s.selection_dialog_id,
              s.select_dialog_condition_list.map((c) => c.select_condition_dialog_event).filter(Boolean).map((d) => title(d) || d).join(', ') || 'Always',
            ]),
          } : null,
        ].filter(Boolean),
      },
      {
        id: 'schedule',
        title: 'Day-by-day map',
        group: 'Story',
        count: days.length,
        summary: 'Where each Nikke is at each time, and when special events play. Other characters chat in the empty slots.',
        sections: days.map(scheduleSection),
      },
      {
        id: 'lost-items',
        title: 'Lost items',
        group: 'Story',
        count: lostItems.size,
        sections: [{
          type: 'table',
          note: 'A scene makes the item appear in the event field; find it (the hint says where), then hand it over to unlock the Connection event.',
          columns: ['Item', 'Hint', 'For', 'Description'],
          rows: [...lostItems.values()].map((li) => {
            const r = relations.find((x) => x.is_use_lost_item && x.lost_item_id === li.id);
            return [
              { img: ctx.img(li.lost_item_resource), caption: ctx.plain(li.lost_item_name) },
              ctx.plain(li.lost_item_hint),
              r ? { text: name(r.target_heroine_id), sub: title(r.dialog_event_id) } : '',
              ctx.plain(li.lost_item_description),
            ];
          }),
        }],
      },
      {
        id: 'album',
        title: 'Album',
        group: 'Story',
        count: photos.length,
        sections: [
          {
            type: 'gallery',
            title: 'Photo album',
            items: photos.map((p) => ({
              img: ctx.img(`${p.cutscene_resource}_thumb`) || ctx.img(p.cutscene_resource),
              caption: `${ctx.plain(p.cutscene_title_localkey)} (after ${title(p.unlock_condition_dialog_event) || p.unlock_condition_dialog_event})`,
            })),
          },
          {
            type: 'table',
            title: 'Story completion rewards',
            columns: ['Nikke', 'Reward'],
            rows: heroineAlbum.map((a) => [name(a.target_heroine_id), { reward: ctx.reward(a.complete_reward) }]),
          },
          {
            type: 'facts',
            title: 'Special picture',
            note: 'A shared picture shows each Nikke in three stages: the second after her first Connection event, the third after her Hidden ending.',
            items: [['Completing it', { reward: ctx.reward(m.special_cutscene_complete_reward_wallpaper_id) }]],
          },
        ],
      },
    ],
  };
}

module.exports = { build };
