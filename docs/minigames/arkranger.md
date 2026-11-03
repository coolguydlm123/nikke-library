# Fight! Ark Ranger

Pilot an Ark Machine: merge weapons and robot supporters in a grid inventory and hold the barricade against 100 waves. Weapons fire on their own; you pick traits, shop between waves and fire the Burst Skill.

This guide was generated from the Nikke Library's reading of the game data: the viewer `lib/eventgames/arkranger.js` (with `_survivor.js`) turns the `Event*` tables in `D:\Nikke Datamine\mpkparser\jsons` into the rules below. Numbers, units and formulas are the viewer's readings; anything it was not sure of is listed under "Uncertain / unknown". Long lists are cut to 30 rows.

- Intro story: "FIGHT! ARK RANGER!" (`d_contents_fightarkranger_01`)
- Art folder: `icons-event/82_arkranger`

## Overview

### A run

- **Intro story**: story "FIGHT! ARK RANGER!" (`d_contents_fightarkranger_01`)
- **Goal**: Hold the barricade through 100 waves; the run ends if its HP runs out
- **Characters**: Ark Leon: Leon Shooter, Ark Leon: Lander Arm, Ark Leon: Falcon Wings, Ark Leon: Lander Pack, Ark Buster
- **Fighting**: Automatic: every weapon in the inventory fires on its own; you trigger the Burst Skill
- **Between waves**: Shop (3 weapons), inventory expansion on some waves
- **Critical hits**: 10% chance, 200% damage
- **Reload floor**: Reload time can’t drop below 0.2 s
- **Score cap**: 2,000,000 points per run
- **Daily reward**: Score 1,000 in a run: Gem ×30

### What a kill gives

| Monster | EXP | Points | Gold |
|---|---|---|---|
| Minion | 10 | 100 | 50 |
| Elite | 50 | 500 | 250 |
| Boss | 100 | 1,000 | 500 |

Before bonuses. Each wave multiplies points and gold by its own ratio (100% at the start, more later).

### Weapons

- Ark Bowgun
- Ark Submachine Gun
- Ark Launcher
- Ark Shotgun
- Ark Machine Gun
- Ark Pistol
- Ark Rifle
- Ark Fire
- Ark Laser
- Ark Grenade
- Supporter: Missile
- Supporter: Boomerang
- Ark Photon Cannon
- Supporter: Blade
- Supporter: Dual Pistols
- Data Chip
- Jewel
- Grip
- Barricade
- Tool Set
- Battlizer
- Dual Sensors
- Energy Core

## How to play

The in-game guide; each part opens the first time you reach it (first battle, first trait choice, first inventory expansion, first visit to Upgrade).

## Characters

### Characters

Each character starts with one weapon, has its own inventory shape and a Burst Skill you trigger by hand.

#### Ark Leon: Leon Shooter

- **Burst Skill**: Ark Bomber; Unleashes a barrage of bombs, dealing damage to enemies.
- **Cooldown**: 60 s, unlimited uses
- **Skill type**: Bombing (values 5 / 25 / 500 / 300; meaning not documented)
- **Starting weapon**: Ark Submachine Gun
- **Barricade HP**: 10,000
- **Available**: From the start
- **Inventory**: `□□□□□□□□□`; `□□□□□□□□□`; `□□□■■■□□□`; `□□□■■■□□□`; `□□□■■■□□□`; `□□□■■■□□□`; `□□□■■■□□□`; `□□□□□□□□□`; `□□□□□□□□□`; 15 slots at the start (■), 66 more can be opened with expansion points (□)

#### Ark Leon: Lander Arm

- **Burst Skill**: Ark Repair; Takes time to regroup, restoring the barricade's HP and temporarily reducing reload time.
- **Cooldown**: 60 s, unlimited uses
- **Skill type**: Repair + faster reload (values 2000 / 1000 / 5; meaning not documented)
- **Starting weapon**: Ark Launcher
- **Barricade HP**: 10,000
- **Available**: From the start
- **Inventory**: `□□□□□□□□□`; `□□□□□□□□□`; `□□□□□□□□□`; `□□■■■■■□□`; `□□■■■■■□□`; `□□■■■■■□□`; `□□□□□□□□□`; `□□□□□□□□□`; `□□□□□□□□□`; 15 slots at the start (■), 66 more can be opened with expansion points (□)

#### Ark Leon: Falcon Wings

- **Burst Skill**: Ark Blade; Shoots a high-temperature blade, dealing damage to enemies and knocking them backward.
- **Cooldown**: 60 s, unlimited uses
- **Skill type**: Knockback (values 600 / 500 / 250 / 1; meaning not documented)
- **Starting weapon**: Ark Bowgun
- **Barricade HP**: 10,000
- **Available**: From the start
- **Inventory**: `□□□□□□□□□`; `□□□□■□□□□`; `□□□■■■□□□`; `□□□■■■□□□`; `□□□■■■□□□`; `□□□■■■□□□`; `□□□□■□□□□`; `□□□□■□□□□`; `□□□□□□□□□`; 15 slots at the start (■), 66 more can be opened with expansion points (□)

#### Ark Leon: Lander Pack

- **Burst Skill**: Ark Nova; Fires laser beams, dealing damage to enemies and lowering their DEF for a certain time.
- **Cooldown**: 60 s, unlimited uses
- **Skill type**: Laser beam (values 50 / 500 / 250 / 200; meaning not documented)
- **Starting weapon**: Ark Photon Cannon
- **Barricade HP**: 10,000
- **Available**: Day 8 of the event
- **Inventory**: `□□□□□□□□□`; `□□□□□□□□□`; `□□□□■□□□□`; `□□■■■■■□□`; `□□□■■■□□□`; `□□□■■■□□□`; `□□□■■■□□□`; `□□□□□□□□□`; `□□□□□□□□□`; 15 slots at the start (■), 66 more can be opened with expansion points (□)

#### Ark Buster

- **Burst Skill**: Ark Black Hole; Fires gravity balls that gradually grow bigger, attracting enemies nearby. The gravity balls will explode after a certain time, dealing damage to enemies.
- **Cooldown**: 60 s, unlimited uses
- **Skill type**: Gravity bomb (values 100 / 400 / 200 / 800 / 400 / 40 / 20 / 10 / 200; meaning not documented)
- **Starting weapon**: Supporter: Boomerang
- **Barricade HP**: 10,000
- **Available**: Day 15 of the event
- **Inventory**: `□□□□□□□□□`; `□□□□□□□□□`; `□□■■■□□□□`; `□□■■■■□□□`; `□□■■■■■□□`; `□□□■■□□□□`; `□□□□■□□□□`; `□□□□□□□□□`; `□□□□□□□□□`; 15 slots at the start (■), 66 more can be opened with expansion points (□)

### Levels and trait phases

Killing monsters gives EXP. Each level-up offers 3 traits to pick from (a 4th with the upgrade); which phases (I, II, III) can appear in each option changes with your level.

#### All characters

