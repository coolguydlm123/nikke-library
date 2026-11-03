# Bubble March

A lane battle: summon bubble minions and fairy-tale heroes with Summon Bubbles, march them at the Raptures and destroy the Rapture tower or boss of each wave while keeping your own tower standing.

This guide was generated from the Nikke Library's reading of the game data: the viewer `lib/eventgames/bubblemarch.js` turns the `Event*` tables in `D:\Nikke Datamine\mpkparser\jsons` into the rules below. Numbers, units and formulas are the viewer's readings; anything it was not sure of is listed under "Uncertain / unknown". Long lists are cut to 30 rows.

- Intro story: "Coo? Coo!" (`d_contents_bubblemarch_01`)
- Art folder: `icons-event/54_bubblemarch`

## How to play (in-game help)

- **Bubble March**: ■ Bubble March is a board game Little Mermaid created using bubbles. ■ Minions and Raptures advance forward to destroy each other's towers. ■ Win by protecting the allies' towers and destroying the Rapture towers!
- **Summoning**: ■ Summon heroes and minions to fight against the invading Raptures. ■ You'll need Summon Bubbles to call them into battle. ■ Summon Bubbles automatically refill over time and can also be obtained by defeating Raptures. ■ Collect a specific number of Summon Bubbles to summon heroes and minions. ■ Minions advance forward to fight Raptures and defend the allies' towers. ■ Multiple minions are summoned at once. ■ Upgrading the level increases the number of minions summoned at a time. ■ Advanced minions can be unlocked through research. ■ Different minions have an advantage against different types of Raptures. Please refer to the description of the minions. ■ A hero is summoned one at a time. ■ A hero on the battlefield cannot be summoned again. ■ Learn the hero's unique trait to use powerful skills. ■ New heroes can be unlocked through research.
- **Upgrade**: ■ Summon Bubbles can be used to enhance and upgrade the levels of heroes and minions in the stage. ■ The higher their level, the more powerful the heroes and minions will become. ■ As the battle progresses, the Raptures' levels will also increase. ■ All enhanced levels will be reset after the battle. ■ Summon Bubbles can also be enhanced. ■ Enhancing Summon Bubbles will increase the maximum amount of Summon Bubbles in a stage.
- **Towers**: ■ Raptures will invade and attack the allies' towers. ■ The battle is lost when the allies' towers are destroyed. ■ Heroes and minions must be summoned strategically to protect the allies' towers. ■ The battle is won when Rapture towers are destroyed or when the Rapture boss is defeated. ■ Rapture towers or bosses may appear multiple times in some stages.
- **Stages**: ■ Bubble March has four difficulty modes: Easy, Normal, Hard, and Challenge. ■ Various types of heroes and minions can be used in the stages. ■ Each stage consists of at least one wave. ■ If a stage has multiple waves, all waves must be cleared to win. ■ Heroes and minions that survive the previous wave can be used in the next wave. ■ The higher the difficulty, the more waves there will be.
- **Challenge**: ■ The Challenge stage has unlimited waves. ■ Upgrade research and traits to enhance your heroes and minions, in order to clear as many waves as possible! ■ When all Easy stages are cleared, the stage will begin from Wave 3. ■ When all Normal stages are cleared, the stage will begin from Wave 6. ■ When all Hard stages are cleared, the stage will begin from Wave 9.
- **Research**: ■ New heroes and minions can be unlocked through research. ■ Research Bubbles are required to conduct research. ■ Research Bubbles can be obtained from the first clear rewards of some stages. ■ Research can be reset. ■ If you're having trouble clearing a stage, consider researching heroes and minions that counter Raptures that will appear in battle.
- **Traits**: ■ Traits provide advantages in battles. ■ If the stage is too difficult, try upgrading the traits. ■ Trait Bubbles are required to learn and upgrade traits. ■ Trait Bubbles can be obtained repeatedly by clearing stages. ■ Traits can be reset. ■ Combine different traits to create your own winning strategy!

## Overview

### A battle

- **Intro story**: story "Coo? Coo!" (`d_contents_bubblemarch_01`)
- **Win**: Destroy the Rapture tower (or defeat the boss) in every wave of the stage before time runs out.
- **Lose**: Your tower is destroyed.
- **Summoning**: Tap a unit to summon it for Summon Bubbles; it appears in front of your tower and marches on its own. Minions come out several at a time and can be summoned again after a cooldown; each hero can be on the field only once.
- **Summon Bubbles**: Refill on their own during battle (charge value 10; the in-game text gives no unit) and drop from defeated Raptures (10 to 20 each). Start cap 1,000; each Summon Bubble level costs 100 and raises the cap by 1,000.
- **Levelling**: Summon Bubbles also level up each unit type for the rest of the battle: more ATK and HP, and more minions per summon (4, then 5 from Lv 11, 6 from Lv 21). Levels reset after the battle; the stage sets the level cap.
- **Type advantage**: Units deal +50% damage to the Rapture types they counter (see the unit and Rapture pages).
- **Waves**: Heroes and minions that survive carry over to the next wave. Rapture levels go up each wave.
- **Rerun**: The rerun (Arcade) has the same stages with no day locks and its own set of challenge missions.

### Currencies

|  | Currency | Use |
|---|---|---|
|  | Summon Bubble | A type of currency in Bubble March. / Used to summon and upgrade heroes and minions. |
|  | Research Bubble | A type of currency in Bubble March. / Used to research heroes and minions. |
|  | Trait Bubble | A type of currency in Bubble March. / Used to enhance the traits of heroes and minions. |

### Heroes and minions

- Bubble Defender
- Bubble Guardian
- Bubble Warlord
- Bubble Attacker
- Bubble Slayer
- Bubble Warrior
- Bubble Gunner
- Bubble Ranger
- Bubble Sniper
- Bubble Bomber Man
- Bubble Grenade Man
- Bubble Missile Man
- Bubble Healer
- Bubble Medic
- Bubble Nurse
- Bubble Little Mermaid
- Bubble Cinderella
- Bubble Abe

## Units

### Heroes and minions

Five minion classes with three minions each, plus three heroes. The first of each class is owned from the start; the rest are researched.

#### Units

