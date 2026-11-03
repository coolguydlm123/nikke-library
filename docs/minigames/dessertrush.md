# Dessert Rush

Sort plates on a conveyor rail: serve the desserts, discard the bomb plates and hit both buttons for double plates. Correct streaks build a Combo and Fever for big scores.

This guide was generated from the Nikke Library's reading of the game data: the viewer `lib/eventgames/dessertrush.js` turns the `Event*` tables in `D:\Nikke Datamine\mpkparser\jsons` into the rules below. Numbers, units and formulas are the viewer's readings; anything it was not sure of is listed under "Uncertain / unknown". Long lists are cut to 30 rows.

- Intro story: "Crash! Dessert Rush!" (`d_contents_dessertrush`)
- Art folder: `icons-event/31_perfectmaid`

## Overview

### A run

- **Intro story**: story "Crash! Dessert Rush!" (`d_contents_dessertrush`)
- **Time limit**: 60 s (a warning shows in the last 10 s)
- **Controls**: Left button (A / ←) serves a dessert, right button (D / →) discards a bomb, both at once sort a double plate
- **Mistakes**: A wrong sort resets the Combo and locks the rail for 1 s
- **Special plate**: Every 20 plates a special plate comes along; sorting it correctly turns the next 7 plates into the same type as the one at the front
- **Daily reward**: Score 5,000 in one run: Valentine's Day Special Box ×5

### Scoring

- **Points per plate**: 100, plus a Combo bonus (+100 / +200 / +300 / +400 at the ×2 to ×5 Combo tiers)
- **Fever gauge**: +500 per correct sort, full at 10,000 (20 correct sorts); Fever Time starts when it is full
- **Fever Time**: Each correct sort adds more than one to the Combo: Lv 1: ×2, Lv 2: ×3, Lv 3: ×4, Lv 4: ×5. A mistake lowers the Fever level.
- **Fever drain**: 500 gauge points at a time; a count of 15 is needed before the next Fever (meaning unclear)

### Ranks

| Rank | Score |
|---|---|
| **S** | 40,000 |
| **A** | 25,000 |
| **B** | 10,000 |
| **C** | 5,000 |
| **D** | 0 |

### Plates

- Dessert plate 1
- Dessert plate 2
- Dessert plate 3
- Special plate
- Bomb plate 1
- Bomb plate 2
- Bomb plate 3

## Tutorial

### Step 1

- ■ Sort out the plates on the rail within the designated time. / ■ You can use the A and D keys, or the left and right arrow keys to sort. / ■ If the plates are sorted correctly, you will get scores and add value to your Fever Gauge. / ■ If the plates are sorted incorrectly, they will be unable to be sorted for a certain period of time.

### Step 2

- ■ Plates are divided into dessert plates, bomb plates, and double plates. / ■ For dessert plates, tap the button on the left to serve. / ■ For bomb plates, tap the button on the right to discard. / ■ For double plates, tap the two buttons simultaneously to sort.

### Step 3

- ■ Special plates will be generated at regular intervals. / ■ After you correctly sort the special plates, all plates on the rail will transform into the same type as the one at the very front.

### Step 4

- ■ Sorting with a correct streak will increase your Combo. / ■ Higher Combos grant you more points. / ■ Combo will be cleared when the sorting is incorrect.

### Step 5

- ■ After Fever gauge is filled up, you will enter Fever Time. / ■ Combo will be increased by multiplier during Fever Time. / ■ The multiplier will be reduced when the sorting is incorrect during Fever Time.

## Plates by level

The plate mix changes as your Combo count grows: more plate types, and double plates, show up later.

### Level 1 (From the start)

| Plate | Picture | Chance |
|---|---|---|
| Dessert plate 1 (Serve (left)) |  | 50% |
| Bomb plate 1 (Discard (right)) |  | 50% |

### Level 2 (From Combo 100)

| Plate | Picture | Chance |
|---|---|---|
| Dessert plate 1 (Serve (left)) |  | 47.5% |
| Bomb plate 1 (Discard (right)) |  | 47.5% |
| Double plate 1 (Both buttons together) |  | 5% |

### Level 3 (From Combo 200)

| Plate | Picture | Chance |
|---|---|---|
| Dessert plate 1 (Serve (left)) |  | 32.5% |
| Bomb plate 1 (Discard (right)) |  | 32.5% |
| Double plate 1 (Both buttons together) |  | 5% |
| Dessert plate 2 (Serve (left)) |  | 15% |
| Bomb plate 2 (Discard (right)) |  | 15% |

### Level 4 (From Combo 300)

| Plate | Picture | Chance |
|---|---|---|
| Dessert plate 1 (Serve (left)) |  | 32.5% |
| Bomb plate 1 (Discard (right)) |  | 32.5% |
| Double plate 1 (Both buttons together) |  | 4% |
| Dessert plate 2 (Serve (left)) |  | 15% |
| Bomb plate 2 (Discard (right)) |  | 15% |
| Double plate 2 (Both buttons together) |  | 1% |

