/**
 * @module imp-96940-sigma-crossing-ladder-viz-data
 *
 * imp-96940 (ux): import-light viz-data leaf for the imp-96916 sigma-crossing
 * landmark ladder -- reshapes the four-point interpolation ladder (sigma in
 * {0.75, 0.5, 0.25, 0.1}) into a chart-ready series with log10(N) x-axis and
 * elasticity-magnitude y-axis, showing the monotone approach toward the -2
 * inverse-square regime as E_flow / E_trunc collapses.
 *
 * imp-96916 exported the raw ladder + floor-sweep tables (interpolationLadder,
 * floorSweep) but shipped no chart-ready reshaping: this leaf imports those
 * literals verbatim (no transcription) and adds log10(N) coordinates, a
 * signed-vs-magnitude elasticity view, and a floor-sweep series for direct
 * chart consumption.
 *
 * PRESENTATION ONLY. Changes no bound; establishes no operator positivity;
 * C_mb stays GUE-conditional (imp-486); interval-rigorous certificate reach
 * stays 2a<=0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96916-sigma-quarter-crossing-etrunc-elasticity.js (source ladder + verdict)
 * @see imp-96939-tladder-plateau-leaf-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96940 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP96916_SIGMA_QUARTER_CROSSING_ETRUNC_ELASTICITY } from './imp-96916-sigma-quarter-crossing-etrunc-elasticity.js';

const SRC = IMP96916_SIGMA_QUARTER_CROSSING_ETRUNC_ELASTICITY;

// chart-ready ladder series: x = log10(N_cross), y = |elasticity| (rides toward 2)
export const IMP96940_LADDER_SERIES = Object.freeze(
  SRC.interpolationLadder.map((row) => ({
    sigma: row.sigma,
    label: `sigma=${row.sigma}`,
    nCross: row.N_cross,
    log10N: +Math.log10(row.N_cross).toFixed(4),
    elasticity: row.elasticity,
    elasticityMagnitude: +Math.abs(row.elasticity).toFixed(6),
    eflowOverEtrunc: row.eflow_over_etrunc,
    logT0: row.logT0,
  })),
);

// chart-ready floor-sweep series: x = floorFactor, y = log10(N_quarter)
export const IMP96940_FLOOR_SWEEP_SERIES = Object.freeze(
  SRC.floorSweep.map((row) => ({
    floorFactor: row.floorFactor,
    label: `${row.floorFactor}x`,
    eTrunc: row.E_trunc,
    nQuarter: row.N_quarter,
    log10N: +Math.log10(row.N_quarter).toFixed(4),
  })),
);

// reference line at |elasticity| = 2, the inverse-square regime the ladder approaches
export const IMP96940_ASYMPTOTE_MAGNITUDE = 2;

export const IMP96940_LANDMARK = Object.freeze({
  sigma: SRC.landmark.sigma,
  nQuarter: SRC.landmark.N_quarter,
  log10N: +Math.log10(SRC.landmark.N_quarter).toFixed(4),
  elasticity: SRC.landmark.elasticity_d_log_N_d_log_etrunc,
});

export const IMP96940_HONEST_BANNER =
  'Presentation only: the sigma-crossing ladder measures E_trunc elasticity of the GUE-conditional ' +
  'share sigma(N), a sensitivity reading, not an operator positivity proof. The elasticity magnitude ' +
  'rides monotonically toward the -2 inverse-square regime as the sigma level falls (0.75 -> 0.1), ' +
  'with a residual excess from the slowly-growing log T0 factor. C_mb stays GUE-conditional ' +
  '(imp-486); interval-rigorous certificate reach stays 2a<=0.96; no refereed bound is changed; ' +
  'RH open; NO QED.';

// plain validation object (no self-executing throw; imp-96294/imp-96819 convention -- a viz-data
// leaf must stay inert in the browser so a stale reading cannot blank a lazy-loaded page). Checked
// by scripts/run-assertions.mjs via the IMP96940_ASSERTIONS array below, not at import time.
export const IMP96940_VALIDATION = Object.freeze({
  fourRungsPresent: IMP96940_LADDER_SERIES.length === 4,
  magnitudeMonotoneTowardTwo: IMP96940_LADDER_SERIES.every(
    (row, i) => i === 0 || row.elasticityMagnitude < IMP96940_LADDER_SERIES[i - 1].elasticityMagnitude,
  ),
  allMagnitudesAboveAsymptote: IMP96940_LADDER_SERIES.every(
    (row) => row.elasticityMagnitude > IMP96940_ASYMPTOTE_MAGNITUDE,
  ),
  nCrossMonotoneIncreasing: IMP96940_LADDER_SERIES.every(
    (row, i) => i === 0 || row.log10N > IMP96940_LADDER_SERIES[i - 1].log10N,
  ),
  floorSweepMonotoneIncreasing: IMP96940_FLOOR_SWEEP_SERIES.every(
    (row, i) => i === 0 || row.log10N > IMP96940_FLOOR_SWEEP_SERIES[i - 1].log10N,
  ),
  landmarkMatchesSource:
    IMP96940_LANDMARK.sigma === 0.25 &&
    Math.abs(IMP96940_LANDMARK.nQuarter - SRC.landmark.N_quarter) < 1,
  matchesSourceVerdict: SRC.isRigorous === false && /NO QED/.test(SRC.verdict),
  honestBannerPresent:
    /RH open/.test(IMP96940_HONEST_BANNER) &&
    /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96940_HONEST_BANNER) &&
    /NO QED/.test(IMP96940_HONEST_BANNER),
});

// imp-96397: registers the IMP96940_VALIDATION checks with the build-time assertion sweep
// (scripts/run-assertions.mjs), which discovers any exported *_ASSERTIONS array without
// requiring an import-time throw.
export const IMP96940_ASSERTIONS = [
  {
    id: 'imp96940-four-rungs-present',
    description: 'all four ladder rungs (sigma 0.75/0.5/0.25/0.1) are reshaped into chart-ready points',
    holds: () => IMP96940_VALIDATION.fourRungsPresent,
  },
  {
    id: 'imp96940-magnitude-monotone-toward-two',
    description: 'the elasticity magnitude decreases monotonically toward 2 as sigma falls across the ladder',
    holds: () => IMP96940_VALIDATION.magnitudeMonotoneTowardTwo,
  },
  {
    id: 'imp96940-magnitudes-above-asymptote',
    description: 'every ladder rung magnitude stays strictly above the 2 asymptote it approaches',
    holds: () => IMP96940_VALIDATION.allMagnitudesAboveAsymptote,
  },
  {
    id: 'imp96940-ncross-monotone-increasing',
    description: 'N_cross increases monotonically (in log10) as sigma falls across the ladder',
    holds: () => IMP96940_VALIDATION.nCrossMonotoneIncreasing,
  },
  {
    id: 'imp96940-floor-sweep-monotone-increasing',
    description: 'the floor-sweep series increases monotonically in log10(N) as the floor factor tightens',
    holds: () => IMP96940_VALIDATION.floorSweepMonotoneIncreasing,
  },
  {
    id: 'imp96940-landmark-matches-source',
    description: 'the reshaped sigma=0.25 landmark reproduces the imp-96916 source N_quarter exactly',
    holds: () => IMP96940_VALIDATION.landmarkMatchesSource,
  },
  {
    id: 'imp96940-matches-source-verdict',
    description: 'the leaf agrees with the imp-96916 verdict (measurement only, no QED)',
    holds: () => IMP96940_VALIDATION.matchesSourceVerdict,
  },
  {
    id: 'imp96940-honest-banner-present',
    description: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers',
    holds: () => IMP96940_VALIDATION.honestBannerPresent,
  },
];
