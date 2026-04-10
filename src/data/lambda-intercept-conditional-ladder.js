/**
 * imp-340: apply the imp-328 conditional framework to the imp-321 log-spaced
 * ladder
 *
 * imp-328 (lambda-intercept-analytic.js) delivered a conditional theorem:
 *
 *   HYPOTHESIS  (monotonicity): |t_c(N+1)| ≤ |t_c(N)| for the backward
 *               Calogero-Moser flow on the first N Riemann zeros, all N ≥ 2.
 *   CONCLUSION: a := lim_{N→∞} |t_c(N)| = inf_N |t_c(N)| ≤ |t_c(N_max)|.
 *
 * On PATH_C_BASELINE_FIT (N_max = 2458) that gave a ≤ 0.0086. The imp-340
 * ticket asks: re-apply the same framework to the imp-321 log-spaced ladder,
 * which reaches N_max = 10^8 instead of 2458. Naively the conditional upper
 * bound would drop by ~(b/2458)/(b/10^8) ≈ 40700× on the slope contribution
 * alone, potentially pushing the conditional UB into a vanishingly thin
 * window above the Rodgers-Tao 0 lower bound.
 *
 * HONEST SCOPE — why the naive "~400× drop" is wrong
 * --------------------------------------------------
 * The rows of PT_SCALE_EXTRAPOLATION.ladder (imp-321 first deliverable) are
 * NOT measured collision times. They are arithmetic projections
 *
 *     projected_tc(N) = OLS_A + OLS_B / N
 *
 * derived from the imp-323 5-point OLS fit. Under the imp-328 monotonicity
 * hypothesis, inf_N projected_tc exists and equals
 *
 *     lim_{N→∞} (OLS_A + OLS_B / N) = OLS_A ≈ 0.0029.
 *
 * So the conditional upper bound on the round-trip ladder is:
 *
 *     a ≤ projected_tc(N_max) = OLS_A + OLS_B / 10^8 ≈ OLS_A + 4.9·10⁻⁸
 *
 * which is still strictly > 0 and in fact is just the OLS central â from
 * imp-323, perturbed by a negligible 1/N_max tail. The numerical drop vs
 * the baseline (0.0086 → ≈ 0.0029) IS a real tightening of the conditional
 * upper bound — from twice-the-OLS to essentially equal-to-the-OLS — but
 * it does NOT push â ≤ 0 and it is NOT a PT-scale statistical improvement:
 * every one of the ladder rows is collinear with the 5-point OLS fit by
 * construction, so the re-application of imp-328 to the ladder contributes
 * no new measured information, and the tightening comes entirely from the
 * asymptotic collapse of a 4.91/N slope contribution as N → ∞.
 *
 * What this file delivers
 * -----------------------
 *
 *   1. The same deriveConditionalUpperBound shape as imp-328, but applied
 *      to the imp-321 ladder instead of PATH_C_BASELINE_FIT.
 *   2. A verdict block that reports BOTH the raw drop (0.0086 → ≈ 0.0029)
 *      AND the honest label that this drop is asymptotic-to-OLS, not
 *      ≤ 0. The verdict explicitly distinguishes "tightened conditional
 *      bound" from "B2(a) closed".
 *   3. A cross-check that inf_N projected_tc equals OLS_A to machine
 *      precision (catches a future corruption of the ladder away from the
 *      round-trip contract).
 *   4. A note spelling out the follow-up contract: when imp-321's
 *      sampled-zero Dyson job fills projected_tc with measured collision
 *      times at each N, this file will AUTOMATICALLY re-evaluate against
 *      the measured values and the conditional upper bound becomes
 *      meaningful — no structural change needed here.
 *
 * This file is the imp-340 analogue of the imp-332 re-fit in
 * lambda-pt-scale-extrapolation.js: both files wire an existing imp-323 /
 * imp-328 instrument to the imp-321 ladder so the verdict updates the
 * moment the ladder becomes measured data.
 */

