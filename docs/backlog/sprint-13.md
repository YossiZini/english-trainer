# Sprint 13 — Wrong answers, kindly and with a smile (archived backlog)

**Goal:** Make the reply to a wrong answer warm, encouraging and a little funny, while still showing the right answer and the explanation clearly.
**Period:** 2026-10-01 → 2026-10-10
**Items:** 22 (6 stories), all done

## Scope

- A varied set of short, kind, playful Hebrew lines for a wrong answer (never mocking, never about the student, gender-neutral plural as the rest of the app); a different one each time, not the same line twice in a row
- Telegram: words exam and lesson exercises use them in place of '💡 לא נכון' / '💡 לא בדיוק'; the right answer and the explanation stay, and the explanation gets its own icon so the bulb is not doubled
- Website: the feedback box after a wrong answer uses the same kind of lines (lessons, mixed test, reading, vocabulary quiz)
- A little extra cheer after a streak of wrong answers (for example after 3 in a row), still short
- First item: /sprint review of the Sprint 12 code (retro rule; it was skipped at close)
- Website (added 2026-10-09): at the end of a test, a verbal assessment that is always optimistic in place of the score; the better it went, the stronger the words

## Stories

### P1 s1 · Review the Sprint 12 range

As the maintainer, I want the Arabic-subject code reviewed (skipped at close; retro rule) so that its problems are fixed before new work. Range 86c123a...a6a505e. Size S.

- [x] code-review at level high plus the lens (cohesion, thin controllers, dependencies, duplication, errors at boundaries)
- [x] Findings as fix now / follow-up / fine as is; with the owner's OK, fixes become tasks

*Closing note:* Owner approved the 8 fixes on 2026-10-09; they are story s6

| Task | Owner | Note |
|---|---|---|
| Run the review and report findings | Claude | 10 findings: fix now 8 (cross-test results RTL/font, mistakes page direction, CSS :not() selector, Telegram link page text, test comment, dashboard queries in parallel, non-blocking font, back label in topicMeta), follow-up 2 (one Arabic styling rule, Dashboard subjects from topicMeta) |

### P1 s2 · Kind, funny wrong-answer lines in Telegram

As a student, I want a warm, funny line when I get it wrong so that I keep going. About 12 short Hebrew lines (plural, never mocking) and 4 'streak' lines for 3+ wrong in a row; the API counts wrong answers per bot session (the bot keeps no state) so the line changes every time and the streak is known. Words exam and lesson exercises. The explanation line gets 📖 so the bulb is not doubled. Size M.

- [x] A wrong answer shows an encouraging line, then the right answer, then the explanation (📖)
- [x] Two wrong answers in a row never get the same line
- [x] After 3 wrong in a row a streak line appears instead
- [x] A right answer resets the streak; correct-answer replies unchanged

*Closing note:* PR #56

| Task | Owner | Note |
|---|---|---|
| API: wrong count and streak in the bot verdicts | Claude | wrongCount/wrongStreak in both verdicts; d5008b0 |
| Bot: encouragement lines and replies | Claude | bot/app/encouragement.py, 📖 for explanations; bot 55 pass; 4f241c0 |

### P1 s3 · The same lines on the website

As a student on the site, I want the same kind of encouragement after a wrong answer. frontend/src/content/encouragement.js with the same lines; ExerciseFeedback (lessons, mixed test), the vocabulary quiz and the reading questions use it; the page counts wrong answers in a row. Size M.

- [x] The feedback box after a wrong answer shows an encouraging line instead of 'התשובה שגויה'; the right answer and explanation stay
- [x] No same line twice in a row; streak line after 3 wrong in a row
- [x] Fits at phone width (viewport check passes)

*Closing note:* PR #56

| Task | Owner | Note |
|---|---|---|
| Lines module and lesson feedback | Claude | content/encouragement.js; ExerciseFeedback; e833ae8 |
| Vocabulary quiz and reading feedback; screenshots | Claude | vocab quiz + reading; lines shortened to fit 360px; viewport passes |

### P1 s5 · Words instead of a score at the end of a test

As a student, I want an always-optimistic verbal assessment instead of a score when I finish a test, with stronger praise the better it went, so that a weak result never feels like a failure. content/assessment.js (tiers by share of right answers, plural Hebrew, no numbers) and one shared card; lesson results, mixed test, vocabulary quiz, reading and the fix-mistakes pop-up use it in place of the % score; ✗ becomes 💡 in the result lists. The API still computes and saves scores. Size M.

- [x] No end-of-test screen on the website shows a score or a percentage; a verbal assessment shows instead
- [x] Every result gets an optimistic line, and the better the result the stronger the praise; the top line only when every answer is right
- [x] No red and no 'wrong'/'failed' wording on those screens; wrong answers show 💡 'to review'
- [x] Tests cover the tiers; the build passes; the card fits a 360px phone

*Closing note:* PR #56 merged and deployed 2026-10-09 (b5b1299): 7 levels of words, one shared card on 4 results screens + the fix-mistakes pop-up; no % shown

| Task | Owner | Note |
|---|---|---|
| Assessment tiers and the shared card | Claude | content/assessment.js (7 levels), components/common/Assessment.jsx; 7 tests |
| Use it on every end-of-test screen | Claude | Lesson, mixed test, vocabulary, reading results + retry pop-up; ✗ → 💡; also: reloaded result fields, 'finished all lessons' only after a pass, count boxes fit phones |
| Checks and phone screenshots | Claude | Frontend 56 pass; build OK; viewport check passes; screenshots at 390/360px, no overflow, no % |

### P1 s6 · Review follow-ups (Sprint 12 code)

As the maintainer, I want the 8 approved findings of the Sprint 12 review fixed so that Arabic shows right everywhere and the site stays fast. Follow-ups not in this sprint: one shared rule for Arabic styling; Dashboard subjects from topicMeta. Size M.

- [x] Each of the 8 findings is fixed, with a test where it is testable
- [x] Backend and frontend tests pass; build and viewport check pass
- [x] One PR, merged by the owner

*Closing note:* PR #57 merged 2026-10-10 (33b43c3): 3 commits (7e7f030, 54e6432, 074acce); backend 102, web 59 pass; viewport passes

| Task | Owner | Note |
|---|---|---|
| Mixed-test results: Arabic right-to-left and in the Arabic font | Claude | Layout by the question's subject; Arabic class + font; 7e7f030 |
| Mistakes page: use textDirection | Claude | textDirection from utils/bidi; 7e7f030 |
| Arabic font rule survives older browsers | Claude | :not(svg *) in its own rule; 7e7f030 |
| Telegram link page mentions /arabic | Claude | /arabic listed; test checks every command; 54e6432 |
| Dashboard progress: no sequential reads per subject | Claude | One read each instead of 9 + 4; test counts reads; 074acce |
| Arabic font does not block the first paint | Claude | media=print + onload, noscript fallback; checked switching to all; 54e6432 |
| Back-link label in topicMeta | Claude | topicMeta indexLabel; test; 54e6432 |
| API test: Arabic next lesson | Claude | Comment fixed; Arabic next lesson 201.1 and empty last activity; 074acce |

### P2 s4 · Docs

As the maintainer, I want the docs to describe the new feedback. telegram-bot.md (session flow examples), topics-status not affected. Size S.

- [x] telegram-bot.md shows the new wrong-answer reply

*Closing note:* telegram-bot.md updated; PR #56

