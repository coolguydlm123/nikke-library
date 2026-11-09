// Field maps: the 3D art of campaign / event / lost sector fields and what stands on them.
// nikke-downloader/maps.py exports each field to <mapsDir>/<field>/ (<field>.glb + markers.json);
// tools/web-maps.py writes the smaller web copy the viewer loads (public/img/maps/<field>.glb).
// Markers come from the field's level bundle; positionids join them to FieldMapData_<field>.json.
const fs = require('fs');
const path = require('path');
const { art } = require('./art');

const KINDS = { fcbg: 'campaign', febg: 'event', flbg: 'lostsector' };
const MODE_FIELD = { Normal: 'field_id', Hard: 'hard_field_id', Story: 'story_field_id' };
const ITEM_LABEL = { HiddenItem: 'Lost relic', BGM: 'Music record', Memory: 'Memorial', Box: 'Box', Collect: 'Collectible',
  BodyCore: 'Body core', BetaCore: 'Beta core', Album: 'Album' };

// .NET DateTime ticks, which the tables store as a big-number object {s, e, c: [...]} (base 1e14
// limbs): -> milliseconds since 1970 (UTC).
const ticksMs = (t) => {
  if (!t || !Array.isArray(t.c) || !t.c[0]) return 0;
  const digits = String(t.c[0]) + t.c.slice(1).map((x) => String(x).padStart(14, '0')).join('');
  return Number((BigInt(digits) - 621355968000000000n) / 10000n);
};
const DAY = 86400000;
const isoDate = (ms) => new Date(ms).toISOString().slice(0, 10);

const readRecords = (file) => {
  const d = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(d) ? d : d.records || [];
};

class MapLibrary {
  constructor({ dataDir, mapsDir }, locale, stages, memorials, stories) {
    this.memorials = memorials;
    this.stories = stories;
    this.dataDir = dataDir;
    this.mapsDir = mapsDir;
    this.locale = locale;
    this.stages = stages;
  }

  table(name) {
    const file = path.join(this.dataDir, `${name}.json`);
    return fs.existsSync(file) ? readRecords(file) : [];
  }

  text(key, fallback = null) {
    return (key && this.locale.get(key)) || fallback;
  }

