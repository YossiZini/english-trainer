# Sprint 2 — Math tab: fractions, order of operations, average, percentage (archived backlog)

**Goal:** Add a Hebrew Math section for grades 7–8 with four topics, each with a teaching document (every rule followed by a simple example) and exercises at three levels, running on the existing lesson/exercise engine.
**Period:** 2026-09-27 → 2026-09-27
**Items:** 29 (10 stories), all done

## Scope

- A new Math tab in the navbar (מתמטיקה) leading to a Math topics page; English topics stay where they are and student progress, mistakes and points work the same for both subjects
- Four topics: fractions, order of operations (× ÷ + − and parentheses), average, percentage — aimed at grades 7–8
- For each topic a teaching document in Hebrew: rules in a clear order, each rule followed by a simple worked example; math written left-to-right inside the Hebrew text
- For each topic exercises at three levels (easy / medium / hard), multiple choice and fill-in-the-blank with numeric answers, each with a Hebrew explanation of the correct answer
- Content lives in seed files like the English topics and ships through npm run generate-data; docs/topics-status.md covers Math topics too
- No backend schema change beyond marking a lesson's subject; the exercise page, results, mistakes and cross-test keep working for English

## Stories

### P1 s1 · As a maintainer, I want lessons to carry a subject (english | math) so the app can serve Math content on the existing engine

Size: ~1.5 h. The generator (backend/src/data/generateJsonData.js) parses seed files with a fixed-shape regex, so the subject comes from the file list (a mathFiles list → subject 'math'; everything else 'english'). Lesson.findAllWithProgress and GET /api/lessons get an optional subject filter; no filter keeps today's behaviour so mistakes, cross-test and results stay untouched. Math topics use topic numbers 101–104.

- [x] Every lesson in data/static/lessons.json has subject 'english' or 'math'
- [x] GET /api/lessons?subject=math returns only Math topics; without the parameter the response is unchanged for existing callers
- [x] Backend tests cover the filter; npm test green

*Closing note:* All 97 English lessons tagged 'english'; exercises.json byte-identical.

| Task | Owner | Note |
|---|---|---|
| Generator: mathFiles list, subject on every lesson, regenerate data | Claude | Generator rebuilds one subject at a time (default math) and merges into the canonical JSON; ids and created_at preserved by natural key. Finding: English seeds hold only ~950 of 2,156 exercises, so English is never rebuilt implicitly. Commit ae18eb9. |
| API: subject filter on lessons + test | Claude | ?subject=english\|math on GET /api/lessons; group carries subject; test added (16 tests green). Commit ae18eb9. |

### P1 s2 · As a student, I want a Math tab that opens a Math topics page so I can choose a math topic the same way I choose an English one

Size: ~2.5 h. TopicsIndex.jsx (575 lines) hardcodes English topic names, examples, descriptions and videos by topic number. Move that metadata into a per-subject module, give TopicsIndex a subject prop, add route /math and a navbar item מתמטיקה (the navbar currently only links home/dashboard), and a Math card on the dashboard.

- [x] Navbar shows נושאים (English) and מתמטיקה (Math); /math lists only the four Math topics with Hebrew names and descriptions
- [x] /topics is unchanged for English (names, examples, videos, progress bars)
- [x] Opening a Math topic goes to the same learn and exercise pages; progress bars reflect Math attempts
- [x] Frontend build green; npm run check:viewport still passes

*Closing note:* Plumbing 8b9ac29 + verification dd2598b.

| Task | Owner | Note |
|---|---|---|
| Extract topic metadata per subject; TopicsIndex takes a subject prop | Claude | content/topicMeta.js per subject; TopicsIndex(subject) loads ?subject=. English page renders from the same data as before. |
| Route /math, navbar tab, dashboard card | Claude | /math route, navbar English/Math links, dashboard Math card, subject-aware back links; next/previous lesson stays in subject. |
| Verify: build, viewport check, screenshots of /math on laptop and phone | Claude | Build green (pre-existing warnings only); Playwright screenshots of /math, learn and exercise pages at 1366×768 and 360×740 in docs/screenshots/sprint-2; no horizontal scroll, no page errors. Fixed reversed examples (bidi isolates) and 101.1→1.1 display. Commit dd2598b. |

