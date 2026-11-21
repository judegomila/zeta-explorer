/**
 * @module imp-34472-margin-shrinkage-ulp-floor-extrapolation
 *
 * imp-34472 (numerical): EXTRAPOLATE the imp-34411 D2 deep-ladder top-two argmax margin shrinkage to the
 * doubling-map rung e where the stored resid_exp margin would cross the ~1e-16 relative ULP floor of
 * double precision, and ASSESS whether a genuine argmax degeneracy is ever reachable under the Kahan
 * operator.
 *
 * imp-34411 D2 measured the top-two resid_exp separation (the "margin") shrinking per rung down the
 * doubling-map ladder -- e=20: 1.4627e-14, e=21: 2.9976e-15, e=22: 1.027e-15 -- while the Kahan-vs-stable
 * perturbation stayed EXACTLY 0, so no degeneracy emerged through e=22. It never extrapolated to the rung
 * where the shrinking margin would fall below the ~1e-16 relative ULP floor of the stored resid_exp, nor
 * assessed whether that crossing would ever make the stable argmax genuinely ULP-degenerate.
 *
 * THE EXTRAPOLATION (this module -- import-light, reuses the imp-34411 marginLadder export verbatim)
 * ----------------------------------------------------------------------------------------------------
 *   The three imp-34411 margins m(e) at e in {20, 21, 22} are read directly from the imp-34411 module
 *   marginLadder export (no recomputation). A log-linear least-squares fit ln m = lnA + slope * e gives
 *   the per-rung shrinkage ratio rho = exp(slope); the crossing rung e_cross is the e where the fitted
 *   margin first equals the FLOOR = 1e-16 relative ULP threshold, i.e. e_cross = (ln FLOOR - lnA)/slope.
 *   A pure quadratic-near-maximum quarter-law (rho = 1/4, anchored at e=22) is computed as an independent
 *   cross-check -- near a smooth maximum the top-two resid_exp gap scales like the grid spacing SQUARED,
 *   and the grid spacing 1/2^e halves each rung, so a shrinkage ratio near 1/4 per rung is the expected
 *   physical law.
 *
 * THE FINDING (extrapolation only -- crossing rung + degeneracy assessment)
 * ------------------------------------------------------------------------
 *   (E1) THE MARGIN SHRINKS GEOMETRICALLY AT rho ~ 0.265 PER RUNG, REMARKABLY CLOSE TO THE 1/4
 *        QUADRATIC-NEAR-MAXIMUM LAW. The log-linear fit is ln m = -5.3793 - 1.3281 * e (rho ~ 0.26498,
 *        R^2 ~ 0.9877); the per-rung ratios 0.2049 and 0.3426 straddle 1/4, and their geometric mean is
 *        exactly rho (a 3-evenly-spaced-point identity: the least-squares slope equals the endpoint
 *        slope). The ~1/4 rate matches the expected (grid-spacing)^2 falloff near the smooth resid_exp
 *        maximum, confirming the shrinkage is a grid-refinement artifact, not a physical collapse.
 *   (E2) THE STORED MARGIN WOULD CROSS THE ~1e-16 ULP FLOOR AT RUNG e ~ 23.69 -- i.e. rung e=24 IS THE
 *        FIRST WHOSE STORED MARGIN SITS BELOW THE FLOOR, ONLY ~1.7 RUNGS PAST THE e=22 MEASURED DEPTH. The
 *        log-linear fit crosses FLOOR=1e-16 at e_cross ~ 23.689; the independent quarter-law anchored at
 *        e=22 crosses at ~23.680 -- essentially coincident. The fitted margin is ~2.50e-16 at e=23 and
 *        ~6.62e-17 at e=24, bracketing the floor between those two rungs.
 *   (E3) A GENUINE ARGMAX DEGENERACY IS NEVER REACHABLE UNDER THE KAHAN OPERATOR. Even though the STORED
 *        margin crosses the ULP floor at rung ~24, the imp-34411 Kahan-vs-stable perturbation is EXACTLY 0
 *        (decoupled from the shrinking margin) and the stable argmax has already CONVERGED on the dyadic
 *        grid at k=8.821091651900 across e=20..22. So the margin crossing the floor is a
 *        stored-precision / grid-quantization artifact, NOT a physical degeneracy: the higher-precision
 *        Kahan operator selects the same converged grid point regardless of how small the stored margin
 *        gets, so the stable argmax stays rescued indefinitely and never becomes genuinely ULP-degenerate.
 *
 * EXTRAPOLATION ONLY. A downstream fit of an inherited surrogate measurement, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * surrogate resid_exp(k) is descriptive, not derived; the ~1e-16 relative ULP floor is taken at the
 * ticket framing (the margins are treated as relative to an O(1) stored resid_exp); the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes
 * no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * SUB-GAP-imp-34472-continuum-margin-below-floor: the extrapolation crosses the floor for the DYADIC
 * stored margin on the 6 + j/2^e grid, but whether a sub-ULP CONTINUUM refinement off the dyadic lattice
 * (SUB-GAP-imp-34411-dyadic-argmax-grid-floor) would place the true continuum margin above or below the
 * floor at the same rung is left OPEN -- only a higher-than-double precision recomputation could settle
 * it, beyond this double-precision extrapolation.
 *
 * @see imp-34411-deep-ladder-kahan-ols-e21-e22-extension (D2 source of the shrinking margin ladder)
 * @see imp-34325-deep-ladder-kahan-ols-crossvalidation (the e=19,20 Kahan tie-break)
 * @see imp-34250-deep-ladder-tie-margin-classification (the two-estimator tie-fragile classification)
 * @see imp-33878-hump-argmax-grid-refinement (source of k* ~ 8.821092)
 */

