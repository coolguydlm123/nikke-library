# Tower Defense (Last Kingdom)

A tower defense game: build and upgrade towers along the Raptures’ path, deploy Nikkes and aim their Burst Skills, and stop every wave before your Defense Points run out.

This guide was generated from the Nikke Library's reading of the game data: the viewer `lib/eventgames/lastkingdom.js` turns the `Event*` tables in `D:\Nikke Datamine\mpkparser\jsons` into the rules below. Numbers, units and formulas are the viewer's readings; anything it was not sure of is listed under "Uncertain / unknown". Long lists are cut to 4 rows.

- Art folder: `icons-event/37_lastkingdom`

## Overview

### How it plays

- **Goal**: Raptures enter in waves and follow the road to the kingdom. Each one that gets through costs Defense Points (a boss costs all of them). Story stages are won by defeating the boss of the last wave.
- **Gold**: You start a stage with some gold and earn more for every Rapture defeated and for starting a wave early (Quick Start). Gold builds towers, upgrades them, learns tower skills and opens Nikke slots.
- **Towers**: Four tower lines (Gun, Pulse Gun, Cannon, Ice Cannon) go from Lv. 1 to Lv. 3, then evolve into one of two specialist towers that can learn two skills. Building takes 1 s, selling 0.5 s; a sold tower refunds 70% of the gold spent.
- **Nikkes**: Hero towers placed in Nikke slots (first one free, then 110 gold, +40 for each further slot). Each Nikke can be deployed once per stage; drag her slot onto the map to fire her Burst Skill, which then has a cooldown that keeps running even if she is removed.
- **Air units**: Flying Raptures can only be hit by towers that attack air (cannons, the EMP and ice cannons hit only the ground).
- **Camouflage**: Some Raptures turn invisible from time to time; only towers that see through optical camouflage (Sniper Tower, Crown) or skills that remove it can hit them then.
- **Broken Cores**: A pile of broken cores from Raptures. / Can be used to upgrade towers. Earned from first clears of the stages and spent on permanent upgrades.
- **Challenge**: An endless stage of up to 99 random waves, scored for Raptures defeated and waves survived; your best score counts for the Union ranking.; See the waves

### Stages

| Stage | Type | Waves | Start gold | Nikkes | First clear |
|---|---|---|---|---|---|
| EX-1 Kingdom Defense | Story | 6 | 100 | 1 | Central Government Supply Chest I ×3 |
| EX-1-1 Kingdom Defense II | Stage | 7 | 200 | 1 | Ultra Boost Module ×5 |
| EX-1-2 Kingdom Defense III | Stage | 7 | 250 | 2 | Advanced Recruit Voucher ×1 |
| EX-2 Incessant Attacks | Story | 7 | 200 | 2 | Central Government Supply Chest I ×3 |

(16 more rows of 20 not shown; see the data table.)

### Nikkes

- Marian
- Crown
- Kilo
- Snow White
- Scarlet
- Rapunzel
- Crown: Naked King

## Guide

### How to play

#### Mini Game Stage

- As you play through the Last Kingdom event, certain stages will initiate the For the King mini game.

#### What's the For The King mini game?

- For The King is a tower defense mini game. / Build different types of towers to stop the Raptures' invasion.

#### Tower Slot

- Tap the tower slot to select the place to build the tower.

#### Build Tower

- Tap the Tower button to select the tower you want to build. / Tap the button again to confirm your selection. / The tower is successfully built after confirming your selection.

#### Tower Battle

- Tap the Start Wave button to start the game. / Once the wave begins, Rapture troops will appear. / The battle begins after they enter the tower's attack range.

#### Nikke Slot

- Nikkes will participate in the battle. / When there are free Nikke slots,  you can select the tower slot to deploy a Nikke there. / You cannot deploy the same Nikke more than once.

#### Deploy Nikke

- Spend gold to unlock Nikke slots. / The more Nikke slots you unlock, the more expensive the next Nikke slot becomes.

#### Use Burst Skill

- You can use a Nikke's Burst Skill after deploying her. / Drag the deployed Nikke's slot to the spot where you want to use her Burst Skill.

#### Burst Skill Cooldown

- Burst Skills have cooldown time. / The cooldown time continues even after you remove the Nikke.

#### Tower Upgrade

- Select a built tower to upgrade it. / Upgrading towers can enhance their overall strength. / The maximum level of towers differs  according to the game progress.

#### Tower Evolution

- Towers that have reached Lv. 3 can be evolved. / Evolved towers gain significant changes in their combat abilities. / The available evolution types will differ according to the game progress.

#### Tower Skill

- Select an evolved tower to learn a tower skill. / You can use the tower's special ability after learning its skill.

#### Tower Skill Type

- Tower skills are categorized into active skills and passive skills. / Active skills automatically take effect when the condition is met. / Passive skills are activated once they are learned.

#### Tower Skill Upgrade

- Upgrade the learned tower skill to enhance it. / Tower skills can be upgraded up to Lv. 3.

#### Upgrade

- Upgrade skills on the Upgrade page. / Upgrading skills can enhance the towers' basic abilities.

#### Upgrade Point

- Broken Cores can be used for upgrading. / They can be obtained as first clear rewards of all stages in For The King.

### Challenge stage

#### What is a Challenge Stage?

- You are ranked based on your score in the mini game. / Survive the Raptures' invasion for as long as possible to get a higher score. / Enemies stronger than those in ordinary stages will appear. As the wave progresses, the enemies will become increasingly strong.

#### Challenge Score

- Your Challenge score will be recorded during the Challenge stage. / Defeating Raptures earns you points. / Starting the wave quickly gives you bonus points.

#### Best Record

- When the Challenge stage ends, the score achieved in the current stage is calculated. / If the score is your personal best, it will be saved as your best record.

#### What is Union Ranking?

- You can compete with other Union members through the Union Ranking. / Union members are ranked based on their highest score in the Union Ranking. / Scores attained when not being part of a Union will not be reflected in the Union Ranking.

## Units

### Towers

Each line is built at Lv. 1 and upgraded with gold; Lv. 3 evolves into one of two towers. Higher levels unlock as you progress through the stages.

Gold is the cost of that step (building Lv. 1, upgrading to the next level or evolving). DEF pen.: the share of the target’s DEF the tower ignores. Range and splash are in map units. RPM is the attack-rate stat behind the speed label.

#### Gun Tower (A tower armed with a large-caliber machine gun. It attacks a single target at a high speed. Can attack aerial units.)

| Tower | Level | Gold | ATK | DEF pen. | Attack speed | Range | Attack | Hits | Special |
|---|---|---|---|---|---|---|---|---|---|
| Gun Tower I | Lv. 1 | 70 | 11 | — | Fast (50 RPM) | 2,150 | Bullet | Ground and air |  |
| Gun Tower II | Lv. 2 | 130 | 17 | — | Fast (50 RPM) | 2,200 | Bullet | Ground and air |  |
| Gun Tower III | Lv. 3 | 190 | 22 | — | Fast (50 RPM) | 2,250 | Bullet | Ground and air |  |
| Chemical Tower | Evolved | 300 | 26 | — | Fast (60 RPM) | 2,450 | Bullet, 20 targets | Ground and air |  |

(1 more rows of 5 not shown; see the data table.)

Unlocks: Lv. 3 from EX-2; Chemical Tower from EX-3; Gatling Tower from EX-4.

#### Gun Tower: evolved tower skills

| Skill | Type | Description | Trigger | Effects | Gold |
|---|---|---|---|---|---|
| Acid Bomb Lv. 1 | [Active] | For every 4 attacks, / the next attack becomes an Acid Bomb. / Acid Bombs deal damage over a wide area / and inflict additional damage continuously to the targeted enemy. | After every 4 attacks, the next one | Damage, power 2,500; Enemies hit: damage over time (8 per tick) for 3.5 s | 270 |
| Acid Bomb Lv. 2 | [Active] | Increases the Acid Bomb's explosive damage and continuous damage effect. | After every 4 attacks, the next one | Damage, power 5,000; Enemies hit: damage over time (12 per tick) for 4.5 s | 160 |
| Acid Bomb Lv. 3 | [Active] | Enhances Acid Bomb and shortens its attack cycle to once every 3 attacks. | After every 3 attacks, the next one | Damage, power 7,500; Enemies hit: damage over time (16 per tick) for 4.5 s | 320 |
| Increases attack speed by 1 level. | [Passive] | Slightly increases the tower's attack speed. | Always on | Attack speed +8% | 210 |

(8 more rows of 12 not shown; see the data table.)

Learned with gold on an evolved tower, then upgraded up to Lv. 3.

#### Pulse Gun Tower (A tower armed with a pulse rifle. It can penetrate Raptures' armor. Can attack aerial units.)

| Tower | Level | Gold | ATK | DEF pen. | Attack speed | Range | Attack | Hits | Special |
|---|---|---|---|---|---|---|---|---|---|
| Pulse Gun Tower I | Lv. 1 | 80 | 16 | 50% | Average (30 RPM) | 2,350 | Bullet | Ground and air | Bosses first |
| Pulse Gun Tower II | Lv. 2 | 140 | 24 | 60% | Average (30 RPM) | 2,450 | Bullet | Ground and air | Bosses first |
| Pulse Gun Tower III | Lv. 3 | 210 | 32 | 70% | Average (30 RPM) | 2,550 | Bullet | Ground and air | Bosses first |
| Sniper Tower | Evolved | 330 | 38 | 100% | Average (40 RPM) | 3,050 | Bullet | Ground and air | sees through optical camouflage; Bosses first |

(1 more rows of 5 not shown; see the data table.)

Unlocks: Lv. 3 from EX-2; Sniper Tower from EX-3; Rail Cannon Tower from EX-4.

#### Pulse Gun Tower: evolved tower skills

| Skill | Type | Description | Trigger | Effects | Gold |
|---|---|---|---|---|---|
| Marksman Lv. 1 | [Active] | For every 3 attacks, / a special bullet is used for the next attack. / The special bullet inflicts more significant damage than a basic attack. | After every 3 attacks, the next one | Damage, power 10,000 | 300 |
| Marksman Lv. 2 | [Active] | Significantly increases the special bullets' damage. | After every 3 attacks, the next one | Damage, power 12,000 | 170 |
| Marksman Lv. 3 | [Active] | Significantly increases the special bullets' damage and shortens its attack cycle to once every 2 attacks. | After every 2 attacks, the next one | Damage, power 13,000 | 350 |
| Increases ATK by 1 level. | [Passive] | Slightly increases the tower's attack. | Always on | ATK +3 | 210 |

(8 more rows of 12 not shown; see the data table.)

Learned with gold on an evolved tower, then upgraded up to Lv. 3.

#### Cannon Tower (A turret-type tower that fires high-explosive bombs. It inflicts significant damage on multiple enemies. Not capable of aerial attacks.)

