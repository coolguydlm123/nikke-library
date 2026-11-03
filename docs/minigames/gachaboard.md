# 5x5 Supplies

Flip tiles on a 5×5 supply board with tickets. Each board holds a fixed set of prizes; find the Type A prize (or flip 18 tiles) to take a resupply reward and start a new board.

This guide was generated from the Nikke Library's reading of the game data: the viewer `lib/eventgames/gachaboard.js` turns the `Event*` tables in `D:\Nikke Datamine\mpkparser\jsons` into the rules below. Numbers, units and formulas are the viewer's readings; anything it was not sure of is listed under "Uncertain / unknown". Long lists are cut to 30 rows.

## Overview

### How it works

- Each ticket flips one tile of the 5×5 board and gives the reward under it.
- A board holds a fixed set of 25 rewards (1 Type A, a few Type B, more Type C and D), so what you have flipped is gone until the next board.
- Find the Type A tile, or flip 18 tiles, to request a resupply: you get the cycle's resupply reward and a fresh board.
- Every tile flipped adds 1 to the Fever count; when it reaches 10, 18, 25, that flip pays ×2. Resupplying resets it.
- Tickets: a daily login gift plus missions for the featured Nikkes.

### Events

| Featured Nikkes | Ticket | Daily gift |
|---|---|---|
| Little Mermaid & Mihara: Bonding Chain | 5X5 Gacha Ticket | Shifty's Daily Supply |
| Nayuta & Liberalio | 5X5 Gacha Ticket | Shifty's Daily Supply |
| Anis: Star & Neon: Vision Eye | Shiny 5x5 Gacha Ticket | Anis's Daily Supply |

## Events

### Little Mermaid & Mihara: Bonding Chain

Ticket: 5X5 Gacha Ticket · daily gift: Shifty's Daily Supply

- **Ticket**: 1 5X5 Gacha Ticket per tile
- **Board**: 5 × 5 tiles
- **Daily gift**: Shifty's Daily Supply: 3 tickets a day for logging in
- **Resupply**: After finding the Type A tile, or after flipping 18 tiles
- **Bulk Claim**: Flips up to 2 tiles at once (fewer if you lack tickets or tiles); stops early if it hits Type A
- **Fever**: When the Fever count reaches 10, 18, 25 (1 per tile flipped, reset on resupply), that flip's reward is ×2

#### Board prizes

| Supply | Tiles | First flip | Reward |
|---|---|---|---|
| [Type A] | 1 | 4% | Custom Module ×2 |
| [Type B] | 1 | 4% | Skill Manual Box ×3 |
| [Type B] | 1 | 4% | Burst Manual Box ×3 |
| [Type C] | 2 | 8% | Skill Manual I ×30 |
| [Type C] | 2 | 8% | Skill Manual II ×20 |
| [Type C] | 2 | 8% | Skill Manual III ×10 |
| [Type C] | 2 | 8% | Burst Manual I ×15 |
| [Type C] | 2 | 8% | Burst Manual II ×10 |
| [Type C] | 2 | 8% | Burst Manual III ×5 |
| [Type C] | 3 | 12% | Beginner Maintenance Kit ×10 |
| [Type D] | 3 | 12% | Ultra-Double Boost Module ×8 |
| [Type D] | 4 | 16% | Credit ×90,000 |

25 tiles. Each tile is equally likely, so a prize's chance on the next flip is its tiles ÷ the tiles still face down. The first-flip chance is shown.

#### Resupply rewards

| Cycle | Reward |
|---|---|
| 1 | Advanced Recruit Voucher ×2 |
| 2 | Advanced Recruit Voucher ×3 |
| 3 | Advanced Recruit Voucher ×5 |
| 4 | T9 Equipment Manufacturer Selection Box ×1 |
| 5 | Collection Item Selection Box ×1 |
| 6+ | Custom Module ×1 |

Taken when you resupply (end a cycle). The last one repeats for every later cycle.

#### Supply missions

