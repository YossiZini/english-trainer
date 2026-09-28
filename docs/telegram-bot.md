# Telegram vocabulary bot

A student practises vocabulary from Telegram: the bot sends an English word,
the student answers in Hebrew, the bot says ✅ or ❌ (with the translation)
and sends the next word. After 20 words the failed ones come back, shuffled,
round after round, until none are left. "סיים" ends the session.

## Architecture

```
Telegram ──webhook──► Cloud Run: english-trainer-bot (bot/, Python, Google ADK)
                          │  verifies X-Telegram-Bot-Api-Secret-Token
                          │  fast path: code / start / end / answers while a session is active
                          │  otherwise: ADK LlmAgent (Gemini Flash on Vertex AI) with tools
                          ▼  every tool = one call to the trainer API with X-Bot-Key + chatId
                       Cloud Run: english-trainer-api  /api/bot/*  (backend/)
                          │  chat → student through telegram_links (one-time code from the web app)
                          │  word selection, answer matching, rounds, counters, rate limits
                          ▼
                       Firestore: bot_sessions, telegram_links, bot_usage (+ vocabulary_word_scores)
```

The model never chooses words, judges answers or reports progress: every
reply text is built from the API's answer (`bot/app/replies.py`). The agent
only decides which tool a free-form message needs and relays the tool's
reply. Inside an active session, answers do not touch the model at all
(`FAST_PATH_ANSWERS`), so the bill does not grow with the number of words.

| Piece | Where |
|---|---|
| Bot API (sessions, linking, limits) | `backend/src/routes/bot.routes.js`, `services/bot.service.js`, `middleware/botAuth.middleware.js`, `middleware/botLimits.middleware.js`, `utils/hebrewAnswer.js` |
| Student side of linking | `backend/src/routes/telegram.routes.js`, web page `/settings/telegram` |
| Agent, tools, replies, webhook | `bot/app/` (`agent.py`, `tools.py`, `replies.py`, `coach.py`, `main.py`) |
| Cloud Run spec, secrets | `infra/cloudrun-bot.yaml`, `infra/setup-bot.sh`, `infra/set-webhook.sh` |
| Tests | `backend/tests/bot.test.js`, `backend/tests/hebrewAnswer.test.js`, `bot/tests/` |
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