|  | Unit | Description | Summon cost | Cooldown | Per summon | Base stats | Skills | Bonus damage vs |
|---|---|---|---|---|---|---|---|---|
|  | Bubble Defender (Defender · R) | Basic Defender minion. / Has high HP but relatively low ATK. / Has an advantage against ground-type close-range Raptures. | 100 (level-up 100 each) | 10 s | 4 (Lv 1+), 5 (Lv 11+), 6 (Lv 21+) | ATK 10 (HP 120) | Melee attack on one enemy every 1 s | Pelican, Thief, Bulwark |
|  | Bubble Guardian (Defender · SR) | Advanced Defender minion. / Uses a protective barrier to safeguard its HP. / Has an advantage against ground-type close-range Raptures. | 200 (level-up 200 each) | 15 s | 4 (Lv 1+), 5 (Lv 11+), 6 (Lv 21+) | ATK 20 (HP 240) | Melee attack on one enemy every 1 s; Barrier worth 20% of max HP for 5 s every 10 s | Pelican, Thief, Bulwark |
|  | Bubble Warlord (Defender · SR) | Advanced Defender minion. / Launches stronger attacks by wielding a shield. / Has an advantage against ground-type close-range Raptures. | 200 (level-up 200 each) | 15 s | 4 (Lv 1+), 5 (Lv 11+), 6 (Lv 21+) | ATK 20 (HP 240) | Melee attack on one enemy every 1 s | Pelican, Thief, Bulwark |
|  | Bubble Attacker (Attacker · R) | Basic Attacker minion. / Has an excellent balance of HP and ATK. / Has an advantage against ground-type long-range Raptures. | 100 (level-up 100 each) | 10 s | 4 (Lv 1+), 5 (Lv 11+), 6 (Lv 21+) | ATK 20 (HP 60) | Melee attack on one enemy every 1 s | Fez, Curvy Leg, Ant |
|  | Bubble Slayer (Attacker · SR) | Advanced Attacker minion. / Moves swiftly to the target's rear to perform sneak attacks, but cannot be used against towers and bosses. / Has an advantage against ground-type long-range Raptures. | 200 (level-up 200 each) | 15 s | 4 (Lv 1+), 5 (Lv 11+), 6 (Lv 21+) | ATK 36 (HP 120) | Melee attack on one enemy every 1 s; Jumps behind its target (range 30) every 10 s | Fez, Curvy Leg, Ant |
|  | Bubble Warrior (Attacker · SR) | Advanced Attacker minion. / Launches powerful attacks using an ax. / Has an advantage against ground-type long-range Raptures. | 200 (level-up 200 each) | 15 s | 4 (Lv 1+), 5 (Lv 11+), 6 (Lv 21+) | ATK 40 (HP 120) | Melee attack on one enemy every 1 s | Fez, Curvy Leg, Ant |
|  | Bubble Gunner (Gunner · R) | Basic Gunner minion. / Has high ATK but relatively low HP. / Has an advantage against aerial-type Raptures. | 100 (level-up 100 each) | 10 s | 4 (Lv 1+), 5 (Lv 11+), 6 (Lv 21+) | ATK 14 (HP 42) | Shoots one enemy, 3 hits every 1 s | Hard Hat, Lure, Bird |
|  | Bubble Ranger (Gunner · SR) | Advanced Gunner minion. / Temporarily reduces the skill cooldown, allowing for quicker attacks. / Has an advantage against aerial-type Raptures. | 200 (level-up 200 each) | 15 s | 4 (Lv 1+), 5 (Lv 11+), 6 (Lv 21+) | ATK 14 (HP 84) | Shoots one enemy, 3 hits every 0.5 s; Attacks 100% faster for 5 s every 10 s | Hard Hat, Lure, Bird |
|  | Bubble Sniper (Gunner · SR) | Advanced Gunner minion. / Has a long shooting range and can attack from a greater distance. / Has an advantage against aerial-type Raptures. | 200 (level-up 200 each) | 15 s | 4 (Lv 1+), 5 (Lv 11+), 6 (Lv 21+) | ATK 28 (HP 84) | Shoots one enemy every 1 s | Hard Hat, Lure, Bird |
|  | Bubble Bomber Man (Bomber Man · R) | Basic Bomber Man minion. / Has low HP but performs AoE attacks. | 100 (level-up 100 each) | 10 s | 4 (Lv 1+), 5 (Lv 11+), 6 (Lv 21+) | ATK 5 (HP 42) | Lobs a shell at enemies in a circle (size 10) every 2 s | — |
|  | Bubble Grenade Man (Bomber Man · SR) | Advanced Bomber Man minion. / Performs AoE attacks and explodes when it dies, dealing damage to its surroundings. | 200 (level-up 200 each) | 15 s | 4 (Lv 1+), 5 (Lv 11+), 6 (Lv 21+) | ATK 11 (HP 84) | Lobs a shell at enemies in a circle (size 10) every 2 s; Explodes on death, hitting enemies in a circle (size 10) for 100% of ATK | — |
|  | Bubble Missile Man (Bomber Man · SR) | Advanced Bomber Man minion. / Performs AoE attacks and deals sustained damage to the area where the missiles explode. | 200 (level-up 200 each) | 15 s | 4 (Lv 1+), 5 (Lv 11+), 6 (Lv 21+) | ATK 11 (HP 84) | Lobs a shell at enemies in a circle (size 10), 5 hits every 2 s; leaves a damaging zone for 3 s (ticks every 1 s) | — |
|  | Bubble Healer (Healer · R) | Basic Healer minion. / Restores allies' HP. / Unable to attack any Raptures. | 80 (level-up 80 each) | 10 s | 4 (Lv 1+), 5 (Lv 11+), 6 (Lv 21+) | ATK 7 (HP 18) | Heals one ally every 3 s | — |
|  | Bubble Medic (Healer · SR) | Advanced Healer minion. / Restores the HP of allies within the range. / Unable to attack any Raptures. | 160 (level-up 160 each) | 15 s | 4 (Lv 1+), 5 (Lv 11+), 6 (Lv 21+) | ATK 5 (HP 36) | Heals allies in a circle (size 10) every 4 s | — |
|  | Bubble Nurse (Healer · SR) | Advanced Healer minion. / Enhances the ATK or potency of HP recovery of allies within range. / Unable to attack any Rapture. | 160 (level-up 160 each) | 15 s | 4 (Lv 1+), 5 (Lv 11+), 6 (Lv 21+) | ATK 2 (HP 36) | Raises ATK of allies in a circle (size 10) by 20% for 4 s every 1 s | — |
|  | Bubble Little Mermaid (Hero · SSR) | A hero created based on Little Mermaid's image. / Once her trait is activated, she uses her special skill and uses bubbles to attack Raptures across the screen. / Attacks all Raptures and has an advantage against any type of Rapture. | 300 (level-up 250 each) | 180 s | 1 | ATK 17 (HP 874) | Strike on enemies in a 7×11 area every 3 s; Special skill (needs a trait): hits every enemy on screen | Every regular Rapture (not bosses) |
|  | Bubble Cinderella (Hero · SSR) | A hero created based on Cinderella's image. / Once her trait is activated, she uses her special skill and uses Glass Slippers to attack all Raptures across the screen. / Attacks all Raptures and has an advantage against any type of Rapture. | 300 (level-up 250 each) | 180 s | 1 | ATK 17 (HP 805) | Shoots enemies in a circle (size 10), 5 hits every 6 s; leaves a damaging zone for 3 s (ticks every 1 s); Special skill (needs a trait): hits every enemy on screen | Every regular Rapture (not bosses) |
|  | Bubble Abe (Hero · SSR) | A hero created based on Abe's image. / Once her trait is activated, she uses her special skill to recover all heroes and minions on the screen. / Unable to attack any Rapture. | 250 (level-up 225 each) | 180 s | 1 | ATK 60 (HP 432) | Heals allies in a circle (size 10) every 4 s; Special skill (needs a trait): heals every ally on screen by 50% | — |

Cost is in Summon Bubbles at Lv 1. Stats are Lv 1 base values. Attack timings are at normal speed.

#### Stat growth by level

| Level | Minions | Bubble Little Mermaid / Bubble Cinderella | Bubble Abe |
|---|---|---|---|
| 1 | ×1 | ×1 | ×1 |
| 2 | ×1.5 | ATK ×1.94 · HP ×1.96 | ATK ×1.4 · HP ×1.5 |
| 3 | ×2 | ATK ×2.71 · HP ×2.78 | ×2 |
| 5 | ×3 | ATK ×4.82 · HP ×4.87 | ×3 |
| 10 | ×5.5 | ATK ×10.88 · HP ×11.13 | ATK ×5.4 · HP ×5.5 |
| 11 | ×6 | ATK ×26.82 · HP ×27.35 | ATK ×13.1 · HP ×13.13 |
| 15 | ×8 | ATK ×21.94 · HP ×22.39 | ×9.75 |
| 20 | ×10.5 | ATK ×31 · HP ×31.65 | ATK ×13 · HP ×12.88 |
| 21 | ×11 | ATK ×94.88 · HP ×96.78 | ×40 |
| 25 | ×13 | ATK ×48.35 · HP ×49.3 | ×19 |
| 30 | ×15.5 | ATK ×60.06 · HP ×61.3 | ATK ×22.6 · HP ×22.75 |
| 31 | ×16 | ATK ×62.47 · HP ×63.74 | ×23.5 |
| 35 | ×18 | ATK ×72 · HP ×73.48 | ×26.5 |
| 40 | ×20.5 | ATK ×84.18 · HP ×85.96 | ATK ×30.4 · HP ×30.25 |
| 45 | ×23 | ATK ×96.82 · HP ×98.83 | ×34 |
| 50 | ×25.5 | ATK ×109.47 · HP ×111.7 | ATK ×37.6 · HP ×37.75 |

Multiplier on base ATK / HP (×1 at Lv 1). Levels are bought in battle with Summon Bubbles and reset after each battle; the stage sets the cap. Some hero values jump at Lv 11 and 21 and drop back after: that is how the table has them.

#### Your tower

- **Base stats**: ATK 10, HP 98; level set by the stage
- **Attack**: Shoots one enemy every 1 s
- **Defeat**: The battle is lost when it falls.

### Raptures

Rapture stats grow with level the same way your units do. Bosses and towers are wave goals.

