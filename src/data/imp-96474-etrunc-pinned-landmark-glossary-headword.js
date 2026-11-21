/**
 * @module imp-96474-etrunc-pinned-landmark-glossary-headword
 * @fileoverview imp-96474 -- import-light glossary/Concepts headword for the imp-96451
 *   finding: the imp-96427/imp-96351 tenth-decade sigma-knee and sigma = 1/2 crossover
 *   are set to leading order by the rigorous, N-independent truncation floor E_trunc,
 *   NOT primarily by the GUE-conditional collision term E_coll.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96427 showed the knee/crossover are SOLVER-PATH invariant (Newton vs
 *   Lambert-W agree to ~1e-13) but did not test sensitivity to the fixed truncation
 *   floor E_trunc = 3.06e-5 -- the ONE term in the sigma(N) = E_coll/(E_trunc+E_flow
 *   +E_coll) component model that is NOT GUE-conditional. imp-96451 measured that
 *   sensitivity directly: perturbing E_trunc by 0.5x..2x moves both landmarks with
 *   elasticity ~-0.911, close to the analytic leading term -2/ln10 = -0.8686 that
 *   follows from E_coll ~ E_trunc at the crossover. This headword bakes that verdict
 *   verbatim (no re-import of the imp-96451 module, to stay import-light) as a
 *   standalone quick-lookup entry, and disambiguates it from the unrelated
 *   floating-point noise imp-96427 already ruled out.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   E_trunc-PINNED LANDMARK (imp-96451): the tenth-decade sigma-knee (log10 N* ~
 *   9.529) and the sigma = 1/2 crossover in the sigma(N) conditional-share component
 *   model move with elasticity d(log10 N*)/d(log E_trunc) ~ -0.911 under a 0.5x..2x
 *   perturbation of the rigorous, N-independent truncation floor E_trunc = 3.06e-5 --
 *   a factor-2 change in E_trunc drags both landmarks DOWN by ~0.63 in log10 N*. This
 *   is ~10^10x larger than the ~1e-13 solver-path noise imp-96427 measured on the same
 *   landmarks, so the landmark LOCATION is set to leading order by the rigorous floor,
 *   not primarily pinned by the GUE-conditional E_coll term. The measured elasticity
 *   matches the analytic leading term -2/ln10 = -0.8686 (from E_coll ~ E_trunc at the
 *   crossover) to within ~5 percent. The knee tracks the crossover rigidly -- their
 *   elasticities agree to three figures -- so the knee-minus-crossover gap (~0.0148
 *   log10, the imp-96388 landmark) is E_trunc-INVARIANT across the whole 0.5x..2x
 *   band even though the landmarks' absolute height is not.
 *
 *   STATUS: a naming/classification headword restating the imp-96451 measurement,
 *   not a fresh derivation.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96451 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   The component model is the inherited imp-3220/imp-3406 extrapolation, not a
 *   rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; C_H
 *   isRigorousUpperBound stays false (imp-2642/imp-2701). NO QED. No refereed bound is changed.
 *
 * @see imp-96451-sigma-knee-etrunc-sensitivity (source: the E_trunc sensitivity measurement this glosses)
 * @see imp-96427-knee-crossover-solver-path-spread (the ~1e-13 solver-path noise this landmark is NOT primarily due to)
 * @see imp-96351-sigma-knee-tenthdecade-1e12-stability (baseline knee at log10 N* ~ 9.529)
 * @see imp-96388-sigma-peak-vs-knee-cross-tabulation (the E_trunc-invariant knee-minus-crossover gap)
 *
 * Ticket: imp-96474 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The E_trunc-pinned-landmark headword, baked verbatim (no re-import of imp-96451).
const ETRUNC_PINNED_LANDMARK_HEADWORD = Object.freeze({
  key: 'etrunc-pinned-landmark',
  term:
    'The imp-96351/imp-96427 tenth-decade sigma-knee and sigma = 1/2 crossover are ' +
    'set to leading order by the rigorous truncation floor E_trunc (imp-96451, ' +
    'elasticity ~-0.911), not primarily by the GUE-conditional E_coll term',
  definition:
    'Perturbing the N-independent truncation floor E_trunc = 3.06e-5 -- the sole ' +
    'non-GUE-conditional term in sigma(N) = E_coll/(E_trunc+E_flow+E_coll) -- by a ' +
    'log-symmetric 0.5x..2x band moves BOTH the tenth-decade knee and the sigma = 1/2 ' +
    'crossover with elasticity d(log10 N*)/d(log E_trunc) ~ -0.911: a factor-2 rise ' +
    'in E_trunc drags both landmarks DOWN by ~0.63 in log10 N*. This is ~10 orders of ' +
    'magnitude larger than the ~1.2e-13 solver-path noise imp-96427 measured on the ' +
    'identical landmarks (Newton vs Lambert-W), so the landmark location is pinned by ' +
    'the rigorous floor, not primarily by the GUE-conditional collision term E_coll.',
  mechanism:
    'At the crossover, E_coll ~ E_trunc + E_flow ~ E_trunc (E_flow is ~1e-8, ' +
    'negligible there), so C_C sqrt(L/N) ~ E_trunc gives log10 N ~ const - 2 log10 ' +
    'E_trunc, i.e. the analytic leading-term elasticity -2/ln10 = -0.8686. The ' +
    'measured -0.911 exceeds this by ~5 percent from the slowly-growing L = log T0 ' +
    'factor. The knee elasticity (~-0.9115) equals the crossover elasticity ' +
    '(~-0.9113) to three figures, so the knee-minus-crossover gap (~0.01482 log10, ' +
    'the imp-96388 landmark) is PRESERVED across the whole perturbation band (range ' +
    '0.01471..0.01483) even though the landmarks absolute height moves by ~0.63 per ' +
    'E_trunc doubling. At 2x E_trunc the crossover falls below the [1e9,1e12] knee ' +
    'grid and the tenth-decade knee is no longer resolved on that fixed window.',
  verificationStatus:
    'Measurement/sensitivity classification (frontier-direction diagnostic), not a ' +
    'rigorous derivation. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, not a rigorous asymptotic; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; C_H isRigorousUpperBound stays false (imp-2642/imp-2701); changes ' +
    'no bound; establishes no operator positivity; RH open; NO QED; no refereed bound is changed' +
    '.',
});

export const IMP96474_ETRUNC_PINNED_LANDMARK_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96474',
  proofSection: 'S-frontier',
  glosses: 'imp-96451',
  question:
    'imp-96451 measured how far the imp-96427/imp-96351 tenth-decade sigma-knee and ' +
    'sigma = 1/2 crossover move when the rigorous truncation floor E_trunc is ' +
    'perturbed. How should a reader summarize which term of the component model ' +
    'actually pins those landmarks?',
  headword: ETRUNC_PINNED_LANDMARK_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-96451 ' +
    'verdict: the tenth-decade knee and sigma = 1/2 crossover move with elasticity ' +
    'd(log10 N*)/d(log E_trunc) ~ -0.911 (close to the analytic -2/ln10 = -0.8686) ' +
    'under a 0.5x..2x perturbation of the rigorous truncation floor E_trunc, ~10^10x ' +
    'larger than the ~1.2e-13 imp-96427 solver-path noise on the same landmarks -- so ' +
    'the rigorous floor, not the GUE-conditional E_coll, pins the landmark location ' +
    'to leading order, while the knee-minus-crossover gap stays E_trunc-invariant. ' +
    'Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96451 (the E_trunc sensitivity measurement this glosses, elasticity ' +
    '~-0.911, gap-preservation ~0.0148 log10); imp-96427 (the solver-path residual, ' +
    '~1.2e-13, this landmark is NOT primarily due to); imp-96351 (baseline knee at ' +
    'log10 N* ~ 9.529); imp-96388 (knee ~0.015 log10 above the crossover); imp-486 ' +
    '(C_mb GUE-conditional, untouched); imp-2631/imp-3406 (E_trunc = 3.06e-5 ' +
    'fixed-strip route).',
});

export default IMP96474_ETRUNC_PINNED_LANDMARK_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96474_ETRUNC_PINNED_LANDMARK_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96474-headword-names-etrunc-pinning',
    why: 'The headword must name the elasticity, the analytic leading term, and the ' +
      'scale contrast against the imp-96427 solver-path noise -- the entire point ' +
      'of the distinction.',
    holds: () => {
      const h = IMP96474_ETRUNC_PINNED_LANDMARK_GLOSSARY_HEADWORD.headword;
      return (
        /-0\.911/.test(h.definition) &&
        /-0\.8686/.test(h.mechanism) &&
        /1\.2e-13/.test(h.definition) &&
        /E_trunc/.test(h.term)
      );
    },
  },
  {
    id: 'imp96474-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96474_ETRUNC_PINNED_LANDMARK_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96474_ETRUNC_PINNED_LANDMARK_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96474_ETRUNC_PINNED_LANDMARK_GLOSSARY_HEADWORD.verdict) &&
      IMP96474_ETRUNC_PINNED_LANDMARK_GLOSSARY_HEADWORD.glosses === 'imp-96451',
  },
];

for (const assertion of IMP96474_ETRUNC_PINNED_LANDMARK_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96474-etrunc-pinned-landmark-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
