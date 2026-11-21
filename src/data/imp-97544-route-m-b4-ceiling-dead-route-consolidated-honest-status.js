/**
 * @fileoverview imp-97544 -- import-light CONSOLIDATED honest-status note for the Route-M "b/4
 * quarter-ceiling" line (|E1(b)| <= b/4 for squarefree b). This single banner supersedes the
 * stale "ceiling survives" framing left by imp-97466 and folds in every downstream result so no
 * future consumer has to reassemble the chain from five separate modules.
 *
 * THE CEILING IS DEAD. |E1(b)| <= b/4 is REFUTED, with explicit rigorously-verified witnesses:
 *   - imp-97481 proves the general-b surrogate closed form and shows the window limit
 *     surrogate([P0,Y]) -> -c e^{-gamma}/Prod_{p<P0}(1-1/p) is UNBOUNDED below (Mertens), so the
 *     lower edge T(b) >= -1/4 fails for min-prime P0 >= 101 -- the primorial is the SHALLOWEST
 *     window, not the extremizer imp-97432/97461 assumed.
 *   - imp-97496 names the first exact-sieve witness b* = Prod_{379<=p<=73,612,801} p
 *     (~31.97M digits, T(b*) = -0.25000000 < -1/4).
 *   - imp-97515 rigorizes the shallower P0=101 crossing (b_101, ~1.19 billion digits,
 *     T = -0.25025446), refuting the ticket premise that a smaller-omega witness exists there.
 *   - imp-97500 sharpens the search and finds the INTERIOR size-optimal witness at P0~1409
 *     (~17.82M digits, ~44% fewer digits than the P0=379 witness).
 *   - imp-97516 proves the breach is HARMLESS to the live program: E1(b) is only the
 *     sub-leading remainder of L1(b), entering F_arith at O(b log b) = o(phi(b) b) while
 *     F_arith = Theta(phi(b) b); kappa_arith = (3/2)C - 3/8 = 0.5704960511 is untouched.
 *
 * WHY THIS NOTE MATTERS. imp-97466 recorded (correctly, at the time) that the ceiling "survives"
 * MCM's refutation; imp-97481 later refuted the ceiling itself outright. This module is the
 * single up-to-date status pointer -- no future consumer should cite imp-97466's "survives"
 * framing, and imp-97494/imp-97510 (queued glossary/cohort tickets built on the same stale
 * premise) are SUPERSEDED by this consolidated note rather than needing separate execution.
 *
 * WHY A NOTE (not a re-derivation). Every verdict flag below is re-cited, never re-derived, from
 * the five source modules, each of which already carries its own self-executing assertions.
 *
 * @see imp-97481-route-m-quarter-ceiling-lower-edge-refuted-window-sets.js (the refutation)
 * @see imp-97496-route-m-quarter-ceiling-explicit-crossing-window.js (first explicit witness)
 * @see imp-97500-route-m-window-surrogate-descent-rate-min-b-crossing.js (size-optimal witness)
 * @see imp-97515-route-m-quarter-ceiling-p0-101-crossing-rigorous.js (rigorized P0=101 crossing)
 * @see imp-97516-route-m-quarter-edge-breach-vs-first-moment-companion.js (breach is harmless)
 * @see imp-97466-route-m-mcm-refuted-honest-status.js (superseded "survives" framing)
 * @see project_route_m_lower_companion_first_moment.md (memory: the still-live Route-M program)
 *
 * Ticket: imp-97544 (content, medium, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

import { IMP97481_VERDICT, IMP97481_SUBGAP } from './imp-97481-route-m-quarter-ceiling-lower-edge-refuted-window-sets.js';
import { IMP97496_VERDICT } from './imp-97496-route-m-quarter-ceiling-explicit-crossing-window.js';
import { IMP97500_VERDICT } from './imp-97500-route-m-window-surrogate-descent-rate-min-b-crossing.js';
import { IMP97515_VERDICT } from './imp-97515-route-m-quarter-ceiling-p0-101-crossing-rigorous.js';
import { IMP97516_VERDICT } from './imp-97516-route-m-quarter-edge-breach-vs-first-moment-companion.js';

export const IMP97544_STATUS = Object.freeze({
  ticket: 'imp-97544',
  sourceTickets: ['imp-97481', 'imp-97496', 'imp-97500', 'imp-97515', 'imp-97516'],
  supersedes: 'imp-97466 (stale "ceiling survives" framing)',
  ceilingRefuted: IMP97481_VERDICT.ceilingRefuted,
  lowerEdgeHolds: IMP97481_VERDICT.lowerEdgeHolds,
  explicitWitnessVerified: IMP97496_VERDICT.explicitWitnessVerified,
  minBIsInterior: IMP97500_VERDICT.minBIsInterior,
  witnessNamedRigorous: IMP97515_VERDICT.witnessNamedRigorous,
  e1IsBindingQuantity: IMP97516_VERDICT.e1IsBindingQuantity,
  kappaArithUnchanged: IMP97516_VERDICT.kappaArithUnchanged,
  residualSubgapId: IMP97481_SUBGAP.id,
  anyBoundMoved: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97544_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. CONSOLIDATED status: the Route-M b/4-ceiling ' +
  '(|E1(b)| <= b/4 for squarefree b) is a DEAD ROUTE -- refuted (imp-97481), with explicit ' +
  'witnesses at P0=379 (~32M digits, imp-97496), the rigorized P0=101 crossing (~1.19B digits, ' +
  'imp-97515), and the size-optimal interior witness at P0~1409 (~17.82M digits, imp-97500). The ' +
  'breach is harmless: E1(b) is not the binding quantity for kappa_arith (imp-97516) -- ' +
  'kappa_arith = 0.5704960511 is unchanged and no bound on Lambda moves. This note supersedes ' +
  'imp-97466’s now-stale "ceiling survives" framing; the ceiling was exploratory Route-M, ' +
  'load-bearing for nothing. RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97544_ASSERTIONS = [
  {
    id: 'imp97544-status-matches-committed-source-verdicts',
    holds: () =>
      IMP97544_STATUS.ceilingRefuted === IMP97481_VERDICT.ceilingRefuted &&
      IMP97544_STATUS.lowerEdgeHolds === IMP97481_VERDICT.lowerEdgeHolds &&
      IMP97544_STATUS.explicitWitnessVerified === IMP97496_VERDICT.explicitWitnessVerified &&
      IMP97544_STATUS.minBIsInterior === IMP97500_VERDICT.minBIsInterior &&
      IMP97544_STATUS.witnessNamedRigorous === IMP97515_VERDICT.witnessNamedRigorous &&
      IMP97544_STATUS.e1IsBindingQuantity === IMP97516_VERDICT.e1IsBindingQuantity &&
      IMP97544_STATUS.kappaArithUnchanged === IMP97516_VERDICT.kappaArithUnchanged &&
      IMP97544_STATUS.residualSubgapId === IMP97481_SUBGAP.id,
    why: 'this consolidated note must reproduce the exact verdict flags already established by the five source modules, not a re-derivation.',
  },
  {
    id: 'imp97544-honesty-gate-no-qed',
    holds: () =>
      IMP97544_STATUS.ceilingRefuted === true &&
      IMP97544_STATUS.lowerEdgeHolds === false &&
      IMP97544_STATUS.e1IsBindingQuantity === false &&
      IMP97544_STATUS.kappaArithUnchanged === true &&
      IMP97544_STATUS.anyBoundMoved === false &&
      IMP97544_STATUS.operatorPositivityProved === false &&
      IMP97544_STATUS.rhResolved === false &&
      IMP97544_STATUS.qed === false &&
      /DEAD ROUTE/.test(IMP97544_HONEST_BANNER) &&
      /NO QED/.test(IMP97544_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97544_HONEST_BANNER) &&
      /RH open/.test(IMP97544_HONEST_BANNER),
    why: 'documentation only: ceiling refuted, lower edge fails, E1 not binding, kappa_arith unchanged, no bound claimed moved, no operator positivity, no QED, no-refereed-bound-change line present, RH stated open.',
  },
];

for (const assertion of IMP97544_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97544-route-m-b4-ceiling-dead-route-consolidated-honest-status assertion failed: ${assertion.id}`);
  }
}

export default { status: IMP97544_STATUS, banner: IMP97544_HONEST_BANNER };
