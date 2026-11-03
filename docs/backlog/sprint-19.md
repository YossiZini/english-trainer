# Sprint 19 — Equations with one unknown (archived backlog)

**Goal:** Let a student understand what an unknown is and solve equations with one unknown step by step on a balance scale, in a new math chapter 10 of seven lessons.
**Period:** 2026-11-03 → 2026-11-03
**Items:** 20 (4 stories), all done

## Scope

- A math chapter "משוואה עם נעלם אחד" with many lessons (owner, 2026-11-03): seven lessons, from the unknown to word problems (owner's decision)
- Explain the concept of an unknown: a number hidden in a box, a letter that stands for it, an equation as a level balance, a solution and how to check it (owner)
- Visual explanations: every rule drawn as a balance scale with boxes and weights (owner's decision: balance pictures; no animations, picture questions or bar model this sprint)
- Chapter 10 at the end, after triangles; every existing lesson, id and student's progress stays unchanged (owner's decision)
- Each lesson: a Hebrew teaching document with pictures, 30 computed multiple-choice questions and an independent check; the lessons reach the bot's math list and read in order there
- First, one home for the math seed helpers copied in three chapters (Sprint 18 retro follow-up), so the new chapter does not copy them a fourth time

## Stories

### P1 s1 · One home for the math seed helpers

As a maintainer, I want the helpers copied in negatives/, axes/ and triangles/common.js in one module, so that the equations chapter builds on them instead of copying them a fourth time. Size: M (~2 h). eq() (with < > escaped), the option check (no Hebrew mixed with digits or Latin letters), withQuestionPicture and the lesson() builder move next to mcq in multiplication/common.js, with one way to pass a question picture (an options object). Sprint 18 retro follow-up.

- [x] negatives/, axes/ and triangles/common.js use the shared helpers; no copy of eq, the option check or lesson() is left
- [x] Every lesson and exercise identical by id after generate-data (the shared helpers change behind options only)
- [x] scripts/checks/topic106.js, topic107.js and topic108.js report no problems; backend tests pass
- [x] math-content-guide.md names the shared helpers

*Closing note:* Merged in PR #88 (2f82a98). Defects found on the way handled in PR #89 (d11, d12).

| Task | Owner | Note |
|---|---|---|
| Shared eq, option check and question picture | Claude | eq, withQuestionPicture and the option check (digits/letters) in multiplication/common.js; chapter 7's 17 picture args now { picture } (05d7ba0, PR #88). |
| Shared lesson() builder | Claude | mathLesson builds chapters 1, 2, 7–9; data byte-identical, checks 106–108 clean, 155/155 tests, guide and topics-status (05d7ba0, PR #88). |

### P1 s2 · The unknown and one-step equations (10.1–10.3)

As a student, I want to learn what an unknown is and solve one-step equations on a balance, so that x + 5 = 12 and 3x = 12 make sense rather than being a trick. Size: L (~8 h). Topic 109, shown as chapter 10 after triangles. 10.1 מהו נעלם? (a number hidden in a box, a letter for it, an equation is a level balance, a solution, checking by putting the number in, equation vs expression); 10.2 חיבור וחיסור: שומרים על איזון (x + 5 = 12, x − 4 = 9, the same on both pans, the inverse operation); 10.3 כפל וחילוק (3x = 12, x ÷ 4 = 5, 12 = 3x). New balance() picture in math-svg.js: two pans, boxes with x and weights, level or tilted, crossed-out items for what leaves both pans, boxes split into equal groups. Equations with the Latin x inside Hebrew are a new kind of mixed text: their rules go into the guide first.

- [x] Math shows "משוואה עם נעלם אחד" as chapter 10 with lessons 10.1–10.3; every existing lesson and exercise identical by id
- [x] Each lesson: a Hebrew teaching document with a balance picture for every rule and 30 multiple-choice questions (10 per level), answers and wrong options computed (the wrong inverse operation, changing one side only, dividing instead of multiplying)
- [x] balance() has a test for each option (what each pan holds, level or tilted, crossed out, groups); backend/scripts/checks/topic109.js solves every equation with its own solver and reads every balance back; planted faults fail it
- [x] Equations with x read in order and stay on one line at 360/390/1366 px (measured) and in Telegram (isolated; options are numbers only); topics-status, the math guide and knowledge updated

*Closing note:* Merged in PR #90 (d164b16).

| Task | Owner | Note |
|---|---|---|
| Bidi rules for equations with x, in the guide first | Claude | Measured first: a lone x reads right; isolate every expression; no text starts with x or an equation; x ÷ 4; options numbers only. In math-content-guide.md (fa7140e). |
| balance() picture and its tests | Claude | balance() in math-svg.js: boxes, weights, cubes, bags, crossed, equal groups, tilt; data-* for readback. 7 tests; 2 planted faults caught. |
| seeds/equations/common.js and lesson 10.1, the unknown | Claude | equations/common.js (lin, solver, wrong options, pans, balance figures, lesson) and 10.1 מהו נעלם? with 30 questions (38e28a1). |
| Lesson 10.2: + and −, keeping the balance | Claude | 10.2 + and −, keeping the balance: 5 rules, 30 questions (1ace4d9). |
| Lesson 10.3: × and ÷ | Claude | 10.3 × and ÷ in equal groups: 5 rules, 30 questions (1ace4d9). |
| Wiring chapter 10 | Claude | topic109-equations.js, generator list, chapter order (API + site), topicMeta, order tests; existing content identical by id (1ace4d9). |
| Independent check topic109.js | Claude | topic109.js: 90 answers re-computed, 50 balances read back, reading-order rules enforced; 14 planted faults caught; its findings fixed. |
| Verify, docs, PR | Claude | 1,185 equations measured in order on the real pages at 1366/390/360, 1,426 in bot messages; viewport inside chapter 9's accepted overflow; docs; tests green; PR #90. |

### P1 s3 · Two steps, both sides, parentheses (10.4–10.6)

As a student, I want to solve longer equations step by step, so that I can handle 2x + 3 = 11, 3x + 2 = x + 10 and 2(x + 3) = 14. Size: L (~6 h). 10.4 משוואות בשני צעדים (undo in reverse order, check); 10.5 נעלם בשני האגפים (remove boxes from both pans); 10.6 סוגריים וכינוס איברים (bags on the balance for parentheses, collecting like terms). Negative solutions allowed (chapter 7); balance pictures only where every value is positive.

- [x] Lessons 10.4–10.6 in chapter 10; existing content identical by id
- [x] Each lesson: a teaching document with a balance picture for every rule and 30 computed multiple-choice questions (10 per level); wrong options from common mistakes (the wrong order, moving a term without changing its sign, multiplying only the first term in the parentheses)
- [x] topic109.js covers the new lessons; planted faults fail it
- [x] Measured order at 360/390/1366 px and in Telegram; docs updated

*Closing note:* Lessons 10.4–10.6 in PR #91 (awaiting merge). Viewport overflow after checking up to 187 px laptop / 123 px at 360, below chapter 9 on main; picture button still the owner's call.

| Task | Owner | Note |
|---|---|---|
| Lesson 10.4: two steps | Claude | 10.4 committed (ecb7856): theory with 6 balances, 30 questions; steps() explains any linear equation with its check. Check: 120 answers re-computed, no problems; existing content identical by id. |
| Lesson 10.5: the unknown on both sides | Claude | 10.5 in c504b61: 5 rules with balances (boxes struck on both pans), 30 questions incl. savings, gym, candles and stickers stories. |
| Lesson 10.6: parentheses and collecting terms | Claude | 10.6 in c504b61: collecting x, 2(x + 3) as two equal bags, opening parentheses; 30 questions incl. cinema, consecutive numbers, rectangle and square/triangle stories. |
| Check, verify, docs, PR | Claude | Check: 180 answers re-computed, 25/25 planted faults caught; existing content identical by id; 1,830 page and 3,228 bot equations in order; tests 162/451/107; PR #91. |

### P1 s4 · Word problems to equations (10.7)

As a student, I want to turn a story into an equation, so that I can use what I learned outside the textbook. Size: M (~3 h). Choose what x is, write the equation, solve, check against the story: ages, money, perimeter, consecutive numbers, sharing.

- [x] Lesson 10.7 with a teaching document (the four steps, each drawn on a balance) and 30 computed questions: which equation fits, and what the answer is
- [x] topic109.js recomputes every story's answer from its numbers and checks the equation offered fits the story
- [x] Measured order and docs; the chapter complete in topics-status

*Closing note:* Lesson 10.7 in PR #92 (awaiting merge); chapter 10 complete, 7 of 7.

| Task | Owner | Note |
|---|---|---|
| Lesson 10.7: from a story to an equation | Claude | 10.7 in a359b47: four steps on one story with balances; 30 questions (which expression, which equation, stories to solve, some asking the other amount). |
| Check, verify, docs, PR | Claude | Check: 210 answers re-computed, exactly one option fits each story, 34/34 planted faults; bot isolates lone-x options; 732 page and 3,832 bot equations in order; tests 162/451/108; PR #92. |

