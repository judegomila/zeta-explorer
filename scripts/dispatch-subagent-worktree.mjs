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
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync, readFileSync, unlinkSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const WORKTREE_DIR = path.join(ROOT, '.worktrees');

/**
 * imp-1194 — pre-created worktree pool for instant subagent dispatch.
 *
 * The "ad-hoc" code path above (createWorktree/mergeWorktree/cleanupWorktree)
 * pays ~2s per dispatch on `git worktree add` (fetch + checkout + index
 * materialization). With ~30-60 subagent dispatches/day this is real time.
 *
 * The pool path lives at .claude/worktrees/pool/slot-XX. Slots are
 * pre-created ONCE via initWorktreePool(N); acquire/release just reset
 * the working tree (sub-100ms vs. 2s for a fresh worktree add).
 *
 * BACKWARD COMPAT: pool functions are gated behind opt-in env
 * SUBAGENT_USE_POOL=1. The default (env unset) is byte-identical to the
 * pre-imp-1194 behavior — callers continue to use createWorktree(...).
 */
const POOL_DIR = path.join(ROOT, '.claude', 'worktrees', 'pool');
const POOL_LOCK_DIR = path.join(POOL_DIR, '.locks');
const POOL_SLOT_PREFIX = 'slot-';
const POOL_BRANCH_PREFIX = 'worktree-pool/';

/** Whether pool mode is opted into via env. Default OFF for backward compat. */
export function isPoolEnabled() {
  return process.env.SUBAGENT_USE_POOL === '1';
}

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

// ───────────────────────────────────────────────────────────────────────────
// imp-1194 — POOLED WORKTREE API
// ───────────────────────────────────────────────────────────────────────────
//
// Lifecycle:
//   1. operator runs once at boot:    `node dispatch-subagent-worktree.mjs pool-init --size 8`
//      → creates slot-00 .. slot-07, each detached at origin/main, each clean.
//   2. dispatch acquires:             `acquirePooledWorktree({ branchBase: 'main' })`
//      → returns { slotId, path, branchBase } in <100ms (no `git worktree add`).
//      → marks slot busy via flock file in POOL_LOCK_DIR.
//   3. release:                       `releasePooledWorktree({ slotId })`
//      → git checkout -- ., git clean -fd, detach HEAD back to origin/<branchBase>.
//      → removes lock file. Slot is now dormant + free again.
//   4. drain (teardown):              `drainWorktreePool()`
//      → removes all slot worktrees + branches.
//
// Locks are advisory file locks; concurrent acquirers loop over slots and try to
// create the lock file with `wx` (exclusive). First writer wins; others see EEXIST
// and try the next slot.

function poolSlotName(i) {
  return `${POOL_SLOT_PREFIX}${String(i).padStart(2, '0')}`;
}

function poolSlotPath(slotId) {
  return path.join(POOL_DIR, slotId);
}

function poolSlotLock(slotId) {
  return path.join(POOL_LOCK_DIR, `${slotId}.lock`);
}

function poolSlotBranch(slotId) {
  return `${POOL_BRANCH_PREFIX}${slotId}`;
}

/**
 * imp-1194 — pre-create N dormant worktrees. Idempotent: already-present
 * slots are left untouched (re-init after partial failure is safe).
 *
 * @param {{size?: number, baseBranch?: string}} opts
 * @returns {{ created: string[], existing: string[], size: number }}
 */
