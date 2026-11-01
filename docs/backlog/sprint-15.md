# Sprint 15 — The multiplication table (archived backlog)

**Goal:** Let a student learn and practise the multiplication table up to 10×10: a math chapter before fractions on the website, and a /kefel drill of 10 fresh exercises in Telegram.
**Period:** 2026-10-28 → 2026-11-01
**Items:** 17 (3 stories), all done

## Scope

- A math chapter 'לוח הכפל' placed first, before fractions, in three lessons: multiplication up to 10×10, division as the inverse of multiplication, and a mixed review with word problems
- Each lesson: a teaching page with pictures and 30 multiple-choice questions (10 per level), answers computed and checked by an independent script (math-content-guide)
- Telegram: /kefel runs 10 new exercises each time (5 multiplication, 5 division, up to 10×10); the student types the number; at the end a kind summary of how many were right; not saved as a score or as mistakes
- /kefel in the command menu, /help, the Telegram link page and the docs; the system map updated
- Optional: animated lessons for the chapter (s3, P3): deferred at close, not started; listed in the Sprint 15 retro follow-ups

## Stories

### P1 s1 · A multiplication-table chapter first in math

As a student, I want a chapter on the multiplication table before fractions, so that I learn multiplication and division up to 10×10 with explanations and pictures. Topic 100 (lessons 100.1-100.3, order 991-993); the math chapters' display numbers shift by one (fractions become 2), and 100.1 becomes the next math lesson for a student who has not passed it. Size L.

- [x] Three lessons before fractions on the math page and in the bot's lesson list: 100.1 multiplication up to 10×10, 100.2 division as the inverse of multiplication, 100.3 review with word problems
- [x] Each lesson: a teaching page with a worked example and a picture for every rule, and 30 multiple-choice questions (10 easy, 10 medium, 10 hard) with computed answers and wrong options from neighbouring facts
- [x] An independent script re-computes every answer: zero mismatches, 10/10/10 per lesson, the answer among the options; the content guard test passes
- [x] Backend, bot and web tests, build and check:viewport (QUESTIONS=10 on the new lessons) pass; screenshots of the learn page and one exercise per level at 1366×768 and 360×740
- [x] docs/topics-status.md (row and log) and the math guide's numbering updated

*Closing note:* Done: PR #65 merged, deploy #65 green. Owner accepted that hard questions with a picture end below the bar on a laptop/360px phone (follow-up, like fractions)

| Task | Owner | Note |
|---|---|---|
| Topic 100 wiring | Claude | Registered; numberOffset 99, subjectOfTopic from 100; tests for the first lessons, navigation 100.3 -> 101.1 and numbering. 637d30b |
| Lesson 100.1: multiplication up to 10×10 | Claude | 100.1: six rules with pictures, the full table, 30 questions. ffdbdb7 |
| Lesson 100.2: division as the inverse of multiplication | Claude | 100.2: five rules with pictures, 30 questions. ffdbdb7 |
| Lesson 100.3: review and word problems | Claude | 100.3: four rules, 30 questions with two-step word problems. ffdbdb7 |
| Verify and document the chapter | Claude | Done (2d73ee6, f343576, PR #65). Check script 90/90; backend 111, web 75 pass; equations kept on one line on phones; math-page badges no longer reversed; viewport: easy/medium fit, hard + picture overflows on laptop/360px like fractions |

### P1 s2 · /kefel in Telegram

As a student, I want /kefel in the bot to give me 10 fresh multiplication and division drills from the table, so that I can practise anywhere in a minute. Each time 5 × and 5 ÷ up to 10×10, typed answers, a kind summary; not saved as a result or as mistakes. Size M.

- [x] /kefel (also kefel) starts 10 new exercises, 5 × and 5 ÷ with numbers 1-10, no repeats; the student types the number
- [x] A right answer: ✅; a wrong one: a kind line and the right answer; text that is not a number asks again without counting; /end stops
- [x] The end: how many were right, in kind words, and /kefel for another round; no lesson result, points or mistakes are written
- [x] In the command menu, /help, the Telegram link page and telegram-bot.md; the agent starts it for 'לוח הכפל'
- [x] API and bot tests: the new session kind, the bot caps, nothing written to results or mistakes

*Closing note:* Done: /kefel live (PR #66, deploy #66 green); /usage counts drills (PR #67 merged)

| Task | Owner | Note |
|---|---|---|
| API: drill session | Claude | DrillSession + POST /api/bot/drill/start (5df7136): 5 × and 5 ÷, factors 2-10, no fact twice; nothing recorded; backend 116 pass |
| Bot: /kefel | Claude | /kefel command, drill replies, menu, /help, agent tool (d696df9); bot 69 pass |
| Docs and the link page | Claude | telegram-bot.md, Telegram page + test, system map v17 (19fc86a, PR #66); end-to-end round on the emulator OK |
| /usage counts the drill | Claude | PR #67 merged (2e5ced9); /usage shows כפל week\|month |

### P1 s4 · Review follow-ups

As a maintainer, I want the five fixes from the Sprint 15 review so that /kefel never breaks or gives answers away, the chapter's pictures match their rule, and the bot shows math options in the right order. Size S. After PR #67 merges.

- [x] The last /kefel answer ends the drill in the same write; an open drill past its last question is treated as ended, never a 500
- [x] No /kefel round shows a multiplication's answer as a division's dividend (tested over many rounds)
- [x] Lesson 1.2 rule 5 draws 7 × 6 = 42 as 7 rows of 6; the independent check passes
- [x] The bot prints options with no letters inside a left-to-right isolate (tested)
- [x] One end-word check and one ltr helper in the backend
- [x] Backend, bot and web tests pass; one PR

*Closing note:* Done: all five fixes in PR #68, merged

| Task | Owner | Note |
|---|---|---|
| Drill: end the round in one write | Claude | Last answer + end in one write; an open drill with all answers ends on sight (d48a3eb) |
| Drill: no division gives away a product's answer | Claude | Quotients only from facts whose product is not asked: 0 leaks in 20,000 rounds (d48a3eb) |
| Lesson 1.2 rule 5 picture: 7 rows of 6 | Claude | P.array(7, 6); only lesson 100.2 changed; check matches arrays to captions (a43b039) |
| Bot: math options keep their order | Claude | keep_ltr isolates letterless options and right answers (c802203) |
| One end-word check and one ltr helper | Claude | utils/botWords.isEndCommand and utils/bidi.ltr shared (d48a3eb) |

