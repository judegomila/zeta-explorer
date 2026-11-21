/**
 * @module imp-36142-joint-basin-non-convex-single-axis-unsafe-honest-status
 * @fileoverview imp-36142 -- standalone HONEST-STATUS note recording plainly, for a
 *   reader who lands on this ticket without having read imp-36096/imp-36061 in full,
 *   that the JOINT (alpha, beta) W1 running-accumulator recovery basin traced by
 *   imp-36096 is strongly NON-CONVEX / lobed, and that the imp-36061 SINGLE-AXIS
 *   detuning edges are NON-conservative over most of the coupled plane:
 *     - imp-36061 measured only the two single-axis recovery edges (alpha with
 *       beta = 0, beta with alpha = 2 pi).
 *     - imp-36096 traced the full joint contour and found it bulges far outside
 *       the axis diamond (normalized u + v ~ 2.48-2.52 near intermediate drift --
 *       UNDER-stating the coupled margin by up to ~2.5x) while a narrow beta-axis
 *       lobe caves inside it (u + v ~ 0.59-0.60).
 *   CONSEQUENCE (restated, not re-derived): a run-time monitor keyed on either
 *   axis alone would be UNSAFE across most of the (alpha, beta) plane, since it
 *   would under-estimate the joint detuning actually needed to recover the
 *   imp-35812 baseline ratio. Read-only note: imports the imp-36096 source object
 *   verbatim (no re-derivation, no new numerics).
 *
 *   Ticket: imp-36142 (content, medium). Note only; ports nothing; changes no
 *   bound; no refereed bound is changed; NO QED.
 *
 * @see imp-36096-w1-accumulator-joint-recovery-contour (source: the joint (alpha,beta) recovery contour and non-convexity finding)
 * @see imp-36061-w1-accumulator-recovery-detuning-width (the two single-axis edges the joint contour shows are non-conservative)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the O(1) accumulator + run-max bound underlying the ratio r)
 * @see imp-35812-w1-summation-scheme-measured-cost (baseline (alpha,beta) term family / r_base)
 */

import { IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR } from './imp-36096-w1-accumulator-joint-recovery-contour.js';

const SOURCE = IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR;

export const IMP36142_JOINT_BASIN_NON_CONVEX_SINGLE_AXIS_UNSAFE_HONEST_STATUS = Object.freeze({
  id: 'imp-36142',
  title:
    'Honest-status note: the imp-36096 JOINT (alpha,beta) recovery basin is NON-CONVEX / lobed, so the ' +
    'imp-36061 single-axis detuning edges are NON-conservative and a monitor keyed on either axis alone is unsafe',
  sourceModule: 'imp-36096-w1-accumulator-joint-recovery-contour.js',

  basinSummary: Object.freeze({
    maxInteriorUplusV10: SOURCE.jointContour10.maxInteriorUplusV,
    minInteriorUplusV10: SOURCE.jointContour10.minInteriorUplusV,
    maxInteriorUplusV1: SOURCE.jointContour1.maxInteriorUplusV,
    minInteriorUplusV1: SOURCE.jointContour1.minInteriorUplusV,
    alphaEdge10: SOURCE.singleAxisEdges.alphaEdge10,
    betaEdge10: SOURCE.singleAxisEdges.betaEdge10,
  }),

  conclusion:
    'imp-36061 located only the two single-axis recovery edges for the imp-35890 running-accumulator ratio ' +
    'r = max_i|S_i| / Sum|t_k|: the alpha detuning at beta = 0 (|delta| ~ ' +
    SOURCE.singleAxisEdges.alphaEdge10.toFixed(5) +
    ' at the 10% target, ~' +
    SOURCE.singleAxisEdges.alphaEdge1.toFixed(5) +
    ' at 1%) and the beta detuning at alpha = 2 pi (~' +
    SOURCE.singleAxisEdges.betaEdge10.toFixed(5) +
    ' / ~' +
    SOURCE.singleAxisEdges.betaEdge1.toFixed(5) +
    '). imp-36096 then traced the full COUPLED contour and found the joint basin is STRONGLY NON-CONVEX and ' +
    'NON-ELLIPTICAL: normalized to the single-axis edges (u = delta/alphaEdge, v = beta/betaEdge) the interior ' +
    'bulges far outside the axis diamond u + v = 1, peaking at u + v ~ ' +
    SOURCE.jointContour10.maxInteriorUplusV.toFixed(2) +
    ' (10% target) / ~' +
    SOURCE.jointContour1.maxInteriorUplusV.toFixed(2) +
    ' (1% target) near an intermediate sqrt-drift, while a narrow beta-axis lobe caves inside it to u + v ~ ' +
    SOURCE.jointContour10.minInteriorUplusV.toFixed(2) +
    ' / ~' +
    SOURCE.jointContour1.minInteriorUplusV.toFixed(2) +
    '. So the imp-36061 single-axis edges are conservative ONLY in that narrow beta-axis lobe, and are ' +
    'NON-conservative -- under-stating the coupled margin by up to ~2.5x on the alpha detuning -- across the ' +
    'bulk of the (alpha, beta) plane. CONSEQUENCE: a run-time monitor that keys its safety threshold on either ' +
    'axis alone (rather than the full joint contour) would systematically UNDER-estimate the detuning actually ' +
    'needed to recover the imp-35812 baseline ratio over most of the plane, making such a monitor UNSAFE. ' +
    'Precision itself is not the underlying risk -- even at the r = 1 full-breakdown corner the classic ' +
    'gamma_{N-1} bound stays orders under the imp-35760 barrier margin -- this note concerns only which ' +
    '(alpha, beta) monitoring rule is safe to use, not any change to the certified bound.',

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    changesAnyBound: false,
    portsAnyRoute: false,
    scope: 'restates imp-36096 measurement only; instantiates no directed-rounding interval; verifies no inequality',
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'SINGLE-AXIS MONITORS ARE UNSAFE FOR THE JOINT PLANE (restated from imp-36096): the (alpha, beta) recovery ' +
    'basin is non-convex and lobed, bulging to u + v ~ ' +
    SOURCE.jointContour10.maxInteriorUplusV.toFixed(2) +
    ' outside the axis diamond over most of the plane, so a run-time monitor keyed on the imp-36061 single-axis ' +
    'edges alone under-estimates the joint detuning needed by up to ~2.5x and is therefore unsafe as a general ' +
    'guard; only the full joint contour (or a conservative outer envelope of it) is a safe monitoring rule. ' +
    'Measurement/diagnostic restatement only; changes no bound; NO QED; no refereed bound is changed.',
});

