# Monsters page: guide to the data and mechanics

This guide covers the **Monsters** section of Nikke Library, a local web app that browses NIKKE game data. It stands alone, so you can hand it to someone with no other context and ask about the monster mechanics behind the page.

- **Data tables:** JSON files in `D:\Nikke Datamine\mpkparser\jsons`, one file per table (e.g. `MonsterTable.json`). Each holds an array of rows, or `{ records: [...] }`.
- **Text:** locale keys such as `Locale_Monster:11200101_name` are looked up in the English locale files in `D:\Nikke Datamine\nikke-downloader\json-locale` (`Locale_Monster.json`, `Locale_Skill.json`, `Locale_System.json`, …).
- **Code:**
  - `lib/monsters.js` builds the data.
  - `public/monsters.js` draws the page.
  - `lib/art.js` (`monsterArt`) finds the pictures.
  - It reuses the Stages section (`lib/stages.js`) for the monster, model and element tables and the campaign/tower lists, and the Raids section (`lib/raids.js`) for raid bosses.

Labels used below:
- **[data]**: read straight from a table field.
- **[derived]**: computed by the app from table fields; the formula is given.
- **[inferred]**: our reading of what a field means in the game. It is not stated anywhere in the data.

---

## 1. What the page shows and how to use it

### Landing page `#/monsters`

- A short summary: 234 monster models, 2,212 variants, 226 models that spawn somewhere.
- Two dropdowns: **generation** (Rapture / Dark Matter) and **class** (Husk … Queen).
- Rows of cards. Each card opens the gallery narrowed to that group (`#/monsters/<facet>/<value>`):
  - **By grade:** Boss, Centurion, Elite, Minion, Thrash.
  - **By where they appear:** Campaign, Towers, Raids, Events, Other, and Never spawn.
  - **By element:** Fire, Water, Wind, Electric, Iron.
  - **By class:** the in-game classes.
- A gallery of every model's icon.

Card counts and the gallery follow the two dropdowns and the text filter. A card row with nothing left in it is hidden.

### Sidebar (on phones: the "Browse Monsters" bar)

- Generation tabs (All / Rapture / Dark Matter), then class chips. These are the same filters as the landing page dropdowns, and the browser remembers them.
- A text filter. It matches:
  - name and prefab;
  - grade, role, attribute, generation, class;
  - element and element code. Dots are ignored, so `psid` finds P.S.I.D.
- The list, grouped by grade. Each row shows an icon, an element dot (when the model has one element only) and the variant count.

### Monster page `#/monster/<model id>[/<monster id>]`

One page per **model**. Its cards, top to bottom:

1. **Header:**
   - classes and elements;
   - role (Attacker / Defender / Supporter);
   - Flying / Ground;
   - buttons to other models with the same name (e.g. Base / P.S.I.D. / A.N.M.I. Singleraid).
2. **Profile:** large art, model grade, size, attribute, prefab, model id, generation, element codes, variant count.
3. **Variants** (when there is more than one): one row per MonsterTable row, with name, monster id, class, element, weak-to and number of spawn places. Clicking a row picks that variant for the cards below.
4. **Selected variant:** info text, class, element, weak-to, passive skill id (if any).
5. **Skills:**
   - A table of named skills: weapon, damage type, fire type, shots, damage, interceptable.
   - The descriptions as a list under it.
   - "+ N unnamed" counts skills that have no name text.
6. **Appears in:**
   - Every place this variant spawns, one table per kind (Campaign, Towers, Raids, Events, Other), with level. Stages the site has pages for are linked.
   - The toggle **This variant / All variants** merges every variant of the model and adds a **Variant** column (element dot, name, EXCEED tag). The browser remembers the choice.
7. **Parts** (when the model has more than one): part name, slot, HP %, damage passed to body %, breakable, HP bar shown or hidden.

The page deliberately shows **no HP/ATK/DEF by level**; the user asked for that to be left out. Section 9 notes where the stats live, in case you need them.

---

## 2. Models vs variants

- **Monster model** [data]: a row of `MonsterModelTable` (234 rows). It is the rig: one 3D body with its art, size and parts.
  - `id`: the model id; the page URL uses it.
  - `mon_prefab`: e.g. `btg001`, `bbg004_dmtr`, `xba004_dmtr`. It names the art files and the AI.
  - `grade`: Boss / Centurion / Elite / Minion / Thrash.
  - `monster_generation`: Normal / DarkMatter.
  - `size`: Small / Medium / Big / Huge.
  - `attribute`: Metal / Bio / Energy / Unknown / None.
  - `move_type`: Walk / Fly.
  - `class`: Attacker / Defender / Supporter. The page calls this **role**.
  - `category_type_1`: e.g. `Air_Attacker`. Not shown.
