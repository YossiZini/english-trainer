---
name: defect
description: Log and fix defects of English Trainer against the defect-log artifact — /defect add <description> records a bug, /defect fix fixes every open defect, /defect status lists them. Use whenever the user types /defect or reports a bug to be tracked or fixed.
---

# /defect — defect tracking for English Trainer

Usage: `/defect <add|fix|status> [text]`

Defects live in the **defect-log artifact**; the repository holds this
playbook and the fixes. Sprint work stays on the sprint board (`/sprint`); a
defect is a bug in what is already on `main`.

## Configuration

| Setting | Value |
|---|---|
| Defect log artifact URL | `https://claude.ai/artifact/1mQTW4J6BJprUswhk4aM9a` |
| Log data | `ArtifactData` tool (load with `ToolSearch select:ArtifactData`) |
| Work branch | `claude/<session-branch>` restarted from `origin/main`; fixes reach `main` through a PR the user merges (every merge deploys) |
| Rules | `docs/retro.md` "Lessons → rules" apply; topics → update `docs/topics-status.md` |

## Data model (artifact database)

`meta/log` — one document:

```json
{ "nextId": 4, "focus": "one line shown at the top of the log", "updatedAt": "ISO timestamp" }
```

`defects/<id>` — ids `d1`, `d2`, … (taken from `meta/log.nextId`, which is then incremented).

```json
{ "title": "one line, ≤ 80 chars, in the user's words", "description": "the full report as given",
  "status": "open|in_progress|fixed|wont_fix", "reportedAt": "YYYY-MM-DD", "fixedAt": null,
  "note": "resolution: what was wrong, what changed, where", "links": [{"label": "…", "url": "https://…"}] }
```

Rules for every write: read first, pin `if_version`, batch when writing more
than two documents, and set `meta/log.updatedAt` + `focus` whenever the log
changes. Never store secrets in the log.

## Subcommands

Always begin by reading `meta/log` (and `defects` when relevant) so the
command acts on the real state.

### `add <description>`

1. Refuse politely when no description was given; ask for it.
2. Take the next id from `meta/log.nextId`. Derive `title` from the first
   sentence of the description (shortened, no rewording of the facts); keep
   the whole text as `description`.
3. Write `defects/<id>` with `status: open`, `reportedAt` = today, and update
   `meta/log` (`nextId + 1`, `updatedAt`, `focus` = "N open defect(s); newest: <title>").
4. Do not investigate or fix anything. Confirm in one line: the id, the title,
   and the current count of open defects.

### `fix`

Fixes **every** open defect (`open` or `in_progress`) in one run; nothing to fix
→ say so and stop.

1. Prepare the branch: `git fetch origin main` and restart the work branch
   from `origin/main` (`git checkout -B <branch> origin/main`) unless it
   already carries unmerged, unpushed work — then say so and stop.
2. For each open defect, oldest first:
   1. Mark it `in_progress`, set `focus`.
   2. **Reproduce first**: locate the code from the report (search, read;
      run the app against the Firestore emulator when the report is about
      behaviour), and confirm the defect is real. If it does not reproduce or
      is not a defect, mark it `wont_fix` with a `note` explaining why, and
      continue with the next one.
   3. Fix the root cause with the smallest change that does not weaken other
      behaviour; never skip or disable tests. Add or extend a test when the
      fix is testable (`backend/tests/*.test.js`, or the viewport check for
      layout).
   4. Run the relevant checks: `cd backend && npm test`; `cd frontend &&
      npm run build` when the frontend changed; a Playwright screenshot for
      visible changes (see `frontend/scripts/viewport-check.js` for the
      setup: emulator on :8089, API on :5000, build served on :3000).
   5. Commit **one commit per defect** whose message starts with the id
      (`d3: …`) and ends with the session's attribution lines.
   6. Mark the defect `fixed`: `fixedAt`, `note` (what was wrong, what
      changed, file), `links` (commit).
3. Push the branch and open **one PR** titled "Defects: d1, d3, …" whose body
   lists each defect with its resolution; add the PR link to every fixed
   defect's `links` and to `focus`. Do not merge.
4. Report in chat: a table id / title / outcome / commit, what could not be
   reproduced, and that the PR needs the user's merge to deploy.

### `status`

Read the log and report: counts per status, then each open defect (id,
title, reported date) and the last three fixed ones with their links. No writes.

## Guardrails

- Never push to `main` directly; never commit keys or secrets.
- A report that is really a feature request is not a defect: say so and
  suggest `/sprint start` (or adding it to the current sprint) instead of
  logging it.
- Keep notes short and factual; the log is read by a person at a glance.