| Nikke | Goal | Reward |
|---|---|---|
| Little Mermaid | Obtain her | 5X5 Gacha Ticket ×3 |
| Little Mermaid | Skill 1 to Lv. 4 | 5X5 Gacha Ticket ×2 |
| Little Mermaid | Skill 1 to Lv. 7 | 5X5 Gacha Ticket ×4 |
| Little Mermaid | Skill 2 to Lv. 4 | 5X5 Gacha Ticket ×2 |
| Little Mermaid | Skill 2 to Lv. 7 | 5X5 Gacha Ticket ×4 |
| Little Mermaid | Burst Skill to Lv. 4 | 5X5 Gacha Ticket ×2 |
| Little Mermaid | Burst Skill to Lv. 7 | 5X5 Gacha Ticket ×4 |
| Little Mermaid | Bond Lv. 10 | 5X5 Gacha Ticket ×2 |
| Little Mermaid | Equip an SR Collection Item | 5X5 Gacha Ticket ×3 |
| Little Mermaid | SR Collection Item to Lv. 5 | 5X5 Gacha Ticket ×4 |
| Little Mermaid | Overload (modify) a T9 gear | 5X5 Gacha Ticket ×4 |
| Mihara: Bonding Chain | Obtain her | 5X5 Gacha Ticket ×3 |
| Mihara: Bonding Chain | Skill 1 to Lv. 4 | 5X5 Gacha Ticket ×2 |
| Mihara: Bonding Chain | Skill 1 to Lv. 7 | 5X5 Gacha Ticket ×4 |
| Mihara: Bonding Chain | Skill 2 to Lv. 4 | 5X5 Gacha Ticket ×2 |
| Mihara: Bonding Chain | Skill 2 to Lv. 7 | 5X5 Gacha Ticket ×4 |
| Mihara: Bonding Chain | Burst Skill to Lv. 4 | 5X5 Gacha Ticket ×2 |
| Mihara: Bonding Chain | Burst Skill to Lv. 7 | 5X5 Gacha Ticket ×4 |
| Mihara: Bonding Chain | Bond Lv. 10 | 5X5 Gacha Ticket ×2 |
| Mihara: Bonding Chain | Equip an SR Collection Item | 5X5 Gacha Ticket ×3 |
| Mihara: Bonding Chain | SR Collection Item to Lv. 5 | 5X5 Gacha Ticket ×4 |
| Mihara: Bonding Chain | Overload (modify) a T9 gear | 5X5 Gacha Ticket ×4 |

Each pays tickets (and sometimes more) toward flipping tiles.

### Nayuta & Liberalio

Ticket: 5X5 Gacha Ticket · daily gift: Shifty's Daily Supply

- **Ticket**: 1 5X5 Gacha Ticket per tile
- **Board**: 5 × 5 tiles
- **Daily gift**: Shifty's Daily Supply: 3 tickets a day for logging in
- **Resupply**: After finding the Type A tile, or after flipping 18 tiles
- **Bulk Claim**: Flips up to 2 tiles at once (fewer if you lack tickets or tiles); stops early if it hits Type A
- **Fever**: When the Fever count reaches 10, 18, 25 (1 per tile flipped, reset on resupply), that flip's reward is ×2

#### Board prizes (cycle 1, 2, 3, 4, 5)

| Supply | Tiles | First flip | Reward |
|---|---|---|---|
| [Type A] | 1 | 4% | Custom Module ×2 |
| [Type B] | 1 | 4% | Skill Manual Box ×3 |
| [Type B] | 1 | 4% | Burst Manual Box ×3 |
| [Type C] | 2 | 8% | Skill Manual I ×30 |
| [Type C] | 2 | 8% | Skill Manual II ×20 |
| [Type C] | 2 | 8% | Skill Manual III ×10 |
| [Type C] | 2 | 8% | Burst Manual I ×15 |
| [Type C] | 2 | 8% | Burst Manual II ×10 |
| [Type C] | 2 | 8% | Burst Manual III ×5 |
| [Type C] | 2 | 8% | Code Manual Selection Box ×30 |
| [Type C] | 3 | 12% | Beginner Maintenance Kit ×10 |
| [Type D] | 2 | 8% | Ultra-Double Boost Module ×12 |
| [Type D] | 3 | 12% | Credit ×120,000 |

