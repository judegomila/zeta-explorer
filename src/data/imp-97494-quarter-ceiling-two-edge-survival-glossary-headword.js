/**
 * @module imp-97494-quarter-ceiling-two-edge-survival-glossary-headword
 * @fileoverview imp-97494 -- import-light glossary/Concepts headword recording the imp-97461
 *   two-edge DECOMPOSITION of the Route M b/4 ceiling |T(b)| <= 1/4, together with the CORRECTED
 *   verdict: imp-97461's own "the lower edge survives" conclusion was subsequently REFUTED by
 *   imp-97481, and the consolidated status (imp-97544, already committed) is that the whole
 *   ceiling is a DEAD ROUTE. This headword deliberately does NOT restate imp-97461's superseded
 *   bottom line as fact -- see imp-97544, which names this very ticket as resting on that stale
 *   premise.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE DECOMPOSITION (still structurally valid). |T(b)| <= 1/4 = UPPER edge T(b) <= 1/4
 *   (S(b) <= 0) INTERSECT LOWER edge T(b) >= -1/4 (S(b) >= -1/2). imp-97422 derived both from the
 *   MCM hypothesis through different clauses: top-order non-negativity T(b) >= 0 over-supplies the
 *   LOWER edge, the peel-the-smallest-prime descent supplies the UPPER edge. imp-97461 correctly
 *   located the imp-97432 MCM refutation (T(p_11#) = -9.624e-4 < 0, first negative at omega=11) as
 *   living entirely in the primorial (min-prime) regime, disjoint from the all-large-prime regime
 *   that extremizes the upper edge -- so the refutation is genuinely irrelevant to the upper edge.
 *   (b) WHERE imp-97461 WENT WRONG. imp-97461 then asserted a replacement lemma RL-L -- "the
 *   primorial family is the two-sided extremizer, with infimum -e^{-gamma}/12 + Rcorr_inf =
 *   -0.04577, clearing -1/4 by margin 0.204" -- without formalizing it. imp-97481 RESULT 3 proved
 *   RL-L FALSE: the primorial (P0 = 2) is the SHALLOWEST window, not the extremizer. Over general
 *   large-prime window sets [P0, Y] the surrogate runs UNBOUNDEDLY negative as Y -> infinity, with
 *   exact limit -e^{-gamma}/12 / Prod_{p<P0}(1-1/p) -- e.g. -0.388874 at P0 = 101, -0.497500 at
 *   P0 = 379, both far below -1/4. So the LOWER edge T(b) >= -1/4 is REFUTED outright for general
 *   squarefree b, with explicit witnesses (imp-97496: ~32M-digit b* at P0=379; imp-97515: rigorized
 *   ~1.19B-digit crossing at P0=101; imp-97500: size-optimal ~17.82M-digit interior witness at
 *   P0~1409) -- not merely its imp-97422 proof, as imp-97461 believed.
 *   (c) WHY IT DOES NOT MATTER. imp-97516 proves the breach is harmless to the live program: E1(b)
 *   is only the sub-leading remainder of the coprime sum L1(b), entering the arithmetic first
 *   moment F_arith at O(b log b) = o(phi(b) b), while F_arith = Theta(phi(b) b); kappa_arith =
 *   (3/2)C - 3/8 = 0.5704960511 is untouched. The consolidated status (imp-97544) is that the b/4
 *   ceiling was exploratory Route-M scaffolding, load-bearing for nothing.
 *   (d) STATUS: documentation only. No bound moves; kappa_arith unchanged; MCM stays refuted
 *   (verified not proved at omega<=6, false from omega=11); interval-rigorous reach stays
 *   2a<=0.96; no operator positivity; RH open; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording a decomposition together
 *   with its own later-corrected verdict. Not a proof, not a new bound. NO QED.
 *
 * @see imp-97461-route-m-quarter-ceiling-survival-without-mcm-scope.js (the two-edge scoping this
 *   headword names; its "lower edge survives" bottom line is SUPERSEDED, see below)
 * @see imp-97481-route-m-quarter-ceiling-lower-edge-refuted-window-sets.js (refutes imp-97461's
 *   RL-L replacement lemma; the lower edge fails generally, not just its original proof)
 * @see imp-97544-route-m-b4-ceiling-dead-route-consolidated-honest-status.js (consolidated
 *   up-to-date status: the b/4 ceiling is a DEAD ROUTE; names this ticket as resting on the stale
 *   premise rather than needing separate execution)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted at omega=11)
 * @see imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction.js (both edges
 *   originally reduced to MCM)
 *
 * Ticket: imp-97494 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The two-edge decomposition headword, baked verbatim (no re-import).
const QUARTER_CEILING_TWO_EDGE_HEADWORD = Object.freeze({
  key: 'quarter-ceiling-two-edge-decomposition-imp97461-superseded',
  term:
    'two-edge b/4-ceiling decomposition (imp-97461): the UPPER-edge / LOWER-edge split of ' +
    '|T(b)| <= 1/4 that correctly located the imp-97432 MCM refutation in the primorial regime, ' +
    'but whose own "lower edge survives" verdict was SUPERSEDED by the imp-97481 refutation -- the ' +
    'consolidated status (imp-97544) is that the whole ceiling is a DEAD ROUTE',
  definition:
    'The Route M ceiling |T(b)| <= 1/4 (squarefree b, T(b) = Sum_{e|b} mu(e) h(e)) decomposes into ' +
    'UPPER edge T(b) <= 1/4 (S(b) <= 0), extremized only as the smallest prime factor of b -> ' +
    'infinity (all-large-prime, MCM-safe regime), and LOWER edge T(b) >= -1/4 (S(b) >= -1/2), ' +
    'extremized over large-prime window sets [P0, Y] -- exactly the regime where imp-97432 refuted ' +
    'the MCM hypothesis (T(p_11#) = -9.624e-4 < 0 at omega=11). imp-97461 correctly showed the MCM ' +
    'refutation is irrelevant to the upper edge, but its claim that the primorial family is the ' +
    'lower-edge extremizer (surviving with margin 0.204) was FALSE.',
  mechanism:
    'imp-97481 proves the primorial (min prime P0=2) is the SHALLOWEST window, not the extremizer: ' +
    'over a general window [P0,Y] the surrogate runs unboundedly negative as Y -> infinity, with ' +
    'exact Mertens limit -e^{-gamma}/12 / Prod_{p<P0}(1-1/p) -- e.g. -0.388874 at P0=101, well below ' +
    '-1/4. So the LOWER edge is refuted outright for general squarefree b (explicit witnesses at ' +
    'P0=379, P0=101, and a size-optimal interior P0~1409), not merely imp-97422s original T>=0 ' +
    'proof of it, as imp-97461 believed. imp-97516 shows the breach is harmless regardless: E1(b) ' +
    'enters the arithmetic first moment only at O(b log b) = o(phi(b) b), so kappa_arith = ' +
    '0.5704960511 is untouched.',
  verificationStatus:
    'The decomposition/regime-location half is re-cited from imp-97461 ' +
    '(src/data/imp-97461-route-m-quarter-ceiling-survival-without-mcm-scope.js) and remains a valid ' +
    'structural observation. Its "survives" bottom line is corrected by imp-97481 ' +
    '(src/data/imp-97481-route-m-quarter-ceiling-lower-edge-refuted-window-sets.js) and the ' +
    'consolidated up-to-date status is imp-97544 ' +
    '(src/data/imp-97544-route-m-b4-ceiling-dead-route-consolidated-honest-status.js): the b/4 ' +
    'ceiling is REFUTED and a dead route, harmless to kappa_arith. Naming / glossary headword only; ' +
    'supplies no new bound; RH open; no refereed bound is changed; NO QED.',
});

export const IMP97494_QUARTER_CEILING_TWO_EDGE_SURVIVAL_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97494',
  proofSection: 'S-frontier',
  glosses: 'imp-97461',
  question:
    'imp-97461 scoped a two-edge decomposition of the Route M b/4 ceiling and claimed the lower ' +
    'edge survives the imp-97432 MCM refutation with margin. imp-97481 later refuted that claim ' +
    'outright. What is the headword for the (corrected) two-edge decomposition?',
  headword: QUARTER_CEILING_TWO_EDGE_HEADWORD,
  anyBoundMoved: false,
  supersededBy: 'imp-97544',
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97461 two-edge split of ' +
    'the b/4 ceiling -- an UPPER edge extremized in the all-large-prime MCM-safe regime, and a ' +
    'LOWER edge extremized over primorial/large-prime window sets -- while explicitly correcting ' +
    'imp-97461s own now-superseded "survives" verdict: imp-97481 refuted the lower edge outright, ' +
    'and imp-97544 records the consolidated status that the whole ceiling is a DEAD ROUTE, harmless ' +
    'to kappa_arith (imp-97516). No bound moved; NO QED. No refereed bound is changed.',
  citation:
    'imp-97461 (the two-edge decomposition this glosses); imp-97481 (refutes imp-97461s survival ' +
    'verdict); imp-97544 (consolidated dead-route status); imp-97432 (the MCM refutation at ' +
    'omega=11); imp-97422 (the original, MCM-based derivation of both edges).',
});

export default IMP97494_QUARTER_CEILING_TWO_EDGE_SURVIVAL_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97494_QUARTER_CEILING_TWO_EDGE_SURVIVAL_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97494-headword-names-both-edges-and-correction',
    why: 'The headword must name the upper/lower edge split AND the correction (imp-97481 refutes ' +
      'imp-97461s survival claim) -- the entire content of the glossary entry, so it cannot be ' +
      'read as restating stale information as fact.',
    holds: () => {
      const h = IMP97494_QUARTER_CEILING_TWO_EDGE_SURVIVAL_GLOSSARY_HEADWORD.headword;
      return (
        /UPPER edge/.test(h.definition) &&
        /LOWER edge/.test(h.definition) &&
        /SUPERSEDED/.test(h.term) &&
        /DEAD ROUTE/.test(h.term) &&
        /imp-97481 proves the primorial/.test(h.mechanism) &&
        /-0\.388874/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97494-honesty-gate-no-qed-and-supersession-recorded',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses ' +
      'imp-97461, and explicitly records the imp-97544 supersession so no future consumer treats ' +
      'the "lower edge survives" claim as current.',
    holds: () =>
      IMP97494_QUARTER_CEILING_TWO_EDGE_SURVIVAL_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      IMP97494_QUARTER_CEILING_TWO_EDGE_SURVIVAL_GLOSSARY_HEADWORD.supersededBy === 'imp-97544' &&
      /NO QED/.test(IMP97494_QUARTER_CEILING_TWO_EDGE_SURVIVAL_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97494_QUARTER_CEILING_TWO_EDGE_SURVIVAL_GLOSSARY_HEADWORD.verdict) &&
      /DEAD ROUTE/.test(IMP97494_QUARTER_CEILING_TWO_EDGE_SURVIVAL_GLOSSARY_HEADWORD.verdict) &&
      IMP97494_QUARTER_CEILING_TWO_EDGE_SURVIVAL_GLOSSARY_HEADWORD.glosses === 'imp-97461',
  },
];

for (const assertion of IMP97494_QUARTER_CEILING_TWO_EDGE_SURVIVAL_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97494-quarter-ceiling-two-edge-survival-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