- **Monster variant** [data]: a row of `MonsterTable` (2,212 rows), linked to its model by `monster_model_id`. Every model has at least one row; most have many.
  - Variants differ by element code, class, HP/ATK/DEF ratios, skills, AI and the content they were made for (raid, event, tutorial, museum versions).
  - Waves and stages refer to these ids, so "where it appears" is per variant.
- **Model name** [derived]: the most common `appearance_localkey` text among its variants (fallback: `name_localkey`, then the prefab). For example, "Shank" for model 112001, whose variants are named "Shank H.S.T.A.", "Shank P.S.I.D.", …
- **Same-name models** [derived]: when two models share a name (e.g. `bbg004_dmtr`, `bbg004_golden`, `bbg004_hologram_hsta`), the page labels each with its prefab suffix. Element-code suffixes are written as codes ("P.S.I.D."), the rest capitalised ("Golden", "Museum").
  - These are separate models: their own rig and art, with their own variant lists.
  - They are linked from the header, but **not** merged into "All variants".

## 3. Element codes and elements

- **Element** [data]: `MonsterTable.element_id`, an array that in practice always holds one id. It is looked up in `ElementTable`.
  - `ElementTable` ids: 100001 Fire, 200001 Water, 300001 Wind, 400001 Electronic, 500001 Iron.
  - The page shows `element_name_localekey` text, which reads "Electric" for 400001.
- **Weak to** [data + inferred]: `ElementTable.weak_element_id` of the monster's element. The page reads it as "this element takes extra damage from that one":
  - Fire is weak to Water.
  - Water is weak to Electric.
  - Electric is weak to Iron.
  - Iron is weak to Wind.
  - Wind is weak to Fire.

  The reading is [inferred]; the data only says "weak element". It matches the in-game element cycle.
- **Element code** [data]: the "Code: X" line of the variant's info text (`description_localkey`). Five codes exist, and each almost always goes with one element [derived from counting rows]:

  | Code | Element | Rows |
  |---|---|---:|
  | H.S.T.A. | Fire | 579 |
  | P.S.I.D. | Water | 400 |
  | A.N.M.I. | Wind | 363 |
  | Z.E.U.S. | Electric | 359 |
  | D.M.T.R. | Iron | 348 |

  - **Quirk:** 32 rows break the pairing (e.g. 7 D.M.T.R. rows are Electric, 4 P.S.I.D. rows are Wind).
  - The page always shows the real `element_id`. The code is only a label.
  - Base variants without a code (131 rows) have info text like "Type: Bio / Grade: Husk" instead.
- Variant names usually end in the code ("Peacock P.S.I.D.").

## 4. Exceed

- **Exceed versions** [data]: 356 MonsterTable rows whose name starts with "Exceed" (e.g. "Exceed Peacock D.M.T.R."), spread over 54 models.
  - They sit **on the same model** as the plain version.
  - All 356 have `ui_grade` = Master.
- **Exceed as a class** [data]: only 23 rows say "Grade: Exceed" in their info text. The others still say "Grade: Master".
- **EXCEED tag** [derived]: in "All variants" the tag appears when the name starts with "Exceed" **or** the info-text class is Exceed.
- [inferred]: Exceed looks like a stronger re-release of the same monster used in later content. The page doesn't show stats, so this is not checked here.

## 5. Generation (Rapture / Dark Matter)

- **Generation** [data]: `MonsterModelTable.monster_generation`. It has only two values:
  - `Normal`, shown as **Rapture** (194 models);
  - `DarkMatter`, shown as **Dark Matter** (40 models).
- 256 variants say "Generation: Dark Matter" in their info text, which agrees.
- No other faction or race field exists in these tables.
- The element codes are a different grouping and are not generations.

## 6. Class and grade

There are three different things here.

| Name on the page | Source | Values |
|---|---|---|
| **Grade** (sidebar groups, "By grade") | `MonsterModelTable.grade` [data] | Boss 71, Centurion 43, Elite 55, Minion 58, Thrash 7 (models) |
| **Class** (filters, variant table, header) | "Grade: X" line of the variant's info text `MonsterTable.description_localkey` [data]; if missing, `MonsterTable.ui_grade` [data], with Selfless = Husk | Husk, Servant, Master, Exceed, Lord, Tyrant, Heretic, Queen |
| **Role** | `MonsterModelTable.class` [data] | Attacker, Defender, Supporter |

