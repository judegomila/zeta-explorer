/**
 * @module imp-34498-en-monotone-descent-viz-data
 * @fileoverview viz-data companion to imp-34434. imp-34434 found the bridge TOTAL
 *   E(N) = E_trunc + E_flow + E_coll is MONOTONE DECREASING with NO interior minimum,
 *   sliding from the LADDER endpoints toward the constant E_trunc = 3.06e-5 floor, and
 *   located the sigma-share peak (N ~ 9.22e5, E(N) ~ 1.53e-3, still ~50x above the floor)
 *   plus the 10%/1% floor-proximity landmarks (N ~ 4.0e11, N ~ 4.7e13) -- but had no
 *   accompanying visualization. This module reshapes the imp-34434 exports VERBATIM (no
 *   recomputation) into a log-log descent curve with the three landmarks annotated.
 *
 *   Import-light: reuses only the imp-34434 IMP34434_EN_BRIDGE_TOTAL_MINIMUM export (no
 *   16.7MB zeros bundle), per [[no_heavy_imports_in_pages]].
 *
 *   NO QED. Viz-data reshaping only; the imp-34434 measurement is UNCHANGED; C_mb
 *   GUE-conditional per imp-486 UNTOUCHED; changes no bound; no refereed bound is changed.
 *
 *   @see imp-34434-en-bridge-total-minimum-locate.js (source of the ladder and landmarks)
 */

import { IMP34434_EN_BRIDGE_TOTAL_MINIMUM } from './imp-34434-en-bridge-total-minimum-locate.js';

const M = IMP34434_EN_BRIDGE_TOTAL_MINIMUM;

export const IMP34498_LADDER = M.ladder;
export const IMP34498_E_TRUNC_FLOOR = M.slackComparison.inf_E_N;
export const IMP34498_SIGMA_PEAK_N = 9.22e5;
export const IMP34498_E_N_AT_SIGMA_PEAK = M.minimumLocation.E_N_at_sigma_peak;
export const IMP34498_N_WITHIN_10PCT = M.floorApproach.N_within_10pct_of_floor;
export const IMP34498_N_WITHIN_1PCT = M.floorApproach.N_within_1pct_of_floor;

export const IMP34498_EN_MONOTONE_DESCENT_VIZ_DATA = {
  id: 'imp-34498',
  ladder: IMP34498_LADDER,
  floor: IMP34498_E_TRUNC_FLOOR,
  sigmaPeak: { N: IMP34498_SIGMA_PEAK_N, E_N: IMP34498_E_N_AT_SIGMA_PEAK },
  landmark10pct: { N: IMP34498_N_WITHIN_10PCT },
  landmark1pct: { N: IMP34498_N_WITHIN_1PCT },
  isRigorous: false,
};

export const IMP34498_ASSERTIONS = [
  {
    id: 'imp-34498-ladder-reproduces-imp34434-verbatim',
    description: 'the ladder array reproduces the imp-34434 export exactly (===)',
    holds: () => IMP34498_LADDER === M.ladder,
  },
  {
    id: 'imp-34498-ladder-is-monotone-decreasing-en',
    description: 'E_N strictly decreases across the ladder rows (no interior minimum)',
    holds: () =>
      IMP34498_LADDER.every((row, i) => i === 0 || row.E_N < IMP34498_LADDER[i - 1].E_N),
  },
  {
    id: 'imp-34498-sigma-peak-still-far-above-floor',
    description: 'at the sigma peak N ~ 9.22e5, E(N) reproduces the imp-34434 ~50x-above-floor finding',
    holds: () =>
      Math.abs(IMP34498_E_N_AT_SIGMA_PEAK - 1.531e-3) < 5e-5 &&
      IMP34498_E_N_AT_SIGMA_PEAK > 30 * IMP34498_E_TRUNC_FLOOR,
  },
  {
    id: 'imp-34498-floor-landmarks-ordered-and-scaled',
    description: '10% landmark N ~ 4.0e11 precedes the 1% landmark N ~ 4.7e13',
    holds: () =>
      IMP34498_N_WITHIN_10PCT > 1e11 &&
      IMP34498_N_WITHIN_10PCT < 1e12 &&
      IMP34498_N_WITHIN_1PCT > 1e13 &&
      IMP34498_N_WITHIN_1PCT < 1e14 &&
      IMP34498_N_WITHIN_10PCT < IMP34498_N_WITHIN_1PCT,
  },
];

for (const a of IMP34498_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34498-en-monotone-descent-viz-data assertion failed: ${a.id}`);
  }
}
