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
 * imp-2876 extends coverage to the remaining 3 of the 4 headline-numbers-registry
 * constants, which previously had NO from-source leg (each recomputed as an
 * ESTIMATE with an explicit honest-scope label, NOT promoted to a bound):
 *
 *   4a. 7.98e-4 HISTORICAL imp-1147 intercept = a_hi + E_trunc_pt, recomposed
 *       from the two pinned constants in asymptotic-lambda-bound-2026-05-20.js
 *       (CONDITIONAL on the linear-1/N OLS model, superseded by imp-1261).
 *   4b. 3.06e-5 asymptotic-conditional E_trunc_pt, recomputed from the imp-459
 *       closed form at sigma_opt = 0.75 (modulo Polymath15 G6a).
 *   4c. 0.121 finite-beat ESTIMATE = L_cond(1e6) + E_trunc_PT(sigma=0.61), the
 *       imp-447 historical assembly; E_trunc_PT recomputed from the closed form,
 *       L_cond read as the imp-449-cross-verified literal (C_H-gated ESTIMATE;
 *       sub-gap reproduce-0121-Lcond-needs-assembly-import).
 *
 * Emits scripts/logs/reproduce-<ISO>.md and exits non-zero on any
 * out-of-tolerance mismatch. NEVER mutates source -- read-only recompute.
 *
 * Run: npm run reproduce
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HEADLINE_NUMBERS } from '../src/data/headline-numbers-registry.js';

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
  // imp-2876: the remaining 3 registry constants that previously had NO from-source leg.
  finiteBeat_estimate: 0.121,  // headline-numbers-registry finiteBeatEstimate (C_H-gated ESTIMATE)
  intercept_hist: 7.98e-4,     // headline-numbers-registry intercept7e4 (linear-1/N CONDITIONAL, historical)
  asymptotic_cond: 3.06e-5,    // headline-numbers-registry asymptoticConditional (modulo Polymath15 G6a)
};

// imp-2876: published conditional-bound literal L_cond(1e6) ~ 0.00803 (imp-449
// alt-path cross-verified). Read as a literal here -- its full re-derivation
// requires the import-gated t_c_proj + E_flow + E_coll height/flow assembly
// (plain-node import of those source modules is blocked by their transitive JSON
// imports). Tracked sub-gap: reproduce-0121-Lcond-needs-assembly-import.
const L_COND_1E6_LITERAL = 0.00803;

const checks = [];
function record(name, recomputed, frozen, tol, extra) {
  const diff = Math.abs(recomputed - frozen);
  const pass = diff <= tol;
  checks.push({ name, recomputed, frozen, diff, tol, pass, extra: extra || '' });
}

