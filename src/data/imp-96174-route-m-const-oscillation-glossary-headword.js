/**
 * @module imp-96174-route-m-const-oscillation-glossary-headword
 * @fileoverview imp-96174 -- import-light glossary/Concepts headword for the imp-96147
 *   Route M verdict: the two-term fit of the Vasyunin Gram ratio(N) ladder separates a
 *   fitted constant c0 = 0.975 (NOT the RH-predicted 1) from a persistent, non-decaying
 *   ~1.3 percent RMS residual oscillation -- so the ladder's non-convergence at N <= 6000
 *   is a genuine fluctuation, not a resolvable smooth drift toward a limit.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96105 extended ratio(N) = d_N^2 * log N / C_burnol to N = 6000 and found it stuck
 *   in the band [0.964, 1.010] without converging, leaving open whether that was a smooth
 *   drift or a genuine oscillation. imp-96147 fit a two-term OLS model
 *   ratio(N) = c0 + c1/logN + residual to the 17 baked rows and separated the constant
 *   from the fluctuation quantitatively. A reader landing on imp-96147 cold has no
 *   quick-lookup definition of what that separation established or why the residual is
 *   not just noise around a converging smooth term. This headword bakes those facts
 *   VERBATIM (no re-import of the imp-96147 module, to stay import-light) as a standalone
 *   lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The two-term fit ratio(N) = c0 + c1/logN + residual over N = 250..6000 yields a
 *   constant c0 = 0.97503 that is clearly separated from the RH-predicted value 1 (the
 *   1/logN term explains under 1 percent of the variance, R2 = 0.0099 -- the fit is
 *   effectively a flat line at 0.975). The residual left over is a genuine, non-decaying
 *   oscillation: RMS 0.01349, five sign changes, and the second-half RMS (0.01399) is not
 *   smaller than the first-half RMS (0.01291). This residual does NOT match the leading
 *   zero-side prediction cos(gamma_1 logN) at this grid: the gamma_1 = 14.1347 tone
 *   explains only 1.26 percent of residual variance, while a free-frequency single tone
 *   lands at period 1.536 in logN with amplitude 0.01648 and no zeta zero there.
 *
 *   MECHANISM: the coarse, uneven 17-point log N grid has a median spacing of 0.141 but
 *   low-N gaps up to 0.69, which exceed half the gamma_1-predicted period (0.2223) and so
 *   ALIAS the true gamma_1 oscillation into the apparent period-1.536 swing. The
 *   constant/fluctuation separation is real and grid-independent; the zero-side
 *   identification of the fluctuation is grid-limited, not refuted.
 *
 *   STATUS: a DERIVATION / SEPARATION only. It upgrades the imp-96105 open question
 *   ("smooth drift or genuine oscillation?") to a quantitative answer (genuine, does not
 *   decay), but proves no new bound and settles nothing about RH. The remaining named
 *   sub-gap (IMP96147_SUBGAP) is deciding whether the fluctuation IS the gamma_1
 *   zero-oscillation, which needs a denser, more uniform log N grid past N = 6000.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96147 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96147-route-m-ratio-const-oscillation-fit (source: the two-term fit this glosses)
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000 (source ladder to N = 6000)
 * @see imp-96163-route-m-residual-gamma1-alias-refute (independent aliasing cross-check)
 *
 * Ticket: imp-96174 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The Route M const/oscillation separation headword, baked verbatim (no re-import).
const ROUTE_M_CONST_OSCILLATION_HEADWORD = Object.freeze({
  key: 'route-m-ratio-const-vs-oscillation-separation',
  term:
    'imp-96147 Route M verdict: the Vasyunin Gram ratio(N) two-term fit separates a ' +
    'constant c0 = 0.975 (not the RH-predicted 1) from a genuine, non-decaying ~1.3 ' +
    'percent RMS residual oscillation',
  definition:
    'A two-term ordinary-least-squares fit ratio(N) = c0 + c1/logN + residual applied to ' +
    'the 17 baked ratio(N) rows (N = 250..6000) from imp-96105. The fitted constant ' +
    'c0 = 0.97503 is clearly separated from the RH-predicted 1; the 1/logN term ' +
    '(c1 = 0.07818) explains only R2 = 0.0099 of the variance, so the model is ' +
    'effectively a flat line at 0.975. The leftover residual has RMS 0.01349 and five ' +
    'sign changes, and does NOT shrink with N (second-half RMS 0.01399 >= first-half ' +
    'RMS 0.01291).',
  mechanism:
    'The residual is checked against the leading zero-side prediction cos(gamma_1 logN), ' +
    'gamma_1 = 14.1347, predicted period 0.4445 in logN. That tone explains only 1.26 ' +
    'percent of residual variance, while a free-frequency single tone instead lands at ' +
    'period 1.536 (amplitude 0.01648) with no zeta zero there. The 17-point grid has ' +
    'low-N log N gaps up to 0.69, more than half the gamma_1 period (0.2223), so the ' +
    'coarse grid ALIASES the true gamma_1 oscillation into the observed period-1.536 ' +
    'swing rather than refuting the zero-side origin.',
  verificationStatus:
    'DERIVED, not a new bound: upgrades the imp-96105 open question (smooth drift vs ' +
    'genuine oscillation) to a quantitative separation -- the constant/fluctuation split ' +
    'is real and grid-independent, but identifying the fluctuation with the gamma_1 ' +
    'zero-oscillation is grid-limited (IMP96147_SUBGAP), needing a denser, more uniform ' +
    'logN grid past N = 6000. Changes no bound; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96174_ROUTE_M_CONST_OSCILLATION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96174',
  proofSection: 'S-frontier',
  glosses: 'imp-96147',
  question:
    'imp-96147 fit a two-term model to the imp-96105 ratio(N) ladder (N <= 6000, stuck in ' +
    '[0.964, 1.010] without converging) to separate a constant term from a fluctuation. ' +
    'What did it find, and is the non-convergence a resolvable drift or a genuine ' +
    'oscillation, for a reader landing on that module cold?',
  headword: ROUTE_M_CONST_OSCILLATION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96147 verdict: ' +
    'the fitted constant c0 = 0.975 is separated from the RH-predicted 1, and the leftover ' +
    '~1.3 percent RMS residual is a genuine, non-decaying oscillation (five sign changes, ' +
    'second-half RMS not smaller than first-half) rather than noise around a converging ' +
    'smooth term. The residual cannot be confirmed as the gamma_1 zero-oscillation at this ' +
    'coarse, aliased grid. Establishes nothing; instantiates no interval; moves no bound; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-96147 (the two-term fit this glosses); imp-96105 (source ratio(N) ladder to ' +
    'N = 6000); imp-96163 (independent aliasing cross-check at a denser grid).',
});

export default IMP96174_ROUTE_M_CONST_OSCILLATION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96174_ROUTE_M_CONST_OSCILLATION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96174-headword-has-required-fields',
    why: 'The headword must name the separated constant, the R2 of the smooth term, and ' +
      'the aliasing discriminator -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96174_ROUTE_M_CONST_OSCILLATION_GLOSSARY_HEADWORD.headword;
      return (
        /0\.97503/.test(h.definition) &&
        /R2 = 0\.0099/.test(h.definition) &&
        /ALIASES/.test(h.mechanism) &&
        /grid-limited/.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp96174-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96174_ROUTE_M_CONST_OSCILLATION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96174_ROUTE_M_CONST_OSCILLATION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96174_ROUTE_M_CONST_OSCILLATION_GLOSSARY_HEADWORD.verdict) &&
      IMP96174_ROUTE_M_CONST_OSCILLATION_GLOSSARY_HEADWORD.glosses === 'imp-96147',
  },
];

for (const assertion of IMP96174_ROUTE_M_CONST_OSCILLATION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96174-route-m-const-oscillation-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