export const IMP36142_JOINT_BASIN_NON_CONVEX_SINGLE_AXIS_UNSAFE_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36142-source-non-rigorous',
    why: 'The source module must self-report as a non-rigorous measurement, matching this restatement.',
    holds: () => SOURCE.isRigorous === false,
  },
  {
    id: 'imp36142-bulge-matches-source',
    why: 'The restated bulge/lobe figures must equal the imp-36096 source measurement exactly (read-only restatement).',
    holds: () =>
      IMP36142_JOINT_BASIN_NON_CONVEX_SINGLE_AXIS_UNSAFE_HONEST_STATUS.basinSummary.maxInteriorUplusV10 ===
        SOURCE.jointContour10.maxInteriorUplusV &&
      IMP36142_JOINT_BASIN_NON_CONVEX_SINGLE_AXIS_UNSAFE_HONEST_STATUS.basinSummary.minInteriorUplusV10 ===
        SOURCE.jointContour10.minInteriorUplusV &&
      IMP36142_JOINT_BASIN_NON_CONVEX_SINGLE_AXIS_UNSAFE_HONEST_STATUS.basinSummary.maxInteriorUplusV1 ===
        SOURCE.jointContour1.maxInteriorUplusV &&
      IMP36142_JOINT_BASIN_NON_CONVEX_SINGLE_AXIS_UNSAFE_HONEST_STATUS.basinSummary.minInteriorUplusV1 ===
        SOURCE.jointContour1.minInteriorUplusV,
  },
  {
    id: 'imp36142-bulge-exceeds-diamond',
    why: 'The bulge must genuinely exceed the axis diamond (u+v=1) and even the quarter-ellipse maximum (sqrt 2) to support the non-convexity claim.',
    holds: () =>
      IMP36142_JOINT_BASIN_NON_CONVEX_SINGLE_AXIS_UNSAFE_HONEST_STATUS.basinSummary.maxInteriorUplusV10 > Math.SQRT2 &&
      IMP36142_JOINT_BASIN_NON_CONVEX_SINGLE_AXIS_UNSAFE_HONEST_STATUS.basinSummary.maxInteriorUplusV1 > Math.SQRT2,
  },
  {
    id: 'imp36142-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim proof, RH reduction, or any changed bound.',
    holds: () =>
      IMP36142_JOINT_BASIN_NON_CONVEX_SINGLE_AXIS_UNSAFE_HONEST_STATUS.honestCaveat.isProof === false &&
      IMP36142_JOINT_BASIN_NON_CONVEX_SINGLE_AXIS_UNSAFE_HONEST_STATUS.honestCaveat.isReductionBelowRH === false &&
      IMP36142_JOINT_BASIN_NON_CONVEX_SINGLE_AXIS_UNSAFE_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36142_JOINT_BASIN_NON_CONVEX_SINGLE_AXIS_UNSAFE_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp36142-verdict-unsafe-no-qed',
    why: 'The verdict must record the single-axis-monitor-unsafe conclusion and NO QED, matching the source findings.',
    holds: () =>
      /UNSAFE/.test(IMP36142_JOINT_BASIN_NON_CONVEX_SINGLE_AXIS_UNSAFE_HONEST_STATUS.verdict) &&
      /NO QED/.test(IMP36142_JOINT_BASIN_NON_CONVEX_SINGLE_AXIS_UNSAFE_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP36142_JOINT_BASIN_NON_CONVEX_SINGLE_AXIS_UNSAFE_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36142-joint-basin-non-convex-single-axis-unsafe-honest-status assertion failed: ${assertion.id}`
    );
  }
}

export default IMP36142_JOINT_BASIN_NON_CONVEX_SINGLE_AXIS_UNSAFE_HONEST_STATUS;
