#!/usr/bin/env node
// scripts/dispatch-subagent.mjs
// imp-1273: META-HARNESS subagent dispatch prompt-template generator.
//
// Each Agent() dispatch the orchestrator makes is ~300-500 words, ~80% of
// which is repeated boilerplate (worktree setup, build-green, atomic commit,
// queue-completed marking, do-not-push, report-back format). This CLI takes
// a ticket-id from src/data/improvement-queue.js and emits a fully-formed
// subagent prompt to stdout. The orchestrator copies the stdout straight
// into the Agent() call.
//
// Usage:
//   node scripts/dispatch-subagent.mjs --ticket imp-NNNN
//   node scripts/dispatch-subagent.mjs --ticket imp-NNNN --refs imp-XXX,imp-YYY
//   node scripts/dispatch-subagent.mjs --ticket imp-NNNN --bg
//   node scripts/dispatch-subagent.mjs --ticket imp-NNNN --template <path>
//
// Exit codes:
//   0 -- prompt rendered to stdout
//   1 -- usage error (bad flag, missing ticket, ticket already completed)
//   2 -- template malformed (unresolved {{placeholders}} after render, or
//        template file missing)
//   3 -- internal error (queue parse failure, fs error)
//
// Design notes:
// - Uses simple String.prototype.replaceAll for {{var}} substitution; NO
//   Mustache / Handlebars dep.
// - Refuses to dispatch on a ticket whose status is already 'completed' —
//   prevents re-doing finished work.
// - Auto-detects (a) src/data/imp-NNNN*.js WIP files, (b) recent
//   thinking/decisions/*.md mentioning the ticket id.
// - This is a prompt GENERATOR. It does NOT invoke Agent() itself.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const REPO_ROOT  = path.resolve(__dirname, '..');

// ── Arg parsing ───────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const out = {
    ticket: null,
    refs: [],
    bg: false,
    template: null,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case '--ticket':   out.ticket = argv[++i]; break;
      case '--refs':     out.refs = parseRefs(argv[++i]); break;
      case '--bg':       out.bg = true; break;
      case '--template': out.template = argv[++i]; break;
      case '-h':
      case '--help':     out.help = true; break;
      default:
        if (a.startsWith('--ticket='))   out.ticket   = a.slice('--ticket='.length);
        else if (a.startsWith('--refs=')) out.refs    = parseRefs(a.slice('--refs='.length));
        else if (a.startsWith('--template=')) out.template = a.slice('--template='.length);
        else fail(1, `Unknown argument: ${a}`);
    }
  }
  return out;
}

function parseRefs(s) {
  if (!s) return [];
  return s.split(',').map((x) => x.trim()).filter(Boolean);
}

function usage() {
  return `Usage:
  node scripts/dispatch-subagent.mjs --ticket imp-NNNN
  node scripts/dispatch-subagent.mjs --ticket imp-NNNN --refs imp-XXX,imp-YYY
  node scripts/dispatch-subagent.mjs --ticket imp-NNNN --bg
  node scripts/dispatch-subagent.mjs --ticket imp-NNNN --template <path>

Exit codes:
  0 ok | 1 usage/missing-ticket | 2 template malformed | 3 internal error

Emits a fully-formed subagent prompt to stdout. Copy the stdout into
your Agent() dispatch call. Does NOT invoke Agent() itself.`;
}

function fail(code, msg) {
  process.stderr.write(msg + '\n');
  if (code === 1) process.stderr.write(usage() + '\n');
  process.exit(code);
}

// ── Queue loading ────────────────────────────────────────────────────────────

const QUEUE_PATH = path.join(REPO_ROOT, 'src', 'data', 'improvement-queue.js');

async function loadQueue() {
  if (!fs.existsSync(QUEUE_PATH)) {
    fail(3, `improvement-queue.js not found at ${QUEUE_PATH}`);
  }
  let mod;
  try {
    mod = await import(pathToFileURL(QUEUE_PATH).href);
  } catch (e) {
    fail(3, `Failed to import improvement-queue.js: ${e.message}`);
  }
  const q = mod.IMPROVEMENT_QUEUE || mod.default;
  if (!Array.isArray(q)) {
    fail(3, `improvement-queue.js does not export IMPROVEMENT_QUEUE as an array`);
  }
  return q;
}

function findTicket(queue, id) {
  return queue.find((t) => t && t.id === id) || null;
}

// ── Auto-detection ───────────────────────────────────────────────────────────

function autodetectDataFiles(ticketId) {
  // Look for src/data/<ticketId>*.js -- typical convention for in-progress
  // or completed ticket data modules.
  const dataDir = path.join(REPO_ROOT, 'src', 'data');
  if (!fs.existsSync(dataDir)) return [];
  const entries = fs.readdirSync(dataDir);
  const prefix = `${ticketId}`;
  const hits = entries.filter((f) => f.startsWith(prefix) && f.endsWith('.js'));
  return hits.map((f) => `src/data/${f}`);
}

