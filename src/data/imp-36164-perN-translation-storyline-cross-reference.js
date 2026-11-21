/**
 * @module imp-36164-perN-translation-storyline-cross-reference
 * @fileoverview imp-36164 -- read-only cross-reference NARRATIVE assembling the
 *   full G5-perN-translation storyline for a reader who lands on any one of its
 *   three constituent modules without the others: (1) the Step-3 UNCONDITIONAL
 *   lim-sup (imp-341/imp-344), (2) the imp-36082 explicit Route-B per-N rate
 *   r(N) FORM and its bridge-consumability verdict, (3) the imp-36045 three-route
 *   readiness ranking (C > B > A), and (4) the OPEN Step-4 E(N) bridge
 *   (G6_polymath15_bridge, imp-345) that the per-N translation is meant to feed.
 *   Assembly / cross-reference ONLY: derives nothing new, closes nothing,
 *   discharges no gap, respects the imp-2519 no-overclaim guard, NO QED.
 *
 *   THE ARC (imports each stage verbatim from its source module)
 *   --------------------------------------------------------------
 *   Stage 1 -- DERIVED, unconditional: Step-3 lim sup_{N->infty} |t_c(N)| <= 0
 *   (imp-341 Koksma-Hlawka + imp-344 surfacing), no GUE input.
 *   Stage 2 -- DERIVED, unconditional: imp-36082 composes the Koksma-Hlawka
 *   discrepancy D(N) through the imp-354 Whitham Holder-1/2 fold catastrophe to
 *   get the EXPLICIT per-N rate r(N) = C_prime sqrt(log gamma_N) N^{-1/4}. This
 *   rate is genuinely per-N, unconditional, and vanishing.
 *   Stage 3 -- OPEN (the blocker): r(N) bounds the shock-time DEVIATION
 *   |t_c(m_N) - t_c(m_infinity)|, not the ABSOLUTE |t_c(N)| the Step-4 E(N)
 *   bridge (imp-345, G6_polymath15_bridge) needs. Converting deviation ->
 *   absolute needs a per-N-usable anchor on t_c(m_infinity) that re-imports
 *   local-law (GUE/ESY) rigidity -- exactly what Route B was engineered to
 *   avoid. Status: CONSUMABLE-MODULO-ANCHOR.
 *   Stage 4 -- DERIVED (a ranking, not a closure): imp-36045 independently
 *   ranks all three candidate routes to G5-perN-translation by
 *   readiness-to-usable-unconditional-per-N as C > B > A, precisely BECAUSE
 *   Route B (this arc) supplies the unconditional source but is farthest from a
 *   usable per-N rate -- consistent with, and explaining, the Stage-3 blocker.
 *
 *   WHAT IS DERIVED VS STILL-OPEN (the clarification this note exists to state)
 *   ------------------------------------------------------------------------
 *   DERIVED: the Step-3 lim-sup: the Route-B discrepancy bound D(N); the
 *   explicit closed-form rate r(N); the imp-36045 cross-route ranking C > B > A.
 *   STILL OPEN: the per-N translation itself (G5-perN-translation); the finite-N
 *   anchor on t_c(m_infinity); the E(N) bridge's ability to consume any Route-B
 *   rate absolutely. None of the DERIVED facts above discharge the OPEN ones;
 *   the arc runs from an unconditional asymptotic statement to an explicit but
 *   not-yet-bridge-usable per-N rate, with the missing ingredient named
 *   precisely (an anchor, not a rate).
 *
 *   @see src/data/imp-36082-routeB-perN-rate-form-and-bridge-consumability.js (Stage 2/3 source: r(N) derivation + consumability verdict)
 *   @see src/data/imp-36045-perN-translation-route-readiness-assessment.js (Stage 4 source: C > B > A ranking)
 *   @see src/data/imp-36147-routeB-consumable-modulo-anchor-honest-status.js (restates the Stage-3 verdict alone; this module adds the Stage-1/4 arc + derived-vs-open list)
 *   @see src/data/lambda-polymath15-bridge.js (imp-345 G6_polymath15_bridge, the Step-4 E(N) bridge this arc feeds)
 *   @see src/data/lambda-roadmap.js (G5-perN-translation obligation, status OPEN)
 *
 *   Ticket: imp-36164 (content, medium). Note only; imports source verdicts
 *   verbatim; changes no bound; NO QED; no refereed bound is changed.
 */

