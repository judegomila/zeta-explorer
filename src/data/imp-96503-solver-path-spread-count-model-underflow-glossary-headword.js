/**
 * @module imp-96503-solver-path-spread-count-model-underflow-glossary-headword
 * @fileoverview imp-96503 -- import-light glossary/Concepts headword capturing the
 *   imp-96449 F2 nuance: the naive claim "solver-path gamma_N spread stays below the
 *   ~1/N count-model shift EVERYWHERE" is FALSE past N ~ 1e15, but benignly -- past
 *   that height the count-model shift itself has underflowed below one ULP of
 *   gamma_N, so neither term can move a double-precision gamma_N.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96449 extended the imp-96427 knee-only Newton-vs-Lambert-W solver-path
 *   comparison to the full N = 1e2 .. 1e22 range and found two things worth keeping
 *   straight for a reader skimming a "solver spread vs count-model shift" claim:
 *   the comparison only makes sense while BOTH quantities are above the machine
 *   floor, and past N ~ 1e15 that stops being true. Quoting "the naive containment
 *   claim is false past N ~ 1e15" without the "benignly" qualifier reads as a real
 *   divergence; this headword bakes the imp-96449 F1/F2 figures verbatim (no
 *   re-import of the imp-96449 module, to stay import-light) as a standalone
 *   quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   FALSE-BUT-BENIGN CROSSING (imp-96449 F2): the solver-path gamma_N spread
 *   (Newton vs closed-form Lambert-W, both inverting the IDENTICAL RvM main-term
 *   count) stays pinned at floating-point noise (~1e-16 to ~3.5e-15, a few ULP,
 *   imp-96449 F1) across all N = 1e2 .. 1e22, while the ~1/N count-model reference
 *   shift ((7/8)(dgamma/dN)/gamma) decays from ~6.3e-3 at N = 1e2 to ~8.6e-23 at
 *   N = 1e22. Their ratio crosses 1 at N ~ 1e15, so "solver spread below the
 *   count-model shift everywhere" is literally FALSE past that height -- but the
 *   crossing is benign: the count-model shift has ITSELF shrunk below one ULP of
 *   gamma_N by then, so neither the solver residual nor the count-model shift can
 *   move a double-precision gamma_N. T-space solvers (both Newton and Lambert-W
 *   operate in T-space, not in the underflowing log(gamma)/N variable) are immune
 *   to the far-tail log(gamma)/N underflow that might otherwise be hypothesised to
 *   split the two paths.
 *
 *   STATUS: a naming/classification headword restating the imp-96449 F1/F2
 *   measurement, not a fresh derivation.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96449 verdict for quick reference.
 *   It establishes nothing, instantiates no interval, closes no sub-gap, moves no
 *   bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96449-solver-path-spread-full-range (source: F1/F2 this glosses)
 * @see imp-96427-knee-crossover-solver-path-spread (knee-only precursor comparison)
 * @see imp-96363-ecoll-independent-second-anchor (Lambert-W closed form)
 *
 * Ticket: imp-96503 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The false-but-benign crossing headword, baked verbatim (no re-import of the
// imp-96449 module, to stay import-light).
const FALSE_BUT_BENIGN_CROSSING_HEADWORD = Object.freeze({
  key: 'false-but-benign-solver-spread-count-model-crossing',
  term:
    'The imp-96449 finding that "solver-path gamma_N spread stays below the ~1/N ' +
    'count-model shift everywhere" is FALSE past N ~ 1e15, but benignly: both ' +
    'quantities have underflowed below one ULP of gamma_N by then',
  definition:
    'The inter-method (Newton vs closed-form Lambert-W) gamma_N spread, both paths ' +
    'inverting the IDENTICAL Riemann-von Mangoldt main-term count, stays pinned at ' +
    'floating-point noise (~1.2e-16 at N = 1e2 to a peak ~3.5e-15 at N = 1e19, at ' +
    'most a few ULP, no growth trend -- imp-96449 F1) across the full tested range ' +
    'N = 1e2 .. 1e22. The ~1/N count-model reference shift, (7/8)(dgamma/dN)/gamma, ' +
    'decays from ~6.3e-3 at N = 1e2 to ~8.6e-23 at N = 1e22. The ratio of the two ' +
    'crosses 1 at N ~ 1e15 (ratio ~0.71 at N = 1e15, ~13.6 at N = 1e16), so the ' +
    'naive "solver spread below count-model shift everywhere" claim is literally ' +
    'FALSE past N ~ 1e15 (imp-96449 F2).',
  mechanism:
    'The crossing is benign rather than a real divergence: past N ~ 1e15 the ' +
    'count-model shift has itself shrunk below one ULP of a double-precision ' +
    'gamma_N, so BOTH the solver-path residual and the count-model shift are ' +
    'numerically negligible there -- neither term can actually move a stored ' +
    'gamma_N regardless of which is nominally larger. The far-tail underflow of ' +
    'log(gamma)/N (down to ~4.9e-21 at N = 1e22) does NOT drive the two solvers ' +
    'apart either, because both effectiveHeightForN (Newton) and gammaLambertMain ' +
    '(Lambert-W) operate in T-space, not in the underflowing log(gamma)/N ' +
    'variable -- T-space solvers are immune to that particular underflow.',
  verificationStatus:
    'Measurement classification (accuracy audit), not a rigorous derivation. ' +
    'Changes no bound; the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; C_H isRigorousUpperBound remains false (imp-2642/imp-2701); no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96503_FALSE_BUT_BENIGN_CROSSING_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96503',
  proofSection: 'S-frontier',
  glosses: 'imp-96449',
  question:
    'imp-96449 F2 found the naive "solver-path gamma_N spread stays below the ~1/N ' +
    'count-model shift everywhere" claim is FALSE past N ~ 1e15. How should a ' +
    'reader tell a real divergence apart from this benign underflow crossing?',
  headword: FALSE_BUT_BENIGN_CROSSING_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-96449 F2 ' +
    'false-but-benign crossing at N ~ 1e15: past that height the ~1/N count-model ' +
    'shift has underflowed below one ULP of gamma_N, so its nominal excess over the ' +
    'floating-point solver-path noise floor (imp-96449 F1) is numerically moot, not ' +
    'a real divergence. Establishes nothing; instantiates no interval; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96449 (F1/F2 this glosses: solver-path spread ~1e-16..3.5e-15 machine ' +
    'floor across N = 1e2..1e22, count-model shift crossing at N ~ 1e15); ' +
    'imp-96427 (knee-only precursor solver-path spread ~1.2e-13 log10); imp-96363 ' +
    '(Lambert-W closed form); imp-486 (C_mb GUE-conditional).',
});

export default IMP96503_FALSE_BUT_BENIGN_CROSSING_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96503_FALSE_BUT_BENIGN_CROSSING_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96503-headword-names-crossing-and-benign-reason',
    why: 'The headword must name the false-past-1e15 crossing and the benign ' +
      'underflow reason -- the entire point of the distinction.',
    holds: () => {
      const h = IMP96503_FALSE_BUT_BENIGN_CROSSING_GLOSSARY_HEADWORD.headword;
      return (
        /FALSE past N ~ 1e15/.test(h.definition) &&
        /below one ULP/.test(h.mechanism) &&
        /1e15/.test(h.definition) &&
        /T-space/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96503-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96503_FALSE_BUT_BENIGN_CROSSING_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96503_FALSE_BUT_BENIGN_CROSSING_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96503_FALSE_BUT_BENIGN_CROSSING_GLOSSARY_HEADWORD.verdict) &&
      IMP96503_FALSE_BUT_BENIGN_CROSSING_GLOSSARY_HEADWORD.glosses === 'imp-96449',
  },
];

for (const assertion of IMP96503_FALSE_BUT_BENIGN_CROSSING_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96503-solver-path-spread-count-model-underflow-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
