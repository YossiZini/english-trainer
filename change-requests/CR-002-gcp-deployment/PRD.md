# CR-002: Deploy English Trainer on Google Cloud

**Status:** Approved, in progress
**Date:** 2026-09-27
**Backlog:** live execution backlog is maintained as a Claude artifact (see workplan.md for the phase list)

---

## 1. Problem

The app runs only on a developer machine. The backend keeps all data in memory and
flushes it to JSON files on local disk (`backend/data/dynamic`). That design cannot
run on a managed platform: the filesystem is ephemeral, instances scale from zero to
many, and each instance would hold its own copy of the data.

## 2. Goals

- The app is reachable on the internet over HTTPS, for the family's students, with
  no machine to keep running at home.
- Student data (accounts, progress, mistakes, vocabulary scores, streaks) is durable.
- Monthly cost stays in the free tiers for the expected usage (a few students).
- Deploys happen from GitHub on push to `main`; no long-lived cloud keys anywhere.
- Content authoring (topics, exercises, vocabulary, reading passages) keeps working
  exactly as documented in `docs/topics-status.md`.

## 3. Non-goals

- Local development environment. The project becomes cloud-only; the JSON file
  database is removed rather than kept as a second backend.
- Custom domain. The default `*.web.app` Hosting domain is used.
- Replacing the custom JWT login with Firebase Auth. Students log in by name; the
  existing scheme is kept, with the secret moved to Secret Manager.
- Migrating the two January test users. Production starts with an empty database.

## 4. Decisions

| Topic | Decision |
|---|---|
| Cloud project | A new, dedicated GCP project (not the existing `styler` project) |
| Provisioning | Infra as code in `infra/`, run once by the owner from Cloud Shell |
| Backend runtime | Cloud Run, container built from `backend/Dockerfile` |
| Database | Firestore (Native mode) for the 16 dynamic collections |
| Static content | Bundled JSON in the container image, loaded read-only into memory |
| Frontend | Firebase Hosting, `/api/**` rewritten to Cloud Run (direct URL + CORS as fallback) |
| Videos | Public Cloud Storage bucket; removed from the git repo |
| Secrets | Secret Manager (`jwt-secret`), bound into Cloud Run as an env var |
| CI/CD | GitHub Actions with Workload Identity Federation (keyless) |
| Region | `me-west1` (Tel Aviv) when available, otherwise `europe-west1` |

## 5. Target architecture

```
Browser ──► Firebase Hosting (React build, CDN, HTTPS)
               │  /api/**  ──► Cloud Run: english-trainer-api (Node 22)
               │                     ├─ static content: bundled JSON in memory
               │                     ├─ Firestore: users, progress, results, scores…
               │                     └─ Secret Manager: JWT_SECRET
               └─ videos ──► Cloud Storage bucket (public read)

GitHub push to main ──► GitHub Actions (WIF) ──► build image → Artifact Registry
                                              ──► deploy Cloud Run
                                              ──► firebase deploy (hosting, firestore rules/indexes)
                                              ──► gsutil rsync videos
```

## 6. Storage redesign

Only `backend/src/models` and `backend/src/services` touch storage, through a
small synchronous interface on `JsonDatabase`. Every model method is already
`async` and every controller already awaits it, so the change is contained:

1. `StaticStore` loads the six read-only collections (`lessons`, `exercises`,
   `vocabulary_words`, `achievements`, `unseen_paragraphs`, `unseen_questions`)
   from `backend/data/static` into memory, as today.
2. `FirestoreDatabase` implements the used surface asynchronously for the dynamic
   collections: `find` (equality and range filters, sort, limit), `findOne`,
   `findById`, `insert`, `updateById`, `deleteById`, `delete`, `findByIndex`,
   `count`. Collection names and record ids are unchanged.
3. `IndexManager` is retired: the composite `(user_id, lesson_id)` lookup and the
   unique-email check become queries.
4. The five `withTransaction` sites become Firestore transactions that touch only
   the documents involved (today a transaction deep-clones every collection).
5. Models and services get `await` on every storage call; the three
   `getCollection('vocabulary_quiz_sessions')` uses become queries.
6. A contract test suite for the adapter and API smoke tests run on the Firestore
   emulator in CI; the repository has no backend tests today.

## 7. Acceptance criteria

- [ ] `https://<project>.web.app` serves the app; register, login, lesson, exercise,
      mistakes review, vocabulary quiz, reading passage and video all work.
- [ ] Data survives a Cloud Run scale-to-zero and a new deployment.
- [ ] A push to `main` deploys backend and frontend without manual steps.
- [ ] No service-account key files exist in the repo, in CI secrets, or on disk.
- [ ] Budget alert configured; first month's bill within the free tiers.
- [ ] `README.md` / `SETUP.md` describe the cloud setup; PostgreSQL references removed.