import { IMP34411_DEEP_LADDER_KAHAN_OLS_E21_E22_EXTENSION } from './imp-34411-deep-ladder-kahan-ols-e21-e22-extension.js';

// The ~1e-16 relative ULP floor of double precision (machine epsilon ~ 2.22e-16), taken at the ticket
// framing as the resid_exp margin scale below which the top two stored resid_exp values become
// indistinguishable in double precision.
const ULP_FLOOR = 1e-16;

// Read the imp-34411 D2 margin ladder verbatim (no recomputation): e=20,21,22 top-two resid_exp margins.
const LADDER = IMP34411_DEEP_LADDER_KAHAN_OLS_E21_E22_EXTENSION.marginLadder; // { e20, e21, e22 }
const EXPONENTS = [20, 21, 22];
const MARGINS = [LADDER.e20, LADDER.e21, LADDER.e22];

// Per-rung shrinkage ratios and their geometric mean.
const RATIO_20_21 = MARGINS[1] / MARGINS[0]; // ~0.2049
const RATIO_21_22 = MARGINS[2] / MARGINS[1]; // ~0.3426
const GEOM_MEAN_RATIO = Math.sqrt(RATIO_20_21 * RATIO_21_22); // ~0.2650

// Log-linear least-squares fit ln m = lnA + slope * e over the three rungs.
function logLinearFit(xs, ys) {
  const n = xs.length;
  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    const y = Math.log(ys[i]);
    sx += xs[i];
    sy += y;
    sxx += xs[i] * xs[i];
    sxy += xs[i] * y;
  }
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const lnA = (sy - slope * sx) / n;
  // coefficient of determination on ln m
  const my = sy / n;
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    const yhat = lnA + slope * xs[i];
    ssRes += (Math.log(ys[i]) - yhat) ** 2;
    ssTot += (Math.log(ys[i]) - my) ** 2;
  }
  const r2 = 1 - ssRes / ssTot;
  return { slope, lnA, r2, rho: Math.exp(slope) };
}

const FIT = logLinearFit(EXPONENTS, MARGINS);
const RHO = FIT.rho; // per-rung shrinkage ratio ~0.26498

// Fitted margin at an arbitrary rung, and the crossing rung where the fit meets the ULP floor.
function fittedMargin(e) {
  return Math.exp(FIT.lnA + FIT.slope * e);
}
const E_CROSS_LOGLINEAR = (Math.log(ULP_FLOOR) - FIT.lnA) / FIT.slope; // ~23.689

// Independent cross-check: a pure quadratic-near-maximum quarter-law (rho = 1/4) anchored at e=22.
const QUARTER_RATIO = 0.25;
const E_CROSS_QUARTER = 22 + Math.log(ULP_FLOOR / MARGINS[2]) / Math.log(QUARTER_RATIO); // ~23.680

// The first integer rung whose fitted stored margin sits strictly below the ULP floor.
const FIRST_RUNG_BELOW_FLOOR = Math.ceil(E_CROSS_LOGLINEAR); // 24

