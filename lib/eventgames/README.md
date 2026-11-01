# Event minigame viewers

Each event minigame (the `GAMES` list in `lib/eventgames.js`) can have a viewer:
`lib/eventgames/<id>.js`. A viewer reads the game's `Event<Game>*` tables, works out the rules,
and returns pages that explain how the game plays and what is in it: stages, characters,
enemies, upgrades, scoring, missions and rewards. Every game also keeps its raw
"Data tables" pages, so a viewer doesn't need to show every column. Its job is to make the
game understandable.

`bbqmaster.js` is the reference viewer.

## Module

```js
function build(ctx) {
  return {
    summary: 'One or two sentences: what you do in this game.',
    overview: [ /* sections shown on the game's Overview page */ ],
    pages: [ { id, title, group, count, summary, sections: [ ... ] }, ... ],
  };
}
module.exports = { build };
```

- `id`: a short slug, unique within the game, used in the URL (`#/minigame/<game>/p/<id>`).
- `group` (optional): sidebar heading (e.g. `'Stages'`, `'Characters'`). Pages without a group
  sit under the game's name.
- `count` (optional): the small number shown beside the page in the sidebar.
- `summary` (optional): a line under the page title.

If `build` throws, the error is logged and the game falls back to its data tables only.

## ctx helpers

| Helper | Returns |
|---|---|
| `ctx.table('EventBBQTycoonManagerTable')` | the table's records (`[]` if it doesn't exist); any table in the data folder works, not only Event* |
| `ctx.text(key, fallback)` | localized text for a `Locale_…` key |
| `ctx.plain(key, fallback)` | the same, without Unity rich-text tags (`<color=…>`, `<b>`, `<size=…>`) |
| `ctx.img(name)` | the lowercased sprite name if `icons-event` has that image, else `null` |
| `ctx.reward(rewardId)` | `{ userExp, items: [{ name, amount, chance }] }` or `null`; put it in a cell as `{ reward: ctx.reward(id) }` |
| `ctx.rewardName(type, id)` | the name of an item / currency, e.g. `ctx.rewardName('Currency', 1)` or `('Item', 7062001)` |
| `ctx.scene(id)` | `{ scene, label }` for a story scene id (`d_contents_…`), or `null` |
| `ctx.help(hubGroup)` | in-game help pages (MinigameHubTable group); show with a `help` section |
| `ctx.intro` | `{ id, label }` of the game's intro story, or `null` |
| `ctx.date(v)` | `'YYYY-MM-DD HH:MM'` for a date field, or `null` |
| `ctx.big(v)` | a json-bigint `{ s, e, c }` field as a Number |
| `ctx.double(v)` | a double field (stored as raw 64-bit bits) as a Number |
| `ctx.cell(key, v)` | the generic Data tables conversion of one value |

## Sections

| Section | Shape |
|---|---|
| text | `{ type: 'text', title?, text }` |
| list | `{ type: 'list', title?, note?, items: [value, ...] }` (bullets) |
| facts | `{ type: 'facts', title?, note?, items: [[label, value], ...] }` (items with an empty / null value are skipped) |
| table | `{ type: 'table', title?, sub?, note?, columns: ['Name', { label: 'Score', num: true }], rows: [[value, ...], ...] }` |
| gallery | `{ type: 'gallery', title?, items: [{ img, caption }] }` (img is a sprite name) |
| help | `{ type: 'help', help: ctx.help(hub) }` |

## Values (table cells, fact values, list items)

| Value | Shows |
|---|---|
| `'text'`, `123` | text (`\n` for line breaks) / a number with thousands separators |
| `[a, b]` | one per line; a list of images sits side by side |
| `{ img: ctx.img(name), caption, size: 'small' or 'large' }` | a sprite (`img: null` shows only the caption) |
| `{ reward: ctx.reward(id) }` | the reward's items |
| `ctx.scene(id)` | a link to the story |
| `{ page: 'stage-3', label }` | a link to another page of this game |
| `{ b: value }`, `{ key: 'raw_id' }`, `{ tag: 'Boss', tone: 'good' or 'bad' or 'accent' }` | bold / small monospace / a pill |
| `{ text, sub }` | text with a small grey line under it |

## Conventions

- Units: work them out from the data and the help text, and say them ("20 s", "150%").
  Times are often in 1/100 s (BBQ Master: `time_limit` 12000 = 120 s), but check each game.
  Rates are often per 10,000 or per 1,000.
- Give tables headers in plain words, not column names. Resolve ids to names and pictures.
- Keep each page under about 1 MB. Split big lists (one page per stage or chapter, etc.).
- Check a viewer with `node tools/check-eventgame.js <id>` (`--dump` prints the JSON).
