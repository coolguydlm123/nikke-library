# Three Company Rumble

Turn your bunny girl left and right to punch away the rival bunny girls closing in from both sides, grab coins and survive as long as you can.

This guide was generated from the Nikke Library's reading of the game data: the viewer `lib/eventgames/coinrushshowdown.js` turns the `Event*` tables in `D:\Nikke Datamine\mpkparser\jsons` into the rules below. Numbers, units and formulas are the viewer's readings; anything it was not sure of is listed under "Uncertain / unknown". Long lists are cut to 30 rows.

- Intro story: "THREE COMPANY RUMBLE" (`d_contents_threecompanyrumble_01`)
- Art folder: `icons-event/87_coinrushshowdown`

## Overview

### A run

- **Controls**: Your Nikke walks and punches on her own. Tap (Space on PC) to turn around; the Ultimate button (Enter) fires her Ultimate Skill.
- **Health**: 2 HP; after being hit you are invincible for 2 s. The run ends at 0 HP.
- **Turning**: Briefly defenceless for 0.1 s after each turn.
- **Levels**: A new level every 10 s with more enemies and, later, hazards. After level 120 play continues from level 118.
- **Daily reward**: Score 4,000 in one run: Gem ×30
- **Intro story**: story "THREE COMPANY RUMBLE" (`d_contents_threecompanyrumble_01`)

### Scoring

- **Enemy knocked out**: 100 points
- **SPIN!**: Knock out an enemy, turn and knock out one on the other side: +50% bonus
- **Combo**: Each knock-out within 1.2 s of the last keeps the combo going; higher combos add a bonus (see Combos)
- **Coins and items**: Coins dropped on the ground give points (see Items)

### Ranks

| Rank | Score |
|---|---|
| **S** | 100,000 |
| **A** | 70,000 |
| **B** | 50,000 |
| **C** | 30,000 |
| **D** | 10,000 |
| **F** | 0 |

### Ultimate Skills

- Guilty
- Sugar
- Sin

## How to play

## Characters

| Nikke | HP | Speed | Range | Ultimate Skill | Available |
|---|---|---|---|---|---|
| **Guilty** | 2 | ★ (300) | ★★★ (100) | Wipes out every enemy on the field with a single blow.; Up to 2 stacks | From the start |
| **Sugar** | 2 | ★★ (360) | ★★ (85) | Black Typhoon brings Sugar a golden four-leaf clover.; Up to 2 stacks | 7 days after the event opens |
| **Sin** | 2 | ★★★ (420) | ★ (70) | Temporarily grants increased movement speed and invincibility. Ignores Milk's and Folkwang's effects.; Lasts 5 s, +50% speed (Up to 2 stacks) | 14 days after the event opens |

Speed and Range are the 1–3 star ratings shown in the selection screen; the in-game values are in brackets.

## Special Skills

Passive bonuses. Every unlocked Special Skill applies at once.

| Skill | Effect | Unlock |
|---|---|---|
| Emergency Drink | Start each game with 1 Ultimate Skill. | From the start, then collect 20 coins of any kind |
| Lucky Combo | Grants a 20% chance to get an extra +1 to your combo when a combo-increasing effect triggers. | 7 days after the event opens, then collect 30 coins of any kind |
| Discovery | An additional item appears on the field every time your combo increases by 30. | 7 days after the event opens, then collect 40 coins of any kind |
| Time Extension | Increases combo duration. (+0.3 s, to 1.5 s) | 14 days after the event opens, then collect 40 coins of any kind |
| Coin Collector | Increases points from items and coins by 20%. | 14 days after the event opens, then collect 50 coins of any kind |

## Combos

| Step | Combo | Bonus |
|---|---|---|
| 1 | 1+ | — |
| 2 | 10+ | +50 |
| 3 | 30+ | +100 |
| 4 | 50+ | +150 |
| 5 | 100+ | +200 |

The combo grows with each knock-out made within 1.2 s of the previous one. The bonus is added to points earned while the combo lasts (most likely a percentage).

## Items

| Item | Effect |
|---|---|
| Coin 1 | 500 points |
| Coin 2 | 1,000 points |
| Coin 3 | 2,000 points |
| Coin 4 | 3,000 points |
| Net | Slows enemies by 25% for 10 s |
| Golden four-leaf clover | 5,000 points, then +50% to all points for 10 s |
| Energy drink | +1 Ultimate stack (max 2); 5,000 points instead when already full |

