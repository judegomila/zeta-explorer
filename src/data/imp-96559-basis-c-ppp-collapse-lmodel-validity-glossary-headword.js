/**
 * @module imp-96559-basis-c-ppp-collapse-lmodel-validity-glossary-headword
 * @fileoverview imp-96559 -- import-light glossary/Concepts headword for the imp-96486
 *   result: the imp-96430 basis-C L-linear cancellation floor model floorModel(L) =
 *   8.4e-15 * L is valid only on the L <= ~1e5 branch (optimal panels-per-period
 *   ppp* >= 32), because past that the optimal ppp COLLAPSES toward 3 and the
 *   achievable floor is set by ppp-truncation, not cancellation -- so at the PT anchor
 *   L = 5.9e6 the model UNDERSTATES the real floor by ~573x (2.84e-5 vs 4.96e-8).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96486 swept ppp across nine L rungs (960 .. 5.9e6) and located the exact
 *   transition, but the module has no standalone quick-lookup entry stating the
 *   headline validity boundary for a reader who only wants "when does the L-linear
 *   model stop applying." This headword bakes that verbatim (no re-import of the
 *   imp-96486/imp-96430/imp-96448 modules, to stay import-light) as a standalone
 *   lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The imp-96430 L-linear cancellation model floorModel(L) = 8.4e-15 * L tracks the
 *   measured direct basis-C floor to within ~2-4x only while the optimal ppp stays
 *   >= 32, i.e. up to L ~ 1e5. Past that, ppp* falls through 16 (onset at L ~ 3e5) and
 *   collapses to 3 at the PT anchor L = 5.9e6; the floor is then set by residual
 *   Simpson truncation at low ppp, not by cancellation roundoff, and departs the model
 *   by 13.5x (3e5) -> 50x (1e6) -> 133x (3e6) -> 573x (anchor). At the anchor the real
 *   achievable floor is ~2.84e-5, not the model's ~4.96e-8.
 *
 *   MECHANISM: raising ppp trades two competing errors -- catastrophic-cancellation
 *   roundoff in Var = L - 2*Int (grows with panel count) against Simpson truncation
 *   error (falls with panel count). At small L the cancellation term dominates so
 *   higher ppp always helps (up to the high-ppp line); at large L the truncation term
 *   dominates at any affordable ppp, so the optimum falls to the smallest usable ppp
 *   (3). The optimal-ppp collapse and the model's validity boundary are the same event.
 *
 *   STATUS: a mapped transition between two double-precision quadrature regimes.
 *   Establishes nothing about the underlying operator or the zeros.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96486 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96486-basis-c-ppp-collapse-transition (source: maps the ppp collapse and the
 *   L-linear model's validity boundary this glosses)
 * @see imp-96430-basis-c-corroboration-reach-crossover (the L-linear floor MODEL itself)
 * @see imp-96448-direct-basis-c-anchor-floor (measured the anchor floor ~2.84e-5 at
 *   ppp ~ 3 that imp-96486 later localized as the truncation-regime endpoint)
 *
 * Ticket: imp-96559 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The ppp-collapse / L-linear-model-validity headword, baked verbatim (no re-import).
const BASIS_C_PPP_COLLAPSE_LMODEL_VALIDITY_HEADWORD = Object.freeze({
  key: 'basis-c-lmodel-valid-only-below-ppp-collapse',
  term:
    'imp-96486 verdict: the imp-96430 basis-C L-linear cancellation floor model is valid ' +
    'only on the L <= ~1e5 branch, before the optimal ppp collapses toward truncation',
  definition:
    'The imp-96430 L-linear cancellation model floorModel(L) = 8.4e-15 * L tracks the ' +
    'measured direct basis-C floor to within ~2-4x only while the optimal panels-per-' +
    'period ppp* >= 32 (L <= ~1e5). Past that boundary ppp* falls through 16 (onset at ' +
    'L ~ 3e5) and collapses to 3 at the PT anchor L = 5.9e6; the floor is then set by ' +
    'residual Simpson truncation, not cancellation, departing the model by 13.5x (3e5), ' +
    '50x (1e6), 133x (3e6), and 573x at the anchor (real floor ~2.84e-5 vs model ~4.96e-8).',
  mechanism:
    'Raising ppp trades catastrophic-cancellation roundoff in Var = L - 2*Int (which ' +
    'grows with panel count) against Simpson truncation error (which falls with panel ' +
    'count). At small L cancellation dominates, so the optimum sits on the high-ppp ' +
    'line (640 at L=960); at large L truncation dominates at any affordable ppp, so the ' +
    'optimum collapses to the smallest usable ppp (3). The optimal-ppp collapse IS the ' +
    'model-validity boundary -- they are the same event, not two separate facts.',
  verificationStatus:
    'Mapped double-precision quadrature-regime transition (imp-96486), reproduced live ' +
    'at two mid rungs (L=1e5, 1e6) at import. Confirms and localizes the imp-96448 ' +
    'anchor-floor verdict. Changes no bound; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96559_BASIS_C_PPP_COLLAPSE_LMODEL_VALIDITY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96559',
  proofSection: 'S-frontier',
  glosses: 'imp-96486',
  question:
    'imp-96486 mapped where the direct basis-C floor departs the imp-96430 L-linear ' +
    'cancellation model. What is the validity boundary, in one lookup line, and why does ' +
    'crossing it matter at the PT anchor?',
  headword: BASIS_C_PPP_COLLAPSE_LMODEL_VALIDITY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96486 ' +
    'verdict: the imp-96430 L-linear cancellation model floorModel(L) = 8.4e-15 * L is ' +
    'valid only while the optimal ppp stays >= 32 (L <= ~1e5); past that the optimal ppp ' +
    'collapses toward 3 and the floor is truncation-set, departing the model by up to ' +
    '573x at the PT anchor L = 5.9e6 (real floor ~2.84e-5 vs model ~4.96e-8). ' +
    'Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96486 (the ppp-collapse map and the model-validity boundary this glosses); ' +
    'imp-96430 (the L-linear floor model itself); imp-96448 (the anchor floor ~2.84e-5 ' +
    'this transition explains).',
});

export default IMP96559_BASIS_C_PPP_COLLAPSE_LMODEL_VALIDITY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96559_BASIS_C_PPP_COLLAPSE_LMODEL_VALIDITY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96559-headword-has-required-fields',
    why: 'The headword must name the validity boundary (ppp* >= 32, L <= ~1e5) and the ' +
      'anchor departure factor (573x) -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96559_BASIS_C_PPP_COLLAPSE_LMODEL_VALIDITY_GLOSSARY_HEADWORD.headword;
      return (
        /ppp\* >= 32/.test(h.definition) &&
        /L <= ~1e5/.test(h.definition) &&
        /573x/.test(h.definition) &&
        /2\.84e-5/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96559-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96559_BASIS_C_PPP_COLLAPSE_LMODEL_VALIDITY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96559_BASIS_C_PPP_COLLAPSE_LMODEL_VALIDITY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96559_BASIS_C_PPP_COLLAPSE_LMODEL_VALIDITY_GLOSSARY_HEADWORD.verdict) &&
      IMP96559_BASIS_C_PPP_COLLAPSE_LMODEL_VALIDITY_GLOSSARY_HEADWORD.glosses === 'imp-96486',
  },
];

for (const assertion of IMP96559_BASIS_C_PPP_COLLAPSE_LMODEL_VALIDITY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96559-basis-c-ppp-collapse-lmodel-validity-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
