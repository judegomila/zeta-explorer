/**
 * @module imp-97348-e1-fp-precision-honest-status
 *
 * imp-97348 (content, sonnet-4-6, sonnet): standalone honest-status note recording the imp-97315
 * FP-precision refinement of imp-97291's floating-point-trustworthiness claim for the Route M
 * b/4-ceiling ratio r(b) = |E1(b)| / (b/4).
 *
 * BACKGROUND. imp-97291 measured the fast Glaisher-Kinkelin per-divisor evaluator E1fastFromPrimes
 * and asserted it stays "trustworthy to ~6 decimals for b <~ 2.5e9". imp-97315 cross-checked that
 * evaluator against the independent DIRECT exact O(b) coprime-sum evaluator measureE1 on the
 * consecutive-prime semiprime ladder up to b = 9973*10007 = 99799811 (~1e8).
 *
 * FINDING -- NEITHER EVALUATOR IS 6-DECIMAL-TRUSTWORTHY AT b ~ 1e8; THE imp-97291 FIGURE IS
 * OPTIMISTIC. The two evaluators agree to <6e-7 in ratio only up to b <~ 1e6. Past that they diverge
 * FASTER than 6e-7 (3.65e-5 at b=8999999, 1.10e-4 at b=99799811), because the direct O(b) sum ALSO
 * loses precision: it cancels ~b terms of size ~b log b down to a result of size ~b/4, so it is not
 * a precision-free ground truth at large b either. Both evaluators BRACKET the true ratio but neither
 * is 6-decimal-trustworthy at b ~ 1e8 -- the imp-97291 "6 decimals to b <~ 2.5e9" reach is optimistic
 * for the last decimals past ~1e7.
 *
 * WHAT SURVIVES. The qualitative MONOTONE CLIMB of r_exact(b) toward 1 across the whole ladder
 * (0.933493584 at 71*73 to 0.999076521 at 9973*10007) is unaffected by this precision ceiling: it is
 * a coarse trend, not a last-decimal claim, and both evaluators agree on its direction and shape.
 *
 * NO FIX APPLIED. This is a scoping/honest-status finding, not a code defect -- it corrects the
 * PRECISION-REACH claim of imp-97291's docstring, already recorded inline as
 * IMP97315_RESULTS.honestRefinement in imp-97315-route-m-e1-direct-exact-ratio-crosscheck.js. This
 * standalone module exists so the correction is independently indexable (glossary/audit sweeps that
 * grep for honest-status modules by filename, per imp-36209's finding that inline-only corrections
 * are not reliably discoverable). Read-only record; changes no bound; establishes no operator
 * positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-97315-route-m-e1-direct-exact-ratio-crosscheck.js (the direct-vs-fast cross-check this note records)
 * @see imp-97291-route-m-e1-wide-composite-ratio-sweep.js (the fast Gasymp evaluator and the original "6 decimals to 2.5e9" claim)
 */

const AGREEMENT_THRESHOLD = 6e-7;
const AGREEMENT_HOLDS_BELOW_B = 1e6;
const WORST_MEASURED_B = 99799811;
const WORST_MEASURED_DIFF = 1.1e-4;
const ORIGINAL_CLAIM_REACH_B = 2.5e9;

