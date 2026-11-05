// Misc: pages that don't belong to another section. First, the Story Line: the game's
// timeline of stories (HistoryManagerTable), ordered in-story (History) or by release.
const fs = require('fs');
const path = require('path');
const { art } = require('./art');

const readRecords = (file) => {
  const d = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(d) ? d : d.records || [];
};

// .NET DateTime as json-bigint { s, e, c }: the low 62 bits are ticks since 0001-01-01.
function decodeDate(o) {
  if (!o?.c) return null;
  const digits = o.c.map((x, i) => (i ? String(x).padStart(14, '0') : String(x))).join('');
  const ticks = BigInt(digits) & ((1n << 62n) - 1n);
  return new Date(Number((ticks - 621355968000000000n) / 10000n)).toISOString().slice(0, 10);
}

// The thumbnail as "<family>/<name>" (a public/img web copy), or null.
function thumbOf(id) {
  for (const family of ['icons-storyline', 'icons-album']) {
    const name = art(family, id);
    if (name) return `${family}/${name}`;
  }
  return null;
}

class MiscLibrary {
  constructor({ dataDir }, locale, stories) {
    this.dataDir = dataDir;
    this.locale = locale;
    this.stories = stories; // scene names and links
  }

  table(name) {
    const file = path.join(this.dataDir, `${name}.json`);
    return fs.existsSync(file) ? readRecords(file) : [];
  }

  text(key, fallback = null) {
    return (key && this.locale.get(key)) || fallback;
  }

  build() {
    // Tags: scenario_tag_group_id -> HistoryTagGroupTable rows -> HistoryTagSetTable.
    const tagSet = new Map(this.table('HistoryTagSetTable').map((t) => [t.id, t]));
    const tagGroups = new Map();
    for (const g of this.table('HistoryTagGroupTable')) {
      if (!tagGroups.has(g.group_id)) tagGroups.set(g.group_id, []);
      tagGroups.get(g.group_id).push(g.tag_id);
    }
    // Scenes: album_id -> AlbumInfoTable.sub_category_id -> AlbumResourceTable rows (the
    // game's "n/n" progress counts these).
    const albumInfo = new Map(this.table('AlbumInfoTable').map((a) => [a.id, a]));
    const bySub = new Map();
    for (const r of this.table('AlbumResourceTable')) {
      if (!bySub.has(r.sub_category_id)) bySub.set(r.sub_category_id, []);
      bySub.get(r.sub_category_id).push(r.scenario_group_id);
    }
    const used = new Map(); // tag id -> entries
    const entries = this.table('HistoryManagerTable').map((h) => {
      const tags = (tagGroups.get(h.scenario_tag_group_id) || []).map((id) => tagSet.get(id)).filter(Boolean)
        .sort((a, b) => a.tag_order - b.tag_order).map((t) => t.id);
      for (const t of tags) used.set(t, (used.get(t) || 0) + 1);
      const info = albumInfo.get(h.album_id);
      const scenes = (info ? bySub.get(info.sub_category_id) || [] : []).map((id) => {
        const meta = this.stories.scenes.get(id);
        return { id, label: meta ? this.stories.sceneLabel(meta).label : id, readable: !!meta };
      });
      return {
        id: h.id,
        type: h.history_type, // Main / Event / Sub
        name: this.text(h.story_name_localkey, h.story_name_localkey),
        // img_storyline_* are in icons-storyline, img_album_chapterNN in icons-album.
        thumb: thumbOf(h.thumbnail_id),
        date: decodeDate(h.visible_date),
        part: h.story_group_id ? { group: h.story_group_id, order: h.story_group_order } : null,
        historyOrder: h.history_order,
        updateOrder: h.update_order,
        tags,
        scenes,
      };
    });
    // Parts of one story: "Part 1/2".
    const partCount = new Map();
    for (const e of entries) if (e.part) partCount.set(e.part.group, (partCount.get(e.part.group) || 0) + 1);
    for (const e of entries) if (e.part) e.part.of = partCount.get(e.part.group);
    this.thumbStoryGroups(entries);
    this.storyLine = {
      entries,
      tags: [...used.keys()].map((id) => tagSet.get(id)).sort((a, b) => a.tag_order - b.tag_order)
        .map((t) => ({ id: t.id, type: t.tag_type, name: this.text(`Locale_System:${t.tag_localkey}`, t.tag_localkey), count: used.get(t.id) })),
    };
    console.log(`Indexed the Story Line: ${entries.length} entries, ${this.storyLine.tags.length} tags`);
  }

  // The Stories hub cards (main chapters, events, side stories) use the Story Line thumbnail of
  // the entry whose album holds the group's scenes; it replaces the event art set by stories.js.
  thumbStoryGroups(entries) {
    const groups = new Map();
    for (const cat of this.stories.catalogue) for (const g of cat.groups) groups.set(`${cat.id}/${g.id}`, g);
    // A group takes the entry holding most of its scenes (chapter 0's album also holds the
    // opening of chapter 1, so "first match" would give Chapter 1 the prologue's picture).
    const best = new Map(); // group key -> { thumb, n }
    for (const e of entries) {
      if (!e.thumb) continue;
      const counts = new Map();
      for (const s of e.scenes) {
        const meta = this.stories.scenes.get(s.id);
        const key = meta && `${meta.cat}/${meta.group}`;
        if (key && groups.has(key)) counts.set(key, (counts.get(key) || 0) + 1);
      }
      for (const [key, n] of counts) if (!best.has(key) || n > best.get(key).n) best.set(key, { thumb: e.thumb, n });
    }
    for (const [key, b] of best) groups.get(key).img = b.thumb;
    console.log(`Story Line thumbnails on ${best.size} story groups`);
  }
}

module.exports = { MiscLibrary };
