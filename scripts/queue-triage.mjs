#!/usr/bin/env node
// Queue triage CLI — surface pending tickets ranked by a composite score
// combining priority weight, inverse dependency depth, and age.
//
// Usage:
//   node scripts/queue-triage.mjs
//   # Prints to stdout + writes scripts/.queue-triage-state.json
//
// Scoring:
//   priorityWeight: critical=4, high=3, medium=2, low=1
//   depDepth:       1 / (1 + #unresolved deps)
//   ageDays:        days since createdAt (else proxy from id ordering;
//                   lower id = older = larger age)
//   score = priorityWeight * depDepth * log(1 + ageDays)
//
// Also flags:
//   STALLED:          pending with id <= 1100 (legacy, likely stuck)
//   BROKEN DEPS:      dependsOn points at missing/superseded ticket
//   UNROUTED CRITICAL: critical+pending+no model field assigned
//
// Read-only — never mutates the queue. Exit code 0 always.
// imp-1173 (META) — Opus 4.7 worktree subagent.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const QUEUE_PATH = path.join(REPO_ROOT, 'src/data/improvement-queue.js');
const OUT_PATH = path.join(__dirname, '.queue-triage-state.json');

const PRIORITY_WEIGHT = { critical: 4, high: 3, medium: 2, low: 1 };
const STALLED_ID_CUTOFF = 1100;

function parseIdNumber(id) {
  // ids look like 'imp-001', 'imp-1173', 'imp-407' — extract trailing integer
  const m = /imp-(\d+)/i.exec(id || '');
  return m ? parseInt(m[1], 10) : null;
}

function ageDaysFromTicket(ticket, maxIdSeen) {
  // If a createdAt exists, prefer it.
  if (ticket.createdAt) {
    const t = Date.parse(ticket.createdAt);
    if (!Number.isNaN(t)) {
      const days = (Date.now() - t) / (1000 * 60 * 60 * 24);
      return Math.max(0, days);
    }
  }
  // Otherwise approximate from id ordering: lower id = older.
  // Map id rank to a plausible age in days, scaled so the oldest ticket
  // is ~365d and the newest is ~0d. This is a rough proxy.
  const n = parseIdNumber(ticket.id);
  if (n == null || !maxIdSeen) return 0;
  const rankFromNewest = Math.max(0, maxIdSeen - n);
  // Assume ~3 tickets/day average burn over project lifetime.
  return rankFromNewest / 3;
}

function fmtScore(s) {
  return s.toFixed(2).padStart(6, ' ');
}

function fmtAge(d) {
  if (d < 1) return '<1d';
  if (d < 100) return `${Math.round(d)}d`;
  return `${Math.round(d)}d`;
}

