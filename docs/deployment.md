# Deployment

English Trainer runs on Google Cloud project **`teacher-509909`** (region
`europe-west1`). This page is the operator's reference; the design decisions
are in `change-requests/CR-002-gcp-deployment/`.

## Architecture

```
Browser ──► Firebase Hosting  https://teacher-509909.web.app
               │  /api/**  ──► Cloud Run: english-trainer-api (Node 22 container)
               │                     ├─ curriculum content: JSON bundled in the image, read-only
               │                     ├─ Firestore (Native): student data, 16 collections
               │                     └─ Secret Manager: jwt-secret → JWT_SECRET
               └─ videos ──► Cloud Storage bucket teacher-509909-videos (public read)
Telegram ──► Cloud Run: english-trainer-bot (Python, Google ADK) ──► /api/bot/* on the API
               (secrets: telegram-bot-token, telegram-webhook-secret, bot-api-key; Gemini via Vertex AI)

GitHub push to main ──► GitHub Actions (Workload Identity, no keys)
   test on Firestore emulator → build image → Artifact Registry → Cloud Run
   → build React → firebase deploy (hosting + firestore rules/indexes)
```

| Piece | Where it is defined |
|---|---|
| Cloud Run service | `infra/cloudrun-service.yaml` |
| Telegram bot service | `infra/cloudrun-bot.yaml`, `bot/Dockerfile`, setup in `infra/setup-bot.sh` (see `docs/telegram-bot.md`) |
| Container image | `backend/Dockerfile` |
| Hosting, rewrites, cache headers | `firebase.json` |
| Firestore rules / indexes | `firestore.rules`, `firestore.indexes.json` |
| Frontend production settings | `frontend/.env.production` |
| CI/CD | `.github/workflows/deploy.yml` |
| One-time provisioning | `infra/setup.sh` |
| Post-deploy hardening (backups, uptime check, budget) | `infra/hardening.sh` |
| Video upload | `infra/upload-videos.sh` |

Identities: the container runs as `english-trainer-api@…` (Firestore user +
secret accessor); GitHub Actions deploys as `github-deployer@…` through the
Workload Identity pool `github`, restricted to the `YossiZini/english-trainer`
repository. No service-account keys exist.

## Deploying

Every push to `main` deploys both backend and frontend. The workflow can also be
started by hand from the Actions tab (**Deploy → Run workflow**).

A deploy takes 5–8 minutes: tests → image → Cloud Run (with a `/health` smoke
check) → Hosting. If the tests fail nothing is deployed.

### Rolling back

- **Backend**: Cloud Run keeps previous revisions.
  `gcloud run services update-traffic english-trainer-api --region europe-west1 --to-revisions=<REVISION>=100`
  (list them with `gcloud run revisions list --service english-trainer-api --region europe-west1`).
- **Frontend**: Firebase console → Hosting → *Release history* → *Rollback*.

## Where to look when something breaks

| Symptom | Look at |
|---|---|
| API errors, 5xx | [Cloud Run logs](https://console.cloud.google.com/run/detail/europe-west1/english-trainer-api/logs?project=teacher-509909) |
| Data questions | [Firestore data](https://console.cloud.google.com/firestore/databases/-default-/data?project=teacher-509909) |
| Deploy failures | [GitHub Actions](https://github.com/YossiZini/english-trainer/actions) |
| Cost | [Billing](https://console.cloud.google.com/billing?project=teacher-509909) — budget `english-trainer-monthly` alerts at 50/90/100 % of $5 |
| Uptime | Cloud Monitoring uptime check `english-trainer-api-health` |

The API refuses to start without `JWT_SECRET`; a CORS error in the browser
means the requesting origin is missing from `CORS_ORIGINS` in the service spec.

## Routine operations

**Reset a student's password**

```bash
gcloud auth application-default login
cd backend && GCP_PROJECT_ID=teacher-509909 npm run reset-password -- <username> <new-password>
```

**Rotate the JWT secret** (signs every student out)

```bash
openssl rand -base64 48 | tr -d '\n' | gcloud secrets versions add jwt-secret --data-file=- --project teacher-509909
```
then redeploy (the service reads the `latest` version at revision start).

**Add or change curriculum content**: follow `docs/topics-status.md`; content is
regenerated with `npm run generate-data` and ships with the next deploy.

**Add a video**: `gcloud storage cp <file>.mp4 gs://teacher-509909-videos/`, then
reference the filename in `frontend/src/components/topics/TopicsIndex.jsx`.

**Backups**: daily Firestore backups with 7-day retention (created by
`infra/hardening.sh`). Restore with
`gcloud firestore databases restore --source-backup=<BACKUP> --destination-database=<NAME>`.

## Costs

Everything runs inside free tiers for a handful of students: Cloud Run
(scale-to-zero), Firestore (1 GiB, 50k reads/day), Hosting (10 GB, 360 MB/day),
Artifact Registry (0.5 GB), Secret Manager. Expected bill: $0–2 per month.
The Telegram bot adds Vertex AI (Gemini Flash) usage, bounded by the caps in
`docs/telegram-bot.md`; only an answer that misses the dictionary calls the model, once.
Old container images accumulate in Artifact Registry; delete them occasionally
or add a cleanup policy if storage grows past the free 0.5 GB.

## Running locally

The project is cloud-only, but the backend can run against the Firestore
emulator for development and tests:

```bash
cd backend && npm ci
npm test                                  # starts the emulator, runs Jest, stops it
# or an interactive server on the fixed port 5000:
npx firebase emulators:exec --only firestore --project demo-english-trainer --config ../firebase.json \
  "JWT_SECRET=dev PORT=5000 node src/server.js"
```

The emulator needs Java 21+. The frontend runs with `npm start` on port 3000
and talks to `http://localhost:5000/api` (`frontend/.env.example`).