|  | Rapture | Description | Base stats | Per spawn | Drops | Attack | Countered by |
|---|---|---|---|---|---|---|---|
|  | Rapture Tower (Tower, ground, long-range) | Clear stage target. / The wave ends when the Rapture Tower is destroyed. | ATK 23 (HP 309) | 1 | — | Shoots one enemy every 1 s | — |
|  | Pelican (Small, ground, close-range) | Basic ground-type close-range Rapture. / Attacks by striking with its body. | ATK 9 (HP 27) | 4 (Lv 1+), 5 (Lv 11+), 6 (Lv 21+) | 10 | Melee attack on one enemy every 1 s | Bubble Defender; Bubble Guardian; Bubble Warlord; Bubble Little Mermaid; Bubble Cinderella |
|  | Fez (Small, ground, long-range) | Basic ground-type long-range Rapture. / Attacks by firing missiles from the ground. | ATK 6 (HP 18) | 4 (Lv 1+), 5 (Lv 11+), 6 (Lv 21+) | 10 | Shoots one enemy, 6 hits every 1 s | Bubble Attacker; Bubble Slayer; Bubble Warrior; Bubble Little Mermaid; Bubble Cinderella |
|  | Hard Hat (Small, air, long-range) | Basic aerial-type Rapture. / Attacks by firing missiles from the air. | ATK 6 (HP 18) | 4 (Lv 1+), 5 (Lv 11+), 6 (Lv 21+) | 10 | Shoots one enemy, 6 hits every 1 s | Bubble Gunner; Bubble Ranger; Bubble Sniper; Bubble Little Mermaid; Bubble Cinderella |
|  | Thief (Medium, ground, close-range) | Intermediate ground-type close-range Rapture. / Attacks using its tail. | ATK 18 (HP 59) | 2 (Lv 1+), 3 (Lv 11+), 4 (Lv 21+) | 15 | Melee attack on one enemy every 1 s | Bubble Defender; Bubble Guardian; Bubble Warlord; Bubble Little Mermaid; Bubble Cinderella |
|  | Curvy Leg (Medium, ground, long-range) | Intermediate ground-type long-range Rapture. / Attacks by firing missiles from the ground. | ATK 11 (HP 41) | 2 (Lv 1+), 3 (Lv 11+), 4 (Lv 21+) | 15 | Lobs a shell at one enemy, 2 hits every 1 s | Bubble Attacker; Bubble Slayer; Bubble Warrior; Bubble Little Mermaid; Bubble Cinderella |
|  | Lure (Medium, air, long-range) | Intermediate aerial-type Rapture. / Attacks by firing missiles from the air. | ATK 11 (HP 41) | 2 (Lv 1+), 3 (Lv 11+), 4 (Lv 21+) | 15 | Lobs a shell at one enemy, 2 hits every 1 s | Bubble Gunner; Bubble Ranger; Bubble Sniper; Bubble Little Mermaid; Bubble Cinderella |
|  | Bulwark (Large, ground, close-range) | Advanced ground-type close-range Rapture. / Performs AoE attacks by spinning its huge body. | ATK 18 (HP 180) | 1 | 20 | Melee attack on enemies in a 7×11 area every 1 s | Bubble Defender; Bubble Guardian; Bubble Warlord; Bubble Little Mermaid; Bubble Cinderella |
|  | Ant (Large, ground, long-range) | Advanced ground-type long-range Rapture. / Performs AoE attacks by firing missiles from the ground. | ATK 11 (HP 126) | 1 | 20 | Lobs a shell at enemies in a circle (size 10), 3 hits every 1 s | Bubble Attacker; Bubble Slayer; Bubble Warrior; Bubble Little Mermaid; Bubble Cinderella |
|  | Bird (Large, air, long-range) | Advanced aerial-type Rapture. / Performs AoE attacks by firing beams forward. | ATK 14 (HP 126) | 1 | 20 | Fires a beam at enemies in a circle (size 6), 4 hits every 1 s; leaves a damaging zone for 1.5 s (ticks every 0.5 s) | Bubble Gunner; Bubble Ranger; Bubble Sniper; Bubble Little Mermaid; Bubble Cinderella |
|  | Gluttony (Boss, ground, close-range) | Clear stage target. / Ground-type close-range Rapture boss. / Has relatively high HP and performs AoE attacks by swinging its tentacles. | ATK 16 (HP 540) | 1 | — | Melee attack on enemies in a 11×16 area every 1 s | — |
|  | Heavy Metal (Boss, ground, long-range) | Clear stage target. / Ground-type long-range Rapture boss. / Has relatively high ATK, high DEF, and performs AoE attacks using various weapons. | ATK 12 (HP 378) | 1 | — | Shoots enemies in a 11×16 area, 8 hits every 1 s | — |
|  | Cocytus (Boss, air, long-range) | Clear stage target. / Aerial-type Rapture boss. / Has relatively high ATK and performs AoE attacks using laser beams. | ATK 12 (HP 378) | 1 | — | Fires a beam at enemies in a circle (size 15), 4 hits every 1 s; leaves a damaging zone for 1.5 s (ticks every 0.5 s) | — |

“Per spawn” follows the same field that sets how many minions a summon gives, so it is most likely how many of this Rapture come out together at that level. “Drops” is Summon Bubbles gained per kill.

## Upgrades

### Research

Unlock new heroes and minions with Research Bubbles (from first clears). Research can be reset to get the bubbles back.

| Class | Unit | Cost | Needs |
|---|---|---|---|
| Defender | Bubble Defender | [Owned from the start] | — |
| Defender | Bubble Guardian | Research Bubble ×1 | Research Bubble Defender |
| Defender | Bubble Warlord | Research Bubble ×1 | Research Bubble Defender |
| Attacker | Bubble Attacker | [Owned from the start] | — |
| Attacker | Bubble Slayer | Research Bubble ×1 | Research Bubble Attacker |
| Attacker | Bubble Warrior | Research Bubble ×1 | Research Bubble Attacker |
| Gunner | Bubble Gunner | [Owned from the start] | — |
| Gunner | Bubble Ranger | Research Bubble ×1 | Research Bubble Gunner |
| Gunner | Bubble Sniper | Research Bubble ×1 | Research Bubble Gunner |
| Bomber Man | Bubble Bomber Man | [Owned from the start] | — |
| Bomber Man | Bubble Grenade Man | Research Bubble ×1 | Research Bubble Bomber Man |
| Bomber Man | Bubble Missile Man | Research Bubble ×1 | Research Bubble Bomber Man |
| Healer | Bubble Healer | [Owned from the start] | — |
| Healer | Bubble Medic | Research Bubble ×1 | Research Bubble Healer |
| Healer | Bubble Nurse | Research Bubble ×1 | Research Bubble Healer |
| Hero | Bubble Little Mermaid | [Owned from the start] | — |
| Hero | Bubble Cinderella | Research Bubble ×1 | Research Bubble Little Mermaid and event day 8 |
| Hero | Bubble Abe | Research Bubble ×1 | Research Bubble Little Mermaid and event day 15 |

### Traits

Permanent bonuses bought with Trait Bubbles. Traits can be reset for a refund.

|  | Trait | Max level | Effect | Cost |
|---|---|---|---|---|
|  | Summon Level Increase (Increases the level of heroes and minions summoned in the stage.) | 30 | +1 Lv per level, up to +30 Lv | 10 per level (300 Trait Bubbles in total) |
|  | Hero Skill Use - Summon (Uses an AoE skill that hits all enemies when summoning a hero in the stage.) | 1 | On | 2 per level (2 Trait Bubbles in total) |
|  | Summon Bubble Level Increase (Increases the basic level of Summon Bubbles, a currency used to summon and upgrade in stages. The maximum bubble limit will increase after the upgrade.) | 5 | +1 Lv per level, up to +5 Lv | 2 per level (10 Trait Bubbles in total) |
|  | Summoning Cooldown Reduction (Reduces cooldown time for summoning heroes and minions.) | 5 | −5% per level, up to −25% | 2 per level (10 Trait Bubbles in total) |
|  | Hero Skill Use - Cooldown (The hero uses an AoE skill that hits all enemies during every cooldown after being summoned in the stage.) | 1 | On | 2 per level (2 Trait Bubbles in total) |
|  | Summon Bubble Charge Level Increase (Increases the charging speed of Summon Bubbles, a currency used to summon and upgrade in stages.) | 5 | +10% per level, up to +50% | 2 per level (10 Trait Bubbles in total) |
|  | Summoning Cost Reduction (Reduces cost for summoning heroes and minions.) | 5 | −2% per level, up to −10% | 2 per level (10 Trait Bubbles in total) |
|  | Hero ATK Increase (Increases the ATK of heroes in the stage.) | 5 | +2% per level, up to +10% | 2 per level (10 Trait Bubbles in total) |

## Stages

### Easy

Destroy the Rapture tower (or boss) of every wave to clear a stage. Rapture levels climb wave by wave.

#### Easy - 1 · Normal Stage

- **Time limit**: 3:00
- **Waves**: 1
- **Unit and Summon Bubble level cap**: Lv 2
- **Unlock**: From the start
- **First clear**: Research Bubble ×2

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Grassland | Rapture Tower; Lv 1 · HP 309 · ATK 23 | Pelican | Lv 1 (fixed order) | 6 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 s apart, then one every 22.5 s | Lv 1 (HP 98) |

#### Easy - 2 · Normal Stage

- **Time limit**: 3:00
- **Waves**: 1
- **Unit and Summon Bubble level cap**: Lv 3
- **Unlock**: Clear Easy - 1
- **First clear**: Trait Bubble ×10

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Grassland | Rapture Tower; Lv 2 · HP 616 · ATK 45 | Fez; Pelican | Lv 2 (fixed order) | 6 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 s apart, then one every 22.5 s | Lv 2 (HP 195) |

