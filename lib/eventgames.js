// The other event minigames: every game whose tables are named Event<Game>*. Each game is
// shown as its tables, with locale keys turned into text, icons-event sprite names into
// images, reward ids into rewards and story ids into links. Tracing the Stars, VOLT TRIP and
// Fading Affection have their own pages (minigames.js) and are not repeated here.
//
// A game can also have a viewer, lib/eventgames/<id>.js, that reads its rules out of the
// tables and returns pages for the front end (see eventgames/README.md for the format).
const fs = require('fs');
const path = require('path');
const { art } = require('./art');

// id, name, table prefix(es) after "Event", and the icons-event folder the art comes from.
const GAMES = [
  ['bbqmaster', 'BBQ Master', ['BBQTycoon'], '01_bbqmaster'],
  ['whitememory', 'White Memory (Text Adventure)', ['TextAdventure'], '01_whitememory'],
  ['heroroad', 'Hero Road (Dice)', ['Dice'], '01_laplace'],
  ['piratecafe', 'Pirate Cafe', ['PirateCafe'], '02_pirate_cafe'],
  ['ce002', 'Hacking Game (CE002)', ['CE002MiniGame'], 'ce002'],
  ['redash', 'Memory of Goddess (NKS)', ['NKS'], '24_redash'],
  ['neverland', 'Snowfall Oasis (Dating Sim)', ['DatingSim'], '27_neverland'],
  ['dessertrush', 'Dessert Rush', ['DessertRush'], '31_perfectmaid'],
  ['ce003', 'Serving Game (CE003)', ['CE003MiniGame'], 'ce003'],
  ['lastkingdom', 'Tower Defense (Last Kingdom)', ['TowerDefense'], '37_lastkingdom'],
  ['playsoda', "Let's Play Soda", ['PlaySoda', 'CatchCoin', 'Climbing', 'Running', 'Smash', 'StackUp'], '39_goldcoinrush'],
  ['ce004', 'Defense Game (CE004)', ['CE004MiniGame'], 'ce004'],
  ['oldtales', 'In The Mirror', ['MVG', 'QuestMVG'], '48_oldtales'],
  ['icedragon', 'Dragon Dungeon Run', ['DragonDungeonRun'], '50_icedragonsaga'],
  ['bubblemarch', 'Bubble March', ['BubbleMarch'], '54_bubblemarch'],
  ['ce006', 'Naytiba Raid (CE006)', ['SB', 'CanCollect'], 'ce006'],
  ['boomtheghost', 'Boom the Ghost', ['BTG'], '64_boomtheghost'],
  ['coinsinrush', 'Rope Running', ['RopeRunning'], '66_coinsinrush'],
  ['goddessfall', 'Rebuild Eden', ['RebuildEden'], '69_goddessfall'],
  ['terminusticket', 'AZX Service Time', ['AZXAppleGame'], '71_terminusticket'],
  ['ce007', 'Salvation Breakers (CE007)', ['BH'], 'ce007'],
  ['staranis', 'Merch Bag', ['Itabag'], '78_staranis'],
  ['arkranger', 'Fight! Ark Ranger', ['FAR'], '82_arkranger'],
  ['ce008', 'Lyco Reco Beats (CE008)', ['LycorisMiniGame'], null],
  ['wavetoyou', 'Island Breaker', ['IslandBreaker'], '83_wavetoyou'],
  ['ce009', 'Mini Game (CE009)', ['CE009MiniGame'], 'ce009'],
  ['coinrushshowdown', 'Three Company Rumble', ['Punch'], '87_coinrushshowdown'],
  ['eva', 'EVANGELION: RedSea Scout', ['EvaMiniGame'], null],
  ['gachaboard', '5x5 Supplies', ['GachaBoard'], null],
  ['sortout', 'Gift Factory', ['SortOut'], null],
  ['boxgacha', 'Costume Gacha', ['BoxGacha'], null],
];

function readRecords(file) {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(json) ? json : json.records || [];
}

// json-bigint { s, e, c }: c holds the digits in 14-digit chunks.
const bigDigits = (o) => o.c.map((x, i) => (i ? String(x).padStart(14, '0') : String(x))).join('');

