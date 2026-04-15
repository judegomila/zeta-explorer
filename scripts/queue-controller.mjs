#!/usr/bin/env node
/**
 * queue-controller.mjs — Intelligent queue management
 *
 * Analyzes recent engine output to detect surprising results (bugs found,
 * sign errors, incorrect values) and dynamically reprioritizes the queue.
 *
 * Key behaviors:
 * 1. SURPRISE DETECTION: Scans recent commits for bug-fix patterns.
 *    When a cross-verification finds a real bug, all unverified modules
 *    in the same category get promoted to high priority.
 *
 * 2. CRITICAL-CHAIN PRIORITY: Modules referenced by the proof chain
 *    (lambda-N1e6-final-assembly, many-body-correction, m-raw-from-umon-bridge)
 *    get priority over peripheral modules.
 *
 * 3. BUG-RATE TRACKING: Maintains a running bug discovery rate. If the
 *    rate exceeds 15%, cross-verification tickets get auto-promoted above
 *    JSDoc/feature work.
 *
 * 4. DIMINISHING RETURNS: If the last 10 cross-verifications found 0 bugs,
 *    demote remaining cross-verify tickets and promote feature/UX work.
 *
 * Usage: node scripts/queue-controller.mjs [--analyze] [--reprioritize] [--seed]
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const ROOT = process.cwd();
const ANALYZE = process.argv.includes('--analyze');
const REPRIORITIZE = process.argv.includes('--reprioritize');
const SEED = process.argv.includes('--seed');

// ── Surprise detection ────────────────────────────────────────────────────

function analyzeRecentCommits(n = 100) {
  const log = execSync(`git log --oneline -${n}`, { encoding: 'utf-8' }).trim().split('\n');

  const crossVerified = [];
  const bugsFound = [];
  const features = [];
  const jsdoc = [];

  for (const line of log) {
    if (line.includes('cross-verify')) {
      crossVerified.push(line);
      if (/fix|bug|error|wrong|incorrect|sign.error/i.test(line)) {
        bugsFound.push(line);
      }
    }
    if (/feature|add.*to.*Page|interactive|slider|tooltip|click/i.test(line)) {
      features.push(line);
    }
    if (/JSDoc|@module/i.test(line)) {
      jsdoc.push(line);
    }
  }

  const bugRate = crossVerified.length > 0
    ? (bugsFound.length / crossVerified.length * 100).toFixed(1)
    : '0.0';

  // Check last 10 cross-verifications for diminishing returns
  const last10 = crossVerified.slice(0, 10);
  const last10Bugs = last10.filter(l => /fix|bug|error|wrong|incorrect|sign.error/i.test(l));

  return {
    totalCommits: log.length,
    crossVerified: crossVerified.length,
    bugsFound: bugsFound.length,
    bugRate: parseFloat(bugRate),
    bugDetails: bugsFound,
    features: features.length,
    jsdoc: jsdoc.length,
    last10CrossVerifyBugRate: last10.length > 0
      ? (last10Bugs.length / last10.length * 100).toFixed(1)
      : '0.0',
    diminishingReturns: last10.length >= 10 && last10Bugs.length === 0,
  };
}

// ── Critical chain analysis ───────────────────────────────────────────────

function getCriticalChainModules() {
  // Modules directly used in the proof chain
  return [
    'rh-attack.js',
    'noswap-closure.js',
    'many-body-correction-closure.js',
    'm-raw-from-umon-bridge.js',
    'verify-imp440-altpath.js',
    'd-monotone-analytic-closure.js',
    'b1-slope-analytic-bound.js',
    'b2-intercept-analytic-bound.js',
    'rvm-jacobian-lower-bound.js',
    'c-mb-unconditional-bound.js',
    'route-a-monotonicity-closure.js',
    'g3a-max-gap-closure.js',
    'chain-crossverify-N5e5.js',
    'spectral-lambda-kernel.js',
    'path-g-cauchy-rigorous.js',
  ];
}

function getVerifiedModules() {
  try {
    const log = execSync('git log --oneline -500', { encoding: 'utf-8' });
    const verified = new Set();
    for (const line of log.split('\n')) {
      const m = line.match(/cross-verify (\S+\.js)/);
      if (m) verified.add(m[1]);
    }
    return verified;
  } catch { return new Set(); }
}

function getUnverifiedModules() {
  const allMath = readdirSync(join(ROOT, 'src/math')).filter(f => f.endsWith('.js'));
  const verified = getVerifiedModules();
  return allMath.filter(f => !verified.has(f));
}

// ── Priority recommendations ──────────────────────────────────────────────

function generateRecommendations(analysis) {
  const recs = [];
  const critical = getCriticalChainModules();
  const unverified = getUnverifiedModules();
  const criticalUnverified = unverified.filter(f => critical.includes(f));

  // 1. Critical chain modules that haven't been verified
  if (criticalUnverified.length > 0) {
    recs.push({
      type: 'CRITICAL_CHAIN_UNVERIFIED',
      priority: 'high',
      message: `${criticalUnverified.length} critical-chain modules unverified`,
      modules: criticalUnverified,
      action: 'Promote cross-verification of these to HIGH priority immediately',
    });
  }

  // 2. High bug rate — promote all cross-verification
  if (analysis.bugRate > 15) {
    recs.push({
      type: 'HIGH_BUG_RATE',
      priority: 'high',
      message: `Bug rate ${analysis.bugRate}% exceeds 15% threshold — cross-verification is finding real bugs`,
      action: 'Promote remaining cross-verification tickets above JSDoc/feature work',
    });
  }

  // 3. Diminishing returns — demote cross-verification
  if (analysis.diminishingReturns) {
    recs.push({
      type: 'DIMINISHING_RETURNS',
      priority: 'low',
      message: 'Last 10 cross-verifications found 0 bugs — diminishing returns',
      action: 'Demote remaining cross-verification; promote feature/UX work',
    });
  }

  // 4. Surprising bug found — seed follow-up
  if (analysis.bugsFound > 0) {
    recs.push({
      type: 'SURPRISING_BUGS',
      priority: 'high',
      message: `${analysis.bugsFound} bugs found by cross-verification`,
      details: analysis.bugDetails,
      action: 'Seed follow-up tickets: regression test for each bug, verify downstream consumers',
    });
  }

  // 5. Balance check — is the mix healthy?
  const total = analysis.crossVerified + analysis.features + analysis.jsdoc;
  if (total > 0) {
    const crossPct = (analysis.crossVerified / total * 100).toFixed(0);
    const featPct = (analysis.features / total * 100).toFixed(0);
    const docPct = (analysis.jsdoc / total * 100).toFixed(0);
    recs.push({
      type: 'WORK_MIX',
      priority: 'info',
      message: `Work mix: ${crossPct}% verification, ${featPct}% features, ${docPct}% docs`,
      action: crossPct > 60 ? 'Consider more feature work for user value' :
              docPct > 50 ? 'Consider more verification for rigor' :
              'Mix is healthy',
    });
  }

  return recs;
}

// ── Seed tickets based on recommendations ─────────────────────────────────

function generateTickets(recs, analysis) {
  const tickets = [];
  const critical = getCriticalChainModules();
  const unverified = getUnverifiedModules();
  const criticalUnverified = unverified.filter(f => critical.includes(f));

  // Priority 1: Critical chain verification
  for (const mod of criticalUnverified.slice(0, 3)) {
    tickets.push({
      category: 'proof',
      priority: 'high',
      title: `CRITICAL CHAIN: cross-verify ${mod}`,
      description: `${mod} is in the critical proof chain (referenced by lambda-N1e6-final-assembly or many-body-correction) but has NOT been independently cross-verified. Given the ${analysis.bugRate}% bug discovery rate in verified modules, this is a priority. Verify all formulas, check edge cases, confirm reference values.`,
      proofSection: 'S10-verify',
      complexity: 'medium',
    });
  }

  // Priority 2: Follow-up on bugs found
  for (const bug of analysis.bugDetails.slice(0, 2)) {
    const modMatch = bug.match(/(?:fix|verify|cross-verify)\s+(\S+\.js)/i);
    const mod = modMatch ? modMatch[1] : 'unknown';
    tickets.push({
      category: 'proof',
      priority: 'high',
      title: `Regression guard: add smoke test for bug found in ${mod}`,
      description: `Cross-verification found a real bug in ${mod} (commit: ${bug.slice(0, 8)}). Add a targeted smoke test to scripts/smoke-tests.mjs that catches this specific class of error (sign error, singular-series, rounding). This prevents the bug from regressing.`,
      proofSection: 'meta',
      complexity: 'small',
    });
  }

  // Priority 3: Random unverified modules (non-critical)
  const nonCriticalUnverified = unverified.filter(f => !critical.includes(f));
  const shuffled = nonCriticalUnverified.sort(() => Math.random() - 0.5);
  for (const mod of shuffled.slice(0, 2)) {
    tickets.push({
      category: 'proof',
      priority: 'medium',
      title: `Cross-verify ${mod}: independent check of key computations`,
      description: `src/math/${mod} has not been cross-verified. Check formulas vs cited references, test edge cases, verify reference values. Bug rate in verified modules is ${analysis.bugRate}%.`,
      proofSection: 'S10-verify',
      complexity: 'medium',
    });
  }

  // Priority 4: Feature work (if not diminishing returns on verification)
  if (!analysis.diminishingReturns) {
    const pages = readdirSync(join(ROOT, 'src/pages')).filter(f => f.endsWith('.jsx'));
    const page = pages[Math.floor(Math.random() * pages.length)];
    tickets.push({
      category: 'feature',
      priority: 'medium',
      title: `Improve ${page}: add interactivity or better explanations`,
      description: `Read src/pages/${page} and make one meaningful improvement.`,
      proofSection: 'app',
      complexity: 'medium',
    });
  }

  return tickets;
}

// ── Main ──────────────────────────────────────────────────────────────────

function main() {
  const analysis = analyzeRecentCommits(200);
  const recs = generateRecommendations(analysis);

  console.log('=== QUEUE CONTROLLER ANALYSIS ===\n');
  console.log(`Commits analyzed: ${analysis.totalCommits}`);
  console.log(`Cross-verifications: ${analysis.crossVerified} (${analysis.bugsFound} bugs found = ${analysis.bugRate}%)`);
  console.log(`Last-10 bug rate: ${analysis.last10CrossVerifyBugRate}%`);
  console.log(`Features shipped: ${analysis.features}`);
  console.log(`JSDoc added: ${analysis.jsdoc}`);
  console.log(`Diminishing returns: ${analysis.diminishingReturns}\n`);

  const unverified = getUnverifiedModules();
  const critical = getCriticalChainModules();
  const criticalUnverified = unverified.filter(f => critical.includes(f));
  console.log(`Unverified math modules: ${unverified.length} / 293`);
  console.log(`Critical-chain unverified: ${criticalUnverified.length} (${criticalUnverified.join(', ') || 'none'})\n`);

  console.log('=== RECOMMENDATIONS ===\n');
  for (const rec of recs) {
    const icon = rec.priority === 'high' ? '🔴' : rec.priority === 'low' ? '🟡' : 'ℹ️';
    console.log(`${icon} [${rec.type}] ${rec.message}`);
    console.log(`   Action: ${rec.action}`);
    if (rec.modules) console.log(`   Modules: ${rec.modules.join(', ')}`);
    if (rec.details) rec.details.forEach(d => console.log(`   - ${d}`));
    console.log();
  }

  if (SEED) {
    const tickets = generateTickets(recs, analysis);
    console.log(`=== SEEDING ${tickets.length} TICKETS ===\n`);
    tickets.forEach((t, i) => console.log(`  ${i + 1}. [${t.priority}] ${t.title}`));
    console.log('\nTo write these to the queue, pipe to autofill or seed manually.');
  }
}

main();
