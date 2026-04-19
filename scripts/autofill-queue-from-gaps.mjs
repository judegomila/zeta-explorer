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
const HISTORY_PATH = join(ROOT, 'scripts/.autofill-history.json');
const CATEGORIES = ['proof', 'meta', 'feature', 'content']; // Opus-eligible only

// ── Repetition detection ──────────────────────────────────────────────────
// Track titles of recently-seeded tickets. If a candidate's title (first 50
// chars) matches a recently-seeded or recently-completed ticket, skip it.
// This breaks the infinite re-seed loop where the scanner finds the same
// gap, seeds a ticket, the engine closes it as "cannot-upgrade" or
// "already-investigated", and the scanner finds it again next cycle.

function loadHistory() {
  try {
    return JSON.parse(readFileSync(HISTORY_PATH, 'utf-8'));
  } catch {
    return { seededTitles: [], lastPurge: new Date().toISOString() };
  }
}

function saveHistory(history) {
  // Keep only last 200 entries to prevent unbounded growth
  if (history.seededTitles.length > 200) {
    history.seededTitles = history.seededTitles.slice(-200);
  }
  history.lastPurge = new Date().toISOString();
  writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2));
}

function titleKey(title) {
  return title.slice(0, 50).toLowerCase().replace(/[^a-z0-9]/g, '');
}

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
  // (esy-rigidity-port — ESY rigidity port cannot-upgrade confirmed by imp-650/imp-664/imp-669; blocked on O1/O2/O3 sub-gaps)
  // (heat-flow-cross-validation-imp372 — cannot-upgrade confirmed by imp-670; blocked on imp372-Ht-full/imp372-three-way/imp372-ode-norm)
  const filtered = hits.filter(h =>
    !h.includes('barrier-extrapolation') &&
    !h.includes('dyson-ladder-measured') &&
    !h.includes('dyson-ladder-N10k') &&
    !h.includes('g1-g2-closure') &&
    !h.includes('esy-rigidity-port') &&
    !h.includes('heat-flow-cross-validation-imp372') &&
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
    !h.includes('dyson-ladder-measured') &&
    !h.includes('open-permanent') && // formally closed as permanently open
    !h.includes('openPermanent') &&
    !h.includes('G1_SUB_EXTREMAL') && // confirmed open-permanent by imp-699
    !h.includes('G6_PER_N_BOUND') && // investigated and documented by imp-661..684
    !h.includes('reAuditedBy') && // already re-audited
    !h.includes('closureAttemptedBy') // closure already attempted
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
  // imp-814 + imp-841 showed this template produces unactionable tickets
  // when the target file DRIVES the sweep rather than exporting its own
  // *_ASSERTIONS. Guard: only seed a ticket if the file actually contains
  // a "_ASSERTIONS" export that would be re-runnable.
  const assertFiles = grepFiles('ASSERTION\\|assert', 'src/data/*-2026-*.js');
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  return assertFiles.filter(file => {
    try {
      const content = readFileSync(file, 'utf-8');
      // Must actually export an *_ASSERTIONS array to be verifiable.
      if (!/export\s+const\s+\w+_ASSERTIONS\s*=/.test(content)) return false;
      const m = content.match(/verifiedAt:\s*['"]([^'"]+)['"]/);
      if (m) {
        const verifiedAt = new Date(m[1]).getTime();
        if (now - verifiedAt < ONE_DAY) return false; // recently verified, skip
      }
      return true;
    } catch { return true; }
  }).slice(0, 2).map(file => ({
    category: 'proof',
    priority: 'low',
    title: `Verify assertions still pass in ${file.split('/').pop()}`,
    description: `Dated assertion file ${file} may be stale (not verified in 24h). Re-run npm run build and verify all exported assertions pass. Update any stale counts or references.`,
    proofSection: 'S11-verify',
    complexity: 'small',
  }));
}

// ── Forward-looking work generator ────────────────────────────────────────
// Unlike the gap scanners above (which find existing problems), this
// generator proposes NEW work that would improve the project even when
// the codebase has zero bugs. It rotates through categories so the engine
// always has something productive to do.