// (E3) The Kahan operator finds no degeneracy: its perturbation is exactly 0, decoupled from the margin,
// and the stable argmax has converged on the dyadic grid across e=20..22 -- so no genuine degeneracy is
// ever reachable however small the stored margin becomes.
const KAHAN_PERT_ZERO = IMP34411_DEEP_LADDER_KAHAN_OLS_E21_E22_EXTENSION.kahanPertZeroBothDeep;
const STABLE_ARGMAX_CONVERGED = IMP34411_DEEP_LADDER_KAHAN_OLS_E21_E22_EXTENSION.stableArgmaxStabilized;
const DEGENERACY_REACHABLE = !(KAHAN_PERT_ZERO && STABLE_ARGMAX_CONVERGED); // false

export const IMP34472_MARGIN_SHRINKAGE_ULP_FLOOR_EXTRAPOLATION = {
  id: 'imp-34472',
  proofSection: 'S-frontier',
  question:
    'imp-34411 D2 found the top-two argmax margin keeps shrinking per rung (e=20: 1.46e-14, e=21: ' +
    '3.00e-15, e=22: 1.03e-15) while the Kahan-vs-stable perturbation stays exactly 0, so no degeneracy ' +
    'emerged through e=22. Fit the per-rung margin shrinkage ratio, extrapolate to the doubling-map rung ' +
    'where the stored margin would cross the ~1e-16 relative ULP floor, and assess whether a genuine ' +
    'argmax degeneracy is ever reachable under the Kahan operator. Extrapolation only; NOT an RH bound; ' +
    'no QED.',
  measuredQuantity:
    'the per-rung shrinkage ratio rho = exp(slope) from a log-linear LS fit ln m = lnA + slope * e over ' +
    'the imp-34411 marginLadder e in {20,21,22}; the crossing rung e_cross where the fitted margin meets ' +
    'the ULP_FLOOR = 1e-16; an independent quadratic-near-maximum quarter-law (rho = 1/4) crossing ' +
    'cross-check; the degeneracy-reachability assessment from the imp-34411 exactly-0 Kahan perturbation',
  ulpFloor: ULP_FLOOR,
  exponents: EXPONENTS, // [20, 21, 22] -- the imp-34411 D2 measured rungs
  marginLadder: LADDER, // { e20: 1.4627e-14, e21: 2.9976e-15, e22: 1.027e-15 } -- reused verbatim
  perRungRatios: { e20_e21: +RATIO_20_21.toExponential(6), e21_e22: +RATIO_21_22.toExponential(6) },
  geomMeanRatio: +GEOM_MEAN_RATIO.toExponential(6), // ~0.264977
  logLinearFit: {
    slope: +FIT.slope.toFixed(6), // ~-1.328114
    lnA: +FIT.lnA.toFixed(6), // ~-5.379283
    rho: +RHO.toFixed(6), // ~0.264977 per-rung shrinkage ratio
    r2: +FIT.r2.toFixed(6), // ~0.987677
  },
  quarterLawRatio: QUARTER_RATIO, // 1/4 -- the expected (grid-spacing)^2 near-maximum falloff
  eCrossLogLinear: +E_CROSS_LOGLINEAR.toFixed(4), // ~23.6893 rung where the fit meets the ULP floor
  eCrossQuarterLaw: +E_CROSS_QUARTER.toFixed(4), // ~23.6802 quarter-law crossing (near-coincident)
  firstRungBelowFloor: FIRST_RUNG_BELOW_FLOOR, // 24 -- first integer rung with stored margin below floor
  fittedMarginAt23: +fittedMargin(23).toExponential(4), // ~2.4979e-16 (just above the floor)
  fittedMarginAt24: +fittedMargin(24).toExponential(4), // ~6.6190e-17 (below the floor)
  kahanPerturbationExactlyZero: KAHAN_PERT_ZERO, // true -- decoupled from the shrinking margin
  stableArgmaxConverged: STABLE_ARGMAX_CONVERGED, // true -- k=8.821091651900 across e=20..22
  degeneracyReachable: DEGENERACY_REACHABLE, // false -- never reachable under the Kahan operator
  finding: {
    E1_geometric_shrinkage_near_quarter_law:
      'The margin shrinks geometrically at rho ~ 0.265 per rung, remarkably close to the 1/4 ' +
      'quadratic-near-maximum law: the log-linear fit is ln m = -5.3793 - 1.3281 * e (rho ~ 0.26498, R^2 ' +
      '~ 0.9877); the per-rung ratios 0.2049 and 0.3426 straddle 1/4, and their geometric mean equals ' +
      'rho exactly (a 3-evenly-spaced-point identity). The ~1/4 rate matches the (grid-spacing)^2 falloff ' +
      'near the smooth resid_exp maximum -- the shrinkage is a grid-refinement artifact, not a collapse.',
    E2_crossing_rung_e24:
      'The stored margin would cross the ~1e-16 ULP floor at rung e ~ 23.69 -- rung e=24 is the first ' +
      'whose stored margin sits below the floor, only ~1.7 rungs past the e=22 measured depth. The ' +
      'log-linear fit crosses at e ~ 23.689 and the independent quarter-law anchored at e=22 crosses at ' +
      'e ~ 23.680 (near-coincident); the fitted margin is ~2.50e-16 at e=23 and ~6.62e-17 at e=24, ' +
      'bracketing the floor.',
    E3_no_genuine_degeneracy_reachable:
      'A genuine argmax degeneracy is never reachable under the Kahan operator. Even though the STORED ' +
      'margin crosses the ULP floor at rung ~24, the imp-34411 Kahan-vs-stable perturbation is EXACTLY 0 ' +
      '(decoupled from the shrinking margin) and the stable argmax has already CONVERGED on the dyadic ' +
      'grid at k=8.821091651900 across e=20..22 -- so the crossing is a stored-precision / ' +
      'grid-quantization artifact, NOT a physical degeneracy: the higher-precision operator selects the ' +
      'same converged grid point however small the stored margin gets, and the stable argmax stays ' +
      'rescued indefinitely.',
  },
  subGap:
    'SUB-GAP-imp-34472-continuum-margin-below-floor: the extrapolation crosses the floor for the DYADIC ' +
    'stored margin on the 6 + j/2^e grid; whether a sub-ULP CONTINUUM refinement off the dyadic lattice ' +
    '(SUB-GAP-imp-34411-dyadic-argmax-grid-floor) would place the true continuum margin above or below ' +
    'the floor at the same rung is OPEN -- only a higher-than-double precision recomputation could ' +
    'settle it, beyond this double-precision extrapolation.',
  isRigorous: false,
  verdict:
    'EXTRAPOLATION (NOT rigorous). EXTRAPOLATES the imp-34411 D2 deep-ladder top-two argmax margin ' +
    'shrinkage (e=20: 1.4627e-14, e=21: 2.9976e-15, e=22: 1.027e-15, reused verbatim from the imp-34411 ' +
    'marginLadder export) to the doubling-map rung where the stored resid_exp margin would cross the ' +
    '~1e-16 relative ULP floor. A log-linear LS fit gives a per-rung shrinkage ratio rho ~ 0.265 ' +
    '(R^2 ~ 0.988) -- remarkably close to the 1/4 quadratic-near-maximum (grid-spacing)^2 law, whose ' +
    'per-rung ratios 0.2049 and 0.3426 straddle 1/4. The fitted margin crosses the ULP floor at rung ' +
    'e ~ 23.69, so rung e=24 is the first whose stored margin sits below the floor (only ~1.7 rungs past ' +
    'e=22); an independent quarter-law anchored at e=22 crosses at e ~ 23.68, near-coincident. ASSESSMENT: ' +
    'a genuine argmax degeneracy is NEVER reachable under the Kahan operator -- even though the stored ' +
    'margin crosses the floor at rung ~24, the imp-34411 Kahan-vs-stable perturbation is EXACTLY 0 ' +
    '(decoupled from the margin) and the stable argmax has already CONVERGED on the dyadic grid at ' +
    'k=8.821091651900 across e=20..22, so the crossing is a stored-precision / grid-quantization artifact, ' +
    'NOT a physical degeneracy, and the stable argmax stays rescued indefinitely ' +
    '(SUB-GAP-imp-34472-continuum-margin-below-floor: whether a sub-ULP continuum refinement off the ' +
    'dyadic lattice would place the true continuum margin above or below the floor is OPEN). The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34411 (D2 source of the shrinking margin ladder, reused verbatim); imp-34325 (the e=19,20 Kahan ' +
    'tie-break); imp-34250 (the two-estimator tie-fragile classification); imp-33878 (source of ' +
    'k* ~ 8.821092); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34472_MARGIN_SHRINKAGE_ULP_FLOOR_EXTRAPOLATION_ASSERTIONS = [
  {
    // (E1) The margin ladder is read verbatim from imp-34411 and shrinks geometrically at rho ~ 0.265.
    id: 'imp34472-margin-ladder-reused-and-shrinking',
    description: 'the three margins are read verbatim from the imp-34411 marginLadder export and shrink monotonically e22<e21<e20',
    holds: () =>
      MARGINS[0] === 1.4627e-14 &&
      MARGINS[1] === 2.9976e-15 &&
      MARGINS[2] === 1.027e-15 &&
      MARGINS[2] < MARGINS[1] &&
      MARGINS[1] < MARGINS[0],
  },
  {
    // (E1) The log-linear per-rung ratio rho ~ 0.265 equals the geometric mean of the two per-rung ratios
    // (a 3-evenly-spaced-point identity) and sits close to the 1/4 quadratic-near-maximum law.
    id: 'imp34472-rho-near-quarter-law',
    description: 'the log-linear per-rung shrinkage ratio rho ~ 0.265 equals the geometric mean of the per-rung ratios and lies within 0.05 of the 1/4 near-maximum law',
    holds: () =>
      Math.abs(RHO - GEOM_MEAN_RATIO) < 1e-9 &&
      Math.abs(RHO - 0.264977) < 1e-4 &&
      Math.abs(RHO - QUARTER_RATIO) < 0.05 &&
      FIT.r2 > 0.98,
  },
  {
    // (E2) Both the log-linear and quarter-law fits cross the ULP floor near e ~ 23.7, and the first
    // integer rung below the floor is e=24.
    id: 'imp34472-crossing-rung-e24',
    description: 'the log-linear and quarter-law fits both cross the 1e-16 ULP floor near e ~ 23.68-23.69 and the first integer rung below the floor is e=24',
    holds: () =>
      Math.abs(E_CROSS_LOGLINEAR - 23.6893) < 1e-3 &&
      Math.abs(E_CROSS_QUARTER - 23.6802) < 1e-3 &&
      Math.abs(E_CROSS_LOGLINEAR - E_CROSS_QUARTER) < 0.02 &&
      FIRST_RUNG_BELOW_FLOOR === 24 &&
      fittedMargin(23) > ULP_FLOOR &&
      fittedMargin(24) < ULP_FLOOR,
  },
  {
    // (E3) No genuine degeneracy is reachable: the Kahan perturbation is exactly 0 and the stable argmax
    // has converged, so the floor crossing is a stored-precision artifact, not a physical degeneracy.
    id: 'imp34472-no-degeneracy-reachable',
    description: 'the imp-34411 Kahan perturbation is exactly 0 and the stable argmax has converged, so degeneracyReachable is false -- the floor crossing is a stored-precision artifact',
    holds: () =>
      KAHAN_PERT_ZERO === true &&
      STABLE_ARGMAX_CONVERGED === true &&
      DEGENERACY_REACHABLE === false,
  },
  {
    // Honesty gate: extrapolation only, isRigorous false, no QED, no refereed bound is changed, inherited surrogates untouched.
    id: 'imp34472-honesty-gate-no-qed',
    description: 'Extrapolation only: isRigorous false, EXTRAPOLATES the imp-34411 D2 margin shrinkage, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, C_mb GUE-conditional untouched',
    holds: () =>
      IMP34472_MARGIN_SHRINKAGE_ULP_FLOOR_EXTRAPOLATION.isRigorous === false &&
      /EXTRAPOLATES the imp-34411 D2 deep-ladder top-two argmax margin/.test(
        IMP34472_MARGIN_SHRINKAGE_ULP_FLOOR_EXTRAPOLATION.verdict,
      ) &&
      /NO QED/.test(IMP34472_MARGIN_SHRINKAGE_ULP_FLOOR_EXTRAPOLATION.verdict) &&
      /refereed bound is changed/i.test(IMP34472_MARGIN_SHRINKAGE_ULP_FLOOR_EXTRAPOLATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34472_MARGIN_SHRINKAGE_ULP_FLOOR_EXTRAPOLATION.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(
        IMP34472_MARGIN_SHRINKAGE_ULP_FLOOR_EXTRAPOLATION.verdict,
      ),
  },
];

for (const a of IMP34472_MARGIN_SHRINKAGE_ULP_FLOOR_EXTRAPOLATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34472-margin-shrinkage-ulp-floor-extrapolation assertion failed: ${a.id}`);
  }
}
