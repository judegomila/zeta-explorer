/**
 * imp-409: Route A closure attempt — monotonicity (M) re-evaluated on
 * the 35-point measured Dyson ladder (imp-360 / imp-405)
 *
 * Background
 * ----------
 * imp-336 (lambda-intercept-monotonicity.js) ships the monotonicity
 * conjecture
 *
 *     (M)  |t_c(N+1)| <= |t_c(N)|   for all N >= 2,
 *
 * empirically verified at 5 PATH_C_BASELINE_FIT anchors with an analytic
 * sketch that has two open sub-gaps:
 *
 *   (G1) k*_N interior with uniform margin — imp-368 partial closure.
 *   (G2) Argmin jumps between N and N+1 — imp-369 CLOSED at tau = 0
 *        via Cauchy interlacing.
 *
 * imp-405 extended the measured Dyson ladder (DYSON_LADDER_MEASURED) to
 * N = 100000 with 35 measured data points. imp-409 re-evaluates (M) on
 * that strengthened empirical base and combines the result with the
 * imp-368/369 analytical sub-gap closures to determine the SINGLE
 * remaining analytical step for Route A.
 *
 * Monotonicity check on the measured ladder
 * -----------------------------------------
 * For each measured row we have:
 *   - t_c_lo : certified lower bound on |t_c(N)| (always finite and > 0)
 *   - t_c_hi : certified upper bound (may be +Infinity if budget-exhausted)
 *   - projectedFromOls: OLS point estimate a + b/N
 *
 * The OLS point estimate is a + b/N with b > 0 and hence strictly
 * decreasing in N — tautologically consistent with (M). The non-trivial
 * checks are:
 *
 *   (LO-CHECK) t_c_lo(N+1) <= t_c_lo(N) for all consecutive measured
 *              pairs. A violation here does NOT prove (M) fails (because
 *              the true t_c(N+1) could be anywhere in [t_c_lo(N+1), +inf]),
 *              but it WOULD be anomalous.
 *
 *   (CERT-VIOL) t_c_lo(N+1) > t_c_hi(N) with both bounds finite. This
 *               would be a certified counterexample to (M). Impossible
 *               for budget-exhausted rows (t_c_hi = +Infinity) but
 *               possible for small N where both bounds are finite.
 *
 * Route A status after imp-368 and imp-369
 * -----------------------------------------
 * After G2 closure at tau = 0 (imp-369) and G1 trivial unconditional bound
 * (imp-368), the imp-336 sketch reduces to one open research statement:
 *
 *   REMAINING GAP: G1-sub-extremal — the minimum gap site k*_N concentrates
 *   in the index bulk W(alpha, N) = { k : alpha*N <= k <= (1-alpha)*N }
 *   for some fixed alpha in (0, 1/2). This is the G1 content that imp-368
 *   closes only CONDITIONALLY (under the Ben Arous-Bourgade bulk-confinement
 *   premise for GUE, conjectural for Riemann zeros via Montgomery 1973).
 *   It is IDENTICAL to the imp-343 residualSubGap.G4a_bulk_confinement clause.
 *
 *   If G1-sub-extremal is closed, the chain becomes:
 *     imp-322 (B non-increasing under backward flow)
 *     + G1-sub-extremal (argmin interior with uniform margin)
 *     + G2-at-tau-0 (interlacing, imp-369)
 *     + imp-336 drift-sign sketch (tau > 0 propagation)
 *     => (M) proved => imp-328 conditional a <= 0.0086 upgrades to
 *        unconditional via Route A, independent of Route B.
 */

import { DYSON_LADDER_MEASURED } from './dyson-ladder-measured.js';
import { LAMBDA_ARGMIN_INTERIORITY } from './lambda-argmin-interiority.js';
import { LAMBDA_ARGMIN_JUMPS } from './lambda-argmin-jumps.js';
import { LAMBDA_INTERCEPT_MONOTONICITY } from './lambda-intercept-monotonicity.js';

// ── Measured rows sorted by N ─────────────────────────────────────────────────

