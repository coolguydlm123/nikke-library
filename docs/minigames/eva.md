# EVANGELION: RedSea Scout

A bullet-hell shooter: steer an Evangelion through enemy barrages, shoot down Raptures and giant “Mimicry” bosses, and raise A.T. Field with the damage you deal. Stars and materials from each stage upgrade your parts.

This guide was generated from the Nikke Library's reading of the game data: the viewer `lib/eventgames/eva.js` turns the `Event*` tables in `D:\Nikke Datamine\mpkparser\jsons` into the rules below. Numbers, units and formulas are the viewer's readings; anything it was not sure of is listed under "Uncertain / unknown". Long lists are cut to 30 rows.

## Overview

### The game

- **Title**: EVANGELION: RedSea Scout
- **Story**: story "That name is Evangelion: A" (`event_exnii1_03_s`); story "The Name is Evangelion: B" (`event_exnii1_03_e`)
- **Event period**: 2025-02-19 16:00 to 2025-03-12 19:59; new stages opened day by day
- **Controls**: Drag anywhere on the screen to move; the Evangelion and its extra weapon shoot on their own
- **Getting hit**: Only hits on the cockpit count
- **A.T. Field**: Dealing damage charges it; when full you can use it. Each Evangelion’s A.T. Field works differently
- **Score**: Base score for kills plus a collection score for the score items enemies drop
- **Stars**: 1 star for clearing a stage, 2 and 3 stars for reaching its score targets
- **Starting setup**: Mark.09 with Extra Weapon - Artillery Type

### Materials

| Item | Use |
|---|---|
| **Mighty Equipment Box** | High-performance components salvaged from the battlefield that are immensely powerful. Deliver to the Mighty Tool Squad to enhance combat performance. |
| **Mighty Tools** | Versatile components salvaged from the battlefield that are simple, yet useful. Deliver to the Mighty Tool Squad to enhance combat performance. |

## Stages

### Stages

Each stage opens on its date once the previous one is cleared. Clear rewards come every time; first-clear rewards once.

#### EASY

| Stage | Opens | Needs | Boss / elite | 2★ | 3★ | Clear reward | First clear |
|---|---|---|---|---|---|---|---|
| **Q.S. 01** | 2025-02-19 16:00 | An event story stage (see the event) | E-Cutter | 12,000 | 18,000 | Mighty Tools ×3 | Mighty Equipment Box ×1; Mighty Tools ×3; story "That name is Evangelion: A" (`event_exnii1_03_s`); story "The Name is Evangelion: B" (`event_exnii1_03_e`) |
| **Q.S. 02** | 2025-02-19 16:00 | Clear Q.S. 01 | E-Arkanoid | 14,000 | 21,000 | Mighty Tools ×3 | Mighty Equipment Box ×1; Mighty Tools ×3; Extra Weapon - Artillery Type ×1 |
| **Q.S. 03** | 2025-02-19 16:00 | Clear Q.S. 02 | E-Arkanoid | 20,000 | 30,000 | Mighty Tools ×3 | Mighty Equipment Box ×1; Mighty Tools ×3 |
| **Q.S. 04** | 2025-02-19 16:00 | Clear Q.S. 03 | Mimicry - Mother Whale | 25,000 | 38,000 | Mighty Tools ×4 | Mighty Equipment Box ×1; Mighty Tools ×4 |
| **Q.S. 05** | 2025-02-20 20:00 | Clear Q.S. 04 | E-Arkanoid | 17,000 | 25,000 | Mighty Tools ×4 | Mighty Equipment Box ×1; Mighty Tools ×4; Modified Unit Eight γ ×1 |
| **Q.S. 06** | 2025-02-20 20:00 | Clear Q.S. 05 | E-Cutter | 21,000 | 31,000 | Mighty Tools ×4 | Mighty Equipment Box ×1; Mighty Tools ×4 |
| **Q.S. 07** | 2025-02-20 20:00 | Clear Q.S. 06 | Mimicry - Massive Object Q | 25,000 | 37,000 | Mighty Tools ×4 | Mighty Equipment Box ×1; Mighty Tools ×4 |
| **Q.S. 08** | 2025-02-20 20:00 | Clear Q.S. 07 | Mimicry - Massive Object Q | 16,000 | 24,000 | Mighty Tools ×5 | Mighty Equipment Box ×1; Mighty Tools ×5 |
| **Q.S. 09** | 2025-02-21 20:00 | Clear Q.S. 08 | E-Tripod | 32,000 | 48,000 | Mighty Tools ×5 | Mighty Equipment Box ×1; Mighty Tools ×5; New Unit Two α ×1 |
| **Q.S. 10** | 2025-02-21 20:00 | Clear Q.S. 09 | E-Tripod | 29,000 | 44,000 | Mighty Tools ×5 | Mighty Equipment Box ×1; Mighty Tools ×5; Extra Weapon - Assault Type ×1 |
| **Q.S. 11** | 2025-02-21 20:00 | Clear Q.S. 10 | Mimicry - Modernia | 33,000 | 49,000 | Mighty Tools ×5 | Mighty Equipment Box ×1; Mighty Tools ×5 |
| **Q.S. 12** | 2025-02-21 20:00 | Clear Q.S. 11 | Mimicry - Modernia | 16,000 | 24,000 | Mighty Tools ×6 | Mighty Equipment Box ×1; Mighty Tools ×6 |

