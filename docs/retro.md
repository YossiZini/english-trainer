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
