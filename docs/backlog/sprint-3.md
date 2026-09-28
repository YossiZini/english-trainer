# Sprint 3 — Fractions: subtopics, visual explanations, book-style notation (archived backlog)

**Goal:** Rebuild the Fractions topic as several subtopics, each explained with pictures, with every fraction written the way textbooks write it: numerator over denominator with a horizontal bar.
**Period:** 2026-09-27 → 2026-09-28
**Items:** 21 (6 stories), all done

## Scope

- Split topic 101 (שברים) into subtopics, one lesson each, in the order they are taught: what a fraction is; equivalent fractions and reducing; comparing; adding and subtracting; multiplying and dividing; mixed numbers and improper fractions
- Every subtopic's teaching document explains each rule with a picture (shaded circles, bars or number lines drawn inline as SVG), not only with text
- Fractions are shown as numerator over denominator with a horizontal fraction bar everywhere: theory, question text, answer options, hints and feedback; students still type answers as 3/4
- Each subtopic keeps the three levels with 10 exercises per level (a session is 10 questions); the existing 30 Fractions exercises are redistributed and completed
- Student progress for the current single Fractions lesson is preserved or migrated, and the other three Math topics keep working unchanged
- docs/topics-status.md and the topic guide cover the subtopic layout and the fraction notation

## Stories

### P1 s1 · As a student, I want every fraction shown as numerator over denominator with a bar, like in my textbook, so the screen looks like the notation I learn

Size: ~3 h. Question text, options, hints, correct answers and explanations are rendered as plain strings in MultipleChoice.jsx, FillInBlank.jsx, ExerciseFeedback.jsx, ResultsPage.jsx, ReviewMistakesPage.jsx and CrossTestResultsPage.jsx. Add one MathText component that turns a/b and mixed 1 a/b (inside or outside the LTR isolates the seeds already use) into a stacked .frac element, and use it at those sites. Theory HTML gets a frac() seed helper and .frac styles in LearningPage.css. Students keep typing 3/4; answersMatch is untouched.

- [x] A question like 3/4 ÷ 1/2 = ? renders each fraction stacked with a horizontal bar on the exercise page, in options, in the feedback's correct answer and explanation, on the results page, in mistakes review and in cross-test results
- [x] Mixed numbers render as a whole number beside a stacked fraction; plain integers, percentages and English text are unchanged
- [x] Theory pages render <span class="frac"> from the seeds as stacked fractions; existing English lessons are unaffected
- [x] Typing 3/4 or 0.75 is still accepted; 22 backend tests green; frontend build green

*Closing note:* Stacked fractions everywhere; 4 frontend unit tests, 22 backend tests green; phone screenshots checked. 3 commits on the branch (PR with s2).

| Task | Owner | Note |
|---|---|---|
| MathText component + .frac styles | Claude | components/common/MathText.jsx + .css; 4 unit tests (react-scripts test). Commit on branch. |
| Use MathText on the exercise page: question, options, hint, feedback | Claude | MultipleChoice (question, options), FillInBlank (question, hint), ExerciseFeedback (answer, explanation). Phone screenshots: stacked fractions in question, options and feedback. |
| Use MathText on results, mistakes review and cross-test results | Claude | ResultsPage, ReviewMistakesPage, CrossTestResultsPage wired; build green. |
| Theory notation: frac() seed helper and .theory-html .frac styles | Claude | stackFractions() in math-helpers applied to all four Math theories at export; .theory-html .frac styles. Generator now aborts on a seed load error (found while doing this: a broken seed silently dropped the subject and would have re-minted ids). |

### P1 s2 · As a 7th–8th grade student, I want Fractions taught in six short subtopics, each rule shown with a picture, so I can learn one idea at a time

Size: ~8 h (the bulk of the sprint). topic101-fractions.js becomes six lessons 101.1–101.6 (what a fraction is; equivalent fractions and reducing; comparing; adding and subtracting; multiplying and dividing; mixed numbers and improper fractions), orderIndex 1001–1006; topics 102–104 move to 1021/1031/1041 so next/previous stay in order. Pictures are inline SVG built by seed helpers (shaded circle slices, bars, number lines) so no image files are needed. Each subtopic: theory + 30 exercises (10 per level) with answers verified by script; the 30 existing exercises are redistributed to their subtopic and completed.

- [x] /math shows topic 1 with six subtopics 1.1–1.6 in teaching order; each has a Learn page and three levels
- [x] Every rule in every subtopic has at least one picture next to its example (SVG rendered inline, legible at 360px)
- [x] Each subtopic has exactly 10 easy, 10 medium and 10 hard exercises; a check script confirms every answer; explanations in Hebrew
- [x] Next/previous lesson from 101.6 goes to 102.1 and from 102.1 back to 101.6
- [x] docs/topics-status.md lists the six subtopics and the activity log entry

*Closing note:* Six subtopics live in the generated data; pushed. Screenshots (s3) next, then the PR.

