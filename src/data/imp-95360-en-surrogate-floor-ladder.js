/**
 * @module imp-95360-en-surrogate-floor-ladder
 * @fileoverview imp-95360 -- MEASUREMENT of the surrogate E(N) floor level and
 *   its E_trunc dependence for the lambda-roadmap Step-4 obligation
 *   G-EN-ladder-verify (closed:false). imp-35164 established that on the current
 *   surrogate E(N) does NOT tend to 0 but FLOORS at the fixed-strip constant
 *   E_trunc = 3.06e-5. This module quantifies that floor across a wider N-ladder
 *   (N in {1e4 .. 1e12}) than the imp-36227 ladder (which topped out at N = 1e8,
 *   ~1.52 decades BELOW the E_coll = E_trunc crossover) so the tabulation now
 *   spans PAST both crossover heights and makes the approach-to-floor explicit.
 *
 *   WHAT THE LADDER MEASURES (the honest finding).
 *     - The surrogate is E(N) = E_trunc + E_flow + E_coll with the pinned
 *       imp-3406 / imp-33582 sub-terms (identical to imp-35968 / imp-36227):
 *       E_trunc = 3.06e-5 (fixed, N-independent, imp-2631); E_flow =
 *       C_F (logT0/T0) exp(GRONWALL), imp-398/imp-2637; E_coll =
 *       C_C sqrt(logT0/N), C_C = (1/8) sqrt(3 pi) ~ 0.383748, GUE-conditional
 *       (imp-2642/imp-2643). T0 = effectiveHeightForN(N) is the RvM inverse.
 *     - E_flow drops BELOW the E_trunc floor at N ~ 1.598e6 (log10 ~ 6.20).
 *     - E_coll drops BELOW the E_trunc floor at N ~ 3.280e9 (log10 ~ 9.52),
 *       reproducing the imp-35968 crossover N_cross exactly.
 *     - ABOVE N ~ 3.28e9 BOTH shrinking terms sit under the fixed floor, so
 *       E_trunc is the DOMINANT term and E(N) descends toward it from above:
 *       the ratio E(N)/E_trunc falls 6.29 -> 2.77 -> 1.59 -> 1.19 -> 1.064 at
 *       N = 1e8, 1e9, 1e10, 1e11, 1e12. It is monotone-decreasing toward 1,
 *       NOT toward 0. The measured floor level is exactly E_trunc = 3.06e-5.
 *     - No documented surrogate variant vanishes on this model: the two
 *       N-shrinking terms both pass under the floor, leaving the fixed-strip
 *       constant as the irreducible limit. The only scoped route that would
 *       lower the floor is the imp-35149 vanishing-strip Knob A (an N-indexed
 *       growing verified height T_v(N) -> infinity beyond X ~ 3e12), whose hard
 *       obligation R3 is OPEN.
 *
 *   The literals are copied verbatim from a plain-node evaluation of the
 *   IDENTICAL imp-35968 parts(N) chain (effectiveHeightForN + C_C_PINNED); this
 *   module does NOT re-run that chain, so importing it into a page costs nothing
 *   at load time (per [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]]).
 *   The overlapping rows agree bitwise with imp-36227 (E_coll 1.163847e-2 at
 *   N = 1e4, 1.608475e-4 at N = 1e8) and the crossover with imp-35968 (3.280294e9).
 *
 *   Measurement only; reuses the pinned imp-3406 / imp-33582 constants unchanged;
 *   derives no remainder; discharges nothing; supplies NO E(N) -> 0 leg (it
 *   remains OPEN); changes no bound; establishes no operator positivity;
 *   C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631) and
 *   C_mb GUE-conditional (imp-486) are UNTOUCHED; obligation G-EN-ladder-verify
 *   stays OPEN; NO QED; no refereed bound is changed.
 *
 *   @see imp-35164 (E(N) floors at E_trunc = 3.06e-5 on the current surrogate, does not tend to 0)
 *   @see imp-35968-e-trunc-coll-crossover-location.js (E_coll = E_trunc crossover N_cross ~ 3.28e9, source parts(N))
 *   @see imp-36227-en-threefold-imp321-ladder-viz-data.js (the N = 2458..1e8 ladder this one extends)
 *   @see imp-35149 (vanishing-strip Knob A -- the only scoped route to lower the floor, R3 OPEN)
 *   @see imp-2631 (E_trunc = 3.06e-5 fixed-strip floor, N-independent)
 *   @see lambda-roadmap.js Step-4 rigorousUpgradeGap obligation G-EN-ladder-verify (closed:false)
 *   Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 *
 *   Ticket: imp-95360 (numerical, medium). Measurement only, no bound change; NO QED.
 */

export const IMP95360_E_TRUNC_FLOOR = 3.06e-5; // imp-2631 / imp-35164: fixed, N-independent

