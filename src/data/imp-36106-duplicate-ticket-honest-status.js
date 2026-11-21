/**
 * @module imp-36106-duplicate-ticket-honest-status
 *
 * imp-36106 (content, sonnet-4-6, sonnet): honest-status finding that ticket imp-36106 itself
 * duplicates an already-completed ticket, imp-36124.
 *
 * FINDING. imp-36106 asked to "add a standalone honest-status MEASUREMENT-ONLY note recording
 * the imp-36062 finding that the KBN-vs-Kahan separation is a SOFT rounding-gated threshold
 * characterized by N (bit-identical below N~34000, intermittent 34000-40000, persistent above)
 * NOT by a hard conditioning-kappa cutoff (kappa is non-monotone rung-to-rung near onset)". That
 * exact note was already delivered as imp-36124 (status: completed, completedByModel:
 * sonnet-4-6) -- see IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS in
 * imp-36124-kbn-kahan-soft-onset-honest-status.js, which restates the identical N~34000 onset,
 * the identical kappa non-monotone pair (361.5 at N=34000 &lt; 362.8 at N=33000), and the
 * identical 34000-40000 intermittency band. imp-36106 is therefore a stale duplicate of
 * imp-36124, not new scope -- no new derivation is made here.
 *
 * WHY THIS DUPLICATE WAS SEEDED. Both tickets were seeded from the same imp-36062 source
 * finding by the frontier-scout ticket generator, one titled around the "soft-onset /
 * N-not-kappa" framing (imp-36124) and one around the "SOFT rounding-gated threshold ...
 * NOT ... hard conditioning-kappa cutoff" framing (imp-36106) -- close paraphrases of the same
 * underlying imp-36062 result rather than two distinct facts. This module records the
 * duplication so a reader landing on imp-36106 is pointed straight at imp-36124 instead of a
 * second copy of the same restatement.
 *
 * Meta finding only; no bound touched; no code path changed; NO QED. No refereed bound is changed.
 *
 * @see imp-36124-kbn-kahan-soft-onset-honest-status (the already-completed note this ticket duplicates)
 * @see imp-36062-kbn-kahan-separation-onset.js (source finding both tickets restate)
 * @see imp-36128-duplicate-ticket-honest-status.js (structural precedent for this duplicate-ticket pattern)
 */

const DUPLICATE_TICKET_ID = 'imp-36106';
const ORIGINAL_TICKET_ID = 'imp-36124';
const ORIGINAL_TICKET_STATUS = 'completed';

export const IMP36106_DUPLICATE_TICKET_HONEST_STATUS = {
  id: 'imp-36106',
  proofSection: 'audit',
  question:
    'Does imp-36106 request new scope, or does it duplicate an already-completed ticket?',
  verdictShort:
    'DUPLICATE OF imp-36124 (completed). The standalone honest-status note imp-36106 asks for ' +
    '-- restating the imp-36062 SOFT/N-keyed (not kappa-keyed) separation-onset finding -- ' +
    'already exists as IMP36124_KBN_KAHAN_SOFT_ONSET_HONEST_STATUS. No new note derived; this ' +
    'module only records the duplication and cross-references the original.',
  duplicateTicketId: DUPLICATE_TICKET_ID,
  originalTicketId: ORIGINAL_TICKET_ID,
  originalTicketStatus: ORIGINAL_TICKET_STATUS,
  isRigorous: false,
  verdict:
    'AUDIT FINDING (not a measurement of a mathematical quantity). imp-36106 duplicates the ' +
    'already-completed imp-36124; no code change made here beyond recording the finding. ' +
    'Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36124-kbn-kahan-soft-onset-honest-status (the completed original); ' +
    'imp-36062-kbn-kahan-separation-onset.js (shared source finding).',
};

export const IMP36106_DUPLICATE_TICKET_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36106-duplicate-of-completed-original',
    description: 'imp-36106 is recorded as a duplicate of the completed imp-36124',
    holds: () =>
      IMP36106_DUPLICATE_TICKET_HONEST_STATUS.originalTicketId === 'imp-36124' &&
      IMP36106_DUPLICATE_TICKET_HONEST_STATUS.originalTicketStatus === 'completed',
  },
  {
    id: 'imp36106-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36106_DUPLICATE_TICKET_HONEST_STATUS.isRigorous === false &&
      /NO QED/.test(IMP36106_DUPLICATE_TICKET_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(IMP36106_DUPLICATE_TICKET_HONEST_STATUS.verdict),
  },
];

for (const a of IMP36106_DUPLICATE_TICKET_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36106-duplicate-ticket-honest-status assertion failed: ${a.id}`);
  }
}

export default IMP36106_DUPLICATE_TICKET_HONEST_STATUS;
