#!/usr/bin/env node
// scripts/salvage-subagent.mjs
// imp-1270: META-HARNESS CLI to automate the subagent-completion -> cherry-pick
// onto main salvage pattern. The orchestrator's manual loop is:
//   git fetch . worktree-agent-<id>:tmp-<id-short>
//   git cherry-pick <sha>
//   # resolve conflict in scripts/run-assertions.mjs DATA_MODULES (always
//   #   "we added different lines at the end of a list")
//   git branch -D tmp-<id-short>
// This script automates all four steps with a safe auto-resolution path for
// the DATA_MODULES conflict pattern and bails to manual for anything else.
//
// Usage:
//   node scripts/salvage-subagent.mjs --task <task-id>
//   node scripts/salvage-subagent.mjs --commit <sha>
//   node scripts/salvage-subagent.mjs --worktree <path>
//   node scripts/salvage-subagent.mjs --task <id> --dry-run
//   node scripts/salvage-subagent.mjs --task <id> --push
//
// Exit codes:
//   0 -- salvage succeeded (or dry-run completed) and main is clean
//   1 -- usage error (bad flags, wrong directory, missing worktree)
//   2 -- cherry-pick conflict that could NOT be auto-resolved; cherry-pick
//        is left in-progress on disk for the human to finish
//   3 -- internal error from git or fs (e.g. fetch failed); state may be dirty
//
// Auto-resolution policy (SAFE-BY-DEFAULT):
//   The CLI will only auto-resolve when ALL of the following are true:
//     (a) the ONLY conflicted file is scripts/run-assertions.mjs
//     (b) the file contains exactly ONE conflict block (<<<<<<<, =======,
//         >>>>>>>) -- nested / compound conflicts bail to manual
//     (c) the conflict block sits inside the DATA_MODULES array literal
//     (d) BOTH halves are pure additions -- every non-blank line on each side
//         matches the DATA_MODULES line shape (a /src/*.js path string or a
//         leading // comment line)
//   When all four hold, the auto-resolution concatenates BOTH halves
//   (theirs after ours), preserving comments and ordering inside each half.
//   After writing, the file is re-scanned for any remaining <<<<<<<, =======,
//   >>>>>>> markers AND a syntax sanity check is run by importing the file
//   from a worker; any anomaly aborts the auto-resolution and the cherry-pick
//   is left in-progress.
//
// Manual fallback:
//   On ANY condition outside the policy above the script prints
//     MANUAL RESOLUTION NEEDED in <file>
//   and exits with code 2 WITHOUT cleaning up. The user can then run
//     git status   # inspect conflicts
//     # ... resolve ...
//     git cherry-pick --continue
//   exactly as they would have done by hand.

import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const REPO_ROOT  = path.resolve(__dirname, '..');

// ── Arg parsing ───────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const out = {
    task: null,
    commit: null,
    worktree: null,
    dryRun: false,
    push: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case '--task':     out.task     = argv[++i]; break;
      case '--commit':   out.commit   = argv[++i]; break;
      case '--worktree': out.worktree = argv[++i]; break;
      case '--dry-run':  out.dryRun   = true;      break;
      case '--push':     out.push     = true;      break;
      case '-h':
      case '--help':     out.help     = true;      break;
      default:
        if (a.startsWith('--task=')) out.task = a.slice('--task='.length);
        else if (a.startsWith('--commit=')) out.commit = a.slice('--commit='.length);
        else if (a.startsWith('--worktree=')) out.worktree = a.slice('--worktree='.length);
        else {
          fail(1, `Unknown argument: ${a}`);
        }
    }
  }
  return out;
}

function usage() {
  return `Usage:
  node scripts/salvage-subagent.mjs --task <task-id>
  node scripts/salvage-subagent.mjs --commit <sha>
  node scripts/salvage-subagent.mjs --worktree <path>
  node scripts/salvage-subagent.mjs --task <id> --dry-run
  node scripts/salvage-subagent.mjs --task <id> --push

Exit codes: 0 ok | 1 usage | 2 manual-needed | 3 internal-error
See top-of-file comment for auto-resolution policy.`;
}

