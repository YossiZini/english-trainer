# Retrospectives

Lessons from each sprint. Rules under "Lessons → rules" are binding for future
work in this repository (referenced from CLAUDE.md).

## Sprint 0 — Move to Google Cloud (2026-09-27)

### What went well
- The storage rewrite was contained: every model method was already `async`,
  so swapping the JSON store for Firestore touched models/services only, and
  the API smoke tests caught the response-shape assumptions immediately.
- Infra as code + keyless CI/CD from the first deploy: no keys anywhere, and
  every later change shipped by merging a PR.
- A live backlog with owner-tagged items kept the owner's manual steps
  (project, billing, variables, uploads) visible and unblocked in order.

### What hurt
- **Region probe bug.** `infra/setup.sh` "verified" region availability with a
  `gcloud … list | grep` that misread the output and silently fell back, so
  Firestore (whose location is permanent) landed in `europe-west1` instead of
  the requested `me-west1`.
- **IAM propagation race.** Role bindings right after creating a service
  account failed with "does not exist"; the script needed retries.
- **Transient Hosting release 500.** One deploy failed at the last step with
  an HTTP 500 from the Firebase Hosting release API after a successful
  upload; the workflow needed a retry loop.
- **Session limits discovered late.** The cloud session cannot reach
  `*.web.app`/`*.run.app`, cannot dispatch or re-run GitHub workflows, and
  cannot push git tags; each cost a round-trip to the owner.
- **Lockfiles missing / ignored.** `npm ci` needs a lockfile; both apps had
  none and the backend's `.gitignore` ignored it. The frontend lockfile also
  needed TypeScript pinned to 4.x for react-scripts.
- **Test-writing by assumption.** The first API tests guessed response shapes
  (lessons grouped by topic, quiz question fields, route paths) and failed
  three times before reading the controllers.

### Lessons → rules
- Never let a provisioning script fall back silently: take the region as an
  explicit argument, verify with a command whose output format is known, and
  fail loudly instead of substituting a default.
- Wrap IAM bindings on freshly created principals in a retry (up to ~60 s).
- Treat deploy steps against Google APIs as idempotent and retry them (3×).
- Before writing API tests, read the controller/service return shape; do not
  infer it from route names.
- Commit lockfiles for every package and never ignore them; CI uses `npm ci`.
- Anything that needs a URL the session cannot reach, a workflow dispatch, a
  re-run or a tag push is an owner action: put it on the board as `owner: you`
  with the exact command, instead of retrying from the session.
- Keep the `docs/topics-status.md` guide in sync with the tooling it names
  (it still pointed at a deleted seed script until the docs refresh).

### Follow-ups
- Topics 16–18 (Going to, Future Simple, Comparatives) are documented and in
  the frontend but have no seed files.
- The `withTransaction` sections are sequential, not atomic; if double-submit
  bugs appear, restructure the flows so reads precede writes and use real
  Firestore transactions.
- Artifact Registry keeps every image; add a cleanup policy if storage grows
  past the free 0.5 GB.

## Sprint 1 — Exercise page without scrolling (2026-09-27)

### What went well
- Three clarifying questions at `/sprint start` turned "the onlive view" into
  a precise scope (Exercise page, pinned bottom bar, scroll to question) before
  any code was written; nothing had to be re-planned.
- Measurement drove the layout: a Playwright check reported exact overflow in
  pixels per question and viewport, so each CSS change was judged by numbers
  and screenshots, not by eye. It became `npm run check:viewport`.
- `/sprint review` caught six real defects before merge (StrictMode scroll on
  load, the cross test missing the phone clamp, notch/`100vh` sizing, hardcoded
  navbar height, 360px label overflow, an unsafe static server in the check).
- Review follow-ups reduced coupling: `ExerciseActionBar`,
  `ExerciseFeedback` and `useScrollToQuestion` are shared by both pages
  instead of copied.

### What hurt
- **Global CSS collisions.** The first layout pass still overflowed and
  multiple-choice text rendered in monospace. Cause: all 36 component
  stylesheets are global, and vocabulary, unseen, mistakes and results pages
  define `.option`, `.question-text`, `.feedback-*`, `.nav-button` and
  `.question-dots`, so import order decided the styling. Took several rounds
  to find.
- **Built on a merge that had not happened.** On "merged PR #4" the session
  pushed the sprint commit onto the work branch without checking; PR #4 was
  still open, so its branch was overwritten and had to be restored. Cause: the
  user's statement was taken as fact instead of verifying `origin/main` or the
  PR state first.
- **Sprint work queued behind an open PR.** A single work branch meant the
  sprint could not be pushed while PR #4 was open; the work waited on local
  branches and was cherry-picked twice.
- **Check-script rework.** The first automated runs failed for setup reasons:
  the app needs both `token` and `user` in localStorage, and the proxied API
  rejected the browser's Origin under CORS. Cause: the auth and routing
  contract was assumed rather than read.
