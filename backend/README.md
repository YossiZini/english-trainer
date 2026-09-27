# English Trainer API

Node.js 22 + Express 5 backend, deployed as a container on Cloud Run.
Student data is stored in Firestore; curriculum content ships with the image.

## Run the tests

```bash
npm ci
npm test        # starts the Firestore emulator (needs Java 21+), runs Jest, stops it
```

## Configuration

| Variable | Purpose |
|---|---|
| `PORT` | Listen port (Cloud Run sets 8080; local runs use 5000) |
| `NODE_ENV` | `production` refuses to start without `JWT_SECRET` |
| `JWT_SECRET`, `JWT_EXPIRATION` | Token signing; the secret comes from Secret Manager in production |
| `CORS_ORIGINS` | Comma-separated allowed browser origins |
| `GCP_PROJECT_ID` | Firestore project (implicit on Cloud Run) |
| `FIRESTORE_EMULATOR_HOST` | Set by the emulator; points the client at it |

See `.env.example` for local values and `../infra/cloudrun-service.yaml` for production.

## Layout

```
src/
├── server.js, app.js        # entry point, middleware, routes
├── config/
│   ├── database.js          # storage instance + startup
│   ├── firestore.js         # Firestore client
│   └── jwt.js
├── data/
│   ├── FirestoreDatabase.js # async data access used by all models
│   ├── StaticStore.js       # read-only curriculum content from ../data/static
│   ├── query.js             # in-memory filter/sort helpers
│   └── generateJsonData.js  # seeds → data/static/*.json
├── database/seeds/          # topic, vocabulary and reading-passage seed files
├── models/  services/  controllers/  routes/  middleware/
└── utils/
tests/                       # Jest suites
```

## Storage model

- **Static collections** (`lessons`, `exercises`, `vocabulary_words`,
  `achievements`, `unseen_paragraphs`, `unseen_questions`) are loaded from
  `data/static` into memory at startup and are read-only at runtime. Change
  them by editing the seed files and running `npm run generate-data`.
- **Dynamic collections** (users, progress, results, scores, sessions…) are
  Firestore collections; document id = record `id`. Equality filters run in
  Firestore, range operators and sorting run in memory on the per-user result.
- Counters (points, streaks, time) go through `db.transactUpdate`, a
  per-document Firestore transaction.

## Content authoring

Follow `../docs/topics-status.md` for adding a topic. Content changes deploy
with the next push to `main`.

## Admin

```bash
gcloud auth application-default login
GCP_PROJECT_ID=teacher-509909 npm run reset-password -- <username> <new-password>
```
