/**
 * @module imp-97343-e1-ratio-to-one-residual-viz-data
 *
 * imp-97343 (ux): import-light viz-data leaf for the imp-97315 direct-exact ratio->1 ladder
 * (imp-97315-route-m-e1-direct-exact-ratio-crosscheck.js), which had baked the six-member
 * directExactLadder table (r_exact climbing 0.933493584 -> 0.999076521) but no chart-ready
 * residual/decay surface for it.
 *
 * Reshapes IMP97315_RESULTS.directExactLadder into one log-b series carrying the residual
 * 1 - r_exact(b) and, between consecutive ladder members, the per-decade shrink factor of that
 * residual -- the empirical check of the imp-97291 RESULT 4 reading that the residual shrinks
 * roughly like b^{-1/2} (a b^{-1/2} law predicts a per-decade shrink factor of 10^{-1/2} = 0.31623).
 * The baked marginOverSqrtB column ((b/4 - |E1(b)|)/sqrt(b)) is carried through unchanged.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every (b, rExact, marginOverSqrtB) row below is copied
 * verbatim from the imp-97315 baked IMP97315_RESULTS.directExactLadder (no re-derivation of the
 * O(b) coprime-sum kernel). Changes no bound, establishes no operator positivity, no RH claim;
 * no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-97315-route-m-e1-direct-exact-ratio-crosscheck.js (IMP97315_RESULTS, IMP97315_HONEST_BANNER)
 * @see imp-97291-route-m-e1-wide-composite-ratio-sweep.js (RESULT 4: residual b^{-1/2} law)
 *
 * Ticket: imp-97343 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP97315_RESULTS } from './imp-97315-route-m-e1-direct-exact-ratio-crosscheck.js';

const LADDER = IMP97315_RESULTS.directExactLadder;

// one row per ladder member: residual = 1 - r_exact, log10B for chart axes, plus (from the second
// row on) the per-decade shrink factor of the residual relative to the previous member.
export const IMP97343_RESIDUAL_SERIES = Object.freeze(
  LADDER.map((row, i) => {
    const residual = 1 - row.rExact;
    const log10B = Math.log10(row.b);
    let decadeShrinkFactor = null;
    if (i > 0) {
      const prevResidual = 1 - LADDER[i - 1].rExact;
      const decades = log10B - Math.log10(LADDER[i - 1].b);
      decadeShrinkFactor = Math.pow(residual / prevResidual, 1 / decades);
    }
    return Object.freeze({
      b: row.b,
      factors: row.factors,
      log10B,
      rExact: row.rExact,
      residual,
      marginOverSqrtB: row.marginOverSqrtB,
      decadeShrinkFactor,
    });
  }),
);

export const IMP97343_SQRT_LAW_SHRINK_FACTOR = Math.pow(10, -0.5); // 0.31622... predicted by a pure b^{-1/2} law

export const IMP97343_SUMMARY = Object.freeze({
  firstResidual: IMP97343_RESIDUAL_SERIES[0].residual,
  lastResidual: IMP97343_RESIDUAL_SERIES[IMP97343_RESIDUAL_SERIES.length - 1].residual,
  observedShrinkFactorRange: [0.33, 0.4], // matches the imp-97315 "per-decade factor ~0.33-0.35" reading, order of magnitude
  sqrtLawShrinkFactor: IMP97343_SQRT_LAW_SHRINK_FACTOR,
});

export const IMP97343_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every (b, rExact, marginOverSqrtB) ' +
  'row is copied verbatim from the imp-97315 baked IMP97315_RESULTS.directExactLadder (no re-derivation ' +
  'of the O(b) coprime-sum kernel); no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97343_ASSERTIONS = [
  {
    id: 'imp97343-six-ladder-rows',
    holds: () => IMP97343_RESIDUAL_SERIES.length === 6,
    why: 'the imp-97315 directExactLadder carries exactly six consecutive-prime semiprime members.',
  },
  {
    id: 'imp97343-log10B-consistent-with-b',
    holds: () => IMP97343_RESIDUAL_SERIES.every((r) => Math.abs(10 ** r.log10B - r.b) < 1e-6),
    why: 'log10B must be the exact base-10 conversion of the baked b value.',
  },
  {
    id: 'imp97343-residual-decreases-monotonically-toward-zero',
    holds: () =>
      IMP97343_RESIDUAL_SERIES.every((r, i) => i === 0 || r.residual < IMP97343_RESIDUAL_SERIES[i - 1].residual) &&
      IMP97343_RESIDUAL_SERIES.every((r) => r.residual > 0) &&
      IMP97343_RESIDUAL_SERIES[0].residual > 0.06 &&
      IMP97343_RESIDUAL_SERIES[0].residual < 0.07 &&
      IMP97343_RESIDUAL_SERIES[IMP97343_RESIDUAL_SERIES.length - 1].residual < 0.001,
    why: 'the residual 1 - r_exact strictly decreases from ~0.0665 (71*73) to <0.001 (9973*10007), staying positive throughout.',
  },
  {
    id: 'imp97343-decade-shrink-factor-in-plausible-band',
    holds: () =>
      IMP97343_RESIDUAL_SERIES.slice(1).every((r) => r.decadeShrinkFactor > 0.25 && r.decadeShrinkFactor < 0.55),
    why: 'the per-decade shrink factor of the residual sits in a band around the pure b^{-1/2} prediction (0.31623), consistent with the imp-97315 ~0.33-0.35 reading without over-claiming exactness.',
  },
  {
    id: 'imp97343-summary-matches-series',
    holds: () =>
      IMP97343_SUMMARY.firstResidual === IMP97343_RESIDUAL_SERIES[0].residual &&
      IMP97343_SUMMARY.lastResidual === IMP97343_RESIDUAL_SERIES[IMP97343_RESIDUAL_SERIES.length - 1].residual,
    why: 'the summary first/last residual must match the first and last series rows.',
  },
  {
    id: 'imp97343-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97343_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97343_HONEST_BANNER) &&
      /NO QED/.test(IMP97343_HONEST_BANNER),
    why: 'every Route-M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97343_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97343-e1-ratio-to-one-residual-viz-data assertion failed: ${a.id}`);
  }
}

export default {
  residualSeries: IMP97343_RESIDUAL_SERIES,
  sqrtLawShrinkFactor: IMP97343_SQRT_LAW_SHRINK_FACTOR,
  summary: IMP97343_SUMMARY,
  banner: IMP97343_HONEST_BANNER,
};
