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

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const QUEUE_FILE = path.join(PROJECT_ROOT, 'src/data/improvement-queue.js');
const IMPROVEMENTS_FILE = path.join(PROJECT_ROOT, 'src/data/improvements.js');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'scripts/queue-index.json');

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function fail(code, msg) {
  console.error(`build-queue-index: ${msg}`);
  process.exit(code);
}

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
        const ch = text[i];
        // Skip over single-quoted strings (which may contain { or })
        if (ch === "'" && text[i - 1] !== '\\') {
          i++;
          while (i < n && !(text[i] === "'" && text[i - 1] !== '\\')) i++;
          i++; // skip closing quote
          continue;
        }
        // Skip over double-quoted strings
        if (ch === '"' && text[i - 1] !== '\\') {
          i++;
          while (i < n && !(text[i] === '"' && text[i - 1] !== '\\')) i++;
          i++;
          continue;
        }
        // Skip over template literals
        if (ch === '`') {
          i++;
          while (i < n && text[i] !== '`') {
            if (text[i] === '\\') i++; // skip escaped chars
            i++;
          }
          i++;
          continue;
        }
        // Skip line comments
        if (ch === '/' && text[i + 1] === '/') {
          while (i < n && text[i] !== '\n') i++;
          continue;
        }
        // Skip block comments
        if (ch === '/' && text[i + 1] === '*') {
          i += 2;
          while (i < n - 1 && !(text[i] === '*' && text[i + 1] === '/')) i++;
          i += 2;
          continue;
        }
        if (ch === '{') depth++;
        else if (ch === '}') depth--;
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

// --verify: assert that scripts/queue-index.json is fresh relative to
// src/data/improvement-queue.js. Exits 0 on fresh, 1 on stale, 2 on
// environment errors (file missing, JSON corrupt). Use this as a build-time
// gate so a stale cache never silently leaks tickets that the engine should
// have already worked on.
function verify() {
  if (!fs.existsSync(QUEUE_FILE)) {
    fail(2, `improvement-queue.js missing at ${QUEUE_FILE}`);
  }
  if (!fs.existsSync(OUTPUT_FILE)) {
    fail(1, `queue-index.json missing at ${OUTPUT_FILE}; run: node scripts/build-queue-index.mjs`);
  }
  const indexMtime = fs.statSync(OUTPUT_FILE).mtimeMs;
  const queueMtime = fs.statSync(QUEUE_FILE).mtimeMs;
  const improvMtime = fs.statSync(IMPROVEMENTS_FILE).mtimeMs;
  if (indexMtime < queueMtime) {
    fail(
      1,
      `queue-index.json (mtime ${new Date(indexMtime).toISOString()}) is OLDER than improvement-queue.js (mtime ${new Date(queueMtime).toISOString()}); regenerate via: node scripts/build-queue-index.mjs`,
    );
  }
  if (indexMtime < improvMtime) {
    fail(
      1,
      `queue-index.json (mtime ${new Date(indexMtime).toISOString()}) is OLDER than improvements.js (mtime ${new Date(improvMtime).toISOString()}); nextImprovementId may be stale; regenerate via: node scripts/build-queue-index.mjs`,
    );
  }
  let index;
  try {
    index = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
  } catch (e) {
    fail(2, `queue-index.json is not valid JSON: ${e.message}`);
  }
  if (!index.sourceQueueSha256) {
    fail(
      1,
      'queue-index.json predates the sourceQueueSha256 hash field; regenerate via: node scripts/build-queue-index.mjs',
    );
  }
  const queueText = fs.readFileSync(QUEUE_FILE, 'utf8');
  const currentHash = sha256(queueText);
  if (index.sourceQueueSha256 !== currentHash) {
    fail(
      1,
      `sourceQueueSha256 mismatch: index has ${index.sourceQueueSha256.slice(0, 12)}..., source is ${currentHash.slice(0, 12)}...; regenerate via: node scripts/build-queue-index.mjs`,
    );
  }
  // Also verify improvements.js hash so nextImprovementId staleness is detectable
  if (index.sourceImprovementsSha256) {
    const improvText = fs.readFileSync(IMPROVEMENTS_FILE, 'utf8');
    const currentImprovHash = sha256(improvText);
    if (index.sourceImprovementsSha256 !== currentImprovHash) {
      fail(
        1,
        `sourceImprovementsSha256 mismatch: index has ${index.sourceImprovementsSha256.slice(0, 12)}..., source is ${currentImprovHash.slice(0, 12)}...; nextImprovementId is stale; regenerate via: node scripts/build-queue-index.mjs`,
      );
    }
  }
  console.log(
    `queue-index.json is fresh (mtime ${new Date(indexMtime).toISOString()}, sha256 ${currentHash.slice(0, 12)}...).`,
  );
  process.exit(0);
}

