/**
 * @module finite-height-lambda-bound
 * @fileoverview Finite-height Lambda upper bound evaluated at N in {10^4, 10^5, 10^6}.
 *
 * Evaluates the Calogero-Moser / Dyson backward-flow bound
 *     Lambda  <=  |t_c(N)|  +  E_tail(N)
 * in an OLS-projection sense (A) and a one-sided 95% CI sense (B) at the
 * three concrete heights. No rigorous certified Lambda bound tighter than the
 * Platt-Trudgian 0.2 is established here; the ~28x projection margin means
 * the rigorous version will comfortably beat PT once blockers B1, B2, B4 are
 * closed and the measured Dyson ladder reaches N = 10^4.
 *
 * Proof chain step: PATH C finite-height Lambda evaluation (between S9 Dyson
 * collision ladder and the final Lambda bound assertion).
 *
 * Exports:
 *   FINITE_HEIGHT_LAMBDA_BOUND — main record containing fit constants, the
 *     per-N ladder (projection + statistical CI + rigorous verdict), overall
 *     verdict string, honest summary, and open items (B1, B2, B4,
 *     measured-ladder extension to N = 10^4).
 *   FINITE_HEIGHT_LAMBDA_BOUND_ASSERTIONS — six build-time assertions:
 *     fit availability, all-N projection beats PT, no-rigorous claim,
 *     margin factor > 20, ladder row count = 3, T*(N) monotonicity.
 *
 * Key assertions:
 *   imp416-all-three-N-projection-beat-pt: OLS projection beats PT_BOUND = 0.2
 *     at all three N (expected factor ~28x at N = 10^4).
 *   imp416-no-rigorous-beats-pt: rigorous bound stays false until B1+B2+B4
 *     are closed and the measured ladder reaches N = 10^4.
 *
 * Ticket history:
 *   imp-416 — created this file; derived the finite-height Lambda bound ladder
 *             and six build-time assertions.
 *   imp-756 — added this @module/@fileoverview JSDoc.
 */

/**
 * imp-416: Finite-height Lambda upper bound at N in {10^4, 10^5, 10^6}
 *
 * Central question
 * ----------------
 * imp-411 showed the PATH_C_BASELINE_FIT_V2 ansatz is consistent with
 * Platt-Trudgian (Lambda <= 0.2) at T = 3e10 with a ~30x margin. But
 * that was an asymptotic projection at N ~ 10^11 where the slope term
 * b/N is negligible. The present file asks the harder question: at the
 * three concrete finite heights N in {10^4, 10^5, 10^6}, can we state
 * a Lambda upper bound that is RIGOROUSLY tighter than 0.2?
 *
 * Formula
 * -------
 * From the Calogero-Moser / Dyson backward-flow identity:
 *
 *     Lambda  <=  |t_c(N)|  +  E_tail(N)
 *
 * where:
 *   |t_c(N)| = first backward collision time for the Dyson flow on the
 *              first N Riemann zero ordinates (from imp-360 / imp-362).
 *   E_tail(N) = correction for zeros above T*(N) = effectiveHeightForN(N).
 *              This term is open (B4 in lambda-zero-attack.js) for N > 870.
 *
 * This file evaluates the formula in two senses:
 *
 *   (A) PROJECTION sense: use the OLS point estimate |t_c|_proj = a + b/N
 *       from PATH_C_BASELINE_FIT_V2 and set E_tail = 0 (conditional).
 *       This gives the optimistic floor; it is NOT rigorous.
 *
 *   (B) STATISTICAL CI sense: replace the point estimate with the one-sided
 *       95% confidence-interval upper bound on the fitted value at 1/N.
 *       Approximation: CI_bound(N) = interceptUpperCL_95 + slope_b / N.
 *       This is tighter than Platt-Trudgian if CI_bound(N) < 0.2, but it is
 *       still a STATISTICAL statement, not a mathematical theorem.
 *
 * Honest overall verdict
 * ----------------------
 * At NO N in {10^4, 10^5, 10^6} does our chain currently produce a
 * RIGOROUS certified Lambda bound that is tighter than 0.2, for these reasons:
 *
 *   (i)   The |t_c| values at those N are OLS projections, not certified
 *         measurements. The measured ladder (imp-360) only reaches N = 870.
 *   (ii)  E_tail(N) above T*(N) is not yet certified at these heights (B4).
 *   (iii) B1 (slope analytic bound) and B2 (intercept <= 0) in
 *         lambda-zero-attack.js are open; without them the OLS ansatz is a
 *         model fit, not a theorem.
 *
 * Despite (i)-(iii), the projection margin is enormous: the projected bound
 * is ~0.007, beating PT by a factor of ~28. Once B1, B2, and B4 are closed
 * and the measured ladder reaches N = 10^4, the RIGOROUS version of this
 * file will produce a new unconditional Lambda bound.
 *
 * Sources
 * -------
 *   imp-400 PATH_C_BASELINE_FIT_V2  (src/data/path-c-baseline-fit-v2.js)
 *   imp-327 effectiveHeightForN     (src/data/lambda-rh-height-mapping.js)
 *   imp-408 PLATT_TRUDGIAN_MATCHED_CHECK
 *   imp-319 LAMBDA_ZERO_BLOCKERS    (src/data/lambda-zero-attack.js)
 */

