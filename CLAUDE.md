# Project Configuration

## Topic Status Tracking

**IMPORTANT**: When making changes to any topic, you MUST update `/docs/topics-status.md`:
- Update the topic's status in the status table
- Add an entry to the topic's recent activity log with date and description

Reference: `/docs/topics-status.md` contains:
- Step-by-step guide for creating new topics
- Asset checklist per topic
- Current status of all topics
- Recent activity history

**Math content** (teaching documents, exercises, explanations, pictures,
verification): follow `/docs/math-content-guide.md`.

---

## Deployment

The app runs on Google Cloud (project `teacher-509909`, `europe-west1`): Cloud
Run backend, Firestore for student data, Firebase Hosting frontend, videos on
Cloud Storage. **Every push to `main` deploys** via `.github/workflows/deploy.yml`
after the backend tests pass on the Firestore emulator (`cd backend && npm test`).

- Operations reference: `/docs/deployment.md`
- Telegram bot (ADK agent, bot API, caps): `/docs/telegram-bot.md`
- Curriculum content is generated from seed files (`npm run generate-data`) and
  bundled read-only; student data is never stored in the repository.
- Never commit service-account keys or secrets; the JWT secret lives in Secret Manager.

---

## System Map

The high-level architecture page (services, what each owns, tech stack, main
flows as diagrams) is the artifact https://claude.ai/artifact/UUd5q8QHxH4CZcn4i1vpDU.
Its source is `/docs/architecture/system-map.html`.

**Keep it current.** Update the source and republish it to the same URL
(Artifact tool with `url` set to the link above):
- in the same PR as any design change: a new or removed service, endpoint
  group, data store or external dependency; a changed flow between
  services; a moved responsibility; a new security or cost limit;
- at the end of every sprint (`/sprint close` checks it).

Keep it high level: no endpoint lists or field names.

---

## Sprint Workflow and Retrospectives

Work is organised in sprints driven by the `/sprint` command
(`.claude/skills/sprint/SKILL.md`): `start` → `plan` → `next` → `review` →
`retro` → `close`. The sprint board is a Claude artifact; closed sprints are
archived under `docs/backlog/`.

Defects (bugs in what is already on `main`) are tracked with the `/defect`
command (`.claude/skills/defect/SKILL.md`): `add <description>` logs one in the
defect-log artifact, `fix` fixes every open defect in one PR.

**`/docs/retro.md` is binding**: read its "Lessons → rules" before starting
work, and add to it through `/sprint retro`.

---

## Server Ports

**Do not change these ports. They are fixed for this project.**

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

### If Ports Are In Use

If either port 3000 or 5000 is already in use when starting the servers:
1. Notify the user about the port conflict
2. Ask the user to free up the port manually
3. Do NOT automatically change to a different port

To check what's using a port:
```bash
lsof -i :3000
lsof -i :5000
```

To kill a process on a specific port:
```bash
lsof -i :PORT -t | xargs kill -9
```
