// Field maps: the 3D art of campaign / event / lost sector fields and what stands on them.
// nikke-downloader/maps.py exports each field to <mapsDir>/<field>/ (<field>.glb + markers.json);
// tools/web-maps.py writes the smaller web copy the viewer loads (public/img/maps/<field>.glb).
// Markers come from the field's level bundle; positionids join them to FieldMapData_<field>.json.
const fs = require('fs');
const path = require('path');

const KINDS = { fcbg: 'campaign', febg: 'event', flbg: 'lostsector' };
const MODE_FIELD = { Normal: 'field_id', Hard: 'hard_field_id', Story: 'story_field_id' };
const ITEM_LABEL = { HiddenItem: 'Lost relic', BGM: 'Music record', Memory: 'Memorial', Box: 'Box', Collect: 'Collectible',
  BodyCore: 'Body core', BetaCore: 'Beta core', Album: 'Album' };

const readRecords = (file) => {
  const d = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(d) ? d : d.records || [];
};

class MapLibrary {
  constructor({ dataDir, mapsDir }, locale, stages, memorials) {
    this.memorials = memorials;
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
    for (const t of ['EventFieldTable', 'ArchiveEventFieldTable']) {
      for (const e of this.table(t)) {
        if (e.field_art_map_standard && !this.uses.has(e.field_art_map_standard)) {
          this.uses.set(e.field_art_map_standard, { kind: 'event', eventId: e.event_id, hud: e.field_hud });
        }
      }
    }
    this.list = [];
    this.stageMap = new Map(); // campaign stage id -> field
    if (this.mapsDir && fs.existsSync(this.mapsDir)) {
      for (const field of fs.readdirSync(this.mapsDir).sort()) {
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
    this.list.sort((a, b) => (a.chapter ?? 1e9) - (b.chapter ?? 1e9) || modeOrder(a) - modeOrder(b) || a.id.localeCompare(b.id));
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
    }
    return { id: field, kind, title, group, chapter: use.chapter, mode: use.mode };
  }

  catalogue() {
    return this.list.map(({ markers, art, ...m }) => ({
      ...m,
      thumb: `img/maps/${art}.webp`, // tools/map-thumbs.py
      stages: markers.filter((x) => x.type === 'StageSpawner' && this.stages.stages.has(x.stageid)).length, // campaign stages only
      relics: markers.filter((x) => x.type === 'ItemSpawner').length,
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
    };
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
    }
    // Number the relics and gates/switches in map order so the table and the labels match.
    let n = 0;
    for (const m of out) if (m.layer === 'relic') m.no = ++n;
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
    const { markers, art, ...head } = map;
    return { ...head, model: `img/maps/${art}.glb`, versions, markers: out };
  }
}

module.exports = { MapLibrary };
