/**
 * @module imp-95848-kms-widom-edge-law-glossary-headword
 * @fileoverview imp-95848 -- import-light glossary/Concepts headword for the imp-95824
 *   Kac-Murdock-Szego / Widom / Parter finite-section edge law giving the N^-2
 *   low-eigenvalue correction of a positive Toeplitz operator at a non-degenerate
 *   quadratic symbol minimum.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95824 derived, from classical 1953/1958/1961 finite-section theory, that the
 *   imp-95803 deep-corner biasPct ~ N^-p drift should converge to the exact power
 *   p = 2. A reader landing on that module cold has no quick-lookup definition of the
 *   edge law itself, its prefactor, or the discriminating degenerate alternative.
 *   This headword bakes those facts VERBATIM (no re-import of the imp-95824 module,
 *   to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   For a real, continuous, 2pi-periodic Toeplitz symbol f attaining its global
 *   minimum m = min f at a single interior point theta_star with a NON-DEGENERATE
 *   quadratic minimum (f''(theta_star) > 0), the finite N x N Toeplitz section T_N[f]
 *   has smallest eigenvalue obeying
 *
 *       lambda_min(T_N[f]) - m  =  (f''(theta_star)/2) * (pi/(N+1))^2 + O(N^-3),
 *
 *   i.e. the leading finite-size correction scales EXACTLY as N^-2 with a fixed
 *   prefactor set by the symbol curvature at the minimizer. This rate is UNIVERSAL
 *   for any non-degenerate quadratic minimum -- it does not depend on the coefficient
 *   decay rate of the symbol, which only controls the size of the O(N^-3) remainder.
 *
 *   DISCRIMINATING ALTERNATIVE: a DEGENERATE quartic minimum (f'' = 0, f'''' > 0)
 *   instead gives the strictly slower non-integer power p = 4/3, so a measured
 *   exponent near 2 (vs 4/3) is itself evidence the symbol minimum is non-degenerate
 *   quadratic.
 *
 *   STATUS: confirmed in closed form on the toy symbol f = 1 - cos(theta) (tridiagonal
 *   Toeplitz section, exact eigenvalues 1 - cos(k pi/(N+1))), matching the Widom
 *   prediction to O(N^-2) relative and local exponent 1.997 at N = 400..500; matches
 *   the imp-95803 measured drift toward p_inf ~ 1.98.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95824 edge-law derivation for quick
 *   reference. It establishes nothing, instantiates no interval, closes no sub-gap,
 *   moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-95824-deep-corner-bias-exponent-szego-theory (source: the edge law this glosses)
 * @see imp-95803-twin-pair-deep-corner-bias-exponent-limit (the measured p ~ 2 drift the law explains)
 * @see imp-95825 (the lambda_min(T_n) >= ess-inf f finite-section positivity endpoint this rate refines)
 *
 * Ticket: imp-95848 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The KMS/Widom/Parter finite-section edge law headword, baked verbatim (no re-import).
const KMS_WIDOM_EDGE_LAW_HEADWORD = Object.freeze({
  key: 'kac-murdock-szego-widom-finite-section-edge-law',
  term:
    'Kac-Murdock-Szego / Widom / Parter finite-section edge law ' +
    '(N^-2 low-eigenvalue correction)',
  definition:
    'For a real continuous Toeplitz symbol f with a single non-degenerate quadratic ' +
    'interior minimum m = min f at theta_star (f’’(theta_star) > 0), the finite N x N ' +
    'Toeplitz section T_N[f] obeys lambda_min(T_N[f]) - m = ' +
    '(f’’(theta_star)/2) (pi/(N+1))^2 + O(N^-3): the leading low-eigenvalue ' +
    'correction scales EXACTLY as N^-2, with a fixed prefactor set by the symbol ' +
    'curvature at the minimizer.',
  mechanism:
    'Near a quadratic symbol minimum the bottom of the Toeplitz spectrum is governed ' +
    'by the continuum operator (f’’(theta_star)/2)(-d^2/dx^2) on the unit interval ' +
    'with Dirichlet ends, whose k-th eigenvalue is (f’’(theta_star)/2)(k pi)^2; the ' +
    'finite section discretizes it at N interior nodes, replacing pi by pi/(N+1). The ' +
    'N^-2 rate is UNIVERSAL in this sense -- it does not depend on the coefficient ' +
    'decay rate of the symbol, which controls only the size of the O(N^-3) remainder.',
  discriminatingAlternative:
    'A DEGENERATE quartic minimum (f’’(theta_star) = 0, f’’’’(theta_star) > 0) gives ' +
    'instead the strictly slower non-integer power p = 4/3, so a measured exponent ' +
    'near 2 (rather than 4/3) is evidence the symbol minimum is non-degenerate ' +
    'quadratic.',
  verificationStatus:
    'Confirmed in closed form on the toy symbol f = 1 - cos(theta) (exact tridiagonal ' +
    'Toeplitz eigenvalues 1 - cos(k pi/(N+1))), matching the Widom prediction to ' +
    'O(N^-2) relative with local log-log exponent 1.997 at N = 400..500; matches the ' +
    'imp-95803 measured deep-corner biasPct drift toward p_inf ~ 1.98.',
});

export const IMP95848_KMS_WIDOM_EDGE_LAW_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95848',
  proofSection: 'S-frontier',
  glosses: 'imp-95824',
  question:
    'imp-95824 derived that finite-section edge theory predicts the deep-corner ' +
    'lambda_min correction scales as N^-2 (not a slower or faster power). What is the ' +
    'exact closed-form edge law, why is the N^-2 rate universal, and how does it ' +
    'discriminate from a degenerate minimum, for a reader landing on that module cold?',
  headword: KMS_WIDOM_EDGE_LAW_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95824 ' +
    'finite-section edge-law derivation: lambda_min(T_N[f]) - m = ' +
    '(f’’(theta_star)/2)(pi/(N+1))^2 + O(N^-3) for a non-degenerate quadratic symbol ' +
    'minimum, universal in the coefficient decay rate, with a degenerate quartic ' +
    'minimum instead giving the discriminating slower power p = 4/3. Confirmed on the ' +
    'closed-form toy symbol f = 1 - cos(theta). Establishes nothing; instantiates no ' +
    'interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95824 (the finite-section edge law derivation and toy-symbol confirmation ' +
    'this glosses); imp-95803 (the measured p ~ 2 deep-corner biasPct drift the law ' +
    'explains); imp-95825 (the lambda_min(T_n) >= ess-inf f positivity endpoint this ' +
    'rate refines).',
});

export default IMP95848_KMS_WIDOM_EDGE_LAW_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95848_KMS_WIDOM_EDGE_LAW_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95848-headword-has-required-fields',
    why: 'The headword must name the exact N^-2 edge law, its prefactor, the universality mechanism, and the degenerate p=4/3 discriminating alternative -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95848_KMS_WIDOM_EDGE_LAW_GLOSSARY_HEADWORD.headword;
      return (
        /\(pi\/\(N\+1\)\)\^2/.test(h.definition) &&
        /N\^-3/.test(h.definition) &&
        /UNIVERSAL/i.test(h.mechanism) &&
        /4\/3/.test(h.discriminatingAlternative) &&
        /1\.997/.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp95848-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95848_KMS_WIDOM_EDGE_LAW_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95848_KMS_WIDOM_EDGE_LAW_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95848_KMS_WIDOM_EDGE_LAW_GLOSSARY_HEADWORD.verdict) &&
      IMP95848_KMS_WIDOM_EDGE_LAW_GLOSSARY_HEADWORD.glosses === 'imp-95824',
  },
];

for (const assertion of IMP95848_KMS_WIDOM_EDGE_LAW_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95848-kms-widom-edge-law-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
