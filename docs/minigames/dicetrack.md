# VOLT TRIP

VOLT TRIP is a dice-board event minigame. In this event, you can roll dice to move your marker along the board and claim rewards. You roll a die (Travel Dice; also Selection Dice, 2 free per day) to move around a looping board of 30 squares, collect the reward on the square you land on, and earn lap rewards each time you pass Start.

Source: `lib/minigames.js` (buildDiceTrack) reads the `EventDiceTrack*` tables in `D:\Nikke Datamine\mpkparser\jsons`.

## Squares

The board order comes from `EventDiceTrackBoardTable` (`slot_id` → `next_slot_id`, starting from the `Start` square). Counts: Start 1, Fever 3, GoTo 4, Item 15, Random 7.

| Square | Type | Effect |
|---|---|---|
| Start Square | Start | Earn a reward for completing a lap when you land on or pass this square. Landing on it also grants the reward assigned to the square. |
| Multiplier Square | Fever | Multiplies your next reward by 2. (Excluding lap rewards) |
| Advance Square | GoTo | Advance 2 squares in the direction you're going. |
| Item | Item | gives the reward set on the square |
| Premium Treasure Chest | Random | Grants one type of reward according to set probabilities. There is a chance to get a good reward. |
| Standard Treasure Chest | Random | Grants one type of reward according to set probabilities. |

## Board

| # | Square | Value | Reward |
|---|---|---|---|
| 1 | Start Square |  | Custom Module ×1 |
| 2 | Multiplier Square | 2 |  |
| 3 | Advance Square | 3 |  |
| 4 | Reward |  | Ultra-Double Boost Module ×17 |
| 5 | Reward |  | Code Manual Selection Box ×26 |
| 6 | Premium Treasure Chest |  | random (see odds) |
| 7 | Reward |  | Skill Manual Box ×1 |
| 8 | Reward |  | Beginner Maintenance Kit ×10 |
| 9 | Standard Treasure Chest |  | random (see odds) |
| 10 | Reward |  | Credit ×135,000 |
| 11 | Advance Square | 2 |  |
| 12 | Multiplier Square | 2 |  |
| 13 | Reward |  | Burst Manual Box ×1 |
| 14 | Reward |  | Code Manual Selection Box ×26 |
| 15 | Premium Treasure Chest |  | random (see odds) |
| 16 | Reward |  | Credit ×135,000 |
| 17 | Standard Treasure Chest |  | random (see odds) |
| 18 | Advance Square | 3 |  |
| 19 | Reward |  | Beginner Maintenance Kit ×10 |
| 20 | Reward |  | Ultra-Double Boost Module ×17 |
| 21 | Reward |  | Skill Manual Box ×1 |
| 22 | Multiplier Square | 2 |  |
| 23 | Standard Treasure Chest |  | random (see odds) |
| 24 | Reward |  | Code Manual Selection Box ×26 |
| 25 | Premium Treasure Chest |  | random (see odds) |
| 26 | Advance Square | 2 |  |
| 27 | Reward |  | Credit ×135,000 |
| 28 | Reward |  | Burst Manual Box ×1 |
| 29 | Standard Treasure Chest |  | random (see odds) |
| 30 | Reward |  | Beginner Maintenance Kit ×10 |

## Premium Treasure Chest odds

