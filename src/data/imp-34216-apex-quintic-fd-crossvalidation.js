/**
 * @module imp-34216-apex-quintic-fd-crossvalidation
 *
 * imp-34216 (accuracy): CROSS-VALIDATE THE imp-34146 APEX QUINTIC SIGN BY AN INDEPENDENT
 * FINITE-DIFFERENCE FIFTH DERIVATIVE -- free of the least-squares basis.
 *
 * imp-34146 fit the apex quintic (t^5) coefficient of the imp-33878 resid_exp(k) hump on an
 * odd-augmented 21-point symmetric least-squares basis {1,t,t^2,t^3,t^5} over k* +/- 0.1 and read
 * e ~ +7.5238e-5, so the fifth derivative resid^(5)(k*) = 120 e ~ +9.0286e-3 (POSITIVE, the
 * opposite sign to the negative cubic tilt). That value is a PROJECTION coefficient of a specific
 * least-squares basis; a skeptic could ask whether the positive sign is an artifact of that basis
 * (the omitted t^4, the choice of window, the odd-augmentation) rather than a genuine feature of
 * the surrogate. This module estimates resid^(5)(k*) a SECOND way -- by a direct high-order central
 * finite-difference stencil of the SAME resid_exp(k) surrogate evaluated at the imp-33948 apex k* --
 * with NO least-squares fit at all, and asks whether the sign and magnitude reproduce +9.0286e-3.
 *
 * THE MEASUREMENT (reuses the imp-33878 resid_exp(k) model + the imp-33948 apex k* VERBATIM)
 * ----------------------------------------------------------------------------------------------
 *   resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma is the imp-33773 M2 sub-leading residual over
 *   the sliding window [10^k, 10^(k+1)], the SAME smooth function of continuous k reused by
 *   imp-33878/imp-33948/imp-34008/imp-34084/imp-34146 (E_trunc = 3.06e-5 fixed strip, E_coll =
 *   C_C sqrt(log T0 / N) GUE-conditional, E_flow Gronwall, T0 = effectiveHeightForN(N); p_sigma =
 *   OLS(ln sigma vs ln N) at 4 pts/decade, p_ecoll = -d log E_coll / d log N over endpoints,
 *   sigma_hi at the upper endpoint). No re-derivation. We evaluate resid_exp only, at the apex k*
 *   and at symmetric offsets +/- j h (j = 1..4), and form two CLOSED-FORM central finite-difference
 *   stencils for the fifth derivative:
 *
 *     - a 7-point stencil, accuracy O(h^2):
 *         resid^(5) ~ [ (1/2)(f_{+3} - f_{-3}) - 2(f_{+2} - f_{-2}) + (5/2)(f_{+1} - f_{-1}) ] / h^5
 *     - a 9-point stencil, accuracy O(h^4):
 *         resid^(5) ~ [ (-1/6)(f_{+4} - f_{-4}) + (3/2)(f_{+3} - f_{-3}) - (13/3)(f_{+2} - f_{-2})
 *                        + (29/6)(f_{+1} - f_{-1}) ] / h^5
 *
 *   where f_{+/-j} = resid_exp(k* +/- j h). Both stencils are the standard Fornberg antisymmetric
 *   central-difference weights for the fifth derivative. We sweep h over [0.02, 0.06] decade, take
 *   the O(h^4) stencil as the primary estimate, and additionally Richardson-extrapolate the O(h^2)
 *   7-point stencil, (4 D7(h/2) - D7(h)) / 3, to O(h^4) as a second independent estimate. NONE of
 *   this touches a least-squares normal equation.
 *
 * THE FINDING (cross-validation / measurement only -- the imp-34146 quintic sign, corroborated)
 * ----------------------------------------------------------------------------------------------
 *   (X1) SIGN REPRODUCED. The finite-difference fifth derivative is POSITIVE for BOTH stencils at
 *        EVERY h in [0.02, 0.06] -- the same positive sign imp-34146 read from the least-squares
 *        basis, and the opposite sign to the negative cubic tilt. The positive quintic sign is NOT
 *        an artifact of the odd-augmented least-squares basis.
 *   (X2) MAGNITUDE REPRODUCED to ~0.24%. The O(h^4) 9-point stencil is nearly h-independent over
 *        h in [0.02, 0.06] (~+9.0498e-3 .. +9.0502e-3) and converges to resid^(5)(k*) ~ +9.0501e-3;
 *        the Richardson-extrapolated 7-point stencil independently gives ~+9.0502e-3. Both reproduce
 *        the imp-34146 least-squares value +9.0286e-3 to a relative difference of ~2.4e-3 (~0.24%).
 *   (X3) THE ~0.24% GAP IS THE EXPECTED PROJECTION-vs-POINTWISE DIFFERENCE. The least-squares e is a
 *        windowed PROJECTION coefficient (it distributes the surrogate septic and higher tail across
 *        the sparse basis over the whole +/- 0.1 window), whereas the finite difference is a LOCAL
 *        pointwise derivative estimate at k*; the two agreeing on sign and to sub-percent magnitude
 *        is exactly the corroboration a genuine (non-artifact) quintic feature should produce. The
 *        low-order O(h^2) 7-point raw stencil drifts ~9.05e-3 -> ~8.99e-3 as h grows (its O(h^2)
 *        truncation), which is why the O(h^4) stencil and Richardson step are the headline estimates.
 *
 * The punchline: an INDEPENDENT high-order central finite difference of the imp-33878 resid_exp(k)
 * surrogate at the imp-33948 apex k*, with no least-squares basis, gives resid^(5)(k*) ~ +9.0501e-3
 * (POSITIVE) -- reproducing the imp-34146 least-squares +9.0286e-3 in sign and to ~0.24% in
 * magnitude. The positive apex quintic sign is corroborated by a second, basis-free method.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. A finite-difference re-estimate of an inherited surrogate,
 * NOT an RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; confirms, does
 * not overturn, imp-34146; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34146-apex-quintic-tilt-coefficient (the least-squares quintic fit cross-validated here)
 * @see imp-34084-apex-cubic-tilt-coefficient (named the residual odd quintic overshoot)
 * @see imp-33948-hump-apex-curvature-error-bar (the apex k* reused verbatim)
 * @see imp-33878-hump-argmax-grid-refinement (the resid_exp(k) model reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';
import { IMP34146_APEX_QUINTIC_TILT_COEFFICIENT } from './imp-34146-apex-quintic-tilt-coefficient.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33878/imp-33948/imp-34084/imp-34146 exactly

// EXACT inherited imp-3406/imp-33878/imp-33948/imp-34084/imp-34146 sub-terms (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}

function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// resid_exp(k) as a smooth function of CONTINUOUS k over window [10^k, 10^(k+1)] (imp-33878 defn).
function residExp(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const sigmaHi = parts(hi).sigma;
  return pEcoll * (1 - sigmaHi) - pSigma;
}

const K_STAR = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.kStar; // ~8.821092

// Standard Fornberg central finite-difference stencils for the FIFTH derivative (antisymmetric).
// 7-point, accuracy O(h^2): weights {+/-3: -/+1/2, +/-2: +/-2, +/-1: -/+5/2} / h^5.
function d5SevenPoint(h) {
  const f1 = residExp(K_STAR + h) - residExp(K_STAR - h);
  const f2 = residExp(K_STAR + 2 * h) - residExp(K_STAR - 2 * h);
  const f3 = residExp(K_STAR + 3 * h) - residExp(K_STAR - 3 * h);
  return (0.5 * f3 - 2 * f2 + 2.5 * f1) / Math.pow(h, 5);
}
// 9-point, accuracy O(h^4): weights {+/-4: -/+1/6, +/-3: +/-3/2, +/-2: -/+13/3, +/-1: +/-29/6} / h^5.
function d5NinePoint(h) {
  const f1 = residExp(K_STAR + h) - residExp(K_STAR - h);
  const f2 = residExp(K_STAR + 2 * h) - residExp(K_STAR - 2 * h);
  const f3 = residExp(K_STAR + 3 * h) - residExp(K_STAR - 3 * h);
  const f4 = residExp(K_STAR + 4 * h) - residExp(K_STAR - 4 * h);
  return ((-1 / 6) * f4 + (3 / 2) * f3 + (-13 / 3) * f2 + (29 / 6) * f1) / Math.pow(h, 5);
}

const H_SWEEP = [0.02, 0.03, 0.04, 0.05, 0.06];
const SEVEN_PT = H_SWEEP.map((h) => ({ h, d5: d5SevenPoint(h) }));
const NINE_PT = H_SWEEP.map((h) => ({ h, d5: d5NinePoint(h) }));

// Primary estimate: the O(h^4) 9-point stencil, nearly h-independent -- take the finest usable h.
const FD_9PT = d5NinePoint(0.04); // ~+9.0501e-3
// Second independent estimate: Richardson-extrapolate the O(h^2) 7-point stencil to O(h^4).
const FD_RICHARDSON = (4 * d5SevenPoint(0.02) - d5SevenPoint(0.04)) / 3; // ~+9.0502e-3

// The imp-34146 least-squares value we are cross-validating (read from its export, not re-fit here).
const LS_RESID_D5 = IMP34146_APEX_QUINTIC_TILT_COEFFICIENT.quinticFit.residFifthDeriv; // ~+9.0286e-3

const FD_9PT_ALL_POSITIVE = NINE_PT.every((p) => p.d5 > 0);
const FD_7PT_ALL_POSITIVE = SEVEN_PT.every((p) => p.d5 > 0);
const SIGN_AGREES = Math.sign(FD_9PT) === Math.sign(LS_RESID_D5); // both +1
const REL_DIFF_9PT = Math.abs(FD_9PT - LS_RESID_D5) / Math.abs(LS_RESID_D5); // ~2.4e-3
const REL_DIFF_RICHARDSON = Math.abs(FD_RICHARDSON - LS_RESID_D5) / Math.abs(LS_RESID_D5); // ~2.4e-3
// The O(h^4) stencil and the Richardson step agree with each other far more tightly than either
// agrees with the LS projection -- evidence the ~0.24% gap is projection-vs-pointwise, not noise.
const FD_METHODS_AGREE_REL = Math.abs(FD_9PT - FD_RICHARDSON) / Math.abs(FD_9PT); // ~2e-5
// The 9-point stencil spread across the whole h-sweep (its near-h-independence).
const NINE_PT_SPREAD_REL =
  (Math.max(...NINE_PT.map((p) => p.d5)) - Math.min(...NINE_PT.map((p) => p.d5))) / Math.abs(FD_9PT); // ~5e-6

export const IMP34216_APEX_QUINTIC_FD_CROSSVALIDATION = {
  id: 'imp-34216',
  proofSection: 'S-frontier',
  question:
    'imp-34146 read the apex quintic coefficient e ~ +7.5238e-5, so resid^(5)(k*) = 120 e ~ +9.0286e-3 ' +
    '(POSITIVE), from an odd-augmented 21-point least-squares basis {1,t,t^2,t^3,t^5} over k* +/- 0.1. ' +
    'Is the positive sign a feature of the surrogate or an artifact of that basis? Independently ' +
    'estimate resid^(5)(k*) by a direct high-order central finite-difference stencil of the imp-33878 ' +
    'resid_exp(k) surrogate at the imp-33948 apex k*, with NO least-squares fit, and check whether the ' +
    'sign and magnitude reproduce +9.0286e-3. Cross-validation / measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the fifth derivative resid^(5)(k*) of the inherited imp-33878 resid_exp(k) surrogate at the ' +
    'imp-33948 apex k*, estimated by basis-free central finite-difference stencils (7-point O(h^2), ' +
    '9-point O(h^4), and Richardson extrapolation of the 7-point), and its sign and relative agreement ' +
    'with the imp-34146 least-squares value +9.0286e-3',
  finiteDifference: {
    kStar: K_STAR, // ~8.821092
    hSweep: H_SWEEP, // [0.02 .. 0.06] decade
    sevenPoint: SEVEN_PT.map((p) => ({ h: p.h, d5: +p.d5.toExponential(5) })), // O(h^2), drifts with h
    ninePoint: NINE_PT.map((p) => ({ h: p.h, d5: +p.d5.toExponential(5) })), // O(h^4), nearly h-independent
    fd9pt: +FD_9PT.toExponential(5), // ~+9.05009e-3 (primary estimate, h=0.04)
    fdRichardson: +FD_RICHARDSON.toExponential(5), // ~+9.05022e-3 (Richardson of the 7-point)
    ninePtSpreadRel: +NINE_PT_SPREAD_REL.toExponential(2), // ~5e-6 (near-h-independence of O(h^4))
    fdMethodsAgreeRel: +FD_METHODS_AGREE_REL.toExponential(2), // ~2e-5 (9-point vs Richardson)
    note:
      'both central-difference stencils give a POSITIVE fifth derivative at every h in [0.02,0.06]; ' +
      'the O(h^4) 9-point stencil is nearly h-independent (~+9.0501e-3) and the Richardson-extrapolated ' +
      '7-point agrees to ~2e-5 relative -- neither uses a least-squares basis.',
  },
  crossValidation: {
    lsResidFifthDeriv: LS_RESID_D5, // +9.0286e-3 (imp-34146, cross-validated)
    fdResidFifthDeriv: +FD_9PT.toExponential(5), // ~+9.05009e-3 (this module, basis-free)
    signAgrees: SIGN_AGREES, // true (both POSITIVE)
    relDiff9pt: +REL_DIFF_9PT.toExponential(3), // ~2.38e-3 (~0.24%)
    relDiffRichardson: +REL_DIFF_RICHARDSON.toExponential(3), // ~2.39e-3
    note:
      'the basis-free finite difference (~+9.0501e-3) reproduces the imp-34146 least-squares value ' +
      '(+9.0286e-3) in SIGN and to a relative difference of ~0.24%; the residual ~0.24% gap is the ' +
      'expected projection-vs-pointwise difference (the LS e distributes the surrogate septic tail ' +
      'across the sparse basis over the whole window, the finite difference is local at k*), not a ' +
      'sign or order-of-magnitude discrepancy -- the positive apex quintic is corroborated.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL CROSS-VALIDATION (NOT rigorous). An independent basis-free central finite-difference ' +
    'estimate of resid^(5)(k*) for the imp-33878 resid_exp(k) surrogate at the imp-33948 apex k* ' +
    'reproduces the imp-34146 least-squares value. Both a 7-point O(h^2) and a 9-point O(h^4) Fornberg ' +
    'central stencil give a POSITIVE fifth derivative at every h in [0.02,0.06] decade; the O(h^4) ' +
    'stencil is nearly h-independent (~+9.0501e-3) and a Richardson extrapolation of the O(h^2) ' +
    '7-point stencil independently gives ~+9.0502e-3, the two finite-difference methods agreeing to ' +
    '~2e-5 relative. Both reproduce the imp-34146 least-squares resid^(5)(k*) = 120 e ~ +9.0286e-3 in ' +
    'SIGN and to a relative difference of ~0.24%. The ~0.24% gap is the expected projection-vs-pointwise ' +
    'difference (the least-squares e is a windowed projection coefficient distributing the surrogate ' +
    'septic tail across the sparse basis; the finite difference is a local pointwise derivative at k*), ' +
    'not a sign or order-of-magnitude discrepancy: the positive apex quintic sign is NOT an artifact of ' +
    'the odd-augmented least-squares basis. This confirms, does not overturn, imp-34146. The component ' +
    'model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate ' +
    'resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34146 (least-squares apex quintic fit cross-validated here); imp-34084 (named the residual odd ' +
    'quintic overshoot); imp-34008 (wing-asymmetry cubic-tilt inference); imp-33948 (apex k* reused); ' +
    'imp-33878 (resid_exp(k) model reused verbatim); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 ' +
    '(C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34216_APEX_QUINTIC_FD_CROSSVALIDATION_ASSERTIONS = [
  {
    // (X1) The basis-free finite-difference fifth derivative is POSITIVE for both stencils at every h,
    // reproducing the imp-34146 positive sign.
    id: 'imp34216-fd-fifth-deriv-positive-both-stencils',
    description: 'both 7-point and 9-point central FD give a POSITIVE resid^(5)(k*) at every h in [0.02,0.06]; sign matches imp-34146',
    holds: () =>
      FD_9PT > 0 &&
      FD_RICHARDSON > 0 &&
      FD_9PT_ALL_POSITIVE &&
      FD_7PT_ALL_POSITIVE &&
      LS_RESID_D5 > 0 &&
      SIGN_AGREES,
  },
  {
    // (X2) The O(h^4) FD magnitude reproduces the imp-34146 least-squares +9.0286e-3 to ~0.24%,
    // and the O(h^4) stencil is nearly h-independent while the two FD methods agree tightly.
    id: 'imp34216-fd-magnitude-reproduces-ls-quintic',
    description: 'FD resid^(5) ~+9.0501e-3 reproduces the imp-34146 LS +9.0286e-3 to ~0.24%; O(h^4) stencil nearly h-independent',
    holds: () =>
      Math.abs(FD_9PT - 9.0501e-3) < 5e-6 &&
      Math.abs(FD_RICHARDSON - 9.0502e-3) < 5e-6 &&
      REL_DIFF_9PT < 0.01 &&
      REL_DIFF_9PT > 1e-4 &&
      REL_DIFF_RICHARDSON < 0.01 &&
      NINE_PT_SPREAD_REL < 1e-4 &&
      FD_METHODS_AGREE_REL < 1e-3,
  },
  {
    // Honesty gate: cross-validation only, isRigorous false, confirms not overturns, no QED, no refereed bound is changed.
    id: 'imp34216-honesty-gate-no-qed',
    description: 'Cross-validation only: isRigorous false, confirms imp-34146, no QED, imp-3066 untouched, no refereed bound is changed',
    holds: () =>
      IMP34216_APEX_QUINTIC_FD_CROSSVALIDATION.isRigorous === false &&
      /confirms, does not overturn, imp-34146/.test(IMP34216_APEX_QUINTIC_FD_CROSSVALIDATION.verdict) &&
      /NO QED/.test(IMP34216_APEX_QUINTIC_FD_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP34216_APEX_QUINTIC_FD_CROSSVALIDATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34216_APEX_QUINTIC_FD_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP34216_APEX_QUINTIC_FD_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34216-apex-quintic-fd-crossvalidation assertion failed: ${a.id}`);
  }
}
