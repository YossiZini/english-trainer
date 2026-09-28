# Sprint 5 — Animated lessons for order of operations, average and percentage (archived backlog)

**Goal:** Give the three remaining Math topics the same step-by-step animation above their written rules that Fractions has, using the existing player.
**Period:** 2026-09-28 → 2026-09-28
**Items:** 11 (6 stories), all done

## Scope

- One scene set per lesson for topics 2–4 (סדר פעולות חשבון, ממוצע, אחוזים): one scene per rule of the written theory (five rules each), 2–5 steps per scene, Hebrew captions consistent with the text below
- New stage primitives where these topics need them: an expression that highlights the operation being computed and collapses step by step (order of operations), a levelling bar chart that evens out to the average (average), a hundred-grid and a price tag with a discount strip (percentage)
- The player, registry and check script are reused unchanged; the three new scene files are the only content, plus any primitive
- Verification: the animation walk over every step of the three lessons at laptop and phone, screenshots, unit tests for the new primitives; docs/topics-status.md entries and guide note
- No change to the exercises or theory text of these topics

## Stories

### P1 s1 · As a maintainer, I want stage primitives for expressions, bar charts and percent grids, so the three topics can be animated with the same player

Size: ~2.5 h. Add to frontend/src/content/animations/primitives.jsx: Expr (tokens of an expression drawn in a row, LTR, with a highlight box around the operation being computed and a collapsed result that pops in), BarChart (vertical bars with values, optional average line, optional 'levelled' state where surplus slides to the deficit), HundredGrid (10×10 cells, first p shaded, for percent as part of 100), PriceTag (a price with a strip showing the discount or addition). Same palette; unit tests render each with sample data and count elements.

- [x] Expr renders tokens with a highlight on the given range and a result token
- [x] BarChart renders n bars scaled to a max and, when levelled, all bars at the mean
- [x] HundredGrid shades exactly p cells; PriceTag renders price, strip and final price
- [x] Unit tests for the four primitives pass; build green

*Closing note:* Four primitives added with 6 unit tests

| Task | Owner | Note |
|---|---|---|
| Expr + BarChart primitives with tests | Claude | Expr + BarChart in primitives.jsx, tests in primitives.test.js (commit on work branch) |
| HundredGrid + PriceTag primitives with tests | Claude | HundredGrid + PriceTag in primitives.jsx with tests (same commit) |

### P1 s2 · As a student, I want the order-of-operations lesson animated, so I see which operation is computed first and why

Size: ~2 h. content/animations/order-of-operations/102-1.jsx, five scenes matching the theory: parentheses first ((3+4)×2), ×÷ before +− (3+4×2 = 11, not 14), same level left to right (40÷5×2, 9−3+2), nested parentheses (2×(3+(10−4)÷2)), negative result (5−3×4 on a number line). Each step highlights one operation with Expr and collapses it.

- [x] Five scenes in theory order; every step's caption names the operation the highlight shows
- [x] Walk passes at laptop and phone

*Closing note:* 102.1 animated (Expr-based), tests + walk green

| Task | Owner | Note |
|---|---|---|
| Scenes 2.1 סדר פעולות חשבון (5 scenes) + registry entry | Claude | order-of-operations/102-1.jsx: 5 scenes / 14 steps, registered; walk 0 failures |

### P1 s3 · As a student, I want the average lesson animated, so I see the average as levelling the bars

Size: ~2 h. content/animations/average/103-1.jsx, five scenes: sum ÷ count (bars 80/90/100 level to 90), from average to sum (4 bars at 85 stack to 340), missing value (three bars, the fourth grows until the mean line is 80), adding a value moves the mean (3 bars at 10, add 18, mean line rises to 12), word problem (temperatures 20/24/22/26 → 23).

- [x] Five scenes in theory order; the mean line matches the caption's number
- [x] Walk passes at laptop and phone

*Closing note:* average/103-1.jsx: 5 scenes / 14 steps (BarChart, levelled mean); registered; walk 0 failures

| Task | Owner | Note |
|---|---|---|
| Scenes 3.1 ממוצע (5 scenes) + registry entry | Claude | Done with s3 |

### P1 s4 · As a student, I want the percentage lesson animated, so I see percent as part of a hundred and discounts on a price

Size: ~2 h. content/animations/percentage/104-1.jsx, five scenes: percent ↔ fraction ↔ decimal (hundred-grid 40 shaded = 40/100 = 0.4 = 2/5), percent of a number (25% of 80 on a bar cut into 4; 10% trick for 30% of 150), what percent (12 of 40 → 30 on the grid), finding the whole (20 is 40% → grid fills to 50), discount and VAT (price tag 150 − 10% = 135; 200 + 18% = 236; the 20% up then 20% down trap).

- [x] Five scenes in theory order; grid counts and price tags match the captions
- [x] Walk passes at laptop and phone

*Closing note:* percentage/104-1.jsx: 5 scenes / 15 steps (HundredGrid, PriceTag); registered; walk 0 failures

| Task | Owner | Note |
|---|---|---|
| Scenes 4.1 אחוזים (5 scenes) + registry entry | Claude | Done with s4 |

### P2 s5 · As a maintainer, I want the walk, screenshots and docs for the three lessons, so the PR shows the result

Size: ~0.5 h. animation-check.js over all nine animated lessons at laptop and phone (LESSONS filter for the three new ones in the PR text); screenshots to docs/screenshots/sprint-5; docs/topics-status.md entries for 102–104; guide: list the new primitives.

- [x] Walk over 102.1, 103.1, 104.1 passes; screenshots committed; docs updated

*Closing note:* animation-check walk 228 steps / 0 failures; docs/screenshots/sprint-5 (30 shots); topics-status + guide updated

### P3 s6 · As a maintainer, I want the stage height per scene set, so laptop pages have no empty band above the bars

Size: ~0.5 h. Optional `height` on a scene set (default 280) applied to the viewBox; Fractions keeps 280, the new topics pick what they need.

- [x] A scene set can set its stage height; existing lessons unchanged

*Closing note:* Closed as not needed: all 15 new scenes fit the 640×280 stage; no per-scene-set height added

