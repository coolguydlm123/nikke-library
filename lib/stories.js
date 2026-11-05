// Builds the story catalogue from the scenario dialog tables and serves
// individual scenes in a slimmed-down shape for the reader.
const fs = require('fs');
const path = require('path');
const { art } = require('./art');

// orderCsv: the dump's group list, which keeps scenes in the game's own order.
const SOURCES = [
  { dir: 'ScenarioDialogTable', orderCsv: 'ScenarioDialog.Group.csv', categorize: (id) => (id.startsWith('d_main_') ? 'main' : 'sub') },
  { dir: 'EventScenarioDialogTable', orderCsv: 'EventScenarioDialog.Group.csv', categorize: () => 'event' },
  { dir: 'SideStoryScenarioDialogTable', orderCsv: 'SideStoryScenarioDialog.Group.csv', categorize: () => 'side' },
  { dir: 'AttractiveScenarioDialogTable', orderCsv: 'AttractiveScenarioDialog.Group.csv', categorize: () => 'bond' },
  { dir: 'AttractiveCounselDialogTable', orderCsv: 'AttractiveCounselDialog.Group.csv', categorize: () => 'counsel' },
];

const CATEGORIES = [
  { id: 'main', label: 'Main Story' },
  { id: 'event', label: 'Events' },
  { id: 'side', label: 'Side Stories' },
  { id: 'bond', label: 'Bond Episodes' },
  { id: 'counsel', label: 'Counseling' },
  { id: 'sub', label: 'Sub & Sudden Stories' },
  { id: 'outpost', label: 'Outpost' },
  { id: 'favorite', label: 'Favorite Items' },
];

// Natural sort, with "_s" (start) ordered before "_e" (end) of the same stage.
function sortKey(id) {
  return id.toLowerCase().replace(/_s$/, '_0s').replace(/_e$/, '_1e')
    .split(/(\d+)/).map((p, i) => (i % 2 ? Number(p) : p));
}
function naturalCompare(a, b) {
  const ka = sortKey(a), kb = sortKey(b);
  for (let i = 0; i < Math.max(ka.length, kb.length); i++) {
    if (ka[i] === undefined) return -1;
    if (kb[i] === undefined) return 1;
    if (ka[i] < kb[i]) return -1;
    if (ka[i] > kb[i]) return 1;
  }
  return 0;
}

const titleCase = (s) => s.split(/[_\s]+/).filter(Boolean)
  .map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
const stripIndex = (id) => id.replace(/(_\d+)+$/, '');

function readRecords(file) {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(json) ? json : json.records || [];
}

class StoryLibrary {
  constructor(dataDir, locale, mpksDir) {
    this.dataDir = dataDir;
    this.locale = locale;
    this.mpksDir = mpksDir;
    this.gameOrder = new Map(); // scene id (lowercase) -> position in its Group.csv
    this.bgmUse = new Map();    // play_bgm key (lowercase) -> scene ids that play it
    this.scenes = new Map(); // id -> scene meta
    this.cache = new Map();  // id -> slim lines (small LRU)
  }

  table(name) {
    const file = path.join(this.dataDir, `${name}.json`);
    return fs.existsSync(file) ? readRecords(file) : [];
  }

  text(key, fallback) {
    return (key && this.locale.get(key)) || fallback;
  }

  build() {
    const t0 = Date.now();
    this.loadLookups();
    for (const src of SOURCES) {
      const csv = this.mpksDir && path.join(this.mpksDir, src.orderCsv);
      if (csv && fs.existsSync(csv)) {
        fs.readFileSync(csv, 'utf8').split(/\r?\n/).slice(1).forEach((line, i) => {
          if (line.trim()) this.gameOrder.set(line.trim().toLowerCase(), i);
        });
      }
      const dir = path.join(this.dataDir, src.dir);
      if (!fs.existsSync(dir)) continue;
      for (const name of fs.readdirSync(dir)) {
        if (!name.endsWith('.json')) continue;
        const id = name.slice(src.dir.length + 1, -'.json'.length);
        const file = path.join(dir, name);
        let records;
        try { records = readRecords(file); } catch (e) { console.warn(`skip ${name}: ${e.message}`); continue; }
        if (!records.length) continue;
        for (const bgm of new Set(records.map((r) => r.play_bgm?.toLowerCase()).filter(Boolean))) {
          if (!this.bgmUse.has(bgm)) this.bgmUse.set(bgm, []);
          this.bgmUse.get(bgm).push(id);
        }
        this.scenes.set(id, {
          id,
          file,
          // OutpostConditionTriggerTable stories, and favorite item stories (separate from bond episodes)
          cat: this.outpost.has(id.toLowerCase()) ? 'outpost' : this.favorite.has(id.toLowerCase()) || /^treasurestory_/i.test(id) ? 'favorite' : src.categorize(id),
          lines: records.length,
          eventId: records[0].event_id,
        });
      }
    }
    this.catalogue = this.buildCatalogue();
    console.log(`Indexed ${this.scenes.size} scenes in ${Date.now() - t0} ms`);
  }

