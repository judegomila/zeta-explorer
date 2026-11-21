/**
 * @module imp-97510-route-m-b4-ceiling-cohort-superseded-note
 * @fileoverview imp-97510 -- SUPERSEDED-TICKET NOTE (no new solve): imp-97510 asked for a meta
 * cohort-index note grouping the Route-M b/4-ceiling reduction-then-refutation chain
 * (imp-97422 -> imp-97432 -> imp-97461 -> imp-97481) as one dead-route story. That exact
 * consolidation was already delivered by imp-97544, which explicitly names imp-97510 as one of
 * the "queued glossary/cohort tickets built on the same stale premise... SUPERSEDED by this
 * consolidated note rather than needing separate execution" (see imp-97544 fileoverview,
 * paragraph "WHY THIS NOTE MATTERS").
 *
 * THE CHAIN (for the record, re-cited not re-derived):
 *   imp-97422 (proved the b/4-ceiling under a primorial-extremizer premise)
 *     -> imp-97432 (MCM refutation attempt; concluded the ceiling SURVIVES via that premise)
 *       -> imp-97461 (restated survival without full MCM scope)
 *         -> imp-97481 (RESULT 5: REFUTED the primorial-extremizer premise itself -- the
 *            primorial P0=2 is the SHALLOWEST window, not the deepest; window sets
 *            [P0,Y] with P0>=101 sink unboundedly deeper) -- the whole survival conclusion
 *            was built on a now-false premise, so the ceiling is a DEAD ROUTE.
 * imp-97544 folds this chain plus every downstream witness/harmlessness result
 * (imp-97496, imp-97500, imp-97515, imp-97516) into one consolidated status module and honest
 * banner, and is the correct citation target for any future consumer.
 *
 * NO NEW WORK PERFORMED HERE: this note only records the ticket-level supersession so imp-97510
 * is not re-attempted as a separate cohort-index build. Nothing in the verified ledger moves;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97544-route-m-b4-ceiling-dead-route-consolidated-honest-status.js (the consolidated note this defers to)
 * @see imp-97509-route-m-quarter-ceiling-correction-honest-status.js (the earlier, narrower correction note)
 *
 * Ticket: imp-97510 (meta, low, sonnet-4-6). Reconciliation only; no bound on Lambda moves; NO QED.
 */

import { IMP97544_STATUS, IMP97544_HONEST_BANNER } from './imp-97544-route-m-b4-ceiling-dead-route-consolidated-honest-status.js';

export const IMP97510_VERDICT = Object.freeze({
  ticket: 'imp-97510',
  question:
    'add a meta cohort-index note grouping the Route-M b/4-ceiling reduction-then-refutation chain ' +
    '(imp-97422 -> 97432 -> 97461 -> 97481) as one dead-route story.',
  answer:
    'already delivered by imp-97544, which names this ticket explicitly as superseded rather than ' +
    'needing separate execution; this note only records that supersession.',
  chain: ['imp-97422', 'imp-97432', 'imp-97461', 'imp-97481'],
  supersededBy: 'imp-97544',
  newSolvePerformed: false,
  ceilingRefuted: IMP97544_STATUS.ceilingRefuted,
  anyBoundMoved: IMP97544_STATUS.anyBoundMoved,
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP97510_VERDICT.supersededBy === 'imp-97544' &&
    IMP97510_VERDICT.newSolvePerformed === false &&
    IMP97510_VERDICT.ceilingRefuted === true &&
    IMP97510_VERDICT.anyBoundMoved === false &&
    IMP97510_VERDICT.qed === false &&
    /DEAD ROUTE/.test(IMP97544_HONEST_BANNER) &&
    /NO QED/.test(IMP97544_HONEST_BANNER)
  )
) {
  throw new Error(
    'imp-97510-route-m-b4-ceiling-cohort-superseded-note assertion FAILED: must reproduce imp-97544 ' +
      'verdict flags and cite the consolidated dead-route banner.'
  );
}

export default IMP97510_VERDICT;
