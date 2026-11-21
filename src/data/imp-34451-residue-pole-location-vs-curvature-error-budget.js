/**
 * @module imp-34451-residue-pole-location-vs-curvature-error-budget
 * @fileoverview imp-34451 -- PROPAGATE the imp-34374 refined resid_exp pole k* into the
 *   imp-34310 / imp-34397 eflow_over_resid residue R and DECOMPOSE the residue error budget
 *   into a POLE-LOCATION contribution (from the k* refinement) versus a FINITE-DIFFERENCE
 *   CURVATURE-FIT contribution (the imp-34310 linear-secant -> imp-34397 quadratic tightening).
 *
 *   THE SETUP. imp-34310 read the eflow_over_resid simple-pole residue R = eflow_attr(k*) / m
 *   at the canonical bisected zero k* = 21.28095 (m = 2-point secant slope), getting
 *   R ~ -1.97908e-8. imp-34397 tightened m to a curvature-corrected quadratic slope at k*,
 *   shifting R to ~-1.74023e-8 (a -12.07% inward move). SEPARATELY, imp-34374 refined the
 *   SAME resid_exp zero with the imp-34169 80-iteration bisection at FULL double precision to
 *   k*_full ~ 21.280947425. That refined k* was propagated into the imp-34287 pole-proximity
 *   regression (imp-34374) but NEVER into the residue R. This module closes that gap: it
 *   re-evaluates R at k*_full and asks how much of the residue uncertainty is pole-location
 *   uncertainty versus curvature-fit uncertainty.
 *
 *   Import-light: reuses the imp-34237 baked rows, the imp-34310 / imp-34397 residue exports,
 *   and the imp-34374 refined-k* export (all light chains, no heavy zeros-bundle, per
 *   [[no_heavy_imports_in_pages]]). No new data -- a re-evaluation of the existing residue
 *   formula at a refined pole coordinate.
 *
 *   METHOD. R(k*) = eflow_attr(k*) / m(k*), with eflow_attr(k*) = EFLOW_ATTR_LO +
 *   slope_attr*(k* - 21.25) the smooth linear numerator interp (imp-34310) and m(k*) either the
 *   k*-independent 2-point secant (linear channel, imp-34310) or the quadratic slope
 *   b + 2c*(k* - 21.25) (curvature channel, imp-34397). Evaluate both channels at the canonical
 *   k* = 21.28095 and at the imp-34374 refined k*_full = 21.280947425; the pole-location shift is
 *   dR_pole = R(k*_full) - R(k*_canon); the curvature-fit shift is dR_curv = R_quad(k*) -
 *   R_lin(k*) at fixed k*.
 *
 *   FINDINGS.
 *   (F1) THE k* REFINEMENT IS TINY. dk* = k*_full - k*_canon = 21.280947425 - 21.28095 =
 *        -2.575e-6 -- the imp-34310 canonical 5-decimal 21.28095 already pinned the zero to
 *        sub-3e-6. (The refined value is BELOW the canonical, i.e. the 21.28095 round was up.)
 *   (F2) POLE-LOCATION SHIFT IN R IS NEGLIGIBLE. In the linear channel R moves from -1.979078e-8
 *        to -1.979087e-8, dR_pole = -8.96e-14 (relative -4.53e-6, i.e. ~0.00045%). In the
 *        quadratic channel R moves from -1.740233e-8 to -1.740235e-8, dR_pole = -2.13e-14
 *        (relative -1.22e-6). Both are 6th-significant-figure moves -- the residue is essentially
 *        INSENSITIVE to the k* refinement.
 *   (F3) CURVATURE-FIT SHIFT IS THE DOMINANT TERM. At fixed k* the linear -> quadratic slope
 *        correction shifts R by +2.3885e-9 (relative -12.07%, the imp-34397 tightening). This is
 *        the WHOLE residue error budget to within the resolution floor.
 *   (F4) THE BUDGET IS CURVATURE-DOMINATED BY ~4-5 ORDERS OF MAGNITUDE. |dR_curv| / |dR_pole|
 *        (linear channel) = 2.67e4. So the residue uncertainty is ENTIRELY finite-difference /
 *        curvature-fit uncertainty; pole-location uncertainty (given the imp-34374 bisection) is
 *        negligible. The imp-34397 ~1-2% (heuristic) resolution floor from the unmeasured cubic
 *        term -- and the imp-34449 measured +/-1.1% error bar -- dwarf the ~5e-6 pole-location
 *        contribution. Refining k* further would NOT tighten R; only more near-pole rungs would.
 *
 *   VERDICT: propagating the imp-34374 full-precision pole k*_full ~ 21.280947425 (dk* ~
 *   -2.575e-6 from the imp-34310 canonical 21.28095) into the eflow_over_resid residue moves R by
 *   only ~9e-14 in the linear channel and ~2e-14 in the quadratic channel (relative ~1e-6 to
 *   ~5e-6), some 2.67e4 times SMALLER than the +2.39e-9 (12.07%) linear -> quadratic curvature-fit
 *   shift. The residue error budget is therefore curvature-fit-dominated; the pole-location
 *   contribution is negligible and the imp-34310 / imp-34397 residue readings stand UNCHANGED at
 *   their reported precision. Surrogate diagnostic, finite-difference re-evaluation on the same
 *   baked rungs; NOT a rigorous asymptotic; changes no bound; C_mb GUE-conditional per imp-486
 *   UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed.
 *
 *   @see imp-34310-eflow-over-resid-pole-residue-simple-pole.js (linear-secant residue at canonical k*)
 *   @see imp-34397-eflow-over-resid-residue-curvature-corrected.js (quadratic-slope curvature tightening)
 *   @see imp-34374-pole-proximity-refit-refined-kstar.js (the refined k*_full ~ 21.280947425 propagated here)
 *   @see imp-34449-residue-curvature-error-bar-extended-rungs.js (the measured +/-1.1% curvature error bar)
 *   @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (source rung literals, same pole)
 */

