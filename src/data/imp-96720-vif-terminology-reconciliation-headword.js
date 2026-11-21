/**
 * @module imp-96720-vif-terminology-reconciliation-headword
 * @fileoverview imp-96720 -- import-light glossary/Concepts headword reconciling two
 *   UNRELATED quantities that share the name "VIF" and risk conflation:
 *   (a) imp-96638/imp-96617/imp-96593: the box sine-kernel NUMBER-VARIANCE VIF
 *       (VIF_291, values << 1, e.g. 0.0334/0.0055/0.0197) used in the conditional
 *       sine-kernel deficiency certificate -- imp-96638 found the closed-form tail
 *       cannot serve as a certified ONE-SIDED upper bound for this VIF because its
 *       finite-L correction sign is oscillatory (two-sided approximation only).
 *   (b) imp-96692/imp-96719: the Route M reach-projection DRIFT-COVARIANCE VIF
 *       (AR(1) proxy, VIF ~ 2.578, "~2.6"), a red-noise inflation factor MEASURED
 *       directly from the serial correlation of the imp-96487 21-rung ratio
 *       ladder -- unrelated to the box sine-kernel closed form or its sign.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   Both quantities are labelled "VIF" (variance-inflation factor) and both sit in
 *   the S-frontier proof section, so a reader skimming titles could wrongly infer
 *   that imp-96692's measured VIF ~ 2.6 is a numeric update to, or resolution of,
 *   the imp-96638 one-sided-bound question. It is neither: the two VIFs are
 *   computed from different data (a box sine-kernel lag-correlation closed form
 *   vs. a Route M ladder's empirical autocorrelation), answer different questions
 *   (a conditional sine-kernel deficiency certificate vs. a reach-projection
 *   variance correction), and even have different orders of magnitude and sign
 *   conventions (imp-96638's VIF_291 << 1, a deficiency below 1; imp-96692's
 *   VIF ~ 2.6, an inflation above 1). This headword bakes both verdicts verbatim
 *   side by side (no re-import of either module, to stay import-light) so the two
 *   are never merged into one narrative.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) imp-96638's VIF is a NUMBER-VARIANCE deficiency factor VIF_291 = 1 +
 *   2*sum(bartlett(k)*rho_k) for the box sine-kernel pair-correlation lag series,
 *   with rigorous conditional values around 0.0334 (z >= 10.52) and an actual
 *   finite-window value ~ 0.0055 (z ~ 26.0) -- all well BELOW 1. Whether the
 *   imp-96567 closed-form tail is a certified ONE-SIDED (upper) bound on the true
 *   finite-L box correlation remains OPEN: imp-96617 measured the finite-L
 *   correction's sign as oscillatory (not one-signed), so the closed form is only
 *   a two-sided ~6-7-digit approximation, not a one-sided certificate (imp-96628
 *   has since certified a two-sided |DeltaCov_k| <= C(k)/L^2 envelope, which does
 *   NOT resolve the one-sided question).
 *   (b) imp-96692's VIF is a DRIFT-COVARIANCE inflation factor for the Route M
 *   reach projection, VIF = 1 + 2*sum(rho_k) applied to the mean of 21 ladder
 *   rungs with measured lag-1 correlation phi1 = 0.4410, giving AR(1) proxy
 *   VIF = 2.578 (primary; brackets 2.136-4.645) -- well ABOVE 1. This measurement
 *   is complete and closed (imp-96719 glosses it); it says nothing about, and
 *   does not move, the imp-96638 one-sided-bound question.
 *
 *   STATUS: a terminology-disambiguation headword, not a new measurement. Neither
 *   underlying finding is revised.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup preventing conflation of two same-named but unrelated
 *   quantities. It establishes nothing, instantiates no interval, closes no
 *   sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96638-box-sine-kernel-two-sided-approx-glossary-headword.js (VIF sense (a): one-sided-bound question, still open)
 * @see imp-96593-vif-exact-tail-rigor-upgrade-assessment.js (source of the number-variance VIF_291 convention)
 * @see imp-96692-route-m-reach-drift-covariance-inflation.js (VIF sense (b): measured drift-covariance inflation ~2.578)
 * @see imp-96719-route-m-drift-covariance-reach-inflation-glossary-headword.js (glossary headword for VIF sense (b))
 *
 * Ticket: imp-96720 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The VIF-terminology reconciliation headword, baked verbatim (no re-import).
const VIF_TERMINOLOGY_RECONCILIATION_HEADWORD = Object.freeze({
  key: 'vif-terminology-two-unrelated-senses-not-conflatable',
  term:
    'Two S-frontier quantities are both named "VIF" but are UNRELATED: (a) the ' +
    'box sine-kernel number-variance deficiency VIF_291 << 1 (imp-96593/imp-96638, ' +
    'one-sided-bound question still OPEN) and (b) the Route M drift-covariance ' +
    'inflation VIF ~ 2.578 (imp-96692/imp-96719, measurement CLOSED). Neither ' +
    'resolves or updates the other.',
  definition:
    'Sense (a), imp-96638: VIF_291 = 1 + 2*sum_k bartlett(k)*rho_k for the box ' +
    'sine-kernel pair-correlation lag series, a DEFICIENCY factor with rigorous ' +
    'conditional value ~ 0.0334 (z >= 10.52) and actual finite-window value ' +
    '~ 0.0055 (z ~ 26.0) -- values well below 1. imp-96617 found the imp-96567 ' +
    'closed-form tail is only a two-sided ~6-7-digit APPROXIMATION to the true ' +
    'finite-L correlation (the O(1/L) finite-L correction sign is oscillatory, ' +
    'lag-alternating), so it is NOT a certified one-sided upper bound for VIF_291 ' +
    '-- this question remains OPEN regardless of any other VIF measurement. ' +
    'Sense (b), imp-96692: VIF = 1 + 2*sum_k rho_k applied to the mean of the ' +
    'imp-96487 21-rung ratio ladder, an INFLATION factor with AR(1) proxy value ' +
    '2.578 (bracket 2.136-4.645) driven by measured lag-1 correlation ' +
    'phi1 = 0.4410 -- a value well above 1. This is a direct empirical ' +
    'measurement from a different ladder entirely, already glossed by imp-96719, ' +
    'and complete on its own terms.',
  mechanism:
    'The shared name "VIF" (variance-inflation factor) is the generic Bartlett ' +
    'formula 1 + 2*sum(weight(k)*rho_k) for correlated-sample variance, applied ' +
    'to two DIFFERENT input series for two DIFFERENT purposes: series (a) is a ' +
    'theoretical box sine-kernel pair-correlation closed form feeding a ' +
    'conditional sine-kernel deficiency certificate (values << 1, since box-kernel ' +
    'lag correlations there are negative); series (b) is an empirical ' +
    'autocorrelation of a Route M reach-projection ladder feeding a reach/gap-floor ' +
    'correction (values > 1, since the ladder drift is positively correlated). ' +
    'Applying the same formula name to unrelated inputs does not create a ' +
    'mathematical relationship between the outputs: imp-96692s ~2.6 measurement ' +
    'cannot certify, refute, or otherwise touch the imp-96638 one-sided-bound sign ' +
    'question, and vice versa.',
  verificationStatus:
    'Terminology disambiguation only; no new computation. Sense (a) one-sided-bound ' +
    'question remains OPEN (imp-96638 unresolved); sense (b) drift-covariance ' +
    'measurement remains CLOSED (imp-96692/imp-96719 complete). Changes no bound; ' +
    'establishes no operator positivity; no refereed bound is changed; RH open; ' +
    'NO QED.',
});

export const IMP96720_VIF_TERMINOLOGY_RECONCILIATION_HEADWORD = Object.freeze({
  id: 'imp-96720',
  proofSection: 'S-frontier',
  glosses: 'imp-96638,imp-96692',
  question:
    'imp-96638 found the box sine-kernel closed-form tail is not a certified ' +
    'one-sided VIF upper bound (route stays open). imp-96692 separately measured ' +
    'a Route M drift-covariance VIF ~ 2.6 from an unrelated ladder. Could a reader ' +
    'conflate these into "the VIF question was answered as ~2.6", and if so, how ' +
    'should the two be distinguished?',
  headword: VIF_TERMINOLOGY_RECONCILIATION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). The two VIFs are ' +
    'UNRELATED: imp-96638s box sine-kernel number-variance VIF_291 (values << 1) ' +
    'and its one-sided-bound question remain OPEN, untouched by any other ' +
    'measurement; imp-96692s Route M drift-covariance VIF ~ 2.578 (values > 1) is ' +
    'a separate, already-closed empirical measurement from a different ladder. ' +
    'Neither resolves, updates, or bears on the other. Establishes nothing; ' +
    'instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96638 (box sine-kernel two-sided-approximation headword, VIF sense (a)); ' +
    'imp-96617 (the underlying sign measurement); imp-96593 (names the one-sided-' +
    'bound obstruction (ii)); imp-96692 (Route M drift-covariance measurement, VIF ' +
    'sense (b)); imp-96719 (its glossary headword).',
});

export default IMP96720_VIF_TERMINOLOGY_RECONCILIATION_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96720_VIF_TERMINOLOGY_RECONCILIATION_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96720-headword-distinguishes-both-senses',
    why: 'The headword must name both VIF senses, their opposite magnitude ' +
      'regimes (<< 1 vs > 1), and state that neither resolves the other -- the ' +
      'entire point of the reconciliation.',
    holds: () => {
      const h = IMP96720_VIF_TERMINOLOGY_RECONCILIATION_HEADWORD.headword;
      return (
        /UNRELATED/.test(h.term) &&
        /0\.0334/.test(h.definition) &&
        /2\.578/.test(h.definition) &&
        /OPEN/.test(h.definition) &&
        /below 1/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96720-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96720_VIF_TERMINOLOGY_RECONCILIATION_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96720_VIF_TERMINOLOGY_RECONCILIATION_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96720_VIF_TERMINOLOGY_RECONCILIATION_HEADWORD.verdict) &&
      IMP96720_VIF_TERMINOLOGY_RECONCILIATION_HEADWORD.glosses === 'imp-96638,imp-96692',
  },
];

for (const assertion of IMP96720_VIF_TERMINOLOGY_RECONCILIATION_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96720-vif-terminology-reconciliation-headword assertion failed: ${assertion.id}`,
    );
  }
}
