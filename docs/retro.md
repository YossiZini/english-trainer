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
