// MEMORY OF GODDESS (EventNKS*), the Red Ash mini game: a survivor-style shooter. You drag
// one Goddess Squad member around a map while Raptures swarm in from every side; weapons fire
// on their own. Battle Data levels you up mid-run (pick a new weapon / module or level one
// up), mid-bosses drop "Manufacturer Arms" boxes, and a stage is cleared by surviving to the
// end of its timeline and killing the boss. Coins carry over between runs and buy skill-tree
// upgrades and character unlocks.
//
// The tables hold two versions, told apart by CommonSettings (commonsettingsid):
//   1 = M.O.G. (the original event), 2 = the same game in the Archives,
//   3 = M.O.G. EX Edition (the Arcade version: Exia, the Mine theme, combined EX weapons,
//       a coin upgrade store, revives and rerolls), 9000x = "special mode" boss fights
//       whose loadouts have April-Fools style names (…_AF locale keys).
// Times in the stage timelines, bursts and spawns are in 1/100 s (Snowy Land - I ends at
// 60000 = 10 min, matching its "survive for 10 minutes" description).

const sec = (cs) => `${+(cs / 100).toFixed(2)} s`;
const clock = (cs) => {
  const s = Math.round(cs / 100);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
const num = (v) => Number(v).toLocaleString('en-US');
const VERSIONS = { 1: 'M.O.G.', 2: 'M.O.G. (Archives)', 3: 'M.O.G. EX' };
const MOG1_CHARS = [1, 2, 3, 4, 5, 6, 101, 102, 103, 104, 105, 106];

// Spawn group rows are lists of strings whose layout depends on the spawn shape. Returns
// { kind: 'Monster' | 'Item', id, count } (or null for unknown layouts).
function spawnEntry(row) {
  const v = row.timeline_actiontype_value.map((x) => x.timeline_actiontype_value);
  if (row.timeline_actiontype === 'Spawn_Circle_Equal') return { kind: 'Monster', id: +v[1], count: +v[2] };
  const i = v.findIndex((x) => x === 'Monster' || x === 'Item');
  if (i < 0) return null;
  // Circle / ellipse: [.., kind, id, count]; line and fixed-position spawns: [.., kind, ?, id, count].
  const off = /^Spawn_(Hor|Ver)/.test(row.timeline_actiontype) ? 2 : 1;
  return { kind: v[i], id: +v[i + off], count: +v[i + off + 1] };
}

function build(ctx) {
  const T = (n) => ctx.table(`EventNKS${n}Table`);
  const settings = new Map(T('CommonSettings').map((s) => [s.id, s]));
  const items = T('Items');
  const itemById = new Map(items.map((i) => [i.id, i]));
  const chars = T('Character');
  const charById = new Map(chars.map((c) => [c.id, c]));
  const stages = T('Stage');
  const stageById = new Map(stages.map((s) => [s.id, s]));
  const monsters = new Map(T('Monster').map((m) => [m.id, m]));
  const missions = T('Mission');
  const missionById = new Map(missions.map((m) => [m.id, m]));
  const timeline = T('SpawnTimeLine');
  const spawnGroups = new Map();
  for (const g of T('SpawnGroup')) {
    if (!spawnGroups.has(g.group_id)) spawnGroups.set(g.group_id, []);
    spawnGroups.get(g.group_id).push(g);
  }
  const collection = new Map(T('Collection').map((c) => [c.itemid, c]));

  // ---- text helpers ----
  const oneLine = (s) => s.replace(/\s*\n\s*/g, ' ').trim();
  const itemName = (it) => (it ? oneLine(ctx.plain(it.itemnamelocale, '')) : '');
  const baseName = (it) => itemName(it).replace(/\s*Lv\. ?\d+$/, '');
  // Descriptions use {DescriptionValue_n} placeholders filled from the item's descriptionvalue list.
  const fill = (key, values) => ctx.plain(key, '').replace(/\{DescriptionValue_(\d)\}/g, (_, n) => values[n - 1] ?? '?');
  const itemDesc = (it) => (it ? fill(it.itemdesclocale, it.descriptionvalue.map((d) => d.descriptionvalue)) : '');
  const itemImg = (it, size = 'small') => ({ img: ctx.img(it.iconresource_id), caption: baseName(it) || itemName(it), size });
  const charName = (c) => (c ? ctx.plain(c.name_localkey, c.resource_id) : '');
  const stageName = (s) => (s ? ctx.plain(s.stagename_locale, `Stage ${s.id}`) : '');
  const themeName = (s) => ctx.plain(s.ui_theme_localkey, s.ui_theme);
  const relic = (id) => {
    const it = itemById.get(id);
    return it ? { img: ctx.img(it.iconresource_id), caption: itemName(it), size: 'small' } : null;
  };

  // Usable groups of levelled items (weapons, modules): Lv. 1 row first. Ids 1000000-2199999
  // are the special-mode loadouts and the coin rewards, not pickable items.
  const groupsOf = (category) => {
    const map = new Map();
    for (const it of items.filter((i) => i.itemcategory === category && (i.id < 1000000 || i.id >= 2200000))) {
      if (!itemName(it)) continue; // test rows without text
      if (!map.has(it.group_id)) map.set(it.group_id, []);
      map.get(it.group_id).push(it);
    }
    // Only groups that can turn up in a run: offered on level up, or made by combining.
    return [...map.values()].map((l) => l.sort((a, b) => a.lv - b.lv)).filter((l) => l[0].lv === 1 && (l[0].leveluponly || l[0].iscombine));
  };

  // Who may pick an item up. disable lists that cover every original character mean "EX only".
  const exOnly = (it) => MOG1_CHARS.every((id) => it.disable_character_id.includes(id));
  const namesOf = (ids) => [...new Set(ids.map((id) => charName(charById.get(id))).filter(Boolean))].join(', ');
  const whoCell = (it) => {
    if (it.lock_character_id.length) return { tag: `${namesOf(it.lock_character_id)} only`, tone: 'accent' };
    const other = it.disable_character_id.filter((id) => !MOG1_CHARS.includes(id) && charById.has(id));
    const banned = exOnly(it) ? other : it.disable_character_id;
    return banned.length ? `Everyone but ${namesOf(banned)}` : 'Everyone';
  };
  const hint = (it) => {
    const c = collection.get(it.id);
    return c ? ctx.plain(c.collection_hintlocale, '') : '';
  };

  // Ending stories, needed by the character, relic and stage pages.
  const endingGroups = makeEndings();

  // ---- characters ----
  // One entry per playable girl (the same character appears once per version).
  const people = [];
  for (const c of chars.filter((x) => settings.get(x.commonsettingsid) && !settings.get(x.commonsettingsid).isspecialmode)) {
    let p = people.find((x) => x.key === c.ui_resource_id);
    if (!p) people.push(p = { key: c.ui_resource_id, name: charName(c), rows: [] });
    p.rows.push(c);
  }
  const charPage = (p) => `char-${p.rows[0].id}`;
  const charLink = (id) => {
    const p = people.find((x) => x.rows.some((r) => r.id === id));
    return p ? { page: charPage(p), label: p.name } : charName(charById.get(id));
  };

  const bursts = new Map(T('CharacterBurst').map((b) => [b.character_id, b]));
  const tree = T('CharacterSkillTree');
  const balloons = T('Balloon');

  // Which stages' timelines use a group of balloon lines or dialog.
  const stagesUsing = (action, value) => {
    const tls = new Set(timeline.filter((t) => t.timeline_actiontype === action
      && t.timeline_actiontype_value[0].timeline_actiontype_value === value).map((t) => t.group_id));
    return stages.filter((s) => tls.has(s.stagetimeline_group_id) && s.commonsettingsid !== 2);
  };

  const unlockText = (c) => {
    const parts = [];
    if (c.reqstgclear) parts.push(`Clear ${stageName(stageById.get(c.reqstgclear))}`);
    if (c.reqitem_id) parts.push(`Find the ${itemName(itemById.get(c.reqitem_id))}`);
    if (c.reqitem_currency) parts.push(`Pay ${num(c.reqitem_currency)} Coins`);
    return parts.length ? parts.join('\n') : 'Available from the start';
  };

  const characterPages = people.map((p) => {
    const first = p.rows[0];
    // weapon_default names an item group; the run starts with its Lv. 1 item.
    const weapon = items.find((i) => i.group_id === first.weapon_default[0].weapon_default && i.lv === 1);
    const burst = bursts.get(first.id);
    const trees = p.rows.filter((r) => r.commonsettingsid !== 2).map((r) => {
      const rows = tree.filter((t) => t.group_id === r.characterskilltree_group_id)
        .sort((a, b) => a.treelevel - b.treelevel || a.line - b.line)
        .flatMap((t) => t.slotdata.filter((s) => s.slot_getitem).map((s) => {
          const it = itemById.get(s.slot_getitem);
          return [`Class ${t.treelevel}`, it ? itemName(it) : { key: String(s.slot_getitem) }, it ? oneLine(itemDesc(it)) : '', s.slot_reqitem_value || '—'];
        }));
      const total = tree.filter((t) => t.group_id === r.characterskilltree_group_id)
        .reduce((n, t) => n + t.slotdata.reduce((m, s) => m + (s.slot_getitem ? s.slot_reqitem_value : 0), 0), 0);
      return {
        type: 'table',
        title: `Skill tree (${VERSIONS[r.commonsettingsid]})`,
        note: total
          ? `Bought with Coins earned in runs; the whole tree costs ${num(total)} Coins. A reset refunds every Coin spent.`
          : 'The original version’s table lists no Coin cost for these upgrades.',
        columns: ['Class', 'Upgrade', 'Effect', { label: 'Coins', num: true }],
        rows,
      };
    });
    const lines = balloons.filter((b) => b.conditiondata.some((c) => c.usecondition_type === 'Check_CurCharacter'
      && p.rows.some((r) => c.usecondition_value.includes(r.id))) && !/Dummy/.test(b.group_id))
      .map((b) => {
        const got = b.conditiondata.find((c) => c.usecondition_type === 'Check_ItemGet');
        const used = [...new Set(stagesUsing('Balloon', b.group_id).map(stageName))];
        const where = got ? `On getting ${itemName(itemById.get(got.usecondition_value[0])) || 'an item'}`
          : used.length > 6 ? 'Most stages' : used.join(', ') || 'During a stage';
        return [ctx.plain(b.scenario_localkey, ''), where, `${b.execute_rate / 100}%`];
      }).filter((r) => r[0] && !r[0].startsWith('Locale_'));
    const endings = endingGroups.filter((g) => g.chars.some((id) => p.rows.some((r) => r.id === id)));
    return {
      id: charPage(p),
      title: p.name,
      group: 'Characters',
      summary: p.rows.some((r) => r.commonsettingsid === 1) ? (p.rows.some((r) => r.commonsettingsid === 3) ? 'Playable in M.O.G. and M.O.G. EX.' : 'Playable in M.O.G.') : 'Playable in M.O.G. EX only.',
      sections: [
        {
          type: 'facts',
          items: [
            ['', { img: ctx.img(first.ui_resource_id), size: 'large' }],
            ['Starting weapon', weapon ? [itemImg(weapon), { page: 'weapons', label: 'See weapons' }] : null],
            ['Burst', burst ? `Lasts ${sec(burst.burst_activetime)}; ready again after ${sec(burst.cooldown_time)} (each kill takes ${sec(burst.kill_cooldown_subtime)} off the wait). Double-tap the character or tap the Burst button.` : null],
            ['Endings', endings.length ? endings.map((g) => ({ page: g.page, label: g.title })) : null],
          ],
        },
        {
          type: 'table',
          title: 'Base stats and unlock',
          note: 'Attack speed, projectile size and projectile speed start at 100% for everyone. Move speed and item radius are in map units.',
          columns: ['Version', { label: 'HP', num: true }, { label: 'ATK', num: true }, { label: 'DEF', num: true }, { label: 'Move speed', num: true }, { label: 'Item radius', num: true }, 'Unlock'],
          rows: p.rows.filter((r) => r.commonsettingsid !== 2).map((r) => [VERSIONS[r.commonsettingsid], r.stat_hp, r.stat_atk, r.stat_def, r.stat_mvspd, r.stat_magnet, unlockText(r)]),
        },
        ...trees,
        lines.length && { type: 'table', title: 'Battle lines', note: 'Speech bubbles she says during a run. Chance is how often the line plays when its trigger happens.', columns: ['Line', 'When', { label: 'Chance', num: true }], rows: lines },
      ].filter(Boolean),
    };
  });

  // ---- weapons and modules ----
  const levelValues = (list) => list.map((it) => `Lv. ${it.lv}: ${it.descriptionvalue.map((d) => d.descriptionvalue).filter((x) => x !== '').join(' / ')}`);
  const weapons = groupsOf('Active');
  const normalWeapons = weapons.filter((l) => !l[0].iscombine);
  const combined = weapons.filter((l) => l[0].iscombine);
  const weaponRow = (l) => [
    itemImg(l[0]),
    oneLine(itemDesc(l[0])),
    l.length > 1 ? levelValues(l) : '',
    whoCell(l[0]),
    exOnly(l[0]) ? { tag: 'EX', tone: 'accent' } : 'Both',
    l[0].itemratio,
  ];
  const modules = groupsOf('Passive');

  // ---- field pickups, boxes and relics ----
  // Pickups that can actually drop: those in a monster drop list or a box's bonus slots
  // (the other Field rows are Coin bundles handed out as mission rewards).
  const boxes = T('GachaBox');
  const droppable = new Set([...T('DropList').map((d) => d.item_id), ...boxes.flatMap((b) => b.bonusslotdata.map((x) => x.bonusslot))]);
  const fieldSeen = new Set();
  const pickups = items.filter((i) => i.itemcategory === 'Field' && itemName(i) && droppable.has(i.id)).filter((i) => {
    const k = `${itemName(i)}|${i.itemvalue}`;
    if (fieldSeen.has(k)) return false;
    fieldSeen.add(k);
    return true;
  });
  const gachaList = T('GachaList');
  const boxTotal = boxes.reduce((n, b) => n + b.rate, 0);
  const boxPool = (group) => {
    const sums = new Map();
    for (const g of gachaList.filter((x) => x.group_id === group)) sums.set(g.item_id, (sums.get(g.item_id) || 0) + g.rate);
    const total = [...sums.values()].reduce((a, b) => a + b, 0);
    return [...sums].map(([id, rate]) => [itemImg(itemById.get(id)), `${+(100 * rate / total).toFixed(2)}%`]);
  };
  const relics = items.filter((i) => /^Field_(Special|Important)$/.test(i.itemcategory));
  // Where each relic is placed: an ItemSpawn at the start of a stage timeline.
  const relicStages = new Map();
  for (const t of timeline.filter((x) => x.timeline_actiontype === 'ItemSpawn')) {
    for (const row of spawnGroups.get(t.timeline_spawn_group) || []) {
      const e = spawnEntry(row);
      if (!e || e.kind !== 'Item') continue;
      for (const s of stages.filter((x) => x.stagetimeline_group_id === t.group_id && x.commonsettingsid !== 2)) {
        if (!relicStages.has(e.id)) relicStages.set(e.id, []);
        relicStages.get(e.id).push(s);
      }
    }
  }
  const stageLinks = (list) => list.map((s) => ({ page: stagePageId(s), label: `${stageName(s)} (${VERSIONS[s.commonsettingsid]})` }));

  // ---- stages ----
  const monsterLabel = (m) => {
    if (!m) return '?';
    const theme = /^boss_(\w+)$/.exec(m.resource_id);
    if (theme) return `${{ iceland: 'Snowy Land', armybase: 'Military Base', desert: 'Desert', grassland: 'Plain', simulationroom: 'Simulation Room', hidden: 'Hidden' }[theme[1]] || theme[1]} boss`;
    if (/boss_cave/.test(m.resource_id)) return 'Mine boss (crystal)';
    return m.resource_id.replace(/^NKS_monster_/, '');
  };
  const groupMonsters = (gid) => (spawnGroups.get(gid) || []).map(spawnEntry).filter((e) => e && e.kind === 'Monster');
  const monsterStats = (m) => `HP ${num(m.stat_hp)}, ATK ${m.stat_atk}, DEF ${m.stat_def}`;

  // Summarises a timeline: waves (when each spawn loop runs), mid-bosses, the boss, relics.
  function summarise(tlId) {
    const rows = timeline.filter((t) => t.group_id === tlId).sort((a, b) => a.timeline_value - b.timeline_value || a.id - b.id);
    const end = Math.max(0, ...rows.map((t) => t.timeline_value));
    const waves = [];
    for (const r of rows.filter((t) => t.timeline_actiontype === 'MonsterGroupSpawn')) {
      const stop = rows.find((t) => t.timeline_actiontype === 'StopMonsterGroupSpawn' && t.timeline_spawn_group === r.timeline_spawn_group && t.timeline_value > r.timeline_value);
      const list = groupMonsters(r.timeline_spawn_group);
      const ms = list.map((e) => monsters.get(e.id)).filter(Boolean);
      const hp = [...new Set(ms.map((m) => m.stat_hp))];
      waves.push([
        clock(r.timeline_value),
        r.timeline_isloop ? (stop ? clock(stop.timeline_value) : 'end') : '—',
        r.timeline_isloop ? (r.timeline_loop_count > 0 ? `every ${sec(r.timeline_loop_interval)}, ${r.timeline_loop_count}×` : `every ${sec(r.timeline_loop_interval)}`) : 'once',
        list.map((e) => `${e.count} × ${monsterLabel(monsters.get(e.id))}`),
        list.reduce((n, e) => n + e.count, 0),
        hp.length ? hp.map(num).join(' / ') : '',
      ]);
    }
    const bosses = rows.filter((t) => /MonsterSpawn/.test(t.timeline_actiontype) && t.timeline_actiontype !== 'MonsterGroupSpawn').map((t) => {
      const e = groupMonsters(t.timeline_spawn_group)[0];
      const m = e && monsters.get(e.id);
      const drops = m ? m.drop_item.filter((d) => d.drop_item_id && d.drop_item_amount).map((d) => {
        const it = itemById.get(d.drop_item_id);
        return it?.fielditem_type === 'GachaBox' ? `${d.drop_item_amount} × Manufacturer Arms box` : it ? `${d.drop_item_amount} × ${itemName(it)}` : null;
      }).filter(Boolean) : [];
      const boss = /^Boss|TargetBoss/.test(t.timeline_actiontype);
      return [clock(t.timeline_value), boss ? { tag: 'Boss', tone: 'bad' } : { tag: 'Mid-boss', tone: 'accent' }, m ? monsterLabel(m) : '?', m ? monsterStats(m) : '', drops];
    });
    const dialogs = rows.filter((t) => t.timeline_actiontype === 'Dialog').map((t) => t.timeline_actiontype_value[0].timeline_actiontype_value);
    const relicIds = rows.filter((t) => t.timeline_actiontype === 'ItemSpawn')
      .flatMap((t) => (spawnGroups.get(t.timeline_spawn_group) || []).map(spawnEntry)).filter((e) => e && e.kind === 'Item').map((e) => e.id);
    const kinds = new Set();
    for (const w of rows.filter((t) => t.timeline_actiontype === 'MonsterGroupSpawn')) for (const e of groupMonsters(w.timeline_spawn_group)) kinds.add(e.id);
    return { end, waves, bosses, dialogs, relicIds, kinds: kinds.size };
  }

  const stagePageId = (s) => `stages-${s.commonsettingsid === 3 ? 'ex' : 'mog'}-${s.stagegroup}`;
  const playStages = stages.filter((s) => s.commonsettingsid === 1 || s.commonsettingsid === 3);
  const archiveOf = (s) => stages.find((x) => x.commonsettingsid === 2 && x.stagetimeline_group_id === s.stagetimeline_group_id);
  const missionReward = (m) => {
    if (!m) return '';
    if (m.reward_type === 'Item') return { reward: ctx.reward(m.reward_value) };
    if (m.reward_type === 'NKSitem') {
      const it = itemById.get(m.reward_value);
      return it ? `${num(it.itemvalue)} Coins (mini game)` : { key: String(m.reward_value) };
    }
    if (m.reward_type === 'DailyPoint') return `${m.reward_value} daily points`;
    return `${m.reward_type} ${m.reward_value}`;
  };

  const stagePages = [];
  for (const ver of [1, 3]) {
    const list = playStages.filter((s) => s.commonsettingsid === ver);
    for (const grp of [...new Set(list.map((s) => s.stagegroup))]) {
      const inGroup = list.filter((s) => s.stagegroup === grp);
      const sections = [];
      for (const s of inGroup) {
        const sum = summarise(s.stagetimeline_group_id);
        const open = stageById.get(s.stageopencondition);
        const arch = ver === 1 && archiveOf(s);
        const w = s.mapwidth;
        const h = s.mapheight;
        sections.push({
          type: 'facts',
          title: stageName(s),
          note: oneLine(ctx.plain(s.stagedesc_locale, '')),
          items: [
            ['', { img: ctx.img(s.ui_theme), caption: themeName(s), size: 'large' }],
            ['Length', `${clock(sum.end)} (the clock stops while a mid-boss is alive)`],
            ['Difficulty', `${s.ui_difficult} (stage select rating)`],
            ['Opens', open ? `After clearing ${stageName(open)}` : 'From the start'],
            ['Map', w || h ? `${w ? `${num(w)} wide` : 'no side walls'}, ${h ? `${num(h)} tall` : 'no top/bottom walls'}` : 'Open field'],
            ['Rapture variants', sum.kinds ? `${sum.kinds} (different models or stats)` : null],
            ['Relic on the map', sum.relicIds.length ? sum.relicIds.map(relic) : null],
            ['Ending story', sum.dialogs.length ? sum.dialogs.map((d) => endingGroups.find((g) => g.id === d)).filter(Boolean).map((g) => ({ page: g.page, label: g.title })) : null],
            ['First clear reward', missionReward(missionById.get(s.clear_reward))],
            ['Archives clear reward', arch ? missionReward(missionById.get(arch.clear_reward)) : null],
            ['Repeatable', s.canrepeat ? 'Yes' : 'No'],
            ['Ranked', s.ischallenge ? 'Raptures killed here count for the Union Ranking' : null],
          ],
        });
        if (sum.bosses.length) {
          sections.push({ type: 'table', title: `${stageName(s)}: bosses`, columns: ['Time', 'Type', 'Rapture', 'Stats', 'Drops'], rows: sum.bosses });
        }
        sections.push({
          type: 'table',
          title: `${stageName(s)}: waves`,
          note: 'Each row is a spawn loop: from its start until it is switched off, the listed Raptures appear around you at the given interval. Raptures are named by their model code.',
          columns: ['From', 'Until', 'Spawns', 'Raptures', { label: 'Per spawn', num: true }, 'HP'],
          rows: sum.waves,
        });
      }
      const first = inGroup[0];
      stagePages.push({
        id: stagePageId(first),
        title: first.ischallenge || first.stagegroup >= (ver === 3 ? 7 : 6) ? ctx.plain('Locale_Event:Event_NKSminigame_StageTheme_Name_challengeStage', 'Challenge Stage') : themeName(first),
        group: ver === 3 ? 'Stages (M.O.G. EX)' : 'Stages (M.O.G.)',
        count: inGroup.length,
        summary: inGroup.map(stageName).join(', '),
        sections,
      });
    }
  }

  // ---- story (ending dialogs) ----
  // Dialog groups play as in-stage cutscenes at the end of a stage, if their conditions
  // (playing a given character, carrying a given relic) are met. "test_" groups are copies.
  function makeEndings() {
    const dialog = T('Dialog').filter((d) => !/^test_|^NKSmini_Dialog_Group/.test(d.group_id));
    const ids = [...new Set(dialog.map((d) => d.group_id))];
    return ids.map((id) => {
      const lines = dialog.filter((d) => d.group_id === id).sort((a, b) => a.id - b.id);
      const cond = lines.flatMap((d) => d.conditiondata).filter((c) => c.usecondition_type !== 'None');
      const chars2 = [...new Set(cond.filter((c) => c.usecondition_type === 'Check_CurCharacter').flatMap((c) => c.usecondition_value))];
      const hold = [...new Set(cond.filter((c) => c.usecondition_type === 'Check_ItemHold').flatMap((c) => c.usecondition_value))].filter((x) => itemById.has(x));
      const title = oneLine(ctx.plain(lines[0].scenario_localkey, '')) || id;
      return { id, page: `story-${id.replace(/^1ann_mini_ending_/, '')}`, title, lines, chars: chars2, hold };
    });
  }
  const storyPages = endingGroups.map((g) => {
    const where = stagesUsing('Dialog', g.id);
    const rows = [];
    for (const d of g.lines) {
      if (d.set_background && ctx.img(d.set_background)) rows.push(['', { img: ctx.img(d.set_background), size: 'large' }]);
      const text = ctx.plain(d.scenario_localkey, '');
      if (!text || text.startsWith('Locale_')) continue;
      const who = d.name_localkey ? ctx.plain(d.name_localkey, '') : '';
      const face = ctx.img(d.portrait_id);
      rows.push([who ? (face ? { img: face, caption: who, size: 'small' } : who) : '', who ? text : { b: text }]);
    }
    return {
      id: g.page,
      title: g.title,
      group: 'Story',
      count: g.lines.length,
      sections: [
        {
          type: 'facts',
          items: [
            ['Plays in', where.length ? stageLinks(where) : null],
            ['Play as', g.chars.length ? [...new Set(g.chars.map((id) => JSON.stringify(charLink(id))))].map((x) => JSON.parse(x)) : null],
            ['Carrying', g.hold.length ? g.hold.map(relic) : null],
          ],
        },
        { type: 'table', columns: ['Speaker', 'Line'], rows },
      ],
    };
  });

  // ---- missions ----
  const missionPage = (ver) => {
    const list = missions.filter((m) => m.commonsettingsid === ver);
    const row = (m) => {
      const conds = m.missionvalue.filter((c) => c.conditiontype !== 'None').map((c) => {
        if (c.conditiontype === 'Character') return `as ${charName(charById.get(c.conditionid))}`;
        if (c.conditiontype === 'HoldItem') return `holding ${itemName(itemById.get(c.conditionid))}`;
        if (c.conditiontype === 'StageId') return `in ${stageName(stageById.get(c.conditionid))}`;
        return `${c.conditiontype} ${c.conditionid}`;
      });
      return [ctx.plain(m.name_localkey, `Mission ${m.id}`), conds.join(', '), missionReward(m)];
    };
    const cats = [['DailyPoint', 'Daily point rewards', 'Daily missions give points; reaching each total gives a reward. Resets daily.'],
      ['DailyMission', 'Daily missions', null], ['ChallengeMission', 'Challenge missions', 'One-time missions.']];
    return {
      id: `missions-${ver}`,
      title: { 1: 'Missions (M.O.G.)', 2: 'Missions (Archives)', 3: 'Missions (EX)' }[ver],
      group: 'Missions',
      count: list.length,
      sections: cats.map(([cat, title, note]) => {
        const l = list.filter((m) => m.missioncategory === cat);
        return l.length && { type: 'table', title, note, columns: ['Mission', 'Condition', 'Reward'], rows: l.map(row) };
      }).filter(Boolean),
    };
  };

  // ---- EX coin store ----
  const ex = settings.get(3);
  const skillStore = T('CoinSkillStore');
  const storeGroups = [...new Set(skillStore.map((s) => `${s.group_id}-${s.second_group_id}`))];
  const storeWeightTotal = skillStore.filter((s) => s.grade === 1).reduce((n, s) => n + s.group_rate, 0);
  const statValue = (s) => {
    const v = +ctx.double(s.stat_value_1).toFixed(3);
    return s.stat_calctype_1 === 'Multi' ? `+${+((v - 1) * 100).toFixed(1)}%` : `+${v}`;
  };
  const coinStore = T('CoinStore');
  const slotCosts = T('CoinSkillSlot');

  // ---- special mode (9000x) ----
  const special = [...settings.values()].filter((s) => s.isspecialmode);
  const specialRows = special.map((s) => {
    const c = chars.find((x) => x.commonsettingsid === s.id);
    const st = stages.find((x) => x.commonsettingsid === s.id);
    const tl = st ? timeline.filter((t) => t.group_id === st.stagetimeline_group_id) : [];
    const end = Math.max(0, ...tl.map((t) => t.timeline_value));
    const boss = monsters.get(s.checkboss);
    const kit = (arr, key) => arr.map((w) => itemById.get(w[key])).filter(Boolean).map((it) => ({ img: ctx.img(it.iconresource_id), caption: itemName(it), size: 'small' }));
    return [s.id, c ? charName(c) : '', c ? kit(c.weapon_default, 'weapon_default') : '', c ? kit(c.module_default, 'module_default') : '', boss ? `${monsterLabel(boss)} (HP ${num(boss.stat_hp)})` : '', end ? clock(end) : ''];
  });

  const levels = T('CharacterLevel');
  const guide = T('Guide');
  const guideSections = [];
  for (const view of [...new Set(guide.map((g) => g.tutorialviewid))]) {
    for (const grp of [...new Set(guide.filter((g) => g.tutorialviewid === view).map((g) => g.group_id))]) {
      const rows = guide.filter((g) => g.tutorialviewid === view && g.group_id === grp);
      const title = ctx.plain(rows[0].guide_title_localkey, '');
      if (guideSections.some((s) => s.title === title)) continue; // repeated pages (stage select, skill tree)
      const items2 = [];
      if (ctx.img(rows[0].guide_resource_id)) items2.push(['', { img: ctx.img(rows[0].guide_resource_id), size: 'large' }]);
      for (const r of rows.slice(0)) {
        if (r !== rows[0] && r.guide_title_localkey) items2.push(['', { b: ctx.plain(r.guide_title_localkey, '') }]);
        if (r.guide_subtitle_localkey) items2.push(['', { b: ctx.plain(r.guide_subtitle_localkey, '') }]);
        if (r.guide_description_localkey) items2.push(['', ctx.plain(r.guide_description_localkey, '')]);
      }
      guideSections.push({ type: 'facts', title, items: items2 });
    }
  }

  const intro = (id) => ctx.scene(id) || null;
  const exp = (lv) => levels.find((l) => l.lv === lv)?.exp;
  const lastLv = levels[levels.length - 1];

  return {
    summary: 'MEMORY OF GODDESS: a survivor-style shooter. Drag a Goddess Squad member around while Raptures swarm in, level up with Battle Data to collect weapons and modules, outlast the stage timer and kill the boss.',
    overview: [
      {
        type: 'facts',
        title: 'How a run works',
        items: [
          ['Goal', 'Survive until the stage timer runs out (5 to 30 minutes) and defeat the boss. The timer stops while a mid-boss is on the field.'],
          ['Controls', 'Tap and drag to move; your weapons fire on their own. Double-tap the character (or the Burst button) for her Burst.'],
          ['Losing', 'The run ends when HP hits 0 (EX Edition: revive with Coins if you have revivals left).'],
          ['Levelling up', `Battle Data dropped by Raptures is EXP. Each level offers a random choice of weapons and modules; picking one you own levels it up (Lv. 5 is max). Level 1 needs ${exp(1)} EXP, level 10 needs ${exp(10)}, and every level from ${lastLv.lv} on needs ${lastLv.exp}.`],
          ['Mid-bosses', 'Tougher Raptures appear at fixed times; they drop a Manufacturer Arms box with free weapon / module upgrades.'],
          ['After a hit', `You are invincible for ${sec(settings.get(1).pcinvincibletime)}.`],
          ['Between runs', 'Coins picked up in runs carry over: spend them on each character’s skill tree (refundable) and, in EX, on character unlocks and the Coin upgrade store.'],
          ['Relics', 'Some stages hide a relic on the map. Relics unlock characters and, carried by the right character to the end of the right stage, play her ending story.'],
        ],
      },
      {
        type: 'facts',
        title: 'Versions',
        items: [
          ['M.O.G.', ['The original event: 5 themes of 2 stages plus a 30-minute Challenge Stage, 6 characters.', intro(settings.get(1).enter_scenario)].filter(Boolean)],
          ['M.O.G. EX Edition', ['The Arcade version: adds Exia, the Mine theme, a “Ø” stage per theme, Challenge Stages α and β, EX. combined weapons, Coin upgrades, revives and rerolls.', intro(ex.enter_scenario)].filter(Boolean)],
          ['Union Ranking', 'Ordinary Raptures killed in the Challenge Stage (Challenge Stage - β in EX) count for a ranking inside your Union. Not counted in the Archives.'],
        ],
      },
      {
        type: 'gallery',
        title: 'Characters',
        items: people.map((p) => ({ img: ctx.img(p.rows[0].ui_resource_id), caption: p.name })),
      },
      {
        type: 'gallery',
        title: 'Themes',
        items: [...new Map(playStages.map((s) => [s.ui_theme_localkey, s])).values()].map((s) => ({ img: ctx.img(s.ui_theme), caption: themeName(s) })),
      },
    ],
    pages: [
      { id: 'guide', title: 'How to play', summary: 'The in-game guide.', sections: guideSections },
      ...characterPages,
      {
        id: 'weapons',
        title: 'Weapons',
        group: 'Equipment',
        count: normalWeapons.length + combined.length,
        summary: 'Weapons fire automatically. You get them (and level them) from level-up choices and Manufacturer Arms boxes.',
        sections: [
          {
            type: 'table',
            title: 'Weapons',
            note: 'Values by level are the numbers in the description (usually damage). Weight is how likely the weapon is to be offered on level up compared with the others (higher = more often). "EX" weapons exist only in the EX Edition.',
            columns: ['Weapon', 'What it does (Lv. 1)', 'Values by level', 'Who can use it', 'Version', { label: 'Weight', num: true }],
            rows: normalWeapons.map(weaponRow),
          },
          {
            type: 'table',
            title: 'EX. combined weapons',
            note: `EX Edition only. Holding both listed weapons at Lv. 5 lets a level-up turn them into the combined weapon (at most ${ex.maxcombineweapon} per run).`,
            columns: ['Weapon', 'Made from', 'What it does'],
            rows: combined.map((l) => [itemImg(l[0]), l[0].itemcondition_id.map((c) => itemById.get(c.itemcondition_id)).filter(Boolean).map((it) => itemImg(it)), oneLine(itemDesc(l[0]))]),
          },
        ],
      },
      {
        id: 'modules',
        title: 'Modules',
        group: 'Equipment',
        count: modules.length,
        summary: 'Passive upgrades picked like weapons.',
        sections: [{
          type: 'table',
          note: 'Values by level are the numbers in the description. Weight: how likely the module is offered on level up (higher = more often).',
          columns: ['Module', 'What it does (Lv. 1)', 'Values by level', { label: 'Weight', num: true }, 'Notes'],
          rows: modules.map((l) => [itemImg(l[0]), oneLine(itemDesc(l[0])), l.length > 1 ? levelValues(l) : '', l[0].itemratio,
            l[0].passivespecial === 'Passive_Revive' ? 'Revives you once' : oneLine(hint(l[0]).split('\n').pop() || '')]),
        }],
      },
      {
        id: 'pickups',
        title: 'Pickups and boxes',
        group: 'Equipment',
        count: pickups.length + boxes.length,
        sections: [
          {
            type: 'table',
            title: 'Field pickups',
            note: 'Dropped by defeated Raptures. The effect is the in-game text; "Amount" is the value in the item table, which for a few items differs from the text.',
            columns: ['Item', 'Effect', { label: 'Amount', num: true }, 'Pulled by item radius'],
            rows: pickups.filter((i) => i.fielditem_type !== 'GachaBox').map((i) => [itemImg(i), oneLine(itemDesc(i)), i.itemvalue, i.canmagnet ? 'Yes' : 'No']),
          },
          {
            type: 'table',
            title: 'Manufacturer Arms boxes',
            note: 'Dropped by mid-bosses and bosses. Opening one rolls a box grade, then that many weapon / module upgrades from the box’s pool.',
            columns: ['Grade', { label: 'Chance', num: true }, { label: 'Upgrades', num: true }, 'Bonus pickups'],
            rows: boxes.map((b) => [b.grade, `${+(100 * b.rate / boxTotal).toFixed(1)}%`, b.maxslot,
              b.bonusslotdata.map((x) => itemById.get(x.bonusslot)).filter(Boolean).map((it) => itemName(it))]),
          },
          ...boxes.map((b) => ({ type: 'table', title: `Grade ${b.grade} box pool`, columns: ['Upgrade', { label: 'Share', num: true }], rows: boxPool(b.gachalist_group_id) })),
        ],
      },
      {
        id: 'relics',
        title: 'Lost Relics',
        group: 'Equipment',
        count: relics.length,
        summary: 'Items placed on certain maps. Pick one up and finish the stage to keep it.',
        sections: [{
          type: 'table',
          columns: ['Relic', 'Description', 'Found in', 'Used for'],
          rows: relics.map((r) => {
            const unlocks = chars.filter((c) => c.reqitem_id === r.id && c.commonsettingsid !== 2 && settings.get(c.commonsettingsid) && !settings.get(c.commonsettingsid).isspecialmode);
            const endings = endingGroups.filter((g) => g.hold.includes(r.id));
            return [
              { img: ctx.img(r.iconresource_id), caption: itemName(r), size: 'small' },
              ctx.plain(r.itemdesclocale, ''),
              relicStages.has(r.id) ? stageLinks(relicStages.get(r.id)) : (hint(r) ? oneLine(hint(r)) : 'Not placed in any stage timeline'),
              [...[...new Set(unlocks.map((c) => charName(c)))].map((n) => `Unlocks ${n}`), ...endings.map((g) => ({ page: g.page, label: `Ending: ${g.title}` }))],
            ];
          }),
        }],
      },
      ...stagePages,
      {
        id: 'coin-store',
        title: 'Coin upgrades (EX)',
        group: 'Upgrades',
        summary: 'EX Edition only: permanent stat slots bought with Coins, plus paid revives and rerolls.',
        sections: [
          {
            type: 'text',
            text: `${ctx.plain('Locale_Event:Event_NKSminigame_system_coinSkillStore_DetailHelp', '')}\nA reset (re-rolling the attributes) costs ${num(ex.coinskillstore_rerollamount)} Coins; locking a slot so it keeps its attribute adds ${num(ex.coinskillstore_lockaddamount)} to that cost.`,
          },
          {
            type: 'table',
            title: 'Slot enhancement costs',
            note: 'The same for all 4 slots.',
            columns: [{ label: 'Grade', num: true }, { label: 'Coins', num: true }],
            rows: slotCosts.filter((s) => s.slot_group_id === 1).map((s) => [s.grade, s.coinamount]),
          },
          {
            type: 'table',
            title: 'Possible attributes',
            note: 'Chance: how likely a reset gives this attribute. Each attribute comes in an A and a rarer, stronger S version; the value grows with the slot’s grade.',
            columns: ['Attribute', { label: 'Chance', num: true }, { label: 'Grade 1', num: true }, { label: 'Grade 5', num: true }, { label: 'Grade 10', num: true }],
            rows: storeGroups.map((k) => {
              const l = skillStore.filter((s) => `${s.group_id}-${s.second_group_id}` === k).sort((a, b) => a.grade - b.grade);
              const g = (n) => l.find((s) => s.grade === n);
              return [{ img: ctx.img(l[0].iconresource), caption: ctx.plain(l[0].locale_name, l[0].stat_type_1), size: 'small' },
                `${+(100 * l[0].group_rate / storeWeightTotal).toFixed(1)}%`, statValue(g(1)), g(5) ? statValue(g(5)) : '', g(10) ? statValue(g(10)) : ''];
            }),
          },
          {
            type: 'table',
            title: 'Revives and rerolls',
            note: `During a run you can revive after dying (up to your Max Revivals, ${ex.coinrevive_maxcount} without upgrades) and reroll the level-up choices (up to ${ex.levelupslot_maxrerollcount} times plus Reroll Upgrades). The first of each is free; later ones cost Coins.`,
            columns: [{ label: 'Use', num: true }, { label: 'Revive', num: true }, { label: 'Reroll', num: true }],
            rows: [...new Set(coinStore.map((c) => c.count))].map((n) => [n,
              coinStore.find((c) => c.storetype === 'CoinRevive' && c.count === n)?.coinamount ?? '',
              coinStore.find((c) => c.storetype === 'LevelupSlot' && c.count === n)?.coinamount ?? '']),
          },
        ],
      },
      {
        id: 'levels',
        title: 'Level EXP',
        group: 'Upgrades',
        count: levels.length,
        summary: 'Battle Data needed for each in-run level.',
        sections: [{
          type: 'table',
          note: `From level ${lastLv.lv} on, every further level needs ${lastLv.exp} EXP.`,
          columns: [{ label: 'Level', num: true }, { label: 'EXP to next', num: true }],
          rows: levels.map((l) => [l.loop ? `${l.lv}+` : l.lv, l.exp]),
        }],
      },
      missionPage(1),
      missionPage(2),
      missionPage(3),
      ...storyPages,
      special.length && {
        id: 'special',
        title: 'Special mode',
        summary: 'Boss-only versions with a fixed, fully upgraded loadout. Their item names are April-Fools style jokes (…_AF keys); where they were used is not in these tables.',
        sections: [{
          type: 'table',
          note: 'Each row is one CommonSettings entry flagged as special mode.',
          columns: ['Mode', 'Character', 'Weapons', 'Modules', 'Boss', 'Length'],
          rows: specialRows,
        }],
      },
    ].filter(Boolean),
  };
}

module.exports = { build };
