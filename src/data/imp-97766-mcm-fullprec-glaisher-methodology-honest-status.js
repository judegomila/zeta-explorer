/**
 * @module imp-97766-mcm-fullprec-glaisher-methodology-honest-status
 * @fileoverview imp-97766 -- HONEST-STATUS NOTE restating the imp-97736 RESULT 4 methodology
 *   finding as a standalone, directly citable status note. imp-97736 found that extending the
 *   imp-97724 MCM kernel-precision cap-scaling ladder past dps ~ 30 REQUIRES a full-precision
 *   Glaisher-Kinkelin constant: the imp-97432 17-digit literal carries a fixed 6.25e-17 error that
 *   swamps the true recovered-remainder tail rr ~ 1/(720 d^2) once d exceeds ~5e6, so a dps=36 run
 *   built on that literal SATURATES at cap ~4.7e6 instead of continuing the eps^{-1/4} climb (the
 *   full-precision constant instead measures 45836990). The further dps=42 rung needs faithful
 *   term-by-term summation of ~2.4e9 terms (~3 h single-threaded) and was NOT run -- a named,
 *   honestly-flagged STANDING SUB-GAP; its d*(42) ~ 1e9 figure is a slow-log MODEL extrapolation,
 *   not a measurement, and must not be cited as one. Documentation only: no new numerics, no bound
 *   moves, the omega=10 gap and omega=11 MCM onset are untouched by this cap-scaling detail either
 *   way. NO QED.
 *
 * @see imp-97736-mcm-cap-jitter-dps36.js (source measurement: RESULT 4 saturation + infeasible rung)
 * @see imp-97724-mcm-dps-cap-scaling-fit.js (the ladder being extended; dps 16/24/30 caps)
 * @see imp-97746-mcm-dps-cap-scaling-viz-data.js (viz-data leaf charting the ladder)
 *
 * Ticket: imp-97766 (content, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda
 * moves; MCM stays refuted from omega=11; PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 */

import { IMP97736_CAP_JITTER, IMP97736_HONEST_BANNER } from './imp-97736-mcm-cap-jitter-dps36.js';

export const IMP97766_MCM_FULLPREC_GLAISHER_METHODOLOGY_HONEST_STATUS = Object.freeze({
  ticket: 'imp-97766',
  question:
    'can the imp-97724 MCM kernel-precision cap-scaling ladder be extended past dps=30 using the ' +
    'same 17-digit Glaisher-Kinkelin literal, and is a dps=42 rung available?',
  answer:
    'No: past dps ~ 30 the ladder REQUIRES a full-precision Glaisher constant. The 17-digit literal ' +
    'carries a fixed 6.25e-17 error that swamps the true tail rr ~ 1/(720 d^2) once d exceeds ~5e6, ' +
    'so a dps=36 run built on that literal saturates at cap ~4.7e6 -- collapsing the eps^{-1/4} ' +
    'scaling -- while a consistent full-precision constant measures the correct dps=36 cap 45836990. ' +
    'The requested dps=42 rung needs faithful term-by-term summation of ~2.4e9 terms (~3 h ' +
    'single-threaded) and was NOT measured: it is a named, standing sub-gap. Its d*(42) ~ 1e9 figure ' +
    'is a slow-log MODEL extrapolation only, not a measurement, and must be labelled as such wherever ' +
    'it is cited.',
  literalConstantError: IMP97736_CAP_JITTER.glaisherDeltaFlipsCap, // 6.25e-17
  dps36SaturatesWith17digitLiteral: IMP97736_CAP_JITTER.dps36SaturatesWith17digitLiteral, // 4707060
  dps36FullPrecisionMeasured: IMP97736_CAP_JITTER.dps36Snr1Measured, // 45836990
  saturationRatio:
    IMP97736_CAP_JITTER.dps36Snr1Measured / IMP97736_CAP_JITTER.dps36SaturatesWith17digitLiteral, // ~9.74x
  dps42Measured: IMP97736_CAP_JITTER.dps42Measured, // false
  dps42EstimatedTerms: 2.4e9,
  dps42EstimatedWallClockHours: 3,
  dps42ModelExtrapolationSnr1: IMP97736_CAP_JITTER.dps42ModelExtrapolationSnr1, // [0.96e9, 1.4e9]
  dps42IsMeasurement: false,
  standingSubGap: true,
  methodologyFixRequired: 'full-precision Glaisher-Kinkelin constant for any dps >= 30 rung',
  onsetOmega: IMP97736_CAP_JITTER.onsetOmega, // 11
  gapOmega10: IMP97736_CAP_JITTER.gapOmega10, // 7.520578537e-5
  ceilingTouched: IMP97736_CAP_JITTER.ceilingTouched, // false
  anyBoundMoved: IMP97736_CAP_JITTER.anyBoundMoved, // false
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP97766_MCM_FULLPREC_GLAISHER_METHODOLOGY_HONEST_STATUS.dps36SaturatesWith17digitLiteral <
      IMP97766_MCM_FULLPREC_GLAISHER_METHODOLOGY_HONEST_STATUS.dps36FullPrecisionMeasured &&
    IMP97766_MCM_FULLPREC_GLAISHER_METHODOLOGY_HONEST_STATUS.saturationRatio > 5 &&
    IMP97766_MCM_FULLPREC_GLAISHER_METHODOLOGY_HONEST_STATUS.dps42Measured === false &&
    IMP97766_MCM_FULLPREC_GLAISHER_METHODOLOGY_HONEST_STATUS.dps42IsMeasurement === false &&
    IMP97766_MCM_FULLPREC_GLAISHER_METHODOLOGY_HONEST_STATUS.standingSubGap === true &&
    Array.isArray(IMP97766_MCM_FULLPREC_GLAISHER_METHODOLOGY_HONEST_STATUS.dps42ModelExtrapolationSnr1) &&
    IMP97766_MCM_FULLPREC_GLAISHER_METHODOLOGY_HONEST_STATUS.dps42ModelExtrapolationSnr1.length === 2 &&
    IMP97766_MCM_FULLPREC_GLAISHER_METHODOLOGY_HONEST_STATUS.onsetOmega === 11 &&
    IMP97766_MCM_FULLPREC_GLAISHER_METHODOLOGY_HONEST_STATUS.ceilingTouched === false &&
    IMP97766_MCM_FULLPREC_GLAISHER_METHODOLOGY_HONEST_STATUS.anyBoundMoved === false &&
    IMP97766_MCM_FULLPREC_GLAISHER_METHODOLOGY_HONEST_STATUS.measurementOnly === true &&
    IMP97766_MCM_FULLPREC_GLAISHER_METHODOLOGY_HONEST_STATUS.isRigorous === false &&
    IMP97766_MCM_FULLPREC_GLAISHER_METHODOLOGY_HONEST_STATUS.qed === false &&
    /NO QED/.test(IMP97736_HONEST_BANNER) &&
    /SUB-GAP/.test(IMP97736_HONEST_BANNER)
  )
) {
  throw new Error(
    'imp-97766-mcm-fullprec-glaisher-methodology-honest-status assertion FAILED: the dps>=30 ' +
      'methodology fix (full-precision Glaisher constant) and the dps=42 infeasible-sub-gap status ' +
      'must both hold as recorded.'
  );
}

export default IMP97766_MCM_FULLPREC_GLAISHER_METHODOLOGY_HONEST_STATUS;
