/**
 * @module imp-36107-duplicate-ticket-honest-status
 *
 * imp-36107 (content, sonnet-4-6, sonnet): honest-status finding that ticket imp-36107 itself
 * duplicates an already-completed ticket, imp-36125.
 *
 * FINDING. imp-36107 asked to "add a standalone honest-status MEASUREMENT-ONLY note recording
 * the imp-36061 finding that the accumulator run-time-monitor safety window is
 * FREQUENCY-CONTINGENT and ASYMMETRIC: recovering the imp-35812 baseline ratio needs an
 * order-wider detuning than the imp-35991 r&lt;1e-2 basin, with the baseline cancellation carried
 * by alpha detuning not sqrt-drift". That exact note was already delivered as imp-36125
 * (status: completed, completedByModel: sonnet-4-6) -- see
 * IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS in
 * imp-36125-w1-accumulator-recovery-margin-honest-status.js, which restates the identical
 * ~16x (alpha) / ~12x (beta) widening factors over the imp-35991 basin edge, the identical
 * axis asymmetry (alpha recovery edge just inside the baseline detuning; beta recovery edge
 * beyond the baseline beta, drift-alone under-recovering to ~1.65 r_base), and the identical
 * precision-not-binding gamma_{N-1} ~ 5.4e-11 corner case. imp-36107 is therefore a stale
 * duplicate of imp-36125, not new scope -- no new derivation is made here.
 *
 * WHY THIS DUPLICATE WAS SEEDED. Both tickets were seeded from the same imp-36061 source
 * finding by the frontier-scout ticket generator, one titled around the "run-time-monitoring
 * detuning margin ... ASYMMETRIC across the two axes" framing (imp-36125) and one around the
 * "run-time-monitor safety window is FREQUENCY-CONTINGENT and ASYMMETRIC" framing (imp-36107)
 * -- close paraphrases of the same underlying imp-36061 result rather than two distinct facts.
 * This module records the duplication so a reader landing on imp-36107 is pointed straight at
 * imp-36125 instead of a second copy of the same restatement.
 *
 * Meta finding only; no bound touched; no code path changed; NO QED. No refereed bound is changed.
 *
 * @see imp-36125-w1-accumulator-recovery-margin-honest-status (the already-completed note this ticket duplicates)
 * @see imp-36061-w1-accumulator-recovery-detuning-width.js (source finding both tickets restate)
 * @see imp-36106-duplicate-ticket-honest-status.js (structural precedent for this duplicate-ticket pattern)
 */

const DUPLICATE_TICKET_ID = 'imp-36107';
const ORIGINAL_TICKET_ID = 'imp-36125';
const ORIGINAL_TICKET_STATUS = 'completed';

export const IMP36107_DUPLICATE_TICKET_HONEST_STATUS = {
  id: 'imp-36107',
  proofSection: 'audit',
  question:
    'Does imp-36107 request new scope, or does it duplicate an already-completed ticket?',
  verdictShort:
    'DUPLICATE OF imp-36125 (completed). The standalone honest-status note imp-36107 asks for ' +
    '-- restating the imp-36061 frequency-contingent, asymmetric run-time-monitor margin finding ' +
    '-- already exists as IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS. No new note ' +
    'derived; this module only records the duplication and cross-references the original.',
  duplicateTicketId: DUPLICATE_TICKET_ID,
  originalTicketId: ORIGINAL_TICKET_ID,
  originalTicketStatus: ORIGINAL_TICKET_STATUS,
  isRigorous: false,
  verdict:
    'AUDIT FINDING (not a measurement of a mathematical quantity). imp-36107 duplicates the ' +
    'already-completed imp-36125; no code change made here beyond recording the finding. ' +
    'Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36125-w1-accumulator-recovery-margin-honest-status (the completed original); ' +
    'imp-36061-w1-accumulator-recovery-detuning-width.js (shared source finding).',
};

export const IMP36107_DUPLICATE_TICKET_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36107-duplicate-of-completed-original',
    description: 'imp-36107 is recorded as a duplicate of the completed imp-36125',
    holds: () =>
      IMP36107_DUPLICATE_TICKET_HONEST_STATUS.originalTicketId === 'imp-36125' &&
      IMP36107_DUPLICATE_TICKET_HONEST_STATUS.originalTicketStatus === 'completed',
  },
  {
    id: 'imp36107-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36107_DUPLICATE_TICKET_HONEST_STATUS.isRigorous === false &&
      /NO QED/.test(IMP36107_DUPLICATE_TICKET_HONEST_STATUS.verdict) &&
      /refereed bound is changed/i.test(IMP36107_DUPLICATE_TICKET_HONEST_STATUS.verdict),
  },
];

for (const a of IMP36107_DUPLICATE_TICKET_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36107-duplicate-ticket-honest-status assertion failed: ${a.id}`);
  }
}

export default IMP36107_DUPLICATE_TICKET_HONEST_STATUS;
