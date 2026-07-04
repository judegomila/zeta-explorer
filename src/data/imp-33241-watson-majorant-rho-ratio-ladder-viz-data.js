/**
 * @module imp-33241-watson-majorant-rho-ratio-ladder-viz-data
 *
 * imp-33241 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-33208 Watson-majorant rhoRatio ladder. rhoRatio(tau) = rho(tau) / e^{-4 tau}
 * is measured directly against the imp-3850/imp-3873 reconciled -ln A(tau) ladder
 * across tau in {1.5, 2, 2.5, 3, 3.5, 4, 5, 6}. On the RELIABILITY WINDOW
 * tau in [1.5, 3.5] it climbs monotonically toward the pinned K_lead = -3.412
 * (imp-3892), stays strictly inside the K0 = 3.46 majorant envelope, and tracks
 * the closed two-term model K_lead + K6 e^{-2 tau}. Beyond tau ~ 3.5 the direct
 * reconstruction falls below the imp-3730 additive cancellation floor
 * (sg-33208-high-tau-cancellation-floor) and the apparent |rhoRatio| > K0 there
 * is a known floor artifact, not a majorant violation.
 *
 * Reference literals are baked from the imp-33208 measured grid -- no
 * re-derivation here.
 *
 * @see imp-33208-watson-majorant-numerical-verification.js (source module: MEASUREMENTS)
 * @see imp-3892-watson-majorant-constant.js (pinned K0, K_lead, K6)
 *
 * Ticket: imp-33241 (ux, low). Presentation only, RH-free; operator positivity
 * (imp-3066 K_a >= 0) untouched; NO QED.
 */

export const IMP33241_K0 = 3.46; // imp-3892 certified majorant on |rho(tau) e^{4 tau}|
export const IMP33241_K_LEAD = -3.4120570431; // imp-3892 closed leading coefficient

export const IMP33241_RELIABILITY_GRID = [
  { tau: 1.5, rhoRatio: -3.305369646255466, modelRatio: -3.3071755021801645, floorNoise: 7.133517801737904e-10 },
  { tau: 2.0, rhoRatio: -3.3732179843114305, modelRatio: -3.3734732804414715, floorNoise: 3.894768752033915e-8 },
  { tau: 2.5, rhoRatio: -3.397827322853755, modelRatio: -3.3978628700591496, floorNoise: 0.000002126471686679496 },
  { tau: 3.0, rhoRatio: -3.4068664563494875, modelRatio: -3.4068352986581014, floorNoise: 0.00011610142019056041 },
  { tau: 3.5, rhoRatio: -3.4060277021756487, modelRatio: -3.4101360706770345, floorNoise: 0.00633892275862534 },
];

export const IMP33241_SWAMPED_GRID = [
  { tau: 4.0, rhoRatio: -3.531211255752523, modelRatio: -3.411350356842794, floorNoise: 0.34609345582393886 },
  { tau: 5.0, rhoRatio: -389.03584111947, modelRatio: -3.4119614035210493, floorNoise: 1031.690051401244 },
  { tau: 6.0, rhoRatio: -2307494.756781694, modelRatio: -3.4120440996963217, floorNoise: 3075424.6988760293 },
];

export const IMP33241_ALL_GRID = [...IMP33241_RELIABILITY_GRID, ...IMP33241_SWAMPED_GRID];
