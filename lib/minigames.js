// Minigames. Tracing the Stars (the EventTTS* tables): a rhythm game with
// songs grouped into albums, four difficulties, missions and cosmetic skins.
const fs = require('fs');
const path = require('path');

function readRecords(file) {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(json) ? json : json.records || [];
}

const DIFFICULTIES = ['Casual', 'Normal', 'Hard', 'Expert'];

// Dates are .NET DateTime binaries stored as json-bigint numbers ({ s, e, c }):
// c holds the digits in 14-digit chunks, the low 62 bits are ticks since 0001-01-01.
// 1999-01-01 is used as "no date" (always available).
function decodeDate(o) {
  if (!o?.c) return null;
  const digits = o.c.map((x, i) => (i ? String(x).padStart(14, '0') : String(x))).join('');
  const ticks = BigInt(digits) & ((1n << 62n) - 1n);
  const iso = new Date(Number((ticks - 621355968000000000n) / 10000n)).toISOString();
  return iso.startsWith('1999-01-01') ? null : iso;
}

// Double fields are written by the parser as the raw 64-bit pattern (json-bigint
// { s, e, c } or a plain number); reinterpret the bits as an IEEE-754 double.
function decodeDouble(o) {
  if (o == null) return 0;
  const bits = typeof o === 'object'
    ? BigInt(o.c.map((x, i) => (i ? String(x).padStart(14, '0') : String(x))).join('')) * (o.s < 0 ? -1n : 1n)
    : BigInt(o);
  const buf = Buffer.alloc(8);
  buf.writeBigInt64LE(bits);
  return buf.readDoubleLE(0);
}

class MinigameLibrary {
  constructor(dataDir, locale, { stories, stages, bgm }) {
    this.dataDir = dataDir;
    this.locale = locale;
    this.stories = stories;
    this.stages = stages; // reward names
    this.bgm = bgm;       // jukebox cross-links
  }

  table(name) {
    const file = path.join(this.dataDir, `${name}.json`);
    return fs.existsSync(file) ? readRecords(file) : [];
  }

  text(key, fallback = null) {
    return (key && this.locale.get(key)) || fallback;
  }