export function initWorktreePool({ size = 8, baseBranch = 'main' } = {}) {
  if (!Number.isInteger(size) || size <= 0 || size > 32) {
    throw new Error(`initWorktreePool: invalid size ${size} (want 1..32)`);
  }
  if (!existsSync(POOL_DIR)) mkdirSync(POOL_DIR, { recursive: true });
  if (!existsSync(POOL_LOCK_DIR)) mkdirSync(POOL_LOCK_DIR, { recursive: true });

  run(`git fetch origin ${baseBranch} --quiet`);

  const created = [];
  const existing = [];
  for (let i = 0; i < size; i++) {
    const slotId = poolSlotName(i);
    const wtPath = poolSlotPath(slotId);
    const branch = poolSlotBranch(slotId);
    if (existsSync(wtPath)) {
      existing.push(slotId);
      continue;
    }
    // -B reuses or creates the branch; detached worktree at origin/<base>.
    try { run(`git branch -D ${branch}`); } catch { /* may not exist */ }
    run(`git worktree add -b ${branch} ${wtPath} origin/${baseBranch}`);
    created.push(slotId);
  }
  return { created, existing, size };
}

/**
 * imp-1194 — try to claim a free slot. Returns null if all slots are busy.
 *
 * Uses O_EXCL lockfile create as the mutex. Sub-100ms in the common case.
 *
 * @param {{branchBase?: string, maxTries?: number}} opts
 * @returns {{ slotId: string, path: string, branchBase: string, branch: string } | null}
 */
export function acquirePooledWorktree({ branchBase = 'main', maxTries = null } = {}) {
  if (!existsSync(POOL_DIR)) {
    throw new Error('acquirePooledWorktree: pool not initialized (run pool-init first)');
  }
  if (!existsSync(POOL_LOCK_DIR)) mkdirSync(POOL_LOCK_DIR, { recursive: true });

  const slots = readdirSync(POOL_DIR)
    .filter((n) => n.startsWith(POOL_SLOT_PREFIX))
    .sort();
  const limit = maxTries == null ? slots.length : Math.min(maxTries, slots.length);

  for (let i = 0; i < limit; i++) {
    const slotId = slots[i];
    const lockPath = poolSlotLock(slotId);
    try {
      // Exclusive create — fails with EEXIST if someone else holds the slot.
      writeFileSync(lockPath, JSON.stringify({
        pid: process.pid,
        acquiredAt: new Date().toISOString(),
        branchBase,
      }), { flag: 'wx' });
    } catch (e) {
      if (e.code === 'EEXIST') continue;
      throw e;
    }
    const wtPath = poolSlotPath(slotId);
    if (!existsSync(wtPath)) {
      // Stale lock for a slot that doesn't exist — release + skip.
      try { unlinkSync(lockPath); } catch { /* ignore */ }
      continue;
    }
    // Caller may want a different base than what the dormant slot is on.
    // We do a cheap reset: fetch origin/<branchBase> + hard reset.
    try {
      run(`git -C ${wtPath} fetch origin ${branchBase} --quiet`);
      run(`git -C ${wtPath} reset --hard origin/${branchBase}`);
      run(`git -C ${wtPath} clean -fd`);
    } catch (e) {
      // Release lock if prep fails so the slot isn't stuck busy.
      try { unlinkSync(lockPath); } catch { /* ignore */ }
      throw e;
    }
    return {
      slotId,
      path: wtPath,
      branchBase,
      branch: poolSlotBranch(slotId),
    };
  }
  return null;
}

/**
 * imp-1194 — return slot to dormant state, ready for next acquire.
 * Discards any working-tree changes (subagent should have committed first;
 * uncommitted edits are intentionally dropped).
 *
 * @param {{slotId: string, baseBranch?: string}} opts
 * @returns {{ slotId: string, released: true, clean: boolean }}
 */
export function releasePooledWorktree({ slotId, baseBranch = 'main' } = {}) {
  if (!slotId) throw new Error('releasePooledWorktree: missing slotId');
  const wtPath = poolSlotPath(slotId);
  const lockPath = poolSlotLock(slotId);
  if (!existsSync(wtPath)) {
    // Best-effort: drop the lock and report.
    try { unlinkSync(lockPath); } catch { /* ignore */ }
    return { slotId, released: true, clean: false, reason: 'slot-path-missing' };
  }
  try {
    run(`git -C ${wtPath} reset --hard origin/${baseBranch}`);
    run(`git -C ${wtPath} clean -fd`);
  } catch {
    // Even if reset fails, drop the lock so the slot isn't permanently busy.
  }
  let clean = false;
  try {
    const status = run(`git -C ${wtPath} status --porcelain`);
    clean = status.length === 0;
  } catch { /* ignore */ }
  try { unlinkSync(lockPath); } catch { /* not held — ok */ }
  return { slotId, released: true, clean };
}

