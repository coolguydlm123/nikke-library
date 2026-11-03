# Island Breaker

A block breaker: launch your balls to break the debris rows that drop one row per wave, buy more balls with the Seashells you break loose, and survive as many waves as you can.

This guide was generated from the Nikke Library's reading of the game data: the viewer `lib/eventgames/wavetoyou.js` turns the `Event*` tables in `D:\Nikke Datamine\mpkparser\jsons` into the rules below. Numbers, units and formulas are the viewer's readings; anything it was not sure of is listed under "Uncertain / unknown". Long lists are cut to 30 rows.

- Intro story: "Island Breaker" (`d_contents_islandbreaker_01`)
- Art folder: `icons-event/83_wavetoyou`

## How to play (in-game help)

- **Island Breaker**: ■ Island Breaker is a mini game where you destroy debris washing ashore. ■ Launch and bounce the ball around to destroy debris and Raptures. ■ Find just the right angle to clear as much debris as possible!
- **Gameplay**: ■ Attack blocks to reduce their HP and earn points. ■ Get the ball to bounce as much as possible to earn tons of points! ■ Launching more balls makes it easier to score more points. ■ Each wave causes blocks to drop down one row. ■ The game ends when blocks reach the bottom row. ■ Blocks gain more HP as you progress through waves. ■ Use the Skip Wave button to skip a wave without playing. ■ Skipping waves still causes blocks to drop down and their HP to increase. ■ You cannot skip a wave if blocks are about to reach the bottom row. ■ Normal, elite, and bonus blocks will appear. ■ Blocks are destroyed when their HP reaches 0. ■ Elite blocks have more HP than normal blocks. ■ Bonus blocks grant more seashells when destroyed.
- **Controls**: ■ Drag on the screen to aim the ball. ■ Release to launch the ball in the direction you're aiming. ■ While dragging, you can drag outside the launch area to cancel the launch. ■ Launched balls are automatically retrieved and can be used again in the next wave. ■ The ball will bounce off blocks and walls when it hits them. ■ Launch the ball at the right angle to bounce it more and build higher combos. ■ Finding the best launch angle and maximizing bounces is the key to success. ■ Use the Retrieve Now button to immediately retrieve launched balls. ■ Pressing the button while launching a ball will cancel any remaining ball launches. ■ The next wave will begin once all balls have been retrieved.
- **How to Obtain Balls**: ■ Balls can be purchased either individually or in groups of six. ■ You can use the Buy 6 option to receive a discount. ■ Purchasing balls requires seashells. ■ Balls cannot be purchased while any ball is currently bouncing around. ■ Balls are divided into R, SR, and SSR rarities. ■ Higher-rarity balls offer better performance, but are harder to obtain. ■ SR and SSR balls have special effects. ■ Select a ball's icon to view its details. ■ Destroy debris to obtain seashells as a reward. ■ Seashells can be used to buy additional balls. ■ Any unused seashells will be reset once the stage ends.
- **Nikke Skills**: ■ Each Nikke has a unique skill. ■ This skill is charged whenever a ball hits a block. ■ Once the skill is charged to 100%, it will be used automatically at the start of the next wave. ■ If it gets charged to 200%, it will be used twice in a row. ■ To view details about a skill, select its icon. ■ A Nikke's unique skill will be upgraded as you reach certain waves. ■ Its attack power will increase as its level increases. ■ The amount of charge required to use it will also increase.
- **Traits**: ■ You can earn conch shells by finishing a run of the game. ■ The amount you earn depends on the wave you reach, with 50 being the max amount you can earn at once. ■ There is a limit to the number of conch shells you can earn in a week. ■ If you earn the max amount for three weeks, you'll be able to upgrade all traits. ■ Traits can be upgraded using conch shells. ■ Upgrading them grants different effects. ■ Some traits can only be upgraded after a certain date. ■ Traits can be reset. ■ Resetting traits will not reset your conch shells. ■ If you're trying to improve your score, make sure to upgrade your traits.