  build() {
    const manager = this.table('EventTTSManagerTable')[0] || {};
    const maxScores = new Map(this.table('EventTTSMaxScoreTable').map((m) => [`${m.song_id}:${m.pattern_type}`, m.max_score]));
    const shop = new Map(this.table('TTSAlbumShopTable').map((s) => [s.song_group_id, s]));

    // Jukebox tracks with the same title, for a cross-link from the song page.
    const jukebox = new Map();
    for (const a of this.bgm.albums) for (const t of a.tracks) {
      if (!jukebox.has(t.name.toLowerCase())) jukebox.set(t.name.toLowerCase(), { album: a.id, albumName: a.name });
    }

    const allSongs = this.table('EventTTSSongManagerTable');
    // Missions can name songs that are hidden from the song list.
    const songName = new Map(allSongs.map((s) => [s.id, s.name_locale]));
    this.songs = allSongs.filter((s) => s.show_list).map((s) => ({
      id: s.id,
      name: s.name_locale,
      artist: s.artist_locale,
      album: s.group_id,
      tags: s.tag,
      levels: DIFFICULTIES.map((d) => ({
        difficulty: d,
        level: s[`${d.toLowerCase()}_level`],
        ratio: s[`${d.toLowerCase()}_ratio`] ?? null,
        maxScore: maxScores.get(`${s.id}:${d}`) ?? null,
      })),
      unlock: {
        playCount: s.unlock_condition_playcount || 0,
        date: decodeDate(s.unlock_condition_date),
      },
      jukebox: jukebox.get(s.name_locale.toLowerCase()) || null,
    }));

    this.albums = this.table('EventTTSSongGroupManagerTable').map((g) => ({
      id: g.id,
      name: this.text(g.name_locale, g.desc),
      basic: g.basic_music_group,
      release: decodeDate(g.release_date),
      shop: shop.has(g.id) ? this.text(shop.get(g.id).name_localkey, null) : null,
      songs: this.songs.filter((s) => s.album === g.id).map((s) => s.id),
    })).filter((a) => a.songs.length || a.shop);

    this.skins = this.table('EventTTSSkinObjectTable').sort((a, b) => a.order - b.order).map((k) => ({
      id: k.id,
      type: k.skin_object_type,
      name: this.text(k.name_localkey, String(k.id)),
      description: this.text(k.description_localkey, ''),
      free: k.is_free,
      cost: k.is_free ? null : { name: this.stages.rewardName('Currency', k.cost_currency_id), amount: k.cost_currency_value },
      release: decodeDate(k.release_date),
    }));
    const skinName = new Map(this.skins.map((k) => [k.id, k.name]));

    // Mission text slots: song or skin ids for two types, plain numbers otherwise.
    const fill = (m) => {
      const v = m.mission_value;
      const slot = (i) => {
        if (i === 0 && m.mission_type === 'SpecificMusicPlayCount') return songName.get(v[0]) || `song #${v[0]} (not in song table)`;
        if (i === 0 && m.mission_type === 'AnyMusicPlayCountWithSkinObject') return skinName.get(v[0]) || `skin ${v[0]}`;
        return v[i] != null ? Number(v[i]).toLocaleString('en-US') : `{${i}}`;
      };
      return this.text(m.desc_locale, m.desc).replace(/\{(\d+)\}/g, (s, i) => slot(Number(i)));
    };
    this.missions = this.table('EventTTSMissionTable').map((m) => ({
      id: m.id,
      name: this.text(m.name_locale, m.desc),
      description: fill(m),
      limited: m.open_type === 'Limited',
      start: decodeDate(m.start_date),
      end: decodeDate(m.end_date),
      reward: this.stages.rewardInfo(m.reward_id),
    }));

    const intro = manager.enter_scenario && this.stories.scenes.get(manager.enter_scenario);
    this.tts = {
      id: 'tts',
      name: 'Tracing the Stars',
      intro: intro ? { id: manager.enter_scenario, label: this.stories.sceneLabel(intro).label } : null,
      laneSpeeds: manager.lane_speed_option_value || [],
      tips: this.table('EventTTSTipLocaleTable').map((t) => this.text(t.tip_locale)).filter(Boolean),
      albums: this.albums,
      songs: this.songs,
      missionCount: this.missions.length,
      skinCount: this.skins.length,
      // Rating = level + a + (b - a) * (score - min) / (max - min); S+ has no max (runs to the song's max score).
      rankBands: this.table('EventTTSRankCalcSettingsTable').map((r) => ({
        grade: r.desc, min: r.min, max: r.max < 0 ? null : r.max, a: decodeDouble(r.calc_value_a), b: decodeDouble(r.calc_value_b),
      })).sort((x, y) => y.min - x.min),
    };
    console.log(`Indexed Tracing the Stars: ${this.songs.length} songs, ${this.missions.length} missions, ${this.skins.length} skins`);
    this.buildDiceTrack();
    this.buildTextAdventure();
    this.buildSdLobby();
  }

  // Event names in EventManagerTable are placeholders; the help popup carries the real title.
  sysText(key, fallback) {
    return this.text(`Locale_System:${key}`, fallback);
  }

