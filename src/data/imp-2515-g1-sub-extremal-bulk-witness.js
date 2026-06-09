/**
 * @module imp-2515-g1-sub-extremal-bulk-witness
 * @fileoverview imp-2515: honest-partial closure of G1-sub-extremal (the
 * minimum-gap-site bulk-confinement sub-gap declared in
 * imp-336-post-ladder-update.js, equivalent to imp-343 G4a_bulk_confinement).
 *
 * Exports IMP2515_G1_SUB_EXTREMAL_BULK_WITNESS (record) and
 * IMP2515_G1_SUB_EXTREMAL_BULK_WITNESS_ASSERTIONS (build-time assertions).
 *
 * What is established here (and what is NOT)
 * ------------------------------------------
 * G1-sub-extremal as written in imp-336-post-ladder-update.js reads: the
 * minimum gap site k*_N of the first N Riemann zeros concentrates in the
 * index bulk W(alpha, N) = { k : alpha*N <= k <= (1-alpha)*N } for every
 * alpha in (0, 1/2). For the single deterministic nested sequence of zeros
 * the natural transcription is
 *
 *   (U)  for every fixed alpha in (0, 1/2) there is N_0(alpha) with
 *        k*_N in W(alpha, N) for all N >= N_0(alpha).
 *
 * RESULT 1 (rigorous, unconditional): (U) is FALSE. Record-time lemma:
 *   (a) B_N = min raw gap among the first N zeros tends to 0. Proof: the
 *       M gaps with indices in (M, 2M] sum to gamma_{2M} - gamma_M, so the
 *       smallest of them is at most (gamma_{2M} - gamma_M)/M, which by the
 *       Riemann-von Mangoldt asymptotic gamma_M ~ 2*pi*M/log M is
 *       O(1/log M) -> 0. Since B_N is non-increasing and tends to 0, the
 *       strict-decrease (record) events occur at arbitrarily large N.
 *   (b) At every strict record N_r the new minimum is the newest gap (the
 *       only gap absent at step N_r - 1), so k*_{N_r} = N_r - 1, which
 *       exits W(alpha, N_r) for every alpha > 1/N_r. Hence for every fixed
 *       alpha in (0, 1/2), k*_N leaves the bulk at infinitely many N. QED.
 *
 * RESULT 2 (empirical, 10^6 verified zeros): the witness sweep below finds
 * 36 raw min-gap records up to N = 10^6 (last at N = 420892), confirms
 * k*_{N_r} = N_r - 1 at every one of them, and measures the edge-violation
 * density profile: the fraction of N <= 10^6 with k*_N outside W(alpha, N)
 * is approximately 1.3*alpha to 1.6*alpha (raw) and 0.9*alpha to 1.2*alpha
 * (unfolded) for alpha in [0.01, 0.2] - in particular it tends to 0 as
 * alpha -> 0. This supports the surviving DENSITY-FORM restatement:
 *
 *   (D)  limsup_N #{ n <= N : k*_n not in W(alpha, n) } / N -> 0
 *        as alpha -> 0.
 *
 * (D) matches the actual content of Ben Arous-Bourgade 2013, which is a
 * per-ensemble probabilistic statement, not a statement about one nested
 * deterministic sequence. The GUE-to-zeta port target must therefore be
 * (D), not (U). (D) remains OPEN; this file does not close it.
 *
 * RESULT 3 (empirical): the raw-gap and unfolded-gap argmin sites diverge
 * at 87601 of the 999999 swept N values (8.76 percent), so the named
 * remainder G1-sub-extremal-raw-vs-unfolded (g1-g2-closure.js) is
 * non-vacuous in the data.
 *
 * Route A impact (re-audit note)
 * ------------------------------
 * The refutation of (U) does NOT invalidate any proved result (imp-368 is
 * conditional, imp-336 is a sketch), but it sharpens the target: the
 * imp-336 drift-sign argument cannot assume the argmin stays interior with
 * uniform margin at ALL N. At record times the argmin sits at the last
 * gap (k = N-1), exactly the missing-right-neighbour edge case the sketch
 * flags. Any Route A closure must either handle edge-argmin record times
 * directly or restrict the induction to the (density-one) non-record N.
 *
 * Unfolding convention: u_k = (gamma_{k+1} - gamma_k) * rho(gamma_k) with
 * rho(t) = log(t / (2*pi)) / (2*pi) (left-endpoint Riemann-von Mangoldt
 * density), matching the repo-wide convention.
 *
 * Created by imp-2515 (api-pool). Data: imp-359 ZEROS_EXTENDED (10^6
 * Odlyzko-verified ordinates). Parents: imp-336-post-ladder-update.js
 * (openSubGap G1-sub-extremal), g1-g2-closure.js (raw-vs-unfolded
 * remainder), imp-368 (conditional uniform margin).
 */