| Tower | Level | Gold | ATK | DEF pen. | Attack speed | Range | Attack | Hits | Special |
|---|---|---|---|---|---|---|---|---|---|
| Cannon Tower I | Lv. 1 | 90 | 15 | — | Slow (20 RPM) | 2,000 | Shell (splash), splash 400 | Ground only |  |
| Cannon Tower II | Lv. 2 | 170 | 23 | — | Slow (20 RPM) | 2,050 | Shell (splash), splash 400 | Ground only |  |
| Cannon Tower III | Lv. 3 | 250 | 30 | — | Slow (20 RPM) | 2,100 | Shell (splash), splash 400 | Ground only |  |
| Missile Tower | Evolved | 390 | 23 | — | Average (40 RPM) | 2,250 | Missiles (splash), splash 400 | Ground and air | Air units first |

(1 more rows of 5 not shown; see the data table.)

Unlocks: Lv. 3 from EX-2; Missile Tower from EX-3; EMP Tower from EX-4.

#### Cannon Tower: evolved tower skills

| Skill | Type | Description | Trigger | Effects | Gold |
|---|---|---|---|---|---|
| Killer Missile Lv. 1 | [Active] | The multi-barrel cannon opens up / and fires 8 Killer Missiles at regular intervals. | Every 12 s | Damage, power 2,400 | 350 |
| Killer Missile Lv. 2 | [Active] | Significantly increases the Killer Missiles' damage. | Every 12 s | Damage, power 2,800 | 210 |
| Killer Missile Lv. 3 | [Active] | Increases the number of Killer Missiles launched to 12. | Every 12 s | Damage, power 2,800 | 420 |
| Increases attack range by 1 level. | [Passive] | Slightly increases the tower's attack range. | Always on | Range +150 | 210 |

(8 more rows of 12 not shown; see the data table.)

Learned with gold on an evolved tower, then upgraded up to Lv. 3.

#### Ice Cannon Tower (A tower that fires special shells condensed with cold air. It does not directly damage enemies but can freeze mechanical parts to slow their advance. Not capable of aerial attacks.)

| Tower | Level | Gold | ATK | DEF pen. | Attack speed | Range | Attack | Hits | Special |
|---|---|---|---|---|---|---|---|---|---|
| Ice Cannon Tower I | Lv. 1 | 80 | 8 | — | Slow (20 RPM) | 2,000 | Shell (splash), splash 400 | Ground only | slows by 15% for 3 s |
| Ice Cannon Tower II | Lv. 2 | 160 | 12 | — | Slow (20 RPM) | 2,050 | Shell (splash), splash 400 | Ground only | slows by 22.5% for 3 s |
| Ice Cannon Tower III | Lv. 3 | 230 | 16 | — | Slow (20 RPM) | 2,100 | Shell (splash), splash 400 | Ground only | slows by 30% for 3 s |
| Blizzard Tower | Evolved | 360 | 17 | — | Slow (20 RPM) | 2,600 | Pulse around the tower, splash 2600 | Ground only | slows by 30% for 3 s |

(1 more rows of 5 not shown; see the data table.)

Unlocks: Lv. 3 from EX-2; Blizzard Tower from EX-3; Ice Shooter Tower from EX-4.

#### Ice Cannon Tower: evolved tower skills

| Skill | Type | Description | Trigger | Effects | Gold |
|---|---|---|---|---|---|
| Absolute Zero Lv. 1 | [Active] | It instantaneously releases an intense blast of cold, freezing all enemies within the area. | Every 24 s | Damage, power 10,000; Enemies hit (up to 4): frozen in place (stun) for 0.5 s | 320 |
| Absolute Zero Lv. 2 | [Active] | Increases the duration the enemies remain frozen. | Every 22 s | Damage, power 12,000; Enemies hit (up to 4): frozen in place (stun) for 0.75 s | 190 |
| Absolute Zero Lv. 3 | [Active] | Increases Absolute Zero's effect area and the duration enemies remain frozen. | Every 20 s | Damage, power 15,000; Enemies hit (up to 5): frozen in place (stun) for 1 s | 380 |
| Enhances Debuff by 1 level. | [Passive] | Slightly increases the tower's debuff effects. | Always on | Debuffs +4% | 210 |

(8 more rows of 12 not shown; see the data table.)

Learned with gold on an evolved tower, then upgraded up to Lv. 3.

### Nikkes

Hero towers: deployed free into a Nikke slot, upgraded and evolved with gold like towers, each with a Burst Skill you aim yourself.

#### Marian (Marian is deployed to the front line. With a rapid attack speed, she specializes in targeting single enemies. By using her Burst Skill, she can provide instant firepower support to a certain location.)

| Tower | Level | Gold | ATK | DEF pen. | Attack speed | Range | Attack | Hits | Special |
|---|---|---|---|---|---|---|---|---|---|
| Marian I | Lv. 1 | — | 13 | 3% | Fast (60 RPM) | 2,250 | Instant hit | Ground and air | Bosses first |
| Marian II | Lv. 2 | 190 | 20 | 6% | Fast (60 RPM) | 2,300 | Instant hit | Ground and air | Bosses first |
| Marian III | Lv. 3 | 280 | 26 | 9% | Fast (60 RPM) | 2,350 | Instant hit | Ground and air | Bosses first |
| Awakened Marian | Evolved | 450 | 32 | 15% | Very Fast (70 RPM) | 2,500 | Instant hit | Ground and air | Bosses first |

Unlocks: Lv. 3 from EX-2; Awakened Marian from EX-3.

#### Marian: Burst Skill

| Skill | Type | Description | Trigger | Effects |
|---|---|---|---|---|
| New World Lv. 1 | [Burst] | Deals continuous damage to the designated location. | Drag onto the map; cooldown 60 s | Damage, power 6,000 |
| New World Lv. 2 | [Burst] | Deals continuous damage to the designated location. | Drag onto the map; cooldown 60 s | Damage, power 6,500 |
| New World Lv. 3 | [Burst] | Deals continuous damage to the designated location. | Drag onto the map; cooldown 60 s | Damage, power 7,000 |
| Evolved New World | [Burst] | Deals continuous damage to the designated location. | Drag onto the map; cooldown 60 s | Damage, power 7,000 |

The Burst Skill levels up with the tower. Power is the game’s damage value (meaning of the scale unclear).

#### Marian: evolved tower skills

| Skill | Type | Description | Trigger | Effects | Gold |
|---|---|---|---|---|---|
| High-Speed Learning Lv. 1 | [Active] | Marian rapidly learns the battlefield situation at regular intervals, turning the tide of battle in her favor. / Significantly increases her attack speed for a short duration at regular intervals. | Every 12 s | Self: attack speed +30% for 6 s | 410 |
| High-Speed Learning Lv. 2 | [Active] | Attacks more enemies when the High-Speed Learning effect is activated. | Every 12 s | Self: attack speed +35% for 6 s; Self: +2 targets for 6 s; Self: splash area +300 for 6 s | 240 |
| High-Speed Learning Lv. 3 | [Active] | Enhances the High-Speed Learning effect and increases its duration. | Every 12 s | Self: attack speed +45% for 8 s; Self: +4 targets for 8 s; Self: splash area +450 for 8 s | 480 |
| Increases attack speed by 1 level. | [Passive] | Slightly increases the tower's attack speed. | Always on | Attack speed +8% | 210 |

(2 more rows of 6 not shown; see the data table.)

Learned with gold on an evolved tower, then upgraded up to Lv. 3.

#### Crown (Crown is deployed to the front line. With outstanding combat abilities, she can attack multiple enemies and simultaneously halt the enemy's attacks. She can see through Raptures' optical camouflage. By using her Burst Skill, she can provide support to stop enemy attacks at a certain location.)

| Tower | Level | Gold | ATK | DEF pen. | Attack speed | Range | Attack | Hits | Special |
|---|---|---|---|---|---|---|---|---|---|
| Crown I | Lv. 1 | — | 7 | — | Average (40 RPM) | 2,050 | Instant hit, 3 targets, splash 200 | Ground and air | slows by 15% for 3 s; sees through optical camouflage |
| Crown II | Lv. 2 | 190 | 11 | — | Average (40 RPM) | 2,100 | Instant hit, 3 targets, splash 250 | Ground and air | slows by 15% for 3 s; sees through optical camouflage |
| Crown III | Lv. 3 | 280 | 14 | — | Average (40 RPM) | 2,150 | Instant hit, 3 targets, splash 300 | Ground and air | slows by 15% for 3 s; sees through optical camouflage |
| Awakened Crown | Evolved | 450 | 15 | — | Fast (50 RPM) | 2,250 | Instant hit, 3 targets, splash 400 | Ground and air | slows by 15% for 3 s; sees through optical camouflage |

Unlocks: Lv. 3 from EX-2; Awakened Crown from EX-3.

#### Crown: Burst Skill

| Skill | Type | Description | Trigger | Effects |
|---|---|---|---|---|
| King's Power Lv. 1 | [Burst] | Creates an area to stop enemy advances at the designated location. | Drag onto the map; cooldown 40 s | Damage, power 9,000; Enemies hit: slows by 40% for 4 s |
| King's Power Lv. 2 | [Burst] | Creates an area to stop enemy advances at the designated location. | Drag onto the map; cooldown 40 s | Damage, power 10,000; Enemies hit: slows by 40% for 4 s |
| King's Power Lv. 3 | [Burst] | Creates an area to stop enemy advances at the designated location. | Drag onto the map; cooldown 40 s | Damage, power 11,000; Enemies hit: slows by 40% for 4 s |
| Evolved King's Power | [Burst] | Creates an area to stop enemy advances at the designated location. | Drag onto the map; cooldown 40 s | Damage, power 13,000; Enemies hit: slows by 50% for 6 s |

The Burst Skill levels up with the tower. Power is the game’s damage value (meaning of the scale unclear).

#### Crown: evolved tower skills

| Skill | Type | Description | Trigger | Effects | Gold |
|---|---|---|---|---|---|
| Royal Majesty Lv. 1 | [Active] | Crown demonstrates the dignity of a king at regular intervals. / She creates three swords of light, / inflicting significant damage to enemies in a small range. / Enemies hit by the attack cannot deploy optical camouflage. | Every 12 s | Damage, power 11,000; Enemies hit: camouflage removed for 8 s | 410 |
| Royal Majesty Lv. 2 | [Active] | Increases the Sword of Light's power and expands its damage range. | Every 12 s | Damage, power 14,000; Enemies hit: camouflage removed for 8 s | 240 |
| Royal Majesty Lv. 3 | [Active] | Increases the number of Sword of Light to 5 and expands its damage range. | Every 12 s | Damage, power 14,000; Enemies hit: camouflage removed for 8 s | 480 |
| Increases attack range by 1 level. | [Passive] | Slightly increases the tower's attack range. | Always on | Range +150 | 210 |

(2 more rows of 6 not shown; see the data table.)

Learned with gold on an evolved tower, then upgraded up to Lv. 3.

#### Kilo (Kilo is deployed to the front line. She can launch powerful firepower continuously at multiple enemies. By using the Burst Skill, she enhances her own abilities and strengthens the nearby tower in a certain location.)

