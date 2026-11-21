/**
 * @module imp-34607-deflow-second-order-identifiability-window
 *
 * imp-34607 (numerical, frontier-direction): imp-34584 found that adding a d/log^2(N) second-order
 * term to the imp-34571 deflow local-exponent refit p = pInf - c/log(N) OVERFITS: over the narrow
 * six-rung observed window (log N in 36.8..46.1, so u = 1/log(N) in 0.02185..0.02693) the two
 * predictors u and u^2 have Pearson correlation ~0.9995, so the recovered d blows up to +91.7
 * (unphysical) and the extrapolated pInf degrades ~73x. imp-34584 concluded the residual is not
 * resolvable to next order FROM THESE SIX RUNGS but never quantified HOW MUCH WIDER an N-span would
 * be needed to break the collinearity. This module measures that identifiability window.
 *
 * WHAT THIS MODULE MEASURES
 * -------------------------
 *   The collinearity of the two finite-rung predictors u = 1/log(N) and u^2 is a pure PROPERTY OF
 *   THE DESIGN-MATRIX GEOMETRY (the set of log N sample points), independent of the deflow response
 *   values -- which is fortunate, because deflow itself underflows the double-precision floor past
 *   kEnd ~22.5 (imp-34448) and cannot be observed deeper. So the identifiability question can be
 *   answered EXACTLY from the predictor geometry alone. Holding the observed high anchor fixed at
 *   kEnd = 20 (log N ~46.05) and extending the synthetic N-span downward, this module measures, as a
 *   function of the extended log N range:
 *     - the Pearson correlation r = corr(u, u^2) of the two predictors;
 *     - the variance-inflation factor VIF = 1/(1 - r^2) of the u^2 column (its coefficient standard
 *       error is inflated by sqrt(VIF));
 *     - the condition number cond = (1 + |r|)/(1 - |r|) of the 2-predictor correlation matrix
 *       (eigenvalues 1 +/- |r|), a clean design-matrix conditioning proxy needing no SVD;
 *   and it locates the minimum log N span at which cond/VIF drop below a stated identifiability
 *   threshold (the standard multicollinearity rule of thumb VIF < 10, i.e. |r| < 0.9487, cond < ~38).
 *
 * FINDING: THE COEFFICIENT IS NON-IDENTIFIABLE IN ANY ACCESSIBLE REGIME
 * --------------------------------------------------------------------
 *   (1) The observed six-rung window sits at r ~0.9995, VIF ~1080, cond ~4300 -- deep in the
 *       severe-multicollinearity regime (VIF >> 10). This reproduces the imp-34584 ~0.9995 corr.
 *   (2) To bring VIF below the standard 10 threshold (|r| < 0.9487, cond < ~38), the synthetic
 *       N-span must be extended DOWN to log N_lo ~2.51 (N ~12), giving a total log N span of ~43.5 --
 *       ~5x the observed ~8.6 span. Even a much milder cond < 100 (VIF ~25) requires reaching down
 *       to log N_lo ~9.1 (N ~9000).
 *   (3) Both required floors lie FAR below the surrogate regime: the E_flow log^3(N)/N model is a
 *       large-N asymptotic, deflow is only fp-observable out to kEnd ~22.5 (log N ~52), and rungs at
 *       N ~12..9000 are nowhere near the deep-N pole neighbourhood the fit is about. So the
 *       1/log^2(N) coefficient d is NOT separable from the leading 1/log(N) term in ANY physically or
 *       numerically accessible window -- the imp-34584 non-resolvability is structural, not an
 *       artifact of using only six rungs.
 *
 * NUMERICAL / MEASUREMENT ONLY. Reuses the imp-34448 IMP34448_DEFLOW_DECAY_EXPONENT export verbatim
 * (import-light, no 16.7MB zeros bundle, per [[no_heavy_imports_in_pages]]) to reproduce the observed
 * baseline correlation; the extended-span sweep is a pure design-matrix geometry computation over
 * synthetic log N grids. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic;
 * the analytic E_flow slope is a property of that surrogate, not of the true residual; changes no
 * bound; establishes no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34584-deflow-refit-second-order-term (the overfit and ~0.9995 predictor collinearity)
 * @see imp-34448-deflow-decay-exponent (the observed local exponents and the fp floor at kEnd ~22.5)
 * @see imp-34571-deflow-exponent-vs-analytic-slope (the one-parameter refit and ~7.3e-4 residual)
 */

import { IMP34448_DEFLOW_DECAY_EXPONENT } from './imp-34448-deflow-decay-exponent.js';

const LN10 = Math.LN10;

