/**
 * @module imp-34584-deflow-refit-second-order-term
 *
 * imp-34584 (numerical, frontier-direction): imp-34571 refit the imp-34448 deflow(kEnd) decay local
 * exponent on the directly-observed rungs (kMid 16.125..19.875) as p = pInf - c/log(N), getting
 * pInf ~ 1.00073, c ~ 3.21, and a residual |pInf - 1| ~ 7.3e-4 against the analytic E_flow log-slope
 * magnitude 1 (E_flow ~ log^3(N)/N, so d log E_flow / d log N -> -1). imp-34571 left that ~7.3e-4
 * residual -- the same order as the 1/log(N) finite-rung correction -- unresolved to next order.
 *
 * WHAT THIS MODULE MEASURES
 * -------------------------
 *   Whether extending the fit ansatz by ONE higher-order finite-rung term,
 *     p = pInf - c/log(N) - d/log^2(N),
 *   fit by OLS on the SAME six directly-observed rungs, drives the fitted pInf measurably CLOSER to
 *   exactly 1 and shrinks the ~7.3e-4 residual, and whether the recovered d has the sign/scale the
 *   E_flow log^3(N)/N structure would predict (a modest O(1) coefficient, since E_flow's own local
 *   exponent 1 - 3/log(N) has NO 1/log^2(N) term at leading order -- d ~ 0 from the leading model).
 *
 * FINDING: THE SECOND-ORDER TERM OVERFITS AND DEGRADES THE EXTRAPOLATION
 * ---------------------------------------------------------------------
 *   (1) The in-sample RMS residual halves (2.74e-4 -> 1.40e-4) -- the extra degree of freedom absorbs
 *       curvature -- but the EXTRAPOLATED intercept moves AWAY from 1: pInf drops from 1.00073 to
 *       ~0.9465, so |pInf - 1| GROWS from 7.3e-4 to ~5.4e-2 (a ~73x degradation, not a tightening).
 *   (2) The leading coefficient flips sign to an unphysical c ~ -1.26 (vs the physical +3.21 that
 *       tracks the E_flow log^3(N)/N model-c = 3), and d blows up to ~+91.7 -- ~30x the O(1)-O(3)
 *       scale the E_flow structure would predict. d is a large positive artifact, NOT the modest
 *       coefficient expected from the E_flow tail.
 *   (3) The cause is collinearity: over the narrow observed window (log N in 37.1..45.8, so
 *       u = 1/log(N) in 0.0219..0.0269) the predictors u and u^2 have Pearson correlation ~0.9995, so
 *       the second-order term is not separately identifiable. The extra parameter fits noise, not a
 *       real 1/log^2(N) signal -- the ~7.3e-4 residual is NOT resolvable to next order from these six
 *       observed rungs. The one-parameter p = pInf - c/log(N) remains the honest estimator.
 *
 * NUMERICAL / MEASUREMENT ONLY. Reuses the imp-34448 IMP34448_DEFLOW_DECAY_EXPONENT export verbatim
 * (import-light, no 16.7MB zeros bundle, per [[no_heavy_imports_in_pages]]); recomputes only a
 * two-predictor OLS from the exported directly-observed local exponents. The inherited
 * imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the analytic E_flow slope -1 is a
 * property of that surrogate, not of the true residual; changes no bound; establishes no operator
 * positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34571-deflow-exponent-vs-analytic-slope (the one-parameter refit and ~7.3e-4 residual)
 * @see imp-34448-deflow-decay-exponent (the pInf ~ 1.000 fit and directly-observed local exponents)
 * @see imp-34495-deflow-decay-viz-data (the directly-observed vs fit-extrapolated tagging)
 */

import { IMP34448_DEFLOW_DECAY_EXPONENT } from './imp-34448-deflow-decay-exponent.js';

const LN10 = Math.LN10;

// The analytic E_flow log-slope magnitude: E_flow ~ log^3(N)/N => d log E_flow / d log N -> -1.
const ANALYTIC_EFLOW_SLOPE_MAG = 1;