  // Dice Track (VOLT TRIP): a looping board of slots linked by next_slot_id.
  buildDiceTrack() {
    const managers = this.table('EventDiceTrackManagerTable');
    if (!managers.length) { this.diceTrack = null; return; }
    const board = this.table('EventDiceTrackBoardTable');
    const slotText = this.table('EventDiceTrackLocaleTable');
    const randoms = this.table('EventDiceTrackRandomRewardTable');
    const reward = (id) => (id ? this.stages.rewardInfo(id) : null);
    this.diceTrack = managers.map((m) => {
      const slots = board.filter((b) => b.group_id === m.board_id);
      const bySlot = new Map(slots.map((b) => [b.slot_id, b]));
      // Walk the loop from the Start square.
      const order = [];
      for (let cur = slots.find((b) => b.event_type === 'Start'); cur && order.length < slots.length; cur = bySlot.get(cur.next_slot_id)) order.push(cur);
      const describe = (b) => {
        // Random squares have two kinds (standard/premium); match by slot_value when given.
        const t = slotText.filter((x) => x.group_id === m.board_id && x.slot_type === b.event_type);
        const pick = t.find((x) => x.slot_value === b.random_id) || t[0];
        return {
          name: this.text(pick?.name_localkey, b.event_type),
          effect: this.text(pick?.description_localkey, '').replace('{0}', b.function_value),
        };
      };
      return {
        id: m.id,
        name: this.sysText('HELP_DICETRACK_TITLE', 'Dice Track').replace(/^About\s+/i, ''),
        intro: this.sysText('HELP_DICETRACK_01_01', ''),
        dice: this.stages.rewardName('Item', m.event_item_id),
        specialDice: m.event_special_item_id ? this.stages.rewardName('Item', m.event_special_item_id) : null,
        dailyDice: m.daily_reward_value,
        slots: order.map((b, i) => ({
          step: i,
          type: b.event_type,
          ...describe(b),
          value: b.function_value || null,
          reward: reward(b.reward_id),
          pool: b.random_id ? randoms.filter((r) => r.group_id === b.random_id).map((r, _, all) => ({
            chance: 100 * r.reward_weight / all.reduce((s, x) => s + x.reward_weight, 0),
            reward: reward(r.reward_id),
          })) : null,
        })),
        lapRewards: this.table('EventDiceTrackFinishRewardTable').filter((f) => f.group_id === m.board_id)
          .sort((a, b) => a.clear_times - b.clear_times)
          .map((f) => ({ laps: f.clear_times, repeat: f.is_repeat, reward: reward(f.reward_id) })),
        missions: this.table('EventDiceTrackMissionTable').filter((x) => x.group_id === m.mission_group_id)
          .sort((a, b) => a.order - b.order)
          .map((x) => ({
            description: this.text(x.description_localkey, x.mission_condition).replace('{mission_condition_value}', x.mission_condition_value),
            reward: reward(x.reward_id),
          })),
      };
    });
    console.log(`Indexed ${this.diceTrack.length} Dice Track event(s)`);
  }

