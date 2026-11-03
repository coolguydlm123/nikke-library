# Misc: Story Line

The **Misc** section of the Nikke Library (a local web app that reads NIKKE game data) holds
pages that fit no other section. Its first page is the **Story Line**, the game's timeline of
stories. Game tables are JSON files in `D:\Nikke Datamine\mpkparser\jsons`; text comes from the
locale dump in `D:\Nikke Datamine\nikke-downloader\json-locale`. Code: `lib/misc.js` (data),
`public/misc.js` (page). Facts below come from that code and data; inferred points are marked
**(inferred)**.

## What the page shows

- `#/misc`: hub with a Story Line card.
- `#/misc/storyline/history` and `/release`: the two orders the game offers, as tabs.
  - **History** sorts by `history_order` (the story's own timeline).
  - **Release** sorts by `update_order` (when it was added to the game).
- **Filters:** chips for type (Main / Event / Sub) and a folding Tags box; the sidebar filter
  box matches story names and tag names.
- **Table columns:** story (with "Part n/m" for multi-part stories), the order number, type,
  visible date, scene count and tags.
- `#/misc/storyline/e/<id>`: one story with its thumbnail, dates, orders and tags, and its
  scenes in order, each linking to the Stories reader.

## Data

**`HistoryManagerTable`** has one row per Story Line entry: 113 in total (51 Main, 49 Event,
13 Sub).

| Field | Meaning |
|---|---|
| `history_type` | Main / Event / Sub |
| `story_name_localkey` (table in `set_locale_table`) | Name, e.g. `Locale_Stage:chapter_name_01`, `Locale_System:RED_ASH_PART1_NAME` |
| `history_order`, `update_order` | Sort keys of the History and Release tabs |
| `visible_date` | .NET DateTime ticks (json-bigint): the low 62 bits are 100 ns ticks since 0001-01-01. Shown as a date. Most entries are 2025-12-04 (when the Story Line was added, **inferred**); later ones match later releases. |
| `story_group_id`, `story_group_order` | Entries of one multi-part story share a non-zero group id; the order is the part number. The page shows "Part order/count". |
| `album_id` | Link to the story's scenes (below). |
| `thumbnail_id` | Thumbnail sprite. `img_storyline_*` are in the `icons-storyline` bundle family and `img_album_chapterNN` in `icons-album`; the page looks in both. All 93 distinct names resolve. |
| `scenario_tag_group_id` | Its tags (below). |
| `short_cut_type`, `short_cut_id` | The game's "go there" button (MainQuest / Archive). Not shown. |

**Scenes and the "n/n" count:**
1. `album_id` → `AlbumInfoTable.id`.
2. That row's `sub_category_id` → every `AlbumResourceTable` row with the same
   `sub_category_id`.
3. Their `scenario_group_id` values are the story's scene ids, in table order.

The count is the number of those rows, which is what the game's progress counter counts
**(inferred)**. Each scene id is looked up in the Stories reader. If some aren't there, the count
shows "a/b" and the scene is marked "(not in the reader)".

**Tags:**
1. `scenario_tag_group_id` → `HistoryTagGroupTable` rows with that `group_id`.
2. Each row's `tag_id` → `HistoryTagSetTable`, which has `tag_localkey` (text under
   `Locale_System:`), `tag_type` and `tag_order` (sort order).

There are 40 tags in use: characters (Marian, Rapi …), factions, places and events. Each chip
shows how many stories carry the tag.

## Quirks

- Chapter 0's album (`AlbumInfoTable` sub-category 0) holds `d_main_01_01…` scenes, i.e. the
  game counts the opening of chapter 1 as chapter 0 (the prologue).
- `thumbnail_id` and `resource_id` are the same in every row.