#### Easy - 3 · Normal Stage

- **Time limit**: 3:00
- **Waves**: 1
- **Unit and Summon Bubble level cap**: Lv 3
- **Unlock**: Clear Easy - 2
- **First clear**: Trait Bubble ×15

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Grassland | Rapture Tower; Lv 2 · HP 616 · ATK 45 | Pelican; Thief | Lv 2 (fixed order) | 7 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 / 9 s apart, then one every 22.5 s | Lv 2 (HP 195) |

#### Easy - 4 · Normal Stage

- **Time limit**: 3:00
- **Waves**: 1
- **Unit and Summon Bubble level cap**: Lv 4
- **Unlock**: Clear Easy - 3
- **First clear**: Research Bubble ×2

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Grassland | Rapture Tower; Lv 3 · HP 869 · ATK 64 | Fez; Curvy Leg | Lv 3 (fixed order) | 7 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 / 9 s apart, then one every 22.5 s | Lv 3 (HP 281) |

#### Easy - 5 · Normal Stage

- **Time limit**: 6:00
- **Waves**: 2
- **Unit and Summon Bubble level cap**: Lv 4
- **Unlock**: Clear Easy - 4
- **First clear**: Trait Bubble ×10

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Grassland | Rapture Tower; Lv 3 · HP 869 · ATK 64 | Pelican; Thief; Fez | Lv 3 (fixed order) | 6 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 s apart, then one every 22.5 s | Lv 3 (HP 281) |
| 2 | Grassland | Rapture Tower; Lv 4 · HP 1,183 · ATK 86 | Thief; Pelican; Bulwark; Fez | Lv 4 (fixed order) | 7 groups, 2.5 / 9.5 / 9.5 / 9 / 9 / 8.5 / 8.5 s apart, then one every 22.5 s | Lv 4 (HP 368) |

#### Easy - 6 · Normal Stage

- **Time limit**: 6:00
- **Waves**: 2
- **Unit and Summon Bubble level cap**: Lv 5
- **Unlock**: Clear Easy - 5
- **First clear**: Trait Bubble ×10

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Grassland | Rapture Tower; Lv 4 · HP 1,183 · ATK 86 | Fez; Curvy Leg; Pelican | Lv 4 (fixed order) | 6 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 s apart, then one every 22.5 s | Lv 4 (HP 368) |
| 2 | Grassland | Rapture Tower; Lv 5 · HP 1,530 · ATK 112 | Curvy Leg; Fez; Pelican | Lv 5 (fixed order) | 7 groups, 2.5 / 9.5 / 9.5 / 9 / 9 / 8.5 / 8.5 s apart, then one every 22.5 s | Lv 5 (HP 487) |

#### Easy - 7 · Boss Stage

- **Time limit**: 9:00
- **Waves**: 3
- **Unit and Summon Bubble level cap**: Lv 7
- **Unlock**: Clear Easy - 6
- **First clear**: Trait Bubble ×15

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Grassland | Rapture Tower; Lv 5 · HP 1,530 · ATK 112 | Pelican; Fez; Thief; Ant | Lv 5 (fixed order) | 6 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 s apart, then one every 22.5 s | Lv 5 (HP 487) |
| 2 | Grassland | Rapture Tower; Lv 6 · HP 1,898 · ATK 139 | Fez; Pelican; Curvy Leg; Bulwark | Lv 6 (fixed order) | 6 groups, 2.5 / 9.5 / 9.5 / 9 / 9 / 8.5 s apart, then one every 22.5 s | Lv 6 (HP 595) |
| 3 | Grassland | Gluttony; [Boss]; Lv 7 · HP 3,985 · ATK 114 | Pelican; Fez; Thief; Curvy Leg | Lv 7 (random groups) | then one every 22.5 s | Lv 7 (HP 714) |

### Normal

Destroy the Rapture tower (or boss) of every wave to clear a stage. Rapture levels climb wave by wave.

#### Normal - 1 · Normal Stage

- **Time limit**: 6:00
- **Waves**: 2
- **Unit and Summon Bubble level cap**: Lv 8
- **Unlock**: Clear Easy - 7 and event day 8
- **First clear**: Research Bubble ×2

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Snowfield | Rapture Tower; Lv 7 · HP 2,284 · ATK 166 | Hard Hat; Thief; Pelican | Lv 7 (fixed order) | 6 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 s apart, then one every 22.5 s | Lv 7 (HP 714) |
| 2 | Snowfield | Rapture Tower; Lv 8 · HP 2,683 · ATK 196 | Pelican; Thief; Hard Hat; Bulwark | Lv 8 (fixed order) | 7 groups, 2.5 / 9.5 / 9.5 / 9 / 9 / 8.5 / 8.5 s apart, then one every 22.5 s | Lv 8 (HP 843) |

#### Normal - 2 · Normal Stage

- **Time limit**: 6:00
- **Waves**: 2
- **Unit and Summon Bubble level cap**: Lv 8
- **Unlock**: Clear Normal - 1 and event day 8
- **First clear**: Trait Bubble ×20

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Snowfield | Rapture Tower; Lv 7 · HP 2,284 · ATK 166 | Pelican; Lure; Hard Hat | Lv 7 (fixed order) | 6 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 s apart, then one every 22.5 s | Lv 7 (HP 714) |
| 2 | Snowfield | Rapture Tower; Lv 8 · HP 2,683 · ATK 196 | Curvy Leg; Hard Hat; Pelican; Ant; Fez | Lv 8 (fixed order) | 7 groups, 2.5 / 9.5 / 9.5 / 9 / 9 / 8.5 / 8.5 s apart, then one every 22.5 s | Lv 8 (HP 843) |

#### Normal - 3 · Normal Stage

- **Time limit**: 6:00
- **Waves**: 2
- **Unit and Summon Bubble level cap**: Lv 10
- **Unlock**: Clear Normal - 2 and event day 8
- **First clear**: Trait Bubble ×25

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Snowfield | Rapture Tower; Lv 9 · HP 3,093 · ATK 225 | Hard Hat; Thief; Pelican; Lure | Lv 9 (fixed order) | 6 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 s apart, then one every 22.5 s | Lv 9 (HP 973) |
| 2 | Snowfield | Rapture Tower; Lv 10 · HP 3,512 · ATK 256 | Lure; Fez; Hard Hat; Bird | Lv 10 (fixed order) | 7 groups, 2.5 / 9.5 / 9.5 / 9 / 9 / 8.5 / 8.5 s apart, then one every 22.5 s | Lv 10 (HP 1,102) |

#### Normal - 4 · Normal Stage

- **Time limit**: 9:00
- **Waves**: 3
- **Unit and Summon Bubble level cap**: Lv 13
- **Unlock**: Clear Normal - 3 and event day 8
- **First clear**: Research Bubble ×2

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Snowfield | Rapture Tower; Lv 11 · HP 8,647 · ATK 629 | Pelican; Thief; Bulwark; Hard Hat | Lv 11 (fixed order) | 7 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 / 9 s apart, then one every 22.5 s | Lv 11 (HP 2,722) |
| 2 | Snowfield | Rapture Tower; Lv 12 · HP 5,392 · ATK 392 | Hard Hat; Lure; Bird; Pelican | Lv 12 (fixed order) | 7 groups, 2.5 / 9.5 / 9.5 / 9 / 9 / 8.5 / 8.5 s apart, then one every 22.5 s | Lv 12 (HP 1,691) |
| 3 | Snowfield | Rapture Tower; Lv 13 · HP 5,944 · ATK 433 | Thief; Bird; Hard Hat; Pelican; Bulwark; Lure | Lv 13 (fixed order) | 8 groups, 2 / 9 / 9 / 8.5 / 8.5 / 8 / 8 / 7.5 s apart, then one every 22.5 s | Lv 13 (HP 1,867) |

#### Normal - 5 · Normal Stage

- **Time limit**: 9:00
- **Waves**: 3
- **Unit and Summon Bubble level cap**: Lv 13
- **Unlock**: Clear Normal - 4 and event day 8
- **First clear**: Trait Bubble ×20

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Snowfield | Rapture Tower; Lv 11 · HP 8,647 · ATK 629 | Hard Hat; Lure; Pelican; Bird; Fez | Lv 11 (fixed order) | 7 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 / 9 s apart, then one every 22.5 s | Lv 11 (HP 2,722) |
| 2 | Snowfield | Rapture Tower; Lv 12 · HP 5,392 · ATK 392 | Fez; Curvy Leg; Pelican; Ant; Hard Hat | Lv 12 (fixed order) | 7 groups, 2.5 / 9.5 / 9.5 / 9 / 9 / 8.5 / 8.5 s apart, then one every 22.5 s | Lv 12 (HP 1,691) |
| 3 | Snowfield | Rapture Tower; Lv 13 · HP 5,944 · ATK 433 | Lure; Ant; Hard Hat; Pelican; Bird; Curvy Leg; Fez | Lv 13 (fixed order) | 8 groups, 2 / 9 / 9 / 8.5 / 8.5 / 8 / 8 / 7.5 s apart, then one every 22.5 s | Lv 13 (HP 1,867) |

