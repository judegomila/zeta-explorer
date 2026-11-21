/**
 * @module imp-96816-krein-lammin-double-precision-trustworthy-glossary-headword
 * @fileoverview imp-96816 -- import-light glossary/Concepts headword for the imp-96772
 *   verdict: the double-precision Legendre-Galerkin Krein floor lambda_min(T_a[sigma_2])
 *   is trustworthy to < 1e-6 across the entire tested ladder, past condB = 1.1e16,
 *   refuting the imp-96749 reading that its condB ~ 1e13 wall was a floor-corruption wall.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96749 flagged that past condB ~ 1e13 the double-precision generalized-eigenvalue
 *   solve for the Legendre-Galerkin Rayleigh floor might be spuriously lowering it --
 *   i.e. that the decrement re-acceleration seen at N > ~60 could be Gram-conditioning
 *   noise, not a real spectral trend. imp-96772 tested this directly by re-running the
 *   SAME matrix entries through an extended-precision (mp.dps = 40) generalized-eigenvalue
 *   solve and comparing to the double-precision (scipy eigh) floor at every rung, well
 *   past the flagged wall. This headword bakes that verdict verbatim (no re-import of the
 *   imp-96772 module, to stay import-light) as a standalone quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   Across the ladder N=20..76 at 2a in {1.00, 1.05, ln3}, and extended to N=84,92,100 at
 *   the binding 2a=ln3 rung, the extended-precision (dps=40) floor agrees with the
 *   double-precision floor to |double - extended| <= 4.7e-8 (2a=1.00), 1.5e-8 (2a=1.05),
 *   and 7.0e-7 (2a=ln3) -- even at N=100 where condB = 1.113e16, ~3 orders past the
 *   imp-96749 condB ~ 1e13 flag point. There is no condB in the tested range where double
 *   precision meaningfully corrupts the floor. This means the fixed-T=800 decrement
 *   re-acceleration imp-96749 attributed to Gram-conditioning noise is instead a real
 *   t-truncation effect (independently confirming imp-96768's Gegenbauer-basis finding),
 *   and the floor itself stays firmly positive with slow, non-accelerating decrements out
 *   to the extended reach (7.848 / 2.012 / 0.534 at 2a=1.00/1.05/ln3).
 *
 *   STATUS: a solve-precision cross-check (validates the linear-algebra step of an
 *   existing floor measurement), not a new operator-positivity result. The matrix ENTRIES
 *   stay double precision and the t-quadrature stays fixed at T=800, so the t-converged
 *   plateau value and the uniform-in-N spectral gap remain open.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96772 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96772-krein-lammin-double-double-recompute.js (source: the recompute this glosses)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (the condB ~ 1e13 flag this refutes)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (independent orthogonal-basis confirmation: descent = t-truncation)
 *
 * Ticket: imp-96816 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The double-precision-trustworthy headword, baked verbatim (no re-import).
const KREIN_LAMMIN_DOUBLE_PRECISION_TRUSTWORTHY_HEADWORD = Object.freeze({
  key: 'route-i-krein-lammin-double-precision-trustworthy-past-condb-wall',
  term:
    'imp-96772 verdict: the double-precision Legendre-Galerkin Krein floor ' +
    'lambda_min(T_a[sigma_2]) is trustworthy to < 1e-6 across the whole tested ladder, ' +
    'past condB = 1.1e16 -- refuting the imp-96749 reading that its condB ~ 1e13 wall ' +
    'spuriously lowers the floor',
  definition:
    'imp-96749 flagged that past a Gram condition number condB ~ 1e13 the ' +
    'double-precision generalized-eigenvalue solve for the Rayleigh floor ' +
    'lambda_min(T_a[sigma_2]) might be losing enough digits in the Cholesky reduction ' +
    'that the observed decrement re-acceleration at N > ~60 was numerical noise rather ' +
    'than a real trend. imp-96772 tested this by re-solving the IDENTICAL double-precision ' +
    'matrix entries through an extended-precision (mp.dps = 40) generalized-eigenvalue ' +
    'solve and comparing to the scipy double-precision floor at every rung.',
  mechanism:
    'At every rung on the ladder N=20..76 (2a in {1.00, 1.05, ln3}), and extended to ' +
    'N=84,92,100 at the binding 2a=ln3 rung, the extended-precision floor matches the ' +
    'double-precision floor to |double - extended| <= 4.66e-8 (2a=1.00), 1.53e-8 ' +
    '(2a=1.05), 6.99e-7 (2a=ln3) -- even at N=100 where condB = 1.113e16, about three ' +
    'orders of magnitude past the imp-96749 condB ~ 1e13 flag point. Since the ' +
    'extended-precision solve reproduces the same monotone descent as double precision, ' +
    'the fixed-T=800 decrement re-acceleration is NOT Gram-conditioning noise; it is a ' +
    'real t-truncation effect, independently confirming imp-96768 (orthogonal Gegenbauer ' +
    'basis, condB = 1) from the Legendre side. The floor stays firmly positive at the ' +
    'extended reach: 7.848 (2a=1.00, N=76), 2.012 (2a=1.05, N=76), 0.534 (2a=ln3, N=100) ' +
    '-- slow, non-accelerating decrements, no sign of collapse.',
  verificationStatus:
    'Solve-precision cross-check (validates the linear-algebra step of an existing floor ' +
    'measurement), not a new operator-positivity result. The matrix entries stay double ' +
    'precision (~1e-16 per entry) and the t-quadrature stays fixed at T=800, so the ' +
    't-converged plateau value and the uniform-in-N spectral gap ' +
    'lambda_min(T_a[sigma_2]) >= c > 0 remain open (SUB-GAP ' +
    'IMP96772_ENTRY_PRECISION_AND_TCONV). Changes no bound; establishes no operator ' +
    'positivity; interval-rigorous certificate reach stays 2a <= 0.96; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96816_KREIN_LAMMIN_DOUBLE_PRECISION_TRUSTWORTHY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96816',
  proofSection: 'S-frontier',
  glosses: 'imp-96772',
  question:
    'imp-96749 flagged that its double-precision Legendre-Galerkin Krein floor solve ' +
    'might be numerically corrupted past condB ~ 1e13, spuriously lowering ' +
    'lambda_min(T_a[sigma_2]). Does an extended-precision recompute of the SAME matrix ' +
    'entries reproduce the double-precision floor, or does the wall actually distort it?',
  headword: KREIN_LAMMIN_DOUBLE_PRECISION_TRUSTWORTHY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96772 ' +
    'verdict: the extended-precision (dps=40) solve reproduces the double-precision ' +
    'floor to < 1e-6 across the entire ladder up to condB = 1.1e16, so the imp-96749 ' +
    'condB ~ 1e13 wall is NOT a floor-corruption wall -- the double-precision floor is ' +
    'trustworthy throughout the tested range, and the decrement re-acceleration it ' +
    'flagged is a real t-truncation effect (confirming imp-96768), not Gram-conditioning ' +
    'noise. Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96772 (the double-double recompute this glosses); imp-96749 (the condB ~ 1e13 ' +
    'wall reading this refutes); imp-96768 (independent orthogonal-basis confirmation ' +
    'that the descent is t-truncation).',
});

export default IMP96816_KREIN_LAMMIN_DOUBLE_PRECISION_TRUSTWORTHY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96816_KREIN_LAMMIN_DOUBLE_PRECISION_TRUSTWORTHY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96816-headword-has-required-fields',
    why: 'The headword must name the tolerance the extended-precision solve agrees to, ' +
      'the max condB tested, and the imp-96749 flag point it refutes -- the entire point ' +
      'of the glossary entry.',
    holds: () => {
      const h = IMP96816_KREIN_LAMMIN_DOUBLE_PRECISION_TRUSTWORTHY_GLOSSARY_HEADWORD.headword;
      return (
        /1e13/.test(h.definition) &&
        /1\.113e16/.test(h.mechanism) &&
        /6\.99e-7/.test(h.mechanism) &&
        /imp-96768/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96816-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96816_KREIN_LAMMIN_DOUBLE_PRECISION_TRUSTWORTHY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96816_KREIN_LAMMIN_DOUBLE_PRECISION_TRUSTWORTHY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96816_KREIN_LAMMIN_DOUBLE_PRECISION_TRUSTWORTHY_GLOSSARY_HEADWORD.verdict) &&
      IMP96816_KREIN_LAMMIN_DOUBLE_PRECISION_TRUSTWORTHY_GLOSSARY_HEADWORD.glosses === 'imp-96772',
  },
];

for (const assertion of IMP96816_KREIN_LAMMIN_DOUBLE_PRECISION_TRUSTWORTHY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96816-krein-lammin-double-precision-trustworthy-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
