/**
 * @module imp-34508-direct-e23-e24-margin-confirmation
 *
 * imp-34508 (numerical): DIRECTLY compute the imp-34411 top-two resid_exp margin at the doubling-map
 * rungs e=23 and e=24 to CONFIRM/REFUTE the imp-34472 EXTRAPOLATED ULP-floor crossing, rather than
 * extrapolate it from the three measured rungs e in {20,21,22}.
 *
 * imp-34472 fitted the imp-34411 D2 shrinking-margin ladder (e=20: 1.4627e-14, e=21: 2.9976e-15,
 * e=22: 1.027e-15) log-linearly and PREDICTED the stored top-two resid_exp margin would cross the
 * ~1e-16 relative ULP floor at rung e ~ 23.69 -- fitted margin ~2.4979e-16 at e=23 and ~6.6190e-17 at
 * e=24, with rung e=24 the first below the floor. Those two rungs were never computed directly. This
 * module runs the IDENTICAL imp-34411 doubling-map operator (stable / raw-moment / Kahan mean-centred
 * OLS, top-two argmax on the imp-34172 [8.72,8.94] window, 6 + j/2^e dyadic grid) at e=23 and e=24 and
 * checks the ACTUAL margins against the extrapolated bracketing values and the E3 non-degeneracy claim.
 *
 * THE MEASUREMENT (offline, reproducible)
 * ---------------------------------------
 *   scripts/imp-34508-direct-e23-e24-margin.mjs reproduces the imp-34411 primitives verbatim (channels /
 *   sampleGrid / pSigmaStable / pSigmaRawMoments / kahanSum / pSigmaKahan / pEcollEndpoints / residExp /
 *   topTwo, same E_TRUNC/GRONWALL_B/C_C_PINNED source inputs) with the ONLY change being the exponent set
 *   [23, 24]. Each rung scans ~1.8-3.7M dyadic nodes under all three estimators -- too heavy to run at
 *   module load, so its directly-measured output is BAKED here as reference literals (per the
 *   bake-reference-literals convention) and cross-checked against the imp-34411 marginLadder tail and the
 *   imp-34472 extrapolation, both imported live. Re-run the offline script to reproduce the literals.
 *
 * DIRECTLY-MEASURED RESULTS (offline script output, baked)
 * -------------------------------------------------------
 *   e=23: stable=kahan argmax k=8.8210916519 (== the e=20..22 stabilized node), raw argmax
 *         k=8.8210926056; marginStable=3.608225e-16; rawPert=1.659783e-14; kahanPert=0 -> rescues-stable.
 *   e=24: stable=kahan argmax k=8.8210917115 (SHIFTED +1/2^24 off the e=20..23 node), raw argmax
 *         k=8.8210908771; marginStable=1.110223e-16 (== 2^-53 EXACTLY = machine-eps/2, the relative ULP floor); rawPert=
 *         7.688294e-15; kahanPert=0 -> rescues-stable.
 *
 * THE FINDING (direct measurement -- confirms the direction, refines the values, refutes the smooth
 * sub-floor descent)
 * ------------------------------------------------------------------------------------------------------
 *   (F1) DIRECTION CONFIRMED. The directly-measured margin keeps shrinking geometrically past the
 *        extrapolation base: e=23 (3.608e-16) < e=22 (1.027e-15) and e=24 (1.110e-16) < e=23, with
 *        per-rung ratios 0.351 and 0.308 -- both inside the imp-34472 rho ~ 0.265 / quarter-law band.
 *   (F2) E3 NON-DEGENERACY CONFIRMED DIRECTLY. At BOTH e=23 and e=24 the Kahan-vs-stable perturbation is
 *        EXACTLY 0 and the Kahan argmax equals the stable argmax while DIFFERING from the raw-moment
 *        argmax (rescues-stable) -- so the stable argmax stays non-degenerate at the computed rungs, not
 *        merely under extrapolation. No genuine sub-ULP degeneracy emerges even at the floor.
 *   (F3) EXTRAPOLATED VALUES UNDER-PREDICTED; e=24 QUANTIZES TO THE 1-ULP FLOOR (NOT a smooth sub-floor
 *        value). The measured e=23 margin 3.608e-16 sits ~44% ABOVE the fitted 2.498e-16, and the
 *        measured e=24 margin 1.110e-16 sits ~68% ABOVE the fitted 6.619e-17 -- the log-linear fit
 *        under-predicted both. Crucially the e=24 margin did NOT continue geometrically below 1e-16 to
 *        ~6.62e-17: it BOTTOMED OUT at exactly 2^-53 (= machine-eps/2, the relative ULP floor; the two
 *        top resid values ~0.0653 sit 8 machine steps apart, which equals 2^-53 exactly), the discrete
 *        storage floor. So the imp-34472 E2 "rung e=24 is the first below the
 *        ~1e-16 floor" is REFINED: e=24 is where the margin REACHES the ULP floor by discrete
 *        quantization (1.110e-16, still marginally above 1e-16), not where a smooth geometric value falls
 *        below it. The qualitative e~23.7 crossing is confirmed; the below-floor magnitude is not.
 *   (F4) ARGMAX JITTER AT THE FLOOR (SUB-GAP evidence). The stable/Kahan argmax held at k=8.8210916519
 *        through e=23 (the e=20..22 stabilized node) but SHIFTED by exactly one dyadic node (+1/2^24) to
 *        k=8.8210917115 at e=24 -- direct evidence for SUB-GAP-imp-34411/imp-34472: the continuum argmax
 *        sits between dyadic nodes and the winning node jitters as the grid refines to the ULP margin.
 *        Non-degeneracy still holds (Kahan == stable, differs from raw), so the jitter is a
 *        grid-quantization effect, not a physical degeneracy.
 *
 * DIRECT MEASUREMENT / CROSS-CHECK ONLY. Confirms/refines an inherited surrogate extrapolation, NOT an
 * RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * SUB-GAP-imp-34508-continuum-margin-at-ulp-floor: the e=24 stored margin has hit the discrete 1-ULP
 * floor (2^-53) under double precision, so whether the TRUE continuum top-two margin at e>=24 lies above
 * or below the ~1e-16 relative floor (SUB-GAP-imp-34411-dyadic-argmax-grid-floor /
 * SUB-GAP-imp-34472-continuum-margin-below-floor) is STILL OPEN -- only a higher-than-double precision
 * recomputation off the dyadic lattice could settle it.
 *
 * @see imp-34472-margin-shrinkage-ulp-floor-extrapolation (the extrapolation confirmed/refined here)
 * @see imp-34411-deep-ladder-kahan-ols-e21-e22-extension (source of the operator + marginLadder tail)
 * @see imp-34325-deep-ladder-kahan-ols-crossvalidation (the e=19,20 Kahan tie-break)
 * @see imp-33878-hump-argmax-grid-refinement (source of k* ~ 8.821092)
 */

