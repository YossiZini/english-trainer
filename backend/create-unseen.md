# Reading texts (Unseen): how to add one

The reading texts appear on the website ("פסקאות באנגלית") and in Telegram
(`/unseen`, `/unseen_list`). Both read the same bundled data,
`backend/data/static/unseen_paragraphs.json` and `unseen_questions.json`,
generated from one seed file.

## Add or change a text
1. Edit `backend/src/database/seeds/seed-unseen-paragraphs.js`, a plain data
   module: add a text object to the list in `getParagraphsData()`.
2. In `backend/`, run `npm run generate-data -- --unseen`. Existing texts
   keep their ids (matched by English title), and so do their questions
   (matched by number); students' progress and readings refer to them.
   **Never rename a text's English title**: it would get a new id and lose
   the students' progress on it.
3. Restart the API: bundled content is loaded once, at startup.
4. Run the tests. `backend/tests/unseenContent.test.js` fails when the JSON
   and the seed drift, a rule below is broken, or an explanation quotes
   English words that are not in its text; `bot/tests/test_unseen.py`
   checks that every text fits one Telegram message.

## A text
- For Hebrew-speaking students aged 12–14. Original writing, accurate and
  uncontroversial; approximate numbers ("about", "more than") when unsure.
  No brand names, politics or violence.
- `complexityLevel` 1–5. Length in words by level: 1: 90–110, 2: 100–160,
  3: 170–220, 4: 220–280, 5: 280–340 (the first 15 texts are shorter; new
  ones use these ranges). At most 2,300 characters.
- 3 paragraphs (level 5 may have 4), separated by a blank line.
- `titleEn` unique and specific; `titleHe` natural Hebrew, not word for
  word; `topic` one or two English words.
- `hardWords`: 7, each in the text in exactly that form, with a short Hebrew
  translation of the sense used. The bot's "?" shows them.

## Its five questions
- A mix: two detail questions, one vocabulary in context, one inference, one
  main idea or purpose. Answerable from the text alone.
- `questionTextHe` translates the question. `explanationHe` quotes the
  decisive English words from the text, then explains in Hebrew (at most
  about 300 characters).
- 4 distinct options, grammatical and of similar length (the right one not
  clearly the longest). Never "all of the above", "none of the above",
  "both…", or an option that points at another one. Vary the right answer's
  position: each of the four at least once per text (the first 15 texts do
  not yet).
- Exactly one option is right. At levels 1–4 the wrong options are
  plausible (they reuse the text's ideas) but clearly wrong by the text.
- Nothing can be answered without reading:
  - the right option paraphrases the text: it does not copy the deciding
    sentence or the title;
  - no wrong option falls to common sense or to what students already know
    (they know the Dead Sea is shrinking);
  - in a main-idea question, every option reads like a main idea.
- **Level 5 (the owner's rule, 2026-11-01):** in every question at least two
  options look right on a first read, and only one is the most accurate
  according to the text. The near-miss falls short for a reason the text
  makes clear: too general or too narrow, claims more than the text says,
  swaps cause and effect, misses a qualifier ("at first", "most", "only"),
  or is true in the world but not what the text says. The explanation says
  why the right option is the most accurate and why the near-miss falls
  short, naming it by its content. Never two fully right options.
  Absolute words must not give the answer away: some right options carry a
  strong word the text supports ("only", "whole"), and some near-misses are
  hedged ("mainly", "often").

## Before the PR
Someone who did not write the text answers its questions without the key
and compares; at level 5 they also name the near-miss of each question and
confirm that it falls short. Fix every disagreement in the text, the
options or the key, and have every changed question answered blind again.
Someone then reads the explanations with the key: each must support the
key and, at level 5, name an option that is still there.