function fail(code, msg) {
  console.error(msg);
  if (code === 1) console.error(usage());
  process.exit(code);
}

// ── Repo-root detection ──────────────────────────────────────────────────────

function ensureMathexplorerRoot() {
  const sentinel = path.join(REPO_ROOT, 'src', 'data', 'improvement-queue.js');
  if (!fs.existsSync(sentinel)) {
    fail(1, `Wrong working directory: ${REPO_ROOT}
Expected src/data/improvement-queue.js to exist (mathexplorer repo sentinel).`);
  }
}

// ── git helpers ──────────────────────────────────────────────────────────────

function git(args, opts = {}) {
  // Run git with stdio captured; throws on non-zero unless opts.allowFail.
  const res = spawnSync('git', args, {
    cwd: opts.cwd || REPO_ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (res.status !== 0 && !opts.allowFail) {
    const err = new Error(`git ${args.join(' ')} failed: ${res.stderr || res.stdout}`);
    err.stdout = res.stdout || '';
    err.stderr = res.stderr || '';
    err.status = res.status;
    throw err;
  }
  return { stdout: (res.stdout || '').trim(), stderr: (res.stderr || '').trim(), status: res.status };
}

function gitSafe(args, opts = {}) {
  return git(args, { ...opts, allowFail: true });
}

// ── Source resolution ────────────────────────────────────────────────────────

function resolveSource({ task, commit, worktree }) {
  // Resolves to { worktreePath, branch, commit, taskId } where any field may
  // be null if it cannot be determined. commit and branch must be set before
  // the fetch step.
  let worktreePath = null;
  let branch       = null;
  let resolvedSha  = null;
  let taskId       = task;

  if (worktree) {
    worktreePath = path.resolve(worktree);
    if (!fs.existsSync(worktreePath)) {
      fail(1, `Worktree path does not exist: ${worktreePath}`);
    }
    // Try to extract task-id from worktree path: agent-<id>
    const m = /agent-([a-z0-9]+)\/?$/.exec(worktreePath);
    if (m && !taskId) taskId = m[1];
  } else if (task) {
    worktreePath = path.join(REPO_ROOT, '.claude', 'worktrees', `agent-${task}`);
    if (!fs.existsSync(worktreePath)) {
      // Fallback: maybe the user passed the imp-* ticket-id by mistake.
      fail(1, `No worktree found at .claude/worktrees/agent-${task}/.
Hint: --task expects the worktree agent suffix (e.g. a05f2a7af9d530498),
not the imp-NNNN ticket id.`);
    }
  } else if (commit) {
    // Commit-only mode: no worktree to consult. We'll cherry-pick directly.
    resolvedSha = commit;
  } else {
    fail(1, 'Must pass one of --task, --commit, --worktree.');
  }

  if (worktreePath) {
    const br = gitSafe(['-C', worktreePath, 'branch', '--show-current']);
    branch = br.stdout || null;
    if (!branch) {
      fail(1, `Worktree ${worktreePath} has no current branch (detached HEAD?).`);
    }
    // Most recent commit on that branch (overridden if --commit was passed).
    if (!resolvedSha) {
      const log = gitSafe(['-C', worktreePath, 'log', '--format=%H', '-1']);
      resolvedSha = log.stdout;
    }
  }
  if (commit) resolvedSha = commit;

  if (!resolvedSha) {
    fail(1, 'Could not resolve a commit SHA from the given source.');
  }

  return { worktreePath, branch, commit: resolvedSha, taskId };
}

// ── Conflict auto-resolution ─────────────────────────────────────────────────

const RUN_ASSERTIONS_REL = path.join('scripts', 'run-assertions.mjs');
const RUN_ASSERTIONS_ABS = path.join(REPO_ROOT, RUN_ASSERTIONS_REL);

function listConflictedFiles() {
  const res = gitSafe(['diff', '--name-only', '--diff-filter=U']);
  return res.stdout.split('\n').map((s) => s.trim()).filter(Boolean);
}

const CONFLICT_START = /^<{7}\s.*$/m;
const CONFLICT_SEP   = /^={7}\s*$/m;
const CONFLICT_END   = /^>{7}\s.*$/m;
const ANY_MARKER     = /(^<{7}\s)|(^={7}\s*$)|(^>{7}\s)/m;

// Match shape of a DATA_MODULES list line: either a quoted path entry or a
// pure // comment line. Blank lines are OK too.
function looksLikeDataModulesLine(line) {
  const trimmed = line.trim();
  if (trimmed === '') return true;
  if (trimmed.startsWith('//')) return true;
  // Quoted path entry, optionally with trailing comma and inline comment.
  if (/^['"]\/src\/[^'"]+\.js['"],?\s*(\/\/.*)?$/.test(trimmed)) return true;
  return false;
}

function tryAutoResolveDataModules() {
  // Returns { ok: true } on success, { ok: false, reason: string } otherwise.
  if (!fs.existsSync(RUN_ASSERTIONS_ABS)) {
    return { ok: false, reason: 'scripts/run-assertions.mjs missing' };
  }
  const raw = fs.readFileSync(RUN_ASSERTIONS_ABS, 'utf8');
  const lines = raw.split('\n');

  // Locate conflict markers.
  const starts = [];
  const seps   = [];
  const ends   = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^<{7}\s/.test(lines[i])) starts.push(i);
    else if (/^={7}\s*$/.test(lines[i])) seps.push(i);
    else if (/^>{7}\s/.test(lines[i])) ends.push(i);
  }
  if (starts.length !== 1 || seps.length !== 1 || ends.length !== 1) {
    return { ok: false, reason: `expected exactly one conflict block; got starts=${starts.length} seps=${seps.length} ends=${ends.length}` };
  }
  const [iStart] = starts;
  const [iSep]   = seps;
  const [iEnd]   = ends;
  if (!(iStart < iSep && iSep < iEnd)) {
    return { ok: false, reason: 'conflict markers out of order' };
  }

  const ourLines   = lines.slice(iStart + 1, iSep);
  const theirLines = lines.slice(iSep   + 1, iEnd);

  // Verify both halves look like DATA_MODULES content.
  const badOur   = ourLines.find((ln) => !looksLikeDataModulesLine(ln));
  const badTheir = theirLines.find((ln) => !looksLikeDataModulesLine(ln));
  if (badOur !== undefined) {
    return { ok: false, reason: `our-side line not DATA_MODULES-shaped: ${JSON.stringify(badOur)}` };
  }
  if (badTheir !== undefined) {
    return { ok: false, reason: `their-side line not DATA_MODULES-shaped: ${JSON.stringify(badTheir)}` };
  }

  // Confirm the conflict region is inside DATA_MODULES.
  let inDataModules = false;
  for (let i = 0; i < iStart; i++) {
    if (/^const\s+DATA_MODULES\s*=\s*\[/.test(lines[i])) inDataModules = true;
    else if (inDataModules && /^\];?\s*$/.test(lines[i])) inDataModules = false;
  }
  if (!inDataModules) {
    return { ok: false, reason: 'conflict block is not inside the DATA_MODULES array' };
  }

  // Build the resolved file: ours, then theirs, in place of the conflict.
  const before = lines.slice(0, iStart);
  const after  = lines.slice(iEnd + 1);
  const merged = [...before, ...ourLines, ...theirLines, ...after];
  const resolvedText = merged.join('\n');

  // Final marker check.
  if (ANY_MARKER.test(resolvedText)) {
    return { ok: false, reason: 'residual conflict markers after merge' };
  }

  fs.writeFileSync(RUN_ASSERTIONS_ABS, resolvedText, 'utf8');

  // Syntax sanity check. We intentionally do NOT import the resolved file --
  // doing so would spin up Vite SSR. A `node --check` parse pass is enough to
  // catch a broken array literal / mis-quoted entry / unbalanced bracket
  // introduced by a bad merge.
  const parse = spawnSync(process.execPath, ['--check', RUN_ASSERTIONS_ABS], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 30_000,
  });
  if (parse.status !== 0) {
    return { ok: false, reason: `node --check failed after auto-resolve: ${parse.stderr || parse.stdout}` };
  }

  return { ok: true, ourCount: ourLines.length, theirCount: theirLines.length };
}

