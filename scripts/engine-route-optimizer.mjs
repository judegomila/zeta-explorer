#!/usr/bin/env node
// Engine route optimizer — capability-match routing for pending tickets.
//
// Today routing is driven by (a) explicit ticket.model + channel pins and
// (b) round-robin channel-quota.json. Misses capability matching: critical
// proof work sometimes sits in a Haiku bucket, and Opus 4.7 sometimes picks
// up content/docs because its own bucket is shallow.
//
// This optimizer scores each pending ticket WITHOUT explicit model/channel
// pins against every engine cell on three axes:
//   1. priority match  — heavy models earn bonuses on heavy priorities
//   2. category match  — opus prefers proof/feature/content, sonnet prefers
//                        refits/sweep/literature, haiku prefers docs/bug/ux
//   3. dependency depth — deeper dependency chains earn opus
//
// It emits recommendations (id, recommended model + channel, score,
// rationale) to stdout and to scripts/.engine-routing-recommendations.json.
// With --apply, the recommendation is written into improvement-queue.js by
// adding model + channel fields (idempotent — tickets already tagged are
// skipped).
//
// HONEST SCOPE: this only produces RECOMMENDATIONS / writes pins. The
// engine scripts (scripts/auto-improve*.sh) still control actual ticket
// picking — they read scripts/queue-index.json byModel buckets, which is
// regenerated from improvement-queue.js, so pinning here flows through.
//
// Usage:
//   node scripts/engine-route-optimizer.mjs              # --report (default)
//   node scripts/engine-route-optimizer.mjs --report     # print only
//   node scripts/engine-route-optimizer.mjs --apply      # mutate queue file
//
// imp-1169 (META) — sonnet-4-6 worktree subagent.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const QUEUE_PATH = path.join(REPO_ROOT, 'src/data/improvement-queue.js');
const OUT_PATH = path.join(__dirname, '.engine-routing-recommendations.json');

// Engine cells. channel is the auto-improve*.sh channel the bucket maps to.
const ENGINE_CELLS = [
  { model: 'opus-4-7', channel: 'subscription' },
  { model: 'opus-4-7', channel: 'api' },
  { model: 'sonnet-4-6', channel: 'sonnet' },
  { model: 'haiku-4-5', channel: 'haiku' },
];

// ── Scoring weights ───────────────────────────────────────────────────────
//
// priorityScore[model][priority] — per the ticket spec:
//   opus-4-7  : critical=3, high=2, medium=1, low=0
//   sonnet-4-6: critical=2, high=2, medium=2, low=1
//   haiku-4-5 : critical=1, high=1, medium=2, low=3
const PRIORITY_SCORE = {
  'opus-4-7': { critical: 3, high: 2, medium: 1, low: 0 },
  'sonnet-4-6': { critical: 2, high: 2, medium: 2, low: 1 },
  'haiku-4-5': { critical: 1, high: 1, medium: 2, low: 3 },
};

// categoryScore[model][category]
//   opus prefers: proof, feature, content
//   sonnet prefers: refits, sweep, literature, feature (medium)
//   haiku prefers: docs, bug, ux, accuracy, visual, performance, content (small)
const CATEGORY_SCORE = {
  'opus-4-7': {
    proof: 3,
    'proof-gap': 3,
    verification: 2,
    feature: 2,
    content: 2,
    meta: 1,
    docs: 0,
    bug: 0,
    ux: 0,
    accuracy: 0,
    visual: 0,
    performance: 0,
  },
  'sonnet-4-6': {
    proof: 1,
    'proof-gap': 1,
    verification: 2,
    refits: 3,
    sweep: 3,
    literature: 3,
    feature: 2,
    content: 2,
    meta: 2,
    docs: 1,
    bug: 1,
    ux: 1,
    accuracy: 1,
    visual: 1,
    performance: 1,
  },
  'haiku-4-5': {
    proof: 0,
    'proof-gap': 0,
    verification: 1,
    docs: 3,
    bug: 3,
    ux: 3,
    accuracy: 3,
    visual: 3,
    performance: 3,
    content: 2,
    meta: 1,
    feature: 0,
  },
};

