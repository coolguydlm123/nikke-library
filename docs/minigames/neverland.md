# Snowfall Oasis (Dating Sim)

A 21-day dating sim at Snowfield Hot Spring: visit locations to meet Nikkes, pick choices to build Bond, and unlock Connection events up to each Nikke's ending and hidden ending.

This guide was generated from the Nikke Library's reading of the game data: the viewer `lib/eventgames/neverland.js` turns the `Event*` tables in `D:\Nikke Datamine\mpkparser\jsons` into the rules below. Numbers, units and formulas are the viewer's readings; anything it was not sure of is listed under "Uncertain / unknown". Long lists are cut to 30 rows.

- Art folder: `icons-event/27_neverland`

## Overview

### The game

- **Prologue**: story "Start of a Legend" (`snowfall_prologue`)
- **Length**: 21 in-game days, each with three time slots (daytime, evening, night)
- **Map**: 6 locations: Dormitory, Waterfall, Restaurant, Walking Trail, Hot Spring, Bamboo Forest
- **Moving on**: Talking to a Nikke costs a Heart Clock; spending Heart Clocks moves the clock forward
- **Heart Clock**: +3 a day (the daily refresh), holding up to 21
- **Daily reward**: Spend 3 Heart Clocks in a day: Gem ×30, Date with the CO ×1
- **Unlimited Mode (time)**: After day 21 the last day repeats; every Nikke is out and Bond is unlimited
- **Unlimited Mode (Heart Clock)**: From 2023-12-26 20:00, Heart Clocks are unlimited
- **Event start**: 2023-12-07 20:00
- **Epilogue**: story "Snowfall Oasis" (`snowfall_epilogue`)

### Bond and Connection

- **Bond**: Earned from the choices in Scenario Events: +25 (small), +50 (medium) or +100 (big)
- **Connection level**: When Bond reaches the target for her current level, a Connection event appears; clearing it raises the level (and starts the count again)
- **Endings**: The last two Connection events of each Nikke are her Ending and Hidden ending
- **Groups**: Blanc and Noir sometimes appear together; group choices give Bond to both
- **Lost Items**: Some Connection events need an item found in the event field first
- **Album**: Finishing a Nikke's story pays an album reward; special scenes add pictures to the Photo album

### Bond needed per Connection level

| Level | Bond |
|---|---|
| 1 | 50 |
| 2 | 50 |
| 3 | 75 |
| 4 | 75 |
| 5 | 75 |
| 6 | 100 |

### Nikkes

| Nikke | First meeting | Max level |
|---|---|---|
| Mica | day 1, Waterfall (daytime) | 6 |
| Emma | day 1, Restaurant (evening) | 6 |
| Ludmilla | day 4, Walking Trail (night) | 6 |
| Blanc & Noir | Noir: day 8, Bamboo Forest (daytime); Blanc: day 9, Hot Spring (daytime) | 4 |

## Tutorial

### My Room

- ■ This is the Commander's private space. / ■ Tap "Go out" to play the game.

### Snowfield Hot Spring

- ■ The game contains six locations. / ■ Nikkes will appear in each location. / ■ When you go to the location where the Nikke appears, a Scenario Event will begin.
- ■ The mini game's time operates differently from the real-world time and follows a specific schedule. / ■ The mini game will last for 21 days. / ■ A day in the mini game is made up of the morning, afternoon, and evening.

### Scenario Event

- ■ When you go to the location where the Nikke appears, a Scenario Event will begin. / ■ Options will appear in the Scenario Event. / ■ Gain Bond with the Nikke based on your choices.
- ■ Some events consume Heart Clocks. / ■ An icon will indicate whether or not the specific event will consume Heart Clocks. / ■ Time in the mini game will elapse when you use Heart Clocks. / ■ 3 Heart Clocks will be replenished during the daily refresh time.
- ■ Consume 3 Heart Clocks every day to obtain the daily reward. / ■ The daily reward can only be obtained once a day.

### Connection Event

- ■ When certain requirements are met, Connection events with some Nikkes will occur. / ■ Connection events can be distinguished through the heart icon in Snowfield Hot Spring. / ■ The first Connection event with each Nikke initiates a special story with the said Nikke. / ■ Your Connection info with the Nikke you have begun a story with will be recorded in the Diary.
- ■ You can increase your Connection level with each Nikke by completing Connection events. / ■ When you reach the target Bond within each Connection level, the Connection event that will bring your Connection to the next level will occur. / ■ Bond can be obtained through Scenario Events.

### Group

- ■ In some cases, two Nikkes will be involved. / ■ When the event happens with a group, the event result will affect both Nikkes.

### Lost Items

- ■ To proceed with certain Connection events, you must find the Nikke's lost item and return it to her. / ■ Lost Items can be obtained from the Event Field. / ■ Hints will be given in the Event Field to help you find the Lost Items.
- ■ When Lost Items emerge, a "Lost Item emerging in the Field" button will appear in Snowfield Hot Spring. / ■ Tap the button to head to the Event Field right away. / ■ After obtaining the Lost Item, tap Deliver to return to Snowfield Hot Spring.

### Unlimited Mode (Time)

- ■ After all the scheduled events conclude, the last day will repeat infinitely. / ■ All Nikkes will appear in Snowfield Hot Spring, and you can earn unlimited Bond through events.

### Unlimited Mode (Heart Clock)

- ■ From this moment on, you will have unlimited Heart Clocks. / ■ You can play all events as many times you want without being restricted by the amount of Heart Clocks.

## Nikkes

### Mica

7 Connection events and 35 Scenario Events.

- **Album reward**: Mica Rock ×1

#### Connection levels

| Nikke | Max level | Bond per level |
|---|---|---|
| Mica | 6 | 50 → 50 → 75 → 75 → 75 → 100 |

Bond needed at each Connection level before the next Connection event appears.

#### Connection events

| Event | Needs | Where / when | Result |
|---|---|---|---|
| story "Mica and Skipping Stones" (`snowfall_episode_mica_01`) | Nothing (first meeting) | From day 1; Waterfall, daytime | [Starts her story]; Costs a Heart Clock |
| story "How to Skip Stones Well" (`snowfall_episode_mica_02`) | Mica: Connection Lv 1 and 50 Bond | From day 1; Walking Trail, evening | [Connection Lv up] |
| story "Mica and Lumi" (`snowfall_episode_mica_03`) | Mica: Connection Lv 2 and 50 Bond; After special event (Mass-produced Nikke: Lumi) | From day 1; Waterfall, evening | [Connection Lv up] |
| story "Mica's Savior: B" (`snowfall_episode_mica_04_e`) | Mica: Connection Lv 3 and 75 Bond; After special event (Mica and Belorta's Fireworks); Find the Flat Stone | From day 1; Waterfall, night; Lost item story (Mica's Savior: A → find it → hand it over) | [Connection Lv up] |
| story "Luck, Skill, and Effort" (`snowfall_episode_mica_05`) | Mica: Connection Lv 4 and 75 Bond | From day 1; Waterfall, daytime | [Connection Lv up] |
| story "The Courage to Give Up" (`snowfall_episode_mica_06`) | Mica: Connection Lv 5 and 75 Bond | From day 1; Waterfall, evening | [Ending] |
| story "The Stone Skipping Legend" (`snowfall_episode_mica_07`) | Mica: Connection Lv 6 and 100 Bond | From day 1; Dormitory, daytime | [Hidden ending] |

They appear (heart icon) once the requirements are met, at the given place and time from the given day on.

#### Scenario events

