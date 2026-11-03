# Pirate Cafe

Pirate Cafe is the minigame of the pirate-cafe event (event id 81800; intro story "Yo Ho Ho! Pirate Cafe Grand Opening!", scene `d_contents_piratecafe_01`). It is a timed serving game: in a 90-second shift, customers sit at tables and order 1 to 3 dishes; you send maids (Mast, Anchor, Sin) to carry the right dishes from the food counter to each table before the customer's patience runs out, then clean the table after they eat. Correct orders fill a Fever gauge; in Fever the maids serve automatically while a rush of customers streams in. The score is called **Satisfaction**. Satisfaction added up over all runs unlocks harder difficulties and permanent **Proficiency** bonuses. The game runs on the same engine as the CE003 serving game and reuses its texts (locale keys `CE003_MINI_GAME_*`).

## How to play / rules

In-game help ("How to play", MinigameHelpTipDescTable group 10049; the Arcade mode uses group 30001):
- **Gameplay**: Serve the customer's order within the time limit. Correct orders earn Satisfaction. If the order is not served in time, the customer leaves and no Satisfaction is earned.
- **Fever Mode**: Correct orders raise the Fever gauge. When full, Fever Mode starts; in Fever a maid is automatically selected to serve food.
- **Maid**: Mast, Anchor and Sin serve dishes; how many are on duty depends on difficulty. Each maid holds at most 2 dishes at a time.
- **Food / Trash Can**: Food for customers is placed at the counter; which dishes exist depends on difficulty. Dishes a maid holds can be discarded in the trash can.
- **Satisfaction**: Serving food or cleaning earns Satisfaction. Daily missions give rewards based on Satisfaction. The Satisfaction of a single game counts for the Union Ranking.
- **Proficiency**: Your level rises with Satisfaction earned; certain levels give buffs.

Rules from the data (all times in 1/100 s, e.g. `time_limit` 9000 = 90 s):

| Rule | Value |
|---|---|
| Shift length | 90 s (`time_limit` 9000), same on all difficulties |
| End warning | 15 s before the end (`game_end_alert_start_time` 1500) |
| Wrong dish served | Maid frozen 1 s (`normal_maid_serving_fail_time` 100) |
| Missed order | Customer leaves; no Satisfaction |
| After eating | Table must be cleaned (1.5 s) before the next customer; cleaning pays Satisfaction |
| Fever gauge | Max 125; normal customer +12, event customer +18 |
| Fever length | 12 s (`fever_play_time` 1200) |
| Anti-cheat cap | 999,999 points per run (`anticheat_max_point`) |

There is no HP / lives; the only end condition in the data is the timer.

### Difficulties

Unlocks need Satisfaction added up over all runs. Speeds have no unit; the base maid speed is 70 (both walking and carrying), base customer speed 50.

| | EASY | NORMAL | HARD |
|---|---|---|---|
| Unlock (total Satisfaction) | from start | 4,000 | 8,000 |
| In-game text | Mast on duty; 5 tables; max 2 orders per customer | Mast & Anchor; 5 tables; max 2 orders; event customers appear | Mast, Anchor & Sin; 6 tables; max 3 orders; event customers appear |
| Maids | Mast | Mast, Anchor | Mast, Anchor, Sin |
| Dishes on the menu | 4 | 5 | 6 |
| 1-dish order | 80% of orders, 100 pts, waits 17.5 s | 60%, 150 pts, 17.5 s | 50%, 150 pts, 17.5 s |
| 2-dish order | 20%, 200 pts, 17.5 s | 40%, 250 pts, 17.5 s | 35%, 250 pts, 17.5 s |
| 3-dish order | none | none | 15%, 450 pts, waits 22.5 s |
| Eating time | 5 s | 5 s | 5 s |
| New customer every | 2 s | 2 s | 2 s |
| Fever gauge per customer | 12 / 125 | 12 / 125 | 12 / 125 |
| Event customer | none | every 8 "turns" (uncertain: `event_npc_turn_count` 8, exact meaning unknown); orders 2 dishes for 400 pts, waits 15 s, eats 5 s, +18 Fever | same as Normal |
| Cleaning a table | 1.5 s, 100 pts | 1.5 s, 150 pts | 1.5 s, 150 pts |
| Fever: maid speed | 210 (x3) | 260 (x3.7) | 310 (x4.4) |
| Fever: customers | one every 0.1 s, 1 dish each, eat 1 s, speed 95 | every 0.1 s, 2 dishes, eat 0.75 s, speed 125 | every 0.1 s, 2 dishes, eat 0.5 s, speed 155 |
| Fever: points per order | 100 | 100 | 100 |
| Fever end: `fever_end_npc_spawn_amount` (uncertain: likely customers spawned as Fever ends) | 3 | 4 | 4 |

