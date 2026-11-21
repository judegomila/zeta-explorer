/**
 * @module imp-36138-sharecoll-subpercent-threshold-crossings-viz-data
 *
 * imp-36138 (numerical, measurement): CONTINUE the imp-36097 bisection to LOCATE the
 * finer shareColl SUB-1% threshold crossings of the imp-35889 three-way split
 * E(N) = E_trunc + E_flow + E_coll. imp-36097 located four crossings but stopped the
 * E_coll ladder at the shareColl < 1% (= 1e-2) crossing (N ~4.624e13); it never located
 * WHERE shareColl first drops below 1e-3 (0.1%) or 1e-4 (0.01%). This module fills those
 * two missing crossing heights by bisecting log N on the EXACT same imp-3406 / imp-33582 /
 * imp-2642 sub-terms imp-36097 / imp-36046 / imp-35950 use -- no fresh model.
 *
 * SETUP (identical sub-terms to imp-36097 / imp-35950; no fresh model). In this surrogate
 * sigma(N) = E_coll / E(N) = shareColl exactly, so each shareColl threshold crossing is the
 * unique post-peak root of sigma(N) = thr, located by the identical downslope bisection.
 *   E_trunc = 3.06e-5 (imp-2631, N-independent fixed-strip route),
 *   E_flow  = C_F (log T0 / T0) exp|t_c|  with C_F = (log(T0 / 2pi) + 1) / 2pi (imp-398),
 *   E_coll  = C_C sqrt(log T0 / N)        with C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643, GUE-conditional).
 * shareColl is monotonically decreasing on this far-tail stretch, so each crossing is unique.
 *
 * WHAT THE MEASUREMENT SHOWS (the honest finding). The three E_coll crossings are (the 1e-2
 * rung reproduces imp-36097 bit-for-bit as a same-model anchor; the 1e-3 / 1e-4 rungs are new):
 *   - shareColl < 1e-2 first at N ~4.624381e13 (log10 N ~13.6651, log T0 ~30.001): the
 *     imp-36097 anchor, shareTrunc ~0.990, shareFlow ~4.21e-7 (at the sole-survivor height).
 *   - shareColl < 1e-3 first at N ~5.432330e15 (log10 N ~15.735,  log T0 ~34.6104):
 *     shareTrunc ~0.999, shareFlow ~5.65e-9  -- E_trunc now carries 99.9% of the mass.
 *   - shareColl < 1e-4 first at N ~6.164882e17 (log10 N ~17.7899, log T0 ~39.207):
 *     shareTrunc ~0.9999, shareFlow ~7.35e-11 -- E_trunc carries 99.99% of the mass.
 * The crossings are spaced ~2.06 decades of N apart per decade of shareColl (13.6651 ->
 * 15.735 -> 17.7899, gaps ~2.070 and ~2.055 in log10 N), just ABOVE the naive 2.0 decades
 * the pure shareColl ~ E_coll/E_trunc ~ N^{-1/2} law predicts. The ~0.06-decade excess comes
 * from the slow sqrt(log T0) growth in E_coll's numerator, which decays shareColl slightly
 * slower than N^{-1/2}, so each factor-of-10 tightening costs a little more than two decades.
 *
 * MEASUREMENT / PRESENTATION ONLY. Extends the imp-36097 E_coll ladder with the two missing
 * sub-1% crossing heights; reuses the pinned imp-3406 / imp-33582 constants and the imp-35889
 * sub-terms unchanged; derives no remainder; discharges nothing; changes no bound; C_C
 * GUE-conditional (imp-2642 / imp-2643 / imp-486) untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-36097-e-share-threshold-crossings-viz-data.js (the crossing ladder this extends; 1e-2 anchor)
 * @see imp-36046-e-share-tail-landmarks-viz-data.js (the tail landmarks imp-36097 extends)
 * @see imp-35950-etrunc-ecoll-crossover-height.js (same parts(N) sub-terms and downslope bisection)
 * @see imp-35971-etrunc-sole-survivor-height.js (sole-survivor height where the 1e-2 crossing lands)
 * @see imp-35889-e-share-decomposition-at-knees.js (the three-way split this ladder traces)
 *
 * Ticket: imp-36138 (numerical, medium). Measurement only, RH-free; changes no bound; NO QED.
 */

import { IMP36097_E_SHARE_THRESHOLD_CROSSINGS } from './imp-36097-e-share-threshold-crossings-viz-data.js';

export const IMP36138_SHARECOLL_SUBPERCENT_CROSSINGS = [
  {
    label: 'shareColl<1e-2',
    quantity: 'E_coll',
    threshold: 1e-2,
    N: 4.624381e13,
    log10_N: 13.6651,
    logT0: 30.0010,
    shareTrunc: 0.990000,
    shareFlow: 4.2126e-7,
    shareColl: 1.0000e-2,
    isNew: false,
    note: 'imp-36097 anchor (reproduced bit-for-bit on the same model): shareColl first below 1%, at the imp-35971 sole-survivor height.',
  },
  {
    label: 'shareColl<1e-3',
    quantity: 'E_coll',
    threshold: 1e-3,
    N: 5.432330e15,
    log10_N: 15.7350,
    logT0: 34.6104,
    shareTrunc: 0.999000,
    shareFlow: 5.6549e-9,
    shareColl: 1.0000e-3,
    isNew: true,
    note: 'NEW: shareColl first below 0.1% -- E_trunc now carries 99.9% of the mass, E_flow negligible (~5.65e-9).',
  },
  {
    label: 'shareColl<1e-4',
    quantity: 'E_coll',
    threshold: 1e-4,
    N: 6.164882e17,
    log10_N: 17.7899,
    logT0: 39.2070,
    shareTrunc: 0.999900,
    shareFlow: 7.3474e-11,
    shareColl: 1.0000e-4,
    isNew: true,
    note: 'NEW: shareColl first below 0.01% -- E_trunc carries 99.99% of the mass; E_coll is the residual last survivor.',
  },
];