| Day | Where / when | Lv | Scene | Bond choices |
|---|---|---|---|---|
| Day 1 | Dormitory, night | 1–6 | story "I find Mica in the dormitory." (`snowfall_speech_mica_01`) | It's a reinvigorating feeling, isn't it? (Bond +50); That's a strange way of thinking about it. (Bond +25) |
| Day 2 | Waterfall, daytime | 1–6 | story "I find Mica at the waterfall." (`snowfall_speech_mica_02`) | Maybe a bit too powerful... (Bond +25); I hope it does imbue you with its energy. (Bond +50) |
| Day 2 | Waterfall, evening | 1–6 | story "I find Mica at the waterfall." (`snowfall_speech_mica_03`) | I'll stay here with you, so you can relax. (Bond +50); Calm down. This is all in your mind. (Bond +25) |
| Day 2 | Dormitory, night | 1–6 | story "I find Mica in the dormitory." (`snowfall_speech_mica_04`) | It's amazing. (Bond +50); It's not all that different from what we see in the Ark. (Bond +25) |
| Day 3 | Waterfall, evening | 1–6 | story "I find Mica at the waterfall." (`snowfall_speech_mica_05`) | Wouldn't it be better to give her some space first? (Bond +25); Try and make her feel at home. (Bond +50) |
| Day 3 | Dormitory, night | 1–6 | story "I find Mica in the dormitory." (`snowfall_speech_mica_06`) | That's kind of you to say. (Bond +25); You saying that has just made my day. (Bond +50) |
| Day 4 | Waterfall, evening | 1–6 | story "I find Mica at the waterfall." (`snowfall_speech_mica_07`) | Hmm... I haven't given it much thought. (Bond +25); I want to set off fireworks with you. (Bond +50) |
| Day 5 | Restaurant, daytime | 1–6 | story "I find Mica in the restaurant." (`snowfall_speech_mica_08`) | Sure, thanks. (Bond +50); What's that? (Bond +25) |
| Day 6 | Walking Trail, daytime | 1–6 | story "I find Mica at the walking trail." (`snowfall_speech_mica_09`) | It looks like the ribbon you have on your waist. (Bond +50); It looks like the broom that you use when you're cleaning. (Bond +25) |
| Day 7 | Walking Trail, evening | 1–6 | story "I find Mica at the walking trail." (`snowfall_speech_mica_10`) | I'm not sure about the specific name, but... the big one? (Bond +25); The sparklers were really fantastic. (Bond +50) |
| Day 7 | Dormitory, night | 1–6 | story "I find Mica in the dormitory." (`snowfall_speech_mica_11`) | Okay, fine. We all did our part. (Bond +50); Yeah, you're right. Ludmilla and I did have a rougher go of it. (Bond +25) |
| Day 8 | Hot Spring, daytime | 1–6 | story "I find Mica at the hot spring." (`snowfall_speech_mica_12`) | Why don't you use this bucket? (Bond +25); Why don't you utilize waves? (Bond +50) |
| Day 8 | Bamboo Forest, night | 1–6 | story "I find Mica at the bamboo forest." (`snowfall_speech_mica_13`) | You're right. It's nice. (Bond +50); I dunno, sounds a little creepy to me. (Bond +25) |
| Day 10 | Dormitory, daytime | 1–6 | story "I find Mica in the dormitory." (`snowfall_speech_mica_14`) | I should go try and find her, then. (Bond +25); I'll help you keep lookout. (Bond +50) |
| Day 11 | Dormitory, evening | 1–6 | story "I find Mica in the dormitory." (`snowfall_speech_mica_15`) | Comfort Mica. (Bond +50); Get Mica off me. (Bond +25) |
| Day 12 | Dormitory, daytime | 1–6 | story "I find Mica in the dormitory." (`snowfall_speech_mica_16`) | You being there made me feel secure as well. So thank you. (Bond +50); I'm proud of you. It's like you're all grown up. (Bond +25) |
| Day 13 | Hot Spring, daytime | 1–6 | story "I find Mica at the hot spring." (`snowfall_speech_mica_17`) | It'll probably just be a normal event. (Bond +25); I assume it'll have something to do with luck. (Bond +50) |
| Day 13 | Hot Spring, night | 1–6 | story "I find Mica at the hot spring." (`snowfall_speech_mica_18`) | I was just thinking about the lucky hot spring event. (Bond +50); I was bored and had nothing else to do. (Bond +25) |
| Day 14 | Restaurant, night | 1–6 | story "I find Mica in the restaurant." (`snowfall_speech_mica_19`) | Yes, please. (Bond +50); No, I'd prefer a cold beverage. (Bond +25) |
| Day 15 | Hot Spring, evening | 1–6 | story "I find Mica at the hot spring." (`snowfall_speech_mica_20`) | Startle Mica. (Bond +25); Go beside her and dip your feet in. (Bond +50) |
| Day 16 | Restaurant, daytime | 1–6 | story "I find Mica in the restaurant." (`snowfall_speech_mica_21`) | Let's eat together. (Bond +50); Thank you. (Bond +25) |
| Day 16 | Dormitory, night | 1–6 | story "I find Mica in the dormitory." (`snowfall_speech_mica_22`) | We'll see them again when we head back. (Bond +50); I'm sad too. (Bond +25) |
| Day 17 | Walking Trail, evening | 1–2 | story "I find Mica at the walking trail." (`snowfall_speech_mica_23`) | Well, that's not the case today. (Bond +25); Today, I'm here to talk to you. (Bond +50) |
| Day 17 | Walking Trail, evening | 3–4 | story "I find Mica at the walking trail." (`snowfall_speech_mica_24`) | It's nice to see you two becoming closer. (Bond +50); That's good progress, but don't you think you should try a little harder to get closer to her? (Bond +25) |
| Day 17 | Walking Trail, evening | 5 | story "I find Mica at the walking trail." (`snowfall_speech_mica_25`) | Cheer up. You'll get there soon enough. (Bond +50); Maybe some people just don't have what it takes. (Bond +25) |
| Day 17 | Walking Trail, evening | 6 | story "I find Mica at the walking trail." (`snowfall_speech_mica_26`) | Absolutely, I'd love to join you. (Bond +50); I have plans later, sorry. (Bond +25) |
| Day 18 | Dormitory, daytime | 1–6 | story "I find Mica in the dormitory." (`snowfall_speech_mica_27`) | What a cute snowman. (Bond +50); Wouldn't it be better if it was a bit bigger? (Bond +25) |
| Day 19 | Walking Trail, daytime | 1–5 | story "I find Mica at the walking trail." (`snowfall_speech_mica_28`) | I'm worried about whether they'll be able to endure this cold. (Bond +25); I'm sure they will. (Bond +50) |
| Day 19 | Walking Trail, daytime | 6 | story "I find Mica at the walking trail." (`snowfall_speech_mica_29`) | I thought the same thing, which is why I came. (Bond +50); Why? (Bond +25) |
| Day 20 | Waterfall, daytime | 1–5 | story "I find Mica at the waterfall." (`snowfall_speech_mica_30`) | You don't think that you'll forget them before long? (Bond +25); Your perseverance is admirable. (Bond +50) |

(5 more rows of 35 not shown; see the data table.)

Meet her at this place and time to start the scene; talking costs 1 Heart Clock. Bond choices: +25 small, +50 medium, +100 big. Some days have different scenes depending on her Connection level. "Unlimited" scenes repeat after day 21.

#### Mica's mood by level

The diary line shown at each Connection level.

- She seems more interested in the legend of stone skipping now.
- She's trying hard to skip stones.
- She decides to practice stone skipping more.
- She seems to have grown curious about Lumi, who brought over some stones.
- She wonders if Lumi is a stone skipping expert.
- She thinks she has no talent in stone skipping.
- She seems a bit regretful, yet still pleased enough.
- She looks delighted about successfully skipping a stone.

### Emma

7 Connection events and 39 Scenario Events.

- **Album reward**: Emma's Recipe Book ×1

#### Connection levels

| Nikke | Max level | Bond per level |
|---|---|---|
| Emma | 6 | 50 → 50 → 75 → 75 → 75 → 100 |

Bond needed at each Connection level before the next Connection event appears.

#### Connection events

