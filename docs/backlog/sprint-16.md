# Sprint 16 — English unseen in Telegram (archived backlog)

**Goal:** Let a student practise an English unseen in Telegram: /unseen sends a reading text first, then asks its five questions one by one, and saves the result like an unseen on the website.
**Period:** 2026-11-01 → 2026-11-01
**Items:** 22 (5 stories), all done

## Scope

- /unseen (also 'unseen') gives the easiest text the student has not finished yet; 'unseen list' shows all 15 texts numbered with ✅ on finished ones, and 'unseen 7' opens text 7
- The bot first sends the whole text (English and Hebrew title, the text in its paragraphs), then the five questions one per message, in English, with options 1–4 as buttons; only an option number is an answer
- Each answer gets ✅, or the kind wrong-answer line with the right answer and the Hebrew explanation (📖); '?' (also a button) during a question shows the text's hard words with their translations and the question in Hebrew, and records nothing
- After the fifth answer: how many were right and the score, with kind words, and /unseen for the next text; /end stops at any time and a half-done text is not completed (as on the website)
- Recorded like a website unseen (owner's decision, 2026-11-01): each answer when checked, the score and the text's progress at the end, so the website's Unseen page shows it done and /usage counts it as a reading text; no points, no mistakes
- /unseen in the command menu, /help, the Telegram link page and docs/telegram-bot.md; the system map updated
- Optional: a button that sends the text again during the questions
- Added 2026-11-01 (owner): more reading texts at levels 3–5 on the website and in Telegram; at level 5, two answers that look right but only one most accurate

## Stories

### P1 s5 · Review follow-ups

As a student, I want a reading to end cleanly and be saved even after a passing error, so that a double tap or a hiccup never costs me a reading. From the Sprint 16 review (2026-11-01), fixes 1–4, approved by the owner. Size: S–M (~2 h). One PR.

- [x] A second message for the last question gets 'already answered, the reading ended', never 'no active practice'
- [x] If the website writes fail at the end of a reading, the next /unseen (or unseen list) saves that reading: score, progress counted once, /usage
- [x] Through the agent, a text picked from the list or the 📄 reply still arrives with its text first
- [x] Reading error codes read right in every reply; the docs and the system map say exactly what a double tap does

*Closing note:* All four review fixes in PR #72 (f886ed3, cca7a24, eec6b12); waiting for your merge

| Task | Owner | Note |
|---|---|---|
| API: the end of a reading, the twin's reply and saving after a failure | Claude | Done in f886ed3: finish() re-runnable (rows fixed ids, progress once per reading, website completed last), /unseen and the list save an unsaved reading; status says justEnded for a minute after a last answer |
| Bot: the agent path keeps the text; reading errors in every reply | Claude | Done in cca7a24: twin after the end gets 'already answered' (both timings, every kind); answer_word direct when a text comes first; error_reply knows reading codes |
| Docs: what a double tap does; PR | Claude | Done in eec6b12: telegram-bot.md, knowledge.md, system map (v20) say what a double tap does; PR #72 open |

### P1 s1 · /unseen: the text first, then its five questions

As a student, I want /unseen to send me an English reading text and then ask its five questions one by one in Telegram, so that I can practise unseen anywhere and see it on the website. Size: L (~8 h). Owner's decisions (2026-11-01): the next text not finished yet; recorded like a website unseen (score, progress, /usage), no points, no mistakes; Hebrew help only on '?'. A new session kind 'unseen' (services/bot/unseenSession.js) on the existing rails, like /kefel; answers are option numbers, no model call.

- [x] /unseen (or 'unseen', with or without '/') starts the easiest text the student has not finished: level, then English title (the website's order)
- [x] The first reply is two Telegram messages: the text (English and Hebrew title, level, the text in its paragraphs), then question 1/5 in English with options '1) …' and buttons 1–4 and ?. The longest text message is 1,338 characters; a test checks all 15 fit Telegram's 4,096
- [x] Only an option number 1–4 is an answer; other text repeats the question and records nothing; a bare command still works during a question; /end and 'end' stop
- [x] Right: '✅ נכון!'. Wrong: the kind line, the right option ('2) Twice a week') and 📖 the Hebrew explanation; then the next question
- [x] '?' during a question sends the text's 7 hard words with their translations and the question in Hebrew, then the same question; nothing is recorded
- [x] After the 5th answer: how many of the 5 were right and the score, with kind words, and /unseen for the next text
- [x] Recorded like a website unseen: each answer when checked, the score and the text's progress at the end. The website's Unseen page shows the text 'בוצע' with its score, and /usage counts one reading text; points and mistakes unchanged (API tests)
- [x] /end mid-way says how far it got and completes nothing: no score, no progress, not in /usage
- [x] Two answers sent together never record a question twice and the score is never above 100 (a test sends them at once); the last answer and the session's end are one write
- [x] Found from the bot menu, /help, the no-session and linked replies and the website's Telegram page; a free-form request reaches it through the agent and the text arrives whole (not cut by the model's 200-token cap)
- [x] docs/telegram-bot.md and the system map updated; backend, bot and frontend tests green; one real round through the coach against the emulator API

*Closing note:* Done: PR #71, deploy run #71 green; /unseen is live. The owner's live check (s1-t8) moved to Sprint 17 (owner, 2026-11-01)

| Task | Owner | Note |
|---|---|---|
| API: unseen session kind, start with the text | Claude | Done in d05ec60 (draft PR #71): kind 'unseen', POST /api/bot/unseen/start (next text or number N), passage + question 1; tests in botUnseen.test.js |
| API: answers, '?', the end and status | Claude | Done in d05ec60 (draft PR #71): answers recorded per answer, score + progress at the end, '?' hard words, /end abandons; website, /usage and no-points checks in tests |
| API: two answers at once never count twice | Claude | Done in e5427be (PR #71): answers claimed in a transaction; website rows with fixed ids, all five written before the score; complete() counts each question once; 3 planted faults each fail a test |
| Bot: a reply can send the text before the question | Claude | Done in 53214f9 (PR #71): Reply.before, sent in order by the webhook; buttons on the last message |
| Bot: the /unseen command and its replies | Claude | Done in 93653c1 (PR #71): parse 'unseen', 'unseen 7', 'unseen list'; unseen_replies.py (text first, verdicts, ?, result, end, status); every real text fits one message |
| Bot: menu, /help and the agent | Claude | Done in e6e6246 (PR #71): menu (unseen, unseen_list), /help section, pointers; agent tools start_unseen and list_unseen_texts sent as is (skip_summarization) |
| Docs, link page, system map, a real round, PR | Claude | Done in 83dd20b: telegram-bot.md, link page + test, knowledge.md, system map republished (v19); smoke round on the emulator passed; PR #71 ready for review |

### P1 s2 · unseen list and unseen 7: choose a text

As a student, I want to see all the reading texts and pick one, so that I can choose a topic I like or read a text again. Size: M (~2 h). A list session in setup, like the lesson list, in one message (15 texts, no paging).

- [x] 'unseen list' (also /unseen_list) shows the 15 texts numbered in the website's order, with the level, ✅ and the best score on finished ones and ▶️ on the next one
- [x] A number 1–15 starts that text, a finished one too (to read it again); other text shows the list again; /end closes it
- [x] 'unseen 7' starts text 7 directly; a number outside 1–15 says so kindly and points to the list
- [x] When every text is finished, /unseen says so kindly and shows the list
- [x] In the menu and /help; API and bot tests

*Closing note:* Done: API 7dc6de6, bot 93653c1 + e6e6246 (PR #71); acceptance checked by botUnseen.test.js and test_unseen.py

| Task | Owner | Note |
|---|---|---|
| API: the text list and starting text N | Claude | Done in 7dc6de6 (PR #71): POST /api/bot/unseen/list, marks from the website's progress, pick by number, all finished shows the list |
| Bot: unseen list / unseen 7 and the list reply | Claude | Done in 93653c1 and e6e6246 (PR #71): unseen list / unseen 7 parse, the list reply, unseen_list in the menu |

### P1 s6 · More reading texts, levels 3–5

As a student, I want more and harder unseen texts on the website and in Telegram, so that I can keep practising after the first 15. The owner's request (2026-11-01): texts at level 3 and above; at level 5, questions where at least two answers look right but only one is the most accurate. Plan: 10 texts (3 at level 3, 3 at level 4, 4 at level 5). Size: L (~5 h). First the generator must keep ids: today it mints new ones (and fails silently), which would orphan students' progress.

- [x] 10 new texts: 3 at level 3, 3 at level 4, 4 at level 5; each with 5 questions of 4 distinct options, a Hebrew question and explanation, 7 hard words that appear in the text, a Hebrew title and a topic
- [x] Level 5: every question has at least two options that look right on a first read; exactly one is the most accurate per the text, and the explanation says why the other falls short
- [x] The same data on the website (Unseen page) and in Telegram (/unseen, the list); every new text fits one Telegram message
- [x] The 15 existing texts keep their ids and content, so students' progress stays attached
- [x] The generator keeps ids, stops on an error, and --unseen regenerates only the reading texts; a test keeps the seed and the JSON in sync
- [x] An independent review checks every new question against its text; content rules are tested

*Closing note:* Done: 10 texts (3 at level 3, 3 at level 4, 4 at level 5) live since deploy #73; every acceptance criterion met (4 blind rounds, explanations reviewed, ids kept, content tests)

| Task | Owner | Note |
|---|---|---|
| Generator: keep the reading texts' ids, stop on errors, --unseen | Claude | Done in a67e080 and 7a21a7c (guide), pushed into PR #72 at the stop hook's request (the PR now names it); the seed is a data module, the generator keeps ids, stops on errors, --unseen; regenerating changes nothing |
| Write 10 texts: 3 at level 3, 3 at level 4, 4 at level 5 | Claude | 10 texts written (L3: 208–215 words, L4: 267–272, L5: 296–314, 4 paragraphs); the strict check passes: exact hard words, answer positions vary, the right answer is never given away by length |
| Independent review and content tests | Claude | Four blind rounds, every answer matched its key (50/50 twice, then 22/22 and 13/13); no second right answer, no factual error, a real near-miss in every level-5 question. All 50 Hebrew explanations read with the keys: none wrong, 17 reworded. Content test now checks every English quote in an explanation. Five questions a test-wise student can still narrow down are noted in PR #73 |
| Regenerate, check web and bot, docs, PR | Claude | PR #73 merged; deploy run #73 green: the 10 new texts are live on the website and in Telegram (25 texts). Found on the way and fixed in PR #74: d7 (website hid the explanation) and d8 (back button over titles) |

### P3 s4 · A button that sends the text again

As a student, I want to see the text again during the questions without scrolling up. Size: S (~45 min). A 📄 button next to 1–4 and ? re-sends the text, then the same question, and records nothing. Not the word 'text': it is a vocabulary answer.

- [x] the button re-sends the text and then the same question
- [x] nothing is recorded

*Closing note:* Done in 89f57b4 (PR #71)

| Task | Owner | Note |
|---|---|---|
| API + bot: a 📄 button re-sends the text and the same question | Claude | Done in 89f57b4 (PR #71): 📄 button, API passageAgain, text first then the same question; tests both sides |

