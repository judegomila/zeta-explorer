/**
 * @module imp-97197-eps-primorial-envelope-ladder-viz-data
 * @fileoverview imp-97197 -- VIZ DATA ONLY. Bakes the imp-97159 primorial-envelope
 *   eps(b) ladder (the sharp per-omega-class worst-case values of the imp-97133
 *   remainder eps(b) = (1/2) 2^omega(b) (log b + 3) / phi(b), attained exactly at
 *   each primorial P_k) into a single chart-ready series against the fixed
 *   kappa_arith = 0.5704960511308594 threshold line. Values are literals copied
 *   verbatim from imp-97159's IMP97159_CROSSOVER.primorialEnvelope comment and
 *   its self-executing assertion imp97159-primorial-envelope-crosses-between-P4-and-P5.
 *   The ladder is strictly decreasing for k >= 2 and crosses kappa_arith strictly
 *   between P_4 = 210 (eps = 1.391, above) and P_5 = 2310 (eps = 0.358, below) --
 *   the crossover imp-97159 pins exactly via its k=4 envelope theorem (b0 = 574
 *   rigorous, b0 = 511 sharp). Pure frozen-object data, no imports, no
 *   self-executing assertions of its own, per the [[no_heavy_imports_in_pages]]
 *   convention -- needs no separate DATA_MODULES registration.
 *
 *   @see imp-97159-route-m-arith-first-moment-positivity-crossover.js (the
 *        primorial-envelope Lemma and crossover theorem this bakes)
 *   @see imp-97133-route-m-arith-first-moment-explicit-remainder.js (the eps(b)
 *        remainder formula)
 *
 *   Ticket: imp-97197 (ux, low). Presentation of an already-derived crossover;
 *   adds no new Lambda bound. No refereed bound is changed. RH open. NO QED.
 */

export const IMP97197_KAPPA_ARITH = 0.5704960511308594;

// -- primorial envelope ladder: eps(P_k), sharp worst-case of eps over omega(b) = k --
export const IMP97197_PRIMORIAL_ENVELOPE_ROWS = Object.freeze([
  Object.freeze({ k: 1, primorial: 2, eps: 3.693, aboveKappa: true }),
  Object.freeze({ k: 2, primorial: 6, eps: 4.792, aboveKappa: true }),
  Object.freeze({ k: 3, primorial: 30, eps: 3.201, aboveKappa: true }),
  Object.freeze({ k: 4, primorial: 210, eps: 1.391, aboveKappa: true }),
  Object.freeze({ k: 5, primorial: 2310, eps: 0.358, aboveKappa: false }),
  Object.freeze({ k: 6, primorial: 30030, eps: 0.074, aboveKappa: false }),
]);

export const IMP97197_CROSSOVER = Object.freeze({
  crossesBetween: { lowerK: 4, primorial: 210, upperK: 5, upperPrimorial: 2310 },
  b0Envelope: 574, // rigorous, finite k=4-envelope threshold (imp-97159)
  b0Exact: 511, // sharp threshold (imp-97159)
  decreasingFromK: 2, // eps(P_k) strictly decreasing for k >= 2
});

export const IMP97197_VERDICT = Object.freeze({
  ladderRowCount: 6,
  strictlyDecreasingFromK2: true,
  crossesKappaOnce: true,
  boundMoved: false,
});

export const IMP97197_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: reshapes the ' +
  'already-derived (imp-97159) primorial-envelope eps(P_k) ladder against the fixed ' +
  'kappa_arith = 0.5705 line into a single chart-ready series. No re-derivation, no ' +
  'bound moved, says nothing about kappa > 0 or the zeros.';

// -- plain validation object (no self-executing throw; the imp-96294/imp-96819 convention) --
export const IMP97197_VALIDATION = Object.freeze({
  rows_present: IMP97197_PRIMORIAL_ENVELOPE_ROWS.length === 6,
  decreasing_from_k2: [1, 2, 3, 4].every(
    (i) => IMP97197_PRIMORIAL_ENVELOPE_ROWS[i].eps > IMP97197_PRIMORIAL_ENVELOPE_ROWS[i + 1].eps,
  ),
  crosses_between_P4_and_P5:
    IMP97197_PRIMORIAL_ENVELOPE_ROWS[3].eps > IMP97197_KAPPA_ARITH &&
    IMP97197_PRIMORIAL_ENVELOPE_ROWS[4].eps < IMP97197_KAPPA_ARITH,
  labels_match_primorials: IMP97197_PRIMORIAL_ENVELOPE_ROWS.every(
    (r) => r.aboveKappa === (r.eps > IMP97197_KAPPA_ARITH),
  ),
});

export default Object.freeze({
  id: 'imp-97197-eps-primorial-envelope-ladder-viz-data',
  ticket: 'imp-97197',
  source: 'imp-97159-route-m-arith-first-moment-positivity-crossover.js',
  kappaArith: IMP97197_KAPPA_ARITH,
  rows: IMP97197_PRIMORIAL_ENVELOPE_ROWS,
  crossover: IMP97197_CROSSOVER,
  verdict: IMP97197_VERDICT,
  boundMoved: false,
});