import { ZEROS_EXTENDED } from './zeros-to-1e6.js';

// ── Single-pass sweep over the full zeros table ───────────────────────────────

const TWO_PI = 2 * Math.PI;
const rho = (t) => Math.log(t / TWO_PI) / TWO_PI;

const LADDER_N = [
  100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000,
  500000, 1000000,
];
const ALPHAS = [0.01, 0.02, 0.05, 0.1, 0.2];

function sweep(zeros) {
  let rawMin = Infinity;
  let rawK = 0; // 1-based gap index of current raw argmin
  let unfMin = Infinity;
  let unfK = 0;
  let records = 0;
  let lastRecordN = 0;
  let recordSiteAlwaysNewest = true;
  let divergeCount = 0;
  let totalN = 0;
  const violRaw = ALPHAS.map(() => 0);
  const violUnf = ALPHAS.map(() => 0);
  const ladderRows = [];
  let li = 0;

  for (let k = 0; k < zeros.length - 1; k++) {
    const g = zeros[k + 1] - zeros[k];
    const N = k + 2; // first N zeros expose gaps 1..N-1
    if (g < rawMin) {
      rawMin = g;
      rawK = k + 1;
      records += 1;
      lastRecordN = N;
      // Record-time lemma instance: the record argmin must be the newest gap.
      if (rawK !== N - 1) recordSiteAlwaysNewest = false;
    }
    const u = g * rho(zeros[k]);
    if (u < unfMin) {
      unfMin = u;
      unfK = k + 1;
    }
    totalN += 1;
    const xr = rawK / N;
    const xu = unfK / N;
    if (rawK !== unfK) divergeCount += 1;
    for (let i = 0; i < ALPHAS.length; i++) {
      if (Math.min(xr, 1 - xr) < ALPHAS[i]) violRaw[i] += 1;
      if (Math.min(xu, 1 - xu) < ALPHAS[i]) violUnf[i] += 1;
    }
    if (li < LADDER_N.length && N === LADDER_N[li]) {
      ladderRows.push({
        N,
        rawArgmin: rawK,
        rawX: +xr.toFixed(6),
        rawMinGap: +rawMin.toFixed(9),
        unfArgmin: unfK,
        unfX: +xu.toFixed(6),
        unfMinGap: +unfMin.toFixed(9),
      });
      li += 1;
    }
  }

  return {
    totalN,
    records,
    lastRecordN,
    recordSiteAlwaysNewest,
    divergeCount,
    violRawDensity: violRaw.map((c) => c / totalN),
    violUnfDensity: violUnf.map((c) => c / totalN),
    ladderRows,
  };
}

const SWEEP = sweep(ZEROS_EXTENDED);

// ── Pinned expected values (tripwires against silent data drift) ─────────────

const EXPECTED = {
  totalN: 999999,
  records: 36,
  lastRecordN: 420892,
  divergeCount: 87601,
  rawArgminLadder: [91, 186, 453, 922, 1496, 4765, 6709, 18859, 44555, 95248, 95248, 420891, 420891],
  unfArgminLadder: [34, 186, 453, 922, 1496, 4765, 6709, 6709, 44555, 95248, 95248, 420891, 420891],
  violRawDensity: [0.0163, 0.02977, 0.06842, 0.13232, 0.23732],
  violUnfDensity: [0.01249, 0.02206, 0.04853, 0.09035, 0.18178],
};

// Worst bulk margin attained on the ladder: min over rows of min(x, 1-x).
const LADDER_ALPHA_EMP = SWEEP.ladderRows.reduce(
  (m, r) => Math.min(m, r.rawX, 1 - r.rawX),
  Infinity,
);

// ── The record ────────────────────────────────────────────────────────────────

