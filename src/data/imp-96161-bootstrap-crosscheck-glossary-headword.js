/**
 * @module imp-96161-bootstrap-crosscheck-glossary-headword
 * @fileoverview imp-96161 -- import-light glossary/Concepts headword for the imp-96133
 *   direct parametric-bootstrap cross-check of the imp-96089 below-envelope
 *   mean-anchor number-variance dip significance.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96089 flagged exactly one of three below-envelope sd(C - E) dips as
 *   SIGNIFICANT (T = 1.5e5, chi-square z = 1.923) by reading a NORMAL-tail
 *   p-value off that z-score. imp-96133 removed the normal-tail approximation
 *   by directly Monte-Carlo resampling the chi2_{n_w}/n_w null law (Marsaglia-
 *   Tsang gamma sampler, N = 60000 seeded draws) and comparing the resulting
 *   empirical p-values. A reader landing on imp-96133 cold has no quick-lookup
 *   definition of what a "direct bootstrap cross-check" adds over the
 *   chi-square z-score verdict it re-derives, or which assumption it does and
 *   does not test. This headword bakes those facts VERBATIM (no re-import of
 *   the imp-96133 module, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The bootstrap draws the null ratio fluctuation G = chi2_{n_w}/n_w directly
 *   (rather than approximating its tail as normal) and counts how often a
 *   null draw reaches the observed excursion. Result: T = 1.5e5 stays the
 *   single significant dip (bootstrap two-sided p ~ 0.0221, one-sided
 *   ~ 0.0145) versus the chi-square normal one-sided reference p ~ 0.0272 --
 *   the two methods agree to within Monte-Carlo noise. T = 1e4 (p ~ 0.69) and
 *   T = 3e5 (p ~ 0.94) stay firmly in the noise floor under both methods.
 *
 *   MECHANISM: the direct bootstrap tests only the NORMAL-TAIL approximation
 *   (assumption (b) of the original z-score test), not the underlying
 *   quasi-independence of the n_w non-overlapping windows (assumption (a)).
 *   Since the chi-square tail at n_w = 291 is already close to normal, the
 *   two methods land on the same SIGNIFICANT / NOISE calls -- a null result
 *   in the sense that removing assumption (b) changed nothing, which is
 *   itself the informative finding.
 *
 *   STATUS: a significance-testing-method ASSESSMENT only. The remaining
 *   NON-PARAMETRIC ordinate-level bootstrap that would test assumption (a)
 *   itself (window quasi-independence) is the named, deferred sub-gap
 *   SG-96133-empirical-ordinate-bootstrap.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96133 direct-bootstrap
 *   cross-check for quick reference. It establishes nothing, instantiates no
 *   interval, closes no sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96133-mean-anchor-dip-bootstrap-crosscheck (source: the direct-bootstrap cross-check this glosses)
 * @see imp-96089-mean-anchor-window-count-significance-verdict (the chi-square z-score verdict re-derived)
 * @see imp-96114-mean-anchor-dip-zscore-crosscheck (the independent z-score re-derivation)
 *
 * Ticket: imp-96161 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The direct-bootstrap cross-check headword, baked verbatim (no re-import).
const BOOTSTRAP_CROSSCHECK_HEADWORD = Object.freeze({
  key: 'mean-anchor-dip-direct-bootstrap-crosscheck',
  term:
    'imp-96133 direct parametric-bootstrap cross-check of the imp-96089 mean-anchor dip significance (one of three below-envelope dips significant, T = 1.5e5)',
  definition:
    'A re-derivation of the imp-96089 below-envelope number-variance dip significance ' +
    'verdict that replaces the normal-tail approximation to the chi-square sampling ' +
    'law with a direct seeded Monte-Carlo resampling of chi2_{n_w}/n_w (N = 60000 ' +
    'draws). Only one of the three below-envelope dips (T = 1.5e5) reaches the ' +
    '5-percent two-sided bootstrap significance bar (p ~ 0.0221), matching the ' +
    'chi-square z = 1.923 verdict; T = 1e4 (p ~ 0.69) and T = 3e5 (p ~ 0.94) stay in ' +
    'the noise floor under both methods.',
  mechanism:
    'The bootstrap tests only the normal-tail approximation to the chi-square sampling ' +
    'law (assumption (b)), not the quasi-independence of the n_w non-overlapping ' +
    'windows the chi-square model itself assumes (assumption (a)). Because the true ' +
    'chi-square tail at n_w = 291 is already close to normal, removing assumption (b) ' +
    'changes no SIGNIFICANT / NOISE call -- agreement, not disagreement, is the result.',
  verificationStatus:
    'Bootstrap and chi-square-normal verdicts agree at all three below-envelope ' +
    'heights; the deepest dip (T = 1.5e5) stays the single significant one under both ' +
    'methods. The remaining non-parametric ordinate-level bootstrap that would test ' +
    'window quasi-independence itself (assumption (a)) is the named, deferred sub-gap ' +
    'SG-96133-empirical-ordinate-bootstrap; still needs the zeros bundle and per-window ' +
    'residuals, not baked here.',
});

export const IMP96161_BOOTSTRAP_CROSSCHECK_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96161',
  proofSection: 'S-frontier',
  glosses: 'imp-96133',
  question:
    'imp-96133 re-derived the imp-96089 below-envelope mean-anchor dip significance ' +
    'verdict with a direct parametric bootstrap instead of a chi-square normal-tail ' +
    'p-value. What does that cross-check add, which assumption does it test, and does ' +
    'it change the verdict, for a reader landing on that module cold?',
  headword: BOOTSTRAP_CROSSCHECK_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96133 ' +
    'direct-bootstrap cross-check: exactly one of three below-envelope dips ' +
    '(T = 1.5e5) is significant under both the chi-square normal-tail p-value ' +
    '(~0.0272 one-sided) and the direct Monte-Carlo bootstrap (~0.0221 two-sided, ' +
    '~0.0145 one-sided); the normal approximation did not distort the verdict. Names ' +
    'the deferred non-parametric ordinate-level sub-gap SG-96133-empirical-ordinate-' +
    'bootstrap. Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96133 (the direct parametric-bootstrap cross-check this glosses); imp-96089 ' +
    '(the chi-square z-score verdict re-derived); imp-96114 (the independent z-score ' +
    're-derivation).',
});

export default IMP96161_BOOTSTRAP_CROSSCHECK_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96161_BOOTSTRAP_CROSSCHECK_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96161-headword-has-required-fields',
    why: 'The headword must name the T = 1.5e5 significant height, both p-value ' +
      'estimates, and the assumption-(b)-only scope -- the entire point of the ' +
      'glossary entry.',
    holds: () => {
      const h = IMP96161_BOOTSTRAP_CROSSCHECK_GLOSSARY_HEADWORD.headword;
      return (
        /0\.0221/.test(h.definition) &&
        /1\.923/.test(h.definition) &&
        /assumption \(b\)/i.test(h.mechanism) &&
        /SG-96133-empirical-ordinate-bootstrap/.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp96161-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96161_BOOTSTRAP_CROSSCHECK_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96161_BOOTSTRAP_CROSSCHECK_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96161_BOOTSTRAP_CROSSCHECK_GLOSSARY_HEADWORD.verdict) &&
      IMP96161_BOOTSTRAP_CROSSCHECK_GLOSSARY_HEADWORD.glosses === 'imp-96133',
  },
];

for (const assertion of IMP96161_BOOTSTRAP_CROSSCHECK_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96161-bootstrap-crosscheck-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