| Level | EXP | Option 1 | Option 2 | Option 3 | Option 4 |
|---|---|---|---|---|---|
| 1 | 150 |  |  |  |  |
| 2 | 150 | I | I / II | I / II | I / II |
| 3 | 150 | I | I / II | I / II | I / II |
| 4 | 150 | I | I / II | I / II | I / II |
| 5 | 150 | I | I / II | I / II | I / II |
| 6 | 300 | I | I / II | I / II | I / II / III |
| 7 | 300 | I | I / II | I / II | I / II / III |
| 8 | 300 | I | I / II | I / II | I / II / III |
| 9 | 300 | I | I / II | I / II | I / II / III |
| 10 | 300 | I / II | I / II | I / II | I / II / III |
| 11 | 450 | I / II | I / II | I / II | I / II / III |
| 12 | 450 | I / II | I / II | I / II | I / II / III |
| 13 | 450 | I / II | I / II | I / II | I / II / III |
| 14 | 450 | I / II | I / II | I / II / III | II / III |
| 15 | 450 | I / II | I / II | I / II / III | II / III |
| 16 | 600 | I / II | I / II | I / II / III | II / III |
| 17 | 600 | I / II | I / II | I / II / III | II / III |
| 18 | 600 | I / II | I / II | I / II / III | II / III |
| 19 | 600 | I / II | I / II | I / II / III | II / III |
| 20 | 600 | I / II / III | I / II / III | I / II / III | II / III |
| 21 | 750 | I / II / III | I / II / III | I / II / III | II / III |
| 22 | 750 | I / II / III | I / II / III | I / II / III | II / III |
| 23 | 750 | I / II / III | I / II / III | I / II / III | II / III |
| 24 | 750 | I / II / III | I / II / III | I / II / III | II / III |
| 25 | 750 | I / II / III | I / II / III | I / II / III | II / III |
| 26 | 1,000 | I / II / III | I / II / III | II / III | II / III |
| 27 | 1,000 | I / II / III | I / II / III | II / III | II / III |
| 28 | 1,000 | I / II / III | I / II / III | II / III | II / III |
| 29 | 1,000 | I / II / III | I / II / III | II / III | II / III |
| 30 | 1,250 | I / II / III | I / II / III | II / III | II / III |

(10 more rows of 40 not shown; see the data table.)

EXP is what the level needs to level up. The option columns list the trait phases each of the (up to four) choices is drawn from.

## Weapons

### Main weapons

Weapons fire on their own. Merging two equal weapons of the same rarity gives the next rarity (Lv 1 to Lv 4).

#### At a glance

| Weapon | Tag | Attack | Shape | Range | Available |
|---|---|---|---|---|---|
| Ark Bowgun | Pierce Attack | Spread shot | `■■■`; `·■·`; `·■·` | 800 | From the start |
| Ark Submachine Gun | Normal Attack | Bullets | `■■■`; `■··` | 650 | From the start |
| Ark Launcher | Area Attack | Explosive shell | `·■■`; `■■·` | 600 | From the start |
| Ark Shotgun | Normal Attack | Spread shot | `■■■`; `■··` | 550 | From the start |
| Ark Machine Gun | Normal Attack | Bullets | `■■■■`; `·■··` | 650 | From the start |
| Ark Pistol | Normal Attack | Bullets | `■■`; `■·` | 600 | From the start |
| Ark Rifle | Pierce Attack | Bullets | `■·`; `■·`; `■·`; `■■` | 900 | From the start |
| Ark Fire | Area Attack | Cone attack | `·■`; `·■`; `■■`; `·■` | 600 | From the start |
| Ark Laser | Pierce Attack | Bullets | `···■`; `■■■■` | 800 | From the start |
| Ark Grenade | Area Attack | Explosive shell | `■■`; `■■` | 550 | From the start |
| Supporter: Missile | Summon Attack | Missile barrage (robot) | `■■■`; `■■■` | 700 | From the start |
| Supporter: Boomerang | Summon Attack | Boomerang (robot) | `■■■`; `■··`; `■··` | 600 | Day 15 of the event |
| Ark Photon Cannon | Area Attack | Slowing shot | `■■·`; `·■■` | 600 | Day 8 of the event |
| Supporter: Blade | Summon Attack | Bouncing blades (robot) | `·■·`; `■■■`; `·■·` | 600 | From the start |
| Supporter: Dual Pistols | Summon Attack | Twin pistols (robot) | `■■■`; `·■·` | 600 | From the start |

Shape is the space the weapon takes in the inventory (■). The tag decides which traits boost it. Range is where it starts shooting.

#### Ark Bowgun

| Rarity | ATK | Reload | Shots per reload | Skills |
|---|---|---|---|---|
| **Lv 1** | 180 | 6 s | 1 / pierces | Arrows ricochet 1 time(s), dealing damage to the enemies they hit. |
| **Lv 2** | 150 | 6 s | 3 / pierces | Arrows ricochet 1 time(s), dealing damage to the enemies they hit. |
| **Lv 3** | 200 | 6 s | 3 / pierces | Arrows ricochet 2 time(s), dealing damage to the enemies they hit. |
| **Lv 4** | 250 | 6 s | 3 / pierces | Arrows ricochet 3 time(s), dealing damage to the enemies they hit. |

Shoots arrows, dealing damage to enemies.
Pierce Attack · Spread shot · targets Random · range 800

#### Ark Submachine Gun

| Rarity | ATK | Reload | Shots per reload | Skills |
|---|---|---|---|---|
| **Lv 1** | 180 | 5 s | 4 (1 at a time, 0.25 s apart) |  |
| **Lv 2** | 180 | 5 s | 5 (1 at a time, 0.25 s apart) |  |
| **Lv 3** | 180 | 5 s | 6 (1 at a time, 0.25 s apart) | Fires a critical bullet after 3 shots. The bullet is guaranteed to be a critical hit, and its critical damage multiplier is increased by 25%. |
| **Lv 4** | 180 | 5 s | 7 (1 at a time, 0.25 s apart) | Fires a critical bullet after 1 shots. The bullet is guaranteed to be a critical hit, and its critical damage multiplier is increased by 50%. |

Fires a large number of bullets in succession, dealing damage to enemies.
Normal Attack · Bullets · targets Random · range 650

#### Ark Launcher

| Rarity | ATK | Reload | Shots per reload | Skills |
|---|---|---|---|---|
| **Lv 1** | 180 | 5 s | 1 / explodes (radius 200) |  |
| **Lv 2** | 230 | 5 s | 1 / explodes (radius 200) | Has a chance to fire acidic bullets. Enemies hit by these bullets are afflicted with a DEF-reducing debuff for a period of time. (values: 50 / 10 / 500) |
| **Lv 3** | 230 | 5 s | 1 / explodes (radius 250) | Has a chance to fire acidic bullets. Enemies hit by these bullets are afflicted with a DEF-reducing debuff for a period of time. (values: 70 / 20 / 500); Fires a fragmenting bullet after 5 shots. The bullet explodes into 3 shards, hitting nearby enemies. |
| **Lv 4** | 280 | 5 s | 1 / explodes (radius 250) | Has a chance to fire acidic bullets. Enemies hit by these bullets are afflicted with a DEF-reducing debuff for a period of time. (values: 90 / 30 / 500); Fires a fragmenting bullet after 3 shots. The bullet explodes into 4 shards, hitting nearby enemies. |