import { PATH_C_BASELINE_FIT } from '../math/dyson-scaling-N5000.js';
import { PT_SCALE_EXTRAPOLATION } from './lambda-pt-scale-extrapolation.js';
import { LAMBDA_INTERCEPT_CONFIDENCE } from './lambda-intercept-confidence.js';
import { LAMBDA_INTERCEPT_ANALYTIC, CONDITIONAL_UPPER_BOUND } from './lambda-intercept-analytic.js';

// ── Derive the conditional upper bound from any (N, tc) series ──────────────

function deriveConditionalUpperBound(points) {
  if (!Array.isArray(points) || points.length === 0) {
    return { nMax: null, tcAtNMax: null, upperBound: null, monotoneObserved: false, baselineRows: [] };
  }
  const sorted = [...points].sort((a, b) => a.N - b.N);
  let monotoneObserved = true;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].tc > sorted[i - 1].tc) {
      monotoneObserved = false;
      break;
    }
  }
  const last = sorted[sorted.length - 1];
  return {
    nMax: last.N,
    tcAtNMax: last.tc,
    upperBound: last.tc, // a ≤ |t_c(N_max)| under the monotonicity hypothesis
    monotoneObserved,
    baselineRows: sorted.map((p) => ({ N: p.N, tc: p.tc })),
  };
}

// ── Build the ladder-shaped input from imp-321 projected_tc rows ────────────

const LADDER_POINTS = PT_SCALE_EXTRAPOLATION.ladder.map((row) => ({
  N: row.N,
  tc: row.projected_tc,
}));

export const LADDER_CONDITIONAL_UPPER_BOUND = deriveConditionalUpperBound(LADDER_POINTS);

// ── Cross-checks against imp-328 baseline and imp-323 OLS ───────────────────

const OLS_A = LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a;
const OLS_B = LAMBDA_INTERCEPT_CONFIDENCE.fit.slope_b;
const BASELINE_UB = CONDITIONAL_UPPER_BOUND.upperBound; // 0.0086 on PATH_C_BASELINE_FIT
const LADDER_UB = LADDER_CONDITIONAL_UPPER_BOUND.upperBound;
const TIGHTENING_RATIO = BASELINE_UB !== null && LADDER_UB !== null && LADDER_UB > 0
  ? BASELINE_UB / LADDER_UB
  : null;

// Analytic inf of the round-trip ladder: projected_tc(N) = OLS_A + OLS_B/N is
// strictly decreasing in N for OLS_B > 0, so inf over any finite ladder is
// attained at the largest N and equals OLS_A + OLS_B/N_max. The asymptotic
// inf over all N is OLS_A itself.
const ANALYTIC_INF_AT_NMAX = OLS_A + OLS_B / LADDER_CONDITIONAL_UPPER_BOUND.nMax;
const ASYMPTOTIC_INF = OLS_A;
const INF_DRIFT_FROM_OLS = Math.abs(ANALYTIC_INF_AT_NMAX - OLS_A);

// ── The record ──────────────────────────────────────────────────────────────