function main() {
  if (process.argv.includes('--verify')) return verify();

  // Edge case: queue file missing. Refuse to overwrite the index with empty
  // data — that would silently hide every pending ticket from the engine.
  if (!fs.existsSync(QUEUE_FILE)) {
    fail(2, `improvement-queue.js missing at ${QUEUE_FILE}; refusing to write a stale index`);
  }
  if (!fs.existsSync(IMPROVEMENTS_FILE)) {
    fail(2, `improvements.js missing at ${IMPROVEMENTS_FILE}; refusing to write a stale index`);
  }

  // Staleness check: if queue-index.json is newer than BOTH source files,
  // the cache is still valid — skip the expensive rebuild.
  // Note: nextImprovementId derives from improvements.js, not queue.js, so
  // both files must be checked to avoid a stale id after appending an improvement.
  try {
    const indexMtime = fs.statSync(OUTPUT_FILE).mtimeMs;
    const queueMtime = fs.statSync(QUEUE_FILE).mtimeMs;
    const improvMtime = fs.statSync(IMPROVEMENTS_FILE).mtimeMs;
    if (indexMtime > queueMtime && indexMtime > improvMtime) {
      console.log('queue-index.json is up to date (both source files unchanged) — skipping rebuild.');
      return;
    }
  } catch {
    // OUTPUT_FILE does not exist yet — proceed with full build.
  }

  const queueText = fs.readFileSync(QUEUE_FILE, 'utf8');
  const improvementsText = fs.readFileSync(IMPROVEMENTS_FILE, 'utf8');

  const items = parseQueue(queueText);

  // Edge case: parse produced zero items despite a non-trivial source file.
  // That is a parser failure (e.g. an unterminated quote upstream broke the
  // balanced-brace walker), not a legitimately empty queue. Refuse to write
  // an empty index in that case — the engine would conclude there is nothing
  // to do and exit.
  if (items.length === 0 && queueText.length > 1000) {
    fail(
      2,
      `parseQueue produced 0 items from a ${queueText.length}-char source; likely a parse failure (unterminated quote / comment?). Refusing to overwrite the index.`,
    );
  }

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

  const byModel = {
    'haiku-4-5': [],
    'sonnet-4-6': [],
    'opus-4-6': [],
    'opus-4-7': [],
    'opus-4-8': [],
    untagged: [],
  };
  const byChannel = { local: [], subscription: [], api: [], untagged: [] };

  let totalInProgressSubagent = 0;
  for (const chunk of items) {
    const status = field(chunk, 'status');
    if (status === 'completed') {
      totalCompleted++;
      continue;
    }
    // imp-1285: tickets locked by a dispatched subagent must NOT appear in
    // any pending bucket — engines read these buckets and would otherwise
    // race the subagent. We count them so the operator can see how many
    // are in-flight at any given moment, but we don't surface their ids.
    if (status === 'in-progress-subagent') {
      totalInProgressSubagent++;
      continue;
    }
    if (status !== 'pending') continue;
    totalPending++;

    const id = field(chunk, 'id');
    const title = field(chunk, 'title');
    const priority = field(chunk, 'priority') || 'medium';
    const category = field(chunk, 'category');
    const complexity = field(chunk, 'estimatedComplexity');
    const model = field(chunk, 'model');
    const channel = field(chunk, 'channel');
    const deps = dependsOnField(chunk);

    const row = {
      id,
      title,
      priority,
      category,
      complexity,
      model,
      channel,
      dependsOn: deps,
    };
    allPendingIds.push(id);

    if (byPriority[priority]) byPriority[priority].push(row);
    if (category === 'meta') metaItems.push(row);

    if (model && byModel[model]) byModel[model].push(row);
    else byModel.untagged.push(row);

    if (channel && byChannel[channel]) byChannel[channel].push(row);
    else byChannel.untagged.push(row);
  }

  // Annotate each row with blocked=true when any dependsOn id is still pending.
  // Engines must skip blocked tickets — their prerequisites haven't shipped yet.
  const allPendingSet = new Set(allPendingIds);
  for (const arr of Object.values(byPriority)) {
    for (const row of arr) {
      row.blocked = row.dependsOn.some((dep) => allPendingSet.has(dep));
    }
  }

  // imp-2403: surface tickets stranded in an "untagged" bucket — their model
  // or channel string is not one any per-tier engine reads, so the ticket can
  // starve even though work exists. byModel.untagged is the dangerous case:
  // model-keyed engines never read it. A non-null channel value that is not a
  // recognized bucket key is flagged too, since channel-keyed pickers miss it.
  const stranded = {
    knownModels: Object.keys(byModel).filter((k) => k !== 'untagged'),
    knownChannels: Object.keys(byChannel).filter((k) => k !== 'untagged'),
    byModel: byModel.untagged.map((r) => r.id),
    byChannel: byChannel.untagged
      .filter((r) => r.channel && !Object.prototype.hasOwnProperty.call(byChannel, r.channel))
      .map((r) => ({ id: r.id, channel: r.channel })),
  };

  const { total: improvementsTotal, maxId } = parseImprovementsStats(
    improvementsText,
  );

  const index = {
    generatedAt: new Date().toISOString(),
    sourceQueueSha256: sha256(queueText),
    sourceImprovementsSha256: sha256(improvementsText),
    nextImprovementId: maxId + 1,
    improvementsTotal,
    totalPending,
    totalCompleted,
    totalInProgressSubagent,
    criticalPending: byPriority.critical,
    highPending: byPriority.high,
    mediumPending: byPriority.medium,
    lowPending: byPriority.low,
    metaPending: metaItems,
    byModel,
    byChannel,
    stranded,
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
      'node scripts/build-queue-index.mjs. The byModel / byChannel buckets ' +
      'let per-tier engines pick only their eligible tickets.',
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
  if (index.stranded.byModel.length || index.stranded.byChannel.length) {
    console.warn(
      `  WARNING stranded tickets (no per-tier engine reads them): ` +
        `byModel=${JSON.stringify(index.stranded.byModel)} ` +
        `byChannel=${JSON.stringify(index.stranded.byChannel)}`,
    );
  }
}

main();