  build() {
    this.items = new Map(this.table('FieldItemTable').map((x) => [x.id, x]));
    // field id -> where the game uses it
    this.uses = new Map();
    for (const c of this.stages.chapters || []) {
      for (const [mode, key] of Object.entries(MODE_FIELD)) {
        if (c[key]) this.uses.set(c[key], { kind: 'campaign', chapterId: c.id, chapter: c.chapter, mode, name: this.text(c.name_localkey, '') });
      }
    }
    this.eventField = new Map(); // art map -> its EventFieldTable row (the live one; the archive copy only if there is none)
    for (const t of ['EventFieldTable', 'ArchiveEventFieldTable']) {
      for (const e of this.table(t)) {
        if (e.field_art_map_standard && !this.uses.has(e.field_art_map_standard)) {
          this.uses.set(e.field_art_map_standard, { kind: 'event', eventId: e.event_id, hud: e.field_hud });
          this.eventField.set(e.field_art_map_standard, { ...e, archive: t.startsWith('Archive') });
        }
      }
    }
    // NPCs of the event fields, the timeline (ProgressEventTable: spawn/despawn/map-change rows by group)
    // and the event stages those rows wait for
    this.npcs = new Map([...this.table('ArchiveEventFieldNPCTable'), ...this.table('EventFieldNPCTable')].map((n) => [n.id, n]));
    this.eventTargets = new Map([...this.table('ArchiveEventFieldEventTargetTable'), ...this.table('EventFieldEventTargetTable')].map((n) => [n.id, n]));
    this.charRes = new Set(this.table('Character/CharacterTable').map((c) => c.resource_id));
    this.progress = new Map(); // live group id -> rows
    const dir = path.join(this.dataDir, 'ProgressEventTable');
    if (fs.existsSync(dir)) {
      for (const f of fs.readdirSync(dir)) {
        for (const r of readRecords(path.join(dir, f))) {
          if (!this.progress.has(r.group_id)) this.progress.set(r.group_id, []);
          this.progress.get(r.group_id).push(r);
        }
      }
    }
    this.eventStages = new Map([...this.table('ArchiveEventDungeonStageTable'), ...this.table('EventDungeonStageTable')].map((x) => [x.id, x]));
    // What NPCs say: speech-bubble lines (BalloonDialogTable by group, named by the NPC row's
    // balloon_always_id) and the conversation a talk starts (EventFieldNPCTalkTable by group_id)
    this.balloons = new Map();
    for (const b of this.table('BalloonDialogTable')) {
      if (!this.balloons.has(b.group_id)) this.balloons.set(b.group_id, []);
      this.balloons.get(b.group_id).push(b);
    }
    this.npcTalks = new Map();
    for (const r of this.table('EventFieldNPCTalkTable')) {
      if (!this.npcTalks.has(r.group_id)) this.npcTalks.set(r.group_id, []);
      this.npcTalks.get(r.group_id).push(r);
    }
    for (const rows of this.npcTalks.values()) rows.sort((a, b) => a.talk_order - b.talk_order);
    this.dungeons = new Map([...this.table('ArchiveEventDungeonTable'), ...this.table('EventDungeonTable')].map((x) => [x.id, x]));
    this.presets = new Map([...this.table('ArchiveEventMapChangePresetTable'), ...this.table('EventMapChangePresetTable')].map((x) => [x.id, x]));
    this.list = [];
    this.stageMap = new Map(); // campaign stage id -> field
    this.arts = new Set(); // art maps with a model (event art variants have no markers.json of their own)
    this.walks = new Set(); // ... and a walkable area
    if (this.mapsDir && fs.existsSync(this.mapsDir)) {
      for (const field of fs.readdirSync(this.mapsDir).sort()) {
        if (fs.existsSync(path.join(this.mapsDir, field, `${field}.glb`))) this.arts.add(field);
        if (fs.existsSync(path.join(this.mapsDir, field, 'walkable.json'))) this.walks.add(field);
        const file = path.join(this.mapsDir, field, 'markers.json');
        if (!fs.existsSync(file)) continue;
        const markers = JSON.parse(fs.readFileSync(file, 'utf8'));
        // map.json names the field whose model it shows: Hard and Story reuse the Normal art
        const info = path.join(this.mapsDir, field, 'map.json');
        const art = fs.existsSync(info) ? JSON.parse(fs.readFileSync(info, 'utf8')).art || field : field;
        this.list.push({ ...this.summary(field), art, markers });
        for (const m of markers) if (m.type === 'StageSpawner' && m.stageid) this.stageMap.set(m.stageid, field);
      }
    }
    const modeOrder = (m) => Object.keys(MODE_FIELD).indexOf(m.mode);
    this.list.sort((a, b) => (a.chapter ?? 1e9) - (b.chapter ?? 1e9) || modeOrder(a) - modeOrder(b)
      || (a.eventId ?? 0) - (b.eventId ?? 0) || a.id.localeCompare(b.id));
    // two events can share a name ("Collab 02"): tell them apart by their art name
    const seen = new Map();
    for (const m of this.list) seen.set(m.title, (seen.get(m.title) || 0) + 1);
    for (const m of this.list) if (seen.get(m.title) > 1 && m.kind === 'event') m.title += ` (${m.id.replace(/^febg_/, '')})`;
    this.byId = new Map(this.list.map((m) => [m.id, m]));
    console.log(`Indexed ${this.list.length} field map(s)`);
  }

  summary(field) {
    const use = this.uses.get(field) || {};
    const kind = KINDS[field.slice(0, 4)] || 'other';
    let title = field, group = kind;
    if (use.kind === 'campaign') {
      title = `Chapter ${use.chapter}${use.name ? ` · ${use.name}` : ''}`;
      group = use.mode;
    } else if (kind === 'lostsector') {
      title = `Lost Sector ${Number(field.match(/(\d+)$/)?.[1]) || field}`;
    } else if (use.kind === 'event') {
      title = this.eventTitle(use.eventId, field);
      group = 'Events';
    }
    const img = use.kind === 'event' && this.stories?.eventInfo.get(use.eventId)?.img;
    return { id: field, kind, title, group, chapter: use.chapter, mode: use.mode, eventId: use.eventId,
      img: img ? `icons-event_bg/${img}` : undefined };
  }