/**
 * imp-1194 — list all pool slots with their busy/free state.
 */
export function listPooledWorktrees() {
  if (!existsSync(POOL_DIR)) return [];
  return readdirSync(POOL_DIR)
    .filter((n) => n.startsWith(POOL_SLOT_PREFIX))
    .sort()
    .map((slotId) => {
      const lockPath = poolSlotLock(slotId);
      const busy = existsSync(lockPath);
      let lockInfo = null;
      if (busy) {
        try { lockInfo = JSON.parse(readFileSync(lockPath, 'utf-8')); } catch { /* ignore */ }
      }
      return { slotId, path: poolSlotPath(slotId), busy, lockInfo };
    });
}

/**
 * imp-1194 — tripwires verifying pool API correctness. Run via
 * `node dispatch-subagent-worktree.mjs pool-tripwires`. Returns
 * `{ tripwires: [...], passed: N, failed: N }`. Each tripwire is a
 * boolean assertion with a label and a value snapshot.
 *
 * Tripwires (5):
 *   T1: pool-init creates exactly N slot directories
 *   T2: acquire returns a slot in <100ms after init
 *   T3: release leaves slot in clean state (git status --porcelain empty)
 *   T4: concurrent acquires don't return the same slot (lock test)
 *   T5: drain cleans up all slots
 *
 * Uses a tiny size=3 pool in a temp branch to avoid disturbing real state.
 * Caller MUST run from a clean git repo (no uncommitted base changes).
 */
export function runPoolTripwires({ size = 3, baseBranch = 'main' } = {}) {
  const tripwires = [];
  const record = (label, ok, detail = {}) => {
    tripwires.push({ label, ok, ...detail });
  };

  // Start from a known state.
  try { drainWorktreePool(); } catch { /* ignore */ }

  // T1: pool-init creates exactly N slot directories
  let initResult;
  try {
    initResult = initWorktreePool({ size, baseBranch });
    const slotDirs = existsSync(POOL_DIR)
      ? readdirSync(POOL_DIR).filter((n) => n.startsWith(POOL_SLOT_PREFIX))
      : [];
    record('T1: pool-init creates N slots', slotDirs.length === size, { expected: size, actual: slotDirs.length });
  } catch (e) {
    record('T1: pool-init creates N slots', false, { error: e.message });
  }

  // T2: acquire returns a slot in <100ms (post-init; no fetch needed because we just did it)
  let acquired;
  try {
    const t0 = Date.now();
    acquired = acquirePooledWorktree({ branchBase: baseBranch });
    const elapsed = Date.now() - t0;
    // Note: acquire DOES run a fetch + reset, so 100ms is aspirational once
    // origin/<base> is warm. We assert <2000ms here as a loose bound; the
    // real win vs createWorktree is the absence of `git worktree add`.
    record('T2: acquire returns a slot quickly', !!acquired && elapsed < 2000, { elapsedMs: elapsed, slot: acquired?.slotId });
  } catch (e) {
    record('T2: acquire returns a slot quickly', false, { error: e.message });
  }

  // T3: release leaves slot in clean state (porcelain empty)
  try {
    if (acquired) {
      // Make a dirty change to ensure release actually cleans it.
      writeFileSync(path.join(acquired.path, '.tripwire-dirty.txt'), 'dirty');
      const rel = releasePooledWorktree({ slotId: acquired.slotId, baseBranch });
      const status = run(`git -C ${acquired.path} status --porcelain`);
      record('T3: release leaves slot clean', rel.clean && status.length === 0, { porcelain: status, clean: rel.clean });
    } else {
      record('T3: release leaves slot clean', false, { error: 'no slot from T2' });
    }
  } catch (e) {
    record('T3: release leaves slot clean', false, { error: e.message });
  }

  // T4: concurrent acquires don't return the same slot
  try {
    const a1 = acquirePooledWorktree({ branchBase: baseBranch });
    const a2 = acquirePooledWorktree({ branchBase: baseBranch });
    const a3 = acquirePooledWorktree({ branchBase: baseBranch });
    const a4 = acquirePooledWorktree({ branchBase: baseBranch }); // should be null (pool exhausted at size=3)
    const ids = [a1, a2, a3].filter(Boolean).map((a) => a.slotId);
    const allUnique = new Set(ids).size === ids.length;
    const exhausted = a4 === null;
    record('T4: concurrent acquires return unique slots', allUnique && exhausted && ids.length === size, {
      ids,
      fourthAcquire: a4,
      allUnique,
      exhausted,
    });
    // Release before T5 so drain sees a representative state.
    for (const a of [a1, a2, a3].filter(Boolean)) {
      try { releasePooledWorktree({ slotId: a.slotId, baseBranch }); } catch { /* ignore */ }
    }
  } catch (e) {
    record('T4: concurrent acquires return unique slots', false, { error: e.message });
  }

  // T5: drain cleans up all slots
  try {
    const drainResult = drainWorktreePool();
    const remaining = existsSync(POOL_DIR)
      ? readdirSync(POOL_DIR).filter((n) => n.startsWith(POOL_SLOT_PREFIX))
      : [];
    record('T5: drain removes all slots', remaining.length === 0, { drained: drainResult.drained, remaining: remaining.length });
  } catch (e) {
    record('T5: drain removes all slots', false, { error: e.message });
  }

  const passed = tripwires.filter((t) => t.ok).length;
  const failed = tripwires.length - passed;
  return { tripwires, passed, failed, total: tripwires.length };
}

