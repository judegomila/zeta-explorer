/**
 * @module imp-96478-count-gap-share-viz-data
 *
 * imp-96478 (ux, sonnet-4-6): chart-shaping layer for the imp-96445 split of the
 * count-inversion gammaRelGap into its deterministic +7/8-term share and its
 * residual S(gamma_N) fluctuation share, across the four imp-96426 intermediate
 * anchors N = 1e3..1e6. Every fraction and S(gamma_N) value below is copied
 * verbatim from imp-96445-count-gap-plus78-vs-st-split.js; the only work done
 * here is projecting the per-anchor rows onto a log10(N) x-axis for a stacked
 * bar (share split) plus a line (S(gamma_N) wobble).
 *
 * @see imp-96445-count-gap-plus78-vs-st-split.js (source measurement, method, verdict)
 */

import { IMP96445_COUNT_GAP_PLUS78_VS_ST_SPLIT } from './imp-96445-count-gap-plus78-vs-st-split.js';

const { perAnchor, measurement, verdict } = IMP96445_COUNT_GAP_PLUS78_VS_ST_SPLIT;

export const IMP96478_SHARE_BARS = Object.freeze(
  perAnchor.map((a) => Object.freeze({
    N: a.N,
    log10N: Math.log10(a.N),
    plus78Fraction: a.plus78Fraction,
    stFraction: a.stFraction,
    sOfGamma: a.sOfGamma,
  })),
);

export const IMP96478_AXIS = Object.freeze({
  log10NMin: Math.min(...IMP96478_SHARE_BARS.map((b) => b.log10N)) - 0.5,
  log10NMax: Math.max(...IMP96478_SHARE_BARS.map((b) => b.log10N)) + 0.5,
  sMin: Math.min(...IMP96478_SHARE_BARS.map((b) => b.sOfGamma)) - 0.1,
  sMax: Math.max(...IMP96478_SHARE_BARS.map((b) => b.sOfGamma)) + 0.1,
});

export const IMP96478_FINDING = Object.freeze({
  plus78IsDominantShare: measurement.plus78IsDominantShare,
  stShareDoesNotVanish: measurement.stShareDoesNotVanish,
});

export const IMP96478_HONEST_BANNER = verdict;
