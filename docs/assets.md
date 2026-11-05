# Game assets: from the CDN to the library

How the art (sprites, field maps) and some non-table data (locale text, wave spawns) get from
NIKKE's content servers into the Nikke Library. Everything described here lives in
`D:\Nikke Datamine\nikke-downloader` (downloading, exporting, sorting, bookkeeping) and in the
library's `tools/` folder (web-size copies). The game tables themselves come from a different
route (static data unpacked into `D:\Nikke Datamine\mpkparser\jsons`, step 1 of the update
check below).

## The pipeline at a glance

```
CDN catalog (dp / fd / core / saus ...)
   │  index.py ls / get / get-list            (or update_check.py, maps.py, wavedata.py)
   ▼
nikke-downloader/downloads/<family>/*.bundle
   │  AssetStudioModCLI  -t sprite            (sprites only)
   ▼
nikke-downloader/image/<family>/...           sort_images.py puts files into folders by name
   │  manifest.py build <family> --delete     records every bundle + its files, deletes the bundle
   │  image_report.py                         refreshes image/PROGRESS.md
   ▼
nikke-library/public/img/<family>/<name>.webp|.jpg     tools/web-images.py
nikke-library/public/img/maps/<field>.glb|.webp        tools/web-maps.py, tools/map-thumbs.py
```

## The CDN

`index.py` is the CDN client. The host is `https://cloud.nikke-kr.com/prdenv/<env>/StandaloneWindows64/pck`.

- **env** comes from the lobby (`https://global-lobby.nikke-kr.com/v1/resourcehosts2`) unless
  `--env` is given.
- **Content number** (`latest-<n>.txt`) is read from the installed game's `NKVersion` record
  (`nk_version.py`, in `nikke_Data/resources.assets`) and cached in
  `%LOCALAPPDATA%\nikke-downloader\latest-<env>.txt`. If the CDN answers 404 for the cached number,
  it is re-read from the install automatically. `--latest <n>` overrides it.
- `latest-<n>.txt` lists the **projects**, each with its own catalog hash. Each project's
  `catalog.ndb` is downloaded once per hash and decrypted (`nkdb_decrypt.py`: NKDB format, AES key
  in the header, AES-OFB segments, then zlib) into a SQLite catalog under the same cache folder.
- Bundles are not stored as whole files. The catalog maps each key to compressed chunks inside
  pak files, which `index.py` fetches with HTTP Range requests and stitches back together
  (zstandard; chunk hashes are verified when `spookyhash` is installed).

Projects used by the library:

| Project | What it holds here |
|---|---|
| `dp` | All image bundles: scenario backgrounds, event/character/monster icons, Jukebox and TTS covers |
| `fd` | Field map art models (`<group>mapmodelgroup(hd)_assets_<field>_model_<hash>.bundle`) |
| `core` | Field map level bundles (marker spawners) and wave spawn bundles (`wavedata_assets_*`) |
| `saus` | Raw `Locale_*` files (decrypted into `nikke-downloader\json-locale`) |

`python index.py manifest` prints every project in the current content version (the help text
names `dp, en, ja, ko, fd, saus, core`).

### HD vs SD

Most bundles exist twice, tagged in the key: `scenariobackground(hd)_assets_...` and `...(sd)_...`.
**Only HD bundles are used.** Every regex in `update_check.py` asks for `\(hd\)`, except
icons-event, which also accepts untagged keys (a few events, e.g. `icons-event-24_redash`,
have an untagged bundle as well as the HD one) and excludes `(sd)`.

### index.py commands

```
python index.py manifest                              # list projects and their catalog hashes
python index.py ls       <project> <regex>            # bundle keys matching the regex
python index.py get      <project> <regex> <out-dir>  # download matching bundles
python index.py get-list <project> <keyfile> <out-dir># download exact keys, one per line (# = comment)
python index.py raw      <project> <regex> <out-dir>  # raw (non-bundle) files, e.g. Locale_
options: --env <prefix>  --latest <n>  --cache <dir>  --limit N
```

