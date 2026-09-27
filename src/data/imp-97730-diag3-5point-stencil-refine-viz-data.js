/**
 * @module imp-97730-diag3-5point-stencil-refine-viz-data
 *
 * imp-97730: import-light viz-data leaf charting the imp-97703 5-point O(eps^4) DIAG3
 * collapse to the ~1e-12 machine-zero floor across the L2/L3/L4 landmarks (~6.2e4x cut at
 * L2, ~1.2e3x at L3, ~48x at L4) versus the 3-point O(eps^2) central-difference tail, which
 * quarters when eps halves at L2. Reuses IMP97703_DIAG3_5POINT_STENCIL_REFINE verbatim (no
 * re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97703-diag3-5point-stencil-refine.js (perLandmark, step_probed.eps_ladder, verdict)
 */

import { IMP97703_DIAG3_5POINT_STENCIL_REFINE } from './imp-97703-diag3-5point-stencil-refine.js';

const { perLandmark, step_probed, diagnostics, verdict } = IMP97703_DIAG3_5POINT_STENCIL_REFINE;

// One row per landmark: |DIAG3| under both stencils, plus the 5-point/3-point cut factor.
export const IMP97730_LANDMARK_ROWS = Object.freeze(
  perLandmark.map((r) =>
    Object.freeze({
      key: r.key,
      label: r.label,
      sigma: r.sigma,
      abs3pt: Math.abs(r.diag3_3pt),
      abs5pt: Math.abs(r.diag3_5pt),
      cutX: r.stencil_cut_x,
    })
  )
);

// L2 (flow-heavy landmark) eps-halving ladder: the 3-point residual quarters each step.
const L2 = perLandmark[0];
export const IMP97730_EPS_LADDER_ROWS = Object.freeze(
  step_probed.eps_ladder.map((eps, i) =>
    Object.freeze({
      eps,
      abs3pt: Math.abs(L2.diag3_3pt_eps_ladder[i]),
    })
  )
);

export const IMP97730_QUARTERING_RATIOS = Object.freeze(diagnostics.L2_three_point_quartering_ratios);

export const IMP97730_SUMMARY = Object.freeze({
  reading:
    `The 5-point O(eps^4) stencil collapses |DIAG3| to the ~1e-12 machine-zero floor at every ` +
    `landmark, cutting the 3-point O(eps^2) value by ${IMP97730_LANDMARK_ROWS[0].cutX}x at L2 ` +
    `(sigma=${IMP97730_LANDMARK_ROWS[0].sigma}), ${IMP97730_LANDMARK_ROWS[1].cutX}x at L3 ` +
    `(sigma=${IMP97730_LANDMARK_ROWS[1].sigma}), and ${IMP97730_LANDMARK_ROWS[2].cutX}x at L4 ` +
    `(sigma=${IMP97730_LANDMARK_ROWS[2].sigma}). At L2 the surviving 3-point residual quarters ` +
    `each time eps halves (ratios ${IMP97730_QUARTERING_RATIOS.join(' then ')} over the ` +
    `${IMP97730_EPS_LADDER_ROWS.map((r) => r.eps).join('/')} ladder), the textbook O(eps^2) ` +
    `central-difference truncation signature.`,
  verdict,
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97730_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97730-three-landmark-rows',
    description: 'exactly three landmark rows (L2, L3, L4)',
    holds: () => IMP97730_LANDMARK_ROWS.length === 3,
  },
  {
    id: 'imp97730-5pt-floor-below-3pt',
    description: '5-point |DIAG3| sits below the 3-point value at every landmark, cut factor > 10x',
    holds: () =>
      IMP97730_LANDMARK_ROWS.every((r) => r.abs5pt < r.abs3pt && r.cutX > 10),
  },
  {
    id: 'imp97730-eps-ladder-three-rungs',
    description: 'the L2 eps-halving ladder has exactly three rungs matching step_probed.eps_ladder',
    holds: () =>
      IMP97730_EPS_LADDER_ROWS.length === 3 &&
      IMP97730_EPS_LADDER_ROWS[0].eps === step_probed.eps_ladder[0],
  },
  {
    id: 'imp97730-quartering-ratios-near-four',
    description: 'the two quartering ratios sit in [3.5, 4.5] (O(eps^2) leading-error signature)',
    holds: () => IMP97730_QUARTERING_RATIOS.every((r) => r > 3.5 && r < 4.5),
  },
  {
    id: 'imp97730-values-match-imp97703-source',
    description: 'landmark cut factors match the imp-97703 perLandmark rows verbatim',
    holds: () =>
      IMP97730_LANDMARK_ROWS.every((row, i) => row.cutX === perLandmark[i].stencil_cut_x),
  },
  {
    id: 'imp97730-honesty-gate-no-qed',
    description: 'the reused verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97730_SUMMARY.verdict) && /NO QED/.test(IMP97730_SUMMARY.verdict),
  },
];

for (const assertion of IMP97730_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97730 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97730_SUMMARY;
