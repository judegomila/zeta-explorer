/**
 * @module imp-95949-c0-offset-envelope-finite-window-glossary-headword
 * @fileoverview imp-95949 -- import-light glossary/Concepts headword recording the imp-95921
 *   finding: the finite-height offset(T) approaches the r_cap envelope anchor C0 from BELOW,
 *   rising with exact analytic slope d offset / d loglog = 1/2pi^2, so C0 is a valid upper
 *   envelope through the imp-95519 window bottom T = 3e12 -- but only over a FINITE
 *   super-window, since the drift is unbounded and crosses C0 at a finite height T_x in
 *   [~5.8e17, ~1.36e28].
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   A reader landing on imp-95921 cold sees an analytic bracket with several intermediate
 *   quantities (saturation ratios, cushions, two crossing-height anchors) and can miss the
 *   single load-bearing conclusion: C0 stops being a valid envelope past a FINITE height, not
 *   at infinity. That distinction matters for every downstream consumer of C0 as an r_cap
 *   anchor (imp-95722, imp-95888, imp-95930, imp-95971) -- it is safe at 3e12 but not for
 *   arbitrarily large T. This headword bakes that one fact verbatim (no re-import of
 *   imp-95921) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   offset(T) = measuredVar(T) - Selberg term. Via the Berry / Bogomolny-Keating box-variance
 *   SATURATION law, the saturated box variance equals TWICE Selberg Var S(T) (a (1/pi^2) loglog
 *   coefficient), while the Selberg term subtracts only the single-endpoint (1/2pi^2) loglog,
 *   so offset(T) = (1/2pi^2) loglog(T/2pi) + const drifts UPWARD (never downward) with exact
 *   slope 1/2pi^2 = 0.05066. Over [5e5, 3e12] this rise is only +0.044, comfortably inside the
 *   +0.087 max-anchor cushion C0 - offset(5e5), so the pinned envelope anchor C0 = 0.3337
 *   REMAINS valid through 3e12. But because offset grows without bound, C0 fails as an
 *   envelope beyond a finite crossing height T_x: anchored at the noise-limited mean offset
 *   T_x ~ 5.8e17, anchored at the low accessible-top offset T_x ~ 1.36e28. The safe super-window
 *   comfortably contains 3e12, but the ceiling is a RANGE, not infinity.
 *   whySlopeButNotIntercept:
 *   Only the loglog SLOPE 1/2pi^2 is analytically pinned (a semiclassical saturation fact). The
 *   O(1) arithmetic intercept gamma + 1 + a_0 that fixes WHERE the drift line sits is not
 *   pinned -- that unpinned constant is exactly what widens the crossing-height range from a
 *   point to [~5.8e17, ~1.36e28] (the named sub-gap imp-95921-subgap-arithmetic-intercept).
 *   consequence:
 *   C0 is safe to use as an r_cap upper envelope at the imp-95519 window bottom 3e12 (and at
 *   the imp-95729 crossover 1.14e9), but any future consumer pushing the envelope to
 *   Odlyzko-style high-block heights (imp-95884 range 1e20..1e23) sits RIGHT AT the C0
 *   boundary and must re-check against the crossing range, not assume C0 holds unconditionally.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95921 conclusion for quick reference. It
 *   establishes nothing new, instantiates no interval, closes no sub-gap, moves no bound.
 *   imp-2519 no-overclaim guard preserved; NO QED. No refereed bound is changed.
 *
 * @see imp-95921-c0-offset-approach-analytic-bracket (source: the analytic bracket and crossing range)
 * @see imp-95897-c0-offset-monotonicity-envelope-safety (left the approach direction UNDECIDED)
 * @see imp-95884-odlyzko-high-block-calibration-assessment (raised the downward-drift hazard imp-95921 refuted)
 * @see imp-95722-number-variance-ratio-window-bottom-bound (r_cap envelope; C0 = max offset)
 *
 * Ticket: imp-95949 (content, medium). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The C0-envelope-finite-window headword, baked verbatim (no re-import of imp-95921).
const C0_OFFSET_ENVELOPE_FINITE_WINDOW_HEADWORD = Object.freeze({
  key: 'c0-offset-envelope-finite-window',
  term:
    'C0 envelope valid through 3e12, only over a finite super-window (imp-95921 crossing range)',
  definition:
    'The finite-height offset(T) = measuredVar(T) - Selberg term approaches the r_cap envelope ' +
    'anchor C0 from BELOW, rising with exact analytic slope d offset / d loglog = 1/2pi^2 ' +
    '(Berry / Bogomolny-Keating box-variance saturation: the saturated box variance equals ' +
    'TWICE Selberg Var S(T), while the Selberg term subtracts only the single-endpoint half). ' +
    'The rise over [5e5, 3e12] is +0.044, inside the +0.087 max-anchor cushion, so C0 = 0.3337 ' +
    'remains a valid upper envelope through the imp-95519 window bottom 3e12. But offset grows ' +
    'unboundedly, so C0 fails as an envelope beyond a finite crossing height T_x in the range ' +
    '[~5.8e17 (mean anchor), ~1.36e28 (low anchor)]: a FINITE super-window, not infinity.',
  whySlopeButNotIntercept:
    'Only the loglog SLOPE 1/2pi^2 is analytically pinned (a semiclassical saturation fact ' +
    'about decorrelated box endpoints). The O(1) arithmetic intercept gamma + 1 + a_0 fixing ' +
    'where the drift line sits is not pinned, which is exactly what widens the crossing-height ' +
    'ceiling from a point to the range [~5.8e17, ~1.36e28] (named sub-gap ' +
    'imp-95921-subgap-arithmetic-intercept).',
  consequence:
    'C0 is safe as an r_cap upper envelope at the imp-95519 window bottom 3e12 and at the ' +
    'imp-95729 crossover 1.14e9, but any future consumer pushing to Odlyzko-style high-block ' +
    'heights (imp-95884 range 1e20..1e23) sits RIGHT AT the C0 boundary and must re-check ' +
    'against the crossing range rather than assume C0 holds unconditionally.',
});

export const IMP95949_C0_OFFSET_ENVELOPE_FINITE_WINDOW_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95949',
  proofSection: 'S-frontier',
  glosses: 'imp-95921',
  question:
    'imp-95921 shows the finite-height offset approaches C0 from below with a pinned analytic ' +
    'slope, and that C0 remains a valid envelope through 3e12. Is that envelope-safety ' +
    'unconditional for all T, or bounded to a finite super-window, for a reader landing on the ' +
    'thread cold?',
  headword: C0_OFFSET_ENVELOPE_FINITE_WINDOW_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). offset(T) drifts UPWARD toward C0 ' +
    'with exact analytic slope 1/2pi^2, and the rise over [5e5, 3e12] fits inside the ' +
    'max-anchor cushion, so C0 REMAINS a valid upper envelope through the window bottom 3e12. ' +
    'This is bounded, not unconditional: offset grows without bound and crosses C0 at a finite ' +
    'height T_x in [~5.8e17, ~1.36e28], the range set by the unpinned O(1) arithmetic intercept. ' +
    'Establishes nothing; instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95921 (analytic bracket; upward drift slope 1/2pi^2; crossing range [~5.8e17, ~1.36e28]); ' +
    'imp-95897 (left the approach direction undecided); imp-95884 (downward-drift hazard imp-95921 ' +
    'refuted); imp-95722 (r_cap envelope, C0 = max offset).',
});

export default IMP95949_C0_OFFSET_ENVELOPE_FINITE_WINDOW_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95949_C0_OFFSET_ENVELOPE_FINITE_WINDOW_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95949-headword-states-the-bounded-envelope',
    why: 'The headword must state that C0 holds through 3e12 but only over a finite super-window ' +
      '(a crossing range), not an unconditional envelope -- the entire content of the imp-95921 finding.',
    holds: () => {
      const h = IMP95949_C0_OFFSET_ENVELOPE_FINITE_WINDOW_GLOSSARY_HEADWORD.headword;
      return (
        /1\/2pi\^2/.test(h.definition) &&
        /3e12/.test(h.definition) &&
        /5\.8e17/.test(h.definition) &&
        /1\.36e28/.test(h.definition) &&
        /FINITE/.test(h.definition) &&
        /arithmetic intercept/.test(h.whySlopeButNotIntercept)
      );
    },
  },
  {
    id: 'imp95949-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, source ' +
      'ticket id recorded.',
    holds: () =>
      IMP95949_C0_OFFSET_ENVELOPE_FINITE_WINDOW_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95949_C0_OFFSET_ENVELOPE_FINITE_WINDOW_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95949_C0_OFFSET_ENVELOPE_FINITE_WINDOW_GLOSSARY_HEADWORD.verdict) &&
      /imp-95921/.test(IMP95949_C0_OFFSET_ENVELOPE_FINITE_WINDOW_GLOSSARY_HEADWORD.glosses),
  },
];

for (const assertion of IMP95949_C0_OFFSET_ENVELOPE_FINITE_WINDOW_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95949-c0-offset-envelope-finite-window-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