From `EventDiceTrackRandomRewardTable` (`group_id` = the square's `random_id`, chance = `reward_weight` ÷ total weight).

| Chance | Reward |
|---|---|
| 22% | Custom Module ×1 |
| 16% | Skill Manual Box ×3 |
| 16% | Burst Manual Box ×3 |
| 46% | Beginner Maintenance Kit ×10 |

## Standard Treasure Chest odds

From `EventDiceTrackRandomRewardTable` (`group_id` = the square's `random_id`, chance = `reward_weight` ÷ total weight).

| Chance | Reward |
|---|---|
| 32% | Skill Manual Box ×3 |
| 31% | Burst Manual Box ×3 |
| 10% | Ultra-Double Boost Module ×17 |
| 6% | Code Manual Selection Box ×26 |
| 21% | Credit ×135,000 |

## Lap rewards

From `EventDiceTrackFinishRewardTable` (`clear_times` laps, `is_repeat`).

| Laps | Repeats | Reward |
|---|---|---|
| 1 |  | Advanced Recruit Voucher ×2 |
| 2 |  | Advanced Recruit Voucher ×2 |
| 3 |  | Advanced Recruit Voucher ×3 |
| 4 |  | Advanced Recruit Voucher ×3 |
| 5 |  | T9 Equipment Manufacturer Selection Box ×1 |
| 6 |  | Collection Item Selection Box ×1 |
| 7 | yes | Custom Module ×1 |

## Missions (24)

From `EventDiceTrackMissionTable` (`description_localkey` with `mission_condition_value`, `reward_id`); they mostly give dice.

| Mission | Reward |
|---|---|
| Clear MARIA-n Story I: Normal 1-12 Event 1 times | Travel Dice ×1 |
| Clear MARIA-n Story II: Normal 1-12 Event 1 times | Travel Dice ×1 |
| Obtain {mission_condition_id} | Travel Dice ×3 |
| Upgrade {mission_condition_id}'s Skill 1 to Lv. 4 | Travel Dice ×2 |
| Upgrade {mission_condition_id}'s Skill 1 to Lv. 7 | Travel Dice ×3 |
| Upgrade {mission_condition_id}'s Skill 2 to Lv. 4 | Travel Dice ×2 |
| Upgrade {mission_condition_id}'s Skill 2 to Lv. 7 | Travel Dice ×3 |
| Upgrade {mission_condition_id}'s Burst Skill to Lv. 4 | Travel Dice ×2 |
| Upgrade {mission_condition_id}'s Burst Skill to Lv. 7 | Travel Dice ×3 |
| Reach Bond level 10 with {mission_condition_id} | Travel Dice ×2 |
| Equip an SR Collection Item on {mission_condition_id} | Travel Dice ×2 |
| Upgrade {mission_condition_id}'s SR Collection Item to Lv. 5 | Travel Dice ×2 |
| Modify the T9 equipment that {mission_condition_id} has equipped | Travel Dice ×2 |
| Obtain {mission_condition_id} | Travel Dice ×3 |
| Upgrade {mission_condition_id}'s Skill 1 to Lv. 4 | Travel Dice ×2 |
| Upgrade {mission_condition_id}'s Skill 1 to Lv. 7 | Travel Dice ×3 |
| Upgrade {mission_condition_id}'s Skill 2 to Lv. 4 | Travel Dice ×2 |
| Upgrade {mission_condition_id}'s Skill 2 to Lv. 7 | Travel Dice ×3 |
| Upgrade {mission_condition_id}'s Burst Skill to Lv. 4 | Travel Dice ×2 |
| Upgrade {mission_condition_id}'s Burst Skill to Lv. 7 | Travel Dice ×3 |
| Reach Bond level 10 with {mission_condition_id} | Travel Dice ×2 |
| Equip an SR Collection Item on {mission_condition_id} | Travel Dice ×2 |
| Upgrade {mission_condition_id}'s SR Collection Item to Lv. 5 | Travel Dice ×2 |
| Modify the T9 equipment that {mission_condition_id} has equipped | Travel Dice ×2 |

## Data sources

| Table | Used for |
|---|---|
| `EventDiceTrackManagerTable` | `board_id`, `event_item_id` (dice item), `event_special_item_id`, `daily_reward_value` (dice per day), `mission_group_id` |
| `EventDiceTrackBoardTable` | `group_id` (board), `slot_id`, `next_slot_id`, `event_type`, `function_value` (multiplier / squares to advance), `reward_id`, `random_id` |
| `EventDiceTrackLocaleTable` | square names and effect text (`slot_type`, `slot_value`, `name_localkey`, `description_localkey`) |
| `EventDiceTrackRandomRewardTable` | treasure chest pools (`group_id`, `reward_weight`, `reward_id`) |
| `EventDiceTrackFinishRewardTable` | lap rewards |
| `EventDiceTrackMissionTable` | missions |

## Uncertain / unknown

- What the special dice (Selection Dice) does differently is not described in these tables.
- Die faces/odds are not in the data read here.
- Only the first board in `EventDiceTrackManagerTable` is shown by the site.
