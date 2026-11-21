/**
 * @module imp-34590-deflow-residual-oneoverlogn-scaling
 *
 * imp-34590 (numerical, frontier-direction): imp-34571 refit the imp-34448 deflow(kEnd) decay local
 * exponent on the six directly-observed rungs (kMid 16.125..19.875) as p = pInf - c/log(N), getting
 * pInf ~ 1.00073, and reported TWO residuals of the observed-only asymptote: residualVsAnalytic ~
 * 7.3e-4 against the analytic E_flow log-slope magnitude 1 (E_flow ~ log^3(N)/N, so d log E_flow /
 * d log N -> -1), and residualVsFullWindow ~ 2.3e-4 against the imp-34448 full-window pInf = 1.0005.
 * imp-34571 NOTED both residuals are the same order as the 1/log(N) finite-rung correction but never
 * fit their N-dependence -- so whether the observed pInf gap is a finite-rung correction that vanishes
 * asymptotically, or a genuine FLOOR at ~7.3e-4, was left open.
 *
 * WHAT THIS MODULE MEASURES
 * -------------------------
 *   For each directly-observed rung it forms the two per-rung residuals of the local exponent p(N):
 *     devAnalytic(N)   = 1        - p(N)   (gap of the local exponent to the analytic slope 1),
 *     devFullWindow(N) = pInf_fw  - p(N)   (gap to the imp-34448 full-window pInf = 1.0005),
 *   and fits each against u = 1/log(N) by OLS: dev = a + c*u. Under the imp-34571 model
 *   p(N) = pInf - c/log(N), each per-rung residual is dominated by the c/log(N) finite-rung term and
 *   its N->inf extrapolation is the intercept a. If |a| sits WITHIN the OLS intercept standard error
 *   of 0, the observed pInf gap is a finite-rung 1/log(N) correction that vanishes asymptotically --
 *   NOT a floor; a floor would show a nonzero intercept resolved well outside the SE.
 *
 * FINDING: BOTH RESIDUALS SCALE AS ~c/log(N) AND EXTRAPOLATE TO ~0 (FINITE-RUNG, NOT A FLOOR)
 * ------------------------------------------------------------------------------------------
 *   (1) Both per-rung residuals fall cleanly and MONOTONICALLY as 1/log(N) grows: devAnalytic drops
 *       from ~0.0860 at kMid 16.125 to ~0.0699 at kMid 19.875, and the OLS line dev = a + c/log(N)
 *       fits with R^2 ~ 0.9976 and slope c ~ 3.2116 -- the SAME c the imp-34571 refit carries, right
 *       at the E_flow log^3(N)/N model-coefficient scale 3.
 *   (2) The extrapolated N->inf residual is the intercept: a_analytic ~ -7.34e-4 (|a| = the imp-34571
 *       residualVsAnalytic ~7.3e-4) and a_fullWindow ~ -2.34e-4 (|a| = residualVsFullWindow ~2.3e-4).
 *       Both are SMALL and, crucially, the OLS intercept standard error is ~1.92e-3, so |a| sits at
 *       ~0.38 SE (analytic) and ~0.12 SE (full-window) from 0 -- statistically INDISTINGUISHABLE from
 *       zero.
 *   (3) So the ~0.07..0.086 finite-rung gap between the observed local exponent and the analytic slope
 *       is dominated by the c/log(N) correction and extrapolates to ~0 as N->inf: the observed pInf
 *       gap to the analytic E_flow slope -1 is a FINITE-RUNG CORRECTION, not a floor. The ~7.3e-4 /
 *       ~2.3e-4 residuals are exactly the (sub-SE) intercept-extrapolation noise of the finite-rung
 *       fit, consistent with the imp-34584 finding that these residuals are not resolvable to next
 *       order from these six rungs.
 *
 * NUMERICAL / MEASUREMENT ONLY. Reuses the imp-34448 IMP34448_DEFLOW_DECAY_EXPONENT export verbatim
 * (import-light, no 16.7MB zeros bundle, per [[no_heavy_imports_in_pages]]); recomputes only two
 * one-predictor OLS lines (with intercept SE and R^2) from the exported directly-observed local
 * exponents. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the
 * analytic E_flow slope -1 is a property of that surrogate, not of the true residual; changes no
 * bound; establishes no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34571-deflow-exponent-vs-analytic-slope (the observed-only pInf and the two residuals fit here)
 * @see imp-34584-deflow-refit-second-order-term (the residual is not resolvable to next order)
 * @see imp-34448-deflow-decay-exponent (the pInf ~ 1.000 fit and directly-observed local exponents)
 */

