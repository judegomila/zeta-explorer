/**
 * @module imp-36167-duplicate-ticket-honest-status
 *
 * imp-36167 (ux, sonnet-4-6, sonnet): honest-status finding that ticket imp-36167 itself
 * duplicates an already-completed ticket, imp-36144.
 *
 * FINDING. imp-36167 asked to "add an import-light viz-data module (baked literals, no heavy
 * imports) for the imp-36095 KBN-vs-classic-Kahan intermittency band ladder across N in
 * [34000,40000] (25 rungs: N, kappa, Kahan error, KBN error, separated verdict)". That exact
 * module was already delivered as imp-36144 (status: completed, completedByModel: sonnet-4-6)
 * -- see IMP36144_INTERMITTENCY_LADDER in imp-36144-kbn-kahan-intermittency-band-viz-data.js,
 * which bakes the identical 25-rung ladder (N, kappa, kahan, kbn, separated) across
 * [34000, 40000] step 250, with the identical 15-separated/10-identical split, the identical
 * 34250-35000 four-rung bit-identical block, and the identical N=39000 last-identical /
 * N~39250 persistence-onset markers. imp-36167 is therefore a stale duplicate of imp-36144,
 * not new scope -- no new module is built here.
 *
 * WHY THIS DUPLICATE WAS SEEDED. imp-36167's own rationale field ("imp-36095 intermittency-band
 * table has no import-light viz-data companion") never checked the queue for imp-36144, which
 * already delivers exactly that companion -- the frontier-scout ticket generator's duplicate
 * check missed it at seed time. This module records the duplication so a reader landing on
 * imp-36167 is pointed straight at imp-36144 instead of a second copy of the same viz-data
 * module.
 *
 * Meta finding only; no bound touched; no code path changed; NO QED. No refereed bound is changed.
 *
 * @see imp-36144-kbn-kahan-intermittency-band-viz-data.js (the already-completed module this ticket duplicates)
 * @see imp-36095-kbn-kahan-intermittency-band.js (source measurement both tickets restate)
 * @see imp-36162-duplicate-ticket-honest-status.js (structural precedent for this duplicate-ticket pattern)
 */

const DUPLICATE_TICKET_ID = 'imp-36167';
const ORIGINAL_TICKET_ID = 'imp-36144';
const ORIGINAL_TICKET_STATUS = 'completed';

export const IMP36167_DUPLICATE_TICKET_HONEST_STATUS = {
  id: 'imp-36167',
  proofSection: 'audit',
  question:
    'Does imp-36167 request new scope, or does it duplicate an already-completed ticket?',
  verdictShort:
    'DUPLICATE OF imp-36144 (completed). The import-light viz-data module imp-36167 asks for -- ' +
    'baking the 25-rung imp-36095 KBN-vs-Kahan intermittency ladder (N, kappa, Kahan error, ' +
    'KBN error, separated verdict) across [34000,40000] -- already exists as ' +
    'IMP36144_INTERMITTENCY_LADDER. No new module built; this module only records the ' +
    'duplication and cross-references the original.',
  duplicateTicketId: DUPLICATE_TICKET_ID,
  originalTicketId: ORIGINAL_TICKET_ID,
  originalTicketStatus: ORIGINAL_TICKET_STATUS,
  isRigorous: false,
  verdict:
    'AUDIT FINDING (not a measurement of a mathematical quantity). imp-36167 duplicates the ' +
    'already-completed imp-36144; no code change made here beyond recording the finding. ' +
    'Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36144-kbn-kahan-intermittency-band-viz-data.js (the completed original); ' +
    'imp-36095-kbn-kahan-intermittency-band.js (shared source measurement).',
};

export const IMP36167_DUPLICATE_TICKET_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36167-duplicate-of-completed-original',
    description: 'imp-36167 is recorded as a duplicate of the completed imp-36144',
    holds: () =>
      IMP36167_DUPLICATE_TICKET_HONEST_STATUS.originalTicketId === 'imp-36144' &&
      IMP36167_DUPLICATE_TICKET_HONEST_STATUS.originalTicketStatus === 'completed',
  },
  {
    id: 'imp36167-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36167_DUPLICATE_TICKET_HONEST_STATUS.isRigorous === false &&
      /NO QED/.test(IMP36167_DUPLICATE_TICKET_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(IMP36167_DUPLICATE_TICKET_HONEST_STATUS.verdict),
  },
];

for (const a of IMP36167_DUPLICATE_TICKET_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36167-duplicate-ticket-honest-status assertion failed: ${a.id}`);
  }
}

export default IMP36167_DUPLICATE_TICKET_HONEST_STATUS;
