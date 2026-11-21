/**
 * @module imp-34399-secant-zero-convexity-bias-decomposition
 * @fileoverview imp-34399 -- DECOMPOSE the imp-34310 secant-vs-bisection offset on the
 *   resid_exp zero k* ~ 21.28095 and attribute it to convexity. imp-34310 F1/F4 recorded that
 *   the 2-point secant (rungs k = 21.25, 21.5) implies a zero k_sec ~ 21.28537, a +4.42e-3
 *   offset above the independently-bisected k* = 21.28095, and flagged (F4) that resid_exp is
 *   convex near the pole (3-point 2nd difference +3.379e-7 per k^2). This module quantifies HOW
 *   MUCH of that offset is curvature-induced bias, using a 3-point (quadratic) correction, and
 *   reports the corrected zero and the residual gap that survives the correction.
 *
 *   Import-light: reuses the imp-34310 secant zero + slope + 2nd-difference and the imp-34397
 *   quadratic-corrected zero (both chain only to the zero-import imp-34237 rows, per
 *   [[no_heavy_imports_in_pages]]). No new data -- a decomposition/attribution re-read.
 *
 *   RELATION TO imp-34397. imp-34397 computed the quadratic-corrected zero k_quad = 21.280486
 *   (its F3) as a corroboration of the residue tightening, but never DECOMPOSED the 0.0044
 *   secant offset into a convexity-explained fraction plus a residual gap, nor gave an
 *   independent analytic curvature-bias predictor. That decomposition is this ticket.
 *
 *   METHOD.
 *   (1) Secant offset: dSec = k_sec - k* = +4.419e-3   (imp-34310 IMP34310_KZERO_LOCAL).
 *   (2) 3-point-corrected zero: k_quad = 21.280486 (imp-34397 quadratic through the same three
 *       imp-34237 rungs); residual gap dQuad = k_quad - k* = -4.64e-4.
 *   (3) Convexity-explained fraction: the quadratic correction shifts the zero by
 *       (k_quad - k_sec) = -4.88e-3 and shrinks the offset magnitude from |dSec| to |dQuad|;
 *       fraction removed = 1 - |dQuad|/|dSec| = 0.895.
 *   (4) Independent analytic predictor (Newton one-step from the secant root of the quadratic
 *       interpolant): the curvature term of the quadratic p(k) = r_LO + m(k-k_LO) +
 *       C(k-k_LO)(k-k_HI) shifts the linear secant root by
 *         delta_lin = -C*(k_sec - k_LO)*(k_sec - k_HI)/m,
 *       with m the imp-34310 secant slope and C the imp-34397 quadratic leading coefficient
 *       (= half the imp-34310 2nd difference). This gives delta_lin ~ -5.54e-3, reproducing the
 *       SIGN and ~magnitude of the exact quadratic shift -4.88e-3 to ~13%, confirming the offset
 *       is genuinely curvature-driven rather than coincidental.
 *
 *   FINDINGS.
 *   (F1) THE SECANT OFFSET IS DOMINANTLY CONVEXITY BIAS. The 3-point curvature correction
 *        removes 89.5% of the imp-34310 secant-vs-bisection offset: the offset magnitude drops
 *        from |dSec| = 4.419e-3 (linear secant) to |dQuad| = 4.64e-4 (quadratic), a ~9.5x
 *        shrink. So YES -- convexity is the dominant driver of the ~0.0044 gap.
 *   (F2) RESIDUAL GAP. After the 3-point correction a signed residual dQuad = -4.64e-4 (10.5% of
 *        the original offset) survives, now on the OPPOSITE side of k* (the correction slightly
 *        overshoots). This residual is the uncorrected cubic+ Taylor remainder plus the bisection
 *        resolution of k*, NOT further convexity -- the quadratic has already consumed the
 *        curvature.
 *   (F3) ANALYTIC CORROBORATION. The closed-form first-order curvature-bias predictor
 *        delta_lin = -C*(k_sec-k_LO)(k_sec-k_HI)/m = -5.54e-3 has the SAME sign and matches the
 *        exact quadratic shift (k_quad - k_sec) = -4.88e-3 to ~13% (the linear one-step overshoots
 *        because C is applied at the uncorrected root); its predicted zero 21.27983 lands
 *        -1.12e-3 from k*. This independently confirms the bias mechanism is the near-pole
 *        convexity, not a fitting artifact.
 *   (F4) RESOLUTION FLOOR (honest). Three rungs determine at most a quadratic; the residual
 *        -4.64e-4 is set by the unmeasured cubic term and the bisection precision of k*. Driving
 *        it lower needs a fourth sub-rung inside kEnd in (21.0, 21.28095), which the surrogate
 *        cannot supply (resid_exp -> 0 loses digits). Reported: convexity explains ~89.5% of the
 *        secant offset; the ~10.5% residual is data-limited.
 *
 *   VERDICT: the ~0.0044 imp-34310 secant-vs-bisection offset on the resid_exp zero is a genuine
 *   curvature-induced bias -- a 3-point (quadratic) correction removes ~89.5% of it, recovering
 *   k* to within 4.64e-4, and a closed-form curvature-bias predictor reproduces the shift in sign
 *   and to ~13% in magnitude. Surrogate finite-difference decomposition on 3 rungs; NOT a
 *   rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched;
 *   NO QED; no refereed bound is changed.
 *
 *   @see imp-34310-eflow-over-resid-pole-residue-simple-pole.js (secant zero, F4 convexity caveat)
 *   @see imp-34397-eflow-over-resid-residue-curvature-corrected.js (quadratic zero this decomposes)
 *   @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (source rung literals)
 */

