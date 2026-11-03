# Maps: field maps in the Nikke Library

A standalone guide to the **Maps** section of the Nikke Library (a local Node web app over NIKKE game data, also published as a static GitHub Pages site). It explains what the page shows, how NIKKE's field maps work, and where every value comes from. Statements marked **(inferred)** are my reading of the data, not something the data states outright.

## 1. What the page shows

### Landing page (`#/maps`)
- One card per campaign chapter, grouped by ten chapters (0–9, 10–19, …): chapter number, chapter name, number of campaign stages on the field, and a small top-down thumbnail.
- A **Normal / Hard / Story** switch under the title (the same switch is the tab row at the top of the sidebar). The choice is remembered in the browser (`localStorage` key `nl.mapMode`).

### A map page (`#/map/<field id>`)
- Header: crumb (`Maps · Campaign · <mode>`), title `Chapter N · <name>`, the Normal/Hard/Story buttons (they open the same chapter in that mode), and layer checkboxes.
- **3D viewer** of the field with labels on top of it:

| Layer | Label | What it is |
|---|---|---|
| Stages | stage number (`15`, `15A-1`, `BOSS`, `EX`) | campaign battle spots |
| Relics | `R` lost relic, `♪` music record, `M` memorial | collectibles picked up on the field |
| Switches & gates | `S→1` switch opening gate 1, `G1` gate | switches and the gates (doors) they open, joined by a blue line |
| Teleports | `T` | teleporter entry; a purple arrow points to the landing spot when it is one-way |
| Start | `★` | where the squad spawns |
| Side quests | `Q` | event quests and favourite-item quests placed on a campaign field (hidden by default) |
| Backdrop | — | far-off scenery around the field, e.g. the city skyline of Chapter 50 (hidden by default) |

