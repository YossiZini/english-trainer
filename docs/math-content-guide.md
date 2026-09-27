# Math content guide

How to write a Math topic: the teaching document, the exercises and their
explanations. Short by design; the code it points to is the reference.

## Where things live

| What | Where |
|---|---|
| Topic seed (one lesson) | `backend/src/database/seeds/topic1NN-<name>.js` exporting `{ lessonsData }` |
| Topic with subtopics | folder `seeds/<topic>/` with one file per subtopic, composed by `topic1NN-<name>.js` (see `seeds/fractions/`) |
| Text helpers | `seeds/math-helpers.js`: `ltr`, `expr`, `mc`, `fib`, `stackFractions` |
| Pictures | `seeds/math-svg.js`: `circle`, `bar`, `numberLine`, `grid`, `row`, `figure`, `figures` |
| Exact arithmetic + lesson builders | `seeds/fractions/rat.js`, `seeds/fractions/common.js` (`mcq`, `fibR`, `lesson`) |
| Names, TOC line, descriptions, subtopic examples | `frontend/src/content/topicMeta.js` |
| Registration | `subjectFiles.math` in `backend/src/data/generateJsonData.js` |
| Status and activity log (required by CLAUDE.md) | `docs/topics-status.md` |

Numbering: topics `101+` (shown as `1+`), subtopics `'101.3'`, `orderIndex`
`1000 + topic offset` (Fractions 1001–1006, Order of operations 1021, …).
Lesson ids are preserved by `topic/subtopic`, so renaming a subtopic key
creates a new lesson and orphans progress.

## Teaching document (`theoryContentHe`)

- Hebrew, grades 7–8, one idea per rule. Order: `<h2>` title, one-paragraph
  intro, optional `.formula` box, then `<h3>כלל N: …</h3>` sections, a
  `.warning` for the common mistake, a `.tip` at the end.
- **Every rule gets a worked example and a picture.** Build pictures with
  `math-svg.js` and wrap them: `P.figure(P.circle(3, 4), '3/4 מהפיצה')`,
  several side by side with `P.figures(...)`. Keep captions short; write
  expressions in captions inside `<span dir="ltr">`.
- Math inside Hebrew text goes in `<span dir="ltr">…</span>`. Write fractions
  as `a/b` or `1 a/b`; the seed export stacks them (numerator over
  denominator) automatically. Do not hand-write fraction markup.
- Use `×`, `÷`, `−`, `&gt;`; never `*`, `/` for division, or `-` as minus.

## Exercises

- Exactly **10 easy, 10 medium, 10 hard** per lesson (a session is 10
  questions; fewer gets padded from other levels). `lesson()` enforces this.
- Ladder: easy = one step, direct use of a rule; medium = two steps or a
  conversion; hard = word problems, several steps, reverse questions
  ("find the whole"), or common-mistake traps.
- Question text is plain Hebrew. A bare computation uses `expr('3/4 + 1/6')`
  (renders as `… = ?`); an expression inside a sentence uses `ltr('3/4')`.
  Fractions in any text field render stacked by the app.
- **Compute answers, never type them**: `fibR(n, level, text, R.add('1/2','1/3'), explanation)`,
  `mcq(n, level, text, R.str(...), [wrong, wrong, wrong], explanation)`.
  `mcq` places the answer at a varying position and rejects duplicate options.
  Wrong options come from the common mistakes (adding denominators, forgetting
  to reduce, wrong order of operations).
- Fill-ins need a hint (`FRACTION_HINT`, `MIXED_HINT`, `INT_HINT`). Students
  may answer `3/4`, `0.75`, `6/8` or `1 1/2`; the server compares by value.
- Numbers in questions: keep denominators ≤ 12 on easy/medium; results reduce
  to something a student can check by hand.

## Explanation (`explanationHe`)

- Hebrew, one short line per step, ending with the result: name the rule,
  then show the computation with `ltr()`:
  `מכנה משותף 12: ${ltr('9/12 − 2/12 = 7/12')}.`
- For a wrong-option trap, say what the trap was in one clause.
- (Planned) pictures in explanations, reusing `math-svg.js`, once the
  exercise payload carries an `explanation_svg` field.

## Verification (before every commit)

1. A check script re-computes every answer with an evaluator that does not
   share code with the seed (`scratchpad/checks/*.js` in past sprints; keep
   one per topic). Zero mismatches, counts 10/10/10, answers among options.
2. `cd backend && npm run generate-data` (Math only; English is never rebuilt
   implicitly). A seed that fails to load aborts the run on purpose.
3. **Restart the API** (bundled content loads at startup), `npm test`,
   `cd frontend && npm run build`.
4. Screenshot the learn page and one exercise per level at 1366×768 and
   360×740 (Playwright; see `docs/screenshots/sprint-3` for the expected look).
5. Update `docs/topics-status.md` (table row + activity log entry).
