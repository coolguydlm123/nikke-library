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

function loadAll(root) {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'config.json'), 'utf8'));
  const locale = loadLocale(config.localeDir, config.language);
  console.log(config.localeDir ? `Loaded ${locale.size} locale strings` : 'No localeDir set — showing locale keys');
  const stories = new StoryLibrary(config.dataDir, locale, config.mpksDir);
  stories.build();
  const stages = new StageLibrary(config, locale, stories);
  stages.build();
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
  return { config, locale, stories, stages, bgm, raids, characters, minigames, eventGames, progression };
}

module.exports = { loadAll };
