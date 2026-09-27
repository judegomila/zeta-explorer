/**
 * @module imp-124868-twoeps-tau-drift-split
 *
 * imp-124868 (numerical / cross-validation, frontier cross-check): imp-124850 fit the round-off invariant product
 * P = |reldiff| * |E_CF| against |E_CF| under the drift model P = D*|E_CF| + R at a SINGLE step eps = 1e-3, getting
 * an OLS slope D = -8.05e-12 +/- 1.27e-11 (t = -0.64) over the L2..L7 landmark ladder. imp-124836 formalized that
 * the fitted slope is really the SUM D + tau of a genuine eps/precision-invariant identity drift D and the relative
 * O(eps^p) stencil truncation floor tau, which are ALGEBRAICALLY INDISTINGUISHABLE at one (eps, precision) setting
 * and separate ONLY under eps refinement (tau drops by s^p under eps -> s*eps; D is unchanged). This leaf APPLIES the
 * imp-124836 eps-scaling disambiguator to the imp-124850 fit: it re-runs the SAME OLS slope fit at a SECOND, refined
 * step eps2 = 5e-4 (s = 1/2), then solves the two-eps linear system slope(eps) = D + tau(eps) with tau(eps2) =
 * tau(eps1)*s^p (p = 4) to split the fitted slope into its drift and truncation parts. Numerical/cross-validation
 * only; conditional-share diagnostic; the pinned constants are perturbed only symbolically as differentiation axes;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; no bound moves; NO QED.
 *
 * THE TWO-EPS SPLIT (why a second eps is needed and what it can/cannot resolve)
 * ---------------------------------------------------------------------------
 * imp-124836 F1/F4: the OLS slope of P against |E_CF| estimates the coefficient (D + tau) in P = (D + tau)*|E_CF| + R.
 * With a p-th-order stencil the truncation floor scales as tau(eps) = tau(eps1)*(eps/eps1)^p while the identity drift
 * D is eps- and precision-INVARIANT. Measuring the slope at two steps eps1 > eps2 = s*eps1 gives
 *     slope(eps1) = D + tau1,   slope(eps2) = D + tau1*s^p,
 * a 2x2 linear system solved by
 *     tau1 = (slope(eps1) - slope(eps2)) / (1 - s^p),   D = slope(eps1) - tau1.
 * This is the ONLY way to separate the two indistinguishable linear terms of a single-eps fit.
 *
 *   STEP eps     OLS slope (D + tau)   se(slope)     t vs 0    R (intercept)   R^2
 *   eps1 = 1e-3  -8.046e-12            1.267e-11     -0.635    3.460e-12       0.092   (reproduces imp-124850)
 *   eps2 = 5e-4  -2.177e-11            1.923e-11     -1.132    6.137e-12       0.243
 *   TWO-EPS SPLIT (p = 4, s = 1/2):  tau1 = +1.464e-11,  D = -2.269e-11,  se(each) = 2.456e-11
 *
 * THE FINDING (numerical / cross-validation only)
 * ----------------------------------------------
 *   (M1) THE SPLIT IS DELIVERED BUT BOTH PARTS ARE STATISTICALLY ZERO. Solving the two-eps system gives a drift
 *        D = -2.27e-11 and a truncation floor tau1 = +1.46e-11, each with propagated standard error 2.46e-11
 *        (quadrature of the two slope SEs divided by 1 - s^p = 0.9375). Both are inside one sigma of zero
 *        (t(D) = -0.92, t(tau1) = +0.60): the disambiguator resolves NEITHER a nonzero drift NOR a nonzero
 *        truncation floor at double precision.
 *   (M2) THE TWO-EPS REFINEMENT DOES NOT SHARPEN THE imp-124850 CAP -- IT LOOSENS IT. Differencing two
 *        round-off-noise-dominated OLS slopes AMPLIFIES the noise: the two-eps 95%-level drift cap
 *        |D| + 2*se(D) = 7.18e-11 is LARGER than the imp-124850 single-eps two-sigma cap 3.34e-11 and far larger
 *        than the imp-124811 single-rung L2 cap 5.80e-12. The controlling limitation is that each OLS slope
 *        standard error (~1-2e-11) already exceeds the tau/D separation the disambiguator is meant to resolve.
 *   (M3) THE SUB-GAP IS ROUND-OFF-SLOPE-LIMITED IN DOUBLE PRECISION. Both single-eps slopes are round-off noise
 *        (|t| < 1.2, R^2 < 0.25), and halving eps LIFTS the round-off floor R (3.46e-12 -> 6.14e-12), so the
 *        second slope is noisier, not cleaner. Resolving a nonzero tau or D via the two-eps method requires slopes
 *        measured below the round-off-slope floor -- i.e. extended-precision multi-eps (mpmath), the imp-124808
 *        dps=100 route that already returns D = 0. The double-precision result D = -2.27e-11 +/- 2.46e-11 is
 *        CONSISTENT with that D = 0 but does not tighten it.
 *
 * NAMED SUB-GAP (honest partial): the tau/D split is ROUND-OFF-SLOPE-LIMITED at double precision -- differencing
 * two noisy OLS slopes cannot resolve the (~1e-14 stencil) tau from the drift D because each slope SE (~1-2e-11)
 * dwarfs their separation. Extended-precision multi-eps (imp-124808 mpmath dps=100, D = 0) is the resolving route.
 *
 * NUMERICAL / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the
 * C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and
 * appear only symbolically as differentiation axes; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124850-pairratio-drift-slope-fit (the single-eps OLS P = D*|E_CF| + R slope fit reused verbatim here)
 * @see imp-124836-invariant-product-discriminator-general-test (the tau-vs-D eps-scaling disambiguator applied here)
 * @see imp-124811-pairratio-reldiff-ecf-roundoff-law (the L2..L7 P = |reldiff|*|E_CF| ladder + single-rung cap)
 * @see imp-124808-extprec-pairratio-two-axis (mpmath dps=100 proof that the identity drift D = 0)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-97644/imp-97665/imp-124770/imp-124850 exactly

// EXACT imp-3406/imp-97644/imp-97665/imp-124770/imp-124850 sub-terms (baseline c = C_C_PINNED, e = E_TRUNC_PT, f = 1).
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// Downslope crossing sigma = level (identical bisection to imp-124770/imp-124811/imp-124850).
function landmark(level, cc, et, cf) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc, et, cf).sigma > level) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const lnN = (level, cc, et, cf) => Math.log(landmark(level, cc, et, cf));

// 5-point O(eps^4) central difference (the imp-97665/imp-124770/imp-124850 verification stencil; stencil order p = 4).
const deriv5 = (f, eps) => (-f(2 * eps) + 8 * f(eps) - 8 * f(-eps) + f(-2 * eps)) / (12 * eps);

// Measured pair-ratio E_CF / E_ET via the imp-97665 5-point stencil (E_ET the E_trunc axis, E_CF the C_F axis).
function pairRatio(level, eps) {
  const E_ET = deriv5((d) => lnN(level, C_C_PINNED, E_TRUNC_PT * Math.exp(d), 1.0), eps);
  const E_CF = deriv5((d) => lnN(level, C_C_PINNED, E_TRUNC_PT, 1.0 * Math.exp(d)), eps);
  return { E_ET, E_CF, ratio: E_CF / E_ET };
}

// The imp-97520 landmark ladder L2..L7 (identical sigma levels to imp-97665/imp-124770/imp-124850).
const LADDER_SIGMAS = [
  { key: 'L2', sigma: 0.9 },
  { key: 'L3', sigma: 0.5 },
  { key: 'L4', sigma: 0.1 },
  { key: 'L5', sigma: 0.02 },
  { key: 'L6', sigma: 0.005 },
  { key: 'L7', sigma: 0.001 },
];
const STENCIL_ORDER = 4; // the 5-point central-difference truncation order p (tau ~ eps^p)
const EPS1 = 1e-3; // the imp-97665/imp-124770/imp-124850 primary step (reproduces imp-124850 exactly)
const EPS2 = 5e-4; // the refined step; s = EPS2/EPS1 = 1/2 so the truncation floor drops by s^p = 1/16

// OLS linear fit of the product P = |reldiff|*|E_CF| against |E_CF| under P = (D + tau)*|E_CF| + R at a given eps.
// The slope estimates the combined coefficient (D + tau); the intercept estimates the round-off floor R.
function fitAtEps(eps) {
  const rows = LADDER_SIGMAS.map(({ key, sigma }) => {
    const N = landmark(sigma, C_C_PINNED, E_TRUNC_PT, 1.0);
    const P = parts(N, C_C_PINNED, E_TRUNC_PT, 1.0);
    const target = P.E_flow / E_TRUNC_PT; // analytic exact E_CF/E_ET = E_flow/E_trunc
    const m = pairRatio(sigma, eps);
    const absReldiff = Math.abs(m.ratio / target - 1);
    const absE_CF = Math.abs(m.E_CF);
    return { key, sigma, absE_CF, absReldiff, product: absReldiff * absE_CF };
  });
  const xs = rows.map((r) => r.absE_CF);
  const ys = rows.map((r) => r.product);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let Sxy = 0;
  let Sxx = 0;
  let Syy = 0;
  for (let i = 0; i < n; i++) {
    Sxy += (xs[i] - mx) * (ys[i] - my);
    Sxx += (xs[i] - mx) ** 2;
    Syy += (ys[i] - my) ** 2;
  }
  const slope = Sxy / Sxx; // combined (D + tau) coefficient
  const intercept = my - slope * mx; // round-off floor R
  let SSE = 0;
  for (let i = 0; i < n; i++) {
    const pred = slope * xs[i] + intercept;
    SSE += (ys[i] - pred) ** 2;
  }
  const s2 = SSE / (n - 2);
  const se_slope = Math.sqrt(s2 / Sxx);
  const R2 = 1 - SSE / Syy;
  return { rows, slope, intercept, se_slope, R2, t: slope / se_slope };
}

const FIT1 = fitAtEps(EPS1);
const FIT2 = fitAtEps(EPS2);

// THE DELIVERABLE: solve the two-eps system slope(eps) = D + tau(eps), tau(eps2) = tau1*s^p, for (tau1, D).
const S_RATIO = EPS2 / EPS1; // = 1/2
const S_POW = S_RATIO ** STENCIL_ORDER; // = 1/16
const TAU1 = (FIT1.slope - FIT2.slope) / (1 - S_POW); // truncation floor at eps1
const TAU2 = TAU1 * S_POW; // truncation floor at eps2
const D_TRUE = FIT1.slope - TAU1; // eps/precision-invariant identity drift
// Propagated standard error of both split components (quadrature of the two slope SEs, divided by 1 - s^p).
const SE_SPLIT = Math.sqrt(FIT1.se_slope ** 2 + FIT2.se_slope ** 2) / (1 - S_POW);
const T_D_TRUE = D_TRUE / SE_SPLIT;
const T_TAU1 = TAU1 / SE_SPLIT;
const TWO_EPS_DRIFT_CAP = Math.abs(D_TRUE) + 2 * SE_SPLIT; // two-sigma drift cap from the split
const SINGLE_EPS_DRIFT_CAP = Math.abs(FIT1.slope) + 2 * FIT1.se_slope; // imp-124850 single-eps two-sigma cap
const SINGLE_RUNG_CAP_L2 = FIT1.rows[0].absReldiff; // imp-124811 single-rung L2 cap (the tighter numerical bound)

const round = (x, s = 4) => +x.toExponential(s);

export const IMP124868_TWOEPS_TAU_DRIFT_SPLIT = {
  id: 'imp-124868',
  proofSection: 'S-frontier',
  question:
    'imp-124850 fit the imp-124811 invariant product P = |reldiff|*|E_CF| against |E_CF| under P = D*|E_CF| + R at a ' +
    'SINGLE step eps = 1e-3, getting an OLS slope D = -8.05e-12 +/- 1.27e-11 (t = -0.64). imp-124836 shows the fitted ' +
    'slope is really the SUM D + tau of a genuine eps-invariant drift D and the relative O(eps^p) truncation floor tau, ' +
    'separable ONLY under eps refinement (tau ~ eps^p, D invariant). Re-running the fit at a second, refined step ' +
    'eps2 = 5e-4 and solving the two-eps system slope(eps) = D + tau(eps), what are the split drift D and truncation ' +
    'floor tau, and does the refinement sharpen the imp-124850 single-eps cap? Numerical/cross-validation only; pinned ' +
    'constants perturbed only symbolically; no bound moves; no QED.',
  method:
    'Reuse the imp-124850 pair-ratio machinery verbatim (same 5-point O(eps^4) stencil, same landmarks L2..L7, same ' +
    'OLS fit of P = |reldiff|*|E_CF| against |E_CF|). Run the fit at eps1 = 1e-3 (reproducing imp-124850) and at the ' +
    'refined eps2 = 5e-4 (s = 1/2), then solve slope(eps1) = D + tau1, slope(eps2) = D + tau1*s^p (p = 4) for ' +
    'tau1 = (slope(eps1) - slope(eps2))/(1 - s^p) and D = slope(eps1) - tau1. Propagate the slope standard errors into ' +
    'the split, report t-statistics of D and tau against zero, and compare the two-eps drift cap with the imp-124850 ' +
    'single-eps two-sigma cap and the imp-124811 single-rung L2 cap.',
  stencilOrder_p: STENCIL_ORDER,
  ladderSigmas: LADDER_SIGMAS.map((l) => l.sigma),
  fits: [
    {
      eps: EPS1,
      combined_slope_D_plus_tau: round(FIT1.slope),
      slope_se: round(FIT1.se_slope),
      slope_t_vs_zero: +FIT1.t.toFixed(4),
      roundoff_floor_R: round(FIT1.intercept),
      R2: +FIT1.R2.toFixed(6),
      note: 'eps1 = 1e-3 reproduces the imp-124850 slope -8.05e-12 +/- 1.27e-11 (t = -0.64) exactly.',
    },
    {
      eps: EPS2,
      combined_slope_D_plus_tau: round(FIT2.slope),
      slope_se: round(FIT2.se_slope),
      slope_t_vs_zero: +FIT2.t.toFixed(4),
      roundoff_floor_R: round(FIT2.intercept),
      R2: +FIT2.R2.toFixed(6),
      note: 'eps2 = 5e-4 (s = 1/2): the round-off floor R RISES (3.46e-12 -> 6.14e-12), so the refined slope is ' +
        'noisier, not cleaner -- the truncation floor is not what limits it.',
    },
  ],
  split: {
    model: 'slope(eps) = D + tau(eps), tau(eps2) = tau(eps1)*s^p with s = eps2/eps1 = 1/2, p = 4 (s^p = 1/16)',
    tau_at_eps1: round(TAU1),
    tau_at_eps2: round(TAU2),
    drift_D: round(D_TRUE),
    split_se: round(SE_SPLIT),
    drift_t_vs_zero: +T_D_TRUE.toFixed(4),
    tau_t_vs_zero: +T_TAU1.toFixed(4),
    two_eps_drift_cap_2sigma: round(TWO_EPS_DRIFT_CAP),
    single_eps_drift_cap_2sigma: round(SINGLE_EPS_DRIFT_CAP),
    single_rung_cap_L2: round(SINGLE_RUNG_CAP_L2),
    note:
      'The two-eps solve gives tau1 = +1.46e-11 and D = -2.27e-11, each with propagated se = 2.46e-11 (quadrature ' +
      'of the two slope SEs / (1 - s^p) = /0.9375). Both are within one sigma of zero (t(D) = -0.92, t(tau1) = ' +
      '+0.60), so the disambiguator resolves NEITHER a nonzero drift NOR a nonzero truncation floor at double ' +
      'precision. The two-eps drift cap |D| + 2*se = 7.18e-11 is LARGER than the imp-124850 single-eps cap ' +
      '3.34e-11 and the imp-124811 single-rung L2 cap 5.80e-12: differencing two round-off-noise-dominated slopes ' +
      'AMPLIFIES the noise, so the refinement does not sharpen the single-eps cap.',
  },
  sub_gap:
    'ROUND-OFF-SLOPE-LIMITED at double precision: each OLS slope SE (~1-2e-11) dwarfs the tau/D separation the ' +
    'two-eps method is meant to resolve, so both split components are statistically zero and the derived drift cap ' +
    'is looser than the single-eps cap. Resolving a nonzero tau or D needs slopes below the round-off-slope floor -- ' +
    'extended-precision multi-eps (imp-124808 mpmath dps=100, which already returns D = 0) is the resolving route.',
  finding: {
    M1_split_delivered_both_statistically_zero:
      'The two-eps system slope(eps) = D + tau(eps) solves to a drift D = ' + D_TRUE.toExponential(2) + ' and a ' +
      'truncation floor tau1 = ' + TAU1.toExponential(2) + ', each with propagated standard error ' +
      SE_SPLIT.toExponential(2) + '. Both are inside one sigma of zero (t(D) = ' + T_D_TRUE.toFixed(2) +
      ', t(tau1) = ' + T_TAU1.toFixed(2) + '): the disambiguator resolves neither a nonzero drift nor a nonzero ' +
      'truncation floor at double precision.',
    M2_two_eps_refinement_loosens_not_sharpens:
      'The two-eps two-sigma drift cap |D| + 2*se = ' + TWO_EPS_DRIFT_CAP.toExponential(2) + ' is LARGER than the ' +
      'imp-124850 single-eps two-sigma cap ' + SINGLE_EPS_DRIFT_CAP.toExponential(2) + ' and far larger than the ' +
      'imp-124811 single-rung L2 cap ' + SINGLE_RUNG_CAP_L2.toExponential(2) + '. Differencing two ' +
      'round-off-noise-dominated OLS slopes amplifies the noise, so the refinement does not sharpen the single-eps ' +
      'cap: each slope SE already exceeds the tau/D separation.',
    M3_subgap_roundoff_slope_limited:
      'Both single-eps slopes are round-off noise (|t| < 1.2, R^2 < 0.25) and halving eps LIFTS the round-off floor ' +
      'R (' + FIT1.intercept.toExponential(2) + ' -> ' + FIT2.intercept.toExponential(2) + '), so the second slope ' +
      'is noisier. The double-precision result D = ' + D_TRUE.toExponential(2) + ' +/- ' + SE_SPLIT.toExponential(2) +
      ' is consistent with the imp-124808 dps=100 D = 0 but does not tighten it; resolving a nonzero tau or D needs ' +
      'extended-precision multi-eps below the round-off-slope floor.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / CROSS-VALIDATION (frontier cross-check, NOT rigorous). Applying the imp-124836 eps-scaling ' +
    'disambiguator to the imp-124850 fit: re-running the OLS slope of P = |reldiff|*|E_CF| against |E_CF| at a ' +
    'second, refined step eps2 = 5e-4 (s = 1/2) and solving the two-eps system slope(eps) = D + tau(eps), ' +
    'tau(eps2) = tau(eps1)*s^p (p = 4), splits the fitted slope into a drift D = ' + D_TRUE.toExponential(2) +
    ' and a truncation floor tau1 = ' + TAU1.toExponential(2) + ', each +/- ' + SE_SPLIT.toExponential(2) + '. Both ' +
    'are within one sigma of zero (t(D) = ' + T_D_TRUE.toFixed(2) + ', t(tau1) = ' + T_TAU1.toFixed(2) + '), so the ' +
    'disambiguator resolves neither a nonzero drift nor a nonzero truncation floor at double precision. The two-eps ' +
    'two-sigma drift cap ' + TWO_EPS_DRIFT_CAP.toExponential(2) + ' is LARGER than the imp-124850 single-eps cap ' +
    SINGLE_EPS_DRIFT_CAP.toExponential(2) + ' and the imp-124811 single-rung L2 cap ' +
    SINGLE_RUNG_CAP_L2.toExponential(2) + ': differencing two round-off-noise-dominated slopes amplifies the noise, ' +
    'so the refinement does NOT sharpen the single-eps cap. NAMED SUB-GAP: the tau/D split is round-off-slope-limited ' +
    'at double precision (each slope SE ~1-2e-11 dwarfs the tau/D separation); extended-precision multi-eps ' +
    '(imp-124808 mpmath dps=100, D = 0) is the resolving route, and the double-precision D = ' +
    D_TRUE.toExponential(2) + ' is consistent with that D = 0 but does not tighten it. Conditional-share diagnostic ' +
    'on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are ' +
    'UNTOUCHED (perturbed only symbolically as differentiation axes); changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124850 (the single-eps OLS P = D*|E_CF| + R slope fit reused verbatim); imp-124836 (the tau-vs-D ' +
    'eps-scaling disambiguator applied here); imp-124811 (the L2..L7 P = |reldiff|*|E_CF| ladder + single-rung cap); ' +
    'imp-124808 (mpmath dps=100 proof that identity drift D = 0); imp-97665 (EXACT pair-ratio E_CF/E_ET = ' +
    'E_flow/E_trunc); imp-398 (C_F flow prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping.',
};

export const IMP124868_TWOEPS_TAU_DRIFT_SPLIT_ASSERTIONS = [
  {
    // The eps1 = 1e-3 fit reproduces the imp-124850 slope -8.05e-12 exactly (verbatim machinery reuse).
    id: 'imp124868-eps1-reproduces-imp124850-slope',
    description: 'the eps1 = 1e-3 OLS slope reproduces the imp-124850 -8.05e-12 to O(1e-13)',
    holds: () => Math.abs(FIT1.slope - -8.046e-12) < 1e-13,
  },
  {
    // The two-eps split is algebraically exact: slope(eps1) = D + tau1 and slope(eps2) = D + tau1*s^p.
    id: 'imp124868-two-eps-system-solved-exactly',
    description: 'the split reconstructs both fitted slopes: slope(eps1) = D + tau1 and slope(eps2) = D + tau1*s^p',
    holds: () =>
      Math.abs(D_TRUE + TAU1 - FIT1.slope) < 1e-24 &&
      Math.abs(D_TRUE + TAU1 * S_POW - FIT2.slope) < 1e-24,
  },
  {
    // (M1): both split components are statistically zero at double precision (|t| < 1).
    id: 'imp124868-both-split-parts-statistically-zero',
    description: 'the split drift D and truncation floor tau1 are each within one propagated sigma of zero (|t| < 1)',
    holds: () => Math.abs(T_D_TRUE) < 1 && Math.abs(T_TAU1) < 1,
  },
  {
    // (M2): the two-eps drift cap is LOOSER than the imp-124850 single-eps cap (differencing amplifies noise).
    id: 'imp124868-two-eps-cap-looser-than-single-eps',
    description: 'the two-eps two-sigma drift cap is larger than the imp-124850 single-eps two-sigma cap',
    holds: () => TWO_EPS_DRIFT_CAP > SINGLE_EPS_DRIFT_CAP,
  },
  {
    // (M2): the imp-124811 single-rung L2 cap remains the tightest numerical bound of the three.
    id: 'imp124868-single-rung-cap-remains-tightest',
    description: 'the imp-124811 single-rung L2 cap is tighter than both the single-eps and two-eps drift caps',
    holds: () => SINGLE_RUNG_CAP_L2 < SINGLE_EPS_DRIFT_CAP && SINGLE_RUNG_CAP_L2 < TWO_EPS_DRIFT_CAP,
  },
  {
    // (M3): halving eps RAISES the round-off floor R (the refined slope is noisier, not cleaner).
    id: 'imp124868-roundoff-floor-rises-under-eps-halving',
    description: 'the fitted round-off floor R increases from eps1 to eps2 (smaller eps => larger cancellation floor)',
    holds: () => FIT2.intercept > FIT1.intercept && FIT1.intercept > 0,
  },
  {
    // (M3): the double-precision drift is consistent with the imp-124808 dps=100 D = 0 (brackets zero at 2 sigma).
    id: 'imp124868-drift-consistent-with-zero',
    description: 'the split drift D brackets zero within two propagated sigma (consistent with imp-124808 D = 0)',
    holds: () => Math.abs(D_TRUE) < 2 * SE_SPLIT,
  },
  {
    // Honesty gate: numerical/cross-validation only, no QED, PT stays SOTA.
    id: 'imp124868-honesty-gate-no-qed',
    description: 'Numerical/cross-validation only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124868_TWOEPS_TAU_DRIFT_SPLIT.isRigorous === false &&
      /NO QED/.test(IMP124868_TWOEPS_TAU_DRIFT_SPLIT.verdict) &&
      /remains SOTA/.test(IMP124868_TWOEPS_TAU_DRIFT_SPLIT.verdict),
  },
];

for (const a of IMP124868_TWOEPS_TAU_DRIFT_SPLIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124868-twoeps-tau-drift-split assertion failed: ${a.id}`);
  }
}