// depthScore[model](depth) — deeper dependency chains favor opus
function depthScore(model, depth) {
  if (model === 'opus-4-7') return Math.min(2, depth); // +0..+2
  if (model === 'sonnet-4-6') return depth <= 1 ? 1 : 0;
  if (model === 'haiku-4-5') return depth === 0 ? 1 : 0;
  return 0;
}

// ── Source-of-truth parsers ───────────────────────────────────────────────

function findObjectBlocks(text) {
  const blocks = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    if (text[i] === '{') {
      const start = i;
      let depth = 1;
      i++;
      while (i < n && depth > 0) {
        const ch = text[i];
        if (ch === "'" && text[i - 1] !== '\\') {
          i++;
          while (i < n && !(text[i] === "'" && text[i - 1] !== '\\')) i++;
          i++;
          continue;
        }
        if (ch === '"' && text[i - 1] !== '\\') {
          i++;
          while (i < n && !(text[i] === '"' && text[i - 1] !== '\\')) i++;
          i++;
          continue;
        }
        if (ch === '`') {
          i++;
          while (i < n && text[i] !== '`') {
            if (text[i] === '\\') i++;
            i++;
          }
          i++;
          continue;
        }
        if (ch === '/' && text[i + 1] === '/') {
          while (i < n && text[i] !== '\n') i++;
          continue;
        }
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
      blocks.push({ start, end: i });
    } else {
      i++;
    }
  }
  return blocks;
}

function extractField(chunk, key) {
  const re = new RegExp(`${key}:\\s*'([^']*)'`);
  const m = chunk.match(re);
  return m ? m[1] : null;
}

function extractDeps(chunk) {
  const m = chunk.match(/dependsOn:\s*\[([^\]]*)\]/);
  if (!m) return [];
  return m[1]
    .split(',')
    .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

function hasField(chunk, key) {
  return new RegExp(`\\b${key}:\\s*['"]`).test(chunk);
}

// ── Scoring ───────────────────────────────────────────────────────────────

function depDepth(deps, idIndex, seen = new Set()) {
  // Recursive depth across unresolved deps. Cycles guarded by `seen`.
  let max = 0;
  for (const depId of deps) {
    if (seen.has(depId)) continue;
    const dep = idIndex.get(depId);
    if (!dep || dep.status === 'completed') continue;
    const next = new Set(seen);
    next.add(depId);
    const sub = 1 + depDepth(dep.deps || [], idIndex, next);
    if (sub > max) max = sub;
  }
  return max;
}

function scoreCell(ticket, cell, idIndex) {
  const { model } = cell;
  const priority = ticket.priority || 'medium';
  const category = ticket.category || 'unknown';
  const deps = ticket.deps || [];
  const depth = depDepth(deps, idIndex);

  const pScore = (PRIORITY_SCORE[model] || {})[priority] ?? 0;
  const cScore = (CATEGORY_SCORE[model] || {})[category] ?? 0;
  const dScore = depthScore(model, depth);

  const total = pScore + cScore + dScore;
  return {
    model,
    channel: cell.channel,
    priorityScore: pScore,
    categoryScore: cScore,
    depthScore: dScore,
    depDepth: depth,
    total,
  };
}

function pickBestCell(ticket, idIndex) {
  let best = null;
  const all = [];
  for (const cell of ENGINE_CELLS) {
    const s = scoreCell(ticket, cell, idIndex);
    all.push(s);
    if (!best || s.total > best.total) best = s;
  }
  // Tie-breaker: when two cells tie, prefer cheaper model (haiku < sonnet <
  // opus). Avoids wasting opus quota on tickets where sonnet/haiku is equally
  // good.
  const rank = { 'haiku-4-5': 0, 'sonnet-4-6': 1, 'opus-4-7': 2 };
  // Among tied entries with best.total, pick the lowest-rank.
  const tied = all.filter((s) => s.total === best.total);
  tied.sort((a, b) => rank[a.model] - rank[b.model]);
  best = tied[0];

  // Build a rationale string.
  const rationale =
    `priority=${ticket.priority || 'medium'}(+${best.priorityScore}) ` +
    `category=${ticket.category || 'unknown'}(+${best.categoryScore}) ` +
    `depDepth=${best.depDepth}(+${best.depthScore})`;
  return { ...best, rationale, allCells: all };
}

