# White Memory (Text Adventure)

A branching text adventure: as Snow White, pick an area to search, make choices page by page and collect all 21 endings. Items found on one run open new choices on later runs.

This guide was generated from the Nikke Library's reading of the game data: the viewer `lib/eventgames/whitememory.js` turns the `Event*` tables in `D:\Nikke Datamine\mpkparser\jsons` into the rules below. Numbers, units and formulas are the viewer's readings; anything it was not sure of is listed under "Uncertain / unknown". Long lists are cut to 30 rows.

- Intro story: "White Memory" (`d_contents_whitememory_01`)
- Art folder: `icons-event/01_whitememory`

## Overview

### How it plays

- **Intro story**: story "White Memory" (`d_contents_whitememory_01`)
- **A run**: Choose one of the areas, then read and pick choices until you reach an ending. Some pages give an item; some choices need an item or an ending you have already seen.
- **New endings**: 1 attempt per day (max 1): reaching an ending you haven't recorded yet uses it
- **Rewards**: 1 reward attempt per day (max 1); reaching any ending with an attempt left gives: Gem ×30, Date with the CO ×1
- **Stand Guard**: Skip the search and go straight to NORMAL ENDING 1 (“End of Expedition”) to collect the day’s reward. Opens after 1 new ending(s).
- **Endless mode**: From 2023-05-16 20:00: endings no longer use attempts (rewards still once a day)
- **Rerun**: In the archive rerun every area after the first opens by reaching an ending instead of on a date (see the areas table).

### Areas

|  | Area | Opens | Opens (rerun) | Endings |
|---|---|---|---|---|
|  | Forest | From the start | From the start | 6 |
|  | River Bank | 2023-04-30 20:00 | After ending 14 (Retro Hood) | 5 |
|  | Suburb | 2023-05-04 20:00 | After ending 15 (Fleetly Fading) | 5 |
|  | Meadow | 2023-05-11 20:00 | After ending 13 (Buried Memory) | 4 |

## Areas

### Forest

The prey hides, and the hunter seeks. Under the shade of the trees, memories lie in wait.

- **Opens**: From the start
- **Endings here**: NORMAL ENDING 2: Deer Meat Tastes Good; BAD ENDING 6: Going Hungry Today; BAD ENDING 7: Meaningless Hallucinations; BAD ENDING 8: An Escaped Deer Does Not Return; TRUE ENDING 13: Buried Memory; TRUE ENDING 14: Retro Hood

#### Page 1-01

- Snow White approaches the forest. / Despite the seemingly endless, internecine conflict between man and Raptures, the forest remains a bastion of life. / As Snow White gazes upon the forest... / *Rustle* / "?!!" / ...a deer suddenly leaps into view.
- **Choices**: “Shoot with anti-ship rifle.” → page 1-02; “Shoot with ordinary rifle.” → page 1-03

#### Page 1-02

- Tendrils of flame belch out of the anti-ship rifle's muzzle. However, as the flames die down, the deer is nowhere to be found.  / The shot also attracts Raptures, and Snow White is forced into a confrontation.
- **Next**: → BAD ENDING 6: Going Hungry Today

#### Page 1-03

- Tendrils of flame belch out of the rifle's muzzle, and the deer is blown apart in a burst of arterial spray. / It's only then that Snow White realizes how fragile a deer is.
- **Next**: → page 1-04

#### Page 1-04

- Having newly discovered the fragility of ungulates, Snow White decides to walk around the woods and find alternative hunting tools.
- **Choices**: “Turn right.” → page 1-05; “Proceed straight ahead.” → page 1-06; “Turn left.” → page 1-07

#### Page 1-05

- On the right, the ground is covered with mushrooms that have brilliant red patterns. / Snow White begins to pick the mushrooms.
- **Next**: → page 1-08

#### Page 1-06

- Walking forward, Snow White discovers a wooden cabin. / She heads inside to look for any useful items.
- **Next**: → page 1-23

#### Page 1-07

- On the left, Snow White sees a chain link fence. / She walks towards it, intending to snip it into separate parts that could be used to make traps.
- **Next**: → page 1-24

#### Page 1-08

- She wonders if she should do a taste test before bringing them to her colleagues.
- **Choices**: “Taste them.” → page 1-09; “Don't taste them.” → page 1-10

#### Page 1-09

- Snow White feels somewhat hesitant about sharing food with others that hasn't been tested.  / She puts a mushroom in her mouth.
- **Next**: → page 1-11

#### Page 1-10

- Snow White feels that the mushrooms are bad news, so she puts them down and heads out of the forest.
- **Next**: → page 1-04

#### Page 1-11

- Suddenly, a white fog envelops her. / A female figure can be made out amongst the fog.  / It is someone whose face she has longed to see for some time. / "Snow White." / Someone calls out.
- **Next**: → page 1-12

#### Page 1-12

- "!!!" / Snow White opens her eyes. / The white fog has dissipated. / After making sure she hasn't sustained any injuries, Snow White realizes something. / The mushroom she ate made her hallucinate.
- **Next**: → page 1-13

#### Page 1-13

- Snow White contemplates if she should eat the mushroom again. / Although she can't explain why exactly, she wants to see that woman in her hallucination again. / After hesitating for a while, Snow White decides to...
- **Choices**: “Eat the mushroom.” → page 1-14; “Not eat the mushroom.” → page 1-15

#### Page 1-14

- After ingesting some more of the mushrooms, Snow White sees two flowers amidst the fog. / One is white, and the other is red. / Which one should she follow?
- **Choices**: “The white flower” → page 1-16; “The red flower” → page 1-17 (Needs ending 7 (Meaningless Hallucinations) seen before)

#### Page 1-15

- No matter how badly she wants to see that woman, falling into a hallucination is a risky proposition. She puts the mushrooms down and heads out of the forest.
- **Next**: → page 1-04

#### Page 1-16

- Snow White heads toward the white flower and sees a white figure. / The faceless figure asks,  / "Can you see me?"
- **Choices**: “No.” → page 1-18; “Yes.” → page 1-19 (Needs ending 5 (To Bid You Farewell) seen before)

#### Page 1-17

- Snow White heads toward the red flower and hears the buzz of a radio. / An old song is being played. Someone can be heard humming along to the song. They sound homesick.
- **Next**: → page 1-22

#### Page 1-18

- *Thud* *Crash* / Snow White stumbles over a tree stump and tumbles to the ground. / "!!!" / After waking up from her hallucination, Snow White still wants to see that face that may or may not be a figment of her imagination, so she eats some mushrooms again.
- **Next**: → BAD ENDING 7: Meaningless Hallucinations

#### Page 1-19

- The white figure smiles. / "If you want to see me, you should come to meet me." / "Snow White."
- **Next**: → page 1-20

#### Page 1-20