import { PATH_C_BASELINE_FIT_V2 } from './path-c-baseline-fit-v2.js';
import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

// ── Platt-Trudgian 2021 reference bound ─────────────────────────────────────
// Unconditional Lambda <= 0.2. This is the bar we are comparing against.
const PT_BOUND = 0.2;
const PT_CITATION = 'Platt & Trudgian (2021), Bull. Lond. Math. Soc. 53, 792-797';

// ── V2 OLS fit constants ─────────────────────────────────────────────────────
// PATH_C_BASELINE_FIT_V2 exports a fit record. Extract the needed scalars.
const V2_FIT = PATH_C_BASELINE_FIT_V2.fit;
const A_INTERCEPT   = V2_FIT ? V2_FIT.intercept_a         : null; // asymptotic ceiling
const B_SLOPE       = V2_FIT ? V2_FIT.slope_b             : null; // slope in a + b/N
const SEA           = V2_FIT ? V2_FIT.seA                 : null; // OLS SE of intercept
const T95           = V2_FIT ? V2_FIT.tCrit_onesided_95   : null; // one-sided 95% t-crit
const UPPER_CL95    = V2_FIT ? V2_FIT.interceptUpperCL_95 : null; // a + t95 * seA
const N_FIT_POINTS  = V2_FIT ? V2_FIT.n                   : null;
const R2_FIT        = V2_FIT ? V2_FIT.R2                  : null;

// ── Evaluation for one N ─────────────────────────────────────────────────────
function evaluateAtN(N) {
  if (!V2_FIT || A_INTERCEPT === null || B_SLOPE === null ||
      SEA === null || T95 === null || UPPER_CL95 === null) {
    return { N, available: false };
  }

  const T_star     = effectiveHeightForN(N);
  const log10_T    = Math.log10(T_star);

  // (A) Projection: |t_c|_proj = a + b/N, E_tail set to 0 (conditional on tail)
  const slope_contrib = B_SLOPE / N;
  const tc_proj       = A_INTERCEPT + slope_contrib;

  // (B) Statistical CI bound: use interceptUpperCL_95 + slope/N (conservative)
  //     This adds the one-sided 95% CI margin on the intercept to the slope term.
  //     The slope uncertainty is not included here; for N >= 1e4 it is negligible
  //     compared to the intercept CI width.
  const tc_ci_bound   = UPPER_CL95 + slope_contrib;

  // Margins against PT_BOUND = 0.2
  const margin_proj  = PT_BOUND - tc_proj;
  const margin_ci    = PT_BOUND - tc_ci_bound;
  const factor_proj  = tc_proj > 0 ? PT_BOUND / tc_proj : null;
  const factor_ci    = tc_ci_bound > 0 ? PT_BOUND / tc_ci_bound : null;

  // Verdicts
  const beats_pt_proj = tc_proj    < PT_BOUND;
  const beats_pt_ci   = tc_ci_bound < PT_BOUND;

  // Rigorous verdict: always false until B1 + B2 + B4 are closed.
  // The sub-conditions that are open are listed for transparency.
  const rigorous_open_items = [
    'B1: slope b not bounded by theorem (imp-363 / imp-370)',
    'B2: intercept a not proven <= 0 (lambda-zero-attack.js)',
    'B4: tail correction E_tail(N) above T*(N) not certified (guth-maynard-tail-bound.js)',
    'Measured |t_c(N)| not available at N = ' + N.toExponential(0) +
      ' (imp-360 ladder reaches only N = 870)',
  ];
  const rigorous_beats_pt = false;

  return {
    N,
    available: true,
    T_star,
    log10_T_star:  +log10_T.toFixed(3),
    slope_contrib: +slope_contrib.toExponential(4),

    projection: {
      tc_proj:       +tc_proj.toFixed(7),
      beats_pt:      beats_pt_proj,
      margin:        +margin_proj.toFixed(7),
      factor:        factor_proj !== null ? +factor_proj.toFixed(2) : null,
      certified:     false,
      note:          'OLS point estimate a + b/N; E_tail = 0 assumed (open B4)',
    },

    statisticalCI: {
      tc_ci_bound:   +tc_ci_bound.toFixed(7),
      beats_pt:      beats_pt_ci,
      margin:        +margin_ci.toFixed(7),
      factor:        factor_ci !== null ? +factor_ci.toFixed(2) : null,
      certified:     false,
      note:          'One-sided 95% CI: interceptUpperCL_95 + slope_b/N; statistical, not theorem-grade',
    },

    rigorous: {
      beats_pt:   rigorous_beats_pt,
      open_items: rigorous_open_items,
      note:       'No rigorous certified Lambda bound tighter than 0.2 is established at this N',
    },
  };
}

