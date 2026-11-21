/**
 * @module imp-33782-residual-contrast-viz-data
 * @fileoverview imp-33782 -- lightweight viz-data module for the imp-33743
 *   residual-contrast finding: the closed-form-vs-empirical crossover residual
 *   at the sigma = 1/2 halving landmark (imp-33723, ~3.98e-3) is ~54x LARGER
 *   than the residual at the sigma < 0.1 far-tail landmark (imp-33743,
 *   ~7.38e-5). Packages the two landmarks as a two-point log/log series
 *   (N_cross vs relative residual) plus the tightening ratio, ready for a
 *   log-axis chart.
 *
 *   Self-computing from the already-pinned imp-33723/imp-33743 result
 *   objects -- no heavy zeros-bundle import, no fresh model, no
 *   re-derivation. Viz data only; changes no bound; no QED.
 *
 *   @see imp-33723-sigma-half-vs-crossover-closed-form.js (halving-landmark closed form, thr = 1/2)
 *   @see imp-33743-sigma-fartail-crossover-closed-form.js (far-tail closed form, thr = 0.1, the ~54x contrast)
 */

import { IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM } from './imp-33723-sigma-half-vs-crossover-closed-form.js';
import { IMP33743_SIGMA_FARTAIL_CROSSOVER_CLOSED_FORM } from './imp-33743-sigma-fartail-crossover-closed-form.js';

// The two landmark points: (N_cross, relative residual), log-axis ready.
export const IMP33782_RESIDUAL_CONTRAST_SERIES = Object.freeze([
  {
    landmark: 'halving (sigma = 1/2)',
    threshold: 0.5,
    N_cross: IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.landmarks.N_cross_closed_form,
    relResidual: IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.offsetAttribution.measured_rel_offset_from_closed_form,
  },
  {
    landmark: 'far-tail (sigma < 0.1)',
    threshold: IMP33743_SIGMA_FARTAIL_CROSSOVER_CLOSED_FORM.landmarks.threshold,
    N_cross: IMP33743_SIGMA_FARTAIL_CROSSOVER_CLOSED_FORM.landmarks.N_cross_closed_form,
    relResidual: IMP33743_SIGMA_FARTAIL_CROSSOVER_CLOSED_FORM.residualContrast.fartail_rel_offset_from_closed_form,
  },
]);

// The headline tightening ratio (halving residual / far-tail residual), reused directly.
export const IMP33782_TIGHTENING_RATIO = IMP33743_SIGMA_FARTAIL_CROSSOVER_CLOSED_FORM.residualContrast.fartail_is_tighter_by;

// Recomputed independently from the series above, as a cross-check on the reused ratio.
const [HALVING_POINT, FARTAIL_POINT] = IMP33782_RESIDUAL_CONTRAST_SERIES;
export const IMP33782_TIGHTENING_RATIO_RECOMPUTED = +(HALVING_POINT.relResidual / FARTAIL_POINT.relResidual).toFixed(2);

export const IMP33782_ATTRIBUTION =
  'Both residuals are the same dropped Gronwall E_flow term, evaluated at different N: ' +
  'E_flow ~ log T0 / T0 decays down the tail, so E_flow/E_trunc falls from ~1.91e-3 at the ' +
  'halving landmark (N ~3.28e9) to ~3.55e-5 at the far-tail landmark (N ~3.21e11), the same ' +
  '~54x drop that shows up as the residual-tightening ratio.';

export const IMP33782_CAVEAT_BANNER =
  'HONEST STATUS: this is a residual-CONTRAST reading, not a new bound. The closed-form crossover ' +
  `sits ${(HALVING_POINT.relResidual * 100).toFixed(2)}% above the empirical halving landmark but only ` +
  `${(FARTAIL_POINT.relResidual * 100).toFixed(4)}% above the empirical far-tail landmark -- a ` +
  `~${IMP33782_TIGHTENING_RATIO}x tightening explained entirely by the dropped E_flow term shrinking ` +
  'down the tail. Derivation only: isRigorous false, no QED; RH-equivalent K_a >= 0 sign-positivity ' +
  'untouched; no refereed bound is changed.';

export const IMP33782_RESIDUAL_CONTRAST_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp33782-series-has-two-landmarks',
    description: 'the series carries exactly the halving and far-tail landmark points',
    holds: () =>
      IMP33782_RESIDUAL_CONTRAST_SERIES.length === 2 &&
      HALVING_POINT.threshold === 0.5 &&
      FARTAIL_POINT.threshold === 0.1,
  },
  {
    id: 'imp33782-N-cross-increases-down-the-tail',
    description: 'the far-tail landmark N_cross is far larger than the halving landmark N_cross (log-axis spread)',
    holds: () => FARTAIL_POINT.N_cross > 10 * HALVING_POINT.N_cross,
  },
  {
    id: 'imp33782-far-tail-residual-is-smaller',
    description: 'the far-tail relative residual is smaller than the halving relative residual',
    holds: () => FARTAIL_POINT.relResidual > 0 && FARTAIL_POINT.relResidual < HALVING_POINT.relResidual,
  },
  {
    id: 'imp33782-tightening-ratio-matches-recomputed',
    description: 'the reused imp-33743 tightening ratio matches an independent recomputation from the series to <1%',
    holds: () => Math.abs(IMP33782_TIGHTENING_RATIO_RECOMPUTED / IMP33782_TIGHTENING_RATIO - 1) < 1e-2,
  },
  {
    id: 'imp33782-tightening-ratio-is-order-54x',
    description: 'the tightening ratio is in the ~20x..100x band imp-33743 reported (~54x)',
    holds: () => IMP33782_TIGHTENING_RATIO > 20 && IMP33782_TIGHTENING_RATIO < 100,
  },
  {
    id: 'imp33782-honesty-gate-no-qed',
    description: 'reused imp-33723/imp-33743 verdicts carry isRigorous false and NO QED',
    holds: () =>
      IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.isRigorous === false &&
      IMP33743_SIGMA_FARTAIL_CROSSOVER_CLOSED_FORM.isRigorous === false &&
      /NO QED/.test(IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.verdict) &&
      /NO QED/.test(IMP33743_SIGMA_FARTAIL_CROSSOVER_CLOSED_FORM.verdict),
  },
  {
    id: 'imp33782-caveat-banner-states-honest-status',
    description: 'the caveat banner explicitly opens with HONEST STATUS and names the tightening ratio',
    holds: () => /HONEST STATUS/.test(IMP33782_CAVEAT_BANNER) && IMP33782_CAVEAT_BANNER.includes(`${IMP33782_TIGHTENING_RATIO}x`),
  },
];

for (const a of IMP33782_RESIDUAL_CONTRAST_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33782-residual-contrast-viz-data assertion failed: ${a.id}`);
  }
}
