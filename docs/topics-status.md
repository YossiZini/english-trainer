# Topics Status Tracking

This document tracks the implementation status of all curriculum topics and provides a step-by-step guide for creating new topics.

**Single Source of Truth:** `/docs/topics.md` defines the authoritative curriculum structure.

---

## Table of Contents

1. [Topic Creation Guide](#topic-creation-guide)
2. [Asset Checklist](#asset-checklist)
3. [Topic Status Table](#topic-status-table)
4. [Recent Activity Log](#recent-activity-log)

---

## Topic Creation Guide

Follow these steps in order when creating a new topic:

### Step 1: Update topics.md (Single Source of Truth)

**File:** `/docs/topics.md`

Add the topic content including:
- Topic number and name (English + Hebrew)
- Difficulty level (Beginner/Intermediate/Advanced)
- Subtopic structure with detailed explanations
- Examples and usage notes

### Step 2: Create Backend Seed File

**Location:** `/backend/src/database/seeds/topic{N}-{name}.js`

Create a new seed file with this structure:

```javascript
const lessonsData = [
  {
    topicNumber: {N},
    subtopicNumber: 1,
    titleEn: 'Subtopic Title',
    titleHe: 'כותרת משנה',
    level: 'beginner',  // beginner | intermediate | advanced
    orderIndex: 1,
    theoryContentHe: `
      <div class="theory-section">
        <!-- Theory content in Hebrew -->
      </div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'She _______ a teacher.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',  // the answer text, exactly one of the options
        explanationHe: 'תשובה נכונה: is. ...',
        difficulty: 'easy'  // easy | medium | hard
      }
    ]
  }
];