function autodetectDecisionDocs(ticketId, limit = 5) {
  const docDir = path.join(REPO_ROOT, 'thinking', 'decisions');
  if (!fs.existsSync(docDir)) return [];
  const entries = fs.readdirSync(docDir).filter((f) => f.endsWith('.md'));
  const matches = [];
  for (const f of entries) {
    const full = path.join(docDir, f);
    let body;
    try { body = fs.readFileSync(full, 'utf8'); } catch { continue; }
    if (body.includes(ticketId)) {
      matches.push({ name: f, mtime: fs.statSync(full).mtimeMs });
    }
  }
  matches.sort((a, b) => b.mtime - a.mtime);
  return matches.slice(0, limit).map((m) => `thinking/decisions/${m.name}`);
}

// ── Model / channel heuristics ───────────────────────────────────────────────

function modelPersonaHint(model) {
  // Suggest subagent_type / persona for the orchestrator's Agent() call.
  const m = String(model || '').toLowerCase();
  if (m.includes('opus')) {
    return 'opus-class — heavy reasoning, math-proof work, complex refactors';
  }
  if (m.includes('sonnet')) {
    return 'sonnet-class — balanced reasoning and code work, most tickets';
  }
  if (m.includes('haiku')) {
    return 'haiku-class — light/templated work, CLI scaffolding, doc edits';
  }
  return 'unspecified — choose based on complexity';
}

function channelHint(model) {
  // Map model -> the conventional completedByChannel string used in the queue.
  const m = String(model || '').toLowerCase();
  if (m.startsWith('opus-4-8') || m === 'opus-4-7' || m === 'opus-4-6') {
    return `${m}-worktree`;
  }
  if (m.startsWith('sonnet')) return `${m}-worktree`;
  if (m.startsWith('haiku'))  return `${m}-worktree`;
  return 'subagent-worktree';
}

// ── Wrap / format helpers ────────────────────────────────────────────────────

function wrap(text, width = 78) {
  if (!text) return '';
  // Preserve paragraph breaks (blank lines). Wrap each paragraph to `width`.
  const paragraphs = String(text).split(/\n\n+/);
  return paragraphs
    .map((p) => {
      const collapsed = p.replace(/\s+/g, ' ').trim();
      if (!collapsed) return '';
      const words = collapsed.split(' ');
      const lines = [];
      let cur = '';
      for (const w of words) {
        if (!cur) { cur = w; continue; }
        if (cur.length + 1 + w.length > width) { lines.push(cur); cur = w; }
        else { cur += ' ' + w; }
      }
      if (cur) lines.push(cur);
      return lines.join('\n');
    })
    .join('\n\n');
}

function summarizeTicket(t) {
  // One-line summary used in dependsOn / refs listings.
  if (!t) return null;
  const status = t.status ? `[${t.status}]` : '';
  return `- ${t.id} ${status} ${t.title || '(no title)'}`;
}

// ── Boilerplate blocks ───────────────────────────────────────────────────────

const HEADER_BLOCK = `You are operating in an isolated git worktree. Your changes will be
cherry-picked back onto main via scripts/salvage-subagent.mjs after you
complete. Work entirely inside this worktree — do not push, do not switch
branches, do not modify .claude/ or other worktree directories.`.trim();

const REPORT_BACK_BLOCK = `## Report back

- Files created / modified (absolute or repo-relative paths)
- Commit SHA on the worktree branch
- Build green: yes / no (and error excerpt if no)
- Tripwire summary if applicable (count, what each enforces)
- Any deviations from the ticket scope and why`.trim();

const HARD_RULES_BLOCK = `## Hard rules

- DO NOT push. The orchestrator runs scripts/salvage-subagent.mjs to
  cherry-pick your commit onto main.
- DO NOT switch branches or rebase.
- DO NOT modify .claude/, other worktree directories, or any
  scripts/.heartbeat* / .pid sentinel files.
- Single atomic commit at the end of the work. No work-in-progress
  commits in the middle.
- npm run build MUST be green before you commit.
- If you hit a duration/token limit and have to leave WIP, leave the
  data file untracked in src/data/ — the orchestrator's WIP-detect
  flow will find it.`.trim();

const BG_REMINDER = `## Background-mode reminder

You are running in background mode — the orchestrator will be notified
when you complete. Do not wait for interactive confirmation; make the
best call you can on ambiguous decisions and document the reasoning in
the closureNote.`.trim();

// ── Template rendering ───────────────────────────────────────────────────────