  loadLookups() {
    this.chapterNames = new Map();
    for (const c of this.table('CampaignChapterTable')) this.chapterNames.set(c.chapter, c.name_localkey);

    this.stageNames = new Map(); // scenario id -> { key, phase }
    for (const s of this.table('CampaignStageTable')) {
      if (s.enter_scenario) this.stageNames.set(s.enter_scenario, { key: s.name_localkey, phase: 'Start' });
      if (s.exit_scenario) this.stageNames.set(s.exit_scenario, { key: s.name_localkey, phase: 'End' });
    }

    // EventManagerTable reuses placeholder keys (story_event_name_001 = "No Caller
    // ID" for ~700 rows), so only a name key used by exactly one event is trusted.
    const events = this.table('EventManagerTable');
    const keyUses = new Map();
    for (const e of events) keyUses.set(e.name_localkey, (keyUses.get(e.name_localkey) || 0) + 1);
    this.eventInfo = new Map();
    for (const e of events) {
      this.eventInfo.set(e.id, {
        nameKey: keyUses.get(e.name_localkey) === 1 ? e.name_localkey : null,
        slugs: [String(e.event_banner_resource_id || '').replace(/^EVENT_BANNER_/i, '').replace(/_S$/i, '')],
      });
    }
    for (const s of [...this.table('EventStoryTable'), ...this.table('ArchiveEventStoryTable')]) {
      const info = this.eventInfo.get(s.event_id);
      if (!info) continue;
      info.slugs.unshift(s.ui_prefab_1, String(s.prologue_scenario || '').replace(/^event_/i, '').replace(/_prologue$/i, ''));
      // The event's story-page background (icons-event_bg ui_event_bg_<ui_prefab_1>), for the hub cards.
      info.img = info.img || art('icons-event_bg', `ui_event_bg_${s.ui_prefab_1}`);
    }

    // Real event names survive in the profile rewards each event hands out:
    // "title_maidinvalentine_name" -> "MAID IN VALENTINE Special Title".
    this.rewardEventNames = new Map();
    for (const [full, text] of this.locale) {
      if (!full.startsWith('Locale_Profile:')) continue;
      const m = full.slice(full.indexOf(':') + 1).match(/^(?:title|bg|sticker)_(.+?)(?:_\d+)?_name$/i);
      const name = text.replace(/\s+(Premium|Special)\s+(Title|Background|Sticker)(\s+[IVX]+)?$/i, '').trim();
      if (m && name !== text && !this.rewardEventNames.has(slugKey(m[1]))) this.rewardEventNames.set(slugKey(m[1]), name);
    }

    this.sideStoryNames = new Map();
    for (const s of this.table('SideStoryTable')) this.sideStoryNames.set(s.id, s.sidestory_name);

    this.counselNames = new Map();
    for (const c of this.table('AttractiveCounselTable')) this.counselNames.set(c.counsel_group_id.toLowerCase(), c.counsel_name_localkey);

    // Bond episodes and counseling scenes link to a character by name_code.
    this.characterNames = new Map();
    this.characterByName = new Map(); // "drakevillain" -> name_code, for scenes with no table link
    for (const c of this.table('Character/CharacterTable')) {
      if (this.characterNames.has(c.name_code)) continue;
      this.characterNames.set(c.name_code, c.name_localkey);
      const name = this.locale.get(c.name_localkey);
      if (name && !this.characterByName.has(slugKey(name))) this.characterByName.set(slugKey(name), c.name_code);
    }
    this.sceneCharacter = new Map();
    for (const c of this.table('AttractiveCounselTable')) this.sceneCharacter.set(c.counsel_group_id.toLowerCase(), c.name_code);
    for (const e of [...this.table('AttractiveLevelRewardTable'), ...this.table('LiberateAttractiveEpisodeTable')]) {
      if (e.attractive_scenario_group_id) this.sceneCharacter.set(e.attractive_scenario_group_id.toLowerCase(), e.name_code);
    }

    // The in-game story archive names most scenarios (incl. every main-story scene).
    this.albumNames = new Map();
    for (const a of this.table('AlbumResourceTable')) {
      if (a.scenario_group_id && a.scenario_name_localkey) this.albumNames.set(a.scenario_group_id.toLowerCase(), a.scenario_name_localkey);
    }

    // Other scenes are titled "<scene id>_title" in whichever locale table holds
    // their dialog; index those by bare key so the table doesn't matter.
    this.titleKeys = new Map();
    for (const full of this.locale.keys()) {
      const bare = full.slice(full.indexOf(':') + 1);
      if (/_title(_[ab])?$/i.test(bare)) this.titleKeys.set(bare.toLowerCase(), full);
    }

    // Outpost (sudden) stories: OutpostConditionTriggerTable has one row per story, with the
    // building (tid -> Locale_Outpost:1000_<tid>_name) and what unlocks it.
    const charName = (code) => this.text(this.characterNames.get(code), `character ${code}`);
    const quests = new Map(this.table('MainQuestTable').map((q) => [q.id, q.name_localkey]));
    const reqText = (g) => {
      if (g.trigger === 'ObtainCharacter') return charName(g.condition_id);
      if (g.trigger === 'MainQuestClear') return `clear main quest "${this.text(quests.get(g.condition_id), g.condition_id)}"`;
      if (g.trigger === 'CharacterAttractiveLevelMax') return `${charName(g.condition_id)}: bond condition "AttractiveLevelMax" ${g.condition_value}`; // meaning of the 10 unclear (bond goes to 40), so shown raw
      return `${g.trigger} ${g.condition_id}`;
    };
    // Favorite item stories: FavoriteItemQuestTable.end_scenario_id (treasurestory_*) per quest,
    // with the Nikke (name_code) and the quest's name.
    this.characterRes = new Map();
    for (const c of this.table('Character/CharacterTable')) if (!this.characterRes.has(c.name_code)) this.characterRes.set(c.name_code, c.resource_id);
    this.favoriteIcon = new Map(this.table('FavoriteItemTable').filter((f) => f.name_code).map((f) => [f.name_code, f.icon_resource_id]));
    this.favorite = new Map(); // scene id (lowercase) -> { nameCode, quest }
    for (const q of this.table('FavoriteItemQuestTable')) {
      if (q.end_scenario_id) this.favorite.set(q.end_scenario_id.toLowerCase(), { nameCode: q.name_code, quest: q.name_localkey });
    }

    const albumBySub = new Map(this.table('AlbumInfoTable').map((a) => [a.sub_category_id, a]));
    this.outpost = new Map(); // scene id (lowercase) -> { building, needs, featured, stamina, reward }
    for (const o of this.table('OutpostConditionTriggerTable')) {
      const info = {
        building: (this.text(`Locale_Outpost:1000_${o.tid}_name`, '') || `Building ${o.tid}`).replace(/\s+Lv\.\s*\d+$/, ''),
        buildingId: o.tid,
        // Building picture: AlbumInfoTable row for the building (sub_category_id = tid).
        img: (() => { const a = art('icons-album', albumBySub.get(o.tid)?.sub_category_thumbnail); return a ? `icons-album/${a}` : null; })(),
        needs: o.trigger_list.filter((g) => g.trigger && g.trigger !== 'None').map(reqText),
        featured: o.resource_id ? charName(o.resource_id) : null,
        stamina: o.stamina_value,
        reward: o.reward_id || null,
      };
      for (const id of [o.enter_scenario_id, o.exit_scenario_id]) if (id) this.outpost.set(id.toLowerCase(), info);
    }

    // Speaker ids map to a character name key; ids sharing a key (marian,
    // marian_p, marian_event_01...) fall back to the shortest id as display name.
    this.speakers = new Map();
    this.speakerIcons = new Map();
    const shortestByKey = new Map();
    for (const c of this.table('ScenarioCharacterSettingTable')) {
      this.speakers.set(c.id.toLowerCase(), c.name_localkey);
      // Small character icon (icons-char si_cNNN_XX_s): the costume of the standing art
      // ("spine/standing/c260/01_HD"), else the character's default look.
      const standing = String(c.address || '').match(/standing\/(c\d+)\/(\d+)/i);
      const res = `c${String(c.resource_id).padStart(3, '0')}`;
      const icon = (standing && art('icons-char', `si_${standing[1]}_${standing[2]}_s`)) || art('icons-char', `si_${res}_00_s`);
      if (icon) this.speakerIcons.set(c.id.toLowerCase(), icon);
      const prev = shortestByKey.get(c.name_localkey);
      if (!prev || c.id.length < prev.length) shortestByKey.set(c.name_localkey, c.id);
    }
    this.speakerFallback = shortestByKey;
  }

