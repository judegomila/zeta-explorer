/**
 * @module imp-3655-flow-gap-residual-ladder-viz-data
 *
 * imp-3655 (ux): lightweight, import-light viz-data module for a chart of the imp-3617
 * self-consistent O(eps^3) flow-gap residual ladder across the imp-3443 half-to-double
 * E_trunc floor grid f in {0.5, 0.75, 1.0, 1.5, 2.0}.
 *
 * Reference literals are baked from the imp-3617 module's measured floorGrid (no heavy
 * re-computation, no re-derivation): at each floor f, the residual between the root-solved
 * gap and four successive approximations --
 *   resid_imp3599 : the imp-3599 crude O(eps^2) model 2 eps(1+lambda) - (4 mu+4 lambda+3) eps^2
 *   resid_lead    : the imp-3617 resummed leading term -d1 eps = 2 eps/(1-lambda)
 *   resid_order2  : the imp-3617 self-consistent O(eps^2) truncation (first uses curvature s, nu)
 *   resid_order3  : the imp-3617 self-consistent O(eps^3) truncation (adds the third derivative t)
 * -- falls geometrically toward the ~1e-13 exact-identity floor (imp-3599's closed identity
 * gap = 1 - (L_half/L_x)/(1+eta)^2, which reproduces the root-solved gap to that precision).
 *
 * @see imp-3617-flow-gap-thirdorder-expansion (source module: floorGrid, resid_*_pp fields)
 * @see imp-3599-flow-gap-nextorder-correction (the crude O(eps^2) model being improved on)
 * @see imp-3443-nmax-etrunc-sensitivity (the half-to-double E_trunc floor grid 0.5x..2x)
 */

// Baked from imp-3617's floorGrid[*].resid_imp3599_pp / resid_lead_pp / resid_order2_pp / resid_order3_pp.
export const IMP3655_RESIDUAL_LADDER = [
  { factor: 0.5, resid_imp3599: 4.49e-4, resid_lead: 6.54e-5, resid_order2: 1.38e-7, resid_order3: 3.13e-10 },
  { factor: 0.75, resid_imp3599: 6.83e-4, resid_lead: 1.21e-4, resid_order2: 3.54e-7, resid_order3: 1.25e-9 },
  { factor: 1.0, resid_imp3599: 9.22e-4, resid_lead: 1.86e-4, resid_order2: 6.85e-7, resid_order3: 2.81e-9 },
  { factor: 1.5, resid_imp3599: 1.41e-3, resid_lead: 3.37e-4, resid_order2: 1.71e-6, resid_order3: 9.04e-9 },
  { factor: 2.0, resid_imp3599: 1.92e-3, resid_lead: 5.11e-4, resid_order2: 3.26e-6, resid_order3: 2.29e-8 },
];

export const IMP3655_EXACT_IDENTITY_FLOOR = 1e-13; // imp-3599 closed-identity vs root-solve, ~1e-13
export const IMP3655_MIN_SHRINK_VS_IMP3599 = 8.38e4; // worst-floor factor (f=2.0): 1.92e-3/2.29e-8 pp/pp
