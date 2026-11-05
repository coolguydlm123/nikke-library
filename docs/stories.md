# Stories: how the reader works and the game data behind it

This guide explains the **Stories** section of the Nikke Library, a local web app that reads
NIKKE (Goddess of Victory: NIKKE) game data. It's written so someone with no other context
can answer questions about how the game's story scripts work.

- Game tables (JSON) live in `D:\Nikke Datamine\mpkparser\jsons`.
- Text lives in the locale dump under `D:\Nikke Datamine\nikke-downloader\json-locale`.
- Code: `lib/stories.js` (story catalogue and scenes), `lib/memorials.js` (Memorials),
  `public/app.js` (reader, Game view, hub page).

Everything below is taken from that code and data. Points that are inferred rather than read
directly from the game are marked **(inferred)**.

---

## 1. What the page shows

### Landing page (`#/stories`)
- A hub with one chip per **category**, each with its scene count, and one card per
  **group** (chapter, event, character …) of the chosen category, with a thumbnail:
  - **Story Line thumbnail** first (`lib/misc.js` `thumbStoryGroups`): the `HistoryManagerTable`
    entry whose album (see `docs/misc.md`) holds most of the group's scenes gives its
    `thumbnail_id` (`icons-storyline` / `icons-album`). "Most" matters because chapter 0's album
    also holds the opening of chapter 1.
  - Otherwise, for events, the event's story-page background: `icons-event_bg` sprite
    `ui_event_bg_<EventStoryTable.ui_prefab_1>`.
  - Memorial series use `MemorialSeriesTable.memorial_series_resource` (`icons-material`);
    Messenger rooms their room picture (§7b).
  - Coverage: Main 50/50, Events 117/160 (reruns and unlinked groups mostly have none),
    Side Stories 6/7.
- `#/stories/<category>` switches the category.
- `#/stories/<category>/<group>` lists that group's scenes as cards: name, stage label (main
  story only, e.g. "3-1 STAGE · Start") and line count.

The sidebar has the same tree: category tabs, a filter box, and groups that open into scene
lists. On phones it folds into a "Browse Stories" bar.

| Category | id | Source folder (one JSON file per scene) | Scenes* |
|---|---|---|---:|
| Main Story | `main` | `ScenarioDialogTable/` files whose id starts `d_main_` | 771 |
| Events | `event` | `EventScenarioDialogTable/` | 2,579 |
| Side Stories | `side` | `SideStoryScenarioDialogTable/` | 99 |
| Bond Episodes | `bond` | `AttractiveScenarioDialogTable/` (except `treasurestory_*`) | 991 |
| Counseling | `counsel` | `AttractiveCounselDialogTable/` | 3,420 |
| Sub & Sudden Stories | `sub` | the rest of `ScenarioDialogTable/` | 145 |
| Favorite Items | `favorite` | `AttractiveScenarioDialogTable/treasurestory_*`: favorite item (treasure) stories, a separate thing from bond episodes | 124 |
| Outpost | `outpost` | `ScenarioDialogTable/` scenes listed in `OutpostConditionTriggerTable` (`d_ex_*`) | 302 |
| Memorials | `memorial` | `MemorialMemoryTable` (not a dialog table; see §7) | 272 |
| Messenger | `messenger` | `MessengerDialogTable` (the in-game chat app; see §7b) | 1,264 |

\*Counts from the data dump at the time of writing. The whole dialog set is 478,633 lines.

A scene file is named `<Folder>.<scene id>.json`, e.g.
`ScenarioDialogTable/ScenarioDialogTable.d_main_03_01.json`, and holds one record per line.

### Scene page (`#/scene/<scene id>`)
The header shows a breadcrumb (category · group · stage label), the scene title, and a toolbar:

| Control | What it does |
|---|---|
| **Game view** | Plays the scene one line at a time, like the game (§4). |
| **Play flow / All lines** | *Play flow* follows choices and jumps the way the game plays them (§3). *All lines* shows every line in file order, all branches at once, with jump markers. Hidden while Game view is on (Game view always follows the play flow). |
| **Keys** | Shows each line's short id, its locale key and the raw speaker id. |
| **Stage directions** | Shows the line's BG / IMG / MOVIE / BGM / SHOW fields as small tags. |
| **Backgrounds** | Shows background pictures (§5). |
| **Icons** | Shows the speaker's small character icon (§6). |
| **← Prev / Next →** | The previous and next scene in the same group (also the ← and → keys). |

Toggles are remembered in the browser.

---

## 2. Lines: types, speakers and text

Each record in a scene file is one line. The fields the reader uses:

