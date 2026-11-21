/**
 * @module imp-96702-route-m-reach-projection-viz-data
 *
 * imp-96702 (ux): import-light viz-data leaf for the imp-96569/imp-96601
 * Route M reach-projection verdict, plotting gapFull against the two
 * fluctuation scales (sigma_scatter, sigma_MB) and the nine reach-N corners
 * (confidence z x drift exponent q) against the imp-96352 compute ceiling
 * N ~ 9916.
 *
 * imp-96569 measured that the RH-vs-plateau centerline gap (0.0154) is only
 * ~1.24x the per-rung scatter and ~1.74x the remainder-model residual -- a
 * model-free floor -- and projected nine reach-N corners under an optimistic
 * SE-of-mean model, every one landing 1.4 to 11.6 orders of magnitude beyond
 * the ~9916 compute ceiling. imp-96601 restated that verdict as a glossary
 * headword. Neither had a visualization. This module reshapes the imp-96569
 * IMP96569_SCALES, IMP96569_GAP_FLOOR, IMP96569_PROJECTION, and
 * IMP96569_HEADLINE records (imported directly, no transcription) into
 * chart-ready series.
 *
 * PRESENTATION ONLY. Changes no bound, establishes no operator positivity,
 * no RH claim; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96569-route-m-window-reach-projection.js (source: gap floor + reach projection)
 * @see imp-96601-route-m-reach-verdict-glossary-headword.js (glossary restatement of the verdict)
 * @see imp-96701-frobenius-majorant-eleven-rung-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96702 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96569_SCALES,
  IMP96569_GAP_FLOOR,
  IMP96569_PROJECTION,
  IMP96569_HEADLINE,
  IMP96569_HONEST_BANNER,
} from './imp-96569-route-m-window-reach-projection.js';

// Gap-vs-fluctuation bars: the RH-vs-plateau gap next to the two noise
// scales it must clear. The gap EXCEEDS each scale but by less than 2x
// (imp-96569 FINDING 1: gapToScatter 1.24, gapToMB 1.74), hence the
// per-rung 2-sigma floor.
export const IMP96702_GAP_BARS = Object.freeze([
  Object.freeze({ key: 'gapFull', label: 'gapFull = 1 - c_plat', value: IMP96569_SCALES.gapFull }),
  Object.freeze({ key: 'sigmaScatter', label: 'sigma_scatter (per-rung)', value: IMP96569_SCALES.sigmaScatter }),
  Object.freeze({ key: 'sigmaMB', label: 'sigma_MB (remainder residual)', value: IMP96569_SCALES.sigmaMB }),
]);

export const IMP96702_GAP_RATIOS = Object.freeze({
  gapToScatter: IMP96569_GAP_FLOOR.gapToScatter,
  gapToMB: IMP96569_GAP_FLOOR.gapToMB,
  canReachTwoSigmaPerRung: IMP96569_GAP_FLOOR.canReachTwoSigmaPerRung,
});

// Reach-N corners vs the compute ceiling, on a log10(N) axis, sorted by N1.
export const IMP96702_REACH_ROWS = Object.freeze(
  [...IMP96569_PROJECTION]
    .sort((a, b) => a.N1 - b.N1)
    .map((r) => Object.freeze({
      key: `z${r.z}q${r.q}${r.noise}`,
      label: `z=${r.z}, q=${r.q}, ${r.noise}`,
      N1: r.N1,
      log10N1: Math.log10(r.N1),
      ordersBeyondCeil: r.ordersBeyondCeil,
    })),
);

export const IMP96702_CEILING = Object.freeze({
  ceilN: IMP96569_HEADLINE.ceilN,
  log10CeilN: Math.log10(IMP96569_HEADLINE.ceilN),
  measuredMaxN: IMP96569_HEADLINE.measuredMaxN,
  log10MeasuredMaxN: Math.log10(IMP96569_HEADLINE.measuredMaxN),
});

export const IMP96702_HONEST_BANNER = IMP96569_HONEST_BANNER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96702_ASSERTIONS = [
  {
    // Corrected: the original claim "gapFull is the smallest bar" contradicted
    // the imp-96569 source (gapFull=0.0154 > sigma_scatter=0.0125 > sigma_MB=0.0089).
    // The reproducible claim is that gapFull exceeds each scale by less than 2x.
    id: 'imp96702-gap-bars-three-values-gap-under-two-sigma',
    holds: () =>
      IMP96702_GAP_BARS.length === 3 &&
      IMP96702_GAP_BARS.every((b) => b.value > 0) &&
      IMP96702_GAP_BARS[0].value < 2 * IMP96702_GAP_BARS[1].value &&
      IMP96702_GAP_BARS[0].value < 2 * IMP96702_GAP_BARS[2].value,
    why: 'gapFull must be below 2x each fluctuation scale -- the imp-96569 gap floor is that the RH-vs-plateau gap cannot reach 2 sigma per rung against either scale.',
  },
  {
    id: 'imp96702-ratios-below-two',
    holds: () =>
      IMP96702_GAP_RATIOS.gapToScatter > 1 && IMP96702_GAP_RATIOS.gapToScatter < 2 &&
      IMP96702_GAP_RATIOS.gapToMB > 1 && IMP96702_GAP_RATIOS.gapToMB < 2 &&
      IMP96702_GAP_RATIOS.canReachTwoSigmaPerRung === false,
    why: 'both gap-to-fluctuation ratios sit strictly between 1 and 2 -- below the 2-sigma decision threshold, matching the imp-96569 FINDING 1 floor.',
  },
  {
    id: 'imp96702-reach-rows-nine-sorted-beyond-ceiling',
    holds: () =>
      IMP96702_REACH_ROWS.length === 9 &&
      IMP96702_REACH_ROWS.every((r, i) => i === 0 || r.N1 >= IMP96702_REACH_ROWS[i - 1].N1) &&
      IMP96702_REACH_ROWS.every((r) => r.N1 > IMP96702_CEILING.ceilN && r.ordersBeyondCeil > 1),
    why: 'all nine reach-N corners must be present, sorted ascending by N1, and every single one must exceed the imp-96352 compute ceiling by more than one order of magnitude.',
  },
  {
    id: 'imp96702-headline-min-and-representative-present',
    holds: () =>
      Math.abs(IMP96702_REACH_ROWS[0].N1 - IMP96569_HEADLINE.minReachN) < 1e2 &&
      IMP96702_REACH_ROWS.some((r) => Math.abs(r.N1 - IMP96569_HEADLINE.representativeReachN) < 1e4),
    why: 'the smallest reach row must match the imp-96569 headline minimum reach, and the representative 3-sigma/1-logN corner must be present among the rows.',
  },
  {
    id: 'imp96702-ceiling-consistent-with-source',
    holds: () =>
      IMP96702_CEILING.ceilN === IMP96569_HEADLINE.ceilN &&
      IMP96702_CEILING.measuredMaxN === IMP96569_HEADLINE.measuredMaxN,
    why: 'the plotted compute ceiling and measured-max-N markers are reused verbatim from imp-96569, not re-derived.',
  },
  {
    id: 'imp96702-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96702_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96702_HONEST_BANNER) &&
      /NO QED/.test(IMP96702_HONEST_BANNER),
    why: 'every Route M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96702_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96702-route-m-reach-projection-viz-data assertion failed: ${a.id}`);
  }
}
