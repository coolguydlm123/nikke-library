# My Nikkes (account import)

`#/character/mine`. Imports your own account from Blablalink Shiftypad and shows it as a management view. Code: `public/account/mynikkes.js` and `mynikkes.css` (page), `lib/account/index.js` (names for ids and the script text), `tools/account/shiftypad-export.js` (the console script), `public/account/shiftypad-export.user.js` (the userscript).

### Privacy

Everything runs in the visitor's own browser, with their own Blablalink login. The export is read in the browser and stored only there (localStorage key `nl.account`, about 200 KB; filters, sort, tab, pins and stat picks are `nl.mine*` keys). The site makes no network calls to Blablalink and sends nothing anywhere; nothing is logged. **Clear data** erases the account (pins and picks stay, being separate keys). The page says all of this and warns that the script reads through the same calls the Shiftypad page makes, so it may stop working if Blablalink changes them.

**Real data never ships:** no real account data is in the repository, the build or these docs (examples here are made up). `build-static.js` reads real identifiers from the gitignored `local/markers.txt` and fails the build if any appears in `dist/`, `docs/` or a tracked file; `local/` (including a small test export) stays ignored.

### Import flow

**Recommended: the userscript** (`public/account/shiftypad-export.user.js`, served at `account/shiftypad-export.user.js` next to the page, so the relative install link works on localhost and on the site; it has `@downloadURL`/`@updateURL` pointing at the site's copy, and makes the same export as the console script). Shiftypad detects DevTools and reloads the page when execution pauses, so the console route can fail; the userscript needs no DevTools.

1. Install Tampermonkey (a browser extension).
2. Open the page's userscript install link (`shiftypad-export.user.js`); Tampermonkey shows its install page for `.user.js` URLs.
3. Open your own Shiftypad page (blablalink.com/shiftyspad?uid=…) while logged in and click the **Export to Nikke Library** button the script adds.
4. The script calls Shiftypad's own API as you (`POST api.blablalink.com/api/game/proxy/Game/<Call>`: GetSavedRoleInfo, GetUserCharacters, GetUserCharacterDetails, GetUserProfileBasicInfo, GetUserProfileOutpostInfo). Shiftypad rate-limits bursts (error 1300018), so it reads Nikkes 20 per call, 1.2 s apart, and retries when limited: about 20 seconds for 206 Nikkes. The result is copied to the clipboard and saved as `nikke-account.json`.
5. Paste it into the page, or drop the file.

**Fallback: the console script** (`tools/account/shiftypad-export.js`, copied by the page's **Copy script** button from `/api/shiftypad-script`): run it in the Shiftypad page's console (F12 → Console), same calls and result. It may fail if Shiftypad reloads the page because DevTools is open.

**Update** re-imports; the page rejects anything that isn't valid JSON, isn't `v: 1`, has no `characters`, or has rows without `name_code`.

### Export format (v1)

`{ v: 1, source: 'shiftypad', exportedAt, profile: {...}, characters: [...] }`. No name, UID or login data.

- **profile:** `lv` (account level), `created_at` (epoch seconds), `character_count`, `character_costume_count`, `corporation_character_counts` (`corporation_type` 1 Elysion, 2 Missilis, 3 Tetra, 4 Pilgrim, 7 Abnormal; **[inferred]** from the counts matching the library's 50/43/59/26/28), `currencies`, `progress_normal/hard/easy_campaign` (a stage id; shown raw, not decoded), `progress_*_tower` (shown as exported; assumed floor numbers), `team_combat`, `profile_team`, `synchro_level`, `synchro_nonempty_slot_count`, `outpost_battle_level`, `infra_core_level`.
- **characters[]** (one per owned Nikke):
  - `name_code`: the library's character id (the list's `code`).
  - `lv`, `core` (0–7), `grade` (limit break stars 0–3), `combat` (CP), `attractive_lv` (bond), `skill1_lv`, `skill2_lv`, `ulti_skill_lv`.
  - `costume_tid` / `costume_id`: `CharacterCostumeTable.id` (0 = default look).
  - For each piece `head|torso|arm|leg`: `<piece>_equip_tid` (`ItemEquipTable.id`), `_tier`, `_lv`, `_corporation_type`, `_option1_id` to `_option3_id`. An option id is a **state effect id** of an overload line (`EquipmentOptionTable.state_effect_list[].state_effect_id`, for example 7000508 = Elemental Damage Lv 8); 0 = empty line. The lookup turns it into effect, level and value.
  - `harmony_cube_tid` / `_lv` (`ItemHarmonyCubeTable.id`), `favorite_item_tid` / `_lv` (`FavoriteItemTable.id`; this is the collection item or favorite item the Nikke has equipped), `arena_*` (the same for the arena loadout; not shown), `arena_combat`.

### What the page shows

- **Account:** level, Nikkes owned of total, costumes, synchro device, outpost battle level, infrastructure core level, team power, creation date; **Progress** (campaign stage ids, tower numbers); **By manufacturer** (owned and total).
- **Your Nikkes:** every library Nikke (the page uses the full window width) with level, core n/7, limit break stars, skills 1/2/burst, bond, costume, gear summary (tier, level, line count; open it for each piece's overload lines), cube and item with their icon and level, and CP. Cube art is `icons-equip/ie_<ItemHarmonyCubeTable.resource_id>`; item art is `icons-favoriteitem/<FavoriteItemTable.icon_resource_id>`.
- **Tabs** (remembered in `nl.mineTab`): **List** (the table above), **Overview** and **Gear totals**. List and Overview share the filter chips, the pins and the To do flags; Gear totals shows the totals tables below.
- **Overview:** one row per owned Nikke (filters apply; unowned Nikkes are left out): icon, name and pin star, skills 1/2/burst, cube (icon, name, level), item (icon and level), then the Nikke's overload lines summed by effect: ATK, Elem Dmg, Max Ammo, Charge Spd, Crit Rate, Crit Dmg, Hit Rate, DEF, and "More" (Charge Dmg and any unresolved line), each cell the sum of the line values in % with the line count in brackets (hover lists the lines), and "Lines" = how many of the 12 lines are filled. Click a header to sort (again to reverse; Skills sorts by the three levels' total, Cube and Item by level); the best value in each column is highlighted; pinned Nikkes stay on top under a "Pinned" separator. Sort is remembered (`nl.mineOv`). The sums add the lines' percentages as exported by `EquipmentOptionTable` (the game may stack some effects differently).
- **Overload stats shown:** a chip row above the tabs picks which overload effect types are displayed (ATK, Elem Dmg, Max Ammo, Charge Spd, Crit Rate, Crit Dmg, Hit Rate, DEF, Charge Dmg), with **All**, **Only the main ones** (the first 8) and **None** shortcuts. It applies everywhere overload data is shown: the Overview gets a column only for each picked stat (sums and best-value highlights follow); the List's gear details dim the lines of unpicked stats; Gear totals count only the picked stats (all three tables). When not everything is picked, the Overview's "More" column is replaced by **Picked**, the sum of the picked stats' values with the line count, which you can sort by. The checkbox "Only Nikkes with a line of the picked stats" hides owned Nikkes without one (and unowned ones) in List and Overview. Lines whose option id isn't resolved count as picked only while all stats are picked. The picks are remembered (`nl.mineFx`, `nl.mineFxOnly`).
- **Pins:** the star on a row (and the Pin button on a Nikke's card) pins it; pinned Nikkes sit at the top in the current sort order under a "Pinned" separator, and **Unpin all** clears them. Pins are stored apart from the account data (localStorage `nl.minePins`, a list of `name_code`s), so they survive Update and Clear data.
- **Overload gear totals:** every overload line on every owned gear piece, from the lookup of option ids. "By effect": lines, how many Nikkes have it, average and best level, total of the values (sum of the line values in %), and how many lines sit at each level 1–15; click an effect to list the Nikkes with it (and the level and slot). Then lines by gear slot, and by the Nikke's manufacturer (not the gear's: overloaded gear exports `corporation_type` 0).
- **Old-export warning:** a file whose Nikkes with CP above 50,000 mostly have `lv` 1 came from an export script before version 1.0.1 (the detail record's `lv`, always 1, overwrote the real level). It is still imported; the page warns on import and keeps a banner until a new export replaces it. Filters are the landing page's (rarity, weapon, element, burst, skill effect) plus **Account** (owned / not owned) and **To do**. Sort: character id (c-number), level or CP; unowned Nikkes sort last.
- **To do flags:** a skill below 10, core below 7, limit break below 3 stars, a T10 gear piece with no overload line, bond below 40. **[inferred]** The core maximum (7) and bond maximum (40) are the highest values seen, not read from a table.
- **A Nikke's page** gets a "Your <name>" card with the owned values and **Fill CP calculator from my gear**: it sets the skill levels, the 12 overload lines (elemental or stat, with level), the cube and level, and the item (only when it is one of the items the calculator offers for that weapon). ATK, HP and DEF are not in the export: type them in.

### Not mapped / uncertain

- Campaign progress ids and tower numbers aren't decoded to stage names.
- `currencies`, `profile_team`, `arena_*` and `costume_id` (equal to `costume_tid` in the sample) are kept but not shown.
- An id missing from the lookup shows as `#<id>` (an option line, cube, item or costume newer than the data).
- Nikkes in the export whose `name_code` is not in the library list are ignored.
- Character level can exceed 400 (it follows the synchro device), so level is shown as exported.

## How it plugs in

`public/characters.js` offers extension points (`window.NL_EXT`: hub cards, sidebar items, routes, cards on a Nikke's page; and the `Characters.kit` toolbox: filters, CP fill). `public/account/mynikkes.js` registers there, and `public/index.html` loads it and its stylesheet. `lib/api.js` adds the routes from `lib/account/index.js` (`/api/account-lookup`, `/api/shiftypad-script`); `build-static.js` requests both so the deployed site has them as static files.
