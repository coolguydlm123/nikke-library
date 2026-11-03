# Rope Running

An endless runner: Ade dashes forward on her own while you jump obstacles and pits and swing from chandeliers on a rope. Collect coins for score and stat upgrades; go as far as you can before HP runs out.

This guide was generated from the Nikke Library's reading of the game data: the viewer `lib/eventgames/coinsinrush.js` turns the `Event*` tables in `D:\Nikke Datamine\mpkparser\jsons` into the rules below. Numbers, units and formulas are the viewer's readings; anything it was not sure of is listed under "Uncertain / unknown". Long lists are cut to 30 rows.

- Intro story: "Bunny Maid Special Agent" (`d_contents_madeinrush_prologue`)
- Art folder: `icons-event/66_coinsinrush`

## Overview

### A run

- **Intro story**: story "Bunny Maid Special Agent" (`d_contents_madeinrush_prologue`)
- **Controls**: Tap (or Space) to jump. While in the air, hold to shoot a rope; once it hooks a chandelier, the swing flings Ade upward — hold longer to go higher.
- **Game over**: HP reaches 0, or Ade falls into a pit
- **HP**: Drains every second (10–15 HP a second, rising with difficulty) and drops further when Ade hits an obstacle
- **After a hit**: Ade slows to 50% speed for 0.3 s and can’t be hurt for 2 s
- **Rope**: Can be fired again 0.3 s after the last one
- **Daily reward**: Run 250 m in one go: Gem ×30

### Score and coins

- **Total score**: Distance score plus coin score (distance score ratio 100)
- **Gold coin**: 50 points and 2 coin points
- **Silver coin**: 5 points and 1 coin point
- **Coin points**: Add up over all runs and earn SP to spend on Ade’s stats (see Stats)

### Items on the course

Coin spots on the course sometimes hold an item instead (chance per spot shown).

- **Chocolate**: Restores HP (the Recovery stat sets how much) — 0.05–0.15%
- **Magnet**: Pulls in every item on screen — 0.3%
- **Shield**: Blocks one hit from an obstacle (lasts up to 8 s) — up to 0.3%
- **Blueprint fragment**: Collect 4 to enter Rush mode — 0.2–0.6%

### Rush mode

- **How**: Collecting 4 blueprint fragments sends Ade onto the hidden Coin Rush route
- **Lasts**: 4.5 s
- **On the route**: Speed 25, no HP drain, a course packed with coins

### Ranks

| Rank | Score |
|---|---|
| **S** | 150,000 |
| **A** | 100,000 |
| **B** | 50,000 |
| **C** | 30,000 |
| **D** | 10,000 |

## Difficulty and course

The course speeds up and HP drains faster the further Ade runs. Each difficulty builds its course from random blocks.

### Difficulty

| Level | From | Speed | HP drain /s | Blocks | Block length | Chandeliers | Obstacles | Pits |
|---|---|---|---|---|---|---|---|---|
| 1 | 0 m | 13 | 10 | 1 | 103 | 0 | 2 | 0 |
| 2 | 50 m | 13 | 10 | 6 | 17.3 | 0 | 0.7 | 0 |
| 3 | 130 m | 15 | 11 | 1 | 74 | 2 | 2 | 0 |
| 4 | 200 m | 15 | 11 | 15 | 24 | 0.5 | 0.9 | 0 |
| 5 | 400 m | 17 | 12 | 26 | 34.2 | 0.8 | 0.3 | 0.6 |
| 6 | 1,000 m | 19 | 13 | 46 | 45.2 | 1.3 | 0.4 | 0.7 |
| 7 | 2,000 m | 22 | 14 | 36 | 63.2 | 2.1 | 0.5 | 0.7 |
| 8 | 3,000 m | 25 | 15 | 35 | 99.7 | 3.8 | 0.2 | 0.8 |

Speed is the scroll speed in course units a second (the same units as the metres counted for distance, as far as the table shows). Block numbers are averages per block.

### Rush route

- **Blocks**: 1 (about 80 columns, 592 coin spots)
- **Speed**: 25
- **HP drain**: None

### What a coin spot can hold

| Spot | Contents | Spots |
|---|---|---|
| Gold coin | Gold coin 100% | 222 |
| Hidden gold coin | Gold coin 100% | 2,792 |
| Silver coin | Silver coin 100% | 3,796 |
| Gold coin or item | Gold coin 98.65%, Blueprint fragment 0.6%, Magnet 0.3%, Chocolate 0.15%, Shield 0.3% | 1,186 |
| Gold coin or item | Gold coin 98.85%, Blueprint fragment 0.4%, Magnet 0.3%, Chocolate 0.15%, Shield 0.3% | 1,743 |
| Gold coin or item | Gold coin 99%, Blueprint fragment 0.3%, Magnet 0.3%, Chocolate 0.1%, Shield 0.3% | 1,989 |
| Gold coin or item | Gold coin 99.45%, Blueprint fragment 0.2%, Magnet 0.3%, Chocolate 0.05% | 3,409 |
| Blueprint fragment | Blueprint fragment 100% | 6 |

