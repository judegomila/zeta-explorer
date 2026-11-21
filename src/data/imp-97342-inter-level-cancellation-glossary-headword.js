/**
 * @module imp-97342-inter-level-cancellation-glossary-headword
 * @fileoverview imp-97342 -- import-light glossary/Concepts headword recording the imp-97309
 *   RESULT 2 inter-level cancellation: grouping the complementary-divisor sum
 *   Sum_{e|b, e>=2} mu(e) J(e-1) by omega(e) = j gives Sum_j (-1)^j A_j(b), and the single-prime
 *   level A_1(b) = Sum_{p|b} J(p-1) = (1/12) log log b + O(1) diverges on its own (Mertens),
 *   while the full alternating sum |R(b)| stays O(1) (measured plateau ~0.127, still climbing at
 *   omega=12). Because the level-1 term alone exceeds |R(b)| from omega=2 onward, the levels must
 *   nearly cancel -- so the binding cancellation is INTER-LEVEL, and no bound that keeps A_1's
 *   sign fixed (a per-level bound, or a triangle-inequality bound) can ever close the tail.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE SPLIT. R(b) = mu(b) Sum_{e|b, e>=2} mu(e) J(e-1) = mu(b) Sum_{j=1}^{k} (-1)^j A_j(b),
 *   with A_j(b) = Sum_{e|b, omega(e)=j} J(e-1) > 0 grouping divisors by their own prime count.
 *   (b) THE DIVERGENT LEVEL. A_1(b) = Sum_{p|b} J(p-1) ~ (1/12) log log b -> infinity by Mertens
 *   (since 0 < J(p-1) < 1/(12(p-1)) ~ J(p-1)). Measured on the primorial ladder, A_1 climbs 0.081
 *   to 0.194 over omega = 1..12, overtaking the measured |R(b)| ~ 0.127 from omega=2 on.
 *   (c) THE OBSTRUCTION THIS FORCES. Since |R(b)| = O(1) while its own level-1 constituent A_1
 *   diverges, the composite levels j>=2 must cancel A_1 down to O(1) -- an inter-level effect. Any
 *   bound built from a triangle inequality |R(b)| <= Sum_j A_j(b) (or from bounding any single
 *   level in isolation) discards this cancellation and diverges with A_1, so it can never close
 *   IMP97289_TAIL_O1_SUBGAP.
 *   (d) STATUS: rigorous localization result (RESULT 2 of imp-97309), not a proof of the subgap
 *   itself -- it rules out an entire proof strategy (per-level / triangle bounds) and sharpens
 *   where any successful bound must look (a genuinely inter-level cancellation argument).
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording a rigorous localization
 *   result. Not a proof of the subgap, no uniform remainder supplied. NO QED.
 *
 * @see imp-97309-route-m-arith-tail-cancellation-assessment.js (source: RESULT 2, the rigorous
 *   A_1(b) = (1/12) log log b + O(1) divergence localization and the ruled-out proof strategies)
 * @see imp-97289-route-m-arith-tail-o1-proof.js (the named subgap IMP97289_TAIL_O1_SUBGAP this
 *   localization constrains)
 * @see imp-97307-route-m-qlog-mertens-unbounded.js (the Mertens loglog divergence RESULT 2 uses)
 *
 * Ticket: imp-97342 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The inter-level cancellation headword, baked verbatim (no re-import).
const INTER_LEVEL_CANCELLATION_HEADWORD = Object.freeze({
  key: 'inter-level-cancellation-imp97309-arith-tail-subgap',
  term:
    'imp-97309 inter-level cancellation: the divergent single-prime level A_1(b) = ' +
    '(1/12) log log b + O(1) forces the imp-97289 arithmetic tail subgap to be an INTER-LEVEL ' +
    'cancellation, ruling out any per-level or triangle-inequality bound',
  definition:
    'Grouping R(b) = mu(b) Sum_{e|b, e>=2} mu(e) J(e-1) by omega(e) = j gives an alternating sum ' +
    'Sum_j (-1)^j A_j(b) over positive levels A_j(b) = Sum_{e|b, omega(e)=j} J(e-1). The level-1 ' +
    'term A_1(b) = Sum_{p|b} J(p-1) ~ (1/12) log log b diverges by Mertens (measured: 0.081 -> ' +
    '0.194 over omega = 1..12), while the full sum |R(b)| stays O(1) (measured plateau ~0.127, ' +
    'still climbing). A_1 alone exceeds |R(b)| from omega = 2 onward.',
  mechanism:
    'Because |R(b)| = O(1) while its own level-1 constituent A_1(b) diverges, the composite ' +
    'levels j >= 2 must nearly cancel A_1 -- the binding cancellation is INTER-LEVEL, not within ' +
    'any single level. Consequently no per-level bound and no triangle-inequality bound ' +
    '|R(b)| <= Sum_j A_j(b) (both of which retain A_1 with a fixed positive sign) can close ' +
    'IMP97289_TAIL_O1_SUBGAP: either approach discards the cancellation and diverges with A_1.',
  verificationStatus:
    'Re-cited from the imp-97309 RESULT 2 measurement module ' +
    '(src/data/imp-97309-route-m-arith-tail-cancellation-assessment.js): the complementary-' +
    'divisor identity verified to < 1e-10 against the original S_b-integral on the primorial ' +
    'ladder omega = 1..12, and the A_1 divergence/overtake measured on the same ladder. Naming / ' +
    'glossary headword only; supplies no uniform remainder bound (IMP97289_TAIL_O1_SUBGAP stays ' +
    'open); no bound moved; RH open; no refereed bound is changed; NO QED.',
});

export const IMP97342_INTER_LEVEL_CANCELLATION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97342',
  proofSection: 'Route-M',
  glosses: 'imp-97309',
  question:
    'imp-97309 RESULT 2 proved the single-prime level A_1(b) = Sum_{p|b} J(p-1) diverges like ' +
    '(1/12) log log b while |R(b)| stays O(1). What is the headword for the proof-strategy ' +
    'obstruction this forces, and does it move any bound?',
  headword: INTER_LEVEL_CANCELLATION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the imp-97309 RESULT 2 ' +
    'inter-level cancellation: the level-1 sum A_1(b) ~ (1/12) log log b diverges on its own and ' +
    'overtakes the measured O(1) plateau of |R(b)|, so the binding cancellation closing ' +
    'IMP97289_TAIL_O1_SUBGAP must be inter-level -- ruling out per-level and triangle-inequality ' +
    'bounds as viable proof strategies. No bound moved; the subgap stays open; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97309 (RESULT 2, the rigorous A_1 divergence localization this glosses); imp-97289 (the ' +
    'named subgap IMP97289_TAIL_O1_SUBGAP this localization constrains); imp-97307 (the Mertens ' +
    'loglog divergence RESULT 2 relies on).',
});

export default IMP97342_INTER_LEVEL_CANCELLATION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97342_INTER_LEVEL_CANCELLATION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97342-headword-cites-divergence-and-obstruction',
    why: 'The headword must name the A_1 loglog divergence magnitude and the ruled-out proof ' +
      'strategies (per-level, triangle) -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97342_INTER_LEVEL_CANCELLATION_GLOSSARY_HEADWORD.headword;
      return (
        /log log b/.test(h.definition) &&
        /0\.194/.test(h.definition) &&
        /INTER-LEVEL/.test(h.mechanism) &&
        /triangle/i.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97342-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, subgap left open, no QED, no-refereed-bound-change line ' +
      'present.',
    holds: () =>
      IMP97342_INTER_LEVEL_CANCELLATION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97342_INTER_LEVEL_CANCELLATION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97342_INTER_LEVEL_CANCELLATION_GLOSSARY_HEADWORD.verdict) &&
      IMP97342_INTER_LEVEL_CANCELLATION_GLOSSARY_HEADWORD.glosses === 'imp-97309',
  },
];

for (const assertion of IMP97342_INTER_LEVEL_CANCELLATION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97342-inter-level-cancellation-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
