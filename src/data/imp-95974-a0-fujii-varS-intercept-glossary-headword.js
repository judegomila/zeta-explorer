/**
 * @module imp-95974-a0-fujii-varS-intercept-glossary-headword
 * @fileoverview imp-95974 -- import-light glossary/Concepts headword recording the imp-95940
 *   reduction a_0 = b - gamma - 1: the O(1) arithmetic intercept of the saturated box number
 *   variance is NOT a free fitting constant, it IS (up to the fixed shift gamma + 1) the
 *   Selberg-Goldston-Fujii Var S(T) prime-sum constant b, and the semiclassical box model
 *   cannot supply it.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   A reader landing on imp-95940 cold sees a back-out spread ~1.18 straddling zero and can
 *   mistake a_0 for an ordinary unresolved fitting parameter that more data would tighten. It
 *   is not: a_0 is IDENTICAL (up to the constant shift gamma + 1) to the rigorous
 *   Selberg-Goldston-Fujii additive constant b in Var S(T), a specific convergent prime sum.
 *   That identification is the entire content of the imp-95940 reduction, and it is easy to
 *   miss on a single pass, so it is baked here VERBATIM (no re-import of imp-95940) as a
 *   standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The saturated box number variance is Sigma^2_sat(T) = (1/pi^2)(loglog(T/2pi) + gamma + 1
 *   + a_0). The saturated box equals TWICE the Selberg variance of S(T) = (1/pi) arg
 *   zeta(1/2+iT), and Var S(T) has the RIGOROUS asymptotic (Selberg; Goldston 1987; Fujii)
 *   Var S(T) = (1/2pi^2)(loglog(T/2pi) + b) + o(1), with b a specific CONVERGENT PRIME SUM.
 *   Doubling and matching term-by-term against the setup line forces
 *     gamma + 1 + a_0 = b   ==>   a_0 = b - gamma - 1.
 *   So a_0 is not an independent smooth-model free parameter to be fit away: it is a fixed
 *   additive shift (by the universal constant gamma + 1) of the arithmetic constant b. Pinning
 *   a_0 is EXACTLY pinning b.
 *
 *   WHY THE BOX MODEL CANNOT GENERATE b
 *   -----------------------------------------------
 *   The semiclassical Berry / Bogomolny-Keating box-variance saturation model fixes only the
 *   loglog SLOPE 1/2pi^2, because that slope comes from counting decorrelated endpoints of the
 *   box (a purely geometric/smooth-density fact). The additive intercept b is a genuinely
 *   ARITHMETIC input -- a convergent sum over primes entering the Selberg-Goldston-Fujii
 *   asymptotic for Var S(T) -- that the smooth semiclassical density from which the box model
 *   is built simply does not encode. No amount of refining the box's smooth-counting
 *   heuristic can produce b; it must be imported from the rigorous prime-sum asymptotic. This
 *   is why imp-95940 records TWO separate obstructions (empirical noise plus this analytic
 *   gap) rather than treating a_0 as an ordinary fittable residual.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95940 identity for quick reference. It
 *   establishes nothing new, instantiates no interval, closes no sub-gap, moves no bound.
 *   imp-2519 no-overclaim guard preserved; NO QED. No refereed bound is changed.
 *
 * @see imp-95940-arithmetic-intercept-a0-obstruction (source: a_0 = b - gamma - 1, two-leg obstruction)
 * @see imp-95921-c0-offset-approach-analytic-bracket (named the sub-gap; slope pinned, intercept not)
 * @see imp-95897-c0-offset-monotonicity-envelope-safety (noise-dominated data, R^2 = 0.0007)
 * @see imp-95973-six-point-noise-domination-wall-glossary-headword (sibling headword, shared six-point wall)
 *
 * Ticket: imp-95974 (content, medium). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The a_0 = b - gamma - 1 headword, baked verbatim (no re-import of imp-95940).
const A0_FUJII_VARS_INTERCEPT_HEADWORD = Object.freeze({
  key: 'a0-fujii-varS-intercept',
  term:
    'a_0 = b - gamma - 1 (imp-95940 arithmetic-intercept identity)',
  definition:
    'The O(1) arithmetic intercept a_0 of the saturated box number variance ' +
    'Sigma^2_sat(T) = (1/pi^2)(loglog(T/2pi) + gamma + 1 + a_0) is not a free smooth-model ' +
    'constant. Because the saturated box equals TWICE the Selberg variance of S(T), and ' +
    'Var S(T) = (1/2pi^2)(loglog(T/2pi) + b) + o(1) is the rigorous Selberg / Goldston 1987 / ' +
    'Fujii asymptotic with b a convergent prime sum, term-by-term matching forces ' +
    'gamma + 1 + a_0 = b, i.e. a_0 = b - gamma - 1. Pinning a_0 is exactly pinning b.',
  whyBoxModelCannotSupplyB:
    'The semiclassical Berry / Bogomolny-Keating box-variance saturation model fixes only the ' +
    'loglog SLOPE 1/2pi^2, a geometric fact about decorrelated box endpoints. The additive ' +
    'constant b is a genuinely arithmetic input -- a convergent prime sum in the ' +
    'Selberg-Goldston-Fujii asymptotic -- that the smooth semiclassical density underlying the ' +
    'box model does not encode, so no refinement of that model can generate it.',
  consequence:
    'a_0 is a fixed-shift image of the rigorous constant b, not an ordinary fittable residual: ' +
    'closing the imp-95921 sub-gap requires IMPORTING b to O(0.01) from the number-theoretic ' +
    'asymptotic, not extracting more precision from the box model or the accessible data.',
});

export const IMP95974_A0_FUJII_VARS_INTERCEPT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95974',
  proofSection: 'S-frontier',
  glosses: 'imp-95940',
  question:
    'imp-95940 reduces the imp-95921 O(1) arithmetic intercept a_0 to a_0 = b - gamma - 1. Is ' +
    'a_0 an ordinary fittable residual, or a fixed-shift image of a specific rigorous constant, ' +
    'for a reader landing on the thread cold?',
  headword: A0_FUJII_VARS_INTERCEPT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). The saturated box number variance ' +
    'equals 2 x Var S(T), so matching Sigma^2_sat = (1/pi^2)(loglog(T/2pi) + gamma + 1 + a_0) ' +
    'against the rigorous Selberg-Goldston-Fujii asymptotic Var S(T) = ' +
    '(1/2pi^2)(loglog(T/2pi) + b) forces a_0 = b - gamma - 1: the O(1) intercept IS (up to the ' +
    'fixed shift gamma + 1) the arithmetic prime-sum constant b, not a free parameter. The box ' +
    'model supplies only the loglog slope 1/2pi^2 (a geometric decorrelated-endpoint fact), ' +
    'not b (an arithmetic prime sum), so it cannot generate a_0. Establishes nothing; ' +
    'instantiates no interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95940 (a_0 = b - gamma - 1 reduction; two-leg obstruction; sharpened sub-gap ' +
    'imp-95940-subgap-fujii-varS-constant); imp-95921 (named the original sub-gap); Selberg / ' +
    'Goldston 1987 / Fujii (rigorous Var S(T) = (1/2pi^2)(loglog(T/2pi) + b) asymptotic).',
});

export default IMP95974_A0_FUJII_VARS_INTERCEPT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95974_A0_FUJII_VARS_INTERCEPT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95974-headword-states-the-identity',
    why: 'The headword must state the exact a_0 = b - gamma - 1 identity and why the box model ' +
      'cannot generate b -- the entire content of the imp-95940 reduction.',
    holds: () => {
      const h = IMP95974_A0_FUJII_VARS_INTERCEPT_GLOSSARY_HEADWORD.headword;
      return (
        /a_0 = b - gamma - 1/.test(h.definition) &&
        /gamma \+ 1 \+ a_0 = b/.test(h.definition) &&
        /Selberg/.test(h.definition) &&
        /Goldston/.test(h.definition) &&
        /Fujii/.test(h.definition) &&
        /prime sum/.test(h.whyBoxModelCannotSupplyB) &&
        /loglog SLOPE/.test(h.whyBoxModelCannotSupplyB)
      );
    },
  },
  {
    id: 'imp95974-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, source ' +
      'ticket id recorded.',
    holds: () =>
      IMP95974_A0_FUJII_VARS_INTERCEPT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95974_A0_FUJII_VARS_INTERCEPT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95974_A0_FUJII_VARS_INTERCEPT_GLOSSARY_HEADWORD.verdict) &&
      /imp-95940/.test(IMP95974_A0_FUJII_VARS_INTERCEPT_GLOSSARY_HEADWORD.glosses),
  },
];

for (const assertion of IMP95974_A0_FUJII_VARS_INTERCEPT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95974-a0-fujii-varS-intercept-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