// ── Main ──────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const report = !apply; // --report is default

  if (!fs.existsSync(QUEUE_PATH)) {
    console.error(`engine-route-optimizer: queue file missing at ${QUEUE_PATH}`);
    process.exit(2);
  }

  const text = fs.readFileSync(QUEUE_PATH, 'utf8');
  const blocks = findObjectBlocks(text);

  // First pass: build idIndex of every ticket (id -> { status, deps }) so we
  // can compute dependency depth.
  const idIndex = new Map();
  for (const b of blocks) {
    const chunk = text.slice(b.start, b.end);
    if (!chunk.includes("id: 'imp-")) continue;
    const id = extractField(chunk, 'id');
    if (!id) continue;
    idIndex.set(id, {
      status: extractField(chunk, 'status'),
      deps: extractDeps(chunk),
    });
  }

  // Second pass: rank pending tickets WITHOUT model + channel pins.
  const recommendations = [];
  for (const b of blocks) {
    const chunk = text.slice(b.start, b.end);
    if (!chunk.includes("id: 'imp-")) continue;
    if (!chunk.includes("status: 'pending'")) continue;

    const id = extractField(chunk, 'id');
    const hasModel = hasField(chunk, 'model');
    const hasChannel = hasField(chunk, 'channel');
    if (hasModel && hasChannel) continue; // already pinned — skip

    const ticket = {
      id,
      title: extractField(chunk, 'title'),
      priority: extractField(chunk, 'priority'),
      category: extractField(chunk, 'category'),
      complexity: extractField(chunk, 'estimatedComplexity'),
      deps: extractDeps(chunk),
      blockStart: b.start,
      blockEnd: b.end,
      currentModel: extractField(chunk, 'model'),
      currentChannel: extractField(chunk, 'channel'),
    };

    const best = pickBestCell(ticket, idIndex);
    recommendations.push({
      id: ticket.id,
      title: ticket.title,
      priority: ticket.priority,
      category: ticket.category,
      complexity: ticket.complexity,
      depCount: ticket.deps.length,
      currentModel: ticket.currentModel,
      currentChannel: ticket.currentChannel,
      recommendedModel: best.model,
      recommendedChannel: best.channel,
      score: best.total,
      priorityScore: best.priorityScore,
      categoryScore: best.categoryScore,
      depthScore: best.depthScore,
      depDepth: best.depDepth,
      rationale: best.rationale,
      blockStart: ticket.blockStart,
      blockEnd: ticket.blockEnd,
    });
  }

  // Sort by score descending so top recommendations surface first.
  recommendations.sort((a, b) => b.score - a.score);

  // Stats
  const byModelCount = {};
  for (const r of recommendations) {
    byModelCount[r.recommendedModel] = (byModelCount[r.recommendedModel] || 0) + 1;
  }

  // ── Report mode ────────────────────────────────────────────────────────
  const lines = [];
  lines.push(`ENGINE ROUTING RECOMMENDATIONS (${recommendations.length} unpinned pending)`);
  lines.push(`  scoring: priorityScore[model][prio] + categoryScore[model][cat] + depthScore[model](depth)`);
  lines.push('');
  if (recommendations.length === 0) {
    lines.push('  (no unpinned pending tickets — every pending ticket already has model+channel)');
  } else {
    for (const r of recommendations) {
      const cur = r.currentModel || r.currentChannel ? ` cur=${r.currentModel || '-'}/${r.currentChannel || '-'}` : '';
      lines.push(
        `  [score=${String(r.score).padStart(2)}] ${r.id} → ${r.recommendedModel}/${r.recommendedChannel}${cur}`,
      );
      lines.push(`    title: ${(r.title || '').slice(0, 100)}`);
      lines.push(`    rationale: ${r.rationale}`);
    }
  }
  lines.push('');
  lines.push('Per-model bucket totals (recommended):');
  for (const [m, n] of Object.entries(byModelCount).sort()) {
    lines.push(`  ${m}: ${n}`);
  }
  process.stdout.write(lines.join('\n') + '\n');

  // ── Apply mode ─────────────────────────────────────────────────────────
  let touched = 0;
  if (apply && recommendations.length > 0) {
    // Walk recs sorted by blockStart DESCENDING so earlier offsets stay valid.
    const sortedForEdit = [...recommendations].sort((a, b) => b.blockStart - a.blockStart);
    let updated = text;
    for (const r of sortedForEdit) {
      const chunk = updated.slice(r.blockStart, r.blockEnd);
      // Find an insertion anchor: prefer the estimatedComplexity line so the
      // model + channel pins sit beside the other routing fields. Fall back
      // to status: 'pending'.
      let anchorRe = /^(\s*)estimatedComplexity:\s*'[^']+',\s*$/m;
      let m = chunk.match(anchorRe);
      if (!m) {
        anchorRe = /^(\s*)status:\s*'pending',\s*$/m;
        m = chunk.match(anchorRe);
      }
      if (!m) continue;
      const indent = m[1];
      // Build insertion. If the chunk already has one half (e.g. only model),
      // only insert the missing piece. Idempotent.
      const hasM = hasField(chunk, 'model');
      const hasC = hasField(chunk, 'channel');
      let insertion = '';
      if (!hasM) insertion += `${indent}model: '${r.recommendedModel}',\n`;
      if (!hasC) insertion += `${indent}channel: '${r.recommendedChannel}',\n`;
      if (!insertion) continue;
      const replacement = m[0] + '\n' + insertion;
      const newChunk = chunk.replace(m[0] + '\n', replacement);
      if (newChunk === chunk) continue;
      updated = updated.slice(0, r.blockStart) + newChunk + updated.slice(r.blockEnd);
      // Offsets after this point stay valid because we are walking
      // descending — earlier blocks unchanged.
      touched++;
    }
    if (touched > 0) {
      fs.writeFileSync(QUEUE_PATH, updated);
      process.stdout.write(`\nAPPLIED: wrote ${touched} model+channel pin(s) into ${QUEUE_PATH}\n`);
    } else {
      process.stdout.write(`\nAPPLY: no mutations made (every recommendation already pinned or anchor missing)\n`);
    }
  } else if (report) {
    process.stdout.write(`\nREPORT MODE — no mutations made. Use --apply to write pins.\n`);
  }

  // ── JSON state ─────────────────────────────────────────────────────────
  const state = {
    generatedAt: new Date().toISOString(),
    mode: apply ? 'apply' : 'report',
    totalUnpinned: recommendations.length,
    appliedCount: apply ? touched : 0,
    byModelCount,
    weights: {
      priorityScore: PRIORITY_SCORE,
      categoryScore: CATEGORY_SCORE,
      depthRule:
        'opus-4-7: min(2,depth); sonnet-4-6: depth<=1 → 1 else 0; haiku-4-5: depth===0 → 1 else 0',
    },
    recommendations: recommendations.map((r) => ({
      id: r.id,
      title: r.title,
      priority: r.priority,
      category: r.category,
      complexity: r.complexity,
      depCount: r.depCount,
      depDepth: r.depDepth,
      currentModel: r.currentModel,
      currentChannel: r.currentChannel,
      recommendedModel: r.recommendedModel,
      recommendedChannel: r.recommendedChannel,
      score: r.score,
      priorityScore: r.priorityScore,
      categoryScore: r.categoryScore,
      depthScore: r.depthScore,
      rationale: r.rationale,
    })),
  };
  fs.writeFileSync(OUT_PATH, JSON.stringify(state, null, 2) + '\n');
  process.stdout.write(`Wrote ${OUT_PATH} (${fs.statSync(OUT_PATH).size} bytes)\n`);
}

try {
  main();
} catch (err) {
  console.error('engine-route-optimizer error:', err);
  process.exit(1);
}
