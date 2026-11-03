# Nikke Library — Stages page guide

This guide covers the **Stages** section of the Nikke Library: a local web app that reads NIKKE (*Goddess of Victory: NIKKE*) game data dumped to JSON. It explains what the page shows, the game mechanics behind each value, and where each number comes from, so it can be read without any other context.

- Data tables: `D:\Nikke Datamine\mpkparser\jsons\<Table>.json`. Each file is either a JSON array or `{ "records": [...] }`.
- Locale text (names): `D:\Nikke Datamine\nikke-downloader\json-locale`. Fields ending in `_localkey` / `name_locale_key` are keys into this text.
- Code: `lib/stages.js` builds the data, `public/stages.js` draws the page, and `public/app.js` holds the shared random-box renderer.
- Markers used below: **[data]** means read directly from a table; **[computed]** means worked out by the library from table values; **[inferred]** means the library's reading of the data, not confirmed by the game.

---

## 1. Using the page

- **Landing page (`#/stages`)**
  - A card for each of the 5 towers shows its floor count and the days it's open.
  - A card for each campaign chapter shows its stage count per mode and its level range.
  - A card opens the tower's floor 1, or the chapter's first stage. A chapter card uses the difficulty currently picked in the sidebar, or the first one the chapter has.
- **Sidebar**
  - Two tabs: Campaign and Towers.
  - Campaign has Normal / Hard / Story chips. Chapters fold open to their stages; BOSS stages are tagged.
  - Towers has one chip per tower. Floors are grouped in blocks of 100, and typing a number in the filter finds a floor.
- **Stage or floor page (`#/stage/campaign/<id>`, `#/stage/tower/<id>`)**, top to bottom:
  1. **Header**
     - Breadcrumb, then stage label (e.g. "5-16", "EX 1", "Floor 120").
     - Links to the same stage in the other modes, or the same floor number in the other towers.
     - Badges: category (Normal/Hard/Boss/Extra), monster level (`Lv`), recommended combat power (`CP`), and "Quick battle" if allowed.
     - Prev/Next buttons; the ← → keys do the same.
  2. **Field**: mode, time limit, enemy total by distance, map theme and time of day, background asset name.
  3. **Story**: the cutscenes played before and after the battle, linked to the Stories section when readable.
  4. **Enemy roster**
     - One row per distinct enemy: small icon, Total spawned, Grade, Element, HP, ATK, DEF.
     - The target enemy comes first, tagged TARGET.
     - Large numbers are shortened (1.23M); hover to see the exact value.
  5. **Waves**: one row per enemy per wave, with columns Wave, Enemy, Count, Spawn (s) and Wave total.
  6. **Rewards**
     - Columns: Reward, Amount, Chance.
     - A random box has a **Contents** row under it that opens to show what the box can give.

On a phone the sidebar folds into a "Browse Stages" bar, and wide tables scroll sideways.

---

## 2. Stages, chapters and modes

**Campaign stages** come from `CampaignStageTable`, and chapters from `CampaignChapterTable` (`id`, `chapter`, `name_localkey`).

| Field | Meaning |
|---|---|
| `chapter_id` | Chapter the stage belongs to |
| `chapter_mod` | Difficulty / mode: `Normal`, `Hard` or `Story` |
| `stage_category` | `Normal`, `Hard`, `Boss` or `Extra` |
| `name_localkey` | Stage name (e.g. "5-16 STAGE"); the page drops the trailing "STAGE" |
| `monster_stage_lv` | Level of every enemy in the stage (used for their stats) |
| `standard_battle_power` | Recommended squad combat power (CP) |
| `is_use_quick_battle` | Whether quick battle is allowed |
| `spot_id` | Which wave set the battle uses (key into WaveDataTable `stage_id`) |
| `reward_id` | First-clear reward (key into `RewardTable`) |
| `enter_scenario_type` / `enter_scenario`, `exit_scenario_type` / `exit_scenario` | Cutscenes; the page shows only `Dialog` ones |

- **EX stages:** `Extra` stages are labelled "EX 1", "EX 2"… in id order within their chapter and mode. **[computed]**
- **Linking modes:** the same stage in Normal, Hard and Story is matched by label. Hard labels only add "HARD" ("35-6 HARD"), so the library compares labels with "HARD" removed. **[inferred]**