Downloaded bundles are named after the key's base name, which ends in a content hash
(`..._assets_all_bfe21c7313f9061e7b097a8c14ef2267.bundle`). When the game updates a bundle, the
hash and so the file name change. That is how "new or updated" is detected later.

## Exporting with AssetStudio

`AssetStudioModCLI` (`D:\Nikke Datamine\AssetStudioModCLI_net9_win64\AssetStudioModCLI_net9_win64\AssetStudioModCLI.exe`,
the path is set in `manifest.py` and `nikke_cdn.bat`).

- **Images: sprites only** (`-t sprite`). Not `tex2d`: the sprites are the cut-out images the
  game actually shows, with the names the tables use.
- Group option `-g none` (all files flat) for most families; `-g fileName` for icons-event, so
  each bundle gets its own folder that `sort_images.py` then renames to the event.
- When one bundle holds two sprites with the same name, AssetStudio saves the second as
  `<name>_#<n>.png` (seen 7 times in `icons-event/37_lastkingdom`). `manifest.py` matches those too.
- `-m info --export-asset-list xml` lists a bundle's assets without exporting. `manifest.py` uses
  that to record what each bundle contains.

## Image families

One folder per family under `nikke-downloader\image\`. The library's `config.json` `imageDir`
points there, and the family folder name is also the web folder name (`public/img/<family>/`).

| Family | dp bundles (HD) | Sorted into | Named in the data by |
|---|---|---|---|
| `scenariobackground` | `scenariobackground(hd)_assets_<name>` (one per image) | `eventscene/chapter_NN/` (EventScene_Chap_NN_*), `eventscene/<event>/`, `eventtitle/<event>/`, `location/<place>/` (time-of-day `_d/_n/_s/_e` and number suffixes dropped: CityForest_01_n → cityforest) | story background names |
| `icons-event` | `icons-event-<nn>_<event>(hd)_assets_all` (one per event) | `<nn>_<event>/` (e.g. `89_marian`, `78_tts`) | event UI icon names |
| `icons-char` | `icons-char-full(hd)` and `icons-char-si(hd)`, one per character/costume | `full/` (portraits, `c010_00.png`) and `si/` (small icons, `si_c010_00_s.png`) | resource ids like `c010_00` |
| `icons-monster` | `icons-monster(hd)` and `icons-monster_full(hd)` | one folder per monster code (`full_bbg004_zeus`, `si_bbg004_psid`, `bbg004_dmtr_intercept` → `bbg004/`) | monster prefab names (`full_<mon_prefab>`) |
| `jukebox` | `icons-jukebox_album(hd)_assets_all` | `album/` | `JukeboxThemeTable.theme_resource` (`album_lastkingdom_01`) |
| `tts` | `icons-tts_album(hd)_assets_all` | `jacket/` | `EventTTSSongManagerTable.cover_resource_id` and `EventTTSSongGroupManagerTable.group_image_resource` (`tts_jacket_tutorial`) |
| `icons-storyline` | `icons-storyline(hd)_assets_all` | `event/`, `sidestory/`, `messenger/` | `HistoryManagerTable.thumbnail_id` / `resource_id` (`img_storyline_event_nocallerid`) |
| `icons-album` | `icons-album(hd)_assets_all` | `chapter/`, `structure/`, `none/` | `HistoryManagerTable.thumbnail_id` / `resource_id` for main chapters (`img_album_chapter00`) |
| `icons-chapter_bg` | `icons-chapter_bg(hd)_assets_all` | `chaptermap/` | `CampaignChapterTable.chapter_image` / `hard_chapter_image` (`ChapterMap_Image_001`) |
| `icons-tower_bg` | `icons-tower_bg(hd)_assets_all` | `tower/`, `ui/` | `TowerTable.bg` (`sbg_tower_001_day`) |
| `icons-event_bg` | `icons-event_bg(hd)_assets_all` | `<event>/` | `'ui_event_bg_' + EventStoryTable.ui_prefab_1`; `EventFieldRecollectionHubTable.album_page_resource` |
| `icons-archive_bg` | `icons-archive_bg(hd)_assets_all` | `archive/` | `ArchiveRecordManagerTable.record_slot_bg_addressable` / `record_unlock_bg_addressable` (`event_archive_absolute`) |
| `icons-lost_sector_bg` | `icons-lost_sector_bg(hd)_assets_all` | `list/`, `info/` | `LostSectorTable.bg` / `bg_info` (`ui_flbg_lostsector_list_001`) |
| `icons-material` | `icons-material(hd)_assets_all` | `material/`, `event/`, `currency/`, `im/`, `mm/` ... (after `icn_`) | `ItemMaterialTable.resource_id`; also `MemorialSeriesTable.memorial_series_resource` (`mm_1001`) |
| `icons-consume` | `icons-consume(hd)_assets_all` | `randombox/`, `selectbox/`, `bundlebox/` ... (after `icn_consume_`) | `ItemConsumeTable.resource_id` (13 more are in `icons-event`) |
| `icons-equip` | `icons-equip(hd)_assets_all` | `arm/`, `body/`, `head/`, `leg/`, `ie/` (after `icn_equipment_`) | `ItemEquipTable.resource_id` |
| `icons-char-mi` | `icons-char-mi(hd)_assets_mi_cNNN_XX_s`, one per icon; **only the ones a table names are kept** | `mi/` | `MessengerRoomTable.thumbnail_image` (`mi_c010_00_s`) |
| `icons-sns_bg` | `icons-sns_bg(hd)_assets_all` | `sns/` | `MessengerMemberTable.background_image` (`sns_bg_default`) |
| `icons-favoriteitem` | `icons-favoriteitem(hd)_assets_all` | `si/`, `mi/`, `favoriteitem/` | `FavoriteItemTable.icon_resource_id` / `prop_resource_id`, `FavoriteItemQuestTable.quest_thumbnail_resource_id` |

`sort_images.py` only moves loose files (or icons-event's `*.bundle_export` folders). Files already
in a subfolder are left alone. A file whose name already exists at the destination replaces it,
since it's the same sprite in a newer export. For `icons-char`, `update_check.py` splits `si_*`
from the rest itself, at export time.

Names never repeat inside a family, which is what lets the web copies be flat (see below).

## Manifests and bundle deletion

Bundles are deleted once exported, to save space (about 9 GB). What they held is kept in
`nikke-downloader\manifests\<family>.json`:

```json
{ "family": "jukebox", "project": "dp", "export": {"types": "sprite", "output": "image/jukebox"},
  "updated": "...",
  "bundles": {
    "icons-jukebox_album(hd)_assets_all_<hash>.bundle": {
      "key": "<full CDN key, for index.py get-list>", "size": 15528720, "downloaded": "2026-11-02",
      "catalog": {"env": "...", "content": "657", "catalog": "<dp catalog hash>"},
      "exported": true,
      "assets": [{"name": "album_lastkingdom_01", "type": "Sprite",
                  "files": ["image/jukebox/album/album_lastkingdom_01.png"]}, ...] } } }
