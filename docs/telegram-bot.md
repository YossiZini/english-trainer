# Telegram practice bot

A student practises from Telegram in two ways: vocabulary (below) and a
lesson's exercises, English or Math (see "Lesson exercises"). For vocabulary, the bot sends an English word,
the student answers in Hebrew, the bot says ✅ or ❌ (with the translation)
and sends the next word. After 20 words the failed ones come back, shuffled,
round after round, until none are left. "סיים" ends the session.

## What a session looks like

1. "מילים" → the bot asks only the level (1 קל = difficulty 1–5, 2 בינוני =
   6–7, 3 קשה = 8–10), with buttons. Words always come from the whole
   vocabulary. The choice is stored on the API session (`status: setup`), so
   the bot keeps no state of its own.
2. 20 words, one per message. ✅ נכון! +1 or ❌ with the translation, then
   the next word. Every correct answer is 1 point (`User.addPoints`, the
   same points as the web quiz).
   An answer that misses the dictionary but is short Hebrew gets one Gemini
   check in the API (see "Answer judging" below); if Gemini accepts it, it
   counts as right and the reply shows the dictionary translation too.
   "?" (or "דוגמה") shows the current word's English example sentence and
   asks the same word again; it is not an answer and nothing is recorded.
3. After the 20th word the failed words return shuffled, round after round,
   until none fail. The summary shows rounds, right/wrong, points earned
   and the new total. "סיים" ends at any time with the same summary.
4. Every wrong answer is recorded like a wrong answer in the web quiz:
   `vocabulary_failed_words`, `vocabulary_word_scores` and the
   accumulated-fails counter that triggers the web app's review mode.

## Lesson exercises

The same questions, grading and points as the web lesson page, one question
per message.

| Command | What happens |
|---|---|
| "תרגיל אנגלית" / "תרגיל חשבון" (also תרגול…, תרגילים…, "תרגיל מתמטיקה") | the subject's next lesson (curriculum order) |
| "שיעורים אנגלית" / "שיעורים חשבון" | numbered lesson list, 10 per page, ✅ passed / ▶️ next; "עוד" / "הקודם" turn the page; the student sends a number |
| "תרגיל אנגלית 12" | lesson 12 of that list, directly |
| "תרגיל אנגלית קשה", "תרגיל חשבון 3 קל" | the same, at a chosen level (קל / בינוני / קשה) instead of the progress-based one |
| "?" (or "רמז") during a question | the question's hint and the same question; not an answer (no exercise has a hint yet, so it says there is none) |
| "סיים" | stops; nothing is recorded for a half-done lesson |

Commands are two words on purpose: a single word such as "חשבון" is also a
vocabulary answer ("account"). The bot calls `POST /api/bot/exercise/start`
(a subject, a subject and a list number, or a lesson id) and
`POST /api/bot/exercise/lessons` (a subject); the list's page turns and the
picked number go through `/api/bot/session/answer` like any answer.

1. The API picks 10 questions with `LessonService.getExercises` (the web's
   difficulty choice and option shuffle) and freezes them in the session
   (`bot_sessions`, `kind: exercise`).
2. A multiple-choice question lists its options as "1) …" with buttons 1..n
   (3 or 4 options). Only an option number is an answer; anything else
   repeats the question and records nothing. A fill-in question takes the
   text and removes the keyboard.
3. Each answer gets ✅ or ❌ with the right answer and the explanation.
4. After the last answer all answers go to `ExerciseService.submitExercise`:
   score, points (+1 right, −2 wrong, +3 at 70 or more), mistakes, progress
   and the next lesson are exactly the web's. The summary shows them with
   the level, and after a pass suggests the same lesson one level up
   ("תרגיל אנגלית 12 קשה").

Starting an exercise ends an open vocabulary session and the other way
round; `/api/bot/session/answer`, `end` and `status` route to the open
session's kind (`services/bot/sessionKinds.js`). Exercise answers never
touch the model.

## Architecture