function renderTemplate(tmpl, vars) {
  let out = tmpl;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{{${k}}}`, v == null ? '' : String(v));
  }
  return out;
}

const REQUIRED_PLACEHOLDERS = [
  'HEADER_BLOCK',
  'TICKET_ID',
  'TICKET_TITLE',
  'TICKET_DESCRIPTION',
  'TICKET_RATIONALE',
  'TICKET_PRIORITY',
  'TICKET_COMPLEXITY',
  'TICKET_MODEL',
  'DEPENDS_ON_DESCRIPTIONS',
  'REFS_DESCRIPTIONS',
  'COMMON_FILES_TO_READ',
  'REPORT_BACK_BLOCK',
  'HARD_RULES_BLOCK',
  'BG_REMINDER',
  'MODEL_PERSONA_HINT',
  'TICKET_NUM',
  'TICKET_CHANNEL_HINT',
];

function validateTemplate(tmpl) {
  // Every required placeholder must appear at least once.
  const missing = [];
  for (const p of REQUIRED_PLACEHOLDERS) {
    if (!tmpl.includes(`{{${p}}}`)) missing.push(p);
  }
  if (missing.length > 0) {
    fail(2, `Template malformed: missing placeholders: ${missing.join(', ')}`);
  }
}

function validateRender(rendered) {
  // After render, there should be no remaining {{...}} markers.
  const leftovers = rendered.match(/\{\{[A-Z_][A-Z0-9_]*\}\}/g);
  if (leftovers && leftovers.length > 0) {
    fail(2, `Template malformed: unresolved placeholders after render: ${[...new Set(leftovers)].join(', ')}`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(usage() + '\n');
    process.exit(0);
  }
  if (!args.ticket) fail(1, 'Missing --ticket flag.');
  if (!/^imp-\d+$/.test(args.ticket)) {
    fail(1, `Bad ticket id format: ${args.ticket}. Expected imp-NNNN (digits only).`);
  }
  for (const r of args.refs) {
    if (!/^imp-\d+$/.test(r)) fail(1, `Bad --refs entry: ${r}. Expected imp-NNNN.`);
  }

  const queue = await loadQueue();
  const ticket = findTicket(queue, args.ticket);
  if (!ticket) fail(1, `Ticket ${args.ticket} not found in src/data/improvement-queue.js`);
  if (ticket.status === 'completed') {
    fail(1, `Ticket ${args.ticket} is already status='completed'. Refusing to dispatch a duplicate run.`);
  }

  const templatePath = args.template
    ? path.resolve(args.template)
    : path.join(REPO_ROOT, 'scripts', 'templates', 'subagent-prompt.tmpl');
  if (!fs.existsSync(templatePath)) {
    fail(2, `Template file not found: ${templatePath}`);
  }
  const tmpl = fs.readFileSync(templatePath, 'utf8');
  validateTemplate(tmpl);

  // Resolve dependsOn descriptions
  const deps = Array.isArray(ticket.dependsOn) ? ticket.dependsOn : [];
  const depLines = deps.length === 0
    ? '- (none)'
    : deps.map((id) => summarizeTicket(findTicket(queue, id)) || `- ${id} (not found in queue)`).join('\n');

  // Resolve --refs descriptions
  const refLines = args.refs.length === 0
    ? '- (none provided — orchestrator did not pass --refs)'
    : args.refs.map((id) => summarizeTicket(findTicket(queue, id)) || `- ${id} (not found in queue)`).join('\n');

  // Auto-detect context files
  const dataFiles = autodetectDataFiles(ticket.id);
  const decisionDocs = autodetectDecisionDocs(ticket.id, 5);
  const fileLines = [];
  fileLines.push(`- src/data/improvement-queue.js (this ticket lives here)`);
  if (dataFiles.length > 0) {
    fileLines.push(`- ${dataFiles.join('\n- ')}`);
  }
  if (decisionDocs.length > 0) {
    fileLines.push(`- ${decisionDocs.join('\n- ')}`);
  }
  fileLines.push(`- scripts/run-assertions.mjs (DATA_MODULES array — append new data file here)`);
  const filesBlock = fileLines.join('\n');

  // Extract numeric part of ticket id for the {{TICKET_NUM}} placeholder
  const ticketNum = ticket.id.replace(/^imp-/, '');

  const vars = {
    HEADER_BLOCK,
    TICKET_ID: ticket.id,
    TICKET_TITLE: ticket.title || '(no title)',
    TICKET_DESCRIPTION: wrap(ticket.description || '(no description)'),
    TICKET_RATIONALE: wrap(ticket.rationale || '(no rationale)'),
    TICKET_PRIORITY: ticket.priority || 'unspecified',
    TICKET_COMPLEXITY: ticket.estimatedComplexity || 'unspecified',
    TICKET_MODEL: ticket.model || 'unspecified',
    MODEL_PERSONA_HINT: modelPersonaHint(ticket.model),
    DEPENDS_ON_DESCRIPTIONS: depLines,
    REFS_DESCRIPTIONS: refLines,
    COMMON_FILES_TO_READ: filesBlock,
    REPORT_BACK_BLOCK,
    HARD_RULES_BLOCK,
    BG_REMINDER: args.bg ? BG_REMINDER : '',
    TICKET_NUM: ticketNum,
    TICKET_CHANNEL_HINT: channelHint(ticket.model),
  };

  const rendered = renderTemplate(tmpl, vars);
  validateRender(rendered);
  process.stdout.write(rendered);
  if (!rendered.endsWith('\n')) process.stdout.write('\n');
}

main().catch((e) => {
  process.stderr.write(`internal error: ${e && e.stack ? e.stack : e}\n`);
  process.exit(3);
});
