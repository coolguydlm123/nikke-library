# Tracing the Stars

Tracing the Stars (TTS) is NIKKE's rhythm minigame: you play songs (82 listed songs in 7 albums) to help the idol group T.T. STAR practise. Each song has four difficulties (Casual, Normal, Hard, Expert). Scores earn a grade (S+ to F) and a rating; missions give BGM tracks, titles and other rewards, and cosmetic skins change the stage, characters and notes.

Source: `lib/minigames.js` in the Nikke Library reads the `EventTTS*` tables in `D:\Nikke Datamine\mpkparser\jsons`. Facts below come from that code and data.

- Intro story: "Tracing the Stars" (`d_contents_tracingthestars_01`)

## How to play (in-game help)

- **TRACING THE STARS**: TRACING THE STARS is a mini game where you play through songs to help T.T. STAR practice performing.
- **Play Data - Profile**: ■ You can view your play data and overall ranking in the top part of the screen. ■ Tap to see details about your achievements in TRACING THE STARS. ■ In the Profile tab, you can view the following information: Profile □ The ranking distribution for your server □ Your total score - Calculated as the sum of your highest scores from all difficulties for each song. □ Your total play time □ The clear status for each difficulty □ Your total play count □ Your average score - Calculated by adding your highest scores for each difficulty and converting them into an average based on 1,000,000 points. Profile □ View the top ten songs you have played the most. □ View the play count for each song. Profile □ View a graph that shows your highest rank for each song by difficulty.
- **Play Data - Overall Rankings**: ■ In the Overall Rankings tab, you can view the following information: Overall Rankings □ Check your ranking among your friends or within your Union.
- **Main Menu**: Main Menu □ The main menu for the mini game TRACING THE STARS. □ Provides access to the Help, Recollections, Settings, and Missions menus. Help □ View the tutorial and other detailed information for TRACING THE STARS. Recollections □ Rewatch any scene you have already viewed in TRACING THE STARS. Settings □ Configure different settings for TRACING THE STARS. Missions □ View the available missions in TRACING THE STARS. □ If any mission is time-limited, the remaining time will be displayed.
- **Main Menu - Settings**: Settings □ Configure different settings for TRACING THE STARS. □ Settings are largely divided into three categories: Gameplay, General, and Controls. Settings - Gameplay □ Configure the following gameplay-related settings: □ Speed Settings - Adjust the speed for when playing through a song. □ Timing Calibration - Fine-tune the timing for your inputs when playing through a song. - You can also press the Set button to calibrate the timing directly. □ Set Speed Before Game - Decide whether to show the speed setting window before starting the game. □ Sort Order - Adjust the sorting order for the song list. □ Landscape Mode - Choose whether to play in portrait or landscape mode. Settings - General □ In this menu, you can configure audio and graphics settings. - You can adjust the overall volume, as well as the volume for the music, sound effects, tap sound, and voices. - You can also toggle in-game video playback and adjust the background brightness. Settings - Controls □ This setting only appears when playing on PC, and allows you to create or select key presets for each lane during the performance.
- **Song List**: Song List □ Displays all songs that can be played in TRACING THE STARS. □ You can scroll through the list and tap/click on an entry directly to choose a song. □ On PC, you can scroll with the up and down arrow keys. - The Page Up and Page Down keys can be used to quickly scroll past multiple songs at a time. - You can also press a letter key to scroll to a song starting with that letter. Song List - Select Song □ Tap the selected song's cover art in the song list to go to the ready screen. □ The chosen song is displayed together with the following information: □ Clear Medals - Displays medals as cross-shaped star icons that reflect your performance on the song. □ Difficulty - Displays the song's difficulty. - You can tap on a difficulty to select it. - On PC, use the left and right arrow keys to change the difficulty. - You can also change the selected difficulty on the ready screen. Song List - Sort □ Use the sort feature at the bottom right of the song list to sort in the desired order. □ On PC, press the left Shift key to quickly change the sort order. □ Default - The default sort order in TRACING THE STARS. □ Name - Sorts alphabetically by name. □ Difficulty - Sorts by difficulty from hardest to easiest. □ Clear - Sorts by the results you've achieved from highest to lowest. - The sort order is All Perfect - Full Combo - Cleared - Uncleared.
- **Ready Screen**: Ready Screen □ This screen appears when you select a song from the song list. □ Before starting the game, you can choose a difficulty or view your ranking based on your play results. Ready Screen - Music Rank □ Accessible from the ready screen by tapping the Music Rank area. □ Here you can view your ranking among your friends / Union, as well as view your ranking on the current server for each difficulty. Ready Screen - Speed Option □ If the Set Speed Before Game setting is turned on, you can adjust the speed before starting the game. □ If you no longer need to change the speed, you can disable this prompt in Settings - Game Play.
- **Play Screen**: Play Screen □ Basic information is displayed in the top part of the screen, including the current song you're playing and your score. □ The play area takes up the middle to lower parts of the screen. Play Screen - Upper HUD □ When playing a song, the upper HUD shows the following: □ Now Playing - Information about the song you're playing is shown on the left. □ Score & Rank - Your current score and rank are shown in the center. □ Current Speed & Pause - The current speed setting is shown on the right. - On PC, press F1/F2 to increase/decrease the speed in 0.1 increments. - You can also open the pause menu to adjust the speed setting, exit to the music list, or restart the song. Play Screen - Play Area □ This is where you can see the four note lines, the target zone, and your current combo. □ Play in sync with the falling notes. Play Screen - T.T. STAR □ Here, you can view T.T. STAR members dancing to the music. □ They are adorable.
- **Results Screen**: Results Screen □ After the song ends, you can view your results based on how well you did. □ Info such as your final score, your rank based on your score, and your accuracy is displayed on this screen. Results Screen - Rank □ Your rank based on your final score is displayed here. □ From highest to lowest, the ranks are S+, S, A, B, C, and F. They are divided as follows, based on a standard of 1,000,000 points: □ S+ 100% or higher of the standard score. □ S 95% or higher of the standard score. □ A 90% or higher of the standard score. □ B 80% or higher of the standard score. □ C 70% or higher of the standard score. □ F Less than 70% of the standard score. Results Screen - Final Score □ Your final score will be displayed here. □ Indicators will also be shown when you set a new record, or finished with a Full Combo or All Perfect. Results Screen - Performance Record □ Your accuracy/number of notes hit and combo are displayed here.
- **Decorating the Stage in T.T.S.**: T.T.S. Stage Decoration Overview □ You can customize the different elements of the T.T.S. stage. □ Skins enable you to change the appearance of the background, characters, and notes. Background Skins □ Enable you to change the appearance of the background and gears. □ The background, gears, and selection effects all get changed together. Character Skins □ Enable you to change the appearance of the characters in the upper part of the screen. □ Each of the three slots can be changed to a different character. □ The same character cannot be assigned to more than one slot. □ All slots must be filled in order to save changes. Note Skins □ Enable you to change the appearance of normal notes and SP notes. □ The shapes and effects of the notes all get changed together. Preview □ Enables you to view the current background, characters, and notes in action. □ An autoplay screen will show the current skin settings in an environment identical to actual gameplay.
- **PC Shortcuts**: Song List Shortcuts - Changing the Sort Order □ Shift: Changes the sort order of the song list. □ Alt: Opens the sort order menu. - Changing Album Packages □ Tab: Opens the package selection menu. - Press the key again to open the song list for the selected package. - Quick List Navigation □ Page Up: Moves up four songs. □ Page Down: Moves down four songs. - Other Menus □ F1: Displays the help menu. □ F2: Displays your profile. □ F3: Displays your rating info. □ F4: Displays the Overall Rankings tab in your profile. □ F9: Takes you to the shop. □ F10: Displays the story album for TRACING THE STARS. □ F11: Displays the settings menu. □ F12: Displays the mission list. Ready Screen Shortcuts - Rankings □ F5: Displays rankings for the current song. Play Screen Shortcuts □ ESC: Opens the pause menu. □ F1: Decreases the current speed by x0.1. □ F2: Increases the current speed by x0.1. □ F3: Decreases the background video opacity by 10. □ F4: Increases the background video opacity by 10. □ F5: Restarts the current song from the beginning.

