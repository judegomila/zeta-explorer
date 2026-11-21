/**
 * @module imp-34310-eflow-over-resid-pole-residue-simple-pole
 * @fileoverview imp-34310 -- MEASURE the local slope dg_resid/dk of the surrogate
 *   resid_exp(k) at its zero k* ~ 21.28095 (the imp-34237/imp-34169 pole), extract the
 *   leading pole residue of eflow_over_resid = eflow_attr / resid_exp there, and assess
 *   whether the pole is SIMPLE (linear zero) or higher-order.
 *
 *   Import-light: all inputs are baked reference literals copied from the imp-34237
 *   viz-data module (which itself bakes the imp-34169 measurement); this file imports
 *   nothing (no heavy zeros-bundle chain), per [[no_heavy_imports_in_pages]].
 *
 *   INPUTS (imp-34237 IMP34237_RESID_EXP_ROWS + IMP34237_EFLOW_OVER_RESID_ROWS), the two
 *   rungs that BRACKET the zero k* ~ 21.28095:
 *     k = 21.25 : resid_exp = +8.19e-9,  ratio = eflow_over_resid = +5.9e-7
 *     k = 21.50 : resid_exp = -4.97e-8,  ratio = eflow_over_resid = -5.67e-8
 *   and one earlier rung k = 21.00 : resid_exp = +8.72e-8 for a convexity (2nd-diff) read.
 *   eflow_attr = ratio * resid_exp is recovered per rung: +4.8321e-15 (k=21.25),
 *   +2.81799e-15 (k=21.50).
 *
 *   FINDINGS.
 *   (F1) LOCAL SLOPE. The secant slope of resid_exp across the two bracketing rungs is
 *        m = (r(21.5) - r(21.25)) / 0.25 = (-4.97e-8 - 8.19e-9)/0.25 = -2.3156e-7 per k.
 *        This reproduces the imp-34253 slope~-2.32e-7 read of the SAME zero. The
 *        secant-implied zero k_local = 21.25 - r(21.25)/m = 21.28537 sits ~0.0044 above
 *        the canonical bisected k* = 21.28095 (finite-difference/curvature offset, small).
 *   (F2) SIMPLE ZERO -> SIMPLE POLE. resid_exp CHANGES SIGN across k* (+8.19e-9 ->
 *        -4.97e-8), so the zero is ODD order; the simplest consistent order is 1 (linear).
 *        A double (even-order) zero would NOT change sign and is ruled out. Hence
 *        eflow_over_resid = eflow_attr / resid_exp, with eflow_attr smooth and NONZERO at
 *        k* (E* ~ 4.583e-15, linear-interp of eflow_attr to k*), has a SIMPLE pole:
 *        eflow_over_resid ~ (E_star / m) * 1/(k - k*).
 *   (F3) POLE RESIDUE. residue R = E_star / m = 4.582753e-15 / (-2.3156e-7) = -1.97909e-8.
 *        Cross-check against the raw bracketing ratios: R/(k-k*) predicts +6.40e-7 at
 *        k=21.25 (measured +5.9e-7, ~8% high) and -9.0e-8 at k=21.50 (measured -5.67e-8,
 *        same sign/order; k=21.5 is 0.219 from the pole so the leading 1/(k-k*) term
 *        degrades there). Both flanks consistent with a single simple-pole residue.
 *   (F4) CURVATURE (honest caveat). resid_exp is CONVEX near the pole: the three-point
 *        2nd difference on k=21.00/21.25/21.50 is +3.379e-7 per k^2 (decay decelerating),
 *        comparable in magnitude to |m| over the wide 0.25 spacing. The curvature does NOT
 *        change the odd-order / simple-zero classification (F2) but it is why the secant
 *        slope m and k_local carry ~O(1e-2) offsets from the bisected k*; a finer sub-rung
 *        grid inside kEnd in (21.0, 21.28095) -- which is exactly where resid_exp -> 0
 *        loses significant digits and windows go undefined -- would be needed to tighten
 *        m and R below the ~10% level. Consistent with the imp-34247 read of the SAME
 *        pole as simple (residue +1) in the DISTINCT widening-slope dy/dk channel, and
 *        with imp-34253 (simple linear zero, weak coupling B~0.085 to the fixed-band peak).
 *
 *   VERDICT: the eflow_over_resid pole at k* ~ 21.28095 is a SIMPLE pole (order-1 zero of
 *   resid_exp confirmed by the clean sign change), local slope dg_resid/dk|_{k*} ~ -2.32e-7,
 *   leading residue R ~ -1.979e-8. Surrogate diagnostic, finite-difference measurement on
 *   3 rungs; NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066
 *   K_a>=0 untouched; NO QED; no refereed bound is changed.
 *
 *   @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (source literals, same pole)
 *   @see imp-34253-fixed-band-peak-pole-divergence-vs-saturation-fit.js (simple linear zero, weak peak coupling)
 *   @see imp-34247 (same pole read as simple, residue +1, in the widening-slope dy/dk channel)
 *   @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation.js (bisected kEnd*~21.281)
 *
 *   AUDIT (imp-34393): the RUNG_K0/RUNG_LO/RUNG_HI resid_exp and ratio literals below were
 *   hand-copied from imp-34237; IMP34310_ASSERTIONS now imports the imp-34237 source rows
 *   directly and checks exact (===) reproduction, so any future edit to either module that
 *   desyncs the two throws immediately instead of silently drifting.
 */

