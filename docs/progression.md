# Progression section: guide to the pages and the game mechanics behind them

This guide explains the **Progression** section of the Nikke Library. The library is a local web app that reads NIKKE's datamined game tables.

You can read it without the code or the conversation that built it. Everything here comes from the library's code and the game data tables. Anything inferred rather than read straight from the data is marked **(inferred)** or **(uncertain)**.

- Data tables: `D:\Nikke Datamine\mpkparser\jsons\<Table>.json`. Each file is either a plain array of rows or `{ records: [...] }`.
- Display text: looked up by `*_localkey` / `*_locale_key` fields in the locale files (`D:\Nikke Datamine\nikke-library\config.json` gives the paths).
- Code:
  - `lib/progression.js` builds the data from the tables. It is served at `/api/progression/outpost`, `/api/progression/simulation` and `/api/progression/levels`.
  - `public/progression.js` draws the pages.
  - Reward names and contents come from the shared Stages code: `stages.rewardInfo(rewardId)` reads `RewardTable`, and `stages.rewardName(type, id)` gives an item's display name.

## Pages and how to use them

The landing page `#/progression` has cards for every page and for every Overclock season. The sidebar has the same links.

| Page | Address | What it shows |
|---|---|---|
| Outpost | `#/progression/outpost` | Outpost Defense passive income for a chosen outpost level, resource case values, and a table of every outpost level |
| Simulation Room | `#/progression/simulation` | Clear rewards per difficulty and chapter, Overclock rewards per OC level, and Synchro Device boosts you can switch on |
| Overclock season | `#/progression/simulation/season/<id>` | That season's penalty options and how many OC levels each adds |
| Level-up cost | `#/progression/levels` | A from/to cost calculator, Synchro Device cost tiers, and the character levels that cost Core Dust |

Your choices are remembered in the browser's local storage:
- outpost level (`progOutpostLevel`, default 800)
- Tactics Academy lessons (`progLessons`)
- case length and row step in the all-levels table (`progCaseHours`, `progAllStep`)
- Synchro Device boosts switched on (`progBoosts`)
- calculator from/to levels (`progFrom`, `progTo`)

### Outpost page

- **Outpost level:** a slider and a number box (1–800).
- **Tactics Academy boosts:** a checkbox per lesson, grouped by resource. "All" toggles a whole group.
- **Income at level N:**
  - base and boosted per-hour rates for Credits, Battle Data, Commander EXP and Core Dust;
  - the "In game" figure the Outpost Defense screen shows;
  - what 24 hours of storage holds;
  - the level's item drops (how often and how many per day).
- **Resource cases at level N:** one row per case type (Credit, Battle Data, Core Dust) and one column per case length. Each value includes the boosts you selected; hovering shows it without them.
- **All outpost levels:** all 800 levels in a scrolling table.
  - Columns: stage clears needed, the four per-hour rates, case values for a chosen case length (1/2/4/8/12/24/48 h), and item drops per day.
  - "Every 10" shows only Lv 1, 10, 20 … 800.
  - Clicking a row selects that level. "Go to Lv N" scrolls to the selected level.
  - Short values such as "1.19M" show the exact number on hover.

### Simulation Room page

- **Synchro Device boosts:** a table of the four boosts. Only the two Overclock boosts have checkboxes, because the Interception boosts don't change rewards.
- **Clear rewards:** one row per difficulty and chapter, labelled "1-1" … "5-3", and one column per reward item.
- **Overclock rewards:** one row per OC level that has a reward (OC 1–25), one column per item.
  - A green value includes an extra reward from a boost you switched on; hovering shows the boost's share.
  - Hovering a resource case shows what it's worth at your chosen outpost level.

### Overclock season pages

Each season page lists its penalties grouped by type (a line separates groups), with each tier's added OC levels and its effect text. FIXED and REPEATABLE are tags from the data (see below).

### Level-up cost page

- **Calculator:** total Credits, Battle Data and Core Dust from level A to level B. It warns which Synchro Device level the character levels in that range need.
- **Synchro Device upgrade cost:** Synchro levels 201–1400 grouped into 15 tiers of equal cost, with per-level and per-tier totals.
- **Character Core Dust levels:** the character levels that cost Core Dust.

---

## Mechanics

### Outpost Defense passive income

Outpost Defense earns resources over time. Each outpost level has its own rates.

**Source:** `OutpostBattleTable`, one row per level, 800 rows. Fields:

