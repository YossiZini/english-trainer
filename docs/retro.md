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
