/**
 * @module imp-96177-heldout-covariance-uniformity-glossary-headword
 * @fileoverview imp-96177 -- import-light Concepts glossary headword for the imp-96150 result:
 *   the exact GUE two-interval covariance for the sd(C - E) statistic is uniformly strongly
 *   anti-correlated (rho_exact in -0.4587 .. -0.4660) across five held-out heights, with a
 *   nearly-constant ~2.7x n_eff inflation and a uniform ~1.04 safe-side flip margin.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96128 established the exact adjacent-box covariance rho_exact = -0.46398 at ONE height
 *   (T = 1.5e5, glossed by imp-96156). imp-96150 extends the census to the five imp-96090
 *   held-out heights and shows the anti-correlation, the AR-1 n_eff multiplier, and the
 *   sign-forbidden flip margin are UNIFORM across the accessible height band, not a
 *   single-height accident. A reader landing on that module cold has no quick-lookup summary
 *   of what "uniform across heights" establishes. This headword bakes those facts VERBATIM (no
 *   re-import of the imp-96150 module, to stay import-light) as a standalone lookup entry.
 *
 * @see imp-96150-number-variance-two-interval-covariance-heldout-heights (source: the five-height uniformity census this glosses)
 * @see imp-96156-two-interval-covariance-glossary-headword (the single-height T = 1.5e5 headword this extends)
 * @see imp-96128-number-variance-two-interval-covariance-exact (the single-height exact covariance)
 * @see imp-96090-number-variance-mean-anchor-heldout-out-of-sample (the five held-out heights and window counts)
 *
 * Ticket: imp-96177 (content, low). Documentation only; establishes nothing; changes no bound;
 * NO QED; no refereed bound is changed.
 */

// The held-out-height uniformity headword, baked verbatim (no re-import).
const HELDOUT_COVARIANCE_UNIFORMITY_HEADWORD = Object.freeze({
  key: 'gue-two-interval-covariance-uniform-across-heights',
  term: 'imp-96150 verdict: exact GUE two-interval covariance anti-correlation is UNIFORM across five held-out heights',
  definition:
    'At the five imp-96090 held-out heights {2e4, 5e4, 1e5, 2e5, 4e5}, the exact adjacent-box ' +
    'correlation rho_exact = Sigma^2(2L)/(2 Sigma^2(L)) - 1 stays in -0.4587 .. -0.4660, a total ' +
    'spread of only 0.0073 over ~1.3 decades, bracketing the imp-96128 T = 1.5e5 value -0.46398 ' +
    'and drifting monotonically (very slowly) toward the GUE-rigidity limit -1/2 as T grows.',
  factorUniformity:
    'The AR-1 effective-independence factor f = (1 - rho_exact)/(1 + rho_exact) sits in ' +
    '2.695 .. 2.746 across all five heights, matching the imp-96128 single-height value ' +
    'f = 2.7312 at T = 1.5e5: the n_w -> n_eff inflation is a nearly-constant ~2.7x multiplier, ' +
    'not a peculiarity of one height. n_eff = 286, 456, 646, 919, 1304 at the five heights ' +
    '(from n_w = 106, 168, 237, 336, 475), with growth driven by n_w, not by any change in the ' +
    'correlation-induced multiplier.',
  flipMarginUniformity:
    'The gap rho_crit - rho_exact (rho_crit = 0.5744, the positive threshold that would flip the ' +
    'verdict to noise) is 1.0331 .. 1.0405 at every held-out height -- uniformly ~1.04 rho-units ' +
    'on the safe side, and of the wrong sign to ever approach the threshold. The imp-96128 ' +
    'sign-forbidden safety margin holds across the whole accessible band, not just at T = 1.5e5.',
});

export const IMP96177_HELDOUT_COVARIANCE_UNIFORMITY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96177',
  proofSection: 'S-frontier',
  glosses: 'imp-96150',
  scopes: 'imp-96128',
  question:
    'imp-96150 extended the imp-96128 single-height exact covariance census to five held-out ' +
    'heights. Is the anti-correlation, the n_eff inflation, and the safe-side flip margin uniform ' +
    'across heights, or is the significant-height finding a one-off, for a reader landing on that ' +
    'module cold?',
  headword: HELDOUT_COVARIANCE_UNIFORMITY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96150 five-height ' +
    'uniformity result: rho_exact in -0.4587 .. -0.4660 (spread 0.0073, bracketing the imp-96128 ' +
    'T = 1.5e5 value), the AR-1 n_eff factor nearly constant at ~2.7x (2.695 .. 2.746), and the ' +
    'safe-side flip margin uniformly ~1.04 rho-units across the accessible band. Establishes ' +
    'nothing; changes no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96150 (five-height uniformity census and verdict); imp-96128 (single-height exact ' +
    'covariance); imp-96090 (the five held-out heights and window counts); imp-96156 (the ' +
    'single-height headword this extends).',
});

export default IMP96177_HELDOUT_COVARIANCE_UNIFORMITY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96177_HELDOUT_COVARIANCE_UNIFORMITY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96177-headword-has-required-fields',
    why: 'The headword must name the rho_exact spread across heights, the nearly-constant AR-1 factor, and the uniform safe-side flip margin -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96177_HELDOUT_COVARIANCE_UNIFORMITY_GLOSSARY_HEADWORD.headword;
      return (
        /-0\.4587/.test(h.definition) &&
        /-0\.4660/.test(h.definition) &&
        /2\.695/.test(h.factorUniformity) &&
        /2\.746/.test(h.factorUniformity) &&
        /1\.0331/.test(h.flipMarginUniformity)
      );
    },
  },
  {
    id: 'imp96177-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96177_HELDOUT_COVARIANCE_UNIFORMITY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96177_HELDOUT_COVARIANCE_UNIFORMITY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96177_HELDOUT_COVARIANCE_UNIFORMITY_GLOSSARY_HEADWORD.verdict) &&
      IMP96177_HELDOUT_COVARIANCE_UNIFORMITY_GLOSSARY_HEADWORD.glosses === 'imp-96150' &&
      IMP96177_HELDOUT_COVARIANCE_UNIFORMITY_GLOSSARY_HEADWORD.scopes === 'imp-96128',
  },
];

for (const assertion of IMP96177_HELDOUT_COVARIANCE_UNIFORMITY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-96177-heldout-covariance-uniformity-glossary-headword assertion failed: ${assertion.id}`);
  }
}
