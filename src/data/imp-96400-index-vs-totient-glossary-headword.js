/**
 * @module imp-96400-index-vs-totient-glossary-headword
 * @fileoverview imp-96400 -- import-light glossary/Concepts headword for the imp-96366
 *   three-prime S={oo,2,3,5} multiplicity measurement: the dilation-block INDEX
 *   m_u=|Z/uZ|=u is JUSTIFIED at exponent exactly 1 on the mixed 2^a 3^b 5^c rungs
 *   because it is multiplicative, while the primitive-residue TOTIENT count's
 *   slightly-sub-1 pooled slope (0.985668) is a finite-range prime-class-mixing
 *   artifact, not genuine sub-linear growth.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96143 extrapolated the block multiplicity m_u ~ C u from the single-prime p=2
 *   ladder without measuring the three-prime mixed rungs. imp-96366 measured both
 *   candidate multiplicity counts on those rungs and found they tell DIFFERENT stories
 *   about the O(u) growth law: one count confirms it exactly, the other appears to
 *   depart from it under a naive pooled fit. A reader landing on imp-96366 cold has no
 *   quick-lookup definition of why the two counts diverge or which one actually
 *   justifies the extrapolation. This headword bakes that index-vs-totient distinction
 *   VERBATIM (no re-import of the imp-96366 module, to stay import-light) as a
 *   standalone entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   Two honest multiplicity counts exist for the scale-u dilation block on S-unit
 *   rungs u = 2^a 3^b 5^c: (A) the dilation-block INDEX m_u = |Z/uZ| = u, and (B) the
 *   PRIMITIVE-RESIDUE count phi_u = |(Z/uZ)^*| = u * prod_{p|u} (1-1/p). Fitting
 *   ln(count) vs ln(u) by OLS over p=2-only, mixed (>=2 primes), and full three-prime
 *   rungs (u <= 1e9) gives: (A) exponent EXACTLY 1.000000 (R^2=1) on every rung
 *   subset -- because the index is multiplicative, |Z/uZ| = prod_p p^{e_p} = u holds
 *   identically regardless of how many primes divide u, so the O(u) extrapolation is
 *   JUSTIFIED, not merely assumed. (B) exponent EXACTLY 1.000000 within each
 *   prime-content class (p=2-only alone fits 1.000000), but the POOLED fit across
 *   mixed classes gives 0.991247 (mixed) and 0.985668 (full three-prime) -- a
 *   FINITE-RANGE ARTIFACT of averaging classes whose leading Euler constants differ
 *   (phi_u/u = 1/2 for one prime down to 4/15 = 0.266667 for all three), not genuine
 *   sub-linear growth. The real three-prime effect under (B) is a DOWNWARD shift in
 *   the leading constant via the Euler factor (1-1/3)(1-1/5) = 8/15, which keeps m_u
 *   in the O(u) growth class the imp-96143 cubic tail majorant needs (and a smaller
 *   constant only decreases that majorant).
 *
 *   STATUS: a MEASUREMENT/classification headword, not a proof. Confirms the O(u)
 *   growth class on three-prime rungs and explains away the apparent totient
 *   sub-linearity as a mixing artifact. Establishes no operator positivity, moves no
 *   Lambda bound, and does not touch the top confined states. RH open; no refereed bound is changed
 *   ; NO QED.
 *
 * @see imp-96366-mixed-ladder-multiplicity-growth-exponent (source: the measurement this glosses)
 * @see imp-96333-mixed-ladder-235-spectral-gap-margin-tabulation (HONEST LIMITS flag this measurement answers)
 * @see imp-96143-route-i-mixed-ladder-23-prolate-spectrum-summability (the m_u ~ C u multiplicity model calibrated to p=2)
 *
 * Ticket: imp-96400 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The index-vs-totient headword, baked verbatim (no re-import).
const INDEX_VS_TOTIENT_HEADWORD = Object.freeze({
  key: 'dilation-index-vs-totient-multiplicity-235',
  term:
    'imp-96366 index-vs-totient distinction: the dilation-block INDEX m_u=|Z/uZ|=u is ' +
    'multiplicative so its O(u) exponent is exactly 1 on every three-prime {oo,2,3,5} rung ' +
    'subset, while the primitive-residue TOTIENT count phi_u=u*prod(1-1/p) only fits exponent ' +
    '1 within a single prime-content class -- its slightly-sub-1 pooled slope (0.985668) is a ' +
    'finite-range class-mixing artifact, not sub-linear growth',
  definition:
    'On S-unit rungs u = 2^a 3^b 5^c, two honest multiplicity counts exist for the scale-u ' +
    'dilation block: (A) the index m_u = |Z/uZ| = u, and (B) the primitive-residue count ' +
    'phi_u = |(Z/uZ)^*| = u * prod_{p|u} (1 - 1/p). OLS fits of ln(count) vs ln(u) over ' +
    'p=2-only, mixed (>=2 primes), and full three-prime rungs (u <= 1e9) give: (A) exponent ' +
    'EXACTLY 1.000000, R^2 = 1, on every subset -- the index is multiplicative, ' +
    '|Z/uZ| = prod_p p^{e_p} = u identically, independent of prime count, so the O(u) ' +
    'extrapolation from p = 2 is JUSTIFIED rather than assumed. (B) exponent EXACTLY ' +
    '1.000000 within each single prime-content class (p=2-only fits 1.000000, intercept ' +
    'ln(1/2)), but the POOLED fit across mixed classes reads 0.991247 (mixed) and 0.985668 ' +
    '(full three-prime) -- an artifact of averaging classes with different leading Euler ' +
    'constants (phi_u/u ranges from 1/2 at one prime down to 4/15 = 0.266667 at three primes), ' +
    'not genuine sub-linear growth.',
  mechanism:
    'The index count is multiplicative in u by definition of the quotient group Z/uZ, so its ' +
    'log-log slope is pinned to exactly 1 regardless of how many distinct primes divide u -- ' +
    'there is no room for a class-mixing artifact. The totient count instead carries a ' +
    'leading constant prod_{p|u}(1-1/p) that DEPENDS on the prime-content class of u; pooling ' +
    'rungs from different classes into one OLS fit blends several exactly-linear-but-differently' +
    '-scaled families into an apparent sub-1 slope, exactly as averaging several parallel lines ' +
    'with different intercepts on a log-log plot produces a shallower overall regression slope ' +
    'even though every individual line has slope 1.',
  verificationStatus:
    'MEASUREMENT/classification only: imp-96366 fits confirm exponent 1.000000 (R^2=1) for the ' +
    'index on p=2-only, mixed, and full three-prime rungs, and exponent 1.000000 for the ' +
    'totient WITHIN the p=2-only class (pooled totient slope 0.991247 mixed / 0.985668 full is ' +
    'the class-mixing artifact, not a departure from O(u)). The imp-96143 cubic tail majorant ' +
    'only needs the O(u) growth class (it is robust to the constant), so this measurement ' +
    'leaves that conclusion unaffected. Establishes no operator positivity; moves no Lambda ' +
    'bound; does not touch the top confined states; RH open; no refereed bound is changed; NO QED.',
});

export const IMP96400_INDEX_VS_TOTIENT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96400',
  proofSection: 'S-frontier',
  glosses: 'imp-96366',
  question:
    'imp-96143 extrapolated the block multiplicity m_u ~ C u from the p=2 ladder without ' +
    'measuring three-prime mixed rungs. imp-96366 measured two candidate counts and found one ' +
    'confirms O(u) exactly while the other appears sub-linear when pooled -- why, for a reader ' +
    'landing on imp-96366 cold?',
  headword: INDEX_VS_TOTIENT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96366 finding: the ' +
    'dilation-block index m_u = |Z/uZ| = u is multiplicative, so its O(u) growth exponent is ' +
    'exactly 1.000000 (R^2 = 1) on every three-prime rung subset, JUSTIFYING the imp-96143 ' +
    'extrapolation; the primitive-residue totient phi_u = u*prod(1-1/p) is also exactly linear ' +
    'WITHIN a single prime-content class, but its pooled slope (0.985668 full three-prime) is a ' +
    'finite-range artifact of mixing classes with different leading Euler constants, not ' +
    'sub-linear growth. Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96366 (the multiplicity measurement this glosses); imp-96333 (HONEST LIMITS flag this ' +
    'measurement answers); imp-96143 (the m_u ~ C u multiplicity model calibrated to p=2).',
});

export default IMP96400_INDEX_VS_TOTIENT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96400_INDEX_VS_TOTIENT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96400-headword-has-required-fields',
    why: 'The headword must name both multiplicity counts, the exact-1 index exponent, and the ' +
      'pooled totient slope -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96400_INDEX_VS_TOTIENT_GLOSSARY_HEADWORD.headword;
      return (
        /m_u = \|Z\/uZ\| = u/.test(h.definition) &&
        /phi_u = \|\(Z\/uZ\)\^\*\|/.test(h.definition) &&
        /0\.985668/.test(h.definition) &&
        /4\/15 = 0\.266667/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96400-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96400_INDEX_VS_TOTIENT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96400_INDEX_VS_TOTIENT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96400_INDEX_VS_TOTIENT_GLOSSARY_HEADWORD.verdict) &&
      IMP96400_INDEX_VS_TOTIENT_GLOSSARY_HEADWORD.glosses === 'imp-96366',
  },
];

for (const assertion of IMP96400_INDEX_VS_TOTIENT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96400-index-vs-totient-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
