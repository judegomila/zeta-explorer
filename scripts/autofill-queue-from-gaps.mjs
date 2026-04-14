#!/usr/bin/env node
/**
 * autofill-queue-from-gaps.mjs
 *
 * Scans the codebase for open work (TODO, sorry, partial, sub-gaps, review
 * findings, stale cross-references, dashboard errors) and seeds 10 new
 * improvement-queue tickets when the Opus-eligible queue is empty.
 *
 * Usage:  node scripts/autofill-queue-from-gaps.mjs [--dry-run]
 *
 * Called by auto-improve.sh when idle detection fires (0 eligible tickets
 * for IDLE_THRESHOLD consecutive runs). Can also be run manually.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
const ROOT = process.cwd();
const QUEUE_PATH = join(ROOT, 'src/data/improvement-queue.js');
const CATEGORIES = ['proof', 'meta', 'feature', 'content']; // Opus-eligible only

// ── Helpers ────────────────────────────────────────────────────────────────

function getMaxId() {
  const src = readFileSync(QUEUE_PATH, 'utf-8');
  const ids = [...src.matchAll(/id: 'imp-(\d+)'/g)].map(m => +m[1]);
  return Math.max(...ids);
}

function getPendingCount() {
  const src = readFileSync(QUEUE_PATH, 'utf-8');
  // Count Opus-eligible pending
  const items = [];
  let i = 0;
  while (i < src.length) {
    if (src[i] === '{') {
      let d = 1, st = i; i++;
      while (i < src.length && d > 0) { if (src[i]==='{') d++; if (src[i]==='}') d--; i++; }
      const it = src.slice(st, i);
      if (it.includes("id: 'imp-")) items.push(it);
    } else i++;
  }
  const eligible = items.filter(it => {
    const status = (it.match(/status: '([^']+)'/)||[])[1];
    const cat = (it.match(/category: '([^']+)'/)||[])[1];
    return status === 'pending' && CATEGORIES.includes(cat);
  });
  return eligible.length;
}

function grepFiles(pattern, globPath) {
  try {
    const out = execSync(
      `grep -rnl "${pattern}" ${globPath} 2>/dev/null || true`,
      { encoding: 'utf-8', maxBuffer: 1024*1024 }
    ).trim();
    return out ? out.split('\n') : [];
  } catch { return []; }
}

function grepContent(pattern, globPath, maxLines = 20) {
  try {
    const out = execSync(
      `grep -rn "${pattern}" ${globPath} 2>/dev/null | head -${maxLines} || true`,
      { encoding: 'utf-8', maxBuffer: 1024*1024 }
    ).trim();
    return out ? out.split('\n') : [];
  } catch { return []; }
}

// ── Gap scanners ───────────────────────────────────────────────────────────

function scanLeanSorrys() {
  const hits = grepContent('sorry', 'lean/LambdaAttack/*.lean');
  // Filter out comments, strings, and doc-references to sorry
  const real = hits.filter(h =>
    !h.includes('--') && !h.includes('Status:') &&
    !h.includes('sorry-') && !h.includes('(sorry') &&
    !h.includes('doc-comment') && !h.includes('CLOSED')
  );
  return real.map(h => {
    const [file, ...rest] = h.split(':');
    const line = rest[0];
    return {
      category: 'proof',
      priority: 'high',
      title: `Lean: close sorry at ${file.replace('lean/LambdaAttack/','')}:${line}`,
      description: `Found sorry at ${file}:${line}. Close with a real Lean 4 proof using Mathlib tactics (norm_num, ring, omega, simp, etc). Read the surrounding context to understand what needs to be proved.`,
      proofSection: 'S11-lean',
      complexity: 'medium',
    };
  });
}

function scanTodos() {
  const hits = grepContent('TODO\\|FIXME\\|HACK\\|XXX', 'src/**/*.js src/**/*.jsx scripts/*.mjs');
  // Exclude improvement-queue.js and improvements.js entirely — they contain
  // ticket descriptions that reference TODO/FIXME as subject matter, not as
  // live markers. This was the root cause of the false-positive cascade
  // (imp-516 → imp-529 → imp-614 → imp-615 → ... 6th generation).
  const filtered = hits.filter(h =>
    !h.includes('improvement-queue.js') &&
    !h.includes('improvements.js') &&
    !h.includes('IMPROVEMENTS.md') &&
    !h.includes('auto-seeder') &&
    !h.includes('false-positive') &&
    !h.includes('autofill-queue')
  );
  return filtered.slice(0, 5).map(h => {
    const [file, ...rest] = h.split(':');
    const line = rest[0];
    const text = rest.slice(1).join(':').trim().slice(0, 120);
    return {
      category: 'meta',
      priority: 'medium',
      title: `Fix ${file.split('/').pop()}:${line} — ${text.slice(0,60)}`,
      description: `Found TODO/FIXME at ${file}:${line}: "${text}". Investigate and resolve or remove the marker if already done.`,
      proofSection: 'meta',
      complexity: 'small',
    };
  });
}

function scanPartialStatuses() {
  const hits = grepContent("status: 'partial'\\|status: 'conditional'", 'src/data/*.js src/math/*.js');
  // Exclude files where partial status has been confirmed as correctly blocked
  // (barrier-extrapolation, dyson-ladder-measured — both confirmed 5+ times)
  // (dyson-ladder-N10k — confirmed cannot-upgrade by imp-649/imp-663; blocked on imp-360-compute-N1e5)
  // (g1-g2-closure — G2 tau-positive confirmed cannot-upgrade by imp-651/imp-665; blocked on G1-sub-extremal + imp-336 drift-sign)
  const filtered = hits.filter(h =>
    !h.includes('barrier-extrapolation') &&
    !h.includes('dyson-ladder-measured') &&
    !h.includes('dyson-ladder-N10k') &&
    !h.includes('g1-g2-closure') &&
    !h.includes('improvement-queue')
  );
  return filtered.slice(0, 4).map(h => {
    const [file, ...rest] = h.split(':');
    const line = rest[0];
    const text = rest.slice(1).join(':').trim().slice(0, 120);
    return {
      category: 'proof',
      priority: 'medium',
      title: `Upgrade partial/conditional status in ${file.split('/').pop()}:${line}`,
      description: `Found "${text}" at ${file}:${line}. Investigate whether the partial closure can be upgraded to full based on recent proof chain closures (imp-462/463/464/471). If the upgrade is blocked, document why.`,
      proofSection: 'S10',
      complexity: 'medium',
    };
  });
}

function scanOpenSubGaps() {
  const hits = grepContent("'open'\\|OPEN\\|blocker", 'src/data/*.js src/math/*.js');
  const relevant = hits.filter(h =>
    (h.includes('sub-gap') || h.includes('skp-') || h.includes('blocker')) &&
    !h.includes('CLOSED') && !h.includes('closed') && !h.includes('completed') &&
    !h.includes('closesGap') && !h.includes('blocker: false') &&
    !h.includes('blocker: true') && // documented blockers are intentional
    !h.includes('upgradeBlockerNote') &&
    !h.includes('improvement-queue') &&
    !h.includes('barrier-extrapolation') &&
    !h.includes('dyson-ladder-measured')
  );
  return relevant.slice(0, 4).map(h => {
    const [file, ...rest] = h.split(':');
    const line = rest[0];
    const text = rest.slice(1).join(':').trim().slice(0, 120);
    return {
      category: 'proof',
      priority: 'high',
      title: `Close open sub-gap in ${file.split('/').pop()}:${line}`,
      description: `Found open sub-gap/blocker: "${text}" at ${file}:${line}. Attempt closure using available proof chain results. If blocked, document the blocking condition as a named sub-gap.`,
      proofSection: 'S10',
      complexity: 'medium',
    };
  });
}

function scanDashboardBugs() {
  // Check for known broken metric functions
  const dashboard = readFileSync(join(ROOT, 'src/pages/DashboardPage.jsx'), 'utf-8');
  const gaps = [];
  if (dashboard.includes('result.tests') && !dashboard.includes('result.results')) {
    gaps.push({
      category: 'bug',  // Will be filtered — but we reclassify as 'feature' for Opus
      category: 'feature',
      priority: 'high',
      title: 'Fix computeWeilPositivity in DashboardPage.jsx — wrong field names',
      description: 'computeWeilPositivity reads result.tests and .sum but weilPositivityTest returns { results: [...], gap }. Fix field mapping.',
      proofSection: 'dashboard',
      complexity: 'small',
    });
  }
  return gaps;
}

function scanStaleAssertions() {
  // Look for assertion files that might be outdated
  const assertFiles = grepFiles('ASSERTION\\|assert', 'src/data/*-2026-*.js');
  return assertFiles.slice(0, 2).map(file => ({
    category: 'proof',
    priority: 'low',
    title: `Verify assertions still pass in ${file.split('/').pop()}`,
    description: `Dated assertion file ${file} may be stale. Re-run npm run build and verify all exported assertions pass. Update any stale counts or references.`,
    proofSection: 'S11-verify',
    complexity: 'small',
  }));
}

function scanHarnessImprovements() {
  const gaps = [];
  // Check if idle detection threshold is working
  const engine = readFileSync(join(ROOT, 'scripts/auto-improve.sh'), 'utf-8');
  if (!engine.includes('autofill-queue-from-gaps')) {
    gaps.push({
      category: 'meta',
      priority: 'high',
      title: 'Wire autofill-queue-from-gaps.mjs into auto-improve.sh idle detection',
      description: 'When the engine exhausts the Opus queue, it should auto-run scripts/autofill-queue-from-gaps.mjs to scan for new work rather than idle-cycling. Add a call after the IDLE_THRESHOLD check in auto-improve.sh.',
      proofSection: 'meta',
      complexity: 'small',
    });
  }
  return gaps;
}

// ── Main ───────────────────────────────────────────────────────────────────

function main() {
  const pendingCount = getPendingCount();
  if (pendingCount > 0 && !DRY_RUN) {
    console.log(`Queue has ${pendingCount} Opus-eligible pending tickets. No autofill needed.`);
    process.exit(0);
  }

  console.log('Scanning codebase for new work...');

  // Collect candidates from all scanners
  const candidates = [
    ...scanOpenSubGaps(),
    ...scanLeanSorrys(),
    ...scanDashboardBugs(),
    ...scanHarnessImprovements(),
    ...scanPartialStatuses(),
    ...scanTodos(),
    ...scanStaleAssertions(),
  ];

  // Deduplicate by title similarity (first 40 chars)
  const seen = new Set();
  const unique = candidates.filter(c => {
    const key = c.title.slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Take top 10 by priority order
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  unique.sort((a, b) => (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3));
  const batch = unique.slice(0, 10);

  if (batch.length === 0) {
    console.log('No new work found. Codebase is clean.');
    process.exit(0);
  }

  console.log(`Found ${batch.length} new tickets to seed:`);
  batch.forEach((t, i) => console.log(`  ${i+1}. [${t.priority}] ${t.title}`));

  if (DRY_RUN) {
    console.log('\n--dry-run: not writing to queue.');
    process.exit(0);
  }

  // Generate ticket entries
  let nextId = getMaxId() + 1;
  const entries = batch.map(t => {
    const id = nextId++;
    return `  {
    id: 'imp-${id}',
    title: ${JSON.stringify(t.title)},
    category: '${t.category}',
    priority: '${t.priority}',
    status: 'pending',
    proofSection: '${t.proofSection || "auto"}',
    description: ${JSON.stringify(t.description)},
    rationale: 'Auto-seeded by autofill-queue-from-gaps.mjs when the Opus queue was empty.',
    estimatedComplexity: '${t.complexity || "medium"}',
    completedAt: null,
  }`;
  });

  // Insert before the META section (imp-442 block) or at end
  const queueSrc = readFileSync(QUEUE_PATH, 'utf-8');
  const marker = "  {\n    id: 'imp-442',";
  const markerIdx = queueSrc.indexOf(marker);

  const comment = `\n  // ── Auto-seeded batch (${new Date().toISOString().slice(0,10)}) ──\n  // Scanned: Lean sorrys, TODO/FIXME, partial statuses, open sub-gaps,\n  // dashboard bugs, harness improvements, stale assertions.\n`;

  let updated;
  if (markerIdx > 0) {
    updated = queueSrc.slice(0, markerIdx) + comment + entries.join(',\n') + ',\n\n  ' + queueSrc.slice(markerIdx);
  } else {
    // Fallback: insert before closing ];
    const closeIdx = queueSrc.lastIndexOf('];');
    updated = queueSrc.slice(0, closeIdx) + comment + entries.join(',\n') + ',\n' + queueSrc.slice(closeIdx);
  }

  writeFileSync(QUEUE_PATH, updated);
  console.log(`\nSeeded ${batch.length} tickets (imp-${nextId - batch.length} through imp-${nextId - 1}).`);

  // Rebuild queue index
  try {
    execSync('node scripts/build-queue-index.mjs', { stdio: 'inherit' });
  } catch (e) {
    console.error('Warning: failed to rebuild queue-index.json:', e.message);
  }

  // Verify build
  try {
    execSync('npm run build', { stdio: 'pipe' });
    console.log('Build: PASS');
  } catch (e) {
    console.error('Build: FAIL — fix syntax errors in seeded tickets');
    process.exit(1);
  }
}

main();