  // Unlock notes for the reader header (outpost stories).
  sceneNotes(id) {
    const f = this.favorite.get(id.toLowerCase());
    if (f) return [`Favorite item quest step: ${this.text(f.quest, f.quest)}`];
    const o = this.outpost.get(id.toLowerCase());
    if (!o) return undefined;
    const reward = o.reward && this.rewardText?.(o.reward);
    return [`Unlock: ${o.needs.join(' · ') || '—'}`,
      [o.featured && `Featuring ${o.featured}`, o.stamina && `${o.stamina} stamina`, reward && `Reward: ${reward}`].filter(Boolean).join(' · ')].filter(Boolean);
  }

  speakerName(id) {
    if (!id) return null;
    if (id === 'Self') return 'Commander';
    const key = this.speakers.get(id.toLowerCase());
    if (!key) return titleCase(id);
    return this.text(key, titleCase(this.speakerFallback.get(key) || id));
  }

  titleKey(id) {
    const lower = id.toLowerCase();
    const candidates = [this.albumNames.get(lower), this.counselNames.get(lower), this.titleKeys.get(`${lower}_title`)];
    const half = lower.match(/^(.*)_(s|e)$/); // event "_s"/"_e" halves use "_title_a"/"_title_b"
    if (half) candidates.push(this.titleKeys.get(`${half[1]}_title_${half[2] === 's' ? 'a' : 'b'}`));
    return candidates.find((k) => k && this.locale.has(k));
  }