const MEASURED_ROWS = DYSON_LADDER_MEASURED.rows
  .filter((r) => r.source === 'measured')
  .sort((a, b) => a.N - b.N);

// ── Monotonicity check on consecutive measured pairs ─────────────────────────

function checkPair(prev, curr) {
  // Point-estimate monotonicity: OLS projection a + b/N is tautologically
  // decreasing for b > 0, but we record it for completeness.
  const olsMonotone = curr.projectedFromOls <= prev.projectedFromOls;
  const olsDrop = prev.projectedFromOls - curr.projectedFromOls;
  const olsRatio =
    prev.projectedFromOls > 0 ? curr.projectedFromOls / prev.projectedFromOls : null;

  // Lower-bound monotonicity: are the certified lower bounds also decreasing?
  // A "no" here is anomalous but NOT a certified falsification of (M).
  const loFinite =
    typeof curr.t_c_lo === 'number' &&
    Number.isFinite(curr.t_c_lo) &&
    typeof prev.t_c_lo === 'number' &&
    Number.isFinite(prev.t_c_lo);
  const loMonotone = loFinite ? curr.t_c_lo <= prev.t_c_lo + 1e-9 : null;

  // Certified violation: t_c_lo(N') > t_c_hi(N) with both bounds finite.
  // This would certifiably falsify (M) for this pair.
  const hiPrevFinite =
    typeof prev.t_c_hi === 'number' && Number.isFinite(prev.t_c_hi);
  const certifiedViolation =
    loFinite && hiPrevFinite && curr.t_c_lo > prev.t_c_hi;

  return {
    N_from: prev.N,
    N_to: curr.N,
    tc_lo_from: prev.t_c_lo,
    tc_hi_from: hiPrevFinite ? prev.t_c_hi : '+Inf',
    tc_lo_to: curr.t_c_lo,
    tc_hi_to:
      typeof curr.t_c_hi === 'number' && Number.isFinite(curr.t_c_hi)
        ? curr.t_c_hi
        : '+Inf',
    ols_from: prev.projectedFromOls,
    ols_to: curr.projectedFromOls,
    olsMonotone,
    olsDrop: typeof olsDrop === 'number' ? +olsDrop.toFixed(8) : null,
    olsRatio: olsRatio !== null ? +olsRatio.toFixed(6) : null,
    loMonotone,
    certifiedViolation,
  };
}

const CONSECUTIVE_CHECKS = [];
for (let i = 1; i < MEASURED_ROWS.length; i++) {
  CONSECUTIVE_CHECKS.push(checkPair(MEASURED_ROWS[i - 1], MEASURED_ROWS[i]));
}

const OLS_ALL_MONOTONE = CONSECUTIVE_CHECKS.every((r) => r.olsMonotone);
const LO_ALL_MONOTONE = CONSECUTIVE_CHECKS.every(
  (r) => r.loMonotone === null || r.loMonotone === true,
);
const ANY_CERTIFIED_VIOLATION = CONSECUTIVE_CHECKS.some((r) => r.certifiedViolation);
const N_PAIRS = CONSECUTIVE_CHECKS.length;

// ── Confidence interval: distribution of OLS consecutive drops ───────────────

const OLS_DROPS = CONSECUTIVE_CHECKS.map((r) => r.olsDrop ?? 0);
const DROP_MIN = OLS_DROPS.reduce((m, x) => Math.min(m, x), Infinity);
const DROP_MAX = OLS_DROPS.reduce((m, x) => Math.max(m, x), -Infinity);
const DROP_MEAN = OLS_DROPS.reduce((s, x) => s + x, 0) / OLS_DROPS.length;
const DROP_VAR =
  OLS_DROPS.reduce((s, x) => s + (x - DROP_MEAN) ** 2, 0) / OLS_DROPS.length;