// ── 0. imp-2882: cross-pin the FROZEN registry-mirroring literals to the
// headline-numbers-registry single source of truth. Four FROZEN entries here
// (kBound_registry, finiteBeat_estimate, intercept_hist, asymptotic_cond) are
// independent copies of registry values. If the registry is corrected but a
// FROZEN literal is not updated, this driver would keep validating recomputes
// against a stale frozen number and stay green -- defeating the reproducibility
// check itself. These exact-equality pins (tol 1e-12) fail loudly on drift.
const REGISTRY_PINS = [
  ['FROZEN.kBound_registry == registry kBound.value', FROZEN.kBound_registry, HEADLINE_NUMBERS.kBound.value],
  ['FROZEN.finiteBeat_estimate == registry finiteBeatEstimate.value', FROZEN.finiteBeat_estimate, HEADLINE_NUMBERS.finiteBeatEstimate.value],
  ['FROZEN.intercept_hist == registry intercept7e4.value', FROZEN.intercept_hist, HEADLINE_NUMBERS.intercept7e4.value],
  ['FROZEN.asymptotic_cond == registry asymptoticConditional.value', FROZEN.asymptotic_cond, HEADLINE_NUMBERS.asymptoticConditional.value],
];
for (const [name, frozenVal, regVal] of REGISTRY_PINS) {
  record('imp-2882 FROZEN<->registry pin: ' + name, frozenVal, regVal, 1e-12,
    'reproduce FROZEN literal must equal headline-numbers-registry source-of-truth (' + regVal + ')');
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

// ── 4. imp-2876: the remaining 3 registry constants (0.121, 7.98e-4, 3.06e-5) ──
// The headline-numbers-registry declares 4 canonical constants; checks 1-3 above
// cover only the pair-ODE / Dyson / K=0.2014 numbers. The finite-beat ESTIMATE
// 0.121, the HISTORICAL imp-1147 intercept 7.98e-4 and the asymptotic-conditional
// 3.06e-5 had NO from-source reproducibility leg. We add them here, recomputing
// each ESTIMATE value (NOT promoting any to a rigorous bound) with explicit
// honest-scope labels and the same TOL=1e-6 storage-precision tolerance.
function readText(rel) {
  return fs.readFileSync(path.join(DATA_DIR, rel), 'utf-8');
}
function extractConst(src, name) {
  const m = src.match(new RegExp('const\\s+' + name + '\\s*=\\s*([0-9.eE+-]+)'));
  if (!m) throw new Error('[imp-2876] could not extract const ' + name + ' from source');
  return parseFloat(m[1]);
}

// 4a. HISTORICAL intercept 7.98e-4 = a_hi + E_trunc_pt, recomposed from the two
// pinned constants in the canonical source asymptotic-lambda-bound-2026-05-20.js.
// HONEST SCOPE: CONDITIONAL on the (superseded) linear-1/N OLS model -- imp-1261
// removed this dependence, so the value survives only as a labelled historical
// reference, NOT a live bound.
const asySrc = readText('asymptotic-lambda-bound-2026-05-20.js');
const aHi = extractConst(asySrc, 'HISTORICAL_A_HI_IMP1147');     // 7.673e-4 interval-OLS a_hi
const eTruncIngham = extractConst(asySrc, 'E_TRUNC_PT_INGHAM');  // 3.06e-5 Polymath15 Ingham tail
const interceptComposed = +(aHi + eTruncIngham).toPrecision(3);  // module publishes toPrecision(3)
record('imp-1147 HISTORICAL intercept 7.98e-4 = a_hi + E_trunc_pt (linear-1/N CONDITIONAL)',
  interceptComposed, FROZEN.intercept_hist, TOL,
  'a_hi=' + aHi + ' + E_trunc_pt=' + eTruncIngham + ' = ' + (aHi + eTruncIngham) +
  ' [ESTIMATE, OLS-superseded by imp-1261]');

// 4b+4c. E_trunc_PT(sigma) closed form (imp-459): faithful port of
// etruncPTOptimalBound in finite-height-beats-platt-trudgian.js --
//   E_trunc_PT(sigma) = (2 e_I / kappa_T) * T_PT^{-kappa_T},  e_I = 3(1-sigma)/(2-sigma),
//   kappa_T = 1 - e_I,  T_PT = 3e12 (Platt-Trudgian 2021 verified height).
const T_PT = 3e12;
function etruncPT(sigma) {
  const eI = 3 * (1 - sigma) / (2 - sigma); // Ingham exponent
  const kappa = 1 - eI;
  return ((2 * eI) / kappa) * Math.pow(T_PT, -kappa);
}

// 4b. asymptotic-conditional 3.06e-5 at the variational optimum sigma_opt = 0.75
// (Ingham boundary sigma = 3/4). HONEST SCOPE: asymptotic, modulo Polymath15 G6a.
const eTruncOpt = +etruncPT(0.75).toExponential(2); // registry publishes 3.06e-5 (3 sig fig)
record('asymptotic-conditional E_trunc_pt 3.06e-5 (closed form, sigma_opt=0.75)',
  eTruncOpt, FROZEN.asymptotic_cond, TOL,
  'E_trunc_PT(0.75)=' + etruncPT(0.75).toExponential(4) + ' modulo Polymath15 G6a');

// 4c. finite-beat ESTIMATE 0.121 = L_cond(1e6) + E_trunc_PT(sigma=0.61), the
// imp-447 historical assembly (sigma=0.61 gives E_trunc_PT ~ 0.1127). E_trunc_PT
// is recomputed from the same closed form; L_cond(1e6) is the published literal
// (sub-gap above). HONEST SCOPE: ESTIMATE gated on the symbolic constant C_H --
// recompute the ESTIMATE, do NOT read it as a rigorous unconditional bound.
const eTrunc061 = etruncPT(0.61);                      // ~0.1127 imp-447 historical E_trunc_pt
const lambdaFiniteBeat = +(L_COND_1E6_LITERAL + eTrunc061).toFixed(3);
record('finite-beat ESTIMATE 0.121 = L_cond + E_trunc_PT(0.61) [C_H-gated ESTIMATE]',
  lambdaFiniteBeat, FROZEN.finiteBeat_estimate, TOL,
  'L_cond(1e6)=' + L_COND_1E6_LITERAL + ' (literal, imp-449 xverify) + E_trunc_PT(0.61)=' +
  eTrunc061.toFixed(5) + ' = ' + (L_COND_1E6_LITERAL + eTrunc061).toFixed(5));

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
lines.push('Sources: dyson-ladder-extended-cache.json (imp-514), imp-1086-crosscheck-rows.json (imp-933 RK4), asymptotic-lambda-bound-2026-05-20.js (imp-1147 a_hi/E_trunc_pt literals), E_trunc_PT(sigma) closed form (imp-447/imp-459).');

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