// ── Main flow ────────────────────────────────────────────────────────────────

function main() {
  const argv = process.argv.slice(2);
  const args = parseArgs(argv);
  if (args.help || argv.length === 0) {
    console.log(usage());
    process.exit(args.help ? 0 : 1);
  }

  ensureMathexplorerRoot();

  // Working-tree state check: cherry-pick will refuse on a dirty index.
  const status = gitSafe(['status', '--porcelain']);
  // Ignore untracked .claude/worktrees noise; only block if tracked files are dirty.
  const dirty = status.stdout
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((line) => {
      const codes = line.slice(0, 2);
      const filePart = line.slice(3);
      // Skip untracked & untracked-dir lines under .claude/worktrees
      if (codes.includes('?') && filePart.startsWith('.claude/worktrees/')) return false;
      if (filePart.startsWith('.claude/worktrees/')) return false;
      if (filePart.startsWith('scripts/.')) return false; // engine sentinel files
      return true;
    });
  if (dirty.length && !args.dryRun) {
    fail(1, `Working tree has uncommitted changes (${dirty.length} entries). Commit or stash before salvaging.\n` + dirty.slice(0, 5).map((l) => `  ${l}`).join('\n'));
  }

  const src = resolveSource(args);
  const taskIdShort = (src.taskId || src.commit).slice(0, 8);
  const tmpBranch = `tmp-salvage-${taskIdShort}`;

  const currentBranch = gitSafe(['branch', '--show-current']).stdout || '(detached)';

  console.log(`salvage-subagent: target commit ${src.commit.slice(0, 12)} ${src.branch ? `(branch ${src.branch})` : ''}`);
  console.log(`salvage-subagent: source worktree ${src.worktreePath || '(none, commit-only mode)'}`);
  console.log(`salvage-subagent: cherry-picking onto current branch '${currentBranch}'`);
  if (src.worktreePath) {
    const log = gitSafe(['-C', src.worktreePath, 'log', '--oneline', '-3']);
    console.log(`salvage-subagent: recent commits on source branch:`);
    log.stdout.split('\n').forEach((l) => console.log('  ' + l));
  }

  if (args.dryRun) {
    console.log('salvage-subagent: --dry-run, no changes made.');
    console.log(`dry-run plan:
  git fetch . ${src.branch || src.commit}:${tmpBranch}
  git cherry-pick ${src.commit}
  # if conflict in ${RUN_ASSERTIONS_REL} only -> auto-resolve DATA_MODULES concat
  # if any other conflict -> exit 2 with 'MANUAL RESOLUTION NEEDED'
  git branch -D ${tmpBranch}
  ${args.push ? `git push origin HEAD` : '# (no push; pass --push to enable)'}`);
    console.log(`dry-run: salvaged ${src.taskId || src.commit.slice(0,12)} as <would-be-sha> [${args.push ? 'pushed' : 'local'}]`);
    process.exit(0);
  }

  // Step 1: fetch the commit into a temp branch.
  if (src.branch) {
    try {
      // Force-update the temp branch in case it lingered from a previous run.
      git(['fetch', '.', `+${src.branch}:${tmpBranch}`]);
    } catch (e) {
      fail(3, `git fetch failed: ${e.stderr || e.message}`);
    }
  } else {
    // commit-only: fetch by SHA via point-creation.
    try {
      git(['branch', '-f', tmpBranch, src.commit]);
    } catch (e) {
      fail(3, `git branch -f failed: ${e.stderr || e.message}`);
    }
  }

  // Step 2: cherry-pick.
  const cp = gitSafe(['cherry-pick', src.commit]);
  if (cp.status === 0) {
    // Success on first try.
    finalize({ src, tmpBranch, push: args.push, conflictResolved: false });
    return;
  }

  // Cherry-pick failed -- inspect for conflicts.
  const conflicts = listConflictedFiles();
  if (conflicts.length === 0) {
    // Non-conflict failure (e.g. empty commit). Abort and report.
    gitSafe(['cherry-pick', '--abort']);
    gitSafe(['branch', '-D', tmpBranch]);
    fail(3, `cherry-pick failed without conflicts:\n${cp.stderr || cp.stdout}`);
  }

  // Auto-resolve policy: ONLY if conflicts.length === 1 and that file is
  // scripts/run-assertions.mjs.
  if (conflicts.length !== 1 || conflicts[0] !== RUN_ASSERTIONS_REL) {
    console.error(`salvage-subagent: ${conflicts.length} conflicted file(s):`);
    conflicts.forEach((f) => console.error('  ' + f));
    console.error('MANUAL RESOLUTION NEEDED in ' + conflicts.join(', '));
    console.error('Cherry-pick left in progress. Resolve and run `git cherry-pick --continue`.');
    console.error(`(temp branch '${tmpBranch}' is still set; delete with 'git branch -D ${tmpBranch}' after.)`);
    process.exit(2);
  }

  const resolve = tryAutoResolveDataModules();
  if (!resolve.ok) {
    console.error(`salvage-subagent: auto-resolution refused: ${resolve.reason}`);
    console.error('MANUAL RESOLUTION NEEDED in ' + RUN_ASSERTIONS_REL);
    console.error('Cherry-pick left in progress. Resolve and run `git cherry-pick --continue`.');
    process.exit(2);
  }
  console.log(`salvage-subagent: auto-resolved DATA_MODULES conflict (kept ${resolve.ourCount} + ${resolve.theirCount} lines).`);

  // Stage the resolved file and continue.
  try {
    git(['add', RUN_ASSERTIONS_REL]);
  } catch (e) {
    fail(3, `git add failed: ${e.stderr || e.message}`);
  }

  // GIT_EDITOR=true makes --continue reuse the original commit message without
  // opening an editor.
  const cont = spawnSync('git', ['cherry-pick', '--continue'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, GIT_EDITOR: 'true' },
  });
  if (cont.status !== 0) {
    console.error(`cherry-pick --continue failed:\n${cont.stderr || cont.stdout}`);
    console.error('Cherry-pick left in progress.');
    process.exit(3);
  }

  finalize({ src, tmpBranch, push: args.push, conflictResolved: true });
}

function finalize({ src, tmpBranch, push, conflictResolved }) {
  const newSha = gitSafe(['rev-parse', 'HEAD']).stdout;
  // Drop temp branch.
  gitSafe(['branch', '-D', tmpBranch]);

  let pushedTag = 'local';
  if (push) {
    const p = gitSafe(['push', 'origin', 'HEAD']);
    if (p.status !== 0) {
      console.error(`salvage-subagent: git push failed:\n${p.stderr || p.stdout}`);
      console.error('salvage-subagent: commit landed locally but NOT pushed.');
      process.exit(3);
    }
    pushedTag = 'pushed';
  }

  const id = src.taskId || src.commit.slice(0, 12);
  console.log(`new commit: ${newSha}${conflictResolved ? ' (DATA_MODULES auto-resolved)' : ''}`);
  console.log(`salvaged ${id} as ${newSha.slice(0, 12)} [${pushedTag}]`);
  process.exit(0);
}

main();
