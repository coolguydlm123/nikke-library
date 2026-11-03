# BBQ Master

Grill skewers to order before each customer runs out of patience. Better grilling scores more and fills the Fever gauge.

This guide was generated from the Nikke Library's reading of the game data: the viewer `lib/eventgames/bbqmaster.js` turns the `Event*` tables in `D:\Nikke Datamine\mpkparser\jsons` into the rules below. Numbers, units and formulas are the viewer's readings; anything it was not sure of is listed under "Uncertain / unknown". Long lists are cut to 30 rows.

- Art folder: `icons-event/01_bbqmaster`

## Overview

### A run

- **Time limit**: 120 s
- **Customer patience**: 20 s (warning 5 s before they leave)
- **New customer every**: 2.5 s on Easy, ×1.5 as often on Normal, ×2 on Hard
- **Difficulty**: Normal from 2,500 points, Hard from 4,500
- **Daily reward**: Score 4,500 in one run: Barbecue Daily Wage Box ×10

### Scoring

- **Points per skewer**: 200 × grade: Great 150%, Good 100%, Bad 0%
- **Fever gauge**: Fills by 100 × grade (same ratios) per skewer; Fever at 900
- **Fever**: Lasts 16 s; skewers roast 0.5 s apart
- **Bonus customers**: Some customers double the points (Points ×2) or the Fever gain (Fever ×2) of their order

### The grill

- **Fire**: Each tap adds 100 heat (max 1000); it drops 40 a second
- **At full heat**: Skewers roast 2.7× as fast
- **Burning**: A skewer left on the grill burns after 18 s
- **Overheating**: The grill overheats if kept at full heat for 7 s

### Ranks

| Rank | Score |
|---|---|
| **S** | 7,500 |
| **A** | 6,000 |
| **B** | 4,500 |
| **C** | 3,000 |
| **D** | 1,500 |

### Ingredients

- Meat
- Shrimp
- Corn
- Octopus
- Green Onion
- Splendamin

## Tutorial

### Step 1

- ■ Customers will visit the store at regular intervals. / ■ They will order barbecue skewers upon visit. / ■ Serve their order within the given time limit.

### Step 2

- ■ Select the ingredients for the skewer. / ■ Make sure to select the correct ingredients based on the customer's order. / ■ When done, tap the skewer to finish the preparation.

### Step 3

- ■ Place the prepped skewer on the grill to cook it. / ■ The state of the skewers will change according to the cooking time. / ■ Touch the firepower button to adjust the heat level. The required cooking time will shorten when the heat level is increased.

### Step 4

- ■ Tap to select the skewer on the grill. / ■ Tap the customer to serve the skewer. / ■ Tap the trash can to discard the designated skewer.

## Customers

### Easy orders

From the start of a run.

#### Possible orders