```
Telegram ──webhook──► Cloud Run: english-trainer-bot (bot/, Python, Google ADK)
                          │  verifies X-Telegram-Bot-Api-Secret-Token
                          │  fast path: code / start / exercise / lesson-list / end words, answers while a session is active
                          │  otherwise: ADK LlmAgent (Gemini Flash on Vertex AI) with tools
                          ▼  every tool = one call to the trainer API with X-Bot-Key + chatId
                       Cloud Run: english-trainer-api  /api/bot/*  (backend/)
                          │  chat → student through telegram_links (one-time code from the web app)
                          │  word selection, answer matching, rounds, counters, rate limits
                          │  lesson exercises: questions, verdicts, grading through ExerciseService
                          │  a dictionary miss: one yes/no from Gemini (Vertex AI)
                          ▼
                       Firestore: bot_sessions, telegram_links, bot_usage (+ vocabulary_word_scores)
```

The bot never chooses words, keeps score or reports progress: every reply
text is built from the API's answer (`bot/app/replies.py`). Gemini has two
narrow jobs. In the bot, the ADK agent decides which tool a free-form
message needs. In the API, the answer judge gives a yes/no on a Hebrew
answer that missed the dictionary. Answers that match the dictionary never
touch the model.

### Answer judging (in the API)

`backend/src/services/bot/answerJudge.js`, called by `bot.service.js`:

1. The answer is compared with the dictionary as before.
2. On a miss, the answer is judged only if it is short Hebrew (Hebrew
   letters only, at most 40 characters) and the student has checks left
   today (`bot_usage.judges`, 100 per day, in a Firestore transaction).
3. One Gemini call: temperature 0, JSON `{"acceptable": bool}`, the answer
   fenced as data, no thinking, at most 30 output tokens, 8 second timeout.
4. Accepted counts as right (+1 point) and the reply also shows the
   dictionary translation; everything else counts as wrong.

Any failure (error, timeout, unparsable output, the daily cap) counts as
wrong, so the judge can only turn a wrong answer into a right one. Every
verdict is logged by the API (`answer judge english=… given=… acceptable=…`)
in the API service's Cloud Run logs. The API calls Vertex AI as its runtime
service account, which `infra/setup-bot.sh` gives `roles/aiplatform.user`.

| Piece | Where |
|---|---|
| Bot API (sessions, linking, limits) | `backend/src/routes/bot.routes.js`, `services/bot.service.js`, `services/bot/exerciseSession.js`, `services/bot/sessionKinds.js`, `middleware/botAuth.middleware.js`, `middleware/botLimits.middleware.js`, `utils/hebrewAnswer.js` |
| Student side of linking | `backend/src/routes/telegram.routes.js`, web page `/settings/telegram` |
| Agent, tools, replies, webhook | `bot/app/` (`agent.py`, `tools.py`, `replies.py`, `exercise_replies.py`, `coach.py`, `main.py`) |
| Cloud Run spec, secrets | `infra/cloudrun-bot.yaml`, `infra/setup-bot.sh`, `infra/set-webhook.sh` |
| Tests | `backend/tests/bot.test.js`, `backend/tests/botExercise.test.js`, `backend/tests/hebrewAnswer.test.js`, `bot/tests/` |
| Local end-to-end | `bot/scripts/smoke.py` |

## Security

- Every `/api/bot/*` request needs the shared key in `X-Bot-Key` (compared
  with a timing-safe check) and a `chatId`. Without the key: 401. Without a
  key configured on the API at all (production before setup): 503.
- A chat acts only as the student it is linked to. Linking: the student gets
  a 6-digit code on the web page (valid 10 minutes, single use, stored
  hashed), sends it to the bot, the bot calls `/api/bot/link`. An unlinked
  chat gets 403 and a Hebrew explanation. Unlinking is on the same page.
- The Telegram webhook accepts only requests carrying the secret token
  registered with `setWebhook` (403 otherwise).
- Secrets live in Secret Manager only: `telegram-bot-token`,
  `telegram-webhook-secret`, `bot-api-key`. None is ever in the repo, the
  board or a log. To rotate the bot key: `openssl rand -hex 32 | gcloud
  secrets versions add bot-api-key --data-file=-`, then redeploy both
  services (`git commit --allow-empty` is not needed: re-run the workflow).