import {
  IMP34237_RESID_EXP_ROWS,
  IMP34237_EFLOW_OVER_RESID_ROWS,
} from './imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js';
import {
  IMP34310_KSTAR,
  IMP34310_RESID_SLOPE_AT_ZERO,
  IMP34310_POLE_RESIDUE,
} from './imp-34310-eflow-over-resid-pole-residue-simple-pole.js';
import {
  IMP34397_QUAD_B,
  IMP34397_QUAD_C,
  IMP34397_SLOPE_AT_KSTAR,
  IMP34397_RESIDUE_CURVATURE_CORRECTED,
} from './imp-34397-eflow-over-resid-residue-curvature-corrected.js';
import { IMP34374_POLE_PROXIMITY_REFIT_REFINED_KSTAR } from './imp-34374-pole-proximity-refit-refined-kstar.js';

// --- Baked inputs (imp-34237 literals) ----------------------------------------
const RUNG_K0 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 21.0);
const RUNG_LO = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 21.25); // last positive
const RUNG_HI = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 21.5); // first negative
const RATIO_LO = IMP34237_EFLOW_OVER_RESID_ROWS.find((r) => r.k === 21.25);
const RATIO_HI = IMP34237_EFLOW_OVER_RESID_ROWS.find((r) => r.k === 21.5);

// eflow_attr = ratio * resid_exp per rung; smooth linear interp of the numerator (imp-34310).
const EFLOW_ATTR_LO = RATIO_LO.ratio * RUNG_LO.residExp; // +4.8321e-15
const EFLOW_ATTR_HI = RATIO_HI.ratio * RUNG_HI.residExp; // +2.81799e-15
const EFLOW_ATTR_SLOPE = (EFLOW_ATTR_HI - EFLOW_ATTR_LO) / (RUNG_HI.k - RUNG_LO.k); // -8.05644e-15
const eflowAttrAt = (kStar) => EFLOW_ATTR_LO + EFLOW_ATTR_SLOPE * (kStar - RUNG_LO.k);