Order weights are raw weights (Easy 8/2/0, Normal 6/4/0, Hard 10/7/3); percentages above are weight / total. In Fever, customers order the special Fever dish (`fever_menu_id` 11001, menu group 11). In Fever the maid's wrong-dish freeze is 0.

## Scoring

Satisfaction (score) per run = sum of:
- order points for each correctly served order (by order size and difficulty, table above),
- event-customer orders (400),
- cleaning points per table cleaned (100 / 150 / 150),
- Fever orders (100 each).

A missed order gives 0. There are no letter ranks; the score only selects the end-of-run dialogue band (below) and counts toward missions, unlocks and Proficiency.

## Content

### Maids
| Maid | Character id | On duty in |
|---|---|---|
| Mast | c354 | Easy, Normal, Hard |
| Anchor | c355 | Normal, Hard |
| Sin | c401 | Hard |

The maids differ only in which difficulty uses them; the data gives them no individual stats.

### Customers
Six regular customer looks (`pirate_guest_normal_1` … `_6`, type NORMAL) and one event customer (`pirate_guest_event_2`, type EVENT; appears in Normal and Hard). Looks are cosmetic; rules come from the stage table.

### Menu
16 menu rows: group 1 = 4 dishes (Easy), group 2 = 5 dishes (Normal), group 3 = 6 dishes (Hard), group 11 = the Fever dish. 7 distinct dish art sets (`romanticvalentine_food_01` … `_07`, art reused from an earlier Valentine event). The data gives dishes no names or individual values.

### Proficiency (permanent buffs)
Levels go up with total Satisfaction over all runs; every unlocked bonus stays on. `skill_value` is a percentage of the normal value.

| Level | Total Satisfaction | Bonus | Effect |
|---|---|---|---|
| 1 | 2,500 | Increase Maid Speed | maid speed 133% |
| 2 | 5,000 | Reduce Restriction Time for Wrong Orders | wrong-dish freeze 50% |
| 3 | 7,500 | Reduce Maid Cleaning Time | cleaning time 50% |
| 4 | 10,000 | Increase Customer Waiting Time | customer patience 125% |
| 5 | 15,000 | Increase Customer Speed | customer movement 133% |
| 6 | 20,000 | Reduce Customer Dining Time | eating time 50% |

### End-of-run lines
On the results screen the maids of that difficulty speak a line chosen by score band (18 voiced lines, `c354/c355/c401_EVENT_End_1…6`).

| Difficulty | Low band | Middle band | High band |
|---|---|---|---|
| Easy | below 2,000 | 2,000 – 4,000 | 4,000+ |
| Normal | below 3,500 | 3,500 – 7,000 | 7,000+ |
| Hard | below 4,000 | 4,000 – 8,000 | 8,000+ |

Examples: low, Mast: "Argh... I'll try harder next time."; high, Sin: "You performed admirably, so here are 50 bonus points." (flavour only; no bonus points exist in the data).

## Progression & rewards

- **Daily reward**: 1,000 Satisfaction in a day → Gem x30 (Normal mode only).
- **Accumulation missions** (total Satisfaction over all runs):

| # | Total | Reward |
|---|---|---|
| 1 | 4,000 | Supporter Common Console x30 |
| 2 | 8,000 | Defender Common Console x30 |
| 3 | 12,000 | Attacker Common Console x30 |
| 4 | 16,000 | Growth Set: 1H x4 |
| 5 | 20,000 | Skill Manual I x36 |
| 6 | 24,000 | Skill Manual II x24 |
| 7 | 29,000 | Skill Manual III x12 |
| 8 | 34,000 | PIRATE CAFE Premium Sticker I x1 |
| 9 | 39,000 | Burst Manual I x18 |
| 10 | 44,000 | Burst Manual II x12 |
| 11 | 49,000 | Burst Manual III x6 |
| 12 | 55,000 | PIRATE CAFE Premium Sticker II x1 |

- **Challenge missions** (best score in one round, condition `RenewRecord`): 17 steps every 24,000 from 24,000 to 408,000. Each gives Gem x20, except #8 (192,000) = PIRATE CAFE Premium Sticker I x1 and #17 (408,000) = PIRATE CAFE Premium Sticker II x1. (Note: these single-run thresholds are far above what the order values in the stage table suggest is possible in 90 s; the data does not explain this. Uncertain.)
- **Arcade mode** (rerun, manager row `minigame_type` Arcade, mission group 2): no daily reward; 17 accumulation missions (total Satisfaction 24,000 … 408,000, steps of 24,000) with the same rewards as the Challenge list (Gem x20; Sticker I at 192,000; Sticker II at 408,000). No Arcade challenge list exists.