## Rules from the data

- **Note speed options**: 300 / 450 / 600 (`EventTTSManagerTable.lane_speed_option_value`; unit not stated in the data).
- **Level ranges**: Casual 1–5, Normal 4–11, Hard 7–15, Expert 10–19 (`<difficulty>_level` in `EventTTSSongManagerTable`).
- **Ratio**: each difficulty also has a ratio (`casual_ratio`, `normal_ratio`, `hard_ratio`, `expert_ratio`), e.g. Be My Star: 20 / 50 / 100 / 150.
- **Max score**: per song and difficulty in `EventTTSMaxScoreTable` (`song_id`, `pattern_type`, `max_score`), just over 1,000,000 (e.g. Be My Star Expert 1,001,333).
- **Unlock**: a song can need a play count (`unlock_condition_playcount`) or a date (`unlock_condition_date`); `show_list` hides songs from the list.

## Grades and rating

From `EventTTSRankCalcSettingsTable` (`desc` grade, `min`/`max` score, `calc_value_a`/`calc_value_b` stored as raw 64-bit double bits):

| Grade | Score from | Score to | a | b |
|---|---|---|---|---|
| S+ | 1,000,000 | (song max) | 2 | 3 |
| S | 950,000 | 999,999 | 1.5 | 2 |
| A | 900,000 | 949,999 | 1 | 1.5 |
| B | 800,000 | 899,999 | 0.5 | 1 |
| C | 700,000 | 799,999 | 0 | 0.5 |
| F | 0 | 699,999 | -2 | 0 |

Rating = base + a + (b − a) × (score − min) / (max − min), where for S+ the max is the song's max score. The code comment in `lib/minigames.js` names the base "level"; the site's song page uses ratio ÷ 10 as the base when a ratio exists (ratio 150 → 15.0). (Uncertain: which of the two the game uses; the data only gives the bands.)

