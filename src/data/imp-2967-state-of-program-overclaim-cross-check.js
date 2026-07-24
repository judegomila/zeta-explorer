/**
 * @module imp-2967-state-of-program-overclaim-cross-check
 * @description imp-2967: freshness/consistency assertion between
 * STATE_OF_PROGRAM_TRUTHS and the overclaim-ledger.
 *
 * Three invariants enforced at build time:
 *
 *   1. The peer-reviewed truth entry still names Platt-Trudgian Λ≤0.2.
 *
 *   2. The repository theorem entry records Λ≤0.1787854 while denying
 *      publication, peer review, and an RH conclusion.
 *
 *   3. Every imp-XXXX id mentioned in the REFUTED badge entry of TRUTHS
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
    id: 'imp-2967-peer-reviewed-benchmark-badge-exists',
    holds: () => (
      STATE_OF_PROGRAM_TRUTHS.filter(
        t => t.badge === 'PEER-REVIEWED BENCHMARK',
      ).length === 1
    ),
    why: 'TRUTHS must have exactly one peer-reviewed benchmark entry',
  },
  {
    id: 'imp-2967-peer-reviewed-benchmark-names-platt-trudgian',
    holds: () => {
      const entry = STATE_OF_PROGRAM_TRUTHS.find(
        t => t.badge === 'PEER-REVIEWED BENCHMARK',
      );
      if (!entry) return false;
      const text = entry.title + ' ' + entry.body;
      return text.includes('Platt-Trudgian') && text.includes('0.2');
    },
    why: 'The literature benchmark entry must still cite Platt-Trudgian Λ≤0.2 as peer reviewed',
  },
  {
    id: 'imp-2967-repository-theorem-has-honest-external-grade',
    holds: () => {
      const entry = STATE_OF_PROGRAM_TRUTHS.find(t => t.badge === 'REPOSITORY THEOREM');
      if (!entry) return false;
      const text = (entry.title + ' ' + entry.body).toLowerCase();
      return (
        text.includes('0.1787854') &&
        text.includes('computer-assisted') &&
        text.includes('unpublished') &&
        text.includes('unpeer-reviewed') &&
        text.includes('does not prove rh')
      );
    },
    why:
      'The new theorem must be visible without implying publication, peer review, or a proof of RH',
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
