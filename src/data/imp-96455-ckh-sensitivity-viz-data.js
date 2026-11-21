/**
 * @module imp-96455-ckh-sensitivity-viz-data
 *
 * imp-96455 (ux): import-light viz-data leaf for the imp-96429 C_KH-sensitivity sweep.
 * imp-96429 measured that the imp-96402 count-model-independence verdict is EXACTLY
 * invariant to a 3-decade rescaling of the Koksma-Hlawka factor C_KH (it cancels as a
 * common sqrt-prefactor in the relative gap), while the absolute E_coll magnitude scales
 * as sqrt(C_KH). imp-96429 shipped only a baked sweep table, no chart. This module reshapes
 * the eight sweep rows into three log-ready series -- the two flat relative-gap lines
 * (1e22 at the double-precision floor, first-zero at 8.47e-2) and the E_coll magnitude
 * ratio against the exact sqrt(factor) reference line -- so the "verdict flat, magnitude
 * scales" claim in the imp-96429 prose can be read visually.
 *
 * No re-derivation: every C_KH, factorVsBaseline, rateRelGap and eCollA1e22 value is
 * copied verbatim from IMP96429_ECOLL_CKH_SENSITIVITY.sweep (imp-96429). The only new
 * arithmetic here is the log10 axis reshaping, an abs()/floor-clip of the near-zero 1e22
 * gap so it is representable on a log axis, and the eCollA1e22 ratio to the baseline value.
 *
 * @see imp-96429-ecoll-ckh-sensitivity.js (the source object this reshapes)
 * @see imp-96402-ecoll-anchor-from-tabulated-true-zero-height.js (the verdict under test)
 *
 * Ticket: imp-96455 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound;
 * NO QED. No self-executing assertion throw (per the imp-96294 convention) -- values are
 * validated below via a plain exported check object instead of an import-time throw.
 */

import { IMP96429_ECOLL_CKH_SENSITIVITY as SRC } from './imp-96429-ecoll-ckh-sensitivity.js';

const log10 = Math.log10;

// Double-precision resolution floor: the 1e22 rate relative gap is exactly 0 at every
// C_KH, so it is clipped to this floor to be representable on a log axis.
const FLOOR = 1e-16;
const clip = (v) => Math.max(Math.abs(v), FLOOR);

export const IMP96455_SWEEP_POINTS = SRC.sweep.map((s) => ({
  factorVsBaseline: s.factorVsBaseline,
  log10Factor: log10(s.factorVsBaseline),
  rateRelGap1e22Abs: clip(s.rateRelGap1e22),
  log10RateRelGap1e22: log10(clip(s.rateRelGap1e22)),
  rateRelGapFirstZero: s.rateRelGapFirstZero,
  eCollA1e22: s.eCollA1e22,
  eCollRatio: s.eCollA1e22 / SRC.baseline.eCollA1e22,
  log10EcollRatio: log10(s.eCollA1e22 / SRC.baseline.eCollA1e22),
  log10SqrtFactorRef: 0.5 * log10(s.factorVsBaseline),
}));

export const IMP96455_LANDMARKS = Object.freeze({
  floor: FLOOR,
  rateRelGapFirstZeroBaseline: SRC.baseline.rateRelGapFirstZero,
  rateRelGap1e22Baseline: SRC.baseline.rateRelGap1e22,
  maxDev1e22: SRC.maxRelGapDeviation.at1e22,
  maxDevFirst: SRC.maxRelGapDeviation.atFirstZero,
  maxScaleLawDev: SRC.maxScaleLawDeviation,
  cKhBaseline: SRC.C_KH_baseline,
  sweepFactors: SRC.sweepFactors,
});

export const IMP96455_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every C_KH, '
  + 'factorVsBaseline, rateRelGap and eCollA1e22 value plotted here is copied verbatim from '
  + 'the imp-96429 baked sweep table; the only new arithmetic is the log10 axis reshaping, a '
  + 'double-precision floor clip (~1e-16) so the exact-zero 1e22 gap is plottable on a log '
  + 'axis, and the eCollA1e22-to-baseline ratio. This is a measurement/accuracy audit of a '
  + 'normalization constant, not a new bound: the conditional C_H <= 0.127 stays UNPROVEN, '
  + 'C_H isRigorousUpperBound = false (imp-2642/imp-2701), the imp-2640 Gronwall discharge of '
  + 'C_Lip stays NEGATIVE. Changes no bound, establishes no operator positivity.';

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP96455_VALIDATION = Object.freeze({
  eightPointsPresent: IMP96455_SWEEP_POINTS.length === 8,
  gap1e22FlatAtFloor: IMP96455_SWEEP_POINTS.every((p) => p.rateRelGap1e22Abs <= 1e-14),
  gapFirstZeroFlat: IMP96455_SWEEP_POINTS.every(
    (p) => Math.abs(p.rateRelGapFirstZero - IMP96455_LANDMARKS.rateRelGapFirstZeroBaseline) < 1e-12,
  ),
  eCollRatioMatchesSqrtLaw: IMP96455_SWEEP_POINTS.every(
    (p) => Math.abs(log10(p.eCollRatio) - p.log10SqrtFactorRef) < 1e-9,
  ),
});
