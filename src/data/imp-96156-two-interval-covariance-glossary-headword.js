/**
 * @module imp-96156-two-interval-covariance-glossary-headword
 * @fileoverview imp-96156 -- import-light Concepts glossary headword for the imp-96128 exact GUE
 *   two-interval number-variance covariance result: rho_exact = -0.46398 at T = 1.5e5, near the
 *   GUE-rigidity value -1/2, ~230x the imp-96109 O(1/L) proxy in magnitude but of the opposite
 *   (helpful) sign, raising n_eff from 291 to ~795 and sitting 1.04 rho-units on the safe side of
 *   the sign-forbidden flip threshold rho_crit = 0.5744.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96128 computed the exact adjacent-box count correlation for the sd(C - E) statistic via the
 *   union identity Cov = (Sigma^2(2L) - 2 Sigma^2(L))/2, replacing the imp-96109 order-of-magnitude
 *   O(1/L) estimate. A reader landing on that module cold has no quick-lookup definition of what
 *   "rho_exact", the "AR-1 effective factor", and the "sign-forbidden flip threshold" name. This
 *   headword bakes those facts VERBATIM (no re-import of the imp-96128 module, to stay import-light)
 *   as a standalone lookup entry.
 *
 * @see imp-96128-number-variance-two-interval-covariance-exact (source: the exact covariance and verdict this glosses)
 * @see imp-96109-tue5-dip-decorrelation-safety-margin (the superseded O(1/L) proxy)
 * @see imp-96089-mean-anchor-window-count-significance-verdict (the significant-dip verdict this strengthens)
 * @see imp-96171-number-variance-empirical-lag1-vs-gue-proxy (empirical confirmation on a clean tiling;
 *   the imp-95562 raw tiling's own adjacent-box correlation is a box-overlap artifact, not usable directly)
 *
 * Ticket: imp-96156 (content, low). Documentation only; establishes nothing; changes no bound;
 * NO QED; no refereed bound is changed.
 */

// The exact two-interval covariance headword, baked verbatim (no re-import).
const TWO_INTERVAL_COVARIANCE_HEADWORD = Object.freeze({
  key: 'gue-two-interval-covariance-rho-exact',
  term: 'imp-96128 verdict: exact GUE two-interval covariance rho_exact = -0.46398, correcting the imp-96109 O(1/L) proxy',
  definition:
    'For two adjacent (edge-to-edge) hard boxes of the sd(C - E) tiling, the exact GUE (sine-kernel) ' +
    'adjacent-box count correlation is rho_exact = Sigma^2(2L)/(2 Sigma^2(L)) - 1, computed from the ' +
    'union identity Cov(N(I),N(J)) = (Sigma^2(2L) - 2 Sigma^2(L))/2. At the imp-96089 significant ' +
    'height T = 1.5e5, rho_exact = -0.46398 (Var = 0.97483, Cov = -0.45230, L = 495.78): strongly ' +
    'ANTI-correlated, near the GUE-rigidity value -1/2.',
  magnitudeCorrection:
    'imp-96109 modelled the adjacent-box correlation with a positive order-of-magnitude proxy ' +
    'rho_boundary ~ 1/L = 0.00202 and left the exact value uncomputed (its honest caveat). imp-96128 ' +
    'confirms the anti-correlation SIGN claim but corrects the MAGNITUDE: |rho_exact| is ~230x the ' +
    'proxy, and of the opposite (helpful) sign -- the O(1/L) estimate dramatically understated the ' +
    'anti-correlation.',
  nEffStrengthening:
    'A negative lag-1 correlation raises the effective independent window count via the AR-1 factor ' +
    'f = (1 - rho)/(1 + rho) = 2.7312 at rho = -0.46398: n_eff = n_w * f = 291 * 2.7312 = 794.8, far ' +
    'above the imp-96071 crossover 78.66. The dip gets MORE significant, not less.',
  flipThresholdVerdict:
    'The imp-96089 verdict flips only at a POSITIVE rho >= rho_crit = 0.5744. rho_exact = -0.46398 ' +
    'sits a gap of 1.0384 in rho units on the SAFE side of that threshold, and is of the wrong sign ' +
    'to ever approach it -- the flip is not merely far, it is sign-forbidden.',
});

export const IMP96156_TWO_INTERVAL_COVARIANCE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96156',
  proofSection: 'S-frontier',
  glosses: 'imp-96128',
  scopes: 'imp-96109',
  question:
    'imp-96128 computed the exact GUE two-interval covariance replacing the imp-96109 O(1/L) proxy. ' +
    'What is rho_exact, how does it compare to the proxy, and what does it do to the imp-96089 ' +
    'significant-dip verdict, for a reader landing on that module cold?',
  headword: TWO_INTERVAL_COVARIANCE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96128 exact-covariance ' +
    'result: rho_exact = -0.46398 at T = 1.5e5 (near GUE-rigidity -1/2), confirming the imp-96109 ' +
    'anti-correlation sign but correcting its magnitude by ~230x, raising n_eff from 291 to ~795, and ' +
    'sitting 1.04 rho-units on the safe side of the sign-forbidden rho_crit = 0.5744 flip threshold. ' +
    'Establishes nothing; changes no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96128 (exact GUE two-interval covariance and verdict); imp-96109 (superseded O(1/L) proxy); ' +
    'imp-96089 (the significant-dip verdict this strengthens); imp-95562 (the hard-box tiling); ' +
    'imp-96171 (empirical clean-tiling confirmation -- the raw imp-95562 tiling adjacent-box ' +
    'correlation is a box-overlap artifact, honest-status caveat on citing imp-95562 directly for correlation).',
});

export default IMP96156_TWO_INTERVAL_COVARIANCE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96156_TWO_INTERVAL_COVARIANCE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96156-headword-has-required-fields',
    why: 'The headword must name rho_exact, the magnitude correction vs the imp-96109 proxy, and the sign-forbidden flip verdict -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96156_TWO_INTERVAL_COVARIANCE_GLOSSARY_HEADWORD.headword;
      return (
        /-0\.46398/.test(h.definition) &&
        /230x/.test(h.magnitudeCorrection) &&
        /794\.8|~795/.test(h.nEffStrengthening) &&
        /sign-forbidden/.test(h.flipThresholdVerdict)
      );
    },
  },
  {
    id: 'imp96156-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96156_TWO_INTERVAL_COVARIANCE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96156_TWO_INTERVAL_COVARIANCE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96156_TWO_INTERVAL_COVARIANCE_GLOSSARY_HEADWORD.verdict) &&
      IMP96156_TWO_INTERVAL_COVARIANCE_GLOSSARY_HEADWORD.glosses === 'imp-96128' &&
      IMP96156_TWO_INTERVAL_COVARIANCE_GLOSSARY_HEADWORD.scopes === 'imp-96109',
  },
];

for (const assertion of IMP96156_TWO_INTERVAL_COVARIANCE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-96156-two-interval-covariance-glossary-headword assertion failed: ${assertion.id}`);
  }
}