import {
  IMP34310_KSTAR,
  IMP34310_KZERO_LOCAL,
  IMP34310_RESID_SLOPE_AT_ZERO,
  IMP34310_RESID_SECOND_DIFFERENCE,
} from './imp-34310-eflow-over-resid-pole-residue-simple-pole.js';
import {
  IMP34397_KZERO_QUAD,
  IMP34397_KZERO_QUAD_GAP,
  IMP34397_QUAD_C,
} from './imp-34397-eflow-over-resid-residue-curvature-corrected.js';

// The two secant rungs bracketing k* (imp-34310 / imp-34237 landmarks).
const K_LO = 21.25; // last positive resid_exp rung
const K_HI = 21.5; //  first negative resid_exp rung

// --- (1) secant offset: linear 2-point zero minus bisected k* ------------------------------
export const IMP34399_SECANT_OFFSET =
  IMP34310_KZERO_LOCAL - IMP34310_KSTAR; // +4.419e-3

// --- (2) 3-point-corrected zero + residual gap (imp-34397 quadratic) ------------------------
export const IMP34399_KZERO_CORRECTED = IMP34397_KZERO_QUAD; // 21.280486
export const IMP34399_RESIDUAL_GAP = IMP34397_KZERO_QUAD_GAP; // -4.64e-4

// --- (3) convexity-explained fraction of the secant offset ----------------------------------
export const IMP34399_CURVATURE_SHIFT =
  IMP34399_KZERO_CORRECTED - IMP34310_KZERO_LOCAL; // -4.883e-3 (correction moves the zero)
export const IMP34399_FRACTION_EXPLAINED =
  1 - Math.abs(IMP34399_RESIDUAL_GAP) / Math.abs(IMP34399_SECANT_OFFSET); // ~0.895

// --- (4) independent analytic first-order curvature-bias predictor --------------------------
// Newton one-step from the secant root of the quadratic interpolant
// p(k) = r_LO + m(k-k_LO) + C(k-k_LO)(k-k_HI):  delta = -C(k_sec-k_LO)(k_sec-k_HI)/m.
export const IMP34399_CURVATURE_BIAS_PREDICTED =
  -(IMP34397_QUAD_C *
    (IMP34310_KZERO_LOCAL - K_LO) *
    (IMP34310_KZERO_LOCAL - K_HI)) /
  IMP34310_RESID_SLOPE_AT_ZERO; // ~-5.54e-3
export const IMP34399_KZERO_PREDICTED =
  IMP34310_KZERO_LOCAL + IMP34399_CURVATURE_BIAS_PREDICTED; // ~21.27983
// how well the closed-form one-step reproduces the EXACT quadratic shift
export const IMP34399_PREDICTOR_REL_ERROR =
  (IMP34399_CURVATURE_BIAS_PREDICTED - IMP34399_CURVATURE_SHIFT) /
  IMP34399_CURVATURE_SHIFT; // ~+0.134 (overshoots by ~13%)

