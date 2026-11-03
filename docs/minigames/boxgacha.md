# Costume Gacha

A costume box gacha: each banner holds 10 prizes, every draw removes one, and 10 draws win them all. Draws get pricier as the box empties; the costume can only come out from the 5th draw.

This guide was generated from the Nikke Library's reading of the game data: the viewer `lib/eventgames/boxgacha.js` turns the `Event*` tables in `D:\Nikke Datamine\mpkparser\jsons` into the rules below. Numbers, units and formulas are the viewer's readings; anything it was not sure of is listed under "Uncertain / unknown". Long lists are cut to 8 rows.

## Overview

### How it works

- **Box**: 10 prizes per banner; each draw gives one and it never comes back
- **Price**: #1: Free, #2: 1, #3: 1, #4: 2, #5: 4, #6: 4, #7: 6, #8: 6, #9: 6, #10: 6 tickets
- **Rates**: Base rates are per draw, out of 10,000; the rates of prizes already won are shared out over the prizes left
- **Top prize**: Weight 0 on draws 1–4, so it can only come out from the 5th draw (on a two-costume banner, both costumes)
- **Leftover tickets**: Returned by mail as Free Gems when the event ends

### Banners

| # | Costume | Ticket | Banner |
|---|---|---|---|
| 1 | Rupee: Rabbit Deluxe | Bunny Costume Ticket | `EVENT_BANNER_COSTUME_GACHA_C200` |
| 2 | Drake: Villain Racer | Villain Racer Key | `EVENT_BANNER_COSTUME_GACHA_C101_01` |
| 3 | 2B: YoRHa Uniform 1 | Moonlight Gear | `EVENT_BANNER_COSTUME_GACHA_C810_02` |
| 4 | Rupee: Rabbit Deluxe (rerun) | Bunny Costume Ticket | [Rerun]; `EVENT_BANNER_COSTUME_GACHA_C200` |
| 5 | Dorothy: Nostalgia | A Happy "Future" | `EVENT_BANNER_COSTUME_GACHA_C233_01` |
| 6 | Noise: Classic Diva | Diva Concert Ticket | `EVENT_BANNER_COSTUME_GACHA_C430_02` |
| 7 | Noise: Classic Diva (rerun) | Diva Concert Ticket | `EVENT_BANNER_COSTUME_GACHA_C430_02` |
| 8 | Emilia: Clumsy Maid | Fortune Cookie | `EVENT_BANNER_COSTUME_GACHA_C821_01` |

(36 more rows of 44 not shown; see the data table.)

### In-game rules (first banner)

- Gacha Draw Details
- - First draw = Free
- - Second draw = 1 ticket
- - Third draw = 1 ticket
- - Fourth draw = 2 tickets
- - Fifth draw = 4 tickets
- - Sixth draw = 4 tickets
- - Seventh draw = 6 tickets
- - Eighth draw = 6 tickets
- - Ninth draw = 6 tickets
- - Tenth draw = 6 tickets
- Ticket Purchase
- - Purchase from Ticket Shop
- - No purchase limit
- Product Drop Rules
- - Players will get 1 product with every draw from the gacha
- - Previously obtained products will not appear again
- - Players can obtain all products after 10 gacha draws
- Product Drop Rate
- - The product drop rate differs in every draw from the gacha
- - Players have the chance to win the first prize from their 5th draw onwards
- Drop Rate of Obtained Products
- - Drop rate of obtained products will be allocated to unobtained products
- - The drop rate will be allocated according to the basic rate of unobtained products
- After All Products Have Been Obtained
- - Ticket purchase will be unavailable
- - Raffle will be unavailable
- Returning of Remaining Tickets
- - Remaining tickets will be returned via mail as Free Gems

## Banners

### Rupee: Rabbit Deluxe

Bunny Costume Ticket · 36 tickets to empty the box

- **Ticket**: Bunny Costume Ticket
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c200`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Rupee: Rabbit Deluxe** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Manufacturer Arms ×200 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Custom Module ×2 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Skill Manual I ×90 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Darling for a Day ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Central Government Supply Chest I ×14 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Burst Manual I ×22 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Drake: Villain Racer

Villain Racer Key · 36 tickets to empty the box

- **Ticket**: Villain Racer Key
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c101_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Drake: Villain Racer** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×2 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Central Government Supply Chest I ×14 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Date with the CO ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### 2B: YoRHa Uniform 1

Moonlight Gear · 36 tickets to empty the box

- **Ticket**: Moonlight Gear
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c810_02`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **2B: YoRHa Uniform 1** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×2 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Central Government Supply Chest I ×14 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Date with the CO ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Rupee: Rabbit Deluxe (rerun)

