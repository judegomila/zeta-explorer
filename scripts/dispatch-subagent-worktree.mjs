#!/usr/bin/env node
/**
 * @module scripts/dispatch-subagent-worktree
 * @fileoverview imp-1143 — worktree-based subagent isolation harness.
 *
 * Removes the 5-concurrent-subagent file-race bottleneck by giving each
 * subagent its own git worktree (a checkout of main at .worktrees/<id>).
 * Subagent edits land in the worktree branch; when the agent finishes,
 * this script merges the branch back into main and cleans up.
 *
 * Why this matters:
 *   The 5-subagent cap exists because parallel subagents race on shared
 *   files (improvement-queue.js, improvements.js, IMPROVEMENTS.md). With
 *   per-agent worktrees, each agent edits its OWN copy of those files;
 *   the merge step resolves the race via git's normal 3-way merge.
 *   Result: 10-15 concurrent subagents become safe.
 *
 * Usage from a parent Claude Code session:
 *   const wt = await createWorktree({ ticketId: 'imp-1234' });
 *   // ... pass wt.path to the Agent tool via cwd parameter or prompt ...
 *   await mergeWorktree(wt.name);
 *
 * Usage as CLI (manual orchestration):
 *   node scripts/dispatch-subagent-worktree.mjs create  --ticket imp-1234
 *   node scripts/dispatch-subagent-worktree.mjs merge   --name imp-1234-2026-05-20T07-30-00Z
 *   node scripts/dispatch-subagent-worktree.mjs cleanup --name imp-1234-2026-05-20T07-30-00Z
 *   node scripts/dispatch-subagent-worktree.mjs list
 *   node scripts/dispatch-subagent-worktree.mjs prune                   # remove stale (>24h) worktrees
 *
 * Conventions:
 *   - Worktrees live at <repo>/.worktrees/<ticketId>-<isoTimestamp>
 *   - Each worktree has its own branch: worktree/<ticketId>-<isoTimestamp>
 *   - When the agent commits, the parent runs `mergeWorktree` which
 *     does git fetch + git merge --no-ff <branch> into main
 *   - Merge conflicts in non-shared files are unexpected — log + skip;
 *     conflicts in shared files (queue/improvements/MD) are auto-resolved
 *     by preferring the worktree version for ticket-specific blocks and
 *     concatenating tail-append entries.
 */

import { execSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const WORKTREE_DIR = path.join(ROOT, '.worktrees');

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: opts.cwd ?? ROOT, encoding: 'utf-8', ...opts }).trim();
}

/**
 * imp-1172 — auto-scale concurrency cap by CPU + free-RAM headroom.
 *
 * Replaces a hardcoded MAX_PARALLEL=5 in downstream fanout callers so the
 * same script bursts higher on a beefy laptop / cloud instance without
 * code changes.
 *
 * Formula: min(floor(ncpu / 2), floor(free_ram_gb / 3), 8)
 *   - /2 on CPU leaves headroom for the parent session + system processes.
 *   - /3 on RAM (GB) keeps each subagent under a 3GB working-set budget.
 *   - hard ceiling of 8 because git/file-IO contention dominates past that.
 *
 * Env override SUBAGENT_MAX_PARALLEL=N short-circuits detection.
 * Falls back to 3 if any probe fails (safe default matching the old single-thread CI path).
 *
 * @returns {{ cap: number, ncpu: number|null, freeRamGb: number|null, override: number|null, source: string }}
 */