export const LAMBDA_INTERCEPT_CONDITIONAL_LADDER = {
  id: 'imp-340',
  blocker: 'B2(b)-analytic-intercept-upper-bound (imp-328 conditional, PT-scale application)',
  consumes: [
    'imp-328 — LAMBDA_INTERCEPT_ANALYTIC conditional framework (monotonicity → a = inf_N |t_c(N)|)',
    'imp-321 — PT_SCALE_EXTRAPOLATION.ladder log-spaced N up to 10^8',
    'imp-323 — LAMBDA_INTERCEPT_CONFIDENCE OLS fit constants (OLS_A, OLS_B)',
  ],
  status: 'interim — ladder rows are arithmetic round-trip, so the drop is asymptotic-to-OLS not ≤ 0',
  ladder: {
    nPoints: LADDER_POINTS.length,
    nMin: LADDER_CONDITIONAL_UPPER_BOUND.baselineRows[0]?.N ?? null,
    nMax: LADDER_CONDITIONAL_UPPER_BOUND.nMax,
    tcAtNMax: LADDER_CONDITIONAL_UPPER_BOUND.tcAtNMax,
    monotoneObserved: LADDER_CONDITIONAL_UPPER_BOUND.monotoneObserved,
    rows: LADDER_CONDITIONAL_UPPER_BOUND.baselineRows,
  },
  baseline: {
    source: 'PATH_C_BASELINE_FIT via lambda-intercept-analytic.js',
    nMax: CONDITIONAL_UPPER_BOUND.nMax,
    upperBound: BASELINE_UB,
  },
  tightening: {
    baselineUpperBound: BASELINE_UB,
    ladderUpperBound: LADDER_UB,
    tighteningRatio: TIGHTENING_RATIO,
    note:
      'Ratio = baselineUB / ladderUB. Real as a number, but it comes entirely ' +
      'from (OLS_A + OLS_B/2458) → (OLS_A + OLS_B/N_max) as N_max grows: the ' +
      'slope contribution collapses and the conditional UB converges to OLS_A.',
  },
  roundTripSanity: {
    ols_A: OLS_A,
    ols_B: OLS_B,
    analyticInfAtNMax: ANALYTIC_INF_AT_NMAX,
    asymptoticInf: ASYMPTOTIC_INF,
    infDriftFromOLS: INF_DRIFT_FROM_OLS,
    note:
      'inf_N (OLS_A + OLS_B/N) over the finite ladder is attained at N_max ' +
      'and equals OLS_A + OLS_B/N_max. The ladder UB must match this exactly ' +
      '(to machine precision) because the ladder rows ARE that formula. A ' +
      'drift here means the imp-321 projection has been corrupted.',
  },
  verdict: {
    conditionalUpperBound: LADDER_UB,
    onesidedClosureAtZero: LADDER_UB !== null && LADDER_UB <= 0,
    headline:
      LADDER_UB !== null && LADDER_UB <= 0
        ? 'B2(a) CLOSED at PT-scale under the imp-328 monotonicity hypothesis: ' +
          'conditional upper bound on a is ≤ 0 on the imp-321 log-spaced ladder. ' +
          'Update lambda-zero-attack.js LAMBDA_ZERO_CLOSURE and bridge-lambda-rh.js ' +
          'remainingSteps in the same commit.'
        : 'Conditional upper bound TIGHTENED from ' +
          (BASELINE_UB !== null ? BASELINE_UB.toFixed(6) : 'n/a') +
          ' (baseline N_max = ' + CONDITIONAL_UPPER_BOUND.nMax + ') to ' +
          (LADDER_UB !== null ? LADDER_UB.toFixed(8) : 'n/a') +
          ' (ladder N_max = ' + LADDER_CONDITIONAL_UPPER_BOUND.nMax + '), a ' +
          (TIGHTENING_RATIO !== null ? TIGHTENING_RATIO.toFixed(0) + '×' : 'n/a') +
          ' factor. HONEST CAVEAT: the ladder rows are the arithmetic round-trip ' +
          'projected_tc = OLS_A + OLS_B/N of the imp-323 OLS fit, so the ' +
          'tightening IS the asymptotic collapse of OLS_B/N_max as N_max grows ' +
          'and converges to OLS_A ≈ ' + OLS_A.toFixed(6) + ' — NOT a new piece of ' +
          'measured information. The conditional UB remains strictly > 0 at this ' +
          'N_max. The application becomes meaningful the moment imp-321 follow-up ' +
          'replaces projected_tc with a measured sampled-zero Dyson collision time ' +
          'at each N; at that point inf_N |t_c(N)| is a genuine measurement and ' +
          'this file re-evaluates automatically.',
  },
  openWork: [
    'imp-321 follow-up: sampled-zero Dyson measurement at each ladder N (replaces projected_tc).',
    'Prove/refute the imp-328 monotonicity hypothesis (also required to make the conditional unconditional).',
  ],
  consumesAnalyticId: LAMBDA_INTERCEPT_ANALYTIC.id,
};

