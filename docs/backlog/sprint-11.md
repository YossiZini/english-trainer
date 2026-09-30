# Sprint 11 — /usage: who practised this week and month (archived backlog)

**Goal:** Add a /usage command to the Telegram bot that shows every student's participation (no scores) over the last 7 and the last 30 days.
**Period:** 2026-09-30 → 2026-09-30
**Items:** 17 (5 stories), all done

## Scope

- /usage in Telegram, for any linked student and in everyone's menu (owner's decision: everyone may see everyone's participation)
- Per student, for the last 7 and 30 days: active days, lessons done, words practised, last active date (web and bot together); no scores, points or correct/wrong counts
- The API builds the summary from existing student data in one pass, cached briefly so repeated /usage calls stay cheap
- Plain Hebrew reply that stays readable with many students (sorted by activity, long lists shortened)
- Help, docs and system map updated; first item: /sprint review of the Sprint 10 range (retro rule)

## Stories

### P1 s5 · Review follow-ups (Sprint 10)

As the maintainer, I want the Sprint 10 review's findings fixed before new work builds on them. Size M.

- [x] Review calls finish inside Cloud Run's 30 s request limit
- [x] In a words exam a bare word is always an answer
- [x] /review_auto never crashes on a failed call
- [x] A decision applies only while the item is still under review
- [x] A second word change keeps the dropped Hebrew sentence dropped
- [x] The vocabulary quiz's report-link styles live under its own root class

*Closing note:* All 6 fixed in PR #51 (backend 96, bot 45, web 45 tests; viewport pass)

| Task | Owner | Note |
|---|---|---|
| Review timeouts under 30 s | Claude | 20 s per agent call, 25 s auto round, start guard; 479e654 |
| Bare words are answers in a words exam | Claude | words exam: bare word = answer; 479e654 |
| /review_auto survives a failed call | Claude | every act result checked, round ends with summary; 479e654 |
| No stale decisions (item must still be under review) | Claude | already_decided (409) when no open report; 479e654 |
| Keep sentence_he dropped across word changes | Claude | previous sentence_he null carried forward; 479e654 |
| Scope the quiz's report-link CSS | Claude | scoped under .exercise-page / .vocabulary-question; viewport check passes; 479e654 |

### P1 s1 · Review the Sprint 10 range

As the maintainer, I want the Sprint 10 code reviewed (retro rule: review before close; it was skipped) so that its problems are fixed before new work builds on it. Range 6ef51f1...f50596e. Size S.

- [x] code-review at level high on the range, plus the lens: service cohesion, thin controllers, models not reaching into other models' storage, dependencies, duplication, errors at boundaries
- [x] Findings reported as fix now / follow-up / fine as is; with the owner's OK, 'fix now' items become tasks here

*Closing note:* Review done; owner: fix the 6 findings (s5), keep removal by any student as is

| Task | Owner | Note |
|---|---|---|
| Run the review and report findings | Claude | 10 findings: fix now 6 (bot timeout > Cloud Run 30s, bare review/report words eaten in he-en exam, auto KeyError, stale decision race, sentence_he lost on 2nd change, CSS rule), follow-up 3, decision on open removals |

### P1 s2 · API: participation summary per student

As a student, I want to see who practised in the last 7 and 30 days so that practice becomes a shared habit. New UsageService + GET /api/bot/usage. Sources (fields checked): exercise_results.completed_at (lessons, web and bot), vocabulary_user_history.answered_at (web word answers), bot_sessions vocab started_at + correct_count+wrong_count (bot word answers), unseen_sessions.completed_at (reading). Size M.

- [x] Per student, for 7 and 30 days: active days, lessons done, words practised, reading texts done, last active date
- [x] No scores, points, grades or correct/wrong counts anywhere in the response
- [x] Days are counted in Israel time (Asia/Jerusalem); a window includes today
- [x] Only students active in the last 30 days are listed, plus a count of the others
- [x] Reads only the window's documents (a date-range query) and is cached 10 minutes per instance
- [x] Any linked chat may call it (owner's decision); an unlinked chat is refused as for every bot route

*Closing note:* 0213beb; PR #52

| Task | Owner | Note |
|---|---|---|
| Date-range read in the database layer | Claude | db.findSince (single-field >= query); 0213beb |
| UsageService: aggregate the four sources, Israel days, cache | Claude | services/usage.service.js via model readers, Israel days, 10 min cache; 0213beb |
| GET /api/bot/usage with tests | Claude | GET /api/bot/usage; tests/usage.test.js (4), backend 100 pass; 0213beb |

### P1 s3 · /usage in the Telegram bot

As a student, I want /usage in the menu so that I can see who practised this week and this month. Size S.

- [x] /usage (also 'usage') replies in Hebrew: one line per student, sorted by active days this week, then this month
- [x] Each line: name, active days, lessons, words, reading (week | month) and last active date
- [x] At most 30 lines, then 'and N more'; the reply stays under Telegram's 4096 characters
- [x] /usage is in everyone's menu and in /help; /help still makes no API call

*Closing note:* PR #52

| Task | Owner | Note |
|---|---|---|
| Command, API call and reply builder | Claude | usage_replies.py, api usage(), parse; tests/test_usage.py; PR #52 |
| Menu and help | Claude | menu + help; bot 50 tests pass; PR #52 |

### P2 s4 · Docs and system map

As the maintainer, I want the docs to say what /usage shows and who sees it. docs/telegram-bot.md (commands, a Usage section, privacy note), system map (new flow and the cache). Size S.

- [x] telegram-bot.md: command row and a short section, including that every linked student sees every active student's name and activity
- [x] System map updated and republished

*Closing note:* telegram-bot.md Usage section; system map v12; PR #52

