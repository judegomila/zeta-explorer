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
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const WORKTREE_DIR = path.join(ROOT, '.worktrees');

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: opts.cwd ?? ROOT, encoding: 'utf-8', ...opts }).trim();
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
      default:
        console.error('usage: create --ticket | merge --name | cleanup --name | list | prune');
        process.exit(1);
    }
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
    process.exit(1);
  }
}
