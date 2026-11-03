# Rebuild Eden

A city builder: rebuild Eden floor by floor. Power your facilities, collect materials, hire units into squads and send them on dispatch missions while following 23 Main Missions to the Command Center.

This guide was generated from the Nikke Library's reading of the game data: the viewer `lib/eventgames/goddessfall.js` turns the `Event*` tables in `D:\Nikke Datamine\mpkparser\jsons` into the rules below. Numbers, units and formulas are the viewer's readings; anything it was not sure of is listed under "Uncertain / unknown". Long lists are cut to 8 rows.

- Intro story: "Rebuild" (`d_contents_rebuildeden_01`)
- Art folder: `icons-event/69_goddessfall`

## How to play (in-game help)

- **Overview**: REBUILD: EDEN is a mini game where you reconstruct and manage Eden's facilities that were destroyed by the Rapture Queen. The ultimate goal is to rebuild Eden. Collect resources and repair facilities to fully rebuild Eden. Hire mecha units to rebuild facilities and collect resources through Dispatch Missions.
- **HUD**: ■ This timer shows the passage of time within Eden. ■ A day passes every three minutes, and an environmental event may occur at random. ■ When the timer reaches one week, a summary is generated. ■ The summary displays the result of the week's reconstruction activities. ■ You can see the changes in resource gains and number of units hired. ■ This bulletin board displays Eden's current resources. ■ From left to right, it displays the amount of Construction Materials, Upgrade Materials, and Special Materials. ■ Eden's current reconstruction progress is displayed here. ■ Increase progress by completing Main Missions and Side Missions. This is the main menu for REBUILD: EDEN. ■ Overview: View a summary of the current state of Eden. ■ Construction: Construct facilities within Eden. ■ Squad: Set up squads in Eden. ■ Missions/Dispatches: View the main missions and dispatch missions of REBUILD: EDEN. This is the sub menu for REBUILD: EDEN. Missions ■ View challenges that can be completed while playing REBUILD: EDEN. ■ Missions are completed when specific conditions are met. Storage ■ View resources and equipment you currently own. Help ■ View helpful information about REBUILD: EDEN.
- **Resources**: Construction Materials are the most basic type of resource. They are relatively easy to obtain, but are in high demand. Obtain from ■ Daily Supply Station (daily) ■ Resource Collection Station (periodically after construction) ■ Dispatch Missions Upgrade Materials are rarer than Construction Materials. Demand for them is lower, but there are also fewer ways to obtain them. Obtain from ■ Daily Supply Station (daily starting from Day 12) ■ Underground Resource Collection Station (periodically after construction) ■ Dispatch Missions Special Materials are the rarest resource. They can only be obtained once you reach a certain stage in the Main Missions. Obtain from ■ Daily Supply Station (daily starting from Day 20) ■ Energy Conversion Station (periodically after construction) ■ Dispatch Missions
- **Construction**: ■ Facilities are buildings in Eden with various purposes. ■ In the early stages of the mini game, only certain facilities can be constructed. As you progress through the Main Missions, more facilities will be unlocked. ■ To construct a facility, select a closed tile or access the Construction menu. Select a Closed Facility Tile to Construct 1. Select a closed facility tile. 2. Choose your desired facility in the Buy/Construct Facility window. 3. Confirm your selection to proceed with the construction. Constuct via the Construction Menu 1. Open the Construction menu on the lower-right corner of the main screen. 2. Choose your desired facility in the Buy/Construct Facility window. 3. Constructible and non-constructible areas will be highlighted based on the selected facility. 4. Select your desired tile and confirm to proceed with the construction.
- **Construction - Elevator**: ■ The elevator is a facility required to supply power to other floors. ■ If a facility that requires power is constructed on a floor other than the first, it will not operate even if it receives power from the power plant, unless there is an elevator. ■ The elevator can only be installed in the 5th column of the first floor. ■ It also transports hired units between floors, so an elevator must be constructed to access other floors.
- **Construction - Special Facility**: ■ Some facilities can only be constructed on specific tiles. ■ These facilities can be constructed by completing Main Missions.
- **Power**: ■ Power is the energy required to operate a facility after it is constructed. ■ Construct a Power Plant to supply power to its surrounding facilities. ■ The power supply range changes according to the Power Plant's tier. ■ The Power Plant supplies power to two tiles on its left and right. ■ The Power Plant MK.II supplies power to three tiles on its left and right. ■ The Power Plant MK.III supplies power to a fan-shaped area. ■ The Power Plant MK.IV supplies power in all directions.
- **Facilities**: ■ Certain facilities can be upgraded. ■ Each facility type has its own unique upgrade options, which helps improve its efficiency. ■ To upgrade a facility, you must have the required materials for its upgrade level. ■ Existing facilities can be demolished via Demolish Facility in Facility Details. ■ Some facilities cannot be demolished once constructed. ■ When a facility is demolished, 100% of the materials used for its construction are refunded. ■ Some facilities have synergy effects. ■ Construct facilities according to the recommended placement conditions to activate these effects. ■ Synergy effects further improve a facility's efficiency, but in some cases, you may have to reconstruct facilities to activate them. It's recommended to activate them when you have sufficient resources. ■ You can check a facility's synergy effects before constructing it. ■ You can also view a facility's synergy effects after it has been constructed.
- **Synergy Effects Overview**: Power Upgrade ■ Increases a Power Plant's power generation by 20 when another Power Plant is constructed on the tile immediately to its left or right. Supply Upgrade ■ Increases a Resource Collection Station's base production amount by 1 when a Daily Supply Station is built on the tile immediately to its left or right. Squad Assembly ■ Increases the success rate of dispatch missions by 5% when Dorm 2, 3 or 4 is built on the tile immediately to the left or right of Dorm 1. * This effect does not stack. Dispatch Upgrade ■ Increases the success rate of dispatch missions by 5% when the Employment Management Office and Dispatch Support Station are placed next to each other in order. Hiring Upgrade ■ Decreases the hiring cost of units by 10% when the Employment Management Office, Dispatch Support Station, and Employment Support Office are placed next to each other in order. Equipment Production + ■ Decreases the Equipment Production Facility's production time by 20% when the Equipment Production Facility and Armory are placed next to each other in order. Power Resource Conversion + ■ Decreases the Energy Conversion Station's production time by 20% when Power Plants are built on all tiles immediately to its left and right. Underground Resource Conversion + ■ Decreases the Underground Resource Collection Station's production time by 20% when Power Plants are built on all tiles immediately to its left and right.
- **Squad - Unit Overview**: ■ The menu lets you view all units currently hired in Eden. ■ Unit Overview shows the units in each squad, units assigned to facilities, and each unit's tier information. ■ Selecting a unit allows you to view its unique options.
- **Squad - Unit Formation**: ■ This menu lets you assign units to available squads. ■ Units must be assigned to a squad to carry out dispatch missions. ■ After assigning units, you can equip the squad with any available equipment.
- **Squad - Hire Unit**: ■ This menu lets you hire units to be stationed in Eden. ■ Units have different attributes and appearances based on their tier. Higher-tier units cost more to hire. ■ Hired units can move around freely in Eden even if they are not assigned to a squad or facility. ■ They can interact with specific facilities and perform various actions such as producing additional resources. ■ Even lower-tier units can be useful, so don't hesitate to hire them. ■ Units that no longer need to be stationed in Eden can be dismissed via Dismiss Unit. ■ When a unit is dismissed, 80% of its hiring cost is refunded. Dismissed units can still be rehired later.
- **Facility Assignment**: ■ Hired units can provide beneficial effects to facilities when assigned via Assign to Facility. ■ Only one unit can be assigned to each facility, so be sure to assign a unit where they'll be the most effective.
- **Missions**: ■ Main Missions are your top priority during Eden's reconstruction. ■ There are 23 stages in total. As you progress, you'll be tasked with collecting more resources or constructing special facilities. ■ Side Missions can be completed as you progress through Eden's reconstruction. ■ Complete missions to obtain a certain amount of random materials from Construction, Upgrade, or Special Materials.
- **Mission - Dispatch Mission**: ■ Obtain Construction, Upgrade, and Special Materials essential to Eden's reconstruction through Dispatch Missions. ■ The amount of rewards from each dispatch varies, and success is not guaranteed. ■ You must assign a unit to a squad in order to start a dispatch mission. ■ After a dispatch is completed, the same squad cannot be dispatched again until the waiting time ends. ■ Equipment used by a dispatched squad will be reduced by one in your inventory. ■ You'll receive three daily dispatch bonuses each day. ■ A daily dispatch bonus is consumed each time you complete a dispatch mission, granting extra rewards beyond the basic ones.
- **Equipment Production**: ■ You can produce equipment with options that are helpful for Dispatch Missions through Equipment Production. ■ All equipment have unique options and are classified as Alpha or Beta depending on the type of option. ■ Depending on the equipment's tier, specific production requirements or different amounts of resources may be required. Adjustable Quantity Production ■ You can set the quantity of equipment to produce in the Equipment Production Facility. 1. Select the equipment you wish to produce. 2. Adjust the production amount using the -1, -10, +1, and +10 buttons. 3. Select Start Production. ■ Once production begins, the specified quantity will be produced automatically. ■ Production will continue even if you close the Equipment Production window and perform other actions. Unlimited Production ■ You can produce an unlimited quantity of your selected equipment in the Equipment Production Facility. 1. Select the equipment you wish to produce. 2. Select Unlimited Production to set the production amount to unlimited. 3. Select Start Production. ■ Once production begins, it will continue automatically until your resources run out. ■ Production will continue even if you close the Equipment Production window and perform other actions. If you wish to stop production, tap Stop Production. ■ Equipment production can be stopped using the following methods. 1. Select Equipment Production in the  Equipment Production Facility. 2. Select Stop Production in the Equipment Production window.
- **Environmental Event**: ■ Construct the Weather Forecast Station, a special facility that allows you to observe the environment around Eden. Environmental events that grant special effects may occur. Environmental Event: Heatwave When Environmental Event: Heatwave occurs, the following effects may take place. ■ Resources obtained from Dispatch Missions are decreased. ■ All units' movement speed is increased. ■ There is a small chance the failure rate of Dispatch Missions will increase. Environmental Event: Rain When Environmental Event: Rain occurs, the following effects may take place. ■ Facility production time is increased. ■ All units' movement speed is increased. ■ There is a small chance unit hiring costs will increase. Environmental Event: Storm When Environmental Event: Storm occurs, the following effects may take place. ■ Facility power requirements are increased. ■ Facility synergy effects are increased. ■ There is a small chance the Equipment Production Facility will require more resources. Environmental Event: Snow When Environmental Event: Snow occurs, the following effects may take place. ■ All units' movement speed is decreased. ■ Facility synergy effects are increased. ■ There is a small chance facility synergy effects will decrease.
- **After Clearing**: ■ Once you complete Main Mission: 23. Rebuilding Eden, you'll be free to manage Eden however you like. ■ You can choose to focus on side missions, or dismiss some units and demolish facilities to reorganize Eden as you wish and play freely.

