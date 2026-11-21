/**
 * @module imp-34397-eflow-over-resid-residue-curvature-corrected
 * @fileoverview imp-34397 -- TIGHTEN the imp-34310 eflow_over_resid simple-pole residue
 *   R ~ -1.979e-8 by replacing the wide 2-point secant slope with a curvature-corrected
 *   (quadratic) read of dg_resid/dk evaluated AT the pole k* ~ 21.28095, using the SAME three
 *   baked imp-34237 rungs (k = 21.0, 21.25, 21.5). This addresses the imp-34310 F4 caveat that
 *   the 0.25-spaced secant carries a ~10% finite-difference/curvature error because resid_exp is
 *   convex near the pole and the secant averages the slope over [21.25, 21.5] (midpoint 21.375),
 *   far to the right of k*.
 *
 *   Import-light: reuses the imp-34237 baked rows (no heavy zeros-bundle chain, per
 *   [[no_heavy_imports_in_pages]]) and the imp-34310 exports for cross-check. No new data.
 *
 *   HONEST SCOPE. The ticket asks for a "finer sub-rung grid inside kEnd in (21.0, 21.28095)".
 *   No genuinely finer resid_exp samples exist -- the surrogate loses digits as resid_exp -> 0
 *   near k* and windows go undefined for kEnd >= 21.5. What IS available and unused by imp-34310
 *   is the k = 21.0 rung, which fixes the local CURVATURE. Fitting a quadratic through all three
 *   rungs and evaluating its slope AT k* (rather than the 2-point secant over the outer pair) is
 *   the correct curvature correction and is exactly the "reduce the ~10% offset" F4 flagged.
 *   This is a re-read of existing data at higher analytic order, NOT a new measurement.
 *
 *   METHOD. Quadratic r(t) = r1 + b*t + c*t^2 with t = k - 21.25 through the three rungs
 *   (r0, r1, r2) = (+8.72e-8, +8.19e-9, -4.97e-8):
 *     b = (r2 - r0)/(2H)          = -2.7380e-7   (central slope at 21.25)
 *     c = (r0 - 2r1 + r2)/(2H^2)  = +1.6896e-7   (half the imp-34310 2nd difference +3.379e-7)
 *   Local slope at k* (t* = 0.03095): m_star = b + 2*c*t* = -2.63341e-7 per k.
 *   Quadratic residue: R_quad = eflow_attr(k*) / m_star, with eflow_attr(k*) = 4.582753e-15
 *   carried unchanged from imp-34310 (numerator smooth/nonzero at the pole).
 *
 *   FINDINGS.
 *   (F1) CURVATURE-CORRECTED LOCAL SLOPE. m_star = -2.63341e-7 per k is 13.7% STEEPER than the
 *        imp-34310 wide secant m = -2.3156e-7. The secant under-reads |slope| because it averages
 *        over [21.25, 21.5] whose midpoint (21.375) lies right of k*, where the convex resid_exp
 *        is already steeper -- the correction is toward the pole, as expected.
 *   (F2) TIGHTENED RESIDUE. R_quad = -1.74023e-8, a -12.07% shift from the imp-34310 linear
 *        R = -1.97908e-8. So the F4 "~10%" caveat was REAL and mildly UNDER-stated: the curvature
 *        bias on R is ~12%. The tightened value is R ~ -1.740e-8 (still a simple-pole residue,
 *        same sign, F2/F3 classification of imp-34310 UNCHANGED).
 *   (F3) INDEPENDENT k* CORROBORATION. The quadratic zero of resid_exp is k_quad = 21.280486,
 *        only -4.64e-4 from the independently-bisected k* = 21.28095 -- a ~9.5x reduction from the
 *        imp-34310 linear-secant zero k_local = 21.285369 (+4.42e-3 off). The curvature read thus
 *        recovers the bisected pole location to <5e-4 WITHOUT using it as input, corroborating both
 *        k* and the direction/size of the slope correction.
 *   (F4) RESOLUTION FLOOR (honest). Three rungs determine at most a quadratic; the leading
 *        uncalibrated error is the unmeasured CUBIC term. The linear -> quadratic correction moved
 *        R by ~12%; under geometric Taylor convergence the next (cubic) correction is O(12%^2) ~
 *        1-2%, but that is a heuristic, NOT a measured bound -- a genuine cubic read needs a fourth
 *        sub-rung inside (21.0, 21.28095) that the surrogate cannot supply at this precision
 *        (resid_exp -> 0 loses significant digits). Reported floor: R = -1.740e-8 tightened from
 *        -1.979e-8, residual ~1-2% (heuristic), data-limited below that.
 *
 *   VERDICT: the imp-34310 residue tightens from R ~ -1.979e-8 (2-point secant) to
 *   R ~ -1.740e-8 (curvature-corrected quadratic at k*), a ~12% inward shift confirming the F4
 *   caveat; the quadratic zero independently recovers k* to <5e-4. Simple-pole classification and
 *   all upstream verdicts UNCHANGED. Surrogate diagnostic, finite-difference re-read on 3 rungs;
 *   NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0
 *   untouched; NO QED; no refereed bound is changed.
 *
 *   @see imp-34310-eflow-over-resid-pole-residue-simple-pole.js (linear secant read, F4 caveat this tightens)
 *   @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (source rung literals, same pole)
 *   @see imp-34247 (same pole read as simple, residue +1, in the widening-slope dy/dk channel)
 */