```

```
python manifest.py build <family|all> [--delete]       # record downloads/<family>/*.bundle
python manifest.py new   <family> <regex> [keyfile]    # dp keys matching regex not in the manifest
```

- `build` runs AssetStudio in info mode on each bundle (8 at a time), finds each asset's exported
  file under the family's output folder, and merges the result into the manifest. Entries from
  earlier runs are kept.
- With `--delete`, only bundles whose assets were **all** found on disk are deleted. The others
  are kept and listed.
- A family must be in `FAMILIES` in `manifest.py`, otherwise the script stops with an error.
  The families are the ones in the table above.
- Field maps have their own manifest, `manifests\maps.json`, written by `maps.py` in the same
  layout (project `fd+core`).
- To re-download a deleted bundle, put its `key` in a file and run
  `python index.py get-list dp <keyfile> downloads/<family>`.

## Update check

`D:\Nikke Datamine\update-check.bat` runs everything from the update check in one window. It asks
y/n before each step:

1. **Game tables.** Unpacks the newest `.zip` in `StaticDataUnpacker_v0.2\StaticDataUnpacker_v0.2\Decrypted`
   with 7-Zip into `mpkparser\mpks`, then runs `node index.js ./mpks ./jsons` and
   `python organize_jsons.py` in `mpkparser`. The zip has to be put in `Decrypted` by hand first.
2. **Images.** `python update_check.py check`. If anything is pending, it offers `python update_check.py apply`.
3. **Web copies.** `python tools\web-images.py` and `python tools\web-maps.py` in the library.
4. **Live site.** `npm run build`, then `npm run deploy` (GitHub Pages, https://coolguydlm123.github.io/nikke-library/).

`update_check.py`:

- `check` compares the dp catalog against each family's manifest using these regexes:

  | Family | Regex |
  |---|---|
  | scenariobackground | `^scenariobackground\(hd\)_` |
  | icons-event | `^icons-event-(?!.*\(sd\))` |
  | icons-char | `^icons-char-(full\|si)\(hd\)_` |
  | icons-monster | `^icons-monster[^(]*\(hd\)_` |
  | jukebox | `^icons-jukebox_album\(hd\)_` |
  | tts | `^icons-tts_album\(hd\)_` |

  A key whose file name isn't in the manifest counts as new or updated. The list goes to
  `manifests\pending\<family>.txt`.
- `apply` does, for each pending family: `index.py get-list`, an AssetStudio sprite export into
  `image/<family>`, then `sort_images.py`, `manifest.py build <family> --delete`, deleting the
  pending list, and finally `image_report.py`.
- Field maps are not part of it. List them with `python maps.py ls`.

## PROGRESS.md

`python image_report.py` writes `nikke-downloader\image\PROGRESS.md`, the place to check what's
been downloaded. For each family it shows bundles downloaded (manifest plus any still on disk),
bundles still on disk, download size, sprites exported, sorted, loose (not sorted yet), and size
on disk. Below that is a per-folder breakdown. Run it after any download, export or sort; the
`apply` step and the `.bat` menu run it for you.

## Other downloads

- **Field maps** (`maps.py`, used by the 3D map viewer). A field is the id the tables use
  (`CampaignChapterTable.field_id` like `fcbg_cityforest_013`, `EventFieldTable.field_art_map_standard`
  like `febg_christmas_001_01`, lost sectors like `flbg_lostsector_001`). Each field needs two bundles:
  the **fd** art model `<group>mapmodelgroup(hd)_assets_<field>_model` and the **core** level
  `<group>levelmapgroup_assets_<design field>` (groups: campaign / eventfield / lostsector).
  - Event art maps end in `_01`/`_02`, and their level drops that suffix.
  - Campaign Hard and Story fields reuse the Normal art model.
  ```
  python maps.py get    <field> ...                     # -> downloads/maps/
  python maps.py export <field> ... [--tex N] [--delete] # -> maps/<field>/<field>.glb + markers.json
  python maps.py ls     [regex]                         # x = already exported
  ```
  `export` uses UnityPy. Unity's left-handed coordinates are converted to glTF's (x negated).
  Lightmaps go into the GLB, with per-node `extras.lm` / `extras.lmST`. Far-away scenery is tagged
  `extras.backdrop`. `markers.json` holds the spawner positions joined with
  `mpkparser\jsons\FieldMapData_<design field>.json`. The library's `config.json` `mapsDir` points at
  `nikke-downloader\maps`.
- **Wave spawns** (`wavedata.py`, used by stage pages). The script downloads every
  `wavedata_assets_<wave_path>` bundle (core) and exports its TextAsset JSON to
  `nikke-downloader\wavedata-json` (`config.json` `waveSpawnDir`). The CDN's core catalog only
  lists bundles changed in the latest patch, so the full list comes from the installed game's own
  core catalog, which is copied and never modified.
- **Locale text.** `nikke_cdn.bat` option 5 runs `index.py raw saus "Locale_" downloads` and then
  `decrypt.py downloads`, writing JSON to `nikke-downloader\json-locale` (`config.json` `localeDir`).

## nikke_cdn.bat (interactive menu)

In `nikke-downloader`: 1 manifest, 2 ls (collect several searches into one list, then download it),
3 get, 4 raw, 5 Get Locale Json, 6 Extract with AssetStudio, 7 env/latest/cache overrides,
8 exit, 9 wave spawn data, 10 manifest + delete bundles, 11 new keys not downloaded yet.

After a download it offers to extract. If both HD and SD files are present, it can copy one kind
into `<dir>_hd_only` (or `_sd_only`) first. Then it asks which family to record in the manifest
and whether to delete the bundles. The family list in that prompt is
`scenariobackground icons-event icons-char icons-monster jukebox tts all`.

## Web copies (library side)

- `python tools/web-images.py` takes every family folder under `imageDir` and writes a
  **flat** `public/img/<family>/<lowercased name>`, whatever subfolder the source sits in.
  `scenariobackground` becomes JPEG (longest side 1024, quality 80). Everything else becomes WebP
  with alpha (longest side 768, quality 85). Up-to-date files are skipped, copies whose source is
  gone are removed, and if a name appears twice the first one is kept. Pages look images up by the
  data's name, e.g. `public/img/jukebox/album_lastkingdom_01.webp`.
- `python tools/web-maps.py [--side N]` copies `<mapsDir>/<field>/<field>.glb` to
  `public/img/maps/<field>.glb`, with textures shrunk to N px (default 512) as JPEG, or PNG when they
  have alpha. Geometry is copied unchanged.
- `python tools/map-thumbs.py [--size N]` renders `public/img/maps/<field>.webp`, a top-down
  thumbnail for the Maps landing page (Hard/Story fields use the Normal field's thumbnail).
- `public/img/` is git-ignored. It reaches the live site through `npm run build` / `npm run deploy`.

## Known quirks

- **Only referenced icons are kept for one-bundle-per-icon families** (user, 2026-11-05: save space). `update_check.py`'s
  `REFERENCED_ONLY` (now `icons-char-mi`) only fetches icons whose name appears in a table; 422 unused `mi_` icons were deleted and
  their manifest entries are marked `"pruned": true`, so they aren't fetched again.
- **Never download Spine** of any kind (`spine*` bundle groups), even when a table points at one: `FavoriteItemTable.img_resource_id`
  (`favoriteitem_c072_00`) is a Spine model (`spinefavoriteitemgroup` / `spinecollectionitemgroup`), so it has no image.
- `icon_messenger_logo` / `icon_messenger_logo_profile` (Messenger) aren't in any dp bundle; they're built into the client.
- **`icons-album(hd)` isn't the Jukebox.** Despite the name, it holds story chapter album art
  (`img_album_chapterNN`, used by the Story Line); the Jukebox covers come from `icons-jukebox_album`.
- No dp bundle holds the names in `EventManagerTable.event_banner_resource_id` / `event_thumbnail_resource_id` (`EVENT_BANNER_*`),
  `EventFieldTable.field_first_entry_resource` (`event_enter_*`).
- Not downloaded yet: `icons-spot_bg` (`ibg_*`, `EventTowerDefenseStageTable`). Four `ItemMaterialTable` icons have no sprite in any downloaded family (`icn_event_dicetrack_dice*`, `icn_event_story_*_skyontherock`).
- Four Jukebox covers aren't used by any `JukeboxThemeTable` row: `album_bsideidol_01`,
  `album_empty_01`, `album_littlewitchtrick_01`, `album_saga_01`.
- **`nikke_cdn.bat` must keep CRLF line endings.** With LF, cmd mis-reads labels and the menu breaks.
  Git Bash `sed -i` silently converts it to LF. Edit it in binary mode, or with an editor that keeps CRLF.
- **Spine was dropped** (2026-11-01). Spine standing models (`spinestandingcharactergroup(hd)`)
  were downloaded once and then deleted along with the `nikke-spine` repo, `sort_spine.py` and their
  manifest. Don't download Spine bundles again unless that decision changes.
- A bundle's file name changes whenever the game updates it (the hash is part of the name), so a
  changed asset shows up as a new bundle in `update_check.py check`. Its old manifest entry stays.
- `manifest.py` looks keys up in the **current** dp catalog. A bundle downloaded from an older
  catalog that has since been replaced gets `"key": null`, unless the download folder has a `keys.txt`.
- The content number cache can go stale after a game patch. `index.py` notices the 404 and
  re-reads `NKVersion` from the install, so the game must be installed and updated on this PC.
