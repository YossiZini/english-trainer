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
numbered 101+ (shown as 1+ on the `/math` page). A topic with several
subtopics keeps them in a folder (`seeds/fractions/`) and composes them in
`topic1NN-*.js`; write fractions as `a/b` in text and theory, the app shows
them stacked (`MathText` for exercise text, `stackFractions` for theory HTML).
Pictures for theory come from `seeds/math-svg.js` (`circle`, `bar`,
`numberLine`, `grid`, `figure`). Seeds are plain modules
(`module.exports = { lessonsData }`) built with `seeds/math-helpers.js`; each
topic has one teaching document and 10 exercises per level (easy/medium/hard),
because an exercise session is 10 questions. Regenerate with
`cd backend && npm run generate-data math` (English content is never rebuilt
implicitly). Display text: `frontend/src/content/topicMeta.js` (`math`).

| # | Topic Name (EN) | Topic Name (HE) | Seed File | Registered | Frontend | Status |
|---|-----------------|-----------------|-----------|------------|----------|--------|
| 101 | Fractions (6 subtopics 101.1–101.6) | שברים | topic101-fractions.js + fractions/*.js | Yes | Yes | Complete |
| 102 | Order of Operations | סדר פעולות חשבון | topic102-order-of-operations.js | Yes | Yes | Complete |
| 103 | Average | ממוצע | topic103-average.js | Yes | Yes | Complete |
| 104 | Percentage | אחוזים | topic104-percentage.js | Yes | Yes | Complete |

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

- **Complete:** 15 English topics (1–15), 4 math topics (101–104), 1 Arabic topic (201)
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

### Topic 102: Order of Operations (Math)
- 2026-09-27: Teaching document (parentheses, × ÷ before + −, left to right,
  nested parentheses, negative results, exponents note) and 30 exercises; every
  expression evaluated by a script. Sprint 2.
- 2026-09-28: Animated explanation above the theory
  (`frontend/src/content/animations/order-of-operations/102-1.jsx`): five
  scenes, one per rule, showing the expression with the part computed now
  highlighted and its result popping on the next row. Sprint 5.

### Topic 103: Average (Math)
- 2026-09-27: Teaching document (sum ÷ count, sum from average, missing value,
  adding a value, word problems) and 30 exercises, answers verified by script. Sprint 2.
- 2026-09-28: Animated explanation (`animations/average/103-1.jsx`): bar
  charts with a dashed average line, bars that level out to the mean, and the
  sum/count arithmetic. Five scenes, one per rule. Sprint 5.

### Topic 104: Percentage (Math)
- 2026-09-27: Teaching document (percent ↔ fraction ↔ decimal, percent of a
  number, what percent, finding the whole, discount and VAT) and 30 exercises,
  answers verified by script. Sprint 2.
- 2026-09-28: Animated explanation (`animations/percentage/104-1.jsx`):
  hundred grid for percent ↔ fraction ↔ decimal, bars for percent of a number
  and finding the whole, price tags for discount, VAT and the 20%-down-20%-up
  trap. Five scenes, one per rule. Sprint 5.

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
