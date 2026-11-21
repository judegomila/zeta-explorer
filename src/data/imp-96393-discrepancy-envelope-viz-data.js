/**
 * @module imp-96393-discrepancy-envelope-viz-data
 *
 * imp-96393 (ux): import-light viz-data leaf for the imp-96371 U-shaped out-of-family
 * exact-vs-asymptotic number-variance discrepancy |rho_exact - rho_asymp| across the imp-96267
 * decade ladder of heights T = {1e4..1e12, 3e12}. imp-96371 found the discrepancy is NOT a flat
 * ~1e-10 (the imp-96350 PT-anchor-only reading) but U-shaped in log T: worst (1.47e-7) at the
 * smallest height T=1e4, falling to a roundoff-limited floor (~3.23e-13) near T=1e8-1e9, then
 * rising back to the imp-96350 PT-anchor value (2.52e-10) at T=3e12 -- but shipped only baked
 * ladder rows, no chart.
 *
 * Reshapes the imp-96371 baked ladder (ten rows, T in [1e4,3e12]) plus the worst/floor/PT-anchor
 * landmarks into chart-ready series (discrepancy vs log10 T, log10 discrepancy vs log10 T). No
 * re-derivation: every plotted value is copied verbatim from
 * IMP96371_COVARIANCE_EXACT_VS_ASYMPTOTIC_DECADE_LADDER.
 *
 * MEASUREMENT / PRESENTATION ONLY. rho is the theoretical GUE (sine-kernel, universality)
 * two-interval correlation for boxes of unfolded length L(T); at these heights (and at 3e12)
 * there are no computed Riemann zeros. Changes no bound; establishes no operator positivity;
 * RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96371-covariance-exact-vs-asymptotic-decade-ladder.js (ladder, shape, honest caveat this reshapes)
 * @see imp-96350-covariance-outoffamily-crossvalidation (the PT-anchor-only reading this extends)
 *
 * Ticket: imp-96393 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no bound; NO QED.
 * No self-executing assertion throw (per the imp-96294 convention) -- values are validated below
 * via a plain exported check object instead of an import-time throw.
 */

import { IMP96371_COVARIANCE_EXACT_VS_ASYMPTOTIC_DECADE_LADDER } from './imp-96371-covariance-exact-vs-asymptotic-decade-ladder.js';

const LADDER = IMP96371_COVARIANCE_EXACT_VS_ASYMPTOTIC_DECADE_LADDER.ladder;
const SHAPE = IMP96371_COVARIANCE_EXACT_VS_ASYMPTOTIC_DECADE_LADDER.shape;

// Ten baked ladder rows, reshaped for direct plotting against log10 T.
export const IMP96393_DISCREPANCY_SERIES = LADDER.map((row) => ({
  log10T: Math.log10(row.T),
  discrepancy: row.discrepancy,
  log10Discrepancy: Math.log10(row.discrepancy),
  isPlattTrudgianAnchor: row.T === 3e12,
}));

// Worst / floor / PT-anchor landmark annotations (copied verbatim from imp-96371 shape).
export const IMP96393_LANDMARKS = Object.freeze({
  worst: { log10T: Math.log10(SHAPE.worst.T), T: SHAPE.worst.T, discrepancy: SHAPE.worst.discrepancy },
  floor: { log10T: Math.log10(SHAPE.floor.T), T: SHAPE.floor.T, discrepancy: SHAPE.floor.discrepancy },
  ptAnchor: { log10T: Math.log10(SHAPE.ptAnchor.T), T: SHAPE.ptAnchor.T, discrepancy: SHAPE.ptAnchor.discrepancy },
  ratioWorstToPt: SHAPE.ratioWorstToPt,
});

export const IMP96393_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every discrepancy reading '
  + 'is copied verbatim from the imp-96371 baked decade ladder; only the chart-axis reshaping '
  + '(log10 T, log10 discrepancy) is computed here (no re-derivation, no new discrepancy '
  + 'measurement). rho is the theoretical GUE (sine-kernel, universality) two-interval '
  + 'correlation for boxes of unfolded length L(T); at these heights (and at 3e12) there are no '
  + 'computed Riemann zeros, so this cross-validates two closed-form evaluations of the same '
  + 'envelope, not a measurement of actual zeros; no bound changes, no operator positivity '
  + 'established.';

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP96393_VALIDATION = Object.freeze({
  seriesLengthMatchesLadder: IMP96393_DISCREPANCY_SERIES.length === LADDER.length,
  isUShapedInLogT:
    IMP96393_LANDMARKS.worst.log10T < IMP96393_LANDMARKS.floor.log10T
    && IMP96393_LANDMARKS.floor.log10T < IMP96393_LANDMARKS.ptAnchor.log10T,
  worstNearImp96371Landmark: Math.abs(IMP96393_LANDMARKS.worst.discrepancy / 1.47e-7 - 1) < 1e-2,
  ptAnchorNearImp96350Landmark: Math.abs(IMP96393_LANDMARKS.ptAnchor.discrepancy / 2.52e-10 - 1) < 1e-2,
});