- **Class per model** [derived]: the set of its variants' classes. A model matches a class filter if any variant has it. Model counts: Servant 58, Tyrant 57, Master 55, Lord 41, Heretic 16, Husk 6, Queen 3, Exceed 3.
- **Class order** used on the page: Husk, Servant, Master, Exceed, Lord, Tyrant, Heretic, Queen. This is [inferred] as a rough strength order; placing Exceed after Master is a guess.
- **Quirk:** `ui_grade` and the info text disagree on some rows:
  - 9 Lord rows say "Grade: Tyrant";
  - 3 Master rows say "Tyrant";
  - 1 Selfless row says "Lord";
  - 23 Master rows say "Exceed".

  The page trusts the info text, since that is what the game shows the player.
- The colour of class labels follows `ui_grade` (`grade-<ui_grade>` CSS).

## 7. Skills

- **List** [data]: `MonsterTable.skill_data[].skill_id`, with zeros skipped; up to 30 per variant. The `use_function_id_skill` / `hurt_function_id_skill` arrays beside each id are not shown.
- **Details** [data]: each id is a row of `MonsterSkillTable`:

  | Column | Field |
  |---|---|
  | Name | `name_localkey` (Locale_Skill) |
  | Description | `description_localkey` |
  | Weapon | `weapon_type` (AR, SR, RL, MG, SG, SMG) |
  | Damage type | `attack_type` (Metal / Bio / Energy / Fire / Iron …) |
  | Fire | `fire_type` (Instant, ProjectileCurve, InstantAll_FrontRay, Barrier …), split into words |
  | Shots | `shot_count`, shown only when above 1 |
  | Damage | `skill_value_01`. When `skill_value_type_01` = `Percent`, it is shown as value ÷ 100 % (500 → 5%); otherwise the raw number. [inferred]: the percent is of the monster's ATK. |
  | Interceptable | `is_destroyable_projectile` = true. [inferred]: players can shoot the projectile down. The descriptions often say "This attack can be intercepted." |

- **Unnamed skills** [derived]: skills whose name text is missing are left out of the table and counted as "+ N unnamed". There are 2,236 such skill ids, out of 9,182 skill references (none missing from MonsterSkillTable). [inferred]: these are internal helper actions such as movement, phase switches and summons.
- **Passive skill** [data]: `MonsterTable.passive_skill_id`, shown as a bare id; 91 rows have one. These ids match rows of `StateEffectTable` (an effect table). The page does not decode them.

## 8. Parts

- **Source** [data]: `MonsterPartsTable` rows with the model's `monster_model_id` (724 rows over 234 models).
- **Which parts are shown** [derived]: the main part (`is_main_part`) plus every part with a name (`parts_name_localkey`, e.g. "Large Caliber Rifle L"). Rows with the same slot, name, HP and damage are shown once. The card is hidden when only the body is left.

| Column | Field | Unit |
|---|---|---|
| Part | `parts_name_localkey` text ("Body" for the main part); MAIN tag on `is_main_part` | |
| Slot | `parts_type` (Body, Weapon_01 …, Arm_Left, Head, Leg_Front_Left …) | |
| HP % | `hp_ratio` ÷ 100 | % of the monster's HP [inferred] |
| To body % | `damage_hp_ratio` ÷ 100; "—" for the main part | % of damage dealt to this part that also hits the body [inferred] |
| Breakable | `is_parts_damage_able` | yes/no |
| HP bar | `visible_hp` | shown/hidden in battle [inferred] |

Not shown: `defence_ratio`, the resist ratios, `destroy_after_anim`, `linked_parts_id`, `weapon_object`, `parts_skin`.

## 9. Where they appear

### How the index is built [derived]

`lib/monsters.js` makes one pass over **every wave file** in `WaveDataTable/` (`WaveDataTable.<group>.json`, about 110 MB). It runs on the first Monsters request, not at server start, and takes about 1.6 s.

- Each wave row is keyed by `stage_id`, which the game calls the **spot id**.
- The monsters of a wave are its `target_list` plus every `wave_data[].wave_monster_list[].wave_monster_id`.
- Spot ids are then matched to every table that starts a battle from a spot:

