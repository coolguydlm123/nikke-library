# Raids page — guide to the data and mechanics

This guide covers the **Raids** section of Nikke Library, a local web app that browses NIKKE game data. It is meant to stand alone: you can hand it to someone with no other context and ask about the raid mechanics behind the page.

- Data tables: JSON files in `D:\Nikke Datamine\mpkparser\jsons` (one file per table, e.g. `UnionRaidPresetTable.json`; each holds an array of rows, or `{ records: [...] }`).
- Text: locale keys such as `Locale_System:bbg003_name` are looked up in the English locale files (`D:\Nikke Datamine\nikke-downloader\json-locale`).
- Code: `lib/raids.js` (builds the data), `public/raids.js` (draws the page). Monster stats, enemy lists and rewards come from the Stages section's code (`lib/stages.js`).

Labels used below:
- **[data]**: read straight from a table field.
- **[derived]**: computed by the app from table fields, with the formula given.
- **[inferred]**: our reading of what a field means in the game. It is not stated anywhere in the data.

---

## 1. What the page shows and how to use it

Open `#/raids`. The landing page is a grid of boss cards with art:
- the latest Union Raid season's bosses;
- the 8 newest Solo Raid seasons;
- links to every Union and Solo Raid season;
- Interception (Normal, Special, Anomalous) bosses;
- Solo Raid Museum bosses by hall.

`#/raids/union` and `#/raids/solo` list every season. On a desktop the left sidebar does the same job, with four tabs (Union Raid, Solo Raid, Interception, Solo Raid Museum) and a filter box.

Boss pages:

| Page | URL | Shows |
|---|---|---|
| Union / Solo Raid boss | `#/raid/union/<season id>/<boss>` | One card per difficulty (Normal, Hard, Trial). Each card has a tier table (level, target HP/ATK/DEF, rewards), HP stages if any, the enemy roster and the waves. |
| Interception boss | `#/raid/intercept/<tier>-<id>` | Battle field info, HP stages with damage rewards and bonus drops, enemy roster and waves, damage reward tables. |
| Museum boss | `#/raid/museum/museum-<id>` | One card per mode (Challenge, No Limit): HP stages, roster, waves, missions with ranking points and rewards, plus a link to the original Solo Raid season. |

Value formatting: large numbers are shortened (`35.84M`, `1.12B`); hover over one to see the exact value. `∞` means "no upper limit". Box rewards have a **Contents** toggle that lists what the box can contain.

---

## 2. Shared building blocks

### 2.1 Monster level → stats
Every raid row sets a `monster_stage_lv`. A monster's HP, ATK and DEF at that level are **[derived]**:

```
row  = MonsterStatEnhanceTable where group_id = MonsterTable.statenhance_id and lv = monster_stage_lv
HP   = row.level_hp      × MonsterTable.hp_ratio      / 10000   (integer division)
ATK  = row.level_attack  × MonsterTable.attack_ratio  / 10000
DEF  = row.level_defence × MonsterTable.defence_ratio / 10000
```

The ratios are in basis points (10000 = 100%).

Other level fields on raid rows are not used by the page: `dynamic_object_stage_lv`, `cover_stage_lv` and `character_lv` / `limit_character_lv`. **[inferred]** They are the level of stage objects, the level of cover, and the level Nikkes are set to (0 = no sync).

### 2.2 Waves and enemies
A raid row's `wave` (Union, Solo, Museum) or `spot_id` (Interception) is a stage id in the wave data:
- `WaveDataTable/WaveDataTable.<group>.json`, with the group found via `WaveData.GroupDict.csv` in the mpks.
- `target_list` holds the **target** monster(s). The first target is "the boss" whose HP and stats the page shows.
- `battle_time` is the time limit in seconds.
- `theme` / `background_name` give the field.
- `wave_data[].wave_monster_list` gives the enemies per wave.
- Spawn timing comes from separate spawn files (`nikke-downloader/wavedata-json`).

