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
        obtain: this.obtain(x, fieldItems),
        sceneCount: (this.stories.bgmUse.get(x.bgm.toLowerCase()) || []).length,
      })),
    }));
    console.log(`Indexed ${tracks.length} jukebox tracks in ${this.albums.length} albums`);
  }

  obtain(track, fieldItems) {
    if (track.is_default_bgm) return this.systemText('MISSING_GOODS_JUKEBOX_OBTAIN_PRESET_BGM');
    if (track.get_info_type === 'Locale') return this.systemText(track.get_info_value);
    if (track.get_info_type === 'FieldItem') {
      const f = fieldItems.get(Number(track.get_info_value));
      if (f?.obtain_contents === 'Campaign') {
        const key = f.difficulty === 'Hard' ? 'MISSING_GOODS_JUKEBOX_OBTAIN_CAMPAIGN_HARD' : 'MISSING_GOODS_JUKEBOX_OBTAIN_CAMPAIGN_NORMAL';
        return this.systemText(key, f.obtain_location);
      }
      if (f?.obtain_contents === 'Eventfield') return this.systemText('MISSING_GOODS_JUKEBOX_OBTAIN_EVENT');
    }
    return this.systemText('MISSING_GOODS_JUKEBOX_OBTAIN_NONE');
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