  // Text Adventure Plus (Fading Affection): routes of pages with choices that change
  // HP / food / corruption, loot items that unlock choices, and numbered endings.
  buildTextAdventure() {
    const managers = this.table('EventTextAdvPlusManagerTable');
    if (!managers.length) { this.textAdventure = null; return; }
    const allPages = this.table('EventTextAdvPlusEventPageTable');
    const allOptions = this.table('EventTextAdvPlusSelectOptionTable');
    const t = (k) => this.text(k, '');
    this.textAdventure = managers.map((m) => {
      const options = allOptions.filter((o) => o.manager_id === m.id);
      const pages = {};
      for (const p of allPages.filter((x) => x.manager_id === m.id)) {
        pages[p.id] = {
          id: p.id,
          route: p.route_id,
          type: p.page_type,
          text: t(p.scenario_localkey),
          next: p.next_page_id || null,
          toFirstSelect: p.is_go_to_first_select_page,
          loot: p.get_loot_item_id || null,
          bgm: p.play_bgm || null,
          ending: p.ending_type !== 'None' ? {
            type: p.ending_type, num: p.ending_num, title: t(p.ending_sub_title_localkey), hint: t(p.ending_hint_localkey),
          } : null,
          options: options.filter((o) => o.group_id === p.select_option_group_id && p.select_option_group_id).map((o) => ({
            id: o.id,
            text: t(o.selection_localkey),
            condition: o.open_condition_type !== 'None' ? {
              type: o.open_condition_type, value: o.open_condition_value, hint: t(o.open_condition_hint_localkey) || null,
            } : null,
            hidden: o.is_hidden,
            hp: o.hp_change, food: o.food_change, erosion: o.erosion_change,
            page: o.page_id || null, deathPage: o.death_page_id || null, erosionPage: o.erosion_page_id || null,
          })),
        };
      }
      const routeEndings = (routeId) => Object.values(pages).filter((p) => p.route === routeId && p.ending)
        .map((p) => ({ page: p.id, ...p.ending })).sort((a, b) => a.num - b.num);
      const firstSelects = this.table('EventTextAdvPlusFirstSelectTable').filter((f) => f.manager_id === m.id);
      const progress = this.table('EventTextAdvPlusProgressRewardTable').filter((r) => r.manager_id === m.id);
      const intro = this.stories.scenes.get(m.first_enter_scenario_group_id);
      return {
        id: m.id,
        name: t('Locale_Event:fadingaffection_tutorial_title_01') || 'Text Adventure',
        intro: intro ? { id: m.first_enter_scenario_group_id, label: this.stories.sceneLabel(intro).label } : null,
        stats: {
          hp: { name: t(m.status_hp_name) || 'HP', max: m.status_hp_max, start: m.status_hp_default },
          food: { name: t(m.status_food_name) || 'Food', start: m.status_food_default },
          erosion: { name: t(m.status_erosion_name) || 'Corruption', max: m.status_erosion_max, threshold: m.status_erosion_enter_point },
        },
        routes: this.table('EventTextAdvPlusRouteTable').filter((r) => r.manager_id === m.id).sort((a, b) => a.route_order - b.route_order).map((r) => ({
          id: r.id,
          name: t(r.route_name_localkey),
          description: t(r.route_description_localkey),
          unlock: r.route_unlock_type !== 'None' ? { type: r.route_unlock_type, value: r.route_unlock_value } : null,
          corruption: r.is_erosion_status_on,
          startCorruption: r.status_erosion_default,
          firstSelects: firstSelects.filter((f) => f.route_id === r.id).map((f) => ({
            id: f.id, text: t(f.first_select_localkey), description: t(f.first_select_description_localkey),
            page: f.next_page_id, needsItem: f.item_condition || null, needsEnding: f.ending_condition || null,
          })),
          endings: routeEndings(r.id),
          progressRewards: progress.filter((x) => x.route_id === r.id).sort((a, b) => a.order - b.order)
            .map((x) => ({ goal: x.reward_goal, reward: this.stages.rewardInfo(x.reward_id) })),
        })),
        // A memory belongs to the route whose pages grant it.
        items: this.table('EventTextAdvPlusLootItemTable').filter((x) => x.manager_id === m.id).map((x) => ({
          id: x.id, name: t(x.item_name_localkey), description: t(x.item_description_localkey),
          route: Object.values(pages).find((p) => p.loot === x.id)?.route ?? null,
        })),
        pages,
      };
    });
    console.log(`Indexed ${this.textAdventure.length} Text Adventure Plus event(s)`);
  }

  // SD lobby decorations, with their BGM and animated cinematics.
  buildSdLobby() {
    const bgm = new Map(this.table('SDLobbyBGMTable').map((b) => [b.id, b]));
    const timelines = this.table('LobbyCinematicTimelineTable');
    const controls = this.table('LobbyCinematicTimelineControlTable');
    this.sdLobby = this.table('SDLobbyTable').sort((a, b) => a.order - b.order).map((l) => {
      const b = bgm.get(l.default_bgm_id) || {};
      return {
        id: l.id,
        name: this.text(l.name_localkey, l.sd_lobby_resource_id),
        description: this.text(l.description_localkey, ''),
        shop: this.text(l.shop_desc_localkey, ''),
        secret: l.is_secret,
        resource: l.sd_lobby_art_map,
        bgm: { ambient: b.ambient_idle || null, idle: b.bgm_idle || null, touch: b.bgm_touch || null },
        cinematics: timelines.filter((x) => x.sd_lobby_resource_id === l.sd_lobby_resource_id).map((x) => ({
          asset: x.timeline_asset,
          steps: controls.filter((c) => c.cinematic_timeline_id === x.id).map((c) => ({
            trigger: c.timeline_start_condition_type, loop: c.is_loop_action, touch: c.touch_input,
          })),
        })),
      };
    });
    console.log(`Indexed ${this.sdLobby.length} SD lobbies`);
  }
}

module.exports = { MinigameLibrary };