#### HARD

| Stage | Opens | Needs | Boss / elite | 2★ | 3★ | Clear reward | First clear |
|---|---|---|---|---|---|---|---|
| **A.E. 01** | 2025-02-22 20:00 | Clear Q.S. 12 | Mimicry - Mother Whale | 25,000 | 40,000 | Mighty Tools ×6 | Mighty Equipment Box ×1; Mighty Tools ×6 |
| **A.E. 02** | 2025-02-22 20:00 | Clear A.E. 01 | Mimicry - Grave Digger | 27,000 | 45,000 | Mighty Tools ×6 | Mighty Equipment Box ×1; Mighty Tools ×6 |
| **A.E. 03** | 2025-02-22 20:00 | Clear A.E. 02 | Mimicry - Grave Digger | 16,000 | 26,000 | Mighty Tools ×6 | Mighty Equipment Box ×1; Mighty Tools ×6 |
| **A.E. 04** | 2025-02-23 20:00 | Clear A.E. 03 | Mimicry - Massive Object Q | 22,000 | 35,000 | Mighty Tools ×6 | Mighty Equipment Box ×1; Mighty Tools ×6 |
| **A.E. 05** | 2025-02-23 20:00 | Clear A.E. 04 | Mimicry - Kraken | 38,000 | 63,000 | Mighty Tools ×7 | Mighty Equipment Box ×1; Mighty Tools ×7 |
| **A.E. 06** | 2025-02-23 20:00 | Clear A.E. 05 | Mimicry - Kraken | 16,000 | 26,000 | Mighty Tools ×7 | Mighty Equipment Box ×1; Mighty Tools ×7 |
| **A.E. 07** | 2025-02-24 20:00 | Clear A.E. 06 | Mimicry - Modernia | 25,000 | 41,000 | Mighty Tools ×7 | Mighty Equipment Box ×1; Mighty Tools ×7 |
| **A.E. 08** | 2025-02-24 20:00 | Clear A.E. 07 | Mimicry - Chatterbox | 43,000 | 72,000 | Mighty Tools ×7 | Mighty Equipment Box ×1; Mighty Tools ×7 |
| **A.E. 09** | 2025-02-24 20:00 | Clear A.E. 08 | Mimicry - Chatterbox | 16,000 | 27,000 | Mighty Tools ×8 | Mighty Equipment Box ×1; Mighty Tools ×8 |
| **A.E. 10** | 2025-02-25 20:00 | Clear A.E. 09 | Mimicry - Grave Digger | 30,000 | 50,000 | Mighty Tools ×8 | Mighty Equipment Box ×1; Mighty Tools ×8 |
| **A.E. 11** | 2025-02-25 20:00 | Clear A.E. 10 | Mimicry - Kraken | 23,000 | 38,000 | Mighty Tools ×8 | Mighty Equipment Box ×1; Mighty Tools ×8 |
| **A.E. 12** | 2025-02-26 20:00 | Clear A.E. 11 | Mimicry - Chatterbox | 23,000 | 39,000 | Mighty Tools ×8 | Mighty Equipment Box ×1; Mighty Tools ×8 |

#### CHALLENGE

| Stage | Opens | Needs | Boss / elite | 2★ | 3★ | Clear reward | First clear |
|---|---|---|---|---|---|---|---|
| **T.F.** | 2025-02-19 16:00 | Clear Q.S. 01 |  | 20,000 | 32,000 |  |  |

The Challenge stage gives no clear rewards; it is played for score.

## Units

### Evangelions

Each Evangelion has its own gun, damage and A.T. Field.

#### Modified Unit Eight γ

- Possesses pinpoint accuracy. Excels at precision strikes.
- Master of light-speed projectiles and linear ballistics. Powerful sniper attacks are especially effective against large enemies.
- **Unlocked**: First clear of Q.S. 05
- **Attack**: Precise Shooting, A.T. Field
- **Damage**: ×0.87 damage multiplier, each hit varies ×0.85–×1.15
- **A.T. Field gauge**: 27,000 (filled by dealing damage)
- **A.T. Field values (by A.T. Field part level)**: Lv 1: 4000 / 500 / Lv 2: 4000 / 660 / Lv 3: 4000 / 1000 / (meaning not documented)
- **Weapon forms**: 3, switched by Portable Weapon Lv 1, Portable Weapon Lv 6, Portable Weapon Lv 8; 3 levels each

