/**
 * @module imp-96439-three-basis-rho-crossvalidation-viz-data
 *
 * imp-96439 (ux): import-light viz-data leaf for the imp-96389 three-basis GUE two-interval
 * correlation rho cross-validation table (L = 30/60/120/240/480). imp-96389 assembled the exact
 * Dyson-Mehta number variance (basis A), the asymptotic module (basis B) and the direct
 * pair-correlation double integral (basis C) into one per-L table with pairwise agreements and
 * per-basis roundoff floors, but shipped only the baked table, no chart.
 *
 * Reshapes the imp-96389 baked table into two chart-ready series: rho from all three bases vs
 * log10 L (showing the three curves overlap to >= 6 figures while drifting toward the -0.5
 * rigidity limit), and the three pairwise log10 agreements plus the basis-C roundoff floor vs
 * log10 L (showing |A-B| shrink while the basis-C floor grows -- the two distinct disagreement
 * mechanisms imp-96389 identified). No re-derivation: every plotted value is copied verbatim from
 * IMP96389_THREE_BASIS_RHO_CROSSVALIDATION_TABLE.
 *
 * MEASUREMENT / PRESENTATION ONLY. rho is the theoretical GUE (sine-kernel, universality)
 * two-interval correlation for boxes of unfolded length L; these are theoretical envelope values
 * with no computed Riemann zeros behind them. Changes no bound; establishes no operator
 * positivity; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96389-three-basis-rho-crossvalidation-table.js (the table this reshapes)
 *
 * Ticket: imp-96439 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 * No self-executing assertion throw (per the imp-96294 convention) -- values are validated below
 * via a plain exported check object instead of an import-time throw.
 */

import { IMP96389_THREE_BASIS_RHO_CROSSVALIDATION_TABLE } from './imp-96389-three-basis-rho-crossvalidation-table.js';

const TABLE = IMP96389_THREE_BASIS_RHO_CROSSVALIDATION_TABLE.table;

// Five baked table rows, reshaped for plotting rho (all three bases) against log10 L.
export const IMP96439_RHO_SERIES = TABLE.map((row) => ({
  L: row.L,
  log10L: Math.log10(row.L),
  rhoExact: row.rhoExact,
  rhoAsymp: row.rhoAsymp,
  rhoDirect: row.rhoDirect,
}));

// Five baked table rows, reshaped for plotting the pairwise agreements and the basis-C roundoff
// floor (all log10, since they span many orders of magnitude) against log10 L.
export const IMP96439_AGREEMENT_SERIES = TABLE.map((row) => ({
  L: row.L,
  log10L: Math.log10(row.L),
  log10AgreeAB: Math.log10(row.agreeAB),
  log10AgreeAC: Math.log10(row.agreeAC),
  log10AgreeBC: Math.log10(row.agreeBC),
  log10DirectFloor: Math.log10(row.directFloor),
}));

// Worst-pairwise-gap and roundoff-floor landmarks (copied verbatim from imp-96389).
export const IMP96439_LANDMARKS = Object.freeze({
  worstPairwiseGap: IMP96389_THREE_BASIS_RHO_CROSSVALIDATION_TABLE.agreement.worstPairwiseGap,
  binding: IMP96389_THREE_BASIS_RHO_CROSSVALIDATION_TABLE.roundoffFloors.binding,
});

export const IMP96439_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every rho, agreement and '
  + 'roundoff-floor reading is copied verbatim from the imp-96389 baked three-basis table; only '
  + 'the chart-axis reshaping (log10 L, log10 agreement) is computed here (no re-derivation, no '
  + 'new rho or floor measurement). rho is the theoretical GUE (sine-kernel, universality) '
  + 'two-interval correlation for boxes of unfolded length L; these are theoretical envelope '
  + 'values with no computed Riemann zeros behind them, so this cross-validates three closed-form '
  + '/ quadrature evaluations of the same envelope, not a measurement of actual zeros; no bound '
  + 'changes, no operator positivity established.';

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP96439_VALIDATION = Object.freeze({
  rhoSeriesLengthMatchesTable: IMP96439_RHO_SERIES.length === TABLE.length,
  agreementSeriesLengthMatchesTable: IMP96439_AGREEMENT_SERIES.length === TABLE.length,
  agreeABShrinksWithL:
    IMP96439_AGREEMENT_SERIES[IMP96439_AGREEMENT_SERIES.length - 1].log10AgreeAB
    < IMP96439_AGREEMENT_SERIES[0].log10AgreeAB,
  directFloorGrowsWithL:
    IMP96439_AGREEMENT_SERIES[IMP96439_AGREEMENT_SERIES.length - 1].log10DirectFloor
    > IMP96439_AGREEMENT_SERIES[0].log10DirectFloor,
  worstGapNearImp96389Landmark:
    Math.abs(IMP96439_LANDMARKS.worstPairwiseGap.agreeAB / 1.76e-6 - 1) < 1e-1,
});
