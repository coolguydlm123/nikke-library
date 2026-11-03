# Boom the Ghost

A drop-and-merge puzzle: shoot ghosts into the Dust Box, and when two ghosts of the same level touch they merge into a bigger one for points. Don’t let the box overflow.

This guide was generated from the Nikke Library's reading of the game data: the viewer `lib/eventgames/boomtheghost.js` turns the `Event*` tables in `D:\Nikke Datamine\mpkparser\jsons` into the rules below. Numbers, units and formulas are the viewer's readings; anything it was not sure of is listed under "Uncertain / unknown". Long lists are cut to 30 rows.

- Intro story: "BFG! CLEAN UP!" (`d_contents_bfgcleanup_01`)
- Art folder: `icons-event/64_boomtheghost`

## Overview

### A run

- **Intro story**: story "BFG! CLEAN UP!" (`d_contents_bfgcleanup_01`)
- **Controls**: Move the ghost-catching device left and right (swipe, or A / D) and release (or Space) to shoot the loaded ghost
- **Merging**: Two ghosts of the same level that touch become one ghost of the next level and score points. Two level-10 ghosts vanish and score 500.
- **Game over**: When ghosts stay piled over the top of the box for 3 s
- **Shot cooldown**: 1 s between shots
- **Score cap**: 1,000,000 points per run
- **Daily reward**: Score 1,000 in one run: Gem ×30

### Skills

| Skill | Effect | Uses per run |
|---|---|---|
| **Shake** | Shakes the box to reposition the ghosts | 2 |
| **Fill** | Fills the box with water to reposition the ghosts | 2 |

Both skills move the ghosts around so that matching ones can meet.

### Grades

| Grade | Score |
|---|---|
| S | 10,000 |
| A | 7,500 |
| B | 5,000 |
| C | 2,500 |
| F | 0 |

The grade for one run’s score; below C is F.

## Ghosts

The ghost ladder: each merge turns two ghosts into the next level.

### Ghost levels

| Ghost | Merges into | Points | Size |
|---|---|---|---|
| **Level 1 ghost** | Level 2 ghost | 50 | 50 |
| **Level 2 ghost** | Level 3 ghost | 100 | 65 |
| **Level 3 ghost** | Level 4 ghost | 150 | 80 |
| **Level 4 ghost** | Level 5 ghost | 200 | 95 |
| **Level 5 ghost** | Level 6 ghost | 250 | 110 |
| **Level 6 ghost** | Level 7 ghost | 300 | 125 |
| **Level 7 ghost** | Level 8 ghost | 350 | 140 |
| **Level 8 ghost** | Level 9 ghost | 400 | 155 |
| **Level 9 ghost** | Level 10 ghost | 450 | 170 |
| **Level 10 ghost** | Vanishes | 500 | 185 |

Points are scored when two ghosts of that level merge. Size is in the game’s own units.

### What the device loads

| Score in the run | Ghosts loaded |
|---|---|
| 0 | Levels 1–2 |
| 500 | Levels 1–3 |
| 3,000 | Levels 1–4 |
| 8,000 | Levels 1–5 |
| 12,000 | Levels 1–6 |

The device loads random low-level ghosts. Scoring more in a run adds bigger ghosts to the mix.

## Dust Boxes and backgrounds

Bigger Dust Boxes unlock as your score adds up over all runs; each box also unlocks a background.

### Dust Boxes

| Box | Name | Total score |
|---|---|---|
|  | Dust Box S (A tiny dust box. / The ghosts are packed like sardines inside.) | 0 |
|  | Dust Box M (A larger dust box. / Now the ghosts can finally escape their cramped house.) | 40,000 |
|  | Dust Box L (An even bigger dust box. / It's extra-large. / The ghosts' dream of a spacious home has finally come true.) | 80,000 |

### Backgrounds

| Background | Name | Unlocked with |
|---|---|---|
|  | Boom and Shock (Spend a thrilling BOOM-filled summer with her!) | Dust Box S |
|  | Red Flavor (The fiery passion of midsummer.) | Dust Box M |
|  | Serendipity (Perhaps an unexpected encounter awaits this summer?) | Dust Box L |

## Endings

Cartoon endings collected by playing; the table doesn’t say what triggers each one.