| Customer | Order | Bonus | Chance | Patience |
|---|---|---|---|---|
| Helm | Splendamin; Meat |  | 2.4% | 20 s |
| Helm | Corn; Splendamin |  | 2.4% | 20 s |
| Helm | Splendamin; Splendamin |  | 2.4% | 20 s |
| Helm | Meat; Green Onion; Splendamin |  | 2.4% | 20 s |
| Helm | Splendamin; Splendamin; Corn |  | 2.4% | 20 s |
| Helm | Meat; Meat; Splendamin | [Fever ×2] | 0.7% | 20 s |
| Helm | Splendamin; Green Onion; Corn | [Points ×2] | 0.7% | 20 s |
| Mary | Green Onion; Corn |  | 2.4% | 20 s |
| Mary | Shrimp; Green Onion |  | 2.4% | 20 s |
| Mary | Green Onion; Octopus |  | 2.4% | 20 s |
| Mary | Green Onion; Meat; Green Onion |  | 2.4% | 20 s |
| Mary | Corn; Green Onion; Shrimp |  | 2.4% | 20 s |
| Mary | Octopus; Green Onion; Meat | [Fever ×2] | 0.7% | 20 s |
| Mary | Shrimp; Green Onion; Green Onion | [Points ×2] | 0.7% | 20 s |
| Pepper | Meat; Octopus |  | 2.4% | 20 s |
| Pepper | Corn; Meat |  | 2.4% | 20 s |
| Pepper | Meat; Meat |  | 2.4% | 20 s |
| Pepper | Corn; Meat; Shrimp |  | 2.4% | 20 s |
| Pepper | Shrimp; Meat; Splendamin |  | 2.4% | 20 s |
| Pepper | Octopus; Meat; Corn | [Fever ×2] | 0.7% | 20 s |
| Pepper | Meat; Meat; Shrimp | [Points ×2] | 0.7% | 20 s |
| Rapi | Splendamin; Green Onion |  | 2.4% | 20 s |
| Rapi | Green Onion; Meat |  | 2.4% | 20 s |
| Rapi | Octopus; Green Onion |  | 2.4% | 20 s |
| Rapi | Green Onion; Shrimp; Green Onion |  | 2.4% | 20 s |
| Rapi | Splendamin; Meat; Splendamin |  | 2.4% | 20 s |
| Rapi | Meat; Green Onion; Green Onion | [Fever ×2] | 0.7% | 20 s |
| Rapi | Green Onion; Octopus; Shrimp | [Points ×2] | 0.7% | 20 s |
| Yan | Shrimp; Meat |  | 2.4% | 20 s |
| Yan | Octopus; Shrimp |  | 2.4% | 20 s |

(37 more rows of 67 not shown; see the data table.)

Chance is the customer’s weight against the others of this difficulty. Customers marked “later” only appear after a story stage of the event is cleared.

### Normal orders

Once your score reaches 2,500.

#### Possible orders

| Customer | Order | Bonus | Chance | Patience |
|---|---|---|---|---|
| Helm | Splendamin; Splendamin; Corn |  | 2.4% | 20 s |
| Helm | Meat; Green Onion; Splendamin |  | 2.4% | 20 s |
| Helm | Corn; Splendamin; Meat |  | 2.4% | 20 s |
| Helm | Splendamin; Green Onion; Splendamin; Meat |  | 2.4% | 20 s |
| Helm | Meat; Splendamin; Corn; Splendamin |  | 2.4% | 20 s |
| Helm | Splendamin; Splendamin; Meat; Splendamin | [Fever ×2] | 0.7% | 20 s |
| Helm | Splendamin; Meat; Green Onion; Corn | [Points ×2] | 0.7% | 20 s |
| Mary | Green Onion; Green Onion; Shrimp |  | 2.4% | 20 s |
| Mary | Octopus; Green Onion; Meat |  | 2.4% | 20 s |
| Mary | Green Onion; Splendamin; Shrimp |  | 2.4% | 20 s |
| Mary | Corn; Green Onion; Octopus; Green Onion |  | 2.4% | 20 s |
| Mary | Green Onion; Green Onion; Shrimp; Octopus |  | 2.4% | 20 s |
| Mary | Meat; Meat; Green Onion; Green Onion | [Fever ×2] | 0.7% | 20 s |
| Mary | Green Onion; Shrimp; Green Onion; Meat | [Points ×2] | 0.7% | 20 s |
| Pepper | Shrimp; Meat; Corn |  | 2.4% | 20 s |
| Pepper | Meat; Corn; Meat |  | 2.4% | 20 s |
| Pepper | Octopus; Meat; Meat |  | 2.4% | 20 s |
| Pepper | Meat; Meat; Shrimp; Meat |  | 2.4% | 20 s |
| Pepper | Meat; Corn; Octopus; Meat |  | 2.4% | 20 s |
| Pepper | Meat; Meat; Shrimp; Shrimp | [Fever ×2] | 0.7% | 20 s |
| Pepper | Meat; Corn; Meat; Meat | [Points ×2] | 0.7% | 20 s |
| Rapi | Green Onion; Meat; Green Onion |  | 2.4% | 20 s |
| Rapi | Corn; Green Onion; Shrimp |  | 2.4% | 20 s |
| Rapi | Splendamin; Meat; Green Onion |  | 2.4% | 20 s |
| Rapi | Green Onion; Corn; Green Onion; Shrimp |  | 2.4% | 20 s |
| Rapi | Splendamin; Green Onion; Green Onion; Meat |  | 2.4% | 20 s |
| Rapi | Splendamin; Green Onion; Green Onion; Meat | [Fever ×2] | 0.7% | 20 s |
| Rapi | Meat; Green Onion; Corn; Splendamin | [Points ×2] | 0.7% | 20 s |
| Yan | Shrimp; Octopus; Shrimp |  | 2.4% | 20 s |
| Yan | Shrimp; Shrimp; Meat |  | 2.4% | 20 s |

