// scripts/lib/public-sanitize.mjs
//
// The one sanitiser for text that engines and tools write into this public
// repository: ticket text, improvement-log text, commit messages, fleet status.
//
//   sanitizeText(text, { scope })      rewrite what can be rewritten
//   findViolations(text, { scope })    report what must not be published
//   sanitizeForLedger(text)            rewrite, then throw if anything is left
//
// Every writer of src/data/improvement-queue.js, src/data/improvements.js,
// IMPROVEMENTS.md and the fleet-status output calls sanitizeForLedger() (or
// sanitizeText + findViolations). scripts/engine-guard.mjs applies the same
// rules to staged content, commit messages and push ranges, so the write-time
// and commit-time checks cannot drift apart.
//
// scope 'all'    rules that hold for every file in the repository
// scope 'ledger' the rules above plus stricter ones for free text
//                (e-mail addresses, pasted terminal output, shell prompts)
//
// The patterns below are written so that this file does not match itself
// (character classes follow each literal prefix).

import fs from 'node:fs';
import path from 'node:path';

const HOME_OK = 'USER|Shared|xxxxxxxxxx';
const TMP_MARK = '[local-tmp-path]';

/** @typedef {{ id: string, kind: string, scope: 'all'|'ledger', re: RegExp, to: string|((m: string, ...g: string[]) => string) }} Rule */

