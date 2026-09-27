# Sprint 0 — Move to Google Cloud (archived backlog)

**Change request:** CR-002 (`change-requests/CR-002-gcp-deployment/`)
**Period:** 2026-09-27 · **Release:** v0.1 · **Result:** https://teacher-509909.web.app
**Items:** 37, all done (12 owner actions, 25 implemented by Claude)

Outcome: backend on Cloud Run, student data in Firestore, frontend on Firebase
Hosting, videos on Cloud Storage, keyless deploys from GitHub on every push to
`main`, daily backups, uptime check and budget alert. Pull requests #1–#3.

## P0 · Foundation: project, access, infra as code

| # | Item | Owner | Notes |
|---|---|---|---|
| p0-00 | Give Claude push access to the GitHub repo | owner | Push succeeded; branch claude/great-feynman-kkat23 is on GitHub. |
| p0-01 | Create a new Google Cloud project | owner | Project TEACHER, ID teacher-509909, number 564347840680. |
| p0-02 | Link a billing account to the project | owner | Confirmed by you on 2026-09-27. |
| p0-03 | Add Firebase to the project (for Hosting) | owner | Confirmed by you on 2026-09-27. |
| p0-04 | Send Claude the Project ID and confirm the region | owner | Project ID teacher-509909. Region changed to europe-west1: the first script run created Firestore, the registry and the bucket there (a buggy availability check in the script), and Firestore's location is permanent. Cloud Run spec updated to match. |
| p0-05 | Write change request CR-002 (PRD + workplan) in the repo | Claude | Written and committed on the branch (change-requests/CR-002-gcp-deployment/PRD.md + workplan.md). Push pending on GitHub access. |
| p0-06 | Write infra/setup.sh: idempotent gcloud provisioning script | Claude | infra/setup.sh committed on the branch; syntax-checked. It will run for real in your Cloud Shell (P0 step 7) once the push goes through. |
| p0-07 | Run infra/setup.sh from Cloud Shell and paste the output | owner | Completed 2026-09-27: Firestore, Artifact Registry, videos bucket, runtime + deployer service accounts, jwt-secret and Workload Identity all in place in teacher-509909 / europe-west1. Only the budget alert failed (moved to P5). |
| p0-08 | Add GitHub Actions variables for keyless deploys | owner | Added by you on 2026-09-27. |

## P1 · Backend on Cloud Run

| # | Item | Owner | Notes |
|---|---|---|---|
| p1-01 | Backend Dockerfile and .dockerignore | Claude | backend/Dockerfile + .dockerignore committed; package-lock.json generated and un-ignored so npm ci works. Image build itself happens in Cloud Build/CI (no Docker daemon in this session). |
| p1-02 | Production config hardening | Claude | Verified locally: /health OK, allowed origin echoed, unknown origin gets 403, production start without JWT_SECRET throws. |
| p1-03 | Cloud Run service spec (infra/cloudrun-service.yaml) | Claude | infra/cloudrun-service.yaml committed for teacher-509909 / me-west1 with the jwt-secret binding and Hosting origins. |
| p1-04 | First backend deploy and health check | Claude | Deployed by the first workflow run (36314401192); the workflow's /health smoke check passed on the run.app URL. |

## P2 · Storage: JSON files → Firestore

| # | Item | Owner | Notes |
|---|---|---|---|
| p2-01 | Add @google-cloud/firestore and config/firestore.js | Claude | @google-cloud/firestore added; src/config/firestore.js uses ADC on Cloud Run and FIRESTORE_EMULATOR_HOST in tests. |
| p2-02 | StaticStore for the bundled read-only content | Claude | src/data/StaticStore.js loads the six content collections from data/static; writes to them are rejected at runtime. |
| p2-03 | FirestoreDatabase adapter for the 16 dynamic collections | Claude | src/data/FirestoreDatabase.js. Equality filters run in Firestore; range/sort/limit in memory on per-user sets, so no composite indexes needed. |
| p2-04 | Composite lookup and unique-email check as queries; retire IndexManager | Claude | IndexManager removed; user_progress lookup and unique-email check are queries. |
| p2-05 | Transactions: counters atomic, withTransaction sequential | Claude | Changed approach: the 5 withTransaction flows interleave reads and writes through nested model calls, which Firestore transactions forbid (reads must precede writes). withTransaction is now a plain sequential section; the counters with real lost-update risk (points, daily points, streak, time spent) use a per-document Firestore transaction (db.transactUpdate), verified by a concurrent-increment test. |
| p2-06 | Await sweep across 16 models and 9 services | Claude | 239 storage calls awaited across models/services/controllers; the 3 vocabulary_quiz_sessions lookups are per-user queries. |
| p2-07 | Tests: adapter contract suite + API smoke tests on the Firestore emulator | Claude | 15 tests pass on the Firestore emulator (npm test): storage contract suite + API smoke (register/login, lessons, exercise submit with mistakes and points, vocabulary quiz, reading, achievements, challenges, dashboard). |
| p2-08 | Firestore indexes and rules files | Claude | firestore.rules denies all client access; firestore.indexes.json is empty by design (no composite queries). |
| p2-09 | Remove the JSON runtime storage | Claude | JsonDatabase, IndexManager, loadStaticData and data/dynamic removed. Production starts with an empty database. |

