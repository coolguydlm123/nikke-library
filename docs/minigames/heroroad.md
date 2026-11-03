# Hero Road (Dice)

A dice board: spend tokens to roll, move around a looping board and land on cells that give items or fill a gauge. Each full gauge pays a step reward. Covers Hero Road (Laplace) and Volt Road (Volt).

This guide was generated from the Nikke Library's reading of the game data: the viewer `lib/eventgames/heroroad.js` turns the `Event*` tables in `D:\Nikke Datamine\mpkparser\jsons` into the rules below. Numbers, units and formulas are the viewer's readings; anything it was not sure of is listed under "Uncertain / unknown". Long lists are cut to 30 rows.

- Art folder: `icons-event/01_laplace`

## Overview

### How it plays

- Each roll costs event tokens; the character moves as many cells as the dice shows.
- Rest, Training and Combat/Search cells fill the gauge; Poor Condition/Accident cells drain it; Item cells give an item; Move cells push you forward or back.
- Training in a row gives more each time (1st, 2nd, 3rd); Combat/Search rolls a small, medium or large amount.
- Passing the Start cell (Go the Distance) adds a big chunk of gauge.
- A full gauge (100) triggers the gauge event: you get the next step reward and the gauge empties. After the last step a repeat reward is given.

### Boards

| Board | Token | Tokens per roll | Cells | Step rewards |
|---|---|---|---|---|
| Hero Road | Signal Tower | 40 | 30 | 10 |
| Volt Road | Volt Dice | 1 | 30 | 10 |

## Boards

### Hero Road

Spend a day as Laplace.

- **Roll**: 40 × Signal Tower per roll (rerun: Hero Dice); move as many cells as the dice shows
- **Hero Power**: Fills to 100; at 100 the Decimate event plays, gives the next step reward and resets the gauge to 0
- **Go the Distance**: Passing the Start cell gives +50 Hero Power
- **Step rewards**: 10 special rewards for the 1st to 10th Decimate, then a repeat reward each time
- **Rerun**: The archive rerun uses the same board without cell or step rewards.

#### Cell types

