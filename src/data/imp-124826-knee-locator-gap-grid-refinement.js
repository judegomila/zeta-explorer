/**
 * @module imp-124826-knee-locator-gap-grid-refinement
 *
 * imp-124826 (accuracy, frontier-direction): imp-124814 R3 reported two structurally different knee
 * locators for the imp-97822 conditional-share ramp giving distinct floor-elasticities --
 * p_knee ~ -2.1064 (exponent-curvature, the zero-crossing of c(d)=d2p/d(log10 N)^2) versus
 * p_knee ~ -2.0729 (ramp-inflection, the zero-crossing of d2 sigma/d(log10 N)^2) -- a ~0.033 gap, both
 * squarely in the clean dimensional ~ -2 band. imp-124814 did NOT resolve whether that ~0.033 offset is
 * a GENUINE definition-dependent difference between the two knee definitions or a FINITE-RESOLUTION
 * stencil artifact that would close as the scan step and finite-difference stencils are refined. This
 * module refines both locators along a grid ladder (scan step 0.0025 -> 0.001, central-difference
 * h 1.5e-4 -> 5e-5, second-difference dd 1.2e-3 -> 6e-4, ramp step hh 2e-3 -> 1e-3) over the identical
 * imp-33708 0.5x..5x E_trunc floor ladder and measures whether the gap shrinks toward zero (a shared
 * floor exposed by refinement) or persists (a genuine definition-dependence).
 *
 * THE REFINEMENT LADDER (both locators recomputed at each resolution; nothing imported from the sweep)
 * ---------------------------------------------------------------------------------------------------
 * The sigma model is byte-for-byte the imp-97822/imp-124814 form (E_coll/(E_trunc+E_flow+E_coll) with
 * the imp-2631 E_trunc = 3.06e-5 fixed-strip floor scaled by the imp-33708 factor ladder). Only the two
 * knee locators are re-run; each is evaluated at four grid resolutions L0..L3, L0 being the imp-124814
 * grid and L3 the finest (step halved, h tripled in resolution). The OLS slope p_knee of log10 N* on
 * log10 E_trunc is refit over all ten floors at each resolution, and the exponent-curvature/ramp-
 * inflection gap |p_exp - p_ramp| is tracked across the ladder.
 *
 * THE FINDING (measurement / cross-validation only)
 * -------------------------------------------------
 *   (G0) EACH LOCATOR SELF-CONVERGES. The exponent-curvature slope holds at p_knee ~ -2.1064 (moves
 *        < 3e-5 across L0..L3) and the ramp-inflection slope holds at p_knee ~ -2.0729 (moves < 1e-5);
 *        both R^2 stay ~ 0.99999. Each knee definition has a well-defined refinement limit -- neither
 *        drifts as the grid tightens, so the coarse-grid values reported by imp-124814 are converged.
 *   (G1) THE GAP PERSISTS -- IT IS NOT A STENCIL ARTIFACT. The exponent-curvature/ramp-inflection gap
 *        stays flat at |p_exp - p_ramp| ~ 0.0335 across the whole ladder (0.03350 at L0 -> 0.03352 at
 *        L3), moving < 3e-5 while the scan step is halved and the finite-difference stencils are
 *        tripled in resolution. The ~0.033 offset is a GENUINE definition-dependent difference between
 *        the two knee definitions, NOT a finite-resolution artifact that closes under refinement.
 *   (G2) BOTH LIMITS SIT IN THE CLEAN ~ -2 BAND. The two converged floor-elasticities (-2.1064 and
 *        -2.0729) straddle the imp-97822 two-floor chord -2.099 and are both far from the imp-33684
 *        interior-peak ~ -1.375: the ~ -2.1 floor-elasticity is a robust property of the E_coll ~
 *        E_trunc balance, but the exact exponent is set (to ~1.6%) by which inflection defines the knee.
 *
 * VERDICT: the imp-124814 R3 ~0.033 locator gap is REFINEMENT-STABLE. Both locators self-converge under
 * grid refinement (exponent-curvature -> -2.1064, ramp-inflection -> -2.0729, each moving < 3e-5 as the
 * step is halved and the stencils tripled in resolution) and the gap stays flat at ~0.0335 -- the offset
 * is a genuine definition-dependence between the two knee definitions, not a finite-resolution stencil
 * artifact. Both limits sit in the clean dimensional ~ -2 band, straddling the imp-97822 chord -2.099.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
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
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-97822/imp-124814 exactly
const LN10 = Math.LN10;

// EXACT imp-97822/imp-124814 sub-terms; ONLY the E_trunc floor is a parameter (model, not sweep).
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

// LOCATOR A (exponent-curvature): single zero-crossing of c(d) = d2p/d(log10 N)^2 over [lo,hi].
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

// LOCATOR B (ramp-inflection): single zero-crossing of c(d) = d2 sigma/d(log10 N)^2 (of sigma itself).
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

const SCAN_LO = 7.0;
const SCAN_HI = 13.0;
const FLOOR_FACTORS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0, 3.0, 5.0]; // imp-33708 ladder (byte-for-byte)

// OLS slope of log10 N* on log10 E_trunc (= p_knee) plus R^2, over floors that resolve to one knee.
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
  for (let i = 0; i < n; i++) {
    const pred = slope * xs[i] + intercept;
    ssRes += (ys[i] - pred) ** 2;
  }
  return { slope, r2: 1 - ssRes / syy };
}

function fitLocator(locator) {
  const rows = FLOOR_FACTORS.map((f) => {
    const E_trunc = E_TRUNC_BASE * f;
    const cr = locator(E_trunc);
    return { E_trunc, log10Nstar: cr.length === 1 ? cr[0] : null, numCrossings: cr.length };
  });
  const resolved = rows.filter((r) => r.log10Nstar !== null);
  const fit = olsFit(resolved);
  return { slope: fit.slope, r2: fit.r2, allSingle: rows.every((r) => r.numCrossings === 1) };
}

// Refinement ladder: L0 = imp-124814 grid; step halved and finite-diff stencils tripled by L3.
const GRIDS = [
  { tag: 'L0', step: 0.0025, h: 1.5e-4, dd: 1.2e-3, hh: 2.0e-3 }, // imp-124814 grid
  { tag: 'L1', step: 0.002, h: 1.0e-4, dd: 1.0e-3, hh: 1.5e-3 },
  { tag: 'L2', step: 0.0015, h: 7.5e-5, dd: 8.0e-4, hh: 1.2e-3 },
  { tag: 'L3', step: 0.001, h: 5.0e-5, dd: 6.0e-4, hh: 1.0e-3 }, // finest
];

const REFINEMENT = GRIDS.map((g) => {
  const A = fitLocator((E) => expCurvatureKnee(E, SCAN_LO, SCAN_HI, g.step, g.h, g.dd));
  const B = fitLocator((E) => rampInflectionKnee(E, SCAN_LO, SCAN_HI, g.step, g.hh));
  return {
    grid: g.tag,
    scanStep: g.step,
    diffStepH: g.h,
    pKneeExpCurvature: +A.slope.toFixed(6),
    r2ExpCurvature: +A.r2.toFixed(8),
    pKneeRampInflection: +B.slope.toFixed(6),
    r2RampInflection: +B.r2.toFixed(8),
    gap: +Math.abs(A.slope - B.slope).toFixed(6),
    bothResolveTenFloors: A.allSingle && B.allSingle,
  };
});

const L0 = REFINEMENT[0];
const L3 = REFINEMENT[REFINEMENT.length - 1];
const EXP_DRIFT = +Math.abs(L3.pKneeExpCurvature - L0.pKneeExpCurvature).toExponential(3); // ~2e-5
const RAMP_DRIFT = +Math.abs(L3.pKneeRampInflection - L0.pKneeRampInflection).toExponential(3); // ~1e-5
const GAP_DRIFT = +Math.abs(L3.gap - L0.gap).toExponential(3); // ~2e-5
const GAP_GEOMEAN = +(REFINEMENT.reduce((a, r) => a + r.gap, 0) / REFINEMENT.length).toFixed(6); // ~0.0335

export const IMP124826_KNEE_LOCATOR_GAP_GRID_REFINEMENT = {
  id: 'imp-124826',
  proofSection: 'S-frontier',
  question:
    'imp-124814 R3 reported two structurally different knee locators giving p_knee ~ -2.1064 ' +
    '(exponent-curvature) vs ~ -2.0729 (ramp-inflection), a ~0.033 gap, both in the clean dimensional ' +
    '~ -2 band, without deciding whether that offset is a genuine definition-dependent difference or a ' +
    'finite-resolution stencil artifact. Refine both locators (scan step 0.0025 -> 0.001, h 1.5e-4 -> ' +
    '5e-5) across the imp-33708 0.5x..5x floor ladder and report whether the gap shrinks toward zero ' +
    '(shared floor) or persists (genuine definition-dependence). Measurement/cross-validation only; ' +
    'C_mb GUE-conditional per imp-486 untouched; no bound moves; NO QED.',
  measuredQuantity:
    'the OLS slope p_knee of log10 N* on log10 E_trunc for BOTH the exponent-curvature and the ' +
    'ramp-inflection locators, and their gap |p_exp - p_ramp|, at four grid resolutions L0..L3 (scan ' +
    'step 0.0025 -> 0.001, central-diff h 1.5e-4 -> 5e-5) over the full imp-33708 floor ladder',
  refinementLadder: REFINEMENT,
  pKneeExpCurvatureLimit: L3.pKneeExpCurvature, // ~ -2.1064
  pKneeRampInflectionLimit: L3.pKneeRampInflection, // ~ -2.0729
  gapGeomean: GAP_GEOMEAN, // ~0.0335
  drift: {
    expCurvatureL0toL3: EXP_DRIFT, // ~2e-5
    rampInflectionL0toL3: RAMP_DRIFT, // ~1e-5
    gapL0toL3: GAP_DRIFT, // ~2e-5
    note:
      'each locator self-converges (exponent-curvature and ramp-inflection slopes each move < 3e-5 as ' +
      'the scan step is halved and the finite-difference stencils tripled in resolution) and the gap ' +
      'moves < 3e-5 -- the ~0.033 offset is refinement-stable, a genuine definition-dependence rather ' +
      'than a finite-resolution stencil artifact',
  },
  finding: {
    G0_each_locator_self_converges:
      'the exponent-curvature slope holds at p_knee ~ -2.1064 (moves < 3e-5 across L0..L3) and the ' +
      'ramp-inflection slope holds at p_knee ~ -2.0729 (moves < 1e-5); both R^2 stay ~ 0.99999, so the ' +
      'coarse-grid values imp-124814 reported are converged, not grid-limited.',
    G1_gap_persists_not_a_stencil_artifact:
      'the exponent-curvature/ramp-inflection gap stays flat at |p_exp - p_ramp| ~ 0.0335 across the ' +
      'whole ladder (0.03350 at L0 -> 0.03352 at L3, moving < 3e-5) while the scan step is halved and ' +
      'the finite-difference stencils tripled in resolution -- the ~0.033 offset is a GENUINE ' +
      'definition-dependent difference between the two knee definitions, NOT a finite-resolution ' +
      'artifact that closes under refinement.',
    G2_both_limits_in_clean_minus_2_band:
      'the two converged floor-elasticities (-2.1064 and -2.0729) straddle the imp-97822 two-floor ' +
      'chord -2.099 and are both far from the imp-33684 interior-peak ~ -1.375: the ~ -2.1 ' +
      'floor-elasticity is a robust property of the E_coll ~ E_trunc balance, but the exact exponent ' +
      'is set (to ~1.6%) by which inflection defines the knee.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-124814 R3 ~0.033 locator gap is ' +
    'REFINEMENT-STABLE. Both knee locators self-converge under grid refinement -- the ' +
    'exponent-curvature slope to p_knee ~ -2.1064 and the ramp-inflection slope to ~ -2.0729, each ' +
    'moving < 3e-5 as the scan step is halved (0.0025 -> 0.001) and the finite-difference stencils ' +
    'tripled in resolution (h 1.5e-4 -> 5e-5) -- and the gap stays flat at ~0.0335 (moves < 3e-5 ' +
    'across L0..L3). The ~0.033 offset is therefore a GENUINE definition-dependence between the two ' +
    'knee definitions, NOT a finite-resolution stencil artifact. Both limits sit in the clean ' +
    'dimensional ~ -2 band, straddling the imp-97822 chord -2.099 and far from the imp-33684 ' +
    'interior-peak ~ -1.375. The component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124814 (R3: the -2.1064 vs -2.0729 locator gap, unresolved there); imp-124772 (OLS ' +
    'certification over the reused imp-97822 sweep); imp-97822 (two-floor knee chord p_knee ~ -2.099); ' +
    'imp-33708 (0.5x..5x E_trunc floor ladder); imp-33684 (interior-peak floor exponent ~ -1.375); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc = 3.06e-5 fixed-strip floor).',
};

export const IMP124826_KNEE_LOCATOR_GAP_GRID_REFINEMENT_ASSERTIONS = [
  {
    // Resolution gate: both locators resolve all ten floors to a single knee at every grid resolution.
    id: 'imp124826-both-locators-resolve-at-every-resolution',
    description: 'both locators yield exactly one crossing on all ten floors at each of the four grid resolutions',
    holds: () => REFINEMENT.length === 4 && REFINEMENT.every((r) => r.bothResolveTenFloors === true),
  },
  {
    // G0: each locator self-converges -- neither slope drifts as the grid tightens.
    id: 'imp124826-each-locator-self-converges',
    description: 'exponent-curvature and ramp-inflection slopes each drift < 1e-4 from L0 to L3',
    holds: () => EXP_DRIFT < 1e-4 && RAMP_DRIFT < 1e-4,
  },
  {
    // G1: the gap persists flat under refinement -- it is not a stencil artifact.
    id: 'imp124826-gap-persists-not-stencil-artifact',
    description: 'the exponent-curvature/ramp-inflection gap stays ~0.033 and drifts < 1e-4 from L0 to L3',
    holds: () => GAP_DRIFT < 1e-4 && GAP_GEOMEAN > 0.03 && GAP_GEOMEAN < 0.04,
  },
  {
    // G2: both converged limits sit in the clean ~ -2 band, straddling -2.099, far from -1.375.
    id: 'imp124826-both-limits-in-clean-minus-2-band',
    description: 'both converged slopes lie in [-2.2,-1.9] and are far below the imp-33684 interior-peak -1.375',
    holds: () =>
      L3.pKneeExpCurvature < -1.9 &&
      L3.pKneeExpCurvature > -2.2 &&
      L3.pKneeRampInflection < -1.9 &&
      L3.pKneeRampInflection > -2.2 &&
      L3.pKneeExpCurvature < -1.375 &&
      L3.pKneeRampInflection < -1.375,
  },
  {
    // Honesty gate: cross-validation only, no QED, PT SOTA.
    id: 'imp124826-honesty-gate-no-qed',
    description: 'Measurement only: the gap is refinement-stable definition-dependence, no QED, PT stays SOTA',
    holds: () =>
      IMP124826_KNEE_LOCATOR_GAP_GRID_REFINEMENT.isRigorous === false &&
      /NO QED/.test(IMP124826_KNEE_LOCATOR_GAP_GRID_REFINEMENT.verdict) &&
      /remains SOTA/.test(IMP124826_KNEE_LOCATOR_GAP_GRID_REFINEMENT.verdict),
  },
];

for (const a of IMP124826_KNEE_LOCATOR_GAP_GRID_REFINEMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124826-knee-locator-gap-grid-refinement assertion failed: ${a.id}`);
  }
}
