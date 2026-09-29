# Sprint 8 — Lesson exercises in the Telegram bot (archived backlog)

**Goal:** Let a student do a lesson's exercises from the Telegram bot, English or Math: the next lesson by default or one picked from a list, with multiple-choice questions answered by the numbers 1–4.
**Period:** 2026-09-28 → 2026-09-29
**Items:** 21 (8 stories), all done

## Scope

- Bot command per subject ('תרגיל אנגלית' / 'תרגיל חשבון') starts the exercises of that subject's next lesson, reusing the same next-lesson logic as the web home page
- Lesson list in the bot: the student lists a subject's lessons (paged, with done/next marks) and picks one by number or button to practise it
- Multiple-choice questions shown with numbered options 1–4 plus inline buttons 1–4; the answer '1'–'4' (tap or typed) is checked in the API; fill-in-the-blank questions take typed text (numbers for Math)
- Scoring and progress recorded exactly as the web exercise flow does (points, lesson completion, mistakes for review); session summary at the end, 'סיים' ends early
- API: bot exercise-session endpoints behind the existing bot key, chat link and rate/daily caps; the bot keeps no state and builds replies from the API answer; vocabulary sessions untouched
- Verification: backend tests for the exercise session (MC by number, fill-in, completion), bot unit tests, smoke script extended; docs/telegram-bot.md and the system map updated

## Stories

### P1 s1 · API: lesson exercise sessions for the bot

As a student, I want the bot to give me a lesson's exercises one at a time and grade them exactly like the web app, so that practice in Telegram counts. BotSession gets kind 'vocab'|'exercise'; the exercise session holds the 10 questions from LessonService.getExercises, collects answers, and on the last one calls ExerciseService.submitExercise (same points, WrongAnswer, UserProgress, next lesson). New service services/bot/exerciseSession.js; routes under /api/bot/exercise/*. Size: L (~1 day).

- [x] POST /api/bot/exercise/start with {subject} starts the subject's next lesson (UserProgress.getNextLesson); with {lessonId} starts that lesson; unknown lesson or subject → 404/400
- [x] A multiple-choice question returns numbered options (1..n, n = 3 or 4); the answer '1'..'n' maps to that option; any other text returns 'choose_number' and repeats the question without recording
- [x] A fill-in-the-blank answer is checked with the same answersMatch as the web
- [x] After the last answer the result equals ExerciseService.submitExercise for the same answers (score, points, pass ≥70, next lesson) and the session ends
- [x] 'סיים' mid-lesson ends the session with a summary and records nothing (no partial score)
- [x] Starting an exercise session replaces an open vocabulary session and vice versa; session/status reports the kind
- [x] Existing vocabulary bot tests still pass unchanged

*Closing note:* Committed on the work branch

| Task | Owner | Note |
|---|---|---|
| BotSession kind + exercise session model fields | Claude | BotSession kind + createExercise (frozen questions and option order) |
| exerciseSession service: start / answer / end / status | Claude | services/bot/exerciseSession.js: start/answer/end/status; grading via submitExercise |
| Routes + controller under /api/bot/exercise | Claude | POST /api/bot/exercise/start; answer/end/status routed by kind (services/bot/sessionKinds.js) |
| Backend tests on the emulator | Claude | tests/botExercise.test.js; 52 backend tests, 3 green runs |

### P1 s2 · Bot: 'תרגיל אנגלית' / 'תרגיל חשבון' with answers 1–4

As a student, I want to type 'תרגיל אנגלית' or 'תרגיל חשבון' and answer multiple-choice questions by tapping or typing 1–4, so that I can do my next lesson from my phone without the web app. Reply-keyboard buttons (existing mechanism, they arrive as text) show 1..n; fill-in questions remove the keyboard. Size: M (~½ day).

- [x] Fast path (no model) recognises the two commands and starts the subject's next lesson
- [x] MC question text: lesson title, 'שאלה k/10', question, lines '1) …'..'n) …', buttons 1..n
- [x] ✅ / ❌ with the correct option ('2) goes') and explanation_he when wrong, then the next question in the same message
- [x] Final message: score, passed or not, points earned and total, next lesson name; 'סיים' shows the early-end message
- [x] While an exercise session is open every message is routed to it; vocabulary flow unchanged
- [x] ADK agent gets tools for the new flow so free text like 'אני רוצה לתרגל חשבון' works
- [x] bot pytest green

*Closing note:* Committed on the work branch

