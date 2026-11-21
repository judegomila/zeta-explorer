/**
 * @module imp-95793-offset-error-budget-glossary-headword
 * @fileoverview imp-95793 -- import-light glossary/Concepts headword for the imp-95768
 *   offset-error budget: the 2.852e-5 sign-flip budget (~2.03e5x the measured m=20
 *   residual) that both imp-95768 conditional conclusions survive.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95768 wrote the imp-95749 conditional constant-J refutation and the imp-95720
 *   conditional c_odd(1/19) as explicit functions of the +4 offset O and found both
 *   qualitative conclusions flip only if O is wrong by 2.852e-5 -- about 2.03e5 times
 *   the measured m=20 residual (1.404e-10). A reader landing on that module cold has
 *   no quick-lookup definition of what the "sign-flip budget" number means or how
 *   large a safety margin it represents. This headword bakes those facts VERBATIM
 *   (no re-import of the imp-95768 module, to stay import-light) as a standalone
 *   lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   Both conditional results are linear in the offset O (unit slope for the dI
 *   variation, slope rho2^2 = 1/361 for c_odd(1/19)), so each has a single "budget":
 *   the offset error needed to flip its sign or push it to the pure-rho^2 null. That
 *   budget is IDENTICAL for both statements (they are one statement, J_cond(1/19) >
 *   kappa) and equals
 *
 *       sign-flip budget = kappa - J_raw(1/19) - 4 = 2.852e-5,
 *
 *   which is ~2.03e5 x the measured m=20 residual O_meas - 4 = 1.404e-10. Only the
 *   trailing displayed digits of c_odd(1/19) (12th figure, ~1e-12) are sensitive at a
 *   much smaller budget (3.61e-10, ~2.57x the residual).
 *
 *   MECHANISM: writing a conditional quantity as an explicit linear function of an
 *   uncertain input turns "is this conclusion robust?" into a one-line division: the
 *   gap to the flip/null divided by the slope. The resulting budget-to-residual ratio
 *   (here ~2e5) is the honest measure of robustness -- far more informative than
 *   restating the raw residual alone.
 *
 *   STATUS: an offset-error sensitivity ASSESSMENT only. The offset itself remains
 *   uncertified off m=20 (imp-95720 sub-gap); this headword changes no bound.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95768 sign-flip-budget localization for
 *   quick reference. It establishes nothing, instantiates no interval, closes no
 *   sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-95768-offset-error-budget-sensitivity (source: the sign-flip budget this glosses)
 * @see imp-95749-conditional-constant-j-refutation (the dI variation the budget bounds)
 * @see imp-95720-conditional-c-odd-1-19 (the measured m=20 offset and its residual)
 *
 * Ticket: imp-95793 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The offset-error sign-flip budget headword, baked verbatim (no re-import).
const OFFSET_ERROR_BUDGET_HEADWORD = Object.freeze({
  key: 'offset-error-sign-flip-budget',
  term:
    'imp-95768 offset-error sign-flip budget (2.852e-5, ~2.03e5x the measured m=20 residual)',
  definition:
    'The offset error in the +4 additive constant O (J_cond(rho) = J_raw(rho) + O) ' +
    'needed to flip the imp-95749 conditional constant-J refutation, equivalently to ' +
    'push the imp-95720 conditional c_odd(1/19) up to the pure-rho^2 null kappa/361: ' +
    'sign-flip budget = kappa - J_raw(1/19) - 4 = 2.852e-5. Both conditional ' +
    'conclusions are the same statement (J_cond(1/19) > kappa) and so share the ' +
    'identical budget.',
  mechanism:
    'Both conditional quantities are linear in O (unit slope for the dI variation, ' +
    'slope rho2^2 = 1/361 for c_odd(1/19)), so the offset error needed to flip a sign ' +
    'or reach a null is exactly the gap divided by the slope -- a one-line ' +
    'sensitivity computation from carried literals, no new quadrature.',
  verificationStatus:
    'Sign-flip budget 2.852e-5 is ~2.03e5x the measured m=20 residual (1.404e-10), ' +
    'so both qualitative conclusions are enormously robust to offset drift; only the ' +
    'trailing displayed digits of c_odd(1/19) (12th figure) move at a much smaller ' +
    'budget (3.61e-10, ~2.57x the residual). Sensitivity assessment only -- the ' +
    'offset itself remains uncertified off m=20.',
});

export const IMP95793_OFFSET_ERROR_BUDGET_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95793',
  proofSection: 'S-frontier',
  glosses: 'imp-95768',
  question:
    'imp-95768 found that both the imp-95749 conditional constant-J refutation and ' +
    'the imp-95720 conditional c_odd(1/19)-below-null conclusion survive an offset ' +
    'error up to 2.852e-5. What does that "sign-flip budget" number mean, why is it ' +
    'the same for both conclusions, and how large a margin does it represent, for a ' +
    'reader landing on that module cold?',
  headword: OFFSET_ERROR_BUDGET_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95768 ' +
    'sign-flip-budget localization: 2.852e-5, identical for the dI-variation and ' +
    'c_odd(1/19)-vs-null conclusions because they are one statement, and ~2.03e5x ' +
    'the measured m=20 residual (1.404e-10). Only the trailing displayed digits of ' +
    'c_odd(1/19) are residual-sensitive (~2.57x the residual). Establishes nothing; ' +
    'instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95768 (the offset-error sensitivity assessment and sign-flip budget this ' +
    'glosses); imp-95749 (conditional dI variation refuting the constant-J null); ' +
    'imp-95720 (measured +4 offset at m=20 and conditional c_odd(1/19)).',
});

export default IMP95793_OFFSET_ERROR_BUDGET_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95793_OFFSET_ERROR_BUDGET_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95793-headword-has-required-fields',
    why: 'The headword must name the exact 2.852e-5 sign-flip budget, the ~2.03e5x ' +
      'residual margin, and the shared-statement mechanism -- the entire point of ' +
      'the glossary entry.',
    holds: () => {
      const h = IMP95793_OFFSET_ERROR_BUDGET_GLOSSARY_HEADWORD.headword;
      return (
        /2\.852e-5/.test(h.definition) &&
        /linear in O/i.test(h.mechanism) &&
        /2\.03e5x/.test(h.verificationStatus) &&
        /uncertified off m=20/i.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp95793-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95793_OFFSET_ERROR_BUDGET_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95793_OFFSET_ERROR_BUDGET_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95793_OFFSET_ERROR_BUDGET_GLOSSARY_HEADWORD.verdict) &&
      IMP95793_OFFSET_ERROR_BUDGET_GLOSSARY_HEADWORD.glosses === 'imp-95768',
  },
];

for (const assertion of IMP95793_OFFSET_ERROR_BUDGET_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95793-offset-error-budget-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