(37 more rows of 67 not shown; see the data table.)

Chance is the customer’s weight against the others of this difficulty. Customers marked “later” only appear after a story stage of the event is cleared.

### Hard orders

Once your score reaches 4,500.

#### Possible orders

| Customer | Order | Bonus | Chance | Patience |
|---|---|---|---|---|
| Helm | Splendamin; Meat; Splendamin; Green Onion |  | 2.4% | 20 s |
| Helm | Green Onion; Green Onion; Corn; Splendamin |  | 2.4% | 20 s |
| Helm | Splendamin; Splendamin; Meat; Meat |  | 2.4% | 20 s |
| Helm | Meat; Green Onion; Splendamin; Green Onion; Splendamin |  | 2.4% | 20 s |
| Helm | Splendamin; Corn; Green Onion; Splendamin; Meat |  | 2.4% | 20 s |
| Helm | Meat; Meat; Splendamin; Splendamin; Green Onion | [Fever ×2] | 0.7% | 20 s |
| Helm | Splendamin; Green Onion; Green Onion; Corn; Meat | [Points ×2] | 0.7% | 20 s |
| Mary | Green Onion; Octopus; Green Onion; Shrimp |  | 2.4% | 20 s |
| Mary | Meat; Green Onion; Corn; Green Onion |  | 2.4% | 20 s |
| Mary | Green Onion; Shrimp; Meat; Green Onion |  | 2.4% | 20 s |
| Mary | Green Onion; Green Onion; Meat; Green Onion; Meat |  | 2.4% | 20 s |
| Mary | Octopus; Green Onion; Shrimp; Green Onion; Octopus |  | 2.4% | 20 s |
| Mary | Green Onion; Green Onion; Shrimp; Shrimp; Green Onion | [Fever ×2] | 0.7% | 20 s |
| Mary | Green Onion; Shrimp; Meat; Octopus; Green Onion | [Points ×2] | 0.7% | 20 s |
| Pepper | Meat; Meat; Corn; Octopus |  | 2.4% | 20 s |
| Pepper | Octopus; Meat; Shrimp; Meat |  | 2.4% | 20 s |
| Pepper | Shrimp; Meat; Meat; Meat |  | 2.4% | 20 s |
| Pepper | Meat; Octopus; Corn; Meat; Octopus |  | 2.4% | 20 s |
| Pepper | Shrimp; Meat; Shrimp; Meat; Meat |  | 2.4% | 20 s |
| Pepper | Corn; Meat; Meat; Shrimp; Octopus | [Fever ×2] | 0.7% | 20 s |
| Pepper | Meat; Shrimp; Meat; Shrimp; Meat | [Points ×2] | 0.7% | 20 s |
| Rapi | Green Onion; Corn; Green Onion; Meat |  | 2.4% | 20 s |
| Rapi | Shrimp; Green Onion; Splendamin; Shrimp |  | 2.4% | 20 s |
| Rapi | Meat; Meat; Green Onion; Green Onion |  | 2.4% | 20 s |
| Rapi | Green Onion; Meat; Green Onion; Meat; Shrimp |  | 2.4% | 20 s |
| Rapi | Splendamin; Octopus; Green Onion; Shrimp; Green Onion |  | 2.4% | 20 s |
| Rapi | Green Onion; Green Onion; Green Onion; Corn; Splendamin | [Fever ×2] | 0.7% | 20 s |
| Rapi | Shrimp; Green Onion; Meat; Green Onion; Meat | [Points ×2] | 0.7% | 20 s |
| Yan | Shrimp; Meat; Octopus; Shrimp |  | 2.4% | 20 s |
| Yan | Corn; Shrimp; Shrimp; Shrimp |  | 2.4% | 20 s |

