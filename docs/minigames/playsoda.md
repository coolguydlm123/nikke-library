# Let's Play Soda

"Let's Play, Soda!" is the minigame hub of the **Golden Coin Rush** event (event id 81301). It is an arcade of five short sub-games starring Soda: **Run, Soda!** (hurdle runner), **Smash, Soda!** (whack-a-mole), **Catch the Coin, Soda!** (catch falling coins, dodge eggs), **Stack Up, Soda!** (stack gold bars) and **Climb, Soda!** (dodge obstacles on two ropes). Each sub-game first appears as an "EX" story stage on the event's story map; clearing its goal unlocks a **challenge mode** where you replay it for score. Challenge scores are added up over all runs and pay out a per-game reward track.

## How the hub works

| Topic | Rule |
|---|---|
| Story mode | Each sub-game is one EX stage on the Golden Coin Rush story map. Clearing a normal event stage unlocks it; reach its goal to clear it. A story scene plays before (`_s`) and after (`_e`). |
| Challenge mode | Unlocks when that game's EX stage is cleared. Replay for score; every run's score adds to that game's total. |
| Lives (HP) | Every sub-game gives Soda **2 lives**. |
| Pause | Resuming after a pause gives a **3 s** countdown (`ingame_pause_second` = 3). |
| Daily reward | Gem ×30 (`daily_reward_id` 8132045). |
| Modes (ManagerTable) | `Normal` (during the event: story + challenge + reward track 1000), `Archive` (story only, no rewards; presumably the event-archive replay), `Arcade` (challenge only, with a separate reward track 2000). |

### Story stages

| Stage | Game | Unlocked by clearing | Clear reward | Story scenes |
|---|---|---|---|---|
| EX-1 EVENT | Run, Soda! | 1-5 (event part 1) | Central Government Supply Chest I ×2 | Soda the Runner A / B |
| EX-2 EVENT | Smash, Soda! | 1-10 (event part 1) | Central Government Supply Chest I ×2 | Smash, Soda! A / B |
| EX-3 EVENT | Catch the Coin, Soda! | 1-1 (event part 2) | Central Government Supply Chest I ×2 | Coin-Catching Soda A / B |
| EX-4 EVENT | Stack Up, Soda! | 1-5 (event part 2) | Central Government Supply Chest I ×2 | Stack Up, Soda! A / B |
| EX-5 EVENT | Climb, Soda! | 1-10 (event part 2) | Central Government Supply Chest I ×2 | Soda the Climber A / B |

Challenge mode of each game opens on clearing the matching EX stage.

Units: Running, Climbing and StackUp tables store decimals as raw **float32 bit patterns** (e.g. 1086324736 = 6.0). CatchCoin and Smash store times/rates as integers read as **1/10,000** (e.g. `spawn_tick` 19191 = 1.92 s). The 1/10,000 reading is the viewer's interpretation; the tables do not state units. Distances are in unspecified in-game units.

---

## 1. Run, Soda! (Running)

**Rules (in-game help):** obstacle course. Tap the screen (shortcut Space) to make Soda jump. Bumping into an obstacle lowers HP. Story: survive until the target time. Challenge: highest score.

| Parameter | Value |
|---|---|
| Story goal | Survive **20 s** (`clear_time_second`) |
| Lives | 2; after a hit, **2 s** of invulnerability (`hit_immune_time_ms` 2000) |
| Base points | `default_obtain_point` 210 (the table does not say what earns these points — per hurdle, per second, etc. is unknown) |
| Hurdle speed | 6.0 × the step's speed multiplier |
| Jump power / gravity | `jump_y_power` 1.85, `gravity_value` 40.0 (physics constants, game units) |
| Difficulty step | rises every **5 s** (`auto_increase_difficulty_second`) |

Hurdle types: 1×1, 2×1, 3×1, 1×2 (sizes from the resource names; presumably width×height).

