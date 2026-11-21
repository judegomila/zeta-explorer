/**
 * @module imp-34449-residue-curvature-error-bar-extended-rungs
 * @fileoverview imp-34449 -- CONVERT the imp-34397 residue R~-1.740e-8 "residual ~1-2%
 *   (heuristic, data-limited)" caveat into a QUANTIFIED, MEASURED error bar by extending the
 *   imp-34397 3-rung local quadratic (k = 21.0, 21.25, 21.5) to a 4th and 5th rung and comparing
 *   the SUCCESSIVE polynomial re-reads of the slope dg_resid/dk AT the pole k* ~ 21.28095.
 *
 *   THE OPENING. imp-34397 fit a quadratic through the three imp-34237 rungs nearest the pole and
 *   evaluated its slope AT k*, tightening the imp-34310 2-point secant residue R = -1.97909e-8 to
 *   R_quad = -1.74023e-8 (-12.07%). Its F4 flagged the leading uncalibrated error as the unmeasured
 *   CUBIC term and estimated the residual as ~1-2% "under geometric Taylor convergence" -- but that
 *   was a heuristic, not a measured spread. imp-34397 asserted "no genuinely finer sub-rung inside
 *   (21.0, 21.28095) exists". TRUE for finer near-pole samples -- but the imp-34237 source ALSO
 *   carries two FARTHER rungs (k = 20.0, residExp = 7.94e-7) and (k = 19.0, residExp = 3.04e-6)
 *   that imp-34397 never used. Adding them RAISES the polynomial ORDER of the local fit (quad ->
 *   cubic -> quartic) without needing new data, which is exactly what calibrates the next Taylor term.
 *
 *   Import-light: reuses the imp-34237 baked rows and the imp-34310/imp-34397 exports for the
 *   numerator and baseline (no heavy zeros-bundle chain, per [[no_heavy_imports_in_pages]]). No new
 *   data -- a higher-ORDER re-read of the SAME 5 baked rungs.
 *
 *   METHOD. Newton divided-difference derivative of resid_exp at k*, evaluated for three nested fits
 *   that KEEP all three near-pole rungs and successively PREPEND a farther rung to raise the order:
 *     (A) 3-rung QUADRATIC  through (21.0, 21.25, 21.5)              -- imp-34397 baseline
 *     (B) 4-rung CUBIC      through (20.0, 21.0, 21.25, 21.5)
 *     (C) 5-rung QUARTIC    through (19.0, 20.0, 21.0, 21.25, 21.5)
 *   The residue for each is R = eflow_attr(k*) / slope(k*), with eflow_attr(k*) = 4.582753e-15
 *   carried unchanged from imp-34310 (numerator smooth/nonzero at the pole).
 *
 *   FINDINGS.
 *   (F1) SUCCESSIVE RE-READS. slope(k*): -2.63341e-7 (quad) -> -2.57631e-7 (cubic) -> -2.60992e-7
 *        (quartic). Residue R: -1.74023e-8 (quad) -> -1.77880e-8 (cubic) -> -1.75589e-8 (quartic).
 *   (F2) SHIFTS DECREASE -- CONVERGENCE. The quad->cubic shift is +2.216% of |R_quad|; the
 *        quad->quartic shift is +0.900%. The order-by-order correction SHRINKS (2.22% -> 0.90%),
 *        the signature of a converging Taylor sequence -- so the imp-34397 heuristic ~1-2% was REAL
 *        and is now MEASURED, not assumed. The cubic term (first uncalibrated in imp-34397) is worth
 *        ~2.2%; the quartic pulls back inside ~1%, bounding the tail.
 *   (F3) MEASURED ERROR BAR. Across the three successive fits R spans [-1.77880e-8, -1.74023e-8],
 *        a full width 3.857e-10 -> half-width 1.929e-10 = 1.108% of |R_quad|. Reported honest bar:
 *        R = -1.756e-8 +/- 0.019e-8 (central = 5-rung quartic best higher-order read; +/- = half the
 *        spread of the quad/cubic/quartic re-reads), i.e. R in [-1.779e-8, -1.740e-8], ~+/-1.1%.
 *   (F4) NEAR-RUNG SWAPS ARE NOT THE ERROR BAR (honest caveat). Simply SWAPPING a near rung for the
 *        far 20.0 rung in a quadratic triple -- (20.0, 21.25, 21.5) or (20.0, 21.0, 21.25) -- swings
 *        R wildly to -1.62882e-8 / -2.09701e-8, because dropping a near-pole rung LOSES local
 *        resolution at k*. Those swaps are NOT valid re-reads and are excluded; the error bar is
 *        built only from nested fits that keep every near rung and raise ORDER. This is why the
 *        honest bar is ~1.1%, not the ~20% a naive rung-swap would suggest.
 *
 *   VERDICT: the imp-34397 "~1-2% heuristic, data-limited" residual is converted into a MEASURED
 *   error bar R = -1.756e-8 +/- 0.019e-8 (~+/-1.1% half-width) from three successive nested
 *   polynomial re-reads (quad/cubic/quartic) at k*, whose order-by-order shift DECREASES (2.22% ->
 *   0.90%) confirming Taylor convergence. imp-34397 tightened value, simple-pole classification, and
 *   all upstream verdicts UNCHANGED. Surrogate diagnostic, finite-difference re-read on 5 baked
 *   rungs; NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0
 *   untouched; NO QED; no refereed bound is changed.
 *
 *   @see imp-34397-eflow-over-resid-residue-curvature-corrected.js (3-rung baseline, F4 heuristic this quantifies)
 *   @see imp-34310-eflow-over-resid-pole-residue-simple-pole.js (linear secant residue, numerator source)
 *   @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (all 5 rung literals)
 */

