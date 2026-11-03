# Fading Affection

Fading Affection is a text-adventure event minigame (internally "Text Adventure Plus"). You pick a route, choose where to go, then read pages and make choices. Choices change your HP, Food and (on some routes) Corruption; running out of HP or maxing Corruption sends you to a bad ending. Bad endings give "Saved Memory" loot items that stay for later runs and unlock safer choices or new areas. There are 265 pages, 35 endings and 45 loot items.

Source: `lib/minigames.js` (buildTextAdventure) reads the `EventTextAdvPlus*` tables in `D:\Nikke Datamine\mpkparser\jsons`; the run rules below are how the site's player (`public/minigames-extra.js`) applies them.

## How to play (in-game help)

- **Fading Affection**: ■ Fading Affection is a choice-based text adventure mini game that allows you to view the records of people caught up in the Silver Gun Project. ■ Press the Initiate Recording button to start the game. ■ You can play as many times as you want.
- **Routes**: ■ Fading Affection has three different routes for you to explore. ■ Each route will be unlocked according to a schedule. ■ Some routes are locked by default. ■ Locked routes will be unlocked at their designated times.
- **Gameplay**: ■ The choices you make in Fading Affection determine the direction of the story. ■ The events that take place will change according to your choices. ■ Some choices can only be unlocked after meeting certain conditions. ■ You can view the conditions needed to unlock a choice via the choice itself. ■ Simply select the choice to get a hint about how to unlock it. ■ If you make a wrong choice, you can press Return to go back to a previous scene. ■ When you return to a previous scene, your previous progress made from choices after that scene is erased.
- **Status**: ■ In Fading Affection, the main character in each record has a status that indicates their current condition. ■ A character's status may play a role in opening up certain directions in the story. ■ This indicates a character's health. ■ HP will increase or decrease depending on the choices you make. ■ When a character's HP reaches 0, they die. ■ This indicates the rations in a character's possession. ■ Food may be required to select certain choices. ■ This indicates the degree to which a character is corrupted. ■ Corruption will increase or decrease depending on the choices you make. ■ If a character's corruption gets too high, they will become fully corrupted.
- **Memories**: ■ Memorable moments experienced by a character will be saved to their NIMPH in the form of memories. ■ Saved memories are the key to unlocking new choices. ■ All saved memories will be recorded in the Memories menu. ■ You can press the Memories icon while playing to view the character's saved memories.
- **Endings**: ■ Your choices will inevitably lead you to an ending in the story. ■ There are multiple types of endings - "Death End," "True End," etc. ■ Try to get all the endings by making different choices. ■ You can view the endings you have already seen in the Recollections menu.

## Stats

From `EventTextAdvPlusManagerTable`:

| Stat | Start | Max | Fields |
|---|---|---|---|
| HP | 10 | 10 | `status_hp_default`, `status_hp_max` |
| Food | 1 | — | `status_food_default` |
| Corruption | per route (`status_erosion_default`) | 100 | `status_erosion_max`; `status_erosion_enter_point` = 50 |