| Step | From | Speed | Gap between hurdles | Hurdle mix |
|---|---|---|---|---|
| 1 | 0 s | ×1.00 | 7–12 | 1×1 66.7%, 2×1 33.3% |
| 2 | 5 s | ×1.06 | 7–12 | same |
| 3 | 10 s | ×1.12 | 6–10 | 1×1, 2×1, 1×2 at 33.3% each |
| 4 | 15 s | ×1.18 | 6–10 | same |
| 5 | 20 s | ×1.24 | 5–9 | 2×1, 3×1, 1×2 at 33.3% each |
| 6 | 25 s | ×1.30 | 5–9 | same |
| 7 | 30 s | ×1.36 | 4–8 | 2×1 25%, 3×1 50%, 1×2 25% |
| 8 | 35 s | ×1.42 | 4–8 | same |
| 9 | 40 s+ | ×1.48 | 4–8 | same |

After step 9 the speed keeps rising by **+0.06 every 5 s** (`auto_increase_play_speed` on the last step).

## 2. Smash, Soda! (Smash)

**Rules (help):** use the hammer to hit the Nikkes that pop up for points. Mustang appears occasionally; hitting him lowers HP. Story: reach target score. Challenge: highest score.

| Parameter | Value |
|---|---|
| Story goal | **30,000 points** |
| Challenge cap | 999,999 points (`point_limit`) |
| Board | **9 holes** (`spawn_slot_count`) |
| Lives | 2; hitting Mustang costs one |
| Points | **750** per hit on a target, the same whether she is appearing, idle or leaving (`appear_hit_point` / `idle_hit_point` / `exit_hit_point` all 750); **1,500** for letting Mustang go by un-hit (`none_target_pass_point`) |

Characters: Milk, Sugar, Mary = **Target** (hit them); Mustang = **NoneTarget** (leave alone).

Difficulty: a new level every 5 s, 40 levels (lv 40 from 195 s onward). "Next after" = `spawn_delay_time` (pause before another pops up), "Stays" = `character_wait_time` (how long one waits before ducking), both read as 1/10,000 s. Mustang % = his share of the spawn weights.

| Level | From | Max up at once | Next after | Stays | Mustang |
|---|---|---|---|---|---|
| 1 | 0 s | 4 | 0.63 s | 1.60 s | 0% |
| 2 | 5 s | 5 | 0.57 s | 1.44 s | 0% |
| 3 | 10 s | 6 | 0.52 s | 1.31 s | 10% |
| 5 | 20 s | 7 | 0.45 s | 1.12 s | 18.2% |
| 8 | 35 s | 9 | 0.37 s | 0.92 s | 25% |
| 10 | 45 s | 9 | 0.33 s | 0.82 s | 30.8% |
| 13 | 60 s | 9 | 0.28 s | 0.69 s | 40% |
| 15 | 70 s | 9 | 0.26 s | 0.62 s | 43.8% |
| 19 | 90 s | 9 | 0.21 s | 0.50 s | 50% (stays 50% to the end) |
| 25 | 120 s | 9 | 0.16 s | 0.36 s | 50% |
| 30 | 145 s | 9 | 0.12 s | 0.26 s | 50% |
| 35 | 170 s | 9 | 0.09 s | 0.18 s | 50% |
| 40 | 195 s | 9 | 0.06 s | 0.11 s | 50% |

Max-up-at-once: 4, 5, 6, 7, 7, 8, 8, then 9 from level 8. Story uses difficulty group 101, challenge group 201 (separate rows).

## 3. Catch the Coin, Soda! (CatchCoin)

**Rules (help):** collect falling gold coins. Tap the two sides of the screen to move Soda (keys A, D); tap the same spot twice to sprint. Eggs that hit Soda lower HP. Story: reach target score. Challenge: highest score.

| Parameter | Value |
|---|---|
| Story goal | **30,000 points** |
| Challenge cap | 999,999 points |
| Lives | 2; each egg that hits Soda costs 1 life |
| Soda movement | walk speed 2.5, dash covers 1.75 units at speed 6.0 (`move_speed` 25000, `dash_range` 17500, `dash_speed` 60000, ÷10,000) |

| Falling object | Effect | Spawn weight |
|---|---|---|
| Egg | −1 life | 14 at level 1, rising to 48 by the end |
| Bronze coin | +450 points | 30 |
| Silver coin | +900 points | 30 |
| Gold coin | +2,700 points | 30 |