**Towers** come from `TowerInfoTable` (one row per tower) and `TowerTable` (one row per floor).

- **`TowerInfoTable`:**
  - `id`: ALL, ELYSION, MISSILIS, TETRA or PILGRIM.
  - `name`: locale key for the tower's name.
  - `day_of_week`: days the tower is open, as 0 = Sunday … 6 = Saturday.
  - `clear_limit`: floors you can clear per day; 0 = no limit.
- **Tower names on the page:** the ALL tower is shown as "Tribe Tower". The ELYSION, MISSILIS and TETRA towers are open three days a week with 3 clears a day. The PILGRIM tower is named "Pilgrim/Over-spec Tower".
- **`TowerTable`:** `type` (the tower id), `floor`, `monster_stage_lv`, `standard_battle_power`, `spot_id`, `reward_id`. These mean the same as for campaign stages.
- **Size:** 7,850 floors; the Tribe Tower has 1,650 and the four company towers 1,550 each.
- **Linking towers:** floors in different towers are linked by the same floor number. **[computed]**

**CP penalty (not shown on the page) [inferred]:** every stage and floor has `stage_stat_increase_group_id` = 40000, which points to `StageStatIncreaseTable`.

- Each row maps a range (`battle_power_ratio_min`/`_max`) to a `stat_increase`.
- The values run from −9000 (when the ratio is −4991 or lower) up to 0 (when the ratio is 0 or higher).
- Read in units of 1/10000:
  - the ratio looks like (your CP − recommended CP) / recommended CP;
  - `stat_increase` looks like the stat penalty when your squad is under the recommended CP (down to −90%).
- The library does not use this table.

---

## 3. Enemies: level and stats

- **Lookups:**
  - Each enemy id is a `MonsterTable.id`.
  - Its name comes from `name_localkey`, its grade from `ui_grade`, and its element from `element_id` → `ElementTable`.
  - Grades in the data: Servant, Master, Lord, Tyrant, Selfless, Heretic, Queen.
- **Stats** depend on the stage's `monster_stage_lv`:

  ```
  row = MonsterStatEnhanceTable where group_id = monster.statenhance_id and lv = stage monster_stage_lv
  HP  = floor(row.level_hp      × monster.hp_ratio      / 10000)
  ATK = floor(row.level_attack  × monster.attack_ratio  / 10000)
  DEF = floor(row.level_defence × monster.defence_ratio / 10000)
  ```

  - Ratios are in 1/10000; 10000 = ×1.0 is the most common value, and 5000 and 15000 also occur.
  - The values are computed with integer maths (BigInt), so very large HP stays exact. **[computed]**
  - If the level has no stat row, the roster shows "—".
  - The `StageStatIncreaseTable` penalty from section 2 is **not** applied.
- **Icons:** the small "si" icon comes from `MonsterTable.monster_model_id` → `MonsterModelTable.mon_prefab` → image `si_<prefab>`. A variant model with no icon of its own falls back to its base model (e.g. `bbg004_hologram_hsta` → `bbg004_hologram` → `bbg004`).

---

## 4. Waves and spawn timing

**Wave sets** come from `WaveDataTable` (folder `WaveDataTable/WaveDataTable.<group>.json`), one record per `stage_id`, which matches the stage's `spot_id`.

- To find which file holds a stage, the library reads `WaveData.GroupDict.csv` from the mpk dump. If that file is missing, it scans the folder.

| Field | Meaning |
|---|---|
| `spot_mod` | Battle mode: `Campaign`, `Defense`, `BaseDefense`, raid modes, `ShootingRange`, `Intercept`, … |
| `battle_time` | Time limit in **seconds** (shown as "1m 30s") |
| `theme`, `theme_time`, `background_name` | Map theme, day/night, background asset |
| `target_list` | Enemy id(s) that must be killed: the TARGET |
| `wave_repeat` | `true` = the waves loop for the whole battle |
| `wave_data[]` | The waves in order: `wave_path` plus `wave_monster_list[]` (`wave_monster_id`, `spawn_type` Drop/Dash/Jump…) |
| `close_monster_count`, `mid_monster_count`, `far_monster_count` | Number of enemies spawned per distance band (see section 5) |
| `monster_count`, `private_monster_count` | Present but not used by the page; meaning unknown |

