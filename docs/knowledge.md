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
- Reading texts: seed `seed-unseen-paragraphs.js`, then
  `npm run generate-data -- --unseen` (ids kept by English title); guide
  `backend/create-unseen.md`.
- Math check scripts: `backend/scripts/checks/` (independent; one per topic).
  Reading order on the real pages: `TOPICS=<n> node scripts/reading-order-check.js`
  in frontend/ (build + API); the Fractions chapter (101) breaks equations on
  phones (58 at 360/390 px, on `main` too): known, not yet fixed.

## Known quirks
- `check:viewport` fails the laptop "at top" check here (navbar 69px, layout
  reserves 68px), on `main` too. Compare with a `main` build (git worktree,
  symlinked `node_modules`) before calling a regression.
- Math questions whose explanation has a picture overflow the pinned bar once
  checked, at every level (chapters 9–10: up to ~180px on a laptop, ~200px
  at 360px): known; the owner accepted it for hard questions.
- Right-to-left text: judge order by measuring (`Range.getClientRects`),
  never from a screenshot. A bare "−1" in Hebrew text shows as "1−": isolate it.
- The API loads bundled content at startup: restart it after `generate-data`.

## Codebase facts
- Topic numbers: English 1+, math 100–199, Arabic 201+. Math chapters
  follow `MATH_CHAPTER_ORDER` (API) = `topicOrder` (web), not the number:
  100, 105 (Division), 101, 110 (decimals), 102–104, 106 (negatives), 107 (axes),
  108 (triangles), 109 (equations), 111 (ratio), 112 (linear functions).
- `question_picture`: only on questions that have one (keeps other records
  byte-identical); the API passes it, `QuestionPicture` shows it, the bot
  sends its PNG (`frontend/public/question-pictures/<hash>.png`; after
  changing a picture run `npm run question-pictures` in frontend/, or the
  backend test fails).
- Answer options sit in a left-to-right box (`MultipleChoice`), but their text is
  `dir="auto"`: a Hebrew-first option ("רק cacti", "3/4 הוא יותר משלם")
  reads right to left; Arabic options keep the right-to-left box (d12).
- Bot session kinds: vocab, exercise, review, drill (variant kefel or hiluk), unseen (`sessionKinds.js`). A
  question type other than `multiple_choice` makes every message a typed
  answer (fast path, no model). `BotSession.claimAnswer` takes an answer in a
  transaction (unseen on `index`, the words exam on `answered`). A words-exam
  word is four options (`wordOptions.js`, stored as `current_options`); its
  buttons carry the options' texts, so a bare word there is an answer, and
  "stop"/"end" are words of the list. For a minute after
  a last answer, `/session/status` says `justEnded` (the bot's double-tap rule).
- A new bot command touches: `config.py`, `parse_command`/`run_command`,
  `COMMANDS` (pinned in `test_webhook.py`), HELP/NO_SESSION/LINKED, the agent
  tool and instruction, `TelegramLinkPage` and its test, `telegram-bot.md`,
  the system map. A reply longer than ~200 tokens needs a direct tool
  (`tools._direct`); `Reply.before` sends messages ahead of the reply.
- Shared helpers: `utils/bidi.ltr`, `utils/botWords.isEndCommand`/`isHintCommand`,
  `utils/answers.parseOptionNumber`; bot side `exercise_replies.keep_ltr`.

## Workflow
- One branch. After a merge: `git fetch origin main && git checkout -B <branch> origin/main`.
- Every merge deploys (about 4 minutes); confirm the run is green.

## Open with the owner
- Alona's math reports (Firestore `question_reports`) and the two proposed
  review fixes. Next-sprint candidates: Sprint 15 follow-ups in `retro.md`.