export const IMP2515_G1_SUB_EXTREMAL_BULK_WITNESS = {
  id: 'imp-2515',
  title:
    'G1-sub-extremal honest partial: uniform-in-N bulk confinement of k*_N ' +
    'refuted by the record-time lemma + 10^6-zero witness; density-form ' +
    'restatement isolated as the surviving open target',
  targetSubGap: {
    id: 'G1-sub-extremal',
    declaredIn: 'imp-336-post-ladder-update.js (ROUTE_A_STATUS.G1.openSubGap)',
    equivalentTo: 'imp-343 residualSubGap.G4a_bulk_confinement',
  },
  recordTimeLemma: {
    name: 'Record-time edge-argmin lemma (unconditional)',
    statement:
      'For any strictly increasing real sequence whose running minimum gap ' +
      'B_N tends to 0, the strict-decrease (record) events occur at ' +
      'infinitely many N, and at every record N_r the argmin site is the ' +
      'newest gap k*_{N_r} = N_r - 1. Consequently, for every fixed alpha ' +
      'in (0, 1/2), k*_N exits W(alpha, N) at infinitely many N. Applied ' +
      'to the Riemann zeros: B_N -> 0 unconditionally because the M gaps ' +
      'indexed in (M, 2M] average (gamma_{2M} - gamma_M)/M = O(1/log M) ' +
      'by Riemann-von Mangoldt, so the uniform-in-N reading (U) of ' +
      'G1-sub-extremal is FALSE.',
    consequence:
      'G1-sub-extremal must be read (and eventually proved) in density ' +
      'form (D): the fraction of n <= N with k*_n outside W(alpha, n) ' +
      'stays small uniformly in N and tends to 0 as alpha -> 0. This ' +
      'matches the per-ensemble content of Ben Arous-Bourgade 2013.',
  },
  empiricalWitness: {
    source: 'imp-359 ZEROS_EXTENDED, 10^6 Odlyzko-verified ordinates',
    nGapsSwept: SWEEP.totalN,
    rawMinGapRecords: SWEEP.records,
    lastRecordAtN: SWEEP.lastRecordN,
    everyRecordArgminIsNewestGap: SWEEP.recordSiteAlwaysNewest,
    rawVsUnfoldedArgminDivergenceCount: SWEEP.divergeCount,
    rawVsUnfoldedArgminDivergenceFraction:
      +(SWEEP.divergeCount / SWEEP.totalN).toFixed(6),
    alphas: ALPHAS,
    edgeViolationDensityRaw: SWEEP.violRawDensity.map((d) => +d.toFixed(6)),
    edgeViolationDensityUnfolded: SWEEP.violUnfDensity.map((d) => +d.toFixed(6)),
    densityProfileNote:
      'Violation density is approximately linear in alpha (raw: about ' +
      '1.3-1.6 times alpha; unfolded: about 0.9-1.2 times alpha) and ' +
      'decreases to 0 as alpha -> 0, supporting the density-form (D).',
    ladderRows: SWEEP.ladderRows,
    ladderAlphaEmp: +LADDER_ALPHA_EMP.toFixed(6),
    ladderAlphaEmpNote:
      'Worst bulk margin on the ladder is ' +
      LADDER_ALPHA_EMP.toFixed(4) +
      ' (at N = 5000 and N = 100000, x = 0.953 just after records) - any ' +
      'fixed alpha >= 0.05 already fails on the swept range, independent ' +
      'corroboration of the record-time lemma.',
  },
  survivingSubGap: {
    id: 'G1-sub-extremal-density-form',
    statement:
      'Prove the density form (D): for the minimum-gap site k*_n of the ' +
      'first n Riemann zeros, limsup_N #{ n <= N : k*_n not in ' +
      'W(alpha, n) } / N tends to 0 as alpha -> 0 (raw and unfolded ' +
      'variants). Known in per-ensemble form for GUE (Ben Arous-Bourgade ' +
      '2013); the port to the deterministic nested zero sequence is open ' +
      'and inherits the G1-sub-extremal-raw-vs-unfolded remainder.',
    status: 'open - empirically supported at 10^6 zeros by this witness',
    dependsOn: [
      'G1-sub-extremal-raw-vs-unfolded (g1-g2-closure.js): the two argmins ' +
        'diverge at 8.76 percent of swept N, so the raw and unfolded ' +
        'density statements are genuinely distinct.',
    ],
  },
  routeAImpact:
    'No proved result is invalidated (imp-368 is conditional, imp-336 is a ' +
    'sketch), but the drift-sign argument cannot assume an interior argmin ' +
    'with uniform margin at ALL N: at the 36 record times the argmin is ' +
    'the LAST gap (k = N-1), the missing-right-neighbour edge case the ' +
    'imp-336 sketch flags. Route A closure must handle edge-argmin record ' +
    'times directly or restrict the induction to non-record N (density ' +
    'one, by this witness).',
  status:
    'partial - uniform-in-N reading (U) of G1-sub-extremal refuted ' +
    'unconditionally (record-time lemma) and corroborated at 10^6 zeros; ' +
    'surviving density-form target (D) named as ' +
    'G1-sub-extremal-density-form and left open',
};