The help text says the total score is the sum of your best scores over all difficulties of all songs, and the average score is those bests converted to a 1,000,000-point average.

## Albums

From `EventTTSSongGroupManagerTable` (`name_locale`, `release_date`, `group_image_resource` cover); paid packs are in `TTSAlbumShopTable` (`song_group_id`, `name_localkey`).

| Album | Songs | Release | Access |
|---|---|---|---|
| TRACING THE STARS | 28 | launch | included |
| T.T.S. EXTENSION PACK V.1 | 9 | 2026-05-14 | paid pack |
| T.T.S. SUMMER PACK V.1 | 9 | 2026-07-02 | paid pack |
| T.T.S. EXTENSION PACK V.2 | 9 | 2026-08-13 | paid pack |
| T.T.S. TETRA ENTERTAINMENT PACK V.1 | 9 | 2026-10-08 | paid pack |
| T.T.S. STELLAR BLADE PACK V.1 | 9 | 2026-10-28 | paid pack |
| T.T.S. STELLAR BLADE PACK V.2 | 9 | 2026-10-28 | paid pack |

## Songs

| Song | Artist | Album | Casual (lv / ratio) | Normal (lv / ratio) | Hard (lv / ratio) | Expert (lv / ratio) | Unlock |
|---|---|---|---|---|---|---|---|
| Be My Star | T.T. STAR | TRACING THE STARS | 2 / 20 | 5 / 50 | 10 / 100 | 15 / 150 | start |
| All Eyes On Me | T.T. STAR | TRACING THE STARS | 3 / 30 | 7 / 70 | 11 / 110 | 16 / 160 | start |
| Accelerate | T.T. STAR | TRACING THE STARS | 3 / 30 | 7 / 70 | 10 / 100 | 13 / 130 | start |
| Clickbait | T.T. STAR | TRACING THE STARS | 2 / 20 | 6 / 60 | 9 / 90 | 13 / 130 | start |
| Satellites | NieN (feat. AmaLee) | TRACING THE STARS | 1 / 10 | 5 / 50 | 7 / 70 | 11 / 110 | start |
| THE REDHOOD | Djerv, Cosmograph, NieN | TRACING THE STARS | 2 / 20 | 7 / 70 | 12 / 120 | 16 / 160 | start |
| The Clarion Call | Cosmograph (feat. Pernelle) | TRACING THE STARS | 3 / 30 | 8 / 80 | 11 / 110 | 14 / 140 | start |
| Unbreakable | Cosmograph (feat. Yurisa) | TRACING THE STARS | 3 / 30 | 8 / 80 | 11 / 110 | 15 / 150 | start |
| Unbreakable Sphere | Cosmograph (feat. Sunnie) | TRACING THE STARS | 2 / 20 | 5 / 50 | 9 / 90 | 14 / 140 | start |
| WE RISE | Cosmograph, NieN, OYHN | TRACING THE STARS | 3 / 30 | 5 / 50 | 9 / 90 | 13 / 130 | after 4 plays |
| Artificial Shangri-La | Cosmograph | TRACING THE STARS | 2 / 20 | 6 / 60 | 10 / 100 | 14 / 140 | start |
| Take My Money!! | Cosmograph | TRACING THE STARS | 1 / 10 | 5 / 50 | 9 / 90 | 14 / 140 | start |
| Apricot | Kagi | TRACING THE STARS | 4 / 40 | 7 / 70 | 12 / 120 | 17 / 170 | start |
| Afterglow | Cosmograph | TRACING THE STARS | 4 / 40 | 8 / 80 | 13 / 130 | 17 / 170 | after 1 plays |
| Rising Higher | NieN (feat. CielA) | TRACING THE STARS | 2 / 20 | 8 / 80 | 12 / 120 | 16 / 160 | after 3 plays |
| Archemy | Feryquitous (feat.Risa Yuzuki) | TRACING THE STARS | 1 / 10 | 5 / 50 | 10 / 100 | 14 / 140 | start |
| SO GOOD | Stessie | TRACING THE STARS | 1 / 10 | 6 / 60 | 9 / 90 | 14 / 140 | start |
| I FEEL SO ALIVE | Cosmograph | TRACING THE STARS | 3 / 30 | 7 / 70 | 12 / 120 | 15 / 150 | after 2 plays |
| Rapture Storm | NieN | TRACING THE STARS | 5 / 50 | 11 / 110 | 14 / 140 | 19 / 190 | after 5 plays |
| We Begin | Yu-dachi | TRACING THE STARS | 4 / 40 | 9 / 90 | 13 / 130 | 18 / 180 | start |
| Hurricanes | Cosmograph (feat. Pernelle) | TRACING THE STARS | 4 / 40 | 8 / 80 | 13 / 130 | 17 / 170 | from 2026-05-13 |
| Pretty STAR | Pretty | T.T.S. EXTENSION PACK V.1 | 4 / 40 | 9 / 90 | 13 / 130 | 18 / 180 | start |
| The Harvester | Cosmograph | T.T.S. EXTENSION PACK V.1 | 4 / 40 | 7 / 70 | 12 / 120 | 16 / 160 | start |
| The Collector | Cosmograph | T.T.S. EXTENSION PACK V.1 | 2 / 20 | 6 / 60 | 10 / 100 | 14 / 140 | start |
| Khamsin | Cosmograph | T.T.S. EXTENSION PACK V.1 | 3 / 30 | 8 / 80 | 13 / 130 | 17 / 170 | start |
| Bullet Storm | NieN | T.T.S. EXTENSION PACK V.1 | 5 / 50 | 10 / 100 | 14 / 140 | 19 / 190 | start |
| Silver mane | Feryquitous | T.T.S. EXTENSION PACK V.1 | 3 / 30 | 9 / 90 | 13 / 130 | 17 / 170 | start |
| Juvenile Days | seibin (feat. chaerin) | T.T.S. EXTENSION PACK V.1 | 1 / 10 | 5 / 50 | 9 / 90 | 14 / 140 | start |
| CLAY! MORE! | Cosmograph (feat. B.A.Wheeler) | T.T.S. EXTENSION PACK V.1 | 4 / 40 | 8 / 80 | 12 / 120 | 16 / 160 | start |
| Boogie Night | roop | T.T.S. EXTENSION PACK V.1 | 3 / 30 | 8 / 80 | 11 / 110 | 15 / 150 | start |
| Pro-Fusion! | Soochan | TRACING THE STARS | 3 / 30 | 7 / 70 | 11 / 110 | 15 / 150 | from 2026-07-01 |
| Mo Sho Chu☆it | Artive Sound (feat. Yuri) | T.T.S. SUMMER PACK V.1 | 3 / 30 | 7 / 70 | 12 / 120 | 17 / 170 | start |
| SO PLAYFUL | Nauts (feat. towana from fhána) | T.T.S. SUMMER PACK V.1 | 3 / 30 | 8 / 80 | 13 / 130 | 17 / 170 | start |
| Summer Seaside | Cosmograph (feat. NieN) | T.T.S. SUMMER PACK V.1 | 1 / 10 | 5 / 50 | 9 / 90 | 13 / 130 | start |
| Set Sail | NieN (feat. Diana Garnet) | T.T.S. SUMMER PACK V.1 | 4 / 40 | 9 / 90 | 13 / 130 | 18 / 180 | start |
| Midnight Memories | Cosmograph (feat. Chaerin) | T.T.S. SUMMER PACK V.1 | 1 / 10 | 4 / 40 | 7 / 70 | 12 / 120 | start |
| It's VOLT TIME | Cosmograph | T.T.S. SUMMER PACK V.1 | 2 / 20 | 6 / 60 | 12 / 120 | 16 / 160 | start |
| HOLY CRAB | Cosmograph | T.T.S. SUMMER PACK V.1 | 2 / 20 | 7 / 70 | 12 / 120 | 18 / 180 | start |
| BASS BOMB | Cosmograph | T.T.S. SUMMER PACK V.1 | 3 / 30 | 8 / 80 | 14 / 140 | 18 / 180 | start |
| Kraken (VIP) | Blacklolita | T.T.S. SUMMER PACK V.1 | 5 / 50 | 10 / 100 | 15 / 150 | 19 / 190 | start |
| Hero | Moeki Harada (Vocal. Luna Goami) | TRACING THE STARS | 1 / 10 | 4 / 40 | 8 / 80 | 11 / 110 | from 2026-08-12 |
| PROJECT MATIS | Cosmograph | T.T.S. EXTENSION PACK V.2 | 3 / 30 | 7 / 70 | 12 / 120 | 17 / 170 | start |
| The Wings of Victory | AJURIKA | T.T.S. EXTENSION PACK V.2 | 4 / 40 | 7 / 70 | 12 / 120 | 17 / 170 | start |
| Resist | Blacklolita | T.T.S. EXTENSION PACK V.2 | 3 / 30 | 8 / 80 | 13 / 130 | 18 / 180 | start |
| Astronaut Airlines | Xuxhiz | T.T.S. EXTENSION PACK V.2 | 3 / 30 | 6 / 60 | 10 / 100 | 14 / 140 | start |
| ALIVE | Cosmograph | T.T.S. EXTENSION PACK V.2 | 3 / 30 | 8 / 80 | 13 / 130 | 17 / 170 | start |
| Burn it All | Cosmograph (feat. A.MON, Springhead) | T.T.S. EXTENSION PACK V.2 | 5 / 50 | 10 / 100 | 15 / 150 | 19 / 190 | start |
| TRUE FIREPOWER | NieN (feat. B.A.Wheeler) | T.T.S. EXTENSION PACK V.2 | 3 / 30 | 7 / 70 | 12 / 120 | 16 / 160 | start |
| TRUE FLAVOR | Cynax | T.T.S. EXTENSION PACK V.2 | 3 / 30 | 7 / 70 | 13 / 130 | 17 / 170 | start |
| Outbreak - BREAKER - | NieN Remixed by Cosmograph | T.T.S. EXTENSION PACK V.2 | 2 / 20 | 7 / 70 | 12 / 120 | 16 / 160 | start |
| EEEEEEEEE-ntertainment | Cosmograph | TRACING THE STARS | 2 / 20 | 6 / 60 | 10 / 100 | 14 / 140 | from 2026-10-08 |
| Lucky Night | seibin, Cosmograph (feat. Shabel Tonya) | T.T.S. TETRA ENTERTAINMENT PACK V.1 | 3 / 30 | 7 / 70 | 12 / 120 | 16 / 160 | start |
| SHOW DOWN | Cosmograph (feat. Shabel Tonya) | T.T.S. TETRA ENTERTAINMENT PACK V.1 | 3 / 30 | 9 / 90 | 13 / 130 | 17 / 170 | start |
| Running, SODA! | kagi | T.T.S. TETRA ENTERTAINMENT PACK V.1 | 2 / 20 | 6 / 60 | 11 / 110 | 16 / 160 | start |
| Catch coin, SODA! | kagi | T.T.S. TETRA ENTERTAINMENT PACK V.1 | 4 / 40 | 8 / 80 | 13 / 130 | 17 / 170 | start |
| Mission Possible | Cynax | T.T.S. TETRA ENTERTAINMENT PACK V.1 | 3 / 30 | 7 / 70 | 12 / 120 | 16 / 160 | start |
| Manners Maketh Maid | Cynax | T.T.S. TETRA ENTERTAINMENT PACK V.1 | 3 / 30 | 8 / 80 | 13 / 130 | 18 / 180 | start |
| MEKAMI SHIFTY | Nauts | T.T.S. TETRA ENTERTAINMENT PACK V.1 | 3 / 30 | 7 / 70 | 12 / 120 | 17 / 170 | start |
| FIGHT! ARK RANGER! | steelplus | T.T.S. TETRA ENTERTAINMENT PACK V.1 | 4 / 40 | 7 / 70 | 11 / 110 | 16 / 160 | start |
| A.C.P.U.! FREEZE! | Cosmograph | T.T.S. TETRA ENTERTAINMENT PACK V.1 | 2 / 20 | 6 / 60 | 11 / 110 | 15 / 150 | start |
| Providence (NIKKE Remix) | seibin Remixed by Cosmograph | TRACING THE STARS | 4 / 40 | 8 / 80 | 13 / 130 | 19 / 190 | from 2026-10-28 |
| Into the Fire | Cosmograph (feat. Victor Borba) | TRACING THE STARS | 5 / 50 | 11 / 110 | 15 / 150 | 18 / 180 | from 2026-10-28 |
| Raven | Oliver Good | T.T.S. STELLAR BLADE PACK V.1 | 3 / 30 | 8 / 80 | 14 / 140 | 18 / 180 | start |
| Everglow | Hyunmin Cho | T.T.S. STELLAR BLADE PACK V.1 | 2 / 20 | 5 / 50 | 8 / 80 | 13 / 130 | start |
| Silent Street (Battle) | Hyunmin Cho, seibin | T.T.S. STELLAR BLADE PACK V.1 | 1 / 10 | 6 / 60 | 11 / 110 | 15 / 150 | start |
| Flooded Commercial Sector | Oliver Good | T.T.S. STELLAR BLADE PACK V.1 | 1 / 10 | 5 / 50 | 8 / 80 | 11 / 110 | start |
| Karakuri | seibin | T.T.S. STELLAR BLADE PACK V.1 | 1 / 10 | 6 / 60 | 11 / 110 | 16 / 160 | start |
| Don't Forget Me | Youngjee Lee | T.T.S. STELLAR BLADE PACK V.1 | 2 / 20 | 5 / 50 | 10 / 100 | 15 / 150 | start |
| Belial | Muwen | T.T.S. STELLAR BLADE PACK V.1 | 4 / 40 | 9 / 90 | 13 / 130 | 17 / 170 | start |
| Stalker | Keita Inoue | T.T.S. STELLAR BLADE PACK V.1 | 4 / 40 | 8 / 80 | 13 / 130 | 17 / 170 | start |
| Mann (Phase Mixed) | Youngjee Lee | T.T.S. STELLAR BLADE PACK V.1 | 4 / 40 | 9 / 90 | 14 / 140 | 18 / 180 | start |
| The Song of the Traveler | Mothervibes | TRACING THE STARS | 1 / 10 | 4 / 40 | 7 / 70 | 10 / 100 | from 2026-10-28 |
| TAKE ME AWAY | Youngjee Lee | TRACING THE STARS | 2 / 20 | 6 / 60 | 11 / 110 | 15 / 150 | from 2026-10-28 |
| SCARLET (Phase 2) | Hyunmin Cho, Youngjee Lee | T.T.S. STELLAR BLADE PACK V.2 | 3 / 30 | 8 / 80 | 12 / 120 | 16 / 160 | start |
| BLUR | Youngjee Lee | T.T.S. STELLAR BLADE PACK V.2 | 2 / 20 | 7 / 70 | 13 / 130 | 15 / 150 | start |
| Star Descent | Oliver Good, Keita Inoue | T.T.S. STELLAR BLADE PACK V.2 | 3 / 30 | 7 / 70 | 11 / 110 | 16 / 160 | start |
| BATTLE DROID | Youngjee Lee | T.T.S. STELLAR BLADE PACK V.2 | 4 / 40 | 9 / 90 | 13 / 130 | 17 / 170 | start |
| Abaddon | ko.yo | T.T.S. STELLAR BLADE PACK V.2 | 5 / 50 | 9 / 90 | 13 / 130 | 18 / 180 | start |
| Tachy Mode | Hyunmin Cho, Youngkyoung Choi | T.T.S. STELLAR BLADE PACK V.2 | 4 / 40 | 8 / 80 | 12 / 120 | 17 / 170 | start |
| Dawn (Lively) | seibin | T.T.S. STELLAR BLADE PACK V.2 | 2 / 20 | 5 / 50 | 9 / 90 | 13 / 130 | start |
| Pathway to Atelier | Hyunmin Cho | T.T.S. STELLAR BLADE PACK V.2 | 1 / 10 | 4 / 40 | 10 / 100 | 16 / 160 | start |
| Hypertube | seibin | T.T.S. STELLAR BLADE PACK V.2 | 3 / 30 | 7 / 70 | 12 / 120 | 16 / 160 | start |