| Tower | Level | Gold | ATK | DEF pen. | Attack speed | Range | Attack | Hits | Special |
|---|---|---|---|---|---|---|---|---|---|
| Kilo I | Lv. 1 | — | 11 | — | Fast (50 RPM) | 2,100 | Instant hit, 3 targets, splash 300 | Ground and air |  |
| Kilo II | Lv. 2 | 190 | 17 | — | Fast (50 RPM) | 2,150 | Instant hit, 3 targets, splash 350 | Ground and air |  |
| Kilo III | Lv. 3 | 280 | 22 | — | Fast (50 RPM) | 2,200 | Instant hit, 3 targets, splash 400 | Ground and air |  |
| Awakened Kilo | Evolved | 450 | 26 | — | Fast (60 RPM) | 2,300 | Instant hit, 5 targets, splash 500 | Ground and air |  |

Unlocks: Lv. 3 from EX-2; Awakened Kilo from EX-3.

#### Kilo: Burst Skill

| Skill | Type | Description | Trigger | Effects |
|---|---|---|---|---|
| Overdrive Lv. 1 | [Burst] | Enhances their own abilities and shares them at the designated location. | Drag onto the map; cooldown 40 s | Nearby towers: shares its boosts with linked towers for 10 s; Self: DEF penetration +25% for 10 s; Self: attack speed +20% for 10 s; Self: range +150 for 10 s |
| Overdrive Lv. 2 | [Burst] | Enhances their own abilities and shares them at the designated location. | Drag onto the map; cooldown 40 s | Nearby towers: shares its boosts with linked towers for 10 s; Self: DEF penetration +35% for 10 s; Self: attack speed +25% for 10 s; Self: range +300 for 10 s |
| Overdrive Lv. 3 | [Burst] | Enhances their own abilities and shares them at the designated location. | Drag onto the map; cooldown 40 s | Nearby towers: shares its boosts with linked towers for 10 s; Self: DEF penetration +45% for 10 s; Self: attack speed +30% for 10 s; Self: range +450 for 10 s |
| Evolved Overdrive | [Burst] | Enhances their own abilities and shares them at the designated location. | Drag onto the map; cooldown 40 s | Nearby towers: shares its boosts with linked towers for 12 s; Self: DEF penetration +75% for 12 s; Self: attack speed +50% for 12 s; Self: range +600 for 12 s |

The Burst Skill levels up with the tower. Power is the game’s damage value (meaning of the scale unclear).

#### Kilo: evolved tower skills

| Skill | Type | Description | Trigger | Effects | Gold |
|---|---|---|---|---|---|
| Nano Coating Lv. 1 | [Active] | T.A.L.O.S. activates its Nano Coating at regular intervals to instantly enhance its combat abilities. / It shares its abilities with 2 nearby towers. | Every 18 s | Nearby towers (2): shares its boosts with linked towers for 8 s; Self: range +200 for 8 s; Self: attack speed +10% for 8 s | 410 |
| Nano Coating Lv. 2 | [Active] | Enhances the Nano Coating effect, allowing T.A.L.O.S. to share its abilities with towers at a greater distance. | Every 18 s | Nearby towers (2): shares its boosts with linked towers for 8 s; Self: range +300 for 8 s; Self: attack speed +15% for 8 s | 240 |
| Nano Coating Lv. 3 | [Active] | Enhances the Nano Coating effect, allowing T.A.L.O.S. to share its ability with up to 4 towers. | Every 18 s | Nearby towers (4): shares its boosts with linked towers for 8 s; Self: range +400 for 8 s; Self: attack speed +20% for 8 s | 480 |
| Burst Cooldown Reduction Lv. 1 | [Passive] | Slightly decreases the tower's Burst Skill cooldown. | Always on | Burst cooldown −3 s | 210 |

(2 more rows of 6 not shown; see the data table.)

Learned with gold on an evolved tower, then upgraded up to Lv. 3.

#### Snow White (Snow White is deployed to the front line. She fires powerful bullets that penetrate the enemy's defense, inflicting critical damage to a single target. By using her Burst Skill, she fires deadly armor-penetrating bullets in a very short range.)

| Tower | Level | Gold | ATK | DEF pen. | Attack speed | Range | Attack | Hits | Special |
|---|---|---|---|---|---|---|---|---|---|
| Snow White I | Lv. 1 | — | 25 | 50% | Average (30 RPM) | 2,450 | Bullet | Ground and air | Bosses first |
| Snow White II | Lv. 2 | 190 | 38 | 65% | Average (30 RPM) | 2,550 | Bullet | Ground and air | Bosses first |
| Snow White III | Lv. 3 | 280 | 50 | 80% | Average (30 RPM) | 2,650 | Bullet | Ground and air | Bosses first |
| Awakened Snow White | Evolved | 450 | 55 | 100% | Average (40 RPM) | 3,150 | Bullet | Ground and air | Bosses first |

Unlocks: available from EX-3-1.

#### Snow White: Burst Skill

| Skill | Type | Description | Trigger | Effects |
|---|---|---|---|---|
| Seven Dwarves I Lv. 1 | [Burst] | Deals critical true damage to the designated location. | Drag onto the map; cooldown 40 s | Armor-piercing damage, power 48,000 |
| Seven Dwarves I Lv. 2 | [Burst] | Deals critical true damage to the designated location. | Drag onto the map; cooldown 40 s | Armor-piercing damage, power 54,500 |
| Seven Dwarves I Lv. 3 | [Burst] | Deals critical true damage to the designated location. | Drag onto the map; cooldown 40 s | Armor-piercing damage, power 61,000 |
| Evolved Seven Dwarves I | [Burst] | Deals critical true damage to the designated location. | Drag onto the map; cooldown 40 s | Armor-piercing damage, power 82,000 |

The Burst Skill levels up with the tower. Power is the game’s damage value (meaning of the scale unclear).

#### Snow White: evolved tower skills

| Skill | Type | Description | Trigger | Effects | Gold |
|---|---|---|---|---|---|
| Seven Dwarves V Lv. 1 | [Active] | Snow White fires Seven Dwarves V missiles at regular intervals. / The 4 missiles penetrate the enemy defense and deal significant damage in a small range. | Every 12 s | Armor-piercing damage, power 3,500 | 410 |
| Seven Dwarves V Lv. 2 | [Active] | Increases Seven Dwarves V missiles' damage and expands its damage range. | Every 12 s | Armor-piercing damage, power 4,500 | 240 |
| Seven Dwarves V Lv. 3 | [Active] | Increases the number of missiles launched to 7 and expands its damage range. | Every 12 s | Armor-piercing damage, power 4,500 | 480 |
| Increases attack speed by 1 level. | [Passive] | Slightly increases the tower's attack speed. | Always on | Attack speed +8% | 210 |

(2 more rows of 6 not shown; see the data table.)

Learned with gold on an evolved tower, then upgraded up to Lv. 3.

#### Scarlet (Scarlet is deployed to the front line. Although her attack range is very short, she can instantly launch the most powerful attack within her effective range. By using her Burst Skill, she can deliver a deadly strike in a short range.)

| Tower | Level | Gold | ATK | DEF pen. | Attack speed | Range | Attack | Hits | Special |
|---|---|---|---|---|---|---|---|---|---|
| Scarlet I | Lv. 1 | — | 14 | — | Very Fast (70 RPM) | 1,800 | Bullet | Ground and air | Bosses first |
| Scarlet II | Lv. 2 | 190 | 21 | — | Very Fast (70 RPM) | 1,850 | Bullet | Ground and air | Bosses first |
| Scarlet III | Lv. 3 | 280 | 28 | — | Very Fast (70 RPM) | 1,900 | Bullet | Ground and air | Bosses first |
| Awakened Scarlet | Evolved | 450 | 35 | — | Very Fast (80 RPM) | 2,000 | Bullet | Ground and air | Bosses first |

Unlocks: available from EX-3-1.

#### Scarlet: Burst Skill

| Skill | Type | Description | Trigger | Effects |
|---|---|---|---|---|
| Scarlet Flash Lv. 1 | [Burst] | Deals significant damage to the designated location. | Drag onto the map; cooldown 40 s | Damage, power 43,000 |
| Scarlet Flash Lv. 2 | [Burst] | Deals significant damage to the designated location. | Drag onto the map; cooldown 40 s | Damage, power 48,000 |
| Scarlet Flash Lv. 3 | [Burst] | Deals significant damage to the designated location. | Drag onto the map; cooldown 40 s | Damage, power 51,500 |
| Evolved Scarlet Flash | [Burst] | Deals significant damage to the designated location. | Drag onto the map; cooldown 40 s | Damage, power 63,000 |

The Burst Skill levels up with the tower. Power is the game’s damage value (meaning of the scale unclear).

#### Scarlet: evolved tower skills

| Skill | Type | Description | Trigger | Effects | Gold |
|---|---|---|---|---|---|
| Strike Lv. 1 | [Active] | Scarlet recalls sword techniques of the past. / The moment her Burst Skill is used, / Strike is activated, / significantly increasing her attack speed momentarily. | When the Burst Skill is used | Self: attack speed +100% for 6 s | 410 |
| Strike Lv. 2 | [Active] | Increases Strike's duration. | When the Burst Skill is used | Self: attack speed +110% for 9 s | 240 |
| Strike Lv. 3 | [Active] | Significantly increases Strike's attack speed. | When the Burst Skill is used | Self: attack speed +180% for 10 s | 480 |
| Burst Cooldown Reduction Lv. 1 | [Passive] | Slightly decreases the tower's Burst Skill cooldown. | Always on | Burst cooldown −3 s | 210 |

(2 more rows of 6 not shown; see the data table.)

Learned with gold on an evolved tower, then upgraded up to Lv. 3.

#### Rapunzel (Rapunzel is deployed to the front line. She uses an enhanced skill to disrupt the enemy's advances. By using her Burst Skill, she momentarily stuns the enemy at the selected location.)

| Tower | Level | Gold | ATK | DEF pen. | Attack speed | Range | Attack | Hits | Special |
|---|---|---|---|---|---|---|---|---|---|
| Rapunzel I | Lv. 1 | — | 11 | — | Slow (20 RPM) | 2,000 | Bullet, splash 400 | Ground and air | slows by 15% for 3 s |
| Rapunzel II | Lv. 2 | 190 | 17 | — | Slow (20 RPM) | 2,050 | Bullet, splash 450 | Ground and air | slows by 15% for 3 s |
| Rapunzel III | Lv. 3 | 280 | 22 | — | Slow (20 RPM) | 2,100 | Bullet, splash 500 | Ground and air | slows by 15% for 3 s |
| Awakened Rapunzel | Evolved | 450 | 23 | — | Average (30 RPM) | 2,200 | Bullet, splash 600 | Ground and air | slows by 15% for 4 s |

Unlocks: available from EX-3-1.

#### Rapunzel: Burst Skill