#### Normal - 6 · Normal Stage

- **Time limit**: 9:00
- **Waves**: 3
- **Unit and Summon Bubble level cap**: Lv 15
- **Unlock**: Clear Normal - 5 and event day 8
- **First clear**: Trait Bubble ×20

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Snowfield | Rapture Tower; Lv 13 · HP 5,944 · ATK 433 | Fez; Curvy Leg; Ant; Pelican | Lv 13 (fixed order) | 7 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 / 9 s apart, then one every 22.5 s | Lv 13 (HP 1,867) |
| 2 | Snowfield | Rapture Tower; Lv 14 · HP 6,506 · ATK 473 | Pelican; Thief; Bulwark; Fez | Lv 14 (fixed order) | 7 groups, 2.5 / 9.5 / 9.5 / 9 / 9 / 8.5 / 8.5 s apart, then one every 22.5 s | Lv 14 (HP 2,042) |
| 3 | Snowfield | Rapture Tower; Lv 15 · HP 7,075 · ATK 515 | Curvy Leg; Bulwark; Fez; Pelican; Ant; Thief | Lv 15 (fixed order) | 8 groups, 2 / 9 / 9 / 8.5 / 8.5 / 8 / 8 / 7.5 s apart, then one every 22.5 s | Lv 15 (HP 2,231) |

#### Normal - 7 · Boss Stage

- **Time limit**: 12:00
- **Waves**: 4
- **Unit and Summon Bubble level cap**: Lv 18
- **Unlock**: Clear Normal - 6 and event day 8
- **First clear**: Trait Bubble ×25

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Snowfield | Rapture Tower; Lv 15 · HP 7,075 · ATK 515 | Pelican; Fez; Thief; Bulwark; Curvy Leg | Lv 15 (fixed order) | 7 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 / 9 s apart, then one every 22.5 s | Lv 15 (HP 2,231) |
| 2 | Snowfield | Rapture Tower; Lv 16 · HP 7,647 · ATK 556 | Hard Hat; Pelican; Lure; Bird; Thief | Lv 16 (fixed order) | 7 groups, 2.5 / 9.5 / 9.5 / 9 / 9 / 8.5 / 8.5 s apart, then one every 22.5 s | Lv 16 (HP 2,393) |
| 3 | Snowfield | Rapture Tower; Lv 17 · HP 8,229 · ATK 599 | Fez; Hard Hat; Curvy Leg; Ant; Lure | Lv 17 (fixed order) | 7 groups, 2 / 9 / 9 / 8.5 / 8.5 / 8 / 8 s apart, then one every 22.5 s | Lv 17 (HP 2,582) |
| 4 | Snowfield | Cocytus; [Boss]; Lv 18 · HP 10,767 · ATK 332 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure | Lv 18 (random groups) | then one every 22.5 s | Lv 18 (HP 2,771) |

### Hard

Destroy the Rapture tower (or boss) of every wave to clear a stage. Rapture levels climb wave by wave.

#### Hard - 1 · Boss Stage

- **Time limit**: 9:00
- **Waves**: 3
- **Unit and Summon Bubble level cap**: Lv 20
- **Unlock**: Clear Normal - 7 and event day 15
- **First clear**: Research Bubble ×2

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Wilderness | Rapture Tower; Lv 18 · HP 8,818 · ATK 641 | Fez; Pelican; Curvy Leg; Lure; Hard Hat; Bird | Lv 18 (fixed order) | 7 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 / 9 s apart, then one every 22.5 s | Lv 18 (HP 2,771) |
| 2 | Wilderness | Rapture Tower; Lv 19 · HP 9,407 · ATK 684 | Hard Hat; Ant; Lure; Curvy Leg; Bird; Thief; Pelican | Lv 19 (fixed order) | 7 groups, 2.5 / 9.5 / 9.5 / 9 / 9 / 8.5 / 8.5 s apart, then one every 22.5 s | Lv 19 (HP 2,960) |
| 3 | Wilderness | Heavy Metal; [Boss]; Lv 20 · HP 12,214 · ATK 376 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure | Lv 20 (random groups) | then one every 22.5 s | Lv 20 (HP 3,135) |

#### Hard - 2 · Boss Stage

- **Time limit**: 9:00
- **Waves**: 3
- **Unit and Summon Bubble level cap**: Lv 20
- **Unlock**: Clear Hard - 1 and event day 15
- **First clear**: Trait Bubble ×30

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Wilderness | Rapture Tower; Lv 18 · HP 8,818 · ATK 641 | Pelican; Hard Hat; Curvy Leg; Thief; Fez; Ant | Lv 18 (fixed order) | 7 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 / 9 s apart, then one every 22.5 s | Lv 18 (HP 2,771) |
| 2 | Wilderness | Rapture Tower; Lv 19 · HP 9,407 · ATK 684 | Fez; Bulwark; Curvy Leg; Thief; Ant | Lv 19 (fixed order) | 7 groups, 2.5 / 9.5 / 9.5 / 9 / 9 / 8.5 / 8.5 s apart, then one every 22.5 s | Lv 19 (HP 2,960) |
| 3 | Wilderness | Gluttony; [Boss]; Lv 20 · HP 17,450 · ATK 499 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure | Lv 20 (random groups) | then one every 22.5 s | Lv 20 (HP 3,135) |

#### Hard - 3 · Boss Stage

- **Time limit**: 9:00
- **Waves**: 3
- **Unit and Summon Bubble level cap**: Lv 23
- **Unlock**: Clear Hard - 2 and event day 15
- **First clear**: Trait Bubble ×35

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Wilderness | Rapture Tower; Lv 21 · HP 30,624 · ATK 2,226 | Hard Hat; Fez; Lure; Thief; Pelican; Bulwark | Lv 21 (fixed order) | 7 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 / 9 s apart, then one every 22.5 s | Lv 21 (HP 9,624) |
| 2 | Wilderness | Rapture Tower; Lv 22 · HP 13,395 · ATK 974 | Pelican; Bird; Thief; Lure; Bulwark | Lv 22 (fixed order) | 7 groups, 2.5 / 9.5 / 9.5 / 9 / 9 / 8.5 / 8.5 s apart, then one every 22.5 s | Lv 22 (HP 4,197) |
| 3 | Wilderness | Cocytus; [Boss]; Lv 23 · HP 17,241 · ATK 530 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure | Lv 23 (random groups) | then one every 22.5 s | Lv 23 (HP 4,439) |

#### Hard - 4 · Boss Stage

- **Time limit**: 12:00
- **Waves**: 4
- **Unit and Summon Bubble level cap**: Lv 26
- **Unlock**: Clear Hard - 3 and event day 15
- **First clear**: Research Bubble ×2

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Wilderness | Rapture Tower; Lv 24 · HP 14,872 · ATK 1,081 | Pelican; Fez; Hard Hat; Bulwark; Thief; Ant | Lv 24 (fixed order) | 8 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 / 9 / 8.5 s apart, then one every 22.5 s | Lv 24 (HP 4,667) |
| 2 | Wilderness | Rapture Tower; Lv 25 · HP 15,596 · ATK 1,134 | Fez; Pelican; Ant; Curvy Leg; Hard Hat; Bulwark | Lv 25 (fixed order) | 8 groups, 2.5 / 9.5 / 9.5 / 9 / 9 / 8.5 / 8.5 / 8 s apart, then one every 22.5 s | Lv 25 (HP 4,909) |
| 3 | Wilderness | Cocytus; [Boss]; Lv 26 · HP 19,981 · ATK 615 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 26 (random groups) | then one every 22.5 s | Lv 26 (HP 5,136) |
| 4 | Wilderness | Gluttony; [Boss]; Lv 27 · HP 29,833 · ATK 853 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 27 (random groups) | then one every 22.5 s | Lv 27 (HP 5,363) |

#### Hard - 5 · Boss Stage

