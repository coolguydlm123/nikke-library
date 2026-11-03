# Dragon Dungeon Run

Guide a hero up a dungeon seven tiles wide, dodging traps, rivers, Raptures and the White Ice Dragon’s breath. Score is the distance you cover plus the gold you pick up.

This guide was generated from the Nikke Library's reading of the game data: the viewer `lib/eventgames/icedragon.js` turns the `Event*` tables in `D:\Nikke Datamine\mpkparser\jsons` into the rules below. Numbers, units and formulas are the viewer's readings; anything it was not sure of is listed under "Uncertain / unknown". Long lists are cut to 30 rows.

- Intro story: "Dragon Dungeon Run!" (`d_contents_dungeon_run_prologue`)
- Art folder: `icons-event/50_icedragonsaga`

## Overview

### A run

- **Intro story**: story "Dragon Dungeon Run!" (`d_contents_dungeon_run_prologue`)
- **Controls**: Tap to step forward, swipe to step in that direction (arrow keys on PC); the skill button (Space) casts your hero’s skill
- **HP**: Every hero starts with 200 HP; a trap or monster takes 100, so 2 hits end the run
- **After a hit**: 1.5 s of invincibility
- **Instant death**: Falling into water
- **Score**: Distance travelled plus gold collected
- **Daily reward**: Score 3,000 in one run: Gem ×30

### Gold

| Pickup | Gold | Chance |
|---|---|---|
| Coin | 1 | 100% / 50% |
| Coin bag | 10 | 100% / 50% / 30% / 10% |
| Gold chest | 30 | 100% / 50% |

Chance is how often a placed coin / bag / chest actually appears. Some chests are Mimics.

### Starting further in

| Start at | From | Available | Unlock | Credited |
|---|---|---|---|---|
| 80 m | Wave 5 | Day 7 | Reach 80 m in a run from the start | +80 m, +30 gold |
| 150 m | Wave 8 | Day 14 | Reach 150 m in a run from the start | +150 m, +60 gold |

Once unlocked, a run can start part-way up the dungeon with the skipped distance and some gold already counted. Skipped runs don’t count towards missions.

### Ranks

| Rank | Score |
|---|---|
| **S** | 15,000 |
| **A** | 10,000 |
| **B** | 7,000 |
| **C** | 5,000 |
| **D** | 3,000 |

## Heroes

Pick one hero per run. They share the same HP; only the skill differs.

| Hero | Skill | Effect | Uses | Cooldown | Lasts | Unlock |
|---|---|---|---|---|---|---|
| Guillotine | **Extermination** | Guillotine swings her sword and clears any surrounding obstacles that can be destroyed. | ∞ | 7 s |  | From the start |
| Volume | **HP Recovery** | Volume drinks the potion and recovers some HP. | 3 | 10 s |  | Move 500 m in total |
| Vesti | **Fire Ball** | Vesti launches fireballs and clears any obstacles that can be destroyed. | ∞ | 5 s |  | Obtain 500 gold in total (Playable from day 7 of the event) |
| Maiden | **Time Freeze** | Maiden freezes time for 3 sec and stops any moving obstacles. | 10 | 10 s | 3 s | Earn 10,000 points in a run after meeting the time condition (Playable from day 14 of the event) |

The Arcade replay uses the same four heroes and skills.

## Traps and monsters

What stands in your way. Damage is out of the hero’s HP.

| Hazard | How it works | Damage |
|---|---|---|
| Wall (box, stone, statue, brazier) | Blocks the way. Some can be broken by Guillotine’s and Vesti’s skills. |  |
| Spike trap | Spikes stay up 1 s, down 1.8 s (0.15 s to switch). | 100 |
| Fireball | Flies across a row. | 100 |
| Boulder trap | Rolls across a row. | 100 |
| Giant saw blade | Sweeps slowly across a row, announced by a warning sign. | 100 |
| Patrolling Rapture | Walks back and forth. Bump into one or step into its alert zone (1.5 or 2.5 tiles) and it starts chasing you. | 100 |
| Mimic (disguised as a chest) | Looks like a gold chest (appears 100% / 50% of the time where placed). Touch it and it chases you after 1 s. | 100 |
| White Ice Dragon’s breath | Breathes ice along a row: 2 s wind-up, then 0.25 s of breath. Knocks you back. | 100 |
| Water | Instant death, whatever your HP. Cross rivers on stepping stones and floating stones (1–3 tiles long). | ∞ |