### P1 s3 · As a 7th–8th grade student, I want to learn fractions in Hebrew and practise at three levels

Size: ~2 h. Topic 101. Teaching document: what a fraction is, equivalent fractions and reducing, common denominator, adding/subtracting, multiplying, dividing, mixed numbers and improper fractions, comparing — each rule followed by a simple worked example. Exercises: 8 easy (recognise, reduce, compare), 8 medium (add/subtract with different denominators, multiply), 8 hard (divide, mixed numbers, two-step word problems).

- [x] Teaching document in Hebrew with every rule followed by an example; math expressions render left-to-right
- [x] 30 exercises, 10 per level (session size), mix of multiple choice and fill-in; every answer verified; Hebrew explanation on each
- [x] Listed in docs/topics-status.md

*Closing note:* Done in dd2598b; Math section added to docs/topics-status.md. Exercise page: Hebrew question text RTL, no parentheses prefill for Math.

| Task | Owner | Note |
|---|---|---|
| Fractions teaching document (Hebrew HTML) | Claude | topic101-fractions.js: 7 rules (structure, equivalent/reduce, compare, add/subtract, multiply, divide, mixed/improper, fraction of a quantity) each with examples; math in dir=ltr spans. Commit dd2598b. |
| Fractions exercises: 8 easy, 8 medium, 8 hard, answers verified | Claude | 30 exercises (10/10/10, not 8/8/8: a session is 10 questions and the engine would pad with other levels). All answers verified by an exact-fraction check script; hintHe on fill-ins. Commit dd2598b. |

### P1 s4 · As a student, I want to learn the order of operations (× ÷ + − and parentheses) and practise at three levels

Size: ~1.5 h. Topic 102. Rules: parentheses first, then multiplication and division left to right, then addition and subtraction left to right; nested parentheses; exponents mentioned as a note for grade 8. Exercises: easy (two operations), medium (three operations with parentheses), hard (nested parentheses, negative results, 'insert parentheses to make it true').

- [x] Teaching document with each rule followed by an example
- [x] 30 exercises, 10 per level; every expression evaluated by a script to confirm the answer
- [x] Listed in docs/topics-status.md

*Closing note:* Done; listed in docs/topics-status.md; learn+exercise screenshots in docs/screenshots/sprint-2.

| Task | Owner | Note |
|---|---|---|
| Order-of-operations teaching document | Claude | topic102-order-of-operations.js: 5 rules + exponents note, each with examples. Commit 2nd Math commit on the branch. |
| Order-of-operations exercises, answers evaluated by script | Claude | 30 exercises (10/10/10); every expression evaluated by a script, incl. option expressions. Same commit. |

### P1 s5 · As a student, I want to learn averages and practise at three levels

Size: ~1.5 h. Topic 103. Rules: average = sum ÷ count; finding a missing value from a known average; weighted thinking (adding a value changes the average); averages in word problems (grades, temperatures). Exercises: easy (average of 3–4 numbers), medium (missing value, decimals), hard (two-step word problems, effect of adding a value).

- [x] Teaching document with each rule followed by an example
- [x] 30 exercises, 10 per level, answers verified by script
- [x] Listed in docs/topics-status.md

*Closing note:* Done; screenshots in docs/screenshots/sprint-2.

| Task | Owner | Note |
|---|---|---|
| Average teaching document | Claude | topic103-average.js: 5 rules with examples. |
| Average exercises, answers verified by script | Claude | 30 exercises (10/10/10), answers verified by script; decimal answers use a point (7.5). |

### P1 s6 · As a student, I want to learn percentages and practise at three levels

Size: ~1.5 h. Topic 104. Rules: percent as a fraction of 100; percent ↔ decimal ↔ fraction; finding a percentage of a number; what percent one number is of another; finding the whole from a part; increase and decrease (discounts, VAT); each with an example. Exercises: easy (conversions, 10%/50% of numbers), medium (percent of, discount price), hard (find the whole, successive changes, word problems).

- [x] Teaching document with each rule followed by an example
- [x] 30 exercises, 10 per level, answers verified by script
- [x] Listed in docs/topics-status.md

*Closing note:* Done; screenshots in docs/screenshots/sprint-2.

