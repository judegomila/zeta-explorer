/**
 * @module imp-97718-b1e6-wobble-subgap-retirement-assessment
 * @fileoverview imp-97718 -- BOOKKEEPING/ASSESSMENT (no fix, no new measurement, no bound moved).
 *   imp-97664 concluded the b=1e6 w_lin linErr spike is a genuine arithmetic b-fluctuation (NOT a
 *   phase-average window-width artifact), and additionally offered a causal attribution: that
 *   b=1e6=2^6*5^6 "happens to sample a larger deviation" than b=2e6=2^7*5^6 because of its smooth
 *   factorization. That attribution is baked into the imp-97696 cohort-index fileoverview text and
 *   into the named residual IMP97664_B_FLUCTUATION_GENUINE_NOT_WINDOW_ARTIFACT
 *   (imp-97696-wlin-kappa-smooth-wobble-floor-cohort-index.js). imp-97688 later tested that
 *   attribution directly (four denominators of comparable magnitude ~1e6, four different
 *   factorizations) and REFUTED it: the elevated linErr is factorization-INVARIANT at fixed
 *   magnitude, so the b=1e6 -> b=2e6 drop is a finite-b (magnitude) convergence effect, not a
 *   smoothness effect. imp-97713 already recorded that refutation as a standalone honest-status note.
 *
 *   THIS TICKET'S QUESTION. Does the imp-97688 refutation mean the imp-97664-derived sub-gap object
 *   (the named residual IMP97664_B_FLUCTUATION_GENUINE_NOT_WINDOW_ARTIFACT) should be RETIRED, and
 *   does the imp-97597 RESULT-3 mixed-kernel (epsilon*z^2) sub-gap still stand after the
 *   reconciliation?
 *
 *   ASSESSMENT -- RESTATE THE CAUSAL ATTRIBUTION, DO NOT RETIRE THE NAMED RESIDUAL. The named
 *   residual asserts two separate claims bundled under one identifier:
 *     (1) the b=1e6 spike is a GENUINE arithmetic fluctuation, not a window-width artifact -- this is
 *         an imp-97664 result about WINDOW HALF-WIDTH (varying half at fixed b=1e6) and imp-97688
 *         never tested window width; it tested FACTORIZATION at fixed magnitude. Claim (1) is
 *         UNTOUCHED and still holds.
 *     (2) the spike is attributable to b=1e6's smooth factorization (2^6*5^6) relative to b=2e6's
 *         (2^7*5^6) -- this incidental causal gloss IS refuted by imp-97688: four denominators of
 *         comparable magnitude but wildly different factorization (prime, 2^20, highly-composite,
 *         smooth) all give the SAME elevated linErr, so factorization is not the driver; magnitude is.
 *   Since claim (1) (what the named residual literally certifies -- "not a window artifact") stands,
 *   RETIRING the residual would be wrong: it would discard a still-valid result. Since claim (2) (the
 *   incidental factorization gloss, present only in imp-97696's prose, not in the residual's boolean
 *   fields) is refuted, the correct action is to RESTATE the causal explanation, not the residual
 *   itself -- which is exactly what imp-97713's standalone honest-status note already did. No further
 *   retirement or restatement of imp-97696 or imp-97664 is needed beyond that existing note.
 *
 *   RECONCILIATION CONFIRMED. Neither imp-97664's literal result nor imp-97688's refutation of its
 *   causal gloss touches the imp-97597 RESULT-3 epsilon*z^2 mixed Bettin-Conrey kernel coefficient
 *   sub-gap: both tickets operate entirely within the "wobble is real and unattributed to any
 *   controllable artifact" reading, and neither pins the analytic mixed-kernel scalar kappaK. The
 *   RESULT-3 sub-gap STANDS unchanged.
 *
 *   No coefficient newly pinned; no bound moves; the rigorous anchor stays the trace ceiling
 *   T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by >2600x; no operator positivity;
 *   Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *
 * @see imp-97664-wlin-b1e6-halfwidth-artifact-test.js (the named residual under assessment)
 * @see imp-97688-wlin-linerr-factorization-independence.js (refutes the factorization causal gloss)
 * @see imp-97713-wlin-linerr-magnitude-not-factorization-honest-status.js (the existing restatement note)
 * @see imp-97696-wlin-kappa-smooth-wobble-floor-cohort-index.js (carries the named residual + prose gloss)
 * @see imp-97597-route-m-psi-s-integral-rep-double-expansion.js (RESULT-3 mixed-kernel sub-gap, unaffected)
 */

