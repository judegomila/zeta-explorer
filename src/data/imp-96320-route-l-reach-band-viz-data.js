/**
 * @module imp-96320-route-l-reach-band-viz-data
 *
 * imp-96320 (ux, sonnet-4-6): chart-shaping layer for the imp-96287 Route L
 * PT-height reach reconciliation. Every numeric value below is copied verbatim
 * from imp-96287-route-l-reach-band-reconciliation.js; the only work done here
 * is converting to log10(N) for a log-scale number-line chart.
 *
 * @see imp-96287-route-l-reach-band-reconciliation.js (source literals, method, verdict)
 */

import { IMP96287_REACH_BAND, IMP96287_VERDICT } from './imp-96287-route-l-reach-band-reconciliation.js';

const log10 = (x) => Math.log10(x);

export const IMP96320_AXIS = Object.freeze({
  minLog10: 10.5,
  maxLog10: 20,
});

export const IMP96320_T0 = Object.freeze({
  value: IMP96287_REACH_BAND.T0,
  log10: log10(IMP96287_REACH_BAND.T0),
});

export const IMP96320_BAND95 = Object.freeze({
  lo: IMP96287_REACH_BAND.band95.envelopeLo,
  hi: IMP96287_REACH_BAND.band95.envelopeHi,
  loLog10: log10(IMP96287_REACH_BAND.band95.envelopeLo),
  hiLog10: log10(IMP96287_REACH_BAND.band95.envelopeHi),
  decades: IMP96287_REACH_BAND.band95.envelopeDecades,
});

export const IMP96320_BAND1SIGMA = Object.freeze({
  lo: IMP96287_REACH_BAND.band1sigma.envelopeLo,
  hi: IMP96287_REACH_BAND.band1sigma.envelopeHi,
  loLog10: log10(IMP96287_REACH_BAND.band1sigma.envelopeLo),
  hiLog10: log10(IMP96287_REACH_BAND.band1sigma.envelopeHi),
});

export const IMP96320_POINT_ESTIMATE = Object.freeze({
  value: IMP96287_REACH_BAND.reportedReach.centralOrder,
  log10: IMP96287_REACH_BAND.reportedReach.centralLog10,
});

export const IMP96320_SOURCE_POINTS = Object.freeze([
  Object.freeze({
    label: 'Christoffel power law',
    value: IMP96287_REACH_BAND.points.christoffelPowerLaw,
    log10: log10(IMP96287_REACH_BAND.points.christoffelPowerLaw),
  }),
  Object.freeze({
    label: 'Detector power law',
    value: IMP96287_REACH_BAND.points.detectorPowerLaw,
    log10: log10(IMP96287_REACH_BAND.points.detectorPowerLaw),
  }),
  Object.freeze({
    label: 'Baked all-delta pooled',
    value: IMP96287_REACH_BAND.points.bakedAllDeltaPooled,
    log10: log10(IMP96287_REACH_BAND.points.bakedAllDeltaPooled),
  }),
]);

export const IMP96320_HONEST_BANNER = IMP96287_VERDICT;