## P3 · Frontend on Firebase Hosting, videos on Cloud Storage

| # | Item | Owner | Notes |
|---|---|---|---|
| p3-01 | Firebase Hosting config (firebase.json) | Claude | firebase.json: /api/** → Cloud Run (europe-west1), SPA fallback, cache headers, videos excluded from Hosting uploads. |
| p3-02 | Production API URL for the React build | Claude | frontend/.env.production (committed; public values only). Production build verified locally with /api and the bucket URL baked in. |
| p3-03 | Upload the videos to the bucket (then Claude removes them from git) | Claude | Videos uploaded by you; public URL verified (HTTP 200). The 2×67 MB copies were removed from frontend/public/videos and docs/videos. |
| p3-04 | End-to-end check of the live site | owner | End-to-end check done by you on 2026-09-27. |

## P4 · CI/CD: deploy from GitHub

| # | Item | Owner | Notes |
|---|---|---|---|
| p4-00 | Merge PR #1 to trigger the first deploy | owner | PR #1 merged 2026-09-27; Deploy run 1 succeeded (tests → Cloud Run → Hosting). |
| p4-01 | GitHub Actions: backend deploy workflow | Claude | .github/workflows/deploy.yml: emulator tests → docker build/push to Artifact Registry → gcloud run services replace + public invoker → /health check. Runs on push to main or manually (workflow_dispatch). |
| p4-02 | GitHub Actions: frontend, videos, Firestore rules deploy | Claude | Same workflow: React build then firebase deploy --only hosting,firestore. Videos are uploaded once with infra/upload-videos.sh instead of on every deploy. |
| p4-03 | Verify a push to main deploys both sides | Claude | The merge to main deployed both sides in one run. From now on every push to main deploys automatically. |

## P5 · Hardening, cost guard, docs

| # | Item | Owner | Notes |
|---|---|---|---|
| p5-00 | Merge PR #2 | owner | Merged 2026-09-27; deploy run in progress. |
| p5-01 | Backups and uptime check | Claude | Created by infra/hardening.sh on 2026-09-27: daily Firestore backup schedule (7-day retention) and uptime check english-trainer-api-health on /health. Budget alert split into its own item. |
| p5-02 | Backups and runtime limits | Claude | Backup schedule is created by infra/hardening.sh (item above). Cloud Run limits already set in the service spec (512 MiB, max 3 instances, 60 s timeout, concurrency 80); helmet stays on behind Hosting. |
| p5-03 | Documentation refresh | Claude | docs/deployment.md added; README, SETUP, backend/README, topic guide (topics-status.md steps 3 and 5 + checklist) and CLAUDE.md updated. On PR #2. |
| p5-04 | Remove leftover PostgreSQL migration and seed scripts | Claude | Removed migrations/, schema.sql and 15 one-off PostgreSQL scripts; reset-user-password rewritten for Firestore; seed files kept. On PR #2. |
| p5-05 | Merge PR #3 (deploy retry fix; also redeploys Hosting) | owner | Merged 2026-09-27; deploy run being watched. |
| p5-06 | Create the $5 budget alert in the console | owner | Created manually in the console by you on 2026-09-27. |

## Decisions recorded during the sprint

- Region changed from the requested `me-west1` to `europe-west1`: the first provisioning run created Firestore there (a buggy availability check in the script), and a Firestore location is permanent.
- Firestore transactions could not wrap the models' nested read/write flows (reads must precede writes); `withTransaction` became a sequential section and the counters at risk of lost updates use per-document transactions.
- No local JSON storage kept: the project is cloud-only; tests and optional local runs use the Firestore emulator.
- The two January test users were not migrated; production started empty.
- The `gcloud` budget command was rejected by the billing account twice; the budget was created in the console.
