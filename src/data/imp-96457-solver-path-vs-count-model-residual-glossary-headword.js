/**
 * @module imp-96457-solver-path-vs-count-model-residual-glossary-headword
 * @fileoverview imp-96457 -- import-light glossary/Concepts headword distinguishing
 *   the SOLVER-PATH residual (imp-96427) from the COUNT-MODEL residual (imp-96404)
 *   in the imp-96351 sigma(N) knee/crossover landmarks, so a reader can tell which
 *   residual a given comparison isolates.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96404 and imp-96427 both perturb one ingredient of the same knee/crossover
 *   measurement and report a "spread", but they perturb DIFFERENT ingredients:
 *   imp-96404 swaps the COUNT MODEL that gamma_N solves for (main-term N(T) vs the
 *   +7/8-corrected count), while imp-96427 swaps the SOLVER used to invert the SAME
 *   main-term count (Newton iteration vs closed-form Lambert-W). Quoting either
 *   number as "the residual" without naming which axis moved conflates a genuine
 *   modeling choice with pure floating-point noise. This headword bakes both
 *   figures verbatim (no re-import of the imp-96404/imp-96427 modules, to stay
 *   import-light) as a standalone quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   COUNT-MODEL residual (imp-96404): holding the solver fixed (Newton) and
 *   changing WHICH EQUATION gamma_N solves (main-term N(T) vs +7/8-corrected
 *   N(T)) moves the tenth-decade knee by ~1.3e-10 in log10 N* and the sigma = 1/2
 *   crossover by ~6e-12 -- a genuine, if tiny, MODELING effect.
 *   SOLVER-PATH residual (imp-96427): holding the count model fixed (main-term)
 *   and changing HOW gamma_N is computed (Newton iteration vs closed-form
 *   Lambert-W) moves the same knee by only ~1.2e-13 in log10 N* -- about three
 *   orders of magnitude SMALLER than the count-model shift, and attributable to
 *   floating-point noise (the two solvers agree on gamma_N at the knee to
 *   relative ~8.1e-16). The sigma = 1/2 crossover and the knee-minus-crossover
 *   gap (~0.01482 log10, the imp-96388 landmark) are solver-path invariant to the
 *   same floating-point floor.
 *   The two residuals are NOT comparable in scale (count-model is ~10^3x the
 *   solver-path spread) and answer different questions: "does the equation
 *   change" versus "does the numerical method to invert it change".
 *
 *   STATUS: a naming/classification headword restating two prior measurements,
 *   not a fresh derivation of either residual.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96404/imp-96427 verdicts for quick
 *   reference. It establishes nothing, instantiates no interval, closes no
 *   sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96427-knee-crossover-solver-path-spread (source: the solver-path residual this glosses)
 * @see imp-96404-sigma-knee-plus78-count-model-shift (source: the count-model residual this glosses)
 * @see imp-96351-sigma-knee-tenthdecade-1e12-stability (baseline knee at log10 N* ~ 9.529)
 * @see imp-96388-sigma-peak-vs-knee-cross-tabulation (knee sits ~0.015 log10 above the crossover)
 *
 * Ticket: imp-96457 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The solver-path-vs-count-model residual-classification headword, baked verbatim
// (no re-import of the imp-96404/imp-96427 modules).
const SOLVER_PATH_VS_COUNT_MODEL_RESIDUAL_HEADWORD = Object.freeze({
  key: 'solver-path-vs-count-model-residual',
  term:
    'Two distinct residual classes in the imp-96351 sigma(N) knee/crossover landmarks: ' +
    'the COUNT-MODEL residual (imp-96404, which equation gamma_N solves) and the ' +
    'SOLVER-PATH residual (imp-96427, which algorithm inverts that equation)',
  definition:
    'A knee/crossover comparison can isolate one of two different things, and they ' +
    'must not be conflated. The COUNT-MODEL residual holds the height-inversion ' +
    'solver fixed and swaps WHICH riemann counting function gamma_N solves for -- ' +
    'imp-96404 compared the main-term N(T) = (T/2pi)(log(T/2pi)-1) against the ' +
    '+7/8-corrected count, moving the tenth-decade knee ~1.3e-10 in log10 N* and ' +
    'the sigma = 1/2 crossover ~6e-12. The SOLVER-PATH residual holds the count ' +
    'model fixed (main-term) and swaps HOW gamma_N is computed from it -- imp-96427 ' +
    'compared the Newton main-term inverse (effectiveHeightForN) against the ' +
    'closed-form Lambert-W inverse (imp-96363), moving the same knee by only ' +
    '~1.2e-13 in log10 N*, about 1e3x smaller, with the two solvers agreeing on ' +
    'gamma_N at the knee to relative ~8.1e-16 (machine precision).',
  mechanism:
    'The count-model residual is a genuine, if tiny, MODELING choice: it changes ' +
    'the equation (T/2pi)(log(T/2pi)-1) = N versus (T/2pi)(log(T/2pi)-1)+7/8 = N, ' +
    'so a nonzero shift is expected on physical grounds. The solver-path residual ' +
    'changes nothing about the equation -- both effectiveHeightForN (Newton) and ' +
    'gammaLambertMain (Lambert-W) invert the IDENTICAL main-term equation -- so its ' +
    'nonzero size is pure floating-point/iteration-vs-closed-form NOISE, not a ' +
    'modeling effect. Because the solver-path spread (~1.2e-13) sits ~3 orders of ' +
    'magnitude below the count-model spread (~1.3e-10), the imp-96404 conclusions ' +
    'about the count-model effect carry no detectable Newton-solver artifact.',
  verificationStatus:
    'Measurement classification (accuracy audit), not a rigorous derivation of ' +
    'either residual. Changes no bound; the conditional C_H <= 0.127 stays ' +
    'UNPROVEN; C_H isRigorousUpperBound remains false (imp-2642/imp-2701); no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96457_SOLVER_PATH_VS_COUNT_MODEL_RESIDUAL_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96457',
  proofSection: 'S-frontier',
  glosses: 'imp-96427',
  question:
    'imp-96427 isolated the inter-METHOD (solver-path) spread in the imp-96404 ' +
    'knee/crossover landmarks as a residual distinct from the inter-COUNT-MODEL ' +
    'shift imp-96404 measured. How should a reader tell the two residual classes ' +
    'apart when a comparison quotes one of them?',
  headword: SOLVER_PATH_VS_COUNT_MODEL_RESIDUAL_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the two residual ' +
    'classes in the imp-96351 knee/crossover landmarks: the COUNT-MODEL residual ' +
    '(imp-96404, ~1.3e-10 in log10 N*, a genuine modeling shift from swapping which ' +
    'count gamma_N solves) and the SOLVER-PATH residual (imp-96427, ~1.2e-13, ' +
    'floating-point noise from swapping how that count is inverted, ~1e3x smaller). ' +
    'Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96427 (the solver-path residual this glosses, ~1.2e-13 log10 N* spread, ' +
    'Newton vs Lambert-W); imp-96404 (the count-model residual this glosses, ' +
    '~1.3e-10 log10 N* shift, main-term vs +7/8-corrected count); imp-96351 ' +
    '(baseline knee at log10 N* ~ 9.529); imp-96388 (knee ~0.015 log10 above the ' +
    'crossover); imp-96363 (Lambert-W closed form).',
});

export default IMP96457_SOLVER_PATH_VS_COUNT_MODEL_RESIDUAL_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96457_SOLVER_PATH_VS_COUNT_MODEL_RESIDUAL_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96457-headword-names-both-residual-classes',
    why: 'The headword must name both residual classes, their sources, and their ' +
      'relative scale -- the entire point of the distinction.',
    holds: () => {
      const h = IMP96457_SOLVER_PATH_VS_COUNT_MODEL_RESIDUAL_GLOSSARY_HEADWORD.headword;
      return (
        /COUNT-MODEL residual/.test(h.definition) &&
        /SOLVER-PATH residual/.test(h.definition) &&
        /1\.3e-10/.test(h.definition) &&
        /1\.2e-13/.test(h.definition) &&
        /1e3x smaller/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96457-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96457_SOLVER_PATH_VS_COUNT_MODEL_RESIDUAL_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96457_SOLVER_PATH_VS_COUNT_MODEL_RESIDUAL_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96457_SOLVER_PATH_VS_COUNT_MODEL_RESIDUAL_GLOSSARY_HEADWORD.verdict) &&
      IMP96457_SOLVER_PATH_VS_COUNT_MODEL_RESIDUAL_GLOSSARY_HEADWORD.glosses === 'imp-96427',
  },
];

for (const assertion of IMP96457_SOLVER_PATH_VS_COUNT_MODEL_RESIDUAL_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96457-solver-path-vs-count-model-residual-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
