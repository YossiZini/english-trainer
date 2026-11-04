# Sprint 20 — Decimals, ratio and linear functions (archived backlog)

**Goal:** Let a student learn decimals, ratio and proportion, and linear functions in three new math chapters (4, 12 and 13), each lesson with a picture for every rule, computed questions and an independent check.
**Period:** 2026-11-03 → 2026-11-04
**Items:** 24 (3 stories), all done

## Scope

- A chapter on decimals right after Fractions, as chapter 4 (owner, 2026-11-03): tenths and hundredths, comparing and rounding, adding and subtracting, multiplying and dividing; the chapters after it show one number later, every lesson id and student's progress unchanged
- A chapter on ratio and proportion after Equations, as chapter 12 (owner's decision): what a ratio is, dividing in a ratio, proportion and a missing term
- A chapter on linear functions last, as chapter 13: from a rule to a table to a line, slope and the y-intercept, crossing the axes and stories; some questions asked on their own graph
- About 10 lessons: decimals 4, ratio 3, linear functions 3 (owner's decision)
- Pictures only, no animations this sprint (owner's decision)
- Each lesson: a Hebrew teaching document with a picture for every rule, 30 computed multiple-choice questions and an independent check; the lessons read in order on the website and in the bot
- The reading-order rules for each new kind of mixed text (decimals, ratios like 3 : 5, y = 2x + 1) measured and written into the math guide before its chapter

## Stories

### P1 s1 · A chapter on decimals (chapter 4)

As a student, I want a chapter on decimals, so that the decimals I already meet in average and percentage (38 of them) make sense and I can compare and calculate with them. Size: L (~8 h). Topic 110, shown as chapter 4 after Fractions; Order of operations to Equations show as chapters 5–11 (lesson ids and progress unchanged). Lessons: 4.1 tenths and hundredths (place value; decimal ↔ fraction: 0.7 = 7/10, 0.25 = 1/4; zeros at the end: 0.5 = 0.50), 4.2 comparing and rounding (0.45 < 0.5 although it is longer; on the number line; rounding to a whole and to a tenth), 4.3 adding and subtracting (line up the points, fill zeros, money), 4.4 multiplying and dividing (× and ÷ 10, 100, 1000 move the point; count the digits after the point; dividing by a decimal moves both points). Built like chapters 7–10: seeds/decimals/, exact arithmetic on whole numbers (no floating point), wrong options from the common mistakes (longer is larger, points not lined up, the wrong number of digits after the point, 0.3 × 0.2 = 0.6). New pictures: a hundred grid, a decimal number line, a place-value table, column addition with the points lined up.

- [x] Math shows "שברים עשרוניים" as chapter 4 with lessons 4.1–4.4; the later chapters show as 5–11; every existing lesson and exercise identical by id
- [x] Each lesson: a Hebrew teaching document with a picture for every rule and 30 multiple-choice questions (10 per level); answers and wrong options computed; every wrong option differs from the answer by value
- [x] backend/scripts/checks/topic110.js recomputes every answer with its own decimal parser, reads every picture back against its caption and enforces the guide's decimal rules; a planted fault for each rule fails it
- [x] Decimals and equations read in order on one line at 360/390/1366 px on the real pages and in the bot's messages (measured); lesson names read on their own in the bot's numbered list; docs/topics-status.md and the math guide updated

*Closing note:* Chapter 4 complete in PR #94 (ready for review, not merged). Follow-up: the Fractions chapter breaks equations on phones on main too (58 at 360/390 px).

| Task | Owner | Note |
|---|---|---|
| Decimal reading-order rules into the math guide | Claude | 27 cases measured (paragraph, caption/bot line, option box). Positive decimals need no isolate; .5 reads as 5., a negative one needs its isolate, ₪ flips inside an isolate; lists read right to left, so an order is asked as a chain. Rules in the math guide, commit 53130bd, draft PR #94. |
| Chapter 4 in the order; decimals helpers | Claude | seeds/decimals/common.js: exact decimals (BigInt millionths), formatting, wrong options (points not lined up, column digits, one factor's places, point moved), decQ/choiceQ on mathLesson; 10 tests. The chapter order goes in with the lessons. Commit 0d01b6a, PR #94. |
| Decimal pictures | Claude | hundredGrid, decimalLine, placeValue (mark, move arrows), columnCalc (filled zeros) in math-svg.js, existing functions untouched; data-* for the check; 13 tests of what each option draws. Commit 0d01b6a, PR #94. |
| Lesson 4.1: tenths and hundredths | Claude | 110.1: 5 rules with squares and a place-value table; 30 questions (2 on their own square). Order 110 after 101 in API and web, tests updated; identity: 4 lessons + 120 exercises added, nothing else changed. Commit 662d0d4, PR #94. |
| Lesson 4.2: comparing and rounding | Claude | 110.2: 6 rules (wholes first, tenths then hundredths, number line, order, rounding to a whole and a tenth); 30 questions, 3 on their own number line; orders asked as chains. Commit 662d0d4. |
| Lesson 4.3: adding and subtracting | Claude | 110.3: 5 rules with column sums; 30 questions, wrong options from points not lined up and column digits; money and length stories. Commit 662d0d4. |
| Lesson 4.4: multiplying and dividing | Claude | 110.4: 6 rules (move the digits, groups, area model, long division, both points); 30 questions. Backend 192, web content 404, bot 108 tests pass. Commit 662d0d4. |
| Independent check topic110.js | Claude | topic110.js: 120/120 answers re-computed (own exact arithmetic, stories from their words), 121 pictures read back, guide rules on raw text; 38/38 planted faults caught. Found 3 defects (a wrong equation shown in 4.4's warning, two explanations starting with an isolate), fixed. Commit 90a56f0. |
| Wire up, verify, document; PR | Claude | Equations with a stacked fraction broke on phones next to the fraction (15 runs): oneLine option (opt-in, other chapters byte-identical) + math-line on the web. New reading-order-check.js: 10,695 runs in order (pages at 1366/390/360 + bot). 18/18 picture questions above the bar. Backend 193, web 453, bot 108; identity kept. Docs updated. Commit 53f7f46; PR #94 ready. |

### P1 s2 · A chapter on ratio and proportion (chapter 12)

As a student, I want a chapter on ratio and proportion, so that I can compare amounts, share in a ratio and find a missing amount. Size: M–L (~6 h). Topic 111, shown as chapter 12 after Equations (owner's decision): a missing term is solved as a short equation, and direct proportion leads into linear functions. Lessons: 12.1 what a ratio is (3 : 5, the order matters, simplifying, the part of the whole: 3 : 5 means 3/8 of all), 12.2 dividing in a ratio (40 sweets in the ratio 3 : 5: count the parts, one part, each share; from one share to the other and to the whole), 12.3 proportion (equal ratios, a missing term solved with an equation, unit price and recipes). Pictures: bar models of equal parts in two colours, tables of equal ratios. seeds/ratio/, computed answers, wrong options from the common mistakes (the ratio reversed, dividing by one side instead of the sum, adding instead of multiplying).

- [x] Math shows "יחס ופרופורציה" as chapter 12 with lessons 12.1–12.3; every existing lesson and exercise identical by id
- [x] Each lesson: a Hebrew teaching document with a picture for every rule and 30 computed multiple-choice questions (10 per level)
- [x] backend/scripts/checks/topic111.js recomputes every answer, reads every bar model back against its caption and enforces the guide's ratio rules; planted faults fail it
- [x] Ratios (3 : 5) and equations read in order on one line at 360/390/1366 px and in the bot's messages (measured); topics-status and the math guide updated

*Closing note:* Chapter 12 complete in PR #95. GitHub's PR record stuck on 3e0e580 after the last push (merge failed: head branch out of date); an empty re-sync commit 0b5d47e, at the owner's request, fixed it. Ready to merge.

| Task | Owner | Note |
|---|---|---|
| Ratio reading-order rules, helpers and the bar model | Claude | 18 cases measured: 3:5 reads right with no isolate; 3 : 5 with spaces shows as 5 : 3. Rules in the guide (406ed4e). ratio/common.js, ratioBar and ratioTable with tests (ddc8d9e). Draft PR #95. |
| Lesson 12.1: what a ratio is | Claude | 111.1: 5 rules, 30 questions (3 on their own bar model). Commit f1d959d. |
| Lesson 12.2: dividing in a ratio | Claude | 111.2: 5 rules, 30 questions (2 on their own bar model), shares, differences, three terms. Commit f1d959d. |
| Lesson 12.3: proportion and a missing term | Claude | 111.3: 6 rules (cross products, factor, equation with a balance, unit rate, recipe and scale), 30 questions (2 on their own table). Identity kept; backend 204, web content 404. Commit f1d959d. |
| Independent check topic111.js | Claude | topic111.js: 90/90 answers re-computed (stories from their words), 85 pictures read back (bars, tables, balance), guide rules on raw text; 32/32 planted faults caught. Found 2 explanations starting with an isolate, fixed. Commit 3e0e580. |
| Wire up, verify, document; PR | Claude | Walker now measures ratios in Hebrew text: 5,443 runs in order (pages at 1366/390/360 + bot). 24/24 picture-question cases above the bar. Backend 204, bot 108, checks 100–111 clean; identity kept. Docs updated. Commit 7c55898; PR #95 ready. |

### P1 s3 · A chapter on linear functions (chapter 13)

As a student, I want a chapter on linear functions, so that I see how a rule like y = 2x + 1 becomes a table, points and a straight line, and can read it back. Size: L (~7 h). Topic 112, chapter 13, last. Lessons: 13.1 from a rule to a line (a table of values, its points on the grid lie on a line, y = kx through the origin from chapter 12, is a point on the line: put it in), 13.2 slope and the y-intercept (y = mx + b: where the line meets the y axis, how much y grows when x grows by 1, rising, falling or flat; which rule fits a drawn line), 13.3 crossing the axes and stories (where y = 0 is an equation from chapter 11; a taxi at 10 ₪ plus 3 ₪ a kilometre as a line; reading a value off the graph). Pictures: coordGrid draws a whole line across the grid behind a new option (default output unchanged). Some questions are asked on their own graph (question_picture, as in the axes chapter; PNGs for the bot).

- [x] Math shows "פונקציה קווית" as chapter 13 with lessons 13.1–13.3; every existing lesson and exercise identical by id
- [x] Each lesson: a Hebrew teaching document with a graph for every rule and 30 computed multiple-choice questions; graph questions end above the pinned bar at 360/390/1366 px and are sent as photos in the bot
- [x] backend/scripts/checks/topic112.js reads every line back from its SVG (two grid points give the slope and the intercept), recomputes every answer and enforces the guide's rules for y; planted faults fail it
- [x] Rules with x and y read in order on one line on the real pages and in the bot's messages (measured); topics-status and the math guide updated

*Closing note:* PR #96 ready to merge: chapter 13, 3 lessons, 90 questions (23 on their own picture), check with 42 of 42 planted faults caught.

| Task | Owner | Note |
|---|---|---|
| Reading-order rules for y, helpers and the line picture | Claude | d995e67: 40 cases measured (new rule: no two bare Latin letters with only a comma or colon between); coordGrid graphs, valueTable (shares ratioTable's drawing, output unchanged), functions/common.js, 112 in both orders. |
| Lesson 13.1: from a rule to a line | Claude | 93807de: 13.1, 4 rules with pictures, 30 questions (8 on their own table or graph). |
| Lesson 13.2: slope and the y-intercept | Claude | 93807de: 13.2, 5 rules with pictures (steps of a slope), 30 questions (9 on their own picture). |
| Lesson 13.3: crossing the axes and stories | Claude | 93807de: 13.3, 5 rules with pictures, 30 questions (taxi, savings, candles, a game; 7 on their own graph). |
| Independent check topic112.js | Claude | 93807de: topic112.js: 90/90 re-computed, 59 pictures read back from pixels; 42 of 42 planted faults caught. |
| Wire up, verify, document; PR | Claude | 6e0daed, PR #96: 4,104 runs in order (pages + bot); all 72 picture questions above the bar even as the first question (11 reworded or given 5-unit grids); identity by id; backend 219, web 453, bot 108; build green. |