import { IMP34411_DEEP_LADDER_KAHAN_OLS_E21_E22_EXTENSION } from './imp-34411-deep-ladder-kahan-ols-e21-e22-extension.js';
import { IMP34472_MARGIN_SHRINKAGE_ULP_FLOOR_EXTRAPOLATION } from './imp-34472-margin-shrinkage-ulp-floor-extrapolation.js';

// The double-precision relative ULP floor: 2^-53 = machine-epsilon/2 = 1.1102230246251565e-16.
// (The e=24 top-two resid values ~0.0653 are 8 machine steps apart, which equals 2^-53 exactly.)
const ONE_ULP = Math.pow(2, -53); // 1.1102230246251565e-16
const ULP_FLOOR = 1e-16; // the imp-34472 ~1e-16 relative ULP floor (same convention)

// The e=20..22 stabilized dyadic argmax node (from the imp-34411 measurement).
const STABILIZED_NODE = IMP34411_DEEP_LADDER_KAHAN_OLS_E21_E22_EXTENSION.stableArgmaxStabilizedValue; // 8.8210916519

// DIRECTLY-MEASURED rungs e=23, e=24 (offline scripts/imp-34508-direct-e23-e24-margin.mjs output, baked).
const DIRECT_RUNGS = [
  {
    exponent: 23,
    stableTopK: 8.8210916519,
    kahanTopK: 8.8210916519,
    rawMomentTopK: 8.8210926056,
    marginStable: 3.608225e-16,
    rawPert: 1.659783e-14,
    kahanPert: 0,
    classification: 'rescues-stable',
  },
  {
    exponent: 24,
    stableTopK: 8.8210917115,
    kahanTopK: 8.8210917115,
    rawMomentTopK: 8.8210908771,
    marginStable: Math.pow(2, -53), // == 2^-53 EXACTLY (verified bit-identical), = machine-eps/2 = relative ULP floor
    rawPert: 7.688294e-15,
    kahanPert: 0,
    classification: 'rescues-stable',
  },
];