## Overview

### A run

- **Intro story**: story "Island Breaker" (`d_contents_islandbreaker_01`)
- **Goal**: Score as many points as possible: damaging blocks scores points, and long bounce chains build combos.
- **Waves**: Each wave a new row of blocks drops in and every block moves down one row. The run ends when a block reaches the bottom row.
- **Your turn**: Drag to aim, release to fire all your balls. They come back on their own (or with Retrieve Now) and the next wave starts. You start with 1 ball and 60 Seashells.
- **Speed-up**: By the manager settings, while balls are in play the game speeds up by ×0.5 every 4 s, up to ×5 (normal speed ×1).
- **Skip Wave**: You can skip a wave without launching; blocks still drop and get tougher. Not allowed when blocks are one row from the bottom.
- **Daily reward**: Play once a day: Gem ×30
- **Endless**: The wave table runs to wave 1,001; past that wave 1,001 repeats (block HP 14,839).
- **Score cap**: 999,999,999

### Currencies

- **Seashell**: Seashell; Used to purchase balls. 10 per block destroyed, 20 per bonus block. Unspent ones are lost when the run ends.
- **Conch Shell**: Conch Shell; Used to acquire traits. Earned at the end of each run, more for reaching later waves (up to 50 a run). Total earning cap: 250, 500 from day 7, 800 from day 14. All traits together cost 800.

### Nikkes

- Cinderella
- Marciana
- Little Mermaid

## Gear

### Balls

Buy balls mid-run with Seashells (not while balls are bouncing). Each purchase rolls a rarity, then a ball of that rarity.

#### Buying

| Option | Balls | Cost | R | SR | SSR |
|---|---|---|---|---|---|
| Buy 1 | 1 | Seashell ×40 | 60% | 30% | 10% |
| Buy 6 | 6 | Seashell ×220 | 60% | 30% | 10% |

#### Balls

|  | Ball | Rarity | ATK | Charge | Special | Chance |
|---|---|---|---|---|---|---|
|  | Basic Ball (Damages the blocks it hits.) | [R] | 1 | 1 | — | 60% |
|  | Flame Ball (Damages the blocks it hits. Hitting a block has a chance to trigger a fire that deals extra damage to both it and the blocks on all four sides. (ATK: 1)) | [SR] | 3 | 3 | 50% per hit (extra ATK 1) | 10% |
|  | Shock Ball (Damages the blocks it hits. Hitting a block has a chance to trigger a shock that deals extra damage to both it and the blocks at each diagonal. (ATK: 1)) | [SR] | 3 | 3 | 50% per hit (extra ATK 1) | 10% |
|  | Bomb Ball (Damages the blocks it hits. Hitting a block has a chance to trigger an explosion that deals extra damage to it. (ATK: 2)) | [SR] | 3 | 3 | 50% per hit (extra ATK 2) | 10% |
|  | Row Ball (Damages the blocks it hits. Hitting a block has a chance to deal extra damage to its entire row. (ATK: 4)) | [SSR] | 5 | 5 | 50% per hit (extra ATK 4) | 3.3% |
|  | Column Ball (Damages the blocks it hits. Hitting a block has a chance to deal extra damage to its entire column. (ATK: 4)) | [SSR] | 5 | 5 | 50% per hit (extra ATK 4) | 3.3% |
|  | Cross Ball (Damages the blocks it hits. Hitting a block has a chance to deal extra damage to both its entire row and its entire column. (ATK: 2)) | [SSR] | 5 | 5 | 50% per hit (extra ATK 2) | 3.3% |

ATK is damage per hit. Charge is how much each hit adds to your Nikke’s skill gauge. Chance assumes balls of the same rarity are equally likely (the table only gives rarity odds).

### Nikkes and skills

Pick one Nikke per run. Her skill fills as balls hit blocks; at 100% it fires at the start of the next wave (twice at 200%).

