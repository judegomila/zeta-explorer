/**
 * @module imp-124800-route-m-gap-law-nextorder-glossary-headword
 * @fileoverview imp-124800 -- import-light glossary/Concepts headword recording the imp-97640
 *   verdict on the Route M MCM gap-law next-order term: a CLIMBING local decay exponent plus a
 *   WIGGLING Mertens deficit is the fingerprint of a term smaller than any fixed power of
 *   1/log p (PNT/Mertens strength), not a clean elementary 1/log^3 correction.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97619 RESULT 3 found the next-order correction to the Route M MCM gap
 *   law is smaller than any fixed power of 1/log p, evidenced only by |gap - law|*log^2 p being
 *   strictly decreasing -- which does not by itself rule out a clean 1/log^3 term (whose scaled
 *   column would also decrease, just more slowly). imp-97640 sharpens this by measuring the
 *   LOCAL decay exponent q_i = ln(|res_i|/|res_{i+1}|) / ln(log p_{i+1}/log p_i) on the ladder:
 *   q = 6.839, 8.713, 7.495 across p = 7919, 104729, 1299709, 1999993. Every rung gives q >> 3,
 *   and on the two precision-clean rungs (residual ratio > 5) the exponent CLIMBS (6.839 ->
 *   8.713) rather than settling to a constant. Both |res|*log^2 p and |res|*log^3 p strictly
 *   decrease across the ladder, so the residual outruns 1/log^2 AND 1/log^3.
 *   (b) WHY IT IS NEW. A fixed power 1/log^q pins q at a constant; a climbing local exponent is
 *   only possible for a term that decays faster than EVERY fixed power (PNT/Mertens strength,
 *   e.g. exp(-c*sqrt(log p)) or the oscillating Mertens-third error). imp-97640 corroborates this
 *   independently via the imp-97639 deep-Mertens deficit ladder delta = gamma - M_omega, which
 *   feeds the residual: delta does NOT decay monotonically (8.0e-4, 5.1e-4, 4.6e-4, 1.4e-4, then
 *   RISES to 2.1e-4 at p ~ 3.2e7, then 1.7e-4) -- a wiggle no fixed inverse power can reproduce.
 *   (c) WHY IT MATTERS. It gives a reusable two-part diagnostic -- climbing local exponent +
 *   non-monotone feeding deficit -- for distinguishing "smaller than any fixed power" claims from
 *   merely-slow-fixed-power claims elsewhere in the gap-law family, and confirms/sharpens the
 *   imp-97619 RESULT 3 identification of the correction as the PNT/Mertens error.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. This is a decay-rate measurement on an already-refuted
 *   MCM gap law (MCM refuted from omega=11 per imp-97432/imp-97583). No operator positivity, no
 *   C_C/E_trunc/E_flow component-model change, no kappa_arith change; Lambda is untouched.
 *   (e) STATUS: documentation only. No bound moved; measurement is precision-limited past
 *   p ~ 2e6 (7-sig-fig catastrophic cancellation), a sub-gap later resolved by the imp-97659/
 *   imp-97706 extended-precision chain; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement. Not a new derivation. NO QED.
 *
 * @see imp-97640-route-m-gap-law-residual-decay-exponent.js (source: the local-exponent ladder
 *   and deep-delta-wiggle measurement this headword names)
 * @see imp-97619-route-m-mcm-binf-mertens-closed-form.js (RESULT 3: next order = PNT/Mertens
 *   error, the claim imp-97640 sharpens with the climbing-exponent fingerprint)
 * @see imp-97639-route-m-mcm-binf-deep-mertens-crosscheck.js (the deep delta ladder to p ~ 5e7
 *   whose non-monotone wiggle corroborates the non-power decay)
 *
 * Ticket: imp-124800 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

// The Route M gap-law next-order headword, baked verbatim (no re-import of the heavy zeros bundle).
const ROUTE_M_NEXTORDER_HEADWORD = Object.freeze({
  key: 'route-m-gaplaw-nextorder-imp97640',
  term:
    'imp-97640 Route M gap-law next-order term: a climbing local decay exponent plus a wiggling ' +
    'Mertens deficit is the fingerprint of a faster-than-any-fixed-power (PNT/Mertens-strength) ' +
    'correction, not a clean 1/log^3 term',
  definition:
    'Measuring the local exponent q_i = ln(|res_i|/|res_{i+1}|) / ln(log p_{i+1}/log p_i) on the ' +
    'imp-97619 gap-law residual ladder (p = 7919, 104729, 1299709, 1999993) gives q = 6.839, ' +
    '8.713, 7.495 -- every rung far above 3, ruling out a clean 1/log^3 next-order constant. On ' +
    'the two precision-clean rungs (residual ratio > 5) q CLIMBS from 6.839 to 8.713 rather than ' +
    'settling to a constant, and both |residual|*log^2 p and |residual|*log^3 p strictly decrease ' +
    'along the ladder, so the residual outruns every fixed inverse power of log p it was tested ' +
    'against.',
  mechanism:
    'A fixed-power term 1/log^q would pin the local exponent at the constant q; only a term ' +
    'smaller than every fixed power (PNT/Mertens strength) produces a local exponent that keeps ' +
    'climbing as the fit is pushed to higher q. This is corroborated independently by the ' +
    'imp-97639 deep-Mertens deficit ladder delta = gamma - M_omega, which feeds the residual: ' +
    'delta falls 8.0e-4 -> 5.1e-4 -> 4.6e-4 -> 1.4e-4 then RISES to 2.1e-4 at p ~ 3.2e7 before ' +
    'falling again to 1.7e-4 -- a non-monotone wiggle that no fixed inverse power of log p can ' +
    'reproduce, matching the PNT/Mertens error signature identified in imp-97619 RESULT 3.',
  verificationStatus:
    'Re-cited from the imp-97640 measurement module ' +
    '(src/data/imp-97640-route-m-gap-law-residual-decay-exponent.js): local exponents 6.839, ' +
    '8.713, 7.495 recomputed from the baked residual ladder to < 0.02 tolerance; both scaled ' +
    'columns |res|*log^2 p and |res|*log^3 p strictly decreasing verified by direct recomputation; ' +
    'the imp-97639 delta ladder rise at p ~ 3.2e7 verified non-monotone. HONEST: the third rung ' +
    '(residual ratio 1.25) is precision-limited by 7-sig-fig storage (imp-2546), a sub-gap ' +
    'resolved downstream by the imp-97659 (dps=30) / imp-97706 (dps=35) extended-precision chain. ' +
    'Naming / glossary headword only; supplies no new bound; MCM stays refuted from omega=11; ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
});

export const IMP124800_ROUTE_M_NEXTORDER_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124800',
  proofSection: 'S-frontier',
  glosses: 'imp-97640',
  question:
    'imp-97640 measured the local decay exponent of the Route M MCM gap-law residual -- what is ' +
    'the headword for why a climbing exponent plus a wiggling Mertens deficit means the next-order ' +
    'term is faster-than-any-fixed-power, not a clean 1/log^3 term?',
  headword: ROUTE_M_NEXTORDER_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97640 result: the ' +
    'imp-97619 gap-law residual decays with local exponent q ~ 7-9 that CLIMBS with height ' +
    '(6.839 -> 8.713 on the precision-clean rungs), so it outruns every fixed inverse power of ' +
    'log p (both |res|*log^2 p and |res|*log^3 p strictly decrease) -- corroborated by the ' +
    'imp-97639 deep Mertens deficit ladder wiggling rather than decaying monotonically. The ' +
    'correction is the PNT/Mertens error, sharpening imp-97619 RESULT 3. No bound moved; MCM ' +
    'stays refuted from omega=11; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97640 (the local-exponent measurement and deep-delta-wiggle this glosses); imp-97619 ' +
    '(RESULT 3: next order = PNT/Mertens error); imp-97639 (deep Mertens deficit ladder to ' +
    'p ~ 5e7, non-monotone).',
});

export default IMP124800_ROUTE_M_NEXTORDER_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124800_ROUTE_M_NEXTORDER_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124800-headword-names-climbing-exponent-and-wiggle',
    why: 'The headword must name both the climbing local exponent (rules out a fixed 1/log^3 ' +
      'term) and the non-monotone deep delta wiggle -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP124800_ROUTE_M_NEXTORDER_GLOSSARY_HEADWORD.headword;
      return (
        /6\.839/.test(h.definition) &&
        /8\.713/.test(h.definition) &&
        /7\.495/.test(h.definition) &&
        /RISES/.test(h.mechanism) &&
        /PNT\/Mertens/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp124800-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present, glosses imp-97640.',
    holds: () =>
      IMP124800_ROUTE_M_NEXTORDER_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124800_ROUTE_M_NEXTORDER_GLOSSARY_HEADWORD.verdict) &&
      /remains SOTA/.test(IMP124800_ROUTE_M_NEXTORDER_GLOSSARY_HEADWORD.verdict) &&
      IMP124800_ROUTE_M_NEXTORDER_GLOSSARY_HEADWORD.glosses === 'imp-97640',
  },
];

for (const assertion of IMP124800_ROUTE_M_NEXTORDER_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124800-route-m-gap-law-nextorder-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