Each spot in a block rolls its contents when the block appears (chances per 10,000, shown as %). Spots are counted over every block of every difficulty.

## Stats

Coin points from every run add up to SP; spend SP to raise Ade’s HP, Defense and Recovery.

### Stat levels

| Level | Max HP | Damage per hit | HP per chocolate |
|---|---|---|---|
| 1 | 1,500 | 300 | 150 |
| 2 | 1,550 | 290 | 155 |
| 3 | 1,600 | 280 | 160 |
| 4 | 1,650 | 270 | 165 |
| 5 | 1,700 | 260 | 170 |
| 6 | 1,750 | 250 | 175 |
| 7 | 1,800 | 240 | 180 |
| 8 | 1,850 | 230 | 185 |
| 9 | 1,900 | 220 | 190 |
| 10 | 2,000 | 200 | 200 |

Defense is the damage Ade takes from one obstacle hit (lower is better). Recovery is the HP one chocolate restores. Each level up costs 1 SP.

### Earning SP

You earn 1 SP for every 1,500 coin points collected in total, up to 27 SP (40,500 coin points) — enough to raise all three stats from level 1 to 10.

## Spy tools

Permanent gadgets unlocked by meeting a goal; all unlocked tools work at once.

| Tool | Effect | Unlock | Available |
|---|---|---|---|
| Oxygen Bag | Increases the duration of Rush mode by 1.5 sec. | Obtain 4 blueprint fragment(s) | From the start |
| Metal Detector | When the rope is attached to the chandelier 4 times, hidden items nearby will appear. | Attach rope to the chandelier 5 time(s) | From the start |
| Adhesive Rope | Items that come into contact with the rope can be collected. | Obtain 300 coin(s) | 7 days after the event starts |
| Magnetic Armor | Pulls in the items around Ade with its magnetic power. | Obtain 1 magnet(s) | 14 days after the event starts |

## Missions

| Mission | Reward |
|---|---|
| Challenge - Obtain 150,000 points in total | Central Government Supply Chest I ×5 |
| Challenge - Obtain 300,000 points in total | Central Government Supply Chest I ×5 |
| Challenge - Obtain 450,000 points in total | MADE IN RUSH Special Sticker I ×1 |
| Challenge - Obtain 600,000 points in total | Central Government Supply Chest I ×5 |
| Challenge - Obtain 800,000 points in total | Central Government Supply Chest I ×5 |
| Challenge - Obtain 1,000,000 points in total | MADE IN RUSH Premium Sticker I ×1 |
| Challenge - Move 1,000 m | Skill Manual Box ×1 |
| Challenge - Move 3,000 m | Skill Manual Box ×2 |
| Challenge - Move 5,000 m | Skill Manual Box ×3 |
| Challenge - Move 7,000 m | Skill Manual Box ×4 |
| Challenge - Obtain 1,000 coin(s) | Burst Manual Box ×1 |
| Challenge - Obtain 3,000 coin(s) | Burst Manual Box ×2 |
| Challenge - Obtain 5,000 coin(s) | Burst Manual Box ×3 |
| Challenge - Obtain 7,000 coin(s) | Burst Manual Box ×4 |
| Challenge - Obtain 50,000 points in a single round | Ultra-Double Boost Module ×15 |
| Challenge - Obtain 100,000 points in a single round | Ultra-Double Boost Module ×15 |
| Challenge - Obtain 8 blueprint fragment(s) | Attacker Common Console ×30 |
| Challenge - Obtain 16 blueprint fragment(s) | Defender Common Console ×30 |
| Challenge - Obtain 24 blueprint fragment(s) | Supporter Common Console ×30 |

## Story and photos

### Training reports

| Days after start | Scene |
|---|---|
| 0 | story "Bunny Maid Special Agent Training Report: 01" (`d_contents_madeinrush_01`) |
| 2 | story "Bunny Maid Special Agent Training Report: 02" (`d_contents_madeinrush_02`) |
| 4 | story "Bunny Maid Special Agent Training Report: 03" (`d_contents_madeinrush_03`) |
| 6 | story "Bunny Maid Special Agent Training Report: 04" (`d_contents_madeinrush_04`) |
| 8 | story "Bunny Maid Special Agent Training Report: 05" (`d_contents_madeinrush_05`) |
| 10 | story "Bunny Maid Special Agent Training Report: 06" (`d_contents_madeinrush_06`) |
| 12 | story "Bunny Maid Special Agent Training Report: 07" (`d_contents_madeinrush_07`) |
| 14 | story "Bunny Maid Special Agent Training Report: 08" (`d_contents_madeinrush_08`) |