|  | Nikke | Skill | Available from |
|---|---|---|---|
|  | Cinderella | Glass Slippers Full Contact; Attacks all enemies in the bottom 3 rows. | start |
|  | Marciana | Teacher's Grace; Randomly attacks the enemies in columns 1, 3, and 5 or columns 2, 4, and 6. | event day 7 |
|  | Little Mermaid | Siren's Song; Attacks all enemies in the top 3 rows. | event day 14 |

#### Skill level by wave

| Waves | Skill level | ATK | Charge needed |
|---|---|---|---|
| 1–10 | 1 | 10 | 200 |
| 11–20 | 2 | 25 | 500 |
| 21–30 | 3 | 40 | 840 |
| 31–40 | 4 | 55 | 1,400 |
| 41–50 | 5 | 70 | 2,100 |
| 51–60 | 6 | 85 | 2,940 |
| 61–70 | 7 | 100 | 3,920 |
| 71–80 | 8 | 115 | 5,040 |
| 81–90 | 9 | 130 | 6,300 |
| 91–100 | 10 | 145 | 7,700 |
| 101–110 | 11 | 160 | 9,240 |
| 111–120 | 12 | 175 | 10,920 |
| 121–130 | 13 | 190 | 12,740 |
| 131–140 | 14 | 205 | 14,700 |
| 141–150 | 15 | 220 | 16,800 |
| 151–160 | 16 | 235 | 19,040 |
| 161–170 | 17 | 250 | 21,420 |
| 171–180 | 18 | 265 | 23,940 |
| 181–190 | 19 | 280 | 26,600 |
| 191–200 | 20 | 295 | 29,400 |
| 291–300 | 30 | 445 | 65,100 |
| 391–400 | 40 | 595 | 114,800 |
| 491–500 | 50 | 745 | 173,460 |
| 591–600 | 60 | 895 | 232,260 |
| 691–700 | 70 | 1,045 | 291,060 |
| 791–800 | 80 | 1,195 | 349,860 |
| 891–900 | 90 | 1,345 | 408,660 |
| 991–1000 | 100 | 1,495 | 467,460 |
| 1001+ | 101 | 1,510 | 473,340 |

All three skills share this table. Reaching each new block of waves raises the skill’s ATK and the charge it needs.

## Waves

### Blocks

Normal, elite and bonus blocks. A block’s colour shows how much HP it has left.

| Kind | Looks | Notes |
|---|---|---|
| Normal |  | 10 Seashells when destroyed |
| Elite |  | More HP than normal blocks (value ×2, most likely an HP multiplier); 10 Seashells |
| Bonus |  | A normal or elite block with a bonus mark: 20 Seashells when destroyed |

#### Colour by HP

| Colour | HP |
|---|---|
|  | 1–5 |
|  | 6–15 |
|  | 16–30 |
|  | 31–45 |
|  | 46–60 |
|  | 61–75 |
|  | 76–90 |
|  | 91–105 |
|  | 106–120 |
|  | 121–135 |

From 136 HP the colours start over in the same order, 15 HP per colour (the table runs to 1,185 HP).

### Waves 1–100

Waves 1–100. Each wave adds a row with this many blocks; elite and bonus counts are part of that row.

