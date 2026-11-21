/**
 * @module imp-36145-joint-recovery-contour-viz-data
 *
 * imp-36145 (ux, sonnet-4-6, sonnet): import-light viz-data module for the imp-36096
 * JOINT (alpha, beta) W1-accumulator recovery-basin contour in normalized (u, v)
 * coordinates. imp-36096 reported the lobed non-convexity numerically in its docstring
 * (bulge to u+v ~2.48/2.52 near v ~0.375, inner cave to u+v ~0.60/0.59 near v ~0.125)
 * but bakes only FOUR recomputed confirmation points, not the full contour as plottable
 * data. This module re-exports the imp-36096 normalized contour points verbatim, plus
 * the axis-diamond (u+v = 1) and quarter-ellipse (u^2 + v^2 = 1) reference curves a
 * viz page needs to show how far the measured basin departs from either naive shape.
 *
 * PRESENTATION ONLY. Imports the imp-36096 normalized contour points verbatim; derives
 * no new numerics; instantiates no directed-rounding interval; verifies no inequality;
 * changes no bound; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-36096-w1-accumulator-joint-recovery-contour.js (source: joint (alpha,beta) recovery contour + non-convexity finding)
 * @see imp-36142-joint-basin-non-convex-single-axis-unsafe-honest-status.js (honest-status restatement of the same finding)
 * @see imp-36061-w1-accumulator-recovery-detuning-width (the single-axis edges normalized against)
 */

import { IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR } from './imp-36096-w1-accumulator-joint-recovery-contour.js';

const NORM_10 = IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.jointContour10.normalized;
const NORM_1 = IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.jointContour1.normalized;

// Reference curves for comparison: the naive axis-diamond (u+v=1) and quarter-ellipse
// (u^2+v^2=1), sampled at the same u-grid the measured contours span (u in [0, 1]).
const REF_STEPS = 8;
const AXIS_DIAMOND = Array.from({ length: REF_STEPS + 1 }, (_, i) => {
  const u = i / REF_STEPS;
  return { u, v: 1 - u };
});
const QUARTER_ELLIPSE = Array.from({ length: REF_STEPS + 1 }, (_, i) => {
  const u = i / REF_STEPS;
  return { u, v: Math.sqrt(Math.max(0, 1 - u * u)) };
});

export const IMP36145_JOINT_RECOVERY_CONTOUR_VIZ_DATA = {
  id: 'imp-36145',
  sourceModule: 'imp-36096-w1-accumulator-joint-recovery-contour.js',
  note:
    'Normalized (u,v) = (delta/alphaEdge, beta/betaEdge) joint recovery contours re-exported ' +
    'verbatim from imp-36096, alongside the axis-diamond u+v=1 and quarter-ellipse u^2+v^2=1 ' +
    'reference curves a naive interpolation of the two single-axis edges would predict.',
  contour10: {
    target: IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.jointContour10.target,
    points: NORM_10,
    maxInteriorUplusV: IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.jointContour10.maxInteriorUplusV,
    minInteriorUplusV: IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.jointContour10.minInteriorUplusV,
  },
  contour1: {
    target: IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.jointContour1.target,
    points: NORM_1,
    maxInteriorUplusV: IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.jointContour1.maxInteriorUplusV,
    minInteriorUplusV: IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.jointContour1.minInteriorUplusV,
  },
  referenceCurves: {
    axisDiamond: AXIS_DIAMOND,
    quarterEllipse: QUARTER_ELLIPSE,
    note:
      'axisDiamond is the naive linear interpolation u+v=1 between the two single-axis edges; ' +
      'quarterEllipse is u^2+v^2=1 (max u+v = sqrt(2) on its interior). The measured contours ' +
      'bulge far outside both (u+v up to ~2.5) and cave inside both (u+v down to ~0.6) in a ' +
      'narrow beta-axis lobe.',
  },
  isRigorous: false,
  verdict:
    'PRESENTATION ONLY. Re-exports the imp-36096 measured normalized (u,v) joint recovery ' +
    'contours verbatim (no re-derivation) alongside the axis-diamond and quarter-ellipse ' +
    'reference curves, so a viz page can render the lobed non-convexity (outer bulge ' +
    'u+v ~2.48/2.52 near v ~0.375, inner cave ~0.60/0.59 near v ~0.125) against both naive ' +
    'shapes. Changes no bound; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
};

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP36145_ASSERTIONS = [
  {
    id: 'imp36145-contours-nonempty',
    description: 'Both re-exported normalized contours carry the full nine baked points each',
    holds: () => NORM_10.length === 9 && NORM_1.length === 9,
  },
  {
    id: 'imp36145-axis-endpoints-on-diamond',
    description: 'The two axis endpoints of each contour sit on u+v = 1 (fixed by construction, to baked-literal precision)',
    holds: () =>
      Math.abs(NORM_10[0].sum - 1) < 1e-4 &&
      Math.abs(NORM_10[NORM_10.length - 1].sum - 1) < 1e-4 &&
      Math.abs(NORM_1[0].sum - 1) < 1e-4 &&
      Math.abs(NORM_1[NORM_1.length - 1].sum - 1) < 1e-4,
  },
  {
    id: 'imp36145-reference-curves-consistent',
    description: 'Reference curves span u in [0,1], both satisfying their defining equation at every sample',
    holds: () =>
      AXIS_DIAMOND.every((p) => Math.abs(p.u + p.v - 1) < 1e-12) &&
      QUARTER_ELLIPSE.every((p) => Math.abs(p.u * p.u + p.v * p.v - 1) < 1e-9) &&
      AXIS_DIAMOND.length === REF_STEPS + 1 &&
      QUARTER_ELLIPSE.length === REF_STEPS + 1,
  },
  {
    id: 'imp36145-bulge-exceeds-both-references',
    description: 'The measured max interior u+v exceeds both the diamond (1) and the quarter-ellipse max (sqrt 2)',
    holds: () =>
      IMP36145_JOINT_RECOVERY_CONTOUR_VIZ_DATA.contour10.maxInteriorUplusV > Math.SQRT2 &&
      IMP36145_JOINT_RECOVERY_CONTOUR_VIZ_DATA.contour1.maxInteriorUplusV > Math.SQRT2,
  },
  {
    id: 'imp36145-cave-below-both-references',
    description: 'The measured min interior u+v sits below the diamond (1)',
    holds: () =>
      IMP36145_JOINT_RECOVERY_CONTOUR_VIZ_DATA.contour10.minInteriorUplusV < 1 &&
      IMP36145_JOINT_RECOVERY_CONTOUR_VIZ_DATA.contour1.minInteriorUplusV < 1,
  },
  {
    id: 'imp36145-honesty-gate',
    description: 'Presentation only; no re-derivation; no QED; no refereed bound is changed',
    holds: () =>
      IMP36145_JOINT_RECOVERY_CONTOUR_VIZ_DATA.isRigorous === false &&
      /NO QED/.test(IMP36145_JOINT_RECOVERY_CONTOUR_VIZ_DATA.verdict) &&
      /refereed bound is changed/i.test(IMP36145_JOINT_RECOVERY_CONTOUR_VIZ_DATA.verdict),
  },
];

for (const a of IMP36145_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36145-joint-recovery-contour-viz-data assertion failed: ${a.id}`);
  }
}