| Skill | Type | Description | Trigger | Effects |
|---|---|---|---|---|
| Space-Time Distortion Lv. 1 | [Burst] | Freezes time for the Raptures at the designated location. | Drag onto the map; cooldown 40 s | Damage, power 20,000; Enemies hit: frozen in place (stun) for 3 s |
| Space-Time Distortion Lv. 2 | [Burst] | Freezes time for the Raptures at the designated location. | Drag onto the map; cooldown 40 s | Damage, power 25,000; Enemies hit: frozen in place (stun) for 3.25 s |
| Space-Time Distortion Lv. 3 | [Burst] | Freezes time for the Raptures at the designated location. | Drag onto the map; cooldown 40 s | Damage, power 30,000; Enemies hit: frozen in place (stun) for 3.5 s |
| Evolved Space-Time Distortion | [Burst] | Freezes time for the Raptures at the designated location. | Drag onto the map; cooldown 40 s | Damage, power 45,000; Enemies hit: frozen in place (stun) for 5 s |

The Burst Skill levels up with the tower. Power is the game’s damage value (meaning of the scale unclear).

#### Rapunzel: evolved tower skills

| Skill | Type | Description | Trigger | Effects | Gold |
|---|---|---|---|---|---|
| Time Distortion Lv. 1 | [Active] | Rapunzel amplifies jamming signals / at regular intervals to disrupt enemies. / She distorts time in nearby locations and freezes Raptures' actions exposed to the distorted time. | Every 16 s | Damage, power 9,000; Enemies hit (up to 8): frozen in place (stun) for 1.5 s | 410 |
| Time Distortion Lv. 2 | [Active] | Increases the duration of freezing Raptures' actions. | Every 16 s | Damage, power 12,000; Enemies hit (up to 8): frozen in place (stun) for 1.75 s | 240 |
| Time Distortion Lv. 3 | [Active] | Expands Time Distortion's effective range and increases its duration. | Every 16 s | Damage, power 15,000; Enemies hit (up to 12): frozen in place (stun) for 2 s | 480 |
| Enhances Debuff by 1 level. | [Passive] | Slightly increases the tower's debuff effects. | Always on | Debuffs +4% | 210 |

(2 more rows of 6 not shown; see the data table.)

Learned with gold on an evolved tower, then upgraded up to Lv. 3.

#### Crown: Naked King (An enhanced Crown is deployed to the front line. With a simple gesture, she inflicts fatal damage to enemies within range. She can see through Raptures' optical camouflage. By using her Burst Skill, she can create a sacred area that burns enemies who have invaded the kingdom.)

| Tower | Level | Gold | ATK | DEF pen. | Attack speed | Range | Attack | Hits | Special |
|---|---|---|---|---|---|---|---|---|---|
| Crown: Naked King I | Lv. 1 | — | 25 | — | Slow (20 RPM) | 2,200 | Pulse around the tower, splash 2200 | Ground and air | sees through optical camouflage |
| Crown: Naked King II | Lv. 2 | 190 | 38 | — | Slow (20 RPM) | 2,250 | Pulse around the tower, splash 2250 | Ground and air | sees through optical camouflage |
| Crown: Naked King III | Lv. 3 | 280 | 50 | — | Slow (20 RPM) | 2,300 | Pulse around the tower, splash 2300 | Ground and air | sees through optical camouflage |
| Awakened Crown: Naked King | Evolved | 450 | 55 | — | Average (30 RPM) | 2,400 | Pulse around the tower, splash 2400 | Ground and air | sees through optical camouflage |

Unlocks: available from EX-6-1 (after clearing it).

#### Crown: Naked King: Burst Skill

| Skill | Type | Description | Trigger | Effects |
|---|---|---|---|---|
| King's Ground Lv. 1 | [Burst] | Creates an area that burns the Raptures at the selected location. | Drag onto the map; cooldown 60 s | Damage, power 2,800; Enemies hit: damage over time (8 per tick) for 4 s |
| King's Ground Lv. 2 | [Burst] | Creates an area that burns the Raptures at the selected location. | Drag onto the map; cooldown 60 s | Damage, power 3,100; Enemies hit: damage over time (12 per tick) for 4 s |
| King's Ground Lv. 3 | [Burst] | Creates an area that burns the Raptures at the selected location. | Drag onto the map; cooldown 60 s | Damage, power 3,400; Enemies hit: damage over time (16 per tick) for 4 s |
| Evolved King's Ground | [Burst] | Creates an area that burns the Raptures at the selected location. | Drag onto the map; cooldown 60 s | Damage, power 3,850; Enemies hit: damage over time (20 per tick) for 6 s |

The Burst Skill levels up with the tower. Power is the game’s damage value (meaning of the scale unclear).

#### Crown: Naked King: evolved tower skills

| Skill | Type | Description | Trigger | Effects | Gold |
|---|---|---|---|---|---|
| King's Glory Lv. 1 | [Active] | Crown bestows the honor of death upon the foolish Raptures at regular intervals. / She generates three spheres that deal significant damage to enemies in a wide range, and also continuously inflicts additional damage with sacred flames on the attacked enemies. / The attacked enemies are unable to deploy optical camouflage. | Every 12 s | Damage, power 3,800; Enemies hit: damage over time (12 per tick) for 3.5 s; Enemies hit: camouflage removed for 8 s | 410 |
| King's Glory Lv. 2 | [Active] | Increases King's Glory's damage and additional continuous damage. | Every 12 s | Damage, power 4,300; Enemies hit: damage over time (16 per tick) for 4.5 s; Enemies hit: camouflage removed for 8 s | 240 |
| King's Glory Lv. 3 | [Active] | Increases the number of spheres fired to 5 and its additional continuous damage. | Every 12 s | Damage, power 4,300; Enemies hit: damage over time (20 per tick) for 5.5 s; Enemies hit: camouflage removed for 8 s | 480 |
| Increases ATK by 1 level. | [Passive] | Slightly increases the tower's attack. | Always on | ATK +5 | 210 |

(2 more rows of 6 not shown; see the data table.)

Learned with gold on an evolved tower, then upgraded up to Lv. 3.

#### Burst lines

| Nikke | Line |
|---|---|
| Marian | Return to where you belong. |
| Crown | Down with those who would threaten the kingdom. |
| Kilo | Let's go, T.A.L.O.S.! |
| Snow White | Seven Dwarves! Fully active! Blast away! |

(3 more rows of 7 not shown; see the data table.)

### Raptures

Every Rapture comes in many strength tiers (variants with more HP and DEF for later stages and challenge waves); the table shows the range.

Defense lost: Defense Points taken if it reaches the kingdom. Gold: earned for defeating it. Speed is in map units.

| Rapture |  | Moves | Notes | HP | DEF | Speed | Defense lost | Gold | Abilities |
|---|---|---|---|---|---|---|---|---|---|
| Pelican |  | Ground | The most common type. / There are reports that a large EXID entity was discovered. | 42–1,358 | 0 | 450 | 1 | 8 |  |
| Exceed Pelican |  | Ground | The most common type. / There are reports that a large EXID entity was discovered. | 126–4,075 | 0 | 300 | 3 | 24 |  |
| Oculus |  | Air | The most common type of aerial entity. / Some towers cannot attack it. / There are reports that a large EXID entity was discovered. | 42–1,358 | 0 | 450 | 1 | 8 |  |
| Exceed Oculus |  | Air | The most common type of aerial entity. / Some towers cannot attack it. / There are reports that a large EXID entity was discovered. | 126–4,075 | 0 | 300 | 3 | 24 |  |

(17 more rows of 21 not shown; see the data table.)

#### Field guide

- Pelican
- Oculus
- Thief
- Lure
- Fez
- Hard Hat
- Ant
- Bird
- Curvy Leg
- Bulwark
- Heavy Metal
- Cocytus
- Chatterbox
- Indivilia
- Indivilia: Transformed

## Stages

### EX-1 Kingdom Defense

The once-peaceful Crown Kingdom suddenly faces an invasion from the Raptures.

- **Stage type**: Story stage
- **Unlock**: Must clear Part 1 Stage 1-5
- **Defense Points**: 30 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 100
- **Nikke slots**: 1 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat the boss of the last wave
- **First clear**: Central Government Supply Chest I ×3
- **Broken Cores**: 3 on first clear
- **Story after**: story "Defensive Battle" (`event_lastkingdom1_b01_e`)

#### Waves

| Wave | Wait | Early gold | Spawning | Raptures | Enemies |
|---|---|---|---|---|---|
| 1 | — | 15 | 19 s | 9 | Pelican ×9 (HP 42) |
| 2 | 20 s | 20 | 21 s | 8 | Exceed Pelican ×2 (HP 126); Pelican ×6 (HP 42) |
| 3 | 20 s | 20 | 26.2 s | 14 | Exceed Pelican ×3 (HP 126); Pelican ×11 (HP 42) |
| 4 | 25 s | 25 | 31.6 s | 20 | Pelican ×12 (HP 42); Thief ×8 (HP 42) |

(2 more rows of 6 not shown; see the data table.)

Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.

#### In-battle dialogue

| When | Speaker | Line |
|---|---|---|
| Stage start | Crown | We can't allow a single Rapture into the kingdom. |
|  | Crown | We have to defend this place no matter what. |
|  | Marian | Yes! |
|  | Kilo | I-I understand! |

(8 more rows of 12 not shown; see the data table.)

### EX-1-1 Kingdom Defense II

Kingdom Defense - Story II

- **Stage type**: Stage
- **Unlock**: Clear EX-1 Kingdom Defense
- **Defense Points**: 20 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 200
- **Nikke slots**: 1 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat the boss of the last wave
- **First clear**: Ultra Boost Module ×5
- **Broken Cores**: 3 on first clear

#### Waves

| Wave | Wait | Early gold | Spawning | Raptures | Enemies |
|---|---|---|---|---|---|
| 1 | — | 10 | 12.6 s | 9 | Pelican ×9 (HP 48) |
| 2 | 30 s | 30 | 37.4 s | 16 | Exceed Pelican ×2 (HP 144); Pelican ×14 (HP 48) |
| 3 | 15 s | 15 | 19 s | 9 | Thief ×9 (HP 48) |
| 4 | 20 s | 20 | 31.6 s | 20 | Pelican ×12 (HP 48); Thief ×8 (HP 48) |

(3 more rows of 7 not shown; see the data table.)

Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.

### EX-1-2 Kingdom Defense III

Kingdom Defense - Story III

- **Stage type**: Stage
- **Unlock**: Clear EX-1-1 Kingdom Defense II
- **Defense Points**: 20 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 250
- **Nikke slots**: 2 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat the boss of the last wave
- **First clear**: Advanced Recruit Voucher ×1
- **Broken Cores**: 3 on first clear

#### Waves

