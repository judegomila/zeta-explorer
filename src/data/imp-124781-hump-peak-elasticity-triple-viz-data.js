/**
 * @module imp-124781-hump-peak-elasticity-triple-viz-data
 *
 * imp-124781 (ux): import-light viz-data leaf charting the imp-97802 hump-peak elasticity TRIPLE
 * (location ~-1.79, diag-value ~-4.09, sigma-value ~-0.0534 per decade of E_trunc floor factor)
 * across the imp-33708 0.5x..5x floor swap. Reuses the frozen
 * IMP97802_FARTAIL_HUMP_PEAK_SIGMA_VALUE_ELASTICITY fields verbatim (no re-derivation, no new
 * computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97802-fartail-hump-peak-sigma-value-elasticity.js (source module)
 * @see imp-97782-fartail-diagnostic-hump-peak-pin.js (parent: pins the peak)
 */

import { IMP97802_FARTAIL_HUMP_PEAK_SIGMA_VALUE_ELASTICITY } from './imp-97802-fartail-hump-peak-sigma-value-elasticity.js';

const S = IMP97802_FARTAIL_HUMP_PEAK_SIGMA_VALUE_ELASTICITY;

// One row per swept E_trunc floor factor: where the pinned peak lands on all three axes.
export const IMP124781_LADDER_ROWS = Object.freeze(
  S.ladder.map((r) =>
    Object.freeze({
      factor: r.factor,
      log10N_peak: r.log10N_peak,
      diag_peak: r.diag_peak,
      sigma_peak: r.sigma_peak,
    })
  )
);

// The elasticity-triple bar comparison the ticket asks for: location, diag value, sigma value.
export const IMP124781_ELASTICITY_TRIPLE_BARS = Object.freeze([
  Object.freeze({ label: 'location (log10 N_peak)', perDecade: S.floorSwap.location_elasticity_per_decade }),
  Object.freeze({ label: 'diag value', perDecade: S.floorSwap.value_elasticity_per_decade }),
  Object.freeze({ label: 'sigma value', perDecade: S.floorSwap.sigma_elasticity_per_decade }),
]);

export const IMP124781_VALUE_OVER_SIGMA_RATIO = S.floorSwap.value_over_sigma_elasticity_ratio; // ~76.7
export const IMP124781_BASELINE_PEAK = S.peakBaseline;

export const IMP124781_SUMMARY = Object.freeze({
  law:
    `Across the imp-33708 0.5x..5x E_trunc floor swap the imp-97802 elasticity triple is `
    + `(location ${IMP124781_ELASTICITY_TRIPLE_BARS[0].perDecade}, diag value ${IMP124781_ELASTICITY_TRIPLE_BARS[1].perDecade}, `
    + `sigma value ${IMP124781_ELASTICITY_TRIPLE_BARS[2].perDecade}) per decade of floor factor: the diag-value `
    + `leg exceeds the sigma-value leg by ~${IMP124781_VALUE_OVER_SIGMA_RATIO}x because the peak also slides, `
    + 'changing log T0 at the peak in addition to sigma itself.',
  reading:
    IMP124781_LADDER_ROWS.map(
      (r) => `factor=${r.factor}: log10N=${r.log10N_peak}, diag=${r.diag_peak}, sigma=${r.sigma_peak}`
    ).join(', '),
  verdict:
    'Presentation only: every ladder row and elasticity bar is reused verbatim from imp-97802 (a '
    + 'measurement, not a derivation); no new computation. Conditional-share diagnostic on the inherited '
    + 'imp-3406/imp-97723 component model and the imp-33708 floor swap, NOT a rigorous asymptotic; C_mb '
    + 'stays GUE-conditional (imp-486); changes no bound; establishes no operator positivity; imp-3066 '
    + 'K_a >= 0 untouched; no refereed bound is changed; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124781_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124781-four-ladder-rows',
    description: 'exactly four floor-sweep rows (the imp-33708 {0.5, 1, 2, 5} ladder)',
    holds: () => IMP124781_LADDER_ROWS.length === 4,
  },
  {
    id: 'imp124781-baseline-row-present',
    description: 'the factor=1.0 row matches the pinned baseline peak',
    holds: () => {
      const base = IMP124781_LADDER_ROWS.find((r) => r.factor === 1.0);
      return base !== undefined && Math.abs(base.sigma_peak - IMP124781_BASELINE_PEAK.sigma) < 1e-3;
    },
  },
  {
    id: 'imp124781-triple-bars-match-source',
    description: 'the three elasticity bars match the imp-97802 floorSwap fields exactly',
    holds: () =>
      IMP124781_ELASTICITY_TRIPLE_BARS[0].perDecade === S.floorSwap.location_elasticity_per_decade &&
      IMP124781_ELASTICITY_TRIPLE_BARS[1].perDecade === S.floorSwap.value_elasticity_per_decade &&
      IMP124781_ELASTICITY_TRIPLE_BARS[2].perDecade === S.floorSwap.sigma_elasticity_per_decade,
  },
  {
    id: 'imp124781-diag-value-dwarfs-sigma-value',
    description: 'the diag-value elasticity exceeds the sigma-value elasticity in magnitude by more than 20x',
    holds: () => IMP124781_VALUE_OVER_SIGMA_RATIO !== null && IMP124781_VALUE_OVER_SIGMA_RATIO > 20,
  },
  {
    id: 'imp124781-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP124781_SUMMARY.verdict) && /NO QED/.test(IMP124781_SUMMARY.verdict),
  },
];

for (const assertion of IMP124781_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124781 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124781_SUMMARY;
