/**
 * @module imp-33550-max-bj-realised-elasticity-viz-data
 * @fileoverview imp-33550 -- lightweight, import-light literal data for a
 *   per-plateau scatter of sup_j B_j (= max_j P_j/D_j, the imp-33250 residual
 *   dg2) across the 10 imp-3725 plateaus of N in [1e4,1e6], reproduced exactly
 *   from src/data/imp-33309-max-bj-growth-fit.js so this page does not need to
 *   import that module's live OLS-fit machinery.
 *
 *   @see imp-33309-max-bj-growth-fit.js (source measurement + fit; global max
 *     6.4537 at plateau 5, endN~95248, NOT the endpoint; every candidate fit
 *     poor, R^2 <= 0.40; obstruction OPEN both ways)
 *   @see imp-33250-tail-weight-ratio-n-uniformity-assessment.js (the dg2
 *     residual that sup_{N,j} B_j equals)
 *
 *   Ticket: imp-33550 (ux, low). Presentation only, RH-equivalent; imp-3066
 *   untouched; Platt-Trudgian Lambda <= 0.2 stays SOTA; NO QED.
 */

// max_j B_j (= max_j P_j/D_j) per imp-3725 plateau (thetaBar=0.99) of
// [1e4,1e6], reproduced from imp-33309-max-bj-growth-fit.js ROWS.
export const IMP33550_ROWS = Object.freeze([
  { plateauIndex: 0, endN: 18859, maxBj: 2.0959 },
  { plateauIndex: 1, endN: 44555, maxBj: 2.1965 },
  { plateauIndex: 2, endN: 73997, maxBj: 2.7439 },
  { plateauIndex: 3, endN: 82552, maxBj: 4.6691 },
  { plateauIndex: 4, endN: 87761, maxBj: 2.7013 },
  { plateauIndex: 5, endN: 95248, maxBj: 6.4537 },
  { plateauIndex: 6, endN: 354769, maxBj: 3.7228 },
  { plateauIndex: 7, endN: 415587, maxBj: 4.1845 },
  { plateauIndex: 8, endN: 420891, maxBj: 4.0866 },
  { plateauIndex: 9, endN: 1000000, maxBj: 4.9938 },
].map(Object.freeze));

// The global maximum: interior plateau 5, NOT the N=1e6 endpoint.
export const IMP33550_GLOBAL_MAX = Object.freeze({
  plateauIndex: 5,
  endN: 95248,
  maxBj: 6.4537,
});

// The endpoint plateau (N=1e6), which sits BELOW the interior peak -- the
// decisive non-monotone fact that rules out a clean growth law.
export const IMP33550_ENDPOINT = Object.freeze({
  plateauIndex: 9,
  endN: 1000000,
  maxBj: 4.9938,
});

// Best of the four imp-33309 candidate fits (power law, log-log OLS), still poor.
export const IMP33550_BEST_FIT = Object.freeze({
  label: 'power law (log-log OLS)',
  exponent: 0.1904,
  r2: 0.3951,
});