| Task | Owner | Note |
|---|---|---|
| SVG picture helpers for seeds: circle(n, d), bar(n, d), numberLine(...) | Claude | seeds/math-svg.js: circle, bar, numberLine, grid, row, figure, figures; rendered a sample at 360px. Commit on branch. |
| 101.1 מה זה שבר: theory with pictures + 30 exercises | Claude | fractions/101-1-what-is-a-fraction.js: 5 rules with circle/bar pictures, 30 exercises; lesson id 3b5fe7de preserved. |
| 101.2 שברים שווים וצמצום: theory + 30 exercises | Claude | 101-2: expanding/reducing with paired bars, 30 exercises. |
| 101.3 השוואת שברים: theory + 30 exercises | Claude | 101-3: same denominator/numerator, common denominator, benchmarks, number line; 30 exercises (one answer key error caught and fixed by review before commit). |
| 101.4 חיבור וחיסור: theory + 30 exercises | Claude | 101-4: bars for common denominator, the 1/2+1/2 warning with pictures; 30 exercises. |
| 101.5 כפל וחילוק: theory + 30 exercises | Claude | 101-5: area grid for fraction × fraction, halves for division; 30 exercises. |
| 101.6 מספרים מעורבים ושברים מדומים: theory + 30 exercises | Claude | 101-6: rows of circles for mixed numbers, number line; 30 exercises. |
| Wire-up: order indexes 102–104, topicMeta subtopic examples, generate-data, tests, docs | Claude | Order 1021/1031/1041; topicMeta examples for 101.x (and the examples key bug fixed); generate-data: 106 lessons / 2426 exercises; tests 26 green; docs updated. All 180 answers verified by an independent evaluator (51 computed expressions). |

### P1 s5 · As a student, I want a picture with the solution explanation, so I see why the answer is right, not only the steps

Size: ~4 h. Exercises get an optional explanation picture (HTML with inline SVG from math-svg.js) carried through the bundled data, the check/submit/retry/cross-test responses and shown in the feedback box under the text. Pictures for computational Fractions questions are generated from the expression (bars for add/subtract, grid for multiply, circles for mixed numbers, paired bars for reduce/compare); word problems get hand-picked pictures where one helps.

- [x] After answering a Fractions question, the feedback shows a picture that matches the explanation (e.g. two bars with a common denominator for 1/2 + 1/3)
- [x] The picture appears in exercise feedback, retry feedback and cross-test results; questions without a picture look as before
- [x] Pictures are legible at 360px and the exercise content still fits above the pinned bar (viewport check green)
- [x] docs/math-content-guide.md describes how to attach a picture

*Closing note:* Pushed; PR open with defect d3 riding along.

| Task | Owner | Note |
|---|---|---|
| Plumbing: explanationPicture from seed to feedback box | Claude | explanation_picture through generator, Exercise.checkAnswer (used by exercise, retry and cross-test feedback) and ExerciseFeedback; ExerciseFeedback.css scoped styles; phone layout side by side. Commit 0f83991. |
| Picture generators for Fractions explanations and automatic attachment | Claude | fractions/pictures.js (addSub, mul, div, equivalent, compare, mixed, ofQuantity, pictureFor) + autoPicture patterns in common.js; 74/180 exercises have a picture. Commit 0f83991. |
| Hand-picked pictures for the word problems of the six subtopics; regenerate; screenshots; guide | Claude | Shape/eaten-parts/single-fraction patterns cover most word problems that benefit; remaining ones (reverse questions, ordering three fractions) intentionally have none. Screenshots at laptop and 360px fit above the bar; guide section added (5df3827). |

### P1 s6 · As a student, I want every Math question to be multiple choice, so I pick an answer instead of typing fractions on the phone

Size: ~2 h. All fill-in Math exercises (topics 101–104) become multiple choice with four options. Seeds keep computing the correct answer; a seed-level transform (math-helpers) generates three plausible wrong options from the answer's form (fraction, mixed number, integer, decimal), distinct by value, with the correct one at a varying position. Hand-written mcq questions keep their trap options. Hints are dropped. Guide updated.

- [x] No Math exercise in the generated data has type fill_in_blank
- [x] Every Math question has 4 distinct options containing the computed answer; check script confirms all 300
- [x] Explanation pictures still attach; backend tests and frontend build green; a phone screenshot of a converted question
- [x] docs/math-content-guide.md says Math is multiple choice and how options are produced

*Closing note:* finishMath in math-helpers converts fill-ins at export; 270/270 multiple choice, verified by script (answer in options, no wrong option equal by value). Six hand-written questions fixed. Guide updated. Commit acea92e; PR open.

### P2 s3 · As a maintainer, I want screenshots of all six Fractions lessons and an exercise with stacked fractions on laptop and phone, so the PR shows the result

Size: ~1 h. Extend the Sprint 2 screenshot script: six learn pages, one exercise per level with a stacked fraction in question, option and feedback, at 1366×768 and 360×740; npm run check:viewport still passes (fraction height must not push the pinned bar).

- [x] Screenshots in docs/screenshots/sprint-3; no horizontal scroll, no page errors
- [x] check:viewport passes on the English exercise page

*Closing note:* docs/screenshots/sprint-3: index, six lessons, three exercise levels at laptop and 360px; no horizontal scroll, SVGs inside viewport, content above the pinned bar; check:viewport passed. Found and fixed: fractions next to a list comma were not stacked. Commit acb4f76.

### P3 s4 · As a student, I want the other Math topics' theory pages to use the same stacked notation, so fractions look the same everywhere

Size: ~1 h. Order of operations, average and percentage theory texts still write fractions as <span dir="ltr">3/4</span>; replace with frac(). Exercise text is covered automatically by MathText (s1).

- [x] No a/b fraction written inline in the theory of topics 102–104

*Closing note:* Covered by s1-t4: the seed-level helper converts the theory of topics 102–104 too (70 fractions in the generated data).