// The imp-34448 directly-observed local exponents (kMid 16.125..19.875), reused verbatim.
const OBSERVED_RUNGS = IMP34448_DEFLOW_DECAY_EXPONENT.localExponentSample;

// (u = 1/log(N) = 1/(kMid*LN10)). One-parameter OLS: p = pInf - c*u.
function refitOne(rows) {
  const pts = rows.map((q) => ({ u: 1 / (q.kMid * LN10), y: q.p }));
  const n = pts.length;
  const mu = pts.reduce((a, b) => a + b.u, 0) / n;
  const my = pts.reduce((a, b) => a + b.y, 0) / n;
  let suu = 0;
  let suy = 0;
  for (const p of pts) {
    suu += (p.u - mu) ** 2;
    suy += (p.u - mu) * (p.y - my);
  }
  const slope = suy / suu; // = -c
  const pInf = my - slope * mu;
  const c = -slope;
  let sse = 0;
  for (const p of pts) sse += (p.y - (pInf - c * p.u)) ** 2;
  return { pInf, c, rms: Math.sqrt(sse / n) };
}

// Two-parameter OLS: p = pInf - c*u - d*u^2 via the 3x3 normal equations (design [1, u, u^2]).
function refitTwo(rows) {
  const data = rows.map((q) => {
    const u = 1 / (q.kMid * LN10);
    return { u, u2: u * u, y: q.p };
  });
  const n = data.length;
  const S = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const b = [0, 0, 0];
  for (const dpt of data) {
    const X = [1, dpt.u, dpt.u2];
    for (let i = 0; i < 3; i += 1) {
      b[i] += X[i] * dpt.y;
      for (let j = 0; j < 3; j += 1) S[i][j] += X[i] * X[j];
    }
  }
  const M = S.map((r, i) => [...r, b[i]]);
  for (let col = 0; col < 3; col += 1) {
    let piv = col;
    for (let r = col + 1; r < 3; r += 1) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    const tmp = M[col];
    M[col] = M[piv];
    M[piv] = tmp;
    for (let r = 0; r < 3; r += 1) {
      if (r === col) continue;
      const f = M[r][col] / M[col][col];
      for (let cc = col; cc < 4; cc += 1) M[r][cc] -= f * M[col][cc];
    }
  }
  const a0 = M[0][3] / M[0][0];
  const a1 = M[1][3] / M[1][1];
  const a2 = M[2][3] / M[2][2];
  // p = a0 + a1*u + a2*u^2 => pInf = a0, c = -a1, d = -a2.
  let sse = 0;
  for (const dpt of data) sse += (dpt.y - (a0 + a1 * dpt.u + a2 * dpt.u2)) ** 2;
  return { pInf: a0, c: -a1, d: -a2, rms: Math.sqrt(sse / n) };
}

// Pearson correlation of the two predictors u and u^2 over the observed window (collinearity check).
function predictorCorr(rows) {
  const us = rows.map((q) => 1 / (q.kMid * LN10));
  const u2s = us.map((u) => u * u);
  const n = us.length;
  const mu = us.reduce((a, x) => a + x, 0) / n;
  const mv = u2s.reduce((a, x) => a + x, 0) / n;
  let suv = 0;
  let suu = 0;
  let svv = 0;
  for (let i = 0; i < n; i += 1) {
    suv += (us[i] - mu) * (u2s[i] - mv);
    suu += (us[i] - mu) ** 2;
    svv += (u2s[i] - mv) ** 2;
  }
  return suv / Math.sqrt(suu * svv);
}

const ONE = refitOne(OBSERVED_RUNGS);
const TWO = refitTwo(OBSERVED_RUNGS);
const RESIDUAL_ONE = Math.abs(ONE.pInf - ANALYTIC_EFLOW_SLOPE_MAG); // ~7.3e-4
const RESIDUAL_TWO = Math.abs(TWO.pInf - ANALYTIC_EFLOW_SLOPE_MAG); // ~5.4e-2 (WORSE)
const PREDICTOR_CORR = predictorCorr(OBSERVED_RUNGS); // ~0.9995 (near-collinear)

