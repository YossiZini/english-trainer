# CR-002 Workplan: Google Cloud deployment

Phases match the live backlog artifact. Items marked **(owner)** need the project
owner; everything else is implemented on branch `claude/great-feynman-kkat23`.

## P0. Foundation: project, access, infra as code

1. **(owner)** Create a new GCP project; link billing; add Firebase to it.
2. **(owner)** Send the Project ID and confirm the region.
3. Write this change request.
4. Write `infra/setup.sh`: idempotent `gcloud` provisioning (APIs, Firestore,
   Artifact Registry, videos bucket, runtime and deployer service accounts,
   `jwt-secret`, Workload Identity pool/provider for GitHub, budget alert).
5. **(owner)** Run `infra/setup.sh` from Cloud Shell; paste the summary.
6. **(owner)** Add the four repository variables to GitHub Actions.

## P1. Backend on Cloud Run

- `backend/Dockerfile` + `.dockerignore` (node:22-slim, non-root, static data bundled).
- Production config hardening: `JWT_SECRET` required, `CORS_ORIGINS` allow-list,
  `trust proxy`, `.env.example` cleaned.
- `infra/cloudrun-service.yaml` (512 MiB, min 0 / max 3, concurrency 80, secret
  binding, startup probe).
- First deploy; `/health` returns OK on the `run.app` URL.

## P2. Storage: JSON files → Firestore

- `@google-cloud/firestore` + `config/firestore.js` (ADC, emulator for tests).
- `StaticStore` for bundled read-only content.
- `FirestoreDatabase` adapter (find/findOne/findById/insert/updateById/deleteById/
  delete/findByIndex/count).
- Composite lookup and unique-email as queries; retire `IndexManager`.
- Five `withTransaction` sites → Firestore transactions.
- Await sweep across 16 models and 9 services; rewrite the 3 dynamic `getCollection` uses.
- Contract tests + API smoke tests on the Firestore emulator.
- `firestore.indexes.json`, `firestore.rules` (deny all client access).
- Remove `JsonDatabase`, `IndexManager`, `backend/data/dynamic`.

## P3. Frontend on Firebase Hosting, videos on Cloud Storage

- `firebase.json`: SPA fallback, `/api/**` → Cloud Run rewrite, cache headers.
- `REACT_APP_API_URL=/api` for production builds.
- Videos uploaded to the bucket; `TopicsIndex` reads `REACT_APP_VIDEO_BASE_URL`;
  MP4s removed from `frontend/public/videos` and `docs/videos`.
- First Hosting deploy and end-to-end check.

## P4. CI/CD: deploy from GitHub

- Workflow: test → build image → Artifact Registry → deploy Cloud Run (WIF).
- Workflow: build React → `firebase deploy --only hosting,firestore`; `gsutil rsync` videos.
- Verify a push to `main` deploys both sides.

## P5. Hardening, cost guard, docs

- Budget alert ($5, 50/90/100%), uptime check on `/health`.
- Scheduled Firestore backups; Cloud Run limits review.
- `docs/deployment.md`; `README.md` and `SETUP.md` rewritten; `CLAUDE.md` note.
- Remove leftover PostgreSQL migrations and one-off seed scripts.

## Rollback

Cloud Run keeps previous revisions: `gcloud run services update-traffic
english-trainer-api --to-revisions=<previous>=100`. Hosting keeps previous
releases in the Firebase console (Hosting → Release history → Rollback).
