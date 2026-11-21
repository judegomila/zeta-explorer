/**
 * @module imp-96412-peak-knee-two-landmarks-glossary-headword
 * @fileoverview imp-96412 -- import-light glossary/Concepts headword for the imp-96388
 *   result: the imp-3220/imp-96266 sigma(N) value U-shape PEAK (log10 N ~ 5.965,
 *   N ~ 9.22e5) and the imp-96351 sigma(N) exponent-ramp KNEE (log10 N* ~ 9.529,
 *   N ~ 3.38e9) are TWO INDEPENDENT landmarks, ~3.56 decades apart on the SAME
 *   conditional-share curve sigma(N) = E_coll/(E_trunc + E_flow + E_coll) -- not the
 *   same feature read off at two different differencing orders.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96388 cross-tabulated both landmarks on a shared log10 N axis and measured which
 *   sub-term sources each, but left no standalone quick-lookup entry for a reader who
 *   only wants the headline distinction: peak != knee, and they are built by different
 *   terms. This headword bakes that verbatim (no re-import of the imp-96388/imp-96351/
 *   imp-96266/imp-3220 modules, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   PEAK: a first-difference sign change of sigma itself (dsigma/dN: + -> -), at
 *   log10 N ~ 5.965 (N ~ 9.22e5), sigma ~ 0.9494. Sourced by E_flow/E_N ~ 3.06e-2
 *   (appreciable) -- the imp-96266 E_flow-manufactured maximum.
 *   KNEE: a second-difference zero crossing of the OLS local decay exponent (a curvature
 *   inflection deep in the post-peak decay), at log10 N* ~ 9.529 (N ~ 3.38e9),
 *   sigma ~ 0.496. Sourced by E_coll/E_trunc ~ 0.986 ~ 1 -- the knee coincides with the
 *   imp-33723 closed-form E_coll = E_trunc crossover (N_cross ~ 3.28e9), not with E_flow
 *   (E_flow/E_N there is only ~9.31e-4, about 33x smaller than at the peak).
 *   Between the two, sigma falls MONOTONICALLY from ~0.95 to ~0.50 -- no shared
 *   stationary structure links them, confirming two distinct landmarks rather than one
 *   feature seen at different differencing orders.
 *
 *   STATUS: a measurement (frontier-direction), not a rigorous asymptotic. The component
 *   model is the inherited imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per
 *   imp-486 stays untouched.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96388 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96388-sigma-peak-vs-knee-cross-tabulation (source: the cross-tabulation and finding this glosses)
 * @see imp-96351-sigma-knee-tenthdecade-1e12-stability (knee at log10 N* ~ 9.529, N ~ 3.38e9)
 * @see imp-96266-eflow-peak-recovery-residual (peak at N ~ 9.22e5, E_flow-manufactured)
 * @see imp-3220-en-bridge-fidelity-frontier (interior peak sigma_max ~ 0.9494)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover N_cross ~ 3.28e9)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 *
 * Ticket: imp-96412 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The two-landmarks headword, baked verbatim (no re-import).
const PEAK_KNEE_TWO_LANDMARKS_HEADWORD = Object.freeze({
  key: 'sigma-peak-vs-knee-two-distinct-landmarks',
  term:
    'imp-96388 verdict: the imp-3220 sigma(N) value PEAK and the imp-96351 exponent-ramp ' +
    'KNEE are two independent landmarks ~3.56 decades apart, not one feature at different ' +
    'differencing orders',
  definition:
    'Both landmarks are read off the SAME conditional share sigma(N) = E_coll / ' +
    '(E_trunc + E_flow + E_coll), but at different differencing orders: the PEAK is a ' +
    'first-difference sign change of sigma itself (log10 N ~ 5.965, N ~ 9.22e5, ' +
    'sigma ~ 0.9494); the KNEE is a second-difference zero crossing of the OLS local decay ' +
    'exponent ramp -- a curvature inflection (log10 N* ~ 9.529, N ~ 3.38e9, sigma ~ 0.496). ' +
    'They sit ~3.56 decades apart and sigma falls monotonically between them, so they are ' +
    'NOT the same feature seen at two orders of the same ramp.',
  mechanism:
    'The two landmarks are built by DIFFERENT sub-terms. At the peak E_flow/E_N ~ 3.06e-2 ' +
    '(appreciable) -- this is the imp-96266 E_flow-manufactured maximum. At the knee ' +
    'E_flow/E_N ~ 9.31e-4 (about 33x smaller, negligible); instead E_coll/E_trunc ~ 0.986 ~ 1 ' +
    'there, so the knee coincides with the imp-33723 closed-form E_coll = E_trunc crossover ' +
    '(N_cross ~ 3.28e9, only ~0.013 in log10 above the knee). The exponent-ramp inflection is ' +
    'the collapse-vs-truncation crossover, a full ~3.55 decades above the E_flow-built peak.',
  verificationStatus:
    'Measurement (frontier-direction), conditional-share landmark diagnostic, not a ' +
    'rigorous asymptotic. Component model is the inherited imp-3220/imp-3406 extrapolation; ' +
    'the C_mb GUE-conditional per imp-486 stays untouched. Changes no bound; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96412_PEAK_KNEE_TWO_LANDMARKS_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96412',
  proofSection: 'S-frontier',
  glosses: 'imp-96388',
  question:
    'imp-96388 cross-tabulated the imp-3220 sigma(N) value peak and the imp-96351 ' +
    'exponent-ramp knee on one shared log10 N axis. Are they the same feature at ' +
    'different differencing orders, or two independent landmarks -- and if independent, ' +
    'which sub-term sources each?',
  headword: PEAK_KNEE_TWO_LANDMARKS_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96388 verdict: ' +
    'the peak (log10 N ~ 5.965, sigma ~ 0.9494, E_flow-built) and the knee (log10 N ~ 9.529, ' +
    'sigma ~ 0.496, E_coll=E_trunc-crossover-built) are TWO INDEPENDENT landmarks ~3.56 ' +
    'decades apart, sourced by different sub-terms, with sigma monotone decreasing between ' +
    'them. Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96388 (the cross-tabulation and finding this glosses); imp-96351 (knee at ' +
    'log10 N* ~ 9.529); imp-96266 (peak at N ~ 9.22e5, E_flow-manufactured); imp-3220 ' +
    '(interior peak landmark); imp-33723 (closed-form crossover N_cross ~ 3.28e9); ' +
    'imp-486 (C_mb GUE-conditional).',
});

export default IMP96412_PEAK_KNEE_TWO_LANDMARKS_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96412_PEAK_KNEE_TWO_LANDMARKS_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96412-headword-has-required-fields',
    why: 'The headword must name both landmarks, their differencing orders, and their ' +
      'source terms -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96412_PEAK_KNEE_TWO_LANDMARKS_GLOSSARY_HEADWORD.headword;
      return (
        /first-difference sign change/.test(h.definition) &&
        /second-difference zero crossing/.test(h.definition) &&
        /3\.56 decades/.test(h.definition) &&
        /33x smaller/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96412-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96412_PEAK_KNEE_TWO_LANDMARKS_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96412_PEAK_KNEE_TWO_LANDMARKS_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96412_PEAK_KNEE_TWO_LANDMARKS_GLOSSARY_HEADWORD.verdict) &&
      IMP96412_PEAK_KNEE_TWO_LANDMARKS_GLOSSARY_HEADWORD.glosses === 'imp-96388',
  },
];

for (const assertion of IMP96412_PEAK_KNEE_TWO_LANDMARKS_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96412-peak-knee-two-landmarks-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