import { IMP34448_DEFLOW_DECAY_EXPONENT } from './imp-34448-deflow-decay-exponent.js';

const LN10 = Math.LN10;

// The analytic E_flow log-slope magnitude: E_flow ~ log^3(N)/N => d log E_flow / d log N -> -1.
const ANALYTIC_EFLOW_SLOPE_MAG = 1;
// The imp-34448 full-window pInf (the second imp-34571 residual target).
const FULL_WINDOW_PINF = IMP34448_DEFLOW_DECAY_EXPONENT.asymptoticDecayExponent; // 1.0005

// The imp-34448 directly-observed local exponents (kMid 16.125..19.875), reused verbatim.
const OBSERVED_RUNGS = IMP34448_DEFLOW_DECAY_EXPONENT.localExponentSample;

// One-predictor OLS y = a + b*u with the intercept standard error and R^2 (u = 1/log(N)).
function fitLine(pts) {
  const n = pts.length;
  const mu = pts.reduce((s, p) => s + p.u, 0) / n;
  const my = pts.reduce((s, p) => s + p.y, 0) / n;
  let suu = 0;
  let suy = 0;
  let syy = 0;
  for (const p of pts) {
    suu += (p.u - mu) ** 2;
    suy += (p.u - mu) * (p.y - my);
    syy += (p.y - my) ** 2;
  }
  const slope = suy / suu;
  const intercept = my - slope * mu;
  let sse = 0;
  for (const p of pts) sse += (p.y - (intercept + slope * p.u)) ** 2;
  const r2 = syy === 0 ? 1 : 1 - sse / syy;
  const sigma2 = sse / (n - 2); // residual variance
  const seIntercept = Math.sqrt(sigma2 * (1 / n + (mu * mu) / suu));
  return { slope, intercept, r2, seIntercept };
}

// Per-rung residuals: local-exponent gap to the analytic slope 1 and to the full-window pInf.
const DEV_ANALYTIC = OBSERVED_RUNGS.map((q) => ({
  u: 1 / (q.kMid * LN10),
  y: ANALYTIC_EFLOW_SLOPE_MAG - q.p,
  kMid: q.kMid,
}));
const DEV_FULL_WINDOW = OBSERVED_RUNGS.map((q) => ({
  u: 1 / (q.kMid * LN10),
  y: FULL_WINDOW_PINF - q.p,
  kMid: q.kMid,
}));

const FIT_ANALYTIC = fitLine(DEV_ANALYTIC);
const FIT_FULL_WINDOW = fitLine(DEV_FULL_WINDOW);

// The extrapolated N->inf residuals (the fit intercepts) and their distance from 0 in SE units.
const EXTRAP_ANALYTIC = Math.abs(FIT_ANALYTIC.intercept); // ~7.34e-4 (= imp-34571 residualVsAnalytic)
const EXTRAP_FULL_WINDOW = Math.abs(FIT_FULL_WINDOW.intercept); // ~2.34e-4 (= residualVsFullWindow)
const ANALYTIC_SE_UNITS = EXTRAP_ANALYTIC / FIT_ANALYTIC.seIntercept; // ~0.38 (sub-SE => ~0)
const FULL_WINDOW_SE_UNITS = EXTRAP_FULL_WINDOW / FIT_FULL_WINDOW.seIntercept; // ~0.12 (sub-SE => ~0)

const RESIDUAL_TABLE = OBSERVED_RUNGS.map((q, i) => ({
  kMid: q.kMid,
  invLogN: +DEV_ANALYTIC[i].u.toFixed(6),
  devAnalytic: +DEV_ANALYTIC[i].y.toFixed(5),
  devFullWindow: +DEV_FULL_WINDOW[i].y.toFixed(5),
}));