## Data sources

| Table | Fields | Meaning |
|---|---|---|
| EventPirateCafeManagerTable (2 rows: Normal, Arcade) | `event_id` 81800, `minigame_type`, `open_condition`, `daily_reward_condition_value` / `daily_reward_id`, `first_enter_scenario_group_id`, `mission_group_id`, `skill_group_id`, `help_tip_group_id`, `game_end_alert_start_time` (1/100 s), `anticheat_max_point` | game settings |
| | `fever_direction_maid_move_speed` 400, `fever_direction_npc_move_speed` 400, `fever_object_invisible_direction_time` 10, `fever_direction_npc_spawn_start_time` 110, `npc_spawn_cooltime` 10, `special_idle_condition_time` 200 | presentation timings for the Fever transition / idle (not interpreted by the viewer) |
| EventPirateCafeStageTable (3 rows) | `stage_level`, `enter_condition_value` (total Satisfaction), `stage_level_name/desc/img`, `time_limit`, `use_maid_group_id`, `normal_menu_group_id`, `use_npc_group_id` | difficulty definition |
| | `normal_order_{1,2,3}_weight/_get_point/_wait_time_serving`, `normal_wait_time_eating`, `normal_npc_spawn_time`, `normal_npc_move_speed`, `normal_npc_get_fever_gauge` | normal customers (times 1/100 s) |
| | `normal_maid_move_speed`, `normal_maid_serving_move_speed`, `normal_maid_serving_fail_time`, `normal_maid_return_time` (0) | maid behaviour |
| | `clean_time`, `clean_get_point` | table cleaning |
| | `use_event_npc`, `event_npc_turn_count`, `event_order_count`, `event_order_get_point`, `event_wait_time_serving`, `event_wait_time_eating`, `event_npc_move_speed`, `event_npc_get_fever_gauge` | event customer |
| | `fever_gauge_max`, `fever_play_time`, `fever_maid_move_speed`, `fever_maid_serving_move_speed`, `fever_maid_serving_fail_time`, `fever_maid_return_time`, `fever_menu_id`, `fever_order_count`, `fever_order_get_point`, `fever_wait_time_eating`, `fever_npc_move_speed`, `fever_npc_spawn_time`, `fever_end_npc_spawn_time` (50), `fever_end_npc_spawn_amount` (3/4) | Fever mode |
| | `dialog_group_1/2/3`, `dialog_group_1_max_point`, `dialog_group_2_max_point` | end-of-run line bands |
| EventPirateCafeCharacterTable | `group_id`, `character_type` (maid name), `resource_id`, `si_resource_id` | maids per difficulty group |
| EventPirateCafeMenuTable | `group_id`, `table/button/bubble_resource_id` | dishes per menu group (art only) |
| EventPirateCafeNpcTable | `npc_type` NORMAL/EVENT, `resource_id` | customer looks |
| EventPirateCafeSkillTable | `skill_rank`, `active_condition_value` (total Satisfaction), `skill_type`, `skill_value` (% of normal), name/desc | Proficiency |
| EventPirateCafeMissionTable | `group_id` (1 Normal, 2 Arcade), `mission_type` TotalGet/Achievement, `condition_type` StackPoint/RenewRecord, `condition_value`, `reward_id` | missions |
| EventPirateCafeDialogTable / DialogGroupTable | `portrait_id`, `locale`, `voice_key`; `dialog_group_id` → `dialog_id` | results-screen lines |
| MinigameHelpTipDescTable | group 10049 / 30001 | in-game help |

## Uncertain / unknown

- `event_npc_turn_count` 8: the viewer labels it "how often they come"; exact unit (customers? spawns?) unknown.
- Speeds (maid 70, customer 50, Fever values) are unitless; only ratios are meaningful.
- Fever-end fields (`fever_end_npc_spawn_time` 0.5 s, `fever_end_npc_spawn_amount` 3/4) are read here as "extra customers spawned as Fever ends" (uncertain).
- `normal_maid_return_time` / `fever_maid_return_time` are 0; meaning unknown.
- Manager "direction" fields, `npc_spawn_cooltime`, `special_idle_condition_time` are presentation timings; not interpreted.
- Number of tables (5/5/6) and max orders come only from the in-game description text, not from a numeric field.
- How Fever orders are served (help says automatically) and whether the player acts during Fever is not detailed in the data.
- Challenge thresholds (24,000 – 408,000 in one round) look much higher than the per-order points allow; unexplained.
