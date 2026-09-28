# Sprint 6 — Telegram vocabulary bot on a secured API (archived backlog)

**Goal:** Let a student practise vocabulary from Telegram: a bot built as a Google ADK agent drives a 20-word English-to-Hebrew session through new, authenticated API endpoints, repeats failed words until none remain, and runs under hard budget limits.
**Period:** 2026-09-28 → 2026-09-28
**Items:** 24 (8 stories), all done

## Scope

- Bot API in the existing Express backend (/api/bot): start a session of 20 words chosen by the student's level, answer (check the Hebrew translation, reply correct/wrong and send the next word), end on 'end'; after the 20 words, offer the failed words again in random order until none fail
- Security: every new endpoint requires authentication; the bot calls the API with a service credential from Secret Manager and acts on behalf of a linked student, and each Telegram chat is linked to a student account through a one-time code generated in the web app; per-user and per-chat rate limits
- Telegram bot as a Google ADK agent (Python, separate Cloud Run service) whose tools call the bot API; Telegram webhook verified with a secret token; the agent only orchestrates, all word selection and answer checking happen in the API
- Budget limits: GCP billing budget with alerts, Gemini token caps per session and per day, Cloud Run max instances and concurrency, daily message cap per user; the bot refuses politely when a cap is reached
- Tests for the bot API (Firestore emulator) and the agent's tools; docs/telegram-bot.md (setup, secrets, limits); deployment of the agent added to the workflow
- No change to the web app's own vocabulary quiz beyond the account-linking screen

## Stories

### P1 s1 · As a student, I want a 20-word English→Hebrew session I can drive one message at a time, so I can practise vocabulary from any chat

Size ~4 h. New bot session API in the Express backend, independent of the web quiz (which checks answers by option id, not text, and never stores a word list per session). A session holds its 20 word ids, the current position, the round number and the failed list; a wrong or unanswered word goes to the failed list; after the last word the failed words come back shuffled, round after round, until the list is empty. Words are chosen by the student's level (current_level beginner/intermediate/advanced → difficulty 1–3 / 3–5 / 5–10, as DIFFICULTY_STAGES in vocabulary.service.js), preferring words not yet mastered.

- [x] POST /api/bot/session/start returns the first word and a session id; the session has exactly 20 distinct words in the student's difficulty range
- [x] POST /api/bot/session/answer with the right Hebrew returns correct:true and the next word; with the wrong one correct:false, the stored translation, and the next word
- [x] After word 20, if any failed, the reply says how many and the next word is a failed one; the failed round is in random order; a word answered right leaves the list, wrong stays; the session ends with a summary only when the list is empty
- [x] 'end' (or 'סיים') at any point ends the session with a summary
- [x] Answer matching ignores punctuation, extra spaces and nikkud, and accepts any alternative when the stored translation lists several (/ or ,)
- [x] api.test.js covers a full session on the emulator, including one failed round

*Closing note:* Committed on work branch; PR after s2

