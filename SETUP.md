# Setup Guide

English Trainer is deployed on Google Cloud and served at
**https://teacher-509909.web.app**. Day-to-day, nothing needs to run on your
machine: pushing to `main` deploys. See `docs/deployment.md` for operations.

This page covers working on the code.

## Prerequisites

- **Node.js 22** and npm
- **Java 21+** (only for the Firestore emulator used by the backend tests)
- **Git**
- **gcloud CLI** (only for the one-time provisioning and admin scripts)

## Clone and install

```bash
git clone https://github.com/YossiZini/english-trainer.git
cd english-trainer
(cd backend && npm ci)
(cd frontend && npm ci)
```

## Backend tests

```bash
cd backend
npm test
```

`npm test` starts the Firestore emulator, runs the Jest suites
(`backend/tests/`) and stops it. The suites cover the storage adapter and the
main student flows through the HTTP API. CI runs the same command before every
deploy.

## Running the app locally (optional)

The backend can run against the emulator on the fixed port **5000**:

```bash
cd backend
npx firebase emulators:exec --only firestore --project demo-english-trainer --config ../firebase.json \
  "JWT_SECRET=dev PORT=5000 node src/server.js"
```

Then in another terminal, the frontend on the fixed port **3000**:

```bash
cd frontend
cp .env.example .env     # REACT_APP_API_URL=http://localhost:5000/api
npm start
```

Do not change the ports; both sides assume 3000/5000 locally. If a port is
busy: `lsof -i :3000 -t | xargs kill -9`.

Emulator data is discarded when the emulator stops; production data lives in
Firestore and is never touched by local runs.

## Project structure

```
english-trainer/
├── backend/
│   ├── Dockerfile               # Cloud Run image
│   ├── data/static/             # Curriculum content (generated from seeds, read-only)
│   ├── src/
│   │   ├── server.js, app.js    # Express entry point
│   │   ├── config/              # database.js (storage), firestore.js, jwt.js
│   │   ├── data/                # FirestoreDatabase, StaticStore, query helpers, generateJsonData
│   │   ├── database/seeds/      # Topic, vocabulary and reading-passage seed files
│   │   ├── models/ services/ controllers/ routes/ middleware/
│   └── tests/                   # Jest suites (run on the Firestore emulator)
├── frontend/                    # React app (Create React App)
├── infra/                       # setup.sh, hardening.sh, upload-videos.sh, cloudrun-service.yaml
├── firebase.json                # Hosting rewrites + emulator config
├── firestore.rules / .indexes.json
├── .github/workflows/deploy.yml # CI/CD
├── change-requests/             # PRDs and workplans per change
└── docs/                        # Curriculum docs, topics-status.md, deployment.md
```

## Useful commands

```bash
# backend
npm test                                  # emulator + Jest
npm run generate-data                     # rebuild data/static from the seed files
npm run reset-password -- <user> <pass>   # production password reset (needs gcloud ADC)

# frontend
npm start                                 # dev server on :3000
npm run build                             # production build (uses .env.production)
```

## Technology

| Component | Technology |
|---|---|
| Frontend | React 19, React Router 7, Axios, Firebase Hosting |
| Backend | Node.js 22, Express 5, Cloud Run |
| Database | Firestore (student data); bundled JSON (curriculum) |
| Auth | JWT (jsonwebtoken), bcryptjs; secret in Secret Manager |
| CI/CD | GitHub Actions with Workload Identity Federation |
