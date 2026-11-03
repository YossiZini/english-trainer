# Sprint 18 — Negative numbers, axes and triangles (archived backlog)

**Goal:** Let a student learn negative numbers, points on the x–y axes and the basics of triangles in three new math chapters (7–9), each lesson with pictures, computed questions and a step-by-step animation.
**Period:** 2026-11-02 → 2026-11-03
**Items:** 31 (5 stories), all done

## Scope

- A chapter on negative numbers: the number line, comparing, adding, subtracting, multiplying and dividing (owner, 2026-11-02)
- A chapter on the x and y axes: basic understanding and plotting points (x, y), asked with grid pictures and multiple choice (owner's decision, 2026-11-02)
- A chapter on triangles, basic concepts: types by sides and by angles, the angle sum, perimeter and area
- The three chapters come last, as chapters 7–9, after percentage; every existing lesson, id and student's progress stays unchanged (owner's decision)
- Each lesson: a Hebrew teaching document with pictures, 30 computed multiple-choice questions and an independent check
- Step-by-step animations for the new chapters in this sprint (owner's decision, 2026-11-02)
- Telegram: the new lessons in the bot's math lessons; a question that needs its picture is skipped there until the bot can send pictures (P2)

## Stories

### P1 s1 · A chapter on negative numbers

As a student, I want a chapter on negative numbers, so that I can place, compare and calculate with numbers below zero. Size: L (~7 h). Topic 106, shown as chapter 7. Three lessons: 7.1 negative numbers on the number line (temperatures, below sea level; comparing; opposites; distance from 0), 7.2 adding and subtracting (on the number line; subtracting is adding the opposite: 5 − (−3) = 8), 7.3 multiplying and dividing (the sign rules). Built like topics 100 and 105: seeds/negatives/, computed answers, an independent check. The minus sign is U+2212 everywhere, inside its isolate.

- [x] Math shows "מספרים שליליים" as chapter 7 with lessons 7.1–7.3; every existing lesson and exercise identical by id
- [x] Each lesson: a Hebrew teaching document with a picture for every rule and 30 multiple-choice questions (10 per level), answers and wrong options computed (wrong sign, subtracting instead of adding the opposite, − × − kept negative)
- [x] backend/scripts/checks/topic106.js recomputes every answer with its own evaluator; planted faults fail it
- [x] Equations with negative numbers read in order and stay on one line at 360/390/1366 px (measured); docs/topics-status.md and the math guide updated

*Closing note:* Merged in PR #82 (c7013b7); deploy green.

| Task | Owner | Note |
|---|---|---|
| Chapters 7–9 in the order; negatives helpers and the number line | Claude | Order [100,105,101–104,106,107,108] in API and web, tests updated. New integerLine() in math-svg.js (numberLine untouched, existing records identical by id); negatives/common.js. Commit c4da259, PR #82. |
| Lesson 7.1: negative numbers on the number line | Claude | 106.1: 4 rules with number lines, 30 questions. Two captions had a bare "−1" shown as "1−": isolated. PR #82. |
| Lesson 7.2: adding and subtracting | Claude | 106.2: 5 rules with hops, 30 questions; wrong options from forgetting the opposite and the wrong sign. PR #82. |
| Lesson 7.3: multiplying and dividing | Claude | 106.3: sign rules (equal hops, the pattern, division), several factors, order of operations; 30 questions. PR #82. |
| Independent check topic106.js | Claude | scripts/checks/topic106.js: 90/90 answers re-computed, equations, isolates, number lines read back; 13 planted faults all caught. |
| Wire up, verify, document; PR | Claude | Backend 143 and web 350 tests pass, build OK; 0 broken or reversed equations at 360/390/1366; smallest labels 8.5px on long lines at 360px. Docs updated. PR #82 open. |

### P1 s2 · A chapter on the x and y axes: reading and plotting points

As a student, I want a chapter on the coordinate axes, so that I understand the x and y axes and can find and place points (x, y). Size: L (~8 h). Topic 107, chapter 8. 8.1 the axes and the point (the origin, x first then y, the four quarters, points on an axis); 8.2 plotting points (which labelled point is (2, −3), what are A's coordinates, moving a point, the fourth corner of a rectangle, distance along a grid line). Owner's decision: plotting is asked with grid pictures and multiple choice, so a question gets its own picture: a new field questionPicture → question_picture shown above the options on the website.

- [x] Math shows the chapter as 8 with lessons 8.1–8.2; 30 computed questions each; every existing record identical by id
- [x] A question can carry a picture: seed questionPicture → question_picture → API → shown above the options (lesson, mistakes exam and results pages); it fits at 360 px
- [x] A grid picture (coordGrid) draws the axes with numbered ticks and labelled points; topic107.js reads every drawn point back and checks the answer
- [x] In Telegram a question that needs its picture is skipped in lesson rounds (test), until the bot can send pictures (s5)

*Closing note:* Merged in PR #83 (2251612).

| Task | Owner | Note |
|---|---|---|
| Grid picture and the question-picture field, end to end | Claude | coordGrid in math-svg; question_picture only on questions that have one; API views, QuestionPicture on the question, results and mistakes pages; beside the options on wide screens. API + component tests. PR #83. |
| Lesson 8.1: the axes and the point | Claude | 107.1: 5 rules with grids, 30 questions (8 on a grid). PR #83. |
| Lesson 8.2: plotting points | Claude | 107.2: 4 rules, 30 questions (14 on a grid): placing, moving, distance, rectangle corner, area and perimeter. PR #83. |
| Independent check topic107.js | Claude | scripts/checks/topic107.js reads every grid back; 60/60 answers re-computed; 12 planted faults caught (moved point, swapped answer, axis number, missing picture…). |
| Telegram: skip questions that need their picture | Claude | getExercises textOnly for the bot; mistakes exam filters picture questions; bot test. Follow-up: only-grid math mistakes show 'nothing to fix' in the bot. |
| Wire up, verify, document; PR | Claude | Identity 0 changed; backend 145 and web 352 pass; all 22 grid questions above the pinned bar at 360/390/1366; 0 reading-order problems. PR #83 open. |

### P1 s3 · A chapter on triangles: basic concepts

As a student, I want a chapter on triangles, so that I know their kinds, their angles and how to measure them. Size: L (~7 h). Topic 108, chapter 9. 9.1 kinds of triangles (by sides: equilateral, isosceles, scalene; by angles: acute, right, obtuse); 9.2 the angle sum, 180° (a missing angle, the base angles of an isosceles triangle, a right triangle); 9.3 perimeter and area (area = base × height ÷ 2, the height drawn).

- [x] Math shows the chapter as 9 with lessons 9.1–9.3; 30 computed questions each; every existing record identical by id
- [x] A triangle picture (triangle) draws sides, angle marks with their degrees, a right-angle mark and a dashed height
- [x] topic108.js recomputes every answer and checks each picture's angles and lengths against its caption; planted faults fail it

*Closing note:* Merged in PR #84 (7a176aa).

| Task | Owner | Note |
|---|---|---|
| Triangle picture | Claude | triangle() in math-svg: from angles, sides or base+apex; arcs, right-angle squares, ticks, lengths, dashed height, half-rectangle. PR #84. |
| Lesson 9.1: kinds of triangles | Claude | 108.1: 4 rules, 30 questions (5 on a picture). PR #84. |
| Lesson 9.2: the angle sum | Claude | 108.2: 5 rules, 30 questions; wrong options 360°, a forgotten angle. PR #84. |
| Lesson 9.3: perimeter and area | Claude | 108.3: 5 rules, 30 questions (3 on a picture); wrong options forgetting ÷ 2, a slanted side. PR #84. |
| Independent check topic108.js | Claude | scripts/checks/topic108.js reads every triangle back; 90/90 answers re-computed; 11 planted faults caught (wrong angle, wrong area, …). |
| Wire up, verify, document; PR | Claude | Identity 0 changed; backend 145 and web 352 pass; picture questions above the bar at 360/390/1366; 0 wrap or reading-order problems. PR #84 open. |

### P1 s4 · Step-by-step animations for chapters 7–9

As a student, I want the new chapters animated like division and multiplication, so that hops on the number line, walking to a point and a triangle's angles move instead of standing still. Size: L (~7 h). Owner's decision (2026-11-02): this sprint. New primitives: hops on a number line, a coordinate grid where a point is reached by walking x then y, a triangle whose three corners are torn off and laid on a straight line (180°), a triangle as half a rectangle.

- [x] Lessons 7.1–9.3 open with a step player, one scene per rule; the written theory unchanged
- [x] arithmetic.test.js covers the new scenes; animation-check (stage bounds) and the caption-order check pass at 1366 and 360 px
- [x] Primitive tests (hop lengths, grid positions, the torn angles add up to 180°); the math guide lists the new primitives

*Closing note:* Merged in PR #85 (038fafe).

| Task | Owner | Note |
|---|---|---|
| Number-line hops and scenes for 7.1–7.3 | Claude | HopLine in animations/geometry.jsx (hops traced in turn, equal hops, brace); scenes 106.1–106.3 (15 scenes). Tests: hop ends. PR #85. |
| Coordinate grid and scenes for 8.1–8.2 | Claude | CoordPlane (walk x then y, moves, segments, quarters); scenes 107.1–107.2 (9 scenes). Tests: point positions. PR #85. |
| Triangle primitives and scenes for 9.1–9.3 | Claude | TriangleShape (torn corners onto a line, half rectangle, height) and Rods; scenes 108.1–108.3 (14 scenes). Tests: torn corners fill 180°, rods meet. PR #85. |
| Checks, screenshots, guide; PR | Claude | animation-check 162 steps, 0 failures (triangles capped by maxHeight); 208 caption equations and minus signs in order; one 'x:' caption reworded; settled screenshots reviewed; guide updated. PR #85 open. |

### P2 s5 · Picture questions in Telegram

As a student, I want the grid questions in Telegram too, so that I can practise plotting there. Size: M (~3 h). Each question picture is rendered to PNG when the content is generated (a dev-time step, no new runtime dependency), served with the website, and sent by the bot with the question; then s2's skip is lifted.

- [x] A grid question in a bot lesson arrives as a picture with its question and buttons
- [x] No question picture is skipped any more; bot tests for the photo reply

*Closing note:* Merged in PR #86 (7916e72); deploy green.

| Task | Owner | Note |
|---|---|---|
| Render question pictures to PNG | Claude | frontend/scripts/render-question-pictures.js draws 26 hash-named PNGs into public/question-pictures; questionPictures.test.js catches a missing or stray PNG (7232aaf, PR #86). |
| API: picture path in the bot's question; lift the skip | Claude | Frozen question keeps the PNG path, question view returns `picture`; textOnly skip removed; botExercise test updated (7232aaf, PR #86). |
| Bot: send the question as a photo | Claude | Reply.photo, telegram.send_question_photo (caption + buttons, long-caption and refused-photo fallbacks), verdict first, agent replies direct; 9 bot tests (7232aaf, PR #86). |
| Docs, system map, PR | Claude | telegram-bot.md, knowledge.md, math guide, topics 107/108; system map republished (version 22); PR #86 opened. |

