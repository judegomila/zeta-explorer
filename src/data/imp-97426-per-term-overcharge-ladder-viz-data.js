/**
 * @module imp-97426-per-term-overcharge-ladder-viz-data
 *
 * imp-97426 (ux): import-light viz-data leaf visualizing the imp-97392 b/4-ceiling
 * per-term over-charge constant ladder by omega(b) = k: the per-term (triangle-on-
 * groups) MAGNITUDE bound charges every proper-divisor term d g(b/d) <= b g(2)/2, so
 * the largest signed group of size maxGroup(k) forces a constant
 *
 *   perTermConst(k) = maxGroup(k) * g(2)/2,   maxGroup(2..6) = 2, 3, 8, 15, 32
 *   perTermConst(2..6) = 0.3069, 0.4603, 1.2274, 2.3014, 4.9096
 *
 * against the MAGNITUDE ceiling threshold 1/2. imp-97392 proved the per-term bound
 * works for omega <= 3 (const < 1/2, both cases genuinely below the threshold, not
 * just close) and pinned the omega >= 4 over-charge (const > 1, then rising past 2
 * and 4.9): the largest signed group must be strictly below 1/g(2) = 3.258891, which
 * fails starting at omega = 4 (max group 8).
 *
 * PRESENTATION ONLY. Reuses the imp-97392 groupCounts kernel and group table
 * verbatim (no re-derivation); establishes no new bound; the omega>=4 MAGNITUDE gap
 * stays open (requires the retained Moebius cancellation, per imp-97392 Result 3);
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97392-route-m-quarter-ceiling-omega3-magnitude-obstruction.js (source: groupCounts, PER_TERM, INV_G2, group table)
 * @see imp-97409-b4-ceiling-sign-condition-omega-classes-viz-data.js (sibling viz-data leaf, SIGN condition by omega class)
 *
 * Ticket: imp-97426 (ux, sonnet-4-6, sonnet). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP97392_KERNEL, IMP97392_RESULTS } from './imp-97392-route-m-quarter-ceiling-omega3-magnitude-obstruction.js';

const { groupCounts, PER_TERM, INV_G2, G2 } = IMP97392_KERNEL;

export const IMP97426_PER_TERM = PER_TERM; // g(2)/2 = 0.1534264097
export const IMP97426_INV_G2 = INV_G2; // 1/g(2) = 3.258891353
export const IMP97426_MAGNITUDE_THRESHOLD = 0.5; // 1/2 ceiling on the MAGNITUDE constant

// Ladder rows omega=2..6, reusing imp-97392's groupCounts kernel verbatim.
export const IMP97426_LADDER = Object.freeze(
  [2, 3, 4, 5, 6].map((k) => {
    const gc = groupCounts(k);
    return Object.freeze({
      omega: k,
      maxGroup: gc.maxGroup,
      perTermConst: gc.perTermConst,
      overThreshold: gc.perTermConst >= IMP97426_MAGNITUDE_THRESHOLD,
      status: gc.perTermConst < IMP97426_MAGNITUDE_THRESHOLD ? 'PROVED' : 'OVER-CHARGE',
    });
  }),
);

// Cross-check against imp-97392's own published group table (independent literal source).
export const IMP97426_SOURCE_GROUP_TABLE = IMP97392_RESULTS.omega4Obstruction.groupTable;

export const IMP97426_HONEST_BANNER =
  'Presentation only: the per-term over-charge ladder (maxGroup(k) * g(2)/2 for k=2..6) is reused verbatim ' +
  'from the imp-97392 groupCounts kernel. omega<=3 is PROVED (const < 1/2, genuine slack); omega>=4 is an ' +
  'OVER-CHARGE (const exceeds 1/2, then 1, then rising) because the largest signed group exceeds ' +
  '1/g(2)=3.258891 -- the per-term bound alone cannot close MAGNITUDE there; the retained Moebius cancellation ' +
  'is required instead (imp-97392 Result 3, still open). No new bound established; no refereed bound is changed' +
  '; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97426_ASSERTIONS = [
  {
    id: 'imp97426-ladder-matches-source-literals',
    holds: () => {
      const expected = [
        { omega: 2, maxGroup: 2, perTermConst: 0.3069 },
        { omega: 3, maxGroup: 3, perTermConst: 0.4603 },
        { omega: 4, maxGroup: 8, perTermConst: 1.2274 },
        { omega: 5, maxGroup: 15, perTermConst: 2.3014 },
        { omega: 6, maxGroup: 32, perTermConst: 4.9096 },
      ];
      return IMP97426_LADDER.every((row, i) => {
        const e = expected[i];
        return row.omega === e.omega &&
          row.maxGroup === e.maxGroup &&
          Math.abs(row.perTermConst - e.perTermConst) < 1e-3;
      });
    },
    why: 'the ladder must reproduce the imp-97392 ticket literals (0.3069, 0.4603, 1.2274, 2.3014, 4.9096) computed live from the groupCounts kernel, not transcribed independently.',
  },
  {
    id: 'imp97426-threshold-split-omega-le3-vs-ge4',
    holds: () => {
      const le3 = IMP97426_LADDER.filter((r) => r.omega <= 3);
      const ge4 = IMP97426_LADDER.filter((r) => r.omega >= 4);
      return le3.length === 2 && ge4.length === 3 &&
        le3.every((r) => r.status === 'PROVED' && !r.overThreshold) &&
        ge4.every((r) => r.status === 'OVER-CHARGE' && r.overThreshold);
    },
    why: 'omega=2,3 must sit strictly below the 1/2 MAGNITUDE threshold (PROVED) and omega=4,5,6 strictly at or above it (OVER-CHARGE), matching the imp-97392 Result 3 verdict.',
  },
  {
    id: 'imp97426-invg2-is-the-exact-crossover',
    holds: () => {
      const g3 = IMP97426_LADDER.find((r) => r.omega === 3);
      const g4 = IMP97426_LADDER.find((r) => r.omega === 4);
      return g3.maxGroup < IMP97426_INV_G2 && g4.maxGroup > IMP97426_INV_G2 &&
        IMP97426_INV_G2 > 3.25 && IMP97426_INV_G2 < 3.26 &&
        Math.abs(IMP97426_INV_G2 - 1 / G2) < 1e-9;
    },
    why: 'the per-term bound works iff maxGroup(k) < 1/g(2) = 3.258891; omega=3 (group 3) passes, omega=4 (group 8) fails -- the exact crossover imp-97392 identified.',
  },
  {
    id: 'imp97426-cross-checks-source-table',
    holds: () => {
      const src = IMP97426_SOURCE_GROUP_TABLE;
      return src.length === 5 && IMP97426_LADDER.every((row, i) => {
        const s = src[i];
        return s.omega === row.omega && s.maxGroup === row.maxGroup &&
          Math.abs(s.perTermConst - row.perTermConst) < 1e-9 &&
          s.ok === !row.overThreshold;
      });
    },
    why: 'the locally-derived ladder must agree exactly with the independently-published imp-97392 group table (same kernel, cross-checked against the committed literal export).',
  },
  {
    id: 'imp97426-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97426_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97426_HONEST_BANNER) &&
      /NO QED/.test(IMP97426_HONEST_BANNER),
    why: 'every Route M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97426_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97426-per-term-overcharge-ladder-viz-data assertion failed: ${a.id}`);
  }
}