One new report opens every two days of the event.

### Photos

| Photo | Caption | Condition |
|---|---|---|
|  | Th-this is... a weapon, you say...? |  |
|  | Surely... the gloves won't break, right...? |  |
|  | Um, w-well... the thing is, I really can't be seen...! |  |
|  | Hehe. I've always wanted to give this a try. |  |
|  | I-I didn't think it would touch like this...! |  |
|  | I need to... grab more coins...! |  |
|  | They are rather rude, aren't they? | S rank after 5 plays |
|  | I shall show you the fruits of my training...! | S rank after 10 plays |

Photos are collected at the end of a run. The last two need an S rank after a number of plays.

## Data sources

All in `D:\Nikke Datamine\mpkparser\jsons` as `<Table>.json`.

| Table | Rows | Fields |
|---|---|---|
| `EventRopeRunningManagerTable` | 1 | `id`, `event_id`, `enter_scenario`, `daily_reward_distance`, `daily_reward_id`, `mission_group_id`, `status_point_group_id`, `status_group_id`, `spy_item_group_id`, `tutorial_id`, `album_category_id`, `cut_scene_group_id`, `scenario_group_id`, `difficulty_group_id`, `fall_death_distance`, `jump_y_speed`, `gravity_value`, `rope_action_fall_speed`, `rope_action_gravity_value`, `rope_action_pull_force`, `max_rope_attach_distance`, `max_rope_attach_height`, `spin_jump_y_speed`, `spin_jump_gravity_value`, `initial_fall_death_speed`, `fall_death_gravity_value`, `rope_angle`, `rope_cooltime`, `rope_speed`, `rope_maintain_time`, `speed_ratio_after_hit`, `speed_ratio_after_hit_time`, `get_sp_gold_coin_value`, `get_sp_silver_coin_value`, `get_score_gold_coin_value`, `get_score_silver_coin_value`, `shield_time`, `item_move_speed_by_magnet`, `distance_score_ratio`, `rush_time`, `rush_count_value`, `invincible_time`, `start_difficulty`, `d_rank_target_score`, `c_rank_target_score`, `b_rank_target_score`, `a_rank_target_score`, `s_rank_target_score` |
| `EventRopeRunningMissionTable` | 19 | `id`, `group_id`, `mission_locale_key`, `mission_type`, `mission_value`, `reward_id` |
| `EventRopeRunningCutSceneTable` | 8 | `id`, `group_id`, `cutscene_resource`, `cutscene_description`, `special_appear_count`, `unlock_condition_desc` |
| `EventRopeRunningDifficultyTable` | 9 | `id`, `group_id`, `difficulty`, `scroll_speed`, `hp_decrease_per_sec`, `next_difficulty`, `need_meter_to_next_difficulty`, `preset_group_id`, `is_rush_mode` |
| `EventRopeRunningObjectTable` | 17 | `id`, `object_type`, `object_collider_x`, `object_collider_y` |
| `EventRopeRunningObjectGroupTable` | 12 | `id`, `group_ratio`, `is_visible` |
| `EventRopeRunningPresetTable` | 9365 | `id`, `preset_group_id`, `order`, `ceiling`, `object_1`, `object_2`, `object_3`, `object_4`, `object_5`, `object_6`, `object_7`, `object_8`, `object_9`, `object_10`, `obstacle`, `land` |
| `EventRopeRunningScenarioTable` | 8 | `id`, `group_id`, `scenario_dialog_group_id`, `scenario_unlock_day` |
| `EventRopeRunningSpyItemTable` | 4 | `id`, `group_id`, `resource_id`, `name_locale_key`, `desc_locale_key`, `function_type`, `function_value`, `unlock_condition_type`, `unlock_condition_value`, `unlock_condition_locale_key`, `unlock_time` |
| `EventRopeRunningStatusTable` | 10 | `id`, `group_id`, `level`, `hp`, `defence`, `recovery` |
| `EventRopeRunningStatusPointTable` | 27 | `id`, `group_id`, `sp_count`, `get_coin_point` |

The viewer also reads: `MinigameHelpTipDescTable`.

## Uncertain / unknown

The viewer flagged nothing as uncertain. Fields it does not show are listed in Data sources; their meaning is not interpreted.