Fires explosive grenade rounds, dealing damage to enemies.
Area Attack · Explosive shell · targets Nearby Foes · range 600

#### Ark Shotgun

| Rarity | ATK | Reload | Shots per reload | Skills |
|---|---|---|---|---|
| **Lv 1** | 140 | 4 s | 3 / knockback 25 |  |
| **Lv 2** | 160 | 4 s | 5 / knockback 50 |  |
| **Lv 3** | 180 | 4 s | 5 / knockback 75 | Fires an explosive bullet after 5 shots. The bullet detonates when it hits an enemy, damaging everything in the area. |
| **Lv 4** | 200 | 4 s | 5 / knockback 100 | Fires an explosive bullet after 3 shots. The bullet detonates when it hits an enemy, damaging everything in the area. |

Fires bullets in a fan-shaped spread, dealing damage to enemies and knocking them backward.
Normal Attack · Spread shot · targets Nearby Foes · range 550

#### Ark Machine Gun

| Rarity | ATK | Reload | Shots per reload | Skills |
|---|---|---|---|---|
| **Lv 1** | 200 | 6 s | 3 (1 at a time, 0.3 s apart) |  |
| **Lv 2** | 220 | 6 s | 3 (1 at a time, 0.3 s apart) | Gains a buff that increases ATK by 20% after 24 attacks with this weapon. This buff does not stack and is removed at the end of a wave. |
| **Lv 3** | 240 | 6 s | 3 (1 at a time, 0.3 s apart) | Gains a buff that increases ATK by 20% after 24 attacks with this weapon. This buff does not stack and is removed at the end of a wave.; Has a chance to fire an enhanced bullet that deals additional damage. (values: 40 / 50) |
| **Lv 4** | 260 | 6 s | 3 (1 at a time, 0.3 s apart) | Gains a buff that increases ATK by 20% after 24 attacks with this weapon. This buff does not stack and is removed at the end of a wave.; Has a chance to fire an enhanced bullet that deals additional damage. (values: 80 / 100) |

Fires bullets in quick succession, dealing damage to enemies.
Normal Attack · Bullets · targets Random · range 650

#### Ark Pistol

| Rarity | ATK | Reload | Shots per reload | Skills |
|---|---|---|---|---|
| **Lv 1** | 225 | 3.5 s | 1 |  |
| **Lv 2** | 275 | 3.5 s | 2 (1 at a time, 0.3 s apart) |  |
| **Lv 3** | 325 | 3.5 s | 2 (1 at a time, 0.3 s apart) | Has a chance to fire bullets that ignore monsters' DEF. (values: 75) |
| **Lv 4** | 375 | 3.5 s | 2 (1 at a time, 0.3 s apart) | Fires bullets that ignore monsters' DEF. (values: 100) |

Fires bullets, dealing damage to enemies.
Normal Attack · Bullets · targets Random · range 600

#### Ark Rifle

| Rarity | ATK | Reload | Shots per reload | Skills |
|---|---|---|---|---|
| **Lv 1** | 275 | 8 s | 1 / pierces |  |
| **Lv 2** | 325 | 8 s | 1 / pierces | Has a chance to fire bullets that ignore monsters' DEF. (values: 60) |
| **Lv 3** | 375 | 8 s | 1 / pierces | Has a chance to fire bullets that ignore monsters' DEF. (values: 70); Enemies hit by this weapon take damage over time (DoT) for a set period. (values: 300 / 60 / 30 / 1) |
| **Lv 4** | 425 | 8 s | 1 / pierces | Has a chance to fire bullets that ignore monsters' DEF. (values: 80); Enemies hit by this weapon take damage over time (DoT) for a set period. (values: 300 / 60 / 40 / 1) |

Fires bullets that pierce through enemies, dealing damage to them.
Pierce Attack · Bullets · targets Random · range 900

#### Ark Fire

| Rarity | ATK | Reload | Shots per reload | Skills |
|---|---|---|---|---|
| **Lv 1** | 60 | 6 s | 3 s cone (90°), hits every 0.5 s |  |
| **Lv 2** | 80 | 6 s | 3 s cone (90°), hits every 0.5 s |  |
| **Lv 3** | 100 | 6 s | 3 s cone (90°), hits every 0.3 s | Increases the attack range and creates a blaze zone that deals sustained damage within the attack area. (values: 400 / 80 / 50) |
| **Lv 4** | 120 | 6 s | 3 s cone (90°), hits every 0.3 s | Increases the attack range and creates a blaze zone that deals sustained damage within the attack area. (values: 400 / 40 / 50) |

Shoots flames across an area, dealing damage to enemies.
Area Attack · Cone attack · targets Nearby Foes · range 600

#### Ark Laser

| Rarity | ATK | Reload | Shots per reload | Skills |
|---|---|---|---|---|
| **Lv 1** | 275 | 7 s | 1 / pierces |  |
| **Lv 2** | 325 | 7 s | 1 / pierces, knockback 50 |  |
| **Lv 3** | 375 | 7 s | 1 / pierces, knockback 75 | Enemies hit by the laser get electrocuted. Electrocuted enemies take additional damage when hit. (values: 200 / 30) |
| **Lv 4** | 425 | 7 s | 1 / pierces, knockback 100 | Enemies hit by the laser get electrocuted. Electrocuted enemies take additional damage when hit. (values: 200 / 50) |

Shoots a laser that pierces through enemies, dealing damage to them.
Pierce Attack · Bullets · targets Random · range 800

#### Ark Grenade

| Rarity | ATK | Reload | Shots per reload | Skills |
|---|---|---|---|---|
| **Lv 1** | 200 | 4 s | 1 / explodes (radius 150) |  |
| **Lv 2** | 225 | 4 s | 1 / explodes (radius 150) | Creates an area in the wake of each explosion that reduces movement speed. (values: 300 / 250 / 10) |
| **Lv 3** | 250 | 4 s | 1 / explodes (radius 150) | Creates an area in the wake of each explosion that reduces movement speed. (values: 350 / 250 / 20 / 3 / 200 / 200) |
| **Lv 4** | 275 | 4 s | 1 / explodes (radius 150) | Creates an area in the wake of each explosion that reduces movement speed. (values: 400 / 300 / 30 / 5 / 200 / 200) |

Throws grenades that explode, dealing damage to enemies.
Area Attack · Explosive shell · targets Random · range 550

#### Supporter: Missile

| Rarity | ATK | Reload | Shots per reload | Skills |
|---|---|---|---|---|
| **Lv 1** | 250 | 7 s | 3 (1 at a time, 0.5 s apart) / explodes (radius 175) |  |
| **Lv 2** | 300 | 7 s | 4 (1 at a time, 0.5 s apart) / explodes (radius 200) | Fires a fragmenting missile after 3 shots. The missile explodes into 50 shards, dealing damage to enemies. |
| **Lv 3** | 325 | 7 s | 5 (1 at a time, 0.5 s apart) / explodes (radius 225) | Fires a fragmenting missile after 3 shots. The missile explodes into 60 shards, dealing damage to enemies. |
| **Lv 4** | 350 | 7 s | 6 (1 at a time, 0.5 s apart) / explodes (radius 250) | Fires a fragmenting missile after 4 shots. The missile explodes into 70 shards, dealing damage to enemies. |