- *Thud* / "!!!" / Snow White opens her eyes. / A towering tree stands before her. / Something about this all seems oddly familiar. Snow White looks at her feet. / As she does, a long-forgotten memory comes rushing back.
- **Next**: → page 1-21

#### Page 1-21

- On a day when the fighting had no end in sight, / she came over with a memory capsule and a sheet of paper. / "Everyone, write down your wishes on these and place them in this memory capsule." / They tore the sheet of paper into seven pieces, wrote down their wishes, and placed them in the capsule. / She buried the memory capsule in the ground and spoke. / "One day... When our job is finished, let's open it together." / Under that enormous tree, she made a promise that would never come true.
- **Next**: → TRUE ENDING 13: Buried Memory

#### Page 1-22

- Suddenly, a long-forgotten memory comes rushing back to her. / She used to listen to songs with Red Hood, who loved old songs. / "Hello, little one." / Snow White was in a terrible mood that day. / So many of those close to her had lost their lives. / Snow White could never forget their eyes as they died; filled with fear and a hint of relief. / As the music continues to play, Snow White walks up to Red Hood. / "Why do you look so solemn, little one?" / "You're going to give yourself wrinkles if you keep scrunching up your face like that." / Red Hood says with a grin. / "Stop doing that. Take a look at this." / Red Hood brings the radio closer. / It is playing a song about missing one's hometown. / It's an old guitar-centric pop song, which didn't suit the battlefield at all. / "This song is nice, right? This is what music is all about." / Red Hood attempts to coax Snow White, / "Want to try singing it?" / Did Snow White sing with her back then? / She can't remember. / "That's more like it, you dork!" / "... You act like an old geezer." / "Haha! Really?" / Red Hood's laughter and the music are the only sounds that linger in Snow White's ears.
- **Next**: → TRUE ENDING 14: Retro Hood

#### Page 1-23

- The cabin is entirely bereft of food and supplies.  / However, Snow White can ascertain from the antlers hanging on the wall and the bear skin on the floor that a hunter resided here. / Scrawled directly on the table in red are the words "Don't be the prey." / Snow White turns and heads back into the forest.
- **Next**: → page 1-04

#### Page 1-24

- She approaches a metal fence and sees a corpse draped over the top of it. The body is clothed in a camouflage outfit and carrying a bow and backpack. / "..." / Snow White cuts down the metal fence and sets the corpse on the floor.
- **Item found**: Metal Wire
- **Next**: → page 1-25

#### Page 1-25

- The duffel bag contains electrical wires, a phone, / dry rations, a pail, and a map. / Snow White looks at the bow & arrow. These weapons, along with the camouflage, might prove useful for hunting. She contemplates whether she should take them.
- **Choices**: “Put down the bag and leave.” → page 1-26; “Take everything.” → page 1-27

#### Page 1-26

- Snow White doesn't want her survival to come at the expense of someone else's life, so she decides to put down all the hunting props and leave.
- **Next**: → page 1-28

#### Page 1-27

- Snow White apologizes and takes the dry food, bow & arrow, and camouflage outfit. / She must survive for the sake of her colleagues. If that means benefiting from someone else's death, then so be it.
- **Item found**: Hunting Props
- **Next**: → page 1-28

#### Page 1-28

- Snow White prepares to hunt. She starts to set up a trap using the metal wire she got from the fence. / Being proficient with crafting, she succeeds in making a trap and resumes her hunting once again.
- **Item found**: Trap
- **Next**: → page 1-29

#### Page 1-29

- Snow White returns to the spot where she saw the deer and sets the trap. / The bleats of a deer can be heard in the distance. She decides to hide behind a tree and watch. / To conceal herself, Snow White...
- **Choices**: “Covers herself with leaves.” → page 1-30; “Wear the camouflage outfit.” → page 1-31 (Needs the item Hunting Props)

#### Page 1-30

- The unwieldy camouflage does not fool the deer. / Just as it is about to approach the trap, it widens its eyes and flees the scene. / Snow White watches in desperation as the escaping deer slowly disappears into the distance.
- **Next**: → BAD ENDING 8: An Escaped Deer Does Not Return

#### Page 1-31

- The deer is fooled by Snow White's camouflage and comes closer. / The moment its foot is clamped by the trap, Snow White shoots it with an arrow.
- **Next**: → NORMAL ENDING 2: Deer Meat Tastes Good

#### NORMAL ENDING 2: Deer Meat Tastes Good

- Snow White captures the deer. / Looking forward to the delicious dinner she'll be having that night, she returns to the post in good spirits.

#### BAD ENDING 6: Going Hungry Today

- The sounds of the battle only attract more Raptures. / It takes everything for Snow White to subdue the threat. In the end, she goes back to the post empty-handed.
- **Hint**: Loud noises will alert Raptures.

#### BAD ENDING 7: Meaningless Hallucinations

- No matter how many mushrooms Snow White ingests, the face she longs to see remains forever indistinct. / Snow White spends the entire day lost in meaningless reveries.
- **Hint**: If you're not yet ready, try following the other flower.

#### BAD ENDING 8: An Escaped Deer Does Not Return

- No matter how long Snow White waits in hiding, the deer doesn't return. / The trap she made only manages to catch a few small woodland critters.  / With the small animals in tow, Snow White trudges back toward the post.
- **Hint**: One needs to be well-prepared to catch a deer.

#### TRUE ENDING 13: Buried Memory

- Snow White takes out the time capsule buried in the ground. / There are seven pieces of paper inside. / "..." / "I wish for the war to end and for everyone to make it out safely." / "The day my role doth end, with the red flower shall I go." / "I wish that the day would come when everyone knows our names." / "I want to have food and booze from my hometown!" / "We will win." / "I hope Lilith will be safe." / After reading six pieces of paper, Snow White opens the last one, which has been neatly folded. / It's hers. / "I hope we can save humanity." / "..." / Snow White ponders over the last words she ever wrote. / "I hope we can save humanity..." / Snow White places the pieces of paper back into the capsule and stands up. / To commemorate her, Snow White decides to go to the meadow where she is buried.
- **Item found**: Memory Capsule

#### TRUE ENDING 14: Retro Hood

- *Thud* *Crash* / Snow White trips over a tree stump. / "!!!" / She wakes up from her hallucination and sees a tent, a broken radio, and a cassette tape near the tree stump that she tripped over. / "..." / Snow White keeps the cassette tape and begins humming the song she heard in her hallucination. / "Oh, the hometown I long for." / "The friends I miss." / "Even if the sky above us is forever grey," / "We'll return to our hometown someday."
- **Item found**: Cassette Tape

### River Bank

There are many things that can be caught between the water and the rocks.

- **Opens**: 2023-04-30 20:00
- **Endings here**: NORMAL ENDING 3: Hail to the King... of Fishing!; BAD ENDING 9: The Fish Have Fallen Asleep; BAD ENDING 10: River Butcher; TRUE ENDING 15: Fleetly Fading; TRUE ENDING 16: Life Under the Parasol

