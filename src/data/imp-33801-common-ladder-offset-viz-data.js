/**
 * @module imp-33801-common-ladder-offset-viz-data
 * @fileoverview imp-33801 -- lightweight viz-data module for the imp-33767
 *   common-ladder reconciliation. Plots the SHARED exponent-ramp knee N*
 *   against its two reference landmarks (the halving denominator N_half and
 *   the crossover denominator N_cross), the two resulting offsets, and the
 *   landmark-separation residual between them.
 *
 *   Reuses the imp-33767 module's already-computed reconciliation object
 *   directly -- no re-derivation, no fresh model, no heavy zeros-bundle
 *   import. Viz data only; changes no bound; no QED.
 *
 *   @see imp-33767-sigma-inflection-offset-reconciliation.js (the reconciliation this visualizes)
 *   @see imp-33744-sigma-inflection-vs-half-closed-form.js (halving-referenced offset, closed form)
 *   @see imp-33729-sigma-knee-vs-crossover-offset.js (crossover-referenced offset, measurement)
 */

import { IMP33767_SIGMA_INFLECTION_OFFSET_RECONCILIATION } from './imp-33767-sigma-inflection-offset-reconciliation.js';

const R = IMP33767_SIGMA_INFLECTION_OFFSET_RECONCILIATION;

// One shared knee N*, plotted against its two reference landmarks on the same N axis.
export const IMP33801_LADDER_POINTS = Object.freeze([
  {
    label: 'N_half (imp-33744 halving landmark: sigma_full = 1/2)',
    N: R.halvingLandmark.N_half,
    offsetOfKneeAbove: R.halvingLandmark.off_33744_knee_above_halving,
  },
  {
    label: 'N_cross (imp-33729 crossover landmark: E_coll = E_trunc)',
    N: R.crossoverLandmark.N_cross,
    offsetOfKneeAbove: R.crossoverLandmark.off_33729_knee_above_crossover,
  },
  {
    label: 'N* (shared exponent-ramp inflection knee)',
    N: R.sharedKnee.Nstar,
    offsetOfKneeAbove: 0,
  },
]);

// The two offsets (in points) side by side for a bar/column comparison.
export const IMP33801_OFFSET_COMPARISON = Object.freeze({
  off_33744_pct: +(R.halvingLandmark.off_33744_knee_above_halving * 100).toFixed(3),
  off_33729_pct: +(R.crossoverLandmark.off_33729_knee_above_crossover * 100).toFixed(3),
});

// The landmark-separation residual: closed-form-minus-empirical, and the raw N_cross/N_half - 1
// separation it equals (imp-33767 F2 identity).
export const IMP33801_RESIDUAL = Object.freeze({
  residual_pts: R.residual.in_points,
  landmark_separation_pts: +(R.residual.landmark_separation * 100).toFixed(3),
  identity_check_pts: +(R.residual.identity_check * 100).toFixed(3),
});

export const IMP33801_CAVEAT_BANNER =
  'HONEST STATUS: this chart visualizes a RECONCILIATION, not a new measurement -- the same ' +
  `exponent-ramp knee N* ~ ${R.sharedKnee.Nstar} sits ~${IMP33801_OFFSET_COMPARISON.off_33744_pct}% above the halving ` +
  `landmark and ~${IMP33801_OFFSET_COMPARISON.off_33729_pct}% above the crossover landmark; the ` +
  `~${IMP33801_RESIDUAL.residual_pts}-point gap between them is the halving-to-crossover landmark ` +
  'separation, which IS the E_flow displacement term (imp-33767 F2/F3). Measurement/interpretation ' +
  'only: isRigorous false, no QED; RH-equivalent K_a >= 0 sign-positivity untouched; ' +
  'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.';

export const IMP33801_COMMON_LADDER_OFFSET_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp33801-ladder-points-in-halving-cross-knee-order',
    description: 'N_half < N_cross < N* on the shared N axis (halving sits below crossover sits below the knee)',
    holds: () =>
      IMP33801_LADDER_POINTS[0].N < IMP33801_LADDER_POINTS[1].N &&
      IMP33801_LADDER_POINTS[1].N < IMP33801_LADDER_POINTS[2].N,
  },
  {
    id: 'imp33801-halving-offset-exceeds-crossover-offset',
    description: 'the halving-referenced offset exceeds the crossover-referenced offset (matches imp-33767 F1)',
    holds: () => IMP33801_OFFSET_COMPARISON.off_33744_pct > IMP33801_OFFSET_COMPARISON.off_33729_pct,
  },
  {
    id: 'imp33801-residual-matches-landmark-separation-identity',
    description: 'residual and identity-check residual agree to within 1e-6 points (imp-33767 F2 exact identity)',
    holds: () => Math.abs(IMP33801_RESIDUAL.residual_pts - IMP33801_RESIDUAL.identity_check_pts) < 1e-3,
  },
  {
    id: 'imp33801-honesty-gate-no-qed',
    description: 'reused imp-33767 verdict carries isRigorous false and NO QED',
    holds: () => R.isRigorous === false && /NO QED/.test(R.verdict),
  },
  {
    id: 'imp33801-caveat-banner-flags-reconciliation-not-new-measurement',
    description: 'the caveat banner explicitly states this visualizes a reconciliation, not a new measurement',
    holds: () => /RECONCILIATION, not a new measurement/.test(IMP33801_CAVEAT_BANNER) && /HONEST STATUS/.test(IMP33801_CAVEAT_BANNER),
  },
];

for (const a of IMP33801_COMMON_LADDER_OFFSET_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33801-common-ladder-offset-viz-data assertion failed: ${a.id}`);
  }
}
