/**
 * @module imp-97301-e1-quarter-b-saturation-viz-data
 *
 * imp-97301 (ux): import-light viz-data leaf for the imp-97269 per-class b/4 E1-saturation
 * cross-check (imp-97269-route-m-e1-quarter-b-class-uniformity-crosscheck.js), which had baked
 * the four-class IMP97269_CLASS_TABLE (primes, prime powers, primorials, generic composites)
 * but no chart-ready surface for it.
 *
 * Reshapes IMP97269_CLASS_TABLE into one log-b series per divisor class, each row carrying the
 * saturation ratio q(b) = |E1(b)|/(b/4) already baked by imp-97269. The four series together
 * illustrate the imp-97269 reading: q rises monotonically toward 1 on the primes (the only class
 * where the -b/4 leader survives) while every smooth class (prime powers, primorials, generic
 * composites) undershoots and decays toward 0 as b grows, because the mu-sign divisor-cancellation
 * removes the -b/4 leader off primes.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every (b, omega, q) row below is copied verbatim from the
 * imp-97269 baked IMP97269_CLASS_TABLE (no re-derivation of the O(b) E1 kernel). Changes no
 * bound, establishes no operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-97269-route-m-e1-quarter-b-class-uniformity-crosscheck.js (IMP97269_CLASS_TABLE, IMP97269_HONEST_BANNER)
 *
 * Ticket: imp-97301 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP97269_CLASS_TABLE } from './imp-97269-route-m-e1-quarter-b-class-uniformity-crosscheck.js';

const CLASS_LABELS = Object.freeze({
  primes: 'primes',
  primePowers: 'prime powers',
  primorials: 'primorials',
  genericComposites: 'generic composites',
});

// one row per class member, log10(b) precomputed for chart rendering.
export const IMP97301_CLASS_SERIES = Object.freeze(
  Object.fromEntries(
    Object.entries(IMP97269_CLASS_TABLE).map(([key, rows]) => [
      key,
      rows.map((r) => ({ ...r, log10B: Math.log10(r.b) })),
    ]),
  ),
);

export const IMP97301_CLASS_KEYS = Object.freeze(Object.keys(IMP97269_CLASS_TABLE));
export { CLASS_LABELS as IMP97301_CLASS_LABELS };

export const IMP97301_SUMMARY = Object.freeze({
  bindingClass: 'primes',
  primesMinQ: IMP97269_CLASS_TABLE.primes[0].q,
  primesMaxQ: IMP97269_CLASS_TABLE.primes[IMP97269_CLASS_TABLE.primes.length - 1].q,
  smoothClassesMinQ: Math.min(
    ...['primePowers', 'primorials', 'genericComposites'].flatMap((k) =>
      IMP97269_CLASS_TABLE[k].map((r) => r.q),
    ),
  ),
  ceiling: 'b/4', // |E1(b)| <= b/4 measured class-uniformly, 0 violations
});

export const IMP97301_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every (b, omega, q) row is ' +
  'copied verbatim from the imp-97269 baked IMP97269_CLASS_TABLE (no re-derivation of the O(b) E1 ' +
  'kernel); no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97301_ASSERTIONS = [
  {
    id: 'imp97301-four-classes-present',
    holds: () => IMP97301_CLASS_KEYS.length === 4 && IMP97301_CLASS_KEYS.every((k) => k in CLASS_LABELS),
    why: 'imp-97269 tabulates exactly four divisor classes: primes, prime powers, primorials, generic composites.',
  },
  {
    id: 'imp97301-five-rows-per-class',
    holds: () => IMP97301_CLASS_KEYS.every((k) => IMP97301_CLASS_SERIES[k].length === 5),
    why: 'each class ladder carries five b-values in the baked table.',
  },
  {
    id: 'imp97301-log10B-consistent-with-b',
    holds: () =>
      IMP97301_CLASS_KEYS.every((k) =>
        IMP97301_CLASS_SERIES[k].every((r) => Math.abs(10 ** r.log10B - r.b) < 1e-6),
      ),
    why: 'log10B must be the exact base-10 conversion of the baked b value.',
  },
  {
    id: 'imp97301-primes-rise-monotonically-toward-one',
    holds: () => {
      const p = IMP97301_CLASS_SERIES.primes;
      return p.every((r, i) => i === 0 || r.q > p[i - 1].q) && p.every((r) => r.q < 1) && p[p.length - 1].q > 0.999;
    },
    why: 'the primes class q(b) rises monotonically toward 1 without ever reaching or exceeding it.',
  },
  {
    id: 'imp97301-smooth-classes-decay-toward-zero',
    holds: () =>
      ['primePowers', 'primorials', 'genericComposites'].every((k) => {
        const rows = IMP97301_CLASS_SERIES[k];
        return rows[rows.length - 1].q < rows[0].q;
      }),
    why: 'every smooth class (prime powers, primorials, generic composites) has its largest-b row strictly below its smallest-b row -- q decays with b.',
  },
  {
    id: 'imp97301-quarter-ceiling-never-exceeded',
    holds: () => IMP97301_CLASS_KEYS.every((k) => IMP97301_CLASS_SERIES[k].every((r) => r.q < 1)),
    why: 'the b/4 ceiling (q < 1) holds on every baked row across all four classes.',
  },
  {
    id: 'imp97301-summary-matches-series',
    holds: () =>
      IMP97301_SUMMARY.primesMinQ === IMP97301_CLASS_SERIES.primes[0].q &&
      IMP97301_SUMMARY.primesMaxQ === IMP97301_CLASS_SERIES.primes[IMP97301_CLASS_SERIES.primes.length - 1].q,
    why: 'the summary primes min/max must match the first and last baked primes-class rows.',
  },
  {
    id: 'imp97301-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97301_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97301_HONEST_BANNER) &&
      /NO QED/.test(IMP97301_HONEST_BANNER),
    why: 'every Route-M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97301_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97301-e1-quarter-b-saturation-viz-data assertion failed: ${a.id}`);
  }
}

export default {
  classSeries: IMP97301_CLASS_SERIES,
  classKeys: IMP97301_CLASS_KEYS,
  classLabels: CLASS_LABELS,
  summary: IMP97301_SUMMARY,
  banner: IMP97301_HONEST_BANNER,
};