## Overview

### How it plays

- **Intro story**: story "Rebuild" (`d_contents_rebuildeden_01`)
- **Goal**: Complete the 23 Main Missions; each one unlocks new facilities, units, dispatches or equipment. After the last one Eden is yours to rearrange freely.
- **Building**: Pick a tile and a facility; construction takes 3 s. Demolishing refunds 100% of the cost. Some special facilities only fit on fixed tiles.
- **Power**: Most facilities need power from a nearby Power Plant. Above the first floor they also need the Elevator.
- **Time**: An in-game day passes every 3 min; a weekly summary follows every 7 days. With the Weather Forecast Station built, a random weather event can occur each day.
- **Hiring**: The hire list offers 5 units; rerolling it costs 150 Construction Materials. Dismissing refunds 80% of the hiring cost.
- **Dispatch**: Send a squad for materials. Success is not guaranteed; a super success gives ×2 rewards. 3 Daily Dispatch Bonuses a day add extra rewards. Equipment used on a dispatch is consumed.
- **Rerun**: The rerun (Arcade) uses the same missions and has its own set of challenges.

### Materials

|  | Material | Where from |
|---|---|---|
|  | Construction Materials | A basic material necessary for facility construction and equipment production. / Obtain from / ■ Daily Supply Station (daily) / ■ Resource Collection Station (periodically after construction) / ■ Dispatch Missions |
|  | Upgrade Materials | An essential material for facility construction and upgrades, as well as equipment production. It is highly durable. / Obtain from / ■ Daily Supply Station (daily starting from Day 12) / ■ Underground Resource Collection Station (periodically after construction) / ■ Dispatch Missions |
|  | Special Materials | An essential material for facility construction and upgrades, as well as equipment production. It is extremely rare and can be processed in many ways. / Obtain from / ■ Daily Supply Station (daily starting from Day 20) / ■ Energy Conversion Station (periodically after construction) / ■ Dispatch Missions |

### Facilities

- Power Plant
- Resource Collection Station
- Daily Supply Station
- Dorm 1
- Elevator
- Power Plant MK.II
- Resource Collection Station MK.II
- Equipment Production Facility
- Armory
- Employment Management Office
- Weather Forecast Station
- Resource Collection Station MK.III
- Energy Conversion Station
- Dispatch Support Station
- Automatic Turret (Left Port)
- Research Center
- Power Plant MK.III
- Resource Collection Station MK.IV
- Underground Resource Collection Station
- Employment Support Office
- Upper Floor Passage
- Power Plant MK.IV
- Resource Collection Station MK.V
- Command Center
- Outer Wall

## Eden

### Facilities

Everything you can build. “Power needed” must be covered by Power Plants in range.

#### Power

|  | Facility | Cost | Power needed | Does | Limits | Unlocked by | Synergy |
|---|---|---|---|---|---|---|---|
|  | Power Plant (A facility that supplies 20 units of power within a fixed range.) | Construction Materials ×50 | — | Supplies 20 power to 2 tiles left and right | No limit / Upgrades to Lv 4 | From the start | Power Upgrade |
|  | Power Plant MK.II (A facility that supplies 30 units of power within a fixed range.) | Construction Materials ×350; Upgrade Materials ×25 | — | Supplies 30 power to 3 tiles left and right | No limit / Upgrades to Lv 4 | 6. Preparing Dispatch Squads | Power Upgrade |
|  | Power Plant MK.III (A facility that supplies 40 units of power within a fixed range.) | Construction Materials ×900; Upgrade Materials ×80; Special Materials ×120 | — | Supplies 40 power to a fan-shaped area | No limit / Upgrades to Lv 4 | 9. The Road to Rebuilding Eden I | Power Upgrade |
|  | Power Plant MK.IV (A facility that supplies 50 units of power within a fixed range.) | Construction Materials ×2,000; Upgrade Materials ×500; Special Materials ×260 | — | Supplies 50 power to all directions | No limit / Upgrades to Lv 4 | 12. The Road to Rebuilding Eden II | Power Upgrade |

#### Production

|  | Facility | Cost | Power needed | Does | Limits | Unlocked by | Synergy |
|---|---|---|---|---|---|---|---|
|  | Resource Collection Station (A facility that collects the basic resources necessary for the reconstruction of Eden.) | Construction Materials ×30 | 20 | Produces Construction Materials (1 per batch) | No limit / Upgrades to Lv 5 | 1. Construction Basics | Supply Upgrade |
|  | Daily Supply Station (A facility that supplies a certain amount of resources daily.) |  | — | Hands out the daily supply (see Daily supply) | Max 1 | From the start |  |
|  | Resource Collection Station MK.II (A facility that collects the basic resources necessary for the reconstruction of Eden.) | Construction Materials ×350; Upgrade Materials ×25 | 50 | Produces Construction Materials (3 per batch) | No limit / Upgrades to Lv 5 | 6. Preparing Dispatch Squads | Supply Upgrade |
|  | Equipment Production Facility (A facility that produces equipment necessary for dispatch missions.) | Construction Materials ×150; Upgrade Materials ×15 | 75 | Produces equipment for dispatch squads | No limit / Upgrades to Lv 4 | 4. Dispatching Basics | Equipment Production + |
|  | Resource Collection Station MK.III (A facility that collects the basic resources necessary for the reconstruction of Eden.) | Construction Materials ×850; Upgrade Materials ×80; Special Materials ×110 | 100 | Produces Construction Materials (5 per batch) | No limit / Upgrades to Lv 5 | 9. The Road to Rebuilding Eden I | Supply Upgrade |
|  | Energy Conversion Station (A facility that uses the electricity supplied to Eden to produce secondary resources.) | Construction Materials ×1,450; Special Materials ×20 | 125 | Produces Special Materials (1 per batch) | Max 2 / Upgrades to Lv 4 | 9. The Road to Rebuilding Eden I | Power Resource Conversion + |
|  | Resource Collection Station MK.IV (A facility that collects the basic resources necessary for the reconstruction of Eden.) | Construction Materials ×1,450; Upgrade Materials ×480; Special Materials ×250 | 125 | Produces Construction Materials (7 per batch) | No limit / Upgrades to Lv 5 | 12. The Road to Rebuilding Eden II | Supply Upgrade |
|  | Underground Resource Collection Station (A facility that utilizes geothermal energy to produce special resources.) | Construction Materials ×1,450; Special Materials ×20 | 125 | Produces Upgrade Materials (1 per batch) | Max 4 / Upgrades to Lv 5 | 9. The Road to Rebuilding Eden I | Underground Resource Conversion + |

