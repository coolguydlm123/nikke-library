# Shop & Gacha section: guide to the pages and the data behind them

This guide explains the **Shop & Gacha** section of the Nikke Library, a local web app that reads NIKKE's datamined game tables. You can read it without the code.

Each statement is tagged by where it comes from:
- **[data]** read straight from a table field;
- **[derived]** calculated by the library from table fields (the formula is given);
- **[inferred]** an interpretation that the data doesn't state outright.

Where things live:
- **Tables:** `D:\Nikke Datamine\mpkparser\jsons\<Table>.json`. Each file is either a plain array of rows or `{ records: [...] }`.
- **Text:** looked up by `*_localkey` fields in the locale files (`config.json` gives the path). The library strips the game's rich-text tags (`<color=…>`).
- **Server code:** `lib/shop.js`. Item names, icons and box contents reuse the Stages helpers `rewardInfo` / `rewardName` / `rewardIcon` / `boxOf`, which read `RewardTable` and the item tables. Nikke names and icons come from the Characters section.
- **Page code:** `public/shop.js`, with a few `.shop-*` rules in `public/style.css`.
- **API, for the local server and the static build:**
  - `/api/shop/gacha`, `/api/shop/banner?id=`
  - `/api/shop/passes`
  - `/api/shop/packages`, `/api/shop/package?id=`
  - `/api/shop/login`, `/api/shop/login-event?id=`

Dates are stored as .NET ticks in the form `{ s, e, c: [high, low] }`. **[derived]** ticks = high × 10¹⁴ + low, then converted to a calendar date. The pass seasons decoded this way run month by month from 2022-07 to 2026-11, which fits the game's history.

## Pages

| Page | Address | Shows |
|---|---|---|
| Overview | `#/shop` | A card per page |
| Gacha | `#/shop/gacha` | All 167 recruit banners, newest id first: pick-up Nikke(s), type, SSR rate, Gem cost for 1 and 10 pulls, reward steps, pull limit |
| Banner | `#/shop/banner/<id>` | Costs in every currency, the bonus each pull gives, pity, pull-count rewards, and the rate of every Nikke in the pool |
| Passes | `#/shop/passes` | 50 season passes (dates, missions, costumes on sale), 2 free passes, and other pass mission groups |
| Season pass | `#/shop/pass/<id>` | That season's missions and the pass costumes on sale |
| Free pass | `#/shop/freepass/<id>` | Rank rewards with point thresholds, and missions with point values |
| Pass missions | `#/shop/missions/<pointId>` | A mission group no season pass uses |
| Packages | `#/shop/packages` | 144 paid package shops, plus the login package |
| Package shop | `#/shop/package/<id>` | Each product's contents, purchase limit, grade and value rating |
| Popup offers | `#/shop/popups` | 81 limited-time offers with their trigger and contents |
| Login events | `#/shop/login` | 119 attendance events |
| Login event | `#/shop/login/<id>` | The reward for each login day |

Items show their icon. Random boxes have a "Contents" toggle, and Nikkes link to their Characters page.

---

## Gacha (recruitment)

### Banners: `GachaTypeTable` (167 rows)

| Field | Meaning |
|---|---|
| `id` | Banner id. The list is sorted newest-first by id **[inferred]**: ids rise with release order |
| `type` | GachaPremium (standard), GachaFriend (social), GachaTutorial, GachaCharge, GachaPickup (144), GachaSelectup (5), GachaStepup (12), GachaGuaranteed. The page shows short labels: Standard, Social, Pick-up … |
| `event_id` | The `EventManagerTable` event. Gacha events all share the generic name key `story_event_name_001`, so banners have no usable name **[data]** |
| `gacha_price_group[]` | Up to 3 ways to pay: `gacha_price_type` = currency id (99 Gem, 5100 Recruit Voucher, 5200 Advanced Recruit Voucher, 55xx Selective Recruitment Voucher …), `gacha_price_value_count_1` / `_10` = cost of 1 / 10 pulls, `daily_gacha_discount_price_value_1` = first-pull-of-the-day price when `use_daily_discount_one` is true (Standard: 150 Gems instead of 300) |
| `gacha_provide_count_type` | `OneAndTen` or `OneOnly` (no 10-pull) |
| `grade_prob_id` | The rate set, in `GachaGradeProbTable.group_id` |
| `gacha_reward_id` | `RewardTable` reward given with every pull: 1 Silver Mileage Ticket on Standard, 1 Gold Mileage Ticket on pick-ups **[data]** |
| `gacha_play_max_count`, `is_max_count` / `max_ceiling_count` | Pull limit (step-ups: 1 pull per step; ids 3, 4, 10, 2001: 10) |
| `gacha_play_max_count_reward_id` | Reward for reaching the limit |
| `previous_gacha_id` | The step before, for step-up chains (1001→1004, 1011→1014, 1021→1024) |
| `pickup_char_group_id` | Not used by the page |

