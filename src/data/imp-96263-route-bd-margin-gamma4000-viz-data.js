/**
 * @module imp-96263-route-bd-margin-gamma4000-viz-data
 *
 * imp-96263 (ux): import-light viz-data leaf for the imp-96224 worst-support (N=32) on-line
 * signed-force margin column rho(32,T), which extended the census from gamma_2000 (T~2515) to
 * gamma_4000 (T~4506) but shipped with no chart surface -- the imp-96236 chart only covers the
 * earlier 26-point (gamma_2000) column.
 *
 * Reshapes the full 34-point column (7 imp-96148 baked cutoffs + 19 imp-96167/imp-96186/imp-96209
 * extension cutoffs + 8 imp-96224 gamma_4000 cutoffs) into chart-ready form, and re-derives the two
 * fitted curves (reciprocal-log floor vs log-linear) as sampled point sets over the observed T range
 * using the imp-96224 baked fit parameters verbatim (a, b, c, d) -- no re-fitting.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every column value and fit parameter is copied verbatim from
 * the imp-96224 baked `validation` and `extendedT`/`extendedRho`/`refit` fields; only the curve
 * SAMPLING (evaluating the two already-fitted formulas at plot-resolution T values) is computed
 * here. Changes no bound, establishes no operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-96224-route-bd-online-margin-floor-gamma4000.js (column data, refit parameters)
 *
 * Ticket: imp-96263 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import { ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA4000 } from './imp-96224-route-bd-online-margin-floor-gamma4000.js';

const SRC = ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA4000;

// Full 34-point column, merged in increasing-T order across the four census stages.
export const IMP96263_COLUMN = [
  ...SRC.validation.bakedT.map((T, i) => ({ T, rho: SRC.validation.bakedRho[i], stage: 'gamma200 baked' })),
  ...SRC.validation.prevExtT.map((T, i) => ({ T, rho: SRC.validation.prevExtRho[i], stage: 'gamma500/gamma1000/gamma2000 extension' })),
  ...SRC.extendedT.map((T, i) => ({ T, rho: SRC.extendedRho[i], stage: 'gamma4000 extension' })),
];

// Sample both already-fitted laws at plot resolution across the observed T range
// [T_min, T_max] using the imp-96224 baked (a, b, c, d) verbatim -- no re-fitting here.
function sampleFits(numSamples) {
  const tMin = IMP96263_COLUMN[0].T;
  const tMax = IMP96263_COLUMN[IMP96263_COLUMN.length - 1].T;
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

export const IMP96263_FIT_CURVE = sampleFits(60);

export const IMP96263_REFIT = {
  logLinear: { ...SRC.refit.logLinear },
  reciprocalLogFloor: { ...SRC.refit.reciprocalLogFloor },
};

// Strict-positivity / no-crossing envelope: the measured column and both fitted laws stay
// strictly above zero across the whole observed range, and the log-linear naive zero-crossing
// (where it WOULD cross, if extrapolated) recedes far beyond the census.
export const IMP96263_ENVELOPE = {
  minObservedRho: Math.min(...IMP96263_COLUMN.map((r) => r.rho)),
  maxObservedRho: Math.max(...IMP96263_COLUMN.map((r) => r.rho)),
  reciprocalLogFloor: SRC.refit.reciprocalLogFloor.floor,
  logLinearNaiveCrossT: SRC.refit.logLinear.naiveCrossT,
  lastCensusT: SRC.extendedT[SRC.extendedT.length - 1],
  crossExceedsCensusBy: SRC.refit.logLinear.naiveCrossT / SRC.extendedT[SRC.extendedT.length - 1],
};

// Floor drift by census depth, copied verbatim from the imp-96224 refit.floorByDepth block --
// the reciprocal-log floor keeps falling (near-halving per doubling), never plateauing.
export const IMP96263_FLOOR_BY_DEPTH = { ...SRC.refit.floorByDepth };

export const IMP96263_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: the 34-point column and both '
  + 'fit parameters (a, b, c, d) are copied verbatim from the imp-96224 baked validation/extendedT/'
  + 'extendedRho/refit fields; only the two curves’ sample points across the observed T range are '
  + 'computed here (evaluating the already-fitted formulas, not re-fitting). No bound is claimed and '
  + 'no operator positivity is established; the fitted floor is trending toward zero (imp-96224), not '
  + 'settling at a positive asymptote.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96263_ASSERTIONS = [
  {
    id: 'imp96263-column-has-34-points-in-nondecreasing-T-order',
    holds: () => IMP96263_COLUMN.length === 34
      && IMP96263_COLUMN.every((r, i) => i === 0 || r.T >= IMP96263_COLUMN[i - 1].T),
    why: 'imp-96224 merges 7 baked + 19 prior-extension + 8 gamma4000 cutoffs = 34 points, already in increasing-T order.',
  },
  {
    id: 'imp96263-column-strictly-positive',
    holds: () => IMP96263_COLUMN.every((r) => r.rho > 0),
    why: 'the on-line worst-support margin stays strictly feasible (positive) at every census depth per imp-96148/96167/96186/96209/96224.',
  },
  {
    id: 'imp96263-fit-curve-matches-baked-params-at-endpoints',
    holds: () => {
      const first = IMP96263_FIT_CURVE[0];
      const last = IMP96263_FIT_CURVE[IMP96263_FIT_CURVE.length - 1];
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
    id: 'imp96263-envelope-crossing-recedes-far-beyond-census',
    holds: () => IMP96263_ENVELOPE.crossExceedsCensusBy > 90
      && IMP96263_ENVELOPE.minObservedRho > 0.35,
    why: 'the log-linear naive crossing (T~4.2e5) sits over 90x beyond the last census cutoff (T~4506), and the measured minimum stays well above zero -- the no-crossing envelope holds throughout.',
  },
  {
    id: 'imp96263-floor-by-depth-keeps-falling-no-plateau',
    holds: () => IMP96263_FLOOR_BY_DEPTH.gamma4000 < IMP96263_FLOOR_BY_DEPTH.gamma2000
      && IMP96263_FLOOR_BY_DEPTH.gamma2000 < IMP96263_FLOOR_BY_DEPTH.gamma1000,
    why: 'the fitted reciprocal-log floor keeps falling with census depth (0.11063 -> 0.07061 -> 0.03411), trending toward zero rather than settling positive.',
  },
];

for (const a of IMP96263_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96263-route-bd-margin-gamma4000-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
