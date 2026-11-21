/**
 * @module imp-33631-overcharge-fraction-scatter-viz-data
 * @fileoverview imp-33631 -- VIZ DATA ONLY for the imp-33586 over-charge fraction f_oc
 *   trajectory: a scatter of the 10 imp-33300 plateau f_oc values against ln(end-N), the
 *   imp-33586 OLS fit line (slope ~+0.0268 per e-fold, r^2 ~0.099), the mean +/-1sd band
 *   (~76.1% +/-10.4%), and the N=10^6 endpoint plateau (~84.7%) flagged for highlighting.
 *
 *   This module imports ONLY the light imp-33586-overcharge-fraction-trajectory.js baked
 *   literals (IMP33586_TRAJECTORY / IMP33586_STATS) -- it does NOT re-import the heavy
 *   imp-33273/imp-33269/improvements.js chain, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-33586-overcharge-fraction-trajectory.js (the trajectory + OLS/oscillation stats baked here)
 *   @see imp-33300-majorant-overcharge-plateau-viz-data.js (the underlying f_oc-per-plateau table)
 *
 *   Ticket: imp-33631 (ux, low). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. imp-3066 K_a>=0 UNTOUCHED. RH-EQUIVALENT. NO QED.
 *   No refereed bound is changed.
 */

import {
  IMP33586_TRAJECTORY,
  IMP33586_STATS,
} from './imp-33586-overcharge-fraction-trajectory.js';

// -- scatter points: (ln(end-N), f_oc) per plateau, plus a highlight flag for the N=10^6 endpoint --
export const IMP33631_SCATTER_POINTS = Object.freeze(
  IMP33586_TRAJECTORY.map((r) =>
    Object.freeze({
      plateauIndex: r.plateauIndex,
      endN: r.endN,
      lnEndN: Math.log(r.endN),
      fOc: r.fOc,
      isEndpoint: r.endN === 1000000,
    }),
  ),
);

// -- imp-33586 OLS fit line: f_oc = intercept + slope * ln(end-N), sampled at the scatter's ln-N span --
const LN_END_N_MIN = Math.log(IMP33586_TRAJECTORY[0].endN);
const LN_END_N_MAX = Math.log(IMP33586_TRAJECTORY[IMP33586_TRAJECTORY.length - 1].endN);

export const IMP33631_OLS_LINE = Object.freeze([
  Object.freeze({
    lnEndN: LN_END_N_MIN,
    fOc: IMP33586_STATS.olsIntercept + IMP33586_STATS.olsSlopePerEfold * LN_END_N_MIN,
  }),
  Object.freeze({
    lnEndN: LN_END_N_MAX,
    fOc: IMP33586_STATS.olsIntercept + IMP33586_STATS.olsSlopePerEfold * LN_END_N_MAX,
  }),
]);

// -- mean +/-1 sample-sd band (~76.1% +/-10.4%) --
export const IMP33631_MEAN_BAND = Object.freeze({
  mean: IMP33586_STATS.meanFOc,
  lower: IMP33586_STATS.meanFOc - IMP33586_STATS.sdFOcSample,
  upper: IMP33586_STATS.meanFOc + IMP33586_STATS.sdFOcSample,
});

// -- the N=10^6 endpoint plateau, highlighted separately (~84.7%) --
export const IMP33631_ENDPOINT_HIGHLIGHT = Object.freeze({
  plateauIndex: IMP33586_STATS.endpointPlateauIndex,
  endN: 1000000,
  lnEndN: Math.log(1000000),
  fOc: IMP33586_STATS.endpointFOc,
});

export default Object.freeze({
  id: 'imp-33631-overcharge-fraction-scatter-viz-data',
  ticket: 'imp-33631',
  source: 'imp-33586-overcharge-fraction-trajectory.js',
  scatterPoints: IMP33631_SCATTER_POINTS,
  olsLine: IMP33631_OLS_LINE,
  meanBand: IMP33631_MEAN_BAND,
  endpointHighlight: IMP33631_ENDPOINT_HIGHLIGHT,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP33631_ASSERTIONS = [
  {
    id: 'imp33631-scatter-has-10-points',
    holds: () => IMP33631_SCATTER_POINTS.length === 10,
    why: 'The scatter must plot all 10 imp-33300 plateaus.',
  },
  {
    id: 'imp33631-exactly-one-endpoint-flagged',
    holds: () =>
      IMP33631_SCATTER_POINTS.filter((p) => p.isEndpoint).length === 1 &&
      IMP33631_SCATTER_POINTS.find((p) => p.isEndpoint).endN === 1000000,
    why: 'Exactly one scatter point (end-N=10^6) is flagged as the highlighted endpoint.',
  },
  {
    id: 'imp33631-ols-line-matches-stats',
    holds: () => {
      const predictedAtEndpoint =
        IMP33586_STATS.olsIntercept +
        IMP33586_STATS.olsSlopePerEfold * Math.log(1000000);
      return Math.abs(predictedAtEndpoint - IMP33586_STATS.endpointTrendPrediction) < 1e-4;
    },
    why: 'The OLS line evaluated at end-N=10^6 must reproduce the imp-33586 baked endpointTrendPrediction.',
  },
  {
    id: 'imp33631-mean-band-matches-stats',
    holds: () =>
      Math.abs(IMP33631_MEAN_BAND.mean - 0.7608682) < 1e-6 &&
      Math.abs(IMP33631_MEAN_BAND.lower - 0.6564386) < 1e-6 &&
      Math.abs(IMP33631_MEAN_BAND.upper - 0.8652978) < 1e-6,
    why: 'The mean +/-1sd band must reproduce the imp-33586 baked ~76.1% +/-10.4%.',
  },
  {
    id: 'imp33631-endpoint-matches-stats',
    holds: () =>
      Math.abs(IMP33631_ENDPOINT_HIGHLIGHT.fOc - IMP33586_STATS.endpointFOc) < 1e-9 &&
      IMP33631_ENDPOINT_HIGHLIGHT.plateauIndex === 9,
    why: 'The highlighted endpoint must reproduce the imp-33586 baked endpointFOc (~84.7%) at plateau 9.',
  },
];

for (const assertion of IMP33631_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-33631-overcharge-fraction-scatter-viz-data assertion failed: ${assertion.id}`,
    );
  }
}