const DROP_STATS = {
  n: N_PAIRS,
  minDrop: +DROP_MIN.toFixed(9),
  maxDrop: +DROP_MAX.toFixed(9),
  meanDrop: +DROP_MEAN.toFixed(9),
  stdDrop: +Math.sqrt(DROP_VAR).toFixed(9),
  allPositive: DROP_MIN > 0,
  caveat:
    'OLS drops are arithmetic (a + b/N is decreasing for b > 0) and are not ' +
    'independent empirical measurements. The non-trivial evidence is the ' +
    'lower-bound monotonicity (loMonotone) on the certified interval bounds.',
};

// ── Route A sub-gap status summary after imp-368 and imp-369 ─────────────────

const ROUTE_A_STATUS = {
  G2: {
    id: 'G2',
    status: 'closed at tau = 0',
    closedBy: 'imp-369 (lambda-argmin-jumps.js)',
    method:
      'Cauchy-interlacing corollary: B_{N+1}(0) = min(B_N(0), g_N) <= B_N(0) ' +
      'unconditionally for any strictly ordered sequence of zeros.',
    openRemainder:
      'tau > 0 propagation through the Calogero-Moser backward flow; requires ' +
      'G1 closure and the imp-336 drift-sign argument.',
  },
  G1: {
    id: 'G1',
    status: 'partial — trivial unconditional bound, conditional uniform margin',
    closedBy: 'imp-368 (lambda-argmin-interiority.js)',
    unconditionalContent:
      'k*_N in {1, ..., N-1} by definition of the gap list (trivial, margin 1/N -> 0)',
    conditionalContent:
      'alpha*N <= k*_N <= (1-alpha)*N for any alpha in (0, 1/2), conditional on G1-sub-extremal',
    openSubGap: {
      id: 'G1-sub-extremal',
      equivalentTo: 'imp-343 residualSubGap.G4a_bulk_confinement',
      statement:
        'The minimum gap site k*_N of the first N Riemann zeros concentrates ' +
        'in the index bulk W(alpha, N) = { k : alpha*N <= k <= (1-alpha)*N } ' +
        'for every alpha in (0, 1/2). Known unconditionally for GUE ' +
        '(Ben Arous-Bourgade 2013); conjectural for Riemann zeros via ' +
        'Montgomery 1973 pair-correlation hypothesis.',
      status:
        'open — conditional on GUE pair-correlation / Ben Arous-Bourgade port ' +
        'to Riemann zeros',
    },
  },
};

// ── Single remaining step for Route A full closure ───────────────────────────

const SINGLE_REMAINING_STEP = {
  id: 'G1-sub-extremal',
  statement:
    'Prove that the minimum gap site k*_N of the first N Riemann zeros ' +
    'concentrates in the bulk W(alpha, N) for some fixed alpha > 0. ' +
    'Closing this sub-gap together with imp-369 G2 and the imp-336 ' +
    'drift-sign sketch (tau > 0 propagation) upgrades the imp-328 ' +
    'conditional a <= 0.0086 to UNCONDITIONAL via Route A, independent ' +
    'of Route B (Burgers + G6 bridge).',
  currentStatus:
    'Open. imp-368 supplies the conditional uniform margin under ' +
    'G1-sub-extremal, identical to imp-343 G4a_bulk_confinement. No ' +
    'unconditional proof exists for Riemann zeros.',
  ifClosed:
    'Route A chain: imp-322 (B non-increasing under backward flow) ' +
    '+ G1-sub-extremal (argmin interior with uniform margin c > 0) ' +
    '+ imp-369 G2 at tau = 0 (Cauchy interlacing) ' +
    '+ imp-336 drift-sign sketch (tau > 0 propagation) ' +
    '=> (M) proved => imp-328 conditional upgrades to unconditional.',
  approachSuggestions: [
    'Port Ben Arous-Bourgade 2013 extremal-gap concentration from GUE to the ' +
      'Riemann zeros using a rigidity estimate (e.g. Selberg CLT + discrepancy).',
    'Derive a direct bulk-confinement bound from Riemann-von Mangoldt ' +
      'zero-density discrepancy: if D_N*(T) <= C * log(T) / N, then the ' +
      'minimum gap site stays in the bulk with high probability.',
    'Use the imp-348 / imp-407 ESY rigidity framework (conditional on GUE) to ' +
      'derive bulk-confinement as a corollary of the O(1/N) discrepancy bound.',
  ],
};