An item appears on the ground every 2.5 s; it stays for 2 s and flashes for the last 1 s. Energy drinks fall from the sky on some levels (see Levels).

### Ground item mix 1

|  | Chance |
|---|---|
| Coin 1 | 40% |
| Coin 2 | 30% |
| Coin 3 | 20% |
| Coin 4 | 5% |
| Net | 2.5% |
| Golden four-leaf clover | 2.5% |

### Ground item mix 2

|  | Chance |
|---|---|
| Coin 1 | 30% |
| Coin 2 | 40% |
| Coin 3 | 20% |
| Coin 4 | 5% |
| Net | 2.5% |
| Golden four-leaf clover | 2.5% |

### Ground item mix 3

|  | Chance |
|---|---|
| Coin 1 | 30% |
| Coin 2 | 30% |
| Coin 3 | 30% |
| Coin 4 | 5% |
| Net | 2.5% |
| Golden four-leaf clover | 2.5% |

### Ground item mix 4

|  | Chance |
|---|---|
| Coin 1 | 20% |
| Coin 2 | 30% |
| Coin 3 | 40% |
| Coin 4 | 5% |
| Net | 2.5% |
| Golden four-leaf clover | 2.5% |

### Ground item mix 5

|  | Chance |
|---|---|
| Coin 1 | 20% |
| Coin 2 | 30% |
| Coin 3 | 30% |
| Coin 4 | 15% |
| Net | 2.5% |
| Golden four-leaf clover | 2.5% |

### Ground item mix 6

|  | Chance |
|---|---|
| Coin 1 | 20% |
| Coin 2 | 20% |
| Coin 3 | 40% |
| Coin 4 | 15% |
| Net | 2.5% |
| Golden four-leaf clover | 2.5% |

## Enemies

| Enemy | Type | Speed | Behaviour |
|---|---|---|---|
| **Milk** | Counterattack | 240 | Stops in front of you and winds up (1 s) before striking back. |
| **Alice** | Jump | 240 | Leaps 300 units forward over 2 s, so it can land behind you. |
| **Soda** | Zigzag | 280 | Advances for 1.6 s, backs off for 0.8 s, and repeats. |
| **Folkwang** | Knockback | 400 | Fast; its hit knocks you back 300 units over 0.5 s. |
| **Ade** | Drop | 320 | Drops onto the field from above (2 s). |
| **Exia** | Sniper | 200 | Stays back about 500 units and fires after a 3 s charge. |
| **Blanc** | CouplePole | 300 | Arrives as a pair (Blanc and Noir) holding a pole between them. |
| **Noir** | CouplePole | 300 | Arrives as a pair (Blanc and Noir) holding a pole between them. |
| **Bunny girl 1** | Normal | 200 | Walks straight at you. |
| **Bunny girl 2** | Normal | 225 | Walks straight at you. |
| **Bunny girl 3** | Normal | 250 | Walks straight at you. |
| **Bunny girl 4** | Normal | 275 | Walks straight at you. |
| **Bunny girl 5** | Normal | 300 | Walks straight at you. |

Behaviour is read from each enemy type’s timing values. Speed is in game units per second.

### Enemy mix 1

|  | Chance |
|---|---|
| Bunny girl 1 | 28% |
| Bunny girl 2 | 24% |
| Bunny girl 3 | 20% |
| Bunny girl 4 | 16% |
| Bunny girl 5 | 12% |

### Enemy mix 2

|  | Chance |
|---|---|
| Alice | 6.7% |
| Soda | 6.6% |
| Folkwang | 6.7% |
| Bunny girl 1 | 20% |
| Bunny girl 2 | 18% |
| Bunny girl 3 | 16% |
| Bunny girl 4 | 14% |
| Bunny girl 5 | 12% |

### Enemy mix 3

|  | Chance |
|---|---|
| Milk | 5% |
| Alice | 5% |
| Soda | 5% |
| Folkwang | 5% |
| Bunny girl 1 | 20% |
| Bunny girl 2 | 18% |
| Bunny girl 3 | 16% |
| Bunny girl 4 | 14% |
| Bunny girl 5 | 12% |

