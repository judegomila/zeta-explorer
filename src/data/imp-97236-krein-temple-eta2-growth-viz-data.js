/**
 * @module imp-97236-krein-temple-eta2-growth-viz-data
 * @fileoverview imp-97236 -- VIZ DATA ONLY. Bakes the imp-97162 tail-inclusive Temple defect eta2
 *   growth ladder (Nbig=120..300: 5.84e8..2.42e9, mu=0.53384576, T=800, 2a=ln3) alongside the
 *   required-separation beta bars a positive Temple bound mu - eta2/(beta-mu) would need to clear
 *   tau=0 (~4.54e9) and tau=0.5 (~7.16e10), against the admissible lambda_2 Ritz UPPER estimate,
 *   which is only O(1) (and even goes spuriously negative). Values are copied literals from
 *   imp-97162's committed measurement -- this module does NOT recompute the Temple quotient or the
 *   Gegenbauer-Galerkin build. Pure frozen-object data, no imports, no self-executing assertions of
 *   its own, per the [[storage_precision_assertion_tolerance]] and [[no_heavy_imports_in_pages]]
 *   conventions -- needs no separate DATA_MODULES registration.
 *
 *   @see imp-97162-krein-temple-defect-eta2-measurement.js (the measurement this bakes; Findings 2-3)
 *   @see imp-97136-krein-temple-lower-bound-feasibility.js (route (A) feasibility this sharpens)
 *
 *   Ticket: imp-97236 (ux, low). Presentation of an already-established measurement; adds no new
 *   Lambda bound. Reach stays 2a<=0.96. RH open. NO QED.
 */

// -- baked from imp-97162 Finding 2: eta2 growing monotonically with the evaluation space Nbig --
export const IMP97236_ETA2_LADDER = Object.freeze([
  Object.freeze({ Nbig: 120, eta2: 5.837280314e8 }),
  Object.freeze({ Nbig: 140, eta2: 1.176191504e9 }),
  Object.freeze({ Nbig: 160, eta2: 1.606799705e9 }),
  Object.freeze({ Nbig: 180, eta2: 1.811504408e9 }),
  Object.freeze({ Nbig: 220, eta2: 2.126517948e9 }),
  Object.freeze({ Nbig: 260, eta2: 2.304102808e9 }),
  Object.freeze({ Nbig: 300, eta2: 2.424503981e9 }),
]);

// -- baked from imp-97162 Finding 3: required beta = mu + eta2/(mu-tau) for a few target floors tau --
export const IMP97236_REQUIRED_BETA_BARS = Object.freeze([
  Object.freeze({ targetFloor: 0.0, requiredBeta: 4.541581374e9, label: 'bar for mere positivity' }),
  Object.freeze({ targetFloor: 0.25, requiredBeta: 8.541624656e9, label: 'bar for tau=0.25' }),
  Object.freeze({ targetFloor: 0.5, requiredBeta: 7.163389612e10, label: 'bar for the 0.5 uniform-N target' }),
]);

export const IMP97236_SUMMARY = Object.freeze({
  mu: 0.5338457645363593,          // committed Ritz floor (Gegenbauer build, N=100, T=800, 2a=ln3)
  T: 800,
  binding2a: 'ln3',
  admissibleLambda2IsOnlyOrderOne: true, // wrong-direction Ritz UPPER estimate drifts ~67,55,41,3, even negative
  requiredBetaBeyondAnyAdmissibleLambda2: true,
  eta2GrowsMonotonicallyNoFiniteLimitReached: true,
});

export default Object.freeze({
  id: 'imp-97236-krein-temple-eta2-growth-viz-data',
  ticket: 'imp-97236',
  source: 'imp-97162-krein-temple-defect-eta2-measurement.js',
  eta2Ladder: IMP97236_ETA2_LADDER,
  requiredBetaBars: IMP97236_REQUIRED_BETA_BARS,
  summary: IMP97236_SUMMARY,
  intervalRigorousReach: 0.96,
});