// Per-decade N-cost of tightening shareColl by a factor of 10 (log10-N gaps between rungs).
export const IMP36138_DECADE_SPACING = {
  gap_1e2_to_1e3: +(
    IMP36138_SHARECOLL_SUBPERCENT_CROSSINGS[1].log10_N -
    IMP36138_SHARECOLL_SUBPERCENT_CROSSINGS[0].log10_N
  ).toFixed(4), // ~2.0699
  gap_1e3_to_1e4: +(
    IMP36138_SHARECOLL_SUBPERCENT_CROSSINGS[2].log10_N -
    IMP36138_SHARECOLL_SUBPERCENT_CROSSINGS[1].log10_N
  ).toFixed(4), // ~2.0549
  naivePower: 2.0, // shareColl ~ E_coll/E_trunc ~ N^{-1/2} => 2 decades of N per decade of shareColl
  note:
    'Each 10x tightening of shareColl costs ~2.06 decades in N, just above the naive 2.0 the ' +
    'N^{-1/2} law predicts; the ~0.06-decade excess is the slow sqrt(log T0) growth in E_coll.',
};

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP36138_ASSERTIONS = [
  {
    id: 'imp36138-crossings-ordered-by-N',
    description: 'The three shareColl crossings are ordered by strictly increasing N (tighter threshold -> higher N)',
    holds: () =>
      IMP36138_SHARECOLL_SUBPERCENT_CROSSINGS.every(
        (c, i, arr) => i === 0 || c.N > arr[i - 1].N,
      ),
  },
  {
    id: 'imp36138-shares-sum-to-one',
    description: 'shareTrunc + shareFlow + shareColl sums to ~1 at each crossing',
    holds: () =>
      IMP36138_SHARECOLL_SUBPERCENT_CROSSINGS.every(
        (c) => Math.abs(c.shareTrunc + c.shareFlow + c.shareColl - 1) < 1e-4,
      ),
  },
  {
    id: 'imp36138-coll-crossings-hit-their-thresholds',
    description: 'At each E_coll crossing the recorded shareColl equals its threshold to tabulation precision',
    holds: () =>
      IMP36138_SHARECOLL_SUBPERCENT_CROSSINGS.every(
        (c) => Math.abs(c.shareColl / c.threshold - 1) < 1e-3,
      ),
  },
  {
    id: 'imp36138-1e2-anchor-reproduces-imp36097',
    description: 'The 1e-2 anchor reproduces the imp-36097 shareColl < 1% crossing (N and shares) on the same model',
    holds: () => {
      const anchor = IMP36138_SHARECOLL_SUBPERCENT_CROSSINGS[0];
      const src = IMP36097_E_SHARE_THRESHOLD_CROSSINGS.find((c) => c.label === 'shareColl<1pct');
      return (
        !!src &&
        Math.abs(anchor.N / src.N - 1) < 1e-6 &&
        Math.abs(anchor.log10_N - src.log10_N) < 1e-3 &&
        Math.abs(anchor.shareTrunc - src.shareTrunc) < 1e-4 &&
        Math.abs(anchor.shareColl - src.shareColl) < 1e-5
      );
    },
  },
  {
    id: 'imp36138-two-new-rungs-below-imp36097',
    description: 'The 1e-3 and 1e-4 rungs are new (isNew) and sit at N above the imp-36097 1e-2 crossing',
    holds: () => {
      const [, r3, r4] = IMP36138_SHARECOLL_SUBPERCENT_CROSSINGS;
      const anchorN = IMP36138_SHARECOLL_SUBPERCENT_CROSSINGS[0].N;
      return r3.isNew && r4.isNew && r3.N > anchorN && r4.N > r3.N;
    },
  },
  {
    id: 'imp36138-truncation-dominates-more-with-each-rung',
    description: 'shareTrunc rises toward 1 as shareColl tightens (0.990 -> 0.999 -> 0.9999)',
    holds: () => {
      const [a, b, c] = IMP36138_SHARECOLL_SUBPERCENT_CROSSINGS;
      return a.shareTrunc < b.shareTrunc && b.shareTrunc < c.shareTrunc && c.shareTrunc > 0.9998;
    },
  },
  {
    id: 'imp36138-spacing-slightly-above-two-decades',
    description: 'Each 10x tightening of shareColl costs ~2.06 decades in N, just above the naive 2.0 (N^{-1/2}) law',
    holds: () =>
      IMP36138_DECADE_SPACING.gap_1e2_to_1e3 > 2.0 &&
      IMP36138_DECADE_SPACING.gap_1e2_to_1e3 < 2.15 &&
      IMP36138_DECADE_SPACING.gap_1e3_to_1e4 > 2.0 &&
      IMP36138_DECADE_SPACING.gap_1e3_to_1e4 < 2.15,
  },
];

for (const a of IMP36138_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36138-sharecoll-subpercent-threshold-crossings-viz-data assertion failed: ${a.id}`);
  }
}
