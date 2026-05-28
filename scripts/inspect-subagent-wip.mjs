#!/usr/bin/env node
// scripts/inspect-subagent-wip.mjs
// imp-1274: META-HARNESS CLI to detect uncommitted WIP inside subagent
// worktrees that hit duration / token limits before they could land a clean
// commit. Pairs with scripts/salvage-subagent.mjs (imp-1270) which can now
// take a --wip-fallback flag to copy WIP files back to main when the normal
// cherry-pick path has no commit to grab.
//
// The manual loop this replaces was:
//   ls .claude/worktrees/agent-*/src/data/imp-*.js
//   for each: cd in, git status --porcelain, git log -1, wc -c the WIP file,
//             eyeball whether the file looks "complete" (>5KB heuristic).
// That took ~3 min per WIP detect and was easy to miss when there were 50+
// worktrees on disk. This CLI prints a one-line-per-task table so the
// orchestrator can sweep all worktrees in <1 sec.
//
// Usage:
//   node scripts/inspect-subagent-wip.mjs --task <task-id>
//   node scripts/inspect-subagent-wip.mjs --all
//   node scripts/inspect-subagent-wip.mjs --all --only-dirty
//   node scripts/inspect-subagent-wip.mjs --all --json
//   node scripts/inspect-subagent-wip.mjs --all --wip-threshold-kb 3
//
// Output (default, fixed-width table):
//   TASK              BRANCH                         STATE       AGE      SHA      WIP  KB   VERDICT      MSG
//   a1e03a6318b491582 worktree-agent-a1e03...        dirty       2h10m    d65890af 1    28.2 complete     WAVE 15: seed 16 tickets ...
//
// Heuristic verdicts (per row):
//   clean       — worktree is clean, no untracked imp-*.js files
//   wip-empty   — untracked imp-*.js exists but all <5KB (probably a stub)
//   complete    — untracked imp-*.js >5KB AND no commit landed on the branch
//                 since the WIP was added (i.e. the file was never folded in)
//   landed      — untracked imp-*.js exists but the most recent commit
//                 timestamp post-dates the file mtime (subagent did commit,
//                 the WIP file is leftover scratch). Treat as "no salvage
//                 needed."
//   conflicts   — worktree has an in-progress cherry-pick / rebase / merge
//   missing     — given --task <id> but no worktree directory exists
//
// Exit codes:
//   0 — table printed successfully
//   1 — usage error (bad flags, missing arg)
//   2 — at least one worktree row is in a state requiring manual action
//        (only emitted with --fail-on-action); otherwise still exits 0.
//   3 — internal error (filesystem / git failure)

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const REPO_ROOT  = path.resolve(__dirname, '..');
const WORKTREES_ROOT = path.join(REPO_ROOT, '.claude', 'worktrees');

// ── Arg parsing ───────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const out = {
    task: null,
    all: false,
    onlyDirty: false,
    json: false,
    failOnAction: false,
    wipThresholdKb: 5,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case '--task':                out.task          = argv[++i]; break;
      case '--all':                 out.all           = true;      break;
      case '--only-dirty':          out.onlyDirty     = true;      break;
      case '--json':                out.json          = true;      break;
      case '--fail-on-action':      out.failOnAction  = true;      break;
      case '--wip-threshold-kb':    out.wipThresholdKb = Number(argv[++i]); break;
      case '-h':
      case '--help':                out.help          = true;      break;
      default:
        if (a.startsWith('--task='))             out.task          = a.slice('--task='.length);
        else if (a.startsWith('--wip-threshold-kb=')) out.wipThresholdKb = Number(a.slice('--wip-threshold-kb='.length));
        else fail(1, `Unknown argument: ${a}`);
    }
  }
  if (!Number.isFinite(out.wipThresholdKb) || out.wipThresholdKb < 0) {
    fail(1, `Invalid --wip-threshold-kb: ${out.wipThresholdKb}`);
  }
  return out;
}