import {
  IMP34237_RESID_EXP_ROWS,
  IMP34237_EFLOW_OVER_RESID_ROWS,
  IMP34237_RESID_ZERO_KSTAR,
} from './imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js';
import {
  IMP34310_KSTAR,
  IMP34310_RESID_SLOPE_AT_ZERO,
  IMP34310_EFLOW_ATTR_AT_KSTAR,
  IMP34310_POLE_RESIDUE,
} from './imp-34310-eflow-over-resid-pole-residue-simple-pole.js';

// --- Baked inputs (imp-34237 literals; exact === reproduction asserted below) -------------
const RUNG_K0 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 21.0); // convexity anchor (unused by secant)
const RUNG_LO = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 21.25); // last positive
const RUNG_HI = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 21.5); // first negative
const H = RUNG_LO.k - RUNG_K0.k; // 0.25 uniform spacing
const K_MID = RUNG_LO.k; // 21.25, quadratic expansion point

// --- Quadratic r(t) = r1 + b*t + c*t^2, t = k - K_MID, through the three rungs -------------
export const IMP34397_QUAD_B = (RUNG_HI.residExp - RUNG_K0.residExp) / (2 * H); // -2.7380e-7
export const IMP34397_QUAD_C =
  (RUNG_K0.residExp - 2 * RUNG_LO.residExp + RUNG_HI.residExp) / (2 * H * H); // +1.6896e-7

// --- (F1) curvature-corrected local slope evaluated AT k* ---------------------------------
const T_STAR = IMP34310_KSTAR - K_MID; // 0.03095
export const IMP34397_SLOPE_AT_KSTAR =
  IMP34397_QUAD_B + 2 * IMP34397_QUAD_C * T_STAR; // -2.63341e-7

// --- (F2) tightened residue R_quad = eflow_attr(k*) / m_star ------------------------------
export const IMP34397_RESIDUE_CURVATURE_CORRECTED =
  IMP34310_EFLOW_ATTR_AT_KSTAR / IMP34397_SLOPE_AT_KSTAR; // -1.74023e-8
export const IMP34397_RESIDUE_REL_SHIFT_FROM_LINEAR =
  (IMP34397_RESIDUE_CURVATURE_CORRECTED - IMP34310_POLE_RESIDUE) / IMP34310_POLE_RESIDUE; // -0.1207

// --- (F3) quadratic zero of resid_exp (physical root near K_MID) ---------------------------
const DISC = IMP34397_QUAD_B * IMP34397_QUAD_B - 4 * IMP34397_QUAD_C * RUNG_LO.residExp;
const T_ROOT_A = (-IMP34397_QUAD_B + Math.sqrt(DISC)) / (2 * IMP34397_QUAD_C);
const T_ROOT_B = (-IMP34397_QUAD_B - Math.sqrt(DISC)) / (2 * IMP34397_QUAD_C);
const K_ROOT_A = K_MID + T_ROOT_A;
const K_ROOT_B = K_MID + T_ROOT_B;
export const IMP34397_KZERO_QUAD =
  Math.abs(K_ROOT_A - IMP34310_KSTAR) < Math.abs(K_ROOT_B - IMP34310_KSTAR)
    ? K_ROOT_A
    : K_ROOT_B; // 21.280486
export const IMP34397_KZERO_QUAD_GAP = IMP34397_KZERO_QUAD - IMP34310_KSTAR; // -4.64e-4

