/**
 * @module imp-97409-b4-ceiling-sign-condition-omega-classes-viz-data
 * @fileoverview imp-97409 -- VIZ DATA ONLY. Bakes the imp-97290/imp-97393 b/4-ceiling sign
 *   condition mu(b) Delta(b) <= 0 and the magnitude ratio |Delta(b)|/(b/2) into a single
 *   chart-ready per-omega-class table.
 *
 *   Context: E1(b) = mu(b)(b/4) + Delta(b), Delta(b) = Sum_{d|b,d<b} mu(d) d g(b/d)
 *   (imp-97290 exact leader decomposition). The ceiling |E1(b)| <= b/4 is EQUIVALENT to
 *   SIGN: mu(b) Delta(b) <= 0, AND MAGNITUDE: |Delta(b)|/(b/2) <= 1. PROVED for omega(b) <= 2
 *   (primes: imp-97265; semiprimes: imp-97290, via g(m)/m <= g(2)/2 = 0.1534264097). OPEN for
 *   omega(b) >= 3 (imp-97393 measured NO violation on 89851 squarefree composites in [2,300000],
 *   with the magnitude-worst class = primorials, ratio -> 1/2 from below as omega grows).
 *
 *   The semiprime magRatio column here is derived by pure algebra from the imp-97290
 *   nearTwinFamilyChecked ratio field (ratio = |E1(b)|/(b/4)): since E1(b) = b/4 + Delta(b) and
 *   Delta(b) < 0 for semiprimes, |Delta(b)|/(b/2) = (1 - ratio)/2. This is an exact identity
 *   transform of already-cited literals, not a new numerical measurement.
 *
 *   Pure frozen-object data, no imports, no self-executing assertions of its own, per the
 *   [[no_heavy_imports_in_pages]] convention.
 *
 *   @see imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js (leader decomposition; omega<=2 proof; near-twin semiprime ratios)
 *   @see imp-97393-route-m-omega3-delta-sign-magnitude-sweep.js (omega>=3 sweep; primorial magRatio ladder omega=3..10)
 *
 *   Ticket: imp-97409 (ux, low). Presentation of already-established results; adds no new Lambda
 *   bound. No refereed bound is changed. RH open. NO QED.
 */

// -- omega=1 (primes) and omega=2 (semiprimes): PROVED. Representative b examples with the
//    magnitude ratio |Delta(b)|/(b/2), derived algebraically from the imp-97290 ratio field.
export const IMP97409_PROVED_EXAMPLES = Object.freeze([
  Object.freeze({ omega: 1, b: 2, factors: '2 (prime)', magRatio: 0.306853, note: 'Delta(p) = g(p); largest magRatio on the smallest prime, decays like (1/6)log(p)/p as p grows' }),
  Object.freeze({ omega: 1, b: 9973, factors: '9973 (prime)', magRatio: null, note: 'imp-97290 measured E1(9973) < 0 matching mu=-1 (sign only; magnitude decays, imp-97265)' }),
  Object.freeze({ omega: 2, b: 6, factors: '2*3', magRatio: 0.401122 }),
  Object.freeze({ omega: 2, b: 77, factors: '7*11', magRatio: 0.183111 }),
  Object.freeze({ omega: 2, b: 899, factors: '29*31', magRatio: 0.069205 }),
  Object.freeze({ omega: 2, b: 5183, factors: '71*73', magRatio: 0.033253 }),
  Object.freeze({ omega: 2, b: 47053, factors: '211*223', magRatio: 0.012809 }),
  Object.freeze({ omega: 2, b: 1005973, factors: '997*1009', magRatio: 0.003287 }),
  Object.freeze({ omega: 2, b: 4003997, factors: '1999*2003', magRatio: 0.001767 }),
]);

// -- omega>=3: OPEN. Primorial ladder = imp-97393's measured magnitude-worst class, ratio -> 1/2
//    from below as omega grows; no sign or magnitude violation found anywhere in the sweep.
export const IMP97409_OPEN_PRIMORIAL_LADDER = Object.freeze([
  Object.freeze({ omega: 3, b: 30, magRatio: 0.438386, triangleOverHalf: 1.0066 }),
  Object.freeze({ omega: 4, b: 210, magRatio: 0.459257, triangleOverHalf: 1.3326 }),
  Object.freeze({ omega: 5, b: 2310, magRatio: 0.471082, triangleOverHalf: 1.5986 }),
  Object.freeze({ omega: 6, b: 30030, magRatio: 0.479983, triangleOverHalf: 1.8581 }),
  Object.freeze({ omega: 7, b: 510510, magRatio: 0.486369, triangleOverHalf: 2.0862 }),
  Object.freeze({ omega: 8, b: 9699690, magRatio: 0.491642, triangleOverHalf: 2.3103 }),
  Object.freeze({ omega: 9, b: 223092870, magRatio: 0.495803, triangleOverHalf: 2.5139 }),
  Object.freeze({ omega: 10, b: 6469693230, magRatio: 0.499043, triangleOverHalf: 2.6903 }),
]);

export const IMP97409_OMEGA_CLASS_SUMMARY = Object.freeze([
  Object.freeze({ omega: 1, status: 'proved', label: 'primes', source: 'imp-97265' }),
  Object.freeze({ omega: 2, status: 'proved', label: 'semiprimes', source: 'imp-97290' }),
  Object.freeze({ omega: 3, status: 'open (no violation measured, [2,300000])', label: 'omega=3 squarefree', source: 'imp-97393' }),
  Object.freeze({ omega: 4, status: 'open (no violation measured, [2,300000])', label: 'omega=4 squarefree', source: 'imp-97393' }),
  Object.freeze({ omega: 5, status: 'open (no violation measured, [2,300000])', label: 'omega=5 squarefree', source: 'imp-97393' }),
  Object.freeze({ omega: 6, status: 'open (no violation measured, [2,300000])', label: 'omega=6 squarefree, ALL need Moebius cancellation', source: 'imp-97393' }),
  Object.freeze({ omega: '7-10', status: 'open (primorial magRatio -> 1/2 from below)', label: 'primorial ladder', source: 'imp-97393' }),
]);

export const IMP97409_VERDICT = Object.freeze({
  ceilingReduction: '|E1(b)| <= b/4  <=>  (i) mu(b) Delta(b) <= 0 (SIGN)  AND  (ii) |Delta(b)|/(b/2) <= 1 (MAGNITUDE)',
  provedThrough: 2,
  firstOpenOmega: 3,
  magnitudeAsymptote: 'on the omega>=3 magnitude-worst primorial class, |Delta(b)|/(b/2) rises slowly toward 1/2 from below (never approaches the ceiling value 1); magnitude is NOT the binding obstruction for omega>=3',
  bindingResidual: 'the SIGN condition, which needs retained Moebius cancellation once the naive triangle bound overcharges (all primorials, all omega>=6 in the [2,300000] sweep)',
  suppliesUniformRemainderBound: false,
  anyBoundMoved: false,
});

export default Object.freeze({
  id: 'imp-97409-b4-ceiling-sign-condition-omega-classes-viz-data',
  ticket: 'imp-97409',
  sources: ['imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js', 'imp-97393-route-m-omega3-delta-sign-magnitude-sweep.js'],
  provedExamples: IMP97409_PROVED_EXAMPLES,
  openPrimorialLadder: IMP97409_OPEN_PRIMORIAL_LADDER,
  classSummary: IMP97409_OMEGA_CLASS_SUMMARY,
  verdict: IMP97409_VERDICT,
  suppliesUniformRemainderBound: false,
  anyBoundMoved: false,
});
