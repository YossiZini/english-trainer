# Sprint 17 — Division, with groups that move (archived backlog)

**Goal:** Let a student learn division with a remainder and long division in a new math chapter right after the multiplication table, explained by step-by-step animations where objects gather into equal groups and the leftovers stand apart; the multiplication chapter gets the same animations.
**Period:** 2026-11-01 → 2026-11-02
**Items:** 23 (5 stories), all done

## Scope

- A new math chapter "חילוק" after the multiplication table (chapter 2): division with a remainder, the remainder in word problems, long division of 2-digit and 3-digit numbers by one digit (owner, 2026-11-01)
- Fractions and the chapters after it keep their lessons, ids and students' progress and show one number later
- Each lesson: a Hebrew teaching document with pictures, 30 computed multiple-choice questions, and an independent check
- Step-by-step animations in the owner's example style: objects gather into equal groups, the leftovers stand apart in another colour, the equation fills in; long divisions fill in step by step
- Division in Telegram too (owner, 2026-11-01): a /hiluk drill recorded like /kefel, and the chapter's lessons in the bot
- The same animations for the multiplication chapter's three lessons (owner, 2026-11-01)
- Carried over from Sprint 16: the owner's live check of /unseen in Telegram

## Stories

### P1 s1 · A division chapter after the multiplication table

As a student, I want a division chapter right after the multiplication table, so that I learn division with a remainder and long division before fractions. Size: L (~9 h). Owner's decisions (2026-11-01): remainders and long division; the chapter comes right after the multiplication table. Topic 105 "חילוק", shown as chapter 2: math chapters follow an explicit order instead of their numbers, so fractions and the rest keep their lessons, ids and progress. Built like topic 100: seeds/division/, math-svg pictures, computed questions, an independent check script. Sprint 16's archive (docs/backlog/sprint-16.md) rides in this story's PR.

- [x] The math page lists "חילוק" as chapter 2, after the multiplication table; fractions, order of operations, average and percentage show as chapters 3-6 with their lessons, ids and students' progress unchanged (generate-data: other topics identical by id); next lesson, the mistakes exam and Telegram's math lessons follow the same order
- [x] Four lessons: 2.1 division with a remainder (equal groups and what is left, 17 ÷ 5 = 3 (שארית 2), the remainder is smaller than the divisor, remainder 0, checking 3 × 5 + 2 = 17); 2.2 the remainder in word problems (round up, drop it, or the remainder is the answer); 2.3 long division, 2-digit by 1-digit; 2.4 long division, 3-digit by 1-digit (a zero in the quotient, a remainder, checking)
- [x] Each lesson: a Hebrew teaching document with a picture for every rule and 30 multiple-choice questions (10 per level) whose answers and wrong options are computed (a remainder not smaller than the divisor, a quotient one off, a forgotten remainder, a dropped zero in the quotient)
- [x] backend/scripts/checks/topic105.js re-computes every answer and checks every picture against its caption; planted errors fail it
- [x] Equations stay on one line and long divisions fit at 360 and 390 px; docs/topics-status.md and the math content guide updated; backend tests and the frontend build green

*Closing note:* Merged in PR #77; deploy green (2026-11-02)

| Task | Owner | Note |
|---|---|---|
| Chapter order: division (105) shows as chapter 2 | Claude | MATH_CHAPTER_ORDER (API) = topicOrder (web): 100, 105, 101–104; lesson list, next lesson, mistakes exam and Telegram's list follow it; tests incl. a planted broken sort. Commit 1eca23e (local, waits for PR #76) |
| Lesson 2.1: division with a remainder | Claude | 2.1 division with a remainder: 5 rules with pictures, 30 questions; answers read "מנה 3, שארית 2". 4a310f0 (local) |
| Lesson 2.2: the remainder in word problems | Claude | 2.2 what to do with the remainder: one more / drop it / the remainder, each kind at every level. 36838ed (local) |
| Lesson 2.3: long division, 2-digit by 1-digit | Claude | 2.3 long division of a two-digit number, the written layout drawn by longDivision (left to right). 1ce81ed (local) |
| Lesson 2.4: long division, 3-digit by 1-digit | Claude | 2.4 long division of a three-digit number, a zero in the quotient (13 for 103 among the wrong options). 0691184 (local) |
| Independent check script and planted errors | Claude | scripts/checks/topic105.js: 120 answers re-computed, pictures read back; planted answer, remainder, caption, quotient digit and drawn remainder all caught. 05f370f (local) |
| Wire up, verify, document; PR | Claude | PR #77 open (b6c5b98): other topics identical by id; backend 138/138, web 78/78, build green; equations one line and in order at 360/390/1366; long-division digits ~13px |

### P1 s2 · Animations: objects gather into groups, the leftovers apart

As a student, I want to watch objects gather into equal groups, with the leftovers apart in another colour, so that I see what division and a remainder mean. Size: L (~6 h). On the lesson page's step player (LessonAnimation; frontend/src/content/animations/). Our own design of the idea in the owner's example: new primitives for counters that move from a pile into equal groups, group outlines, leftovers in another colour, and a long division that fills in step by step.

- [x] Every division lesson (2.1-2.4) opens with a step-by-step animation above its written theory: counters gather into equal groups, the leftovers stand apart in another colour, and the equation fills in (17 ÷ 5 = 3 (שארית 2)); the long-division lessons fill in the layout one step at a time
- [x] With reduced motion the counters appear in place; captions in Hebrew; numbers and equations in their isolates
- [x] animation-check walks every step at 1366 and 360 px with no failures; screenshots of each scene
- [x] Primitive tests (counters per group and leftover, everything inside the stage); the math content guide lists the new primitives

