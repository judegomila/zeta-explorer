/**
 * @module imp-97418-krein-csharp-floor-ladder-viz-data
 *
 * imp-97418 (ux): import-light viz-data leaf visualizing the certified Krein
 * c_sharp = lambda_min(P_a M_{sigma_2} P_a) floor ladder at the binding 2a=ln3
 * rung, alongside the confined sigma_2 sign map that the imp-97399 floor is
 * computed from:
 *
 *   (1) imp-97335: naive symbol-infimum floor    c_sharp >= inf_t sigma_2  = -4336.198
 *   (2) imp-97399: reproducing-kernel confined-well floor                  = -3200.029
 *                  (+1136.169, 26.2% of the way from -4336.198 to 0)
 *   (3) imp-97416: bathtub/water-filling joint floor                       = -3065.435
 *                  (+134.594 over the reproducing-kernel floor)
 *   (4) imp-97206: measured Rayleigh-Ritz upper bracket (NOT a certified floor) = +0.582
 *
 * This module reshapes those literals (imported directly, no transcription) into a
 * four-bar ladder plus a sign-map series of sigma_2(t) over the confined negative
 * well [0, 10.532] (imp-97399 Finding 1), shading the two negative sub-intervals.
 *
 * PRESENTATION ONLY. Neither certified floor is positive; no operator positivity
 * established; changes no bound; interval-rigorous certificate reach stays
 * 2a<=0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (naive symbol-infimum floor -4336.198)
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (confined well + RK floor -3200.029)
 * @see imp-97416-krein-csharp-bathtub-joint-floor.js (bathtub/water-filling joint floor -3065.435)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (measured upper bracket ~0.582)
 *
 * Ticket: imp-97418 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP97399_FLOOR, IMP97399_WELL, IMP97399_BINDING_2A } from './imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js';
import { IMP97416_FLOOR } from './imp-97416-krein-csharp-bathtub-joint-floor.js';
import { sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

export const IMP97418_BINDING_2A = IMP97399_BINDING_2A;

// Four-bar floor ladder: naive well-depth floor -> reproducing-kernel confined-well
// floor -> bathtub/water-filling joint floor -> measured (not certified) upper bracket.
export const IMP97418_LADDER_BARS = Object.freeze([
  Object.freeze({
    key: 'naive',
    label: 'imp-97335: naive symbol-infimum floor',
    value: IMP97399_FLOOR.naiveSymbolInfFloor, // -4336.198
    color: '#f87171',
    isCertifiedFloor: true,
  }),
  Object.freeze({
    key: 'reproducing-kernel',
    label: 'imp-97399: reproducing-kernel confined-well floor',
    value: IMP97399_FLOOR.reproducingKernelFloor, // -3200.029
    color: '#facc15',
    isCertifiedFloor: true,
  }),
  Object.freeze({
    key: 'bathtub',
    label: 'imp-97416: bathtub/water-filling joint floor',
    value: IMP97416_FLOOR.bathtubJointFloor, // -3065.435
    color: '#fb923c',
    isCertifiedFloor: true,
  }),
  Object.freeze({
    key: 'measured-bracket',
    label: 'imp-97206: measured Rayleigh-Ritz upper bracket',
    value: IMP97399_FLOOR.measuredUpperBracket, // +0.582
    color: '#4ade80',
    isCertifiedFloor: false,
  }),
]);

export const IMP97418_IMPROVEMENT_OVER_NAIVE = IMP97399_FLOOR.improvementOverNaive; // +1136.169
export const IMP97418_PERCENT_OF_GAP_TO_ZERO =
  (IMP97399_FLOOR.improvementOverNaive / -IMP97399_FLOOR.naiveSymbolInfFloor) * 100; // ~26.2

// Sign-map series of sigma_2(t) over the confined negative well plus a small buffer
// past its last negative sub-interval, so the chart shows the curve turning positive.
const SIGNMAP_TMAX = 10.8;
const SIGNMAP_STEP = 0.04;
export const IMP97418_SIGNMAP_SERIES = Object.freeze(
  (() => {
    const rows = [];
    for (let t = 0; t <= SIGNMAP_TMAX + 1e-9; t += SIGNMAP_STEP) {
      rows.push(Object.freeze({ t: Number(t.toFixed(4)), v: sigma2(t) }));
    }
    return rows;
  })(),
);

// Negative sub-intervals (one-sided; sigma_2 is even) to shade under the curve.
export const IMP97418_NEGATIVE_INTERVALS = IMP97399_WELL.negativeSubIntervalsOneSided;
export const IMP97418_ARGMIN = IMP97399_WELL.argmin; // 9.3502
export const IMP97418_GLOBAL_INF = IMP97399_WELL.globalInf; // -4336.198

export const IMP97418_HONEST_BANNER =
  'Measurement/derivation only: neither the naive nor the reproducing-kernel value is a positive floor -- ' +
  'both certify c_sharp >= (a negative number) at 2a=ln3, not c_sharp > 0. The third bar is a Rayleigh-Ritz ' +
  'UPPER bracket, not a certified floor. No operator positivity established; changes no bound; ' +
  'interval-rigorous certificate reach stays 2a<=0.96; RH open; no refereed bound is changed; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97418_ASSERTIONS = [
  {
    id: 'imp97418-ladder-four-bars-monotone-improving',
    holds: () => {
      const B = IMP97418_LADDER_BARS;
      return B.length === 4 &&
        B[0].value < B[1].value && B[1].value < B[2].value && B[2].value < B[3].value &&
        B[0].isCertifiedFloor === true && B[1].isCertifiedFloor === true &&
        B[2].isCertifiedFloor === true && B[3].isCertifiedFloor === false &&
        Math.abs(B[0].value - -4336.198) < 1e-2 &&
        Math.abs(B[1].value - -3200.029) < 0.5 &&
        Math.abs(B[2].value - -3065.435) < 0.5 &&
        Math.abs(B[3].value - 0.582) < 1e-6;
    },
    why: 'the four ladder rungs must be strictly increasing (naive < reproducing-kernel < bathtub < measured), with only the first three being certified floors and the fourth an upper bracket.',
  },
  {
    id: 'imp97418-improvement-matches-26pct',
    holds: () =>
      Math.abs(IMP97418_IMPROVEMENT_OVER_NAIVE - 1136.169) < 0.5 &&
      Math.abs(IMP97418_PERCENT_OF_GAP_TO_ZERO - 26.2) < 0.5,
    why: 'the reproducing-kernel floor improves on the naive floor by +1136.169, which is ~26.2% of the gap from -4336.198 to 0.',
  },
  {
    id: 'imp97418-signmap-series-covers-well-and-turns-positive',
    holds: () => {
      const rows = IMP97418_SIGNMAP_SERIES;
      if (rows.length < 200) return false;
      const argminRow = rows.reduce((best, r) => (r.v < best.v ? r : best), rows[0]);
      const nearArgmin = Math.abs(argminRow.t - IMP97418_ARGMIN) < SIGNMAP_STEP * 2;
      const depthMatches = Math.abs(argminRow.v - IMP97418_GLOBAL_INF) < 1;
      const lastRow = rows[rows.length - 1];
      return nearArgmin && depthMatches && lastRow.t >= 10.5 && lastRow.v > 0;
    },
    why: 'the sampled sigma_2(t) series must reach its global infimum near t=9.3502 at depth ~-4336.198 (imp-97335/imp-97399) and turn positive by the end of the sampled window, matching the confined-well characterization.',
  },
  {
    id: 'imp97418-negative-intervals-shape',
    holds: () =>
      Array.isArray(IMP97418_NEGATIVE_INTERVALS) &&
      IMP97418_NEGATIVE_INTERVALS.length === 2 &&
      IMP97418_NEGATIVE_INTERVALS[0][0] === 0 && IMP97418_NEGATIVE_INTERVALS[0][1] > 3 &&
      IMP97418_NEGATIVE_INTERVALS[1][1] > IMP97418_NEGATIVE_INTERVALS[1][0],
    why: 'the confined negativity set (imp-97399 Finding 1) is exactly two one-sided sub-intervals, [0,3.306] and [6.945,10.532].',
  },
  {
    id: 'imp97418-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97418_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97418_HONEST_BANNER) &&
      /NO QED/.test(IMP97418_HONEST_BANNER),
    why: 'every Route I viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97418_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97418-krein-csharp-floor-ladder-viz-data assertion failed: ${a.id}`);
  }
}
