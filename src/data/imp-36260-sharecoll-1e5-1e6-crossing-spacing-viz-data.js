/**
 * @module imp-36260-sharecoll-1e5-1e6-crossing-spacing-viz-data
 *
 * imp-36260 (numerical, measurement): EXTEND the imp-36138 shareColl sub-1% crossing
 * ladder two decades further -- to the 1e-5 and 1e-6 crossings -- and settle whether the
 * per-decade crossing spacing keeps DRIFTING above the naive 2.0 or CONVERGES back toward it.
 *
 * imp-36138 located the shareColl 1e-3 (N ~5.432e15) and 1e-4 (N ~6.165e17) crossings and
 * measured them spaced ~2.06 decades of N per decade of shareColl (log10 N gaps 2.0699 then
 * 2.0549), just ABOVE the naive 2.0 the pure shareColl ~ E_coll/E_trunc ~ N^{-1/2} law
 * predicts -- the ~0.06-decade excess coming from the slow sqrt(log T0) growth in E_coll's
 * numerator. But imp-36138 stopped at 1e-4 with only two gaps measured, so it could not tell
 * whether that excess keeps rising (as a still-growing sqrt(log T0) would suggest) or starts
 * to shrink back toward 2.0. This module continues the IDENTICAL log-N downslope bisection on
 * the same imp-3406 / imp-33582 / imp-2642 sub-terms to the 1e-5 and 1e-6 rungs -- no fresh
 * model -- and tabulates the two further inter-crossing spacings.
 *
 * SETUP (identical sub-terms to imp-36138 / imp-36097 / imp-35950; no fresh model). On this
 * surrogate sigma(N) = E_coll / E(N) = shareColl exactly, so each shareColl threshold crossing
 * is the unique post-peak root of sigma(N) = thr, located by the same downslope bisection.
 *   E_trunc = 3.06e-5 (imp-2631, N-independent fixed-strip route),
 *   E_flow  = C_F (log T0 / T0) exp|t_c|  with C_F = (log(T0 / 2pi) + 1) / 2pi (imp-398),
 *   E_coll  = C_C sqrt(log T0 / N)        with C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643, GUE-conditional).
 *
 * WHAT THE MEASUREMENT SHOWS (the honest finding). The 1e-2 / 1e-3 / 1e-4 rungs reproduce
 * imp-36138 bit-for-bit as same-model anchors; the 1e-5 / 1e-6 rungs are new:
 *   - shareColl < 1e-5 first at N ~6.888982e19 (log10 N ~19.8382, log T0 ~43.8042):
 *     shareTrunc ~0.99999, shareFlow ~9.27e-13 -- E_trunc carries 99.999% of the mass.
 *   - shareColl < 1e-6 first at N ~7.612335e21 (log10 N ~21.8815, log T0 ~48.4028):
 *     shareTrunc ~0.999999, shareFlow ~1.14e-14 -- E_trunc carries 99.9999% of the mass.
 * The four inter-crossing log10-N spacings are 2.0699, 2.0549, 2.0482, 2.0434. The answer to
 * imp-36138's open question: the per-decade spacing does NOT keep drifting up -- it CONVERGES
 * back DOWN toward the naive 2.0, monotonically. The excess above 2.0 shrinks at every rung
 * (0.0699 -> 0.0549 -> 0.0482 -> 0.0434), exactly as the sqrt(log T0) / log T0 saturation of
 * E_coll's numerator predicts: as log T0 grows the fractional growth of sqrt(log T0) per decade
 * of N slows, so shareColl decays ever closer to the pure N^{-1/2} law and each 10x tightening
 * costs ever closer to two decades. The excess never turns negative in this window and its
 * decrement itself slows (deltas 0.0150, 0.0067, 0.0048), so the approach to 2.0 is slow.
 *
 * MEASUREMENT / PRESENTATION ONLY. Extends the imp-36138 E_coll ladder with the two missing
 * deeper crossing heights; reuses the pinned imp-3406 / imp-33582 constants and the imp-35889
 * sub-terms unchanged; derives no remainder; discharges nothing; changes no bound; C_C
 * GUE-conditional (imp-2642 / imp-2643 / imp-486) untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-36138-sharecoll-subpercent-threshold-crossings-viz-data.js (the 1e-2..1e-4 ladder this extends)
 * @see imp-36097-e-share-threshold-crossings-viz-data.js (the crossing ladder imp-36138 extends; 1e-2 anchor)
 * @see imp-35950-etrunc-ecoll-crossover-height.js (same parts(N) sub-terms and downslope bisection)
 * @see imp-35889-e-share-decomposition-at-knees.js (the three-way split this ladder traces)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 *
 * Ticket: imp-36260 (numerical, medium). Measurement only, RH-free; changes no bound; NO QED.
 */

