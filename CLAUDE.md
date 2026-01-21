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