import { IMP36082_ROUTEB_PERN_RATE_FORM_AND_BRIDGE_CONSUMABILITY } from './imp-36082-routeB-perN-rate-form-and-bridge-consumability.js';

const ROUTEB_SOURCE = IMP36082_ROUTEB_PERN_RATE_FORM_AND_BRIDGE_CONSUMABILITY;

export const IMP36164_PERN_TRANSLATION_STORYLINE_CROSS_REFERENCE = Object.freeze({
  id: 'imp-36164',
  title:
    'Cross-reference narrative: the G5-perN-translation storyline from the Step-3 unconditional lim-sup, ' +
    'through the imp-36082 explicit Route-B rate r(N) and its bridge-consumability blocker, to the imp-36045 ' +
    'three-route ranking (C > B > A) -- clarifying which per-N facts are derived vs still-open',

  storyline: Object.freeze([
    Object.freeze({
      stage: 1,
      name: 'Step-3 unconditional lim-sup',
      state: 'DERIVED',
      statement:
        'lim sup_{N->infty} |t_c(N)| <= 0, from imp-341 Koksma-Hlawka on the empirical Stieltjes transform ' +
        '(only Selberg |S(T)| input, NO GUE) plus imp-344 surfacing.',
      source: 'imp-341 / imp-344',
    }),
    Object.freeze({
      stage: 2,
      name: 'Explicit Route-B per-N rate r(N)',
      state: 'DERIVED',
      statement:
        'imp-36082 composes the Koksma-Hlawka discrepancy D(N) through the imp-354 Whitham Holder-1/2 fold ' +
        'catastrophe: r(N) = ' + ROUTEB_SOURCE.rateForms.deviation_rate_rN + '. Genuinely per-N, unconditional, ' +
        'vanishing.',
      source: 'imp-36082',
    }),
    Object.freeze({
      stage: 3,
      name: 'Bridge-consumability blocker',
      state: 'OPEN',
      statement:
        'r(N) bounds ' + ROUTEB_SOURCE.rateForms.bounds + '; the Step-4 E(N) bridge (imp-345, ' +
        'G6_polymath15_bridge) needs the ABSOLUTE bound instead. Missing ingredient: ' +
        ROUTEB_SOURCE.consumability.missingIngredient +
        ' Status: ' + ROUTEB_SOURCE.consumability.status + '.',
      source: 'imp-36082 (verdict) / imp-345 (the bridge this arc feeds)',
    }),
    Object.freeze({
      stage: 4,
      name: 'Cross-route ranking C > B > A',
      state: 'DERIVED (a ranking, not a closure)',
      statement:
        'imp-36045 ranks the three G5-perN-translation candidate routes by readiness-to-usable-unconditional-' +
        'per-N as C > B > A: Route C (density squeeze) closest, Route B (this arc, the unconditional lim-sup ' +
        'source) farthest from a usable per-N rate -- consistent with, and explaining, the Stage-3 blocker -- ' +
        'Route A permanently GUE-conditional (C_mb irreducible, imp-486).',
      source: 'imp-36045',
    }),
  ]),

  derivedVsOpen: Object.freeze({
    derived: Object.freeze([
      'Step-3 lim sup_{N->infty} |t_c(N)| <= 0 (unconditional)',
      'Route-B discrepancy bound D(N) (per-N, unconditional, vanishing)',
      'Explicit closed-form rate r(N) = C_prime sqrt(log gamma_N) N^{-1/4}',
      'Cross-route readiness ranking C > B > A (imp-36045)',
    ]),
    open: Object.freeze([
      'G5-perN-translation itself (roadmap obligation, status OPEN)',
      'A per-N-usable anchor on the limiting shock time t_c(m_infinity)',
      'Whether the Step-4 E(N) bridge can consume any Route-B rate as an absolute |t_c(N)| bound',
    ]),
    note:
      'None of the DERIVED facts discharge any of the OPEN ones; the arc runs from an unconditional asymptotic ' +
      'statement to an explicit but not-yet-bridge-usable per-N rate, with the missing ingredient named ' +
      'precisely as an anchor, not a missing rate.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    dischargesG5PerNTranslation: false,
    derivesAnythingNew: false,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'Read-only cross-reference narrative assembling the imp-341/344, imp-36082, and imp-36045 verdicts into ' +
      'one storyline plus an explicit derived-vs-open list. Imports each stage verbatim; derives nothing new; ' +
      'per-N translation stays OPEN; respects the imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP36164_PERN_TRANSLATION_STORYLINE_CROSS_REFERENCE_ASSERTIONS = [
  {
    id: 'imp36164-storyline-has-four-stages-in-order',
    why: 'The arc must record exactly the four stages (lim-sup, rate, blocker, ranking) in narrative order.',
    holds: () => {
      const s = IMP36164_PERN_TRANSLATION_STORYLINE_CROSS_REFERENCE.storyline;
      return (
        s.length === 4 &&
        s[0].stage === 1 && s[1].stage === 2 && s[2].stage === 3 && s[3].stage === 4
      );
    },
  },
  {
    id: 'imp36164-derived-vs-open-states-correct',
    why: 'Stages 1, 2, and 4 must be marked DERIVED and stage 3 (the blocker) must be marked OPEN -- flipping ' +
         'any of these would misrepresent which facts are settled.',
    holds: () => {
      const s = IMP36164_PERN_TRANSLATION_STORYLINE_CROSS_REFERENCE.storyline;
      return (
        /DERIVED/.test(s[0].state) &&
        /DERIVED/.test(s[1].state) &&
        s[2].state === 'OPEN' &&
        /DERIVED/.test(s[3].state)
      );
    },
  },
  {
    id: 'imp36164-blocker-matches-source-verdict',
    why: 'The Stage-3 blocker statement must reproduce the imp-36082 source consumability status verbatim ' +
         '(CONSUMABLE-MODULO-ANCHOR), not a re-derived or drifted paraphrase.',
    holds: () =>
      ROUTEB_SOURCE.consumability.status === 'CONSUMABLE-MODULO-ANCHOR' &&
      IMP36164_PERN_TRANSLATION_STORYLINE_CROSS_REFERENCE.storyline[2].statement.includes(
        ROUTEB_SOURCE.consumability.status,
      ),
  },
  {
    id: 'imp36164-derived-vs-open-lists-nonempty-and-disjoint',
    why: 'The derived and open lists must both be non-empty and share no identical entry, or the ' +
         'derived-vs-open clarification this ticket exists to provide would be vacuous or contradictory.',
    holds: () => {
      const d = IMP36164_PERN_TRANSLATION_STORYLINE_CROSS_REFERENCE.derivedVsOpen;
      const overlap = d.derived.some((x) => d.open.includes(x));
      return d.derived.length > 0 && d.open.length > 0 && !overlap;
    },
  },
  {
    id: 'imp36164-honest-no-closure-no-qed',
    why: 'Mandatory honesty: an ASSEMBLY note that closes NOTHING, discharges no gap, keeps per-N translation ' +
         'OPEN, carries NO RH verdict, no refereed bound is changed. If any flip the module over-claims.',
    holds: () => {
      const h = IMP36164_PERN_TRANSLATION_STORYLINE_CROSS_REFERENCE.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.dischargesG5PerNTranslation === false &&
        h.derivesAnythingNew === false &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36164_PERN_TRANSLATION_STORYLINE_CROSS_REFERENCE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36164-perN-translation-storyline-cross-reference assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36164_PERN_TRANSLATION_STORYLINE_CROSS_REFERENCE;
