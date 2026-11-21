/**
 * @module imp-97324-composite-ratio-rising-viz-data
 *
 * imp-97324 (ux): import-light viz-data leaf for the imp-97291 RESULT 1 / RESULT 3 finding that the
 * worst COMPOSITE ratio r(b) = |E1(b)| / (b/4) rises with the b-range and never plateaus strictly
 * below 1, reshaped into a chart-ready series across the consecutive-prime and twin-prime semiprime
 * ladders up to b ~ 1e9, alongside a primes-saturating-1 reference point and the IEEE-double
 * FP-trustworthy-window boundary (~2.5e9) marker.
 *
 * Every (b, ratio) row below is copied verbatim from the imp-97291 baked IMP97291_RESULTS (no
 * re-derivation of the Gasymp divisor-identity evaluator). Presentation only; changes no bound;
 * no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-97291-route-m-e1-wide-composite-ratio-sweep.js (IMP97291_RESULTS, IMP97291_VERDICT, IMP97291_HONEST_BANNER)
 *
 * Ticket: imp-97324 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP97291_RESULTS, IMP97291_HONEST_BANNER } from './imp-97291-route-m-e1-wide-composite-ratio-sweep.js';

// consecutive-prime semiprime ladder, log10(b) precomputed for chart rendering.
export const IMP97324_CONSECUTIVE_SERIES = Object.freeze(
  IMP97291_RESULTS.consecutivePrimeSemiprimeLadder.map((r) => ({ ...r, log10B: Math.log10(r.b) })),
);

// twin-prime semiprime ladder (same shape; reaches slightly further, past the FP-trust window on its last row).
export const IMP97324_TWIN_PRIME_SERIES = Object.freeze(
  IMP97291_RESULTS.twinPrimeSemiprimeLadder.map((r) => ({ ...r, log10B: Math.log10(r.b) })),
);

// the worst-composite-to-range headline pair (imp-97265 [2,6000] window vs imp-97291 [4,1e6] window).
export const IMP97324_WORST_COMPOSITE_BY_RANGE = Object.freeze([
  { ...IMP97291_RESULTS.worstCompositeTo6000, log10B: Math.log10(IMP97291_RESULTS.worstCompositeTo6000.b) },
  { ...IMP97291_RESULTS.worstCompositeTo1e6, log10B: Math.log10(IMP97291_RESULTS.worstCompositeTo1e6.b) },
]);

// primes-saturating-1 reference point (imp-97265 worst prime ratio <= 6000, from imp-97291 worstByOmegaTo1e6[1]).
const PRIMES_REF = IMP97291_RESULTS.worstByOmegaTo1e6[1];
export const IMP97324_PRIMES_REFERENCE = Object.freeze({
  b: PRIMES_REF.b,
  ratio: PRIMES_REF.ratio,
  log10B: Math.log10(PRIMES_REF.b),
  note: 'primes reach ratio > 0.999 already by b ~ 6e3 -- composites need b ~ 3e7 to close the same gap',
});

// FP-trustworthy-window boundary marker (b ~ 2.5e9): ratio trustworthy to ~6 decimals below this, an
// IEEE-double catastrophic-cancellation artifact (spurious r>1) sets in only far past it (~1e11).
export const IMP97324_FP_BOUNDARY = Object.freeze({
  b: 2.5e9,
  log10B: Math.log10(2.5e9),
  label: 'FP-trustworthy-window boundary (~2.5e9)',
});

export const IMP97324_SUMMARY = Object.freeze({
  claim: 'worst composite ratio r(b) rises monotonically toward 1 with the b-range, never plateauing below it',
  firstRatio: IMP97324_CONSECUTIVE_SERIES[0].ratio,
  lastRatio: IMP97324_CONSECUTIVE_SERIES[IMP97324_CONSECUTIVE_SERIES.length - 1].ratio,
  lastB: IMP97324_CONSECUTIVE_SERIES[IMP97324_CONSECUTIVE_SERIES.length - 1].b,
  supComposite: 1, // approached, never attained
});

export const IMP97324_HONEST_BANNER = IMP97291_HONEST_BANNER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97324_ASSERTIONS = [
  {
    id: 'imp97324-consecutive-series-length-and-log10b',
    holds: () =>
      IMP97324_CONSECUTIVE_SERIES.length === 7 &&
      IMP97324_CONSECUTIVE_SERIES.every((r) => Math.abs(10 ** r.log10B - r.b) < 1e-6),
    why: 'the consecutive-prime semiprime ladder carries seven baked rungs, each with log10B the exact base-10 conversion of b.',
  },
  {
    id: 'imp97324-consecutive-series-rises-monotonically-toward-one',
    holds: () =>
      IMP97324_CONSECUTIVE_SERIES.every((r, i) => i === 0 || r.ratio > IMP97324_CONSECUTIVE_SERIES[i - 1].ratio) &&
      IMP97324_CONSECUTIVE_SERIES.every((r) => r.ratio < 1) &&
      IMP97324_CONSECUTIVE_SERIES[IMP97324_CONSECUTIVE_SERIES.length - 1].ratio > 0.9997,
    why: 'the ladder climbs monotonically from below toward 1 (0.9335 at 71*73 to 0.99972 at 31607*31627) and never attains or exceeds 1.',
  },
  {
    id: 'imp97324-twin-prime-series-rises-monotonically',
    holds: () =>
      IMP97324_TWIN_PRIME_SERIES.every((r, i) => i === 0 || r.ratio > IMP97324_TWIN_PRIME_SERIES[i - 1].ratio) &&
      IMP97324_TWIN_PRIME_SERIES.every((r) => r.ratio < 1),
    why: 'the twin-prime semiprime ladder tracks the same monotone climb toward 1, staying strictly below it.',
  },
  {
    id: 'imp97324-worst-composite-rises-with-range',
    holds: () =>
      IMP97324_WORST_COMPOSITE_BY_RANGE[1].ratio > IMP97324_WORST_COMPOSITE_BY_RANGE[0].ratio &&
      IMP97324_WORST_COMPOSITE_BY_RANGE[1].log10B > IMP97324_WORST_COMPOSITE_BY_RANGE[0].log10B,
    why: 'the worst composite ratio over the wider [4,1e6] window (0.993410) exceeds the [2,6000] window (0.936898) -- confirms the rising-with-range trend.',
  },
  {
    id: 'imp97324-primes-reference-saturates-earlier',
    holds: () =>
      IMP97324_PRIMES_REFERENCE.ratio > 0.999 &&
      IMP97324_PRIMES_REFERENCE.b < IMP97324_CONSECUTIVE_SERIES[3].b &&
      IMP97324_PRIMES_REFERENCE.ratio > IMP97324_CONSECUTIVE_SERIES[3].ratio,
    why: 'the primes reference point (ratio > 0.999 at b ~ 5987) sits at a much smaller b than the composite ladder needs to reach a comparable ratio.',
  },
  {
    id: 'imp97324-fp-boundary-past-full-ladder',
    holds: () =>
      IMP97324_FP_BOUNDARY.b > IMP97324_CONSECUTIVE_SERIES[IMP97324_CONSECUTIVE_SERIES.length - 1].b &&
      Math.abs(10 ** IMP97324_FP_BOUNDARY.log10B - IMP97324_FP_BOUNDARY.b) < 1,
    why: 'the FP-trustworthy-window boundary (~2.5e9) sits past every consecutive-prime-ladder rung, so the whole plotted composite series stays inside the trustworthy window.',
  },
  {
    id: 'imp97324-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97324_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97324_HONEST_BANNER) &&
      /NO QED/.test(IMP97324_HONEST_BANNER),
    why: 'every Route-M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97324_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97324-composite-ratio-rising-viz-data assertion failed: ${a.id}`);
  }
}

export default {
  consecutiveSeries: IMP97324_CONSECUTIVE_SERIES,
  twinPrimeSeries: IMP97324_TWIN_PRIME_SERIES,
  worstCompositeByRange: IMP97324_WORST_COMPOSITE_BY_RANGE,
  primesReference: IMP97324_PRIMES_REFERENCE,
  fpBoundary: IMP97324_FP_BOUNDARY,
  summary: IMP97324_SUMMARY,
  banner: IMP97324_HONEST_BANNER,
};