| Wave | New blocks | Elite | Bonus | Block HP | Nikke skill |
|---|---|---|---|---|---|
| 1 | 2 |  |  | 1 | Lv 1 (ATK 10 · charge 200) |
| 2 | 2 |  |  | 3 | Lv 1 (ATK 10 · charge 200) |
| 3 | 2 |  | 1 | 5 | Lv 1 (ATK 10 · charge 200) |
| 4 | 3 |  |  | 7 | Lv 1 (ATK 10 · charge 200) |
| 5 | 3 | 1 |  | 9 | Lv 1 (ATK 10 · charge 200) |
| 6 | 3 |  | 1 | 11 | Lv 1 (ATK 10 · charge 200) |
| 7 | 3 |  |  | 13 | Lv 1 (ATK 10 · charge 200) |
| 8 | 3 |  |  | 15 | Lv 1 (ATK 10 · charge 200) |
| 9 | 3 |  | 1 | 18 | Lv 1 (ATK 10 · charge 200) |
| 10 | 3 | 1 |  | 21 | Lv 1 (ATK 10 · charge 200) |
| 11 | 3 |  |  | 25 | Lv 2 (ATK 25 · charge 500) |
| 12 | 3 |  |  | 28 | Lv 2 (ATK 25 · charge 500) |
| 13 | 3 |  | 1 | 31 | Lv 2 (ATK 25 · charge 500) |
| 14 | 3 |  |  | 34 | Lv 2 (ATK 25 · charge 500) |
| 15 | 3 | 1 |  | 37 | Lv 2 (ATK 25 · charge 500) |
| 16 | 4 |  | 1 | 41 | Lv 2 (ATK 25 · charge 500) |
| 17 | 4 |  |  | 45 | Lv 2 (ATK 25 · charge 500) |
| 18 | 4 |  |  | 48 | Lv 2 (ATK 25 · charge 500) |
| 19 | 4 |  | 1 | 52 | Lv 2 (ATK 25 · charge 500) |
| 20 | 4 | 1 |  | 57 | Lv 2 (ATK 25 · charge 500) |
| 21 | 4 |  |  | 61 | Lv 3 (ATK 40 · charge 840) |
| 22 | 4 |  |  | 65 | Lv 3 (ATK 40 · charge 840) |
| 23 | 4 |  | 1 | 70 | Lv 3 (ATK 40 · charge 840) |
| 24 | 4 |  |  | 74 | Lv 3 (ATK 40 · charge 840) |
| 25 | 4 | 1 |  | 78 | Lv 3 (ATK 40 · charge 840) |
| 26 | 4 |  | 1 | 83 | Lv 3 (ATK 40 · charge 840) |
| 27 | 4 |  |  | 87 | Lv 3 (ATK 40 · charge 840) |
| 28 | 4 |  |  | 91 | Lv 3 (ATK 40 · charge 840) |
| 29 | 4 |  | 1 | 96 | Lv 3 (ATK 40 · charge 840) |
| 30 | 4 | 1 |  | 101 | Lv 3 (ATK 40 · charge 840) |

(70 more rows of 100 not shown; see the data table.)

### Later waves

Every 10th wave from 110 on.