| Kind | Group shown | Table · field | Linked page |
|---|---|---|---|
| Campaign | Chapter N · Normal/Hard/Story | `CampaignStageTable.spot_id` (labels from the Stages catalogue) | `#/stage/campaign/<id>` |
| Towers | tower name | `TowerTable.spot_id` | `#/stage/tower/<id>` |
| Raids | Union Raid / Solo Raid | `UnionRaidPresetTable.wave`, `SoloRaidPresetTable.wave` | raid boss page |
| Raids | Interception | `InterceptNormal/Special/AnomalousTable.spot_id` | `#/raid/intercept/<key>` |
| Raids | Solo Raid Museum | `MuseumStageModeTable.wave` | `#/raid/museum/<key>` |
| Raids | Co-op raids | `MultiRaidTable.spot_id`, `spot_id_easy` | — |
| Events | event name (· Part N) | `EventDungeonSpotBattleTable.spot_id`, `ArchiveEventDungeonSpotBattleTable.spot_id` | — |
| Events | Event quests | `EventQuestStageTable.spot_id` | — |
| Other | Lost Sector | `LostSectorStageTable.spot_id` (sector name from `LostSectorTable`) | — |
| Other | Simulation Room | `SimulationRoomBattleEventTable.spot_id` | — |
| Other | Favorite item quests | `FavoriteItemQuestStageTable.spot_id` | — |
| Other | Shooting range | `ShootingRangeTable.spot_id` | — |

- **Event names** [derived], via this chain:
  1. battle id → `EventDungeonStageTable` (`stage_id` → `group`);
  2. → `EventDungeonDifficultTable` (`stage_group` → `group`, difficulty `name`);
  3. → `EventDungeonTable` (`difficult_group` → `id`);
  4. → `EventStoryTable` (`dungeon_id_1` / `dungeon_id_2` → `event_id`; Part 1/2 when there are two);
  5. → `EventManagerTable.name_localkey`.

  The stage label is the difficulty name plus `short_name` ("Hard 1-2 EVENT"). Archive tables replay the same stages, so a spot is counted once.
- **Level** [data]: `monster_stage_lv` of the stage, floor, preset or mode. This is the level the monsters' stats are read at; it is not a player level.
  - Where the same label appears at several levels, the page shows a range ("67–80").
- **Tower floors** [derived]: floors of one tower where the variant spawns are joined into ranges when the gap is at most 25 floors (`TOWER_GAP`). The bracket gives how many floors in the range actually have it: "Floors 51–59 (4)". The link opens the first floor.
- **Duplicates** [derived]: rows with the same label and link are merged.
- **Counts** [derived]: "Spawns" in the Variants table, and the numbers on the "Where they appear" cards, count these merged rows. Tower ranges count their floors.

### All variants [derived]

Done in the browser from the same page data: every variant's rows of the model are put together and sorted by group, then label. There is **one row per variant per place**, so a stage that has both "Peacock P.S.I.D." and "Exceed Peacock A.N.M.I." is listed twice. The Variant column shows:
- the variant's element dot;
- its name, linked to that variant;
- an EXCEED tag (section 4).

Same-name *models* (section 2) are not included.

### Stats (not shown on the page)

For reference, the Stages section computes monster stats like this:

> HP = `MonsterStatEnhanceTable.level_hp` (row with `group_id` = `MonsterTable.statenhance_id` and `lv` = stage level) × `MonsterTable.hp_ratio` ÷ 10000

ATK and DEF use the same formula with `level_attack` / `attack_ratio` and `level_defence` / `defence_ratio`. Most ratios are 10000 (= 100%); some special variants have `hp_ratio` 99999999.

## 10. Art

- Pictures are found by the model's `mon_prefab` [derived]:
  - **small icon:** `si_<prefab>`, used in lists, galleries, hub cards and table rows;
  - **large art:** `full_<prefab>`, used in the Profile card.
- A variant rig without its own picture falls back to its base: `bbg004_hologram_hsta` → `bbg004_hologram` → `bbg004`. The page then uses the other size if one is still missing.
- Files are extracted from the game's HD `icons-monster` bundles (251 small icons from `icons-monster(hd)`, 118 large from `icons-monster_full(hd)`). They are web-copied to `public/img/icons-monster/` as lowercase `.webp`.
- Only `xbg002_tddtest` (a test model) has no art.

## 11. Known data quirks

- 22 MonsterTable rows have no name text. The page shows the id, and one model ("bbg003_ce002") falls back to its prefab as its name.
- Element code and element disagree on 32 rows (section 3). The page shows the element.
- `ui_grade` and the info text's class disagree on about 36 rows (section 6).
- "Code " and "Grade " sometimes have a stray space before the colon in the info text. The page handles that.
- `is_irregular` is true on 345 rows. The page keeps it in the data but doesn't show it; its meaning is unknown.
- Resist ratios (`energy_resist_ratio`, `metal_resist_ratio`, `bio_resist_ratio`) usually put 10000 on the one that matches the model's `attribute`. They are not shown on the page. [inferred]: they tie into the damage type of attacks.
- 8 models never appear in any of the spawn sources above. These may be tutorial, test or unused monsters [inferred], or monsters used by content whose tables aren't in section 9.
