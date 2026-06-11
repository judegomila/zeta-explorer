#!/usr/bin/env node
// scripts/gc-worktrees.mjs
// Garbage-collect stale .claude/worktrees/agent-* subagent worktrees (imp-1277).
//
// Past subagent runs leave behind dozens of agent-* worktree directories that
// pollute `git status` output and waste orchestrator attention. This drops the
// ones that are safe to remove: clean (no uncommitted changes) AND either
// merged into main OR untouched for longer than the staleness window.
//
// Usage:
//   node scripts/gc-worktrees.mjs            dry-run — list removal candidates only (default)
//   node scripts/gc-worktrees.mjs --apply    actually remove (prompts per worktree)
//   node scripts/gc-worktrees.mjs --apply --force   remove without prompting
//   node scripts/gc-worktrees.mjs --days=14  override 7-day staleness window
//
// Removal = `git worktree remove --force <path>` + `git branch -D <branch>`.
// SAFETY: dirty worktrees (uncommitted changes) are NEVER removal candidates.

import { execSync } from 'child_process';
import { statSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = dirname(__dirname);
const WORKTREE_DIR = join(REPO_ROOT, '.claude', 'worktrees');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const FORCE = args.includes('--force');
const daysArg = args.find(a => a.startsWith('--days='));
const STALE_DAYS = daysArg ? parseInt(daysArg.split('=')[1], 10) : 7;
const STALE_MS = STALE_DAYS * 24 * 60 * 60 * 1000;

if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node scripts/gc-worktrees.mjs [--apply] [--force] [--days=N]');
  console.log('  (no flags)  dry-run: list removal candidates only');
  console.log('  --apply     actually remove worktrees (prompts per item)');
  console.log('  --force     skip per-item confirmation (implies removal under --apply)');
  console.log('  --days=N    staleness window in days (default 7)');
  process.exit(0);
}

function git(cmd, opts = {}) {
  return execSync(`git ${cmd}`, { cwd: REPO_ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...opts }).trim();
}

// Map worktree path -> checked-out branch via `git worktree list --porcelain`.
function worktreeBranches() {
  const map = new Map();
  let curPath = null;
  for (const line of git('worktree list --porcelain').split('\n')) {
    if (line.startsWith('worktree ')) curPath = line.slice('worktree '.length);
    else if (line.startsWith('branch ') && curPath) {
      map.set(curPath, line.slice('branch '.length).replace(/^refs\/heads\//, ''));
    }
  }
  return map;
}

// Branches already merged into main.
function mergedBranches() {
  const set = new Set();
  try {
    for (const line of git('branch --merged main').split('\n')) {
      const b = line.replace(/^[*+ ]+/, '').trim();
      if (b) set.add(b);
    }
  } catch (_) { /* main may not exist in odd states; treat as none merged */ }
  return set;
}

function isClean(path) {
  // -uno: ignore untracked build artifacts (node_modules, .cache). Only modified
  // or staged TRACKED files count as uncommitted work that blocks removal.
  try {
    return git('status --porcelain -uno', { cwd: path }).length === 0;
  } catch (_) {
    return false; // can't inspect -> treat as dirty (do not remove)
  }
}

function ageMs(path) {
  try { return Date.now() - statSync(path).mtimeMs; } catch (_) { return 0; }
}

function main() {
  if (!existsSync(WORKTREE_DIR)) {
    console.log(`gc-worktrees: no worktree dir at ${WORKTREE_DIR} — nothing to do.`);
    return;
  }
  const branchMap = worktreeBranches();
  const merged = mergedBranches();

  // Enumerate registered worktrees under WORKTREE_DIR matching agent-*.
  const candidates = [];
  const skipped = [];
  for (const [path] of branchMap) {
    if (dirname(path) !== WORKTREE_DIR) continue;
    if (!basename(path).startsWith('agent-')) continue;
    const branch = branchMap.get(path);
    const clean = isClean(path);
    const isMerged = branch ? merged.has(branch) : false;
    const stale = ageMs(path) > STALE_MS;
    // Removal rule: must be clean, and (merged OR stale).
    if (clean && (isMerged || stale)) {
      candidates.push({ path, branch, isMerged, stale });
    } else {
      skipped.push({ path, branch, reason: !clean ? 'dirty' : 'recent+unmerged' });
    }
  }

  console.log(`gc-worktrees: ${branchMap.size} registered worktrees, ${candidates.length} removal candidates, ${skipped.length} kept.`);
  console.log(`  staleness window: ${STALE_DAYS} days   mode: ${APPLY ? (FORCE ? 'apply --force' : 'apply') : 'dry-run'}\n`);

  for (const c of candidates) {
    const why = c.isMerged ? 'merged' : 'stale';
    console.log(`  candidate: ${basename(c.path)}  [branch ${c.branch || '(detached)'}, ${why}]`);
  }
  if (!APPLY) {
    console.log(`\n(dry-run) re-run with --apply to remove the ${candidates.length} candidate(s).`);
    return;
  }
  if (candidates.length === 0) return;

  removeAll(candidates).catch(err => { console.error(err); process.exit(1); });
}

async function removeAll(candidates) {
  const rl = FORCE ? null : createInterface({ input: process.stdin, output: process.stdout });
  const ask = q => new Promise(res => rl.question(q, res));
  let removed = 0;
  for (const c of candidates) {
    if (!FORCE) {
      const ans = (await ask(`remove ${basename(c.path)} (branch ${c.branch || '-'})? [y/N] `)).trim().toLowerCase();
      if (ans !== 'y' && ans !== 'yes') { console.log('  skipped.'); continue; }
    }
    try {
      git(`worktree remove --force "${c.path}"`);
      if (c.branch) { try { git(`branch -D "${c.branch}"`); } catch (_) { /* branch may be gone */ } }
      removed++;
      console.log(`  removed ${basename(c.path)}`);
    } catch (err) {
      console.error(`  FAILED ${basename(c.path)}: ${err.message.split('\n')[0]}`);
    }
  }
  if (rl) rl.close();
  console.log(`\ngc-worktrees: removed ${removed} worktree(s).`);
}

main();