- **Wrong metric first.** `scrollHeight <= innerHeight` cannot express "fits
  above a pinned bar", and the sticky navbar adds its own height. Two runs
  were spent on a metric that could not pass.
- **Random question order.** A one-question check passed or failed depending
  on whether a fill-in or a multiple-choice question came up first.

### Lessons → rules
- Verify a claimed merge or deploy from the source (`git fetch` +
  `origin/main`, or the PR's state) before building on it; never push new
  work onto the branch of a PR that is still open.
- Style every component under its own root class (or a CSS Module); never add
  or change rules on generic class names like `.option` or `.feedback-message`
  at the global level.
- UI acceptance checks walk enough samples to cover every variant the page can
  render (question types, lengths, sizes incl. 360px); one render proves
  nothing.
- Before automating a UI flow, read how the app establishes its session
  (`AuthContext`, localStorage keys) and route API calls the way production
  does (Hosting rewrite: same origin).
- Define layout metrics from the design being tested (content bottom vs. the
  pinned bar's top), not from generic page scroll.
- Read shared dimensions (like the navbar height) from one CSS variable;
  never hardcode another component's size.

### Follow-ups
- Migrate component styles to CSS Modules, starting with the pages that
  collide today (vocabulary, unseen, mistakes, results).
- Extract a `useExerciseSession` hook: ExercisePage and CrossTestPage still
  share ~136 identical lines of answer/check/next/submit and keyboard logic.
- Run `npm run check:viewport` in CI (needs Chromium and the Firestore
  emulator in the job).
- Screenshot-verify the cross-test page (needs seeded mistakes) and fix the
  two pre-existing `react-hooks/exhaustive-deps` warnings.

## Sprint 2 — Math tab: fractions, order of operations, average, percentage (2026-09-27)

### What went well
- **Every answer verified by code before commit.** Each topic had a small
  check script (exact-fraction arithmetic, an expression evaluator, average
  and percentage arithmetic) run against the seed; the review found no
  content errors in 120 exercises.
- **English content untouched.** The generator rebuilds one subject at a time
  and merges by natural key, so `exercises.json` stayed byte-identical while
  Math was added; ids and timestamps survived every regeneration.
- **Seeds as plain modules with tiny helpers.** `math-helpers.js` (`ltr`,
  `expr`, `mc`, `fib`) kept four topics consistent and made the check scripts
  trivial; bidi isolates (U+2066/U+2069) solved Hebrew text with LTR math in
  plain question strings.
- **Screenshots before the PR caught three visible problems** (reversed
  examples on the index, `101.1` labels, sessions padded to 10 questions)
  that no test would have.
- **Review earned its keep**: three real defects (Math results navigating to
  English, subject switch keeping stale state, duplicated number logic) fixed
  and merged within the sprint.
- **`/defect` added and used the same day**; two phone-reported defects were
  fixed in one PR with the log updated.

### What hurt
- **Planned 8 exercises per level; the engine serves 10.** Sessions were
  padded with questions from other levels until a screenshot showed
  "שאלה 1 מתוך 10". Cause: the plan sized content without reading
  `lesson.service.getExercises`.
- **Stale content in the running API.** After regenerating JSON the
  screenshots still showed old questions (and a hard question under "easy")
  because `StaticStore` loads once at startup. One round of confusion.
- **Escape layers.** Writing `⁦` through a bash heredoc produced the
  literal characters, so two later text replacements silently matched
  nothing and `expr` was "not defined" twice.
- **`npm test` collided with the background emulator** on port 8089, twice.
- **A default parameter hid four wrong callers.** `getNextLesson(orderIndex,
  subject = 'english')` compiled fine while `exercise.service` never passed
  the subject; only the review noticed.
- **Navbar switch bug invisible to direct-load screenshots.** `/topics` and
  `/math` share one component instance; every check loaded a URL directly,
  so the stale expanded-topic state was never exercised.
- **Work queued behind open PRs again** (defect fixes waited for PR #9, the
  retro for PR #12) because the session has one designated branch.
- **Deployed fix not visible on the phone**: Hosting caches rewritten routes
  for an hour (`no-cache` is set only on `/index.html`).
- **Board typo**: `startedAt` was written as 2026-09-28 and the archive
  printed the period backwards until corrected by hand.

### Lessons → rules
- Before sizing content, read the code that consumes it (session size,
  padding, shuffling) and write the acceptance criteria from that code.
- Restart the API after `npm run generate-data` and before any screenshot or
  manual check; bundled content is loaded once at startup.
- When a lookup gains a discriminating argument (subject, level), take the
  whole object instead of adding a defaulted parameter, and update every
  caller in the same commit (`grep` the function name).
- UI checks must include the in-app navigation between pages that share a
  component (navbar switches, back links), not only direct URL loads.
- Write files containing escapes or non-ASCII with the Write tool; never via
  a bash heredoc plus a later text replacement.
- Stop the background emulator and API before `npm test`; the test script
  starts its own emulator on the same port.
- Dates written to the board come from `date -I`, not from memory.

### Follow-ups
- Hosting: serve every non-`/static/**` path with `Cache-Control: no-cache`
  so a merge is visible on the next reload (log as a defect).
- Convert the English seeds to plain modules and delete the `eval`-based
  parser (`evaluateLessonsData`, `extractLessonsFromFile`, `parseExercises`).
- Give `Lesson` a `byId()` map helper; services and models read
  `db.getCollection('lessons')` directly in seven places.
- Move subject-specific routes and back-link labels into `topicMeta`
  (`ExercisePage`, `LearningPage` still branch on `subject === 'math'`).
- Allow a second work branch per session (or merge small PRs promptly) so
  defect fixes and sprint close-out do not wait on each other.

## Sprint 3 — Fractions: subtopics, visual explanations, book-style notation (2026-09-27)

### What went well
- **Answers computed, never typed.** `rat.js` (exact rationals, unit-tested)
  produced every Fractions answer and a second, independent evaluator
  re-checked all 180; the only wrong answer key was caught by re-reading
  before commit. The same script later verified all 270 options.
- **One renderer for notation.** `MathText` plus the seed-level
  `stackFractions` turned every `a/b` into textbook notation in one sprint,
  with no change to how content is written.
- **Pictures as pure functions.** `math-svg.js` and `pictures.js` return
  strings, so explanation pictures were attached automatically from the
  question's shape; 74 of 180 questions got one without hand work.
- **Scope changes absorbed in the sprint** (explanation pictures, multiple
  choice only) because each landed as a story with its own PR the same day.
- **Screenshots caught what tests cannot**: reversed captions, fractions next
  to a list comma not stacked, pictures overflowing the pinned bar on phones,
  weak integer distractors.

### What hurt
- **A broken seed silently deleted its subject.** A mangled `require` line
  made the generator skip the Math seed and write the JSON without Math;
  the next run minted new lesson ids that would have orphaned progress.
  Cause: `catch` + `console.error` around seed loading. Fixed: it throws.
- **Escape layers again.** A heredoc wrote the isolate characters literally,
  so the next `str.replace` matched nothing (rule from Sprint 2 not
  followed: the Write tool was used later, the heredoc first).
- **Serial PRs blocked defect fixes twice more** (d3 waited on PR #14, the
  visuals on PR #15); one fix rode along in a sprint PR to unblock.
- **Value-equal options.** Multiple choice compares by value on the server,
  so a wrong option `18/24` next to answer `3/4` would be marked correct.
  Six hand-written questions had this or an accidental duplicate; only the
  check script exposed it.
- **RTL surprises in SVG**: text inside `<svg>` inherited RTL and reversed
  "1 1/4"; captions with two isolates reversed; the number-line labels were
  converted to HTML inside the SVG. Each cost a render round.
- **Board typo at start** (`startedAt` a day ahead) repeated Sprint 2's.

### Lessons → rules
- Content loaders never swallow errors: a seed or data file that fails to
  load aborts the run (ids are derived from the previous output).
- A wrong option must differ from the answer **by value**, and the check
  script asserts it, because answers are compared by value.
- Inline SVG gets `direction="ltr"` on the root and stays free of HTML
  post-processing; captions with mixed text use `dir="auto"`.
- Every content transform (notation, pictures, multiple choice) runs at seed
  export in one `finish*` function, so authors write plain data and one place
  owns the pipeline.
- Ask for the merge of a small PR before starting the next change that
  needs the branch, instead of stacking local branches.

### Follow-ups
- Laptop: four stacked-fraction options plus feedback slightly exceed the
  space above the pinned bar (`.option` padding when it holds a fraction).
- Pictures for the remaining 106 Fractions questions (reverse questions,
  three-way ordering) and for topics 102–104.
- Hosting `no-cache` on rewritten routes (still pending from Sprint 2).
- Convert the English seeds to plain modules and drop the `eval` parser.

## Sprint 4 — Animated Fractions lessons (2026-09-28)

### What went well
- **A reference to copy from.** The user's artifact fixed the player's shape
  (tabs, stage, caption, controls, dots) before any code; the React version
  matched it on the first render and the two reference scenes ported 1:1.
- **Scenes as data, player as code.** Six scene files, one registry entry
  each, zero player changes after the first commit; 30 scenes / 71 steps
  written in one sitting because every step is `{ caption, draw }`.
- **The walk script found nothing the tests could not, and proved it**: 142
  steps at two sizes, every run, before every commit.
- **Review on my own PR paid off**: five real findings (a drawing that showed
  3/4 while the caption said 5/4; captions ending "4 1/4." left flat; the
  walk script un-pausing on phones; space on a button toggling play; a
  duplicated arrow marker), all fixed in one commit.
- **Reduced motion and phones** were designed in, not patched on: the player
  starts paused on narrow screens.

### What hurt
- **Pushed onto a branch whose PR had already merged, twice.** PR #19 (the
  archive) merged at 06:08; the animation push went to the same branch
  minutes later believing #19 was open, and #19 was retitled. Then the
  review fixes were pushed at 06:22, five minutes after PR #20 had merged.
  Both times the commits sat in no PR until the next command noticed.
  Cause: the merge state was checked once, earlier, not at push time; the
  user merges within minutes, so any check older than the push is stale.
- **A leaked test mock.** Overriding `window.matchMedia` in one test broke
  the auto-advance test that runs after it; one green commit followed by a
  red one.
- **A slide without an offset**: the 1.6 sum step looked plausible in the
  screenshot review because the parts overlapped exactly; only reading the
  code against the caption exposed it.
- **Regex again**: the period exclusion added in Sprint 3 for decimals was
  broader than needed and hit 32 captions.

### Lessons → rules
- Re-check a PR's merge state immediately before every push to its branch;
  a merged PR's branch gets a fresh PR, never a retitle.
- A test that overrides a global (`matchMedia`, timers, `location`) restores
  it in `finally`; new tests are run together with the whole file, not alone.
- For every animation step, compare the caption's numbers with the drawing's
  numbers (parts, fills, offsets) before screenshots; a picture can look right
  and be wrong.
- Character-class exclusions in text patterns are the minimum that the
  counter-example needs (`[.,]\d`, not `.`), with a test for the sentence end.

### Follow-ups
- Share the stage geometry and palette between `math-svg.js` (theory
  pictures) and `primitives.jsx` (animation stage) before a third consumer.
- Per-scene stage height to remove the empty band on laptops.
- Animated lessons for topics 2–4 (order of operations, average,
  percentage) once the Fractions player has been used by a student.
- The Hosting `no-cache` header for rewritten routes is still pending.

## Sprint 5 — animated lessons for order of operations, average, percentage (2026-09-28)

Goal: extend the Sprint 4 step player to the other three Math topics.
Result: 15 scenes / 43 steps (PR #23), four new stage primitives with unit
tests, a test that renders every registered step, six stories closed in one
session.

### What went well
- **Primitives first, scenes second.** Building `Expr`, `BarChart`,
  `HundredGrid` and `PriceTag` with tests before any scene made the three
  scene files mostly data; no primitive changed shape once the scenes used it.
- **A render test over the registry** (`index.test.js`) catches a broken
  scene file or a missing import at unit-test speed, before the browser walk.
- **Screenshot every step, not just the first.** `SHOT_STEPS=all` showed two
  things the first-step screenshots hid: a meaningless "0" label on the
  missing-score bar and phone labels too small to read. Both fixed before
  the PR.
- **The merged-PR rule held.** The push was withheld while PR #22 was open
  and re-checked at push time, as the Sprint 4 rule demands.

### What hurt
- **The push still landed outside a PR.** The user merged PR #22 in the
  minute between the re-check and the push, so the two commits sat on the
  merged branch until a new PR (#23) was opened for them. The rule from
  Sprint 4 was followed and was still not enough: a check and a push are two
  separate moments.
- **`App.test.js` cannot load in this environment** (`react-router/dom`
  unresolved under jest), so "27 passing" hides one suite that never ran.
  Nobody looked at it until the full suite was run at the end.
- **No image tooling for contact sheets.** Reviewing 86 screenshots one by
  one cost more time than the walk itself.

### Lessons → rules
- After every push, read the branch's PR state again: if the PR it was meant
  for has merged, open a new PR for the pushed commits at once; never leave
  commits on a branch with no open PR.
- Run the whole frontend test suite once per sprint and record every suite
  that fails to load, with its cause, in the PR body; a green count with a
  failed suite is not green.
- For every animated lesson, screenshot every step (`SHOT_STEPS=all`) at
  both viewports before the PR, and look at the phone screenshots for label
  size, not only for overflow.
- A chart or drawing never shows a placeholder number for an unknown value;
  the primitive takes `null` and draws nothing there.

### Follow-ups
- Fix `App.test.js` module resolution (`react-router/dom` under jest) so the
  suite runs in CI.
- Share the stage geometry and palette between `math-svg.js` and
  `primitives.jsx` (carried over from Sprint 4).
- Per-scene stage height (closed as not needed this sprint; revisit if a
  scene outgrows 640×280).
- The Hosting `no-cache` header for rewritten routes is still pending.

## Sprint 6 — Telegram vocabulary bot on a secured API (2026-09-28)

Goal: let a student practise vocabulary from Telegram through a Google ADK
agent, on authenticated API endpoints, under hard budget limits.
Result: bot API (sessions, chat linking, key auth, rate limits), a web
linking page, the ADK bot service on Cloud Run with caps, setup scripts and
docs (PRs #26, #27, #28), then setup questions, points and the fail counter
added at the user's request (#29). The user ran the setup and confirmed the
bot works end to end.

### What went well
- **Exploring before planning changed the design.** The exploration found
  that the web quiz checks answers by option id and keeps no word list per
  session, so the bot got its own session API instead of bending the web
  quiz.
- **The model only routes.** Word choice, answer checking, rounds, points
  and every counter live in the API; replies are built from API data. Inside
  a session no message reaches the model, so the bill does not grow with the
  number of words.
- **Safe to merge before the secrets existed.** The bot deploy and the API's
  key were gated on the `DEPLOY_BOT` variable, and the API answers 503
  without a key, so merging #26 early broke nothing.
- **Secrets never passed through the session.** The token was typed into a
  script with hidden input and went straight to Secret Manager; nothing
  secret is in the repo, the board or the chat.
- **The smoke script** walked a real session against the emulator-backed API
  without Telegram or a model, and showed the conversation text before the
  user saw it.
- **The open-PR push rule held** three times (#25, #28, #29 open on the
  branch): new commits waited instead of landing in the wrong PR.

### What hurt
- **Main went red after #26.** The session test drew 20 random easy words
  and failed only when it drew one of five whose stored translation lists
  two forms (`כוס / זכוכית`) or a note in parentheses; the matcher did not
  accept the entry typed exactly as stored. Local runs passed by chance, so
  the bug reached `main` and its deploy was skipped.
- **Requirements pinned from memory.** The first `requirements.txt` named a
  FastAPI version that conflicts with google-adk; only a clean install on
  Python 3.12 caught it.
- **Two paths never ran in the session**: the container build (no docker
  daemon) and the model path (no Gemini credentials). CI and the user's
  test covered them afterwards; the session could not.
- **The user's setup stalled three times**: scripts run before the PR that
  adds them had merged, a missing argument answered by bash's cryptic
  `${1:?}` message, and a Mac network that blocks `api.telegram.org`.
- **A one-line PR blocked the next story.** The bot-username PR (#28) sat
  open on the shared branch while the setup-questions work waited to be
  pushed.
- **A test assumed the data instead of querying it.** "Band III has no easy
  words" was false because combined sources (`band22,band33july18`) belong
  to both bands.

### Lessons → rules
- A test that samples random content is backed by a unit test over the whole
  content set (for the matcher: every stored translation matches itself), and
  is run at least three times before the push.
- Pin dependency versions from the resolved environment (`uv pip freeze`,
  `npm ls`), never from memory, and install the pinned file cleanly once.
- Owner steps are handed over with a check after each one (`ls infra` shows
  the script) and name the PR that must be merged first; a script that calls
  an outside API also gets a Cloud Shell alternative.
- Owner scripts print a plain usage line and exit when an argument is
  missing; never rely on `${1:?}` for a person-facing message.
- A small follow-up that is not urgent rides in the next PR instead of
  opening its own PR on the shared branch (refines "ask for the merge of a
  small PR").
- Test assumptions about content (counts per band, level or source) come
  from a query over the data file, including combined values.

### Follow-ups
- Exercise the agent path (free-form messages through Gemini) against
  production once per release; it has no automated test with a real model.
- `BotSession.findOpenByChat` reads every session of a chat and filters in
  memory; query by status or expire old sessions before chats grow long.
- The per-chat rate window and the turn counter are per instance (up to 2);
  the durable cap is the API's daily counter. Revisit if more instances run.
- `/sprint review` has not run for this sprint.
- Carried over: `App.test.js` jest resolution, Hosting `no-cache` header,
  shared stage geometry.

## Sprint 7 — Home page for both subjects (2026-09-28)

Goal: make the home page serve English and Math equally.
Result: a continue card per subject, shared scores kept, a progress bar per
subject, subject badges on recent activity, English tools moved to the
English page and Math tools on the Math page, and per-subject progress data
in the API (PR #34). The browser check found three real bugs on the way,
all fixed in the same PR.

Addendum to Sprint 6 (work after its retro): the Gemini answer check moved
from the bot into the API so the API owns every verdict; the system map got
its source in `docs/architecture/` and a keep-current rule in CLAUDE.md;
"?" returns a word's example sentence.

### What went well
- **Scoping from the code, not the request.** Reading the dashboard and its
  queries before writing the scope showed that Math could never appear in
  the old continue button (Math is ordered after all 106 English lessons),
  which made the case for per-subject data in the API.
- **A browser check with seeded data paid off three times.** A student with
  English and Math results, clicked through at both sizes, exposed the
  English lesson-order bug, two CSS collisions and a clipped logout button.
  Unit tests passed through all three.
- **Logic out of JSX.** The continue rule moved from an inline function into
  `continueTarget.js` with its own tests; subject actions live in
  `topicMeta`, not in `if (subject)` branches.
- **Deploy-window safety.** The API kept its old fields, so the site that
  was live while the new API deployed kept working.

### What hurt
- **English `order_index` is per topic.** Every English topic numbers its
  lessons 1, 2, 3, so sorting by `order_index` interleaves topics (1.1,
  2.1, 3.1…). The old home button had the bug; tests only checked Math,
  whose `order_index` is global. The lesson page's own "next lesson" still
  uses it.
- **Generic class names in markup, again.** The existing rule forbids adding
  CSS rules on generic names; this time the markup used `english`, `math`
  and `progress-header`, and other pages' global rules restyled them.
- **A Sprint 6 regression shipped unseen.** The Telegram navbar button
  pushed logout off a 360 px screen. The Sprint 6 phone screenshot showed
  it cut, and the check passed because the navbar hides its overflow, so
  there was no page scroll to detect.
- **The next sprint's push waited on the previous sprint's archive PR**
  (#33), as in Sprints 5 and 6.
- **CRA resets mock implementations before each test**; a mock defined in
  the `jest.mock` factory returned undefined and the first run failed.

### Lessons → rules
- Order lessons with `compareLessons` (topic, then subtopic); never sort
  lessons by `order_index` alone.
- Class names in markup carry a component prefix (`home-progress-card`,
  `subject-math`); never put a bare generic name like `english`, `math` or
  `progress-header` in `className` (refines the Sprint 1 CSS rule).
- Phone checks assert that every visible navbar control lies fully inside
  the viewport (bounding box), in addition to "no horizontal scroll".
- `/sprint start` first asks for the merge of any open PR on the work
  branch, so the new sprint's first push is never blocked (refines "ask for
  the merge of a small PR").
- In CRA tests, set mock implementations in `beforeEach`, not in the
  `jest.mock` factory.

### Follow-ups
- Lesson page navigation (`Lesson.getNextLesson` / `getPreviousLesson`)
  still sorts by `order_index`; switch it to `compareLessons`.
- `App.test.js` still cannot load `react-router/dom` under jest.
- Carried over: Hosting `no-cache` header, shared stage geometry, agent-path
  check against production once per release.

## Sprint 8 — Lesson exercises in the Telegram bot (2026-09-28)

Goal: let a student do a lesson's exercises from the Telegram bot, English
or Math, with answers by number.
Result: all six stories in PR #38 (next lesson, numbered lesson list, direct
"lesson N", "?" hint, chosen level), graded by the same service as the web.
Two follow-ups during the sprint: English commands and a Hebrew `/help`
(PR #39), then every question in every topic multiple choice (PR #40): 950
English fill-in questions converted and reviewed, 16 keys, 100 explanations
and 28 older questions repaired, exact grading of chosen options, Hebrew-
first questions shown in reading order, and the bot setting its own command
menu. All three deploys green.

### What went well
- **One grader for web and bot.** The bot's exercise session ends in
  `ExerciseService.submitExercise`, so score, points, mistakes and progress
  match the web by construction; the test asserts 9/10 → 90 → +10 points.
- **The API owns the state.** A session `kind` routes answers to the
  vocabulary or the exercise service; the bot only builds text from API data,
  so vocabulary sessions did not change.
- **Content at scale with a brief, a validator and a second reviewer.** Five
  agents converted 950 questions against one written brief; a script checked
  every option mechanically; five fresh agents reviewed every question and a
  final read covered all 950. The review surfaced far more old faults than
  new ones (wrong keys, explanations calling correct English a mistake).
- **Invariants became a test.** `content.test.js` (every exercise multiple
  choice, 3–4 distinct options, exactly one accepted) found the twelve
  capitalisation questions that accepted every option on its first run.
- **Diffing the store before committing.** A script confirmed that only the
  intended fields of the intended 978 exercises changed; ids, order and Math
  untouched.
- **Baseline before blame.** Running the viewport check on the old content
  showed most overflow was pre-existing, so only the one real regression
  (four two-line options) was fixed.

### What hurt
- **Hebrew command words were also answers.** "די", "מילה" and "משפט" are
  translations, so a vocabulary answer could end or restart the session;
  the words were picked in Sprint 6 without checking them against the
  vocabulary. English commands (PR #39) removed the class of bug.
- **One comparison rule for typed and chosen answers.** Case-insensitive
  matching, right for typed text, made "i like pizza" / "I like pizza"
  options all correct; nothing tested content invariants until this sprint.
- **The English content had never been reviewed.** 16 wrong keys, 100 false
  explanations, duplicated options and "wrong" options that are correct in
  British or American English had shipped since the content was generated.
- **A manual deploy step on the owner's laptop.** Setting the Telegram menu
  needed a script that the office network blocked (api.telegram.org) and a
  Cloud Shell without `gcloud auth login`; several phone round trips before
  the bot took the step over at startup.
- **The conversion brief missed patterns** (hints that print the answer, a
  second blank inside parentheses, false explanations); it was extended
  while agents ran, and one reviewer had to be messaged the new rule.
- **English-lesson text was forced left-to-right**, so questions starting in
  Hebrew showed their Hebrew words in reverse order; screenshots of the
  converted questions exposed it.
- **A scripted edit sliced between `index()` hits of a non-unique anchor**
  ("LINKED" inside "NOT_LINKED") and cut three constants; the tests caught it.

### Lessons → rules
- A chosen option is graded by exact text (`choiceMatches`); lenient
  comparison is only for typed answers.
- A wrong option must be wrong in its sentence in both British and American
  English, not only differ by value; when two forms are acceptable, keep the
  other out of the options and let the explanation say it is also right
  (refines the Sprint 3 option rule; `content.test.js` guards the format).
- Bot commands are English words (the "/" optional); never a word that can
  be an answer in any session kind.
- A step the deployed service can do for itself (menus, registrations) runs
  at its startup, best effort; never as a script on the owner's machine.
- Before briefing agents on content, read a sample of every topic the brief
  covers; when a new pattern appears, update the brief file and message the
  agents already running.
- Run a UI check on `main` first and report only the difference as a
  regression (refines "UI acceptance checks walk enough samples").
- Mixed Hebrew/English text takes its direction from its first letter and
  isolates embedded runs (`<bdi>`, `utils/bidi.js`); check one Hebrew-first
  and one English-first sample in screenshots.
- Scripted edits assert that every anchor occurs exactly once before
  replacing.

### Follow-ups
- d6: audit the ~1,200 older English multiple-choice questions the same way
  (the reviewers found 23 flawed ones while reading nearby lessons).
- Hard lessons overflow the 360 px layout (long explanations, sentence-long
  options); add the heavy lessons to `check:viewport` (`LESSONS`,
  `DIFFICULTY`) and decide on a compact layout or shorter explanations.
- The English seed files still hold `fill_in_blank` exercises; the JSON is
  the English store, so a rebuild from seeds would undo the conversion.
  Convert or retire the English seeds (open since Sprint 2).
- `FillInBlank` is unused now; keep it for a future typed mode or remove it.
- Carried over: `App.test.js` under jest, Hosting `no-cache` header, shared
  stage geometry.

## Sprint 9 — Two-way words exam in the Telegram bot (2026-09-29)

Goal: let a student take the Telegram words exam English→Hebrew or
Hebrew→English, chosen with buttons, and repeat the same words the other
way round at the end.
Result: all four stories in PR #43 (direction step, English answer matching,
judge per direction, blanked example sentence, switch endpoint and button,
docs and system map v8), merged and deployed the same morning. Between
Sprint 8 and this sprint, defect d6 audited the 1,178 older English
multiple-choice questions (PR #42: 380 fixed, 798 confirmed); its lessons
are recorded here too. `/sprint review` was not run: the sprint closed
right after the merge.

### What went well
- **Small sprint, one PR.** The design reused what existed: the setup step
  of the session, the reply keyboard for choices, and the API owning all
  state, so the bot change was reply text and one new command.
- **The smoke run caught a data gap before users did.** Walking a real
  Hebrew→English exam against the emulator showed "no example sentence"
  for every word; the fix (blank the answer in the English sentence) went
  in before the PR.
- **A typo rule with a guard.** One wrong letter is forgiven, but not when
  the result is another stored word ("horse" for "house"), so tolerance
  cannot turn a wrong word into a right one.
- **d6: the same method as the conversion held up at scale.** Auditor,
  independent reviewer, then a full read of every change; a validator made
  every decision explicit (`ok` or a justified change), and a sweep applied
  the audit's findings to 6 sibling questions outside the audit set.
- **Stopped agents lost nothing.** A usage limit stopped five agents
  mid-run; they wrote their output only at the end, so each was resumed
  from its transcript with one message.

### What hurt
- **The plan assumed data that did not exist.** Scope and code used
  `sentence_he` for the Hebrew→English hint; 0 of 3,287 words have one.
  Nobody counted the field before planning.
- **A wrong acceptance criterion.** "Existing bot tests pass unchanged"
  could not hold: a new mandatory setup step changes every words flow, so
  every existing flow test needed the extra answer.
- **Tests coupled through today's usage.** The new judge test failed
  because an earlier test had filled the student's daily judge cap.
- **d6 found option texts that break under shuffling** ("the first two
  answers are correct") and capitalisation keys that were the only
  capitalised option; neither was covered by the content test.
- **Review skipped.** Closing straight after the merge left the sprint's
  code without the review lens (coupling, dependencies, duplication).

### Lessons → rules
- Before planning a feature on existing data, count the fields it relies
  on (for example `sentence_he`: 0 of 3,287) and plan from the counts.
- A new mandatory step in a flow is a behaviour change: the acceptance
  criteria name the existing tests that change and how; never promise
  "tests unchanged" for it.
- A test that depends on a daily cap or counter resets it itself; never
  rely on test order.
- A multiple-choice option never refers to other options' positions or
  order (options are shuffled); a meta option names its content, and
  options that differ only in capitals are written in one case unless the
  question is about capitals.
- Tolerant answer matching (typos, variants) is checked against the word
  list, so a variant that is another real word is never accepted.
- Long agent batches write their output only when done; after an
  interruption, check which outputs exist and resume every stopped agent
  from its transcript before starting new ones.
- Run `/sprint review` before `/sprint close`; if the user closes first,
  review the merged range as the first follow-up.

### Follow-ups
- Review the Sprint 9 range (`2a30a47...32b230a`) with the review lens.
- 511 words have an example sentence that cannot be blanked (irregular
  forms such as bought/buy); add Hebrew example sentences or a form list.
- Add a content-test rule: no option text refers to option positions
  ("הראשונות", "first two", "1 ו-2").
- The web vocabulary quiz is English→Hebrew only (deferred from this sprint).
- Carried over from Sprint 8: heavy lessons in `check:viewport`, English
  seeds still `fill_in_blank`, unused `FillInBlank`, `App.test.js`, Hosting
  `no-cache` header, shared stage geometry.

## Sprint 10 — Students report bad questions and words (2026-09-29 → 2026-09-30)

Goal: let a student report a bad question from the website or the Telegram
bot, hide it until it is reviewed, and review it (keep, change, remove) in
Telegram with a review agent on Gemini Pro.
Result: 10 stories in PRs #45–#49, all merged and deployed green. Questions
and words can be reported on the web and in the bot; a report hides the
item; `/review_manual` and `/review_auto` review both through one queue. Mid
sprint the owner opened review to every linked student (no admin role),
with a daily cap per student. Also shipped: 💡 instead of ❌ / ✗ for a wrong
answer in the bot and on the site. `/sprint review` was not run; a
`/code-review` of the word-report branch found 4 issues, all fixed in #48.

### What went well
- **A layer, not content edits.** Review decisions live in
  `question_overrides` / `word_overrides` over the bundled JSON, read by
  the models only, so a decision is live at once without a redeploy, and
  words reused the same store (`overrideStore`) with one line.
- **Validation in the API, whoever decides.** Every change is checked
  server-side, so opening review from one admin to every student needed
  only a cap, not a redesign.
- **The bot stayed stateless.** A review is a bot session of kind `review`
  in the API; the bot keeps nothing between messages, and auto mode works
  in time-boxed rounds that fit Telegram's webhook.
- **Graceful failure for the unverified model.** The model ID could not be
  checked from the session; if the agent fails, manual review still offers
  keep / remove / skip.
- **A code review before the next change caught real gaps** (unfixable
  report reasons, an API call on every `/help`, a stale Hebrew sentence).

### What hurt
- **The access model changed four times.** Claude Code review with a new
  IAM role (the owner questioned it, and Cloud Shell on mobile kept
  dropping), then a Telegram admin by name, then an admin-only menu, then
  review for every student. Who may review, how they find it and what it
  costs were not decided before building.
- **A hidden command looked like a missing feature.** `/review` was left
  out of the menu on purpose; the owner could not find it, which cost two
  rounds (an admin-chat menu, then a menu for everyone).
- **Report reasons with no fix path.** The web's "another option is right
  too" and Hebrew→English "my answer is right too" offered reasons no
  review decision could fix; found only by the code review.
- **A hot-path API call.** `/help` gained an admin check that counted
  against every student's message caps.
- **Tooling slips.** `pkill -f "firebase emulators"` matched its own shell
  (exit 144, the commit did not run); a build left over from a `git stash`
  comparison made a screenshot run time out; the GitHub connector and git
  credentials returned 503 for a while, so one PR was opened by the owner
  from a compare link.
- **No live check possible.** The session cannot reach the live site or
  Telegram, so "deployed" was proved from CI job steps only, and the first
  real Gemini Pro call is still untested.

### Lessons → rules
- Before building a privileged feature, write its access model into the
  story: who may use it, how they find it (menu, help), and the per-user
  cap and server-side check that bound it; confirm it with the owner once.
- Every report reason maps to a field a review decision can change; drop a
  reason that has no fix path.
- A command users need is in the menu or the help; never hide one without
  telling the user how to reach it.
- Common messages (`/help`, `/start`) make no API call unless needed; any
  new call on a hot path is checked against the caps it counts toward.
- Opening a write path to more users ships a per-user cap and server-side
  validation in the same PR.
- Stop local servers by port (`lsof -t -i :PORT | xargs -r kill`), never
  with `pkill -f` on a pattern that appears in the command itself.
- Rebuild from the branch under test right before a screenshot or viewport
  check; never reuse a build made for a comparison.
- When a model, endpoint or page cannot be verified from the session, ship
  a graceful fallback and name the first live check for the owner in the
  PR and in chat.

### Follow-ups
- Owner: the first live `/review_manual` (the Gemini Pro call on
  `REVIEW_MODEL` / `REVIEW_LOCATION`), and confirm the review commands now
  show in the Telegram menu.
- Record who decided each review (user id on the override and the closed
  reports) and add an undo, now that any student can decide.
- `/report` without a reason still makes one counted API call.
- Fold `question_overrides` and `word_overrides` into the bundled JSON.
- Run `/sprint review` on the Sprint 10 range (`6ef51f1...f50596e`) and the
  Sprint 9 range still pending.
- Carried over: 511 words whose sentence cannot be blanked, the option
  position content rule, the English-only web quiz, and the Sprint 8 items.
