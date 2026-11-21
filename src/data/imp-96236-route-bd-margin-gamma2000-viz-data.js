/**
 * @module imp-96236-route-bd-margin-gamma2000-viz-data
 *
 * imp-96236 (ux): import-light viz-data leaf for the imp-96209 worst-support (N=32) on-line
 * signed-force margin column rho(32,T), which extended the census from gamma_1000 (T~1419) to
 * gamma_2000 (T~2515) but shipped with no chart surface -- only the imp-96216 table viz covers
 * the earlier 17-point (gamma_1000) column.
 *
 * Reshapes the full 26-point column (7 imp-96148 baked cutoffs + 10 imp-96167/imp-96186 extension
 * cutoffs + 9 imp-96209 gamma_2000 cutoffs) into chart-ready form, and re-derives the two fitted
 * curves (reciprocal-log floor vs log-linear) as sampled point sets over the observed T range using
 * the imp-96209 baked fit parameters verbatim (a, b, c, d) -- no re-fitting.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every column value and fit parameter is copied verbatim from
 * the imp-96209 baked `validation` and `extendedT`/`extendedRho`/`refit` fields; only the curve
 * SAMPLING (evaluating the two already-fitted formulas at plot-resolution T values) is computed
 * here. Changes no bound, establishes no operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-96209-route-bd-online-margin-floor-gamma2000.js (column data, refit parameters)
 *
 * Ticket: imp-96236 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no bound; NO QED.
 */

import { ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA2000 } from './imp-96209-route-bd-online-margin-floor-gamma2000.js';

const SRC = ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA2000;

// Full 26-point column, merged in increasing-T order across the three census stages.
export const IMP96236_COLUMN = [
  ...SRC.validation.bakedT.map((T, i) => ({ T, rho: SRC.validation.bakedRho[i], stage: 'gamma200 baked' })),
  ...SRC.validation.prevExtT.map((T, i) => ({ T, rho: SRC.validation.prevExtRho[i], stage: 'gamma500/gamma1000 extension' })),
  ...SRC.extendedT.map((T, i) => ({ T, rho: SRC.extendedRho[i], stage: 'gamma2000 extension' })),
];

// Sample both already-fitted laws at plot resolution across the observed T range
// [T_min, T_max] using the imp-96209 baked (a, b, c, d) verbatim -- no re-fitting here.
function sampleFits(numSamples) {
  const tMin = IMP96236_COLUMN[0].T;
  const tMax = IMP96236_COLUMN[IMP96236_COLUMN.length - 1].T;
  const lnMin = Math.log(tMin);
  const lnMax = Math.log(tMax);
  const { a, b } = SRC.refit.logLinear;
  const { c, d } = SRC.refit.reciprocalLogFloor;
  const points = [];
  for (let i = 0; i < numSamples; i += 1) {
    const lnT = lnMin + ((lnMax - lnMin) * i) / (numSamples - 1);
    const T = Math.exp(lnT);
    points.push({
      T,
      logLinear: a + b * lnT,
      reciprocalLog: c + d / lnT,
    });
  }
  return points;
}

export const IMP96236_FIT_CURVE = sampleFits(60);

export const IMP96236_REFIT = {
  logLinear: { ...SRC.refit.logLinear },
  reciprocalLogFloor: { ...SRC.refit.reciprocalLogFloor },
};

// Strict-positivity / no-crossing envelope: the measured column and both fitted laws stay
// strictly above zero across the whole observed range, and the log-linear naive zero-crossing
// (where it WOULD cross, if extrapolated) recedes far beyond the census.
export const IMP96236_ENVELOPE = {
  minObservedRho: Math.min(...IMP96236_COLUMN.map((r) => r.rho)),
  maxObservedRho: Math.max(...IMP96236_COLUMN.map((r) => r.rho)),
  reciprocalLogFloor: SRC.refit.reciprocalLogFloor.floor,
  logLinearNaiveCrossT: SRC.refit.logLinear.naiveCrossT,
  lastCensusT: SRC.extendedT[SRC.extendedT.length - 1],
  crossExceedsCensusBy: SRC.refit.logLinear.naiveCrossT / SRC.extendedT[SRC.extendedT.length - 1],
};

export const IMP96236_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: the 26-point column and both '
  + 'fit parameters (a, b, c, d) are copied verbatim from the imp-96209 baked validation/extendedT/'
  + 'extendedRho/refit fields; only the two curves’ sample points across the observed T range are '
  + 'computed here (evaluating the already-fitted formulas, not re-fitting). No bound is claimed and '
  + 'no operator positivity is established; the fitted floor remains an unsettled, still-drifting '
  + 'finite-height feature (imp-96209), not an established asymptote.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96236_ASSERTIONS = [
  {
    id: 'imp96236-column-has-26-points-in-nondecreasing-T-order',
    holds: () => IMP96236_COLUMN.length === 26
      && IMP96236_COLUMN.every((r, i) => i === 0 || r.T >= IMP96236_COLUMN[i - 1].T),
    why: 'imp-96209 merges 7 baked + 10 prior-extension + 9 gamma2000 cutoffs = 26 points, already in increasing-T order.',
  },
  {
    id: 'imp96236-column-strictly-positive',
    holds: () => IMP96236_COLUMN.every((r) => r.rho > 0),
    why: 'the on-line worst-support margin stays strictly feasible (positive) at every census depth per imp-96148/96167/96186/96209.',
  },
  {
    id: 'imp96236-fit-curve-matches-baked-params-at-endpoints',
    holds: () => {
      const first = IMP96236_FIT_CURVE[0];
      const last = IMP96236_FIT_CURVE[IMP96236_FIT_CURVE.length - 1];
      const { a, b } = SRC.refit.logLinear;
      const { c, d } = SRC.refit.reciprocalLogFloor;
      const lnFirst = Math.log(first.T);
      const lnLast = Math.log(last.T);
      return Math.abs(first.logLinear - (a + b * lnFirst)) < 1e-9
        && Math.abs(last.reciprocalLog - (c + d / lnLast)) < 1e-9;
    },
    why: 'the sampled curve endpoints must reproduce the baked (a, b, c, d) formulas exactly (pure evaluation, no re-fit).',
  },
  {
    id: 'imp96236-envelope-crossing-recedes-far-beyond-census',
    holds: () => IMP96236_ENVELOPE.crossExceedsCensusBy > 100
      && IMP96236_ENVELOPE.minObservedRho > 0.4,
    why: 'the log-linear naive crossing (T~3.66e5) sits over 100x beyond the last census cutoff (T~2515), and the measured minimum stays well above zero -- the no-crossing envelope holds throughout.',
  },
];

for (const a of IMP96236_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96236-route-bd-margin-gamma2000-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