## Missions (72)

From `EventTTSMissionTable` (`mission_type`, `mission_value` fills the {0}/{1} slots of `desc_locale`, `open_type` Limited = time-limited with `start_date`/`end_date`, `reward_id`).

| Mission | Goal | Period | Reward |
|---|---|---|---|
| Ever-Growing Set List 1 | Play any song to completion 10 times | permanent | Tracing The Stars (BGM) ×1 |
| Ever-Growing Set List 2 | Play any song to completion 20 times | permanent | Polishing the Act (BGM) ×1 |
| Ever-Growing Set List 3 | Play any song to completion 30 times | permanent | Rhythm Master ×1 |
| Ever-Growing Set List 4 | Play any song to completion 40 times | permanent | Full Combo Master ×1 |
| Ever-Growing Set List 5 | Play any song to completion 50 times | permanent | All Perfect Master ×1 |
| Practice Pays Off 1 | Reach a total score of 7,000,000 | permanent | Gem ×20 |
| Practice Pays Off 2 | Reach a total score of 14,000,000 | permanent | Gem ×20 |
| Practice Pays Off 3 | Reach a total score of 21,000,000 | permanent | Gem ×20 |
| Practice Pays Off 4 | Reach a total score of 28,000,000 | permanent | Gem ×20 |
| Practice Pays Off 5 | Reach a total score of 35,000,000 | permanent | Gem ×20 |
| Practice Pays Off 6 | Reach a total score of 42,000,000 | permanent | Gem ×20 |
| Practice Pays Off 7 | Reach a total score of 49,000,000 | permanent | Gem ×20 |
| Practice Pays Off 8 | Reach a total score of 56,000,000 | permanent | Gem ×20 |
| Practice Pays Off 9 | Reach a total score of 63,000,000 | permanent | Gem ×20 |
| Practice Pays Off 10 | Reach a total score of 70,000,000 | permanent | TRACING THE STARS Premium Sticker I ×1 |
| Practice Pays Off 11 | Reach a total score of 77,000,000 | permanent | Gem ×20 |
| Rhythm Master 1 | Clear any song with a rank of A or higher 25 times | permanent | Gem ×20 |
| Rhythm Master 2 | Clear any song with a rank of A or higher 50 times | permanent | Gem ×20 |
| Rhythm Master 3 | Clear any song with a rank of A or higher 75 times | permanent | Gem ×20 |
| Rhythm Master 4 | Clear any song with a rank of A or higher 100 times | permanent | TRACING THE STARS Premium Sticker II ×1 |
| Rhythm Master 5 | Clear any song with a rank of A or higher 125 times | permanent | Gem ×20 |
| On the Money 1 | Hit 20,000 notes with a timing of Great or higher | permanent | Gem ×20 |
| On the Money 2 | Hit 35,000 notes with a timing of Great or higher | permanent | Gem ×20 |
| On the Money 3 | Hit 50,000 notes with a timing of Great or higher | permanent | Gem ×20 |
| On the Money 4 | Hit 65,000 notes with a timing of Great or higher | permanent | TRACING THE STARS Premium Sticker III ×1 |
| On the Money 5 | Hit 80,000 notes with a timing of Great or higher | permanent | Gem ×20 |
| Never-Ending Challenge | Enter the TRACING THE STARS shop | permanent | The Track Shop (BGM) ×1 |
| Hurricanes | Play Hurricanes to completion once | permanent | TRACING THE STARS Special Sticker I ×1 |
| Pro-Fusion! | Play Pro-Fusion! to completion once | permanent | TRACING THE STARS Special Sticker II ×1 |
| Hero | Play Hero to completion once | permanent | TRACING THE STARS Special Sticker III ×1 |
| EEEEEEEEEntertainment! | Play EEEEEEEEE-ntertainment to completion once | permanent | TRACING THE STARS Special Sticker IV ×1 |
| Providence (NIKKE Remix) | Play Providence (NIKKE Remix) to completion once | permanent | TRACING THE STARS Special Sticker V ×1 |
| Into the Fire | Play Into the Fire to completion once | permanent | TRACING THE STARS Special Sticker VI ×1 |
| The Song of the Traveler | Play The Song of the Traveler to completion once | permanent | TRACING THE STARS Special Sticker VII ×1 |
| TAKE ME AWAY | Play TAKE ME AWAY to completion once | permanent | TRACING THE STARS Special Sticker VIII ×1 |
| Together feat. the Lizard Girl | Equip Tia and play any song to completion 1 time(s) | permanent | TRACING THE STARS Premium Sticker IV ×1 |
| Together feat. the Mature Girl | Equip Naga and play any song to completion 1 time(s) | permanent | TRACING THE STARS Premium Sticker V ×1 |
| Together feat. Miss Penguin | Equip Marciana and play any song to completion 1 time(s) | permanent | TRACING THE STARS Premium Sticker VI ×1 |
| Together feat. the Angel Who Bridges Memories | Equip EVE and play any song to completion 1 time(s) | permanent | TRACING THE STARS Premium Sticker VII ×1 |
| Together feat. the Crow Ravaged by Truth | Equip Raven and play any song to completion 1 time(s) | permanent | TRACING THE STARS Premium Sticker VIII ×1 |
| Together feat. the Girl Who Welcomes a New Dawn | Equip Lily and play any song to completion 1 time(s) | permanent | TRACING THE STARS Premium Sticker IX ×1 |
| Be My Star | Play Be My Star to completion once | 2026-04-22 → 2026-05-13 | Advanced Recruit Voucher ×1 |
| All Eyes On Me | Play All Eyes On Me to completion once | 2026-04-22 → 2026-05-13 | Advanced Recruit Voucher ×1 |
| Accelerate | Play Accelerate to completion once | 2026-04-22 → 2026-05-13 | Advanced Recruit Voucher ×1 |
| Clickbait | Play Clickbait to completion once | 2026-04-22 → 2026-05-13 | Advanced Recruit Voucher ×1 |
| Satellites | Play Satellites to completion once | 2026-04-22 → 2026-05-13 | Advanced Recruit Voucher ×1 |
| Void Seeker | Play Void Seeker to completion once | 2026-04-22 → 2026-05-13 | Advanced Recruit Voucher ×1 |
| FATAL MAID | Play FATAL MAID to completion once | 2026-04-22 → 2026-05-13 | Advanced Recruit Voucher ×1 |
| Counter Attack | Play Counter Attack to completion once | 2026-04-22 → 2026-05-13 | Advanced Recruit Voucher ×1 |
| JINX PLAYER | Play JINX PLAYER to completion once | 2026-04-22 → 2026-05-13 | Advanced Recruit Voucher ×1 |
| Yes, My Commander | Play Yes, My Commander to completion once | 2026-04-22 → 2026-05-13 | Advanced Recruit Voucher ×1 |
| T.T. STAR! Shine Through to the End! 1 | Play any song to completion 2 times | 2026-04-22 → 2026-05-13 | Skill Manual Box ×3 |
| T.T. STAR! Shine Through to the End! 2 | Play any song to completion 4 times | 2026-04-22 → 2026-05-13 | Burst Manual Box ×3 |
| T.T. STAR! Shine Through to the End! 3 | Play any song to completion 6 times | 2026-04-22 → 2026-05-13 | T.T. STAR Scratch Ticket ×15 |
| T.T. STAR! Shine Through to the End! 4 | Play any song to completion 8 times | 2026-04-22 → 2026-05-13 | Elysion Common Console ×30 |
| T.T. STAR! Shine Through to the End! 5 | Play any song to completion 10 times | 2026-04-22 → 2026-05-13 | T.T. STAR Scratch Ticket ×15 |
| T.T. STAR! Shine Through to the End! 6 | Play any song to completion 12 times | 2026-04-22 → 2026-05-13 | Missilis Common Console ×30 |
| T.T. STAR! Shine Through to the End! 7 | Play any song to completion 14 times | 2026-04-22 → 2026-05-13 | T.T. STAR Scratch Ticket ×15 |
| T.T. STAR! Shine Through to the End! 8 | Play any song to completion 16 times | 2026-04-22 → 2026-05-13 | Tetra Common Console ×30 |
| T.T. STAR! Shine Through to the End! 9 | Play any song to completion 18 times | 2026-04-22 → 2026-05-13 | T.T. STAR Scratch Ticket ×15 |
| T.T. STAR! Shine Through to the End! 10 | Play any song to completion 20 times | 2026-04-22 → 2026-05-13 | Pilgrim Common Console ×30 |
| T.T. STAR! Keep on Practicing! 1 | Reach a total score of 600,000 | 2026-04-22 → 2026-05-13 | Attacker Common Console ×30 |
| T.T. STAR! Keep on Practicing! 2 | Reach a total score of 1,800,000 | 2026-04-22 → 2026-05-13 | Defender Common Console ×30 |
| T.T. STAR! Keep on Practicing! 3 | Reach a total score of 3,000,000 | 2026-04-22 → 2026-05-13 | Supporter Common Console ×30 |
| T.T. STAR! Keep on Practicing! 4 | Reach a total score of 4,300,000 | 2026-04-22 → 2026-05-13 | Ultra-Double Boost Module ×15 |
| T.T. STAR! Keep on Practicing! 5 | Reach a total score of 5,600,000 | 2026-04-22 → 2026-05-13 | Central Government Supply Chest I ×10 |
| T.T. STAR! Keep on Practicing! 6 | Reach a total score of 7,000,000 | 2026-04-22 → 2026-05-13 | Skill Manual Box ×3 |
| T.T. STAR! Keep on Practicing! 7 | Reach a total score of 8,400,000 | 2026-04-22 → 2026-05-13 | Burst Manual Box ×3 |
| T.T. STAR! Keep on Practicing! 8 | Reach a total score of 9,800,000 | 2026-04-22 → 2026-05-13 | Ultra-Double Boost Module ×15 |
| T.T. STAR! Keep on Practicing! 9 | Reach a total score of 11,200,000 | 2026-04-22 → 2026-05-13 | Central Government Supply Chest I ×10 |
| T.T. STAR! Keep on Practicing! 10 | Reach a total score of 12,600,000 | 2026-04-22 → 2026-05-13 | Skill Manual Box ×4 |
| T.T. STAR! Keep on Practicing! 11 | Reach a total score of 14,000,000 | 2026-04-22 → 2026-05-13 | Burst Manual Box ×4 |