(37 more rows of 67 not shown; see the data table.)

Chance is the customer’s weight against the others of this difficulty. Customers marked “later” only appear after a story stage of the event is cleared.

## Rewards

### Score rewards

Rewards for the total score added up over all your runs.

| Step | Total score | Reward |
|---|---|---|
| 1 | 12,000 | Barbecue Daily Wage Box ×10 |
| 2 | 24,000 | Gem ×100 |
| 3 | 36,000 | Barbecue Daily Wage Box ×25 |
| 4 | 48,000 | Gem ×100 |
| 5 | 60,000 | Barbecue Daily Wage Box ×40 |
| 6 | 72,000 | Gem ×150 |
| 7 | 84,000 | Barbecue Daily Wage Box ×55 |
| 8 | 96,000 | Gem ×200 |
| 9 | 108,000 | Barbecue Daily Wage Box ×80 |
| 10 | 120,000 | Gem ×200 |

### Score rewards (rerun)

Rewards for the total score added up over all your runs.

| Step | Total score | Reward |
|---|---|---|
| 1 | 25,000 | Gem ×20 |
| 2 | 50,000 | Gem ×20 |
| 3 | 75,000 | Gem ×20 |
| 4 | 100,000 | Gem ×20 |
| 5 | 125,000 | Gem ×20 |
| 6 | 150,000 | Gem ×20 |
| 7 | 175,000 | Gem ×20 |
| 8 | 200,000 | BBQ MASTER Premium Sticker II ×1 |
| 9 | 225,000 | Gem ×20 |
| 10 | 250,000 | Gem ×20 |
| 11 | 275,000 | Gem ×20 |
| 12 | 300,000 | Gem ×20 |
| 13 | 325,000 | Gem ×20 |
| 14 | 350,000 | Gem ×20 |
| 15 | 375,000 | Gem ×20 |
| 16 | 400,000 | Gem ×20 |
| 17 | 425,000 | BBQ MASTER Premium Sticker I ×1 |

## Story and cartoons

### Story

| Runs | Scene |
|---|---|
| 1 | story "Unappetizing Octopus" (`d_contents_bbqmaster_01`) |
| 3 | story "Do You Like Green Onions?" (`d_contents_bbqmaster_02`) |
| 5 | story "Special Firepower" (`d_contents_bbqmaster_03`) |
| 7 | story "R&R" (`d_contents_bbqmaster_04`) |
| 9 | story "The Corn Master" (`d_contents_bbqmaster_05`) |
| 11 | story "Dogs Have Preferences Too" (`d_contents_bbqmaster_06`) |
| 13 | story "A Taste of the High Seas" (`d_contents_bbqmaster_07`) |
| 15 | story "Farewell, Barbecue Master" (`d_contents_bbqmaster_08`) |

Unlocked by playing: each scene opens after the given number of runs.

### End-of-run cartoons

| Cartoon | Caption | Ranks |
|---|---|---|
|  | Who placed the charcoal block here?! | C, D, F |
|  | Don't cry, Neon. | C, D, F |
|  | The two of them were eating when one of them suddenly... died?! | A, B |
|  | We're sold out! All sold out! | A, B |
|  | Hey Commander! / Would you like to have one? | S |