|  | Cell | Effect | On board |
|---|---|---|---|
|  | Rest (Get 5 Hero Power.) | +5 Hero Power | 5 |
|  | Go the Distance ("Go the Distance" will be triggered when you skip over a cell. Move 3 cells towards the direction of the arrow upon arrival.) | Move 3 cells on when landed on; passing it gives +50 Hero Power | 1 |
|  | Item reward (Obtain reward for that cell) | Item reward only | 8 |
|  | Training (Get 5 Hero Power. / You can earn additional Hero Power by triggering events in quick succession.) | +5 Hero Power (+10 for a 2nd training in a row, +20 for a 3rd) | 6 |
|  | Poor Condition (Reduce 10 Hero Power) | −10 Hero Power | 3 |
|  | Combat (Get 5 Hero Power. / There's a chance to get extra Hero Power.) | +5 (70%), +10 (25%) or +15 (5%) Hero Power | 3 |
|  | Move Cells (Move N cells towards the direction of the arrow) | Move a set number of cells (see the cells list) | 4 |

#### Cells

| Slot | Cell | Effect | Reward |
|---|---|---|---|
| 2 | Rest | +5 Hero Power | Elysion Common Console ×1 |
| 3 | Go the Distance | Move 3 cells on when landed on; passing it gives +50 Hero Power |  |
| 4 | Rest | +5 Hero Power | Elysion Common Console ×1 |
| 6 | Item reward | Item reward only | Defender Common Console ×1 |
| 7 | Item reward | Item reward only | Supporter Common Console ×1 |
| 8 | Training | +5 Hero Power (+10 for a 2nd training in a row, +20 for a 3rd) | Tetra Common Console ×1 |
| 9 | Item reward | Item reward only | Attacker Common Console ×1 |
| 10 | Poor Condition | −10 Hero Power | Battle Data Set Case ×1 |
| 14 | Combat | +5 (70%), +10 (25%) or +15 (5%) Hero Power | RE-Energy ×1 |
| 15 | Training | +5 Hero Power (+10 for a 2nd training in a row, +20 for a 3rd) | Missilis Common Console ×1 |
| 18 | Rest | +5 Hero Power | Pilgrim Common Console ×1 |
| 20 | Combat | +5 (70%), +10 (25%) or +15 (5%) Hero Power | RE-Energy ×1 |
| 22 | Training | +5 Hero Power (+10 for a 2nd training in a row, +20 for a 3rd) | Missilis Common Console ×1 |
| 24 | Item reward | Item reward only | Supporter Common Console ×1 |
| 26 | Move Cells | Move 2 cells back |  |
| 29 | Rest | +5 Hero Power | Elysion Common Console ×1 |
| 31 | Item reward | Item reward only | Defender Common Console ×1 |
| 34 | Move Cells | Move 4 cells on |  |
| 36 | Training | +5 Hero Power (+10 for a 2nd training in a row, +20 for a 3rd) | Tetra Common Console ×1 |
| 38 | Item reward | Item reward only | Defender Common Console ×1 |
| 41 | Move Cells | Move 3 cells on |  |
| 42 | Training | +5 Hero Power (+10 for a 2nd training in a row, +20 for a 3rd) | Missilis Common Console ×1 |
| 45 | Poor Condition | −10 Hero Power | Battle Data Set Case ×1 |
| 46 | Rest | +5 Hero Power | Pilgrim Common Console ×1 |
| 49 | Item reward | Item reward only | Supporter Common Console ×1 |
| 51 | Item reward | Item reward only | Attacker Common Console ×1 |
| 52 | Poor Condition | −10 Hero Power | Credit Case ×1 |
| 53 | Training | +5 Hero Power (+10 for a 2nd training in a row, +20 for a 3rd) | Tetra Common Console ×1 |
| 56 | Move Cells | Move 1 cells back |  |
| 57 | Combat | +5 (70%), +10 (25%) or +15 (5%) Hero Power | RE-Energy ×1 |

Listed by the cell’s position number on the board (slot); the route itself follows the arrows on the board.

#### Decimate rewards

| Step | Reward | Story |
|---|---|---|
| 1 | Recruit Voucher ×1 |  |
| 2 | Recruit Voucher ×2 |  |
| 3 | Advanced Recruit Voucher ×2 |  |
| 4 | Advanced Recruit Voucher ×3 |  |
| 5 | Elysion Common Console ×1 |  |
| 6 | Pilgrim Common Console ×1 |  |
| 7 | Missilis Common Console ×1 |  |
| 8 | Tetra Common Console ×1 |  |
| 9 | RE-Energy ×1 |  |
| 10 | Attacker Common Console ×1 |  |
| Repeat | Core Dust Case ×1 |  |

One step per full Hero Power gauge. After the last step the repeat reward is given every time.

#### Cell events

|  | Event | Line |
|---|---|---|
|  | Rest | Rest fully to recharge. |
|  | Training | Training is the cornerstone for any hero! |
|  | Training | Complete 2 rounds of training. |
|  | Training | Complete 3 rounds of training. |
|  | Operation Successful | Operation completed! |
|  | Operation Successful: With Honors | A resounding success! |
|  | Operation Successful: With High Distinction | Your actions have proven you a true hero. |
|  | Poor Condition | Ow... My knees... |
|  | Go the Distance | Crossed the finish line successfully! |
|  | Reward for destroying N time(s). | Held out against the Rapture invasion. |

The cut-in shown for each event.

### Volt Road

Spend a day as Volt.

- **Intro story**: story "Woof!" (`d_contents_voltroad_01`)
- **Roll**: 1 × Volt Dice per roll; move as many cells as the dice shows
- **Search Degree**: Fills to 100; at 100 the Search Success event plays, gives the next step reward and resets the gauge to 0
- **Go the Distance**: Passing the Start cell gives +50 Search Degree
- **Step rewards**: 10 special rewards for the 1st to 10th Search Success, then a repeat reward each time
- **Rerun**: The archive rerun uses the same board without cell or step rewards.

#### Cell types

|  | Cell | Effect | On board |
|---|---|---|---|
|  | Training (5 Search Degree obtained. / The amount gained increases when incidents occur consecutively.) | +5 Search Degree (+10 for a 2nd training in a row, +20 for a 3rd) | 6 |
|  | Item Reward (Obtain reward(s) for that cell.) | Item reward only | 8 |
|  | Search (5 Search Degree obtained. / A chance to get bonus Search Degree.) | +5 (70%), +10 (25%) or +15 (5%) Search Degree | 4 |
|  | Rest (5 Search Degree obtained.) | +5 Search Degree | 5 |
|  | Move Cells (Move N cell(s) toward the direction of the arrow.) | Move a set number of cells (see the cells list) | 3 |
|  | Accident Occurred (5 Search Degree lost.) | −5 Search Degree | 3 |
|  | Go the Distance ("Go the Distance" will be triggered when you skip over a cell. / Move 3 cell(s) toward the direction of the arrow upon arrival.) | Move 3 cells on when landed on; passing it gives +50 Search Degree | 1 |

#### Cells

| Slot | Cell | Effect | Reward |
|---|---|---|---|
| 2 | Training | +5 Search Degree (+10 for a 2nd training in a row, +20 for a 3rd) | Tetra Common Console ×2 |
| 6 | Item Reward | Item reward only | Burst Manual I ×3 |
| 7 | Search | +5 (70%), +10 (25%) or +15 (5%) Search Degree | Supporter Common Console ×2 |
| 8 | Item Reward | Item reward only | Ultra Boost Module ×1 |
| 10 | Rest | +5 Search Degree | Ultra Boost Module ×1 |
| 12 | Rest | +5 Search Degree | Missilis Common Console ×2 |
| 13 | Move Cells | Move 3 cells on |  |
| 15 | Training | +5 Search Degree (+10 for a 2nd training in a row, +20 for a 3rd) | Abnormal Common Console ×2 |
| 18 | Accident Occurred | −5 Search Degree | Ultra Boost Module ×1 |
| 19 | Move Cells | Move 6 cells on |  |
| 23 | Item Reward | Item reward only | Skill Manual II ×2 |
| 24 | Accident Occurred | −5 Search Degree | Ultra Boost Module ×1 |
| 27 | Training | +5 Search Degree (+10 for a 2nd training in a row, +20 for a 3rd) | Attacker Common Console ×2 |
| 29 | Search | +5 (70%), +10 (25%) or +15 (5%) Search Degree | Elysion Common Console ×2 |
| 32 | Search | +5 (70%), +10 (25%) or +15 (5%) Search Degree | Tetra Common Console ×2 |
| 33 | Item Reward | Item reward only | Burst Manual II ×2 |
| 36 | Rest | +5 Search Degree | Missilis Common Console ×2 |
| 37 | Training | +5 Search Degree (+10 for a 2nd training in a row, +20 for a 3rd) | Pilgrim Common Console ×2 |
| 41 | Item Reward | Item reward only | Skill Manual I ×3 |
| 42 | Rest | +5 Search Degree | Abnormal Common Console ×2 |
| 45 | Move Cells | Move 4 cells on |  |
| 47 | Item Reward | Item reward only | Ultra Boost Module ×1 |
| 49 | Training | +5 Search Degree (+10 for a 2nd training in a row, +20 for a 3rd) | Defender Common Console ×2 |
| 51 | Go the Distance | Move 3 cells on when landed on; passing it gives +50 Search Degree |  |
| 54 | Accident Occurred | −5 Search Degree | Pilgrim Common Console ×2 |
| 56 | Training | +5 Search Degree (+10 for a 2nd training in a row, +20 for a 3rd) | Elysion Common Console ×2 |
| 57 | Rest | +5 Search Degree | Ultra Boost Module ×1 |
| 58 | Item Reward | Item reward only | Skill Manual II ×2 |
| 61 | Item Reward | Item reward only | Skill Manual I ×3 |
| 62 | Search | +5 (70%), +10 (25%) or +15 (5%) Search Degree | Defender Common Console ×2 |

Listed by the cell’s position number on the board (slot); the route itself follows the arrows on the board.

#### Search Success rewards

| Step | Reward | Story |
|---|---|---|
| 1 | Gem ×50 |  |
| 2 | Gem ×50 |  |
| 3 | Gem ×50 | story "Woof woof!" (`d_contents_voltroad_02`) |
| 4 | Gem ×50 |  |
| 5 | Gem ×50 |  |
| 6 | Gem ×100 | story "*Awwooooo*" (`d_contents_voltroad_03`) |
| 7 | Gem ×100 |  |
| 8 | Gem ×100 |  |
| 9 | Gem ×100 |  |
| 10 | Gem ×100 | story "Awwwoooo!" (`d_contents_voltroad_04`) |
| Repeat | Central Government Supply Chest I ×1 |  |

One step per full Search Degree gauge. After the last step the repeat reward is given every time.

#### Cell events

|  | Event | Line |
|---|---|---|
|  | Rest | Puppies should rest when they need to. |
|  | Training | Improve your agility with some Watermelon Training! |
|  | Training | Two training sessions in a row! |
|  | Training | Three training sessions in a row! |
|  | Search Successful | Found something with a basic scan! |
|  | Search Super Successful | Found some resources with Neon using the naked eye. |
|  | Search Super Duper Successful | The three of us tactically discovered a mining site. |
|  | Accident Occurred | Oh, for goodness' sake, Volt! |
|  | Go the Distance | Nice! After a bit of elbow grease, you've got yourself a nice chew toy! |
|  | Reward for Searching N Time(s) | Good doggy! You did a great job today, too! |

The cut-in shown for each event.

## Data sources

All in `D:\Nikke Datamine\mpkparser\jsons` as `<Table>.json`.

| Table | Rows | Fields |
|---|---|---|
| `EventDiceBoardTable` | 120 | `id`, `group_id`, `slot_id`, `move_rotation`, `move_rotation_reverse`, `event_type`, `go_to`, `reward_id`, `get_heropower_1`, `get_heropower_2`, `get_heropower_3`, `get_heropower_1_rate`, `get_heropower_2_rate`, `get_heropower_3_rate` |
| `EventDiceTable` | 4 | `id`, `name_localkey`, `album_name`, `album_description`, `is_archive`, `board_id`, `resource_id`, `event_id`, `ui_prefab`, `first_enter_scenario_group_id`, `event_item_id`, `album_category_group`, `help_tip_view_sub_id`, `max_gauge`, `max_clear`, `dice_consume`, `player_move_time`, `board_finish_gauge`, `dice_clear_reward_list`, `clear_reward_id_repeat`, `maxgauge_step_localkey`, `maxgauge_step_repeat_localkey` |
| `EventDiceResourceTable` | 40 | `id`, `group_id`, `slot_type`, `name_localkey`, `description_localkey`, `ani_resource`, `image_resource` |
| `EventDiceTileLocaleTable` | 32 | `id`, `group_id`, `slot_type`, `name_localkey`, `description_localkey` |

The viewer also reads: `HelpTipDescriptionTable`, `HelpTipTable`.

## Uncertain / unknown

The viewer flagged nothing as uncertain. Fields it does not show are listed in Data sources; their meaning is not interpreted.