function generateForwardWork() {
  const ideas = [];
  const pages = readdirSync(join(ROOT, 'src/pages')).filter(f => f.endsWith('.jsx'));
  const dataFiles = readdirSync(join(ROOT, 'src/data')).filter(f => f.endsWith('.js'));
  const mathFiles = existsSync(join(ROOT, 'src/math'))
    ? readdirSync(join(ROOT, 'src/math')).filter(f => f.endsWith('.js'))
    : [];

  // Category 1: Page improvements — pick a random page and improve it
  const targetPage = pages[Math.floor(Math.random() * pages.length)];
  ideas.push({
    category: 'feature',
    priority: 'medium',
    title: `Improve ${targetPage}: add interactivity, better explanations, or new visualizations`,
    description: `Read src/pages/${targetPage} and make one meaningful improvement: add an interactive control, improve the mathematical explanations, add a new visualization, fix layout issues, or add educational annotations. Focus on making the page more useful for someone learning about the Riemann Hypothesis.`,
    proofSection: 'app',
    complexity: 'medium',
  });

  // Category 2: Cross-verification — PRIORITIZE critical-chain modules
  // The queue controller found 10 critical-chain modules unverified.
  // These should be verified before random modules.
  const criticalChain = [
    'rh-attack.js', 'noswap-closure.js', 'many-body-correction-closure.js',
    'm-raw-from-umon-bridge.js', 'verify-imp440-altpath.js',
    'd-monotone-analytic-closure.js', 'b1-slope-analytic-bound.js',
    'b2-intercept-analytic-bound.js', 'rvm-jacobian-lower-bound.js',
    'c-mb-unconditional-bound.js', 'route-a-monotonicity-closure.js',
    'g3a-max-gap-closure.js', 'chain-crossverify-N5e5.js',
    'spectral-lambda-kernel.js', 'path-g-cauchy-rigorous.js',
  ];
  const verifiedSet = new Set();
  try {
    const vlog = execSync('git log --oneline -500', { encoding: 'utf-8' });
    for (const line of vlog.split('\n')) {
      const vm = line.match(/cross-verify (\S+\.js)/);
      if (vm) verifiedSet.add(vm[1]);
    }
  } catch {}

  const criticalUnverified = criticalChain.filter(f =>
    !verifiedSet.has(f) && existsSync(join(ROOT, 'src/math', f))
  );

  if (criticalUnverified.length > 0) {
    // Pick the first unverified critical-chain module — HIGH priority
    const target = criticalUnverified[0];
    ideas.push({
      category: 'proof',
      priority: 'high',
      title: `CRITICAL CHAIN: cross-verify ${target}`,
      description: `${target} is in the critical proof chain but has NOT been independently cross-verified. Given the bug discovery rate in verified modules, this is high priority. Read src/math/${target}, verify all formulas vs cited references, check edge cases, confirm reference values.`,
      proofSection: 'S10-verify',
      complexity: 'medium',
    });
  } else if (mathFiles.length > 0) {
    // All critical-chain verified — pick a random non-critical module
    const targetMath = mathFiles[Math.floor(Math.random() * mathFiles.length)];
    ideas.push({
      category: 'proof',
      priority: 'medium',
      title: `Cross-verify ${targetMath}: independent check of key computations`,
      description: `Read src/math/${targetMath} and independently verify its main exported computation. Check: (1) are the formulas correct vs. the cited references? (2) are there edge cases that produce NaN or infinity? (3) does the numerical output match a known reference value? Document findings as inline comments or a verification note.`,
      proofSection: 'S10-verify',
      complexity: 'medium',
    });
  }

  // Category 3: Documentation — pick a data module and add JSDoc
  const undocumented = dataFiles.filter(f => {
    try {
      const content = readFileSync(join(ROOT, 'src/data', f), 'utf-8');
      return !content.includes('@module') && !content.includes('@fileoverview') && content.length > 1000;
    } catch { return false; }
  });
  if (undocumented.length > 0) {
    const target = undocumented[Math.floor(Math.random() * undocumented.length)];
    ideas.push({
      category: 'content',
      priority: 'low',
      title: `Add JSDoc module documentation to ${target}`,
      description: `src/data/${target} is >1KB but has no @module or @fileoverview JSDoc. Add a module-level doc comment explaining: what the file exports, what proof chain step it belongs to, what its key assertions are, and what tickets created/modified it. This helps external readers navigate the 50+ data files.`,
      proofSection: 'docs',
      complexity: 'small',
    });
  }

  // Category 4: Test coverage — add a smoke test for an untested module
  ideas.push({
    category: 'meta',
    priority: 'medium',
    title: `Add smoke test for a math or data module in scripts/smoke-tests.mjs`,
    description: `Extend scripts/smoke-tests.mjs with 2-3 new smoke tests for modules that are not yet covered. Pick from src/math/*.js or src/data/*.js. Each test should: (1) import the module, (2) call its main export, (3) assert the return shape is correct, (4) assert key values are in expected ranges. Run with npm test to verify.`,
    proofSection: 'meta',
    complexity: 'small',
  });

  // Category 5: Numerical exploration — push a bound tighter
  ideas.push({
    category: 'proof',
    priority: 'medium',
    title: `Numerical exploration: compute Lambda bound at a new N* value not yet in the grid`,
    description: `The finite-height Lambda bound grid covers N* in {1e4, 1e5, 1e6, 1e7, 5e7, 1e8, 5e8, 1e9}. Pick an intermediate value (e.g. 2e5, 5e5, 2e6, 5e6, 2e7) and compute L_pt at that point using the existing formula chain. Add the result to src/data/finite-height-beats-platt-trudgian.js. This fills in the grid and may reveal interesting structure in the L_pt(N*) curve.`,
    proofSection: 'S10-numerical',
    complexity: 'small',
  });

  // Category 6: App UX — always room to improve
  ideas.push({
    category: 'feature',
    priority: 'low',
    title: `UX improvement: add loading states, error boundaries, or accessibility to a page`,
    description: `Pick any page in src/pages/ that lacks: (1) a loading spinner for lazy-loaded data, (2) an error boundary with a user-friendly fallback, (3) proper aria-labels on interactive elements, or (4) keyboard navigation support. Add the missing UX feature. Small scope — one page, one improvement.`,
    proofSection: 'app',
    complexity: 'small',
  });

  return ideas;
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

  // Collect candidates from all scanners (gap-finding)
  const gapCandidates = [
    ...scanOpenSubGaps(),
    ...scanLeanSorrys(),
    ...scanDashboardBugs(),
    ...scanHarnessImprovements(),
    ...scanPartialStatuses(),
    ...scanTodos(),
    ...scanStaleAssertions(),
  ];

  // ALWAYS generate forward-looking work — this prevents the engine from
  // ever fully draining. Even if all bugs are fixed, there's always a page
  // to improve, a module to verify, or a bound to tighten.
  const forwardCandidates = generateForwardWork();

  // Combine: gap-finding work takes priority, forward work fills the rest
  const candidates = [...gapCandidates, ...forwardCandidates];

  // Deduplicate by title similarity (first 50 chars) AND against history
  const history = loadHistory();
  const historySet = new Set(history.seededTitles.map(t => titleKey(t)));
  const seen = new Set();
  const unique = candidates.filter(c => {
    const key = titleKey(c.title);
    // Skip if we already seeded this exact title in a previous cycle
    if (historySet.has(key)) return false;
    // Skip intra-batch duplicates
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Take top 10 by priority order
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  unique.sort((a, b) => (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3));
  const batch = unique.slice(0, 10);

  if (batch.length === 0) {
    console.log('No new work found after dedup against history. Codebase is clean or all gaps are known.');
    console.log(`History has ${history.seededTitles.length} previously-seeded titles suppressed.`);
    // Exit with code 1 so auto-improve.sh treats this as "no work found" and auto-stops
    process.exit(1);
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

  // Record seeded titles in history to prevent re-seeding in future cycles
  batch.forEach(t => history.seededTitles.push(t.title));
  saveHistory(history);
  console.log(`History updated: ${history.seededTitles.length} total seeded titles tracked.`);

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
