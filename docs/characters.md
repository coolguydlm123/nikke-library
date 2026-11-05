# Nikke Library: Characters section

A guide to the Characters pages of the Nikke Library (a local datamine browser for the game NIKKE) and the game mechanics behind them. It is meant to be read without any other context.

- **Code:** `lib/characters.js` (server: builds the data), `public/characters.js` (browser: pages, calculator, simulator).
- **Data:** game tables are JSON files in `D:\Nikke Datamine\mpkparser\jsons`. Each file is `{ records: [...] }` or a plain array. Character tables are in the `Character\` subfolder.
- **Text:** in-game text comes from locale files in `D:\Nikke Datamine\nikke-downloader\json-locale` (`Locale_<Table>.json`, a flat `{ key: text }` map). A table field such as `name_localkey: "Locale_Character:c010_name"` means file `Locale_Character.json`, key `c010_name`. English is used.
- **Marking:** **[data]** = read straight from a table. **[code]** = a rule written in the code, not found in any table. **[inferred]** = an interpretation of the data. **[user]** = a game rule given by the site's owner, not in the data.

## Pages and routes

| Route | Page |
|---|---|
| `#/characters` | Landing hub: tool cards (CP calculator, Overload gear), then every Nikke's icon grouped by manufacturer |
| `#/character/<name_code>` | One Nikke: profile, weapon, skills, CP calculator, stories, costumes, voice |
| `#/character/<name_code>/cp` | Same page, scrolled to the CP calculator |
| `#/character/overload` | Overload gear: roll odds, effects by level, costs, roll simulator |

The sidebar lists every Nikke grouped by manufacturer, in the order Elysion, Missilis, Tetra, Pilgrim, Abnormal. A "Gear" group at the top links the Overload gear page.

API routes (`lib/api.js`): `/api/characters` (list), `/api/character?code=N` (detail), `/api/cp-data` (CP calculator tables), `/api/overload` (Overload gear data).

## Which characters are listed

- **Source [data]:** `Character/CharacterTable.json`. Rows with `is_visible: false` are skipped.
- **Order:** by `resource_id` (the art id, shown in image names as `c010`, `c011` …; Rapi is c010), then `name_code`, ascending, in the sidebar, the landing gallery and within each manufacturer group.
- **One entry per character:** a character has one row per grade (limit-break level). The list keeps one entry per `name_code`, using the row with the lowest `grade_core_id`. `name_code` is the character's id in URLs; `resource_id` is the art and voice id (for example Rapi: name_code 3001, resource_id 10).
- **Count:** 206 Nikkes at the time of writing (177 SSR, 20 SR, 9 R).
- **No character stats:** base stats (ATK, HP, DEF by level) are deliberately not shown. The site owner decided against it for now.

### List fields

| Shown | From |
|---|---|
| Name | `name_localkey` |
| Rarity | `original_rare` (SSR / SR / R) |
| Class | `class` → `Locale_System:CLASS_TYPE_<CLASS>_NAME` (Attacker, Defender, Supporter) |
| Manufacturer | `corporation` (title-cased) |
| Overspec | `corporation_sub_type === 'OVERSPEC'` |
| Element | `element_id[]` → `ElementTable.json` `element_name_localekey` |
| Weapon | `shot_id` → `Character/CharacterShotTable.json` `weapon_type` (AR, SMG, SG, SR, RL, MG) |
| Burst | `use_burst_skill`: Step1/Step2/Step3/AllStep shown as I / II / III / A. "A" is the flexible burst a Nikke can use at any step; one Nikke has it. |
| Skill effect tags | union of the tags of the Nikke's 3 skills (see "Skill effect tags") |
| ★ (favorite item) | the Nikke has a row in `FavoriteItemTable.json` with `favorite_type: 'Favorite'` and its `name_code` |
| Icon | image `si_c<resource_id 3 digits>_00_s` in `public/img/icons-char/` |

## Filters

On the landing page, between the tool cards and the gallery. The sidebar only shows "N of 206 match · Clear all · Edit filters" while a filter or the text box is active; its list always follows the filters.

- **Chip groups:** Rarity (SSR, SR, R), Weapon (AR, SMG, SG, SR, RL, MG), Element (Fire, Water, Wind, Electric, Iron), Burst (I, II, III, Any), and Skill effect (every tag below, most common first; folded away until opened or while something in it is picked). A Nikke matches a Skill effect chip if any of its three base skills has that tag.
- **How they combine:**
  - Picking several chips in one group matches any of them (OR).
  - Groups combine with each other (AND).
  - The text box (name, class, weapon, element or "burst I/II/III") combines with the chips too.