Summons a robot with multi-barrel missile launchers that fire missiles at random areas, dealing damage to enemies.
Summon Attack · Missile barrage (robot) · targets Nearby Foes · range 700

#### Supporter: Boomerang

| Rarity | ATK | Reload | Shots per reload | Skills |
|---|---|---|---|---|
| **Lv 1** | 180 | 6 s | 1 / pierces |  |
| **Lv 2** | 120 | 6 s | 2 (1 at a time, 0.5 s apart) / pierces |  |
| **Lv 3** | 160 | 6 s | 2 (1 at a time, 0.5 s apart) / pierces | Boomerangs deal additional damage to enemies with a debuff. (values: 250 / 2) |
| **Lv 4** | 200 | 6 s | 2 (1 at a time, 0.5 s apart) / pierces | Boomerangs deal additional damage to enemies with a debuff. (values: 300 / 3) |

Summons a robot that shoots boomerangs. The boomerangs can pierce enemies, dealing damage to them, and return after traveling a certain distance.
Summon Attack · Boomerang (robot) · targets Random · range 600
Unlocks on day 15 of the event.

#### Ark Photon Cannon

| Rarity | ATK | Reload | Shots per reload | Skills |
|---|---|---|---|---|
| **Lv 1** | 50 | 6 s | 1 / pierces |  |
| **Lv 2** | 75 | 6 s | 1 / pierces | Deals sustained damage to enemies near the photon cannon. (values: 200 / 40 / 80 / 4) |
| **Lv 3** | 100 | 6 s | 1 / pierces | Deals sustained damage to enemies near the photon cannon. (values: 250 / 40 / 80 / 5); Enemies hit by the photon cannon get electrocuted. Electrocuted enemies take additional damage when hit. (values: 400 / 15) |
| **Lv 4** | 125 | 6 s | 1 / pierces | Deals sustained damage to enemies near the photon cannon. (values: 300 / 40 / 80 / 6); Enemies hit by the photon cannon get electrocuted. Electrocuted enemies take additional damage when hit. (values: 400 / 30) |

Fires piercing bullets that decelerate on impact, dealing sustained damage to enemies.
Area Attack · Slowing shot · targets Random · range 600
Unlocks on day 8 of the event.

#### Supporter: Blade

| Rarity | ATK | Reload | Shots per reload | Skills |
|---|---|---|---|---|
| **Lv 1** | 80 | 4 s | 1 / pierces |  |
| **Lv 2** | 60 | 4 s | 2 (1 at a time, 0.25 s apart) / pierces |  |
| **Lv 3** | 80 | 4 s | 2 (1 at a time, 0.25 s apart) / pierces | Enemies hit by the shurikens have reduced movement speed for a period of time. (values: 30 / 150) |
| **Lv 4** | 100 | 4 s | 2 (1 at a time, 0.25 s apart) / pierces | Enemies hit by the shurikens have reduced movement speed for a period of time. (values: 50 / 150) |

Summons a robot that shoots shurikens. The shurikens bounce off walls and pierce through enemies, dealing damage to them.
Summon Attack · Bouncing blades (robot) · targets Random · range 600

#### Supporter: Dual Pistols

| Rarity | ATK | Reload | Shots per reload | Skills |
|---|---|---|---|---|
| **Lv 1** | 100 | 4 s | 4 (2 at a time, 0.5 s apart) |  |
| **Lv 2** | 120 | 4 s | 4 (2 at a time, 0.5 s apart) | Fires an explosive bullet after 4 shot(s). |
| **Lv 3** | 140 | 4 s | 6 (2 at a time, 0.5 s apart) | Fires an explosive bullet after 4 shot(s).; Enemies hit by the dual pistols are afflicted with a DEF-reducing debuff for a period of time. (values: 70 / 40 / 350) |
| **Lv 4** | 160 | 4 s | 6 (2 at a time, 0.5 s apart) | Fires an explosive bullet after 2 shot(s).; Enemies hit by the dual pistols are afflicted with a DEF-reducing debuff for a period of time. (values: 90 / 50 / 350) |

Summons a robot with dual pistols that fire two bullets in quick succession, dealing damage to enemies.
Summon Attack · Twin pistols (robot) · targets Nearby Foes · range 600

### Sub-weapons

Sub-weapons do not attack; they give a bonus while they sit in the inventory.

| Sub-weapon | Shape | Lv 1 | Lv 2 | Lv 3 | Lv 4 |
|---|---|---|---|---|---|
| Data Chip;  (A chip containing combat data.) | `■`; `■` | Increases EXP gained from killing enemies by 10%. | Increases EXP gained from killing enemies by 20%. | Increases EXP gained from killing enemies by 30%. | Increases EXP gained from killing enemies by 40%. |
| Jewel;  (A shiny jewel.) | `■` | Increases gold gained from killing enemies by 5%. | Increases gold gained from killing enemies by 10%. | Increases gold gained from killing enemies by 15%. | Increases gold gained from killing enemies by 20%. |
| Grip;  (A grip that helps reduce recoil.) | `■■`; `■·` | Increases damage by 5%. | Increases damage by 10%. | Increases damage by 15%. | Increases damage by 20%. |
| Barricade;  (A sturdy barricade made of steel plates.) | `■■■` | Increases the barricade's HP by 20%.; Reflects damage back at attackers when the barricade is hit. (values: 150) | Increases the barricade's HP by 25%.; Reflects damage back at attackers when the barricade is hit. (values: 200) | Increases the barricade's HP by 30%.; Reflects damage back at attackers when the barricade is hit. (values: 250) | Increases the barricade's HP by 35%.; Reflects damage back at attackers when the barricade is hit. (values: 300) |
| Tool Set;  (A tool set used for repairing the barricade.) | `■■`; `■■` | Restores 100 of the barricade's HP every 15 sec. | Restores 150 of the barricade's HP every 15 sec. | Restores 200 of the barricade's HP every 15 sec. | Restores 250 of the barricade's HP every 15 sec. |
| Battlizer;  (A battlizer that enhances weapons.) | `■`; `■`; `■` | Increases critical rate by 10%. | Increases critical rate by 15%. | Increases critical rate by 20%. | Increases critical rate by 25%. |
| Dual Sensors;  (Dual sensors that improve precision when shooting.) | `■■■` | Increases critical damage multiplier by 12%. | Increases critical damage multiplier by 18%. | Increases critical damage multiplier by 24%. | Increases critical damage multiplier by 30%. |
| Energy Core;  (An energy core that can grant great power, but may overheat.) | `■`; `■`; `■` | Increases damage by 10%.; Decreases the barricade's HP by 4%. | Increases damage by 20%.; Decreases the barricade's HP by 8%. | Increases damage by 30%.; Decreases the barricade's HP by 12%. | Increases damage by 40%.; Decreases the barricade's HP by 16%. |

### Shop odds

After every wave the shop offers 3 weapons. The shop tier (which grows with the wave) sets the odds.