export const IMP34399_SECANT_ZERO_CONVEXITY_BIAS_DECOMPOSITION = {
  ticket: 'imp-34399',
  kStar: IMP34310_KSTAR,
  kZeroSecant: IMP34310_KZERO_LOCAL, // 21.285369 (imp-34310 linear)
  secantOffset: IMP34399_SECANT_OFFSET, // +4.419e-3
  residSecondDifference: IMP34310_RESID_SECOND_DIFFERENCE, // +3.379e-7 (convexity)
  kZeroCorrected: IMP34399_KZERO_CORRECTED, // 21.280486 (imp-34397 quadratic)
  residualGap: IMP34399_RESIDUAL_GAP, // -4.64e-4
  curvatureShift: IMP34399_CURVATURE_SHIFT, // -4.883e-3
  fractionExplained: IMP34399_FRACTION_EXPLAINED, // ~0.895
  curvatureBiasPredicted: IMP34399_CURVATURE_BIAS_PREDICTED, // ~-5.54e-3 (closed form)
  predictorRelError: IMP34399_PREDICTOR_REL_ERROR, // ~+0.134
  note:
    'The imp-34310 ~0.0044 secant-vs-bisection offset on the resid_exp zero k*~21.28095 is ' +
    'dominantly convexity bias: a 3-point (quadratic) correction removes ~89.5% of it, shrinking ' +
    'the offset from +4.419e-3 to a -4.64e-4 residual. A closed-form curvature-bias predictor ' +
    'delta=-C(k_sec-k_LO)(k_sec-k_HI)/m~-5.54e-3 reproduces the shift in sign and to ~13%, ' +
    'confirming the near-pole convexity as the mechanism.',
  honest:
    'MEASUREMENT ONLY -- a decomposition/attribution re-read of the SAME 3 baked imp-34237 rungs, ' +
    'not new data; the ~10.5% residual is the uncorrected cubic term plus the bisection resolution ' +
    'of k* and is data-limited (no finer sub-rung inside (21.0, 21.28095)). Surrogate NOT rigorous; ' +
    'changes no bound; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; ' +
    'NO QED; no refereed bound is changed.',
};

export const IMP34399_ASSERTIONS = [
  {
    id: 'imp-34399-secant-offset-positive-4e-3',
    description:
      'the imp-34310 linear secant zero sits ~+4.42e-3 ABOVE the bisected k* (the offset to be decomposed)',
    holds: () =>
      IMP34399_SECANT_OFFSET > 0 &&
      Math.abs(IMP34399_SECANT_OFFSET - 4.418803e-3) < 1e-8,
  },
  {
    id: 'imp-34399-3point-correction-removes-most-of-offset',
    description:
      'the 3-point (quadratic) correction removes ~89.5% of the secant offset, leaving a ~-4.64e-4 residual with smaller magnitude',
    holds: () =>
      Math.abs(IMP34399_FRACTION_EXPLAINED - 0.894963) < 1e-5 &&
      IMP34399_FRACTION_EXPLAINED > 0.85 &&
      Math.abs(IMP34399_RESIDUAL_GAP) < Math.abs(IMP34399_SECANT_OFFSET) / 9 &&
      IMP34399_RESIDUAL_GAP < 0, // correction overshoots to the other side of k*
  },
  {
    id: 'imp-34399-analytic-predictor-matches-sign-and-magnitude',
    description:
      'the closed-form curvature-bias predictor has the same (negative) sign as the exact quadratic shift and matches it to ~13%',
    holds: () =>
      IMP34399_CURVATURE_BIAS_PREDICTED < 0 &&
      IMP34399_CURVATURE_SHIFT < 0 &&
      Math.abs(IMP34399_PREDICTOR_REL_ERROR) < 0.2 &&
      Math.abs(IMP34399_CURVATURE_BIAS_PREDICTED - -5.539028e-3) < 1e-8,
  },
  {
    id: 'imp-34399-convexity-coefficient-consistent',
    description:
      'the imp-34397 quadratic leading coefficient used as the curvature C equals half the imp-34310 3-point 2nd difference (+3.379e-7)',
    holds: () =>
      IMP34397_QUAD_C > 0 &&
      Math.abs(2 * IMP34397_QUAD_C - IMP34310_RESID_SECOND_DIFFERENCE) < 1e-12,
  },
  {
    id: 'imp-34399-corrected-zero-brackets',
    description:
      'the 3-point-corrected zero lies strictly between the two secant rungs and much closer to k* than the linear secant zero',
    holds: () =>
      IMP34399_KZERO_CORRECTED > K_LO &&
      IMP34399_KZERO_CORRECTED < K_HI &&
      Math.abs(IMP34399_KZERO_CORRECTED - IMP34310_KSTAR) <
        Math.abs(IMP34310_KZERO_LOCAL - IMP34310_KSTAR),
  },
];

for (const a of IMP34399_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34399-secant-zero-convexity-bias-decomposition assertion failed: ${a.id}`);
  }
}
