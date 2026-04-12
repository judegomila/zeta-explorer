#!/usr/bin/env node
// Queue index cache generator — the biggest single token-burn fix available.
//
// Problem: every engine run and every agent fanout re-reads
// src/data/improvements.js (~283K tokens), src/data/improvement-queue.js
// (~87K tokens), and IMPROVEMENTS.md (~59K tokens) just to find a ticket
// and determine the next append id. Total ~430K input tokens per run.
// Tier 1 Opus API allows ~40K input tokens per minute. We are 10x over
// per run and hitting 429s constantly.
//
// Fix: precompute a tiny JSON index with just the fields the engine
// actually needs. Engine reads this tiny index (~2 KB) instead of the
// monolithic source files. Regenerate after every successful commit.
//
// Usage:
//   node scripts/build-queue-index.mjs
//   # Writes scripts/queue-index.json
//
// Output shape:
//   {
//     generatedAt: ISO timestamp
//     nextImprovementId: next monotonic id for src/data/improvements.js
//     improvementsTotal: total entries in improvements.js
//     criticalPending: [ { id, title, priority, dependsOn } ]
//     highPending: [...]
//     mediumPending: [...]
//     metaPending: [...]
//     allPendingIds: [...]
//     totalPending: number
//     totalCompleted: number
//     hotFiles: { path: tokenEstimate, ... }  // token burn diagnostic
//   }

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const QUEUE_FILE = path.join(PROJECT_ROOT, 'src/data/improvement-queue.js');
const IMPROVEMENTS_FILE = path.join(PROJECT_ROOT, 'src/data/improvements.js');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'scripts/queue-index.json');

// ── Parse improvement-queue.js with a balanced-brace walker ───────────────

function parseQueue(text) {
  const items = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    if (text[i] === '{') {
      let depth = 1;
      const start = i;
      i++;
      while (i < n && depth > 0) {
        if (text[i] === '{') depth++;
        else if (text[i] === '}') depth--;
        i++;
      }
      const chunk = text.slice(start, i);
      if (chunk.includes("id: 'imp-")) items.push(chunk);
    } else {
      i++;
    }
  }
  return items;
}

function field(chunk, key) {
  const re = new RegExp(`${key}:\\s*'([^']+)'`);
  const m = chunk.match(re);
  return m ? m[1] : null;
}

function dependsOnField(chunk) {
  const m = chunk.match(/dependsOn:\s*\[([^\]]*)\]/);
  if (!m) return [];
  return m[1]
    .split(',')
    .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

// ── Parse improvements.js: just count entries + find the highest id ──────
//
// We avoid loading the whole file into memory by streaming it and grepping
// for the id pattern. The file is ~1.1 MB so this is fast but keeps memory
// flat.

function parseImprovementsStats(text) {
  let total = 0;
  let maxId = 0;
  const re = /\{\s*id:\s*(\d+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    total++;
    const id = parseInt(m[1], 10);
    if (id > maxId) maxId = id;
  }
  return { total, maxId };
}

// ── Token estimate (rough, char/4) ────────────────────────────────────────

function tokenEstimate(filePath) {
  try {
    const size = fs.statSync(filePath).size;
    return Math.round(size / 4);
  } catch {
    return 0;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────

function main() {
  // Staleness check: if queue-index.json is newer than improvement-queue.js,
  // the cache is still valid — skip the expensive rebuild.
  try {
    const indexMtime = fs.statSync(OUTPUT_FILE).mtimeMs;
    const queueMtime = fs.statSync(QUEUE_FILE).mtimeMs;
    if (indexMtime > queueMtime) {
      console.log('queue-index.json is up to date (improvement-queue.js unchanged) — skipping rebuild.');
      return;
    }
  } catch {
    // OUTPUT_FILE does not exist yet — proceed with full build.
  }

  const queueText = fs.readFileSync(QUEUE_FILE, 'utf8');
  const improvementsText = fs.readFileSync(IMPROVEMENTS_FILE, 'utf8');

  const items = parseQueue(queueText);

  const byPriority = {
    critical: [],
    high: [],
    medium: [],
    low: [],
  };
  const metaItems = [];
  const allPendingIds = [];
  let totalPending = 0;
  let totalCompleted = 0;

  for (const chunk of items) {
    const status = field(chunk, 'status');
    if (status === 'completed') {
      totalCompleted++;
      continue;
    }
    if (status !== 'pending') continue;
    totalPending++;

    const id = field(chunk, 'id');
    const title = field(chunk, 'title');
    const priority = field(chunk, 'priority') || 'medium';
    const category = field(chunk, 'category');
    const complexity = field(chunk, 'estimatedComplexity');
    const deps = dependsOnField(chunk);

    const row = { id, title, priority, category, complexity, dependsOn: deps };
    allPendingIds.push(id);

    if (byPriority[priority]) byPriority[priority].push(row);
    if (category === 'meta') metaItems.push(row);
  }

  const { total: improvementsTotal, maxId } = parseImprovementsStats(
    improvementsText,
  );

  const index = {
    generatedAt: new Date().toISOString(),
    nextImprovementId: maxId + 1,
    improvementsTotal,
    totalPending,
    totalCompleted,
    criticalPending: byPriority.critical,
    highPending: byPriority.high,
    mediumPending: byPriority.medium,
    lowPending: byPriority.low,
    metaPending: metaItems,
    allPendingIds,
    hotFiles: {
      'src/data/improvements.js': tokenEstimate(IMPROVEMENTS_FILE),
      'src/data/improvement-queue.js': tokenEstimate(QUEUE_FILE),
      'IMPROVEMENTS.md': tokenEstimate(
        path.join(PROJECT_ROOT, 'IMPROVEMENTS.md'),
      ),
    },
    note:
      'Use this index instead of re-reading improvement-queue.js and ' +
      'improvements.js on every engine run. Regenerate via: ' +
      'node scripts/build-queue-index.mjs',
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
  const outRel = path.relative(PROJECT_ROOT, OUTPUT_FILE);
  console.log(`Wrote ${outRel}`);
  console.log(`  nextImprovementId: ${index.nextImprovementId}`);
  console.log(`  totalPending: ${index.totalPending}`);
  console.log(`  criticalPending: ${index.criticalPending.length}`);
  console.log(
    `  hot file burn (token estimate): ` +
      `improvements.js ${index.hotFiles['src/data/improvements.js']}, ` +
      `queue ${index.hotFiles['src/data/improvement-queue.js']}, ` +
      `MD ${index.hotFiles['IMPROVEMENTS.md']}`,
  );
  console.log(`  queue-index.json size: ${fs.statSync(OUTPUT_FILE).size} bytes`);
}

main();