| Wave | New blocks | Elite | Bonus | Block HP | Nikke skill |
|---|---|---|---|---|---|
| 110 | 5 | 3 |  | 718 | Lv 11 (ATK 160 · charge 9,240) |
| 120 | 5 | 3 |  | 823 | Lv 12 (ATK 175 · charge 10,920) |
| 130 | 5 | 3 |  | 930 | Lv 13 (ATK 190 · charge 12,740) |
| 140 | 5 | 3 |  | 1,040 | Lv 14 (ATK 205 · charge 14,700) |
| 150 | 5 | 3 |  | 1,151 | Lv 15 (ATK 220 · charge 16,800) |
| 160 | 5 | 3 |  | 1,265 | Lv 16 (ATK 235 · charge 19,040) |
| 170 | 5 | 3 |  | 1,380 | Lv 17 (ATK 250 · charge 21,420) |
| 180 | 5 | 3 |  | 1,498 | Lv 18 (ATK 265 · charge 23,940) |
| 190 | 5 | 3 |  | 1,597 | Lv 19 (ATK 280 · charge 26,600) |
| 200 | 5 | 3 |  | 1,718 | Lv 20 (ATK 295 · charge 29,400) |
| 210 | 5 | 4 |  | 1,840 | Lv 21 (ATK 310 · charge 32,340) |
| 220 | 5 | 4 |  | 1,964 | Lv 22 (ATK 325 · charge 35,420) |
| 230 | 5 | 4 |  | 2,090 | Lv 23 (ATK 340 · charge 38,640) |
| 240 | 5 | 4 |  | 2,217 | Lv 24 (ATK 355 · charge 42,000) |
| 250 | 5 | 4 |  | 2,345 | Lv 25 (ATK 370 · charge 45,500) |
| 260 | 5 | 5 |  | 2,475 | Lv 26 (ATK 385 · charge 49,140) |
| 270 | 5 | 5 |  | 2,607 | Lv 27 (ATK 400 · charge 52,920) |
| 280 | 5 | 5 |  | 2,739 | Lv 28 (ATK 415 · charge 56,840) |
| 290 | 5 | 5 |  | 2,873 | Lv 29 (ATK 430 · charge 60,900) |
| 300 | 5 | 5 |  | 3,009 | Lv 30 (ATK 445 · charge 65,100) |
| 310 | 5 | 5 |  | 3,145 | Lv 31 (ATK 460 · charge 69,440) |
| 320 | 5 | 5 |  | 3,283 | Lv 32 (ATK 475 · charge 73,920) |
| 330 | 5 | 5 |  | 3,422 | Lv 33 (ATK 490 · charge 78,540) |
| 340 | 5 | 5 |  | 3,563 | Lv 34 (ATK 505 · charge 83,300) |
| 350 | 5 | 5 |  | 3,704 | Lv 35 (ATK 520 · charge 88,200) |
| 360 | 5 | 5 |  | 3,847 | Lv 36 (ATK 535 · charge 93,240) |
| 370 | 5 | 5 |  | 3,990 | Lv 37 (ATK 550 · charge 98,420) |
| 380 | 5 | 5 |  | 4,135 | Lv 38 (ATK 565 · charge 103,740) |
| 390 | 5 | 5 |  | 4,281 | Lv 39 (ATK 580 · charge 109,200) |
| 400 | 5 | 5 |  | 4,428 | Lv 40 (ATK 595 · charge 114,800) |

(61 more rows of 91 not shown; see the data table.)

## Upgrades

### Traits

Permanent bonuses bought with Conch Shells. Some levels open later in the event. Traits can be reset (the spent shells are not lost).

#### Seashell Reward Boost (Increases the number of seashells obtained when destroying blocks.)

| Level | Effect | Cost (Conch Shells) | Available from |
|---|---|---|---|
| 1 | +10% | 20 | start |
| 2 | +20% | 20 | start |
| 3 | +30% | 20 | start |
| 4 | +40% | 20 | start |
| 5 | +50% | 20 | start |

#### Starting Bonus (Start the game with extra seashells.)

| Level | Effect | Cost (Conch Shells) | Available from |
|---|---|---|---|
| 1 | +30 Seashells | 20 | start |
| 2 | +60 Seashells | 20 | start |
| 3 | +90 Seashells | 20 | start |
| 4 | +120 Seashells | 20 | start |
| 5 | +150 Seashells | 20 | start |
| 6 | +180 Seashells | 20 | event day 7 |
| 7 | +210 Seashells | 20 | event day 7 |
| 8 | +240 Seashells | 20 | event day 7 |
| 9 | +270 Seashells | 20 | event day 7 |
| 10 | +300 Seashells | 20 | event day 7 |
| 11 | +330 Seashells | 20 | event day 14 |
| 12 | +360 Seashells | 20 | event day 14 |
| 13 | +390 Seashells | 20 | event day 14 |
| 14 | +420 Seashells | 20 | event day 14 |
| 15 | +450 Seashells | 20 | event day 14 |
| 16 | +480 Seashells | 20 | event day 14 |
| 17 | +510 Seashells | 20 | event day 14 |
| 18 | +540 Seashells | 20 | event day 14 |
| 19 | +570 Seashells | 20 | event day 14 |
| 20 | +600 Seashells | 20 | event day 14 |

#### Increased Skill Attack Power (Increases the attack power of Nikkes' skills.)