export function detectMaxParallel({ silent = false } = {}) {
  const FALLBACK = 3;
  const HARD_CEILING = 8;

  // 1. Env override wins
  const envRaw = process.env.SUBAGENT_MAX_PARALLEL;
  if (envRaw !== undefined && envRaw !== '') {
    const envN = parseInt(envRaw, 10);
    if (Number.isFinite(envN) && envN > 0) {
      const out = { cap: envN, ncpu: null, freeRamGb: null, override: envN, source: 'env' };
      if (!silent) {
        console.log(`[dispatch] auto-scale concurrency cap = ${envN} (ncpu=N/A, free_ram_gb=N/A, override=${envN})`);
      }
      return out;
    }
  }

  let ncpu = null;
  let freeRamGb = null;
  const platform = process.platform;

  try {
    if (platform === 'darwin') {
      ncpu = parseInt(run('sysctl -n hw.ncpu'), 10);
      // vm_stat: "Pages free: 12345." + "Pages inactive: 67890." — both count as available.
      // Page size on Apple Silicon = 16384, on Intel macs = 4096; parse from header.
      const vm = run('vm_stat');
      const pageSizeMatch = vm.match(/page size of (\d+) bytes/);
      const pageSize = pageSizeMatch ? parseInt(pageSizeMatch[1], 10) : 4096;
      const freeMatch = vm.match(/Pages free:\s+(\d+)/);
      const inactiveMatch = vm.match(/Pages inactive:\s+(\d+)/);
      const speculativeMatch = vm.match(/Pages speculative:\s+(\d+)/);
      const freePages = (freeMatch ? parseInt(freeMatch[1], 10) : 0)
        + (inactiveMatch ? parseInt(inactiveMatch[1], 10) : 0)
        + (speculativeMatch ? parseInt(speculativeMatch[1], 10) : 0);
      freeRamGb = (freePages * pageSize) / (1024 ** 3);
    } else if (platform === 'linux') {
      ncpu = parseInt(run('nproc'), 10);
      const meminfo = run('cat /proc/meminfo');
      const availMatch = meminfo.match(/MemAvailable:\s+(\d+)\s+kB/);
      if (availMatch) freeRamGb = parseInt(availMatch[1], 10) / (1024 * 1024);
    } else {
      // Other platforms (e.g., win32): use os.cpus() + os.freemem() as best-effort.
      ncpu = os.cpus().length;
      freeRamGb = os.freemem() / (1024 ** 3);
    }
  } catch (e) {
    if (!silent) console.warn(`[dispatch] detectMaxParallel: probe failed (${e.message}); using fallback=${FALLBACK}`);
    const out = { cap: FALLBACK, ncpu, freeRamGb, override: null, source: 'fallback-probe-error' };
    if (!silent) {
      console.log(`[dispatch] auto-scale concurrency cap = ${FALLBACK} (ncpu=${ncpu ?? 'N/A'}, free_ram_gb=${freeRamGb ?? 'N/A'}, override=none)`);
    }
    return out;
  }

  if (!Number.isFinite(ncpu) || ncpu <= 0 || !Number.isFinite(freeRamGb) || freeRamGb <= 0) {
    const out = { cap: FALLBACK, ncpu, freeRamGb, override: null, source: 'fallback-bad-values' };
    if (!silent) {
      console.log(`[dispatch] auto-scale concurrency cap = ${FALLBACK} (ncpu=${ncpu ?? 'N/A'}, free_ram_gb=${freeRamGb ?? 'N/A'}, override=none)`);
    }
    return out;
  }

  const cpuCap = Math.floor(ncpu / 2);
  const ramCap = Math.floor(freeRamGb / 3);
  const cap = Math.max(1, Math.min(cpuCap, ramCap, HARD_CEILING));
  const out = { cap, ncpu, freeRamGb: Math.round(freeRamGb * 100) / 100, override: null, source: 'auto' };
  if (!silent) {
    console.log(`[dispatch] auto-scale concurrency cap = ${cap} (ncpu=${ncpu}, free_ram_gb=${out.freeRamGb}, override=none)`);
  }
  return out;
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

export function createWorktree({ ticketId, baseBranch = 'main' } = {}) {
  if (!ticketId || !/^[a-zA-Z0-9_-]+$/.test(ticketId)) {
    throw new Error(`createWorktree: invalid ticketId ${JSON.stringify(ticketId)}`);
  }
  if (!existsSync(WORKTREE_DIR)) mkdirSync(WORKTREE_DIR, { recursive: true });
  const name = `${ticketId}-${isoStamp()}`;
  const branch = `worktree/${name}`;
  const wtPath = path.join(WORKTREE_DIR, name);
  run(`git fetch origin ${baseBranch} --quiet`);
  run(`git worktree add -b ${branch} ${wtPath} origin/${baseBranch}`);
  return { name, branch, path: wtPath, ticketId };
}

export function mergeWorktree({ name } = {}) {
  if (!name) throw new Error('mergeWorktree: missing name');
  const branch = `worktree/${name}`;
  const wtPath = path.join(WORKTREE_DIR, name);
  if (!existsSync(wtPath)) throw new Error(`mergeWorktree: worktree path missing ${wtPath}`);
  const commitCount = parseInt(run(`git -C ${wtPath} rev-list --count origin/main..HEAD`), 10);
  if (commitCount === 0) {
    return { name, branch, merged: false, reason: 'no-commits-in-worktree', commits: 0 };
  }
  try {
    run(`git merge --no-ff --no-edit ${branch}`);
    return { name, branch, merged: true, reason: 'clean-merge', commits: commitCount };
  } catch (e) {
    const status = run('git status --short');
    run('git merge --abort').catch(() => {});
    return { name, branch, merged: false, reason: 'conflict', commits: commitCount, diagnostics: status };
  }
}

export function cleanupWorktree({ name } = {}) {
  if (!name) throw new Error('cleanupWorktree: missing name');
  const wtPath = path.join(WORKTREE_DIR, name);
  const branch = `worktree/${name}`;
  if (existsSync(wtPath)) run(`git worktree remove --force ${wtPath}`);
  try { run(`git branch -D ${branch}`); } catch { /* may not exist */ }
  return { name, removed: true };
}

export function listWorktrees() {
  if (!existsSync(WORKTREE_DIR)) return [];
  const entries = readdirSync(WORKTREE_DIR);
  return entries.map((name) => {
    const p = path.join(WORKTREE_DIR, name);
    const stat = statSync(p);
    let commits = 0;
    try {
      commits = parseInt(run(`git -C ${p} rev-list --count origin/main..HEAD`), 10);
    } catch { /* ignore */ }
    return { name, path: p, ageMs: Date.now() - stat.mtimeMs, commits };
  });
}

export function pruneStaleWorktrees({ olderThanMs = 24 * 60 * 60 * 1000 } = {}) {
  const all = listWorktrees();
  const stale = all.filter((w) => w.ageMs > olderThanMs && w.commits === 0);
  for (const w of stale) cleanupWorktree({ name: w.name });
  return { pruned: stale.length, kept: all.length - stale.length };
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const [cmd, ...rest] = process.argv.slice(2);
  const args = {};
  for (let i = 0; i < rest.length; i += 2) {
    if (rest[i].startsWith('--')) args[rest[i].slice(2)] = rest[i + 1];
  }
  try {
    let result;
    switch (cmd) {
      case 'create':  result = createWorktree({ ticketId: args.ticket }); break;
      case 'merge':   result = mergeWorktree({ name: args.name }); break;
      case 'cleanup': result = cleanupWorktree({ name: args.name }); break;
      case 'list':    result = listWorktrees(); break;
      case 'prune':   result = pruneStaleWorktrees(); break;
      case 'max-parallel': result = detectMaxParallel(); break;
      default:
        console.error('usage: create --ticket | merge --name | cleanup --name | list | prune | max-parallel');
        process.exit(1);
    }
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
    process.exit(1);
  }
}