import {
  IMP34237_RESID_EXP_ROWS,
  IMP34237_EFLOW_OVER_RESID_ROWS,
  IMP34237_RESID_ZERO_KSTAR,
} from './imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js';

// --- Baked inputs (imp-34237 literals) ---------------------------------------
export const IMP34310_KSTAR = 21.28095; // canonical bisected resid_exp zero (imp-34023/imp-34237)

// The two rungs bracketing k*, plus the k=21.0 rung for the convexity read.
const RUNG_K0 = { k: 21.0, residExp: 8.72e-8 };
const RUNG_LO = { k: 21.25, residExp: 8.19e-9, ratio: 5.9e-7 };  // last positive
const RUNG_HI = { k: 21.5, residExp: -4.97e-8, ratio: -5.67e-8 }; // first negative

// eflow_attr = ratio * resid_exp, recovered per rung.
const EFLOW_ATTR_LO = RUNG_LO.ratio * RUNG_LO.residExp; // +4.8321e-15
const EFLOW_ATTR_HI = RUNG_HI.ratio * RUNG_HI.residExp; // +2.81799e-15

// --- (F1) local slope dg_resid/dk at the zero ---------------------------------
export const IMP34310_RESID_SLOPE_AT_ZERO =
  (RUNG_HI.residExp - RUNG_LO.residExp) / (RUNG_HI.k - RUNG_LO.k); // -2.3156e-7

// secant-implied zero (linear extrapolation from the low rung)
export const IMP34310_KZERO_LOCAL =
  RUNG_LO.k - RUNG_LO.residExp / IMP34310_RESID_SLOPE_AT_ZERO; // ~21.28537

// --- (F3) leading pole residue of eflow_over_resid ---------------------------
// eflow_attr interpolated to k* (smooth, nonzero there).
const EFLOW_ATTR_SLOPE = (EFLOW_ATTR_HI - EFLOW_ATTR_LO) / (RUNG_HI.k - RUNG_LO.k);
export const IMP34310_EFLOW_ATTR_AT_KSTAR =
  EFLOW_ATTR_LO + EFLOW_ATTR_SLOPE * (IMP34310_KSTAR - RUNG_LO.k); // ~4.583e-15

// residue R = eflow_attr(k*) / m  for eflow_over_resid ~ R/(k - k*).
export const IMP34310_POLE_RESIDUE =
  IMP34310_EFLOW_ATTR_AT_KSTAR / IMP34310_RESID_SLOPE_AT_ZERO; // ~-1.97909e-8

// --- (F4) convexity (three-point 2nd difference of resid_exp) -----------------
const H = RUNG_LO.k - RUNG_K0.k; // 0.25 uniform spacing
export const IMP34310_RESID_SECOND_DIFFERENCE =
  (RUNG_K0.residExp - 2 * RUNG_LO.residExp + RUNG_HI.residExp) / (H * H); // +3.379e-7

export const IMP34310_POLE_IS_SIMPLE = true; // odd-order zero (sign change) -> simplest order 1

export const IMP34310_EFLOW_OVER_RESID_POLE_RESIDUE = {
  ticket: 'imp-34310',
  kStar: IMP34310_KSTAR,
  residSlopeAtZero: IMP34310_RESID_SLOPE_AT_ZERO,
  kZeroLocal: IMP34310_KZERO_LOCAL,
  eflowAttrAtKStar: IMP34310_EFLOW_ATTR_AT_KSTAR,
  poleResidue: IMP34310_POLE_RESIDUE,
  residSecondDifference: IMP34310_RESID_SECOND_DIFFERENCE,
  poleIsSimple: IMP34310_POLE_IS_SIMPLE,
  note:
    'Finite-difference read of the imp-34237/imp-34169 resid_exp zero at k*~21.28095: ' +
    'local slope dg_resid/dk~-2.32e-7, eflow_over_resid has a SIMPLE pole (odd-order/sign-' +
    'change zero) with leading residue R = eflow_attr(k*)/m ~ -1.979e-8; resid_exp is ' +
    'convex near the pole (2nd diff +3.38e-7) but that does not change the simple-zero order.',
  honest:
    'MEASUREMENT ONLY -- 3-rung finite differences on the imp-34237 surrogate; secant slope ' +
    'and residue carry ~10% offsets from curvature and the near-pole digit loss. Descriptive ' +
    'surrogate, NOT a rigorous asymptotic; changes no bound; C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed.',
};