(1 more rows of 9 not shown; see the data table.)

#### Squad

|  | Facility | Cost | Power needed | Does | Limits | Unlocked by | Synergy |
|---|---|---|---|---|---|---|---|
|  | Dorm 1 (A dedicated facility where Nikkes or units can take a break.) | Construction Materials ×50 | — | Dorm 1: rest place for units; opens squad slots | Max 1 | 3. Utilizing Other Floors | Squad Assembly |
|  | Armory (A facility that stores weapons essential to Eden.) | Construction Materials ×10; Upgrade Materials ×100 | — | Lets squads equip equipment | Max 1 | 4. Dispatching Basics |  |
|  | Employment Management Office (A facility necessary for hiring Nikkes or units for dispatch missions.) | Construction Materials ×1,000; Upgrade Materials ×55 | — | Hire units | Max 1 / Upgrades to Lv 4 | 6. Preparing Dispatch Squads | Dispatch Upgrade; Hiring Upgrade |
|  | Dorm 2 (A dedicated facility where Nikkes or units can take a break.) | Construction Materials ×800; Upgrade Materials ×95; Special Materials ×25 | — | Dorm 2: rest place for units; opens squad slots | Max 1 | 10. Collecting Different Types of Resources |  |
|  | Dispatch Support Station (A facility that grants various effects to dispatch missions.) | Construction Materials ×3,200; Upgrade Materials ×320; Special Materials ×180 | — | Dispatch support (better dispatches through its traits) | Max 1 / Upgrades to Lv 4 | 13. Eden Power Upgrade III |  |
|  | Dorm 3 (A dedicated facility where Nikkes or units can take a break.) | Construction Materials ×4,320; Upgrade Materials ×190; Special Materials ×60 | — | Dorm 3: rest place for units; opens squad slots | Max 1 | 14. Dispatch Facility Upgrade |  |
|  | Employment Support Office (A facility that offers various support in hiring Nikkes and units.) | Construction Materials ×7,200; Upgrade Materials ×640; Special Materials ×400 | — | Hiring support (cheaper hiring through its traits) | Max 1 / Upgrades to Lv 4 | 12. The Road to Rebuilding Eden II |  |
|  | Dorm 4 (A dedicated facility where Nikkes or units can take a break.) | Construction Materials ×15,000; Upgrade Materials ×750; Special Materials ×380 | — | Dorm 4: rest place for units; opens squad slots | Max 1 | 17. The Road to Rebuilding Eden IV |  |

#### Special