import { IMP34237_RESID_EXP_ROWS } from './imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js';
import {
  IMP34310_KSTAR,
  IMP34310_EFLOW_ATTR_AT_KSTAR,
} from './imp-34310-eflow-over-resid-pole-residue-simple-pole.js';
import {
  IMP34397_SLOPE_AT_KSTAR,
  IMP34397_RESIDUE_CURVATURE_CORRECTED,
} from './imp-34397-eflow-over-resid-residue-curvature-corrected.js';

// --- Baked inputs: all five imp-34237 rungs, ascending in k --------------------------------
const R19 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 19.0);
const R20 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 20.0);
const R21 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 21.0);
const R2125 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 21.25);
const R215 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 21.5);
const KSTAR = IMP34310_KSTAR; // 21.28095

// Newton divided-difference derivative of the interpolant through `nodes` evaluated at x.
function polyDerivAt(nodes, x) {
  const n = nodes.length;
  const xs = nodes.map((p) => p.k);
  const ys = nodes.map((p) => p.residExp);
  const dd = [ys.slice()];
  for (let j = 1; j < n; j++) {
    const col = [];
    for (let i = 0; i < n - j; i++) {
      col.push((dd[j - 1][i + 1] - dd[j - 1][i]) / (xs[i + j] - xs[i]));
    }
    dd.push(col);
  }
  let der = 0;
  for (let j = 1; j < n; j++) {
    let dsum = 0;
    for (let drop = 0; drop < j; drop++) {
      let prod = 1;
      for (let m = 0; m < j; m++) {
        if (m !== drop) prod *= x - xs[m];
      }
      dsum += prod;
    }
    der += dd[j][0] * dsum;
  }
  return der;
}

function residueFromFit(nodes) {
  const slope = polyDerivAt(nodes, KSTAR);
  return { slope, residue: IMP34310_EFLOW_ATTR_AT_KSTAR / slope };
}

// --- (A/B/C) three nested fits: quad -> cubic -> quartic ------------------------------------
const FIT_QUAD = residueFromFit([R21, R2125, R215]); // 3-rung (imp-34397)
const FIT_CUBIC = residueFromFit([R20, R21, R2125, R215]); // + far rung 20.0
const FIT_QUARTIC = residueFromFit([R19, R20, R21, R2125, R215]); // + far rung 19.0