- **Slots:** a wave's `wave_monster_list` is a list of **slots**. The same enemy can fill several slots, and empty slots (id 0) keep their position. Waves whose slots are all empty are dropped.
- **Spawn lists**, i.e. how many enemies actually appear and when:
  - Each `wave_path` names a spawn list stored in the game's core "wavedata" bundles.
  - These were exported to `D:\Nikke Datamine\nikke-downloader\wavedata-json\<name>.txt` (JSON). There are 717 lists.
  - File names differ from `wave_path` in case and spaces, so they are matched case- and space-insensitively.
  - Each entry is `{ MonsIndex, SpawnTime, StartPoint, ActionPoint, DirPoint, AttackTime, … }`.
  - `MonsIndex` is the **1-based slot number** in `wave_monster_list`, and `SpawnTime` is in seconds from the start of the wave.
- **Per wave, the page shows:**
  - **Count:** how many entries in the spawn list point at a slot holding that enemy.
  - **Spawn (s):** the first–last `SpawnTime` of that enemy in the wave (e.g. "0.5–3"; a single value when they all spawn at once).
  - **Wave total:** the sum of the counts.
- **Missing spawn lists:** without a spawn list, Count falls back to the number of slots holding that enemy, and the note under the table says so. **[computed]**
- **Wave path names:** they encode an air/ground type and a distance, e.g. `path_grd_close_small_001`, `path_fly_mid_elite1_802`.
- **REPEATS tag:** shown in the Waves header when `wave_repeat` is true.

---

## 5. Enemy totals

There are two independent totals.

1. **Roster "Total" column [computed]:** for each enemy, the sum of its Count over all waves.
   - **Repeating waves:** shows "—", because the battle loops and has no fixed total. The note says so. This is about 1 in 5 campaign stages (86 of 463 sampled).
   - **Missing spawn lists:** if any wave has no spawn list, the total is prefixed "≈", because it counts slots, not spawns.
2. **Field "Enemies" line [data]:** `close_monster_count + mid_monster_count + far_monster_count` from WaveDataTable, shown as e.g. "45 · close 6 · mid 39 · far 0".
   - For repeating stages it reads "39 per cycle". There, the sum equals one pass through the waves (checked on Defense/BaseDefense stages). **[inferred]**

**How the two totals compare (the "4% mismatch"):**

- I checked every campaign stage and tower floor that is not repeating and has spawn lists for all its waves: 10,397 in total.
- **Matches:** the distance sum equals the spawn-list total in 9,967 of them (96%).
- **Mismatches:** the other ~430 (4%) differ.
- **Known causes:**
  - Tutorial and scripted stages use wave paths with no distance in the name (e.g. `path_grd_tutorial_*`, boss paths like `b_g_landeater_01`).
  - The distance split differs from what the path names suggest, while the sum still matches. E.g. one stage's spawn lists give close 6 / mid 43, and the table says close 7 / mid 42 (both 49). So the game seems to assign each spawn's distance on its own, not by the path name. **[inferred]**
- **Uninvestigated:** some mismatches have different sums too. Their cause hasn't been looked into.

---

## 6. Rewards and drop chances

**`reward_id`** points into `RewardTable`, whose fields are `user_exp`, `character_exp` and `rewards[]`.

- Each entry has `reward_type`, `reward_id`, `reward_value` (the amount) and `reward_percent`.
- `user_exp` is shown as "Commander EXP" at 100%.
- Entries with type `None` are skipped.

- **Chance:** `reward_percent` uses **1,000,000 = 100%**, so `chance % = reward_percent / 10000`.
  - Nearly all entries are 1,000,000 (guaranteed).
  - A few are lower, e.g. 850000 = 85% or 362500 = 36.25%.
- **Reward names:** the library looks them up by `reward_type`:
  - `Item`: ItemConsumeTable, ItemMaterialTable, ItemPieceTable, ItemHarmonyCubeTable or ItemEquipTable.
  - `Equipment_*`: ItemEquipTable.
  - `Character`: Character/CharacterTable.
  - `CharacterCostume`: Character/CharacterCostumeTable (`costume_name_locale`).
  - `UserTitle`: UserTitleTable (`name_locale_key`).
  - Also FavoriteItemTable and ProfileCardObjectTable.
  - `Bgm`: the track title from JukeboxListTable, plus " (BGM)".
