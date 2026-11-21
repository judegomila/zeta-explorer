/**
 * @module imp-95735-number-variance-ratio-conservatism-glossary-headword
 * @fileoverview imp-95735 -- import-light glossary/Concepts headword for the "number-variance
 *   ratio" r(T) and the mean-square/GUE envelope CONSERVATISM verdict measured by imp-95562
 *   (mean-square vs pointwise gap on actual zeta zeros) and tabulated across height by
 *   imp-95710 (var-ratio vs T trend).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95562 measured, on the 10^6 Odlyzko ordinates, that the pointwise local zero count
 *   fluctuates about the mean-square envelope with a variance only ~40% of the GUE
 *   asymptote, and imp-95710 tabulated that ratio across six heights to test whether it
 *   trends toward the GUE value 1. A reader landing on either module cold has no
 *   quick-lookup definition of "number-variance ratio" or why "conservatism" here means
 *   the envelope over-estimates, not under-estimates, the true pointwise fluctuation. This
 *   headword bakes those facts VERBATIM (no re-import of the imp-95562 / imp-95710 modules,
 *   to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   Number-variance ratio: r(T) = sd(C - E)^2 / Sigma^2(L), the measured pointwise local
 *   zero-count variance divided by the GUE (Dyson-Mehta) large-L asymptotic number variance
 *   Sigma^2(L) = (1/pi^2)(log(2 pi L) + gamma_E + 1) at the matching mean-square envelope
 *   count L = 2 Delta delta(T). imp-95562 measured r ~ 0.40 on average over T = 1e4..5e5 on
 *   actual zeta zeros: the pointwise fluctuation is REAL (sd ~ 0.57-0.67 zeros) but sits well
 *   below the GUE prediction.
 *
 *   MEAN-SQUARE ENVELOPE CONSERVATISM: r(T) < 1 means the GUE/mean-square envelope
 *   Sigma^2(L) OVER-ESTIMATES the true pointwise fluctuation at these heights -- "conservative"
 *   in the sense that any bound built on the envelope is safely wider than what is actually
 *   observed, not that the envelope under-covers.
 *
 *   HEIGHT TREND: FLAT-TO-WEAKLY-FALLING, NOT RISING TOWARD GUE
 *   -----------------------------------------------
 *   imp-95710 tabulated r(T) at six heights and found it wanders in a narrow band
 *   r in [0.349, 0.480] (mean 0.402) with a WEAK negative log-linear slope
 *   (d r / d(log T) ~ -2.08e-2, R^2 ~ 0.30, noise-dominated, non-monotone). The ratio does
 *   NOT climb toward the GUE asymptote 1 over the measured window -- if anything it drifts
 *   slightly down -- so the envelope conservatism does not close upward with height there.
 *
 *   NAMED SUB-GAP: WINDOW REACH
 *   -----------------------------------------------
 *   The six sampled heights span only ~1.7 decades (T = 1e4..5e5), about 6.8 decades below
 *   the imp-95519 verified-height window bottom T = 3.0e12. A naive log-linear extrapolation
 *   of the noise-dominated fit sends r -> 0.04 at 3e12, but this is NOT a warranted forecast
 *   from six scattered points -- whether the suppression persists, deepens, or reverts toward
 *   the GUE value 1 at 3e12 is UNMEASURED. The conservatism is established only across the
 *   measured window.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95562 measurement and the imp-95710
 *   height-trend tabulation for quick reference. It establishes nothing, instantiates no
 *   interval, closes no sub-gap, moves no bound. NO QED. No refereed bound is changed
 *   ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-95562-meansquare-vs-pointwise-gap (source: the on-zeros measurement of r(T) ~ 0.40)
 * @see imp-95710-number-variance-ratio-vs-height (source: the six-height trend tabulation and window-reach sub-gap)
 * @see imp-95519 (verified-height window bottom T = 3.0e12 this sub-gap is measured against)
 *
 * Ticket: imp-95735 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The number-variance-ratio + envelope-conservatism headword, baked verbatim (no re-import).
const NUMBER_VARIANCE_RATIO_HEADWORD = Object.freeze({
  key: 'number-variance-ratio-meansquare-envelope-conservatism',
  term: 'imp-95562/imp-95710 verdict: the pointwise number-variance ratio r(T) sits near 0.40 (not 1), making the GUE/mean-square envelope a CONSERVATIVE over-estimate that does not trend toward GUE with height',
  definition:
    'r(T) = sd(C - E)^2 / Sigma^2(L): the measured pointwise local zero-count variance ' +
    'divided by the GUE (Dyson-Mehta) large-L asymptotic number variance ' +
    'Sigma^2(L) = (1/pi^2)(log(2 pi L) + gamma_E + 1) at the mean-square envelope count ' +
    'L = 2 Delta delta(T). imp-95562 measured r ~ 0.40 on average over T = 1e4..5e5 on the ' +
    '10^6 Odlyzko zeta ordinates.',
  conservatism:
    'r(T) < 1 means the GUE/mean-square envelope OVER-ESTIMATES the true pointwise ' +
    'fluctuation at these heights: any bound built on the envelope is safely wider than what ' +
    'is actually observed, not narrower.',
  heightTrend:
    'imp-95710 tabulated r(T) at six heights (T = 1e4..5e5): it wanders in a narrow band ' +
    'r in [0.349, 0.480] (mean 0.402) with a WEAK negative log-linear slope ' +
    '(d r / d(log T) ~ -2.08e-2, R^2 ~ 0.30, noise-dominated, non-monotone). The ratio does ' +
    'NOT rise toward the GUE asymptote 1 over the measured window.',
  windowReachSubGap:
    'The six heights span only ~1.7 decades, ~6.8 decades below the imp-95519 window bottom ' +
    'T = 3.0e12. Extrapolating the noise-dominated fit to r -> 0.04 at 3e12 is NOT warranted; ' +
    'whether the conservatism persists, deepens, or reverts toward GUE at 3e12 is UNMEASURED.',
});

export const IMP95735_NUMBER_VARIANCE_RATIO_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95735',
  proofSection: 'S-frontier',
  glosses: 'imp-95562,imp-95710',
  scopes: 'imp-95519,imp-95534',
  question:
    'imp-95562 measured the pointwise-vs-mean-square number-variance gap on actual zeta ' +
    'zeros, and imp-95710 tabulated that ratio across height to test whether it trends ' +
    'toward the GUE asymptote. What is the headline verdict, for a reader landing on either ' +
    'module cold?',
  headword: NUMBER_VARIANCE_RATIO_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates: (1) the measured ' +
    'pointwise number-variance ratio r(T) sits near 0.40, well below the GUE asymptote 1, ' +
    'so the mean-square envelope is a CONSERVATIVE over-estimate of the true pointwise ' +
    'fluctuation over T = 1e4..5e5; (2) the ratio does not trend toward GUE with height ' +
    '(weak, noise-dominated negative slope); (3) extending that conservatism to the ' +
    'imp-95519 window bottom T = 3.0e12 is a NAMED sub-gap (window reach), unmeasured across ' +
    'the remaining ~6.8 decades. Establishes nothing; instantiates no interval; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95562 (on-zeros measurement of r(T) ~ 0.40, additive height-decaying pointwise ' +
    'excess); imp-95710 (six-height trend tabulation, window-reach sub-gap); imp-95519 ' +
    '(verified-height window bottom T = 3.0e12); imp-95534 (wall (i), mean-square vs ' +
    'pointwise control this gap was asserted against).',
});

export default IMP95735_NUMBER_VARIANCE_RATIO_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95735_NUMBER_VARIANCE_RATIO_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95735-headword-has-required-fields',
    why: 'The headword must name the ~0.40 ratio, the envelope conservatism, the flat/non-rising height trend, and the window-reach sub-gap -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95735_NUMBER_VARIANCE_RATIO_GLOSSARY_HEADWORD.headword;
      return (
        /r ~ 0\.40/.test(h.definition) &&
        /OVER-ESTIMATES/.test(h.conservatism) &&
        /NOT rise toward the GUE asymptote/.test(h.heightTrend) &&
        /UNMEASURED/.test(h.windowReachSubGap)
      );
    },
  },
  {
    id: 'imp95735-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95735_NUMBER_VARIANCE_RATIO_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95735_NUMBER_VARIANCE_RATIO_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95735_NUMBER_VARIANCE_RATIO_GLOSSARY_HEADWORD.verdict) &&
      IMP95735_NUMBER_VARIANCE_RATIO_GLOSSARY_HEADWORD.glosses === 'imp-95562,imp-95710' &&
      IMP95735_NUMBER_VARIANCE_RATIO_GLOSSARY_HEADWORD.scopes === 'imp-95519,imp-95534',
  },
];

for (const assertion of IMP95735_NUMBER_VARIANCE_RATIO_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95735-number-variance-ratio-conservatism-glossary-headword assertion failed: ${assertion.id}`);
  }
}