*Closing note:* Merged in PR #78; deploy green (2026-11-02)

| Task | Owner | Note |
|---|---|---|
| Primitives: counters that gather into groups, and leftovers | Claude | Counters (pile → groups right to left, outlines as each group fills, leftovers turn orange; dropped or one more group with seats) + DivEq; tests for 17÷5, 12÷3, 7÷7 and stage bounds for every a ≤ 50. 53b8572 (local) |
| Primitive: a long division that fills in step by step | Claude | LongDivision: one quotient digit per step in four beats, highlight on the number divided, sized to the stage; tests for 75÷3, 412÷4 and every a ≤ 999. 53b8572 (local) |
| Scenes for 2.1 and 2.2 | Claude | 2.1: 5 scenes, 2.2: 4 scenes; a test checks each step's counters against its equation; planted wrong remainder fails. 53b8572 (local) |
| Scenes for 2.3 and 2.4 | Claude | 2.3 and 2.4: captions and notes written from the drawing's own steps; planted off-by-one fails. 53b8572 (local) |
| animation-check, screenshots, guide | Claude | animation-check: 324 steps, 0 failures, now also fails on anything outside the stage (planted fault caught); screenshots of all 48 division steps; guide updated. Also fixed: equations in every animation caption showed reversed (104 of 118), now 0 of 256 |

### P1 s5 · Division in Telegram: /hiluk and the chapter's lessons

As a student, I want to practise division in Telegram, so that I can drill remainders and long division anywhere. Added by the owner when approving the plan (2026-11-01). Size: M (~4 h). /hiluk is a drill on the /kefel rails (drillSession.js): ten fresh questions, five with a remainder and five long divisions, typed answers. Owner's decision (2026-11-01): recorded like /kefel, so no score, no points, no mistakes, and each round's answered questions count in /usage. The new chapter's lessons also come up in the bot's math lessons.

- [x] /hiluk (also 'hiluk' and 'חילוק') starts ten new questions: five with a remainder (17 ÷ 5, divisor 2-9) and five long divisions (2-3 digits by one digit); no two alike
- [x] A remainder answer is typed as '3 2', '3 שארית 2', '3 ש 2' or '3r2'; an exact quotient as one number; '3' for 17 ÷ 5 says the remainder is missing; anything else repeats the question and counts nothing
- [x] Each answer gets ✅, or the right answer with a one-line check (3 × 5 + 2 = 17); the end shows how many were right; equations in their isolates
- [x] Recorded like /kefel: no score, points or mistakes; answered questions count in /usage (API tests)
- [x] The chapter's lessons appear in the bot's math lessons in the chapter order; remainder options read well in Telegram
- [x] /hiluk in the command menu, /help, the agent, the website's Telegram page and docs/telegram-bot.md; the system map updated; one real round through the coach against the emulator API

*Closing note:* Merged in PR #79; deploy green (2026-11-02)

| Task | Owner | Note |
|---|---|---|
| API: the /hiluk drill | Claude | divisionDrill.js + variant on the drill: 5 with a remainder, 5 long divisions; parser for 3 2 / 3 שארית 2 / 3 ש 2 / 3r2; missing remainder asks again; check line; /usage counts 'division'. 119c25d (local) |
| Bot: /hiluk, its replies, the menu, /help and the agent | Claude | hiluk / חילוק commands, replies, menu, /help, pointers, agent tool, usage line; 96 bot tests incl. 6 new; planted fault caught. 119c25d (local) |
| Lessons in Telegram, docs, system map, a real round; PR | Claude | PR #79 open; smoke round passed; system map republished |

### P1 s4 · Carried over: the live check of /unseen in Telegram

Moved from Sprint 16 at the owner's request (2026-11-01). The session cannot reach Telegram, so this check is the owner's.

- [x] All five steps pass, or a defect is logged with /defect add

*Closing note:* All five steps passed (owner, 2026-11-02)

| Task | Owner | Note |
|---|---|---|
| Live check of /unseen in Telegram | owner | Passed: the owner's live check in Telegram (2026-11-02) |

### P1 s3 · The same animations for the multiplication chapter

As a student, I want the multiplication chapter's lessons animated the same way, so that equal groups, arrays and sharing move instead of standing still. Size: M (~3 h). Uses s2's primitives. Sprint 15's deferred s3 (animated lessons for the multiplication table). Owner, 2026-11-01.

- [x] Lessons 1.1-1.3 open with a step player in the same style: counters gather into equal groups and rows (3 × 4), the order of factors (3 × 4 = 4 × 3), sharing 12 into 3 groups, a fact family, a word problem; the written theory unchanged
- [x] animation-check walks every step at 1366 and 360 px with no failures

*Closing note:* Merged in PR #80; deploy green (2026-11-02)

| Task | Owner | Note |
|---|---|---|
| Scenes for 1.1 and 1.2 | Claude | 1.1 (6 scenes) and 1.2 (5 scenes) with the new DotArray (gather, turn, faded/second-colour columns and rows); every drawn equation checked by arithmetic.test.js. 73010c4 (local) |
| Scene for 1.3; animation-check; PR | Claude | PR #80 open; animation-check 394 steps, 0 failures |

