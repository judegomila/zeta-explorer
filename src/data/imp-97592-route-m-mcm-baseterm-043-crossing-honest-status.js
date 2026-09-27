/**
 * @module imp-97592-route-m-mcm-baseterm-043-crossing-honest-status
 *
 * imp-97592 (content, sonnet-4-6, sonnet): standalone honest-status note recording the imp-97519
 * result -- the imp-97499 astronomically-remote 0.043 crossing is confirmed by direct exact-kernel
 * evaluation, changes no bound, and MCM stays verified at omega<=6 / refuted from omega=11.
 *
 * BACKGROUND. imp-97499 RESULT 3 solved the two-term law K0 + M0/ln x = thr for the level-1 MCM
 * base term c(x) = h(x) - h(2x) (scaled as c*x/ln x), placing the crossing below 0.045 at
 * x ~ 2.77e12 and below 0.043 only at the astronomically-remote x ~ 1.2737e31 -- but that ladder
 * was only baked to x = 1e14, fourteen-plus decades short of the predicted crossing.
 *
 * FINDING -- THE 0.043 CROSSING IS CONFIRMED, NOT AN EXTRAPOLATION ARTIFACT. imp-97519 directly
 * evaluated the exact Euler-Maclaurin kernel (mpmath, 80 dps) at x = exp(M0/(0.043-K0)) ~ 1.2737e31,
 * fourteen-plus decades past the x=1e14 baked ladder, and found c*x/ln x lands at 0.043 to
 * |scaled - 0.043| = 1.05e-67, with the residual scaled - K0 = 0.00133333 equalling M0/ln x =
 * 0.09549610599/ln x to 64 digits. The leftover kernel term (the entire deviation from the
 * two-term law) is itself 1.05e-67 = O(1/x^2), exactly as predicted.
 *
 * FINDING -- THE DRIFT TOWARD K0 = 1/24 IS CONFIRMED LOGARITHMIC, NOT POWER-LAW. Direct-kernel
 * scaled values at x = 1e14, 1e20, 1e25, 1e31, 1e40 all match K0 + M0/ln x, and the residual ratio
 * resid(1e14)/resid(1.2737e31) = 2.22179 equals ln(1.2737e31)/ln(1e14) exactly -- a power-law drift
 * x^{-p} for any p > 0 would give a ratio many orders of magnitude larger.
 *
 * NO FIX APPLIED. This is a scoping/honest-status note, not a code defect -- it cross-indexes the
 * imp-97519 IMP97519_VERDICT finding as a standalone indexable module (glossary/audit sweeps that
 * grep for honest-status modules by filename, per imp-36209's finding that inline-only corrections
 * are not reliably discoverable). Read-only record; changes no bound; establishes no operator
 * positivity; no RH verdict; NO QED. MCM stays VERIFIED at omega<=6 (measured, not proved) and is
 * FALSE from omega=11 per imp-97432; Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 * @see imp-97519-route-m-mcm-baseterm-043-crossing-spotcheck.js (the direct-kernel spot-check this note records)
 * @see imp-97499-route-m-mcm-baseterm-scaled-approach-K0.js (the original RESULT 3 crossing prediction)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted at omega=11)
 * @see imp-36209 (honest-status modules must be standalone-indexable by filename grep)
 */

const K0 = 1 / 24;
const M0 = 0.09549610599;
const CROSSING_X = 1.27372e31;
const CROSSING_SCALED = 0.043;
const ABS_DEVIATION_AT_CROSSING = 1.046e-67;
const RESIDUAL_RATIO_14_TO_31 = 2.22179;
const MCM_VERIFIED_UP_TO_OMEGA = 6;
const MCM_REFUTED_FROM_OMEGA = 11;

