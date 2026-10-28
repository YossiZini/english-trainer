# Sprint 14 — A mistakes exam per subject (archived backlog)

**Goal:** Let a student take an exam per subject (English, math, Arabic) built from the mistakes they have not fixed yet, on the website and in Telegram, so that every mistake is practised until it is fixed.
**Period:** 2026-10-10 → 2026-10-28
**Items:** 32 (9 stories), all done

## Scope

- First item: /sprint review of the Sprint 13 code (a6a505e...33b43c3), as the retro rule asks, since Sprint 13 closed without one
- A mistakes exam per subject: up to 20 of that subject's mistakes not fixed yet, nothing from other subjects and no filler questions; a right answer marks the mistake fixed, so repeating the exam works through all of them
- Website: a mistakes-exam button on each subject's page (English, math, Arabic) that shows how many mistakes are waiting; the exam and results reuse the existing screens (words instead of a score, 💡 to review); with nothing left, a kind message instead of an exam. The current mixed test across subjects stays
- Telegram: a command per subject (for example /mistakes_english, /mistakes_math, /mistakes_arabic) that runs the same exam in the bot, with the kind wrong-answer lines; in the command menu and /help
- The API owns which questions are picked and what counts as fixed, one rule for the website and the bot, within the existing caps
- Docs: telegram-bot.md, the Telegram link page, and the system map if a flow changes

## Stories

### P1 s1 · Review the Sprint 13 range

As the maintainer, I want the Sprint 13 code reviewed (it closed without a review; retro rule) so that its problems are fixed before new work. Range a6a505e...33b43c3: kind wrong-answer lines (bot, API, web), words instead of a score, the 8 Sprint 12 review fixes. Size S.

- [x] code-review at level high plus the lens (cohesion, thin controllers, dependencies, duplication, errors at boundaries)
- [x] Findings as fix now / follow-up / fine as is; with the owner's OK, fixes become tasks

*Closing note:* Owner approved the 6 fixes on 2026-10-10; they are story s6

| Task | Owner | Note |
|---|---|---|
| Run the review and report findings | Claude | 10 findings + lens: fix now 6 (web wrong-answer lines per test, bot session wrong_count, CSS collisions, dashboard reads in parallel, progress page reads once, bot import), follow-up 2 (one result shape from the API, one Arabic layout rule), fine as is 3 |

### P1 s6 · Review follow-ups (Sprint 13 code)

As the maintainer, I want the 6 approved findings of the Sprint 13 review fixed before the mistakes exam, which reuses the same feedback. Follow-ups not in this sprint: one result shape from the API; one Arabic layout rule. Size M.

- [x] Each of the 6 findings is fixed, with a test where it is testable
- [x] Backend, bot and frontend tests pass; build and viewport check pass
- [x] One PR, merged by the owner

*Closing note:* PR #59 merged 2026-10-10 (2757537): 4 commits; backend 102, bot 55, web 62 pass; viewport passes

| Task | Owner | Note |
|---|---|---|
| Wrong-answer lines start fresh with every test | Claude | startEncouragement() at the start of every test page; changed answer counts; e2e: fresh line in the next lesson; 3f98652 |
| Bot lesson session stores the last answer's wrong count | Claude | Final update stores wrong_count/wrong_streak; whole-lesson test ends on a wrong answer; 63a3d83 |
| Results styles under their own page | Claude | Rules under .results-page; dead .score-card rules removed; 0b7b6b1 |
| Dashboard reads in parallel | Claude | Five reads in one Promise.all; d216d20 |
| Progress page reads the student's progress once | Claude | One read instead of 4; test counts it; d216d20 |
| Bot: import at the top | Claude | Import at the top; 63a3d83 |

### P1 s2 · The mistakes exam in the API

As a student, I want an exam made only of the mistakes I have not fixed in one subject, so that I practise exactly what I got wrong. Counted before planning: every wrong_answers record has is_corrected (set on create); a question answered wrong in several attempts has one record per attempt, so the exam counts questions, not records; question ids stay stable when the content is regenerated, but a question removed from the content or hidden after a report must be skipped. Lesson questions only; vocabulary words keep their own failed-word rounds. Size M.