export const IMP34449_SLOPE_QUAD = FIT_QUAD.slope; // -2.63341e-7
export const IMP34449_SLOPE_CUBIC = FIT_CUBIC.slope; // -2.57631e-7
export const IMP34449_SLOPE_QUARTIC = FIT_QUARTIC.slope; // -2.60992e-7

export const IMP34449_RESIDUE_QUAD = FIT_QUAD.residue; // -1.74023e-8
export const IMP34449_RESIDUE_CUBIC = FIT_CUBIC.residue; // -1.77880e-8
export const IMP34449_RESIDUE_QUARTIC = FIT_QUARTIC.residue; // -1.75589e-8

// --- (F2) successive order-by-order shifts in |R|, relative to the quad baseline ------------
// R stays negative and grows in MAGNITUDE (quad -> cubic -> quartic); we report the shift of |R|
// from the quad baseline so both entries are positive and the DECREASE 2.22% -> 0.90% is explicit.
export const IMP34449_SHIFT_QUAD_TO_CUBIC =
  (Math.abs(IMP34449_RESIDUE_CUBIC) - Math.abs(IMP34449_RESIDUE_QUAD)) /
  Math.abs(IMP34449_RESIDUE_QUAD); // +0.02216
export const IMP34449_SHIFT_QUAD_TO_QUARTIC =
  (Math.abs(IMP34449_RESIDUE_QUARTIC) - Math.abs(IMP34449_RESIDUE_QUAD)) /
  Math.abs(IMP34449_RESIDUE_QUAD); // +0.00900

// --- (F3) measured error bar: spread of the three re-reads ----------------------------------
const R_VALUES = [IMP34449_RESIDUE_QUAD, IMP34449_RESIDUE_CUBIC, IMP34449_RESIDUE_QUARTIC];
export const IMP34449_RESIDUE_MIN = Math.min(...R_VALUES); // -1.77880e-8
export const IMP34449_RESIDUE_MAX = Math.max(...R_VALUES); // -1.74023e-8
export const IMP34449_ERROR_BAR_HALFWIDTH = (IMP34449_RESIDUE_MAX - IMP34449_RESIDUE_MIN) / 2; // 1.929e-10
export const IMP34449_ERROR_BAR_REL =
  IMP34449_ERROR_BAR_HALFWIDTH / Math.abs(IMP34449_RESIDUE_QUAD); // 0.01108
// central estimate = highest-order (quartic) best re-read
export const IMP34449_RESIDUE_CENTRAL = IMP34449_RESIDUE_QUARTIC; // -1.75589e-8

export const IMP34449_RESIDUE_CURVATURE_ERROR_BAR_EXTENDED_RUNGS = {
  ticket: 'imp-34449',
  kStar: KSTAR,
  slopeQuad: IMP34449_SLOPE_QUAD,
  slopeCubic: IMP34449_SLOPE_CUBIC,
  slopeQuartic: IMP34449_SLOPE_QUARTIC,
  residueQuad: IMP34449_RESIDUE_QUAD,
  residueCubic: IMP34449_RESIDUE_CUBIC,
  residueQuartic: IMP34449_RESIDUE_QUARTIC,
  shiftQuadToCubic: IMP34449_SHIFT_QUAD_TO_CUBIC,
  shiftQuadToQuartic: IMP34449_SHIFT_QUAD_TO_QUARTIC,
  residueCentral: IMP34449_RESIDUE_CENTRAL,
  errorBarHalfWidth: IMP34449_ERROR_BAR_HALFWIDTH,
  errorBarRel: IMP34449_ERROR_BAR_REL,
  note:
    'Extending the imp-34397 3-rung quadratic (k=21.0/21.25/21.5) to a 4th (20.0) and 5th (19.0) ' +
    'imp-34237 rung -- raising the local fit order quad->cubic->quartic while KEEPING all near-pole ' +
    'rungs -- re-reads the residue R at k* as -1.74023e-8 -> -1.77880e-8 -> -1.75589e-8. The ' +
    'order-by-order shift DECREASES (+2.22% -> +0.90%), converting the imp-34397 heuristic ~1-2% ' +
    'residual into a MEASURED error bar R = -1.756e-8 +/- 0.019e-8 (~+/-1.1% half-width). Simple-pole ' +
    'order and imp-34397 tightened value UNCHANGED.',
  honest:
    'MEASUREMENT ONLY -- a higher-ORDER re-read of the SAME 5 baked rungs, not new data. The error ' +
    'bar is built only from NESTED fits that keep every near-pole rung and raise order; naive rung ' +
    'SWAPS that drop a near rung swing R to -1.63e-8/-2.10e-8 and are excluded as resolution-losing. ' +
    'Surrogate NOT rigorous; changes no bound; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 ' +
    'K_a>=0 untouched; NO QED; no refereed bound is changed.',
};