async function main() {
  const queueUrl = pathToFileURL(QUEUE_PATH).href;
  const mod = await import(queueUrl);
  const QUEUE = mod.IMPROVEMENT_QUEUE || mod.default;
  if (!Array.isArray(QUEUE)) {
    console.error('FATAL: could not load IMPROVEMENT_QUEUE array from', QUEUE_PATH);
    process.exit(0);
  }

  // Index every ticket id → status for dep validation
  const idIndex = new Map();
  let maxIdSeen = 0;
  for (const t of QUEUE) {
    if (!t || !t.id) continue;
    idIndex.set(t.id, t);
    const n = parseIdNumber(t.id);
    if (n != null && n > maxIdSeen) maxIdSeen = n;
  }

  const pending = QUEUE.filter(t => t && t.status === 'pending');

  const scored = pending.map(t => {
    const priority = t.priority || 'low';
    const pw = PRIORITY_WEIGHT[priority] ?? 1;
    const deps = Array.isArray(t.dependsOn) ? t.dependsOn : [];
    const unresolvedDeps = deps.filter(depId => {
      const dep = idIndex.get(depId);
      return !dep || dep.status !== 'completed';
    });
    const depDepth = 1 / (1 + unresolvedDeps.length);
    const ageDays = ageDaysFromTicket(t, maxIdSeen);
    const score = pw * depDepth * Math.log(1 + ageDays);

    // Broken deps: dependsOn pointing at a missing id
    const brokenDeps = deps.filter(depId => !idIndex.has(depId));

    return {
      id: t.id,
      title: t.title || '',
      priority,
      priorityWeight: pw,
      category: t.category || null,
      proofSection: t.proofSection || null,
      model: t.model || null,
      channel: t.channel || null,
      deps,
      unresolvedDeps,
      brokenDeps,
      depDepth,
      ageDays,
      score,
      idNumber: parseIdNumber(t.id),
    };
  });

  scored.sort((a, b) => b.score - a.score);

  // Flagged subsets
  const stalled = scored.filter(s => s.idNumber != null && s.idNumber <= STALLED_ID_CUTOFF);
  const brokenDeps = scored.filter(s => s.brokenDeps.length > 0);
  const unroutedCritical = scored.filter(s => s.priority === 'critical' && !s.model);

  // --- stdout report ---
  const lines = [];
  lines.push(`PENDING TRIAGE (${scored.length} tickets)`);
  lines.push('  ranked by score = priorityWeight × depDepth × log(1+ageDays)');
  lines.push('');
  for (const s of scored) {
    const depsLabel = s.deps.length
      ? `deps: ${s.deps.join(',')}${s.unresolvedDeps.length ? ` (${s.unresolvedDeps.length} unresolved)` : ''}`
      : 'deps: none';
    const engineLabel = s.model ? ` @${s.model}` : ' @unrouted';
    lines.push(
      `  [score=${fmtScore(s.score)} | ${s.priority.padEnd(8)}]${engineLabel} ${s.id}: ${s.title} (${depsLabel}, age: ${fmtAge(s.ageDays)})`
    );
  }
  lines.push('');

  if (stalled.length) {
    lines.push(`STALLED (id <= ${STALLED_ID_CUTOFF}): ${stalled.length} tickets`);
    for (const s of stalled) {
      lines.push(`  ${s.id} [${s.priority}]: ${s.title}`);
    }
    lines.push('');
  }

  if (brokenDeps.length) {
    lines.push(`BROKEN DEPS: ${brokenDeps.length} tickets reference missing ids`);
    for (const s of brokenDeps) {
      lines.push(`  ${s.id}: missing ${s.brokenDeps.join(', ')}`);
    }
    lines.push('');
  }

  if (unroutedCritical.length) {
    lines.push(`UNROUTED CRITICAL: ${unroutedCritical.length} tickets are priority=critical with no model field`);
    for (const s of unroutedCritical) {
      lines.push(`  ${s.id}: ${s.title}`);
    }
    lines.push('');
  }

  process.stdout.write(lines.join('\n') + '\n');

  // --- JSON dump ---
  const state = {
    generatedAt: new Date().toISOString(),
    totalPending: scored.length,
    totalTickets: QUEUE.length,
    maxIdSeen,
    stalledIdCutoff: STALLED_ID_CUTOFF,
    ranked: scored.map(s => ({
      id: s.id,
      title: s.title,
      priority: s.priority,
      priorityWeight: s.priorityWeight,
      category: s.category,
      proofSection: s.proofSection,
      model: s.model,
      channel: s.channel,
      deps: s.deps,
      unresolvedDeps: s.unresolvedDeps,
      brokenDeps: s.brokenDeps,
      depDepth: Number(s.depDepth.toFixed(4)),
      ageDays: Number(s.ageDays.toFixed(2)),
      score: Number(s.score.toFixed(4)),
    })),
    flags: {
      stalled: stalled.map(s => s.id),
      brokenDeps: brokenDeps.map(s => ({ id: s.id, missing: s.brokenDeps })),
      unroutedCritical: unroutedCritical.map(s => s.id),
    },
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(state, null, 2) + '\n');
  process.stdout.write(`\nWrote ${OUT_PATH} (${fs.statSync(OUT_PATH).size} bytes)\n`);
}

main().catch(err => {
  console.error('queue-triage error:', err);
  // Informational tool — exit 0 even on failure.
  process.exit(0);
});