|  | Facility | Cost | Power needed | Does | Limits | Unlocked by | Synergy |
|---|---|---|---|---|---|---|---|
|  | Elevator (A facility that activates constructed floors or assists with travel.) | Construction Materials ×25; Upgrade Materials ×10 | — | Carries power and units between floors | Max 13 / Cannot be demolished | 2. Resource Collection Basics |  |
|  | Weather Forecast Station (A facility that forecasts and predicts the environment around Eden.) | Construction Materials ×1,120; Upgrade Materials ×55; Special Materials ×15 | — | Turns on environmental events | Max 1 / Cannot be demolished | 8. Hiring & Assignment |  |
|  | Automatic Turret (Left Port) (A facility that automatically launches preemptive strikes at potential threats around Eden.) | Construction Materials ×3,600; Upgrade Materials ×80; Special Materials ×240 | — | Special facility built on a fixed tile | Max 1 / Cannot be demolished | 15. Dorm Expansion II |  |
|  | Research Center (A key facility in Eden where various scientific technologies can be researched.) | Construction Materials ×3,600; Upgrade Materials ×400; Special Materials ×300 | — | Special facility built on a fixed tile | Max 1 / Cannot be demolished | 11. Dorm Expansion I |  |
|  | Automatic Turret (Right Port) (A facility that automatically launches preemptive strikes at potential threats around Eden.) | Construction Materials ×3,600; Upgrade Materials ×80; Special Materials ×240 | — | Special facility built on a fixed tile | Max 1 / Cannot be demolished | 15. Dorm Expansion II |  |
|  | Upper Floor Passage (A key facility in Eden that is essential for reaching Eden's Command Center on the top floor.) | Construction Materials ×22,000; Upgrade Materials ×1,500; Special Materials ×800 | — | Special facility built on a fixed tile | Max 1 / Cannot be demolished | 19. The Road to Rebuilding Eden VI |  |
|  | Command Center (A facility that oversees the overall management of resources and research in Eden. / It also generates a force field using optical camouflage to conceal the facility from the Raptures.) | Construction Materials ×30,000; Upgrade Materials ×1,300; Special Materials ×1,200 | — | Special facility built on a fixed tile | Max 1 / Cannot be demolished | 22. Eden Reconstruction: Final Inspection III |  |
|  | Outer Wall (A defensive facility that guards the entrance to Eden. / It is not easily damaged even under heavy external impact.) | Construction Materials ×3,000; Upgrade Materials ×650; Special Materials ×360 | — | Special facility built on a fixed tile | Max 2 / Cannot be demolished | 15. Dorm Expansion II |  |

### Facility upgrades

Upgrading a facility gives 1 trait point per level; spend each point on one of the options.

#### Upgrade cost

| To level | Cost | Trait points |
|---|---|---|
| 2 | Construction Materials ×100; Upgrade Materials ×50 | 1 |
| 3 | Construction Materials ×200; Upgrade Materials ×75 | 1 |
| 4 | Construction Materials ×500; Special Materials ×100 | 1 |
| 5 | Construction Materials ×1,200; Special Materials ×175 | 1 |

#### Power Plant, Power Plant MK.II, Power Plant MK.III, Power Plant MK.IV

| Trait point | Option 1 | Option 2 |
|---|---|---|
| 1 | Increases the power plant's base power generation by 5. | — |
| 2 | Increases the power plant's base power generation by 10. | Decreases the power requirement of facilities on the left or right side of the power plant by 10. |
| 3 | Increases the power plant's base power generation by 20. | Decreases the power requirement of facilities on the left or right side of the power plant by 20. |

#### Resource Collection Station, Resource Collection Station MK.II, Resource Collection Station MK.III, Resource Collection Station MK.IV, Underground Resource Collection Station, Resource Collection Station MK.V

| Trait point | Option 1 | Option 2 |
|---|---|---|
| 1 | Gain 2 additional unit(s) upon production completion | — |
| 2 | Decreases the facility's power requirement by 10. | Decreases production time by 10%. |
| 3 | Decreases the facility's power requirement by 15. | Decreases production time by 15%. |
| 4 | Decreases the facility's power requirement by 20. | Decreases production time by 20%. |
| 5 | Decreases the facility's power requirement by 30. | Decreases production time by 25%. |

#### Equipment Production Facility

| Trait point | Option 1 | Option 2 |
|---|---|---|
| 1 | Gain 2 additional unit(s) upon production completion | — |
| 2 | Decreases resources required for production by 10. | Decreases production time by 10%. |
| 3 | Decreases resources required for production by 30. | Decreases production time by 20%. |

#### Employment Management Office

| Trait point | Option 1 | Option 2 |
|---|---|---|
| 1 | Decreases hiring costs by 3%. | — |
| 2 | Decreases hiring costs by 4%. | — |
| 3 | Decreases hiring costs by 7%. | — |

#### Energy Conversion Station

| Trait point | Option 1 | Option 2 |
|---|---|---|
| 1 | Decreases the facility's power requirement by 10. | — |
| 2 | Decreases the facility's power requirement by 15. | Decreases production time by 10%. |
| 3 | Decreases the facility's power requirement by 20. | Decreases production time by 20%. |

#### Dispatch Support Station

| Trait point | Option 1 | Option 2 |
|---|---|---|
| 1 | Increases the success rate of dispatch missions by 4%. | — |
| 2 | Increases the success rate of dispatch missions by 8%. | Increases the amount of resources obtained from dispatch missions by 10%. |
| 3 | Increases the success rate of dispatch missions by 15%. | Increases the amount of resources obtained from dispatch missions by 20%. |

#### Employment Support Office

| Trait point | Option 1 | Option 2 |
|---|---|---|
| 1 | Decreases hiring costs by 3%. | — |
| 2 | Decreases hiring costs by 4%. | — |
| 3 | Decreases hiring costs by 7%. | — |

### Synergies

Bonuses for placing certain facilities next to each other.

|  | Synergy | How | Effect | Facility |
|---|---|---|---|---|
|  | Power Upgrade | Construct or place a Power Plant on a tile adjacent to the left or right of an existing Power Plant. | Increases base power generation by 20. | Power Plant; Power Plant MK.II; Power Plant MK.III; Power Plant MK.IV |
|  | Supply Upgrade | Construct or place a Daily Supply Station on a tile adjacent to the left or right of the Resource Collection Station. | Increases the Resource Collection Station's base production amount by 1. | Resource Collection Station; Resource Collection Station MK.II; Resource Collection Station MK.III; Resource Collection Station MK.IV; Resource Collection Station MK.V |
|  | Squad Assembly | Construct or place Dorms 2 to 4 on the tiles adjacent to the left or right of Dorm 1. | Increases the success rate of Dispatch Missions by 5%. | Dorm 1 |
|  | Dispatch Upgrade | Construct or place Dispatch Support Stations sequentially on the tiles to the right of the Employment Management Office. | Increases the success rate of Dispatch Missions by 5%. | Employment Management Office |
|  | Hiring Upgrade | Construct or place Dispatch Support Stations and Employment Support Offices sequentially on the tiles to the right of the Employment Management Office. | Decreases the hiring cost of units by 10%. | Employment Management Office |
|  | Equipment Production + | Construct or place Armories sequentially on the tiles to the right of the Equipment Production Facility. | Decreases the Equipment Production Facility's production time by 20%. | Equipment Production Facility |
|  | Power Resource Conversion + | Construct or place Power Plants on the tiles adjacent to the left and right of the Energy Conversion Station. | Decreases the Energy Conversion Station's production time by 20%. | Energy Conversion Station |
|  | Underground Resource Conversion + | Construct or place Power Plants on the tiles adjacent to the left and right of the Underground Resource Collection Station. | Decreases the Underground Resource Collection Station's production time by 20%. | Underground Resource Collection Station |

### Equipment

Made in the Equipment Production Facility and given to dispatch squads. α raises success rate, β raises the materials brought back.

|  | Equipment | Tier | Effect | Cost | Time each | Unlocked by |
|---|---|---|---|---|---|---|
|  | Baseball Bat α (A hard wooden baseball bat that delivers painful strikes.) | 1 | Increases the success rate of dispatch missions by 5%. | Construction Materials ×50 | 3 s | From the start |
|  | Baseball Bat β (A hard wooden baseball bat that delivers painful strikes.) | 1 | Increases the amount of resources obtained from dispatch missions by 5%. | Construction Materials ×50 | 3 s | From the start |
|  | Crowbar α (A crowbar made of iron. It is a versatile tool and is fairly effective against Raptures.) | 2 | Increases the success rate of dispatch missions by 7%. | Construction Materials ×350 | 5 s | 7. Eden Facility Management & Squad Upgrade |
|  | Crowbar β (A crowbar made of iron. It is a versatile tool and is fairly effective against Raptures.) | 2 | Increases the amount of resources obtained from dispatch missions by 10%. | Construction Materials ×350 | 5 s | 7. Eden Facility Management & Squad Upgrade |
|  | Pistol α (A personal firearm from a bygone era. Its power isn't impressive, but it's still enough to take down Raptures.) | 3 | Increases the success rate of dispatch missions by 10%. | Construction Materials ×600 | 10 s | 9. The Road to Rebuilding Eden I |
|  | Pistol β (A personal firearm from a bygone era. Its power isn't impressive, but it's still enough to take down Raptures.) | 3 | Increases the amount of resources obtained from dispatch missions by 15%. | Construction Materials ×600 | 10 s | 9. The Road to Rebuilding Eden I |
|  | Submachine Gun α (A submachine gun widely used in the old days. It may be weaker than a pistol, but its rate of fire is impressive.) | 4 | Increases the success rate of dispatch missions by 13%. | Construction Materials ×1,200 | 25 s | 14. Dispatch Facility Upgrade |
|  | Submachine Gun β (A submachine gun widely used in the old days. It may be weaker than a pistol, but its rate of fire is impressive.) | 4 | Increases the amount of resources obtained from dispatch missions by 20%. | Construction Materials ×1,200 | 25 s | 14. Dispatch Facility Upgrade |

(2 more rows of 10 not shown; see the data table.)

### Daily supply

What the Daily Supply Station hands out, by day.

| Day | Supply |
|---|---|
| 0 | Construction Materials ×50 |
| 1 | Construction Materials ×55 |
| 2 | Construction Materials ×60 |
| 3 | Construction Materials ×65 |
| 4 | Construction Materials ×70 |
| 5 | Construction Materials ×80 |
| 6 | Construction Materials ×85 |
| 7 | Construction Materials ×90 |

(14 more rows of 22 not shown; see the data table.)

### Weather

Environmental events (needs the Weather Forecast Station). One weather type is picked, then one of its effects.

| Weather | Chance | Possible effect |
|---|---|---|
| Rain | 25% | 45%: Increases production time by 5%.; 45%: Increases the movement speed of all NPCs by 20%.; 10%: Increases the hiring costs of all NPCs by 7%. |
| Storm | 25% | 45%: Increases the facility's power requirement by 5.; 45%: Increases the facility's synergy effect by 50%.; 10%: Increases resources required for production by 10. |
| Heatwave | 25% | 45%: Decreases the amount of resources obtained from dispatch missions by 5%.; 45%: Increases the movement speed of all NPCs by 10%.; 10%: Increases the failure rate of dispatch missions by 5%. |
| Snow | 25% | 45%: Decreases the movement speed of all NPCs by 10%.; 45%: Increases the facility's synergy effect by 30%.; 10%: Decreases the facility's synergy effect by 15%. |

## Squads

### Units

Hired units move around Eden, can be assigned to one facility each for its effect, and fill dispatch squads.

#### Not in the hire list

|  | Unit | Effect when assigned | Speed | Stamina | Hire cost |
|---|---|---|---|---|---|
|  | T1 Ground-Type Squad (Tier 1) | Increases the power plant's base power generation by 5. | 140 | 30 | Construction Materials ×150 |
|  | T1 Aerial-Type Squad (Tier 1) | Decreases the power requirement of facilities on the left or right side of the power plant by 5. | 120 | 40 | Construction Materials ×150 |
|  | T1 Ground-Type Squad (Tier 1) | Decreases the facility's power requirement by 5. | 110 | 50 | Construction Materials ×150 |
|  | T1 Aerial-Type Squad (Tier 1) | Decreases production time by 5%. | 120 | 40 | Construction Materials ×150 |
|  | T1 Ground-Type Squad (Tier 1) | Decreases the facility's power requirement by 5. | 140 | 30 | Construction Materials ×150 |
|  | T1 Aerial-Type Squad (Tier 1) | Gain 1 additional unit(s) upon production completion | 120 | 40 | Construction Materials ×150 |
|  | T1 Ground-Type Squad (Tier 1) | Increases the success rate of dispatch missions by 5%. | 110 | 50 | Construction Materials ×150 |
|  | T1 Aerial-Type Squad (Tier 1) | Increases the amount of resources obtained from dispatch missions by 15%. | 120 | 40 | Construction Materials ×150 |

(8 more rows of 16 not shown; see the data table.)

Never offered for hire; some are handed out by Main Missions.

#### Hire pool 1 (tier 1)

|  | Unit | Effect when assigned | Speed | Stamina | Hire cost | Share of list | Appears after |
|---|---|---|---|---|---|---|---|
|  | T1 Battery-Equipped Ground Unit (Tier 1) | Increases the power plant's base power generation by 5. | 140 | 30 | Construction Materials ×150 | 6.74% |  |
|  | T1 High-Powered Aerial Unit (Tier 1) | Decreases the power requirement of facilities on the left or right side of the power plant by 5. | 120 | 40 | Construction Materials ×150 | 6.74% |  |
|  | T1 High-Powered Ground Unit (Tier 1) | Decreases the facility's power requirement by 5. | 110 | 50 | Construction Materials ×150 | 6.74% |  |
|  | T1 High-Efficiency Aerial Unit (Tier 1) | Decreases production time by 5%. | 120 | 40 | Construction Materials ×150 | 6.74% |  |
|  | T1 Battery-Equipped Ground Unit (Tier 1) | Increases the power plant's base power generation by 5. | 140 | 30 | Construction Materials ×150 | 6.74% |  |
|  | T1 High-Yield Aerial Unit (Tier 1) | Gain 1 additional unit(s) upon production completion | 120 | 40 | Construction Materials ×150 | 6.74% |  |
|  | T1 Dispatch-Friendly Ground Unit (Tier 1) | Increases the success rate of dispatch missions by 5%. | 110 | 50 | Construction Materials ×150 | 6.74% |  |
|  | T1 Dispatch-Ready Aerial Unit (Tier 1) | Increases the amount of resources obtained from dispatch missions by 15%. | 120 | 40 | Construction Materials ×150 | 6.74% |  |

(12 more rows of 20 not shown; see the data table.)

“Share of list” is the unit’s weight within this pool.

#### Hire pool 2 (tier 2)

|  | Unit | Effect when assigned | Speed | Stamina | Hire cost | Share of list | Appears after |
|---|---|---|---|---|---|---|---|
|  | T1 Battery-Equipped Ground Unit (Tier 1) | Increases the power plant's base power generation by 10. | 140 | 30 | Construction Materials ×150 | 6.54% |  |
|  | T2 Battery-Equipped Ground Unit (Tier 2) | Increases the power plant's base power generation by 20. | 145 | 40 | Construction Materials ×450; Upgrade Materials ×100 | 6.54% | 7. Eden Facility Management & Squad Upgrade |
|  | T2 High-Powered Aerial Unit (Tier 2) | Decreases the power requirement of facilities on the left or right side of the power plant by 15. | 125 | 50 | Construction Materials ×450; Upgrade Materials ×100 | 6.54% | 7. Eden Facility Management & Squad Upgrade |
|  | T2 High-Powered Ground Unit (Tier 2) | Decreases the facility's power requirement by 20. | 115 | 60 | Construction Materials ×450; Upgrade Materials ×100 | 6.54% | 7. Eden Facility Management & Squad Upgrade |
|  | T2 High-Efficiency Aerial Unit (Tier 2) | Decreases production time by 10%. | 125 | 50 | Construction Materials ×450; Upgrade Materials ×100 | 6.54% | 7. Eden Facility Management & Squad Upgrade |
|  | T2 High-Powered Ground Unit (Tier 2) | Decreases the facility's power requirement by 20. | 145 | 40 | Construction Materials ×450; Upgrade Materials ×100 | 6.54% | 7. Eden Facility Management & Squad Upgrade |
|  | T2 High-Yield Aerial Unit (Tier 2) | Gain 2 additional unit(s) upon production completion | 125 | 50 | Construction Materials ×450; Upgrade Materials ×100 | 6.54% | 7. Eden Facility Management & Squad Upgrade |
|  | T2 Dispatch-Friendly Ground Unit (Tier 2) | Increases the success rate of dispatch missions by 7%. | 115 | 60 | Construction Materials ×450; Upgrade Materials ×100 | 6.54% | 7. Eden Facility Management & Squad Upgrade |

(13 more rows of 21 not shown; see the data table.)

“Share of list” is the unit’s weight within this pool.

#### Hire pool 3 (tier 3)

|  | Unit | Effect when assigned | Speed | Stamina | Hire cost | Share of list | Appears after |
|---|---|---|---|---|---|---|---|
|  | T1 Battery-Equipped Ground Unit (Tier 1) | Increases the power plant's base power generation by 10. | 140 | 30 | Construction Materials ×150 | 6.54% |  |
|  | T3 Battery-Equipped Ground Unit (Tier 3) | Increases the power plant's base power generation by 30. | 150 | 50 | Construction Materials ×800; Upgrade Materials ×150; Special Materials ×100 | 7.01% | 9. The Road to Rebuilding Eden I |
|  | T3 High-Powered Aerial Unit (Tier 3) | Decreases the power requirement of facilities on the left or right side of the power plant by 20. | 130 | 60 | Construction Materials ×800; Upgrade Materials ×150; Special Materials ×100 | 7.01% | 9. The Road to Rebuilding Eden I |
|  | T3 High-Powered Ground Unit (Tier 3) | Decreases the facility's power requirement by 30. | 120 | 70 | Construction Materials ×800; Upgrade Materials ×150; Special Materials ×100 | 7.01% | 9. The Road to Rebuilding Eden I |
|  | T3 High-Efficiency Aerial Unit (Tier 3) | Decreases production time by 13%. | 130 | 60 | Construction Materials ×800; Upgrade Materials ×150; Special Materials ×100 | 7.01% | 9. The Road to Rebuilding Eden I |
|  | T3 Production-Efficient Ground Unit (Tier 3) | Gain 3 additional unit(s) upon production completion | 150 | 50 | Construction Materials ×800; Upgrade Materials ×150; Special Materials ×100 | 7.01% | 9. The Road to Rebuilding Eden I |
|  | T3 High-Yield Aerial Unit (Tier 3) | Gain 3 additional unit(s) upon production completion | 130 | 60 | Construction Materials ×800; Upgrade Materials ×150; Special Materials ×100 | 7.01% | 9. The Road to Rebuilding Eden I |
|  | T3 Dispatch-Friendly Ground Unit (Tier 3) | Increases the success rate of dispatch missions by 10%. | 120 | 70 | Construction Materials ×800; Upgrade Materials ×150; Special Materials ×100 | 7.01% | 9. The Road to Rebuilding Eden I |

(13 more rows of 21 not shown; see the data table.)

“Share of list” is the unit’s weight within this pool.

#### Hire pool 4 (tier 4)

|  | Unit | Effect when assigned | Speed | Stamina | Hire cost | Share of list | Appears after |
|---|---|---|---|---|---|---|---|
|  | T1 Battery-Equipped Ground Unit (Tier 1) | Increases the power plant's base power generation by 10. | 140 | 30 | Construction Materials ×150 | 6.54% |  |
|  | T4 Battery-Equipped Aerial Unit (Tier 4) | Increases the power plant's base power generation by 40. | 155 | 60 | Construction Materials ×1,600; Upgrade Materials ×200; Special Materials ×150 | 7.48% | 14. Dispatch Facility Upgrade |
|  | T4 High-Powered Ground Unit (Tier 4) | Decreases the power requirement of facilities on the left or right side of the power plant by 30. | 135 | 70 | Construction Materials ×1,600; Upgrade Materials ×200; Special Materials ×150 | 7.48% | 14. Dispatch Facility Upgrade |
|  | T4 High-Powered Aerial Unit (Tier 4) | Decreases the facility's power requirement by 40. | 125 | 80 | Construction Materials ×1,600; Upgrade Materials ×200; Special Materials ×150 | 7.48% | 14. Dispatch Facility Upgrade |
|  | T4 High-Efficiency Ground Unit (Tier 4) | Decreases production time by 16%. | 135 | 70 | Construction Materials ×1,600; Upgrade Materials ×200; Special Materials ×150 | 7.48% | 14. Dispatch Facility Upgrade |
|  | T4 Dispatch-Friendly Ground Unit (Tier 4) | Decreases the squad's waiting time by 14% after completing a dispatch. | 155 | 60 | Construction Materials ×1,600; Upgrade Materials ×200; Special Materials ×150 | 7.48% | 14. Dispatch Facility Upgrade |
|  | T4 High-Yield Aerial Unit (Tier 4) | Gain 4 additional unit(s) upon production completion | 135 | 70 | Construction Materials ×1,600; Upgrade Materials ×200; Special Materials ×150 | 7.48% | 14. Dispatch Facility Upgrade |
|  | T4 Dispatch-Friendly Ground Unit (Tier 4) | Increases the success rate of dispatch missions by 12%. | 125 | 80 | Construction Materials ×1,600; Upgrade Materials ×200; Special Materials ×150 | 7.48% | 14. Dispatch Facility Upgrade |

(13 more rows of 21 not shown; see the data table.)

“Share of list” is the unit’s weight within this pool.

#### Hire pool 5 (tier 5)

|  | Unit | Effect when assigned | Speed | Stamina | Hire cost | Share of list | Appears after |
|---|---|---|---|---|---|---|---|
|  | T1 Battery-Equipped Ground Unit (Tier 1) | Increases the power plant's base power generation by 10. | 140 | 30 | Construction Materials ×150 | 6.54% |  |
|  | T5 Battery-Equipped Aerial Unit (Tier 5) | Increases the power plant's base power generation by 50. | 160 | 70 | Construction Materials ×3,200; Upgrade Materials ×250; Special Materials ×200 | 8.41% | 17. The Road to Rebuilding Eden IV |
|  | T5 High-Powered Aerial Unit (Tier 5) | Decreases the power requirement of facilities on the left or right side of the power plant by 40. | 140 | 80 | Construction Materials ×3,200; Upgrade Materials ×250; Special Materials ×200 | 8.41% | 17. The Road to Rebuilding Eden IV |
|  | T5 High-Powered Ground Unit (Tier 5) | Decreases the facility's power requirement by 50. | 130 | 90 | Construction Materials ×3,200; Upgrade Materials ×250; Special Materials ×200 | 8.41% | 17. The Road to Rebuilding Eden IV |
|  | T5 High-Efficiency Aerial Unit (Tier 5) | Decreases production time by 22%. | 140 | 80 | Construction Materials ×3,200; Upgrade Materials ×250; Special Materials ×200 | 8.41% | 17. The Road to Rebuilding Eden IV |
|  | T5 High-Powered Ground Unit (Tier 5) | Decreases the facility's power requirement by 50. | 160 | 70 | Construction Materials ×3,200; Upgrade Materials ×250; Special Materials ×200 | 8.41% | 17. The Road to Rebuilding Eden IV |
|  | T5 High-Yield Aerial Unit (Tier 5) | Gain 5 additional unit(s) upon production completion | 140 | 80 | Construction Materials ×3,200; Upgrade Materials ×250; Special Materials ×200 | 8.41% | 17. The Road to Rebuilding Eden IV |
|  | T5 Dispatch-Friendly Ground Unit (Tier 5) | Increases the success rate of dispatch missions by 17%. | 130 | 90 | Construction Materials ×3,200; Upgrade Materials ×250; Special Materials ×200 | 8.41% | 17. The Road to Rebuilding Eden IV |

(13 more rows of 21 not shown; see the data table.)

“Share of list” is the unit’s weight within this pool.

#### Cecil

|  | Unit | Effect when assigned | Speed | Stamina | Hire cost | Share of list | Appears after |
|---|---|---|---|---|---|---|---|
|  | Cecil (Tier 5 · cannot be dismissed) | Increases the power plant's base power generation by 100. | 100 | 10 | Construction Materials ×35 | 100% | 8. Hiring & Assignment |

Always offered once its mission is done.

#### Special units

|  | Unit | Effect when assigned | Speed | Stamina | Hire cost | Share of list | Appears after |
|---|---|---|---|---|---|---|---|
|  | Johan (Tier 5 · cannot be dismissed) | Decreases the power requirement of facilities on the left or right side of the power plant by 100. | 100 | 10 | Construction Materials ×800; Upgrade Materials ×200; Special Materials ×150 | 6.76% | 8. Hiring & Assignment |
|  | Mecha Harran (Tier 5 · cannot be dismissed) | Decreases the facility's power requirement by 100. | 100 | 10 | Construction Materials ×800; Upgrade Materials ×200; Special Materials ×150 | 6.76% | 8. Hiring & Assignment |
|  | Mecha Isabel (Tier 5 · cannot be dismissed) | Decreases production time by 25%. | 100 | 10 | Construction Materials ×800; Upgrade Materials ×200; Special Materials ×150 | 6.76% | 8. Hiring & Assignment |
|  | Mecha Johan (Tier 5 · cannot be dismissed) | Decreases production time by 25%. | 100 | 10 | Construction Materials ×800; Upgrade Materials ×200; Special Materials ×150 | 6.76% | 8. Hiring & Assignment |
|  | Mecha Nayuta (Tier 5 · cannot be dismissed) | Gain 7 additional unit(s) upon production completion | 100 | 10 | Construction Materials ×800; Upgrade Materials ×200; Special Materials ×150 | 6.76% | 8. Hiring & Assignment |
|  | Mecha Noah (Tier 5 · cannot be dismissed) | Increases the success rate of dispatch missions by 25%. | 100 | 10 | Construction Materials ×800; Upgrade Materials ×200; Special Materials ×150 | 6.76% | 8. Hiring & Assignment |
|  | Mecha Papillon (Tier 5 · cannot be dismissed) | Increases the amount of resources obtained from dispatch missions by 40%. | 100 | 10 | Construction Materials ×800; Upgrade Materials ×200; Special Materials ×150 | 6.76% | 8. Hiring & Assignment |
|  | Mecha Rapunzel (Tier 5 · cannot be dismissed) | Decreases hiring costs by 12%. | 100 | 10 | Construction Materials ×800; Upgrade Materials ×200; Special Materials ×150 | 6.76% | 8. Hiring & Assignment |

(3 more rows of 11 not shown; see the data table.)

“Share of list” is the unit’s weight within this pool.

### Dispatch missions

Send a squad to bring back materials. Super success multiplies the rewards (×2). After a dispatch the squad rests before it can go again.

#### Tier 1

|  | Dispatch | Success | Super success | Rewards | Squad rest | Appears after |
|---|---|---|---|---|---|---|
|  | (Guaranteed) Resource Collection Expedition in the Forest (Construction) | 100% | 5% | Construction Materials ×32–40 | 1.7 min | From the start |
|  | (Probability) Resource Collection from the Rapture Ruins (Upgrade) | 60% | 15% | Upgrade Materials ×29–37 | 3.3 min | From the start |
|  | (Probability) Resource Collection from the Ruins of Eden (Upgrade) | 70% | 5% | Upgrade Materials ×28–36; Construction Materials ×42–50 | 3.3 min | From the start |
|  | (Probability) Abandoned House Exploration Outside Eden (Construction) | 65% | 10% | Construction Materials ×44–52 | 3.3 min | From the start |
|  | (Probability) Operation: Rapture Swarm Raid I (Upgrade) | 63% | 7% | Upgrade Materials ×29–37 | 3.3 min | From the start |
|  | (Probability) Underground Cave Investigation (Upgrade) | 85% | 2% | Upgrade Materials ×26–34; Construction Materials ×40–48 | 3.3 min | From the start |
|  | (Probability) Investigation of Units Roaming Outside Eden (Upgrade); [Once] | 100% | 0% | Upgrade Materials ×42–50 | 3.3 min | Building Resource Collection Station |
|  | (Probability) Resource Exploration Outside Eden I (Construction) | 72% | 10% | Construction Materials ×42–50 | 3.3 min | From the start |

(2 more rows of 10 not shown; see the data table.)

#### Tier 2

|  | Dispatch | Success | Super success | Rewards | Squad rest | Appears after |
|---|---|---|---|---|---|---|
|  | (Guaranteed) Abandoned Mine Expedition (Special) | 100% | 5% | Special Materials ×18–26; Upgrade Materials ×32–40; Construction Materials ×48–56 | 3.3 min | 7. Eden Facility Management & Squad Upgrade |
|  | (Probability) Resource Collection from Giant Rapture Ruins (Construction) | 58% | 5% | Construction Materials ×66–74 | 5 min | 7. Eden Facility Management & Squad Upgrade |
|  | (Probability) Resource Collection from the Junkyard (Construction) | 72% | 4% | Construction Materials ×63–71 | 5 min | 7. Eden Facility Management & Squad Upgrade |
|  | (Probability) Eden Ruins Recovery I (Construction) | 87% | 10% | Construction Materials ×60–68 | 5 min | 7. Eden Facility Management & Squad Upgrade |
|  | (Probability) Recovery of Remaining Minerals in the Mine (Special); [Once] | 100% | 0% | Special Materials ×18–26; Upgrade Materials ×33–41; Construction Materials ×51–59 | 5 min | Building Employment Management Office |
|  | (Probability) Operation: Rapture Swarm Raid II (Upgrade) | 32% | 25% | Upgrade Materials ×49–57; Construction Materials ×75–83 | 5 min | 7. Eden Facility Management & Squad Upgrade |
|  | (Probability) Construction Material Collection Mission I (Construction) | 66% | 10% | Construction Materials ×70–78 | 5 min | 7. Eden Facility Management & Squad Upgrade |
|  | (Probability) Operation: Rapture Pursuit and Raid Outside Eden I (Upgrade) | 40% | 25% | Upgrade Materials ×52–60 | 5 min | 7. Eden Facility Management & Squad Upgrade |

(2 more rows of 10 not shown; see the data table.)

#### Tier 3

|  | Dispatch | Success | Super success | Rewards | Squad rest | Appears after |
|---|---|---|---|---|---|---|
|  | (Guaranteed) Abandoned Armory Exploration (Construction) | 100% | 7% | Construction Materials ×51–59 | 5 min | 9. The Road to Rebuilding Eden I |
|  | (Probability) Oasis Exploration (Upgrade) | 67% | 10% | Upgrade Materials ×43–51; Construction Materials ×70–78 | 6.7 min | 9. The Road to Rebuilding Eden I |
|  | (Probability) Abandoned Resource Recovery in the Mountains (Construction) | 58% | 8% | Construction Materials ×70–78 | 6.7 min | 9. The Road to Rebuilding Eden I |
|  | (Probability) Eden Ruins Recovery II (Special) | 65% | 12% | Special Materials ×25–33; Upgrade Materials ×46–54 | 6.7 min | 9. The Road to Rebuilding Eden I |
|  | (Probability - High Risk) Operation: Giant Rapture Extermination I (Special) | 30% | 15% | Special Materials ×29–37; Upgrade Materials ×52–60; Construction Materials ×79–87 | 6.7 min | 9. The Road to Rebuilding Eden I |
|  | (Probability) Resource Recovery from Collapsed Facility (Construction); [Once] | 100% | 0% | Construction Materials ×51–59 | 6.7 min | Building Research Center |
|  | (Probability - Special) Investigation of the Strange Rapture Sighted Only at Night (Upgrade); [Rare] | 28% | 60% | Upgrade Materials ×52–60 | 6.7 min | 9. The Road to Rebuilding Eden I |
|  | (Probability) Operation: Rapture Night Raid I (Special) | 72% | 15% | Special Materials ×24–32; Upgrade Materials ×43–51; Construction Materials ×67–75 | 6.7 min | 9. The Road to Rebuilding Eden I |

(2 more rows of 10 not shown; see the data table.)

#### Tier 4

|  | Dispatch | Success | Super success | Rewards | Squad rest | Appears after |
|---|---|---|---|---|---|---|
|  | (Guaranteed) Exploration of Resources Detected from Eden (Upgrade) | 100% | 2% | Upgrade Materials ×36–44; Construction Materials ×60–68 | 6.7 min | 14. Dispatch Facility Upgrade |
|  | (Probability - Special) Resource Reprocessing Facility Visit (Special); [Rare] | 33% | 20% | Special Materials ×34–42; Upgrade Materials ×59–67; Construction Materials ×85–93 | 8.3 min | 14. Dispatch Facility Upgrade |
|  | (Probability) Construction Material Collection Mission I (Construction) | 84% | 10% | Construction Materials ×75–83 | 8.3 min | 14. Dispatch Facility Upgrade |
|  | (Probability) Construction Material Collection Mission II (Upgrade) | 82% | 10% | Upgrade Materials ×49–57; Construction Materials ×75–83 | 8.3 min | 14. Dispatch Facility Upgrade |
|  | (Probability) Operation: Rapture Night Raid II (Special) | 65% | 25% | Special Materials ×30–38; Upgrade Materials ×52–60 | 8.3 min | 14. Dispatch Facility Upgrade |
|  | (Probability) Operation: Rapture Swarm Raid III (Special) | 32% | 10% | Special Materials ×34–42; Upgrade Materials ×59–67; Construction Materials ×94–102 | 8.3 min | 14. Dispatch Facility Upgrade |
|  | (Probability) Underground Resource Search Mission (Special); [Once] | 100% | 0% | Special Materials ×22–30; Upgrade Materials ×38–46 | 8.3 min | Building Underground Resource Collection Station |
|  | (Probability) Resource Exploration Outside Eden II (Upgrade) | 65% | 12% | Upgrade Materials ×52–60; Construction Materials ×83–91 | 8.3 min | 14. Dispatch Facility Upgrade |

(2 more rows of 10 not shown; see the data table.)

#### Tier 5

|  | Dispatch | Success | Super success | Rewards | Squad rest | Appears after |
|---|---|---|---|---|---|---|
|  | (Guaranteed) Operation: Rapture Night Raid III (Special) | 100% | 10% | Special Materials ×26–34; Construction Materials ×71–79 | 8.3 min | 17. The Road to Rebuilding Eden IV |
|  | (Probability) Construction Material Collection Mission III (Special) | 75% | 25% | Special Materials ×34–42; Upgrade Materials ×58–66; Construction Materials ×84–92 | 10 min | 17. The Road to Rebuilding Eden IV |
|  | (Probability) Resource Exploration Outside Eden III (Special) | 75% | 25% | Special Materials ×34–42; Upgrade Materials ×55–63 | 10 min | 17. The Road to Rebuilding Eden IV |
|  | (Probability - Special/High Risk) Giant Rapture Extermination III (Special); [Rare] | 31% | 75% | Special Materials ×42–50; Upgrade Materials ×69–77; Construction Materials ×105–113 | 10 min | 17. The Road to Rebuilding Eden IV |
|  | (Probability) Eden Ruins Recovery III (Special) | 71% | 22% | Special Materials ×35–43; Construction Materials ×84–92 | 10 min | 17. The Road to Rebuilding Eden IV |
|  | (Probability - Special) Investigation of Suspicious Objects Outside Eden III (Special); [Rare] | 65% | 80% | Special Materials ×37–45; Upgrade Materials ×58–66 | 10 min | 17. The Road to Rebuilding Eden IV |
|  | (Guaranteed - Special) Recovery of Resources Found by Drones (Special); [Rare] | 100% | 60% | Special Materials ×26–34; Upgrade Materials ×42–50; Construction Materials ×71–79 | 10 min | 17. The Road to Rebuilding Eden IV |
|  | (Probability - High Risk) Giant Rapture Extermination IV (Special) | 24% | 21% | Special Materials ×42–50; Upgrade Materials ×65–73; Construction Materials ×100–108 | 10 min | 17. The Road to Rebuilding Eden IV |

(2 more rows of 10 not shown; see the data table.)

## Missions

### Main Missions

Do every task of a Main Mission to clear it and unlock the next. The last one needs a main story stage cleared.

| # | Mission | Tasks | Rewards | Unlocks | Story |
|---|---|---|---|---|---|
| 1 | Construction Basics | Production - Construct a Daily Supply Station; Power - Construct a Power Plant | Construction Materials ×50 | Resource Collection Station | story "A Paradise for the Worthy" (`d_contents_eden_01`) |
| 2 | Resource Collection Basics | Construct 2 Resource Collection Stations; Collect a total of 10 Construction Materials | Construction Materials ×50; Upgrade Materials ×20 | Elevator |  |
| 3 | Utilizing Other Floors | Special - Construct an Elevator | T1 Ground-Type Squad ×1; T1 Aerial-Type Squad ×1; Construction Materials ×50; Upgrade Materials ×20 | Dorm 1 |  |
| 4 | Dispatching Basics | Squad - Construct Dorm 1; Form Squad 1; Dispatch once | Construction Materials ×50 | Armory; Equipment Production Facility | story "The Sorceress Who Walks with Death" (`d_contents_eden_02`) |
| 5 | Basics of Equipment Production | Squad - Construct an Armory; Production - Construct an Equipment Production Facility; Equipment Production - Make 3 Baseball Bat αs | Construction Materials ×155 | — | story "A Love-Starved Bird" (`d_contents_eden_03`) |
| 6 | Preparing Dispatch Squads | Equip Squad 1 with the equipment you've produced; Dispatch once | Construction Materials ×200 | Employment Management Office; Power Plant MK.II; Resource Collection Station MK.II |  |
| 7 | Eden Facility Management & Squad Upgrade | Power - Construct a Power Plant MK II; Production - Construct a Resource Collection Station MK II; Squad - Construct an Employment Management Office | Construction Materials ×255 | Tier 2 units for hire; Tier 2 dispatches; Equipment: Crowbar α; Equipment: Crowbar β | story "Intertwined" (`d_contents_eden_04`) |
| 8 | Hiring & Assignment | Collect a total of 1,120 Construction Materials; Collect a total of 55 Upgrade Materials; Dispatch 3 times | Construction Materials ×350; Upgrade Materials ×20; Special Materials ×10 | Weather Forecast Station; Unit: Cecil; Unit: Johan; Unit: Mecha Harran; Unit: Mecha Isabel; Unit: Mecha Johan; Unit: Mecha Nayuta; Unit: Mecha Noah; Unit: Mecha Papillon; Unit: Mecha Rapunzel; Unit: Mecha Scarlet; Unit: Mecha Snow White; Tier 1 units for hire | story "A Cowardly Shield" (`d_contents_eden_05`) |

(15 more rows of 23 not shown; see the data table.)

### Side Missions

Running goals that pay materials.

| Mission | Reward |
|---|---|
| Construct any facility once | Construction Materials ×90 |
| Construct any facility 3 times | Construction Materials ×180 |
| Construct any facility 5 times | Construction Materials ×270 |
| Construct any facility 10 times | Construction Materials ×360 |
| Construct any facility 20 times | Construction Materials ×675 |
| Construct any facility 30 times | Construction Materials ×945 |
| Collect a total of 500 Construction Materials | Construction Materials ×225 |
| Collect a total of 1,000 Construction Materials | Construction Materials ×450 |

(42 more rows of 50 not shown; see the data table.)

### Challenges

Event challenges with rewards for your account.

| Mission | Type | Reward |
|---|---|---|
| Daily Mission - Enter the mini game | [Daily] | Central Government Supply Chest I ×1 |
| Challenge - Construct a Daily Supply Station | One-time | Advanced Recruit Voucher ×1 |
| Challenge - Construct an Armory | One-time | Advanced Recruit Voucher ×1 |
| Challenge - Construct an Energy Conversion Station | One-time | Advanced Recruit Voucher ×1 |
| Challenge - Construct a Dispatch Support Station | One-time | Advanced Recruit Voucher ×2 |
| Challenge - Construct a Command Center | One-time | Advanced Recruit Voucher ×2 |
| Challenge - Construct a Weather Forecast Station | One-time | Advanced Recruit Voucher ×2 |
| Challenge - Construct an Automatic Turret (Right Port) | One-time | Attacker Common Console ×30 |

(23 more rows of 31 not shown; see the data table.)

### Challenges (rerun)

Event challenges with rewards for your account.

| Mission | Type | Reward |
|---|---|---|
| Challenge - Construct a Daily Supply Station | One-time | Gem ×20 |
| Challenge - Construct an Armory | One-time | Gem ×20 |
| Challenge - Construct an Energy Conversion Station | One-time | Gem ×20 |
| Challenge - Construct a Dispatch Support Station | One-time | Gem ×20 |
| Challenge - Construct a Command Center | One-time | Gem ×20 |
| Challenge - Construct a Weather Forecast Station | One-time | Gem ×20 |
| Challenge - Construct an Automatic Turret (Right Port) | One-time | Gem ×20 |
| Challenge - Hire Cecil to join Eden | One-time | Gem ×20 |

(11 more rows of 19 not shown; see the data table.)

## Story

| Scene | Unlocks when |
|---|---|
| story "A Paradise for the Worthy" (`d_contents_eden_01`) | Clear 1. Construction Basics |
| story "The Sorceress Who Walks with Death" (`d_contents_eden_02`) | Clear 4. Dispatching Basics |
| story "A Love-Starved Bird" (`d_contents_eden_03`) | Clear 5. Basics of Equipment Production |
| story "Intertwined" (`d_contents_eden_04`) | Clear 7. Eden Facility Management & Squad Upgrade |
| story "A Cowardly Shield" (`d_contents_eden_05`) | Clear 8. Hiring & Assignment |
| story "Inheritors of the Great Cause" (`d_contents_eden_06`) | Clear 9. The Road to Rebuilding Eden I |
| story "The Angel Outside the Circle" (`d_contents_eden_07`) | Clear 10. Collecting Different Types of Resources |
| story "Bearing Fruit" (`d_contents_eden_08`) | Clear 12. The Road to Rebuilding Eden II |

(4 more rows of 12 not shown; see the data table.)

## Data sources

All in `D:\Nikke Datamine\mpkparser\jsons` as `<Table>.json`.

| Table | Rows | Fields |
|---|---|---|
| `EventRebuildEdenManagerTable` | 2 | `id`, `event_id`, `desc`, `event_group`, `minigame_type`, `enter_scenario`, `map_resource_name`, `demolition_refund_value`, `production_createtime_penalty`, `elevator_excluded_fromfloor`, `dispatch_counts`, `dispatch_bonus_count`, `dispatch_dailybonus_correction`, `dispatch_departedscreen_time`, `platoon_default_per_membercount`, `hire_counts`, `fire_refund_value`, `highest_floor`, `daily_timer`, `npc_fadetime`, `npc_fadewaittime`, `hirelist_reroll_itemid`, `hirelist_reroll_value`, `npc_monitor_resource`, `eden_firstfloor_yposition`, `helptip`, `helptip_hub_prefab_id`, `helptip_synergy_id` |
| `EventRebuildEdenMissionTable` | 50 | `id`, `type`, `event_group`, `mission_type`, `condition_value`, `target_count`, `name_locale`, `reward_id` |
| `EventRebuildEdenBuildEnhanceTable` | 5 | `id`, `buildlevel`, `perkpoints`, `requirementmaterialsettingdata` |
| `EventRebuildEdenBuildPerkTable` | 35 | `id`, `groupid`, `step`, `order`, `effect_type`, `effect_value` |
| `EventRebuildEdenBuildSetupTable` | 29 | `id`, `resource_id`, `img_resource_id`, `pre_img_resource_id`, `build_category`, `locale_name`, `locale_desc`, `build_construct_time`, `can_destruct`, `unit_placement`, `unlock_condition`, `unlock_value`, `unlock_hint_locale`, `build_limit_count`, `cost_material_setting`, `max_level`, `build_perks`, `requirement_electric`, `build_specific_type`, `build_specific_value`, `synergy_effect_id` |
| `EventRebuildEdenDailyProductionTable` | 22 | `id`, `set_day`, `requirement_setting` |
| `EventRebuildEdenDialogTable` | 63 | `id`, `group_id`, `order`, `nameplate_position`, `scenariodialog_groupid`, `resource_id`, `name_locale`, `text_locale`, `play_condition`, `play_condition_value`, `minigame_helptip_id` |
| `EventRebuildEdenDispatchTable` | 50 | `id`, `desc`, `tier`, `icon_resource`, `name_locale`, `category`, `is_once`, `is_rare`, `after_waittime`, `list_condition`, `condition_value`, `list_ratioweight`, `ratio_normalsuccess`, `ratio_specialsuccess`, `rewardspecialweight`, `rewardfailweight`, `reward_id` |
| `EventRebuildEdenEffectTable` | 20 | `id`, `effecttype`, `applytype`, `icon_resource`, `name_locale`, `desc_locale` |
| `EventRebuildEdenEnvEventTable` | 12 | `id`, `group_id`, `group_prob`, `prob`, `icon_resource`, `effectsettings`, `screenfx_resource_id`, `bgm_resource` |
| `EventRebuildEdenGridSettingsTable` | 98 | `id`, `desc`, `position_x`, `position_y`, `unlock_condition`, `is_special`, `build_id`, `grid_resource_id`, `grid_length`, `grid_height` |
| `EventRebuildEdenItemTable` | 13 | `id`, `tier`, `category`, `resource_id`, `locale_name`, `locale_desc`, `max_amount`, `unlock_condition`, `unlock_value`, `unlock_hint`, `creatable_groupid`, `effect_type`, `effect_value`, `requirement_setting`, `create_time`, `create_amount` |
| `EventRebuildEdenQuestTable` | 260 | `id`, `groupid`, `type`, `event_group`, `mission_type`, `condition_value`, `target_count`, `mission_unlock_time`, `mission_unlock_clearstage`, `name_locale`, `reward_id`, `unlock_build` |
| `EventRebuildEdenRewardTable` | 289 | `id`, `rewardtype`, `item_id`, `min`, `max` |
| `EventRebuildEdenSynergyEffectTable` | 10 | `id`, `desc`, `synergy_icon`, `synergy_condition`, `synergy_check_build`, `effect_type`, `effect_value`, `synergy_name_locale`, `synergy_desc_locale`, `synergy_desc_activated` |
| `EventRebuildEdenUnitTable` | 132 | `id`, `resource_id`, `icon_id`, `name_locale`, `tier`, `group_id`, `can_fire`, `mvspd`, `max_stamina`, `list_condition`, `list_condition_value`, `list_override_prob`, `list_prob`, `list_highpriority`, `hire_require_items`, `effect_settings` |

In-game help text: `MinigameHubTable` / `MinigameHelpTipDescTable` (locale keys resolved).

## Uncertain / unknown

The viewer flagged nothing as uncertain. Fields it does not show are listed in Data sources; their meaning is not interpreted.