| Task | Owner | Note |
|---|---|---|
| BotSession model and word selection | Claude | models/BotSession.js, services/bot/wordPicker.js (level ranges, unmastered first), collections registered |
| Hebrew free-text answer matching | Claude | utils/hebrewAnswer.js + tests/hebrewAnswer.test.js |
| bot.service: start / answer / end state machine | Claude | services/bot.service.js: start/answer/end/status, failed rounds, records to word scores |
| Routes, controller and emulator tests for /api/bot/session/* | Claude | routes/bot.routes.js + controllers/bot.controller.js; tests/bot.test.js walks 20 words + 2 failed rounds (39 backend tests green) |

### P1 s2 · As a maintainer, I want every bot endpoint authenticated and each Telegram chat linked to one student, so nobody can drive or read another student's practice

Size ~3.5 h. Today there is only student JWT auth (auth.middleware.js), no service credential, no roles, no rate limiting. The bot service calls the API with a service key from Secret Manager (bot-api-key) and names the chat; the API resolves chat → student through a telegram_links record created with a one-time code the student gets in the web app. Rate limits per chat and per day protect both the API and the Gemini bill.

- [x] Every /api/bot/* route rejects requests without a valid X-Bot-Key (401) and with an unlinked chat (403); the key comparison is timing-safe; the key never appears in the repo or the board
- [x] A student gets a 6-digit code from the web app (valid 10 min, single use, stored hashed); sending it to the bot links the chat; /api/bot/link with a wrong or expired code fails; a chat can be unlinked from the web app
- [x] More than 60 messages per minute per chat or more than BOT_DAILY_MESSAGE_CAP (default 300) per student per day returns 429 with a Hebrew message; the daily counter is a Firestore transaction
- [x] The web app has a Telegram screen (code, instructions, unlink) reachable from the navbar
- [x] Tests cover key, link, unlink, expired code, both limits

*Closing note:* Backend + web screen committed on work branch; PR pending (#25 open on the branch)

| Task | Owner | Note |
|---|---|---|
| Bot service credential middleware | Claude | middleware/botAuth.middleware.js (timing-safe X-Bot-Key, chat->student), config/bot.js |
| Telegram link flow (code, link, unlink) | Claude | models/TelegramLink.js (hashed 6-digit code, 10 min, single use), routes/telegram.routes.js, POST /api/bot/link |
| Rate limits per chat and daily cap per student | Claude | middleware/botLimits.middleware.js: 60/min per chat (memory), daily cap in bot_usage (transaction), 429 Hebrew |
| Web app: Telegram linking screen | Claude | components/settings/TelegramLinkPage.jsx (+css, test), services/telegramService.js, route /settings/telegram, navbar button; screenshots docs/screenshots/sprint-6 |

### P1 s3 · As a student, I want to chat with a Telegram bot that runs my session, so the practice feels like a conversation

Size ~4 h. New folder bot/ (Python 3.12, google-adk, FastAPI webhook, httpx). The ADK agent has tools link_account, start_session, answer_word, end_session, session_status, each an HTTP call to /api/bot/* with the service key and the chat id; Gemini Flash only phrases the replies in Hebrew and routes the message to a tool; it never chooses words or judges answers. Webhook requests are verified with X-Telegram-Bot-Api-Secret-Token. Separate Cloud Run service english-trainer-bot deployed by the same workflow.

- [x] Sending 'words' (or 'מילים') in Telegram starts a session and the bot sends the first English word; each Hebrew reply gets ✅/❌ with the expected translation on ❌, then the next word; 'end' ends with a summary
- [x] An unlinked chat is told to get a code from the web app; sending the code links it
- [x] A webhook request without the secret token is rejected (403) and never reaches the agent
- [x] The agent's tools are unit-tested against a mocked API; the webhook handler is tested with a sample Telegram update
- [x] bot/Dockerfile builds; infra/cloudrun-bot.yaml has maxScale 2, concurrency 10, secrets from Secret Manager; the workflow deploys it after the backend

*Closing note:* Agent path itself unverified here (no Gemini credentials in this session); fast path verified end to end

| Task | Owner | Note |
|---|---|---|
| ADK agent with API tools | Claude | bot/app: agent.py (LlmAgent, Hebrew instruction), tools.py (5 tools, chat id from session state), api_client.py, replies.py; tests/test_tools.py |
| Telegram webhook service | Claude | bot/app/main.py FastAPI webhook (secret token, 403), coach.py (fast path + agent), telegram.py; tests/test_webhook.py, test_coach.py; smoke.py walked a session on the emulator |
| Container, Cloud Run spec and deploy job | Claude | bot/Dockerfile, infra/cloudrun-bot.yaml (2x10, 30s, secrets), infra/setup-bot.sh + set-webhook.sh, deploy.yml: test-bot + deploy-bot (gated on var DEPLOY_BOT) and BOT_API_KEY injected into the API spec |

### P1 s4 · As the parent paying the bill, I want hard caps on what the bot can spend, so a runaway conversation or an attacker cannot cost money

Size ~2 h plus your setup. Layers: API caps (s2-t3), agent caps (max output tokens, max tool calls per turn, max turns per chat per day, conversation kept to the last few turns), Cloud Run limits (max instances 2, concurrency 10, timeout 30 s), and a GCP billing budget with alerts at 50/90/100 % (infra/hardening.sh already has BUDGET_USD=5; add the bot). When any cap is hit the bot answers with a short Hebrew message and does nothing else.

- [x] Agent config has MAX_OUTPUT_TOKENS, MAX_TOOL_CALLS_PER_TURN, MAX_TURNS_PER_CHAT_PER_DAY with defaults, all enforced and tested
- [x] A 429 from the API is turned into a fixed Hebrew message without another model call
- [x] infra/cloudrun-bot.yaml caps instances and concurrency; the budget script covers the bot and Gemini
- [x] docs/telegram-bot.md lists every cap, its default and where to change it

*Closing note:* Caps in code and Cloud Run spec, docs, and your setup done; bot live

| Task | Owner | Note |
|---|---|---|
| Agent-side caps | Claude | bot/app/limits.py DailyTurnCounter, RunConfig max_llm_calls, max_output_tokens, history trimmed at HISTORY_EVENTS, 429 -> fixed reply; tests |
| Budget alert script and docs | Claude | docs/telegram-bot.md (caps table, setup, rotation, troubleshooting); deployment.md + CLAUDE.md pointers; project budget alert already covers Vertex AI |
| Create the Telegram bot, secrets and budget (you) | owner | Done by you: @Yzteacher_bot created, setup-bot.sh ran, DEPLOY_BOT=true, webhook set (via Cloud Shell), end-to-end test passed. Budget alert: the project-wide one from infra setup, not re-run. |

### P1 s7 · As a student, I want the bot to ask which words and which level before a session, tell me the points I earn, and keep my failed words, so the bot practice matches the web app

Added mid-sprint by the user after the end-to-end test. Session setup lives in the API (session status 'setup' with steps type -> level), the bot only asks and relays; Telegram reply keyboards give 1/2/3 buttons. Points: 1 per correct answer through User.addPoints, shown on each ✅ and in the summary. Wrong answers also bump the web quiz's accumulated-fails counter (review mode).

- [x] 'מילים' asks the word type (all / Band II / Band III) then the level (easy / medium / hard) with buttons; a type-level pair with too few words says so and asks again
- [x] Each correct answer shows +1 and the summary shows points earned and the new total; User.total_points grows accordingly
- [x] A wrong answer is in vocabulary_failed_words, vocabulary_word_scores and vocabulary_user_stats.accumulated_fails
- [x] Backend and bot tests cover the setup steps and points

*Closing note:* Committed on the work branch; PR pending

| Task | Owner | Note |
|---|---|---|
| API: setup steps, source filter, points and fail counter | Claude | bot.service setup steps + points + incrementFails; wordPicker LEVELS/WORD_SETS; 39 backend tests green |
| Bot: setup prompts with reply keyboards, points in replies | Claude | replies.Reply with buttons, telegram reply_markup, coach fast path covers setup; 11 bot tests; smoke run shows the flow; docs updated |

### P1 s8 · As a student, I want the bot to ask only the level and to accept a correct answer that is not the dictionary's, so practice is quicker and fairer

Added by the user. Word-set question removed (all words always). A short Hebrew answer that misses the dictionary gets one Gemini yes/no inside the API (services/bot/answerJudge.js, Vertex AI as the runtime SA); capped at 100 checks per student per day in bot_usage; any failure = wrong. Moved from the bot to the API at the user's request so the API owns every verdict.

- [x] 'מילים' asks only the level; words come from all sources
- [x] A Hebrew answer that misses the dictionary is sent to Gemini once; accepted counts as right with +1 and shows the dictionary translation
- [x] English or long text is never judged; any judge failure counts as wrong
- [x] Backend (41) and bot (16) tests cover the flow

*Closing note:* PR #31 merged and deployed (run green: tests, API, bot, site)

### P2 s5 · As a maintainer, I want the bot documented and verified end to end, so I can operate it without this session

Size ~1 h. docs/telegram-bot.md (from s4-t2) completed with a troubleshooting section; a scripted end-to-end check (bot/scripts/smoke.py) that sends a fake Telegram update through the webhook against the local API on the emulator and walks a 3-word session; docs/deployment.md and CLAUDE.md pointers.

- [x] smoke.py runs locally against the emulator-backed API and prints the conversation
- [x] docs/telegram-bot.md covers setup, secrets, caps, troubleshooting; CLAUDE.md links it

*Closing note:* docs/telegram-bot.md with troubleshooting; bot/scripts/smoke.py; deployment.md + CLAUDE.md

### P3 s6 · As a student, I want the word's example sentence on request, so a hard word comes with context

Size ~45 min. 2668 words have sentence_en. A reply of '?' (or 'דוגמה') returns the sentence for the current word without counting as an answer; the API exposes it in the word payload and the agent formats it.

- [x] '?' during a session returns the example sentence, the word is asked again, no attempt recorded
- [x] Words without a sentence get a short 'אין משפט לדוגמה' reply

*Closing note:* '?' returns the example sentence without recording; 42 backend + 13 bot tests; PR open

