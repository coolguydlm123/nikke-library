# Jukebox page — how it works

This guide describes the **Jukebox** section of the Nikke Library, a local web app that browses NIKKE game data. It is written to stand alone: everything here comes from the app's code (`lib/bgm.js`, `public/jukebox.js`, parts of `lib/stories.js` and `lib/minigames.js`) and the game's data tables in `D:\Nikke Datamine\mpkparser\jsons`. Figures are from the data as of 2026-11-03 (English locale). Points that are inferred rather than read directly are marked **(inferred)**.

## What the page shows

The in-game Jukebox lets the player play collected music in the Outpost/Lobby. Music is grouped into **albums** (the game calls them themes), and each album holds **tracks**.

- **Landing page** (`#/jukebox`): one card per album with its cover, track count and total length. A summary line gives the total number of tracks, albums, and how many tracks play in at least one story scene. Currently: 951 tracks in 55 albums, 589 of them used in stories.
- **Sidebar**: the album list in game order, each with a small cover and the number of tracks. The filter box matches album names, track titles and artists; when it matches tracks, the sidebar count shows how many tracks in that album match, and matching rows are highlighted in the album table.
- **Album page** (`#/jukebox/<album id>`): cover, name, description, track count, total length, Prev/Next album buttons, and the track table:

| Column | Meaning |
|---|---|
| Title | Track title. A **LOOP** tag means the track is flagged to loop. |
| Artist | Credited artist, as the game writes it. |
| Obtain | Short label for how the player unlocks the track; hover for the game's full sentence. |
| Length | Play time, formatted like `2m 45s`. |
| Scenes | Number of story scenes that play this track. Click it to list those scenes; each one links to the story reader. "—" means none. |
| BGM key | The internal audio key of the track. |

Tracing the Stars (the rhythm minigame) song pages link to the Jukebox album that contains a track with the same title (see below); the Jukebox does not link back.

## Data sources

### Albums — `JukeboxThemeTable`

| Field | Use |
|---|---|
| `id` | Album id, used in the URL. |
| `order` | Sort order of albums (ascending). |
| `name_localkey` | Album name, a locale key such as `Locale_Bgm:bgm_theme_lastkingdom_01`. |
| `description_localkey` | One-line album description (locale key). |
| `theme_resource` | Cover image name, e.g. `album_lastkingdom_01`. |
| `bg_color` | Hex colour without `#`, e.g. `29221D`. Used for the coloured line on top of the album header (and as a fallback swatch in the sidebar if a cover is missing). Defaults to `444444` if empty (none are empty now). |

Locale text comes from `D:\Nikke Datamine\nikke-downloader\json-locale`; a key with no text falls back to the raw key (album name falls back to the id).

### Tracks — `JukeboxListTable`

| Field | Use |
|---|---|
| `id` | Track id. |
| `theme` | Album it belongs to (= `JukeboxThemeTable.id`). Every track's `theme` exists. |
| `order` | Sort order inside the album (ascending). |
| `name` | Title — plain text, **not** a locale key, so it is the same in every language. |
| `artist` | Artist — plain text. |
| `bgm` | BGM key, e.g. `bgm_title_godnessfall`. All are lowercase and unique across the table. |
| `is_loop` | `true` → LOOP tag. 852 tracks loop, 99 don't. |
| `play_time` | Length in **seconds** (integer). Range 5–364. |
| `is_default_bgm` | `true` → owned from the start (89 tracks). |
| `get_info_type` | `Locale` or `FieldItem` — how to read `get_info_value`. |
| `get_info_value` | A locale key (for `Locale`) or a `FieldItemTable.id` (for `FieldItem`). |

**Album total length** = sum of `play_time` of its tracks. Lengths are formatted as `45s`, `12m 30s`, `1h 05m` (seconds dropped above an hour).

### Obtain method

The app works out the obtain text in this order:

1. `is_default_bgm = true` → locale `Locale_System:MISSING_GOODS_JUKEBOX_OBTAIN_PRESET_BGM` ("This is the default BGM."). Label **Default**.
2. `get_info_type = Locale` → the text of `Locale_System:<get_info_value>`. Values in use:

   | `get_info_value` | Tracks | Full text (en) | Label |
   |---|---|---|---|
   | `MISSING_GOODS_JUKEBOX_OBTAIN_REDHOOD_SPECIAL` | 431 | Can be obtained from event rewards. | Event |
   | `MISSING_GOODS_JUKEBOX_OBTAIN_PRESET_BGM` | 90 | This is the default BGM. | Default |
   | `JUKEBOX_OBTAIN_MINIGAME` | 14 | Can be obtained from a mini game. | Mini game |
   | `JUKEBOX_OBTAIN_ACHIEVEMENT` | 10 | Can be obtained from a Challenge. | Challenge |
   | `MISSING_GOODS_JUKEBOX_TRACING_THE_STARS` | 3 | Complete Challenge Missions in the mini game TRACING THE STARS… | Tracing the Stars missions |
   | `MISSING_GOODS_JUKEBOX_OBTAIN_MOG_MINE` | 1 | Can be obtained by clearing Mine - Stage II in M.O.G. EX Edition. | Clearing Mine - Stage II in M.O.G. EX Edition |
   | `MISSING_GOODS_JUKEBOX_OBTAIN_SIDESTROY_PRETTYSTAR` | 1 | Can be obtained from the side story PRETTY STAR. | Side story PRETTY STAR |