Which cartoon can play depends on the rank you finish with.

## Data sources

All in `D:\Nikke Datamine\mpkparser\jsons` as `<Table>.json`.

| Table | Rows | Fields |
|---|---|---|
| `EventBBQTycoonArcadeManagerTable` | 1 | `id`, `arcade_event_id`, `exist_manager_id`, `step_up_reward_group_id`, `help_tip_view_sub_id` |
| `EventBBQTycoonArchiveManagerTable` | 1 | `id`, `event_id`, `exist_manager_id`, `help_tip_view_sub_id` |
| `EventBBQTycoonManagerTable` | 1 | `id`, `event_id`, `ui_prefab`, `customer_group_id`, `skewer_stuff_group_id`, `time_limit`, `customer_visit_rate`, `customer_visit_rate_difficulty_1_ratio`, `customer_visit_rate_difficulty_2_ratio`, `customer_visit_rate_difficulty_3_ratio`, `point_standard`, `point_grade_ratio_great`, `point_grade_ratio_good`, `fever_target_gauge`, `fever_standard_increase`, `fever_grade_ratio_great`, `fever_grade_ratio_good`, `fever_time`, `fever_skewer_roast_delay`, `firepower_increase_per_touch`, `firepower_decrease_per_second`, `max_firepower`, `max_firepower_roast_speed_ratio`, `time_to_burn_skewer`, `grill_max_overheating_time`, `game_start_action_time_control`, `fever_start_action_time_control`, `end_imminent_alert_start_time`, `daily_reward_target_point`, `daily_reward_id`, `step_up_reward_group_id`, `difficulty_2_start_point`, `difficulty_3_start_point`, `d_rank_target_point`, `c_rank_target_point`, `b_rank_target_point`, `a_rank_target_point`, `s_rank_target_point`, `first_enter_scenario_group_id`, `cartoon_cutscene_group_id`, `album_category_id`, `album_description_localkey`, `scenario_group_id`, `customer_limit_expire_alert_time`, `customer_exit_delay_time`, `customer_exit_time`, `tutorial_group_id` |
| `EventBBQTycoonTutorialTable` | 4 | `id`, `group_id`, `tutorial_resource`, `tutorial_description_localkey` |
| `EventBBQTycoonCartoonCutSceneTable` | 5 | `id`, `group_id`, `cartoon_cutscene`, `cartoon_cutscene_description`, `is_appear_in_f_rank`, `is_appear_in_d_rank`, `is_appear_in_c_rank`, `is_appear_in_b_rank`, `is_appear_in_a_rank`, `is_appear_in_s_rank` |
| `EventBBQTycoonCustomerTable` | 201 | `id`, `group_id`, `customer_name_localkey`, `customer_resource_prefab`, `customer_difficulty`, `customer_limit_time`, `bonus_type`, `customer_appearance_rate`, `condition_stage_event_id`, `customer_appearance_stage_condition`, `skewer_stuff_id_1`, `skewer_stuff_id_2`, `skewer_stuff_id_3`, `skewer_stuff_id_4`, `skewer_stuff_id_5` |
| `EventBBQTycoonScenarioTable` | 8 | `id`, `group_id`, `scenario_dialog_group_id`, `scenario_output_condition` |
| `EventBBQTycoonSkewerStuffTable` | 6 | `id`, `group_id`, `ui_index`, `stuff_name_localkey`, `ui_portrait_image`, `stuff_resource_prefab` |
| `EventBBQTycoonStepUpRewardTable` | 27 | `id`, `group_id`, `step`, `target_point`, `reward_id` |

## Uncertain / unknown

The viewer flagged nothing as uncertain. Fields it does not show are listed in Data sources; their meaning is not interpreted.