#### Page 2-01

- Scarlet appears before Snow White, who's on her way to explore the river bank. / "Dost thou intend on rusticating by the riverside? Prithee, allow me to accompany you." / Snow White nods. / Scarlet is excited about getting to see some fish, which she hasn't seen in a while. / "Do you know how to fish?"
- **Choices**: “Answer yes.” → page 2-02; “Answer no.” → page 2-03

#### Page 2-02

- Snow White answers yes, so Scarlet tells her to try making a fishing rod.
- **Next**: → page 2-04

#### Page 2-03

- Snow White answers no, so Scarlet says she'll personally make a fishing rod for Snow White.
- **Next**: → page 2-17

#### Page 2-04

- "Given thou doth intend on fabricating a fishing rod, I shall search for a suitable piece of wood." / Scarlet begins looking for wood nearby and asks Snow White how long the tree branch should be cut.
- **Choices**: “Tell her to cut it shorter.” → page 2-05; “Tell her to cut it longer.” → page 2-06

#### Page 2-05

- Snow White notices the branch is shorter than she expected. / Scarlet asks if it is what Snow White actually wanted. / Snow White ponders if she should use the branch for something else.
- **Next**: → page 2-09

#### Page 2-06

- Scarlet brings over a branch with the perfect length. Snow White is very satisfied. / To make the fishing rod, she...
- **Choices**: “Rummages through her pockets.” → page 2-07; “Takes out the metal wire she has with her.” → page 2-08 (Needs the item Metal Wire)

#### Page 2-07

- Snow White doesn't find anything she could use to make a fishing rod. / She gives it some further thought, and decides she can use the branch to make something else.
- **Next**: → page 2-09

#### Page 2-08

- Snow White is good with her hands, and she manages to make a fishing rod using the metal wire and the tree branch.
- **Item found**: Fishing Rod
- **Next**: → page 2-11

#### Page 2-09

- Snow White passes the branch to Scarlet and tells her to sharpen one end. / "Dost thou intend on fashioning a fishing spear?" / After a while, they end up with a decent fishing spear.
- **Next**: → page 2-10

#### Page 2-10

- *Swish* *Splash* / The fishing spear embeds itself in the bottom of the river. / "..." / "Alas, another miss." / Snow White and Scarlet continue throwing their self-made spear with all their might, / but every throw ends up with it either stuck in the riverbed from excess force or moving erratically due to poor aim. / "..." / "Perhaps we should entertain the notion of returning to a fishing rod?" / As Snow White listens to Scarlet, she stares at the fish in the river. It swims away slowly, as if mocking them.
- **Next**: → NORMAL ENDING 3: Hail to the King... of Fishing!

#### Page 2-11

- The two head to the river to begin fishing. / Snow White...
- **Choices**: “Uses the fishing rod.” → page 2-12; “Passes the fishing rod to Scarlet.” → page 2-13

#### Page 2-12

- Snow White stands by the river with the fishing rod she has made. / She closes her eyes and tries to sense the movements of the fish.
- **Next**: → BAD ENDING 9: The Fish Have Fallen Asleep

#### Page 2-13

- Scarlet is surprised that Snow White handed the rod to her. / As she lowers the rod into the water, she proclaims that Snow White won't regret entrusting her with it.
- **Next**: → page 2-14

#### Page 2-14

- Scarlet says that no fish will come if she doesn't move the rod, and claims they can only catch a big fish if they shake the rod. / She begins swinging the rod as she speaks. / Almost immediately, they catch something...!
- **Next**: → page 2-15

#### Page 2-15

- "A pocket knife...?" / Scarlet has caught... a pocket knife. / She hasn't seen something like this in a long time and stares at it, forlorn. / Snow White recalls a memory with Scarlet from long ago.
- **Next**: → page 2-16

#### Page 2-16

- That day, they were starving. / Though they had succeeded in their mission, additional supplies were taking a long time to arrive as they were in a secluded place difficult for humans to reach. / "I'm so hungry, I could eat a horse." / To a food lover like Snow White, enduring hunger is the worst form of torture imaginable. / Suddenly, Scarlet tosses a pocket knife at the birds flying by. / "!!!" / Scarlet takes the fallen bird and passes it to Snow White. / "Prithee thou not be lost in melancholy. Grill this." / "!!!" / The bird was tiny, but Snow White isn't concerned about whether it would be filling or not. / Rather, she is shocked that Scarlet is willing to kill something merely because she is hungry. / Snow White mutters, "This is so cruel." which causes Scarlet to laugh. / "So killing a tiny bird is cruel, but killing a bigger bird is perfectly okay?" / "It's not like that..." / "Do not allow thyself to be vexed thusly about death. All lives have to end." / Scarlet's nonchalance prompts Snow White to ask another question.  / "How about us? / Will we die as well?" / Scarlet chuckles. / "Flowers are fleetly fading / All things eventually come to an end." / Scarlet stared at her katana. / "This is the lesson she gave me when she became my blade."
- **Next**: → TRUE ENDING 15: Fleetly Fading

#### Page 2-17

- "We shall require wood if we are to fashion a fishing rod." / "I'll look for some." / Snow White looks around and fires her rifle at a tree that looks to be the right size.
- **Next**: → page 2-18

#### Page 2-18

- "?!!" / The tree sways a few times before collapsing on a pile of nearby rocks. / "... I only required but a few tree branches." / "Oh... whoops." / The sight of Snow White obliterating the tree makes Scarlet feel slightly uneasy, but she feels somewhat reassured upon seeing how embarrassed Snow White seems for her slip-up. Scarlet runs over to fetch some branches from the fallen tree.
- **Next**: → page 2-19

#### Page 2-19

- However, Scarlet is unable to make a fishing rod due to her poor crafting skills. / Feeling embarrassed, Scarlet...
- **Choices**: “Says she'll try to fish with her sword.” → page 2-20; “Says she'll search the pile of rocks.” → page 2-21

#### Page 2-20

- Scarlet stands by the river with her sword and lightly swings it at the fish lethargically swimming by. / *Swoosh* / "Whoops." / "!!!" / The fish is cut in two and floats to the surface of the water. / "I doth believe there is validity to this idea yet. I shall swing it properly this time." / Scarlet adjusts her stance as she stands at the riverbank. Snow White is filled with a renewed sense of hope that they'll actually catch a bevy of fish, and her eyes sparkle.
- **Next**: → BAD ENDING 10: River Butcher

#### Page 2-21

- "Perchance there are canned goods buried under these rocks. Hath thou considered this?" / Snow White nods and begins rummaging through the rock pile. / After they move away some rocks, some supplies hidden under the pile are gradually revealed. / Scarlet and Snow White exchange glances. Their hunch was right. Filled with a renewed sense of vigor, they begin lifting up more rocks. / Just then, Snow White feels something.
- **Next**: → page 2-22

#### Page 2-22