| Field | Meaning |
|---|---|
| `id` | Line id, `<scene id>_<n>` (the reader shows `#<n>`). |
| `speech_window` | Line type (table below). |
| `speaker` | Speaker id, looked up in `ScenarioCharacterSettingTable` (§6). `Self` is the player. |
| `scenario_localkey` | Locale key of the text, e.g. `Locale_MainScenario:d_main_03_01_1`. |
| `jump_target` | Line id to continue at after this line (or, on a choice, after picking it). |
| `is_exit_scenario` | The scene ends after this line. |
| `choice_enter_scenario_group_id` | This line leads into another scene (shown as "↳ enters scenario …"). |
| `set_background` | Background to show from this line on (§5). |
| `set_image`, `play_movie`, `play_bgm` | Shown only as stage-direction tags. |
| `characters` | Character slots (§8); only the shown ids are listed as a SHOW tag. |
| `attractive_point` | Points a counseling choice gives (§3). |

Line types (`speech_window`) across the whole dump:

| Type | Count | How the reader shows it |
|---|---:|---|
| `Speech` | 346,012 | Speaker name (stable per-speaker colour) and text. |
| `Self` | 45,027 | The player (Commander) talking: highlighted blue box. |
| `Narration` | 38,825 | Centred italic text with no name. |
| `Monologue` | 36,816 | Italic, with the name marked "(thought)". |
| `Choice` | 11,951 | One option of a choice block (§3). |
| `Input`, `Subtitles` | 1 each | Shown like speech. |

**Text.** It comes from the locale dump. The table is the part of the key before `:`, and the
key is the part after. If a key has no text, the reader shows the key itself in grey.

**Speaker names.** `ScenarioCharacterSettingTable.id` → `name_localkey` → locale text.
- Many ids share one name (`marian`, `marian_p`, `marian_event_01` …).
- If a name key has no text, the shortest id with that key is title-cased instead.
- An unknown id is title-cased as is.

---

## 3. Choices, branches and the "play flow"

Choices aren't a separate table: they are consecutive lines with `speech_window = Choice`.

- **One block:** a run of consecutive `Choice` lines is one choice; each line is one option.
- **Branching:** each option's `jump_target` is the line id where that branch continues. A
  normal line with a `jump_target` also jumps after it is shown (to skip the other branches or
  merge back). A line with `is_exit_scenario` ends the scene there.
- **Play flow** (`flowItems()` in `public/app.js`):
  1. Start at line 1.
  2. On a choice block, take the picked option (the first by default) and continue at its
     `jump_target`, or right after the block if it has none.
  3. Otherwise show the line, then continue at its `jump_target` if any, else at the next line.
  4. Stop after an exit line or at the end of the file (with a loop guard of 4× the line count).

  In the reader you click an option to follow that branch.
- **All lines** lists the file in order. Choice blocks show every option with "→ #n" to say
  where each one goes, and other lines show "↳ jumps to #n".
- **Data counts:**
  - 19,565 lines have a `jump_target`.
  - 285 lines end their scene with `is_exit_scenario`.
  - 225 lines enter another scene through `choice_enter_scenario_group_id`.
- **Counseling scores:** in Counseling scenes, options carry `attractive_point` values such as
  `_120`, `_100` or `_0`. The reader reads the number after `_` as points.
  - When options in a block have different points, the highest one is marked "✓ Correct", and
    each scored option shows "+N pts".
  - In the dump, 3,420 options are `_120`, 3,421 are `_100` and the rest `_0`.
  - That these are Bond (affection) points, and that the highest is "correct", is the reader's
    interpretation **(inferred)**.

---

## 4. Game view

Game view shows the play flow one item at a time in a frame:
- The current background fills the frame (§5).
- A dialogue box shows the speaker's icon, name (in its colour) and text.
- Narration has no name plate, and monologue is marked "(thought)".
- At a choice, the options appear over the scene; picking one continues down that branch.
- At the end, an "END" box links to the next scene.

| Input | Action |
|---|---|
| Click the frame, Space, Enter, ↓, Next | Next line (blocked on a choice until you pick) |
| Backspace, ↑, Back | Previous line |
| ← / → | Previous / next scene |

The background shown at step *n* is the last `set_background` among the items played up to *n*.

**Layout.** Almost all backgrounds are square images (1,698 of 1,709), so the frame shows the
whole picture with a blurred copy filling the sides. The frame is 4:3 on desktop and 4:5 on
phones, where the text box sits under the picture.

---

## 5. Backgrounds