3. `get_info_type = FieldItem` → look up `FieldItemTable` by `id = get_info_value` (these rows have `item_type = "BGM"`; they are the hidden pickups on campaign maps **(inferred from `fielditem_prefab = fx_f_hiddenitem`)**):
   - `obtain_contents = "Campaign"` → `MISSING_GOODS_JUKEBOX_OBTAIN_CAMPAIGN_NORMAL` or `…_CAMPAIGN_HARD` (by `difficulty`), with `{0}` replaced by `obtain_location` = **campaign chapter number**. Label e.g. **Normal Ch. 3** / **Hard Ch. 8**. Currently 238 Normal + 163 Hard.
   - `obtain_contents = "Eventfield"` → `MISSING_GOODS_JUKEBOX_OBTAIN_EVENT`, label **Event** (no track uses this now).
4. Anything else → `MISSING_GOODS_JUKEBOX_OBTAIN_NONE`, label "—".

The short labels are made by the app, not the game: it strips "Can be obtained from/by (the/a/an)" and the final period, with a few fixed replacements (Default, Event, Tracing the Stars missions). This shortening only works on English text; in another language the label is the full sentence.

### Covers

Cover image = `public/img/jukebox/<theme_resource lowercased>.webp` (512×512 web copies). They were extracted from the game's `icons-jukebox_album` (HD) asset bundle; originals are in `D:\Nikke Datamine\nikke-downloader\image\jukebox\album\`. All 55 albums have one. Four sprites in the bundle belong to no album: `album_bsideidol_01`, `album_empty_01` (likely a placeholder), `album_littlewitchtrick_01`, `album_saga_01`.

### Story scenes that play a track

Story dialogue tables have a `play_bgm` field on each line. The app scans every scene file in these folders of the data directory:

- `ScenarioDialogTable` (main story `d_main_*`, and sub stories)
- `EventScenarioDialogTable` (events)
- `SideStoryScenarioDialogTable` (side stories)
- `AttractiveScenarioDialogTable` (bond episodes)
- `AttractiveCounselDialogTable` (counselling dialogues)

For each scene it collects the distinct `play_bgm` values (lowercased). A track's scene list is every scene whose set contains the track's `bgm` key (exact, case-insensitive match). Scenes are ordered as in the game's `*.Group.csv` order files, and labelled with the story reader's scene names.

## Tracing the Stars link

The Tracing the Stars page (`lib/minigames.js`) links a song to a Jukebox album when a track has the **same title** (case-insensitive) as the song's `name_locale`. It is a name match, not an id link **(no id field connects the two tables)**; when two tracks share a title the first one in album order wins.

## Data quirks

- **Most-used track:** "Back to Normal" (`bgm_story_backtonormal`, album *Folk Tales*) plays in 3,179 scenes, 2,919 of them counselling dialogues; its scene list is very long.
- **Track 5 "Meditation"** has `is_default_bgm = false` but its obtain text is the default-BGM sentence, so it shows as Default — which is right is unclear.
- **Duplicate title:** two different tracks are called "Ambush" (`collab_bgm_sb_ambush` in album 912, `bgm_story_ambush` in album 914). The Tracing the Stars name match would pick the first.
- **Very short tracks:** a few are jingles of 5–9 s and don't loop (M.O.G. minigame stingers `event_bgm_redash_minigame_*`, White Memory endings `event_bgm_wm_*end`).
- **Story BGM keys not in the Jukebox:** of 642 distinct `play_bgm` values in stories, 53 match no track. They include placeholders (`none`, `zz`), ambience (`ambient_scn_wind`, `ambient_cityforest_1`), boss loops (`bgm_boss_bbg002_loop`) and story music not sold in the Jukebox (`bgm_story_cottoncandy`, `event_bgm_givemechocolate`). Three keys have a trailing tab (`bgm_story_trauma`, `bgm_story_fairytalesend_if`, `bgm_secondhand`, one scene each) and so don't match their track; those scenes are missing from that track's list.
- **Unused obtain path:** `Eventfield` field items and the "none" text are handled but no current track uses them.

## Where it lives in the code

- `lib/bgm.js` — builds the albums and tracks, obtain text and labels, covers, and the per-track scene lists.
- `lib/stories.js` — `bgmUse` (BGM key → scene ids) built while indexing stories.
- `public/jukebox.js` — the landing page, sidebar and album page.
- API: `/api/jukebox` (all albums with tracks), `/api/jukebox/scenes?bgm=<key>` (scene list for one track). The static GitHub Pages build pre-writes both, the latter only for tracks with at least one scene.