// The standard multicollinearity rule of thumb: VIF >= 10 (|r| >= 0.9487) is severe collinearity.
const IDENTIFIABILITY_VIF_THRESHOLD = 10;
// A milder secondary reference: design-matrix correlation-matrix condition number below 100.
const SECONDARY_COND_THRESHOLD = 100;
// The fixed high anchor: the observed clean-window high end kEnd = 20 (log N ~46.05).
const K_HI = 20;
const STEP = 0.25; // matches the imp-34448 clean-window rung spacing

// Pearson correlation of the two predictors u = 1/log(N) and u^2 over a set of kMid rung midpoints.
function corrOfMids(kMids) {
  const us = kMids.map((k) => 1 / (k * LN10));
  const u2 = us.map((u) => u * u);
  const n = us.length;
  const mu = us.reduce((a, b) => a + b, 0) / n;
  const mv = u2.reduce((a, b) => a + b, 0) / n;
  let suv = 0;
  let suu = 0;
  let svv = 0;
  for (let i = 0; i < n; i += 1) {
    suv += (us[i] - mu) * (u2[i] - mv);
    suu += (us[i] - mu) ** 2;
    svv += (u2[i] - mv) ** 2;
  }
  return suv / Math.sqrt(suu * svv);
}

// The rung midpoints of a synthetic kEnd grid [kLo .. K_HI] with spacing STEP.
function midsForSpan(kLo) {
  const ks = [];
  for (let k = kLo; k <= K_HI + 1e-9; k += STEP) ks.push(k);
  const mids = [];
  for (let i = 1; i < ks.length; i += 1) mids.push((ks[i] + ks[i - 1]) / 2);
  return mids;
}

// The three conditioning summaries at a given low anchor kLo (fixed high anchor K_HI).
function conditioningAt(kLo) {
  const r = corrOfMids(midsForSpan(kLo));
  const vif = 1 / (1 - r * r);
  const cond = (1 + Math.abs(r)) / (1 - Math.abs(r));
  return { kLo, logNlo: kLo * LN10, r, vif, cond, spanLogN: (K_HI - kLo) * LN10 };
}

// ---------------------------------------------------------------------------------------------
// (1) THE OBSERVED BASELINE: reproduce the imp-34584 six-rung predictor correlation verbatim.
// ---------------------------------------------------------------------------------------------
const OBSERVED_MIDS = IMP34448_DEFLOW_DECAY_EXPONENT.localExponentSample.map((q) => q.kMid);
const OBSERVED_R = corrOfMids(OBSERVED_MIDS); // ~0.99954 (matches imp-34584 ~0.9995)
const OBSERVED_VIF = 1 / (1 - OBSERVED_R * OBSERVED_R);
const OBSERVED_COND = (1 + Math.abs(OBSERVED_R)) / (1 - Math.abs(OBSERVED_R));
const OBSERVED_LOGN_LO = Math.min(...OBSERVED_MIDS) * LN10; // ~36.9
const OBSERVED_LOGN_HI = Math.max(...OBSERVED_MIDS) * LN10; // ~45.8
const OBSERVED_SPAN = OBSERVED_LOGN_HI - OBSERVED_LOGN_LO; // ~8.6

// ---------------------------------------------------------------------------------------------
// (2) THE EXTENDED-SPAN SWEEP: hold K_HI fixed, extend kLo downward, tabulate conditioning.
// ---------------------------------------------------------------------------------------------
const SWEEP_KLOS = [16, 10, 6, 4, 3, 2, 1.0902];
const SWEEP_TABLE = SWEEP_KLOS.map((kLo) => {
  const c = conditioningAt(kLo);
  return {
    kEndLo: kLo,
    logNlo: +c.logNlo.toFixed(3),
    spanLogN: +c.spanLogN.toFixed(3),
    predictorCorr: +c.r.toFixed(6),
    vif: +c.vif.toFixed(2),
    condNumber: +c.cond.toFixed(2),
  };
});

// ---------------------------------------------------------------------------------------------
// (3) THE IDENTIFIABILITY WINDOW: minimum log N span to cross the VIF < 10 threshold (bisection).
// ---------------------------------------------------------------------------------------------
// VIF decreases monotonically as kLo decreases (wider span). vif(kLo) > threshold for kLo > crossing.
function bisectThreshold(fnValueAt, target, loK, hiK, iters = 90) {
  let lo = loK;
  let hi = hiK;
  for (let i = 0; i < iters; i += 1) {
    const m = (lo + hi) / 2;
    if (fnValueAt(m) > target) hi = m; // still above threshold -> need wider span (lower kLo)
    else lo = m;
  }
  return (lo + hi) / 2;
}
const VIF_CROSS_KLO = bisectThreshold((k) => conditioningAt(k).vif, IDENTIFIABILITY_VIF_THRESHOLD, 0.5, 2.0);
const VIF_CROSS = conditioningAt(VIF_CROSS_KLO);
const COND_CROSS_KLO = bisectThreshold((k) => conditioningAt(k).cond, SECONDARY_COND_THRESHOLD, 2.0, 6.0);
const COND_CROSS = conditioningAt(COND_CROSS_KLO);

