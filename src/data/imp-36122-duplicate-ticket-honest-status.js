/**
 * @module imp-36122-duplicate-ticket-honest-status
 *
 * imp-36122 (ux, sonnet-4-6, sonnet): honest-status finding that ticket imp-36122 itself
 * duplicates an already-completed ticket, imp-36104.
 *
 * FINDING. imp-36122 asked to "add an import-light viz-data module (baked literals, no heavy
 * imports) for the imp-36062 finer 11-rung KBN-vs-classic-Kahan separation-onset ladder over N
 * in [1000, 488602], showing per-N kappa, both normalized errors, and the KBN<Kahan
 * strict-separation flag". That exact module was already delivered as imp-36104 (status:
 * completed, completedByModel: sonnet-4-6) -- see IMP36104_SEPARATION_ONSET_VIZ_DATA in
 * imp-36104-kbn-kahan-separation-onset-viz-data.js, which bakes the identical 11-rung ladder
 * (N = 1000, 10000, 30000, 33000, 34000, 38000, 40000, 50000, 70000, 100000, 488602), the
 * identical per-N kappa/Kahan-error/KBN-error triples, and the identical
 * kbnStrictlyTighter flag at every rung, plus the identical N=34000 first-separation marker and
 * the identical ~0.96 -> ~0.08 KBN/Kahan ratio deepening. imp-36122 is therefore a stale
 * duplicate of imp-36104, not new scope -- no new viz-data module is derived here.
 *
 * WHY THIS DUPLICATE WAS SEEDED. Both tickets were seeded from the same imp-36062 source
 * measurement by the frontier-scout ticket generator, one titled around the "separation-onset
 * ladder: the 11-rung N/kappa/Kahan-error/KBN-error table" framing (imp-36104) and one around
 * the "finer 11-rung ... ladder ... per-N kappa, both normalized errors, and the KBN<Kahan
 * strict-separation flag" framing (imp-36122) -- close paraphrases of the same underlying
 * imp-36062 table rather than two distinct viz-data needs. This module records the duplication
 * so a reader landing on imp-36122 is pointed straight at imp-36104 instead of a second copy of
 * the same viz-data module.
 *
 * Meta finding only; no bound touched; no code path changed; NO QED. No refereed bound is changed.
 *
 * @see imp-36104-kbn-kahan-separation-onset-viz-data (the already-completed module this ticket duplicates)
 * @see imp-36062-kbn-kahan-separation-onset.js (source measurement both tickets restate)
 * @see imp-36106-duplicate-ticket-honest-status.js (structural precedent for this duplicate-ticket pattern)
 * @see imp-36107-duplicate-ticket-honest-status.js (structural precedent for this duplicate-ticket pattern)
 */

const DUPLICATE_TICKET_ID = 'imp-36122';
const ORIGINAL_TICKET_ID = 'imp-36104';
const ORIGINAL_TICKET_STATUS = 'completed';

export const IMP36122_DUPLICATE_TICKET_HONEST_STATUS = {
  id: 'imp-36122',
  proofSection: 'audit',
  question:
    'Does imp-36122 request new scope, or does it duplicate an already-completed ticket?',
  verdictShort:
    'DUPLICATE OF imp-36104 (completed). The import-light viz-data module imp-36122 asks for -- ' +
    'the imp-36062 finer 11-rung KBN-vs-classic-Kahan separation-onset ladder with per-N kappa, ' +
    'both normalized errors, and the strict-separation flag -- already exists as ' +
    'IMP36104_SEPARATION_ONSET_VIZ_DATA. No new module derived; this module only records the ' +
    'duplication and cross-references the original.',
  duplicateTicketId: DUPLICATE_TICKET_ID,
  originalTicketId: ORIGINAL_TICKET_ID,
  originalTicketStatus: ORIGINAL_TICKET_STATUS,
  isRigorous: false,
  verdict:
    'AUDIT FINDING (not a measurement of a mathematical quantity). imp-36122 duplicates the ' +
    'already-completed imp-36104; no code change made here beyond recording the finding. ' +
    'Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36104-kbn-kahan-separation-onset-viz-data (the completed original); ' +
    'imp-36062-kbn-kahan-separation-onset.js (shared source measurement).',
};

export const IMP36122_DUPLICATE_TICKET_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36122-duplicate-of-completed-original',
    description: 'imp-36122 is recorded as a duplicate of the completed imp-36104',
    holds: () =>
      IMP36122_DUPLICATE_TICKET_HONEST_STATUS.originalTicketId === 'imp-36104' &&
      IMP36122_DUPLICATE_TICKET_HONEST_STATUS.originalTicketStatus === 'completed',
  },
  {
    id: 'imp36122-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36122_DUPLICATE_TICKET_HONEST_STATUS.isRigorous === false &&
      /NO QED/.test(IMP36122_DUPLICATE_TICKET_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(IMP36122_DUPLICATE_TICKET_HONEST_STATUS.verdict),
  },
];

for (const a of IMP36122_DUPLICATE_TICKET_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36122-duplicate-ticket-honest-status assertion failed: ${a.id}`);
  }
}

export default IMP36122_DUPLICATE_TICKET_HONEST_STATUS;