// Linear channel: m is the k*-independent 2-point secant slope (imp-34310).
const residueLinearAt = (kStar) => eflowAttrAt(kStar) / IMP34310_RESID_SLOPE_AT_ZERO;
// Quadratic channel: m(k*) = b + 2c*(k* - 21.25) is the curvature-corrected slope (imp-34397).
const quadSlopeAt = (kStar) => IMP34397_QUAD_B + 2 * IMP34397_QUAD_C * (kStar - RUNG_LO.k);
const residueQuadAt = (kStar) => eflowAttrAt(kStar) / quadSlopeAt(kStar);

// --- (F1) the pole coordinates ------------------------------------------------
export const IMP34451_KSTAR_CANON = IMP34310_KSTAR; // 21.28095 (imp-34310 canonical)
export const IMP34451_KSTAR_REFINED = IMP34374_POLE_PROXIMITY_REFIT_REFINED_KSTAR.kStarFull; // 21.280947425 (imp-34374)
export const IMP34451_DELTA_KSTAR = IMP34451_KSTAR_REFINED - IMP34451_KSTAR_CANON; // -2.575e-6

// --- (F2) pole-location shift in R (each channel) -----------------------------
const R_LIN_CANON = residueLinearAt(IMP34451_KSTAR_CANON); // -1.979078e-8 (reproduces imp-34310)
const R_LIN_REFINED = residueLinearAt(IMP34451_KSTAR_REFINED); // -1.979087e-8
export const IMP34451_POLE_SHIFT_LINEAR = R_LIN_REFINED - R_LIN_CANON; // -8.96e-14
export const IMP34451_POLE_SHIFT_LINEAR_REL = IMP34451_POLE_SHIFT_LINEAR / R_LIN_CANON; // -4.53e-6

const R_QUAD_CANON = residueQuadAt(IMP34451_KSTAR_CANON); // -1.740233e-8 (reproduces imp-34397)
const R_QUAD_REFINED = residueQuadAt(IMP34451_KSTAR_REFINED); // -1.740235e-8
export const IMP34451_POLE_SHIFT_QUAD = R_QUAD_REFINED - R_QUAD_CANON; // -2.13e-14
export const IMP34451_POLE_SHIFT_QUAD_REL = IMP34451_POLE_SHIFT_QUAD / R_QUAD_CANON; // -1.22e-6

// --- (F3) curvature-fit shift at fixed k* (linear -> quadratic) ---------------
export const IMP34451_CURVATURE_SHIFT = R_QUAD_CANON - R_LIN_CANON; // +2.3885e-9
export const IMP34451_CURVATURE_SHIFT_REL = IMP34451_CURVATURE_SHIFT / R_LIN_CANON; // -0.1207

// --- (F4) budget dominance ratio ----------------------------------------------
export const IMP34451_DOMINANCE_RATIO =
  Math.abs(IMP34451_CURVATURE_SHIFT) / Math.abs(IMP34451_POLE_SHIFT_LINEAR); // ~2.67e4

export const IMP34451_RESIDUE_POLE_LOCATION_VS_CURVATURE_ERROR_BUDGET = {
  ticket: 'imp-34451',
  kStarCanon: IMP34451_KSTAR_CANON,
  kStarRefined: IMP34451_KSTAR_REFINED,
  deltaKStar: IMP34451_DELTA_KSTAR,
  linearChannel: {
    residueCanon: R_LIN_CANON,
    residueRefined: R_LIN_REFINED,
    poleLocationShift: IMP34451_POLE_SHIFT_LINEAR,
    poleLocationShiftRel: IMP34451_POLE_SHIFT_LINEAR_REL,
  },
  quadraticChannel: {
    residueCanon: R_QUAD_CANON,
    residueRefined: R_QUAD_REFINED,
    poleLocationShift: IMP34451_POLE_SHIFT_QUAD,
    poleLocationShiftRel: IMP34451_POLE_SHIFT_QUAD_REL,
  },
  curvatureFitShift: IMP34451_CURVATURE_SHIFT,
  curvatureFitShiftRel: IMP34451_CURVATURE_SHIFT_REL,
  dominanceRatio: IMP34451_DOMINANCE_RATIO,
  note:
    'Propagating the imp-34374 refined pole k*_full ~ 21.280947425 (dk* ~ -2.575e-6 from the imp-34310 ' +
    'canonical 21.28095) into the eflow_over_resid residue moves R by only ~9e-14 (linear) / ~2e-14 ' +
    '(quadratic), relative ~1e-6 to ~5e-6 -- some 2.67e4x smaller than the +2.39e-9 (12.07%) ' +
    'linear -> quadratic curvature-fit shift. The residue error budget is curvature-fit-dominated; ' +
    'the pole-location contribution is negligible.',
  honest:
    'MEASUREMENT ONLY -- a re-evaluation of the imp-34310 / imp-34397 residue formula at a refined pole ' +
    'coordinate, no new data. Surrogate NOT rigorous; changes no bound; C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed.',
};