// ── Build-time assertions ─────────────────────────────────────────────────────

export const IMP2515_G1_SUB_EXTREMAL_BULK_WITNESS_ASSERTIONS = [
  {
    id: 'imp2515-sweep-matches-pinned-counts',
    holds: () =>
      SWEEP.totalN === EXPECTED.totalN &&
      SWEEP.records === EXPECTED.records &&
      SWEEP.lastRecordN === EXPECTED.lastRecordN &&
      SWEEP.divergeCount === EXPECTED.divergeCount,
    why:
      'The 10^6-zero sweep must reproduce the pinned counts (999999 gaps, ' +
      '36 raw min-gap records, last record at N = 420892, 87601 ' +
      'raw-vs-unfolded argmin divergences). A mismatch means ZEROS_EXTENDED ' +
      'or the unfolding convention drifted and every empirical claim in ' +
      'this record must be recomputed.',
  },
  {
    id: 'imp2515-record-argmin-is-newest-gap',
    holds: () => SWEEP.recordSiteAlwaysNewest && SWEEP.records >= 30,
    why:
      'The record-time lemma predicts k*_{N_r} = N_r - 1 at every strict ' +
      'record; the sweep verifies this at all 36 records. This is the ' +
      'mechanism that refutes the uniform-in-N reading (U) of ' +
      'G1-sub-extremal, so it must hold exactly.',
  },
  {
    id: 'imp2515-ladder-argmins-match',
    holds: () =>
      SWEEP.ladderRows.length === LADDER_N.length &&
      SWEEP.ladderRows.every(
        (r, i) =>
          r.rawArgmin === EXPECTED.rawArgminLadder[i] &&
          r.unfArgmin === EXPECTED.unfArgminLadder[i],
      ),
    why:
      'The 13-point argmin ladder (raw and unfolded) is pinned exactly; it ' +
      'is the citable witness table for the bulk-position trajectory of ' +
      'k*_N, including the raw-vs-unfolded split at N = 20000 (raw 18859 ' +
      'vs unfolded 6709).',
  },
  {
    id: 'imp2515-violation-density-profile',
    holds: () =>
      SWEEP.violRawDensity.every(
        (d, i) => Math.abs(d - EXPECTED.violRawDensity[i]) < 1e-4,
      ) &&
      SWEEP.violUnfDensity.every(
        (d, i) => Math.abs(d - EXPECTED.violUnfDensity[i]) < 1e-4,
      ) &&
      SWEEP.violRawDensity.every((d, i) => i === 0 || d > SWEEP.violRawDensity[i - 1]),
    why:
      'The edge-violation density profile must match the pinned values and ' +
      'be increasing in alpha. Its decrease to 0 as alpha -> 0 is the ' +
      'empirical support for the surviving density-form restatement (D); ' +
      'if the profile changes, the (D) support claim must be re-audited.',
  },
  {
    id: 'imp2515-uniform-reading-fails-on-ladder',
    holds: () => LADDER_ALPHA_EMP < 0.05,
    why:
      'Independent corroboration of the record-time refutation: the worst ' +
      'bulk margin on the ladder must be below 0.05 (measured 0.047 at ' +
      'N = 5000 and N = 100000). If this ever fails the empirical ' +
      'refutation narrative needs rechecking against the lemma.',
  },
  {
    id: 'imp2515-no-closure-claimed',
    holds: () =>
      IMP2515_G1_SUB_EXTREMAL_BULK_WITNESS.status.startsWith('partial') &&
      IMP2515_G1_SUB_EXTREMAL_BULK_WITNESS.survivingSubGap.status.startsWith('open'),
    why:
      'Honest-partial tripwire: this record refines and partially refutes ' +
      'G1-sub-extremal but does NOT close it. The surviving density-form ' +
      'target must stay marked open until a rigorous proof of (D) lands; ' +
      'flipping either status requires that proof in the same commit.',
  },
];