module.exports = { lessonsData };
```

**Every exercise is multiple choice**: students answer on a phone and in the
Telegram bot, never by typing. Four options (three only for a yes/no style
question), exactly one of them the answer, and every wrong option wrong in
its sentence (not a second acceptable answer). A chosen option is graded by
exact text, so capitalisation questions work. `backend/tests/content.test.js`
enforces the format for all bundled exercises. Math authors write `fib`/`fibR`
and the export turns them into multiple choice (`docs/math-content-guide.md`).

### Step 3: Register in the Data Generator

**File:** `/backend/src/data/generateJsonData.js`

Add the seed file name to the subject's list in `subjectFiles`:

```javascript
const subjectFiles = {
  english: [/* ... */, 'topic{N}-{name}.js'],
  math: [/* ... */, 'topic{N}-{name}.js']   // Math seeds are plain modules (see math-helpers.js)
};
```

English seeds are parsed from their text (they are legacy scripts); seeds of
any other subject are `require`d and must export `{ lessonsData }`.

### Step 4: Update Frontend Component

**File:** `/frontend/src/content/topicMeta.js` (per subject: `topicNames`,
`tocExamples`, `topicDescriptions`, and `mathTopicNames`… for Math)

Update three mappings:

1. **topicNames** - Add topic name (EN + HE):
```javascript
{N}: { en: 'Topic Name', he: 'שם הנושא' },
```

2. **tocExamples** - Add table of contents example:
```javascript
{N}: '(Example 1, Example 2)',
```

3. **topicDescriptions** - Add description and examples:
```javascript
{N}: {
  description: 'תיאור הנושא בעברית',
  examples: ['Example 1', 'Example 2', 'Example 3']
},
```

### Step 5: Regenerate the Content Data

Rebuild the bundled JSON from the seed files:

```bash
cd backend
npm run generate-data          # rebuilds the Math lessons (default)
npm run generate-data english  # rebuilds the English lessons from their seeds
```

Only the named subject is rebuilt; ids and timestamps of existing lessons and
exercises are preserved. English is never rebuilt implicitly: its seed files
hold fewer exercises than the bundled JSON, so rebuild it only on purpose.
Commit the updated `backend/data/static/*.json`. Content ships with the next
push to `main` (see `/docs/deployment.md`); no database step is needed.

### Step 6: Verify & Test

1. Start the development server
2. Check that lessons appear in the frontend
3. Test that exercises work correctly
4. Verify theory content displays properly

---

## Asset Checklist

For each topic, these assets must exist:

| Asset | Location | Description |
|-------|----------|-------------|
| Documentation | `/docs/topics.md` | Full topic content with subtopics |
| Seed File | `/backend/src/database/seeds/topic{N}-*.js` | Lessons and exercises data |
| Seed Registration | `/backend/src/data/generateJsonData.js` | File name in the `subjectFiles` list of its subject |
| Frontend Mapping | `/frontend/src/content/topicMeta.js` | topicNames, tocExamples, topicDescriptions per subject |
| Content Generated | `/backend/data/static/*.json` | Run `npm run generate-data` from backend and commit the result |
| Exercises | Seed file exercises array | Easy/medium/hard difficulty levels |

---

## Topic Status Table

| # | Topic Name (EN) | Topic Name (HE) | Seed File | Registered | Frontend | Status |
|---|-----------------|-----------------|-----------|------------|----------|--------|
| 1 | Grammar Basics | יסודות דקדוק | topic1-grammar-basics.js | Yes | Yes | Complete |
| 2 | Verb "To Be" - Present | פועל להיות - הווה | topic2-to-be.js | Yes | Yes | Complete |
| 3 | Personal Pronouns & Possessives | כינויי גוף ושייכות | topic3-personal-pronouns.js | Yes | Yes | Complete |
| 4 | Nouns - Singular & Plural | שמות עצם - יחיד ורבים | topic4-nouns.js | Yes | Yes | Complete |
| 5 | Articles | מאמרים | topic5-articles.js | Yes | Yes | Complete |
| 6 | Demonstratives | מילות הצבעה | topic6-demonstratives.js | Yes | Yes | Complete |
| 7 | There is / There are | יש | topic7-there-is-are.js | Yes | Yes | Complete |
| 8 | Adjectives | שמות תואר | topic8-adjectives.js | Yes | Yes | Complete |
| 9 | Present Simple Tense | זמן הווה פשוט | topic9-present-simple.js | Yes | Yes | Complete |
| 10 | Question Words | מילות שאלה | topic10-question-words.js | Yes | Yes | Complete |
| 11 | Present Progressive | הווה ממושך | topic11-present-progressive.js | Yes | Yes | Complete |
| 12 | Can / Could | יכול / יכול היה | topic12-can-could.js | Yes | Yes | Complete |
| 13 | Prepositions of Place | מילות יחס - מקום | topic13-prepositions-place.js | Yes | Yes | Complete |
| 14 | Prepositions of Time | מילות יחס - זמן | topic14-prepositions-time.js | Yes | Yes | Complete |
| 15 | Past Simple Tense | עבר פשוט | topic15-past-simple.js | Yes | Yes | Complete |
| 16 | Going to | הולך ל | Missing | No | Yes | Planned |
| 17 | Future Simple - will | עתיד פשוט | Missing | No | Yes | Planned |
| 18 | Comparatives & Superlatives | דרגות השוואה | Missing | No | Yes | Planned |

### Math Topics (Hebrew, grades 7–8)

Math lessons live in the same content files with `subject: "math"` and are
numbered 100+. On the `/math` page and in the lesson order they appear in
curriculum order, chapters 1+: the multiplication table (100), Division (105),
Fractions (101), Decimals (110), then 102–104, then Negative numbers (106), the x and y
axes (107), Triangles (108), Equations with one unknown (109), Ratio and
proportion (111) and Linear functions (112). The order is `MATH_CHAPTER_ORDER` in
`backend/src/config/subjects.js` and `topicOrder` in `topicMeta.js` (keep
them equal); a new topic number goes where it belongs in both lists. A topic
with several subtopics keeps them in a folder (`seeds/fractions/`,
`seeds/multiplication/`, `seeds/division/`, `seeds/decimals/`, `seeds/negatives/`, `seeds/axes/`, `seeds/triangles/`, `seeds/ratio/`, `seeds/functions/`) and composes them in
`topic1NN-*.js`; write fractions as `a/b` in text and
theory, the app shows them stacked (`MathText` for exercise text,
`stackFractions` for theory HTML). Pictures for theory come from
`seeds/math-svg.js` (`circle`, `bar`, `numberLine`, `integerLine`,
`coordGrid`, `triangle`, `grid`, `array`, `groups`, `longDivision`, `hundredGrid`,
`decimalLine`, `placeValue`, `columnCalc`, `ratioBar`, `ratioTable`, `figure`). A
question that needs a picture to be answered carries it as
`questionPicture` (`question_picture`, shown between the question and its
options; the Telegram bot sends it as a PNG photo, so after a picture
changes run `npm run question-pictures` in `frontend/`). Seeds are plain modules
(`module.exports = { lessonsData }`) built with `seeds/math-helpers.js`; the
chapters from the multiplication table on build their lessons with
`mathLesson` in `seeds/multiplication/common.js` (one builder, its checks
chosen per chapter); each
topic has one teaching document and 10 exercises per level (easy/medium/hard),
because an exercise session is 10 questions. Regenerate with
`cd backend && npm run generate-data math` (English content is never rebuilt
implicitly). Display text: `frontend/src/content/topicMeta.js` (`math`).

| # | Topic Name (EN) | Topic Name (HE) | Seed File | Registered | Frontend | Status |
|---|-----------------|-----------------|-----------|------------|----------|--------|
| 100 | Multiplication Table (3 subtopics 100.1–100.3) | לוח הכפל | topic100-multiplication.js + multiplication/*.js | Yes | Yes | Complete |
| 105 | Division (4 subtopics 105.1–105.4, shown as chapter 2) | חילוק | topic105-division.js + division/*.js | Yes | Yes | Complete |
| 101 | Fractions (6 subtopics 101.1–101.6) | שברים | topic101-fractions.js + fractions/*.js | Yes | Yes | Complete |
| 110 | Decimals (4 subtopics 110.1–110.4, shown as chapter 4) | שברים עשרוניים | topic110-decimals.js + decimals/*.js | Yes | Yes | Complete |
| 102 | Order of Operations (shown as chapter 5) | סדר פעולות חשבון | topic102-order-of-operations.js | Yes | Yes | Complete |
| 103 | Average (shown as chapter 6) | ממוצע | topic103-average.js | Yes | Yes | Complete |
| 104 | Percentage (shown as chapter 7) | אחוזים | topic104-percentage.js | Yes | Yes | Complete |
| 106 | Negative Numbers (3 subtopics 106.1–106.3, shown as chapter 8) | מספרים שליליים | topic106-negatives.js + negatives/*.js | Yes | Yes | Complete |
| 107 | The x and y Axes (2 subtopics 107.1–107.2, shown as chapter 9) | מערכת צירים | topic107-axes.js + axes/*.js | Yes | Yes | Complete |
| 108 | Triangles (3 subtopics 108.1–108.3, shown as chapter 10) | משולשים | topic108-triangles.js + triangles/*.js | Yes | Yes | Complete |
| 109 | Equations with One Unknown (7 subtopics 109.1–109.7, shown as chapter 11) | משוואה עם נעלם אחד | topic109-equations.js + equations/*.js | Yes | Yes | Complete |
| 111 | Ratio and Proportion (3 subtopics 111.1–111.3, shown as chapter 12) | יחס ופרופורציה | topic111-ratio.js + ratio/*.js | Yes | Yes | Complete |
| 112 | Linear Functions (3 subtopics 112.1–112.3, shown as chapter 13) | פונקציה קווית | topic112-functions.js + functions/*.js | Yes | Yes | Complete |

### Arabic Topics (Hebrew instruction, grade 7, reading and recognition)

Arabic lessons carry `subject: "arabic"` and are numbered 201+ (shown as 1+
on the `/arabic` page). A unit is a folder (`seeds/arabic/`) with one file per
lesson, composed by `topic2NN-*.js`; the facts of the unit (letters, vowels,
words) live in `seeds/arabic/facts.js` and every question is built from them
with `seeds/arabic/common.js` (`q`, `lesson`, which enforce 10 questions per
level, distinct options and no positional options). Students read and
recognise; they never write Arabic. Regenerate with
`cd backend && npm run generate-data arabic`. Display text:
`frontend/src/content/topicMeta.js` (`arabic`). Guide:
`docs/arabic-content-guide.md`.

| # | Topic Name (EN) | Topic Name (HE) | Seed File | Registered | Frontend | Status |
|---|-----------------|-----------------|-----------|------------|----------|--------|
| 201 | Letters, vowels and first words (5 lessons 201.1–201.5) | אותיות, תנועות ומילים ראשונות | topic201-arabic-first-unit.js + arabic/*.js | Yes | Yes | Complete |

### Status Legend

- **Complete**: All assets exist and are registered
- **Partial**: Seed file exists but not registered in seed-all-lessons.js
- **Planned**: Documented in topics.md and frontend, but no seed file
- **Missing**: Not yet documented

### Summary

- **Complete:** 15 English topics (1–15), 13 math topics (100–112), 1 Arabic topic (201)
- **Planned:** 3 topics (16, 17, 18)

---

## Recent Activity Log

Track changes per topic with dates and descriptions.

### Topic 201: Letters, vowels and first words (Arabic)
- 2026-09-30: Arabic added as a third subject (API subject list, `/arabic`
  page, right-to-left options, Noto Naskh Arabic font). First unit for the
  11.10 test (book pp. 13–25): 201.1 letters د ذ ا ر ز و, 201.2 alif with and
  without hamza, 201.3 vowels, 201.4 the eight words, 201.5 review; each a
  Hebrew teaching page and 30 multiple-choice questions (10 per level) built
  from `seeds/arabic/facts.js` and checked by an independent review. Sprint 12.
- 2026-10-09: Display fixes from the Sprint 12 review: the mixed-test results
  and the mistakes page show Arabic questions right-to-left and in the Arabic
  font; the font rule survives older browsers; the font stylesheet no longer
  delays the first paint of every page; the Telegram link page lists `/arabic`.
  Content unchanged. Sprint 13.
- 2026-10-18: Questions and answers are larger on every quiz page of every
  subject (one size per device in `styles/variables.css`: computer, phone,
  narrow phone). Arabic quiz text is 1.2 times the answer size, never smaller
  than before. Content unchanged. Sprint 14.

### Topic 100: Multiplication Table (Math)
- 2026-10-31: New topic, first in Math (before Fractions): 100.1 multiplication
  up to 10×10 (equal groups, order, ×1 ×10 ×2 ×5, ×9, doubling, squares, the
  full table), 100.2 division as the inverse of multiplication (sharing, fact
  families, special cases, checking), 100.3 review with word problems. Each
  a Hebrew teaching document with a picture for every rule (`array`, `groups`
  in `math-svg.js`) and 30 multiple-choice questions (10 per level) whose
  answers and wrong options (neighbouring facts, adding instead of
  multiplying, subtracting instead of dividing) are computed in
  `seeds/multiplication/common.js`; an independent script re-computed all 90.
  Math chapters on screen now count from it (Fractions is chapter 2), and it
  is the next math lesson for a student who has not passed it. Sprint 15.
- 2026-10-31: Every equation stays on one line on a phone (non-breaking spaces
  inside `ltr()` and `<span dir="ltr">`; before, 26 theory equations and many
  explanations split at 360px), the 100.1 formula box shows `3 × 4 = 12`,
  explanation pictures are at most 110px tall, 100.3 q16 is shorter; the phone
  multiplication table fits 280px. `check:viewport` (10 questions, 3 lessons):
  easy and medium fit at every size; hard questions with a picture end below
  the pinned bar on a 768px laptop (up to 162px) and a 360px phone (up to
  85px), like the Fractions questions with pictures; a 390px phone fits.
  The math page's example badges (topics 100 and 101) are wrapped in `ltr()`:
  they showed reversed in the right-to-left page ("7 = 8 ÷ 56",
  "1/4 = 3/4 − 1").
- 2026-10-31: In Telegram, `/kefel` practises the table outside the lessons:
  ten new questions per round (five ×, five ÷, factors 2–10), typed
  answers, the count and the facts to review at the end; no score, points
  or mistakes (`docs/telegram-bot.md`, "Multiplication drill").
- 2026-11-01: `/usage` counts the drill: answered `/kefel` questions show as
  "כפל" (week|month) and a drill day is an active day.
- 2026-11-01: 100.2 rule 5 draws `7 × 6 = 42` as 7 rows of 6, the rows ×
  columns rule of 100.1 (it showed 6 rows of 7). The independent check now
  matches every dot array against its caption.
- 2026-11-02: Every lesson opens with a step-by-step animation, one scene
  per rule: counters gather into equal groups, dots into rows and columns
  (3 × 4 turns into 4 × 3), × 10 and half of it for × 5, × 9 as one faded
  column less, doubling for × 4 and × 8, squares, sharing into groups, a
  fact family, special cases, checking, a missing number and a two-step
  problem. The written theory is unchanged. Sprint 17.
- 2026-11-03: Lessons built by the shared `mathLesson` (`seeds/multiplication/common.js`),
  which now also refuses a quote mark in a question or explanation. Content
  unchanged (identical by id). Sprint 19.

### Topic 105: Division (Math)
- 2026-11-01: New topic, chapter 2 of Math (after the multiplication table,
  before Fractions): 105.1 division with a remainder (the remainder is smaller
  than the divisor, checking with `q × d + r`), 105.2 what to do with the
  remainder in word problems (one more, drop it, or answer with it), 105.3
  long division of a two-digit number, 105.4 long division of a three-digit
  number (a zero in the quotient). Each a Hebrew teaching document with a
  picture for every rule and 30 multiple-choice questions (10 per level).
  Pictures: groups of dots with the leftovers in a second colour after the
  groups (`groups(…, { leftover, across })`, laid out right to left, rows
  chosen so the dots stay large on a phone) and the written long division
  (`longDivision`). Answers with a remainder read "מנה 3, שארית 2". Answers,
  wrong options (remainder not smaller than the divisor, a forgotten zero in
  the quotient, digits swapped) and explanations are computed in
  `seeds/division/common.js`; `scripts/checks/topic105.js` re-computed all
  120 and reads the quotient and the remainder back from every long-division
  picture. Every existing lesson and exercise is unchanged (compared by id);
  Fractions and the topics after it show one chapter later (Fractions is
  chapter 3).
  Checks: equations stay on one line and read in order at 360/390/1366px;
  `check:viewport` shows long-division feedback ending below the pinned bar
  (up to 154px on a 360px phone, 180px on a 768px laptop), because its
  digits are kept readable (about 13px) instead of squeezed to 72px.
  Sprint 17.
- 2026-11-01: Every lesson opens with a step-by-step animation, one scene
  per rule. In 2.1 and 2.2 counters gather from a pile into equal groups;
  each outline appears when its group is full, the leftovers turn orange,
  and the equation fills in ("17 ÷ 5 = 3 ושארית 2"). One more group with
  empty seats when the leftovers need a place; faded leftovers when they
  are dropped. In 2.3 and 2.4 the long division fills in one quotient digit
  per step (divide, multiply, subtract, bring down), with the same actions
  written beside it and in the caption. With reduced motion the counters
  appear in place. Sprint 17.
- 2026-11-03: Lessons built by the shared `mathLesson`, with no extra checks:
  the remainder options mix Hebrew with numbers by design, and 105.2 q28
  writes ס"מ with a quote mark. Content unchanged (identical by id). Sprint 19.
- 2026-11-03: d11: 105.2 q28 writes ס״מ (it had a quote mark); the lessons now
  refuse a quote mark inside a Hebrew word (`noQuote: 'units'`; 105.2 q30 may
  still quote a question). Only that exercise changed (same id).

### Topic 101: Fractions (Math)
- 2026-09-27: Teaching document (7 rules, each with examples) and 30 exercises
  (10 per level), answers verified by an exact-fraction check script. Sprint 2.
- 2026-09-27: Split into six subtopics (what a fraction is; equivalent and
  reducing; comparing; adding and subtracting; multiplying and dividing; mixed
  numbers), each with pictures (inline SVG from `seeds/math-svg.js`) and 30
  exercises whose answers are computed by `seeds/fractions/rat.js` and checked
  by an independent evaluator. Fractions render stacked (numerator over
  denominator) everywhere. Topics 102–104 moved to order 1021/1031/1041. Sprint 3.
- 2026-09-28: Animated explanations above the theory of all six subtopics
  (`frontend/src/content/animations/fractions/`), one scene per rule, played by
  `LessonAnimation`. Sprint 4.
- 2026-10-31: Shown as math chapter 2 (the multiplication table is chapter 1).
  The example badges on the math page are wrapped in `ltr()`: they showed
  reversed in the right-to-left page ("1/4 = 3/4 − 1" for `1 − 3/4 = 1/4`).
  Sprint 15.
- 2026-11-01: Shown as chapter 3 (lessons 3.1–3.6): Division (topic 105) is
  chapter 2. Content unchanged. Sprint 17.
- 2026-11-01: The animation captions show their equations in order: they
  were reversed in the right-to-left caption ("340 = 4 × 85"); the player
  now isolates them, each on one line. Content unchanged. Sprint 17.

### Topic 110: Decimals (Math)
- 2026-11-03: New topic, chapter 4 of Math (right after Fractions), in four
  lessons: 110.1 tenths and hundredths (place value, a fraction of 10 or 100
  and back, widening 1/2, 1/4, 3/4 and 3/20, zeros at the end), 110.2
  comparing and rounding (the wholes first, longer is not larger, the number
  line, ordering asked as a chain of <, rounding to a whole and to a tenth),
  110.3 adding and subtracting (the points lined up, filled zeros, ten tenths
  make a whole, subtracting from a whole number, money and length stories),
  110.4 multiplying and dividing (× and ÷ 10, 100, 1000 move every digit,
  counting the digits after the point, dividing by a decimal by moving both
  points). Each a Hebrew teaching document with a picture for every rule and
  30 multiple-choice questions (10 per level); six are asked on their own
  hundred square or number line (PNGs for the bot). Pictures: `hundredGrid`,
  `decimalLine`, `placeValue` and `columnCalc`, new in `math-svg.js`
  (existing ones untouched), with `grid`, `groups` and `longDivision`.
  Exact arithmetic on whole numbers and wrong options from the common
  mistakes (points not lined up, the smaller digit from the larger, 0.3 × 0.2
  = 0.6, the point moved) come from `seeds/decimals/common.js`. The
  reading-order rules for decimals were measured and written into the math
  guide before the lessons. `scripts/checks/topic110.js` re-computes all 120
  answers with its own exact arithmetic (stories from their words), reads
  every picture back against its caption and enforces the guide's rules on
  the raw text (39 planted faults caught); it found three defects, fixed
  before the PR. Equations that hold a stacked fraction are kept on one line
  (`oneLine` in `mathLesson`, `math-line` on the website): a browser broke
  them next to the fraction even before a no-break space. 10,695 runs
  (isolates, equation spans, options, decimals) read in order on one line on
  the real pages at 360/390/1366 px and in the bot's messages
  (`frontend/scripts/reading-order-check.js`); every picture question ends
  above the pinned bar. Order of operations to Equations show as chapters
  5–11; every existing lesson and exercise is unchanged (compared by id).
  Sprint 20.
- 2026-11-04: 110.2 q23 (ordering 2.1, 2.09, 2.19 and 2.9): the place-value
  table under its explanation showed only the first three numbers and left
  out 2.90, which ends the chain. It now shows all four.
  `scripts/checks/topic110.js` now checks that an order's table holds every
  number of the answer; it fails on the old data. The only record that
  changed. Sprint 20 close (review).

### Topic 102: Order of Operations (Math)
- 2026-09-27: Teaching document (parentheses, × ÷ before + −, left to right,
  nested parentheses, negative results, exponents note) and 30 exercises; every
  expression evaluated by a script. Sprint 2.
- 2026-09-28: Animated explanation above the theory
  (`frontend/src/content/animations/order-of-operations/102-1.jsx`): five
  scenes, one per rule, showing the expression with the part computed now
  highlighted and its result popping on the next row. Sprint 5.
- 2026-11-01: The animation captions show their equations in order: they
  were reversed in the right-to-left caption ("340 = 4 × 85"); the player
  now isolates them, each on one line. Content unchanged. Sprint 17.
- 2026-11-03: Shown as chapter 5: Decimals (topic 110) is chapter 4. Content
  unchanged (identical by id). Sprint 20.

### Topic 103: Average (Math)
- 2026-09-27: Teaching document (sum ÷ count, sum from average, missing value,
  adding a value, word problems) and 30 exercises, answers verified by script. Sprint 2.
- 2026-09-28: Animated explanation (`animations/average/103-1.jsx`): bar
  charts with a dashed average line, bars that level out to the mean, and the
  sum/count arithmetic. Five scenes, one per rule. Sprint 5.
- 2026-11-01: The animation captions show their equations in order: they
  were reversed in the right-to-left caption ("340 = 4 × 85"); the player
  now isolates them, each on one line. Content unchanged. Sprint 17.
- 2026-11-03: Shown as chapter 6: Decimals (topic 110) is chapter 4. Content
  unchanged (identical by id). Sprint 20.

### Topic 104: Percentage (Math)
- 2026-09-27: Teaching document (percent ↔ fraction ↔ decimal, percent of a
  number, what percent, finding the whole, discount and VAT) and 30 exercises,
  answers verified by script. Sprint 2.
- 2026-09-28: Animated explanation (`animations/percentage/104-1.jsx`):
  hundred grid for percent ↔ fraction ↔ decimal, bars for percent of a number
  and finding the whole, price tags for discount, VAT and the 20%-down-20%-up
  trap. Five scenes, one per rule. Sprint 5.
- 2026-11-01: The animation captions show their equations in order: they
  were reversed in the right-to-left caption ("340 = 4 × 85"); the player
  now isolates them, each on one line. Content unchanged. Sprint 17.
- 2026-11-03: Shown as chapter 7: Decimals (topic 110) is chapter 4. Content
  unchanged (identical by id). Sprint 20.

### Topic 106: Negative Numbers (Math)
- 2026-11-02: New topic, chapter 7 of Math (after percentage): 106.1 negative
  numbers on the number line (their place, comparing, opposites, the distance
  from 0), 106.2 adding and subtracting (hops right and left, subtracting as
  adding the opposite), 106.3 multiplying and dividing (a positive times a
  negative as equal hops, negative times negative from a pattern, division by
  the same sign rules, several factors). Each a Hebrew teaching document with
  a picture for every rule and 30 multiple-choice questions (10 per level),
  with word problems on temperatures, floors, depths, debts and an average.
  Pictures: `integerLine` (a new function in `math-svg.js`; `numberLine` is
  unchanged), numbers with a real minus sign, hops as arrows, equal hops on
  one level for products and quotients. Signed numbers, wrong options from
  the common mistakes (the wrong sign, adding the distances, forgetting the
  opposite) and explanations come from `seeds/negatives/common.js`;
  `scripts/checks/topic106.js` re-computed all 90 answers with its own
  parser and reads every number line back (points, hop labels, ticks, the
  caption's equation). Every existing lesson and exercise is unchanged
  (compared by id). Checks: equations stay on one line and read in order at
  360/390/1366px, every minus sits inside an isolate, options read left to
  right. Sprint 18.
- 2026-11-02: Every lesson opens with a step-by-step animation, one scene
  per rule: hops on the number line traced one after another (adding,
  subtracting the opposite, equal hops for × and ÷), the sign pattern of
  × row by row, opposites and the distance from 0. Sprint 18.
- 2026-11-03: Lessons built by the shared `mathLesson`; the option check now
  also refuses a Latin letter next to Hebrew, and a quote mark is refused.
  Pictures pass to `intQ`/`choiceQ` as `{ picture }`. Content unchanged
  (identical by id). Sprint 19.
- 2026-11-03: Shown as chapter 8: Decimals (topic 110) is chapter 4. Content
  unchanged (identical by id). Sprint 20.

### Topic 107: The x and y Axes (Math)
- 2026-11-02: New topic, chapter 8 of Math (after negative numbers): 107.1
  the axes and a point (the x and y axes, the origin, (x, y) with x first,
  negative coordinates, the four quarters, points on the axes), 107.2
  plotting points (placing and moving a point, the distance along a grid
  line, the fourth corner of a rectangle, area and perimeter on the grid).
  Each a Hebrew teaching document with a grid for every rule and 30
  multiple-choice questions (10 per level). Plotting is asked with pictures
  (owner's decision): 22 questions carry their own grid
  (`questionPicture` → `question_picture`), shown between the question and
  the options; on a wide screen beside the options. Grids: `coordGrid` in
  `math-svg.js` (numbered axes with a real minus sign, named points, dashed
  guides, segments and arrows); under an explanation at 0.8 of their size
  with the class `math-grid`, which the feedback box does not squeeze.
  Points, wrong options (x and y swapped, a sign flipped) and quarters come
  from `seeds/axes/common.js`; `scripts/checks/topic107.js` reads every grid
  back from its SVG and re-computed all 60 answers (12 planted faults
  caught). Every existing lesson and exercise is unchanged (compared by id).
  Checks: at 360/390/1366px every grid question ends above the pinned bar,
  equations stay on one line and read in order. In Telegram the grid
  questions are left out of lesson rounds and the mistakes exam. Sprint 18.
- 2026-11-02: Every lesson opens with a step-by-step animation, one scene
  per rule: a point is reached by walking along x, then along y; the
  quarters fill in one by one; a point moves with an arrow; a distance is
  drawn along a grid line; a rectangle's fourth corner appears. Sprint 18.
- 2026-11-03: The grid questions are in Telegram too: each grid is drawn
  as a PNG (`npm run question-pictures` in frontend/), served by the
  website, and the bot sends it as a photo with the question as its
  caption and the answer buttons, in lesson rounds and the mistakes exam.
  Sprint 18.
- 2026-11-03: Lessons built by the shared `mathLesson` (`eq` and
  `withQuestionPicture` shared too), which now also refuses a quote mark.
  Content unchanged (identical by id). Sprint 19.
- 2026-11-03: Shown as chapter 9: Decimals (topic 110) is chapter 4. Content
  unchanged (identical by id). Sprint 20.

### Topic 108: Triangles (Math)
- 2026-11-02: New topic, chapter 9 of Math (after the axes): 108.1 kinds
  of triangles (by sides and by angles, both at once, equal sides opposite
  equal angles, which lengths make a triangle), 108.2 the angle sum, 180°
  (a missing angle, right triangles, isosceles base and top angles, the
  equilateral triangle, relations between angles), 108.3 perimeter and
  area (half a rectangle, base × height ÷ 2, the legs of a right triangle,
  a height outside an obtuse triangle, reverse problems). Each a Hebrew
  teaching document with a picture for every rule and 30 multiple-choice
  questions (10 per level); 8 questions are asked on their own picture.
  Pictures: `triangle` in `math-svg.js`, drawn to shape from two angles,
  three sides or a base and an apex: angle arcs with degrees, right-angle
  squares, equal-side marks, side lengths, a dashed height (the base
  extended when it falls outside) and the rectangle it is half of. Angles,
  wrong options (360° instead of 180°, forgetting one angle, forgetting
  ÷ 2, a slanted side as the height) and pictures come from
  `seeds/triangles/common.js`; `scripts/checks/topic108.js` reads every
  triangle back (each angle label within 1° of the drawing, right-angle
  marks on right angles, equal marks on equal sides, lengths in
  proportion) and re-computed all 90 answers (11 planted faults caught).
  Every existing lesson and exercise is unchanged (compared by id).
  Checks: at 360/390/1366px every picture question ends above the pinned
  bar, equations stay on one line and read in order. Sprint 18.
- 2026-11-02: Every lesson opens with a step-by-step animation, one scene
  per rule: a triangle's three corners torn off and laid on a straight line
  (180°), rods that meet or fall short (which lengths make a triangle), the
  rectangle a triangle is half of, the height dropping onto the base. Sprint 18.
- 2026-11-03: The picture questions are in Telegram too, sent as a photo
  with the question as its caption (as in topic 107). Sprint 18.
- 2026-11-03: Lessons built by the shared `mathLesson` (`eq` and
  `withQuestionPicture` shared too). Content unchanged (identical by id).
  Sprint 19.
- 2026-11-03: Shown as chapter 10: Decimals (topic 110) is chapter 4. Content
  unchanged (identical by id). Sprint 20.

### Topic 109: Equations with One Unknown (Math)
- 2026-11-03: New topic, chapter 10 of Math (after the triangles), in seven
  lessons; the first three: 109.1 what an unknown is (a number hidden in a
  box on a level balance, a letter in its place, an equation as two equal
  sides, a solution and checking it by putting it in, 3x as 3 times x),
  109.2 addition and subtraction, keeping the balance (the same off both
  pans, the opposite operation, the unknown on the right, checking, a
  negative solution on the number line), 109.3 multiplication and division
  (both pans in equal groups, dividing to undo ×, multiplying to undo ÷).
  Each a Hebrew teaching document with a balance picture for every rule and
  30 multiple-choice questions (10 per level); none is asked on a picture
  (owner's decision). Pictures: `balance` in `math-svg.js` (boxes for the
  unknown, weights, unit cubes, bags, struck items, equal groups, a tilt);
  expressions, an exact solver, wrong options from the common mistakes
  (adding instead of undoing, reading 3x as 35, subtracting instead of
  dividing, the sign) and pans built from an equation come from
  `seeds/equations/common.js`. The reading-order rules for equations with x
  were measured and written into the math guide before the lessons.
  `scripts/checks/topic109.js` re-computes all 90 answers with its own
  solver (stories from their words), reads all 50 balances back from their
  SVG and enforces the reading-order rules (14 planted faults caught).
  Every existing lesson and exercise is unchanged (compared by id). Checks:
  1,185 equations read in order on one line on the real pages at
  360/390/1366px, and 1,426 in the bot's messages. Sprint 19.
- 2026-11-03: Lessons 109.4–109.6: 109.4 equations in two steps (take the
  number off first, then divide; undo in reverse order; x ÷ a + b = c; the
  unknown on the right), 109.5 the unknown on both sides (the same boxes off
  both pans, from the side with fewer x; x may end on the right; check both
  sides), 109.6 parentheses and like terms (collect the x and the numbers,
  2(x + 3) as two equal bags, divide by the number outside or open the
  parentheses, then solve). Each with a balance for every rule and 30
  questions, among them stories (notebooks, taxi, savings, gym, candles,
  stickers, cinema, consecutive numbers, a rectangle's perimeter, a square
  and a triangle). `steps()` in `seeds/equations/common.js` writes the
  explanation of any linear equation with its check in the equation as
  written. The check now re-computes all 180 answers (new question forms
  and stories), accepts identities (2(x + 3) = 2x + 6), refuses a theory
  equation solving to 0 (a broken identity) and a paragraph starting with an
  equation (25 planted faults caught). Existing content unchanged (by id).
  1,830 equations of the new lessons read in order on the real pages at
  360/390/1366px, and 3,228 in the bot's messages of the chapter. Sprint 19.
- 2026-11-03: Lesson 109.7 from a story to an equation completes the
  chapter (7 of 7). The four steps on one story, each on a balance: choose
  what x is (an older sister as a bag of x and 4), write the equation, solve,
  check in the story, and answer what was asked. 30 questions: which
  expression the words describe (more, fewer, times, half), which equation
  fits a story, and stories to solve (ages, a father and son in the future,
  money left, sharing, a rectangle and an isosceles triangle, consecutive
  and even numbers, sweets, tickets), some asking for the other amount.
  Options with x are glued equations and expressions; the bot now isolates
  an option whose only letter is a lone x. The check reads every story's
  equation and question from its words, requires exactly one option to fit
  (by its solution, or as the same expression), and reads a balance whose
  boxes cancel (34 planted faults caught). 732 equations of 10.7, options and
  answers included, read in order on one line on the real pages; 3,832 in the
  bot's messages of the chapter. Sprint 19.
- 2026-11-03: Sprint 19 close review. 10.2's checks follow the equation as
  written (flipped ones too) and write a negative x first without
  parentheses (−5 + 9 = 4), as the math guide says; 10.1 and 10.2 put x in
  with the shared `plug` and `checkQ`. Two repeated questions got new
  numbers: 10.1 q27 (42 = 6x, was easy q9's 4x = 20) and 10.2 q4 (x + 9 = 16,
  was q8's 7 and 15). 16 explanations changed; every id kept. The check now
  enforces the parentheses rule (35 planted faults caught); 777 equations of
  10.1–10.2 read in order on the real pages, 3,838 in the bot's messages.
- 2026-11-03: Shown as chapter 11: Decimals (topic 110) is chapter 4. Content
  unchanged (identical by id). Sprint 20.

### Topic 111: Ratio and Proportion (Math)
- 2026-11-04: New topic, chapter 12 of Math (after the equations), in three
  lessons: 111.1 what a ratio is (comparing two amounts, written 3:5 and read
  3 ל-5, the order matters, simplifying, equal ratios, a part of the whole,
  ratios of quantities in different units), 111.2 dividing in a ratio (count
  the parts, one part, each share; from one share to the other and to the
  whole, from the difference, ratios of three terms, a triangle's angles and
  a rectangle's sides), 111.3 proportion (the products of the outer and
  inner terms, a missing term by how many times and by an equation of
  chapter 11, unit price, recipes, map scale). Each a Hebrew teaching
  document with a picture for every rule and 30 multiple-choice questions
  (10 per level); eight are asked on their own bar model or ratio table
  (PNGs for the bot). Pictures: `ratioBar` (equal parts per amount, the
  value of a part, a whole split in two colours) and `ratioTable` (equal
  ratios in columns, the step between them), new in `math-svg.js`, and one
  `balance`. Ratios, shares and missing terms come from
  `seeds/ratio/common.js`, which refuses whatever does not come out whole.
  The reading-order rules for ratios were measured and written into the
  math guide first: 3:5 with no spaces reads right with no isolate, 3 : 5
  with spaces shows as 5 : 3. `scripts/checks/topic111.js` re-computes all
  90 answers with its own exact arithmetic (stories from their words), reads
  every picture back and enforces the rules on the raw text (32 planted
  faults caught); it found two explanations starting with an isolate, fixed.
  5,443 runs (isolates, equation spans, options, decimals and ratios) read in
  order on one line on the real pages at 360/390/1366 px and in the bot's
  messages; every picture question ends above the pinned bar. No chapter
  moves; every existing lesson and exercise is unchanged (compared by id).
  Sprint 20.

### Topic 112: Linear Functions (Math)
- 2026-11-04: New topic, chapter 13 of Math (last), in three lessons:
  112.1 from a rule to a line (put x in and build a table of values, the
  table's points lie on one line, y = kx goes through the origin as in a
  proportion, is a point on the line), 112.2 slope and the y-intercept (b
  where the line meets the y axis, the slope as the change in y for one
  step in x, rising, falling or flat, parallel lines, the slope from two
  points, a fraction slope, the rule of a drawn line), 112.3 crossing the
  axes and stories (y = 0 as an equation of chapter 11, the two crossings
  draw the line, a taxi, savings, a phone plan, candles, a game, reading a
  value off a graph). Each a Hebrew teaching document with a picture for
  every rule and 30 multiple-choice questions (10 per level); 23 are asked
  on their own graph or table of values (PNGs for the bot). Pictures:
  `coordGrid` draws a whole line y = mx + b across the grid (`graphs`, with
  its rule as a label), and `valueTable` (x on top, y under it, the steps
  between columns), which shares its drawing with `ratioTable`. Rules,
  substitutions and wrong options come from `seeds/functions/common.js`.
  The reading-order rules were measured first (40 cases) and written into
  the math guide: every rule and point in an isolate, and never two bare
  Latin letters with only a comma or a colon between them ("את x, m, הוא"
  reads m first). `scripts/checks/topic112.js` re-computes all 90 answers
  from the words of the questions, reads every line back from its SVG
  pixels, and checks the points, the steps of a slope, the tables, every
  equation and the rules on the raw text (42 planted faults caught). 4,104
  runs read in order on one line on the real pages at 360/390/1366 px and
  in the bot's messages. Every picture question ends above the pinned bar
  even as the first question of a session (11 were reworded or given a
  5-unit grid to get there). No chapter moves; every existing lesson and
  exercise is unchanged (compared by id). Sprint 20.

### Topic 1: Grammar Basics
- Initial seed file created
- 2026-01-21: Registered in seed-all-lessons.js
- 2026-09-28: All exercises are multiple choice (no typing, on the web and in the Telegram bot): 103 fill-in questions converted to 4 options whose wrong options are wrong in their sentence, each independently reviewed; 100 texts clarified, 6 keys and 10 explanations corrected; weak items rebuilt as "which is written correctly?" (book titles, the Pacific Ocean, comma inside quotes, nested quotes, spacing, word order); 1 existing question repaired (answer missing from its options); capitalisation questions now graded by exact text.
- 2026-09-29: Defect d6 audit of the 106 older multiple-choice questions, each checked twice: 21 fixed (0 keys, 12 texts, 1 explanations corrected), the rest confirmed; capitalisation options are all lower case (the key was the only capitalised word); subject questions ask for the complete subject.

### Topic 2: Verb "To Be" - Present
- Initial seed file created
- 2026-01-21: Fixed naming issue (seedTopic6 → seedTopic2)
- 2026-01-21: Registered in seed-all-lessons.js
- 2026-09-28: All exercises are multiple choice (no typing, on the web and in the Telegram bot): 70 fill-in questions converted to 4 options whose wrong options are wrong in their sentence, each independently reviewed; 15 texts clarified, 2 keys and 14 explanations corrected; collective-noun explanations corrected (American English uses the singular, British also allows the plural) and 5 existing questions no longer offer the British plural as a wrong option; "Neither of them is right" key fixed (double negative).
- 2026-09-29: Defect d6 audit of the 65 older multiple-choice questions, each checked twice: 13 fixed (1 keys, 8 texts, 7 explanations corrected), the rest confirmed; "neither/either" items use a singular noun ("Neither of them are" is accepted informal English), also in 2 already-reviewed questions; the police explanations (3) no longer say the police is not an organisation.

### Topic 3: Personal Pronouns & Possessives
- Seed file created and registered in seed-all-lessons.js
- 2026-09-28: All exercises are multiple choice (no typing, on the web and in the Telegram bot): 31 fill-in questions converted to 4 options whose wrong options are wrong in their sentence, each independently reviewed; 2 texts clarified, 1 keys and 1 explanations corrected; one-blank style for "yours, hers"; 1 existing question (government: its/their) repaired.
- 2026-09-29: Defect d6 audit of the 48 older multiple-choice questions, each checked twice: 10 fixed (0 keys, 5 texts, 3 explanations corrected), the rest confirmed; Hebrew cues where two pronouns fitted (the baby, ours); "his" no longer a wrong option for a dog's tail.

### Topic 4: Nouns - Singular & Plural
- Initial seed file created
- 2026-01-21: Fixed naming issue (seedTopic5 → seedTopic4)
- 2026-01-21: Registered in seed-all-lessons.js
- 2026-09-28: All exercises are multiple choice (no typing, on the web and in the Telegram bot): 61 fill-in questions converted to 4 options whose wrong options are wrong in their sentence, each independently reviewed; 38 texts clarified, 1 keys and 12 explanations corrected; some/any items rebuilt around negatives and if-clauses so one form is right; 7 existing questions repaired (duplicate option, some/any and somebody/anybody items with two right answers).
- 2026-09-29: Defect d6 audit of the 58 older multiple-choice questions, each checked twice: 14 fixed (2 keys, 0 texts, 10 explanations corrected), the rest confirmed; plural questions keyed "both" no longer offer each correct form alone as a wrong option; "work" and "two breads" keys fixed; "מהי צורת הרבים" wording in 25 questions.

### Topic 5: Articles
- Seed file created and registered in seed-all-lessons.js
- 2026-09-28: All exercises are multiple choice (no typing, on the web and in the Telegram bot): 32 fill-in questions converted to 4 options whose wrong options are wrong in their sentence, each independently reviewed; 16 texts clarified, 0 keys and 7 explanations corrected; Hebrew cues make "the" or "-" wrong where they are offered; 4 existing article questions repaired ("the university", "plays piano", "elected the president" were also right).
- 2026-09-29: Defect d6 audit of the 44 older multiple-choice questions, each checked twice: 23 fixed (2 keys, 19 texts, 1 explanations corrected), the rest confirmed; Hebrew cues where "the" also fitted; the rule for "the" with country names corrected.

### Topic 6: Demonstratives
- Initial seed file created
- 2026-01-21: Fixed naming issue (seedTopic8 → seedTopic6)
- 2026-01-21: Registered in seed-all-lessons.js
- 2026-09-28: All exercises are multiple choice (no typing, on the web and in the Telegram bot): 63 fill-in questions converted to 4 options whose wrong options are wrong in their sentence, each independently reviewed; 64 texts clarified, 0 keys and 18 explanations corrected; near/far cues decide this/that and these/those; 1 existing question repaired ("Who is that? - That is..." was also right).
- 2026-09-29: Defect d6 audit of the 76 older multiple-choice questions, each checked twice: 33 fixed (3 keys, 20 texts, 17 explanations corrected), the rest confirmed; near/far and today cues where this/that or these/those both fitted; "These waters" is correct English; an option that pointed at option positions fixed (options are shuffled).

### Topic 7: There is / There are
- Initial seed file created
- 2026-01-21: Registered in seed-all-lessons.js
- 2026-09-28: All exercises are multiple choice (no typing, on the web and in the Telegram bot): 70 fill-in questions converted to 4 options whose wrong options are wrong in their sentence, each independently reviewed; 23 texts clarified, 0 keys and 16 explanations corrected; "there is/are" items no longer depend on the contested first-noun rule (5 existing questions repaired too); offer/request explanations no longer call "any" a mistake, and 1 existing some/any question no longer offers "some" as a wrong option.
- 2026-09-29: Defect d6 audit of the 64 older multiple-choice questions, each checked twice: 15 fixed (1 keys, 3 texts, 10 explanations corrected), the rest confirmed; list explanations no longer call either agreement rule a mistake (also in 3 already-reviewed questions); some/any items with two right answers fixed.

### Topic 8: Adjectives
- Initial seed file created
- 2026-01-21: Fixed naming issue (seedTopic9 → seedTopic8)
- 2026-01-21: Registered in seed-all-lessons.js
- 2026-09-28: All exercises are multiple choice (no typing, on the web and in the Telegram bot): 39 fill-in questions converted to 4 options whose wrong options are wrong in their sentence, each independently reviewed; 30 texts clarified, 4 keys and 9 explanations corrected; adjective-order items use three adjectives, "absolutely" goes with extreme adjectives, asleep/sleeping decided before a noun.
- 2026-09-29: Defect d6 audit of the 101 older multiple-choice questions, each checked twice: 46 fixed (8 keys, 16 texts, 20 explanations corrected), the rest confirmed; 21 options that carried their own explanation made plain; register keys (wealthy, cheap) fixed; real words (unbeautiful, unoptimistic) no longer offered as wrong.

### Topic 9: Present Simple Tense
- Seed file created and registered in seed-all-lessons.js
- 2026-09-28: All exercises are multiple choice (no typing, on the web and in the Telegram bot): 53 fill-in questions converted to 4 options whose wrong options are wrong in their sentence, each independently reviewed; 8 texts clarified, 0 keys and 0 explanations corrected.
- 2026-09-29: Defect d6 audit of the 67 older multiple-choice questions, each checked twice: 15 fixed (0 keys, 7 texts, 0 explanations corrected), the rest confirmed; past-habit forms that also fitted replaced; timetable and habit cues added.

### Topic 10: Question Words
- Documented in topics.md
- Frontend mapping added
- 2026-01-21: Seed file created (7 subtopics, 140 exercises)
- 2026-01-21: Registered in seed-all-lessons.js
- 2026-09-28: All exercises are multiple choice (no typing, on the web and in the Telegram bot): 63 fill-in questions converted to 4 options whose wrong options are wrong in their sentence, each independently reviewed; 4 texts clarified, 0 keys and 0 explanations corrected; short replies added as cues where two question words fitted.
- 2026-09-29: Defect d6 audit of the 77 older multiple-choice questions, each checked twice: 18 fixed (1 keys, 13 texts, 2 explanations corrected), the rest confirmed; short answers added as cues where two question words fitted; "What will you studying" key fixed.

### Topic 11: Present Progressive
- Seed file created and registered in seed-all-lessons.js
- 2026-09-28: All exercises are multiple choice (no typing, on the web and in the Telegram bot): 103 fill-in questions converted to 4 options whose wrong options are wrong in their sentence, each independently reviewed; 9 texts clarified, 0 keys and 0 explanations corrected; one blank per question, Hebrew cues replace hints that were the answer; 3 existing -ing spelling questions had a duplicated option.
- 2026-09-29: Defect d6 audit of the 104 older multiple-choice questions, each checked twice: 24 fixed (0 keys, 8 texts, 1 explanations corrected), the rest confirmed; present simple for timetables and "now" no longer offered as wrong where it fits; fix-the-sentence items no longer offer a correct sentence.

### Topic 12: Can / Could
- Initial seed file created
- 2026-01-21: Registered in seed-all-lessons.js
- 2026-09-28: All exercises are multiple choice (no typing, on the web and in the Telegram bot): 56 fill-in questions converted to 4 options whose wrong options are wrong in their sentence, each independently reviewed; 0 texts clarified, 0 keys and 2 explanations corrected.
- 2026-09-29: Defect d6 audit of the 84 older multiple-choice questions, each checked twice: 19 fixed (2 keys, 11 texts, 3 explanations corrected), the rest confirmed; "most polite" cues where Can and Could both fitted; "Could you mind" key fixed; "can not" treated as an accepted spelling.

### Topic 13: Prepositions of Place
- Initial seed file created
- 2026-01-21: Fixed naming issue (seedTopic10 → seedTopic13)
- 2026-01-21: Registered in seed-all-lessons.js
- 2026-09-28: All exercises are multiple choice (no typing, on the web and in the Telegram bot): 54 fill-in questions converted to 4 options whose wrong options are wrong in their sentence, each independently reviewed; 10 texts clarified, 1 keys and 19 explanations corrected; explanations that called correct forms mistakes (in the office, over the door, between mountains) fixed; the bird's-nest item rewritten.
- 2026-09-29: Defect d6 audit of the 86 older multiple-choice questions, each checked twice: 59 fixed (10 keys, 24 texts, 45 explanations corrected), the rest confirmed; second right prepositions replaced (on the corner, at the library, over/above, under zero, in the plane); false premises rewritten.

### Topic 14: Prepositions of Time
- Initial seed file created
- 2026-01-21: Fixed naming issue (seedTopic11 → seedTopic14)
- 2026-01-21: Registered in seed-all-lessons.js
- 2026-09-28: All exercises are multiple choice (no typing, on the web and in the Telegram bot): 47 fill-in questions converted to 4 options whose wrong options are wrong in their sentence, each independently reviewed; 1 texts clarified, 0 keys and 12 explanations corrected; explanations now say which alternatives are also right (by 12, at dinner, before/until).
- 2026-09-29: Defect d6 audit of the 93 older multiple-choice questions, each checked twice: 38 fixed (4 keys, 9 texts, 16 explanations corrected), the rest confirmed; during/in, at/on the weekend, in time/on time double answers fixed; an option that pointed at option positions fixed.

### Topic 15: Past Simple Tense
- Seed file created and registered in seed-all-lessons.js
- 2026-09-28: All exercises are multiple choice (no typing, on the web and in the Telegram bot): 105 fill-in questions converted to 4 options whose wrong options are wrong in their sentence, each independently reviewed; 5 texts clarified, 2 keys and 2 explanations corrected; "_______ he _______ (buy)" items use the two-part answer style (Did, buy).
- 2026-09-29: Defect d6 audit of the 105 older multiple-choice questions, each checked twice: 32 fixed (0 keys, 8 texts, 1 explanations corrected), the rest confirmed; present forms that fitted sentences without a time word replaced; short answers added to wh- questions.

### Topic 16: Going to
- Documented in topics.md
- Frontend mapping added
- Seed file pending

### Topic 17: Future Simple - will
- Documented in topics.md
- Frontend mapping added
- Seed file pending

### Topic 18: Comparatives & Superlatives
- Documented in topics.md
- Frontend mapping added
- Seed file pending

---

## Next Steps (Priority)

1. **Register partial topics** - Add topics 1, 2, 4, 6, 7, 8, 12, 13, 14 to seed-all-lessons.js
2. **Create missing seed files** - Topics 10, 16, 17, 18
3. **Run database seed** - After registering all topics