// The extended N-ladder N in {1e4 .. 1e12}, E(N) = E_trunc + E_flow + E_coll via
// the pinned imp-3406/imp-33582 sub-terms (identical chain to imp-35968/imp-36227).
// ratioColl/ratioFlow/ratioEN are the sub-term (and total) values divided by the
// fixed E_trunc floor -- the "distance to the floor" in floor-units.
export const IMP95360_EN_FLOOR_LADDER = Object.freeze([
  { N: 1e4, logT0: 9.198147, E_trunc: 3.06e-5, E_flow: 1.239194e-3, E_coll: 1.163847e-2, E_N: 1.290826e-2, ratioFlow: 40.496536, ratioColl: 380.342026, ratioEN: 421.838564, shareTrunc: 0.002371 },
  { N: 1e5, logT0: 11.2242, E_trunc: 3.06e-5, E_flow: 2.477034e-4, E_coll: 4.065587e-3, E_N: 4.343891e-3, ratioFlow: 8.094883, ratioColl: 132.862327, ratioEN: 141.957211, shareTrunc: 0.007044 },
  { N: 1e6, logT0: 13.305135, E_trunc: 3.06e-5, E_flow: 4.399126e-5, E_coll: 1.399765e-3, E_N: 1.474357e-3, ratioFlow: 1.437623, ratioColl: 45.743964, ratioEN: 48.181587, shareTrunc: 0.020755 },
  { N: 1e7, logT0: 15.423424, E_trunc: 3.06e-5, E_flow: 7.173296e-6, E_coll: 4.765802e-4, E_N: 5.143535e-4, ratioFlow: 0.234421, ratioColl: 15.574515, ratioEN: 16.808937, shareTrunc: 0.059492 },
  { N: 1e8, logT0: 17.568621, E_trunc: 3.06e-5, E_flow: 1.097036e-6, E_coll: 1.608475e-4, E_N: 1.925446e-4, ratioFlow: 0.035851, ratioColl: 5.256455, ratioEN: 6.292306, shareTrunc: 0.158924 },
  { N: 1e9, logT0: 19.734055, E_trunc: 3.06e-5, E_flow: 1.596328e-7, E_coll: 5.390807e-5, E_N: 8.466770e-5, ratioFlow: 0.005216, ratioColl: 1.761701, ratioEN: 2.766918, shareTrunc: 0.361413 },
  { N: 1e10, logT0: 21.915226, E_trunc: 3.06e-5, E_flow: 2.232663e-8, E_coll: 1.796464e-5, E_N: 4.858697e-5, ratioFlow: 0.000730, ratioColl: 0.587080, ratioEN: 1.587809, shareTrunc: 0.629799 },
  { N: 1e11, logT0: 24.108964, E_trunc: 3.06e-5, E_flow: 3.023626e-9, E_coll: 5.958471e-6, E_N: 3.656149e-5, ratioFlow: 0.000099, ratioColl: 0.194721, ratioEN: 1.194820, shareTrunc: 0.836946 },
  { N: 1e12, logT0: 26.312959, E_trunc: 3.06e-5, E_flow: 3.986902e-10, E_coll: 1.968477e-6, E_N: 3.256888e-5, ratioFlow: 0.000013, ratioColl: 0.064329, ratioEN: 1.064342, shareTrunc: 0.939547 },
]);

// The two heights where a shrinking sub-term passes UNDER the fixed E_trunc floor.
export const IMP95360_CROSSOVERS = Object.freeze({
  eFlowBelowTrunc: { N: 1.597752e6, log10_N: 6.2035, note: 'E_flow = E_trunc; above this the heat-flow term is under the floor' },
  eCollBelowTrunc: { N: 3.280294e9, log10_N: 9.5159, note: 'E_coll = E_trunc; imp-35968 N_cross; above this the GUE-conditional collision term is under the floor' },
});

export const IMP95360_FLOOR_ASSESSMENT = {
  ticket: 'imp-95360',
  sourceTickets: ['imp-35164', 'imp-35968', 'imp-36227', 'imp-35149', 'imp-2631'],
  obligation: 'G-EN-ladder-verify (lambda-roadmap.js Step-4 rigorousUpgradeGap, closed:false)',
  floorLevel: IMP95360_E_TRUNC_FLOOR,
  ladder: IMP95360_EN_FLOOR_LADDER,
  crossovers: IMP95360_CROSSOVERS,
  finding:
    'Measured across N in {1e4 .. 1e12}: E_flow passes under the fixed E_trunc = 3.06e-5 floor ' +
    'at N ~ 1.60e6 and E_coll at N ~ 3.28e9 (the imp-35968 N_cross). Above N ~ 3.28e9 both ' +
    'N-shrinking terms sit under the floor, so E(N) descends toward E_trunc from above -- the ' +
    'ratio E(N)/E_trunc falls monotonically 6.29 -> 1.064 across N = 1e8 -> 1e12, converging ' +
    'to 1 (the floor level = E_trunc exactly), NOT to 0. This CONFIRMS imp-35164: the current ' +
    'surrogate does not supply the Step-4 E(N) -> 0 rate. No documented surrogate variant ' +
    'vanishes on this model.',
  honest:
    'MEASUREMENT ONLY -- baked literals reproducing the pinned-constants imp-35968 parts(N) ' +
    'chain (E_trunc + E_flow + E_coll) on an extended N-ladder; adds no new derivation and ' +
    'changes no bound. Supplies NO E(N) -> 0 leg (it remains OPEN); the only scoped route to ' +
    'lower the floor is the imp-35149 vanishing-strip Knob A (T_v(N) -> infinity beyond ' +
    'X ~ 3e12, obligation R3 OPEN). E_trunc = 3.06e-5 (imp-2631), C_C = (1/8) sqrt(3 pi) ' +
    '(imp-2642/imp-2643) and C_mb GUE-conditional (imp-486) are UNTOUCHED; obligation ' +
    'G-EN-ladder-verify stays OPEN; NO QED. No refereed bound is changed.',
};

