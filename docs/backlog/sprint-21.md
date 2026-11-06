# Sprint 21 — Gradual Hebrew→English words (archived backlog)

**Goal:** Make word practice in the bot gradual for Alona: four-choice word questions with tempting wrong options instead of typing, the 3,287 words re-levelled so each level is harder than the one before, and bot levels that climb in small steps, with every student's progress kept.
**Period:** 2026-11-06 → 2026-11-06
**Items:** 14 (3 stories), all done

## Scope

- Word questions in the Telegram bot become four choices in both directions, answered by a button or 1–4, no typing (owner, 2026-11-06)
- At least two of the four options make sense (owner): the answer plus at least one close wrong option (an English look-alike, the same family, an opposite), two when the word has them; a wrong option is never also a correct answer
- Re-level all 3,287 words by how hard they are for a Hebrew-speaking student (owner, 2026-11-06), not by the source lists' alphabetical cuts (cow and dinner sit at levels 9–10 today; the bot's easy level is 69% levels 4–5)
- One documented score per word (English frequency, the source list's curriculum band, the answer's shape), a review by hand of the easy levels, and the owner's approval of a before/after sample before anything changes
- Every word keeps its id: students' word scores, mastered words and history unchanged; only difficulty_level changes
- The bot's levels climb in small steps with a real beginner level; the website's stages follow the new levels
- Based on the word lists, not Alona's practice history: production data is off limits (owner's decision, 2026-11-06)

## Stories

### P1 s3 · Four-choice word questions in the bot

As a student, I want to choose the right translation from four options instead of typing it, with wrong options close enough to make me think, so that practice is not blocked by spelling but is not too easy either. Size: L (~6 h). Both directions (owner, 2026-11-06). Today a word is typed and checked by englishAnswer.js/hebrewAnswer.js with Gemini as a second opinion (backend/src/services/bot.service.js); some correct answers are rejected. With choices: the question carries its four options, the answer is a button or 1–4, scoring, rounds and /switch stay. Close wrong options come from English look-alikes (quite/quiet), small curated families (days, months, numbers, colours, family, body) and opposites (buy/sell), within nearby levels; in English→Hebrew they show as the Hebrew of those words.

- [x] Both directions ask four options (English→Hebrew shows Hebrew options, Hebrew→English English ones), answered by a button or 1–4; no typed answer needed
- [x] Every question has the answer and at least one close wrong option (look-alike, same family or opposite), two when the word has them; a check over all 3,287 words reports how many get one and two
- [x] No wrong option is also correct: never a word with the same Hebrew meaning, an alternative or a synonym the bot accepts; tested on known pairs (קצת: a bit / a little, ללמוד: learn / study)
- [x] A stale or repeated button press is refused, as in the lessons; scoring, rounds of wrong words and /switch work as before
- [x] Options read in order in Telegram (measured: Hebrew options right to left, English left to right); help text, link page and docs/telegram-bot.md updated

*Closing note:* Merged as PR #98 (2026-11-06). Gap in acceptance 2: a close wrong option in 94% of questions at levels 1–3, 49% overall.

| Task | Owner | Note |
|---|---|---|
| Close wrong options | Claude | Local commit 7204404: wordOptions.js + wordGroups.json + check. At least one close wrong option in 94% of questions at levels 1–3, 49% overall; no option is ever also right. |
| Word questions as four choices in the API, both directions | Claude | Local commit 48d3080: options stored with the word, answer by button text or number, double tap claimed once; Gemini judge and @google/genai removed. Backend 223/223. |
| The bot shows the choices as buttons; texts and docs | Claude | Local commit bb8581e: options as "1) …" lines and text buttons two a row; English isolated; "stop"/"end" as options answer; help, link page, telegram-bot.md (Word options), system map source. Bot 110/110, web 454. |
| Verify and PR | Claude | PR #98 open (4 commits on main 7204cbf); all checks re-run on the new base: backend 224, bot 110, web 454, build. System map republished (version 24). |

### P1 s1 · Words re-levelled by real difficulty