// ── Combined verdict ──────────────────────────────────────────────────────────

const VERDICT = {
  empiricalMonotonicity: {
    olsAllMonotone: OLS_ALL_MONOTONE,
    loAllMonotone: LO_ALL_MONOTONE,
    anyCertifiedViolation: ANY_CERTIFIED_VIOLATION,
    nPairsChecked: N_PAIRS,
    nMeasuredRows: MEASURED_ROWS.length,
    oldBaselineSize: 5,
    strengthening:
      'From 5 sampled anchors (imp-336 original) to ' +
      MEASURED_ROWS.length +
      ' measured N-values (imp-360 / imp-405), spanning N in [' +
      (MEASURED_ROWS[0]?.N ?? '?') +
      ', ' +
      (MEASURED_ROWS[MEASURED_ROWS.length - 1]?.N ?? '?') +
      ']. Each row is produced by the imp-362 interval-arithmetic ' +
      'backward RK4 integrator on the imp-359 ZEROS_EXTENDED table.',
    note:
      'OLS monotonicity is tautological (b > 0 by construction). The non-trivial ' +
      'check is loAllMonotone: every certified lower bound t_c_lo(N+1) is no ' +
      'greater than t_c_lo(N). A certifiedViolation (t_c_lo(N+1) > t_c_hi(N) ' +
      'with both finite) would falsify (M); none found.',
  },
  routeAStatus: ROUTE_A_STATUS,
  singleRemainingStep: SINGLE_REMAINING_STEP,
  headline: ANY_CERTIFIED_VIOLATION
    ? 'ROUTE A ALERT: certified violation of (M) found on the measured ladder. ' +
      'Route A analysis requires revisiting imp-336, imp-368, imp-369.'
    : LO_ALL_MONOTONE
    ? 'ROUTE A EMPIRICALLY STRONG: all ' +
      N_PAIRS +
      ' consecutive measured pairs satisfy t_c_lo(N+1) <= t_c_lo(N). ' +
      'The SINGLE remaining analytical step is G1-sub-extremal (bulk-' +
      'confinement of the argmin site), equivalent to imp-343 G4a_bulk_confinement. ' +
      'Route A reduces to one open research statement.'
    : 'ROUTE A OLS MONOTONE (tautological) but some certified lower bounds are ' +
      'non-monotone across consecutive pairs. This is consistent with the interval ' +
      'integrator budget variation across N and does not falsify (M), but reduces ' +
      'the empirical strength of the ladder evidence.',
};

// ── The record ────────────────────────────────────────────────────────────────

export const IMP336_POST_LADDER_UPDATE = {
  id: 'imp-409',
  title:
    'Route A closure attempt: imp-336 monotonicity re-evaluated on ' +
    MEASURED_ROWS.length +
    '-point measured Dyson ladder',
  status:
    'partial — (M) empirically unfalsified on ' +
    MEASURED_ROWS.length +
    '-point measured ladder; single analytical gap G1-sub-extremal remains',
  consumes: [
    'imp-360/imp-405 DYSON_LADDER_MEASURED (dyson-ladder-measured.js) — ' +
      MEASURED_ROWS.length +
      '-point measured Dyson backward ladder',
    'imp-368 LAMBDA_ARGMIN_INTERIORITY (lambda-argmin-interiority.js) — G1 partial closure',
    'imp-369 LAMBDA_ARGMIN_JUMPS (lambda-argmin-jumps.js) — G2 closure at tau = 0',
    'imp-336 LAMBDA_INTERCEPT_MONOTONICITY (lambda-intercept-monotonicity.js) — parent (M) record',
  ],
  measuredLadder: {
    nPoints: MEASURED_ROWS.length,
    nMin: MEASURED_ROWS[0]?.N ?? null,
    nMax: MEASURED_ROWS[MEASURED_ROWS.length - 1]?.N ?? null,
    source: 'DYSON_LADDER_MEASURED.rows filtered to source = measured',
  },
  consecutiveChecks: CONSECUTIVE_CHECKS,
  dropStats: DROP_STATS,
  verdict: VERDICT,
  openWork: [
    'Close G1-sub-extremal (= imp-343 G4a_bulk_confinement): bulk-confinement ' +
      'of the minimum gap site under GUE statistics, ported to Riemann zeros.',
    'Assemble the full Route A closure ticket: chain G1-sub-extremal + imp-369 ' +
      'G2 + imp-322 B-monotonicity + imp-336 drift-sign sketch into a coordinated ' +
      'flip of the imp-336 ANALYTIC_SKETCH.gaps (G1, G2) statuses from open to closed.',
    'Replace projected rows in DYSON_LADDER_MEASURED beyond N = 10^5 with measured ' +
      'runs to extend the empirical ladder to the Platt-Trudgian height T = 3e10.',
  ],
};

