/**
 * @module imp-34205-widening-slope-convergence-viz-data
 * @fileoverview imp-34205 -- lightweight viz-data module for the imp-34129 finding that the
 *   imp-33843 log-linear widening slope b(kEnd) CONVERGES to a finite limit b_inf ~ -1.01 as the
 *   imp-33810/imp-33877 ladder is extended, rather than drifting open-endedly (the imp-34022 R3
 *   three-window "whole-line tilt"). Re-exposes the imp-34129 15-point (kEnd, b) sweep alongside
 *   dense exponential-approach and power-approach curves (sampled from the SAME fitted
 *   (b_inf, c, lam) / (b_inf, c, p) parameters imp-34129 already grid-searched -- no re-fit, no
 *   fresh model) so a page can overlay the two convergence surrogates against the measured points
 *   and show why the exponential form wins.
 *
 *   Self-computing only from the imp-34129 exported constants; no heavy zeros-bundle import,
 *   no re-derivation. Viz data only; changes no bound; no QED.
 *
 *   @see imp-34129-widening-slope-drift-convergence-fit.js (the sweep and convergence fits plotted here)
 *   @see imp-34022-argmin-argmax-migration-symmetry (the R3 three-window whole-line tilt)
 *   @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose slope drift is tracked)
 *   @see imp-34246-widening-slope-limit-analytic-derivation (derives the b_inf convergence plotted here is a finite-window coincidence, not a true k -> inf limit)
 *   @see imp-34247-widening-slope-pole-divergence (the same slope's divergence at k* ~ 21.281, past the window plotted here)
 */

import { IMP34129_WIDENING_SLOPE_DRIFT_CONVERGENCE_FIT } from './imp-34129-widening-slope-drift-convergence-fit.js';

const { sweep, convergenceFits, localSlopeCrossCheck, slopeStepIncrements } =
  IMP34129_WIDENING_SLOPE_DRIFT_CONVERGENCE_FIT;

// The 15 measured (kEnd, b) points from the imp-34129 sweep.
export const IMP34205_SWEEP_POINTS = Object.freeze(sweep.map((r) => ({ kEnd: r.kEnd, b: r.b })));

// Dense overlay curves sampled from the imp-34129-fitted surrogate parameters (same numbers, no
// re-fit): b = b_inf + c*exp(-lam*kEnd) and b = b_inf + c*kEnd^(-p), over the sweep's kEnd range.
const K_LO = sweep[0].kEnd;
const K_HI = sweep[sweep.length - 1].kEnd;
const CURVE_STEPS = 60;
function denseCurve(fn) {
  const pts = [];
  for (let i = 0; i <= CURVE_STEPS; i++) {
    const kEnd = K_LO + ((K_HI - K_LO) * i) / CURVE_STEPS;
    pts.push({ kEnd: +kEnd.toFixed(4), b: +fn(kEnd).toFixed(6) });
  }
  return pts;
}
export const IMP34205_EXP_APPROACH_CURVE = Object.freeze(
  denseCurve((kEnd) => convergenceFits.expApproach.bInf + convergenceFits.expApproach.c * Math.exp(-convergenceFits.expApproach.lam * kEnd))
);
export const IMP34205_POW_APPROACH_CURVE = Object.freeze(
  denseCurve((kEnd) => convergenceFits.powApproach.bInf + convergenceFits.powApproach.c * Math.pow(kEnd, -convergenceFits.powApproach.p))
);

// The two finite limits and the local-slope cross-check, for a landmark strip on the chart.
export const IMP34205_LIMIT_MARKERS = Object.freeze({
  expBInf: convergenceFits.expApproach.bInf,
  expLam: convergenceFits.expApproach.lam,
  expSsr: convergenceFits.expApproach.ssr,
  powBInf: convergenceFits.powApproach.bInf,
  powP: convergenceFits.powApproach.p,
  powSsr: convergenceFits.powApproach.ssr,
  winner: convergenceFits.winner,
  ssrRatioPowOverExp: convergenceFits.ssrRatioPowOverExp,
  localSlopeMean: localSlopeCrossCheck.mean,
});

// Per-step increment of b across the sweep, for a shrinking-step bar strip.
export const IMP34205_SLOPE_STEPS = Object.freeze(slopeStepIncrements.slice());

export const IMP34205_CAVEAT_BANNER =
  `HONEST STATUS: the imp-34129 slope drift b(kEnd) CONVERGES to a finite limit b_inf ~ ` +
  `${IMP34205_LIMIT_MARKERS.expBInf.toFixed(3)} (exponential-approach fit, SSR ${
    IMP34205_LIMIT_MARKERS.ssrRatioPowOverExp
  }x tighter than the power-approach alternative), cross-checked by the local tail slope of y(k) ` +
  `plateauing near ${IMP34205_LIMIT_MARKERS.localSlopeMean.toFixed(3)}. Measurement/convergence-fit ` +
  'only on the inherited imp-33810/imp-33877 component model, NOT a rigorous asymptotic; the ' +
  'imp-33843 log-linear form verdict is untouched; isRigorous false, NO QED; imp-3066 K_a >= 0 ' +
  'untouched; no refereed bound is changed.';

export const IMP34205_WIDENING_SLOPE_CONVERGENCE_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp34205-sweep-has-15-points-spanning-11-to-18',
    description: 'the re-exposed sweep has 15 (kEnd, b) points spanning kEnd = 11..18',
    holds: () =>
      IMP34205_SWEEP_POINTS.length === 15 &&
      IMP34205_SWEEP_POINTS[0].kEnd === 11 &&
      IMP34205_SWEEP_POINTS[14].kEnd === 18,
  },
  {
    id: 'imp34205-exp-curve-passes-near-measured-endpoints',
    description: 'the dense exp-approach curve endpoints are within 0.05 of the measured sweep endpoints',
    holds: () =>
      Math.abs(IMP34205_EXP_APPROACH_CURVE[0].b - IMP34205_SWEEP_POINTS[0].b) < 0.05 &&
      Math.abs(IMP34205_EXP_APPROACH_CURVE[CURVE_STEPS].b - IMP34205_SWEEP_POINTS[14].b) < 0.05,
  },
  {
    id: 'imp34205-exp-curve-tighter-than-pow-at-limit',
    description: 'the exponential-approach limit is finite and the winner matches imp-34129',
    holds: () =>
      convergenceFits.winner === 'exp-approach' &&
      Number.isFinite(IMP34205_LIMIT_MARKERS.expBInf) &&
      IMP34205_LIMIT_MARKERS.ssrRatioPowOverExp > 1,
  },
  {
    id: 'imp34205-slope-steps-shrink-monotonically-in-magnitude-near-tail',
    description: 'the re-exposed per-step increments end smaller than they start (deceleration survives re-export)',
    holds: () => IMP34205_SLOPE_STEPS[IMP34205_SLOPE_STEPS.length - 1] < IMP34205_SLOPE_STEPS[0],
  },
  {
    id: 'imp34205-honesty-gate-no-qed',
    description: 'caveat banner states convergence-fit only, no QED, no refereed bound is changed',
    holds: () =>
      /HONEST STATUS/.test(IMP34205_CAVEAT_BANNER) &&
      /NO QED/.test(IMP34205_CAVEAT_BANNER) &&
      /refereed bound is changed/i.test(IMP34205_CAVEAT_BANNER),
  },
];

for (const a of IMP34205_WIDENING_SLOPE_CONVERGENCE_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34205-widening-slope-convergence-viz-data assertion failed: ${a.id}`);
  }
}