The **roster** lists every distinct enemy in the battle with grade (`MonsterTable.ui_grade`), element and stats. On Union/Solo pages it shows stats at the lowest and highest level among the tiers that share the wave.

### 2.3 Rewards
`reward_id` values point into `RewardTable`. Each row has `user_exp`, `character_exp` and a `rewards[]` list of `{ reward_type, reward_id, reward_value, reward_percent }`.
- `reward_value` is the amount.
- `reward_percent` is the drop chance in units of 1/10000 (`1000000` = 100%). The page shows the percentage only when it is under 100%.
- **Random boxes:** a reward is a box when its type is `ItemRandomBox`, or when it is an `Item` that `ItemConsumeTable` lists with `use_type = ItemRandomBox`. The box's contents come from `ItemRandomTable` group `use_id`.

### 2.4 HP stages (`MonsterStageLvChangeTable`)
This is the "staged HP bar" gimmick used by trial bosses, Interception and the Museum. The fields are `group`, `step`, `condition_type`, `condition_value_min`, `condition_value_max`, `monster_stage_lv`, `target_passive_skill_id`, `gimmickobject_lv_control`.
- Every row's `condition_type` is `DamageDoneToTargetMonster`: each step covers a range of **total damage dealt to the target**.
- Step HP is **[derived]**: `condition_value_max − condition_value_min`, plus 1 for every step except the first. The first step starts at 0, and later steps start at the previous max + 1.
- A last step with `condition_value_max = 0` is **open-ended** (shown as ∞).
- **[inferred]** When a step starts, the boss switches to that step's `monster_stage_lv`, so its ATK and DEF jump. The page shows ATK and DEF at each step's level and marks a level increase with ▲. Example: Anomalous "Mirror Container" goes 250 → 300 → 350 … 450 across 9 steps.
- `target_passive_skill_id` (usually `7000001`) is a passive skill applied to the target at that step. **[inferred]** The page shows the id but doesn't resolve the skill.
- `gimmickobject_lv_control` (0/1): **[inferred]** whether stage objects also level up. It is not used by the page.
- `passive_skill_id` is always 0.

---

## 3. Union Raid

Union Raid is the guild raid: a season has up to 5 bosses, and each boss comes back stronger after it is defeated.

Tables:
- `UnionRaidManagerTable`: one row per season (`id` 1000001…1000046, `monster_preset`).
- `UnionRaidPresetTable`: the bosses, joined by `preset_group_id = monster_preset`.

The page numbers seasons by row order: "Season N" is the Nth manager row. It does not show season dates.

Preset row fields:

| Field | Meaning |
|---|---|
| `wave_order` | Boss slot 1–5 (shown as "Boss N"). |
| `difficulty_type` | `Normal` or `Hard`. |
| `is_trial` | `true` marks a Trial row. The page treats it as a separate "Trial" difficulty. |
| `wave_change_step` | The boss's **tier** (shown as "Tier N"). **[inferred]** This is how many times the boss has been defeated plus one: Normal bosses have tiers 1–10, Hard bosses 1–3. |
| `monster_stage_lv` | Boss level at that tier. |
| `wave` | Battle stage id (§2.2). |
| `wave_name`, `wave_description` | Boss name and description. The page groups rows by name, so one page = one boss across all tiers and difficulties. |
| `monster_stage_lv_change_group` | HP stages (§2.4). Only used by Trial rows (21 rows in total). |
| `reward_id` | Clear reward. Set on Normal rows only; Hard and Trial rows are 0. |
| `monster_image_si`, `monster_image`, `monster_spine` | Art names. The page instead takes art from the target monster's model. |

Example, Season 46:
- Normal: 5 bosses × 10 tiers, with levels rising from 173 → 216 (slots 1, 2, 4) or 181 → 226 (slots 3, 5).
- Hard: 5 bosses × 3 tiers, levels 273 → 323.
- Trial: one row, at slot 5 tier 4, level 324, with HP stages.

Not used by the page:
- `UnionRaidAllClearRewardTable`: all-clear rewards per day.
- `UnionRaidRankingTierTable`: season ranking tiers and rewards by rank.