## Budget caps

| Cap | Default | Where |
|---|---|---|
| Messages per chat per minute (API) | 60 | `BOT_CHAT_RATE_PER_MINUTE`, `infra/cloudrun-service.yaml` |
| Bot messages per student per day (API, durable) | 300 | `BOT_DAILY_MESSAGE_CAP` |
| Turns per chat per day (bot, in memory) | 400 | `MAX_TURNS_PER_CHAT_PER_DAY`, `infra/cloudrun-bot.yaml` |
| Model calls per turn | 4 | `MAX_LLM_CALLS_PER_TURN` |
| Output tokens per model reply | 200 | `MAX_OUTPUT_TOKENS` |
| Answer checks per student per day (API, durable) | 100 | `BOT_DAILY_JUDGE_CAP`, `infra/cloudrun-service.yaml` (`JUDGE_ANSWERS=false` turns checking off) |
| Output tokens and time per answer check | 30 tokens, 8 s | `JUDGE_MAX_OUTPUT_TOKENS`, `JUDGE_TIMEOUT_MS` |
| Conversation history kept for the model | 12 events | `HISTORY_EVENTS` |
| Bot instances × concurrency | 2 × 10, 30 s per request | `infra/cloudrun-bot.yaml` |
| API instances × concurrency | 3 × 80 | `infra/cloudrun-service.yaml` |
| Monthly budget alert (whole project) | 5 USD at 50/90/100 % | `infra/hardening.sh` |

When a cap is hit the student gets one short Hebrew message and nothing
else runs. Gemini is billed through Vertex AI in the same project, so the
budget alert covers it; the Vertex AI quota page can cap requests per
minute further.

## Setup (once)

1. In Telegram, ask [@BotFather](https://t.me/BotFather) for `/newbot`;
   keep the token private.
2. `infra/setup-bot.sh teacher-509909` (asks for the token, creates the
   three secrets, grants the runtime service account access and Vertex AI).
3. Add the GitHub repository variable `DEPLOY_BOT = true`. From then on the
   workflow deploys the bot service and gives the API its `BOT_API_KEY`.
4. After the first green deploy: `infra/set-webhook.sh teacher-509909`.
5. Put the bot's username in `frontend/.env.production` as
   `REACT_APP_TELEGRAM_BOT` so the web page links to it.
6. As a student: web app → "טלגרם" → code → send it to the bot → "מילים".

## Running locally

```
# API on the emulator (backend/), with a dev bot key
FIRESTORE_EMULATOR_HOST=127.0.0.1:8089 GCP_PROJECT_ID=demo-english-trainer JWT_SECRET=dev BOT_API_KEY=dev_bot_key PORT=5000 node src/server.js
# Bot (bot/)
uv venv .venv && uv pip install -r requirements-dev.txt
.venv/bin/python -m pytest -q
API_URL=http://127.0.0.1:5000/api BOT_API_KEY=dev_bot_key .venv/bin/python scripts/smoke.py
```

The smoke script registers a student, links a fake chat with a real code
and walks a short session through the fast path; it needs no Telegram and
no model. The agent path needs Gemini credentials
(`GOOGLE_GENAI_USE_VERTEXAI=TRUE` with Application Default Credentials, or
`GOOGLE_API_KEY`).

## Troubleshooting

- Bot answers "משהו השתבש אצלנו": the API is unreachable or returned 5xx.
  Check the API logs and that `bot-api-key` has the same value on both
  services (both read `latest`).
- Bot never answers: the webhook is not set or the secret differs. Re-run
  `infra/set-webhook.sh`; `getWebhookInfo` on the Bot API shows the last
  error.
- "הצ'אט הזה עדיין לא מחובר": the chat has no link; get a new code on the
  web page. Codes expire after 10 minutes.
- 503 from `/api/bot/*`: the API has no `BOT_API_KEY` (set `DEPLOY_BOT`
  and redeploy).
