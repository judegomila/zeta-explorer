/**
 * @module imp-95759-msq-pointwise-wall-viz-data
 * @fileoverview imp-95759 -- lightweight viz-data module reshaping the imp-95728
 *   mean-square-vs-pointwise gap wall into two plotted series on a single object:
 *   (1) the variance ratio r(T) = sd(C-E)^2 / Sigma^2(L), flat around ~0.402 in the
 *   band [0.349, 0.480] across T = 1e4..5e5 (no trend toward the GUE value 1), and
 *   (2) the additive worst-excess relative size maxExcess/L, which DECAYS like 1/L
 *   as L grows (2.18e-2 at T=1e4 down to 1.79e-3 at T=5e5) -- the signature that the
 *   gap is additive (O(1-2) zeros), not a fixed fraction of the growing envelope.
 *
 *   Self-computing from the already-measured imp-95728 rows -- no re-derivation, no
 *   fresh quadrature, no heavy imports. Viz data only; changes no bound; no QED.
 *
 *   @see imp-95728-meansquare-pointwise-gap-wall.js (the measured wall this reshapes)
 */

import { IMP95728_MEANSQUARE_POINTWISE_GAP_WALL } from './imp-95728-meansquare-pointwise-gap-wall.js';

const { rows, measured } = IMP95728_MEANSQUARE_POINTWISE_GAP_WALL;

export const IMP95759_RATIO_SERIES = Object.freeze(
  rows.map((r) =>
    Object.freeze({
      Tc: r.Tc,
      log10T: +Math.log10(r.Tc).toFixed(4),
      varRatio: +r.varRatioMeasuredOverGUE.toFixed(4),
    }),
  ),
);

export const IMP95759_EXCESS_SERIES = Object.freeze(
  rows.map((r) =>
    Object.freeze({
      Tc: r.Tc,
      L: +r.meanLocalCountL.toFixed(3),
      log10L: +Math.log10(r.meanLocalCountL).toFixed(4),
      worstRelExcess: r.worstRelExcess,
      log10WorstRelExcess: +Math.log10(r.worstRelExcess).toFixed(4),
    }),
  ),
);

export const IMP95759_RATIO_BAND = Object.freeze({
  mean: +measured.varRatioMean.toFixed(4),
  min: +measured.varRatioBand.min.toFixed(4),
  max: +measured.varRatioBand.max.toFixed(4),
  gueValue: 1, // the GUE asymptote the ratio would approach if the gap closed with height
});

export const IMP95759_EXCESS_DECAY = Object.freeze({
  lo: measured.worstRelExcessLo, // ~2.18e-2 at T=1e4
  hi: measured.worstRelExcessHi, // ~1.79e-3 at T=5e5
  // empirical log-log slope of worstRelExcess vs L across the measured rows: near -1
  // (additive gap: excess/L ~ 1/L) rather than 0 (multiplicative: excess/L ~ const)
  logLogSlope: (() => {
    const first = IMP95759_EXCESS_SERIES[0];
    const last = IMP95759_EXCESS_SERIES[IMP95759_EXCESS_SERIES.length - 1];
    return +((last.log10WorstRelExcess - first.log10WorstRelExcess) / (last.log10L - first.log10L)).toFixed(3);
  })(),
});

export const IMP95759_CAVEAT_BANNER =
  'HONEST STATUS: this is a reshaped VIEW of the already-measured imp-95728 wall assembly ' +
  '(itself carrying imp-95562/imp-95710 measured literals), not a new measurement. The two ' +
  'series together show the SAME wall from its two faces -- a scale-invariant normalised ' +
  'residual (variance ratio flat near 0.40, never trending to the GUE value 1) and a ' +
  'height-decaying absolute residual (additive worst excess, O(1-2) zeros, so relative excess ' +
  'falls ~1/L). Introduces no new cited input and changes no bound; no refereed bound is changed' +
  '. No QED.';

export const IMP95759_MSQ_POINTWISE_WALL_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95759-ratio-series-length-matches-source',
    description: 'the ratio series has one point per imp-95728 measured row',
    holds: () => IMP95759_RATIO_SERIES.length === rows.length,
  },
  {
    id: 'imp95759-ratio-series-in-band',
    description: 'every plotted ratio point sits within the imp-95728 measured band [0.349, 0.480]',
    holds: () => IMP95759_RATIO_SERIES.every((p) => p.varRatio >= 0.34 && p.varRatio <= 0.49),
  },
  {
    id: 'imp95759-excess-series-decays',
    description: 'the worst relative excess strictly decreases across the ascending-height rows',
    holds: () =>
      IMP95759_EXCESS_SERIES.every(
        (p, i) => i === 0 || p.worstRelExcess < IMP95759_EXCESS_SERIES[i - 1].worstRelExcess,
      ),
  },
  {
    id: 'imp95759-excess-decay-slope-near-additive',
    description: 'the log-log slope of worst relative excess vs L is close to -1 (additive gap), not near 0 (multiplicative)',
    holds: () => IMP95759_EXCESS_DECAY.logLogSlope < -0.7 && IMP95759_EXCESS_DECAY.logLogSlope > -1.3,
  },
  {
    id: 'imp95759-excess-decay-endpoints-match-source',
    description: 'the decay endpoints match the imp-95728 headline lo/hi excess literals',
    holds: () =>
      Math.abs(IMP95759_EXCESS_DECAY.lo - measured.worstRelExcessLo) < 1e-9 &&
      Math.abs(IMP95759_EXCESS_DECAY.hi - measured.worstRelExcessHi) < 1e-9,
  },
  {
    id: 'imp95759-ratio-band-below-gue',
    description: 'the ratio band sits strictly below the GUE value of 1 at every point (no closure toward GUE)',
    holds: () => IMP95759_RATIO_BAND.max < IMP95759_RATIO_BAND.gueValue,
  },
  {
    id: 'imp95759-caveat-banner-states-honest-status',
    description: 'the caveat banner opens with HONEST STATUS and flags no QED',
    holds: () => /HONEST STATUS/.test(IMP95759_CAVEAT_BANNER) && /No QED/.test(IMP95759_CAVEAT_BANNER),
  },
];

for (const a of IMP95759_MSQ_POINTWISE_WALL_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95759-msq-pointwise-wall-viz-data assertion failed: ${a.id}`);
  }
}