---

## 4. Solo Raid

Solo Raid is the single-player raid: one boss per season, fought over increasingly hard stages.

Tables:
- `SoloRaidManagerTable`: season rows (`id`, `monster_preset`, `ranking_group_id`).
- `SoloRaidPresetTable`: the stages, joined by `preset_group_id`.

| Field | Meaning |
|---|---|
| `wave_order` | **Stage** 1–8 (shown as "Stage N"). |
| `difficulty_type` | `Common` for stages 1–7 (shown as Normal) and `Trial` for stage 8. |
| `wave_open_condition` | The preset id of the stage you must clear first (0 for stage 1). This means stages unlock in order. |
| `character_lv` | 0 on Common stages and 400 on Trial. **[inferred]** Nikkes are synced to level 400 on the Trial stage. |
| `quick_battle_type` | Always `StageClear`. **[inferred]** Quick battle unlocks after a clear. |
| `first_clear_reward_id`, `reward_id` | First-clear and repeat-clear rewards. Both are 0 on Trial stages. |
| `monster_stage_lv_change_group` | HP stages. Set on all 43 Trial stages. |

Example, Season 44: Stage 1–7 levels 45, 85, 120, 145, 175, 185, 200; Trial at level 390.

`SoloRaidRankingTable` (ranking rewards per `ranking_group_id`) is not used by the page.

---

## 5. Interception

Interception is a repeatable boss fight with a fixed boss. Rewards scale with the damage you deal.

Tables:
- `InterceptNormalTable`: shown as Normal Interception.
- `InterceptSpecialTable`: Special Interception.
- `InterceptAnomalousTable`: Anomalous (Anomaly) Interception.

The page only uses rows with `spot_type = WaveData`; all of these have `group = 1`. Rows with `spot_type = NKSMiniGame` (`group = 2`) reuse the same bosses for a minigame event and are skipped. The page shows 2 Normal, 5 Special and 5 Anomalous bosses, ordered by `order`.

| Field | Meaning |
|---|---|
| `name`, `short_name`, `description` | Boss text. |
| `monster_stage_lv` | Boss level. Normal: 73 and 158; Special: 287; Anomalous: 250. |
| `character_lv` (Normal/Special), `limit_character_lv` (Anomalous) | Nikke level. Special is 200, Anomalous is 400, Normal is 0. **[inferred]** The level Nikkes are synced/limited to. |
| `ticket_count` | Tickets per attempt (1). |
| `spot_id` | Battle stage id. |
| `monster_stage_lv_change_group` | HP stages (§2.4). |
| `condition_reward_group` | Damage-band rewards (`ConditionRewardTable`). |
| `percent_condition_reward_group` (Normal/Special) / `percent_condition_reward_groups[]` (Anomalous) | Extra chance-based reward groups, shown as "Bonus". Anomalous has two. |
| `use_fixed_result`, `fixed_damage`, `use_reward_priority`, `priority_grade`, `auto_charge_id`, `dummy_spot_id` | Not used by the page. **[inferred]** Related to quick battle, ticket refills and the result screen. |

`ConditionRewardTable` rows have `group`, `priority`, `type`, `value_min`, `value_max` and `reward_id`. A `value_max` of 0 means open-ended. Interception groups use the type `DamageDoneToTargetMonster`.

How the page joins rewards to HP stages **[derived]**:
- A reward band is attached to the HP stage whose `condition_value_min` equals the band's `value_min`.
- If every band in a group matches a stage, the group shows as a column of the HP-stage table.
- Otherwise the group gets its own "Damage rewards" or "Bonus rewards" table with From/To damage.

`Rank` / `RankPercent` condition groups (ids 1, 2, 210000, 210010) are used by other modes, not Interception.

`InterceptAnomalousManagerTable` holds Anomalous rotation dates (not shown). `InterceptNormalManagerTable` and `InterceptSpecialManagerTable` aren't used either.

---

## 6. Solo Raid Museum

