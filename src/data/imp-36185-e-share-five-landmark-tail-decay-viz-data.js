/**
 * @module imp-36185-e-share-five-landmark-tail-decay-viz-data
 *
 * imp-36185 (ux): lightweight, import-light viz-data module baking the imp-36111
 * five-landmark E(N) = E_trunc + E_flow + E_coll fractional-SHARE tail-decay sequence
 * as plain literals, so an analysis tab can render the three-term share stacked-area
 * / decay chart WITHOUT importing the imp-36111 cross-reference chain (which pulls in
 * four source modules) or the 16.7MB zeros bundle. The five landmarks, in increasing-N
 * order, sample a single monotonically decaying shareColl arm past the roadmap sigma(N)
 * U-shape peak (N ~9.22e5): Kneedle-elbow (N ~2.13e8, shareColl ~0.783, E_coll-dominated),
 * E_flow-1pct-crossing (N ~4.623e8, shareColl ~0.716, still E_coll-dominated),
 * Flattest-point (N ~7.20e9, shareColl ~0.407, now E_trunc-dominated), Sigma-0.1-landmark
 * (N ~3.21e11, shareColl ~0.100), and Sole-survivor (N* ~4.7214e13, shareColl ~0.0099,
 * E_trunc essentially alone).
 * Follows the imp-35791 / imp-35977 / imp-36046 import-light pattern: baked literals
 * only, no re-derivation, no heavy import, no re-import of the imp-36111 crossref module.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the recorded imp-36111 combined-sequence
 * literals verbatim; changes no bound; C_C GUE-conditional (imp-2642/imp-2643/imp-486)
 * untouched; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36111-e-share-tail-storyline-crossref.js (source: the merged five-landmark sequence baked here)
 * @see imp-35977-e-share-stacked-bar-viz-data.js (source of the first two landmarks)
 * @see imp-36046-e-share-tail-landmarks-viz-data.js (source of the last three landmarks)
 * @see imp-35791-beat-parity-Nsigma-ladder-viz-data.js (the import-light pattern this module follows)
 *
 * Ticket: imp-36185 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

export const IMP36185_E_SHARE_FIVE_LANDMARK_TAIL_DECAY = [
  {
    label: 'Kneedle-elbow',
    N: 2.13e8,
    log10_N: 8.3284,
    logT0: 18.28,
    shareTrunc: 0.213,
    shareFlow: 0.0041,
    shareColl: 0.783,
    dominant: 'E_coll',
  },
  {
    label: 'E_flow-1pct-crossing',
    N: 4.623e8,
    log10_N: 8.6649,
    logT0: 19.0065,
    shareTrunc: 0.281467,
    shareFlow: 2.8147e-3,
    shareColl: 0.715718,
    dominant: 'E_coll',
  },
  {
    label: 'Flattest-point',
    N: 7.2e9,
    log10_N: 9.8573,
    logT0: 21.6,
    shareTrunc: 0.592,
    shareFlow: 0.00057,
    shareColl: 0.407,
    dominant: 'E_trunc',
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
  },
];

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP36185_ASSERTIONS = [
  {
    id: 'imp36185-five-landmarks-ordered-by-N',
    description: 'The five landmarks sit in strictly increasing N order (peak-to-tail arc)',
    holds: () =>
      IMP36185_E_SHARE_FIVE_LANDMARK_TAIL_DECAY.length === 5 &&
      IMP36185_E_SHARE_FIVE_LANDMARK_TAIL_DECAY.every(
        (b, i, arr) => i === 0 || b.N > arr[i - 1].N,
      ),
  },
  {
    id: 'imp36185-shares-sum-to-one',
    description: 'shareTrunc + shareFlow + shareColl sums to ~1 at each landmark',
    holds: () =>
      IMP36185_E_SHARE_FIVE_LANDMARK_TAIL_DECAY.every(
        (b) => Math.abs(b.shareTrunc + b.shareFlow + b.shareColl - 1) < 1e-3,
      ),
  },
  {
    id: 'imp36185-sharecoll-monotonically-decays',
    description: 'shareColl decays monotonically across all five landmarks (the single decaying arm)',
    holds: () =>
      IMP36185_E_SHARE_FIVE_LANDMARK_TAIL_DECAY.every(
        (b, i, arr) => i === 0 || b.shareColl < arr[i - 1].shareColl,
      ),
  },
  {
    id: 'imp36185-dominant-term-flips-exactly-once',
    description: 'The dominant term flips from E_coll to E_trunc exactly once across the arc',
    holds: () => {
      const dominants = IMP36185_E_SHARE_FIVE_LANDMARK_TAIL_DECAY.map((b) => b.dominant);
      const flips = dominants.filter((d, i) => i > 0 && d !== dominants[i - 1]).length;
      return flips === 1 && dominants[0] === 'E_coll' && dominants[dominants.length - 1] === 'E_trunc';
    },
  },
  {
    id: 'imp36185-sole-survivor-matches-imp36046',
    description: 'The final landmark reproduces the recorded imp-36046 sole-survivor shares verbatim',
    holds: () => {
      const b = IMP36185_E_SHARE_FIVE_LANDMARK_TAIL_DECAY[4];
      return (
        Math.abs(b.shareTrunc - 0.990099) < 1e-4 &&
        Math.abs(b.shareColl - 9.901e-3) < 1e-4 &&
        b.dominant === 'E_trunc' &&
        b.label === 'Sole-survivor'
      );
    },
  },
];

for (const a of IMP36185_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36185-e-share-five-landmark-tail-decay-viz-data assertion failed: ${a.id}`);
  }
}
