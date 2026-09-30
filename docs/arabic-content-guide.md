# Arabic content guide

How to write an Arabic unit: the facts, the teaching pages, the questions and
their checks. Short by design; the code it points to is the reference.

## What the subject is

Arabic for Hebrew-speaking beginners (grade 7). Students **read and
recognise**: letters inside words, letter names, Hebrew counterparts, vowel
signs, and word meanings. They never write Arabic and never type it; every
question is multiple choice. Only the teacher's material is taught: nothing a
question needs may come from outside the unit's facts.

## Where things live

| What | Where |
|---|---|
| Unit facts (letters, vowels, words, readings, meanings) | `backend/src/database/seeds/arabic/facts.js` |
| Builders and checks | `seeds/arabic/common.js`: `q`, `lesson`, `others`, `ar`, `mcq` |
| One file per lesson | `seeds/arabic/2NN-K-<name>.js` exporting a lesson (built by `lesson()`) |
| Topic composer | `seeds/topic2NN-<name>.js` exporting `{ lessonsData }` |
| Registration | `subjectFiles.arabic` in `backend/src/data/generateJsonData.js` |
| Display text (names, TOC line, description) | `frontend/src/content/topicMeta.js` (`arabic`) |
| Subject list (API) | `backend/src/config/subjects.js` |
| Status and activity log (required by CLAUDE.md) | `docs/topics-status.md` |

Numbering: topics `201+` (shown as `1+`), subtopics `'201.3'`, `orderIndex`
`2000 + offset` (unit 1: 2001–2005). Lesson ids are preserved by
`topic/subtopic`, so renaming a subtopic key creates a new lesson.

## Facts first

Every letter, vowel and word of a unit goes into `facts.js` **once**, and
the teaching pages and questions read from it. A word lists its letters with
the vowel on each; `common.js` rebuilds the Arabic string from that list and
throws if it differs from the word, so a wrong vowel mark cannot ship.
Conventions of the school material: ذ = ד׳, alif without hamza carries no
vowel, sukun is "no vowel" (no Hebrew counterpart).

Arabic strings carry their harakat (U+064E fatha, U+064F damma, U+0650 kasra,
U+0652 sukun) as combining marks after the letter. Never put a vowel on ا.

## Teaching page (`theoryContentHe`)

- Hebrew, short. Order: `<h2>` title, one-paragraph intro, a table of the
  facts (`.letters-table`), then `<h3>כלל N: …</h3>` sections with examples
  from the unit's words, a `.warning` for the common confusion (a dot that
  makes another letter; fatha above vs kasra below), a `.tip` at the end.
- Arabic inside Hebrew text is wrapped with `ar('…')` from `common.js`:
  `<span class="ar" lang="ar" dir="rtl">`, which gets the Arabic font and a
  larger size. Plain-text fields (questions, options, explanations) take
  Arabic as is; the page sets direction and font for the subject.
- Give the reading of every Arabic example in Hebrew letters with niqqud
  (דַאוֻד), exactly as `facts.js` has it.

## Questions

- Exactly **10 easy, 10 medium, 10 hard** per lesson; `lesson()` enforces it
  and rejects duplicate questions, duplicate options, empty options and
  options that refer to positions ("הראשונה", "השנייה"): describe the item
  itself instead ("ה-د שבתחילת המילה").
- Ladder: easy = one fact (sign → name, letter → Hebrew letter, word →
  meaning); medium = the fact inside a word (which vowel is on the ر in
  وَرْد; which word contains ز); hard = a full reading (וַרְד), a contrast
  between look-alikes, a count, or a one-line reasoning question.
- 4 options normally, 3 for a count. Wrong options come from the same set as
  the answer (other letters, other vowels, other words' meanings): use
  `others(pool, answer, 3, seed)` so they are drawn from the unit's facts, or
  hand-pick the known confusion (د/ذ, ر/ز, دَار/زَارَ, أَرْز/أَرَادَ).
- A wrong option must never be defensible. In particular: a letter that
  appears in no word of the unit (ذ in unit 1) gets its own "in a word"
  practice through letter pairs marked as pairs, never a "which word has ذ"
  question with a word answer.
- The explanation names the fact and shows the reading: `وَ פתחה (וַ), رْ
  סוכון (רְ), د (ד): וַרְד – ורדים.`

## Verification (before every commit)

1. Load every lesson file with `node -e "require('./seeds/arabic/201-1-letters')"`;
   the builders throw on any rule above. Load the composer too.
2. An **independent review** (a separate reviewer reading only the teacher's
   material) checks every question and page: correct answer right, no wrong
   option defensible, unambiguous for a beginner, Hebrew natural,
   transliterations right, Arabic spelled with the right marks. Fix every
   MUST-FIX finding; list open doubts for the owner.
3. `cd backend && npm run generate-data arabic`, restart the API, `npm test`
   (the content guard runs on every subject), `cd frontend && npm run build`.
4. `npm run check:viewport` with `LESSONS=<arabic lesson ids>`, plus
   screenshots of the learn page, an exercise and the feedback at phone width
   (Arabic options right-to-left, the Arabic font applied: check the computed
   `font-family` starts with `Noto Naskh Arabic`).
5. Update `docs/topics-status.md` (table row + activity log entry).