#### New Unit Two α

- Possesses exceptional firepower and devastating area-of-effect bombardment capabilities. Unstoppable against any foe.
- Rains a hail of machine gun bullets for battlefield dominance. Excels at close to mid-range combat.
- **Unlocked**: First clear of Q.S. 09
- **Attack**: Firepower Suppression, A.T. Field
- **Damage**: ×0.56 damage multiplier, each hit varies ×0.85–×1.15
- **A.T. Field gauge**: 27,000 (filled by dealing damage)
- **A.T. Field values (by A.T. Field part level)**: Lv 1: 3200 / 500 / Lv 2: 4500 / 800 / Lv 3: 6500 / 1000 / (meaning not documented)
- **Weapon forms**: 3, switched by Portable Weapon Lv 1, Portable Weapon Lv 6, Portable Weapon Lv 8; 3 levels each

#### Mark.09

- Excels in defense and close combat, though lacks focused firepower against single targets.
- High resistance to all attacks. Specializes in A.T. Field defense.
- **Unlocked**: From the start
- **Attack**: Radial Barrage, A.T. Field
- **Damage**: ×0.94 damage multiplier, each hit varies ×0.85–×1.15
- **A.T. Field gauge**: 27,000 (filled by dealing damage)
- **A.T. Field values (by A.T. Field part level)**: Lv 1: 4000 / Lv 2: 5000 / Lv 3: 6000 / (meaning not documented)
- **Weapon forms**: 3, switched by Portable Weapon Lv 1, Portable Weapon Lv 6, Portable Weapon Lv 8; 3 levels each

### Extra weapons

A pair of wingman drones that flies with the Evangelion and fires alongside it.