export const IMP34451_ASSERTIONS = [
  {
    id: 'imp-34451-refined-kstar-below-canonical-tiny',
    description: 'the imp-34374 refined k* ~ 21.280947425 sits ~2.575e-6 BELOW the imp-34310 canonical 21.28095',
    holds: () =>
      Math.abs(IMP34451_KSTAR_REFINED - 21.280947425) < 1e-8 &&
      IMP34451_DELTA_KSTAR < 0 &&
      Math.abs(IMP34451_DELTA_KSTAR - -2.575e-6) < 1e-9,
  },
  {
    id: 'imp-34451-linear-channel-reproduces-imp34310',
    description: 'R_lin at the canonical k* reproduces the imp-34310 residue -1.97908e-8 (reuse gate)',
    holds: () =>
      R_LIN_CANON < 0 &&
      Math.abs(R_LIN_CANON - IMP34310_POLE_RESIDUE) < 1e-16 &&
      Math.abs(R_LIN_CANON - -1.979078e-8) < 1e-13,
  },
  {
    id: 'imp-34451-quad-channel-reproduces-imp34397',
    description: 'R_quad at the canonical k* reproduces the imp-34397 curvature-corrected residue -1.74023e-8 (reuse gate)',
    holds: () =>
      R_QUAD_CANON < 0 &&
      Math.abs(R_QUAD_CANON - IMP34397_RESIDUE_CURVATURE_CORRECTED) < 1e-16 &&
      Math.abs(R_QUAD_CANON - -1.740233e-8) < 1e-13,
  },
  {
    id: 'imp-34451-pole-location-shift-negligible',
    description: 'propagating the refined k* moves R by ~9e-14 (linear) / ~2e-14 (quadratic), relative < 1e-5 in both channels',
    holds: () =>
      Math.abs(IMP34451_POLE_SHIFT_LINEAR) < 1e-12 &&
      Math.abs(IMP34451_POLE_SHIFT_LINEAR_REL) < 1e-5 &&
      Math.abs(IMP34451_POLE_SHIFT_QUAD) < 1e-12 &&
      Math.abs(IMP34451_POLE_SHIFT_QUAD_REL) < 1e-5,
  },
  {
    id: 'imp-34451-curvature-fit-dominates-budget',
    description: 'the curvature-fit shift (~12%) dominates the pole-location shift by ~2.67e4 -- the budget is curvature-dominated',
    holds: () =>
      Math.abs(IMP34451_CURVATURE_SHIFT_REL - -0.1207) < 1e-3 &&
      IMP34451_DOMINANCE_RATIO > 1e4 &&
      Math.abs(IMP34451_CURVATURE_SHIFT) > 1e4 * Math.abs(IMP34451_POLE_SHIFT_LINEAR),
  },
  {
    id: 'imp-34451-quad-slope-at-kstar-matches-imp34397',
    description: 'the quadratic slope evaluated at the canonical k* reproduces the imp-34397 m_star ~ -2.63341e-7',
    holds: () =>
      Math.abs(quadSlopeAt(IMP34451_KSTAR_CANON) - IMP34397_SLOPE_AT_KSTAR) < 1e-15,
  },
];

for (const a of IMP34451_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34451-residue-pole-location-vs-curvature-error-budget assertion failed: ${a.id}`);
  }
}