Each choice (`EventTextAdvPlusSelectOptionTable`) has `hp_change`, `food_change`, `erosion_change` and goes to `page_id`. If HP drops to 0 and the option has a `death_page_id`, you go there instead; on a route with Corruption on (`is_erosion_status_on`), reaching the max with an `erosion_page_id` goes there. HP is capped at 10, Food and Corruption at 0 from below. (Uncertain: what `status_erosion_enter_point` 50 does; the site doesn't use it.)

Choices can be locked by `open_condition_type`: LootItem (needs a Saved Memory), Food (needs at least that much food), Ending (needs an ending already cleared); `is_hidden` options only show once their condition is met. Starting areas (`EventTextAdvPlusFirstSelectTable`) can need an item (`item_condition`) or an ending (`ending_condition`).

## Routes

From `EventTextAdvPlusRouteTable`.

| Route | Corruption on | Unlock | Starting areas | Endings | Progress rewards |
|---|---|---|---|---|---|
| Maria's Record | no | open | 2 | 15 | 11 |
| Marian's Record | yes (starts 0) | Date 2026-11-04 | 3 | 18 | 14 |
| No. 7's Record | no | Date 2026-11-11 | 1 | 2 | 2 |

## Endings

Page fields `ending_type`, `ending_num`, `ending_sub_title_localkey`, `ending_hint_localkey` in `EventTextAdvPlusEventPageTable`. Counts: Death 24, Corruption 6, True ending 3, Hidden 2.

### Maria's Record

| Ending | Title | Hint |
|---|---|---|
| Death 1 | The Consequence of Carelessness | Never let your guard down on the surface. |
| Death 2 | A Hunter's Room | Watch your surroundings when entering dark areas. |
| Death 3 | Like a Thief in the... Day | Avoid moving around when Raptures are also on the move. |
| Death 4 | More Than Meets the Eye | Make sure to properly assess the enemy's numbers before attacking. |
| Death 5 | Nowhere to Hide | There's nowhere to take cover in the middle of a large road. |
| Death 6 | Stamina Limit | Managing your stamina is essential. |
| Death 7 | Out of Range | Make sure you know your weapon's effective range. |
| Death 8 | Beware After Dark | Find somewhere to set up camp before nightfall. |
| Death 9 | Choose Your Real Estate Carefully | Choose your shelter carefully, even when in a hurry. |
| Death 10 | The Shot Heard Round the Surface | If you fire a gun when you're hiding, you're no longer hiding! |
| Death 11 | The Collapse of Life | Find a moment when life shines. |
| Death 12 | The Soaring Bird | Perhaps there are more than two options that will lead you forward. |
| Corruption 13 | I H■v■ t■ ■il■ ■t? | Beware of the Black Smith's tentacles. |
| True ending 14 | We Share the Same Fate |  |
| Hidden 15 | The Butterfly Breaks Free |  |

### Marian's Record

| Ending | Title | Hint |
|---|---|---|
| Death 16 | Be Right Back? | Retrace Maria's memories. |
| Death 17 | Overreaction | Overreacting does not always turn out well. |
| Death 18 | What's the Farthest You've Ever Run? | Blindly running will only draw unwanted attention. |
| Death 19 | You Can't Have Her | You have to move quickly if you're going to shake off your pursuer. |
| Death 20 | The Consequence of Starvation | Rest and eat whenever you can. |
| Death 21 | Beware of Electricity | Hiding without a plan isn't always the best choice. |
| Death 22 | A Fulfilling Sacrifice | The experiences you gain from death after death will be your key to victory. |
| Death 23 | Watch Your Feet | A typical window cannot hold a Nikke's weight. |
| Death 24 | Are You Here on a Stroll? | You have to give it everything you've got to succeed! |
| Death 25 | Endless Questions | Remember those nagging feelings you had during your time with the Commander. |
| Death 26 | Goodbye For Now | May you be able to make a different choice the next time you try. |
| Corruption 27 | W■ ■ho■l■ ■o? | The chances of getting corrupted increase as time passes. |
| Corruption 28 | I H■v■ ■o G■? | Once corrupted, Marian is able to send out a calling signal. |
| Corruption 29 | L■t ■■ o■ ■e? | Fleeing isn't always the best choice. |
| Corruption 30 | P■ea■■ ■ov■? | Recall your past failures. |
| Corruption 31 | I'■ ■o■■g? | It's time to start again. |
| True ending 32 | Building a Dream Together |  |
| Hidden 33 | Two's a Crowd |  |

### No. 7's Record

| Ending | Title | Hint |
|---|---|---|
| Death 34 | Lost Memories | Try to retrace your memories of Marian. |
| True ending 35 | Goodbye, My... |  |

## Loot items (Saved Memories)

Pages with `get_loot_item_id` give the item. 45 items.

| Item | Route | Description |
|---|---|---|
| Saved Memory: Rapture Attack | Maria's Record | I can't let my guard down on the surface. There's no telling how or when a Raptures might attack. I'll have to be more cautious next time. |
| Saved Memory: Trap | Maria's Record | There was a crossbow trap inside the convenience store storeroom, and beneath it, I think I saw a cat and the silhouette of whoever set it up... Next time I go inside, I'll have to be mindful of the trap. |
| Saved Memory: Patrol Time | Maria's Record | I was in such a hurry that I didn't realize there were aerial-type Raptures patrolling as well. No matter how much of a rush I'm in, trying to push forward while Raptures are patrolling seems like a bad idea. Next time, I should head out at a different time. |
| Saved Memory: Pack Behavior | Maria's Record | Ground-type Raptures aren't the only ones patrolling. There were some aerial types that came by afterwards. Next time, I'll need to find a way to take on both types of Raptures. |
| Saved Memory: The Large Road | Maria's Record | There's nowhere to take cover in the middle of that large road. Choosing to fight head-on was reckless. Next time, I shouldn't fight them there without a plan. |
| Saved Memory: Stamina Management | Maria's Record | Continuing to sprint just because there was nowhere to take cover was never going to end well. And here I thought Nikkes had infinite stamina... I'm not sure there's anything I can do about the mental exhaustion, though. Next time, I'll have to keep an eye on my stamina while I'm on the move. |
| Saved Memory: Range of Fire | Maria's Record | What was I thinking? I can't believe I tried to snipe a target with no consideration for my gun's range... I must've really been in a hurry. It's honestly a little embarrassing. Next time, I'll at least check how far my gun can shoot before opening fire. |
| Saved Memory: Collapsing Ceiling | Maria's Record | I rushed. I was in far too much a hurry. Why was I so scared and anxious? I don't remember... Regardless, I shouldn't just dash into some random building next time. Shelter always needs to be chosen carefully, no matter what kind of hurry you're in. It's where you have to spend the night, after all. |
| Saved Memory: Gunshot | Maria's Record | In the end... I couldn't bring myself to choose my own demise. It's not a decision that can be made lightly. Death is... a truly terrifying thing. |
| Saved Memory: The Hunter | Maria's Record | I read what the hunter wrote in the storeroom of the convenience store. Why did someone with such a strong will to live choose to die by overdosing on sleeping pills? Because they were alone? ... Will I also become like that someday? |
| Saved Memory: The Cat | Maria's Record | I saw a cat in the storeroom of the convenience store. When I offered it some of my rations, it gobbled it right up. It must've been really hungry. Once it finished eating, it was like life had returned to its eyes. It was really beautiful. It rubbed affectionately against my legs as if to thank me, almost like it was sharing its warmth. I really liked it. Life can be so radiant and warm. |
| Saved Memory: The Black Smith | Maria's Record | The Black Smith was roaming the residential neighborhood. It whipped around its tentacles almost silently in the darkness and dragged me away before I could even react. It's dangerous. Far too dangerous... I need to be careful in the old downtown district after dark. |
| Saved Memory: The Warmth of Life | Maria's Record | I was so scared and anxious. Life felt completely meaningless. But just when I was about to give up, that cat showed me the warmth that life still had to offer. It was as if the cat were telling me that my life had meaning, too. The life I had saved ended up saving me in return. It turns out there's still meaning in this unending loop of a life. So... I'm not going to give up. I'm going to keep moving forward, just a little further. |
| Saved Memory: Trail | Maria's Record | The little side road behind the residential neighborhood leads to a trail that reaches the lake, which means there's a way to get to the lake without taking that large road after all. How did the cat know about that trail? If I ever see it again, I'd like to thank it properly... I wonder if I'll ever get the chance. |
| Saved Memory: The End of the Large Road | Maria's Record | There was a huge hole at the end of the road, blocking the way to the lake. There's no point in taking this path anymore. |
| Saved Memory: Raptures by the Lake | Maria's Record | There was a Black Smith near the lake, too. Had it always been there? Or did the one from the old downtown district follow me? Whatever the case, it's dangerous. I never thought I'd have to see one again once I got out of the old downtown district. How am I supposed to evade it and run away with the lake there? ... How many times will I have to die and come back this time? |
| Deleted Memory: The Repository | Maria's Record | This must be a memory of her being devoured by the Black Smith. She was broken down and melted... It's horrific... ... I'm going to erase this. The fear and the trauma will be too much for her. |
| Deleted Memory: Fall | Maria's Record | She chose to take her own life on the surface... Why doesn't her fear disappear? What am I doing wrong? ... I'll erase this. I'll erase it, and we'll start again. |
| Deleted Memory: Freedom | Maria's Record | This is a memory of her... envying a bird in flight. She wanted to be free. At the time, she must've felt like a bird in a cage... ... I should erase this. Those sorts of feelings will only interfere with her mission. Once she starts yearning for freedom, she'll only keep wanting to escape from this place. Heh. That's so... cruel. I'm just another cruel cage for her. |
| Deleted Memory: Betrayal | Maria's Record | She said she'd betrayed me, calling her brief desire to stray a betrayal. Just the tiniest show of self-interest, and she calls it a betrayal. What a kind, poor soul... ... I know that, and yet I'm still erasing this memory... I'm the one betraying you, not the other way around. ... I'm sorry. I'm so sorry, Maria. |
| Saved Memory: The Importance of Memories | Marian's Record | I'm sure my memories from my time as Maria, back before I was called Marian, have meaning too. They're what brought me this far, after all. |
| Saved Memory: Hypervigilance | Marian's Record | I overreacted because I thought I had to protect the Commander. I opened fire without even checking whether it was a deer or a Rapture. And because of that, the Commander died shielding me. ... This can never happen again. I'll make sure to confirm my target before pulling the trigger next time. |
| Saved Memory: The Commander's Stamina | Marian's Record | It may sound obvious, but the Commander is human, which makes him different from a Nikke. He needs food and rest, or else he's bound to run out of stamina. I failed to consider that. Next time, I need to be more considerate of his needs. |
| Saved Memory: Sacrifice | Marian's Record | The Commander shielded me from the Black Smith... He threw himself in front of me so I wouldn't die. As if I deserve that. As if I won't just come back anyway, no matter how many times I die. Why would he do that...? I can't keep letting him sacrifice himself like that. I can't keep letting him die in agony. |
| Saved Memory: Electrocution | Marian's Record | I was so focused on running from the Black Smith that I didn't even notice the building was flooded, or that the water was electrified. But even if we managed to hide, it's not like we could stay in there forever. Hiding isn't how I protect the Commander in the long term. I'll try to fight back next time, no matter how scary it may be. If that's what it takes to protect him, I think I can do it. |
| Saved Memory: Priorities | Marian's Record | Being melted inside Black Smith was horribly painful. And yet, the weird thing is... I was satisfied just knowing that I'd saved the Commander. Death used to terrify me, but now I think I'm more afraid of seeing him die. |
| Saved Memory: Shattered Window | Marian's Record | Today I learned that the windows on that building can't support a Nikke's weight. I still can't believe I fell through one right in front of the Commander... For some reason, I'm kind of embarrassed. To look at it another way, though, now we know we can break those windows. I wonder if we could use that against the Black Smith somehow. |
| Saved Memory: Timing | Marian's Record | I was being too cautious because I was afraid of falling through one of the windows. But this is a Black Smith we're up against; if I keep underestimating it like that, we'll never be able to defeat it. I have to focus and give this fight everything I've got in order to protect the Commander. |
| Saved Memory: A Nagging Feeling | Marian's Record | Something feels strangely familiar about this place, and about what the Commander said and did. If something meaningful happened here, I should be able to remember... I'd have those memories. What am I forgetting? What is this nagging feeling? I can't recall any of it right now, but I have to get myself to remember. I have to. I can't shake this feeling that it's important. |
| Saved Memory: Building a Dream Together | Marian's Record | There's nothing I can do right now about this terrible corruption, or this mission. All we can do is the best with what we have. So I'm going to complete this mission however I can, and choose to believe that things will turn out all right, just like how the Commander extended his hand to me when we were struggling with our false purpose. And I'm going to dream of a future, one where I can live by his side once all this is over. As long as I have that dream, as long as there's still hope that it might come true... I can keep going, even through this hell. |
| Saved Memory: Company | Marian's Record | That was kind of surreal. I would've died for sure if I had been alone, but I was able to escape certain death simply because there was someone else here. Just having someone by my side opened up a new possibility that hadn't been there before. ... It's weird to think about. |
| Saved Memory: A Happy Life | Marian's Record | He said that we could be happy, that all this suffering would end someday and we could finally be happy. I know there's no way that's possible... That truth has been pounded into me again and again as I've died more times than I can count. And yet... oddly enough, I still want to believe him. |
| Saved Memory: A Look of Fear | Marian's Record | The Commander looked at me and was scared. It was only for a split second, but I'm sure there was fear in his eyes. Why, though? I've never done anything that would make him afraid of me... ... At least, I don't think I have. Maybe there's something wrong with my memory. What if I've been doing something bad without even realizing it? He wouldn't look at me like that for no reason. That's not who he is. He's kind. |
| Saved Memory: Walking Together | Marian's Record | I'm sure he was afraid of me, so then why did he reach his hand out again? As if it was the most natural thing in the world, just like the first time we held hands. After everything that's happened, after all the frightening things he's been through, he still reached out without hesitation. His hand is so warm whenever I hold it. It makes me feel like everything I've been so anxious about will turn out all right, almost like the warmth from his hand enters into my heart... As long as the Commander is by my side, I feel like everything will be okay. |
| Saved Memory: Shared Scenery | Marian's Record | The lake was as beautiful as ever. That beauty used to make my life feel even more hopeless by contrast, but with the Commander by my side, I could finally enjoy it. It no longer felt so sad, lonely, or hopeless. All I could think about was how much I wanted to see this shimmering scenery with him again. |
| Saved Memory: Concerned Eyes | Marian's Record | What did he mean by "still okay"? Was the Commander waiting for something to happen? Did he mean something would change at some point? He was looking at me when he said it... Does that mean there's something about me that changes? There's so much that I don't understand, but I can't bring myself to ask... His eyes were so full of warmth and concern when he looked at me. I'm afraid that warmth will disappear... |
| Saved Memory: Shared Meal | Marian's Record | The Commander didn't have to share his food with me. I'm a Nikke. And yet he still offered me some, saying that food tastes better when you share it with someone else. I know he was only saying that so he could give me half, but it really did taste better than when I'd eaten alone. The ingredients and everything were the same as before, but somehow, just eating it together with him made it taste better. It's so odd how that works. Now that I've experienced it... will I ever be able to eat alone again, without the Commander by my side? |
| Saved Memory: End of the Forest | Marian's Record | There was a huge crevice at the end of the forest north of the lake, blocking the way forward. There's no point in trying to take this path to get to the industrial complex anymore. |
| Saved Memory: Frantic Behavior | Marian's Record | The Commander wasn't acting like himself. He was in a hurry, like he was being chased. It almost seemed like he was trying to protect me from something... I vaguely remember being struck by Black Smith's tentacle the last time, when we were searching for another building to hide in. Did something happen to me then? Why can't I remember what happened next? What happened to the Commander after that? |
| Saved Memory: A Future Together | Marian's Record | The Commander wants to protect me, and I want to protect him. In this terrifying place, we're both just relieved to have each other. I can't believe we feel the same way...! ... It makes me so happy. I want to find ways to become even happier with him by my side, with this person who shines with such warmth... I want us to have a happy future together. |
| Saved Memory: Cooperation | Marian's Record | The Commander asked to go down the building with me, saying he was afraid to wait alone, but I knew he was lying. He came with me because he was worried about me, worried that I'd feel lonely or scared. How is he so kind and caring? I never knew fighting by his side could make me this happy. I feel a warmth spreading through my heart. |
| Saved Memory: Revenge | Marian's Record | We finally defeated the Black Smith, the monster that claimed the lives of countless Marias, Marians, and Commanders. Our victory could never make up for all those lives lost, but I think we were at least able to exact a small measure of revenge. And the fact that we defeated it together makes me happier than words can express. |
| Saved Memory: A Life that Shines | Marian's Record | You told me you'd only made it this far because you had me by you side. Whenever I hear your kind words and meet your warm gaze, even my once-worthless life seems to shine brilliantly. You makes me feel like I'm worthy of love. You turn me into the most precious person in the world. How could I not fall in love with someone like you? |
| Saved Memory: The Truth | Marian's Record | I've been... killing the Commander. I become corrupted and then kill him. How could he look at me with such tender eyes? Did he really mean it when he said he wanted a future with me? I want to ask him, but I'm not sure if I have the right to... I'm sorry, Commander. I'm so, so sorry. |
| Fragmented Memory: C■■m■■d■■ | Marian's Record | Wh■t sh■■ld ■e do f■■st o■c■ w■ g■■ t■■re? M■■be fi■d so■■w■e■■ t■ ■et up ba■e? I h■p■ w■ ■■n'■ ha■■ to ■■c■ a■o■■er B■■c■ S■■th, o■ an■■hi■■ l■■e t■a■. ■t m■■ht ■e s■a■■ to fi■d a p■■■e ■e ca■ u■e a■ a t■■p ■■rst. O■ m■■b■ ■ec■■■ s■■e fo■d... Ho■■f■l■y ■he■■'s so■■whe■■ ■e c■n re■■ e■sy, ■■en j■■■ a li■■■e b■t. ■e w■■t t■r■■gh s■ ■uch th■■ t■■e. W■■t do y■■ think, Marian? Oh. I■'s al■■■■y ti■■... Y■u'■■ go■■g t■ ■o, e■■n i■ I ■■k y■■ n■t t■, a■■n't yo■? ■■'s ■k■y. I'll b■ o■a■... So d■■'t c■■, ■ll r■g■■? ■ou'■e s■i■■ i■ ■h■■e, ev■n n■■. Th■■'s ■■l I ■■ed t■ k■■w. T■■ ■nly t■■n■ ■h■t m■t■■■s is ■■a■ i■'s ■■il■ y■u, Ma■■an. I p■■mis■ ■■ s■■r■ ■■vi■g fas■■r... ■o n■■t t■me... Let's go together. |

## Route progress rewards

From `EventTextAdvPlusProgressRewardTable` (`reward_goal` %, `reward_id`).

### Maria's Record

| Progress | Reward |
|---|---|
| 6% | Advanced Recruit Voucher ×1 |
| 20% | Central Government Supply Chest I ×10 |
| 26% | Skill Manual Box ×5 |
| 33% | Attacker Common Console ×30 |
| 46% | Advanced Recruit Voucher ×2 |
| 53% | Elysion Common Console ×30 |
| 60% | Ultra-Double Boost Module ×15 |
| 73% | Advanced Recruit Voucher ×2 |
| 80% | Burst Manual Box ×5 |
| 86% | Tetra Common Console ×30 |
| 100% | FADING AFFECTION Special Sticker I ×1 |

### Marian's Record

| Progress | Reward |
|---|---|
| 5% | Advanced Recruit Voucher ×1 |
| 11% | Missilis Common Console ×30 |
| 16% | Central Government Supply Chest I ×10 |
| 27% | Skill Manual Box ×5 |
| 33% | Advanced Recruit Voucher ×2 |
| 38% | Defender Common Console ×30 |
| 50% | FADING AFFECTION Premium Sticker I ×1 |
| 55% | Advanced Recruit Voucher ×2 |
| 61% | Pilgrim Common Console ×30 |
| 72% | Ultra-Double Boost Module ×15 |
| 77% | Burst Manual Box ×5 |
| 83% | Advanced Recruit Voucher ×2 |
| 88% | Supporter Common Console ×30 |
| 100% | FADING AFFECTION Premium Sticker II ×1 |

### No. 7's Record

| Progress | Reward |
|---|---|
| 50% | Advanced Recruit Voucher ×3 |
| 100% | Frame 62 ×1 |

## Data sources

| Table | Used for |
|---|---|
| `EventTextAdvPlusManagerTable` | stats (see above), `first_enter_scenario_group_id` (intro), `minigame_help_tip_id` |
| `EventTextAdvPlusRouteTable` | `route_name_localkey`, `route_description_localkey`, `route_unlock_type`/`route_unlock_value`, `is_erosion_status_on`, `status_erosion_default`, `route_order` |
| `EventTextAdvPlusFirstSelectTable` | starting areas: `first_select_localkey`, `next_page_id`, `item_condition`, `ending_condition` |
| `EventTextAdvPlusEventPageTable` | pages: `page_type` (SelectPage / ResultPage / EndingPage), `scenario_localkey`, `next_page_id`, `is_go_to_first_select_page`, `get_loot_item_id`, `resource_name` (picture), `play_bgm`, ending fields, `select_option_group_id` |
| `EventTextAdvPlusSelectOptionTable` | choices (see Stats) |
| `EventTextAdvPlusProgressRewardTable` | progress rewards |
| `EventTextAdvPlusLootItemTable` | item name, description, icon, route |

## Uncertain / unknown

- How route progress % is computed in game (the data gives only the goals).
- `status_erosion_enter_point`.
- The death/corruption page rule order is the site's reading of the fields.
