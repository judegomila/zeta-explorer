/**
 * @module imp-96414-ecoll-count-model-sensitivity-glossary-headword
 * @fileoverview imp-96414 -- import-light glossary/Concepts headword for the imp-96387
 *   result: the +7/8 count-model sensitivity of the E_coll anchor is NOT a fixed
 *   ~3e-8-scale constant -- it SCALES AS ~1/N with the anchor height, and is
 *   ~137x LARGER at the imp-96290 N = 1e4 anchor (relative -4.11e-6) than at the
 *   imp-96363 reconstructed N = 1e6 anchor (relative -3.00e-8).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96363 Path B measured the +7/8-corrected-count sensitivity of E_coll only at
 *   the RECONSTRUCTED N = 1e6 anchor (relative -3.00e-8) and imp-96387 asked whether
 *   that figure carries over to the ONE independently baked anchor, imp-96290 at
 *   N = 1e4. It does not: imp-96387 measured -4.11e-6 there, about 137x larger. This
 *   headword bakes that verbatim (no re-import of the imp-96387/imp-96363/imp-96290
 *   modules, to stay import-light) as a standalone quick-lookup entry for a reader
 *   who wants the headline distinction: the count-model shift is a ~1/N EFFECT, not
 *   a fixed constant, so quoting "~3e-8" without an anchor height is misleading.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The fixed additive +7/8 Riemann-von Mangoldt count correction produces a gamma
 *   shift Delta gamma ~ (7/8) * 2pi / log gamma_N, hence a RELATIVE gamma shift
 *   ~ 1 / (gamma_N log gamma_N) ~ 1/N, and a relative rate/E_coll shift ~ half that
 *   in log terms. Concretely: at N = 1e4 the relative gamma shift is -7.56e-5 and the
 *   relative rate/E_coll shift is -4.11e-6; at N = 1e6 the relative gamma shift is
 *   -7.99e-7 and the relative rate/E_coll shift is -3.00e-8. The ratio of the two
 *   relative gamma shifts (~94.6x) tracks the 100x ratio of the two heights,
 *   confirming the ~1/N law. In ABSOLUTE terms both shifts stay tiny (the N = 1e4
 *   anchor 0.0108806 moves by only about -4.5e-8, inside its 6-sig-fig storage
 *   floor), but the RELATIVE sensitivity is two orders of magnitude larger at the
 *   smaller, independently-baked anchor than at the larger, reconstructed one.
 *
 *   STATUS: a measurement (accuracy audit), not a rigorous asymptotic derivation of
 *   the 1/N law's coefficient.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96387 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96387-ecoll-anchor-count-model-sensitivity-n1e4 (source: the measurement this glosses)
 * @see imp-96363-ecoll-independent-second-anchor (the N = 1e6 reconstructed-anchor sensitivity, -3.00e-8)
 * @see imp-96290-step4-bridge-subconstant-inventory (the ONE independently baked N = 1e4 anchor)
 * @see imp-96311-ecoll-rate-ch-independence-tabulation (rate factor R(N) definition)
 *
 * Ticket: imp-96414 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The count-model ~1/N sensitivity headword, baked verbatim (no re-import).
const ECOLL_COUNT_MODEL_SENSITIVITY_HEADWORD = Object.freeze({
  key: 'ecoll-count-model-sensitivity-scales-as-one-over-n',
  term:
    'imp-96387 verdict: the +7/8 count-model sensitivity of the E_coll anchor SCALES ' +
    'AS ~1/N with height -- it is NOT a fixed ~3e-8-scale constant',
  definition:
    'The fixed additive +7/8 count correction to the Riemann-von Mangoldt N(T) moves ' +
    'the E_coll anchor by a RELATIVE amount that grows as the anchor height N shrinks, ' +
    'not by a fixed constant. At the imp-96290 N = 1e4 anchor (the ONE independently ' +
    'baked E_coll anchor) the relative shift is -4.11e-6; at the imp-96363 ' +
    'reconstructed N = 1e6 anchor it is -3.00e-8 -- about 137x smaller. The two are ' +
    'NOT comparable, and quoting "-3.00e-8" as a general count-model sensitivity ' +
    'without stating the anchor height is misleading.',
  mechanism:
    'A fixed additive +7/8 count offset produces a gamma shift ' +
    'Delta gamma ~ (7/8) * 2pi / log gamma_N, so the RELATIVE gamma shift scales as ' +
    '~ 1 / (gamma_N log gamma_N) ~ 1/N, and the relative rate/E_coll shift inherits ' +
    'roughly the same 1/N scaling (halved in log terms, since E_coll ~ sqrt(log gamma_N ' +
    '/ N)). Measured: relative gamma shift -7.56e-5 at N = 1e4 versus -7.99e-7 at ' +
    'N = 1e6 (ratio ~94.6x, tracking the 100x height ratio); relative rate/E_coll shift ' +
    '-4.11e-6 at N = 1e4 versus -3.00e-8 at N = 1e6 (ratio ~137x). In absolute terms ' +
    'both anchors move only by tens of nanounits (~4.5e-8 on 0.0108806), well inside ' +
    'the 6-sig-fig storage floor -- only the RELATIVE sensitivity is anchor-height ' +
    'dependent.',
  verificationStatus:
    'Measurement (accuracy audit), not a rigorous derivation of the 1/N law’s ' +
    'coefficient. Changes no bound; the conditional C_H <= 0.127 stays UNPROVEN; ' +
    'C_H isRigorousUpperBound remains false (imp-2642/imp-2701); no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96414_ECOLL_COUNT_MODEL_SENSITIVITY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96414',
  proofSection: 'S-frontier',
  glosses: 'imp-96387',
  question:
    'imp-96363 measured the +7/8 count-model sensitivity of E_coll only at the ' +
    'RECONSTRUCTED N = 1e6 anchor (relative -3.00e-8). Does that figure carry over ' +
    'to the ONE independently baked anchor, imp-96290 at N = 1e4 -- and if not, how ' +
    'does the sensitivity depend on the anchor height?',
  headword: ECOLL_COUNT_MODEL_SENSITIVITY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96387 ' +
    'verdict: the +7/8 count-model sensitivity of E_coll is NOT a fixed ~3e-8-scale ' +
    'constant -- it SCALES AS ~1/N with the anchor height, measuring -4.11e-6 ' +
    '(~137x larger) at the N = 1e4 anchor versus -3.00e-8 at the N = 1e6 anchor, ' +
    'while remaining absolutely tiny (~4.5e-8) at both. Establishes nothing; ' +
    'instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96387 (the N = 1e4 measurement and finding this glosses); imp-96363 (the ' +
    'N = 1e6 reconstructed-anchor sensitivity, -3.00e-8); imp-96290 (the ONE ' +
    'independently baked N = 1e4 anchor); imp-96311 (rate factor R(N) definition).',
});

export default IMP96414_ECOLL_COUNT_MODEL_SENSITIVITY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96414_ECOLL_COUNT_MODEL_SENSITIVITY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96414-headword-has-required-fields',
    why: 'The headword must name both anchor heights, their relative shifts, and the ' +
      '~1/N scaling law -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96414_ECOLL_COUNT_MODEL_SENSITIVITY_GLOSSARY_HEADWORD.headword;
      return (
        /~ 1\/N/.test(h.mechanism) &&
        /-4\.11e-6/.test(h.definition) &&
        /-3\.00e-8/.test(h.definition) &&
        /137x/.test(h.definition) &&
        /1 \/ \(gamma_N log gamma_N\)/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96414-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96414_ECOLL_COUNT_MODEL_SENSITIVITY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96414_ECOLL_COUNT_MODEL_SENSITIVITY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96414_ECOLL_COUNT_MODEL_SENSITIVITY_GLOSSARY_HEADWORD.verdict) &&
      IMP96414_ECOLL_COUNT_MODEL_SENSITIVITY_GLOSSARY_HEADWORD.glosses === 'imp-96387',
  },
];

for (const assertion of IMP96414_ECOLL_COUNT_MODEL_SENSITIVITY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96414-ecoll-count-model-sensitivity-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
