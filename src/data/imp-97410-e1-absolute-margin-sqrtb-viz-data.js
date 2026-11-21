/**
 * @module imp-97410-e1-absolute-margin-sqrtb-viz-data
 *
 * imp-97410 (ux): import-light viz-data leaf for the imp-97291 RESULT 4 finding that the ABSOLUTE
 * ceiling headroom M(b) = b/4 - |E1(b)| on the binding close-prime-factor semiprime family stays
 * strictly positive and grows like ~sqrt(b) (M/sqrt(b) climbing 1.197 -> 2.224), the complement of
 * the RELATIVE margin 1 - r(b) ~ b^{-1/2} -> 0 already charted by imp-97324 (the ratio r(b) itself)
 * and imp-97343 (the residual 1 - r_exact). This leaf is the first to chart the ABSOLUTE margin.
 *
 * Every (b, marginOverSqrtB) row below is copied verbatim from the imp-97291 baked
 * IMP97291_RESULTS.absoluteMarginOverSqrtB (no re-derivation of the Gasymp divisor-identity
 * evaluator). Presentation only; changes no bound; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-97291-route-m-e1-wide-composite-ratio-sweep.js (IMP97291_RESULTS RESULT 4; IMP97291_HONEST_BANNER)
 * @see imp-97324-composite-ratio-rising-viz-data.js (companion viz: the ratio r(b) itself)
 * @see imp-97343-e1-ratio-to-one-residual-viz-data.js (companion viz: the relative residual 1 - r_exact)
 *
 * Ticket: imp-97410 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP97291_RESULTS, IMP97291_HONEST_BANNER } from './imp-97291-route-m-e1-wide-composite-ratio-sweep.js';

const LADDER = IMP97291_RESULTS.absoluteMarginOverSqrtB;

// one row per baked ladder member: reconstruct the absolute margin M(b) = marginOverSqrtB * sqrt(b)
// and the ceiling b/4 alongside it, plus log10B for chart axes.
export const IMP97410_ABSOLUTE_MARGIN_SERIES = Object.freeze(
  LADDER.map((row) => {
    const sqrtB = Math.sqrt(row.b);
    const margin = row.marginOverSqrtB * sqrtB;
    const ceiling = row.b / 4;
    return Object.freeze({
      b: row.b,
      log10B: Math.log10(row.b),
      marginOverSqrtB: row.marginOverSqrtB,
      margin,
      ceiling,
      relativeMargin: margin / ceiling, // = 1 - r(b), the vanishing complement
    });
  }),
);

export const IMP97410_SUMMARY = Object.freeze({
  claim: 'the absolute margin M(b) = b/4 - |E1(b)| stays positive and grows ~sqrt(b) on the binding semiprime family, even as the relative margin 1-r(b) ~ b^{-1/2} vanishes',
  firstMarginOverSqrtB: IMP97410_ABSOLUTE_MARGIN_SERIES[0].marginOverSqrtB,
  lastMarginOverSqrtB: IMP97410_ABSOLUTE_MARGIN_SERIES[IMP97410_ABSOLUTE_MARGIN_SERIES.length - 1].marginOverSqrtB,
  firstRelativeMargin: IMP97410_ABSOLUTE_MARGIN_SERIES[0].relativeMargin,
  lastRelativeMargin: IMP97410_ABSOLUTE_MARGIN_SERIES[IMP97410_ABSOLUTE_MARGIN_SERIES.length - 1].relativeMargin,
});

export const IMP97410_HONEST_BANNER = IMP97291_HONEST_BANNER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97410_ASSERTIONS = [
  {
    id: 'imp97410-four-ladder-rows',
    holds: () => IMP97410_ABSOLUTE_MARGIN_SERIES.length === 4,
    why: 'the imp-97291 absoluteMarginOverSqrtB table carries exactly four baked rungs.',
  },
  {
    id: 'imp97410-log10B-consistent-with-b',
    holds: () => IMP97410_ABSOLUTE_MARGIN_SERIES.every((r) => Math.abs(10 ** r.log10B - r.b) < 1e-6),
    why: 'log10B must be the exact base-10 conversion of the baked b value.',
  },
  {
    id: 'imp97410-marginOverSqrtB-climbs-monotonically',
    holds: () =>
      IMP97410_ABSOLUTE_MARGIN_SERIES.every((r, i) => i === 0 || r.marginOverSqrtB > IMP97410_ABSOLUTE_MARGIN_SERIES[i - 1].marginOverSqrtB) &&
      IMP97410_ABSOLUTE_MARGIN_SERIES[0].marginOverSqrtB > 1 &&
      IMP97410_ABSOLUTE_MARGIN_SERIES[IMP97410_ABSOLUTE_MARGIN_SERIES.length - 1].marginOverSqrtB < 3,
    why: 'M(b)/sqrt(b) climbs monotonically from 1.197 (b=5183) to 2.224 (b=999634589), the slow log-type increase reported by imp-97291.',
  },
  {
    id: 'imp97410-absolute-margin-positive-and-growing',
    holds: () =>
      IMP97410_ABSOLUTE_MARGIN_SERIES.every((r) => r.margin > 0) &&
      IMP97410_ABSOLUTE_MARGIN_SERIES.every((r, i) => i === 0 || r.margin > IMP97410_ABSOLUTE_MARGIN_SERIES[i - 1].margin),
    why: 'the reconstructed absolute margin M(b) = b/4 - |E1(b)| stays strictly positive and increases across the ladder, unlike the vanishing relative margin.',
  },
  {
    id: 'imp97410-relative-margin-vanishes',
    holds: () =>
      IMP97410_ABSOLUTE_MARGIN_SERIES.every((r, i) => i === 0 || r.relativeMargin < IMP97410_ABSOLUTE_MARGIN_SERIES[i - 1].relativeMargin) &&
      IMP97410_ABSOLUTE_MARGIN_SERIES[IMP97410_ABSOLUTE_MARGIN_SERIES.length - 1].relativeMargin < 1e-3,
    why: 'the reconstructed relative margin (margin/ceiling = 1 - r(b)) decreases monotonically toward 0, the complement of the growing absolute margin -- the two panels tell opposite stories from the same underlying quantity.',
  },
  {
    id: 'imp97410-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97410_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97410_HONEST_BANNER) &&
      /NO QED/.test(IMP97410_HONEST_BANNER),
    why: 'every Route-M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97410_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97410-e1-absolute-margin-sqrtb-viz-data assertion failed: ${a.id}`);
  }
}

export default {
  absoluteMarginSeries: IMP97410_ABSOLUTE_MARGIN_SERIES,
  summary: IMP97410_SUMMARY,
  banner: IMP97410_HONEST_BANNER,
};