- [x] For a subject: up to 20 different questions from the student's unfixed mistakes in that subject only, in random order with shuffled options; no filler
- [x] Hidden (reported or removed) questions and questions no longer in the content are left out
- [x] A waiting count per subject counts different questions, not records
- [x] Submitting grades on the server with the current content; a right answer marks every unfixed record of that question fixed; only the student's own unfixed mistakes in that subject can be marked, at most 20 answers per submit
- [x] The reply gives right out of total, each question's right answer and explanation, and how many are still waiting
- [x] One service serves the website and the bot; API tests cover subject isolation, the cap, repeated mistakes, fixing, nothing left, hidden and missing questions

*Closing note:* PR #60 (a5de0a4): waiting, exam, submit; 7 tests; backend 109 pass

| Task | Owner | Note |
|---|---|---|
| Pick the exam and count what is waiting | Claude | WrongAnswer.unfixedQuestions + waitingBySubject, pickSubjectExam, subjectExam |
| Grade and mark fixed | Claude | gradeMistake + submitSubjectExam: own unfixed mistakes in the subject only, each once |
| Routes, validation and tests | Claude | GET waiting, GET exam, POST exam with validation; tests/mistakesExam.test.js |

### P1 s3 · Mistakes exam on the website

As a student, I want a mistakes-exam button on each subject's page that shows how many mistakes are waiting, so that I can fix them in one go. Reuses CrossTestPage (immediate feedback with the kind lines, Arabic layout by subject) in a subject mode, and CrossTestResultsPage (words instead of a score); the all-subjects mixed test stays. Size M.

- [x] The English, math and Arabic pages show a mistakes-exam button with the number of mistakes waiting
- [x] The exam holds only that subject's mistakes; each answer gets immediate feedback with the kind lines; at the end the API grades and marks the right ones fixed
- [x] The results page shows the words (no score), how many were fixed now and how many are still waiting, 💡 to review
- [x] With nothing waiting, a kind message instead of an exam
- [x] Arabic right-to-left in the Arabic font; viewport check passes; phone screenshots

*Closing note:* PR #60 (9d03c7c): button with count, /mistakes-exam/:subject, results with fixed/waiting, empty state; e2e on a phone; web 66 pass

| Task | Owner | Note |
|---|---|---|
| Subject-page button with the waiting count | Claude | topicMeta 'mistakes-exam' action; TopicsIndex count badge; 2 tests |
| Exam and results in subject mode | Claude | CrossTestPage subject mode; API grading at the end; results: fixedSummary line, next round; empty state |
| Tests, build, viewport, screenshots | Claude | web 66 pass; build same warnings; viewport passes; phone e2e: 6 asked, 4 fixed, 2 left, next round 2, math empty |

### P1 s4 · Mistakes exam in Telegram

As a student in Telegram, I want /mistakes_english, /mistakes_math and /mistakes_arabic to run the same exam in the chat, so that I can fix my mistakes from my phone. A bot session of its own kind in the API, like lesson exercises: questions frozen in the session, option buttons, an immediate verdict with wrongCount/wrongStreak for the kind lines, 📖 explanation. Each right answer is marked fixed at once, so ending early keeps what was fixed. Size M.

- [x] Each command starts that subject's exam from the same API rule; with nothing waiting, a kind reply
- [x] One question per message with option buttons; a wrong answer gets the kind lines and the right answer
- [x] A right answer marks the mistake fixed at once; the summary says how many were fixed and how many are still waiting, with no score
- [x] The commands are in the menu, /help and the linked and no-session texts; the agent starts the exam on a free-form request
- [x] Bot and API tests; within the existing turn and daily caps

*Closing note:* PR #60 (bc542db, fb0fa04): /mistakes_<subject>, an exercise session with source 'mistakes', fixed at once, summary without a score; smoke run through the coach

| Task | Owner | Note |
|---|---|---|
| API: a mistakes session for the bot | Claude | POST /api/bot/mistakes/start; exercise session source 'mistakes' (not a new kind, so answers/report/status/end reuse the lesson flow); test in botExercise |
| Bot: commands, replies, menu and help | Claude | Commands, which-subject buttons, replies, menu, help, LINKED/NO_SESSION, agent tool |
| Tests and a smoke run | Claude | Bot 60 pass (5 new); backend 110 pass; smoke: 4 asked, 1 fixed, 3 left, next round 3, /end keeps fixes |

