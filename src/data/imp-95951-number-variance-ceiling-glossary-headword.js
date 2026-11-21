/**
 * @module imp-95951-number-variance-ceiling-glossary-headword
 * @fileoverview imp-95951 -- import-light glossary/Concepts headword for the
 *   imp-95750 finding: the direct sd(C - E) number-variance pointwise-conservatism
 *   measurement is hard-capped by gamma_1e6 = 6.003e5, the largest verified
 *   ordinate in the repo, and that ceiling reaches only ~2.4% of the way into
 *   the 3.36-decade dead zone up to the imp-95729 E_coll = E_trunc crossover.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95750 is an assessment module, not a lookup entry: a reader landing on
 *   it (or on a sibling module that cites its ceiling, e.g. imp-95795 / imp-95766)
 *   cold has no single-sentence answer to "what caps the direct measurement, and
 *   how far short of the crossover does that ceiling fall?" This headword bakes
 *   that answer VERBATIM (no re-import of imp-95750, to stay import-light) as a
 *   standalone lookup entry, distinct from the imp-95795 headword (which glosses
 *   the wider dead-zone-plus-r_cap-coverage story spanning imp-95750 AND imp-95766).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The number-variance measurement ceiling is gamma_1e6 = 6.003e5, the largest
 *   verified Riemann-zero ordinate in the repo (last entry of ZEROS_EXTENDED in
 *   src/data/zeros-to-1e6.js, N = 1e6 Odlyzko ordinates). Any windowed sd(C - E)
 *   pointwise-variance sample needs ordinates around its target height, so this
 *   is the hard upper bound on how high a direct measurement can reach. Pushing
 *   the imp-95710 measured top (T = 5e5) up to this ceiling adds at most
 *   log10(6.003e5 / 5e5) ~ 0.079 decade -- about 2.4% of the 3.358-decade gap to
 *   the imp-95729 crossover T0 ~ 1.14e9. No other in-repo zero table reaches
 *   higher (zeros-first-25.js stops at T < 100; the imp-360 / imp-962 "extended
 *   ladder" modules are derived summaries, not additional ordinate tables).
 *
 *   WHY THIS MATTERS: it is a NEGATIVE reach result -- direct measurement cannot
 *   be meaningfully extended toward the crossover with data already in the repo,
 *   so ~97.6% of the gap (and the entire remaining span to the imp-95519 window
 *   bottom T = 3.0e12) must rely on the imp-95722 DERIVED r_cap(T) envelope
 *   instead of on direct sampling.
 *
 *   STATUS: a definitional glossary entry only. Changes no bound; the ceiling
 *   gamma_1e6 remains fixed by the repo's largest ordinate table.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95750 measurement-ceiling finding
 *   for quick reference. It establishes nothing, instantiates no interval,
 *   closes no sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-95750-number-variance-deadzone-measurement-reach (source: the ceiling and reach fraction this glosses)
 * @see imp-95795-number-variance-deadzone-glossary-headword (sibling headword: the wider dead-zone + r_cap-coverage story)
 * @see imp-95710-number-variance-ratio-vs-height (measured top T = 5e5 this ceiling extends)
 * @see imp-95729-crossover-height-vs-variance-window (crossover T0 ~ 1.14e9 the ceiling falls short of)
 * @see imp-95722-number-variance-ratio-window-bottom-bound (the derived r_cap envelope the dead zone relies on instead)
 *
 * Ticket: imp-95951 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The number-variance ceiling headword, baked verbatim (no re-import).
const NUMBER_VARIANCE_CEILING_HEADWORD = Object.freeze({
  key: 'number-variance-measurement-ceiling',
  term:
    'number-variance measurement ceiling (gamma_1e6 = 6.003e5)',
  definition:
    'The hard upper bound on how high a direct sd(C - E) pointwise-variance ' +
    'sample can reach, set by gamma_1e6 = 6.003e5, the largest verified ' +
    'Riemann-zero ordinate in the repo (last entry of ZEROS_EXTENDED in ' +
    'src/data/zeros-to-1e6.js, N = 1e6 Odlyzko ordinates). A windowed sample ' +
    'needs ordinates around its target height, so no directly-measured sample ' +
    'can exceed this bound; no other in-repo zero table reaches higher.',
  mechanism:
    'Pushing the imp-95710 measured top (T = 5e5) up to the ceiling gamma_1e6 ' +
    'adds at most log10(6.003e5 / 5e5) ~ 0.079 decade -- about 2.4% of the ' +
    '3.358-decade gap to the imp-95729 crossover T0 ~ 1.14e9. The ceiling is ' +
    'fixed by the size of the largest verified ordinate table in the repo, not ' +
    'by any property of the number-variance conservatism itself.',
  verificationStatus:
    'imp-95750 computed the reach in closed form: ceilingGainDecades ~ 0.0794, ' +
    'fractionOfGapAttainable ~ 2.36%, leaving remainingToCrossoverDecades ~ 3.279 ' +
    'and remainingToWindowBottomDecades ~ 6.699. The ceiling is a negative reach ' +
    'result -- direct measurement cannot be meaningfully extended toward the ' +
    'crossover with in-repo data, so the imp-95722 derived r_cap(T) envelope ' +
    'carries the conservatism claim across essentially the entire dead zone.',
});

export const IMP95951_NUMBER_VARIANCE_CEILING_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95951',
  proofSection: 'S-frontier',
  glosses: 'imp-95750',
  question:
    'imp-95750 found that the direct sd(C - E) number-variance measurement is ' +
    'capped by gamma_1e6 = 6.003e5 (the largest verified ordinate in the repo), ' +
    'reaching only ~2.4% of the way into the 3.36-decade dead zone to the ' +
    'imp-95729 crossover. What is that ceiling, why is it fixed there, and how ' +
    'far short of the crossover does it fall, for a reader landing on the ' +
    'module cold?',
  headword: NUMBER_VARIANCE_CEILING_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the ' +
    'imp-95750 measurement-ceiling finding: gamma_1e6 = 6.003e5 (largest ' +
    'verified ordinate, src/data/zeros-to-1e6.js) hard-caps direct sd(C - E) ' +
    'measurement, reaching only ~2.36% of the 3.358-decade gap to the imp-95729 ' +
    'crossover T0 ~ 1.14e9. Establishes nothing; instantiates no interval; ' +
    'moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95750 (measurement-ceiling finding and reach-fraction this glosses); ' +
    'imp-95710 (measured top T = 5e5 the ceiling extends); imp-95729 (crossover ' +
    'T0 ~ 1.14e9); imp-95722 (derived r_cap(T) envelope covering the remaining ' +
    'gap); imp-95795 (sibling headword for the wider dead-zone concept).',
});

export default IMP95951_NUMBER_VARIANCE_CEILING_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95951_NUMBER_VARIANCE_CEILING_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95951-headword-has-required-fields',
    why: 'The headword must name the exact ceiling (gamma_1e6 = 6.003e5), the ' +
      '~2.4% reach fraction, and the ~3.358-decade gap to the crossover -- the ' +
      'entire point of the glossary entry.',
    holds: () => {
      const h = IMP95951_NUMBER_VARIANCE_CEILING_GLOSSARY_HEADWORD.headword;
      return (
        /6\.003e5/.test(h.definition) &&
        /2\.4%/.test(h.mechanism) &&
        /3\.358-decade/.test(h.mechanism) &&
        /0\.0794/.test(h.verificationStatus) &&
        /2\.36%/.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp95951-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95951_NUMBER_VARIANCE_CEILING_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95951_NUMBER_VARIANCE_CEILING_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95951_NUMBER_VARIANCE_CEILING_GLOSSARY_HEADWORD.verdict) &&
      IMP95951_NUMBER_VARIANCE_CEILING_GLOSSARY_HEADWORD.glosses === 'imp-95750',
  },
];

for (const assertion of IMP95951_NUMBER_VARIANCE_CEILING_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95951-number-variance-ceiling-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