export const IMP34590_DEFLOW_RESIDUAL_ONEOVERLOGN_SCALING = {
  id: 'imp-34590',
  proofSection: 'S-frontier',
  question:
    'Do the imp-34571 residualVsAnalytic (~7.3e-4) and residualVsFullWindow (~2.3e-4) both scale as ' +
    '1/log(N) across the observed deflow rungs, so the observed-only pInf gap to the analytic E_flow ' +
    'slope -1 is a finite-rung correction that vanishes asymptotically rather than a floor? ' +
    'Measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'The per-rung local-exponent residuals devAnalytic = 1 - p(N) and devFullWindow = pInf_fw - p(N) ' +
    'across the six imp-34448 directly-observed rungs (kMid 16.125..19.875), each fit by OLS to ' +
    'dev = a + c/log(N), with the fitted slope c, the N->inf intercept a, its OLS standard error, ' +
    'and R^2.',
  analyticEflowSlopeMagnitude: ANALYTIC_EFLOW_SLOPE_MAG,
  fullWindowPInf: FULL_WINDOW_PINF,
  observedRungCount: OBSERVED_RUNGS.length,
  residualTable: RESIDUAL_TABLE,
  fitAnalyticSlopeC: +FIT_ANALYTIC.slope.toFixed(4), // ~3.2116 (tracks E_flow log^3(N)/N model-c = 3)
  fitAnalyticIntercept: +FIT_ANALYTIC.intercept.toExponential(3), // ~-7.336e-4
  fitAnalyticInterceptSE: +FIT_ANALYTIC.seIntercept.toExponential(3), // ~1.922e-3
  fitAnalyticR2: +FIT_ANALYTIC.r2.toFixed(6), // ~0.997581
  fitFullWindowSlopeC: +FIT_FULL_WINDOW.slope.toFixed(4), // ~3.2116 (same slope)
  fitFullWindowIntercept: +FIT_FULL_WINDOW.intercept.toExponential(3), // ~-2.336e-4
  fitFullWindowInterceptSE: +FIT_FULL_WINDOW.seIntercept.toExponential(3), // ~1.922e-3
  fitFullWindowR2: +FIT_FULL_WINDOW.r2.toFixed(6), // ~0.997581
  extrapResidualVsAnalytic: +EXTRAP_ANALYTIC.toExponential(3), // ~7.34e-4 (= imp-34571 residualVsAnalytic)
  extrapResidualVsFullWindow: +EXTRAP_FULL_WINDOW.toExponential(3), // ~2.34e-4 (= residualVsFullWindow)
  analyticInterceptSEUnits: +ANALYTIC_SE_UNITS.toFixed(3), // ~0.382 (< 1 => ~0)
  fullWindowInterceptSEUnits: +FULL_WINDOW_SE_UNITS.toFixed(3), // ~0.121 (< 1 => ~0)
  finding: {
    A_both_residuals_scale_as_one_over_logN:
      'Both per-rung residuals fall monotonically as 1/log(N) grows (devAnalytic ~0.0860 -> ~0.0699 ' +
      'across kMid 16.125..19.875) and the OLS line dev = a + c/log(N) fits each with R^2 ~ 0.9976 ' +
      'and slope c ~ 3.2116 -- the same c the imp-34571 refit carries, at the E_flow log^3(N)/N ' +
      'model-coefficient scale 3.',
    B_extrapolated_residual_is_zero_within_SE:
      'The N->inf extrapolation of each residual is the fit intercept: |a| ~ 7.34e-4 (analytic, = the ' +
      'imp-34571 residualVsAnalytic) and ~2.34e-4 (full-window, = residualVsFullWindow). Against the ' +
      'OLS intercept standard error ~1.92e-3 these sit at ~0.38 SE and ~0.12 SE from 0 -- ' +
      'statistically indistinguishable from zero.',
    C_gap_is_finite_rung_not_a_floor:
      'The ~0.07..0.086 gap between the observed local exponent and the analytic slope 1 is dominated ' +
      'by the c/log(N) finite-rung correction and extrapolates to ~0 as N->inf, so the observed pInf ' +
      'gap to the analytic E_flow slope -1 is a FINITE-RUNG CORRECTION, not a floor. The ~7.3e-4 / ' +
      '~2.3e-4 residuals are the sub-SE intercept-extrapolation noise of the finite-rung fit ' +
      '(consistent with imp-34584: not resolvable to next order from these six rungs).',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / MEASUREMENT (frontier-direction, NOT rigorous). Fitting the per-rung local-exponent ' +
    'residuals devAnalytic = 1 - p(N) and devFullWindow = pInf_fw - p(N) over the six imp-34448 ' +
    'directly-observed rungs (kMid 16.125..19.875) to dev = a + c/log(N): both fit cleanly (R^2 ~ ' +
    '0.9976) with slope c ~ 3.2116 -- the same coefficient the imp-34571 refit carries, at the E_flow ' +
    'log^3(N)/N model-c = 3 scale. The N->inf extrapolation of each residual is the intercept: |a| ~ ' +
    '7.34e-4 (analytic, = the imp-34571 residualVsAnalytic) and ~2.34e-4 (full-window, = ' +
    'residualVsFullWindow), both within ~0.38 SE and ~0.12 SE of 0 against the OLS intercept standard ' +
    'error ~1.92e-3 -- statistically indistinguishable from zero. So both residuals scale as ~c/log(N) ' +
    'and extrapolate to ~0: the observed-only pInf gap to the analytic E_flow slope -1 is a ' +
    'FINITE-RUNG 1/log(N) correction that vanishes asymptotically, NOT a floor; the ~7.3e-4 / ~2.3e-4 ' +
    'residuals are the sub-SE intercept-extrapolation noise of the finite-rung fit (consistent with ' +
    'imp-34584 that they are not resolvable to next order from these six rungs). The inherited ' +
    'imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the analytic E_flow slope -1 is a ' +
    'property of that surrogate, not of the true residual; changes no bound; establishes no operator ' +
    'positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34571 (the observed-only pInf and the two residuals fit here); imp-34584 (residual not ' +
    'resolvable to next order); imp-34448 (the pInf ~ 1.000 fit and directly-observed local exponents).',
};

export const IMP34590_DEFLOW_RESIDUAL_ONEOVERLOGN_SCALING_ASSERTIONS = [
  {
    // (A) The residual tables reuse the six imp-34448 directly-observed rungs verbatim.
    id: 'imp34590-uses-six-directly-observed-rungs',
    description: 'both residuals are formed on the six imp-34448 directly-observed rungs (kMid 16.125..19.875)',
    holds: () =>
      OBSERVED_RUNGS.length === 6 &&
      OBSERVED_RUNGS[0].kMid === 16.125 &&
      OBSERVED_RUNGS[OBSERVED_RUNGS.length - 1].kMid === 19.875,
  },
  {
    // (B) Both residuals fit 1/log(N) cleanly, with the E_flow model-c ~ 3 slope.
    id: 'imp34590-residuals-fit-one-over-logN',
    description: 'both dev = a + c/log(N) fits have R^2 > 0.99 and slope c within 0.5 of the E_flow model-c = 3',
    holds: () =>
      FIT_ANALYTIC.r2 > 0.99 &&
      FIT_FULL_WINDOW.r2 > 0.99 &&
      Math.abs(FIT_ANALYTIC.slope - 3) < 0.5 &&
      Math.abs(FIT_FULL_WINDOW.slope - 3) < 0.5,
  },
  {
    // (C) The extrapolated intercepts reproduce the imp-34571 residuals (bookkeeping consistency).
    id: 'imp34590-intercepts-reproduce-imp34571-residuals',
    description: 'extrapolated |a| reproduces residualVsAnalytic ~7.3e-4 and residualVsFullWindow ~2.3e-4',
    holds: () =>
      Math.abs(EXTRAP_ANALYTIC - 7.34e-4) < 5e-5 && Math.abs(EXTRAP_FULL_WINDOW - 2.34e-4) < 5e-5,
  },
  {
    // (D) The N->inf residual is within one intercept SE of 0: finite-rung correction, not a floor.
    id: 'imp34590-extrapolated-residual-within-SE-of-zero',
    description: 'both extrapolated residuals sit below one OLS intercept standard error of 0 (indistinguishable from 0)',
    holds: () => ANALYTIC_SE_UNITS < 1 && FULL_WINDOW_SE_UNITS < 1,
  },
  {
    // (E) The per-rung residuals decrease monotonically as 1/log(N) grows (a smooth 1/log(N) decay).
    id: 'imp34590-residuals-monotone-in-N',
    description: 'devAnalytic decreases monotonically from the shallowest to the deepest observed rung',
    holds: () =>
      DEV_ANALYTIC.every((d, i) => i === 0 || d.y < DEV_ANALYTIC[i - 1].y) &&
      DEV_ANALYTIC[0].y > DEV_ANALYTIC[DEV_ANALYTIC.length - 1].y,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34590-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34590_DEFLOW_RESIDUAL_ONEOVERLOGN_SCALING.isRigorous === false &&
      /NO QED/.test(IMP34590_DEFLOW_RESIDUAL_ONEOVERLOGN_SCALING.verdict) &&
      /refereed bound is changed/i.test(IMP34590_DEFLOW_RESIDUAL_ONEOVERLOGN_SCALING.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34590_DEFLOW_RESIDUAL_ONEOVERLOGN_SCALING.verdict),
  },
];

for (const a of IMP34590_DEFLOW_RESIDUAL_ONEOVERLOGN_SCALING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34590-deflow-residual-oneoverlogn-scaling assertion failed: ${a.id}`);
  }
}