// "skill_icon_resource" -> "Skill icon resource"
// Double fields: the raw 64-bit pattern (json-bigint { s, e, c } or a number) as an IEEE-754 double.
function decodeDouble(o) {
  if (o == null) return 0;
  const bits = typeof o === 'object' ? BigInt(bigDigits(o)) * (o.s < 0 ? -1n : 1n) : BigInt(o);
  const buf = Buffer.alloc(8);
  buf.writeBigInt64LE(bits);
  return buf.readDoubleLE(0);
}

const label = (key) => key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

class EventGameLibrary {
  constructor(dataDir, locale, { stories, stages, minigames }) {
    this.dataDir = dataDir;
    this.locale = locale;
    this.stories = stories;
    this.stages = stages;
    this.minigames = minigames; // help tips
  }

  build() {
    const files = fs.readdirSync(this.dataDir).filter((f) => /^Event\w+Table\.json$/.test(f));
    const prefixes = GAMES.flatMap(([, , ps]) => ps);
    // A table belongs to the longest prefix it starts with (QuestMVG, not MVG).
    const owner = (f) => prefixes.filter((p) => f.startsWith(`Event${p}`)).sort((a, b) => b.length - a.length)[0];
    this.games = new Map();
    for (const [id, name, ps, folder] of GAMES) {
      const tables = files.filter((f) => ps.includes(owner(f)) && !f.startsWith('EventDiceTrack'))
        .map((f) => this.tableView(f.replace(/\.json$/, ''), ps))
        .filter((t) => t.rows.length)
        .sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));
      if (!tables.length) continue;
      const manager = tables.find((t) => /Manager$/.test(t.name));
      const raw = manager ? readRecords(path.join(this.dataDir, `${manager.table}.json`))[0] || {} : {};
      const hub = raw.helptip_hub_group || raw.helptip || 0;
      const scene = raw.enter_scenario || raw.first_enter_scenario_group_id;
      const intro = scene && this.stories.scenes.get(scene);
      const game = {
        id, name, folder,
        intro: intro ? { id: scene, label: this.stories.sceneLabel(intro).label } : null,
        help: hub ? this.minigames.helpTips(hub) : [],
        tables,
        view: null,
      };
      game.view = this.buildView(game);
      this.games.set(id, game);
    }
    console.log(`Indexed ${this.games.size} event minigames (${[...this.games.values()].reduce((n, g) => n + g.tables.length, 0)} tables)`);
  }

  // The game's viewer module, if it has one; a broken viewer only loses its pages.
  buildView(game) {
    const file = path.join(__dirname, 'eventgames', `${game.id}.js`);
    if (!fs.existsSync(file)) return null;
    try {
      const view = require(file).build(this.context(game));
      for (const p of view.pages || []) p.id = String(p.id);
      return view;
    } catch (e) {
      console.warn(`Event minigame viewer ${game.id} failed: ${e.stack}`);
      return null;
    }
  }

  // Helpers handed to a viewer.
  context(game) {
    const cache = new Map();
    const table = (name) => {
      const file = name.endsWith('Table') ? name : `${name}Table`;
      const full = file.startsWith('Event') || fs.existsSync(path.join(this.dataDir, `${file}.json`)) ? file : `Event${file}`;
      if (!cache.has(full)) {
        const p = path.join(this.dataDir, `${full}.json`);
        cache.set(full, fs.existsSync(p) ? readRecords(p) : []);
      }
      return cache.get(full);
    };
    const text = (key, fallback = '') => (key && this.locale.get(key)) || fallback;
    return {
      game: { id: game.id, name: game.name, folder: game.folder },
      table,
      text,
      // Unity rich text (<color=…>, <b>, <size=…>) removed.
      plain: (key, fallback = '') => text(key, fallback).replace(/<\/?(color|b|i|size|u)\b[^>]*>/g, ''),
      img: (name) => (name ? art('icons-event', name) : null),
      reward: (id) => (id ? this.stages.rewardInfo(id) : null),
      rewardName: (type, id) => this.stages.rewardName(type, id),
      scene: (id) => {
        const sc = id && this.stories.scenes.get(id);
        return sc ? { scene: id, label: this.stories.sceneLabel(sc).label } : null;
      },
      help: (hub) => this.minigames.helpTips(hub),
      intro: game.intro,
      date: (o) => {
        const v = this.cell('date', o);
        return typeof v === 'string' && /^\d{4}-/.test(v) ? v : null;
      },
      big: (o) => (o && typeof o === 'object' && o.c ? Number((o.s < 0 ? '-' : '') + bigDigits(o)) : Number(o || 0)),
      double: decodeDouble,
      cell: (key, v) => this.cell(key, v),
    };
  }

  // A viewer page: { game, title, sections }.
  page(id, pageId) {
    const g = this.games.get(id);
    const p = g?.view?.pages?.find((x) => x.id === pageId);
    return p ? { game: g.name, ...p } : null;
  }

  get list() {
    return [...this.games.values()].map((g) => ({ id: g.id, name: g.name, tables: g.tables.length }));
  }

  // A game's overview; the tables come one at a time (some have thousands of rows).
  game(id) {
    const g = this.games.get(id);
    if (!g) return null;
    const v = g.view;
    return {
      ...g,
      tables: g.tables.map((t) => ({ name: t.name, rows: t.rows.length })),
      view: v ? { summary: v.summary || '', overview: v.overview || [], pages: (v.pages || []).map((p) => ({ id: p.id, title: p.title, group: p.group || null, count: p.count ?? null })) } : null,
    };
  }

  table(id, name) {
    const g = this.games.get(id);
    const t = g?.tables.find((x) => x.name === name);
    return t ? { game: g.name, ...t } : null;
  }

  // Columns that say something (not empty / zero / false / "None" in every row), with
  // each value made readable. A cell is text, or { img }, { reward }, { scene, label }.
  tableView(table, prefixes) {
    const records = readRecords(path.join(this.dataDir, `${table}.json`));
    const keys = [...new Set(records.flatMap((r) => Object.keys(r)))];
    const rows = records.map((r) => Object.fromEntries(keys.map((k) => [k, this.cell(k, r[k])])));
    const cols = keys.filter((k) => k === 'id' || rows.some((r) => r[k] !== '' && r[k] !== 0));
    const prefix = prefixes.find((p) => table.startsWith(`Event${p}`));
    const rest = table.slice(`Event${prefix}`.length).replace(/Table$/, '');
    return {
      table,
      // Tables of a game's sub-games keep their prefix (CatchCoinStoryStage, QuestMVGLoading).
      name: prefix === prefixes[0] ? rest || 'Main' : prefix + rest,
      columns: cols.map((k) => ({ key: k, label: label(k) })),
      rows: rows.map((r) => cols.map((k) => r[k])),
    };
  }

  cell(key, v) {
    if (v == null || v === false || v === 'None') return '';
    if (v === true) return 'Yes';
    if (Array.isArray(v)) {
      const parts = v.map((x) => this.cell(key, x)).filter((x) => x !== '' && typeof x !== 'object');
      return parts.join(', ');
    }
    if (typeof v === 'object') {
      // Nested records ({ skill_type_01, skillvalue_01: [{ skill_value_01: 1 }, ...] }) as "Name: value" text.
      if (!v.c) {
        const parts = Object.entries(v).map(([k, x]) => [k, this.cell(k, x)]).filter(([, x]) => x !== '' && typeof x !== 'object');
        return parts.length === 1 && Object.keys(v).length === 1 ? String(parts[0][1]) : parts.map(([k, x]) => `${label(k)}: ${x}`).join('; ');
      }
      const digits = bigDigits(v);
      if (/date|time/i.test(key) && digits.length > 15) {
        const ticks = BigInt(digits) & ((1n << 62n) - 1n);
        const iso = new Date(Number((ticks - 621355968000000000n) / 10000n)).toISOString();
        return iso.startsWith('1999-01-01') ? '' : iso.slice(0, 16).replace('T', ' ');
      }
      return (v.s < 0 ? '-' : '') + digits;
    }
    if (typeof v === 'number') {
      if (v > 0 && /reward_id$|^reward_id|reward_group$/i.test(key)) {
        const reward = this.stages.rewardInfo(v);
        if (reward) return { reward };
      }
      return v;
    }
    if (v.startsWith('Locale_')) return this.locale.get(v) || v;
    const img = art('icons-event', v);
    if (img) return { img };
    const scene = this.stories.scenes.get(v);
    if (scene) return { scene: v, label: this.stories.sceneLabel(scene).label };
    return v;
  }
}

// Manager first, then missions and guides, then the rest by name.
function rank(name) {
  if (/Manager$/.test(name)) return 0;
  if (/Mission/.test(name)) return 1;
  if (/Tutorial|Help|Guide/.test(name)) return 2;
  return 3;
}

module.exports = { EventGameLibrary };
