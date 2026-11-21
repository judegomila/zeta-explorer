#!/usr/bin/env node
// scripts/engine-guard.mjs
//
// Commit-time and push-time checks for the public repository. Fails closed:
// any error while checking is a rejection.
//
//   node scripts/engine-guard.mjs staged              paths + content of the index
//   node scripts/engine-guard.mjs paths-staged        paths of the index only
//   node scripts/engine-guard.mjs content-staged      added lines of the index only
//   node scripts/engine-guard.mjs paths <file...>     check paths given as arguments
//   node scripts/engine-guard.mjs message <file>      a commit message
//   node scripts/engine-guard.mjs range <base> <head> each commit of base..head (paths, added lines, message)
//   node scripts/engine-guard.mjs tree <base> <head>  net change between two trees (a pull request as a whole)
//   node scripts/engine-guard.mjs fix-added <file...> sanitise the lines a ledger gained since HEAD
//   node scripts/engine-guard.mjs scan [--scope ledger|all] <file...|->
//
// Mode. "engine" applies the allow-list in scripts/engine-allowlist.txt on top
// of the built-in deny list; "human" applies the deny list only. The mode is
// engine when --mode engine is given, when ZETA_ENGINE=1, or when the current
// branch is the engine branch (ENGINE_BRANCH, default engine/work). It can be
// forced to engine, never forced to human while
// one of those conditions holds.
//
// Exit codes: 0 ok, 1 rejected, 2 usage or internal error (treated as rejected).

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  findViolations, sanitizeText, loadSecretLiterals, LEDGER_FILES,
} from './lib/public-sanitize.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = (() => {
  try { return execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { return path.resolve(HERE, '..'); }
})();
const ALLOWLIST_FILE = path.join(HERE, 'engine-allowlist.txt');
const GIT_ENV = { ...process.env, GIT_TRACE2_EVENT: '0' };
const MAX = 512 * 1024 * 1024;

function git(args, opts = {}) {
  return execFileSync('git', args, { cwd: ROOT, encoding: opts.encoding === null ? null : 'utf8', maxBuffer: MAX, env: GIT_ENV, stdio: ['ignore', 'pipe', 'pipe'] });
}

// ── path rules ──────────────────────────────────────────────────────────────