export const IMP97592_BASETERM_CROSSING_HONEST_STATUS = {
  id: 'imp-97592',
  proofSection: 'audit',
  question:
    'Does the imp-97499 astronomically-remote 0.043 crossing at x~1.2737e31 hold under direct ' +
    'exact-kernel evaluation, and does it move any bound?',
  verdictShort:
    `CONFIRMED, NO BOUND MOVED. Direct exact-kernel evaluation at x ~ ${CROSSING_X} lands c*x/ln x ` +
    `at ${CROSSING_SCALED} to ${ABS_DEVIATION_AT_CROSSING}, matching the two-term law K0 + M0/ln x ` +
    `exactly; the drift is confirmed logarithmic (residual ratio ${RESIDUAL_RATIO_14_TO_31} = ln-ratio). ` +
    `MCM stays verified at omega<=${MCM_VERIFIED_UP_TO_OMEGA} and refuted from omega=${MCM_REFUTED_FROM_OMEGA}.`,
  crossingX: CROSSING_X,
  crossingScaled: CROSSING_SCALED,
  absDeviationAtCrossing: ABS_DEVIATION_AT_CROSSING,
  residualRatio14to31: RESIDUAL_RATIO_14_TO_31,
  driftIsLogarithmic: true,
  driftIsPowerLaw: false,
  extrapolationArtifact: false,
  mcmVerifiedUpToOmega: MCM_VERIFIED_UP_TO_OMEGA,
  mcmRefutedFromOmega: MCM_REFUTED_FROM_OMEGA,
  anyBoundMoved: false,
  fixApplied: false,
  isRigorous: false,
  verdict:
    'AUDIT / HONEST-STATUS FINDING (no fix applied, no new measurement -- restates and cross-indexes ' +
    'the imp-97519 IMP97519_VERDICT finding as a standalone module). Direct exact-Euler-Maclaurin-kernel ' +
    `evaluation (mpmath 80 dps) confirms the imp-97499 RESULT 3 crossing at x ~ ${CROSSING_X}: c*x/ln x ` +
    `lands at ${CROSSING_SCALED} to ${ABS_DEVIATION_AT_CROSSING}, the residual equals M0/ln x = ` +
    `${M0}/ln x to 64 digits, and the drift toward K0=1/24 is 1/ln x not power-law (residual ratio ` +
    `${RESIDUAL_RATIO_14_TO_31} = ln-ratio exactly). MCM stays VERIFIED at omega<=${MCM_VERIFIED_UP_TO_OMEGA} ` +
    `(measured, not proved) and is FALSE from omega=${MCM_REFUTED_FROM_OMEGA} (imp-97432). Changes no ` +
    'bound; establishes no operator positivity; no RH verdict; NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-97519-route-m-mcm-baseterm-043-crossing-spotcheck.js (IMP97519_VERDICT, the source finding ' +
    'this note records); imp-97499-route-m-mcm-baseterm-scaled-approach-K0.js (the original RESULT 3 ' +
    'crossing prediction); imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted at omega=11).',
};

export const IMP97592_BASETERM_CROSSING_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp97592-crossing-confirmed-not-artifact',
    description: 'the 0.043 crossing is recorded as confirmed by direct evaluation, not an extrapolation artifact',
    holds: () =>
      IMP97592_BASETERM_CROSSING_HONEST_STATUS.extrapolationArtifact === false &&
      Math.abs(IMP97592_BASETERM_CROSSING_HONEST_STATUS.crossingScaled - 0.043) < 1e-9 &&
      IMP97592_BASETERM_CROSSING_HONEST_STATUS.absDeviationAtCrossing < 1e-60,
  },
  {
    id: 'imp97592-drift-recorded-logarithmic',
    description: 'the drift toward K0=1/24 is recorded as logarithmic (1/ln x), not power-law',
    holds: () =>
      IMP97592_BASETERM_CROSSING_HONEST_STATUS.driftIsLogarithmic === true &&
      IMP97592_BASETERM_CROSSING_HONEST_STATUS.driftIsPowerLaw === false &&
      IMP97592_BASETERM_CROSSING_HONEST_STATUS.residualRatio14to31 > 2 &&
      IMP97592_BASETERM_CROSSING_HONEST_STATUS.residualRatio14to31 < 3,
  },
  {
    id: 'imp97592-mcm-status-and-no-fix-honesty-gate',
    description: 'MCM stays verified<=6/refuted-from-11, no bound moved, no fix, no QED, PT stays SOTA',
    holds: () =>
      IMP97592_BASETERM_CROSSING_HONEST_STATUS.mcmVerifiedUpToOmega === 6 &&
      IMP97592_BASETERM_CROSSING_HONEST_STATUS.mcmRefutedFromOmega === 11 &&
      IMP97592_BASETERM_CROSSING_HONEST_STATUS.anyBoundMoved === false &&
      IMP97592_BASETERM_CROSSING_HONEST_STATUS.fixApplied === false &&
      IMP97592_BASETERM_CROSSING_HONEST_STATUS.isRigorous === false &&
      /NO QED/.test(IMP97592_BASETERM_CROSSING_HONEST_STATUS.verdict) &&
      /remains SOTA/.test(IMP97592_BASETERM_CROSSING_HONEST_STATUS.verdict),
  },
];

for (const a of IMP97592_BASETERM_CROSSING_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97592-route-m-mcm-baseterm-043-crossing-honest-status assertion failed: ${a.id}`);
  }
}

export default IMP97592_BASETERM_CROSSING_HONEST_STATUS;