export const IMP34584_DEFLOW_REFIT_SECOND_ORDER_TERM = {
  id: 'imp-34584',
  proofSection: 'S-frontier',
  question:
    'Does adding a 1/log^2(N) second-order term to the imp-34571 observed-only deflow refit ' +
    'p = pInf - c/log(N) tighten pInf toward exactly 1 and shrink the ~7.3e-4 residual against the ' +
    'analytic E_flow log-slope magnitude 1, and does d have the sign/scale the E_flow log^3(N)/N ' +
    'structure predicts? Measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'pInf, c, d and the in-sample RMS from a two-predictor OLS fit p = pInf - c/log(N) - d/log^2(N) ' +
    'on the same six imp-34448 directly-observed rungs (kMid 16.125..19.875), compared against the ' +
    'one-parameter refit, plus the Pearson correlation of the predictors 1/log(N) and 1/log^2(N).',
  analyticEflowSlopeMagnitude: ANALYTIC_EFLOW_SLOPE_MAG,
  observedRungCount: OBSERVED_RUNGS.length,
  oneParamPInf: +ONE.pInf.toFixed(6), // ~1.000734
  oneParamC: +ONE.c.toFixed(4), // ~3.2116
  oneParamRms: +ONE.rms.toExponential(3), // ~2.744e-4
  oneParamResidualVsAnalytic: +RESIDUAL_ONE.toExponential(3), // ~7.34e-4
  twoParamPInf: +TWO.pInf.toFixed(6), // ~0.946497 (moves AWAY from 1)
  twoParamC: +TWO.c.toFixed(4), // ~-1.2592 (unphysical sign flip)
  twoParamD: +TWO.d.toFixed(3), // ~91.664 (large positive artifact)
  twoParamRms: +TWO.rms.toExponential(3), // ~1.396e-4 (in-sample RMS halves)
  twoParamResidualVsAnalytic: +RESIDUAL_TWO.toExponential(3), // ~5.350e-2 (~73x WORSE than one-param)
  predictorCorrelation: +PREDICTOR_CORR.toFixed(4), // ~0.9995 (u vs u^2 near-collinear)
  finding: {
    A_second_order_term_does_not_tighten_pInf:
      'The two-parameter fit p = pInf - c/log(N) - d/log^2(N) moves the extrapolated pInf AWAY from 1 ' +
      '(1.00073 -> 0.94650), so the residual against the analytic slope magnitude 1 GROWS from ~7.3e-4 ' +
      'to ~5.4e-2 (a ~73x degradation). The in-sample RMS halves (2.74e-4 -> 1.40e-4) only because the ' +
      'extra degree of freedom overfits curvature -- it does not resolve the ~7.3e-4 residual.',
    B_d_is_an_overfitting_artifact_not_the_eflow_scale:
      'The recovered d ~ +91.7 is ~30x the O(1)-O(3) coefficient scale the E_flow log^3(N)/N structure ' +
      'would predict (whose leading local exponent 1 - 3/log(N) carries NO 1/log^2(N) term, i.e. ' +
      'd ~ 0), and the leading c flips to an unphysical -1.26 (vs the physical +3.21 tracking model-c ' +
      '= 3). d is a large positive artifact, not a genuine E_flow-tail coefficient.',
    C_cause_is_predictor_collinearity:
      'Over the narrow observed window (log N in 37.1..45.8, u = 1/log(N) in 0.0219..0.0269) the ' +
      'predictors 1/log(N) and 1/log^2(N) have Pearson correlation ~0.9995, so the second-order term ' +
      'is not separately identifiable -- it fits noise. The ~7.3e-4 residual is NOT resolvable to next ' +
      'order from these six observed rungs; the one-parameter refit remains the honest estimator.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / MEASUREMENT (frontier-direction, NOT rigorous). Adding a 1/log^2(N) second-order term ' +
    'to the imp-34571 observed-only deflow refit p = pInf - c/log(N) does NOT tighten pInf toward 1: ' +
    'the two-parameter fit p = pInf - c/log(N) - d/log^2(N) on the same six directly-observed rungs ' +
    '(kMid 16.125..19.875) moves the extrapolated pInf from 1.00073 to ~0.94650, so |pInf - 1| GROWS ' +
    'from ~7.3e-4 to ~5.4e-2 (~73x WORSE), while the in-sample RMS merely halves (2.74e-4 -> 1.40e-4) ' +
    'by overfitting curvature. The recovered d ~ +91.7 is ~30x the O(1)-O(3) scale the E_flow ' +
    'log^3(N)/N structure predicts (leading exponent 1 - 3/log(N) has no 1/log^2(N) term, d ~ 0), and ' +
    'the leading c flips to an unphysical -1.26 (vs +3.21). The cause is collinearity: over the narrow ' +
    'observed window the predictors 1/log(N) and 1/log^2(N) correlate ~0.9995, so the second-order ' +
    'term is not identifiable and fits noise. The ~7.3e-4 residual is NOT resolvable to next order ' +
    'from these six rungs; the one-parameter refit remains the honest estimator. The inherited ' +
    'imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the analytic E_flow slope -1 is a ' +
    'property of that surrogate, not of the true residual; changes no bound; establishes no operator ' +
    'positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34571 (the one-parameter observed-only refit and ~7.3e-4 residual); imp-34448 (the pInf ~ ' +
    '1.000 fit and directly-observed local exponents); imp-34495 (directly-observed vs ' +
    'fit-extrapolated tagging).',
};

export const IMP34584_DEFLOW_REFIT_SECOND_ORDER_TERM_ASSERTIONS = [
  {
    // (A) The one-parameter refit reproduces the imp-34571 baseline (pInf ~ 1.0007, residual ~7.3e-4).
    id: 'imp34584-one-param-reproduces-imp34571-baseline',
    description: 'one-parameter refit gives pInf ~ 1.0007 with residual ~7.3e-4 (matches imp-34571)',
    holds: () =>
      Math.abs(ONE.pInf - 1.00073) < 5e-4 && Math.abs(RESIDUAL_ONE - 7.34e-4) < 5e-5,
  },
  {
    // (B) The two-parameter fit moves pInf AWAY from 1: the residual grows, not shrinks.
    id: 'imp34584-second-order-degrades-not-tightens',
    description: 'adding 1/log^2(N) grows |pInf - 1| (>10x the one-parameter residual), not shrinks it',
    holds: () => RESIDUAL_TWO > 10 * RESIDUAL_ONE,
  },
  {
    // (C) The in-sample RMS improves even though the extrapolation degrades (overfitting signature).
    id: 'imp34584-in-sample-rms-improves-while-extrapolation-degrades',
    description: 'two-parameter in-sample RMS is smaller than one-parameter (overfitting, not signal)',
    holds: () => TWO.rms < ONE.rms && RESIDUAL_TWO > RESIDUAL_ONE,
  },
  {
    // (D) d is a large positive artifact, far above the O(1)-O(3) E_flow model-coefficient scale.
    id: 'imp34584-d-is-large-overfitting-artifact',
    description: 'recovered d exceeds 10x the E_flow model-c scale of 3 (not an O(1) coefficient)',
    holds: () => Number.isFinite(TWO.d) && TWO.d > 30,
  },
  {
    // (E) The predictors 1/log(N) and 1/log^2(N) are near-collinear over the observed window.
    id: 'imp34584-predictors-near-collinear',
    description: 'Pearson correlation of 1/log(N) and 1/log^2(N) exceeds 0.999 (not identifiable)',
    holds: () => PREDICTOR_CORR > 0.999,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34584-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34584_DEFLOW_REFIT_SECOND_ORDER_TERM.isRigorous === false &&
      /NO QED/.test(IMP34584_DEFLOW_REFIT_SECOND_ORDER_TERM.verdict) &&
      /refereed bound is changed/i.test(IMP34584_DEFLOW_REFIT_SECOND_ORDER_TERM.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34584_DEFLOW_REFIT_SECOND_ORDER_TERM.verdict),
  },
];

for (const a of IMP34584_DEFLOW_REFIT_SECOND_ORDER_TERM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34584-deflow-refit-second-order-term assertion failed: ${a.id}`);
  }
}
