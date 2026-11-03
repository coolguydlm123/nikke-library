# Nikke Library guides

Plain-language guides to every page of the Nikke Library and the game mechanics behind
them. Each file stands on its own: hand one (or this whole folder) to Claude and ask about
how something in NIKKE works. They describe what the code and the game data actually do;
anything uncertain is marked as such.

| Guide | Covers |
|---|---|
| [stories.md](stories.md) | Story reader: main story, events, side stories, bond, counseling, memorials; choices, game view, backgrounds, speaker icons and positions |
| [stages.md](stages.md) | Campaign chapters and towers: modes, monster levels and stats, waves and spawns, enemy totals, rewards, random box contents |
| [raids.md](raids.md) | Union Raid, Solo Raid, Interception, Anomaly Interception, Museum |
| [monsters.md](monsters.md) | Monster models and variants, elements, Exceed, generations (Rapture / Dark Matter), classes, skills, parts, where they appear |
| [maps.md](maps.md) | 3D campaign field maps and their markers |
| [characters.md](characters.md) | Nikke profiles and costumes, CP formula, Overload gear and the roll simulator, filters |
| [minigames/README.md](minigames/README.md) | Tracing the Stars, VOLT TRIP, Fading Affection and every event minigame, one file each |
| [progression.md](progression.md) | Outpost, simulation room and Overclock, level-up and Synchro Device costs |
| [jukebox.md](jukebox.md) | Albums, tracks and the story scenes that play them |
| [misc.md](misc.md) | Misc section: the Story Line timeline (History / Release order, parts, tags, scene counts) |
| [assets.md](assets.md) | How game files get into the library: CDN downloads, extraction, manifests, update check, web copies |

## How the library works

- **Data:** the game's tables, parsed from its static data into JSON (`D:\Nikke Datamine\mpkparser\jsons`), plus locale text for English names and dialogue (`nikke-downloader\json-locale`). Table and field names in these guides refer to those files.
- **Art:** sprites and models exported from the game's CDN bundles (see [assets.md](assets.md)), copied at web size into `public/img/`.
- **Code:** each section has `lib/<section>.js` (reads the tables and builds what the page needs) and `public/<section>.js` (draws the page). `lib/api.js` lists every data request; `build-static.js` saves them all as files for the GitHub Pages copy.
- **Pages:** every section starts on a hub of cards, then a sidebar list ("Browse" on phones) and detail pages. Tables follow one compact pattern (see the main README, "Page patterns").
- **Updating:** `D:\Nikke Datamine\update-check.bat` refreshes the tables, checks the CDN for new art, rebuilds and deploys. New static data has to be put into the `Decrypted` folder by hand first.