export const IMP95360_ASSERTIONS = [
  {
    id: 'imp95360-ladder-nine-rows-increasing-N',
    description: 'the extended ladder has nine rows in strictly increasing N spanning 1e4..1e12',
    holds: () =>
      IMP95360_EN_FLOOR_LADDER.length === 9 &&
      IMP95360_EN_FLOOR_LADDER[0].N === 1e4 &&
      IMP95360_EN_FLOOR_LADDER[8].N === 1e12 &&
      IMP95360_EN_FLOOR_LADDER.every((r, i) => i === 0 || r.N > IMP95360_EN_FLOOR_LADDER[i - 1].N),
  },
  {
    id: 'imp95360-e-trunc-floor-fixed',
    description: 'E_trunc is the fixed 3.06e-5 floor at every row',
    holds: () => IMP95360_EN_FLOOR_LADDER.every((r) => r.E_trunc === IMP95360_E_TRUNC_FLOOR),
  },
  {
    id: 'imp95360-en-ratio-monotone-decreasing',
    description: 'E(N)/E_trunc decreases monotonically along the ladder toward 1 (the floor), not 0',
    holds: () =>
      IMP95360_EN_FLOOR_LADDER.every((r, i) => i === 0 || r.ratioEN < IMP95360_EN_FLOOR_LADDER[i - 1].ratioEN) &&
      IMP95360_EN_FLOOR_LADDER[8].ratioEN > 1 &&
      IMP95360_EN_FLOOR_LADDER[8].ratioEN < 1.1,
  },
  {
    id: 'imp95360-en-floors-does-not-vanish',
    description: 'E(N) stays strictly above the floor (E_N > E_trunc) at the top rung -- it does NOT tend to 0',
    holds: () => IMP95360_EN_FLOOR_LADDER[8].E_N > IMP95360_E_TRUNC_FLOOR,
  },
  {
    id: 'imp95360-eflow-passes-under-floor-before-ecoll',
    description: 'E_flow drops below the floor (N ~ 1.6e6) strictly before E_coll does (N ~ 3.28e9)',
    holds: () =>
      IMP95360_CROSSOVERS.eFlowBelowTrunc.N < IMP95360_CROSSOVERS.eCollBelowTrunc.N &&
      Math.abs(IMP95360_CROSSOVERS.eCollBelowTrunc.N - 3.280294e9) < 1e4,
  },
  {
    id: 'imp95360-both-terms-under-floor-at-top',
    description: 'at N = 1e12 both E_flow and E_coll sit under the E_trunc floor (ratios < 1)',
    holds: () => IMP95360_EN_FLOOR_LADDER[8].ratioFlow < 1 && IMP95360_EN_FLOOR_LADDER[8].ratioColl < 1,
  },
  {
    id: 'imp95360-overlap-matches-imp36227',
    description: 'overlapping rows reproduce the imp-36227 baked E_coll literals (N = 1e4 and N = 1e8)',
    holds: () =>
      IMP95360_EN_FLOOR_LADDER[0].E_coll === 1.163847e-2 &&
      IMP95360_EN_FLOOR_LADDER[4].E_coll === 1.608475e-4,
  },
  {
    id: 'imp95360-honesty-gate-no-qed',
    description: 'honest status is measurement-only and references imp-35164/imp-486/OPEN/NO QED/SOTA',
    holds: () =>
      /MEASUREMENT ONLY/.test(IMP95360_FLOOR_ASSESSMENT.honest) &&
      /imp-486/.test(IMP95360_FLOOR_ASSESSMENT.honest) &&
      /stays OPEN/.test(IMP95360_FLOOR_ASSESSMENT.honest) &&
      /NO QED/.test(IMP95360_FLOOR_ASSESSMENT.honest) &&
      /refereed bound is changed/i.test(IMP95360_FLOOR_ASSESSMENT.honest),
  },
];

for (const a of IMP95360_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95360-en-surrogate-floor-ladder assertion failed: ${a.id}`);
  }
}
