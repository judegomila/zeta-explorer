/**
 * @module imp-35561-peak-height-map-sensitivity-viz-data
 * @fileoverview imp-35561 -- VIZ DATA ONLY for the imp-35536 sigma interior-PEAK height-map
 *   sensitivity table: re-running the imp-35337 peak locator (N_max ~ 9.2186e5, sigma_max ~
 *   0.94942901) under six height maps -- the exact Riemann-von Mangoldt inverse (BASE), the
 *   closed surrogate 2*pi*N/logN, and four multiplicative RvM perturbations (x1.02, x0.98,
 *   x1.05, x0.95) -- shows sigma_max stays inside [0.9417, 0.9507] (robust to ~0.8 percent)
 *   while N_max drifts by up to +0.16 decades under the full surrogate swap.
 *
 *   imp-35536 measured this six-row table but shipped no page, so the robust-height /
 *   moderately-drifting-location split is not visually legible anywhere on the site.
 *
 *   Re-exports the imp-35536 peakLadder table directly (that module is import-light: pure
 *   Math, no heavy dependency, never the 16.7MB zeros bundle), per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35536-peak-height-map-sensitivity.js (the six-row table this re-exports)
 *   @see imp-35337-sigma-peak-crossover-dd-certification (the peak locator recomputed there)
 *   @see imp-35497-fartail-crossing-height-map-sensitivity.js (same method, far-tail crossing)
 *
 *   Ticket: imp-35561 (ux, medium). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. Discharges nothing; imp-35337a stays OPEN. C_C = (1/8) sqrt(3 pi)
 *   ansatz (imp-2642/imp-2643) UNTOUCHED. NO QED. No refereed bound is changed.
 */

import IMP35536_PEAK_HEIGHT_MAP_SENSITIVITY from './imp-35536-peak-height-map-sensitivity.js';

export const IMP35561_PEAK_LADDER = IMP35536_PEAK_HEIGHT_MAP_SENSITIVITY.peakLadder;

export const IMP35561_BASE = IMP35536_PEAK_HEIGHT_MAP_SENSITIVITY.base;

export const IMP35561_SUMMARY = Object.freeze({
  rowCount: IMP35561_PEAK_LADDER.length,
  sigmaMaxSpread: IMP35536_PEAK_HEIGHT_MAP_SENSITIVITY.sigmaMaxSpread,
  maxDLog10N: Math.max(...IMP35561_PEAK_LADDER.map((r) => Math.abs(r.dLog10N))),
  sigmaMaxLo: Math.min(...IMP35561_PEAK_LADDER.map((r) => r.sigmaMax)),
  sigmaMaxHi: Math.max(...IMP35561_PEAK_LADDER.map((r) => r.sigmaMax)),
});

export default Object.freeze({
  id: 'imp-35561-peak-height-map-sensitivity-viz-data',
  ticket: 'imp-35561',
  sources: ['imp-35536-peak-height-map-sensitivity.js'],
  rows: IMP35561_PEAK_LADDER,
  base: IMP35561_BASE,
  summary: IMP35561_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35561_ASSERTIONS = [
  {
    id: 'imp35561-six-rows-present',
    holds: () => IMP35561_PEAK_LADDER.length === 6,
    why: 'The table must cover all six imp-35536 height maps (BASE + surrogate + four perturbations).',
  },
  {
    id: 'imp35561-sigma-max-robust-under-1pct',
    holds: () => IMP35561_SUMMARY.sigmaMaxSpread < 1e-2 && IMP35561_SUMMARY.sigmaMaxSpread > 0,
    why: 'sigma_max spread across all six height maps must stay under 1 percent, matching the imp-35536 robustness finding.',
  },
  {
    id: 'imp35561-sigma-max-band-matches-imp35536',
    holds: () =>
      Math.abs(IMP35561_SUMMARY.sigmaMaxLo - 0.9417) < 2e-3 &&
      Math.abs(IMP35561_SUMMARY.sigmaMaxHi - 0.9507) < 2e-3,
    why: 'The sigma_max band across all maps must reproduce the imp-35536 reported [0.9417, 0.9507] range.',
  },
  {
    id: 'imp35561-nmax-shift-moderate-not-decades',
    holds: () => IMP35561_SUMMARY.maxDLog10N > 0.1 && IMP35561_SUMMARY.maxDLog10N < 0.25,
    why: 'The largest N_max shift (full surrogate swap) must be a moderate ~+0.16 decades, not the multi-decade drift imp-35497 found for the far-tail crossing.',
  },
  {
    id: 'imp35561-base-reproduces-imp35337-Nmax',
    holds: () => Math.abs(IMP35561_BASE.Nmax - 9.2186e5) / 9.2186e5 < 1e-3,
    why: 'The BASE row must reproduce the imp-35337 peak location N_max ~ 9.2186e5.',
  },
];

for (const assertion of IMP35561_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35561-peak-height-map-sensitivity-viz-data assertion failed: ${assertion.id}`);
  }
}