- **Time limit**: 12:00
- **Waves**: 4
- **Unit and Summon Bubble level cap**: Lv 27
- **Unlock**: Clear Hard - 4 and event day 15
- **First clear**: Trait Bubble ×30

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Wilderness | Rapture Tower; Lv 24 · HP 14,872 · ATK 1,081 | Fez; Hard Hat; Pelican; Ant; Curvy Leg; Bird | Lv 24 (fixed order) | 8 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 / 9 / 8.5 s apart, then one every 22.5 s | Lv 24 (HP 4,667) |
| 2 | Wilderness | Rapture Tower; Lv 25 · HP 15,596 · ATK 1,134 | Hard Hat; Fez; Bird; Lure; Pelican; Ant | Lv 25 (fixed order) | 8 groups, 2.5 / 9.5 / 9.5 / 9 / 9 / 8.5 / 8.5 / 8 s apart, then one every 22.5 s | Lv 25 (HP 4,909) |
| 3 | Wilderness | Gluttony; [Boss]; Lv 26 · HP 28,545 · ATK 816 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 26 (random groups) | then one every 22.5 s | Lv 26 (HP 5,136) |
| 4 | Wilderness | Heavy Metal; [Boss]; Lv 27 · HP 20,883 · ATK 643 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 27 (random groups) | then one every 22.5 s | Lv 27 (HP 5,363) |

#### Hard - 6 · Boss Stage

- **Time limit**: 12:00
- **Waves**: 4
- **Unit and Summon Bubble level cap**: Lv 30
- **Unlock**: Clear Hard - 5 and event day 15
- **First clear**: Trait Bubble ×30

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Wilderness | Rapture Tower; Lv 27 · HP 17,103 · ATK 1,244 | Hard Hat; Pelican; Fez; Bird; Lure; Bulwark | Lv 27 (fixed order) | 8 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 / 9 / 8.5 s apart, then one every 22.5 s | Lv 27 (HP 5,363) |
| 2 | Wilderness | Rapture Tower; Lv 28 · HP 17,877 · ATK 1,299 | Pelican; Hard Hat; Bulwark; Thief; Fez; Bird | Lv 28 (fixed order) | 8 groups, 2.5 / 9.5 / 9.5 / 9 / 9 / 8.5 / 8.5 / 8 s apart, then one every 22.5 s | Lv 28 (HP 5,622) |
| 3 | Wilderness | Heavy Metal; [Boss]; Lv 29 · HP 22,725 · ATK 699 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 29 (random groups) | then one every 22.5 s | Lv 29 (HP 5,833) |
| 4 | Wilderness | Cocytus; [Boss]; Lv 30 · HP 23,670 · ATK 729 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 30 (random groups) | then one every 22.5 s | Lv 30 (HP 6,092) |

#### Hard - 7 · Boss Stage

- **Time limit**: 15:00
- **Waves**: 5
- **Unit and Summon Bubble level cap**: Lv 34
- **Unlock**: Clear Hard - 6 and event day 15
- **First clear**: Trait Bubble ×59

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower |
|---|---|---|---|---|---|---|
| 1 | Wilderness | Rapture Tower; Lv 30 · HP 19,387 · ATK 1,410 | Pelican; Fez; Hard Hat; Bulwark; Ant; Lure; Thief; Curvy Leg | Lv 30 (fixed order) | 8 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 / 9 / 8.5 s apart, then one every 22.5 s | Lv 30 (HP 6,092) |
| 2 | Wilderness | Rapture Tower; Lv 31 · HP 20,163 · ATK 1,466 | Thief; Fez; Curvy Leg; Bird; Hard Hat; Bulwark; Lure; Ant | Lv 31 (fixed order) | 8 groups, 2.5 / 9.5 / 9.5 / 9 / 9 / 8.5 / 8.5 / 8 s apart, then one every 22.5 s | Lv 31 (HP 6,335) |
| 3 | Wilderness | Cocytus; [Boss]; Lv 32 · HP 25,568 · ATK 787 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 32 (random groups) | then one every 22.5 s | Lv 32 (HP 6,578) |
| 4 | Wilderness | Heavy Metal; [Boss]; Lv 33 · HP 26,487 · ATK 815 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 33 (random groups) | then one every 22.5 s | Lv 33 (HP 6,805) |
| 5 | Wilderness | Gluttony; [Boss]; Lv 34 · HP 39,242 · ATK 1,121 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 34 (random groups) | then one every 22.5 s | Lv 34 (HP 7,064) |

### Challenge

Endless waves: how far can you get?

#### How Challenge works

Waves never stop: clear as many as you can before your tower falls or time (30 min) runs out. After wave 35 the game loops back to waves 27–35 (up to wave 200), and the Raptures keep levelling (their stats stop growing past Lv 51, the last row of the level table). Clearing the last Easy, Normal or Hard stage lets you skip the matching early waves; each skipped wave gives 100 Summon Bubbles.

#### Challenge · Boss Stage

- **Time limit**: 30:00
- **Waves**: 35 listed; afterwards waves 27–35 repeat, up to wave 200
- **Unit and Summon Bubble level cap**: Lv 50
- **Unlock**: Clear Easy - 5

