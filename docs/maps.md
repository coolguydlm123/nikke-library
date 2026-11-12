# Maps: field maps in the Nikke Library

A standalone guide to the **Maps** section of the Nikke Library (a local Node web app over NIKKE game data, also published as a static GitHub Pages site). It explains what the page shows, how NIKKE's field maps work, and where every value comes from. Statements marked **(inferred)** are my reading of the data, not something the data states outright.

## 1. What the page shows

### Landing page (`#/maps`)
- One card per campaign chapter, grouped by ten chapters (0–9, 10–19, …): chapter number, chapter name, number of campaign stages on the field, and a small top-down thumbnail.
- A **Normal / Hard / Story** switch under the title (the same switch is the tab row at the top of the sidebar). The choice is remembered in the browser (`localStorage` key `nl.mapMode`).
- Below the chapters, an **Events** group: one card per event field (event name, NPC and item counts, thumbnail), in release order. The sidebar lists them in a group of their own (count = NPCs).

### A map page (`#/map/<field id>`)
- Header: crumb (`Maps · Campaign · <mode>`), title `Chapter N · <name>`, the Normal/Hard/Story buttons (they open the same chapter in that mode), and layer checkboxes.
- Two views of the field, with the same labels on top, switched with **Map / 3D** (remembered in `localStorage` key `nl.mapView`):
  - **Map** (default): the **walkable area** drawn like the in-game map: a glowing blue area on a dark grid (see "Walkable area" in section 2).
  - **3D**: the field's art model.
  Labels (in both views):

| Layer | Label | What it is |
|---|---|---|
| Stages | stage number (`15`, `15A-1`, `BOSS`, `EX`) | campaign battle spots |
| Relics | `R` lost relic, `♪` music record, `M` memorial | collectibles picked up on the field |
| Switches & gates | `S→1` switch opening gate 1, `G1` gate | switches and the gates (doors) they open, joined by a blue line |
| Teleports | `T` | teleporter entry; a purple arrow points to the landing spot when it is one-way |
| Start | `★` | where the squad spawns |
| NPCs | the character's icon, or `N` | event fields: the NPCs standing on the field (event fields only) |
| Event spots | `◎` | event fields: fishing / photo spots and similar (event fields only) |
| Side quests | `Q` | event quests and favourite-item quests placed on a campaign field (hidden by default) |
| Backdrop | — | far-off scenery around the field, e.g. the city skyline of Chapter 50 (hidden by default) |