- **Source:** `set_background` names a sprite in the `scenariobackground` asset bundles,
  compared case-insensitively. Web copies are JPEGs in `public/img/scenariobackground/` (made
  by `tools/web-images.py`).
- **Reading view:** a picture appears where the background *changes*. Scripts often set the
  same background again, and repeats are not shown again.
- **Coverage:** 20,302 of the 20,308 lines that set a background have a matching picture. The
  six misses are data typos, e.g. sound-effect names (`sfx_scn_*`) put in the background field,
  or `bg015` / `bg020`.
- **Naming:**
  - `EventScene_Chap_NN_*` are event CGs from main-story chapter NN.
  - `EventScene_<event>_*` are event CGs.
  - `EventTitle_*` are title cards.
  - Other names are locations, with time-of-day or variant suffixes (`CityForest_01_n`).

  That naming split is how the image folders are sorted, not a game rule.

---

## 6. Speaker icons

- **Lookup:** `ScenarioCharacterSettingTable` row for the speaker id:
  - `address` is the character's standing art, e.g. `spine/standing/c010/00_HD` = character
    resource `c010`, costume `00`.
  - `resource_id` is the character's resource number (Rapi = 10).
- **Which icon:** the small icon `si_<cNNN>_<costume>_s` from the `icons-char` bundle, using the
  costume in `address`. If that icon doesn't exist, or the address isn't a standing model, it
  falls back to `si_c<resource_id, 3 digits>_00_s`.
- **Coverage:** 97% of spoken lines (339,665 of 349,252) get an icon. The rest are one-off NPCs
  with no icon in the bundle (e.g. `amy`, `talkative`, `raptilion`, `ce_02_npc_01`). The player
  (`Self`) has none.

---

## 7. Memorials

Memorials are the documents picked up on field maps (journals, call logs, data files). The
reader shows them as one more category (`lib/memorials.js`).

- **Series → page:**
  - `MemorialSeriesTable` is one series per group: name `memorial_series_name`, its page list
    `memorial_memory_id[]`, and `memorial_series_category`.
  - `MemorialSeriesCategoryTable` gives the series kind: `category_name`, `category_type`,
    `order`. Event series are sorted after the others, then by category order and series order.
  - `MemorialMemoryTable` holds one page: `memorial_memory_name` (title),
    `memorial_memory_description` (the text) and `fielditem_id`, the field item that grants it.
- **Scene ids:** a page is shown as scene `memorial_<memorial_memory_id>`.
- **Lines:** the text is split on line breaks. A line shaped like `Name: text` (a capitalised
  name of up to 21 characters) becomes a spoken line by that name. This is the reader's
  heuristic for call logs **(inferred)**.
- **Not story scripts:** memorials have no choices, backgrounds or icons.
- **Hub art:** each series card shows `MemorialSeriesTable.memorial_series_resource`
  (`mm_1001` … `mm_1005`), from the `icons-material` bundle family.
- **Maps link:** in the Maps section, field items of type `Memory` link to their memorial page.

---

## 7b. Messenger

The in-game chat app (`lib/messenger.js`). A **room** is a group and each **conversation** in it
a scene with id `msg_<conversation_id>`, drawn as chat bubbles: their lines on the left with
the member's name and icon, the player's on the right.

- **Rooms:** `MessengerRoomTable`: `id`, `type` (Nikke / Group / Quest / None, shown as "Chat"),
  `name_locale`, `thumbnail_image`, `members`. Rooms whose id contains `test` are skipped
  (placeholder dialog). 328 rooms have dialog with text.
- **Members:** `MessengerMemberTable`: `name_locale`, `status_message_locale`, `profile_image`.
- **Lines:** `MessengerDialogTable` (48,776 rows), grouped by `conversation_id` in table order,
  each row with `room_id`:
  - `dialog_localkey` already includes its table (`Locale_SuddenMessage:m_ex_…`); 48,530 rows
    have text.
  - `speaker_type` `They` is a member's line (name from `member_id`), `Self` the player,
    `Notification` a system line.
  - `message_type` `Choice` lines are the player's options: consecutive ones form one block and
    each option's `jump_target` is where the chat continues, so the reader's play flow (§3)
    works unchanged. `Monologue` is shown as a thought. `Reward` shows the reward's items from
    `reward_id` (RewardTable). `Image` shows its `resource_id` as text.
  - A conversation is named after its `is_opener` line (or its first line).
- **Pictures:**
  - Room thumbnails (`thumbnail_image`, `mi_cNNN_XX_s`) are in `icons-char-mi`.
  - Member `profile_image` values (`si_c…`) are in `icons-char`.
  - `icon_messenger_logo` / `icon_messenger_logo_profile` (95 members, and the group and quest
    rooms) are client UI images that aren't in any CDN bundle, so those show no picture.
  - 168 of 328 rooms have one.