25 tiles. Each tile is equally likely, so a prize's chance on the next flip is its tiles ÷ the tiles still face down. The first-flip chance is shown.

#### Board prizes (cycle 6+)

| Supply | Tiles | First flip | Reward |
|---|---|---|---|
| [Type A] | 1 | 4% | Custom Module ×2 |
| [Type B] | 1 | 4% | Skill Manual Box ×3 |
| [Type B] | 1 | 4% | Burst Manual Box ×3 |
| [Type C] | 2 | 8% | Skill Manual I ×30 |
| [Type C] | 2 | 8% | Skill Manual II ×20 |
| [Type C] | 2 | 8% | Skill Manual III ×10 |
| [Type C] | 2 | 8% | Burst Manual I ×15 |
| [Type C] | 2 | 8% | Burst Manual II ×10 |
| [Type C] | 2 | 8% | Burst Manual III ×5 |
| [Type C] | 3 | 12% | Beginner Maintenance Kit ×10 |
| [Type D] | 3 | 12% | Ultra-Double Boost Module ×8 |
| [Type D] | 4 | 16% | Credit ×90,000 |

25 tiles. Each tile is equally likely, so a prize's chance on the next flip is its tiles ÷ the tiles still face down. The first-flip chance is shown.

#### Resupply rewards

| Cycle | Reward |
|---|---|
| 1 | Advanced Recruit Voucher ×2 |
| 2 | Advanced Recruit Voucher ×3 |
| 3 | Advanced Recruit Voucher ×5 |
| 4 | T9 Equipment Manufacturer Selection Box ×1 |
| 5 | Collection Item Selection Box ×1 |
| 6+ | Custom Module ×1 |

Taken when you resupply (end a cycle). The last one repeats for every later cycle.

#### Supply missions

| Nikke | Goal | Reward |
|---|---|---|
| Nayuta | Obtain her | 5X5 Gacha Ticket ×3 |
| Nayuta | Skill 1 to Lv. 4 | 5X5 Gacha Ticket ×2 |
| Nayuta | Skill 1 to Lv. 7 | 5X5 Gacha Ticket ×4 |
| Nayuta | Skill 2 to Lv. 4 | 5X5 Gacha Ticket ×2 |
| Nayuta | Skill 2 to Lv. 7 | 5X5 Gacha Ticket ×4 |
| Nayuta | Burst Skill to Lv. 4 | 5X5 Gacha Ticket ×2 |
| Nayuta | Burst Skill to Lv. 7 | 5X5 Gacha Ticket ×4 |
| Nayuta | Bond Lv. 10 | 5X5 Gacha Ticket ×2 |
| Nayuta | Equip an SR Collection Item | 5X5 Gacha Ticket ×3 |
| Nayuta | SR Collection Item to Lv. 5 | 5X5 Gacha Ticket ×4 |
| Nayuta | Overload (modify) a T9 gear | 5X5 Gacha Ticket ×4 |
| Liberalio | Obtain her | 5X5 Gacha Ticket ×3 |
| Liberalio | Skill 1 to Lv. 4 | 5X5 Gacha Ticket ×2 |
| Liberalio | Skill 1 to Lv. 7 | 5X5 Gacha Ticket ×4 |
| Liberalio | Skill 2 to Lv. 4 | 5X5 Gacha Ticket ×2 |
| Liberalio | Skill 2 to Lv. 7 | 5X5 Gacha Ticket ×4 |
| Liberalio | Burst Skill to Lv. 4 | 5X5 Gacha Ticket ×2 |
| Liberalio | Burst Skill to Lv. 7 | 5X5 Gacha Ticket ×4 |
| Liberalio | Bond Lv. 10 | 5X5 Gacha Ticket ×2 |
| Liberalio | Equip an SR Collection Item | 5X5 Gacha Ticket ×3 |
| Liberalio | SR Collection Item to Lv. 5 | 5X5 Gacha Ticket ×4 |
| Liberalio | Overload (modify) a T9 gear | 5X5 Gacha Ticket ×4 |