Each of the 4 objects exists in 9 variants with base fall speed 12000–18000 in steps of 750 (1.2–1.8 if read ÷10,000); all variants are equally weighted, so fall speed is randomised per object. That speed is then multiplied by the level's fall-speed multiplier.

Difficulty: new level every 5 s, 40 levels. Spawn every = `spawn_tick` ÷10,000 s.

| Level | From | Spawn every | Objects per spawn | Egg share | Fall speed |
|---|---|---|---|---|---|
| 1 | 0 s | 1.92 s | 2–4 | 13.5% | ×2.00 |
| 4 | 15 s | 1.47 s | 3–5 | 20.4% | ×3.27 |
| 7 | 30 s | 1.20 s | 4–6 | 23.7% | ×4.01 |
| 10 | 45 s | 1.02 s | 5–7 | 26.2% | ×4.53 |
| 13 | 60 s | 0.87 s | 6–8 | 28.0% | ×4.94 |
| 15 | 70 s | 0.79 s | 7–9 | 28.6% | ×5.17 |
| 17 | 80 s | 0.72 s | 8–10 | 29.7% | ×5.37 |
| 19 | 90 s | 0.65 s | 9–11 | 30.2% | ×5.55 |
| 25 | 120 s | 0.49 s | 9–11 | 31.8% | ×6.01 |
| 30 | 145 s | 0.38 s | 9–11 | 33.3% | ×6.32 |
| 40 | 195 s | 0.20 s | 9–11 | 34.8% | ×6.82 |

Story (group 101) and challenge (group 201) have their own difficulty tables with identical values.

## 4. Stack Up, Soda! (StackUp)

**Rules (help):** Soda moves left and right carrying a gold bar; tap (Space) to place it. The game ends if the bar you are holding touches the opposite wall, or if the bar you place does not overlap the bars already stacked. Story: reach the target floor. Challenge: highest score.

| Parameter | Value |
|---|---|
| Story goal | Reach **floor 10** (`clear_number_floors`) |
| Lives | none listed — the game ends on the first failure |
| Points | **2,400** per bar stacked (`default_obtain_point`) |
| Perfect drop | landing within **0.1 units** (`perfect_action_length`) pays **×1.2** points (`perfect_action_point_rate`) |
| Bar length | starts at 6.0 units (`object_default_length`); whether the overhang is trimmed is not stated in the data |
| Soda speed | 3.2 (`character_default_speed`) × 1.2 (`difficulty_play_speed`), +0.15 every **3 floors** (`auto_increase_difficulty_floor`) |
| Other | `object_spawn_distance` 5.0, `camera_default_speed` 2.0 (meaning not shown by the viewer) |

## 5. Climb, Soda! (Climbing)

**Rules (help):** dodge obstacles while climbing ropes. Tap the left side (A) to jump to the left rope, the right side (D) for the right rope. Bumping into obstacles lowers HP. Story: survive until target time. Challenge: highest score.

| Parameter | Value |
|---|---|
| Story goal | Survive **20 s** |
| Lives | 2; **2 s** invulnerability after a hit |
| Jump | **0.2 s** rope-to-rope (`jump_motion_length_ms` 200); `jump_height` 0.7 |
| Base points | 160 (`default_obtain_point`; what earns them is not stated) |
| Obstacle speed | 6.0 × step multiplier; first obstacle appears 20 units in |
| Difficulty step | every 5 s |

Pattern weights are the table's `spawn_line_1_ratio` and `spawn_line_2_ratio` (`spawn_line_0_ratio` is always 0). (uncertain: the viewer guesses "line 1" = one rope blocked and "line 2" = both / a two-line pattern; the meaning is not confirmed.)