  // The event's name as the Stories section gives it, else the field's HUD / art name.
  eventTitle(eventId, field) {
    let label = null;
    try { label = this.stories?.eventLabel({ eventId, scenes: [] }).label; } catch { /* fall through */ }
    if (label) return label;
    return field.replace(/^febg_/, '').replace(/_\d+(_\d+)?$/, '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  catalogue() {
    return this.list.map(({ markers, art, ...m }) => ({
      ...m,
      thumb: `img/maps/${art}.webp`, // tools/map-thumbs.py
      stages: markers.filter((x) => x.type === 'StageSpawner' && this.stages.stages.has(x.stageid)).length, // campaign stages only
      relics: markers.filter((x) => x.type === 'ItemSpawner').length,
      npcs: markers.filter((x) => x.type === 'NPCSpawner').length,
    }));
  }

  forStage(id) {
    const field = this.stageMap.get(id);
    return field ? { id: field, title: this.byId.get(field).title } : null;
  }

  stageInfo(id) {
    const s = this.stages.stages.get(id);
    if (!s) return null;
    const info = this.stages.enemyInfo(s.spot_id, s.monster_stage_lv);
    const elements = [...new Set((info?.enemies || []).flatMap((e) => e.element || []))];
    const name = this.text(s.name_localkey, String(id));
    return { id, label: name.replace(/\s+STAGE$/i, ''), category: s.stage_category, lv: s.monster_stage_lv, cp: s.standard_battle_power, elements };
  }

  itemInfo(id) {
    const it = this.items.get(id);
    if (!it) return { id, label: 'Item' };
    const reward = this.stages.rewardInfo(it.type_value);
    const scene = this.memorials?.byItem.get(id) || null; // Memory relics: the memorial page in Stories
    const page = scene && this.memorials.pages.get(scene);
    return {
      id,
      itemType: it.item_type,
      label: ITEM_LABEL[it.item_type] || it.item_type,
      difficulty: it.difficulty,
      rewards: page ? [{ name: `${page.group.replace(/^[^·]+· /, '')}: ${page.label}`, amount: 1 }]
        : (reward?.items || []).map((r) => ({ name: r.name, amount: r.amount })),
      scene,
      needsItem: it.spawn_condition_item || undefined, // another item that has to be collected first
    };
  }

  // Speaker code ("alice", "shorthairstudent") -> the name the Stories section shows for it.
  who(code) {
    try { return (this.stories?.speakerName(code) || code || '').toString(); } catch { return code || ''; }
  }

  // [[speaker, text], ...] of dialog rows, skipping lines without text.
  lines(rows, speaker, key) {
    return rows.map((r) => [this.who(r[speaker]), this.text(r[key])]).filter((l) => l[1]);
  }

  // An NPC spawner's NPC (EventFieldNPCTable): name, character icon, what talking to it starts and says.
  npcInfo(id) {
    const n = this.npcs.get(id);
    if (!n) return { npcId: id, label: `NPC ${id}` };
    const res = String(n.resource_id).padStart(3, '0');
    const icon = n.npc_type === 'Character' && this.charRes.has(n.resource_id)
      ? art('icons-char', `si_c${res}_${String(n.costume_index || 0).padStart(2, '0')}_s`) || art('icons-char', `si_c${res}_00_s`) : null;
    const say = n.balloon_always_id ? this.lines(this.balloons.get(n.balloon_always_id) || [], 'speaker', 'scenario_localkey') : [];
    const talkEvent = (n.event_field_npc_event_data_list || []).find((e) => e.event_type === 'NPCTalk');
    const talk = talkEvent ? this.lines(this.npcTalks.get(talkEvent.event_id) || [], 'speaker', 'npc_talk_localekey') : [];
    return {
      npcId: id,
      say: say.length ? say : undefined, // speech bubbles above the NPC
      sayRandom: say.length && n.balloon_always_play_type === 'Random' ? true : undefined, // else in order
      talk: talk.length ? talk : undefined, // the conversation when you talk to it
      label: this.text(n.npc_localkey_name) || (n.npc_type === 'Character' ? `Character ${n.resource_id}` : `NPC ${n.resource_id}`),
      npcType: n.npc_type,
      icon: icon ? `icons-char/${icon}` : undefined,
      does: [...new Set((n.event_field_npc_event_data_list || []).map((e) => e.event_type).filter((t) => t && t !== 'None'))],
    };
  }

  // The event field's timeline. ProgressEventTable holds rows per group: the field's own group (MapChange /
  // MapPresetChange = another art variant) and one group per NPC (Spawn / Despawn). Every row waits for a
  // date and often for an event stage (or mission) to be cleared. Those conditions, ordered by date then
  // stage, are the steps; state k = the first k steps done (state 0: nothing yet). A row counts once its
  // step is done; an NPC shows if its last counted row is a Spawn (an NPC with only Despawn rows shows
  // from the start). Items gated by an event stage appear with their step. States that change nothing
  // are merged. (How the game combines date and stage is read from the data, not confirmed: inferred.)
  timeline(map, markers) {
    const field = this.eventField.get(map.id);
    if (!field) return null;
    const rows = (gid) => this.progress.get(gid) || [];
    const REAL_FROM = 1e12, REAL_TO = 4.1e12; // 2001 .. 2100 in ms; the tables use placeholder dates (year 1, year 24000) for "no date"
    const cond = (r) => {
      const ms = Math.round(ticksMs(r.condition_time) / 60000) * 60000; // to the minute: 19:59:59 and 20:00:00 are one step
      return { ms: ms > REAL_FROM && ms < REAL_TO ? ms : 0, stage: r.condition_stageclear || 0, mission: r.condition_missionclear || 0 };
    };
    const key = (c) => `${c.ms}|${c.stage}|${c.mission}`;
    const stepMap = new Map();
    const note = (c) => stepMap.set(key(c), c);
    const fieldRows = rows(field.progress_event_group_id).filter((r) => r.event_type === 'MapChange' || r.event_type === 'MapPresetChange');
    fieldRows.forEach((r) => note(cond(r)));
    const npcRows = new Map(); // NPC id -> its Spawn / Despawn rows
    for (const m of markers) {
      const n = m.type === 'NPCSpawner' && this.npcs.get(m.npcid);
      if (!n || !n.progress_event_group_id || npcRows.has(n.id)) continue;
      const rs = rows(n.progress_event_group_id).filter((r) => r.event_type === 'Spawn' || r.event_type === 'Despawn');
      npcRows.set(n.id, rs);
      rs.forEach((r) => note(cond(r)));
    }
    const real = (c) => c.ms > 1e12; // after 2001: not a placeholder date
    // Items are released on a schedule: spawn_time (a date, set on nearly every event item) and, on some,
    // spawn_condition_stage (an event stage id, the same ids the NPC rows wait for). Each distinct pair is a
    // step. (despawn_time, the event's end for all of them, and spawn_condition_item, "after collecting
    // another item", are not timeline steps.)
    const itemGate = new Map(); // item spawner positionid -> its step condition
    for (const m of markers) {
      const it = m.type === 'ItemSpawner' && this.items.get(m.itemid ?? m.itemId);
      if (!it) continue;
      const c = cond({ condition_time: it.spawn_time, condition_stageclear: it.spawn_condition_stage, condition_missionclear: 0 });
      if (!c.ms && !c.stage) continue;
      itemGate.set(m.positionid, c);
      note(c);
    }
    // Steps without a date (only a stage / mission) come right after the event opens, in stage order.
    const opens = Math.min(...[...stepMap.values()].filter(real).map((c) => c.ms), Infinity);
    const stageNo = (id) => this.eventStages.get(id)?.step || 0;
    const when0 = (c) => (real(c) ? c.ms : (Number.isFinite(opens) ? opens : 0) + stageNo(c.stage) * 60000);
    // a row with no condition at all (no date, stage or mission) counts from the start, so it is no step
    const steps = [...stepMap.values()].filter((c) => c.ms || c.stage || c.mission)
      .sort((a, b) => when0(a) - when0(b) || a.stage - b.stage || a.mission - b.mission);
    if (!steps.length) return null;
    const at = new Map(steps.map((c, i) => [key(c), i])); // condition -> step index
    const step = (r) => at.get(key(cond(r))) ?? -1;
    const byOrder = (a, b) => step(a) - step(b) || a.id - b.id;
    const first = steps.find(real)?.ms || 0;
    // "stage 6"; when the field has several stage lists (parts / difficulties) with the same step numbers,
    // the part is named too: "stage 6 (Part 2)"
    const groups = [...new Set(steps.filter((c) => c.stage).map((c) => this.eventStages.get(c.stage)?.group))].filter(Boolean).sort();
    const stageText = (id) => {
      const e = this.eventStages.get(id);
      if (!e) return `stage ${id}`;
      const part = groups.length > 1 ? ` (${this.text(this.dungeons.get(e.group)?.part_name) || `list ${groups.indexOf(e.group) + 1}`})` : '';
      return `stage ${e.step}${part}`;
    };
    const when = (ms) => `Day ${Math.floor((ms - first) / DAY) + 1} ${new Date(ms).toISOString().slice(11, 16)}`; // UTC

    const states = [];
    const visibility = new Map(); // positionid -> bits per kept state
    let last = null;
    let shownBefore = new Set(); // items shown in the previous kept state
    const itemPids = markers.filter((m) => m.type === 'ItemSpawner').map((m) => m.positionid);
    for (let k = 0; k <= steps.length; k++) {
      const done = (r) => step(r) < k;
      const art = fieldRows.filter(done).sort(byOrder).map((r) => (r.event_type === 'MapChange' ? r.event_value : this.presets.get(Number(r.event_value))?.art_map_change_value)).filter(Boolean).pop() || null;
      const bits = new Map();
      for (const m of markers) {
        if (m.type === 'NPCSpawner' && npcRows.has(m.npcid)) {
          const rs = npcRows.get(m.npcid), lastRow = rs.filter(done).sort(byOrder).pop();
          bits.set(m.positionid, lastRow ? lastRow.event_type === 'Spawn' : !rs.some((r) => r.event_type === 'Spawn'));
        } else if (itemGate.has(m.positionid)) bits.set(m.positionid, at.get(key(itemGate.get(m.positionid))) < k);
      }
      const sig = `${art}|${[...bits.values()].map(Number).join('')}`;
      if (sig === last) continue;
      last = sig;
      const c = k ? steps[k - 1] : null;
      const parts = [];
      let label = 'Event opens';
      if (c) {
        if (real(c)) parts.push(`from ${isoDate(c.ms)} ${new Date(c.ms).toISOString().slice(11, 16)} UTC`);
        if (c.stage) parts.push(`event ${stageText(c.stage)} cleared`);
        if (c.mission) parts.push(`mission ${c.mission} completed`);
        label = [real(c) ? when(c.ms) : null, c.stage ? stageText(c.stage) : null, c.mission ? 'mission' : null].filter(Boolean).join(' · ');
      }
      const variant = art && art !== map.id ? art : null; // a model / walkable area for it exists only if that art map was exported
      const shown = new Set(itemPids.filter((pid) => (bits.has(pid) ? bits.get(pid) : true)));
      const added = [...shown].filter((pid) => !shownBefore.has(pid)).length;
      shownBefore = shown;
      states.push({ label, requires: c ? parts.join(', ') : 'Nothing done yet', art: variant,
        items: itemPids.length ? { shown: shown.size, added } : undefined, // items on the field in this state, and new since the last one
        model: variant && this.arts.has(variant) ? `img/maps/${variant}.glb` : null,
        walkable: variant && this.walks.has(variant) ? `img/maps/${variant}.walk.json` : null });
      for (const [pid, b] of bits) visibility.set(pid, (visibility.get(pid) || '') + (b ? '1' : '0'));
    }
    if (states.length < 2) return null;
    return { states, steps: steps.length, visibility };
  }

  detail(field) {
    const map = this.byId.get(field);
    if (!map) return null;
    const short = (m) => m.name.split('/').pop().trim();
    const byPid = new Map(map.markers.map((m) => [m.positionid, m]));
    const out = [];
    for (const m of map.markers) {
      if (m.inactive || (m.pos[0] === 0 && m.pos[1] === 0 && m.pos[2] === 0)) continue;
      const base = { pid: m.positionid, pos: m.pos, name: short(m) };
      if (m.type === 'StageSpawner') {
        const st = this.stageInfo(m.stageid);
        // Not a campaign stage: an event quest or favourite-item quest placed on this field, named
        // in the scene ("Laplace - 01", "Event - FoolsDay 6600301") under EventQuestStage/FavoriteItemStage.
        const folder = m.name.split('/').slice(-2, -1)[0] || '';
        const kind = /favorite/i.test(folder) ? 'Favorite item quest' : /event/i.test(folder) ? 'Event quest' : 'Quest';
        out.push(st ? { ...base, layer: 'stage', ...st }
          : { ...base, layer: 'side', id: m.stageid, label: base.name.replace(/\s+\d{5,}$/, ''), kind });
      } else if (m.type === 'ItemSpawner') out.push({ ...base, layer: 'relic', ...this.itemInfo(m.itemid ?? m.itemId) });
      else if (m.type === 'LevelTrigger') {
        const opens = map.markers.filter((d) => (d.triggers || []).includes(m.positionid)).map((d) => d.positionid);
        out.push({ ...base, layer: 'switch', label: 'Switch', repeatable: !!m.isRepeatable, opens });
      } else if (m.type === 'Door') {
        out.push({ ...base, layer: 'gate', label: 'Gate', openedBy: (m.triggers || []).filter((p) => byPid.has(p)) });
      } else if (m.type === 'PortalSet') {
        const enter = byPid.get(m.enter?.[0]), exit = byPid.get(m.exit?.[0]);
        if (enter && exit) {
          // _portalType 1 = one-way (the exit is only a landing spot), 0 = both ways
          out.push({ ...base, pos: enter.pos, layer: 'teleport', label: m.portalType === 1 ? 'One-way teleport' : 'Two-way teleport',
            oneWay: m.portalType === 1, from: enter.pos, to: exit.pos });
        }
      } else if (m.type === 'SquadSpawner') out.push({ ...base, layer: 'start', label: 'Squad start' });
      else if (m.type === 'NPCSpawner') out.push({ ...base, layer: 'npc', ...this.npcInfo(m.npcid) });
      else if (m.type === 'EventTargetSpawner') {
        // an event spot (fishing, photo...): the level only gives its id, EventFieldEventTargetTable the kind
        const t = this.eventTargets.get(m.ids?.eventTargetId ?? m.ids?.targetId);
        out.push({ ...base, layer: 'target', label: t?.contents_type ? `${t.contents_type} spot` : 'Event spot', kind: t?.contents_type });
      } else if (m.type === 'PasswordDoor') out.push({ ...base, layer: 'gate', label: 'Password door', openedBy: [], password: true });
    }
    // Number the relics and gates/switches in map order so the table and the labels match.
    let n = 0;
    for (const m of out) if (m.layer === 'relic') m.no = ++n;
    for (const m of out) {
      if (m.layer === 'relic' && m.needsItem) m.needs = out.find((x) => x.layer === 'relic' && x.id === m.needsItem)?.no; // its number on this map
    }
    n = 0;
    const gateNo = new Map();
    for (const m of out) if (m.layer === 'gate') gateNo.set(m.pid, (m.no = ++n));
    for (const m of out) if (m.layer === 'switch') m.opens = m.opens.map((p) => gateNo.get(p)).filter(Boolean);
    const versions = [];
    if (map.chapter != null) {
      const ch = (this.stages.chapters || []).find((c) => c.chapter === map.chapter);
      for (const [mode, key] of Object.entries(MODE_FIELD)) {
        if (ch?.[key]) versions.push({ mode, id: ch[key], available: this.byId.has(ch[key]) });
      }
    }
    const tl = map.kind === 'event' ? this.timeline(map, map.markers) : null;
    if (tl) for (const m of out) if (tl.visibility.has(m.pid) && /0/.test(tl.visibility.get(m.pid))) m.vis = tl.visibility.get(m.pid);
    const { markers, art, ...head } = map;
    // walkable: the navmesh polygons of the art (tools/web-maps.py copies them next to the model)
    const walkable = fs.existsSync(path.join(this.mapsDir, art, 'walkable.json')) ? `img/maps/${art}.walk.json` : null;
    return { ...head, model: `img/maps/${art}.glb`, walkable, versions, markers: out,
      timeline: tl ? { states: tl.states, steps: tl.steps } : null };
  }
}

module.exports = { MapLibrary };