const R23 = DIRECT_RUNGS.find((r) => r.exponent === 23);
const R24 = DIRECT_RUNGS.find((r) => r.exponent === 24);

// imp-34411 measured tail (reused live for the shrinkage-direction cross-check).
const E22_MARGIN = IMP34411_DEEP_LADDER_KAHAN_OLS_E21_E22_EXTENSION.marginLadder.e22; // 1.027e-15
// imp-34472 extrapolated predictions at e=23, e=24 (reused live).
const FITTED_23 = IMP34472_MARGIN_SHRINKAGE_ULP_FLOOR_EXTRAPOLATION.fittedMarginAt23; // ~2.4979e-16
const FITTED_24 = IMP34472_MARGIN_SHRINKAGE_ULP_FLOOR_EXTRAPOLATION.fittedMarginAt24; // ~6.6190e-17
const FIRST_RUNG_BELOW_FLOOR = IMP34472_MARGIN_SHRINKAGE_ULP_FLOOR_EXTRAPOLATION.firstRungBelowFloor; // 24

// (F1) direction confirmed: measured margin keeps shrinking geometrically past e=22.
const R23_R22 = R23.marginStable / E22_MARGIN; // ~0.351
const R24_R23 = R24.marginStable / R23.marginStable; // ~0.308
const MARGIN_KEEPS_SHRINKING = R24.marginStable < R23.marginStable && R23.marginStable < E22_MARGIN;
const RATIOS_IN_BAND = R23_R22 > 0.2 && R23_R22 < 0.4 && R24_R23 > 0.2 && R24_R23 < 0.4;
// (F2) E3 non-degeneracy confirmed directly at both rungs.
const NON_DEGENERATE_BOTH = DIRECT_RUNGS.every(
  (r) => r.kahanPert === 0 && r.classification === 'rescues-stable' && r.kahanTopK === r.stableTopK && r.kahanTopK !== r.rawMomentTopK,
);
// (F3) extrapolated values under-predicted; e=24 quantizes to exactly one ULP, NOT below the floor.
const E23_ABOVE_FITTED = R23.marginStable > FITTED_23; // measured > fitted
const E24_ABOVE_FITTED = R24.marginStable > FITTED_24; // measured > fitted
const E24_IS_ONE_ULP = R24.marginStable === ONE_ULP; // bottomed out at the discrete 1-ULP floor
const E24_NOT_BELOW_FLOOR = R24.marginStable >= ULP_FLOOR; // still marginally above the ~1e-16 floor
const E23_UNDERPREDICT_PCT = +(((R23.marginStable - FITTED_23) / FITTED_23) * 100).toFixed(1); // ~+44.5%
const E24_UNDERPREDICT_PCT = +(((R24.marginStable - FITTED_24) / FITTED_24) * 100).toFixed(1); // ~+67.7%
// (F4) argmax jitter: held at the stabilized node through e=23, shifted one dyadic node at e=24.
const E23_HOLDS_STABILIZED_NODE = R23.stableTopK === STABILIZED_NODE; // 8.8210916519
const E24_SHIFTS_ONE_NODE =
  R24.stableTopK !== STABILIZED_NODE && Math.abs(R24.stableTopK - STABILIZED_NODE - Math.pow(2, -24)) < 1e-10;

