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

---

## Deployment

The app runs on Google Cloud (project `teacher-509909`, `europe-west1`): Cloud
Run backend, Firestore for student data, Firebase Hosting frontend, videos on
Cloud Storage. **Every push to `main` deploys** via `.github/workflows/deploy.yml`
after the backend tests pass on the Firestore emulator (`cd backend && npm test`).

- Operations reference: `/docs/deployment.md`
- Curriculum content is generated from seed files (`npm run generate-data`) and
  bundled read-only; student data is never stored in the repository.
- Never commit service-account keys or secrets; the JWT secret lives in Secret Manager.

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
