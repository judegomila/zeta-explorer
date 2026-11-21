/**
 * @module imp-124814-knee-floor-elasticity-fresh-locator-repro
 *
 * imp-124814 (accuracy, frontier-direction): imp-124772 CERTIFIED the imp-97822 bracketing-free knee
 * floor-elasticity p_knee ~ -2.099 by an ordinary-least-squares fit over the full imp-33708 0.5x..5x
 * E_trunc floor ladder, reading p_knee_lsq ~ -2.106 with R^2 ~ 0.99999. But imp-124772 did NOT
 * re-locate the knee -- it imported the imp-97822 floorSweep array VERBATIM and ran OLS on those ten
 * pre-computed log10 N*(factor) values. A high R^2 over a reused input array cannot, on its own,
 * distinguish a genuine power law from an artifact of the specific locator numerics that produced the
 * sweep. This module re-derives the ten knees from scratch -- a FRESH bracketing-free curvature
 * locator that never imports the imp-97822 floorSweep -- and refits the OLS slope and residual, so the
 * -2.106 certification is confirmed to be a property of the model, not an inheritance of one array.
 *
 * THE FRESH LOCATOR (no imported sweep -- knees recomputed on an independent grid)
 * ------------------------------------------------------------------------------
 * The sigma model is the identical imp-97822/imp-33708/imp-3406 form (only the E_trunc floor is
 * varied); the fundamental inputs C_C_PINNED and effectiveHeightForN are the model, NOT the sweep, so
 * they are imported. Everything downstream is recomputed:
 *   (LA) EXPONENT-CURVATURE LOCATOR, FRESH NUMERICS. Same conceptual knee as imp-97822 -- the single
 *        zero-crossing of the ramp-exponent curvature c(d)=d2p/d(log10 N)^2, p=-d ln sigma/d ln N --
 *        but on an INDEPENDENT grid: scan step 0.0025 (vs imp-97822 0.005), central-difference step
 *        h=1.5e-4 (vs 1e-4), second-difference step dd=1.2e-3 (vs 1e-3). If the -2.106 slope is real
 *        it must survive a change of stencil and resolution.
 *   (LB) RAMP-INFLECTION LOCATOR, STRUCTURALLY DIFFERENT. A genuinely different knee definition: the
 *        inflection of the ramp sigma ITSELF, the zero-crossing of d2 sigma/d(log10 N)^2, not of the
 *        exponent curvature. If the ~ -2.1 scaling is a property of the E_coll ~ E_trunc balance
 *        rather than of one locator, a different locator must land on the same exponent.
 * Each locator is run once per floor factor in the imp-33708 ladder {0.5..5}; the knee log10 N* is
 * read off and p_knee refit by OLS of log10 N* on log10 E_trunc over all ten floors.
 *
 * THE FINDING (independent reproduction / cross-validation only)
 * -------------------------------------------------------------
 *   (R0) THE FRESH EXPONENT-CURVATURE SLOPE REPRODUCES imp-124772 TO ~2e-5. p_knee_lsq ~ -2.1064 on
 *        the independent grid, within ~2.2e-5 of the imp-124772 reused-sweep value -2.106468 -- the
 *        certification is NOT an artifact of the imp-97822 floorSweep array or its stencil.
 *   (R1) THE POWER LAW IS CLEAN ON THE FRESH KNEES. R^2 ~ 0.99999, RMS residual ~ 1.6e-3 decades,
 *        max-abs ~ 3.0e-3 decades over the ~2.1-decade span -- the same clean straight line
 *        imp-124772 reported, recomputed from independent knees.
 *   (R2) THE RESIDUAL U IS REPRODUCED. The fresh residuals form the same shallow sign-symmetric U
 *        (negative at the 0.5x/5x extremes, positive in the interior) that imp-124772 read off the
 *        reused sweep -- the faint concave-up curvature is a genuine feature of the relation, not a
 *        numerical accident of one grid.
 *   (R3) A STRUCTURALLY DIFFERENT LOCATOR AGREES. The ramp-inflection locator (LB), a different knee
 *        DEFINITION, gives p_knee_lsq ~ -2.073 (R^2 ~ 0.99999) -- within ~0.033 of the
 *        exponent-curvature -2.106 and squarely in the clean dimensional ~ -2 band, far from the
 *        imp-33684 interior-peak ~ -1.375. The ~ -2.1 floor-elasticity is a property of the model's
 *        E_coll ~ E_trunc balance, robust to which inflection defines the knee.
 *
 * VERDICT: the imp-124772 knee floor-elasticity certification p_knee_lsq ~ -2.106 (R^2 ~ 0.99999) is
 * INDEPENDENTLY REPRODUCED. A fresh bracketing-free exponent-curvature locator on an independent grid
 * (no imported floorSweep) recovers -2.1064 to ~2e-5, the same R^2 ~ 0.99999 and the same
 * sign-symmetric residual U; a structurally different ramp-inflection locator recovers -2.073 in the
 * same clean ~ -2 band. The -2.106 is a property of the sigma model's E_coll ~ E_trunc balance, not an
 * artifact of the imp-97822 sweep array or its stencil.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-124772-knee-floor-elasticity-multifloor-fit (the OLS certification over the REUSED imp-97822 sweep; reproduced here)
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity (the two-floor knee fit p_knee ~ -2.099; floorSweep NOT imported here)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor sweep; far-tail exponent ~ -2.099)
 * @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity (interior-peak floor exponent ~ -1.375, the SOFTER contrast)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT } from './imp-124772-knee-floor-elasticity-multifloor-fit.js';
import { IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY } from './imp-97822-sigma-knee-etrunc-floor-elasticity.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-33582/imp-33708 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-97822/imp-33708 exactly
const LN10 = Math.LN10;

// EXACT imp-97822/imp-33708 sub-terms; ONLY the E_trunc floor is a parameter (model, not sweep).
function sigmaWith(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return E_coll / (E_trunc + E_flow + E_coll);
}

// pointwise ramp local exponent p(d) = -d ln sigma/d ln N at log10 N = d (central diff of step h).
function pPointwise(d, h, E_trunc) {
  const sp = Math.log(sigmaWith(Math.pow(10, d + h), E_trunc));
  const sm = Math.log(sigmaWith(Math.pow(10, d - h), E_trunc));
  return -(sp - sm) / ((2 * h) * LN10);
}

// LOCATOR A (fresh numerics of the exponent-curvature knee): single zero-crossing of
// c(d) = d2p/d(log10 N)^2 over [lo,hi]. Independent grid from imp-97822 (step/h/dd all differ).
function expCurvatureKnee(E_trunc, lo, hi, step, h, dd) {
  let prev = null;
  const crossings = [];
  for (let d = lo; d <= hi + 1e-9; d += step) {
    const c =
      (pPointwise(d + dd, h, E_trunc) - 2 * pPointwise(d, h, E_trunc) + pPointwise(d - dd, h, E_trunc)) /
      (dd * dd);
    if (prev !== null && Math.sign(c) !== Math.sign(prev.c)) {
      crossings.push(prev.d + ((d - prev.d) * (0 - prev.c)) / (c - prev.c));
    }
    prev = { d, c };
  }
  return crossings;
}

// LOCATOR B (structurally different knee definition): single zero-crossing of the inflection of the
// ramp sigma ITSELF, c(d) = d2 sigma/d(log10 N)^2 -- not of the exponent curvature.
function rampInflectionKnee(E_trunc, lo, hi, step, hh) {
  let prev = null;
  const crossings = [];
  for (let d = lo; d <= hi + 1e-9; d += step) {
    const sp = sigmaWith(Math.pow(10, d + hh), E_trunc);
    const s0 = sigmaWith(Math.pow(10, d), E_trunc);
    const sm = sigmaWith(Math.pow(10, d - hh), E_trunc);
    const c = (sp - 2 * s0 + sm) / (hh * hh);
    if (prev !== null && Math.sign(c) !== Math.sign(prev.c)) {
      crossings.push(prev.d + ((d - prev.d) * (0 - prev.c)) / (c - prev.c));
    }
    prev = { d, c };
  }
  return crossings;
}

// Independent scan window/grid (deliberately NOT the imp-97822 SCAN_STEP=0.005/H=1e-4/DD=1e-3 values).
const SCAN_LO = 7.0;
const SCAN_HI = 13.0;
const A_STEP = 0.0025; // finer than imp-97822 0.005
const A_H = 1.5e-4; // vs imp-97822 1e-4
const A_DD = 1.2e-3; // vs imp-97822 1e-3
const B_STEP = 0.0025;
const B_HH = 2e-3;

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

const SWEEP_A = FLOOR_FACTORS.map((f) => kneeRow(f, (E) => expCurvatureKnee(E, SCAN_LO, SCAN_HI, A_STEP, A_H, A_DD)));
const SWEEP_B = FLOOR_FACTORS.map((f) => kneeRow(f, (E) => rampInflectionKnee(E, SCAN_LO, SCAN_HI, B_STEP, B_HH)));

const FIT_A = olsFit(SWEEP_A.filter((r) => r.log10Nstar !== null));
const FIT_B = olsFit(SWEEP_B.filter((r) => r.log10Nstar !== null));

// imp-124772 reused-sweep certification value and imp-97822 two-floor chord, baked for comparison.
const IMP124772_SLOPE = IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.fit.slope; // ~ -2.106468
const IMP124772_R2 = IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.fit.r2; // ~ 0.99999271
const IMP97822_TWO_FLOOR = IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY.kneeFloorExponent; // ~ -2.099
const IMP97822_BASELINE = IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY.baselineLog10Nstar; // ~9.5291

const DELTA_A_VS_124772 = +Math.abs(FIT_A.slope - IMP124772_SLOPE).toExponential(3); // ~2.2e-5
const DELTA_B_VS_A = +Math.abs(FIT_B.slope - FIT_A.slope).toFixed(4); // ~0.033
const BASELINE_A = SWEEP_A.find((r) => r.floorFactor === 1.0).log10Nstar; // ~9.5291

export const IMP124814_KNEE_FLOOR_ELASTICITY_FRESH_LOCATOR_REPRO = {
  id: 'imp-124814',
  proofSection: 'S-frontier',
  question:
    'imp-124772 certified the imp-97822 knee floor-elasticity p_knee ~ -2.099 by an OLS slope ' +
    '-2.106 (R^2 ~ 0.99999) computed over the imp-97822 floorSweep array reused VERBATIM. Re-derive ' +
    'the ten knees from scratch with a fresh bracketing-free curvature locator that never imports the ' +
    'floorSweep, refit the OLS slope and residual U, and compare against the imp-124772 values to ' +
    'confirm the certification is not an artifact of the reused sweep. Measurement/cross-validation ' +
    'only; C_mb GUE-conditional per imp-486 untouched; no bound moves; NO QED.',
  measuredQuantity:
    'the OLS slope p_knee of log10 N* on log10 E_trunc over the full imp-33708 floor ladder {0.5..5}, ' +
    'from TWO fresh locators (exponent-curvature on an independent grid, and the structurally ' +
    'different ramp-inflection), with R^2, RMS/max-abs residual and the per-floor residual pattern, ' +
    'compared against the imp-124772 reused-sweep certification',
  freshExponentCurvatureFit: FIT_A,
  freshRampInflectionFit: FIT_B,
  pKneeFreshExpCurvature: FIT_A.slope, // ~ -2.1064
  pKneeFreshRampInflection: FIT_B.slope, // ~ -2.073
  baselineLog10NstarFresh: BASELINE_A, // ~9.5291 (reproduces imp-97822/imp-97708)
  comparison: {
    imp124772_reused_sweep_slope: IMP124772_SLOPE, // ~ -2.106468
    imp124772_reused_sweep_r2: IMP124772_R2, // ~ 0.99999271
    fresh_exp_curvature_slope: FIT_A.slope, // ~ -2.1064
    fresh_exp_curvature_r2: FIT_A.r2, // ~ 0.99999
    fresh_ramp_inflection_slope: FIT_B.slope, // ~ -2.073
    imp97822_two_floor_chord: IMP97822_TWO_FLOOR, // ~ -2.099
    delta_fresh_vs_imp124772: DELTA_A_VS_124772, // ~2.2e-5
    delta_ramp_vs_exp_curvature: DELTA_B_VS_A, // ~0.033
    note:
      'the fresh exponent-curvature locator on an independent grid reproduces the imp-124772 ' +
      'reused-sweep slope -2.106468 to ~2e-5 with the same R^2 ~ 0.99999; a structurally different ' +
      'ramp-inflection locator gives -2.073, within ~0.033 and in the same clean dimensional ~ -2 ' +
      'band -- the certification is a property of the sigma model, not of the reused floorSweep array',
  },
  finding: {
    R0_fresh_exp_curvature_reproduces_imp124772:
      'the fresh exponent-curvature locator (scan step 0.0025 vs imp-97822 0.005, h=1.5e-4 vs 1e-4, ' +
      'dd=1.2e-3 vs 1e-3; floorSweep NOT imported) gives p_knee_lsq ~ -2.1064, within ~2.2e-5 of the ' +
      'imp-124772 reused-sweep value -2.106468 -- the -2.106 certification is not an artifact of the ' +
      'imp-97822 floorSweep array or its stencil.',
    R1_power_law_clean_on_fresh_knees:
      'R^2 ~ 0.99999 with RMS residual ~ 1.6e-3 decades and max-abs ~ 3.0e-3 decades over the ' +
      '~2.1-decade span -- the same clean straight line imp-124772 reported, recomputed from ' +
      'independent knees rather than the reused array.',
    R2_residual_U_reproduced:
      'the fresh residuals form the same shallow sign-symmetric U (negative at the 0.5x/5x extremes, ' +
      'positive in the interior) imp-124772 read off the reused sweep -- the faint concave-up ' +
      'curvature is a genuine feature of the relation, not a numerical accident of one grid.',
    R3_structurally_different_locator_agrees:
      'the ramp-inflection locator (a different knee DEFINITION -- the inflection of sigma itself, ' +
      'not the exponent curvature) gives p_knee_lsq ~ -2.073 (R^2 ~ 0.99999), within ~0.033 of the ' +
      'exponent-curvature -2.106 and squarely in the clean dimensional ~ -2 band, far from the ' +
      'imp-33684 interior-peak ~ -1.375: the ~ -2.1 floor-elasticity comes from the model E_coll ~ ' +
      'E_trunc balance, robust to which inflection defines the knee.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-124772 knee floor-elasticity ' +
    'certification p_knee_lsq ~ -2.106 (R^2 ~ 0.99999) is INDEPENDENTLY REPRODUCED. A fresh ' +
    'bracketing-free exponent-curvature locator on an independent grid (scan step 0.0025, h=1.5e-4, ' +
    'dd=1.2e-3; the imp-97822 floorSweep is NOT imported) recovers p_knee_lsq ~ -2.1064 -- within ' +
    '~2.2e-5 of the reused-sweep -2.106468 -- with the same R^2 ~ 0.99999, the same RMS ~ 1.6e-3 ' +
    'decade residual and the same sign-symmetric residual U. A structurally different ramp-inflection ' +
    'locator (the inflection of sigma itself) recovers -2.073 in the same clean dimensional ~ -2 ' +
    'band, far from the imp-33684 interior-peak ~ -1.375. The -2.106 is a property of the sigma ' +
    'model E_coll ~ E_trunc balance, NOT an artifact of the imp-97822 sweep array or its stencil. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-124772 (OLS certification over the REUSED imp-97822 sweep; reproduced here); imp-97822 ' +
    '(two-floor knee fit p_knee ~ -2.099; floorSweep NOT imported); imp-33708 (0.5x..5x E_trunc floor ' +
    'sweep; far-tail sigma=0.5 exponent ~ -2.099); imp-33684 (interior-peak floor exponent ~ -1.375); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc = 3.06e-5 fixed-strip floor).',
};

export const IMP124814_KNEE_FLOOR_ELASTICITY_FRESH_LOCATOR_REPRO_ASSERTIONS = [
  {
    // Fresh-locator gate: both fresh locators resolve all ten floors to a single knee each.
    id: 'imp124814-fresh-locators-resolve-ten-floors',
    description: 'both fresh locators yield exactly one crossing on every one of the ten floor factors',
    holds: () =>
      SWEEP_A.length === 10 &&
      SWEEP_B.length === 10 &&
      SWEEP_A.every((r) => r.numCrossings === 1 && r.log10Nstar !== null) &&
      SWEEP_B.every((r) => r.numCrossings === 1 && r.log10Nstar !== null),
  },
  {
    // Baseline gate: factor 1.0 on the fresh grid reproduces the imp-97822/imp-97708 knee.
    id: 'imp124814-fresh-baseline-reproduces-imp97822',
    description: 'fresh factor-1.0 knee reproduces the imp-97822 baseline log10 N* ~ 9.5291',
    holds: () => BASELINE_A !== null && Math.abs(BASELINE_A - IMP97822_BASELINE) < 0.01,
  },
  {
    // R0: the fresh exponent-curvature slope reproduces the imp-124772 reused-sweep slope tightly.
    id: 'imp124814-fresh-slope-reproduces-imp124772',
    description: 'fresh exponent-curvature p_knee ~ -2.106 within 1e-3 of the imp-124772 reused-sweep slope',
    holds: () => DELTA_A_VS_124772 < 1e-3,
  },
  {
    // R1: the power law is clean on the freshly-located knees.
    id: 'imp124814-fresh-power-law-clean-high-r2',
    description: 'fresh R^2 > 0.9999 and RMS residual < 5e-3 decades over the full ladder',
    holds: () => FIT_A.r2 > 0.9999 && FIT_A.rmsResidualDecades < 5e-3,
  },
  {
    // R2: the fresh residual pattern is the same sign-symmetric U imp-124772 read off the reused sweep.
    id: 'imp124814-fresh-residuals-sign-symmetric-u',
    description: 'fresh residuals are negative at both floor extremes and positive in the interior',
    holds: () => {
      const first = FIT_A.residuals[0].residualDecades;
      const last = FIT_A.residuals[FIT_A.residuals.length - 1].residualDecades;
      const mid = FIT_A.residuals[Math.floor(FIT_A.residuals.length / 2)].residualDecades;
      return first < 0 && last < 0 && mid > 0;
    },
  },
  {
    // R3: a structurally different locator lands on the same clean ~ -2 band, far from the -1.375 peak.
    id: 'imp124814-different-locator-same-minus-2-band',
    description: 'ramp-inflection p_knee in [-2.2,-1.9], within 0.05 of the exp-curvature slope, far from -1.375',
    holds: () =>
      FIT_B.slope < -1.9 &&
      FIT_B.slope > -2.2 &&
      DELTA_B_VS_A < 0.05 &&
      FIT_B.slope < -1.375,
  },
  {
    // Honesty gate: cross-validation only, no QED, no refereed bound is changed.
    id: 'imp124814-honesty-gate-no-qed',
    description: 'Cross-validation only: reproduces p_knee ~ -2 from a fresh locator, no QED, no refereed bound is changed',
    holds: () =>
      IMP124814_KNEE_FLOOR_ELASTICITY_FRESH_LOCATOR_REPRO.isRigorous === false &&
      /NO QED/.test(IMP124814_KNEE_FLOOR_ELASTICITY_FRESH_LOCATOR_REPRO.verdict) &&
      /refereed bound is changed/i.test(IMP124814_KNEE_FLOOR_ELASTICITY_FRESH_LOCATOR_REPRO.verdict),
  },
];

for (const a of IMP124814_KNEE_FLOOR_ELASTICITY_FRESH_LOCATOR_REPRO_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124814-knee-floor-elasticity-fresh-locator-repro assertion failed: ${a.id}`);
  }
}
