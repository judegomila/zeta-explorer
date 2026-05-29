#!/usr/bin/env node
// scripts/inflight.mjs — imp-1276
// Read-only in-flight visibility dashboard: running engines + active worktrees.
// Usage: node scripts/inflight.mjs
//
// "Active" = a worktree that has uncommitted local changes, meaning a subagent
// is (or recently was) writing to it. Shows the last commit message so you can
// identify which ticket the worktree was assigned.

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCRIPT_DIR = __dirname;
const PROJECT_DIR = path.dirname(SCRIPT_DIR);

function readFile(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return null; }
}

function pidAlive(pidFile) {
  const raw = readFile(path.join(SCRIPT_DIR, pidFile));
  if (!raw) return false;
  const pid = parseInt(raw.trim(), 10);
  if (!pid) return false;
  try { process.kill(pid, 0); return true; } catch { return false; }
}

function sh(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch { return ''; }
}

// ── engines ───────────────────────────────────────────────────────────────────

const ENGINES = [
  { name: 'subscription', pid: '.auto-improve.pid' },
  { name: 'api',          pid: '.auto-improve-api.pid' },
  { name: 'sonnet',       pid: '.auto-improve-sonnet.pid' },
  { name: 'haiku',        pid: '.auto-improve-haiku.pid' },
];

// ── worktrees ─────────────────────────────────────────────────────────────────

function activeWorktrees() {
  const listRaw = sh(`git -C ${JSON.stringify(PROJECT_DIR)} worktree list --porcelain`);
  if (!listRaw) return [];

  // Parse porcelain output into blocks
  const blocks = [];
  let cur = {};
  for (const line of listRaw.split('\n')) {
    if (line === '') {
      if (cur.worktree) blocks.push(cur);
      cur = {};
    } else {
      const [key, ...rest] = line.split(' ');
      cur[key] = rest.join(' ');
    }
  }
  if (cur.worktree) blocks.push(cur);

  const results = [];
  for (const b of blocks) {
    const wt = b.worktree;
    if (!wt || wt === PROJECT_DIR) continue;  // skip main tree
    if (!wt.includes('/.claude/worktrees/agent-')) continue;

    // Check for local changes
    const statusOut = sh(`git -C ${JSON.stringify(wt)} status --short 2>/dev/null`);
    const changed = statusOut.split('\n').filter(l => l.trim() && !l.startsWith('??')).length;
    const untracked = statusOut.split('\n').filter(l => l.startsWith('??')).length;

    // Last commit subject (identifies what ticket was assigned)
    const lastCommit = sh(`git -C ${JSON.stringify(wt)} log --oneline -1 --format="%s" 2>/dev/null`);

    // Mtime of the most recently modified tracked file in the worktree
    let mtimeMs = null;
    try {
      const stat = fs.statSync(wt);
      mtimeMs = stat.mtimeMs;
    } catch {}

    const name = path.basename(wt);
    results.push({ name, wt, changed, untracked, lastCommit, mtimeMs, branch: b.branch || '' });
  }

  // Sort by modified time descending (most recently active first)
  results.sort((a, b) => (b.mtimeMs || 0) - (a.mtimeMs || 0));
  return results;
}

function ageStr(ms) {
  if (!ms) return '?';
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// ── render ────────────────────────────────────────────────────────────────────

const W = 72;
const HR = '─'.repeat(W);
const dot = b => b ? '●' : '○';

process.stdout.write('\n');
console.log(HR);
console.log('  IN-FLIGHT DASHBOARD  —  ' + new Date().toISOString());
console.log(HR);

// Engines
console.log('\n  RUNNING ENGINES');
let anyEngine = false;
for (const e of ENGINES) {
  const running = pidAlive(e.pid);
  if (running) anyEngine = true;
  console.log(`  ${dot(running)}  ${e.name.padEnd(14)}  ${running ? 'RUNNING' : 'stopped'}`);
}
if (!anyEngine) console.log('  (all engines stopped)');

// Worktrees
const worktrees = activeWorktrees();
const active = worktrees.filter(w => w.changed > 0);
const idle   = worktrees.filter(w => w.changed === 0);

console.log(`\n  WORKTREES  (${worktrees.length} total — ${active.length} with changes)`);

if (active.length === 0) {
  console.log('  (no worktrees have uncommitted changes)');
} else {
  console.log('  ── active (have local changes) ──');
  for (const w of active) {
    const age = ageStr(w.mtimeMs);
    const label = w.name.slice(0, 20);
    const commit = (w.lastCommit || '(no commits)').slice(0, 45);
    console.log(`  ● ${label.padEnd(22)}  ${String(w.changed).padStart(2)}M ${String(w.untracked).padStart(2)}U  ${age.padEnd(8)}  ${commit}`);
  }
}

if (idle.length > 0) {
  console.log(`\n  ── idle (no local changes: ${idle.length}) ──`);
  for (const w of idle.slice(0, 5)) {
    const age = ageStr(w.mtimeMs);
    const label = w.name.slice(0, 20);
    const commit = (w.lastCommit || '(no commits)').slice(0, 45);
    console.log(`  ○ ${label.padEnd(22)}           ${age.padEnd(8)}  ${commit}`);
  }
  if (idle.length > 5) console.log(`  ... and ${idle.length - 5} more idle worktrees`);
}

// Queue snapshot
const qi = (() => {
  try { return JSON.parse(readFile(path.join(SCRIPT_DIR, 'queue-index.json')) || 'null'); } catch { return null; }
})();
if (qi) {
  console.log('\n  QUEUE SNAPSHOT');
  console.log(`  pending: ${qi.totalPending}  (critical:${qi.criticalPending.length}  high:${qi.highPending.length}  medium:${qi.mediumPending.length}  low:${qi.lowPending.length})`);
  console.log(`  completed: ${qi.totalCompleted}  |  nextId: imp-${qi.nextImprovementId}`);
}

console.log('\n' + HR + '\n');
