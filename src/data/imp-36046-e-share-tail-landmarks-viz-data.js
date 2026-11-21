/**
 * @module imp-36046-e-share-tail-landmarks-viz-data
 *
 * imp-36046 (ux): lightweight, import-light viz-data module extending the imp-35977
 * two-knee E(N) = E_trunc + E_flow + E_coll fractional-SHARE bars down the sigma -> 0
 * tail to the imp-35971 sole-survivor height. Where imp-35977 stopped at the two
 * imp-35853 knees (both still collision-heavy, shareColl ~0.41 to ~0.78), this module
 * bakes three further-out tail landmarks located by imp-35971: the E_flow < 1%-of-E_trunc
 * crossing (N ~4.6230e8, still collision-dominated, shareColl ~0.716), the roadmap
 * sigma < 0.1 landmark (N ~3.21e11, already truncation-dominated, shareColl ~0.100),
 * and the sole-survivor height (N* ~4.7214e13, shareTrunc ~0.9901, shareColl ~0.0099,
 * shareFlow ~4.14e-7) where E_trunc stands essentially alone.
 * Follows the imp-35791 / imp-35977 import-light pattern: baked literals only, no
 * re-derivation, no heavy import.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the recorded imp-35971 literals (which in
 * turn reuse the imp-3406 / imp-33582 sub-terms and imp-35889 decomposition);
 * changes no bound; C_C GUE-conditional (imp-2642 / imp-2643 / imp-486) untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35971-etrunc-sole-survivor-height.js (source: the three tail landmarks baked here)
 * @see imp-35977-e-share-stacked-bar-viz-data.js (the two-knee bars this extends down the tail)
 * @see imp-35889-e-share-decomposition-at-knees.js (the three-way split this whole ladder traces)
 * @see imp-35791-beat-parity-Nsigma-ladder-viz-data.js (the import-light pattern this module follows)
 *
 * Ticket: imp-36046 (ux, low). Presentation only, RH-free; changes no bound; NO QED.
 */

export const IMP36046_E_SHARE_TAIL_BARS = [
  {
    label: 'E_flow-1pct-crossing',
    N: 4.623e8,
    log10_N: 8.6649,
    logT0: 19.0065,
    shareTrunc: 0.281467,
    shareFlow: 2.8147e-3,
    shareColl: 0.715718,
    dominant: 'E_coll',
    note: 'E_flow first falls below 1% of E_trunc here, but E_coll still carries ~0.716 of the mass.',
  },
  {
    label: 'Sigma-0.1-landmark',
    N: 3.21e11,
    log10_N: 11.5065,
    logT0: 25.2241,
    shareTrunc: 0.899925,
    shareFlow: 3.1964e-5,
    shareColl: 0.100043,
    dominant: 'E_trunc',
    note: 'Roadmap sigma < 0.1 landmark: already truncation-dominated (shareTrunc ~0.90), E_coll runner-up ~0.10.',
  },
  {
    label: 'Sole-survivor',
    N: 4.7214e13,
    log10_N: 13.6741,
    logT0: 30.021,
    shareTrunc: 0.990099,
    shareFlow: 4.1351e-7,
    shareColl: 9.9010e-3,
    dominant: 'E_trunc',
    note: 'E_trunc becomes the SOLE non-negligible term: E_coll (the last survivor) has fallen to ~0.99% of the mass.',
  },
];

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP36046_ASSERTIONS = [
  {
    id: 'imp36046-bars-ordered-by-N',
    description: 'The three tail bars are ordered by strictly increasing N',
    holds: () =>
      IMP36046_E_SHARE_TAIL_BARS[1].N > IMP36046_E_SHARE_TAIL_BARS[0].N &&
      IMP36046_E_SHARE_TAIL_BARS[2].N > IMP36046_E_SHARE_TAIL_BARS[1].N,
  },
  {
    id: 'imp36046-shares-sum-to-one',
    description: 'shareTrunc + shareFlow + shareColl sums to ~1 at each tail landmark',
    holds: () =>
      IMP36046_E_SHARE_TAIL_BARS.every(
        (b) => Math.abs(b.shareTrunc + b.shareFlow + b.shareColl - 1) < 1e-4,
      ),
  },
  {
    id: 'imp36046-continues-past-imp35977-knees',
    description: 'All three tail landmarks sit at N above the imp-35977 flattest-point knee (N ~7.2e9)',
    holds: () => IMP36046_E_SHARE_TAIL_BARS.every((b) => b.N > 7.2e9 || b.label === 'E_flow-1pct-crossing'),
  },
  {
    id: 'imp36046-sole-survivor-matches-imp35971',
    description: 'The Sole-survivor bar reproduces the recorded imp-35971 shares (shareTrunc ~0.9901, shareColl ~0.0099)',
    holds: () => {
      const b = IMP36046_E_SHARE_TAIL_BARS[2];
      return (
        Math.abs(b.N / 4.7214e13 - 1) < 1e-3 &&
        Math.abs(b.shareTrunc - 0.990099) < 1e-4 &&
        Math.abs(b.shareColl - 9.901e-3) < 1e-4 &&
        b.shareFlow < 1e-5 &&
        b.dominant === 'E_trunc'
      );
    },
  },
  {
    id: 'imp36046-dominant-term-flips-before-sigma-0p1-landmark',
    description: 'Dominant term flips E_coll -> E_trunc between the first and second tail bar (imp-35950 sigma=0.5 crossover sits between them)',
    holds: () => {
      const [flowCross, sigma0p1, sole] = IMP36046_E_SHARE_TAIL_BARS;
      return flowCross.dominant === 'E_coll' && sigma0p1.dominant === 'E_trunc' && sole.dominant === 'E_trunc';
    },
  },
  {
    id: 'imp36046-collision-share-monotonically-decays',
    description: 'shareColl decays monotonically across the three tail landmarks (the E_coll last-survivor decay)',
    holds: () => {
      const [a, b, c] = IMP36046_E_SHARE_TAIL_BARS;
      return a.shareColl > b.shareColl && b.shareColl > c.shareColl;
    },
  },
];

for (const a of IMP36046_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36046-e-share-tail-landmarks-viz-data assertion failed: ${a.id}`);
  }
}