- It's a parasol. / While looking at it, a memory of Dorothy resurfaces.
- **Next**: → page 2-23

#### Page 2-23

- Back when humans lived on the surface and not in the Ark,  / Dorothy loved using the parasol that had been given to them as a gift. Supplies were plentiful then. / Nikkes don't get tanned even if they're exposed to the sun, so Snow White was curious as to why Dorothy was using the parasol. / "Why do you use that thing, anyway? It's not like we need it." / With a smile, Dorothy answered her. / "If I use this, this place won't feel as much like a battlefield. Instead, it'll feel more like a warm and sunny... Eden." / "Eden?" / "How should I put it... It makes me feel important. When the Ark is built, we'll all be sheltered safely under the same parasol." / Snow White couldn't make head or tail of what Dorothy was saying. / Will the Ark really become our Eden? / When peace is restored, will the humans want us to stay under the same parasol as them? / "Of course." / As Snow White stared at Dorothy, her expression was full of such hope for the future, that she couldn't bring herself to refute her in any way.
- **Next**: → TRUE ENDING 16: Life Under the Parasol

#### NORMAL ENDING 3: Hail to the King... of Fishing!

- She manages to catch a huge fish with her bare hands! / "!!!" / The fish Snow White is holding tries to writhe free from her grip. / "I had no idea thou art capable of such feats!" / "I figured I'd give it a shot, and it worked." / "..." / Despite expending so much energy earlier, the thought of having a good meal later that night gives them both a second wind, and they begin catching fish with their bare hands. / Snow White fills the pail with fish and returns to the post full of delight, discreetly wiping the drool forming on the edges of her mouth.

#### BAD ENDING 9: The Fish Have Fallen Asleep

- A long time passes, but nothing happens. / Snow White, whose eyes are closed, can feel Scarlet nodding off behind her. / The fish also seem to have fallen asleep, as nothing is biting the rod.
- **Hint**: It seems that fishing is more than just making a fishing rod.

#### BAD ENDING 10: River Butcher

- However, as Scarlet swings her sword with full force, / the river is dyed a dreadful red as all the fish are sliced and diced. / "..." / "..." / Both Scarlet and Snow White stare at the massacre silently and return to the post without a word.
- **Hint**: It might be better to do a bit of searching than relying on your colleague's sword.

#### TRUE ENDING 15: Fleetly Fading

- "Flowers are fleetly fading." / Snow White utters, startling Scarlet. / "Thy memory of this still rings true?" / Snow White nods, sending a smile across Scarlet's face. / "Precisely. Nothing lasts forever, and we are no exception." / With that, Scarlet hovers the rod over the river again. / Behind her, Snow White stares at her quietly.
- **Item found**: Pocket Knife

#### TRUE ENDING 16: Life Under the Parasol

- "Oh, a parasol... Dorothy will be most smitten with this."  / Scarlet proclaims as she approaches Snow White. / Snow White nods quietly. / Both of them feel this will be the perfect gift for Dorothy, who's doing her best to be a fine leader. / They bring the parasol back to the post.
- **Item found**: Parasol

### Suburb

An untold number of painful memories remain within these collapsed buildings.

- **Opens**: 2023-05-04 20:00
- **Endings here**: NORMAL ENDING 4: Become A Master In Your Own Kitchen Today!; NORMAL ENDING 5: To Bid You Farewell; BAD ENDING 11: Become A Master In Your Own Kitchen Tomorrow?; TRUE ENDING 17: A Friendship She Misses Despite the Embarrassment; TRUE ENDING 18: The Beautiful Liliweiss

#### Page 3-01

- Rapunzel appears before Snow White, who's on her way to explore the church. / "Come with me today. / I've been to the suburb." / Snow White nods.
- **Next**: → page 3-02

#### Page 3-02

- Snow White and Rapunzel head to the outskirts and gaze at the structures demolished by Raptures. They attempt to find a recognizable structure they can check out.
- **Choices**: “Check out the factory.” → page 3-03; “Check out the apartment buildings.” → page 3-04

#### Page 3-03

- The factory seems to be a former refuge for the humans. Although some parts of the building have collapsed, there are some blankets and canned goods scattered around. / Rapunzel and Snow White venture further into the factory.
- **Next**: → page 3-05

#### Page 3-04

- Snow White and Rapunzel go to the apartment buildings to look for daily necessities, but most of them have been completely obliterated from Rapture attacks. / There are only 3 houses they can still enter. / Snow White...
- **Choices**: “Enters the house on the left.” → page 3-19; “Enters the house in the middle.” → page 3-22; “Enters the house on the right.” → page 3-26

#### Page 3-05

- The inside of the factory is littered with all manner of supplies, / but the cans of food are either emptied or spoiled. Everything else is unsalvageable. / Snow White and Rapunzel want to continue looking for things they can use, so they...
- **Choices**: “Break open a locked door and walk in.” → page 3-06; “Walk into a room where the curtains are closed.” → page 3-07

#### Page 3-06

- When they break the locked door open and walk in, they see canned goods and other supplies all placed in a neat pile, although there aren't many of them. / This must be a room that had been used as storage. Snow White and Rapunzel begin gathering up the canned goods. / In the midst of their scavenging, Snow White discovers a book under the couch.
- **Choices**: “Leave the book alone.” → page 3-08; “Take the book.” → page 3-09

#### Page 3-07

- "What is this?" / There are matches, extinguished candles. pictures of people hanging in the room. / A line is written on the wall. / "May you rest in peace." / "This must be a place where they mourn the dead." / The two look around for a while and...
- **Choices**: “Leave after mourning for a short while.” → page 3-13; “Take out the photo frame they got and begin praying.” → page 3-14 (Needs the item Photo Frame)

#### Page 3-08

- The two are elated, as they didn't expect to find such a major haul. / As Rapunzel looks at the canned goods, she remembers how the atmosphere at the post has been fairly gloomy lately. Dorothy has also been rather morose as well. Rapunzel suggests that they make some dishes and give everyone else a pleasant surprise. / Snow White agrees with the idea. / Rapunzel...
- **Choices**: “Begins cooking based on intuition.” → page 3-10; “Follows a cookbook and begins cooking.” → page 3-11 (Needs the item Cookbook)

#### Page 3-09

- The book under the couch is a dirty magazine. / "Ugh, what is this?" / Rapunzel walks over and stares at the magazine. / "Whoa, I thought this series ended already!" / Her eyes gleam as she speaks. / Snow White suddenly remembers a previously forgotten memory of her, Rapunzel, and Red Hood.
- **Next**: → page 3-12

#### Page 3-10

- Rapunzel steps forward confidently, claiming she has always loved cooking even as a human. / As Snow White watches Rapunzel, she feels a little anxious.
- **Next**: → BAD ENDING 11: Become A Master In Your Own Kitchen Tomorrow?

#### Page 3-11

