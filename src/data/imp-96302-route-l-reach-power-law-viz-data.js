/**
 * @module imp-96302-route-l-reach-power-law-viz-data
 *
 * imp-96302 (ux, sonnet-4-6): chart-shaping layer for the imp-96269 detector-vs-Christoffel
 * Route L reach power-law cross-check. Every fit coefficient, measured point, and PT-height
 * extrapolation below is copied verbatim from imp-96269-route-l-reach-law-crosscheck.js; the
 * only work done here is sampling the two power laws N = A * gamma^b on a log10 grid (for a
 * log-log curve chart) and converting the shared measured points and the T0 extrapolation fan
 * to log10 coordinates.
 *
 * @see imp-96269-route-l-reach-law-crosscheck.js (source fits, method, verdict)
 */

import { IMP96269_REACH_LAW_CROSSCHECK, IMP96269_VERDICT } from './imp-96269-route-l-reach-law-crosscheck.js';

const {
  sharedGamma,
  measuredNdet,
  christoffelEps1e4,
  detectorFit,
  christoffelFit,
  T0,
  nNeededAtT0,
} = IMP96269_REACH_LAW_CROSSCHECK;

const log10 = (x) => Math.log10(x);

function sampleCurve(fit, gammaMin, gammaMax, steps) {
  const logMin = log10(gammaMin);
  const logMax = log10(gammaMax);
  const pts = [];
  for (let i = 0; i <= steps; i += 1) {
    const gammaLog10 = logMin + (i / steps) * (logMax - logMin);
    const gamma = 10 ** gammaLog10;
    const n = fit.A * gamma ** fit.b;
    pts.push(Object.freeze({ gammaLog10, nLog10: log10(n) }));
  }
  return Object.freeze(pts);
}

export const IMP96302_AXIS = Object.freeze({
  gammaMinLog10: log10(sharedGamma[0]),
  gammaMaxLog10: log10(T0),
  nMinLog10: log10(Math.min(...measuredNdet, ...christoffelEps1e4)),
  nMaxLog10: Math.max(
    log10(nNeededAtT0.detectorPowerLaw),
    log10(nNeededAtT0.christoffelPowerLaw),
  ),
});

export const IMP96302_DETECTOR_CURVE = sampleCurve(detectorFit, sharedGamma[0], T0, 40);
export const IMP96302_CHRISTOFFEL_CURVE = sampleCurve(christoffelFit, sharedGamma[0], T0, 40);

export const IMP96302_MEASURED_POINTS = Object.freeze(
  sharedGamma.map((gamma, i) => Object.freeze({
    gamma,
    gammaLog10: log10(gamma),
    measuredNdet: measuredNdet[i],
    measuredNdetLog10: log10(measuredNdet[i]),
    christoffelEps1e4: christoffelEps1e4[i],
    christoffelEps1e4Log10: log10(christoffelEps1e4[i]),
  })),
);

export const IMP96302_T0 = Object.freeze({ value: T0, log10: log10(T0) });

export const IMP96302_EXTRAPOLATION_FAN = Object.freeze({
  detectorPowerLaw: Object.freeze({
    value: nNeededAtT0.detectorPowerLaw,
    log10: log10(nNeededAtT0.detectorPowerLaw),
  }),
  christoffelPowerLaw: Object.freeze({
    value: nNeededAtT0.christoffelPowerLaw,
    log10: log10(nNeededAtT0.christoffelPowerLaw),
  }),
  ratio_182_over_149: nNeededAtT0.ratio_182_over_149,
});

export const IMP96302_FIT_SUMMARY = Object.freeze({
  detectorFit,
  christoffelFit,
  exponentDiscrepancy: IMP96269_REACH_LAW_CROSSCHECK.exponentDiscrepancy,
  prefactorDiscrepancy: IMP96269_REACH_LAW_CROSSCHECK.prefactorDiscrepancy,
});

export const IMP96302_HONEST_BANNER = IMP96269_VERDICT;