| Wave | Wait | Early gold | Spawning | Raptures | Enemies |
|---|---|---|---|---|---|
| 1 | — | 20 | 21 s | 8 | Exceed Pelican ×2 (HP 144); Pelican ×6 (HP 48) |
| 2 | 25 s | 25 | 31.6 s | 20 | Pelican ×12 (HP 48); Thief ×8 (HP 48) |
| 3 | 30 s | 30 | 31.8 s | 18 | Exceed Pelican ×6 (HP 144); Pelican ×12 (HP 48) |
| 4 | 35 s | 35 | 36.6 s | 30 | Pelican ×18 (HP 48); Thief ×12 (HP 48) |

(3 more rows of 7 not shown; see the data table.)

Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.

### EX-2 Incessant Attacks

After fending off the Raptures' invasion, they barely had a moment to catch their breath before another wave arrived.

- **Stage type**: Story stage
- **Unlock**: Clear EX-1 Kingdom Defense; Must clear Part 1 Stage 1-6
- **Defense Points**: 30 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 200
- **Nikke slots**: 2 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat the boss of the last wave
- **First clear**: Central Government Supply Chest I ×3
- **Broken Cores**: 3 on first clear
- **Story before**: story "Relentless Siege: A" (`event_lastkingdom1_b02_s`)
- **Story after**: story "Relentless Siege: B" (`event_lastkingdom1_b02_e`)

#### Waves

| Wave | Wait | Early gold | Spawning | Raptures | Enemies |
|---|---|---|---|---|---|
| 1 | — | 15 | 19 s | 9 | Pelican ×6 (HP 42); Oculus ×3 (HP 42) |
| 2 | 20 s | 20 | 32 s | 18 | Pelican ×12 (HP 42); Thief ×6 (HP 42) |
| 3 | 25 s | 25 | 29 s | 14 | Exceed Oculus ×1 (HP 126); Exceed Pelican ×1 (HP 126); Oculus ×6 (HP 42); Pelican ×6 (HP 42) |
| 4 | 35 s | 35 | 43 s | 24 | Exceed Oculus ×3 (HP 126); Thief ×21 (HP 42) |

(3 more rows of 7 not shown; see the data table.)

Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.

#### In-battle dialogue

| When | Speaker | Line |
|---|---|---|
| Stage start | Crown | Is everyone ready? |
|  | Kilo | Ready! |
|  | Marian | There should be more time in between each wave. |
|  | Marian | Raptures usually move in groups. |

(11 more rows of 15 not shown; see the data table.)

### EX-2-1 Incessant Attacks II

Incessant Attacks - Story II

- **Stage type**: Stage
- **Unlock**: Clear EX-2 Incessant Attacks
- **Defense Points**: 20 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 300
- **Nikke slots**: 2 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat the boss of the last wave
- **First clear**: Ultra Boost Module ×5
- **Broken Cores**: 3 on first clear

#### Waves

| Wave | Wait | Early gold | Spawning | Raptures | Enemies |
|---|---|---|---|---|---|
| 1 | — | 25 | 31.6 s | 20 | Pelican ×10 (HP 48); Thief ×10 (HP 48) |
| 2 | 30 s | 30 | 31.8 s | 18 | Exceed Pelican ×6 (HP 144); Pelican ×12 (HP 48) |
| 3 | 30 s | 30 | 41.6 s | 30 | Thief ×21 (HP 48); Pelican ×9 (HP 48) |
| 4 | 25 s | 25 | 18.6 s | 10 | Exceed Pelican ×5 (HP 144); Thief ×5 (HP 48) |

(4 more rows of 8 not shown; see the data table.)

Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.

### EX-2-2 Incessant Attacks III

Incessant Attacks - Story III

- **Stage type**: Stage
- **Unlock**: Clear EX-2-1 Incessant Attacks II
- **Defense Points**: 20 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 350
- **Nikke slots**: 2 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat the boss of the last wave
- **First clear**: Advanced Recruit Voucher ×1
- **Broken Cores**: 3 on first clear

#### Waves

| Wave | Wait | Early gold | Spawning | Raptures | Enemies |
|---|---|---|---|---|---|
| 1 | — | 25 | 32 s | 18 | Pelican ×12 (HP 48); Thief ×6 (HP 48) |
| 2 | 30 s | 30 | 31.8 s | 18 | Exceed Pelican ×6 (HP 144); Pelican ×12 (HP 48) |
| 3 | 35 s | 35 | 43 s | 24 | Exceed Pelican ×2 (HP 144); Pelican ×15 (HP 48); Exceed Oculus ×1 (HP 144); Oculus ×6 (HP 48) |
| 4 | 35 s | 35 | 36.6 s | 40 | Pelican ×20 (HP 48); Lure ×20 (HP 48) |

(5 more rows of 9 not shown; see the data table.)

Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.

### EX-3 Chatterbox's Ambush

While Crown is away, Chatterbox launches an ambush.

- **Stage type**: Story stage
- **Unlock**: Clear EX-2 Incessant Attacks; Must clear Part 1 Stage 1-12
- **Defense Points**: 30 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 250
- **Nikke slots**: 2 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat the boss of the last wave
- **First clear**: Frame 29 ×1
- **Broken Cores**: 3 on first clear
- **Story before**: story "Pioneers: A" (`event_lastkingdom1_b03_s`)
- **Story after**: story "Pioneers: B" (`event_lastkingdom1_b03_e`)

#### Waves

| Wave | Wait | Early gold | Spawning | Raptures | Enemies |
|---|---|---|---|---|---|
| 1 | — | 25 | 31.6 s | 20 | Pelican ×12 (HP 42); Fez ×8 (HP 33) |
| 2 | 30 s | 30 | 37.4 s | 16 | Exceed Pelican ×1 (HP 126); Pelican ×7 (HP 42); Exceed Fez ×1 (HP 100); Fez ×7 (HP 33) |
| 3 | 40 s | 40 | 43 s | 24 | Exceed Pelican ×2 (HP 126); Pelican ×15 (HP 42); Exceed Fez ×1 (HP 100); Fez ×6 (HP 33) |
| 4 | 35 s | 35 | 36.6 s | 30 | Pelican ×18 (HP 54); Fez ×12 (HP 43) |

(5 more rows of 9 not shown; see the data table.)

Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.

#### In-battle dialogue

| When | Speaker | Line |
|---|---|---|
| Stage start | Marian | Thankfully, there aren't that many. |
|  | Marian | The two of us can handle them with no problem. |
|  | Kilo | Uh... |
|  | Marian | ... Kilo. |

(40 more rows of 44 not shown; see the data table.)

### EX-3-1 Chatterbox's Ambush II

Chatterbox's Ambush - Story II

- **Stage type**: Stage
- **Unlock**: Clear EX-3 Chatterbox's Ambush
- **Defense Points**: 20 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 400
- **Nikke slots**: 2 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat the boss of the last wave
- **First clear**: Ultra Boost Module ×5
- **Broken Cores**: 3 on first clear

#### Waves

| Wave | Wait | Early gold | Spawning | Raptures | Enemies |
|---|---|---|---|---|---|
| 1 | — | 25 | 32 s | 18 | Pelican ×12 (HP 48); Fez ×6 (HP 38) |
| 2 | 35 s | 35 | 43 s | 24 | Exceed Pelican ×1 (HP 144); Pelican ×9 (HP 48); Exceed Fez ×2 (HP 115); Fez ×12 (HP 38) |
| 3 | 30 s | 30 | 25.2 s | 10 | Exceed Fez ×4 (HP 115); Exceed Pelican ×6 (HP 144) |
| 4 | 30 s | 30 | 36.6 s | 30 | Pelican ×9 (HP 62); Thief ×15 (HP 62); Fez ×6 (HP 49) |

(6 more rows of 10 not shown; see the data table.)

Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.

### EX-3-2 Chatterbox's Ambush III

Chatterbox's Ambush - Story III

- **Stage type**: Stage
- **Unlock**: Clear EX-3-1 Chatterbox's Ambush II
- **Defense Points**: 20 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 450
- **Nikke slots**: 3 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat the boss of the last wave
- **First clear**: Advanced Recruit Voucher ×1
- **Broken Cores**: 3 on first clear

#### Waves

| Wave | Wait | Early gold | Spawning | Raptures | Enemies |
|---|---|---|---|---|---|
| 1 | — | 30 | 29 s | 14 | Exceed Pelican ×1 (HP 144); Exceed Fez ×1 (HP 115); Pelican ×6 (HP 48); Fez ×6 (HP 38) |
| 2 | 30 s | 30 | 36.6 s | 30 | Fez ×15 (HP 38); Thief ×9 (HP 48); Oculus ×6 (HP 48) |
| 3 | 30 s | 30 | 25.2 s | 10 | Exceed Fez ×5 (HP 115); Exceed Oculus ×5 (HP 144) |
| 4 | 30 s | 30 | 31.8 s | 18 | Exceed Fez ×6 (HP 149); Thief ×12 (HP 62) |

(7 more rows of 11 not shown; see the data table.)

Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.

### EX-4 Massive Invasion

Indivilia personally leads a massive army of Raptures to attack the kingdom.

- **Stage type**: Story stage
- **Unlock**: Clear EX-3 Chatterbox's Ambush; Must clear Part 2 Stage 1-1
- **Defense Points**: 30 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 500
- **Nikke slots**: 3 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat the boss of the last wave
- **First clear**: Central Government Supply Chest I ×3
- **Broken Cores**: 3 on first clear
- **Story before**: story "Finite and Infinite: A" (`event_lastkingdom2_b01_s`)
- **Story after**: story "Finite and Infinite: B" (`event_lastkingdom2_b01_e`)

#### Waves

| Wave | Wait | Early gold | Spawning | Raptures | Enemies |
|---|---|---|---|---|---|
| 1 | — | 35 | 36.6 s | 30 | Pelican ×18 (HP 42); Thief ×12 (HP 42) |
| 2 | 40 s | 40 | 43 s | 24 | Exceed Pelican ×3 (HP 126); Ant ×9 (HP 42); Thief ×12 (HP 42) |
| 3 | 40 s | 40 | 53.8 s | 22 | Exceed Curvy Leg ×6 (HP 70); Pelican ×8 (HP 42); Exceed Pelican ×3 (HP 126); Thief ×5 (HP 42) |
| 4 | 35 s | 35 | 36.2 s | 28 | Exceed Curvy Leg ×6 (HP 91); Ant ×22 (HP 54) |

(5 more rows of 9 not shown; see the data table.)

Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.

#### In-battle dialogue

| When | Speaker | Line |
|---|---|---|
| Stage start | Snow White | They're coming. |
|  | Scarlet | Their numbers are most prodigious. |
|  | Rapunzel | They just keep coming and coming. |
|  | Kilo | This is why recapturing the surface is impossible. |

(24 more rows of 28 not shown; see the data table.)

### EX-4-1 Massive Invasion II

Massive Invasion - Story II

- **Stage type**: Stage
- **Unlock**: Clear EX-4 Massive Invasion
- **Defense Points**: 20 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 600
- **Nikke slots**: 3 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat the boss of the last wave
- **First clear**: Ultra Boost Module ×5
- **Broken Cores**: 3 on first clear

#### Waves

