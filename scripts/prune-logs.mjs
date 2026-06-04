#!/usr/bin/env node
// scripts/prune-logs.mjs
//
// Closes imp-2348: scripts/logs/ grows without bound (16k-plus files from the
// per-engine run_* logs, assertion dumps, page-health snapshots, sweep logs).
// There was no retention policy, so the directory bloats the repo and slows
// tooling that has to stat or glob it. This script deletes log files whose
// last-modified time is older than a cutoff (default 30 days).
//
// DRY-RUN by default, mirroring scripts/rotate-improvements.mjs: it only
// deletes when invoked with --execute. The dry-run lists how many files and
// how many bytes would be reclaimed so an operator can confirm before acting.
//
// Retention is by mtime, not by parsing filenames, because scripts/logs holds
// several naming schemes (run_<engine>_<ts>.log, assertions-<ts>.md,
// page-health-<ts>.json, imp-<n>-sweep.log, fixed-name dumps like
// click-audit-FINAL.json, engine-watchdog.log). mtime is the one signal
// present on every file regardless of scheme.
//
// Usage:
//   node scripts/prune-logs.mjs                       # dry-run, 30-day cutoff
//   node scripts/prune-logs.mjs --execute             # delete old logs
//   node scripts/prune-logs.mjs --max-age-days 14     # custom cutoff
//   node scripts/prune-logs.mjs --execute --quiet     # silence per-file list
//
// Only regular files under scripts/logs/ (recursively) are considered;
// directories are left in place so the layout (e.g. logs/local-lane/) is
// preserved even after all their contents age out.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LOGS_DIR = path.join(PROJECT_ROOT, 'scripts/logs');

const argv = process.argv.slice(2);
const EXECUTE = argv.includes('--execute');
const QUIET = argv.includes('--quiet');
const ageIdx = argv.indexOf('--max-age-days');
const MAX_AGE_DAYS = ageIdx >= 0 ? Number(argv[ageIdx + 1]) : 30;
if (!Number.isFinite(MAX_AGE_DAYS) || MAX_AGE_DAYS <= 0) {
  console.error(`prune-logs: --max-age-days must be a positive number, got ${argv[ageIdx + 1]}`);
  process.exit(2);
}
const MAX_AGE_MS = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
const cutoffMs = Date.now() - MAX_AGE_MS;

function walkFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(full));
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function humanBytes(n) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let v = n;
  let u = 0;
  while (v >= 1024 && u < units.length - 1) {
    v /= 1024;
    u += 1;
  }
  return `${v.toFixed(u === 0 ? 0 : 1)} ${units[u]}`;
}

function main() {
  if (!fs.existsSync(LOGS_DIR)) {
    console.log(`prune-logs: ${path.relative(PROJECT_ROOT, LOGS_DIR)} does not exist — nothing to do.`);
    return;
  }

  const files = walkFiles(LOGS_DIR);
  const stale = [];
  let staleBytes = 0;
  for (const f of files) {
    const st = fs.statSync(f);
    if (st.mtimeMs < cutoffMs) {
      stale.push({ path: f, mtimeMs: st.mtimeMs, size: st.size });
      staleBytes += st.size;
    }
  }

  console.log(`prune-logs: cutoff = ${new Date(cutoffMs).toISOString()} (max-age-days=${MAX_AGE_DAYS})`);
  console.log(`  total log files  : ${files.length}`);
  console.log(`  would prune      : ${stale.length}`);
  console.log(`  would reclaim    : ${humanBytes(staleBytes)}`);

  if (stale.length === 0) {
    console.log('prune-logs: nothing older than cutoff — exiting cleanly.');
    return;
  }

  if (!QUIET) {
    const sorted = [...stale].sort((a, b) => a.mtimeMs - b.mtimeMs);
    const sample = sorted.slice(0, 5);
    console.log('  oldest to prune:');
    sample.forEach((e) =>
      console.log(`    ${path.relative(PROJECT_ROOT, e.path)}  (${new Date(e.mtimeMs).toISOString()})`),
    );
    if (stale.length > 5) console.log(`    ... and ${stale.length - 5} more`);
  }

  if (!EXECUTE) {
    console.log('\nprune-logs: DRY RUN (pass --execute to delete the files above).');
    return;
  }

  let removed = 0;
  for (const e of stale) {
    fs.unlinkSync(e.path);
    removed += 1;
  }
  console.log(`\nprune-logs: deleted ${removed} files, reclaimed ${humanBytes(staleBytes)}.`);
}

main();