import { IMP36138_SHARECOLL_SUBPERCENT_CROSSINGS } from './imp-36138-sharecoll-subpercent-threshold-crossings-viz-data.js';

// Full ladder 1e-2 .. 1e-6 (the first three reproduce imp-36138 bit-for-bit; last two are new).
export const IMP36260_SHARECOLL_DEEP_CROSSINGS = [
  {
    label: 'shareColl<1e-2',
    threshold: 1e-2,
    N: 4.624381e13,
    log10_N: 13.6651,
    logT0: 30.0010,
    shareTrunc: 0.990000,
    shareFlow: 4.2126e-7,
    shareColl: 1.0000e-2,
    isNew: false,
    note: 'imp-36138 / imp-36097 anchor (reproduced bit-for-bit on the same model).',
  },
  {
    label: 'shareColl<1e-3',
    threshold: 1e-3,
    N: 5.432330e15,
    log10_N: 15.7350,
    logT0: 34.6104,
    shareTrunc: 0.999000,
    shareFlow: 5.6549e-9,
    shareColl: 1.0000e-3,
    isNew: false,
    note: 'imp-36138 anchor (reproduced bit-for-bit).',
  },
  {
    label: 'shareColl<1e-4',
    threshold: 1e-4,
    N: 6.164882e17,
    log10_N: 17.7899,
    logT0: 39.2070,
    shareTrunc: 0.999900,
    shareFlow: 7.3474e-11,
    shareColl: 1.0000e-4,
    isNew: false,
    note: 'imp-36138 anchor (reproduced bit-for-bit).',
  },
  {
    label: 'shareColl<1e-5',
    threshold: 1e-5,
    N: 6.888982e19,
    log10_N: 19.8382,
    logT0: 43.8042,
    shareTrunc: 0.999990,
    shareFlow: 9.2669e-13,
    shareColl: 1.0000e-5,
    isNew: true,
    note: 'NEW: shareColl first below 1e-5 -- E_trunc carries 99.999% of the mass; E_flow negligible (~9.27e-13).',
  },
  {
    label: 'shareColl<1e-6',
    threshold: 1e-6,
    N: 7.612335e21,
    log10_N: 21.8815,
    logT0: 48.4028,
    shareTrunc: 0.999999,
    shareFlow: 1.1410e-14,
    shareColl: 1.0000e-6,
    isNew: true,
    note: 'NEW: shareColl first below 1e-6 -- E_trunc carries 99.9999% of the mass; E_coll is the residual last survivor.',
  },
];

// Per-decade N-cost of tightening shareColl by 10x (full-precision log10-N gaps between
// consecutive rungs; baked from the exact bisection, NOT re-derived from the 4-decimal log10_N
// literals above, which would carry ~1e-4 rounding noise). The excess above the naive 2.0
// SHRINKS monotonically (0.0699 -> 0.0549 -> 0.0482 -> 0.0434): the spacing CONVERGES back
// toward 2.0, it does NOT keep drifting up.
const IMP36260_GAP_LITERALS = [2.0699, 2.0549, 2.0482, 2.0434];
export const IMP36260_DECADE_SPACINGS = IMP36260_SHARECOLL_DEEP_CROSSINGS.slice(1).map((c, i) => ({
  from: IMP36260_SHARECOLL_DEEP_CROSSINGS[i].label,
  to: c.label,
  gap: IMP36260_GAP_LITERALS[i], // decades of N per decade of shareColl
  excessAbove2: +(IMP36260_GAP_LITERALS[i] - 2.0).toFixed(4),
  isNew: c.isNew,
}));

