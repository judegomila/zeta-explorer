/**
 * @module imp-96960-etrunc-cc-elasticity-ladder-viz-data
 *
 * imp-96960 (ux): import-light viz-data leaf for the two-constant EQUAL-AND-OPPOSITE
 * (E_trunc vs C_C) elasticity ladder of the GUE-conditional share sigma(N) =
 * E_coll(N) / E(N), across every sigma-share decay landmark measured so far --
 * sigma in {0.75, 0.5, 0.25, 0.1, 0.05, 0.01} (imp-96916/imp-96936 for the upper
 * four rungs, imp-96931/imp-96950 for the deep-arm 0.1/0.05/0.01 rungs, with 0.1
 * measured independently by both pairs as an overlap check).
 *
 * imp-96936 and imp-96950 each exported a conjugateLadder array pairing the C_C
 * leverage against the E_trunc leverage, but no viz leaf merged the two ladders
 * into one chart-ready series spanning the full decay arm. This leaf imports both
 * conjugateLadder arrays verbatim (no transcription), de-duplicates the shared
 * sigma = 0.1 rung, sorts by descending sigma, and adds log10(N) coordinates plus
 * a signed-vs-magnitude view for a "+2 / -2 mirror, shrinking signed sum" chart.
 *
 * PRESENTATION ONLY. Changes no bound; establishes no operator positivity; C_mb
 * stays GUE-conditional (imp-486); interval-rigorous certificate reach stays
 * 2a<=0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96936-sigma-quarter-crossing-cc-elasticity.js (source ladder, sigma 0.75/0.5/0.25/0.1)
 * @see imp-96950-sigma-deep-decay-crossing-cc-elasticity.js (source ladder, sigma 0.1/0.05/0.01)
 * @see imp-96940-sigma-crossing-ladder-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96960 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP96936_SIGMA_QUARTER_CROSSING_CC_ELASTICITY } from './imp-96936-sigma-quarter-crossing-cc-elasticity.js';
import { IMP96950_SIGMA_DEEP_DECAY_CROSSING_CC_ELASTICITY } from './imp-96950-sigma-deep-decay-crossing-cc-elasticity.js';

const UPPER_LADDER = IMP96936_SIGMA_QUARTER_CROSSING_CC_ELASTICITY.conjugateLadder; // sigma 0.75/0.5/0.25/0.1
const DEEP_LADDER = IMP96950_SIGMA_DEEP_DECAY_CROSSING_CC_ELASTICITY.conjugateLadder; // sigma 0.1/0.05/0.01

// Overlap check: both source ladders measure sigma = 0.1 independently -- read off
// before merging so the assertion below can confirm they agree.
const UPPER_AT_TENTH = UPPER_LADDER.find((row) => row.sigma === 0.1);
const DEEP_AT_TENTH = DEEP_LADDER.find((row) => row.sigma === 0.1);

// Merge the two ladders, keeping the imp-96936 sigma=0.1 rung and dropping the
// imp-96950 duplicate, sorted by descending sigma (shallow -> deep decay arm).
const MERGED_ROWS = [...UPPER_LADDER, ...DEEP_LADDER.filter((row) => row.sigma !== 0.1)].sort(
  (a, b) => b.sigma - a.sigma,
);

// chart-ready ladder series: x = log10(N_cross), y = signed elasticity (cc rides
// toward +2, etrunc rides toward -2, mirroring each other about zero).
export const IMP96960_LADDER_SERIES = Object.freeze(
  MERGED_ROWS.map((row) => ({
    sigma: row.sigma,
    label: `sigma=${row.sigma}`,
    nCross: row.N_cross,
    log10N: +Math.log10(row.N_cross).toFixed(4),
    elasticityCC: row.elasticity_cc,
    elasticityEtrunc: row.elasticity_etrunc,
    magnitudeCC: +Math.abs(row.elasticity_cc).toFixed(6),
    magnitudeEtrunc: +Math.abs(row.elasticity_etrunc).toFixed(6),
    signedSum: row.signed_sum,
    absSignedSum: +Math.abs(row.signed_sum).toFixed(6),
    eflowOverEtrunc: row.eflow_over_etrunc,
  })),
);

// reference lines the two leverages mirror about: +2 (C_C) and -2 (E_trunc), the
// shared inverse-square asymptote of the decay arm.
export const IMP96960_MIRROR_ASYMPTOTES = Object.freeze({ cc: 2, etrunc: -2 });

export const IMP96960_HONEST_BANNER =
  'Presentation only: the C_C and E_trunc leverages of the GUE-conditional share sigma(N) are ' +
  'EQUAL-AND-OPPOSITE across every measured decay landmark (sigma = 0.75 down to 0.01) -- a ' +
  '+2 / -2 mirror about the inverse-square asymptote, not an operator positivity proof. The signed ' +
  'sum shrinks monotonically toward zero as E_flow / E_trunc collapses down the arm, so deep in the ' +
  'decay arm the share depends on the two constants only through the ratio C_C / E_trunc. C_mb stays ' +
  'GUE-conditional (imp-486); interval-rigorous certificate reach stays 2a<=0.96; no refereed bound is changed' +
  '; RH open; NO QED.';

// plain validation object (no self-executing throw; imp-96294/imp-96819 convention -- a viz-data
// leaf must stay inert in the browser so a stale reading cannot blank a lazy-loaded page). Checked
// by scripts/run-assertions.mjs via the IMP96960_ASSERTIONS array below, not at import time.
export const IMP96960_VALIDATION = Object.freeze({
  sixRungsPresent: IMP96960_LADDER_SERIES.length === 6,
  sigmaDescendingStrict: IMP96960_LADDER_SERIES.every(
    (row, i) => i === 0 || row.sigma < IMP96960_LADDER_SERIES[i - 1].sigma,
  ),
  log10NMonotoneIncreasing: IMP96960_LADDER_SERIES.every(
    (row, i) => i === 0 || row.log10N > IMP96960_LADDER_SERIES[i - 1].log10N,
  ),
  ccAlwaysPositiveEtruncAlwaysNegative: IMP96960_LADDER_SERIES.every(
    (row) => row.elasticityCC > 0 && row.elasticityEtrunc < 0,
  ),
  magnitudesMirrorWithinTwoPercent: IMP96960_LADDER_SERIES.every(
    (row) => Math.abs(row.magnitudeCC - row.magnitudeEtrunc) / row.magnitudeEtrunc < 2e-2,
  ),
  absSignedSumShrinksMonotonically: IMP96960_LADDER_SERIES.every(
    (row, i) => i === 0 || row.absSignedSum < IMP96960_LADDER_SERIES[i - 1].absSignedSum,
  ),
  overlapRungAgrees:
    UPPER_AT_TENTH !== undefined &&
    DEEP_AT_TENTH !== undefined &&
    Math.abs(UPPER_AT_TENTH.elasticity_cc - DEEP_AT_TENTH.elasticity_cc) < 1e-3 &&
    Math.abs(UPPER_AT_TENTH.elasticity_etrunc - DEEP_AT_TENTH.elasticity_etrunc) < 1e-3,
  matchesSourceVerdicts:
    IMP96936_SIGMA_QUARTER_CROSSING_CC_ELASTICITY.isRigorous === false &&
    IMP96950_SIGMA_DEEP_DECAY_CROSSING_CC_ELASTICITY.isRigorous === false &&
    /NO QED/.test(IMP96936_SIGMA_QUARTER_CROSSING_CC_ELASTICITY.verdict) &&
    /NO QED/.test(IMP96950_SIGMA_DEEP_DECAY_CROSSING_CC_ELASTICITY.verdict),
  honestBannerPresent:
    /RH open/.test(IMP96960_HONEST_BANNER) &&
    /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96960_HONEST_BANNER) &&
    /NO QED/.test(IMP96960_HONEST_BANNER),
});

// imp-96397: registers the IMP96960_VALIDATION checks with the build-time assertion sweep
// (scripts/run-assertions.mjs), which discovers any exported *_ASSERTIONS array without
// requiring an import-time throw.
export const IMP96960_ASSERTIONS = [
  {
    id: 'imp96960-six-rungs-present',
    description: 'all six decay landmarks (sigma 0.75/0.5/0.25/0.1/0.05/0.01) are reshaped into chart-ready points',
    holds: () => IMP96960_VALIDATION.sixRungsPresent,
  },
  {
    id: 'imp96960-sigma-descending-strict',
    description: 'the merged ladder is strictly sorted by descending sigma with the duplicate 0.1 rung removed',
    holds: () => IMP96960_VALIDATION.sigmaDescendingStrict,
  },
  {
    id: 'imp96960-log10n-monotone-increasing',
    description: 'log10(N_cross) increases monotonically as sigma falls across the merged ladder',
    holds: () => IMP96960_VALIDATION.log10NMonotoneIncreasing,
  },
  {
    id: 'imp96960-cc-positive-etrunc-negative',
    description: 'the C_C leverage is positive and the E_trunc leverage is negative at every rung (mirror directions)',
    holds: () => IMP96960_VALIDATION.ccAlwaysPositiveEtruncAlwaysNegative,
  },
  {
    id: 'imp96960-magnitudes-mirror',
    description: 'the C_C and E_trunc leverage magnitudes agree to < 2% at every rung (equal-and-opposite)',
    holds: () => IMP96960_VALIDATION.magnitudesMirrorWithinTwoPercent,
  },
  {
    id: 'imp96960-signed-sum-shrinks-monotonically',
    description: 'the |signed sum| shrinks monotonically down the full six-rung ladder as E_flow / E_trunc collapses',
    holds: () => IMP96960_VALIDATION.absSignedSumShrinksMonotonically,
  },
  {
    id: 'imp96960-overlap-rung-agrees',
    description: 'the independently-measured sigma=0.1 rung agrees between the imp-96936 and imp-96950 source ladders',
    holds: () => IMP96960_VALIDATION.overlapRungAgrees,
  },
  {
    id: 'imp96960-matches-source-verdicts',
    description: 'the leaf agrees with both source verdicts (measurement only, no QED)',
    holds: () => IMP96960_VALIDATION.matchesSourceVerdicts,
  },
  {
    id: 'imp96960-honest-banner-present',
    description: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers',
    holds: () => IMP96960_VALIDATION.honestBannerPresent,
  },
];