/** @type {Rule[]} */
export const RULES = [
  // ── transcripts and pasted terminal output ────────────────────────────────
  { id: 'transcript-reminder-block', kind: 'transcript', scope: 'all',
    re: /<system-reminder\s*>[\s\S]*?<\/system-reminder\s*>/g, to: '[transcript omitted]' },
  { id: 'transcript-reminder-tag', kind: 'transcript', scope: 'all',
    re: /<\/?system-reminder\s*>/g, to: '[transcript omitted]' },
  { id: 'transcript-session-field', kind: 'transcript', scope: 'all',
    re: /"(?:parentUuid|sessionId|isSidechain|toolUseResult)"\s*:/g, to: '"[session-field-omitted]":' },
  { id: 'transcript-role-marker', kind: 'transcript', scope: 'all',
    re: /"role"\s*:\s*"(?:assistant|user|system)"/g, to: '"role-omitted": ""' },
  { id: 'transcript-content-block', kind: 'transcript', scope: 'all',
    re: /"type"\s*:\s*"(?:tool_use|tool_result|thinking)"/g, to: '"type-omitted": ""' },
  { id: 'transcript-tool-id', kind: 'transcript', scope: 'all',
    re: /\btoolu_[A-Za-z0-9]{6,}/g, to: '[tool-call-id]' },
  { id: 'transcript-resume', kind: 'transcript', scope: 'all',
    re: /claude\s+--resume\b[^\n"'`]{0,60}/g, to: '[session command omitted]' },
  { id: 'transcript-speaker-line', kind: 'transcript', scope: 'ledger',
    re: /(^|\n|\\n)[ \t]*(?:Human|Assistant|User)[ \t]*:[^\n]*/g, to: (_m, lead) => `${lead}[transcript line omitted]` },
  { id: 'terminal-ansi', kind: 'terminal', scope: 'ledger',
    // real escape bytes, and their escaped spellings inside JS string literals
    re: /(?:\u001b|\\u001b|\\x1b|\\033)\[[0-9;?]*[A-Za-z]/g, to: '' },
  { id: 'terminal-tui-glyph', kind: 'terminal', scope: 'ledger',
    re: /[⏺⎿❯][^\n]{0,200}/g, to: '[terminal output omitted]' },
  { id: 'terminal-shell-prompt', kind: 'terminal', scope: 'ledger',
    re: /(^|\n|\\n)[ \t]*[A-Za-z0-9._-]+@[A-Za-z0-9._-]+[ :][^\n%$#]{0,80}[%$#] [^\n]*/g, to: (_m, lead) => `${lead}[terminal output omitted]` },
  { id: 'terminal-error-dump', kind: 'terminal', scope: 'ledger',
    re: /(?:Traceback \(most recent call last\)|zsh: command not found|bash: [^\n:]{1,60}: command not found|npm ERR!|\bat [^\n()]{0,80}\((?:file:\/\/|node:internal)[^\n)]*\)|Last login: )[^\n]{0,200}/g,
    to: '[terminal output omitted]' },

  // ── credentials ───────────────────────────────────────────────────────────
  { id: 'secret-private-key', kind: 'secret', scope: 'all',
    re: /-----BEGIN [A-Z ]*PRIVATE[ ]KEY-----[\s\S]*?(?:-----END [A-Z ]*PRIVATE[ ]KEY-----|$)/g, to: '[REDACTED-PRIVATE-KEY]' },
  { id: 'secret-anthropic-key', kind: 'secret', scope: 'all',
    re: /\bsk-ant-[A-Za-z0-9_-]{16,}/g, to: '[REDACTED-KEY]' },
  { id: 'secret-openai-style-key', kind: 'secret', scope: 'all',
    re: /\bsk-(?:proj-)?[A-Za-z0-9]{32,}/g, to: '[REDACTED-KEY]' },
  { id: 'secret-github-token', kind: 'secret', scope: 'all',
    re: /\bgh[pousr]_[A-Za-z0-9]{20,}/g, to: '[REDACTED-KEY]' },
  { id: 'secret-github-pat', kind: 'secret', scope: 'all',
    re: /\bgithub_pat[_][A-Za-z0-9_]{20,}/g, to: '[REDACTED-KEY]' },
  { id: 'secret-aws-key', kind: 'secret', scope: 'all',
    re: /\bAKIA[0-9A-Z]{16}\b/g, to: '[REDACTED-KEY]' },
  { id: 'secret-google-key', kind: 'secret', scope: 'all',
    re: /\bAIza[0-9A-Za-z_-]{30,}/g, to: '[REDACTED-KEY]' },
  { id: 'secret-slack-token', kind: 'secret', scope: 'all',
    re: /\bxox[abeprs]-[A-Za-z0-9-]{10,}/g, to: '[REDACTED-KEY]' },
  { id: 'secret-hf-token', kind: 'secret', scope: 'all',
    re: /\bhf_[A-Za-z0-9]{30,}/g, to: '[REDACTED-KEY]' },
  { id: 'secret-aristotle-key', kind: 'secret', scope: 'all',
    re: /\barstl_[A-Za-z0-9_-]{8,}/g, to: '[REDACTED-KEY]' },
  { id: 'secret-jwt', kind: 'secret', scope: 'all',
    re: /\beyJ[A-Za-z0-9_-]{15,}\.eyJ[A-Za-z0-9_-]{10,}(?:\.[A-Za-z0-9_-]+)?/g, to: '[REDACTED-TOKEN]' },
  { id: 'secret-bearer', kind: 'secret', scope: 'all',
    re: /\bBearer\s+(?!fake-)[A-Za-z0-9._~+/=-]{20,}/g, to: 'Bearer [REDACTED-TOKEN]' },
  { id: 'secret-deploy-hook', kind: 'secret', scope: 'all',
    re: /(?:https?:\/\/)?api\.vercel\.com\/v1\/integrations\/deploy[A-Za-z0-9_/-]*/g, to: '[REDACTED-DEPLOY-HOOK]' },
  { id: 'secret-env-assignment', kind: 'secret', scope: 'all',
    re: /\b(ANTHROPIC_API_KEY|ANTHROPIC_AUTH_TOKEN|BASIC_AUTH_PASSWORD|VERCEL_TOKEN|GH_TOKEN|GITHUB_TOKEN|OPENAI_API_KEY)(\s*[=:]\s*["']?)(?!sk-ant-api03-[A-Z_-]+(?![A-Za-z0-9]))[A-Za-z0-9_\-./+]{12,}/g,
    to: (_m, name, sep) => `${name}${sep}[REDACTED-KEY]` },
  { id: 'secret-url-userinfo', kind: 'secret', scope: 'all',
    re: /\b([a-z][a-z0-9+.-]*:\/\/)[^/\s:@"'`<>{}$]{1,40}:[^/\s@"'`<>{}$]{1,80}@/g, to: (_m, scheme) => `${scheme}[REDACTED]@` },

  // ── account and deployment identifiers ────────────────────────────────────
  { id: 'account-vercel-id', kind: 'account', scope: 'all',
    re: /\b(prj|team|dpl|usr)_(?!REDACTED)[A-Za-z0-9]{20,}/g, to: (_m, p) => `${p}_REDACTED` },
  { id: 'account-anthropic-id', kind: 'account', scope: 'all',
    re: /\b(org|wrkspc|apikey)_(?!REDACTED)[0-9A-Za-z]{20,}/g, to: (_m, p) => `${p}_REDACTED` },
  { id: 'account-email', kind: 'account', scope: 'ledger',
    // a fixed list of top-level domains, so that matrix products such as W@W.conj are not addresses
    re: /\b(?!noreply@)[A-Za-z0-9._%+-]+@(?!example\.(?:com|org)\b)[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.(?:com|org|net|edu|gov|mil|int|io|ai|co|me|dev|app|info|xyz|tech|cloud|email|uk|de|fr|ch|ca|us|eu|nl|se|no|dk|fi|it|es|pt|at|be|pl|cz|ie|gr|hu|ro|ru|ua|tr|il|in|cn|jp|kr|tw|hk|sg|au|nz|br|mx|ar|za)\b(?!\s*\()/g, to: '[email]' },

  // ── machine paths and hosts ───────────────────────────────────────────────
  { id: 'path-private-tmp', kind: 'path', scope: 'all',
    re: /\/private\/(?:tmp|var\/folders)\/(?!\.\.\.)[^\s"'`)<>\],;]+/g, to: TMP_MARK },
  { id: 'path-var-folders', kind: 'path', scope: 'all',
    re: /\/var\/folders\/[A-Za-z0-9_]{2}\/[^\s"'`)<>\],;]+/g, to: TMP_MARK },
  { id: 'path-tmp-claude', kind: 'path', scope: 'all',
    re: /\/tmp\/claude-[0-9]+\/[^\s"'`)<>\],;]*/g, to: TMP_MARK },
  { id: 'path-home-users', kind: 'path', scope: 'all',
    re: new RegExp(`/Users/(?!(?:${HOME_OK})(?![A-Za-z0-9._-]))[A-Za-z0-9._-]+`, 'g'), to: '/Users/USER' },
  { id: 'path-home-linux', kind: 'path', scope: 'all',
    re: /\/home\/(?!(?:USER|user|runner)\/)[a-z][a-z0-9._-]*\//g, to: '/home/USER/' },
  { id: 'path-home-encoded', kind: 'path', scope: 'all',
    re: /-Users-(?!USER-)[A-Za-z0-9]+-/g, to: '-Users-USER-' },
  { id: 'host-private-ip', kind: 'host', scope: 'all',
    re: /\b192\.168\.[0-9]{1,3}\.[0-9]{1,3}\b/g, to: '[private-ip]' },
  { id: 'host-user-at-local', kind: 'host', scope: 'all',
    re: /\b[A-Za-z0-9._-]+@(?:127\.0\.0\.1|localhost|[A-Za-z0-9-]+\.(?:local|lan|internal))\b/g, to: '[user@host]' },
  { id: 'host-mac-name', kind: 'host', scope: 'ledger',
    re: /\b[A-Za-z0-9]+-(?:MacBook|Mac-mini|Mac-Studio|iMac)[A-Za-z0-9-]*(?:\.local)?\b/g, to: '[host]' },
];

const inScope = (rule, scope) => rule.scope === 'all' || scope === 'ledger';

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/**
 * Values that must never appear anywhere: the contents of the local secret
 * files of this clone. Returned as an array of literals; nothing is logged.
 * @param {string} root repository root
 */
export function loadSecretLiterals(root) {
  const out = new Set();
  const add = (v) => { const t = String(v || '').trim().replace(/^["']|["']$/g, ''); if (t.length >= 12) out.add(t); };
  const scriptsDir = path.join(root, 'scripts');
  let names = [];
  try { names = fs.readdirSync(scriptsDir); } catch { return []; }
  for (const name of names) {
    const full = path.join(scriptsDir, name);
    try {
      if (name === '.env' || /^\.env\.(?!example$)/.test(name)) {
        for (const line of fs.readFileSync(full, 'utf8').split('\n')) {
          const m = line.match(/^\s*(?:export\s+)?[A-Za-z_][A-Za-z0-9_]*\s*=\s*(.*)$/);
          if (m && !line.trim().startsWith('#')) add(m[1]);
        }
      } else if (/^\.deploy-hook-url/.test(name)) {
        add(fs.readFileSync(full, 'utf8'));
      }
    } catch { /* unreadable: nothing to add */ }
  }
  return [...out];
}

/**
 * Rewrite everything the rules can rewrite.
 * @param {string} text
 * @param {{ scope?: 'all'|'ledger', literals?: string[] }} [opts]
 * @returns {{ text: string, changes: { rule: string, count: number }[] }}
 */
export function sanitizeText(text, opts = {}) {
  const scope = opts.scope || 'ledger';
  let out = String(text ?? '');
  const changes = [];
  for (const lit of opts.literals || []) {
    const re = new RegExp(escapeRe(lit), 'g');
    const n = (out.match(re) || []).length;
    if (n) { out = out.replace(re, '[REDACTED-LOCAL-SECRET]'); changes.push({ rule: 'secret-local-file-value', count: n }); }
  }
  for (const rule of RULES) {
    if (!inScope(rule, scope)) continue;
    rule.re.lastIndex = 0;
    let n = 0;
    out = out.replace(rule.re, (...args) => { n += 1; return typeof rule.to === 'function' ? rule.to(...args) : rule.to; });
    if (n) changes.push({ rule: rule.id, count: n });
  }
  return { text: out, changes };
}

/** A short, non-revealing excerpt of a match for log output. */
function mask(match, kind) {
  const flat = match.replace(/\s+/g, ' ');
  if (kind === 'secret') return `${flat.slice(0, 6)}…(${flat.length} chars)`;
  return flat.length > 48 ? `${flat.slice(0, 48)}…` : flat;
}

/**
 * Report every match of the rules. Empty array = publishable.
 * @param {string} text
 * @param {{ scope?: 'all'|'ledger', literals?: string[] }} [opts]
 * @returns {{ rule: string, kind: string, line: number, excerpt: string }[]}
 */
export function findViolations(text, opts = {}) {
  const scope = opts.scope || 'ledger';
  const src = String(text ?? '');
  const found = [];
  const lineOf = (idx) => { let n = 1; for (let i = 0; i < idx; i++) if (src.charCodeAt(i) === 10) n += 1; return n; };
  for (const lit of opts.literals || []) {
    const idx = src.indexOf(lit);
    if (idx !== -1) found.push({ rule: 'secret-local-file-value', kind: 'secret', line: lineOf(idx), excerpt: `(value from a local secret file, ${lit.length} chars)` });
  }
  for (const rule of RULES) {
    if (!inScope(rule, scope)) continue;
    rule.re.lastIndex = 0;
    let m; let guard = 0;
    while ((m = rule.re.exec(src)) !== null && guard < 50) {
      guard += 1;
      found.push({ rule: rule.id, kind: rule.kind, line: lineOf(m.index), excerpt: mask(m[0], rule.kind) });
      if (m[0].length === 0) rule.re.lastIndex += 1;
    }
  }
  return found;
}

export class UnpublishableTextError extends Error {
  constructor(violations) {
    super(`text is not publishable: ${violations.map((v) => `${v.rule} (${v.excerpt})`).join('; ')}`);
    this.name = 'UnpublishableTextError';
    this.violations = violations;
  }
}

/**
 * The function writers call. Returns sanitised text; throws when something
 * that cannot be rewritten safely is still present after the rewrite.
 * @param {string} text
 * @param {{ literals?: string[], scope?: 'all'|'ledger' }} [opts]
 */
export function sanitizeForLedger(text, opts = {}) {
  const scope = opts.scope || 'ledger';
  const { text: out } = sanitizeText(text, { scope, literals: opts.literals });
  const left = findViolations(out, { scope, literals: opts.literals });
  if (left.length) throw new UnpublishableTextError(left);
  return out;
}

/** Deep-sanitise every string of a JSON-like value (used for status output). */
export function sanitizeDeep(value, opts = {}) {
  if (typeof value === 'string') return sanitizeForLedger(value, opts);
  if (Array.isArray(value)) return value.map((v) => sanitizeDeep(v, opts));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = sanitizeDeep(v, opts);
    return out;
  }
  return value;
}

/** Repository-relative paths of the ticket ledgers (strict scope). */
export const LEDGER_FILES = [
  'src/data/improvement-queue.js',
  'src/data/improvements.js',
  'IMPROVEMENTS.md',
];
