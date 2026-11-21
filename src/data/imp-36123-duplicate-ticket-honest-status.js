/**
 * @module imp-36123-duplicate-ticket-honest-status
 *
 * imp-36123 (ux, sonnet-4-6, sonnet): honest-status finding that ticket imp-36123 itself
 * duplicates an already-completed ticket, imp-36105.
 *
 * FINDING. imp-36123 asked to "add an import-light viz-data module (baked literals, no heavy
 * imports) for the imp-36061 two-axis W1 accumulator-ratio recovery-width, showing the
 * alpha-axis edges (|delta|~0.560/0.611 rad) and beta-axis edges (beta~3.19/3.32) against the
 * imp-35812 baseline and the imp-35991 r&lt;1e-2 basin edge". That exact module was already
 * delivered as imp-36105 (status: completed, completedByModel: sonnet-4-6) -- see
 * IMP36105_AXIS_EDGES / IMP36105_RECOVERY_WIDTH_VIZ_DATA in
 * imp-36105-recovery-detuning-width-viz-data.js, which bakes the identical alpha edges
 * (0.56 rad / 0.611 rad), the identical beta edges (3.19 / 3.32), the identical imp-35991 basin
 * edges (0.0356 / 0.269) and imp-35812 baseline detunings (0.6180339887498949 / 2.3999632297286533)
 * used as comparison series, and the identical ~15.7x / ~11.9x widening factors. imp-36123 is
 * therefore a stale duplicate of imp-36105, not new scope -- no new module is built here.
 *
 * WHY THIS DUPLICATE WAS SEEDED. Both tickets were seeded from the same imp-36061 source
 * measurement by the frontier-scout ticket generator, requesting the same "two-axis recovery-width
 * viz-data module against the imp-35812 baseline and imp-35991 basin edge" deliverable in close
 * paraphrase rather than describing two distinct presentation needs. This module records the
 * duplication so a reader landing on imp-36123 is pointed straight at imp-36105 instead of a
 * second copy of the same chart data.
 *
 * Meta finding only; no bound touched; no code path changed; NO QED. No refereed bound is changed.
 *
 * @see imp-36105-recovery-detuning-width-viz-data.js (the already-completed module this ticket duplicates)
 * @see imp-36061-w1-accumulator-recovery-detuning-width.js (source measurement both tickets restate)
 * @see imp-36107-duplicate-ticket-honest-status.js (structural precedent for this duplicate-ticket pattern)
 */

const DUPLICATE_TICKET_ID = 'imp-36123';
const ORIGINAL_TICKET_ID = 'imp-36105';
const ORIGINAL_TICKET_STATUS = 'completed';

export const IMP36123_DUPLICATE_TICKET_HONEST_STATUS = {
  id: 'imp-36123',
  proofSection: 'audit',
  question:
    'Does imp-36123 request new scope, or does it duplicate an already-completed ticket?',
  verdictShort:
    'DUPLICATE OF imp-36105 (completed). The two-axis W1 accumulator-ratio recovery-width ' +
    'viz-data module imp-36123 asks for -- baked alpha/beta recovery edges against the ' +
    'imp-35812 baseline and imp-35991 basin edge -- already exists as ' +
    'IMP36105_RECOVERY_WIDTH_VIZ_DATA / IMP36105_AXIS_EDGES. No new module built; this ' +
    'module only records the duplication and cross-references the original.',
  duplicateTicketId: DUPLICATE_TICKET_ID,
  originalTicketId: ORIGINAL_TICKET_ID,
  originalTicketStatus: ORIGINAL_TICKET_STATUS,
  isRigorous: false,
  verdict:
    'AUDIT FINDING (not a measurement of a mathematical quantity). imp-36123 duplicates the ' +
    'already-completed imp-36105; no code change made here beyond recording the finding. ' +
    'Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36105-recovery-detuning-width-viz-data.js (the completed original); ' +
    'imp-36061-w1-accumulator-recovery-detuning-width.js (shared source measurement).',
};

export const IMP36123_DUPLICATE_TICKET_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36123-duplicate-of-completed-original',
    description: 'imp-36123 is recorded as a duplicate of the completed imp-36105',
    holds: () =>
      IMP36123_DUPLICATE_TICKET_HONEST_STATUS.originalTicketId === 'imp-36105' &&
      IMP36123_DUPLICATE_TICKET_HONEST_STATUS.originalTicketStatus === 'completed',
  },
  {
    id: 'imp36123-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36123_DUPLICATE_TICKET_HONEST_STATUS.isRigorous === false &&
      /NO QED/.test(IMP36123_DUPLICATE_TICKET_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(IMP36123_DUPLICATE_TICKET_HONEST_STATUS.verdict),
  },
];

for (const a of IMP36123_DUPLICATE_TICKET_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36123-duplicate-ticket-honest-status assertion failed: ${a.id}`);
  }
}

export default IMP36123_DUPLICATE_TICKET_HONEST_STATUS;