- **Unlock notes:** for event chats, `ArchiveMessengerConditionTable.tid` is the conversation
  and `archive_messenger_condition_list` holds up to 3 conditions. They're shown as a first
  line "Unlocks: …":
  - `MessageClear` points at another row of the same table, whose `tid` is the earlier chat.
  - `EventStageClear` / `CampaignClear` give a stage id, named from `CampaignStageTable` when
    found.
  - Main chats' `MessengerConditionTriggerTable` rows (triggers such as ObtainCharacter,
    MainQuestClear, MessageClear) have no field linking them to a conversation, so they aren't
    shown.
- **Static build:** about 8.0 MB for the 1,264 conversation files, plus about 115 KB in the
  story catalogue.

---

## 8. Characters on stage, positions and camera (in the data, not shown)

The reader doesn't show characters standing on stage. A version that did was built and then
removed at the user's request. The data is still in every line, and this is what it holds.

- **`characters`:** an array of 10 slots, each with:
  - `show_char_id`: a character appears in this slot.
  - `hide_char_id`: a character leaves.
  - `set_char_position`: where the slot stands.
  - `set_char_anim`: the expression or animation, e.g. `idle`, `angry`, `worry`, `think`,
    `surprise`, `sad`, `delight`, `pain`, `shy`, `no`, `special`, `void`.

  Positions and animations are repeated on every line, while show and hide appear only when
  they change.
- **`highlight`:** the character currently lit, usually the speaker.
- **`ScenarioPositionSettingTable`:** the position presets. `position_x/y/z` are doubles stored
  as raw 64-bit bit patterns.
  - Ids `1`–`19` are stage spots at depth z = 12, with x from −17.5 (`9`) through 0 (`1`) to
    +17.5 (`19`).
  - The most used spots are `1` (centre), `3` (x −4.5) and `13` (x +4.5).
  - `OP_*` ids (`OP_center`, `OP_leftup` …) hold values between 0 and 1 and look like screen
    fractions **(inferred)**.
- **Camera:**
  - `set_start_camera` / `set_end_camera` per line refer to `ScenarioCameraSettingTable`
    (2,089 presets), with x matching the position spots.
  - Presets `1`–`19` have z 0; ids ending in 0 (`10` … `190`) have z 4; ids ending in 00
    (`100` …) have z 6.
  - Read as camera distance toward characters standing at z 12, that would be a zoom of
    12 / (12 − z), so 1×, 1.5× and 2× **(inferred)**.
- **No size data:** no table gives a character's on-screen size. Only the camera distance
  changes it; the base scale lives in the game client.

---

## 9. Names, groups and order

| Category | Group | Scene name |
|---|---|---|
| Main | Chapter N from the id (`d_main_03_*` → 3); name from `CampaignChapterTable.chapter` → `name_localkey`. | `AlbumResourceTable.scenario_group_id` → `scenario_name_localkey`. Stage label from `CampaignStageTable`: a scene that is a stage's `enter_scenario` is "Start", an `exit_scenario` is "End", with `name_localkey` (e.g. "3-1 STAGE"). |
| Events | The record's `event_id` (see below for the name). Scenes without an `event_id` go in "<prefix> (unlinked)" groups (minigame or test dialog). | Locale `<scene id>_title`; event halves `_s` / `_e` use `_title_a` / `_title_b`. |
| Side | Number in the id (`s3_*` → 3) → `SideStoryTable.sidestory_name`. | as above |
| Bond / Counseling | Character, via `AttractiveCounselTable` / `AttractiveLevelRewardTable` / `LiberateAttractiveEpisodeTable` `name_code` → `Character/CharacterTable.name_localkey`. Scenes with no table link (treasure stories, some costumes) are matched by name from the id (`treasurestory_julia_02` → Julia) **(inferred match)**. | Counseling: `AttractiveCounselTable.counsel_name_localkey`. |
| Sub & Sudden | The id with trailing numbers removed, title-cased. | `<scene id>_title` |
| Outpost (`d_ex_*`, 302) | Its own category, one group per outpost building, in building-id order, with the building's picture (`AlbumInfoTable` row whose `sub_category_id` is the building id → `sub_category_thumbnail`, `img_album_structure_*` in `icons-album`; all 27 present): `OutpostConditionTriggerTable` has one row per story (`enter_scenario_id` / `exit_scenario_id`), and its `tid` is an `OutpostBuildingTable` id named by locale `Locale_Outpost:1000_<tid>_name` ("Cafe Lv. 1"; the "Lv. N" is dropped). 27 buildings. | `name_localkey` (`Locale_SuddenStory:<id>_title`). |
| Favorite Items | One group per Nikke. `FavoriteItemQuestTable.end_scenario_id` is the story, `name_code` the Nikke (`Character/CharacterTable`); the 8 `treasurestory_*` scenes not in that table are matched by the name in the id. The group picture is the Nikke's favorite item icon (`FavoriteItemTable.icon_resource_id` by `name_code`, `si_favoriteitem_*` in `icons-favoriteitem`; all 21). `FavoriteItemTable.img_resource_id` names Spine models, which aren't used. The reader header shows the quest step's name (`name_localkey`, e.g. "Enter the Outpost"). | `<scene id>_title` |
| Sub & Sudden: requests (`d_subquest_*`, `re_d_subquest_*`) | One group per requester, "Request · <name>" (`StoryLibrary.groupRequests`). The requester is the room of the Messenger chat with the same id (`d_subquest_1022_s` → chat `m_subquest_1022_s`, also tried without the `_s`/`_e` half): `MessengerRoomTable.name_locale`. Without a chat, it's the name in a title like "Raptilion's Request I: …". 46 requesters; only `d_subquest_1191_01_s/_e` match neither ("Unknown requester"). | `<scene id>_title` if any (Raptilion's and Roam's requests), else "Request NNNN · Start/End" from the id; reruns get "(rerun)". |

