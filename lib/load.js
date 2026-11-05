// Loads every library from config.json (shared by the server and the static export).
const fs = require('fs');
const path = require('path');
const { loadLocale } = require('./locale');
const { StoryLibrary } = require('./stories');
const { StageLibrary } = require('./stages');
const { BgmLibrary } = require('./bgm');
const { RaidLibrary } = require('./raids');
const { CharacterLibrary } = require('./characters');
const { MinigameLibrary } = require('./minigames');
const { EventGameLibrary } = require('./eventgames');
const { ProgressionLibrary } = require('./progression');
const { MonsterLibrary } = require('./monsters');
const { MapLibrary } = require('./maps');
const { MemorialLibrary } = require('./memorials');
const { MiscLibrary } = require('./misc');
const { MessengerLibrary } = require('./messenger');

function loadAll(root) {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'config.json'), 'utf8'));
  const locale = loadLocale(config.localeDir, config.language);
  console.log(config.localeDir ? `Loaded ${locale.size} locale strings` : 'No localeDir set — showing locale keys');
  const stories = new StoryLibrary(config.dataDir, locale, config.mpksDir);
  stories.build();
  const memorials = new MemorialLibrary(config, locale);
  memorials.build();
  stories.catalogue.push(memorials.category); // read like stories, served by memorials.scene()
  const stages = new StageLibrary(config, locale, stories);
  stages.build();
  // Outpost story rewards in the reader's unlock notes (stories loads before stages).
  stories.rewardText = (id) => stages.rewardInfo(id)?.items.map((x) => `${x.name} ×${x.amount}`).join(', ') || null;
  const messenger = new MessengerLibrary(config, locale, stages);
  messenger.build();
  stories.catalogue.push(messenger.category); // read like stories, served by messenger.scene()
  console.log(`Grouped request stories by ${stories.groupRequests((id) => messenger.requesterFor(id))} requesters`);
  const bgm = new BgmLibrary(config.dataDir, locale, stories);
  bgm.build();
  const raids = new RaidLibrary(config.dataDir, locale, stages);
  raids.build();
  const characters = new CharacterLibrary(config.dataDir, locale, stories);
  characters.build();
  const minigames = new MinigameLibrary(config.dataDir, locale, { stories, stages, bgm });
  minigames.build();
  const eventGames = new EventGameLibrary(config.dataDir, locale, { stories, stages, minigames });
  eventGames.build();
  const progression = new ProgressionLibrary(config.dataDir, locale, stages);
  progression.build();
  const monsters = new MonsterLibrary(config.dataDir, locale, { stages, raids });
  monsters.build();
  const maps = new MapLibrary(config, locale, stages, memorials);
  maps.build();
  const misc = new MiscLibrary(config, locale, stories);
  misc.build();
  return { config, locale, stories, stages, bgm, raids, characters, minigames, eventGames, progression, monsters, maps, memorials, misc, messenger };
}

module.exports = { loadAll };
