# Gift Factory

Sort boxes on a conveyor belt: gifts go to the Box District, Rapture boxes to the Rapture District. Correct sorts score points and charge Full Burst; mistakes stop you for a moment.

This guide was generated from the Nikke Library's reading of the game data: the viewer `lib/eventgames/sortout.js` turns the `Event*` tables in `D:\Nikke Datamine\mpkparser\jsons` into the rules below. Numbers, units and formulas are the viewer's readings; anything it was not sure of is listed under "Uncertain / unknown". Long lists are cut to 30 rows.

## Overview

### A run

- **Intro story**: story "Gift Factory ☆" (`d_contents_giftfactory`)
- **Time limit**: 60 s
- **Cost**: 1 Snowflake Gloves per run (Practice Mode is free but gives no rewards)
- **Tickets**: +3 a day, up to 3
- **Wrong sort**: You can't sort for a short time (penalty value 100; likely 1/100 s, i.e. 1 s)

### Full Burst

- **Gauge per correct sort**: 500 of 10,000, so 20 correct sorts fill it
- **Drain**: 2,000 at a time once active (5 steps to empty; likely 5 s)
- **During Full Burst**: Burst Gifts appear; they can go to either side and do not fill the gauge
- **"Correct count"**: 10 (meaning unclear)

### Difficulty

| Level | From score | Points per box | Boxes |
|---|---|---|---|
| 1 | 0 | 10 | Gift 1 (red), Rapture box 1 |
| 2 | 500 | 20 | Gift 1 (red), Rapture box 1, Gift 2 (green), Rapture box 2 |
| 3 | 2,500 | 30 | Gift 1 (red), Rapture box 1, Gift 2 (green), Rapture box 2, Gift 3, Rapture box 3 |

Each level adds new box types and pays more per correct sort. The special gift and Burst Gift can show up at every level.

### Ranks and rewards

| Rank | Score | Reward |
|---|---|---|
| **S** | 3,500+ | Rupee's Ultra-Premium Gift Box ×5 |
| **A** | 2,000 – 3,499 | Rupee's Ultra-Premium Gift Box ×4 |
| **B** | 1,000 – 1,999 | Rupee's Ultra-Premium Gift Box ×3 |
| **C** | 500 – 999 | Rupee's Premium Gift Box ×3 |
| **D** | 0 – 499 | Rupee's Premium Gift Box ×1 |

Your score at the end of a run decides your rank and its reward.

## Boxes

Which way each box goes, and from which difficulty level it appears.

| Box | Sort to | From level | Resource |
|---|---|---|---|
| **Gift 1 (red)** | Box District | 1 | `sortout_box_gift_01` |
| **Gift 2 (green)** | Box District | 2 | `sortout_box_gift_02` |
| **Gift 3** | Box District | 3 | `sortout_box_gift_03` |
| **Special gift (blue)** | Box District (sorting it sets off something special) | 1 | `sortout_box_special` |
| **Rapture box 1** | Rapture District | 1 | `sortout_box_enermy_01` |
| **Rapture box 2** | Rapture District | 2 | `sortout_box_enermy_02` |
| **Rapture box 3** | Rapture District | 3 | `sortout_box_enermy_03` |
| **Burst Gift** | either side | 1 | `sortout_box_fever` |

Colours come from the mission texts. Sprites for this game are not extracted, so boxes are listed by name and resource id.

## Rewards

### Missions

