# Math content guide

How to write a Math topic: the teaching document, the exercises and their
explanations. Short by design; the code it points to is the reference.

## Where things live

| What | Where |
|---|---|
| Topic seed (one lesson) | `backend/src/database/seeds/topic1NN-<name>.js` exporting `{ lessonsData }` |
| Topic with subtopics | folder `seeds/<topic>/` with one file per subtopic, composed by `topic1NN-<name>.js` (see `seeds/fractions/`) |
| Text helpers | `seeds/math-helpers.js`: `ltr`, `expr`, `mc`, `fib`, `stackFractions` |
| Pictures | `seeds/math-svg.js`: `circle`, `bar`, `numberLine`, `integerLine` (whole numbers with negatives: `points`, `hops` as arrows, `flat` equal hops on one level, `labelEvery` to label only the hop ends), `coordGrid` (x and y axes: named `points` with dashed `guide`s, `lines` with arrows and labels, `texts`; `scale`), `triangle` (to shape from `angles`, `sides` or `base` and `apex`: `angleLabels`, `sideLabels`, `ticks`, `height`, `box`; `scale`), `grid`, `array` (dots in rows × columns), `groups` (equal groups; `leftover` dots in the second colour after them, `across` groups per row), `longDivision` (the written steps), `row`, `figure`, `figures` |
| Exact arithmetic + lesson builders | `seeds/fractions/rat.js`, `seeds/fractions/common.js` (`mcq`, `fibR`, `lesson`); shared by the chapters from the multiplication table on: `seeds/multiplication/common.js` (`ltr`, `mcq`, `pic`, `glueEquations`, `eq`, `withQuestionPicture`, and `mathLesson`, the one lesson builder: 10 questions per level, glued equations, and per chapter the option check `options: 'digits'`/`'letters'` and `noQuote`); per chapter `seeds/division/common.js`, `seeds/negatives/common.js` (`S` signed number with U+2212, `op` with a negative term in parentheses, `intQ`, `choiceQ`, `linePic`), `seeds/axes/common.js` (`pair`, `at`, `pointQ` with the swapped and sign-flipped points as wrong options, `quarterQ`, `grid`, `gridPic`), `seeds/triangles/common.js` (`deg`, `ang`, `numQ`, `degQ`, `triPic`, `triFig`) |
| Names, TOC line, descriptions, subtopic examples (an equation is wrapped in `ltr()`) | `frontend/src/content/topicMeta.js` |
| Registration | `subjectFiles.math` in `backend/src/data/generateJsonData.js` |
| Status and activity log (required by CLAUDE.md) | `docs/topics-status.md` |

Numbering: topics `100+`, shown as chapters `1+` in curriculum order, which
is not the order of the numbers: `MATH_CHAPTER_ORDER` in
`backend/src/config/subjects.js` (lesson order, next lesson) and `topicOrder`
in `topicMeta.js` (chapter numbers on screen) list them, and must stay equal
(the multiplication table 100, Division 105, Fractions 101, then 102–104,
Negative numbers 106, the axes 107, triangles 108). A new topic takes the
next free number and its place in both lists. Subtopics
`'101.3'`, `orderIndex` `1000 + topic offset` (Fractions 1001–1006, Order of
operations 1021, …; before them the multiplication table 991–993 and
Division 994–997).
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
  Write units with the Hebrew gershayim, ס״מ and סמ״ר, not a quote mark:
  the checks read a quoted equation as a mistake shown on purpose.
  In theory HTML write a comparison with `&lt;`/`&gt;` (`eq()` in
  `seeds/multiplication/common.js` does it): a raw `<` ends the span for
  `glueEquations`, and the comparison can break across lines.
- A negative number in Hebrew text is always inside an isolate (`ltr()`,
  `num()`) or `<span dir="ltr">`, captions too: alone, "−1" shows as "1−".
- An option is shown in a left-to-right box: never mix Hebrew words with
  numbers or Latin letters in one option ("−2 גדול מ-−8", "ציר x" read
  scrambled); use a comparison (`−2 > −8`), a bare letter (`x`), or words only.
- A caption under a picture has `dir="auto"`: the browser picks its direction
  from the first letter outside `<span dir="ltr">` elements, but not outside
  isolates. Write a caption's points or equations in `<span dir="ltr">` (as
  `gridPic` does), and give a caption with two of them a Hebrew word between
  them (`A(1, 2) ו-B(4, −2)`), or it shows left to right.

## Exercises