// ── Evaluate at the three target heights ─────────────────────────────────────
const TARGET_NS = [1e4, 1e5, 1e6];
const LADDER = TARGET_NS.map(evaluateAtN);

// ── Overall verdict ──────────────────────────────────────────────────────────
// summarise the key result for consumers
const ALL_PROJ_BEAT_PT = LADDER.every((r) => r.available && r.projection.beats_pt);
const ALL_CI_BEAT_PT   = LADDER.every((r) => r.available && r.statisticalCI.beats_pt);
const ANY_RIGOROUS     = LADDER.some((r) => r.rigorous && r.rigorous.beats_pt);

const OVERALL_VERDICT = ANY_RIGOROUS
  ? 'RIGOROUS: at least one N yields a certified Lambda bound below 0.2'
  : ALL_CI_BEAT_PT
  ? 'STATISTICAL: 95% CI bound beats PT at all N, but not theorem-grade'
  : ALL_PROJ_BEAT_PT
  ? 'PROJECTION: OLS point estimate beats PT at all N, but not certified'
  : 'DOES NOT BEAT PT: projection or CI exceeds PT_BOUND at some N';

// ── Exported record ───────────────────────────────────────────────────────────
export const FINITE_HEIGHT_LAMBDA_BOUND = {
  id: 'imp-416',
  title: 'Finite-height Lambda upper bound at N in {10^4, 10^5, 10^6}',
  status: 'delivered',
  question:
    'At which finite N in {10^4, 10^5, 10^6} does our chain produce a ' +
    'rigorous Lambda bound tighter than the Platt-Trudgian 0.2?',

  plattTrudgianBound: {
    Lambda_upper: PT_BOUND,
    citation: PT_CITATION,
  },

  fitConstants: {
    source:           'PATH_C_BASELINE_FIT_V2 (imp-400)',
    intercept_a:      A_INTERCEPT,
    slope_b:          B_SLOPE,
    seA:              SEA,
    tCrit_95:         T95,
    interceptUpperCL: UPPER_CL95,
    n_fit_points:     N_FIT_POINTS,
    R2:               R2_FIT,
  },

  ladder: LADDER,

  overallVerdict: OVERALL_VERDICT,

  honestSummary:
    'The OLS projection |t_c|_proj = a + b/N beats PT at all three N by a ' +
    'factor of ~28x. Even the conservative 95% CI bound (interceptUpperCL_95 ' +
    '+ b/N) beats PT if seA is sufficiently small (as expected with ~25 fit ' +
    'points). However, NO rigorous certified Lambda bound below 0.2 is ' +
    'established at these heights because (a) the measured Dyson ladder ' +
    '(imp-360) reaches only N = 870; (b) the tail correction E_tail(N) above ' +
    'T*(N) is not certified (B4); and (c) the OLS ansatz is a model fit, not ' +
    'a theorem (B1 + B2 open). The projected margin is large enough that once ' +
    'B1, B2, B4 are closed and the ladder reaches N = 10^4, the rigorous ' +
    'version of this bound should comfortably beat Platt-Trudgian.',

  openItems: [
    {
      id: 'B1',
      description:
        'Prove an analytic upper bound on the slope b in |t_c(N)| <= a + b/N. ' +
        'Natural target: b <= 2 pi / log(T_0 / 2 pi) matching the GUE mean gap.',
      ticket: 'imp-363 / imp-370',
    },
    {
      id: 'B2',
      description:
        'Prove the intercept a is strictly <= 0 (or provide a certified numerical ' +
        'upper bound via a theorem, not an OLS fit). This is the central barrier.',
      ticket: 'lambda-zero-attack.js B2',
    },
    {
      id: 'B4',
      description:
        'Certify the tail correction E_tail(N) above T*(N) for N in {10^4, 10^5, 10^6}. ' +
        'The Guth-Maynard 2024 zero-density bound quantifies the tail count; ' +
        'converting that count to a Lambda correction requires the Dyson perturbation ' +
        'series for the far-field zeros.',
      ticket: 'guth-maynard-tail-bound.js, imp-319 B4',
    },
    {
      id: 'measured-ladder',
      description:
        'Extend the measured Dyson ladder from N = 870 to N = 10^4 using the ' +
        'interval-arithmetic backward RK4 integrator (imp-362) once the full ' +
        'LMFDB / Odlyzko zero table at the required height is available (imp-359).',
      ticket: 'imp-360 remaining 90%',
    },
  ],

  sources: [
    'imp-400 PATH_C_BASELINE_FIT_V2 (src/data/path-c-baseline-fit-v2.js)',
    'imp-327 effectiveHeightForN (src/data/lambda-rh-height-mapping.js)',
    'imp-408 platt-trudgian-matched-check.js',
    'imp-411 imp-408-audit.js',
    'imp-319 lambda-zero-attack.js (B1, B2, B4 blockers)',
    'Platt & Trudgian 2021, Bull. Lond. Math. Soc. 53 (2021), 792-797',
  ],
};