| Wave | Wait | Early gold | Spawning | Raptures | Enemies |
|---|---|---|---|---|---|
| 1 | — | 35 | 36.6 s | 30 | Thief ×30 (HP 48) |
| 2 | 30 s | 30 | 34.2 s | 28 | Exceed Curvy Leg ×6 (HP 80); Thief ×22 (HP 48) |
| 3 | 40 s | 40 | 40.2 s | 16 | Exceed Curvy Leg ×9 (HP 104); Exceed Fez ×4 (HP 149); Exceed Pelican ×3 (HP 187) |
| 4 | 40 s | 40 | 43 s | 24 | Exceed Curvy Leg ×3 (HP 104); Pelican ×9 (HP 62); Ant ×12 (HP 62) |

(8 more rows of 12 not shown; see the data table.)

Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.

### EX-4-2 Massive Invasion III

Massive Invasion - Story III

- **Stage type**: Stage
- **Unlock**: Clear EX-4-1 Massive Invasion II
- **Defense Points**: 20 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 650
- **Nikke slots**: 3 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat the boss of the last wave
- **First clear**: Advanced Recruit Voucher ×1
- **Broken Cores**: 3 on first clear

#### Waves

| Wave | Wait | Early gold | Spawning | Raptures | Enemies |
|---|---|---|---|---|---|
| 1 | — | 35 | 36.6 s | 30 | Thief ×18 (HP 48); Ant ×12 (HP 48) |
| 2 | 30 s | 30 | 36.2 s | 28 | Exceed Pelican ×6 (HP 144); Ant ×22 (HP 48) |
| 3 | 30 s | 30 | 39.2 s | 38 | Exceed Curvy Leg ×6 (HP 104); Ant ×16 (HP 62); Pelican ×16 (HP 62) |
| 4 | 35 s | 35 | 46 s | 40 | Thief ×18 (HP 62); Ant ×22 (HP 62) |

(9 more rows of 13 not shown; see the data table.)

Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.

### EX-5 Head-on Confrontation

Following Chime's strategy, Crown and her companions destroy the terrain surrounding the kingdom, meticulously preparing for the imminent decisive battle.

- **Stage type**: Story stage
- **Unlock**: Clear EX-4 Massive Invasion; Must clear Part 2 Stage 1-9
- **Defense Points**: 30 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 600
- **Nikke slots**: 3 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat the boss of the last wave
- **First clear**: Central Government Supply Chest I ×3
- **Broken Cores**: 3 on first clear
- **Story before**: story "Declaration of War: A" (`event_lastkingdom2_b02_s`)
- **Story after**: story "Declaration of War: B" (`event_lastkingdom2_b02_e`)

#### Waves

| Wave | Wait | Early gold | Spawning | Raptures | Enemies |
|---|---|---|---|---|---|
| 1 | — | 35 | 36.6 s | 30 | Pelican ×15 (HP 42); Oculus ×15 (HP 42) |
| 2 | 35 s | 35 | 43 s | 24 | Exceed Fez ×2 (HP 100); Fez ×15 (HP 33); Exceed Hard Hat ×1 (HP 100); Hard Hat ×6 (HP 33) |
| 3 | 30 s | 30 | 36.6 s | 40 | Oculus ×20 (HP 42); Hard Hat ×20 (HP 33) |
| 4 | 30 s | 30 | 25.2 s | 10 | Exceed Oculus ×4 (HP 163); Exceed Hard Hat ×6 (HP 131) |

(5 more rows of 9 not shown; see the data table.)

Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.

#### In-battle dialogue

| When | Speaker | Line |
|---|---|---|
| Wave 9 starts | Kilo | !! |
|  | Kilo | Chatterbox is approaching! |
|  | Chatterbox | ... |
|  | Snow White | Looks like it's taking the lead. |

(8 more rows of 12 not shown; see the data table.)

### EX-5-1 Head-on Confrontation II

Head-on Confrontation - Story II

- **Stage type**: Stage
- **Unlock**: Clear EX-5 Head-on Confrontation
- **Defense Points**: 20 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 700
- **Nikke slots**: 3 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat the boss of the last wave
- **First clear**: Ultra Boost Module ×5
- **Broken Cores**: 3 on first clear

#### Waves

| Wave | Wait | Early gold | Spawning | Raptures | Enemies |
|---|---|---|---|---|---|
| 1 | — | 30 | 31.8 s | 18 | Exceed Pelican ×6 (HP 144); Pelican ×12 (HP 48) |
| 2 | 30 s | 30 | 36.2 s | 28 | Exceed Pelican ×3 (HP 144); Exceed Oculus ×3 (HP 144); Thief ×11 (HP 48); Lure ×11 (HP 48) |
| 3 | 35 s | 35 | 49 s | 24 | Exceed Pelican ×3 (HP 187); Exceed Hard Hat ×4 (HP 149); Exceed Fez ×1 (HP 149); Fez ×8 (HP 49); Hard Hat ×8 (HP 49) |
| 4 | 45 s | 45 | 58.4 s | 50 | Pelican ×20 (HP 62); Ant ×10 (HP 62); Oculus ×20 (HP 62) |

(9 more rows of 13 not shown; see the data table.)

Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.

### EX-5-2 Head-on Confrontation III

Head-on Confrontation - Story III

- **Stage type**: Stage
- **Unlock**: Clear EX-5-1 Head-on Confrontation II
- **Defense Points**: 20 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 750
- **Nikke slots**: 4 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat the boss of the last wave
- **First clear**: Advanced Recruit Voucher ×1
- **Broken Cores**: 3 on first clear

#### Waves

| Wave | Wait | Early gold | Spawning | Raptures | Enemies |
|---|---|---|---|---|---|
| 1 | — | 35 | 36.6 s | 30 | Pelican ×18 (HP 48); Ant ×12 (HP 48) |
| 2 | 30 s | 30 | 36.2 s | 28 | Exceed Pelican ×3 (HP 144); Exceed Oculus ×3 (HP 144); Ant ×11 (HP 48); Bird ×11 (HP 48) |
| 3 | 35 s | 35 | 46 s | 40 | Thief ×18 (HP 62); Ant ×10 (HP 62); Bird ×12 (HP 62) |
| 4 | 45 s | 45 | 50.8 s | 32 | Exceed Pelican ×6 (HP 187); Exceed Oculus ×3 (HP 187); Thief ×6 (HP 62); Lure ×6 (HP 62); Ant ×11 (HP 62) |

(10 more rows of 14 not shown; see the data table.)

Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.

### EX-6 Final Front Line

After Chatterbox is defeated, the now gigantic Indivilia emerges onto the battlefield. The climactic showdown begins on the kingdom's final front line, where the fate of Crown Kingdom hangs in the balance.

- **Stage type**: Story stage
- **Unlock**: Clear EX-5 Head-on Confrontation; Must clear Part 2 Stage 1-11
- **Defense Points**: 30 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 700
- **Nikke slots**: 4 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat the boss of the last wave
- **First clear**: Central Government Supply Chest I ×3
- **Broken Cores**: 3 on first clear
- **Story before**: story "Final Defense: A" (`event_lastkingdom2_b03_s`)
- **Story after**: story "Final Defense: B" (`event_lastkingdom2_b03_e`)

#### Waves

| Wave | Wait | Early gold | Spawning | Raptures | Enemies |
|---|---|---|---|---|---|
| 1 | — | 30 | 31.8 s | 18 | Exceed Pelican ×6 (HP 126); Fez ×12 (HP 33) |
| 2 | 35 s | 35 | 59.4 s | 18 | Bulwark ×2 (HP 210); Exceed Pelican ×6 (HP 126); Pelican ×10 (HP 42) |
| 3 | 40 s | 40 | 52 s | 18 | Bulwark ×2 (HP 210); Exceed Pelican ×6 (HP 126); Pelican ×10 (HP 42) |
| 4 | 40 s | 40 | 48.6 s | 26 | Exceed Fez ×6 (HP 131); Ant ×14 (HP 54); Exceed Pelican ×2 (HP 163); Exceed Curvy Leg ×4 (HP 91) |

(5 more rows of 9 not shown; see the data table.)

Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.

#### In-battle dialogue

| When | Speaker | Line |
|---|---|---|
| Wave 9 starts | Indivilia | Chatterbox is a fool, |
|  | Indivilia | but now that it has evolved once again, |
|  | Indivilia | I'm very much looking forward to what happens next. |
|  | Indivilia | Such power just from ingesting one... |

(9 more rows of 13 not shown; see the data table.)

### EX-6-1 Final Front Line II

Final Front Line - Story II

- **Stage type**: Stage
- **Unlock**: Clear EX-6 Final Front Line
- **Defense Points**: 20 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 800
- **Nikke slots**: 4 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat the boss of the last wave
- **First clear**: Ultra Boost Module ×5
- **Broken Cores**: 3 on first clear

#### Waves

| Wave | Wait | Early gold | Spawning | Raptures | Enemies |
|---|---|---|---|---|---|
| 1 | — | 30 | 43 s | 24 | Exceed Pelican ×2 (HP 144); Pelican ×15 (HP 48); Exceed Fez ×1 (HP 115); Fez ×6 (HP 38) |
| 2 | 35 s | 35 | 47 s | 18 | Bulwark ×2 (HP 240); Exceed Fez ×3 (HP 115); Fez ×5 (HP 38); Exceed Pelican ×3 (HP 144); Pelican ×5 (HP 48) |
| 3 | 30 s | 30 | 40.2 s | 16 | Exceed Curvy Leg ×6 (HP 104); Exceed Pelican ×10 (HP 187) |
| 4 | 30 s | 30 | 43.4 s | 17 | Bulwark ×3 (HP 312); Exceed Hard Hat ×3 (HP 149); Exceed Curvy Leg ×3 (HP 104); Pelican ×5 (HP 62); Exceed Pelican ×3 (HP 187) |

(10 more rows of 14 not shown; see the data table.)

Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.

### EX-6-2 Final Front Line III

Final Front Line - Story III

- **Stage type**: Stage
- **Unlock**: Clear EX-6-1 Final Front Line II
- **Defense Points**: 20 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 850
- **Nikke slots**: 4 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat the boss of the last wave
- **First clear**: Advanced Recruit Voucher ×1
- **Broken Cores**: 3 on first clear

#### Waves

| Wave | Wait | Early gold | Spawning | Raptures | Enemies |
|---|---|---|---|---|---|
| 1 | — | 30 | 31.8 s | 18 | Exceed Pelican ×6 (HP 144); Thief ×6 (HP 48); Ant ×6 (HP 48) |
| 2 | 30 s | 30 | 40.2 s | 16 | Exceed Curvy Leg ×5 (HP 80); Exceed Pelican ×11 (HP 144) |
| 3 | 40 s | 40 | 50.8 s | 32 | Exceed Curvy Leg ×6 (HP 104); Thief ×12 (HP 62); Ant ×11 (HP 62); Exceed Pelican ×3 (HP 187) |
| 4 | 35 s | 35 | 47 s | 18 | Bulwark ×2 (HP 312); Exceed Curvy Leg ×3 (HP 104); Thief ×5 (HP 62); Exceed Fez ×3 (HP 149); Fez ×5 (HP 49) |

