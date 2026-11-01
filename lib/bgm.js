// Jukebox: albums (JukeboxThemeTable) and their tracks (JukeboxListTable),
// with how each track is obtained and the story scenes that play it.
const fs = require('fs');
const path = require('path');

function readRecords(file) {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(json) ? json : json.records || [];
}

class BgmLibrary {
  constructor(dataDir, locale, stories) {
    this.dataDir = dataDir;
    this.locale = locale;
    this.stories = stories;
  }

  table(name) {
    const file = path.join(this.dataDir, `${name}.json`);
    return fs.existsSync(file) ? readRecords(file) : [];
  }

  text(key, fallback = null) {
    return (key && this.locale.get(key)) || fallback;
  }

  // Obtain strings are stored as bare keys ("JUKEBOX_OBTAIN_MINIGAME"); they live in Locale_System.
  systemText(key, ...args) {
    const t = this.text(`Locale_System:${key}`, key);
    return args.reduce((s, a, i) => s.replace(`{${i}}`, a), t);
  }

  build() {
    const fieldItems = new Map(this.table('FieldItemTable').map((f) => [f.id, f]));
    const tracks = this.table('JukeboxListTable');
    this.albums = this.table('JukeboxThemeTable').sort((a, b) => a.order - b.order).map((t) => ({
      id: t.id,
      name: this.text(t.name_localkey, String(t.id)),
      description: this.text(t.description_localkey, ''),
      color: `#${t.bg_color || '444444'}`,
      tracks: tracks.filter((x) => x.theme === t.id).sort((a, b) => a.order - b.order).map((x) => ({
        id: x.id,
        name: x.name,
        artist: x.artist,
        bgm: x.bgm,
        length: x.play_time,
        loop: x.is_loop,
        ...this.obtain(x, fieldItems),
        sceneCount: (this.stories.bgmUse.get(x.bgm.toLowerCase()) || []).length,
      })),
    }));
    console.log(`Indexed ${tracks.length} jukebox tracks in ${this.albums.length} albums`);
  }

  // { source: short label for the table, obtain: the game's full sentence }.
  obtain(track, fieldItems) {
    const full = (key, ...args) => this.systemText(key, ...args);
    // "Can be obtained from the side story PRETTY STAR." -> "Side story PRETTY STAR"
    const shorten = (t) => {
      const s = t.replace(/^Can be obtained (?:from|by) (?:the |a |an )?/i, '').replace(/\.$/, '');
      if (/default BGM/i.test(s)) return 'Default';
      if (/^event rewards$/i.test(s)) return 'Event';
      if (/TRACING THE STARS/i.test(s)) return 'Tracing the Stars missions';
      return s.charAt(0).toUpperCase() + s.slice(1);
    };
    if (track.is_default_bgm) return { source: 'Default', obtain: full('MISSING_GOODS_JUKEBOX_OBTAIN_PRESET_BGM') };
    if (track.get_info_type === 'Locale') {
      const t = full(track.get_info_value);
      return { source: shorten(t), obtain: t };
    }
    if (track.get_info_type === 'FieldItem') {
      const f = fieldItems.get(Number(track.get_info_value));
      if (f?.obtain_contents === 'Campaign') {
        const hard = f.difficulty === 'Hard';
        const key = hard ? 'MISSING_GOODS_JUKEBOX_OBTAIN_CAMPAIGN_HARD' : 'MISSING_GOODS_JUKEBOX_OBTAIN_CAMPAIGN_NORMAL';
        return { source: `${hard ? 'Hard' : 'Normal'} Ch. ${f.obtain_location}`, obtain: full(key, f.obtain_location) };
      }
      if (f?.obtain_contents === 'Eventfield') return { source: 'Event', obtain: full('MISSING_GOODS_JUKEBOX_OBTAIN_EVENT') };
    }
    return { source: '—', obtain: full('MISSING_GOODS_JUKEBOX_OBTAIN_NONE') };
  }

  scenesFor(bgm) {
    const ids = [...(this.stories.bgmUse.get(bgm.toLowerCase()) || [])].sort((a, b) => this.stories.compareScenes(a, b));
    return ids.map((id) => {
      const scene = this.stories.scenes.get(id);
      return { id, label: scene ? this.stories.sceneLabel(scene).label : id };
    });
  }
}

module.exports = { BgmLibrary };