| Ending | Title |
|---|---|
|  | ENDING: Doors Should Be Smashed With an Ax (Elegg is here!) |
|  | ENDING: The Clown Is Always Smiling (Wanna play with me?) |
|  | ENDING: The Horror Under the Covers (Because of this, I'm too scared to pull the covers over my head...) |
|  | ENDING: Monsters of Silent Hill (I can't wait for the next game to be released!) |
|  | ENDING: Scream and Shout! (Hello, ghost?) |
|  | ENDING: Body Burster! (Ghost! Get away from me!) |
|  | ENDING: It's Freezing in the Well (I heard people nowadays don't know what a videotape is.) |

## Missions

### Event missions

Missions count over all your runs.

| # | Mission | Reward |
|---|---|---|
| 1 | Total score of 10,000 points reached. | Skill Manual I ×180 |
| 2 | Total score of 30,000 points reached. | Skill Manual II ×120 |
| 3 | Total score of 50,000 points reached. | Skill Manual III ×60 |
| 4 | Total score of 70,000 points reached. | BFG CLEAN UP! Premium Sticker I ×1 |
| 5 | Total score of 100,000 points reached. | Burst Manual I ×90 |
| 6 | Total score of 130,000 points reached. | Burst Manual II ×60 |
| 7 | Total score of 160,000 points reached. | Burst Manual III ×30 |
| 8 | Total score of 200,000 points reached. | BFG CLEAN UP! Premium Sticker II ×1 |
| 9 | Use Shake a total of 5 time(s) | Elysion Common Console ×30 |
| 10 | Use Shake a total of 10 time(s) | Missilis Common Console ×30 |
| 11 | Use Shake a total of 15 time(s) | Central Government Supply Chest I ×10 |
| 12 | Use Shake a total of 20 time(s) | Ultra-Double Boost Module ×15 |
| 13 | Use Fill a total of 5 time(s) | Central Government Supply Chest I ×10 |
| 14 | Use Fill a total of 10 time(s) | Ultra-Double Boost Module ×15 |
| 15 | Use Fill a total of 15 time(s) | Tetra Common Console ×30 |
| 16 | Use Fill a total of 20 time(s) | Pilgrim Common Console ×30 |

### Arcade missions

The missions when the game is replayed in Arcade mode.

| # | Mission | Reward |
|---|---|---|
| 1 | Total score of 150,000 points reached. | Gem ×20 |
| 2 | Total score of 225,000 points reached. | Gem ×20 |
| 3 | Total score of 300,000 points reached. | Gem ×20 |
| 4 | Total score of 375,000 points reached. | BFG CLEAN UP! Premium Sticker I ×1 |
| 5 | Total score of 450,000 points reached. | Gem ×20 |
| 6 | Total score of 525,000 points reached. | Gem ×20 |
| 7 | Total score of 600,000 points reached. | Gem ×20 |
| 8 | Total score of 675,000 points reached. | Gem ×20 |
| 9 | Total score of 750,000 points reached. | BFG CLEAN UP! Premium Sticker II ×1 |
| 10 | Use Shake a total of 25 time(s) | Gem ×20 |
| 11 | Use Shake a total of 50 time(s) | Gem ×20 |
| 12 | Use Shake a total of 75 time(s) | Gem ×20 |
| 13 | Use Shake a total of 100 time(s) | Gem ×20 |
| 14 | Use Fill a total of 25 time(s) | Gem ×20 |
| 15 | Use Fill a total of 50 time(s) | Gem ×20 |
| 16 | Use Fill a total of 75 time(s) | Gem ×20 |
| 17 | Use Fill a total of 100 time(s) | Gem ×20 |

## Data sources

All in `D:\Nikke Datamine\mpkparser\jsons` as `<Table>.json`.

| Table | Rows | Fields |
|---|---|---|
| `EventBTGManagerTable` | 2 | `id`, `event_id`, `minigame_type`, `enter_scenario`, `daily_reward_point`, `daily_reward_id`, `tutorial_id`, `c_grade_min`, `b_grade_min`, `a_grade_min`, `s_grade_min`, `btg_score_limit_per_game`, `ui_prefab` |
| `EventBTGMissionTable` | 33 | `id`, `manager_id`, `condition_type`, `condition_id`, `condition_value`, `name_localkey`, `order`, `reward_id` |
| `EventBTGBgTable` | 6 | `id`, `manager_id`, `order`, `bg_condition_map_id`, `bg_mi_resource_id`, `bg_resource_id`, `bg_name_localkey`, `bg_description_localkey` |
| `EventBTGConfigTable` | 11 | `id`, `value` |
| `EventBTGCutSceneTable` | 14 | `id`, `manager_id`, `order`, `cutscene_resource_id`, `cutscene_name_localkey`, `cutscene_description_localkey` |
| `EventBTGMapTable` | 6 | `id`, `manager_id`, `condition_value`, `order`, `name_localkey`, `description_localkey`, `resource_id`, `si_resource_id`, `size` |
| `EventBTGMuzzleSetTable` | 10 | `id`, `manager_id`, `set_score`, `object_id_list` |
| `EventBTGObjectInfoTable` | 20 | `id`, `manager_id`, `change_to`, `merge_point`, `size`, `weight_level`, `skill_b_target_level`, `resource_id`, `bounciness`, `is_stratched` |
| `EventBTGSkillTable` | 4 | `id`, `manager_id`, `skill_type`, `skill_use_value` |

The viewer also reads: `MinigameHelpTipDescTable`.

## Uncertain / unknown

The viewer flagged nothing as uncertain. Fields it does not show are listed in Data sources; their meaning is not interpreted.