(10 more rows of 14 not shown; see the data table.)

Wait: time before the wave starts by itself (start it early for the bonus gold). Spawning: how long the wave keeps sending Raptures.

## Challenge

### Last Kingdom

An unidentified strange signal appears at an abandoned old city on the outskirts of Crown Kingdom, and the Raptures launch a large-scale invasion.

- **Stage type**: Challenge (endless score attack)
- **Unlock**: Clear EX-3 Chatterbox's Ambush
- **Defense Points**: 20 (a Rapture that gets through takes some away; at 0 the stage is lost)
- **Starting gold**: 1,500
- **Nikke slots**: 5 (1 open at the start; more cost 110 gold, +40 for each further slot)
- **Clear condition**: Defeat every wave (99 in all); the score counts however far you get

#### Waves

| Wave | Wait | Early gold | Wave score | Raptures |
|---|---|---|---|---|
| 1 | — | — | 40 | Pelican ×12 (HP 48); Thief ×8 (HP 48) |
| 2 | 20 s | 20 | 40 | Exceed Pelican ×3 (HP 144); Thief ×11 (HP 48) |
| 3 | 20 s | 20 | 40 | Exceed Pelican ×1 (HP 187); Pelican ×7 (HP 62); Exceed Fez ×1 (HP 149); Fez ×7 (HP 49) |
| 4 | 20 s | 20 | 40 | Pelican ×18 (HP 62); Oculus ×12 (HP 62) |

(95 more rows of 99 not shown; see the data table.)

Wait: time before the wave starts by itself; starting it early with Quick Start gives the bonus gold (and challenge score). Each wave picks one of several spawn layouts at random; when the layouts differ in Raptures, the chance of each is shown. HP grows with the wave number.

## Progress

### Upgrades

Permanent upgrades bought with Broken Core, which come from first-clearing stages.

#### Gun Tower

| Upgrade | Description | Effect | Cores |
|---|---|---|---|
| Gun Tower: Increase Attack Speed (S) | Slightly increases Gun Towers' attack speed. | attack speed +10% | 1 |
| Gun Tower: Increase Attack Range (S) | Slightly increases Gun Towers' attack range. | range +200 | 1 |
| Gun Tower: Increase ATK (S) | Slightly increases Gun Towers' ATK. | ATK +10% | 1 |
| Gun Tower: Skill Cost Reduction | Decreases the skill upgrade cost for Gun Towers. | skill cost −20% | 2 |

(1 more rows of 5 not shown; see the data table.)

#### Pulse Gun Tower

| Upgrade | Description | Effect | Cores |
|---|---|---|---|
| Pulse Gun Tower: Increase ATK (S) | Slightly increases Pulse Gun Towers' ATK. | ATK +10% | 1 |
| Pulse Gun Tower: Increase Attack Range (S) | Slightly increases Pulse Gun Towers' attack range. | range +200 | 1 |
| Pulse Gun Tower: Increase Attack Speed (S) | Slightly increases Pulse Gun Towers' attack speed. | attack speed +10% | 2 |
| Pulse Gun Tower: Skill Cost Reduction | Decreases the skill upgrade cost for Pulse Gun Towers. | skill cost −20% | 2 |

(1 more rows of 5 not shown; see the data table.)

#### Cannon Tower

| Upgrade | Description | Effect | Cores |
|---|---|---|---|
| Cannon Tower: Increase Effect Range (S) | Slightly increases Cannon Towers' effective range. | splash area +50 | 1 |
| Cannon Tower: Cost Reduction | Decreases the building and upgrade costs for Cannon Towers. | build cost −10% | 2 |
| Cannon Tower: Increase ATK (S) | Slightly increases Cannon Towers' ATK. | ATK +10% | 2 |
| Cannon Tower: Skill Cost Reduction | Decreases the skill upgrade cost for Cannon Towers. | skill cost −20% | 2 |

(1 more rows of 5 not shown; see the data table.)

#### Ice Cannon Tower

| Upgrade | Description | Effect | Cores |
|---|---|---|---|
| Ice Cannon Tower: Increase Debuff Effect (S) | Slightly increases Ice Cannon Towers' debuff effects. | debuff power +2.5% | 1 |
| Ice Cannon Tower: Increase Effect Range (S) | Slightly increases Ice Cannon Towers' effective range. | splash area +50 | 1 |
| Ice Cannon Tower: Increase Debuff Duration (S) | Slightly increases Ice Cannon Towers' debuff effect duration. | debuff duration +0.5 s | 1 |
| Ice Cannon Tower: Skill Cost Reduction | Decreases the skill upgrade cost for Ice Cannon Towers. | skill cost −20% | 2 |

(1 more rows of 5 not shown; see the data table.)

#### Nikkes

| Upgrade | Description | Effect | Cores |
|---|---|---|---|
| Nikke Tower: Increase ATK (L) | Significantly increases Nikkes' ATK. | ATK +15% | 1 |
| Nikke Tower: Increase Attack Speed (L) | Significantly increases Nikkes' attack speed. | attack speed +15% | 2 |
| Nikke Tower: Increase Attack Range (L) | Significantly increases Nikkes' attack range. | range +300 | 2 |
| Nikke Tower: Skill Cost Reduction | Decreases the skill upgrade cost for Nikkes. | skill cost −20% | 2 |

(1 more rows of 5 not shown; see the data table.)

#### Global

| Upgrade | Description | Effect | Cores |
|---|---|---|---|
| Increase Tower Demolition Refund I | Increases the refund amount when demolishing a tower. | sell refund +10% | 1 |
| Increase Defense Point I | Increases the defense points. | Defense Points +5 | 1 |
| Increased Tower Demolition Refund II | Significantly increases the refund amount when demolishing a tower. | sell refund +10% | 2 |
| Increase Defense Point II | Increases defense points even more. | Defense Points +5 | 2 |

(1 more rows of 5 not shown; see the data table.)

### Missions

#### Daily missions

| Mission | Reward |
|---|---|
| Obtain 100 gold | 20 mission points |
| Build 1 Tower | 20 mission points |
| Defeat 5 enemies | 20 mission points |
| Use Burst Skill once | 20 mission points |

(3 more rows of 7 not shown; see the data table.)

Each daily mission gives mission points; the point milestones below give the rewards.

#### Daily point rewards

| Points | Reward |
|---|---|
| Earn 20 mission points | Boost Module ×5 |
| Earn 40 mission points | Attacker Common Console ×3 |
| Earn 60 mission points | Defender Common Console ×3 |
| Earn 80 mission points | Supporter Common Console ×3 |

(1 more rows of 5 not shown; see the data table.)

#### Challenges

| Mission | Reward |
|---|---|
| Defeat 2,000 enemies | Skill Manual I ×18 |
| Obtain 10,000 gold in total | Skill Manual II ×12 |
| Build 50 Towers | Skill Manual III ×6 |
| Upgrade towers 50 times | Burst Manual I ×9 |

(15 more rows of 19 not shown; see the data table.)

#### Challenges (rerun)

| Mission | Reward |
|---|---|
| Upgrade all of Marian's skills | FOR THE KING Premium Sticker I ×1 |
| Upgrade all of Crown's skills | FOR THE KING Premium Sticker II ×1 |
| Defeat 2,500 enemies | Gem ×20 |
| Defeat 5,000 enemies | Gem ×20 |

(14 more rows of 18 not shown; see the data table.)

Used when the minigame returns in the event archive.

## April Fools

### Mecha Shifty stage

A one-stage April Fools version: Shifty and her Mecha Shiftys against raging Mecha Shiftys.

#### The Invasion of Raging Mecha Shiftys

- The invasion of Raging Shiftys has begun. / Set up towers to stop the raging Shiftys. / Everyone already knows this, so I can't be bothered to write the tutorial.

#### Set up towers and defend

- Tap the tower slot to select where to place the tower. / Tap the tower button to choose the tower you want to place. / Tap again to confirm. / In short: Just keep tapping, and you'll be all set.

#### About Shifty

- Let me make an acrostic poem with "SHIFTY." / SHIfty travels to / France. / TYrannosaurus.

#### Small Raging Mecha Shifty Info

- A small but precious Mecha Shifty. / Looks extremely angry, but there's nothing it can do.

#### Medium Raging Mecha Shifty Info

- A standard-sized Mecha Shifty. / Can someone please make a plastic model of it?

#### Large Raging Mecha Shifty Info

- A giant-sized Mecha Shifty. / If they make plastic models of this, I'm buying five.

#### Mega Mecha Shifty Info

- The culprit behind this situation. / Giant mecha girls are always right.

#### Shifty (Shifty will head to the front line. While most of her attacks miss, they will occasionally hit the target and deal fatal damage. Using her Burst Skill will concentrate fire on a chosen spot, although most attacks will still miss.)

| Tower | Level | Gold | ATK | DEF pen. | Attack speed | Range | Attack | Hits | Special |
|---|---|---|---|---|---|---|---|---|---|
| Shifty I | Lv. 1 | — | 2 | 41% | Average (40 RPM) | 2,800 | Bullet | Ground and air | 10% chance: extra hit (power 80,000); Bosses first |
| Shifty II | Lv. 2 | 160 | 3 | 41% | Average (50 RPM) | 3,000 | Bullet | Ground and air | 12.5% chance: extra hit (power 80,000); Bosses first |
| Shifty III | Lv. 3 | 230 | 4 | 41% | Average (60 RPM) | 3,200 | Bullet | Ground and air | 15% chance: extra hit (power 80,000); Bosses first |
| Shifty: World's Strongest | Evolved | 360 | 5 | 41% | Average (70 RPM) | 3,700 | Bullet | Ground and air | 20% chance: extra hit (power 80,000); Bosses first |

#### Shifty: Burst Skill

| Skill | Type | Description | Trigger | Effects |
|---|---|---|---|---|
| Panic Sight Lv. 1 | [Burst] | Darn, what is this!! | Drag onto the map; cooldown 40 s | Damage, power 10,000; Damage, power 50,000 (10% chance) |
| Panic Sight Lv. 2 | [Burst] | What is going on!? | Drag onto the map; cooldown 40 s | Damage, power 10,000; Damage, power 60,000 (12.5% chance) |
| Panic Sight Lv. 3 | [Burst] | What am I doing!? | Drag onto the map; cooldown 40 s | Damage, power 10,000; Damage, power 70,000 (15% chance) |
| Super Panic Sight | [Burst] | I'm sorry!! | Drag onto the map; cooldown 40 s | Damage, power 10,000; Damage, power 80,000 (25% chance) |

The Burst Skill levels up with the tower. Power is the game’s damage value (meaning of the scale unclear).

#### Shifty: evolved tower skills