- Rapunzel says she happens to have a cookbook handy that she'll follow. / She announces she'll use this canned food to make something delicious, and goes out to start a fire. / As Snow White watches Rapunzel, her anxiety slowly builds.
- **Next**: → NORMAL ENDING 4: Become A Master In Your Own Kitchen Today!

#### Page 3-12

- "What are you showing Snow White?!" / Rapunzel covers Snow White's eyes. / Not being particular about her reading material, Red Hood has just passed a dirty magazine to Snow White. / Rapunzel blushes and urges Red Hood to throw away this smut. Undeterred, Red Hood continues to tease Rapunzel with the racy magazine. / While Snow White watches them argue, she realizes the animosity between the Red Hood and Rapunzel has given way to real friendship.
- **Next**: → TRUE ENDING 17: A Friendship She Misses Despite the Embarrassment

#### Page 3-13

- Rapunzel and Snow White light the candles with the matches on the floor and pray for a while. / They then walk out of the room and open the locked door.
- **Next**: → page 3-06

#### Page 3-14

- Rapunzel places the photo frame they got from the apartment building among the pictures on the floor and lights the candles with a match. / Once all the candles in the room are lit, Rapunzel kneels down quietly. / Without a word, Snow White stands back and watches.
- **Choices**: “Stay with Rapunzel.” → page 3-15; “Leave Rapunzel alone and explore another location.” → page 3-16 (Needs ending 12 (The Step She Failed to Take) seen before)

#### Page 3-15

- Snow White asks. / "Why are you doing this?" / "What?" / "They're already dead." / Rapunzel answers. / "Death is not the end." / "The marks these people made during their lives will not disappear simply because they are no longer with us." / "Everything truly ends only when everyone who remembers them is gone." / Rapunzel stands up and looks at Snow White. / "So, I decide to remember." / "I don't want them to be forgotten, for everything to come to an end and rob them of all meaning." / "..." / "So I will keep praying to remember the precious lives they used to lead. I will acknowledge their deaths and bid them farewell."
- **Next**: → NORMAL ENDING 5: To Bid You Farewell

#### Page 3-16

- Snow White leaves Rapunzel behind and begins exploring the factory again. She smells the familiar scent of flowers. / Snow White follows the scent and finds a door toward the back. / Snow White...
- **Choices**: “Open the door.” → page 3-17 (Needs the item Dried White Flower); “Returns to Rapunzel.” → page 3-14

#### Page 3-17

- Snow White takes out the dried white flower she got from the apartments and opens the door. / As the door opens, a sea of white flowers greets Snow White. / She knows the name of these flowers. / They remind Snow White of her. / Memories of her come rushing back. Memories Snow White has been wanting to forget.
- **Next**: → page 3-18

#### Page 3-18

- She was always fond of her. / Being together with her was always a happy experience. / Snow White was never happier than when they had chatted in a prairie full of flowers just like these.  / "This flower has the same name as you." / "Yes. That's where I got my name." / Snow White loved that flower ever since. / "But now, it seems like... this flower is more like you than me." / No. / This flower still resembles her. / "The pure," / The purest, / "strong," / strongest, / "and lovely" / and loveliest / "Snow White." / Liliweiss.
- **Next**: → TRUE ENDING 18: The Beautiful Liliweiss

#### Page 3-19

- Walking into the house on the left, the two find the posters of the Ark and lots of lottery tickets scattered inside. / The lottery tickets have Try Again printed on them. Amongst the pile, there is a cookbook. / On the pages, sentences such as Recipes Anyone Can Learn! Become A Master In Your Own Kitchen Today! can be made out. Rapunzel says it would be nice if they can find food and make some dishes to bring back to the post. / Snow White asks Rapunzel if she needs the cookbook. Rapunzel says...
- **Choices**: “She needs it.” → page 3-20; “She doesn't need it.” → page 3-21

#### Page 3-20

- "There's no harm in having a cookbook." / Rapunzel says. / Snow White agrees with her. / Feeling they won't be able to find anything else in the house, they decide to...
- **Item found**: Cookbook
- **Choices**: “Check out the other houses.” → page 3-04; “Check out the factory.” → page 3-32

#### Page 3-21

- "When it comes to cooking, all you need is intuition." / Rapunzel says. / Snow White decides to believe her. / Feeling they won't be able to find anything else in the house, they decide to...
- **Choices**: “Check out the other houses.” → page 3-04; “Check out the factory.” → page 3-32

#### Page 3-22

- They come to the house in the middle and see a bunch of empty cans piled up neatly in a corner of the empty room. It seems that someone else has been here. / While most of the doors are either open or broken, they find one door that is tightly closed. / They...
- **Choices**: “Leave the door alone.” → page 3-23; “Try opening the door.” → page 3-24

#### Page 3-23

- For now, looking for supplies and food is the top priority. / Upon picking up the familiar smell of death coming from inside, they decide not to open the door.
- **Next**: → page 3-25

#### Page 3-24

- There's a bed in the room. / On the bed lie two bodies, their fingers intertwined. / Snow White and Rapunzel wordlessly look at the photo frame on the bedside table. / A couple smiles happily in the picture. / "Seems like they're a couple." / "..." / After looking at the picture for a while, Rapunzel says she wants to mourn the deceased and decides to take the photo frame with her.
- **Item found**: Photo Frame
- **Next**: → page 3-25

#### Page 3-25

- Feeling they won't be able to find anything else in the house, they decide to...
- **Choices**: “Check out the other houses.” → page 3-04; “Check out the factory.” → page 3-32

#### Page 3-26

- The house on the right is entirely empty. / Rapunzel posits the former residents must have taken refuge somewhere else. / Snow White looks at the empty room and discovers a dried white flower that has fallen on the ground.
- **Next**: → page 3-27

#### Page 3-27

- There's a buzzing in her ear, then a voice rings out. / "This flower is more like you than me."
- **Next**: → page 3-28

#### Page 3-28

- "Snow White?" / Rapunzel's voice brings Snow White back to reality. / Despite Rapunzel's concern, Snow White insists everything is fine and tells her not to worry. Snow White then suggests they continue their search.  / Rapunzel agrees and walks away, while Snow White...
- **Choices**: “Picks up the dried flower on the ground.” → page 3-29; “Leaves the dried flower on the ground.” → page 3-30

#### Page 3-29

- Snow White feels an unprecedented wave of emotions and surreptitiously takes the dried white flower.
- **Item found**: Dried White Flower
- **Next**: → page 3-31

#### Page 3-30

- Feeling that keeping the flower will bring back some unpleasant memories, Snow White decides to avert her gaze.
- **Next**: → page 3-31

#### Page 3-31

- Feeling they won't be able to find anything else in the house, they decide to...
- **Choices**: “Check out the other houses.” → page 3-04; “Check out the factory.” → page 3-32

#### Page 3-32

- Believing there might not be many supplies or food available at the apartments, they instead decide to check out the factory.
- **Next**: → page 3-03