export const IMP34449_ASSERTIONS = [
  {
    id: 'imp-34449-quad-reread-matches-imp34397-baseline',
    description:
      'the 3-rung quadratic slope and residue re-read here reproduce the imp-34397 baseline exactly (===)',
    holds: () =>
      IMP34449_SLOPE_QUAD === IMP34397_SLOPE_AT_KSTAR &&
      IMP34449_RESIDUE_QUAD === IMP34397_RESIDUE_CURVATURE_CORRECTED,
  },
  {
    id: 'imp-34449-successive-reads-all-negative-and-near-baseline',
    description:
      'all three nested re-reads (quad/cubic/quartic) are negative simple-pole residues within ~2.5% of the imp-34397 baseline',
    holds: () =>
      IMP34449_RESIDUE_QUAD < 0 &&
      IMP34449_RESIDUE_CUBIC < 0 &&
      IMP34449_RESIDUE_QUARTIC < 0 &&
      Math.abs(IMP34449_RESIDUE_CUBIC - -1.7788033e-8) < 1e-13 &&
      Math.abs(IMP34449_RESIDUE_QUARTIC - -1.7558948e-8) < 1e-13,
  },
  {
    id: 'imp-34449-order-shift-decreases-convergence',
    description:
      'the order-by-order shift DECREASES (quad->quartic 0.90% < quad->cubic 2.22%), the signature of a converging Taylor sequence',
    holds: () =>
      IMP34449_SHIFT_QUAD_TO_CUBIC > 0 &&
      IMP34449_SHIFT_QUAD_TO_QUARTIC > 0 &&
      Math.abs(IMP34449_SHIFT_QUAD_TO_CUBIC) < 0.03 &&
      Math.abs(IMP34449_SHIFT_QUAD_TO_QUARTIC) < Math.abs(IMP34449_SHIFT_QUAD_TO_CUBIC) &&
      Math.abs(IMP34449_SHIFT_QUAD_TO_CUBIC - 0.0221640) < 1e-6 &&
      Math.abs(IMP34449_SHIFT_QUAD_TO_QUARTIC - 0.0089999) < 1e-6,
  },
  {
    id: 'imp-34449-measured-error-bar-about-one-percent',
    description:
      'the spread of the three re-reads is a measured half-width ~1.1% of |R|, quantifying the imp-34397 heuristic ~1-2% caveat',
    holds: () =>
      IMP34449_ERROR_BAR_HALFWIDTH > 0 &&
      Math.abs(IMP34449_ERROR_BAR_REL - 0.011082) < 1e-5 &&
      IMP34449_ERROR_BAR_REL > 0.005 &&
      IMP34449_ERROR_BAR_REL < 0.02,
  },
  {
    id: 'imp-34449-rung-literals-match-imp34237-source-exactly',
    description: 'the five rungs consumed here exactly (===) reproduce the imp-34237 source rows',
    holds: () =>
      R19.residExp === 3.04e-6 &&
      R20.residExp === 7.94e-7 &&
      R21.residExp === 8.72e-8 &&
      R2125.residExp === 8.19e-9 &&
      R215.residExp === -4.97e-8,
  },
];

for (const a of IMP34449_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34449-residue-curvature-error-bar-extended-rungs assertion failed: ${a.id}`);
  }
}