**Banner name [derived]:** the pick-up Nikke(s). These are the SSR grade rows whose list holds exactly one character. For a select-up banner, it's the first three selectable Nikkes. Banners with neither are shown as "<type> #<id>".

### Rates: `GachaGradeProbTable` and `GachaListProbTable`

- **`GachaGradeProbTable`** has rows per `group_id`. Each row has `rare` (SSR/SR/R), `prob` (out of 10000, so 350 = 3.5%) **[data]**, `gacha_list_id` (the pool), `customize_list_id` (the pool used for wishlists **[inferred]**) and `prob_max_count`.
- The standard rate set (group 1000) is SSR 3.5% + 0.5%, SR 43%, R 53%, for 4% SSR in all.
- Pick-up sets (for example group 2000) split SSR into pick-up 2% + other SSRs 1.5% + pilgrims 0.5% **[data; the pilgrim label is inferred from the Nikkes listed]**.
- **`GachaListProbTable`** has entries per `group_id`: `gacha_type` (Character, WishlistNormal, WishlistOverspec, GachaSelectup …), `gacha_id` (a `CharacterTable` id), and `prob` (a weight within the list).
- **[derived]** A Nikke's rate = grade row `prob` / 100 × entry `prob` / sum of `prob` in that list.
- The banner page lists each Nikke's rate. The rates on every banner checked add up to 100%.
- Wishlist entries (`WishlistNormal` / `WishlistOverspec`, `gacha_id` 0) appear only in the `customize_list_id` lists, which the page doesn't show. **[inferred]** Those slots are filled from the player's wishlist.
- `prob_max_count` is 10000 on 5 rows and 0 elsewhere. Its meaning (a cap or guarantee counter) is **[uncertain]**; the page shows it as "max-count" in the note.

### Pity, select-up and pull rewards

- **Pity:** `GachaPityTable` has one row, for the Standard banner (`gacha_type_id` 1).
  - Its name is "BONUS RECRUIT"; it runs 2024-10-30 → 2026-12-31 **[data]**.
  - After `need_gacha_count` = 100 pulls you get `reward_amount` = 1 Nikke from `GachaPityCharacterTable` group `pity_character_group` (6 rows, by `order`; 5 resolve to a Nikke in the Characters list, so the page shows 5).
  - `pity_amount` = 10 is shown in neither the UI nor the page. Its meaning is **[uncertain]**.
- **Select-up:** `GachaSelectupListTable` lists the Nikkes a select-up banner (`gacha_type_id`) lets you pick, in `order`; `is_default` marks the pre-selected one.
- **Pull-count rewards:** `GachaPaybackTable` links a banner (`gacha_id`) to a payback id. `GachaPaybackStepTable` gives `step`, `gacha_count` (pulls needed) and `reward_id`. Ten banners have these.
- **Price objects:** `GachaPriceObjectTable` (`object_0`…`object_4`) lists currency ids per price object **[inferred: which currencies the banner UI displays]**. Not shown on the page.
- **Skipped:** `GachaCustomizeTable` (which Nikkes may go on the wishlist: `gacha_id`, `is_char_premium`, `is_wish_list_default`) is not shown. It could become a wishlist page later.

## Passes

### Season passes: `PassManagerTable` (50 rows)

- All 50 rows are `pass_type: Season`, `pass_category: Mission`.
- Each has `season_start_date` / `season_end_date` (ticks) and `pass_point_id`, which links its missions.
- The name keys are test placeholders (`TEST_PASS_NAME`) and `pass_premium_name_localkey` doesn't resolve. That's why seasons are shown by their dates **[data]**.
- **Rank rewards for season passes are not in the data:** there is no pass-rank table among the extracted files.

### Missions: `PassMissionTable` (359 rows)

- Fields: `pass_point_id` (the group), `condition_type`, `condition_value`, `name_localkey` (text with `{0}` = `condition_value`), `reward_id`.
- **[data]** Every reward is `PassPoint` ×5. The page shows these points.
- Seasons use point ids 1–4 in rotation.
- The other groups (10001–10003, 11001–11049, 90002–90099) are used by no season pass. **[inferred]** They belong to event passes.

### Pass costumes