| Step | From | Speed | Gap | Pattern |
|---|---|---|---|---|
| 1 | 0 s | ×1.30 | 11–13 | line1 80%, line2 20% |
| 2 | 5 s | ×1.40 | 10–12 | line1 80%, line2 20% |
| 3 | 10 s | ×1.50 | 9–11 | line1 60%, line2 40% |
| 4 | 15 s | ×1.60 | 8–10 | line1 60%, line2 40% |
| 5 | 20 s | ×1.70 | 7–9 | 50 / 50 |
| 6 | 25 s | ×1.80 | 6–9 | 50 / 50 |
| 7 | 30 s | ×1.85 | 6–9 | line1 33.3%, line2 66.7% |
| 8 | 35 s | ×1.90 | 6–8 | line2 100% |
| 9 | 40 s | ×1.95 | 6–8 | line2 100% |
| 10 | 45 s | ×2.00 | 5–8 | line2 100% |
| 11 | 50 s | ×2.05 | 5–8 | line2 100% |
| 12 | 55 s | ×2.10 | 5–7 | line2 100% |
| 13 | 60 s | ×2.15 | 5–7 | line2 100% |
| 14 | 65 s | ×2.20 | 4–7 | line2 100% |
| 15 | 70 s+ | ×2.25 | 4–6 | line2 100% |

After step 15 the speed keeps rising by +0.05 every 5 s.

---

## Score reward tracks

Totals are the **sum of all challenge-mode scores** in that game. "Event" = `Normal` track (group 1000); "Arcade" = arcade replay track (group 2000).

### During the event (5 steps per game)

| Step | Total score | Run | Smash | Catch the Coin | Stack Up | Climb |
|---|---|---|---|---|---|---|
| 1 | 100,000 | Gem ×30 | Gem ×30 | Gem ×30 | Gem ×30 | Gem ×30 |
| 2 | 200,000 | Attacker Common Console ×30 | Boost Module ×20 | Boost Module ×20 | Skill Manual I ×36 | Burst Manual I ×18 |
| 3 | 300,000 | Defender Common Console ×30 | Tetra Common Console ×30 | Elysion Common Console ×30 | Skill Manual II ×24 | Burst Manual II ×12 |
| 4 | 400,000 | Supporter Common Console ×30 | Pilgrim Common Console ×30 | Missilis Common Console ×30 | Skill Manual III ×12 | Burst Manual III ×6 |
| 5 | 500,000 | LET'S PLAY, SODA! Premium Sticker I | Special Sticker I | Special Sticker II | Special Sticker III | Premium Sticker II |

### Arcade replay (3 steps per game)

| Game | Step 1 (Gem ×30) | Step 2 (Gem ×30) | Step 3 (sticker ×1) |
|---|---|---|---|
| Run | 360,000 | 720,000 | 1,200,000 — Premium Sticker I |
| Smash | 120,000 | 240,000 | 400,000 — Special Sticker I |
| Catch the Coin | 300,000 | 600,000 | 1,000,000 — Special Sticker II |
| Stack Up | 360,000 | 720,000 | 1,200,000 — Special Sticker III |
| Climb | 360,000 | 720,000 | 1,200,000 — Premium Sticker II |

---

## Data sources