### Enemy mix 4

|  | Chance |
|---|---|
| Milk | 6% |
| Alice | 6% |
| Soda | 6% |
| Folkwang | 6% |
| Ade | 6% |
| Bunny girl 1 | 18% |
| Bunny girl 2 | 16% |
| Bunny girl 3 | 14% |
| Bunny girl 4 | 12% |
| Bunny girl 5 | 10% |

### Enemy mix 5

|  | Chance |
|---|---|
| Milk | 5% |
| Alice | 5% |
| Soda | 5% |
| Folkwang | 5% |
| Ade | 5% |
| Blanc | 2.5% |
| Noir | 2.5% |
| Bunny girl 1 | 18% |
| Bunny girl 2 | 16% |
| Bunny girl 3 | 14% |
| Bunny girl 4 | 12% |
| Bunny girl 5 | 10% |

### Enemy mix 6

|  | Chance |
|---|---|
| Milk | 4.3% |
| Alice | 4.3% |
| Soda | 4.3% |
| Folkwang | 4.3% |
| Ade | 4.3% |
| Exia | 4.3% |
| Blanc | 2.1% |
| Noir | 2.1% |
| Bunny girl 1 | 18% |
| Bunny girl 2 | 16% |
| Bunny girl 3 | 14% |
| Bunny girl 4 | 12% |
| Bunny girl 5 | 10% |

## Hazards

Each hazard flashes a warning before it hits.

- **Thunder**: Warning 2 s, then strikes; 2 s between strikes
- **Laser**: Warning 2 s, then fires for 3 s
- **Oil slick**: Makes you slide 25 units (0.2 s)

### Hazard mix 1

|  | Chance |
|---|---|
| Thunder: 1 lightning strike(s) | 60% |
| Laser: strength 6,500 (unit unclear) | 40% |

### Hazard mix 2

|  | Chance |
|---|---|
| Oil slick: strength 6,500 (unit unclear) | 15% |
| Thunder: 2 lightning strike(s) | 60% |
| Laser: strength 6,500 (unit unclear) | 25% |

### Hazard mix 3

|  | Chance |
|---|---|
| Oil slick: strength 6,500 (unit unclear) | 30% |
| Thunder: 2 lightning strike(s) | 40% |
| Laser: strength 6,500 (unit unclear) | 30% |

### Hazard mix 4

|  | Chance |
|---|---|
| Oil slick: strength 8,000 (unit unclear) | 30% |
| Thunder: 3 lightning strike(s) | 40% |
| Laser: strength 8,000 (unit unclear) | 30% |

### Hazard mix 5

|  | Chance |
|---|---|
| Oil slick: strength 10,000 (unit unclear) | 33.3% |
| Thunder: 4 lightning strike(s) | 33.3% |
| Laser: strength 10,000 (unit unclear) | 33.3% |

### Hazard mix 6

|  | Chance |
|---|---|
| Oil slick: strength 15,000 (unit unclear) | 33.3% |
| Thunder: 5 lightning strike(s) | 33.3% |
| Laser: strength 15,000 (unit unclear) | 33.3% |

## Levels

Each level lasts 10 s; level n starts at 10 s × (n − 1).