| Field | Meaning |
|---|---|
| `battle_box_level` | Outpost level (1–800) |
| `credit`, `time_credit` | Credits: amount ×10000 earned every `time_credit` seconds |
| `character_exp1`, `time_charexp1` | Battle Data (character EXP 1), same format |
| `user_exp`, `time_user_exp` | Commander EXP, same format |
| `character_exp2`, `time_charexp2` | Core Dust (character EXP 2), same format |
| `main_stage_clear_count` | Campaign stage clears needed to reach this level from the previous one (0 for Lv 1, 5 for every other level) |
| `reward_id` | `RewardTable` id paid once on reaching the level |
| `outpost_reward_list[]` | Item drops: `view_item_id` (item shown), `item_id`, `item_type`, `item_value` (amount), `time_sec` (interval). Entries with `item_type: None` or `time_sec: 0` are empty slots |

**Formula:** per hour = `amount × 3600 / (10000 × time)`.

- In the current data, `time` is 20 seconds for Credits, Battle Data and Commander EXP, and 60 seconds for Core Dust, at every level.
- Rates are fractional (Lv 800 Credits: 49,527.34/h). The game rounds them down for display:
  - Credits, Battle Data and Commander EXP per minute: `floor(rate / 60)`;
  - Core Dust per hour: `floor(rate)`.
- The library's formula was checked against an in-game Lv 712 screen with all Tactics Academy lessons: 1,221/min Credits, 12,545/min Battle Data, 3,328/min Commander EXP, 118/h Core Dust. That screenshot isn't stored anywhere; the numbers are quoted in a comment in `lib/progression.js`.

**Storage:** the page assumes the outpost holds 24 hours of income (`storageHours: 24` in the code). This is a fixed value in the code, not read from a table.

**Stage clears:** clears to reach level L = the sum of `main_stage_clear_count` for levels 1…L = 5 × (L − 1). Lv 800 needs 3,995 clears.

**Level-up reward:** every level from 2 to 800 pays `RewardTable` reward 100 or 1500002+, which all contain Currency 99 ×100, displayed as **Gem ×100**. Level 1 has none.

**Item drops:** `outpost_reward_list` has up to three kinds of drop. Each pays `item_value` every `time_sec` seconds; per day = `floor(86400 / time_sec) × item_value`.

| Drop | Levels | Interval |
|---|---|---|
| Outpost Defense Equipment Reward Lv. N | All levels; the box level rises with outpost level, reaching Lv. 27 at outpost 177+ | 2880 s at Lv 1 → 7200 s at Lv 101+ |
| Outpost Defense Reward I | From Lv 16 | 3600 s |
| Outpost Defense Reward II | From Lv 101 | 7200 s, then 3600 s at Lv 123, 2400 s at Lv 144, 1800 s at Lv 188, 1440 s at Lv 222+ |

These drops are `ItemRandom` boxes.

### Tactics Academy boosts

Some Tactics Academy lessons raise Outpost Defense income by a percentage.

**Source:** `TacticAcademyFunctionTable` rows with `lesson_type: "OutpostBattle"`; there are 12.
- `lesson_reward[0].lesson_reward_id` is the resource, as a CurrencyType: 2000 = Credits, 1000 = Battle Data, 3000 = Core Dust.
- `lesson_reward[0].lesson_reward_value` is the bonus ×100, so 1000 = +10%.
- `group_id` is the class. Its name comes from `TacticAcademyClassTable.name_localkey` (CLASS A … CLASS I).
- Effect text comes from `function_localkey`, with `{0}` replaced by the percent.

| Resource | Lessons (class: bonus) | Total |
|---|---|---|
| Credits | A +10%, B +10%, D +10%, E +10%, G +10%, H +10% | +60% |
| Battle Data | A +10%, E +15%, H +20% | +45% |
| Core Dust | C +10%, F +15%, I +20% | +45% |

**Formula:** boosted rate = base rate × (1 + sum of selected % / 100). The bonuses add together; they don't multiply each other. Commander EXP has no lesson boost.

### Resource cases

Resource cases are consumables that instantly pay a number of hours of outpost income.

**Source:** `ItemConsumeTable` rows with `use_type: "CurrencyTimeReward"`.
- `use_id` is the resource: 1 = Credits, 2 = Battle Data, 4 = Core Dust.
- `use_value` is the length in seconds: 3600 … 172800, so 1, 2, 4, 8, 12, 24 and 48 h.
- `item_rare`: R for 1/2/4 h, SR for 8/12 h, SSR for 24/48 h.
- Names come from `name_localkey`: Credit Case, Battle Data Set Case, Core Dust Case.

**Formula:** case value = `floor(hourly rate at your outpost level × hours)`.

- **(inferred)** The page includes your Tactics Academy boosts in the case value and shows the unboosted value on hover. Whether the game applies lesson boosts to cases isn't stated in the data.
- **(inferred)** Cases scale with the player's current outpost level; the data has no fixed amount per case.
- **Data quirk:** row 9110008 is a Credit-type case with the name key `randombox_frag_test`. It's a test item with no display name, so the page leaves it out.

