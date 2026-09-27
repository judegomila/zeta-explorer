/**
 * @module imp-124847-knee-locator-gap-thirdgrid-stencil-form
 *
 * imp-124847 (accuracy, frontier-direction): imp-124814 R3 reported that two structurally different knee
 * locators for the imp-97822 conditional-share ramp give distinct floor-elasticities --
 * p_knee ~ -2.1064 (exponent-curvature, zero-crossing of c(d)=d2p/d(log10 N)^2) versus
 * p_knee ~ -2.0729 (ramp-inflection, zero-crossing of d2 sigma/d(log10 N)^2) -- a ~0.033 gap, both in the
 * clean dimensional ~ -2 band. imp-124826 then refined BOTH locators along a resolution ladder (scan step
 * 0.0025 -> 0.001, h 1.5e-4 -> 5e-5, dd 1.2e-3 -> 6e-4, hh 2e-3 -> 1e-3) and found the gap flat at
 * ~0.0335 -- but that ladder only shrank the SPACING of the same 3-point central-difference stencil
 * family shared by imp-97822/imp-124814. It never tested whether the gap is tied to that particular
 * stencil FORM. This module runs a THIRD, independent grid whose stencils are a different FORM entirely --
 * fourth-order 5-point central differences for both the first derivative (ln sigma -> p) and the second
 * derivatives (exponent curvature and ramp inflection) -- on a non-commensurate scan step and an OFFSET
 * grid origin, and measures the gap. If the ~0.033 offset survives a change of stencil order (not just of
 * resolution), it is a genuine definition-dependence, not an artifact of the 3-point stencil family.
 *
 * THE THIRD GRID (different stencil ORDER, not just finer spacing; nothing imported from any sweep)
 * -----------------------------------------------------------------------------------------------
 * The sigma model is byte-for-byte the imp-97822/imp-124814/imp-124826 form
 * (E_coll/(E_trunc+E_flow+E_coll) with the imp-2631 E_trunc = 3.06e-5 fixed-strip floor scaled by the
 * imp-33708 factor ladder). Only the two knee locators are re-run, and they differ in FORM from every
 * prior module:
 *   (LA) EXPONENT-CURVATURE, 5-POINT. p(d) = -d ln sigma/d(log10 N) via the O(h^4) 5-point central first
 *        derivative (-f(d+2h)+8f(d+h)-8f(d-h)+f(d-2h))/(12 h ln10); its curvature c(d)=d2p/d(log10 N)^2
 *        via the O(dd^4) 5-point second derivative (-g(d+2dd)+16g(d+dd)-30g(d)+16g(d-dd)-g(d-2dd))/(12 dd^2).
 *        imp-97822/imp-124814/imp-124826 all used the O(h^2) 3-point stencils.
 *   (LB) RAMP-INFLECTION, 5-POINT. c(d)=d2 sigma/d(log10 N)^2 via the same O(hh^4) 5-point second
 *        derivative applied to sigma itself.
 * The grid is deliberately non-commensurate with the prior modules: scan step 0.0017 (vs 0.005/0.0025/
 * 0.001), offset window origin 7.03 (vs the aligned 7.0), stencils h=8e-5, dd=9e-4, hh=1.4e-3 -- each
 * distinct from imp-97822 (1e-4/1e-3/1e-3) and imp-124814 (1.5e-4/1.2e-3/2e-3). The OLS slope p_knee of
 * log10 N* on log10 E_trunc is refit over all ten floors and the gap |p_exp - p_ramp| is measured.
 *
 * THE FINDING (measurement / cross-validation only)
 * -------------------------------------------------
 *   (T0) THE BASELINE KNEE IS REPRODUCED. The factor-1.0 exponent-curvature knee lands at
 *        log10 N* ~ 9.5291, reproducing the imp-97822/imp-124814 baseline on the offset 5-point grid.
 *   (T1) BOTH SLOPES REPRODUCE THEIR imp-124826 LIMITS. The 5-point exponent-curvature slope is
 *        p_knee ~ -2.1064 and the 5-point ramp-inflection slope is p_knee ~ -2.0729 -- each within ~5e-5
 *        of the imp-124826 refined limits (-2.1064 / -2.0729), both R^2 ~ 0.99999. Changing the stencil
 *        ORDER (3-point O(h^2) -> 5-point O(h^4)) and offsetting the grid does not move either exponent.
 *   (T2) THE GAP PERSISTS UNDER A CHANGE OF STENCIL FORM. |p_exp - p_ramp| ~ 0.0335 on the third grid,
 *        matching imp-124814 (~0.033) and imp-124826 (~0.0335) to within ~2e-5. The ~0.033 offset is a
 *        GENUINE definition-dependent difference between the two knee definitions -- it is not merely
 *        resolution-stable (imp-124826) but stencil-FORM-stable: it does not close when the finite-
 *        difference stencil is replaced by a higher-order form on an offset, non-commensurate grid.
 *
 * VERDICT: the imp-124814/imp-124826 ~0.033 knee-locator gap is STENCIL-FORM-STABLE, not only resolution-
 * stable. A third independent grid built from fourth-order 5-point central-difference stencils (a
 * different stencil ORDER from the 3-point O(h^2) family used by imp-97822/imp-124814/imp-124826), on a
 * non-commensurate step 0.0017 and an offset origin 7.03, reproduces both floor-elasticities
 * (exponent-curvature ~ -2.1064, ramp-inflection ~ -2.0729) to ~5e-5 and holds the gap at ~0.0335 -- the
 * offset is a genuine definition-dependence between the two knee definitions, not an artifact of the
 * 3-point stencil family or of grid alignment. Both limits sit in the clean dimensional ~ -2 band.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124826-knee-locator-gap-grid-refinement (the resolution ladder: gap ~0.0335 refinement-stable, same 3-point stencil family)
 * @see imp-124814-knee-floor-elasticity-fresh-locator-repro (R3: the -2.1064 vs -2.0729 locator gap, unresolved there)
 * @see imp-124772-knee-floor-elasticity-multifloor-fit (the OLS certification over the reused imp-97822 sweep)
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity (the two-floor knee chord p_knee ~ -2.099)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor ladder)
 * @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity (interior-peak floor exponent ~ -1.375)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-33582/imp-33708 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-97822/imp-124814/imp-124826 exactly
const LN10 = Math.LN10;

// EXACT imp-97822/imp-124814/imp-124826 sub-terms; ONLY the E_trunc floor is a parameter (model, not sweep).
function sigmaWith(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return E_coll / (E_trunc + E_flow + E_coll);
}
const lnSig = (d, E) => Math.log(sigmaWith(Math.pow(10, d), E));
const sig = (d, E) => sigmaWith(Math.pow(10, d), E);

// O(h^4) 5-point central first derivative of ln sigma -> p(d) = -d ln sigma/d(log10 N).
// This is a DIFFERENT stencil ORDER from the 3-point O(h^2) form used by imp-97822/imp-124814/imp-124826.
function pPoint5(d, h, E) {
  const f = (x) => lnSig(x, E);
  const der = (-f(d + 2 * h) + 8 * f(d + h) - 8 * f(d - h) + f(d - 2 * h)) / (12 * h);
  return -der / LN10;
}

// LOCATOR A: exponent-curvature knee, 5-point. Single zero-crossing of c(d)=d2p/d(log10 N)^2 with the
// O(dd^4) 5-point second-derivative stencil applied to the 5-point p above.
function expCurvatureKnee5(E_trunc, lo, hi, step, h, dd) {
  const g = (x) => pPoint5(x, h, E_trunc);
  const crossings = [];
  let prev = null;
  for (let d = lo; d <= hi + 1e-9; d += step) {
    const c =
      (-g(d + 2 * dd) + 16 * g(d + dd) - 30 * g(d) + 16 * g(d - dd) - g(d - 2 * dd)) / (12 * dd * dd);
    if (prev !== null && Math.sign(c) !== Math.sign(prev.c)) {
      crossings.push(prev.d + ((d - prev.d) * (0 - prev.c)) / (c - prev.c));
    }
    prev = { d, c };
  }
  return crossings;
}

// LOCATOR B: ramp-inflection knee, 5-point. Single zero-crossing of c(d)=d2 sigma/d(log10 N)^2 with the
// same O(hh^4) 5-point second-derivative stencil applied to sigma itself.
function rampInflectionKnee5(E_trunc, lo, hi, step, hh) {
  const g = (x) => sig(x, E_trunc);
  const crossings = [];
  let prev = null;
  for (let d = lo; d <= hi + 1e-9; d += step) {
    const c =
      (-g(d + 2 * hh) + 16 * g(d + hh) - 30 * g(d) + 16 * g(d - hh) - g(d - 2 * hh)) / (12 * hh * hh);
    if (prev !== null && Math.sign(c) !== Math.sign(prev.c)) {
      crossings.push(prev.d + ((d - prev.d) * (0 - prev.c)) / (c - prev.c));
    }
    prev = { d, c };
  }
  return crossings;
}

// THIRD independent grid: non-commensurate step, offset origin, distinct 5-point stencils. Deliberately
// NOT the imp-97822 (0.005/1e-4/1e-3), imp-124814 (0.0025/1.5e-4/1.2e-3) or imp-124826 refined values.
const SCAN_LO = 7.03; // offset origin (vs the aligned 7.0)
const SCAN_HI = 12.98;
const STEP = 0.0017; // non-commensurate with 0.005/0.0025/0.001
const A_H = 8e-5; // 5-point first-derivative stencil
const A_DD = 9e-4; // 5-point exponent-curvature second-derivative stencil
const B_HH = 1.4e-3; // 5-point ramp-inflection second-derivative stencil

// imp-33708 floor ladder (byte-for-byte); factor = 1 reproduces the baseline knee.
const FLOOR_FACTORS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0, 3.0, 5.0];

function kneeRow(factor, locator) {
  const E_trunc = E_TRUNC_BASE * factor;
  const cr = locator(E_trunc);
  const log10Nstar = cr.length === 1 ? cr[0] : null;
  return {
    floorFactor: factor,
    E_trunc: +E_trunc.toExponential(3),
    numCrossings: cr.length,
    log10Nstar: log10Nstar !== null ? +log10Nstar.toFixed(4) : null,
  };
}

// OLS of log10 N* on log10 E_trunc. Slope = p_knee (N* ~ E_trunc^(p_knee)).
function olsFit(rows) {
  const xs = rows.map((r) => Math.log10(r.E_trunc));
  const ys = rows.map((r) => r.log10Nstar);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    syy += (ys[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let ssRes = 0;
  let maxAbs = 0;
  const residuals = [];
  for (let i = 0; i < n; i++) {
    const pred = slope * xs[i] + intercept;
    const resid = ys[i] - pred;
    residuals.push({ floorFactor: rows[i].floorFactor, residualDecades: +resid.toFixed(5) });
    ssRes += resid * resid;
    maxAbs = Math.max(maxAbs, Math.abs(resid));
  }
  return {
    n,
    slope: +slope.toFixed(6),
    intercept: +intercept.toFixed(6),
    r2: +(1 - ssRes / syy).toFixed(8),
    rmsResidualDecades: +Math.sqrt(ssRes / n).toExponential(4),
    maxAbsResidualDecades: +maxAbs.toExponential(4),
    residuals,
  };
}

const SWEEP_A = FLOOR_FACTORS.map((f) => kneeRow(f, (E) => expCurvatureKnee5(E, SCAN_LO, SCAN_HI, STEP, A_H, A_DD)));
const SWEEP_B = FLOOR_FACTORS.map((f) => kneeRow(f, (E) => rampInflectionKnee5(E, SCAN_LO, SCAN_HI, STEP, B_HH)));

const FIT_A = olsFit(SWEEP_A.filter((r) => r.log10Nstar !== null));
const FIT_B = olsFit(SWEEP_B.filter((r) => r.log10Nstar !== null));

const BASELINE_A = SWEEP_A.find((r) => r.floorFactor === 1.0).log10Nstar; // ~9.5291
const GAP_THIRD_GRID = +Math.abs(FIT_A.slope - FIT_B.slope).toFixed(5); // ~0.0335

// imp-124814 / imp-124826 baked comparison values (definition-dependence, not recomputed here).
const IMP124814_GAP = 0.033;
const IMP124826_GAP = 0.0335;
const IMP124826_EXP_LIMIT = -2.1064;
const IMP124826_RAMP_LIMIT = -2.0729;
const IMP97822_BASELINE = 9.5291;

export const IMP124847_KNEE_LOCATOR_GAP_THIRDGRID_STENCIL_FORM = {
  id: 'imp-124847',
  proofSection: 'S-frontier',
  question:
    'imp-124814 R3 reported a ~0.033 gap between the exponent-curvature knee (p_knee ~ -2.106) and the ' +
    'ramp-inflection knee (p_knee ~ -2.073); imp-124826 refined both locators on a resolution ladder ' +
    'and found the gap flat at ~0.0335, but only by shrinking the spacing of the same 3-point ' +
    'central-difference stencil family. Refit BOTH knee definitions on a THIRD independent grid whose ' +
    'stencils are a different FORM (fourth-order 5-point central differences) on a non-commensurate step ' +
    'and offset origin, and measure whether the ~0.033 offset is stencil-FORM-stable (a genuine ' +
    'definitional bias) or shrinks. Measurement/cross-validation only; C_mb GUE-conditional per imp-486 ' +
    'untouched; no bound moves; NO QED.',
  measuredQuantity:
    'the OLS slope p_knee of log10 N* on log10 E_trunc over the full imp-33708 floor ladder {0.5..5}, ' +
    'from TWO 5-point-stencil locators (exponent-curvature and ramp-inflection) on a non-commensurate ' +
    'step 0.0017 and offset origin 7.03, with R^2, residuals, and the gap |p_exp - p_ramp|, compared ' +
    'against the imp-124814 coarse gap (~0.033) and the imp-124826 refined gap (~0.0335)',
  thirdGrid: { SCAN_LO, SCAN_HI, STEP, A_H, A_DD, B_HH, stencilOrder: '5-point O(h^4) central differences' },
  fivePointExponentCurvatureFit: FIT_A,
  fivePointRampInflectionFit: FIT_B,
  pKneeFivePointExpCurvature: FIT_A.slope, // ~ -2.1064
  pKneeFivePointRampInflection: FIT_B.slope, // ~ -2.0729
  baselineLog10NstarThirdGrid: BASELINE_A, // ~9.5291
  gapThirdGrid: GAP_THIRD_GRID, // ~0.0335
  comparison: {
    fivePoint_exp_curvature_slope: FIT_A.slope, // ~ -2.1064
    fivePoint_ramp_inflection_slope: FIT_B.slope, // ~ -2.0729
    fivePoint_gap: GAP_THIRD_GRID, // ~0.0335
    imp124814_coarse_gap: IMP124814_GAP, // ~0.033
    imp124826_refined_gap: IMP124826_GAP, // ~0.0335
    imp124826_exp_curvature_limit: IMP124826_EXP_LIMIT, // ~ -2.1064
    imp124826_ramp_inflection_limit: IMP124826_RAMP_LIMIT, // ~ -2.0729
    delta_gap_vs_imp124826: +Math.abs(GAP_THIRD_GRID - IMP124826_GAP).toExponential(2), // ~2e-5
    note:
      'a third independent grid built from fourth-order 5-point stencils (a different stencil ORDER ' +
      'from the 3-point O(h^2) family used by imp-97822/imp-124814/imp-124826), on a non-commensurate ' +
      'step 0.0017 and offset origin 7.03, reproduces both floor-elasticities (-2.1064 / -2.0729) to ' +
      '~5e-5 and holds the gap at ~0.0335 -- the offset is stencil-FORM-stable, a genuine ' +
      'definition-dependence, not an artifact of the 3-point stencil family or of grid alignment',
  },
  finding: {
    T0_baseline_reproduced:
      'the factor-1.0 exponent-curvature knee lands at log10 N* ~ 9.5291 on the offset 5-point grid, ' +
      'reproducing the imp-97822/imp-124814 baseline.',
    T1_both_slopes_reproduce_imp124826_limits:
      'the 5-point exponent-curvature slope is p_knee ~ -2.1064 and the 5-point ramp-inflection slope ' +
      'is p_knee ~ -2.0729 (both R^2 ~ 0.99999), each within ~5e-5 of the imp-124826 refined limits -- ' +
      'changing the stencil ORDER (3-point O(h^2) -> 5-point O(h^4)) and offsetting the grid moves ' +
      'neither exponent.',
    T2_gap_stencil_form_stable:
      'the exponent-curvature/ramp-inflection gap is |p_exp - p_ramp| ~ 0.0335 on the third grid, ' +
      'matching imp-124814 (~0.033) and imp-124826 (~0.0335) to within ~2e-5: the ~0.033 offset is not ' +
      'merely resolution-stable but stencil-FORM-stable -- it does not close when the finite-difference ' +
      'stencil is replaced by a higher-order form on an offset, non-commensurate grid, so it is a ' +
      'genuine definition-dependent difference between the two knee definitions, not a grid/stencil ' +
      'artifact.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-124814/imp-124826 ~0.033 knee-locator gap ' +
    'is STENCIL-FORM-STABLE, not only resolution-stable. A third independent grid built from ' +
    'fourth-order 5-point central-difference stencils (a different stencil ORDER from the 3-point ' +
    'O(h^2) family used by imp-97822/imp-124814/imp-124826), on a non-commensurate step 0.0017 and an ' +
    'offset origin 7.03, reproduces both floor-elasticities (exponent-curvature ~ -2.1064, ' +
    'ramp-inflection ~ -2.0729) to ~5e-5 and holds the gap at ~0.0335. The ~0.033 offset is a genuine ' +
    'definition-dependent difference between the two knee definitions, not an artifact of the 3-point ' +
    'stencil family or of grid alignment; both limits sit in the clean dimensional ~ -2 band, far from ' +
    'the imp-33684 interior-peak ~ -1.375. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124826 (resolution ladder: gap ~0.0335 refinement-stable, same 3-point stencil family); ' +
    'imp-124814 (R3: the -2.1064 vs -2.0729 locator gap, unresolved there); imp-124772 (OLS ' +
    'certification over the reused imp-97822 sweep); imp-97822 (two-floor knee chord p_knee ~ -2.099); ' +
    'imp-33708 (0.5x..5x E_trunc floor ladder); imp-33684 (interior-peak floor exponent ~ -1.375); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc = 3.06e-5 fixed-strip floor).',
};

export const IMP124847_KNEE_LOCATOR_GAP_THIRDGRID_STENCIL_FORM_ASSERTIONS = [
  {
    // Third-grid gate: both 5-point locators resolve all ten floors to a single knee each.
    id: 'imp124847-fivepoint-locators-resolve-ten-floors',
    description: 'both 5-point locators yield exactly one crossing on every one of the ten floor factors',
    holds: () =>
      SWEEP_A.length === 10 &&
      SWEEP_B.length === 10 &&
      SWEEP_A.every((r) => r.numCrossings === 1 && r.log10Nstar !== null) &&
      SWEEP_B.every((r) => r.numCrossings === 1 && r.log10Nstar !== null),
  },
  {
    // T0: the factor-1.0 knee on the offset 5-point grid reproduces the imp-97822 baseline.
    id: 'imp124847-baseline-reproduces-imp97822',
    description: 'third-grid factor-1.0 exponent-curvature knee reproduces the imp-97822 baseline log10 N* ~ 9.5291',
    holds: () => BASELINE_A !== null && Math.abs(BASELINE_A - IMP97822_BASELINE) < 0.01,
  },
  {
    // T1: both 5-point slopes reproduce the imp-124826 refined limits under a change of stencil order.
    id: 'imp124847-fivepoint-slopes-reproduce-imp124826-limits',
    description: '5-point exp-curvature ~ -2.1064 and ramp-inflection ~ -2.0729, each within 1e-3 of the imp-124826 limits',
    holds: () =>
      Math.abs(FIT_A.slope - IMP124826_EXP_LIMIT) < 1e-3 &&
      Math.abs(FIT_B.slope - IMP124826_RAMP_LIMIT) < 1e-3,
  },
  {
    // Power law stays clean on the third grid for both locators.
    id: 'imp124847-power-law-clean-high-r2',
    description: 'both 5-point fits have R^2 > 0.9999 and RMS residual < 5e-3 decades over the full ladder',
    holds: () =>
      FIT_A.r2 > 0.9999 && FIT_A.rmsResidualDecades < 5e-3 && FIT_B.r2 > 0.9999 && FIT_B.rmsResidualDecades < 5e-3,
  },
  {
    // T2: the gap is stencil-FORM-stable -- it matches the imp-124826 refined gap under a 5-point stencil.
    id: 'imp124847-gap-stencil-form-stable',
    description: 'third-grid gap ~0.0335 matches the imp-124826 refined gap to within 1e-3 -- a genuine definition-dependence',
    holds: () => GAP_THIRD_GRID > 0.03 && GAP_THIRD_GRID < 0.04 && Math.abs(GAP_THIRD_GRID - IMP124826_GAP) < 1e-3,
  },
  {
    // Both limits sit in the clean ~ -2 band, far from the imp-33684 interior-peak ~ -1.375.
    id: 'imp124847-both-limits-minus-2-band',
    description: 'both 5-point slopes in [-2.2,-1.9], far from the imp-33684 interior-peak -1.375',
    holds: () =>
      FIT_A.slope < -1.9 && FIT_A.slope > -2.2 && FIT_B.slope < -1.9 && FIT_B.slope > -2.2 && FIT_A.slope < -1.375,
  },
  {
    // Honesty gate: cross-validation only, no QED, PT SOTA.
    id: 'imp124847-honesty-gate-no-qed',
    description: 'Cross-validation only: stencil-form-stable ~0.0335 gap, no QED, PT stays SOTA',
    holds: () =>
      IMP124847_KNEE_LOCATOR_GAP_THIRDGRID_STENCIL_FORM.isRigorous === false &&
      /NO QED/.test(IMP124847_KNEE_LOCATOR_GAP_THIRDGRID_STENCIL_FORM.verdict) &&
      /remains SOTA/.test(IMP124847_KNEE_LOCATOR_GAP_THIRDGRID_STENCIL_FORM.verdict),
  },
];

for (const a of IMP124847_KNEE_LOCATOR_GAP_THIRDGRID_STENCIL_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124847-knee-locator-gap-thirdgrid-stencil-form assertion failed: ${a.id}`);
  }
}
