/**
 * @module imp-97797-tra2-named-figure-reclassification
 * @fileoverview imp-97797 -- ASSESSMENT / HONEST RECLASSIFICATION (no bound moved; NO QED):
 *   Decide whether the imp-97482 named ~4819.1M tr(A2) figure should be RECLASSIFIED now that the
 *   fit-based trace limit has converged to ~4818.77M (imp-97517 / imp-97582 / imp-97599 / imp-97641 /
 *   imp-97684, stable algebraic exponent p ~ 1.980), and DERIVE where the persistent ~0.33M
 *   (relative 6.86e-5) discrepancy originates inside the imp-97482 assembly. imp-97649 already
 *   recorded that the tail is algebraic and that the named figure is "looser bookkeeping"; this
 *   leaf adds the missing ORIGIN diagnosis -- exactly WHERE in imp-97482 the 4819.1M comes from --
 *   and states the reclassification as a standalone, directly citable object.
 *
 *   ------------------------------------------------------------------------------------------
 *   ORIGIN 1 -- the 4819.1M is a PROSE label, never a computed export of imp-97482
 *   ------------------------------------------------------------------------------------------
 *   Auditing imp-97482-krein-route2-kbig-direct-projector-floor.js, the string "4819.1M" occurs
 *   ONLY in four narrative comment lines (the @fileoverview, the A2_TRACE_BY_KBIG comment, the
 *   FLOOR.summary string, and the VERDICT.why comment). It is NOT the value of any exported field:
 *   the highest actually-built entry of IMP97482_A2_TRACE_BY_KBIG is tr(A2)(Kbig=260) =
 *   4818631331.255102 (~4818.63M), and imp-97482 produced NO extrapolator that returns 4819.1M.
 *   imp-97482 itself attributes the figure upstream -- its @fileoverview reads "toward the ~4819.1M
 *   limit imp-97455 named" -- so 4819.1M is a round-number EYEBALL reading of the collapsing deltas
 *   (0.183M -> 0.094M -> 0.055M) inherited verbatim from imp-97455, taken BEFORE any exponent fit.
 *
 *   ------------------------------------------------------------------------------------------
 *   ORIGIN 2 -- the ~0.33M gap IS the eyeball tail-sum overshoot above Kbig=260
 *   ------------------------------------------------------------------------------------------
 *   Both figures are the same anchor tr(A2)(260)=4818.631331M plus an estimate of the remaining tail:
 *     eyeball tail (to the named 4819.1M) = 4819100000 - 4818631331.255102 = 468668.74  (~0.469M)
 *     fit tail     (to the ~4818.77M limit) = 4818769243.14 - 4818631331.255102 = 137911.88  (~0.138M)
 *   The eyeball read the residual tail above Kbig=260 as ~0.47M when the converged algebraic tail
 *   (p~1.980, geometric/Aitken limit 4818769243.14) contributes only ~0.14M. The difference,
 *     overshoot = 468668.74 - 137911.88 = 330756.86  (~0.331M, relative 6.86e-5),
 *   equals the imp-97684 measured gapGeomToNamed EXACTLY. So the ~0.33M discrepancy is not a
 *   precision defect anywhere in the imp-97482 build; it is entirely the round-number extrapolation
 *   overshooting the residual tail by ~3.4x, a pre-fit eyeball artifact.
 *
 *   ------------------------------------------------------------------------------------------
 *   RECLASSIFICATION -- 4819.1M downgraded from "the reproducing-kernel limit" to a pre-fit label
 *   ------------------------------------------------------------------------------------------
 *   Verdict: the imp-97482 ~4819.1M should be reclassified from an implied converged reproducing-kernel
 *   trace limit to a PRE-FIT EYEBALL ROUND-NUMBER NARRATION LABEL, superseded by the converged
 *   fit-based limit ~4818.77M. The stable p~1.980 exponent rules out any convergent tail reaching
 *   4819.1M (that would need p far below 1), and the label lives only in imp-97482 prose, so nothing
 *   downstream that imports imp-97482 exports depends on it. This is a labelling correction, not a
 *   numerics change.
 *
 *   HONESTY: assessment only. The imp-97538 lambda_2 floor (-310.692227 .. -313.756) is untouched;
 *   the tr(A2) trace is a diagnostic, not the floor. No constant is pinned as rigorous; no bound
 *   moves; interval-rigorous reach stays 2a <= 0.96; PT Lambda <= 0.2 remains SOTA; RH open. NO QED.
 *
 * @see imp-97482-krein-route2-kbig-direct-projector-floor.js (source of the ~4819.1M prose label)
 * @see imp-97684-tra2-fifth-block-tail-confirmation.js (converged ~4818.77M limit + measured gap)
 * @see imp-97649-tra2-trace-tail-algebraic-honest-status.js (prior algebraic-tail status note)
 *
 * Ticket: imp-97797 (accuracy, opus-4-8, api-pool). Assessment / honest reclassification only;
 * no bound on Lambda moves; PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 */

import { IMP97482_A2_TRACE_BY_KBIG } from './imp-97482-krein-route2-kbig-direct-projector-floor.js';
import {
  IMP97684_EXTRAPOLATION,
  IMP97684_CROSSCHECK,
} from './imp-97684-tra2-fifth-block-tail-confirmation.js';