| Level | Effect | Cost (Conch Shells) | Available from |
|---|---|---|---|
| 1 | +10% | 50 | event day 7 |
| 2 | +20% | 50 | event day 14 |

#### Increased Rarity Chance (Increases the chances for SR and SSR balls when purchasing balls.)

| Level | Effect | Cost (Conch Shells) | Available from |
|---|---|---|---|
| 1 | SR +3%, SSR +1% | 20 | event day 7 |
| 2 | SR +6%, SSR +2% | 20 | event day 7 |
| 3 | SR +9%, SSR +3% | 20 | event day 7 |
| 4 | SR +12%, SSR +4% | 20 | event day 7 |
| 5 | SR +15%, SSR +5% | 20 | event day 7 |

#### Extra Chance (Gives you an extra chance when you lose a game.)

| Level | Effect | Cost (Conch Shells) | Available from |
|---|---|---|---|
| 1 | 1 extra chance | 100 | event day 14 |

## Missions

| Mission | Reward |
|---|---|
| Reach wave 30 | Central Government Supply Chest I ×10 |
| Reach wave 50 | Ultra-Double Boost Module ×10 |
| Reach wave 80 | Elysion Common Console ×30 |
| Acquire a total score of 5,000 | Central Government Supply Chest I ×10 |
| Acquire a total score of 35,000 | Ultra-Double Boost Module ×10 |
| Acquire a total score of 140,000 | Missilis Common Console ×30 |
| Acquire a total score of 4,000 with Cinderella | Tetra Common Console ×30 |
| Acquire a total score of 20,000 with Marciana | Skill Manual Box ×5 |
| Acquire a total score of 70,000 with Little Mermaid | ISLAND BREAKER Premium Sticker I ×1 |
| Purchase a total of 50 balls | Pilgrim Common Console ×30 |
| Purchase a total of 100 balls | Burst Manual Box ×5 |
| Purchase a total of 200 balls | ISLAND BREAKER Premium Sticker II ×1 |
| Earn a total of 200 conch shells | Ultra-Double Boost Module ×10 |
| Earn a total of 450 conch shells | Skill Manual Box ×5 |
| Earn a total of 700 conch shells | Burst Manual Box ×5 |

## Album

Illustrations unlocked by reaching a wave with a given Nikke.

| Picture | Scene | Unlock |
|---|---|---|
|  | Glass Slippers, Full Contact (Cinderella: Throw the ball.) | Reach wave 1 with Cinderella |
|  | Beauty Check (Grave: Looking beautiful as always. / Cinderella: Oh my. Thank you, Grave.) | Reach wave 30 with Cinderella |
|  | Standards of Beauty (Marciana: What're you doing? Why only stand that one up? / Cinderella: Doesn't it look more beautiful like this?) | Reach wave 60 with Cinderella |
|  | Cute Penguin (Marciana: D-don't just watch! Help me... / Rapi: You're cute even like this, Penguin. / Cinderella: Hehe, how adorable.) | Reach wave 1 with Marciana |
|  | This One's Mine (Marciana: This one's adorable... It'd be a shame to break it.) | Reach wave 30 with Marciana |
|  | Penguin Squad, Move Out! (Marciana: Time to head out, Penguin Squad! Smash everything! / Tia: Hehehe! You're all so cute! / Naga: Go get 'em, penguins! Hehe.) | Reach wave 60 with Marciana |
|  | You're Not Alone (Little Mermaid: Now you won't be lonely anymore, hehe.) | Reach wave 1 with Little Mermaid |
|  | Visibly Hidden (Little Mermaid: Found you, Mori! / Mori: Wh-what? How?! I thought I was totally hidden. / Little Mermaid: Your hair was sticking out.) | Reach wave 30 with Little Mermaid |
|  | Tia Stuck Between Blocks (Little Mermaid: Ah woo, ah wooah...! / Naga: She's not budging! How'd you even fit in there, Tia?! / Tia: No idea... I just kinda slipped right in, hehehe.) | Reach wave 60 with Little Mermaid |