  sceneLabel(scene) {
    const { id, cat } = scene;
    const key = this.titleKey(id);
    // Main-story stage name ("0-1 STAGE") is kept as extra context for the reader header.
    const stage = cat === 'main' ? this.stageNames.get(id) : null;
    const stageLabel = stage ? `${this.text(stage.key, '')} · ${stage.phase}`.replace(/^ · /, '') : null;
    if (key) return { label: this.locale.get(key), key, stage: stageLabel };
    return { label: stageLabel || id.replace(/^d_main_/, ''), key: stage?.key };
  }

  groupFor(scene) {
    const { id, cat } = scene;
    switch (cat) {
      case 'main': {
        const n = Number(id.match(/^d_main_(\d+)/)?.[1] ?? 0);
        const key = this.chapterNames.get(n);
        const name = this.text(key, null);
        return { id: `ch${n}`, order: n, label: `Chapter ${n}${name ? ` · ${name}` : ''}`, key };
      }
      case 'event': {
        // Scenes without an event id are unrelated minigame/test dialog: group by name.
        if (!scene.eventId) {
          const g = id.toLowerCase().replace(/^event_/, '').split('_')[0];
          return { id: `ev0_${g}`, order: 1e9, label: `${titleCase(g)} (unlinked)` };
        }
        return { id: `ev${scene.eventId}`, order: scene.eventId, label: null, eventId: scene.eventId };
      }
      case 'side': {
        const n = Number(id.match(/^s(\d+)/)?.[1] ?? 0);
        const key = this.sideStoryNames.get(n);
        return { id: `side${n}`, order: n || 999, label: this.text(key, n ? `Side Story ${n}` : 'Other'), key };
      }
      case 'bond':
      case 'counsel': {
        // Treasure stories and a few costumes have no table link: match by name
        // ("treasurestory_julia_02" -> Julia, "d_counseling_drake_villain_01" -> Drake: Villain).
        const slug = stripIndex(id.toLowerCase().replace(/_[se]$/, '')).replace(/^(d_nikke_|d_counseling_|treasurestory_)/, '');
        const code = this.sceneCharacter.get(id.toLowerCase())
          ?? this.characterByName.get(slugKey(slug)) ?? this.characterByName.get(slugKey(slug.split('_')[0]));
        const name = this.text(this.characterNames.get(code), null);
        if (name) return { id: `char${code}`, label: name };
        return { id: slug, label: titleCase(slug) };
      }
      case 'favorite': {
        // Treasure stories missing from the quest table: the Nikke by name ("treasurestory_julia_02").
        const f = this.favorite.get(id.toLowerCase()) || { nameCode: this.characterByName.get(slugKey(id.toLowerCase().replace(/^treasurestory_/, '').split('_')[0])) };
        const name = this.text(this.characterNames.get(f.nameCode), titleCase(id.replace(/^treasurestory_/i, '').split('_')[0]));
        // The Nikke's favorite item icon (icons-favoriteitem si_favoriteitem_*), else her own icon.
        const item = art('icons-favoriteitem', this.favoriteIcon.get(f.nameCode));
        const res = this.characterRes.get(f.nameCode);
        const icon = res != null && art('icons-char', `si_c${String(res).padStart(3, '0')}_00_s`);
        return { id: `fav${f.nameCode}`, label: name, img: item ? `icons-favoriteitem/${item}` : icon ? `icons-char/${icon}` : null };
      }
      case 'outpost': {
        const out = this.outpost.get(id.toLowerCase());
        return { id: `outpost${out.buildingId}`, order: out.buildingId, label: out.building, img: out.img }; // game's building order
      }
      default: {
        const g = stripIndex(id);
        return { id: g, label: titleCase(g.replace(/^d_/, '').replace(/^ex_/, 'Ex · ')) };
      }
    }
  }