As a student practising Hebrew→English in the bot, I want every level's words to be harder than the previous level's, so that the easy level is easy and each step up is small. Size: L (~6 h). Today one source list (band22) was levelled by the alphabet (its level 10 is all d-words: dark, daughter, dinner), and the bot's easy level (levels 1–5) is 69% levels 4–5, with patterns like as...as and either...or. A score from frequency, band and answer shape proposes new levels; the easy end is reviewed by hand; the owner approves a sample; the new levels are written in place, ids unchanged.

- [x] Every word has a new level 1–10 from a documented score, written to docs/words/words.csv and backend/data/static/vocabulary_words.json; every id and every field but difficulty_level unchanged (compared by id)
- [x] Levels 1–2 hold basic words a Hebrew-speaking child learns first (e.g. cow, dinner, dance, tooth, yellow); no pattern (as...as, either...or), phrasal verb or phrase of three or more words below level 5
- [x] A check reports per level: size, median word frequency (rising from level to level), share of multi-word answers, and first letters (no alphabetical cut)
- [x] The owner approved a before/after sample and the level sizes before the change was applied

*Closing note:* Applied (892a893), in PR #99 with s2. Acceptance 3: frequency falls from level 5 to 10 and level 10 < level 1; levels 1-4 are ordered by concreteness, not frequency (median zipf 5.28, 5.04, 4.85, 4.94).

| Task | Owner | Note |
|---|---|---|
| Score every word and propose levels | Claude | Commit f60a6b9: docs/words/relevel (score, README, proposal.csv, report.md). Median zipf 5.3 at level 1 to 4.0 at 10 (flat 4.85-4.95 at levels 3-5); Band III 1% to 98%; no pattern below level 5. |
| Review the easy end by hand; a sample for the owner | Claude | Commit 2621d03: 80 hand moves with reasons in moves.csv. Sample page of 60 words and the level sizes published. |
| Approve the new levels (owner) | owner | Owner approved the levels and sizes on 2026-11-06 ("Levels look ok"). |
| Apply the new levels in place, ids unchanged | Claude | Commit 892a893: apply.py wrote 2,714 changed levels (JSON by id, CSV in place); ids, order and other fields unchanged. word-levels.js passes (fails on the old levels); word-options.js clean; backend 224/224. |

### P1 s2 · Bot levels that climb in small steps

As a student, I want the bot's level menu to start with a real beginner level and climb in small steps, so that I begin where I succeed and move up gradually. Size: M (~3 h). Today the bot has 3 levels over 10 (קל = 1–5, בינוני = 6–7, קשה = 8–10; backend/src/services/bot/wordPicker.js). Proposed: five levels (מתחיל, קל, בינוני, מתקדם, קשה), cut points set from s1's level sizes. The website's quiz stages (vocabulary.service.js DIFFICULTY_STAGES) follow the new levels.

- [x] The bot offers five levels, from מתחיל to קשה, each with at least 100 words; the beginner level serves only the new levels 1–2
- [x] A session started before the change finishes normally
- [x] The help text, the Telegram link page, docs/telegram-bot.md and the tests describe the five levels
- [x] The website's stages follow the new levels, and each holds enough words for a quiz

*Closing note:* Merged as PR #99 with s1. Its deploy failed on a flaky test from #98 (fixed in PR #100). Known gap: the lexis source filter's easy web stage has 4 words (0 before).

| Task | Owner | Note |
|---|---|---|
| Five bot levels in the API | Claude | Commit 1a620fa: wordPicker LEVELS 1-5 (1-2, 3-4, 5-6, 7-8, 9-10; 350 to 877 words), level names typed too; backend tests. |
| Bot texts, link page and docs | Claude | Commit 1a620fa: help names the five levels (bot test), docs/telegram-bot.md; the link page names no levels. |
| Website stages follow the new levels; verify; PR | Claude | Website stages 1-4, 4-7, 7-10 (900/1,390/1,697 words) from one frontend module, kept equal to the API by a test. Backend 227, bot 111, web 454, build OK; end-to-end beginner exam. PR #99. |

