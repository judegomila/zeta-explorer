/**
 * @module imp-36162-duplicate-ticket-honest-status
 *
 * imp-36162 (ux, sonnet-4-6, sonnet): honest-status finding that ticket imp-36162 itself
 * duplicates an already-completed ticket, imp-36145.
 *
 * FINDING. imp-36162 asked to "add an import-light viz-data module (baked literals, no heavy
 * imports) for the imp-36096 joint (alpha,beta) recovery contour, exposing the normalized (u,v)
 * lobe points for the 10% and 1% targets". That exact module was already delivered as imp-36145
 * (status: completed, completedByModel: sonnet-4-6) -- see
 * IMP36145_JOINT_RECOVERY_CONTOUR_VIZ_DATA in imp-36145-joint-recovery-contour-viz-data.js, which
 * imports the identical imp-36096 source object, re-exports the identical normalized (u,v) point
 * sets for both the 10% (jointContour10) and 1% (jointContour1) targets verbatim, and additionally
 * bakes axis-diamond (u+v=1) and quarter-ellipse (u^2+v^2=1) reference curves a viz page needs.
 * imp-36162 is therefore a stale duplicate of imp-36145, not new scope -- no new module is built
 * here.
 *
 * WHY THIS DUPLICATE WAS SEEDED. imp-36162's own rationale field ("36104/36122 cover imp-36062,
 * not imp-36096") checked only two unrelated tickets and missed imp-36145, which does cover
 * imp-36096 -- the frontier-scout ticket generator's duplicate check was incomplete at seed time.
 * This module records the duplication so a reader landing on imp-36162 is pointed straight at
 * imp-36145 instead of a second copy of the same viz-data module.
 *
 * Meta finding only; no bound touched; no code path changed; NO QED. No refereed bound is changed.
 *
 * @see imp-36145-joint-recovery-contour-viz-data.js (the already-completed module this ticket duplicates)
 * @see imp-36096-w1-accumulator-joint-recovery-contour.js (source measurement both tickets restate)
 * @see imp-36161-duplicate-ticket-honest-status.js (structural precedent for this duplicate-ticket pattern)
 */

const DUPLICATE_TICKET_ID = 'imp-36162';
const ORIGINAL_TICKET_ID = 'imp-36145';
const ORIGINAL_TICKET_STATUS = 'completed';

export const IMP36162_DUPLICATE_TICKET_HONEST_STATUS = {
  id: 'imp-36162',
  proofSection: 'audit',
  question:
    'Does imp-36162 request new scope, or does it duplicate an already-completed ticket?',
  verdictShort:
    'DUPLICATE OF imp-36145 (completed). The import-light viz-data module imp-36162 asks for -- ' +
    'exposing the normalized (u,v) joint recovery contour points for the imp-36096 10% and 1% ' +
    'targets -- already exists as IMP36145_JOINT_RECOVERY_CONTOUR_VIZ_DATA. No new module built; ' +
    'this module only records the duplication and cross-references the original.',
  duplicateTicketId: DUPLICATE_TICKET_ID,
  originalTicketId: ORIGINAL_TICKET_ID,
  originalTicketStatus: ORIGINAL_TICKET_STATUS,
  isRigorous: false,
  verdict:
    'AUDIT FINDING (not a measurement of a mathematical quantity). imp-36162 duplicates the ' +
    'already-completed imp-36145; no code change made here beyond recording the finding. ' +
    'Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36145-joint-recovery-contour-viz-data.js (the completed original); ' +
    'imp-36096-w1-accumulator-joint-recovery-contour.js (shared source measurement).',
};

export const IMP36162_DUPLICATE_TICKET_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36162-duplicate-of-completed-original',
    description: 'imp-36162 is recorded as a duplicate of the completed imp-36145',
    holds: () =>
      IMP36162_DUPLICATE_TICKET_HONEST_STATUS.originalTicketId === 'imp-36145' &&
      IMP36162_DUPLICATE_TICKET_HONEST_STATUS.originalTicketStatus === 'completed',
  },
  {
    id: 'imp36162-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36162_DUPLICATE_TICKET_HONEST_STATUS.isRigorous === false &&
      /NO QED/.test(IMP36162_DUPLICATE_TICKET_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(IMP36162_DUPLICATE_TICKET_HONEST_STATUS.verdict),
  },
];

for (const a of IMP36162_DUPLICATE_TICKET_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36162-duplicate-ticket-honest-status assertion failed: ${a.id}`);
  }
}

export default IMP36162_DUPLICATE_TICKET_HONEST_STATUS;