#### NORMAL ENDING 4: Become A Master In Your Own Kitchen Today!

- *Gurgle, gurgle, gurgle.* / An appetizing soup boils in the huge pot. / Its aroma fills the factory, and Snow White begins to drool. / "Can I have a taste?" / "Hehe. Of course!" / Rapunzel confidently ladles some soup into a small can and passes it to Snow White. / Snow White puts a spoonful of soup in her mouth. / "!!!" / She is filled with pure ecstasy. / "How is it? Does it taste okay?" / "It's wonderful." / Rapunzel's mood improves when she sees Snow White's obvious delight. / With the big pot and canned goods in tow, they return to the post triumphant.

#### NORMAL ENDING 5: To Bid You Farewell

- Death is not the end. / The real end happens when one's existence is forgotten. / Snow White falls into deep thought. / She has never thought of it that way. / Rapunzel looks at Snow White, who is lost in thought, and kneels once again to pray. / While Snow White watches Rapunzel pray, she asks... / "Then how do we bid someone farewell?" / "Look them in the eyes say to them..." / "Be well."

#### BAD ENDING 11: Become A Master In Your Own Kitchen Tomorrow?

- *Gurgle, gurgle, gurgle.* / An unknown substance boils in the pot. / What was once delicious food is now a disastrous pile of black mush. It can no longer even be considered food. / "What in the world did you put in there?" / "I... I just made it the way I did before..." / Snow White is speechless. She snatches the final can of food before Rapunzel can destroy that as well, and returns to the post.
- **Hint**: Don't trust everything your friends say.

#### TRUE ENDING 17: A Friendship She Misses Despite the Embarrassment

- "You're not the slightest bit shy about reading this kind of stuff?" / "Oh, you still remember that?" / Snow White nods, / while Rapunzel smiles. / "How could I forget? After going through that, I don't think anyone else can make me feel embarrassed ever again." / Rapunzel takes the dirty magazine from Snow White. / "I can read things even more salacious than this now." / "Red Hood would be shocked if she saw me now, wouldn't she?" / "Actually, she's probably over the moon that she managed to influence me." / Rapunzel returns the magazine to Snow White. / "I kept feeling like Red Hood was embarrassing me on purpose, so I was annoyed." / "But now, I kinda miss it." / Rapunzel stops talking and begins collecting the rest of the scattered canned food. / Meanwhile, Snow White watches her quietly.
- **Item found**: Dirty Magazine

#### TRUE ENDING 18: The Beautiful Liliweiss

- Snow White runs toward the field of liliweiss before her. / After staring at the flowers for a while as if in a daze, she sits down and caresses them. / "Can I... / go and see you?" / "... Please." / The sky turns red. Snow White continues to cradle the liliweiss in her arms, / even when Rapunzel comes looking for her after praying.
- **Item found**: Liliweiss Flower

### Meadow

At the end of the meadow, she slumbers.

- **Opens**: 2023-05-11 20:00
- **Endings here**: BAD ENDING 12: The Step She Failed to Take; TRUE ENDING 19: Leave With the Flower; TRUE ENDING 20: Tamed Dog Tag; HIDDEN ENDING 21: HEγ hEÂ□ hAŠ DiSäPpæReÐ

#### Page 4-01

- Snow White walks toward the field. / The sun's rays cascade across the peaceful meadow. At the far end there is a stone coffin, encircled by towering trees. / It is there that she slumbers. / “...” / Snow White gazes from afar, half in a daze.
- **Choices**: “Go back.” → page 4-02; “Walk forward.” → page 4-03 (Needs the item Memory Capsule); “Look around.” → page 4-06 (Needs ending 19 (Leave With the Flower) seen before; hidden until unlocked); “Look for Liliweiss's coffin.” → page 4-08 (Needs the item Commander's Dog Tag; hidden until unlocked)

#### Page 4-02

- She still doesn't have the courage to walk forward. / Snow White goes back in hopes of finding something that will give her courage.
- **Next**: Back to the area map (choose another area)

#### Page 4-03

- Snow White holds the memory capsule. Although Snow White isn't confident about maintaining her composure whilst facing her, she musters the courage to step forward.
- **Next**: → page 4-04

#### Page 4-04

- There is a buzzing sound, then a voice rings out. / "You're Snow White, aren't you?" / "Hello." / "I'm Li..."
- **Choices**: “Remain stationary.” → BAD ENDING 12: The Step She Failed to Take; “Walk forward.” → page 4-05 (Needs the item Liliweiss Flower)

#### Page 4-05

- Snow White looks at the liliweiss flower. It was Liliweiss's favorite. / "... I have to go." / At long last, / Snow White makes that step she failed to take before.
- **Next**: → TRUE ENDING 19: Leave With the Flower

#### Page 4-06

- Snow White decides to check the surroundings. / She slowly realizes that she has never given this place a proper once-over. / As she started to move in the direction where she can see the Ark, / *Clang* / Snow White accidentally kicks something. / "??" / She looks down and finds a dog tag. / Yet another memory that had remained buried for so long resurfaces.
- **Next**: → page 4-07

#### Page 4-07

- Snow White remembers that person she has previously forgotten. / He said he was a mercenary, but he didn't seem like the military type. / He was the man who became our leader, who claimed that he would suppress the Raptures. / Commander. / When did it begin? / His bluntness and impertinence gave way to tenderness, and he began treating us like humans... / "I hope you don't get hurt again." / Liliweiss kissed his dog tag. / He gazed at her then, the affection evident in his eyes. / At that moment, Snow White realized something. / She was the one who changed him.
- **Next**: → TRUE ENDING 20: Tamed Dog Tag

#### Page 4-08

- Walking out of the post, Snow White says goodbye to everyone and sets off on a long journey. / Snow White decides to go to Liliweiss's coffin, which she has not visited in a long time. / There is something she must tell Liliweiss before she leaves. / With a heavy heart, Snow White comes to Liliweiss's coffin. / She takes one step / and then another. / *Thud* / Snow White accidentally kicks something. / "??" / There's a familiar-looking piece of rock on the ground. / It's the sharp corner of the coffin. / Snow White lifts her head and looks at Liliweiss.
- **Next**: → HIDDEN ENDING 21: HEγ hEÂ□ hAŠ DiSäPpæReÐ

#### BAD ENDING 12: The Step She Failed to Take

- Snow White remains where she is. / She doesn't have the courage to move forward and meet her. / I'm not ready. / I don't deserve to see her. / I haven't achieved anything at all. / I can't even remember her face, or her name. How can I possibly face her ■■? / Not yet. / It's not yet time. / I can't face her ■■ yet. / Snow White fails to take another step. / After taking that one step towards her, / Snow White stops.
- **Hint**: Snow White can only walk forward when she remembers her name.

#### TRUE ENDING 19: Leave With the Flower

