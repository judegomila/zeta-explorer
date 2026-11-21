/**
 * @module imp-124819-pair-ratio-identity-ladder-glossary-headword
 * @fileoverview imp-124819 -- import-light glossary/Concepts headword recording the imp-124770
 *   finding: the imp-97665 EXACT pair-ratio identity E_CF/E_ET = E_flow/E_trunc holds at every
 *   rung of the landmark ladder L2..L7 (seven decades deep in N, five orders down in flow share),
 *   with the measured 5-point agreement better than 1e-3 relative throughout, and the deep-tail
 *   digit loss (growing to ~6.8e-4 at L7) attributed to |E_CF| round-off collapse, NOT to any
 *   deviation from the identity.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97665 proved E_CF/E_ET = E_flow/E_trunc exactly (a common-factor
 *   cancellation of the crossing kernel K = -1/(N_L sigma_N)) and verified it numerically at
 *   L2/L3/L4. imp-124770 extends the verification to the full landmark ladder L2..L7
 *   (sigma = 0.9, 0.5, 0.1, 0.02, 0.005, 0.001; N = 2.6e7 -> 5.4e15): the measured 5-point
 *   E_CF/E_ET matches the analytic E_flow/E_trunc to better than 1e-3 relative at EVERY rung.
 *   (b) THE DEGRADATION PATTERN. |reldiff| grows strictly down the ladder -- 5.8e-12, 4.8e-10,
 *   2.3e-8, 2.9e-7, 2.0e-5, 6.8e-4 -- but this tracks the collapse of |E_CF| into the
 *   landmark-bisection round-off floor pinned by imp-124769, not a breakdown of the identity:
 *   the common-factor cancellation underlying E_CF/E_ET = E_flow/E_trunc is independent of the
 *   flow share, so it stays exact: only the direct numerical cross-check's PRECISION is
 *   |E_CF|-limited at the far-tail rungs.
 *   (c) WHY IT IS NEW. imp-97665 verified only L2/L3/L4 (3 rungs). imp-124770 is the first
 *   tabulation of the identity AS A LADDER across all six available landmarks, and the first to
 *   connect the far-tail reldiff growth explicitly to the imp-124769 round-off crossover rather
 *   than leaving it as an unexplained degradation.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. This is an accuracy/cross-validation exercise on the
 *   imp-97644/imp-97665 crossing-elasticity model. DIAG3 additivity, the C_C 1/8 ansatz, E_trunc,
 *   and the imp-398 C_F prefactor are all fixed surrogate inputs, perturbed only symbolically as
 *   differentiation axes; no operator positivity established; no RH verdict.
 *   (e) STATUS: documentation only. No bound moved; no coefficient pinned beyond re-citing the
 *   imp-124770 ladder; the rigorous anchor stays the trace ceiling; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement. Not a new derivation. NO QED.
 *
 * @see imp-124770-pair-ratio-identity-landmark-ladder.js (source: the seven-decade ladder this
 *   headword names)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (EXACT pair-ratio identity derivation)
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the |E_CF| round-off crossover that explains
 *   the deep-tail digit loss)
 *
 * Ticket: imp-124819 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The pair-ratio identity ladder headword, baked verbatim (no re-import of the heavy zeros bundle).
const PAIR_RATIO_IDENTITY_LADDER_HEADWORD = Object.freeze({
  key: 'pair-ratio-identity-ladder-imp124770',
  term:
    'Pair-ratio identity ladder: the imp-97665 exact crossing-elasticity identity ' +
    'E_CF/E_ET = E_flow/E_trunc holds at every rung L2..L7, seven decades deep in N, with the ' +
    'deep-tail digit loss attributed to |E_CF| round-off, not identity deviation',
  definition:
    'imp-97665 proved the crossing-elasticity ratio E_CF/E_ET (the C_F-axis vs E_trunc-axis ' +
    'elasticities of the landmark N_L) equals the analytic flow-share ratio E_flow/E_trunc exactly, ' +
    'a common-factor cancellation of the crossing kernel K = -1/(N_L sigma_N). imp-124770 measures ' +
    'this pair-ratio with the imp-97665 5-point O(eps^4) stencil across the full landmark ladder ' +
    'L2..L7 (sigma = 0.9 -> 0.001, N = 2.572e7 -> 5.432e15): the relative agreement reldiff = ' +
    '(E_CF/E_ET)/(E_flow/E_trunc) - 1 stays below 1e-3 in absolute value at every rung.',
  mechanism:
    '|reldiff| grows strictly down the ladder (5.8e-12, 4.8e-10, 2.3e-8, 2.9e-7, 2.0e-5, 6.8e-4 at ' +
    'L2..L7) exactly tracking the collapse of |E_CF| into the landmark-bisection round-off floor ' +
    'pinned by imp-124769 between L5 and L6. The identity itself stays exact because the ' +
    'common-factor cancellation is independent of the flow share E_flow/E_N (which collapses from ' +
    '9.8e-3 at L2 to 5.7e-9 at L7); only the direct numerical cross-check loses precision as the ' +
    'differentiated quantity |E_CF| shrinks toward machine round-off. The far-tail rungs L6/L7 still ' +
    'agree to ~1e-5/1e-4 relative -- a stencil/round-off artefact, not a breakdown of the identity.',
  verificationStatus:
    'Re-cited from the imp-124770 measurement module ' +
    '(src/data/imp-124770-pair-ratio-identity-landmark-ladder.js): measured 5-point E_CF/E_ET ' +
    'matches analytic E_flow/E_trunc to |reldiff| < 1e-3 at every landmark L2..L7, reproducing the ' +
    'imp-97665 L2/L3/L4 reldiffs 5.8e-12/4.8e-10/2.3e-8 verbatim. Naming / glossary headword only; ' +
    'supplies no new bound; DIAG3 and the C_C 1/8 ansatz are untouched; RH open; no refereed bound is changed' +
    '; NO QED.',
});

export const IMP124819_PAIR_RATIO_IDENTITY_LADDER_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124819',
  proofSection: 'S-frontier',
  glosses: 'imp-124770',
  question:
    'imp-124770 tabulated the imp-97665 exact pair-ratio identity E_CF/E_ET = E_flow/E_trunc as a ' +
    'landmark ladder L2..L7, holding seven decades deep in N with agreement better than 1e-3 at ' +
    'every rung, and attributed the deep-tail digit loss to |E_CF| round-off -- what is the ' +
    'headword for this result?',
  headword: PAIR_RATIO_IDENTITY_LADDER_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-124770 result: the ' +
    'imp-97665 exact pair-ratio identity E_CF/E_ET = E_flow/E_trunc holds at every rung of the ' +
    'landmark ladder L2..L7 (|reldiff| < 1e-3 throughout, 5.8e-12 -> 6.8e-4), with the deep-tail ' +
    'digit loss identified as |E_CF| round-off collapse (imp-124769), not identity deviation. No ' +
    'bound moved; DIAG3 and all pinned surrogate constants untouched; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-124770 (the seven-decade pair-ratio identity ladder this glosses); imp-97665 (the exact ' +
    'pair-ratio identity derivation); imp-124769 (the |E_CF| round-off crossover explaining the ' +
    'deep-tail digit loss).',
});

export default IMP124819_PAIR_RATIO_IDENTITY_LADDER_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124819_PAIR_RATIO_IDENTITY_LADDER_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124819-headword-names-identity-and-reldiff-range',
    why: 'The headword must name the E_CF/E_ET = E_flow/E_trunc identity and the reldiff bound -- ' +
      'the entire content of the glossary entry.',
    holds: () => {
      const h = IMP124819_PAIR_RATIO_IDENTITY_LADDER_GLOSSARY_HEADWORD.headword;
      return (
        /E_CF\/E_ET/.test(h.definition) &&
        /E_flow\/E_trunc/.test(h.definition) &&
        /1e-3/.test(h.definition) &&
        /round-off/.test(h.mechanism) &&
        /6\.8e-4/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp124819-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-124770.',
    holds: () =>
      IMP124819_PAIR_RATIO_IDENTITY_LADDER_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124819_PAIR_RATIO_IDENTITY_LADDER_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP124819_PAIR_RATIO_IDENTITY_LADDER_GLOSSARY_HEADWORD.verdict) &&
      IMP124819_PAIR_RATIO_IDENTITY_LADDER_GLOSSARY_HEADWORD.glosses === 'imp-124770',
  },
];

for (const assertion of IMP124819_PAIR_RATIO_IDENTITY_LADDER_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124819-pair-ratio-identity-ladder-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
