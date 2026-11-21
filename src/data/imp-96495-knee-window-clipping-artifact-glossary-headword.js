/**
 * @module imp-96495-knee-window-clipping-artifact-glossary-headword
 * @fileoverview imp-96495 -- import-light glossary/Concepts headword recording that
 *   the imp-96451 F4 "knee leaves the window past E_trunc ~ 5e-5" finding was a
 *   WINDOW-CLIPPING artefact of the fixed [1e9,1e12] log10-N grid, not a
 *   disappearance of the tenth-decade sigma-knee: imp-96464 re-ran the same
 *   estimators on a widened [1e7,1e13] grid, resolved the knee at every factor
 *   0.5x..2x, and located the precise exit factor.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96451 perturbed the N-independent truncation floor E_trunc over a
 *   0.5x..2x band and found the tenth-decade knee (D2 zero-crossing of the OLS
 *   local exponent) tracks the sigma = 1/2 crossover rigidly -- but at 2x
 *   (E_trunc = 6.12e-5) the D2 zero-crossing fell outside the fixed [1e9,1e12]
 *   grid, so kneeSignChanges came back 0 and F4 could only guess the knee
 *   "leaves the window past ~5e-5" without locating it. imp-96464 answered that
 *   by widening the grid to [1e7,1e13] so the knee resolves at every factor,
 *   including 2x. Quoting the F4 "knee disappears" language without the
 *   imp-96464 correction wrongly reads as a property of the sigma(N) model,
 *   when it was a property of the FIXED GRID used to measure it. This headword
 *   bakes both figures verbatim (no re-import of the imp-96451/imp-96464
 *   modules, to stay import-light) as a standalone quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   WINDOW-CLIPPING ARTEFACT (imp-96451 F4, corrected by imp-96464): on the
 *   fixed [1e9,1e12] grid, raising E_trunc to 2x (6.12e-5) pushes the D2
 *   zero-crossing knee below the grid's low edge, returning kneeSignChanges 0
 *   -- read naively as "the knee vanishes past E_trunc ~ 5e-5". Re-running the
 *   IDENTICAL estimators on a widened [1e7,1e13] grid resolves the knee at all
 *   seven factors including 2x (knee at log10 N* ~ 8.896), and the widened-grid
 *   knee elasticity d(log10 N*)/d(log E_trunc) ~ -0.9115 still equals the
 *   crossover elasticity ~ -0.9113 to three figures, matching the on-window
 *   imp-96451 value exactly. Bisecting the E_trunc multiplier for the knee to
 *   sit at the original low edge (log10 N = 9) gives f* ~ 1.7847, i.e.
 *   E_trunc ~ 5.461e-5 -- a precise value for the imp-96451 "~5e-5" estimate.
 *   The exit is one-sided: even at 0.1x (E_trunc = 3.06e-6) the knee sits at
 *   log10 N ~ 11.61, never reaching the [1e9,1e12] high edge.
 *
 *   STATUS: a naming/classification headword restating the imp-96464
 *   measurement, not a fresh derivation.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96464 verdict for quick
 *   reference. It establishes nothing, instantiates no interval, closes no
 *   sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96464-sigma-knee-widened-grid-window-exit (source: the widened-grid re-measurement this glosses)
 * @see imp-96451-sigma-knee-etrunc-sensitivity (source: the F4 fixed-window non-resolution this corrects)
 * @see imp-96351-sigma-knee-tenthdecade-1e12-stability (baseline knee at log10 N* ~ 9.529)
 * @see imp-96388-sigma-peak-vs-knee-cross-tabulation (knee sits ~0.015 log10 above the crossover)
 *
 * Ticket: imp-96495 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The window-clipping-artefact headword, baked verbatim
// (no re-import of the imp-96451/imp-96464 modules).
const KNEE_WINDOW_CLIPPING_ARTIFACT_HEADWORD = Object.freeze({
  key: 'knee-window-clipping-artifact',
  term:
    'The imp-96451 F4 "tenth-decade sigma-knee leaves the window past E_trunc ~ 5e-5" ' +
    'finding, corrected by imp-96464 as a fixed-grid WINDOW-CLIPPING artefact rather ' +
    'than a disappearance of the knee',
  definition:
    'A WINDOW-CLIPPING artefact: on the fixed [1e9,1e12] log10-N grid used by ' +
    'imp-96351/imp-96427/imp-96451, raising the N-independent truncation floor ' +
    'E_trunc to 2x its anchor (6.12e-5) ' +
    'pushes the D2 zero-crossing knee below the grid low edge, so the knee finder ' +
    'returns kneeSignChanges 0 -- read naively as the knee vanishing past ' +
    'E_trunc ~ 5e-5. imp-96464 re-ran the IDENTICAL estimators on a widened ' +
    '[1e7,1e13] grid and resolved the knee at all seven factors 0.5x..2x, ' +
    'including 2x (knee at log10 N* ~ 8.896, just below the original low edge) -- ' +
    'so the knee never disappeared, only the fixed grid stopped seeing it.',
  mechanism:
    'The widened-grid knee elasticity d(log10 N*)/d(log E_trunc) ~ -0.9115 equals ' +
    'the crossover elasticity ~ -0.9113 to three figures, matching the on-window ' +
    'imp-96451 elasticity exactly, so the imp-96451 F3 rigidity (knee tracks ' +
    'crossover) survives once the window no longer clips the knee. Bisecting the ' +
    'E_trunc multiplier for the widened-grid knee to sit at the original low edge ' +
    '(log10 N = 9) gives f* ~ 1.7847, i.e. E_trunc ~ 5.461e-5 -- a precise value ' +
    'for the imp-96451 F4 "~5e-5" estimate. The exit is one-sided: even at 0.1x ' +
    '(E_trunc = 3.06e-6) the knee sits at log10 N ~ 11.61, never reaching the ' +
    '[1e9,1e12] high edge, so only the low edge is ever crossed.',
  verificationStatus:
    'Measurement classification (window-resolution diagnostic), not a rigorous ' +
    'derivation. Changes no bound; the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_H ' +
    'isRigorousUpperBound remains false (imp-2642/imp-2701); no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96495_KNEE_WINDOW_CLIPPING_ARTIFACT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96495',
  proofSection: 'S-frontier',
  glosses: 'imp-96464',
  question:
    'imp-96464 re-measured the imp-96451 tenth-decade sigma-knee on a widened ' +
    '[1e7,1e13] grid because the fixed [1e9,1e12] grid failed to resolve it past ' +
    'E_trunc ~ 5e-5. How should a reader name that failure mode, and what is the ' +
    'precise exit factor once the window no longer clips the knee?',
  headword: KNEE_WINDOW_CLIPPING_ARTIFACT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-96451 F4 ' +
    '"knee leaves the window past E_trunc ~ 5e-5" finding as a WINDOW-CLIPPING ' +
    'artefact of the fixed [1e9,1e12] grid: imp-96464 resolved the knee at every ' +
    'factor 0.5x..2x on a widened [1e7,1e13] grid (2x knee at log10 N* ~ 8.896), ' +
    'confirmed the elasticity match to the crossover survives off-window ' +
    '(~-0.9115 vs ~-0.9113), and located the precise low-edge exit at ' +
    'f* ~ 1.7847 (E_trunc ~ 5.461e-5). Establishes nothing; instantiates no ' +
    'interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96464 (the widened-grid re-measurement this glosses, f* ~ 1.7847, ' +
    'E_trunc ~ 5.461e-5); imp-96451 (the fixed-window F4 finding this corrects, ' +
    'kneeSignChanges 0 at 2x); imp-96351 (baseline knee at log10 N* ~ 9.529); ' +
    'imp-96388 (knee ~0.015 log10 above the crossover).',
});

export default IMP96495_KNEE_WINDOW_CLIPPING_ARTIFACT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96495_KNEE_WINDOW_CLIPPING_ARTIFACT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96495-headword-names-artifact-and-exit-factor',
    why: 'The headword must name the window-clipping artefact, the widened-grid ' +
      'resolution, and the precise exit factor -- the entire point of the entry.',
    holds: () => {
      const h = IMP96495_KNEE_WINDOW_CLIPPING_ARTIFACT_GLOSSARY_HEADWORD.headword;
      return (
        /WINDOW-CLIPPING/.test(h.definition) &&
        /kneeSignChanges 0/.test(h.definition) &&
        /1\.7847/.test(h.mechanism) &&
        /5\.461e-5/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96495-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96495_KNEE_WINDOW_CLIPPING_ARTIFACT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96495_KNEE_WINDOW_CLIPPING_ARTIFACT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96495_KNEE_WINDOW_CLIPPING_ARTIFACT_GLOSSARY_HEADWORD.verdict) &&
      IMP96495_KNEE_WINDOW_CLIPPING_ARTIFACT_GLOSSARY_HEADWORD.glosses === 'imp-96464',
  },
];

for (const assertion of IMP96495_KNEE_WINDOW_CLIPPING_ARTIFACT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96495-knee-window-clipping-artifact-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