// ── Build-time assertions ───────────────────────────────────────────────────

export const LAMBDA_INTERCEPT_CONDITIONAL_LADDER_ASSERTIONS = [
  {
    id: 'imp340-ladder-monotone-observed',
    holds: () => LADDER_CONDITIONAL_UPPER_BOUND.monotoneObserved === true,
    why:
      'The imp-328 conditional a ≤ inf_N |t_c(N)| requires |t_c(N)| monotone ' +
      'non-increasing in N on the input series. The imp-321 projected ladder ' +
      'is strictly decreasing by construction (b > 0); this assertion catches ' +
      'a future edit that inserts a non-monotone row and would silently ' +
      'invalidate the conditional bound.',
  },
  {
    id: 'imp340-ladder-ub-matches-round-trip-analytic-inf',
    holds: () =>
      LADDER_UB !== null &&
      Math.abs(LADDER_UB - ANALYTIC_INF_AT_NMAX) < 1e-12,
    why:
      'On the round-trip ladder, LADDER_UB must equal OLS_A + OLS_B/N_max to ' +
      'machine precision. Drift means projected_tc has decoupled from the OLS ' +
      'fit constants — i.e. the ladder has been corrupted or the single ' +
      'source of truth for (a, b) has moved without updating imp-321.',
  },
  {
    id: 'imp340-ladder-ub-is-tighter-than-baseline-ub',
    holds: () =>
      LADDER_UB !== null &&
      BASELINE_UB !== null &&
      LADDER_UB < BASELINE_UB,
    why:
      'Extending N_max from 2458 to 10^8 must shrink the conditional upper ' +
      'bound (since b > 0, adding larger N can only lower the inf). If this ' +
      'fails, either the ladder has been shortened below the baseline N_max ' +
      'or the fit constants have been corrupted.',
  },
  {
    id: 'imp340-ladder-ub-still-strictly-positive',
    holds: () =>
      LADDER_UB !== null &&
      LADDER_UB > 0 &&
      LAMBDA_INTERCEPT_CONDITIONAL_LADDER.verdict.onesidedClosureAtZero === false,
    why:
      'The tripwire: the round-trip ladder CANNOT legitimately drive the ' +
      'conditional upper bound ≤ 0, because its asymptotic limit is OLS_A ' +
      '≈ +0.0029 > 0. If this assertion ever flips, the ladder must be ' +
      'carrying genuine measured data, in which case lambda-zero-attack.js ' +
      'LAMBDA_ZERO_CLOSURE, bridge-lambda-rh.js remainingSteps, and the ' +
      'verdicts in lambda-intercept-analytic.js / lambda-intercept-confidence.js / ' +
      'lambda-intercept-pooled.js MUST be updated in the same commit.',
  },
  {
    id: 'imp340-consumes-imp328-analytic-record',
    holds: () => LAMBDA_INTERCEPT_ANALYTIC.id === 'imp-328',
    why:
      'imp-340 is the PT-scale re-application of the imp-328 conditional ' +
      'framework. If the imp-328 id changes without updating this file, the ' +
      'citation chain breaks silently; this assertion is the tripwire.',
  },
];

// Suppress unused-import lint for PATH_C_BASELINE_FIT: the symbol is imported
// so the file can be read as the canonical source of the baseline alongside
// imp-328's own import, making the provenance of BASELINE_UB explicit at the
// top of the file. Referenced here once to keep bundlers from tree-shaking
// the provenance link out of the file's dependency graph.
export const IMP340_BASELINE_PROVENANCE = {
  path_c_baseline_fit_length: PATH_C_BASELINE_FIT.length,
  path_c_baseline_nmax: CONDITIONAL_UPPER_BOUND.nMax,
  note:
    'Explicit provenance: imp-340 consumes the same PATH_C_BASELINE_FIT that ' +
    'imp-328 uses for its baseline conditional UB, so the baseline vs ladder ' +
    'comparison is against the same source of truth.',
};
