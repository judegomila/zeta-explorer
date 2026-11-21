/**
 * @module imp-36161-duplicate-ticket-honest-status
 *
 * imp-36161 (content, sonnet-4-6, sonnet): honest-status finding that ticket imp-36161 itself
 * duplicates an already-completed ticket, imp-36142.
 *
 * FINDING. imp-36161 asked to "add a standalone honest-status note recording the imp-36096
 * finding that the joint (alpha,beta) W1-accumulator recovery basin is strongly NON-CONVEX and
 * NON-elliptical, and that the imp-36061 single-axis recovery edges UNDER-state the coupled
 * detuning margin by up to ~2.5x across the bulk of the plane". That exact note was already
 * delivered as imp-36142 (status: completed, completedByModel: sonnet-4-6) -- see
 * IMP36142_JOINT_BASIN_NON_CONVEX_SINGLE_AXIS_UNSAFE_HONEST_STATUS in
 * imp-36142-joint-basin-non-convex-single-axis-unsafe-honest-status.js, which imports the
 * identical imp-36096 source object verbatim, restates the identical non-convexity finding (the
 * joint basin bulges to u+v ~ 2.48/2.52 at the 10%/1% targets, non-convex and non-elliptical),
 * the identical ~2.5x under-statement of the imp-36061 single-axis edges, and the identical
 * run-time-monitor-unsafe consequence. imp-36161 is therefore a stale duplicate of imp-36142,
 * not new scope -- no new module is built here.
 *
 * WHY THIS DUPLICATE WAS SEEDED. Both tickets were seeded from the same imp-36096 source
 * measurement by the frontier-scout ticket generator, requesting the same "standalone
 * honest-status note restating the joint-basin non-convexity and single-axis under-statement"
 * deliverable in close paraphrase rather than describing two distinct presentation needs. This
 * module records the duplication so a reader landing on imp-36161 is pointed straight at
 * imp-36142 instead of a second copy of the same note.
 *
 * Meta finding only; no bound touched; no code path changed; NO QED. No refereed bound is changed.
 *
 * @see imp-36142-joint-basin-non-convex-single-axis-unsafe-honest-status.js (the already-completed note this ticket duplicates)
 * @see imp-36096-w1-accumulator-joint-recovery-contour.js (source measurement both tickets restate)
 * @see imp-36123-duplicate-ticket-honest-status.js (structural precedent for this duplicate-ticket pattern)
 */

const DUPLICATE_TICKET_ID = 'imp-36161';
const ORIGINAL_TICKET_ID = 'imp-36142';
const ORIGINAL_TICKET_STATUS = 'completed';

export const IMP36161_DUPLICATE_TICKET_HONEST_STATUS = {
  id: 'imp-36161',
  proofSection: 'audit',
  question:
    'Does imp-36161 request new scope, or does it duplicate an already-completed ticket?',
  verdictShort:
    'DUPLICATE OF imp-36142 (completed). The standalone honest-status note imp-36161 asks for -- ' +
    'restating the imp-36096 non-convex joint (alpha,beta) recovery basin and the imp-36061 ' +
    'single-axis under-statement by up to ~2.5x -- already exists as ' +
    'IMP36142_JOINT_BASIN_NON_CONVEX_SINGLE_AXIS_UNSAFE_HONEST_STATUS. No new module built; this ' +
    'module only records the duplication and cross-references the original.',
  duplicateTicketId: DUPLICATE_TICKET_ID,
  originalTicketId: ORIGINAL_TICKET_ID,
  originalTicketStatus: ORIGINAL_TICKET_STATUS,
  isRigorous: false,
  verdict:
    'AUDIT FINDING (not a measurement of a mathematical quantity). imp-36161 duplicates the ' +
    'already-completed imp-36142; no code change made here beyond recording the finding. ' +
    'Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36142-joint-basin-non-convex-single-axis-unsafe-honest-status.js (the completed original); ' +
    'imp-36096-w1-accumulator-joint-recovery-contour.js (shared source measurement).',
};

export const IMP36161_DUPLICATE_TICKET_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36161-duplicate-of-completed-original',
    description: 'imp-36161 is recorded as a duplicate of the completed imp-36142',
    holds: () =>
      IMP36161_DUPLICATE_TICKET_HONEST_STATUS.originalTicketId === 'imp-36142' &&
      IMP36161_DUPLICATE_TICKET_HONEST_STATUS.originalTicketStatus === 'completed',
  },
  {
    id: 'imp36161-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36161_DUPLICATE_TICKET_HONEST_STATUS.isRigorous === false &&
      /NO QED/.test(IMP36161_DUPLICATE_TICKET_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(IMP36161_DUPLICATE_TICKET_HONEST_STATUS.verdict),
  },
];

for (const a of IMP36161_DUPLICATE_TICKET_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36161-duplicate-ticket-honest-status assertion failed: ${a.id}`);
  }
}

export default IMP36161_DUPLICATE_TICKET_HONEST_STATUS;