Bunny Costume Ticket · rerun · 36 tickets to empty the box

- **Ticket**: Bunny Costume Ticket
- **Whole box**: 10 draws, 36 tickets
- **Rerun**: Costumes you already own are left out, and the draw count shrinks to match
- **Banner art**: `base_gacha_type_costume_c200`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Rupee: Rabbit Deluxe** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Manufacturer Arms ×200 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Custom Module ×2 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Skill Manual I ×90 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Darling for a Day ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Central Government Supply Chest I ×14 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Burst Manual I ×22 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Dorothy: Nostalgia

A Happy "Future" · 36 tickets to empty the box

- **Ticket**: A Happy "Future"
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c233_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Dorothy: Nostalgia** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×2 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Central Government Supply Chest I ×14 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Date with the CO ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Noise: Classic Diva

Diva Concert Ticket · 36 tickets to empty the box

- **Ticket**: Diva Concert Ticket
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c430_02`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Noise: Classic Diva** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×2 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Central Government Supply Chest I ×14 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Date with the CO ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Noise: Classic Diva (rerun)

Diva Concert Ticket · 36 tickets to empty the box

- **Ticket**: Diva Concert Ticket
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c430_02`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Noise: Classic Diva** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×2 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Central Government Supply Chest I ×14 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Date with the CO ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Emilia: Clumsy Maid

Fortune Cookie · 36 tickets to empty the box

- **Ticket**: Fortune Cookie
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c821_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Emilia: Clumsy Maid** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×2 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Central Government Supply Chest I ×14 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Date with the CO ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Modernia: Second Affection

Black Crown · 36 tickets to empty the box

- **Ticket**: Black Crown
- **Free ticket**: Black Crown
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c260_02`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Modernia: Second Affection** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×2 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Central Government Supply Chest I ×14 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Date with the CO ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Crown: Naked King

White Crown · 36 tickets to empty the box

- **Ticket**: White Crown
- **Free ticket**: White Crown
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c330_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Crown: Naked King** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×2 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Central Government Supply Chest I ×14 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Date with the CO ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Viper: Shine of Love

Love Letter · 36 tickets to empty the box

- **Ticket**: Love Letter
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c112_02`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Viper: Shine of Love** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×2 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Central Government Supply Chest I ×14 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Date with the CO ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Marciana: School Days

Gem Parfait · 36 tickets to empty the box

- **Ticket**: Gem Parfait
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c321_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Marciana: School Days** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×2 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Central Government Supply Chest I ×14 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Date with the CO ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Asuka: Test Plugsuit

NERV Secret Key · 36 tickets to empty the box

- **Ticket**: NERV Secret Key
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c830_03`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Asuka: Test Plugsuit** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×2 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Central Government Supply Chest I ×14 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Date with the CO ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Scarlet: Black Shadow: Longing Flower

Moonlit Cup · 36 tickets to empty the box

- **Ticket**: Moonlit Cup
- **Free ticket**: Moonlit Cup
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c225_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Scarlet: Black Shadow: Longing Flower** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Collection Item Mileage Box ×200 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Core Dust Case ×12 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Cinderella: Glass Princess

Glass Slippers · 36 tickets to empty the box

- **Ticket**: Glass Slippers
- **Free ticket**: Glass Slippers
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c511_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Cinderella: Glass Princess** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Collection Item Mileage Box ×200 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Core Dust Case ×12 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Naga: Last Girlhood

New Year Festival Ticket · 36 tickets to empty the box

- **Ticket**: New Year Festival Ticket
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c450_02`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Naga: Last Girlhood** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Collection Item Mileage Box ×200 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Core Dust Case ×12 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Helm: Post-Shower Moment

Bath Boat · 36 tickets to empty the box