| Event | Needs | Where / when | Result |
|---|---|---|---|
| story "Hot Spring Recipe: B" (`snowfall_episode_emma_01_e`) | Find the Red Fruit | From day 1; Restaurant, evening; Lost item story (Hot Spring Recipe: A → find it → hand it over) | [Starts her story]; Costs a Heart Clock |
| story "Emma's Cooking Preparation: B" (`snowfall_episode_emma_02_e`) | Emma: Connection Lv 1 and 50 Bond; Find the Fishing Net | From day 1; Waterfall, evening; Lost item story (Emma's Cooking Preparation: A → find it → hand it over) | [Connection Lv up] |
| story "A Deepening Concern" (`snowfall_episode_emma_03`) | Emma: Connection Lv 2 and 50 Bond; After special event (Mass-produced Nikke: Lumi) | From day 1; Restaurant, daytime | [Connection Lv up] |
| story "Finding the Secret" (`snowfall_episode_emma_04`) | Emma: Connection Lv 3 and 75 Bond | From day 1; Walking Trail, daytime | [Connection Lv up] |
| story "How to Get Closer to Lumi" (`snowfall_episode_emma_05`) | Emma: Connection Lv 4 and 75 Bond; After special event (Bamboo Forest Open) | From day 1; Restaurant, daytime | [Connection Lv up] |
| story "Lumi, Soup, and the Waterfall" (`snowfall_episode_emma_06`) | Emma: Connection Lv 5 and 75 Bond | From day 1; Restaurant, night | [Ending] |
| story "The Secret of the Waterfall" (`snowfall_episode_emma_07`) | Emma: Connection Lv 6 and 100 Bond | From day 1; Dormitory, night | [Hidden ending] |

They appear (heart icon) once the requirements are met, at the given place and time from the given day on.

#### Scenario events

| Day | Where / when | Lv | Scene | Bond choices |
|---|---|---|---|---|
| Day 1 | Walking Trail, night | 1–6 | story "I find Emma on the walking trail." (`snowfall_speech_emma_01`) | I hate missing out on my walk, but it's probably a good idea. (Bond +50); But I just got here... (Bond +25) |
| Day 2 | Restaurant, daytime | 1–6 | story "I find Emma at the restaurant." (`snowfall_speech_emma_02`) | I already ate, so I'll pass. (Bond +50); Sorry, but I'll have to decline. I have a stomachache. (Bond +25) |
| Day 2 | Restaurant, night | 1–6 | story "I find Emma at the restaurant." (`snowfall_speech_emma_03`) | They're meant to be prepared for distinguished guests, so I can understand why they'd be difficult. (Bond +25); You'll get better with practice. Hang in there. (Bond +50) |
| Day 3 | Walking Trail, evening | 1–6 | story "I find Emma on the walking trail." (`snowfall_speech_emma_04`) | Are you talking about Lumi? (Bond +50); Do you not remember her name? (Bond +25) |
| Day 3 | Waterfall, night | 1–6 | story "I find Emma at the waterfall." (`snowfall_speech_emma_05`) | Personally, I find it a bit noisy. (Bond +25); It is a wonderful sound to focus on. (Bond +50) |
| Day 5 | Dormitory, night | 1–6 | story "I find Emma at the dormitory." (`snowfall_speech_emma_07`) | Very much so. (Bond +25); It was, especially the dish that you made. (Bond +50) |
| Day 6 | Walking Trail, evening | 1–6 | story "I find Emma on the walking trail." (`snowfall_speech_emma_08`) | I'm really excited. (Bond +50); Oh shoot, I almost forgot. (Bond +25) |
| Day 7 | Hot Spring, evening | 1–6 | story "I find Emma at the hot spring." (`snowfall_speech_emma_09`) | I should hurry and try it out for myself. (Bond +25); How about we go in together next time? (Bond +50) |
| Day 7 | Hot Spring, night | 1–6 | story "I find Emma at the hot spring." (`snowfall_speech_emma_10`) | That's right. (Bond +50); No. (Bond +25) |
| Day 8 | Dormitory, daytime | 1–6 | story "I find Emma at the dormitory." (`snowfall_speech_emma_11`) | ... It's a tough decision. (Bond +25); ... Sure. (Bond +50) |
| Day 8 | Restaurant, night | 1–6 | story "I find Emma at the restaurant." (`snowfall_speech_emma_12`) | Go for the dried bananas. (Bond +50); I can't recommend either of them. (Bond +25) |
| Day 9 | Waterfall, daytime | 1–6 | story "I find Emma at the waterfall." (`snowfall_speech_emma_13`) | Doesn't staring at them get boring after a while? (Bond +25); I like to zone out like that once in a while, too. (Bond +50) |
| Day 9 | Walking Trail, evening | 1–6 | story "I find Emma on the walking trail." (`snowfall_speech_emma_14`) | Yes. You're being too greedy. (Bond +25); No, I'd also like to go with you. (Bond +50) |
| Day 10 | Walking Trail, daytime | 1–6 | story "I find Emma on the walking trail." (`snowfall_speech_emma_15`) | I'm sure it's just a prank. Don't worry too much. (Bond +50); I'm worried too. Let's look for her together. (Bond +25) |
| Day 11 | Dormitory, daytime | 1–6 | story "I find Emma at the dormitory." (`snowfall_speech_emma_16`) | You don't seem scared at all. (Bond +25); There's no need to be afraid. I'll protect you. (Bond +50) |
| Day 12 | Hot Spring, daytime | 1–6 | story "I find Emma at the hot spring." (`snowfall_speech_emma_17`) | I couldn't get any sleep either. I'm exhausted. (Bond +25); Are you feeling better now? (Bond +50) |
| Day 12 | Waterfall, evening | 1–6 | story "I find Emma at the waterfall." (`snowfall_speech_emma_18`) | Lean up next to her. (Bond +50); Wake her up. (Bond +25) |
| Day 13 | Bamboo Forest, daytime | 1–6 | story "I find Emma in the bamboo forest." (`snowfall_speech_emma_19`) | Maybe it's something like everyone taking a bath together? (Bond +25); I'd wager it has something to do with testing our luck. (Bond +50) |
| Day 14 | Restaurant, daytime | 1–6 | story "I find Emma at the restaurant." (`snowfall_speech_emma_20`) | Maybe she took some pointers from certain master, like you. (Bond +50); Maybe she's been practicing. (Bond +25) |
| Day 14 | Restaurant, evening | 1–6 | story "I find Emma at the restaurant." (`snowfall_speech_emma_21`) | What about a cake, which is your specialty? (Bond +50); How about something like a hearty stew with a savory broth? (Bond +25) |
| Day 15 | Bamboo Forest, evening | 1–6 | story "I find Emma in the bamboo forest." (`snowfall_speech_emma_22`) | Sounds like a lot of work. (Bond +25); I admire your work ethic. (Bond +50) |
| Day 15 | Restaurant, night | 1–6 | story "I find Emma at the restaurant." (`snowfall_speech_emma_23`) | Hand her your empty plate. (Bond +25); Help her with the dishes. (Bond +50) |
| Day 16 | Restaurant, night | 1–6 | story "I find Emma at the restaurant." (`snowfall_speech_emma_24`) | I feel the same way. (Bond +50); That sadness will diminish come tomorrow. (Bond +25) |
| Day 17 | Restaurant, night | 1–3 | story "I find Emma at the restaurant." (`snowfall_speech_emma_25`) | You don't have to do that. Let's eat together. (Bond +25); I'd like to eat together with you today. (Bond +50) |
| Day 17 | Restaurant, night | 4–5 | story "I find Emma at the restaurant." (`snowfall_speech_emma_26`) | That's why I want to get to know her more. (Bond +50); That's why I sometimes get scared around her. (Bond +25) |
| Day 17 | Restaurant, night | 6 | story "I find Emma at the restaurant." (`snowfall_speech_emma_27`) | The soup? (Bond +25); Is that the soup we made the night we saw the rainbow at the waterfall? (Bond +50) |
| Day 18 | Hot Spring, daytime | 1–6 | story "I find Emma at the hot spring." (`snowfall_speech_emma_28`) | Did you use a new shampoo? Smells nice. (Bond +50); Did you use a new body wash? The smell is... a bit potent. (Bond +25) |
| Day 19 | Waterfall, daytime | 1–5 | story "I find Emma at the waterfall." (`snowfall_speech_emma_29`) | Then we'll have to cherish it in our memories. (Bond +25); How about a video? (Bond +50) |
| Day 19 | Waterfall, daytime | 6 | story "I find Emma at the waterfall." (`snowfall_speech_emma_30`) | You might be right. (Bond +50); I think all those fish got swept down the current. (Bond +25) |
| Day 19 | Hot Spring, night | 1–5 | story "I find Emma at the hot spring." (`snowfall_speech_emma_31`) | Can't say... I'm not really into bath salts. (Bond +25); I'll go with whatever you recommend. (Bond +50) |

(9 more rows of 39 not shown; see the data table.)

Meet her at this place and time to start the scene; talking costs 1 Heart Clock. Bond choices: +25 small, +50 medium, +100 big. Some days have different scenes depending on her Connection level. "Unlimited" scenes repeat after day 21.

#### Emma's mood by level

The diary line shown at each Connection level.

- She seems more interested in the legend of Snowfield Hot Spring now.
- She seems set on bringing the salad to the waterfall.
- She is thinking about how to cook the fish while worrying about me.
- She feels that Lumi seems to know a lot about this legend.
- She seems to be considering how to grow closer to Lumi.
- She silently thanks Lumi for bringing her closer to the waterfall's secret.
- She seems happier because of the rainbow the three of us saw together.
- She will never forget spending time with me at the waterfall.

### Ludmilla

7 Connection events and 36 Scenario Events.

- **Album reward**: Ludmilla's Lantern ×1

#### Connection levels

| Nikke | Max level | Bond per level |
|---|---|---|
| Ludmilla | 6 | 50 → 50 → 75 → 75 → 75 → 100 |

Bond needed at each Connection level before the next Connection event appears.

#### Connection events

| Event | Needs | Where / when | Result |
|---|---|---|---|
| story "Under the Shade of the Snow" (`snowfall_episode_ludmilla_01`) | Nothing (first meeting) | From day 4; Walking Trail, night | [Starts her story]; Costs a Heart Clock |
| story "Gently Rippled Water" (`snowfall_episode_ludmilla_02`) | Ludmilla: Connection Lv 1 and 50 Bond | From day 4; Walking Trail, evening | [Connection Lv up] |
| story "Tainted Wish: B" (`snowfall_episode_ludmilla_03_e`) | Ludmilla: Connection Lv 2 and 50 Bond; Find the Pen | From day 4; Bamboo Forest, evening; Lost item story (Tainted Wish: A → find it → hand it over) | [Connection Lv up] |
| story "Where Footsteps Stay" (`snowfall_episode_ludmilla_04`) | Ludmilla: Connection Lv 3 and 75 Bond | From day 4; Dormitory, daytime | [Connection Lv up] |
| story "Oasis in the Snow" (`snowfall_episode_ludmilla_05`) | Ludmilla: Connection Lv 4 and 75 Bond; After special event (The Legend of the Dormitory) | From day 4; Hot Spring, evening | [Connection Lv up] |
| story "Wish Under the Moonlight" (`snowfall_episode_ludmilla_06`) | Ludmilla: Connection Lv 5 and 75 Bond | From day 4; Walking Trail, night | [Ending] |
| story "Ludmilla: Winter Owner" (`snowfall_episode_ludmilla_07`) | Ludmilla: Connection Lv 6 and 100 Bond | From day 4; Walking Trail, night | [Hidden ending] |

They appear (heart icon) once the requirements are met, at the given place and time from the given day on.

#### Scenario events

| Day | Where / when | Lv | Scene | Bond choices |
|---|---|---|---|---|
| Day 5 | Bamboo Forest, daytime | 1–6 | story "I find Ludmilla at the bamboo forest." (`snowfall_speech_ludmilla_01`) | You shouldn't put that much pressure on yourself. (Bond +25); What type of food do you usually prefer? (Bond +50) |
| Day 5 | Walking Trail, night | 1–6 | story "I find Ludmilla at the walking trail." (`snowfall_speech_ludmilla_02`) | Everything was so delicious that it was hard to choose. (Bond +25); The apple pie, naturally. (Bond +50) |
| Day 6 | Bamboo Forest, daytime | 1–6 | story "I find Ludmilla at the bamboo forest." (`snowfall_speech_ludmilla_03`) | Why do you ask? (Bond +25); I always have time for you. (Bond +50) |
| Day 6 | Waterfall, evening | 1–6 | story "I find Ludmilla at the waterfall." (`snowfall_speech_ludmilla_04`) | One so extravagant that it lights up the entire night sky. (Bond +25); Something nice and simple, which illuminates the area around it. (Bond +50) |
| Day 7 | Bamboo Forest, evening | 1–6 | story "I find Ludmilla at the bamboo forest." (`snowfall_speech_ludmilla_05`) | What? That's not what I was getting at. (Bond +25); Well... of course that's something I've been looking forward to. (Bond +50) |
| Day 7 | Restaurant, night | 1–6 | story "I find Ludmilla at the restaurant." (`snowfall_speech_ludmilla_06`) | I take a spoonful of the rice and hand it to Ludmilla. (Bond +25); Grabbing a spoon, I take a spoonful of the rice bowl and chow down. (Bond +50) |
| Day 8 | Dormitory, evening | 1 | story "I find Ludmilla in the dormitory." (`snowfall_speech_ludmilla_07`) | I could say the same thing to you. (Bond +25); I get a lot of enjoyment out of talking to you. (Bond +50) |
| Day 8 | Dormitory, evening | 2–6 | story "I find Ludmilla in the dormitory." (`snowfall_speech_ludmilla_08`) | Whose diary? (Bond +25); I can't put my finger on it, but that thing creeps me out. (Bond +50) |
| Day 8 | Walking Trail, night | 1 | story "I find Ludmilla at the walking trail." (`snowfall_speech_ludmilla_09`) | I had a wonderful time, thanks to you. (Bond +25); I had a wonderful time being around everyone. (Bond +50) |
| Day 8 | Walking Trail, night | 2–6 | story "I find Ludmilla at the walking trail." (`snowfall_speech_ludmilla_10`) | Do you see something? (Bond +25); I don't see her. (Bond +50) |
| Day 9 | Dormitory, daytime | 1–6 | story "I find Ludmilla in the dormitory." (`snowfall_speech_ludmilla_11`) | I'll help Mica. (Bond +25); I'll help you with the lanterns. (Bond +50) |
| Day 10 | Bamboo Forest, evening | 1–6 | story "I find Ludmilla at the bamboo forest." (`snowfall_speech_ludmilla_12`) | She left a note, so I'm sure she's fine. (Bond +25); Before the sun sets, let's look around a bit more. (Bond +50) |
| Day 11 | Walking Trail, daytime | 1–6 | story "I find Ludmilla at the walking trail." (`snowfall_speech_ludmilla_13`) | Has this happened to you? (Bond +25); Yes. If someone asks me for help, I do whatever I can, no questions asked. (Bond +50) |
| Day 12 | Bamboo Forest, daytime | 1–6 | story "I find Ludmilla at the bamboo forest." (`snowfall_speech_ludmilla_14`) | Lavender sounds nice. (Bond +25); Jasmine sounds nice. (Bond +50) |
| Day 12 | Dormitory, evening | 1–6 | story "I find Ludmilla in the dormitory." (`snowfall_speech_ludmilla_15`) | If you leave it in the restaurant, I'm sure someone who's hungry will eat it. (Bond +25); Grab a spoon, take a spoonful of the donburi and chow down. (Bond +50) |
| Day 13 | Walking Trail, night | 1–6 | story "I find Ludmilla at the walking trail." (`snowfall_speech_ludmilla_16`) | You were able to toss the coin inside the basket, so everything will be fine. (Bond +25); Do you want to head back to the hot spring? (Bond +50) |
| Day 14 | Bamboo Forest, daytime | 1–6 | story "I find Ludmilla at the bamboo forest." (`snowfall_speech_ludmilla_17`) | I just don't want legends of the past to tie us down. (Bond +25); I think those legends have given us some indelible experiences here at Snowfield. (Bond +50) |
| Day 14 | Dormitory, evening | 1–6 | story "I find Ludmilla in the dormitory." (`snowfall_speech_ludmilla_18`) | I'll notify Signal. (Bond +25); I'll try contacting the higher-ups later. (Bond +50) |
| Day 14 | Walking Trail, night | 1–6 | story "I find Ludmilla at the walking trail." (`snowfall_speech_ludmilla_19`) | Is there really a legendary fish... (Bond +25); So people have been having the same reaction to this waterfall for a while. (Bond +50) |
| Day 15 | Walking Trail, evening | 1–6 | story "I find Ludmilla at the walking trail." (`snowfall_speech_ludmilla_20`) | I did invite them out all this way, so I'm a bit nervous that everything won't be perfect. (Bond +25); I'm sure they'll have a wonderful time here. (Bond +50) |
| Day 15 | Walking Trail, night | 1–6 | story "I find Ludmilla at the walking trail." (`snowfall_speech_ludmilla_21`) | Stay quiet. (Bond +25); Hold Ludmilla's hand. (Bond +50) |
| Day 16 | Dormitory, daytime | 1–6 | story "I find Ludmilla in the dormitory." (`snowfall_speech_ludmilla_22`) | Should we leave so that Anne can get some more sleep? (Bond +25); You're the consummate host, Ludmilla. (Bond +50) |
| Day 16 | Bamboo Forest, night | 1–6 | story "I find Ludmilla at the bamboo forest." (`snowfall_speech_ludmilla_23`) | Perhaps, but isn't a bit of silence better? (Bond +25); A bit of noise isn't always a bad thing. (Bond +50) |
| Day 17 | Restaurant, daytime | 1–6 | story "I find Ludmilla at the restaurant." (`snowfall_speech_ludmilla_24`) | I'm leaning towards the eerie stories. (Bond +25); I'm leaning towards the adventure stories. (Bond +50) |
| Day 17 | Walking Trail, night | 1–5 | story "I find Ludmilla at the walking trail." (`snowfall_speech_ludmilla_25`) | I'm sure the same could be said for other places. (Bond +25); Do you think that there's a hidden story behind every beautiful place? (Bond +50) |
| Day 17 | Walking Trail, night | 6 | story "I find Ludmilla at the walking trail." (`snowfall_speech_ludmilla_26`) | Well, I hope whatever she wishes for comes true. (Bond +25); Well, I hope that she can live a happy life going forward. (Bond +50) |
| Day 18 | Bamboo Forest, daytime | 1–6 | story "I find Ludmilla at the bamboo forest." (`snowfall_speech_ludmilla_27`) | That's too bad, but I understand. Besides, we'll have many more walks together in the future. (Bond +25); If you're quick about it, we can still enjoy our walk together. I can help as well. (Bond +50) |
| Day 19 | Dormitory, daytime | 1–6 | story "I find Ludmilla in the dormitory." (`snowfall_speech_ludmilla_28`) | Isn't it a bit odd to find everyday life so fascinating? (Bond +25); That's understandable. Some people can find that sort of quotidian routine intriguing. (Bond +50) |
| Day 19 | Bamboo Forest, night | 1–2 | story "I find Ludmilla at the bamboo forest." (`snowfall_speech_ludmilla_29`) | That would seem to indicate... (Bond +25); Yes, but maybe the wish can still come true. (Bond +50) |
| Day 19 | Bamboo Forest, night | 3–5 | story "I find Ludmilla at the bamboo forest." (`snowfall_speech_ludmilla_30`) | She was? (Bond +25); Are you sure it was her? (Bond +50) |

(6 more rows of 36 not shown; see the data table.)

Meet her at this place and time to start the scene; talking costs 1 Heart Clock. Bond choices: +25 small, +50 medium, +100 big. Some days have different scenes depending on her Connection level. "Unlimited" scenes repeat after day 21.

#### Ludmilla's mood by level

The diary line shown at each Connection level.

- She seems more interested in the legend of the walking trail now.
- She seems to be bothered by something.
- She looks at Lumi worriedly.
- She smiles whenever she looks at the bamboo forest.
- She's pleased that the tea leaves she designated carefully have been delivered.
- She is thinking about the fear in Lumi's eyes.
- She smiles as she imagines the days filled with new wishes.
- The fragrance of the flowers from that day will never disappear from her memory.

### Blanc & Noir

Noir and Blanc share some Connection events; group events affect both.

- **Album reward**: Blanc and Noir's Family Relationship Chart ×1
- **Group**: Choices in group scenes give Bond to both sisters

#### Connection levels

| Nikke | Max level | Bond per level |
|---|---|---|
| Noir | 4 | 50 → 50 → 75 → 75 |
| Blanc | 4 | 50 → 50 → 75 → 75 |

Bond needed at each Connection level before the next Connection event appears.

#### Connection events

| Event | Needs | Where / when | Result |
|---|---|---|---|
| story "Time with Noir" (`snowfall_episode_noir_01`); [Noir] | Nothing (first meeting) | From day 8; Bamboo Forest, daytime | [Starts her story]; Costs a Heart Clock |
| story "Time with Blanc" (`snowfall_episode_blanc_01`); [Blanc] | Nothing (first meeting) | From day 9; Hot Spring, daytime | [Starts her story]; Costs a Heart Clock |
| story "Blanc and Noir's Luck" (`snowfall_episode_noirblanc_02`) | Noir: Connection Lv 1 and 50 Bond; Blanc: Connection Lv 1 and 50 Bond; After special event (Blanc and Noir's Lucky Hot Spring) | From day 9; Dormitory, daytime | [Connection Lv up] |
| story "Blanc and Lumi" (`snowfall_episode_blanc_03`); [Blanc] | Blanc: Connection Lv 2 and 50 Bond | From day 9; Walking Trail, night | [Connection Lv up] |
| story "Noir and Lumi: B" (`snowfall_episode_noir_03_e`); [Noir] | Noir: Connection Lv 2 and 50 Bond; Blanc: Connection Lv 3; Find the Rabbit Mask | From day 8; Walking Trail, evening; Lost item story (Noir and Lumi: A → find it → hand it over) | [Connection Lv up] |
| story "One Big Family" (`snowfall_episode_noirblanc_04`) | Noir: Connection Lv 3 and 75 Bond; Blanc: Connection Lv 3 and 75 Bond | From day 9; Dormitory, daytime | [Ending] |
| story "Luck Comes When Three Enter the Hot Spring" (`snowfall_episode_noirblanc_05`) | Noir: Connection Lv 4 and 100 Bond; Blanc: Connection Lv 4 and 100 Bond | From day 9; Hot Spring, daytime | [Hidden ending] |

They appear (heart icon) once the requirements are met, at the given place and time from the given day on.

#### Scenario events

| Day | Where / when | Who | Lv | Scene | Bond choices |
|---|---|---|---|---|---|
| Day 8 | Bamboo Forest, evening | Noir | 1–7 | story "I stumble upon Noir standing alone amongst the bamboo." (`snowfall_speech_noir_02`) | What did you wish for? (Bond Noir +50); I hope whatever you wished for comes true. (Bond Noir +100) |
| Day 9 | Restaurant, evening | Noir | 1–7 | story "I find Noir in the restaurant." (`snowfall_speech_noir_03`) | Sit beside Noir. (Bond Noir +100); Sit across from Noir. (Bond Noir +50); Yes, I heard. (Bond Noir +100); No, I didn't know that. (Bond Noir +50) |
| Day 9 | Waterfall, evening | Blanc | 1–7 | story "I find Blanc at the waterfall." (`snowfall_speech_blanc_01`) | Good things, I hope. (Bond Blanc +50); And I was thinking about you. (Bond Blanc +100) |
| Day 10 | Waterfall, daytime | Blanc | 1–7 | story "I find Blanc at the waterfall." (`snowfall_speech_blanc_02`) | But what if it isn't a prank? (Bond Blanc +50); I've got a bone to pick with her myself. (Bond Blanc +100) |
| Day 10 | Waterfall, evening | Noir | 1–7 | story "I find Noir at the waterfall." (`snowfall_speech_noir_04`) | Just in case, let's look a bit more. (Bond Noir +100); Let's go somewhere else to search. (Bond Noir +50) |
| Day 11 | Bamboo Forest, daytime | Blanc | 1–7 | story "I find Blanc at the bamboo forest." (`snowfall_speech_blanc_03`) | For Noir to be happy forever and ever? (Bond Blanc +100); For all of us to have a nice time at Snowfield Hot Spring? (Bond Blanc +50) |
| Day 11 | Bamboo Forest, evening | Noir | 1–7 | story "I stumble upon Noir standing alone amongst the bamboo." (`snowfall_speech_noir_06`) | How can that be, when you're the personification of luck itself? (Bond Noir +50); I'm sure nothing will happen. (Bond Noir +100) |
| Day 12 | Hot Spring, evening | Blanc | 1–7 | story "I find Blanc at the hot spring." (`snowfall_speech_blanc_04`) | You look even more radiant than usual. (Bond Blanc +100); Something smells absolutely lovely. (Bond Blanc +50) |
| Day 12 | Dormitory, night | Blanc & Noir | 1–7 | story "I find Noir and Blanc in the dormitory." (`snowfall_speech_noirblanc_01`) | What do you call a dead almond? (Bond Noir +50, Blanc +50); I can't think of anything. How about I sing you a lullaby? (Bond Noir +100, Blanc +100) |
| Day 13 | Walking Trail, daytime | Blanc | 1–7 | story "I find Blanc at the walking trail." (`snowfall_speech_blanc_05`) | Is everything ready for the event later? (Bond Blanc +50); What kind of event do you have planned? (Bond Blanc +100) |
| Day 13 | Dormitory, night | Noir | 1–7 | story "I find Noir in the dormitory." (`snowfall_speech_noir_07`) | It was nice. (Bond Noir +100); To be honest, it didn't really live up to my expectations. (Bond Noir +50) |
| Day 14 | Dormitory, daytime | Blanc & Noir | 1 | story "I find Noir and Blanc in the dormitory." (`snowfall_speech_noirblanc_02`) | Maybe it's the comedown from yesterday's big event? (Bond Noir +50, Blanc +50); Maybe because you got too relaxed from a soak in the hot spring? (Bond Noir +100, Blanc +100) |
| Day 14 | Dormitory, daytime | Blanc & Noir | 2–7 | story "I find Noir and Blanc in the dormitory." (`snowfall_speech_noirblanc_03`) | Hold their hands. (Bond Noir +100, Blanc +100); Pat them both on the shoulder. (Bond Noir +50, Blanc +50) |
| Day 14 | Walking Trail, evening | Noir | 1 | story "I find Noir at the walking trail." (`snowfall_speech_noir_08`) | What a cute white bunny! (Bond Noir +50); It's a mini Blanc! (Bond Noir +100) |
| Day 14 | Walking Trail, evening | Noir | 2–7 | story "I find Noir at the walking trail." (`snowfall_speech_noir_09`) | Why don't you get some more rest yourself? (Bond Noir +50); So you decided to head out for a bit after resting? (Bond Noir +100); Achoo! (Bond Noir +50); Don't worry. I'm as fit as a fiddle. (Bond Noir +100) |
| Day 14 | Dormitory, night | Blanc | 1 | story "I find Blanc in the dormitory." (`snowfall_speech_blanc_06`) | First time I've heard of it. (Bond Blanc +50); I've heard of it. (Bond Blanc +100) |
| Day 14 | Dormitory, night | Blanc | 2–7 | story "I find Blanc in the dormitory." (`snowfall_speech_blanc_07`) | First time I've heard of it. (Bond Blanc +50); I've heard of it. (Bond Blanc +100) |
| Day 15 | Dormitory, evening | Noir | 1–7 | story "I find Noir in the dormitory." (`snowfall_speech_noir_10`) | Wake Noir. (Bond Noir +100); Let Noir sleep uninterrupted. (Bond Noir +50) |
| Day 15 | Dormitory, night | Blanc & Noir | 1–7 | story "I find Noir and Blanc in the dormitory." (`snowfall_speech_noirblanc_04`) | What are you two doing? (Bond Noir +50, Blanc +50); Yes, I plan on resting for a while. (Bond Noir +100, Blanc +100) |
| Day 16 | Hot Spring, daytime | Blanc & Noir | 1–7 | story "I find Noir and Blanc at the hot spring." (`snowfall_speech_noirblanc_05`) | Very pretty. (Bond Noir +100, Blanc +100); It's pretty, but it looks like it needs some tidying up. (Bond Noir +50, Blanc +50) |
| Day 16 | Hot Spring, night | Blanc & Noir | 1–7 | story "I find Noir and Blanc at the hot spring." (`snowfall_speech_noirblanc_06`) | What is it? (Bond Noir +100, Blanc +100); This can't possibly be what I think it is. (Bond Noir +50, Blanc +50) |
| Day 17 | Dormitory, daytime | Noir | 1 | story "I find Noir in the dormitory." (`snowfall_speech_noir_11`) | Sorry about that. Let's use the time we have left to talk a little more. (Bond Noir +100); I thought I was paying you the proper amount of attention, but I guess not. (Bond Noir +50) |
| Day 17 | Dormitory, daytime | Noir | 2–3 | story "I find Noir in the dormitory." (`snowfall_speech_noir_12`) | I'll help you both solve this mystery. (Bond Noir +100); I'll figure it out for you. (Bond Noir +50) |
| Day 17 | Dormitory, daytime | Noir | 4 | story "I find Noir in the dormitory." (`snowfall_speech_noir_13`) | That can't be it. (Bond Noir +100); No, but you are scary in another sense. (Bond Noir +50) |
| Day 17 | Dormitory, daytime | Noir | 5–7 | story "I find Noir in the dormitory." (`snowfall_speech_noir_14`) | You weren't thinking of something dirty, were you? (Bond Noir +50); Were you thinking of me? (Bond Noir +100) |
| Day 17 | Dormitory, evening | Blanc & Noir | 1 | story "I find Noir and Blanc in the dormitory." (`snowfall_speech_noirblanc_07`) | I'm supposed to meet you two here. Don't tell me you forgot already. (Bond Noir +50, Blanc +50); I didn't make any plans with anyone. (Bond Noir +100, Blanc +100) |
| Day 17 | Dormitory, evening | Blanc & Noir | 2–3 | story "I find Noir and Blanc in the dormitory." (`snowfall_speech_noirblanc_08`) | Are you still not feeling well? (Bond Noir +100, Blanc +100); Are you getting any better? (Bond Noir +50, Blanc +50) |
| Day 17 | Dormitory, evening | Blanc & Noir | 4 | story "I find Noir and Blanc in the dormitory." (`snowfall_speech_noirblanc_09`) | Maybe Lumi wasn't feeling too good herself? (Bond Noir +100, Blanc +100); Don't worry, it won't always be like this. (Bond Noir +50, Blanc +50) |
| Day 17 | Dormitory, evening | Blanc & Noir | 5–7 | story "I find Noir and Blanc in the dormitory." (`snowfall_speech_noirblanc_10`) | Are we diving back into the family roleplay again? (Bond Noir +50, Blanc +50); Sorry to keep you waiting. (Bond Noir +100, Blanc +100) |
| Day 17 | Bamboo Forest, night | Blanc | 1 | story "I find Blanc at the bamboo forest." (`snowfall_speech_blanc_08`) | I didn't realize you felt that way. (Bond Blanc +50); I'll give you the rest of my time. (Bond Blanc +100) |

(21 more rows of 51 not shown; see the data table.)

Meet her at this place and time to start the scene; talking costs 1 Heart Clock. Bond choices: +25 small, +50 medium, +100 big. Some days have different scenes depending on her Connection level. "Unlimited" scenes repeat after day 21.

#### Noir's mood by level

The diary line shown at each Connection level.

- She seems more interested in Blanc and Snowfield Hot Spring now.
- She is thinking about what happened in the bamboo forest.
- She's worrying whether she's done anything that might've hurt Lumi.
- She seems to have found clues to the legend of the hot spring.
- She's thinking about the meaning of family while blushing.
- She won't forget the day the three of them enjoyed the hot spring together.

#### Blanc's mood by level

The diary line shown at each Connection level.

- She seems more interested in Noir and Snowfield Hot Spring now.
- She is thinking about what happened in the hot spring.
- She's looking for Lumi to figure out the secret of the legend.
- She is thinking about Lena.
- She still looks excited although she's saddened about not being the mom.
- She won't forget the day the three of them enjoyed the hot spring together.

## Story

### Special events

The shared story. Each plays at a fixed place and time and blocks other events there.

| # | Event | When / where | Needs | Unlocks |
|---|---|---|---|---|
| 1 | story "Mass-produced Nikke: Lumi" (`snowfall_global_01`) | Day 3, Dormitory, daytime |  |  |
| 2 | story "Bamboo Forest Open" (`snowfall_global_02`) | Day 4, Bamboo Forest, daytime |  | [Opens Bamboo Forest] |
| 3 | story "The Menu" (`snowfall_global_03`) | Day 5, Restaurant, evening |  | The Menu |
| 4 | story "Mica and Belorta's Fireworks" (`snowfall_global_04`) | Day 6, Waterfall, night |  | Fireworks |
| 5 | story "Hot Spring Open" (`snowfall_global_05`) | Day 7, Hot Spring, daytime |  | [Opens Hot Spring] |
| 6 | story "Snowfield Lighthouse" (`snowfall_global_06`) | Day 9, Walking Trail, night |  | Snowfield Festival |
| 7 | story "Hide and Seek with Belorta" (`snowfall_global_07`) | Day 10, Bamboo Forest, night |  |  |
| 8 | story "The Legend of the Dormitory" (`snowfall_global_08`) | Day 11, Dormitory, night |  | Legend of the Dormitory: Out; Legend of the Dormitory: In |
| 9 | story "Blanc and Noir's Lucky Hot Spring" (`snowfall_global_09`) | Day 13, Hot Spring, evening |  | Lucky Hot Spring |
| 10 | story "Another Miracle: A" (`snowfall_global_10`) | Day 15, Dormitory, daytime |  |  |
| 11 | story "Another Miracle: B" (`snowfall_global_11`) | Day 16, Dormitory, evening |  |  |
| 12 | story "Snowfield Special Date" (`snowfall_global_12`) | Day 18, Dormitory, evening |  | Snowfield Special Date |
| 13 | story "Snowfield Hot Spring Date Alone" (`snowfall_global_solo_13`) | Day 18, Dormitory, night | Chose “... No one comes to mind.” |  |
| 14 | story "Lucky Snowfield Hot Spring Date" (`snowfall_global_noirblanc_13`) | Day 18, Walking Trail, night | Chose “Blanc and Noir.” |  |
| 15 | story "A Hot Date at Snowfield." (`snowfall_global_ludmilla_13`) | Day 18, Bamboo Forest, night | Chose “Ludmilla.” |  |
| 16 | story "A Date with Emma at Snowfield Hot Spring" (`snowfall_global_emma_13`) | Day 18, Hot Spring, night | Chose “Emma.” |  |
| 17 | story "A Date with Mica at Snowfield Hot Spring" (`snowfall_global_mica_13`) | Day 18, Waterfall, night | Chose “Mica.” |  |
| 18 | story "Farewell Party at the Hot Spring" (`snowfall_global_14`) | Day 21, Restaurant, night |  | Farewell Party |
| 19 | story "Snowfall Oasis" (`snowfall_epilogue`) | After the last day |  | Legend of the Bamboo Forest: Out; Legend of the Bamboo Forest: In; The Last Legend: Out; The Last Legend: In |

#### The date invitation

| Choice | Available after |
|---|---|
| Blanc and Noir. | Luck Comes When Three Enter the Hot Spring |
| Mica. | The Stone Skipping Legend |
| Emma. | The Secret of the Waterfall |
| Ludmilla. | Ludmilla: Winter Owner |

In this scene you pick whom to invite; a Nikke can only be picked once you have seen her Hidden ending. The pick decides which date scene follows.

### Day-by-day map

Where each Nikke is at each time, and when special events play. Other characters chat in the empty slots.

#### Day 1

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory |  |  | Mica |
| Waterfall |  |  |  |
| Restaurant |  |  |  |
| Walking Trail |  |  | Emma |
| Hot Spring |  |  |  |
| Bamboo Forest |  |  |  |

#### Day 2

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory |  |  | Mica |
| Waterfall | Mica | Mica |  |
| Restaurant | Emma |  | Emma |
| Walking Trail |  |  |  |
| Hot Spring |  |  |  |
| Bamboo Forest |  |  |  |

#### Day 3

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory | [Mass-produced Nikke: Lumi] |  | Mica |
| Waterfall |  | Mica | Emma |
| Restaurant |  |  |  |
| Walking Trail |  | Emma |  |
| Hot Spring |  |  |  |
| Bamboo Forest |  |  |  |

#### Day 4

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory |  |  |  |
| Waterfall |  | Mica |  |
| Restaurant |  |  |  |
| Walking Trail |  |  |  |
| Hot Spring |  |  |  |
| Bamboo Forest | [Bamboo Forest Open] |  | Emma |

#### Day 5

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory |  |  | Emma |
| Waterfall |  |  |  |
| Restaurant | Mica | [The Menu] |  |
| Walking Trail |  |  | Ludmilla |
| Hot Spring |  |  |  |
| Bamboo Forest | Ludmilla |  |  |

#### Day 6

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory |  |  |  |
| Waterfall |  | Ludmilla | [Mica and Belorta's Fireworks] |
| Restaurant |  |  |  |
| Walking Trail | Mica | Emma |  |
| Hot Spring |  |  |  |
| Bamboo Forest | Ludmilla |  |  |

#### Day 7

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory |  |  | Mica |
| Waterfall |  |  |  |
| Restaurant |  |  | Ludmilla |
| Walking Trail |  | Mica |  |
| Hot Spring | [Hot Spring Open] | Emma | Emma |
| Bamboo Forest |  | Ludmilla |  |

#### Day 8

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory | Emma | Ludmilla |  |
| Waterfall |  |  |  |
| Restaurant |  |  | Emma |
| Walking Trail |  |  | Ludmilla |
| Hot Spring | Mica |  |  |
| Bamboo Forest |  | Noir | Mica |

#### Day 9

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory | Ludmilla |  |  |
| Waterfall | Emma | Blanc |  |
| Restaurant |  | Noir |  |
| Walking Trail |  | Emma | [Snowfield Lighthouse] |
| Hot Spring |  |  |  |
| Bamboo Forest |  |  |  |

#### Day 10

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory | Mica |  |  |
| Waterfall | Blanc | Noir |  |
| Restaurant |  |  |  |
| Walking Trail | Emma |  |  |
| Hot Spring |  |  |  |
| Bamboo Forest |  | Ludmilla | [Hide and Seek with Belorta] |

#### Day 11

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory | Emma | Mica | [The Legend of the Dormitory] |
| Waterfall |  |  |  |
| Restaurant |  |  |  |
| Walking Trail | Ludmilla |  |  |
| Hot Spring |  |  |  |
| Bamboo Forest | Blanc | Noir |  |

#### Day 12

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory | Mica | Ludmilla | Blanc & Noir |
| Waterfall |  | Emma |  |
| Restaurant |  |  |  |
| Walking Trail |  |  |  |
| Hot Spring | Emma | Blanc |  |
| Bamboo Forest | Ludmilla |  |  |

#### Day 13

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory |  |  | Noir |
| Waterfall |  |  |  |
| Restaurant |  |  |  |
| Walking Trail | Blanc |  | Ludmilla |
| Hot Spring | Mica | [Blanc and Noir's Lucky Hot Spring] | Mica |
| Bamboo Forest | Emma |  |  |

#### Day 14

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory | Blanc & Noir | Ludmilla | Blanc |
| Waterfall |  |  |  |
| Restaurant | Emma | Emma | Mica |
| Walking Trail |  | Noir | Ludmilla |
| Hot Spring |  |  |  |
| Bamboo Forest | Ludmilla |  |  |

#### Day 15

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory | [Another Miracle: A] | Noir | Blanc & Noir |
| Waterfall |  |  |  |
| Restaurant |  |  | Emma |
| Walking Trail |  | Ludmilla | Ludmilla |
| Hot Spring |  | Mica |  |
| Bamboo Forest |  | Emma |  |

#### Day 16

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory | Ludmilla | [Another Miracle: B] | Mica |
| Waterfall |  |  |  |
| Restaurant | Mica |  | Emma |
| Walking Trail |  |  |  |
| Hot Spring | Blanc & Noir |  | Blanc & Noir |
| Bamboo Forest |  |  | Ludmilla |

#### Day 17

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory | Noir | Blanc & Noir |  |
| Waterfall |  |  |  |
| Restaurant | Ludmilla |  | Emma |
| Walking Trail |  | Mica | Ludmilla |
| Hot Spring |  |  |  |
| Bamboo Forest |  |  | Blanc |

#### Day 18

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory | Mica | [Snowfield Special Date] | [Snowfield Hot Spring Date Alone] |
| Waterfall |  |  | [A Date with Mica at Snowfield Hot Spring] |
| Restaurant |  |  |  |
| Walking Trail | Blanc & Noir |  | [Lucky Snowfield Hot Spring Date] |
| Hot Spring | Emma |  | [A Date with Emma at Snowfield Hot Spring] |
| Bamboo Forest | Ludmilla |  | [A Hot Date at Snowfield.] |

#### Day 19

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory | Ludmilla | Blanc & Noir |  |
| Waterfall | Emma |  |  |
| Restaurant |  |  |  |
| Walking Trail | Mica |  |  |
| Hot Spring |  |  | Emma |
| Bamboo Forest |  |  | Ludmilla |

#### Day 20

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory | Emma |  |  |
| Waterfall | Mica | Noir | Emma |
| Restaurant |  |  |  |
| Walking Trail |  | Blanc |  |
| Hot Spring |  |  | Blanc & Noir |
| Bamboo Forest |  |  |  |

#### Day 21

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory | Ludmilla | Blanc |  |
| Waterfall |  | Mica |  |
| Restaurant |  | Emma | [Farewell Party at the Hot Spring] |
| Walking Trail |  | Noir |  |
| Hot Spring | Blanc & Noir | Ludmilla |  |
| Bamboo Forest |  |  |  |

#### Unlimited

| Location | Daytime | Evening | Night |
|---|---|---|---|
| Dormitory | Noir | Emma | Blanc |
| Waterfall | Mica |  | Ludmilla |
| Restaurant |  | Blanc | Emma |
| Walking Trail | Ludmilla | Noir |  |
| Hot Spring | Emma | Mica | Noir |
| Bamboo Forest | Blanc | Ludmilla | Mica |

### Lost items

| Item | Hint | For | Description |
|---|---|---|---|
| Flat Stone | Flat Stone - Try looking for it on the walking trail. | Mica (Mica's Savior: B) | A bunch of flat stones perfect for stone skipping. / These stones fit just right even for people with small hands. |
| Red Fruit | Red Fruit - Try looking for it in the restaurant. | Emma (Hot Spring Recipe: B) | A round red fruit. / Looks like it belongs in a salad. |
| Fishing Net | Fishing Net - Try looking for it at the hot spring. | Emma (Emma's Cooking Preparation: B) | An ordinary fishing net. / Looks perfect for catching fish. |
| Pen | Pen - Try looking for it in the dormitory. | Ludmilla (Tainted Wish: B) | A normal pen. Nothing special about it. / The ink is permanent, so use it cautiously. |
| Rabbit Mask | Rabbit Mask - Try looking for it in the dormitory. | Noir (Noir and Lumi: B) | An old rabbit mask. / Looks like something that was used by children in some sort of celebration before. / This should be enough to cover one's face. |

A scene makes the item appear in the event field; find it (the hint says where), then hand it over to unlock the Connection event.

### Album

#### Photo album

- Legend of the Bridge: Out 1 (after The Stone Skipping Legend)
- Legend of the Bridge: Out 2 (after The Stone Skipping Legend)
- Legend of the Bridge: In (after The Stone Skipping Legend)
- Legend of the Waterfall: Out (after The Secret of the Waterfall)
- Legend of the Waterfall: In (after The Secret of the Waterfall)
- Legend of the Walking Trail: Out (after Ludmilla: Winter Owner)
- Legend of the Walking Trail: In (after Ludmilla: Winter Owner)
- Legend of the Hot Spring: Out (after Luck Comes When Three Enter the Hot Spring)
- Legend of the Hot Spring: In (after Luck Comes When Three Enter the Hot Spring)
- The Menu (after The Menu)
- Fireworks (after Mica and Belorta's Fireworks)
- Snowfield Festival (after Snowfield Lighthouse)
- Legend of the Dormitory: Out (after The Legend of the Dormitory)
- Legend of the Dormitory: In (after The Legend of the Dormitory)
- Lucky Hot Spring (after Blanc and Noir's Lucky Hot Spring)
- Snowfield Special Date (after Snowfield Special Date)
- Farewell Party (after Farewell Party at the Hot Spring)
- Legend of the Bamboo Forest: Out (after Snowfall Oasis)
- Legend of the Bamboo Forest: In (after Snowfall Oasis)
- The Last Legend: Out (after Snowfall Oasis)
- The Last Legend: In (after Snowfall Oasis)

#### Story completion rewards

| Nikke | Reward |
|---|---|
| Mica | Mica Rock ×1 |
| Emma | Emma's Recipe Book ×1 |
| Ludmilla | Ludmilla's Lantern ×1 |
| Blanc & Noir | Blanc and Noir's Family Relationship Chart ×1 |

#### Special picture

A shared picture shows each Nikke in three stages: the second after her first Connection event, the third after her Hidden ending.

- **Completing it**: LiveWallpaper 35 ×1

## Data sources

All in `D:\Nikke Datamine\mpkparser\jsons` as `<Table>.json`.

| Table | Rows | Fields |
|---|---|---|
| `EventDatingSimArchiveManagerTable` | 1 | `id`, `event_id`, `exist_manager_id` |
| `EventDatingSimManagerTable` | 1 | `id`, `event_id`, `ui_prefab_keyword`, `event_transition`, `total_day`, `start_date_for_ui`, `stamina_auto_charge_id`, `infinity_mod_active_realtime`, `daily_reward_require_stamina`, `daily_reward_id`, `special_cutscene_prefab`, `special_cutscene_complete_reward_wallpaper_id`, `first_enter_scenario`, `default_dialog_event`, `forced_myroom_return_dialog_event`, `default_myroom_homecoming_dialog_event`, `epilogue_dialog_event` |
| `EventDatingSimHelpMessageTable` | 5 | `id`, `manager_id`, `page_type`, `help_message_type`, `help_message_icon_resource`, `help_message_locale` |
| `EventDatingSimTutorialTable` | 15 | `id`, `manager_id`, `archive_manager_id`, `tutorial_page_group_id`, `tutorial_type`, `tutorial_title_localkey`, `is_opened` |
| `EventDatingSimTutorialPageTable` | 24 | `id`, `group_id`, `manager_id`, `archive_manager_id`, `page_order`, `image_resource`, `page_title_localkey`, `tutorial_localkey` |
| `EventDatingSimAlbumTable` | 3 | `id`, `manager_id`, `order`, `category`, `category_value`, `album_name`, `album_description` |
| `EventDatingSimDialogConditionTable` | 171 | `id`, `manager_id`, `event_portrait_resource`, `dialog_appear_selection_condition_list`, `dialog_event_id`, `is_show_stamina_consume_icon`, `is_turn_off_other_events` |
| `EventDatingSimDialogEventTable` | 397 | `id`, `manager_id`, `order`, `dialog_event_type`, `dialog_type`, `scenario_title_localkey`, `scenario_dialog_id`, `cutscene_image_for_ui`, `spawn_lost_item_id`, `heroine_album_id` |
| `EventDatingSimDialogScheduleTable` | 123 | `id`, `manager_id`, `day`, `location`, `dialog_event_appear_daytime`, `dialog_event_appear_evening`, `dialog_event_appear_night` |
| `EventDatingSimHeroineTable` | 5 | `id`, `manager_id`, `order`, `portrait_resource`, `small_portrait_resource`, `heroine_name`, `max_relation_lv`, `relation_overflow_target_point`, `is_contain_in_group`, `relation_subtitle_lv_0`, `relation_subtitle_lv_list`, `relation_subtitle_lv_max` |
| `EventDatingSimHeroineAlbumTable` | 4 | `id`, `group_id`, `manager_id`, `order`, `is_heroine_group`, `target_heroine_id`, `complete_reward` |
| `EventDatingSimHeroineConditionTable` | 161 | `id`, `manager_id`, `is_heroine_group`, `target_heroine_id`, `event_condition_day`, `event_condition_time`, `event_condition_location`, `event_condition_relation_lv_min`, `event_condition_relation_lv_max`, `dialog_event_id` |
| `EventDatingSimHeroineGroupTable` | 1 | `id`, `manager_id`, `heroine_group_name`, `heroine_group_portrait_resource`, `heroine_group_portrait_small_resource`, `group_icon`, `heroine_id_list`, `is_group_event_relation_lv_list`, `is_group_event_hidden_ending` |
| `EventDatingSimHeroineLVTable` | 10 | `id`, `manager_id`, `relation_level`, `target_relation_point` |
| `EventDatingSimHeroineScheduleTable` | 123 | `id`, `manager_id`, `day`, `location`, `is_heroine_group_daytime`, `heroine_appear_daytime`, `is_heroine_group_evening`, `heroine_appear_evening`, `is_heroine_group_night`, `heroine_appear_night` |
| `EventDatingSimLocationTable` | 6 | `id`, `manager_id`, `index`, `location_name`, `location_resource`, `location_open_dialog_event` |
| `EventDatingSimLostItemTable` | 5 | `id`, `manager_id`, `lost_item_name`, `lost_item_description`, `lost_item_hint`, `lost_item_resource`, `lost_item_field_resource`, `interaction_distance`, `interaction_marker`, `minimap_guide_radius`, `minimap_guide_transform_x_coordinate`, `minimap_guide_transform_y_coordinate` |
| `EventDatingSimMyroomScheduleTable` | 22 | `id`, `manager_id`, `day`, `myroom_event_outing`, `myroom_event_homecoming` |
| `EventDatingSimPhotoAlbumTable` | 21 | `id`, `group_id`, `manager_id`, `order`, `cutscene_resource`, `cutscene_title_localkey`, `unlock_condition_dialog_event` |
| `EventDatingSimRelationConditionTable` | 28 | `id`, `manager_id`, `is_consume_stamina`, `is_heroine_group`, `target_heroine_id`, `relation_appear_heroine_condition_list`, `forced_appear_start_day`, `forced_appear_location`, `forced_appear_time`, `dialog_event_id`, `is_use_lost_item`, `lost_item_id`, `lost_item_occur_dialog_event_id`, `lost_item_require_dialog_event_id`, `relation_result_event_type` |
| `EventDatingSimSelectionEventTable` | 562 | `id`, `manager_id`, `dialog_event_id`, `selection_dialog_group_id`, `selection_dialog_id`, `is_consume_stamina`, `is_use_select_condition`, `select_condition_list`, `selection_event_type`, `selection_event_value_list` |
| `EventDatingSimSpecialCutSceneTable` | 5 | `id`, `manager_id`, `index`, `heroine_resource_step_2_change_condition`, `heroine_resource_step_3_change_condition` |

The viewer also reads: `AutoChargeTable`.

## Uncertain / unknown

The viewer flagged nothing as uncertain. Fields it does not show are listed in Data sources; their meaning is not interpreted.