### Simulation Room

The Simulation Room has difficulties and chapters. Clearing them gives rewards.

**Sources:**
- `SimulationRoomDifficultyTable`: `id` is the difficulty (1–5; 99999 is a test row the page skips) and `name_localkey` its name ("Difficulty {0}").
- `SimulationRoomChapterTable`, one row per chapter:

| Field | Meaning |
|---|---|
| `difficulty_id`, `chapter` | Which chapter |
| `recommended_battle_power` | Recommended power |
| `stage_value` | Stages in the chapter **(inferred)**; values are 3, 5 or 7 |
| `reward_id` | `RewardTable` clear reward |
| `overclock_active` | True only for 5-3, the chapter where Overclock opens **(inferred)** |

The page shows each chapter's `reward_id` contents (from `RewardTable.rewards[]`: `reward_type`, `reward_id`, `reward_value` = amount, `reward_percent / 10000` = chance %). Every reward in the current data has a 100% chance. Clear rewards include Battle Data Set Cases and Skill/Burst Manuals I–III. Code Manual Random Reward and Code Manual Selection Box appear on 3 chapters each.

### Overclock and its seasons

Overclock is the harder mode after the top chapter. Players take penalty options, and each one raises the **OC level**. Higher OC levels are harder.

**Seasons:** `SimulationRoomOcSeasonTable`, ids 1–12.

| Field | Meaning |
|---|---|
| `season_name_localkey` | Season name. Ids 1–2 are "Beta Season 1/2"; ids 3–12 are "Season 1"–"Season 10" (so season id ≠ season number) |
| `main_season` | False for the two beta seasons |
| `overclock_level_group` | Which `SimulationRoomOcLevelTable` group the season uses |
| `option_group_id` | Which penalty set the season uses |

**OC levels:** `SimulationRoomOcLevelTable`.
- `group_id`, `overclock_level`, `monster_level_up` (enemy level increase), `battle_power`, `color`, `reward_id`.
- The early groups have 50 levels; the groups for ids 5–12 have 51.

**Penalties:** `SimulationRoomOcOptionGroupTable` and `SimulationRoomOcOptionTable`.

