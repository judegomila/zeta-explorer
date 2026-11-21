/**
 * @module imp-96665-ecoll-count-model-gap-featureless-powerlaw-glossary-headword
 * @fileoverview imp-96665 -- import-light glossary/Concepts headword for the
 *   imp-96513 result: across the sixteen-decade span N = 1e6..1e22 the E_coll
 *   count-model gap is a single featureless ~(7/8)/N power law, with the ONLY
 *   intermediate feature being the double-precision floor crossover at N ~ 1e15
 *   (gamma) / N ~ 1e14 (rate) -- a storage-resolution artifact, not a regime
 *   change in the count model.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96426 supplied true-height count-model-gap anchors up to N = 1e6 and
 *   imp-96402 supplied the N = 1e22 double-floor endpoint, but nothing in the
 *   sixteen-decade span between them was ever exhibited: no in-repo true zero
 *   heights exist past N = 1e6, and a naive double-precision subtraction
 *   collapses to exactly zero once the gap sinks below ~1e-16. imp-96513 fills
 *   that span with the CANCELLATION-FREE analytic form of the deterministic +7/8
 *   count offset and finds one smooth power law throughout, with the "gap" in
 *   the data explained away as a resolution artifact rather than a genuine
 *   feature. This headword bakes that verdict verbatim (no re-import of the
 *   imp-96513/imp-96426/imp-96402 modules, to stay import-light) as a standalone
 *   quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The deterministic +7/8 Riemann-von Mangoldt count correction, propagated
 *   through the Lambert-W main-term inversion, produces an analytic gamma
 *   relative gap running 7.99e-7 (N=1e6) -> 8.56e-23 (N=1e22), and a rate
 *   relative gap running 3.00e-8 -> 8.80e-25 -- both strictly monotone
 *   decreasing across all seventeen decade points, with the successive-decade
 *   ratio rising from 9.85 to 9.99 (max deviation from the clean 1/N power-law
 *   value 10 is under 1.5% everywhere). No kink, plateau, or regime change
 *   appears anywhere in the span. The single intermediate feature is that a
 *   naive double-precision direct-subtraction measurement of the same quantity
 *   collapses to exactly zero once the analytic gap sinks below the ~1e-16
 *   double floor (near N ~ 1e15 for gamma) -- which is exactly why imp-96426
 *   could resolve no point between its N = 1e6 anchor and the imp-96402
 *   N = 1e22 endpoint. That crossover is a storage/resolution artifact of
 *   IEEE double subtraction, not a feature of the underlying count model.
 *
 *   STATUS: an extrapolation / accuracy audit built on a cancellation-free
 *   analytic reconstruction, not a new measurement against true zero heights
 *   (none exist past N = 1e6 in-repo).
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96513 verdict for quick
 *   reference. It establishes nothing, instantiates no interval, closes no
 *   sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96513-count-model-gap-1e6-to-1e22-extrapolation (source: the finding this glosses)
 * @see imp-96426-ecoll-anchor-intermediate-heights (the true-height anchors up to N = 1e6, and +7/8 dominant omission)
 * @see imp-96402-ecoll-anchor-from-tabulated-true-zero-height (the N = 1e22 double-floor endpoint)
 *
 * Ticket: imp-96665 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The featureless-power-law headword, baked verbatim (no re-import).
const ECOLL_COUNT_MODEL_GAP_FEATURELESS_POWERLAW_HEADWORD = Object.freeze({
  key: 'ecoll-count-model-gap-featureless-power-law-1e6-to-1e22',
  term:
    'imp-96513 verdict: across N = 1e6..1e22 the E_coll count-model gap is a single ' +
    'featureless ~(7/8)/N power law, its only intermediate feature being the ' +
    'double-precision floor crossover',
  definition:
    'imp-96426 measured the deterministic +7/8 count-model gap using true zero ' +
    'heights only up to N = 1e6, and imp-96402 supplied the N = 1e22 endpoint ' +
    'where the gap is already below the double-precision floor -- nothing in ' +
    'between was ever exhibited. imp-96513 extrapolates the cancellation-free ' +
    'analytic form of the +7/8 count offset across that sixteen-decade span and ' +
    'finds a single monotone, featureless ~(7/8)/N power law throughout, with no ' +
    'intermediate kink, plateau, or regime change. The only intermediate feature ' +
    'is a RESOLUTION artifact: a naive double-precision direct-subtraction ' +
    'measurement of the same gap collapses to exactly zero once it sinks below ' +
    'the ~1e-16 double floor, which is why imp-96426 could resolve no point in ' +
    'this span.',
  mechanism:
    'A fixed additive +7/8 count offset divided by the zero density ' +
    'dN/dgamma = (1/2pi) log(gamma/2pi) gives the analytic gamma relative gap ' +
    'gammaRelGap(N) = (7/8) * 2pi / (gamma_main * log(gamma_main/2pi)), and the ' +
    'rate relative gap is half of that divided by log(gamma_main). Evaluated on ' +
    'the grid N = 1e6, 1e7, ..., 1e22: gammaRelGap runs 7.99e-7 -> 8.56e-23 and ' +
    'rateRelGap runs 3.00e-8 -> 8.80e-25, both strictly monotone decreasing. The ' +
    'successive-decade ratio of the gamma gap rises from 9.85 to 9.99, within 1.5% ' +
    'of the clean 1/N power-law value 10 across the whole span. The 1e6 endpoint ' +
    '(7.99e-7 analytic) is order-consistent with the imp-96426 measured true-height ' +
    'gap there (1.19e-6; the +7/8-only analytic omits the S(T) fluctuation, ~0.67x), ' +
    'confirming the reconstruction reproduces the last resolved anchor before ' +
    'extrapolating past it. The naive double-subtraction measurement of the same ' +
    'quantity collapses to exactly zero near N ~ 1e15 (gamma) / N ~ 1e14 (rate), ' +
    'which is a storage-resolution artifact of IEEE double subtraction below the ' +
    '~1e-16 relative floor, not evidence of a count-model regime change.',
  verificationStatus:
    'Extrapolation / accuracy audit built on a cancellation-free analytic ' +
    'reconstruction, not a measurement against true zero heights past N = 1e6 ' +
    '(none exist in-repo). Changes no bound; the conditional C_H <= 0.127 stays ' +
    'UNPROVEN; C_H isRigorousUpperBound remains false (imp-2642/imp-2701); ' +
    'no refereed bound is changed; RH open; NO QED.',
});

export const IMP96665_ECOLL_COUNT_MODEL_GAP_FEATURELESS_POWERLAW_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96665',
  proofSection: 'S-frontier',
  glosses: 'imp-96513',
  question:
    'imp-96426 left a sixteen-decade span (N = 1e6..1e22) of the E_coll ' +
    'count-model gap unmeasured -- no true zero heights exist in-repo past ' +
    'N = 1e6, and the gap sinks below double-precision resolution before the ' +
    'N = 1e22 endpoint. Is the decay across that span a featureless power law, ' +
    'or does an intermediate regime change appear?',
  headword: ECOLL_COUNT_MODEL_GAP_FEATURELESS_POWERLAW_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the ' +
    'imp-96513 verdict: the count-model gap across N = 1e6..1e22 is a single, ' +
    'monotone, featureless ~(7/8)/N power law (successive-decade ratio 9.85 to ' +
    '9.99, converging to 10), and its only intermediate feature -- the ' +
    'double-precision direct-subtraction measurement collapsing to zero near ' +
    'N ~ 1e15 -- is a storage-resolution artifact, not a count-model feature. ' +
    'Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96513 (the extrapolation and finding this glosses); imp-96426 (true-height ' +
    'anchors up to N = 1e6 and the +7/8 dominant-omission finding); imp-96402 ' +
    '(the N = 1e22 double-floor endpoint).',
});

export default IMP96665_ECOLL_COUNT_MODEL_GAP_FEATURELESS_POWERLAW_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96665_ECOLL_COUNT_MODEL_GAP_FEATURELESS_POWERLAW_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96665-headword-has-required-fields',
    why: 'The headword must name the span, the decay law, the decade-ratio ' +
      'range, and the floor-crossover explanation -- the entire point of the ' +
      'glossary entry.',
    holds: () => {
      const h = IMP96665_ECOLL_COUNT_MODEL_GAP_FEATURELESS_POWERLAW_GLOSSARY_HEADWORD.headword;
      return (
        /7\.99e-7/.test(h.mechanism) &&
        /8\.56e-23/.test(h.mechanism) &&
        /9\.85/.test(h.mechanism) &&
        /9\.99/.test(h.mechanism) &&
        /storage-resolution artifact/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96665-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96665_ECOLL_COUNT_MODEL_GAP_FEATURELESS_POWERLAW_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96665_ECOLL_COUNT_MODEL_GAP_FEATURELESS_POWERLAW_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96665_ECOLL_COUNT_MODEL_GAP_FEATURELESS_POWERLAW_GLOSSARY_HEADWORD.verdict) &&
      IMP96665_ECOLL_COUNT_MODEL_GAP_FEATURELESS_POWERLAW_GLOSSARY_HEADWORD.glosses === 'imp-96513',
  },
];

for (const assertion of IMP96665_ECOLL_COUNT_MODEL_GAP_FEATURELESS_POWERLAW_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96665-ecoll-count-model-gap-featureless-powerlaw-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