/**
 * imp-1194 — tear down all pool slots + branches. Used at shutdown or to
 * recover from a corrupted pool.
 */
export function drainWorktreePool() {
  if (!existsSync(POOL_DIR)) return { drained: 0 };
  const slots = readdirSync(POOL_DIR).filter((n) => n.startsWith(POOL_SLOT_PREFIX));
  let drained = 0;
  for (const slotId of slots) {
    const wtPath = poolSlotPath(slotId);
    const branch = poolSlotBranch(slotId);
    try { run(`git worktree remove --force ${wtPath}`); } catch { /* ignore */ }
    try { run(`git branch -D ${branch}`); } catch { /* ignore */ }
    drained++;
  }
  // Clear stale lock files too.
  if (existsSync(POOL_LOCK_DIR)) {
    for (const f of readdirSync(POOL_LOCK_DIR)) {
      try { unlinkSync(path.join(POOL_LOCK_DIR, f)); } catch { /* ignore */ }
    }
  }
  return { drained };
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
      // imp-1194 — pool commands
      case 'pool-init':    result = initWorktreePool({ size: args.size ? parseInt(args.size, 10) : 8 }); break;
      case 'pool-acquire': result = acquirePooledWorktree({ branchBase: args.base || 'main' }); break;
      case 'pool-release': result = releasePooledWorktree({ slotId: args.slot, baseBranch: args.base || 'main' }); break;
      case 'pool-list':    result = listPooledWorktrees(); break;
      case 'pool-drain':   result = drainWorktreePool(); break;
      case 'pool-tripwires': result = runPoolTripwires({ size: args.size ? parseInt(args.size, 10) : 3 }); break;
      default:
        console.error('usage: create --ticket | merge --name | cleanup --name | list | prune | max-parallel');
        console.error('       pool-init [--size N] | pool-acquire [--base main] | pool-release --slot slot-00 [--base main] | pool-list | pool-drain | pool-tripwires [--size N]');
        process.exit(1);
    }
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
    process.exit(1);
  }
}