export const IMP36260_SPACING_VERDICT = {
  naivePower: 2.0, // shareColl ~ E_coll/E_trunc ~ N^{-1/2} => 2 decades of N per decade of shareColl
  gaps: IMP36260_DECADE_SPACINGS.map((s) => s.gap), // [2.0699, 2.0549, 2.0482, 2.0434]
  excesses: IMP36260_DECADE_SPACINGS.map((s) => s.excessAbove2), // [0.0699, 0.0549, 0.0482, 0.0434]
  trend: 'converges-down-toward-2.0',
  note:
    'The per-decade crossing spacing does NOT keep drifting above the naive 2.0; the ~0.06-decade ' +
    'excess shrinks monotonically (0.0699 -> 0.0549 -> 0.0482 -> 0.0434) as the sqrt(log T0)/log T0 ' +
    'growth of E_coll saturates, so shareColl decays ever closer to the pure N^{-1/2} law. The ' +
    'approach is slow (decrement itself shrinks), and the excess stays strictly positive in-window.',
};

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP36260_ASSERTIONS = [
  {
    id: 'imp36260-crossings-ordered-by-N',
    description: 'All five shareColl crossings are ordered by strictly increasing N (tighter threshold -> higher N)',
    holds: () => IMP36260_SHARECOLL_DEEP_CROSSINGS.every((c, i, a) => i === 0 || c.N > a[i - 1].N),
  },
  {
    id: 'imp36260-shares-sum-to-one',
    description: 'shareTrunc + shareFlow + shareColl sums to ~1 at each crossing',
    holds: () =>
      IMP36260_SHARECOLL_DEEP_CROSSINGS.every(
        (c) => Math.abs(c.shareTrunc + c.shareFlow + c.shareColl - 1) < 1e-4,
      ),
  },
  {
    id: 'imp36260-coll-crossings-hit-their-thresholds',
    description: 'At each crossing the recorded shareColl equals its threshold to tabulation precision',
    holds: () =>
      IMP36260_SHARECOLL_DEEP_CROSSINGS.every((c) => Math.abs(c.shareColl / c.threshold - 1) < 1e-3),
  },
  {
    id: 'imp36260-reproduces-imp36138-anchors',
    description: 'The 1e-2..1e-4 rungs reproduce the imp-36138 ladder (N and shareTrunc) bit-for-bit',
    holds: () =>
      IMP36138_SHARECOLL_SUBPERCENT_CROSSINGS.every((src) => {
        const here = IMP36260_SHARECOLL_DEEP_CROSSINGS.find((c) => c.label === src.label);
        return (
          !!here &&
          Math.abs(here.N / src.N - 1) < 1e-9 &&
          Math.abs(here.log10_N - src.log10_N) < 1e-4 &&
          Math.abs(here.shareTrunc - src.shareTrunc) < 1e-9
        );
      }),
  },
  {
    id: 'imp36260-two-new-deep-rungs',
    description: 'The 1e-5 and 1e-6 rungs are new (isNew) and extend beyond the imp-36138 1e-4 crossing',
    holds: () => {
      const r5 = IMP36260_SHARECOLL_DEEP_CROSSINGS[3];
      const r6 = IMP36260_SHARECOLL_DEEP_CROSSINGS[4];
      const r4N = IMP36260_SHARECOLL_DEEP_CROSSINGS[2].N;
      return r5.isNew && r6.isNew && r5.N > r4N && r6.N > r5.N;
    },
  },
  {
    id: 'imp36260-truncation-approaches-one',
    description: 'shareTrunc rises toward 1 at every rung (0.990 -> ... -> 0.999999)',
    holds: () =>
      IMP36260_SHARECOLL_DEEP_CROSSINGS.every(
        (c, i, a) => i === 0 || c.shareTrunc > a[i - 1].shareTrunc,
      ) && IMP36260_SHARECOLL_DEEP_CROSSINGS[4].shareTrunc > 0.99999,
  },
  {
    id: 'imp36260-spacing-excess-shrinks-monotonically',
    description: 'The per-decade spacing excess above 2.0 shrinks monotonically (converges down toward 2.0, does NOT drift up)',
    holds: () => {
      const ex = IMP36260_SPACING_VERDICT.excesses;
      return (
        ex.length === 4 &&
        ex.every((e) => e > 0 && e < 0.1) &&
        ex[0] > ex[1] && ex[1] > ex[2] && ex[2] > ex[3]
      );
    },
  },
  {
    id: 'imp36260-all-gaps-just-above-two-decades',
    description: 'Every 10x tightening of shareColl costs between 2.0 and 2.15 decades in N',
    holds: () => IMP36260_DECADE_SPACINGS.every((s) => s.gap > 2.0 && s.gap < 2.15),
  },
];

for (const a of IMP36260_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36260-sharecoll-1e5-1e6-crossing-spacing-viz-data assertion failed: ${a.id}`);
  }
}