Each pays tickets (and sometimes more) toward flipping tiles.

### Anis: Star & Neon: Vision Eye

Ticket: Shiny 5x5 Gacha Ticket · daily gift: Anis's Daily Supply

- **Ticket**: 1 Shiny 5x5 Gacha Ticket per tile
- **Board**: 5 × 5 tiles
- **Daily gift**: Anis's Daily Supply: 3 tickets a day for logging in
- **Resupply**: After finding the Type A tile, or after flipping 18 tiles
- **Bulk Claim**: Flips up to 2 tiles at once (fewer if you lack tickets or tiles); stops early if it hits Type A
- **Fever**: When the Fever count reaches 10, 18, 25 (1 per tile flipped, reset on resupply), that flip's reward is ×2

#### Board prizes

| Supply | Tiles | First flip | Reward |
|---|---|---|---|
| [Type A] | 1 | 4% | Custom Module ×2 |
| [Type B] | 1 | 4% | Skill Manual Box ×3 |
| [Type B] | 1 | 4% | Burst Manual Box ×3 |
| [Type C] | 2 | 8% | Skill Manual I ×30 |
| [Type C] | 2 | 8% | Skill Manual II ×20 |
| [Type C] | 2 | 8% | Skill Manual III ×10 |
| [Type C] | 2 | 8% | Burst Manual I ×15 |
| [Type C] | 2 | 8% | Burst Manual II ×10 |
| [Type C] | 2 | 8% | Burst Manual III ×5 |
| [Type C] | 2 | 8% | Code Manual Selection Box ×30 |
| [Type C] | 3 | 12% | Beginner Maintenance Kit ×10 |
| [Type D] | 2 | 8% | Ultra-Double Boost Module ×12 |
| [Type D] | 3 | 12% | Credit ×120,000 |

25 tiles. Each tile is equally likely, so a prize's chance on the next flip is its tiles ÷ the tiles still face down. The first-flip chance is shown.

#### Resupply rewards

| Cycle | Reward |
|---|---|
| 1 | Advanced Recruit Voucher ×2 |
| 2 | Advanced Recruit Voucher ×3 |
| 3 | Advanced Recruit Voucher ×5 |
| 4 | T9 Equipment Manufacturer Selection Box ×1 |
| 5 | Collection Item Selection Box ×1 |
| 6+ | Custom Module ×1 |

Taken when you resupply (end a cycle). The last one repeats for every later cycle.

#### Supply missions

| Nikke | Goal | Reward |
|---|---|---|
| Anis: Star | Obtain her | Shiny 5x5 Gacha Ticket ×3 |
| Anis: Star | Skill 1 to Lv. 4 | Shiny 5x5 Gacha Ticket ×2 |
| Anis: Star | Skill 1 to Lv. 7 | Shiny 5x5 Gacha Ticket ×4 |
| Anis: Star | Skill 2 to Lv. 4 | Shiny 5x5 Gacha Ticket ×2 |
| Anis: Star | Skill 2 to Lv. 7 | Shiny 5x5 Gacha Ticket ×4 |
| Anis: Star | Burst Skill to Lv. 4 | Shiny 5x5 Gacha Ticket ×2 |
| Anis: Star | Burst Skill to Lv. 7 | Shiny 5x5 Gacha Ticket ×4 |
| Anis: Star | Bond Lv. 10 | Shiny 5x5 Gacha Ticket ×2 |
| Anis: Star | Equip an SR Collection Item | Shiny 5x5 Gacha Ticket ×3 |
| Anis: Star | SR Collection Item to Lv. 5 | Shiny 5x5 Gacha Ticket ×4 |
| Anis: Star | Overload (modify) a T9 gear | Shiny 5x5 Gacha Ticket ×4 |
| Neon: Vision Eye | Obtain her | Shiny 5x5 Gacha Ticket ×3 |
| Neon: Vision Eye | Skill 1 to Lv. 4 | Shiny 5x5 Gacha Ticket ×2 |
| Neon: Vision Eye | Skill 1 to Lv. 7 | Shiny 5x5 Gacha Ticket ×4 |
| Neon: Vision Eye | Skill 2 to Lv. 4 | Shiny 5x5 Gacha Ticket ×2 |
| Neon: Vision Eye | Skill 2 to Lv. 7 | Shiny 5x5 Gacha Ticket ×4 |
| Neon: Vision Eye | Burst Skill to Lv. 4 | Shiny 5x5 Gacha Ticket ×2 |
| Neon: Vision Eye | Burst Skill to Lv. 7 | Shiny 5x5 Gacha Ticket ×4 |
| Neon: Vision Eye | Bond Lv. 10 | Shiny 5x5 Gacha Ticket ×2 |
| Neon: Vision Eye | Equip an SR Collection Item | Shiny 5x5 Gacha Ticket ×3 |
| Neon: Vision Eye | SR Collection Item to Lv. 5 | Shiny 5x5 Gacha Ticket ×4 |
| Neon: Vision Eye | Overload (modify) a T9 gear | Shiny 5x5 Gacha Ticket ×4 |