function usage() {
  return `Usage:
  node scripts/inspect-subagent-wip.mjs --task <task-id>
  node scripts/inspect-subagent-wip.mjs --all
  node scripts/inspect-subagent-wip.mjs --all --only-dirty
  node scripts/inspect-subagent-wip.mjs --all --json
  node scripts/inspect-subagent-wip.mjs --all --wip-threshold-kb 3
  node scripts/inspect-subagent-wip.mjs --all --fail-on-action

Flags:
  --task <id>              Inspect a single worktree (agent-<id> suffix).
  --all                    Inspect every worktree under .claude/worktrees/.
  --only-dirty             Skip clean rows (with --all).
  --json                   Emit machine-readable JSON instead of a table.
  --wip-threshold-kb N     Override the "looks complete" size cutoff (default 5).
  --fail-on-action         Exit 2 if any row needs operator action
                           (complete, conflicts, missing). Default exits 0.

Exit codes: 0 ok | 1 usage | 2 action-needed (only with --fail-on-action) | 3 internal`;
}

function fail(code, msg) {
  process.stderr.write(msg + '\n');
  if (code === 1) process.stderr.write(usage() + '\n');
  process.exit(code);
}

// ── git helpers ──────────────────────────────────────────────────────────────

function git(cwd, args, opts = {}) {
  const res = spawnSync('git', args, {
    cwd,
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

function gitSafe(cwd, args) {
  return git(cwd, args, { allowFail: true });
}

// ── Worktree discovery ───────────────────────────────────────────────────────

function listWorktreeDirs() {
  if (!fs.existsSync(WORKTREES_ROOT)) return [];
  return fs.readdirSync(WORKTREES_ROOT)
    .filter((name) => name.startsWith('agent-'))
    .map((name) => ({
      taskId: name.slice('agent-'.length),
      dir:    path.join(WORKTREES_ROOT, name),
    }))
    .filter(({ dir }) => {
      // Must contain a .git pointer (file or dir) — otherwise it's a stale
      // skeleton.
      const dotGit = path.join(dir, '.git');
      return fs.existsSync(dotGit);
    })
    .sort((a, b) => a.taskId.localeCompare(b.taskId));
}

// ── Per-worktree inspection ──────────────────────────────────────────────────

function inferWorktreeState(dir) {
  // Returns one of: 'clean' | 'dirty' | 'conflicts' | 'missing'
  // 'conflicts' is set if either a cherry-pick / merge / rebase is in
  // progress OR `git status` reports any UU/AA/DD/etc. unmerged path.
  if (!fs.existsSync(dir)) return 'missing';
  const gitDir = path.join(dir, '.git');
  if (!fs.existsSync(gitDir)) return 'missing';

  // The .git file in a worktree is a 1-line pointer to the real gitdir
  // (under <main>/.git/worktrees/<name>/). Sniff for the in-progress state
  // files there.
  let realGitDir = null;
  try {
    const stat = fs.statSync(gitDir);
    if (stat.isFile()) {
      const ptr = fs.readFileSync(gitDir, 'utf8').trim();
      const m = /^gitdir:\s*(.+)$/m.exec(ptr);
      if (m) realGitDir = path.resolve(dir, m[1]);
    } else if (stat.isDirectory()) {
      realGitDir = gitDir;
    }
  } catch (_) {
    realGitDir = null;
  }
  if (realGitDir) {
    const inProgress = [
      'CHERRY_PICK_HEAD',
      'MERGE_HEAD',
      'REBASE_HEAD',
      'rebase-merge',
      'rebase-apply',
    ];
    for (const f of inProgress) {
      if (fs.existsSync(path.join(realGitDir, f))) return 'conflicts';
    }
  }

  const status = gitSafe(dir, ['status', '--porcelain']);
  const lines = status.stdout.split('\n').map((s) => s).filter(Boolean);
  // Any unmerged paths -> conflicts.
  for (const line of lines) {
    const x = line[0], y = line[1];
    if (x === 'U' || y === 'U' || (x === 'A' && y === 'A') || (x === 'D' && y === 'D')) {
      return 'conflicts';
    }
  }
  // Tracked-file modifications -> dirty. Pure untracked-only is also "dirty"
  // for our purposes because that's the WIP-file pattern.
  const tracked = lines.filter((l) => !l.startsWith('??'));
  const untrackedSrcData = lines.filter((l) => l.startsWith('?? src/data/'));
  if (tracked.length || untrackedSrcData.length) return 'dirty';
  return 'clean';
}

function listUntrackedWipFiles(dir) {
  // Returns [{ relPath, abs, sizeBytes, mtimeMs }] for every untracked
  // imp-*.js file under src/data/ in the worktree.
  const status = gitSafe(dir, ['status', '--porcelain']);
  const out = [];
  for (const line of status.stdout.split('\n')) {
    if (!line.startsWith('?? ')) continue;
    const rel = line.slice(3);
    if (!rel.startsWith('src/data/')) continue;
    if (!/imp-\d+/.test(rel)) continue;
    if (!rel.endsWith('.js') && !rel.endsWith('.mjs')) continue;
    const abs = path.join(dir, rel);
    let sizeBytes = 0, mtimeMs = 0;
    try {
      const st = fs.statSync(abs);
      sizeBytes = st.size;
      mtimeMs   = st.mtimeMs;
    } catch (_) { /* file vanished between status + stat; skip */ continue; }
    out.push({ relPath: rel, abs, sizeBytes, mtimeMs });
  }
  // Largest first.
  out.sort((a, b) => b.sizeBytes - a.sizeBytes);
  return out;
}

function lastCommitInfo(dir) {
  // Returns { sha, isoTime, message } or null.
  const r = gitSafe(dir, ['log', '-1', '--format=%H%x09%aI%x09%s']);
  if (r.status !== 0 || !r.stdout) return null;
  const [sha, isoTime, ...rest] = r.stdout.split('\t');
  return { sha, isoTime, message: rest.join('\t') };
}

function currentBranch(dir) {
  const r = gitSafe(dir, ['branch', '--show-current']);
  return r.status === 0 ? r.stdout : '';
}

function inspectOne(taskId, wipThresholdBytes) {
  const dir = path.join(WORKTREES_ROOT, `agent-${taskId}`);
  if (!fs.existsSync(dir)) {
    return {
      taskId, dir, exists: false,
      branch: '', state: 'missing',
      lastCommit: null,
      wipFiles: [], largestWipKb: 0,
      verdict: 'missing',
    };
  }
  const state    = inferWorktreeState(dir);
  const branch   = currentBranch(dir);
  const commit   = lastCommitInfo(dir);
  const wipFiles = listUntrackedWipFiles(dir);
  const largestBytes = wipFiles.reduce((m, f) => Math.max(m, f.sizeBytes), 0);
  const largestKb    = largestBytes / 1024;

  let verdict;
  if (state === 'conflicts') {
    verdict = 'conflicts';
  } else if (wipFiles.length === 0) {
    verdict = state === 'clean' ? 'clean' : 'dirty-no-wip';
  } else if (largestBytes < wipThresholdBytes) {
    verdict = 'wip-empty';
  } else if (commit) {
    // If the latest commit's wall-clock time is AFTER the WIP file's mtime,
    // the subagent did fold the WIP into a commit and just left a copy.
    const commitMs = Date.parse(commit.isoTime);
    const largestMtime = wipFiles[0].mtimeMs;
    verdict = (Number.isFinite(commitMs) && commitMs >= largestMtime)
      ? 'landed'
      : 'complete';
  } else {
    // No commit at all on this branch — definitely a WIP-only situation.
    verdict = 'complete';
  }

  return {
    taskId, dir, exists: true,
    branch, state,
    lastCommit: commit,
    wipFiles, largestWipKb: largestKb,
    verdict,
  };
}

// ── Output formatting ────────────────────────────────────────────────────────

const VERDICT_RANK = {
  // Rows that need operator action sort first so they're impossible to miss
  // when --all dumps 60 worktrees.
  conflicts: 0,
  complete:  1,
  missing:   2,
  'wip-empty': 3,
  'dirty-no-wip': 4,
  landed:    5,
  clean:     6,
  unknown:   7,
};

function ageString(isoTime) {
  if (!isoTime) return '?';
  const ms = Date.now() - Date.parse(isoTime);
  if (!Number.isFinite(ms) || ms < 0) return '?';
  const min = Math.floor(ms / 60_000);
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 48) return `${h}h${(min % 60).toString().padStart(2, '0')}m`;
  const d = Math.floor(h / 24);
  return `${d}d${(h % 24).toString().padStart(2, '0')}h`;
}

function truncate(s, n) {
  if (!s) return '';
  return s.length <= n ? s : s.slice(0, n - 1) + '…';
}

function pad(s, n) {
  s = s == null ? '' : String(s);
  if (s.length >= n) return s.slice(0, n);
  return s + ' '.repeat(n - s.length);
}

function formatTable(rows) {
  // Column widths (truncate long fields to keep one-line-per-row).
  const W = {
    task:    17,
    branch:  28,
    state:   10,
    age:     8,
    sha:     9,
    wip:     4,
    kb:      6,
    verdict: 12,
    msg:     50,
  };
  const header =
    pad('TASK', W.task) + ' ' +
    pad('BRANCH', W.branch) + ' ' +
    pad('STATE', W.state) + ' ' +
    pad('AGE', W.age) + ' ' +
    pad('SHA', W.sha) + ' ' +
    pad('WIP', W.wip) + ' ' +
    pad('KB', W.kb) + ' ' +
    pad('VERDICT', W.verdict) + ' ' +
    'MSG';

  const lines = [header];
  for (const r of rows) {
    const sha     = r.lastCommit ? r.lastCommit.sha.slice(0, 8) : '';
    const message = r.lastCommit ? r.lastCommit.message : '';
    const age     = r.lastCommit ? ageString(r.lastCommit.isoTime) : '?';
    const kb      = r.largestWipKb ? r.largestWipKb.toFixed(1) : '0';
    lines.push(
      pad(truncate(r.taskId,  W.task),    W.task)    + ' ' +
      pad(truncate(r.branch,  W.branch),  W.branch)  + ' ' +
      pad(truncate(r.state,   W.state),   W.state)   + ' ' +
      pad(truncate(age,       W.age),     W.age)     + ' ' +
      pad(truncate(sha,       W.sha),     W.sha)     + ' ' +
      pad(String(r.wipFiles.length), W.wip)          + ' ' +
      pad(truncate(kb,        W.kb),      W.kb)      + ' ' +
      pad(truncate(r.verdict, W.verdict), W.verdict) + ' ' +
      truncate(message, W.msg),
    );
  }
  return lines.join('\n');
}

function summarize(rows) {
  const counts = {};
  for (const r of rows) counts[r.verdict] = (counts[r.verdict] || 0) + 1;
  return Object.keys(counts).sort()
    .map((k) => `${k}=${counts[k]}`).join('  ');
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    process.stdout.write(usage() + '\n');
    process.exit(1);
  }
  const args = parseArgs(argv);
  if (args.help) {
    process.stdout.write(usage() + '\n');
    process.exit(0);
  }
  if (!args.task && !args.all) {
    fail(1, 'Must pass one of --task or --all.');
  }

  const thresholdBytes = args.wipThresholdKb * 1024;

  let rows;
  try {
    if (args.task) {
      rows = [inspectOne(args.task, thresholdBytes)];
    } else {
      const worktrees = listWorktreeDirs();
      rows = worktrees.map(({ taskId }) => inspectOne(taskId, thresholdBytes));
    }
  } catch (e) {
    fail(3, `internal error: ${e.message}`);
  }

  let filtered = rows;
  if (args.onlyDirty) {
    filtered = rows.filter((r) => r.verdict !== 'clean' && r.verdict !== 'landed');
  }

  // Sort by action-need rank, then by task-id for stability.
  filtered.sort((a, b) => {
    const ra = VERDICT_RANK[a.verdict] ?? VERDICT_RANK.unknown;
    const rb = VERDICT_RANK[b.verdict] ?? VERDICT_RANK.unknown;
    if (ra !== rb) return ra - rb;
    return a.taskId.localeCompare(b.taskId);
  });

  if (args.json) {
    process.stdout.write(JSON.stringify({
      generatedAt: new Date().toISOString(),
      thresholdKb: args.wipThresholdKb,
      total: rows.length,
      shown: filtered.length,
      rows: filtered.map((r) => ({
        taskId: r.taskId,
        branch: r.branch,
        state:  r.state,
        verdict: r.verdict,
        lastCommit: r.lastCommit,
        wipFiles: r.wipFiles.map((f) => ({
          relPath: f.relPath,
          sizeBytes: f.sizeBytes,
          sizeKb: +(f.sizeBytes / 1024).toFixed(2),
          mtimeIso: new Date(f.mtimeMs).toISOString(),
        })),
        largestWipKb: +r.largestWipKb.toFixed(2),
      })),
    }, null, 2) + '\n');
  } else {
    process.stdout.write(formatTable(filtered) + '\n');
    process.stdout.write(`\n(${filtered.length}/${rows.length} shown)  ${summarize(filtered)}\n`);
  }

  if (args.failOnAction) {
    const needsAction = filtered.some((r) => ['conflicts', 'complete', 'missing'].includes(r.verdict));
    process.exit(needsAction ? 2 : 0);
  }
  process.exit(0);
}

main();
