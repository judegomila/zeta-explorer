/**
 * @module imp-96413-count-model-sensitivity-ladder-viz-data
 *
 * imp-96413 (ux, sonnet-4-6): import-light viz-data leaf for the imp-96387 /
 * imp-96363 +7/8 count-model relative sensitivity ladder. Reshapes the two
 * baked relative shifts (imp-96290 anchor at N = 1e4, imp-96363 reconstructed
 * anchor at N = 1e6) into a two-rung chart-ready ladder plus the measured
 * scaling ratios. No re-derivation: every plotted value is copied verbatim
 * from IMP96387_ECOLL_ANCHOR_COUNT_MODEL_SENSITIVITY_N1E4.
 *
 * PRESENTATION ONLY. No new zeros, no LP solve, no bound changes, no operator
 * positivity established; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96387-ecoll-anchor-count-model-sensitivity-n1e4.js (source measurement, method, verdict)
 */

import { IMP96387_ECOLL_ANCHOR_COUNT_MODEL_SENSITIVITY_N1E4 } from './imp-96387-ecoll-anchor-count-model-sensitivity-n1e4.js';

const { anchorN1e4, comparisonN1e6, scaling } =
  IMP96387_ECOLL_ANCHOR_COUNT_MODEL_SENSITIVITY_N1E4;

export const IMP96413_LADDER = Object.freeze([
  Object.freeze({
    N: anchorN1e4.N,
    label: 'N = 1e4 (imp-96290, independently baked)',
    gammaRelShift: anchorN1e4.gammaRelShift,
    rateRelShift: anchorN1e4.rateRelShift,
    absGammaRelShift: Math.abs(anchorN1e4.gammaRelShift),
    absRateRelShift: Math.abs(anchorN1e4.rateRelShift),
  }),
  Object.freeze({
    N: comparisonN1e6.N,
    label: 'N = 1e6 (imp-96363, reconstructed)',
    gammaRelShift: comparisonN1e6.gammaRelShift,
    rateRelShift: comparisonN1e6.rateRelShift,
    absGammaRelShift: Math.abs(comparisonN1e6.gammaRelShift),
    absRateRelShift: Math.abs(comparisonN1e6.rateRelShift),
  }),
]);

export const IMP96413_SCALING = Object.freeze({
  rateSensitivityRatio: scaling.rateSensitivityRatio,
  gammaSensitivityRatio: scaling.gammaSensitivityRatio,
  heightRatio: comparisonN1e6.N / anchorN1e4.N,
  verdictScalesWithN: scaling.verdictScalesWithN,
});

export const IMP96413_FINDING =
  IMP96387_ECOLL_ANCHOR_COUNT_MODEL_SENSITIVITY_N1E4.verdict;

export const IMP96413_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: both rungs of the ladder '
  + '(N = 1e4 and N = 1e6) and the scaling ratios are copied verbatim from the imp-96387 '
  + 'measurement (no re-fit, no re-derivation) -- only the chart-ready reshaping is computed '
  + 'here. Absolute anchor shifts stay tiny (~4.5e-8) despite the ~137x relative-sensitivity '
  + 'gap; conditional C_H <= 0.127 stays UNPROVEN and no bound moves.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96413_ASSERTIONS = [
  {
    id: 'imp96413-ladder-has-two-rungs',
    holds: () => IMP96413_LADDER.length === 2
      && IMP96413_LADDER[0].N === 1e4
      && IMP96413_LADDER[1].N === 1e6,
    why: 'the ladder must contain exactly the two baked anchor heights, N = 1e4 then N = 1e6.',
  },
  {
    id: 'imp96413-ladder-matches-source',
    holds: () => Math.abs(IMP96413_LADDER[0].rateRelShift - anchorN1e4.rateRelShift) < 1e-15
      && Math.abs(IMP96413_LADDER[1].rateRelShift - comparisonN1e6.rateRelShift) < 1e-15,
    why: 'the reshaped ladder rungs must reproduce the imp-96387 baked relative shifts exactly.',
  },
  {
    id: 'imp96413-n1e4-rung-is-larger',
    holds: () => IMP96413_LADDER[0].absRateRelShift > 10 * IMP96413_LADDER[1].absRateRelShift,
    why: 'the N = 1e4 rung must be an order of magnitude or more larger than the N = 1e6 rung, matching the imp-96387 ~137x finding.',
  },
  {
    id: 'imp96413-scaling-ratio-tracks-height-ratio',
    holds: () => IMP96413_SCALING.gammaSensitivityRatio > 0.5 * IMP96413_SCALING.heightRatio
      && IMP96413_SCALING.gammaSensitivityRatio < 2 * IMP96413_SCALING.heightRatio,
    why: 'the gamma sensitivity ratio must track the 100x height ratio within a factor of two, confirming ~1/N scaling.',
  },
  {
    id: 'imp96413-honest-banner-present',
    holds: () => /RH open/.test(IMP96413_HONEST_BANNER) && /NO QED/.test(IMP96413_HONEST_BANNER) && /refereed bound is changed/i.test(IMP96413_HONEST_BANNER),
    why: 'honesty gate: presentation only, no RH claim, no refereed bound is changed.',
  },
];

for (const a of IMP96413_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96413-count-model-sensitivity-ladder-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