export const IMP34397_EFLOW_OVER_RESID_RESIDUE_CURVATURE_CORRECTED = {
  ticket: 'imp-34397',
  kStar: IMP34310_KSTAR,
  slopeAtKStarSecant: IMP34310_RESID_SLOPE_AT_ZERO, // -2.3156e-7 (imp-34310)
  slopeAtKStarQuadratic: IMP34397_SLOPE_AT_KSTAR, // -2.63341e-7 (this tightening)
  residueLinear: IMP34310_POLE_RESIDUE, // -1.97908e-8 (imp-34310)
  residueCurvatureCorrected: IMP34397_RESIDUE_CURVATURE_CORRECTED, // -1.74023e-8
  residueRelShiftFromLinear: IMP34397_RESIDUE_REL_SHIFT_FROM_LINEAR, // -0.1207
  kZeroQuad: IMP34397_KZERO_QUAD, // 21.280486
  kZeroQuadGap: IMP34397_KZERO_QUAD_GAP, // -4.64e-4
  note:
    'Curvature-corrected (quadratic through 3 imp-34237 rungs) read of dg_resid/dk AT k*~21.28095 ' +
    'tightens the imp-34310 secant residue R from ~-1.979e-8 to ~-1.740e-8 (-12.1%); the quadratic ' +
    'zero recovers k* to <5e-4 (~9.5x tighter than the linear secant zero), corroborating both the ' +
    'pole location and the slope correction. Simple-pole order UNCHANGED.',
  honest:
    'MEASUREMENT ONLY -- a higher-order re-read of the SAME 3 baked rungs, not new data; the residual ' +
    'floor is set by the unmeasured cubic term (~1-2% heuristic, data-limited as resid_exp->0 loses ' +
    'digits). Surrogate NOT rigorous; changes no bound; C_mb GUE-conditional per imp-486 UNTOUCHED; ' +
    'imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed.',
};

export const IMP34397_ASSERTIONS = [
  {
    id: 'imp-34397-quadratic-slope-steeper-than-secant',
    description:
      'the curvature-corrected slope at k* is negative and STEEPER (more negative) than the imp-34310 wide secant',
    holds: () =>
      IMP34397_SLOPE_AT_KSTAR < 0 &&
      IMP34397_SLOPE_AT_KSTAR < IMP34310_RESID_SLOPE_AT_ZERO &&
      Math.abs(IMP34397_SLOPE_AT_KSTAR - -2.633414e-7) < 1e-12,
  },
  {
    id: 'imp-34397-residue-tightened-value',
    description: 'the tightened residue is ~-1.740e-8, negative, and ~12% inward from the imp-34310 linear -1.979e-8',
    holds: () =>
      IMP34397_RESIDUE_CURVATURE_CORRECTED < 0 &&
      Math.abs(IMP34397_RESIDUE_CURVATURE_CORRECTED - -1.740233e-8) < 1e-12 &&
      IMP34397_RESIDUE_CURVATURE_CORRECTED > IMP34310_POLE_RESIDUE && // smaller magnitude
      Math.abs(IMP34397_RESIDUE_REL_SHIFT_FROM_LINEAR - -0.120685) < 1e-5,
  },
  {
    id: 'imp-34397-quadratic-zero-recovers-kstar',
    description:
      'the quadratic zero of resid_exp lands within 5e-4 of the independently-bisected k*, ~9.5x tighter than the linear secant zero',
    holds: () =>
      Math.abs(IMP34397_KZERO_QUAD_GAP) < 5e-4 &&
      Math.abs(IMP34397_KZERO_QUAD_GAP) < Math.abs(21.285369 - IMP34310_KSTAR) / 9 &&
      IMP34397_KZERO_QUAD > RUNG_LO.k &&
      IMP34397_KZERO_QUAD < RUNG_HI.k,
  },
  {
    id: 'imp-34397-quad-coeff-matches-imp34310-second-difference',
    description: 'the quadratic curvature coefficient c equals half the imp-34310 3-point 2nd difference (+3.379e-7)',
    holds: () =>
      IMP34397_QUAD_C > 0 &&
      Math.abs(2 * IMP34397_QUAD_C - 3.3792e-7) < 1e-11,
  },
  {
    id: 'imp-34397-rung-literals-match-imp34237-source-exactly',
    description:
      'the three rungs and k* consumed here exactly (===) reproduce the imp-34237 source rows / zero literal',
    holds: () =>
      RUNG_K0 !== undefined &&
      RUNG_LO !== undefined &&
      RUNG_HI !== undefined &&
      RUNG_K0.residExp === 8.72e-8 &&
      RUNG_LO.residExp === 8.19e-9 &&
      RUNG_HI.residExp === -4.97e-8 &&
      IMP34237_EFLOW_OVER_RESID_ROWS.length === 2 &&
      IMP34237_RESID_ZERO_KSTAR === IMP34310_KSTAR,
  },
];

for (const a of IMP34397_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34397-eflow-over-resid-residue-curvature-corrected assertion failed: ${a.id}`);
  }
}