| Wave | Map | Goal | Raptures that appear | Rapture level | Spawns | Your tower | Skipped |
|---|---|---|---|---|---|---|---|
| 1 | Grassland | Rapture Tower; Lv 2 · HP 616 · ATK 45 | Pelican; Fez | Lv 2 (fixed order) | 8 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 / 9 / 8.5 s apart, then one every 20 s | Lv 2 (HP 195) | after Easy - 7 (+100 Summon Bubbles) |
| 2 | Grassland | Rapture Tower; Lv 4 · HP 1,183 · ATK 86 | Fez; Pelican; Thief; Bulwark; Curvy Leg | Lv 4 (fixed order) | 8 groups, 3 / 10 / 10 / 9.5 / 9.5 / 9 / 9 / 8.5 s apart, then one every 20 s | Lv 4 (HP 368) | after Easy - 7 (+100 Summon Bubbles) |
| 3 | Snowfield | Rapture Tower; Lv 7 · HP 2,284 · ATK 166 | Hard Hat; Pelican; Lure; Thief; Bird | Lv 7 (fixed order) | 8 groups, 3 / 9.5 / 9.5 / 9 / 9 / 8.5 / 8.5 / 8 s apart, then one every 17.5 s | Lv 7 (HP 714) | after Normal - 7 (+100 Summon Bubbles) |
| 4 | Snowfield | Rapture Tower; Lv 9 · HP 3,093 · ATK 225 | Fez; Hard Hat; Lure; Curvy Leg; Ant | Lv 9 (fixed order) | 8 groups, 3 / 9.5 / 9.5 / 9 / 9 / 8.5 / 8.5 / 8 s apart, then one every 17.5 s | Lv 9 (HP 973) | after Normal - 7 (+100 Summon Bubbles) |
| 5 | Snowfield | Gluttony; [Boss]; Lv 11 · HP 15,083 · ATK 431 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure | Lv 11 (random groups) | then one every 17.5 s | Lv 11 (HP 2,722) | after Normal - 7 (+100 Summon Bubbles) |
| 6 | Wilderness | Rapture Tower; Lv 14 · HP 6,506 · ATK 473 | Pelican; Fez; Hard Hat; Lure; Thief; Curvy Leg; Bulwark; Ant; Bird | Lv 14 (random groups) | 8 groups, 3 / 9 / 9 / 8.5 / 8.5 / 8 / 8 / 7.5 s apart, then one every 17.5 s | Lv 14 (HP 2,042) | after Hard - 7 (+100 Summon Bubbles) |
| 7 | Wilderness | Rapture Tower; Lv 18 · HP 8,818 · ATK 641 | Pelican; Fez; Hard Hat; Bulwark; Ant; Bird; Curvy Leg; Lure; Thief | Lv 18 (random groups) | 8 groups, 3 / 9 / 9 / 8.5 / 8.5 / 8 / 8 / 7.5 s apart, then one every 17.5 s | Lv 18 (HP 2,771) | after Hard - 7 (+100 Summon Bubbles) |
| 8 | Wilderness | Heavy Metal; [Boss]; Lv 23 · HP 17,241 · ATK 530 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure | Lv 23 (random groups) | then one every 17.5 s | Lv 23 (HP 4,439) | after Hard - 7 (+100 Summon Bubbles) |
| 9 | Grassland | Rapture Tower; Lv 28 · HP 17,877 · ATK 1,299 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 28 (random groups) | 8 groups, 3 / 8.5 / 8.5 / 8 / 8 / 7.5 / 7.5 / 7 s apart, then one every 17.5 s | Lv 28 (HP 5,622) |  |
| 10 | Grassland | Rapture Tower; Lv 31 · HP 20,163 · ATK 1,466 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 31 (random groups) | 8 groups, 3 / 8.5 / 8.5 / 8 / 8 / 7.5 / 7.5 / 7 s apart, then one every 17.5 s | Lv 31 (HP 6,335) |  |
| 11 | Grassland | Cocytus; [Boss]; Lv 34 · HP 27,469 · ATK 846 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure | Lv 34 (random groups) | then one every 17.5 s | Lv 34 (HP 7,064) |  |
| 12 | Snowfield | Rapture Tower; Lv 37 · HP 24,864 · ATK 1,808 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 37 (random groups) | 8 groups, 2.9 / 8.25 / 8.25 / 7.75 / 7.75 / 7.25 / 7.25 / 6.75 s apart, then one every 17.4 s | Lv 37 (HP 7,809) |  |
| 13 | Snowfield | Rapture Tower; Lv 41 · HP 28,043 · ATK 2,039 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 41 (random groups) | 8 groups, 2.9 / 8.25 / 8.25 / 7.75 / 7.75 / 7.25 / 7.25 / 6.75 s apart, then one every 17.4 s | Lv 40 (HP 8,538) |  |
| 14 | Snowfield | Gluttony; [Boss]; Lv 45 · HP 54,527 · ATK 1,559 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure | Lv 45 (random groups) | then one every 17.4 s | Lv 43 (HP 9,299) |  |
| 15 | Wilderness | Rapture Tower; Lv 49 · HP 34,528 · ATK 2,510 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 49 (random groups) | 8 groups, 2.8 / 8 / 8 / 7.5 / 7.5 / 7 / 7 / 6.5 s apart, then one every 17.3 s | Lv 46 (HP 10,061) |  |
| 16 | Wilderness | Rapture Tower; Lv 53 · HP 35,345 · ATK 2,569 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 53 (random groups) | 8 groups, 2.8 / 8 / 8 / 7.5 / 7.5 / 7 / 7 / 6.5 s apart, then one every 17.3 s | Lv 49 (HP 10,838) |  |
| 17 | Wilderness | Heavy Metal; [Boss]; Lv 57 · HP 43,154 · ATK 1,328 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 57 (random groups) | then one every 17.3 s | Lv 50 (HP 11,098) |  |
| 18 | Grassland | Rapture Tower; Lv 61 · HP 35,345 · ATK 2,569 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 61 (random groups) | 8 groups, 2.7 / 7.75 / 7.75 / 7.25 / 7.25 / 6.75 / 6.75 / 6.25 s apart, then one every 17.2 s | Lv 50 (HP 11,098) |  |
| 19 | Grassland | Rapture Tower; Lv 62 · HP 35,345 · ATK 2,569 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 62 (random groups) | 8 groups, 2.7 / 7.75 / 7.75 / 7.25 / 7.25 / 6.75 / 6.75 / 6.25 s apart, then one every 17.2 s | Lv 50 (HP 11,098) |  |
| 20 | Grassland | Cocytus; [Boss]; Lv 63 · HP 43,154 · ATK 1,328 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 63 (random groups) | then one every 17.2 s | Lv 50 (HP 11,098) |  |
| 21 | Snowfield | Rapture Tower; Lv 64 · HP 35,345 · ATK 2,569 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 64 (random groups) | 8 groups, 2.5 / 7.25 / 7.25 / 6.75 / 6.75 / 6.25 / 6.25 / 5.75 s apart, then one every 17 s | Lv 50 (HP 11,098) |  |
| 22 | Snowfield | Rapture Tower; Lv 65 · HP 35,345 · ATK 2,569 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 65 (random groups) | 8 groups, 2.5 / 7.25 / 7.25 / 6.75 / 6.75 / 6.25 / 6.25 / 5.75 s apart, then one every 17 s | Lv 50 (HP 11,098) |  |
| 23 | Snowfield | Gluttony; [Boss]; Lv 66 · HP 61,648 · ATK 1,762 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 66 (random groups) | then one every 17 s | Lv 50 (HP 11,098) |  |
| 24 | Wilderness | Rapture Tower; Lv 67 · HP 35,345 · ATK 2,569 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 67 (random groups) | 8 groups, 2.3 / 6.75 / 6.75 / 6.25 / 6.25 / 5.75 / 5.75 / 5.25 s apart, then one every 16.8 s | Lv 50 (HP 11,098) |  |
| 25 | Wilderness | Rapture Tower; Lv 68 · HP 35,345 · ATK 2,569 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 68 (random groups) | 8 groups, 2.3 / 6.75 / 6.75 / 6.25 / 6.25 / 5.75 / 5.75 / 5.25 s apart, then one every 16.8 s | Lv 50 (HP 11,098) |  |
| 26 | Wilderness | Heavy Metal; [Boss]; Lv 69 · HP 43,154 · ATK 1,328 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 69 (random groups) | then one every 16.8 s | Lv 50 (HP 11,098) |  |
| 27 | Grassland | Rapture Tower; Lv 70 · HP 35,345 · ATK 2,569 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 70 (random groups) | 8 groups, 2.1 / 6.25 / 6.25 / 5.75 / 5.75 / 5.25 / 5.25 / 4.75 s apart, then one every 16.6 s | Lv 50 (HP 11,098) |  |
| 28 | Grassland | Rapture Tower; Lv 71 · HP 35,345 · ATK 2,569 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 71 (random groups) | 8 groups, 2.1 / 6.25 / 6.25 / 5.75 / 5.75 / 5.25 / 5.25 / 4.75 s apart, then one every 16.6 s | Lv 50 (HP 11,098) |  |
| 29 | Grassland | Cocytus; [Boss]; Lv 72 · HP 43,154 · ATK 1,328 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 72 (random groups) | then one every 16.6 s | Lv 50 (HP 11,098) |  |
| 30 | Snowfield | Rapture Tower; Lv 73 · HP 35,345 · ATK 2,569 | Pelican; Fez; Hard Hat; Thief; Curvy Leg; Lure; Bulwark; Ant; Bird | Lv 73 (random groups) | 8 groups, 1.9 / 5.75 / 5.75 / 5.25 / 5.25 / 4.75 / 4.75 / 4.25 s apart, then one every 16.4 s | Lv 50 (HP 11,098) |  |

(5 more rows of 35 not shown; see the data table.)

## Missions

### Missions

Daily missions and one-time challenges.

#### Daily missions

| Mission | Points |
|---|---|
| Clear 1 wave(s) | 30 |
| Consume 100 Summon Bubble Currencies | 30 |
| Summon minion 5 time(s) | 40 |
| Summon hero 1 time(s) | 40 |
| Defeat Rapture 30 time(s) | 30 |

Reset every day. Each gives daily points.

#### Daily point rewards

| Points | Reward |
|---|---|
| 20 | Elysion Common Console ×2 |
| 40 | Missilis Common Console ×2 |
| 60 | Tetra Common Console ×2 |
| 80 | Pilgrim Common Console ×2 |
| 100 | Central Government Supply Chest I ×1 |

#### Challenges

| Mission | Reward |
|---|---|
| Clear Stage Easy - 3 | Advanced Recruit Voucher ×1 |
| Clear Stage Easy - 7 | Advanced Recruit Voucher ×1 |
| Clear Stage Normal - 3 | Advanced Recruit Voucher ×1 |
| Clear Stage Normal - 7 | Advanced Recruit Voucher ×1 |
| Clear Stage Hard - 3 | Advanced Recruit Voucher ×2 |
| Clear Stage Hard - 7 | Advanced Recruit Voucher ×2 |
| Survive 3 wave(s) in Challenge | BUBBLE MARCH Special Sticker I ×1 |
| Survive 6 wave(s) in Challenge | Advanced Recruit Voucher ×1 |
| Survive 12 wave(s) in Challenge | Advanced Recruit Voucher ×1 |
| Summon Bubble Little Mermaid 3 time(s) | BUBBLE MARCH Premium Sticker I ×1 |
| Summon Bubble Cinderella 3 time(s) | Ultra-Double Boost Module ×30 |
| Summon Bubble Abe 3 time(s) | BUBBLE MARCH Premium Sticker II ×1 |
| Defeat Rapture 200 time(s) | Skill Manual Box ×1 |
| Defeat Rapture 850 time(s) | Skill Manual Box ×2 |
| Defeat Rapture 2,000 time(s) | Skill Manual Box ×3 |
| Upgrade hero and minion 5 time(s) | Burst Manual Box ×1 |
| Upgrade hero and minion 15 time(s) | Burst Manual Box ×2 |
| Upgrade hero and minion 45 time(s) | Burst Manual Box ×3 |
| Summon minion 30 time(s) | Skill Manual I ×72 |
| Summon minion 100 time(s) | Skill Manual II ×48 |
| Summon minion 250 time(s) | Skill Manual III ×24 |
| Consume 5,000 Summon Bubble Currencies | Burst Manual I ×36 |
| Consume 15,000 Summon Bubble Currencies | Burst Manual II ×24 |
| Consume 55,000 Summon Bubble Currencies | Burst Manual III ×12 |
| Upgrade a minion to Lv. 5 | Attacker Common Console ×30 |
| Upgrade a minion to Lv. 15 | Defender Common Console ×30 |
| Upgrade a minion to Lv. 25 | Supporter Common Console ×30 |