## Data sources

All in `D:\Nikke Datamine\mpkparser\jsons` as `<Table>.json`.

| Table | Rows | Fields |
|---|---|---|
| `EventIslandBreakerManagerTable` | 1 | `id`, `event_id`, `minigame_type`, `enter_scenario`, `helptip_hub_group`, `default_ball_count`, `summon_currency_id`, `summon_currency_count`, `launch_angle`, `launch_count_default`, `launch_time_default`, `launch_time_delay_divide`, `default_game_speed`, `acceleration_sec`, `acceleration_value`, `acceleration_max`, `daily_reward_id`, `buff_currency_id`, `repeat_wave`, `wave_group`, `summon_group`, `block_group`, `character_group`, `mission_group`, `buff_group`, `image_group`, `max_score`, `combo_ui_change` |
| `EventIslandBreakerMissionTable` | 15 | `id`, `mission_group`, `order`, `condition_type`, `condition_id`, `condition_value`, `name_localkey`, `reward_id` |
| `EventIslandBreakerBallTable` | 7 | `id`, `summon_group`, `order`, `grade`, `name_localkey`, `description_localkey`, `resource_id`, `attack`, `charge_point`, `summon_effect`, `summon_bg_effect`, `ball_skill_type`, `ball_skill_value`, `ball_skill_ratio`, `ball_skill_effect` |
| `EventIslandBreakerBlockTable` | 10 | `id`, `block_group`, `block_type`, `block_value`, `resource_id`, `hit_resource_id`, `hit_remain_time`, `reward_currency_count`, `reward_effect`, `bonus_resource_id`, `bonus_hit_resource_id`, `bonus_currency_count`, `bonus_effect` |
| `EventIslandBreakerBlockColorTable` | 80 | `id`, `block_group`, `hp_min`, `hp_max`, `block_color` |
| `EventIslandBreakerBuffTable` | 38 | `id`, `buff_group`, `order`, `buff_level`, `resource_id`, `name_localkey`, `description_localkey`, `next_level_description_localkey`, `buff_type`, `buff_value_01`, `buff_value_02`, `buff_currency_count`, `open_condition_day` |
| `EventIslandBreakerCharacterTable` | 3 | `id`, `character_group`, `name_localkey`, `character_prefabs`, `effect_skill`, `effect_retry`, `open_condition_day`, `skill_type`, `skill_level_group`, `skill_name_localkey`, `skill_desc_localkey`, `skill_resource_id` |
| `EventIslandBreakerCurrencyTable` | 2 | `id`, `name_localkey`, `description_localkey`, `resource_id`, `currency_type`, `limit_1_max`, `limit_2_day`, `limit_2_max`, `limit_3_day`, `limit_3_max` |
| `EventIslandBreakerImageTable` | 9 | `id`, `image_group`, `order`, `name_localkey`, `description_localkey`, `resource_id`, `condition_wave`, `condition_character` |
| `EventIslandBreakerSkillLevelTable` | 101 | `id`, `skill_level_group`, `wave_min`, `wave_max`, `skill_level`, `attack`, `need_charge_point` |
| `EventIslandBreakerSummonTable` | 2 | `id`, `summon_group`, `order`, `name_localkey`, `summon_count`, `need_summon_currency_count`, `ratio_r`, `ratio_sr`, `ratio_ssr` |
| `EventIslandBreakerWaveTable` | 1001 | `id`, `wave_group`, `wave`, `total_block_count`, `elite_block_count`, `bonus_count`, `block_hp` |

In-game help text: `MinigameHubTable` / `MinigameHelpTipDescTable` (locale keys resolved).

## Uncertain / unknown

- ATK is damage per hit. Charge is how much each hit adds to your Nikke’s skill gauge. Chance assumes balls of the same rarity are equally likely (the table only gives rarity odds).