### Level 5 (From Combo 400)

| Plate | Picture | Chance |
|---|---|---|
| Dessert plate 1 (Serve (left)) |  | 30% |
| Bomb plate 1 (Discard (right)) |  | 30% |
| Double plate 1 (Both buttons together) |  | 4% |
| Dessert plate 2 (Serve (left)) |  | 12.5% |
| Bomb plate 2 (Discard (right)) |  | 12.5% |
| Double plate 2 (Both buttons together) |  | 0.5% |
| Dessert plate 3 (Serve (left)) |  | 5% |
| Bomb plate 3 (Discard (right)) |  | 5% |
| Double plate 3 (Both buttons together) |  | 0.5% |

## Rewards

### Score rewards

Rewards for the total score added up over all your runs.

| Step | Total score | Reward |
|---|---|---|
| 1 | 15,000 | Gem ×50 |
| 2 | 30,000 | Valentine's Day Special Box ×20 |
| 3 | 50,000 | Gem ×75 |
| 4 | 70,000 | Valentine's Day Special Box ×30 |
| 5 | 95,000 | Gem ×100 |
| 6 | 120,000 | Valentine's Day Special Box ×40 |
| 7 | 150,000 | Gem ×125 |
| 8 | 180,000 | Valentine's Day Special Box ×50 |
| 9 | 210,000 | Gem ×150 |
| 10 | 300,000 | Hidden Maids SD Keychain ×1 |

### Score rewards (archive)

The same, when the game is replayed from the Archive.

| Step | Total score | Reward |
|---|---|---|
| 1 | 100,000 | Gem ×20 |
| 2 | 375,000 | Gem ×20 |
| 3 | 650,000 | Gem ×20 |
| 4 | 925,000 | Gem ×20 |
| 5 | 1,200,000 | Gem ×20 |
| 6 | 1,475,000 | Gem ×20 |
| 7 | 1,750,000 | Gem ×20 |
| 8 | 2,025,000 | DESSERT RUSH Premium Sticker II ×1 |
| 9 | 2,300,000 | Gem ×20 |
| 10 | 2,575,000 | Gem ×20 |
| 11 | 2,850,000 | Gem ×20 |
| 12 | 3,125,000 | Gem ×20 |
| 13 | 3,400,000 | Gem ×20 |
| 14 | 3,675,000 | Gem ×20 |
| 15 | 3,950,000 | Gem ×20 |
| 16 | 4,225,000 | Gem ×20 |
| 17 | 4,500,000 | DESSERT RUSH Premium Sticker I ×1 |

## Data sources

All in `D:\Nikke Datamine\mpkparser\jsons` as `<Table>.json`.

| Table | Rows | Fields |
|---|---|---|
| `EventDessertRushManagerTable` | 2 | `id`, `event_id`, `is_archive_event`, `open_condition`, `enter_scenario`, `daily_reward_point`, `daily_reward_id`, `step_up_reward_group_id`, `tutorial_group_id`, `time_limit`, `gain_point`, `gain_point_x2_combo`, `gain_point_x3_combo`, `gain_point_x4_combo`, `gain_point_x5_combo`, `gain_fever_gauge`, `max_fever_gauge`, `decrease_fever_gauge`, `next_fever_need_count`, `fever_lv1_ratio`, `fever_lv2_ratio`, `fever_lv3_ratio`, `fever_lv4_ratio`, `penalty_time`, `special_spawn_count`, `special_spawn_prepare`, `spawn_special_id`, `special_change_dessert_count`, `end_imminent_alert_start_time`, `level_01_wave_id`, `level_02_start_combo_count`, `level_02_wave_id`, `level_03_start_combo_count`, `level_03_wave_id`, `level_04_start_combo_count`, `level_04_wave_id`, `level_05_start_combo_count`, `level_05_wave_id`, `c_rank_target_point`, `b_rank_target_point`, `a_rank_target_point`, `s_rank_target_point` |
| `EventDessertRushTutorialTable` | 5 | `id`, `group_id`, `tutorial_resource`, `tutorial_description_localkey` |
| `EventDessertRushObjectTable` | 10 | `id`, `group`, `resource_id_01`, `resource_id_02` |
| `EventDessertRushStepUpRewardTable` | 27 | `id`, `group_id`, `step`, `target_point`, `reward_id` |
| `EventDessertRushWaveTable` | 5 | `id`, `object_01_id`, `object_01_appearance_probability`, `object_02_id`, `object_02_appearance_probability`, `object_03_id`, `object_03_appearance_probability`, `object_04_id`, `object_04_appearance_probability`, `object_05_id`, `object_05_appearance_probability`, `object_06_id`, `object_06_appearance_probability`, `object_07_id`, `object_07_appearance_probability`, `object_08_id`, `object_08_appearance_probability`, `object_09_id`, `object_09_appearance_probability` |

## Uncertain / unknown

- … gauge points at a time; a count of … is needed before the next Fever (meaning unclear)