#### Shop rules

- **Weapons offered**: 3 per visit; unused ones vanish when the next wave starts
- **Free refreshes**: 5 per run, then 1,000 gold each
- **Weapon removals**: 3 per run (a removed weapon no longer appears)
- **Trait refreshes**: 3 per run
- **Storage**: Up to 10 weapons kept outside the inventory

#### Rarity of offered weapons

| Tier | Waves | Lv 1 | Lv 2 | Lv 3 | Lv 4 |
|---|---|---|---|---|---|
| **1** | 1–4 | 100% | 0% | 0% | 0% |
| **2** | 5–8 | 100% | 0% | 0% | 0% |
| **3** | 9–11 | 98% | 2% | 0% | 0% |
| **4** | 12–14 | 96.2% | 3.8% | 0% | 0% |
| **5** | 15–17 | 94.3% | 5.7% | 0% | 0% |
| **6** | 18–20 | 92.6% | 7.4% | 0% | 0% |
| **7** | 21–23 | 90.9% | 9.1% | 0% | 0% |
| **8** | 24–26 | 89.9% | 9% | 0.9% | 0.2% |
| **9** | 27–29 | 88.8% | 8.9% | 1.8% | 0.5% |
| **10** | 30–100 | 87.7% | 8.8% | 2.6% | 0.9% |

The chance that an offered weapon comes at each rarity, from the tier’s weights (before the “higher-rarity weapons” upgrade).

#### Which weapon is offered

| Weapon | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Tier 5 | Tier 6 | Tier 7 | Tier 8 | Tier 9 | Tier 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Ark Bowgun | 6.1% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% |
| Ark Submachine Gun | 6.1% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% |
| Ark Launcher | 6.1% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% |
| Ark Shotgun | 6.1% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% |
| Ark Machine Gun | 6.1% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% |
| Ark Pistol | 6.1% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% |
| Ark Rifle | 6.1% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% |
| Ark Fire | 6.1% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% |
| Ark Laser | 6.1% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% |
| Ark Grenade | 6.1% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% |
| Supporter: Missile | 6.1% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% |
| Supporter: Boomerang | 6.1% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% |
| Ark Photon Cannon | 6.1% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% |
| Supporter: Blade | 6.1% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% |
| Supporter: Dual Pistols | 6.1% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% | 6% |
| Data Chip | 1% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% |
| Jewel | 1% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% |
| Grip | 1% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% |
| Barricade | 1% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% |
| Tool Set | 1% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% |
| Battlizer | 1% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% |
| Dual Sensors | 1% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% |
| Energy Core | 1% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% | 1.2% |

Each weapon’s weight against all the others in the tier. Removed weapons and weapons not yet available drop out, so the real odds of the rest are a little higher. (The table also has a second weight per weapon whose use is unclear.)

## Upgrades

### Traits

Pick one at each level-up. Ordinary traits can be taken again; unique ones once per run. Higher phases are stronger but rarer.

#### Trait list

| Trait | Phase | Effect | Applies to | Type | From Lv | Weight |
|---|---|---|---|---|---|---|
| Increased EXP I | I | Increases EXP gained from killing monsters by 5%. |  | Ordinary | 1 | 200 |
| Increased EXP II | II | Increases EXP gained from killing monsters by 7%. |  | Ordinary | 1 | 100 |
| Increased EXP III | III | Increases EXP gained from killing monsters by 10%. |  | Ordinary | 1 | 50 |
| Increased Gold I | I | Increases gold gained from killing monsters by 5%. |  | Ordinary | 1 | 200 |
| Increased Gold II | II | Increases gold gained from killing monsters by 10%. |  | Ordinary | 1 | 100 |
| Increased Gold III | III | Increases gold gained from killing monsters by 15%. |  | Ordinary | 1 | 50 |
| Increased Damage I | I | Increases all main weapons' damage by 10%. |  | [Unique] | 5 | 50 |
| Increased Damage II | II | Increases all main weapons' damage by 12%. |  | [Unique] | 5 | 20 |
| Increased Damage III | III | Increases all main weapons' damage by 15%. |  | [Unique] | 5 | 10 |
| Increased Range I | I | Increases initial attack range by 10%. |  | [Unique] | 1 | 50 |
| Increased Range II | II | Increases initial attack range by 12%. |  | [Unique] | 1 | 20 |
| Increased Range III | III | Increases initial attack range by 15%. |  | [Unique] | 1 | 10 |
| Increased Area Attack Damage I | I | Increases area damage by 5%. | Ark Launcher, Ark Fire, Ark Grenade, Ark Photon Cannon | Ordinary | 1 | 200 |
| Increased Area Attack Damage II | II | Increases area damage by 7%. | Ark Launcher, Ark Fire, Ark Grenade, Ark Photon Cannon | Ordinary | 1 | 100 |
| Increased Area Attack Damage III | III | Increases area damage by 10%. | Ark Launcher, Ark Fire, Ark Grenade, Ark Photon Cannon | Ordinary | 1 | 50 |
| Increased Normal Attack Damage I | I | Increases normal attack damage by 5% | Ark Submachine Gun, Ark Shotgun, Ark Machine Gun, Ark Pistol | Ordinary | 1 | 200 |
| Increased Normal Attack Damage II | II | Increases normal attack damage by 7% | Ark Submachine Gun, Ark Shotgun, Ark Machine Gun, Ark Pistol | Ordinary | 1 | 100 |
| Increased Normal Attack Damage III | III | Increases normal attack damage by 10% | Ark Submachine Gun, Ark Shotgun, Ark Machine Gun, Ark Pistol | Ordinary | 1 | 50 |
| Increased Pierce Attack Damage I | I | Increases pierce attack damage by 5%. | Ark Bowgun, Ark Rifle, Ark Laser | Ordinary | 1 | 200 |
| Increased Pierce Attack Damage II | II | Increases pierce attack damage by 7%. | Ark Bowgun, Ark Rifle, Ark Laser | Ordinary | 1 | 100 |
| Increased Pierce Attack Damage III | III | Increases pierce attack damage by 10%. | Ark Bowgun, Ark Rifle, Ark Laser | Ordinary | 1 | 50 |
| Reduced Area Attack Reload Time I | I | Reduces reload time for area attacks by 3%. | Ark Launcher, Ark Fire, Ark Grenade, Ark Photon Cannon | Ordinary | 1 | 50 |
| Reduced Area Attack Reload Time II | II | Reduces reload time for area attacks by 5%. | Ark Launcher, Ark Fire, Ark Grenade, Ark Photon Cannon | Ordinary | 1 | 20 |
| Reduced Area Attack Reload Time III | III | Reduces reload time for area attacks by 10%. | Ark Launcher, Ark Fire, Ark Grenade, Ark Photon Cannon | Ordinary | 1 | 10 |
| Reduced Normal Attack Reload Time I | I | Reduces reload time for normal attacks by 3%. | Ark Submachine Gun, Ark Shotgun, Ark Machine Gun, Ark Pistol | Ordinary | 1 | 50 |
| Reduced Normal Attack Reload Time II | II | Reduces reload time for normal attacks by 5%. | Ark Submachine Gun, Ark Shotgun, Ark Machine Gun, Ark Pistol | Ordinary | 1 | 20 |
| Reduced Normal Attack Reload Time III | III | Reduces reload time for normal attacks by 10%. | Ark Submachine Gun, Ark Shotgun, Ark Machine Gun, Ark Pistol | Ordinary | 1 | 10 |
| Reduced Pierce Attack Reload Time I | I | Reduces reload time for pierce attacks by 3%. | Ark Bowgun, Ark Rifle, Ark Laser | Ordinary | 1 | 50 |
| Reduced Pierce Attack Reload Time II | II | Reduces reload time for pierce attacks by 5%. | Ark Bowgun, Ark Rifle, Ark Laser | Ordinary | 1 | 20 |
| Reduced Pierce Attack Reload Time III | III | Reduces reload time for pierce attacks by 10%. | Ark Bowgun, Ark Rifle, Ark Laser | Ordinary | 1 | 10 |

