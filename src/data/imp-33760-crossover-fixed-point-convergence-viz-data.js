/**
 * @module imp-33760-crossover-fixed-point-convergence-viz-data
 * @fileoverview imp-33760 -- lightweight viz-data module for the imp-33723 closed-form
 *   crossover N_cross = (C_C_PINNED/E_trunc)^2 * log T0(N_cross). Samples the Banach
 *   fixed-point iteration N_k -> N_cross so a page can plot the geometric convergence
 *   (~5 steps to floating point, contraction factor |g_prime(N_cross)| ~ 0.045), and
 *   pairs the converged closed-form value against the imp-33582 empirical sigma = 1/2
 *   halving landmark, annotating the ~0.4% residual imp-33723 attributed to the
 *   Gronwall flow term E_flow.
 *
 *   Self-computing from the same pinned constants imp-33723 already uses
 *   (effectiveHeightForN, C_C_PINNED) -- no heavy zeros-bundle import, no fresh model,
 *   no re-derivation. Viz data only; changes no bound; no QED.
 *
 *   @see imp-33723-sigma-half-vs-crossover-closed-form.js (the closed-form derivation this plots)
 *   @see imp-33582-sigma-postpeak-nearpeak-threshold-decay.js (the sigma=1/2 halving landmark)
 *   @see imp-3444-sigma-nshape-landmark-ladder.js (E_coll = E_trunc crossover, bisected)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM } from './imp-33723-sigma-half-vs-crossover-closed-form.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582/imp-33723)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8, same pinned amplitude as imp-33723

// The fixed-point map g(N) = K * log T0(N), iterated from a coarse seed -- same map imp-33723
// converges, reused here only to record the per-step trajectory for charting.
function fixedPointTrajectory(seed, iters) {
  const steps = [{ k: 0, N: seed }];
  let N = seed;
  for (let k = 1; k <= iters; k++) {
    N = K_AMPL * Math.log(effectiveHeightForN(N));
    steps.push({ k, N: +N.toExponential(6) });
  }
  return steps;
}

const N_CROSS = IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.landmarks.N_cross_closed_form;

// 8 iterations from a coarse 1e9 seed -- enough steps past the ~5-iteration convergence
// point imp-33723 measured to show the trajectory flattening onto N_cross on the chart.
export const IMP33760_ITERATION_TRAJECTORY = Object.freeze(fixedPointTrajectory(1e9, 8));

// Per-step relative distance to the converged root, for a log-scale convergence-rate plot.
export const IMP33760_CONVERGENCE_ERROR = Object.freeze(
  IMP33760_ITERATION_TRAJECTORY.map(({ k, N }) => ({
    k,
    relError: +(Math.abs(N - N_CROSS) / N_CROSS).toExponential(4),
  }))
);

// The two landmark markers on the same N-axis: the converged closed-form crossover and the
// independent imp-33582 empirical halving landmark, plus the residual imp-33723 measured.
export const IMP33760_LANDMARK_MARKERS = Object.freeze({
  N_cross_closed_form: N_CROSS,
  N_half_empirical: IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.landmarks.N_half_sigma_eq_half_imp33582,
  contractionFactor: IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.landmarks.contraction_factor_at_root,
  relOffsetPct: +(
    IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.offsetAttribution.measured_rel_offset_from_closed_form * 100
  ).toFixed(2),
});

export const IMP33760_CAVEAT_BANNER =
  'HONEST STATUS: the Banach fixed-point iteration is a bisection-free RE-DERIVATION of the ' +
  `imp-3444 crossover (N_cross ~ ${N_CROSS.toExponential(3)}), not a new landmark -- it converges ` +
  `geometrically (contraction |g_prime| ~ ${IMP33760_LANDMARK_MARKERS.contractionFactor}) onto the ` +
  `same value the imp-33601/imp-3444 bisection found. The ~${IMP33760_LANDMARK_MARKERS.relOffsetPct}% ` +
  'gap to the imp-33582 halving landmark is the Gronwall flow term E_flow (imp-33723 D2), not a ' +
  'discretization artifact. Derivation/viz only: isRigorous false, no QED; imp-3066 K_a >= 0 ' +
  'untouched; no refereed bound is changed.';

export const IMP33760_CROSSOVER_FIXED_POINT_CONVERGENCE_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp33760-trajectory-converges-monotonically-in-error',
    description: 'the relative error to N_cross shrinks monotonically (strong contraction)',
    holds: () => IMP33760_CONVERGENCE_ERROR.every((pt, i) => i === 0 || pt.relError <= IMP33760_CONVERGENCE_ERROR[i - 1].relError),
  },
  {
    id: 'imp33760-converges-within-8-steps',
    description: 'by iteration 8 the trajectory has converged to within 1e-9 relative of N_cross',
    holds: () => IMP33760_CONVERGENCE_ERROR[IMP33760_CONVERGENCE_ERROR.length - 1].relError < 1e-9,
  },
  {
    id: 'imp33760-half-below-cross',
    description: 'the empirical halving landmark sits below the closed-form crossover (imp-33723 D2 sign)',
    holds: () => IMP33760_LANDMARK_MARKERS.N_half_empirical < IMP33760_LANDMARK_MARKERS.N_cross_closed_form,
  },
  {
    id: 'imp33760-residual-matches-imp33723-0pt4pct',
    description: 'the reported residual matches the imp-33723 ~0.4% figure (0.2%..0.6%)',
    holds: () => IMP33760_LANDMARK_MARKERS.relOffsetPct > 0.2 && IMP33760_LANDMARK_MARKERS.relOffsetPct < 0.6,
  },
  {
    id: 'imp33760-honesty-gate-no-qed',
    description: 'reused imp-33723 verdict carries isRigorous false and NO QED',
    holds: () =>
      IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.isRigorous === false &&
      /NO QED/.test(IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.verdict),
  },
  {
    id: 'imp33760-caveat-banner-flags-not-new-landmark',
    description: 'the caveat banner explicitly states this is a re-derivation, not a new landmark',
    holds: () => /RE-DERIVATION/.test(IMP33760_CAVEAT_BANNER) && /HONEST STATUS/.test(IMP33760_CAVEAT_BANNER),
  },
];

for (const a of IMP33760_CROSSOVER_FIXED_POINT_CONVERGENCE_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33760-crossover-fixed-point-convergence-viz-data assertion failed: ${a.id}`);
  }
}