### P1 s7 · Find the mistakes exam from the home page

As a student, I want the mistakes exam on the home page, so that I find it without opening a subject's page. The owner could not find the button in the subject page's header. A card per subject with mistakes waiting in 'פעולות מהירות', like 'תקן טעויות'. Size S.

- [x] The home page shows 'מבחן טעויות ב<subject>' with how many questions wait, for each subject that has any; it opens that subject's exam
- [x] No card for a subject with nothing waiting, or when the count fails
- [x] Dashboard test covers it; build and viewport check pass; laptop and phone screenshots

*Closing note:* Home page quick actions: a card per subject with mistakes waiting; f0beaaf; web 68 pass; screenshots laptop + phone

### P1 s8 · Bigger question and answer text

As a student, I want larger questions and answers, so that I read them easily. The owner (2026-10-18): the letters on the website are too small; different sizes for phone and computer are fine. One size per device for every quiz page (lessons, tests, mistakes exam, vocabulary, reading, mistakes review). Size S.

- [x] Questions and answers larger on a computer and on a phone, on every quiz page
- [x] Arabic quiz text stays 1.2 times the answer size, never smaller than before
- [x] Build and web tests pass; check:viewport passes on the first English lesson at laptop, phone and 360px; on every Arabic and math lesson and the heaviest English ones, no lesson that fit before overflows now (several overflowed before the change: drawings and long explanations on a laptop, Arabic on a laptop and at 360px); screenshots

*Closing note:* Sizes set once in variables.css: computer 24/21px, phone 19/18, narrow phone 18/17. 87e74d0 + f8b9383, PR #62. 72 lesson x size cases: 0 new overflows, 5 fixed; laptop overflow from drawings and long explanations was there before and grows by up to 43px

### P1 s9 · Review follow-ups

As a maintainer, I want the Sprint 14 review findings fixed, so that the mistakes exam fixes only what the student answered, on the website as in the bot. From /sprint review of 33b43c3...a98be33 (PRs #59-#62); the owner chose per-answer grading and all seven items. One PR. Size M.

- [x] Every task below done with its tests
- [x] Backend tests, bot tests, web tests and build pass; check:viewport passes
- [x] The website's exam and the bot fix a mistake the moment it is answered right, through MistakesService

*Closing note:* All seven done in PR #63: backend 111, bot 61, web 73 pass; viewport check passes; browser check of the exam

| Task | Owner | Note |
|---|---|---|
| Website exam: grade and fix each checked answer at once | Claude | POST /api/mistakes/exam/answer grades and fixes each checked answer; batch submit gone; Enter guard also on the lesson page; 5 React tests (4 fail on the old page). 3d0e538 |
| Bot: subject buttons send commands | Claude | Buttons send /lessons_… and /mistakes_…; bot test (fails with the old buttons). 33a1c71 |
| Count what was really fixed | Claude | gradeMistake returns fixed; bot summary counts fixed_count; bot test with a mistake fixed meanwhile on the website. 3d0e538 |
| Font rules under their components | Claude | Rules under .review-mistakes-page, .unseen-reading-page, .unseen-question; sizes measured unchanged (24/20.8 laptop, 19.2/17.6 phone). 7c28181 |
| Mistakes exam test without test order | Claude | Expected numbers come from the exam fetched in the test; passes alone (-t) and in the suite. 3d0e538 |
| Progress lists lessons in curriculum order | Claude | allProgress sorted with compareLessons; API test (fails with the old sort). 36ecc30 |
| Cleanups | Claude | Three unused UserProgress wrappers gone (36ecc30); frozenQuestion helper, empty CSS comment gone (8d668d3) |

### P2 s5 · Docs and system map

As the maintainer, I want the docs to describe the mistakes exam: telegram-bot.md (commands, session flow), the Telegram link page's command list, and the system map (web and bot functions, a flow if one changes). Size S.

- [x] telegram-bot.md lists the commands and the flow
- [x] The Telegram link page lists the mistakes commands
- [x] System map republished if a flow changed

*Closing note:* telegram-bot.md section, link page lists /mistakes, system map v15 republished; b50113e (PR #60)

