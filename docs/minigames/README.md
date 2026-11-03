# Minigames guides

One guide per minigame in the Nikke Library's Minigames section. Each file stands on its own: hand it to Claude and ask how that minigame works. Facts come from the game data in `D:\Nikke Datamine\mpkparser\jsons` and the library's code; each guide ends with the tables it uses and what is uncertain.

The event-minigame guides were generated from the site's viewers (`lib/eventgames/<id>.js`): they repeat the viewer pages as text, so long lists are shortened. Memory of Goddess (NKS) and Tower Defense (Last Kingdom) are cut at ~80 KB.

## Standalone minigames

| Game | What it is |
|---|---|
| [Tracing the Stars](tts.md) | Rhythm game: 82 songs in 7 albums, four difficulties, grades and rating, missions, skins. |
| [VOLT TRIP](dicetrack.md) | Dice board: roll around a looping 30-square board for square, chest and lap rewards. |
| [Fading Affection](textadv.md) | Text adventure: routes, HP / Food / Corruption, endings and Saved Memories. |

## Event minigames

Their tables are named `Event<Game>*`; the `GAMES` list in `lib/eventgames.js` maps each game to its table prefixes and art folder.

| Game | What it is |
|---|---|
| [BBQ Master](bbqmaster.md) | Grill skewers to order before each customer runs out of patience. |
| [White Memory (Text Adventure)](whitememory.md) | A branching text adventure: as Snow White, pick an area to search, make choices page by page and collect all 21 endings. |
| [Hero Road (Dice)](heroroad.md) | A dice board: spend tokens to roll, move around a looping board and land on cells that give items or fill a gauge. |
| [Pirate Cafe](piratecafe.md) | Run the pirate cafe for 90 seconds: send maids to carry the right dishes to each table before customers give up, clear the tables, and fill the Fever gauge for a rush of auto-served orders. |
| [Hacking Game (CE002)](ce002.md) | Find each hacking target on the event field, then win a short top-down shooter stage by destroying the target once its guards are gone. |
| [Memory of Goddess (NKS)](redash.md) | MEMORY OF GODDESS: a survivor-style shooter. |
| [Snowfall Oasis (Dating Sim)](neverland.md) | A 21-day dating sim at Snowfield Hot Spring: visit locations to meet Nikkes, pick choices to build Bond, and unlock Connection events up to each Nikke's ending and hidden ending. |
| [Dessert Rush](dessertrush.md) | Sort plates on a conveyor rail: serve the desserts, discard the bomb plates and hit both buttons for double plates. |
| [Serving Game (CE003)](ce003.md) | Run the Re:Zero maid cafe for 90 seconds: cook what customers order, have Emilia, Rem or Ram carry it to the right table before they give up, and clean up after them while watching the maids’ HP. Event customers start a ketchup timing game. |
| [Tower Defense (Last Kingdom)](lastkingdom.md) | A tower defense game: build and upgrade towers along the Raptures’ path, deploy Nikkes and aim their Burst Skills, and stop every wave before your Defense Points run out. |
| [Let's Play Soda](playsoda.md) | An arcade of five quick sub-games with Soda: run, smash, catch coins, stack gold bars and climb. |
| [Defense Game (CE004)](ce004.md) | Read the Rapture’s hints and answer each with the right attack or defence button; correct answers deal damage, block attacks and charge a Burst Skill. |
| [In The Mirror](oldtales.md) | In The Mirror: explore a side-scrolling mirror world as Cinderella, defeat Raptures for Gold and Cores, unlock new Glass Slippers abilities through main missions, and replay it on NEW GAME+. Also includes the April Fools Mecha Shifty stage built on the same engine. |
| [Dragon Dungeon Run](icedragon.md) | Guide a hero up a dungeon seven tiles wide, dodging traps, rivers, Raptures and the White Ice Dragon’s breath. |
| [Bubble March](bubblemarch.md) | A lane battle: summon bubble minions and fairy-tale heroes with Summon Bubbles, march them at the Raptures and destroy the Rapture tower or boss of each wave while keeping your own tower standing. |
| [Naytiba Raid (CE006)](ce006.md) | Naytiba Raid: fight five Naytiba bosses one-on-one as EVE, using parries, dodges and skills, and upgrade her between fights. |
| [Boom the Ghost](boomtheghost.md) | A drop-and-merge puzzle: shoot ghosts into the Dust Box, and when two ghosts of the same level touch they merge into a bigger one for points. |
| [Rope Running](coinsinrush.md) | An endless runner: Ade dashes forward on her own while you jump obstacles and pits and swing from chandeliers on a rope. |
| [Rebuild Eden](goddessfall.md) | A city builder: rebuild Eden floor by floor. |
| [AZX Service Time](terminusticket.md) | Drag over numbered blocks that add up to exactly 10 to clear them. |
| [Salvation Breakers (CE007)](ce007.md) | Merge weapons in a grid inventory and hold the barricade against 99 waves of monsters. |
| [Merch Bag](staranis.md) | Scratch lottery tickets to collect T.T. STAR merch, then decorate a merch bag with it. |
| [Fight! Ark Ranger](arkranger.md) | Pilot an Ark Machine: merge weapons and robot supporters in a grid inventory and hold the barricade against 100 waves. |
| [Lyco Reco Beats (CE008)](ce008.md) | A one-button rhythm game: tap on the beat to dodge, shoot and decorate desserts. |
| [Island Breaker](wavetoyou.md) | A block breaker: launch your balls to break the debris rows that drop one row per wave, buy more balls with the Seashells you break loose, and survive as many waves as you can. |
| [Mini Game (CE009)](ce009.md) | An endless maze run: swipe through the corridors collecting coins and items, dodge Shadows and outrun the collapsing map while your HP drains. |
| [Three Company Rumble](coinrushshowdown.md) | Turn your bunny girl left and right to punch away the rival bunny girls closing in from both sides, grab coins and survive as long as you can. |
| [EVANGELION: RedSea Scout](eva.md) | A bullet-hell shooter: steer an Evangelion through enemy barrages, shoot down Raptures and giant “Mimicry” bosses, and raise A.T. Field with the damage you deal. |
| [5x5 Supplies](gachaboard.md) | Flip tiles on a 5×5 supply board with tickets. |
| [Gift Factory](sortout.md) | Sort boxes on a conveyor belt: gifts go to the Box District, Rapture boxes to the Rapture District. |
| [Costume Gacha](boxgacha.md) | A costume box gacha: each banner holds 10 prizes, every draw removes one, and 10 draws win them all. |