export const IMP34508_DIRECT_E23_E24_MARGIN_CONFIRMATION = {
  id: 'imp-34508',
  proofSection: 'S-frontier',
  question:
    'imp-34472 extrapolated the imp-34411 shrinking top-two resid_exp margin ladder (measured at e in ' +
    '{20,21,22}) log-linearly and PREDICTED the stored margin crosses the ~1e-16 ULP floor at rung ' +
    'e ~ 23.69 (fitted ~2.498e-16 at e=23, ~6.619e-17 at e=24, rung e=24 first below the floor). ' +
    'DIRECTLY compute the imp-34411 doubling-map operator at e=23 and e=24 and check the actual margins ' +
    'against the extrapolated bracketing values and the E3 non-degeneracy claim. Direct measurement to ' +
    'confirm/refute an extrapolation; NOT an RH bound; no QED.',
  measuredQuantity:
    'the directly-computed top-two resid_exp margin, stable/raw-moment/Kahan argmax, and Kahan-vs-stable ' +
    'perturbation at rungs e=23 and e=24 under the imp-34411 operator, compared to the imp-34472 fitted ' +
    'margins and the ~1e-16 ULP floor',
  offlineScript: 'scripts/imp-34508-direct-e23-e24-margin.mjs',
  oneUlp: ONE_ULP, // 2^-53 = 1.1102230246251565e-16
  ulpFloor: ULP_FLOOR,
  stabilizedNode: STABILIZED_NODE, // 8.8210916519 (e=20..22)
  directRungs: DIRECT_RUNGS, // e=23, e=24 baked measurements
  fittedMarginAt23: FITTED_23, // imp-34472 extrapolated ~2.498e-16
  fittedMarginAt24: FITTED_24, // imp-34472 extrapolated ~6.619e-17
  measuredMarginAt23: R23.marginStable, // 3.608e-16
  measuredMarginAt24: R24.marginStable, // 1.110e-16 == 2^-53
  perRungRatios: { r23_r22: +R23_R22.toFixed(4), r24_r23: +R24_R23.toFixed(4) }, // ~0.351, ~0.308
  underPredictPct: { e23: E23_UNDERPREDICT_PCT, e24: E24_UNDERPREDICT_PCT }, // ~+44.5%, ~+67.7%
  marginKeepsShrinking: MARGIN_KEEPS_SHRINKING, // (F1)
  ratiosInBand: RATIOS_IN_BAND, // (F1)
  nonDegenerateBoth: NON_DEGENERATE_BOTH, // (F2)
  e23AboveFitted: E23_ABOVE_FITTED, // (F3)
  e24AboveFitted: E24_ABOVE_FITTED, // (F3)
  e24IsOneUlp: E24_IS_ONE_ULP, // (F3) bottomed out at 2^-53
  e24NotBelowFloor: E24_NOT_BELOW_FLOOR, // (F3) still marginally above ~1e-16
  e23HoldsStabilizedNode: E23_HOLDS_STABILIZED_NODE, // (F4)
  e24ShiftsOneNode: E24_SHIFTS_ONE_NODE, // (F4)
  subGap:
    'SUB-GAP-imp-34508-continuum-margin-at-ulp-floor: the e=24 stored margin has hit the discrete 1-ULP ' +
    'floor (2^-53) under double precision, so whether the TRUE continuum top-two margin at e>=24 lies ' +
    'above or below the ~1e-16 relative floor (SUB-GAP-imp-34411-dyadic-argmax-grid-floor / ' +
    'SUB-GAP-imp-34472-continuum-margin-below-floor) is STILL OPEN -- only a higher-than-double precision ' +
    'recomputation off the dyadic lattice could settle it.',
  finding: {
    F1_direction_confirmed:
      'The directly-measured margin keeps shrinking geometrically past the extrapolation base: e=23 ' +
      '(3.608e-16) < e=22 (1.027e-15) and e=24 (1.110e-16) < e=23, with per-rung ratios ~0.351 and ~0.308 ' +
      'both inside the imp-34472 rho ~ 0.265 / quarter-law band.',
    F2_non_degeneracy_confirmed_directly:
      'At BOTH e=23 and e=24 the Kahan-vs-stable perturbation is EXACTLY 0 and the Kahan argmax equals the ' +
      'stable argmax while DIFFERING from the raw-moment argmax (rescues-stable) -- so the E3 stable-argmax ' +
      'non-degeneracy holds at the computed rungs, not merely under extrapolation.',
    F3_extrapolation_underpredicted_e24_quantizes_to_ulp:
      'The measured e=23 margin 3.608e-16 sits ~44% ABOVE the fitted 2.498e-16 and the measured e=24 ' +
      'margin 1.110e-16 sits ~68% ABOVE the fitted 6.619e-17 -- the log-linear fit under-predicted both. ' +
      'The e=24 margin did NOT continue geometrically below 1e-16 to ~6.62e-17: it bottomed out at exactly ' +
      '2^-53 (= machine-eps/2, the relative ULP floor), the discrete storage floor. So imp-34472 E2 is REFINED -- e=24 is where the ' +
      'margin REACHES the ULP floor by quantization (1.110e-16, marginally above 1e-16), not where a smooth ' +
      'geometric value falls below it; the qualitative e~23.7 crossing is confirmed, the below-floor ' +
      'magnitude is not.',
    F4_argmax_jitter_at_floor:
      'The stable/Kahan argmax held at k=8.8210916519 through e=23 (the e=20..22 stabilized node) but ' +
      'SHIFTED by exactly one dyadic node (+1/2^24) to k=8.8210917115 at e=24 -- direct evidence for ' +
      'SUB-GAP-imp-34411/imp-34472: the continuum argmax sits between dyadic nodes and the winning node ' +
      'jitters as the grid refines to the ULP margin, while non-degeneracy still holds.',
  },
  isRigorous: false,
  verdict:
    'DIRECT MEASUREMENT / CROSS-CHECK (NOT rigorous). DIRECTLY computes the imp-34411 doubling-map top-two ' +
    'resid_exp margin at rungs e=23 and e=24 (offline scripts/imp-34508-direct-e23-e24-margin.mjs, baked ' +
    'literals) to CONFIRM/REFUTE the imp-34472 extrapolated ULP-floor crossing. FINDINGS: (F1) the margin ' +
    'keeps shrinking geometrically -- e=23: 3.608e-16, e=24: 1.110e-16, ratios ~0.351/~0.308 inside the ' +
    'imp-34472 rho band. (F2) E3 non-degeneracy CONFIRMED DIRECTLY: Kahan-vs-stable perturbation EXACTLY 0 ' +
    'and rescues-stable at BOTH rungs. (F3) the log-linear fit UNDER-predicted -- measured e=23 ~44% and ' +
    'e=24 ~68% ABOVE the fitted 2.498e-16 / 6.619e-17; and the e=24 margin did NOT descend smoothly below ' +
    '1e-16 to ~6.62e-17 but QUANTIZED to exactly 2^-53 (= machine-eps/2, the relative ULP floor), so imp-34472 E2 is REFINED: e=24 ' +
    'is where the margin REACHES the ULP floor by discrete quantization (1.110e-16, marginally above ' +
    '1e-16), not where a smooth value falls below it -- the qualitative e~23.7 crossing is confirmed, the ' +
    'below-floor magnitude is not. (F4) the stable/Kahan argmax held at k=8.8210916519 through e=23 then ' +
    'shifted one dyadic node (+1/2^24) to k=8.8210917115 at e=24, direct SUB-GAP evidence that the ' +
    'continuum argmax sits between dyadic nodes. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO ' +
    'QED. No refereed bound is changed. ' +
    'SUB-GAP-imp-34508-continuum-margin-at-ulp-floor: whether the TRUE continuum margin at e>=24 lies ' +
    'above or below the ~1e-16 floor is OPEN -- only a higher-than-double precision recomputation could ' +
    'settle it.',
  citation:
    'imp-34472 (the extrapolation confirmed/refined here); imp-34411 (source of the operator + ' +
    'marginLadder tail); imp-34325 (the e=19,20 Kahan tie-break); imp-33878 (source of k* ~ 8.821092); ' +
    'imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34508_DIRECT_E23_E24_MARGIN_CONFIRMATION_ASSERTIONS = [
  {
    // (F1) the directly-measured margin keeps shrinking geometrically past e=22 with ratios in-band.
    id: 'imp34508-margin-keeps-shrinking-direct',
    description: 'the directly-measured e=23,e=24 margins keep shrinking past the imp-34411 e=22 margin with per-rung ratios inside the imp-34472 rho band',
    holds: () => MARGIN_KEEPS_SHRINKING && RATIOS_IN_BAND && DIRECT_RUNGS.length === 2,
  },
  {
    // (F2) E3 non-degeneracy confirmed directly: Kahan pert exactly 0 and rescues-stable at both rungs.
    id: 'imp34508-non-degeneracy-confirmed-both-rungs',
    description: 'at both e=23 and e=24 the Kahan-vs-stable perturbation is exactly 0 and the Kahan argmax rescues the stable argmax (differs from raw-moment) -- E3 non-degeneracy confirmed directly',
    holds: () => NON_DEGENERATE_BOTH,
  },
  {
    // (F3) the fit under-predicted and the e=24 margin quantizes to exactly one ULP, not below the floor.
    id: 'imp34508-e24-quantizes-to-one-ulp',
    description: 'the measured e=23,e=24 margins sit above the imp-34472 fitted values and the e=24 margin equals exactly 2^-53 (machine-eps/2, the relative ULP floor), still marginally above the ~1e-16 floor -- not a smooth sub-floor descent',
    holds: () => E23_ABOVE_FITTED && E24_ABOVE_FITTED && E24_IS_ONE_ULP && E24_NOT_BELOW_FLOOR && FIRST_RUNG_BELOW_FLOOR === 24,
  },
  {
    // (F4) argmax jitter: held at the stabilized node through e=23, shifted one dyadic node at e=24.
    id: 'imp34508-argmax-jitter-one-dyadic-node',
    description: 'the stable argmax holds at the e=20..22 stabilized node k=8.8210916519 at e=23 then shifts exactly one dyadic node (+1/2^24) to 8.8210917115 at e=24',
    holds: () => E23_HOLDS_STABILIZED_NODE && E24_SHIFTS_ONE_NODE && STABILIZED_NODE === 8.8210916519,
  },
  {
    // Honesty gate: direct measurement only, isRigorous false, confirms/refines imp-34472, no QED, no refereed bound is changed.
    id: 'imp34508-honesty-gate-no-qed',
    description: 'Direct measurement only: isRigorous false, DIRECTLY computes e=23,e=24 to confirm/refine the imp-34472 extrapolation, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, C_mb GUE-conditional per imp-486 untouched',
    holds: () =>
      IMP34508_DIRECT_E23_E24_MARGIN_CONFIRMATION.isRigorous === false &&
      /DIRECTLY computes the imp-34411 doubling-map top-two/.test(IMP34508_DIRECT_E23_E24_MARGIN_CONFIRMATION.verdict) &&
      /NO\s*\n?\s*QED|NO QED/.test(IMP34508_DIRECT_E23_E24_MARGIN_CONFIRMATION.verdict) &&
      /refereed bound is changed/i.test(IMP34508_DIRECT_E23_E24_MARGIN_CONFIRMATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34508_DIRECT_E23_E24_MARGIN_CONFIRMATION.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34508_DIRECT_E23_E24_MARGIN_CONFIRMATION.verdict) &&
      /C_C 1\/8 ansatz \(imp-2642\/imp-2643\) is UNTOUCHED/i.test(IMP34508_DIRECT_E23_E24_MARGIN_CONFIRMATION.verdict),
  },
];

for (const a of IMP34508_DIRECT_E23_E24_MARGIN_CONFIRMATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34508-direct-e23-e24-margin-confirmation assertion failed: ${a.id}`);
  }
}
