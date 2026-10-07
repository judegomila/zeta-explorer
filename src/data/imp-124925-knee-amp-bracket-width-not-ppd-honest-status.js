/**
 * @module imp-124925-knee-amp-bracket-width-not-ppd-honest-status
 * @fileoverview imp-124925 -- HONEST-STATUS NOTE restating, standalone, the imp-124771 finding that
 *   the knee E_flow amplification residual A ~ 9.40 (finest bracket W = 0.10, fine PPD = 120) is a
 *   finite-BRACKET-WIDTH artifact of the discrete D2 knee estimator, NOT a points-per-decade (PPD)
 *   discretization bias: PPD is proven stable (< 0.02% spread over PPD = 40..200) at that bracket,
 *   while narrowing W alone collapses the ~1.3% imp-97805-vs-imp-97804 gap down to ~0.3%. Documentation
 *   only: re-exports the imp-124771 verdict verbatim, no new numerics, no bound moves, NO QED.
 *
 * @see imp-124771-knee-amp-bracket-width-reconcile.js (source measurement: bracket-width ladder + PPD sweep)
 * @see imp-97804-knee-eflow-linear-expansion.js (closed-form A ~ 9.42, the W -> 0 target)
 * @see imp-97805-knee-eflow-amplification-ratio.js (discrete A ~ 9.54, PPD-refined at the baseline W = 0.25)
 *
 * Ticket: imp-124925 (content, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda moves;
 * PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 */

import {
  IMP124771_KNEE_AMP_BRACKET_WIDTH_RECONCILE as SRC,
} from './imp-124771-knee-amp-bracket-width-reconcile.js';

const FINE_A_W010 = SRC.fineA_W010;
const CLOSED_FORM_A = SRC.closedFormA;
const BASELINE_A_W025 = SRC.baselineA_W025;
const W010_PPD_SPREAD = SRC.w010PpdSpread;
const BASELINE_RESIDUAL_PCT = SRC.baselineResidualPct;
const FINE_RESIDUAL_PCT = SRC.fineResidualPct;
const RESIDUAL_COLLAPSE_FACTOR = SRC.residualCollapseFactor;

export const IMP124925_KNEE_AMP_BRACKET_WIDTH_NOT_PPD_HONEST_STATUS = Object.freeze({
  ticket: 'imp-124925',
  question:
    'imp-124909 flagged the ~1.3% gap between the imp-97805 discrete knee E_flow amplification ' +
    '(A ~ 9.54, PPD-refined at bracket width W = 0.25) and the imp-97804 closed-form A ~ 9.42 as an ' +
    'open residual. Is the A ~ 9.40 value the discrete estimator converges to at fine bracket width a ' +
    'PPD (points-per-decade) discretization bias of the D2 knee estimator, or a finite-bracket-width ' +
    'artifact?',
  answer:
    'Finite-bracket-width artifact, not a PPD bias. Holding a fine PPD = 120 (past the imp-97805 ' +
    `PPD-convergence point) and narrowing the bracket width W from 0.25 to 0.10 collapses A from ~${BASELINE_A_W025} ` +
    `to ~${FINE_A_W010}, matching the imp-97804 closed form ~${CLOSED_FORM_A} to ~${FINE_RESIDUAL_PCT}% -- a ` +
    `${RESIDUAL_COLLAPSE_FACTOR}x collapse of the ~${BASELINE_RESIDUAL_PCT}% baseline gap. PPD itself is exonerated: ` +
    `at the finest bracket W = 0.10 the amplification is PPD-stable to ~${W010_PPD_SPREAD} across PPD = 40..200. ` +
    'Both the imp-97805 and imp-124771 values are correct at their respective bracket widths; the ' +
    'imp-97804 closed form is the W -> 0 continuum limit of the same discrete D2 estimator. This is a ' +
    'conditional-share (sigma = E_coll/E_N) diagnostic on the inherited imp-3220/imp-3406 extrapolation, ' +
    'not a rigorous asymptotic. It establishes no operator positivity, moves no Lambda bound, and the ' +
    'imp-3066 K_a >= 0 gate is untouched.',
  fineA_W010: FINE_A_W010,
  closedFormA: CLOSED_FORM_A,
  baselineA_W025: BASELINE_A_W025,
  w010PpdSpread: W010_PPD_SPREAD,
  baselineResidualPct: BASELINE_RESIDUAL_PCT,
  fineResidualPct: FINE_RESIDUAL_PCT,
  residualCollapseFactor: RESIDUAL_COLLAPSE_FACTOR,
  isBracketWidthArtifact: true,
  isPpdDiscretizationBias: false,
  anyBoundMoved: false,
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    typeof IMP124925_KNEE_AMP_BRACKET_WIDTH_NOT_PPD_HONEST_STATUS.fineA_W010 === 'number' &&
    IMP124925_KNEE_AMP_BRACKET_WIDTH_NOT_PPD_HONEST_STATUS.fineA_W010 > 9.3 &&
    IMP124925_KNEE_AMP_BRACKET_WIDTH_NOT_PPD_HONEST_STATUS.fineA_W010 < 9.5 &&
    IMP124925_KNEE_AMP_BRACKET_WIDTH_NOT_PPD_HONEST_STATUS.w010PpdSpread < 0.01 &&
    IMP124925_KNEE_AMP_BRACKET_WIDTH_NOT_PPD_HONEST_STATUS.residualCollapseFactor > 3 &&
    IMP124925_KNEE_AMP_BRACKET_WIDTH_NOT_PPD_HONEST_STATUS.isBracketWidthArtifact === true &&
    IMP124925_KNEE_AMP_BRACKET_WIDTH_NOT_PPD_HONEST_STATUS.isPpdDiscretizationBias === false &&
    IMP124925_KNEE_AMP_BRACKET_WIDTH_NOT_PPD_HONEST_STATUS.anyBoundMoved === false &&
    IMP124925_KNEE_AMP_BRACKET_WIDTH_NOT_PPD_HONEST_STATUS.measurementOnly === true &&
    IMP124925_KNEE_AMP_BRACKET_WIDTH_NOT_PPD_HONEST_STATUS.isRigorous === false &&
    IMP124925_KNEE_AMP_BRACKET_WIDTH_NOT_PPD_HONEST_STATUS.qed === false
  )
) {
  throw new Error(
    'imp-124925-knee-amp-bracket-width-not-ppd-honest-status assertion FAILED: the fine-bracket knee ' +
      'amplification must land in the ~9.3-9.5 band close to the imp-97804 closed form, PPD must stay ' +
      'exonerated (< 1% spread), and the note must still be flagged as a non-rigorous, bound-free ' +
      'bracket-width (not PPD) artifact.'
  );
}

export default IMP124925_KNEE_AMP_BRACKET_WIDTH_NOT_PPD_HONEST_STATUS;
