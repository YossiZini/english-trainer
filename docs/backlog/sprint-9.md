# Sprint 9 — Two-way words exam in the Telegram bot (archived backlog)

**Goal:** Let a student take the Telegram words exam in either direction, English→Hebrew or Hebrew→English, chosen with buttons, and at the end repeat the same words in the other direction.
**Period:** 2026-09-29 → 2026-09-29
**Items:** 13 (4 stories), all done

## Scope

- When a words exam starts, the bot asks for the direction with inline buttons (English→Hebrew / Hebrew→English); no typing needed to choose, and a typed choice still works
- English→Hebrew stays as today: the English word is shown and the student types the Hebrew translation, checked as now (Hebrew matcher plus the AI judge)
- Hebrew→English: the Hebrew translation is shown and the student types the English word, checked by a new English-answer matcher (case, spaces, articles, small typos) with the AI judge as fallback
- At the end of the exam the summary offers a button to take the same words again in the other direction; the new session reuses exactly the same words
- API: the direction is stored in the bot vocabulary session; scoring, points, mastery and daily/rate caps work in both directions; the bot keeps no state
- Verification: backend tests (both directions, switch with the same words, English matcher), bot unit tests, smoke script; docs/telegram-bot.md, bot help text and the system map updated

## Stories

### P1 s1 · API: words exam in both directions

As a student, I want to choose English→Hebrew or Hebrew→English for the words exam, so that I practise recalling the English word too. BotSession gets `direction` ('en-he' default | 'he-en') chosen in a second setup step after the level; BotService shows the Hebrew and checks typed English for 'he-en'; new utils/englishAnswer.js; answerJudge prompt per direction. Size: M (~half a day).

- [x] After the level, setup asks the direction with options 1 English→Hebrew, 2 Hebrew→English; '1'/'2' or a direction word selects it, anything else repeats the question
- [x] en-he works exactly as today (existing bot tests pass unchanged)
- [x] he-en shows the Hebrew translation and accepts the English word ignoring case, outer spaces, a leading a/an/the/to and one small typo in words of 5+ letters; a miss may go to the AI judge within the daily cap
- [x] The example hint ('?') in he-en shows the sentence with the English word blanked
- [x] Scores, failed words, points and rounds are recorded the same in both directions

*Closing note:* 22325e5 in PR #43; '?' in he-en blanks the answer in the English sentence (no word has a Hebrew one), fixed in 906e6b4

| Task | Owner | Note |
|---|---|---|
| Direction setup step in BotSession and BotService | Claude | 22325e5: setup level → direction; session.direction ('en-he' default) |
| English answer matcher (utils/englishAnswer.js) with unit tests | Claude | 22325e5: utils/englishAnswer.js + englishAnswer.test.js (5 tests); typo that spells another stored word is rejected |
| Answer path by direction: word view, expected answer, judge prompt, masked example | Claude | 22325e5: word view by direction, judge PROMPT_HE_EN, '?' shows the Hebrew sentence in he-en (instead of blanking the word) |
| Backend tests for both directions | Claude | 22325e5: he-en API test; existing tests gained the direction step ('1' = as before); 66/66 twice |

### P1 s2 · API: repeat the same words in the other direction

As a student, I want to take the same words again the other way round when an exam ends, so that I learn them both ways. The summary says the switch is available; POST /api/bot/session/switch starts a new active session with the last finished vocabulary session's word_ids and the opposite direction (no setup questions). Size: S.

- [x] A completed or ended vocabulary session's summary includes the opposite direction the student can switch to
- [x] switch starts a session with exactly the same words (all of them, fresh order) and the opposite direction, at the same level
- [x] switch with no finished vocabulary session for the chat returns no_session; an open session is replaced as with start
- [x] Rate and daily caps apply as for other bot calls

*Closing note:* 9afdbdc in PR #43

| Task | Owner | Note |
|---|---|---|
| BotService.switchDirection + route + controller | Claude | 9afdbdc: POST /session/switch; open exam first, else last finished; summary.switchTo |
| Backend tests for the switch | Claude | 9afdbdc: same set, opposite direction, replace open, no_session; 68/68 twice |

### P1 s3 · Bot: direction buttons, Hebrew→English prompts, switch button

As a student, I want to pick the direction and the switch with buttons in Telegram, so that I never type a choice. replies.py: direction setup question with buttons, word line per direction ('תרגמו לאנגלית' / 'תרגמו לעברית'), summary with a switch button; coach.py: the switch button/command calls the switch endpoint; api_client gains switch. Size: M.

- [x] After the level buttons, the bot shows direction buttons; tapping one starts the exam in that direction
- [x] he-en words are shown in Hebrew with the instruction to answer in English; the verdict shows the English answer when wrong
- [x] The end summary shows a button to repeat the same words in the other direction; tapping it starts them
- [x] Typed '1'/'2' still work; bot unit tests and the smoke script cover both directions and the switch

*Closing note:* 906e6b4 in PR #43

| Task | Owner | Note |
|---|---|---|
| Replies: direction question, per-direction word line and verdict, switch button | Claude | 906e6b4: direction buttons with labels, TRANSLATE_TO by direction, 🔄 switch button under summaries |
| Coach + API client: switch command after a summary | Claude | 906e6b4: 🔄 button and 'switch' command → /session/switch; 'switch' in the Telegram menu |
| Bot unit tests and smoke script for both directions and the switch | Claude | 906e6b4: bot tests 31/31; smoke walks the button into a he-en exam |

### P2 s4 · Docs and help for the two-way exam

As a maintainer, I want the docs and the bot's help to describe both directions and the switch, so that users and future work know the flow. docs/telegram-bot.md, replies.HELP, system map (words exam both ways). Size: S.

- [x] docs/telegram-bot.md describes the direction step and the switch
- [x] The help text mentions both directions
- [x] System map updated and republished if the flow description changes

*Closing note:* ccad906 in PR #43: help text, docs/telegram-bot.md, system map v8 republished