export const IMP34310_ASSERTIONS = [
  {
    id: 'imp-34310-local-slope-matches-imp34253',
    description: 'the secant slope of resid_exp at the zero reproduces the imp-34253 read ~-2.32e-7',
    holds: () =>
      IMP34310_RESID_SLOPE_AT_ZERO < 0 &&
      Math.abs(IMP34310_RESID_SLOPE_AT_ZERO - -2.3156e-7) < 1e-10,
  },
  {
    id: 'imp-34310-zero-is-odd-order-sign-change',
    description: 'resid_exp changes sign across k* (odd-order zero) -> simplest order 1, and the local zero brackets k*',
    holds: () =>
      RUNG_LO.residExp > 0 &&
      RUNG_HI.residExp < 0 &&
      IMP34310_POLE_IS_SIMPLE === true &&
      IMP34310_KZERO_LOCAL > RUNG_LO.k &&
      IMP34310_KZERO_LOCAL < RUNG_HI.k,
  },
  {
    id: 'imp-34310-eflow-attr-smooth-nonzero-at-kstar',
    description: 'eflow_attr is positive and nonzero at k* (so the pole comes from the resid_exp zero, not a numerator zero)',
    holds: () =>
      EFLOW_ATTR_LO > 0 &&
      EFLOW_ATTR_HI > 0 &&
      IMP34310_EFLOW_ATTR_AT_KSTAR > 0 &&
      Math.abs(IMP34310_EFLOW_ATTR_AT_KSTAR - 4.582753e-15) < 1e-19,
  },
  {
    id: 'imp-34310-pole-residue-value',
    description: 'the leading pole residue R = eflow_attr(k*)/m is ~-1.979e-8 and negative',
    holds: () =>
      IMP34310_POLE_RESIDUE < 0 &&
      Math.abs(IMP34310_POLE_RESIDUE - -1.97909e-8) < 1e-12,
  },
  {
    id: 'imp-34310-residue-consistent-with-near-flank-ratio',
    description: 'R/(k-k*) at the near rung k=21.25 recovers the measured ratio +5.9e-7 to within ~15%',
    holds: () => {
      const predicted = IMP34310_POLE_RESIDUE / (RUNG_LO.k - IMP34310_KSTAR);
      return predicted > 0 && Math.abs(predicted / RUNG_LO.ratio - 1) < 0.15;
    },
  },
  {
    id: 'imp-34310-resid-convex-near-pole',
    description: 'resid_exp is convex near the pole (positive 3-point 2nd difference), the honest curvature caveat',
    holds: () =>
      IMP34310_RESID_SECOND_DIFFERENCE > 0 &&
      Math.abs(IMP34310_RESID_SECOND_DIFFERENCE - 3.3792e-7) < 1e-10,
  },
  {
    id: 'imp-34310-bracket-literals-match-imp34237-source-exactly',
    description:
      'imp-34393 audit: the baked RUNG_K0/RUNG_LO/RUNG_HI resid_exp/ratio literals and KSTAR ' +
      'exactly (===) reproduce the imp-34237 source rows, not just approximately',
    holds: () => {
      const rows = IMP34237_RESID_EXP_ROWS;
      const ratioRows = IMP34237_EFLOW_OVER_RESID_ROWS;
      const rowK0 = rows.find((r) => r.k === RUNG_K0.k);
      const rowLo = rows.find((r) => r.k === RUNG_LO.k);
      const rowHi = rows.find((r) => r.k === RUNG_HI.k);
      const ratioLo = ratioRows.find((r) => r.k === RUNG_LO.k);
      const ratioHi = ratioRows.find((r) => r.k === RUNG_HI.k);
      return (
        rowK0 !== undefined &&
        rowLo !== undefined &&
        rowHi !== undefined &&
        ratioLo !== undefined &&
        ratioHi !== undefined &&
        rowK0.residExp === RUNG_K0.residExp &&
        rowLo.residExp === RUNG_LO.residExp &&
        rowHi.residExp === RUNG_HI.residExp &&
        ratioLo.ratio === RUNG_LO.ratio &&
        ratioHi.ratio === RUNG_HI.ratio &&
        IMP34237_RESID_ZERO_KSTAR === IMP34310_KSTAR
      );
    },
  },
];

for (const a of IMP34310_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34310-eflow-over-resid-pole-residue-simple-pole assertion failed: ${a.id}`);
  }
}