// Never committed by anyone. Mirrors CONTRIBUTING.md "Never commit".
const HARD_DENY = [
  [/^tmp\//, 'scratch directory tmp/'],
  [/(^|\/)\.env($|\.(?!example$))/, 'environment file'],
  [/^scripts\/\.(?!env\.example$)/, 'machine state file under scripts/'],
  [/^public\/fleet-status\.json$/, 'machine state (fleet status snapshot)'],
  [/^(\.vercel|\.claude|\.claude-memory|\.superpowers|thinking|logs|out|test-results)\//, 'agent, session or log directory'],
  [/^\.aider/, 'agent state'],
  [/(^|\/)-Users-[^/]*\//, 'session transcript directory'],
  [/(^|\/)\.claude\/projects\//, 'session transcript directory'],
  [/(^|\/)scripts\/logs\//, 'log directory'],
  [/\.(log|pid|pem|key|p12|pfx|keystore)$/, 'log, pid or key file'],
  [/(^|\/)(id_rsa|id_ed25519|id_ecdsa)(\.pub)?$/, 'ssh key'],
  [/(^|\/)\.DS_Store$/, 'OS file'],
  [/(^|\/)(__pycache__|\.lake|node_modules)\//, 'cache or build output'],
  [/\.pyc$/, 'cache file'],
  [/\.(tar\.gz|tgz|jsonl\.gz)$/, 'archive'],
  [/(^|\/)(\.bash_history|\.zsh_history|\.netrc|\.npmrc)$/, 'shell history or credential file'],
];

function globToRegExp(glob) {
  let g = glob;
  if (g.endsWith('/')) g += '**';
  let re = '';
  for (let i = 0; i < g.length; i++) {
    const c = g[i];
    if (c === '*') {
      if (g[i + 1] === '*') {
        i += 1;
        if (g[i + 1] === '/') { i += 1; re += '(?:.*/)?'; } else re += '.*';
      } else re += '[^/]*';
    } else re += c.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${re}$`);
}

function loadAllowlist() {
  const allow = []; const deny = [];
  const text = fs.readFileSync(ALLOWLIST_FILE, 'utf8'); // missing file throws: fail closed
  for (const raw of text.split('\n')) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;
    const m = line.match(/^(allow|deny)\s+(\S+)$/);
    if (!m) throw new Error(`engine-allowlist.txt: cannot parse line: ${raw}`);
    (m[1] === 'allow' ? allow : deny).push({ glob: m[2], re: globToRegExp(m[2]) });
  }
  if (!allow.length) throw new Error('engine-allowlist.txt: no allow entries');
  // the list protects itself
  deny.push({ glob: 'scripts/engine-allowlist.txt', re: /^scripts\/engine-allowlist\.txt$/ });
  return { allow, deny };
}

function currentBranch() {
  try { return git(['symbolic-ref', '--quiet', '--short', 'HEAD']).trim(); } catch { return ''; }
}

function resolveMode(argv) {
  const i = argv.indexOf('--mode');
  const asked = i !== -1 ? argv[i + 1] : '';
  if (asked && asked !== 'engine' && asked !== 'human') throw new Error(`unknown mode: ${asked}`);
  const forced = process.env.ZETA_ENGINE === '1' || currentBranch() === (process.env.ENGINE_BRANCH || 'engine/work');
  return (forced || asked === 'engine') ? 'engine' : 'human';
}

/**
 * @param {{ path: string, status: string }[]} entries
 * @param {'engine'|'human'} mode
 */
function checkPaths(entries, mode) {
  const problems = [];
  const lists = mode === 'engine' ? loadAllowlist() : null;
  for (const { path: p, status } of entries) {
    if (!p || p.startsWith('/') || p.split('/').includes('..')) { problems.push(`${p}: not a repository-relative path`); continue; }
    const hard = status === 'D' ? null : HARD_DENY.find(([re]) => re.test(p));
    if (hard) { problems.push(`${p}: ${hard[1]} must not be committed`); continue; }
    if (!lists) continue;
    const denied = lists.deny.find((d) => d.re.test(p));
    if (denied) { problems.push(`${p}: engines may not commit this path (deny ${denied.glob})`); continue; }
    if (!lists.allow.some((a) => a.re.test(p))) problems.push(`${p}: outside the engine allow-list (scripts/engine-allowlist.txt)`);
  }
  return problems;
}

function parseNameStatusZ(buf) {
  // "<status>\0<path>\0" and for renames/copies "<Rnnn>\0<old>\0<new>\0"
  const parts = buf.split('\0'); const out = [];
  for (let i = 0; i < parts.length;) {
    const st = parts[i]; if (!st) { i += 1; continue; }
    if (/^[RC]/.test(st)) {
      if (st[0] === 'R') out.push({ status: 'D', path: parts[i + 1] });
      out.push({ status: 'A', path: parts[i + 2] }); i += 3;
    } else { out.push({ status: st[0], path: parts[i + 1] }); i += 2; }
  }
  return out;
}

// ── content rules ───────────────────────────────────────────────────────────

const CONTENT_EXEMPT = new Set(['scripts/check-commit-hygiene.sh', 'CONTRIBUTING.md', '.gitleaks.toml']);
const EXEC_MAGIC = ['feedface', 'feedfacf', 'cefaedfe', 'cffaedfe', 'cafebabe', '7f454c46'];

/** Lines a diff adds, as { line, text }. diffText is `git diff -U0` output for ONE file. */
function addedLines(diffText) {
  const out = []; let inHunk = false; let n = 0;
  for (const l of diffText.split('\n')) {
    if (l.startsWith('diff --git ')) { inHunk = false; continue; }
    const h = l.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (h) { inHunk = true; n = parseInt(h[1], 10); continue; }
    if (!inHunk) continue;
    if (l.startsWith('+')) { out.push({ line: n, text: l.slice(1) }); n += 1; }
  }
  return out;
}

function checkAddedText(file, lines, literals) {
  const scope = LEDGER_FILES.includes(file) ? 'ledger' : 'all';
  const text = lines.map((l) => l.text).join('\n');
  const problems = [];
  for (const v of findViolations(text, { scope, literals })) {
    const at = lines[v.line - 1] ? lines[v.line - 1].line : '?';
    problems.push(`${file}:${at}: ${v.rule}: ${v.excerpt}`);
  }
  return problems;
}

function isExecutableBlob(spec) {
  try {
    const buf = execFileSync('git', ['cat-file', 'blob', spec], { cwd: ROOT, encoding: null, maxBuffer: MAX, env: GIT_ENV, stdio: ['ignore', 'pipe', 'ignore'] });
    return EXEC_MAGIC.includes(buf.subarray(0, 4).toString('hex'));
  } catch { return false; }
}

/** diffFor(path) -> `git diff -U0` text for that path; blobSpec(path) -> object name of the new side */
function checkContent(entries, diffFor, blobSpec) {
  const literals = loadSecretLiterals(ROOT);
  const problems = [];
  for (const { path: p, status } of entries) {
    if (status === 'D' || CONTENT_EXEMPT.has(p)) continue;
    if (status === 'A' && isExecutableBlob(blobSpec(p))) { problems.push(`${p}: compiled executable (commit the source and the build command)`); continue; }
    const diff = diffFor(p);
    if (/^Binary files /m.test(diff) && !/^@@ /m.test(diff)) continue;
    problems.push(...checkAddedText(p, addedLines(diff), literals));
  }
  return problems;
}

const DIFF_OPTS = ['-U0', '--no-color', '--no-ext-diff', '--no-renames'];

/** Net change between two trees (used for a pull request as a whole). */
function checkTree(base, head, mode) {
  const entries = parseNameStatusZ(git(['diff', '--name-status', '-z', '--no-renames', base, head]));
  return [
    ...checkPaths(entries, mode),
    ...checkContent(entries, (p) => git(['diff', ...DIFF_OPTS, base, head, '--', p]), (p) => `${head}:${p}`),
  ];
}

/**
 * Every commit of base..head on its own, so that content added by one commit
 * and removed by a later one is still seen. Commits already on the production
 * branch (reviewed there) and merge commits are skipped; a pull request as a
 * whole is covered by checkTree.
 */
function checkCommits(base, head, mode) {
  const problems = [];
  const not = [];
  for (const ref of ['refs/remotes/origin/main']) {
    try { git(['rev-parse', '--verify', '--quiet', ref]); not.push(`^${ref}`); } catch { /* ref absent */ }
  }
  const shas = git(['rev-list', '--no-merges', '--reverse', `${base}..${head}`, ...not]).split('\n').filter(Boolean);
  for (const sha of shas) {
    const tag = `commit ${sha.slice(0, 9)}`;
    const entries = parseNameStatusZ(git(['diff-tree', '-r', '--root', '--no-commit-id', '--name-status', '-z', '--no-renames', sha]));
    const found = [
      ...checkPaths(entries, mode),
      ...checkContent(entries, (p) => git(['diff-tree', '-p', '--root', '--no-commit-id', ...DIFF_OPTS, sha, '--', p]), (p) => `${sha}:${p}`),
      ...checkMessage(git(['log', '-1', '--format=%B', sha]), 'message'),
    ];
    problems.push(...found.map((f) => `${tag}: ${f}`));
  }
  return { problems, count: shas.length };
}

function checkMessage(msg, label) {
  const literals = loadSecretLiterals(ROOT);
  const body = msg.split('\n').filter((l) => !l.startsWith('#')).join('\n');
  return findViolations(body, { scope: 'ledger', literals })
    // trailers carry committer-style addresses by convention
    .filter((v) => !(v.rule === 'account-email' && /^(Co-Authored-By|Signed-off-by|Reviewed-by):/im.test(body.split('\n')[v.line - 1] || '')))
    .map((v) => `${label}: line ${v.line}: ${v.rule}: ${v.excerpt}`);
}

// ── commands ────────────────────────────────────────────────────────────────

function stagedEntries() {
  return parseNameStatusZ(git(['diff', '--cached', '--name-status', '-z', '--no-renames']));
}

function report(problems, what) {
  if (!problems.length) return 0;
  console.error(`engine-guard: REJECTED (${what}), ${problems.length} problem(s):`);
  for (const p of problems.slice(0, 60)) console.error(`  ${p}`);
  if (problems.length > 60) console.error(`  ... and ${problems.length - 60} more`);
  return 1;
}

function cmdFixAdded(files) {
  const literals = loadSecretLiterals(ROOT);
  let total = 0;
  for (const f of files) {
    const rel = path.relative(ROOT, path.resolve(ROOT, f));
    if (!LEDGER_FILES.includes(rel)) { console.error(`engine-guard fix-added: ${rel} is not a ledger file; left unchanged`); continue; }
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) continue;
    const added = addedLines(git(['diff', 'HEAD', '-U0', '--no-color', '--no-ext-diff', '--', rel]));
    if (!added.length) continue;
    const snapMtime = fs.statSync(abs).mtimeMs;
    const lines = fs.readFileSync(abs, 'utf8').split('\n');
    let changed = 0;
    for (const { line } of added) {
      const cur = lines[line - 1];
      if (cur === undefined) continue;
      const { text } = sanitizeText(cur, { scope: 'ledger', literals });
      if (text !== cur) { lines[line - 1] = text; changed += 1; }
    }
    if (!changed) continue;
    // same concurrent-writer rule as seed-ticket.mjs: never clobber a newer write
    if (fs.statSync(abs).mtimeMs !== snapMtime) { console.error(`engine-guard fix-added: ${rel} changed while sanitising; skipped (the commit check still applies)`); continue; }
    const tmp = `${abs}.sanitize-tmp-${process.pid}`;
    fs.writeFileSync(tmp, lines.join('\n'), 'utf8');
    fs.renameSync(tmp, abs);
    total += changed;
    console.log(`engine-guard fix-added: sanitised ${changed} added line(s) in ${rel}`);
  }
  return total;
}

function main() {
  const argv = process.argv.slice(2);
  const cmd = argv[0];
  const rest = argv.slice(1).filter((a, i, arr) => a !== '--mode' && arr[i - 1] !== '--mode' && a !== '--scope' && arr[i - 1] !== '--scope');
  switch (cmd) {
    case 'staged': case 'paths-staged': case 'content-staged': {
      const mode = resolveMode(argv);
      const entries = stagedEntries();
      if (!entries.length) return 0;
      const problems = [];
      if (cmd !== 'content-staged') problems.push(...checkPaths(entries, mode));
      if (cmd !== 'paths-staged') problems.push(...checkContent(entries, (p) => git(['diff', '--cached', ...DIFF_OPTS, '--', p]), (p) => `:${p}`));
      return report(problems, `staged changes, ${mode} mode`);
    }
    case 'paths': {
      const mode = resolveMode(argv);
      return report(checkPaths(rest.map((p) => ({ path: p, status: 'A' })), mode), `paths, ${mode} mode`);
    }
    case 'message': {
      if (!rest[0]) throw new Error('message: file argument required');
      return report(checkMessage(fs.readFileSync(rest[0], 'utf8'), 'commit message'), 'commit message');
    }
    case 'range': case 'tree': {
      const [base, head] = rest;
      if (!base || !head) throw new Error(`${cmd}: <base> <head> required`);
      const mode = resolveMode(argv);
      if (cmd === 'tree') return report(checkTree(base, head, mode), `tree ${base.slice(0, 9)}..${head.slice(0, 9)}, ${mode} mode`);
      const { problems, count } = checkCommits(base, head, mode);
      const rc = report(problems, `${count} commit(s) in ${base.slice(0, 9)}..${head.slice(0, 9)}, ${mode} mode`);
      if (!rc) console.log(`engine-guard: ok, ${count} commit(s) checked (${mode} mode)`);
      return rc;
    }
    case 'fix-added': cmdFixAdded(rest); return 0;
    case 'scan': {
      const si = argv.indexOf('--scope');
      const scope = si !== -1 ? argv[si + 1] : 'ledger';
      const literals = loadSecretLiterals(ROOT);
      const problems = [];
      for (const f of rest.length ? rest : ['-']) {
        const text = f === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(f, 'utf8');
        for (const v of findViolations(text, { scope, literals })) problems.push(`${f === '-' ? '<stdin>' : f}:${v.line}: ${v.rule}: ${v.excerpt}`);
      }
      return report(problems, `scan, ${scope} scope`);
    }
    default:
      console.error('usage: engine-guard.mjs {staged|paths-staged|content-staged|paths <file...>|message <file>|range <base> <head>|tree <base> <head>|fix-added <file...>|scan [--scope ledger|all] <file...|->} [--mode engine|human]');
      return 2;
  }
}

try { process.exit(main()); } catch (e) {
  console.error(`engine-guard: internal error, treating as rejection: ${e.message}`);
  process.exit(2);
}