- Leave With the Flower / A coffin lies on the vast meadow, surrounded by soaring trees. / Liliweiss. / The first Nikke. / The leader of the Goddess Squad. / Snow White's hero, who was stronger and more beautiful than anyone else. / "..." / After a long journey, Snow White finally arrives before the slumbering Liliweiss. / Bunches of flowers adorn her grave. A grief-stricken Snow White salutes. / "... Hello." / Liliweiss, my hero. / Never did I feel I was in danger, so long as you were there on the battlefield with me. / Never once did I retreat from anything. / My honor was your honor, / and your happiness was mine. / So, I didn't want to accept the fact that you won't be joining me on my future journey. / I didn't want to accept the fact that I won't be able to see you laugh once again. / But it's time to say farewell. / You gave me a mission. / That mission alone proves you once existed in this world. / It will be the reason this world remembers you and your great achievements. / So please... My sister, my colleague, my soulmate. / My hero. / "Be well." / Snow White places the Liliweiss flower on Liliweiss's coffin. / Finally, she bids her farewell.

#### TRUE ENDING 20: Tamed Dog Tag

- Snow White picks up the dog tag beside her feet. / His name is carved on it. / "Why is this here..." / Snow White can't bring herself to leave it here, so she decides to bring it to Liliweiss. / Snow White remembers how she loved him just as much as he loved her.
- **Item found**: Commander's Dog Tag

#### HIDDEN ENDING 21: HEγ hEÂ□ hAŠ DiSäPpæReÐ

- It's gone. / Her head is gone. / In the shattered coffin, only her body remains. / The white Liliweiss flower / has black scuff marks from being trampled on. / Desperately, / Snow White searches her surroundings. / It's gone. / Why? / HOW IS THIS HAPPENING? / Her face is gone. / Only her body is left. / No one will remember her this way. / I haven't achieved anything yet! I haven't accomplished anything she expected of me!  / Will her story really end so meaninglessly? / "No way." / I refuse to accept this. This can't happen to her... Not to Liliweiss! / *Clang. Clang. Clang. Clang.* / A sound echoes from somewhere. / *Buzz. Buzz. Buzz. Buzz.* / The sound of machines. / Gray intruders that disturb the ground. / "Raptures." / Raptures. / The black marks upon the white flower. / They say they took away her head. / Exterminate them. / I will exterminate them all. / I will find her head. / I have to fulfill her legacy, what she wished for. / "I hope we can..." / I have to save her legacy. I have to save the humans. / "I hope we can save..." / I have to save her legacy. I have to save the humans. / "I hope we can save the humans." / "..." / Click. / Snow White gets to her feet / and walks forward. / She will exterminate all the Raptures on the surface / and recover the human (HEγ) world (hEÂ□).

## Endings

Every ending, where it is found and what it gives or unlocks. Bad endings come with a hint toward a better route.

| # | Type | Ending | Area | Hint | Gives item | Unlocks |
|---|---|---|---|---|---|---|
| 1 | [NORMAL ENDING 1] | End of Expedition | Stand Guard |  |  |  |
| 2 | [NORMAL ENDING 2] | Deer Meat Tastes Good | Forest |  |  |  |
| 3 | [NORMAL ENDING 3] | Hail to the King... of Fishing! | River Bank |  |  |  |
| 4 | [NORMAL ENDING 4] | Become A Master In Your Own Kitchen Today! | Suburb |  |  |  |
| 5 | [NORMAL ENDING 5] | To Bid You Farewell | Suburb |  |  | “Yes.” (page 1-16) |
| 6 | [BAD ENDING 6] | Going Hungry Today | Forest | Loud noises will alert Raptures. |  |  |
| 7 | [BAD ENDING 7] | Meaningless Hallucinations | Forest | If you're not yet ready, try following the other flower. |  | “The red flower” (page 1-14) |
| 8 | [BAD ENDING 8] | An Escaped Deer Does Not Return | Forest | One needs to be well-prepared to catch a deer. |  |  |
| 9 | [BAD ENDING 9] | The Fish Have Fallen Asleep | River Bank | It seems that fishing is more than just making a fishing rod. |  |  |
| 10 | [BAD ENDING 10] | River Butcher | River Bank | It might be better to do a bit of searching than relying on your colleague's sword. |  |  |
| 11 | [BAD ENDING 11] | Become A Master In Your Own Kitchen Tomorrow? | Suburb | Don't trust everything your friends say. |  |  |
| 12 | [BAD ENDING 12] | The Step She Failed to Take | Meadow | Snow White can only walk forward when she remembers her name. |  | “Leave Rapunzel alone and explore another location.” (page 3-14) |
| 13 | [TRUE ENDING 13] | Buried Memory | Forest |  | Memory Capsule |  |
| 14 | [TRUE ENDING 14] | Retro Hood | Forest |  | Cassette Tape |  |
| 15 | [TRUE ENDING 15] | Fleetly Fading | River Bank |  | Pocket Knife |  |
| 16 | [TRUE ENDING 16] | Life Under the Parasol | River Bank |  | Parasol |  |
| 17 | [TRUE ENDING 17] | A Friendship She Misses Despite the Embarrassment | Suburb |  | Dirty Magazine |  |
| 18 | [TRUE ENDING 18] | The Beautiful Liliweiss | Suburb |  | Liliweiss Flower |  |
| 19 | [TRUE ENDING 19] | Leave With the Flower | Meadow |  |  | “Look around.” (page 4-01) |
| 20 | [TRUE ENDING 20] | Tamed Dog Tag | Meadow |  | Commander's Dog Tag |  |
| 21 | [HIDDEN ENDING 21] | HEγ hEÂ□ hAŠ DiSäPpæReÐ | Meadow |  |  |  |

### NORMAL ENDING 1: End of Expedition

- Snow White feels that conditions are not ideal, so she calls off today's expedition and returns to her post.

## Items

These items seem like they could come in handy.

