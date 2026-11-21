/**
 * @module imp-96481-knee-crossover-offset-window-artifact-glossary-headword
 * @fileoverview imp-96481 -- import-light glossary/Concepts headword for the imp-96431
 *   correction to the imp-96405 M4 offset band: the [+0.0068, +0.0088] reading (sigma
 *   inflection minus E_coll = E_trunc crossover, tested over 1.32 decades) is a
 *   NARROW-WINDOW artifact, not a global constant -- over ~5.24 decades the true offset
 *   drifts MONOTONICALLY from ~+0.0124 down to ~+0.0044 (slope ~-0.00143/decade) while
 *   sigma at the inflection stays pinned near 1/2 throughout.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96405 M4 tested the C_C/E_trunc rescale knob over only 1.32 decades of crossover
 *   and reported a "near-constant" offset band, taken as evidence the sigma-inflection
 *   tracks the crossover rigidly enough to rule out coincidence. imp-96431 pushed the
 *   identical knob across ~5.24 decades in both directions and found the band does NOT
 *   hold -- it is ~4x wider once the tested window is exceeded. A reader citing the
 *   [+0.0068, +0.0088] figure without this correction would overstate how constant the
 *   offset is. This headword bakes both the original band and the corrected wide-range
 *   drift verbatim (no re-import of the imp-96405/imp-96431 modules, to stay
 *   import-light) as a standalone quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   imp-96405 M4 band (1.32 decades tested, crossover log10 8.88 -> 10.21): offset in
 *   [+0.0068, +0.0088], sigma at inflection in [0.4976, 0.4981].
 *   imp-96431 correction (5.24 decades tested, crossover log10 ~7.41 -> ~12.65): the
 *   offset exits that band and ranges +0.0124 (small-N end) down to +0.0044 (large-N
 *   end) -- a band ~4x wider than reported. But the drift is STRICTLY MONOTONE (16/16
 *   successive steps decreasing) and near-linear in the crossover log10 (slope
 *   ~-0.00143/decade, R^2 ~0.96), and sigma at the inflection stays pinned in
 *   [0.4967, 0.4988] (within ~0.0034 of 1/2) across the whole range.
 *   A random coincidence would produce a random walk in the offset, not a smooth
 *   monotone-in-scale drift -- so the corrected wide-range picture SHARPENS the
 *   imp-96405 FORCED verdict rather than weakening it (the drift is the computable
 *   slowly-varying L(N) sub-leading correction flagged in imp-96405 M3).
 *
 *   STATUS: a naming/classification headword restating the imp-96431 correction of the
 *   imp-96405 band, not a fresh derivation of either.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96431 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96431-knee-crossover-tracking-wide-range (source: the wide-range correction this glosses)
 * @see imp-96405-knee-crossover-forced-vs-coincidental (source: the M4 narrow-window band being corrected)
 * @see imp-96388-sigma-peak-vs-knee-cross-tabulation (knee ~0.013-0.015 log10 above the crossover)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover N_cross ~ 3.28e9)
 *
 * Ticket: imp-96481 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The knee/crossover offset window-artifact headword, baked verbatim
// (no re-import of the imp-96405/imp-96431 modules).
const KNEE_CROSSOVER_OFFSET_WINDOW_ARTIFACT_HEADWORD = Object.freeze({
  key: 'knee-crossover-offset-window-artifact',
  term:
    'The imp-96405 M4 sigma-inflection-minus-crossover offset band [+0.0068, +0.0088] is a ' +
    '1.32-decade-window artifact (imp-96431): over ~5.24 decades the true offset drifts ' +
    'monotonically from ~+0.0124 to ~+0.0044 while sigma at the inflection stays pinned near 1/2',
  definition:
    'imp-96405 M4 dragged the E_coll = E_trunc crossover across 1.32 decades (log10 8.88 -> ' +
    '10.21) via a C_C/E_trunc rescale and reported the sigma-curvature-inflection-minus-crossover ' +
    'offset banded in [+0.0068, +0.0088] (sigma at inflection in [0.4976, 0.4981]), read as rigid ' +
    'tracking. imp-96431 pushed the identical rescale across ~5.24 decades (log10 ~7.41 -> ' +
    '~12.65) in both directions and found the offset exits that band: it ranges +0.0124 at the ' +
    'small-N end down to +0.0044 at the large-N end, a band ~4x wider than the tested-window ' +
    'reading. The [+0.0068, +0.0088] figure was NOT a global constant -- only a narrow-window ' +
    'snapshot of a slowly drifting quantity.',
  mechanism:
    'The wide-range offset drift is STRICTLY MONOTONE decreasing (16/16 successive steps as the ' +
    'crossover moves to larger N) and near-linear in the crossover log10 (slope ~-0.00143/decade, ' +
    'R^2 ~0.96), matching the imp-96405 M3 slowly-varying L(N) = log(effectiveHeight) sub-leading ' +
    'correction that breaks the exact-logistic sigma(N) form. sigma at the inflection stays pinned ' +
    'in [0.4967, 0.4988] (within ~0.0034 of 1/2) across the whole 5.24-decade drag -- the ' +
    'crossover-vs-inflection tracking itself does not loosen, only the small constant-looking ' +
    'offset between the two estimators. A genuine coincidence would produce a random walk in the ' +
    'offset as the rescale knob is turned; a smooth monotone drift with sigma held at 1/2 instead ' +
    'SHARPENS the imp-96405 FORCED conclusion.',
  verificationStatus:
    'Measurement + fit (frontier-direction), not a rigorous derivation. Changes no bound; the ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96481_KNEE_CROSSOVER_OFFSET_WINDOW_ARTIFACT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96481',
  proofSection: 'S-frontier',
  glosses: 'imp-96431',
  question:
    'imp-96431 corrected the imp-96405 M4 offset band [+0.0068, +0.0088] by dragging the ' +
    'crossover across ~5.24 decades instead of 1.32. How should a reader tell the corrected ' +
    'wide-range picture apart from the original narrow-window reading?',
  headword: KNEE_CROSSOVER_OFFSET_WINDOW_ARTIFACT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-96431 correction of the ' +
    'imp-96405 M4 offset band: the [+0.0068, +0.0088] band tested over 1.32 decades is a ' +
    'window artifact -- over ~5.24 decades the offset drifts monotonically (~+0.0124 -> ' +
    '~+0.0044, slope ~-0.00143/decade) while sigma at the inflection stays pinned near 1/2. ' +
    'Establishes nothing; instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96431 (the wide-range correction this glosses, offset drift ~+0.0124 -> ~+0.0044 over ' +
    '~5.24 decades, slope ~-0.00143/decade); imp-96405 (the M4 narrow-window band [+0.0068, ' +
    '+0.0088] this corrects); imp-96388 (knee ~0.013-0.015 log10 above the crossover); ' +
    'imp-33723 (closed-form crossover N_cross ~ 3.28e9).',
});

export default IMP96481_KNEE_CROSSOVER_OFFSET_WINDOW_ARTIFACT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96481_KNEE_CROSSOVER_OFFSET_WINDOW_ARTIFACT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96481-headword-names-both-bands',
    why: 'The headword must name both the original narrow-window band and the corrected ' +
      'wide-range drift, with their scales -- the entire point of the correction.',
    holds: () => {
      const h = IMP96481_KNEE_CROSSOVER_OFFSET_WINDOW_ARTIFACT_GLOSSARY_HEADWORD.headword;
      return (
        /\+0\.0068, \+0\.0088/.test(h.definition) &&
        /\+0\.0124/.test(h.definition) &&
        /\+0\.0044/.test(h.definition) &&
        /window artifact|window-artifact/.test(h.term)
      );
    },
  },
  {
    id: 'imp96481-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96481_KNEE_CROSSOVER_OFFSET_WINDOW_ARTIFACT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96481_KNEE_CROSSOVER_OFFSET_WINDOW_ARTIFACT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96481_KNEE_CROSSOVER_OFFSET_WINDOW_ARTIFACT_GLOSSARY_HEADWORD.verdict) &&
      IMP96481_KNEE_CROSSOVER_OFFSET_WINDOW_ARTIFACT_GLOSSARY_HEADWORD.glosses === 'imp-96431',
  },
];

for (const assertion of IMP96481_KNEE_CROSSOVER_OFFSET_WINDOW_ARTIFACT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96481-knee-crossover-offset-window-artifact-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