| Task | Owner | Note |
|---|---|---|
| api_client + coach fast path for exercise commands | Claude | api_client.exercise_start; coach fast path EXERCISE_WORDS (two-word commands only) |
| replies.py: question, verdict, summary texts | Claude | bot/app/exercise_replies.py: question with 1) lines + buttons, verdict, result, early end |
| Agent tools + instructions for exercises | Claude | tools.start_lesson_exercise + agent instruction; list tool comes with s3 |
| Bot tests | Claude | bot/tests/test_exercises.py; 17 bot tests green |

### P1 s3 · List lessons and pick one

As a student, I want to list a subject's lessons in the bot and choose one by its number, so that I can practise a lesson that is not the next one. 'שיעורים אנגלית' / 'שיעורים חשבון' opens a pick step in the API (like the vocab level step): numbered list in curriculum order, 10 per page, ✅ done / ▶️ next marks, 'עוד' for the next page; the student sends the number. Size: M (~½ day).

- [x] The list uses the same curriculum order and completion status as the web (UserProgress/Lesson), numbers stable across pages
- [x] English's 97 lessons page by 10 with 'עוד' / 'הקודם'; Math's 9 fit one page
- [x] Sending a listed number starts that lesson's exercises (s1 flow); an out-of-range number re-asks
- [x] 'תרגיל אנגלית 12' starts lesson 12 directly without the list
- [x] Backend test for list order/marks and pick; bot test for the list reply

*Closing note:* aa6e1d3 (API list/pick, start by number) + 8efe17d (bot list, 'תרגיל אנגלית 12'); PR #38

| Task | Owner | Note |
|---|---|---|
| API: lesson list pick step | Claude | aa6e1d3: POST /exercise/lessons, pick step, start by subject+number; tests |
| Bot: list command, paging buttons, direct 'תרגיל אנגלית N' | Claude | 8efe17d: 'שיעורים אנגלית/חשבון', paging buttons, list_lessons tool, tests |

### P1 s4 · Docs, smoke script and system map

As a maintainer, I want the new bot flow documented and smoke-tested, so that the next change starts from an accurate picture. Size: S (~2 h).

- [x] docs/telegram-bot.md: exercise session section, commands, MC 1–4 rule, new endpoints in the pieces table
- [x] bot/scripts/smoke.py walks a short exercise session (MC by number + fill-in) through the fast path
- [x] system map (docs/architecture/system-map.html) shows the bot flow now covering lessons, republished to its artifact URL in the same PR

*Closing note:* e2cdb75: docs, smoke (run on emulator), system map flow republished (v5); PR #38

| Task | Owner | Note |
|---|---|---|
| Update docs/telegram-bot.md | Claude | e2cdb75 |
| Extend bot/scripts/smoke.py and run it locally on the emulator | Claude | e2cdb75, ff891c2; ran end to end on the emulator |
| Update system map source and republish | Claude | New 'lesson's exercises in Telegram' flow; artifact republished |

### P1 s8 · All exercises multiple choice, no typing

As a student, I want every question to be multiple choice, so that I never have to type an answer. Added during the sprint at the user's request. Size: L.

- [x] 950 English fill-in questions converted to 4 options, each independently reviewed
- [x] Options graded by exact text; content test guards 3-4 distinct options with exactly one right
- [x] Bot sets its Telegram command menu at startup

*Closing note:* PR #40 merged and deployed; audit of the older questions followed as defect d6 (PR #42)

### P2 s5 · Hints and explanations in the bot

As a student, I want '?' to give me the hint (hint_he, 270 exercises) and a short explanation after a wrong answer, so that I learn from the mistake without the web app. Size: S.

- [x] '?' during an exercise returns hint_he (or 'אין רמז לשאלה הזו') and repeats the question, nothing recorded
- [x] Explanation text is capped (e.g. 400 chars) so a message stays short

*Closing note:* ff891c2: '?'/'רמז' returns hint + same question; explanation capped at 400. Content has no hints yet (all 270 hint_he null)

### P2 s7 · English bot commands and a help command

As a student, I want the bot's commands in English and a help command that explains the method in Hebrew, so that I know what the bot does. Added during the sprint at the user's request. Size: S.

- [x] Commands in English, '/' optional: help, words, english|math [N] [easy|medium|hard], lessons, end
- [x] help explains the vocabulary method and the exercises in Hebrew

*Closing note:* PR #39 merged and deployed

### P3 s6 · Choose difficulty in the bot

As a student, I want to choose easy/medium/hard before a lesson's exercises, so that I can push myself like in the web app. Default stays the progress-based level. Size: S.

- [x] 'תרגיל אנגלית קשה' (or a button after start) passes difficulty to getExercises and submitExercise
- [x] Summary names the difficulty and suggests the next one when passed

*Closing note:* ff891c2: 'תרגיל אנגלית [N] קל/בינוני/קשה'; summary names the level, suggests next level after a pass