- `PassCostumeShopTable`: `costume_id`, `start_date` / `end_date`, `buy_limit_count`.
- **[derived]** A costume is listed under the season whose dates contain its `start_date`.
- `PassCostumeListTable` links costume shop entries to package shops; the page doesn't use it.

### Free passes ("newbie" passes)

- **`FreeRewardPassManagerTable`** (2 rows): name, description, `rank_skip_currency_id` / `_value` (rank skip: 200 Gems), and `mission_group_id`.
- **`FreeRewardPassTable`**: `pass_rank`, `total_required_point` (cumulative points), `reward_id`, `is_highlight`.
  - "ROAD TO VILLAIN" has 99 ranks.
  - The second pass has no localised name, so it shows as "Free pass 4000001".
- **`FreeRewardPassMissionTable`**: `trigger_condition_type` / `_value`, `point_value`, `renew_type` (AutoDay = daily, AutoWeek = weekly, NoRenew = once).

## Packages (paid shop)

### Paid packages

- **`PackageListTable`** (1433 products):
  - `package_shop_id` is the shop the product belongs to (144 shops).
  - `package_order`, `name_localkey`.
  - `buy_limit_type` (Account = once, Daily, Weekly, Monthly) and `buy_limit_count`.
  - `is_active` (1413 active).
  - `product_id` points to `PackageShopTable`.
- **`PackageShopTable`**: `package_group_id` (contents), `product_grade`, `product_efficiency`, `is_free` (3 free products), `midas_product_id` (store product id).
  - **There are no money prices in the data**, only store ids.
  - **[inferred]** `product_grade` is the price tier within a shop, and `product_efficiency` is the "value" rating shown on sale tags.
- **`PackageGroupTable`**: contents per `package_group_id`, as `product_type` (Item / Currency / CharacterCostume), `product_id` and `product_value` (amount).
- Shops have no names in the data. **[derived]** Each shop is named after its first product.

### Login package

- `LoginPackageShopTable` (1 row): the "New Commander Login Package", with `buy_limit` and `extra_period` (10 extra days to claim).
- `LoginPackageListTable`: `day` and `package_group_id` per day.

### Popup offers

- **`PopupPackageListTable`** (6984 rows, 81 groups):
  - one row per trigger value: `trigger` (UserLevel, ChapterClear, Tower…Clear, CharacterLevelMax, CharacterGradeMax, CharacterCore) and `condition_value`;
  - `time_limit` = 7200 s (2 h) on every row **[data]**;
  - `name_localkey`, `product_grade`, `product_efficiency`.
- **`PopupPackageShopTable`**: `package_group_id` per popup group.
- **[derived]** The page shows one row per group, with the lowest and highest trigger value ("At").

## Login (attendance) events

- **`LoginEventTable`** (1176 rows, 119 events): `event_id`, `day`, `login_event_reward_type` (Normal / Goal), `reward_id`.
  - Events last 1, 5, 7, 14 or 21 days.
  - Goal days are milestone rewards **[inferred from the name]**; the page shows them in bold.
- **`LoginEventResourceTable`**: the featured Nikke (`character_id`), and the make-up option (`is_replenish_active`, `replenish_currency`, `currency_value`).
- **Names:** from `EventManagerTable.name_localkey`. Almost every event is called "Daily Login Event" (a few "No Caller ID"), so the page also shows the featured Nikke and the event id.

---

## Skipped tables (and why)

| Table(s) | Why skipped |
|---|---|
| `ShopTable`, `ShopProductTable`, `ShopPackageTable`, `ShopDiscountProbTable` | The main shop's 3 categories (Hot / Gem / Package) hold placeholder data: prices in "FreeCash" 0, unnamed products, an unresolved "{Locale_System.CASH} Bundle" name. Not useful to show |
| `MailTable`, `MailSender` | Only mail templates (title / description locale keys and a sender). No rewards |
| `GachaCustomizeTable` | Wishlist eligibility; see Gacha above |
| `GachaPriceObjectTable` | Currency ids for the banner UI |
| `PassCostumeListTable` | A link table between costume shop entries and package shops |
| `TutorialGuidePopup*` | UI tutorial text, not a reward table (listed under "Tutorial" in the gap list) |
| `ContentsShop*` | Content shops; not part of this batch |

## Caveats

- Banner and package-shop names are derived, not from the data.
- Banner order uses ids as a proxy for release order; gacha rows have no dates.
- Season pass rank rewards are missing from the extracted data.
- Money prices are not in the data, only store product ids.
- `pity_amount`, `prob_max_count` and `product_efficiency` have uncertain meanings.
- No character stats are shown (standing decision), and nothing uses Spine.
