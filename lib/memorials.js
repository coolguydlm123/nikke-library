// Memorials: the documents picked up on field maps (journals, call logs, data files), shown in
// the Stories reader as one more category. A series is a group, each page of it a "scene"
// with id memorial_<memorial_memory_id>; its text is split into lines, and call logs
// ("A: ...") get their speaker. Field items of type Memory reward a Memorial (RewardTable).
const fs = require('fs');
const path = require('path');
const { art } = require('./art');

const readRecords = (file) => {
  const d = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(d) ? d : d.records || [];
};

class MemorialLibrary {
  constructor({ dataDir }, locale) {
    this.dataDir = dataDir;
    this.locale = locale;
  }

  table(name) {
    const file = path.join(this.dataDir, `${name}.json`);
    return fs.existsSync(file) ? readRecords(file) : [];
  }

  text(key, fallback = null) {
    return (key && this.locale.get(key)) || fallback;
  }

  build() {
    const cats = new Map(this.table('MemorialSeriesCategoryTable').map((c) => [c.id, c]));
    const pages = new Map(this.table('MemorialMemoryTable').map((m) => [m.memorial_memory_id, m]));
    this.byItem = new Map(); // FieldItemTable id -> scene id
    this.pages = new Map(); // scene id -> { page, series, label, prev, next }
    const series = this.table('MemorialSeriesTable').sort((a, b) =>
      (cats.get(a.memorial_series_category)?.category_type === 'Event') - (cats.get(b.memorial_series_category)?.category_type === 'Event')
      || (cats.get(a.memorial_series_category)?.order ?? 0) - (cats.get(b.memorial_series_category)?.order ?? 0) || a.order - b.order);
    const groups = [];
    for (const s of series) {
      const list = s.memorial_memory_id.map((x) => pages.get(x.memorial_memory_id)).filter(Boolean);
      if (!list.length) continue;
      const cat = cats.get(s.memorial_series_category);
      const kind = this.text(cat?.category_name, s.memorial_series_category);
      const label = `${kind} · ${this.text(s.memorial_series_name, String(s.memorial_series_id))}`;
      const scenes = list.map((p, i) => {
        const id = `memorial_${p.memorial_memory_id}`;
        this.pages.set(id, { page: p, series: s, group: label, label: this.text(p.memorial_memory_name, `Page ${i + 1}`),
          prev: list[i - 1] ? `memorial_${list[i - 1].memorial_memory_id}` : null,
          next: list[i + 1] ? `memorial_${list[i + 1].memorial_memory_id}` : null });
        if (p.fielditem_id) this.byItem.set(p.fielditem_id, id);
        return { id, label: this.pages.get(id).label, lines: this.lines(p).length };
      });
      // Series art (icons-material mm_1001 ...), shown on the Stories hub card.
      const img = art('icons-material', s.memorial_series_resource);
      groups.push({ id: `memorial${s.memorial_series_id}`, label, scenes,
        description: this.text(s.memorial_series_description, ''), img: img ? `icons-material/${img}` : null });
    }
    this.category = { id: 'memorial', label: 'Memorials', groups };
    console.log(`Indexed ${this.pages.size} memorial pages in ${groups.length} series`);
  }

  lines(page) {
    const text = this.text(page.memorial_memory_description, '') || '';
    return text.replace(/\\n/g, '\n').split(/\n/).map((t) => t.trim()).filter(Boolean);
  }

  // Same shape as StoryLibrary.scene(), so the reader shows it like any story.
  scene(id) {
    const info = this.pages.get(id);
    if (!info) return null;
    const speakers = {};
    const lines = this.lines(info.page).map((t, i) => {
      const m = t.match(/^([A-Z][\w .'-]{0,20}):\s+(.+)$/); // call logs: "A: ..."
      if (m) speakers[m[1]] = m[1];
      return { id: `${id}_${i + 1}`, type: 'Speech', speaker: m ? m[1] : null, key: info.page.memorial_memory_description, text: m ? m[2] : t };
    });
    return {
      id,
      cat: 'memorial',
      group: { id: `memorial${info.series.memorial_series_id}`, label: info.group },
      label: info.label,
      stage: null,
      prev: info.prev,
      next: info.next,
      speakers,
      icons: {},
      lines,
    };
  }
}

module.exports = { MemorialLibrary };