(21 more rows of 51 not shown; see the data table.)

Weight is how likely the trait is against the others of its phase. "From Lv" is the character level it can first appear at.

### Permanent upgrades

Bought with gold outside a run; they apply to every run. Reset refunds all the gold spent.

| Upgrade | Level | Effect | Cost (gold) |
|---|---|---|---|
| Increased EXP;  (Increases EXP gained from killing monsters.) | 1 | +10% EXP | 5,000 |
|  | 2 | +20% EXP | 7,000 |
|  | 3 | +30% EXP | 10,000 |
|  | 4 (max) | +40% EXP | 12,000 |
| Increased Gold;  (Increases gold gained from killing monsters.) | 1 | +50 / 100 / 150 (probably minion / elite / boss gold; unit not stated) | 5,000 |
|  | 2 | +60 / 120 / 180 (probably minion / elite / boss gold; unit not stated) | 7,000 |
|  | 3 | +70 / 140 / 210 (probably minion / elite / boss gold; unit not stated) | 10,000 |
|  | 4 (max) | +80 / 160 / 240 (probably minion / elite / boss gold; unit not stated) | 12,000 |
| Increased ATK;  (Increases the ATK of all main weapons.) | 1 | +5% weapon ATK | 10,000 |
|  | 2 | +10% weapon ATK | 12,000 |
|  | 3 | +15% weapon ATK | 15,000 |
|  | 4 (max) | +20% weapon ATK | 18,000 |
| Higher-Rarity Weapons in Shop;  (Higher-rarity main weapons may appear in the shop.) | 1 | Shop weight +15 for Lv 2 | 15,000 |
|  | 2 | Shop weight +20 for Lv 2 | 20,000 |
|  | 3 | Shop weight +25 for Lv 2, +5 for Lv 3 | 25,000 |
|  | 4 (max) | Shop weight +30 for Lv 2, +10 for Lv 3 | 30,000 |
| Additional Weapon Removals;  (Increases the number of weapons you can remove from the shop.) | 1 | +1 weapon removal(s) | 15,000 |
|  | 2 | +2 weapon removal(s) | 20,000 |
|  | 3 | +3 weapon removal(s) | 25,000 |
|  | 4 (max) | +4 weapon removal(s) | 30,000 |
| Additional Shop Refreshes;  (Increases the number of times you can refresh the shop.) | 1 | +2 free shop refreshes | 20,000 |
|  | 2 | +3 free shop refreshes | 25,000 |
|  | 3 | +4 free shop refreshes | 30,000 |
|  | 4 (max) | +5 free shop refreshes | 35,000 |
| Additional Trait Refreshes;  (Increases the number of times you can refresh when selecting traits.) | 1 | +2 trait refreshes | 20,000 |
|  | 2 | +3 trait refreshes | 25,000 |
|  | 3 | +4 trait refreshes | 30,000 |
|  | 4 (max) | +5 trait refreshes | 35,000 |
| Increased Barricade HP;  (Increases the barricade's HP.) | 1 | +3,000 barricade HP | 5,000 |
|  | 2 | +5,000 barricade HP | 7,000 |

(9 more rows of 39 not shown; see the data table.)

#### Total to max everything

- **Gold**: 681,000

## Battle

### Monsters

Base stats; every wave multiplies HP, ATK, DEF and speed by its own ratios (see Waves).

| Monster | Type | Attack | Skill | HP | ATK | DEF | Speed | Attack every | Range |
|---|---|---|---|---|---|---|---|---|---|
| Minion #1 (10101) | [Minion] | Melee |  | 280 | 100 | 10 | 40 | 2 s | 10 |
| Minion #2 (10201) | [Minion] | Ranged |  | 280 | 100 | 10 | 40 | 2 s | 300 |
| Minion #3 (10301) | [Minion] | Melee |  | 420 | 100 | 10 | 40 | 2 s | 10 |
| Minion #4 (10401) | [Minion] | Ranged | Raises its DEF (values 5 / 1500 / 500) | 420 | 100 | 10 | 40 | 2 s | 300 |
| Minion #4 (10402) | [Minion] | Ranged | Raises its DEF (values 5 / 1500 / 500) | 490 | 100 | 10 | 40 | 2 s | 300 |
| Minion #5 (10501) | [Minion] | Ranged |  | 420 | 100 | 10 | 40 | 2 s | 300 |
| Minion #6 (10601 · size 250) | [Minion] | Melee | Splits into 3 × Minion #6 (split) | 560 | 100 | 10 | 40 | 2 s | 10 |
| Minion #6 (split) (10602 · size 150) | [Minion] | Melee |  | 140 | 30 | 5 | 40 | 2 s | 10 |
| Minion #6 (10611 · size 250) | [Minion] | Melee | Splits into 4 × Minion #6 (split) | 700 | 100 | 10 | 40 | 2 s | 10 |
| Minion #6 (split) (10612 · size 150) | [Minion] | Melee |  | 210 | 30 | 5 | 40 | 2 s | 10 |
| Minion #6 (10621 · size 250) | [Minion] | Melee | Splits into 5 × Minion #6 (split) | 840 | 100 | 10 | 40 | 2 s | 10 |
| Minion #6 (split) (10622 · size 150) | [Minion] | Melee |  | 280 | 30 | 5 | 40 | 2 s | 10 |
| Minion #7 (10701) | [Minion] | Ranged | Raises its DEF (values 2 / 1500 / 500) | 700 | 50 | 10 | 40 | 2 s | 300 |
| Elite #4 (20101 · size 350) | [Elite] | Ranged | Raises its DEF (values 2 / 1000 / 500) | 3,000 | 150 | 10 | 35 | 2 s | 300 |
| Elite #6 (20201 · size 350) | [Elite] | Melee | Splits into 5 × Elite #6 (split) | 5,000 | 150 | 20 | 35 | 2 s | 10 |
| Elite #6 (split) (20202 · size 150) | [Elite] | Melee |  | 500 | 150 | 5 | 35 | 2 s | 10 |
| Elite #6 (20211 · size 350) | [Elite] | Melee | Splits into 5 × Elite #6 (split) | 2,000 | 150 | 20 | 35 | 2 s | 10 |
| Elite #6 (split) (20212 · size 150) | [Elite] | Melee |  | 300 | 150 | 5 | 35 | 2 s | 10 |
| Elite #7 (20301 · size 400) | [Elite] | Ranged | Raises its DEF (values 10 / 1000 / 500) | 4,000 | 150 | 20 | 30 | 2 s | 300 |
| Elite #7 (20311 · size 400) | [Elite] | Ranged | Raises its DEF (values 10 / 1000 / 500) | 2,000 | 150 | 20 | 30 | 2 s | 300 |
| Boss #8 (30101 · size 500) | [Boss] | Melee |  | 3,000 | 250 | 10 | 20 | 3 s | 10 |
| Boss #9 (30201 · size 380) | [Boss] | Ranged | Raises its DEF (values 5 / 500 / 500) | 3,000 | 250 | 10 | 20 | 3 s | 300 |
| Boss #10 (30301 · size 400) | [Boss] | Melee | Raises its DEF (values 5 / 500 / 500) | 3,500 | 250 | 15 | 20 | 3 s | 10 |

Attack interval in seconds; range and speed in game units. Splitting monsters burst into the listed number of small ones when killed.

### Waves

Survive all 100 waves. Elites and bosses come on fixed waves; the shop opens after each one.

| Wave | Spawns | Elites / bosses | Last spawn | HP | ATK | DEF | Speed | Points & gold | Burst | Tier | Also |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **1** | 10 |  | 24.5 s | 20% | 100% | 1% | 100% | 100% | 100% | 1 |  |
| **2** | 12 |  | 30.5 s | 20% | 100% | 1% | 100% | 100% | 100% | 1 |  |
| **3** | 14 |  | 23.5 s | 25% | 100% | 1% | 100% | 100% | 100% | 1 | +6 inventory points |
| **4** | 16 |  | 30.5 s | 35% | 100% | 5% | 100% | 100% | 100% | 1 |  |
| **5** | 21 | [Elite #4] | 30.5 s | 50% | 100% | 10–100% | 100% | 100% | 100% | 2 |  |
| **6** | 21 |  | 30.5 s | 65% | 100% | 15% | 100% | 100% | 100% | 2 | +6 inventory points |
| **7** | 21 |  | 30.5 s | 80% | 100% | 20% | 100% | 100% | 100% | 2 |  |
| **8** | 21 |  | 30.5 s | 90% | 100% | 25% | 100% | 100% | 100% | 2 |  |
| **9** | 21 |  | 30.5 s | 100% | 100% | 30% | 100% | 100% | 100% | 3 | +6 inventory points |
| **10** | 21 | [Boss #8] | 30.5 s | 100% | 100% | 35% | 100% | 100% | 100% | 3 |  |
| **11** | 25 |  | 37.5 s | 140% | 130% | 40% | 100% | 110% | 150% | 3 | new area (2) |
| **12** | 25 |  | 37.5 s | 170% | 130% | 45% | 100% | 110% | 150% | 4 | +6 inventory points |
| **13** | 25 |  | 37.5 s | 200% | 130% | 50% | 100% | 110% | 150% | 4 |  |
| **14** | 25 |  | 37.5 s | 230% | 130% | 55% | 100% | 110% | 150% | 4 |  |
| **15** | 25 | [Elite #7] | 37.5 s | 260% | 130% | 60% | 100% | 110% | 150% | 5 | +6 inventory points |
| **16** | 25 |  | 37.5 s | 290% | 130% | 65% | 100% | 110% | 200% | 5 |  |
| **17** | 25 |  | 37.5 s | 320% | 130% | 70% | 100% | 110% | 200% | 5 |  |
| **18** | 25 |  | 37.5 s | 350% | 130% | 75% | 100% | 110% | 300% | 6 | +6 inventory points |
| **19** | 25 |  | 37.5 s | 380% | 130% | 80% | 100% | 110% | 300% | 6 |  |
| **20** | 24 | [Boss #9]; [Elite #7] | 37.5 s | 410% | 130% | 85% | 100% | 110% | 300% | 6 |  |
| **21** | 29 |  | 44.5 s | 500% | 150% | 90% | 100% | 120% | 300% | 7 | +6 inventory points / new area (3) |
| **22** | 29 |  | 44.5 s | 550% | 150% | 95% | 100% | 120% | 400% | 7 |  |
| **23** | 29 |  | 44.5 s | 600% | 150% | 100% | 100% | 120% | 400% | 7 |  |
| **24** | 29 |  | 44.5 s | 650% | 150% | 105% | 100% | 120% | 500% | 8 | +6 inventory points |
| **25** | 29 | [Elite #6] | 44.5 s | 700% | 150% | 110% | 100% | 120% | 500% | 8 |  |
| **26** | 29 |  | 44.5 s | 750% | 150% | 115% | 100% | 120% | 600% | 8 |  |
| **27** | 29 |  | 44.5 s | 800% | 150% | 120% | 100% | 120% | 600% | 9 | +6 inventory points |
| **28** | 29 |  | 44.5 s | 850% | 150% | 125% | 100% | 120% | 600% | 9 |  |
| **29** | 29 |  | 44.5 s | 950% | 150% | 130% | 100% | 120% | 700% | 9 |  |
| **30** | 29 | [Boss #10]; [Elite #6] | 44.5 s | 1,050% | 150% | 125–175% | 100% | 120% | 800% | 10 |  |

(70 more rows of 100 not shown; see the data table.)

Spawns: monsters in the wave. Last spawn: when the last one appears. HP / ATK / DEF / Speed: the wave’s multiplier on the monsters’ base stats. Points & gold: multiplier on what kills give. Burst: multiplier on Burst Skill damage. Tier: the shop tier used after the wave.

## Rewards

### Challenges

One-time challenges; progress adds up over all your runs unless the text says “in a run”.

#### Daily reward

- **Score 1,000 in a run**: Gem ×30

| Challenge | Reward |
|---|---|
| Challenge - Accumulate 10,000 remaining gold in total | Skill Manual I ×180 |
| Challenge - Accumulate 30,000 remaining gold in total | Skill Manual II ×120 |
| Challenge - Accumulate 50,000 remaining gold in total | Skill Manual III ×60 |
| Challenge - Accumulate 70,000 remaining gold in total | FIGHT! ARK RANGER! Premium Sticker I ×1 |
| Challenge - Use skills 15 times | Burst Manual I ×90 |
| Challenge - Use skills 40 times | Burst Manual II ×60 |
| Challenge - Use skills 70 times | Burst Manual III ×30 |
| Challenge - Use skills 100 times | FIGHT! ARK RANGER! Premium Sticker II ×1 |
| Challenge - Earn 20,000 points in a run | Central Government Supply Chest I ×7 |
| Challenge - Earn 40,000 points in a run | Ultra-Double Boost Module ×10 |
| Challenge - Earn 60,000 points in a run | Central Government Supply Chest I ×7 |
| Challenge - Earn 80,000 points in a run | Ultra-Double Boost Module ×10 |
| Challenge - Play as Ark Leon: Leon Shooter 3 times | Attacker Common Console ×30 |
| Challenge - Play as Ark Leon: Lander Arm 3 times | Defender Common Console ×30 |
| Challenge - Play as Ark Leon: Falcon Wings 3 times | Supporter Common Console ×30 |
| Challenge - Play as Ark Leon: Lander Pack 3 times | Central Government Supply Chest I ×7 |
| Challenge - Play as Ark Buster 3 times | Ultra-Double Boost Module ×10 |

### Collection

Weapons are added to the collection once you obtain them.

- Ark Submachine Gun
- Ark Launcher
- Ark Bowgun
- Ark Shotgun
- Ark Machine Gun
- Ark Pistol
- Ark Rifle
- Ark Fire
- Ark Laser
- Ark Grenade
- Supporter: Missile
- Supporter: Boomerang
- Ark Photon Cannon
- Supporter: Blade
- Supporter: Dual Pistols
- Data Chip
- Jewel
- Grip
- Barricade
- Tool Set
- Battlizer
- Dual Sensors
- Energy Core

## Data sources

All in `D:\Nikke Datamine\mpkparser\jsons` as `<Table>.json`.

| Table | Rows | Fields |
|---|---|---|
| `EventFARManagerTable` | 1 | `id`, `event_id`, `enter_scenario`, `minigame_type`, `character_group_id`, `use_wave_group_id`, `background_group_id`, `barricade_resource`, `background_fog_resource`, `character_monster_min_distance`, `default_exp_ratio`, `minion_exp`, `elite_exp`, `boss_exp`, `minion_point`, `elite_point`, `boss_point`, `minion_drop_gold`, `elite_drop_gold`, `boss_drop_gold`, `critical_probability`, `critical_damage_ratio`, `same_weapon_group_shoot_delay`, `default_shop_item_count`, `maximum_keep_weapon_count`, `default_reroll_count`, `gold_reroll_use_gold`, `default_ban_weapon_count`, `passive_reroll_default_count`, `min_reload_cooltime`, `enhance_group_id`, `collection_group_id`, `ingame_passive_select_row`, `start_background_resource`, `minion_knock_back_cooltime`, `elite_knock_back_cooltime`, `boss_knock_back_cooltime`, `daily_mission_point`, `daily_mission_reward`, `score_limit_per_game` |
| `EventFARMissionTable` | 17 | `id`, `manager_id`, `condition_type`, `condition_id`, `condition_value`, `name_localkey`, `order`, `reward_id` |
| `EventFARTutorialTable` | 4 | `id`, `manager_id`, `tutorial_page_id`, `tutorial_output_type`, `tutorial_output_value`, `tutorial_title_localkey` |
| `EventFARBackGroundTable` | 2 | `id`, `group_id`, `background_resource`, `use_fog`, `barricade_resource`, `change_background_wave_id` |
| `EventFARCharacterTable` | 5 | `id`, `group_id`, `ui_character_resource`, `character_resource`, `character_weapon_resource`, `name_locale`, `skill_name_locale`, `skill_description_locale`, `skill_icon`, `open_date`, `open_condition_locale`, `start_hp`, `character_exp_group`, `skill_type`, `skill_value`, `skill_resource`, `skill_infinity`, `skill_cooltime`, `skill_cutscene_resource`, `default_weapon`, `inventory_group_id` |
| `EventFARCharacterLevelTable` | 40 | `id`, `group_id`, `lv`, `min_lv`, `max_lv`, `exp`, `level_up_select_passive_id` |
| `EventFARCollectionTable` | 23 | `id`, `group_id`, `weapon_id`, `order` |
| `EventFARInGamePassiveTable` | 8 | `id`, `first_slot_use_passive_group_id`, `second_slot_use_passive_group_id`, `third_slot_use_passive_group_id`, `fourth_slot_use_passive_group_id` |
| `EventFARInventoryTable` | 45 | `id`, `group_id`, `row_number`, `slot` |
| `EventFARMonsterTable` | 23 | `id`, `monster_resource`, `monster_size`, `monster_type`, `monster_atk_type`, `monster_skill_type`, `monster_skill_value`, `monster_skill_resource`, `projectile_resource`, `projectile_speed`, `monster_move_speed`, `monster_hp`, `show_hp`, `monster_atk`, `monster_def`, `monster_atk_cooltime`, `monster_atk_range`, `dead_fx_resource` |
| `EventFAROutGamePassiveTable` | 10 | `id`, `group_id`, `use_passive_group_id` |
| `EventFARPassiveTable` | 90 | `id`, `group_id`, `passive_type`, `passive_icon`, `name_locale`, `skill_type`, `passive_skill_value`, `skill_locale`, `link_weapon_group_id`, `passive_level`, `max_level`, `level_up_cost`, `repeated_acquisition`, `appearance_able_character_level`, `appearance_value`, `add_appearance_value` |
| `EventFARShopTable` | 230 | `id`, `group_id`, `use_weapon_id`, `weapon_appearance_value`, `level_1_appearance_value`, `level_2_appearance_value`, `level_3_appearance_value`, `level_4_appearance_value`, `add_weapon_appearance_value` |
| `EventFARWaveTable` | 101 | `id`, `group_id`, `is_setting_step`, `is_final_wave`, `wave_order`, `wave_preset_group_id`, `is_inventory_upgrade`, `inventory_upgrade_point`, `is_open_shop`, `shop_group_id`, `point_and_gold_ratio`, `burst_skill_damage_ratio` |
| `EventFARWavePresetTable` | 2771 | `id`, `group_id`, `spawn_monster_id`, `random_spawn`, `spawn_point`, `boss_spawn`, `monster_spawn_time`, `monster_hp_ratio`, `monster_atk_ratio`, `monster_def_ratio`, `monster_move_speed_ratio` |
| `EventFARWeaponTable` | 92 | `id`, `group_id`, `name_locale`, `description_locale`, `weapon_resource`, `weapon_icon`, `weapon_size`, `weapon_open_date`, `weapon_level`, `max_level`, `weapon_type`, `focus_target_type`, `weapon_atk_type`, `weapon_tag`, `weapon_attacker`, `fire_fx_resource`, `proj_resource`, `proj_hit_resource`, `proj_life_time`, `proj_speed`, `proj_return_distance`, `change_proj_speed`, `proj_size`, `one_shot_proj_amount`, `total_proj_amount`, `proj_atk_term`, `proj_pierce`, `proj_knockback_value`, `proj_random_bombing_distance`, `contact_explosion`, `explosion_range`, `explosion_resource`, `range_atk_resource`, `range_atk_range`, `range_atk_duration`, `range_atk_term`, `range_atk_angle`, `weapon_atk`, `weapon_reload_time`, `atk_start_range`, `skill_data_01`, `skill_data_02` |
| `EventFARWeaponShapeTable` | 52 | `id`, `group_id`, `row_number`, `slot` |

The viewer also reads: `MinigameHelpTipDescTable`.

## Uncertain / unknown

- )} (probably minion / elite / boss gold; unit not stated)
- Each weapon’s weight against all the others in the tier. Removed weapons and weapons not yet available drop out, so the real odds of the rest are a little higher. (The table also has a second weight per weapon whose use is unclear.)
