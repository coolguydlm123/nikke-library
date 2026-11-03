# AZX Service Time

AZX Service Time is the minigame of the Terminus Ticket event (event id 82801; art folder `71_terminusticket`; intro story "AZX Service Time", scene `d_contents_azxservicetime_01`). It is a "sum to ten" block puzzle themed as meal service on the AZX train. The cargo space is a grid of numbered blocks (1-9). You drag over blocks whose numbers add up to exactly 10 to clear them for points. A run lasts 120 s, or ends early when no clearable combination is left. Nero's skills help during a run, the chosen attendant (Soline, Diesel, Brid) changes the block art, and bigger cargo spaces (more, smaller blocks) unlock as your total score grows.

## How to play / rules

In-game help (MinigameHelpTipDescTable group 10098), summarised:
- **AZX Service Time**: drag blocks until the sum of their numbers reaches 10; they are cleared and give points. The game ends when the timer hits 0 or no more blocks can be cleared. Clear as many as possible.
- **Cargo Spaces**: each space holds a fixed number of blocks; the larger the capacity, the smaller the blocks.
- **Attendants and Blocks**: choose an attendant before starting; the blocks' look changes by attendant.
- **Skills**: *Cat's Eye*: Nero finds and highlights a clearable combo. *Feline Flurry*: Nero messes up the blocks, pausing the timer; afterwards all blocks get new random numbers. *Thanks Fur All the Fish*: all blocks become fish-shaped; selecting one clears it immediately and the rest return to normal. (Name pairing conflict, see Uncertain.)
- **Exiting**: the Exit button (top right) or ESC opens the exit window; the timer keeps running while it is open.

Rules from the manager table:

| Rule | Value |
|---|---|
| Time limit | 120 s (`limit_time` 120; whole seconds in this game) |
| Target sum | 10 (`block_number_elimination` 10) |
| Points | 1,000 per block cleared (`block_per_score`); a 4-block clear = 4,000 |
| Game over | timer reaches 0, or no combination on the board can make 10 |
| Selection | the viewer describes a drag "rectangle" over blocks (uncertain: the help text only says "drag blocks"); `drag_area_min_percent` 10 and `block_hitbox_percent` 60 tune the drag box / block hit area (exact use unknown) |
| Hint blink | `detect_number_blink_time` 10 (unit unknown; highlight duration of the hint skill, uncertain) |
| `shut_down_time` | 2 (unit/meaning unknown; possibly the delay before the run ends) |

## Scoring and ranks

Score = 1,000 × blocks cleared. Single-run rank:

| Rank | Score | Blocks cleared |
|---|---|---|
| S | 60,000 | 60 |
| A | 40,000 | 40 |
| B | 20,000 | 20 |
| C | 0 | 0 |

Each attendant has idle / select / rank B / rank A / rank S / ending animations (EventAZXAppleGameAnimationTable). S-rank results unlock album photos.

## Content

### Cargo spaces (boards)
Unlocked by total score over all runs.

| Cargo space | Layout (horizontal × vertical) | Blocks | Unlocks at total score |
|---|---|---|---|
| City Forest | 8 × 14 | 112 | 0 |
| Desert | 9 × 15 | 135 | 150,000 |
| Snowy Land | 10 × 16 | 160 | 350,000 |

### Block numbers
Each number 1-9 has weight 10 (equal 11.1% share), with at least 10 and at most 20 copies on the board. This is the same on all three boards. A cleared group can be any size as long as it sums to exactly 10 (e.g. 1+9, 2+3+5, 1+1+1+7).

### Attendants
Cosmetic: they only change the block art and animations.

| Attendant | Available |
|---|---|
| Soline | from the start |
| Diesel | 7 days after the event opens, then total score 30,000 |
| Brid | 14 days after the event opens, then total score 30,000 (after Diesel is unlocked) |

### Nero's skills
Names and flavour descriptions below are from the skill table; effects are from the in-game help.

