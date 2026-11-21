/**
 * @module imp-96738-basis-c-lstar-theoretical-gue-glossary-headword
 * @fileoverview imp-96738 -- import-light Concepts glossary headword for the basis-C
 *   corroboration-reach program (imp-96690 L* ~ 8.1e7, imp-96712 bracket
 *   [7.6e7, 8.2e7], imp-96716 mechanism transition, imp-96568/96448 earlier floors):
 *   every reach number is a THEORETICAL-GUE quantity, with no computed Riemann zeros
 *   behind any value.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   Each of imp-96690/96712/96716/96568/96448 repeats the same HONEST CAVEAT inline:
 *   rho is the theoretical GUE (sine-kernel, universality) two-interval correlation
 *   for boxes of unfolded length L, and every floor value is a double-precision
 *   quadrature/cancellation artifact of the direct integral -- not a measurement over
 *   any computed Riemann zero set. This headword bakes that caveat verbatim, once,
 *   as a single quick-lookup Concepts entry so a reader browsing the reach ladder
 *   (L* ~ 8.1e7, bracket [7.6e7, 8.2e7]) does not mistake it for a real-zero
 *   corroboration reach.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) SOURCE OF EVERY NUMBER. rho(L) in the basis-C reach ladder is the closed-form
 *   GUE sine-kernel two-interval correlation (universality prediction), evaluated by
 *   direct double-precision quadrature -- never a statistic of any Odlyzko/LMFDB zero
 *   table.
 *   (b) EACH FLOOR IS A CANCELLATION ARTIFACT. The "floor" at each rung is the
 *   smallest value the quadrature can resolve before catastrophic cancellation
 *   swamps the true (much smaller) signal; it is a property of double-precision
 *   arithmetic, not of the zeros of zeta.
 *   (c) L* IS A PROJECTION, NOT A MEASUREMENT. The corroboration-reach crossover
 *   L* (imp-96690 OLS ~8.08e7; imp-96712 accelerating-exponent bracket
 *   [7.6e7, 8.2e7]) is where the fitted floor-growth law is projected to overtake the
 *   shrinking theoretical signal |rho + 1/2|. Nothing about it changes if real zero
 *   data becomes available -- it is entirely a quadrature-vs-model-fit statement.
 *   (d) NO EFFECT ON THE EXCURSION CONFIDENCE. None of this touches the separate
 *   ~1.9-sigma excursion confidence, which is the actual empirical-vs-GUE comparison;
 *   the reach ladder only bounds how far a THEORETICAL correlation can be evaluated
 *   in double precision.
 *
 *   STATUS: a glossary restatement of a caveat already present in five committed
 *   modules, not a new measurement. NO QED. No refereed bound is changed.
 *
 * @see imp-96690-basis-c-above-anchor-rung-ladder.js (source: L* ~ 8.1e7 OLS reach + caveat)
 * @see imp-96712-basis-c-accelerating-exponent-model.js (source: [7.6e7, 8.2e7] bracket + caveat)
 * @see imp-96716-basis-c-mechanism-transition-scale.js (mechanism-transition context)
 * @see imp-96568-basis-c-intermediate-rung-floor-ladder.js (earlier two-rung floor + caveat)
 * @see imp-96448-direct-basis-c-anchor-floor.js (PT-anchor floor + caveat)
 *
 * Ticket: imp-96738 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The theoretical-GUE-not-real-zeros headword, baked verbatim (no re-import).
const BASIS_C_LSTAR_THEORETICAL_GUE_HEADWORD = Object.freeze({
  key: 'basis-c-lstar-corroboration-reach-is-theoretical-gue-not-real-zeros',
  term:
    'basis-C corroboration-reach ladder (L* ~ 8.1e7, bracket [7.6e7, 8.2e7]): a ' +
    'THEORETICAL-GUE quantity -- every floor and every L* value is a double-precision ' +
    'quadrature artifact of the closed-form sine-kernel correlation, with NO computed ' +
    'Riemann zeros behind any number',
  definition:
    'The basis-C reach program (imp-96448 anchor floor, imp-96568 two-rung ladder, ' +
    'imp-96690 five-rung extended ladder giving L* ~ 8.08e7, imp-96712 accelerating-' +
    'exponent bracket L* in [7.63e7, 8.20e7], imp-96716 mechanism transition) all ' +
    'evaluate rho(L), the GUE (random-matrix universality) sine-kernel two-interval ' +
    'correlation for boxes of unfolded length L, by direct double-precision ' +
    'quadrature. No stage of this program touches a computed Riemann zero: every ' +
    '"floor" is the smallest value the quadrature can resolve before cancellation ' +
    'error swamps the true signal |rho(L) + 1/2|, and every corroboration-reach L* ' +
    'is the crossover where the fitted floor-growth law is projected to overtake ' +
    'that shrinking theoretical signal.',
  mechanism:
    'rho(L) has a closed-form GUE integral representation; evaluating it directly in ' +
    'double precision suffers cancellation because |rho(L) + 1/2| shrinks like a ' +
    'logarithm while intermediate quadrature terms do not shrink at all, so at some L ' +
    'the arithmetic floor exceeds the true signal. Fitting a power law to how that ' +
    'floor grows across rungs (exponent accelerating 1.81 -> 2.81 -> 2.08 -> 2.65 per ' +
    'imp-96712) and bisecting it against the shrinking signal produces L*. Because ' +
    'both curves being crossed are properties of arithmetic and a closed-form model, ' +
    'not of any zero dataset, L* would not move even if a large real-zero table were ' +
    'brought in -- it answers "how far can this integral be evaluated," not "how far ' +
    'do real zeros corroborate GUE."',
  verificationStatus:
    'Restates the HONEST CAVEAT already stated inline in five committed modules ' +
    '(imp-96448/96568/96690/96712/96716); no new computation. Changes no bound, ' +
    'establishes no operator positivity, and does not touch the separate ~1.9-sigma ' +
    'excursion confidence (the actual empirical-vs-GUE comparison). No refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96738_BASIS_C_LSTAR_THEORETICAL_GUE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96738',
  proofSection: 'S-frontier',
  glosses: 'imp-96690',
  question:
    'The basis-C corroboration-reach ladder reports a crossover L* ~ 8.1e7 ' +
    '(imp-96690) and a bracket [7.6e7, 8.2e7] (imp-96712). Is L* a measured reach ' +
    'over real Riemann zero data, or a property of the theoretical GUE model and its ' +
    'double-precision evaluation?',
  headword: BASIS_C_LSTAR_THEORETICAL_GUE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). The basis-C reach ladder ' +
    '(L* ~ 8.1e7 OLS, bracket [7.6e7, 8.2e7]) is entirely a THEORETICAL-GUE quantity: ' +
    'rho(L) is the closed-form sine-kernel correlation evaluated by direct double-' +
    'precision quadrature, every floor is a cancellation artifact of that ' +
    'quadrature, and L* is where the fitted floor-growth law is projected to overtake ' +
    'the shrinking theoretical signal -- no computed Riemann zero enters at any ' +
    'stage. Restates a caveat already present in five committed modules; changes no ' +
    'bound and does not touch the ~1.9-sigma excursion confidence. Establishes ' +
    'nothing; instantiates no interval; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96690 (L* ~ 8.1e7 OLS reach + caveat); imp-96712 (bracket [7.6e7, 8.2e7] + ' +
    'caveat); imp-96716 (mechanism-transition context); imp-96568, imp-96448 (earlier ' +
    'floors + caveat).',
});

export default IMP96738_BASIS_C_LSTAR_THEORETICAL_GUE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96738_BASIS_C_LSTAR_THEORETICAL_GUE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96738-headword-names-theoretical-gue-and-no-real-zeros',
    why: 'The headword must name both the theoretical-GUE source and the absence of ' +
      'real zeros -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96738_BASIS_C_LSTAR_THEORETICAL_GUE_GLOSSARY_HEADWORD.headword;
      return (
        /theoretical.gue/i.test(h.term) &&
        /no computed/i.test(h.term) &&
        /quadrature/i.test(h.definition) &&
        /8\.1e7|8\.08e7/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96738-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96738_BASIS_C_LSTAR_THEORETICAL_GUE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96738_BASIS_C_LSTAR_THEORETICAL_GUE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96738_BASIS_C_LSTAR_THEORETICAL_GUE_GLOSSARY_HEADWORD.verdict) &&
      IMP96738_BASIS_C_LSTAR_THEORETICAL_GUE_GLOSSARY_HEADWORD.glosses === 'imp-96690',
  },
];

for (const assertion of IMP96738_BASIS_C_LSTAR_THEORETICAL_GUE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96738-basis-c-lstar-theoretical-gue-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