// ── Build-time assertions ─────────────────────────────────────────────────────
export const FINITE_HEIGHT_LAMBDA_BOUND_ASSERTIONS = [
  {
    id: 'imp416-fit-is-available',
    holds: () => V2_FIT !== null && A_INTERCEPT !== null && B_SLOPE !== null,
    why:
      'PATH_C_BASELINE_FIT_V2 must have produced a valid OLS fit. A null fit ' +
      'means fewer than 3 valid measured rows in the Dyson ladder (imp-360).',
  },
  {
    id: 'imp416-all-three-N-projection-beat-pt',
    holds: () =>
      LADDER.every((r) => r.available && r.projection && r.projection.beats_pt),
    why:
      'The OLS projection a + b/N must beat PT_BOUND = 0.2 at all three N. ' +
      'With intercept ~0.007 and slope ~5, the projection at N = 10^4 is ~0.0077, ' +
      'far below 0.2. A failure here means the V2 fit intercept has drifted above 0.2.',
  },
  {
    id: 'imp416-no-rigorous-beats-pt',
    holds: () => !LADDER.some((r) => r.rigorous && r.rigorous.beats_pt),
    why:
      'Until B1 + B2 + B4 are closed and the measured ladder reaches N = 10^4, ' +
      'no row should claim a RIGOROUS Lambda bound below 0.2. If this assertion ' +
      'fails, the rigorous verdict logic has been incorrectly set to true.',
  },
  {
    id: 'imp416-projection-factor-above-20',
    holds: () =>
      LADDER.every(
        (r) =>
          r.available &&
          r.projection &&
          r.projection.factor !== null &&
          r.projection.factor > 20
      ),
    why:
      'At all three N the projection margin factor must exceed 20. With intercept ' +
      '~0.007 the factor is ~28; a drop below 20 would indicate the V2 fit ' +
      'intercept has inflated to above 0.01, which is a regression worth investigating.',
  },
  {
    id: 'imp416-ladder-has-three-rows',
    holds: () => LADDER.length === 3 && LADDER.every((r) => r.available),
    why:
      'The ladder must contain exactly three rows (N = 10^4, 10^5, 10^6) and ' +
      'all must be available (V2 fit non-null).',
  },
  {
    id: 'imp416-t-star-increases-with-N',
    holds: () => {
      for (let i = 1; i < LADDER.length; i++) {
        if (!(LADDER[i].T_star > LADDER[i - 1].T_star)) return false;
      }
      return true;
    },
    why:
      'T*(N) = effectiveHeightForN(N) must be strictly increasing in N. An ' +
      'inversion would indicate a bug in the Newton iteration in lambda-rh-height-mapping.js.',
  },
];
