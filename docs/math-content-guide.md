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
- **Every Math question is multiple choice** (4 options; 3 on a yes/no
  style question). Write a computed answer with `fibR`/`fib` and the seed
  export turns it into multiple choice with three wrong options derived from
  the answer's form (`math-helpers.js` → `finishMath`: n±1, ×2 for integers;
  numerator or denominator off by one, the reciprocal for fractions; whole
  part off by one for mixed numbers). Prefer `mcq` with hand-picked wrong
  options when the common mistake is known (adding denominators, forgetting
  to reduce). A wrong option must never equal the answer by value.
- Question text is plain Hebrew. A bare computation uses `expr('3/4 + 1/6')`
  (renders as `… = ?`); an expression inside a sentence uses `ltr('3/4')`.
  Fractions in any text field render stacked by the app.
- **Compute answers, never type them**: `fibR(n, level, text, R.add('1/2','1/3'), explanation)`,
  `mcq(n, level, text, R.str(...), [wrong, wrong, wrong], explanation)`.
  `mcq` places the answer at a varying position and rejects duplicate options.
  Wrong options come from the common mistakes (adding denominators, forgetting
  to reduce, wrong order of operations).
- Hints on `fibR`/`fib` are dropped by the conversion; keep them only as
  author notes. Answers are compared by value on the server, so `3/4` and
  `6/8` are the same answer.
- Numbers in questions: keep denominators ≤ 12 on easy/medium; results reduce
  to something a student can check by hand.

## Explanation (`explanationHe`)

- Hebrew, one short line per step, ending with the result: name the rule,
  then show the computation with `ltr()`:
  `מכנה משותף 12: ${ltr('9/12 − 2/12 = 7/12')}.`
- For a wrong-option trap, say what the trap was in one clause.
- **Picture under the explanation** (`explanationPicture`, HTML with inline
  SVG, shown in the feedback box). Fractions questions get one automatically
  from their shape (`seeds/fractions/common.js` → `autoPicture`): a bare
  computation (`expr`), "צמצמו", "a/b מ-N", "גדול/קטן יותר: a או b", mixed
  conversions, "חולק ל-N חלקים … K מהם". For a word problem pass one
  explicitly as the last argument of `mcq`/`fibR`/`fib`, built with
  `seeds/fractions/pictures.js` (`ofQuantity`, `compare`, `mixed`, `addSub`,
  `mul`, `div`) or `math-svg.js` directly. Keep it to one row of figures: on
  phones they are laid side by side and must fit above the action bar.

## Animated lesson (optional, above the theory)

- A lesson gets a step player when `frontend/src/content/animations/index.js`
  maps its subtopic number to a scene file (`animations/fractions/101-4.jsx`).
  One scene per rule of the written theory, in the same order; 2–5 steps each.
- A step is `{ caption, draw }`: `caption` is plain Hebrew with fractions as
  `a/b` (shown stacked); `draw` returns JSX for the SVG stage (viewBox
  640×280, left-to-right) built from `animations/primitives.jsx`:
  `Bar` (parts, `subdiv`, `offset`, `onlyFilled`, `slide={{dy}}`), `Frac`,
  `Circle`, `Grid`, `NumberLine`, `Arrow` + `ArrowDefs`, `Eq`, `Note`.
  Entrance classes: `pop`, `rise`, `fadein`, `draw`, `shake` with delays
  `d1`–`d5`. Keep one idea per step; the caption says what the stage shows.
- The player auto-advances every 4.5 s, stops at the end, and answers arrow
  keys and space; nothing else to wire.
- Check with `node scripts/animation-check.js` (frontend, API on :5000,
  `SHOTS_DIR` for screenshots): walks every step at laptop and phone.

## Verification (before every commit)

1. A check script re-computes every answer with an evaluator that does not
   share code with the seed (`scratchpad/checks/*.js` in past sprints; keep
   one per topic). Zero mismatches, counts 10/10/10, answers among options.
2. `cd backend && npm run generate-data` (Math only; English is never rebuilt
   implicitly). A seed that fails to load aborts the run on purpose.
3. **Restart the API** (bundled content loads at startup), `npm test`,
   `cd frontend && npm run build`.
4. Screenshot the learn page and one exercise per level at 1366×768 and
   360×740 (Playwright; see `docs/screenshots/sprint-3` for the expected look);
   for an animated lesson run `scripts/animation-check.js`.
5. Update `docs/topics-status.md` (table row + activity log entry).
