#!/usr/bin/env node
// scripts/claim-ticket-id.mjs
// Optimistic concurrency control for ticket IDs.
//
// Usage: node scripts/claim-ticket-id.mjs <proposed-id>
//   <proposed-id>  integer (e.g. 439) or full string (e.g. imp-439)
//
// Prints the claimed id (imp-NNN) to stdout; may be > proposed if collision.
// Appends a JSON line to scripts/.ticket-id-claim.log so concurrent agents
// can detect conflicts within the WINDOW_MS time window.

import { readFileSync, appendFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLAIM_LOG = join(__dirname, '.ticket-id-claim.log');
const WINDOW_MS = 300_000; // 5 minutes — matches Dyson-ODE cache TTL convention
const MAX_BUMP = 20;       // stop bumping after 20 increments

function parseNum(raw) {
  const m = String(raw).match(/(\d+)$/);
  if (!m) { console.error(`claim-ticket-id: cannot parse "${raw}"`); process.exit(1); }
  return parseInt(m[1], 10);
}

function readClaims() {
  try {
    return readFileSync(CLAIM_LOG, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map(line => JSON.parse(line));
  } catch (_) {
    return [];
  }
}

function isTaken(claims, num) {
  const now = Date.now();
  return claims.some(c => c.num === num && now - new Date(c.ts).getTime() < WINDOW_MS);
}

function claim(proposed) {
  let num = parseNum(proposed);
  const existing = readClaims();
  for (let i = 0; i < MAX_BUMP; i++) {
    if (!isTaken(existing, num)) break;
    num++;
  }
  const entry = JSON.stringify({ num, id: `imp-${num}`, ts: new Date().toISOString(), pid: process.pid });
  appendFileSync(CLAIM_LOG, entry + '\n');
  return `imp-${num}`;
}

const proposed = process.argv[2];
if (!proposed) {
  console.error('Usage: node scripts/claim-ticket-id.mjs <proposed-id>');
  process.exit(1);
}

console.log(claim(proposed));
