/**
 * @module imp-95973-six-point-noise-domination-wall-glossary-headword
 * @fileoverview imp-95973 -- import-light glossary/Concepts headword recording that four
 *   recent number-variance threads (imp-95941, imp-95940, imp-95946, imp-95897) all hit the
 *   SAME wall: the only in-repo directly-measured finite-height offsets are the six
 *   imp-95710/imp-95562 heights T = 1e4..5e5, and that six-point sample is NOISE-DOMINATED.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   A reader landing on any ONE of the four threads below sees a locally-reported R^2 or
 *   spread and can mistake it for a thread-specific weakness. It is not: all four measure
 *   different functionals of the SAME six offset points, so they share one root cause. This
 *   headword bakes that shared root cause VERBATIM (no re-import of any of the four source
 *   modules, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The imp-95721/imp-95562 pipeline directly measures the finite-height offset
 *   offset(T) = measuredVar(T) - SelbergTerm(T) at exactly six accessible heights,
 *   T = 1e4, 3e4, 7e4, 1.5e5, 3e5, 5e5 -- 6.8 decades below the imp-95519 window bottom
 *   T = 3e12. Every downstream statistic computed FROM those six points is noise-dominated:
 *     - imp-95897: raw offset-vs-log T regression slope 7.64e-4, R^2 = 0.0007 (statistically
 *       indistinguishable from zero), maximum at an INTERIOR height (1.5e5).
 *     - imp-95941: offset-vs-loglog(T/2pi) OLS slope 3.68e-3 with R^2 = 1.8e-4 and a standard
 *       error 0.137 that is ~27x the analytic prediction 1/2pi^2 = 0.05066 -- the fit neither
 *       confirms nor rejects the analytic saturated-box slope, it is simply too noisy to say.
 *     - imp-95940: backing the O(1) arithmetic intercept a_0 out of each of the six points
 *       individually gives a spread of ~1.18 that STRADDLES ZERO (exceeds the magnitude of
 *       a_0 itself), so a_0 cannot be pinned from this data at all.
 *     - imp-95946: the r_cap(T) envelope-vs-measured overlap check can only be a
 *       SELF-CONSISTENCY test, because the envelope's C0 was itself pinned as the MAX offset
 *       over these same six points -- there is no independent sixth-plus point to hold out.
 *   None of the four thread failures is a modeling error or a bug in its own regression; all
 *   four are downstream symptoms of one shared fact: six points spanning 1.7 decades of T,
 *   6.8 decades below the certified window, cannot statistically resolve a slow (loglog)
 *   drift. Consequently each thread's live conclusion rests on the ANALYTIC saturated
 *   box-variance law (Berry/Bogomolny-Keating), not on what the accessible data can confirm,
 *   and none of the four moves the Platt-Trudgian Lambda <= 0.2 bound.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating a shared obstruction already implicit across four
 *   separate tickets, for quick reference. It establishes nothing, instantiates no interval,
 *   closes no sub-gap, moves no bound. imp-2519 no-overclaim guard preserved; NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-95897-c0-offset-monotonicity-envelope-safety (raw-slope R^2 = 0.0007)
 * @see imp-95940-arithmetic-intercept-a0-obstruction (a_0 spread ~1.18, straddles zero)
 * @see imp-95941-offset-loglog-bracket-crossval (loglog-slope R^2 = 1.8e-4)
 * @see imp-95946-number-variance-envelope-vs-measured-crossvalidation (self-consistency-only overlap check)
 * @see imp-95968-rcap-envelope-self-consistency-glossary-headword (sibling headword for the imp-95946 leg)
 *
 * Ticket: imp-95973 (content, medium). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The shared six-point noise-domination headword, baked verbatim (no re-import).
const SIX_POINT_NOISE_DOMINATION_WALL_HEADWORD = Object.freeze({
  key: 'six-point-noise-domination-wall',
  term:
    'Six-point noise-domination wall (imp-95941/95940/95946/95897 shared obstruction)',
  definition:
    'The only in-repo directly-measured finite-height offsets are the six ' +
    'imp-95710/imp-95562 heights T = 1e4..5e5 (6.8 decades below the imp-95519 window ' +
    'bottom T = 3e12). Every statistic computed from those same six points is ' +
    'noise-dominated: this is one shared root cause behind four separately-reported ' +
    'number-variance findings, not four independent weaknesses.',
  perThreadSymptom:
    'imp-95897 (raw offset-vs-log T): slope 7.64e-4, R^2 = 0.0007, interior max at 1.5e5. ' +
    'imp-95941 (offset-vs-loglog cross-val): OLS slope 3.68e-3, R^2 = 1.8e-4, standard error ' +
    '0.137 (~27x the analytic 1/2pi^2 = 0.05066) -- neither confirms nor rejects the analytic ' +
    'slope. imp-95940 (arithmetic intercept a_0): per-height a_0 spread ~1.18, straddling ' +
    'zero -- cannot pin a_0. imp-95946 (r_cap envelope cross-val): only a SELF-CONSISTENCY ' +
    'check is possible, since the envelope C0 was itself max-anchored from these same six ' +
    'points, leaving no independent held-out point.',
  consequence:
    'None of the four is a local modeling error; each rests on the same 1.7-decade, ' +
    'six-point sample 6.8 decades below the certified window. Each thread live conclusion ' +
    'therefore rests on the ANALYTIC saturated box-variance law (Berry/Bogomolny-Keating), ' +
    'not on independent confirmation from accessible data, and none moves the ' +
    'Platt-Trudgian Lambda <= 0.2 bound.',
});

export const IMP95973_SIX_POINT_NOISE_DOMINATION_WALL_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95973',
  proofSection: 'S-frontier',
  glosses: 'imp-95941, imp-95940, imp-95946, imp-95897',
  question:
    'imp-95941, imp-95940, imp-95946, and imp-95897 each report a noise/spread finding on the ' +
    'finite-height offset(T). Are these four independent weaknesses, or one shared cause, for ' +
    'a reader landing on any single thread cold?',
  headword: SIX_POINT_NOISE_DOMINATION_WALL_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). All four threads measure different ' +
    'functionals of the SAME six imp-95710/imp-95562 accessible heights (T = 1e4..5e5, 6.8 ' +
    'decades below T = 3e12), so they share ONE root cause -- a noise-dominated six-point ' +
    'sample -- not four separate defects: imp-95897 raw-slope R^2 = 0.0007; imp-95941 ' +
    'loglog-slope R^2 = 1.8e-4 (standard error ~27x the analytic slope); imp-95940 a_0 spread ' +
    '~1.18 straddling zero; imp-95946 reduced to a self-consistency-only check. Each thread ' +
    'therefore rests on the analytic saturated box-variance law, not the accessible data. ' +
    'Establishes nothing; instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95897 (raw-slope R^2 = 0.0007 finding); imp-95941 (loglog cross-val R^2 = 1.8e-4 ' +
    'finding); imp-95940 (a_0 spread ~1.18 straddle-zero finding); imp-95946 (self-consistency ' +
    'overlap-check finding); imp-95968 (sibling glossary headword for the imp-95946 leg).',
});

export default IMP95973_SIX_POINT_NOISE_DOMINATION_WALL_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95973_SIX_POINT_NOISE_DOMINATION_WALL_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95973-headword-names-all-four-threads',
    why: 'The headword must name the specific noise statistic from each of the four source ' +
      'tickets -- the entire point of tying them to a shared cause.',
    holds: () => {
      const h = IMP95973_SIX_POINT_NOISE_DOMINATION_WALL_GLOSSARY_HEADWORD.headword;
      return (
        /R\^2 = 0\.0007/.test(h.perThreadSymptom) &&
        /R\^2 = 1\.8e-4/.test(h.perThreadSymptom) &&
        /1\.18/.test(h.perThreadSymptom) &&
        /SELF-CONSISTENCY/.test(h.perThreadSymptom) &&
        /1e4\.\.5e5/.test(h.definition) &&
        /3e12/.test(h.definition)
      );
    },
  },
  {
    id: 'imp95973-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, all four ' +
      'source ticket ids recorded.',
    holds: () =>
      IMP95973_SIX_POINT_NOISE_DOMINATION_WALL_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95973_SIX_POINT_NOISE_DOMINATION_WALL_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95973_SIX_POINT_NOISE_DOMINATION_WALL_GLOSSARY_HEADWORD.verdict) &&
      /imp-95941/.test(IMP95973_SIX_POINT_NOISE_DOMINATION_WALL_GLOSSARY_HEADWORD.glosses) &&
      /imp-95940/.test(IMP95973_SIX_POINT_NOISE_DOMINATION_WALL_GLOSSARY_HEADWORD.glosses) &&
      /imp-95946/.test(IMP95973_SIX_POINT_NOISE_DOMINATION_WALL_GLOSSARY_HEADWORD.glosses) &&
      /imp-95897/.test(IMP95973_SIX_POINT_NOISE_DOMINATION_WALL_GLOSSARY_HEADWORD.glosses),
  },
];

for (const assertion of IMP95973_SIX_POINT_NOISE_DOMINATION_WALL_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95973-six-point-noise-domination-wall-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