| Levels | Starts at | Enemies per level | Enemy mix | Item mix | Hazards | Energy drink drops |
|---|---|---|---|---|---|---|
| **1** | 0 s | 4 | Mix 1 | Mix 1 |  |  |
| **2–3** | 10 s | 5 | Mix 2 | Mix 1 |  |  |
| **4–5** | 30 s | 5 | Mix 3 | Mix 1 | Level 4: 1 from mix 1 |  |
| **6–7** | 50 s | 6 | Mix 4 | Mix 1 | Level 7: 1 from mix 1 | Level 6 |
| **8–9** | 70 s | 6 | Mix 5 | Mix 1 |  |  |
| **10–15** | 90 s | 7 | Mix 6 | Mix 2 | Level 10: 1 from mix 2; Level 13: 1 from mix 2 | Level 12 |
| **16–21** | 150 s | 8 | Mix 6 | Mix 3 | Level 16: 2 from mix 3; Level 19: 2 from mix 3 | Level 18 |
| **22–27** | 210 s | 9 | Mix 6 | Mix 4 | Level 22: 2 from mix 4; Level 25: 2 from mix 4 | Level 24 |
| **28–33** | 270 s | 10 | Mix 6 | Mix 5 | Level 28: 3 from mix 4; Level 31: 3 from mix 4 |  |
| **34–39** | 330 s | 11 | Mix 6 | Mix 5 | Level 34: 3 from mix 4; Level 37: 3 from mix 4 | Level 36 |
| **40–45** | 390 s | 12 | Mix 6 | Mix 6 | Level 40: 3 from mix 5; Level 43: 3 from mix 5 |  |
| **46–51** | 450 s | 13 | Mix 6 | Mix 6 | Level 46: 3 from mix 5; Level 49: 3 from mix 5 | Level 48 |
| **52–57** | 510 s | 14 | Mix 6 | Mix 6 | Level 52: 3 from mix 5; Level 55: 3 from mix 5 |  |
| **58–63** | 570 s | 15 | Mix 6 | Mix 6 | Level 58: 3 from mix 6; Level 61: 3 from mix 6 |  |
| **64–69** | 630 s | 16 | Mix 6 | Mix 6 | Level 64: 3 from mix 6; Level 67: 3 from mix 6 |  |
| **70–75** | 690 s | 17 | Mix 6 | Mix 6 | Level 70: 3 from mix 6; Level 73: 3 from mix 6 |  |
| **76–81** | 750 s | 18 | Mix 6 | Mix 6 | Level 76: 3 from mix 6; Level 79: 3 from mix 6 |  |
| **82–87** | 810 s | 19 | Mix 6 | Mix 6 | Level 82: 3 from mix 6; Level 85: 3 from mix 6 |  |
| **88–93** | 870 s | 20 | Mix 6 | Mix 6 | Level 88: 3 from mix 6; Level 91: 3 from mix 6 |  |
| **94–99** | 930 s | 21 | Mix 6 | Mix 6 | Level 94: 3 from mix 6; Level 97: 3 from mix 6 |  |
| **100–105** | 990 s | 22 | Mix 6 | Mix 6 | Level 100: 3 from mix 6; Level 103: 3 from mix 6 |  |
| **106–111** | 1050 s | 23 | Mix 6 | Mix 6 | Level 106: 3 from mix 6; Level 109: 3 from mix 6 |  |
| **112–120** | 1110 s | 24 | Mix 6 | Mix 6 | Level 112: 3 from mix 6; Level 115: 3 from mix 6; Level 118: 3 from mix 6 |  |

Enemy, item and hazard mixes are listed on the Enemies, Items and Hazards pages.

## Missions

| Mission | Reward |
|---|---|
| Play as Guilty 5 times | Skill Manual Box ×3 |
| Play as Sugar 5 times | Attacker Common Console ×30 |
| Play as Sin 5 times | THREE COMPANY RUMBLE Premium Sticker II ×1 |
| Use your Ultimate Skill 5 times | Central Government Supply Chest I ×10 |
| Use your Ultimate Skill 10 times | Skill Manual Box ×3 |
| Use your Ultimate Skill 15 times | Burst Manual Box ×3 |
| Defeat 150 enemies | Central Government Supply Chest I ×10 |
| Defeat 500 enemies | Defender Common Console ×30 |
| Defeat 1,000 enemies | THREE COMPANY RUMBLE Premium Sticker I ×1 |
| Earn 100,000 points in total | Ultra-Double Boost Module ×15 |
| Earn 250,000 points in total | Supporter Common Console ×30 |
| Earn 450,000 points in total | Burst Manual Box ×3 |
| Earn 50,000 points in a single game | Skill Manual Box ×4 |
| Earn 90,000 points in a single game | Ultra-Double Boost Module ×15 |
| Earn 140,000 points in a single game | Burst Manual Box ×4 |

## Album

End-of-run cartoons, collected by finishing a run with the given Nikke and rank.

| Cartoon | Caption | Nikke | Rank |
|---|---|---|---|
|  | Is this what they call... a K.O.? | Guilty | F |
|  | I didn't even hit them yet... and off they flew... | Guilty | B |
|  | One hit and it was over... | Guilty | S |
|  | Whoops, did I send them flying a little too far? | Sugar | F |
|  | Whoa there, Black Typhoon. Settle down. | Sugar | B |
|  | You've never getting behind me if you can't take me down. | Sugar | S |
|  | Think you can block this one too? | Sin | F |
|  | I'd be careful if I were you, unless you wanna get burned. | Sin | B |
|  | Hmm, everyone's just too slow. | Sin | S |

