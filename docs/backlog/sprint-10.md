# Sprint 10 — Students report bad questions and words (archived backlog)

**Goal:** Let a student report a bad question or word from the website or the Telegram bot, hide it until it is reviewed, and review it (keep, change, remove) in Telegram with a review agent on Gemini Pro.
**Period:** 2026-09-29 → 2026-09-30
**Items:** 25 (10 stories), all done

## Scope

- Web: a report link on lesson questions and the vocabulary quiz, reasons as buttons (PRs #45, #47)
- Telegram bot: /report for the lesson question or the words-exam word answered last (PRs #45, #47)
- API: reports stored with a snapshot; a reported item is hidden until reviewed; decisions are live at once as a layer over the bundled content (PRs #46, #47)
- /review_manual and /review_auto in Telegram: the review agent proposes keep / change / remove, the API validates every change (PRs #46, #47)
- Review open to every linked student, with a daily cap of 40 agent calls each (PR #48; first built as admin-only)
- Also: a light bulb instead of ❌ / ✗ for a wrong answer in the bot and on the site (PR #49)

## Stories

### P1 s1 · API: question reports

As a student, I want to report a question I think is wrong, so that it gets fixed. New model QuestionReport (Firestore `question_reports`): exercise id, lesson, reason, optional note, a snapshot of text/options/answer/explanation, user, source (web|bot), status open|decided, decision. Service + routes: POST /api/reports (JWT) and the bot's session route. Size: M.

- [x] POST /api/reports {exerciseId, reason} stores an open report with a snapshot of the question; unknown exercise → 404; bad reason → 400
- [x] Reasons: wrong_answer, two_answers, unclear, other (other may carry a note ≤ 200 chars)
- [x] One open report per student per question: a second one returns the existing report, no duplicate
- [x] At most 20 reports per student per day (429 with a Hebrew message)
- [x] The exercise response for a question with open reports is unchanged (no leak of other students' data)

*Closing note:* 7845cb9 in PR #45

| Task | Owner | Note |
|---|---|---|
| QuestionReport model, report service and POST /api/reports | Claude | 7845cb9: QuestionReport, report.service, POST /api/reports |
| Backend tests for reports | Claude | 7845cb9: reports.test.js (7 tests) |

### P1 s2 · Web: report button on questions

As a student, I want a small 'report' button on a question, so that I can flag it with one tap. A flag button in the question card (ExercisePage/MultipleChoice) and in ExerciseFeedback; a small sheet with the four reasons as buttons (Hebrew), optional note only for 'other'; a thank-you toast; the button shows 'reported' afterwards. Size: M.

- [x] Every exercise question (lesson exercises and mistakes review) has the report button; tapping a reason sends it and shows a Hebrew confirmation
- [x] Reporting never changes the answer or the score
- [x] Fits a 360 px phone without horizontal scroll (viewport check)
- [x] Frontend build passes

*Closing note:* 3bf3ee0 in PR #45

| Task | Owner | Note |
|---|---|---|
| ReportQuestion component and API client call | Claude | 3bf3ee0: ReportQuestion + reportService |
| Place the button in the question card and the feedback | Claude | 3bf3ee0: in the header row beside the question number (ExercisePage, CrossTestPage) |
| Build, unit test and phone screenshot check | Claude | 3bf3ee0: 3 component tests, build, check:viewport passes at 360 px, screenshots of the open panel |

### P1 s3 · Bot: /report with reason buttons

As a student in Telegram, I want to report the question I just answered, so that I don't need the website. /report (and a small button under each verdict) reports the last answered lesson question, or the current one if none; the bot shows the four reasons as buttons; the choice is sent to the API; the exercise continues where it was. Size: M.

- [x] /report during a lesson session shows the reason buttons; a reason files the report and repeats the current question
- [x] Reason buttons never count as an answer to the question
- [x] /report with no lesson session explains it works during lesson exercises
- [x] Bot tests and the smoke script cover it

*Closing note:* 4435ecd in PR #45 (no button under each verdict: it would replace the 1–4 answer buttons; /report and the menu instead)

| Task | Owner | Note |
|---|---|---|
| API: report from a bot exercise session | Claude | 4435ecd: POST /api/bot/exercise/report (last answered, else current; open lesson or ended <1 h) |
| Bot: /report command, reason buttons, replies | Claude | 4435ecd: /report, 🚩 reason buttons, question shown again, menu entry |
| Bot and backend tests, smoke script | Claude | 4435ecd: backend 77/77, bot 33/33, smoke reports mid-lesson |

### P1 s4 · API: reported questions hidden until reviewed; review endpoints

As a student, I want a question I flagged to disappear until it is checked, and as the admin I want the API to apply my review decisions live. A reported question is hidden from new lesson sessions (web and bot) until reviewed. Decisions live in Firestore as a layer over the bundled content (`question_overrides`): change replaces text/options/answer/explanation, remove keeps it hidden, keep restores it. Review endpoints for the bot (bot key + the admin's linked chat only): list questions under review, apply a decision (validated: 3–4 distinct options, exactly one matching the answer) and close its reports. Size: L.

- [x] After a report the question is not served in new lessons, mistakes review or bot sessions
- [x] keep restores the original; change serves the corrected question and grades against the new answer; remove keeps it hidden; each closes the question's reports
- [x] An invalid change (bad options, answer not an option) is refused with a reason
- [x] Review endpoints answer 403 for any chat that is not the admin's
- [x] A lesson never runs out of questions: if hiding leaves too few, the lesson still serves what it has

*Closing note:* 0f54de3 + da27cf9 in PR #46

| Task | Owner | Note |
|---|---|---|
| Hide reported questions; question_overrides layer at serve and grade time | Claude | 0f54de3: question_overrides layer in the Exercise model; hidden on report; serve filters, grading corrected |
| Admin identity and review endpoints | Claude | da27cf9: /api/bot/review/queue + decide, validation, ADMIN_USERS exact name 'Yossi Zini'; 83/83 tests |
| Tell me which account is the admin | owner | Admin account: 'Yossi Zini' (ADMIN_USERS) |

### P1 s5 · Bot: /review manual and /review auto with the review agent

As the admin, I want to review reported questions in Telegram. For each question under review the ADK agent (Gemini) reads the question and its reports and proposes keep / remove / change (with the corrected question). /review manual: the bot shows the question, the reports and the proposal; buttons Approve / Keep original / Remove, or the admin types a correction and the agent revises the proposal, shown again. /review auto: every proposal that passes validation is applied without asking; the bot sends a summary of what changed. Only the admin's chat can use /review. Size: L.

- [x] /review from any other chat answers that it is for the admin only
- [x] manual: one question at a time; Approve applies the proposal; a typed correction produces a new proposal; Keep original restores the question
- [x] auto: applies valid proposals, skips invalid ones and lists them, ends with a summary
- [x] Student notes are passed to the model fenced as data and cannot change what the API accepts (validation stays in the API)
- [x] Bot tests and the smoke script cover manual and auto

*Closing note:* 682def8 + cea7b30 in PR #46

| Task | Owner | Note |
|---|---|---|
| API: review session (kind 'review') — start, pending proposal, answers, next item | Claude | 682def8: review session kind 'review' (start, proposal, act) |
| Bot: review agent (ADK, Gemini Pro, structured proposal) | Claude | cea7b30: ADK LlmAgent, output schema, gemini-3.1-pro-preview via global |
| Bot: /review manual and /review auto, replies and buttons | Claude | cea7b30: /review manual\|auto, buttons, typed corrections, auto rounds of 40 s |
| Tests and smoke (fake agent), then PR | Claude | backend 84/84, bot 37/37, e2e on the emulator with a fake agent; real Pro call to be seen after deploy |

### P1 s7 · API: word reports, hidden until reviewed

As a student, I want to report a wrong word translation so that it is fixed. word_reports with a snapshot; word_overrides {hidden, removed, change:{hebrew_translation, sentence_en}} applied in VocabularyWord. Size M.

- [x] POST /api/reports with wordId files a word report (reasons wrong_translation, missing_translation, bad_sentence, other); duplicate and daily cap as for questions
- [x] A reported word is not picked by the bot exam, the web quiz or as a wrong option until reviewed; an open exam can still grade it
- [x] A 'change' decision serves the new Hebrew translation / sentence everywhere

*Closing note:* db23e04: word_reports, word_overrides (shared override store), VocabularyWord serves corrections, /api/bot/report; PR #47

### P1 s8 · Report a word: bot words exam and web vocabulary quiz

As a student, I want /report in the words exam (and a 🚩 link in the web quiz) so that I can flag a bad word without leaving the exam. Size M.

- [x] /report during a words exam offers word reasons as buttons and reports the last answered (else current) word; the exam continues at the same word
- [x] Works for an hour after the exam ended
- [x] The web quiz shows a 🚩 link under the word; one tap sends the report

*Closing note:* e3635e5 bot /report word reasons; 092d870 web quiz 🚩 link (phone check passes); PR #47

### P1 s9 · /review covers words

As the admin, I want reported words in the same /review queue so that the agent proposes keep / change / remove for them too. Size M.

- [x] The review queue lists words and questions, oldest report first
- [x] The agent proposes a word change (Hebrew translation, example sentence); the API validates it
- [x] Manual and auto modes work for words; docs and system map updated

*Closing note:* One queue for questions and words, word change validated in the API, word schema for the review agent; docs and system map v10; PR #47

### P1 s10 · Review open to every student; review findings

As the owner, I want any linked student to review reports in Telegram so that reports get cleared without me. Replaces the admin role (ADMIN_USERS). Size M.

- [x] Any linked chat can /review_manual and /review_auto; both are in everyone's menu
- [x] A daily cap per student on review-agent calls (BOT_DAILY_REVIEW_CAP, 40)
- [x] The 4 code-review findings fixed: web reason, English alternatives, /help cost, stale Hebrew sentence

*Closing note:* d8279e4 + 96514e8; system map v11; PR #48

### P2 s6 · Docs and system map for reports and review

As a maintainer, I want the report and review flow documented. docs/telegram-bot.md (/report, /review), help text, docs/deployment.md (ADMIN_USERS), system map (hide on report, overrides layer, review agent). Size: S.

- [x] System map shows the report and review loop, republished
- [x] Docs describe /review manual and auto and the overrides layer

*Closing note:* 6dec01e in PR #46: docs, help, system map v9

