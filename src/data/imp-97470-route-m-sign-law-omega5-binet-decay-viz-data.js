/**
 * @module imp-97470-route-m-sign-law-omega5-binet-decay-viz-data
 * @fileoverview imp-97470 -- VIZ DATA ONLY. Charts the imp-97443 (X3) Binet-bracket decay law for the
 *   Route M omega=5 sign-law certificate certA(p1;q1,q2,q3,q4): the scaled quantity q1*certA converges
 *   monotonically to the exact constant (1-1/p1)/12 as the leading prime q1 climbs the minimal-config
 *   ladder q1 = 10^2 .. 10^6, for each of p1 in {2, 3, 5}.
 *
 *   Values are copied literals from imp-97443 (IMP97443_LADDER_REF, the mpmath dps=60 extended-precision
 *   anchors) -- this module does NOT recompute J(n), Dlo/Dhi, or certA. Pure frozen-object data, no
 *   imports, no self-executing assertions of its own, per the [[storage_precision_assertion_tolerance]]
 *   and [[no_heavy_imports_in_pages]] conventions.
 *
 *   @see imp-97443-route-m-sign-law-omega5-binet-certificate-crossval.js (source: IMP97443_LADDER_REF, X3 decay law)
 *   @see imp-97423-route-m-sign-law-omega5-binet-two-sided-estimate.js (derives certA/certB and the bracket)
 *
 *   Ticket: imp-97470 (ux, sonnet-4-6, sonnet). Presentation of an already-established accuracy
 *   cross-check; adds no new Lambda bound. No refereed bound is changed. RH open. NO QED.
 */

// -- per-p1 decay curves: q1 * certA(p1;q1,...) across the minimal-config ladder, converging to (1-1/p1)/12. --
export const IMP97470_DECAY_CURVES = Object.freeze([
  Object.freeze({
    p1: 2,
    color: '#38bdf8',
    cInfty: 1 / 24,
    cInftyLabel: '(1-1/2)/12 = 1/24 = 0.041667',
    points: Object.freeze([
      Object.freeze({ q1: 101, q1certA: 0.041116056 }),
      Object.freeze({ q1: 1009, q1certA: 0.041605847 }),
      Object.freeze({ q1: 10007, q1certA: 0.041660448 }),
      Object.freeze({ q1: 100003, q1certA: 0.041666042 }),
      Object.freeze({ q1: 1000003, q1certA: 0.04166660417 }),
    ]),
  }),
  Object.freeze({
    p1: 3,
    color: '#facc15',
    cInfty: 1 / 18,
    cInftyLabel: '(1-1/3)/12 = 1/18 = 0.055556',
    points: Object.freeze([
      Object.freeze({ q1: 101, q1certA: 0.054728165 }),
      Object.freeze({ q1: 1009, q1certA: 0.05546527 }),
      Object.freeze({ q1: 10007, q1certA: 0.055546339 }),
      Object.freeze({ q1: 100003, q1certA: 0.05555463 }),
      Object.freeze({ q1: 1000003, q1certA: 0.05555546297 }),
    ]),
  }),
  Object.freeze({
    p1: 5,
    color: '#4ade80',
    cInfty: 1 / 15,
    cInftyLabel: '(1-1/5)/12 = 1/15 = 0.066667',
    points: Object.freeze([
      Object.freeze({ q1: 101, q1certA: 0.065584517 }),
      Object.freeze({ q1: 1009, q1certA: 0.066549501 }),
      Object.freeze({ q1: 10007, q1certA: 0.066654718 }),
      Object.freeze({ q1: 100003, q1certA: 0.066665467 }),
      Object.freeze({ q1: 1000003, q1certA: 0.066666547 }),
    ]),
  }),
]);

export const IMP97470_SUMMARY = Object.freeze({
  q1Min: 101,
  q1Max: 1000003,
  p1Values: [2, 3, 5],
  decayLaw: 'q1 * certA(p1;q1) -> (1-1/p1)/12 monotonically increasing, matching the leading Binet term c/q1',
  relativeErrorAtQ1Max: '< 1e-5 (measured, imp-97443 X3)',
  anyBoundMoved: false,
});

export const IMP97470_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation-only chart of the imp-97443 X3 decay law: ' +
  'the Route M omega=5 sign-law certificate certA(p1;q1) scales as q1*certA -> (1-1/p1)/12, verified by an ' +
  'independent extended-precision (mpmath dps=60) recompute across q1 = 10^2 .. 10^6 for p1 = 2, 3, 5. Every ' +
  'value is reused verbatim from imp-97443; no new proof, no bound on Lambda moved.';

export default Object.freeze({
  id: 'imp-97470-route-m-sign-law-omega5-binet-decay-viz-data',
  ticket: 'imp-97470',
  sources: ['imp-97443-route-m-sign-law-omega5-binet-certificate-crossval.js'],
  curves: IMP97470_DECAY_CURVES,
  summary: IMP97470_SUMMARY,
  banner: IMP97470_HONEST_BANNER,
  anyBoundMoved: false,
});