export const IMP97718_ASSESSMENT = Object.freeze({
  id: 'imp-97718',
  proofSection: 'audit',
  question:
    'Does the imp-97688 refutation of the imp-97664 factorization attribution mean the ' +
    'IMP97664_B_FLUCTUATION_GENUINE_NOT_WINDOW_ARTIFACT named residual should be retired, and does ' +
    'the imp-97597 RESULT-3 eps*z^2 sub-gap still stand?',
  namedResidualUnderAssessment: 'IMP97664_B_FLUCTUATION_GENUINE_NOT_WINDOW_ARTIFACT',
  claimWindowArtifactRuledOut: true, // imp-97664's literal result (window-width vs genuine): UNTOUCHED
  claimFactorizationCausesSpike: false, // the incidental causal gloss: REFUTED by imp-97688
  windowWidthClaimTestedByImp97688: false, // imp-97688 tested factorization, not window width
  namedResidualShouldBeRetired: false,
  namedResidualShouldBeRestated: true,
  restatementAlreadyRecorded: true, // by imp-97713's standalone honest-status note
  result3MixedKernelSubGapStands: true,
  anyCoefficientNewlyPinned: false,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  verdict:
    'BOOKKEEPING/ASSESSMENT (no fix, no new measurement). The IMP97664_B_FLUCTUATION_GENUINE_NOT_' +
    'WINDOW_ARTIFACT residual bundles two claims: (1) the b=1e6 spike is genuine, not a window-width ' +
    'artifact -- untouched by imp-97688, which tested factorization at fixed magnitude, not window ' +
    'width -- and (2) an incidental causal gloss attributing the spike to smooth factorization -- ' +
    'refuted by imp-97688 (four factorizations at fixed magnitude give the same elevated linErr, so ' +
    'magnitude, not factorization, drives it). Because claim (1) still holds, the named residual ' +
    'should NOT be retired; only the causal gloss needed restating, which imp-97713 already did as a ' +
    'standalone honest-status note. No further action needed on imp-97696 or imp-97664. The ' +
    'imp-97597 RESULT-3 mixed-kernel (epsilon*z^2) sub-gap is untouched by either ticket and STANDS. ' +
    'No coefficient newly pinned; no bound moves; the rigorous anchor stays T = 2.594e7; compute ' +
    'binds first by >2600x; no operator positivity; PT Lambda <= 0.2 SOTA; RH open; NO QED.',
  citation:
    'imp-97664-wlin-b1e6-halfwidth-artifact-test.js (named residual under assessment); ' +
    'imp-97688-wlin-linerr-factorization-independence.js (refutes the causal gloss); ' +
    'imp-97713-wlin-linerr-magnitude-not-factorization-honest-status.js (existing restatement); ' +
    'imp-97696-wlin-kappa-smooth-wobble-floor-cohort-index.js (carries the residual + prose gloss); ' +
    'imp-97597-route-m-psi-s-integral-rep-double-expansion.js (RESULT-3 sub-gap, unaffected).',
});

export default IMP97718_ASSESSMENT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. --------------
const IMP97718_ASSERTIONS = [
  {
    id: 'imp97718-window-claim-untouched-factorization-claim-refuted',
    why: 'the two bundled claims must resolve oppositely: window-artifact ruled-out stands, ' +
      'factorization-causes-spike does not.',
    holds: () =>
      IMP97718_ASSESSMENT.claimWindowArtifactRuledOut === true &&
      IMP97718_ASSESSMENT.claimFactorizationCausesSpike === false &&
      IMP97718_ASSESSMENT.windowWidthClaimTestedByImp97688 === false,
  },
  {
    id: 'imp97718-retire-vs-restate-decision',
    why: 'since the literal residual (window-artifact ruled out) still holds, retirement is wrong; ' +
      'restatement (already done by imp-97713) is the correct and sufficient action.',
    holds: () =>
      IMP97718_ASSESSMENT.namedResidualShouldBeRetired === false &&
      IMP97718_ASSESSMENT.namedResidualShouldBeRestated === true &&
      IMP97718_ASSESSMENT.restatementAlreadyRecorded === true,
  },
  {
    id: 'imp97718-result3-subgap-stands',
    why: 'neither imp-97664 nor its imp-97688 refinement touches the imp-97597 RESULT-3 ' +
      'mixed-kernel scalar; the sub-gap must still be recorded as standing.',
    holds: () => IMP97718_ASSESSMENT.result3MixedKernelSubGapStands === true,
  },
  {
    id: 'imp97718-honesty-gate-no-qed',
    why: 'bookkeeping only: no coefficient newly pinned, no bound moved, honesty markers present.',
    holds: () =>
      IMP97718_ASSESSMENT.anyCoefficientNewlyPinned === false &&
      IMP97718_ASSESSMENT.anyBoundMoved === false &&
      IMP97718_ASSESSMENT.operatorPositivityEstablished === false &&
      IMP97718_ASSESSMENT.computeBindsFirst === true &&
      /NO QED/.test(IMP97718_ASSESSMENT.verdict) &&
      /PT Lambda <= 0.2/.test(IMP97718_ASSESSMENT.verdict) &&
      /RH open/.test(IMP97718_ASSESSMENT.verdict),
  },
];

for (const a of IMP97718_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97718-b1e6-wobble-subgap-retirement-assessment assertion failed: ${a.id}`);
  }
}

export { IMP97718_ASSERTIONS };