  buildCatalogue() {
    const cats = new Map(CATEGORIES.map((c) => [c.id, { ...c, groups: new Map() }]));
    for (const scene of this.scenes.values()) {
      const g = this.groupFor(scene);
      const groups = cats.get(scene.cat).groups;
      if (!groups.has(g.id)) groups.set(g.id, { ...g, scenes: [] });
      const { label, key, stage } = this.sceneLabel(scene);
      scene.group = g.id;
      const out = this.outpost.get(scene.id.toLowerCase());
      groups.get(g.id).scenes.push({ id: scene.id, label, key, stage, lines: scene.lines, needs: out ? `Needs ${out.needs.join(', ')}` : undefined });
    }
    const out = [];
    for (const cat of cats.values()) {
      const groups = [...cat.groups.values()];
      for (const g of groups) {
        g.scenes.sort((a, b) => this.compareScenes(a.id, b.id));
        if (!g.label) Object.assign(g, this.eventLabel(g));
        if (g.eventId && this.eventInfo.get(g.eventId)?.img) g.img = `icons-event_bg/${this.eventInfo.get(g.eventId).img}`;
      }
      // Reruns and archive copies share a name with the original: tell them apart by id.
      const seen = new Map();
      for (const g of groups) seen.set(g.label, (seen.get(g.label) || 0) + 1);
      for (const g of groups) if (g.eventId && seen.get(g.label) > 1) g.label += ` · #${g.eventId}`;
      groups.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.label.localeCompare(b.label));
      out.push({ id: cat.id, label: cat.label, groups });
    }
    return out;
  }

  // Request stories (d_subquest_*): one group per requester, "Request · <name>", instead of one
  // group per scene half. The requester comes from requesterOf(sceneId) (the Messenger chat of
  // the same id, lib/messenger.js), else from a title like "Raptilion's Request I: …".
  groupRequests(requesterOf) {
    const cat = this.catalogue.find((c) => c.id === 'sub');
    const isReq = (g) => /subquest/i.test(g.id);
    const scenes = cat.groups.filter(isReq).flatMap((g) => g.scenes);
    const groups = new Map();
    for (const sc of scenes) {
      const who = requesterOf(sc.id) || (sc.key && this.locale.get(sc.key)?.match(/^(.+?)'s Request\b/i) ? { name: this.locale.get(sc.key).match(/^(.+?)'s Request\b/i)[1] } : null);
      const name = who?.name || 'Unknown requester';
      const id = `req_${slugKey(name)}`;
      if (!groups.has(id)) groups.set(id, { id, label: `Request · ${name}`, scenes: [] });
      if (!sc.key) {
        const m = sc.id.match(/subquest_(\d+)(?:_(\d+))?(?:_([se]))?$/i);
        sc.label = m ? `Request ${m[1]}${m[2] ? `-${Number(m[2])}` : ''}${m[3] ? ` · ${m[3].toLowerCase() === 's' ? 'Start' : 'End'}` : ''}` : sc.label;
      }
      if (/^re_/i.test(sc.id)) sc.label += ' (rerun)';
      groups.get(id).scenes.push(sc);
      this.scenes.get(sc.id).group = id;
    }
    for (const g of groups.values()) g.scenes.sort((a, b) => this.compareScenes(a.id, b.id));
    cat.groups = [...[...groups.values()].sort((a, b) => a.label.localeCompare(b.label)), ...cat.groups.filter((g) => !isReq(g))];
    return groups.size;
  }

  // Game order from the Group.csv lists; scenes missing from them fall back to natural order.
  compareScenes(a, b) {
    const ia = this.gameOrder.get(a.toLowerCase());
    const ib = this.gameOrder.get(b.toLowerCase());
    if (ia != null && ib != null) return ia - ib;
    if (ia != null || ib != null) return ia != null ? -1 : 1;
    return naturalCompare(a, b);
  }

  eventLabel(g) {
    const info = this.eventInfo.get(g.eventId) || { slugs: [] };
    const rawPrefix = commonPrefix(g.scenes.map((s) => s.id));
    const prefix = rawPrefix.replace(/^(re_)?(event_)?/i, '');
    const slugs = [...info.slugs, prefix].filter((s) => s && s !== '0');
    // Unused name keys and banner ids also point at the first event, "No Caller ID":
    // only accept that name when the scenes really belong to it.
    const isReal = (name) => slugKey(name) !== 'nocallerid' || slugKey(prefix).startsWith('nocallerid');
    const named = info.nameKey && this.locale.get(info.nameKey);
    if (named && isReal(named)) return { label: named, key: info.nameKey };
    const part = slugs.map((s) => s.match(/_part(\d+)$/i)?.[1]).find(Boolean)?.replace(/^0+/, '');
    const rerun = /^re_/i.test(rawPrefix) ? ' · Rerun' : '';
    const suffix = (part ? ` · Part ${part}` : '') + rerun;
    for (const slug of slugs) {
      const name = this.rewardEventNames.get(slugKey(slug)) || this.rewardEventNames.get(slugKey(slug.replace(/_?part\d+$/i, '')));
      if (name && isReal(name)) return { label: name + suffix };
    }
    // Collab events (ce_01, ce002...) have no name anywhere in the locale.
    const collab = slugs.map((s) => s.match(/^ce_?0*(\d+)/i)?.[1]).find(Boolean);
    if (collab) return { label: `Collab ${collab.padStart(2, '0')}${suffix}` };
    return { label: titleCase((prefix || slugs[0] || `event ${g.eventId}`).replace(/^d_contents_/i, '')) + suffix };
  }

  scene(id) {
    const meta = this.scenes.get(id);
    if (!meta) return null;
    if (this.cache.has(id)) return this.cache.get(id);
    const records = readRecords(meta.file);
    const speakers = {};
    const icons = {};
    const lines = records.map((r) => {
      if (r.speaker && !(r.speaker in speakers)) {
        speakers[r.speaker] = this.speakerName(r.speaker);
        const icon = this.speakerIcons.get(r.speaker.toLowerCase());
        if (icon) icons[r.speaker] = icon;
      }
      const shown = (r.characters || []).map((c) => c.show_char_id).filter(Boolean);
      return {
        id: r.id,
        type: r.speech_window,
        speaker: r.speaker || null,
        key: r.scenario_localkey || null,
        text: this.locale.get(r.scenario_localkey) ?? null,
        jump: r.jump_target || null,
        exit: !!r.is_exit_scenario,
        enter: r.choice_enter_scenario_group_id || null,
        bg: r.set_background || null,
        bgArt: art('scenariobackground', r.set_background),
        image: r.set_image || null,
        bgm: r.play_bgm || null,
        movie: r.play_movie || null,
        shown: shown.length ? shown : null,
        affinity: r.attractive_point || null,
      };
    });
    const group = this.catalogue.find((c) => c.id === meta.cat).groups.find((g) => g.id === meta.group);
    const idx = group.scenes.findIndex((s) => s.id === id);
    const result = {
      id,
      cat: meta.cat,
      group: { id: group.id, label: group.label },
      label: group.scenes[idx].label,
      stage: group.scenes[idx].stage ?? null,
      prev: group.scenes[idx - 1]?.id ?? null,
      next: group.scenes[idx + 1]?.id ?? null,
      speakers,
      icons, // speaker -> icons-char sprite
      notes: this.sceneNotes(id),
      lines,
    };
    this.cache.set(id, result);
    if (this.cache.size > 50) this.cache.delete(this.cache.keys().next().value);
    return result;
  }
}

const slugKey = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');

function commonPrefix(ids) {
  if (!ids.length) return '';
  let p = ids[0];
  for (const id of ids) while (!id.startsWith(p)) p = p.slice(0, -1);
  return p.replace(/[_\d]+$/, '');
}

module.exports = { StoryLibrary };
