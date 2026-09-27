#!/usr/bin/env node
/**
 * Build docs/backlog/sprint-<N>.md from an export of the sprint board.
 *
 *   node .claude/skills/sprint/scripts/archive.js <export-dir> <N>
 *
 * <export-dir> is the `out_dir` given to ArtifactData when listing the
 * `items` collection and reading `meta/sprint`; it contains
 * items/<id>.json and meta/sprint.json (each either the raw document or
 * the {id, data, version} envelope the tool writes).
 *
 * Exits non-zero when any item is not `done`, so a close cannot archive
 * unfinished work by accident.
 */
const fs = require('fs');
const path = require('path');

const [exportDir, sprintNumber] = process.argv.slice(2);
if (!exportDir || !sprintNumber) {
  console.error('usage: archive.js <export-dir> <N>');
  process.exit(2);
}

const unwrap = (json, fallbackId) => {
  const doc = json.data && typeof json.data === 'object' ? json.data : json;
  return { id: json.id || fallbackId, ...doc };
};
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));

const itemsDir = path.join(exportDir, 'items');
const items = fs.existsSync(itemsDir)
  ? fs.readdirSync(itemsDir).filter(f => f.endsWith('.json'))
      .map(f => unwrap(readJson(path.join(itemsDir, f)), f.replace(/\.json$/, '')))
  : [];
const sprintFile = path.join(exportDir, 'meta', 'sprint.json');
const sprint = fs.existsSync(sprintFile) ? unwrap(readJson(sprintFile), 'sprint') : {};

const notDone = items.filter(i => i.status !== 'done');
if (notDone.length) {
  console.error('Items not done:', notDone.map(i => `${i.id} (${i.status})`).join(', '));
  process.exit(1);
}

const PRIO = { P1: 1, P2: 2, P3: 3 };
const cell = s => String(s ?? '').replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ');
const stories = items.filter(i => i.kind !== 'task')
  .sort((a, b) => (PRIO[a.priority] || 9) - (PRIO[b.priority] || 9) || (a.order || 0) - (b.order || 0));
const tasksOf = id => items.filter(i => i.kind === 'task' && i.parent === id).sort((a, b) => (a.order || 0) - (b.order || 0));
const owner = it => (it.owner === 'you' ? 'owner' : 'Claude');

let md = `# Sprint ${sprintNumber} — ${sprint.name || ''} (archived backlog)\n\n`;
md += `**Goal:** ${sprint.goal || ''}\n`;
md += `**Period:** ${sprint.startedAt || '?'} → ${sprint.closedAt || new Date().toISOString().slice(0, 10)}`;
if (sprint.release) md += ` · **Release:** ${sprint.release}`;
md += `\n**Items:** ${items.length} (${stories.length} stories), all done\n\n`;
if (Array.isArray(sprint.scope) && sprint.scope.length) {
  md += `## Scope\n\n${sprint.scope.map(s => `- ${s}`).join('\n')}\n\n`;
}
md += `## Stories\n\n`;
for (const s of stories) {
  md += `### ${s.priority || ''} ${s.id} · ${s.title}\n\n`;
  if (s.detail) md += `${s.detail}\n\n`;
  if (Array.isArray(s.acceptance) && s.acceptance.length) {
    md += s.acceptance.map(a => `- [x] ${a}`).join('\n') + '\n\n';
  }
  if (s.note) md += `*Closing note:* ${s.note}\n\n`;
  const tasks = tasksOf(s.id);
  if (tasks.length) {
    md += `| Task | Owner | Note |\n|---|---|---|\n`;
    for (const t of tasks) md += `| ${cell(t.title)} | ${owner(t)} | ${cell(t.note)} |\n`;
    md += '\n';
  }
}

const outDir = path.join(process.cwd(), 'docs', 'backlog');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, `sprint-${sprintNumber}.md`);
fs.writeFileSync(outFile, md);
console.log(`wrote ${path.relative(process.cwd(), outFile)} (${items.length} items)`);