- Hovering a label shows a small card (stage: name, level, recommended CP, enemy elements; relic: what it gives; switch: which gate it opens). Clicking a label, or a table row, shows details under the map and centres the camera on it. Memorial relics link to the memorial's text in **Stories → Memorials**.
- Tables under the map: **Stages** (Lv, CP, enemy elements, link to the stage page), **Relics** (#, type, reward), **Side quests**, **Switches & teleports**.
- Campaign stage pages have a **Map** button that opens the map with that stage selected (`#/map/<field>/s<stage id>`).

### Controls
- **Desktop (mouse):** left-drag rotates, right-drag pans, wheel zooms. **Top** = straight down, **3D** = angled view.
- **Phone (touch):** one finger pans (like a map), two fingers pinch to zoom and twist to rotate. On phones the sidebar folds into a "Browse Maps" bar; the landing page cards work without it.
- The camera is framed on the markers, not on the whole model (the art can include far scenery).
- Labels and lines appear only after the model has loaded, so they never float over an empty field.

## 2. How field maps work in the game

### Art map vs level map
Every field is two separate Unity assets:

1. **Art map** (what you see): a prefab with meshes, textures and baked lightmaps. CDN project **fd**, bundle `<group>mapmodelgroup(hd)_assets_<field>_model_<hash>.bundle` (`campaign…`, `eventfield…`, `lostsector…`; each also exists as an `(sd)` low-res copy, not used here).
2. **Level map** (the gameplay layout): a small prefab of empty GameObjects with spawner components. CDN project **core**, bundle `<group>levelmapgroup_assets_<field>_<hash>.bundle` (`campaign…`, `event…`, `lostsector…`), about 100–200 KB each.

The level prefab has a child transform named **`MapModel`**: the game places the art there. On most fields it is at the origin; on 27 of the 153 campaign levels it is offset (e.g. Chapter 5 `fcbg_iceland_001` at x 47.2, z 44.0). The art must be placed at this anchor or the markers float off the terrain.

### Field ids and modes
- Campaign field ids: `fcbg_<theme>_<NNN>` (Normal), `fcbg_<theme>_hard_<NNN>` (Hard), `fcbg_<theme>_story_<NNN>` (Story). `CampaignChapterTable` gives each chapter its `field_id`, `hard_field_id` and `story_field_id`.
- **Hard and Story reuse the Normal art.** Story fields have no model bundle at all; Hard fields have one, but the user confirmed the game reuses the Normal art. Each mode has its own level bundle (different stages, relics, layout of spots).
- Event fields: `EventFieldTable` / `ArchiveEventFieldTable` → `field_design_map` (the level, e.g. `febg_christmas_001`) and `field_art_map_standard` (the art, e.g. `febg_christmas_001_01`); `EventMapChangePresetTable.art_map_change_value` swaps the art during an event (`_02`, `_03`…). **Not exported yet.**
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

### Switches, gates, teleports
- A **gate** (`Door`) lists in `bindTriggers` the objects that open it; the page shows a switch as `S→N` for each gate whose list contains it.
- A **teleport** is a `PortalSet` with an entry and an exit `Portal`. `_portalType` 1 is shown as **one-way** and 0 as **two-way** **(inferred)**: the game data has no label for these values; in Chapter 50 the type-1 teleport drops from y 3.7 to y −0.3, which fits a one-way jump down. The `Portal` objects carry their own `_portalType`, which does not always match the set's.
- `LevelTrigger._switchType` 1 = `"Once"` in `FieldMapData` (`switchtype`).

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
   - `python maps.py ls [regex]` lists fields with an art bundle and whether they are exported.
2. **`nikke-library/tools/web-maps.py`**: web copy `public/img/maps/<field>.glb` with every texture shrunk to 512 px (geometry unchanged). 51 campaign maps ≈ 146 MB.
3. **`nikke-library/tools/map-thumbs.py`**: `public/img/maps/<field>.webp`, a 256 px top-down render framed on the markers (base colour × lightmap, highest surface per pixel, backdrop left out). ≈ 1 MB for 51.
4. **`lib/maps.js`** reads `config.json` `mapsDir` (`nikke-downloader/maps`), joins the tables above and serves `/api/maps` (list) and `/api/map?id=` (one map: markers with stage/relic info, Normal/Hard/Story versions, model path). `/api/stage` responses get `map` (the field a campaign stage stands on). `build-static.js` writes these as JSON files for the static site.
5. **`public/maps.js`** renders the page; three.js 0.160.0 (GLTFLoader, OrbitControls) is loaded from jsdelivr through the import map in `index.html`, only when a map opens. Lightmapped meshes are drawn as `MeshBasicMaterial` (base colour × lightmap × 2.2, close to the game's baked look); the rest uses a hemisphere and a directional light.

## 4. Coverage and known quirks
- **Exported:** all 51 campaign chapters (0–50) in Normal, Hard and Story (153 maps, 51 models). Not yet: event fields (72 HD art bundles, ~2.8 GB; web copies estimated ~275 MB) and lost sectors (51, ~370 MB; ~40 MB web).
- **Lighting:** the lightmaps are HDR (BC6H) decoded to 8-bit, so bright areas clip; the viewer multiplies by 2.2 to compensate. Colours are close to the game but not exact.
- **Black patches:** some fields show black discs (e.g. the pit and craters in Chapter 50). These are meshes whose material renders black without the game's shaders (probably fog or void effects, **(inferred)**).
- **Not drawn:** particle effects, animated (skinned) props and transparent effect materials (`fx_…`), so water foam, smoke and moving machinery are missing.
- **Labels are always on top:** labels are HTML over the canvas; they show through buildings.
- **Teleport direction** is inferred (see above).
- **Backdrop detection** is a heuristic (see above).
- **Inactive objects** in the level prefab are skipped; objects at exactly (0, 0, 0) (mostly cutscene triggers) are not shown.
- **Hidden preview window:** if the browser tab is in the background, the viewer stops redrawing until it is visible again (browsers pause animation frames).