Each pays tickets (and sometimes more) toward flipping tiles.

## In-game help

### 5X5 SUPPLIES

- This is an event where you use tickets to flip tiles or switch the supply board to get rewards.

### Obtain Tickets

- Log in once a day to get a ticket.
- Complete supply missions to get a ticket.

### Supply Board

- Use tickets to select a tile on the supply board and get rewards.
- Resupply rewards are placed according to the number of supply board cycles.
- Identical resupply rewards are placed on the supply board after a certain number of cycles.
- Each reward has a set quantity. Regardless of the reward type, each quantity has an equal probability.

### Resupply Request

- You can request a resupply when you meet the conditions.
- You may request a resupply when you flip the tile and obtain Type A supplies.
- You may request a resupply when there are 18 or more flipped tiles on the supply board.
- When requesting a resupply, you will receive the resupply reward allocated for the current cycle.
- When requesting a resupply, the progress of the supply board tiles will reset, and the number of cycles will increase.

### Fever Mode

- Get 1 Fever Energy each time you flip a tile.
- Fever Mode will be activated when you get a certain amount of Fever Energy.
- Get double the rewards when you flip tiles during Fever Mode.
- Fever Energy will be reset when you request a resupply.

### Bulk Claim Button

- This is a button that allows you to flip multiple tiles at once.
- The number of attempts for bulk claiming is set to the lesser of the number of tickets you own or the number of tile flips available.
- When you obtain Type A supplies from bulk claiming, the bulk claiming will end and tickets will be consumed based on the number of tiles flipped.

## Data sources

All in `D:\Nikke Datamine\mpkparser\jsons` as `<Table>.json`.

| Table | Rows | Fields |
|---|---|---|
| `EventGachaBoardManagerTable` | 3 | `id`, `event_id`, `ticket_item_id`, `ticket_item_count`, `board_group_id`, `board_change_count`, `daily_reward_value`, `mission_group_id`, `multi_receive_count`, `ui_prefab`, `fever_group_id`, `npc_resource_id`, `reward_popup_resource_id`, `reward_popup_locale` |
| `EventGachaBoardMissionTable` | 66 | `id`, `group`, `order`, `mission_condition`, `mission_condition_target`, `mission_condition_value`, `description_localkey`, `reward_id` |
| `EventGachaBoardBoardTable` | 18 | `id`, `group`, `horizontal_slot_value`, `vertical_slot_value`, `number`, `is_repeat`, `slot_reward_group_id`, `reward_id` |
| `EventGachaBoardFeverTable` | 9 | `id`, `group`, `number`, `slot_open_value`, `bonus_value` |
| `EventGachaBoardRewardTable` | 38 | `id`, `group`, `rank`, `slot_count`, `order`, `reward_id` |

## Uncertain / unknown

The viewer flagged nothing as uncertain. Fields it does not show are listed in Data sources; their meaning is not interpreted.