- **Ticket**: Bath Boat
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c352_02`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Helm: Post-Shower Moment** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Collection Item Mileage Box ×200 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Core Dust Case ×12 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Asuka: Test Plugsuit (rerun)

NERV Secret Key · rerun · 36 tickets to empty the box

- **Ticket**: NERV Secret Key
- **Whole box**: 10 draws, 36 tickets
- **Rerun**: Costumes you already own are left out, and the draw count shrinks to match
- **Banner art**: `base_gacha_type_costume_c830_03`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Asuka: Test Plugsuit** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×2 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Central Government Supply Chest I ×14 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Date with the CO ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Little Mermaid: Abyss Flower

Deep-Sea Flower · 36 tickets to empty the box

- **Ticket**: Deep-Sea Flower
- **Free ticket**: Deep-Sea Flower
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c513_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Little Mermaid: Abyss Flower** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Collection Item Mileage Box ×200 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Core Dust Case ×12 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Mihara: Bonding Chain: Pain Eater

Rose-Colored Handcuffs · 36 tickets to empty the box

- **Ticket**: Rose-Colored Handcuffs
- **Free ticket**: Rose-Colored Handcuffs
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c162_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Mihara: Bonding Chain: Pain Eater** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Collection Item Mileage Box ×200 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Core Dust Case ×12 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### EVE: Skin Suit

Dreamcatcher · 36 tickets to empty the box

- **Ticket**: Dreamcatcher
- **Free ticket**: Dreamcatcher
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c850_03`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **EVE: Skin Suit** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Manufacturer Arms ×200 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Custom Module | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Scarlet: Racer's High

Racing Flag · 36 tickets to empty the box

- **Ticket**: Racing Flag
- **Free ticket**: Racing Flag
- **Whole box**: 10 draws, 36 tickets
- **Note**: Scarlet - Racer's High can be obtained from the Costume Gacha or the CD-Key provided in Stellar Blade™ Complete Edition. / When the CD-Key is redeemed, it will still be accepted even if you already own the costume, but the same costume cannot be obtained again. In this case, the code used cannot be canceled or refunded. Please check if you already own the costume before using the code.
- **Banner art**: `base_gacha_type_costume_c222_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Scarlet: Racer's High** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Manufacturer Arms ×200 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Custom Module | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### 2B: YoRHa Uniform 1 (rerun)

Moonlight Gear · rerun · 36 tickets to empty the box

- **Ticket**: Moonlight Gear
- **Whole box**: 10 draws, 36 tickets
- **Rerun**: Costumes you already own are left out, and the draw count shrinks to match
- **Banner art**: `base_gacha_type_costume_c810_02`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **2B: YoRHa Uniform 1** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×2 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Central Government Supply Chest I ×14 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Date with the CO ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Rapi: Red Hood: Red Flavor

Swimming Bag · 36 tickets to empty the box

- **Ticket**: Swimming Bag
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c016_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Rapi: Red Hood: Red Flavor** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Manufacturer Arms ×200 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Custom Module | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Rouge: Unlucky Rabbit

Lucky Headband · 36 tickets to empty the box

- **Ticket**: Lucky Headband
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c272_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Rouge: Unlucky Rabbit** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Manufacturer Arms ×200 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Custom Module | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### D: Killer Wife: Secret Police

A.C.P.U. ID Card · 36 tickets to empty the box

- **Ticket**: A.C.P.U. ID Card
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c043_02`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **D: Killer Wife: Secret Police** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Manufacturer Arms ×200 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Custom Module | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Red Hood: Retro Days

Old Key · 36 tickets to empty the box

- **Ticket**: Old Key
- **Free ticket**: Old Key
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c470_02`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Red Hood: Retro Days** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×4 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Core Dust Case ×80 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Recruit Voucher ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Nayuta: Wu Wei

Golden Lotus · 36 tickets to empty the box

- **Ticket**: Golden Lotus
- **Free ticket**: Golden Lotus
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c223_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Nayuta: Wu Wei** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×4 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Core Dust Case ×80 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Recruit Voucher ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Blanc: Fortune Express

Bunny's Golden Ticket · 36 tickets to empty the box

- **Ticket**: Bunny's Golden Ticket
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c270_03`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Blanc: Fortune Express** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×4 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Core Dust Case ×80 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Recruit Voucher ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Alice: Märchen Dream

Fairy Tale Pocket Watch · 36 tickets to empty the box

