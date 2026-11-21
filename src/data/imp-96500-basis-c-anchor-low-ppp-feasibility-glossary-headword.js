/**
 * @module imp-96500-basis-c-anchor-low-ppp-feasibility-glossary-headword
 * @fileoverview imp-96500 -- import-light glossary/Concepts headword recording that the
 *   imp-96448 DIRECT basis-C double-integral evaluation at the PT anchor L = 5.9e6 is
 *   feasible at LOW panels-per-period (ppp ~ 3, ~2.2 s), not the astronomical high-ppp
 *   panel budget imp-96369/imp-96430 flagged as a wall, and that the measured achievable
 *   floor (~2.84e-5) sits far above the imp-96430 L-linear model floor (~4.96e-8), leaving
 *   ~640x corroboration headroom rather than the model-quoted ~3.7e5x.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   Two prior modules quote two different "the direct anchor evaluation is infeasible /
 *   feasible" verdicts that are each correct for a DIFFERENT ppp regime, and conflating
 *   them misleads a reader skimming for "is the anchor integral computable": imp-96369
 *   declared the anchor's converged (high-ppp) panel count astronomical (~1.1e10 Simpson
 *   evaluations at ppp = 640, ~8 minutes), while imp-96448 shows the achievable-floor
 *   optimum sits at ppp = 3 (~5.3e7 evaluations, ~2.2 s) because the anchor error is
 *   U-SHAPED in ppp -- raising ppp does not sharpen the answer, it grows catastrophic
 *   cancellation roundoff in Var = L - 2*Int faster than Simpson truncation falls. This
 *   headword bakes the ppp/timing/floor numbers verbatim (no re-import of the imp-96448
 *   module) as a standalone quick-lookup entry so "feasible" and "astronomical" can both
 *   be read as true statements about different ppp targets, not a contradiction.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The imp-96430 L-linear MODEL floor at the PT anchor (~4.96e-8, claimed ~3.7e5x
 *   headroom) was never checked against a direct evaluation because the converged
 *   HIGH-ppp panel count (ppp = 640, ~1.1e10 Simpson evaluations, imp-96369) looked
 *   astronomical. imp-96448 runs the direct integral anyway, at the cheap LOW-ppp
 *   optimum (ppp = 3, ~5.3e7 evaluations, ~2.2 s) that the anchor error curve actually
 *   favors, and measures a true achievable floor of ~2.84e-5 -- ~573x ABOVE the model
 *   floor -- because the model's small-L extrapolation assumed high-ppp truncation-free
 *   conditions that do not hold at the anchor. The exact rigidity signal |rho + 1/2| ~
 *   1.82e-2 still clears the measured floor by ~642x, so corroboration of basis A by
 *   basis C survives at the anchor, just with ~570x less headroom (~640x, not ~3.7e5x)
 *   than the model claimed.
 *
 *   STATUS: a naming/classification headword restating the imp-96448 measurement, not a
 *   fresh derivation.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96448 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   rho is the theoretical GUE (sine-kernel) two-interval correlation, not a
 *   computation over real Riemann zeros. NO QED. No refereed bound is changed.
 *
 * @see imp-96448-direct-basis-c-anchor-floor (source: the low-ppp feasibility + floor measurement this glosses)
 * @see imp-96430-basis-c-corroboration-reach-crossover (source: the L-linear model floor this compares against)
 * @see imp-96369-direct-double-integral-pt-anchor-feasibility (source: the high-ppp panel count flagged astronomical)
 *
 * Ticket: imp-96500 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The basis-C anchor low-ppp-feasibility headword, baked verbatim
// (no re-import of the imp-96448/imp-96430/imp-96369 modules).
const BASIS_C_ANCHOR_LOW_PPP_FEASIBILITY_HEADWORD = Object.freeze({
  key: 'basis-c-anchor-low-ppp-feasibility',
  term:
    'Direct basis-C evaluation at the PT anchor is feasible at LOW panels-per-period ' +
    '(imp-96448, ppp ~ 3, ~2.2 s), not the astronomical HIGH-ppp panel budget imp-96369/' +
    'imp-96430 flagged (ppp = 640, ~1.1e10 Simpson evaluations)',
  definition:
    'The direct basis-C double integral at the PT anchor L = 5.9e6 has a U-SHAPED error ' +
    'curve in ppp (panels per period): the minimum achievable error sits at ppp = 3 ' +
    '(~5.3e7 Simpson evaluations, ~2.2 s of wall time), and error GROWS monotonically ' +
    'past that minimum (ppp = 8 -> 3.0e-4, ppp = 256 -> 2.0e-2) because catastrophic ' +
    'cancellation roundoff in Var = L - 2*Int (subtracting two ~5.9e6-scale numbers to ' +
    'leave ~1.93) accumulates with panel count faster than Simpson truncation error ' +
    'falls. imp-96369 had flagged the anchor as computationally astronomical because it ' +
    'assumed the anchor needs the same HIGH ppp (~640, ~1.1e10 total Simpson ' +
    'evaluations, ~8 minutes) that the small accessible-L rungs need to converge. imp-' +
    '96448 shows that assumption is the wrong target: the achievable floor is reached ' +
    'cheaply at LOW ppp instead.',
  mechanism:
    'At the anchor, the measured best-achievable floor at ppp = 3 is ~2.84e-5 (direct ' +
    'rho = -0.481793 vs exact rho = -0.481765) -- ~573x ABOVE the imp-96430 L-linear ' +
    'model floor of ~4.96e-8. The model extrapolated a cancellation floor proportional ' +
    'to L from small-L rungs whose floor was reached at HIGH ppp with negligible ' +
    'truncation; that extrapolation does not hold at the anchor, where the optimal ppp ' +
    'collapses to ~3 and the achievable error is set by ppp = 3 Simpson TRUNCATION, not ' +
    'the cancellation floor the model assumed. The exact rigidity signal ' +
    '|rho + 1/2| ~ 1.82e-2 still beats the measured floor by ~642x, so direct basis-C ' +
    'evaluation DOES corroborate basis A at the anchor -- confirming the imp-96430 ' +
    'qualitative verdict -- but with ~570x less headroom than the model claimed (~640x ' +
    'measured, not the model-quoted ~3.7e5x).',
  verificationStatus:
    'Feasibility / cross-validation numerics (accuracy audit), not a rigorous ' +
    'derivation. rho is the theoretical GUE two-interval correlation, not a real-zero ' +
    'computation. Changes no bound; RH open; no refereed bound is changed; NO QED.',
});

export const IMP96500_BASIS_C_ANCHOR_LOW_PPP_FEASIBILITY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96500',
  proofSection: 'S-frontier',
  glosses: 'imp-96448',
  question:
    'imp-96369 flagged the direct basis-C double integral at the PT anchor L = 5.9e6 as ' +
    'computationally astronomical (~1.1e10 Simpson evaluations at converged ppp = 640). ' +
    'imp-96448 evaluates it anyway and calls it feasible. How should a reader reconcile ' +
    '"astronomical" and "feasible" -- are they contradictory verdicts about the same ' +
    'computation?',
  headword: BASIS_C_ANCHOR_LOW_PPP_FEASIBILITY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names why "astronomical" ' +
    '(imp-96369/imp-96430, HIGH ppp = 640, ~1.1e10 evaluations) and "feasible" (imp-' +
    '96448, LOW ppp = 3, ~5.3e7 evaluations, ~2.2 s) are both true statements about ' +
    'DIFFERENT ppp targets, not a contradiction: the anchor error is U-shaped in ppp, so ' +
    'the achievable floor is reached cheaply at low ppp while high ppp only adds ' +
    'cancellation roundoff. Records the measured floor ~2.84e-5 (~573x above the imp-' +
    '96430 model floor ~4.96e-8) and the surviving corroboration headroom ~640x (not ' +
    'the model-quoted ~3.7e5x). Establishes nothing; instantiates no interval; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96448 (the low-ppp feasibility + floor measurement this glosses, ppp = 3, ' +
    'floor ~2.84e-5, headroom ~642x); imp-96430 (the L-linear model floor ~4.96e-8 this ' +
    'compares against, claimed headroom ~3.7e5x); imp-96369 (the high-ppp panel count ' +
    'flagged astronomical, ppp = 640, ~1.1e10 evaluations); imp-96389 (basis-C is the ' +
    'binding floor among the three-basis cross-validation).',
});

export default IMP96500_BASIS_C_ANCHOR_LOW_PPP_FEASIBILITY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96500_BASIS_C_ANCHOR_LOW_PPP_FEASIBILITY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96500-headword-names-both-ppp-regimes',
    why: 'The headword must name both the low-ppp feasible regime and the high-ppp ' +
      'astronomical regime, and the measured floor/headroom figures -- the entire ' +
      'point of the reconciliation.',
    holds: () => {
      const h = IMP96500_BASIS_C_ANCHOR_LOW_PPP_FEASIBILITY_GLOSSARY_HEADWORD.headword;
      return (
        /ppp = 3/.test(h.definition) &&
        /ppp = 640|ppp \(~640/.test(h.definition + h.term) &&
        /2\.84e-5/.test(h.mechanism) &&
        /573x/.test(h.mechanism) &&
        /642x/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96500-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96500_BASIS_C_ANCHOR_LOW_PPP_FEASIBILITY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96500_BASIS_C_ANCHOR_LOW_PPP_FEASIBILITY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96500_BASIS_C_ANCHOR_LOW_PPP_FEASIBILITY_GLOSSARY_HEADWORD.verdict) &&
      IMP96500_BASIS_C_ANCHOR_LOW_PPP_FEASIBILITY_GLOSSARY_HEADWORD.glosses === 'imp-96448',
  },
];

for (const assertion of IMP96500_BASIS_C_ANCHOR_LOW_PPP_FEASIBILITY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96500-basis-c-anchor-low-ppp-feasibility-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