One-time missions for the whole event.

### Missions (rerun)

Challenges of the rerun (Arcade) version.

#### Challenges

| Mission | Reward |
|---|---|
| Clear Stage Easy - 3 | Gem ×20 |
| Clear Stage Easy - 7 | Gem ×20 |
| Clear Stage Normal - 3 | Gem ×20 |
| Clear Stage Normal - 7 | Gem ×20 |
| Clear Stage Hard - 3 | Gem ×20 |
| Clear Stage Hard - 7 | Gem ×20 |
| Survive 3 wave(s) in Challenge | Gem ×20 |
| Survive 6 wave(s) in Challenge | Gem ×20 |
| Survive 12 wave(s) in Challenge | Gem ×20 |
| Summon Bubble Little Mermaid 3 time(s) | BUBBLE MARCH Premium Sticker I ×1 |
| Summon Bubble Cinderella 3 time(s) | Gem ×20 |
| Summon Bubble Abe 3 time(s) | BUBBLE MARCH Premium Sticker II ×1 |
| Defeat Rapture 2,000 time(s) | Gem ×20 |
| Upgrade hero and minion 45 time(s) | Gem ×20 |
| Summon minion 250 time(s) | Gem ×20 |
| Consume 55,000 Summon Bubble Currencies | Gem ×20 |
| Upgrade a minion to Lv. 25 | Gem ×20 |

One-time missions for the whole event.

## Data sources

All in `D:\Nikke Datamine\mpkparser\jsons` as `<Table>.json`.

| Table | Rows | Fields |
|---|---|---|
| `EventBubbleMarchManagerTable` | 2 | `id`, `event_id`, `minigame_type`, `ui_prefab`, `enter_scenario`, `helptip_hub_group`, `summon_currency_id`, `summon_currency_level_group`, `summon_currency_count`, `time_scale`, `zoom_in_value`, `single_target_miss_range`, `stage_manager_group`, `character_group`, `mission_group`, `challenge_last_wave_order`, `challenge_repeat_wave_order`, `challenge_wave_max`, `challenge_repeat_summon_time_start_wave`, `challenge_repeat_summon_time_group`, `challenge_repeat_summon_time_value`, `is_stack_minion` |
| `EventBubbleMarchStageManagerTable` | 8 | `id`, `stage_manager_group`, `difficulty_type`, `difficulty_group_id`, `name_localkey` |
| `EventBubbleMarchMissionTable` | 54 | `id`, `mission_group`, `mission_type`, `condition_type`, `condition_id`, `condition_value`, `name_localkey`, `point_value`, `order`, `reward_id` |
| `EventBubbleMarchTutorialTable` | 5 | `id`, `helptip_id`, `helptip_active_condition` |
| `EventBubbleMarchAdvantageDamageTable` | 60 | `id`, `advantage_character_group`, `advantage_monster_group`, `advantage_damage_value` |
| `EventBubbleMarchBuffTable` | 65 | `id`, `name_localkey`, `description_localkey`, `buff_description_localkey`, `resource_id`, `slot_order`, `buff_level`, `buff_type`, `buff_value`, `upgrade_cost_currency_id`, `upgrade_cost_currency_value` |
| `EventBubbleMarchCharacterTable` | 19 | `id`, `character_group`, `name_localkey`, `description_localkey`, `character_type`, `grade`, `team_set_order`, `resource_id`, `character_prefab`, `level_group`, `skill_group`, `advantage_group`, `attack`, `hp`, `knock_back_max`, `move_speed`, `summon_cooltime`, `summon_stack`, `scale`, `shadow_scale`, `prefab_height_position`, `search_target_type`, `search_radius`, `discover_type`, `discover_value`, `animation_summon`, `animation_stand`, `animation_move`, `animation_move_speed`, `animation_knock_back`, `animation_knock_back_distance`, `animation_death`, `effect_summon`, `effect_death`, `effect_edge` |
| `EventBubbleMarchCharacterLevelTable` | 969 | `id`, `level_group`, `level_min`, `level_max`, `summon_cost`, `need_cost`, `increase_attack`, `increase_hp`, `bubble_count` |
| `EventBubbleMarchCharacterSkillTable` | 26 | `id`, `skill_group`, `description_localkey`, `battle_radius`, `target`, `target_position`, `target_position_value_1`, `target_position_value_2`, `skill_type`, `skill_value`, `skill_hit_count`, `knock_back_damage`, `projectile_speed`, `projectile_parabola_height`, `remain_time`, `cool_time`, `animation_skill`, `animation_skill_speed`, `effect_muzzle`, `effect_projectile`, `effect_skill`, `effect_impact`, `effect_impact_scale`, `effect_hit`, `effect_hit_default`, `area_type`, `area_remain_time`, `area_action_time`, `area_skill_type`, `effect_area`, `effect_area_scale` |
| `EventBubbleMarchCharacterUnlockTable` | 18 | `id`, `category_group_id`, `category_localkey`, `slot_order`, `use_unlock_condition`, `unlock_character_id`, `unlock_condition_character`, `unlock_condition_day`, `unlock_currency_id`, `unlock_currency_value` |
| `EventBubbleMarchCurrencyTable` | 3 | `id`, `name_localkey`, `description_localkey`, `resource_id`, `is_server` |
| `EventBubbleMarchCurrencyLevelTable` | 6 | `id`, `level_group`, `level_min`, `level_max`, `need_cost`, `increase_currency_count` |
| `EventBubbleMarchLoadingTable` | 11 | `id`, `loading_tip_localkey`, `order` |
| `EventBubbleMarchMonsterTable` | 13 | `id`, `name_localkey`, `description_localkey`, `monster_type`, `monster_position`, `height_position`, `monster_attack_type`, `resource_id`, `monster_prefab`, `level_group`, `skill_group`, `advantage_group`, `attack`, `hp`, `knock_back_max`, `move_speed`, `scale`, `shadow_scale`, `prefab_height_position`, `search_target_type`, `search_radius`, `discover_type`, `discover_value`, `animation_summon`, `animation_stand`, `animation_move`, `animation_move_speed`, `animation_knock_back`, `animation_knock_back_distance`, `animation_death`, `effect_summon`, `effect_death` |
| `EventBubbleMarchMonsterLevelTable` | 663 | `id`, `level_group`, `level_min`, `level_max`, `summon_currency_reward`, `increase_attack`, `increase_hp`, `bubble_count` |
| `EventBubbleMarchMonsterSkillTable` | 13 | `id`, `skill_group`, `battle_radius`, `target`, `target_position`, `target_position_value_1`, `target_position_value_2`, `skill_type`, `skill_hit_count`, `knock_back_damage`, `projectile_speed`, `projectile_parabola_height`, `cool_time`, `animation_skill`, `animation_skill_speed`, `effect_muzzle`, `effect_projectile`, `effect_skill`, `effect_impact`, `effect_impact_scale`, `effect_hit`, `effect_hit_default`, `area_remain_time`, `area_action_time`, `area_skill_type`, `effect_area` |
| `EventBubbleMarchSpawnPositionTable` | 12 | `id`, `x_position`, `y_position` |
| `EventBubbleMarchStageTable` | 44 | `id`, `difficulty_group_id`, `name_localkey`, `description_localkey`, `stage_order`, `wave_group`, `monster_level_base`, `character_max_level`, `summon_currency_max_level`, `summon_currency_get_second`, `time_limit`, `friendly_tower_id`, `friendly_tower_level`, `open_condition_stage`, `open_condition_day`, `first_reward_currency_id`, `first_reward_currency_value`, `tutorial_id` |
| `EventBubbleMarchStageSummonSeedTable` | 687 | `id`, `seed_group`, `ebm_summon_group_data` |
| `EventBubbleMarchStageSummonTimeTable` | 588 | `id`, `summon_time_group`, `repeat_type`, `time_condition`, `seed_group`, `summon_seed_type` |
| `EventBubbleMarchStageWaveTable` | 91 | `id`, `wave_group`, `wave_order`, `wave_resource_prefab`, `wave_front_resource`, `wave_resource_length`, `wave_skip_condition_stage`, `wave_skip_give_currency`, `summon_time_group`, `summon_max_count_`, `enemy_target_type`, `enemy_target_id`, `enemy_target_level_add`, `monster_level_add`, `friendly_tower_level_add` |

In-game help text: `MinigameHubTable` / `MinigameHelpTipDescTable` (locale keys resolved).

## Uncertain / unknown

The viewer flagged nothing as uncertain. Fields it does not show are listed in Data sources; their meaning is not interpreted.