## Skins (17)

From `EventTTSSkinObjectTable` (`skin_object_type` BG / Character / Note, `is_free`, `cost_currency_id` + `cost_currency_value`, `release_date`). Cosmetic; nothing in the data ties them to scoring.

| Skin | Type | Cost | Release |
|---|---|---|---|
| T.T.S. STAGE | BG | free | 2026-05-14 |
| SUMMER STAGE | BG | Gem ×600 | 2026-07-02 |
| Hyper Tube Stage | BG | Gem ×600 | 2026-10-28 |
| Anis | Character | free | 2026-05-14 |
| Mint | Character | free | 2026-05-14 |
| Prika | Character | free | 2026-05-14 |
| Tia | Character | Gem ×500 | 2026-07-02 |
| Naga | Character | Gem ×500 | 2026-07-02 |
| Marciana | Character | Gem ×500 | 2026-07-02 |
| EVE | Character | Gem ×500 | 2026-10-28 |
| Raven | Character | Gem ×500 | 2026-10-28 |
| Lily | Character | Gem ×500 | 2026-10-28 |
| T.T.S. Notes | Note | free | 2026-05-14 |
| Shell Notes | Note | Gem ×100 | 2026-07-02 |
| Popsicle Notes | Note | Gem ×100 | 2026-07-02 |
| Candy Notes | Note | Gem ×100 | 2026-07-02 |
| Fusion Cell Notes | Note | Gem ×100 | 2026-10-28 |