The Museum lets you replay past Solo Raid bosses, grouped in halls.

Tables:

| Table | Fields | Notes |
|---|---|---|
| `MuseumGroupTable` | `group_name`, `ranking_point_id` | The halls; 3 halls. |
| `MuseumStageTable` | `group_id`, `stage_name`, `solo_raid_manager_id`, `buff_id`, `monster_id`, `season_start_date`, `season_end_date`, `solo_raid_stage_hp_group` | 9 bosses. `solo_raid_manager_id` links to the original Solo Raid season. |
| `MuseumStageModeTable` | `stage_id`, `mode_type`, `mode_open_condition`, `character_lv`, `wave`, `monster_stage_lv`, `monster_stage_lv_change_group` | `mode_type` is `Challenge` or `NoLimit`, two modes per boss. |
| `MuseumMissionTable` | `stage_id`, `mode_type`, `order`, `condition_type`, `condition_value`, `mission_desc`, `reward_id`, `ranking_point_amount` | Missions per mode. `condition_type` is one of `GetTotalDamage`, `GetTotalDamageRanker`, `GetTotalStageStep`. `{0}` in `mission_desc` is replaced by `condition_value`. `ranking_point_amount` is shown as "Ranking pts". |

HP stages per mode:
- **Challenge:** every boss uses the same 9-step group `905`.
- **No Limit:** each boss has its own group. Hall 1 bosses (`1001`–`1003`) have 28 steps, Hall 2 (`1004`–`1006`) 24 and Hall 3 (`1007`–`1009`) 20.
- Example: group `1009` (Hall 3 boss 303) reaches level 1300 at step 20, which starts at about 122 billion damage and is open-ended.

**[inferred]** No Limit is a score attack with no damage cap, and Challenge is a fixed, shorter version.

Not used by the page:
- `MuseumBuffTable`, `MuseumWeeklyBuffTable`, `MuseumWeeklyBuffGroupTable`: weekly buffs.
- `MuseumCommonStageHpGroupTable` (`group`, `wave_order`, `hp_value`): per-stage HP values. **[inferred]** Linked from `solo_raid_stage_hp_group`.
- `MuseumRankingPointTable`: the ranking point item.

The date fields are stored as `{s, e, c}` big-number objects; **[inferred]** they are ticks, but they aren't decoded.

---

## 7. Boss parts

`MonsterPartsTable` (724 rows) defines breakable parts per `monster_model_id`. Its fields include `parts_type`, `hp_ratio`, `defence_ratio`, `damage_hp_ratio`, `visible_hp`, `linked_parts_id`, `destroy_after_anim` and the per-element `*_resist_ratio` fields. The ratios are in basis points.

**The Raids page does not show parts yet.** Questions about part HP or core mechanics can't be answered from the page, only from this table.

---

## 8. Known data quirks

- **Solo Raid seasons 19 and 20** (manager ids 1000019 and 1000020) point at the same `monster_preset` (10019). The page therefore shows the same boss for both. From season 20 on, the preset group number is one lower than the season number (Season 44 → preset 10043).
- **Union Raid row counts vary by era.** Season 1 has 35 rows, seasons 2–23 have 50, season 24 has 100, seasons 25–28 have 65, and seasons 29–46 have 66. Those last 66 are 50 Normal + 15 Hard + 1 Trial.
- **Union Trial rows** are `difficulty_type = Hard` with `is_trial = true`. Only 18 rows exist, and the page treats them as their own "Trial" difficulty.
- **Anomalous Interception** rows `order` 4 and 5 (ids 14 and 15) have swapped-looking `condition_reward_group` values (104105 and 104104). The page shows them as the data says.
- **Bonus reward bands** (`percent_condition_reward_group*`) often use different thresholds from the HP stages. They then appear as separate "Bonus rewards" tables instead of HP-stage columns.
- **Boss names** come from `wave_name`. A boss renamed between tiers (none seen so far) would be split into two pages.
- **Season numbers** are the row position in the manager table, not a field. A deleted or reordered row would renumber the seasons.
