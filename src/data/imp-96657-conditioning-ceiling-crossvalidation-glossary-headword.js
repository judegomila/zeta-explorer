/**
 * @module imp-96657-conditioning-ceiling-crossvalidation-glossary-headword
 * @fileoverview imp-96657 -- import-light glossary/Concepts headword for the imp-96570
 *   cross-validation verdict: fitting the directly-measured Route M condition number
 *   cond#(N) = lam_max/lam_min as a SINGLE power law (q = 1.96-1.98) reproduces the
 *   imp-96548 / imp-96443 composed-fit conditioning ceiling N ~ 4.11e7 to within 5-8%,
 *   and lands above the rigorous trace-domination lower ceiling N >= 2.59e7.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96570 checked whether the imp-96548 conditioning ceiling -- built by COMPOSING
 *   two separately fitted power laws (lam_max ~ a + b log N, imp-96443; lam_min ~ A N^-p,
 *   imp-96428) into cond# = lam_max/lam_min -- was an artifact of that two-fit
 *   composition. It found the composition is NOT an artifact: an independent estimator
 *   (fitting cond# as one measured scalar per matrix, the analog of a single rcond/SVD
 *   readout) reproduces the same ceiling. This headword bakes that verdict verbatim (no
 *   re-import of the imp-96570 module, to stay import-light) as a standalone quick-lookup
 *   entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   At the five accessible rungs where both lam_max (imp-96443) and lam_min (imp-96105)
 *   are measured, the directly-formed cond#(N) = lam_max/lam_min fits a clean single
 *   power law cond# ~ C N^q with q = 1.9557 (dense N=3000..6000, R^2 = 0.99975) or
 *   q = 1.9837 (all five rungs, R^2 = 0.99998) -- an exponent sitting just above the
 *   lam_min exponent p = 1.9179 (imp-96428), exactly as the algebra
 *   cond# = (a + b log N) N^p / A predicts (an N^p power times a slowly growing log
 *   factor). Extrapolating this single-object law to the double-precision breakdown
 *   scale 1/eps gives N ~ 4.30e7 (dense) / 3.78e7 (all), agreeing with the imp-96548 /
 *   imp-96443 composed-fit ceiling N ~ 4.11e7 to within ~5% / ~8%, and both sit above
 *   the rigorous trace-domination lower ceiling N >= 2.59e7 -- consistent with that
 *   value being a LOWER estimate (trace domination over-states lam_max, so
 *   under-states the ceiling). All three ceilings sit >= 2600x above the imp-96352
 *   wall-clock compute ceiling N ~ 9916, so "compute binds first" holds independently.
 *
 *   STATUS: an accuracy cross-check (validates the two-fit COMPOSITION step), not a new
 *   measurement and not a rigorous derivation. Both routes still rest on the same
 *   non-rigorous lam_min N^-p extrapolation.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96570 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96570-route-m-conditioning-ceiling-crossvalidation.js (source: the cross-check this glosses)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (rigorous lower ceiling 2.59e7)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (measured lam_max ladder, composed ceiling 4.11e7)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (lam_min power law, exponent p=1.9179)
 *
 * Ticket: imp-96657 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The cross-validation headword, baked verbatim (no re-import).
const CONDITIONING_CEILING_CROSSVALIDATION_HEADWORD = Object.freeze({
  key: 'route-m-conditioning-ceiling-crossvalidated-single-object-cond-fit',
  term:
    'imp-96570 verdict: fitting the directly-measured cond#(N) = lam_max/lam_min as a ' +
    'SINGLE power law (q = 1.96-1.98) reproduces the imp-96548/imp-96443 composed ' +
    'conditioning ceiling N ~ 4.11e7 to within 5-8%, and lands above the rigorous ' +
    'lower ceiling N >= 2.59e7 -- the two-fit composition is not an extrapolation artifact',
  definition:
    'The Route M conditioning ceiling was built by COMPOSING two separately fitted ' +
    'power laws -- lam_max(N) ~ a + b log N (imp-96443) and lam_min(N) ~ A N^-p ' +
    '(imp-96428) -- into cond#(N) = lam_max(N)/lam_min(N), then solving cond# = 1/eps. ' +
    'A genuinely independent condition-number estimator (LAPACK rcond or full SVD) ' +
    'returns cond# as a single scalar per matrix, not this composed ratio, so the ' +
    'honest cross-check is to form cond#(N) directly from the already-measured ' +
    'lam_max and lam_min at the rungs where both are available, fit THAT single ' +
    'object as its own power law, and extrapolate it -- undoing the two-fit ' +
    'composition rather than repeating it.',
  mechanism:
    'At the five overlap rungs (N = 250, 3000, 4000, 5000, 6000) the directly-formed ' +
    'cond#(N) fits cond# ~ C N^q with q = 1.9557 (dense 3000..6000, R^2 = 0.99975) or ' +
    'q = 1.9837 (all five, R^2 = 0.99998) -- just above the lam_min exponent ' +
    'p = 1.9179 (imp-96428), as predicted by cond# = (a + b log N) N^p / A (an N^p ' +
    'power times a slowly growing log factor). Extrapolating to the double-precision ' +
    'breakdown scale 1/eps gives N ~ 4.30e7 (dense) / 3.78e7 (all), matching the ' +
    'imp-96548/imp-96443 composed measured-fit ceiling 4.11e7 to ~5% / ~8%, and both ' +
    'sit above the rigorous trace-domination lower ceiling 2.59e7 (consistent with ' +
    'trace domination over-stating lam_max and so under-stating the ceiling). The fit ' +
    'also reproduces the top measured rung N=6000 (cond# = 1.301e8 vs measured ' +
    '1.291e8, rel 7.9e-3), so it is anchored, not floating, and every ceiling sits ' +
    '>= 2600x above the imp-96352 wall-clock compute ceiling N ~ 9916.',
  verificationStatus:
    'Accuracy cross-check (validates the composition step of an existing ceiling), not ' +
    'a new measurement and not a rigorous derivation. Both the composed and the ' +
    'independent routes rest on the same non-rigorous lam_min N^-p extrapolation. ' +
    'Changes no bound; establishes no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96657_CONDITIONING_CEILING_CROSSVALIDATION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96657',
  proofSection: 'S-frontier',
  glosses: 'imp-96570',
  question:
    'imp-96548/imp-96443 built the Route M conditioning ceiling by composing two ' +
    'separately fitted power laws (lam_max ~ a + b log N; lam_min ~ A N^-p) into ' +
    'cond# = lam_max/lam_min. Does an independent condition-number estimator -- fit as ' +
    'one measured scalar per matrix -- reproduce that composed ceiling N ~ 4.11e7, or ' +
    'was the composition an extrapolation artifact?',
  headword: CONDITIONING_CEILING_CROSSVALIDATION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96570 ' +
    'verdict: the single-object cond# power fit (q = 1.9557-1.9837, R^2 >= 0.99975) ' +
    'reproduces the composed ceiling N ~ 4.11e7 to within 5-8%, lands above the ' +
    'rigorous lower ceiling 2.59e7, and its exponent q ~ 1.96-1.98 is consistent with ' +
    'the lam_min exponent p = 1.9179 -- the two-fit composition is CROSS-VALIDATED, ' +
    'not an artifact. Establishes nothing; instantiates no interval; moves no bound; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-96570 (the cross-validation this glosses); imp-96548 (rigorous trace lower ' +
    'ceiling 2.59e7); imp-96443 (measured lam_max ladder, composed ceiling 4.11e7); ' +
    'imp-96428 (lam_min power law, exponent p = 1.9179).',
});

export default IMP96657_CONDITIONING_CEILING_CROSSVALIDATION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96657_CONDITIONING_CEILING_CROSSVALIDATION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96657-headword-has-required-fields',
    why: 'The headword must name the single-object cond# fit exponent range, the ' +
      'agreement percentage with the composed ceiling, and the rigorous lower ceiling ' +
      '-- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96657_CONDITIONING_CEILING_CROSSVALIDATION_GLOSSARY_HEADWORD.headword;
      return (
        /q = 1\.9557/.test(h.mechanism) &&
        /q = 1\.9837/.test(h.mechanism) &&
        /4\.11e7/.test(h.mechanism) &&
        /2\.59e7/.test(h.mechanism) &&
        /1\.9179/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96657-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96657_CONDITIONING_CEILING_CROSSVALIDATION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96657_CONDITIONING_CEILING_CROSSVALIDATION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96657_CONDITIONING_CEILING_CROSSVALIDATION_GLOSSARY_HEADWORD.verdict) &&
      IMP96657_CONDITIONING_CEILING_CROSSVALIDATION_GLOSSARY_HEADWORD.glosses === 'imp-96570',
  },
];

for (const assertion of IMP96657_CONDITIONING_CEILING_CROSSVALIDATION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96657-conditioning-ceiling-crossvalidation-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