## Data sources

| Table | Used for |
|---|---|
| `EventTTSManagerTable` | `lane_speed_option_value` (speed options), `enter_scenario` (intro story), `helptip_group_id` (help) |
| `EventTTSSongManagerTable` | `name_locale`, `artist_locale`, `group_id` (album), `tag`, `<difficulty>_level`, `<difficulty>_ratio`, `unlock_condition_playcount`, `unlock_condition_date`, `show_list`, `cover_resource_id` |
| `EventTTSMaxScoreTable` | `song_id`, `pattern_type` (difficulty), `max_score` |
| `EventTTSSongGroupManagerTable` | albums: `name_locale`, `basic_music_group`, `release_date`, `group_image_resource` |
| `TTSAlbumShopTable` | paid album packs: `song_group_id`, `name_localkey` |
| `EventTTSRankCalcSettingsTable` | grade bands: `desc`, `min`, `max`, `calc_value_a`, `calc_value_b` (doubles) |
| `EventTTSMissionTable` | missions (see above) |
| `EventTTSSkinObjectTable` | skins (see above) |
| `EventTTSTipLocaleTable` | loading tips (`tip_locale`) |
| `MinigameHubTable` / `MinigameHelpTipDescTable` | in-game help text |

## Uncertain / unknown

- The base of the rating formula (level vs ratio ÷ 10), see above.
- Note speed option units.
- How `tag` values (e.g. TTSTAR, Event, Vocal) are used in game (only listed).
- Judgement windows and per-note scoring are not in these tables.