**Event names.** `EventManagerTable.name_localkey` is a placeholder for most events:
`story_event_name_001` ("No Caller ID") is reused by about 700 rows. So the reader:
1. trusts a name key only if exactly one event uses it;
2. otherwise looks for the event's real name in its reward text, e.g. profile titles such as
   `Locale_Profile:title_maidinvalentine_name` → "MAID IN VALENTINE Special Title", giving
   "MAID IN VALENTINE". It matches on slugs from `EventStoryTable` / `ArchiveEventStoryTable`
   (`ui_prefab_1`, `prologue_scenario`), the banner id, and the scene ids' common prefix
   **(inferred match)**;
3. labels collab events (`ce_01`, `ce002` …), which have no name anywhere in the locale, as
   "Collab NN";
4. adds "· Part N" for `_partN` slugs, "· Rerun" for ids starting `re_`, and "· #<event id>"
   when two groups would otherwise share a name (reruns and archive copies).

**Order.** Scenes follow the game's own lists, `ScenarioDialog.Group.csv` and the other
`*.Group.csv` files in the mpk dump folder. Scenes missing from those lists come after, in
natural order with `_s` (start) before `_e` (end). Groups are ordered by chapter or event
number.

---

**Outpost unlock notes.** The reader header and the hub's scene cards show what an outpost
story needs, from the same row's `trigger_list` (up to 6 entries):
- `ObtainCharacter` (`condition_id` = a character's `name_code` in `Character/CharacterTable`):
  own that Nikke.
- `MainQuestClear` (`condition_id` = `MainQuestTable.id`, named by `name_localkey`): clear that
  main quest.
- `CharacterAttractiveLevelMax` (`condition_id` = `name_code`, `condition_value` = 10): a bond
  condition on that Nikke, shown raw because what the 10 means is unclear. It isn't the bond
  cap: `AttractiveLevelTable` has bond levels 1–40, `AttractiveCounselTable.attractive_level_max`
  is 40 for every Nikke, and the in-game cap is 30 per the user. Only one story uses it: "Luck Turbo Charge" (Command Center,
  `d_ex_command_06`) needs it for both Noir and Blanc. It isn't a favorite item story; those
  are the `treasurestory_*` scenes under Bond Episodes.

The row also gives `resource_id` (the featured Nikke's `name_code`), `stamina_value` and
`reward_id` (RewardTable). Example: "Seeing Any Souls?" needs Signal, Delta and Julia, features
Julia, costs 1 stamina and rewards Darling for a Day ×1.

## 10. Known data quirks

- **Background typos:** six background values aren't images (sound-effect names, `bg015`,
  `bg020`).
- **Event name placeholders:** `EventManagerTable` names are mostly placeholders (§9).
- **Shared speaker names:** many speaker ids share one name, and a few NPC ids have no name
  key, so they show title-cased (`Verygentleman`).
- **Unlinked event scenes:** some event-folder scenes have no `event_id` and are grouped under
  "(unlinked)".
- **Unscored choices:** `attractive_point` exists on every line but only means something on
  Counseling choices; elsewhere it's `_0` or empty.