- **Ticket**: Fairy Tale Pocket Watch
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c191_02`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Alice: Märchen Dream** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×4 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Core Dust Case ×80 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Recruit Voucher ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Mast: Romantic Maid: Tea Service

Pirate Swimsuit Tea Bag · 36 tickets to empty the box

- **Ticket**: Pirate Swimsuit Tea Bag
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c354_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Mast: Romantic Maid: Tea Service** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×4 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Core Dust Case ×80 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Recruit Voucher ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Privaty: Sharp Lesson

Teaching License · 36 tickets to empty the box

- **Ticket**: Teaching License
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c170_04`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Privaty: Sharp Lesson** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×4 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Core Dust Case ×80 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Recruit Voucher ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Drake: Villain Racer (rerun)

Villain Racer Key · rerun · 36 tickets to empty the box

- **Ticket**: Villain Racer Key
- **Whole box**: 10 draws, 36 tickets
- **Rerun**: Costumes you already own are left out, and the draw count shrinks to match
- **Banner art**: `base_gacha_type_costume_c101_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Drake: Villain Racer** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×2 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Central Government Supply Chest I ×14 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Date with the CO ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Liberalio: Dreaming Lake

Palette of Harmony · 36 tickets to empty the box

- **Ticket**: Palette of Harmony
- **Free ticket**: Palette of Harmony
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c262_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Liberalio: Dreaming Lake** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×4 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Core Dust Case ×80 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Recruit Voucher ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Anis: Star: Starlight / Anis: Star: T.T. STAR

Bottle of Starlight · 36 tickets to empty the box

- **Ticket**: Bottle of Starlight
- **Free ticket**: Bottle of Starlight
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c017_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Anis: Star: Starlight** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Anis: Star: T.T. STAR | 5 | 0% | 0% | 0% | 0% | 0.3% | 0.3% | 0.3% | 0.3% | 0.3% | 0.3% |
| 3 | Advanced Recruit Voucher ×10 | 2 | 0% | 2.8% | 2.8% | 2.8% | 2.8% | 2.8% | 2.8% | 2.8% | 2.8% | 2.8% |
| 3 | Recruit Voucher ×10 | 2 | 0% | 3.2% | 3.2% | 3.2% | 3.2% | 3.2% | 3.2% | 3.2% | 3.2% | 3.2% |
| 4 | Elite Maintenance Kit ×15 | 1 | 7.15% | 7.15% | 7.15% | 7.15% | 7.15% | 7.15% | 7.15% | 7.15% | 7.15% | 7.15% |
| 4 | Custom Module ×4 | 1 | 7.5% | 7.5% | 7.5% | 7.5% | 7.5% | 7.5% | 7.5% | 7.5% | 7.5% | 7.5% |
| 5 | Core Dust Case ×80 | 1 | 13.5% | 13.5% | 13.5% | 13.5% | 13.5% | 13.5% | 13.5% | 13.5% | 13.5% | 13.5% |
| 5 | Intermediate Maintenance Kit ×10 | 1 | 13.5% | 13.5% | 13.5% | 13.5% | 13.5% | 13.5% | 13.5% | 13.5% | 13.5% | 13.5% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Scarlet: Racer's High (rerun)

Racing Flag · rerun · 36 tickets to empty the box

- **Ticket**: Racing Flag
- **Free ticket**: Racing Flag
- **Whole box**: 10 draws, 36 tickets
- **Rerun**: Costumes you already own are left out, and the draw count shrinks to match
- **Banner art**: `base_gacha_type_costume_c222_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Scarlet: Racer's High** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Manufacturer Arms ×200 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Custom Module | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### EVE: Skin Suit (rerun)

Dreamcatcher · rerun · 36 tickets to empty the box

- **Ticket**: Dreamcatcher
- **Free ticket**: Dreamcatcher
- **Whole box**: 10 draws, 36 tickets
- **Rerun**: Costumes you already own are left out, and the draw count shrinks to match
- **Banner art**: `base_gacha_type_costume_c850_03`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **EVE: Skin Suit** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Manufacturer Arms ×200 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Custom Module | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Moran: King of Flowers

Worn-Out Script · 36 tickets to empty the box

- **Ticket**: Worn-Out Script
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c281_02`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Moran: King of Flowers** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×4 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Core Dust Case ×80 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Recruit Voucher ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Little Mermaid: Shell Princess

Aurora Seashell · 36 tickets to empty the box

- **Ticket**: Aurora Seashell
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c513_03`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Little Mermaid: Shell Princess** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×4 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Core Dust Case ×80 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Recruit Voucher ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Dorothy: Nostalgia (rerun)

