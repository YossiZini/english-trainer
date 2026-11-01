# Working knowledge

Read at session start, with `retro.md` (binding rules). Only what a new
session cannot see elsewhere.

## After a container reset
- `backend/` and `frontend/`: `npm ci`.
- `bot/`: `uv venv .venv && uv pip install -p .venv/bin/python -r requirements-dev.txt`.
- No `gh` CLI: use the GitHub MCP tools (PRs; deploys via `actions_list`, `deploy.yml`).
- Off limits: production data (reads are denied; never work around it) and
  `GOOGLE_SERVICE_ACCOUNT_JSON` (another project).

## Run and check locally
- API on the emulator, from `backend/`:
  `npx firebase emulators:exec --only firestore --project demo-english-trainer --config ../firebase.json "JWT_SECRET=dev PORT=5000 GCP_PROJECT_ID=demo-english-trainer BOT_API_KEY=dev_bot_key node src/server.js"`.
  Stop it before `npm test` (same emulator).
- Tests: backend `npm test`; bot `.venv/bin/python -m pytest -q`; web
  `CI=true npx react-scripts test --watchAll=false` (`App.test.js` fails to
  load: known); build `CI=false npm run build`.
- Browser: Playwright from `frontend/node_modules`, Chromium at
  `/opt/pw-browsers/chromium`. `npm run check:viewport` serves the build on
  :3000 and proxies `/api`.
- Content: `npm run generate-data -- math`, then restart the API. Records of
  other topics must stay identical (compare by id).
- Math check scripts: `backend/scripts/checks/` (independent; one per topic).

## Known quirks
- `check:viewport` fails the laptop "at top" check here (navbar 69px, layout
  reserves 68px), on `main` too. Compare with a `main` build (git worktree,
  symlinked `node_modules`) before calling a regression.
- Hard math questions with a picture overflow the pinned bar (laptop, 360px
  phone): known, accepted by the owner.
- Right-to-left text: judge order by measuring (`Range.getClientRects`),
  never from a screenshot.

## Codebase facts
- Topic numbers: English 1+, math 100–199 (100 is chapter 1,
  `numberOffset` 99), Arabic 201+.
- Bot session kinds: vocab, exercise, review, drill (`sessionKinds.js`). A
  question type other than `multiple_choice` makes every message a typed
  answer (fast path, no model).
- A new bot command touches: `config.py`, `parse_command`/`run_command`,
  `COMMANDS` (pinned in `test_webhook.py`), HELP/NO_SESSION/LINKED, the agent
  tool and instruction, `TelegramLinkPage` and its test, `telegram-bot.md`,
  the system map.
- Shared helpers: `utils/bidi.ltr`, `utils/botWords.isEndCommand`.

## Workflow
- One branch. After a merge: `git fetch origin main && git checkout -B <branch> origin/main`.
- Every merge deploys (about 4 minutes); confirm the run is green.

## Open with the owner
- Alona's math reports (Firestore `question_reports`) and the two proposed
  review fixes. Next-sprint candidates: Sprint 15 follow-ups in `retro.md`.
