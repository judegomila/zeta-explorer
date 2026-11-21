/**
 * @module imp-97524-krein-welloptimum-tail-converged-honest-status
 *
 * imp-97524 (content, sonnet-4-6, sonnet): standalone honest-status note recording the imp-97497
 * tail-converged well-capture scalar optimum, correcting the imp-97483 informal "~7.3" estimate.
 *
 * BACKGROUND. imp-97483 measured the minimum total int sigma_2 |psi|^2 for the band-limited
 * confinement family psi_hat_R(xi) = (1-(xi/a)^2)^2 exp(-(R xi)^2/2) at 2a = ln3, but the one-sided
 * grid truncation at T under-counted the slowly convergent ln t / t^2 far integrand, so the read-off
 * optimum drifted UP with T (6.56 -> 6.83 -> 6.97 -> 7.22 at T = 200/300/400/800) and was left
 * informally "converging ~7.3".
 *
 * FINDING -- THE TAIL-CONVERGED LIMIT IS 7.53 +- 0.01, ABOVE THE INFORMAL ESTIMATE. imp-97497
 * resolved the T -> inf limit using an endpoint-asymptotic far profile psi_R(t) ~ -(1/pi) g''(a)
 * sin(a t)/t^3 (validated to 0.01% against the exact cosine sum at t ~ 1000) plus exact sigma_2 for
 * the far integral. The result is self-consistent to 2e-6 across three exact/tail split points
 * (T0 = 600/800/1000: exact core grows 7.132 -> 7.271, analytic tail shrinks 0.403 -> 0.264, sum fixed
 * at 7.5352). The tail-converged optimum is tot(inf) = 7.53 +- 0.01 at R* ~ 3.36 (argmin shifts
 * marginally down from the finite-T 3.35) -- CORRECTING the imp-97483 informal "~7.3" upward by ~0.2,
 * not down.
 *
 * FINDING -- THE RATIO TO c_sharp IS 12.9x, NOT ~12.5x. With the measured c_sharp ~ 0.582 (imp-97206
 * upper bracket), 7.529 / 0.582 = 12.9x, sharpening the imp-97483 conclusion that the smooth
 * confinement radius cannot reach c_sharp: even fully tail-resolved, the best member of this
 * one-parameter family lands an order of magnitude above the spectral optimum.
 *
 * NO FIX APPLIED. This is a scoping/honest-status note, not a code defect -- it cross-indexes the
 * imp-97497 IMP97497_TAIL_CONVERGED_OPTIMUM finding as a standalone indexable module (glossary/audit
 * sweeps that grep for honest-status modules by filename, per imp-36209's finding that inline-only
 * corrections are not reliably discoverable). Read-only record; changes no bound; establishes no
 * operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-97497-krein-welloptimum-tail-converged.js (the tail-convergence measurement this note records)
 * @see imp-97483-krein-well-capture-vs-farfield-cost-tradeoff.js (the original informal "~7.3" estimate)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (measured c_sharp ~ 0.582 upper bracket)
 */

const INFORMAL_ESTIMATE = 7.3;
const TAIL_CONVERGED_TOTINF = 7.53;
const TAIL_CONVERGED_ERROR_BAR = 0.01;
const RSTAR_INF = 3.36;
const CSHARP_UPPER_BRACKET = 0.582;
const RATIO_TO_CSHARP = 12.9;

