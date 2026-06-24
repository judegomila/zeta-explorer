#!/usr/bin/env node
// Emits public/fleet-status.json — a small, committed snapshot of "are we working":
// git check-in activity + engine fleet + queue burn-down + recent completions.
// The Engine Room page fetches this client-side and auto-refreshes. Kept tiny so
// it's cheap to import/serve and cheap to commit.
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'fleet-status.json');
const sh = (cmd) => { try { return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return ''; } };
const now = Date.now();

// ── git: check-in activity ──────────────────────────────────────────────────
const lastSha = sh('git rev-parse --short HEAD');
const lastMsg = sh('git log -1 --format=%s');
const lastAt = sh('git log -1 --format=%cI');
const commitsLastHour = parseInt(sh('git log --since="1 hour ago" --oneline | wc -l') || '0', 10);
const commits24h = parseInt(sh('git log --since="24 hours ago" --oneline | wc -l') || '0', 10);
const localHead = sh('git rev-parse HEAD');
const originHead = sh('git rev-parse origin/main 2>/dev/null');
const ahead = parseInt(sh('git rev-list --count origin/main..HEAD 2>/dev/null') || '0', 10);

// ── fleet: engines + live workers ───────────────────────────────────────────
function freshHeartbeats(glob) {
  try {
    return fs.readdirSync(path.join(ROOT, 'scripts'))
      .filter((f) => f.startsWith(glob))
      .filter((f) => { try { return now - fs.statSync(path.join(ROOT, 'scripts', f)).mtimeMs < 180000; } catch { return false; } })
      .length;
  } catch { return 0; }
}
const running = (name) => sh(`pgrep -f "${name} start" | head -1`) !== '';
const liveAgents = parseInt(sh('ps -eo command | grep "claude --print" | grep -v grep | wc -l') || '0', 10);
const apiWorkers = freshHeartbeats('.heartbeat-api-pool-w');
const engines = [
  { name: 'API pool', channel: 'ANTHROPIC_API_KEY', model: 'opus-4-8', workers: running('auto-improve-api-pool.sh') ? Math.max(apiWorkers, 1) : 0, on: running('auto-improve-api-pool.sh') },
  { name: 'Sonnet', channel: 'sonnet', model: 'sonnet-4-6', workers: running('auto-improve-sonnet.sh') ? 1 : 0, on: running('auto-improve-sonnet.sh') },
  { name: 'Subscription', channel: 'subscription', model: 'opus-4-7', workers: running('auto-improve.sh') ? 1 : 0, on: running('auto-improve.sh') },
  { name: 'Haiku', channel: 'subscription', model: 'haiku-4-5', workers: running('auto-improve-haiku.sh') ? 1 : 0, on: running('auto-improve-haiku.sh') },
];
const totalWorkers = engines.reduce((n, e) => n + e.workers, 0);

// ── queue: pending burn-down ────────────────────────────────────────────────
let pending = null, byModel = {};
try {
  const idx = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'queue-index.json'), 'utf8'));
  pending = idx.totalPending ?? null;
  const bm = idx.byModel || {};
  for (const [k, v] of Object.entries(bm)) byModel[k] = Array.isArray(v) ? v.length : v;
} catch {}

// ── recent completions (tail of improvements.js, parsed light) ──────────────
let recent = [];
try {
  const log = fs.readFileSync(path.join(ROOT, 'src', 'data', 'improvements.js'), 'utf8');
  const re = /\{\s*id:\s*\d+,\s*timestamp:\s*"([^"]*)",\s*category:\s*"([^"]*)",\s*summary:\s*"((?:[^"\\]|\\.)*)"/g;
  const all = [...log.matchAll(re)];
  recent = all.slice(-18).reverse().map((m) => {
    const summary = m[3].replace(/\\"/g, '"');
    const impMatch = summary.match(/imp-\d+/);
    return { imp: impMatch ? impMatch[0] : '', category: m[2], at: m[1], summary: summary.slice(0, 140) };
  });
} catch {}

const status = {
  generatedAt: new Date(now).toISOString(),
  git: {
    lastSha, lastMessage: lastMsg.slice(0, 120), lastCommitAt: lastAt,
    commitsLastHour, commits24h,
    synced: localHead && originHead ? localHead === originHead : null,
    unpushed: ahead,
    repoCommitsUrl: 'https://github.com/judegomila/mathexplorer/commits/main',
  },
  fleet: { engines, totalWorkers, liveAgentsNow: liveAgents },
  queue: { pending, byModel, completed24h: commits24h },
  recent,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
// change-detection: ignore generatedAt so we only rewrite/commit on real change
let prevSig = '';
try { const p = JSON.parse(fs.readFileSync(OUT, 'utf8')); delete p.generatedAt; prevSig = JSON.stringify(p); } catch {}
const cur = { ...status }; delete cur.generatedAt;
const changed = JSON.stringify(cur) !== prevSig;
fs.writeFileSync(OUT, JSON.stringify(status, null, 2));
console.log(changed ? 'CHANGED' : 'unchanged', `pending=${pending} workers=${totalWorkers} commits/h=${commitsLastHour}`);
process.exit(changed ? 10 : 0); // exit 10 = meaningful change (loop commits on 10)
