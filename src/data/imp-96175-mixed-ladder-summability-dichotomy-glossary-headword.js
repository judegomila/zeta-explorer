/**
 * @module imp-96175-mixed-ladder-summability-dichotomy-glossary-headword
 * @fileoverview imp-96175 -- import-light glossary/Concepts headword for the imp-96143
 *   mixed 2^a 3^b {oo,2,3} prolate-ladder summability dichotomy: the CUBIC tail
 *   Sum_n |lam_n|^3 CONVERGES (closed form 1.769529) while the SQUARE tail
 *   Sum_n lam_n^2 DIVERGES, for the semilocal operator A_S23 = P_1 F_S23 P_1.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96143 modeled the mixed-group ladder tail as magnitudes s_u = u^{-1/2}/2 with
 *   multiplicity m_u ~ C*u over S-units u = 2^a 3^b, and showed the cubic power sum is a
 *   convergent geometric double sum (C/8)(G2 G3 - 1) while the square power sum is
 *   (C/4)*(#S-units), which grows without bound because the S-unit semigroup is infinite.
 *   A reader landing on imp-96143 cold has no quick-lookup definition of why cubing (not
 *   squaring) the same ladder magnitudes is what makes the tail summable. This headword
 *   bakes that dichotomy VERBATIM (no re-import of the imp-96143 module, to stay
 *   import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   For the mixed 2^a 3^b {oo,2,3} prolate ladder, the cubic power sum
 *   Sum_n |lam_n|^3 = (C/8)(G2 G3 - 1) = 1.769529 (C = 2) CONVERGES, while the square
 *   power sum Sum_n lam_n^2 = (C/4)*(#S-units) DIVERGES. The two sums use the identical
 *   ladder magnitudes s_u = u^{-1/2}/2 and multiplicities m_u ~ C*u; only the exponent on
 *   s_u changes which power of u survives the sum over S-units.
 *
 *   MECHANISM: m_u * s_u^3 = (C u)(u^{-1/2}/2)^3 is proportional to u^{-1/2}, and
 *   Sum_{a,b>=0} (2^a 3^b)^{-1/2} = G2 * G3 is a convergent product of two geometric
 *   series (ratios 2^{-1/2}, 3^{-1/2} both < 1). But m_u * s_u^2 = (C u)(u^{-1/2}/2)^2 is
 *   proportional to u^0 = 1, so the square sum is C/4 times the (infinite) S-unit count --
 *   an exact denser analogue of the classical p = 2 log-divergent case, since the S-unit
 *   count in a box a <= A, b <= B is (A+1)(B+1) - 1, quadratic rather than linear in the
 *   box side.
 *
 *   STATUS: a DERIVATION restating imp-96143's (II) fact only. It establishes the cubic
 *   tail as a rho-free convergent majorant (robust to the multiplicity constant C) but
 *   proves no new bound and settles nothing about RH. The companion (I) spectral-gap fact
 *   (every tail magnitude <= 0.353553 < 1) is a separate reduction, not covered by this
 *   headword.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96143 cubic/square summability dichotomy
 *   for quick reference. It establishes nothing, instantiates no interval, closes no
 *   sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96143-route-i-mixed-ladder-23-prolate-spectrum-summability (source: the dichotomy this glosses)
 * @see imp-96125-route-i-corr23-continuity-reduction (the corr23 reduction that motivates the dichotomy)
 *
 * Ticket: imp-96175 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The mixed-ladder cubic/square summability dichotomy headword, baked verbatim (no re-import).
const MIXED_LADDER_DICHOTOMY_HEADWORD = Object.freeze({
  key: 'mixed-ladder-23-cubic-converges-square-diverges-dichotomy',
  term:
    'imp-96143 mixed 2^a 3^b {oo,2,3} ladder dichotomy: the cubic tail Sum|lam|^3 = 1.769529 ' +
    'CONVERGES while the square tail Sum lam^2 DIVERGES, for the identical ladder magnitudes',
  definition:
    'For the semilocal A_S23 ladder tail with magnitudes s_u = u^{-1/2}/2 and multiplicity ' +
    'm_u ~ C*u over S-units u = 2^a 3^b (a,b >= 0), the cubic power sum ' +
    'Sum_u m_u s_u^3 = (C/8)(G2 G3 - 1) is a convergent geometric double sum ' +
    '(G2 = 1/(1-2^{-1/2}) = 3.414214, G3 = 1/(1-3^{-1/2}) = 2.366025, closed value ' +
    '1.769529 at C = 2), while the square power sum Sum_u m_u s_u^2 = (C/4)*(#S-units) ' +
    'DIVERGES (grows without bound) as the S-unit semigroup is infinite.',
  mechanism:
    'Cubing s_u leaves a u^{-1/2} factor after multiplying by the u multiplicity, and the ' +
    'double sum of u^{-1/2} over 2^a 3^b factors into two independent convergent geometric ' +
    'series (ratios 2^{-1/2} < 1 and 3^{-1/2} < 1). Squaring s_u instead leaves a constant ' +
    '(u^0) factor, so the sum just counts S-units -- and that count in a box a <= A, b <= B ' +
    'is (A+1)(B+1) - 1, quadratic in the box side, denser than the classical single-prime ' +
    'p = 2 log-divergent case.',
  verificationStatus:
    'DERIVED, not a new bound: restates the imp-96143 fact (II) [cubic tail established] ' +
    'against fact for the square tail [divergent], both robust to the exact multiplicity ' +
    'constant C (only the norm exponent and m_u = O(u) matter). Cross-checked against the ' +
    'single-prime p = 2 and p = 3 cubic tails (0.603553 / 0.341506) which sum with a cross ' +
    'term to the mixed value. Changes no bound; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96175_MIXED_LADDER_DICHOTOMY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96175',
  proofSection: 'S-frontier',
  glosses: 'imp-96143',
  question:
    'imp-96143 computed both the cubic and square power sums of the mixed 2^a 3^b ' +
    '{oo,2,3} prolate ladder tail. Why does cubing the ladder magnitudes converge while ' +
    'squaring them diverges, for a reader landing on that module cold?',
  headword: MIXED_LADDER_DICHOTOMY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96143 mixed ' +
    'ladder summability dichotomy: the cubic tail Sum|lam|^3 = (C/8)(G2 G3 - 1) = ' +
    '1.769529 (C = 2) CONVERGES because it reduces to a product of two convergent ' +
    'geometric series, while the square tail Sum lam^2 = (C/4)*(#S-units) DIVERGES ' +
    'because it just counts the infinite S-unit semigroup. Establishes nothing; ' +
    'instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96143 (the cubic/square dichotomy this glosses); imp-96125 (the corr23 ' +
    'reduction that motivates needing the cubic tail).',
});

export default IMP96175_MIXED_LADDER_DICHOTOMY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96175_MIXED_LADDER_DICHOTOMY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96175-headword-has-required-fields',
    why: 'The headword must name the closed-form cubic tail value, the divergence of the ' +
      'square tail, and the geometric-series-vs-counting discriminator -- the entire ' +
      'point of the glossary entry.',
    holds: () => {
      const h = IMP96175_MIXED_LADDER_DICHOTOMY_GLOSSARY_HEADWORD.headword;
      return (
        /1\.769529/.test(h.definition) &&
        /DIVERGES/.test(h.definition) &&
        /geometric/i.test(h.mechanism) &&
        /quadratic/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96175-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96175_MIXED_LADDER_DICHOTOMY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96175_MIXED_LADDER_DICHOTOMY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96175_MIXED_LADDER_DICHOTOMY_GLOSSARY_HEADWORD.verdict) &&
      IMP96175_MIXED_LADDER_DICHOTOMY_GLOSSARY_HEADWORD.glosses === 'imp-96143',
  },
];

for (const assertion of IMP96175_MIXED_LADDER_DICHOTOMY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96175-mixed-ladder-summability-dichotomy-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