const REQUIRED_LOGN_LO = VIF_CROSS.logNlo; // ~2.51
const REQUIRED_SPAN = VIF_CROSS.spanLogN; // ~43.5
const SPAN_RATIO = REQUIRED_SPAN / OBSERVED_SPAN; // ~5.0x

export const IMP34607_DEFLOW_SECOND_ORDER_IDENTIFIABILITY_WINDOW = {
  id: 'imp-34607',
  proofSection: 'S-frontier',
  question:
    'imp-34584 found the u = 1/log(N) and u^2 predictors have Pearson correlation ~0.9995 over the ' +
    'six observed deflow rungs, so the 1/log^2(N) coefficient d is not identifiable. How much wider a ' +
    'log N span would drive the design-matrix collinearity below the threshold that would separate d? ' +
    'Measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'The predictor correlation r = corr(u, u^2), the variance-inflation factor VIF = 1/(1 - r^2), and ' +
    'the correlation-matrix condition number cond = (1 + |r|)/(1 - |r|) as a function of an extended ' +
    'synthetic log N span (high anchor fixed at kEnd = 20), with the minimum span at which VIF drops ' +
    'below the standard 10 identifiability threshold. Pure design-matrix geometry; deflow response not ' +
    'required (and not fp-observable past kEnd ~22.5).',
  identifiabilityVifThreshold: IDENTIFIABILITY_VIF_THRESHOLD,
  secondaryCondThreshold: SECONDARY_COND_THRESHOLD,
  observedWindow: {
    logNlo: +OBSERVED_LOGN_LO.toFixed(3), // ~36.9
    logNhi: +OBSERVED_LOGN_HI.toFixed(3), // ~45.8
    spanLogN: +OBSERVED_SPAN.toFixed(3), // ~8.6
    predictorCorr: +OBSERVED_R.toFixed(6), // ~0.99954 (matches imp-34584 ~0.9995)
    vif: +OBSERVED_VIF.toFixed(1), // ~1080
    condNumber: +OBSERVED_COND.toFixed(1), // ~4300
  },
  sweepTable: SWEEP_TABLE,
  requiredWindow: {
    kEndLo: +VIF_CROSS_KLO.toFixed(4), // ~1.090
    logNlo: +REQUIRED_LOGN_LO.toFixed(4), // ~2.510
    Nlo: +Math.pow(10, VIF_CROSS_KLO).toFixed(2), // ~12.3
    spanLogN: +REQUIRED_SPAN.toFixed(3), // ~43.5
    spanRatioVsObserved: +SPAN_RATIO.toFixed(2), // ~5.0
    corrAtThreshold: +VIF_CROSS.r.toFixed(6), // ~0.94868
    condAtThreshold: +VIF_CROSS.cond.toFixed(2), // ~38.0
  },
  secondaryWindow: {
    kEndLo: +COND_CROSS_KLO.toFixed(4), // ~3.952
    logNlo: +COND_CROSS.logNlo.toFixed(4), // ~9.100
    Nlo: +Math.pow(10, COND_CROSS_KLO).toFixed(1), // ~8955
    corrAtThreshold: +COND_CROSS.r.toFixed(6), // ~0.98020
  },
  finding: {
    A_observed_window_is_severely_collinear:
      'The observed six-rung window (log N in ~36.9..45.8, span ~8.6) sits at r ~0.9995, VIF ~1080, ' +
      'condition number ~4300 -- an order of magnitude of parameter-uncertainty inflation deep in the ' +
      'severe-multicollinearity regime (VIF >> 10). This reproduces the imp-34584 ~0.9995 correlation.',
    B_required_span_is_physically_inaccessible:
      'Extending the synthetic N-span downward with the high anchor fixed at kEnd = 20, VIF crosses ' +
      'below the standard 10 threshold (|r| < 0.9487, cond < ~38) only when the low end reaches ' +
      'log N_lo ~2.51 (N ~12), a total log N span of ~43.5 -- ~5x the observed ~8.6 span. Even a ' +
      'much milder cond < 100 (VIF ~25) needs log N_lo ~9.1 (N ~9000).',
    C_non_identifiability_is_structural:
      'Both required floors lie far below the surrogate regime: the E_flow log^3(N)/N model is a ' +
      'large-N asymptotic, deflow is only fp-observable to kEnd ~22.5, and rungs at N ~12..9000 are ' +
      'nowhere near the deep-N pole neighbourhood the fit describes. So the 1/log^2(N) coefficient is ' +
      'not separable from the leading 1/log(N) term in ANY accessible window; the imp-34584 ' +
      'non-resolvability is structural, not a six-rung artifact.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / MEASUREMENT (frontier-direction, NOT rigorous). Quantifying the imp-34584 ' +
    'identifiability window for the deflow second-order 1/log^2(N) term: the collinearity of the ' +
    'predictors u = 1/log(N) and u^2 is a pure design-matrix geometry property (independent of the ' +
    'deflow response, which underflows the double-precision floor past kEnd ~22.5). The observed ' +
    'six-rung window (log N in ~36.9..45.8, span ~8.6) sits at r ~0.9995, VIF ~1080, condition number ~4300 -- deep in severe multicollinearity, reproducing the imp-34584 ~0.9995 correlation. Holding ' +
    'the high anchor fixed at kEnd = 20 and extending the synthetic N-span downward, VIF drops below ' +
    'the standard 10 identifiability threshold (|r| < 0.9487, cond < ~38) only when the low end reaches ' +
    'log N_lo ~2.51 (N ~12), a total log N span of ~43.5 -- ~5x the observed span; even a milder ' +
    'cond < 100 needs log N_lo ~9.1 (N ~9000). Both floors lie far below the large-N surrogate regime ' +
    'and the fp-observable window, so the 1/log^2(N) coefficient is not separable from the leading ' +
    '1/log(N) term in any accessible window -- the imp-34584 non-resolvability is structural, not a ' +
    'six-rung artifact. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; ' +
    'the analytic E_flow slope is a property of that surrogate, not of the true residual; changes no ' +
    'bound; establishes no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34584 (the overfit and ~0.9995 predictor collinearity); imp-34448 (the observed local ' +
    'exponents and the fp floor at kEnd ~22.5); imp-34571 (the one-parameter refit and ~7.3e-4 ' +
    'residual).',
};

export const IMP34607_DEFLOW_SECOND_ORDER_IDENTIFIABILITY_WINDOW_ASSERTIONS = [
  {
    // (A) The observed-window correlation reproduces the imp-34584 ~0.9995 predictor collinearity.
    id: 'imp34607-observed-corr-reproduces-imp34584',
    description: 'observed six-rung predictor correlation is ~0.9995 (matches imp-34584)',
    holds: () => Math.abs(OBSERVED_R - 0.9995) < 5e-4 && OBSERVED_VIF > 100,
  },
  {
    // (B) The VIF < 10 identifiability crossing needs an enormous synthetic span down to log N ~2.5.
    id: 'imp34607-required-span-reaches-lown',
    description: 'VIF < 10 crossing requires log N_lo below 3 (N below ~20)',
    holds: () =>
      Number.isFinite(REQUIRED_LOGN_LO) && REQUIRED_LOGN_LO < 3 && Math.pow(10, VIF_CROSS_KLO) < 20,
  },
  {
    // (C) The required span is several times the observed span (span ratio > 4).
    id: 'imp34607-required-span-multiple-of-observed',
    description: 'the required log N span exceeds ~4x the observed ~8.6 span',
    holds: () => SPAN_RATIO > 4 && REQUIRED_SPAN > 40,
  },
  {
    // (D) At the VIF=10 crossing the correlation matches the |r| = 0.9487 rule-of-thumb value.
    id: 'imp34607-threshold-corr-matches-rule',
    description: 'at the VIF=10 crossing |r| ~0.9487 (VIF definition consistency check)',
    holds: () => Math.abs(Math.abs(VIF_CROSS.r) - 0.948683) < 2e-3,
  },
  {
    // (E) The sweep is monotone: correlation/VIF strictly decrease as the span widens (kLo drops).
    id: 'imp34607-sweep-monotone-decreasing',
    description: 'predictor correlation strictly decreases as the synthetic span widens',
    holds: () => SWEEP_TABLE.every((r, i) => i === 0 || r.predictorCorr < SWEEP_TABLE[i - 1].predictorCorr),
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34607-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34607_DEFLOW_SECOND_ORDER_IDENTIFIABILITY_WINDOW.isRigorous === false &&
      /NO QED/.test(IMP34607_DEFLOW_SECOND_ORDER_IDENTIFIABILITY_WINDOW.verdict) &&
      /refereed bound is changed/i.test(IMP34607_DEFLOW_SECOND_ORDER_IDENTIFIABILITY_WINDOW.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34607_DEFLOW_SECOND_ORDER_IDENTIFIABILITY_WINDOW.verdict),
  },
];

for (const a of IMP34607_DEFLOW_SECOND_ORDER_IDENTIFIABILITY_WINDOW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34607-deflow-second-order-identifiability-window assertion failed: ${a.id}`);
  }
}