- Hovering a label shows a small card (stage: name, level, recommended CP, enemy elements; relic: what it gives; switch: which gate it opens). Clicking a label, or a table row, shows details under the map and centres the camera on it. Memorial relics link to the memorial's text in **Stories → Memorials**.
- Tables under the map: **Stages** (Lv, CP, enemy elements, link to the stage page), **Relics** (#, type, reward), **Side quests**, **Switches & teleports**.
- **Event fields** have no campaign stages: the tables show **NPCs** (name, kind, what talking to them opens) and **Items** instead, plus a **Timeline** card. Layers a map doesn't have are not offered; "Relics" is called "Items" there. Password doors show as numbered gates.
- **Items on event fields** have an **Appears** column (the first timeline state they are in, plus "after item #N" when another item is needed first), a hover/panel line with the same, and the Timeline card's **Items** column shows how many items each state adds and how many are on the field (`+4 (4)`); the state line under the selector says the same.
- **Timeline control (event fields):** a `Timeline` selector under the layers lists the field's states in order, e.g. `Event opens`, `Day 1 20:00 · stage 12`, `Day 11 12:30`. The line next to it says in plain words what the state needs (`from 2023-05-03 20:00 UTC, event stage 12 cleared`) and, if the field art changes, the new art name. Choosing a state shows only the NPCs and items that exist then (the rows of the others are dimmed in the tables) **and swaps the field art**: the 3D view loads that variant's model (`Loading art…`, the old one is freed) and the Map view switches to its walkable area (the base one if the variant has none); the line says `field art: <name>`. The layer checkboxes still work on top of that. The Timeline card lists every state; clicking a row selects it.
- Campaign stage pages have a **Map** button that opens the map with that stage selected (`#/map/<field>/s<stage id>`).

### Controls
**Map view:**
- **Mouse:** left-drag pans, wheel zooms about the cursor. Right-drag (or Shift + left-drag) **rotates** the map (left/right) and **tilts** it (up/down).
- **Touch:** one finger pans, two fingers pinch to zoom and **twist to rotate**.
- **Buttons:** ⟲ ⟳ rotate by 15°, **Tilt** cycles three tilt levels (straight down, 0.7, 0.5; the map is squashed vertically to look angled), **Reset** restores the framed, unrotated, untilted view. The grid rotates and tilts with the map; labels stay upright.

**3D view:**
- **Mouse:** left-drag rotates, right-drag pans, wheel zooms. **Top** = straight down, **Angled** = tilted view.
- **Touch:** one finger pans (like a map), two fingers pinch to zoom and twist to rotate.

**Both:**
- On phones the sidebar folds into a "Browse Maps" bar; the landing page cards work without it.
- The start view is framed on the markers, not on the whole model (the art can include far scenery).
- In the 3D view, labels and lines appear only after the model has loaded, so they never float over an empty field.

## 2. How field maps work in the game

### Art map vs level map
Every field is two separate Unity assets:

1. **Art map** (what you see): a prefab with meshes, textures and baked lightmaps. CDN project **fd**, bundle `<group>mapmodelgroup(hd)_assets_<field>_model_<hash>.bundle` (`campaign…`, `eventfield…`, `lostsector…`; each also exists as an `(sd)` low-res copy, not used here).
2. **Level map** (the gameplay layout): a small prefab of empty GameObjects with spawner components. CDN project **core**, bundle `<group>levelmapgroup_assets_<field>_<hash>.bundle` (`campaign…`, `event…`, `lostsector…`), about 100–200 KB each.

The level prefab has a child transform named **`MapModel`**: the game places the art there. On most fields it is at the origin; on 27 of the 153 campaign levels it is offset (e.g. Chapter 5 `fcbg_iceland_001` at x 47.2, z 44.0). The art must be placed at this anchor or the markers float off the terrain.

### Field ids and modes
- Campaign field ids: `fcbg_<theme>_<NNN>` (Normal), `fcbg_<theme>_hard_<NNN>` (Hard), `fcbg_<theme>_story_<NNN>` (Story). `CampaignChapterTable` gives each chapter its `field_id`, `hard_field_id` and `story_field_id`.
- **Hard and Story reuse the Normal art.** Story fields have no model bundle at all; Hard fields have one, but the user confirmed the game reuses the Normal art. Each mode has its own level bundle (different stages, relics, layout of spots).
- Event fields: `EventFieldTable` / `ArchiveEventFieldTable` give `field_design_map` (the level, e.g. `febg_christmas_001`) and `field_art_map_standard` (the base art, e.g. `febg_christmas_001_01`; for Eden and Dome Concert the base is `_02`). There are **31 event fields**; the archive table (17 rows, other `event_id`s) reuses the same maps. `EventMapChangePresetTable` / the `MapChange` timeline rows switch the art during an event, so one field has several art variants (**70** names in all, e.g. `febg_mothership_001_01`…`_05`); the extra variants share the field's level. The art → level name cannot always be derived by stripping `_NN` (`febg_train_001_city_01` → `febg_train_001`), so `maps.py` takes it from the tables. The tables spell one art `febg_factory_001` while the catalog has `febg_factory_001_01` (treated as the same map).
  **Exported:** the 31 base art variants (about 1.2 GB of HD bundles) and the 40 other art maps the timelines switch to (about 1.5 GB more; named by `MapChange` rows and `EventMapChangePresetTable`; `python maps.py events --variants` lists them). Two catalog bundles no table refers to (`febg_christmas_001_03`, `febg_lostcity_001_02`) are not exported. A variant has no markers of its own (the field's level is shared): `maps/<variant>/` holds its model, walkable area and `map.json` only. Event names come from the Stories section (`event_id` → `EventManagerTable`; a few events are only "Collab NN" there).
- Lost sectors: `flbg_lostsector_NNN`. **Not exported yet.**

### Markers and positionId
Every level object carries a `_positionId` GUID. The game data table **`FieldMapData_<field>.json`** (one per level, in `mpkparser/jsons`) lists the gameplay content keyed by `positionid`, grouped by kind: `stagespawner` (`stageid`, `eventstate`), `itemspawner` (`itemid`, `iscompletereward`), `door`, `leveltrigger` (`switchtype`), `portal`, `portalset`, `squadspawner`, `camerapoint`, and more (`npcspawner`, `interactionobjectspawner`, … mostly empty on campaign fields). The level bundle gives each `positionid` its 3D position; `FieldMapData` gives its meaning.

Component types on the level objects (Unity MonoBehaviour script names) and how the page uses them:

| Component | Page layer | Fields used |
|---|---|---|
| `StageSpawner` | Stages / Side quests | `_stageId` |
| `ItemSpawner` | Relics | `_itemId` |
| `LevelTrigger` | Switches | `_switchType`, `_isRepeatable` |
| `Door` | Gates | `bindTriggers` = the switches (or other objects) that open it |
| `PortalSet` | Teleports | `_enterPortal`, `_exitPortal`, `_portalType` |
| `Portal` | (ends of a teleport) | positions only |
| `SquadSpawner` | Start | — |
| `CameraPoint`, `InteractionActionTrigger` | not shown | `InteractionActionTrigger._triggerTableID` → `FieldInteractionActionTriggerTable` (cutscene/timeline triggers; most sit at the origin) |

### Stages
- `_stageId` → `CampaignStageTable` (`name_localkey`, `stage_category`, `monster_stage_lv`, `standard_battle_power` = recommended CP, `spot_id`).
- Enemy elements: the stage's wave data (`spot_id`, read by the Stages section's `enemyInfo`) → each monster's `element_id` → `ElementTable`.
- A `StageSpawner` whose stage id is **not** in `CampaignStageTable` is a **side quest**: the level files them under `Object/EventQuestStage/…` (e.g. `Event - FoolsDay 6600301`, April Fools event stages) and `Object/FavoriteItemStage/…` (e.g. `Laplace - 01`, favourite-item quests). The page names them from the scene object and folder.

### Relics
- `_itemId` → **`FieldItemTable`**: `item_type` (`HiddenItem` = lost relic, `BGM` = music record, `Memory` = memorial, `Box`, `Collect`, `BodyCore`, `BetaCore`, `Album`), `type_value` (a `RewardTable` id = what you get), `obtain_contents` (`Campaign`, `Eventfield`, `Lost_sector`), `difficulty`, spawn conditions.
- Memorials: `MemorialMemoryTable.fielditem_id` links the field item to a memorial page (`memorial_memory_name` / `memorial_memory_description` in `Locale_Memorial`); `MemorialSeriesTable` groups pages into series, `MemorialSeriesCategoryTable` names the category (Memoirs, Call Log, Data; events: Red Ash, Old Tales, Unbreakable Sphere). The Stories page reads these as the **Memorials** tab (`lib/memorials.js`).

### Event fields: NPCs, items, spots
Event `FieldMapData_<design>.json` files have these object kinds (31 files): `npcspawner` (2,805 rows, `npcid`), `itemspawner` (1,178), `portal`/`portalset` (48/24), `eventtargetspawner` (112), `characterspawner` (45), `passworddoor` and `passwordspawner` (9 each, `passworddoortableid` / `passwordtableid`), `roamingcharactermovepoint` (848 path points), `squadspawner`, `camerapoint`. There are **no `stagespawner` and no switch/gate pairs** on event fields. Not drawn: `roamingcharactermovepoint` (patrol points of walking NPCs), `characterspawner` (unclear what it spawns **(not investigated)**), `camerapoint`.
- **NPCs:** `npcid` → `EventFieldNPCTable` (and `Archive…`): `npc_type` `Character` (961 rows; `resource_id` is a `CharacterTable.resource_id`, so the icon is `icons-char/si_c<resource>_<costume>_s`) or `Npc` (`resource_id` 7001xxx, no icon), name from `npc_localkey_name`, `event_field_npc_event_data_list[].event_type` = what talking to the NPC starts, `progress_event_group_id` = the NPC's timeline group.
- **NPC dialog** (the NPC's hover card shows its first line; selecting it lists all):
  - *Speech bubbles*: `EventFieldNPCTable.balloon_always_id` → `BalloonDialogTable` rows of that `group_id` (`speaker`, `scenario_localkey`, text in `Locale_SubScenario`/`Locale_Event`). 1,263 NPC rows have one; `balloon_always_play_type` `Random` (505 rows) = shown in random order, otherwise in order. The cycle value (4, 5 or 8) is probably seconds between bubbles **(inferred, not shown)**.
  - *Conversation*: an `event_field_npc_event_data_list` entry of type `NPCTalk` has `event_id` = `EventFieldNPCTalkTable.group_id` (94 rows, ordered by `talk_order`, speaker codes + `npc_talk_localekey`). 15 NPC rows, 12 of them on Collab 09's field.
  - Speaker codes (`alice`, `shorthairstudent`) become names through the Stories section's speaker names. Not shown: `FieldTalkTable` / `FieldTalkDialogTable` (24 field-wide conversations started by the timeline's `FieldTalk` rows) and the `ScenarioDialog` timeline rows (10); the minigame entries (`Cooperation`, `Arcade`, `TTSMinigame`) are only named in "Opens".
  - Dialog sits inside each NPC marker in `/api/map` (`say`, `sayRandom`, `talk`); the 31 event maps' data total 1.1 MB (largest 74 KB).
- **Event spots:** `eventtargetspawner` rows carry no id in `FieldMapData`; the level component's own id field is kept as `ids` in `markers.json` and joined to `EventFieldEventTargetTable` (`contents_type` e.g. `Fishing`). **Which id field that is was not confirmed for every map** (a spot without a match is just "Event spot").
- **Items:** like campaign relics (`FieldItemTable`, `obtain_contents` `Eventfield`, 1,178 placed on the 31 fields). They are **released on a schedule**:
  - `spawn_time`: a real date on 1,175 of them (505 distinct dates; e.g. Miracle Snow gives 4 items on day 1 and 1 per day after, Collab 08 gives 4 / 4 / 3 / 2 weekly). `despawn_time` is the event's end for all of them (not modelled).
  - `spawn_condition_stage`: an event stage id (same ids as the timeline's stage clears), set on 122 items in 9 events.
  - `spawn_condition_item`: another item that has to be collected first (43 items, e.g. Old Tales' music records form chains). Not a timeline step: shown as "after item #N".
  - `story_event_id` (111 items) and the interaction-trigger fields (6) are not used. `spawn_condition_event_stage`, which the first version used, is empty on every event item.

### Event timeline (`ProgressEventTable`)
`EventFieldTable.progress_event_group_id` names the field's group; every NPC row has its own group. `ProgressEventTable` (33 files, plus the archive copy; 13,264 rows, 2,653 groups) rows have `event_type`, `event_value`, `event_target` (`Field` or `NPC`) and three conditions:
- `condition_time`: a .NET DateTime (ticks) stored as a big-number object `{s, e, c}`; the date is UTC (Christmas: 2022-12-07 → 2022-12-21). Rows without a date carry placeholder values (year 1 or year ~24000), which the library treats as "no date".
- `condition_stageclear`: an event stage id (7,770 rows; `EventDungeonStageTable` gives `group` and `step`, shown as "event stage N"; the stage names in the locale are all the generic "EVENT").
- `condition_missionclear`: a mission id (5 rows). `event_check_condition` `Talk` (14 rows) is not used.

Event types: `Spawn` 4,438 and `Despawn` 8,396 (NPC groups), `MapPresetChange` 165 (→ `EventMapChangePresetTable`: art, HUD, skybox, post-processing) and `MapChange` 26 (`event_value` = art name), `TimeLineAction` 88, `PlayerSquadChangeToFixedSquad` 61, `IncreaseDummy` 45, `HudChange` 18, `CameraAction` 15, `ScenarioDialog` 10, `FieldTalk` 2.

**Field change notes (the game's own text):**
- `EventDungeonStageTable` (+ archive) has `is_guide_field_change` (269 of 4,817 stages) and two note keys per stage: `map_change_guide_localkey` ("what changed on the map") and `npc_change_guide_localkey` ("what changed among the NPCs"). 258 stages carry specific text (e.g. Last Kingdom: "Kilo is now part of the kingdom.", "Rapture forces are closing in! Do not let them enter the kingdom."; Collab 08: "The cafe is open for business!"); 237 of them are stages the timeline uses. A key equal to `Locale_Event:event_field_change_guide_title` ("Field Change Occured") is only the generic title and is shown as "the field changes (no description)" when it is all there is.
- `EventFieldNoticePopupTable` (43 rows, per `event_field_id`): popups printed on `ItemSpawn` / `ItemObtain` / `PasswordSpawn` / `PasswordObtain` (e.g. "A Body Core and Beta Core have appeared on the field."). `ItemSpawn` ones become a note on the state in which that item first appears; the rest are listed as hints without a state.
- Each stage's note is put on the first state where that stage is cleared (later date steps with the same stage do not repeat it), and a state with a note is not merged away. 23 of the 31 fields have notes (187 state notes).
- Shown under the timeline selector (Map / NPCs / Notice), in a "Field change notes" card (click a row to jump to its state) and in the Timeline card's Notes column. The timing (first state that has the stage) is inferred; the text is the game's.

**How `lib/maps.js` builds the states (inferred; the game's own rule was not confirmed):**
1. Collect the distinct conditions (date to the minute, stage, mission) of the field's `MapChange`/`MapPresetChange` rows, of the `Spawn`/`Despawn` rows of every NPC on the map, and of stage-gated items. Each is a **step**; dated steps are ordered by date, steps with no date come right after the event opens, in event stage order.
2. State *k* = the first *k* steps done (state 0 = nothing yet). A row counts once its step is done. An NPC shows if its last counted row is a `Spawn`; an NPC with only `Despawn` rows shows from the start. The art is that of the last counted map change (a preset's `art_map_change_value`).
3. An item's step is its `spawn_time` together with its `spawn_condition_stage` (when it has one): it shows once that step is done. Items without a real date and without a stage are there from the start.
4. States that change nothing visible are merged, so the selector only lists real changes (median 3 steps per group, up to 25; one field can show about 15–20 states).
Only `Spawn`/`Despawn` of NPCs, art changes and the items' release steps are applied. Camera, HUD, squad and dialog rows are not shown. Nothing here knows which stages the player has really cleared; a state is "at that point of the schedule".

### Switches, gates, teleports
- A **gate** (`Door`) lists in `bindTriggers` the objects that open it; the page shows a switch as `S→N` for each gate whose list contains it.
- A **teleport** is a `PortalSet` with an entry and an exit `Portal`. `_portalType` 1 is shown as **one-way** and 0 as **two-way** **(inferred)**: the game data has no label for these values; in Chapter 50 the type-1 teleport drops from y 3.7 to y −0.3, which fits a one-way jump down. The `Portal` objects carry their own `_portalType`, which does not always match the set's.
- `LevelTrigger._switchType` 1 = `"Once"` in `FieldMapData` (`switchtype`).

### Walkable area
The art bundle also holds a Unity `NavMeshData` (one per field): the navigation mesh baked for the squad, i.e. where it can walk. It is the source of the Map view's blue area. Chapter 48, for example, has 72 tiles of which 37 contain polygons (366 polygons, about 47 KB).

Tile format as decoded by `maps.py` (Unity's variant of Detour, checked on Chapter 48; **the layout was worked out from the data, not from documentation**): a 72-byte header (magic `VAND`, version 16, tile x, y and layer as int32, polygon count, vertex count, four more counts, bounding box min and max as floats, a float quantisation factor), then the vertices as float32 x/y/z in the world space the mesh was baked in, then 32-byte polygons (6 uint16 vertex indices, 6 uint16 neighbours, flags, vertex count at byte 28; polygons are convex, 3–6 vertices). The detail meshes and BV tree after the polygons are not read. Tile size 256 cells × cell size 0.0667 m = 17.07 m per tile; agent radius 0.2 m, height 2 m, climb 0.75 m, slope 45° (`m_NavMeshBuildSettings`).

The tiles are re-posed with the position and rotation of the `NavMeshSurface` object in the art prefab and of the level's `MapModel` anchor (Unity's `AddNavMeshData` takes a position and rotation only), then x is negated for glTF. **Scale is not applied**: the art prefab's root can be scaled (Desert 1 has 0.8) and the scaled size is already baked into the tiles, whereas the art meshes are scaled by it. Applying the scale to the navmesh too shrank it (found on Desert 1, where only 27% of the stage markers fell on the area; after the fix all do). The check used on every map: campaign stage markers (`CampaignStageTable` ids) should lie on the polygons. Doors (`NavMeshObstacle` in the level) are **not** applied: the map shows the area as if every gate were open. Hard and Story use the Normal map's navmesh.

### Backdrop
Some art prefabs include far scenery under a top-level group named `bg`, e.g. Chapter 50's `fcbg_cityforest_013_arkcity_01` (a city ~650 m across around a ~140 m field). The export tags a mesh as **backdrop** when it is under the `bg` group and its centre lies more than half the marker span outside the area the markers cover; the viewer hides it until "Backdrop" is ticked. This is a heuristic **(inferred)**, not a game flag. After the `MapModel` alignment fix only two meshes in the 51 campaign fields are tagged (Chapter 50's city and one piece of `fcbg_motherwhalefield_001`).

## 3. Where everything comes from

| Data | Source |
|---|---|
| Field ↔ chapter/mode | `CampaignChapterTable` (`field_id`, `hard_field_id`, `story_field_id`, `chapter`, `name_localkey`) |
| Marker positions, links | core level bundles, read by `nikke-downloader/maps.py` |
| Marker meaning | `FieldMapData_<field>.json` (joined on `positionid`) |
| Stage name, level, CP | `CampaignStageTable`; enemy elements via the Stages section's wave data and `MonsterTable` / `ElementTable` |
| Relic type and reward | `FieldItemTable` → `RewardTable` |
| Memorial text | `MemorialMemoryTable`, `MemorialSeriesTable`, `MemorialSeriesCategoryTable`, `Locale_Memorial` |
| 3D model | fd art bundles → `maps.py` → GLB |
| Text | locale files in `nikke-downloader/json-locale` |

Game tables live in `D:\Nikke Datamine\mpkparser\jsons`.

### Pipeline
1. **`nikke-downloader/maps.py`** (needs `pip install UnityPy`):
   - `python maps.py get <field…>` downloads the HD art bundle (fd) and the level bundle (core) to `downloads/maps/`. Hard/Story fields download only their level bundle.
   - `python maps.py export <field…> [--delete]` writes `maps/<field>/`:
     - `<field>.glb` (Normal fields only): every enabled, active `MeshRenderer`; particles, skinned meshes and disabled objects are left out. Unity is left-handed, glTF right-handed: x is negated and triangle winding flipped. Textures at their stored size (JPEG, PNG if they have alpha). Baked lightmaps (`PrefabLightmapData`) are stored in the GLB; each node's `extras` has `lm` (lightmap index) and `lmST` (scale/offset, already converted to glTF's flipped v); the scene's `extras.lightmaps` lists the lightmap textures. Backdrop nodes get `extras.backdrop = true`. The art is placed at the level's `MapModel` anchor.
     - `markers.json`: every level object with a `_positionId`, its position (glTF space), script type, links (`triggers`, `enter`, `exit`, `stages`, `spawns`, as positionIds) and the matching `FieldMapData` row.
     - `map.json`: `{ art, anchor }`: which field's GLB to show and this level's `MapModel` matrix. Hard/Story markers are moved by `artAnchor · inverse(ownAnchor)` so they sit on the Normal art.
     - Each downloaded bundle is recorded in `manifests/maps.json` (CDN key, size, date, catalog version, output files); `--delete` removes the bundle afterwards.
     - `walkable.json` (Normal fields only): `{"polys": [[x, z, x, z, ...], ...]}`, the navmesh polygons in glTF space (x negated), top-down only (heights dropped). About 15 KB per map.
   - `python maps.py walkable <field…> [--delete]` writes only `walkable.json` for fields that were exported before it existed (needs the art and level bundles from `get`).
   - `python maps.py events [--variants]` prints the 31 base art maps (default) or the 40 other art maps; exporting a variant needs the field's level bundle only for its `MapModel` anchor and backdrop tagging, and it is deleted afterwards without a markers file.
   - `python maps.py ls [regex]` lists fields with an art bundle and whether they are exported.
2. **`nikke-library/tools/web-maps.py`**: web copy `public/img/maps/<field>.glb` with every texture shrunk to 512 px (geometry unchanged). 51 campaign maps ≈ 146 MB. It also copies each `walkable.json` to `public/img/maps/<field>.walk.json` (the Map view fetches it; `/api/map` gives its URL as `walkable`, or `null` when the map has none, in which case only the 3D view is offered).
3. **`nikke-library/tools/map-thumbs.py`**: `public/img/maps/<field>.webp`, a 256 px top-down render framed on the markers (base colour × lightmap, highest surface per pixel, backdrop left out). ≈ 1 MB for 51.
4. **`lib/maps.js`** reads `config.json` `mapsDir` (`nikke-downloader/maps`), joins the tables above and serves `/api/maps` (list) and `/api/map?id=` (one map: markers with stage/relic info, Normal/Hard/Story versions, model path). `/api/stage` responses get `map` (the field a campaign stage stands on). `build-static.js` writes these as JSON files for the static site.
5. **`public/maps.js`** renders the page; three.js 0.160.0 (GLTFLoader, OrbitControls) is loaded from jsdelivr through the import map in `index.html`, only when a map opens. Lightmapped meshes are drawn as `MeshBasicMaterial` (base colour × lightmap × 2.2, close to the game's baked look); the rest uses a hemisphere and a directional light.

## 4. Coverage and known quirks
- **Exported:** all 51 campaign chapters (0–50) in Normal, Hard and Story (153 maps, 51 models), the 31 event fields and their 40 art variants (71 event models). Not yet: lost sectors (51, ~370 MB; ~40 MB web).
- **SD (chibi) models are not shown.** On event fields the NPCs are labels (character icon, or `N`). The models exist as **3D prefabs, not Spine**: `dp` has 449 `fieldnpc` bundles (321 MB; one per distinct NPC/costume, plus boats such as `event_field_riding_fishing_boat_var`) and 342 `fieldnpc-animations` bundles (75 MB). Probed one NPC bundle and one boat: a skinned mesh (`c181_02_skin` with SD toon textures) and a plain mesh with `Animator`, no Spine skeleton. They were not downloaded for the site; the probe files were deleted.
- **Size and mesh compression:** event maps are bigger than campaign ones (about 3 MB each uncompressed even with 256 px textures; the GLBs are about 87% geometry). `tools/web-maps.py` meshopt-compresses every copy with gltfpack (`npx gltfpack@1.3.0 -cc -kn -ke -km -kv -vpf -vtf`; `--no-compress` skips it; the viewer decodes it with three.js's `MeshoptDecoder`). Checked on Collab 08, Silver Gun Factory 04 and Chapter 50: textures are byte-identical (gltfpack does not touch them), every material keeps its alpha mode and double-sidedness, all nodes, lightmap extras, the backdrop tag and the second UV set survive, and the viewer shows the same lighting; Chapter 50 had one primitive merged with an identical one. Sizes on 2026-11-09: map files **168.2 MB** (campaign models 84.6 MB, event models 80.2 MB; 71 event models, so about 1.1 MB each) instead of 238.6 MB uncompressed; a test static build (`node build-static.js <dir>`) is **775.6 MB** in total (images 547.0 MB, API data 228.3 MB) instead of 845.9 MB. The earlier estimate of 55–60 MB for the events was for the 31 base maps only (39 MB).
- **Transparency:** the exporter marks a material transparent from its shader settings, which missed some (glow "light" quads, cloud sprites, grass cards: they showed black where the texture is clear). Now a base-colour texture with >= 15% clear pixels is made `MASK` (hard edges) or `BLEND` (soft edges) and double-sided, in both `maps.py` (new exports) and `tools/web-maps.py` (`alpha_fix`; `--alpha` rebuilds only the affected models: 24 materials in 20 models were corrected). The rule is a guess from the texture, not read from the game's shader.
- **No walkable area on some event fields:** their art prefab has no `NavMeshData` (Christmas, Laboratory…). Those open in 3D only (the Map / 3D switch is hidden) and the timeline still works.
- **Lighting:** the lightmaps are HDR (BC6H) decoded to 8-bit, so bright areas clip; the viewer multiplies by 2.2 to compensate. Colours are close to the game but not exact.
- **Black patches:** some fields show black discs (e.g. the pit and craters in Chapter 50). These are meshes whose material renders black without the game's shaders (probably fog or void effects, **(inferred)**).
- **Not drawn:** particle effects, animated (skinned) props and transparent effect materials (`fx_…`), so water foam, smoke and moving machinery are missing.
- **Labels are always on top:** labels are HTML over the canvas; they show through buildings.
- **Map view is flat:** it draws the navmesh as a silhouette only; there is no height, no props and no art. Tilt is a vertical squash of the flat map, not a real perspective (labels do not shrink with distance).
- **Navmesh is not the game's exact map:** I haven't confirmed that the in-game minimap is drawn from the same navmesh, or whether it hides areas you haven't explored. The shapes match the screenshot checked (Chapter 48 ring and corridors), the block-like edges of the in-game map are **not** reproduced (polygons are drawn exactly) **(inferred: the game probably samples the navmesh on a grid)**.
- **Teleport direction** is inferred (see above).
- **Backdrop detection** is a heuristic (see above).
- **Inactive objects** in the level prefab are skipped; objects at exactly (0, 0, 0) (mostly cutscene triggers) are not shown.
- **Hidden preview window:** if the browser tab is in the background, the viewer stops redrawing until it is visible again (browsers pause animation frames).