| Table | Key fields | Meaning |
|---|---|---|
| EventPlaySodaManagerTable | `minigame_type` (Normal/Archive/Arcade), `story_group_id`, `challenge_group_id`, `daily_reward_id`, `total_point_reward_group_id`, `ingame_pause_second`, `play_helptip_id` (0) | hub settings per mode |
| EventPlaySodaStoryModeTable | `id` (= dungeon stage id), `order`, `open_condition_type`/`value` (EventDungeonStageClear + stage id), `game_type`, `short_name`, `game_title`, `stage_helptip_id`, `stage_image`, `stage_data_id`, `clear_reward_id`, `enter_scenario`/`exit_scenario` | the 5 EX story stages |
| EventPlaySodaChallengeModeTable | `open_condition_value` (story stage id), `game_type`, `game_title(_en)`, `stage_helptip_id`, `stage_data_id` | challenge-mode entries |
| EventPlaySodaPointRewardTable | `group_id`, `game_type`, `step`, `point_value` (cumulative score), `reward_id` | score reward tracks |
| EventRunning{Story,Challenge}StageTable | `clear_time_second` (s), `life`, `hit_immune_time_ms` (ms), `default_object_speed` (f32), `default_obtain_point`, `jump_y_power`/`gravity_value` (f32), `auto_increase_difficulty_second` (s), `time_difficult_group` | Run settings |
| EventRunningTimeDifficultTable | `difficulty_step`, `play_time_min/max` (s), `spawn_distance_min/max`, `spawn_group_id`, `difficulty_play_speed` (f32 ×), `auto_increase_play_speed` (f32) | Run difficulty |
| EventRunningSpawnGroupTable / ObjectTable | `spawn_object_id`, `spawn_ratio` (weight) / `object_resource_id` | hurdle mix |
| EventSmash{Story,Challenge}StageTable | `clear_point`, `point_limit`, `life`, `spawn_slot_count`, `appear/idle/exit_hit_point`, `none_target_pass_point` | Smash settings |
| EventSmashCharacterTable / CharacterGroupTable | `resource`, `type` (Target/NoneTarget), `type_value` (1) / `character_id`, `spawn_rate` (weight) | who pops up |
| EventSmashTimeDifficultTable | `lv`, `play_time_min/max` (s), `spawn_group`, `spawn_count_max`, `spawn_delay_time`, `character_wait_time` (1/10,000 s) | Smash difficulty |
| EventCatchCoin{Story,Challenge}StageTable | `character_id`, `clear_point`, `point_limit`, `life`, `time_difficult_group` | Catch settings |
| EventCatchCoinCharacterTable | `move_speed`, `dash_range`, `dash_speed` (÷10,000) | Soda movement |
| EventCatchCoinObjectTable / ObjectGroupTable | `resource`, `type` (CharacterHit/AddPoint), `type_value` (lives or points), `base_fall_speed` / `object_id`, `spawn_rate` | falling objects |
| EventCatchCoinTimeDifficultTable | `lv`, `play_time_min/max`, `spawn_tick` (1/10,000 s), `spawn_group`, `spawn_count_min/max`, `object_fall_speed_rate` (÷10,000 ×) | Catch difficulty |
| EventStackUp{Story,Challenge}StageTable | `clear_number_floors`, `character_default_speed`, `default_obtain_point`, `perfect_action_point_rate`, `perfect_action_length`, `object_spawn_distance`, `auto_increase_difficulty_floor`, `camera_default_speed`, `object_default_length` (decimals f32) | Stack settings |
| EventStackUpTimeDifficultTable | `difficulty_play_speed`, `auto_increase_play_speed` (f32), `stack_floor_min/max` (0) | Stack speed |
| EventClimbing{Story,Challenge}StageTable | `clear_time_second`, `life`, `hit_immune_time_ms`, `jump_motion_length_ms`, `jump_height` (f32), `default_object_speed` (f32), `default_obtain_point`, `first_object_generate_distance`, `auto_increase_difficulty_second` | Climb settings |
| EventClimbingTimeDifficultTable | `difficulty_step`, `play_time_min/max`, `spawn_distance_min/max`, `spawn_line_0/1/2_ratio`, `difficulty_play_speed`, `auto_increase_play_speed` | Climb difficulty |
| MinigameHelpTipDescTable | groups 10001–10010 | in-game help text |
| EventDungeonStageTable | stage names for unlock conditions | event story map |

## Uncertain / unknown

- 1/10,000 unit for Smash and CatchCoin times/rates is the viewer's reading, not stated in data.
- Run and Climb `default_obtain_point` (210 / 160): what earns these points (per hurdle cleared, per second…) is not in the data.
- Climb "line 1 / line 2" spawn patterns: meaning unclear (guess: obstacle on one rope vs. both ropes / other pattern).
- Stack Up: whether bars get trimmed on imperfect drops is not in the data; `object_spawn_distance` (5.0) and `camera_default_speed` (2.0) are not interpreted; `stack_floor_min/max` are 0.
- Running `jump_y_power`/`gravity_value`, Climbing `jump_height`: physics constants, units unknown.
- `stage_resource_id` "DUMMY", `resource` "CoinRush_Dummy", `stage_image`/`game_mode_resource` "dummy": placeholder fields.
- "Archive" mode row (story only, no rewards) is presumably the post-event archive; not confirmed.