| Skill | Type | Description | Trigger | Effects | Gold |
|---|---|---|---|---|---|
| Super Operator Lv. 1 | [Active] | Shifty borrows the power of advanced equipment. / Her hit rate increases for a short time. | When the Burst Skill is used | Self: normal-attack effect chance +20% for 6 s | 350 |
| Super Operator Lv. 2 | [Active] | Shifty masters the use of advanced equipment. / Her hit rate increases significantly for a short time. | When the Burst Skill is used | Self: normal-attack effect chance +45% for 6 s | 210 |
| Super Operator Lv. 3 | [Active] | Shifty utilizes the advanced equipment to its fullest. / Her hit rate becomes 100% for a short time. | When the Burst Skill is used | Self: normal-attack effect chance +80% for 8 s | 420 |
| Burst Cooldown Reduction Lv. 1 | [Passive] | Slightly decreases the tower's Burst Skill cooldown. | Always on | Burst cooldown −3 s | 210 |

(2 more rows of 6 not shown; see the data table.)

Learned with gold on an evolved tower, then upgraded up to Lv. 3.

#### Mec

(Cut to fit; the viewer pages in the app have the rest.)

## Data sources

All in `D:\Nikke Datamine\mpkparser\jsons` as `<Table>.json`.

| Table | Rows | Fields |
|---|---|---|
| `EventTowerDefenseArcadeManagerTable` | 1 | `id`, `arcade_event_id`, `exist_manager_id`, `arcade_mission_group_id` |
| `EventTowerDefenseArchiveManagerTable` | 1 | `id`, `event_id`, `exist_manager_id` |
| `EventTowerDefenseManagerTable` | 2 | `id`, `event_id`, `event_type`, `ui_prefab_keyword`, `hero_slot_open_cost`, `hero_slot_open_cost_increase`, `tower_refund_percentage`, `wave_quick_start_burst_skill_acceleration`, `monster_limit`, `tower_build_time`, `tower_demolish_time`, `area_vertical_diameter`, `ui_control_game_speed_deceleration`, `zoom_max_value`, `zoom_speed`, `resource_default_scale`, `monster_default_scale`, `upgrade_currency_resource`, `upgrade_currency_name`, `upgrade_currency_description`, `toast_message_print_time`, `daily_mission_toast_message_title_locale`, `daily_mission_toast_message_locale`, `daily_mission_toast_message_icon`, `daily_mission_toast_message_print_value`, `achievement_mission_toast_message_title_locale`, `achievement_mission_toast_message_icon`, `ingame_dialog_print_speed`, `burst_dialog_print_time`, `buff_termination_notice_time`, `buff_termination_notice_blink_rate`, `stage_clear_delay`, `burst_guide_toast_hold_time`, `is_use_3x_speed`, `is_use_wave_info`, `first_entry_message_localkey` |
| `EventTowerDefenseMissionTable` | 49 | `id`, `minigame_manager_id`, `arcade_mission_group_id`, `mission_localkey`, `mission_category`, `mission_type`, `mission_target_id`, `mission_count`, `mission_value`, `reward_type`, `reward_value` |
| `EventTowerDefenseTutorialTable` | 5 | `id`, `minigame_manager_id`, `tutorial_list_group_id`, `tutorial_title_localkey`, `is_opened` |
| `EventTowerDefenseTutorialListTable` | 31 | `id`, `group_id`, `tutorial_page_group_id`, `tutorial_type`, `button_type`, `button_value`, `tutorial_output_type`, `tutorial_output_value`, `tutorial_title_localkey`, `is_opened` |
| `EventTowerDefenseTutorialPageTable` | 42 | `id`, `group_id`, `page_type`, `page_order`, `is_available_in_arcade`, `image_resource`, `page_title_localkey`, `tutorial_localkey` |
| `EventTowerDefenseBuffTable` | 107 | `id`, `manager_id`, `buff_priority`, `is_can_stack`, `buff_name`, `buff_description`, `buff_target`, `buff_effect_type`, `buff_effect_value`, `buff_effect_resource`, `buff_icon_resource`, `set_sprite_tint`, `set_sprite_tint_alpha_value`, `set_transparent`, `is_default_buff` |
| `EventTowerDefenseBurstDialogTable` | 14 | `id`, `hero_group_id`, `speaker`, `scenario_localkey`, `nikke_resource_id`, `nikke_costume_index` |
| `EventTowerDefenseCinematicTable` | 15 | `id`, `stage_id`, `start_condition_type`, `start_condition_value`, `start_delay`, `cinematic_type`, `cinematic_type_value`, `tower_spawn_delay`, `timeline_action_start_frame`, `timeline_action_end_frame`, `is_loop_action` |
| `EventTowerDefenseDebuffTable` | 47 | `id`, `debuff_priority`, `debuff_name`, `debuff_description`, `debuff_effect_type`, `debuff_effect_value`, `debuff_effect_resource`, `is_use_sprite_tint`, `set_sprite_tint`, `set_sprite_tint_alpha_value` |
| `EventTowerDefenseMonsterTable` | 902 | `id`, `manager_id`, `monster_grade`, `monster_name`, `monster_description`, `monster_icon`, `monster_resource`, `monster_anim_speed`, `monster_scale`, `monster_hit_detection_radius`, `monster_hp`, `monster_def`, `monster_speed`, `move_type`, `monster_skill_list`, `is_use_next_phase`, `next_phase_monster_id`, `next_phase_monster_spawn_count`, `next_phase_monster_spawn_radius`, `defense_point_decrease`, `gold_reward`, `skill_unusable_time`, `challenge_score` |
| `EventTowerDefenseMonsterSkillTable` | 57 | `id`, `monster_skill_order`, `monster_skill_name`, `monster_skill_description`, `monster_skill_active_type`, `monster_skill_active_value`, `skill_cast_time`, `monster_skill_type`, `monster_skill_type_value_list`, `monster_skill_resource_effect`, `skill_effect_delay`, `monster_skill_resource_effect_2`, `skill_effect_delay_2`, `monster_skill_resource_area_effect` |
| `EventTowerDefenseScenarioGroupTable` | 21 | `id`, `manager_id`, `stage_id`, `output_condition_type`, `output_condition_value`, `delay_time`, `dialog_list_group_id` |
| `EventTowerDefenseScenarioListTable` | 181 | `id`, `dialog_list_group_id`, `speaker`, `speaker_position`, `speaker_team`, `scenario_localkey`, `print_cutscene` |
| `EventTowerDefenseSpeakerTable` | 17 | `id`, `speaker_name`, `speaker_portrait` |
| `EventTowerDefenseStageTable` | 20 | `id`, `manager_id`, `event_story_id`, `stage_type`, `stage_order`, `stage_name_localkey`, `stage_short_name_localkey`, `stage_description_localkey`, `stage_info_image`, `is_event_story_stage`, `event_story_stage_locked_alert_message`, `open_condition_event_story_stage`, `open_condition_archive_event_story_stage`, `open_condition_event_story_stage_locale`, `open_condition_td_stage`, `open_condition_time`, `tower_defense_stage_map_prefab`, `wave_data_group_id`, `defense_point`, `start_gold`, `max_hero_slot`, `hero_slot_open_count`, `stage_clear_condition_type`, `stage_first_clear_reward`, `stage_first_clear_upgrade_currency_reward`, `enter_scenario`, `exit_scenario`, `stage_select_tutorial_id` |
| `EventTowerDefenseTowerTable` | 86 | `id`, `manager_id`, `tower_group_id`, `linked_group_id`, `is_for_cinematic`, `tower_type`, `tower_name`, `tower_description`, `tower_resource`, `tower_projectile`, `tower_hit_effect`, `tower_icon`, `tower_level`, `tower_cost`, `tower_open_condition_stage_order`, `tower_open_condition_stage_clear`, `tower_reinforce_type`, `tower_reinforce_value_01`, `tower_reinforce_value_02`, `attack_range`, `attack_priority_01`, `attack_priority_02`, `attack_type`, `attack_effect_range`, `attack_target_count`, `attack_projectile_approach_time`, `attack_projectile_max_height`, `attack_projectile_missile_propulsion_start_timing`, `attack_movement_type`, `tower_stat_atk`, `tower_stat_def_penetration`, `tower_stat_rpm`, `tower_rpm_text`, `tower_stat_cast_delay`, `apply_debuff`, `apply_chance`, `apply_debuff_hold_time`, `hit_effect_print_type`, `tower_skill_list`, `tower_burst_skill`, `tower_default_buff` |
| `EventTowerDefenseTowerSkillTable` | 138 | `id`, `skill_group_id`, `skill_system_type`, `skill_name`, `skill_description`, `skill_description_short`, `skill_icon`, `skill_icon_background`, `skill_projectile`, `skill_projectile_muzzle_type`, `skill_fire_effect`, `skill_hit_effect`, `skill_hit_effect_type`, `skill_aura_effect`, `skill_aura_effect_type`, `skill_aura_effect_target_type`, `skill_aura_effect_hold_time`, `skill_area_effect`, `skill_area_effect_type`, `skill_spine_resource_parameter_on`, `skill_spine_resource_parameter_hold_time`, `use_skill_spine_animation`, `skill_level`, `skill_cost`, `skill_use_type`, `skill_cool_time`, `skill_use_attack_count`, `skill_type`, `skill_target_select_priority`, `skill_effect_range`, `skill_instant_effect_apply_delay`, `skill_missile_projectile_count`, `skill_missile_projectile_fire_delay`, `skill_projectile_approach_time`, `skill_projectile_max_height`, `skill_projectile_missile_propulsion_start_timing`, `skill_area_hold_time`, `skill_area_effect_duration`, `skill_effect_list` |
| `EventTowerDefenseUpgradeGroupTable` | 12 | `id`, `manager_id`, `upgrade_group_order`, `upgrade_group_icon`, `upgrade_target_type`, `upgrade_target_tower_group_id`, `upgrade_list_group_id` |
| `EventTowerDefenseUpgradeListTable` | 60 | `id`, `group_id`, `upgrade_list_order`, `upgrade_name`, `upgrade_description`, `upgrade_icon`, `upgrade_cost`, `upgrade_effect_type`, `upgrade_effect_value` |
| `EventTowerDefenseWaveDataTable` | 289 | `id`, `wave_data_group_id`, `wave_order`, `wave_start_waiting_time`, `wave_fast_start_reward_gold`, `next_wave_call_time`, `wave_type`, `wave_path_group_id`, `wave_represent_monster`, `challenge_score` |
| `EventTowerDefenseWavePathTable` | 8237 | `id`, `wave_path_group_id`, `spawn_start_time`, `spawn_monster_id`, `spawn_count`, `spawn_delay`, `starting_point_group`, `starting_point_type`, `starting_point_min_order`, `starting_point_max_order`, `forced_starting_point_index` |
| `EventTowerDefenseWavePathRandomTable` | 1188 | `id`, `random_group_id`, `wave_path_group_id`, `random_chance`, `wave_represent_monster` |

## Uncertain / unknown

- The Burst Skill levels up with the tower. Power is the game’s damage value (meaning of the scale unclear).