| Item | Description | Found on | Opens the choice |
|---|---|---|---|
| Metal Wire | A strand of metal wire clipped from the fence. / It is old enough to have begun gathering moss, but could still be used to craft something. | page 1-24 | “Takes out the metal wire she has with her.” (page 2-06) |
| Hunting Props | Hunting equipment consisting of a bow and arrow, plus a camouflage outfit. / Until their dying moment, this hunter never imagined that they would end up as the prey. | page 1-27 | “Wear the camouflage outfit.” (page 1-29) |
| Trap | A trap made by Snow White, crafted from some metal wire. / Once a deer steps into the trap, it has no chance of extricating itself. | page 1-28 |  |
| Fishing Rod | A fishing rod made from metal wire and a branch cut by Scarlet. / It is surprisingly durable, and will hook all manner of fish with ease. | page 2-08 |  |
| Cookbook | A book entitled Become A Master In Your Own Kitchen Today! / It instructs readers on how to cook using everyday ingredients, and even includes rudimentary dinner recipes which incorporate canned food. | page 3-20 | “Follows a cookbook and begins cooking.” (page 3-08) |
| Photo Frame | A framed wedding photo: a tangible manifestation of the everlasting love between the couple shown in the picture. / While the frame has begun to deteriorate, the intense affection portrayed in the photo has not faded, not even in death. | page 3-24 | “Take out the photo frame they got and begin praying.” (page 3-07) |
| Dried White Flower | A desiccated white flower. / It brings back memories of someone from the past, someone she misses greatly. | page 3-29 | “Open the door.” (page 3-16) |
| Cassette Tape | An old cassette tape containing an old pop song that Red Hood was particularly fond of. / Humming along with the song brings back waves of nostalgia. / Perhaps that is why Red Hood was such a fan of this tune. / "Our hometown is far away. / The blazing blue sky. / The savory scent of the bakery. / The laughter of friends. / A gust of wind blows. / Please tell my friends. / My soul will return, / to the sky above our hometown. / White clouds float across. / Please tell my friends. / My bones will be buried, / in the earth under our hometown. / Oh, the hometown I long for. / The friends I miss. / Even if the sky above us is forever grey, / We'll return to our hometown someday." | TRUE ENDING 14: Retro Hood |  |
| Memory Capsule | A memory capsule carrying several slips of paper. Nikkes from the Goddess Squad, along with their commander, have scribbled down their wishes on the paper slips. / Those promises have been shattered. Even so, it fills their hearts with the courage to move forward. | TRUE ENDING 13: Buried Memory | “Walk forward.” (page 4-01) |
| Pocket Knife | A pocket knife, which is from the same series as the one Scarlet carries. / Staring at it, Snow White recalls what Scarlet once said, "All things eventually come to an end." / Endowed with a natural proficiency in melee combat, Scarlet is well-versed in wielding edged weapons. / In her hands, even a small pocket knife can become a deadly weapon. | TRUE ENDING 15: Fleetly Fading |  |
| Parasol | A parasol owned by someone who lived near the river long ago. / Dorothy once said that using the parasol made her feel as if she was basking in the warmth of the sun. / It would be an appropriate gift for Dorothy, who has to deal with the pressures of being a leader. | TRUE ENDING 16: Life Under the Parasol |  |
| Dirty Magazine | Red Hood's favorite magazine. / It is a quarterly magazine, featuring attractive, muscle-bound men and women in various states of undress. / Rapunzel always went red in the face whenever she so much as glanced at the magazine, for which Red Hood always enjoyed teasing her. / Now, Red Hood is nowhere to be found, and those playful interactions are no more. / Thinking of that evokes a sense of sorrow within Rapunzel. | TRUE ENDING 17: A Friendship She Misses Despite the Embarrassment |  |
| Liliweiss Flower | A delicate flower that shimmers a pale white day and night. / Liliweiss. / It came to be revealed that her name was derived from this flower. / The flower, which is an integral part of memory between Liliweiss and Snow White, is the key to facing her. | TRUE ENDING 18: The Beautiful Liliweiss | “Walk forward.” (page 4-04) |
| Commander's Dog Tag | The dog tag worn by the commander of the Goddess squad. / It was discovered in the meadow near the entrance of the Ark. / It reminds her of the kiss Liliweiss gave to the commander as a prayer for his safety. / Let's put the dog tag into her coffin to memorialize their fervent love. | TRUE ENDING 20: Tamed Dog Tag | “Look for Liliweiss's coffin.” (page 4-01) |

Once found, an item stays for every later run.

## Data sources

All in `D:\Nikke Datamine\mpkparser\jsons` as `<Table>.json`.

| Table | Rows | Fields |
|---|---|---|
| `EventTextAdventureManagerTable` | 2 | `id`, `event_id`, `is_archive_event`, `ui_prefab`, `first_select_group_id`, `ticket_auto_charge_id`, `reward_ticket_auto_charge_id`, `infinity_mod_active_date`, `reward_id`, `first_enter_scenario_group_id`, `quick_end_event_page_id`, `quick_end_open_condition_value`, `help_tip_id`, `locale_id` |
| `EventTextAdventureEventPageTable` | 230 | `id`, `manager_id`, `first_select_id`, `resource_name`, `scenario_localkey`, `is_bgm_tenssion_up`, `page_type`, `select_option_group_id`, `get_loot_item_id`, `is_go_to_first_select_page`, `next_page_id`, `ending_type`, `ending_num`, `ending_sub_title_localkey`, `ending_hint_localkey` |
| `EventTextAdventureFirstSelectTable` | 8 | `id`, `first_select_group_id`, `first_select_resource`, `first_select_localkey`, `first_select_description_localkey`, `next_page_id`, `is_use_time_condition`, `time_condition`, `is_use_ending_condition`, `ending_condition`, `show_ending_condition`, `navigation_icon` |
| `EventTextAdventureLocaleTable` | 2 | `id`, `first_select_description_localkey`, `lootitem_name_localkey`, `lootitem_description_localkey`, `lootitem_gain_message_localkey`, `lootitem_already_gain_localkey`, `open_condition_time_localkey`, `open_condition_ending_localkey`, `open_condition_hidden_localkey`, `album_localkey`, `album_description_localkey`, `reward_description_localkey`, `reward_already_received_localkey`, `quick_end_localkey`, `quick_end_start_button_localkey`, `quick_end_description_localkey`, `quick_end_alert_localkey`, `lootitem_button_localkey`, `album_button_localkey`, `game_start_button_localkey`, `revert_page_localkey`, `data_saving_localkey`, `pause_button_localkey`, `pause_localkey`, `pause_description_localkey`, `ending_collect_able_localkey`, `ending_collect_disable_localkey`, `ending_collect_infinity_mod_localkey`, `touch_to_go_reward_page_localkey`, `touch_to_end_localkey`, `adventure_location_localkey`, `game_load_localkey`, `toast_can_not_select_localkey`, `toast_currency_ticket_lack_localkey`, `toast_quick_end_open_condition_localkey`, `toast_require_first_select_localkey`, `toast_require_ending_localkey`, `toast_require_loot_item_localkey`, `toast_ending_not_collected_localkey`, `ending_record_success_localkey`, `ending_record_denied_localkey`, `reward_count_left_localkey`, `no_reward_in_archive_localkey` |
| `EventTextAdventureLootItemTable` | 28 | `id`, `manager_id`, `icon_resource`, `item_name_localkey`, `item_description_localkey` |
| `EventTextAdventureSelectOptionTable` | 128 | `id`, `group_id`, `manager_id`, `selection_localkey`, `open_condition_type`, `open_condition_value`, `is_hidden`, `page_id`, `sound_effect` |

The viewer also reads: `HelpTipTable`, `HelpTipDescriptionTable`, `AutoChargeTable`.

## Uncertain / unknown

The viewer flagged nothing as uncertain. Fields it does not show are listed in Data sources; their meaning is not interpreted.
