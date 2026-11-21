/**
 * @module imp-35977-e-share-stacked-bar-viz-data
 *
 * imp-35977 (ux): lightweight, import-light viz-data module for a stacked/grouped
 * bar chart of the imp-35889 E(N) = E_trunc + E_flow + E_coll three-way FRACTIONAL
 * SHARE split at the two imp-35853 knees. Kneedle elbow (sigma ~ 0.783, N ~ 2.13e8)
 * is collision-dominated (shareColl ~ 0.783, shareTrunc ~ 0.213, shareFlow ~ 0.0041);
 * flattest point (sigma ~ 0.407, N ~ 7.20e9) is truncation-dominated (shareTrunc ~
 * 0.592, shareColl ~ 0.407, shareFlow ~ 0.00057). The dominant term FLIPS across the
 * sigma = 1/2 (imp-35337) balance crossover, which sits between the two knees.
 * Follows the imp-35791 import-light pattern: baked literals only, no re-derivation,
 * no heavy import.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the recorded imp-35889 literals;
 * changes no bound; C_mb GUE-conditional (imp-486) untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35889-e-share-decomposition-at-knees.js (source: both knees' three-way shares baked here)
 * @see imp-35853-req4-required-height-continuous-sigma-knee.js (the two knee locators)
 * @see imp-35337-sigma-crossover-landmarks.js (E_trunc = E_coll crossover at sigma = 0.5)
 * @see imp-35791-beat-parity-Nsigma-ladder-viz-data.js (the import-light pattern this module follows)
 *
 * Ticket: imp-35977 (ux, low). Presentation only, RH-free; changes no bound; NO QED.
 */

export const IMP35977_E_SHARE_BARS = [
  {
    label: 'Kneedle-elbow',
    N: 2.13e8,
    log10_N: 8.3284,
    logT0: 18.28,
    shareTrunc: 0.213,
    shareFlow: 0.0041,
    shareColl: 0.783,
    dominant: 'E_coll',
    truncOverColl: 0.272,
    note: 'Collision-dominated: E_coll share ~0.783 (= sigma), E_trunc runner-up ~0.213, E_flow negligible.',
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
    truncOverColl: 1.456,
    note: 'Truncation-dominated: E_trunc share ~0.592, E_coll runner-up ~0.407 (= sigma), E_flow smaller still.',
  },
];

export const IMP35977_BALANCE_CROSSOVER_SIGMA = 0.5; // imp-35337 E_trunc = E_coll crossover, between the two knees

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35977_ASSERTIONS = [
  {
    id: 'imp35977-bars-ordered-by-N',
    description: 'The two bars are ordered by strictly increasing N (elbow before flattest point)',
    holds: () => IMP35977_E_SHARE_BARS[1].N > IMP35977_E_SHARE_BARS[0].N,
  },
  {
    id: 'imp35977-shares-sum-to-one',
    description: 'shareTrunc + shareFlow + shareColl sums to ~1 at each knee',
    holds: () =>
      IMP35977_E_SHARE_BARS.every(
        (b) => Math.abs(b.shareTrunc + b.shareFlow + b.shareColl - 1) < 1e-3,
      ),
  },
  {
    id: 'imp35977-elbow-matches-imp35889',
    description: 'The Kneedle-elbow bar reproduces the recorded imp-35889 shares (shareColl ~0.783, shareTrunc ~0.213)',
    holds: () => {
      const b = IMP35977_E_SHARE_BARS[0];
      return (
        Math.abs(b.shareColl - 0.783) < 5e-3 &&
        Math.abs(b.shareTrunc - 0.213) < 5e-3 &&
        b.shareFlow < 0.01 &&
        b.dominant === 'E_coll'
      );
    },
  },
  {
    id: 'imp35977-flattest-point-matches-imp35889',
    description: 'The Flattest-point bar reproduces the recorded imp-35889 shares (shareTrunc ~0.592, shareColl ~0.407)',
    holds: () => {
      const b = IMP35977_E_SHARE_BARS[1];
      return (
        Math.abs(b.shareTrunc - 0.592) < 5e-3 &&
        Math.abs(b.shareColl - 0.407) < 5e-3 &&
        b.shareFlow < 0.01 &&
        b.dominant === 'E_trunc'
      );
    },
  },
  {
    id: 'imp35977-dominant-term-flips-across-crossover',
    description: 'Dominant term flips E_coll -> E_trunc, straddling the sigma = 0.5 balance crossover',
    holds: () => {
      const [elbow, flat] = IMP35977_E_SHARE_BARS;
      return (
        elbow.dominant !== flat.dominant &&
        elbow.truncOverColl < 1 &&
        flat.truncOverColl > 1 &&
        IMP35977_BALANCE_CROSSOVER_SIGMA === 0.5
      );
    },
  },
];

for (const a of IMP35977_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35977-e-share-stacked-bar-viz-data assertion failed: ${a.id}`);
  }
}
