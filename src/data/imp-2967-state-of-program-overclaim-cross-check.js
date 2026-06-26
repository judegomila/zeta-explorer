/**
 * @module imp-2967-state-of-program-overclaim-cross-check
 * @description imp-2967: freshness/consistency assertion between
 * STATE_OF_PROGRAM_TRUTHS and the overclaim-ledger.
 *
 * Two invariants enforced at build time:
 *
 *   1. The RIGOROUS SOTA truth entry still names Platt-Trudgian Λ≤0.2
 *      (prevents silent drift back to an overclaim headline).
 *
 *   2. Every imp-XXXX id mentioned in the REFUTED badge entry of TRUTHS
 *      exists in CAUGHT_OVERCLAIMS with a non-active addressed status
 *      (WITHDRAWN / CORRECTED / REGRADED / RETRACTED / DOWNGRADED).
 *      Guarantees the canonical honesty page cannot name an overclaim id
 *      that the ledger has not registered and addressed.
 *
 * Both imports are intentionally light: state-of-program-truths.js has
 * zero transitive imports; overclaim-ledger.js imports only two small
 * data-only modules with no zeros-bundle dependency.
 */

import { STATE_OF_PROGRAM_TRUTHS } from './state-of-program-truths.js';
import { CAUGHT_OVERCLAIMS } from './overclaim-ledger.js';

const ADDRESSED_STATUSES = new Set([
  'WITHDRAWN', 'CORRECTED', 'REGRADED', 'RETRACTED', 'DOWNGRADED',
]);

function impIdsIn(text) {
  return (text.match(/imp-\d+/g) || []);
}

export const IMP_2967_STATE_OVERCLAIM_CROSS_CHECK_ASSERTIONS = [
  {
    id: 'imp-2967-rigorous-sota-badge-exists',
    holds: () => STATE_OF_PROGRAM_TRUTHS.filter(t => t.badge === 'RIGOROUS SOTA').length === 1,
    why: 'TRUTHS must have exactly one RIGOROUS SOTA entry — removing or renaming it silently strips the honest floor',
  },
  {
    id: 'imp-2967-rigorous-sota-names-platt-trudgian',
    holds: () => {
      const entry = STATE_OF_PROGRAM_TRUTHS.find(t => t.badge === 'RIGOROUS SOTA');
      if (!entry) return false;
      const text = entry.title + ' ' + entry.body;
      return text.includes('Platt-Trudgian') && text.includes('0.2');
    },
    why: "RIGOROUS SOTA badge text must still cite Platt-Trudgian Λ≤0.2 as the rigorous floor; drift to a different claim would re-introduce the overclaim this entry was written to prevent",
  },
  {
    id: 'imp-2967-refuted-badge-entry-exists',
    holds: () => STATE_OF_PROGRAM_TRUTHS.filter(t => t.badge === 'REFUTED').length === 1,
    why: 'TRUTHS must have exactly one REFUTED entry listing the caught overclaims',
  },
  {
    id: 'imp-2967-refuted-imp-ids-in-ledger',
    holds: () => {
      const entry = STATE_OF_PROGRAM_TRUTHS.find(t => t.badge === 'REFUTED');
      if (!entry) return false;
      const ids = impIdsIn(entry.title + ' ' + entry.body);
      const ledgerMap = new Map(CAUGHT_OVERCLAIMS.map(c => [c.id, c]));
      return ids.every(id => {
        const oc = ledgerMap.get(id);
        return oc !== undefined && ADDRESSED_STATUSES.has(oc.status);
      });
    },
    why: 'Every imp-id named in the REFUTED TRUTHS entry must exist in the overclaim ledger with an addressed status; a mismatch means the honesty page references an unregistered or still-active overclaim',
  },
];