| Skill (table name) | `skill_type` | Effect | Available |
|---|---|---|---|
| Feline Flurry | DetectNumber | highlights one combination that adds up to 10 | from the start |
| Cat's Eye | MixNumber | pauses the timer and gives every block a new random number | day 7, then use any skill 1 time |
| Thanks Fur All the Fish | DestroyNumber | all blocks turn into fish (`azxservicetime_icn_block_fish`); tap one and it is cleared at once, the rest change back | day 14, then use any skill 2 times (after Cat's Eye) |

Every skill has `skill_use_value` 1 (uncertain: probably uses per run). The data has no cooldown field.

## Progression & rewards

- **Daily reward**: score 10,000 in one run → Gem x30.
- **Missions** (scores add up over all runs):

| Mission | Reward |
|---|---|
| Total score 100,000 | Skill Manual I x180 |
| Total score 200,000 | Skill Manual II x120 |
| Total score 300,000 | Skill Manual III x60 |
| Total score 400,000 | AZX SERVICE TIME Premium Sticker II x1 |
| Total score 500,000 | Burst Manual I x90 |
| Total score 600,000 | Burst Manual II x60 |
| Total score 700,000 | Burst Manual III x30 |
| Total score 800,000 | AZX SERVICE TIME Premium Sticker I x1 |
| Use each skill (Feline Flurry, Cat's Eye, Thanks Fur All the Fish) 2 times | Central Government Supply Chest I x7 (each) |
| Use each skill 5 times | Ultra-Double Boost Module x10 (each) |
| Play as Soline 5 times | Attacker Common Console x30 |
| Play as Diesel 5 times | Defender Common Console x30 |
| Play as Brid 5 times | Supporter Common Console x30 |

- **Album** (album category 30017): 9 photos, 3 per attendant. Each attendant: "Play once", "Reach S rank 2 times", "Reach S rank 5 times" (with that attendant). Captions e.g. Soline "Heavy! It's so heavy!", Diesel "I'm Diesel! AZX's attendant!", Brid "... I need a coffee IV drip."

## Data sources

| Table | Fields | Meaning |
|---|---|---|
| EventAZXAppleGameManagerTable (1 row) | `event_id`, `enter_scenario`, `daily_reward_score` / `daily_reward_id`, `mission/character/skill/board/cut_scene_group_id`, `tutorial_id` (help group), `album_category_id` | links |
| | `limit_time` (s), `block_number_elimination` (target sum), `block_per_score`, `s/a/b_rank_target_score` | rules and ranks |
| | `detect_number_blink_time`, `drag_area_min_percent`, `block_hitbox_percent`, `shut_down_time`, `board_resource`, `skill_cut_scene_resource`, `change_block_resource` | tuning / art (partly uninterpreted) |
| EventAZXAppleGameBoardTable | `order`, `level`, `board_open_score` (total score), `horizontal_block_value`, `vertical_block_value`, `number_group_id`, `bg_resource`, `name_locale_key` | cargo spaces |
| EventAZXAppleGameNumberTable | `group_id`, `number`, `ratio` (weight), `min_count`, `max_count` | block number generation |
| EventAZXAppleGameCharacterTable | `order`, `animation_group_id`, `character_open_date` (days after event start), `character_open_score` (total score), `character_resource`, `block_resource` | attendants |
| EventAZXAppleGameAnimationTable | `group_id`, `animation_play_condition` (Idle/Select/RankB/RankA/RankS/Ending), `animation_resource` | attendant animations |
| EventAZXAppleGameSkillTable | `order`, `skill_open_date` (days), `skill_open_use_value` (total skill uses), `skill_type`, `skill_use_value`, `skill_resource` | Nero's skills |
| EventAZXAppleGameMissionTable | `mission_type` GetScore/UseSkillCount/PlayCharacterCount, `mission_condition_id` (skill or attendant id), `mission_condition_value`, `mission_reward_id` | missions |
| EventAZXAppleGameCutSceneTable | `cutscene_resource(_image)`, `description_locale_key`, `appeared_condition_id` (attendant), `appeared_condition_value` (S-rank count; 0 = play once), `unlock_description_locale_key` | album |
| MinigameHelpTipDescTable | group 10098 | in-game help |

## Uncertain / unknown

- **Skill name conflict**: the skill table names DetectNumber "Feline Flurry" and MixNumber "Cat's Eye"; the in-game help describes Cat's Eye as the highlight and Feline Flurry as the reshuffle. Which name the game shows for which effect is unclear; missions use the table names.
- Whether the selection must be a rectangle (viewer's reading) or any dragged set is not stated by a field.
- `skill_use_value` 1 (per-run uses?), `detect_number_blink_time` 10, `drag_area_min_percent` 10, `block_hitbox_percent` 60, `shut_down_time` 2: units/meanings not confirmed.
- How the "no more combinations" end is detected, and whether skills can rescue it, is not in the data.