export const IMP97524_WELLOPTIMUM_HONEST_STATUS = {
  id: 'imp-97524',
  proofSection: 'audit',
  question:
    'Does the imp-97497 tail-converged well-capture optimum confirm or revise the imp-97483 informal ' +
    '"converging ~7.3" estimate, and what is its ratio to the measured c_sharp?',
  verdictShort:
    `REVISES UPWARD. The tail-converged limit is ${TAIL_CONVERGED_TOTINF} +- ${TAIL_CONVERGED_ERROR_BAR} ` +
    `at R* ~ ${RSTAR_INF} (self-consistent to 2e-6 across the exact/tail split point), ~0.2 above the ` +
    `informal ~${INFORMAL_ESTIMATE} estimate, giving ratio ${RATIO_TO_CSHARP}x (not ~12.5x) to the ` +
    `measured c_sharp ~ ${CSHARP_UPPER_BRACKET}.`,
  informalEstimate: INFORMAL_ESTIMATE,
  tailConvergedTotInf: TAIL_CONVERGED_TOTINF,
  tailConvergedErrorBar: TAIL_CONVERGED_ERROR_BAR,
  RstarInf: RSTAR_INF,
  csharpUpperBracket: CSHARP_UPPER_BRACKET,
  ratioToCsharp: RATIO_TO_CSHARP,
  correctionUpward: true,
  splitPointSelfConsistency: 2e-6,
  fixApplied: false,
  isRigorous: false,
  verdict:
    'AUDIT / HONEST-STATUS FINDING (no fix applied, no new measurement -- restates and cross-indexes ' +
    'the imp-97497 IMP97497_TAIL_CONVERGED_OPTIMUM finding as a standalone module). The imp-97483 ' +
    `truncation drift (6.56 -> 7.22) tail-converges to tot(inf) = ${TAIL_CONVERGED_TOTINF} +- ` +
    `${TAIL_CONVERGED_ERROR_BAR} at R* ~ ${RSTAR_INF}, correcting the informal "~${INFORMAL_ESTIMATE}" ` +
    `estimate upward by ~0.2, and gives ratio ${RATIO_TO_CSHARP}x to c_sharp ~ ${CSHARP_UPPER_BRACKET} ` +
    '(imp-97206), sharpening the informal ~12.5x. The smooth confinement scalar optimum stays an order ' +
    'of magnitude above the spectral optimum; the far-field cost is spectral, not a scalar the radius ' +
    'can dial away. Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97497-krein-welloptimum-tail-converged.js (IMP97497_TAIL_CONVERGED_OPTIMUM, the source finding ' +
    'this note records); imp-97483-krein-well-capture-vs-farfield-cost-tradeoff.js (the original ' +
    'informal "~7.3" estimate being corrected); imp-97206-krein-csharp-coupled-nt-jointlimit.js ' +
    '(measured c_sharp ~ 0.582 upper bracket).',
};

export const IMP97524_WELLOPTIMUM_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp97524-correction-is-upward-not-downward',
    description: 'the tail-converged optimum is recorded as ABOVE the informal estimate, not below',
    holds: () =>
      IMP97524_WELLOPTIMUM_HONEST_STATUS.tailConvergedTotInf >
        IMP97524_WELLOPTIMUM_HONEST_STATUS.informalEstimate &&
      IMP97524_WELLOPTIMUM_HONEST_STATUS.correctionUpward === true,
  },
  {
    id: 'imp97524-ratio-recorded-above-twelve',
    description: 'the ratio to c_sharp is recorded above 12x, sharper than the prior ~12.5x figure',
    holds: () =>
      IMP97524_WELLOPTIMUM_HONEST_STATUS.ratioToCsharp > 12 &&
      Math.abs(
        IMP97524_WELLOPTIMUM_HONEST_STATUS.tailConvergedTotInf / IMP97524_WELLOPTIMUM_HONEST_STATUS.csharpUpperBracket -
          IMP97524_WELLOPTIMUM_HONEST_STATUS.ratioToCsharp
      ) < 0.15,
  },
  {
    id: 'imp97524-no-fix-honesty-gate',
    description: 'honest-status finding only: no fix applied, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP97524_WELLOPTIMUM_HONEST_STATUS.fixApplied === false &&
      IMP97524_WELLOPTIMUM_HONEST_STATUS.isRigorous === false &&
      /NO QED/.test(IMP97524_WELLOPTIMUM_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(IMP97524_WELLOPTIMUM_HONEST_STATUS.verdict),
  },
];

for (const a of IMP97524_WELLOPTIMUM_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97524-krein-welloptimum-tail-converged-honest-status assertion failed: ${a.id}`);
  }
}

export default IMP97524_WELLOPTIMUM_HONEST_STATUS;