| Task | Owner | Note |
|---|---|---|
| Percentage teaching document | Claude | topic104-percentage.js: 5 rules with examples, discount/VAT warning, shortcuts tip. |
| Percentage exercises, answers verified by script | Claude | 30 exercises (10/10/10), answers verified by script. Fill-ins ask for a bare number (hint says no % or ₪). |

### P1 s7 · As a student, I want a correct numeric answer accepted in any reasonable form (3/4, 0.75, 25 or 25%) so I am not marked wrong for formatting

Size: ~1.5 h. exercise.service compares trimmed lowercase strings, which is fine for English words but wrong for numbers. Add an answer normaliser used by check and submit: trims, strips %, accepts comma decimals, compares fractions and decimals numerically (1/2 = 0.5 = 2/4), mixed numbers (1 1/2 = 3/2), and leaves non-numeric answers as today.

- [x] Unit tests: 3/4 ≡ 0.75 ≡ 6/8; 25% ≡ 25; 1 1/2 ≡ 1.5; 'is' ≢ 'are' (English unchanged)
- [x] Both the check-answer and submit paths use the normaliser
- [x] Fill-in questions show a short hint of the expected form (e.g. שבר או עשרוני)

*Closing note:* Done in 2638c80.

| Task | Owner | Note |
|---|---|---|
| answersMatch() normaliser + unit tests, wired into check and submit | Claude | backend/src/utils/answers.js answersMatch; used by Exercise.checkAnswer, submitExercise and mistake retry; 5 unit tests (21 total green). Commit 2638c80. |
| Fill-in hint text for numeric answers | Claude | Seeds carry hintHe; FillInBlank's existing hint slot shows it. Fraction hint mentions the decimal form. |

### P1 s8 · As a maintainer, I want the topic guide and status to cover Math so the next topic is added the same way

Size: ~0.5 h. docs/topics-status.md: Math section in the status table, the creation guide mentions the subject/file list, activity log entries (required by CLAUDE.md); README curriculum line.

- [x] docs/topics-status.md lists topics 101–104 with status and activity entries
- [x] README mentions the Math section

*Closing note:* Done in 2638c80.

| Task | Owner | Note |
|---|---|---|
| Update docs/topics-status.md and README for Math | Claude | topics-status.md: Math table, activity log, guide steps updated for subjectFiles/topicMeta.js/per-subject regeneration; README rows. Commit 2638c80. |

### P1 s10 · Review follow-ups: Math navigation from results, subject switch, shared topic-number display

Findings of /sprint review to fix before close.

- [x] After a Math exercise, submit and results responses name the next/previous Math lesson, never an English one (test)
- [x] Switching אנגלית ↔ מתמטיקה in the navbar shows the first topic of the new subject expanded
- [x] Topic/subtopic display numbers come from one helper in content/topicMeta.js

*Closing note:* All three fixed; PR open.

| Task | Owner | Note |
|---|---|---|
| exercise.service: next/previous lesson within the lesson's subject (submit + results) | Claude | Lesson.getNextLesson/getPreviousLesson(lesson) filter by subject; 7 call sites updated; test submits a Math exercise and checks submit + results. Commit 27780f2. |
| App.js: key TopicsIndex by subject so switching subjects remounts the page | Claude | App.js keys TopicsIndex by subject; Playwright confirms first topic expanded after switching both ways. Commit 6ebe36c. |
| topicMeta.js: displayTopic/displaySubtopic helpers used by TopicsIndex and LearningPage | Claude | displayTopic/displaySubtopic exported from content/topicMeta.js; TopicsIndex and LearningPage use them. Commit 6ebe36c. |

### P3 s9 · As a student, I want my Math mistakes and cross-test to work like English

Size: ~1 h. Verify the mistakes list, retry mode and cross-test include Math lessons correctly (they are keyed by lesson id, so this is expected to work); fix labels that assume English (e.g. 'title_en').

- [x] A wrong Math answer appears in Mistakes and can be retried; cross-test can include it

*Closing note:* Mistakes and retry are keyed by lesson id and worked as is. Cross-test now pads only from the student's subjects and carries subject per question (RTL rendering). Test added. Commit 140d532.