- **Option groups** (`season_group` = the season's `option_group_id`): `group_order` gives the order. `infinite_option: true` is shown as REPEATABLE **(inferred meaning: the penalty can be taken repeatedly)**.
- **Options** (`group_id` = option group id): tiers I/II/III.

| Option field | Meaning |
|---|---|
| `option_name_localkey`, `option_desc_localkey` | Name and effect text |
| `option_overclock_level` | OC levels the tier adds |
| `fix_option: true` | Shown as FIXED, for example "Prepare for Simulation" **(inferred meaning: always applied)** |

`option_change_order`, `infinite_option_code`, `option_data` and `option_icon` aren't used by the page.

**Overclock rewards:** `SimulationRoomOcLevelTable.reward_id`.
- Only OC levels 1–25 have a reward in each group.
- The rewards are identical across seasons, so the page shows them once, from the newest main season.
- **(uncertain)** Per-level amounts *decrease* as OC level rises: OC 1 = Skill Manual I ×14 … OC 25 = ×4. It isn't clear whether reaching OC N pays only row N or the sum of rows 1…N. The page shows each row as stored.

### Synchro Device boosts (Simulation Room rewards and Interception)

Boosts unlock at certain Synchro Device levels.

**Source:** `BoostManagerTable`.
- `required_level` is the Synchro Device level.
- `reward_popup_type: "SimulationRoomOcReward"` marks an Overclock-reward boost; `None` marks the others.
- `buff_group_id` points to `BoostBuffTable.group_id`.

| id | Boost | Synchro Lv | Effect (BoostBuffTable) |
|---|---|---|---|
| 1 | Overclock Boost Level 1 | 300 | group 201: `condition_type: SimulationRoomOcReward`, `condition_id` = OC level, `condition_value` = `RewardTable` id of the extra reward |
| 2 | Interception Boost Level 1 | 400 | group 101: `AutoChargeCount`, `condition_id` 20001, `condition_value` 1 (+1 Interception attempt) |
| 3 | Overclock Boost Level 2 | 500 | group 202: same format as group 201 |
| 4 | Interception Boost Level 2 | 600 | group 102: +1 more attempt |

- **(inferred)** The page *adds* a boost's reward on top of the base reward. Each boost reward is about half the base, rounded up (OC 1: base Skill Manual I ×14, each boost ×7), which fits an extra reward rather than a replacement. The data doesn't say this outright.
- **(inferred)** `condition_id` 20001 for the Interception boosts is the Interception content id.

### Character levels, Synchro Device levels and costs

Characters level up with Credits and Battle Data, plus Core Dust at some levels. The Synchro Device is the account-wide level system above character level 200.

**Source:** `Character/CharacterLevelTable`, 1400 rows. Fields:

| Field | Meaning |
|---|---|
| `level` | Level |
| `type` | `CharacterLevel` for 1–200, `SynchroLevel` for 201–1400 |
| `need_synchro_lv_min` | Minimum Synchro Device level to do this character level-up (Lv 100 needs 60, Lv 160 needs 120, Lv 199–200 need 160; 0 on Synchro rows) |
| `gold` | Credits |
| `character_exp` | Battle Data |
| `character_exp_2` | Core Dust |

- **(inferred)** Row L is the cost to go from level L to L+1. The calculator sums rows from ≤ L < to.
- Under that reading, a range up to 1401 includes the last row (1400 → 1401). **(uncertain)** Whether the Synchro Device's real cap is 1400 or 1401.
- **Data quirk:** row 200 (`CharacterLevel`) has exactly the same costs as row 201 (`SynchroLevel`): 1,694,200 / 20,944,600 / 10,000. 200 is the top character level, so what row 200 pays for is unclear **(uncertain)**.

**Core Dust:**
- Among character levels, only rows 10, 20, 40, 60, 80 … 200 cost Core Dust (Lv 10, Lv 20, then every 20 levels).
- Every Synchro row costs Core Dust: 10,000 per level for 201–350, rising to 24,000 for 1201–1400.
- Core Dust is also an outpost income (`character_exp2`) and a resource case, which is why it's tracked separately.

**Totals:**

| Range | Credits | Battle Data | Core Dust |
|---|---|---|---|
| Lv 1 → 200 (rows 1–199) | 27,181,890 | 302,993,280 | 30,040 |
| Lv 201 → 1401 (rows 201–1400) | 12,042,737,850 | 112,737,606,250 | 21,450,000 |

**Synchro Device cost tiers:** runs of equal cost per level. Each tier is 50 levels up to 800, then 200.

| Levels | Credits / lv | Battle Data / lv | Core Dust / lv |
|---|---|---|---|
| 201–250 | 1,694,200 | 20,944,600 | 10,000 |
| 251–300 | 3,134,000 | 39,883,600 | 10,000 |
| 301–350 | 3,809,800 | 50,478,800 | 10,000 |
| 351–400 | 4,762,250 | 56,536,256 | 11,000 |
| 401–450 | 5,952,813 | 61,624,519 | 12,000 |
| 451–500 | 7,441,016 | 67,170,726 | 13,000 |
| 501–550 | 8,185,117 | 72,544,384 | 14,000 |
| 551–600 | 9,003,629 | 78,347,935 | 15,000 |
| 601–650 | 9,453,810 | 83,832,290 | 16,000 |
| 651–700 | 9,926,501 | 89,700,550 | 17,000 |
| 701–750 | 10,422,826 | 95,082,583 | 18,000 |
| 751–800 | 10,943,967 | 100,787,538 | 19,000 |
| 801–1000 | 11,491,166 | 105,826,915 | 20,000 |
| 1001–1200 | 12,985,017 | 119,584,414 | 22,000 |
| 1201–1400 | 14,555,024 | 134,043,257 | 24,000 |

---

## The user's standing decisions

- **Infra boost is skipped.** The Outpost page applies only the Tactics Academy lessons to income and cases. It does not model any other outpost boost (the "infra boost"). This is a deliberate choice, so outpost figures may be lower than in game for players who have it.
- **Level costs include the Synchro Device.** The Level-up cost page covers character levels 1–200 and Synchro Device levels 201+ in one calculator.
- **No character stats for now.** The Progression section shows costs only, not stats gained per level.

## Known quirks and caveats (summary)

- Outpost rates are fractional; the game and the page round down.
- 24-hour storage is a value in the code, not from a table.
- Whether lesson boosts apply to resource cases is assumed, not stated in the data.
- `ItemConsumeTable` 9110008 is a test Credit case, hidden.
- `SimulationRoomDifficultyTable` / `ChapterTable` rows with id or difficulty 99999 are test rows, hidden.
- Season id and season number differ (id 12 = "Season 10"; ids 1–2 are the beta seasons).
- Overclock rewards exist only for OC 1–25 and decrease with level; whether they're cumulative is unknown.
- Synchro Device Overclock boosts are shown as additions to the base reward (inferred from their size: about half the base).
- Row 200 in `CharacterLevelTable` duplicates row 201's cost; the Synchro Device cap (1400 vs 1401) is uncertain.