### Moving hazards

| Hazard | Speed | Interval | Note |
|---|---|---|---|
| Floating stones | 40–75 | 2.5 s–3 s |  |
| Fireballs | 30–60 | 2.5 s–4 s |  |
| Boulders | 30–80 | 3 s–4 s |  |
| Giant saw blades | 6–15 | 3 s–4 s | Warning sign 2 s ahead |
| Patrolling Raptures | 55–120 | 3 s–5 s |  |

Launchers at the side of a row send these across again and again. Speed is in the table’s own units (higher is faster); the interval is the time between two launches.

## The course

The dungeon is built wave by wave from random 10-row blocks; each wave draws its blocks from its own pool.

| Wave | Message | Blocks | Pool | Water rows | Gold / block | Hazards |
|---|---|---|---|---|---|---|
| 1 |  | 3 | 6 | 10% | 4.2 | Boulders, Fireballs, Floating stones, Giant saw blades, Patrolling Raptures, Spike trap |
| 2 |  | 1 | 10 | 11% | 7.3 | Boulders, Fireballs, Floating stones, Giant saw blades, Mimic (disguised as a chest), Patrolling Raptures, Spike trap |
| 3 |  | 3 | 16 | 13% | 7.3 | Boulders, Fireballs, Floating stones, Giant saw blades, Mimic (disguised as a chest), Patrolling Raptures, Spike trap, White Ice Dragon’s breath |
| 4 | Difficulty up (Whew, I think I'm all warmed up now. Time to increase the difficulty!) | 1 | 7 | 9% | 22.4 | Boulders, Fireballs, Floating stones, Mimic (disguised as a chest), Patrolling Raptures, Spike trap |
| 5 |  | 4 | 20 | 12% | 9 | Boulders, Fireballs, Floating stones, Giant saw blades, Mimic (disguised as a chest), Patrolling Raptures, Spike trap, White Ice Dragon’s breath |
| 6 |  | 1 | 9 | 0% | 21.6 | Boulders, Fireballs, Giant saw blades, Mimic (disguised as a chest), Patrolling Raptures, Spike trap, White Ice Dragon’s breath |
| 7 |  | 1 | 4 | 72% | 2.5 | Floating stones, White Ice Dragon’s breath |
| 8 | Difficulty up (It's going to get a bit tougher from now on. Be careful not to get swept away!) | 1 | 20 | 11% | 19.3 | Boulders, Fireballs, Floating stones, Giant saw blades, Mimic (disguised as a chest), Patrolling Raptures, Spike trap, White Ice Dragon’s breath |
| 9 |  | 3 | 20 | 11% | 19.3 | Boulders, Fireballs, Floating stones, Giant saw blades, Mimic (disguised as a chest), Patrolling Raptures, Spike trap, White Ice Dragon’s breath |
| 10 |  | 1 | 4 | 6% | 60.2 | Boulders, Fireballs, Floating stones, Mimic (disguised as a chest), Patrolling Raptures, Spike trap, White Ice Dragon’s breath |
| 11 | Difficulty up (Haha, shall we make it a little harder?) | 4 | 20 | 14% | 25.4 | Boulders, Fireballs, Floating stones, Giant saw blades, Mimic (disguised as a chest), Patrolling Raptures, Spike trap, White Ice Dragon’s breath |
| 12 |  | 1 | 3 | 0% | 33.5 | Mimic (disguised as a chest), Patrolling Raptures, White Ice Dragon’s breath |
| 13 | Difficulty up (Ramp the difficulty up to the highest!) | 4 | 20 | 16% | 31.1 | Boulders, Fireballs, Floating stones, Giant saw blades, Mimic (disguised as a chest), Patrolling Raptures, Spike trap, White Ice Dragon’s breath |
| 14 |  | 1 | 13 | 40% | 16.2 | Boulders, Fireballs, Floating stones, Giant saw blades, Mimic (disguised as a chest), Patrolling Raptures, Spike trap, White Ice Dragon’s breath |
| 15 |  | 1 | 4 | 88% | 0.6 | Floating stones, White Ice Dragon’s breath |
| 16 | Difficulty up (Haha, can you surpass your limits? Prove yourself!) | 4 | 20 | 19% | 37.6 | Boulders, Fireballs, Floating stones, Giant saw blades, Mimic (disguised as a chest), Patrolling Raptures, Spike trap, White Ice Dragon’s breath |
| 17 |  | 2 | 13 | 40% | 16.2 | Boulders, Fireballs, Floating stones, Giant saw blades, Mimic (disguised as a chest), Patrolling Raptures, Spike trap, White Ice Dragon’s breath |
| 18 |  | 14 | 20 | 22% | 32.9 | Boulders, Fireballs, Floating stones, Giant saw blades, Mimic (disguised as a chest), Patrolling Raptures, Spike trap, White Ice Dragon’s breath |
| 19 | Difficulty up (It's truly amazing that you've come this far. The final stage is ahead. / Overcome the coldness of the White Ice Dragon, and conquer the path of suffering!) | Endless | 20 | 23% | 22.9 | Boulders, Fireballs, Floating stones, Giant saw blades, Mimic (disguised as a chest), Patrolling Raptures, Spike trap, White Ice Dragon’s breath |

Blocks = how many blocks the wave lays down. Water and Gold are averages over the wave’s pool, weighted by how often each block is picked (Gold counts only gold that is sure to appear, scaled by its chance). The last wave repeats until the run ends.

## Story and photos

### Story

| Day | Scene |
|---|---|
| 1 | story "Chronicles of the Ark Mage 01" (`d_contents_dungeon_run_01`) |
| 3 | story "Chronicles of the Ark Mage 02" (`d_contents_dungeon_run_02`) |
| 5 | story "Chronicles of the Ark Mage 03" (`d_contents_dungeon_run_03`) |
| 7 | story "Chronicles of the Ark Mage 04" (`d_contents_dungeon_run_04`) |
| 9 | story "Chronicles of the Ark Mage 05" (`d_contents_dungeon_run_05`) |
| 11 | story "Chronicles of the Ark Mage 06" (`d_contents_dungeon_run_06`) |
| 13 | story "Chronicles of the Ark Mage 07" (`d_contents_dungeon_run_07`) |
| 15 | story "Chronicles of the Ark Mage 08" (`d_contents_dungeon_run_08`) |
| 17 | story "Chronicles of the Ark Mage 09" (`d_contents_dungeon_run_09`) |

A new chapter opens every two days of the event.

### Death photos

| Photo | Title | Cause |
|---|---|---|
|  | Gotta catch Guillotine! (Maiden: Patience and focus are power. That is what fishing is. / Guillotine: M-Maiden, stop the nonsense! Hurry and pull me up! / Maiden: Ah! What a catch!) | Died from a fall |
|  | It's dark and scary in here! Save me! (Maiden: U-um... There are usually items in places like this in games, so I... / Vesti: I-I see. / Maiden: Can you get me out of here?) | Died from a Mimic |
|  | We need Eunhwa. (Vesti: ... Um, I miss Eunhwa.) | Died from a giant saw blade |
|  | Art is an explosion. (Guillotine: ... / Vesti: Hehe. It... It exploded...! / Guillotine: ...) | Died from a fireball |
|  | A surge of premonition. (Volume: Hey, can't you just jump to the side? / Guillotine: No way! A hero can only move forward! / Volume: What the...) | Died from a boulder trap |
|  | Blasting off again! (Guillotine: It's this annoying feeling again!  / Maiden: Blasting off again! / Vesti: I-I'm flying...!) | Died from a Rapture |
|  | Trap ahead. (Volume: Hmm... Care to give me a hand? / Maiden: Hold on, let me write this down first. Trap ahead.) | Died from a spike trap |
|  | The most powerful White Ice Dragon lets out a roar. (Maiden: Attempting stop breathing. It's not. It's-it's not... It's not stopping! It's NOT! / Guillotine: WAAAAAAAAAGH!!!) | Died from dragon's breath |

Shown when a run ends to this cause.

### Ending photos

| Photo | Title | Rank |
|---|---|---|
|  | Praise the sun. (Finally reached the end of the dungeon. The sun is shining.) | S |
|  | Get Over It! (I send praises to you, the one who came this far.) | A |
|  | The excellence of Nikkes is the excellence of courage! (Our power is the best in the world!) | B |
|  | Shall we go to the dungeon again? (In hardship and adversity, they grow stronger.) | C |
|  | The cart is insurance. (A cat walking upright might appear soon.) | D |
|  | The battle with despair. (Your resolve is being tested.) | F |

Shown on the result screen for the rank you finish with.

## Missions

### Event missions

Challenges count over all your runs.

| Mission | Reward |
|---|---|
| Challenge - Play as Guillotine 5 times | Burst Manual I ×18 |
| Challenge - Play as Volume 5 times | Burst Manual II ×12 |
| Challenge - Play as Vesti 5 times | Burst Manual III ×6 |
| Challenge - Play as Maiden 5 times | DRAGON DUNGEON RUN Premium Sticker I ×1 |
| Challenge - Move 500 m in total | Elysion Common Console ×30 |
| Challenge - Move 1,000 m in total | Missilis Common Console ×30 |
| Challenge - Move 1,500 m in total | Tetra Common Console ×30 |
| Challenge - Move 2,000 m in total | Pilgrim Common Console ×30 |
| Challenge - Obtain 250 gold in total | Skill Manual I ×36 |
| Challenge - Obtain 750 gold in total | Skill Manual II ×24 |
| Challenge - Obtain 1,250 gold in total | Skill Manual III ×12 |
| Challenge - Obtain 1,750 gold in total | DRAGON DUNGEON RUN Premium Sticker II ×1 |
| Challenge - Use skills 20 times | Defender Common Console ×30 |
| Challenge - Use skills 40 times | Supporter Common Console ×30 |
| Challenge - Use skills 60 times | Attacker Common Console ×30 |
| Challenge - Earn 5,000 points in a run | Ultra Boost Module ×10 |
| Challenge - Earn 10,000 points in a run | Ultra Boost Module ×10 |
| Challenge - Earn 15,000 points in a run | Ultra Boost Module ×10 |

### Arcade missions

The challenges when the game is replayed in Arcade mode.

| Mission | Reward |
|---|---|
| Challenge - Play as Guillotine 5 times | Gem ×20 |
| Challenge - Play as Volume 5 times | Gem ×20 |
| Challenge - Play as Vesti 5 times | Gem ×20 |
| Challenge - Play as Maiden 5 times | DRAGON DUNGEON RUN Premium Sticker I ×1 |
| Challenge - Move 2,500 m in total | Gem ×20 |
| Challenge - Move 5,000 m in total | Gem ×20 |
| Challenge - Move 10,000 m in total | Gem ×20 |
| Challenge - Move 15,000 m in total | Gem ×20 |
| Challenge - Obtain 1,750 gold in total | DRAGON DUNGEON RUN Premium Sticker II ×1 |
| Challenge - Obtain 3,750 gold in total | Gem ×20 |
| Challenge - Obtain 6,250 gold in total | Gem ×20 |
| Challenge - Obtain 8,750 gold in total | Gem ×20 |
| Challenge - Use skills 120 times | Gem ×20 |
| Challenge - Use skills 240 times | Gem ×20 |
| Challenge - Use skills 360 times | Gem ×20 |
| Challenge - Use skills 480 times | Gem ×20 |
| Challenge - Earn 60,000 points in a run | Gem ×20 |

## Data sources

All in `D:\Nikke Datamine\mpkparser\jsons` as `<Table>.json`.

| Table | Rows | Fields |
|---|---|---|
| `EventDragonDungeonRunManagerTable` | 2 | `id`, `event_id`, `enter_scenario`, `minigame_type`, `daily_reward_point`, `daily_reward_id`, `mission_group_id`, `tutorial_id`, `cutscene_group_id`, `scenario_group_id`, `use_character_group_id`, `use_wave_group_id`, `skip_early_phase_01_open_date`, `skip_early_phase_01_open_distance`, `skip_early_phase_01_adjust_distance`, `skip_early_phase_01_adjust_gold`, `skip_early_phase_01_start_wave`, `skip_early_phase_02_open_date`, `skip_early_phase_02_open_distance`, `skip_early_phase_02_adjust_distance`, `skip_early_phase_02_adjust_gold`, `skip_early_phase_02_start_wave`, `character_speed_tile_per_second`, `knock_back_delay_time`, `invincible_time`, `chase_monster_dead_distance`, `dragon_spawn_distance`, `waiting_dragon_breath_object_id`, `dragon_spawn_time`, `preset_pre_warm_time`, `move_mimic_speed_tile_per_second`, `track_monster_dead_time`, `dead_cutscene_print_time`, `dead_cutscene_skip_able_time`, `d_rank_target_point`, `c_rank_target_point`, `b_rank_target_point`, `a_rank_target_point`, `s_rank_target_point` |
| `EventDragonDungeonRunMissionTable` | 35 | `id`, `group_id`, `mission_localkey`, `mission_type`, `mission_target_id`, `mission_count`, `reward_id` |
| `EventDragonDungeonRunCharacterTable` | 8 | `id`, `group_id`, `name_locale`, `outgame_character_resource`, `character_resource`, `skill_name_locale`, `skill_description_locale`, `character_icon`, `skill_icon`, `open_date`, `open_condition`, `open_condition_value`, `open_condition_locale`, `start_hp`, `skill_type`, `skill_use_count`, `skill_fade_in_time`, `skill_duration`, `skill_fade_out_time`, `skill_cooltime`, `skill_fx_resource`, `projectile_resource`, `projectile_speed` |
| `EventDragonDungeonRunCutSceneTable` | 14 | `id`, `group_id`, `cutscene_resource`, `cutscene_name`, `cutscene_description`, `cutscene_print_timing`, `cutscene_print_type`, `is_appear_in_f_rank`, `is_appear_in_d_rank`, `is_appear_in_c_rank`, `is_appear_in_b_rank`, `is_appear_in_a_rank`, `is_appear_in_s_rank` |
| `EventDragonDungeonRunObjectTable` | 33 | `id`, `object_resource`, `object_type`, `object_collider_left_size`, `object_collider_right_size`, `object_collider_up_size`, `object_collider_down_size`, `movestepstone_size`, `spawn_object_id`, `preaction_time`, `dragon_fire_time`, `object_damage`, `knock_back_direction`, `needle_up_time`, `needle_up_to_down_time`, `needle_down_time`, `needle_down_to_up_time`, `guard_range`, `chase_delay_time`, `give_gold_amount`, `appearance_percent` |
| `EventDragonDungeonRunPresetTable` | 1200 | `id`, `group_id`, `raw_order`, `tile_resource`, `fallable_tile`, `tile_o1_use_spawner_group_id`, `tile_01_use_object_id`, `tile_02_use_object_id`, `tile_03_use_object_id`, `tile_04_use_object_id`, `tile_05_use_object_id`, `tile_06_use_object_id`, `tile_07_use_object_id`, `tile_o2_use_spawner_group_id` |
| `EventDragonDungeonRunScenarioTable` | 9 | `id`, `group_id`, `scenario_dialog_group_id`, `scenario_unlock_day` |
| `EventDragonDungeonRunSpawnerTable` | 62 | `id`, `group_id`, `use_object_id_01`, `use_object_id_02`, `object_speed_tile_per_second`, `use_warning_sign`, `warning_sign_time`, `object_repeat_interval_min`, `object_repeat_interval_max` |
| `EventDragonDungeonRunWaveTable` | 19 | `id`, `group_id`, `is_infinity`, `is_repeat`, `repeat_count`, `level_up_locale`, `presetgroupdata` |

The viewer also reads: `MinigameHelpTipDescTable`.

## Uncertain / unknown

The viewer flagged nothing as uncertain. Fields it does not show are listed in Data sources; their meaning is not interpreted.
