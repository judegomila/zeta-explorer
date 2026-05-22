#!/usr/bin/env node
// scripts/session-dashboard.mjs — imp-1177
// One-command operator status CLI. Read-only, no mutations.
// Prints in <2s: (1) engine table, (2) supervisor status,
// (3) pending queue by priority+bucket, (4) last 5 commits,
// (5) rate-limit hits in last 60 min, (6) Lambda bounds row.
//
// Usage:  node scripts/session-dashboard.mjs

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCRIPT_DIR = __dirname;
const PROJECT_DIR = path.dirname(SCRIPT_DIR);
const LOG_DIR = path.join(SCRIPT_DIR, 'logs');

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

function ageStr(epochMs) {
  if (!epochMs) return '?';
  const secs = Math.floor((Date.now() - epochMs) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function lastLogMtime(matchFn) {
  try {
    const files = fs.readdirSync(LOG_DIR)
      .filter(f => f.endsWith('.log') && matchFn(f))
      .sort();
    if (!files.length) return null;
    return fs.statSync(path.join(LOG_DIR, files[files.length - 1])).mtimeMs;
  } catch { return null; }
}

// ── (1) engine status ─────────────────────────────────────────────────────────

const ENGINES = [
  {
    name: 'subscription',
    pid: '.auto-improve.pid',
    hb: '.heartbeat',
    logMatch: f => /^run_\d{4}-/.test(f),
  },
  {
    name: 'api',
    pid: '.auto-improve-api.pid',
    hb: '.heartbeat-api',
    logMatch: f => f.startsWith('run_api_'),
  },
  {
    name: 'sonnet',
    pid: '.auto-improve-sonnet.pid',
    hb: null,
    logMatch: f => f.startsWith('run_sonnet_'),
  },
  {
    name: 'haiku',
    pid: '.auto-improve-haiku.pid',
    hb: null,
    logMatch: f => f.startsWith('run_haiku_'),
  },
];

function engineRows() {
  return ENGINES.map(e => {
    const running = pidAlive(e.pid);
    let lastMs = null;
    if (e.hb) {
      const raw = readFile(path.join(SCRIPT_DIR, e.hb));
      if (raw) lastMs = parseInt(raw.trim(), 10) * 1000;
    }
    if (!lastMs) lastMs = lastLogMtime(e.logMatch);
    return { name: e.name, running, age: ageStr(lastMs) };
  });
}

// ── (2) supervisor status ─────────────────────────────────────────────────────

function supervisorRows() {
  return [
    { name: 'push-watcher',    running: pidAlive('.push-watcher.pid') },
    { name: 'engine-watchdog', running: pidAlive('.engine-watchdog.pid') },
  ];
}

// ── (3) queue summary ─────────────────────────────────────────────────────────

function queueSection() {
  const raw = readFile(path.join(SCRIPT_DIR, 'queue-index.json'));
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

// ── (4) recent commits ────────────────────────────────────────────────────────

function recentCommits() {
  try {
    return execSync(
      `git -C ${JSON.stringify(PROJECT_DIR)} log --oneline -5 --format="%h %s"`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim().split('\n').filter(Boolean);
  } catch { return []; }
}

// ── (5) rate-limit hits (last 60 min) ────────────────────────────────────────

function rateLimitHits() {
  const cutoff = Date.now() - 60 * 60 * 1000;
  const hits = [];
  try {
    const files = fs.readdirSync(LOG_DIR).filter(f => f.endsWith('.log'));
    for (const f of files) {
      const p = path.join(LOG_DIR, f);
      if (fs.statSync(p).mtimeMs < cutoff) continue;
      if (/429|rate.limit/i.test(readFile(p) || '')) hits.push(f);
    }
  } catch {}
  return hits;
}

// ── (6) Lambda bounds ─────────────────────────────────────────────────────────

function lambdaBounds() {
  try {
    const roadmap = path.join(PROJECT_DIR, 'src/data/lambda-roadmap.js');
    const out = execSync(
      `grep -m1 "targetSOTA" ${JSON.stringify(roadmap)}`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
    const m = out.match(/targetSOTA[^'"]*['"]([^'"]+)['"]/);
    return m ? m[1] : out.slice(0, 100);
  } catch { return 'see src/data/lambda-roadmap.js'; }
}

// ── render ────────────────────────────────────────────────────────────────────

const W = 68;
const HR = '─'.repeat(W);
const dot = b => b ? '●' : '○';

process.stdout.write('\n');
console.log(HR);
console.log('  ZPO / RH-ATTACK  —  ' + new Date().toISOString());
console.log(HR);

// (1) engines
console.log('\n  ENGINES');
for (const e of engineRows()) {
  const status = e.running ? 'RUNNING ' : 'STOPPED ';
  console.log(`  ${dot(e.running)}  ${e.name.padEnd(14)}  ${status}  last: ${e.age}`);
}

// (2) supervisors
console.log('\n  SUPERVISORS');
for (const s of supervisorRows()) {
  console.log(`  ${dot(s.running)}  ${s.name.padEnd(16)}  ${s.running ? 'RUNNING' : 'STOPPED'}`);
}

// (3) queue
console.log('\n  PENDING QUEUE');
const qi = queueSection();
if (qi) {
  const bm = qi.byModel || {};
  console.log(`  total: ${qi.totalPending} pending, ${qi.totalCompleted} completed  |  nextId: imp-${qi.nextImprovementId}`);
  console.log(`  critical:${qi.criticalPending.length}  high:${qi.highPending.length}  medium:${qi.mediumPending.length}  low:${qi.lowPending.length}`);
  const nonEmpty = Object.entries(bm).filter(([, t]) => t.length > 0);
  if (nonEmpty.length) {
    console.log('  by engine:');
    for (const [model, tickets] of nonEmpty) {
      const sample = tickets.slice(0, 3).map(t => t.id).join(', ');
      const more = tickets.length > 3 ? ` +${tickets.length - 3}` : '';
      console.log(`    ${model.padEnd(12)}  ${tickets.length}  [${sample}${more}]`);
    }
  }
} else {
  console.log('  (queue-index.json missing)');
}

// (4) commits
console.log('\n  LAST 5 COMMITS');
const commits = recentCommits();
for (const c of commits) console.log(`  ${c.slice(0, W - 4)}`);
if (!commits.length) console.log('  (none)');

// (5) rate-limit
console.log('\n  RATE-LIMIT HITS  (last 60 min)');
const hits = rateLimitHits();
if (hits.length) {
  for (const h of hits) console.log(`  !! ${h}`);
} else {
  console.log('  none');
}

// (6) lambda
console.log('\n  LAMBDA BOUNDS');
console.log(`  ${lambdaBounds()}`);

console.log('\n' + HR + '\n');
