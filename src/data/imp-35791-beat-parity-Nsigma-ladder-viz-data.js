/**
 * @module imp-35791-beat-parity-Nsigma-ladder-viz-data
 *
 * imp-35791 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-35723 sigma(N) BEAT-TO-PARITY HANDOFF LADDER on the N-axis. imp-35723
 * located three landmark rungs on the imp-3406 sigma(N) ladder: the interior
 * beat-regime peak (N_peak ~ 9.219e5, sigma ~ 0.9494), the imp-35750
 * mathematical handoff midpoint mapped onto N (N_cross ~ 3.267e9, sigma =
 * 0.5), and the deep parity-regime onset (N ~ 3.213e11, sigma = 0.1). This
 * module bakes those three rungs as a small N-ordered ladder for direct
 * charting, with no re-derivation and no heavy import.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the recorded imp-35723 literals;
 * changes no bound; C_mb GUE-conditional (imp-486) untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35723-beat-parity-regime-boundary-Nsigma-locator.js (source: the three N-sigma rungs baked here)
 * @see imp-35750-beat-parity-handoff-sigma-viz-data.js (sigma-axis sibling; this module is the N-axis view)
 * @see imp-3406-sigma-highN-extrapolation.js (the underlying sigma(N) ladder)
 *
 * Ticket: imp-35791 (ux, low). Presentation only, RH-free; changes no bound; NO QED.
 */

export const IMP35791_NSIGMA_LADDER = [
  {
    label: 'beatRegimeMax',
    N: 9.219e5,
    log10_N: 5.9647,
    sigma: 0.949429,
    note: 'Interior sigma peak: GUE-conditional beat carrier E_coll dominates the barrier floor ~47.5x.',
  },
  {
    label: 'handoffMidpoint',
    N: 3.267e9,
    log10_N: 9.5142,
    sigma: 0.5,
    note: 'imp-35750 mathematical crossover mapped onto N: beat carrier E_coll equals barrier floor E_trunc.',
  },
  {
    label: 'parityRegimeOnset',
    N: 3.213e11,
    log10_N: 11.507,
    sigma: 0.1,
    note: 'Beat carrier fallen to a tenth of the bound; sigma -> 0 beyond (deep Reading-2 asymptotic parity).',
  },
];

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35791_ASSERTIONS = [
  {
    id: 'imp35791-ladder-N-strictly-increasing',
    description: 'The three rungs are ordered by strictly increasing N',
    holds: () =>
      IMP35791_NSIGMA_LADDER.every(
        (r, i) => i === 0 || r.N > IMP35791_NSIGMA_LADDER[i - 1].N,
      ),
  },
  {
    id: 'imp35791-ladder-sigma-strictly-decreasing',
    description: 'sigma descends monotonically down the ladder as N grows (beat degrades toward parity)',
    holds: () =>
      IMP35791_NSIGMA_LADDER.every(
        (r, i) => i === 0 || r.sigma < IMP35791_NSIGMA_LADDER[i - 1].sigma,
      ),
  },
  {
    id: 'imp35791-landmark-values-match-imp35723',
    description: 'The three baked rungs reproduce the imp-35723 recorded landmark (N, sigma) pairs',
    holds: () => {
      const [peak, cross, onset] = IMP35791_NSIGMA_LADDER;
      return (
        Math.abs(peak.N - 9.219e5) / 9.219e5 < 1e-3 &&
        Math.abs(peak.sigma - 0.949429) < 5e-4 &&
        Math.abs(cross.N - 3.267e9) / 3.267e9 < 1e-3 &&
        cross.sigma === 0.5 &&
        Math.abs(onset.N - 3.213e11) / 3.213e11 < 1e-3 &&
        Math.abs(onset.sigma - 0.1) < 1e-6
      );
    },
  },
];

for (const a of IMP35791_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35791-beat-parity-Nsigma-ladder-viz-data assertion failed: ${a.id}`);
  }
}