A Happy "Future" · rerun · 36 tickets to empty the box

- **Ticket**: A Happy "Future"
- **Whole box**: 10 draws, 36 tickets
- **Rerun**: Costumes you already own are left out, and the draw count shrinks to match
- **Banner art**: `base_gacha_type_costume_c233_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Dorothy: Nostalgia** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Manufacturer Arms ×200 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×2 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Recruit Voucher ×5 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Central Government Supply Chest I ×14 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Date with the CO ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Phantom: Saint Thief

Sacred Phantom Thief Mask · 36 tickets to empty the box

- **Ticket**: Sacred Phantom Thief Mask
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c580_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Phantom: Saint Thief** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×4 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Core Dust Case ×80 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Recruit Voucher ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Sugar: Killer Rabbit

Bunny Sugar Cube · 36 tickets to empty the box

- **Ticket**: Bunny Sugar Cube
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c140_03`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Sugar: Killer Rabbit** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×4 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Core Dust Case ×80 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Recruit Voucher ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Snow White: Heavy Arms: Lacrimosa

Posy of Pure White Flowers · 36 tickets to empty the box

- **Ticket**: Posy of Pure White Flowers
- **Free ticket**: Posy of Pure White Flowers
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c471_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Snow White: Heavy Arms: Lacrimosa** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×4 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Core Dust Case ×80 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Recruit Voucher ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

### Marian: Queen: Last Affection

Heartfelt Bouquet · 36 tickets to empty the box

- **Ticket**: Heartfelt Bouquet
- **Free ticket**: Heartfelt Bouquet
- **Whole box**: 10 draws, 36 tickets
- **Banner art**: `base_gacha_type_costume_c019_01`

#### Prizes and base rates

| Tier | Prize | From draw | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Marian: Queen: Last Affection** | 5 | 0% | 0% | 0% | 0% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% | 0.05% |
| 2 | Advanced Recruit Voucher ×10 | 2 | 0% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% | 0.4% |
| 2 | Recruit Voucher ×10 | 2 | 0% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% | 0.55% |
| 3 | Elite Maintenance Kit ×15 | 1 | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% | 1% |
| 3 | Custom Module ×4 | 1 | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% | 1.55% |
| 3 | Core Dust Case ×80 | 1 | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% | 1.75% |
| 4 | Recruit Voucher ×5 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |
| 4 | Intermediate Maintenance Kit ×10 | 1 | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% | 16% |

(2 more rows of 10 not shown; see the data table.)

Base rate per draw (out of 100%). A prize you have won is gone; your real chance is its base rate ÷ (100% − the base rates of prizes already won).

#### Cost per draw

| Draw | Tickets | Running total |
|---|---|---|
| 1 | Free | 0 |
| 2 | 1 | 1 |
| 3 | 1 | 2 |
| 4 | 2 | 4 |
| 5 | 4 | 8 |
| 6 | 4 | 12 |
| 7 | 6 | 18 |
| 8 | 6 | 24 |

(2 more rows of 10 not shown; see the data table.)

## Data sources

All in `D:\Nikke Datamine\mpkparser\jsons` as `<Table>.json`.

| Table | Rows | Fields |
|---|---|---|
| `EventBoxGachaTable` | 44 | `id`, `event_id`, `name`, `description`, `on_info`, `info_description`, `event_item_type`, `free_ticket_item_id`, `event_item_id`, `price_group`, `prob_group`, `gacha_reward_group`, `shop_id`, `ui_prefab`, `gacha_movie`, `remain_period_text_color` |
| `EventBoxGachaPriceTable` | 440 | `id`, `group`, `count`, `item_type`, `item_id`, `item_count` |
| `EventBoxGachaProbTable` | 200 | `id`, `group`, `count`, `order`, `rate` |
| `EventBoxGachaRewardTable` | 420 | `id`, `group`, `order`, `tier`, `item_type`, `item_id`, `item_count` |

The viewer also reads: `EventManagerTable`.

## Uncertain / unknown

The viewer flagged nothing as uncertain. Fields it does not show are listed in Data sources; their meaning is not interpreted.