| Mission | Counts | Target | Reward |
|---|---|---|---|
| Earn a total of 200,000 points | Total points (all runs) | 200,000 | Gem ×20 |
| Earn a total of 400,000 points | Total points (all runs) | 400,000 | Gem ×20 |
| Earn a total of 600,000 points | Total points (all runs) | 600,000 | Gem ×20 |
| Earn a total of 800,000 points | Total points (all runs) | 800,000 | Gem ×20 |
| Earn a total of 1,000,000 points | Total points (all runs) | 1,000,000 | Gem ×20 |
| Earn a total of 1,300,000 points | Total points (all runs) | 1,300,000 | GIFT FACTORY ☆ Premium Sticker I ×1 |
| Earn 7,000 points in a round | Points in one run | 7,000 | Gem ×20 |
| Earn 8,000 points in a round | Points in one run | 8,000 | Gem ×20 |
| Earn 9,000 points in a round | Points in one run | 9,000 | Gem ×20 |
| Earn 10,500 points in a round | Points in one run | 10,500 | Gem ×20 |
| Earn 12,000 points in a round | Points in one run | 12,000 | Gem ×20 |
| Categorize 1,000 red gifts | Boxes sorted | 1,000 | Gem ×20 |
| Categorize 3,000 red gifts | Boxes sorted | 3,000 | Gem ×20 |
| Categorize 5,000 red gifts | Boxes sorted | 5,000 | Gem ×20 |
| Categorize 2,000 green gifts | Boxes sorted | 2,000 | Gem ×20 |
| Categorize 3,000 green gifts | Boxes sorted | 3,000 | Gem ×20 |
| Categorize 300 blue gifts | Boxes sorted | 300 | GIFT FACTORY ☆ Special Sticker I ×1 |

## How to play

### Gift Factory ☆

- Examine the presents that Rupee prepared and separate the real gifts from Rapture parts.

### Start Game

- Spend Tickets to start a game
- Starting a game in Practice Mode doesn't cost Tickets

### Categorize Boxes

- Tap the bottom of the conveyor belt to assign boxes to categories
- Normal boxes and special boxes will go to the Box District
- Rapture boxes will go to the Rapture District
- Categorizing a box correctly grants Points and fills the Burst Gauge
- Categorizing a box incorrectly will make you temporarily unable to continue categorizing

### Special Box

- Something special may occur when boxes are assigned to the gift box category
- Assign all the boxes on the conveyor belt to the proper category according to their shape

### Full Burst

- Activates when you have categorized enough boxes to fill the Burst Gauge.
- During Full Burst, Burst Gifts will appear.
- Burst Gifts can be categorized and moved to the left or right.
- Burst Gifts will not contribute to filling the Burst Gauge.

### Difficulty

- The difficulty will ramp up at set intervals.
- As the difficulty increases, more types of boxes will appear.
- As the difficulty increases, you can earn more Points.

### Rewards

- Redeem various rewards with the Points you've earned.
- You cannot receive any rewards in Practice Mode.

## Data sources

All in `D:\Nikke Datamine\mpkparser\jsons` as `<Table>.json`.

| Table | Rows | Fields |
|---|---|---|
| `EventSortOutMissionTable` | 17 | `id`, `manager_id`, `mission_localkey`, `mission_type`, `mission_target_id`, `mission_count`, `reward_id` |
| `EventSortOutBoxTable` | 8 | `id`, `group_id`, `box_resource` |
| `EventSortOutTable` | 2 | `id`, `event_manager_id`, `is_archive_event`, `enter_scenario`, `name_localkey`, `auto_charge_id`, `currency_ticket`, `time`, `level1_wave`, `level2_wave`, `level3_wave`, `level2_start_point`, `level3_start_point`, `gain_fever_gauge`, `max_fever_gauge`, `decrease_fever_gauge`, `correct_count`, `penalty_time`, `rank_d_max_point`, `rank_d_reward`, `rank_c_min_point`, `rank_c_max_point`, `rank_c_reward`, `rank_b_min_point`, `rank_b_max_point`, `rank_b_reward`, `rank_a_min_point`, `rank_a_max_point`, `rank_a_reward`, `rank_s_min_point`, `rank_s_reward` |
| `EventSortOutWaveTable` | 3 | `id`, `level`, `gain_point`, `box1_id`, `box2_id`, `box3_id`, `box4_id`, `box5_id`, `box6_id`, `box_special_id`, `box_fever_id` |

The viewer also reads: `AutoChargeTable`.

## Uncertain / unknown

- … (meaning unclear)