// ── Build-time assertions ─────────────────────────────────────────────────────

export const IMP336_POST_LADDER_UPDATE_ASSERTIONS = [
  {
    id: 'imp409-measured-ladder-non-empty',
    holds: () => MEASURED_ROWS.length >= 30,
    why:
      'The measured ladder must have at least 30 rows (imp-360 baseline up to ' +
      'N = 25000). If it shrinks below 30 rows then imp-405 has been partially ' +
      'reverted and the strengthened empirical base claimed by imp-409 is no ' +
      'longer present.',
  },
  {
    id: 'imp409-ols-monotone-on-full-ladder',
    holds: () => OLS_ALL_MONOTONE,
    why:
      'OLS projections are a + b/N with b > 0; they must be strictly decreasing ' +
      'in N across all consecutive measured pairs. A failure means the OLS slope ' +
      'b has become non-positive, which would imply the intercept a exceeds the ' +
      'OLS projection at current N_max — inconsistent with a positive-slope 1/N fit.',
  },
  {
    id: 'imp409-no-certified-violation-of-M',
    holds: () => !ANY_CERTIFIED_VIOLATION,
    why:
      'A certified violation t_c_lo(N+1) > t_c_hi(N) (both finite) is a ' +
      'counterexample to the monotonicity conjecture (M). If this fires, Route A ' +
      'is REFUTED on the measured ladder and imp-336 ANALYTIC_SKETCH must be ' +
      'updated to replace the analytic sketch with a falsification record. The ' +
      'imp-328 conditional upper bound a <= 0.0086 would be invalidated.',
  },
  {
    id: 'imp409-cites-imp368-imp369-imp336',
    holds: () =>
      LAMBDA_ARGMIN_INTERIORITY.id === 'imp-368' &&
      LAMBDA_ARGMIN_JUMPS.id === 'imp-369' &&
      LAMBDA_INTERCEPT_MONOTONICITY.id === 'imp-336',
    why:
      'imp-409 cites imp-368 (G1 partial closure), imp-369 (G2 tau=0 closure), ' +
      'and imp-336 (the parent monotonicity record). Drifting any of these ids ' +
      'would strand the citation chain.',
  },
  {
    id: 'imp409-single-remaining-step-identified',
    holds: () =>
      SINGLE_REMAINING_STEP.id === 'G1-sub-extremal' &&
      SINGLE_REMAINING_STEP.currentStatus.startsWith('Open'),
    why:
      'Route A currently reduces to G1-sub-extremal as the single remaining ' +
      'analytical step. If a future commit closes G1-sub-extremal, this assertion ' +
      'must be updated in the same commit together with the coordinated flip of ' +
      'imp-336 ANALYTIC_SKETCH.gaps, imp-368, imp-369, lambda-intercept-analytic.js, ' +
      'bridge-lambda-rh.js, and lambda-zero-attack.js.',
  },
];