export const IMP97348_E1_FP_PRECISION_HONEST_STATUS = {
  id: 'imp-97348',
  proofSection: 'audit',
  question:
    'Is either the direct exact O(b) coprime-sum evaluator or the fast Gasymp per-divisor evaluator ' +
    '6-decimal-trustworthy for the ratio r(b) = |E1(b)| / (b/4) at b ~ 1e8, as the imp-97291 ' +
    `"trustworthy to ~6 decimals for b <~ ${ORIGINAL_CLAIM_REACH_B.toExponential(1)}" figure implies?`,
  verdictShort:
    `NO. The direct exact and fast Gasymp evaluators agree to <${AGREEMENT_THRESHOLD.toExponential(0)} ` +
    `in ratio only for b <~ ${AGREEMENT_HOLDS_BELOW_B.toExponential(0)}; by b = ${WORST_MEASURED_B} ` +
    `they diverge to ${WORST_MEASURED_DIFF.toExponential(2)}, because the direct O(b) sum also loses ` +
    'precision cancelling ~b terms of size ~b log b down to a result ~b/4. Neither evaluator is a ' +
    `precision-free ground truth at b ~ 1e8, so the imp-97291 "6 decimals to ${ORIGINAL_CLAIM_REACH_B.toExponential(1)}" reach is optimistic past ~1e7.`,
  agreementThreshold: AGREEMENT_THRESHOLD,
  agreementHoldsBelowB: AGREEMENT_HOLDS_BELOW_B,
  worstMeasuredB: WORST_MEASURED_B,
  worstMeasuredDiff: WORST_MEASURED_DIFF,
  originalClaimReachB: ORIGINAL_CLAIM_REACH_B,
  monotoneClimbSurvives: true,
  fixApplied: false,
  isRigorous: false,
  verdict:
    'AUDIT / HONEST-STATUS FINDING (no fix applied, no new measurement -- restates and cross-indexes ' +
    'the imp-97315 IMP97315_RESULTS.honestRefinement finding as a standalone module). Neither the ' +
    'direct exact O(b) coprime-sum evaluator nor the fast Gasymp per-divisor evaluator is 6-decimal- ' +
    `trustworthy at b ~ 1e8: they agree to <${AGREEMENT_THRESHOLD.toExponential(0)} only below ` +
    `b <~ ${AGREEMENT_HOLDS_BELOW_B.toExponential(0)}, diverging to ${WORST_MEASURED_DIFF.toExponential(2)} ` +
    `by b = ${WORST_MEASURED_B}. The imp-97291 "trustworthy to ~6 decimals for b <~ ${ORIGINAL_CLAIM_REACH_B.toExponential(1)}" ` +
    'figure is optimistic for the last decimals past ~1e7. The qualitative monotone climb of r(b) ' +
    'toward 1 is unaffected -- it is a coarse trend both evaluators agree on, not a last-decimal claim. ' +
    'Changes no bound; establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97315-route-m-e1-direct-exact-ratio-crosscheck.js (IMP97315_RESULTS.honestRefinement, the ' +
    'source finding this note records); imp-97291-route-m-e1-wide-composite-ratio-sweep.js (the ' +
    'original "6 decimals to 2.5e9" claim being refined).',
};

export const IMP97348_E1_FP_PRECISION_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp97348-agreement-window-recorded',
    description: 'the <6e-7 agreement window is recorded as holding only below b <~ 1e6',
    holds: () =>
      IMP97348_E1_FP_PRECISION_HONEST_STATUS.agreementThreshold === AGREEMENT_THRESHOLD &&
      IMP97348_E1_FP_PRECISION_HONEST_STATUS.agreementHoldsBelowB === AGREEMENT_HOLDS_BELOW_B,
  },
  {
    id: 'imp97348-worst-divergence-exceeds-threshold',
    description: 'the worst measured divergence at b ~ 1e8 exceeds the 6e-7 threshold',
    holds: () =>
      IMP97348_E1_FP_PRECISION_HONEST_STATUS.worstMeasuredDiff >
      IMP97348_E1_FP_PRECISION_HONEST_STATUS.agreementThreshold,
  },
  {
    id: 'imp97348-monotone-climb-survives',
    description: 'the qualitative monotone-climb trend is recorded as unaffected by the precision ceiling',
    holds: () => IMP97348_E1_FP_PRECISION_HONEST_STATUS.monotoneClimbSurvives === true,
  },
  {
    id: 'imp97348-no-fix-honesty-gate',
    description: 'honest-status finding only: no fix applied, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP97348_E1_FP_PRECISION_HONEST_STATUS.fixApplied === false &&
      IMP97348_E1_FP_PRECISION_HONEST_STATUS.isRigorous === false &&
      /NO QED/.test(IMP97348_E1_FP_PRECISION_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(IMP97348_E1_FP_PRECISION_HONEST_STATUS.verdict),
  },
];

for (const a of IMP97348_E1_FP_PRECISION_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97348-e1-fp-precision-honest-status assertion failed: ${a.id}`);
  }
}

export default IMP97348_E1_FP_PRECISION_HONEST_STATUS;