## Data sources

All in `D:\Nikke Datamine\mpkparser\jsons` as `<Table>.json`.

| Table | Rows | Fields |
|---|---|---|
| `EventPunchManagerTable` | 1 | `id`, `event_id`, `enter_scenario`, `daily_reward_score`, `daily_reward_id`, `character_group_id`, `monster_group_id`, `skill_group_id`, `mission_group_id`, `cutscene_group_id`, `item_group_id`, `level_group_id`, `combo_group_id`, `tutorial_id`, `corner_penalty_time`, `ground_item_spawn_interval`, `item_retention_time`, `before_vanish_item_flashing_time`, `air_item_drop_time`, `air_mirrorball_drop_time`, `thunder_attack_down_time`, `thunder_attack_casting_time`, `thunder_attack_interval`, `laser_attack_up_time`, `laser_attack_casting_time`, `oil_slide_distance`, `oil_slide_time`, `enemy_kill_score`, `spin_attack_bonus_ratio`, `combo_time`, `invincible_time`, `monster_invincible_time`, `d_rank_target_score`, `c_rank_target_score`, `b_rank_target_score`, `a_rank_target_score`, `s_rank_target_score`, `endpoint_loop_level` |
| `EventPunchMissionTable` | 15 | `id`, `group_id`, `mission_localkey`, `mission_type`, `mission_target`, `mission_value`, `reward_id` |
| `EventPunchCharacterTable` | 3 | `id`, `group_id`, `name_localkey`, `order`, `resource_id`, `character_collider_x`, `character_collider_y`, `max_hp`, `delay_time_after_turn`, `move_speed_info`, `move_speed_ingame`, `attack_collider_info`, `attack_collider_x_ingame`, `attack_collider_y_ingame`, `max_ultimate_skill`, `ultimate_skill_type`, `ultimate_skill_target`, `ultimate_skill_value`, `ultimate_skill_time`, `ultimate_skill_resource_id`, `ultimate_skill_desc_localkey`, `unlock_time` |
| `EventPunchComboTable` | 5 | `id`, `group_id`, `step`, `need_combo`, `combo_score_bonus`, `combo_resource_id` |
| `EventPunchCutSceneTable` | 9 | `id`, `group_id`, `cutscene_resource`, `cutscene_description`, `condition_character`, `condition_rank` |
| `EventPunchItemTable` | 7 | `id`, `group_id`, `item_type`, `resource_id`, `score_value`, `duration_time`, `function_rate` |
| `EventPunchItemSpawnTable` | 37 | `id`, `group_id`, `item_id`, `rate` |
| `EventPunchLevelTable` | 120 | `id`, `group_id`, `level`, `play_time`, `monster_spawn_count`, `monster_spawn_interval`, `monster_spawn_group`, `ground_item_spawn_group`, `air_item_spawn_group`, `penalty_group`, `penalty_count` |
| `EventPunchMonsterTable` | 13 | `id`, `group_id`, `type`, `resource_id`, `sub_resource_id`, `monster_speed`, `monster_collider_x`, `monster_collider_y`, `counter_move_time`, `counter_casting_time`, `counter_attack_time`, `jump_move_distance_x`, `jump_move_distance_y`, `jump_move_time`, `zigzag_forward_time`, `zigzag_reverse_time`, `knockback_distance_x`, `knockback_distance_y`, `knockback_time`, `drop_time`, `sniper_move_distance`, `sniper_charge_time`, `pole_drop_time` |
| `EventPunchMonsterSpawnTable` | 57 | `id`, `group_id`, `monster_id`, `rate` |
| `EventPunchPenaltyActiveTable` | 17 | `id`, `group_id`, `penalty_type`, `penalty_value`, `rate` |
| `EventPunchSkillTable` | 5 | `id`, `group_id`, `skill_type`, `skill_value`, `order`, `name_localkey`, `description_localkey`, `resource_id`, `unlock_time`, `unlock_getscore_item_count` |

The viewer also reads: `MinigameHelpTipDescTable`.

## Uncertain / unknown

- strength … (unit unclear)
