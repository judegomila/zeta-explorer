/**
 * @module imp-97673-gap-law-decay-subgap-precision-limited-honest-status
 * @fileoverview imp-97673 -- HONEST-STATUS NOTE recording, standalone, the imp-97640 named sub-gap
 *   IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6: the Route M MCM gap-law residual
 *   decay exponent q could not be pinned firmly past p ~ 2e6 in IEEE double, because the residual is
 *   a 7-sig-fig catastrophic-cancellation difference of two ~1.15e-2 quantities (imp-2546 storage
 *   rule), leaving only ~3 significant figures. This note records the sub-gap AS NAMED and, so it is
 *   never read as still-open, also records that imp-97659 already answered the exact question the
 *   sub-gap raised via an extended-precision (mpmath dps=30) recompute: the exponent neither climbs
 *   nor saturates, it OSCILLATES. Documentation only: no new numerics, no bound moves, NO QED.
 *
 * @see imp-97640-route-m-gap-law-residual-decay-exponent.js (the sub-gap as originally named)
 * @see imp-97659-route-m-gap-law-decay-extprec.js (the dps=30 recompute that resolved it)
 *
 * Ticket: imp-97673 (content, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda moves;
 * PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 */

import { IMP97640_RESULTS, IMP97640_VERDICT } from './imp-97640-route-m-gap-law-residual-decay-exponent.js';
import { IMP97659_RESULTS, IMP97659_VERDICT } from './imp-97659-route-m-gap-law-decay-extprec.js';

export const IMP97673_SUBGAP_PRECISION_LIMITED_HONEST_STATUS = Object.freeze({
  ticket: 'imp-97673',
  subGapName: 'IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6',
  subGapAsNamed:
    'the Route M gap-law residual (gap - e^{-gamma}*B_inf/log p) is a 7-sig-fig catastrophic-cancellation ' +
    'difference of two ~1.15e-2 quantities, so |residual| ~ 1e-6 carries only ~3 significant figures past ' +
    'p ~ 2e6 in IEEE double -- the third imp-97640 ladder rung (residual ratio 1.25) cannot confirm whether ' +
    'the local decay exponent keeps climbing or eventually saturates at a fixed power.',
  subGapPrecisionLimited: IMP97640_VERDICT.precisionLimitedPast2e6, // true
  namedSubGapMatches: IMP97640_RESULTS.subGap === 'IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6',
  subGapSubsequentlyResolved: true, // recorded here so this note is never read as still-open
  resolvedByTicket: 'imp-97659',
  resolvedSubGapName: IMP97659_RESULTS.subGapResolved, // 'IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6'
  resolutionMethod:
    'extended-precision (mpmath dps=30, live sieve to p=1e8) recompute of gap AND law at the imp-97639 ' +
    'deep heights (p ~ 5e7 and beyond), reproducing the imp-97640 anchor rung before extrapolating',
  resolutionAnswer: IMP97659_VERDICT.answerNeitherItOscillates, // true -- exponent neither climbs nor saturates
  resolutionHasNegativeLocalExponent: IMP97659_VERDICT.hasNegativeLocalExponent, // true
  climbingReadingWasSparseArtifact: IMP97659_VERDICT.climbingWasSparseArtifact, // true
  mcmRefuted: IMP97659_VERDICT.mcmRefuted, // true
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

export const IMP97673_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. This note records the imp-97640 named sub-gap ' +
  'IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6 (the gap-law residual decay exponent is ' +
  'undecidable in IEEE double past p ~ 2e6, a 7-sig-fig catastrophic-cancellation floor) AND that imp-97659 ' +
  'already resolved it: the dps=30 extended-precision recompute shows the exponent neither climbs nor ' +
  'saturates -- it OSCILLATES (q_local from -6.738 to +28.721, with a negative rung). MCM refuted from ' +
  'omega=11; no bound moved.';

export default IMP97673_SUBGAP_PRECISION_LIMITED_HONEST_STATUS;

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP97673_SUBGAP_PRECISION_LIMITED_HONEST_STATUS.subGapPrecisionLimited === true &&
    IMP97673_SUBGAP_PRECISION_LIMITED_HONEST_STATUS.namedSubGapMatches === true &&
    IMP97673_SUBGAP_PRECISION_LIMITED_HONEST_STATUS.subGapSubsequentlyResolved === true &&
    IMP97673_SUBGAP_PRECISION_LIMITED_HONEST_STATUS.resolutionAnswer === true &&
    IMP97673_SUBGAP_PRECISION_LIMITED_HONEST_STATUS.resolutionHasNegativeLocalExponent === true &&
    IMP97673_SUBGAP_PRECISION_LIMITED_HONEST_STATUS.climbingReadingWasSparseArtifact === true &&
    IMP97673_SUBGAP_PRECISION_LIMITED_HONEST_STATUS.mcmRefuted === true &&
    IMP97673_SUBGAP_PRECISION_LIMITED_HONEST_STATUS.anyBoundMoved === false &&
    IMP97673_SUBGAP_PRECISION_LIMITED_HONEST_STATUS.operatorPositivityEstablished === false &&
    IMP97673_SUBGAP_PRECISION_LIMITED_HONEST_STATUS.measurementOnly === true &&
    IMP97673_SUBGAP_PRECISION_LIMITED_HONEST_STATUS.isRigorous === false &&
    IMP97673_SUBGAP_PRECISION_LIMITED_HONEST_STATUS.qed === false &&
    /NO QED/.test(IMP97673_HONEST_BANNER) &&
    /PT Lambda <= 0.2/.test(IMP97673_HONEST_BANNER) &&
    /RH open/.test(IMP97673_HONEST_BANNER)
  )
) {
  throw new Error(
    'imp-97673-gap-law-decay-subgap-precision-limited-honest-status assertion FAILED: the imp-97640 named ' +
      'sub-gap and its imp-97659 resolution must both be recorded consistently.'
  );
}
