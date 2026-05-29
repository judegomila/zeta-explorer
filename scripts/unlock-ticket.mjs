#!/usr/bin/env node
// scripts/unlock-ticket.mjs
// imp-1285: manual operator CLI to flip a single ticket's `status:` field
// in src/data/improvement-queue.js.
//
// Primary use case: a dispatched subagent hit its duration / token limit
// without committing, leaving the queue entry stuck at
// status='in-progress-subagent'. Without this CLI the operator would have
// to hand-edit the 19k-line queue file. With it:
//
//   node scripts/unlock-ticket.mjs --ticket imp-1285 --to pending
//
// flips the entry back to 'pending' so the engine ticket-picker can grab
// it again. Idempotent: re-running on a ticket already at the target
// status is a no-op and exits 0.
//
// Usage:
//   node scripts/unlock-ticket.mjs --ticket imp-NNNN --to <status>
//   node scripts/unlock-ticket.mjs --ticket imp-NNNN --to <status> --from <status>
//   node scripts/unlock-ticket.mjs --ticket imp-NNNN --to <status> --dry-run
//   node scripts/unlock-ticket.mjs --ticket imp-NNNN --inspect
//   node scripts/unlock-ticket.mjs --list-locked
//
// Legal statuses: pending, in-progress-subagent, completed, blocked, abandoned.
//
// Exit codes:
//   0 — flip applied (or already at target, or dry-run reported the change)
//   1 — usage error / bad ticket id / illegal status
//   2 — ticket not found in queue
//   3 — status mismatch (--from provided, current status differs)
//   4 — mtime race / write failure / parse failure

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  flipTicketStatus,
  inspectTicket,
  LEGAL_STATUSES,
  QUEUE_PATH,
} from './_queue-status-edit.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

function parseArgs(argv) {
  const out = {
    ticket: null,
    to: null,
    from: null,
    dryRun: false,
    inspect: false,
    listLocked: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case '--ticket':       out.ticket   = argv[++i]; break;
      case '--to':           out.to       = argv[++i]; break;
      case '--from':         out.from     = argv[++i]; break;
      case '--dry-run':      out.dryRun   = true;      break;
      case '--inspect':      out.inspect  = true;      break;
      case '--list-locked':  out.listLocked = true;    break;
      case '-h':
      case '--help':         out.help     = true;      break;
      default:
        if      (a.startsWith('--ticket=')) out.ticket = a.slice('--ticket='.length);
        else if (a.startsWith('--to='))     out.to     = a.slice('--to='.length);
        else if (a.startsWith('--from='))   out.from   = a.slice('--from='.length);
        else fail(1, `Unknown argument: ${a}`);
    }
  }
  return out;
}

function usage() {
  return `Usage:
  node scripts/unlock-ticket.mjs --ticket imp-NNNN --to <status>
  node scripts/unlock-ticket.mjs --ticket imp-NNNN --to <status> --from <status>
  node scripts/unlock-ticket.mjs --ticket imp-NNNN --to <status> --dry-run
  node scripts/unlock-ticket.mjs --ticket imp-NNNN --inspect
  node scripts/unlock-ticket.mjs --list-locked

Legal --to values: ${LEGAL_STATUSES.join(', ')}.

Exit codes:
  0 ok | 1 usage | 2 ticket not found | 3 status mismatch | 4 write failure`;
}

function fail(code, msg) {
  process.stderr.write(msg + '\n');
  if (code === 1) process.stderr.write(usage() + '\n');
  process.exit(code);
}

function listLocked() {
  if (!fs.existsSync(QUEUE_PATH)) fail(4, `queue not found at ${QUEUE_PATH}`);
  const text = fs.readFileSync(QUEUE_PATH, 'utf8');
  // Quick regex scan for status: 'in-progress-subagent' and the nearby id.
  const found = [];
  const re = /id:\s*['"](imp-\d+)['"][\s\S]{0,2000}?status:\s*['"]in-progress-subagent['"]/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    found.push(m[1]);
  }
  if (found.length === 0) {
    process.stdout.write('No tickets are currently locked (status=in-progress-subagent).\n');
    process.exit(0);
  }
  process.stdout.write(`${found.length} locked ticket(s):\n`);
  for (const id of found) {
    const insp = inspectTicket(id);
    const inflight = insp.inflightTaskId ? `  inflightTaskId=${insp.inflightTaskId}` : '';
    process.stdout.write(`  ${id}${inflight}\n`);
  }
  process.exit(0);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || process.argv.length === 2) {
    process.stdout.write(usage() + '\n');
    process.exit(args.help ? 0 : 1);
  }

  if (args.listLocked) return listLocked();

  if (!args.ticket) fail(1, 'Missing --ticket.');
  if (!/^imp-\d+$/.test(args.ticket)) fail(1, `Bad ticket id: ${args.ticket}`);

  if (args.inspect) {
    const insp = inspectTicket(args.ticket);
    if (!insp.found) fail(2, `Ticket ${args.ticket} not found in queue.`);
    process.stdout.write(`${args.ticket}: status='${insp.status}'`);
    if (insp.inflightTaskId) process.stdout.write(` inflightTaskId='${insp.inflightTaskId}'`);
    process.stdout.write('\n');
    process.exit(0);
  }

  if (!args.to) fail(1, 'Missing --to.');
  if (!LEGAL_STATUSES.includes(args.to)) {
    fail(1, `Illegal --to status: ${args.to}. Legal: ${LEGAL_STATUSES.join(', ')}.`);
  }
  if (args.from && !LEGAL_STATUSES.includes(args.from)) {
    fail(1, `Illegal --from status: ${args.from}. Legal: ${LEGAL_STATUSES.join(', ')}.`);
  }

  // Always strip inflightTaskId on a manual unlock — operator intent is to
  // clear the lock, regardless of target status.
  const result = flipTicketStatus({
    ticketId: args.ticket,
    to: args.to,
    from: args.from,
    inflightTaskId: null,
    dryRun: args.dryRun,
  });

  if (result.changed) {
    const tag = args.dryRun ? '[dry-run]' : '[live]';
    process.stdout.write(`unlock ${tag} ${args.ticket}: status='${result.currentStatus}' -> '${args.to}'\n`);
    process.exit(0);
  }
  // Not changed; figure out why.
  switch (result.reason) {
    case 'already-at-target':
      process.stdout.write(`unlock: ${args.ticket} already at status='${args.to}' — no-op.\n`);
      process.exit(0);
    case 'ticket-not-found':
      fail(2, result.error);
    case 'status-mismatch':
      fail(3, result.error);
    case 'mtime-race-detected':
    case 'parse-failure':
    case 'queue-missing':
    case 'bad-ticket-id':
    case 'bad-target-status':
      fail(4, result.error || result.reason);
    case 'no-op':
      process.stdout.write(`unlock: ${args.ticket} no-op (status unchanged).\n`);
      process.exit(0);
    default:
      fail(4, `unexpected reason: ${result.reason}`);
  }
}

main();
