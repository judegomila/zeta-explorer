#!/usr/bin/env node
/**
 * imp-2741 -- Reproducibility driver for the cross-checkable headline numbers.
 *
 * No script today recomputes the frozen headline numbers FROM SOURCE; a stale
 * cache or an arithmetic regression would slip past the build. This driver
 * re-runs the source computations for three independently cross-checkable
 * headline numbers and diffs each against its frozen published literal with an
 * explicit tolerance (TOL = 1e-6, per the storage-precision tolerance note in
 * MEMORY.md -- published numbers are 7-sig-fig / 4-sig-fig snapshots, so a
 * tighter tol would false-positive on the rounding):
 *
 *   1. kernel-hack pair-ODE  t_c = d_min^2 / 8  recomputed from the N=10000 row
 *      of dyson-ladder-extended-cache.json, vs the frozen pathA t_c published
 *      in kernel-vs-dyson-crossverify.js (imp-515).
 *   2. imp-963 K=0.2014 plateau-12 cert: max rk4.K_paper_cert_floor over the
 *      closed-on-both-sides rows of imp-1086-crosscheck-rows.json, vs the frozen
 *      IMP963_HEADLINE_K=0.2014118 (and the 4-figure registry literal 0.2014).
 *   3. kernel-vs-dyson N=10K agreement: relative error between pathA pair-ODE
 *      t_c and pathB measured Dyson RK4 t_c, vs the published 4.101e-4 and the
 *      headline "< 1%" agreement claim.
 *
 * Emits scripts/logs/reproduce-<ISO>.md and exits non-zero on any
 * out-of-tolerance mismatch. NEVER mutates source -- read-only recompute.
 *
 * Run: npm run reproduce
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const LOG_DIR = path.join(__dirname, 'logs');

const TOL = 1e-6; // storage-precision tolerance (see MEMORY.md note)

function readJSON(rel) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, rel), 'utf-8'));
}

// Frozen published literals (registry-of-record snapshot). If a recompute from
// source drifts from one of these, either the cache changed or arithmetic
// regressed -- the check fails loudly.
const FROZEN = {
  pairODE_tc: 0.0001776471, // kernel-vs-dyson-crossverify pathA t_c (toPrecision 7)
  dyson_relErr: 4.101e-4,   // kernel-vs-dyson-crossverify agreement.relErr (toExponential 3)
  kBound_precise: 0.2014118, // finite-k-c-mb-crosscheck IMP963_HEADLINE_K (N=113, plateau 12)
  kBound_registry: 0.2014,  // headline-numbers-registry kBound.value (4-figure)
};

const checks = [];
function record(name, recomputed, frozen, tol, extra) {
  const diff = Math.abs(recomputed - frozen);
  const pass = diff <= tol;
  checks.push({ name, recomputed, frozen, diff, tol, pass, extra: extra || '' });
}

// ── 1+3. kernel-hack pair-ODE t_c and the N=10K agreement ────────────────────
const cache = readJSON('dyson-ladder-extended-cache.json');
const row10k = (cache.rows || []).find((r) => r.N === 10000) || null;
if (!row10k) throw new Error('[imp-2741] dyson-ladder-extended-cache.json missing N=10000 row');
if (row10k.reason !== 'gap-nonpositive') {
  throw new Error('[imp-2741] N=10000 row is not a gap-nonpositive collision (reason=' + row10k.reason + ')');
}
const dMin = row10k.initialMinGap;
const tcMeas = row10k.t_c;
const tcPair = (dMin * dMin) / 8.0; // backward CM pair flow: |tau_c| = d_min^2 / 8
const tcPairPublished = +tcPair.toPrecision(7); // same rounding the module publishes
record('kernel-hack pair-ODE t_c = d_min^2/8 (N=10K)', tcPairPublished, FROZEN.pairODE_tc, TOL,
  'd_min=' + dMin + ' -> t_c=' + tcPair);

const relErr = Math.abs(tcPair - tcMeas) / tcMeas;
const relErrPublished = +relErr.toExponential(3); // same rounding the module publishes
record('kernel-vs-dyson N=10K agreement relErr', relErrPublished, FROZEN.dyson_relErr, TOL,
  'pathB measured t_c=' + tcMeas + '; passes-1pct=' + (relErr < 0.01));
// headline claim: the two independent paths agree to better than 1%.
record('kernel-vs-dyson agreement under 1pct headline', relErr < 0.01 ? 0 : 1, 0, TOL,
  'relErr=' + relErr.toExponential(3) + ' must be < 1e-2');

// ── 2. imp-963 K=0.2014 plateau-12 cert ──────────────────────────────────────
const crossRows = readJSON('imp-1086-crosscheck-rows.json');
const completeRows = crossRows.filter(
  (r) => r.dp45Matched && r.dp45Matched.closed === true && r.dp45Refined && r.dp45Refined.closed === true,
);
if (completeRows.length === 0) throw new Error('[imp-2741] imp-1086-crosscheck-rows.json has no closed-on-both-sides rows');
const kMax = Math.max(...completeRows.map((r) => r.rk4.K_paper_cert_floor));
const argmax = completeRows.reduce((a, r) => (r.rk4.K_paper_cert_floor > a.rk4.K_paper_cert_floor ? r : a));
record('imp-963 K plateau cert (max rk4 K_paper_cert_floor)', kMax, FROZEN.kBound_precise, TOL,
  'argmax at N=' + argmax.N + ', plateau=' + argmax.plateauIndex);
// the precise cert must round to the 4-figure registry headline 0.2014.
record('imp-963 K rounds to registry headline 0.2014', +kMax.toFixed(4), FROZEN.kBound_registry, TOL,
  'precise=' + kMax + ' -> toFixed(4)=' + kMax.toFixed(4));

// ── Report ────────────────────────────────────────────────────────────────────
const iso = new Date().toISOString().replace(/[:.]/g, '-');
const allPass = checks.every((c) => c.pass);
const lines = [];
lines.push('# imp-2741 headline-number reproducibility report');
lines.push('');
lines.push('Generated: ' + new Date().toISOString());
lines.push('Tolerance: ' + TOL + ' (storage-precision, MEMORY.md note)');
lines.push('Verdict: ' + (allPass ? 'PASS -- all recomputed-from-source numbers match the frozen registry' : 'FAIL -- out-of-tolerance mismatch (see below)'));
lines.push('');
lines.push('| check | recomputed | frozen | abs diff | tol | result |');
lines.push('| --- | --- | --- | --- | --- | --- |');
for (const c of checks) {
  lines.push('| ' + c.name + ' | ' + c.recomputed + ' | ' + c.frozen + ' | ' + c.diff.toExponential(3) + ' | ' + c.tol + ' | ' + (c.pass ? 'PASS' : 'FAIL') + ' |');
}
lines.push('');
lines.push('## Provenance');
for (const c of checks) {
  lines.push('- **' + c.name + '** -- ' + c.extra);
}
lines.push('');
lines.push('Sources: dyson-ladder-extended-cache.json (imp-514), imp-1086-crosscheck-rows.json (imp-933 RK4).');

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
const outPath = path.join(LOG_DIR, 'reproduce-' + iso + '.md');
fs.writeFileSync(outPath, lines.join('\n') + '\n', 'utf-8');

console.log(lines.join('\n'));
console.log('\nReport written to ' + path.relative(path.join(__dirname, '..'), outPath));

if (!allPass) {
  console.error('\n[imp-2741] FAIL: one or more headline numbers drifted out of tolerance.');
  process.exit(1);
}
console.log('\n[imp-2741] PASS: all headline numbers reproduced from source within tolerance.');
