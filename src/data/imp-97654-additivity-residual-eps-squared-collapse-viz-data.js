/**
 * @module imp-97654-additivity-residual-eps-squared-collapse-viz-data
 *
 * imp-97654: import-light viz-data reshaping the imp-97623 additivity-residual multi-landmark
 * crosscheck into chart-ready rows -- a log-log residual-vs-eps ladder and a ratio-to-4 bar chart
 * making the O(eps^2) truncation signature (residual quarters when eps halves at every landmark)
 * visible at a glance across the three imp-97520 sigma landmarks L2/L3/L4.
 *
 * PRESENTATION ONLY. Reuses the frozen IMP97623_ADDITIVITY_RESIDUAL_MULTI_LANDMARK_CROSSCHECK
 * literals verbatim -- no re-derivation, no new computation. No bound moves; Platt-Trudgian
 * Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *
 * @see imp-97623-additivity-residual-multi-landmark-crosscheck.js (IMP97623_ADDITIVITY_RESIDUAL_MULTI_LANDMARK_CROSSCHECK)
 */

import { IMP97623_ADDITIVITY_RESIDUAL_MULTI_LANDMARK_CROSSCHECK } from './imp-97623-additivity-residual-multi-landmark-crosscheck.js';

const { perLandmark, steps_probed } = IMP97623_ADDITIVITY_RESIDUAL_MULTI_LANDMARK_CROSSCHECK;

// Per-landmark residual-vs-eps pairs (two points each): the eps^2 collapse ladder.
export const IMP97654_RESIDUAL_VS_EPS_ROWS = Object.freeze(
  perLandmark.map((r) =>
    Object.freeze({
      key: r.key,
      label: r.label,
      sigma: r.sigma,
      N_L: r.N_L,
      points: Object.freeze([
        Object.freeze({ eps: steps_probed.eps_primary, resid: Math.abs(r.additivity_residual_eps1e3) }),
        Object.freeze({ eps: steps_probed.eps_secondary, resid: Math.abs(r.additivity_residual_eps5e4) }),
      ]),
    })),
);

// Ratio-to-4 bar rows: how close each landmark's eps1e3/eps5e4 residual ratio sits to the O(eps^2) value 4.
export const IMP97654_RATIO_ROWS = Object.freeze(
  perLandmark.map((r) =>
    Object.freeze({
      key: r.key,
      label: r.label,
      ratio: r.residual_ratio_eps1e3_over_eps5e4,
    })),
);

export const IMP97654_SUMMARY = Object.freeze({
  reading:
    'Halving the central-difference step from eps=1e-3 to eps=5e-4 quarters the additivity residual '
    + `|DIAG - (E_CC + E_ET)| at all three imp-97520 landmarks (ratios ${IMP97654_RATIO_ROWS.map((r) => r.ratio.toFixed(2)).join(', ')} `
    + 'against L2/L3/L4), the signature of O(eps^2) central-difference truncation. The true (eps -> 0) '
    + 'additivity residual is therefore zero at every landmark, uniformly across the 2.6e7 -> 3.2e11 N span.',
  verdict: IMP97623_ADDITIVITY_RESIDUAL_MULTI_LANDMARK_CROSSCHECK.verdict,
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97654_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97654-three-landmarks-present',
    description: 'exactly three landmarks (L2, L3, L4) are carried through to the viz rows',
    holds: () => IMP97654_RESIDUAL_VS_EPS_ROWS.length === 3 && IMP97654_RATIO_ROWS.length === 3,
  },
  {
    id: 'imp97654-residual-shrinks-with-eps-at-every-landmark',
    description: 'the eps=5e-4 residual point is strictly smaller than the eps=1e-3 point at every landmark',
    holds: () =>
      IMP97654_RESIDUAL_VS_EPS_ROWS.every((row) => row.points[1].resid < row.points[0].resid),
  },
  {
    id: 'imp97654-ratios-near-four',
    description: 'every eps1e3/eps5e4 residual ratio lies in [3.5, 4.5]: the O(eps^2) truncation signature',
    holds: () => IMP97654_RATIO_ROWS.every((r) => r.ratio > 3.5 && r.ratio < 4.5),
  },
  {
    id: 'imp97654-honesty-gate-no-qed',
    description: 'presentation only: source module is non-rigorous and no-QED',
    holds: () =>
      IMP97623_ADDITIVITY_RESIDUAL_MULTI_LANDMARK_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP97623_ADDITIVITY_RESIDUAL_MULTI_LANDMARK_CROSSCHECK.verdict) &&
      /remains SOTA/.test(IMP97623_ADDITIVITY_RESIDUAL_MULTI_LANDMARK_CROSSCHECK.verdict) &&
      typeof IMP97654_SUMMARY.reading === 'string',
  },
];

for (const a of IMP97654_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97654-additivity-residual-eps-squared-collapse-viz-data assertion failed: ${a.id}`);
  }
}