- **Counts:** each chip shows how many Nikkes it would match, given everything else currently picked. "N of 206 match" and **Clear all** sit below the chips; Clear all also empties the text box.
- **Saved:** picks are saved in the browser (localStorage key `charFilters`).

## Character page

### Profile

| Shown | From |
|---|---|
| Portrait | image `c<resource_id>_00` in `icons-char` |
| Description | `description_localkey` |
| Squad | `squad` → `Locale_System:<squad>_name` and `squad_<squad>_info` |
| Crit rate / crit damage | `critical_ratio` / `critical_damage`, stored ×100 (1500 = 15%) |

### Weapon

From `Character/CharacterShotTable.json` (row = the character's `shot_id`).

| Stat | Field | Unit |
|---|---|---|
| Type | `weapon_type` → `Locale_System:WEAPON_TYPE_<type>_NAME` | |
| Attack | `attack_type` | |
| Control | "Charge" if `charge_time > 0`, else "Normal" (`Locale_System:WEAPON_CONTROL_TYPE_*`) **[code]** | |
| Damage | `damage` | ÷100 → % of ATK |
| Pellets | `shot_count` (only shown when > 1) | |
| Ammo | `max_ammo` | |
| Reload | `reload_time` | ÷100 → seconds |
| Core damage | `core_damage_rate` | ÷100 → % |
| Charge time / full charge damage / full charge burst | `charge_time`, `full_charge_damage`, `full_charge_burst_energy` | ÷100 → s / % / % |
| Burst / shot | `burst_energy_pershot` | ÷10,000 → % of the burst gauge |
| Burst / shot on target | `target_burst_energy_pershot` (the value when the shot hits the target) | ÷10,000 → % |
| Ammo / reload / fire rate / range ratings | `Character/CharacterShotTutorialTable.json` by `weapon_type`: `max_load_info_localkey`, `reload_time_info_localkey`, `shot_speed_info_localkey`, `effective_range_info_localkey` (text such as "Medium") | |

The weapon description text has placeholders such as `{damage}` that are filled from the same row ÷100.

### Skills

- **Slots:** `skill1_id`, `skill2_id`, and the burst `ulti_skill_id`. Each points into `SkillInfoTable.json`; each level's row links to the next with `next_level_id`.
- **Descriptions:** `description_localkey` text has `{description_value_NN}` placeholders, filled from that level's `description_value_list`.
- **Burst cooldown:** `Character/CharacterSkillTable.json` `skill_cooltime` ÷100 → seconds.
- **Skill level slider:** 1–10, saved in the browser.
- **Skill effect tags:** small badges under each skill. Favorite item versions of a skill get their own tags.
- **Favorite item toggle** (only for Nikkes with one): `FavoriteItemTable.json` `favoriteitem_skill_group_data`. Each entry has `skill_change_slot` (1 = Skill 1, 2 = Skill 2, 3 = Burst) and `favorite_skill_id`. With the toggle on, those slots show the favorite item's versions of the skills. 21 Nikkes have one.

### Skill effect tags

Computed in `lib/characters.js` (`EFFECT_LABELS`, `skillTags`), level 1 of each skill, **[code]** mapping on **[data]** types:

1. A skill id points either to a `StateEffectTable` row (`skill1_table` / `skill2_table` = `StateEffect`: its `functions[]`, `use_function_id_list`, `hurt_function_id_list`) or to a `Character/CharacterSkillTable` row (the burst, and some skills: its `before_*` / `after_*` `function_id_list` fields).
2. Each function id is a `FunctionTable` row; its `function_type` is the effect. The walk follows `connected_function[]`, and `UseCharacterSkillId` (its `function_value` is another `CharacterSkillTable` id).
3. `function_type` → short label. Near-duplicates share one: for example `Damage`, `PartsDamage`, `DurationDamage`, `ProjectileDamage` … → **Damage**; `StatAmmo`, `GainAmmo`, `AllAmmo` … → **Ammo**; `HealCharacter`, `StatHpHeal`, `HealVariation` … → **Heal**; `AddDamage`, `ShareDamageIncrease`, `DefIgnoreDamageRatio` … → **Damage Up**.
4. A stat type whose function has `buff` = DeBuff/DebuffEtc (against enemies) becomes "<stat> Down" (ATK Down, DEF Down, Charge Speed Down …). A debuff `AddDamage` is shown as "Damage Taken Up" **[inferred]**. Other enemy-targeted types keep their label (Taunt, Stun, Damage …); debuffs of heal/ammo/cooldown/burst gauge/cover/barrier give no tag.
5. A `CharacterSkillTable` row's own `skill_type` adds a tag when it deals damage (`Instant*`, `LaunchWeapon`, `LaserBeam`, `AutoFireWeapon` → Damage), places something (`InstallBarrier` → Barrier, `InstallDecoy` → Decoy) or `ChangeWeapon` → Weapon Change.

Labels: Damage, Damage Up, ATK, DEF, Max HP, Crit Rate, Crit Damage, Hit Rate, Charge Damage, Charge Speed, Reload Speed, Fire Rate, Ammo, Pierce, Elemental Dmg, Pellets, Range, Explosion Range, Heal, Lifesteal, Cover Recovery, Barrier, Damage Reduction, Invincible, Damage Share, Taunt, Burst Gauge, Burst Duration, Cooldown, Stun, Cleanse, Debuff Immunity, Revive, Stealth, Transform, Forced Reload, Decoy, Weapon Change, plus the "Down" and "Damage Taken Up" variants.

**Uncertain or not mapped:**
- Labels are my reading of the type names: `DrainHpBuff` → Lifesteal, `StatExplosion` → Explosion Range, `Attention` and `FocusAttack` → Taunt, `Immortal` and `ImmuneDamage` → Invincible are guesses.
- Plumbing types give no tag: `UseCharacterSkillId` (followed instead), `RemoveFunctionGroup`, `FunctionOverlapChange`, `TargetGroupid`, `TimingTriggerValueChange`, `AddFunctionTimer`, `CycleUse`, `None`. A rarer type not in the table (about 60 single-use types) also gives no tag.
- Tags come from the function types only: the data doesn't say whether an effect applies to the user, allies or enemies beyond the `buff` field, and the tags don't distinguish them.
- Level 1 is used; a function that only appears at a higher level isn't tagged.

### Costumes

- **Source:** `Character/CharacterCostumeTable.json`, rows with the Nikke's `resource_id` and `is_hidden: false`.
- **Fields:** name `costume_name_locale`, description `costume_description_locale`, grade `costume_grade_id`.
- **Art:** `c<resource_id>_<costume_index 2 digits>` (Default is index 00).

### Stories

Links to the Nikke's bond episodes and counseling scenes in the Stories section: story groups `char<name_code>` in the `bond` and `counsel` categories.

### Voice

- **Voice actresses [data]:** `Locale_Character:<resource_id>_cv_ko`, `_cv_ja`, `_cv_en` (Korean, Japanese, English), with the leading "CV:" removed. `CharacterTable.cv_localkey` points at the same key without the language suffix.
- **Which lines belong to which look [data]:** `Character/CharacterVoiceTable.json` maps a look (`resource_id` + `costume_index`, `voice_type` Character or Costume) to a speech group id.
- **The lines [data]:** `Character/CharacterVoiceGroupTable.json` rows with that `speech_group_id`.
  - `category_group` → `Character/CharacterVoiceCategoryTable.json`: Lobby, Outpost, Obtain and Upgrade, Field, Battle.
  - `voice_description` is when the line plays (for example "Tapped in Lobby (Bond Lv. 10) I").
  - `speech_localkey` is the line itself.
  - `condition_attractive_level` is the bond level that unlocks it (1 or 10).
  - `order` sorts the lines.
- **Size:** a full set is about 42 lines.
- **Costume picker:** switches the lines. 82 costumes have their own voice group. A costume without one is marked "(default voice)" and shows the default lines; the page says the data has none for it.
- **Text only:** no voice audio is extracted.

## CP calculator

On every Nikke's page. You type in the inputs; it computes CP and shows each step. Inputs are saved per Nikke in the browser (`cp-<name_code>`).

### Formula [code]

The formula is written in the code (`public/characters.js`); it is not read from a table.

```
statPower    = ATK × 1.075 × 18 + (HP + DEF × 100) × 0.7
multiplier   = 1.3 + (Skill1 + Skill2) × 0.01 + Burst × 0.02 + itemEffectBP × 0.0001
CP           = round(statPower × multiplier × 0.01)
itemEffectBP = overload BP + harmony cube BP + collection/favorite item BP
```

- ATK, HP and DEF are typed in by the user; the site doesn't compute stats.
- Skill and Burst levels are clamped to 1–10.
- 1.075 is described in the code as a crit factor that is the same for every unit.

### Where item BP comes from [data]

- **Every item's battle power** comes from `FunctionTable.json` `function_battlepower`.
- **For a state effect** (`StateEffectTable.json`), BP is the sum of `function_battlepower` over its `functions[]`.
- **For a skill at a level:** look up `SkillInfoTable` by `group_id` + `skill_level`, then take that row's state effect BP.

- **Overload lines:** 12 lines in a table (Head, Body, Arm, Leg × 3 lines). Each line is "—", "Stat" or "Elemental", plus a level 1–15.
  - BP per level comes from the overload options' state effects (see below), chained tier by tier into levels 1–15. Tiers worth 0 BP are skipped.
  - Elemental damage (`IncElementDmg`) has its own scale: 83, 166, 248 … 1,242 at Lv 15.
  - Every other effect shares the `StatAtk` scale: 69 per level, 1,035 at Lv 15. **[inferred]** from all non-elemental effects having the same BP.
- **Harmony cube:** pick one of 18 cubes (`ItemHarmonyCubeTable.json`, sorted by `order`) and a cube level 1–15.
  - The cube's skills are in `harmonycube_skill_group[].skill_group_id`.
  - `ItemHarmonyCubeLevelTable.json` rows with the cube's `level_enhance_id` give, per cube level, `skill_levels[]` (the level of each of those skills).
  - Cube BP = the sum of those skills' BP. All 18 cubes reach 1,196 BP at Lv 15.
- **Collection item / favorite item:** the dropdown lists the two collection items (dolls) for the Nikke's weapon type, one R and one SR (`FavoriteItemTable.json` `favorite_type: 'Collection'`, matched on `weapon_type`), plus the Nikke's own favorite item if it has one.
  - Levels come from `FavoriteItemLevelTable.json` rows with the item's `level_enhance_id`: `level`, and `grade` shown as "phase".
  - BP at a level = the sum over `collection_skill_group_data[].collection_skill_id` of skill BP at `collection_skill_level_data[].collection_skill_level`.
  - Example: a doll has 16 levels in phases 0–3; R reaches 713 BP and SR 1,288 BP.

## Overload gear page

"Overload" is modifying top-tier gear (T10) so its manufacturer effect is replaced by up to 3 random effect lines. In game text it is "Equipment Modification".

### Which gear and which effects [data]

- **Gear:** `ItemEquipTable.json`, the gear whose `option_slot[]` has a group (only `item_rare: 'T10'`). Each of its 3 `option_slot` entries gives the option group (100000) and `option_slot_success_ratio` (÷100 = the chance that line gets an effect): **100% / 50% / 30%**.
- **Effects:** `EquipmentOptionTable.json` rows in that group, 3 rows per effect type (one per tier):
  - `state_effect_group_id`: the effect type.
  - `option_group_ratio`: the effect type's weight; ÷ the sum of the 9 types' weights gives the chance. **10%** each for Elemental Advantage Damage, ATK, Critical Damage, DEF; **12%** each for Hit Rate, Max Ammunition, Charge Damage, Charge Speed, Critical Rate.
  - `option_ratio` (of 10,000): the tier's chance given the effect. Tier 1 (Lv 1–5) **60%**, tier 2 (Lv 6–10) **35%**, tier 3 (Lv 11–15) **5%**.
  - `state_effect_list[]`: 5 levels per tier, each a `StateEffectTable` id. Its first function in `FunctionTable` gives `function_type`, `function_value` (÷100 = %) and `function_battlepower`.
  - `description_localkey`: the effect's name.
- **Other option groups:** rows in groups 100 and 200 (ids 10, 11, 20) are used by no gear and are ignored.

Values by level (%, from `function_value` ÷100):

| Effect | Lv 1 | Lv 5 | Lv 6 | Lv 10 | Lv 11 | Lv 15 |
|---|---|---|---|---|---|---|
| Elemental Advantage Dmg | 9.54 | 15.15 | 16.55 | 22.15 | 23.56 | 29.16 |
| ATK, DEF, Charge Damage, Hit Rate | 4.77 | 7.59 | 8.29 | 11.11 | 11.81 | 14.63 |
| Max Ammunition | 27.84 | 44.28 | 48.39 | 64.82 | 68.93 | 85.37 |
| Charge Speed | 1.98 | 3.16 | 3.45 | 4.63 | 4.92 | 6.09 |
| Critical Rate | 2.30 | 3.66 | 4.00 | 5.37 | 5.71 | 7.07 |
| Critical Damage | 6.64 | 10.56 | 11.54 | 15.46 | 16.44 | 20.36 |

### Data quirks

- **Negative values:** Hit Rate (`StatAccuracyCircle`) and Charge Speed (`StatChargeTime`) are stored as negative numbers (a smaller spread circle, a shorter charge time). The page shows their absolute values.
- **Swapped key names:** the locale keys for crit are swapped by name. `statcriticaldamage_description` reads "Increased Critical Rate" but belongs to the `StatCritical` (rate) effect, and `statcritical_description` reads "Critical Damage". The page uses the text, which matches the effect.
- **Integer values:** Charge Damage and both crit effects have `function_value_type: Integer`, but they are read the same way (÷100 = %).

### Costs [data]

- **Cost groups:** `EquipmentOptionCostTable.json` rows by `cost_group_id`. The T10 gear row names three groups: `option_cost` 10 (Modify gear), `option_change_cost` 200 (Change Effects) and `option_lock_cost` 100 (Lock Effect).
- **Prices:** each row's `cost_id` is a `CostTable.json` row whose `costs[]` lists item and amount. A Lock Effect row also has `disposable_fix_cost_id`, the price in Custom Locks.
- **Currencies:** item names come from `ItemMaterialTable.json`. Item 7080001 is the **Custom Module**; item 7080002 is the **Custom Lock**, "lock an equipment modification effect only once".

| Action | cost_level | Custom Modules | Custom Locks (disposable_fix_cost_level 0 / 1 / 2) |
|---|---|---|---|
| Modify gear | 0 | 1 | — |
| Change Effects | 0 / 1 / 2 / 3 | 1 / 2 / 3 / 4 | — |
| Lock Effect | 0 | 2 | 20 / 30 / 40 |
| Lock Effect | 1 | 3 | 30 / 40 / 50 |
| Lock Effect | 2 | 4 | 40 / 50 / 60 |

The data doesn't say what raises a cost level, or what `disposable_fix_cost_level` counts.

### Roll simulator

Rolls Overload lines the way the game does, using the odds above.

#### Controls

- Each line shows its effect, level and value. Each line has a **Lock ×N** button (Custom Modules) and a **Custom Lock ×N** button, showing what locking costs right now.
- **Roll** does one roll; **×10** and **×100** repeat it.
- **Roll until target** keeps rolling until the target is met, up to 500,000 rolls. A target is up to 3 conditions "effect, Lv ≥ N", each met by a different line.
- **Reset** starts a fresh piece.
- **Shown:** totals (rolls, Custom Modules and Custom Locks spent, the next roll's cost) and the last 10 rolls.
- **Estimate:** the chance that the next roll with the current locks meets the target, from 40,000 sampled rolls, as "about 1 in N rolls (≈ M modules)". For Elemental ≥ 11 plus ATK ≥ 11 with no locks it is about 0.005% (1 in 20,000), which matches a hand calculation.

#### One roll

1. Each unlocked line is cleared, then gets an effect with its line chance (100 / 50 / 30%). **[data]**
2. The effect is picked by weight, excluding effects already on the piece. **[user]** The game never repeats an effect on one piece.
3. The tier is picked by `option_ratio`. **[data]**
4. A level inside the tier is picked uniformly. **[inferred]** The data has no per-level odds.

#### Rules from the site owner [user]

These are not in the data.

- **First roll:** the first roll after Reset is Modify gear; line 1 always gets an effect at exactly Lv 11.
- **Roll cost:** every roll costs 1 Custom Module (Change Effects level 0; Modify gear also costs 1).
- **Locking is paid once, when you lock**, by how many lines are already locked:

  | Lines already locked | Custom Modules | or Custom Locks |
  |---|---|---|
  | 0 | 1 | 20 |
  | 1 | 2 | 30 |
  | 2 | 3 | 40 |

  The code takes the module price from Change Effects levels 0–2 and the Custom Lock price from the Lock Effect rows at `cost_level` = lines already locked, `disposable_fix_cost_level` 0.
- **Module locks stay** through later rolls with nothing more to pay.
- **A Custom Lock is a temporary one-time lock:** it holds for the next roll only, then the line unlocks. ×10, ×100 and Roll until don't re-apply it.

**Not modeled:** the Lock Effect table's module prices (2/3/4), and `disposable_fix_cost_level` 1–2 (Custom Lock prices 50/60). The owner's rule above uses other columns of the same tables; how the game uses these isn't known. The game's "Reroll Values" action (keep effects, reroll values) has no cost group and isn't simulated.

## Known gaps

- **No base stats:** character stats aren't shown (owner's decision). The CP calculator needs ATK/HP/DEF typed in.
- **CP formula:** the formula and its constants (1.075, 18, 100, 0.7, 1.3, 0.01, 0.02, 0.0001) are in the code, not in any table.
- **Overload levels:** the per-level odds inside a tier are unknown, so they're treated as equal.
- **Voice:** voice audio isn't extracted, so voice lines are text only.
- **Animated models:** an animated Spine model viewer was tried and removed; only still portraits are used.