| Extra weapon | About | Drones | Unlocked |
|---|---|---|---|
| **Extra Weapon - Artillery Type** | Highly destructive but has a slow reload speed.;  (With this, I can do whatever I want. / - Excerpt from a CEO's review -) | 2 | First clear of Q.S. 02 |
| **Extra Weapon - Assault Type** | Stable and reliable, providing continuous fire support.;  (It doesn't stop once it's activated... This is the epitome of firepower! / - Excerpt from an anonymous firepower enthusiast's review -) | 2 | First clear of Q.S. 10 |

### Part upgrades

Spend materials on five upgrade chains; some levels need a level in another chain first. Values are as stored (units not stated).

#### Portable Weapon (210 Mighty Tools in all)

| Lv | Effect | Cost | Also needs |
|---|---|---|---|
| 1 | Evangelion Basic ATK;  (Evangelion ATK: base 120);  (Weapon upgraded to its next form) | Free |  |
| 2 | Increases ATK of Evangelion;  (Evangelion ATK +20) | Mighty Tools ×5 |  |
| 3 | Increases ATK of Evangelion;  (Evangelion ATK +25) | Mighty Tools ×15 |  |
| 4 | Increases ATK of Evangelion;  (Evangelion ATK +30) | Mighty Tools ×20 |  |
| 5 | Increases ATK of Evangelion;  (Evangelion ATK +25) | Mighty Tools ×30 |  |
| 6 | Increases ATK of Evangelion / Upgrades equipment;  (Weapon upgraded to its next form) | Mighty Tools ×30 | Armor Part Lv 3 |
| 7 | Increases ATK of Evangelion;  (Evangelion ATK +25) | Mighty Tools ×30 |  |
| 8 | Increases ATK of Evangelion / Upgrades equipment;  (Weapon upgraded to its next form) | Mighty Tools ×40 | Armor Part Lv 4 |
| 9 | Increases ATK of Evangelion;  (Evangelion ATK +25) | Mighty Tools ×40 |  |

#### Armor Part (10 Mighty Equipment Box in all)

| Lv | Effect | Cost | Also needs |
|---|---|---|---|
| 1 | Evangelion Basic HP;  (Evangelion HP: base 7) | Free |  |
| 2 | Increases HP of Evangelion;  (Evangelion HP +1) | Mighty Equipment Box ×3 |  |
| 3 | Increases HP of Evangelion;  (Evangelion HP +1) | Mighty Equipment Box ×3 | Recycling Efficiency Lv 3 |
| 4 | Increases HP of Evangelion;  (Evangelion HP +1) | Mighty Equipment Box ×4 | A.T. Field Lv 3 |

#### Recycling Efficiency (8 Mighty Equipment Box in all)

| Lv | Effect | Cost | Also needs |
|---|---|---|---|
| 1 | Basic Acquisition Range;  (Pickup range: base 3) | Free |  |
| 2 | Increases acquisition range;  (Pickup range +1) | Mighty Equipment Box ×2 |  |
| 3 | Increases acquisition range;  (Pickup range +1) | Mighty Equipment Box ×3 | Armor Part Lv 2 |
| 4 | Increases acquisition range;  (Pickup range +1) | Mighty Equipment Box ×3 |  |

#### A.T. Field (6 Mighty Equipment Box in all)

| Lv | Effect | Cost | Also needs |
|---|---|---|---|
| 1 | Basic A.T. Field;  (A.T. Field level 1) | Free |  |
| 2 | Enhances the effect of A.T. Field;  (A.T. Field level 2) | Mighty Equipment Box ×2 |  |
| 3 | Enhances the effect of A.T. Field;  (A.T. Field level 3) | Mighty Equipment Box ×4 | Armor Part Lv 2 |

#### Extra Weapon (145 Mighty Tools in all)

| Lv | Effect | Cost | Also needs |
|---|---|---|---|
| 1 | Extra Weapon Basic ATK;  (Extra weapon ATK: base 95) | Free |  |
| 2 | Increases ATK of extra weapons;  (Extra weapon ATK +25) | Mighty Tools ×15 |  |
| 3 | Increases ATK of extra weapons;  (Extra weapon ATK +30) | Mighty Tools ×20 |  |
| 4 | Increases ATK of extra weapons;  (Extra weapon ATK +30) | Mighty Tools ×30 |  |
| 5 | Increases ATK of extra weapons;  (Extra weapon ATK +30) | Mighty Tools ×40 |  |
| 6 | Increases ATK of extra weapons;  (Extra weapon ATK +30) | Mighty Tools ×40 | Armor Part Lv 3 |

## Battle

### Enemies

Raptures and the giant “Mimicry” bosses. Elites and bosses fire named bullet patterns.

#### Bosses and elites

| Enemy | Type | HP | Score | Score item drops | Buff drop | Attack patterns |
|---|---|---|---|---|---|---|
| Mimicry - Massive Object Q (13001, 13011) | [Boss] | 107,600 | 20,000 | 100% ×3, 30% ×1 |  | High Beam Laser, Baptism of Mercy, Enemy's Resistance, Soul's Guidance, Adam's Summon |
| Mimicry - Grave Digger (13002, 13012) | [Boss] | 107,600 | 20,000 | 100% ×3, 30% ×1 |  | Strongest Sniper Shot, The Last Judgment, Moving Barrage, Overload Sniper Shot, Error Code |
| Mimicry - Modernia (13003, 13013) | [Boss] | 107,600 | 20,000 | 100% ×3, 30% ×1 |  | Scattered Feathers, Piercing Feathers, Closed Wings, Expanded Wings, Chaotic Attack |
| Mimicry - Mother Whale (13004, 13014) | [Boss] | 64,560 | 20,000 | 100% ×3, 30% ×1 |  | Great Flood, Mass Extinction, Crisis of the World, Wave Expansion, Whale's Explosion Sound |
| Mimicry - Kraken (13005, 13015) | [Boss] | 107,600 | 20,000 | 100% ×3, 30% ×1 |  | Torpedoes?, Wild Tentacles, Massive Wave, Barrage Whirlpool, Attack of Waves |
| Mimicry - Chatterbox (13006, 13016) | [Boss] | 107,600 | 20,000 | 100% ×3, 30% ×1 |  | Rhythm Missile, Area Bombardment, Shrieking Sniper Shot, Demonic Dance, Fury Burst |
| E-Cutter (12001) | [Elite] | 3,230 | 1,500 | 100% ×3, 20% ×2 | 80% ×1 | Command: Lock On, Command: Bomb, Command: Suppress |
| E-Arkanoid (12002) | [Elite] | 4,400 | 1,500 | 100% ×3, 20% ×2 | 80% ×1 | Direct Attack, Auto Aim Shooting, Double Sniper Shot |
| E-Tripod (12003) | [Elite] | 3,500 | 1,500 | 100% ×3, 20% ×2 | 60% ×1 | Blazing Ray, Spiral Bullet, Barrage Explosion |

Score item drops: each entry is a chance and an amount of score items (two kinds per enemy). Buff drop: chance of dropping a buff (Extra Ammo, Armor Repair, Battlefield Recycling or Output Supplement). Several ids share the same stats.

#### Regular enemies

| Enemy | Type | HP | Score | Score item drops | Buff drop |
|---|---|---|---|---|---|
| E-Cutter (11001) | [Regular] | 500 | 100 | 80% ×1, 20% ×1 | 30% ×1 |
| E-Arkanoid (11002) | [Regular] | 500 | 100 | 80% ×2, 10% ×1 | 30% ×1 |
| E-Tripod (11003) | [Regular] | 1,300 | 100 | 80% ×3, 20% ×2 | 100% ×1 |
| E-Cutter (11011) | [Regular] | 500 | 100 | 80% ×2, 20% ×2 | 40% ×1 |
| E-Arkanoid (11012) | [Regular] | 500 | 100 | 80% ×3, 10% ×3 | 40% ×1 |
| E-Tripod (11013) | [Regular] | 1,300 | 100 | 80% ×5, 20% ×3 | 100% ×1 |
| E-Cutter (11021) | [Regular] | 500 | 0 |  | 30% ×1 |
| E-Arkanoid (11022) | [Regular] | 500 | 0 |  | 30% ×1 |
| E-Tripod (11023) | [Regular] | 1,300 | 0 |  | 100% ×1 |
| E-Tripod (11033) | [Regular] | 2,000 | 0 |  | 100% ×1 |
| E-Tripod (11043) | [Regular] | 3,500 | 0 |  | 100% ×1 |
| E-Tripod (11053) | [Regular] | 5,000 | 0 |  | 100% ×1 |

Variants with 0 score appear in stages where kills give no points.

#### Book unlocks

| Enemy | Stage |
|---|---|
| E-Cutter | Q.S. 01 |
| E-Arkanoid | Q.S. 01 |
| E-Tripod | Q.S. 09 |
| Mimicry - Massive Object Q | Q.S. 07 |
| Mimicry - Grave Digger | A.E. 02 |
| Mimicry - Modernia | Q.S. 11 |
| Mimicry - Mother Whale | Q.S. 04 |
| Mimicry - Kraken | A.E. 05 |
| Mimicry - Chatterbox | A.E. 08 |

An enemy’s page in the List opens when it is met in this stage.

## Collection

### Collection items

Records found in stages. Each set of four unlocks a fifth record that wraps up the story.

#### Fruit of Wisdom α

| Record | Found in | Text |
|---|---|---|
| Wisdom Fragment 01 (A password-protected data likely left behind by Nikkes from an unknown squad. / They witnessed a puzzling phenomenon upon arrival.) | Q.S. 02 | As we approached the combat area, we noticed a zero-gravity phenomenon occurring around us. / There were fragments we've never seen before all around us, and these crimson substances left us short of breath. |
| Wisdom Fragment 02 (A password-protected data likely left behind by Nikkes from an unknown squad. / Their comrades were injured because of this crimson object.) | Q.S. 04 | The crimson substances stuck to some of our comrades upon contact. / Their physical abilities showed anomalies, and our communications were cut off. / All we could do was hope the reinforcement squad would locate us through the messages we left. |
| Wisdom Fragment 03 (A password-protected data likely left behind by Nikkes from an unknown squad. / They were rescued by another squad.) | Q.S. 04 | This area is filled with cross-shaped lights. / I witnessed the crimson giants emerging from the ground. / What in the world is happening? / Thankfully, the reinforcement squad found us, and we managed to survive. |
| Wisdom Fragment 04 (A password-protected data likely left behind by Nikkes from an unknown squad. / The battle of the giants on the sea changed the world before them.) | Q.S. 06 | As we retreated, I saw three giants fighting over the sea. / Could those be Raptures? Or are they new life forms? / The sky was suddenly painted crimson, and so did the sea and the land. / We watched as twisted rays of light transform into giants... / Fortunately, this nightmare ended not long after. |
| Fruit of Wisdom α (This is the truth about the "giants" walking among the fragments...) | Collect the other four | As the crimson giants walked through the wreckage, their heads fell off. / Beneath the helmet-like part, there was flesh underneath. / I remember now. Humans contorted into those giants in the light. / Ah... The world is becoming increasingly strange... |

#### Fruit of Wisdom β

| Record | Found in | Text |
|---|---|---|
| Wisdom Fragment 01 (A password-protected backup data likely left behind Absolute. / Though they were nearby, they couldn't advance due to the large number of Raptures.) | Q.S. 07 | This is Eunhwa. There are too many Raptures here. It's difficult to break through. / ...The special combat team has arrived at the sea? / Roger. Absolute will now provide rear support. |
| Wisdom Fragment 02 (A password-protected backup data likely left behind Absolute. / They found the AZX and Infinity Rail that had been forced to a standstill.) | Q.S. 08 | This is Eunhwa. We found a transport squad that was unable to advance due to the Raptures. / We've confirmed that the AZX, the squad members, and the resources are all in good condition. / We will deal with the Raptures. It'll be quick. |
| Wisdom Fragment 03 (A password-protected backup data likely left behind Absolute. / They volunteered to stay and provide subsequent support.) | Q.S. 08 | This is Eunhwa. The AZX has returned safely. / We'll stay here to provide rear support. |
| Wisdom Fragment 04 (A password-protected backup data likely left behind Absolute. / The signal of a giant Rapture was detected nearby.) | Q.S. 09 | This is Eunhwa. The communications were cut off earlier. / A giant Rapture's signal? Are you sure? / ... No, leave it to us. / The special combat team has its own mission. |
| Fruit of Wisdom β (After the sea battle, the battle on land has also ended.) | Collect the other four | This is Eunhwa. All Raptures on the route have retreated. What's the situation at the sea? / So you were successful. That explains the clamor. / Roger. We will recondition ourselves after returning. / I've compiled all the reports for this mission. |

#### Fruit of Wisdom γ

| Record | Found in | Text |
|---|---|---|
| Wisdom Fragment 01 (A password-protected voyage log by the great pirate, Mast. / Set sail! Mast begins her adventure.) | Q.S. 11 | We couldn't fish along the way because of the Admire's speed. / What? Anchor almost got poked by a spearfish? / Gosh, this isn't the time to be fishing! |
| Wisdom Fragment 02 (A password-protected voyage log by the great pirate, Mast. / Chapter 1: Pirate Mast conquers the sea!) | Q.S. 12 | Since Helm is injured, I shall take on the great mission of conquering the sea! / By the way, I think Raptures nearby are affected by the D-Wave. They look kinda strange. |
| Wisdom Fragment 03 (A password-protected voyage log by the great pirate, Mast. / Chapter 2: Pirate Mast turns the ship's bow toward the rear.) | Q.S. 12 | They seem to be wary of the sea area with restored sealing columns. / Let's continue to observe and... What?! / The sealing columns are under attack? I'm heading there right now! |
| Wisdom Fragment 04 (A password-protected voyage log by the great pirate, Mast. / Chapter 3: Pirate Mast obtains treasures!) | A.E. 01 | Although I, Captain Mast, gained many things from the sea, I won't be attached to profits. / I'll give all of these treasures to my friends! |
| Fruit of Wisdom γ (A password-protected voyage log by the great pirate, Mast. / Final Chapter: Pirate Mast's great journey!) | Collect the other four | What a thrilling and unforgettable experience. / This is a monumental adventure worthy of being recorded in the history of Pirate Mast's merits! / Listen up! From now on, refer to me as the legendary pirate and—mmph, mmph! |

#### Fruit of Wisdom δ

| Record | Found in | Text |
|---|---|---|
| Wisdom Fragment 01 (A password-protected data most definitely left behind by Matis. / Heroic dispatch!) | A.E. 03 | Heroic dispatch! On the way to rescue! / ... What? Absolute has already taken care of it? |
| Wisdom Fragment 02 (A password-protected data most definitely left behind by Matis. / Hero in crisis!) | A.E. 03 | Heroic dispatch! Charging to the beach! / The path is getting redder! / Communications have been cut off! / Hero is in crisis! |
| Wisdom Fragment 03 (A password-protected data most definitely left behind by Matis. / Heroic joining!) | A.E. 04 | Heroes from another world have appeared! / We can now return! / But the fact that we as heroes need to be rescued... / is an utter disgrace! |
| Wisdom Fragment 04 (A password-protected data most definitely left behind by Matis. / Heroic escort!) | A.E. 06 | Heroic dispatch! / Setting off with high-performance navigation alongside heroes from another world! / Heroic escort! |
| Fruit of Wisdom δ (Even if E-Raptures are the target, E-Heroes will never fail!) | Collect the other four | Enhanced Raptures keep appearing at the beach because of the D-Wave! / They're called E-Raptures! / Well then, we're the E-Heroes! Because the heroes from another world gave us the D-Wave! / E-Heroic dispatch! |

#### Wisdom Fragment Ω

| Record | Found in | Text |
|---|---|---|
| Wisdom Fragment 01 (A fragment from another world that seems to be a videotape. / A Nikke enters an unfamiliar place by mistake.) | A.E. 06 | It's been 5 hours since I was sucked into the mysterious tunnel. / I have no way to contact the Ark. / Where has everyone gone? And where is this place? / It's beautiful here, though. / Is this really... the surface? / It's peaceful, but so lonely. |
| Wisdom Fragment 02 (A fragment from another world that seems to be a videotape. / She wakes up under an unfamiliar ceiling.) | A.E. 07 | It's this unfamiliar ceiling again. / I entered that twisted cave to escape, and then lost consciousness. / Is it truly impossible for me to leave this place? / I feel like I've forgotten something, but I find comfort in that. / Because I no longer have to fight with all my might. Still, I feel empty. |
| Wisdom Fragment 03 (A fragment from another world that seems to be a videotape. / A deserted street with haphazardly destroyed skyscrapers.) | A.E. 09 | I decided to venture deeper. / The deeper I went, the more desolate this world became. / When I walked closer, there was a massive sphere covered in blood. / Countless fragments of red giants scattered around, and a few of them even moved sometimes. / My heart felt at peace as I stayed in the safe zone. Everything in this world obeyed my thoughts. / But for some reason, I suddenly wanted to go back. |
| Wisdom Fragment 04 (A fragment from another world that seems to be a videotape. / A soundstage... and a pale girl with long hair.) | A.E. 09 | There was a soundstage in the depths of the faded world. / As someone who enjoys variety shows, I recognized it at a single glance. / There, I encountered a beautiful girl. / She seemed sad and told me the way to get out. / She wished me luck. But... why did she ask me my reason for leaving? |
| Wisdom Fragment Ω (The Nikke who left the soundstage and boarded the train. / She seems to have found the reason to go back.) | Collect the other four | The train arrived at the station, and people boarded it excitingly. / I think I saw that girl again. She was smiling brightly. / I sat on the platform, waiting for someone, though I didn't know who. / Then, I saw them—people hugging each other tightly with happy faces. / Yes, it's time for me to board as well. I should go back. / Back to the person who'll embrace me closely. |

#### Collection rewards

| Book | Entries | Reward |
|---|---|---|
| Collection Items | 4 | Elysion Common Console ×20, Ultra-Double Boost Module ×1 |
| Collection Items | 8 | Missilis Common Console ×20, Ultra-Double Boost Module ×1 |
| Collection Items | 12 | Tetra Common Console ×20, Ultra-Double Boost Module ×1 |
| Collection Items | 16 | Pilgrim Common Console ×20, Ultra-Double Boost Module ×1 |
| Collection Items | 20 | Abnormal Common Console ×20, Ultra-Double Boost Module ×1 |
| Mutant Raptures | 2 | Skill Manual Selection Box ×1, Burst Manual Selection Box ×1 |
| Mutant Raptures | 4 | Skill Manual Selection Box ×1, Burst Manual Selection Box ×1 |
| Mutant Raptures | 6 | Skill Manual Selection Box ×1, Burst Manual Selection Box ×1 |
| Mutant Raptures | 9 | Skill Manual Selection Box ×2, Burst Manual Selection Box ×2 |

## Rewards

### Missions

#### Stage missions

| Mission | Reward |
|---|---|
| Complete 5 stage mission(s) | Central Government Supply Chest I ×2 |
| Complete 10 stage mission(s) | Central Government Supply Chest I ×2 |
| Complete 20 stage mission(s) | Central Government Supply Chest I ×2 |
| Complete 30 stage mission(s) | Central Government Supply Chest I ×2 |
| Complete 40 stage mission(s) | Central Government Supply Chest I ×2 |
| Complete 50 stage mission(s) | Central Government Supply Chest I ×2 |

Rewards for the total number of stars (stage missions) earned.

#### Daily missions

| Mission | Reward |
|---|---|
| Obtain buff 3 time(s) | 40 daily points |
| Use A.T. Field 1 time(s) | 40 daily points |
| Clear any stage 1 time(s) | 40 daily points |
| Deal 50,000 damage to enemies | 60 daily points |

Reset every day; each one gives daily points.

#### Daily point rewards

| Mission | Reward |
|---|---|
| Earn 20 point(s) in daily missions | Attacker Common Console ×2 |
| Earn 40 point(s) in daily missions | Defender Common Console ×2 |
| Earn 60 point(s) in daily missions | Supporter Common Console ×2 |
| Earn 80 point(s) in daily missions | Abnormal Common Console ×2 |
| Earn 100 point(s) in daily missions | Gem ×30 |

Rewards for the daily points collected (counted over the event).

#### Achievements

| Mission | Reward |
|---|---|
| Complete 21 Challenge mission(s) | LiveWallpaper 63 ×1 |
| Clear Stage Q.S. 04 | Skill Manual I ×18 |
| Clear Stage Q.S. 08 | Skill Manual II ×12 |
| Clear Stage Q.S. 12 | Skill Manual III ×6 |
| Clear Stage A.E. 03 | Burst Manual I ×9 |
| Clear Stage A.E. 06 | Burst Manual II ×6 |
| Clear Stage A.E. 09 | Burst Manual III ×3 |
| Use Evangelion Mark.09 to clear stage 5 time(s) | Central Government Supply Chest I ×1 |
| Use Evangelion Modified Unit Eight γ to clear stage 5 time(s) | Central Government Supply Chest I ×1 |
| Use Evangelion New Unit Two α to clear stage 5 time(s) | Central Government Supply Chest I ×1 |
| Use Extra Weapon - Artillery Type to clear stage 5 time(s) | Central Government Supply Chest I ×1 |
| Use Extra Weapon - Assault Type to clear stage 5 time(s) | Central Government Supply Chest I ×1 |
| Upgrade parts 5 time(s) | Attacker Common Console ×30 |
| Upgrade parts 10 time(s) | Defender Common Console ×30 |
| Upgrade parts 20 time(s) | Supporter Common Console ×30 |
| Reach a final score of 30,000 in a battle | Abnormal Common Console ×30 |
| Reach a final score of 50,000 in a battle | Abnormal Common Console ×30 |
| Reach a final score of 70,000 in a battle | Abnormal Common Console ×30 |
| Defeat 200 enemy unit(s) | Elysion Common Console ×30 |
| Defeat 500 enemy unit(s) | Missilis Common Console ×30 |
| Defeat 1,000 enemy unit(s) | Tetra Common Console ×30 |
| Defeat 2,000 enemy unit(s) | Pilgrim Common Console ×30 |

One-time goals.

## Data sources

All in `D:\Nikke Datamine\mpkparser\jsons` as `<Table>.json`.

| Table | Rows | Fields |
|---|---|---|
| `EventEvaMiniGameMissionTable` | 37 | `mission_id`, `event_id`, `mission_localkey`, `mission_category`, `mission_type`, `mission_target_id`, `mission_count`, `reward_type`, `reward_value` |
| `EventEvaMiniGameTutorialTable` | 3 | `id`, `title`, `description`, `showasset` |
| `EventEvaMiniGameActivityConfigTable` | 1 | `event_id`, `chglobbybgwhenpassstoryid`, `defaultmecha`, `defaultwingman`, `firstenterscenariogroupid` |
| `EventEvaMiniGameBookTable` | 34 | `book_id`, `event_id`, `book_type`, `book_group`, `stage_id`, `detailinfo_id` |
| `EventEvaMiniGameBookProcessTable` | 9 | `id`, `event_id`, `book_type`, `num`, `reward_id` |
| `EventEvaMiniGameCharacterTable` | 3 | `id`, `event_id`, `name`, `description`, `iconasset`, `characterasset`, `unlocklevel`, `unlockdescription`, `weaponsets`, `characterskill`, `skillparams`, `skillpower`, `damagecoefficient`, `fluctuationcoefficient` |
| `EventEvaMiniGameCollectionTable` | 25 | `id`, `event_id`, `name`, `lock_name`, `ui_description`, `ui_lock_description`, `ui_icon` |
| `EventEvaMiniGameEnemyTable` | 40 | `id`, `event_id`, `name`, `description`, `iconasset`, `characterasset`, `unlocklevel`, `unlockdescription`, `boss`, `ui_description`, `ui_icon`, `skills`, `hp`, `score`, `scoreloot`, `buffloot`, `bufflootweightasset`, `previewskills`, `previewskillnames` |
| `EventEvaMiniGameEnemySkillTable` | 117 | `id`, `event_id`, `ui_icon`, `ui_video`, `description`, `gunasset` |
| `EventEvaMiniGameItemTable` | 7 | `item_id`, `event_id`, `item_type`, `item_resource`, `item_name`, `item_description`, `item_description_play`, `unlock_stage`, `ui_code`, `previewskillnames` |
| `EventEvaMiniGameSkillTable` | 26 | `skill_id`, `event_id`, `skill_group`, `need_skill_array`, `cost_id`, `cost_num`, `lv`, `effect`, `ui_name`, `ui_des`, `ui_icon` |
| `EventEvaMiniGameSkillEffectTable` | 30 | `id`, `effect_type`, `strengthen_size` |
| `EventEvaMiniGameStageTable` | 25 | `stage_id`, `event_id`, `start_date`, `end_date`, `stage_type`, `need_stage_id`, `open_condition_event_story_stage`, `one_star_score`, `two_star_score`, `three_star_score`, `fix_reward_array`, `first_reward_array`, `name_localkey`, `boss_icon`, `levelassetname`, `enter_scenario`, `exit_scenario` |
| `EventEvaMiniGameWingmanTable` | 4 | `id`, `event_id`, `characterasset`, `weaponsets` |
| `EventEvaMiniGameWingmanTeamTable` | 2 | `id`, `event_id`, `name`, `description`, `iconasset`, `unlocklevel`, `unlockdescription`, `demonstration`, `group`, `damagecoefficient`, `fluctuationcoefficient` |

## Uncertain / unknown

The viewer flagged nothing as uncertain. Fields it does not show are listed in Data sources; their meaning is not interpreted.
