/**
 * @module imp-96242-eigen-drift-elimination-glossary-headword
 * @fileoverview imp-96242 -- import-light Concepts glossary headword for the imp-96203 result:
 *   the sub-leading Vasyunin prolate eigen-spectrum (lam_1..lam_6) is exactly as strictly
 *   monotone-decreasing and as uncorrelated with the w ~ 4.08 ratio(N) swing as lam_min, so the
 *   period-1.5 tone is arithmetic (a low-conductor q = 4, 5 cotangent band), NOT a spectral
 *   drift of the operator.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96189 attributed the period-1.5 (w ~ 4.08) swing in ratio(N) to a low-conductor
 *   arithmetic band (dominant conductors q = 4, 5) of the Vasyunin cotangent table, but left an
 *   honest sub-gap: only lam_min was available per rung, so an "eigen-drift" alternative --
 *   that some SUB-LEADING eigenvalue carries oscillatory content lam_min lacks -- was never
 *   tested directly. imp-96203 computed the six smallest eigenvalues per rung on the exact
 *   Vasyunin Gram (NMAX = 6000) and found every one strictly monotone-decreasing with
 *   max |corr| = 0.064 against the residual, ruling the eigen-drift candidate out. A reader
 *   landing on that module cold has no quick-lookup summary of this elimination. This headword
 *   bakes the facts VERBATIM (no re-import of the imp-96203 module, to stay import-light) as a
 *   standalone lookup entry.
 *
 * @see imp-96203-route-m-vasyunin-subleading-spectrum (source: the six-eigenvalue elimination test)
 * @see imp-96189-route-m-swing-attribution.js (the low-conductor q = 4, 5 band attribution + sub-gap)
 * @see imp-96147-route-m-ratio-const-oscillation-fit.js (the per-N residual r(N) correlated against)
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000.js (the Gram to N = 6000, lam_min)
 *
 * Ticket: imp-96242 (content, low). Documentation only; establishes nothing; changes no bound;
 * NO QED; no refereed bound is changed.
 */

// The eigen-drift-elimination headword, baked verbatim (no re-import).
const EIGEN_DRIFT_ELIMINATION_HEADWORD = Object.freeze({
  key: 'vasyunin-subleading-eigen-drift-ruled-out',
  term: 'imp-96203 verdict: the sub-leading Vasyunin prolate spectrum is as monotone and as uncorrelated with the w ~ 4.08 swing as lam_min -- the period-1.5 tone is arithmetic, not a spectral drift',
  definition:
    'On the exact Vasyunin Gram (NMAX = 6000, the same validated pipeline as imp-96105), the six ' +
    'smallest eigenvalues lam_1 <= .. <= lam_6 were computed per rung across the imp-96147 ' +
    '17-point N = 250..6000 ladder. Every one of the six is STRICTLY MONOTONE-DECREASING (zero ' +
    'upward steps each), exactly like lam_min, so the sub-leading spectrum carries no more ' +
    'oscillatory content than the bottom eigenvalue.',
  correlationNull:
    'None of lam_1..lam_6 tracks the imp-96147 residual r(N): max |corr(lam, r)| = 0.064 ' +
    '(log-eigenvalue correlations even smaller, max 0.029). Even the spectral-gap ratios ' +
    'lam_j/lam_1, which DO wobble (5-7 upward steps each) and shrink toward 1 as N grows ' +
    '(e.g. lam_2/lam_1 from 1.037 to 1.007), still show negligible correlation with r(N) ' +
    '(max |corr| = 0.072). The one place the spectrum is non-monotone still fails to explain ' +
    'the swing.',
  verdictSummary:
    'The eigen-drift candidate is RULED OUT, strengthening (not uniquely deciding) the imp-96189 ' +
    'low-conductor arithmetic-band attribution (dominant conductors q = 4, 5) for the period-1.5 ' +
    '(w ~ 4.08) tone. The full-ladder lam_min-vs-residual correlation of -0.064 also confirms ' +
    'imp-96189 that its previously reported -0.77 tail correlation (on a short N > 2600 window) ' +
    'was a monotone-window artifact, not a genuine swing driver.',
});

export const IMP96242_EIGEN_DRIFT_ELIMINATION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96242',
  proofSection: 'S-frontier',
  glosses: 'imp-96203',
  scopes: 'imp-96189',
  question:
    'imp-96189 attributed the period-1.5 (w ~ 4.08) ratio(N) swing to a low-conductor arithmetic ' +
    'band, but left the eigen-drift alternative (a sub-leading Vasyunin eigenvalue carrying ' +
    'oscillatory content lam_min lacks) untested. Does imp-96203 rule that alternative out, for a ' +
    'reader landing on that module cold?',
  headword: EIGEN_DRIFT_ELIMINATION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96203 elimination: all ' +
    'six smallest Vasyunin eigenvalues per rung are strictly monotone-decreasing (0 upward steps ' +
    'each) and uncorrelated with the residual swing (max |corr| = 0.064, gap ratios max 0.072), so ' +
    'the eigen-drift candidate is ruled out and the low-conductor q = 4, 5 band attribution is ' +
    'strengthened. Establishes nothing; changes no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96203 (six-eigenvalue elimination test and verdict); imp-96189 (low-conductor band ' +
    'attribution and the eigen-drift sub-gap it left open); imp-96147 (the per-N residual r(N) ' +
    'correlated against); imp-96105 (the validated Vasyunin Gram to N = 6000).',
});

export default IMP96242_EIGEN_DRIFT_ELIMINATION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96242_EIGEN_DRIFT_ELIMINATION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96242-headword-has-required-fields',
    why: 'The headword must name the monotone sub-leading spectrum, the near-zero correlation with the residual, and the strengthened band attribution -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96242_EIGEN_DRIFT_ELIMINATION_GLOSSARY_HEADWORD.headword;
      return (
        /STRICTLY MONOTONE-DECREASING/.test(h.definition) &&
        /0\.064/.test(h.correlationNull) &&
        /0\.072/.test(h.correlationNull) &&
        /RULED OUT/.test(h.verdictSummary) &&
        /q = 4, 5/.test(h.verdictSummary)
      );
    },
  },
  {
    id: 'imp96242-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96242_EIGEN_DRIFT_ELIMINATION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96242_EIGEN_DRIFT_ELIMINATION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96242_EIGEN_DRIFT_ELIMINATION_GLOSSARY_HEADWORD.verdict) &&
      IMP96242_EIGEN_DRIFT_ELIMINATION_GLOSSARY_HEADWORD.glosses === 'imp-96203' &&
      IMP96242_EIGEN_DRIFT_ELIMINATION_GLOSSARY_HEADWORD.scopes === 'imp-96189',
  },
];

for (const assertion of IMP96242_EIGEN_DRIFT_ELIMINATION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-96242-eigen-drift-elimination-glossary-headword assertion failed: ${assertion.id}`);
  }
}