// Highest directly-built entry of the imp-97482 reproducing-kernel trace table (the eyeball anchor).
const IMP97482_TRACE_ANCHOR_K260 = IMP97482_A2_TRACE_BY_KBIG[260]; // 4818631331.255102
// Converged fit-based limit (geometric/Aitken on the newest uniform trio; algebraic agrees to ~4302).
const CONVERGED_TRACE_LIMIT = IMP97684_EXTRAPOLATION.L_geom_newRatioFromK960; // 4818769243.14
const NAMED_FIGURE = IMP97684_CROSSCHECK.imp97482NamedLimitM * 1e6; // 4819100000

const EYEBALL_RESIDUAL_TAIL = NAMED_FIGURE - IMP97482_TRACE_ANCHOR_K260; // ~468668.74 (~0.469M)
const FIT_RESIDUAL_TAIL = CONVERGED_TRACE_LIMIT - IMP97482_TRACE_ANCHOR_K260; // ~137911.88 (~0.138M)
const TAIL_OVERSHOOT = EYEBALL_RESIDUAL_TAIL - FIT_RESIDUAL_TAIL; // ~330756.86 (~0.331M)

export const IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION = Object.freeze({
  ticket: 'imp-97797',
  question:
    'should the imp-97482 named ~4819.1M tr(A2) figure be reclassified given the converged ~4818.77M ' +
    'fit-based trace limit, and where does the ~0.33M discrepancy originate inside the imp-97482 assembly?',
  // ORIGIN 1: the figure is prose-only, never a computed export.
  namedFigureOccursOnlyInProse: true, // 4 comment occurrences; not the value of any exported field
  namedFigureProseOccurrences: 4, // @fileoverview, A2_TRACE_BY_KBIG comment, FLOOR.summary, VERDICT.why
  namedFigureInheritedFrom: 'imp-97455', // imp-97482 @fileoverview: "toward the ~4819.1M limit imp-97455 named"
  imp97482HighestBuiltTrace: IMP97482_TRACE_ANCHOR_K260, // 4818631331.255102 (~4818.63M), Kbig=260
  namedFigureIsComputedExtrapolator: false, // no imp-97482 extrapolator returns 4819.1M
  // ORIGIN 2: the gap is the eyeball tail-sum overshoot above Kbig=260.
  convergedTraceLimit: CONVERGED_TRACE_LIMIT, // 4818769243.14
  namedFigure: NAMED_FIGURE, // 4819100000
  eyeballResidualTailAboveK260: EYEBALL_RESIDUAL_TAIL, // ~468668.74
  fitResidualTailAboveK260: FIT_RESIDUAL_TAIL, // ~137911.88
  tailOvershoot: TAIL_OVERSHOOT, // ~330756.86 == imp-97684 gapGeomToNamed
  tailOvershootMatchesMeasuredGap: Math.abs(TAIL_OVERSHOOT - IMP97684_CROSSCHECK.gapGeomToNamed) < 1.0,
  eyeballTailOverstatementFactor: EYEBALL_RESIDUAL_TAIL / FIT_RESIDUAL_TAIL, // ~3.4x
  gapRelative: IMP97684_CROSSCHECK.gapRelative, // 6.86e-5
  gapIsPrecisionDefect: false, // it is the pre-fit eyeball artifact, not any build error
  // RECLASSIFICATION verdict.
  reclassification:
    'DOWNGRADE the imp-97482 ~4819.1M from an implied converged reproducing-kernel trace limit to a ' +
    'PRE-FIT EYEBALL ROUND-NUMBER NARRATION LABEL (inherited from imp-97455), superseded by the ' +
    'converged fit-based limit ~4818.77M (p~1.980).',
  supersededByConvergedLimit: true,
  namedFigureReachableUnderStableExponent: IMP97684_CROSSCHECK.namedReachableUnderStableExponent, // false
  downstreamExportsDependOnNamedFigure: false, // label lives only in imp-97482 prose
  isLabellingCorrectionNotNumericsChange: true,
  // Honesty markers.
  lambda2FloorUntouched: true,
  anyBoundMoved: false,
  analyticConstantPinned: false,
  measurementOnly: true,
  isRigorous: false,
  operatorPositivityProved: false,
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.namedFigureOccursOnlyInProse === true &&
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.namedFigureIsComputedExtrapolator === false &&
    // the named figure sits ABOVE the highest actually-built trace and above the converged limit
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.namedFigure >
      IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.convergedTraceLimit &&
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.convergedTraceLimit >
      IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.imp97482HighestBuiltTrace &&
    // ORIGIN 2 identity: the gap IS the eyeball tail-sum overshoot, matching the imp-97684 measurement
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.eyeballResidualTailAboveK260 >
      IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.fitResidualTailAboveK260 &&
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.tailOvershootMatchesMeasuredGap === true &&
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.eyeballTailOverstatementFactor > 3 &&
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.gapIsPrecisionDefect === false &&
    // reclassification verdict
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.supersededByConvergedLimit === true &&
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.namedFigureReachableUnderStableExponent === false &&
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.downstreamExportsDependOnNamedFigure === false &&
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.isLabellingCorrectionNotNumericsChange === true &&
    // honesty gate
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.lambda2FloorUntouched === true &&
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.anyBoundMoved === false &&
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.analyticConstantPinned === false &&
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.measurementOnly === true &&
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.isRigorous === false &&
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.operatorPositivityProved === false &&
    IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION.qed === false
  )
) {
  throw new Error(
    'imp-97797-tra2-named-figure-reclassification assertion FAILED: the ~4819.1M must record as a ' +
      'prose-only pre-fit eyeball label whose ~0.33M gap equals the tail-sum overshoot above Kbig=260, ' +
      'superseded by the converged ~4818.77M fit-based limit.'
  );
}

export default IMP97797_TRA2_NAMED_FIGURE_RECLASSIFICATION;