- Exactly **10 easy, 10 medium, 10 hard** per lesson (a session is 10
  questions; fewer gets padded from other levels). `mathLesson()` enforces
  this. A new chapter's `lesson` is one line: `(...args) => mathLesson({ topic,
  order, options: 'letters', noQuote: true }, ...args)`; every question
  builder takes its pictures as an options object (`{ picture, question }`).
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
- **One equation, one line.** A phone may break `5 × 2 = 10` into `5 ×` and
  `2 = 10`, which reads backwards in right-to-left text. The multiplication
  chapter glues the spaces of every `ltr()` and `<span dir="ltr">` with
  U+00A0 (`seeds/multiplication/common.js`, `glue`), so each equation must fit
  a 360px phone line (about 30 characters in text, 15 in a formula box).
  Not for fractions: a mixed number `1 1/2` needs its plain space to stack.
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

- **A question that needs a picture** (a grid with named points: "מה
  השיעורים של הנקודה A?") carries it as `questionPicture`, an SVG shown
  between the question and its options (on a wide screen, beside them).
  Keep it at most 9 grid units high (a 360px phone shows it at 200px with
  the options above the pinned bar) and the question to one line. The
  Telegram bot sends the picture as a PNG with the question as its
  caption: after `npm run generate-data`, run `npm run question-pictures`
  in `frontend/` (with `CHROMIUM_PATH=/opt/pw-browsers/chromium`) and
  commit the new PNGs; `backend/tests/questionPictures.test.js` fails
  without them.

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
  phones they are laid side by side and must fit above the action bar. Keep
  it low (the multiplication chapter's `pic` scales a picture to at most
  110px): on a 768px laptop a hard question with a picture already ends
  below the pinned bar. The exception is a long division (`longPicture` in
  `seeds/division/common.js`): it is drawn at 0.7 of the theory size, not
  capped, and has the class `math-long`, which `ExerciseFeedback.css` never
  squeezes; squeezed to 72px its digits were 6px. For dot groups on a phone,
  `groupsSvg` picks the groups per row that draw the dots largest.

## Animated lesson (optional, above the theory)

- A lesson gets a step player when `frontend/src/content/animations/index.js`
  maps its subtopic number to a scene file (`animations/fractions/101-4.jsx`).
  One scene per rule of the written theory, in the same order; 2–5 steps each.
- A step is `{ caption, draw }`: `caption` is plain Hebrew with fractions as
  `a/b` (shown stacked); `draw` returns JSX for the SVG stage (viewBox
  640×280, left-to-right) built from `animations/primitives.jsx`:
  `Bar` (parts, `subdiv`, `offset`, `onlyFilled`, `slide={{dy}}`), `Frac`,
  `Circle`, `Grid`, `NumberLine`, `Arrow` + `ArrowDefs`, `Eq`, `Note`;
  for arithmetic `Expr` (tokens in a row, `hl=[from,to]` highlights the part
  computed now, a token `{ t, cls: 'result' }` is the answer); for averages
  `BarChart` (`values`, `mean` line, `levelled` shares out to the mean,
  `value: null` is a missing bar); for percentages `HundredGrid` (`k` of 100
  cells) and `PriceTag` (`price`, `label`, `strike`); for division
  `Counters` (`total`, `each`, `groups`; `phase` "pile", "gather" or
  "grouped"; `left` "b", "dim" or "extra"; `labels`), `DivEq` (`a ÷ d = q`
  and "ושארית r"; `r="?"` until the remainder is known) and `LongDivision`
  (`upto` steps; the newest step appears in four beats); for multiplication
  `DotArray` (`rows` × `cols`; `phase` "pile", "gather", "turn" or
  "grouped"; `fadeCols`, `splitRows`, `splitCols`); for negative numbers,
  the axes and triangles `animations/geometry.jsx`: `HopLine` (whole numbers
  with a real minus sign; `hops` traced one after another, `flat` for equal
  hops, `points` with `at` to appear when the hops end (`afterHops(n)`),
  `brace` for a distance), `CoordPlane` (a `walk` along x, then y, to a
  point; `points`, `moves`, `segments`, shaded `quarters`), `TriangleShape`
  (corners from `triangleFromAngles` (with `maxHeight`), `triangleFromSides`
  or `triangleFromBase`; `angleLabels`, `ticks`, `sideLabels`, `height`,
  `box` with `halves`, `corners` "whole" or "torn" onto a straight line) and
  `Rods` (two sides that meet over a base, or lie flat with a gap). In a
  caption or a note, wrap math with a leading minus or a comparison in
  `iso()`: the player's isolateMath starts a run at a digit, so "−2" alone
  shows as "2−"; and never put an equation right after "ה-x:" (it lands on
  the wrong side of the x). Long-division scenes come from `division/longSteps.jsx`
  (`longScene`, `ldCaption`), so the caption, the notes and the drawing use
  the same steps.
  Entrance classes: `pop`, `rise`, `fadein`, `draw`, `shake` with delays
  `d1`–`d5`. Keep one idea per step; the caption says what the stage shows.
- The player auto-advances every 4.5 s, stops at the end, and answers arrow
  keys and space; nothing else to wire. It isolates the equations in a
  caption (`isolateMath`, one line each), so write them plainly:
  "מחברים: 80 + 90 = 170".
- Check with `node scripts/animation-check.js` (frontend, API on :5000,
  `SHOTS_DIR` for screenshots, `SHOT_STEPS=all` for every step, `LESSONS`
  to limit): walks every step at laptop and phone and fails when anything
  is drawn outside the 640×280 stage. `animations/arithmetic.test.js` checks
  every equation drawn on any stage (both sides equal; a division with its
  remainder gives back the dividend).

## Verification (before every commit)

1. A check script re-computes every answer with an evaluator that does not
   share code with the seed (`backend/scripts/checks/topicN.js`, one per
   topic, kept in the repo: the scratchpad does not survive a reset). Zero
   mismatches, counts 10/10/10, answers among options.
2. `cd backend && npm run generate-data` (Math only; English is never rebuilt
   implicitly). A seed that fails to load aborts the run on purpose.
3. **Restart the API** (bundled content loads at startup), `npm test`,
   `cd frontend && npm run build`.
4. Screenshot the learn page and one exercise per level at 1366×768 and
   360×740 (Playwright; see `docs/screenshots/sprint-3` for the expected look);
   for an animated lesson run `scripts/animation-check.js`.
5. Update `docs/topics-status.md` (table row + activity log entry).