- **`Currency`:** `reward_id` is a number from the `NK.StaticData.CurrencyType` enum, which lives in the parser's `customTypes.txt`. The enum maps it to a CurrencyTable string id, and that table's `name_localkey` gives the name, e.g. Credit, Gem, Core Dust, Battle Data Set.
- **Unresolved names:** anything that can't be resolved shows as "<type> <id>".

---

## 7. Random box contents

A reward is a **random box** when its type is `ItemRandomBox`, or `Item`, and its id is an `ItemConsumeTable` row with `use_type = ItemRandomBox`.

- That row's `use_id` is a group in **`ItemRandomTable`**.
- Each group row has `group_id`, `order`, `reward_type`, `reward_id`, `reward_value_min`, `reward_value_max` and `ratio`.
- There are 283 groups and 204 box items.
- Other box kinds (`SelectBox`, `BundleBox`, `CurrencyTimeReward`) are **not** expanded.

- **Chance [inferred]:** the library treats one opening as **one weighted draw**: `chance % = ratio / (sum of ratios in the group) × 100`.
  - The group totals vary (100, 3000, 6000, 10000, 99996, 100008…), so they must be normalised.
  - A group summing to 6000 can't be read as independent percentages out of 10000.
  - The game data does not state this directly, and it hasn't been confirmed in game. The page also doesn't show `percent_display_type`, which is `None` for every random box.
- **Amount:** "×N", or "×min–max" when `reward_value_min` ≠ `reward_value_max`.
- **Nested boxes:** a box that contains another random box gets its own Contents toggle.
- **Equipment** in a box is grouped instead of listed piece by piece. **[computed]**
  - **Gear details:** from `ItemEquipTable`.
    - Slot comes from `item_sub_type`: `Module_A` Head, `Module_B` Body, `Module_C` Arm, `Module_D` Leg.
    - `class` is Attacker, Defender, Supporter or All.
    - Tier is `item_rare` (T1–T10).
  - **Manufacturer** depends on the entry's `reward_type`, through `ItemEquipCorpSettingTable` (`key`, and `ratio_none`/`ratio_missilis`/`ratio_elysion`/`ratio_tetra`/`ratio_pilgrim`/`ratio_abnormal` out of 10000):
    - `Equipment_None`: no manufacturer.
    - `Equipment_MISSILIS` / `_ELYSION` / `_TETRA` / `_PILGRIM` / `_ABNORMAL`: that manufacturer only.
    - `Equipment_Random_01`: 20% each of None, Missilis, Elysion, Tetra, Pilgrim.
    - `Equipment_Random_02`: 25% each of Missilis, Elysion, Tetra, Pilgrim.
    - `Equipment_Random_03`: 20% each of Missilis, Elysion, Tetra, Pilgrim, Abnormal.
    - Equipment given as a plain `Item` is treated as "No manufacturer". **[inferred]**
  - **Manufacturer names:** from `CorporationInfoTable.corporation_name`.
  - **Default view:** rows are grouped by tier + slot with all classes and manufacturers combined. The class shows as "Any" when it covers all three classes, or the item is class `All`.
  - **"By manufacturer" toggle:**
    - One block per manufacturer, in the order Elysion, Missilis, Tetra, Pilgrim, Abnormal, then No manufacturer.
    - Each block has a heading row with the manufacturer's total chance, then its tier + slot rows.
    - Each row's chance = the item's draw chance × the manufacturer's share.
    - The toggle applies to every box on the site and is remembered.
  - **Example:** Manufacturer Arms, the 21-32 BOSS reward, is group 1330100. It holds T9 head/body/arm/leg for all three classes with `Equipment_Random_03`. Default view: Head/Body/Arm/Leg at 25% each. By manufacturer: 5 blocks of 20%, each row 5%.

---

## 8. Known data quirks

- Some boxes list the same name twice (e.g. "Battle Data Set Case" ×2). These are different item ids in the data.
- Chapter 0 and the tutorial stages use wave paths with no distance, so their distance split is unreliable.
- The way modes are linked relies on the label text. A Hard stage whose label differs in more than "HARD" won't link.
- `monster_count` and `private_monster_count` in WaveDataTable are not explained by the data and are not used.
- About 5 of 2,212 monsters have no small icon. One model, `xbg002_tddtest`, has no icon of its own; it looks like a test model.
- Raid pages reuse the Field, Enemy roster and Waves cards described here.
